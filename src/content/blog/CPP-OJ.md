---
title: CPP-OJ
date: '2021-07-12T04:51:16.000Z'
updated: '2023-02-22T13:07:14.000Z'
tags: []
categories: []
slug: 2021/07/12/CPP-OJ
oldUrl: /2021/07/12/CPP-OJ/
excerpt: >-
  题目源自某高校C++的OJ 将做过的C++ OJ题目整理合并了一下，总共有一百多道题目，手动合并自然是不可能的
  这个时候我们就可以使用shell脚本来取代这种机械化的重复劳动了，由于写成博客需要使用Markdown文档，我们就结合md文档的语法来编写这个merge.sh脚本吧
  脚本内容： cpp' all.md cat "$file name" all.md...
---
题目源自某高校C++的OJ

将做过的C++ OJ题目整理合并了一下，总共有一百多道题目，手动合并自然是不可能的

![](https://img-blog.csdnimg.cn/90d191b112bd439ea6cdb6cc9bd86e6d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

这个时候我们就可以使用`shell`脚本来取代这种机械化的重复劳动了，由于写成博客需要使用Markdown文档，我们就结合md文档的语法来编写这个`merge.sh`脚本吧

```bash
vim merge.sh
```

脚本内容：

```bash
#!/usr/bin/env bash

ls *.cpp |
while read file_name;
do
    echo "### ${file_name%.*}:" >> all.md
    echo '```cpp' >> all.md
    cat "$file_name" >> all.md
    echo "" >> all.md
    echo '```' >> all.md
    echo "" >> all.md
done
```

最后赋予执行权限：

```bash
chmod +x merge.sh
./merge.sh
```

大功告成啦

![](https://img-blog.csdnimg.cn/a509a678eb864d0b9ad876bb07615767.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUlOR2dvUw==,size_20,color_FFFFFF,t_70,g_se,x_16)

## 郑重声明

> 代码仅供参考，请勿直接抄袭，本文字数过多，请善用`Ctrl + F`进行检索

### A. 身体评估（类与对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Person
{
public:
    string name;
    double high, weight, yao;
    double a, b, BMI, percent;
    void ope()
    {
        a = yao * 0.74;
        b = weight * 0.082 + 34.89;
        BMI = weight / (high * high);
        percent = (a - b) / weight;
        if(BMI - (int)BMI >= 0.5) BMI = (int) BMI + 1;
        else BMI = (int) BMI;
    }
    void print()
    {
        cout << name;
        printf("的BMI指数为%.0lf--体脂率为%.2lf\n", BMI, percent);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Person p;
        cin >> p.name >> p.high >> p.weight >> p.yao;
        p.ope();
        p.print();
    }
    return 0;
}
```

### B. 最胖的加菲（类与对象+数组）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Cat
{
    string name;
    int weight;
public:
    void get()
    {
        cin >> name >> weight;
    }
    int wei()
    {
        return weight;
    }
    string getName()
    {
        return name;
    }
};

bool cmp(Cat A, Cat B)
{
    return A.wei() < B.wei();
}

int main()
{
    int t;
    cin >> t;
    Cat *cat = new Cat[t];
    for(int i = 0; i < t; i ++ )
        cat[i].get();

    sort(cat, cat + t, cmp);

    for(int i = 0; i < t; i ++ )
        cout << cat[i].getName() << " ";
    cout << endl;

    return 0;
}
```

### C. 音像制品（类与对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Product
{
    string lei[4] = {"黑胶片", "CD", "VCD", "DVD"};
    string st[2] = {"未出租","已出租"};
    int leixin, price, state, cnt;
    string name;
public:
    Product()
    {
       cin >> leixin >> name >> price >> state;
       cin >> cnt;
    }
    void Print()
    {
        cout << lei[leixin - 1] << "[" << name << "]" << st[state] << endl;
        if(cnt)
        {
            if(cnt * price && state)
            {
                cout << "当前租金为" << cnt * price << endl;
            }
            else cout << "未产生租金" << endl;
        }
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Product p;
        p.Print();
    }
    return 0;
}
```

### D. 三角形类(构造与析构):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Triangle
{
public:
    double a[3];
    string lei;
    Triangle()
    {
        cin >> a[0] >> a[1] >> a[2];
        sort(a, a + 3);
        if(a[0] + a[1] <= a[2])
            cout << "no triangle" << endl;
        else
        {
            double p = (a[0] + a[1] + a[2]) / 2;
            double S = sqrt(p * (p - a[0]) * (p - a[1]) * (p - a[2]));
            double b = a[0] * a[0], c = a[1] * a[1], d = a[2] * a[2];
            if(b + c - d < 1e-3)
            {
                if(a[0] == a[1]) lei = "isosceles right triangle";
                else lei = "right triangle";
            }
            else if(a[0] == a[1] && a[1] == a[2])
                lei = "equilateral triangle";
            else lei = "general triangle";
            cout << lei;
            printf(", %.1lf\n", S);
        }
    }
    ~Triangle()
    {
        for(int i = 0; i < 3; i ++ ) a[i] = 0;
        lei = "none";
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Triangle tri;
    }
    return 0;
}
```

### E. CPU调度（类与对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Process
{
    string name;
    int time_wait, time_run, level;
public:
    void getLevel();
    void display();
    int Le();
};

int Process::Le() {
    return level;
}

void Process::getLevel()
{
    cin >> name >> time_wait >> time_run;
    level = time_wait / time_run;
}

void Process::display()
{
cout << name << " " << time_wait << " " << time_run << " " << level << endl;
}

bool cmp(Process A, Process B)
{
    return A.Le() > B.Le();
}

int main()
{
    Process p[3];
    for(int i = 0; i < 3; i ++ )
    {
        p[i].getLevel();
    }
    sort(p, p + 3, cmp);
    p[0].display();
    return 0;
}
```

### F. 手机取款（类与对象数组）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Count
{
    //��Ա����
    string CardId, Phone, Password;
    int num;
public:
    void get()//�����Ա����
    {
        cin >> CardId >> Phone >> Password >> num;
    }
    string getPhone()
    {
        return Phone;//���ص绰�����ֵ
    }
    bool SignIn(string pa)
    {
        if(pa != Password)//�������
        {
            cout << "�������" << endl;
            return 0;
        }else return 1;
    }
    void getMoney(int n)//ȡǮ
    {
        //Ǯ����
        if(n > num) cout << "����" << CardId << "--����" << endl;
        else//Ǯ���ˣ���Ǯ
        {
            num -= n;
            cout << "����" << CardId << "--���" << num << endl;
        }
    }
};

int main()
{
    int n;
    cin >> n;
    Count custom[n];
    for(int i = 0; i < n; i ++ )
    {
        custom[i].get();//��ȡ���������Ա������
    }
    int k;
    cin >> k;//�����ٴβ���
    while(k -- )
    {
        string Phone, PassWord;
        int num, flag = 0, i;
        cin >> Phone >> PassWord >> num;
        for(i = 0; i < n; i ++ )//ѭ����������������ֻ���
        {
            if(custom[i].getPhone() == Phone)
            {
                flag = 1;//flag ����ֻ����Ƿ����
                break;
            }
        }
        if(!flag) cout << "�ֻ��Ų�����" << endl;
        else
        {
            int res = custom[i].SignIn(PassWord);
            if(res != 0)//res ����Ƿ��¼�ɹ�
            {
                custom[i].getMoney(num);
            }
        }
    }
}
```

### G. Point&Circle(复合类与构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Point
{
public:
    double x, y;
    Point()
    {
        x = 0, y = 0;
    }
};

class Circle
{
public:
    Point centre;
    double radius;
    Circle()
    {
        centre.x = 0, centre.y = 0;
        radius = 1;
    }
    Circle(double new_x, double new_y, double r)
    {
        centre.x = new_x, centre.y = new_y, radius = r;
    }
    void setCentre(double new_x, double new_y)
    {
        centre.x = new_x, centre.y = new_y;
    }
    int contain(Point &t)
    {
        double a = (t.x - centre.x) * (t.x - centre.x);
        double b = (t.y - centre.y) * (t.y - centre.y);
        if(a + b - radius * radius <= 1e-3) cout << "inside" << endl;
        else cout << "outside" << endl;
    }
};

int main()
{
    int x, y, r;
    cin >> x >> y >> r;
    Circle ci(x, y, r);
    int n;
    cin >> n;
    Point p[n];
    for(int i = 0; i < n; i ++ )
    {
        cin >> p[i].x >> p[i].y;
    }
    for(int i = 0; i < n; i ++ )
    {
        ci.contain(p[i]);
    }
    cout << "after move the centre of circle:" << endl;
    cin >> x >> y;
    ci.setCentre(x, y);
    for(int i = 0; i < n; i ++ )
    {
        ci.contain(p[i]);
    }
    return 0;
}
```

### H. Equation(类与对象+构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Equation
{
    double a, b, c;
public:
    Equation()
    {
        a = 1, b = 1, c = 0;
    }
    void set()
    {
        cin >> a >> b >> c;
    }
    void getRoot()
    {
        double x1, x2, delta;
        delta = b * b - 4 * a * c;
        if(delta > 0)
        {
            x1 = (-b + sqrt(delta)) / (2 * a);
            x2 = (-b - sqrt(delta)) / (2 * a);
            printf("x1=%.2lf x2=%.2lf\n", x1, x2);
        }
        else if(delta == 0)
        {
            x1 = -b / (2 * a);
            printf("x1=x2=%.2lf\n", x1);
        }
        else
        {
            double an = sqrt(-delta) / (2 * a);
            x1 =(-b)/ (2 * a);
            printf("x1=%.2lf+%.2lfi x2=%.2lf-%.2lfi\n", x1, an, x1, an);
        }
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Equation e;
        e.set();
        e.getRoot();
    }
    return 0;
}
```

### I. Complex(类与对象+构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Complex
{
    int shi, xu;
public:
    Complex()
    {
        shi = 1, xu = 1;
    }
    Complex(int a, int b)
    {
        shi = a, xu = b;
    }
    Complex &add(Complex &C)
    {
        shi += C.shi, xu += C.xu;
        return *this;
    }
    Complex &sub(Complex &C)
    {
        shi -= C.shi, xu -= C.xu;
        return *this;
    }
    void Print1()
    {
        cout << "sum:";
        if(shi != 0) cout << shi;
        if(xu > 1 && shi != 0) cout << "+" << xu << "i";
        else if(xu == 1 && shi != 0) cout << "+" << "i";
        else if(xu > 1 && shi == 0) cout << xu << "i";
        else if(xu == 1 && shi == 0) cout << "i";
        else if(xu < 0) cout << xu << "i";
        if(shi == 0 && xu == 0) cout << 0;
        cout << endl;
    }
    void Print0()
    {
        cout << "remainder:";
        if(shi != 0) cout << shi;
        if(xu > 1 && shi != 0) cout << "+" << xu << "i";
        else if(xu == 1 && shi != 0) cout << "+" << "i";
        else if(xu > 1 && shi == 0) cout << xu << "i";
        else if(xu == 1 && shi == 0) cout << "i";
        else if(xu < 0) cout << xu << "i";
        if(shi == 0 && xu == 0) cout << 0;
        cout << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    int a, b, c, d;
    while(t -- )
    {
        cin >> a >> b >> c >> d;
        Complex co(a, b), co1(c, d);
        Complex c = co, c1 = co1;
        c.add(c1);
        c.Print1();
        co.sub(co1);
        co.Print0();
    }
    return 0;
}
```

### J. 分数运算（类+构造）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class num_fen
{
    int a, b;//a 为分子， b为分母
public:
    num_fen();//无参构造，可以不用写这个
    num_fen(int na, int nb);//有参构造
    void get();//输入分子分母的值
    num_fen add(num_fen &num1);//分数加法
    num_fen mul(num_fen &num1);
    void Display();
};

num_fen::num_fen() {
    a = 0, b = 1;
}

num_fen::num_fen(int na, int nb) {
    a = na, b = nb;
    if(b < 0) b = -b, a = -a;
}

void num_fen::get() {
    cin >> a >> b;
}

num_fen num_fen::add(num_fen &num1) {
    int a0 = a * num1.b + b * num1.a;
    int b0 = b * num1.b;
    num_fen num2(a0, b0);
    return num2;
}

num_fen num_fen::mul(num_fen &num1) {
    int a0 = a * num1.a;
    int b0 = b * num1.b;
    num_fen num2(a0, b0);
    return num2;
}

void num_fen::Display() {
    printf("%d/%d", a, b);
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        num_fen num0, num1;
        num0.get(), num1.get();
        num0.Display();
        cout << " ";
        num1.Display();
        cout << endl;
        num_fen num2 = num0.add(num1);
        num_fen num3 = num0.mul(num1);
        num2.Display();
        cout << endl;
        num3.Display();
        cout << endl;
    }
    return 0;
}
```

### K. 存折类定义（类与对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Account
{
public:
    string name, acc;
    double balance;
    Account()
    {
        cin >> acc >> name >> balance;
    }
    void check()
    {
        cout << name << "'s balance is " << balance << endl;
    }
    void deposit()
    {
        double num;
        cin >> num;
        balance += num;
        cout << "saving ok!" << endl;
    }
    void withdraw()
    {
        double num;
        cin >> num;
        if(num > balance) cout << "sorry! over limit!" << endl;
        else
        {
            balance -= num;
            cout << "withdraw ok!" << endl;
        }
    }
};

int main()
{
    for(int i = 0; i < 2; i ++ )
    {
        Account a;
        a.check();
        a.deposit();
        a.check();
        a.withdraw();
        a.check();
    }
    return 0;
}
```

### L. 五子棋简单实现（类和对象）:

```cpp
#include<iostream>
using namespace std;

const char black_chess = '#', white_chess = '@';
const char black = 'u', white = 'o';

class play_table
{
    bool over;//判断游戏是否结束
    bool hefa; //判断操作是否合法
    bool state;//判断下一轮的状态，0为黑子，1为白子
    int winner; //判断赢家是谁,0为黑子， 1为白子
public:
    char table[16][16];

    play_table()
    {
        over = false, hefa = true, state = 0;
        for(int i = 1; i <= 15; i ++ )
            for(int j = 1; j <= 15; j ++ )
                table[i][j] = '0';
    }

    bool getOver()
    {
        return over;
    }

    void check(char ch)
    {
        bool flag = false;
        int cnt = 0;
        //横行判断
        for(int i = 1; i <= 15; i ++ )
            for(int j = 1; j <= 11; j ++ )
            {
                if(table[i][j] == ch
                && table[i][j + 1] == ch
                && table[i][j + 2] == ch
                && table[i][j + 3] == ch
                && table[i][j + 4] == ch)
                {
                    flag = true;
                    break;
                }
            }
        //竖列判断
        for(int i = 1; i <= 11; i ++ )
            for(int j = 1; j <= 15; j ++ )
            {
                if(table[i][j] == ch
                   && table[i + 1][j] == ch
                   && table[i + 2][j] == ch
                   && table[i + 3][j] == ch
                   && table[i + 4][j] == ch)
                {
                    flag = true;
                    break;
                }
            }
        //主对角线及平行
        for(int i = 1; i <= 11; i ++ )
            for(int j = 1; j <= 11; j ++ )
            {
                if(table[i][j] == ch
                   && table[i + 1][j + 1] == ch
                   && table[i + 2][j + 2] == ch
                   && table[i + 3][j + 3] == ch
                   && table[i + 4][j + 4] == ch)
                {
                    flag = true;
                    break;
                }
            }
        //副对角线及平行
        for(int i = 1; i <= 11; i ++ )
            for(int j = 5; j <= 15; j ++ )
            {
                if(table[i][j] == ch
                   && table[i + 1][j - 1] == ch
                   && table[i + 2][j - 2] == ch
                   && table[i + 3][j - 3] == ch
                   && table[i + 4][j - 4] == ch)
                {
                    flag = true;
                    break;
                }
            }

        if(flag)
        {
            over = true;
            if(ch == black_chess) winner = 0;
            else winner = 1;
        }
    }

    void play(char ch,int x, int y)
    {
        //是否落在棋盘内
        if(x <= 15 && x >= 1 && y <= 15 && y >= 1)
        {
            if(table[x][y] != '0')//操作不合法
            {
                hefa = false;
                if(ch == black) state = 0;
                else state = 1;
            }
            else//操作合法
            {
                hefa = true;
                if (ch == black)
                {
                    state = 1;
                    table[x][y] = black_chess;
                }
                else
                {
                    state = 0;
                    table[x][y] = white_chess;
                }
            }
        }
        else
        {
            hefa = false;
            if(ch == black) state = 0;
            else state = 1;
        }
        check(black_chess), check(white_chess);
    }

    void print()
    {
        for(int i = 1; i <= 15; i ++ ) {
            for (int j = 1; j <= 15; j++)
                cout << table[i][j] << " ";
            cout << endl;
        }
        if(!over)
        {
            if(state == 0) cout << "黑子继续" << endl;
            else cout << "白子继续" << endl;
        }
        else
        {
            if(winner == 0) cout << "黑子胜" << endl;
            else  cout << "白子胜" << endl;
        }
        cout << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        play_table ta;
        cin >> n;
        while(n -- )
        {
            char ch;
            int x, y;
            cin >> ch >> x >> y;
            if(!ta.getOver())
            {
                ta.play(ch, x, y);
            }
        }
        ta.print();
    }
    return 0;
}
```

### M. 买彩游戏（类和对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Pride
{
public:
    int **caipiao, zhongjiang[7];
    int cnt[3] = {0};
    int num;
    string name;
    Pride()
    {
        cin >> num;
        cin >> name;
        caipiao = new int*[num];
        for(int i = 0; i < num; i ++ ) caipiao[i] = new int[7];
        for(int i = 0; i < num; i ++ )
            for(int j = 0; j < 7; j ++ )
                cin >> caipiao[i][j];

        for(int i = 0; i < 7; i ++ ) cin >> zhongjiang[i];
    }
    void cmp()
    {
        for(int i = 0; i < num; i ++ )
        {
            int count = 0;
            for(int j = 0; j < 7; j ++ )
                if(caipiao[i][j] == zhongjiang[j])
                    count ++ ;

            if(count == 7) cnt[0] ++ ;
            else if(count >= 5) cnt[1] ++ ;
            else if(count >= 2) cnt[2] ++ ;
        }
    }
    void print()
    {
        if(cnt[0] != 0) cout<<"恭喜"<< name <<"中了" << cnt[0] << "注一等奖！"<<endl;
        if(cnt[1] != 0) cout<<"恭喜"<< name <<"中了" << cnt[1] << "注二等奖！"<<endl;
        if(cnt[2] != 0) cout<<"恭喜"<< name <<"中了" << cnt[2] << "注三等奖！"<<endl;
    }
};

int main()
{
    Pride p;
    p.cmp();
    p.print();
    return 0;
}
```

### O. Point\_Array(类+构造+对象数组):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Point
{
public:
    double x, y;
    Point()
    {
        cout << "Constructor." << endl;
        x = 0, y = 0;
    }
    Point(double nx, double ny)
    {
        x = nx, y = ny;
    }
    void SetP(double nx, double ny)
    {
        x = nx, y = ny;
    }
    double getDisTo(const Point &p)
    {
        double a = (p.x - x) * (p.x - x);
        double b = (p.y - y) * (p.y - y);
        double len = sqrt(a + b);
        return len;
    }
    ~Point()
    {
        cout << "Distructor." << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        double a, b;
        Point p[n];
        for(int i = 0; i < n; i ++ )
        {
            cin >> a >> b;
            p[i].SetP(a, b);
        }
        double Max = 0;
        int c = 0, d = 1;
        for(int i = 0; i < n - 1; i ++ )
            for(int j = i + 1; j < n; j ++ )
            {
                if(p[i].getDisTo(p[j]) > Max)
                {
                    Max =  p[i].getDisTo(p[j]);
                    c = i, d = j;
                }
            }

        printf("The longeset distance is %.2lf,between p[%d] and p[%d].\n", Max, c, d);
    }
    return 0;
}
```

### P. 分数类（类与构造）:

```cpp
#include<iostream>
using namespace std;

int gcd(int a, int b)
{
    return b ? gcd(b, a % b) : a;
}

class num
{
private:
    int a, b;
public:
    num()
    {
        a = 0, b = 1;
    }
    num(int na, int nb)
    {
        a = na, b = nb;
    }
    num add(num &n2)
    {
        num n3;
        n3.b = b * n2.b;
        n3.a = a * n2.b + b * n2.a;
        int g = gcd(n3.a, n3.b);
        n3.a /= g;
        n3.b /= g;
        return n3;
    }
    num mul(num &n2)
    {
        num n3;
        n3.a = a * n2.a;
        n3.b = b * n2.b;
        int g = gcd(n3.a, n3.b);
        n3.a /= g;
        n3.b /= g;
        return n3;
    }
    num sub(num &n2)
    {
        {
            num n3;
            n3.b = b * n2.b;
            n3.a = a * n2.b - b * n2.a;
            int g = gcd(n3.a, n3.b);
            n3.a /= g;
            n3.b /= g;
            return n3;
        }
    }
    num div(num &n2)
    {
        num n3;
        n3.a = a * n2.b;
        n3.b = b * n2.a;
        int g = gcd(n3.a, n3.b);
        n3.a /= g;
        n3.b /= g;
        return n3;
    }
    void print()
    {
        if(b < 0) b = -b, a = -a;
        printf("%d/%d\n", a, b);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int a, b;
        scanf("%d/%d", &a, &b);
        num n0(a, b);
        scanf("%d/%d", &a, &b);
        num n1(a, b);
        num n2 = n0.add(n1);
        n2.print();
        n2 = n0.sub(n1);
        n2.print();
        n2 = n0.mul(n1);
        n2.print();
        n2 = n0.div(n1);
        n2.print();
        cout << endl;
    }
    return 0;
}
```

### Point\_Array(类+构造+对象数组):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Point 
{
    double x, y;
public:
    Point()
    {
        cout << "Constructor." << endl;
        x = 0, y = 0;
    }
    Point(double xv, double yv)
    {
        x = xv, y = yv;
    }
    double getX()
    {
        return x;
    }
    double getY()
    {
        return y;
    }
    void setX(double xv)
    {
        x = xv;
    }
    void setY(double yv)
    {
        y = yv;
    }
    void setXY(double x1, double y1)
    {
        x = x1, y = y1;
    }
    double getdisto(Point &P)
    {
        double x1 = x - P.x;
        double y1 = y - P.y;
        double ans = x1 * x1 + y1 * y1;
        return sqrt(ans);
    }
    ~Point()
    {
        cout << "Distructor." << endl;
        x = 0, y = 0;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        Point *p = new Point[n];
        for(int i = 0; i < n; i ++ )
        {
            double a, b;
            cin >> a >> b;
            p[i].setXY(a, b);
        }
        double maxDis = 0;
        int a = 0, b = 0;
        for(int i = 0; i < n - 1; i ++ )
            for(int j = i + 1; j < n; j ++ )
                if(maxDis < p[i].getdisto(p[j]))
                {
                    a = i, b = j;
                    maxDis = p[i].getdisto(p[j]);
                }
        printf("The longeset distance is %.2lf,between p[%d] and p[%d].\n", maxDis, a, b);
        delete[] p;
    }
    return 0;
}
```

### Q. 指针对象（类和对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Stu
{
public:
    string Name, Sex, Id, Xueyuan, PhoneNum;
};

bool cmp(Stu A, Stu B)
{
    return A.Name < B.Name;
}

int main()
{
    int t;
    cin >> t;
    Stu *S = new Stu[t];
    for(int i = 0; i < t; i ++ )
    {
        cin >> S[i].Name >> S[i].Sex >> S[i].Id >> S[i].Xueyuan >> S[i].PhoneNum;
    }
    sort(S, S + t, cmp);
    for(int i = 0; i < t; i ++ ) cout << S[i].Name << endl;
    return 0;
}
```

### R. 对象数组（类和对象）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Stu
{
    string name, Id, sex, xue, phone;
public:
    void get()
    {
        cin >> name >> Id >> sex >> xue >> phone;
    }
    string getName()
    {
        return name;
    }
};

