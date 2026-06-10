---
title: CS144-Lab3
date: '2023-02-18T16:01:53.000Z'
updated: '2023-02-19T02:56:17.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/19/CS144-Lab3
oldUrl: /2023/02/19/CS144-Lab3/
excerpt: >-
  在实验0中，你实现了流控制字节流（ByteStream）的抽象。
  在实验1和2中，你实现了将不可靠数据报中的段转换为传入字节流的工具：StreamReassembler和TCPReceiver。
  现在，在实验3中，你将实现连接的另一端：一个将出站字节流转换为不可靠数据报中发送段的工具。
  最后，在第4个实验中，你将结合前几个实验的工作，创建一个工作的TCP实现...
---
## 概述

在实验0中，你实现了流控制字节流（`ByteStream`）的抽象。

在实验1和2中，你实现了将不可靠数据报中的段转换为传入字节流的工具：`StreamReassembler`和`TCPReceiver`。

现在，在实验3中，你将实现连接的另一端：一个将出站字节流转换为不可靠数据报中发送段的工具。

最后，在第4个实验中，你将结合前几个实验的工作，创建一个工作的TCP实现：`TCPConnection`，其中包含`TCPSender`和`TCPReceiver`。你将用它来与世界各地的真实服务器进行对话。

![image-20220322233230399](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220322233230399.png)

## 开始

你对`TCPSender`的实现将使用与你在实验0-2中使用的相同的Sponge库，并有额外的类和测试。为了开始进行作业：

1. 请确保你已经提交了你在实验2中的所有解决方案。请不要修改`libsponge`目录顶层以外的任何文件，或者`webget.cc`。否则，你可能会在合并实验3的启动代码时遇到麻烦。
2. 在实验作业的存储库中，运行`git fetch`来检索实验作业的最新版本。
3. 通过运行`git merge origin/lab3-startercode`，下载实验3的启动代码。
4. 在`build`目录中，编译源代码：`make`（编译时可以运行`make -j4`以使用四个处理器）。
5. 在`build`目录外，打开并开始编辑`writeups/lab3.md`文件。这是你实验报告的模板，将包含在你提交的内容中。

## 实验3：TCP发送方

TCP是一个协议，通过不可靠的数据报可靠地传输一对流量控制字节流（每个方向一个）。双方参与TCP连接，并且每一方同时充当“发送方”（其自身的传出字节流）和“接收方”（传入字节流）。双方被称为连接的“端点”或“对等点”。

本周，你将实现TCP的“发送方”部分，负责读取`ByTestStream`（由某些发送方应用程序创建并写入），并将流转换为一系列传出TCP段。在远程端，TCP接收方（重要的是要记住，接收方可以是有效TCP接收方的任何实现，而不一定是你自己的TCPReceiver。互联网标准最有价值的一点是，它们在端点之间建立一种通用语言，否则（指的是没有通用语言的情况），这些端点的行为可能会非常不同。）将这些段（那些到达的段，它们不一定都能到达）转换回原始字节流，并将确认和窗口发送回发送方。

![image-20230217113144228](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20230217113144228.png)

`TCPSender`将负责：

- 跟踪接收方的窗口（处理传入的确认号（**ackno**）和窗口大小（**window size**）） ；
- 尽可能通过读取`ByTestStream`、创建新的TCP段（包括SYN和FIN标志，如果需要），填充窗口，并发送它们；
- 跟踪哪些段已经发送但尚未被接收方确认——我们称之为“未完成的”段；
- 如果发送后经过足够的时间但尚未确认，则重新发送未完成的段；

> 为什么要这样做？基本原则是发送接收方允许我们发送的任何内容（填充窗口），并不断重传，直到接收方确认每段内容，这称为“自动重复请求”（ARQ）。发送方将字节流分成若干段，并在接收方窗口允许的范围内发送它们。感谢你上周的工作，我们知道，只要远程TCP接收方至少收到一次带有索引标记的字节，就可以重构字节流，而无论其顺序如何。发送方的工作是确保接收方至少获得每个字节一次。

### `TCPSender` 应在何时断定某个段丢失并再次发送？

你的 `TCPSender` 将发送一组 `TCPSegments`。每个将包含来自传出 `ByTestStream` 的一个子字符串（可能为空），用序列号索引以指示其在流中的位置，并在流的开头用 `SYN` 标志标记，在流的结尾用 `FIN` 标志标记。

