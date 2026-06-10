---
title: CS144-Lab5
date: '2023-02-24T14:32:48.000Z'
updated: '2023-02-25T07:21:58.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/24/CS144-Lab5
oldUrl: /2023/02/24/CS144-Lab5/
excerpt: >-
  在本周的实验中，你将深入研究并实现一个网络接口：世界各地的互联网数据报和一跳一跳的链路层以太网帧之间的桥梁。该组件可以“隐藏”在早期实验的TCP/IP实现之下，但它也将用于不同的设置：当你在实验6中建立一个路由器时，它将在网络接口之间路由数据报。图1显示了网络接口如何适应这两种设置。
  你对网络接口的实现将使用与你在实验0 4中使用的相同的Sponge库，并增...
---
## 概述

在本周的实验中，你将深入研究并实现一个网络接口：世界各地的互联网数据报和一跳一跳的链路层以太网帧之间的桥梁。该组件可以“隐藏”在早期实验的TCP/IP实现之下，但它也将用于不同的设置：当你在实验6中建立一个路由器时，它将在网络接口之间路由数据报。图1显示了网络接口如何适应这两种设置。

你对网络接口的实现将使用与你在实验0-4中使用的相同的Sponge库，并增加了类和测试。但是，应大众的要求，本实验的大部分(但不是全部)都可以在不依赖早期实验的TCP连接的情况下完成。

在过去的实验中，你写了一个TCP实现，可以成功地与使用TCP的任何其他计算机交换TCP段。这些网段实际上是如何传达给对等方的TCP实现的呢？正如我们所讨论的，有几种选择：