int main()
{
    int t;
    cin >> t;
    Stu s[t];
    for(int i = 0; i < t; i ++ ) s[i].get();
    for(int i = 0; i < t; i ++ ) cout << s[i].getName() << endl;
    return 0;
}
```

### T. 单链表（类与构造）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Node
{
public:
    int data;
    Node *next;
    Node()
    {
        next = NULL;
        data = 0;
    }
    Node(int e)
    {
        next = NULL;
        this -> data = e;
    }
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = NULL;
    }
    void createList(int *value, int n)
    {
        len = n;
        head = new(Node);
        Node *p = head;
        for(int i = 0; i < n; i ++ )
        {
            Node *q = new(Node);
            q -> data = value[i];
            p -> next = q;
            p = p->next;
        }
    }
    void printList()
    {
        Node *p = head;
        int cnt = 0;
        while(p -> next)
        {
            cnt ++ ;
            p = p ->next;
            cout << p->data;
            if(cnt != len) cout << " ";
        }
        cout << endl;
    }
    bool insertNode(int pos, int value)
    {
        int cnt = 0;
        Node *p = head;
        Node *q = new Node(value);
        while(p -> next)
        {
            cnt ++ ;
            p = p->next;
            if(cnt == pos) break;
        }
        if(cnt == pos)
        {
            q ->next = p->next;
            p ->next = q;
            len ++ ;
            return true;
        }
        else
        {
            cout << "error" << endl;
            return false;
        }
    }
    bool removeNode(int pos)
    {
        if(pos == 1)
        {
            head = head -> next;
            len -- ;
            return true;
        }
        else
        {
            int cnt = 0;
            Node *p = head -> next;
            while(p -> next)
            {
                cnt ++ ;
                if(cnt == pos - 1) break;
                p = p->next;
            }
            if(cnt == pos - 1)
            {
                len -- ;
                p -> next = p -> next -> next;
                return true;
            }
            else
            {
                cout << "error" << endl;
                return false;
            }
        }
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int *a, n;
        cin >> n;
        a = new int[n];
        for(int i = 0; i < n; i ++ ) cin >> a[i];
        List l;
        l.createList(a, n);
        l.printList();
        int m, pos, val;
        cin >> m;
        while(m -- )
        {
            cin >> pos >> val;
            bool flag = l.insertNode(pos, val);
            if(flag) l.printList();
        }
        cin >> m;
        while(m -- )
        {
            cin >> pos;
            bool flag = l.removeNode(pos);
            if(flag) l.printList();
        }
    }
    return 0;
}
```

### U. 生日打折（复合类构造）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Date
{
public:
    int year, month, day;
    Date(int y, int m, int d)
    {
        year = y, month = m, day = d;
    }

    Date() {
        year = 0, month = 0, day = 0;
    }

};

class VIP
{
    int Id;
    Date birth;
    double Discount[2] = {0.95, 0.5};
public:
    VIP(int id, Date date)
    {
        Id = id, birth = date;
    }

    double dis(Date &d)
    {
        if(d.month == birth.month && d.day == birth.day) return Discount[1];
        else return Discount[0];
    }
};

int main()
{
    int y, m, d;
    cin >> y >> m >> d;
    Date today(y, m, d);
    int t;
    cin >> t;
    while(t -- )
    {
        int Id;
        cin >> Id >> y >> m >> d;
        Date birth(y, m, d);
        VIP cus(Id, birth);
        double price;
        cin >> price;
        int num = int(price * cus.dis(today));
        cout << Id << "'s consumption is " << num << endl;
    }
    return 0;
}
```

### V. 找出某个范围内的所有素数(构造与析构):

```cpp
#include<bits/stdc++.h>
using namespace std;

class CSieve
{
private:
    bool *p_sieve;//��������,��¼��Ӧ�±��������Ƿ�Ϊ����
    //����Ŀ˵�Ĳ�һ��, �ҵ���0Ϊ������1Ϊ������
    unsigned long num;//��Χ
    unsigned long cnt = 0;//����
public:
    CSieve(unsigned long n)//����ɸ��
    {
        num = n;
        p_sieve = new bool[num + 1];
        for(int i = 2; i <= num; i ++)
            if(!p_sieve[i])//���i������
                for(int j = i + i; j <= num; j += i)//�ų������Χ������i�ı���
                    p_sieve[j] = true;

        for(int i = 2; i <= num; i ++ )
            if(!p_sieve[i]) cnt ++ ;//��¼�м�������
    }
    void printPrime()
    {
        //�������
        int count = 0;
        for(int i = 2; i < num + 1; i ++ )
            if(p_sieve[i] == false)
            {
                cout << i;
                count ++ ;
                if(count == cnt) cout << endl;
                else cout << " ";
            }
    }
    ~CSieve()
    {
        num = 0;
        delete[] p_sieve;
        p_sieve = NULL;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        CSieve s(n);
        s.printPrime();
    }
    return 0;
}
```

### W. 任意鸡任意钱问题(构造与析构):

```cpp
#include<bits/stdc++.h>
using namespace std;

class chick
{
public:
    int num0, num1, num2;
    chick(int n0, int n1, int n2)
    {
        num0 = n0, num1 = n1, num2 = n2;
    }
};

class problem
{
public:
    int chi, money;
    vector<chick> Solution;
    void slove()
    {
        for(int i = 1; i <= chi; i ++ )
            for(int j = 1; j <= chi; j ++ )
                for(int k = 1; k <= chi; k ++ )
                    if(i * 5 + j * 3 + k / 3 == money && i + j + k == chi && k % 3 == 0)
                    {
                        chick c(i, j , k);
                        Solution.push_back(c);
                    }
    }
    void print()
    {
        cout << Solution.size() << endl;
        vector<chick>::iterator it;
        for(it = Solution.begin(); it != Solution.end(); it ++ )
        {
            cout << it->num0 << " " << it->num1 << " " << it->num2 << endl;
        }
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        problem a;
        cin >> a.chi >> a.money;
        a.slove();
        a.print();
    }
    return 0;
}
```

### X. Date(类与构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Date
{
public:
    int year, month, day;
    int days[13] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 29};
    Date(int y, int m, int d)
    {
        year = y;
        month = m;
        day = d;
    }
    bool isRun()
    {
        if((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
            return true;
        return false;
    }
    void ope()
    {
        if(isRun() && month == 2) days[1] = 29;
        if(day > days[month - 1])
        {
            day %= days[month - 1];
            month ++ ;
        }
        if(month > 12)
        {
            month %= 12;
            year ++ ;
        }
    }
    void print()
    {
        ope();
        printf("Today is %04d/%02d/%02d\n", year, month, day);
        day ++;
        ope();
        printf("Tomorrow is %04d/%02d/%02d\n", year, month, day);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int a, b, c;
        cin >> a >> b >> c;
        Date date(a, b, c);
        date.print();
    }
    return 0;
}
```

### X的放大与缩小（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class XGraph
{
    int n;
public:
    XGraph(int n):n(n){}
    friend ostream& operator << (ostream& ot,const XGraph& xGraph)
    {
        for(int i = 0; i < (xGraph.n + 1)/ 2; i ++ )
        {
            for(int j = 0; j < xGraph.n - i; j ++ )
                if(j >= i) cout << "X";
                else cout << " ";
            cout << endl;
        }
        for(int i = (xGraph.n - 1)/ 2 - 1; i >= 0; i -- )
        {
            for(int j = 0; j < xGraph.n - i; j ++ )
                if(j >= i) cout << "X";
                else cout << " ";
            cout << endl;
        }
        return ot;
    }
    friend XGraph& operator ++(XGraph& xGraph)
    {
        if(xGraph.n != 21) xGraph.n += 2;
        return xGraph;
    }
    friend XGraph operator ++(XGraph& xGraph, int)
    {
        XGraph x1(xGraph.n);
        if(xGraph.n != 21) xGraph.n += 2;
        return x1;
    }
    friend XGraph operator --(XGraph& xGraph)
    {
        if(xGraph.n != 1) xGraph.n -= 2;
        return xGraph;
    }
    friend XGraph operator --(XGraph& xGraph, int)
    {
        XGraph x1(xGraph.n);
        if(xGraph.n != 1) xGraph.n -= 2;
        return x1;
    }
};

int main()
{
    int t, n;
    string cmd;
    cin >> n;
    XGraph xGraph(n);

    cin >> t;
    while(t -- )
    {
        cin >> cmd;
        if(cmd == "show++")
            cout << xGraph ++ << endl;
        else if(cmd == "++show")
            cout << ++ xGraph << endl;
        else if(cmd == "show--")
            cout << xGraph -- << endl;
        else if(cmd == "--show")
            cout << -- xGraph << endl;
        else if(cmd == "show")
            cout << xGraph << endl;
    }
    return 0;
}
```

### Y. Point(类与构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class Point
{
    double x, y;
public:
    Point(double x1, double y1)
    {
        x = x1, y = y1;
    }
    double distance(Point &p1)
    {
        double a = (p1.x - x) * (p1.x - x);
        double b = (p1.y - y) * (p1.y - y);
        double len = sqrt(a + b);
        return len;
    }
    double getX()
    {
        return x;
    }
    double getY()
    {
        return y;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        double a, b, c, d;
        cin >> a >> b >> c >> d;
        Point p1(a, b), p2(c, d);
        double len = p1.distance(p2);
        printf("Distance of Point(%.2lf,%.2lf) to Point"
               "(%.2lf,%.2lf) is %.2lf\n", p1.getX(), p1.getY(),
               p2.getX(), p2.getY(), len);
    }
    return 0;
}
```

### Z. 最长雪道计算(构造与析构）:

```cpp
#include<bits/stdc++.h>
using namespace std;

int dx[4] = {-1, 0, 1, 0};//偏移量
int dy[4] = {0, 1, 0, -1};//偏移量

class Csnow
{
    int n;
    int **high;//记录高度
    int **state;//记录从该点出发的最长路径
    int path[100];//记录路径
    int path_len;//记录最长路径长度
    int now_len;//记录当前路径长度
public:
    Csnow()//初始化
    {
        cin >> n;
        high = new int *[n + 1];
        state = new int *[n + 1];
        for(int i = 0; i < n + 1; i ++ )
        {
            high[i] = new int[n + 1];
            state[i] = new int[n  + 1];
        }

        for(int i = 1; i <= n; i ++ )
            for(int j = 1; j <= n; j ++ )
            {
                cin >> high[i][j];
                state[i][j] = -1;
            }

        memset(path, 0, sizeof path);
    }

    int dp(int x, int y)
    {
        int &v = state[x][y];
        if(v != -1) return v;

        v = 1;
        for(int i = 0; i < 4; i ++ )
        {
            int a = x + dx[i], b = y + dy[i];
            if(a >= 1 && a <= n && b >= 1 && b <= n && high[a][b] < high[x][y])
                v = max(v, dp(a, b) + 1);
        }

        return v;
    }

    void getPath(int x, int y)
    {
        for(int i = 0; i < 4; i ++ )
        {
            int a = x + dx[i], b = y + dy[i];
            if(a >= 1 && a <= n && b >= 1 && b <= n && high[x][y] > high[a][b] && state[a][b] == path_len)
            {
                now_len ++ ;
                path[now_len] = high[a][b];

                path_len -- ;
                getPath(a, b);
            }
        }
    }

    void get()
    {
        for(int i = 1; i <= n; i ++ )
            for(int j = 1; j <= n; j ++ )
                state[i][j] = dp(i, j);

        int res = 0, x = 0, y = 0;
        for(int i = 1; i <= n; i ++ )
            for(int j = 1; j <= n; j ++ )
                if(res < dp(i, j))
                {
                    res = dp(i, j);
                    x = i, y = j;
                }

        printf("%d\n", res);

        path[0] = high[x][y];
        path_len = res - 1;

        now_len = 0;
        getPath(x, y);

        for(int i = 0; path[i] != 0; i ++ )
            cout << path[i] << "-";

        cout << endl;
    }

    ~Csnow()
    {
        for(int i = 0; i < n; i ++ )
        {
            delete[] high[i];
            delete[] state[i];
        }
        delete[] high;
        delete[] state;
    }
};

int main()
{
    Csnow snow;
    snow.get();

    return 0;
}
```

### [. 那天是星期几(构造):

```cpp
#include<bits/stdc++.h>
using namespace std;

class CDate
{
    string we[7] = {
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
    };
public:
    void get();
    void print();
    void getWeekofDay();
private:
    int month;
    int day;
    int year;
    int week;
};

void CDate::print() {
    printf("%d/%d/%d, ", month, day, year);
    cout << we[week]<< endl;
}

void CDate::getWeekofDay() {
    bool flag = 0;
    if(month == 1 || month == 2)
    {
        flag = 1;
        month += 12, year -= 1;
    }
    week =  (day + 2*month + 3*(month+1)/5 + year + year/4 - year/100 + year/400) % 7 + 1;
    if(flag)
    {
        month -= 12, year += 1;
    }
}

void CDate::get() {
    cin >> year >> month >> day;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        CDate date;
        date.get();
        date.getWeekofDay();
        date.print();
    }
    return 0;
}
```

### 单链表(结构):

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
public:
    Node():next(NULL){}
    Node(int e):data(e), next(NULL){}
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        head = new Node;
        len = 0;
    }

    void CreateList(int n, int *data)
    {
        while(n -- )
        {
            Node *p = head;
            int i;
            for(i = 0; i < len; i ++ )
                p = p -> next;

            Node *q = new Node(data[i]);
            p -> next = q;
            len ++ ;
        }
    }

    bool Insert(int pos, int e)
    {
        if(pos < 1 || pos > len + 1) return false;
        Node *p = head;
        for(int i = 1; i < pos; i ++ )
            p = p -> next;

        Node *q = new Node(e);
        q -> next = p -> next;
        p -> next = q;
        len ++ ;

        return true;
    }

    bool Del(int pos)
    {
        if(pos < 1 || pos > len) return false;
        Node *p = head;
        for(int i = 1; i < pos; i ++ )
            p = p -> next;

        Node *q = p -> next;
        p -> next = q -> next;
        delete q;

        len -- ;
        return true;
    }

    void Display()
    {
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data;
            if(p -> next) cout << " ";
            else cout << endl;
            p = p -> next;
        }
    }

    ~List()
    {
        Node *p = head -> next;
        while(p -> next)
        {
            Node *q = p;
            p = p -> next;
            delete q;
        }
        head -> next = NULL;
        len = 0;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        int data[n];
        for(int i = 0; i < n; i ++ ) cin >> data[i];
        List list;
        list.CreateList(n, data);
        list.Display();

        int m, e, pos;
        cin >> m;
        while(m -- )
        {
            cin >> pos >> e;
            if(list.Insert(pos, e)) list.Display();
            else cout << "error" << endl;
        }

        cin >> m;
        while(m -- )
        {
            cin >> pos;
            if(list.Del(pos)) list.Display();
            else cout << "error" << endl;
        }
    }
}
```

### 点和圆(类与对象):

```cpp
#include<iostream>
using namespace std;

class Point{
    int m_x;
    int m_y;
public:
    void setPoint(int x, int y){
        this->m_x = x;
        this->m_y = y;
    }
    int getX(){
        return m_x;
    }
    int getY(){
        return m_y;
    }
};
class Circle{
    int m_x;
    int m_y;
    int m_r;
public:
    void SetCenter(int x, int y){
        this->m_x = x;
        this->m_y = y;
    }
    void SetRadius(int r){
        this -> m_r =r;
    }
    double getArea(){
        return 3.14*m_r*m_r;
    }
    double getLength(){
        return 2*3.14*m_r;
    }
    int getX(){
        return m_x;
    }
    int getY(){
        return m_y;
    }
    int getR(){
        return m_r;
    }
};

int main(){
    int x1, y1, r, x2, y2;
    Circle ci;
    Point po;
    cin >> x1 >> y1 >> r;
    ci.SetCenter(x1,y1);
    ci.SetRadius(r);
    cin >> x2 >> y2;
    po.setPoint(x2,y2);
    cout << ci.getArea() << " " << ci.getLength() << endl;
    double len = (ci.getX()-po.getX())*(ci.getX()-po.getX())+
            (ci.getY()-po.getY())*(ci.getY()-po.getY());
    if( len<= (ci.getR()*ci.getR())){
        cout << "yes" << endl;
    }else{
        cout << "no" << endl;
    }

    return 0;
}
```

### 单词统计(string):

```cpp
#include<bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;
    getchar();
    while(t -- )
    {
        int cnt = 0;
        string line, word;
        getline(cin, line);
        stringstream ss(line);
        while(ss >> word) cnt ++ ;
        cout << cnt << endl;
    }
}
```

### 时钟模拟(继承）:

```cpp
#include<iostream>
using namespace std;

class Counter
{
protected:
    int value;
public:
    void Incre()
    {
        value += 1;
    }
};

class Cycle_Counter : public Counter
{
protected:
    int min_value, max_value;
public:
    Cycle_Counter() {}
    Cycle_Counter(int Min, int Max, int va)
    {
        min_value = Min;
        max_value = Max;
        value = va;
    }
    bool Incre()
    {
        bool flag;
//        value = (value + 1) % max_value + min_value;
        if(value == max_value - 1)
        {
            value = (value + 1) % max_value + min_value;
            flag = true;
        }
        else
        {
            value += 1;
            flag = false;
        }
        return flag;
    }
    int getValue()
    {
        return value;
    }
};

class Bell
{
    Cycle_Counter *hour, *minute, *second;
public:
    Bell(int h, int m, int s)
    {
        hour = new Cycle_Counter(0, 24, h);
        minute = new Cycle_Counter(0, 60, m);
        second = new Cycle_Counter(0, 60, s);
    }
    void Time()
    {
        int add_num;
        cin >> add_num;
        while(add_num -- )
        {
            bool flag = second -> Incre();
            if(flag) flag = minute -> Incre();
            if(flag) hour -> Incre();
        }
        printf("%d:%d:%d\n", hour->getValue(), minute->getValue(), second->getValue());
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int hour, minute, second;
        cin >> hour >> minute >> second;
        Bell be(hour, minute, second);
        be.Time();
    }
    return 0;
}
```

### 线段相交----结构体:

```cpp
#include<iostream>
using namespace std;

struct point
{
    int x, y;
};

struct line
{
    point a, b;
    double k = 0, c = 0;
    int x1 = 0, x2 = 0;
    void ope()
    {
        k = (a.y - b.y) / (a.x - b.x);
        c = a.y - (k * a.x);
        x1 = min(a.x, b.x);
        x2 = max(a.x, b.x);
    }
};

int main()
{
    int t;
    cin >> t;
    
    while(t -- )
    {
        line l1, l2;
    
        cin >> l1.a.x >> l1.a.y >> l1.b.x >> l1.b.y;
        cin >> l2.a.x >> l2.a.y >> l2.b.x >> l2.b.y;

        l1.ope(), l2.ope();
        double x0 = (l2.c - l1.c) / (l1.k - l2.k);
        int x1 = max(l1.x1, l2.x1), x2 = min(l1.x2, l2.x2);
        
        if(l1.k != l2.k && x0 <= x2 && x0 >= x1) 
            cout << "intersect" << endl;
        else cout << "disjoint" << endl;
    }
    return 0;
}
```

### 正话反说:

```cpp
#include<bits/stdc++.h>
#include<cstdio>
using namespace std;

int main()
{
    int t;
    cin >> t;
    getchar();
    while(t -- )
    {
        int cnt = 0;
        string sentence;
        string str[1000];
        getline(cin, sentence);
        stringstream word(sentence);
        string wor;
        while(word >> wor) str[cnt ++ ] = wor;
        while(cnt)
        {
            cout << str[ -- cnt];
            if(cnt == 0) cout << endl;
            else cout << " ";
        }
    }
    return 0;
}
```

### 新旧身份证(继承):

```cpp
#include<iostream>
#include<string>

using namespace std;

class Date
{
protected:
    int year, month, day;
public:
    Date(int y,int m,int d):year(y), month(m), day(d){}

    bool check() //检验日期是否合法
    {
        int monthDay[] = { 31,isLeap() ? 29 : 28,31,30,31,30,31,31,30,31,30,31 };
        if (day < 0 || year < 0 || month < 0 || year > 2015 || month > 12 || day > monthDay[month - 1]) return false;
        return true;
    }

    bool isLeap()
    {
        return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0);
    }

    int getY(){ return year;}
    int getM(){ return month;}
    int getD(){ return day;}

    void print()
    {
        printf("%d年%d月%d日", year, month, day);
    }
};

class OldID
{
protected:
    string id15, name;  //15位身份证号码，姓名
    Date birthday;      //出生日期
public:
    OldID(string id, string na, int y, int m, int d):id15(id), name(na), birthday(y, m, d){}

    bool check()        //验证15位身份证是否合法
    {
        if(id15.size() != 15) return false;

        for(char i : id15) if(i < '0' || i > '9') return false;

        if(!birthday.check()) return false;

        string d;
        for(int i = 6, j = 0; j < 6; i ++ , j ++ ) d += id15[i];
        int a = stoi(d);
        int b = birthday.getY() % 100 * 10000;
        b += birthday.getM() * 100 + birthday.getD();
        if(a != b) return false;

        return true;
    }

    void print()
    {
        cout << name << endl;
    }
};

class NewID:public OldID
{
private:
    string id18;
    Date issueday;
    int validay;
public:
    NewID(string name, int y1, int m1, int d1,string id1, string id2, int y2, int m2, int d2, int v):OldID(id1,name,y1,m1,d1), id18(id2),issueday(y2,m2,d2),validay(v){}

    bool check()
    {
        int a[17]={7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
        int sum = 0, mod;
        for(int j = 0; j < 17; j ++ ) sum += (id18[j] - '0') * a[j];
        mod = sum % 11;
        char ch[] = {'1','0','X','9','8','7','6','5','4','3','2'};
        if(id18[17] != ch[mod]) return false;

        int red, idd;
        string d;
        red = birthday.getY() * 10000 + birthday.getM() * 100 + birthday.getD();
        for(int i = 6, j = 0; j < 8; i ++ , j ++ ) d += id18[i];
        idd = stoi(d);
        if(idd != red) return false;

        if(!issueday.check()) return false;
        if(birthday.getY() + validay < issueday.getY()) return false;
        for(int j = 0; j < 6; j ++ ) if(id15[j] != id18[j]) return false;
        for(int i = 14, j = 12; i < 17; i ++ , j ++ ) if(id15[j] != id18[i]) return false;

        return true;
    }

    void print()
    {
        cout << id18 << " ";
        issueday.print();
        if(validay != 100) cout << " " << validay << "年" << endl;
        else cout << " 长期" << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    string name, id15, id18;
    int y1,m1,d1,y2,m2,d2,v;
    for(int i = 0; i < t; i ++ )
    {
        cin >> name >> y1 >> m1 >> d1 >> id15 >> id18 >> y2 >> m2 >> d2 >> v;
        NewID nid(name, y1, m1, d1, id15, id18, y2, m2, d2, v);
        nid.OldID::print();
        if(nid.OldID::check() && nid.check()) nid.print();
        else cout << "illegal id" << endl;
    }
    return 0;
}
```

### 简单类模板(类模板):

```cpp
#include<iostream>
#include<vector>
#include<cstring>
using namespace std;

template<class T>
class Num
{
    T data[100];
    int len;
public:
    Num():len(0)
    {
        memset(data, -1, sizeof data);
    }

    Num(int n, T *d):len(n)
    {
        memset(data, -1, sizeof data);
        for(int i = 0; i < len; i ++ )
            data[i] = d[i];
    }

    void insert(int pos, T e)
    {
        for(int i = len; i > pos; i -- )
            data[i] = data[i - 1];
        data[pos] = e;
        len ++ ;
    }

    void Del(int pos)
    {
        for(int i = pos; i < len; i ++ )
            data[i] = data[i + 1];
        len -- ;
    }

    void Dis()
    {
        for(int i = 0; i < len; i ++ )
        {
            cout << data[i];
            if(i == len - 1) cout << endl;
            else cout << " ";
        }
    }
};

int main()
{
    int t, pos;
    int ie;

    cin >> t;
    int *datai = new int[t];
    for(int i = 0; i < t; i ++ ) cin >> datai[i];
    Num<int> numi(t, datai);
    cin >> pos >> ie;
    numi.insert(pos, ie);
//    numi.Dis();
    cin >> pos;
    numi.Del(pos);
    numi.Dis();

    double de;
    cin >> t;
    double *datad = new double[t];
    for(int i = 0; i < t; i ++ ) cin >> datad[i];
    Num<double> numd(t, datad);
    cin >> pos >> de;
    numd.insert(pos, de);
//    numd.Dis();
    cin >> pos;
    numd.Del(pos);
    numd.Dis();
}
```

### 商旅信用卡(多重继承):

```cpp
#include<iostream>
using namespace std;

class Member
{
protected:
    string MID;
    int MInte;
public:
    Member():MInte(0){}
    Member(string id, int Inte):MID(id), MInte(Inte){}
};

class CreCard
{
protected:
    string CID, name;
    int Limit, CInte;
    float price;
public:
    CreCard():Limit(0), CInte(0), price(0){}
    CreCard(string id, string n, int m, int c, float p):CID(id), name(n), Limit(m), CInte(c), price(p){}
};

class MemCard :virtual public CreCard,virtual public Member
{
    string ID;
public:
    MemCard(){}
    MemCard(string MId, string CId, string name, float p):Member(MId, 0), CreCard(CId, name, p, 0, 0){}
    void opeO(float n)
    {
        price += n;
        MInte += n;
        CInte += n;
    }
    
    void opeC(float p)
    {
        if(p + price > Limit) return;
        price += p;
    }
    
    void opeQ(float p)
    {
        if(price - p < 0) price = 0;
        else price -= p;
        if(CInte - p < 0) CInte = 0;
        else CInte -= p;
    }

    void opeT(int m)
    {
        MInte += m * 0.5;
    }

    void Dis()
    {
        cout << MID << " " << MInte << endl;
        cout << CID << " " << name << " " << price << " " << CInte << endl;
    }
};

int main()
{
    string Cid, Mid, name;
    float price;
    cin >> Mid >> Cid >> name >> price;
    MemCard m1(Mid, Cid, name, price);
    int t;
    cin >> t;
    char ope;
    while(t -- )
    {
        cin >> ope;
        float b, a;
        switch (ope) {
            case 'o':
                cin >> a;
                m1.opeO(a);
                break;
            case 'c':
                cin >> b;
                m1.opeC(b);
                break;
            case 'q':
                cin >> b;
                m1.opeQ(b);
                break;
            case 't':
                cin >> a;
                m1.opeT(a);
                break;
        }
    }
    m1.Dis();
}
```

### 字符串合并(指针与函数）:

```cpp
#include<iostream>
#include<cstring>
using namespace std;

char *strAdd(char *s1, char *s2)
{
    int len1 = strlen(s1), len2 = strlen(s2);
    
    char *s3 = new char[len1 + len2 + 1];
    
    for(int i = 0; i < len1; i ++ )
        *(s3 + i) = s1[i];

    for(int i = len1, j = 0; i < len1 + len2 + 1; j ++, i ++ )
        *(s3 + i) = s2[j];

    return s3;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char ch1[100], ch2[100];
        cin >> ch1;
        cin >> ch2;

        char *ch3 = strAdd(ch1, ch2);

        cout << ch1 << " " << ch2 << " " << ch3 << endl;
    }
    return 0;
}
```

### 母牛生小牛(静态数据成员与静态成员函数):

```cpp
#include<iostream>
#include<cstring>
using namespace std;

class Cow
{
	static int num[41];
	static int year[41];
public:
	
