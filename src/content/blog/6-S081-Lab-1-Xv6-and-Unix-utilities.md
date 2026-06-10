---
title: '6.S081-Lab 1: Xv6 and Unix utilities'
date: '2023-03-09T16:06:35.000Z'
updated: '2023-03-14T08:53:27.000Z'
tags:
  - OS
  - 6.S081
categories: []
slug: 2023/03/10/6-S081-Lab-1-Xv6-and-Unix-utilities
oldUrl: /2023/03/10/6-S081-Lab-1-Xv6-and-Unix-utilities/
excerpt: >-
  官方材料：<https://pdos.csail.mit.edu/6.S081/2021/labs/util.html 参考资料： <https://mit
  public courses cn translatio.gitbook.io/mit6 s081/
  <https://th0ar.gitbooks.io/xv6 chinese/content/ <h...
---
- 官方材料：<https://pdos.csail.mit.edu/6.S081/2021/labs/util.html>
- 参考资料：

  - <https://mit-public-courses-cn-translatio.gitbook.io/mit6-s081/>
  - <https://th0ar.gitbooks.io/xv6-chinese/content/>
  - <https://blog.miigon.net/posts/s081-ending/>
  - <https://wangchujiang.com/linux-command/>

## Boot xv6 ([easy](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

```bash
$ git clone git://g.csail.mit.edu/xv6-labs-2021
Cloning into 'xv6-labs-2021'...
...
$ cd xv6-labs-2021
$ git checkout util
Branch 'util' set up to track remote branch 'util' from 'origin'.
Switched to a new branch 'util'
```

Build and run xv6:

```bash
$ make qemu
riscv64-unknown-elf-gcc    -c -o kernel/entry.o kernel/entry.S
riscv64-unknown-elf-gcc -Wall -Werror -O -fno-omit-frame-pointer -ggdb -DSOL_UTIL -MD -mcmodel=medany -ffreestanding -fno-common -nostdlib -mno-relax -I. -fno-stack-protector -fno-pie -no-pie   -c -o kernel/start.o kernel/start.c
...  
riscv64-unknown-elf-ld -z max-page-size=4096 -N -e main -Ttext 0 -o user/_zombie user/zombie.o user/ulib.o user/usys.o user/printf.o user/umalloc.o
riscv64-unknown-elf-objdump -S user/_zombie > user/zombie.asm
riscv64-unknown-elf-objdump -t user/_zombie | sed '1,/SYMBOL TABLE/d; s/ .* / /; /^$/d' > user/zombie.sym
mkfs/mkfs fs.img README  user/xargstest.sh user/_cat user/_echo user/_forktest user/_grep user/_init user/_kill user/_ln user/_ls user/_mkdir user/_rm user/_sh user/_stressfs user/_usertests user/_grind user/_wc user/_zombie 
nmeta 46 (boot, super, log blocks 30 inode blocks 13, bitmap blocks 1) blocks 954 total 1000
balloc: first 591 blocks have been allocated
balloc: write bitmap block at sector 45
qemu-system-riscv64 -machine virt -bios none -kernel kernel/kernel -m 128M -smp 3 -nographic -drive file=fs.img,if=none,format=raw,id=x0 -device virtio-blk-device,drive=x0,bus=virtio-mmio-bus.0

xv6 kernel is booting

hart 2 starting
hart 1 starting
init: starting sh
$ 
```

`ls` 命令：

```bash
$ ls
.              1 1 1024
..             1 1 1024
README         2 2 2059
xargstest.sh   2 3 93
cat            2 4 24256
echo           2 5 23080
forktest       2 6 13272
grep           2 7 27560
init           2 8 23816
kill           2 9 23024
ln             2 10 22880
ls             2 11 26448
mkdir          2 12 23176
rm             2 13 23160
sh             2 14 41976
stressfs       2 15 24016
usertests      2 16 148456
grind          2 17 38144
wc             2 18 25344
zombie         2 19 22408
console        3 20 0
```

xv6没有`ps`命令，`Ctrl-p`命令可以让kernel打印每个进程的信息

退出 `qemu` : `Ctrl-a x`.

## 编程样例

在实现对应功能后，需要更新Makefile的UPROGS部分，例如实现了sleep.c后，要在UPROGS处追加：

