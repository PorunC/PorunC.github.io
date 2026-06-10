---
title: Wireshark-Lab4 UDP
date: '2022-03-04T05:52:42.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/04/Wireshark-Lab4
oldUrl: /2022/03/04/Wireshark-Lab4/
excerpt: >-
  在本实验中，我们将快速了解 UDP 传输协议。 正如我们在本文第 3 章中所看到的，UDP 是一种简化的协议。
  在进行本实验之前，您可能需要重新阅读课本中的第 3.3 节。 由于 UDP 简单易理解，您只需要一点花费时间就能做这个实验。我们默认认同您已经熟悉
  Wireshark 的操作，因此我们不会提供详细的截图说明和操作步骤。 开始在 Wireshark ...
---
# Lab4:UDP

在本实验中，我们将快速了解 UDP 传输协议。 正如我们在本文第 3 章中所看到的，UDP 是一种简化的协议。 在进行本实验之前，您可能需要重新阅读课本中的第 3.3 节。 由于 UDP 简单易理解，您只需要一点花费时间就能做这个实验。我们默认认同您已经熟悉 Wireshark 的操作，因此我们不会提供详细的截图说明和操作步骤。

开始在 Wireshark 中捕获数据包，然后执行一些会导致主机发送和接收多个 UDP数据包的操作。 您也可以什么也不做，仅执行 wireshark 捕获以便获取其他程序发给您的 UDP 数据包。 有一种特殊情况：简单网络管理协议（SNMP - 请参阅课本中的第 5.7 节）在 UDP 内部发送 SNMP 消息，因此您可能会在跟踪中找到一些SNMP 消息（以及 UDP 数据包）。

停止数据包捕获后，设置数据包筛选器，以便 Wireshark 仅显示在主机上发送和接收的 UDP 数据包。 选择其中一个 UDP 数据包并在详细信息窗口中展开 UDP 字段。 如果您无法找到 UDP 数据包或无法在实时网络连接上运行 Wireshark，则可以下载包含某些 UDP 数据包的数据包跟踪。

如果可能的话建议您使用 wireshark 的文件->打印功能将您跟踪回答数据包最小详细结果打印出来，并且通过注释圈出。

1. 从跟踪中选择一个 UDP 数据包。 从此数据包中，确定 UDP 标头中有多少字段。 （建议不要查看课本，直接根据您的数据包跟踪结果回答），并为这些字段命名。

   - 4个字段
     - Source Port
     - Destination Port
     - Length
     - Checksum
   - ![](https://img-blog.csdnimg.cn/098c6fb08eed4508bfbd6669a5eeef7d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
   - 中括号部分不是字段
2. 通过查询 Wireshark 的数据包内容字段中显示的信息，确定每个 UDP 报头字段的长度（以字节为单位）。

   The UDP header consists of four fields each of 2 bytes in length:

   - **Source Port** (UDP packets from a client use this to indicate the session on the local client that originated the packet.)
   - **Destination Port** (UDP packets from a client use this to indicate the service required from the remote server.
   - **UDP length** (The number of bytes comprising the combined UDP header information and payload data)
   - **UDP Checksum** (A [checksum](https://erg.abdn.ac.uk/users/gorry/course/inet-pages/ip-cksum.html) to verify that the end to end data has not been corrupted by [routers](https://erg.abdn.ac.uk/users/gorry/course/inet-pages/router.html) or [bridges](https://erg.abdn.ac.uk/users/gorry/course/lan-pages/bridge.html) in the network or by the processing in an end system. The algorithm to compute the checksum is the Standard Internet Checksum algorithm. This allows the receiver to verify that it was the intended destination of the packet, because it covers the IP addresses, port numbers and protocol number, and it verifies that the packet is not truncated or padded, because it covers the size field. Therefore, this protects an application against receiving corrupted payload data in place of, or in addition to, the data that was sent. In the cases where this check is not required, the value of 0x0000 is placed in this field, in which case the data is not checked by the receiver.

   由于UDP报头就4个部分，每部分2Byte=16Bit，因此每个UDP报头8Byte=64Bit。
3. 长度字段中的值是指的是什么？（此问题您可以参考课本）。 使用捕获的UDP 数据包验证您的声明。

   长度字段指报文长度，如上图1中，Length:144，为 $UDP\ payload + UDP\ header$ 的长度和，即 $144 = 136 + 2 \times 4$
4. UDP 有效负载中可包含的最大字节数是多少？ （提示：这个问题的答案可以通过你对上述 2 的回答来确定）

   UDP header 中的 length 字段为2个 Byte 即 16 Bit，所以整个UDP的有效负载可包含的最大字节数为$2 ^{16} - 1 = 65535$，去除头部字段的 8 个Byte 则剩下 $65535 - 8 = 65527$
5. 最大可能的源端口号是多少？ （提示：见 4 中的提示）

   Source Port 和 Destination Port 的长度都为16 Bit 所以最大的端口号为 $2^{16} - 1 = 65535$
6. UDP 的协议号是什么？ 以十六进制和十进制表示法给出答案。 要回答这个问题，您需要查看包含此 UDP 段的 IP 数据报的 Protocol 字段（参见书中的图 4.13 和 IP 头字段的讨论）。

   - UDP的协议号 ： UDP(17) （十进制）， x11 （十六进制）
   - ![](https://img-blog.csdnimg.cn/c732ce72f2334ff4afc907100b9427cd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
7. 观察发送 UDP 数据包后接收响应的 UDP 数据包，这是对发送的 UDP 数据包的回复，请描述两个数据包中端口号之间的关系。（提示：对于响应UDP 目的地应该为发送 UDP 包的地址）

   - 请求

     ![](https://img-blog.csdnimg.cn/3592b38c5826409d8e6f597c41f19e00.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)
   - 响应

     ![](https://img-blog.csdnimg.cn/b42098b2cb664caf8d28f35b913f1aa3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

     请求和响应的 Source Port 和 Destination Port 相互对应

​