	static void Num(int n)
	{
		year[1] = 1;
		for(int i = 1; i < n; i ++ )
		{
			for(int j = 40; j >= 1; j -- )
				year[j] = year[j - 1];

			for(int j = 4; j <= 40; j ++ )
				year[1] += year[j];
		}

		int sum = 0;
		for(int i = 1; i <= 40; i ++ ) sum += year[i];
		num[n] = sum;
		memset(year, 0, sizeof year);
	}

	static int getNum(int n)
	{
		return num[n];
	}
};

int Cow::num[41] = {0};
int Cow::year[41] = {0};

int main()
{
	int t;
	cin >> t;
	for(int i = 1; i <= 30; i ++ ) Cow::Num(i);
	while(t -- )
	{
		int n;
		cin >> n;
		int num = Cow::getNum(n);
		cout << num << endl;
	}
	return 0;
}
```

### 链表类模板:

```cpp
#include<iostream>
using namespace std;

template<class T>
class Node
{
public:
    T data;
    Node* next;
    Node():next(NULL){}
    Node(T e):data(e), next(NULL){}
};

template<class T>
class List
{
    Node<T> *head;
    int len;
public:
    List()
    {
        head = new Node<T>;
        len = 0;
    }

    void CreateList(int n, T* data)
    {
        for(int k = 0; k < n; k ++ )
        {
            Node<T>* p = head;
            for(int i = 0; i < len; i ++ )
                p = p -> next;
            Node<T> *q = new Node<T>(data[k]);
            p -> next = q;
            len ++ ;
        }
    }

    void append(T e)
    {
        Node<T>* p = head;
        while(p -> next) p = p -> next;
        Node<T>* q = new Node<T>(e);
        p -> next = q;
    }

    bool remove(int n)
    {
        if(n < 0 || n > len) return false;
        Node<T>* p = head;
        for(int i = 1; i < n; i ++ ) p = p -> next;
        p -> next = p -> next -> next;
        return true;
    }

    void insert(T a, int n)
    {
        if(n < 0 || n > len + 1) return;

        Node<T>* p = head;
        for(int i = 0; i < n; i ++ ) p = p -> next;

        Node<T>* q = new Node<T>(a);
        q -> next = p -> next;
        p -> next = q;
    }

    void get(int n)
    {
        if(n < 1 || n > len)
        {
            cout << "error" << endl;
            return;
        }

        Node<T>* p = head -> next;
        for(int i = 1; i < n; i ++ ) p = p -> next;
        cout << p -> data << endl;
    }

    void reset(int pos, T e)
    {
        Node<T>* p = head -> next;
        for(int i = 1; i < pos; i ++ ) p = p -> next;
        p -> data = e;
    }

    void Dis()
    {
        Node<T>* p = head -> next;
        while(p)
        {
            cout << p -> data;
            if(p -> next) cout << " ";
            else cout << endl;
            p = p -> next;
        }
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *b = new int[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];

            List<int> list;
            list.CreateList(n, b);
            int e, pos;
            cin >> pos >> e;
            list.insert(e, pos);
            cin >> pos;
            list.get(pos);
            cin >> pos;
            list.remove(pos);
            cin >> pos >> e;
            list.reset(pos, e);
            list.Dis();
        }
        else if(type == 'D')
        {
            double *b = new double[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];

            List<double> list;
            list.CreateList(n, b);
            int pos;
            double e;
            cin >> pos >> e;
            list.insert(e, pos);
            cin >> pos;
            list.get(pos);
            cin >> pos;
            list.remove(pos);
            cin >> pos >> e;
            list.reset(pos, e);
            list.Dis();
        }
        else if(type == 'S')
        {
            string *b = new string[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];

            List<string> list;
            list.CreateList(n, b);
            int pos;
            string e;
            cin >> pos >> e;
            list.insert(e, pos);
            cin >> pos;
            list.get(pos);
            cin >> pos;
            list.remove(pos);
            cin >> pos >> e;
            list.reset(pos, e);
            list.Dis();
        }
    }
}
```

### 分数四则运算(结构):

```cpp
#include<iostream>
using namespace std;

int gcd(int a, int b)
{
    return b ? gcd(b, a % b) : a;
}

struct num
{
    int a = 0, b = 0;
};

num add(num n1, num n2)
{
    num n3;
    n3.b = n1.b * n2.b;
    n3.a = n1.a * n2.b + n1.b * n2.a;
    int g = gcd(n3.a, n3.b);
    n3.a /= g;
    n3.b /= g;
    return n3;
}

num sub(num n1, num n2)
{
    num n3;
    n3.b = n1.b * n2.b;
    n3.a = n1.a * n2.b - n1.b * n2.a;
    int g = gcd(n3.a, n3.b);
    n3.a /= g;
    n3.b /= g;
    return n3;
}

num mul(num n1, num n2)
{
    num n3;
    n3.a = n1.a * n2.a;
    n3.b = n1.b * n2.b;
    int g = gcd(n3.a, n3.b);
    n3.a /= g;
    n3.b /= g;
    return n3;
}

num div(num n1, num n2)
{
    num n3;
    n3.a = n1.a * n2.b;
    n3.b = n1.b * n2.a;
    int g = gcd(n3.a, n3.b);
    n3.a /= g;
    n3.b /= g;
    return n3;
}

void print(num n)
{
    if(n.b < 0) n.b = -n.b, n.a = -n.a;
    printf("%d/%d\n", n.a, n.b);
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        num n1, n2;
        scanf("%d/%d", &n1.a, &n1.b);
        scanf("%d/%d", &n2.a, &n2.b);
        print(add(n1, n2));
        print(sub(n1, n2));
        print(mul(n1, n2));
        print(div(n1, n2));
        puts("");
    }
    return 0;
}
```

### 判断点线位置(结构):

```cpp
#include<iostream>
using namespace std;

struct point
{
    int x, y;
};

struct line
{
    int x, y;
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        point a, b, c;
        line l1, l2;
        cin >> a.x >> a.y;
        cin >> b.x >> b.y;
        cin >> c.x >> c.y;
        l1.x = b.x - a.x, l2.x = c.x - a.x;
        l1.y = b.y - a.y, l2.y = c.y - a.y;
        int res = l1.x * l2.y - l1.y * l2.x;
        if(res == 0) cout << "intersect" << endl;
        else if(res < 0) cout << "clockwise" << endl;
        else cout << "anti clockwise" << endl;
    }
    return 0;
}
```

### 单链表的创建(结构体+链表):

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
    Node():next(NULL){}
    Node(int e):data(e), next(NULL){}
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }
    void insert(int e)
    {
        len ++ ;
        Node *p = head;
        while(p -> next)
        {
            p = p -> next;
        }
        Node *q = new Node(e);
        p -> next = q;
    }

    bool find(int e)
    {
        Node *p = head -> next;
        while(p)
        {
            if(p -> data == e) return true;
            p = p -> next;
        }
        return false;
    }

    void Display()
    {
        cout << len << ' ';
        Node *p = head -> next;
        while(p)
        {
            cout << p->data << " ";
            p = p -> next;
        }
    }

    ~List()
    {
        Node *p = head -> next;
        if(p)
        {
            Node *q = p;
            p = p -> next;
            delete q;
        }
        head -> next = NULL;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        List list;
        int e, n;
        cin >> n;
        cin >> e;
        list.insert(e);
        for(int i = 0; i < n - 1; i ++ )
        {
            cin >> e;
            if(!list.find(e)) list.insert(e);
        }
        list.Display();
    }
    return 0;
}
```

### 单链表的删除(结构体+链表):

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
    Node():next(NULL){}
    Node(int e):data(e), next(NULL){}
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }

    void insert(int e)
    {
        len ++ ;
        Node *q = new Node(e);
        Node *p = head;
        while(p -> next)
        {
            p = p -> next;
        }
        p -> next = q;
    }

    bool del(int pos)
    {
        if(pos < 1 || pos > len) return false;
        len -- ;
        Node *p = head;
        for(int i = 1; i < pos; i ++ )
        {
            p = p -> next;
        }
        Node *q = p -> next;
        p -> next = q -> next;
        delete q;
        return true;
    }

    void Display()
    {
        cout << len << " ";
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data;
            if(p -> next) cout << " ";
            else cout << endl;
            p = p -> next;
        }
    }

    ~List()
    {
        Node *p = head -> next;
        while(p -> next)
        {
            Node *q = p;
            p = p -> next;
            delete q;
        }
        head -> next = NULL;
    }
};

int main()
{
    int n, e;
    List list;
    cin >> n;
    cin >> e;
    list.insert(e);
    for(int i = 0; i < n - 1; i ++ )
    {
        cin >> e;
        list.insert(e);
    }
    list.Display();

    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        cin >> e;
        if(list.del(e)) list.Display();
        else cout << "error" << endl;
    }
    return 0;
}
```

### 单链表的插入(结构体+链表):

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
    Node():next(NULL){}
    Node(int e):data(e), next(NULL){}
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }
    
    bool insert(int pos, int e)
    {
        if(pos < 1 || pos > len + 1) return false;
        len ++ ;
        Node *q = new Node(e);
        Node *p = head;
        for(int i = 1; i < pos; i ++ )
            p = p -> next;
            
        q -> next = p -> next;
        p -> next = q;
        return true;
    }

    void Display()
    {
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data;
            if(p -> next) cout << " ";
            else cout << endl;
            p = p -> next;
        }
    }

    ~List()
    {
        len = 0;
        Node *p = head -> next;
        while(p -> next)
        {
            Node *q = p;
            p = p -> next;
            delete q;
        }
        head -> next = NULL;
    }
};

int main()
{
    List list;
    int n;
    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        int pos, e;
        cin >> pos >> e;
        if(list.insert(pos, e)) list.Display();
        else cout << "error" << endl;
    }
    return 0;
}
```

### 单链表的查找(结构体+链表):

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
    Node():next(NULL){}
    Node(int e):data(e),next(NULL){}
    friend class List;
public:
    void Output()
    {
        cout << data << endl;
    }
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }

    Node *find(int pos)
    {
        if(pos < 1 || pos > len) return NULL;
        Node *p = head;
        for(int i = 0; i < pos; i ++ )
        {
            p = p -> next;
        }
        return p;
    }

    void insert(int e)
    {
        len ++ ;
        Node *q = new Node(e);
        Node *p = head;
        while(p -> next)
        {
            p = p -> next;
        }
        p -> next = q;
    }

    void Display()
    {
        cout << len << " ";
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data << " ";
            p = p -> next;
        }
        cout << endl;
    }

    ~List()
    {
        Node *p = head -> next;
        while(p -> next)
        {
            Node *q = p;
            p = p -> next;
            delete q;
        }
        head -> next = NULL;
    }
};

int main()
{
    List list;
    int n, e;
    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        cin >> e;
        list.insert(e);
    }
    
    list.Display();
    cin >> n;
    
    for(int i = 0; i < n; i ++ )
    {
        cin >> e;
        Node *p = list.find(e);
        if(p) p -> Output();
        else cout << "error" << endl;
    }
    return 0;
}
```

### 排序函数模板:

```cpp
#include<iostream>
using namespace std;

class Point
{
    double x, y, dis;
public:
    Point(){}
    void getDis(){ dis = x * x + y * y;}

    friend ostream& operator << (ostream& ot, Point& p)
    {
        printf("(%.1lf, %.1lf)", p.x, p.y);
        return ot;
    }

    friend istream& operator >> (istream& in, Point& p)
    {
        in >> p.x >> p.y;
        return in;
    }

    friend bool operator < (const Point& p1, const Point& p2)
    {
        return p1.dis < p2.dis;
    }
};

template<class T>
void mySort(T* a, int n)
{
    for(int i = 0; i < n - 1; i ++ )
        for(int j = n - 1; j > i; j -- )
            if(a[j] < a[i]) swap(a[i], a[j]);
}

