---
title: DS-OJ
date: '2021-02-12T05:25:38.000Z'
updated: '2023-01-24T03:15:40.000Z'
tags: []
categories: []
slug: 2021/02/12/DS-OJ
oldUrl: /2021/02/12/DS-OJ/
excerpt: 题目源自某高校数据结构的OJ 代码仅供参考，请勿直接抄袭， (嗯，我自己学的时候也抄了好多) 本文字数过多，请善用Ctrl + F进行检索
---
题目源自某高校数据结构的OJ

## 郑重声明

> 代码仅供参考，请勿直接抄袭，~(嗯，我自己学的时候也抄了好多)~本文字数过多，请善用`Ctrl + F`进行检索

### DS–图非0面积:

```cpp
#include<iostream>
#include<cstring>
#include<queue>

using namespace std;

#define x first
#define y second

typedef pair<int, int> PII;

const int N = 1010;
bool g[N][N], st[N][N];
int n, m, t;
int cnt;

int dx[4] = {0, -1, 0, 1};
int dy[4] = {1, 0, -1, 0};

void bfs()
{
    memset(st, false, sizeof st);
    queue<PII> q;
    for(int i = 0; i < n; i ++ )
    {
        if(!g[i][0])
        {
            q.push({i, 0});
            st[i][0] = true;
        }

        if(!g[i][m - 1])
        {
            q.push({i, m - 1});
            st[i][0] = true;
        }
    }

    for(int i = 0; i < m; i ++ )
    {
        if(!g[0][i])
        {
            q.push({0, i});
            st[0][i] = true;
        }

        if(!g[n - 1][i])
        {
            q.push({n - 1, i});
            st[n - 1][i] = true;
        }
    }

    while(!q.empty())
    {
        auto t = q.front();
        q.pop();
        g[t.x][t.y] = 1;
        for(int i = 0; i < 4; i ++ )
        {
            int a = t.x + dx[i], b = t.y + dy[i];
            if(a < 0 || a >= n || b < 0 || b >= m) continue;
            if(!st[a][b] && !g[a][b]) q.push({a, b});
        }
    }
}

void count()
{
    cnt = 0;
    for(int i = 0; i < n; i ++ )
        for(int j = 0; j < m; j ++ )
            if(!g[i][j]) cnt ++ ;
}

int main()
{
    cin >> t;
    while(t -- )
    {
        cin >> n >> m;
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < m; j ++ )
                cin >> g[i][j];

        bfs();
        count();
        cout << cnt << endl;
    }
    return 0;
}
```

### DS栈–Web导航:

```cpp
#include<iostream>
#include<stack>
using namespace std;

int main(){
    stack<string> back;
    stack<string> forward;
    string ope;
    string temp = "http://www.acm.org/";
    while( cin >> ope ){
        if( ope=="QUIT" ){
            break;
        }else if( ope=="VISIT" ){
            back.push(temp);
            cin >> temp;
            cout << temp << endl;
            while( !forward.empty() ){
                forward.pop();
            }
        }else if( ope=="BACK" ){
            if(back.empty()){
                cout << "Ignored" << endl;
                continue;
            }
            forward.push(temp);
            temp = back.top();
            back.pop();
            cout << temp << endl;
        }else if( ope=="FORWARD"){
            if(forward.empty()){
                cout << "Ignored" << endl;
                continue;
            }
            back.push(temp);
            temp = forward.top();
            forward.pop();
            cout << temp << endl;
        }
    }
    return 0;
}
```

### DS树–二叉树高度:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    char data;
    BiNode *lChild;
    BiNode *rChild;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    ~BiNode(){
        delete lChild;
        delete rChild;
    }
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    void CreateTree(BiNode *&t);
    void LeafNum(BiNode *t, int deep);
public:
    int maxx;
    BiTree():root(NULL){
        maxx = 0; 
    }
    ~BiTree(){
        delete root;
    }
    void CreateTree();
    void LeafNum();
};


void BiTree::CreateTree(BiNode *&t){
    char c;
    cin >> c;
    if( c!='0' )
    {
        t = new BiNode(c);
        CreateTree(t->lChild);
        CreateTree(t->rChild);
    }else{
        t=NULL;
    }
}

void BiTree::CreateTree(){
    CreateTree(root);
}

void BiTree::LeafNum(BiNode *t, int deep){
    if(t){
        deep++;
        if( !t->rChild && !t->lChild){
            if(maxx < deep){
                maxx = deep;
            }
        }
        LeafNum(t->lChild, deep);
        LeafNum(t->rChild, deep);
    }
}

void BiTree::LeafNum(){
    LeafNum(root, 0);
    cout << maxx << endl;
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        string str;
        BiTree tree;
        tree.CreateTree();
        tree.LeafNum();
    }
    return 0;
}
```

### DS树–带权路径和:

```cpp
#include <iostream>
#include <queue>
using namespace std;

class BiNode{
    char data;
    BiNode *lChild;
    BiNode *rChild;
    int road;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    ~BiNode(){delete lChild; delete rChild;}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int count;
    queue<int> weight;
    void CreateTree(BiNode *&t, int layer);
    void preOrder(BiNode *t);
public:
    BiTree():root(NULL),count(0){}
    void CreateTree();
    void preOrder();
    void getWeight();
};

void BiTree::CreateTree(BiNode *&t,int layer) {
    char c;
    cin>>c;
    if(c!='0')
    {
        t = new BiNode(c);
        t->road = layer;
        CreateTree(t->lChild,layer+1);
        CreateTree(t->rChild,layer+1);
    }
}

void BiTree::CreateTree() {
    CreateTree(root,0);
}

void BiTree::preOrder(BiNode *t) {
    if(t)
    {
        if(!t->lChild && !t->rChild) {
            count += weight.front() * t->road;
            weight.pop();
        }
        preOrder(t->lChild);
        preOrder(t->rChild);
    }
}

void BiTree::preOrder() {
    preOrder(root);
    cout<<count<<endl;
}

void BiTree::getWeight() {
    int n;
    cin>>n;
    while (n--)
    {
        int w;
        cin>>w;
        weight.push(w);
    }
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        BiTree myTree;
        myTree.CreateTree();
        myTree.getWeight();
        myTree.preOrder();
    }
    return 0;
}

```

### DS树–二叉树之最大路径:

```cpp
#include <iostream>
#include <queue>
using namespace std;

class BiNode{
    char data;
    BiNode *lChild;
    BiNode *rChild;
    int weight;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    ~BiNode(){delete lChild;delete rChild;}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    queue<int> weights;
    int maxRoad;
    void CreateTree(BiNode *&t);
    void getRoad(BiNode *t,int road);
public:
    BiTree():root(NULL),maxRoad(0){};
    ~BiTree(){};
    void CreateTree();
    void getRoad();
};

void BiTree::CreateTree(BiNode *&t) {
    char c;
    cin>>c;
    if(c!='0')
    {
        t = new BiNode(c);
        CreateTree(t->lChild);
        CreateTree(t->rChild);
    }
    else
        t = NULL;
}

void BiTree::CreateTree() {
    CreateTree(root);
}

void BiTree::getRoad(BiNode *t, int road) {
    if(t)
    {
        t->weight = weights.front()+road;
        weights.pop();
        getRoad(t->lChild,t->weight);
        getRoad(t->rChild,t->weight);
        if(!t->lChild && !t->rChild)
            if(t->weight>maxRoad)
                maxRoad = t->weight;
    }
}

void BiTree::getRoad() {
    int n;
    cin>>n;
    while (n--)
    {
        int e;
        cin>>e;
        weights.push(e);
    }
    getRoad(root,0);
    cout<<maxRoad<<endl;

}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        BiTree myTree;
        myTree.CreateTree();
        myTree.getRoad();
    }
    return 0;
}

```

### DS队列+堆栈–数制转换:

```cpp
#include<iostream>
#include<stack>
#include<queue>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        double n;
        int k, nint;
        cin >> n >> k;
        nint = int(n);
        double ndouble = n-nint;
        stack<int> numint;
        queue<int> numdouble;

        while(nint/k!=0)
        {
            numint.push(nint%k);
            nint/=k;
        }
        numint.push(nint%k);

        int i=0;
        while( i<3 )
        {
            ndouble*=k;
            numdouble.push(int(ndouble));
            ndouble=ndouble-int(ndouble);
            i++;
        }
        char output[6]={'A','B','C','D','E','F'};

        while( !numint.empty()){
            if(numint.top()<10)
                cout << numint.top();
            else
                cout << output[numint.top()-10];
            numint.pop();
        }
        cout << ".";
        while(!numdouble.empty())
        {
            if(numdouble.front()<10)
                cout << numdouble.front();
            else
                cout << output[numdouble.front()-10];
            numdouble.pop();
        }
        cout << endl;
    }
    system("pause");
    return 0;
}
```

### DS堆栈–行编辑:

```cpp
#include<iostream>
#include<stack>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        stack<char> s;
        string str;
        cin >> str;
        int len = str.length();

        for( int i=0; i<len; i++)
        {
            if( str[i]=='#' && !s.empty())
            {
                s.pop();
            }else if( str[i]!='#')
            {
                s.push(str[i]);
            }
        }

        if(s.empty())
        {
            cout << "NULL" << endl;
        }else{
            stack<char> s1;
            while( !s.empty())
            {
                s1.push(s.top());
                s.pop();
            }

            while( !s1.empty())
            {
                cout << s1.top();
                s1.pop();
            }

            cout << endl;
        }
    }
    return 0;
}
```

### DS队列–组队列:

```cpp
#include<iostream>
#include<map>
#include<string>
#include<queue>
using namespace std;

int main()
{
    int t, j;
    int value;
    map<int, int> mem;
    cin >> t;
    queue<int> que[10];
    for( int i=0; i<t; i++)
    {
        cin >> j;
        while( j-- )
        {
            cin >> value;
            mem[value] = i;
        }
    }

    string tag;
    int flag = 1;
    while(1)
    {
        cin >> tag;
        if(tag=="ENQUEUE"){
            cin >> value;
            for( int i=0; i<10; i++)
            {
                if(que[i].empty() || mem[que[i].front()] == mem[value])
                {
                    que[i].push(value);
                    break;
                }
            }
        }else if(tag=="DEQUEUE"){
            for( int i=0; i<10; i++){
                if(!que[i].empty()){
                    cout << que[i].front() << endl;
                    que[i].pop();
                    break;
                }
            }
        }else{
            break;
        }
    }
    return 0;
}
```

### DS堆栈–括号匹配:

```cpp
#include<iostream>
#include<stack>
#include<string>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        stack<char> s;
        string str;
        cin >> str;
        int len = str.length();
        int flag=1;
        for( int i=0; i<len; i++)
        {
            if( str[i]=='(' || str[i]=='[' || str[i]=='{')
                s.push(str[i]);
            if( str[i]==')')
            {
                if( s.top()=='(')
                {
                    s.pop();
                }
                else
                {
                    flag=0;
                }
            }
            if( str[i]==']')
            {
                if( s.top()=='[')
                {
                    s.pop();
                }
                else
                {
                    flag=0;
                }
            }
            if( str[i]=='}')
            {
                if( s.top()=='{')
                {
                    s.pop();
                }
                else
                {
                    flag=0;
                }
            }
        }

        if( flag==1 && s.empty())
        {
            cout << "ok" << endl;
        }else{
            cout << "error" << endl;
        }
    }
    return 0;
}
```

### DS堆栈–迷宫求解:

```cpp
#include <iostream>
#include <stack>
using namespace std;

struct position {
    int x;
    int y;
};

class Maze {
    int **maze;
    int size;
    stack<position> path;
public:
    Maze(int n);

    ~Maze();

    void Go();
};

Maze::Maze(int n) {
    size = n;
    maze = new int *[n];
    for (int i = 0; i < n; i++)
        maze[i] = new int[n];

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> maze[i][j];
}

Maze::~Maze() {
    for (int i = 0; i < size; i++)
        delete[]maze[i];
    delete[]maze;
}

void Maze::Go() {
    // 进入迷宫
    path.push({0, 0});
    maze[0][0] = 1;
    int i = 0, j = 0;
    // 迷宫按照右下左上走
    while (true) {
        if (j + 1 < size && maze[i][j + 1] == 0)    //向右
        {
            maze[i][j + 1] = 1;   //代表走过
            path.push({i, ++j}); //走到 i,j+1位置，入栈
        } else if (i + 1 < size && maze[i + 1][j] == 0)    //向下
        {
            maze[i + 1][j] = 1;
            path.push({++i, j});
        } else if (j - 1 >= 0 && maze[i][j - 1] == 0)  //向左
        {
            maze[i][j - 1] = 1;
            path.push({i, --j});
        } else if (i - 1 >= 0 && maze[i - 1][j] == 0)  //向上
        {
            maze[i - 1][j] = 1;
            path.push({--i, j});
        } else    //无路可走
        {
            //回退
            i = path.top().x;
            j = path.top().y;
            //判断回退之后是否还有可以走的路
            if(!((j + 1 < size && maze[i][j + 1] == 0) || (i + 1 < size && maze[i + 1][j] == 0) || (j - 1 >= 0 && maze[i][j - 1] == 0)  || (i - 1 >= 0 && maze[i - 1][j] == 0)))
                path.pop();  //出栈
        }

        if (path.empty() || (i == size - 1 && j == size - 1))  //如果回退到起点或者到达终点就结束循环
            break;
    }

    //输出路径
    if (path.empty())
        cout << "no path" << endl;
    else {
        stack<position> path1;

        while (!path.empty())   //将path倒序
        {
            path1.push(path.top());
            path.pop();
        }

        i = 0;
        while (!path1.empty()) {
            if ((++i) % 4 == 0)
                cout << '[' << path1.top().x << ',' << path1.top().y << ']' << "--" << endl;
            else
                cout << '[' << path1.top().x << ',' << path1.top().y << ']' << "--";
            path1.pop();
        }
        cout << "END" << endl;
    }
}


int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        Maze myMaze(n);
        myMaze.Go();
    }
    return 0;
}

```

### DS排序–希尔排序:

```cpp
#include <iostream>
using namespace std;

class Array{
    int *array;
    int len;
public:
    Array(int n);
    ~Array();
    void outPut();
    void ShellInsert(int gap);
    void ShellSort();
};

Array::Array(int n) {
    len = n;
    array = new int[n];

    for(int i=0;i<n;i++)
        cin>>array[i];
}

Array::~Array() {
    delete []array;
}

void Array::outPut() {
    for(int i=0;i<len;i++) {
        cout << array[i];
        if(i!=len-1)
            cout<<' ';
    }
    cout<<endl;
}

void Array::ShellInsert(int gap) {
    int k,i,j,temp;
    for(k=0;k<gap;k++) {
        for (i = k; i < len; i+=gap ){
            temp = array[i];
            for (j = i; j > k; j-=gap) {
                if (temp > array[j - gap])
                    array[j] = array[j - gap];
                else
                    break;
            }
            array[j] = temp;
        }
    }
}

void Array::ShellSort() {
    int gap=len/2;
    while (true)
    {
        ShellInsert(gap);
        outPut();
        if(gap==1)
            break;
        gap/=2;
    }
}


int main() {
    int t;
    cin>>t;
    while (t--) {
        int n;
        cin >> n;
        Array myArray(n);
        myArray.ShellSort();
        cout<<endl;
    }
    return 0;
}

```

### DS排序–快速排序:

```cpp
#include<iostream>
using namespace std;

class Array{
    int len;
    int *array;
public:
    Array(int n);
    ~Array();
    void Display();
    int Partition(int low, int high);
    void QuickSort(int low, int high);
    void QuickSort();
    void swap(int a, int b);
};

void Array::swap(int a, int b) {
    int temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

int Array::Partition(int low, int high) {
    int PivotKey = array[low];
    while( low < high ){
        while( low<high && array[high] >= PivotKey ){
            high--;
        }
        swap(low, high);
        while( low < high && array[low] <= PivotKey){
            low++;
        }
        swap(low, high);
    }
    Display();
    return low;
}

void Array::QuickSort(int low, int high) {
    int pivot;
    if(low < high){
        pivot = Partition(low, high);
        QuickSort(low, pivot-1);
        QuickSort(pivot+1, high);
    }
}

void Array::QuickSort() {
    QuickSort(0, len-1);
    cout << endl;
}

void Array::Display() {
    for( int i=0; i<len; i++){
        cout << array[i];
        if( i==len-1 ){
            cout << endl;
        }else{
            cout << " ";
        }
    }
}

Array::~Array() {
    delete[] array;
    len = 0;
}

Array::Array(int n) {
    len = n;
    array = new int[len];
    for(int i=0; i<len; i++){
        cin >> array[i];
    }
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        int n;
        cin >> n;
        Array myArray(n);
        myArray.QuickSort();
    }
}
```

### DS堆栈–逆序输出（STL栈使用）:

```cpp
#include<iostream>
#include<string>
#include<stack>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        string str;
        cin >> str;
        stack<char> s;
        int len = str.length();
        for( int i=0; i<len; i++)
        {
            s.push(str[i]);
        }

        while( !s.empty())
        {
            cout << s.top();
            s.pop();
        }

        cout << endl;
    }

    return 0;
}
```

### DS串应用- 计算一个串的最长的真前后缀:

```cpp
#include<iostream>
#include<string>
using namespace std;

int *getNext(string str)
{
    int j, k;
    int len = (int)str.size();
    int *next = new int[len + 1];
    j = 0, k = -1;
    next[j] = k;
    while(j < len)
    {
        if(k == -1 || str[k] == str[j]) next[ ++ j] = ++ k;
        else k = next[k];
    }
    return next;
}

string match(string str)
{
    int *next = getNext(str);
    int ans = next[(int)str.size()];
    delete[] next;
    if(ans <= 0) return "empty";
    else return str.substr(0, ans);
}

int main()
{
    int t;
    string s;
    cin >> t;
    while(t -- )
    {
        cin >> s;
        cout << match(s) << endl;
    }
    return 0;
}
```

### DS串应用–KMP算法:

```cpp
#include<iostream>
#include<string>
using namespace std;

class String
{
    string S;
    string T;
    string C;
    int *next;
    void getNext();
    int KMP();
public:
    void Init(string a, string b, string c);
    ~String();
    void Display();
};

void String::getNext()
{
    int i = 0, j = -1;

    next[i] = j;
    while(i < (int)T.size())
    {
        if(j == -1 || T[i] == T[j]) next[ ++ i] = ++ j;
        else j = next[j];
    }
}

