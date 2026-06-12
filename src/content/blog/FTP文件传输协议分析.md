---
title: FTP文件传输协议分析
date: '2022-03-26T09:21:08.000Z'
updated: '2022-03-26T16:45:58.000Z'
tags:
  - Network
  - Wireshark
categories: []
slug: 2022/03/26/FTP文件传输协议分析
oldUrl: /2022/03/26/FTP文件传输协议分析/
excerpt: >-
  1. 在服务器上安装 vsftpd 这个 ftp 客户端 2. 修改登录和对匿名用户的设置 /etc/vsftpd.conf文件如下：
  我们只需要修改其中这一项： 将 号去掉即可添加使 FTP 用户对目录进行写操作的权限 3. 可以事分别先在客户端和服务器端准备两个文件进行传输使用
  接下来打开 wireshark 按照如下操作进行文件的上传和下载： 1. 在...
---
## 安装 FTP

1. 在服务器上安装 `vsftpd` 这个 `ftp` 客户端



```
 sudo apt-get install vsftpd
```
```

2. 修改登录和对匿名用户的设置

   `/etc/vsftpd.conf`文件如下：



```
```
 write_enable=YES             	//是否对登录用户开启写权限。属全局性设置。默认NO local_enable=YES             	//是否允许本地用户登录FTP服务器。默认为NO anonymous_enable=YES       		//设置是否允许匿名用户登录FTP服务器。默认为YES ftp_username=ftp                //定义匿名用户的账户名称，默认值为ftp。 no_anon_password=YES        	//匿名用户登录时是否询问口令。设置为YES，则不询问。默 认NO anon_world_readable_only=YES    //匿名用户是否允许下载可阅读的文档，默认为YES。 anon_upload_enable=YES      	//是否允许匿名用户上传文件。只有在write_enable设置 local_root=/var/ftp         	// 设置本地用户登录后所在的目录。默认配置文件中没有设置该项，此时用户登录FTP服务器后，所在的目录为该用户的主目录，对于root用户，则为/root目录。 anon_root=/var/ftp      		//设置匿名用户登录后所在的目录。若未指定，则默认为/var/ftp目录。 chroot_list_enable=YES          // 设置是否启用chroot_list_file配置项指定的用户列表文件。设置为YES则除了列在j/etc/vsftpd/chroot_list文件中的的帐号外，所有登录的用户都可以进入ftp根目录之外的目录。默认NO
```
```


   我们只需要修改其中这一项：



```
```
 #write_enable=YES
```
```


   将 `#` 号去掉即可添加使 FTP 用户对目录进行写操作的权限
3. 可以事分别先在客户端和服务器端准备两个文件进行传输使用



```
```
 wget http://gaia.cs.umass.edu/wireshark-labs/alice.txt wget https://web.stanford.edu/class/cs144/vm_howto/setup_dev_env.sh
```
```


## 使用 FTP

- 接下来打开 `wireshark` 按照如下操作进行文件的上传和下载：

  1. 在客户端中输入 `ftp ipadderss`,连接客户端
  2. 输入`FTP`用户名
  3. 输入 FTP 用户密码
  4. 使用 `ls` 指令，查看当前目录文件
  5. 在服务器端 查看当前目录文件
  6. 将客户端的文件 `alice.txt` 上传到服务器端，对应命令为 `put alice.txt`
  7. 等待上传结束后，在服务器端输入 `ls` 指令，可以看到比传输开始之前多了一个 `alice.txt` 的文件
  8. 将服务器端的 `setup_dev_env.sh` 下载下来，对应的命令为 `get setup_dev_env.sh`
  9. 关闭客户端与服务器的连接，对应命令为 `close`
  10. 退出 `FTP` 程序， 命令为 `quit`

  ![image-20220326182400695](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326182400695.png)

  11. 可以看到客户端多了个 `setup_dev_env.sh` 文件

  ![image-20220326182521239](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326182521239.png)

## 数据包分析

在`wireshark` 的过滤规则中输入 `ip.addr == 192.168.0.101 && ip.addr == 192.168.0.112 && tcp`

可以看到，在FTP的文件传输协议开始使用之前，客户端和服务器会先进行三次握手以建立TCP连接，在服务器端发送给客户端的第一个FTP协议报文的TCP状态标识为`PSH`,表示有数据传输。

![image-20220326192425864](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326192425864.png)

其中，41号报文，43号报文，44号报文分别如下图所示，可以看出，服务器端与客户端进行通信的端口号分别为 `21` 和 `59353`

端口 `21`用于传输控制流，并且是命令通向 `ftp` 服务器的进口，这里是用来打开服务器端口与客户端进行通信

![image-20220326190457520](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326190457520.png)

![image-20220326190511474](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326190511474.png)

![image-20220326190524785](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326190524785.png)

在 `wireshark`的过滤规则中输入 `ip.addr == 192.168.0.101 && ip.addr == 192.168.0.112 && ftp`,可以得到如下图所示的数据流图

![image-20220326192940293](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326192940293.png)

### 登陆用户

![image-20220326225834696](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326225834696.png)

1. 45号报文中的 FTP如下所示，其中状态码 220 表示服务器准备就绪