template<class T>
void Print(T* a, int n)
{
    for(int i = 0; i < n; i ++ )
        cout << a[i] << " ";
    cout << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *b = new int[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else if(type == 'D')
        {
            double *b = new double[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else if(type == 'C')
        {
            char *b = new char[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else if(type == 'S')
        {
            string *b = new string[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else
        {
            Point *b = new Point[n];
            for(int i = 0; i < n; i ++ )
            {
                cin >> b[i];
                b[i].getDis();
            }
            mySort(b, n);
            Print(b, n);
        }
    }
    return 0;
}
```

### 字符串操作（string）:

```cpp
#include<iostream>
#include<algorithm>
#include<regex>
using namespace std;

int n;
string s[110];

string itos(int x)
{
    if(!x) return "0";
    string res;
    while(x)
    {
        res.push_back(x % 10 + '0');
        x /= 10;
    }
    reverse(res.begin(), res.end());
    return res;
}

string cmd()
{
    string op;
    cin >> op;

    if(op == "over") exit(0);
    else if(op == "copy")
    {
        int N = stoi(cmd());
        int X = stoi(cmd());
        int L = stoi(cmd());
        return s[N].substr(X, L);
    }
    else if(op == "add")
    {
        string S1 = cmd(),S2 = cmd();
        regex rnum("[[:d:]]+");
        if(regex_match(S1,rnum) && regex_match(S2,rnum))
        {
            int n1 = stoi(S1),n2 = stoi(S2);
            return itos(n1 + n2);
        }
        else return S1 + S2;
    }
    else if(op == "find")
    {
        string S = cmd();
        int N = stoi(cmd());
        if(s[N].find(S) == string::npos) return itos(S.size());
        else return itos(s[N].find(S));
    }
    else if(op == "rfind")
    {
        string S = cmd();
        int N = stoi(cmd());
        if(s[N].rfind(S) == string::npos) return itos(S.size());
        else return itos(s[N].rfind(S));
    }
    else if(op == "insert")
    {
        string S = cmd();
        int N = stoi(cmd());
        int X = stoi(cmd());
        s[N].insert(X,S);
        return cmd();
    }
    else if(op == "reset")
    {
        string S = cmd();
        int N = stoi(cmd());
        s[N] = S;
        return cmd();
    }
    else if(op == "print")
    {
        int N = stoi(cmd());
        cout << s[N] << endl;
        return cmd();
    }
    else if(op == "printall")
    {
        for(int i = 1;i <= n;i ++) cout << s[i] << endl;
        return cmd();
    }

    return op;
}

int main()
{
    cin >> n;
    for(int i = 1; i <= n; i ++ ) cin >> s[i];
    while(1)
    {
        cmd();
    }
    return 0;
}
```

### 最贵的书（重载+友元+引用）:

```cpp
#include<iostream>
#include<string>
using namespace std;

class Book
{
    string name, auth, src;
    double price;
public:
    Book(){}
    friend ostream& operator << (ostream& ot, Book& b)
    {
        ot << b.name << endl;
        ot << b.auth << endl;
        printf("%.2lf\n", b.price);
        ot << b.src << endl;
        return ot;
    }
    friend istream& operator >> (istream& in, Book& b)
    {
        int pre, pos;
        string line;
        getline(in, line);
        pos = line.find(",");
        b.name = line.substr(0, pos);

        pre = ++ pos ;
        pos = line.find(",", pre);
        b.auth = line.substr(pre, pos - pre);

        pre = ++ pos ;
        pos = line.find(",", pre);
        string price;
        price = line.substr(pre, pos - pre);
        b.price = atof(price.c_str());
        
        pre = ++ pos ;
        pos = line.find(",", pre);
        b.src = line.substr(pre, pos - pre);
        return in;
    }
    friend void find(Book *book, int n, int &max1,int &max2);
};

void find(Book *book, int n, int &max1,int &max2)
{
    double mp1 = 0, mp2 = 0;
    for(int i = 0; i < n; i ++ )
    {
        if(mp1 < book[i].price)
        {
            mp1 = book[i].price;
            max1 = i;
        }
    }
    for(int i = 0; i < n; i ++ )
    {
        if(mp2 < book[i].price && i != max1)
        {
            mp2 = book[i].price;
            max2 = i;
        }
    }
}

int main()
{
    int t, n;
    cin >> t;
    while(t -- )
    {
        cin >> n;
        int a = 0, b = 0;
        getchar();
        Book *book = new Book[n];
        for(int i = 0; i < n; i ++ ) cin >> book[i];
        find(book, n, a, b);
        cout << book[a] << endl;
        cout << book[b] << endl;
    }
}
```

### 判断矩形是否重叠(结构):

```cpp
#include<iostream>
using namespace std;

struct point
{
    int x = 0, y = 0;
};

struct rect
{
    point a, b;
    int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    void ope() {
        x1 = min(a.x, b.x);
        x2 = max(a.x, b.x);
        y1 = min(a.y, b.y);
        y2 = max(a.y, b.y);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        rect r1, r2;
        int flag = 1;
        cin >> r1.a.x >> r1.a.y >> r1.b.x >> r1.b.y;
        cin >> r2.a.x >> r2.a.y >> r2.b.x >> r2.b.y;
        r1.ope(), r2.ope();

        if((r1.x1 > r2.x2) || (r1.y1 > r2.y2)
        || (r1.x1 > r1.x2) || (r2.y1 > r1.y2))
            flag = 0;

        if(flag == 1) cout << "overlapped" << endl;
        else cout << "not overlapped" << endl;
    }
    return 0;
}
```

### 判断矩形是否重叠(复合类+友元):

```cpp
#include<iostream>
using namespace std;

class Point
{
public:
    Point()
    {
        x = 0, y = 0;
    }
    int x, y;
};

class Rect
{
    Point a, b;
public:
    Rect(Point A, Point B)
    {
        a = A, b = B;
    }
    int x1, x2, y1, y2;
    void ope()
    {
       x1 = min(a.x, b.x);
       x2 = max(a.x, b.x);
       y1 = min(a.y, b.y);
       y2 = max(a.y, b.y);
    }
    friend void cmp(Rect &A, Rect &B);
};

void cmp(Rect &A, Rect &B)
{
    if(A.x1 > B.x2 || A.x2 < B.x1 || A.y1 > B.y2 || A.y2 < B.y1)
    {
        cout << "not overlapped" << endl;
    }else cout << "overlapped" << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Point a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y;
        cin >> c.x >> c.y >> d.x >> d.y;
        Rect r1(a, b), r2(c, d);
        r1.ope(), r2.ope();
        cmp(r1, r2);
    }
    return 0;
}
```

### 计算宝宝帐户收益(多重继承):

```cpp
#include<iostream>
using namespace std;
class CPeople
{
protected:
    string name;
    string id;
public:
    CPeople(){}
    CPeople(string n,string i)
    {
        name = n;
        id = i;
    }
};

class CInternetUser:virtual public CPeople
{
protected:
    string password;
public:
    void registerUser(string n,string i,string p)
    {
        name = n;
        id = i;
        password = p;
    }
};

class CBankCustomer:virtual public CPeople
{
protected:
    double bank_balance;	//银行余额 
public:
    CBankCustomer(){}
    void openAccount(string n,string i)
    {
        name = n;
        id = i;
        bank_balance=0;
    }
    void deposit(double b)
    {
        bank_balance += b;
    }
    bool withdraw(double b)
    {
        if(bank_balance - b >= 0)
        {
            bank_balance -= b;
            return 1;
        }else return 0;
    }
};

class CInternetBankCustomer:virtual public CBankCustomer,virtual public CInternetUser
{
protected:
    double balance; 	//网上银行余额 
    double yesterday_balance;	//昨日余额 
    double today_earnings; //今日收益
    double today_interest; //今日万元收益率 
    double yesterday_interest;	//昨日万元收益率	 
public:
    CInternetBankCustomer()
    {
        balance = 0;
        yesterday_balance = 0;
        today_earnings = 0;
        today_interest = 0;
        yesterday_interest = 0;
    }
    bool deposit(double b)
    {
        if(bank_balance - b >= 0)
        {
            bank_balance -= b;
            balance += b;
            return 1;
        }
        else return 0;
    }
    bool withdraw(double b)
    {
        if(balance-b>=0)
        {
            balance -= b;
            bank_balance += b;
            return 1;
        }
        else return 0;
    }
    void setInterest(double i)
    {
        yesterday_interest = today_interest;
        today_interest = i;
    }
    void calculateProfit()
    {
        today_earnings = yesterday_balance * 0.0001 * yesterday_interest;
        balance += today_earnings;
        yesterday_balance = balance;
    }
    void print()
    {
        cout << "Name: " << CBankCustomer::name << " ID: " << CBankCustomer::id << endl;
        cout << "Bank balance: " << bank_balance << endl;
        cout << "Internet bank balance: " << balance << endl;
    }
    bool login(string i,string p)
    {
        return (i == CInternetUser::id )
        && (p == CInternetUser::password)
        && (CInternetUser::id == CBankCustomer::id)
        && (CInternetUser::name == CBankCustomer::name);
    }
};
int main()
{
    int t, no_of_days, i;
    string i_xm, i_id, i_mm, b_xm, b_id, ib_id, ib_mm;
    double money, interest;
    char op_code;
    cin >> t;
    while (t--)
    {
        cin >> i_xm >> i_id >> i_mm;
        cin >> b_xm >> b_id;
        cin >> ib_id >> ib_mm;
        CInternetBankCustomer ib_user;
        ib_user.registerUser(i_xm, i_id, i_mm);
        ib_user.openAccount(b_xm, b_id);
        if (ib_user.login(ib_id, ib_mm) == 0)
        {
            cout << "Password or ID incorrect" << endl;
            continue;
        }
        cin >> no_of_days;
        for (i=0; i < no_of_days; i++)
        {
            //输入操作代码, 金额, 当日万元收益
            cin >> op_code >> money >> interest;
            switch (op_code)
            {
                case 'S':  //从银行向互联网金融帐户存入
                case 's':
                    if (ib_user.deposit(money) == 0)
                    {
                        cout << "Bank balance not enough" << endl;
                        continue;
                    }
                    break;
                case 'T':  //从互联网金融转入银行帐户
                case 't':
                    if (ib_user.withdraw(money) == 0)
                    {
                        cout << "Internet bank balance not enough" << endl;
                        continue;
                    }
                    break;
                case 'D':  //直接向银行帐户存款
                case 'd':
                    ib_user.CBankCustomer::deposit(money);
                    break;
                case 'W':  //直接从银行帐户取款
                case 'w':
                    if (ib_user.CBankCustomer::withdraw(money) == 0)
                    {
                        cout << "Bank balance not enough" << endl;
                        continue;
                    }
                    break;
                default:
                    cout << "Illegal input" << endl;
                    continue;
            }
            ib_user.setInterest(interest);
            ib_user.calculateProfit();
            ib_user.print();
            cout<<endl;
        }
    }
    return 0;
}
```

### 图形输出（抽象类+多层继承）:

```cpp
#include<iostream>
using namespace std;

class Shape
{
protected:
    string name;
    double x, y;
public:
    Shape(double x, double y):x(x), y(y){}
    virtual double getX(){return x;}
    virtual double getY(){return y;}
    virtual string getN(){return name;}
    virtual double getA(){return 0.0;}
    virtual double getV(){return 0.0;}
    virtual void shapeName() = 0;
};

class Point:public Shape
{
public:
    Point(double x, double y): Shape(x, y){}
    void shapeName(){name = "Point";}
};

class Circle:public Point
{
protected:
    double r;
public:
    Circle(double x, double y, double r): Point(x, y), r(r){}
    void shapeName(){name = "Circle";}
    double getA(){return 3.14159 * r * r;}
};

class Cylinder:public Circle
{
    double h;
public:
    Cylinder(double x, double y, double r, double h): Circle(x, y, r), h(h){}
    void shapeName(){name = "Cylinder";}
    double getA(){return 3.14159 * 2 * r * (h + r);}
    double getV(){return 3.14159 * r * r * h;}
};

void Print(Shape* s)
{
    cout << s->getN() << "--(" << s->getX() << "," << s->getY() << ")--" << (int)s->getA() << "--" << (int)s->getV() << endl;
}

int main()
{
    Shape* p;
    double x, y, r, h;

    cin >> x >> y;
    p = new Point(x, y);
    p -> shapeName();
    Print(p);

    cin >> x >> y >> r;
    p = new Circle(x, y, r);
    p -> shapeName();
    Print(p);

    cin >> x >> y >> r >> h;
    p = new Cylinder(x, y, r, h);
    p -> shapeName();
    Print(p);
}
```

### 日程安排（多继承+友元函数）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Date
{
protected:
    int year, month, day;
};

class Time
{
protected:
    int hour, minute, second;
};

class Schedule : public Date, public Time
{
    int ID;
    friend bool before(const Schedule & s1,const Schedule & s2);
public:
    Schedule(){}
    Schedule(int id, int y, int mo, int d, int h, int mi, int s)
    {
        ID = id;
        year = y, month = mo, day = d;
        hour = h, minute = mi, second = s;
    }
    void Display()
    {
        printf("No.%d: ", ID);
        printf("%04d/%02d/%02d %02d:%02d:%02d", year, month, day, hour, minute, second);
    }
};

bool before(const Schedule & s1,const Schedule & s2)
{
    if(s1.year != s2.year) return s1.year < s2.year;
    if(s1.month != s2.month) return s1.month < s2.month;
    if(s1.day != s2.day) return s1.day < s2.day;
    if(s1.hour != s2.hour) return s1.hour < s2.hour;
    if(s1.minute != s2.minute) return s1.minute < s2.minute;
    if(s1.second != s2.second) return s1.second < s2.second;
}

int main()
{
    int t, cnt = 0;
    vector<Schedule> table;

    while(cin >> t, t)
    {
        int y, mo, d, h, mi, s;
        cin >> y >> mo >> d >> h >> mi >> s;
        Schedule schedule(t, y, mo, d, h, mi, s);
        table.push_back(schedule);
    }
    sort(table.begin(), table.end(), before);
    printf("The urgent schedule is ");
    table[0].Display();
}
```

### 约瑟夫环（结构体+循环链表）:

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    bool state;
    Node *next;
    Node()
    {
        state = false;
        next = NULL;
    }
    Node(int e)
    {
        data = e;
        state = false;
        next = NULL;
    }
    friend class List;
};

class List
{
    Node *head, *tail;
    int length;
public:
    List()
    {
        length = 0;
        head = new Node;
        tail = new Node;
        tail -> next = head;
    }
    void Init(int len)
    {
        length = len;
        Node *p = head;
        head -> data = 1;
        for(int i = 2; i <= len; i ++ )
        {
            Node *q = new Node(i);
            p -> next = q;
            p = q;
        }
        tail = p;
        tail -> next = head;
    }
    void Play(int k , int m)
    {
        int cnt = 1;
        Node *p = head;
        while(cnt != k)
        {
            p = p -> next;
            cnt ++ ;
        }
        cnt = 0;
        while(cnt != length)
        {
            int count = 1;
            while(count != m)
            {
                p = p -> next;
                if(p -> state == false) count ++ ;
            }
            p -> state = true;
            cout << p -> data;
            while(p->state && cnt != length - 1) 
                p = p -> next;
            if(cnt == length - 1) cout << endl;
            else cout << " ";
            cnt ++ ;
        }
    }

};

int main()
{
    int n, k, m;
    while(cin >> n >> k >> m)
    {
        List list;
        list.Init(n);
        list.Play(k, m);
    }
}
```

### 对象相加函数模板:

```cpp
#include<iostream>
using namespace std;

class Clock
{
    int x, y, z;
public:
    Clock(int x, int y, int z):x(x), y(y), z(z){}
    int getx(){return x;}
    int gety(){return y;}
    int getz(){return z;}
    friend void operator << (ostream& ot, Clock& c1)
    {
        ot << c1.x << " " << c1.y << " " << c1.z << endl;
    }
//    friend
};

class RMB
{
    int x, y, z;
public:
    RMB(int x, int y, int z):x(x), y(y), z(z){}
    int getx(){return x;}
    int gety(){return y;}
    int getz(){return z;}
    friend void operator << (ostream& ot, RMB& r)
    {
        ot << r.x << " " << r.y << " " << r.z << endl;
    }
};

template<class T>
T add(T& t1, T& t2, int t)
{
    int x = t1.getx() + t2.getx();
    int y = t1.gety() + t2.gety();
    int z = t1.getz() + t2.getz();
    if(z >= t) z %= t, y ++ ;
    if(y >= t) y %= t, x ++ ;
    return T(x, y , z);
}

int main()
{
    int a, b, c;
    cin >> a >> b >> c;
    Clock c1(a, b, c);
    cin >> a >> b >> c;
    Clock c2(a ,b, c);
    Clock cl = add(c1, c2, 60);
    cout << cl;

    cin >> a >> b >> c;
    RMB r1(a, b, c);
    cin >> a >> b >> c;
    RMB r2(a, b, c);
    RMB r = add(r1, r2, 10);
    cout << r;
}   
```

### 模拟时间（继承）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Time
{
protected:
    int hour, minute, second;
public:
    Time(){}
    Time(int h, int m, int s)
    {
        hour = h, minute = m, second = s;
    }
    void Display()
    {
        printf("%02d:%02d:%02d\n", hour, minute, second);
    }
};

class Time_12Hour : public Time
{
    string interval[2] = {"AM", "PM"};
    int inter;
public:
    Time_12Hour(int h, int m, int s, int ter)
    {
        hour = h, minute = m, second = s, inter = ter;
    }
    void add()
    {
        second ++ ;
        if(second >= 60)
        {
            second -= 60;
            minute ++ ;
            if(minute >= 60)
            {
                minute -= 60;
                hour ++ ;
                if(hour >= 12)
                {
                    hour -= 12;
                    inter = 1 - inter;
                }
            }
        }
    }
    void sub()
    {
        second -- ;
        if(second < 0)
        {
            second += 60;
            minute -- ;
            if(minute < 0)
            {
                minute += 60;
                hour -- ;
                if(hour < 0)
                {
                    hour += 12;
                    inter = 1 - inter;
                }
            }
        }
    }
    void Display()
    {
        cout << interval[inter] << " ";
        printf("%02d:%02d:%02d\n", hour, minute, second);
    }
};

int main()
{
    int t;
    while(cin >> t, t)
    {
        string ope;
        int n = t % 10;
        n -- ;
        int h, m, s;
        cin >> h >> m >> s;
        Time_12Hour time12Hour(h, m, s, n);
        cin >> ope >> n;
        if(ope == "+") while(n -- ) time12Hour.add();
        else while(n -- ) time12Hour.sub();
        time12Hour.Display();
    }
    return 0;
}
```

### 逆序输出函数模板:

```cpp
#include<bits/stdc++.h>
using namespace std;

template<class T>
string Reverse(T& x)
{
    stringstream ss;
    string s;

    ss << x;
    s = ss.str();
    reverse(s.begin(), s.end());

    return s;
}

class Complex
{
    int r, i;
public:
    Complex(int r, int i):r(r), i(i){}

    operator string()
    {
        string sr, si;   

        if(r > 0) sr = "+" + to_string(r);
        else sr = to_string(r);
        reverse(sr.begin(), sr.end()); 

        si = to_string(i);
        reverse(si.begin(), si.end());
        sr += si;
        
        return sr;
    }

    friend ostream& operator << (ostream& ot, Complex& c)
    {
        ot << string(c);
        return ot;
    }
};

int main()
{
    int t, x, r, i;
	string type, s, res;
	double d;
    cin >> t;
    while(t -- )
    {
        stringstream ss;
        cin >> type;
        if(type == "I")
        {
            cin >> x;
            if(x < 0) cout << "-", x *= -1;
            res = Reverse(x), ss << res, ss >> x;
            cout << x << endl;
        }
        else if(type == "S")
        {
            cin >> s;
            cout << Reverse(s) << endl;
        }
        else if(type == "D")
        {
            cin >> d;
            if(d < 0) cout << "-", d *= -1;
            res = Reverse(d), ss << res, ss >> d;
            cout << d << endl;
        }
        else if(type == "C")
        {
            cin >> r >> i;
            Complex c(r, i);
            cout << Reverse(c) << endl;
        }
    }
    return 0;
}
```

### 链表原地反转（链表):

```cpp
#include<iostream>
using namespace std;

class Node
{
public:
    int data;
    Node *next;
    Node()
    {
        next = NULL;
    }
    Node(int e)
    {
        next = NULL;
        data = e;
    }
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }

    void insert(int e)
    {
        len ++ ;
        Node *q = new Node(e);
        Node *p = head;
        while(p -> next)
        {
            p = p -> next;
        }
        p -> next = q;
    }

    void resever()
    {
        Node *tail = new Node;
        Node *t = tail;
        while(head -> next)
        {
            Node *p = head, *q = head -> next;
            while(q -> next)
            {
                q = q -> next;
                p = p -> next;
            }
            t -> next = q;
            t = q;
            p -> next = NULL;
        }
        head = tail;
    }

    void Display()
    {
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data << " ";
            p = p -> next;
        }
        cout << endl;
    }

    ~List()
    {
        Node *p = head -> next;
        while(p -> next)
        {
            Node *q = p;
            p = p ->next;
            delete q;
        }
        head -> next = NULL;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        List list;
        int n, e;
        cin >> n;
        for(int i = 0; i < n; i ++ )
        {
            cin >> e;
            list.insert(e);
        }
        list.resever();
        list.Display();
    }
    return 0;
}
```

### 图书借阅（对象数组+构造）:

```cpp
#include<iostream>
using namespace std;
#include<unordered_map>

class Book
{
    string Id, Name;
    int Col_num, Ave_num;
public:
    Book(){}
    Book(string id, string name, int col_num, int ave_num)
    {
        Id = id, Name = name, Col_num = col_num, Ave_num = ave_num;
    }
    void Set(string id, string name, int col_num, int ave_num)
    {
        Id = id, Name = name, Col_num = col_num, Ave_num = ave_num;
    }
    void get()
    {
        cout << Name << " ";
        if(Ave_num == 0) cout << "该书已全部借出" << endl;
        else
        {
            cout << "索取号: " << Id << endl;
            Ave_num -- ;
        }
    }
    void Display()
    {
        cout << Id << " " << Name << " " << Col_num << " " << Ave_num << endl;
    }
    int getCol(){return Col_num;}
    int getAve(){return Ave_num;}
};

int main()
{
    int n, sum;
    cin >> n;
    sum = n;
    Book *book = new Book[n];
    string Id, Name;
    int Col_num, Ave_num;
    unordered_map<string, int> books_idx;
    for(int i = 0; i < n; i ++ )
    {
        cin >> Id >> Name >> Col_num >> Ave_num;
        book[i].Set(Id, Name, Col_num, Ave_num);
        books_idx.insert({Name, i});
    }
    cin >> n;
    while(n -- )
    {
        cin >> Name;
        book[books_idx[Name]].get();
    }
    Col_num = 0, Ave_num = 0;
    for(int i = 0; i < sum; i ++ )
    {
        book[i].Display();
        Col_num += book[i].getCol();
        Ave_num += book[i].getAve();
    }
    printf("借出图书: %d本  剩余馆藏图书: %d本\n", Col_num - Ave_num, Ave_num);
    return 0;
}
```

### 身份证设定（复合类+拷贝构造）:

```cpp
#include <iostream>
#include <string>
using namespace std;
#include <iomanip>

class cad;
class bd 
{
protected:
	int y, m, d;
public:
	bd() {};
	bd(int y1, int m1, int d1) {
		y = y1;
		m = m1;
		d = d1;
	}
	void print() {
		cout <<  setfill('0');
		cout << "birth=" << y << "." << setw(2) << m << "." << setw(2) << d << endl;
	}
	friend cad;
};

class cad 
{
protected:
	int kd;
	string num;
	bd bh;
public:
	cad(int kd, string num, bd b) : bh(b) {
		this->kd = kd;
		this->num = num;
	}
	void print() {
		cout << "type=" << kd << " ";
		bh.print();
		cout << "ID=" << num << endl;
	}
	cad(const cad &cad) {
		kd = cad.kd;
		num = cad.num;
		bh = cad.bh;
		int cnt = num.length();
		if (cnt == 15) {
			this->kd = 2;
			num.insert(6, to_string(cad.bh.y), 0, 2);
			int n = 0, ad = 0;
			for (int i = 0; i < 17; i++) {
				n += num[i] - '0';
			}
			ad = n % 10;
			if (ad == 0)
				num.append("X");
			else
				num.append(to_string(ad));
		}
	}
};

int main() {
	int t, kd, y, m, d;
	string num;
	cin >> t;
	while (t--) {
		cin >> kd >> num >> y >> m >> d;
		bd bh(y, m, d);
		cad pid1(kd, num, bh);
		cad pid2(pid1);
		pid2.print();
	}
	return 0;
}

```

### 三数论大小（引用）:

```cpp
#include<iostream>
using namespace std;

void Sort(int &a, int &b, int &c)
{
    if(a < b) swap(a, b);
  	if(a < c) swap(a, c);
  	if(b < c) swap(b, c);
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int a, b, c;
        cin >> a >> b >> c;
        Sort(a, b, c);
        cout << a << " " << b << " " << c << endl;
    }
    return 0;
}
```

### 三数论大小（指针）:

```cpp
#include<iostream>
using namespace std;

int main()
{
    int n;
    cin >> n;
    while(n --) {
        int a, b, c;
        cin >> a >> b >> c;
        int *p = &a;
        int *q = &b;
        int *t = &c;
        if (*p < *q) swap(*p, *q);
        if (*p < *t) swap(*p, *t);
        if (*q < *t) swap(*q, *t);
        cout << *p << " " << *q << " " << *t << endl;
    }
    return 0;
}
```

### 分数类（类与构造）:

```cpp
#include<iostream>
using namespace std;

class Fraction
{
    int fz, fm;
public:
    Fraction(int fz_val, int fm_val)
    {
        fz = fz_val, fm = fm_val;
        int t = getGCD();
        fz /= t;
        fm /= t;
    }
    Fraction add(const Fraction &r)
    {
        int b = fm * r.fm;
        int a = fz * r.fm + r.fz * fm;
        Fraction F3(a, b);
        return F3;
    }
    Fraction sub(const Fraction &r)
    {
        int b = fm * r.fm;
        int a = fz * r.fm - r.fz * fm;
        Fraction F3(a, b);
        return F3;
    }
    Fraction mul(const Fraction &r)
    {
        int b = fm * r.fm;
        int a = fz * r.fz;
        Fraction F3(a, b);
        return F3;
    }
    Fraction div(const Fraction &r)
    {
        int b = fm * r.fz;
        int a = fz * r.fm;
        Fraction F3(a, b);
        return F3;
    }
    int getGCD()
    {
        int a = fz;
        int b = fm;
        int c;
        while(b)
        {
            c = a % b;
            a = b;
            b = c;
        }
        return a;
    }
    void print()
    {
        if(fm < 0) fm = -fm, fz = -fz;
        printf("%d/%d\n", fz, fm);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int a, b, c, d;
        scanf("%d/%d", &a, &b);
        scanf("%d/%d", &c, &d);
        Fraction F1(a, b), F2(c, d);
        Fraction F3 = F1.add(F2);
        F3.print();
        F3 = F1.sub(F2);
        F3.print();
        F3 = F1.mul(F2);
        F3.print();
        F3 = F1.div(F2);
        F3.print();
        cout << endl;
    }
    return 0;
}
```

### 矩阵（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class Array
{
    int n, m, t;
    int **data;
public:
    Array(){}

    Array(int nv, int mv):n(nv), m(mv)
    {
        data = new int*[n];
        for(int i = 0; i < n; i ++ )
            data[i] = new int[m];
    }

    int* operator[] (int i)
    {
        t = i;
        return *(data + i);
    }

    int& operator[] (int i) const
    {
        return *(*(data + t) + i);
    }

    int& operator () (int i, int j)
    {
        return data[i][j];
    }

    Array& operator = (const Array& a2)
    {
        n = a2.n, m = a2.m;
        data = new int*[a2.n];
        for(int i = 0; i < a2.n; i ++ )
            data[i] = new int[a2.m];

        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < m; j ++ )
                data[i][j] = a2.data[i][j];
        
        return *this;
    }

    ~Array()
    {
        for(int i = 0; i < n; i ++ ) delete[] data[i];
        delete[] data;
    }
};

int main()
{
    int t;
    int n, m;
    cin >> t;
    while(t -- )
    {
        cin >> n >> m;
        Array matA(n, m);
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < m; j ++ )
                cin >> matA[i][j];
        cout << "MatrixA:" << endl;
        for(int i = 0; i < n; i ++ )
        {
            for(int j = 0; j < m; j ++ )
                cout << matA(i, j) << " ";
            cout << endl;
        }
        cout << "MatrixB:" << endl;
        Array matB;
        matB = matA;
        for(int i = 0; i < n; i ++ )
        {
            for(int j = 0; j < m; j ++ )
                cout << matB[i][j] << " ";
            cout << endl;
        }
    }
    return 0;
}
```

### 集合（运算符重载）:

```cpp
#include<vector>
#include<iostream>
#include<algorithm>

using namespace std;

class Cset
{
    int len;
    vector<int> data;
public:
    Cset(){}
    Cset(int n, int *e)
    {
        len = n;
        for(int i = 0; i < n; i ++ )
            data.push_back(e[i]);
    }

    friend ostream& operator << (ostream& ot, Cset& cset)
    {
        for(int i = 0; i < cset.len ; i ++ )
        {
            ot << cset.data[i];
            if(i == cset.len - 1) ot << endl;
            else ot << " ";
        }
    }

    friend Cset operator + (Cset& c1, Cset& c2)
    {
        Cset c = c1;
        for(int i = 0; i < c2.len; i ++ )
        {
            bool flag  = 0;
            for(int j = 0; j < c1.len; j ++ )
                if(c1.data[j] == c2.data[i])
                    flag = 1;
            if(flag) continue;
            c.data.push_back(c2.data[i]);
        }
        c.len = c.data.size();
        return c;
    }

    friend Cset operator * (Cset& c1, Cset& c2)
    {
        Cset c;
        vector<int>::iterator it1, it2;
        it1 = c1.data.begin();
        for(; it1 != c1.data.end(); it1 ++ )
        {
            for(it2 = c2.data.begin(); it2 != c2.data.end(); it2 ++ )
            {
                if(*it1 == *it2)
                    c.data.push_back(*it1);
            }
        }
        c.len = c.data.size();
        return c;
    }

    friend Cset operator - (Cset& c1, Cset& c2)
    {
        Cset c;
        vector<int>::iterator it1, it2;
        it1 = c1.data.begin();

        for(; it1 != c1.data.end(); it1 ++ )
        {
            bool flag = 1;
            for(it2 = c2.data.begin(); it2 != c2.data.end(); it2 ++ )
                if(*it1 == *it2) flag = 0;

            if(flag) c.data.push_back(*it1);
        }

        c.len = c.data.size();
        return c;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int len, *data;

        cin >> len;
        data = new int[len];
        for(int i = 0; i < len; i ++ )
            cin >> data[i];
        Cset cset1(len, data);
        cout << "A:" << cset1;

        cin >> len;
        data = new int[len];
        for(int i = 0; i < len; i ++ )
            cin >> data[i];
        Cset cset2(len, data);
        cout << "B:" << cset2;

        Cset add = cset1 + cset2;
        cout << "A+B:" << add;

        Cset sub = cset1 * cset2;
        cout << "A*B:" << sub;

        Cset bu1 = (cset1 - cset2);
        Cset bu2 = (cset2 - cset1);
        Cset bu = bu1 + bu2;
        cout << "(A-B)+(B-A):" << bu;
        cout << endl;
    }
    return 0;
}
```

### 删除重复元素（结构体+链表+类）:

```cpp
#include<iostream>
using namespace std;

class Node
{
    int data;
    Node *next;
public:
    Node():next(NULL){}
    Node(int e):next(NULL), data(e){}
    friend class List;
};

class List
{
    Node *head;
    int len;
public:
    List()
    {
        len = 0;
        head = new Node;
    }

    void insert(int e)
    {
        len ++ ;
        Node *p = head;
        while(p -> next)
        {
            p = p -> next;
        }
        Node *q = new Node(e);
        p -> next = q;
    }

    bool find(int e)
    {
        Node *p = head -> next;
        for(int i = 0; i < len; i ++ )
        {
            if(p -> data == e) return true;
            p = p -> next;
        }
        return false;
    }

    void Display()
    {
        // cout << len << " ";
        Node *p = head -> next;
        while(p)
        {
            cout << p -> data;
            if(p -> next) cout << " ";
            else cout << endl;
            p = p -> next;
        }
        // cout << endl;
    }


    ~List()
    {
        Node *p = head -> next;
        while(p)
        {
            Node *q = p;
            p = q -> next;
            delete q;
        }
        len = 0;
        head -> next = NULL;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n, e;
        List list;
        cin >> n;
        for(int i = 0; i < n; i ++ )
        {
            cin >> e;
            if(!list.find(e)) list.insert(e);
        }
        list.Display();
    }
    return 0;
}
```

### 三维空间的点（继承）:

```cpp
#include<iostream>
#include<cmath>
using namespace std;

class Point2
{
protected:
    double x, y;
public:
    Point2(double xx, double yy):x(xx), y(yy){}
    double getDis()
    {
        double res = x * x + y * y;
        return sqrt(res);
    }
};

class Point3 : public Point2
{
    double z;
public:
    Point3(double xx, double yy, double zz): Point2(xx, yy), z(zz){}
    double getDis3()
    {
        double res = x * x + y * y + z * z;
        return sqrt(res);
    }
};

int main()
{
    int x, y, z;
    cin >> x >> y;
    Point2 p2(x, y);
    cout << p2.getDis() << endl;
    cin >> x >> y >> z;
    Point3 p3(x, y, z);
    cout << p3.getDis3() << endl;
    cin >> x >> y >> z;
    Point3 p4(x, y, z);
    cout << p4.getDis3() << endl;
    cout << p4.getDis() << endl;
    return 0;
}
```

### 交通工具（多重继承）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Vehicle
{
protected:
    int max_speed, speed, weight;
public:
    Vehicle():max_speed(0),speed(0),weight(0){}
    Vehicle(int m, int s, int w)
    {
        max_speed = m, speed = s, weight = w;
    }

    void dis()
    {
        printf("Vehicle:\nmax_speed:%d\nspeed:%d\nweight:%d\n\n", max_speed, speed, weight);
    }
};

class Bicycle :virtual public Vehicle
{
protected:
    int height;
public:
    Bicycle() : height(0) {}
    Bicycle(int m, int s, int w, int h)
    {
        max_speed = m, speed = s, weight = w, height = h;
    }

    void dis()
    {
        printf("Bicycle:\nmax_speed:%d\nspeed:%d\nweight:%d\nheight:%d\n\n", max_speed, speed, weight, height);
    }
};

class Motocar :virtual public Bicycle
{
protected:
    int seat_num;
public:
    Motocar():seat_num(0){}
    Motocar(int m, int s, int w, int h, int sn)
    {
        max_speed = m, speed = s, weight = w, height = h, seat_num = sn;
    }
    void dis() const
    {
        printf("Motocar:\nmax_speed:%d\nspeed:%d\nweight:%d\nseat_num:%d\n\n", max_speed, speed, weight, seat_num);
    }
};

class Motocycle :virtual public Motocar,virtual public Bicycle
{
public:
    Motocycle(){}
    Motocycle(int m, int s, int w, int h, int sn)
    {
        max_speed = m, speed = s, weight = w, height = h, seat_num = sn;
    }
    void dis()
    {
        printf("Motocycle:\nmax_speed:%d\nspeed:%d\nweight:%d\nheight:%d\nseat_num:%d", max_speed, speed, weight, height, seat_num);
    }
};

int main()
{
     int m, s, w, h, sn;
     cin >> m >> s >> w >> h >> sn;

     Vehicle vehicle(m, s, w);
     vehicle.dis();

     Bicycle bicycle(m, s, w, h);
     bicycle.dis();

     Motocar motocar(m, s, w, h, sn);
     motocar.dis();

     Motocycle motocycle(m, s, w, h, sn);
     motocycle.dis();
}
```

### 会员积分（期末模拟）:

```cpp
#include<iostream>
using namespace std;

class Mem
{
protected:
    string id, name;
    int fen;
public:
    Mem(){}
    Mem(string i, string n, int f):id(i), name(n), fen(f){}

    virtual void add(int num)
    {
        fen += num;
    }

    virtual int Exchange(int num)
    {
        int tmp = num / 100;
        fen -= (tmp * 100);
        return tmp;
    }

    virtual void print()
    {
        cout << "普通会员" << id << "--" << name << "--" << fen << endl;
    }
};

class VIP: public Mem
{
    int rate1, rate2;
public:
    VIP(string i, string n, int f, int r1, int r2):Mem(i, n, f), rate1(r1), rate2(r2){}
    virtual void add(int num)
    {
        fen += num * rate1;
    }
    virtual int Exchange(int num)
    {
        int tmp = num / rate2;
        fen -= (tmp * rate2);
        return tmp;
    }
    virtual void print()
    {
        cout << "贵宾会员" << id << "--" << name << "--" << fen << endl;
    }
};

int main()
{
    string id, name;
    int r1, r2, f, n1, n2;
    cin >> id >> name >> f;
    Mem *pm;
    Mem mm(id, name, f);
    pm = &mm;
    cin >> n1 >> n2;
    pm->add(n1);
    pm->Exchange(n2);
    pm->print();

    cin >> id >> name >> f >> r1 >> r2;
    VIP vv(id, name, f, r1, r2);
    pm = &vv;
    cin >> n1 >> n2;
    pm->add(n1);
    pm->Exchange(n2);
    pm->print();
}
```

### 元素查找（函数模板）:

```cpp
#include<iostream>
using namespace std;

template<typename T>
void myFind(T& a, T *b, int n)
{
    for(int i = 0; i < n; i ++ )
        if(b[i] == a)
        {
            cout << i + 1 << endl;
            return;
        }
    cout << 0 << endl;
}

int main()
{
    int t; 
    cin >> t;
    while(t -- )
    {
        int n;
        char type;
        cin >> type >> n;
        if(type == 'I')
        {
            int *b = new int[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            int a;
            cin >> a;
            myFind(a, b, n);
        }
        else if(type == 'D')
        {
            double *b = new double[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            double a;
            cin >> a;
            myFind(a, b, n);
        }
        else if(type == 'C')
        {
            char *b = new char[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            char a;
            cin >> a;
            myFind(a, b, n);
        }
        else
        {
            string *b = new string[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            string a;
            cin >> a;
            myFind(a, b, n);
        }
    }
}
```

### 函数调用（函数指针）:

```cpp
#include<iostream>
#include<cstring>
#include<cmath>
using namespace std;

int pingfang(int n)
{
    return n * n;
}

double sq(double m)
{
    return sqrt(m);
}

void toBig(char *p)
{
    int len;
    len = strlen(p);
    for(int i = 0; i < len; i ++ )
    {
        if(p[i] >= 'a' && p[i] <= 'z')
            p[i] -= 32;
    }
}

int main()
{
    int (*INT)(int n);
    double (*DOUBLE)(double m);
    void (*CHAR)(char *p);

    int t;
    cin >> t;
    while(t -- )
    {
        char ch;
        cin >> ch;
        
        if(ch == 'I')
        {
            INT = pingfang;
            int n;
            cin >> n;
            cout << INT(n) << endl;
        }
        else if(ch == 'F')
        {
            DOUBLE = sq;
            double n;
            cin >> n;
            cout << DOUBLE(n) << endl;
        }
        else
        {
            CHAR = toBig;
            char ch[100];
            cin >> ch;
            CHAR(ch);
            cout << ch << endl;
        }
    }
    return 0;
}
```

### 加密模板（期末模拟）:

```cpp
#include<iostream>
#include<vector>
using namespace std;

template<class T>
T Max(vector<T> data, int n)
{
    T maxx = data[0];
    for(int i = 1; i < n; i ++ )
        if(maxx < data[i])
            maxx = data[i];
    return maxx;
}

template<class T>
class password
{
    int len;
    vector<T> mingwen, miwen;
    T miyao;
public:
    password(T miyao, int len, vector<T>ming):miyao(miyao), len(len)
    {
        mingwen.resize(len);
        miwen.resize(len);
        mingwen = ming;
    }
    void jiami()
    {
        T m = Max(mingwen, len);
        for(int i = 0; i < len; i ++ )
            miwen[i] = m - mingwen[i] + miyao;
    }

    void print()
    {
        for(int i = 0; i < len; i ++ )
        {
            cout << miwen[i];
            if(i == len - 1) cout << endl;
            else cout << " ";
        }
    }
};

int main()
{
    int len;
    vector<int> v1;
    int m1;

    cin >> m1 >> len;
    for(int i = 0; i < len; i ++ )
    {
        int e;
        cin >> e;
        v1.push_back(e);
    }
    password<int> p1(m1, len, v1);
    p1.jiami();
    p1.print();

    vector<double> v2;
    double m2;

    cin >> m2 >> len;
    for(int i = 0; i < len; i ++ )
    {
        double e;
        cin >> e;
        v2.push_back(e);
    }
    password<double> p2(m2, len, v2);
    p2.jiami();
    p2.print();

    vector<char> v3;
    char m3;
    cin >> m3 >> len;

    for(int i = 0; i < len; i ++ )
    {
        char e;
        cin >> e;
        v3.push_back(e);
    }
    password<char> p3(m3, len, v3);
    p3.jiami();
    p3.print();

    return 0;
}
```

### 加湿风扇（期末模拟）:

```cpp
 #include <iostream>
#include <cstring>

using namespace std;

class demo {
protected:
	int id, gl;
public:
	demo(int ival, int gval) :id(ival), gl(gval) {};
	void print() {
		cout << "编号" << id << "--功率" << gl << 'W' << endl;
	}
};

class fan :virtual public demo {
protected:
	int fx, fl;
public:
	fan(int ival, int gval, int fxval, int flval) :demo(ival, gval), fx(fxval), fl(flval) {};
	void fxcontrol(int val) { fx = val; };
	void flcontrol(int val) { fl = val; };
	void print() {
		cout << (fx == 0 ? "定向吹风" : "旋转吹风") << "--风力" << fl << "级" << endl;
	}
};

class jsq :virtual public demo {
protected:
	float cur, max;
public:
	jsq(int ival, int gval, float cval, float mval) :demo(ival, gval), cur(cval), max(mval) {};
	int yujing() {
		if (cur >= max * 0.5)	return 1;
		else if (cur >= max * 0.1)	return 2;
		else return 3;
	}
	void print() {
		int temp = yujing();
		cout << "实际水容量" << cur << "升--";
		if (temp == 1)	cout << "水量正常" << endl;
		else if (temp == 2) cout << "水量偏低" << endl;
		else if (temp == 3) cout << "水量不足" << endl;
	}
};

class jsfan:public fan, public jsq {
	int dangwei;
public:
	jsfan(int ival, int gval, int fxval, int flval, float cval, float mval, int dval) :demo(ival,gval),fan(ival, gval, fxval, flval), jsq(ival, gval, cval, mval), dangwei(dval) {};
	void dcontrol(int val) {
		dangwei = val;
		if (dangwei == 0) return;
		else if (dangwei == 1) fan::fxcontrol(0), fan::flcontrol(1);
		else if (dangwei == 2) fan::fxcontrol(1), fan::flcontrol(2);
		else if (dangwei == 3) fan::fxcontrol(1), fan::flcontrol(3);
	}
	void print() {
		cout << "加湿风扇--档位" << dangwei << endl;
		demo::print(), fan::print(), jsq::print();
	}
};



int main() {
	int t;
	int ival, gval, fxval, flval, dval, val;
	float cval, mval;
	cin >> t;
	while (t--){
		cin >> ival >> gval >> fxval >> flval >> cval >> mval >> dval;
		jsfan s(ival, gval, fxval, flval, cval, mval, dval);
		cin >> val;
		s.dcontrol(val);
		s.print();
	}
	return 0;
}
```

### 复数运算（友元函数）:

```cpp
#include<iostream>
using namespace std;

class complex
{
	double real;
	double imag;
public:
	complex()
	{
		real = 0, imag = 0;
	}

	complex(double r, double i)
	{
		real = r, imag = i;
	}

	double getR(){return real;}
	double getI(){return imag;}

	friend complex addCom(complex c1, complex c2);
	friend void outCom(complex c);
};

complex addCom(complex c1, complex c2)
{
	double r = c1.getR() + c2.getR();
	double i = c1.getI() + c2.getI();
	complex c(r, i);
	return c;
}

complex subCom(complex c1, complex c2)
{
	double r = c1.getR() - c2.getR();
	double i = c1.getI() - c2.getI();
	complex c(r, i);
	return c;
}

void outCom(complex c)
{
	printf("(%.0lf,%.0lf)\n", c.getR(), c.getI());
}

int main()
{
	double r, i;
	cin >> r >> i;
	complex c(r, i);
	int t;
	cin >> t;
	while(t -- )
	{
		char ch;
		cin >> ch >> r >> i;
		complex c1(r, i);
		if(ch == '+') c = addCom(c, c1);
		else c = subCom(c, c1);
		
		outCom(c);
	}
	return 0;
}
```

### 存折与信用卡（继承）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class Account
{
protected:
    string acc;
    string name;
    float balance;
public:
    Account(string a, string n, float b)
    {
        acc = a, name = n, balance = b;
    }

    void Deposit(float num)
    {
        balance += num;
        cout << "saving ok!" << endl;
    }

    void Withdraw(float num)
    {
        if(balance < num)
        {
            cout << "sorry! over balance!" << endl;
            return;
        }
        balance -= num;
        cout << "withdraw ok!" << endl;
    }

    void Display()
    {
        cout << "balance is " << balance << endl;
    }
};

class Creadit : public Account
{
protected:
    float limit;
public:
    Creadit(string a, string n, float b, float l):Account(a, n, b), limit(l){}
    void Withdraw(float num)
    {
        if(balance + limit >= num)
        {
            balance -= num;
            cout << "withdraw ok!" << endl;
        }
        else cout << "sorry! over limit!" << endl;
    }
};

int main()
{
    string acc, name;
    float ba, li;
    cin >> acc >> name >> ba;
    Account Ac(acc, name, ba);
    Ac.Display();
    cin >> ba;
    Ac.Deposit(ba);
    Ac.Display();
    cin >> ba;
    Ac.Withdraw(ba);
    Ac.Display();

    cin >> acc >> name >> ba >> li;
    Creadit Cr(acc, name, ba, li);
    Cr.Display();
    cin >> ba;
    Cr.Deposit(ba);
    Cr.Display();
    cin >> ba;
    Cr.Withdraw(ba);
    Cr.Display();
}
```

### 学生成绩计算（继承）:

```cpp
#include<iostream>
using namespace std;

class Person
{
public:
    string name;
    int age;
    void Display()
    {
        cout << name << " " << age << " ";
    }
};

class Free : public Person
{
public:
    Free()
    {
        cin >> name >> age >> score;
    }
    int score;
    char grade;
    void ope()
    {
       if(score >= 85) grade = 'A';
       else if(score >= 75) grade = 'B';
       else if(score >= 65) grade = 'C';
       else if(score >= 60) grade = 'D';
       else grade = 'F';
    }
    void Display()
    {
        cout << name << " " << age << " " << grade << endl;
    }
};

class Nonfree : public Person
{
public:
    Nonfree()
    {
        cin >> name >> age >> score1 >> score2;
    }
    int sum, score1, score2;
    char grade;
    void ope()
    {
        sum = score1 * 0.4 + score2 * 0.6;
        if(sum >= 85) grade = 'A';
        else if(sum >= 75) grade = 'B';
        else if(sum >= 65) grade = 'C';
        else if(sum >= 60) grade = 'D';
        else grade = 'F';
    }
    void Display()
    {
        cout << name << " " << age << " " << grade << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char ch;
        cin >> ch;
        if(ch == 'R')
        {
            Nonfree nf;
            nf.ope();
            nf.Display();
        }
        else
        {
            Free f;
            f.ope();
            f.Display();
        }
    }
}
```

### 成绩查询（指针运算）:

```cpp
#include<iostream>
using namespace std;

int main(){
    int t;
    cin >> t;
    while( t-- ){
        int n, score[1000], num;
        cin >> n;
        for( int i=0; i<n; i++){
            cin >> score[i];
        }
        cin >> num;
        int *p, *q;
        p=score;
        if(n%2==0){
            q=p+n/2+1;
        }else{
            q=p+n/2;
        }
        q--;
        cout << *q << " ";
        q++;
        q++;
        cout << *q << endl;
        cout << *(p+num-1) << endl;
    }
    return 0;
}
```

### 扑克牌排序（结构体）:

```cpp
#include<bits/stdc++.h>
using namespace std;

struct poke
{
    char str[10];
    int weight;
    void getWeight()
    {
        int q, w;
        if (strstr(str,"大王")) q = 6;
        if (strstr(str,"小王")) q = 5;
        if (strstr(str,"黑桃")) q = 4;
        if (strstr(str,"红桃")) q = 3;
        if (strstr(str,"梅花")) q = 2;
        if (strstr(str,"方块")) q = 1;
        if (str[6] == 'A') w = 14;
        else if (str[6] == 'K') w = 13;
        else if (str[6] == 'Q') w = 12;
        else if (str[6] == 'J') w = 11;
        else if (str[6] == '1') w = 10;
        else if(str[6]) w = str[6] - '0';
        weight = q * 14 + w;
    }

    bool operator< (const poke &P)const
    {
        return weight > P.weight;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        poke *P = new poke[n];
        for(int i = 0; i < n; i ++ )
        {
            cin >> P[i].str;
            P[i].getWeight();
        }
        sort(P, P + n);
        for(int i = 0; i < n; i ++ )
        {
            if(i == n - 1) cout << P[i].str << endl;
            else cout << P[i].str << " ";
        }
    }
}
```

### 指针对象（类和对象）:

```cpp
#include<iostream>
#include<string>
using namespace std;
class student{
public:
    string name;
    string sex;
    string id;
    string college;
    string phoneNumber;
};

int main(){
    int n;
    cin >> n;
    student *p = new student[n];
    for( int i=0; i<n; i++){
        cin >> (p+i)->name >> (p+i)->sex >> (p+i)->id
            >> (p+i)->college >> (p+i)->phoneNumber;
    }
    for( int i=0; i<n-1; i++){
        for( int j=n-1; j>i; j--){
            if((p+j)->name.compare((p+j-1)->name)<0){
                student temp;
                temp = *(p+j);
                *(p+j) = *(p+j-1);
                *(p+j-1) = temp;
            }
        }
    }
    for( int i=0; i<n; i++){
        cout << (p+i)->name << endl;
    }
    return 0;
}

```

### 数据排序（函数模板）:

```cpp
#include<iostream>
using namespace std;

template<class T>
void mySort(T* a, int n)
{
    for(int i = 0; i < n - 1; i ++ )
        for(int j = n - 1; j > i; j -- )
            if(a[j] < a[i]) swap(a[i], a[j]);
}

template<class T>
void Print(T* a, int n)
{
    for(int i = 0; i < n; i ++ )
        cout << a[i] << " ";
    cout << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *b = new int[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else if(type == 'D')
        {
            double *b = new double[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else if(type == 'C')
        {
            char *b = new char[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
        else
        {
            string *b = new string[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            mySort(b, n);
            Print(b, n);
        }
    }
}
```

### 最高成绩（静态成员）:

```cpp
#include<iostream>
using namespace std;

class Stu
{
    int id;
    int score;
    static int maxScore;
    static int maxId;
public:
    Stu(int ti = 0, int ts = 0): id(ti), score(ts){}
    static void findMax(Stu &st)
    {
        if(maxScore < st.score)
        {
            maxScore = st.score;
            maxId = st.id;
        }
    }
    static int getMaxScore()
    {
        return maxScore;
    }
    static int getMaxId()
    {
        return maxId;
    }
};

int Stu::maxScore = 0;
int Stu::maxId = 0;

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int id, score;
        cin >> id >> score;
        Stu st(id, score);
        Stu::findMax(st);
    }
    cout << Stu::getMaxId() << "--" << Stu::getMaxScore() << endl;
    return 0;
}
```

### 月份查询（指针数组）:

```cpp
#include<iostream>
using namespace std;
int main(){
    char*month[]={
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    };
    int t;
    cin >> t;
    while(t--){
        int n;
        cin >> n;
        if( n>12 || n<1 ){
            cout << "error" << endl;
        }else{
            cout << *(month+n-1) << endl;
        }
    }
    return 0;
}
```

### 矩阵类模板（类模板）:

```cpp
#include<iostream>
#include<vector>
using namespace std;

template<class T>
class Mat
{
    vector<vector<T>> data;
    int n, m;
public:
    Mat(int n, int m):n(n), m(m)
    {
        data.resize(n);
        for(int i = 0; i < n; i ++ )   
            data[i].resize(m);
    }

    void transport()
    {
        vector<vector<T>> d;
        d.resize(m);
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < m; j ++ )
                d[j].push_back(data[i][j]);

        data.resize(m);
        for(int i = 0; i < m; i ++ ) 
            data[i].resize(n);
        data = d;
        swap(n, m);
    }

    friend istream& operator >> (istream& in, Mat& m)
    {
        for(int i = 0; i < m.n; i ++ )
            for(int j = 0; j < m.m; j ++ )  
                in >> m.data[i][j];
        return in;
    }

    friend ostream& operator << (ostream& ot, Mat& m)
    {
        for(int i = 0; i < m.n; i ++ )
            for(int j = 0; j < m.m; j ++ )
            {
                cout << m.data[i][j];
                if(j == m.m - 1) cout << endl;
                else cout << " ";
            }
        return ot;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- ) {
        char type;
        int n, m;
        cin >> type >> n >> m;
        if (type == 'I')
        {
            Mat<int> mat(n, m);
            cin >> mat;
            mat.transport();
            cout << mat;
        }
        else if (type == 'D')
        {
            Mat<double> mat(n, m);
            cin >> mat;
            mat.transport();
            cout << mat;
        }
        else if (type == 'C')
        {
            Mat<char> mat(n, m);
            cin >> mat;
            mat.transport();
            cout << mat;
        }
    }
}
```

### 计重转换（期末模拟）:

```cpp
#include<bits/stdc++.h>
using namespace std;

class CN; //提前声明
class EN; //提前声明

class Weight
{ //抽象类
protected:
    char kind[20]; //计重类型
    int gram; //克
public:
    Weight (char tk[] = "no name", int tg=0)
    {
        strcpy(kind, tk);
        gram = tg;
    }

    virtual void Print(ostream & out) = 0; //输出不同类型的计重信息
};

class CN: public Weight
{ //中国计重
    int j, l, q, k;
public:
    CN(int j, int l, int q, int k, char ch[]) : j(j), l(l), q(q), k(k) {
        strcpy(kind, ch);
    }
    CN(int num, char ch[])
    {
        j = num / 500, num %= 500;
        l = num / 50, num %= 50;
        q = num / 5, num %= 5;
        k = num;
        strcpy(kind, ch);
    }
    void Convert(int num)
    {
        j = num / 500, num %= 500;
        l = num / 50, num %= 50;
        q = num / 5, num %= 5;
        k = num;
    }

    void Print(ostream & out)
    {
        out << kind << ":" << j << "斤" << l << "两" << q << "钱" << k << "克" << endl;
    }
};

class EN: public Weight
{ //英国计重
    int b, z, d, k;
public:
    EN(int b, int z, int d, int k, char ch[]) : b(b), z(z), d(d), k(k) {
        strcpy(kind, ch);
    }
    void Convert(int num)
    {
        b = num / 512, num %= 512;
        z = num / 32, num %= 32;
        d = num / 2, num %= 2;
        k = num;
    }
    void Print(ostream & out)
    {
        out << kind << ":" << b << "磅" << z << "盎司" << d << "打兰" << k << "克" << endl;
    }

    operator CN()
    {
        int t = k + d * 2 + z * 32 + b * 512;
        return CN(t, "中国计重");
    }
};

ostream& operator<<(ostream& out, Weight& c)
{
	c.Print(out);
	return out;
}

int main()//主函数
{
    int tw;
    CN cn(0,0,0,0, "中国计重");
    cin >> tw;
    cn.Convert(tw); //把输入的克数转成中国计重
    cout << cn;
    EN en(0,0,0,0,"英国计重");
    cin>>tw;
    en.Convert(tw); //把输入的克数转成英国计重
    cout << en;
    cn = en; //把英国计重转成中国计重
    cout << cn;
    return 0;
}
```

### 访问数组元素（引用）:

```cpp
#include<iostream>
using namespace std;
#define N 1000

int &put(int *num, int i)
{
    return *(num + i);
}

int main()
{
    int num[N];
    int t, n, sum, i;

    cin >> t;
    while(t -- )
    {
        cin >> n;
        for(i = 0; i < n; i ++ )
        {
            cin >> put(num, i);
        }

        for(sum = 0, i = 0; i < n; i ++ )
            sum += num[i];

        cout << "sum=" << sum << endl;
    }
    return 0;
}
```

### 距离计算（友元函数）:

```cpp
#include<iostream>
#include<cmath>
using namespace std;

class Point
{
    double x, y;
public:
    Point(double xx, double yy)
    {
        x = xx, y = yy;
    }
    friend double Distance(Point &a, Point &b);
};

double Distance(Point &a, Point &b)
{
    double len = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    return sqrt(len);
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        double x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        Point p1(x1, y1), p2(x2, y2);
        cout << (int)Distance(p1, p2) << endl;
    }
    return 0;
}
```

### 金属加工（期末模拟）:

```cpp
#include<iostream>
using namespace std;

class block
{
    int y, w, v;
public:
    block(){}
    block(int y, int w, int v) : y(y), w(w), v(v) {}
    block(block& b)
    {
        y = b.y, w = b.w, v = b.v;
    }

    friend block operator + (block& b1, block& b2)
    {
        int y = b1.y + b2.y;
        int w = b1.w + b2.w;
        int v = b1.v + b2.v;
        block tmp(y, w, v);
        return tmp;
    }

    friend block operator * (block& b, int n)
    {
        int y = b.y;
        int w = b.w;
        int v = b.v * n;
        block tmp(y, w, v);
        return tmp;
    }

    bool operator ++ ()
    {
        w *= 1.1, v *= 1.1;
        y ++ ;
    }

    block operator -- (int)
    {
        block tmp(*this);
        w *= 0.9, v *= 0.9;
        y --;
        return tmp;
    }

    void print()
    {
        cout << "硬度" << y << "--重量" << w << "--体积" << v << endl;
    }
};

int main()
{
    int y, w, v, n;
    cin >> y >> w >> v;
    block b1(y, w, v);
    cin >> y >> w >> v;
    block b2(y, w, v);
    cin >> n;

    (b1 + b2).print();
    (b1 * n).print();
    (++ b1);
    b1.print();
    b2 -- ;
    b2.print();

}
```

### 立方体碰撞检测（复合类+动态对象数组+析构）:

```cpp
#include<iostream>
using namespace std;

class Point
{
    int x, y, z;
public:
    Point():x(0), y(0), z(0){}
    Point(int a, int b, int c):x(a),y(b),z(c){}
    int getX(){return x;}
    int getY(){return y;}
    int getZ(){return z;}
    ~Point()
    {
        x = 0, y = 0, z = 0;
    }
    friend class Cube;
};

class Cube
{
    Point *point;
    int minX, minY, minZ;
    int maxX, maxY, maxZ;
public:
    Cube()
    {
        point = new Point[2];
    }
    Cube(int x1, int y1, int z1, int x2, int y2, int z2)
    {
        point = new Point[2];
        Point p1(x1, y1, z1), p2(x2, y2, z2);
        point[0] = p1, point[1] = p2;
    }
    void ope()
    {
        minX = min(point[0].getX(), point[1].getX());
        maxX = max(point[0].getX(), point[1].getX());
        minY = min(point[0].getY(), point[1].getY());
        maxY = max(point[0].getY(), point[1].getY());
        minZ = min(point[0].getZ(), point[1].getZ());
        maxZ = max(point[0].getZ(), point[1].getZ());
    }
    bool collide(Cube &C)
    {
        if(minX > C.maxX || maxX < C.minX || minY > C.maxY || maxY < C.minY || minZ > C.maxZ || maxZ < C.minZ)
            return false;
        return true;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int x1, x2, y1, y2, z1, z2;
        cin >> x1 >> y1 >> z1 >> x2 >> y2 >> z2;
        Cube c1(x1, y1, z1, x2, y2, z2);
        cin >> x1 >> y1 >> z1 >> x2 >> y2 >> z2;
        Cube c2(x1, y1, z1, x2, y2, z2);
        c1.ope(), c2.ope();
        if(c1.collide(c2)) cout << "collide" << endl;
        else cout << "have distance" << endl;
    }
    return 0;
}
```

### 倚天屠龙记（函数模板）:

```cpp
#include<iostream>
using namespace std;

template <class T>
void add(T* a, T* b, int n)
{
    for(int i = 0; i < n; i ++ ) cout << b[i];
    for(int i = 0; i < n; i ++ ) cout << a[i];
    cout << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *a = new int[n];
            int *b = new int[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            for(int i = 0; i < n; i ++ ) cin >> b[i];
            add(a, b, n);
        }
        else if(type == 'D')
        {
            double *a = new double[n];
            double *b = new double[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            for(int i = 0; i < n; i ++ ) cin >> b[i];
            add(a, b, n);
        }
        else if(type == 'C')
        {
            char *a = new char[n];
            char *b = new char[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            for(int i = 0; i < n; i ++ ) cin >> b[i];
            add(a, b, n);
        }
    }
    return 0;
}
```

### 动态数组（指针与数组）:

```cpp
#include<iostream>
using namespace std;

int main(){
    int t;
    cin >> t;
    while( t-- ){
         char c;
         int n;
         cin >> c >> n;
         if( c=='I'){
             int item;
             int *p = new int[n];
             for( int i=0; i<n; i++){
                 cin >> item;
                 *(p+i) = item;
             }
             int sum = 0;
             for( int i=0; i<n; i++){
                 sum += *(p+i);
             }
             float ave = 0;
             ave = sum/n;
             cout << ave << endl;
         }else if( c=='C' ){
             char ch;
             char *q = new char[n];
             for( int i=0; i<n; i++){
                 cin >> ch;
                 *(q+i) = ch;
             }
             char max = *q;
             for( int i=0; i<n; i++){
                 if( *(q+i)>max ){
                     max = *(q+i);
                 }
             }
             cout << max << endl;
         }else if( c=='F' ){
             float *r = new float[n];
             float fl;
             for( int i=0; i<n; i++){
                 cin >> fl;
                 *(r+i) = fl;
             }
             float min = 99999999;
             for( int i=0; i<n; i++){
                 if( *(r+i)<min ){
                     min = *(r+i);
                 }
             }
             cout << min << endl;
         }
    }
    system("pause");
    return 0;
}
```

### 动物园（虚函数与多态）:

```cpp
#include<iostream>
using namespace std;

class Animal
{
protected:
    string name;
    int age;
public:
    Animal(string n, int a):name(n), age(a){}
    virtual void Dis(){};
};

class Tiger:public Animal
{
public:
    Tiger(string n, int a): Animal(n, a){}
    void Dis()
    {
        cout << "Hello,I am " << name << ",AOOO." << endl;
    }
};

class Pig:public Animal
{
public:
    Pig(string n, int a): Animal(n, a){}
    void Dis()
    {
        cout << "Hello,I am " << name << ",HENGHENG." << endl;
    }
};

class Duck:public Animal
{
public:
    Duck(string n, int a): Animal(n, a){}
    void Dis()
    {
        cout << "Hello,I am " << name << ",GAGA." << endl;
    }
};

class Dog:public Animal
{
public:
    Dog(string n, int a): Animal(n, a){}
    void Dis()
    {
        cout << "Hello,I am " << name << ",WangWang." << endl;
    }
};

int main()
{
    string name, ani;
    int age, t;
    Animal *a[100];
    cin >> t;
    for(int i = 0; i < t; i ++ )
    {
        cin >> ani >> name >> age;
        if(ani == "Tiger")
        {
            a[i] = new Tiger(name, age);
            a[i]->Dis();
        }
        else if(ani == "Pig")
        {
            a[i] = new Pig(name, age);
            a[i]->Dis();
        }
        else if(ani == "Duck")
        {
            a[i] = new Duck(name, age);
            a[i]->Dis();
        }
        else if(ani == "Dog")
        {
            a[i] = new Dog(name, age);
            a[i]->Dis();
        }
        else
        {
            cout << "There is no " << ani << " in our Zoo." << endl;
        }
    }
}
```

### 圆和圆柱体计算（继承）:

```cpp
#include<iostream>
using namespace std;

class Point
{
protected:
    double x, y;
public:
    int getX(){ return x; }
    int getY(){ return y; }
};

class Circle : public Point
{
protected:
    double radius;
public:
    Circle() {}
    Circle(double X, double Y, double r)
    {
        x = X, y = Y, radius = r;
    }
    int getR(){ return radius; }
    double Area()
    {
        return 3.14 * radius * radius;
    }
    void DisplayCir()
    {
        printf("Circle:(%d,%d),%d\n", getX(),getY(),getR());
        printf("Area:%.2lf\n", Area());
    }
};

class Cylinder : public Circle
{
    double high;
public:
    Cylinder(double X, double Y, double r, double h)
    {
        x = X, y = Y, radius = r, high = h;
    }
    int getH() { return high; }
    double Volume()
    {
        return Area() * high;
    }
    void DisplayCyl()
    {
        printf("Cylinder:(%d,%d),%d,%d\n", getX(),getY(),getR(), getH());
        printf("Volume:%.2lf\n", Volume());
    }
};

int main()
{
    double x, y, r, h;
    cin >> x >> y >> r;
    Circle c1(x, y, r);
    c1.DisplayCir();
    cin >> x >> y >> r >> h;
    Cylinder cy(x, y, r, h);
    cy.DisplayCyl();

    return 0;
}
```

### 在职研究生（多重继承）:

```cpp
#include<iostream>
using namespace std;

class People
{
protected:
    string name, sex;
    int age;
public:
    People(){}
    People(string n, string s, int a):name(n), sex(s), age(a){}
    void display()
    {
        cout << "People:" << endl;
        cout << "Name: " << name << endl;
        cout << "Sex: " << sex << endl;
        cout << "Age: " << age << endl;
        cout << endl;
    }
};

class Stu:virtual public People
{
protected:
    string id;
    double grade;
public:
    Stu(){}
    Stu(string n, string s, int a, string ID, double g):People(n, s, a), id(ID), grade(g){}
    void display()
    {
        cout << "Student:" << endl;
        cout << "Name: " << name << endl;
        cout << "Sex: " << sex << endl;
        cout << "Age: " << age << endl;
        cout << "No.: " << id << endl;
        cout << "Score: " << grade << endl;
        cout << endl;
    }
};

class Tea:virtual public People
{
protected:
    string work, dep;
public:
    Tea(){}
    Tea(string n, string s, int a, string w, string d):People(n, s, a),work(w), dep(d){}
    void display()
    {
        cout << "Teacher:" << endl;
        cout << "Name: " << name << endl;
        cout << "Sex: " << sex << endl;
        cout << "Age: " << age << endl;
        cout << "Position: " << work << endl;
        cout << "Department: " << dep << endl;
        cout << endl;
    }
};

class Grad:public Tea, public Stu
{
    string tea, dire;
public:
    Grad(){}
    Grad(string n, string s, int a, string ID, double g, string w, string d, string dir, string tea):People(n, s, a)
    {
        this -> id = ID, this ->grade = g;
        work = w, dep = d, this -> tea = tea, this -> dire = dir;
    }
    void display()
    {
        cout << "GradOnWork:" << endl;
        cout << "Name: " << name << endl;
        cout << "Sex: " << sex << endl;
        cout << "Age: " << age << endl;
        cout << "No.: " << id << endl;
        cout << "Score: " << grade << endl;
        cout << "Position: " << work << endl;
        cout << "Department: " << dep << endl;
        cout << "Direction: " << dire << endl;
        cout << "Tutor: " << tea << endl;
    }
};

int main()
{
    string name, sex, id, work, dep, dir, tea;
    int age;
    double gra;
    cin >> name >> sex >> age;
    cin >> id >> gra;
    cin >> work >> dep;
    cin >> dir >> tea;

    People p(name, sex, age);
    p.display();

    Stu stu(name, sex, age, id, gra);
    stu.display();

    Tea tea1(name, sex, age, work, dep);
    tea1.display();

    Grad grad(name, sex, age, id, gra, work, dep, dir, tea);
    grad.display();

    return 0;
}
```

### 学生类定义（类和对象）:

```cpp
#include<iostream>
using namespace std;
class student{
public:
    string name;
    string id;
    string college;
    string major;
    string xinBie;
    string address;
    string phoneNumber;
};

int main(){
    int t;
    cin >> t;
   student stu[t];
   for( int i=0; i<t; i++){
       cin >> stu[i].name >> stu[i].id >> stu[i].college >> stu[i].major
           >> stu[i].xinBie >> stu[i].address >> stu[i].phoneNumber;
   }
   for( int i=0; i<t; i++){
       cout << stu[i].name << " " << stu[i].id << " " << stu[i].college
       << " " << stu[i].major << " " <<  stu[i].xinBie
       << " " << stu[i].address << " " << stu[i].phoneNumber << endl;
   }
   return 0;
}
```

### 小票输入输出（结构体）:

```cpp
#include<iostream>
using namespace std;

struct Pos
{
    string name, te, op, ci, cn, tr, co, va;
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Pos pos;
        cin >> pos.name >> pos.te >> pos.op >> pos.ci >> pos.va
        >> pos.cn >> pos.tr >> pos.co;
        cout << "Name: " << pos.name << endl
        << "Terminal: " << pos.te << " operator: " << pos.op << endl
        << "Card Issuers: " << pos.ci << " Validity: " << pos.va << endl
        << "CardNumber: " << pos.cn.substr(0,4) << "********"
        << pos.cn.substr(12,4) << endl
        << "Traded: " << pos.tr << endl
        << "Costs: $" << pos.co << endl << endl;
    }
    return 0;
}
```

### 教师类定义（类和对象）:

```cpp
#include<iostream>
using namespace std;
class teacher{
public:
    string name;
    string sex;
    string college;
    string zhiChen;
    string zhiWu;
    string xueLi;
    string office;
    string phoneNumber;
};

int main(){
    int t;
    cin >> t;
    teacher *tea = new teacher[t];
    for( int i=0; i<t; i++){
        cin >> tea[i].name >> tea[i].sex >> tea[i].college
        >> tea[i].zhiChen >> tea[i].zhiWu >> tea[i].xueLi
        >> tea[i].office >> tea[i].phoneNumber;
    }
    for( int i=0; i<t; i++){
        cout << tea[i].name << " " << tea[i].sex << " " << tea[i].college
        << " " << tea[i].zhiChen << " " << tea[i].zhiWu
        << " " << tea[i].xueLi<< " " << tea[i].office
        << " " << tea[i].phoneNumber << endl;
    }
    return 0;
}
```

### 求最大值最小值（引用）:

```cpp
#include<iostream>
using namespace std;

void find(int *num, int n, int &MinIdx, int &MaxIdx)
{
    int Min = 0x3f3f3f3f, Max = -Min;
    for(int i = 0; i < n; i ++ )
    {
        if(Min > num[i]) Min = num[i], MinIdx = i;
        if(Max < num[i]) Max = num[i], MaxIdx = i;
    }
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int *num, n, MinIdx, MaxIdx;
        cin >> n;
        num = new int[n];
        for(int i = 0; i < n; i ++ ) cin >> num[i];
        find(num, n, MinIdx, MaxIdx);
        cout << "min=" << num[MinIdx] << " minindex=" << MinIdx << endl;
        cout << "max=" << num[MaxIdx] << " maxindex=" << MaxIdx << endl;
        cout << endl;
    }
}
```

### 点到原点的距离（继承）:

```cpp
#include<iostream>
#include<cmath>
using namespace std;

class Podouble_1D
{
public:
    double x;
    double Distance()
    {
        return fabs(x);
    }
};

class Podouble_2D: public Podouble_1D
{
public:
    double y;
    double Distance()
    {
        double dis = x * x + y * y;
        return sqrt(dis);
    }
};

class Podouble_3D: public Podouble_2D
{
public:
    double Distance()
    {
        double dis = x * x + y * y + z * z;
        return sqrt(dis);
    }
    void setZ(double Z)
    {
        z = Z;
    }
    double getZ(){ return z; }
protected:
    double z;
};

int main()
{
    int n;
    while(cin >> n, n)
    {
        if(n == 1)
        {
            Podouble_1D p1;
            cin >> p1.x;
            printf("Distance from Point (%.2lf) to original point is %.2lf\n", p1.x, p1.Distance());
        }
        else if(n == 2)
        {
            Podouble_2D p2;
            cin >> p2.x >> p2.y;
            printf("Distance from Point (%.2lf, %.2lf) to original point is %.2lf\n", p2.x, p2.y, p2.Distance());
        }
        else if(n == 3)
        {
            Podouble_3D p3;
            double z;
            cin >> p3.x >> p3.y >> z;
            p3.setZ(z);
            printf("Distance from Point (%.2lf, %.2lf, %.2lf) to original point is %.2lf\n", p3.x, p3.y, p3.getZ(), p3.Distance());
        }
    }
    return 0;
}
```

### 矩形关系（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class CPoint
{
    int x, y;
public:
    CPoint(int x, int y):x(x), y(y){}
    int getX(){return x;}
    int getY(){return y;}
};

bool cmp(CPoint& p1, CPoint& p2)
{
    if(p1.getY() == p2.getY() && p1.getX() == p2.getX()) return true;
    return false;
}

class CRectangle
{
    CPoint left, right;
public:
    CRectangle(int x1, int y1, int x2, int y2): left(x1, y1), right(x2, y2){}
    friend ostream& operator << (ostream& ot, CRectangle& r1)
    {
        ot << r1.left.getX() << " " << r1.left.getY() << " ";
        ot << r1.right.getX() << " " << r1.right.getY();
        return ot;
    }
    operator int()
    {
        int a = right.getX() - left.getX();
        int b = left.getY() - right.getY();
        int area = abs(a * b);
        return area;
    }
    friend bool operator > (CPoint& p, CRectangle& r)
    {
        int x = p.getX(), y = p.getY();
        int x1 = r.left.getX(), y1 = r.left.getY();
        int x2 = r.right.getX(), y2 = r.right.getY();
        if(x >= x1 && x <= x2 && y <= y1 && y >= y2)
            return true;
        return false;
    }

    friend bool operator > (CRectangle& r1, CRectangle& r2)
    {
        CPoint p1 = r2.left, p2 = r2.right;
        if(p1 > r1 && p2 > r1) return true;
        return false;
    }

    friend bool operator == (CRectangle& r1, CRectangle& r2)
    {
        CPoint p1 = r2.left, p2 = r2.right;
        CPoint p3 = r1.left, p4 = r1.right;
        if(cmp(p1,  p3) && cmp(p2, p4))
            return true;

        return false;
    }

    friend bool operator * (CRectangle& r1, CRectangle& r2)
    {
        CPoint p1 = r2.left, p2 = r2.right;
        CPoint p3 = r1.left, p4 = r1.right;
        //A.x1 > B.x2 || A.x2 < B.x1 || A.y1 > B.y2 || A.y2 < B.y1
        if(p1.getX() > p4.getX()
        || p1.getY() < p4.getY()
        || p2.getX() < p3.getX()
        || p2.getY() > p3.getY())
            return false;
        return true;
    }
};

int main()
{
    int t, x1, x2, y1, y2;
    cin >> t;
    while(t -- )
    {
        cin >> x1 >> y1 >> x2 >> y2;
        CRectangle rect1(x1, y1, x2, y2);
        cin >> x1 >> y1 >> x2 >> y2;
        CRectangle rect2(x1, y1, x2, y2);

        cout << "矩形1:" << rect1 << " " << (int)rect1 << endl;
        cout << "矩形2:" << rect2 << " " << (int)rect2 << endl;
        if(rect1 == rect2)
            cout << "矩形1和矩形2相等" << endl;
        else if(rect2 > rect1)
            cout << "矩形2包含矩形1" << endl;
        else if(rect1 > rect2)
            cout << "矩形1包含矩形2" << endl;
        else if(rect1 * rect2)
            cout << "矩形1和矩形2相交" << endl;
        else
            cout << "矩形1和矩形2不相交" <<endl;
        cout <<endl;
    }
    return 0;
}
```

### 矩阵左转（指针与数组）:

```cpp
#include <iostream>
using namespace std;

void rotate(int *matrix,int *changed_matrix)
{
    for(int i=0;i<2;i++)
    {
        for(int j=0;j<3;j++)
        {
            *(changed_matrix+(2-j)*2+i) =*(matrix+i*3+j);
        }
    }
}

int main()
{
int t;
    cin>>t;
    while (t--)
    {
    int matrix[2][3],changed_matrix[3][2];
        for(int i=0;i<2;i++)
            for(int j=0;j<3;j++)
                cin>>matrix[i][j];
        rotate(*matrix,*changed_matrix);
        for(int i=0;i<3;i++)
        {
            for(int j=0;j<2;j++)
                cout<<*(*(changed_matrix+i)+j)<<' ';
            cout<<endl;
        }
    }
    return 0;
}

```

### 矩阵相乘（运算符重载）:

```cpp
#include<vector>
#include<cstring>
#include<iostream>
using namespace std;

class Mat
{
    vector<vector<int>> mat;
    int len;
public:
    Mat(int n)
    {
        len = n;
        mat.resize(n);
        for(int i = 0; i < n; i ++ ) mat[i].resize(n);
    }

    Mat(int n, int k)
    {
        len = n;
        mat.resize(n);
        for(int i = 0; i < n; i ++ ) mat[i].resize(n);
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < n; j ++ )
                if(i == j) mat[i][j] = 1;
                else mat[i][j] = 0;
    }

    Mat(int n, vector<vector<int>> data)
    {
        len = n;
        mat.resize(n);
        for(int i = 0; i < n; i ++ ) mat[i].resize(n);
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < n; j ++ )
                mat[i][j] = data[i][j];
    }

    friend Mat operator * (Mat& m1, Mat& m2)
    {
        int t = m1.len;
        Mat tmp(t);
        for(int k = 0; k < t; k ++ )
            for(int i = 0; i < t; i ++ )
                for(int j = 0; j < t; j ++ )
                    tmp.mat[i][j] += m1.mat[i][k] * m2.mat[k][j];

        return tmp;
    }

    void Dis()
    {
        for(int i = 0; i < len; i ++ )
        {
            for(int j = 0; j < len; j ++ )
            {
                cout << mat[i][j];
                if(j == len - 1) cout << endl;
                else cout << " ";
            }
        }
    }
};

int main()
{
    int t;
    cin >> t;
    int n;
    cin >> n;
    vector<vector<int>> data;
    data.resize(n);
    for(int i = 0; i < n; i ++ ) data[i].resize(n);

    Mat m(n, 1);
    while(t -- )
    {

        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < n; j ++ )
                cin >> data[i][j];

        Mat m1(n, data);
        m = m * m1;
    }
    m.Dis();
}
```

### 矩阵相加（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class Mat
{
    int n, m, **data;
public:
    Mat(Mat& mat)
    {
        this -> n = mat.n;
        this -> m = mat.m;
        data = new int*[m];
        for(int i = 0; i < m; i ++ )
            data[i] = new int[n];

        for(int i = 0; i < m; i ++ )
            for(int j = 0; j < n; j ++ )
                data[i][j] = mat.data[i][j];
    }
    
    Mat(int mm, int nn, int **d)
    {
        this -> m = mm, this -> n = nn;
        data = new int*[m];
        for(int i = 0; i < m; i ++ )
            data[i] = new int[n];

        for(int i = 0; i < m; i ++ )
            for(int j = 0; j < n; j ++ )
                data[i][j] = d[i][j];
    }

    friend Mat& operator + (Mat& m1, Mat& m2)
    {
        for(int i = 0; i < m1.m; i ++ )
            for(int j = 0; j < m1.n; j ++ )
                m1.data[i][j] += m2.data[i][j];
        return m1;
    }

    void Dis()
    {
        for(int i = 0; i < m; i ++ )
            for(int j = 0; j < n; j ++ )
            {
                cout << data[i][j];
                if(j == n - 1) cout << endl;
                else cout << " ";
            }
    }

    ~Mat()
    {
        for(int i = 0; i < m; i ++ ) delete data[i];
        delete[] data;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n, m;
        cin >> m >> n;
        int **d;
        d = new int*[m];
        for(int i = 0; i < m; i ++ ) d[i] = new int[n];

        for(int i = 0; i < m; i ++ )
            for(int j = 0; j < n; j ++ )
                cin >> d[i][j];

        Mat m1(m, n, d);

        for(int i = 0; i < m; i ++ )
            for(int j = 0; j < n; j ++ )
                cin >> d[i][j];

        Mat m2(m, n, d);
        Mat m3(m1 + m2);
        m3.Dis();
    }
}
```

### 货币加减（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class Money
{
    int yuan, jiao, fen;
public:
    Money(int i, int j, int k):yuan(i), jiao(j), fen(k){}
    void Dis()
    {
        printf("%d元%d角%d分\n", yuan, jiao, fen);
    }
    friend Money operator + (Money& m1, Money& m2)
    {
        int i = m1.yuan + m2.yuan;
        int j = m1.jiao + m2.jiao;
        int k = m1.fen + m2.fen;
        if(k > 10) k = k % 10, j ++ ;
        if(j > 10) j = j % 10, i ++ ;
        return Money(i, j, k);
    }
    friend Money operator - (Money& m1, Money& m2)
    {
        int i = m1.yuan - m2.yuan;
        int j = m1.jiao - m2.jiao;
        int k = m1.fen - m2.fen;
        if(k < 0) k = k + 10, j -- ;
        if(j < 0) j = j + 10, i -- ;
        return Money(i, j, k);
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int i, j, k;
        string ope;
        cin >> i >> j >> k;
        Money money(i, j, k);
        while(cin >> ope)
        {
            if(ope == "stop") break;
            cin >> i >> j >> k;
            Money money1(i, j, k);
            if(ope == "add")
                money = money + money1;
            else
                money = money - money1;
        }
        money.Dis();
    }
}
```

### 向量的加减（运算符重载）:

```cpp
#include<iostream>
#include<algorithm>
using namespace std;

class Vector{
    int vec[10];
public:
    Vector(int v[])
    {
        for(int i = 0; i < 10; i ++ ) vec[i] = v[i];
    }

    Vector(){}

    Vector(const Vector& obj)
    {
        for(int i = 0; i < 10; i ++ ) vec[i] = obj.vec[i];
    }

    Vector operator +(const Vector& obj)
    {
        int tmp[10];
        for(int i = 0; i < 10; i ++ ) tmp[i] = vec[i] + obj.vec[i];
        return Vector(tmp);
    }

    Vector operator -(const Vector& obj)
    {
        int tmp[10];
        for(int i = 0; i < 10; i ++ ) tmp[i] = vec[i] - obj.vec[i];
        return Vector(tmp);
    }

    void print()
    {
        for(int i = 0; i < 10; i ++ )
        {
        	cout << vec[i];
          	if(i == 9) cout << endl;
          	else cout << " ";
        }
    }
};

int main()
{
    int t1[10], t2[10];
    for(int i = 0; i < 10; i ++ ) cin >> t1[i];
    for(int i = 0; i < 10; i ++ ) cin >> t2[i];

    Vector v1(t1), v2(t2);
    (v1 + v2).print();
    (v1 - v2).print();

    return 0;
}
```

### 员工工资（虚函数与多态）:

```cpp
#include<iostream>
using namespace std;

class Person
{
protected:
    string name, zhi;
    int money, age, level;
public:
    Person(string n, string z, int a, int l):name(n), zhi(z), age(a), level(l){}
    void Dis()
    {
        if(age < 0 || level < 0)
        {
            cout << "error grade or year." << endl;
        }
        else
        {
            cout << name << ":" << zhi << ",Salary:" << money << endl;
        }
    }
    virtual void salary(){}
};

class Employee:public Person
{
public:
    Employee(string n, string z, int a, int l): Person(n, z, a, l){}
    void salary()
    {
        money = 1000 + 500 * level + 50 * age;
    }
};

class Teamleader:public Person
{
public:
    Teamleader(string n, string z, int a, int l): Person(n, z, a, l){}
    void salary()
    {
        money = 3000 + 800 * level + 100 * age;
    }
};

class Manager:public Person
{
public:
    Manager(string n, string z, int a, int l): Person(n, z, a, l){}
    void salary()
    {
        money = 5000 + 1000 * (level + age);
    }
};

int main()
{
    string name, zhi;
    int a, l, n;
    cin >> n;
    Person *p[100];
    for(int i = 0; i < n; i ++ )
    {
        cin >> name >> zhi >> l >> a;
        if(zhi == "Employee")
        {
            p[i] = new Employee(name, zhi, a, l);
            p[i]->salary();
            p[i]->Dis();
        }
        else if(zhi == "Teamleader")
        {
            p[i] = new Teamleader(name, zhi, a, l);
            p[i]->salary();
            p[i]->Dis();
        }
        else if(zhi == "Manager")
        {
            p[i] = new Manager(name, zhi, a, l);
            p[i]->salary();
            p[i]->Dis();
        }
        else
        {
            cout << "error position." << endl;
        }
    }
}
```

### 四进制加法（运算符重载）:

```cpp
#include<vector>
#include<iostream>
#include<algorithm>
using namespace std;

class Num
{
    vector<int> num;
public:
    Num(){}
    Num(string e)
    {
        for(int i = e.size() - 1; i >= 0; i -- )
            num.push_back(e[i] - '0');
    }

    Num(vector<int> e):num(e){}

    friend Num operator+(const Num& A, const Num& B)
    {
        vector<int> C;
        int t;
        for(int i = 0; i < A.num.size() || i < B.num.size(); i ++ )
        {
            if(i < A.num.size()) t += A.num[i];
            if(i < B.num.size()) t += B.num[i];
            C.push_back(t % 4);
            t /= 4;
        }
        if(t) C.push_back(1);
        while(C.size() > 1 && C.back() == 0) C.pop_back();
        return Num(C);
    }

    void Display()
    {
        for(int i = num.size() - 1; i >= 0; i -- )
            cout << num[i];
        cout << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    Num n;
    string num;
    while(t -- )
    {
        cin >> num;
        Num n1(num);
        n = n + n1;
    }
    n.Display();
}
```

### 图形面积（虚函数与多态）:

```cpp
#include<iostream>
using namespace std;

class Shape
{
protected:
    double a, b, r;
    double area;
public:
    Shape(double a, double b):a(a), b(b){}
    Shape(double r):r(r){}
    virtual void Area(){}
    virtual void Dis()
    {
        printf("%.2lf\n", area);
    }
};

class Square:virtual public Shape
{
public:
    Square(double a, double b): Shape(a, b){}
    void Area()
    {
        area = a * b;
    }
};

class Rect:virtual public Shape
{
public:
    Rect(double a, double b): Shape(a, b){}
    void Area()
    {
        area = a * b;
    }
};

class Circle:public Shape
{
public:
    Circle(double r): Shape(r){}
    void Area()
    {
        area = 3.14 * r * r;
    }
};

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        Shape *s[3];
        double a, b, r;

        cin >> r;
        s[0] = new Circle(r);
        s[0]->Area();
        s[0]->Dis();

        cin >> a;
        s[1] = new Square(a, a);
        s[1] ->Area();
        s[1]->Dis();

        cin >> a >> b;
        s[2] = new Rect(a, b);
        s[2]->Area();
        s[2]->Dis();
    }
}
```

### 大整数计算（运算符重载）:

```cpp
#include<iostream>
using namespace std;
#include<string.h>
#include<math.h>
class CBigInteger{
	char *p;
	public:
		CBigInteger();
		CBigInteger(char *q);
	friend CBigInteger operator+(CBigInteger&,CBigInteger&);
	friend CBigInteger operator-(CBigInteger&,CBigInteger&);
	friend CBigInteger operator*(CBigInteger&,CBigInteger&);
		~CBigInteger();
		char* getp(){return p;};
	friend ostream&operator<<(ostream &,CBigInteger& );
	friend istream&operator>>(istream &,CBigInteger&);
};
ostream&operator<<(ostream &o,CBigInteger &c){
	int i;
	if(c.p[0]=='-'){
		
		o<<"("<<c.p[0];
		for(i=1;i<strlen(c.p);i++){
			if(c.p[i]!='0'){
				break;
			}
		}
		for(i;i<strlen(c.p);i++){
			o<<c.p[i];
		}
		cout<<")";
	}else{
		if(strlen(c.p)==1){
			o<<c.p;
		}else{
					for(i=0;i<strlen(c.p);i++){
			if(c.p[i]!='0'){
				break;
			}
		}
		for(i;i<strlen(c.p);i++){
			o<<c.p[i];
		}
		}

	}
	return o;
}
istream&operator>>(istream &i,CBigInteger&c){
	/*for(int i=0;i<strlen(c.p);i++){
		o>>c.p[i]>>endl;
	}*/
	i>>c.p;
	return i;
}
CBigInteger::CBigInteger(){
	p=new char[1001];
}
CBigInteger::CBigInteger(char *q){
	p=new char[1001];
	p=q;
}
CBigInteger::~CBigInteger(){
	delete[]p;
}
CBigInteger operator+(CBigInteger &c1,CBigInteger &c2){
	CBigInteger c;
	int i,sum1=0,sum2=0,sum3=0;
	if(c1.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c1.p);i++){
			sum1=sum1*10+c1.p[i]-'0';
		}
				//	cout<<"sum1"<<sum1<<endl;
	if(c2.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c2.p);i++){
			sum2=sum2*10+c2.p[i]-'0';
		}
				//	cout<<"sum2"<<sum2<<endl;
	if(c1.p[0]!='-'&&c2.p[0]!='-')
		sum3=sum1+sum2;
	else if(c1.p[0]=='-'&&c2.p[0]!='-')
		sum3=sum2-sum1;
	else if(c1.p[0]!='-'&&c2.p[0]=='-')
		sum3=sum1-sum2;
	else if(c1.p[0]=='-'&&c2.p[0]=='-'){
		sum3=-sum1-sum2;
	}
		
	//cout<<sum3<<"sum3 "<<endl;
	int len=0;
	for(i=1;sum3/i!=0;i=i*10){
		len++;
	//	cout<<len<<endl;
	}
	i=0;
	int flag=1;
	int len1=len;
	if(sum3==0){
		c.p[0]='0';
		c.p[1]='\0';
		return c;
	}
	if(sum3<0){
		sum3=-sum3;
		flag=0;
		
	}
	if(flag==0){
		c.p[0]='-';
		i=1;
		len1=len+1;
	}
	//cout<<"len="<<len<<endl;
	for(i;i<len1;i++){
		if(flag==1)
			c.p[i]=(int)(sum3/pow(10,len-i-1))%10+'0';
		//cout<<c.p[i]<<endl;
		else{
			c.p[i]=(int)(sum3/pow(10,len-i))%10+'0';
		}
	}
	c.p[len1]='\0';
	return c;
};
CBigInteger operator-(CBigInteger &c1,CBigInteger &c2){
	CBigInteger c;
	int i,sum1=0,sum2=0,sum3=0;
	if(c1.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c1.p);i++){
			sum1=sum1*10+c1.p[i]-'0';
		}
		//cout<<"sum1"<<sum1<<endl;
	if(c2.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c2.p);i++){
			sum2=sum2*10+c2.p[i]-'0';
		}

	if(c1.p[0]!='-'&&c2.p[0]!='-')
		sum3=sum1-sum2;
	else if(c1.p[0]=='-'&&c2.p[0]!='-'){
		sum3=sum2+sum1;
		sum3=-sum3;
	}
	else if(c1.p[0]!='-'&&c2.p[0]=='-')
		sum3=sum1+sum2;
	//cout<<sum3<<"sum3 "<<endl;
	int len=0;
	for(i=1;sum3/i!=0;i=i*10){
		len++;
	//	cout<<len<<endl;
	}
	if(sum3==0){
		c.p[0]='0';
		c.p[1]='\0';
		return c;
	}
	i=0;
	int len1=len;
	int flag=1;
	if(sum3<0){
		sum3=-sum3;
		flag=0;
	}
	if(flag==0){
		c.p[0]='-';
		i=1;
		len1=len+1;
	}
	//cout<<"len="<<len<<endl;
	for(i;i<len1;i++){
		if(flag==1)
			c.p[i]=(int)(sum3/pow(10,len-i-1))%10+'0';
		

		else{
			c.p[i]=(int)(sum3/pow(10,len-i))%10+'0';
		}
	
	}
	
	c.p[len1]='\0';
	return c;
};
CBigInteger operator*(CBigInteger &c1,CBigInteger &c2){
	CBigInteger c;
	long long i;
	long long sum1=0,sum2=0;
	long long sum3=0;
	if(c1.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c1.p);i++){
			sum1=sum1*10+c1.p[i]-'0';
		}
	//	cout<<"sum1 "<<sum1<<endl;
	if(c2.p[0]!='-') i=0;
	else i=1;
		for(i;i<strlen(c2.p);i++){
			sum2=sum2*10+c2.p[i]-'0';
		}
//	cout<<"sum2 "<<sum2<<endl;
	sum3=sum1*sum2;
//	cout<<"sum3 "<<sum3<<endl;
	if((c1.p[0]!='-'&&c2.p[0]=='-')||(c2.p[0]!='-'&&c1.p[0]=='-')){
		sum3=-sum3;
	}
	//cout<<sum3<<"sum3"<<endl;
	int len=0;
	for(i=1;sum3/i!=0;i=i*10){
		len++;
	}
	i=0;
	int flag=1;
	int len1=len;
		if(sum3==0){
		c.p[0]='0';
		c.p[1]='\0';
		return c;
	}
	if(sum3<0){
		sum3=-sum3;
		flag=0;
	}
	if(flag==0){
		//cout<<"1"<<endl;
		c.p[0]='-';
		i=1;
		len1=len+1;
	}
	//cout<<"i"<<i<<endl; 
	//cout<<"len1="<<len1<<endl;
			//cout<<"pow="<<(int)pow(10,0)<<endl; 
	for(i;i<len1;i++){

		if(flag==1)
			if(i==(len1-1)){
				c.p[i]=sum3%10+'0';
			}else{
				c.p[i]=(int)(sum3/pow(10,len-i-1))%10+'0';
			}

		else{
			c.p[i]=(int)(sum3/pow(10,len-i))%10+'0';
		}
		//cout<<(int)(sum3/pow(10,len-i))<<endl;
		//cout<<c.p[i]<<"   1"<<endl;
	}
	c.p[len1]='\0';
	return c;
};
int main(){
	int t;
	char op;
	CBigInteger bigNum1;
	CBigInteger bigNum2;
	cin>>t;
	while(t--){
		cin>>bigNum1>>op>>bigNum2;
		cout<<bigNum1<<" "<<op<<" "<<bigNum2<<" = ";
		if(op=='+'){
			CBigInteger num = bigNum1+bigNum2;
			cout<<num<<endl;
		}else if(op=='-'){
			CBigInteger num = bigNum1-bigNum2;
			cout<<num<<endl;
		}
		else if(op=='*'){
			CBigInteger num = bigNum1*bigNum2;
			cout<<num<<endl;
		}
		//cout<<bigNum1<<endl;
	}
}
```

### 字符串比较（指针与字符）:

```cpp
#include<iostream>
using namespace std;
int compare(char *S, char *T){
    int len1=0, len2=0;
    while( *(S+len1)!='\0'){
        len1++;
    }
    while( *(T+len2)!='\0'){
        len2++;
    }
    if( len1 > len2 ){
        return 1;
    }else if( len1 < len2 ){
        return -1;
    }else{
        int greater=0, weaker=0;
        for( int i=0; i<len1; i++){
            if( *(S+i)>*(T+i) ){
                greater++;
            }else if(*(S+i)<*(T+i)){
                weaker++;
            }
        }
        if( greater > weaker ){
            return 1;
        }else if( greater < weaker ){
            return -1;
        }else{
            return 0;
        }
    }
}
int main(){
    int t;
    cin >> t;
    while( t-- ){
        char str1[100], str2[100];
        char *S, *T;
        cin >> str1;
        cin >> str2;
        S = str1;
        T = str2;
        int n = compare(S, T);
        cout << n << endl;
    }
    return 0;
}

/*
#include<iostream>
using namespace std;
#include<cstring>

int cmp(char *S, char *T)
{
    int lenS = strlen(S);
    int lenT = strlen(T);
    
    int cnt1 = 0, cnt2 = 0;
    
    if(lenS == lenT)
    {
        for(int i = 0; i < lenS; i ++ )
        {
            if(S[i] > T[i]) cnt1 ++ ;
            else if(S[i] < T[i]) cnt2 ++ ;
        }
        if(cnt1 > cnt2) return 1;
        else if(cnt1 < cnt2) return -1;
        return 0;
    }
    else if(lenS > lenT) return 1;
    else return -1;
}

int main()
{
    int t;
    cin >> t;
    
    char S[100], T[100];
    
    while(t -- )
    {
        cin >> S;
        cin >> T;
        cout << cmp(S, T) << endl;
    }
    
    return 0;
}
*/
```

### 字符串比较（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class str
{
    string s;
public:
    str(){}
    str(string s):s(s){}
    friend bool operator > (str& s1, str& s2)
    {
        return s1.s > s2.s;
    }
    friend bool operator < (str& s1, str& s2)
    {
        return s1.s < s2.s;
    }
    friend bool operator == (str& s1, str& s2)
    {
        return s1.s == s2.s;
    }

    void Dis()
    {
        cout << s << endl;
    }
};

int main()
{
    string a, b, c;
    getline(cin, a);
    getline(cin, b);
    getline(cin, c);
    str str1(a), str2(b), str3(c);

    if(str1 > str2) str1.Dis();
    else str2.Dis();

    if(str1 < str3) str1.Dis();
    else str3.Dis();

    if(str2 == str3) str2.Dis();
    else str3.Dis();

    return 0;
}
```

### 支票账户（虚函数与多态）:

```cpp
#include<iostream>
using namespace std;

class BaseAccount
{
protected:
    string name, account;
    int balance;
public:
    BaseAccount(){}
    BaseAccount(string n, string a, int b):name(n), account(a),  balance(b){}
    void Deposit(int sum)
    {
        balance += sum;
    }

    virtual void Withdraw(int sum)
    {
        if(sum > balance)
        {
            cout << "insufficient" << endl;
            return;
        }
        balance -= sum;
    }

    virtual void Display()
    {
        cout << name << " " << account << " Balance:" << balance << endl;
    }
};

class BasePlus : public BaseAccount
{
    int limit;
public:
    BasePlus(string n, string a, int b, int l = 5000):BaseAccount(n, a,b), limit(l){}
    void Withdraw(int sum)
    {
        if(sum > balance + limit)
        {
            cout << "insufficient" << endl;
            return;
        }
        balance -= sum;
        if(balance < 0)
        {
            limit += balance;
            balance = 0;
        }
    }

    void Display()
    {
        cout << name << " " << account << " Balance:" << balance << " limit:" << limit << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    BaseAccount *Count[t];
    string name, account;
    int balance, limit, num;
    for(int i = 0; i < t; i ++ )
    {
        cin >> name >> account >> num;
        if(account[1] == 'A')
            Count[i] = new BaseAccount(name, account, num);
        else Count[i] = new BasePlus(name, account, num);

        cin >> num;
        Count[i]->Deposit(num);
        cin >> num;
        Count[i] ->Withdraw(num);
        cin >> num;
        Count[i]->Deposit(num);
        cin >> num;
        Count[i] ->Withdraw(num);
        Count[i] ->Display();
    }
    return 0;
}
```

### 旅馆旅客管理（静态成员）:

```cpp
#include<iostream>
#include<cstring>
using namespace std;

class Customer
{
public:
    Customer(string name);

    static void changeYear(int r)
    {
        Year = r;
    }

    static void xigou()
    {
        TotalCustNum = 0;
        Rent = 150;
    }

    void Display();
private:
    static int TotalCustNum;
    static int Rent;
    static int Year;
    int CustID;
    string CustName;
};

void Customer::Display()
{
    cout << CustName;
    printf(" %d%04d %d %d\n", Year, CustID, CustID, CustID * Rent);
}

int Customer::TotalCustNum = 0;
int Customer::Rent = 150;
int Customer::Year = 0;

Customer::Customer(string name)
{
    CustName = name;
    CustID = ++ TotalCustNum;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int year;
        cin >> year;
        Customer::changeYear(year);

        int cnt = 0;
        string name;
        while(cin >> name)
        {
            if(name == "0") break;
            Customer cu(name);
            cu.Display();
        }
    }
}
```

### 有界数组模板类（类模板）:

```cpp
#include<iostream>
using namespace std;

template<class T>
void mySort(T* a, int n)
{
    for(int i = 0; i < n - 1; i ++ )
        for(int j = n - 1; j > i; j -- )
            if(a[j] < a[i]) swap(a[i], a[j]);
}

template<class T>
void Print(T* a, int n)
{
    for(int i = 0; i < n; i ++ )
        cout << a[i] << " ";
    cout << endl;
}

template<class T>
void find(T* a, int n, T t)
{
    int k = -1;
    for(int i = 0; i < n; i ++ )
    {
        if(a[i] == t)
        {
            k = i;
            break;
        }
    }
    cout << k << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *a = new int[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            int t;
            cin >> t;
            mySort(a, n);
            Print(a, n);
            find(a, n, t);
        }
        else if(type == 'D')
        {
            double *a = new double[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            double t;
            cin >> t;
            mySort(a, n);
            Print(a, n);
            find(a, n, t);
        }
        else if(type == 'C')
        {
            char *a = new char[n];
            for(int i = 0; i < n; i ++ ) cin >> a[i];
            char t;
            cin >> t;
            mySort(a, n);
            Print(a, n);
            find(a, n, t);
        }
    }
    return 0;
}
```

### 汽车收费（虚函数和多态）:

```cpp
#include<iostream>
using namespace std;

class Vehicle
{
protected:
    string no;                  //编号
public:
    Vehicle(string n):no(n){}
    virtual void display() = 0; //应收费用
};

class Car : public  Vehicle
{
    int weight, num;
public:
    Car(string No, int n, int w):Vehicle(No), num(n), weight(w){}
    void display()
    {
        cout << no << " " << num * 8 + weight * 2 << endl;
    }
};

class Truck : public Vehicle
{
    int weight;
public:
    Truck(string No, int w):Vehicle(No), weight(w){}
    void display()
    {
        cout << no << " " << weight * 5 << endl;
    }
};

class Bus : public Vehicle
{
    int num;
public:
    Bus(string No, int n):Vehicle(No), num(n){}
    void display()
    {
        cout << no << " " << num * 3 << endl;
    }
};

int main()
{
    Vehicle *pv[10];
    int n, wei, num, cnt = 0;
    string no;
    cin >> n;
    while(n -- )
    {
        int type;
        cin >> type;
        switch (type)
        {
            case 1:
                cin >> no >> num >> wei;
                pv[cnt] = new Car(no, num, wei);
                break;
            case 2:
                cin >> no >> wei;
                pv[cnt] = new Truck(no, wei);
                break;
            case 3:
                cin >> no >> num;
                pv[cnt] = new Bus(no, num);
                break;
        }
        pv[cnt] -> display();
        cnt ++ ;
    }
    return 0;
}
```

### 谁的票数最高（函数模板）:

```cpp
#include<iostream>
#include<vector>
using namespace std;

template<class T>
void count(T* a, int n)
{
    int max = 0, id = 0;
    vector<int> cnt;
    cnt.assign(n, 1);
    for(int i = 0; i < n - 1; i ++ )
        for(int j = i + 1; j < n; j ++ )
            if(a[i] == a[j]) cnt[i] ++ ;

    for(int i = 0; i < n; i ++ )
        if(cnt[i] > max)
        {
            max = cnt[i];
            id = i;
        }
    cout << a[id] << " " << cnt[id] << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        char type;
        int n;
        cin >> type >> n;
        if(type == 'I')
        {
            int *b = new int[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            count(b, n);
        }
        else if(type == 'C')
        {
            char *b = new char[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            count(b, n);
        }
        else
        {
            string *b = new string[n];
            for(int i = 0; i < n; i ++ )
                cin >> b[i];
            count(b, n);
        }
    }

    return 0;
}
```

### 三串合一（指针与字符数组）:

```cpp
#include<iostream>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        //读入字符串
        char ch0[3][11];
        for(int i = 0; i < 3; i ++)
        {
            cin >> ch0[i];
//            cout << ch0[i] << endl;
        }

        //st数组记录开始的a， ed数组记录结束的b，
        // sub多余了，懒得删掉，len表示长度
        int st[3], ed[3], len = 0;
        for(int i = 0; i < 3; i ++ )
        {
            cin >> st[i] >> ed[i];
            len += ed[i] - st[i] + 1;
        }
//        cout << len << endl;
        char *ch = new char[len + 1];

        int cnt = 0;//记录当前赋值到第几个字符了

        //赋值
        for(int i = 0; i < 3; i ++ )
        {
            for(int j = st[i] - 1; j < ed[i]; j ++ )
            {
//                ch0[i][j]
                *(ch + cnt) = *( *(ch0 + i) + j);
                cnt ++ ;
            }
        }
        *(ch + cnt) = '\0';
        cout << ch << endl;
    }
    return 0;
}
```

### 复数（输入输出运算符重载）:

```cpp
#include<iostream>
using namespace std;

class CComplex
{
    int real, imag;
public:
    CComplex()
    {
        real = 0, imag = 0;
    }

    friend istream& operator >>(istream &in, CComplex &a)
    {
        in >> a.real >> a.imag;
        return in;
    }

    friend ostream& operator <<(ostream &out, CComplex &a)
    {
        if(a.imag != 0 && a.real == 0) out << a.imag << "i" << endl;
        else if(a.imag == 0 && a.real != 0) out << a.real << endl;
        else if(a.imag == 0 && a.real == 0) out << 0 << endl;
        else
        {
            if(a.imag < 0) out << a.real << a.imag << "i" << endl;
            else out << a.real << "+" << a.imag << "i" << endl;
        }
        return out;
    }
};

int main()
{
    int n;
    double r, i;
    CComplex x;
    cin >> n;
    while(n -- )
    {
        cin >> x;
        cout << x;
    }
    return 0;
}
```

### 宠物的生长（虚函数和多态）:

```cpp
#include<iostream>
using namespace std;
class Date
{
    int year, month, day;
public:
    Date(int y,int m,int d):year(y), month(m), day(d){}
    bool isLeap()
    {
        return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0);
    }
    bool check(Date& d)
    {
        if(d.year != year) return d.year > year;
        if(d.month != month) return d.month > month;
        if(d.day != day) return d.day > day;
        return true;
    }
    int abs(Date& d)
    {
        int monthDay[] = { 31,isLeap() ? 29 : 28,31,30,31,30,31,31,30,31,30,31 };
        int s[13] = {0};
        for(int i = 1; i <= 12; i ++ ) s[i] = s[i - 1] + monthDay[i];
        if(d.month == month && d.year == year) return d.day - day;
        if(d.year == year)
        {
            int a1 = s[d.month - 1] + d.day;
            int a2 = s[month - 1] + day;
            return a1 - a2 + 1;
        }

    }
};