```makefile
$U/_sleep\
```

1. `copy.c`:

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

int
main() {
    char buf[64];

    while(1) {
        int n = read(0, buf, sizeof(buf));
        if(n <= 0) break;
        write(1, buf, n);
    }
    exit(0);
}
```

- 第一个参数是文件描述符，指向一个之前打开的文件。Shell会确保默认情况下，当一个程序启动时，文件描述符0连接到console的输入，文件描述符1连接到了console的输出。所以我可以通过这个程序看到console打印我的输入。当然，这里的程序会预期文件描述符已经被Shell打开并设置好。这里的0，1文件描述符是非常普遍的Unix风格，许多的Unix系统都会从文件描述符0读取数据，然后向文件描述符1写入数据。
- read的第二个参数是指向某段内存的指针，程序可以通过指针对应的地址读取内存中的数据，这里的指针就是代码中的buf参数。在代码第10行，程序在栈里面申请了64字节的内存，并将指针保存在buf中，这样read可以将数据保存在这64字节中。
- read的第三个参数是代码想读取的最大长度，sizeof(buf)表示，最多读取64字节的数据，所以这里的read最多只能从连接到文件描述符0的设备，也就是console中，读取64字节的数据。

2. `open.c`:

```c
#include "kernel/types.h"
#include "user/user.h"
#include "kernel/fcntl.h"

int
main()
{
    int fd = open("output.txt", O_WRONLY | O_CREATE);
    write(fd, "ooo\n", 4);
    exit(0);
}
```

- 代码中的第8行，执行了open系统调用，将文件名output.txt作为参数传入，第二个参数是一些标志位，用来告诉open系统调用在内核中的实现：我们将要创建并写入一个文件。open系统调用会返回一个新分配的文件描述符，这里的文件描述符是一个小的数字，可能是2，3，4或者其他的数字。
- 之后，这个文件描述符作为第一个参数被传到了write，write的第二个参数是数据的指针，第三个参数是要写入的字节数。数据被写入到了文件描述符对应的文件中。
- 文件描述符本质上对应了内核中的一个表单数据。内核维护了每个运行进程的状态，内核会为每一个运行进程保存一个表单，表单的key是文件描述符。这个表单让内核知道，每个文件描述符对应的实际内容是什么。这里比较关键的点是，每个进程都有自己独立的文件描述符空间，所以如果运行了两个不同的程序，对应两个不同的进程，如果它们都打开一个文件，它们或许可以得到相同数字的文件描述符，但是因为内核为每个进程都维护了一个独立的文件描述符空间，这里相同数字的文件描述符可能会对应到不同的文件。

3. `fork.c`:

```c
#include "kernel/types.h"
#include "user/user.h"

int
main()
{
    int pid;
    pid = fork();
    printf("fork() returned %d\n", pid);

    if(pid == 0) {
        printf("child\n");
    } else {
        printf("parent\n");
    }
    exit(0);
}
```

- fork会拷贝当前进程的内存，并创建一个新的进程，这里的内存包含了进程的指令和数据。之后，我们就有了两个拥有完全一样内存的进程。fork系统调用在两个进程中都会返回，在原始的进程中，fork系统调用会返回大于0的整数，这个是新创建进程的ID。而在新创建的进程中，fork系统调用会返回0。所以即使两个进程的内存是完全一样的，我们还是可以通过fork的返回值区分旧进程和新进程。
- 在第11行，你可以看到代码检查pid。如果pid等于0，那么这必然是子进程。在我们的例子中，调用进程通常称为父进程，父进程看到的pid必然大于0。所以父进程会打印“parent”，子进程会打印“child”。之后两个进程都会退出。

```bash
$ fork
fork() returned 5
parent
$ fork() returned 0
child
```

4. `redirected.c`:

```c
#include "kernel/types.h"
#include "kernel/fcntl.h"
#include "user/user.h"