int String::KMP()
{
    int i, j;
    for(i = 0, j = 0; i < (int)S.size() && j < (int)T.size();)
    {
        if(j == -1 || S[i] == T[j]) i ++ , j ++ ;
        else j = next[j]; 
    }

    if(j == (int)T.size()) return i - j + 1;
    return 0;
}

void String::Init(string a, string b, string c)
{
    S = a, T = b, C = c;
    next = new int[(int)T.size()];
}

String::~String()
{
    delete[] next;
}

void String::Display()
{
    getNext();
    for(int i = 0; i < (int)T.size(); i ++ )
        cout << next[i] << ' ';
    cout << endl;
    cout << KMP() << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        String str;
        string a, b, c;
        cin >> a >> b >> c;
        str.Init(a, b, c);
        str.Display();
    }
    return 0;
}
```

### DS单链表–合并:

```cpp
#include<iostream>
using namespace std;

class ListNode{
    int data;
    ListNode *next;
    ListNode(){
        next = NULL;
    }
    friend class LinkList;
};

class LinkList{
    ListNode *head;
    int len;
public:
    LinkList();
    ~LinkList();
    void CreateInTail(int n);
    void OutPut();
    LinkList merge(LinkList &li);
};

LinkList::LinkList()
{
    head = new ListNode;
}

LinkList::~LinkList(){
    ListNode *p = head;
    ListNode *q;
    while(p){
        q=p;
        p=p->next;
        delete q;
    }
    len = 0;
    head = NULL;
}

void LinkList::CreateInTail(int n){
    len = n;
    ListNode *tail = head;
    while( n-- )
    {
        int item;
        cin >> item;
        ListNode *s = new ListNode;
        s->data = item;
        tail->next = s;
        tail = s;
    }
}

void LinkList::OutPut(){
    ListNode *p=head->next;
    while(p){
        cout << p->data << " ";
        p=p->next;
    }
    cout << endl;
}

LinkList LinkList::merge(LinkList &li)
{
    LinkList temp;
    temp.len = len +li.len;
    ListNode *p = head->next;
    ListNode *q = li.head->next;
    ListNode *r = temp.head;
    while( p && q)
    {
        ListNode *s = new ListNode;
        if( p->data < q->data )
        {
            s->data = p->data;
            p=p->next;
        }else{
            s->data = q->data;
            q=q->next;
        }
        r->next = s;
        r=r->next;
    }
    while(p)
    {
        ListNode *s = new ListNode;
        s->data = p->data;
        r->next = s;
        r=r->next;
        p=p->next;
    }
    while(q)
    {
        ListNode *s = new ListNode;
        s->data = q->data;
        r->next = s;
        r=r->next;
        q=q->next;
    }
    return temp;
}

int main()
{
    int n, m;
    cin >> n;
    LinkList list1;
    list1.CreateInTail(n);
    list1.OutPut();
    cin >> m;
    LinkList list2;
    list2.CreateInTail(m);
    list2.OutPut();

    LinkList list3= list1.merge(list2);
    list3.OutPut();
    return 0;
}
```

### DS串应用–串替换:

```cpp
#include<iostream>
#include<string>
using namespace std;

class String
{
    string S;
    string T;
    string C;
    int *next;
    void getNext();
    int KMP();
public:
    void Init(string a, string b, string c);
    ~String();
    void Display();
};

void String::getNext()
{
    int i = 0, j = -1;

    next[i] = j;
    while(i < (int)T.size())
    {
        if(j == -1 || T[i] == T[j]) next[ ++ i] = ++ j;
        else j = next[j];
    }
}

int String::KMP()
{
    int i, j;
    for(i = 0, j = 0; i < (int)S.size() && j < (int)T.size();)
    {
        if(j == -1 || S[i] == T[j]) i ++ , j ++ ;
        else j = next[j]; 
    }

    if(j == (int)T.size()) return i - j;
    return -1;
}

void String::Init(string a, string b, string c)
{
    S = a, T = b, C = c;
    next = new int[(int)T.size()];
}

String::~String()
{
    delete[] next;
}

void String::Display()
{
    getNext();
    int pos = KMP();
    cout << S << endl;
    if(pos == -1) cout << S << endl;
    else cout << S.replace(pos, (int)T.size(), C) << endl;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        String str;
        string a, b, c;
        cin >> a >> b >> c;
        str.Init(a, b, c);
        str.Display();
    }
    return 0;
}
```

### DS单链表–类实现:

```cpp
#include<iostream>
using namespace std;
#define ok 0
#define error -1

class ListNode{
public:
    int data;
    ListNode *next;
    ListNode(){
        next = NULL;
    }
};

class LinkList{
public:
    ListNode *head;
    int len;
    LinkList();
    ~LinkList();
    ListNode *LL_index(int i);
    int LL_get(int i);
    int LL_insert(int i, int item);
    int LL_del(int i);
    void LL_display();
};

LinkList::LinkList(){
    head = new ListNode();
    len = 0;
}

LinkList::~LinkList(){
    ListNode *p, *q;
    p = head;
    while(p!=NULL){
        q=p;
        p=p->next;
        delete q;
    }
    len = 0;
    head = NULL;
}

void LinkList::LL_display()
{
    ListNode *p;
    p=head->next;
    while(p){
        cout << p->data << " ";
        p=p->next;
    }
    cout << endl;
}

ListNode *LinkList::LL_index( int i){
    int j=0;
    ListNode *p = head;
    while( p && j<i )
    {
        p=p->next;
        j++;
    }
    if( !p )
    {
        return NULL;
    }else{
        return p;
    }
}

int LinkList::LL_get(int i){
    if( i<=0 || i>len )
    {
        return error;
    }
    int j=0;
    ListNode *p = head;
    while( p && j<i )
    {
        p = p->next;
        j++;
    }
    if( !p )
    {
        return error;
    }else{
        return p->data;
    }
}

int LinkList::LL_insert( int i, int item){
    if( i<=0 || i>len+1 )
    {
        return error;
    }
    ListNode *p, *s;
    p = LL_index(i-1);
    s=new ListNode();
    s->data = item;
    s->next = p->next;
    p->next = s;
    len++;
    return ok;
}

int LinkList::LL_del( int i){
    if( i<0 || i>len )
    {
        return error;
    }
    ListNode *p, *s;
    p=LL_index(i-1);
    s=p->next;
    p->next=s->next;
    delete s;
    len--;
    return ok;
}

int main(){
    int n, i, m;
    LinkList list;
    cin >> n;
    for( i=1; i<=n; i++)
    {
        cin >> m;
        list.LL_insert(i, m);
    }
    list.LL_display();
    for( int j=0; j<2; j++)
    {
        cin >> i >> m;
        if( list.LL_insert(i, m)!=-1)
        {
            list.LL_display();
        }else{
            cout << "error" << endl;
        }
    }
    for( int j=0; j<2; j++)
    {
        cin >> n;
        if( list.LL_del(n)!=-1)
        {
            list.LL_display();
        }else{
            cout << "error" << endl;
        }
    }
    for( int j=0; j<2; j++)
    {
        cin >> i;
        if( list.LL_get(i)!=-1 )
        {
            cout << list.LL_get(i) << endl;
        }else{
            cout << "error" << endl;
        }
    }
    return 0;
}
```

### DS顺序表–类实现:

```cpp
#include<iostream>
using namespace std;

#define ok 0
#define error -1

class SeqList{
    int *list;
    int maxsize;
    int size;
public:
    SeqList(int n);
    ~SeqList();
    int list_size();
    int list_insert(int i, int item);
    int list_del(int i);
    int list_get(int i);
    void list_display();
};

SeqList::SeqList(int n) {
    maxsize = 1000;
    size = n;
    list = new int[maxsize];
    for( int i=0; i<size; i++){
        cin >> list[i];
    }
}

SeqList::~SeqList() {
    delete[] list;
}

int SeqList::list_size(){
    return size;
}

int SeqList::list_insert(int i, int item){
    if( i<1 || i>size+1){
        return error;
    }
    int j;
    for( j=size-1; j>=i-1; j--){
        list[j+1] = list[j];
    }
    list[i-1] = item;
    size++;
    return ok;
}

int SeqList::list_del(int i){
    if( i<1 || i>size ){
        return error;
    }
    for( int j=i-1; j<size-1; j++){
        list[j] = list[j+1];
    }
    size--;
    return ok;
}

int SeqList::list_get(int i){
    if( i<1 || i>size ){
        return error;
    }
    return list[i-1];
}

void SeqList::list_display() {
    cout << size << " ";
    for( int i=0; i<size; i++){
        cout << list[i] << " ";
    }
    cout << endl;
}

int main(){
    int n, k, flag;
    cin >> n;
    SeqList myList(n);
    myList.list_display();
    cin >> n >> k;
    flag = myList.list_insert(n, k);
    if( flag==0 ){
        myList.list_display();
    }else{
        cout << "error" << endl;
    }
    cin >> n >> k;
    flag = myList.list_insert(n, k);
    if( flag==0 ){
        myList.list_display();
    }else{
        cout << "error" << endl;
    }
    cin >> n;
    flag = myList.list_del(n);
    if( flag==0 ){
        myList.list_display();
    }else{
        cout << "error" << endl;
    }
    cin >> n;
    flag = myList.list_del(n);
    if( flag==0 ){
        myList.list_display();
    }else{
        cout << "error" << endl;
    }
    cin >> n;
    flag = myList.list_get(n);
    if( flag!=-1 ){
        cout << flag << endl;
    }else{
        cout << "error" << endl;
    }
    cin >> n;
    flag = myList.list_get(n);
    if( flag!=-1 ){
        cout << flag << endl;
    }else{
        cout << "error" << endl;
    }
    return 0;
}
```

### DS二叉树–叶子数量:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    char data;
    BiNode *lchild;
    BiNode *rchild;
public:
    BiNode():lchild(NULL),rchild(NULL){}
    BiNode(char e):data(e), lchild(NULL), rchild(NULL){}
    ~BiNode(){delete lchild; delete rchild;}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int leafNum;
    void CreateTree(BiNode *&t);
    void PreOrder(BiNode *t);
public:
    BiTree():root(NULL), leafNum(0){};
    void CreateTree();
    void PreOrder();
};

void BiTree::CreateTree(BiNode *&t){
    char c;
    cin >> c;
    if( c!='0' )
    {
        t = new BiNode(c);
        CreateTree(t->lchild);
        CreateTree(t->rchild);
    }else{
        t = NULL;
    }
}

void BiTree::CreateTree(){
    CreateTree(root);
}

void BiTree::PreOrder(BiNode *t){
    if(t){
        if(!t->lchild && !t->rchild)
            leafNum++;
        PreOrder(t->lchild);
        PreOrder(t->rchild);
    }
}

void BiTree::PreOrder(){
    PreOrder(root);
    cout << leafNum << endl;
}

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        BiTree tree;
        tree.CreateTree();
        tree.PreOrder();
    }
    return 0;
}
```

### DS二叉树–层次遍历:

```cpp
#include<iostream>
#include<queue>
using namespace std;

class BiNode{
    char data;
    BiNode *lchild;
    BiNode *rchild;
public:
    BiNode():lchild(NULL),rchild(NULL){}
    BiNode(char e):data(e), lchild(NULL),rchild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    queue<BiNode*> tq;
    void Create(BiNode *&t);
    void LevOrder(BiNode *t);
public:
    BiTree():root(NULL){}
    void Create();
    void LevOrder();
};

void BiTree::Create(BiNode*&t){
    char c;
    cin >> c;
    if( c!='0' ){
        t = new BiNode(c);
        Create(t->lchild);
        Create(t->rchild);
    }else{
        t=NULL;
    }
}

void BiTree::Create(){
    Create(root);
}

void BiTree::LevOrder(BiNode *t){
    BiNode *p = t;
    if (p)
        tq.push(p);
    while (!tq.empty())
    {
        p = tq.front();
        tq.pop();
        cout << p->data;
        if (p->lchild)
            tq.push(p->lchild);
        if (p->rchild)
            tq.push(p->rchild);
    }
}

void BiTree::LevOrder(){
    LevOrder(root);
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        BiTree tree;
        tree.Create();
        tree.LevOrder();
        cout << endl;
    }
    return 0;
}
```

### DS单链表–结点交换:

```cpp
#include<iostream>
using namespace std;

class ListNode{
public:
    int data;
    ListNode *next;
    ListNode(){
        next = NULL;
    }
};

class LinkList{
public:
    ListNode *head;
    int len;
    LinkList();
    ~LinkList();
    void CreateInTail( int n);
    void outPut();
    bool swap( int pa, int pb);
    ListNode *Index(int i);
};

LinkList::LinkList(){
    head = new ListNode;
    len = 0;
}

LinkList::~LinkList(){
    ListNode *p=head, *q;
    while(p){
        q=p;
        p=p->next;
        delete q;
    }
    head = NULL;
    len = 0;
}

void LinkList::CreateInTail(int n){
    len = n;
    ListNode *tail = head;
    while( n-- )
    {
        int item;
        cin >> item;
        ListNode *s = new ListNode;
        s->data = item;
        tail->next = s;
        tail = s;
    }
}

void LinkList::outPut(){
    ListNode *p = head->next;
    while( p )
    {
        cout << p->data << " ";
        p=p->next;
    }
    cout << endl;
}

bool LinkList::swap(int pa, int pb){
    if( pa<1 || pb<1 || pa>len || pb>len )
    {
        return false;
    }
    ListNode *p = Index(pa-1), *q = Index(pb-1);
    
    ListNode *t = p->next;
    p->next = q->next;
    q->next = t;

    t=p->next->next;
    p->next->next=q->next->next;
    q->next->next=t;

    return true;
}

ListNode *LinkList::Index(int i){
    if( i<0 || i>len )
    {
        return NULL;
    }
    ListNode *p = head;
    for( int j=0; j<i; j++)
    {
        p=p->next;
    }
    return p;
}

int main()
{
    int n;
    cin >> n;
    LinkList list;
    list.CreateInTail(n);
    list.outPut();
    int pa, pb;
    
    cin >> pa >> pb;
    if( list.swap(pa,pb))
    {
        list.outPut();
    }else{
        cout << "error" << endl;
    }

    cin >> pa >> pb;
    if( list.swap(pa,pb))
    {
        list.outPut();
    }else{
        cout << "error" << endl;
    }

    return 0;
}
```

### DS顺序表–合并操作:

```cpp
#include<iostream>
using namespace std;

class SeqList{
    int *list;
    int maxsize;
    int size;
public:
    SeqList(int n);
    ~SeqList();
    void Init();
    SeqList combineList(SeqList &li);
    void outPut();
};

SeqList::SeqList( int n){
    size = n;
    maxsize = 1000;
    list = new int[maxsize];
}

SeqList::~SeqList(){
    delete []list;
}

SeqList SeqList::combineList(SeqList &li)
{
    SeqList combine( size+li.size);
    int i=0, j=0, k=0;
    while ( i<size && j<li.size)
    {
        if( list[i]<li.list[j])
        {
            combine.list[k] = list[i];
            i++;
        }else{
            combine.list[k] = list[j];
            j++;
        }
        k++;
    }
    
    while( i<size )
    {
        combine.list[k] = list[i];
        k++;
        i++;
    }
    while( j<li.size)
    {
        combine.list[k] = li.list[j];
        k++;
        j++;
    }

    return combine;
}

void SeqList::Init(){
    for( int i=0; i<size; i++)
    {
        cin >> list[i];
    }
}

void SeqList::outPut()
{
    cout << size << " ";
    for( int i=0; i<size; i++)
    {
        cout << list[i] << " ";
    }
    cout << endl;
}

int main()
{
    int n, m;
    cin >> n;
    SeqList list1(n);
    list1.Init();
    cin >> m;
    SeqList list2(m);
    list2.Init();
    SeqList list3 = list1.combineList(list2);
    list3.outPut();
    return 0;
}
```

### DS顺序表–连续操作:

```cpp
#include<iostream>
using namespace std;

class SeqList{
    int size;
    int maxsize;
    int *list;
public:
    SeqList(){
        maxsize = 1000;
        cin >> size;
        list = new int[maxsize];
        for( int i=0; i<size; i++){
            cin >> list[i];
        }
        Display();
    }
    void Display(){
        cout << size << " ";
        for(int i=0; i<size; i++){
            cout << list[i] << " ";
        }
        cout << endl;
    }
    ~SeqList(){
        delete[] list;
        size = 0;
    }
    void multiInsert(int begin, int len, int item[]){
        if( begin<1 || size+len>maxsize || begin>size+1){
            return;
        }
        for(int i=begin-1, j=0; i<size; i++, j++){
            list[size+len-1-j] = list[size-1-j];
        }
        for( int j=begin-1, i=0; i<len; i++, j++){
            list[j] = item[i];
        }
        size += len;
        Display();
    }
    void multiDel(int begin, int len){
        for(int i=begin-1, j=0; j<len; j++){
            list[i] = list[i+len];
        }
        size -= len;
        Display();
    }
};

int main(){
    SeqList list;
    int begin, len;
    cin >> begin >> len;
    int array[len];
    for( int i=0; i<len; i++){
        cin >> array[i];
    }
    list.multiInsert(begin, len, array);
    cin >> begin >> len;
    list.multiDel(begin, len);
    return 0;
}
```

### DS二叉树–左叶子数量:

```cpp
#include<iostream>
#include<string>
using namespace std;
class BitreeNode 
{
public:
    char data;
    BitreeNode *left;
    BitreeNode *right;
    BitreeNode():left(NULL),right(NULL){}
    ~BitreeNode(){}
};
class Bitree
{
private:
    BitreeNode *Root;
    int pos,count;
    string strtree;
    BitreeNode *CreateBitree();
    void countleaves(BitreeNode *t);
public:
    Bitree() { count = 0; };
    ~Bitree() {};
    void CreateTree(string TreeArray);
    void countleaves();
};
void Bitree::CreateTree(string treearray)
{
    pos = 0;
    strtree.assign(treearray);
    Root = CreateBitree();
}
BitreeNode *Bitree::CreateBitree()
{
    BitreeNode *T;
    char ch;
    ch = strtree[pos++];
    if (ch == '0')
        T = NULL;
    else
    {
        T = new BitreeNode();
        T->data = ch;
        T->left = CreateBitree();
        T->right = CreateBitree();
    }
    return T;
}
void Bitree::countleaves()
{
    countleaves(Root);
    cout << count << endl;
}
void Bitree::countleaves(BitreeNode *t)
{
    if (t)
    {
        if (t->left)
        {
            if (!t->left->left && !t->left->right)
                count++;
        }
        countleaves(t->left);
        countleaves(t->right);
    }
}
int main()
{
    int t;
    cin >> t;
    while (t--)
    {
        string str;
        cin >> str;
        Bitree *tree;
        tree = new Bitree();
        tree->CreateTree(str);
        tree->countleaves();
    }
}
```

