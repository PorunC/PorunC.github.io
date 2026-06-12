---
title: '6.S081-Lab 2: System Calls'
date: '2023-03-14T09:46:30.000Z'
updated: '2023-03-15T07:21:34.000Z'
tags:
  - OS
  - 6.S081
categories: []
slug: 2023/03/14/6-S081-Lab-2-System-Calls
oldUrl: /2023/03/14/6-S081-Lab-2-System-Calls/
excerpt: >-
  官方材料：<https://pdos.csail.mit.edu/6.S081/2021/labs/syscall.html 参考材料：
  <https://th0ar.gitbooks.io/xv6 chinese/content/ <https://mit public courses cn
  translatio.gitbook.io/mit6 s081/...
---
- 官方材料：<https://pdos.csail.mit.edu/6.S081/2021/labs/syscall.html>
- 参考材料：
  - <https://th0ar.gitbooks.io/xv6-chinese/content/>
  - <https://mit-public-courses-cn-translatio.gitbook.io/mit6-s081/>

> 在开始编码之前，请阅读xv6书籍的第2章、第4章的4.3和4.4节以及相关的源文件:  
> 将系统调用路由到内核的用户空间“stubs”位于 `user/usys.S`，在运行make时由 `user/usys.pl`生成。声明在 `user/user.h` 中  
> 将系统调用路由到实现它的内核函数的内核空间代码位于 `kernel/syscall.c` 和 `kernel/syscall.h` 中。  
> 与进程相关的代码是 `kernel/proc.h` 和 `kernel/proc.c` 。

要向xv6添加新的系统调用，您需要修改几个文件：  
在 `kernel/syscall.h`中定义系统调用号。在xv6中的惯例是给每个系统调用一个以`SYS_` 开头并以小写字母表示该系统调用名称结尾的数字。例如，获取进程ID的系统调用被定义为 `SYS_getpid`。  
在 `kernel/syscall.c` 中添加一个新的内核函数来实现该系统调用。此函数使用`copyin()` 函数从用户空间获取参数，并使用 `copyout()` 函数将结果返回到用户空间。请注意验证用户指针并在无效时返回错误。  
在 `user/usys.S` 中添加一个用户空间存根（stub）。存根应将系统调用号推送到堆栈上，然后使用ecall指令转换到内核模式。参数数量和类型取决于所需的系统调用。  
在`user/user.h`中声明该系统调用。此声明应与内核函数原型匹配，并包括该系统调用号。  
最后，在 `user/user.c` 中添加一个用户空间包装器(wrapper)函数，它使用在`user/usys.S` 中定义的包装器(wrapper) 函数来 调 用 系 统 调 试 。 此 包 装 器 (wrapper) 函 数 应 按 相 同 的 订 单 接 受 内 核 函 数 的 参数 并 返回 结 果。  
进行这些更改后，您需要运行 make 重新构建内核和用户空间二进制文件。完成之后，您可以编写一个测试程序来调用您新创建的 系统 调 试 ， 并 在 xv6 中 运 行 它 。

## System call tracing ([moderate](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> In this assignment you will add a system call tracing feature that may help you when debugging later labs. You’ll create a new `trace` system call that will control tracing. It should take one argument, an integer “mask”, whose bits specify which system calls to trace. For example, to trace the fork system call, a program calls `trace(1 << SYS_fork)`, where `SYS_fork` is a syscall number from `kernel/syscall.h`. You have to modify the xv6 kernel to print out a line when each system call is about to return, if the system call’s number is set in the mask. The line should contain the process id, the name of the system call and the return value; you don’t need to print the system call arguments. The `trace` system call should enable tracing for the process that calls it and any children that it subsequently forks, but should not affect other processes.

由于 xv6 内核是一个操作系统，因此它包含内核代码和用户级代码。用户级代码通常编写为用户级进程，使用系统调用来与内核进行通信。

在本次任务中，您需要修改 xv6 内核来实现一个新的系统调用，以及一个用户级程序来调用该系统调用。下面是一些提示，以帮助您完成此任务：

1. 在 Makefile 中添加 `$U/_trace` 到 `UPROGS`，以便编译 trace 程序。



