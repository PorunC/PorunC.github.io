---
title: CS61A Lab 1
date: '2022-05-19T10:38:02.000Z'
updated: '2022-05-19T11:03:04.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/19/CS61A-Lab-1
oldUrl: /2022/05/19/CS61A-Lab-1/
excerpt: >-
  Use Ok to test your knowledge with the following “What Would Python Display?”
  questions: Hint : Make sure your while loop conditions eventually evaluate to
  a false value, or they’l...
---
# Lab 1: Variables & Functions, Control [lab01.zip](https://cs61a.org/lab/lab01/lab01.zip)

## What Would Python Display? (WWPD)

### Q1: WWPD: Control

> Use Ok to test your knowledge with the following “What Would Python Display?” questions:
>

> ```
 python3 ok -q control -u
> ```

>
> **Hint**: Make sure your `while` loop conditions eventually evaluate to a false value, or they’ll never stop! Typing `Ctrl-C` will stop infinite loops in the interpreter.

```plaintext
>>> def xk(c, d):
...     if c == 4:
...         return 6
...     elif d >= 4:
...         return 6 + 7 + c
...     else:
...         return 25
>>> xk(10, 10)

______
>>> xk(10, 6)

______
>>> xk(4, 6)

______
>>> xk(0, 0)

______
>>> def how_big(x):
...     if x > 10:
...         print('huge')
...     elif x > 5:
...         return 'big'
...     elif x > 0:
...         print('small')
...     else:
...         print("nothing")
>>> how_big(7)

______
>>> how_big(12)

______
>>> how_big(1)

______
>>> how_big(-1)

______
>>> n = 3
>>> while n >= 0:
...     n -= 1
...     print(n)

______
```

> *Hint*: Make sure your `while` loop conditions eventually evaluate to a false value, or they’ll never stop! Typing `Ctrl-C` will stop infinite loops in the interpreter.

```plaintext
>>> positive = 28
>>> while positive:
...    print("positive?")
...    positive -= 3

______
>>> positive = -9
>>> negative = -12
>>> while negative:
...    if positive:
...        print(negative)
...    positive += 3
...    negative += 3

______
```

### Q2: WWPD: Veritasiness

> Use Ok to test your knowledge with the following “What Would Python Display?” questions:
>

> ```
 python3 ok -q short-circuit -u✂️
> ```


```plaintext
>>> True and 13

______
>>> False or 0

______
>>> not 10

______
>>> not None

______
>>> True and 1 / 0 and False

______
>>> True or 1 / 0 or False

______
>>> True and 0

______
>>> False or 1

______
>>> 1 and 3 and 6 and 10 and 15

______
>>> -1 and 1 > 0

______
>>> 0 or False or 2 or 1 / 0

______
>>> not 0

______
>>> (1 + 1) and 1

______
>>> 1/0 or True

______
>>> (True or False) and False

______
```

### Q3: Debugging Quiz