### DS二叉树–赫夫曼树解码:

```cpp
#include<iostream>
#include<string>
#define ok 1
#define error -1
using namespace std;
const int maxW = 9999;
class HuffNode{
public:
    int weight;
    int parent;
    int lChild;
    int rChild;
    char value;
};

class HuffMan{
    void MakeTree();
    void SelectMin(int pos, int *s1, int *s2);
public:
    int len;
    int lNum;
    HuffNode *huffTree;
    string *huffCode;
    void MakeTree(int n, int *wt, char *str);
    void Coding();
    int Decode(const string codestr, char txtStr[]);
    void Destroy();

};

void HuffMan::MakeTree(int n, int *wt, char *str){
    int i;
    lNum = n;
    len = 2*n-1;
    huffTree = new HuffNode[2*n];
    huffCode = new string[lNum+1];
    for( i=1; i<=n; i++){
        huffTree[i].weight = wt[i-1];
        huffTree[i].value = str[i-1];
    }
    for( i=1; i<=len; i++){
        if( i>n ){
            huffTree[i].weight = 0;
        }
        huffTree[i].parent = 0;
        huffTree[i].lChild = 0;
        huffTree[i].rChild = 0;
    }
    MakeTree();
}

void HuffMan::MakeTree() {
    int i, s1, s2;
    for( i=lNum+1; i<=len; i++){
        SelectMin(i-1, &s1, &s2);
        huffTree[s1].parent = i;
        huffTree[s2].parent = i;
        huffTree[i].lChild = s1;
        huffTree[i].rChild = s2;
        huffTree[i].weight = huffTree[s1].weight 
        + huffTree[s2].weight;
    }
}

void HuffMan::SelectMin(int pos, int *s1, int *s2) {
    int w1, w2, i;
    w1 = w2 = maxW;
    *s1 = *s2 = 0;
    for( i=1; i<=pos; i++){
        if( w1>huffTree[i].weight && huffTree[i].parent==0 ){
            w2 = w1;
            *s2 = *s1;
            w1 = huffTree[i].weight;
            *s1 = i;
        }else if( w2>huffTree[i].weight &&
         huffTree[i].parent==0 ){
            w2 = huffTree[i].weight;
            *s2 = i;
        }
    }
}

void HuffMan::Coding() {
    char *cd;
    int i,c,f,start;
    cd = new char[lNum];
    cd[lNum-1] = '\0';
    for( i=1; i<=lNum; i++){
        start = lNum - 1;
        for( c=i, f=huffTree[i].parent;
         f!=0; f=huffTree[f].parent){
            if(huffTree[f].lChild == c){
                cd[--start] = '0';
            }else{
                cd[--start] = '1';
            }
        }
        huffCode[i].assign(&cd[start]);
    }
    delete []cd;
}

int HuffMan::Decode(const string codestr, char *txtStr) {
    int i, k, c;
    char ch;
    c = len;
    k = 0;
    for(i=0; i<codestr.length(); i++){
        ch = codestr[i];
        if( ch=='0' ){
            c=huffTree[c].lChild;
        }else if( ch=='1' ){
            c=huffTree[c].rChild;
        }else{
            return error;
        }
        if( !huffTree[c].lChild && !huffTree[c].rChild ){
            txtStr[k] = huffTree[c].value;
            k++;
            c=len;
        }else{
            ch = '\0';
        }
    }
    if( ch=='\0' ){
        return error;
    }else{
        txtStr[k] = '\0';
    }
    return ok;
}

void HuffMan::Destroy() {
    len = 0;
    lNum = 0;
    delete []huffTree;
    delete []huffCode;
}

int main(){
    int t,n,i,j;
    int wt[800];
    char ch[800];
    HuffMan myHuff;
    cin >> t;
    for( i=0; i<t; i++){
        cin >> n;
        for( j=0; j<n; j++){
            cin >> wt[j];
        }
        for( j=0; j<n; j++){
            cin >> ch[j];
        }
        myHuff.MakeTree(n,wt, ch);
       int k;
       cin >> k;
       while( k-- ){
           string str;
           char txt[800];
           cin >> str;
           if( myHuff.Decode(str,txt)!=-1){
               cout << txt << endl;
           }else{
               cout << "error" << endl;
           }
       }
        myHuff.Destroy();
    }
    return 0;
}
```

### DS图遍历–广度优先搜索:

```cpp
#include <iostream>
#include <queue>
using namespace std;

class Graph{
    int vexNum;
    int **array;
    bool *visit;
    queue<int> Q;
    void BFS(int v);
public:
    Graph();
    ~Graph();
    void BFS();
};

Graph::Graph() {
    cin>>vexNum;
    array = new int*[vexNum];
    visit = new bool[vexNum];
    for(int i=0;i<vexNum;i++)
    {
        visit[i] = false;
        array[i]=new int[vexNum];
        for(int j=0;j<vexNum;j++)
            cin>>array[i][j];
    }
}

Graph::~Graph() {
    delete visit;
    for(int i=0;i<vexNum;i++)
        delete array[i];
    delete []array;
}

void Graph::BFS(int v) {
    if(!visit[v])
    {
        cout<<v<<' ';
        visit[v] = true;
        for(int i=0;i<vexNum;i++)
        {
            if(array[v][i]==1)
                Q.push(i);
        }

        while (!Q.empty())
        {
            BFS(Q.front());
            if(!Q.empty())
                Q.pop();
        }
    }
}

void Graph::BFS() {
    for(int i=0;i<vexNum;i++)
        BFS(i);
    cout<<endl;
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        Graph myGraph;
        myGraph.BFS();
    }

    return 0;
}

```

### DS图遍历–深度优先搜索:

```cpp
#include<iostream>
using namespace std;

class Graph{
    int vexNum;
    int **array;
    bool *visit;
    void DFS(int v);
public:
    Graph();
    ~Graph();
    void DFS();
};

Graph::Graph(){
    cin >> vexNum;
    array = new int*[vexNum];
    visit = new bool[vexNum];
    for( int i=0; i<vexNum; i++){
        visit[i] = false;
        array[i] = new int[vexNum];
        for( int j=0; j<vexNum; j++){
            cin >> array[i][j];
        }
    }
}

Graph::~Graph(){
    delete []visit;
    for( int i=0; i<vexNum; i++){
        delete array[i];
    }
    delete array;
}

void Graph::DFS(int v){
    if(!visit[v]){
        visit[v] = true;
        cout << v << " ";
        for( int i=0; i<vexNum; i++){
            if( array[v][i]==1){
                DFS(i);
            }
        }
    }
}

void Graph::DFS(){
    for( int i=0; i<vexNum; i++){
        DFS(i);
    }
    cout << endl;
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        Graph myGraph;
        myGraph.DFS();
    }
    return 0;
}
```

### DS二叉树–后序遍历非递归算法:

```cpp
#include <iostream>
#include <stack>
using namespace std;

class BiNode{
    char data;
    int tag;
    BiNode *lChild;
    BiNode *rChild;
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    void createTree(BiNode *&r);
public:
    BiTree():root(NULL){}
    void createTree();
    void postOrder();
};

void BiTree::createTree(BiNode *&r) {
    char ch;
    cin>>ch;
    if(ch != '0')
    {
        r = new BiNode(ch);
        createTree(r->lChild);
        createTree(r->rChild);
    }
    else
        r = NULL;
}

void BiTree::createTree() {
    createTree(root);
}

void BiTree::postOrder() {
    stack<BiNode*> s1;
    stack<int> s2;
    if(!root)
        return;
    BiNode *p=root;
    do{
        while (p) {
            s1.push(p);
            s2.push(p->tag);
            p = p->lChild;
            if(s1.empty())
                break;
        }
        if(!p)
        {
            int tag=s2.top();
            if(tag == 0)
            {
                s2.top()=1;
                p=s1.top()->rChild;
            }
            else if(tag==1)
            {
                p=s1.top();
                s1.pop();
                s2.pop();
                cout<<p->data;
                p=NULL;
            }
        }
    }while (!s1.empty());
    cout<<endl;
}


int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        BiTree myTree;
        myTree.createTree();
        myTree.postOrder();
    }
    system("pause");
    return 0;
}

```

### DS二叉树–赫夫曼树的构建与编码:

```cpp
#include<iostream>
#include<string>
using namespace std;

const int maxW = 9999;

class HuffNode{
public:
    int weight;
    int parent;
    int leftChild;
    int rightChild;
};

class HuffMan{
    void MakeTree();
    void SelectMin(int pos, int *s1, int *s2);
public:
    int len;
    int lnum;
    HuffNode *huffTree;
    string *huffCode;
    void MakeTree(int n, int *wt);
    void Coding();
    void Destroy();
};

void HuffMan::MakeTree(int n, int *wt){
    int i;
    lnum = n;
    len = 2*n-1;
    huffTree = new HuffNode[2*n];
    huffCode = new string[lnum+1];
    for( i=1; i<=n; i++){
        huffTree[i].weight = wt[i-1];
    }
    for( i=1; i<=len; i++){
        if( i>n ){
            huffTree[i].weight = 0;
        }
        huffTree[i].parent = 0;
        huffTree[i].leftChild = 0;
        huffTree[i].rightChild = 0;
    }
    MakeTree();
}

void HuffMan::SelectMin(int pos, int *s1, int *s2) {
    int w1, w2, i;
    w1 = w2 = maxW;
    *s1 = *s2 = 0;
    for( i=1; i<=pos; i++){
        if( w1>huffTree[i].weight && !huffTree[i].parent ){
            w2 = w1;
            *s2 = *s1;
            w1 = huffTree[i].weight;
            *s1 = i;
        }else if( w2>huffTree[i].weight && !huffTree[i].parent ){
            w2 = huffTree[i].weight;
            *s2 = i;
        }
    }
}

void HuffMan::MakeTree() {
    int i, s1, s2;
    for( i=lnum+1; i<=len; i++){
        SelectMin(i-1, &s1, &s2);
        huffTree[s1].parent = huffTree[s2].parent=i;
        huffTree[i].leftChild = s1;
        huffTree[i].rightChild = s2;
        huffTree[i].weight = huffTree[s1].weight +
         huffTree[s2].weight;
    }
}

void HuffMan::Coding() {
    char *cd;
    int i,c,f,start;
    cd = new char[lnum];
    cd[lnum-1]='\0';
    for(i=1; i<=lnum;++i){
        start = lnum-1;
        for(c=i, f=huffTree[i].parent; f!=0; c=f, 
        f=huffTree[f].parent){
            if( huffTree[f].leftChild == c){
                cd[--start] = '0';
            }else{
                cd[--start] = '1';
            }
        }
        huffCode[i].assign(&cd[start]);
    }
    delete []cd;
}

void HuffMan::Destroy() {
    len = 0;
    lnum = 0;
    delete []huffTree;
    delete []huffCode;
}

int main(){
    int t, i, j, n;
    int wt[800];
    HuffMan myHuff;
    cin >> t;
    for( i=0; i<t; i++){
        cin >> n;
        for( j=0; j<n; j++){
            cin >> wt[j];
        }
        myHuff.MakeTree(n, wt);
        myHuff.Coding();
        for( j=1; j<=n; j++){
            cout << myHuff.huffTree[j].weight << "-";
            cout << myHuff.huffCode[j] << endl;
        }
        myHuff.Destroy();
    }
    return 0;
}
```

### DS图应用–最短路径（含代码框架）:

```cpp
#include <iostream>
using namespace std;
#define inf 65535

class Graph{
    int vexNum;
    int **array;
public:
    Graph();
    ~Graph();
    void Dijkstra(int v);
};

Graph::Graph() {
    cin>>vexNum;
    array = new int*[vexNum];
    for(int i=0;i<vexNum;i++)
    {
        array[i] = new int[vexNum];
        for(int j=0;j<vexNum;j++)
        {
            int e;
            cin>>e;
            if(e==0)
                array[i][j] = inf;
            else
                array[i][j] = e;
        }
    }
}

Graph::~Graph() {
    for(int i=0;i<vexNum;i++)
        delete []array[i];
    delete []array;
}

void Graph::Dijkstra(int v) {
    int D[vexNum];
    bool final[vexNum];
    int pathLen[vexNum];
    int  **path = new int*[vexNum];
    int start = v;

    for(int i=0;i<vexNum;i++)
    {
        D[i] = array[v][i];
        final[i] = false;
        pathLen[i] = 2;     //初始时，两个顶点直接到达
        path[i] = new int[vexNum];
    }
    for(int i =0;i<vexNum;i++)
    {
        path[i][0] = v;
        path[i][1] = i;
    }
    final[v] = true;
    D[v] = 0;
    for(int i=0;i<vexNum;i++)   //找最小
    {
        int min=inf;
        for(int j=0;j<vexNum;j++)
        {
            if(!final[j] && D[j]<min)
            {
                min = D[j];
                v = j;
            }
        }
        if(min == inf)
            break;
        final[v] = true;
        for(int j=0;j<vexNum;j++)   //更新
        {
            if(!final[j] && array[v][j]+min < D[j]){
                D[j] = array[v][j] + min;

                for(int k=0;k<pathLen[v];k++)
                    path[j][k] = path[v][k];

                pathLen[j] = pathLen[v]+1;
                path[j][pathLen[j]-1] = j;
            }
        }
    }
    for(int i=0;i<vexNum;i++)
    {
        if(i==start)
            continue;
        cout<<start<<'-'<<i<<'-'<<D[i]<<"----[";
        for(int j=0;j<pathLen[i];j++)
        {
            cout<<path[i][j]<<' ';
        }
        cout<<']'<<endl;
    }
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        Graph myGraph;
        int v;
        cin>>v;
        myGraph.Dijkstra(v);
    }
    return 0;
}

```

### DS内排—2-路归并排序:

```cpp
#include <iostream>
#include <string>
using namespace std;

class MergeSort{
    string *strArray;
    string *str;
    int len;
public:
    MergeSort(int n);
    ~MergeSort();
    void Sort();
    void Merge(int i,int j,int gap);
    void update();
    void outPut();
};

MergeSort::MergeSort(int n) {
    len=n;
    strArray = new string[n];
    str = new string[n];
    for(int i=0;i<n;i++) {
        cin >> strArray[i];
        str[i]=strArray[i];
    }
}

MergeSort::~MergeSort() {
    delete []strArray;
    delete []str;
}

void MergeSort::Sort() {
    int gap=1,num=len;
    int i,j;
    while (num>1)
    {
        i=0;
        j=gap;

        while (j<len)
        {
            Merge(i,j,gap);
            num--;
            i+=gap*2;
            j+=gap*2;
        }
        gap=gap*2;
        outPut();
    }
}

void MergeSort::Merge(int i, int j, int gap) {
    int m,n,k;
    for(m=i,n=j,k=i;m<i+gap && n<j+gap&&n<len;k++)
    {
        if(strArray[m]>strArray[n])
            str[k] = strArray[m++];
        else
            str[k] = strArray[n++];
    }
    while (m<i+gap)
        str[k++] = strArray[m++];
    while (n<j+gap&&n<len)
        str[k++]=strArray[n++];
    update();
}

void MergeSort::update() {
    for(int i=0;i<len;i++)
        strArray[i]=str[i];
}

void MergeSort::outPut() {
    for(int i=0;i<len;i++)
    {
        cout<<str[i];
        if(i!=len-1)
            cout<<' ';
    }
    cout<<endl;
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        int n;
        cin>>n;
        MergeSort myMerge(n);
        myMerge.Sort();
        cout<<endl;
    }
}

```

### DS哈希查找–链地址法:

```cpp
#include<iostream>
using namespace std;

class ListNode{
public:
    ListNode(){
        next = NULL;
    }
    int data;
    ListNode *next;
};

class HashTable{
    int HashNum;
    ListNode *array[11];
    int Hash(int key);
public:
    HashTable(int n);
    void Search(int key);
};

int HashTable::Hash(int key) {
    return key%11;
}

HashTable::HashTable(int n) {
    int e;
    for( int i=0; i<11; i++){
        array[i] = new ListNode;
        array[i]->data = i;
    }
    while( n-- ){
        cin >> e;
        HashNum = Hash(e);
        ListNode *p = new ListNode;
        p->data = e;
        if( array[HashNum]->next==NULL ){
            p->next = NULL;
            array[HashNum]->next = p;
        }else{
            p->next = array[HashNum]->next;
            array[HashNum]->next = p;
        }
    }
}

void HashTable::Search(int key) {
    int cnt=0;
    bool flag = false;
    HashNum = Hash(key);
    ListNode *p=array[HashNum];
    while( p->next ){
        cnt++;
        p=p->next;
        if( key==p->data ){
            flag = true;
            break;
        }
    }
    if( flag== true ){
        cout << HashNum << " " << cnt << endl;
    }else{
        ListNode *q = new ListNode;
        q->data=key;
        q->next = array[HashNum]->next;
        array[HashNum]->next = q;
        cout << "error" << endl;
    }
}

int main(){
    int t;
    cin >> t;
    HashTable myHash(t);
    int n, key;
    cin >> n;
    while(n--){
        cin >> key;
        myHash.Search(key);
    }
    return 0;
}
```

### DS基数排序:

```cpp
#include <iostream>
#include <queue>
#include <cmath>
using namespace std;

class RadixSort{
    int *array;
    int max;
    queue<int> radix[10];
    int len;
public:
    RadixSort(int n);
    ~RadixSort();
    void Max();
    void Sort();
    void Distribute(int wei);
    void Collect();
};

RadixSort::RadixSort(int n) {
    len=n;
    array = new int[n];
    for(int i=0;i<n;i++)
        cin>>array[i];

    Max();
}

RadixSort::~RadixSort() {
    delete []array;
}

void RadixSort::Max() {
    max=0;
    for(int i=0;i<len;i++)
    {
        int count=1,temp=array[i];
        while (temp/10!=0)
        {
            temp/=10;
            count++;
        }
        if(count>max)
            max=count;
    }
}

void RadixSort::Sort() {
    for(int i=1;i<=max;i++)
    {
        Distribute(i);
        Collect();
    }
    cout<<endl;
}

void RadixSort::Distribute(int wei) {
    int j;
    for(int i=0;i<len;i++)
    {
        j=array[i]/pow(10,wei-1);
        j=j%10;
        radix[j].push(array[i]);
    }
}

void RadixSort::Collect() {
    int num=0;
    for(int i=0;i<10;i++)
    {
        cout<<i<<":";
        if(radix[i].empty())
            cout<<"NULL"<<endl;
        else
        {
            while(!radix[i].empty())
            {
                cout<<"->"<<radix[i].front();
                array[num++]=radix[i].front();
                radix[i].pop();
            }
            cout<<"->^"<<endl;
        }
    }

    for(int i=0;i<len;i++)
    {
        cout<<array[i];
        if(i!=len-1)
            cout<<' ';
    }
    cout<<endl;
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        int n;
        cin>>n;
        RadixSort mySort(n);
        mySort.Sort();
    }
    return 0;
}

```