class Pet
{
protected:
    string name;//姓名
    double length;//身长
    double weight;//体
    Date current;//开始记录时间
public:
    Pet(string n, double l, double w, Date& d):name(n), length(l), weight(w), current(d){}
    virtual void display(Date day)=0;//输出目标日期时宠物的身长和体重
};

class Cat : public Pet
{
    double hrate, wrate;
public:
    Cat(string n, double l, double w, Date& d):Pet(n, l, w, d)
    {
        hrate = 0.1, wrate = 0.2;
    }
    void display(Date day)
    {
        length += current.abs(day) * hrate;
        weight += current.abs(day) * wrate;
        cout << name << " after " <<  current.abs(day);
        printf(" day: length=%.2lf,weight=%.2lf\n", length, weight);
    }
};

class Dog : public Pet
{
    double hrate, wrate;
public:
    Dog(string n, double l, double w, Date& d):Pet(n, l, w, d)
    {
        hrate = 0.2, wrate = 0.1;
    }
    void display(Date day)
    {
        length += current.abs(day) * hrate;
        weight += current.abs(day) * wrate;
        cout << name << " after " <<  current.abs(day);
        printf(" day: length=%.2lf,weight=%.2lf\n", length, weight);
    }
};

int main()
{
    int n;
    Pet *pet[10];
    cin >> n;
    int y, m, d;
    double l, w;
    string name;
    cin >> y >> m >> d;
    Date begin(y, m, d);
    int cnt = 0;
    while(n -- )
    {
        int type;
        cin >> type;
        cin >> name >> l >> w >> y >> m >> d;
        Date date(y, m, d);
        if(type == 1) pet[cnt] = new Cat(name, l, w, begin);
        else pet[cnt] = new Dog(name, l, w, begin);

        if(!begin.check(date)) cout << "error" << endl;
        else pet[cnt] ->display(date);
        
        cnt ++ ;
    }
    return 0;
}
```

### 数字判断（指针为函数参数）:

```cpp
#include<iostream>
using namespace std;

