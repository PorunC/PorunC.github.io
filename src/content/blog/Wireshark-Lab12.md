---
title: Wireshark-Lab12 SSL
date: '2022-03-13T16:27:31.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/14/Wireshark-Lab12
oldUrl: /2022/03/14/Wireshark-Lab12/
excerpt: >-
  In this lab, we’ll investigate the Secure Sockets Layer (SSL) protocol,
  focusing on the SSL records sent over a TCP connection. We’ll do so by
  analyzing a trace of the SSL records ...
---
# Lab:SSL

In this lab, we’ll investigate the Secure Sockets Layer (SSL) protocol, focusing on the SSL records sent over a TCP connection. We’ll do so by analyzing a trace of the SSL records sent between your host and an e-commerce server. We’ll investigate the various SSL record types as well as the fields in the SSL messages. You may want to review Section 8.6 in the text1 .

在本实验中，我们将研究安全套接层（SSL）协议，我们将会重点关注通过 TCP连接发送的 SSL 记录。我们将会通过您的主机和电子商务服务器发送的 SSL 记录的跟踪来实现。 我们将研究各种 SSL 记录类型以及 SSL 消息中的字段。您可能会需要重新查看课本中的 8.6 节。

![](https://img-blog.csdnimg.cn/b20a6597d1964bcc819572db8d0617a7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

## 1. Capturing packets in an SSL session 在 SSL 会话中抓包

The first step is to capture the packets in an SSL session. To do this, you should go to your favorite e-commerce site and begin the process of purchasing an item (but terminating before making the actual purpose!). After capturing the packets with Wireshark, you should set the filter so that it displays only the Ethernet frames that contain SSL records sent from and received by your host. (An SSL record is the same thing as an SSL message.) You should obtain something like screenshot on the previous page.

第一步是在 SSL 会话中捕获数据包。要做这一步，您应该去你最喜欢电子商务网站开始购买物品（但是请勿真的购买）。使用 Wireshark 捕获数据包后，应设置过滤器，使其仅显示包含主机发送和接收的 SSL 记录的以太网帧。 （SSL 记录就是SSL 消息）您应该获得如上屏幕截图所示的内容。

If you have difficulty creating a trace, you should download the zip file <http://gaia.cs.umass.edu/wireshark-labs/wireshark-traces.zip> and extract the *ssl-ethereal trace-1* packet trace.

如果您抓包跟踪遇到困难，建议下载作者的抓包结果并且解压 *ssl-ethereal-trace-1\*\*进行分析（*<http://gaia.cs.umass.edu/wireshark-labs/wireshark-traces.zip>*）。*

## 2. A look at the captured trace 分析抓包结果

Your Wireshark GUI should be displaying only the Ethernet frames that have SSL records. It is important to keep in mind that an Ethernet frame may contain one or more SSL records. (This is very different from HTTP, for which each frame contains either one complete HTTP message or a portion of a HTTP message.) Also, an SSL record may not completely fit into an Ethernet frame, in which case multiple frames will be needed to carry the record.

您使用的 Wireshark 界面应该仅仅显示含有 SSL 记录的以太网帧。建议您记住：每个以太网帧可能包含一个或多个的 SSL 记录，这点很重要。（这与 HTTP 消息不同，每个以太网帧包含一个完整的 HTTP 消息或者仅仅包含 HTTP 消息的一部分）因此，SSL 记录不仅仅需要一个以太网帧，这样的话，将有多个以太网承载。

Whenever possible, when answering a question below, you should hand in a printout of the packet(s) within the trace that you used to answer the question asked. Annotate the printout2 to explain your answer. To print a packet, use *File->Print*, choose *Selected* *packet only*, choose *Packet summary line,* and select the minimum amount of packet detail that you need to answer the question

请尽量清晰的展示您的答案，必要时您可以在图中用标记辅以说明。您的答案应该简单可读。

1. For each of the first 8 Ethernet frames, specify the source of the frame (client or server), determine the number of SSL records that are included in the frame, and list the SSL record types that are included in the frame. Draw a timing diagram between client and server, with one arrow for each SSL record.

   对于前 8 个以太网帧，请分别指出每一个帧的来源（客户端和服务器），确定每个帧包含的 SSL 记录的数量，并且列出包含 SSL 记录的类型。绘制客户端和服务器含有箭头指向的时序图。
2. Each of the SSL records begins with the same three fields (with possibly different values). One of these fields is “content type” and has length of one byte. List all three fields and their lengths.

   每个 SSL 记录都以相同的三个字段（可能具有不同的值）开头。 其中一个字段是“内容类型”，长度为一个字节。 请列出所有三个字段及其长度。

ClientHello Record: 客户端发出请求 (ClientHello) 记录

3. Expand the ClientHello record. (If your trace contains multiple ClientHello records, expand the frame that contains the first one.) What is the value of the content type?

   展开 ClientHello 记录（如果您的跟踪包含多个 ClientHello 记录，请展开包含第一个记录的以太网帧），内容类型的值是多少？
4. Does the ClientHello record contain a nonce (also known as a “challenge”)? If so, what is the value of the challenge in hexadecimal notation?

   ClientHello 记录是否包含随机数（也称为“挑战码”（ challenge））？ 如果是这样，十六进制的挑战码值是多少？
5. Does the ClientHello record advertise the cyber suites it supports? If so, in the first listed suite, what are the public-key algorithm, the symmetric-key algorithm, and the hash algorithm?

   ClientHello 记录是否通知了它所支持密码加密套件（suite）？如果是这样，请在第一个密码套件， 分别指出非对称密钥加密算法，对称密钥加密算法，哈希算法分别都是什么？

ServerHello Record: 服务器回应(ServerHello) 记录

6. Locate the ServerHello SSL record. Does this record specify a chosen cipher suite? What are the algorithms in the chosen cipher suite?

   找到 ServerHello SSL 记录。 此记录是否指定了之前的密码套件之一？ 选择的密码套件中有哪些算法？
7. Does this record include a nonce? If so, how long is it? What is the purpose of the client and server nonces in SSL?

   此记录是否包含随机数？如过有，它有多长？SSL 中客户端和服务器段随机数用来干什么？
8. Does this record include a session ID? What is the purpose of the session ID?

   此记录是否包含会话 ID？ 会话 ID 的目的是什么？
9. Does this record contain a certificate, or is the certificate included in a separate record. Does the certificate fit into a single Ethernet frame?

   此记录是否包含证书，或者证书是否包含在单独的记录中。 证书是否适合一个单独的以太网帧传输？

Client Key Exchange Record: 客户端密钥交换记录

10. Locate the client key exchange record. Does this record contain a pre-master secret? What is this secret used for? Is the secret encrypted? If so, how? How long is the encrypted secret?

    找到客户端密钥交换记录。 此记录是否包含前主密钥(pre-master secret)？这个前主密钥用于什么？ 前主密钥加密了吗？ 如果是这样，为什么？ 加密的前主密钥有多长？

Change Cipher Spec Record (sent by client) and Encrypted Handshake Record:

由客户端发送编码改变记录和加密握手记录：

11. What is the purpose of the Change Cipher Spec record? How many bytes is the record in your trace?

    编码改变记录目的是什么？在您的跟踪中本记录有多少字节。
12. In the encrypted handshake record, what is being encrypted? How?

    在加密的握手记录中，什么是加密的？ 为什么？
13. Does the server also send a change cipher record and an encrypted handshake record to the client? How are those records different from those sent by the client?

    服务器是否还向客户端发送更改编码记录和加密的握手记录？ 这些记录与客户发送的记录有何不同？

Application Data 应用数据

14. How is the application data being encrypted? Do the records containing application data include a MAC? Does Wireshark distinguish between the encrypted application data and the MAC?

    如何加密应用程序数据？ 包含应用程序数据的记录是否包含消息认证码MAC？ Wireshark 是否区分加密的应用程序数据和消息认证码 MAC？
15. Comment on and explain anything else that you found interesting in the trace.

    请您指出和解释您在跟踪中发现的任何其他内容。
