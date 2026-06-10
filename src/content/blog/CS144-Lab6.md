---
title: CS144-Lab6
date: '2023-02-25T07:58:46.000Z'
updated: '2023-02-25T08:32:48.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/25/CS144-Lab6
oldUrl: /2023/02/25/CS144-Lab6/
excerpt: >-
  在本周的实验中，你将在现有的NetworkInterface基础上实现一个IP路由器，从而结束本课程。路由器有几个网络接口，可以在其中任何一个接口上接收互联网数据报。路由器的工作是根据
  路由表 转发它得到的数据报：一个规则列表，它告诉路由器，对于任何给定的数据报： 发送到哪个接口； 下一跳的IP地址 ；
  你的工作是实现一个路由器，它可以为任何给定的数据报计算...
---
## 概述

在本周的实验中，你将在现有的`NetworkInterface`基础上实现一个IP路由器，从而结束本课程。路由器有几个网络接口，可以在其中任何一个接口上接收互联网数据报。路由器的工作是根据**路由表**转发它得到的数据报：一个规则列表，它告诉路由器，对于任何给定的数据报：

- 发送到哪个接口；
- 下一跳的IP地址 ；

你的工作是实现一个路由器，它可以为任何给定的数据报计算出这两件事。(你不需要实现设置路由表的算法，例如RIP、OSPF、BGP或SDN控制器，只需要实现跟随路由表的算法)。

你对路由器的实现将使用带有新的`Router`类的Sponge库，以及在模拟网络中检查你的路由器功能的测试。实验6建立在你在实验5中对`NetworkInterface`的实现之上，但不使用你在实验0-4中实现的TCP栈。IP路由器不需要知道任何关于TCP、ARP或以太网的信息(仅限IP)。我们希望你的实现将需要大约25-30行的代码。

![](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/1-20230224183738464.jpg)

图1：路由器包含多个网络接口，可以在其中任何一个接口上接收IP数据报。路由器将接收到的任何数据报转发到相应出站接口上的下一跳，路由表告诉路由器如何做出这个决定。

## 开始

1. 请确保你已经提交了你在实验5中的所有解决方案。请不要修改`libsponge`目录顶层以外的任何文件，或者`webget.cc`。(请不要添加代码所依赖的额外文件。)否则，你可能会在合并实验6的启动代码时遇到麻烦。
2. 在实验作业的存储库中，运行`git fetch`来检索实验作业的最新版本。
3. 通过运行`git merge origin/lab6-startercode`，下载实验6的启动代码。
4. 在`build`目录中，编译源代码：`make`(编译时可以运行`make -j4`以使用四个处理器)。
5. 在`build`目录外，打开并开始编辑`writeups/lab6.md`文件。这是你实验报告的模板，将包含在你提交的内容中。

## 实现路由器

在本实验中，你将实现一个Router类，它可以：

- 跟踪路由表(转发规则或路由列表)，并
- 转发它收到的每个数据报：
  - 转发到正确的下一跳
  - 在正确的出站`NetworkInterface`上

