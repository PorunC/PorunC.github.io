---
title: CS61A Homework 3
date: '2022-05-19T09:06:41.000Z'
updated: '2022-05-19T10:06:51.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/19/CS61A-Homework-3
oldUrl: /2022/05/19/CS61A-Homework-3/
excerpt: >-
  Implement the function neighbor digits. neighbor digits takes in an integer
  num and an optional argument prev digit. neighbor digits outputs the number of
  digits in num that have t...
---
# Homework 3: Recursion, Tree Recursion [hw03.zip](https://cs61a.org/hw/hw03/hw03.zip)

## Parsons Problems

### Q1: Neighbor Digits

#### Problem Statement

Implement the function `neighbor_digits`. `neighbor_digits` takes in an integer `num` and an optional argument `prev_digit`. `neighbor_digits` outputs the number of digits in `num` that have the same digit to its right or left.

```bash
>>> neighbor_digits(111)
3
>>> neighbor_digits(123)
0
>>> neighbor_digits(112)
2
>>> neighbor_digits(1122)
4
```

#### Solution

```python
def neighbor_digits(num, prev_digit=-1):
    if num < 10:2
        return num == prev_digit3
    rest = num // 10
    last = num % 10
return int(prev_digit == last or rest % 10 == last) + neighbor_digits(rest, last)
```

### Q2: Has Subsequence

#### Problem Statement

Implement the function `has_subseq`, which takes in a number `n` and a “sequence” of digits `seq`. The function returns whether `n` contains `seq` as a subsequence, which does not have to be consecutive.

```bash
>>> has_subseq(123, 12)
True
>>> has_subseq(141, 11)
True
>>> has_subseq(144, 12)
False
>>> has_subseq(144, 1441)
False
>>> has_subseq(1343412, 134)
True
```

#### Solution

```python
def has_subseq(n, seq):
	if seq == 0:
        return True
    if n == 0:
        return False
    if seq % 10 == n % 10:
        return has_subseq(n // 10, seq // 10)
    return has_subseq(n // 10, seq)
```

## Code Writing Questions

### Q3: Num eights

Write a recursive function `num_eights` that takes a positive integer `pos` and returns the number of times the digit 8 appears in `pos`.

**Important:** Use recursion; the tests will fail if you use any assignment statements. (You can however use function definitions if you so wish.)

```python
def num_eights(pos):
    """Returns the number of times 8 appears as a digit of pos.

    >>> num_eights(3)
    0
    >>> num_eights(8)
    1
    >>> num_eights(88888888)
    8
    >>> num_eights(2638)
    1
    >>> num_eights(86380)
    2
    >>> num_eights(12345)
    0
    >>> from construct_check import check
    >>> # ban all assignment statements
    >>> check(HW_SOURCE_FILE, 'num_eights',
    ...       ['Assign', 'AnnAssign', 'AugAssign', 'NamedExpr'])
    True
    """
    "*** YOUR CODE HERE ***"

    if pos < 10:
        return int(pos == 8)
    return num_eights(pos // 10) + int(pos % 10 == 8)
```

### Q4: Ping-pong

The ping-pong sequence counts up starting from 1 and is always either counting up or counting down. At element `k`, the direction switches if `k` is a multiple of 8 or contains the digit 8. The first 30 elements of the ping-pong sequence are listed below, with direction swaps marked using brackets at the 8th, 16th, 18th, 24th, and 28th elements:

| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | [8] | 9 | 10 | 11 | 12 | 13 | 14 | 15 | [16] | 17 | [18] | 19 | 20 | 21 | 22 | 23 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PingPong Value | 1 | 2 | 3 | 4 | 5 | 6 | 7 | [8] | 7 | 6 | 5 | 4 | 3 | 2 | 1 | [0] | 1 | [2] | 1 | 0 | -1 | -2 | -3 |

| Index (cont.) | [24] | 25 | 26 | 27 | [28] | 29 | 30 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PingPong Value | [-4] | -3 | -2 | -1 | [0] | -1 | -2 |

Implement a function `pingpong` that returns the nth element of the ping-pong sequence *without using any assignment statements*. (You are allowed to use function definitions.)

You may use the function `num_eights`, which you defined in the previous question.

**Important:** Use recursion; the tests will fail if you use any assignment statements. (You can however use function definitions if you so wish.)

> **Hint:** If you’re stuck, first try implementing `pingpong` using assignment statements and a `while` statement. Then, to convert this into a recursive solution, write a helper function that has a parameter for each variable that changes values in the body of the while loop.
>
> **Hint:** There are a few pieces of information that we need to keep track of. One of these details is the direction that we’re going (either increasing or decreasing). Building off of the hint above, think about how we can keep track of the direction throughout the calls to the helper function.

