---
title: Wireshark-Lab6 IP
date: '2022-03-04T11:30:35.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/04/Wireshark-Lab6
oldUrl: /2022/03/04/Wireshark-Lab6/
excerpt: >-
  在本实验中，我们将研究 IP 协议，重点关注 IP 数据报(IP datagram)。我们将通过分析在执行 traceroute 程序发送和接收的一系列
  IP 数据报的过程来完成这个实验（traceroute 程序本身则是在 Wireshark ICMP 实验室中进行了更详细的探讨），我们将研究 IP
  datagram 中的各个字段(fields)，并详细研...
---
# Lab6:IP

在本实验中，我们将研究 IP 协议，重点关注 IP 数据报(IP datagram)。我们将通过分析在执行 traceroute 程序发送和接收的一系列 IP 数据报的过程来完成这个实验（traceroute 程序本身则是在 Wireshark ICMP 实验室中进行了更详细的探讨），我们将研究 IP datagram 中的各个字段(fields)，并详细研究 IP fragmentation 的方法。

在开始本实验之前，希望您复习课本中的 1.4.3 节 和观看 RFC 2151 文件的 3.4 节中的内容[[ftp://ftp.rfc-editor.org/in-notes/rfc2151.txt](/2022/03/04/Wireshark-Lab6/ftp://ftp.rfc-editor.org/in-notes/rfc2151.txt)]，让自己更了解 traceroute 程序的操作。您还需要阅读文中的第 4.4 节，或许还需要看看 RFC 791 [[ftp://ftp.rfc](/2022/03/04/Wireshark-Lab6/ftp://ftp.rfc)-editor.org/in-notes/rfc791.txt]，让自己对 IP 协议有基础的认识。

## Capturing packets from an execution of traceroute (捕获执行 traceroute的数据包)

为了生成本实验的一系列 IP 数据报，我们将使用 traceroute 程序向不同的目的地 X发送不同大小的数据报。回想一下，traceroute 通过首先发送一个或多个带有生存时间(TTL: Time-to-Live)字段设置为 1 的数据报；然后发送一个或多个带有生存时间(TTL: Time-to-Live)字段设置为 2 的数据报到同一个目的地；然后发送一个或多个带有生存时间(TTL: Time-to-Live)字段设置为 3 的数据报到同一个目的地，以此类推，直到目的地真正收到此数据报为止。回想一下，路由器必须将每个接收到的数据报中的 TTL 减 1（实际上，RFC 791 文献中表示路由器必须将 TTL 减少至少一个）。如果 TTL 达到 0，路由器会向来源主机发送 ICMP 消息（类型 11 - 超出TTL）。由于这种行为，TTL 为 1 的数据报（由执行 traceroute 的主机发送）将导致距发送方一次跳跃的路由器，将 ICMP TTL 超出的消息发送回发送方主机；以TTL 为 2 发送的数据报将导致距离为两次跳跃的路由器，将 ICMP 消息发送回发送方主机；以 TTL 为 3 发送的数据报将导致距离为两次跳跃的路由器，将 ICMP 消息发送回发送方主机，等等。以这种方式，执行 traceroute 的主机可以通过查看包含ICMP TTL 超出消息的数据报中的来源 IP 地址来获知其自身与目的地 X 之间的路由器的身份。

我们想要运行 traceroute 并让它发送各种长度的数据报。

- Windows 操作系统：Windows 提供的 tracert 程序（曾被使用于我们的 ICMP Wireshark 实验中）不允许更改 tracert 程序发送的 ICMP echo 请求（ping）消息的大小。因此，一个更好的 Windows traceroute 程序是 pingplotter，可在 <http://www.pingplotter.com> 上以免费版和共享软件版本获得。下载并安装pingplotter，并通过对您喜欢的站点执行一些 traceroute 来测试它。通过选择菜单项 Edit-> Options-> Packet Options 然后填写 Packet Size 字段，可以在pingplotter 中显式设置 ICMP echo 请求消息的大小。默认数据包大小为 56个字节。一旦 pingplotter 发送了一系列具有递增的 TTL 值的数据包，它会在等待 Trace Interval 时间后再次以 TTL 为 1 重新启动发送进程。同时，我们可以在 pingplotter 中明确设置 Trace Interval 的值和间隔数。(备注：PinPlotter 5 需要使用到 Standar 版或是 Professional 版才能够自定义 packet参数，有 14 天的试用版可以使用)
- **Linux/Unix/MacOS.** With the Unix/MacOS traceroute command, the size of the UDP datagram sent towards the destination can be explicitly set by indicating the number of bytes in the datagram; this value is entered in the traceroute command line immediately after the name or address of the destination. For example, to send traceroute datagrams of 2000 bytes towards [gaia.cs.umass.edu](http://gaia.cs.umass.edu), the command would be:

  `%traceroute gaia.cs.umass.edu 2000`

Do the following: (依照下列步骤执行：)

- 启动 Wireshark 并开始数据包捕获（Capture-> Start），然后在 Wireshark 数据包捕获选项屏幕上按 OK（我们不需要在此处选择任何选项）。
- 如果您使用的是 Windows 平台，请启动 pingplotter 并在“要跟踪的地址窗口”中输入目标目标的名称。在“要跟踪的次数”字段中输入 3，这样您就不会收集太多数据。选择菜单项编辑 - >高级选项 - >数据包选项，然后在数据包大小字段中输入值 56，然后按确定。然后按 Trace 按钮。你应该看到一个看起来像这样的 pingplotter 窗口：(备注：新版 PingPlotter5 中没有跟踪次数的设定，可以在 count 到达 3 的时候按下暂停键，停止收集数据包)
- 接下来，通过选择编辑 ->高级选项 ->数据包选项并在数据包大小字段中输入值 2000，然后按确定，发送一组长度较长的数据报。然后按“继续”按钮。
- 最后，通过选择 Edit-> Advanced Options-> Packet Options 并在 Packet Size字段中输入值 3500，然后按 OK，发送一组长度较长的数据报。然后按“继 续”按钮。
- Stop Wireshark tracing. (停止 Wireshark 数据包撷取)

---

- 如果您使用的是 Unix 或 Mac 平台，请输入三个 traceroute 命令，一个长度为 56 个字节，一个长度为 2000 个字节，另一个长度为 3500 个字节。
- Stop Wireshark tracing. (停止 Wireshark 数据包撷取)

如果您无法在实际的网络连接上运行 Wireshark，则可以下载在作者的某台Windows 计算器上执行上述步骤时捕获的数据包跟踪文件。当您探索下面的问题时，即使您已经捕获了自己的跟踪数据并使用它，如同您自己的跟踪数据一般，您也可能会发现下载此跟踪数据对你的实验很有帮助。

在您的跟踪数据包中，您应该能够看到计算器发送的一系列的 ICMP Echo 请求讯息（在 Windows 计算器的情况下）或 UDP 区段（在 Unix 的情况下）以及由中间路由器发送到计算器的 ICMP TTL 超出的讯息。在下面的问题中，我们假设您使用的是 Windows 机器；对于 Unix 机器的相应问题应该是清楚的。只要有可能，在回答下面的问题时，您应该提交用于回答问题的跟踪内的数据包的打印输出。当您提交作业时，请对输出进行注释，以便清楚地显示输出中您获得答案信息的位置（例如，对于我们的课程，我们要求学生用笔标记纸本答案，或者使用带注释的电子副本。若要打印数据包，请使用文件 - >打印，选择仅选择数据包，选择数据包摘要行，然后选择回答本问题时所需的最小数据包的详细信息量。

1. 选择计算器发送的第一个 ICMP Echo Request 消息，然后在 packet details window 中展开数据包的 Internet 协议部分。

   ![](https://img-blog.csdnimg.cn/6d77a4317a5f420d8b77c756532f222d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

   您的计算器的 IP 地址是多少？

   ![](https://img-blog.csdnimg.cn/eda9fd5074c340f0b323245cd3d08985.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

   192.168.1.102
2. 在 IP header 中，上层协议字段的值是多少？

   上层协议是ICMP，根据 IPV4 头部协议号列表，ICMP 协议的值是 1
3. IP header 有多少 bytes？ IP datagram 的有效负载中有多少 bytes？ 说明如何确定 payload bytes 的数。

   Total Length：84，Header Length： 20， 有效负载中总共有$84 - 20 = 64$
4. 此 IP 数据报是否已被分段(fragmented)？解释您如何确定数据报是否已被分段(fragmented)。

   fragments offset 为 0，所以数据没有被分段

接下来，通过单击 Source 列标题，根据 IP 源地址对跟踪的数据包进行排序，一个小的向下箭头应出现在 Source 旁边，如果箭头指向上方请再次单击“Source column header”。选择计算器发送的第一个 ICMP Echo Request 消息，然后展开“details of selected packet header”窗口中的 Internet 协议部分。在“listing of captured packets”窗口中，您应该在第一个 ICMP 下面看到所有后续 ICMP 消息（可能还有计算器上运行的其他协议发送的其他散布数据包），使用向下箭头浏览计算器发送的 ICMP 消息。

5. 在您的计算器发送的这一系列 ICMP 消息中，IP 数据报中的哪些字段一直有改变？

   Identification, Time to live and Header checksum

   ![](https://img-blog.csdnimg.cn/fe15fa91e6f14f4489a7157d69ebd5f9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
6. 哪些字段保持不变？ 哪个字段必须保持不变？ 哪些字段必须更改？ 为什么？

   *The fields that stay constant across the IP datagrams are:*

   - *Version (since we are using IPv4 for all packets)*
   - *header length (since these are ICMP packets)*
   - *source IP (since we are sending from the same source)*
   - *destination IP (since we are sending to the same dest)*
   - *Differentiated Services (since all packets are ICMP they use the sameType of Service class)*
   - *Upper Layer Protocol (since these are ICMP packets)*

   *The fields that must stay constant are:*

   - *Version (since we are using IPv4 for all packets)*
   - *header length (since these are ICMP packets)*
   - *source IP (since we are sending from the same source)*
   - *destination IP (since we are sending to the same dest)*
   - *Differentiated Services (since all packets are ICMP they use the sameType of Service class)*
   - *Upper Layer Protocol (since these are ICMP packets)*

   The fields that must change are:\*

   - *Identification(IP packets must have different ids)*
   - *Time to live (traceroute increments each subsequent packet)*
   - *Header checksum (since header changes, so must checksum)*
7. 描述您在 IP datagram 的 Identification field 中的值中所看到的

   *The pattern is that the IP header Identification fields increment with each ICMP Echo (ping) request.*

   **这部分是不相同的，且是逐渐递增的，用来区分每个 IP 数据报和处理 IP 分片。**

下一步（数据包仍按来源地址排序）查找最近的（第一跳）路由器发送到您的计算器的一系列 ICMP TTL 超出的回复讯息。

8. ID 字段和 TTL 字段的值是多少？

   *Identification*: 42507

   *TTL*: *224*

   ![](https://img-blog.csdnimg.cn/a732a9237488466eb9c22f01e9d3dc26.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
9. 对于最近（第一跳）路由器发送到您的计算器的所有 ICMP TTL 超出的回复，这些值是否保持不变？为什么？

   *The identification field changes for all the ICMP TTL-exceeded replies because the identification field is a unique value. When two or more IP datagrams have the same identification value, then it means that these IP datagrams are fragments of a single large IP datagram.The TTL field remains unchanged because the TTL for the first hop router is always the same*.

   所有ICMP TTL超出应答的标识字段都会更改，因为标识字段是唯一值。当两个或多个IP数据报具有相同的标识值时，则意味着这些IP数据报是单个大型IP数据报的片段。TTL字段保持不变，因为第一跳路由器的TTL始终相同

   ![](https://img-blog.csdnimg.cn/50ad532e402b434fb50dfe5a4a9f8123.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

## Fragmentation

单击“时间”列，再次按时间对数据包列表进行排序。

10. 在将 pingplotter 中的数据包大小更改为 2000 后，查找计算机发送的第一个ICMP Echo Request 消息。该消息是否已碎片化为多个 IP 数据报？ [注意：如果你发现你的数据包没有被分割，你应该下载 zip 文件http://gaia.cs.umass.edu/wireshark-labs/wireshark-traces.zip 并提取 ip-ethereal-trace-1packet 跟踪。 如果您的计算机具有以太网接口，则数据包大小为2000 会导致碎片。]

    是的
11. 打印出碎片 IP 数据报的第一个片段。 IP 头中的哪些信息表明数据报已碎片化？ IP 头中的哪些信息表明这是第一个片段还是后一个片段？ 这个 IP 数据报有多长？

    - Flags ： 0x20， More Fragment
    - Fragment Offset ：0
    - Data ： 1480 bytes， Header Length ： 20 bytes， Total Length ： 1480 + 20 = 1500 bytes

    ![](https://img-blog.csdnimg.cn/3ca85336d10e40b1a993adaddd87bb0b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
12. 打印出碎片 IP 数据报的第二个片段。 IP 标头中的哪些信息表明这不是第一个数据报片段？ 是否还有更多的片段？ 你是如何知道的？

    - Fragment Offset： 1480
    - Flags：0x00

    ![](https://img-blog.csdnimg.cn/5e85ce80379c4524a3840c6fd2ce9407.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

    ![](https://img-blog.csdnimg.cn/06aa35e16b144e5d8f1438090573e9f4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
13. 在第一个和第二个片段中，IP 标头中哪些字段发生了变化？

    *The IP header fields that changed between the fragments are: total length, flags, fragment offset, and checksum.*

现在，在将 pingplotter 中的数据包大小更改为 3500 后，找到计算机发送的第一个ICMP Echo Request 消息。

![](https://img-blog.csdnimg.cn/ddd81a0384ff4901a410d0a93472fbdd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

14. 从原始数据报创建了多少个片段？

    *After switching to 3500, there are 3 packets created from the original* datagram.\*
15. 片段中 IP 标头中的哪些字段发生了变化？

    *The IP header fields that changed between all of the packets are: fragment offset, and checksum. Between the first two packets and the last packet, we see a change in total length, and also in the flags. The first two packets have a total length of 1500, with the more fragments bit set to 1, and the last packet has a total length of 540, with the more fragments bit set to 0.*

    在所有数据包之间更改的IP报头字段为：片段偏移量和校验和。在前两个数据包和最后一个数据包之间，我们看到总长度发生了变化，标志也发生了变化。前两个数据包的总长度为1500，More Fragments位设置为1，最后一个数据包的总长度为540，More Fragments位设置为0
