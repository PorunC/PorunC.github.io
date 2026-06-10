import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePosts = path.resolve(projectRoot, '../recovered-porunc-blog/source/_posts');
const publicRoot = path.resolve(projectRoot, '../PorunC.github.io');
const targetPosts = path.resolve(projectRoot, 'src/content/blog');
const reportPath = path.resolve(projectRoot, 'migration-report.json');

function decodeHtml(value) {
  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }
    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

function htmlCodeToText(value) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  ).replace(/\n$/, '');
}

function normalizeLanguage(language, code) {
  if (!language || language === 'plain') return '';
  if (language === 'py') return 'python';
  if (language === 'sh') return 'bash';
  if (language === 'c' && /(?:std::|#include\s*<iostream>|optional<|class\s+\w+)/.test(code)) {
    return 'cpp';
  }
  return language;
}

async function extractCodeBlocks(route) {
  if (!route) return [];
  const htmlPath = path.join(publicRoot, ...route.split('/'), 'index.html');
  let html;
  try {
    html = await fs.readFile(htmlPath, 'utf8');
  } catch {
    return [];
  }

  const blocks = [];
  const figurePattern = /<figure class="highlight([^"]*)">([\s\S]*?)<\/figure>/g;
  let figureMatch;

  while ((figureMatch = figurePattern.exec(html))) {
    const [, classList, figureHtml] = figureMatch;
    const codeMatch = figureHtml.match(/<td class="code"><pre>([\s\S]*?)<\/pre><\/td>/);
    if (!codeMatch) continue;

    const code = htmlCodeToText(codeMatch[1]);
    const htmlLanguage = classList.trim().split(/\s+/).find(Boolean) ?? '';
    const language = normalizeLanguage(htmlLanguage, code);
    blocks.push({
      code,
      language,
      lineCount: code.split('\n').length,
    });
  }

  return blocks;
}

function normalizeRecoveredCodeTables(content, codeBlocks, sourceName, report) {
  let cursor = 0;
  const used = new Set();

  return content.replace(
    /(^|\n)\|\s*\|\s*\|\n\|\s*---\s*\|\s*---\s*\|\n\| ``` ([\d\s]+)``` \| ``` [^\n]*?``` \|(?=\n|$)/g,
    (match, prefix, lineNumbers) => {
      const expectedLineCount = lineNumbers.trim().split(/\s+/).length;
      let blockIndex = -1;

      for (let index = cursor; index < codeBlocks.length; index += 1) {
        if (!used.has(index) && codeBlocks[index].lineCount === expectedLineCount) {
          blockIndex = index;
          break;
        }
      }

      if (blockIndex === -1) {
        for (let index = cursor; index < codeBlocks.length; index += 1) {
          if (!used.has(index)) {
            blockIndex = index;
            break;
          }
        }
      }

      if (blockIndex === -1) {
        report.unrecoveredCodeTables.push({ source: sourceName, expectedLineCount });
        return match;
      }

      used.add(blockIndex);
      cursor = blockIndex + 1;
      report.recoveredCodeTables += 1;

      const block = codeBlocks[blockIndex];
      const fenceInfo = block.language ? block.language : '';
      return `${prefix}\`\`\`${fenceInfo}\n${block.code}\n\`\`\``;
    },
  );
}

function normalizeList(value) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => String(item).trim()).filter(Boolean);
}

function toIso(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value).replace(' ', 'T') + 'Z');
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~|[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('|'));
  const text = stripMarkdown(lines.join(' '));
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

async function collectOldRoutes() {
  const routes = new Map();

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.name !== 'index.html') continue;
      const relative = path.relative(publicRoot, fullPath).split(path.sep);
      if (relative.length !== 5) continue;
      const [year, month, day, slug] = relative;
      if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) {
        continue;
      }
      routes.set(slug, `${year}/${month}/${day}/${slug}`);
    }
  }

  await walk(publicRoot);
  return routes;
}

async function migrate() {
  const oldRoutes = await collectOldRoutes();
  const entries = await fs.readdir(sourcePosts, { withFileTypes: true });
  await fs.rm(targetPosts, { recursive: true, force: true });
  await fs.mkdir(targetPosts, { recursive: true });

  const report = {
    migrated: 0,
    missingRoutes: [],
    posts: [],
    recoveredCodeTables: 0,
    unrecoveredCodeTables: [],
  };

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const sourcePath = path.join(sourcePosts, entry.name);
    const stem = path.basename(entry.name, '.md');
    const source = await fs.readFile(sourcePath, 'utf8');
    const parsed = matter(source);
    const route = oldRoutes.get(stem);
    if (!route) report.missingRoutes.push(stem);
    const codeBlocks = await extractCodeBlocks(route);
    const content = normalizeRecoveredCodeTables(
      parsed.content.trimStart(),
      codeBlocks,
      entry.name,
      report,
    );

    const data = {
      title: String(parsed.data.title ?? stem),
      date: toIso(parsed.data.date),
      updated: toIso(parsed.data.updated),
      tags: normalizeList(parsed.data.tags),
      categories: normalizeList(parsed.data.categories ?? parsed.data.category),
      slug: route ?? stem,
      oldUrl: route ? `/${route}/` : undefined,
      excerpt: buildExcerpt(content),
    };

    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== ''),
    );
    const output = matter.stringify(content, cleanedData);
    const targetPath = path.join(targetPosts, entry.name);
    await fs.writeFile(targetPath, output);

    report.migrated += 1;
    report.posts.push({ source: entry.name, slug: cleanedData.slug });
  }

  report.posts.sort((a, b) => a.source.localeCompare(b.source, 'zh-CN'));
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Migrated ${report.migrated} posts to ${path.relative(projectRoot, targetPosts)}`);
  console.log(`Recovered ${report.recoveredCodeTables} code tables`);
  if (report.missingRoutes.length > 0) {
    console.warn(`Missing old routes for ${report.missingRoutes.length} posts`);
  }
  if (report.unrecoveredCodeTables.length > 0) {
    console.warn(`Unrecovered code tables: ${report.unrecoveredCodeTables.length}`);
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