int main()
{
    int pid;
    pid = fork();
    if(pid == 0) {
        close(1);
        open("output.txt", O_WRONLY|O_CREATE);

        char *argv[] = {"echo", "this", "is", "redirected", "echo", 0};
        exec("echo", argv);
        printf("exec failed!\n");
        exit(1);
    } else {
        wait((int*) 0);
    }
    exit(0);
}
```

```bash
$ redirected
$ cat output.txt
this is redirected echo
```

## sleep ([easy](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> Implement the UNIX program `sleep` for xv6; your `sleep` should pause for a user-specified number of ticks. A tick is a notion of time defined by the xv6 kernel, namely the time between two interrupts from the timer chip. Your solution should be in the file `user/sleep.c`.

Some hints:

- Before you start coding, read Chapter 1 of the [xv6 book](https://pdos.csail.mit.edu/6.S081/2021/xv6/book-riscv-rev2.pdf).
- Look at some of the other programs in `user/` (e.g., `user/echo.c`, `user/grep.c`, and `user/rm.c`) to see how you can obtain the command-line arguments passed to a program.
- If the user forgets to pass an argument, sleep should print an error message.
- The command-line argument is passed as a string; you can convert it to an integer using `atoi` (see user/ulib.c).
- Use the system call `sleep`.
- See `kernel/sysproc.c` for the xv6 kernel code that implements the `sleep` system call (look for `sys_sleep`), `user/user.h` for the C definition of `sleep` callable from a user program, and `user/usys.S` for the assembler code that jumps from user code into the kernel for `sleep`.
- Make sure `main` calls `exit()` in order to exit your program.
- Add your `sleep` program to `UPROGS` in Makefile; once you’ve done that, `make qemu` will compile your program and you’ll be able to run it from the xv6 shell.
- Look at Kernighan and Ritchie’s book *The C programming language (second edition)* (K&R) to learn about C.

`sleep.c`:

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

int
main(int argc, char *argv[])
{
    if(argc < 2) {
        fprintf(2, "Please enter a number!\n");
        exit(1);
    }
    int time = atoi(argv[1]);
    sleep(time);
    exit(0);
}
```

测试：

```bash
$ sudo ./grade-lab-util sleep
make: “kernel/kernel”已是最新。
== Test sleep, no arguments == sleep, no arguments: OK (1.5s) 
== Test sleep, returns == sleep, returns: OK (0.9s) 
== Test sleep, makes syscall == sleep, makes syscall: OK (0.9s) 
```

## pingpong ([easy](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> Write a program that uses UNIX system calls to ‘‘ping-pong’’ a byte between two processes over a pair of pipes, one for each direction. The parent should send a byte to the child; the child should print “: received ping”, where  is its process ID, write the byte on the pipe to the parent, and exit; the parent should read the byte from the child, print “: received pong”, and exit. Your solution should be in the file `user/pingpong.c`.

Some hints:

- Use `pipe` to create a pipe.
- Use `fork` to create a child.
- Use `read` to read from the pipe, and `write` to write to the pipe.
- Use `getpid` to find the process ID of the calling process.
- Add the program to `UPROGS` in Makefile.
- User programs on xv6 have a limited set of library functions available to them. You can see the list in `user/user.h`; the source (other than for system calls) is in `user/ulib.c`, `user/printf.c`, and `user/umalloc.c`.

管道参考资料：

- <https://blog.csdn.net/qq_42914528/article/details/82023408>

pipe 输入为长度为2的 int 数组 p， 其中 p[0] 为对应的输入文件描述符，p[1] 为对应的输出文件描述符

样例：

```c
int p[2];
char *argv[2];
argv[0] = "wc";
argv[1] = 0;
pipe(p);
if(fork() == 0) {
    close(0);
    dup(p[0]);
    close(p[0]);
    close(p[1]);
    exec("/bin/wc", argv);
} else {
    close(p[0]);
    write(p[1], "hello world\n", 12);
    close(p[1]);
}
```

`pingpong.c`:

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

#define END_READ   0
#define END_WRITE  1

