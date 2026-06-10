---
title: CS144-Lab2
date: '2023-02-18T15:30:41.000Z'
updated: '2023-02-18T16:00:49.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/18/CS144-Lab2
oldUrl: /2023/02/18/CS144-Lab2/
excerpt: >-
  除了写入传入流之外，TCPReceiver 还负责通知 sender 两件事： 1. “First unassembled”
  字节的索引，称为“acknowledgment”或 “ackno”。这是接收方需要来自发送方的第一个字节。 2. “first unassembled ”
  索引和“first unacceptable ”索引之间的距离。这称为“win...
---
## 实验架构

![image-20220322233230399](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220322233230399.png)

除了写入传入流之外，`TCPReceiver` 还负责通知 `sender` 两件事：

1. “`First unassembled`” 字节的索引，称为“`acknowledgment`”或 “`ackno`”。这是接收方需要来自发送方的第一个字节。
2. “`first unassembled` ” 索引和“`first unacceptable` ”索引之间的距离。这称为“`window size`”。

总的来说，`ackno` 和 `window size` 述了 `TCPreceiver` 的窗口：`TCPsender` 被允许发送一系列索引。使用该窗口，`TCPreceiver` 可以做到流量控制，使发送方限制它发送的数量，直到接收方准备好更多的数据。有时，我们将 `ackno` 称为窗口的“左边”( `TCPRecsigner` 的最小索引)，而 `ackno + window size` 则称为“右边缘”(略大于 `TCPReceiver` 的最大索引)。

在编写 `Stream Reassembler` 和 `Byte Stream` 时，您已经完成了实现 `TCP Receiver` 所涉及的大部分算法工作；本实验是将这些通用类连接到 `TCP` 的细节。最困难的部分将涉及考虑 `TCP` 将如何表示每个字节在流中的位置——称为“`sequence number`”。

我们将要实现的 `TCPReceiver` 需要完成的功能：

- 接收 `TCP segment`
- 重新组装 `ByteStream`
- 发送 `ackno` 和 `window size` 回 `TCP sender` ，以进行流量控制和数据确认

## 环境配置

当前我们的实验代码位于 `master` 分支，而在完成 Lab 之前需要合并一些依赖代码，因此执行以下命令：

```bash
git merge origin/lab2-startercode
```

之后重新 `make` 编译即可。

## The TCP Receiver

在 Lab2，我们将实现一个 TCPReceiver，用以接收传入的 TCP segment 并将其转换成用户可读的数据流。

TCPReceiver 除了将读入的数据写入至 ByteStream 中以外，它还需要**告诉发送者两个属性**：

- 第一个未组装的字节索引，称为**确认号ackno**，它是接收者需要的第一个字节的索引。
- **第一个未组装的字节索引**和**第一个不可接受的字节索引**之间的距离，称为 **窗口长度window size**。

ackno 和 window size 共同描述了接收者当前的**接收窗口**。接收窗口是 发送者允许发送数据的一个范围，通常 TCP 接收方使用接收窗口来进行**流量控制**，限制发送方发送数据。

总的来说，我们将要实现的 TCPReceiver 需要做以下几件事情：

- 接收TCP segment
- 重新组装字节流（包括EOF）
- 确定应该发回给发送者的信号，以进行数据确认和流量控制

### 1. Translating between 64-bit indexes and 32-bit seqnos

作为热身，我们需要实现TCP表示索引的方式。上周您创建了一个StreamReassembler，它重组子字符串，其中每个字节都有一个64位流索引，流中的第一个字节总是索引为0。64位索引足够大，我们可以将其视为永不溢出。然而，在TCP报头中，空间是宝贵的，流中的每个字节的索引不是用64位的索引表示的，而是用32位的“序列号”或“seqno”表示的。这增加了三个复杂性:

1. **您的实现需要为32位整数进行规划**：TCP中的流可以是任意长的——对于可以通过TCP发送的字节流的长度没有限制。但是232字节只有4GiB，并不是很大。一旦一个32位的序列号计数到232−1，流中的下一个字节的序列号将为0。
2. **TCP序列号从一个随机值开始**：为了提高安全性，并避免被属于同一端点之间早期连接的旧段所混淆，TCP试图确保序列号不会被猜测，并且不太可能重复。所以流的序列号不是从0开始的。流中的第一个序列号是一个随机的32位数字，称为初始序列号(Initial sequence number, ISN)。这是表示SYN(流的开始)的序列号。其余的序列号在此之后正常运行:数据的第一个字节将有ISN+1 (mod 232)的序列号，第二个字节将有ISN+2 (mod 232)，等等。
3. **每个逻辑开始和结束占用一个序列号**：除了确保接收到所有字节的数据外，TCP还确保可靠地接收流的开始和结束。因此，在TCP中SYN (start -ofstream)和FIN (end- stream)控制标志被分配了序列号。每一个都占用一个序列号。(SYN标志占用的序列号是ISN。)流中的每个数据字节也占用一个序列号。请记住，SYN和FIN不是流本身的一部分，也不是“字节”——它们表示字节流本身的开始和结束。