int isNumber(char *p, int len){
    int k, sum=0;
    for( int i = 0; i < len; i ++ ){
        if( *(p+i) <= '9' && *(p+i) >= '0' ){
            k = *(p+i) - '0';
            sum = sum * 10 + k;
        }else{
            return -1;
        }
    }
    return sum;
}

int main(){
    int t;
    cin >> t;
    while(t -- ){
        char ch[100];
        cin >> ch;
        int i=0;
        while(ch[i] != '\0'){
            i++;
        }
        char *p=ch;
        int n = isNumber(p, i);
        cout << n << endl;
    }
    return 0;
}

// #include<iostream>
// #include<cstring>
// #include<stack>
// using namespace std;

// int isNumber(char *str)
// {
//     stack<int> st;
//     int len = strlen(str);
//     for(int i = 0; i < len; i ++ )
//     {
//         if(str[i] <= '9' && str[i] >= '0')
//             st.push(str[i] - '0');
//         else return -1;
//     }
//     int res = 1, sum = 0;
//     while(!st.empty())
//     {
//         sum += st.top() * res;
//         res *= 10;
//         st.pop();
//     }
//     return sum;
// }

// int main()
// {
//     char str[100];
//     int t;
//     cin >> t;
//     while(t -- )
//     {
//         cin >> str;
//         cout << isNumber(str) << endl;
//     }
//     return 0;
// }
```

### 时钟调整（运算符前后增量）:

```cpp
#include<iostream>
using namespace std;