除了发送这些段外，`TCPSender` 还必须跟踪其未完成的段，直到它们占用的序列号被完全确认。`TCPSender` 的所有者将定期调用 `TCPSender` 的 `tick` 方法，以指示时间的流逝。`TCPSender` 负责查看其未完成的 `TCPSegments` 集合，并确定最早的已发送的段是否在未完成的情况下因为时间过长而未被确认（即，未确认其所有序列号）。如果是，则需要重新传输（再次发送）。

以下是“由于太长时间未完成”的含义规则。（这些是基于 `TCP` “真实”规则的简化版本：`RFC 6298`，建议5.1至5.6。这里的版本有点简化，但是你的TCP实现仍然能够与Internet上的真实服务器进行通信。）你将要实现的逻辑非常详细，但我们不希望你担心隐藏的测试用例试图绊倒你，或将其视为 `SAT`上的文字问题。本周我们将为你提供一些合理的单元测试，完成整个 `TCP` 实现后，在实验4中进行更全面的集成测试。只要你100%通过了这些测试，并且你的实现是合理的，就没事了。

> 为什么要这样做？总的目标是让发送方及时检测到段丢失并需要重新发送的情况。重发前的等待时间是很重要的：你不希望发送方等待太长的时间来重发一个网段（因为这会延迟流向接收应用程序的字节），但你也不希望它重新发送一段如果发送方再等一段时间就会被确认的信息，这会浪费互联网的宝贵容量。

1. 每隔几毫秒，你的 `TCPSender` 的 `tick` 方法就会被调用一次，它的参数是告诉你自上次调用该方法以来已经过了多少毫秒。使用参数可以维护 `TCPSender`已激活的总毫秒数的概念。请不要试图从操作系统或CPU调用任何“time”或“clock”函数——tick方法是你唯一访问时间流逝的方法。这样可以保持事物的确定性和可测试性。
2. 当构建`TCPSender`时，会给它一个参数，告诉它\*\*重传超时（retransmission timeout, RTO）\*\*的“初始值”。RTO是在重新发送一个未完成的TCP段之前要等待的毫秒数。RTO的值会随时间变化，但“初始值”保持不变。启动代码将RTO的“初始值”保存在一个名为 `_initial_retransmission_timeout` 的成员变量中。
3. 你将实现重传计时器**timer**：一个可以在某个时间启动的警报，一旦RTO过期，警报就会熄灭（或”过期”）。我们强调，这种时间流逝的概念来自于被调用的tick方法，而不是通过获取一天中的实际时间。
4. 每次发送包含数据（在序列空间中长度非零）的段（不管是第一次还是重传），如果 `timer` 没有运行，就启动它，使它在RTO毫秒后失效（对于RTO的当前值）。
5. 当所有未完成的数据都被确认后，关闭重传计时器。
6. 如果 `tick` 被调用，并且重传计时器已经过期：
   - (a) 重传TCP接收方尚未完全确认的最早（最低序列号）段。你需要在一些内部数据结构中存储未发送的段，以便能够做到这一点。
   - (b) 如果窗口大小为非零：
     - i. 跟踪连续重新传输的次数，并增加它，因为你刚刚重新传输了一些内容。你的`TCPConnection`将使用这些信息来决定连接是否无望（连续重传次数过多）并需要中止。
     - ii. 将RTO的值增加一倍。（这被称为“指数回退”——它会减慢糟糕网络上的重传速度，以避免进一步堵塞工作。我们将在稍后的课堂上了解更多有关这方面的内容。）
   - © 启动重传timer，使其在RTO毫秒后过期（对于前一个要点中概述的加倍操作后的RTO值）。
7. 当接收方给发送方确认成功接收新数据的`ackno`时（该`ackno`反映了一个大于之前的任何`ackno`的绝对序列号）。
   - (a) 将RTO调回其“初始值”。
   - (b) 如果发送方有任何未完成的数据，重新启动重传timer，使其在RTO毫秒后失效（对于RTO的当前值）。
   - © 将“连续重传”的计数重设为零。

你可能希望在单独的类中实现重传计时器的功能，这取决于你自己。如果需要，请将其添加到现有文件（`tcp_sender.hh`和`tcp_receiver.hh`）。

### 实现TCP发送方

