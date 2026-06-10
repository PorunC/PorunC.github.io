---
title: 第五讲 动态规划
date: '2021-11-21T10:41:06.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags:
  - Acwing
  - Algorithm
categories:
  - 算法
slug: 2021/11/21/Acwing-算法基础课-动态规划
oldUrl: /2021/11/21/Acwing-算法基础课-动态规划/
excerpt: >-
  $f(i, j)$ 表示体积 j 的情况下 装下前 i 个物品的最优解 1. $f(i , j) = max(f(i 1, j), f(i 1, j
  v(i)) + w(i))$ 2. $f(i 1, j)$表示不选第 i 个物品的最大价值 3. $f(i 1, j v(i)) + w(i)$
  表示选择了第 i 个物品的最大价值，第 i 个物品占了$v(i)...
---
### AcWing 2. 01背包问题

##### 状态表示

$f(i, j)$ 表示体积 j 的情况下 装下前 i 个物品的最优解

##### 状态计算

1. $f(i , j) = max(f(i - 1, j), f(i - 1, j - v(i)) + w(i))$
2. $f(i - 1, j)$表示不选第 i 个物品的最大价值
3. $f(i - 1, j - v(i)) + w(i)$ 表示选择了第 i 个物品的最大价值，第 i 个物品占了$v(i)$的空间，价值为$w(i)$

**优化：**

##### 状态表示

$f(j)$ 表示容量 j 下的最优解  
$backup(i)$数组在下一轮迭代开始之前将当前的$f(i)$ 数组备份起来

##### 状态计算

每次计算下一轮的状态的时候，需要使用上一轮迭代更新的结果，使用一个新的数组备份上一轮的迭代结果可以使下一轮的计算不受自己这一轮计算结果的影响

正序计算：  
$f(j) = max(f(j), backup(j - v(i)) + w(i))$，其中 j 从0递增到背包最大容量

更简洁的有使用逆序迭代进行计算 ， 不需要使用另外的数组备份上一轮的状态：  
$f(j) = max(f(j), f(j - v(i)) + w(i))$, 其中 $j 从背包最大容量递减到v(i)$

```cpp
#include<iostream>
using namespace std;

const int N = 1010;
int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++) cin >> v[i] >> w[i];

    for(int i = 1; i <= n; i ++)
        for(int j = m; j >= v[i]; j --)
            f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[m] << endl;

    return 0;
}

/*

#include<iostream>
#include<algorithm>
using namespace std;

const int N = 1010;
int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++) cin >> v[i] >> w[i];

    for(int i = 1; i <= n; i ++)
        for(int j = 0; j <= m; j ++)
        {
            f[i][j] = f[i - 1][j];
            if(j >= v[i]) f[i][j] = max(f[i][j], f[i-1][j - v[i]] + w[i]);
        }

    cout << f[n][m] << endl;

    return 0;
}

*/
```

### AcWing 3. 完全背包问题

##### 状态表示

$f(i, j)$ 表示容量 j 的条件下， 前 i 件物品的最优解

##### 状态计算

$f(i, j) = max(f(i - 1, j - k v) + k w), k = 0, 1, 2 …(j >= k v)$  
**等价变形**

1. $f(i,j) = max(f(i - 1, j), f(i - 1, j - v) + w, f(i - 1, j - 2 v) + 2 w, f(i - 1, j - 3 v) + 3 w, …)$
2. $f(i,j - v) = max( f(i - 1, j - v), f(i - 1, j - 2 v) + w, f(i - 1, j - 3 v) + 2 w, …)$  
   得：  
   $f(i, j) = max(f(i - 1, j), f(i, j - vi) + wi)$  
   **优化**  
   $f(j) = max(f(j), f(j - vi)+ wi)$

