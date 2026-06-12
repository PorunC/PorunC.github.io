---
title: CS144-Lab0
date: '2023-02-18T13:14:27.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/18/CS144-Lab0
oldUrl: /2023/02/18/CS144-Lab0/
excerpt: >-
  访问<http://cs144.keithw.org/hello ，并观察结果 在命令行中输入
  可以先在一个文件中输入以下字段复制粘贴进命令行，防止输入速度过慢导致断连 输入完的响应如下： 在命令行中输入 出现 接着输入 得到如下响应
  由于没有sunetid,采用163邮箱进行代替 和163邮箱打个招呼 返回250 OK 邮箱账户登陆 在收件邮箱中可以发现收...
---
# 2 Networking by hand

## 2.1 Fetch a Web page

### 2.1.1

访问<http://cs144.keithw.org/hello>，并观察结果  
![](https://img-blog.csdnimg.cn/391131c908c6419ba1d71484a99d2b48.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.1.2

在命令行中输入

```bash
telnet cs144.keithw.org http
Trying 104.196.238.229...
Connected to cs144.keithw.org.
Escape character is '^]'.
```
```bash

可以先在一个文件中输入以下字段复制粘贴进命令行，防止输入速度过慢导致断连

```yml
```bash
GET /hello HTTP/1.1
Host: cs144.keithw.org
Connection: close

```
```bash

输入完的响应如下：

```bash
```bash
HTTP/1.1 200 OK
Date: Mon, 17 Jan 2022 06:35:25 GMT
Server: Apache
Last-Modified: Thu, 13 Dec 2018 15:45:29 GMT
ETag: "e-57ce93446cb64"
Accept-Ranges: bytes
Content-Length: 14
Connection: close
Content-Type: text/plain

Hello, CS144!
Connection closed by foreign host.
```
```bash

### 2.1.3 Assignment:

在命令行中输入

```bash
```bash
telnet cs144.keithw.org http
```
```bash

出现

```bash
```bash
Trying 104.196.238.229...
Connected to cs144.keithw.org.
Escape character is '^]'.
```
```bash

接着输入

```yml
```bash
GET /lab0/misaka HTTP/1.1
Host: cs144.keithw.org
Connection: close

```
```bash

得到如下响应

```bash
```bash
HTTP/1.1 200 OK
Date: Mon, 17 Jan 2022 06:46:16 GMT
Server: Apache
X-You-Said-Your-SunetID-Was: misaka
X-Your-Code-Is: 712264
Content-length: 110
Vary: Accept-Encoding
Connection: close
Content-Type: text/plain

Hello! You told us that your SUNet ID was "misaka". Please see the HTTP headers (above) for your secret code.
Connection closed by foreign host.
```
```bash

## 2.2 Send yourself an email

由于没有sunetid,采用163邮箱进行代替

```bash
```bash
telnet smtp.163.com smtp
Trying 220.181.12.11...
Connected to smtp.163.com.
Escape character is '^]'.
220 163.com Anti-spam GT for Coremail System (163com[xxxx])
```
```bash

和163邮箱打个招呼

```bash
```bash
helo 163.com
```
```bash

返回`250 OK`  
邮箱账户登陆

```bash
```bash
auth login
dXNlcm5hbWU6
[输入163邮箱的base64编码格式]
UGFzc3dvcmQ6
[输入base64编码格式的邮箱密码]
Authentication successful
MAIL FROM: <xxxxx@163.com> 	//表示发件人为 xxxxx@163.com
Mail OK
RCPT TO: <xxxxx@qq.com>		//表示收件人为 xxxxx@qq.com
Mail OK
DATA						//准备好发送数据了
End data with <CR><LF>.<CR><LF>				
[邮件内容]
.
Mail OK queued as smtp14,EsCowAAX5WUxFuVhrJCNAg--.xxxxxx xxxxxxxxxx
QUIT
Bye
Connection closed by foreign host.
```
```bash

在收件邮箱中可以发现收到的邮件

## 2.3 Listening and connecting

在命令行中输入：

```bash
```bash
netcat -v -l -p 9090
```
```bash

出现如下问题

```bash
```bash
netcat: getnameinfo: Temporary failure in name resolution
```
```bash

解决方法：

```bash
```bash
sudo vim /etc/resolv.conf
```
```bash

添加以下内容并保存

```plaintext
```bash
namespace 8.8.8.8
```
```bash

在一个窗口输入：

```bash
```bash
netcat -v -l -p 9090
```
```bash

新的窗口输入

```bash
```bash
telnet localhost 9090
```
```bash

即可实现`netcat`窗口对`telnet`窗口的监听，关闭`telnet`窗口就可以关闭这个监听程序  
![](https://img-blog.csdnimg.cn/8cabb2454d964f648194eae091268e53.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

# 3 Writing a network program using an OS stream socket

## 3.1 Let’s get started—fetching and building the starter code

```bash
```bash
git clone https://github.com/cs144/sponge
git checkout -b master origin/master
mkdir build && cd build
cmake ..
make format
make -j4 && make check_lab0
```
```bash

## 3.2

代码规范

## 3.3 Reading the Sponge documentation

1. 初学者代码的文档:<https://cs144.github.io/doc/lab0/>
2. Socket是FileDescriptor的一种类型，而TCPSocket是一种Socket  
   FileDescriptor：<https://cs144.github.io/doc/lab0/class_file_descriptor.html>  
   Socket ：<https://cs144.github.io/doc/lab0/class_socket.html>  
   TCPSocket：<https://cs144.github.io/doc/lab0/class_t_c_p_socket.html>  
   Address：<https://cs144.github.io/doc/lab0/class_address.html>
3. 观察`libsponge/util` 目录下的 `file descriptor.hh`, `socket.hh`, `address.hh`三个头文件是怎么定义接口的

`file descriptor.hh`

```cpp
```bash
//! Write a string, possibly blocking until all is written
size_t write(const char *str, const bool write_all = true) { return write(BufferViewList(str), write_all); }

//! Write a string, possibly blocking until all is written
size_t write(const std::string &str, const bool write_all = true) { return write(BufferViewList(str), write_all); }

//! Write a buffer (or list of buffers), possibly blocking until all is written
size_t write(BufferViewList buffer, const bool write_all = true);
```
```bash

`socket.hh`:

```cpp
```bash
//! Connect a socket to a specified peer address with [connect(2)](\ref man2::connect)
//使用[CONNECT(2)](\ref Man2：：Connect)将socket连接到指定的对等地址
void connect(const Address &address);

//! Shut down a socket via [shutdown(2)](\ref man2::shutdown)
//通过[Shutdown(2)](\ref Man2：：Shutdown)关闭socket
void shutdown(const int how);
```
```bash

`address`：

```cpp
```bash
//! Construct by resolving a hostname and servicename.
// 通过 主机名 如 “cs144.keithw.org” 和 服务名 如 “http” 进行构造
Address(const std::string &hostname, const std::string&service);

//! Construct from dotted-quad string ("18.243.0.1") and numeric port.
// 通过 ip地址 和 端口号 进行构造
Address(const std::string &ip, const std::uint16_t port = 0);

//! Construct from a [sockaddr *](@ref man7::socket).
// 通过 原始socket地址 和 地址长度 进行构造
Address(const sockaddr *addr, const std::size_t size);
```
```bash

## 3.4 Writing webget

It’s time to implement webget, a program to fetch Web pages over the Internet using the  
operating system’s TCP support and stream-socket abstraction—just like you did by hand  
earlier in this lab.  
webget是一个使用操作系统的TCP支持和流套接字抽象在Internet上获取网页的程序，就像您在本实验室前面手动完成的一样。

3. 使用HTTP格式实现此文件中描述的简单Web客户端，您之前使用的(Web)请求。使用TCPSocket和Address类。
4. 提示：
   1. 在HTTP中，每行必须以“\r\n”结尾(仅使用“\n”或endl是不够的)。
   2. 在客户请求中包含“Connection：Close”行。
   3. 确保读取并打印来自服务器的所有输出，直到socket到达“EOF”(文件结尾)-单个读取调用是不够的。
   4. 十行左右的代码

代码位置：  
`/cs144/sponge/apps/webget.cc`

```cpp
```bash
void get_URL(const string &host, const string &path) {
    // Your code here.

    // You will need to connect to the "http" service on
    // the computer whose name is in the "host" string,
    // then request the URL path given in the "path" string.

    // Then you'll need to print out everything the server sends back,
    // (not just one call to read() -- everything) until you reach
    // the "eof" (end of file).

    Address address(host, "http");
    TCPSocket socket;
    // 和服务器连接
    socket.connect(address);
    // 利用字符串拼接，编写request请求
    socket.write("GET " + path + " HTTP/1.1\r\n");
    socket.write("HOST: " + host + "\r\n");
    socket.write("\r\n");
    // request结束
    socket.shutdown(SHUT_WR);
    // content
    while (!socket.eof()) {
        std::cout << socket.read(1);
    }
    // close
    socket.close();

    // cerr << "Function called: get_URL(" << host << ", " << path << ").\n";
    // cerr << "Warning: get_URL() has not been implemented yet.\n";
}
```
```bash

5. make

```bash
```bash
$ make
```
```bash

```bash
```bash
[ 33%] Built target sponge
[ 40%] Built target webget
[ 46%] Built target spongechecks
[ 53%] Built target byte_stream_many_writes
[ 60%] Built target byte_stream_capacity
[ 66%] Built target byte_stream_two_writes
[ 73%] Built target byte_stream_one_write
[ 80%] Built target byte_stream_construction
[ 86%] Built target parser_dt
[ 93%] Built target socket_dt
[100%] Built target address_dt
```
```bash

6. 测试

```bash
```bash
$ ./apps/webget cs144.keithw.org /hello
```
```bash

结果：

```bash
```bash
HTTP/1.1 200 OK
Date: Mon, 17 Jan 2022 09:16:30 GMT
Server: Apache
Last-Modified: Thu, 13 Dec 2018 15:45:29 GMT
ETag: "e-57ce93446cb64"
Accept-Ranges: bytes
Content-Length: 14
Content-Type: text/plain

Hello, CS144!
```
```bash

7. make check\_webget

```bash
```bash
$ make check_webget
```
```bash

结果

```bash
```bash
[100%] Testing webget...
Test project /home/ubuntu/cs144/sponge/build
    Start 31: t_webget
1/1 Test #31: t_webget .........................   Passed    1.05 sec

100% tests passed, 0 tests failed out of 1

Total Test time (real) =   1.05 sec
[100%] Built target check_webget
```
```bash

```cpp
```bash
//! \brief A reference-counted read-only string that can discard bytes from the front
class Buffer {
  private:
    std::shared_ptr<std::string> _storage{};
    size_t _starting_offset{};

  public:
    Buffer() = default;

    //! \brief Construct by taking ownership of a string
    Buffer(std::string &&str) noexcept : _storage(std::make_shared<std::string>(std::move(str))) {}

    //! \name Expose contents as a std::string_view
    //!@{
    std::string_view str() const {
        if (not _storage) {
            return {};
        }
        return {_storage->data() + _starting_offset, _storage->size() - _starting_offset};
    }

    operator std::string_view() const { return str(); }
    //!@}

    //! \brief Get character at location `n`
    uint8_t at(const size_t n) const { return str().at(n); }

    //! \brief Size of the string
    size_t size() const { return str().size(); }

    //! \brief Make a copy to a new std::string
    std::string copy() const { return std::string(str()); }

    //! \brief Discard the first `n` bytes of the string (does not require a copy or move)
    //! \note Doesn't free any memory until the whole string has been discarded in all copies of the Buffer.
    void remove_prefix(const size_t n);

};
```
```bash

这是一个只读的字符串类 `Buffer`，具有自动引用计数的特性。该类可以从字符串前面丢弃一些字节。

类成员包括：

- `_storage`：一个指向 `std::string` 对象的智能指针，表示该类持有的字符串对象。由于该指针是一个 shared\_ptr，所以当多个 `Buffer` 实例共享同一个字符串时，该字符串的内存只会在所有引用该字符串的 `Buffer` 实例都析构时才被释放。
- `_starting_offset`：表示当前 `Buffer` 实例在 `_storage` 所指向的字符串对象中的偏移量，即该实例持有的字符串从 `_storage` 所指向的字符串对象的第 `_starting_offset` 个字符开始。

该类提供了以下方法：

- 构造函数：接收一个 `std::string` 对象，并以其为初始字符串。
- `str()`：返回一个 `std::string_view` 对象，表示当前 `Buffer` 实例所持有的字符串。`std::string_view` 对象的数据成员指向 `_storage` 所指向的字符串对象的 `_starting_offset` 处。
- `operator std::string_view() const`：重载了类型转换运算符，将 `Buffer` 对象转换为 `std::string_view` 对象。
- `at(size_t n)`：返回当前 `Buffer` 实例所持有的字符串的第 `n` 个字符。
- `size()`：返回当前 `Buffer` 实例所持有的字符串的长度。
- `copy()`：返回一个新的 `std::string` 对象，其中包含当前 `Buffer` 实例所持有的字符串的完整拷贝。
- `remove_prefix(size_t n)`：丢弃当前 `Buffer` 实例所持有字符串的前 `n` 个字符，将 `_starting_offset` 成员变量加上 `n`。这个方法不需要进行字符串的拷贝或移动操作，因为 `Buffer` 类只是一个只读的字符串容器，不需要对其中的字符串做任何修改。同时，如果当前 `Buffer` 实例是多个实例中的一个共享同一个字符串，那么在所有引用该字符串的 `Buffer` 实例都丢弃了前 `n` 个字符之后，原字符串对象才会被释放。

```cpp
```bash

//! \brief A reference-counted discontiguous string that can discard bytes from the front
//! \note Used to model packets that contain multiple sets of headers
//! + a payload. This allows us to prepend headers (e.g., to
//! encapsulate a TCP payload in a TCPSegment, and then encapsulate
//! the TCPSegment in an IPv4Datagram) without copying the payload.
class BufferList {
  private:
    std::deque<Buffer> _buffers{};

  public:
    //! \name Constructors
    //!@{

    BufferList() = default;

    //! \brief Construct from a Buffer
    BufferList(Buffer buffer) : _buffers{buffer} {}

    //! \brief Construct by taking ownership of a std::string
    BufferList(std::string &&str) noexcept {
        Buffer buf{std::move(str)};
        append(buf);
    }
    //!@}

    //! \brief Access the underlying queue of Buffers
    const std::deque<Buffer> &buffers() const { return _buffers; }

    //! \brief Append a BufferList
    void append(const BufferList &other);

    //! \brief Transform to a Buffer
    //! \note Throws an exception unless BufferList is contiguous
    operator Buffer() const;

    //! \brief Discard the first `n` bytes of the string (does not require a copy or move)
    void remove_prefix(size_t n);

    //! \brief Size of the string
    size_t size() const;

    //! \brief Make a copy to a new std::string
    std::string concatenate() const;
};
```
```bash

这段代码定义了一个叫做`BufferList`的类，它表示了一个由多个`Buffer`组成的不连续的字符串。这个类可以从字符串前面丢弃字节。它主要用来表示包含多组头部和有效载荷的数据包，它允许我们在不复制有效载荷的情况下前置头部。

这个类内部使用了一个deque容器来存储多个`Buffer`，并对外提供了一系列公共接口：

- `BufferList()`默认构造函数
- `BufferList(Buffer buffer)`：从一个Buffer构造一个BufferList
- `BufferList(std::string &&str)`：从一个std::string构造一个BufferList，它会自动将其转换为一个Buffer，并添加到BufferList中
- `const std::deque<Buffer>& buffers() const`：访问底层的Buffer队列
- `void append(const BufferList& other)`：添加一个BufferList到当前对象中
- `operator Buffer() const`：将当前BufferList转换为一个Buffer，但如果BufferList不是连续的，将抛出异常
- `void remove_prefix(size_t n)`：丢弃当前BufferList的前n个字节
- `size_t size() const`：返回当前BufferList的字节长度
- `std::string concatenate() const`：将当前BufferList中的所有Buffer连接起来，并返回一个新的std::string对象。

```cpp
```bash

//! \brief A non-owning temporary view (similar to std::string_view) of a discontiguous string
class BufferViewList {
    std::deque<std::string_view> _views{};

  public:
    //! \name Constructors
    //!@{

    //! \brief Construct from a std::string
    BufferViewList(const std::string &str) : BufferViewList(std::string_view(str)) {}

    //! \brief Construct from a C string (must be NULL-terminated)
    BufferViewList(const char *s) : BufferViewList(std::string_view(s)) {}

    //! \brief Construct from a BufferList
    BufferViewList(const BufferList &buffers);

    //! \brief Construct from a std::string_view
    BufferViewList(std::string_view str) { _views.push_back({const_cast<char *>(str.data()), str.size()}); }
    //!@}

    //! \brief Discard the first `n` bytes of the string (does not require a copy or move)
    void remove_prefix(size_t n);

    //! \brief Size of the string
    size_t size() const;

    //! \brief Convert to a vector of `iovec` structures
    //! \note used for system calls that write discontiguous buffers,
    //! e.g. [writev(2)](\ref man2::writev) and [sendmsg(2)](\ref man2::sendmsg)
    std::vector<iovec> as_iovecs() const;
};
```
```bash

这段代码定义了一个名为 `BufferViewList` 的类，它是一个临时的、非拥有者的视图，类似于 `std::string_view`，用于表示一个不连续的字符串。该类的实例可以从不同的来源构造，包括一个 `std::string` 对象、一个 C 风格的字符串指针、一个 `BufferList` 对象，以及一个 `std::string_view` 对象。

`BufferViewList` 类提供了以下几个成员函数：

- `remove_prefix(size_t n)`：从视图中移除前面的 `n` 个字符，不需要进行复制或移动。
- `size()`：返回视图所表示字符串的大小。
- `as_iovecs()`：返回一个 `std::vector`，其中的元素是 `iovec` 结构体，可以用于写入不连续的缓冲区，如 [writev(2)](\ref man2::writev) 和 [sendmsg(2)](\ref man2::sendmsg) 系统调用。

下面模仿 `BufferList` 编写一个 `BufferPlus` 类：

```cpp
```bash
class BufferPlus {
  private:
    std::shared_ptr<std::string> _storage{};
    size_t _starting_offset{};
    size_t _ending_offset{};

  public:
    BufferPlus() = default;

    //! \brief Construct by taking ownership of a string
    BufferPlus(std::string &&str) noexcept : _storage(std::make_shared<std::string>(std::move(str))) {}

    BufferPlus(const BufferPlus &Other)
      : _storage(Other._storage)
      , _starting_offset(Other._starting_offset)
      , _ending_offset(Other._ending_offset) {}

    BufferPlus(const Buffer &bf)
      : _storage(bf._storage)
      , _starting_offset(bf._starting_offset) {}

    //! \name Expose contents as a std::string_view
    //!@{
    std::string_view str() const {
        if (not _storage) {
            return {};
        }
        return {_storage->data() + _starting_offset, _storage->size() - _starting_offset - _ending_offset};
    }

    operator std::string_view() const { return str(); }
    //!@}

    //! \brief Get character at location `n`
    uint8_t at(const size_t n) const { return str().at(n); }

    //! \brief Size of the string
    size_t size() const { return _storage ? _storage->size() - _starting_offset - _ending_offset : 0; }

    size_t starting_offset() const { return _starting_offset; }

    size_t ending_offset() const { return _ending_offset; }

    //! \brief Make a copy to a new std::string
    std::string copy() const { return std::string(str()); }

    //! \brief Discard the first `n` bytes of the string (does not require a copy or move)
    //! \note Doesn't free any memory until the whole string has been discarded in all copies of the Buffer.
    void remove_prefix(const size_t n);
    
    //! \brief Discard the last `n` bytes of the string (does not require a copy or move)
    void remove_suffix(const size_t n);
};
```
```bash

`BufferPlus` 的 C++ 类。它是一个字符串类，用于表示字符串，并提供了许多有用的操作。下面是这个类的主要特性：

- 它内部维护了一个指向 `std::string` 的 `std::shared_ptr` 智能指针，因此可以在多个 `BufferPlus` 实例之间共享底层数据。
- `BufferPlus` 可以构造出一个新的 `std::string` 或者从一个现有的 `std::string` 对象中构造出 `BufferPlus`。
- 它提供了一个 `str()` 方法来将 `BufferPlus` 转换为一个 `std::string_view`，并提供了一个 `copy()` 方法来将 `BufferPlus` 复制到一个新的 `std::string` 对象中。
- 它提供了一个 `at()` 方法来访问特定位置的字符。
- 它提供了一个 `size()` 方法来获取字符串的长度。
- 它提供了 `remove_prefix()` 和 `remove_suffix()` 方法，用于从字符串的开头或末尾删除指定数量的字符，而不需要移动底层数据。

在实际编程中，`BufferPlus` 可以作为一种高效的字符串类型来使用，尤其是在需要频繁进行字符串拼接和切割操作的情况下。

## 完整代码

- [webget](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/apps/webget.cc)
- [byte\_stream.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/byte_stream.hh)
- [byte\_stream.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/byte_stream.cc)

“byte\_stream.hh”

```cpp
```bash
#ifndef SPONGE_LIBSPONGE_BYTE_STREAM_HH
#define SPONGE_LIBSPONGE_BYTE_STREAM_HH

#include <string>
#include <deque>

#include "buffer.hh"

//! \brief An in-order byte stream.

//! Bytes are written on the "input" side and read from the "output"
//! side.  The byte stream is finite: the writer can end the input,
//! and then no more bytes can be written.
class ByteStream {
  private:
    // Your code here -- add private members as necessary.

    // Hint: This doesn't need to be a sophisticated data structure at
    // all, but if any of your tests are taking longer than a second,
    // that's a sign that you probably want to keep exploring
    // different approaches.

    bool _error{false};  //!< Flag indicating that the stream suffered an error.
    bool _input_ended{false};
    size_t _capacity;
    size_t _bytes_written{0};
    size_t _bytes_read{0};
    std::deque<BufferPlus> _buffer{};

  public:
    //! Construct a stream with room for `capacity` bytes.
    ByteStream(const size_t capacity);

    //! \name "Input" interface for the writer
    //!@{

    //! Write a string of bytes into the stream. Write as many
    //! as will fit, and return how many were written.
    //! \returns the number of bytes accepted into the stream
    size_t write(const std::string &data);
    size_t write(std::string &&data);
    size_t write(BufferPlus& data);

    //! \returns the number of additional bytes that the stream has space for
    size_t remaining_capacity() const;

    //! Signal that the byte stream has reached its ending
    void end_input();

    //! Indicate that the stream suffered an error.
    void set_error() { _error = true; }
    //!@}

    //! \name "Output" interface for the reader
    //!@{

    //! Peek at next "len" bytes of the stream
    //! \returns a string
    std::string peek_output(const size_t len) const;

    //! Remove bytes from the buffer
    void pop_output(const size_t len);

    //! Read (i.e., copy and then pop) the next "len" bytes of the stream
    //! \returns a string
    std::string read(const size_t len);

    //! \returns `true` if the stream input has ended
    bool input_ended() const;

    //! \returns `true` if the stream has suffered an error
    bool error() const { return _error; }

    //! \returns the maximum amount that can currently be read from the stream
    size_t buffer_size() const;

    //! \returns `true` if the buffer is empty
    bool buffer_empty() const;

    //! \returns `true` if the output has reached the ending
    bool eof() const;
    //!@}

    //! \name General accounting
    //!@{

    //! Total number of bytes written
    size_t bytes_written() const;

    //! Total number of bytes popped
    size_t bytes_read() const;
    //!@}
};

#endif  // SPONGE_LIBSPONGE_BYTE_STREAM_HH
```
```bash

它代表了一个按顺序排列的字节流。它有用于将字节写入流的“输入”端和从流的“输出”端读取字节的方法。

`ByteStream`类的一些私有成员包括：

- `_error`: 一个布尔标志，指示流是否发生错误。
- `_input_ended`: 一个布尔标志，指示输入端是否已经结束。
- `_capacity`: 一次可以在流中容纳的最大字节数。
- `_bytes_written`: 写入到流中的总字节数。
- `_bytes_read`: 从流中读取的总字节数。
- `_buffer`: 一个包含流中数据的`BufferPlus`对象的 `deque`。

`ByteStream`类的一些公共方法包括：

- `write`：将一组字节写入到流的输入端。
- `end_input`：表示输入端已经结束。
- `set_error`：设置流的错误标志。
- `peek_output`：返回包含输出端中下一个len个字节的字符串，而不将它们从流中删除。
- `pop_output`：从输出端中删除下一个len个字节。
- `read`：返回包含输出端中下一个len个字节的字符串，并从流中删除它们。
- `input_ended`：如果输入端已经结束，则返回`true`。
- `error`：如果流已经出现错误，则返回`true`。
- `buffer_size`：返回流中当前的字节数。
- `buffer_empty`：如果流当前为空，则返回`true`。
- `eof`：如果输出端已经到达结尾，则返回`true`。
- `bytes_written`：返回写入流中的总字节数。
- `bytes_read`：返回从流中读取的总字节数。

“byte\_stream.cc”

```cpp
```bash
#include "byte_stream.hh"

// Dummy implementation of a flow-controlled in-memory byte stream.

// For Lab 0, please replace with a real implementation that passes the
// automated checks run by `make check_lab0`.

// You will need to add private members to the class declaration in `byte_stream.hh`

template <typename... Targs>
void DUMMY_CODE(Targs &&... /* unused */) {}

using namespace std;

ByteStream::ByteStream(const size_t capacity)
    : _capacity(capacity) {}

size_t ByteStream::write(const string &data) {
    size_t bytes = data.size();
    bytes = min(bytes, remaining_capacity());
    _bytes_written += bytes;

    if (bytes == data.size()) {
        _buffer.emplace_back(move(Buffer(move(string(data)))));
    } else {
        _buffer.emplace_back(move(data.substr(0, bytes)));
    }

    return bytes;
}

size_t ByteStream::write(string &&data) {
    size_t bytes = data.size();
    bytes = min(bytes, remaining_capacity());
    _bytes_written += bytes;

    if (bytes == data.size()) {
        _buffer.emplace_back(move(Buffer(move(data))));
    } else {
        _buffer.emplace_back(move(data.substr(0, bytes)));
    }

    return bytes;
}

size_t ByteStream::write(BufferPlus& data) {
    size_t bytes = data.size();
    bytes = min(bytes, remaining_capacity());
    _bytes_written += bytes;

    if (bytes != data.size()) {
        data.remove_suffix(data.size() - bytes);
    }

    if (data.size()) {
        _buffer.emplace_back(move(data));
    }

    return bytes;
}

//! \param[in] len bytes will be copied from the output side of the buffer
string ByteStream::peek_output(const size_t len) const {
    size_t bytes = min(len, buffer_size());
    string res;
    res.reserve(bytes);

    for (const auto &buffer : _buffer) {
        if (bytes >= buffer.size()) {
            res.append(move(buffer));
            bytes -= buffer.size();
            if (bytes == 0) {
                break;
            }
        } else {
            BufferPlus tmp(buffer);
            tmp.remove_suffix(buffer.size() - bytes);
            res.append(move(tmp));
            break;
        }
    }

    return res;
}

//! \param[in] len bytes will be removed from the output side of the buffer
void ByteStream::pop_output(const size_t len) { 
    size_t bytes = min(len, buffer_size());
    _bytes_read += bytes;

    while (bytes > 0) {
        if (bytes > _buffer.front().size()) {
            bytes -= _buffer.front().size();
            _buffer.pop_front();
        } else {
            _buffer.front().remove_prefix(bytes);
            break;
        }
    }

    return;
}

//! Read (i.e., copy and then pop) the next "len" bytes of the stream
//! \param[in] len bytes will be popped and returned
//! \returns a string
std::string ByteStream::read(const size_t len) {
    string res = peek_output(len);
    pop_output(len);
    return res;
}

void ByteStream::end_input() { _input_ended = true; }

bool ByteStream::input_ended() const { return _input_ended; }

size_t ByteStream::buffer_size() const { return _bytes_written - _bytes_read; }

bool ByteStream::buffer_empty() const { return _bytes_written - _bytes_read == 0; }

bool ByteStream::eof() const { return _input_ended && buffer_empty(); }

size_t ByteStream::bytes_written() const { return _bytes_written; }

size_t ByteStream::bytes_read() const { return _bytes_read; }

size_t ByteStream::remaining_capacity() const { return _capacity - buffer_size(); }
```