# PorunC Blog

This repository contains the Astro source for `www.misaka-9982.com`.

## Development

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The production site is generated into `dist/`. Static files in `public/`,
including `public/CNAME`, are copied into the build output.

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on every push to
`master`. The workflow lives at `.github/workflows/deploy.yml`.

If GitHub Pages is not already configured for Actions, set the repository's
Pages source to `GitHub Actions` in the GitHub repository settings.
