---
title: Wireshark基本使用
date: '2022-03-20T16:06:34.000Z'
updated: '2022-03-21T04:58:49.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/21/Wireshark基本使用
oldUrl: /2022/03/21/Wireshark基本使用/
excerpt: >-
  学习安装、使用协议分析软件，掌握基本的数据报捕获、过滤和协议的分析技巧，能对抓取数据包进行分析。 1、使用具有Internet连接的Windows操作系统；
  2、抓包软件Wireshark。 协议分析软件的安装和使用、学会抓取数据包的方法并对对抓取数据包进行分析 安装Wireshark软件 根据以下步骤进行抓包：
  1. 点击Option 按钮，可以看到有多张...
---
# 一、实验目的与要求

学习安装、使用协议分析软件，掌握基本的数据报捕获、过滤和协议的分析技巧，能对抓取数据包进行分析。

# 二、实验内容与方法

1、使用具有Internet连接的Windows操作系统；  
2、抓包软件Wireshark。

协议分析软件的安装和使用、学会抓取数据包的方法并对对抓取数据包进行分析

# 三、实验步骤与过程

## 认识Wireshark

- 安装Wireshark软件

![image-20220321000859708](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321000859708.png)

- 根据以下步骤进行抓包：

1. 点击Option 按钮，可以看到有多张网卡
2. 在Interface中选择对应的网卡
3. 点击 Start 按钮开始抓包

![image-20220321000927302](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321000927302.png)

可以看到Wireshark 窗口中有不同颜色的数据包

![](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321000927302.png)

在Wireshark主界面，报文会显示各种各样的颜色，它们表示不同的含义。这些颜色，是由色彩规则控制的。  
可以通过在 View 选项中点击 Color Rules 来显示Wireshark 中不同协议对应数据包对应的颜色规则

![](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001014162.png)

颜色规则：

![image-20220321001023728](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001023728.png)

Wireshark 窗口各个信息：

![image-20220321002259412](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321002259412.png)

表达式过滤：

- 协议过滤 比如TCP，只显示TCP协议。

![image-20220321001049795](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001049795.png)

- IP 过滤 比如 ip.src ==192.168.0.102 显示源地址为192.168.0.102

![image-20220321001059516](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001059516.png)

ip.dst==192.168.1.102, 目标地址为192.168.1.102

![image-20220321002436543](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321002436543.png)

- 端口过滤 tcp.port ==80,  端口为80的 tcp.srcport == 80,  只显示TCP协议的愿端口为80的。

![image-20220321001141282](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001141282.png)

- Http模式过滤 http.request.method==“GET”,   只显示HTTP GET方法的。

![](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001030949.png)

- 逻辑运算符

![image-20220321004022250](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321004022250.png)

- 复合过滤表达式

![image-20220321001206381](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001206381.png)

## 分析数据包

打开Wireshark程序执行抓包，访问如下网站（看网页和看视频），分别分析DNS、HTTP、TCP、UDP数据包

- <http://www.szu.edu.cn/board/>
- <http://www.szu.edu.cn/tv/>
- <http://www.youku.com>
- <http://www.sina.com.cn>

### 1.DNS

打开http://www.szu.edu.cn/board/ 分析DNS数据包

在抓包开始前先将浏览器缓存清空  
在wireshark过滤窗口中输入 dns && ip.addr == 192.168.0.102并同时开始进行抓包

![image-20220321001441230](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001441230.png)

在浏览器中输入http://www.szu.edu.cn/board/，得到如下页面

![image-20220321001457895](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001457895.png)

可以看到图中8号数据包的Info中有Standard query 0xa9c7 A www.szu.edu.cn的信息

