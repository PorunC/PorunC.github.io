---
title: Makefile 和 CMake
date: '2023-02-20T09:44:45.000Z'
updated: '2023-02-20T09:45:11.000Z'
tags: []
categories: []
slug: 2023/02/20/Makefile-和-CMake
oldUrl: /2023/02/20/Makefile-和-CMake/
excerpt: >-
  Makefile 20分钟入门，简简单单，展示如何使用Makefile管理和编译C++代码 Makefile
  是一个用于构建（Build）软件的文件，它包含了一组规则和命令，用于自动化构建和编译源代码，生成目标文件或可执行程序等。Makefile
  是一个文本文件，它的格式通常是： 其中，target 是一个目标文件或操作的名称，dependencies 是构...
---
## Makefile

### Reference

[Makefile 20分钟入门，简简单单，展示如何使用Makefile管理和编译C++代码](https://www.bilibili.com/video/BV188411L7d2)

### 简介

Makefile 是一个用于构建（Build）软件的文件，它包含了一组规则和命令，用于自动化构建和编译源代码，生成目标文件或可执行程序等。Makefile 是一个文本文件，它的格式通常是：

```bash
target: dependencies
        command
```

其中，`target` 是一个目标文件或操作的名称，`dependencies` 是构建目标所依赖的文件或操作，`command` 是生成目标的命令。Makefile 文件中的规则和命令由 make 命令读取并执行，自动构建软件。

Makefile 的主要作用是提高软件开发过程的效率和可靠性。通过编写 Makefile，开发人员可以避免手动执行构建和编译操作，减少出错的可能性，同时还可以利用 make 工具的依赖关系自动化处理，只编译发生了变化的源代码，避免重复工作。Makefile 还可以方便地扩展到多个平台和项目中，支持更加灵活的软件构建和管理。

Makefile 是 Linux 和 Unix 系统上的一种常用工具，也逐渐被其他操作系统所采用。除了 C/C++ 项目，Makefile 也可以用于其他编程语言和项目的构建。

### 准备文件

```bash
$ tree hello
hello
├── factorial.cpp
├── functions.h
├── main.cpp
└── printhello.cpp

1 directory, 4 files
```

`functions.h`

```cpp
#ifdef _FUNCTIONS_H_
#define _FUNCTIONS_H_

void printhello();
int factorial(int n);
#endif
```

`printhello.cpp`

```cpp
#include <iostream>
#include "functions.h"

using namespace std;

void printhello() {
    int i;
    cout << "Hello World!" << endl;
}
```

`factorial.cpp`

```cpp
#include "functions.h"

int factorial(int n) {
    if (n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
```

`main.cpp`

```cpp
#define _FUNCTIONS_H_

#include <iostream>
#include "functions.h"

using namespace std;

int main() {
    printhello();

    cout << "This is main: " << endl;
    cout << "This factorial of 5 is : "  << factorial(5) << endl;
    return 0;
}
```

编译：

```bash
$ g++ main.cpp factorial.cpp printhello.cpp -o main
$ ./main
Hello World!
This is main:
This factorial of 5 is : 120
```

另一种方式：

```bash
$ g++ factorial.cpp -c
$ g++ printhello.cpp -c
$ g++ main.cpp -c
$ g++ *.o -o main
$ ./main
Hello World!
This is main:
This factorial of 5 is : 120
```

`g++ factorial.cpp -c` 命令是用来编译 `factorial.cpp` 文件并生成目标文件（object file）的。

具体来说，`g++` 是 GNU C++ 编译器的命令，用于将源代码编译为可执行文件或目标文件。`factorial.cpp` 是要编译的源代码文件，`-c` 选项告诉编译器只编译源代码文件，不进行链接操作，生成目标文件而非可执行文件。生成的目标文件通常是二进制的，可以被链接器用于生成可执行文件。

这个命令的优点在于，它将源代码文件编译为目标文件，实现了代码和数据的分离。这样做的好处是可以减少代码的编译时间，提高了编译的效率。在进行后续的链接操作时，只需要将所有的目标文件链接到一起即可生成可执行文件，避免了重复编译源代码的过程，节省了时间。

此外，将代码和数据分离也使得程序的修改和维护更加方便。当程序需要更新时，只需要重新编译发生了变化的源代码文件生成目标文件，而不需要重新编译所有的源代码文件，可以减少编译时间和编译器的资源占用。

编译器通常使用时间戳（timestamp）来判断程序是否发生更新。

时间戳是文件系统记录每个文件的一个元数据，用来表示文件的创建时间、修改时间、访问时间等信息。当一个源代码文件被编译时，编译器会检查该文件的时间戳和对应的目标文件的时间戳，如果源代码文件的时间戳比目标文件的时间戳更晚，说明源代码文件已经被更新过，需要重新编译该文件生成新的目标文件。

在重新编译时，编译器只会编译发生更新的源代码文件和依赖的文件，不会重新编译其他源代码文件和库文件。这样做可以避免重复编译和浪费时间，提高编译效率。

除了时间戳，编译器还可以使用其他的机制来判断程序是否发生更新，比如对源代码文件进行哈希计算，生成一个哈希值，如果两个文件的哈希值不同，则说明文件发生了变化。不过，时间戳是最常用的方法，因为它可以直接使用操作系统提供的元数据，并且准确度高。

总之，将源代码编译为目标文件是一种优化编译的方法，可以提高编译效率和程序的可维护性。

### Version 1

```makefile
hello: main.cpp printhello.cpp factorial.cpp
	g++ -o hello main.cpp printhello.cpp factorial.cpp
```

这个 Makefile 包含了一个规则，用于编译 `main.cpp`、`printhello.cpp` 和 `factorial.cpp` 三个源代码文件，并生成一个可执行文件 `hello`。

具体来说，Makefile 的规则包含了一个目标和一组依赖项，以及生成目标的命令。在这个 Makefile 中，目标是 `hello`，表示要生成的可执行文件，依赖项是 `main.cpp`、`printhello.cpp` 和 `factorial.cpp`，表示可执行文件需要依赖这三个源代码文件，生成目标的命令是 `g++ -o hello main.cpp printhello.cpp factorial.cpp`，表示使用 `g++` 编译器将三个源代码文件编译成一个可执行文件 `hello`。

具体的编译过程是，当执行 `make` 命令时，make 工具会读取 Makefile 文件，查找是否存在名为 `hello` 的目标文件或规则。在这个例子中，存在一个名为 `hello` 的规则，make 工具会判断是否需要重新生成 `hello` 文件。如果目标文件不存在或者依赖文件的时间戳比目标文件的时间戳更晚，make 工具就会执行生成目标的命令，即使用 `g++` 编译器将三个源代码文件编译成一个可执行文件 `hello`。

在执行生成目标的命令时，`g++` 编译器会将三个源代码文件编译成目标文件，并将目标文件链接起来生成可执行文件 `hello`。`-o` 选项指定生成的可执行文件的名称为 `hello`，`main.cpp`、`printhello.cpp` 和 `factorial.cpp` 三个文件是编译器的输入文件。

总之，这个 Makefile 定义了一个简单的规则，可以将多个源代码文件编译成一个可执行文件，为程序的构建和管理提供了便利。

```bash
$ make
g++ -o hello main.cpp printhello.cpp factorial.cpp
```

### Version 2

```makefile
CXX = g++
TARGET = hello
OBJ = main.o printhello.o factorial.o

$(TARGET): $(OBJ)
	$(CXX) -o $(TARGET) $(OBJ)

main.o: main.cpp
	$(CXX) -c main.cpp

printhello.o: printhello.cpp
	$(CXX) -c printhello.cpp

factorial.o: factorial.cpp
	$(CXX) -c factorial.cpp
```

相较于上一个 Makefile，这个版本的 Makefile 采用了一种更加灵活、结构化的方式来编写规则，具有以下优点：

1. 变量化：将编译器 `g++`、目标文件 `hello`、源代码文件 `main.cpp`、`printhello.cpp` 和 `factorial.cpp` 等常量作为变量定义，使得 Makefile 更加易于维护和扩展。
2. 规则化：使用规则来定义每个源代码文件的编译命令，以及可执行文件的生成命令。通过定义规则，可以使得 Makefile 更加模块化，方便增加、修改、删除规则，提高了 Makefile 的可读性和可维护性。
3. 自动化依赖：定义了每个目标文件依赖的源代码文件，让 Make 工具自动地管理依赖关系。如果某个源代码文件被修改，Make 工具会自动地重新编译对应的目标文件，而不会重新编译没有变化的文件，从而提高编译效率。
4. Makefile 中定义了每个源代码文件的编译命令，而不是像上一个版本的 Makefile 那样一次性编译所有的源代码文件。这种做法更加细粒度，可以在需要时单独编译某个源代码文件，避免不必要的编译，提高了编译效率。

```bash
$ make
g++ -c main.cpp
g++ -c printhello.cpp
g++ -c factorial.cpp
g++ -o hello  main.o printhello.o factorial.o
```

### Version 3

```makefile
CXX = g++
TARGET = hello 
OBJ = main.o printhello.o factorial.o

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
	$(CXX) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
	rm -f *.o $(TARGET)
```

相较于前两个版本的 Makefile，这个版本的 Makefile 进一步提高了灵活性和可维护性，具有以下优点：

1. 模式规则：通过定义 `%` 通配符，可以将编译每个源代码文件的规则合并成一个通用的规则。这样做可以让 Makefile 更加精简，提高可读性，也方便在以后添加或删除源代码文件时进行维护。
2. 变量化：将编译器 `g++`、目标文件 `hello`、源代码文件 `main.cpp`、`printhello.cpp` 和 `factorial.cpp` 等常量作为变量定义，同样具有可维护性和可扩展性的优点。
3. 自动化依赖：与第二个版本的 Makefile 类似，使用 `$(OBJ)` 变量来指定可执行文件 `hello` 依赖的所有目标文件，并且使用模式规则来自动化生成每个目标文件。
4. 清理目标：通过 `.PHONY` 声明一个伪目标 `clean`，定义了清理规则，可以方便地删除所有的目标文件和可执行文件，避免在重新编译时出现问题。

总之，相较于前两个版本的 Makefile，这个版本的 Makefile 进一步提高了可读性和可维护性，并且更加自动化，可以自动化处理每个源代码文件的编译过程。同时，定义了清理规则，方便维护者进行清理操作。

```bash
$ make
g++ -c -Wall main.cpp -o main.o
g++ -c -Wall printhello.cpp -o printhello.o
printhello.cpp:7:9: warning: unused variable 'i' [-Wunused-variable]
    int i;
        ^
1 warning generated.
g++ -c -Wall factorial.cpp -o factorial.o
g++ -o hello main.o printhello.o factorial.o
```

### Version 4

```makefile
CXX = g++
TARGET = hello 
SRC = $(wildcard *.cpp)
OBJ = $(patsubst %.cpp, %.o, $(SRC))

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
	$(CXX) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
	rm -f *.o $(TARGET)
```

相较于之前的版本，这个版本的 Makefile 进一步提高了灵活性，具有以下优点：

1. 自动化变量：使用了 `wildcard` 和 `patsubst` 自动化变量来自动化地查找和转换源代码文件和目标文件，避免了手动定义每个文件的繁琐操作。
2. 简化了变量定义：只定义了需要用到的变量，使得 Makefile 更加精简，可读性更高。
3. 自动化依赖：与之前的版本类似，通过自动化变量 `$(OBJ)`，使用模式规则来自动化生成每个目标文件，提高了 Makefile 的灵活性和可维护性。
4. 清理目标：与之前的版本类似，定义了一个伪目标 `clean`，方便维护者进行清理操作。

总之，相较于之前的版本，这个版本的 Makefile 通过使用自动化变量和函数，避免了手动定义文件和目标文件的繁琐操作，更加自动化，同时仍然具有可读性和可维护性，提高了 Makefile 的灵活性。

```bash
$ make
g++ -c -Wall factorial.cpp -o factorial.o
g++ -c -Wall main.cpp -o main.o
g++ -c -Wall printhello.cpp -o printhello.o
printhello.cpp:7:9: warning: unused variable 'i' [-Wunused-variable]
    int i;
        ^
1 warning generated.
g++ -o hello factorial.o main.o printhello.o
```

### 常用的自动化变量

Makefile中常用的自动化变量和它们的解析如下：

| 变量名 | 解析 |
| --- | --- |
| `$@` | 当前规则的目标文件名。 |
| `$^` | 所有依赖文件的列表，以空格分隔。 |
| `$<` | 第一个依赖文件的名称。 |
| `$?` | 所有新于目标的依赖文件列表，以空格分隔。 |
| `$*` | 当前规则的目标文件名，不包括扩展名。 |
| `$(@D)` | 目标文件所在的目录名。 |
| `$(@F)` | 目标文件名，不包括目录路径。 |
| `$(notdir $<)` | 获取 `$<` 的文件名，去掉路径。 |
| `$(subst from,to,text)` | 将 text 中的 from 替换为 to。 |
| `$(patsubst pattern,replacement,text)` | 查找 text 中所有符合 pattern 模式的字符串，替换为 replacement。 |
| `$(wildcard pattern)` | 查找符合 pattern 模式的文件。 |
| `$(dir names)` | 获取 names 中所有文件的目录部分。 |
| `$(basename names)` | 获取 names 中所有文件的文件名部分（去掉扩展名）。 |
| `$(suffix names)` | 获取 names 中所有文件的扩展名部分。 |

在 Makefile 中，这些自动化变量可以方便地引用和处理一些常用信息，提高 Makefile 的编写效率和可读性。例如，使用 `$@` 可以在命令中引用当前规则的目标文件名，使用 `$^` 可以引用所有依赖文件的列表。此外，可以使用 `$(wildcard pattern)` 来查找指定模式的文件，以及使用 `$(patsubst pattern,replacement,text)` 来替换文件名中的通配符等

## CMake

### Reference

[CMake 6分钟入门，不用再写复杂的Makefile](https://www.bilibili.com/video/BV1bg411p7oS)

### 简介

CMake 是一个开源的跨平台的构建工具，用于管理 C/C++ 代码的构建过程。它使用一种名为 CMakeLists.txt 的简单脚本语言，通过配置和生成 Makefile、Visual Studio 项目、Xcode 项目等构建系统的脚本，从而实现跨平台、多编译器的构建工作。

使用 CMake，开发者可以将代码与构建系统分离，简化代码的移植和维护过程，同时可以自动生成不同平台、不同编译器下的构建脚本，提高了开发效率。CMake 还支持多种编程语言，包括 C、C++、Fortran、Java、Python 等，并且支持多种操作系统，包括 Windows、Linux、macOS 等。

CMake 使用起来比较简单，通过编写 CMakeLists.txt 文件来配置项目，然后使用 CMake 命令生成对应的构建系统。CMake 提供了丰富的命令和选项，支持包括库的构建、自定义构建类型、动态链接库的构建、安装和测试等功能。同时，CMake 还与各种第三方工具和库进行了深度集成，包括 Boost、Qt、CUDA、OpenCV 等，方便开发者集成自己的项目和工具。

总之，CMake 是一个功能强大、易于使用、跨平台的构建工具，能够帮助开发者管理 C/C++ 代码的构建过程，提高开发效率，方便项目的移植和维护。

### 例子

CMakeLists.txt：

```cmake
cmake_minimum_required(VERSION 3.10)

project(hello)

add_executable(hello main.cpp factorial.cpp printhello.cpp)
```

编译

```bash
$ mkdir build && cd build
$ cmake ..
-- The C compiler identification is AppleClang 13.1.6.13160021
-- The CXX compiler identification is AppleClang 13.1.6.13160021
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /Library/Developer/CommandLineTools/usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/misaka/Downloads/CodeSpace/Code/C/hello/build

$ make
[ 25%] Building CXX object CMakeFiles/hello.dir/main.cpp.o
[ 50%] Building CXX object CMakeFiles/hello.dir/factorial.cpp.o
[ 75%] Building CXX object CMakeFiles/hello.dir/printhello.cpp.o
[100%] Linking CXX executable hello
[100%] Built target hello

$ tree hello
hello
├── CMakeLists.txt
├── build
│   ├── CMakeCache.txt
│   ├── CMakeFiles
│   │   ├── 3.25.2
│   │   │   ├── CMakeCCompiler.cmake
│   │   │   ├── CMakeCXXCompiler.cmake
│   │   │   ├── CMakeDetermineCompilerABI_C.bin
│   │   │   ├── CMakeDetermineCompilerABI_CXX.bin
│   │   │   ├── CMakeSystem.cmake
│   │   │   ├── CompilerIdC
│   │   │   │   ├── CMakeCCompilerId.c
│   │   │   │   ├── CMakeCCompilerId.o
│   │   │   │   └── tmp
│   │   │   └── CompilerIdCXX
│   │   │       ├── CMakeCXXCompilerId.cpp
│   │   │       ├── CMakeCXXCompilerId.o
│   │   │       └── tmp
│   │   ├── CMakeDirectoryInformation.cmake
│   │   ├── CMakeError.log
│   │   ├── CMakeOutput.log
│   │   ├── CMakeScratch
│   │   ├── Makefile.cmake
│   │   ├── Makefile2
│   │   ├── TargetDirectories.txt
│   │   ├── cmake.check_cache
│   │   ├── hello.dir
│   │   │   ├── DependInfo.cmake
│   │   │   ├── build.make
│   │   │   ├── cmake_clean.cmake
│   │   │   ├── compiler_depend.make
│   │   │   ├── compiler_depend.ts
│   │   │   ├── depend.make
│   │   │   ├── factorial.cpp.o
│   │   │   ├── factorial.cpp.o.d
│   │   │   ├── flags.make
│   │   │   ├── link.txt
│   │   │   ├── main.cpp.o
│   │   │   ├── main.cpp.o.d
│   │   │   ├── printhello.cpp.o
│   │   │   ├── printhello.cpp.o.d
│   │   │   └── progress.make
│   │   ├── pkgRedirects
│   │   └── progress.marks
│   ├── Makefile
│   ├── cmake_install.cmake
│   └── hello
├── factorial.cpp
├── functions.h
├── main.cpp
└── printhello.cpp

11 directories, 41 files
```