- **TCP-in-UDP-in-IP**：TCP段可以在用户数据报的有效载荷中携带。在正常(用户空间)环境下工作时，这是最容易实现的。Linux提供了一个接口(“互联网数据报套接字”，`UDPSocket`)，允许应用程序只提供用户数据报和目标地址的有效载荷，内核负责构造UDP报头、IP报头和以太网报头，然后将数据包发送到适当的下一跳。内核确保每个套接字具有本地和远程地址以及端口号的独占组合，并且由于内核是将这些地址和端口号写入UDP和IP头的内核，因此它可以保证不同应用程序之间的隔离。
- **TCP-in-IP**：在通常情况下，TCP段几乎总是直接放在互联网数据报中，在IP和TCP报头之间没有UDP报头。这就是人们所说的”TCP/IP”。这在实现上要困难一些。Linux提供了一个称为TUN设备的接口，该接口允许应用程序提供整个Internet数据报，内核负责其余部分(编写以太网报头，并通过物理以太网卡实际发送，等等)。但是现在，应用程序必须自己构造完整的IP报头，而不仅仅是有效载荷。

  你已经做了这个。在实验4中，我们为你提供了一个表示Internet数据报的对象，它知道如何解析和序列化自身([tcp\_helpers/ipv4\_datagram.{hh,cc}](https://cs144.github.io/doc/lab5/class_i_pv4_datagram.html))以及在IP中封装TCP段的逻辑(现在可以在[tcp\_helpers/tcp\_over\_ip.cc](https://github.com/CS144/sponge/blob/lab5-startercode/libsponge/tcp_helpers/tcp_over_ip.cc)中找到)。`CS144TCPSocket`使用这些工具将`TCPConnection`连接到TUN设备。
- **TCP-in-IP-in-Ethernet**：在上述方法中，我们仍然依赖于Linux内核的部分网络栈。每次你的代码向TUN设备写入一个IP数据报时，Linux必须构建一个适当的链路层(以太网)帧，并将IP数据报作为其有效载荷。这意味着Linux必须根据下一跳的IP地址来计算出下一跳的以太网目标地址。如果它还不知道这个映射，Linux就会广播一个查询，问：”谁要求使用下面的IP地址？你的以太网地址是什么？”并等待回应。

  这些功能由网络接口执行：一个将出站IP数据报翻译成链路层(如以太网)帧的组件，反之亦然。(在实际系统中，网络接口通常有`eth0`、`eth1`、`wlan0`等名称。) **在本周的实验中**，你将实现一个网络接口，并把它放在TCP/IP协议栈的最底层。你的代码将产生原始的以太网帧，这些帧将通过一个叫做TAP设备的接口交给Linux——类似于TUN设备，但更底层，因为它交换的是原始链路层帧而不是IP数据报。

大部分的工作是为每个下一跳的IP地址查找(和缓存)以太网地址。这方面的协议被称为**地址解析协议(ARP)**。

我们已经为你提供了单元测试，使你的网络接口能够正常运行。然后，在本实验结束时，你将略微修改你的`webget`，以使用你的TCP实现，这样整个过程将生成原始以太网帧，并且仍然可以通过Internet与真正的Web服务器通信。在实验6中，你将在TCP的上下文之外使用同一个网络接口，作为IP路由器的一部分。

![img](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/1.jpg)

图1：网络接口连接互联网数据报和链路层帧。该组件作为主机TCP/IP堆栈的一部分(左侧)和IP路由器的一部分(右侧)都很有用。

## 开始

1. 请确保你已经提交了你在实验4中的所有解决方案。请不要修改`libsponge`目录顶层以外的任何文件，或者`webget.cc`。(请不要添加代码所依赖的额外文件。)否则，你可能会在合并实验5的启动代码时遇到麻烦。
2. 在实验作业的存储库中，运行`git fetch`来检索实验作业的最新版本。
3. 通过运行`git merge origin/lab5-startercode`，下载实验5的启动代码。
4. 在`build`目录中，编译源代码：`make`(编译时可以运行`make -j4`以使用四个处理器)。
5. 在`build`目录外，打开并开始编辑`writeups/lab5.md`文件。这是你实验报告的模板，将包含在你提交的内容中。

## 地址解析协议

在开始编码之前，请阅读：

- [NetworkInterface对象的公共接口](https://cs144.github.io/doc/lab5/class_network_interface.html)。
- 维基百科对[ARP总结](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)和原始[ARP规范(RFC 1982)](https://datatracker.ietf.org/doc/html/rfc826)。
- [EthernetFrame](https://cs144.github.io/doc/lab5/class_ethernet_frame.html)和[EthernetHeader](https://cs144.github.io/doc/lab5/struct_ethernet_header.html)对象的文档/实现。
- [IPV4数据报](https://cs144.github.io/doc/lab5/class_i_pv4_datagram.html)和[IPv4Header](https://cs144.github.io/doc/lab5/struct_i_pv4_header.html)对象的文档和实现(可以解析和序列化互联网数据报，序列化后可以分配给以太网帧的有效载荷)。
- [ARPMessage](https://cs144.github.io/doc/lab5/struct_a_r_p_message.html)对象的文档和实现(它知道如何解析和序列化ARP消息，并且在序列化时还可以作为以太网帧的有效载荷)。

本实验的主要任务是实现`NetworkInterface`的三种主要方法(在`network_interface.cc`文件中)，维护从IP地址到以太网地址的映射。映射是一个缓存，或“软状态”：NetworkInterface为了提高效率而保留它，但是如果它必须从头开始重新启动，映射将自然地重新生成，而不会引起问题。

1. `void NetworkInterface::send_datagram(const InternetDatagram &dgram, const Address &next_hop)`

   当调用者(如你的TCPConnection或路由器)希望将出站互联网(IP)数据报发送到下一个跃点时，将调用此方法。(请不要把数据报的最终目的地与下一跳混为一谈，后者在数据报自己的报头中是目标地址。在这个实验里，你只关心下一跳的地址。)该接口的工作是将此数据报转换为以太网帧并(最终)发送。

   - 如果目标以太网地址已知，请立即发送。创建以太网帧(`type = EthernetHeader::TYPE_IPv4`)，将有效载荷设置为序列化数据报，并设置源地址和目标地址。
   - 如果目标以太网地址未知，广播下一跳以太网地址的ARP请求，并将IP数据报排队，以便在收到ARP回复后发送。

   **例外**：你不想让ARP请求充斥网络。如果网络接口在过去5秒内已经发送了一个关于相同IP地址的ARP请求，不要发送第二个，只需等待第一个请求的回复即可。同样，对数据报进行排队，直到了解到目标以太网地址。
2. `optional<InternetDatagram> NetworkInterface::recv_frame(const EthernetFrame &frame)`

   当以太网帧从网络到达时，调用此方法。代码应忽略任何不发送到网络接口的帧(也就是说，只接受以太网目的地是广播地址或存储在以太网地址成员变量`_ethernet_address`中的以太网地址)。

   - 如果入站帧是IPv4，将有效载荷解析为`InternetDatagram`，如果成功(意味着`parse()`方法返回`ParseResult::NoError`)，则将生成的`InternetDatagram`返回给调用者。
   - 如果入站帧是ARP，将有效载荷解析为ARP消息，如果成功，记住发送方的IP地址和以太网地址之间的映射，持续30秒。(从请求和回复中学习映射。)此外，如果是ARP请求请求我们的IP地址，请发送适当的ARP回复。
3. `void NetworkInterface::tick(const size_t ms_since_last_tick)`

   随着时间的推移，这将被调用。使任何已经过期的IP到以太网的映射过期。

你可以通过运行`ctest -V -R "^arp"`来测试你的实现。此测试不依赖于你的TCP实现。

```cpp
class NetworkInterface {
  private:
    //! Ethernet (known as hardware, network-access-layer, or link-layer) address of the interface
    EthernetAddress _ethernet_address;

    //! IP (known as internet-layer or network-layer) address of the interface
    Address _ip_address;

    //! outbound queue of Ethernet frames that the NetworkInterface wants sent
    std::queue<EthernetFrame> _frames_out{};

    typedef time_t size_t;

    // map + heap to achieve O(lgN) search,insert,expire check operation of IP-to-Ethernet mappings
    std::map<uint32_t, std::pair<EthernetAddress, time_t>> _arp_table{};
    std::priority_queue<std::pair<time_t, uint32_t>,
                        std::vector<std::pair<time_t, uint32_t>>,
                        std::greater<std::pair<time_t, uint32_t>>>
        _arp_failure_time{};

    time_t _curr_time{};

    // datagrams not sent yet
    std::queue<std::pair<InternetDatagram, Address>> _dgrames_queue{};

    // < arp request sent and not get response yet, timestamp, ip to find>
    std::tuple<bool, time_t, uint32_t> _arp_retransmission_timer{};

  public:
    //! \brief Construct a network interface with given Ethernet (network-access-layer) and IP (internet-layer) addresses
    NetworkInterface(const EthernetAddress &ethernet_address, const Address &ip_address);

    //! \brief Access queue of Ethernet frames awaiting transmission
    std::queue<EthernetFrame> &frames_out() { return _frames_out; }

    //! \brief Sends an IPv4 datagram, encapsulated in an Ethernet frame (if it knows the Ethernet destination address).

    //! Will need to use [ARP](\ref rfc::rfc826) to look up the Ethernet destination address for the next hop
    //! ("Sending" is accomplished by pushing the frame onto the frames_out queue.)
    void send_datagram(const InternetDatagram &dgram, const Address &next_hop);

    //! \brief Receives an Ethernet frame and responds appropriately.

    //! If type is IPv4, returns the datagram.
    //! If type is ARP request, learn a mapping from the "sender" fields, and send an ARP reply.
    //! If type is ARP reply, learn a mapping from the "sender" fields.
    std::optional<InternetDatagram> recv_frame(const EthernetFrame &frame);

    //! \brief Called periodically when time elapses
    void tick(const time_t ms_since_last_tick);
    // boardcast to find the Ethernet addr of an ip 
    void send_arp_request(const uint32_t ip_to_find);
    // resend the datagrams queued for not knowing their Ehternet addrs
    void resend();
};
```

- `_ethernet_address` 和 `_ip_address` 分别表示该接口的以太网地址和 IP 地址。
- `_frames_out` 保存尚未发送的数据帧，通过 `frames_out()` 方法获取该队列。
- `_arp_table` 和 `_arp_failure_time` 用于保存 IP 地址和以太网地址的映射，前者保存正常情况下的映射，后者保存因为 ARP 请求失败而需要重试的映射。
- `_dgrames_queue` 保存尚未发送的数据报，其中数据报表示一个完整的 IP 数据包。
- `send_datagram()` 方法用于发送 IP 数据报，其中需要通过 ARP 协议找到下一跳的以太网地址。
- `recv_frame()` 方法用于接收以太网帧并进行处理，如果接收到的是 IPv4 数据帧则返回一个数据报，如果是 ARP 请求或回复则需要进行对应的处理。
- `tick()` 方法表示时间流逝，用于处理 ARP 请求的超时和重新发送尚未发送的数据报。
- `send_arp_request()` 方法用于向网络广播 ARP 请求，以寻找特定 IP 地址的以太网地址。
- `resend()` 方法用于重新发送尚未发送成功的数据报。

```cpp
void NetworkInterface::resend() {
    while (!_dgrames_queue.empty()) {
        auto dgrams = _dgrames_queue.front();
        const uint32_t next_hop_ip = dgrams.second.ipv4_numeric();
        // if destination Ehernet address known
        if (_arp_table.count(next_hop_ip)) {
            _dgrames_queue.pop();
            send_datagram(dgrams.first, dgrams.second);
        } else {
            break;
        }
    }
}
```

`resend()`，用于重新发送还未发送成功的数据报。函数中，通过 `while` 循环遍历 `_dgrames_queue`（存储了还未成功发送的数据报），如果下一跳的 Ethernet 地址已经存在（即在 `_arp_table` 中），那么就将该数据报从队列中移除，调用 `send_datagram()` 方法进行发送，如果下一跳的 Ethernet 地址不存在，那么就退出循环。

因为在 `send_datagram()` 中，如果目的地的 Ethernet 地址不可用，则会将该数据报添加到 `_dgrames_queue` 中，等待重新发送。因此，`resend()` 的作用就是从队列中取出数据报重新发送，直到队列为空或者下一跳的 Ethernet 地址可用为止。

```cpp
//! \param[in] dgram the IPv4 datagram to be sent
//! \param[in] next_hop the IP address of the interface to send it to (typically a router or default gateway, but may also be another host if directly connected to the same network as the destination)
//! (Note: the Address type can be converted to a uint32_t (raw 32-bit IP address) with the Address::ipv4_numeric() method.)
void NetworkInterface::send_datagram(const InternetDatagram &dgram, const Address &next_hop) {
    // convert IP address of next hop to raw 32-bit representation (used in ARP header)
    const uint32_t next_hop_ip = next_hop.ipv4_numeric();
    // if destination Ehernet address known
    if (_arp_table.count(next_hop_ip)) {
        EthernetFrame to_send;
        to_send.payload() = dgram.serialize();
        to_send.header().dst = _arp_table[next_hop_ip].first;
        to_send.header().src = _ethernet_address;
        to_send.header().type = EthernetHeader::TYPE_IPv4;
        _frames_out.emplace(to_send);
    } else {                                          // if destination Ethernet address unkown
        if (!get<bool>(_arp_retransmission_timer)) {  // no arp sent yet
            send_arp_request(next_hop_ip);
        }
        //  queue the IP datagram
        _dgrames_queue.push({dgram, next_hop});
    }
    resend();
}
```

这段代码实现了将一个 IPv4 数据报通过该网络接口发送出去的功能。其中，数据报和下一个跳的地址（一般是路由器或者默认网关，但也可能是直接连接在同一网络中的另一个主机）作为参数传入。

首先，将下一跳地址转换为 uint32\_t 类型的 IPv4 地址。如果已知下一跳的 Ethernet 地址，则将数据报封装成 Ethernet 帧并发送出去。如果下一跳的 Ethernet 地址不可知，则将此数据报加入到待发送数据报队列中，并发送 ARP 请求以查找下一跳的 Ethernet 地址。

最后，通过调用 `resend()` 函数来遍历待发送数据报队列，查看其中是否有已知下一跳地址的数据报，如果有，则将其从队列中弹出，并重复调用 `send_datagram()` 函数进行数据报发送。如果待发送数据报队列中没有已知下一跳地址的数据报，则函数退出。

```cpp
//! \param[in] frame the incoming Ethernet frame
optional<InternetDatagram> NetworkInterface::recv_frame(const EthernetFrame &frame) {
    if (frame.header().dst != _ethernet_address && frame.header().dst != ETHERNET_BROADCAST)
        return {};
    if (frame.header().type == EthernetHeader::TYPE_IPv4) {
        InternetDatagram ret;
        if (ret.parse(Buffer(frame.payload())) == ParseResult::NoError) {
            return ret;
        }
    } else if (frame.header().type == EthernetHeader::TYPE_ARP) {
        // parse
        ARPMessage arp_packet;
        if (arp_packet.parse(Buffer(frame.payload())) == ParseResult::NoError) {
            // record the sender's info
            _arp_table[arp_packet.sender_ip_address] = {arp_packet.sender_ethernet_address, _curr_time + 30 * 1000};
            // turn off timer
            if (get<bool>(_arp_retransmission_timer) &&
                get<uint32_t>(_arp_retransmission_timer) == arp_packet.sender_ip_address)
                _arp_retransmission_timer = make_tuple(false, 0, 0);
            _arp_failure_time.push({_curr_time + 30 * 1000, arp_packet.sender_ip_address});

            // send reply
            if (arp_packet.target_ip_address == _ip_address.ipv4_numeric() &&
                arp_packet.opcode == ARPMessage::OPCODE_REQUEST) {
                EthernetFrame arp_to_send;
                // header
                arp_to_send.header().dst = arp_packet.sender_ethernet_address;
                arp_to_send.header().src = _ethernet_address;
                arp_to_send.header().type = EthernetHeader::TYPE_ARP;
                // payload
                ARPMessage arp_reply;
                arp_reply.opcode = ARPMessage::OPCODE_REPLY;
                arp_reply.sender_ethernet_address = _ethernet_address;
                arp_reply.sender_ip_address = _ip_address.ipv4_numeric();
                arp_reply.target_ethernet_address = arp_packet.sender_ethernet_address;
                arp_reply.target_ip_address = arp_packet.sender_ip_address;
                arp_to_send.payload() = BufferList(move(arp_reply.serialize()));
                // send reply
                // cerr<< "send reply" << arp_reply.to_string() <<endl;
                _frames_out.emplace(arp_to_send);
            }
        }
        resend();
    }
    return {};
}
```

这个方法是在网络接口接收到一个新的以太网帧时被调用。

如果接收到帧的目的地址不是该接口的以太网地址，也不是广播地址，那么说明该帧不是发给该接口的，因此该方法返回一个空的可选值。

如果该帧包含一个IPv4数据报，该方法尝试从帧的负载中解析数据报。如果解析成功，该方法返回解析后的数据报，以可选值的形式封装返回。

如果该帧包含一个ARP消息，该方法尝试从帧的负载中解析消息。如果解析成功，该方法会更新ARP表中的发送者信息，关闭对应的ARP重传计时器（如果有的话），并将ARP条目的到期时间推入到ARP失败时间堆中。如果ARP消息是一个针对该接口IP地址的ARP请求，该方法会构建一个ARP回复并将其发送回发送者。

在处理接收到的帧后，该方法调用resend()方法检查是否有任何等待ARP解析的数据报被排队。

```cpp
//! \param[in] ms_since_last_tick the number of milliseconds since the last call to this method
void NetworkInterface::tick(const time_t ms_since_last_tick) {
    _curr_time += ms_since_last_tick;

    // Expire any IP-to-Ethernet mappings that have expired.
    while (!_arp_failure_time.empty()) {
        auto arp_entry = _arp_failure_time.top();
        if (arp_entry.first <= _curr_time) {
            _arp_failure_time.pop();
            if (_arp_table[arp_entry.second].second <= _curr_time)
                _arp_table.erase(arp_entry.second);
        } else {
            break;
        }
    }

    // Resend arp if no response
    if (get<bool>(_arp_retransmission_timer) && _curr_time - get<time_t>(_arp_retransmission_timer) > 5 * 1000) {
        auto ip_to_find = get<uint32_t>(_arp_retransmission_timer);
        send_arp_request(ip_to_find);
    }
}
```

tick() 方法会定期调用来执行各种维护任务。

该方法通过将自上次调用该方法以来经过的毫秒数添加到当前时间来更新当前时间。

然后，该方法通过迭代 ARP 失败时间堆来检查是否有已过期的 IP 到 Ethernet 映射。如果堆中的某个条目的过期时间小于或等于当前时间，则该方法将该条目从堆中弹出，并检查对应的 ARP 表中的 ARP 条目是否也已过期。如果 ARP 条目已过期，则该方法从 ARP 表中删除该条目。

接下来，该方法检查是否需要重新发送 ARP 请求。如果已经发送了 ARP 请求且当前时间减去请求发送时间大于 5 秒，则该方法会重新发送 ARP 请求。

总体而言，tick() 方法确保已过期的 ARP 条目从 ARP 表中删除，并在及时未收到响应时重新发送 ARP 请求。

- `NetworkInterface::NetworkInterface(const EthernetAddress &ethernet_address, const Address &ip_address)`：构造函数，初始化网络接口的以太网地址和 IP 地址。
- `NetworkInterface::send_datagram(const InternetDatagram &dgram, const Address &next_hop)`：发送 IP 数据包，如果目的 IP 对应的以太网地址已知，则直接封装成以太网帧并通过 `_frames_out` 成员变量发送出去，否则发送 ARP 请求并将 IP 数据包加入到待发送队列 `_dgrames_queue` 中等待。
- `NetworkInterface::recv_frame(const EthernetFrame &frame)`：接收以太网帧，如果帧的目的地址是本机的以太网地址或者广播地址，则根据帧类型分别处理。如果是 IP 数据帧，尝试解析出 IP 数据包并返回；如果是 ARP 请求或响应帧，则更新 ARP 表，并根据请求发送响应帧。
- `NetworkInterface::tick(const time_t ms_since_last_tick)`：定期调用的方法，用于处理 ARP 表项的过期和 ARP 请求的超时重传。
- `NetworkInterface::send_arp_request(const uint32_t ip_to_find)`：发送 ARP 请求，将请求封装成以太网帧并通过 `_frames_out` 成员变量发送出去，并设置超时计时器 `_arp_retransmission_timer`。
- `NetworkInterface::resend()`：定期检查待发送队列 `_dgrames_queue` 中是否有 IP 数据包可以发送，如果目的 IP 对应的以太网地址已知，则封装成以太网帧并通过 `_frames_out` 成员变量发送出去，否则停止检查。

## webget回顾

还记得你在实验0中写的`webget.cc`吗(在`TCPSocket`中使用Linux提供的TCP实现)？还记得你在实验4中如何修改它，以便在`CS144TCPSocket`中使用你自己的TCP-in-IP实现吗？如上所述，这仍然依赖于Linux内核作为堆栈的一部分：在IP和链路层(以太网)之间转换的网络接口。

我们希望你在不更改任何其他内容的情况下将其切换为使用网络接口。你只需将`CS144TCPSocket`类型替换为`FullStackSocket`。

这将使用TCP-in-IP-in-Ethernet堆栈，如图1(左侧)所示：你的`webget.cc`应用程序，在TCP的TCPConnection实现之上，在TCP-in-IP的[tcp\_helpers/tcp\_over\_ip.cc](https://github.com/CS144/sponge/blob/lab5-startercode/libsponge/tcp_helpers/tcp_over_ip.cc)代码之上，在`NetworkInterface`之上。

重新编译并运行`make check_lab5`以确认你已经完成了完整的堆栈：你已经在自己完整的TCP实现和自己的网络接口实现之上编写了一个基本的网络抓取程序，并且它仍然成功地与真正的Web服务器通信。

如果遇到问题，请尝试手动运行该程序：`./apps/webget cs144.keithw.org /hasher/xyzzy`，并尝试使用`wireshark`捕获它发送和接收的内容。你可以通过运行`sudo TCPdump -i tap10 -w /tmp/packets.tap`来保存它正在发送和接收的分组。然后在`wireshark`中打开`/tmp/packets.tap`文件。

## 完整代码

- [network\_interface.hh](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/network_interface.hh)

- [network\_interface.cc](https://github.com/Misaka-9982-coder/CS144-fa21/blob/optimize/libsponge/network_interface.cc)