![](https://kiprey.github.io/2021/11/cs144-lab2/image-20211107105751818.png)

```cpp
#ifndef SPONGE_LIBSPONGE_WRAPPING_INTEGERS_HH
#define SPONGE_LIBSPONGE_WRAPPING_INTEGERS_HH

#include <cstdint>
#include <ostream>

//! \brief A 32-bit integer, expressed relative to an arbitrary initial sequence number (ISN)
//! \note This is used to express TCP sequence numbers (seqno) and acknowledgment numbers (ackno)
class WrappingInt32 {
  private:
    uint32_t _raw_value;  //!< The raw 32-bit stored integer

  public:
    //! Construct from a raw 32-bit unsigned integer
    explicit WrappingInt32(uint32_t raw_value) : _raw_value(raw_value) {}

    uint32_t raw_value() const { return _raw_value; }  //!< Access raw stored value
};

//! Transform a 64-bit absolute sequence number (zero-indexed) into a 32-bit relative sequence number
//! \param n the absolute sequence number
//! \param isn the initial sequence number
//! \returns the relative sequence number
WrappingInt32 wrap(uint64_t n, WrappingInt32 isn);

//! Transform a 32-bit relative sequence number into a 64-bit absolute sequence number (zero-indexed)
//! \param n The relative sequence number
//! \param isn The initial sequence number
//! \param checkpoint A recent absolute sequence number
//! \returns the absolute sequence number that wraps to `n` and is closest to `checkpoint`
//!
//! \note Each of the two streams of the TCP connection has its own ISN. One stream
//! runs from the local TCPSender to the remote TCPReceiver and has one ISN,
//! and the other stream runs from the remote TCPSender to the local TCPReceiver and
//! has a different ISN.
uint64_t unwrap(WrappingInt32 n, WrappingInt32 isn, uint64_t checkpoint);

//! \name Helper functions
//!@{

//! \brief The offset of `a` relative to `b`
//! \param b the starting point
//! \param a the ending point
//! \returns the number of increments needed to get from `b` to `a`,
//! negative if the number of decrements needed is less than or equal to
//! the number of increments
inline int32_t operator-(WrappingInt32 a, WrappingInt32 b) { return a.raw_value() - b.raw_value(); }

//! \brief Whether the two integers are equal.
inline bool operator==(WrappingInt32 a, WrappingInt32 b) { return a.raw_value() == b.raw_value(); }

//! \brief Whether the two integers are not equal.
inline bool operator!=(WrappingInt32 a, WrappingInt32 b) { return !(a == b); }

//! \brief Serializes the wrapping integer, `a`.
inline std::ostream &operator<<(std::ostream &os, WrappingInt32 a) { return os << a.raw_value(); }

//! \brief The point `b` steps past `a`.
inline WrappingInt32 operator+(WrappingInt32 a, uint32_t b) { return WrappingInt32{a.raw_value() + b}; }

//! \brief The point `b` steps before `a`.
inline WrappingInt32 operator-(WrappingInt32 a, uint32_t b) { return a + -b; }
//!@}

#endif  // SPONGE_LIBSPONGE_WRAPPING_INTEGERS_HH

```

这段代码定义了一个名为`WrappingInt32`的类，表示相对于一个任意初始序列号（ISN）的32位整数。它被用来表示TCP序列号（seqno）和确认号（ackno）。此外，还定义了一些帮助函数，用于转换绝对序列号和相对序列号之间的关系。

具体来说，这里的`WrappingInt32`类只有一个私有成员变量`_raw_value`，它表示一个32位无符号整数的原始值。类中定义了一个公有构造函数`explicit WrappingInt32(uint32_t raw_value)`，用于将一个无符号整数转换为`WrappingInt32`对象。类还提供了一个公有成员函数`uint32_t raw_value() const`，用于访问对象的原始值。

此外，还定义了两个函数`wrap`和`unwrap`，分别用于将绝对序列号转换为相对序列号，以及将相对序列号转换为绝对序列号。`wrap`函数的输入参数为一个64位无符号整数`n`和一个`WrappingInt32`对象`isn`，输出为一个`WrappingInt32`对象，表示`n`相对于`isn`的相对序列号。`unwrap`函数的输入参数为一个`WrappingInt32`对象`n`，一个`WrappingInt32`对象`isn`，以及一个64位无符号整数`checkpoint`，输出为一个64位无符号整数，表示最接近`checkpoint`并相对于`isn`的序列号值为`n`的绝对序列号。

最后，还定义了一些辅助函数，如`operator-`，用于计算两个`WrappingInt32`对象之间的差值，`operator==`和`operator!=`用于比较两个`WrappingInt32`对象是否相等，`operator<<`用于将一个`WrappingInt32`对象输出到流中，以及`operator+`和`operator-`，分别用于将一个`WrappingInt32`对象向前或向后移动一定的距离。

```cpp

//! Transform an "absolute" 64-bit sequence number (zero-indexed) into a WrappingInt32
//! \param n The input absolute 64-bit sequence number
//! \param isn The initial sequence number
WrappingInt32 wrap(uint64_t n, WrappingInt32 isn) {
    return isn + n;
}

//! Transform a WrappingInt32 into an "absolute" 64-bit sequence number (zero-indexed)
//! \param n The relative sequence number
//! \param isn The initial sequence number
//! \param checkpoint A recent absolute 64-bit sequence number
//! \returns the 64-bit sequence number that wraps to `n` and is closest to `checkpoint`
//!
//! \note Each of the two streams of the TCP connection has its own ISN. One stream
//! runs from the local TCPSender to the remote TCPReceiver and has one ISN,
//! and the other stream runs from the remote TCPSender to the local TCPReceiver and
//! has a different ISN.
uint64_t unwrap(WrappingInt32 n, WrappingInt32 isn, uint64_t checkpoint) {
    uint32_t offset = n.raw_value() - wrap(checkpoint, isn).raw_value();
    uint64_t res = checkpoint + offset;
    
    if (offset > (0x80000000) && res >= (0x100000000)) {
        res -= (0x100000000);
    }

    return res;
}
```

这段代码包含了两个函数的实现，一个是 `wrap`，另一个是 `unwrap`。

`wrap` 函数将一个 64 位的绝对序列号转换为一个 32 位的相对序列号，以 `isn` 为初始序列号。

`unwrap` 函数将一个 32 位的相对序列号转换为一个 64 位的绝对序列号，以 `isn` 为初始序列号，并指定一个最近的绝对序列号 `checkpoint`，函数的返回值是一个绝对序列号，它等于相对序列号 `n` 对应的绝对序列号，同时又尽可能接近于 `checkpoint`。

其中 `wrap` 函数的实现比较简单，直接将输入的绝对序列号 `n` 加上初始序列号 `isn`，得到一个相对序列号即可。

而 `unwrap` 函数的实现稍微复杂一些。首先计算 `n` 和 `checkpoint` 之间的偏移量 `offset`，即 `n` 对应的绝对序列号与 `checkpoint` 的绝对序列号之差。然后将 `offset` 加到 `checkpoint` 上，就得到了 `n` 对应的绝对序列号 `res`。

这里需要注意一个问题，当 `offset` 的值比较大时（即大于等于 0x80000000），此时 `n` 对应的序列号可能要“绕一圈”，从而超过了 32 位的表示范围。因此，如果 `res` 大于等于 0x100000000，则需要减去 0x100000000，即从头开始计数，避免超出 32 位的表示范围。

### Implementing the TCP receiver

```cpp

//! Receives and reassembles segments into a ByteStream, and computes
//! the acknowledgment number and window size to advertise back to the
//! remote TCPSender.
class TCPReceiver {
    //! Our data structure for re-assembling bytes.
    StreamReassembler _reassembler;

    //! The maximum number of bytes we'll store.
    size_t _capacity;

    std::optional<WrappingInt32> _ackno{};
    WrappingInt32 _isn{0};
    WrappingInt32 _seq{0};
    // the index of the last reassembled byte
    uint64_t _checkpt{0};

  public:
    //! \brief Construct a TCP receiver
    //!
    //! \param capacity the maximum number of bytes that the receiver will
    //!                 store in its buffers at any give time.
    TCPReceiver(const size_t capacity) : _reassembler(capacity), _capacity(capacity) {}

    //! \name Accessors to provide feedback to the remote TCPSender
    //!@{

    //! \brief The ackno that should be sent to the peer
    //! \returns empty if no SYN has been received
    //!
    //! This is the beginning of the receiver's window, or in other words, the sequence number
    //! of the first byte in the stream that the receiver hasn't received.
    std::optional<WrappingInt32> ackno() const;

    //! \brief The window size that should be sent to the peer
    //!
    //! Operationally: the capacity minus the number of bytes that the
    //! TCPReceiver is holding in its byte stream (those that have been
    //! reassembled, but not consumed).
    //!
    //! Formally: the difference between (a) the sequence number of
    //! the first byte that falls after the window (and will not be
    //! accepted by the receiver) and (b) the sequence number of the
    //! beginning of the window (the ackno).
    size_t window_size() const;
    //!@}

    //! \brief number of bytes stored but not yet reassembled
    size_t unassembled_bytes() const { return _reassembler.unassembled_bytes(); }

    //! \brief handle an inbound segment
    void segment_received(const TCPSegment &seg);

    //! \name "Output" interface for the reader
    //!@{
    ByteStream &stream_out() { return _reassembler.stream_out(); }
    const ByteStream &stream_out() const { return _reassembler.stream_out(); }
    //!@}
};
```

`TCPReceiver` 的解释如下：

TCP 接收器用于接收和重新组装 TCP Segment，并计算确认号和窗口大小以返回给远程发送器。

主要成员变量和函数包括：

- `StreamReassembler _reassembler`：用于重新组装字节的数据结构；
- `size_t _capacity`：TCP 接收器可以同时存储的最大字节数；
- `std::optional<WrappingInt32> _ackno{}`：应该发送到对等端的 `ackno`，如果没有接收到 `SYN` 则为空；
- `WrappingInt32 _isn{0}`：初始序列号（`ISN`）；
- `WrappingInt32 _seq{0}`：接收到的最后一个 TCP 分段的序列号；
- `uint64_t _checkpt{0}`：最后一个重新组装的字节的索引（绝对序列号）；
- `ackno()`：返回应该发送到对等端的 ackno，如果没有接收到 `SYN` 则为空；
- `window_size()`：返回应该发送到对等端的窗口大小；
- `unassembled_bytes()`：返回已存储但尚未重新组装的字节数；
- `segment_received()`：处理传入的 TCP 分段。

该类的主要功能是：

- 接收传入的 TCP 分段，并将其发送到 `StreamReassembler` 进行重新组装；
- 计算应该发送给远程 `TCPSender` 的 `ackno` 和窗口大小，以便 `TCPSender` 知道还有多少可用的空间；
- 提供 `stream_out()` 函数，用于读取已重新组装的数据。

### TCP receiver 在连接生命周期中的状态转移

![](https://kiprey.github.io/2021/11/cs144-lab2/image-20211107122822566.png)

```cpp

void TCPReceiver::segment_received(const TCPSegment &seg) {
    /**
     * @note Listen state
     * @def not ackno().has_value() 
     */
    if (!_ackno.has_value()) {
        // Handshake
        if (seg.header().syn) {
            auto rd = get_random_generator();
            _isn = WrappingInt32(rd());
            _seq = seg.header().seqno;

            _reassembler.push_substring(move(seg.payload().copy()), 0, seg.header().fin);
            
            // SYN or FIN make _ackno+1
            auto ctrl = seg.length_in_sequence_space() - seg.payload().size();
            _ackno = WrappingInt32(move(_seq)) + ctrl + _reassembler.first_unassembled();
        }

        return;
    } 

    /**
     * @note FIN_RECV state
     * @def stream_out.input_ended()
     */
    if (_ackno.has_value() && !stream_out().input_ended()) {
        
        /**
         * @note SYN_RECV state
         * @def ackno.has_value() and not stream_out.input_ended()
         * @code 48 - 54
         */
        auto index = unwrap(move(seg.header().seqno), move(_seq + 1), _checkpt);  // "+ 1" for the "SYN"
        
        // data too far, considered out of data
        if (index > _checkpt && ((index - _checkpt) & 0x80000000)) {
            return;
        }
        
        // data too far, considered out of data
        if (index < _checkpt && ((_checkpt - index) & 0x80000000)) {
            return;
        }

        _reassembler.push_substring(move(Buffer(move(seg.payload().copy()))), index, seg.header().fin);
        _ackno = _ackno.value() + _reassembler.first_unassembled() - _checkpt;

        // FIN should make _ackno + 1
        if (stream_out().input_ended()) {
            _ackno = _ackno.value() + 1;
        }

        _checkpt = _reassembler.first_unassembled();
    }
}
```

这段代码实现了TCP接收端的主要逻辑，即处理TCP段并将它们重新组装成字节流。代码中有几个状态，分别对应TCP协议中的连接建立、连接终止和正常数据传输的不同阶段。

首先，如果接收端还没有收到 `SYN`，就判断接收到的 `TCP` 段是否是 `SYN`，如果是，则在随机生成一个初始序列号后，将接收到的数据传递给 `StreamReassembler` 进行重新组装，并更新需要发送给发送方的确认序列号 `_ackno`。如果还没有收到 `SYN`，则直接返回。

如果接收端已经收到了 `SYN`，但还没有收到 `FIN`，则在接收到的TCP段中查找相对于已经接收的字节数偏移量，并使用 `StreamReassembler` 对接收到的数据进行重新组装。在重新组装之后，需要更新确认序列号 `_ackno`，并且如果数据流已经结束，需要将确认序列号加一。如果接收到的数据已经过期或已经在之前的数据段中处理过，则不需要重新组装数据，直接返回即可。

如果接收端已经收到了FIN，则不再接受更多的数据，并将 `_ackno` 加 1 以告诉发送端已经收到了所有数据。

## 完整代码

- [wrapping\_integers.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/wrapping_integers.hh)
- [wrapping\_integers.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/wrapping_integers.cc)
- [tcp\_receiver.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_receiver.hh)
- [tcp\_receiver.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_receiver.cc)
