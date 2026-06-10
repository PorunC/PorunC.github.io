---
title: CS144-Lab7
date: '2023-02-25T08:26:59.000Z'
updated: '2023-02-25T08:33:44.000Z'
tags:
  - CS144
  - Network
categories: []
slug: 2023/02/25/CS144-Lab7
oldUrl: /2023/02/25/CS144-Lab7/
excerpt: >-
  到此为止，您已经实现了Internet基础设施的很大一部分。从Lab0(一个可靠的字节流)，到Labs 1 4(传输控制协议)，Lab 5(一个IP
  /以太网网络接口)和 Lab 6(一个IP路由器)，你已经做了大量的编码工作!
  在这个实验室中，您不需要做任何编码(假设您之前的实验室处于合理的工作状态)。相反，为了结束你的成就，你将使用你之前的所有实验来创建...
---
## 概述

到此为止，您已经实现了Internet基础设施的很大一部分。从Lab0(一个可靠的字节流)，到Labs 1-4(传输控制协议)，Lab 5(一个IP /以太网网络接口)和 Lab 6(一个IP路由器)，你已经做了大量的编码工作!

在这个实验室中，您不需要做任何编码(假设您之前的实验室处于合理的工作状态)。相反，为了结束你的成就，你将使用你之前的所有实验来创建一个真实的网络，其中包括你的网络堆栈(主机和路由器)与课堂上另一个学生实现的网络堆栈通信。

这个实验是两人一组做的。你需要和一个实验伙伴(班上的另一个学生)一起工作。请使用实验环节寻找实验伙伴，如果你不能参加实验环节，请使用广场。如果有必要，同一个学生可以多次担任“实验搭档”。

## 网络

在本实验中，您将创建一个真实的网络，将您的网络堆栈与课堂上另一个学生实现的网络堆栈结合起来。每个人贡献一台主机(包括可靠的字节流、TCP实现和networkinterface)和一台路由器:

![image-20230225160938571](https://cdn.jsdelivr.net/gh/Misaka-9982-coder/img_hosting/img/image-20230225160938571.png)

第一个窗口：

```bash
./apps/lab7 server cs144.keithw.org 3000
```

第二个窗口：

```bash
./apps/lab7 server cs144.keithw.org 3000
```

`make check`

```bash
[100%] Testing libsponge...
Test project /home/misaka/sponge/build
        Start   1: t_wrapping_ints_cmp
  1/164 Test   #1: t_wrapping_ints_cmp ..............   Passed    0.00 sec
        Start   2: t_wrapping_ints_unwrap
  2/164 Test   #2: t_wrapping_ints_unwrap ...........   Passed    0.00 sec
        Start   3: t_wrapping_ints_wrap
  3/164 Test   #3: t_wrapping_ints_wrap .............   Passed    0.00 sec
        Start   4: t_wrapping_ints_roundtrip
  4/164 Test   #4: t_wrapping_ints_roundtrip ........   Passed    0.08 sec
        Start   5: t_recv_connect
  5/164 Test   #5: t_recv_connect ...................   Passed    0.00 sec
        Start   6: t_recv_transmit
  6/164 Test   #6: t_recv_transmit ..................   Passed    0.03 sec
        Start   7: t_recv_window
  7/164 Test   #7: t_recv_window ....................   Passed    0.00 sec
        Start   8: t_recv_reorder
  8/164 Test   #8: t_recv_reorder ...................   Passed    0.00 sec
        Start   9: t_recv_close
  9/164 Test   #9: t_recv_close .....................   Passed    0.00 sec
        Start  10: t_recv_special
 10/164 Test  #10: t_recv_special ...................   Passed    0.00 sec
        Start  11: t_send_connect
 11/164 Test  #11: t_send_connect ...................   Passed    0.00 sec
        Start  12: t_send_transmit
 12/164 Test  #12: t_send_transmit ..................   Passed    0.02 sec
        Start  13: t_send_retx
 13/164 Test  #13: t_send_retx ......................   Passed    0.00 sec
        Start  14: t_send_window
 14/164 Test  #14: t_send_window ....................   Passed    0.01 sec
        Start  15: t_send_ack
 15/164 Test  #15: t_send_ack .......................   Passed    0.00 sec
        Start  16: t_send_close
 16/164 Test  #16: t_send_close .....................   Passed    0.00 sec
        Start  17: t_send_extra
 17/164 Test  #17: t_send_extra .....................   Passed    0.00 sec
        Start  18: t_strm_reassem_single
 18/164 Test  #18: t_strm_reassem_single ............   Passed    0.00 sec
        Start  19: t_strm_reassem_seq
 19/164 Test  #19: t_strm_reassem_seq ...............   Passed    0.00 sec
        Start  20: t_strm_reassem_dup
 20/164 Test  #20: t_strm_reassem_dup ...............   Passed    0.00 sec
        Start  21: t_strm_reassem_holes
 21/164 Test  #21: t_strm_reassem_holes .............   Passed    0.00 sec
        Start  22: t_strm_reassem_many
 22/164 Test  #22: t_strm_reassem_many ..............   Passed    0.03 sec
        Start  23: t_strm_reassem_overlapping
 23/164 Test  #23: t_strm_reassem_overlapping .......   Passed    0.00 sec
        Start  24: t_strm_reassem_win
 24/164 Test  #24: t_strm_reassem_win ...............   Passed    0.03 sec
        Start  25: t_strm_reassem_cap
 25/164 Test  #25: t_strm_reassem_cap ...............   Passed    0.05 sec
        Start  26: t_byte_stream_construction
 26/164 Test  #26: t_byte_stream_construction .......   Passed    0.00 sec
        Start  27: t_byte_stream_one_write
 27/164 Test  #27: t_byte_stream_one_write ..........   Passed    0.00 sec
        Start  28: t_byte_stream_two_writes
 28/164 Test  #28: t_byte_stream_two_writes .........   Passed    0.00 sec
        Start  29: t_byte_stream_capacity
 29/164 Test  #29: t_byte_stream_capacity ...........   Passed    0.23 sec
        Start  30: t_byte_stream_many_writes
 30/164 Test  #30: t_byte_stream_many_writes ........   Passed    0.00 sec
        Start  31: t_webget
 31/164 Test  #31: t_webget .........................   Passed    1.24 sec
        Start  32: arp_network_interface
 32/164 Test  #32: arp_network_interface ............   Passed    0.00 sec
        Start  33: router_test
 33/164 Test  #33: router_test ......................   Passed    0.01 sec
        Start  34: t_tcp_parser
 34/164 Test  #34: t_tcp_parser .....................   Passed    0.00 sec
        Start  35: t_ipv4_parser
 35/164 Test  #35: t_ipv4_parser ....................   Passed    0.00 sec
        Start  36: t_active_close
 36/164 Test  #36: t_active_close ...................   Passed    0.00 sec
        Start  37: t_passive_close
 37/164 Test  #37: t_passive_close ..................   Passed    0.00 sec
        Start  39: t_ack_rst
 38/164 Test  #39: t_ack_rst ........................   Passed    0.00 sec
        Start  41: t_ack_rst_win
 39/164 Test  #41: t_ack_rst_win ....................   Passed    0.00 sec
        Start  43: t_connect
 40/164 Test  #43: t_connect ........................   Passed    0.00 sec
        Start  45: t_listen
 41/164 Test  #45: t_listen .........................   Passed    0.00 sec
        Start  46: t_winsize
 42/164 Test  #46: t_winsize ........................   Passed    0.03 sec
        Start  48: t_retx
 43/164 Test  #48: t_retx ...........................   Passed    0.00 sec
        Start  49: t_retx_win
 44/164 Test  #49: t_retx_win .......................   Passed    0.00 sec
        Start  50: t_loopback
 45/164 Test  #50: t_loopback .......................   Passed    0.10 sec
        Start  51: t_loopback_win
 46/164 Test  #51: t_loopback_win ...................   Passed    0.05 sec
        Start  52: t_reorder
 47/164 Test  #52: t_reorder ........................   Passed    0.07 sec
        Start  53: t_address_dt
 48/164 Test  #53: t_address_dt .....................   Passed    0.00 sec
        Start  54: t_parser_dt
 49/164 Test  #54: t_parser_dt ......................   Passed    0.00 sec
        Start  55: t_socket_dt
 50/164 Test  #55: t_socket_dt ......................   Passed    0.00 sec
        Start  56: t_udp_client_send
 51/164 Test  #56: t_udp_client_send ................   Passed    0.24 sec
        Start  57: t_udp_server_send
 52/164 Test  #57: t_udp_server_send ................   Passed    0.24 sec
        Start  58: t_udp_client_recv
 53/164 Test  #58: t_udp_client_recv ................   Passed    0.24 sec
        Start  59: t_udp_server_recv
 54/164 Test  #59: t_udp_server_recv ................   Passed    0.24 sec
        Start  60: t_udp_client_dupl
 55/164 Test  #60: t_udp_client_dupl ................   Passed    0.24 sec
        Start  61: t_udp_server_dupl
 56/164 Test  #61: t_udp_server_dupl ................   Passed    0.24 sec
        Start  62: t_ucS_1M_32k
 57/164 Test  #62: t_ucS_1M_32k .....................   Passed    0.27 sec
        Start  63: t_ucS_128K_8K
 58/164 Test  #63: t_ucS_128K_8K ....................   Passed    0.25 sec
        Start  64: t_ucS_16_1
 59/164 Test  #64: t_ucS_16_1 .......................   Passed    0.24 sec
        Start  65: t_ucS_32K_d
 60/164 Test  #65: t_ucS_32K_d ......................   Passed    0.24 sec
        Start  66: t_ucR_1M_32k
 61/164 Test  #66: t_ucR_1M_32k .....................   Passed    0.27 sec
        Start  67: t_ucR_128K_8K
 62/164 Test  #67: t_ucR_128K_8K ....................   Passed    0.24 sec
        Start  68: t_ucR_16_1
 63/164 Test  #68: t_ucR_16_1 .......................   Passed    0.24 sec
        Start  69: t_ucR_32K_d
 64/164 Test  #69: t_ucR_32K_d ......................   Passed    0.24 sec
        Start  70: t_ucD_1M_32k
 65/164 Test  #70: t_ucD_1M_32k .....................   Passed    0.28 sec
        Start  71: t_ucD_128K_8K
 66/164 Test  #71: t_ucD_128K_8K ....................   Passed    0.26 sec
        Start  72: t_ucD_16_1
 67/164 Test  #72: t_ucD_16_1 .......................   Passed    0.25 sec
        Start  73: t_ucD_32K_d
 68/164 Test  #73: t_ucD_32K_d ......................   Passed    0.24 sec
        Start  74: t_usS_1M_32k
 69/164 Test  #74: t_usS_1M_32k .....................   Passed    0.27 sec
        Start  75: t_usS_128K_8K
 70/164 Test  #75: t_usS_128K_8K ....................   Passed    0.24 sec
        Start  76: t_usS_16_1
 71/164 Test  #76: t_usS_16_1 .......................   Passed    0.24 sec
        Start  77: t_usS_32K_d
 72/164 Test  #77: t_usS_32K_d ......................   Passed    0.24 sec
        Start  78: t_usR_1M_32k
 73/164 Test  #78: t_usR_1M_32k .....................   Passed    0.26 sec
        Start  79: t_usR_128K_8K
 74/164 Test  #79: t_usR_128K_8K ....................   Passed    0.25 sec
        Start  80: t_usR_16_1
 75/164 Test  #80: t_usR_16_1 .......................   Passed    0.24 sec
        Start  81: t_usR_32K_d
 76/164 Test  #81: t_usR_32K_d ......................   Passed    0.24 sec
        Start  82: t_usD_1M_32k
 77/164 Test  #82: t_usD_1M_32k .....................   Passed    0.27 sec
        Start  83: t_usD_128K_8K
 78/164 Test  #83: t_usD_128K_8K ....................   Passed    0.25 sec
        Start  84: t_usD_16_1
 79/164 Test  #84: t_usD_16_1 .......................   Passed    0.25 sec
        Start  85: t_usD_32K_d
 80/164 Test  #85: t_usD_32K_d ......................   Passed    0.24 sec
        Start  86: t_ucS_128K_8K_l
 81/164 Test  #86: t_ucS_128K_8K_l ..................   Passed    0.24 sec
        Start  87: t_ucS_128K_8K_L
 82/164 Test  #87: t_ucS_128K_8K_L ..................   Passed    0.43 sec
        Start  88: t_ucS_128K_8K_lL
 83/164 Test  #88: t_ucS_128K_8K_lL .................   Passed    0.42 sec
        Start  89: t_ucR_128K_8K_l
 84/164 Test  #89: t_ucR_128K_8K_l ..................   Passed    0.50 sec
        Start  90: t_ucR_128K_8K_L
 85/164 Test  #90: t_ucR_128K_8K_L ..................   Passed    0.24 sec
        Start  91: t_ucR_128K_8K_lL
 86/164 Test  #91: t_ucR_128K_8K_lL .................   Passed    0.39 sec
        Start  92: t_ucD_128K_8K_l
 87/164 Test  #92: t_ucD_128K_8K_l ..................   Passed    0.35 sec
        Start  93: t_ucD_128K_8K_L
 88/164 Test  #93: t_ucD_128K_8K_L ..................   Passed    0.38 sec
        Start  94: t_ucD_128K_8K_lL
 89/164 Test  #94: t_ucD_128K_8K_lL .................   Passed    0.48 sec
        Start  95: t_usS_128K_8K_l
 90/164 Test  #95: t_usS_128K_8K_l ..................   Passed    0.26 sec
        Start  96: t_usS_128K_8K_L
 91/164 Test  #96: t_usS_128K_8K_L ..................   Passed    0.35 sec
        Start  97: t_usS_128K_8K_lL
 92/164 Test  #97: t_usS_128K_8K_lL .................   Passed    0.37 sec
        Start  98: t_usR_128K_8K_l
 93/164 Test  #98: t_usR_128K_8K_l ..................   Passed    0.39 sec
        Start  99: t_usR_128K_8K_L
 94/164 Test  #99: t_usR_128K_8K_L ..................   Passed    0.25 sec
        Start 100: t_usR_128K_8K_lL
 95/164 Test #100: t_usR_128K_8K_lL .................   Passed    0.56 sec
        Start 101: t_usD_128K_8K_l
 96/164 Test #101: t_usD_128K_8K_l ..................   Passed    0.40 sec
        Start 102: t_usD_128K_8K_L
 97/164 Test #102: t_usD_128K_8K_L ..................   Passed    0.32 sec
        Start 103: t_usD_128K_8K_lL
 98/164 Test #103: t_usD_128K_8K_lL .................   Passed    0.51 sec
        Start 104: t_ipv4_client_send
 99/164 Test #104: t_ipv4_client_send ...............   Passed    0.25 sec
        Start 105: t_ipv4_server_send
100/164 Test #105: t_ipv4_server_send ...............   Passed    0.24 sec
        Start 106: t_ipv4_client_recv
101/164 Test #106: t_ipv4_client_recv ...............   Passed    0.24 sec
        Start 107: t_ipv4_server_recv
102/164 Test #107: t_ipv4_server_recv ...............   Passed    0.25 sec
        Start 108: t_ipv4_client_dupl
103/164 Test #108: t_ipv4_client_dupl ...............   Passed    0.25 sec
        Start 109: t_ipv4_server_dupl
104/164 Test #109: t_ipv4_server_dupl ...............   Passed    0.24 sec
        Start 110: t_icS_1M_32k
105/164 Test #110: t_icS_1M_32k .....................   Passed    0.28 sec
        Start 111: t_icS_128K_8K
106/164 Test #111: t_icS_128K_8K ....................   Passed    0.25 sec
        Start 112: t_icS_16_1
107/164 Test #112: t_icS_16_1 .......................   Passed    0.24 sec
        Start 113: t_icS_32K_d
108/164 Test #113: t_icS_32K_d ......................   Passed    0.25 sec
        Start 114: t_icR_1M_32k
109/164 Test #114: t_icR_1M_32k .....................   Passed    0.29 sec
        Start 115: t_icR_128K_8K
110/164 Test #115: t_icR_128K_8K ....................   Passed    0.25 sec
        Start 116: t_icR_16_1
111/164 Test #116: t_icR_16_1 .......................   Passed    0.24 sec
        Start 117: t_icR_32K_d
112/164 Test #117: t_icR_32K_d ......................   Passed    0.24 sec
        Start 118: t_icD_1M_32k
113/164 Test #118: t_icD_1M_32k .....................   Passed    0.30 sec
        Start 119: t_icD_128K_8K
114/164 Test #119: t_icD_128K_8K ....................   Passed    0.25 sec
        Start 120: t_icD_16_1
115/164 Test #120: t_icD_16_1 .......................   Passed    0.26 sec
        Start 121: t_icD_32K_d
116/164 Test #121: t_icD_32K_d ......................   Passed    0.24 sec
        Start 122: t_isS_1M_32k
117/164 Test #122: t_isS_1M_32k .....................   Passed    0.28 sec
        Start 123: t_isS_128K_8K
118/164 Test #123: t_isS_128K_8K ....................   Passed    0.26 sec
        Start 124: t_isS_16_1
119/164 Test #124: t_isS_16_1 .......................   Passed    0.24 sec
        Start 125: t_isS_32K_d
120/164 Test #125: t_isS_32K_d ......................   Passed    0.24 sec
        Start 126: t_isR_1M_32k
121/164 Test #126: t_isR_1M_32k .....................   Passed    0.28 sec
        Start 127: t_isR_128K_8K
122/164 Test #127: t_isR_128K_8K ....................   Passed    0.25 sec
        Start 128: t_isR_16_1
123/164 Test #128: t_isR_16_1 .......................   Passed    0.25 sec
        Start 129: t_isR_32K_d
124/164 Test #129: t_isR_32K_d ......................   Passed    0.25 sec
        Start 130: t_isD_1M_32k
125/164 Test #130: t_isD_1M_32k .....................   Passed    0.30 sec
        Start 131: t_isD_128K_8K
126/164 Test #131: t_isD_128K_8K ....................   Passed    0.25 sec
        Start 132: t_isD_16_1
127/164 Test #132: t_isD_16_1 .......................   Passed    0.25 sec
        Start 133: t_isD_32K_d
128/164 Test #133: t_isD_32K_d ......................   Passed    0.24 sec
        Start 134: t_icS_128K_8K_l
129/164 Test #134: t_icS_128K_8K_l ..................   Passed    0.25 sec
        Start 135: t_icS_128K_8K_L
130/164 Test #135: t_icS_128K_8K_L ..................   Passed    0.44 sec
        Start 136: t_icS_128K_8K_lL
131/164 Test #136: t_icS_128K_8K_lL .................   Passed    0.32 sec
        Start 137: t_icR_128K_8K_l
132/164 Test #137: t_icR_128K_8K_l ..................   Passed    0.38 sec
        Start 138: t_icR_128K_8K_L
133/164 Test #138: t_icR_128K_8K_L ..................   Passed    0.26 sec
        Start 139: t_icR_128K_8K_lL
134/164 Test #139: t_icR_128K_8K_lL .................   Passed    0.45 sec
        Start 140: t_icD_128K_8K_l
135/164 Test #140: t_icD_128K_8K_l ..................   Passed    0.32 sec
        Start 141: t_icD_128K_8K_L
136/164 Test #141: t_icD_128K_8K_L ..................   Passed    0.36 sec
        Start 142: t_icD_128K_8K_lL
137/164 Test #142: t_icD_128K_8K_lL .................   Passed    0.47 sec
        Start 143: t_isS_128K_8K_l
138/164 Test #143: t_isS_128K_8K_l ..................   Passed    0.29 sec
        Start 144: t_isS_128K_8K_L
139/164 Test #144: t_isS_128K_8K_L ..................   Passed    0.38 sec
        Start 145: t_isS_128K_8K_lL
140/164 Test #145: t_isS_128K_8K_lL .................   Passed    0.51 sec
        Start 146: t_isR_128K_8K_l
141/164 Test #146: t_isR_128K_8K_l ..................   Passed    0.49 sec
        Start 147: t_isR_128K_8K_L
142/164 Test #147: t_isR_128K_8K_L ..................   Passed    0.25 sec
        Start 148: t_isR_128K_8K_lL
143/164 Test #148: t_isR_128K_8K_lL .................   Passed    0.42 sec
        Start 149: t_isD_128K_8K_l
144/164 Test #149: t_isD_128K_8K_l ..................   Passed    0.42 sec
        Start 150: t_isD_128K_8K_L
145/164 Test #150: t_isD_128K_8K_L ..................   Passed    0.52 sec
        Start 151: t_isD_128K_8K_lL
146/164 Test #151: t_isD_128K_8K_lL .................   Passed    0.46 sec
        Start 152: t_icnS_128K_8K_l
147/164 Test #152: t_icnS_128K_8K_l .................   Passed    0.30 sec
        Start 153: t_icnS_128K_8K_L
148/164 Test #153: t_icnS_128K_8K_L .................   Passed    0.24 sec
        Start 154: t_icnS_128K_8K_lL
149/164 Test #154: t_icnS_128K_8K_lL ................   Passed    0.23 sec
        Start 155: t_icnR_128K_8K_l
150/164 Test #155: t_icnR_128K_8K_l .................   Passed    0.51 sec
        Start 156: t_icnR_128K_8K_L
151/164 Test #156: t_icnR_128K_8K_L .................   Passed    0.25 sec
        Start 157: t_icnR_128K_8K_lL
152/164 Test #157: t_icnR_128K_8K_lL ................   Passed    1.00 sec
        Start 158: t_icnD_128K_8K_l
153/164 Test #158: t_icnD_128K_8K_l .................   Passed    0.64 sec
        Start 159: t_icnD_128K_8K_L
154/164 Test #159: t_icnD_128K_8K_L .................   Passed    0.22 sec
        Start 160: t_icnD_128K_8K_lL
155/164 Test #160: t_icnD_128K_8K_lL ................   Passed    0.65 sec
        Start 161: t_isnS_128K_8K_l
156/164 Test #161: t_isnS_128K_8K_l .................   Passed    0.12 sec
        Start 162: t_isnS_128K_8K_L
157/164 Test #162: t_isnS_128K_8K_L .................   Passed    0.24 sec
        Start 163: t_isnS_128K_8K_lL
158/164 Test #163: t_isnS_128K_8K_lL ................   Passed    0.28 sec
        Start 164: t_isnR_128K_8K_l
159/164 Test #164: t_isnR_128K_8K_l .................   Passed    0.61 sec
        Start 165: t_isnR_128K_8K_L
160/164 Test #165: t_isnR_128K_8K_L .................   Passed    0.28 sec
        Start 166: t_isnR_128K_8K_lL
161/164 Test #166: t_isnR_128K_8K_lL ................   Passed    0.72 sec
        Start 167: t_isnD_128K_8K_l
162/164 Test #167: t_isnD_128K_8K_l .................   Passed    0.88 sec
        Start 168: t_isnD_128K_8K_L
163/164 Test #168: t_isnD_128K_8K_L .................   Passed    0.24 sec
        Start 169: t_isnD_128K_8K_lL
164/164 Test #169: t_isnD_128K_8K_lL ................   Passed    0.91 sec

100% tests passed, 0 tests failed out of 164

Total Test time (real) =  39.33 sec
[100%] Built target check

```