The following is a quick quiz on different debugging techniques that will be helpful for you to use in this class. You can refer to the [debugging article](https://cs61a.org/articles/debugging/) to answer the questions.

Use Ok to test your understanding:

```plaintext
python3 ok -q debugging-quiz -u✂️
```

## Parsons Problems

To work on these problems, open the Parsons editor:

```plaintext
python3 parsons
```

### Q4: Add in Range

Complete `add_in_range`, which returns the sum of all integers between `start` and `stop` (inclusive).

```python
def add_in_range(start, stop):
    """
    >>> add_in_range(3, 5)  # .Case 1
    12
    >>> add_in_range(1, 10)  # .Case 2
    55
    """
    "*** YOUR CODE HERE ***"
    total = 0
    while start <= stop:
        total += start
        start += 1
    return total
```

### Q5: Digit Position Match

A number has a digit-position match if the `i`th-to-last digit is `i`. For example, `980` has the `0`th-to-last digit as `0`. Or `98276` has the `2`nd-to-last digit as a `2`.

Write a function that determine if a number `n` has a digit-position match at a `k`th-to-last digit `k`.

```python
def digit_pos_match(n, k):
    """
    >>> digit_pos_match(980, 0) # .Case 1
    True
    >>> digit_pos_match(980, 2) # .Case 2
    False
    >>> digit_pos_match(98276, 2) # .Case 3
    True
    >>> digit_pos_match(98276, 3) # .Case 4
    False
    """
    "*** YOUR CODE HERE ***"
    index = 0
    while index < k:
        index = index + 1
        n = n // 105
    return n % 10 == k
```

## Code Writing Questions

### Q6: Falling Factorial

Let’s write a function `falling`, which is a “falling” factorial that takes two arguments, `n` and `k`, and returns the product of `k` consecutive numbers, starting from `n` and working downwards. When `k` is 0, the function should return 1.

```python
def falling(n, k):
    """Compute the falling factorial of n to depth k.

    >>> falling(6, 3)  # 6 * 5 * 4
    120
    >>> falling(4, 3)  # 4 * 3 * 2
    24
    >>> falling(4, 1)  # 4
    4
    >>> falling(4, 0)
    1
    """
    "*** YOUR CODE HERE ***"
    res = 1
    while k:
        res = res * n
        n = n - 1
        k = k - 1
    return res
```

Use Ok to test your code:

```plaintext
python3 ok -q falling✂️
```

### Q7: Sum Digits

Write a function that takes in a nonnegative integer and sums its digits. (Using floor division and modulo might be helpful here!)

```python
def sum_digits(y):
    """Sum all the digits of y.

    >>> sum_digits(10) # 1 + 0 = 1
    1
    >>> sum_digits(4224) # 4 + 2 + 2 + 4 = 12
    12
    >>> sum_digits(1234567890)
    45
    >>> a = sum_digits(123) # make sure that you are using return rather than print
    >>> a
    6
    """
    "*** YOUR CODE HERE ***"
    res = 0
    while y:
        tmp = y % 10
        y = y // 10
        res = res + tmp
    return res
```

Use Ok to test your code:

```plaintext
python3 ok -q sum_digits✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```

# Extra Practice

> These questions are optional and will not affect your score on this assignment. However, they are **great practice** for future assignments, projects, and exams. Attempting these questions can be valuable in helping cement your knowledge of course concepts.

### Q8: WWPD: What If?

> Use Ok to test your knowledge with the following “What Would Python Display?” questions:
>

> ```
 python3 ok -q if-statements -u✂️
> ```

>
> **Hint**: `print` (unlike `return`) does *not* cause the function to exit.

```plaintext
>>> def ab(c, d):
...     if c > 5:
...         print(c)
...     elif c > 7:
...         print(d)
...     print('foo')
>>> ab(10, 20)

______
>>> def bake(cake, make):
...     if cake == 0:
...         cake = cake + 1
...         print(cake)
...     if cake == 1:
...         print(make)
...     else:
...         return cake
...     return make
>>> bake(0, 29)

______
>>> bake(1, "mashed potatoes")

______
```

### Q9: K-Occurrence

Complete `k_occurrence`, a function which returns the number of times the digit `k` appears in `num`. 0 is considered to have no digits.

```python
def k_occurrence(k, num):
    """
    >>> k_occurrence(5, 10)  # .Case 1
    0
    >>> k_occurrence(5, 5115)  # .Case 2
    2
    >>> k_occurrence(0, 100)  # .Case 3
    2
    >>> k_occurrence(0, 0)  # .Case 4
    0
    """
    "*** YOUR CODE HERE ***"
    occurrences = 0
    while num:
        if num % 10 == k:
            occurrences += 1
        num = num // 10
    return occurrences
```

To work on this problem, open the Parsons editor:

```plaintext
python3 parsons
```

### Q10: Double Eights

Write a function that takes in a number and determines if the digits contain two adjacent 8s.

```python
def double_eights(n):
    """Return true if n has two eights in a row.
    >>> double_eights(8)
    False
    >>> double_eights(88)
    True
    >>> double_eights(2882)
    True
    >>> double_eights(880088)
    True
    >>> double_eights(12345)
    False
    >>> double_eights(80808080)
    False
    """
    "*** YOUR CODE HERE ***"
    cnt = 0
    while n:
        if n % 100 == 88:
            n = n // 100
            cnt = cnt + 2
        else:
            n = n // 10
    if cnt % 2 == 0 and cnt != 0:
        return True
    else: 
        return False

```

Use Ok to test your code:

```plaintext
python3 ok -q double_eights
```