int
main(int argc, char *argv[])
{
  int p2c[2], c2p[2];

  pipe(p2c);  // 创建用于 父进程 -> 子进程 的管道
  pipe(c2p);  // 创建用于 子进程 -> 父进程 的管道

  if(fork() != 0) {
    char buf[2];

    // 1. 父进程 首先向 子进程 发送字节
    if(write(p2c[END_WRITE], "!", 1) != 1) {
      fprintf(2, "failed to write in parent\n");
      exit(1);
    }

    close(p2c[END_WRITE]);
    wait(0);

    // 2. 父进程 发送完成后，开始等待 子进程 的回复
    if(read(c2p[END_READ], buf, 1) != 1) {
        fprintf(2, "failed to read in parent");
        exit(1);
    }

    // 5. 子进程 收到数据， read 返回， 输出 pong
    printf("%d: received pong\n", getpid());
    close(p2c[END_READ]);
  } else {
    char buf[2];

    // 3. 子进程 读取管道， 收到 父进程 发送的字节数据
    if(read(p2c[END_READ], buf, 1) != 1) {
      fprintf(2, "failed to read in child\n");
      exit(1);
    }

    close(c2p[END_READ]);
    printf("%d: received ping\n", getpid());

    // 4. 子进程 通过 子->父 管道，将字节送回 父进程
    if(write(c2p[END_WRITE], buf, 1) != 1) {
      fprintf(2, "failed to write in child\n");
      exit(1);
    }

    close(c2p[END_WRITE]);
  }

  exit(0);
}
```

该程序是一个基于进程间通信机制的简单 ping-pong 程序，实现了一个父进程向子进程发送 “!” 字节，子进程读取并输出 “received ping”，然后将同样的字节回送给父进程，最后父进程读取回送的字节并输出 “received pong”。

1. 父进程 首先向 子进程 发送字节
2. 父进程 发送完成后，开始等待 子进程 的回复
3. 子进程 读取管道， 收到 父进程 发送的字节数据
4. 子进程 通过 子->父 管道，将字节送回 父进程
5. 子进程 收到数据， read 返回， 输出 pong

其中，使用 `pipe` 系统调用创建管道，使用 `fork` 系统调用创建子进程，`close` 系统调用关闭不需要的管道端口，`read` 系统调用从管道中读取字节，`write` 系统调用向管道中写入字节，使用 `wait` 系统调用等待子进程结束。

测试：

```bash
$ sudo ./grade-lab-util pingpong
make: “kernel/kernel”已是最新。
== Test pingpong == pingpong: OK (1.0s) 
```

## primes ([moderate](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))/([hard](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> Write a concurrent version of prime sieve using pipes. This idea is due to Doug McIlroy, inventor of Unix pipes. The picture halfway down [this page](http://swtch.com/~rsc/thread/) and the surrounding text explain how to do it. Your solution should be in the file `user/primes.c`.

Your goal is to use `pipe` and `fork` to set up the pipeline. The first process feeds the numbers 2 through 35 into the pipeline. For each prime number, you will arrange to create one process that reads from its left neighbor over a pipe and writes to its right neighbor over another pipe. Since xv6 has limited number of file descriptors and processes, the first process can stop at 35.

Some hints:

- Be careful to close file descriptors that a process doesn’t need, because otherwise your program will run xv6 out of resources before the first process reaches 35.
- Once the first process reaches 35, it should wait until the entire pipeline terminates, including all children, grandchildren, &c. Thus the main primes process should only exit after all the output has been printed, and after all the other primes processes have exited.
- Hint: `read` returns zero when the write-side of a pipe is closed.
- It’s simplest to directly write 32-bit (4-byte) `int`s to the pipes, rather than using formatted ASCII I/O.
- You should create the processes in the pipeline only as they are needed.
- Add the program to `UPROGS` in Makefile.

文档链接：<https://swtch.com/~rsc/thread/>

多线程埃氏筛

```plaintext
p = get a number from left neighbor
print p
loop:
    n = get a number from left neighbor
    if (p does not divide n)
        send n to right neighbor
```

单线程埃氏筛CPP实现：

- `primes`数组记录素数
- `st`数组标记数字是否为素数
- 每次遇到素数 `i` 则将范围 $[2 \* i, n]$ 的 `i` 的倍数全部标记

```cpp
#include<iostream>
using namespace std;

const int N = 1e6 + 10;

int primes[N], cnt;
bool st[N];

void get_primes(int n) {
    for(int i = 2; i <= n; i ++ )
        if(!st[i]) {
            primes[cnt ++ ] = i;
            for(int j = i + i; j <= n; j += i)
                st[j] = true;
        }
}

