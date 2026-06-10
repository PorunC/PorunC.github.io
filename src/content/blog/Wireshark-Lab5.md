---
title: Wireshark-Lab5 TCP
date: '2022-03-04T09:40:23.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/04/Wireshark-Lab5
oldUrl: /2022/03/04/Wireshark-Lab5/
excerpt: >-
  在本实验中，我们将详细研究著名的 TCP 协议的行为。 我们将通过从您的电脑向远程服务器传输一份 150KB 的文件（一份 Lewis Carrol
  的“爱丽丝梦游仙境”文本），并分析 TCP 传输内容的发送和接收过程来实现。 我们将研究 TCP 对序列和确认号的使用，以提供可靠的数据传输；我们将看到
  TCP 的拥塞控制算法 – 慢启动和拥塞避免 – 在过程...
---
# Lab5:TCP

在本实验中，我们将详细研究著名的 TCP 协议的行为。 我们将通过从您的电脑向远程服务器传输一份 150KB 的文件（一份 Lewis Carrol 的“爱丽丝梦游仙境”文本），并分析 TCP 传输内容的发送和接收过程来实现。 我们将研究 TCP 对序列和确认号的使用，以提供可靠的数据传输；我们将看到 TCP 的拥塞控制算法 – 慢启动和拥塞避免 – 在过程中，我们将看看 TCP 的接收器发送流量控制的机制。 我们还将简要地观察 TCP 连线的设置，我们还会研究计算机和服务器之间 TCP 连线的性能（吞吐量和往返时间）。

在开始本实验之前，您应该先查看课本中的第 3.5 和 3.7 节。

## 1. Capturing a bulk TCP transfer from your computer to a remote server (捕获从计算机到远程服务器的批量 TCP 传输)

在开始我们对 TCP 的探索之前，我们需要使用 Wireshark 来获取文件从计算机到远程服务器的 TCP 传输的数据包内容。您可以通过访问一个网页，在网页上输入您计算机上⬀储的文件名称（包含 Alice in Wonderland 的 ASCII 文本），然后使用HTTP POST 方法将文件传输到 Web 服务器（见文中第 2.2.3 节）。我们使用POST 方法而不是 GET 方法，因为我们希望将大量数据从您的计算机传输到另一台计算机。当然，我们将在此期间运行 Wireshark 以获取从您的计算机发送和接收的 TCP 区段的内容。

执行以下步骤：