### DS二叉树判断–同一棵二叉树:

```cpp
#include<iostream>
using namespace std;
#include<queue>

class BiNode{
    BiNode *lChild;
    BiNode *rChild;
    char data;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int len;
    queue<BiNode*> que;
    void CreateTree(BiNode *&t);
    string str;
public:
    BiTree();
    ~BiTree();
    void CreateTree();
    void BFS();
};

void BiTree::BFS(){
    BiNode *p;
    int i=0;
    que.push(root);
    while(i!=len){
        p = que.front();
        que.pop();
        if(p){
            if(p->data!=str[i]){
                cout << "NO" << endl;
                return;
            }
            que.push(p->lChild);
            que.push(p->rChild);
        }
        i++;
    }
    cout << "YES" << endl;
}

BiTree::BiTree() {
    cin >> str;
    len = str.length();
}

BiTree::~BiTree() {
    delete root;
    len = 0;
    while(!que.empty()){
        que.pop();
    }
}

void BiTree::CreateTree(BiNode *&t) {
    char e;
    cin >> e;
    if( e!='#' ){
        t = new BiNode(e);
        CreateTree(t->lChild);
        CreateTree(t->rChild);
    }else{
        t = new BiNode('#');
    }
}

void BiTree::CreateTree() {
    CreateTree(root);
}

int main(){
    int t;
    cin >> t;
    while(t--){
        BiTree myTree;
        myTree.CreateTree();
        myTree.BFS();
    }
}
```

### DS二叉树——Huffman编码与解码（不含代码框架）:

```cpp
#include <iostream>
#include <string>
using namespace std;

class HuffmanNode{
    int lChild;
    int rChild;
    int parents;
    int weight;
public:
    HuffmanNode():lChild(0),rChild(0),parents(0),weight(0){}
    friend class HuffmanTree;
};

class HuffmanTree{
    int leafNum;
    HuffmanNode *tree;
    char *strs;
    string *code;
    void selectMin(int pos,int *min1,int *min2);
    int Index(char c);
public:
    HuffmanTree();
    void createTree();
    void encode(string str);
    void decode(string str);
};

HuffmanTree::HuffmanTree() {
    cin>>leafNum;
    tree = new HuffmanNode[2*leafNum];
    strs = new char[leafNum];
    code = new string[leafNum];
    for(int i=0;i<leafNum;i++)
        cin>>strs[i];

    for(int i=1;i<=leafNum;i++)
        cin>>tree[i].weight;
}

void HuffmanTree::selectMin(int pos, int *min1, int *min2) {
    int w1=99999,w2=99999;
    for(int i=1;i<pos;i++)
    {
        if(w1>tree[i].weight && tree[i].parents == 0)
        {
            w2=w1;
            *min2 = *min1;
            w1 = tree[i].weight;
            *min1 = i;
        }
        else if(w2>tree[i].weight && tree[i].parents == 0)
        {
            w2 = tree[i].weight;
            *min2 = i;
        }
    }
}

void HuffmanTree::createTree() {
    for(int i =leafNum+1;i<2*leafNum;i++)
    {
        int min1=0,min2=0;
        selectMin(i,&min1,&min2);
        tree[i].weight = tree[min1].weight+tree[min2].weight;
        tree[i].lChild = min1;
        tree[i].rChild = min2;
        tree[min1].parents = i;
        tree[min2].parents = i;
    }
}

void HuffmanTree::encode(string str) {
    for(int i=0;i<leafNum;i++)
    {
        int m=i+1;
        int n = tree[m].parents;
        while (n!=0) {
            if (tree[n].lChild == m)
                code[i] = "0" + code[i];
            else if (tree[n].rChild == m)
                code[i] = "1" + code[i];

            m = n;
            n = tree[m].parents;
        }
        cout<<strs[i]<<" :"<<code[i]<<endl;
    }

    int len = str.size();
    for(int i=0;i<len;i++)
    {
        int pos = Index(str[i]);
        cout<<code[pos];
    }
    cout<<endl;
}

int HuffmanTree::Index(char c) {
    for(int i=0;i<leafNum;i++)
        if(c==strs[i])
            return i;
    return -1;
}

void HuffmanTree::decode(string str) {
    int p= 2*leafNum-1;
    string msg;
    for(int i=0;i<str.size();i++)
    {
        if(str[i]=='0' && tree[p].lChild!=0)
            p=tree[p].lChild;
        else if(str[i]=='1' && tree[p].rChild!=0)
            p=tree[p].rChild;

        if(tree[p].lChild==0 && tree[p].rChild==0) {
            msg += strs[p-1];
            p= 2*leafNum-1;
        }
    }
    if(p==2*leafNum-1)
        cout<<msg<<endl;
    else
        cout<<"error!"<<endl;

}


int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        HuffmanTree myTree;
        myTree.createTree();
        string str1;
        cin>>str1;
        myTree.encode(str1);
        string str2;
        cin>>str2;
        myTree.decode(str2);
    }
    return 0;
}
 
```

### DS内排—堆排序:

```cpp
#include <iostream>
using namespace std;

class heapSort{
    int *array;
    int len;
public:
    heapSort(int n);
    ~heapSort();
    void Sift(int pos,int length);
    void Sort();
    void outPut();
};

heapSort::heapSort(int n) {
    len=n;
    array = new int[n];
    for(int i=0;i<n;i++)
        cin>>array[i];

    for(int i=n/2;i>=0;i--)
        Sift(i,len);
    //输出堆初始化
    outPut();
}

heapSort::~heapSort() {
    delete []array;
}

void heapSort::Sift(int pos, int length) {
    int lChild=2*pos+1,rChild=2*pos+2;
    if(lChild<length)    //左孩子不超过最大值
    {
        if(rChild<length)  //存在右孩子
        {
            if(array[lChild]<array[rChild])
            {
                if(array[lChild]<array[pos])
                {
                    int temp=array[pos];
                    array[pos]=array[lChild];
                    array[lChild]=temp;
                    Sift(lChild,length);   //和左孩子交换之后,筛选左孩子
                }
            }
            else{
                if(array[rChild]<array[pos])
                {
                    int temp=array[pos];
                    array[pos]=array[rChild];
                    array[rChild]=temp;
                    Sift(rChild,length);   //和右孩子交换之后,筛选右孩子
                }
            }
        }
        else    //只有左孩子，没右孩子
        {
            if(array[lChild]<array[pos])
            {
                int temp=array[pos];
                array[pos]=array[lChild];
                array[lChild]=temp;
                Sift(lChild,length);   //和左孩子交换之后,筛选左孩子
            }
        }
    }
}

void heapSort::Sort() {
    for(int i=len-1;i>0;i--)    //从最后一个结点开始筛选,每次减一
    {
        int temp=array[i];
        array[i]=array[0];
        array[0]=temp;
        Sift(0,i);
        outPut();
    }

}

void heapSort::outPut() {
    cout<<len<<' ';
    for(int i=0;i<len;i++) {
        cout << array[i];
        if(i!=len-1)
            cout<<' ';
    }
    cout<<endl;
}

int main()
{
    int n;
    cin>>n;
    heapSort myHeap(n);
    myHeap.Sort();
    return 0;
}

```

### DS内排—直插排序:

```cpp
#include<iostream>
using namespace std;

class Array{
    int *array;
    int len;
public:
    Array(int n);
    ~Array();
    void outPut();
    void InsertSort();
};

Array::Array(int n){
    len = n;
    array = new int[n];
    for( int i=0; i<n; i++){
        cin >> array[i];
    }
}

Array::~Array(){
    delete[] array;
    len = 0;
}

void Array::outPut(){
    for( int i=0; i<len; i++){
        cout << array[i] << " ";
    }
    cout << endl;
}

void Array::InsertSort(){
    int i,j,temp;
    for(i=1; i<len; i++){
        temp = array[i];
        for( j=i; j>0; j--){
            if(temp<array[j-1]){
                array[j] = array[j-1];
            }else
                break;
        }
        array[j] = temp;
        outPut();
    }
}

int main(){
    int n;
    cin >> n;
    Array myArray(n);
    myArray.InsertSort();
    return 0;
}
```

### DS哈希查找与增补:

```cpp
#include<iostream>
using namespace std;

class ListNode{
public:
    ListNode(){
        next = NULL;
    }
    int data;
    ListNode *next;
};

class HashTable{
    int HashNum;
    ListNode *array[11];
    int Hash(int key);
public:
    HashTable(int n);
    void Search(int key);
};

int HashTable::Hash(int key) {
    return key%11;
}

HashTable::HashTable(int n) {
    int e;
    for( int i=0; i<11; i++){
        array[i] = new ListNode;
        array[i]->data = i;
    }
    while( n-- ){
        cin >> e;
        HashNum = Hash(e);
        ListNode *p = new ListNode;
        p->data = e;
        if( array[HashNum]->next==NULL ){
            p->next = NULL;
            array[HashNum]->next = p;
        }else{
            p->next = NULL;
            ListNode *q = new ListNode;
            q = array[HashNum];
            while(q->next){
                q=q->next;
            }
            q->next=p;
        }
    }
}

void HashTable::Search(int key) {
    int cnt=0;
    bool flag = false;
    HashNum = Hash(key);
    ListNode *p=array[HashNum];
    while( p->next ){
        cnt++;
        p=p->next;
        if( key==p->data ){
            flag = true;
            break;
        }
    }
    if( flag== true ){
        cout << HashNum << " " << cnt << endl;
    }else{
        ListNode *q = new ListNode;
        q->data=key;
        q->next = NULL;
        ListNode *k = new ListNode;
        k = array[HashNum];
        while(k->next){
            k=k->next;
        }
        k->next=q;
        cout << "error" << endl;
    }
}

int main(){
    int t;
    cin >> t;
    HashTable myHash(t);
    int n, key;
    cin >> n;
    while(n--){
        cin >> key;
        myHash.Search(key);
    }
    return 0;
}
```

### DS图—最小生成树:

```cpp
#include <iostream>
#include <string>
#include <queue>
using namespace std;

class Graph{
    int vexNum;
    int arcNum;
    int **array;
    string *vex;
    bool *visit;
    int Index(string str);
    bool isOver();
public:
    Graph();
    ~Graph();
    void Prim(string Vex);
    void Kruskal();
};

Graph::Graph(){
    cin>>vexNum;
    vex = new string[vexNum];
    for(int i=0;i<vexNum;i++)
        cin>>vex[i];

    array = new int*[vexNum];
    visit = new bool[vexNum];
    for(int i=0;i<vexNum;i++)
    {
        visit[i] = false;
        array[i] = new int[vexNum];
        for(int j=0;j<vexNum;j++)
            array[i][j] = 99999;
    }

    cin>>arcNum;
    for(int i=0;i<arcNum;i++)
    {
        string str1,str2;
        int weight;
        cin>>str1>>str2>>weight;
        int num1=Index(str1),num2=Index(str2);
        array[num1][num2] = weight;
        array[num2][num1] = weight;
    }

}

int Graph::Index(string str) {
    for(int i=0;i<vexNum;i++)
        if(vex[i]==str)
            return i;
    return -1;
}

void Graph::Prim(string Vex) {
    int v = Index(Vex);
    visit[v] = true;
    int minWeight=0;
    queue<string> start;
    queue<string> end;
    queue<int> weights;
    while (!isOver())
    {
        int min=99999,startVex=-1,endVex=-1;
        for(int i=0;i<vexNum;i++)
        {
            if(visit[i])
            {
                for(int j=0;j<vexNum;j++)
                {
                    if(!visit[j] && array[i][j]<min) {
                        min = array[i][j];
                        startVex = i;
                        endVex = j;
                    }
                }
            }
        }
        visit[endVex] = true;
        minWeight+=min;
        start.push(vex[startVex]);
        end.push(vex[endVex]);
        weights.push(min);
    }

    cout<<minWeight<<endl;
    cout<<"prim:"<<endl;
    while (!start.empty())
    {
        cout<<start.front()<<' '<<end.front()<<' '<<weights.front()<<endl;
        start.pop();
        end.pop();
        weights.pop();
    }
}

bool Graph::isOver() {
    for(int i=0;i<vexNum;i++)
        if(!visit[i])
            return false;
    return true;
}

void Graph::Kruskal() {
    cout<<"kruskal:"<<endl;
    int father[vexNum]; //每个点的阵营
    for(int i=0;i<vexNum;i++)
        father[i] = i;
    bool isExist[vexNum][vexNum];
    for(int i=0;i<vexNum;i++)
        for(int j=0;j<vexNum;j++)
            isExist[i][j]= false;

    for(int k=0;k<vexNum-1;k++) //vexNum个结点，有vexNum-1条边
    {
        //找最小权值边
        int min=99999,pos1=0,pos2=0;
        for(int i=0;i<vexNum;i++)
        {
            for(int j=0;j<vexNum;j++)
            {
                if(father[i] == father[j])     //如果同一阵营，则不找其边，防止构成环
                    continue;

                if(array[i][j]<min && !isExist[i][j])
                {
                    min = array[i][j];
                    pos1 = i;
                    pos2 = j;
                }
            }
        }
        isExist[pos1][pos2] = true;
        isExist[pos2][pos1] = true;
        //编入阵营
        if(pos1<pos2)
        {
            cout<<vex[pos1]<<' '<<vex[pos2]<<' '<<min<<endl;
            for(int i=0;i<vexNum;i++)
                if(father[i] == father[pos2] && i!=pos2)
                    father[i] = father[pos1];
            father[pos2] = father[pos1];
        }
        else
        {
            cout<<vex[pos2]<<' '<<vex[pos1]<<' '<<min<<endl;
            for(int i=0;i<vexNum;i++)
                if(father[i] == father[pos1] && i!=pos1)
                    father[i] = father[pos2];
            father[pos1] = father[pos2];
        }
    }
}

int main()
{
    Graph myGraph;
    string v;
    cin>>v;
    myGraph.Prim(v);
    myGraph.Kruskal();
    return 0;
}

```

### DS队列之银行排队:

```cpp
#include<iostream>
#include<queue>
using namespace std;

int main(){
    int t;
    cin >> t;
    int n=t;
    queue<char> Q;
    queue<int> T;
    while(n--)
    {
        char s;
        cin >> s;
        Q.push(s);
    }
    n=t;
    while(n--)
    {
        int a;
        cin >> a;
        T.push(a);
    }
    int num[3]={0};
    int num1[3]={0};
    n=t;
    while( n-- )
    {
        char s;
        s=Q.front();
        if( s=='A' )
        {
            num[0]+=T.front();
            num1[0]++;
        }else if( s=='B' )
        {
            num[1]+=T.front();
            num1[1]++;
        }else{
            num[2]+=T.front();
            num1[2]++;
        }
        Q.pop();
        T.pop();
    }
    cout << num[0]/num1[0] << endl;
    cout << num[1]/num1[1] << endl;
    cout << num[2]/num1[2] << endl;
    return 0;
}
```

### DS二叉排序树之删除:

```cpp
#include <iostream>
using namespace std;

class BiNode{
    int data;
    BiNode *lChild;
    BiNode *rChild;
    BiNode *parents;
public:
    BiNode():lChild(NULL),rChild(NULL),parents(NULL){}
    BiNode(int e):data(e),lChild(NULL),rChild(NULL),parents(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    void InsertNode(int data,BiNode *&r);
    void MidOrder(BiNode *t);
    void Delete(int key,BiNode *&t);
    BiNode* getBefore(BiNode *s);
public:
    BiTree(int data){root = new BiNode(data);}
    void Insert(int key);
    void MidOrder();
    void Delete(int key);
};

void BiTree::InsertNode(int data,BiNode *&r) {
    if(data>r->data && r->rChild)
        InsertNode(data,r->rChild);
    else if(data < r->data && r->lChild)
        InsertNode(data,r->lChild);
    else if(data> r->data && !r->rChild){
        BiNode *s = new BiNode(data);
        r->rChild = s;
        s->parents = r;
    }else if(data<r->data && !r->lChild){
        BiNode *s = new BiNode(data);
        r->lChild = s;
        s->parents = r;
    }
}

void BiTree::Insert(int key) {
    InsertNode(key,root);
}

void BiTree::MidOrder(BiNode *t) {
    if(t){
        MidOrder(t->lChild);
        cout<<t->data<<' ';
        MidOrder(t->rChild);
    }
}

void BiTree::MidOrder() {
    MidOrder(root);
    cout<<endl;
}

void BiTree::Delete(int key, BiNode *&t) {
    if(key > t->data && t->rChild){
        Delete(key,t->rChild);
    }else if(key <t->data && t->lChild){
        Delete(key,t->lChild);
    }else if(key == t->data){
        if(!t->lChild && !t->rChild){
            delete t;
            t = NULL;
        }else if(t->lChild && !t->rChild){
            BiNode *p = t;
            t = t->lChild;
            delete p;
        }else if(t->rChild && !t->lChild){
            BiNode *p = t;
            t = t->rChild;
            delete p;
        }else if(t->lChild && t->rChild){
            BiNode *p = getBefore(t);
            t->data = p->data;
            if(p->lChild)
                p->parents->rChild = p->lChild;
            if(t->lChild == p)		//当直接前驱就是他的左孩子时候，要把该节点左孩子设为NULL
                t->lChild = NULL;
            delete p;
        }
    }
}

void BiTree::Delete(int key) {
    Delete(key,root);
}

BiNode *BiTree::getBefore(BiNode *s) {      //获取s的中序遍历直接前驱
    BiNode *p = s->lChild;
    while (p->rChild)
        p= p->rChild;
    return p;
}

int main(){
    int t;
    cin>>t;
    while (t--)
    {
        int n;
        cin>>n;
        int data;
        cin>>data;
        BiTree myTree(data);
        for(int i=1;i<n;i++){
            cin>>data;
            myTree.Insert(data);
        }
        myTree.MidOrder();
        int m;
        cin>>m;
        while (m--){
            int key;
            cin>>key;
            myTree.Delete(key);
            myTree.MidOrder();
        }
    }
}

```