```cpp
//最终版
#include<iostream>
#include<algorithm>
using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++ ) cin >> v[i] >> w[i];

    for(int i = 1; i <= n; i ++ )
        for(int j = v[i]; j <= m; j ++ )
            f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[m] << endl;

    return 0;
}

//优化版
/*
#include<iostream>
#include<algorithm>

using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++) cin >> v[i] >> w[i];

    for(int i = 1; i <= n; i ++)
        for(int j = 0; j <= m; j ++)
        {
            f[i][j] = f[i - 1][j];
            if(j >= v[i]) f[i][j] = max(f[i][j], f[i][j - v[i]] + w[i]);
        }

    cout << f[n][m] << endl;

    return 0;
}
*/


//朴素法
/*
#include<iostream>
#include<algorithm>

using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++) cin >> v[i] >> w[i];

    for(int i = 1; i <= n; i ++)
        for(int j = 0; j <= m; j ++)
            for(int k = 0; k * v[i] <= j; k ++)
                f[i][j] = max(f[i][j], f[i - 1][j - v[i] * k] + w[i] * k);

    cout << f[n][m] << endl;

    return 0;
}
*/
```

### AcWing 4. 多重背包问题

##### 状态计算

$f(i, j) = max(f(i - 1, j), f(i - 1, j - k v) + k w)$

**优化**  
$f(j) = max(f(j), f(j - k v) + k w)$

```cpp
#include<iostream>
#include<algorithm>
using namespace std;

const int N = 110;

int n, m;
int f[N];

int main()
{
    cin >> n >> m;
    for(int i = 0; i < n; i ++ )
    {
        int v, w, s;
        cin >> v >> w >> s;
        for(int j = m; j >= 0; j -- )
            for(int k = 1; k <= s && k * v <= j; k ++ )
                f[j] = max(f[j], f[j - k * v] + k * w);
    }

    cout << f[m] << endl;

    return 0;
}
```

### AcWing 5. 多重背包问题 II

##### 状态计算

$f(i, j) = max(f(i - 1, j), f(i - 1, j - k v) + k w)$

**优化**  
$f(j) = max(f(j), f(j - k v) + k w)$

**接着优化**  
利用二进制的思想方法，将物品按照$1, 2, 4, 8, …$ 的等比序列也就是$0001, 0010, 0100,1000$这样的二进制序列对物品进行打包，多出来的物品独自打包成一份。  
例如 ： $11 = 1 + 2 + 4 + 4$,那么利用$1, 2, 4, 4$ 这几个数字就可以表示$11$以内的所有数字  
例如： $10 = 2 + 4 + 4$, $9 = 1 + 4 + 4$, $8 = 4 + 4$,…其他数字也是一样的道理  
这样子每个打包完的物品组只要选择拿或者不拿，就能把这个==多重背包==问题抽象成==01背包==问题，使得时间复杂度降低

```cpp
#include<iostream>
#include<algorithm>
using namespace std;

const int N = 25000;

int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;

    int cnt = 0;
    for(int i = 1; i <= n; i ++)
    {
        int a, b, s;
        cin >> a >> b >> s;
        int k = 1;
        while(k <= s)
        {
            cnt ++;
            v[cnt] = a * k;
            w[cnt] = b * k;
            s -= k;
            k *= 2;
        }
        if(s > 0)
        {
            cnt ++;
            v[cnt] = a * s;
            w[cnt] = b * s;
        }
    }

    n = cnt;

    for(int i = 1; i <= n; i ++ )
        for(int j = m; j >= v[i]; j -- )
            f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[m] << endl;

    return 0;
}
```

### AcWing 9. 分组背包问题

##### 状态表示

$f(i, j)$ 表示 体积 j 下前 i 组物品中的最优解

##### 状态计算

$f(i, j) = max(f(i - 1, j), f(i - 1, j -v(i, k)) + w(i, k)))$  
**等价变形**  
$f(j) = max(f(j), f(j - v(i, k) + w(i, k)))$

```cpp
#include<iostream>
#include<algorithm>
using namespace std;

const int N = 110;

int n, m;
int v[N][N], w[N][N], s[N];
int f[N];

int main()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++)
    {
        cin >> s[i];
        for(int j = 0; j < s[i]; j ++ )
            cin >> v[i][j] >> w[i][j];
    }

    for(int i = 1; i <= n; i ++ )
        for(int j = m; j >= 0; j -- )
            for(int k = 0; k < s[i]; k ++ )
                if(v[i][k] <= j)
                    f[j] = max(f[j], f[j - v[i][k]] + w[i][k]);

    cout << f[m] << endl;

    return 0;
}
```