```
 UPROGS=
	$U/_cat
	$U/_echo
	$U/_forktest
	$U/_grep
	$U/_init
	$U/_kill
	$U/_ln
	$U/_ls
	$U/_mkdir
	$U/_rm
	$U/_sh
	$U/_stressfs
	$U/_usertests
	$U/_wc
	$U/_zombie
	$U/_trace
```
```

2. 修改 `user/user.h`，添加 trace 系统调用的函数原型。


```
```
 // system calls int fork(void);
int exit(int) __attribute__((noreturn));
int wait(int*);
int pipe(int*);
int write(int, const void*, int);
int read(int, void*, int);
int close(int);
int kill(int);
int exec(const char*, char**);
int open(const char*, int);
int mknod(const char*, short, short);
int unlink(const char*);
int fstat(int fd, struct stat*);
int link(const char*, const char*);
int mkdir(const char*);
int chdir(const char*);
int dup(int);
int getpid(void);
char* sbrk(int);
int sleep(int);
int uptime(void);
int trace(int);
// <--- Here!
```
```

3. 在 `user/usys.pl` 中添加对 trace 系统调用的支持。


```
```
 entry("fork");
entry("exit");
entry("wait");
entry("pipe");
entry("read");
entry("write");
entry("close");
entry("kill");
entry("exec");
entry("open");
entry("mknod");
entry("unlink");
entry("fstat");
entry("link");
entry("mkdir");
entry("chdir");
entry("dup");
entry("getpid");
entry("sbrk");
entry("sleep");
entry("uptime");
entry("trace");
// <--- Here!
```
```


   运行后会生成汇编文件



```
```
  .global trace trace:  li a7, SYS_trace  ecall  ret
```
```

4. 在 `kernel/syscall.h` 中添加 trace 系统调用的号码。



```
```
 // System call numbers
#define SYS_fork    1
#define SYS_exit    2
#define SYS_wait    3
#define SYS_pipe    4
#define SYS_read    5
#define SYS_kill    6
#define SYS_exec    7
#define SYS_fstat   8
#define SYS_chdir   9
#define SYS_dup    10
#define SYS_getpid 11
#define SYS_sbrk   12
#define SYS_sleep  13
#define SYS_uptime 14
#define SYS_open   15
#define SYS_write  16
#define SYS_mknod  17
#define SYS_unlink 18
#define SYS_link   19
#define SYS_mkdir  20
#define SYS_close  21
#define SYS_trace  22 // <--- Here
```
```

5. 在 `kernel/syscall.c` 中添加一个数组，用于将系统调用号码映射到名称。例如：


```
```
 static char* syscalls_name[] = {
  [SYS_fork]    "syscall fork",
  [SYS_exit]    "syscall exit",
  [SYS_wait]    "syscall wait",
  [SYS_pipe]    "syscall pipe",
  [SYS_read]    "syscall read",
  [SYS_kill]    "syscall kill",
  [SYS_exec]    "syscall exec",
  [SYS_fstat]   "syscall fstat",
  [SYS_chdir]   "syscall chdir",
  [SYS_dup]     "syscall dup",
  [SYS_getpid]  "syscall getpid",
  [SYS_sbrk]    "syscall sbrk",
  [SYS_sleep]   "syscall sleep",
  [SYS_uptime]  "syscall uptime",
  [SYS_open]    "syscall open",
  [SYS_write]   "syscall write",
  [SYS_mknod]   "syscall mknod",
  [SYS_unlink]  "syscall unlink",
  [SYS_link]    "syscall link",
  [SYS_mkdir]   "syscall mkdir",
  [SYS_close]   "syscall close",
  [SYS_trace]   "syscall trace",
```
```

6. 用 extern 全局声明新的内核调用函数，并且在 syscalls 映射表中，加入从前面定义的编号到系统调用函数指针的映射


```
```
  // Prototypes for the functions that handle system calls. extern uint64 sys_fork(void);
extern uint64 sys_exit(void);
extern uint64 sys_wait(void);
extern uint64 sys_pipe(void);
extern uint64 sys_read(void);
extern uint64 sys_kill(void);
extern uint64 sys_exec(void);
extern uint64 sys_fstat(void);
extern uint64 sys_chdir(void);
extern uint64 sys_dup(void);
extern uint64 sys_getpid(void);
extern uint64 sys_sbrk(void);
extern uint64 sys_sleep(void);
extern uint64 sys_uptime(void);
extern uint64 sys_open(void);
extern uint64 sys_write(void);
extern uint64 sys_mknod(void);
extern uint64 sys_unlink(void);
extern uint64 sys_link(void);
extern uint64 sys_mkdir(void);
extern uint64 sys_close(void);
extern uint64 sys_trace(void);
// <--- Here
// An array mapping syscall numbers from syscall.h to the function that handles the system call.
static uint64 (*syscalls[])(void) = {
  [SYS_fork]    sys_fork,
  [SYS_exit]    sys_exit,
  [SYS_wait]    sys_wait,
  [SYS_pipe]    sys_pipe,
  [SYS_read]    sys_read,
  [SYS_kill]    sys_kill,
  [SYS_exec]    sys_exec,
  [SYS_fstat]   sys_fstat,
  [SYS_chdir]   sys_chdir,
  [SYS_dup]     sys_dup,
  [SYS_getpid]  sys_getpid,
  [SYS_sbrk]    sys_sbrk,
  [SYS_sleep]   sys_sleep,
  [SYS_uptime]  sys_uptime,
  [SYS_open]    sys_open,
  [SYS_write]   sys_write,
  [SYS_mknod]   sys_mknod,
  [SYS_unlink]  sys_unlink,
  [SYS_link]    sys_link,
  [SYS_mkdir]   sys_mkdir,
  [SYS_close]   sys_close,
  [SYS_trace]   sys_trace, // <--- Here };
```
```

7. 在 `kernel/proc.h` 中給`proc` 结构体添加 `mask` 字段



```c
```
 uint64 mask;
```
```

8. 在 `kernel/sysproc.c` 中添加 `sys_trace()` 函数，该函数用于实现新的 trace 系统调用。在该函数中，将传递给 trace 系统调用的参数保存到进程的 proc 结构中。


```c
```
 uint64 sys_trace(void) {
  int mask;
  argint(0, &mask);
  struct proc *p = myproc();
  p->mask = mask;
  return 0;
 }
```
```

9. 修改 `kernel/proc.c` 中的 `fork()` 函数，以便将父进程的跟踪掩码复制到子进程中。


```c
```
// Create a new process, copying the parent.
// Sets up child kernel stack to return as if from fork() system call.
int fork(void) {
  int i, pid;
  struct proc *np;
  struct proc *p = myproc();

  // Allocate process.
  if ((np = allocproc()) == 0) {
    return -1;
  }

  // Copy user memory from parent to child.
  if (uvmcopy(p->pagetable, np->pagetable, p->sz) < 0) {
    freeproc(np);
    release(&np->lock);
    return -1;
  }
  np->sz = p->sz;

  np->mask = p->mask;

  // copy saved user registers.
  *(np->trapframe) = *(p->trapframe);

  // Cause fork to return 0 in the child.
  np->trapframe->a0 = 0;

  // increment reference counts on open file descriptors.
  for (i = 0; i < NOFILE; i++)
    if (p->ofile[i])
      np->ofile[i] = filedup(p->ofile[i]);
  np->cwd = idup(p->cwd);
  safestrcpy(np->name, p->name, sizeof(p->name));

  pid = np->pid;

  release(&np->lock);
  acquire(&wait_lock);
  np->parent = p;
  release(&wait_lock);
  acquire(&np->lock);
  np->state = RUNNABLE;
  release(&np->lock);
  return pid;
}
```
```

10. 修改 `kernel/syscall.c` 中的 `syscall()` 函数，以在需要时输出跟踪信息。


```c
```
void syscall(void) {
  int num;
  struct proc *p = myproc();
  num = p->trapframe->a7;
  if (num > 0 && num < NELEM(syscalls) && syscalls[num]) {
    // Use num to lookup the system call function for num, call it,
    // and store its return value in p->trapframe->a0
    p->trapframe->a0 = syscalls[num]();
    if ((p->mask >> num) & 0b1) {
      printf("%d: %s -> %d\n",
              p->pid, syscalls_name[num], p->trapframe->a0);
    }
  } else {
    printf("%d %s: unknown sys call %d\n",
            p->pid, p->name, num);
    p->trapframe->a0 = -1;
  }
}
```
```

11. 实现 `user/trace.c` 程序。该程序应该在新的进程中调用 trace 系统调用，然后运行另一个程序，以便跟踪指定的系统调用。在实现 `user/trace.c` 时，您需要使用 `fork()` 和 `exec()` 系统调用来运行其他程序。

### Answer

- 代码改动见 [commit](https://github.com/Misaka-9982-coder/6.S081-fa22/commit/ae04ca710cffb55e2b8cd217df1c6c15328cab44)

## Sysinfo ([moderate](https://pdos.csail.mit.edu/6.S081/2022/labs/guidance.html))

> In this assignment you will add a system call, `sysinfo`, that collects information about the running system. The system call takes one argument: a pointer to a `struct sysinfo` (see `kernel/sysinfo.h`). The kernel should fill out the fields of this struct: the `freemem` field should be set to the number of bytes of free memory, and the `nproc` field should be set to the number of processes whose `state` is not `UNUSED`. We provide a test program `sysinfotest`; you pass this assignment if it prints “sysinfotest: OK”.

1. 在 `kernel/sysinfo.h` 中声明 `struct sysinfo` 结构体，并包含两个字段： `uint64_t freemem` 和 `uint64_t nproc`.


```c
```
struct sysinfo {
  uint64 freemem;   // amount of free memory (bytes)
  uint64 nproc;     // number of process
};
```
```

2. `usys.pl`


```
```
 entry("fork");
entry("exit");
entry("wait");
entry("pipe");
entry("read");
entry("write");
entry("close");
entry("kill");
entry("exec");
entry("open");
entry("mknod");
entry("unlink");
entry("fstat");
entry("link");
entry("mkdir");
entry("chdir");
entry("dup");
entry("getpid");
entry("sbrk");
entry("sleep");
entry("uptime");
entry("trace");
entry("sysinfo");

```
```

3. `user.h`


```
```
 // system calls int fork(void);
int exit(int) __attribute__((noreturn));
int wait(int*);
int pipe(int*);
int write(int, const void*, int);
int read(int, void*, int);
int close(int);
int kill(int);
int exec(const char*, char**);
int open(const char*, int);
int mknod(const char*, short, short);
int unlink(const char*);
int fstat(int fd, struct stat*);
int link(const char*, const char*);
int mkdir(const char*);
int chdir(const char*);
int dup(int);
int getpid(void);
char* sbrk(int);
int sleep(int);
int uptime(void);
int trace(int);
struct sysinfo;
int sysinfo(struct sysinfo *);

```
```

4. 在 `kernel/syscall.h` 中添加一个名为 `sysinfo()` 的原型和一个新的系统调用号。



```
```
 // System call numbers
#define SYS_fork    1
#define SYS_exit    2
#define SYS_wait    3
#define SYS_pipe    4
#define SYS_read    5
#define SYS_kill    6
#define SYS_exec    7
#define SYS_fstat   8
#define SYS_chdir   9
#define SYS_dup    10
#define SYS_getpid 11
#define SYS_sbrk   12
#define SYS_sleep  13
#define SYS_uptime 14
#define SYS_open   15
#define SYS_write  16
#define SYS_mknod  17
#define SYS_unlink 18
#define SYS_link   19
#define SYS_mkdir  20
#define SYS_close  21
#define SYS_trace  22
#define SYS_sysinfo  23
```
```

5. 在 `kernel/sysproc.c` 中实现 `sys_sysinfo()` 函数。


```c
```
uint64 sys_sysinfo(void) {
  // user pointer to struct sysinfo
  uint64 si_addr;

  argaddr(0, &si_addr);
  struct sysinfo sysinfo;
  sysinfo.freemem = free_mem_num();
  sysinfo.nproc = num_of_processes();
  if (copyout(myproc()->pagetable, si_addr, (char *)&sysinfo, sizeof(sysinfo)) < 0)
    return -1;

  return 0;
}
```
```

6. 添加一个名为 `free_mem_num()` 的函数到 `kernel/kalloc.c`, 返回系统中空闲内存的字节数。


```c
```
// 统计未使用内存
// 一页等于 4096 bytes
uint64 free_mem_num(void) {
  struct run *r;
  uint64 free_num = 0;

  acquire(&kmem.lock);
  r = kmem.freelist;
  while (r) {
    free_num++;
    r = r->next;
  }
  release(&kmem.lock);
  return free_num * PGSIZE;
}
```
```

7. 添加一个名为 `num_of_processes()` 的函数到 `kernel/proc.c`, 返回状态不是 UNUSED 的进程数量。


```c
```
// used by sysinfo
int num_of_processes(void) {
  int nproc = 0;
  for (struct proc *p = proc; p < &proc[NPROC]; p++) {
    if (p->state != UNUSED)
      nproc++;
  }
  return nproc;
}
```