```python
def pingpong(n):
    """Return the nth element of the ping-pong sequence.

    >>> pingpong(8)
    8
    >>> pingpong(10)
    6
    >>> pingpong(15)
    1
    >>> pingpong(21)
    -1
    >>> pingpong(22)
    -2
    >>> pingpong(30)
    -2
    >>> pingpong(68)
    0
    >>> pingpong(69)
    -1
    >>> pingpong(80)
    0
    >>> pingpong(81)
    1
    >>> pingpong(82)
    0
    >>> pingpong(100)
    -6
    >>> from construct_check import check
    >>> # ban assignment statements
    >>> check(HW_SOURCE_FILE, 'pingpong',
    ...       ['Assign', 'AnnAssign', 'AugAssign', 'NamedExpr'])
    True
    """
    "*** YOUR CODE HERE ***"
    def helper(res, cur, step):
        if cur == n:
            return res
        if cur % 8 == 0 or num_eights(cur) > 0:
            return helper(res - step, cur + 1, -step)
        else:
            return helper(res + step, cur + 1, step)
    return helper(1, 1, 1)
```

### Q5: Count coins

Given a positive integer `change`, a set of coins makes change for `change` if the sum of the values of the coins is `change`. Here we will use standard US Coin values: 1, 5, 10, 25. For example, the following sets make change for `15`:

- 15 1-cent coins
- 10 1-cent, 1 5-cent coins
- 5 1-cent, 2 5-cent coins
- 5 1-cent, 1 10-cent coins
- 3 5-cent coins
- 1 5-cent, 1 10-cent coin

Thus, there are 6 ways to make change for `15`. Write a **recursive** function `count_coins` that takes a positive integer `change` and returns the number of ways to make change for `change` using coins.

You can use either of the functions given to you:

- `get_larger_coin` will return the next larger coin denomination from the input, i.e. `get_larger_coin(5)` is `10`.
- `get_smaller_coin` will return the next smaller coin denomination from the input, i.e. `get_smaller_coin(5)` is `1`.

There are two main ways in which you can approach this problem. One way uses `get_larger_coin`, and another uses `get_smaller_coin`.

**Important:** Use recursion; the tests will fail if you use loops.

> **Hint:** Refer the [implementation](http://composingprograms.com/pages/17-recursive-functions.html#example-partitions) of `count_partitions` for an example of how to count the ways to sum up to a final value with smaller parts. If you need to keep track of more than one value across recursive calls, consider writing a helper function.

```python
def get_larger_coin(coin):
    """Returns the next larger coin in order.
    >>> get_larger_coin(1)
    5
    >>> get_larger_coin(5)
    10
    >>> get_larger_coin(10)
    25
    >>> get_larger_coin(2) # Other values return None
    """
    if coin == 1:
        return 5
    elif coin == 5:
        return 10
    elif coin == 10:
        return 25

def get_smaller_coin(coin):
    """Returns the next smaller coin in order.
    >>> get_smaller_coin(25)
    10
    >>> get_smaller_coin(10)
    5
    >>> get_smaller_coin(5)
    1
    >>> get_smaller_coin(2) # Other values return None
    """
    if coin == 25:
        return 10
    elif coin == 10:
        return 5
    elif coin == 5:
        return 1

def count_coins(change):
    """Return the number of ways to make change using coins of value of 1, 5, 10, 25.
    >>> count_coins(15)
    6
    >>> count_coins(10)
    4
    >>> count_coins(20)
    9
    >>> count_coins(100) # How many ways to make change for a dollar?
    242
    >>> count_coins(200)
    1463
    >>> from construct_check import check
    >>> # ban iteration
    >>> check(HW_SOURCE_FILE, 'count_coins', ['While', 'For'])
    True
    """
    "*** YOUR CODE HERE ***"
    def dfs(change, currrent_coin):
        if change == 0:
            return 1
        elif change < 0 or currrent_coin == None:
            return 0
        
        with_cur = dfs(change - currrent_coin, currrent_coin)
        without_cur = dfs(change, get_larger_coin(currrent_coin))
        return with_cur + without_cur
    return dfs(change, 1)
```

## Optional Questions

Homework assignments will also contain prior exam-level questions for you to take a look at. These questions have no submission component; feel free to attempt them if you’d like a challenge!

1. Fall 2017 MT1 Q4a: [Digital](https://inst.eecs.berkeley.edu/~cs61a/fa21/exam/fa17/mt1/61a-fa17-mt1.pdf#page=5)
2. Summer 2018 MT1 Q5a: [Won’t You Be My Neighbor?](https://inst.eecs.berkeley.edu/~cs61a/su18/assets/pdfs/61a-su18-mt.pdf#page=5)
3. Fall 2019 Final Q6b: [Palindromes](https://inst.eecs.berkeley.edu/~cs61a/sp21/exam/fa19/final/61a-fa19-final.pdf#page=6)