点击该数据包可以看到源IP地址为192.168.0.102，目的地址为103.27.24.2  
传输层使用了UDP对报文进行封装，源端口号为61028，目的端口号为53，  
[查询的域名为www.szu.edu.cn](http://xn--www-c88d89xw6fnu6atpytg4b.szu.edu.cn)，Type 为 A，class in  
响应本数据包对应的数据包序号为18

![image-20220321001527713](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001527713.png)

点击18号数据包

![image-20220321001601892](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001601892.png)

可以看到，18号数据包的Info为Standard query response 0xa9c7 A [www.szu.edu.cn](http://www.szu.edu.cn) A 210.39.4.1  
源IP地址为102.27.24.2，目的IP地址为192.168.0.102  
传输层使用了UDP协议对报文进行封装，源端口号为53，目的端口号为61028  
Queries为8号数据包发出的查询，Answer部分为对应的回答，  
[域名解析www.szu.edu.cn](http://xn--www-q33er8oxq2an38c.szu.edu.cn): type A, class IN, addr 210.39.4.1  
其中Type为A，class IN，对应的IP地址为210.39.4.1  
使用ping命令在命令行窗口查询www.szu.edu.cn的ip地址，其中查到的ip地址为210.39.4.1

![image-20220321001621763](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001621763.png)

### 2.HTTP

打开 <http://www.szu.edu.cn/tv/> 分析HTTP数据包

可以看到数据包中有许多TCP，SSL数据包，这是由于客户端和服务器都是在HTTP协议的基础上通过SSL加密隧道变成https进行通信的，Wireshark 没有再次设置的情况下是没有办法抓到包的 https 的数据包。所以没有抓取到http数据包

![image-20220321001654734](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001654734.png)

![image-20220321002529149](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321002529149.png)

解决方法：  
在终端中执行：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/chrome --ssl-key-log-file=/tmp/.ssl-key.log
```

![image-20220321001748498](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001748498.png)

打开 Wireshark ，Wireshark - Perferences - Protocols - TLS ，在 (Pre)-Master-Secret log filename 输入 /tmp/.ssl-key.log

![image-20220321001758121](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001758121.png)

重新开始抓包  
在过滤器中输入ip.addr == 192.168.0.102 && http && ip.addr == 210.39.4.1

![image-20220321001808570](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001808570.png)

可以看到已经可以抓取到数据包了

接下来对数据包进行分析

![image-20220321001827882](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001827882.png)

可以从Info中看出浏览器和服务器运行的都是1.1版本的HTTP协议  
Request 方法为 GET 方法  
浏览器从服务器接受的语言是zh-CN  
请求的URI 为http://www.szu.edu.cn/tv/  
响应报文为第56号报文

![image-20220321001853007](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001853007.png)

服务器响应报文为56号报文  
响应状态码：HTTP/1.1 302 Moved Temporarily\r\n  
响应文件内容：Line-based text data: text/html (7 lines)  
Content-Length: 137  
该资源原本确实存在，但已经被临时改变了位置

![image-20220321001932223](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321001932223.png)

继续请求，77号数据包，响应为82号数据包，82号响应状态码为HTTP/1.1 302 Found\r\n下

一个请求为84号数据包，响应帧为88号，88号帧的响应状态码为404 Not Found

### 3.TCP

3.打开http://www.youku.com 分析 TCP 数据包

在终端中执行：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/chrome --ssl-key-log-file=/tmp/.ssl-key.log
```

在Wireshark过滤器输入 http

在浏览器输入优酷网址，可以看到Wireshark中http数据包的Info有 youku的字样

![image-20220321124359784](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124359784.png)

右键，Follow -> TCP Stream,追踪TCP数据流

![image-20220321124415973](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124415973.png)

可以得到如下页面：

![image-20220321124445015](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124445015.png)

点击Statistics -> Flow

![image-20220321124505023](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124505023.png)

可以得到如下页面：

![image-20220321124517125](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124517125.png)

在其中的Flow Type中选择TCP Flows，并选择时间戳和我们要分析的TCP数据流一致的数据，点击Limit to display filiter，可以得到如下窗口：

![image-20220321124537941](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124537941.png)

可以看出我的IP地址为192.168.0.102

优酷的IP地址为59.82.31.118

在客户端和youku.com之间启动 TCP 连接的 TCP SYN 区段的相对 $Sequence number$ 是0，绝对 $Sequence number$ 是 $2758883771$，这是一个随机值

![image-20220321124607668](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124607668.png)

根据三次握手，客户端应该发送 SYN 请求请求建立连接，我找到发送的第一个请求并且发现客户端（我的电脑）将 SYN 标志标 0 用来请求建立连接。这一步也是三次握手的第一步

![image-20220321124631311](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124631311.png)

Youku.com发送给客户的

- 相对$Acknowledgement\ number$ 是 $1$
- 绝对 $Acknowledgement\ number$是 $2758883772$
- 相对 $Sequence\ number$为$0$
- 绝对 $Sequence\ number$为 $1687385211$，这也是一个随机值

![image-20220321124649825](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124649825.png)

可以发现，服务器端的 $Acknowledgement\ number$ = 客户端的$Sequence\ number + 1$  
意思是服务器接收到我的连接请求并且发 SYN-ACK 确认，这是三次握手的第二步。

![image-20220321124727498](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124727498.png)

客户端再次发送TCP报文段给服务器端的

- 相对$Sequence\ number$为 $1$
- 绝对$Sequence\ number$为 $2758883772$
- 相对$Acknowledgement\ number$的值为 $1$
- 绝对$Acknowledgement\ number$的值为 $1687385212$

![image-20220321124755435](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124755435.png)

![image-20220321124830514](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124830514.png)

TCP服务器进程收到该确认报文段后也进入连接已建立状态

现在，TCP双方都进入了连接已建立状态，它们可以基于已建立好的TCP连接，进行可靠的数据传输

![image-20220321124901298](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124901298.png)

点击Statistics-> TCP Stream Graph-> Time Sequence (tcptrace）,可得下图

可以发现，跟踪文件中没有重新传输的段。我们可以通过检查跟踪文件中TCP数据段的序列号来验证这一点。在该轨迹的时间序列图(Stevens)中，从源(192.168.0.102)到目的地(59.82.31.118)的所有序列号都随着时间单调递增。如果存在重传数据段，则该重传数据段的序列号应小于其相邻数据段的序列号。

![image-20220321124915728](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321124915728.png)

### 4.UDP

打开http://www.sina.com.cn 分析 UDP 数据包

在过滤器中输入`ip.addr == 192.168.0.102 && udp && ip.addr == 103.27.24.2`

![image-20220321010635804](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321010635804.png)

UDP标头有4个字段，分别为：

- Source Port
- Destination Port
- Length
- Checksum

UDP的源端口号为49947，目的端口号为53，长度为41，校验和为0x41b2

每个标头字段各自占两个bytes，总共为 $4 \times 2 = 8$ 个bytes

由于占两个bytes，所以UDP 的有效载荷最大值为$ 2 ^{16} - 1 - 8 = 65527$

最大的端口号可能为$ 2 ^ {16} - 1 = 65535$

UDP payload 为 33 bytes

$Length = UDP payload + 4 \* 2 = 33 + 8 = 41$

![image-20220321010654080](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321010654080.png)

IP数据包中的UDP协议号为17，十六进制为0x11

响应该报文的数据包序号为 10

10号报文段：

![image-20220321010706389](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321010706389.png)

请求报文和响应报文之间的关系：

- 请求和响应的 Source Port 和 Destination Port 相互对应
- 请求和响应的 Source IP 和 Destination IP 相互对应
- 请求：

![image-20220321010842922](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321010842922.png)

- 响应：

![image-20220321010900963](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220321010900963.png)