### DS二叉排序树之查找:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    int data;
    BiNode *lChild;
    BiNode *rChild;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(int e):data(e),lChild(NULL), rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int count;
    void InsertNode(int data, BiNode *&r);
    void MidOrder(BiNode *t);
    bool Search(int key, BiNode *t);
public:
    BiTree(int data){
        root = new BiNode(data);
    }
    void Insert(int key);
    void MidOrder();
    void Search(int key);
};

void BiTree::InsertNode(int data, BiNode *&r){
    if(data>r->data && r->rChild){
        InsertNode(data, r->rChild);
    }else if( data > r->data && !r->rChild){
        BiNode *s = new BiNode(data);
        r->rChild = s;
    }else if( data < r->data && r->lChild ){
        InsertNode(data, r->lChild);
    }else if( data < r->data && !r->lChild){
        BiNode *s = new BiNode(data);
        r->lChild = s;
    }
}

void BiTree::Insert(int key){
    InsertNode(key, root);
}

void BiTree::MidOrder(BiNode *t){
    if( t ){
        MidOrder(t->lChild);
        cout << t->data << " ";
        MidOrder(t->rChild);
    }
}

void BiTree::MidOrder(){
    MidOrder(root);
    cout << endl;
}

bool BiTree::Search( int key, BiNode *t){
    count++;
    if( key > t->data && t->rChild ){
        return Search(key, t->rChild);
    }else if( key < t->data && t->lChild ){
        return Search(key,t->lChild);
    }else if( key==t->data){
        return true;
    }
    count++;
    return false;
}

void BiTree::Search(int key){
    count = 0;
    if(Search(key, root)){
        cout << count << endl;
    }else{
        cout << "-1" << endl;
    }
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        int n;
        cin >> n;
        int data;
        cin >> data;
        BiTree myTree(data);
        for( int i=1; i<n; i++){
            cin >> data;
            myTree.Insert(data);
        }
        myTree.MidOrder();
        int m;
        cin >> m;
        while( m-- ){
            int key;
            cin>>key;
            myTree.Search(key);
        }
    }
    return 0;
}
```

### DS图—图的连通分量:

```cpp
#include <iostream>
#include <string>
using namespace std;

class Graph{
    int vexNum;
    int arcNum;
    string *vex;
    int **array;
    bool *visit;
    int count;
    void DFS(int v);
    int Index(string str);
public:
    Graph();
    ~Graph();
    void getConnect();
    void outPut();
};

Graph::Graph():count(0) {
    cin>>vexNum;
    vex = new string[vexNum];
    for(int i=0;i<vexNum;i++)
        cin>>vex[i];

    array = new int*[vexNum];
    visit = new bool[vexNum];
    for(int i=0;i<vexNum;i++)
    {
        visit[i] = false;
        array[i] = new int[vexNum];
        for(int j=0;j<vexNum;j++)
            array[i][j] = 0;
    }

    cin>>arcNum;
    for(int i=0;i<arcNum;i++)
    {
        string str1,str2;
        cin>>str1>>str2;
        int num1=Index(str1),num2=Index(str2);
        array[num1][num2] = 1;
        array[num2][num1] = 1;
    }
}

Graph::~Graph() {
    delete []visit;
    delete []vex;
    for(int i=0;i<vexNum;i++)
        delete []array[i];
    delete []array;
}

void Graph::DFS(int v) {
    if(!visit[v])
    {
        visit[v] = true;
        for(int j=0;j<vexNum;j++)
            if(array[v][j]==1)
                DFS(j);
    }
}

void Graph::getConnect() {
    for(int i=0;i<vexNum;i++)
        if(!visit[i])
        {
            DFS(i);
            count++;
        }

}

int Graph::Index(string str) {
    for(int i=0;i<vexNum;i++)
        if(vex[i] == str)
            return i;
    return -1;
}

void Graph::outPut() {
    for(int i=0;i<vexNum;i++)
        if(i!=vexNum-1)
            cout<<vex[i]<<' ';
        else
            cout<<vex[i]<<endl;

    for(int i=0;i<vexNum;i++)
        for(int j=0;j<vexNum;j++)
            if(j!=vexNum-1)
                cout<<array[i][j]<<' ';
            else
                cout<<array[i][j]<<endl;

    cout<<count<<endl<<endl;
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        Graph myGraph;
        myGraph.getConnect();
        myGraph.outPut();
    }
    return 0;
}

```

### DS顺序表之循环移位:

```cpp
#include<iostream>
using namespace std;

class SeqList{
	int *list;
	int len;
	int maxLen;
public:
	SeqList( int n);
	~SeqList();
	void move();
	void outPut();
};

SeqList::SeqList(int n){
	len = n;
	maxLen = 100;
	list = new int[maxLen];
	for( int i=0; i<n; i++){
		cin >> list[i];
	}
}

SeqList::~SeqList(){
	delete []list;
}

void SeqList::move(){
	int direction, step;
	cin >> direction >> step;
	while( step >= len ){
		step-=len;
	}
	
	int temp[step];
	
	if( direction == 0){
		for( int i=0; i<step; i++){
			temp[i] = list[i];
		}
		for( int i=step; i<len; i++){
			list[i-step] = list[i];
		}
		for( int i=step+1; i<len; i++){
			list[i] = temp[i-step-1];
		}
	}else{
		for( int i=len -step; i<len; i++){
			temp[i-len+step] = list[i];
		}
		for( int i=len-step-1; i>=0; i--){
			list[i+step] = list[i];
		}
		for( int i=0; i<step; i++)
		{
			list[i]=temp[i];
		}
	}
}

void SeqList::outPut(){
	for( int i=0; i<len; i++)
	{
		cout << list[i] << " ";
	}
	cout << endl;
}

int main(){
	int n;
	cin >> n;
	SeqList list(n);
	list.outPut();
	list.move();
	list.outPut();
	list.move();
	list.outPut();
	
	return 0;
}

```

### DS线性结构—火车问题:

```cpp
#include<iostream>
#include<stack>
#include<queue>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        int n;
        string s1, s2;
        stack<char> st;
        queue<string> order;
        cin >> n >> s1 >> s2;
        int j = 0;

        for(int i = 0; i < n; )
        {
            order.push("in");
            st.push(s1[i]);
            i ++ ;
            while(!st.empty())
            {
                if(st.top() == s2[j])
                {
                    j ++ ;
                    st.pop();
                    order.push("out");
                }else break;
            }
        }

        if(st.empty() && j == s2.length())
        {
            cout << "Yes" << endl;
            while(!order.empty())
            {
                cout << order.front() << endl;
                order.pop();
            }
        }else cout << "No" << endl;

        cout << "FINISH" << endl;
    }
}
```

### DS线性表—多项式相加:

```cpp
#include<iostream>
using namespace std;
class ListNode
{
public:
    int data1, data2;
    ListNode *next;
    ListNode()
    {
        next = NULL;
    }
};

class LinkList
{
public:
    ListNode *head;
    int len;
    LinkList(){
        head = new ListNode;
        len = 0;
    }
    ~LinkList(){
        ListNode *p, *q;
        p = head;
        while(p)
        {
            q=p;
            p=p->next;
            delete q;
        }
        len = 0;
        head = NULL;
    }
    void CreateList( int n)
    {
        int i;
        ListNode *q = head;
        int d1, d2;
        for( i=0; i<n; i++)
        {
            cin >> d1 >> d2;
            ListNode *p = new ListNode;
            p->data1 = d1;
            p->data2 = d2;
            q->next = p;
            p->next = NULL;
            q = p;
        }
        len = n;
    }
    void Display()
    {
        int i;
        ListNode *p = head->next;
        for( i=0; i<len; i++)
        {
            if( p->data1 == 0)
            {
                p=p->next;
                continue;
            }else if( p->data2 == 0)
            {
                if( p->data1 < 0)
                {
                    cout << "(" << p->data1 << ")";
                }else{
                    cout << p->data1;
                }
                p=p->next;
            }else{
                if( p->data1 < 0 )
                {
                    cout << "(" << p->data1 << ")x^";
                }else{
                    cout << p->data1 << "x^";
                }
                if( p->data2 < 0 )
                {
                    cout << "(" << p->data2 << ")";
                }else{
                    cout << p->data2;
                }
                p=p->next;
            }
            if( i!=len-1 )
            {
                cout << " + ";
            }
        }
        cout << endl;
    }
    void add(LinkList *q)
    {
        ListNode *pre = head;
        ListNode *s = pre->next;
        ListNode *r = q->head->next;

        while( s!=NULL && r!=NULL )
        {
            if( s->data2 < r->data2)
            {
                s = s->next;
                pre = pre->next;
            }else if(s->data2 == r->data2)
            {
                s->data1 = s->data1+r->data1;
                s = s->next;
                pre = pre->next;
                r = r->next;
                q->len--;
            }else{
                ListNode *m = new ListNode;
                m->data1 = r->data1;
                m->data2 = r->data2;
                m->next = s;
                pre->next = m;
                r = r->next;
                pre = pre->next;
                q->len--;
            }
        }
        if(r)
        {
            pre->next = r;
            len = len+q->len;
        }
    }

    ListNode *index(int i)
    {
        int k;
        ListNode *p = head;
        if( i!=0 )
        {
            for( k=1; k<i; k++)
            {
                p=p->next;
            }
            return p->next;
        }else{
            return head;
        }
    }
};

int main()
{
    int T, n, m;
    cin >> T;
    while( T-- )
    {
        LinkList *list1 = new LinkList, *list2 = new LinkList;
        cin >> n;
        list1->CreateList(n);
        cin >> m;
        list2->CreateList(m);
        list1->Display();
        list2->Display();
        list1->add(list2);
        list1->Display();
        delete list1, list2;
    }
    return 0;
}
```

### DS链表—学生宿舍管理:

```cpp
#include <iostream>
#include <list>
#include <vector>
#include <algorithm>
#define ok 0
#define error -1
using namespace std;
 
void outint(int n){cout<<n<<" ";}
int main()
{
    list<int> L1,L2;
    list<string> L3;
    list<int>::iterator p1=L1.begin(),p2=L2.begin();
    list<string>::iterator p3=L3.begin();
    for(int i=0;i<20;i++)
    {
        L1.insert(p1,101+i);
        p1++;
    }
    L1.sort();
    int n,k;
    string temp;
    cin>>n;
    for(int i=0;i<n;i++)
    {
        cin>>temp;
        cin>>k;
        for(p1=L1.begin();p1!=L1.end();p1++)
        {
            if(*p1==k)
            {
                L1.erase(p1);
                L2.insert(L2.begin(),k);
                L2.sort();
                for(p2=L2.begin(),p3=L3.begin();p2!=L2.end();p2++,p3++)
                {
                    if(*p2==k)
                        L3.insert(p3,temp);
                }
                break;
            }
        }
    }
    string c1,c2;
    cin>>n;
    for(int i=0;i<n;i++)
    {
        cin>>c1;
        if(c1=="assign")
        {
            cin>>c2;
            k=*L1.begin();
            L2.insert(L2.begin(),k);
            L2.sort();
            for(p2=L2.begin(),p3=L3.begin();p2!=L2.end();p2++,p3++)
                {
                    if(*p2==k){
                        L3.insert(p3,c2);
                        break;
                    }
                }
            L1.erase(L1.begin());
        }
        if(c1=="return")
        {
            cin>>k;
            for(p2=L2.begin(),p3=L3.begin();p2!=L2.end();p2++,p3++)
                {
                    if(*p2==k)
                    {
                        L1.insert(L1.end(),k);
                        L2.erase(p2);
                        L3.erase(p3);
                        break;
                    }
                }
        }
        int flag=1;
        if(c1=="display_used")
        {
            flag=1;
            for(p2=L2.begin(),p3=L3.begin();p2!=L2.end();p2++,p3++)
            {
                if(flag==1)
                {
                    cout<<*p3<<"("<<*p2<<")";
                    flag=0;
                }
                else
                    cout<<"-"<<*p3<<"("<<*p2<<")";
            }
            cout<<endl;
        }
        if(c1=="display_free")
        {
            flag=1;
            for(p1=L1.begin();p1!=L1.end();p1++)
            {
                if(flag==1)
                {
                    cout<<*p1;
                    flag=0;
                }
                else
                    cout<<"-"<<*p1;
            }
            cout<<endl;
        }
    }
}
```

### DS静态查找之折半查找:

```cpp
#include <iostream>
using namespace std;

class BinSearch{
    int len;
    int *array;
public:
    BinSearch();
    ~BinSearch();
    int search(int key);
};

BinSearch::BinSearch() {
    cin>>len;
    array = new int[len+1];
    for(int i=1;i<=len;i++)
        cin>>array[i];
}

BinSearch::~BinSearch() {
    delete []array;
}

int BinSearch::search(int key) {
    int low=1,high=len,mid;
    while (low<=high)
    {
        mid = (high+low)/2;
        if(array[mid] == key)
            return mid;
        else if(array[mid] > key)
            high = mid-1;
        else if(array[mid] < key)
            low = mid+1;
    }
    return 0;
}


int main()
{
    BinSearch myArray;
    int t;
    cin>>t;
    while (t--)
    {
        int key;
        cin>>key;
        int res = myArray.search(key);
        if(res != 0)
            cout<<res<<endl;
        else
            cout<<"error"<<endl;
    }
}

```

### DS静态查找之顺序查找:

```cpp
#include<iostream>
using namespace std;

class Table{
    int len;
    int *elem;
public:
    Table(int n);
    ~Table();
    int Search(int key);
};

Table::Table(int n){
    len = n;
    elem = new int[n+1];
    for( int i=1; i<=n; i++){
        cin >> elem[i];
    }
}

Table::~Table(){
    len = 0;
    delete[] elem;
}

int Table::Search(int key){
    elem[0] = key;
    for( int i = len; i>=0; i--){
        if(elem[i]==key){
            return i;
        }
    }
}

int main(){
    int n;
    cin >> n;
    Table myTable(n);
    int t;
    cin >> t;
    while( t-- ){
        int key;
        cin >> key;
        int res=myTable.Search(key);
        if(res==0){
            cout << "error" << endl;
        }else{
            cout << res << endl;
        }
    }
    return 0;
}
```

### DS串应用—最长重复子串:

```cpp
#include<iostream>
#include<string>

using namespace std;

void getNext(string p, int *next)
{
    next[0] = -1;
    int i = 0, j = -1;
    while(i < (int)p.length())
    {
        if(j == -1 || p[i] == p[j]) next[ ++ i] = ++ j;
        else j = next[j];
    }
}

int main()
{
    int n;
    cin >> n;
    string s, re;
    int i, j = -1, k;
    int Max = 0;
    while(n -- )
    {
        int next[100] = {0};
        Max = -1;
        cin >> s;
        re = s;
        for(i = 0, k = (int)s.length() - 1; k >= 0; i ++ , k -- )
            re[i] = s[k];
        
        getNext(s, next);
        for(i = 0; i <= (int)s.length(); ++ i)
            if(next[i] > Max && next[i] <= (int)s.length() / 2)
                Max = next[i];
        
        getNext(re, next);
        for(i = 0; i <= (int)re.length(); ++ i)
            if(next[i] > Max && next[i] <= (int)re.length() / 2)
                Max = next[i];

        if(Max == 0) cout << j << endl;
        else cout << Max << endl;
    }
    return 0;
}
```

### DS二叉排序树之创建和插入:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    int data;
    BiNode *lChild;
    BiNode *rChild;
public:
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(int e):data(e),lChild(NULL), rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    void InsertNode(int data, BiNode *&r);
    void MidOrder(BiNode *t);
public:
    BiTree(int data){
        root = new BiNode(data);
    }
    void Insert(int key);
    void MidOrder();
};

void BiTree::InsertNode(int data, BiNode *&r){
    if(data>r->data && r->rChild){
        InsertNode(data, r->rChild);
    }else if( data > r->data && !r->rChild){
        BiNode *s = new BiNode(data);
        r->rChild = s;
    }else if( data < r->data && r->lChild ){
        InsertNode(data, r->lChild);
    }else if( data < r->data && !r->lChild){
        BiNode *s = new BiNode(data);
        r->lChild = s;
    }
}

void BiTree::Insert(int key){
    InsertNode(key, root);
}

void BiTree::MidOrder(BiNode *t){
    if( t ){
        MidOrder(t->lChild);
        cout << t->data << " ";
        MidOrder(t->rChild);
    }
}

void BiTree::MidOrder(){
    MidOrder(root);
    cout << endl;
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        int n;
        cin >> n;
        int data;
        cin >> data;
        BiTree myTree(data);
        for( int i=1; i<n; i++){
            cin >> data;
            myTree.Insert(data);
        }
        myTree.MidOrder();
        int m;
        cin >> m;
        while( m-- ){
            cin >> data;
            myTree.Insert(data);
            myTree.MidOrder();
        }
    }
    return 0;
}
```

### DS静态查找之顺序索引查找:

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;
class Sequential_index_table{
public:
    int length;            //顺序表长度
    int index_length;      //索引表长度
    int *elem;            //顺序表
    int *index;            //索引表最大关键字
    int *index_loc;         //索引表最大关键字的起始地址
public:
    Sequential_index_table(){};
    Sequential_index_table(int t){
        length = t;
        elem = new int[length];
        for(int i = 0; i < length; i++)        //初始化顺序表
            cin>>elem[i];
 
        cin>>index_length;                    //初始化索引表最大关键字
        index = new int[index_length];
        for(int i = 0; i < index_length; i++)
            cin>>index[i];
 
        index_loc = new int [index_length];
        index_loc[0]=0;
        for(int i=0;i<index_length-1;i++)      //根据索引表最大关键字初始化最大关键字起始地址
        {
            for(int j=index_loc[i];j<length;j++)
            {
                if(elem[j]>index[i])
                {
                    index_loc[i+1]=j;
                    break;
                }
            }
        }
    }
    ~Sequential_index_table(){};
    void Index_search(int key){
        int compare_time=0;
        for(int i=0;i<index_length;i++)
        {
            compare_time++;
            if(key <= index[i] || i==index_length-1)    //先和索引表最大关键字比较
            {
                int start_loc = index_loc[i];
                int end_loc = i+1>=index_length ? length:index_loc[i+1];
                for(int j=start_loc;j<end_loc;j++)      //再从索引表最大关键字对应的下标开始比较
                {
                    compare_time++;
                    if(elem[j]==key)
                    {
                        cout<<j+1<<'-'<<compare_time<<endl;
                        return;
                    }
                }
                cout<<"error"<<endl;
                return;
            }
        }
    }
};
int main()
{
    int t,p,key;
    while(cin>>t)
    {
        Sequential_index_table test(t);
        cin>>p;
        while(p--)
        {
            cin>>key;
            test.Index_search(key);
        }
    }
}
 
 
 