class Time
{
    int h, m, s;
public:
    Time(int h, int m, int s):h(h), m(m), s(s){}

    friend Time operator ++ (Time& t)
    {
        t.s ++ ;
        if(t.s >= 60) t.s %= 60, t.m ++ ;
        if(t.m >= 60) t.m %= 60, t.h ++ ;
        if(t.h >= 12) t.h %= 12;
        return t;
    }

    friend Time operator -- (Time& t, int)
    {
        Time tmp(t);
        t.s -- ;
        if(t.s < 0)
        {
            t.s += 60;
            t.s %= 60;
            t.m -- ;
        }
        if(t.m < 0)
        {
            t.m += 60;
            t.m %= 60;
            t.h -- ;
        }
        if(t.h < 0)
        {
            t.h += 12;
            t.h %= 12;
        }
        return tmp;
    }

    void Dis()
    {
        printf("%d:%d:%d\n", h, m, s);
    }
};

int main()
{
    int h, s, m, t;
    cin >> h >> m >> s >> t;
    Time time(h, m, s);
    while(t -- )
    {
        int n;
        cin >> n;
        if(n > 0) while(n -- ) ++ time;
        else
        {
            n *= -1;
            while(n -- ) time -- ;
        }
        time.Dis();
    }
}
```

### 求最大面积（虚函数和多态）:

```cpp
#include<iostream>
using namespace std;

class Geometry
{
public:
    virtual double getArea() = 0; //计算面积，结果保留小数点后两位
};

class Rect:public Geometry
{
    double l, w;
public:
    Rect(double ll, double ww):l(ll), w(ww){}
    double getArea()
    {
        return l * w;
    }
};