Ok！我们已经讨论了TCP发送方所做的基本概念（给定一个传出的`ByteStream`，把它分割成若干段，发送给接收者，如果它们没有很快得到确认，就继续重新发送）。我们还讨论了何时得出结论：未完成的段已经丢失，需要重新发送。

现在是你的`TCPSender`将提供的具体接口的时候了。有四个重要的事件需要它来处理，每一个事件都可能最终发送一个`TCPSegment`：

1. `fill_window`：`TCPSender`被要求填充窗口：它从其输入的`ByteStream`中读取并以`TCPSegments`的形式发送尽可能多的字节，只要窗口中有新的字节要读取和可用空间。你要确保你发送的每一个`TCPSegment`都能完全放入接收方的窗口中。使每个单独的`TCPSegment`尽可能大，但不能大于`TCPConfig::MAX_PAYLOAD_SIZE`（1452字节）所给的值。你可以使用`TCPSegment::length_in_sequence_space()`方法来计算一个段所占用的序列号的总数。你的TCPSender维护着一个名为`_next_seqn`的成员变量，它存储着从零开始的发送的绝对序列号。对于你发送的每一个段，你都要让`_next_seqno`增加段的长度，以便知道下一段的序列号。
2. `ack_received`：从接收方收到一个确认信息，包括窗口的左边缘（= `ackno`）和右边缘（= `ackno + window size`）。`TCPSender`应该查看其未完成的段的集合，并删除任何现在已被完全确认的段（`ackno`大于该段中的所有序列号）。如果打开了新空间（指窗口变大），`TCPSender`可能需要再次填充窗口。如果`ackno`无效，即确认发送方尚未发送的数据，则此方法返回false。
3. `tick`：经过的时间；`TCPSender`将检查重传计时器是否已过期，如果是，则以最低的序列号重传未发送的段。（重要的是，重新传输的决定不必看接收方的窗口：该段在第一次发送时落在窗口内，并且尚未确认，因此现在仍在接收方的窗口内。接收方不应该“收缩”窗口的右边缘，你可以假设右边缘始终保持不变或向右移动。）
4. `send_empty_segment`：`TCPSender`应该生成并发送一个在序列空间中长度为零的`TCPSegment`，并将序列号正确设置为`_next_seqno`。如果所有者（你下周要实现的TCPConnection）想发送一个空的ACK段，这很有用。这种段（不携带数据，不占用序列号）不需要作为”未完成”来跟踪，也不会被重传。

为了完成实验3，请查看文档中的完整接口，网址是https://cs144.github.io/doc/lab3/class\_t\_c\_p\_sender.html，并在`tcp_sender.hh`和`tcp_sender.cc`文件中实现完整的`TCPSender`公共接口。我们预计你会想添加私有方法和成员变量，可能还有一个辅助类。

### 常见问题和特殊情况

- 如何“发送”一个片段？

  把它push到`_segments_out`队列中。就你的`TCPSender`而言，当你把它push到这个队列时，就认为它已经发送了。很快，所有者就会出现并pop它（使用公共的`segments_out()`访问器方法），并真正发送它。
- 等等，我如何既“发送”一段，又将同一段记录为未完成，以便我知道以后重新传输什么？那我不是要给每个网段做一个副本吗？这是不是很浪费？

  当你发送一个包含数据的段时，你可能想把它push到`_segments_out`队列中，同时在内部的数据结构中保留一个副本，让你跟踪未完成的网段，以便可能的重传。这并不是很浪费，因为段的有效载荷被存储为引用计数的只读字符串（一个`Buffer`对象）。所以不用担心，它实际上并没有复制有效载荷数据。
- 在我从接收方得到`ACK`之前，我的`TCPSender`应该假定接收方的窗口大小是多少？

  一个字节。
- 接收方告诉我它的窗口大小是零字节。我是否应该被卡住，不再发送任何数据？

  否。如果接收方告诉你它的窗口长度是零字节，请将该信息保存为任何其他窗口使用（advertisement），因为它对3.1中描述的重传行为很重要。但当需要填充窗口时，请将窗口大小设置为一个字节。这被称为“零窗口探测”——这是一种定期探测接收方的方式，看看自从我们上次听到他们的消息后，他们是否碰巧在窗口中开辟了一些更多的空间。最坏的情况是，接收方会忽略你的一个字节段。（在一个更适合生产的TCP实现中，零窗口探测行为会更复杂一些，但也不会过于复杂。）