```

### DS哈希查找—线性探测再散列:

```cpp
#include<iostream>
using namespace std;

class HashTable{
    int len;
    int keyNum;
    int *array;
    int HashNum;
    int Hash(int key);
public:
    HashTable();
    ~HashTable();
    void Search(int key);
    void Display();
};

HashTable::HashTable() {
    cin >> len >> keyNum;
    array = new int[len];
    for(int i=0; i<len; i++){
        array[i]=0;
    }
    for( int i=0; i<keyNum; i++){
        int key;
        cin >> key;
        HashNum = Hash(key);
        for( int j=0; j<keyNum; j++){
            if( array[(HashNum+j)%len]==0 ){
                array[(HashNum+j)%len] = key;
                break;
            }
        }
    }
}

HashTable::~HashTable() {
    delete[] array;
    len = 0;
}

int HashTable::Hash(int key) {
    return key%11;
}

void HashTable::Display() {
    for( int i=0; i<len; i++){
        if( array[i]==0 ){
            cout << "NULL";
        }else{
            cout << array[i];
        }
        if( i==len-1 ){
            cout << endl;
        }else{
            cout << " ";
        }
    }
}

void HashTable::Search(int key) {
    HashNum = Hash(key);
    int i;
    for( i=0; i<len; i++){
        if( array[(HashNum+i)%len]==key || array[(HashNum+i)%len]==0){
            break;
        }
    }
    if( array[(HashNum+i)%len]==key ){
        cout << "1 " << i+1 << " " << (HashNum+i)%len+1 << endl;
    }else{
        cout << "0 " << i+1 << endl;
    }
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        HashTable myHash;
        myHash.Display();
        int n;
        cin >> n;
        while( n-- ){
            int key;
            cin >> key;
            myHash.Search(key);
        }
    }
    return 0;
}
```

### DS二叉树——二叉树之数组存储:

```cpp
#include <iostream>
using namespace std;

class BiTree{
    int len;
    int *tree;
    void PreOrder(int i);
public:
    BiTree();
    ~BiTree();
    void PreOrder();
};

BiTree::BiTree() {
    cin>>len;

    tree = new int[len];

    for(int i=0;i<len;i++)
        cin>>tree[i];
}

BiTree::~BiTree() {
    delete []tree;
}

void BiTree::PreOrder() {
    PreOrder(0);
    cout<<endl;
}

void BiTree::PreOrder(int i) {
    if(tree[i]!=0 && i<len) {
        cout << tree[i]<<' ';
        PreOrder(2 * i + 1);
        PreOrder(2 * i + 2);
    }
}

int main()
{
    int t;
    cin>>t;
    while (t--)
    {
        BiTree myTree;
        myTree.PreOrder();
    }
    return 0;
}

```

### DS二叉树——二叉树之父子结点:

```cpp
#include<iostream>
#include<queue>
using namespace std;

class BiNode{
    char data;
    BiNode *lchild;
    BiNode *rchild;
    BiNode *parents;
public:
    BiNode():lchild(NULL),rchild(NULL),parents(NULL){}
    BiNode(char e):data(e),lchild(NULL),rchild(NULL),parents(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    queue<BiNode*> leaf;
    queue<BiNode*> parents;
    void CreateTree(BiNode *&t, BiNode *p);
    void PreOrder(BiNode *t);
public:
    BiTree():root(NULL){}
    void CreateTree();
    void PreOrder();
};

void BiTree::CreateTree(BiNode *&t, BiNode *p){
    char c;
    cin >> c;
    if( c!='0' )
    {
        t=new BiNode(c);
        t->parents = p;
        CreateTree(t->lchild, t);
        CreateTree(t->rchild, t);
    }else{
        t=NULL;
    }
}

void BiTree::CreateTree(){
    CreateTree(root, NULL);
}

void BiTree::PreOrder(BiNode *t){
    if(t)
    {
        if(!t->lchild && !t->rchild)
        {
            leaf.push(t);
            parents.push(t->parents);
        }
        PreOrder(t->lchild);
        PreOrder(t->rchild);
    }   
}

void BiTree::PreOrder(){
    PreOrder(root);
    while( !leaf.empty()){
        cout << leaf.front()->data << " ";
        leaf.pop();
    }
    cout << endl;
    while( !parents.empty())
    {
        cout << parents.front()->data << " ";
        parents.pop();
    }
    cout << endl;
}

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        BiTree tree;
        tree.CreateTree();
        tree.PreOrder();
    }
    return 0;
}
```

### DS图—图的邻接矩阵存储及度计算:

```cpp
#include<iostream>
using namespace std;

class Graph{
    char type;
    int vexNum;
    int arcNum;
    string *vex;
    int **array;
    int *in;
    int *out;
public:
    Graph();
    ~Graph();
    int Index(string str);
    void countDegree();
    void outPut();
};

Graph::Graph(){
    cin >> type >> vexNum;
    vex = new string[vexNum];
    for( int i=0; i<vexNum; i++){
        cin >> vex[i];
    }
    array = new int*[vexNum];
    for(int i=0; i<vexNum; i++){
        array[i] = new int[vexNum];
        for( int j=0; j<vexNum; j++){
            array[i][j] = 0;
        }
    }
    in =  new int[vexNum];
    out = new int[vexNum];
    for(  int i=0; i<vexNum; i++){
        in[i]=0;
        out[i]=0;
    }
    cin >> arcNum;
    for( int i=0; i<arcNum; i++){
        string str1, str2;
        cin >> str1 >> str2;
        int pos1 = Index(str1), pos2 = Index(str2);
        if( type == 'U'){
            array[pos1][pos2] = 1;
            array[pos2][pos1] = 1;
        }else if( type == 'D'){
            array[pos1][pos2] = 1;
        }
    }
}

Graph::~Graph(){
    for( int i=0; i<vexNum; i++){
        delete array[i];
    }
    delete array;
    delete in;
    delete out;
}

int Graph::Index(string str){
    for( int i=0; i<vexNum; i++){
        if( vex[i]==str){
            return i;
        }
    }
    return -1;
}

void Graph::countDegree(){
    for(int i=0; i<vexNum; i++){
        for( int j=0; j<vexNum; j++){
            if( array[i][j]==1){
                out[i]++;
                in[j]++;
            }
        }
    }
}

void Graph::outPut(){
    for( int i=0; i<vexNum; i++){
        for( int j=0; j<vexNum; j++){
            if( j!=vexNum-1){
                cout << array[i][j] << " ";
            }else{
                cout << array[i][j] << endl;
            }
        }
    }
    for( int i=0; i<vexNum; i++){
        cout << vex[i];
        if( type=='D'){
            if( out[i]!=0 || in[i]!=0){
                cout << ": " << out[i] << " " << in[i]
                << " " << out[i] + in[i] << endl;
            }else{
                cout << endl;
            }
        }else if( type=='U' ){
            if(out[i]!=0){
                cout << ": " << in[i] << endl;
            }else{
                cout << endl;
            }
        }
    }
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        Graph myGraph;
        myGraph.countDegree();
        myGraph.outPut();
    }
    return 0;
}
```

### DS图—图的最短路径（不含代码框架）:

```cpp
#include <iostream>
#include <map>
#include <stack>
using namespace std;
const int maxn = 105;
const int INF = 0x3f3f3f3f;
int Graph[maxn][maxn];
int n;
map<string, int> name;
bool vis[maxn];
int dis[maxn];
int from[maxn];
void init()
{
    for(int i = 0; i < maxn; i++)
    {
        vis[i] = false;
        dis[i] = INF;
        from[i] = i;
        for(int j = 0; j < maxn; j++)
            Graph[i][j] = INF;
    }
    name.clear();
}

string getname(int i)
{
    for(map<string, int>::iterator it = name.begin(); it != name.end(); it++)
        if(it -> second == i)
            return it -> first;
}

void dijkstra(int s)
{
    vis[s] = true;
    
    for(int i = 0; i < n; i++)
        if(Graph[s][i] != INF)
            dis[i] = Graph[s][i], from[i] = s;
    
    for(int N = 1; N < n; N++)
    {
        int minn = INF, mini = -1;
        for(int i  = 0; i < n; i++)
            if(!vis[i] && dis[i] < minn)
                minn = dis[i], mini = i;
        if(mini != -1)
        {
            vis[mini] = true; 
            for(int i = 0; i < n; i++)
                if(!vis[i] && dis[i] > Graph[mini][i] + dis[mini])
                    dis[i] = Graph[mini][i] + dis[mini], from[i] = mini;
        }
    }
    for(int i = 0; i < n; i++)
    {
        if(s == i)
            continue;
        cout << getname(s) << "-" << getname(i);  
        if(dis[i] == INF)
            cout << "--1";
        else
        {
            int now = i;
            stack<int> ss;
            while(now != from[now])
            {
                ss.push(now);
                now = from[now];
            }
            cout << "-" <<  dis[i] << "----[" << getname(s) << ' ';
            while(!ss.empty())
            {
                cout << getname(ss.top()) << ' ';
                ss.pop();
            }
            cout <<"]" ;
        }
        cout << endl;
    }
}

int main()
{
    int t;
    cin >> t;
    while(t--)
    {
        init();
        cin >> n;
        string s;
        for(int i = 0; i < n; i++)
        {
            cin >> s;
            name[s] = i;
        }
        for(int i = 0; i < n; i++)
            for(int j = 0, x; j < n;  j++)
            {
                cin >> x;
                if(x)
                    Graph[i][j] = x;
            }
        cin >> s;
        dijkstra(name[s]);      
    }
}

```

### DS二叉树—二叉树构建与遍历（不含框架）:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    char data;
    BiNode *lchild;
    BiNode *rchild;
public:
    BiNode():lchild(NULL),rchild(NULL){}
    BiNode(char e):data(e),lchild(NULL), rchild(NULL){}
    ~BiNode(){
        delete lchild;
        delete rchild;
    }
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    void CreateTree(BiNode *&t);
    void PreOrder(BiNode *t);
    void MidOrder(BiNode *t);
    void PostOrder(BiNode *t);
public:
    BiTree():root(NULL){}
    ~BiTree(){delete root;}
    void CreateTree();
    void PreOrder();
    void MidOrder();
    void PostOrder();
};

void BiTree::CreateTree(BiNode *&t){
    char c;
    cin >> c;
    if( c!='#' )
    {
        t = new BiNode(c);
        CreateTree(t->lchild);
        CreateTree(t->rchild);
    }else{
        t=NULL;
    }
}

void BiTree::CreateTree(){
    CreateTree(root);
}

void BiTree::PreOrder(BiNode *t)
{
    if(t)
    {
        cout << t->data;
        PreOrder(t->lchild);
        PreOrder(t->rchild);
    }
}

void BiTree::PreOrder(){
    PreOrder(root);
    cout << endl;
}

void BiTree::MidOrder(BiNode *t)
{
    if(t)
    {
        MidOrder(t->lchild);
        cout << t->data;
        MidOrder(t->rchild);
    }
}

void BiTree::MidOrder(){
    MidOrder(root);
    cout << endl;
}

void BiTree::PostOrder(BiNode *t)
{
    if(t)
    {
        PostOrder(t->lchild);
        PostOrder(t->rchild);
        cout << t->data;
    }
}

void BiTree::PostOrder(){
    PostOrder(root);
    cout << endl;
}

int main()
{
    int t;
    cin >> t;
    while( t-- )
    {
        BiTree tree;
        tree.CreateTree();
        tree.PreOrder();
        tree.MidOrder();
        tree.PostOrder();
    }
    return 0;
}
```

### TrieTree:

```cpp
#include <iostream>
#include <string>
#include <queue>
using namespace std;

class Node {
public:
	char data;
	Node* childs[26];
};

class TrieTree {
public:
	Node* root;
	TrieTree() {
		root = new Node();
	}

	void createTree(int num, string* strs) {
		for (int j = 0; j < num; j++) {
			string str = strs[j];
			int len = str.length();
			Node* q = root;

			for (int i = 0; i < len; i++) {
				if (q->childs[str[i] - 97] == NULL) {
					Node* node = new Node();
					node->data = str.at(i);

					q->childs[str[i] - 97] = node;
					q = node;
				}
				else {
					q = q->childs[str[i] - 97];
				}
			}
		}
	}

	void BFSTraverse() {
		Node* q = root;
		queue<Node*> que;
		que.push(q);
		while (que.empty() == false) {
			Node* p = que.front();
			que.pop();
			for (int i = 0; i < 26; i++) {
				if (p->childs[i]) {
					cout << p->childs[i]->data;
					que.push(p->childs[i]);
				}
			}
		}
		cout << endl;
	}

	void find() {
		int n;
		cin >> n;
		for (int j = 0; j < n; j++) {
			string str;
			cin >> str;
			
			Node* q = root;
			int len = str.length();
			int i = 0;
			for (; i < len; i++) {
				if (q->childs[str[i] - 97]) {
					q = q->childs[str[i] - 97];
				}
				else {
					break;
				}
			}

			int count = 0;
			if (i == len) {
				queue<Node*> que;
				que.push(q);
				while (que.empty() == false) {
					Node* p = que.front();
					que.pop();
					int flag = 0;
					for (int k = 0; k < 26; k++) {
						if (p->childs[k]) {
							que.push(p->childs[k]);
							flag = 1;
						}
					}
					if (flag == 0) {
						count++;
					}
				}
			}

			cout << count << endl;
		}
	}
};

int main() {
	char ch;
	int num = 0;
	string strs[1000];
	while ((ch = getchar()) != EOF) {
		if (ch == '\n') {
			num++;
			TrieTree tree;
			tree.createTree(num, strs);
			tree.BFSTraverse();
			tree.find();
			for (int i = 0; i < num; i++) {
				strs[i] = "\0";
			}
			num = 0;
		}
		else if (ch == ' ') {
			num++;
		}
		else {
			strs[num] += ch;
		}
	}
}
```

### dancing party:

```cpp
#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    queue<string> m, f;
    cin >> n;
    for(int i = 0; i < n; i ++ )
    {
        string name, s;
        cin >> name >> s;
        if(s == "F") f.push(name);
        else m.push(name);
    }

    while(!m.empty() && !f.empty())
    {
        cout << f.front() << " " << m.front() << endl;
        f.pop(), m.pop();
    }

    if(!m.empty()) cout << "M:" << m.size() << endl;
    else if(!f.empty()) cout << "F:" << f.size() << endl;
}
```

### 追星:

```cpp
#include <iostream>
using namespace std;
 
int MaxLen;
const int MaxDist=9999;
class Map{
private:
    int **Matrix;
    int Vexnum;
public:
    void SetMatrix(int vnum,int **mx);
    void ShortestPath_DIJ(int v0);
    void refree()
    {
        for(int i=0;i<Vexnum;i++)
            delete [] Matrix[i];
        delete []Matrix;
    }
};
void Map::SetMatrix(int vnum,int **mx)
{
    int i,j;
    Vexnum = vnum;
    Matrix=new int* [MaxLen];
    for(i=0;i<MaxLen;i++)
    {
        Matrix[i]=new int[MaxLen];
        for(j=0;j<MaxLen;j++)
            Matrix[i][j]=MaxDist;
    }
    for(i=0;i<Vexnum;i++)
        for(j=0;j<Vexnum;j++)
            if(mx[i][j])
                Matrix[i][j]=mx[i][j];
}
void Map::ShortestPath_DIJ(int v0)
{
    int i,j,v,w,mmin;
    int *dist = new int[Vexnum];
    bool *final = new bool[Vexnum];
    int path[Vexnum][Vexnum];
    int len[Vexnum];
    for(int i = 0; i < Vexnum; i++)
    {
        final[i]=false;
        dist[i]=Matrix[v0][i];
    }
    for(int i=0;i<Vexnum;i++)
    {
        path[i][0]=v0;
        path[i][1]=i;
    }
    for(int i = 0;i<Vexnum;i++)
    {
        len[i]=2;
    }
    dist[v0]=0;
    final[v0]=true;
    for(int i=0;i<Vexnum;i++)
    {
        mmin=MaxDist;
        for(int j=0;j<Vexnum;j++)
        {
            if(!final[j] && mmin > dist[j])
            {
                mmin=dist[j];
                v=j;
            }
        }
        if(mmin==MaxDist || v==Vexnum-1)    //一旦v0到vN的最短路径取到，就可以停止
            break;
        else
        {
            final[v]=true;
            for(int j=0;j<Vexnum;j++)
            {
                if(!final[j] && Matrix[v][j]+mmin<dist[j])
                {
                    dist[j]=Matrix[v][j]+mmin;
                    for(int p=0;p<len[v];p++)
                    {
                        path[j][p]=path[v][p];
                    }
                    len[j]=len[v]+1;
                    path[j][len[j]-1]=j;
                }
            }
        }
    }
    cout<<dist[Vexnum-1]<<endl;
    delete []dist;
    delete []final;
}
int main()
{
    int t,k,v1,v2,distan;
    int vnum,v0;
    int **mx;
    Map test;
    while(cin>>vnum)
    {
        MaxLen=vnum;
        mx=new int* [MaxLen];
        for(int i=0;i<MaxLen;i++)
        {
            mx[i]=new int[MaxLen];
        }
        cin>>t;
        for(int i=0;i<vnum;i++)
            for(int j=0;j<vnum;j++)
                mx[i][j]=MaxDist;
        while(t--)
        {
             cin>>v1>>v2>>distan;
             mx[v1-1][v2-1]=mx[v1-1][v2-1]<distan?mx[v1-1][v2-1]:distan;       //转换成邻接矩阵要取小的那个
             mx[v2-1][v1-1]=mx[v2-1][v1-1]<distan?mx[v2-1][v1-1]:distan;
        }
        test.SetMatrix(vnum,mx);
        test.ShortestPath_DIJ(0);
        test.refree();
        for(int i=0;i<vnum;i++)
            delete [] mx[i];
        delete []mx;
    }
    return 0;
}
```

### 拯救公主 (Ver. I):