class Circle:public Geometry
{
    double r;
public:
    Circle(double rr):r(rr){}
    double getArea()
    {
        return r * r * 3.14;
    }
};

class TotalArea
{
public:
    static void computerTotalArea(Geometry** t, int n)
    {
        double Max = 0;
        for(int i = 0; i < n; i ++ )
        {
            Max = max(Max, t[i] -> getArea());
        }
        printf("最大面积=%.2lf\n", Max);
    }
};

int main()
{
    int t;
    cin >> t;
    Geometry **g;
    g = new Geometry*[t];
    for(int i = 0; i < t; i ++ )
    {
        int type;
        double a, b;
        cin >> type;
        if(type == 1)
        {
            cin >> a >> b;
            g[i] = new Rect(a, b);
        }
        else
        {
            cin >> a;
            g[i] = new Circle(a);
        }
    }
    TotalArea::computerTotalArea(g, t);
    return 0;
}
```

### 组链表与通讯录（期末模拟）:

```cpp
#include<iostream>
using namespace std;

const int hmax = 26;

class Info
{   //联系人，用一个链表结点表示
    string name; //姓名
    int phoneNo; //电话
public:
    Info* next;  //指向下一个结点
    Info(string tn = "no name", int pno = 0)
    {
        name = tn;
        phoneNo = pno;
        next = nullptr;
    }

    void Print()
    {
        cout << name << "--" << phoneNo << endl;
    }
    //属性的get和set方法....自行定义
    string getN(){return name;}
    int getP() const{return phoneNo;}

    void setP(int p){phoneNo = p;}
};

class PhoneBook
{
    //组链表方式实现通讯录
    //....自行增加一些操作
    //提示：把插入和查找先写成内部函数，再被运算符重载调用，会更方便
public:
    Info Table[hmax];//链表头结点数组，对应26个大写字母
    //以下定义五个操作：输入Input、打印Print、插入、合并、查找
    //具体操作看前面说明
    void Input();
    friend PhoneBook& operator += (PhoneBook&pb, Info& Inf);
    friend PhoneBook& operator + (PhoneBook&pb, PhoneBook&pc);
    Info* operator() (string name);
    void Print();
};

//...PhoneBook类成员函数，类外实现，自行编写
Info* PhoneBook::operator () (string n)
{
    int idx = n[0] - 'A';
    Info *p = Table[idx].next;
    while(p)
    {
        if(p->getN() == n) return p;
        p = p -> next;
    }
    return nullptr;
}

void PhoneBook::Print()
{
    for(int i = 0; i < hmax; i ++ )
    {
        if(Table[i].next == nullptr) continue;
        cout << (char)('A' + i) << "--";
        Info *p = Table[i].next;
        while(p)
        {
            cout << p->getN() << "." << p->getP() << "--";
            p = p -> next;
        }
        cout << endl;
    }
}

PhoneBook& operator += (PhoneBook&pb, Info &Inf)
{
    string name = Inf.getN();
    int idx = name[0] - 'A';
    Info *p = pb.Table[idx].next;
    bool flag = 0;
    while(p)
    {
        if(p -> getN() == name)
        {
            flag = 1;
            p -> setP(Inf.getP());
            break;
        }
        p = p -> next;
    }

    if(!flag)
    {
        Inf.next = pb.Table[idx].next;
        pb.Table[idx].next = &Inf;
    }

    return pb;
}

PhoneBook& operator + (PhoneBook&pb, PhoneBook&pc)
{
    for(int i = 0; i < hmax; i ++ )
    {
        Info *p = pc.Table[i].next;
        while(p)
        {
            bool flag = false;
            Info *q = pb.Table[i].next;
            while(q)
            {
                if(q->getN() == p->getN())
                {
                    q->setP(p->getP());
                    flag = true;
                    break;
                }
                q = q -> next;
            }

            Info *tmp1 = p -> next;
            if(!flag)
            {
                Info *tmp = p;
                tmp -> next = pb.Table[i].next;
                pb.Table[i].next = tmp;
            }
            p = tmp1;
        }
    }
    return pb;
}

void PhoneBook::Input()
{
    int n, phone;
    string name;

    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        cin >> name >> phone;
        Info *p = new Info(name, phone);

        int idx = name[0] - 'A';

        p ->next = Table[idx].next;
        Table[idx].next = p;
    }
}

int main()
{
    string tname;
    int i, tno;
    Info *p;
    PhoneBook pb;
    pb.Input(); //接收输入数据，初始化第一个通讯录

    //两次姓名查找
    for (i = 0; i < 2; i ++ )
    {
        cin >> tname;
        p = pb(tname); //调用()运算符，实现查找
        if(p) p -> Print(); //查找成功，输出联系人信息
        else cout << "查找失败" << endl; //查`找失败，输出提示信息
    }

    //一次插入
    cin >> tname >> tno;
    Info temp(tname, tno);
    pb += temp; //调用+=运算符，实现插入新联系人

    //通讯录合并
    PhoneBook pc;
    pc.Input(); //初始化第二个通讯录
    pb = pb + pc; //调用+运算符，实现合并
    pb.Print(); //输出所有操作后的通讯录

    return 0;
}
```

### 进位与借位（虚函数和多态）:

```cpp
#include<vector>
#include<iostream>
using namespace std;

class Group
{
public:
    virtual int add(int x, int y) = 0;//输出加法的运算结果
    virtual int sub(int x, int y) = 0;//输出减法的运算结果
};

class GroupA : public Group
{
public:
    int add(int x, int y)
    {
        cout << x + y << endl;
    }
    int sub(int x, int y)
    {
        cout << x - y << endl;
    }
};

class GroupB : public Group
{
public:
    int add(int x, int y)
    {
        cout << x + y << endl;
    }
    int sub(int x, int y)
    {
        vector<int> A, B, C;
        while(x) A.push_back(x % 10), x /= 10;
        while(y) B.push_back(y % 10), y /= 10;
        for(int i = 0; i < A.size() || i < B.size(); i ++ )
        {
            int abs = 0;
            abs = (A[i] - B[i] + 10) % 10;
            C.push_back(abs);
        }
        for(int i = C.size() - 1; i >= 0; i -- )
            cout << C[i];
        cout << endl;
    }
};

class GroupC : public Group
{
public:
    int add(int x, int y)
    {
        vector<int> A, B, C;
        while(x) A.push_back(x % 10), x /= 10;
        while(y) B.push_back(y % 10), y /= 10;
        for(int i = 0; i < A.size() || i < B.size(); i ++ )
        {
            int sum = 0;
            if(A.size() > i) sum += A[i];
            if(B.size() > i) sum += B[i];
            sum %= 10;
            C.push_back(sum);
        }
        for(int i = C.size() - 1; i >= 0; i -- )
            cout << C[i];
        cout << endl;
    }
    int sub(int x, int y)
    {
        vector<int> A, B, C;
        while(x) A.push_back(x % 10), x /= 10;
        while(y) B.push_back(y % 10), y /= 10;
        for(int i = 0; i < A.size() || i < B.size(); i ++ )
        {
            int abs = 0;
            abs = (A[i] - B[i] + 10) % 10;
            C.push_back(abs);
        }
        for(int i = C.size() - 1; i >= 0; i -- )
            cout << C[i];
        cout << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    Group *group[t];
    for(int i = 0; i < t; i ++ )
    {
        int type, a, b;
        char ch;
        scanf("%d%d%c%d", &type, &a, &ch, &b);
        switch (type)
        {
            case 1:
                group[i] = new GroupA;
                break;
            case 2:
                group[i] = new GroupB;
                break;
            case 3:
                group[i] = new GroupC;
                break;
        }
        if(ch == '+') group[i] -> add(a, b);
        else group[i] -> sub(a,b);
    }
}
```

### 人民币输出（输出运算符重载）:

```cpp
#include<iostream>
using namespace std;

class Money
{
    double num;
    int y, j, f;
public:
    Money(){}
    friend istream& operator >> (istream& in, Money& m)
    {
        in >> m.num;
        int k = m.num * 100;
        m.y = k / 100, m.j = k / 10 % 10;
        m.f = k % 10;
    }

    friend ostream& operator << (ostream& out, Money& m)
    {
        out << "yuan=" << m.y << " jiao=" << m.j << " fen=" << m.f << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    Money money;
    while(t -- )
    {
        cin >> money;
        cout << money;
    }
}
```

### 动态矩阵（指针与堆内存分配）:

```cpp
#include<iostream>
using namespace std;

int main()
{
    int t;
    cin >> t;

    while(t -- )
    {
        int Max = -0x3f3f3f3f;
        int Min = -Max;

        int n, m;
        cin >> n >> m;
        int **a = NULL;
        a = new int *[n];
        for(int i = 0; i < n; i ++ )
        {
            a[i] = new int[m];
        }

        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < m; j ++ )
            {
                cin >> a[i][j];
                Min = min(Min, a[i][j]);
                Max = max(Max, a[i][j]);
            }

        cout << Min << " " << Max << endl;
    }
    return 0;
}
```

### 日期时间合并输出（友元函数）:

```cpp
#include<iostream>
using namespace std;

class Time;
class Date
{
    friend void Display(Date &D, Time &T);
    int y, m, d;
public:
    Date(int year, int month, int day)
    {
        y = year, m = month, d = day;
    }
};

class Time
{
    friend void Display(Date &D, Time &T);
    int h, m, s;
public:
    Time(int hour, int minute, int second)
    {
        h = hour, m = minute, s = second;
    }
};

void Display(Date &D, Time &T)
{
    printf("%4d-%02d-%02d %02d:%02d:%02d\n", D.y, D.m, D.d, T.h, T.m, T.s);
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int y, mo, d, h, mi, s;
        cin >> y >> mo >> d >> h >> mi >> s;
        Date date(y, mo, d);
        Time time(h, mi, s);
        Display(date, time);
    }
    return 0;
}
```

### 复数的加减乘运算（运算符重载）:

```cpp
#include<iostream>
using namespace std;

class Com
{
    int real, imag;
public:
    Com(int r, int i):real(r), imag(i){}

    friend Com operator + (Com& c1, Com& c2)
    {
        int r = c1.real + c2.real;
        int i = c1.imag + c2.imag;
        return Com(r, i);
    }

    friend Com operator - (Com& c1, Com& c2)
    {
        int r = c1.real - c2.real;
        int i = c1.imag - c2.imag;
        return Com(r, i);
    }

    friend Com operator * (Com& c1, Com& c2)
    {
        int r = c1.real * c2.real - c1.imag * c2.imag;
        int i = c1.imag * c2.real + c1.real * c2.imag;
        return Com(r, i);
    }

    void Dis()
    {
        cout << "Real=" << real << " Image=" << imag << endl;
    }
};

int main()
{
    int r, i;

    cin >> r >> i;
    Com c1(r, i);
    cin >> r >> i;
    Com c2(r, i);
    (c1 + c2).Dis();
    (c1 - c2).Dis();
    (c1 * c2).Dis();
}
```

### 学生生日差值计算（运算符重载）:

```cpp
#include<iostream>
#include<algorithm>
using namespace std;

int month[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
int day[13] = {0};

class Stu
{
    string name;
    int y, m, d;
public:
    Stu(){}
    Stu(string n, int y, int m, int d):name(n), y(y), m(m), d(d){}
    string getN(){return name;}

    friend int operator - (const Stu& s1, const Stu& s2)
    {
        int tot1 = day[s1.m] + s1.d;
        int tot2 = day[s2.m] + s2.d + (s2.y - s1.y) * 365;
        return abs(tot2 - tot1);
    }

    friend bool operator < (Stu& s1, Stu& s2)
    {
        if(s1.y != s2.y) return s1.y < s2.y;
        if(s1.m != s2.m) return s1.m < s2.m;
        if(s1.d != s2.m) return s1.d < s2.d;
    }
};



int main()
{
    for(int i = 1; i <= 12; i ++ ) day[i] = day[i - 1] + month[i];

    int n, y, m, d;
    string name;
    cin >> n;
    Stu stu[100];
    for(int i = 0; i < n; i ++ )
    {
        cin >> name >> y >> m >> d;
        stu[i] = Stu(name, y, m, d);
    }
    sort(stu, stu + n);
    cout << stu[0].getN() << "和" << stu[n - 1].getN();
    cout << "年龄相差最大，为" << stu[n - 1] - stu[0] << "天。\n";
}
```

### 蛇形矩阵（指针与动态内存分配）:

```cpp
#include<iostream>
using namespace std;

void snake_mat(int n)
{
    int **mat = new int*[n];
    for(int i = 0; i < n; i ++ )
        mat[i] = new int[n];

    int left = 0, right = n - 1, top = 0, bottom = n - 1;
    int k = 1;

    while(left <= right && top <= bottom)
    {
        for(int i = left; i <= right; i ++ )
            mat[top][i] = k ++ ;
        
        for(int i = top + 1; i <= bottom; i ++ )
            mat[i][right] = k ++ ;

        for(int i = right - 1; i >= left && top < bottom; i -- )
            mat[bottom][i] = k ++ ;
        
        for(int i = bottom - 1; i > top && left < right; i -- )
            mat[i][left] = k ++ ;

        left ++ , right -- , top ++ , bottom -- ;
    }

    for(int i = 0; i < n; i ++ )
        for(int j = 0; j < n; j ++ )
        {
            cout << mat[i][j];
            if(j == n - 1) cout << endl;
            else cout << " ";
        }
        
    for(int i = 0; i < n; i ++ )
        delete[] mat[i];

    delete[] mat;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        cin >> n;
        snake_mat(n);
        cout << endl;
    }
    return 0;
}
```

### 身份证号码升位（拷贝构造函数）:

```cpp
#include<iostream>
#include<string>

using namespace std;

class Date
{
protected:
    int year, month, day;
public:
    Date(){}
    Date(int y,int m,int d):year(y), month(m), day(d){}

    bool check() //检验日期是否合法
    {
        int monthDay[] = { 31,isLeap() ? 29 : 28,31,30,31,30,31,31,30,31,30,31 };
        if (day < 0 || year < 0 || month < 0 || month > 12 || day > monthDay[month - 1]) return false;
        return true;
    }

    bool isLeap()
    {
        return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
    }

    int getY(){ return year;}
    int getM(){ return month;}
    int getD(){ return day;}

    void print()
    {
        printf("%d年%d月%d日", year, month, day);
    }
};

class StuID
{
    string name, ID;
    Date birthday;
    int registered;
public:
    StuID(string n, string id, Date d):name(n), ID(id), birthday(d){}

    StuID(StuID& stuid)
    {
        this -> name = stuid.name;
        this -> birthday = stuid.birthday;
        this -> registered = stuid.registered;
        this -> ID = stuid.ID;
        if(ID.size() == 15)
        {
            ID.insert(6, to_string(birthday.getY()), 0, 2);
            int a[17]={7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
            int sum = 0, mod;
            for(int j = 0; j < 17; j ++ ) sum += (ID[j] - '0') * a[j];
            mod = sum % 11;
            int ch[] = {1,0,0,9,8,7,6,5,4,3,2};
            if(mod == 2) ID.append("X");
            else ID.append(to_string(ch[mod]));
        }
    }

    bool check()
    {
        if(!birthday.check()) return false;

        if(ID.size() == 15)
        {
            for(char i : ID) if(i < '0' || i > '9') return false;

            string d;
            for(int i = 6, j = 0; j < 6; i ++ , j ++ ) d += ID[i];
            int a = stoi(d);
            int b = birthday.getY() % 100 * 10000;
            b += birthday.getM() * 100 + birthday.getD();
            if(a != b) return false;
        }
        else if(ID.size() == 18)
        {
            int a[17]={7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
            int sum = 0, mod;
            for(int j = 0; j < 17; j ++ ) sum += (ID[j] - '0') * a[j];
            mod = sum % 11;
            char ch[] = {'1','0','X','9','8','7','6','5','4','3','2'};
            if(ID[17] != ch[mod]) return false;

            int red, idd;
            string d;
            red = birthday.getY() * 10000 + birthday.getM() * 100 + birthday.getD();
            for(int i = 6, j = 0; j < 8; i ++ , j ++ ) d += ID[i];
            idd = stoi(d);
            if(idd != red) return false;
        }
        else return false;

        return true;
    }

    void print()
    {
        cout << name << " ";
        if(!check())
        {
            cout << "illegal id" << endl;
            return;
        }
        birthday.print();
        cout << " " << ID << endl;
    }
};

int main()
{
    int t;
    cin >> t;
    int y, m, d;
    string name, id;
    while(t -- )
    {
        cin >> y >> m >> d;
        Date day(y, m, d);
        cin >> name >> id;
        StuID stu(name, id, day);
        stu.print();
        if(id.size() == 15 && stu.check())
        {
            StuID stu1(stu);
            stu1.print();
        }
    }
    return 0;
}
```

### 银行账户（静态成员与友元函数）:

```cpp
#include<iostream>
#include<cstring>
using namespace std;
#include<string>

class Account
{
	static int count, balance_sum;
	static float Rate;
	string _accno, _accname;
	float _balance;
public:
	friend void update(Account &A, float amount1, float amount2);

	Account();

	Account(string accno, string name, float balance)
	{
		_accno = accno, _accname = name, _balance = balance;
	}

	void Deposit(float amount)
    {
        _balance += amount;
        cout << GetBalance() << " ";
        _balance *= (1 + Rate);
    }

    void Withdraw(float amount)
    {
        _balance -= amount;
    }

    float GetBalance()
    {
        return _balance;
    }

    void Show()
    {
        cout << _accno << " " << _accname << " ";
    }

	static int GetCount()
	{
		return count;
	}

	static void SetCount(int n)
	{
		count = n;
	}

	static void GetRate(float r)
    {
		Rate = r;
    }

    static int GetSum()
    {
        return balance_sum;
    }
};

int Account::count = 0;
int Account::balance_sum = 0;
float Account::Rate = 0;

void update(Account &A, float amount1, float amount2)
{
    A.Deposit(amount1);
    cout << A.GetBalance() << " ";
    A.Withdraw(amount2);
    cout << A.GetBalance() << endl;
    Account::balance_sum += A.GetBalance();
}

int main()
{
	float rat;
	int cnt;
	cin >> rat;
	cin >> cnt;
	Account::SetCount(cnt);
	Account::GetRate(rat);
	Account** acc = new Account*[cnt];

	for(int i = 0; i < cnt; i ++ )
	{
		string acco, accname;
        float balance, amount1, amount2;
        cin >> acco >> accname >> balance >> amount1 >> amount2;
        acc[i] = new Account(acco, accname, balance);
        acc[i]->Show();
        update(*acc[i], amount1, amount2);
	}

	cout << Account::GetSum() << endl;

    return 0;
}
```

### 日期比较（运算符重载之类型转换）:

```cpp
#include<iostream>
using namespace std;

class Date
{
    int y, m, d;
public:
    Date(){}
    Date(int y, int m, int d):y(y), m(m), d(d){}
    Date& operator=(int t)
    {
        y = t / 10000;
        m = t / 100 % 100;
        d = t % 100;
    }

    void Dis()
    {
        printf("%04d年%02d月%02d日\n", y, m, d);
    }
};

int main()
{
    int t, t1, t2;
    Date c1, c2;
    cin >> t;
    while(t -- )
    {
        cin >> t1 >> t2;
        c1 = t1;
        c2 = t2;
        if(t1 > t2) c1.Dis();
        else c2.Dis();
    }
    return 0;
}
```

### 计算学生成绩等级（虚函数和多态）:

```cpp
#include<iostream>
#include<algorithm>

using namespace std;

class Student
{
protected:
    string name;
    int type;
    int courses[3];
    string courseGrade;
public:
    Student(string n,int t,int a1,int a2,int a3):name(n),type(t)
    {
        courses[0] = a1,courses[1] = a2,courses[2] = a3;
    }
    virtual void calculateGrade() = 0;
    virtual ~Student() = 0;
    void print()
    {
        cout << name << ",";
        if(type == 1) cout << "本科生,";
        else cout << "研究生,";
        cout << courseGrade << endl;
    }
};
Student::~Student(){}
class Undergraduate:public Student{
public:
    Undergraduate(string n,int t,int a1,int a2,int a3) : Student(n,t,a1,a2,a3){}
    void calculateGrade()
    {
        double sum = 0;
        for(int i = 0; i < 3; i ++) sum += courses[i];
        sum /= 3;
        if(sum >= 80) courseGrade = "优秀";
        else if(sum >= 70 && sum < 80) courseGrade = "良好";
        else if(sum >= 60 && sum < 70) courseGrade = "一般";
        else if(sum >= 50 && sum < 60) courseGrade = "及格";
        else if(sum < 50) courseGrade = "不及格";
    }
};

class Postgraduate:public Student
{
public:
    Postgraduate(string n,int t,int a1,int a2,int a3) : Student(n,t,a1,a2,a3){}
    void calculateGrade()
    {
        double sum = 0;
        for(int i = 0; i < 3; i ++) sum += courses[i];
        sum /= 3;
        if(sum >= 90) courseGrade = "优秀";
        else if(sum >= 80 && sum < 90) courseGrade = "良好";
        else if(sum >= 70 && sum < 80) courseGrade = "一般";
        else if(sum >= 60 && sum < 70) courseGrade = "及格";
        else if(sum < 60) courseGrade = "不及格";
    }
};

int main()
{
    int t;cin >> t;
    Student* p[100];
    for(int i = 0; i < t; i ++ )
    {
        string name;
        int type;
        int a1 ,a2, a3;
        cin >> name >> type >> a1 >> a2 >> a3;
        if(type == 1) p[i] = new Undergraduate(name, type, a1, a2, a3);
        else p[i] = new Postgraduate(name, type, a1, a2, a3);
    }
    for(int i = 0;i < t;i ++)
    {
        p[i]->calculateGrade();
        p[i]->print();
    }
    for(int i = 0; i < t; i ++) delete p[i];
    return 0;
}
```

### 附加题、组链表与通讯录（期末模拟）:

```cpp
#include<unordered_map>
#include<iostream>
using namespace std;

const int hmax = 26;

class Info
{
    string name;
    int phoneNo;
public:
    Info* next;
    Info(string tn = "no name", int pno = 0)
    {
        name = tn;
        phoneNo = pno;
        next = nullptr;
    }

    void Print()
    {
        cout << name << "--" << phoneNo << endl;
    }

    string getN(){return name;}
    int getP(){return phoneNo;}
    void setP(int p){phoneNo = p;}
};

class PhoneBook
{
public:
    unordered_map<char, Info> Table;
    void Input();
    friend PhoneBook& operator += (PhoneBook&pb, Info& Inf);
    friend PhoneBook& operator + (PhoneBook&pb, PhoneBook&pc);
    Info* operator() (string name);
    void Print();
};

void PhoneBook::Input()
{
    int n, phone;
    string name;

    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        cin >> name >> phone;
        Info *p = new Info(name, phone);
        p ->next = Table[name[0]].next;
        Table[name[0]].next = p;
    }
}

PhoneBook& operator += (PhoneBook&pb, Info &Inf)
{
    string name = Inf.getN();
    Info *p = pb.Table[name[0]].next;
    bool flag = 0;
    while(p)
    {
        if(p -> getN() == name)
        {
            flag = 1;
            p -> setP(Inf.getP());
            break;
        }
        p = p -> next;
    }

    if(!flag)
    {
        Inf.next = pb.Table[name[0]].next;
        pb.Table[name[0]].next = &Inf;
    }

    return pb;
}

PhoneBook& operator + (PhoneBook&pb, PhoneBook&pc)
{
    for(int i = 0; i < hmax; i ++ )
    {
        Info *p = pc.Table[i + 'A'].next;
        while(p)
        {
            bool flag = false;
            Info *q = pb.Table[i + 'A'].next;
            while(q)
            {
                if(q -> getN() == p -> getN())
                {
                    q -> setP(p -> getP());
                    flag = true;
                    break;
                }
                q = q -> next;
            }

            Info *tmp1 = p -> next;
            if(!flag)
            {
                Info *tmp = p;
                tmp -> next = pb.Table[i + 'A'].next;
                pb.Table[i + 'A'].next = tmp;
            }
            p = tmp1;
        }
    }
    return pb;
}

Info* PhoneBook::operator () (string n)
{
    Info *p = Table[n[0]].next;
    while(p)
    {
        if(p->getN() == n) return p;
        p = p -> next;
    }
    return nullptr;
}

void PhoneBook::Print()
{
    for(int i = 0; i < hmax; i ++ )
    {
        if(Table[i + 'A'].next == nullptr) continue;
        cout << (char)('A' + i) << "--";
        Info *p = Table[i + 'A'].next;
        while(p)
        {
            cout << p->getN() << "." << p->getP() << "--";
            p = p -> next;
        }
        cout << endl;
    }
}

int main()
{
    string tname;
    int i, tno;
    Info *p;
    PhoneBook pb;
    pb.Input(); 

    for (i = 0; i < 2; i ++ )
    {
        cin >> tname;
        p = pb(tname); 
        if(p) p -> Print(); 
        else cout << "查找失败" << endl;
    }

    cin >> tname >> tno;
    Info temp(tname, tno);
    pb += temp;

    PhoneBook pc;
    pc.Input(); 

    pb = pb + pc; 
    pb.Print(); 

    return 0;
}
```