int main() {
    int n;
    cin >> n;
    get_primes(n);
    cout << cnt << endl;
    for(int i = 0; i < cnt; i ++ ) cout << primes[i] << " ";
    cout << endl;
    return 0;
}
```

`primes.c`:

```c
#include "kernel/types.h"
#include "user/user.h"

#define END_READ   0
#define END_WRITE  1

void
sieve(int pipe_l[2])
{
  int prime, cur;
  if(read(pipe_l[END_READ], &prime, sizeof(prime)) != sizeof(prime)) {
    fprintf(2, "failed to read from the pipe_l\n");
    exit(1);
  }

  printf("prime %d\n", prime);

  if(read(pipe_l[END_READ], &cur, sizeof(cur)) == sizeof(cur)) {
    int pipe_r[2];
    pipe(pipe_r);

    if(fork() != 0) {
      do {
        if(cur % prime == 0) {
          continue;
        }

        if(write(pipe_r[END_WRITE], &cur, sizeof(cur)) != sizeof(cur)) {
          fprintf(2, "failed to write into the pipe_r");
          exit(1);
        }
      } while(read(pipe_l[END_READ], &cur, sizeof(cur)) == sizeof(cur));

      close(pipe_r[END_WRITE]);
      close(pipe_l[END_READ]);

      wait(0);
    } else {
      close(pipe_r[END_WRITE]);
      close(pipe_l[END_READ]);
      sieve(pipe_r);
    }
  }

  exit(1);
}

int
main(int argc, char *argv[])
{
  int input[2];
  pipe(input);
  int start = 2, end = 35;

  if(fork() != 0) {
    close(input[END_READ]);

    for(int i = start; i <= end; i ++ ) {
      if(write(input[END_WRITE], &i, sizeof(i)) != sizeof(i)) {
        fprintf(2, "failed to write %d into the pipe in the parent", i);
        exit(1);
      }
    }

    close(input[END_WRITE]);
    wait(0);
  } else {
    close(input[END_WRITE]);
    sieve(input);
  }

  exit(0);
}
```

这段代码实现了一个简单的 Eratosthenes 筛法，用于找出一定范围内的所有素数。

在该程序中，使用了 `kernel/types.h` 和 `user/user.h` 两个头文件，其中 `types.h` 定义了一些基本的数据类型，`user.h` 定义了一些系统调用。

在 `main` 函数中，首先使用 `pipe` 系统调用创建一个管道，用于父子进程之间的通信。然后使用 `fork` 系统调用创建一个新的进程。在父进程中，关闭管道的读端，然后向管道写入一段整数序列（从 start 到 end）。在子进程中，关闭管道的写端，然后调用 `sieve` 函数，开始执行筛法。

在 `sieve` 函数中，首先从管道读入第一个质数 prime，并输出其值。然后在循环中读入管道中的下一个整数 cur，如果 cur 不是 prime 的倍数，则将其写入一个新的管道 pipe\_r 中。然后继续从管道中读入下一个整数，直到读完所有整数。当读完所有整数后，关闭新的管道的写端和原管道的读端，等待子进程结束。

整个程序的逻辑比较简单，主要是父进程向管道中写入整数序列，子进程读取管道中的整数并执行筛法。在筛法过程中，每次从管道中读入一个质数，然后将不是质数的整数写入一个新的管道中。最后，当读完所有整数后，关闭管道并等待子进程结束。

测试：

```bash
$ sudo ./grade-lab-util primes
make: “kernel/kernel”已是最新。
== Test primes == primes: OK (0.8s) 
```

## find ([moderate](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> Write a simple version of the UNIX find program: find all the files in a directory tree with a specific name. Your solution should be in the file `user/find.c`.

Some hints:

- Look at user/ls.c to see how to read directories.
- Use recursion to allow find to descend into sub-directories.
- Don’t recurse into “.” and “…”.
- Changes to the file system persist across runs of qemu; to get a clean file system run make clean and then make qemu.
- You’ll need to use C strings. Have a look at K&R (the C book), for example Section 5.5.
- Note that == does not compare strings like in Python. Use strcmp() instead.
- Add the program to `UPROGS` in Makefile.

`stat.h`:

```c
#define T_DIR     1   // Directory
#define T_FILE    2   // File
#define T_DEVICE  3   // Device