```cpp
#include <iostream>
#include <queue>
using namespace std;

class Box
{
    int x;
    int y;
    int di;
    int step;//用来记录该格位于广度遍历的第几层
public:
    Box();
    friend class Maze;
};

class Maze
{
private:
    int n, m;
    int **maze;
    int directx[4], directy[4];
public:
    Maze(int n1, int m1);
    ~Maze();
    int FindPath();
};

Box::Box()
{
    x = 1;
    y = 1;
    di = 0;
    step = 0;
}

Maze::Maze(int n1, int m1)
{
    n = n1+2;
    m = m1+2;
    maze = new int*[n];
    for(int i=0; i<n; i++)
    {
        maze[i] = new int[m];
        for(int j=0; j<m; j++)
        {
            char ch;
            if(0<i && i<n-1 && 0<j && j<m-1)
            {
                cin>>ch;
                if(ch=='.')
                    maze[i][j] = 0;
                else
                    maze[i][j] = 1;
            }
            else
                maze[i][j] = 1;
        }
    }
    directx[0] = 0, directx[1] = 1, directx[2] = 0, directx[3] = -1;
    directy[0] = 1, directy[1] = 0, directy[2] = -1, directy[3] = 0;
}

Maze::~Maze()
{
    for(int i=0; i<n; i++)
        delete []maze[i];
    delete []maze;
}

int Maze::FindPath()
{
    Box temp;
    queue<Box> q;
    q.push(temp);
    maze[1][1] = 1;
    while(!q.empty())
    {
        temp = q.front();
        q.pop();
        int line = temp.x;
        int col = temp.y;
        int di = temp.di;
        int step = temp.step;
        while(di<4)
        {
            int x = line+directx[di];
            int y = col+directy[di];
            if(!maze[x][y])
            {
                temp.x = x;
                temp.y = y;
                temp.di = 0;
                temp.step = step+1;
                q.push(temp);
                maze[x][y] = 1;
                if(x==n-2 && y==m-2)
                {//一旦有某一条到达了终点，则说明其是所有通路中最短的，将其step输出即可
                    cout<<"It takes "<<temp.step<<" seconds to reach the target position."<<endl;
                    return 1;
                }
            }
            di++;
        }
    }
    cout<<"God please help our poor hero."<<endl;
    return 0;
}

int main(void)
{
    int n, m;
    while(cin>>n>>m)
    {
        Maze myMaze(n, m);
        myMaze.FindPath();
    }
    return 0;
}

```

### 关键路径-STL版:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <queue>
using namespace std;
class Vertex{
public:
    int indexNo;
    bool hasEnterQueue;
    int early;
    int later;
 
    Vertex(int indexNo)
    {
        this->indexNo = indexNo;
        hasEnterQueue = false;
        early = -1;
        later = 0x7ffff;
    }
    void updateEarly(int parentEarly,int edgeValue)
    {
        int newEarly = parentEarly + edgeValue;
        if(newEarly > this->early)
            this->early = newEarly;
    }
    void updateLater(int childLater,int edgeValue)
    {
        int newLater = childLater - edgeValue;
        if(newLater < this->later)
            this->later = newLater;
    }
};
class Graph{
public:
    vector<Vertex> vertexes;
    vector<vector<int> > adjMat;
    int n;
 
    void readVertexes()
    {
        cin>>n;                   //将顶点数读入成员变量n
        int i = 0;
        for(; i < n; ++i)        //初始化vertexes数组
        {
            Vertex v(i);
            vertexes.push_back(v);
        }
        for(i = 0; i < n; i++)    //初始化adjMat数组
        {
            vector<int> row;
            int j = 0;
            for(; j < n; ++j)
            {
                row.push_back(0);
            }
            adjMat.push_back(row);
        }
    }
    void readAdjMatrix()
    {
        int edges;
        cin>>edges;
        int i = 0;
        int s,t,w;
        for(; i < edges; ++i)     //读入s,t,w，并将adjMat的第s行、第t列的值改为w.
        {
            cin>>s>>t>>w;
            adjMat[s][t] = w;
        }
    }
    void updateEarly(int parentNo,queue<int> &earlyQue)    //更新最早开始时间
    {
        int parentEarly = vertexes[parentNo].early;        //读入父结点early值
        int j = 0;
        for(; j < n; ++j)
        {
            int edgeValue = adjMat[parentNo][j];
            if(edgeValue == 0)                         //若父结点与结点j没有边相连，pass
                continue;
            Vertex &child = vertexes[j];
            child.updateEarly(parentEarly,edgeValue);    //更新子结点j的early信息
            if(!child.hasEnterQueue)
            {
                child.hasEnterQueue = true;
                earlyQue.push(j);                     //将子结点加入队列
            }
        }
    }
    void updateLater(int childNo,queue<int> &laterQue)    //更新最晚开始时间
    {
        int parentLater = vertexes[childNo].later;        //同理
        int j = 0;
        for(; j < n; ++j)
        {
            int edgeValue = adjMat[j][childNo];
            if(edgeValue == 0)
                continue;
            Vertex &parent = vertexes[j];
            parent.updateLater(parentLater,edgeValue);
            if(!parent.hasEnterQueue)
            {
                parent.hasEnterQueue = true;
                laterQue.push(j);
            }
        }
    }    
    int getRoot()                            //获取入度为0的顶点
    {
        int j = 0;
        for(; j < n; ++j)
        {
            int i=0;
            for(; i < n && adjMat[i][j] == 0; ++i);
            if(i >= n)
                return j;
        }
        return -1;
    }
    int getLeaf()                          //获取出度为0的顶点
    {
        int j = 0;
        for(; j < n; ++j)
        {
            int i = 0;
            for(; i < n && adjMat[j][i] == 0; ++i);
            if(i >= n)
                return j;
        }
        return -1;
    }
    void printEarlyLater(bool isEarly)    //输出，参数是1表示输出最早，参数是0表示输出最晚
    {
        int i = 0;
        for(; i < n; ++i)
        {
            Vertex &v = vertexes[i];
            if(isEarly)
                cout<<v.early<<' ';
            else
                cout<<v.later<<' ';
        }
        cout<<endl;
    }
    void findEarly()                //执行关键路径算法，求每个顶点的最早开始时间。
    {
        int r = getRoot();
        Vertex &root = vertexes[r];
        root.hasEnterQueue = true;
        root.early = 0;
 
        queue<int> que;
        que.push(r);
 
        while(!que.empty())
        {
            int p = que.front();
            que.pop();
 
            updateEarly(p,que);
        }
        printEarlyLater(true);
    }
    void clearEnterQueue()        //重置各顶点标志的信息
    {
        for(int i = 0; i < n; ++i)
            vertexes[i].hasEnterQueue = false;
    }
    void findLater()                //执行关键路径算法，求每个顶点的最玩开始时间。
    {
        clearEnterQueue();
        int r = getLeaf();
        Vertex &parent = vertexes[r];
        parent.hasEnterQueue = true;
        parent.later = parent.early;
 
        queue<int> que;
        que.push(r);
 
        while(!que.empty())
        {
            int p = que.front();
            que.pop();
 
            updateLater(p,que);
        }
        printEarlyLater(false);
    }
    void start()                //开始函数：依次执行初始化、求最早、求最晚
    {
        readVertexes();
        readAdjMatrix();
        findEarly();
        findLater();
    }
};
int main()
{
    int t=1;
    while(t--)
    {
        Graph g;
        g.start();
    }
    return 0;
}
```

### 冒泡排序:

```cpp
#include<iostream>
using namespace std;

class Array{
    int *array;
    int len;
public:
    Array(int n);
    ~Array();
    void BubbleSort();
};

Array::Array(int n){
    len = n;
    array = new int[n];
    for(int i=0; i<n; i++){
        cin >> array[i];
    }
}

Array::~Array(){
    delete[] array;
    len = 0;
}

void Array::BubbleSort(){
    int i, j, temp, count = 0;
    for(i=0; i<len-1; i++){
        for( j=len-1; j>i; j--){
            if( array[j]<array[j-1] ){
                temp = array[j];
                array[j] = array[j-1];
                array[j-1] = temp;
                count ++ ;
            }
        }
    }
    cout << count << endl;
}

int main(){
    int n;
    while( cin >> n){
        Array myArray(n);
        myArray.BubbleSort();
    }
    return 0;
}
```

### 前驱后继（DS线性结构）:

```cpp
#include<iostream>
using namespace std;

class ListNode{
    int data;
    ListNode *next;
    ListNode *pre;
    ListNode():next(NULL),pre(NULL){}
    ListNode(int e):data(e),next(NULL),pre(NULL){}
    friend class LinkList;
};

class LinkList{
    ListNode *head;
    ListNode *tail;
public:
    LinkList();
    void Init(int n);
    void Search(int key);
};

LinkList::LinkList() {
    head = new ListNode;
    tail = new ListNode;
    tail->pre = head;
    head->next = tail;
}

void LinkList::Init(int n) {
    int value;
    ListNode *p;
    cin >> value;
    p = new ListNode(value);
    p->next = tail;
    tail->pre = p;
    head->next = p;
    p->pre = head;
    for( int i=1; i<n; i++){
        ListNode *q;
        cin >> value;
        q = new ListNode(value);
        q->next = tail;
        q->pre = tail->pre;
        tail->pre->next = q;
        tail->pre = q;
    }
}

void LinkList::Search(int key) {
    ListNode *p;
    p = head->next;
    while(p->next && p->data!=key){
        p=p->next;
    }
    if(p){
        if( p->next==tail){
            cout << p->pre->data << endl;
        }else if(p->pre!=head && p->next!=tail){
            cout << p->pre->data << " " << p->next->data << endl;
        }else if(p->pre==head){
            cout << p->next->data << endl;
        }
    }
}

int main(){
    int n, k, key;
    cin >> n >> k;
    LinkList myList;
    myList.Init(n);
    while(k--){
        cin >> key;
        myList.Search(key);
    }
    return 0;
}
```

### 键盘坏了（DS线性结构）:

```cpp
#include<iostream>
#include<list>
using namespace std;

string str;
list<char> myList;
list<char>::iterator it;

int main(){
    while(cin >> str){
        int len = str.length();
        it = myList.begin();
        for( int i=0; i<len; i++){
            if(str[i] == '['){
                it = myList.begin();
            }else if(str[i] == ']'){
                it = myList.end();
            }else{
                myList.insert(it, str[i]);
            }
        }
        while(!myList.empty()){
            cout << myList.front();
            myList.pop_front();
        }
        cout << endl;
    }
    return 0;
}
```

### 六度空间（queue):

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 1010;
int g[N][N];
bool st[N];
int dist[N];
int n, x, y;

int bfs()
{
    queue<int> q;
    q.push(x - 1);
    int flag = -1;

    while(!q.empty())
    {
        int t = q.front();
        q.pop();
        for(int i = 0; i < n; i ++ )
        {
            if(st[i]) continue;
            if(g[t][i] == 1)
            {
//                cout << t << " " << i << endl;
                q.push(i);
                st[i] = true;
                dist[i] = dist[t] + 1;
                if(i == y - 1) flag = i;
            }
        }
    }
    return flag;
}

int main()
{
    int t;
    cin >> t;
    while(t -- )
    {
        memset(st, 0, sizeof st);
        memset(g, 0, sizeof g);
        memset(dist, 0, sizeof dist);

        cin >> n >> x >> y;
        for(int i = 0; i < n; i ++ )
            for(int j = 0; j < n; j ++ )
                cin >> g[i][j];

        int flag = bfs();
        if(flag == -1) cout << "no" << endl;
        else cout << dist[flag] - 1 << endl;
    }
    return 0;
}
```

### 线性表操作（list):

```cpp
#include<iostream>
#include<list>
using namespace std;

void Display(list<int> &li){
    cout << li.size() << " ";
    for(list<int>::iterator it = li.begin(); it != li.end(); it++){
        cout << *it << " ";
    }
    cout << endl;
}

int main(){
    int n;
    cin >> n;
    list<int> *lists = new list<int>[n];
    int num, e;
    for(int i=0; i<n; i++){
        cin >> num;
        for( int j=0; j<num; j++){
            cin >> e;
            lists[i].push_back(e);
        }
    }
    cin >> num;
    string ope;
    for(int i=0; i<num; i++){
        cin >> ope;
        if(ope == "insert"){
            int no, index, ele;
            cin >> no >> index >> ele;
            list<int> li = lists[no-1];
            if(index >= 1 && index <= li.size()+1){
                list<int>::iterator it = li.begin();
                for(int k=0; k<index-1; k++){
                    it++;
                }
                li.insert(it,ele);
            }
            lists[no-1] = li;
            Display(lists[no-1]);
        }else if(ope == "delete"){
            int no, index;
            cin >> no >> index;
            list<int> li = lists[no-1];
            if( index>=1 && index <= li.size() ){
                list<int>::iterator it = li.begin();
                for(int k=0; k<index-1; k++){
                    it++;
                }
                li.erase(it);
            }
            lists[no-1] = li;
            Display(lists[no-1]);
        }else if(ope=="merge"){
            int no1, no2;
            cin >> no1 >> no2;
            list<int> li1 = lists[no1-1];
            list<int> li2 = lists[no2-1];
            li1.sort();
            li2.sort();
            li1.merge(li2);
            lists[no1-1] = li1;
            li2.clear();
            lists[no2-1] = li2;
            Display(lists[no1-1]);
        }else if(ope=="unique"){
            int no;
            cin >> no;
            list<int> li = lists[no-1];
            li.sort();
            li.reverse();
            li.unique();
            lists[no-1] = li;
            Display(lists[no-1]);
        }else if(ope == "display"){
            int no;
            cin >> no;
            Display(lists[no-1]);
        }
    }
}
```

### 堆的后序遍历（DS排序）:

```cpp
#include <iostream>
using namespace std;

void heapSort(int i, int n, int* a) {
	int j = 2 * i;
	while (j <= n) {
		if (j < n && a[j] > a[j + 1]) {
			j++;
		}
		if (a[j] < a[i]) {
			a[0] = a[i];
			a[i] = a[j];
			a[j] = a[0];
		}
		i = j;
		j = 2 * i;
	}
}

void postOrder(int i, int n, int* a) { 
	if (i <= n) {
		postOrder(2 * i, n, a);
		postOrder(2 * i + 1, n, a);
		cout << a[i] << " ";
	}
}

int main() {
	int n;
	cin >> n;
	int* a = new int[n + 1];
	for (int i = 1; i < n + 1; i++) {
		cin >> a[i];
	}
	for (int i = n / 2; i >= 0; i--) {
		heapSort(i, n, a);
	}
	postOrder(1, n, a);
}
```

### 多项式运算（链表):

```cpp
#include <iostream>
using namespace std;
#define ok 0

class ListNode {
public:
    int data; // 系数
    int index; 	//指数
    ListNode *next;
    ListNode() {
        next = NULL;
    }
};
class LinkList {
private:
    ListNode *head; // 代码规范
    int len;
public:
    LinkList() {
        head = new ListNode;
        len = 0;
    }
    ~LinkList() {
        ListNode *p,*q;
        p=head;
        while(p != NULL) {
            q = p;
            p = p->next;
            delete q;
        }
        len = 0;
        head = NULL;
    }
    ListNode createList(int n) {
        len = n;
        ListNode* pnew = NULL;
        ListNode* tail = NULL;
        head->data = 0;
        head->next = NULL;
        tail = head;
        for ( int i = 1; i < len + 1; i++) {
            pnew = new ListNode();
            cin >> pnew->data >> pnew->index;
            pnew->next = NULL;
            tail->next = pnew;
            tail = pnew;
        }
        return *head;
    }
    void LL_display() {
        ListNode *p = head->next;
        if(head->next == NULL) {
            cout<<"0"<<endl;
            return;
        }
        while(p) {
            if(p->index == 0 ) {
                cout<<p->data;
            } else if(p->index == 1) {
                if(p->data > 1) {
                    cout<<"+"<<p->data<<"x";
                } else if(p->data < -1) {
                    cout<<p->data<<"x";
                } else if(p->data == -1){
                    cout<<"-x";
                }else{
                    cout<<"+x";
                }
            }
            if(p->index > 1) {
                if(p->data > 1) {
                    cout<<"+"<<p->data<<"x^"<<p->index;
                } else if(p->data < -1) {
                    cout<<p->data<<"x^"<<p->index;
                } else if(p->data == -1){
                    cout<<"-x^"<<p->index;
                }
                else {
                    cout<<"+x^"<<p->index;
                }
            }
            p = p->next;
        }
        cout<<endl;
        return;
    }
    LinkList *add(LinkList *b) {
        LinkList *temp = new LinkList();
        ListNode *t = (*temp).head; //(*temp)
        ListNode *p = head->next;
        ListNode *q = b->head->next;
        while(p && q) {
            ListNode *m = new ListNode;
            if(p->index == q->index) {	 //如果指数相同则相加
                m->data = p->data + q->data;
                if(m->data != 0) {
                    m->index = p->index;
                    t->next = m;
                    t = m;
                    m->next = NULL;
                    temp->len++; // 链表长度+1
                }
                p = p->next;
                q = q->next;
                continue;	//直接进入下一个循环，避免浪费时间运行下面的判断语句
            }
            if(p->index < q->index) { //谁的指数小谁在前面加入链表
                m->data = p->data;
                m->index = p->index;
                t->next = m;
                t = m;
                p = p->next;
                temp->len++;
                continue;
            }
            if(p->index > q->index) {
                m->data = q->data;
                m->index = q->index;
                t->next = m;
                t = m;
                q = q->next;
                temp->len++;
            }
        }
        while(p) {
            ListNode *m = new ListNode;
            m->data = p->data;
            m->index = p->index;
            t->next = m;
            t = m;
            p = p->next;
        }
        while(q) {
            ListNode *m = new ListNode;
            m->data = q->data;
            m->index = q->index;
            t->next = m;
            t = m;
            q = q->next;
        }
        return temp;
    }
    LinkList *sub(LinkList *b) {
        LinkList *temp = new LinkList();
        ListNode *t = (*temp).head;
        ListNode *p = head->next;
        ListNode *q = b->head->next;
        while(p && q) {
            ListNode *m = new ListNode;
            if(p->index == q->index) {
                m->data = p->data - q->data;
                if(m->data != 0) {
                    m->index = p->index;
                    t->next = m;
                    t = m;
                    temp->len++;
                }
                p = p->next;
                q = q->next;
                continue;
            }
            if(p->index < q->index) {
                m->data = p->data;
                m->index = p->index;
                t->next = m;
                t = m;
                p = p->next;
                temp->len++;
                continue;
            }
            if(p->index > q->index) {
                m->data = -q->data; // 这里减数应该为负
                m->index = q->index;
                t->next = m;
                t = m;
                q = q->next;
                temp->len++;
            }
        }
        while(p) {
            ListNode *m = new ListNode;
            m->data = p->data;
            m->index = p->index;
            t->next = m;
            t = m;
            p = p->next;
            temp->len++;
        }
        while(q) {
            ListNode *m = new ListNode;
            m->data = q->data;
            m->index = q->index;
            t->next = m;
            t = m;
            q = q->next;
            temp->len++;
        }
        return temp;
    }

    LinkList *mul(LinkList *b) {
        LinkList *temp1 = new LinkList();	//存放相乘的结果
        ListNode *p = head->next;
        while(p) {
            LinkList *temp2 = new LinkList();
            ListNode *t2 = (*temp2).head;	//让第一个多项式的第i项乘以第二个多项式的每一项,存放到temp2
            ListNode *q = (*b).head->next; //循环一次后重新把
            while(q) {
                ListNode *m = new ListNode;
                m->data = q->data * p->data;
                m->index = q->index + p->index;
                t2->next = m;
                t2 = m;
                q = q->next;
            }
            temp1 = temp1->add(temp2); //把每一个第i项相乘的答案temp2 相加到一起就是最终结果
            p = p->next;
        }
        return temp1;
    }
};
int main() {
    int data, index, n, n1 ,n2;
    cin>>n;
    while(n--) {
        LinkList *a = new LinkList();
        cin>>n1; //第一个多项式的项数
        a->createList(n1);
        LinkList *b = new LinkList();
        cin>>n2;
        b->createList(n2);
        LinkList *c;
        c = a->add(b);
        c->LL_display(); //用指针调用
        c = a->sub(b);
        c->LL_display();
        c = a->mul(b);
        c->LL_display();
    }
}

```