- 启动 Web 浏览器。 在 <http://gaia.cs.umass.edu/wireshark-labs/alice.txt> 查看Alice in Wonderland 的 ASCII 档案文件。 将此文件⬀储在计算机上的某个位置。
- 接下来去 <http://gaia.cs.umass.edu/wireshark-labs/TCP-wireshark-file1.html>.
- 你将会看到如下图的网页

  ![](https://img-blog.csdnimg.cn/7f72f2e4a60840eaaeb0db0dd2670e0f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
- 使用此表单中的“Browse…”按钮在计算机上输入包含 Alice in Wonderland 的文件名(完整路径名)(或手动执行)。这个时候请不要按下“Upload alice.txt file”按钮。
- 启动 Wireshark 并开始数据包捕获 (Capture-> Start)，然后在 Wireshark 数据包捕获选项视窗上按 OK (我们不需要在此处选择任何选项)(详细操作因Wireshark 版本略有不同)。
- 返回浏览器，按“Upload alice.txt file”按钮将文件上传到 gaia.cs.umass.edu服务器。文件上传后，浏览器窗口中会显示一条简短的祝贺消息。
- 停止 Wireshark 数据包捕获。 您的 Wireshark 视窗内容应该类似于下面显示的内容。

  ![](https://img-blog.csdnimg.cn/35dd698f4be34c9aa725848091c634f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
- 如果您无法在实际的网路上运行 Wireshark，则可以下载在作者的计算机上执行上述步骤时捕获的数据包跟踪文件。当您探索下面的问题时，即使您已经捕获了自己的传输内容并使用它来回答下面的问题，您也可能会发现这份下载的跟踪包很有参考价值。

## 2. A first look at the captured trace (跟蹤包的初步觀察)

在详细分析 TCP 连接的行为之前，让我们先概观看一下跟踪包的内容。

- 首先，在 Wireshark 视窗顶部的显示的过滤器指定窗口中输入“tcp”（小写，无引号，并且不要忘记在输入后按 enter 键！），过滤 Wireshark 视窗中显示的数据包。

您应该看到的是计算机和 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 之间的一系列 TCP 和 HTTP 讯息。您应该看到包含 SYN 讯息的初始三次握手。您应该看到 HTTP POST 讯息。根据您使用的 Wireshark 的版本，您可能会看到从您的计算机向 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 发送一系列“HTTP Continuation”讯息。 回想一下我们在早期的 HTTP Wireshark 实验室中的讨论，这不是 HTTP Continuation 消息 – 这是 Wireshark 指示有多个 TCP 区段用于承载单个 HTTP 讯息的方式。在 Wireshark 的最新版本中，您将在 Wireshark显示的 Info 列中看到“[重新组装的 PDU 的 TCP 段]”，以指示此 TCP 区段包含属于上层协议讯息的数据（在我们的示例中为，HTTP）。[您还应该看到从gaia.cs.umass.edu](http://xn--gaia-z25f72pn8zuzdzy7deu4bycj.cs.umass.edu) 返回到您的计算机的 TCP ACK 区段。

利用下载的 <http://gaia.cs.umass.edu/wireshark-labs/wireshark-traces.zip> 档案，打开其中的 Wireshark 捕获的数据包文件 tcp-ethereal-trace-1 来回答以下问题（即下载跟踪包并打开 Wireshark 中的跟踪包；见附注 2）。在回答问题时，您应该提交用于回答问题的跟踪内的数据包的列印输出。 加上适当的注释以解释您的答案。 要印出数据包，请使用文件 - >列印，选择仅选定数据包，选择数据包摘要行，然后选择回答问题所需的最小数据包详细信息量。

1. 将文件传输到 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 的客户端计算机（源）使用的 IP 地址和TCP 端口号是什么？ 要回答这个问题，最简单的方法是使用“所选数据包标头的详细信息”视窗，选择 HTTP 讯息并探索用于携带此 HTTP 讯息的TCP 数据包的详细信息（如果你不确定是哪一个 Wireshark 视窗。请参阅“Getting Started with Wireshark”实验中的图 2 ）
   - 分析作者提供的抓包结果
   - 作者 IP：192.168.1.102，TCP 发送端口 1161
   - ![](https://img-blog.csdnimg.cn/15a46ca332724289898549afe6c04b3c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
2. [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 的 IP 地址是什么？ 在哪个端口号上发送和接收此连接的TCP 区段？
   - 接收 IP：128.119.245.12，TCP 接受端口 80

如果您能够连网并使用 Wireshark 创建自己的跟踪包，请回答以下问题：

3. 客户端计算机（源）将文件传输到 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 所使用的 IP 地址和TCP 端口号是多少？

   - 略

由于本实验是关于 TCP 而不是 HTTP，让我们更改 Wireshark 的“捕获数据包列表”视窗，以便显示有关包含 HTTP 讯息的 TCP 区段的信息，而不是 HTTP 讯息。 要让 Wireshark 执行此操作，请选择 Analyze-> Enabled Protocols。 然后取消勾选 HTTP 框，并选择确定。 您现在应该看到一个 Wireshark 窗口，如下所示：

![](https://img-blog.csdnimg.cn/428c4709b2f44481b977ef85992cdc5d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

这就是我们正在寻找的 – 在您的计算机和 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 之间发送的一系列 TCP区段。我们将使用您捕获的数据包跟踪（和/或 <http://gaia.cs.umass.edu/wireshark>-labs/wireshark-traces.zip 中的数据包跟踪 tcp-ethereal-trace-1：请参阅前面的脚注 ）

在本实验的其余部分研究 TCP 行为。

## 3. TCP Basics (TCP 基础)

回答下列关于 TCP 区段的问题：

4. 用于在客户端计算机和 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 之间启动 TCP 连接的 TCP SYN 区段的序列号是什么？ 将区段标识为 SYN 区段的区段有什么功能？

   - SYN相对序列号为 0， 绝对序列号为 232129012
   - ![](https://img-blog.csdnimg.cn/ec3ec05b2ccd4e28b5e781534f173286.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
   - 根据三次握手，客户端应该发送 SYN 请求请求建立连接，我找到发送的第一个请求并且发现客户端（我的电脑）将 SYN 标志标 0 用来请求建立连接。$Sequence \ number =232129012$ 这是个随机值，这一步也是三次握手的第一步
   - ![](https://img-blog.csdnimg.cn/766bc92a8b814bd494a7567c464f41e9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
5. [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 发送给客户端计算机以回复 SYN 的 SYNACK 区段的序列号是多少？ SYNACK 区段中的 Acknowledgment 栏位的值是多少？[Gaia.cs.umass.edu](http://Gaia.cs.umass.edu) 是如何确定此 Acknowledgment 的数值的？ 在将区段标识为 SYNACK 区段的区段在连线中有什么功能？

   - SYN 为 0
   - $Acknowledgment \ = 1\ (232129013)$
   - $Acknowledgment$ 为 客户端的 $Sequence Number \ (232129012) + 1$
   - ![](https://img-blog.csdnimg.cn/c3d9fa73b055497bbfbd421bfd3be251.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
   - 意思是服务器接收到我的连接请求并且发 SYN-ACK 确认，这是三次握手的第二步。
   - ![](https://img-blog.csdnimg.cn/f12141ab51e04aa7a3f6ef4dcc4215b8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
6. 包含 HTTP POST 命令的 TCP 区段的序列号是多少？ 请注意，为了找到POST 命令，您需要深入了解 Wireshark 窗口底部的数据包内容⫿段，在其DATA 栏位中查找带有“POST”的区段。

   - $Seqence Number = 1$
   - Info 一栏中 `[PSH, ACK]` 里面的 `PSH` 即包含 `HTTP POST` 命令
   - 其中http post相关信息包含在[Reassembled PDU in frame: 199]
   - ![](https://img-blog.csdnimg.cn/7ca5e0f19b724c9ab01c579fba05102d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
7. 将包含 HTTP POST 的 TCP 区段视为 TCP 连接中的第一个区段。在这个TCP 连线中前六个 TCP 区段的序列号是什么（包括包含 HTTP POST 的段）？ 每区段发送的时间是什么时候？ 收到的每个区段的 ACK 是什么时候？ 鉴于发送每个 TCP 区段的时间与收到确认的时间之间的差异，六个区段中每个区段的 RTT 值是多少？ 收到每个 ACK 后，EstimatedRTT 值（参见本节中的第 3.5.3 节，第 242 页）是什么？ 假设第一个 EstimatedRTT 的值等于第一个区段的测量 RTT，然后使用课本第 242 页的 EstimatedRTT 公式计算所有后续区段。（译注：中译本的页数可能不同）

   \*\*注意：\*\*Wireshark有一个很好的功能，允许您为发送的每个 TCP 区段绘制RTT。 在从客户端发送到gaia.cs.umass.edu服务器的“捕获的数据包列表”窗口中选择一个TCP段。 然后选择：Statistics-> TCP Stream Graph-> Round Trip Time Graph。

   ![](https://img-blog.csdnimg.cn/12c8d76625344d6582a0884ea5729e1a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

   ![](https://img-blog.csdnimg.cn/6d017f996ef84feeab2be6fcc768b47a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

   ![](https://img-blog.csdnimg.cn/395da35ec378499ba13d8667f3d14d25.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

   ACK时间在SEQ/ACK analysis字段中，其中`frame`后的数字为对应的 PSH 帧的回应

   ![](https://img-blog.csdnimg.cn/8264d85fd4744d24b20a659751f8d110.png)

   | PSH No | 序列号 | 发送时间 | 回应 No | ACK时间 | RTT | EstimatedRTT |
   | --- | --- | --- | --- | --- | --- | --- |
   | 4 | 1 | 0.026477 | 6 | 0.053937000 | 0.027460000 | 0.02746 |
   | 5 | 566 | 0.041737 | 9 | 0.077294000 | 0.035557000 | 0.028472125 |
   | 7 | 2026 | 0.054026 | 12 | 0.124085000 | 0.070059000 | 0.033670484375 |
   | 8 | 3486 | 0.054690 | 14 | 0.169118000 | 0.114428000 | 0.043765173828125 |
   | 10 | 4946 | 0.077405 | 15 | 0.217299000 | 0.139894000 | 0.05578127709960937 |
   | 11 | 6406 | 0.078157 | 16 | 0.267802000 | 0.189645000 | 0.07251424246215821 |

   $EstimatedRTT = 0.875 \* EstimatedRTT + 0.125 \* SampleRTT$

   EstimatedRTT **after the receipt of the ACK of segment 1**:

   $EstimatedRTT = RTT for Segment 1 = 0.02746 second$

   EstimatedRTT **after the receipt of the ACK of segment 2**:

   $EstimatedRTT = 0.875 \* 0.02746 + 0.125 \* 0.035557 = 0.0285$

   EstimatedRTT **after the receipt of the ACK of segment 3**:

   $EstimatedRTT = 0.875 \* 0.0285 + 0.125 \* 0.070059 = 0.0337$

   EstimatedRTT **after the receipt of the ACK of segment 4**:

   $EstimatedRTT = 0.875 \* 0.0337+ 0.125 \* 0.11443 = 0.0438$

   EstimatedRTT **after the receipt of the ACK of segment 5**:

   $EstimatedRTT = 0.875 \* 0.0438 + 0.125 \* 0.13989 = 0.0558$

   EstimatedRTT **after the receipt of the ACK of segment 6**:

   $EstimatedRTT = 0.875 \* 0.0558 + 0.125 \* 0.18964 = 0.0725$
8. 前六个 TCP 区段的长度是多少？

   Segment 1 sequence length: $566 - 1 = 565$

   Segment 2 sequence length: $2026 - 566 = 1460$

   Segment 3 sequence length: $3486 - 2026 = 1460$

   Segment 4 sequence length: $4946 - 3486 = 1460$

   Segment 5 sequence length: $6406 - 4946 = 1460$

   Segment 6 sequence length: $7866 - 6406 = 1460$
9. 对于整个跟踪包，收到的最小可用缓冲区空间量是多少？ 缺少接收器缓冲区空间是否会限制发送方传送 TCP 区段？

   - The minimum amount of buffer space (receiver window) advertised at [gaia.cs.umass.edu](http://gaia.cs.umass.edu) for the entire trace is 5840 bytes,which shows in the first acknowledgement from the server. This receiver window grows steadily until a maximum receiver buffer size of 62780 bytes. The sender is never throttled due to lacking of receiver buffer space by inspecting this trace.
   - 在gaia.cs.umass.edu为整个跟踪通告的最小缓冲区空间量(接收器窗口)是5840字节，这显示在来自服务器的第一个确认中。该接收器窗口稳步增长，直到最大接收器缓冲器大小达到62780字节。通过检查此跟踪，发送器永远不会因为接收器缓冲区空间不足而受到抑制。
   - ![](https://img-blog.csdnimg.cn/218ae55b12c6492cab3bd3c53a28ab98.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
10. 在跟踪文件中是否有重传的区段？ 为了回答这个问题，您检查了什么（在跟踪包中）？

    - There are no retransmitted segments in the trace file. We can verify this by checking the sequence numbers of the TCP segments in the trace file. In the TimeSequence-Graph (Stevens) of this trace, all sequence numbers from the source (192.168.1.102) to the destination (128.119.245.12) are increasing monotonically with respect to time. If there is a retransmitted segment, the sequence number of this retransmitted segment should be smaller than those of its neighboring segments.
    - 跟踪文件中没有重新传输的段。我们可以通过检查跟踪文件中TCP数据段的序列号来验证这一点。在该轨迹的时间序列图(Stevens)中，从源(192.168.1.102)到目的地(128.119.245.12)的所有序列号都随着时间单调递增。如果存在重传数据段，则该重传数据段的序列号应小于其相邻数据段的序列号。
    - ![](https://img-blog.csdnimg.cn/b1e1f9cfb3f34de9b93ebf3d1194b4e6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
11. 接收器通常在 ACK 中确认多少数据？ 您是否可以识别接收方每隔一个接收到的区段才发送确认的情况（参见本文第 250 页的表 3.2）。

    - ![](https://img-blog.csdnimg.cn/9da14e673884481081d15f8a43a29d1a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
    - The difference between the acknowledged sequence numbers of two consecutive ACKs indicates the data received by the server between these two ACKs. By inspecting the amount of acknowledged data by each ACK, there are cases where the receiver is ACKing every other segment. For example, segment of No. 80 acknowledged data with 2920 bytes = 1460\*2 bytes.
    - 两个连续ACK的确认序列号之间的差异表示服务器在这两个ACK之间接收的数据。通过检查每个ACK确认的数据量，可能会出现接收方每隔一个数据段进行ACK的情况。例如，第80号确认数据的段，2920字节=1460\*2字节。
    - ![](https://img-blog.csdnimg.cn/611d1d01db7d401aa18ac03116321850.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
12. TCP 连接的吞吐量（每单位时间传输的⫿节数）是多少？ 解释你如何计算这个值。

    - Solution: The computation of TCP throughput largely depends on the selection of averaging time period. As a common throughput computation, in this question, we select the average time period as the whole connection time. Then, the average throughput for this TCP connection is computed as the ratio between the total amount data and the total transmission time. The total amount data transmitted can be computed by the difference between the sequence number of the first TCP segment (i.e. 1 byte for No. 4 segment) and the acknowledged sequence number of the last ACK (164091 bytes for No. 202 segment). Therefore, the total data are 164091 - 1 = 164090 bytes. The whole transmission time is the difference of the time instant of the first TCP segment (i.e., 0.026477 second for No.4 segment) and the time instant of the last ACK (i.e., 5.455830 second for No. 202 segment). Therefore, the total transmission time is 5.455830 - 0.026477 = 5.4294 seconds. Hence, the throughput for the TCP connection is computed as 164090/5.4294 = 30.222 KByte/sec.
    - TCP吞吐量的计算在很大程度上取决于平均时间段的选择。作为一种常见的吞吐量计算，在本问题中，我们选择平均时间周期作为整个连接时间。然后，该TCP连接的平均吞吐量被计算为总数据量与总传输时间之间的比率。可以通过第一个TCP数据段的序列号(即，对于第4号数据段为1字节)和最后一个确认确认的序列号(对于第202号数据段，为164091字节)之间的差来计算发送的总数据量。因此，总数据为164091-1=164090字节。整个传输时间是第一个TCP报文段的时刻(即，对于4号报文段为0.026477秒)和最后一个确认的时刻(即，对于202号报文段为5.455830秒)的时间差。因此，总传输时间为5.455830-0.026477=5.4294秒。因此，tcp连接的吞吐量计算为164090/5.4294=30.222千字节/秒。
    - 统计图结果：
    - ![](https://img-blog.csdnimg.cn/92b64825f08d49c4816dd3be7f8e8400.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

## 4.TCP congestion control in action (TCP 壅塞控制)

现在让我们检查从客户端服务器的每单位时间发送的数据量。 而不是（繁琐地！）从 Wireshark 窗口中的原始数据计算这些数值，我们将使用 Wireshark 的TCP 图形工具 – 时序图（Stevens） - 来绘制数据。

在 Wireshark 的“捕获数据包列表”窗口中选择一个 TCP 区段。然后选择菜单：Statistics-> TCP Stream Graph-> Time-Sequence-Graph（Stevens）。您应该看到一个类似于下图的图，该图是根据 <http://gaia.cs.umass.edu/wireshark>-labs/wireshark-traces.zip 中的跟踪数据包 tcp-ethereal-trace-1 中捕获的资料所创建的。（见前面的附注）：

![](https://img-blog.csdnimg.cn/059ee1eec1df41bb97fa5e06369958f2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

这里，每个点代表一个发送的 TCP 区段，绘制区段的序列号与发送的时间。 请注意，堆叠在一起的一组点表示发送方背靠背发送的一系列数据包。

根据在 <http://gaia.cs.umass.edu/wireshark-labs/wireshark-traces.zip> 中的数据跟踪包tcp-ethereal-trace-1 内容回答以下有关 TCP 区段的问题

13. 使用时序图（Stevens）绘图工具查看从客户端发送到 [gaia.cs.umass.edu](http://gaia.cs.umass.edu) 服务器的区段的序列号与时间关系图。您能否确定 TCP 的慢启动阶段的开始和结束位置，以及拥塞避免接管的位置？ 评论测量数据与我们在文本中研究的 TCP 的理想化行为的不同之处。
    - 一开始是慢启动，后续应该没有拥塞的情况
    - ![](https://img-blog.csdnimg.cn/b1e1f9cfb3f34de9b93ebf3d1194b4e6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
14. 根据你使用 Wireshark 所收集到的资料（[将文件从计算机传输到gaia.cs.umass.edu](http://xn--gaia-z25fhipki0tnxyfxv1iekq1fcu3bdtl.cs.umass.edu) 时的跟踪包信息），回答问题 13 中的两个问题。
    - 略