- 如果确认仅部分确认某些未完成的部分，我该怎么办？我是否应该尝试删除已确认的字节？

  TCP发送方可以这样做，但就课程而言，没有必要搞得太复杂。在完全确认之前，将每个段视为完全未完成——它所占用的所有序列号都小于ackno。
- 如果我发送了三个包含 “a”、”b “和 “c “的独立段，但它们从未被确认，我可以在以后将它们重新传送到一个包含 “abc “的大段吗？还是我必须单独重发每个段？

  再说一遍：TCP发送方可以做到这一点，但就本课程而言，没有必要搞得太花哨。只要单独跟踪每个未处理的段，当重传计时器到期时，再次发送最早的未处理段。
- 我应该在“未处理”数据结构中存储空段，并在必要时重发它们吗？

  不，只有那些传递一些数据的网段（即在序列空间中消耗一些长度的网段）才应该被追踪为未完成的网段，并可能被重传。一个空的ACK不需要被记住，也不需要被重传。
- 如果这个PDF出来后还有更多的FAQ，我在哪里可以看到？

  请定期查看网站（[https://cs144.github.io/lab\_faq.html）和Piazza。](https://cs144.github.io/lab_faq.html%EF%BC%89%E5%92%8CPiazza%E3%80%82)

### RTO Timer

- [RFC6298](https://datatracker.ietf.org/doc/rfc6298/)

![image-20230219091320947](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20230219091320947.png)

```cpp
class RetransmissionTimer {
  private:
    long long _time_rest;
    bool _on_off;

  public:
    RetransmissionTimer(uint RTO = 0)
      : _time_rest(RTO), _on_off(false) {}
    
    void reset(uint RTO) {
      _on_off = true;
      _time_rest = RTO;
    }

    bool passing(const size_t ms_since_last_tick) {
      _time_rest -= ms_since_last_tick;
      return _on_off && (_time_rest <= 0);
    }

    bool activated() const { return _on_off; }
    void stop() { _on_off = false; }
};
```

这段代码定义了一个重传定时器类 `RetransmissionTimer`，用于在 TCP 协议中进行超时重传。该类具有以下成员变量和成员函数：

- `_time_rest`：表示当前定时器剩余的时间（以毫秒为单位），默认为0。
- `_on_off`：表示当前定时器是否处于开启状态，默认为关闭状态。
- `RetransmissionTimer` 构造函数：可以传入一个可选的 RTO（重传超时）值作为参数，用于初始化 `_time_rest` 和 `_on_off`。
- `reset` 成员函数：用于重新设置定时器的状态，将 `_on_off` 置为 `true`，将 `_time_rest` 设置为 RTO 的值。
- `passing` 成员函数：接受一个时间间隔 `ms_since_last_tick` 的参数，表示距离上一次定时器计时已经过去了多少毫秒。函数首先将 `_time_rest` 减去这个时间间隔，然后返回 `_on_off && (_time_rest <= 0)` 的结果。如果定时器开启且剩余时间小于等于 0，则表示定时器已经超时，函数返回 true。
- `activated` 成员函数：返回定时器是否处于开启状态。
- `stop` 成员函数：将定时器关闭，将 `_on_off` 置为 `false`。

### TCPSender

TCPSender的状态转移

![](https://kiprey.github.io/2021/11/cs144-lab3/image-20211109080457029.png)

```cpp
//! Accepts a ByteStream, divides it up into segments and sends the
//! segments, keeps track of which segments are still in-flight,
//! maintains the Retransmission Timer, and retransmits in-flight
//! segments if the retransmission timer expires.
class TCPSender {
  private:
    //! our initial sequence number, the number for our SYN.
    WrappingInt32 _isn;

    //! outbound queue of segments that the TCPSender wants sent
    std::queue<TCPSegment> _segments_out{};

    //! retransmission timer for the connection
    unsigned int _initial_retransmission_timeout;

    //! outgoing stream of bytes that have not yet been sent
    ByteStream _stream;

    //! the (absolute) sequence number for the next byte to be sent
    uint64_t _next_seqno{0};

    uint _consecutive_retransmission_count{0};
    uint _retransmission_timeout;
    
    RetransmissionTimer _timer;

    size_t _window_size;
    size_t _bytes_in_flight;

    enum TCPState { CLOSED, SYN_SENT, SYN_ACKED, FIN_SENT, FIN_ACKED };
    TCPState _state{ CLOSED };

    std::queue<TCPSegment> _segments_in_flight;

    static bool segcmp(const TCPSegment &seg1, const TCPSegment &seg2) {
      return seg1.header().seqno.raw_value() > seg2.header().seqno.raw_value();
    }

  public:
    //! Initialize a TCPSender
    TCPSender(const size_t capacity = TCPConfig::DEFAULT_CAPACITY,
              const uint16_t retx_timeout = TCPConfig::TIMEOUT_DFLT,
              const std::optional<WrappingInt32> fixed_isn = {});

    //! \name "Input" interface for the writer
    //!@{
    ByteStream &stream_in() { return _stream; }
    const ByteStream &stream_in() const { return _stream; }
    //!@}

    //! \name Methods that can cause the TCPSender to send a segment
    //!@{

    //! \brief A new acknowledgment was received
    void ack_received(const WrappingInt32 ackno, const uint16_t window_size);

    //! \brief Generate an empty-payload segment (useful for creating empty ACK segments)
    void send_empty_ack();
    void send_empty_rst();

  	void fill_segment(TCPSegment& seg);
  
    //! \brief create and send segments to fill as much of the window as possible
    void fill_window();

    //! \brief Notifies the TCPSender of the passage of time
    void tick(const size_t ms_since_last_tick);
    //!@}

    //! \name Accessors
    //!@{

    //! \brief How many sequence numbers are occupied by segments sent but not yet acknowledged?
    //! \note count is in "sequence space," i.e. SYN and FIN each count for one byte
    //! (see TCPSegment::length_in_sequence_space())
    size_t bytes_in_flight() const;

    //! \brief Number of consecutive retransmissions that have occurred in a row
    unsigned int consecutive_retransmissions() const;

    //! \brief TCPSegments that the TCPSender has enqueued for transmission.
    //! \note These must be dequeued and sent by the TCPConnection,
    //! which will need to fill in the fields that are set by the TCPReceiver
    //! (ackno and window size) before sending.
    std::queue<TCPSegment> &segments_out() { return _segments_out; }
    //!@}

    //! \name What is the next sequence number? (used for testing)
    //!@{

    //! \brief absolute seqno for the next byte to be sent
    uint64_t next_seqno_absolute() const { return _next_seqno; }

    //! \brief relative seqno for the next byte to be sent
    WrappingInt32 next_seqno() const { return wrap(_next_seqno, _isn); }
    //!@}
};
```

该代码定义了一个 TCPSender 类，表示 TCP 的发送端。

该类有以下成员变量：

- \_isn：TCP 连接的初始序列号，也就是 SYN 包的序列号。
- \_segments\_out：已经准备好的待发送的 TCP 段。
- \_initial\_retransmission\_timeout：初始的重传超时时间。
- \_stream：未发送的字节流。
- \_next\_seqno：下一个待发送的字节的序列号。
- \_consecutive\_retransmission\_count：连续重传的次数。
- \_retransmission\_timeout：当前的重传超时时间。
- \_timer：TCP 发送端的重传定时器。
- \_window\_size：TCP 接收端的窗口大小。
- \_bytes\_in\_flight：已经发送但未确认的字节数。
- \_state：TCP 连接的状态，包括 CLOSED、SYN\_SENT、SYN\_ACKED、FIN\_SENT 和 FIN\_ACKED。
- \_segments\_in\_flight：已经发送但未确认的 TCP 段。

该类有以下成员函数：

- TCPSender()：构造函数。
- stream\_in()：获取待发送的字节流。
- ack\_received()：接收到 ACK 报文，更新状态信息。
- send\_empty\_ack() 和 send\_empty\_rst()：发送空 ACK 和 RST 报文。
- fill\_window()：尽可能填充窗口并创建并发送 TCP 段。
- tick()：定时器回调函数。
- bytes\_in\_flight() 和 consecutive\_retransmissions()：获取未确认的字节数和连续重传的次数。
- segments\_out()：获取已经准备好的待发送的 TCP 段。
- next\_seqno\_absolute() 和 next\_seqno()：获取下一个待发送字节的绝对序号和相对序号。

### tick 函数

```cpp
//! \param[in] ms_since_last_tick the number of milliseconds since the last call to this method
void TCPSender::tick(const size_t ms_since_last_tick) { 
    // If tick is called and the retransmission timer has expired
    if (_timer.activated() && _timer.passing(ms_since_last_tick)) {
        // 6. (a) 
        TCPSegment seg = _segments_in_flight.front();

        // If the window size is nonzero
        if (_window_size != 0) {
            // 6. (b) i
            _consecutive_retransmission_count ++ ;
            // 6. (b) ii
            _retransmission_timeout *= 2;
        }

        // 6. (c)
        if (_consecutive_retransmission_count <= TCPConfig::MAX_RETX_ATTEMPTS) {
            _segments_out.push(seg);
            _timer.reset(_retransmission_timeout);
        } else {
            _timer.stop();
        }
    }
}
```

上述代码是 TCP 发送方 TCPSender 的 tick() 方法的实现。tick() 方法会在每次定时器触发时被调用，参数 `ms_since_last_tick` 表示自上次调用该方法以来经过的时间。

代码中的注释已经非常详细了，下面是一些简要的解释：

首先，如果定时器已经触发且已经过了超时时间，就需要对当前正在传输中的段进行处理。

然后，如果窗口大小是非零的，就将当前段的连续重传次数加 1，同时将重传超时时间加倍。

如果连续重传次数不超过最大重传次数，则将该段推入待发送队列 `_segments_out` 中，同时重置定时器。如果超过最大重传次数，则停止定时器。

整个过程的目的是确保 TCP 连接上的数据能够被成功传输，即使在网络出现故障、丢包等问题时也能够自动进行重传。

### ack\_received

```cpp
//! \param ackno The remote receiver's ackno (acknowledgment number)
//! \param window_size The remote receiver's advertised window size
void TCPSender::ack_received(const WrappingInt32 ackno, const uint16_t window_size) {
    // do not receive
    if (unwrap(ackno, _isn, _next_seqno) > _next_seqno) {
        return;
    }

    _window_size = window_size;

    // from SYN_SENT state to SYN_ACKED state
    if (_state == SYN_SENT && ackno == wrap(1, _isn)) {
        _state = SYN_ACKED;
    }

    // no segments to receive
    if (_segments_in_flight.empty()) {
        return;
    }

    TCPSegment seg = _segments_in_flight.front();
    bool successful_receipt_of_new_data = false;

    auto seq = unwrap(seg.header().seqno, _isn, _next_seqno) + seg.length_in_sequence_space();
    auto ack = unwrap(ackno, _isn, _next_seqno);

    while (seq <= ack) {
        _bytes_in_flight -= seg.length_in_sequence_space();
        _segments_in_flight.pop();
        successful_receipt_of_new_data = true;

        if (_segments_in_flight.empty()) {
            break;
        }

        seg = _segments_in_flight.front();

        seq = unwrap(seg.header().seqno, _isn, _next_seqno) + seg.length_in_sequence_space();
        ack = unwrap(ackno, _isn, _next_seqno);
    }

    if (successful_receipt_of_new_data) {
        // 7. (a) Set the RTO back to its “initial value.”
        _retransmission_timeout = _initial_retransmission_timeout;

        // 7. (b) If the sender has any outstanding data, restart the retransmission timer 
        // so that it will expire after RTO milliseconds (for the current value of RTO).
        if (!_segments_in_flight.empty()) {
            _timer.reset(_retransmission_timeout);
        } else {
            _timer.stop();
        }

        // 7. (c) Reset the count of “consecutive retransmissions” back to zero.
        _consecutive_retransmission_count = 0;
    }
}
```

这段代码是TCP发送方的一个函数，用于处理接收到的确认报文。确认报文包含远程接收方已经成功接收到的字节数以及窗口大小。

首先，代码检查接收到的确认号是否是一个有效的号码，如果确认号比已经接收到的下一个序号还要大，则说明该确认号还没有被接收到，直接返回。

然后，代码更新发送窗口大小为接收到的窗口大小。如果发送方处于 `SYN_SENT` 状态，并且收到了期望的确认号（即初始序列号加 1），则将发送方状态更新为 `SYN_ACKED` 状态。

代码继续处理接收到的确认号，查找序列号等于或小于确认号的段，并从未确认段列表中移除它们。如果成功接收到新数据，发送方将执行以下操作：

- (a) 重置重传超时计时器为其初始值。
- (b) 如果发送方有任何未确认的数据，则重新启动重传计时器，以便在 RTO 毫秒后超时（对于当前的 RTO 值）。
- © 将“连续重传计数”的计数重置为零。

最后，如果所有未确认的数据段都已经被确认，则代码停止计时器，如果还有未确认的数据，则重置计时器并更新“连续重传计数”的计数。

### fill\_segment

```cpp
void TCPSender::fill_segment(TCPSegment& seg) {
    seg.header().seqno = wrap(_next_seqno, _isn);

    _next_seqno += seg.length_in_sequence_space();
    _bytes_in_flight += seg.length_in_sequence_space();

    _segments_in_flight.push(seg);
    _segments_out.emplace(move(seg));

    if (!_timer.activated()) {
        _timer.reset(_retransmission_timeout);
    }
}
```

这段代码是 TCP 发送方在发送一个 TCP 数据报前填充数据报的头部信息，并将数据报添加到待发送队列中。

在代码中，首先使用 `wrap()` 函数计算出数据报的序列号，并将该序列号设置为数据报头部的 `seqno` 字段。然后，将发送方的下一个序列号增加数据报的序列号空间长度（即增加 `seqno + payload.size()`）以更新发送方的下一个序列号，并将数据报的序列号空间长度加入到发送方的字节流队列中以更新发送方的字节流窗口。接着，将数据报添加到正在发送队列中（`segments_in_flight`）以便在重传时能够找到该数据报，同时将数据报添加到待发送队列中（`segments_out`）。最后，如果当前计时器没有启动，则使用计时器的 `reset()` 函数启动计时器，以便在超时时重传该数据报。

### fill\_window

```cpp
void TCPSender::fill_window() {
    if (_state == CLOSED) {
        // syn_segment
        TCPSegment syn_seg;

        syn_seg.header().syn = true;
        fill_segment(syn_seg);
        
        _state = SYN_SENT;
    } else if (_state == SYN_ACKED) {
        size_t window_size = _window_size == 0 ? 1 : _window_size;

        // Congestion control
        if (_bytes_in_flight >= window_size) {
            return;
        }

        size_t bytes_sent = 0;
        size_t max_tobe_sent = window_size - _bytes_in_flight;

        while (bytes_sent < max_tobe_sent && !_stream.buffer_empty()) {
            // normal segment
            TCPSegment seg;
            seg.payload() = Buffer(move(_stream.read(min(
                TCPConfig::MAX_PAYLOAD_SIZE, max_tobe_sent - bytes_sent
            ))));
            
            bytes_sent += seg.payload().size();

            if (_stream.eof() && bytes_sent < max_tobe_sent) {
                seg.header().fin = true;
                _state = FIN_SENT;
            }

            fill_segment(seg);
        }

        if (window_size - _bytes_in_flight >= 1 && _stream.eof() && _state == SYN_ACKED) {
            // fin_segment
            TCPSegment fin_seg;

            fin_seg.header().fin = true;
            fill_segment(fin_seg);

            _state = FIN_SENT;
        }
    }
}
```

这段代码是 TCP 发送方在填充发送窗口的过程中使用的。当发送方处于 `CLOSED` 状态时，它会创建一个 `SYN` 段，通过调用 `fill_segment` 函数来将这个段添加到发送窗口中，并且将发送方的状态改为 `SYN_SENT`。

当发送方处于 `SYN_ACKED` 状态时，发送方会进行拥塞控制，确保没有过多的未确认段在传输，从而避免网络拥塞。发送方首先检查已经发送但还未被确认的字节数是否达到了窗口大小，如果达到了则停止填充窗口。如果还可以发送数据，发送方从流中读取最多 `max_tobe_sent - bytes_sent` 个字节，然后将这些字节放入 TCP 段的 `payload` 中，填写 TCP 段的首部信息，并通过调用 `fill_segment` 函数将 TCP 段添加到发送窗口中。如果此时流已经被读取完且还有一些字节没有被发送，那么发送方会创建一个 `FIN` 段，并通过 `fill_segment` 函数将 FIN 段添加到发送窗口中。如果 FIN 段也被确认，那么发送方的状态会变为 `FIN_SENT`。

## 完整代码

- [tcp\_sender.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_sender.hh)
- [tcp\_sender.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_sender.cc)