你的实现将被添加到[router.hh](https://github.com/CS144/sponge/blob/lab6-startercode/libsponge/router.hh)和[router.cc](https://github.com/CS144/sponge/blob/lab6-startercode/libsponge/router.cc)骨架文件中。在你开始编码之前，请查看[新的Router类的文档](https://cs144.github.io/doc/lab6/class_router.html)。

下面是你要实现的两个方法，以及我们对每个方法的期望：

```cpp
void add_route(const uint32_t route_prefix,
               const uint8_t prefix_length,
               const optional<Address> next_hop,
               const size_t interface_num);
```

这个方法将一条路由添加到路由表中。你要在Router类中添加一个数据结构作为私有成员来存储这些信息。这个方法所要做的就是保存路由，以供以后使用。

> **路由的各个部分是什么意思？**
>
> 路由是一个”匹配——行动”规则：它告诉路由器，如果一个数据报前往一个特定的网络(一个IP地址范围)，并且如果该路由被选为最具体的匹配路由，那么路由器应该把数据报转发到特定接口上的特定下一跳。
>
> **“匹配”：数据报是前往这个网络的吗?**`route_prefix`和`prefix_length`共同指定了一个可能包括数据报目的地的IP地址范围(一个网络)。`route_prefix`是一个32位数字的IP地址。`prefix_length`是一个介于0和32(包括32)之间的数字；它告诉路由器路由前缀中有多少最高有效位是有效的。例如，要表达一个到网络”18.47.0.0/16”的路由(这与前两个字节为18和47的任何32位IP地址匹配)，路由前缀将是305070080(18×224+47×216)，前缀长度是16。任何以”18.47.x.y”为目的地的数据报都会匹配。
>
> \*\*“行动”：如果路由匹配并被选中，该怎么做。\*\*如果路由器直接连接到有关的网络，`next_hop`将是一个空的可选项；在这种情况下，`next_hop`是数据报的目标地址。但如果路由器是通过其他路由器连接到有关网络的，则`next_hop`将包含路径中下一路由器的IP地址。`interface_num`给出了路由器`NetworkInterface`的索引，它用来将数据报发送到下一跳。你可以用`interface(interface_num)`方法访问这个接口。

```c
void route_one_datagram(InternetDatagram &dgram);
```

这里是橡胶与道路的交汇处。这个方法需要将数据报路由到下一跳，从适当的接口传出。它需要实现IP路由器的”最长前缀匹配”逻辑，以找到最佳路由，这意味着：

- 路由器搜索路由表，以找到与数据报的目的地址相匹配的路由。我们所说的”匹配”是指目的地址的最高有效`prefix_length`比特与`route_prefix`的最高有效`prefix_length`比特相同的。
- 在匹配的路由中，路由器选择具有最大`prefix_length`的路由，这就是**最长前缀匹配**路由。
- 如果没有匹配的路由，路由器会丢弃数据报。
- 路由器会递减数据报的TTL(生存时间)。如果TTL已经为零，或在递减后为零，路由器应该放弃该数据报。
- 否则，路由器将修改后的数据报通过适当的接口(`interface(interface_num).send_datagram()`)发送到适当的下一跳。

> 在这个互联网的设计中，有个优点(或至少是一种成功的抽象)：路由器从不考虑TCP、ARP或以太网帧。路由器甚至不知道链路层是什么样子的。路由器只考虑互联网数据包，并且只通过`NetworkInterface`抽象与链路层进行交互。当涉及到”链路层地址是如何解决的？”或”链路层是否有自己的不同于IP的寻址方案？”或”链路层帧的格式是什么？”或”数据报的有效载荷是什么意思？”等问题时，路由器根本不关心。

```cpp
//! \brief A wrapper for NetworkInterface that makes the host-side
//! interface asynchronous: instead of returning received datagrams
//! immediately (from the `recv_frame` method), it stores them for
//! later retrieval. Otherwise, behaves identically to the underlying
//! implementation of NetworkInterface.
class AsyncNetworkInterface : public NetworkInterface {
    std::queue<InternetDatagram> _datagrams_out{};

  public:
    using NetworkInterface::NetworkInterface;

    //! Construct from a NetworkInterface
    AsyncNetworkInterface(NetworkInterface &&interface) : NetworkInterface(interface) {}

    //! \brief Receives and Ethernet frame and responds appropriately.

    //! - If type is IPv4, pushes to the `datagrams_out` queue for later retrieval by the owner.
    //! - If type is ARP request, learn a mapping from the "sender" fields, and send an ARP reply.
    //! - If type is ARP reply, learn a mapping from the "target" fields.
    //!
    //! \param[in] frame the incoming Ethernet frame
    void recv_frame(const EthernetFrame &frame) {
        auto optional_dgram = NetworkInterface::recv_frame(frame);
        if (optional_dgram.has_value()) {
            _datagrams_out.push(std::move(optional_dgram.value()));
        }
    };

    //! Access queue of Internet datagrams that have been received
    std::queue<InternetDatagram> &datagrams_out() { return _datagrams_out; }
};

struct route_rule{
    uint32_t route_prefix{};
    uint8_t prefix_length{};
    std::optional<Address> next_hop;
    size_t interface_num{};
    route_rule(const uint32_t _route_prefix,
                const uint8_t _prefix_length,
                const std::optional<Address> _next_hop,
                const size_t _interface_num)
    :route_prefix(_route_prefix),prefix_length(_prefix_length)
    ,next_hop(_next_hop),interface_num(_interface_num)
    {}
};

//! \brief A router that has multiple network interfaces and
//! performs longest-prefix-match routing between them.
class Router {
    //! The router's collection of network interfaces
    std::vector<AsyncNetworkInterface> _interfaces{};

    //! Send a single datagram from the appropriate outbound interface to the next hop,
    //! as specified by the route with the longest prefix_length that matches the
    //! datagram's destination address.
    void route_one_datagram(InternetDatagram &dgram);

    std::vector<route_rule> _rules{};

  public:
    //! Add an interface to the router
    //! \param[in] interface an already-constructed network interface
    //! \returns The index of the interface after it has been added to the router
    size_t add_interface(AsyncNetworkInterface &&interface) {
        _interfaces.push_back(std::move(interface));
        return _interfaces.size() - 1;
    }

    //! Access an interface by index
    AsyncNetworkInterface &interface(const size_t N) { return _interfaces.at(N); }

    //! Add a route (a forwarding rule)
    void add_route(const uint32_t route_prefix,
                   const uint8_t prefix_length,
                   const std::optional<Address> next_hop,
                   const size_t interface_num);

    //! Route packets between the interfaces
    void route();
    
    bool prefix_equal(uint32_t ip1, uint32_t ip2, uint8_t prefix_length);
};
```

这段代码实现了一个多接口的路由器，其中每个接口都有一个异步接收数据报的队列。路由器的功能是根据最长前缀匹配算法对接收到的每个数据报进行路由，并将其发送到下一跳，以使其达到目标地址。

`AsyncNetworkInterface`是一个对`NetworkInterface`的封装，它具有一个异步队列`_datagrams_out`，在接收到数据报后将其推送到队列中。它还覆盖了`NetworkInterface`的`recv_frame`方法，以便将数据报推送到队列中，以供稍后检索。

`Router`类有一个包含所有网络接口的向量 `_interfaces`，一个包含所有路由表规则的向量 `_rules`，以及一个`add_interface`方法，用于添加接口。路由器还实现了一个`add_route`方法，该方法接受路由前缀、路由前缀长度、下一跳IP地址(可选)以及出站接口的索引。它将所有路由规则存储在一个向量中，以便在进行数据报路由时进行查找。此外，还实现了一个`route`方法，用于将路由器的所有接口一起轮询，处理每个接口上接收到的数据报，并调用`route_one_datagram`方法将其路由到下一跳。最后，还实现了一个`prefix_equal`方法，用于检查两个IP地址的前缀是否相同。

在路由表的最长前缀匹配算法中，对于目的地址，路由器从路由表中选择最具体的路由，该路由匹配前缀长度最长，而且其匹配的前缀位数与目标地址的前缀位数相同。`prefix_equal`方法用于比较两个IP地址的前缀。

```cpp
//! \param[in] route_prefix The "up-to-32-bit" IPv4 address prefix to match the datagram's destination address against
//! \param[in] prefix_length For this route to be applicable, how many high-order (most-significant) bits of the route_prefix will need to match the corresponding bits of the datagram's destination address?
//! \param[in] next_hop The IP address of the next hop. Will be empty if the network is directly attached to the router (in which case, the next hop address should be the datagram's final destination).
//! \param[in] interface_num The index of the interface to send the datagram out on.
void Router::add_route(const uint32_t route_prefix,
                       const uint8_t prefix_length,
                       const optional<Address> next_hop,
                       const size_t interface_num) {
    cerr << "DEBUG: adding route " << Address::from_ipv4_numeric(route_prefix).ip() << "/" << int(prefix_length)
         << " => " << (next_hop.has_value() ? next_hop->ip() : "(direct)") << " on interface " << interface_num << "\n";
    route_rule r(route_prefix,prefix_length,next_hop,interface_num);
    _rules.push_back(move(r));
}
```

`Router::add_route` 函数添加一个路由规则，包含路由表项中的路由前缀，前缀长度，下一跳地址（如果有），以及数据包的输出接口索引。这个函数打印了调试信息，用于检查添加的路由规则。

```cpp
//! \param[in] dgram The datagram to be routed
void Router::route_one_datagram(InternetDatagram &dgram) {
    uint32_t dst = dgram.header().dst;
    optional<Address> next_hop{};
    size_t interface_num{};
    optional<uint8_t> best_by_far{};

    for(auto& r: _rules) {
        if((!best_by_far.has_value() || r.prefix_length>best_by_far.value()) && prefix_equal(dst,r.route_prefix,r.prefix_length)){
            next_hop = r.next_hop;
            interface_num = r.interface_num;
            best_by_far = r.prefix_length;
        }
    }

    if(best_by_far.has_value()){
        if(dgram.header().ttl>1) {
            dgram.header().ttl--;

            if(next_hop.has_value()) {
                interface(interface_num).send_datagram(dgram,next_hop.value());
            } 
            // if not have next_hop, the next_hop is dgram's destination hop
            else {
                interface(interface_num).send_datagram(dgram,Address::from_ipv4_numeric(dst));
            }        
        }
    }
    
    return;
}
```

`Router::route_one_datagram` 函数根据路由表将数据报路由到下一个合适的接口。它使用路由表中最长前缀匹配的规则来查找应该用哪个输出接口。如果找到合适的路由规则，则检查数据报的 TTL 是否大于1。如果是，减少TTL并将数据报发送到下一个合适的接口。如果找不到合适的路由规则，数据报将被丢弃。

```cpp
void Router::route() {
    // Go through all the interfaces, and route every incoming datagram to its proper outgoing interface.
    for (auto &interface : _interfaces) {
        auto &queue = interface.datagrams_out();
        while (not queue.empty()) {
            route_one_datagram(queue.front());
            queue.pop();
        }
    }
}
```

`Router::route` 函数遍历路由器的所有网络接口，将每个接口的入队数据报依次路由到正确的输出接口上。

```cpp
bool Router::prefix_equal(uint32_t ip1, uint32_t ip2, uint8_t prefix_length) {
    if(prefix_length==0){
        return true;
    } else {
        return (ip1 >> (32-prefix_length)) == (ip2 >> (32-prefix_length));
    }
}
```

`Router::prefix_equal` 函数用于比较两个IP地址的最高 `prefix_length` 位是否相等。如果前缀长度为0，将返回 true。如果前缀长度不为0，则将两个地址右移（32-prefix\_length）位，并比较结果是否相等。

## 测试

你可以通过运行`make checklab6`来测试你的实现。这将在特定的模拟网络中测试路由器，如图2所示。

![](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/2.jpg)

图2：应用/网络模拟器工具中使用的模拟测试网络，也是由`make check lab6`运行的。 (有趣的事实：uun网络是[David Mazieres的互联网切片，于1993年分配](https://whois.arin.net/rest/net/NET-198-178-229-0-1)。`whois`工具或链接的网站可以用来查询谁控制了每个IP地址的分配)。

## Q & A

- 我应该用什么数据结构来记录路由表？

  由你决定! 但不需要太过疯狂。每个数据报需要做O(n)个工作是完全可以接受的，其中n是路由表的条目数。如果你想做一些更有效的事情，我们鼓励你在优化之前先得到一个有效的实现，并仔细记录和评论你选择的任何实现。
- 如何将以地址对象形式出现的IP地址转换为可以写入ARP消息的32位原始整数？

  使用`Address::ipv4_numeric()`方法。
- 如何将一个以原始32位整数形式出现的IP地址转换为一个地址对象？

  使用 `Address::from_ipv4_numeric()`方法。
- 如何将一个32位IP地址的最高n位(其中0≤n≤32) 与另一个32位IP地址的最重要的n位进行比较？

  这可能是这项任务中”最棘手”的部分，因为要让逻辑正确。也许值得在C++中写一个小的测试程序(一个简短的独立程序)或者在Sponge中添加一个测试，以验证你对相关的C++操作符的理解，并仔细检查你的逻辑。

  回顾一下，在C和C++中，将一个32位整数移位32位，可能会产生未定义行为。使用`make_clean`，然后在编译代码时打开sanitizer(`cmake -DCMAKE_BUILD_TYPE=RelASan`)以便在你提交之前尝试捕捉你的代码中任何未定义的行为。

  你可以通过在`build`目录中运行`./apps/network simulator`来直接运行路由器测试。
- 如果路由器没有到目的地的路由，或者TTL为零，它是不是应该向数据报的源头发送一个ICMP错误信息？

  在现实生活中，是的，这将是有帮助的。但在这个实验里没有必要——丢弃数据报就足够了。(即使在现实生活中，也不是每个路由器都会在这些情况下向源头发送ICMP消息)。
- 我如何运行本实验的测试套件？

  `make check_lab6`(两个测试)。或者你可以用`make check`运行整个测试套件(161个测试)。
- 如果这个PDF出来后还有更多的FAQ，我在哪里可以看到？

  请定期查看网站(<https://cs144.github.io/lab_faq.html>)和Piazza。