### 图的顶点可达闭包:

```cpp
#include<iostream>
using namespace std;

struct matrix
{
    bool x[100][100];
};

matrix Matrix_Multiply(matrix a, matrix b, int n){
    matrix c;
    for( int i=0; i<n; i++){
        for( int j=0; j<n; j++){
            for( int k=0; k<n; k++){
                c.x[i][j] += a.x[i][k]*b.x[k][j];
            }
        }
    }
    return c;
}

int main(){
    int n;
    cin >> n;
    matrix array, b, a;
    for( int i=0; i<n; i++){
        for( int j=0; j<n; j++){
            cin >> array.x[i][j];
            b.x[i][j] = array.x[i][j];
        }
    }

    for( int i=1; i<n; i++){
        a=Matrix_Multiply(b,array,n);
        for( int i=0; i<n; i++){
            for( int j=0; j<n; j++){
                b.x[i][j] += a.x[i][j];
            }
        }
    }

    for( int i=0; i<n; i++){
        for( int j=0; j<n; j++){
            cout << b.x[i][j] << " ";
        }
        cout << endl;
    }
}
```

### 二叉树后序线索（DS树）:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    char data;
    BiNode *lChild;
    BiNode *rChild;
    BiNode():lChild(NULL),rChild(NULL){}
    BiNode(char e):data(e),lChild(NULL),rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int cnt=0;
    char post_array[10000];
    void CreateTree(BiNode *&t);
    void Post(BiNode *&t);
public:
    void Post();
    void CreateTree();
    ~BiTree();
    void Search(char key);
};

void BiTree::Search(char key) {
    int i=0;
    for(i=0; i<cnt; i++){
        if(post_array[i] == key){
            break;
        }
    }
    if( i==0 ){
        cout << "-1 " << post_array[i+1] << endl;
    }else if( i==cnt-1 ){
        cout << post_array[i-1] << " -1" << endl;
    }else if( i==cnt ){
        cout << "ERROR" << endl;
    }else{
        cout << post_array[i-1] << " " << post_array[i+1] << endl;
    }
}

void BiTree::Post(BiNode *&t) {
    if(t){
        Post(t->lChild);
        Post(t->rChild);
        post_array[cnt] = t->data;
        cnt++;
    }
}

void BiTree::Post() {
    Post(root);
}

BiTree::~BiTree() {
    delete root;
}

void BiTree::CreateTree(BiNode *&t) {
    char e;
    cin >> e;
    if(e!='0'){
        t = new BiNode(e);
        CreateTree(t->lChild);
        CreateTree(t->rChild);
    }else{
        t = NULL;
    }
}

void BiTree::CreateTree() {
    CreateTree(root);
}

int main(){
    int n;
    cin >> n;
    while (n--){
        BiTree myTree;
        myTree.CreateTree();
        myTree.Post();
        char key;
        cin >> key;
        myTree.Search(key);
        cin >> key;
        myTree.Search(key);
    }
    return 0;
}
```

### 图的应用之——图的连通:

```cpp
#include<iostream>
using namespace std;

class Graph{
    int vexNum;
    int **array, **array1, **array2, **array3;
public:
    Graph();
    ~Graph();
    void Multiply();
    void Addition();
    void Final();
};

void Graph::Final() {
    bool final = 1;
    for(int i=0; i<vexNum; i++){
        for(int j=0; j<vexNum; j++){
            if(i==j){
                continue;
            }
            if(array2[i][j]==0){
                final = 0;
                break;
            }
        }
    }
    if(final==1){
        cout << "Yes" << endl;
    }else{
        cout << "No" << endl;
    }
}

void Graph::Addition() {
    for(int i=1; i<vexNum; i++){
        Multiply();
        for( int j=0; j<vexNum; j++){
            for( int k=0; k<vexNum; k++){
                array2[j][k] += array3[j][k];
            }
        }
    }
}

void Graph::Multiply() {
    for( int i=0; i<vexNum; i++){
        for( int j=0; j<vexNum; j++){
            for( int k=0; k<vexNum; k++){
                array3[i][j] += array[i][k]*array1[k][j];
            }
        }
    }
    for(int i=0; i<vexNum; i++){
        for(int j=0; j<vexNum; j++){
            array1[i][j] = array3[i][j];
        }
    }
}

Graph::~Graph() {
    for(int i=0; i<vexNum; i++){
        delete[] array[i];
        delete[] array1[i];
        delete[] array2[i];
        delete[] array3[i];
    }
    delete[] array;
    delete[] array1;
    delete[] array2;
    delete[] array3;
    vexNum = 0;
}

Graph::Graph() {
    cin >> vexNum;
    array = new int*[vexNum];
    array1 = new int*[vexNum];
    array2 = new int*[vexNum];
    array3 = new int*[vexNum];
    for(int i=0; i<vexNum; i++){
        array[i] = new int[vexNum];
        array1[i] = new int[vexNum];
        array2[i] = new int[vexNum];
        array3[i] = new int[vexNum];
        for( int j=0; j<vexNum; j++){
            cin >> array[i][j];
            array1[i][j] = array[i][j];
            array2[i][j] = array[i][j];
            array3[i][j] = 0;
        }
    }
}

int main(){
    int t;
    cin >> t;
    while( t-- ){
        Graph myGraph;
        myGraph.Addition();
        myGraph.Final();
    }
}
```

### 图综合练习–构建邻接表:

```cpp
#include<iostream>
using namespace std;

class Node{
    int pos;
    Node *next;
public:
    Node():next(NULL){}
    Node(int position):pos(position),next(NULL){}
    friend class AdjList;
};

class AdjList{
    int vexNum;
    int arcNum;
    char *vex;
    Node *heads;
    int Index(char c);
public:
    AdjList();
    ~AdjList();
    void outPut();
};

AdjList::AdjList(){
    cin >> vexNum >> arcNum;
    vex = new  char[vexNum];
    for( int i=0; i<vexNum; i++){
        cin >> vex[i];
    }
    heads = new Node[vexNum];
    for( int i=0; i<arcNum; i++){
        char c1, c2;
        cin >> c1 >> c2;
        int num1 = Index(c1), num2 = Index(c2);
        Node *p = &heads[num1];
        while(p->next){
            p=p->next;
        }
        Node *s = new Node;
        s->pos =  num2;
        p->next = s;
    }
}

AdjList::~AdjList(){
    delete []vex;
    for( int i=0; i<vexNum; i++){
        Node *p = heads[i].next;
        while(p){
            Node *q = p;
            p=p->next;
            delete q;
        }
    }
    delete []heads;
}

int AdjList::Index(char c){
    for( int i=0; i<vexNum; i++){
        if(c==vex[i]){
            return i;
        }
    }
    return -1;
}

void AdjList::outPut(){
    for( int i=0; i<vexNum; i++){
        cout << i << " " << vex[i];
        Node *p = heads[i].next;
        while(p){
            cout << "-" << p->pos;
            p=p->next;
        }
        cout << "-^" << endl;
    }
}

int main(){
    int t;
    cin >> t;
    while(t--){
        AdjList myAdjList;
        myAdjList.outPut();
    }
    return 0;
}
```

### 中后序遍历构建二叉树（DS树）:

```cpp
#include<iostream>
using namespace std;

class BiNode{
    int data;
    BiNode *lChild;
    BiNode *rChild;
    BiNode():lChild(NULL),rChild(NULL){}
    friend class BiTree;
};

class BiTree{
    BiNode *root;
    int *midOrder;
    int *postOrder;
    int len;
    void PreOrder(BiNode *&t);
public:
    int min;
    BiTree(int n, int *mid, int *post);
    BiNode *CreateTree(int left, int right, int root);
    void PreOrder();
};

BiTree::BiTree(int n, int *mid, int *post) {
    min = 65535;
    midOrder = mid;
    postOrder = post;
    len = n;
    root = CreateTree(0, len-1, len-1);
}

BiNode *BiTree::CreateTree(int left, int right, int root) {
    if(right < left){
        return NULL;
    }
    int newRoot;
    BiNode *t = new BiNode;
    for(int i=left; i<=right; i++){
        if(midOrder[i]==postOrder[root]){
            newRoot = i;
            break;
        }
    }
    t->data = postOrder[root];
    t->lChild = CreateTree(left, newRoot-1, root-1-(right-newRoot));
    t->rChild = CreateTree(newRoot+1,right, root-1);
}

void BiTree::PreOrder(BiNode *&t) {
    if(t){
        if(t->lChild == NULL && t->rChild == NULL){
            if(t->data<min){
                min = t->data;
            }
        }
        PreOrder(t->lChild);
        PreOrder(t->rChild);
    }
}

void BiTree::PreOrder() {
    PreOrder(root);
}

int main(){
    int n;
    while(cin >> n){
        int mid[10001], post[10001];
        for(int i=0; i<n; i++){
            cin >> mid[i];
        }
        for( int i=0; i<n; i++){
            cin >> post[i];
        }
        BiTree myTree(n, mid, post);
        myTree.PreOrder();
        cout << myTree.min << endl;
    }
    return 0;
}
```

### 【动态规划】套汇问题（Floyd算法）:

```cpp
#include <iostream>

using namespace std;

#define MAX_NUM 20

class AdjMatrix
{
private:
    double matrix[MAX_NUM][MAX_NUM];
    string node[MAX_NUM];
    int node_num;
    int arc_num;
    int conn_num;
    double value; ///路径汇率乘积
    int flag; ///是否能套汇
    char type;
    int Visit[MAX_NUM];
    void DFS(int v);
public:
    AdjMatrix(char ty, int n)
    {
        type = ty;
        node_num = n;
        conn_num=0;
        flag=0;
    }
    int getIndex(string s);
    void getMatrix();
    void display();
    void DFSTraverse();
};

int AdjMatrix::getIndex(string s)
{
    for(int i=0; i<node_num; i++)
    {
        if(node[i]==s)
            return i;
    }
    return -1;
}

void AdjMatrix::getMatrix()
{
    for(int i=0; i<node_num; i++)
        for(int j=0; j<node_num; j++)
            matrix[i][j] = 0;

    cin>>arc_num;
    for(int i=0; i<node_num; i++)
    {
        string s1;
        cin>>s1;
        node[i] = s1;
    }
    for(int i=0; i<arc_num; i++)
    {
        string s1, s2;
        double currency;
        int index1, index2;
        cin>>s1;
        cin>>currency;
        cin>>s2;
        index1 = getIndex(s1);
        index2 = getIndex(s2);
        if(type=='D')
        {
            matrix[index1][index2] = currency;
        }
        else if(type=='U')
        { ///这题用不到
            matrix[index1][index2]++;
            matrix[index2][index1]++;
        }
    }
}

void AdjMatrix::DFSTraverse()
{
    int v, k;
    int i;


    for(k=0; k<node_num; k++)
    {
        int counter=0;
        value=1.0;
        v=k;
        for(i=0; i<node_num; i++)
        {
            if(i==v)
                Visit[i] = 2; ///表示起始点
            else
                Visit[i] = 0;
        }

        do
        {
            //cout<<"v="<<v<<" ";
            if(Visit[v]==0 || Visit[v]==2)
            {
                counter++;
                if(counter>1) break; //表示从该点出发无法形成环，直接跳过
                DFS(v);
            }
            v = (v+1) % node_num;
        }while(v!=k);
        //cout<<endl;
        //cout<<counter<<endl;
    }

    if(flag==1)
        cout<<"YES";
    else
        cout<<"NO";
    cout<<endl;
}

void AdjMatrix::DFS(int v)
{
    int w, i, k;
    //cout<<node[v]<<"->";
    if(Visit[v]==0)
        Visit[v]=1;

    int *AdjVex = new int[node_num];
    for(i=0; i<node_num; i++)
        AdjVex[i] = -1;

    k = 0; ///寻找其相邻的点
    for(i=0; i<node_num; i++)
    {
        if(matrix[v][i]!=0) ///小心
        {
            AdjVex[k] = i;
            k++;
        }
    }

    i=0;
    for(w=AdjVex[0]; w!=-1; w=AdjVex[i])
    { ///访问其所有相邻的点
        if(Visit[w]==0)
        {
            value = value*matrix[v][w];
            DFS(w);
        }

        else if(Visit[w]==2) //如果可以回到初始点形成环
        {
            double temp_value = value; //判定边乘积是否大于1
            temp_value = temp_value*matrix[v][w];
            //cout<<temp_value<<endl;
            if(temp_value>1.0)
            {
                flag = 1;
            }
        }
        i++;
    }

    delete []AdjVex;
}

void AdjMatrix::display()
{
    int i, j;
    for(i=0; i<node_num; i++)
    { ///输出点
        cout<<node[i];
        if(i!=node_num-1)
                cout<<"\t";
    }
    cout<<endl;

    for(i=0; i<node_num; i++)
    {
        for(j=0; j<node_num; j++)
        {
            cout<<matrix[i][j];
            if(j!=node_num-1)
                cout<<"\t";
        }
        cout<<endl;
    }
    //cout<<conn_num<<endl;
}

int main()
{
    int t;
    cin>>t;
    while(t--)
    {
        //char ty;
        int n;
        cin>>n;
        AdjMatrix test('D', n);
        test.getMatrix();
        //test.display();
        test.DFSTraverse();
        //cout<<endl;
    }
    return 0;
}


```

### 有向无环图上的最长路径（DS图）:

```cpp
#include <iostream>
#include <queue>
#include <stack>
using namespace std;

class ListNode
{
    int vertex;
    double weight;
    ListNode* next;
public:
    ListNode() { next = NULL; }
    friend class Graph;
};

class Graph
{
private:
    int vexnum;
    int edgenum;
    ListNode** adjlist;
    double** matrix;
    int* S;
    int* s;
    double* dist;
    int* path;
    int IsOver();
    void DisplayPath(int i);
    void TopologicalSort();
public:
    Graph();
    ~Graph();
    void Dijkstra();
};

Graph::Graph()
{
    int i, j;
    cin >> vexnum >> edgenum;
    adjlist = new ListNode * [vexnum];
    s = new int[vexnum];
    S = new int[vexnum];
    dist = new double[vexnum];
    path = new int[vexnum];
    matrix = new double* [vexnum];
    for (i = 0; i < vexnum; i++)
    {
        s[i] = 0;
        dist[i] = 0;
        path[i] = -1;
        adjlist[i] = new ListNode;
        matrix[i] = new double[vexnum];
        for (j = 0; j < vexnum; j++)
            matrix[i][j] = 0;
    }
    for (i = 0; i < edgenum; i++)
    {
        ListNode* p;
        int startvex, endvex;
        double weight;
        cin >> startvex >> endvex >> weight;
        p = new ListNode;
        p->weight = weight;
        p->vertex = endvex;
        p->next = adjlist[startvex]->next;
        adjlist[startvex]->next = p;
        matrix[startvex][endvex] = weight;
    }
}

Graph::~Graph()
{
    delete[]adjlist;
    delete[]s;
    delete[]dist;
    delete[]path;
    for (int i = 0; i < vexnum; i++)
        delete[]matrix[i];
    delete[]matrix;
}

int Graph::IsOver()
{
    for (int i = 0; i < vexnum; i++)
    {
        if (!s[i])
            return 0;
    }
    return 1;
}

void Graph::DisplayPath(int i)
{
    stack<int> s;
    s.push(i);
    while (path[i] != -1)
    {
        i = path[i];
        s.push(i);
    }
    while (!s.empty())
    {
        i = s.top();
        s.pop();
        cout << i << ' ';
    }
    cout << endl;
}

void Graph::TopologicalSort()
{
    int num = 0;
    while (!IsOver())
    {
        int i, j;
        for (i = 0; i < vexnum; i++)
        {
            if (!s[i])
            {
                for (j = 0; j < vexnum; j++)
                {
                    if (matrix[j][i])
                        break;
                }
                if (j == vexnum)
                    break;
            }
        }
        s[i] = 1;
        S[num] = i;
        num++;
        for (j = 0; j < vexnum; j++)
            matrix[i][j] = 0;
    }
}

void Graph::Dijkstra()
{
    TopologicalSort();
    int i;
    ListNode* q;
    for (i = 0; i < vexnum; i++)
    {
        int temp = S[i];
        q = adjlist[temp];
        while (q->next)
        {
            q = q->next;
            if (dist[q->vertex] < dist[temp] + q->weight)
            {
                dist[q->vertex] = dist[temp] + q->weight;
                path[q->vertex] = temp;
            }
        }
    }
    for (i = 0; i < vexnum; i++)
    {
        if (i != S[0])
            DisplayPath(i);
    }
}

int main(void)
{
    Graph myGraph;
    myGraph.Dijkstra();
}
```
