---
title: CS144-Lab4
date: '2023-02-19T03:00:28.000Z'
updated: '2023-02-19T04:26:16.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/19/CS144-Lab4
oldUrl: /2023/02/19/CS144-Lab4/
excerpt: >-
  在实验0中，你实现了流量控制的字节流(ByteStream)的抽象概念。
  在实验1、2和3中，你实现了该抽象概念与互联网提供的抽象概念之间的转换工具：不可靠的数据报(IP或UDP)。
  现在，你已经接近顶峰：一个可以工作的TCPConnection，它结合了你的TCPSender和TCPReceiver，并能以至少100Mbit/s的速度与其他TCP实现对话。...
---
## 概述

在实验0中，你实现了流量控制的字节流(`ByteStream`)的抽象概念。

在实验1、2和3中，你实现了该抽象概念与互联网提供的抽象概念之间的转换工具：不可靠的数据报(IP或UDP)。

现在，你已经接近顶峰：一个可以工作的`TCPConnection`，它结合了你的`TCPSender`和`TCPReceiver`，并能以至少100Mbit/s的速度与其他TCP实现对话。

图1显示了整体设计：

![image-20220322233230399](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220322233230399.png)

图1：TCP实现中的模块和数据流的安排。

## 开始

你的`TCPConnection`实现将使用与你在实验0-3中使用的相同的Sponge库，并增加了类和测试。我们将给你提供支持代码，用于将TCP段读写到用户数据报(“TCP-over-UDP”)和互联网数据报(“TCP/IP”)的有效载荷中。我们还将给你一个类(`CS144TCPSocket`)，它可以包装你的`TCPConnection`，使其表现得像一个正常的流套接字，就像你在实验0中用来实现`webget`的TCPSocket。为了开始进行作业：

1. 请确保你已经提交了你在实验3中的所有解决方案。请不要修改`libsponge`目录顶层以外的任何文件，或者`webget.cc`。否则，你可能会在合并实验4的启动代码时遇到麻烦。
2. 在实验作业的存储库中，运行`git fetch`来检索实验作业的最新版本。
3. 通过运行`git merge origin/lab4-startercode`，下载实验4的启动代码。
4. 在`build`目录中，编译源代码：`make`(编译时可以运行`make -j4`以使用四个处理器)。
5. 在`build`目录外，打开并开始编辑`writeups/lab4.md`文件。这是你实验报告的模板，将包含在你提交的内容中。

## 实验4：TCP连接

本周，你将完成构建一个与互联网上数十亿台计算机和移动设备兼容的工作TCP实现。你已经完成了大部分的工作：你已经实现了发送方和接收方。本周你的工作是将它们”连接”起来，成为一个对象(`TCPConnection`)，并处理一些对连接来说是全局性的管家任务。

回顾一下：TCP可靠地传递一对受流量控制的字节流，每个方向一个。两方参与TCP连接，每一方同时作为”发送方”(自己的出站字节流)和”接收方”(入站字节流)行动：

![image-20230219110444953](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20230219110444953.png)

双方(上图中的”A”和”B”)被称为连接的”端点”，或”对等方”。你的`TCPConnection`作为其中一个对等方，负责接收和发送数据段，确保发送方和接收方被告知并有机会对他们关心的传入和传出段的字段作出贡献。

**接收段**。`TCPConnection`将接收来自互联网的`TCPSegment`，并且

- 如果`ACK`标志被设置，告诉`TCPSender`关于它在传入段上所关心的字段：`ackno`和`window_size`，并且
- 将段交给`TCPReceiver`，这样它就可以检查它所关心的传入段的字段：`seqno, syn, payload, fin`。

**发送段**。`TCPConnection`将通过互联网发送`TCPSegment`：

- 每当`TCPSender`将一个段push到它的传出队列中时，它就会在传出段上设置它负责的字段。(`seqno, syn, payload, fin`)。
- 在发送段之前，`TCPConnection`会向`TCPReceiver`询问它负责的传出段的字段：`ackno`和`window_size`。如果有`ackno`(请记住，`TCPReceiver::ackno()`返回一个可选值。)，它将设置`ack`标志和`TCPSegment`中的字段。

因此，每个`TCPSegment`的整体结构看起来像这样，”发送方 “和”接收方”字段用不同的颜色显示：

![image-20230219110636651](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20230219110636651.png)