struct stat {
  int dev;     // File system's disk device	//文件系统设备号
  uint ino;    // Inode number				//Inode 值
  short type;  // Type of file				//文件类型
  short nlink; // Number of links to file	//文件被链接数
  uint64 size; // Size of file in bytes		//文件大小
};
```

`dirent`结构体:

`inum`是说这个文件占了几个`inode`,`name`是这个文件的名字。

```c
// Directory is a file containing a sequence of dirent structures.
#define DIRSIZ 14

struct dirent {
  ushort inum;	
  char name[DIRSIZ];
};
```

`ls.c`:

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"
#include "kernel/fs.h"


// 返回 path 最后一个 ‘/’ 后的 字符串
char *
fmtname(char *path)
{
	static char buf[DIRSIZ + 1];
	char *p;

	// Find first character after last slash.
	for (p = path + strlen(path); p >= path && *p != '/'; p--)
		;
	p++;

	// Return blank-padded name.
	// 多余空间用空格填充
	if (strlen(p) >= DIRSIZ)
		return p;
	memmove(buf, p, strlen(p));
	memset(buf + strlen(p), ' ', DIRSIZ - strlen(p));
	return buf;
}

void ls(char *path)
{
	char buf[512], *p;
	int fd;
	struct dirent de;
	struct stat st;

	// 打开 path 文件
	if ((fd = open(path, 0)) < 0)
	{
		fprintf(2, "ls: cannot open %s\n", path);
		return;
	}

	// 返回文件信息
	if (fstat(fd, &st) < 0)
	{
		fprintf(2, "ls: cannot stat %s\n", path);
		close(fd);
		return;
	}

	switch (st.type)
	{
	// 文件
	case T_FILE:
		printf("%s %d %d %l\n", fmtname(path), st.type, st.ino, st.size);
		break;

	// 目录
	case T_DIR:
		if (strlen(path) + 1 + DIRSIZ + 1 > sizeof buf)
		{
			printf("ls: path too long\n");
			break;
		}
		strcpy(buf, path);
		p = buf + strlen(buf);
		*p++ = '/';
		while (read(fd, &de, sizeof(de)) == sizeof(de))
		{
			if (de.inum == 0)
				continue;
			memmove(p, de.name, DIRSIZ);
			p[DIRSIZ] = 0;
			if (stat(buf, &st) < 0)
			{
				printf("ls: cannot stat %s\n", buf);
				continue;
			}
			printf("%s %d %d %d\n", fmtname(buf), st.type, st.ino, st.size);
		}
		break;
	}
	close(fd);
}

int main(int argc, char *argv[])
{
	int i;

	if (argc < 2)
	{
		ls(".");
		exit(0);
	}
	for (i = 1; i < argc; i++)
		ls(argv[i]);
	exit(0);
}

```

ls 命令用于列出指定目录下的文件和子目录信息。该代码实现了一个简化版本的 ls 命令，能够列出指定目录下的文件和子目录信息，并打印文件的类型、inode 号和大小等信息。

该程序接受一个或多个参数，每个参数表示要列出信息的目录或文件路径。如果没有传递参数，则默认列出当前目录下的文件和子目录信息。

在程序中，ls() 函数用于列出指定路径下的文件和子目录信息，具体实现如下：

1. 首先使用 open() 函数打开指定路径的文件或目录，获取文件描述符。
2. 使用 fstat() 函数获取文件或目录的元信息（包括类型、inode 号和大小等）。
3. 根据文件或目录的类型分别处理：

- 如果是文件或设备，则打印文件名、类型、inode 号和大小等信息。
- 如果是目录，则递归读取目录中的子目录和文件，并对其进行处理。对于每个子目录或文件，也会打印文件名、类型、inode 号和大小等信息。

4. 使用 close() 函数关闭文件描述符。

另外，fmtname() 函数用于从完整路径中获取文件名，以便在输出信息中使用。该函数的实现过程是找到路径中最后一个斜线后面的字符，并将其复制到一个缓冲区中。

main() 函数用于解析命令行参数，调用 ls() 函数列出指定路径下的文件和子目录信息。

`find.c`:

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"
#include "kernel/fs.h"