### AcWing 898. 数字三角形

可以自下而上选择下方两个数字的较大值加上自己本身的值，直到三角形最上方为所求的值  
也可以自上而下进行操作  
![](https://img-blog.csdnimg.cn/8a8f133cab2c40499a2398732757e74a.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

##### 状态表示：$f[i][j]$表示走到坐标为$(i, j)$的点的最小路径和

##### 状态转移方程：

自底向上 $f[i][j] = a[i][j] + min(f[i + 1][j], f[i + 1][j + 1])$ ,最底层的$f[i][j] = a[i][j]$,$res = f[0][0]$

自顶向下$f[i][j] = a[i][j] + min(f[i - 1][j], f[i - 1][j - 1])$,初始状态$f[0][0] = a[0][0]$,$res = min(f[n]\_{0,1, …, n})$

```cpp
#include<iostream>
using namespace std;

const int N = 510, INF = 1e9;

int n;
int a[N][N];
int f[N][N];

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i ++ )
        for(int j = 1; j <= i; j ++ )
            scanf("%d", &a[i][j]);

    for(int i = 0; i <= n; i ++)
        for(int j = 0; j <= i + 1; j ++)
            f[i][j] = -INF;

    f[1][1] = a[1][1];
    for(int i = 2; i <= n; i ++ )
        for(int j = 1; j <= i; j ++)
            f[i][j] = max(f[i - 1][j - 1], f[i - 1][j]) + a[i][j];

    int res = -INF;
    for(int i = 1; i <= n; i ++ ) res = max(res, f[n][i]);

    printf("%d\n", res);

    return 0;
}
```

### AcWing 895. 最长上升子序列

##### 状态表示

$f[i]$ 表示以$a[i]$ 结尾最长的上升子序列的长度值

##### 状态计算

$f[i] = max(f[i], f[j] + 1),if (a[j] < a[i])$  
$res = max(f[i])$  
**例：**

```plaintext
a: 3 1 2 1 8 5 6
f: 1 1 2 1 3 3 4
```

```cpp
#include<iostream>
using namespace std;

const int N = 1010;

int n;
int a[N], f[N];

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i ++ ) scanf("%d", &a[i]);

    for(int i = 1; i <= n; i ++ )
    {
        f[i] = 1;
        for(int j = 1; j < i; j ++ )
            if(a[j] < a[i])
                f[i] = max(f[i], f[j] + 1);
    }

    int res = 0;
    for(int i = 1; i <= n; i ++ ) res = max(res, f[i]);
    
    printf("%d\n", res);
    
    return 0;
}
```

### AcWing 896. 最长上升子序列 II

```cpp
#include<iostream>
using namespace std;

const int N = 100010;
int n;
int a[N];

int st[N];
int tt = 0;

int main()
{
    scanf("%d", &n);
    for (int i = 0; i < n; i ++ ) scanf("%d", &a[i]);

    st[tt] = a[0];
    for(int i = 1 ; i < n ; i++)
    {
        //如果该元素大于栈顶元素,将该元素入栈
        if(a[i] > st[tt]) st[++ tt] = a[i];
        //替换掉第一个大于或者等于这个数字的那个数
        else 
        {
            int l = 0 , r = tt;
            while(l < r)
            {
                int mid = (l + r) >> 1;
                if(st[mid] >= a[i]) r = mid;
                else l = mid + 1;
            }
            st[l] = a[i];
        }
    }
    printf("%d",tt + 1);
    return 0;
}
```

这个栈 **不用于记录最终的最长子序列**，而是 **以stk[i]结尾的子串长度最长为i** 或者说 **长度为i的递增子串中，末尾元素最小的是stk[i]**。理解了这个问题以后就知道为什么新进来的元素要不就在末尾增加，要不就替代第一个大于等于它元素的位置。  
这里的 **替换** 就蕴含了一个贪心的思想，对于同样长度的子串，我们当然希望它的末端越小越好，这样以后也有更多机会拓展。

### AcWing 897. 最长公共子序列

##### 状态表示

$f[i][j]$表示`a`的前`i`个字符中与`b`的前`j`个字符中最长的公共子序列的长度

##### 状态计算

1. $a[i] ~!= ~b[j]$时  
   a[i] 不在最长公共子序列中， $f[i - 1][j]$  
   b[j] 不在最长公共子序列中， $f[i][j - 1]$
2. $a[i] ~==~ b[j]$时，$f[i - 1][j - 1] + 1$

##### 状态转移

1. $f[i][j] = max(f[i - 1][j], f[i][j - 1]);$
2. $f[i][j] = max(f[i][j], f[i - 1][j - 1] + (a[i] == b[j]));$

```cpp
#include<iostream>
using namespace std;

const int N = 1010;

int n, m;
char a[N], b[N];
int f[N][N];

int main()
{
    scanf("%d%d", &n, &m);
    scanf("%s%s", a + 1, b + 1);

    for(int i = 1; i <= n; i ++ )
        for(int j = 1; j <= m; j ++ )
        {
            f[i][j] = max(f[i - 1][j], f[i][j - 1]);
            if(a[i] == b[j])
                f[i][j] = max(f[i][j], f[i - 1][j - 1] + 1);
        }

    printf("%d\n", f[n][m]);

    return 0;
}
```

### AcWing 902. 最短编辑距离

##### 状态表示

$f[i][j]$表示将字符串`a` 的前`i`个字符 转换成字符串`b`前`j`个字符的最少操作次数

##### 状态计算

1. 删除操作 ： 删去`a[i]` 之后, a的前 `i - 1`个字符和 b 的前`j`个字符相同，$f[i -1][j] + 1$
2. 插入操作： 插入 `b[j]` 之前, a的前`i` 个字符和 b 的前 `j - 1`个字符相同， $f[i][j -1] + 1$
3. 修改操作： 将 `a[i]` 修改为 `b[j]` 前，`a` 的前 `i - 1`个字符 与 `b`的前 `j - 1`个字符相同  
   如果 `a[i] == b[j]`, $f[i - 1][j - 1] + 0$， 否则`a[i] != b[j]`, $f[i - 1][j - 1] + 1$

##### 状态转移方程

1. $f[i][j] = min(f[i - 1][j], f[i][j - 1]) + 1;$
2. $f[i][j] = min(f[i][j], f[i - 1][j - 1] + (a[i] != b[j]));$

##### 初始化

1. $f[0][i] = i;$ `a`的长度为0， 变成`b`的前`i`个字符需要添加`i`个字符
2. $f[i][0] = i;$ `b`的长度为0， 变成`b`的前`i`个字符需要删除`i`个字符

```cpp
#include<iostream>
using namespace std;

const int N = 1010;

int n, m;
char a[N], b[N];
int f[N][N];

int main()
{
    scanf("%d%s", &n, a + 1);
    scanf("%d%s", &m, b + 1);

    for( int i = 0; i <= m; i ++ ) f[0][i] = i;
    for( int i = 0; i <= n; i ++ ) f[i][0] = i;

    for( int i = 1; i <= n; i ++ )
        for( int j = 1; j <= m; j ++ )
        {
            f[i][j] = min(f[i - 1][j], f[i][j - 1]) + 1;
            f[i][j] = min(f[i][j], f[i - 1][j - 1] + (a[i] != b[j]));
        }
    
    printf("%d\n", f[n][m]);
        
    return 0;
}
```

### AcWing 899. 编辑距离

思路同AcWing 902. 最短编辑距离

```cpp
#include<iostream>
#include<string.h>
using namespace std;

const int N = 15, M = 1010;

int n, m;
int f[N][N];
char str[M][N];

int edit_distance(char a[], char b[])
{
    int la = strlen(a + 1), lb = strlen(b + 1);

    for(int i = 0; i <= lb; i ++ ) f[0][i] = i;
    for(int i = 0; i <= la; i ++ ) f[i][0] = i;

    for(int i = 1; i <= la; i ++ )
        for(int j = 1; j <= lb; j ++ )
        {
            f[i][j] = min(f[i - 1][j] + 1, f[i][j - 1] + 1);
            f[i][j] = min(f[i][j], f[i - 1][j - 1] + (a[i] != b[j]));
        }
    
    return f[la][lb];
}

int main()
{
    scanf("%d%d", &n, &m);
    for(int i = 0; i < n; i ++ ) scanf("%s", str[i] + 1);

    while(m -- )
    {
        char s[N];
        int limit;
        scanf("%s%d", s + 1, &limit);

        int res = 0;
        for(int i = 0; i < n; i ++ )
            if(edit_distance(str[i], s) <= limit)
                res ++;

        printf("%d\n", res);
    }

    return 0;
}
```

### AcWing 282. 石子合并

因为只能够让相邻的两堆石子进行合并，所以不是哈夫曼算法，不能使用贪心。

##### 状态表示

$f[i][j]$表示将第`i`堆石子到第`j`堆石子合并成一堆石子的最小代价

##### 状态计算

$f[i][j]=min(f[i][k] + f[k + 1][j] + s[j] - s[i - 1])$  
$k ∈[i,j - 1]$

##### 边界条件

$f[i][i] = 0$， 同一堆石子不用合并  
合并这些石子的代价为$f[1][n]$

```cpp
#include<iostream>
using namespace std;

const int N = 310;

int n;
int s[N];
int f[N][N];

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i ++ ) scanf("%d", &s[i]);
                                                //前缀和，便于计算
    for(int i = 1; i <= n; i ++ ) s[i] += s[i - 1];

    for(int len = 2; len <= n; len ++ )         //len 表示区间长度
        for(int i = 1; i + len - 1 <= n; i ++ ) //
        {
            int l = i, r = i + len - 1;         //l为起点， r为终点
            f[l][r] = 0x3f3f3f3f;       
            for(int k = l; k < r; k ++ )        //k为分界点，用于状态计算
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + s[r] - s[l - 1]);
        }

    printf("%d\n", f[1][n]);
    
    return 0;
}
```

### AcWing 900. 整数划分

可以将这个问题抽象成完全背包问题  
把数字1，2，3，…，n分别看成n个物体的体积，每个物体可以不限次数使用，问恰好装满体积为n的背包共有几种方案

##### 状态表示

$f(i, j)$ 表示 前 $i$ 个整数$(1, 2, 3, …, i)$恰好拼成整数 $j$的方案数量

##### 状态计算

将各个集合中选择了`0个i， 1个i，2个i，...`的集合数值累加起来

1. $f(i, j) = f(i - 1, j) + f(i - 1, j - i) + f(i - 1, j - 2 i) + f(i - 1, j - 3 i) + …$
2. $f(i,j - i) = f(i - 1, j - i) + f(i - 1,j - 2 i) + f(i - 1, j - 3 i) + …$

得：$f(i, j) = f(i, j - i) + f(i-1, j)$

##### 边界条件

$f[1][1] = 1$

**等价变形**  
$f(j) = f(j ) + f(j - i)$  
**边界条件**  
$f[0] = 1$,容量为0，前 i 个数全都不选也是一种方案

```cpp
#include<iostream>
using namespace std;

const int N = 1010, mod = 1e9 + 7;

int n;
int f[N][N];

int main()
{
    cin >> n;
    f[1][1] = 1;
    for(int i = 2; i <= n; i ++ )
        for(int j = 1; j <= i; j ++ )
            f[i][j] = (f[i - 1][j - 1] + f[i - j][j]) % mod;
    
    int res = 0;
    for(int i = 1; i <= n; i ++ ) res = (res + f[n][i]) % mod;
    cout << res << endl;
}
```

等价变形

```cpp
#include<iostream>
using namespace std;

const int N = 1010, mod = 1e9 + 7;

int n;
int f[N];

int main()
{
    cin >> n;

    f[0] = 1;
    for(int i = 1; i <= n; i ++ )
        for(int j = i; j <= n; j ++ )
            f[j] = (f[j] + f[j - i]) % mod;

    cout << f[n] << endl;

    return 0;
}
```

### AcWing 338. 计数问题

求$[a, ~b]$区间中的数字$k（k ∈[0, 9]）$出现的次数，  
可以将这个问题转换成求数字$k$在区间$[0, a]$中出现的次数，记作$count(b)$，  
和在区间$[0, b]$ 出现的次数，记作$count(b)$，$count(b) - count(a)$就是所求的数字出现次数  
思想类似于前缀和  
**例：**  
给定数字 $n = abcdef$ 求数字 x 在第四位出现的次数  
**分类讨论**

- 1 前三位数的大小范围在区间$[0, abc - 1]$中，第四位数为$x$，出现的次数为$(abc - 1 + 1) \cdot 100$
- 2 . 前三位数等于$abc$ 第四位数要为 $x$, 则应满足的条件为 $d >= x$  
  ① $d < x$ : 后两位，第四位为x的数字大于$abcdef$,无解  
  ② $d == x$:第四位为$x$ 的数字后两位数字取值范围为$[0, ef]$，个数为$ef + 1$  
  ③ $d~ > ~x$: 第四位为$x$ 的数字后两位数字取值范围为$[0, 99]$， 个数为100

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

//截取num的 第 l ~ r 位数字
int get(vector<int> num, int l, int r)
{
    int res = 0;
    for(int i = l; i >= r; i -- ) res = res * 10 + num[i];
    return res;
}

//计算10的x次幂
int power10(int x)
{
    int res = 1;
    while (x -- ) res *= 10;
    return res;
}

int count(int n, int x)
{
    if (!n) return 0;

    //用数组存储数字 n ，便于取每个位上的数字
    vector<int> num;
    while (n)
    {
        num.push_back(n % 10);
        n /= 10;
    }
    n = num.size();

    int res = 0;
    
    //最高位不能为 0 ， x == 0 时，可以少循环一次
    //计算 x 在每位数字上面出现的次数， 加起来就是总共的出现次数
    for (int i = n - 1 - !x; i >= 0; i -- )
    {
        // i == n - 1时，是数字的个位，不需要乘上10的幂次
        if (i < n - 1)
        {
            //abc * power10(i)
            res += get(num, n - 1, i + 1) * power10(i);

            //计算0的出现次数时，数字首位不能为0
            //即 当 x == 0 时， abc 不能为 000
            if (!x) res -= power10(i);
        }

        //d == x 的情况
        if (num[i] == x) res += get(num, i - 1, 0) + 1;
        // d > x 的情况
        else if (num[i] > x) res += power10(i);
    }
    cout << num[n - 1] << " ";
    return res;
}

int main()
{
    int a, b;
    while (cin >> a >> b , a)
    {
        if (a > b) swap(a, b);

        for (int i = 0; i <= 9; i ++ )
            cout << count(b, i) - count(a - 1, i) << ' ';
        cout << endl;
    }

    return 0;
}
```

### AcWing 291. 蒙德里安的梦想

当横着摆放的小方块摆放完成之后，剩下的位置就只能摆放竖着的小方块了，所以棋盘上的小方块总的摆放方案数量等于横着摆放小方块的方案数量

##### 状态表示

$f(i, j)$表示前$i - 1$列已经摆好，伸出到第 $i$ 列的状态是 $j$ 的所有方案， 其中 $j$ 是一个二进制数，用来表示哪一行的小方块是横着放的，位数与棋盘的行数一致，1表示哪几行小方块是横着伸出来的，0表示哪几行不是横着伸出来的。

##### 状态计算

1. **状态转移**  
   第 $i$ 列是固定的，首先从第 $i - 2$列转移到 $i - 1$ 列开始，假设此时的状态为 $k$，它对应的方案数应该为 $f(i -1, k)$，即前 $i - 2$ 列都摆完了，且从第 $i - 2$ 列伸到第 $i - 1$ 列的状态为 $k$ 的所有方案数。  
   k 需要满足以下几点要求 ：  
   1.1. $k &j == 0$，即 $k$ 和 $j$ 不是在同一行横着摆放的小方块，他们之间摆放的小方块不会发生冲突  
   1.2. 横着的小方块摆放完之后，剩余的空着的位置是留着给竖着摆放的小方块的，长度应该为偶数。
2. **最终答案**的表达式应该为$f[m][0]$，表示第$m - 1$列已经摆放完，且第$m$列没有伸出的小方块，其状态表示的值$k = 0$
3. **状态计算**  
   $f[i][j] += f[i - 1][k]$，其中 $i ∈[1, m], j∈[0, 1 << n], k∈state[j]$
4. **边界条件**  
   $f[0][0] = 1$

```cpp
#include <cstring>
#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

typedef long long LL;

//每列每个空格都可以选择放或者不放，所以是 2 ^ N
const int N = 12, M = 1 << N;

int n, m;
LL f[N][M];

// 记录每个能成功状态转移的二进制序列
vector<int> state[M];

/* 第 i-2 列伸到 i-1 列的状态为 k ，
 * 是否能成功转移到 第 i-1 列伸到 i 列的状态为 j
 * st[j|k]=true 表示能成功转移
 */ 
bool st[M];

int main()
{
    while (cin >> n >> m, n || m)
    {

        //预处理 st数组，将空格数量为偶数的状态找出来
        for (int i = 0; i < 1 << n; i ++ )
        {
            //记录当前列状态中 0 的个数
            int cnt = 0;
            bool is_valid = true;
            for (int j = 0; j < n; j ++ )
                if (i >> j & 1)
                {
                    //空格数量为奇数 
                    if (cnt & 1)
                    {
                        is_valid = false;
                        break;
                    }
                    cnt = 0;
                }
                else cnt ++ ;

            //空格数量为奇数    
            if (cnt & 1) is_valid = false;
            st[i] = is_valid;
        }

        //将可以合法转移的状态记录下来
        //即第 i - 1列伸出的小方块不会与第 i 列冲突
        for (int i = 0; i < 1 << n; i ++ )
        {
            state[i].clear();
            for (int j = 0; j < 1 << n; j ++ )
                //表示 在 k列状态 i，k - 1 列状态 j 的情况下是合法的
                if ((i & j) == 0 && st[i | j])
                    state[i].push_back(j);
        }

        //状态计算
        memset(f, 0, sizeof f);
        f[0][0] = 1;
        for (int i = 1; i <= m; i ++ )
            for (int j = 0; j < 1 << n; j ++ )
                for (auto k : state[j])
                    f[i][j] += f[i - 1][k];

        cout << f[m][0] << endl;
    }

    return 0;
}
```

### AcWing 91. 最短Hamilton路径

用二进制序列来表示所有走过的点  
例如走过点$0，1，2，4$则表示为$10111$，走过$0，2，3$则表示为$01101$

##### 状态表示

$f(i, j)$ 表示所有走到点 $j$ ，且所有走过的点是 $i$ 的所有路径长度

##### 状态计算

$f[i][j] = min(f[i][j], f[i - (1 << j)][k] + w[k][j])$

其中 $i∈[0, 1 << n], j ∈ [0, n -1], k∈[0, n - 1]$

*边界条件* ：$f[1][0] = 0;$  
*最终结果*：$f[(1 << n) - 1][n - 1]$ ，表示 $(1 << n) - 1$ 每个点都经过， $n - 1$ 表示到达终点

```cpp
#include <cstring>
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 20, M = 1 << N;

int n;
int w[N][N];
int f[M][N];

int main()
{
    cin >> n;
    for (int i = 0; i < n; i ++ )
        for (int j = 0; j < n; j ++ )
            cin >> w[i][j];

    memset(f, 0x3f, sizeof f);                  //初始化为较大的常数
    f[1][0] = 0;                                //起点不需要任何花费

    for (int i = 0; i < 1 << n; i ++ )          //枚举所有路径
        for (int j = 0; j < n; j ++ )           //枚举所有点
            if (i >> j & 1)                     //路径 i 是否经过点 j
                for (int k = 0; k < n; k ++ )   //枚举走到 j 的点 k
                    if (i >> k & 1)             //判断到达 j 的点 k 是否为最优路径
                        f[i][j] = min(f[i][j], f[i - (1 << j)][k] + w[k][j]);

    cout << f[(1 << n) - 1][n - 1] << endl;     //输出最终答案

    return 0;
}
```

### AcWing 285. 没有上司的舞会

###### 状态表示：

$f[u][0]$:以u为根节点的子树中，u不在场的快乐值最大值  
$f[u][1]$:以u为根节点的子树中，u在场的快乐值最大值

###### 状态计算：

1. u节点不选时，子节点选择使快乐值最大的情况  
   $f[u][0] += max(f[j][0], f[j][1])$
2. u节点选择时，子节点一定不能选  
   $f[u][1] += (f[j][0])$

```cpp
#include<iostream>
#include<algorithm>
#include<cstring>
using namespace std;

const int N = 6010;

int n;
int happy[N];
int h[N], e[N], ne[N], idx;
int f[N][2];
bool has_father[N];             //标记是否有直属上司

void add(int a, int b)
{
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++ ;
}

void dfs(int u)
{
    //上司在的时候，加上这个上司的快乐值
    f[u][1] = happy[u];

    for(int i = h[u]; ~i; i = ne[i])
    {
        int j = e[i];           //子节点
        dfs(j);                 //搜索子节点

        //上司不在，选取直属下属去或不去的最大值
        f[u][0] += max(f[j][0], f[j][1]);
        //上司在，加上直属下属不去的快乐值
        f[u][1] += f[j][0];
    }
}

int main()
{
    cin >> n;
    for(int i = 1; i <= n; i ++ ) cin >> happy[i];

    memset(h, -1, sizeof h);
    for(int i = 0; i < n - 1; i ++ )
    {
        int a, b;
        cin >> a >> b;
        has_father[a] = true;
        add(b, a);
    }

    int root = 1;
    while(has_father[root]) root ++ ;
    dfs(root);

    //取根节点去不去的最大值
    cout << max(f[root][0], f[root][1]);
    return 0;
}
```

### AcWing 901. 滑雪

记忆化搜索形式类似于搜索，是DP的一种实现方式

```cpp
#include<iostream>
#include<cstring>
#include<queue>
#include<algorithm>

using namespace std;

const int N = 310;

int n, m;
int h[N][N];
int f[N][N];

//偏移量，使当前坐标偏移
int dx[4] = {-1, 0, 1, 0};
int dy[4] = {0, 1, 0, -1};

int dp(int x, int y)
{
    int& v = f[x][y];

    //该点已经被遍历过
    if(v != -1) return v;

    v = 1;

    //思路类似于BFS
    for(int i = 0; i < 4; i ++ )
    {
        int a = x + dx[i], b = y + dy[i];

        //确保当前的坐标值未出界，并且对应的高度可以下滑
        //这一步可以将遍历过的坐标对应可以下滑的最大值记录进f数组
        if(a >= 1 && a <= n && b >= 1 && b <= m && h[a][b] < h[x][y])
            v = max(v, dp(a, b) + 1);
    }

    return v;
}

int main()
{
    cin >> n >> m;

    for(int i = 1; i <= n; i ++ )
        for(int j = 1; j <= m; j ++ )
            cin >> h[i][j];
    
    memset(f, -1, sizeof f);

    int res = 0, x, y;
    for(int i = 1; i <= n; i ++ ) 
        for(int j = 1; j <= m; j ++ )
        {
            if(res  < dp(i, j)) {
                res = dp(i, j);
                x = i, y = j;
            }
        }
    
    cout << res << endl;

    // //输出路径
    // queue<pair<int, int>> q;
    // vector<pair<int, int>> path;

    // q.push({x, y});

    // while(!q.empty()) {
    //     auto t = q.front();
    //     path.push_back(t);
    //     q.pop();
    //     x = t.first, y = t.second;
    //     for(int i = 0; i < 4; i ++ ) {
    //         auto a = x + dx[i], b = y + dy[i];
    //         if(a >= 1 && a <= n && b >= 1 && b <= m && h[a][b] == h[x][y] - 1)
    //             q.push({a, b});
    //     }
    // }

    // for(auto i : path) {
    //     cout << i.first << " " << i.second << endl;
    // }
}
```