`TCPConnection`的完整接口在[类文档](https://cs144.github.io/doc/lab4/class_t_c_p_connection.html)中。请花一些时间来阅读。你的大部分实现将涉及到将`TCPConnection`的公共API与`TCPSender`和`TCPReceiver`中的适当例程进行”连接”。你希望尽可能将任何繁重的工作推迟到你已经实现的发送方和接收方。话虽如此，但并不是所有的事情都那么简单，有一些微妙的地方涉及到整体连接的”全局”行为。最难的部分是决定何时完全终止一个TCPConnection并宣布它不再是”活动的”。

下面是一些常见问题和你需要处理的边缘情况的细节。

## 常见问题和特殊情形

- 你们希望有多少代码？

  总的来说，我们预计实现(在`tcp_connection.cc`中)总共需要大约100-150行的代码。当你完成后，测试套件将广泛地测试你自己的实现以及Linux内核的TCP实现的交互性。
- 我应该如何开始？

  最好的开始方式可能是将一些”普通”方法与`TCPSender`和`TCPReceiver`中的适当调用连接起来。这可能包括像`remaining_outbound_capacity()`，`bytes_in_flight()`以及`unassembled_bytes()`。

  然后你可以选择实现”writer”的方法：`connect()`、`write()`和`end_input_stream()`。其中一些方法可能需要对出站的`ByteStream`(由`TCPSender`拥有)做一些事情，并告知`TCPSender`。

  你可能会选择在你完全实现每个方法之前开始运行测试套件(`make check`)；测试的失败信息可以给你一个线索或指南，告诉你接下来要处理什么。
- 应用程序如何从入站流中读取？

  `TCPConnection::inbound_stream()`已经在头文件中实现了。
- `TCPConnection`是否需要任何花哨的数据结构或算法？

  不，它真的不需要。繁重的工作都是由你已经实现的`TCPSender`和`TCPReceiver`完成的。这里的工作实际上只是把所有的东西连接起来，处理一些难以轻易融入发送方和接收方的连接范围内的微妙问题。
- `TCPConnection`如何实际发送一个段？

  类似于`TCPSender`，把段push到`_segments_out`队列中。就你的`TCPConnection`而言，当你把它push到这个队列上时，就认为它已经发送了。很快，所有者会出现并pop它(使用公共的`segments_out()`访问器方法)并真正发送它。
- `TCPConnection`如何了解时间的流逝？

  与`TCPSender`类似——`tick()`方法将被定期调用。请不要使用任何其他方式来获得时间，tick方法是你对时间流逝的唯一访问，这样可以保持事情的确定性和可测试性。
- 如果一个传入段设置了`RST`标志，`TCPConnection`会做什么？

  这个标志(“重置”)表示连接立即终止。如果你收到一个带有`RST`的段，你应该在入站和出站的`ByteStreams`上设置错误标志，并且任何后续对`TCPConnection::active()`的调用都应该返回false。
- 什么时候应该发送一个设置了`RST`标志的段？

  有两种情况下，你会想中止整个连接。

  1. 如果发送方连续发送了太多的重传而没有成功(超过了`TCPConfig::MAX_RETX_ATTEMPTS`，即8)。
  2. 如果在连接仍处于活动状态时调用`TCPConnection`析构函数(`active()`返回true)。

  发送一个设置了`RST`的段与接收一个段的效果类似：连接已断开且不再`active()`，两个`ByStream`都应设置为错误状态。
- 等等，但我如何生成一个可以设置`RST`标志的段？序列号是什么？

  任何流出的段都需要有适当的序列号。你可以通过调用`TCPSender`的`send_empty_segment()`方法，强制`TCPSender`生成一个具有适当序列号的空段。或者你可以通过调用它的`fill_window()`方法让它填充窗口(如果它有未完成的信息要发送，例如，来自流的字节或SYN/FIN)。
- `ACK`标志的作用是什么？不是一直有一个`ackno`吗？

  - **几乎**每个`TCPSegment`都有一个`ackno`，并且设置了`ACK`标志。例外的情况是在连接的最开始，在接收方有任何需要确认的东西之前。
  - **在传出段中**，你要尽可能地设置`ackno`和`ACK`标志。也就是说，只要`TCPReceiver`的`ackno()`方法返回一个`std::optional<WrappingInt32>`的值，你就可以用[has\_value()](https://en.cppreference.com/w/cpp/utility/optional)测试。
  - **在传入段中**，只有当`ACK`字段被设置时，才需要查看`ackno`。如果`ACK`字段被设置，就把这个`ackno`(和窗口大小)给`TCPSender`。
- 在接收段时，如果`TCPReceiver`抱怨说该段没有与窗口重叠，是不可接受的(`segment_received()`返回false)，我应该怎么做？

  在这种情况下，`TCPConnection`需要确保向对等方发回一个段，给出当前的`ackno`和窗口大小。这有助于纠正对等方的困惑。
- 好的，很好。如果`TCPConnection`收到了一个段，而`TCPSender`抱怨说`ackno`无效(`ack_received()`返回false)，该怎么办？

  同样的答案!
- 如果`TCPConnection`收到了一个网段，而且一切都很好呢？那我还需要回复吗？

  **如果该段占用了任何序列号**，那么你需要确保它被确认——至少需要向对等方发送一个带有适当的序列号和新的`ackno`和`window_size`的段。你可能不需要做任何事情来强制这样做，因为`TCPSender`通常会在`ack_received()`中决定发送一个新的段(因为窗口中已经打开了更多的空间)。但是，即使`TCPSender`没有更多的数据要发送，你也需要确保传入的段以某种方式被确认。
- 如果`TCPConnection`只是确认每个网段，即使它不占用任何序列号，又如何呢？

  这可不是个好主意！两个对等方最终会来回发送无限多的acks。
- 如何解读这些”状态”名称(如”流开始(stream started)”或”流进行中(stream ongoing)”)？

  请查看[libsponge/tcp\_helpers/tcp\_state.hh](https://github.com/CS144/sponge/blob/lab4-startercode/libsponge/tcp_helpers/tcp_state.hh)和[tcp\_state.cc](https://github.com/CS144/sponge/blob/lab4-startercode/libsponge/tcp_helpers/tcp_state.cc)文件。
- 如果`TCPReceiver`想公布一个比`TCPSegment::header().win`字段大的窗口尺寸，我应该发送什么？

  发送你能发送的最大值。你可能会发现[std::numeric limits](https://en.cppreference.com/w/cpp/types/numeric_limits)类有帮助。
- TCP连接何时最终”完成”？`active()`什么时候可以返回false？

  请看下一节。
- 如果本PDF发布后有更多常见问题，我可以在哪里阅读？

  请定期查看网站(<https://cs144.github.io/lab_faq.html>)和Piazza。

## TCP连接的结束：共识需要工作

`TCPConnection`的一个重要功能是决定TCP连接何时完全”完成”。当这种情况发生时，该实现会释放其对本地端口号的独占申明，停止发送回复传入段的确认，认为该连接已成为历史，并让其`active()`方法返回false。

有两种方式可以结束一个连接。在一个**不干净的关闭**中，`TCPConnection`发送或接收一个设置了`RST`标志的段。在这种情况下，出站和入站的`ByteStream`应该都处于错误状态，而`active()`可以立即返回false。

一个**干净的关闭**是我们如何在没有错误的情况下达到”完成”(`active() = false`)。这比较复杂，但这是件美好的事情，因为它尽可能地确保两个`ByteStream`中的每一个都被可靠地完全交付给接收方。在下一节(§§5.1)中，我们给出了干净的关闭发生时的实际情况，所以如果你愿意，可以随意跳过前面的内容。

酷，你还在这里。由于”[Two Generals Problem](https://en.wikipedia.org/wiki/Two_Generals'_Problem)“的存在，不可能保证两个对等方都能实现干净的关闭，但是TCP已经非常接近了。情况是这样的。从一个对等方(一个`TCPConnection`，我们称之为”本地”对等方)的角度来看，在其与”远程”对等方的连接中，有四个前提条件可以实现干净的关闭：

- 前提条件#1 **入站**流已完全组装并已结束。
- 前提条件#2 **出站**流已被本地应用程序结束，并完全发送(包括它结束的事实，即一个带有`FIN`的段)到远程对等方。
- 前提条件#3 **出站**流已被远程对等方完全确认。
- 前提条件#4 **本地**`TCPConnection`确信**远程**对等方能满足前提条件#3。这是令人头疼的部分。有两种可选的方法可以实现这一点：(等待修改为徘徊)

  - **选项A：在两个流结束后徘徊**。前提条件#1到#3都是真的，而且远程对等方似乎已经得到了本地对等方对整个流的确认。本地对等方并不确定这一点——TCP无法可靠地传递acks(它不接受acks)。但是本地对等方非常确信远程对等方已经得到了它的acks，因为远程对等方似乎没有重传任何东西，而且本地对等方已经等待了一段时间来确定。

    具体来说，当前提条件#1到#3得到满足，**并且本地对等方从远程对等方收到任何网段后，至少已经过了10倍的初始重传超时(`_cfg.rt_timeout`)**，连接就完成了。这被称为在两个流结束后的”徘徊”，以确保远程对等方没有试图重传我们需要确认的东西。这确实意味着`TCPConnection`需要保持一段时间的活跃状态，保持对本地端口号的独占要求，并可能发送acks以响应传入的段，甚至在`TCPSender`和`TCPReceiver`完全完成其工作且两个流都结束之后。

    - 在一个生产型的TCP实现中，等待计时器(也被称为时间等待计时器或最大段寿命(MSL)的两倍)通常是60或120秒。在一个连接有效完成后，保留一个端口号的时间可能很长，特别是如果你想启动一个新的服务器，绑定到同一个端口号，没有人愿意等待两分钟。[`SO_REUSEADDR`](https://cs144.github.io/doc/lab4/class_socket.html#afc6ed565fddaa9d7ee4904ecc96bb6c0) socket选项本质上是让Linux忽略保留，对于调试或测试来说是很方便的。
  - **选项B：被动关闭**。前提条件#1到#3都是真的，而且本地对等方100%确定远程对等方可以满足前提条件#3。如果TCP不确认确认，这怎么可能呢？因为远程对等方是**第一个结束其流的人**。

    > 为什么这个规则有效？这是脑筋急转弯，你不需要进一步阅读就能完成这个实验，但思考起来很有趣，而且能触及”Two Generals Problem”的深层原因，以及在不可靠的网络中对可靠性的固有限制。这样做的原因是，在收到并组装了远程对等方的`FIN`(前提条件#1)后，本地对等方发送了一个比以前发送的序列号更大的段(至少，它必须发送自己的`FIN`段以满足前提条件# 2)，该段也有一个`ackno`，承认远程对等方的`FIN`位。远程对等方承认该段(满足前提条件#3)，这意味着远程对等方一定也看到了本地对等方对远程对等方的`FIN`的ack。这就保证了远程对等方一定能够满足它自己的前提条件#3。所有这些都意味着本地对等方可以满足前提条件#4，而不需要等待。
    >
    > 呜呼! 我们说过这是一个脑筋急转弯。在你的实验报告中加分：你能找到一个更好的方法来解释这个问题吗

    底线是，如果\*\*`TCPConnection`的入站流在`TCPConnection`发送`FIN`段之前就结束了，那么`TCPConnection`就不需要在两个流结束后等待\*\*。

### TCP连接的结束(实践总结)

实际上这意味着你的`TCPConnection`在流结束后有一个叫做`_linger_after_streams_finish`的成员变量，通过`state()`方法暴露给测试程序。这个变量一开始是`true`。如果入站流在`TCPConnection`到达其出站流的EOF之前结束，则需要将此变量设置为`false`。

在满足前提条件#1到#3的任何一点上，如果`_linger_after_streams_finish`为false，连接就”完成”了(并且`active()`应该返回false)。否则，你需要等待：只有在收到最后一个网段后经过足够的时间(`10 × _cfg.rt_timeout`)，连接才会完成。

## 性能

在你完成了你的TCP实现，并且通过了`make check`运行的所有测试之后，请提交！然后，测量你的系统的性能，使其至少达到每秒100兆比特。

在build目录中，运行`./apps/tcp benchmark`。如果一切顺利的话，你会看到像这样的输出：

```bash
user@computer:~/sponge/build$ ./apps/tcp_benchmark 
CPU-limited throughput : 1.78 Gbit/s 
CPU-limited throughput with reordering: 1.21 Gbit/s
```

为了获得实验的全部学分，你的性能需要在两条线上至少达到”0.10Gbit/s”(每秒100兆比特)。你可能需要对你的代码进行剖析，或者对它慢的地方进行推理，你可能需要改进一些关键模块(如`ByteStream`或`StreamReassembler`)的实现来达到这一点。

在你的报告中，请报告你所取得的速度数据(有无重新排序)。

如果你愿意，欢迎你尽可能地优化你的代码，但请不要以牺牲CS144的其他部分为代价，包括本实验的其他部分。如果你的性能超过100Mbit/s，我们不会给你加分——你所做的任何超出这个最低限度的改进都只是为了你自己的满意和学习。如果你在不改变任何公共接口的情况下实现了比我们快的速度，我们很愿意向你了解你是如何做到的。

(我们在2011年英特尔酷睿i7-2600K CPU @ 4.40GHz上运行我们的参考实现，使用Ubuntu 19.04，Linux 5.0.0-31-generic #33-Ubuntu，带有针对Meltdown/Spectre/等的默认缓解措施，以及带有默认编译器标志的g++ 8.3.0，进行默认(“发布”)构建。CPU限制的吞吐量(第一行)为7.18 Gbit/s，(第二行，有重新排序)为6.84 Gbit/s。)

## webget重温

胜利的时刻到了! 还记得你在实验0中写的`webget.cc`吗？它使用了由Linux内核提供的TCP实现(`TCPSocket`)。我们希望你能把它改成使用你自己的TCP实现，而不需要改变其他任何东西。我们认为你所需要做的就是：

- 用`#include "tcp_sponge_socket.hh"`替换`#include "socket.hh"` 。
- 将`TCPSocket`类型改为`CS144TCPSocket`。
- 在你的`get_URL()`函数的末尾，添加一个对`socket.wait_until_closed()`的调用。

> 为什么要这样做？通常情况下，Linux内核负责等待TCP连接达到”干净关闭”(并放弃它们的端口保留)，即使在用户进程退出后也是如此。但由于你的TCP实现都在用户空间，除了你的程序，没有其他东西可以跟踪连接状态。添加这个调用使套接字等待，直到你的`TCPConnection`报告`active() = false`。

重新编译，并运行`make check webget`来确认你已经完成了完整的闭环：你已经在你自己完整的TCP实现之上写了一个基本的web获取器，而且它仍然成功地与一个真正的webserver对话。如果你有问题，试着手动运行程序：`./apps/webget cs144.keithw.org /hasher/xyzzy`。你会在终端上得到一些调试输出，可能会有帮助。

## TCPState

### TCP 状态自动机

- [TCP/IP State Transition Diagram](https://users.cs.northwestern.edu/~agupta/cs340/project2/TCPIP_State_Transition_Diagram.pdf)
- [TCP Finite State Machine](http://tcpipguide.com/free/t_TCPOperationalOverviewandtheTCPFiniteStateMachineF-2.htm)

![TCP state transition diagram](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/TCP%20state%20transition%20diagram.png)

- `LISTEN`：表示正在等待来自任何远程 TCP 和端口的连接请求。
- `SYN-SENT`：表示在发送连接请求后等待匹配的连接请求。
- `SYN-RECEIVED`：表示在接收和发送连接请求后等待确认的连接请求确认。
- `ESTABLISHED`：表示打开的连接，接收到的数据可以传递给用户，是连接传输阶段的正常状态。
- `FIN-WAIT-1`：表示等待来自远程 TCP 的连接终止请求，或先前发送的连接终止请求的确认。
- `FIN-WAIT-2`：表示等待远程 TCP 的连接终止请求。
- `CLOSE-WAIT`：表示正在等待来自本地用户的连接终止请求。
- `CLOSING`：表示正在等待来自远程 TCP 的连接终止请求确认。
- `LAST-ACK`：表示等待先前发送给远程 TCP 的连接终止请求的确认（其中包括其连接终止请求的确认）。
- `TIME-WAIT`：表示等待足够的时间以确保远程 TCP 接收到其连接终止请求的确认。
- `CLOSED`：表示根本没有连接状态。

```cpp
//! \brief Official state names from the [TCP](\ref rfc::rfc793) specification
    enum class State {
        LISTEN = 0,   //!< Listening for a peer to connect
        SYN_RCVD,     //!< Got the peer's SYN
        SYN_SENT,     //!< Sent a SYN to initiate a connection
        ESTABLISHED,  //!< Three-way handshake complete
        CLOSE_WAIT,   //!< Remote side has sent a FIN, connection is half-open
        LAST_ACK,     //!< Local side sent a FIN from CLOSE_WAIT, waiting for ACK
        FIN_WAIT_1,   //!< Sent a FIN to the remote side, not yet ACK'd
        FIN_WAIT_2,   //!< Received an ACK for previously-sent FIN
        CLOSING,      //!< Received a FIN just after we sent one
        TIME_WAIT,    //!< Both sides have sent FIN and ACK'd, waiting for 2 MSL
        CLOSED,       //!< A connection that has terminated normally
        RESET,        //!< A connection that terminated abnormally
    };
```

`TCPState` 是一个枚举类型，表示 TCP 连接可能存在的不同状态。它有十一个可能的状态：

- `LISTEN`：TCP 正在等待来自任何远程 TCP 和端口的连接请求。
- `SYN_RCVD`：已经接收到来自远程 TCP 的连接请求，TCP 正在等待确认连接请求的确认。
- `SYN_SENT`：TCP 已经发送了连接请求，正在等待来自远程 TCP 的连接请求确认。
- `ESTABLISHED`：TCP 与远程 TCP 建立了打开连接，可以发送和接收数据。
- `CLOSE_WAIT`：远程 TCP 已经启动了连接的关闭，TCP 正在等待本地应用程序关闭连接。
- `LAST_ACK`：TCP 已经启动了连接的关闭并发送了 FIN，正在等待远程 TCP 确认 FIN。
- `FIN_WAIT_1`：TCP 已经启动了连接的关闭并发送了 FIN，正在等待远程 TCP 的连接终止请求，或等待远程 TCP 对 FIN 的确认。
- `FIN_WAIT_2`：TCP 已经收到来自远程 TCP 的连接终止请求的确认，并正在等待远程 TCP 的连接终止请求。
- `CLOSING`：TCP 已经发送了 FIN 并收到了远程 TCP 的连接终止请求的确认，但同时也收到了来自远程 TCP 的 FIN 并正在等待其 FIN 的确认。
- `TIME_WAIT`：TCP 已经发送了 FIN 并收到了来自远程 TCP 的连接终止请求的确认，正在等待一段时间（2 \* MSL），然后最终关闭连接。
- `CLOSED`：TCP 连接已经正常关闭，不能再发送或接收任何数据。
- `RESET`：由于收到重置，TCP 连接已经异常终止。

```cpp
TCPState::TCPState(const TCPState::State state) {
    switch (state) {
        case TCPState::State::LISTEN:
            _receiver = TCPReceiverStateSummary::LISTEN;
            _sender = TCPSenderStateSummary::CLOSED;
            break;
        case TCPState::State::SYN_RCVD:
            _receiver = TCPReceiverStateSummary::SYN_RECV;
            _sender = TCPSenderStateSummary::SYN_SENT;
            break;
        case TCPState::State::SYN_SENT:
            _receiver = TCPReceiverStateSummary::LISTEN;
            _sender = TCPSenderStateSummary::SYN_SENT;
            break;
        case TCPState::State::ESTABLISHED:
            _receiver = TCPReceiverStateSummary::SYN_RECV;
            _sender = TCPSenderStateSummary::SYN_ACKED;
            break;
        case TCPState::State::CLOSE_WAIT:
            _receiver = TCPReceiverStateSummary::FIN_RECV;
            _sender = TCPSenderStateSummary::SYN_ACKED;
            _linger_after_streams_finish = false;
            break;
        case TCPState::State::LAST_ACK:
            _receiver = TCPReceiverStateSummary::FIN_RECV;
            _sender = TCPSenderStateSummary::FIN_SENT;
            _linger_after_streams_finish = false;
            break;
        case TCPState::State::CLOSING:
            _receiver = TCPReceiverStateSummary::FIN_RECV;
            _sender = TCPSenderStateSummary::FIN_SENT;
            break;
        case TCPState::State::FIN_WAIT_1:
            _receiver = TCPReceiverStateSummary::SYN_RECV;
            _sender = TCPSenderStateSummary::FIN_SENT;
            break;
        case TCPState::State::FIN_WAIT_2:
            _receiver = TCPReceiverStateSummary::SYN_RECV;
            _sender = TCPSenderStateSummary::FIN_ACKED;
            break;
        case TCPState::State::TIME_WAIT:
            _receiver = TCPReceiverStateSummary::FIN_RECV;
            _sender = TCPSenderStateSummary::FIN_ACKED;
            break;
        case TCPState::State::RESET:
            _receiver = TCPReceiverStateSummary::ERROR;
            _sender = TCPSenderStateSummary::ERROR;
            _linger_after_streams_finish = false;
            _active = false;
            break;
        case TCPState::State::CLOSED:
            _receiver = TCPReceiverStateSummary::FIN_RECV;
            _sender = TCPSenderStateSummary::FIN_ACKED;
            _linger_after_streams_finish = false;
            _active = false;
            break;
    }
}
```

上面的函数是一个 switch 语句，将每个 `TCPState` 值映射到相应的 `TCPReceiverStateSummary` 和 `TCPSenderStateSummary` 值。这两种类型分别表示 TCP 接收器和发送器的摘要状态，用于向应用程序报告 TCP 连接的当前状态。根据 `TCPState` 值，switch 语句将适当的值分配给 `TCPConnection` 对象的 `_receiver`、`_sender`、`_linger_after_streams_finish` 和 `_active` 成员变量。

根据不同的TCP状态转换，更新TCP发送方和接收方的状态，并做出相应的操作。具体来说，这段代码将TCP状态转换成TCP发送方和接收方的状态，转换逻辑如下：

- `LISTEN`状态：TCP接收方进入 `LISTEN` 状态，TCP发送方进入 `CLOSED` 状态。
- `SYN_RCVD`状态：TCP接收方进入 `SYN_RECV` 状态，TCP发送方进入 `SYN_SENT` 状态。
- `SYN_SENT`状态：TCP接收方进入 `LISTEN` 状态，TCP发送方继续保持在 `SYN_SENT` 状态。
- `ESTABLISHED`状态：TCP接收方进入 `SYN_RECV` 状态，TCP发送方进入 `SYN_ACKED` 状态。
- `CLOSE_WAIT`状态：TCP接收方进入 `FIN_RECV` 状态，TCP发送方进入 `SYN_ACKED` 状态，设置 `_linger_after_streams_finish` 为 `false`。
- `LAST_ACK`状态：TCP接收方进入 `FIN_RECV` 状态，TCP发送方进入 `FIN_SENT` 状态，设置 `_linger_after_streams_finish` 为 `false`。
- `CLOSING`状态：TCP接收方进入 `FIN_RECV` 状态，TCP发送方进入 `FIN_SENT` 状态。
- `FIN_WAIT_1`状态：TCP接收方进入 `SYN_RECV` 状态，TCP发送方进入 `FIN_SENT` 状态。
- `FIN_WAIT_2`状态：TCP接收方进入 `SYN_RECV` 状态，TCP发送方进入 `FIN_ACKED` 状态。
- `TIME_WAIT`状态：TCP接收方进入 `FIN_RECV` 状态，TCP发送方进入 `FIN_ACKED` 状态。
- `RESET`状态：TCP接收方和TCP发送方进入 `ERROR` 状态，设置`_linger_after_streams_finish`为`false` ，设置 `_active` 为 `false`。
- `CLOSED`状态：TCP接收方进入 `FIN_RECV` 状态，TCP发送方进入 `FIN_ACKED` 状态，设 置 `_linger_after_streams_finish` 为false，设置 `_active` 为 `false`。

需要注意的是，这段代码并未包含所有可能的TCP状态转换，可能还有其他的状态转换情况需要另行处理。

### TCP 握手挥手

- <https://www.misaka-9982.com/2022/03/04/Wireshark-Lab5/>

#### TCP三次握手的流程和状态转换

TCP三次握手是在建立TCP连接时使用的一种协议，其流程和状态转换如下：

1. 客户端向服务器发送SYN包，表示客户端请求建立连接。
2. 服务器接收到SYN包，回复客户端一个SYN+ACK包，表示服务器确认收到了客户端的请求，并请求建立连接。
3. 客户端收到服务器的SYN+ACK包，发送一个ACK包给服务器，表示客户端确认收到了服务器的确认，并建立连接。

这个过程中，客户端和服务器之间的状态转换如下：

1. 客户端从CLOSED状态转换到SYN-SENT状态，表示客户端已经向服务器发送了一个SYN包，等待服务器的响应。
2. 服务器从LISTEN状态转换到SYN-RECEIVED状态，表示服务器已经收到了客户端的SYN包，并回复了SYN+ACK包，等待客户端的确认。
3. 客户端从SYN-SENT状态转换到ESTABLISHED状态，表示客户端已经收到了服务器的SYN+ACK包，并发送了确认ACK包，连接建立成功。
4. 服务器从SYN-RECEIVED状态转换到ESTABLISHED状态，表示服务器已经收到了客户端的ACK包，连接建立成功。

在TCP三次握手过程中，通过交换SYN和ACK包来确认连接的建立，确保客户端和服务器之间建立的连接是可靠的。这个过程中，如果任何一个包丢失或者延迟，都会导致连接建立失败，因此TCP协议是一种可靠的面向连接的协议。

#### TCP四次挥手的流程和状态转换

TCP四次挥手是在关闭TCP连接时使用的一种协议，其流程和状态转换如下：

1. 主动关闭方（可以是客户端或服务器）发送一个FIN包给被动关闭方（对方），表示主动关闭方想要关闭连接，进入FIN-WAIT-1状态。
2. 被动关闭方接收到主动关闭方的FIN包，回复一个ACK包进行确认，表示已经收到了主动关闭方的请求，进入CLOSE-WAIT状态。
3. 被动关闭方发送一个FIN包给主动关闭方，表示对方也想要关闭连接，进入LAST-ACK状态。
4. 主动关闭方接收到被动关闭方的FIN包，回复一个ACK包进行确认，表示主动关闭方已经收到了被动关闭方的请求，进入TIME-WAIT状态。
5. 经过一段时间后，主动关闭方退出TIME-WAIT状态，连接彻底关闭。

这个过程中，主动关闭方和被动关闭方之间的状态转换如下：

1. 主动关闭方从ESTABLISHED状态转换到FIN-WAIT-1状态，表示主动关闭方已经发送了一个FIN包，等待被动关闭方的确认。
2. 被动关闭方从ESTABLISHED状态转换到CLOSE-WAIT状态，表示被动关闭方已经接收到主动关闭方的FIN包，并发送了一个ACK包进行确认。
3. 被动关闭方从CLOSE-WAIT状态转换到LAST-ACK状态，表示被动关闭方也想要关闭连接，发送了一个FIN包给主动关闭方。
4. 主动关闭方从FIN-WAIT-1状态转换到FIN-WAIT-2状态，表示主动关闭方已经收到了被动关闭方的ACK包，并等待被动关闭方的FIN包。
5. 主动关闭方从FIN-WAIT-2状态转换到TIME-WAIT状态，表示主动关闭方已经收到了被动关闭方的FIN包，并发送了一个ACK包进行确认，等待一段时间（2倍的MSL，最长报文段寿命）以确保对方已经接收到ACK包。
6. 被动关闭方从LAST-ACK状态转换到CLOSED状态，表示被动关闭方已经收到了主动关闭方的ACK包，并关闭连接。

在TCP四次挥手过程中，主动关闭方和被动关闭方之间通过交换FIN和ACK包来关闭连接，确保连接关闭的可靠性。这个过程中，如果任何一个包丢失或者延迟，都会导致连接关闭失败，因此TCP协议是一种可靠的面向连接的协议。

## TCPConnection

### 代码解读

```cpp
//! \brief A complete endpoint of a TCP connection
class TCPConnection {
  private:
    TCPConfig _cfg;
    TCPReceiver _receiver{_cfg.recv_capacity};
    TCPSender _sender{_cfg.send_capacity, _cfg.rt_timeout, _cfg.fixed_isn};

    //! outbound queue of segments that the TCPConnection wants sent
    std::queue<TCPSegment> _segments_out{};

    //! Should the TCPConnection stay active (and keep ACKing)
    //! for 10 * _cfg.rt_timeout milliseconds after both streams have ended,
    //! in case the remote TCPConnection doesn't know we've received its whole stream?
    bool _linger_after_streams_finish{true};

    size_t _last_seg_time{0};
    size_t _curr_seg_time{0};

  public:
    //! \name "Input" interface for the writer
    //!@{

    //! \brief Initiate a connection by sending a SYN segment
    void connect();

    //! \brief Write data to the outbound byte stream, and send it over TCP if possible
    //! \returns the number of bytes from `data` that were actually written.
    size_t write(const std::string &data);

    //! \returns the number of `bytes` that can be written right now.
    size_t remaining_outbound_capacity() const;

    //! \brief Shut down the outbound byte stream (still allows reading incoming data)
    void end_input_stream();
    //!@}

    //! \name "Output" interface for the reader
    //!@{

    //! \brief The inbound byte stream received from the peer
    ByteStream &inbound_stream() { return _receiver.stream_out(); }
    //!@}

    //! \name Accessors used for testing

    //!@{
    //! \brief number of bytes sent and not yet acknowledged, counting SYN/FIN each as one byte
    size_t bytes_in_flight() const;
    //! \brief number of bytes not yet reassembled
    size_t unassembled_bytes() const;
    //! \brief Number of milliseconds since the last segment was received
    size_t time_since_last_segment_received() const;
    //!< \brief summarize the state of the sender, receiver, and the connection
    TCPState state() const { return {_sender, _receiver, active(), _linger_after_streams_finish}; };
    //!@}

    //! \name Methods for the owner or operating system to call
    //!@{

    //! Called when a new segment has been received from the network
    void segment_received(const TCPSegment &seg);

    //! Called periodically when time elapses
    void tick(const size_t ms_since_last_tick);

    void send_segment();

    //! \brief TCPSegments that the TCPConnection has enqueued for transmission.
    //! \note The owner or operating system will dequeue these and
    //! put each one into the payload of a lower-layer datagram (usually Internet datagrams (IP),
    //! but could also be user datagrams (UDP) or any other kind).
    std::queue<TCPSegment> &segments_out() { return _segments_out; }

    //! \brief Is the connection still alive in any way?
    //! \returns `true` if either stream is still running or if the TCPConnection is lingering
    //! after both streams have finished (e.g. to ACK retransmissions from the peer)
    bool active() const;
    //!@}

    //! Construct a new connection from a configuration
    explicit TCPConnection(const TCPConfig &cfg) : _cfg{cfg} {}

    //! \name construction and destruction
    //! moving is allowed; copying is disallowed; default construction not possible

    //!@{
    ~TCPConnection();  //!< destructor sends a RST if the connection is still open
    TCPConnection() = delete;
    TCPConnection(TCPConnection &&other) = default;
    TCPConnection &operator=(TCPConnection &&other) = default;
    TCPConnection(const TCPConnection &other) = delete;
    TCPConnection &operator=(const TCPConnection &other) = delete;
    //!@}
};
```

`TCPConnection`是一个类，用于表示 TCP 连接。它作为一个连接的一方(端点或对等方)，负责接收和发送数据段，确保发送方和接收方被告知并有机会对它们关心的传入和传出段的字段进行贡献。

具体来说，`TCPConnection`的主要功能包括：

- 接收来自互联网的 `TCPSegment`，并将其交给 `TCPReceiver` 进行处理，以检查它所关心的传入段的字段。
- 将每个传出段的字段设置为合适的值(由 `TCPSender` 确定)，并将其放入出站队列(`_segments_out`)中以便发送。
- 向 `TCPSender` 询问传出段的字段，特别是 `ackno` 和 `window_size`，以便构造传出段。
- 处理连接范围内的一些难以轻易融入发送方和接收方的微妙问题，比如如何终止连接并宣布它不再是“活动的”。

综上所述，`TCPConnection`的功能是将 `TCPSender` 和 `TCPReceiver` 中的例程与连接的公共 API 进行连接，以创建一个完整的 TCP 连接。

```cpp
void TCPConnection::send_segment() {
    while (!_sender.segments_out().empty()) {
        TCPSegment seg = _sender.segments_out().front();
        _sender.segments_out().pop();

        if (_receiver.ackno().has_value()) {
            seg.header().ack = true;
            seg.header().ackno = _receiver.ackno().value();
        }
        
        seg.header().win = static_cast<uint16_t>(
            min(_receiver.window_size(), static_cast<size_t>(numeric_limits<uint16_t>::max()))
        );

        _segments_out.push(seg);
    }
}
```

`send_segment()`，它的作用是将传出队列中的段发送出去。在发送之前，它会检查接收方是否有等待确认的段，以及接收窗口的大小。

具体来说，这段代码会从发送队列的前面取出一个段。如果接收方等待确认，它会将`ack`标志和确认号(`ackno`)设置为对应的值。然后，它将窗口大小(`win`)设置为接收方的窗口大小，但不会超过16位无符号整数的最大值。最后，它将段添加到传输队列中，准备发送。这个方法会循环执行，直到传输队列为空。

```cpp
bool TCPConnection::active() const {
    // unclean shutdown
    if (_sender.stream_in().error() || _receiver.stream_out().error()) {
        return false;
    }

    auto ended = _receiver.stream_out().input_ended();
    auto eof = _sender.stream_in().eof();
    auto eq2 = _sender.next_seqno_absolute() == _sender.stream_in().bytes_written() + 2;
    auto no_flight = _sender.bytes_in_flight() == 0;
    auto checked = ended && eof && eq2 && no_flight;

    // clean shut down
    if (!_linger_after_streams_finish) {  
        // # 1 ~ # 3 satisfied ->connection done
        if (checked) {
            return false;
        }

        return true;
    }

    if (checked) {
        if (time_since_last_segment_received() < 10 * _cfg.rt_timeout) {
            return true;
        }    

        return false;
    }
    
    return true;
}
```

这段代码定义了一个TCP连接的状态，通过判断发送方和接收方的状态，以及数据传输的进度来确定连接是否处于激活状态。

`active()`函数首先检查连接是否存在异常关闭情况，即发送流或接收流是否有错误，如果有则返回false，表示连接不再激活。

如果连接没有异常关闭，它将检查发送方和接收方的状态以及数据传输的进度。如果这些条件都满足，它将返回false，否则返回true，表示连接仍然激活。在这个实现中，一个TCP连接被认为是"激活"的条件是：

1. 接收流中没有未接收的数据，也没有接收流的错误（即没有未处理的数据或错误）
2. 发送流中已经写入了EOF
3. 发送方已经发送了所有数据，并且等待所有数据的确认，确认号为发送方写入的字节数+2（因为SYN和FIN标志也算在字节数中）

如果连接设置了 `linger_after_streams_finish` 标志，则还需要进行以下检查：

1. 上述3个条件都满足
2. 最近接收到的段距离当前时间不超过10倍的重传超时时间，否则返回false，表示连接不再激活

```cpp
//! \param[in] ms_since_last_tick number of milliseconds since the last call to this method
void TCPConnection::tick(const size_t ms_since_last_tick) {
    _curr_seg_time += ms_since_last_tick;
    _sender.tick(ms_since_last_tick);
    send_segment();

    if (_sender.consecutive_retransmissions() > TCPConfig::MAX_RETX_ATTEMPTS) {
        // abort the connnection
        _sender.send_empty_rst();
        _sender.stream_in().set_error();
        _receiver.stream_out().set_error();
    } 
    // syn received
    else if (_receiver.ackno().has_value()) { 
        _sender.fill_window();
    }

    send_segment();
}
```

这段代码是 TCPConnection 类中的 `tick()` 函数，用于模拟 TCP 连接的运行过程。具体而言，函数接收一个时间差（`ms_since_last_tick`），并根据这个时间差更新当前已经经过的时间和发送方的状态，并尝试发送 TCP 报文。

在函数的开头，代码会将时间差累加到当前已经经过的时间（`_curr_seg_time`）中，然后调用 `_sender.tick()` 函数更新发送方的状态，再调用 `send_segment()` 函数尝试发送 TCP 报文。

接下来，如果发送方连续重传的次数超过了最大重传次数（`TCPConfig::MAX_RETX_ATTEMPTS`），就会终止连接。如果接收方收到了 SYN 报文（即连接已经建立），就会调用 `_sender.fill_window()` 函数来填充发送窗口，并调用 `send_segment()` 尝试发送 TCP 报文。

最后再次调用 `send_segment()` 函数，以确保已经生成的 TCP 报文都已经被发送。

```cpp
void TCPConnection::segment_received(const TCPSegment &seg) {
    // Unclean shutdown of TCPConnection
    if (seg.header().rst) {
        _sender.stream_in().set_error();
        _receiver.stream_out().set_error();

        return;
    }
    
    // normal routine
    _last_seg_time = _curr_seg_time;
    _receiver.segment_received(seg);

    if (seg.header().ack) {
        _sender.ack_received(seg.header().ackno, seg.header().win);
    }
    
    // syn received
    if (_receiver.ackno().has_value()) {
        send_segment();
        _sender.fill_window();

        // at least one segment is sent in reply
        if (seg.length_in_sequence_space() && _sender.segments_out().empty()) {  
            _sender.send_empty_ack();
        }
    
        send_segment();
        
        if (_receiver.stream_out().input_ended() && !_sender.stream_in().eof()) {
            _linger_after_streams_finish = false;
        }
    }
}
```

这段代码处理接收到的TCP段（`segment`）。当接收到的段被传递到此方法时，代码将首先检查段是否包含RST标志，如果是，则TCP连接出现异常关闭。如果不是，则代码将处理TCP连接的正常过程。

如果此段包含ACK标志，则代码将调用 `_sender.ack_received` 方法来处理确认。如果 `_receiver.ackno` 返回值已设置，则表示已接收到SYN，代码将调用 `send_segment` 方法来发送数据段。 `_sender.fill_window` 方法将填充发送方窗口，以便在空闲时发送更多数据段。如果发送一个回复，但此时发送方没有待发送的段，则还会发送一个空的ACK段以确认该回复。此外，如果接收方流已结束但发送方流未结束，则 `_linger_after_streams_finish` 将设置为false，以指示连接可以正常关闭。

总之，此方法的目的是根据接收到的TCP段执行必要的操作以保持TCP连接的状态。

```cpp
void get_URL(const string &host, const string &path) {
    // Your code here.

    // You will need to connect to the "http" service on
    // the computer whose name is in the "host" string,
    // then request the URL path given in the "path" string.

    // GET /hello HTTP/1.1
    // Host: cs144.keithw.org
    // Connection: close

    Address address(host, "http");
    // TCPSocket socket;
    CS144TCPSocket socket{};
    socket.connect(address);

    socket.write("GET " + path + " HTTP/1.1\r\n");
    socket.write("Host: " + host + "\r\n");
    socket.write("\r\n");
    socket.shutdown(SHUT_WR);

    // Then you'll need to print out everything the server sends back,
    // (not just one call to read() -- everything) until you reach
    // the "eof" (end of file).

    while (!socket.eof()) {
        cout << socket.read(1);
    }

    socket.close();
    socket.wait_until_closed();

    // cerr << "Function called: get_URL(" << host << ", " << path << ").\n";
    // cerr << "Warning: get_URL() has not been implemented yet.\n";
}
```

### 性能测试

```bash
$ ./apps/tcp_benchmark
CPU-limited throughput                : 12.56 Gbit/s
CPU-limited throughput with reordering: 11.36 Gbit/s
```

## 完整代码

- [tcp\_connection.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_connection.hh)
- [tcp\_connection.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/tcp_connection.cc)