void
find(char *path, char *file)
{
  char buf[512], *p;
  int fd;
  struct dirent de;
  struct stat st;

  if ((fd = open(path, 0)) < 0){
    fprintf(2, "find: cannot open %s\n", path);
    return;
  }

  if (fstat(fd, &st) < 0){
    fprintf(2, "find: cannot stat %s\n", path);
    close(fd);
    return;
  }

  if(strlen(path) + 1 + DIRSIZ + 1 > sizeof buf){
    printf("find: path too long\n");
  }

  strcpy(buf, path);
  p = buf+strlen(buf);
  *p++ = '/';

  while(read(fd, &de, sizeof(de)) == sizeof(de)){
    if(de.inum == 0 || strcmp(de.name, ".") == 0 || strcmp(de.name, "..") == 0)
      continue;
    memmove(p, de.name, DIRSIZ);
    p[DIRSIZ] = 0;
    if(stat(buf, &st) < 0) {
      printf("find: cannot stat %s\n", buf);
      continue;
    }

    if(st.type == T_DIR){
      find(buf, file);
    } else if (st.type == T_FILE){
      if(strcmp(de.name, file) == 0) {
        printf("%s\n", buf);
      }
    }
  }

  close(fd);
}

int
main(int argc, char *argv[])
{
  if (argc != 3){
    fprintf(2, "Usage: find <dir> <file>...\n");
    exit(1);
  }

  find(argv[1], argv[2]);
  exit(0);
}
```

这段代码实现了一个命令行工具 `find`，用于在指定目录下查找指定文件。

首先，包含了四个头文件 `kernel/types.h`、`kernel/stat.h`、`user/user.h` 和 `kernel/fs.h`，分别定义了一些基本数据类型、文件状态、系统调用和文件系统相关的结构体和宏。其中 `find` 函数通过递归实现了对目录的遍历，并通过调用 `stat` 系统调用获取文件状态信息。

在 `main` 函数中，首先判断命令行参数数量是否正确。如果不正确，则输出错误信息并退出；否则调用 `find` 函数进行查找。

在 `find` 函数中，首先通过调用 `open` 和 `fstat` 系统调用打开目录并获取其状态信息。然后通过循环遍历目录中的所有文件，对于每一个文件，首先判断是否为当前目录或父目录，如果不是，则获取其完整路径，并通过调用 `stat` 系统调用获取其状态信息。如果是目录，则递归调用 `find` 函数继续查找；如果是指定的文件，则输出其完整路径。

整个程序的逻辑比较复杂，通过系统调用和文件操作实现了一个较为复杂的命令行工具。这个例子也展示了如何使用文件系统相关的结构体和宏，以及如何通过递归遍历目录来实现文件查找功能。

测试：

```bash
$ sudo ./grade-lab-util find 
make: “kernel/kernel”已是最新。
== Test find, in current directory == find, in current directory: OK (1.3s) 
== Test find, recursive == find, recursive: OK (1.1s) 
```

## xargs ([moderate](https://pdos.csail.mit.edu/6.S081/2021/labs/guidance.html))

> Write a simple version of the UNIX xargs program: read lines from the standard input and run a command for each line, supplying the line as arguments to the command. Your solution should be in the file `user/xargs.c`.

Some hints:

- Use `fork` and `exec` to invoke the command on each line of input. Use `wait` in the parent to wait for the child to complete the command.
- To read individual lines of input, read a character at a time until a newline (‘\n’) appears.
- kernel/param.h declares MAXARG, which may be useful if you need to declare an argv array.
- Add the program to `UPROGS` in Makefile.
- Changes to the file system persist across runs of qemu; to get a clean file system run make clean and then make qemu.

`xargs`效果示例：

```bash
$ echo hello too | xargs echo bye
bye hello too
$
```

```bash
$ echo "1\n2" | xargs -n 1 echo line
line 1
line 2
$
```

```bash
$ find . b | xargs grep hello
```

`xargs`命令介绍：

- <https://wangchujiang.com/linux-command/c/xargs.html>
- <http://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html>

整体思路：

- 将 `xargs` 命令传入的参数保存至数组，形式为`cmd, arg[0], … , arg[k - 1]`；
- 解析输入参数，根据 `\n` 将参数划分至多行；
- 对每行参数根据空格划分，更新参数数组为 `cmd, arg[0], … , arg[k - 1], arg[k], … , arg[k + l - 1]`；
- 利用 `exec` 调用函数；

```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"
#include "kernel/param.h"