```
```
 File Transfer Protocol (FTP)    220 (vsFTPd 3.0.3)
       Response code: Service ready for new user (220)       Response arg: (vsFTPd 3.0.3) [Current working directory: ]
```
```


   客户端则显示：`220 (vsFTPd 3.0.3)`
2. 47号报文的 FTP 记录了客户端输入用户名发送到服务器端，并且明文显示系统需要登陆的用户名



```
```
 File Transfer Protocol (FTP)    USER misaka
       Request command: USER       Request arg: misaka
```
```

3. 49号报文：输入用户名后，服务器响应状态码 331， 表示要求密码



```
```
 File Transfer Protocol (FTP)    331 Please specify the password.
       Response code: User name okay, need password (331)       Response arg: Please specify the password.
```
```

4. 52号报文：客户端输入密码发送给服务器端，明文传输



```
```
 File Transfer Protocol (FTP)    PASS ********
       Request command: PASS       Request arg: ********
```
```

5. 54号报文：服务器端收到密码后，返回给客户端 230 号状态码，表示用户登录，请继续。



```
```
 File Transfer Protocol (FTP)    230 Login successful.
       Response code: User logged in, proceed (230)       Response arg: Login successful.
```
```


### LIST 命令

![image-20220326225953691](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326225953691.png)

1. 56号报文：是客户端中输入 `ls` 命令时的发送给服务器端的接受数据的激活端口号为 `59354`

   此时，服务器与客户端通信的TCP为：`Transmission Control Protocol, Src Port: 59353, Dst Port: 21, Seq: 29, Ack: 78, Len: 28`， 仍然是 `59353` 和 `21` 号端口

   `Command frame: 60` : 表示对应的命令在 60 号数据报正式发出



```
```
 File Transfer Protocol (FTP)    PORT 192,168,0,101,231,218
       Request command: PORT       Request arg: 192,168,0,101,231,218       Active IP address: 192.168.0.101       Active port: 59354 [Current working directory: ] [Command: LIST] [Command frame: 60]
```
```

2. 58号报文：服务器端响应状态码200，表示命令没问题，在客户端显示为`200 PORT command successful. Consider using PASV.`



```
```
 File Transfer Protocol (FTP)    200 PORT command successful. Consider using PASV.
       Response code: Command okay (200)       Response arg: PORT command successful. Consider using PASV.
```
```

3. 60号报文：客户端对服务器发起的命令为 `LIST`

   `Command response first frame`表示响应该命令的第一个数据帧为 66号

   `Command response last frame`表示响应该命令的最后一个数据帧为 66号



```
```
 File Transfer Protocol (FTP)    LIST
       Request command: LIST [Current working directory: ] [Command response frames: 1] [Command response bytes: 659] [Command response first frame: 66] [Command response last frame: 66] [Setup frame: 56]
```
```

4. 72号数据报：服务器发送给客户端的状态码为226，表示请求的文件操作成功，并正在关闭数据连接



```
```
 File Transfer Protocol (FTP)     226 Directory send OK.
         Response code: Closing data connection (226)         Response arg: Directory send OK.
```
```

5. 66 号 数据帧如下所示，其中，红色方框内的内容与客户端显示的东西刚好对应，是明文传输  
   数据报：

   ![image-20220326205935736](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326205935736.png)

   客户端：

   ![image-20220326210407981](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326210407981.png)

### PUT操作

![image-20220326230105407](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326230105407.png)

1. 85号数据报：是客户端中输入 `put alice.txt` 命令时的发送给服务器端的接受数据的激活端口号为 `59355`

   `Command response first frame`表示响应该命令的第一个数据帧为 95 号

   `Command response last frame`表示响应该命令的最后一个数据帧为 217 号

   `Command frame: 85` 表示对应的命令在 85 号数据报正式发出



```
```
 Transmission Control Protocol, Src Port: 59353, Dst Port: 21, Seq: 63, Ack: 192, Len: 28 File Transfer Protocol (FTP)     PORT 192,168,0,101,231,219
         Request command: PORT         Request arg: 192,168,0,101,231,219         Active IP address: 192.168.0.101         Active port: 59355 [Current working directory: ] [Command response frames: 108] [Command response bytes: 155736] [Command response first frame: 95] [Command response last frame: 217] [Response duration: 303ms] [Response bitrate: 4111Kbps] [Setup frame: 85] [Command: PORT 192,168,0,101,231,219] [Command frame: 85]
```
```

2. 86号数据报：服务器端响应状态码200，表示命令没问题，在客户端显示为`200 PORT command successful. Consider using PASV.`



```
```
 File Transfer Protocol (FTP)     200 PORT command successful. Consider using PASV.
         Response code: Command okay (200)         Response arg: PORT command successful. Consider using PASV.
```
```

3. 88号数据报：客户端发送给服务器端的FTP 命令为 STOR 表示接收数据并且在服务器站点保存为文件，`arg`为参数 ：`alice.txt`



```
```
 File Transfer Protocol (FTP)     STOR alice.txt
         Request command: STOR         Request arg: alice.txt
```
```