int
readline(char *new_argv[MAXARG], int cur)
{
  char buf[1024];
  int n = 0;
  while(read(0, buf + n, 1)) {
    if(n == 1023) {
      fprintf(2, "the argument is too long...\n");
      exit(1);
    }

    if(buf[n] == '\n') break;
    n ++ ;
  }

  buf[n] = '\0';
  if(n == 0) return 0;

  int offset = 0;
  while(offset < n) {
    new_argv[cur ++ ] = buf + offset;
    while(buf[offset] != ' ' && offset < n) {
      offset ++ ;
    }

    while(buf[offset] == ' ' && offset < n) {
      buf[offset ++ ] = '\0';
    }
  }

  return cur;
}

void
run(char *cmd, char *new_argv[])
{
	if(fork() == 0) {
		exec(cmd, new_argv);
    exit(0);
	}
	return;
}

int
main(int argc, char *argv[])
{
	if (argc < 2) {
		fprintf(2, "Usage: xargs command (arg ...)\n");
		exit(1);
	}

  char *cmd = malloc(strlen(argv[1]) + 1);
  char *new_argv[MAXARG];
  strcpy(cmd, argv[1]);

  for(int i = 1; i < argc; i ++ ) {
    new_argv[i - 1] = malloc(strlen(argv[i]) + 1);
    strcpy(new_argv[i - 1], argv[i]);
  }

  int cur = 0;
  while((cur = readline(new_argv, argc - 1)) != 0) {
    new_argv[cur] = '\0';

    run(cmd, new_argv);

    wait(0);
  }

	exit(0);
}
```

这段代码实现了一个类似于 Linux 命令 xargs 的工具，用于将输入作为命令行参数传递给指定的命令。

在该程序中，使用了 `kernel/types.h`、`kernel/stat.h`、`user/user.h` 和 `kernel/param.h` 四个头文件，其中 `types.h` 和 `stat.h` 定义了一些基本的数据类型和文件状态相关的结构体，`user.h` 定义了一些系统调用，`param.h` 定义了一些系统参数。

在 `main` 函数中，首先判断命令行参数数量是否正确。如果参数数量不正确，则输出错误信息并退出。然后，根据命令行参数分配相应的内存空间，分别存储命令和参数，然后循环读取标准输入，并将输入作为参数传递给命令。

在 `readline` 函数中，通过循环读取标准输入，逐字符读入命令行参数，当读入到换行符时停止读取。读取完成后，将读入的参数分割成一个个独立的字符串，并存储在 `new_argv` 数组中，然后返回当前参数个数。

在 `run` 函数中，使用 `fork` 系统调用创建一个新的进程，并在子进程中执行指定的命令，并将参数传递给命令。然后在父进程中等待子进程执行完毕。

整个程序的逻辑比较简单，主要是读取标准输入并将输入作为命令行参数传递给指定的命令。

测试：

```bash
$ sudo ./grade-lab-util xargs
make: “kernel/kernel”已是最新。
== Test xargs == xargs: OK (0.7s) 
```

```bash
$ vim time.txt # 写上自己花在这个 Lab 多少个小时的时间
$ make grade
== Test sleep, no arguments == 
$ make qemu-gdb
sleep, no arguments: OK (2.5s) 
== Test sleep, returns == 
$ make qemu-gdb
sleep, returns: OK (0.4s) 
== Test sleep, makes syscall == 
$ make qemu-gdb
sleep, makes syscall: OK (1.1s) 
== Test pingpong == 
$ make qemu-gdb
pingpong: OK (0.9s) 
== Test primes == 
$ make qemu-gdb
primes: OK (1.1s) 
== Test find, in current directory == 
$ make qemu-gdb
find, in current directory: OK (1.0s) 
== Test find, recursive == 
$ make qemu-gdb
find, recursive: OK (1.1s) 
== Test xargs == 
$ make qemu-gdb
xargs: OK (1.1s) 
== Test time == 
time: OK 
Score: 100/100
```