4. 92号数据报：服务器端发送给客户端的状态码为 150，表示文件状态正常并即将打开数据连接。



```
```
 File Transfer Protocol (FTP)     150 Ok to send data.
         Response code: File status okay; about to open data connection (150)         Response arg: Ok to send data.
```
```

5. 231号数据报：服务器发送给客户端的状态码为226，表示请求的文件操作成功，并正在关闭数据连接



```
```
 File Transfer Protocol (FTP)     226 Transfer complete.
         Response code: Closing data connection (226)         Response arg: Transfer complete.
```
```

6. 数据流的报文简略如下：



```
```
29.695807
192.168.0.101
192.168.0.112
FTP-DATA
1514
FTP Data: 1448 bytes (PORT) (PORT 192,168,0,101,231,219) 96
29.695812
192.168.0.101
192.168.0.112
FTP-DATA
1514
FTP Data: 1448 bytes (PORT) (PORT 192,168,0,101,231,219) 97
29.695814
192.168.0.101
192.168.0.112
FTP-DATA
1514
FTP Data: 1448 bytes (PORT) (PORT 192,168,0,101,231,219) ... 217
29.997952
192.168.0.101
192.168.0.112
FTP-DATA
866
FTP Data: 800 bytes (PORT) (PORT 192,168,0,101,231,219)
```
```


   可以发现，数据最长为 `1514` 字节，其中有效数据为 `1448` 字节，其其余 `66` 个字节为首部信息总的长度

   ![image-20220326214350928](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326214350928.png)

### GET 操作

![image-20220326230223508](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326230223508.png)

1. 239号报文：是客户端中输入 `get setup_dev_env.sh` 命令时的发送给服务器端的接受数据的激活端口号为 `59356`



```
```
 File Transfer Protocol (FTP)     PORT 192,168,0,101,231,220
         Request command: PORT         Request arg: 192,168,0,101,231,220         Active IP address: 192.168.0.101         Active port: 59356
```
```

2. 240号报文：服务器端响应状态码200，表示命令没问题，在客户端显示为`200 PORT command successful. Consider using PASV.`



```
```
 File Transfer Protocol (FTP)     200 PORT command successful. Consider using PASV.
         Response code: Command okay (200)         Response arg: PORT command successful. Consider using PASV.
```
```

3. 242号报文: 客户端发送给服务器端的 `Request command` 为 `RETR`，`Request arg` 为 `setup_dev_env.sh`, 表示传输 `setup_dev_env.sh`文件副本

   `Command response first frame`表示响应该命令的第一个数据帧为 248 号

   `Command response last frame`表示响应该命令的最后一个数据帧为 249 号

   `Setup frame: 85` 表示是 239 号数据帧设置的命令



```
```
 Transmission Control Protocol, Src Port: 59353, Dst Port: 21, Seq: 135, Ack: 340, Len: 23 File Transfer Protocol (FTP)     RETR setup_dev_env.sh
         Request command: RETR         Request arg: setup_dev_env.sh [Current working directory: ] [Command response frames: 2] [Command response bytes: 1515] [Command response first frame: 248] [Command response last frame: 249] [Response duration: 0ms] [Response bitrate: 4294967295Kbps] [Setup frame: 239]
```
```

4. 247号报文：服务器的 `Response code` 表示文件状态正常，即将打开数据连接

   在客户端会显示出`150 Opening BINARY mode data connection for setup_dev_env.sh (1515 bytes).`



```
```
 File Transfer Protocol (FTP)     150 Opening BINARY mode data connection for setup_dev_env.sh (1515 bytes).
         Response code: File status okay; about to open data connection (150)         Response arg: Opening BINARY mode data connection for setup_dev_env.sh (1515 bytes).
```
```

5. 255号报文:服务器发送给客户端的状态码为226，表示请求的文件操作成功，并正在关闭数据连接



```
```
 File Transfer Protocol (FTP)     226 Transfer complete.
         Response code: Closing data connection (226)         Response arg: Transfer complete.
```
```

6. 在过滤规则中输入`ip.addr == 192.168.0.101 && ip.addr == 192.168.0.112 && ftp-data`，数据连接发送的报文如下：



```
```
50.915641
192.168.0.112
192.168.0.101
FTP-DATA
1514
FTP Data: 1448 bytes (PORT) (RETR setup_dev_env.sh) 249
50.915641
192.168.0.112
192.168.0.101
FTP-DATA
133
FTP Data: 67 bytes (PORT) (RETR setup_dev_env.sh)
```
```


   ![image-20220326224632006](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326224632006.png)

### 关闭FTP

![image-20220326230319584](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20220326230319584.png)

1. 269号报文:客户端发送给服务器的 FTP 命令 为 `QUIT`, 表示请求断开连接



```
```
 File Transfer Protocol (FTP)     QUIT\r\n         Request command: QUIT
```
```

2. 270号报文:服务器响应的`Response code` 为 221，表示服务器正在关闭连接，客户端显示 `221 Goodbye.`



```
```
 File Transfer Protocol (FTP)     221 Goodbye.
         Response code: Service closing control connection (221)         Response arg: Goodbye.
```