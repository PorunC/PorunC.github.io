---
title: CS61A Lab 7
date: '2022-05-23T08:53:19.000Z'
updated: '2022-07-20T09:14:00.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/23/CS61A-Lab-7
oldUrl: /2022/05/23/CS61A-Lab-7/
excerpt: >-
  Read over the Link class in lab07.py. Make sure you understand the doctests.
  Use Ok to test your knowledge with the following “What Would Python Display?”
  questions: Enter Function...
---
# Lab 7: Linked Lists, Trees / Tree Mutation [lab07.zip](https://cs61a.org/lab/lab07/lab07.zip)

## What Would Python Display?

### Q1: WWPD: Linked Lists

Read over the `Link` class in `lab07.py`. Make sure you understand the doctests.

> Use Ok to test your knowledge with the following “What Would Python Display?” questions:
>

> ```
 python3 ok -q link -u
> ```

>
> Enter `Function` if you believe the answer is `<function ...>`, `Error` if it errors, and `Nothing` if nothing is displayed.
>
> If you get stuck, try drawing out the box-and-pointer diagram for the linked list on a piece of paper or loading the `Link` class into the interpreter with `python3 -i lab07.py`.

```plaintext
>>> from lab07 import *
>>> link = Link(1000)
>>> link.first

______
>>> link.rest is Link.empty

______
>>> link = Link(1000, 2000)

______
>>> link = Link(1000, Link())

______
>>> from lab07 import *
>>> link = Link(1, Link(2, Link(3)))
>>> link.first

______
>>> link.rest.first

______
>>> link.rest.rest.rest is Link.empty

______
>>> link.first = 9001
>>> link.first

______
>>> link.rest = link.rest.rest
>>> link.rest.first

______
>>> link = Link(1)
>>> link.rest = link
>>> link.rest.rest.rest.rest.first

______
>>> link = Link(2, Link(3, Link(4)))
>>> link2 = Link(1, link)
>>> link2.first

______
>>> link2.rest.first

______
>>> from lab07 import *
>>> link = Link(5, Link(6, Link(7)))
>>> link                  # Look at the __repr__ method of Link

______
>>> print(link)          # Look at the __str__ method of Link

______
```

```plaintext

>>> from lab07 import *
>>> link = Link(1000)
>>> link.first
? 1000
-- OK! --

>>> link.rest is Link.empty
? true
-- Not quite. Try again! --

? Treu
-- Not quite. Try again! --

? True
-- OK! --

>>> link = Link(1000, 2000)
? Error
-- OK! --

>>> link = Link(1000, Link())
? Error
-- OK! --

---------------------------------------------------------------------
Link > Suite 1 > Case 2
(cases remaining: 2)

What would Python display? If you get stuck, try it out in the Python
interpreter!

>>> from lab07 import *
>>> link = Link(1, Link(2, Link(3)))
>>> link.first
? 1
-- OK! --

>>> link.rest.first
? 2
-- OK! --

>>> link.rest.rest.rest is Link.empty
? True
-- OK! --

>>> link.first = 9001
>>> link.first
? 9001
-- OK! --

>>> link.rest = link.rest.rest
>>> link.rest.first
? 3
-- OK! --

>>> link = Link(1)
>>> link.rest = link
>>> link.rest.rest.rest.rest.first
? 1
-- OK! --

>>> link = Link(2, Link(3, Link(4)))
>>> link2 = Link(1, link)
>>> link2.first
? 1
-- OK! --

>>> link2.rest.first
? 2
-- OK! --

---------------------------------------------------------------------
Link > Suite 1 > Case 3
(cases remaining: 1)

What would Python display? If you get stuck, try it out in the Python
interpreter!

>>> from lab07 import *
>>> link = Link(5, Link(6, Link(7)))
>>> link                  # Look at the __repr__ method of Link
? Link(5, Link(6, Link(7)))
-- OK! --

>>> print(link)          # Look at the __str__ method of Link
? <5 6 7>
-- OK! --

---------------------------------------------------------------------
OK! All cases for Link unlocked.
```

## Parsons Problems

To work on these problems, open the Parsons editor:

```plaintext
python3 parsons
```

### Q2: Reverse Link

Write a function that takes in a linked list and returns a reversed version of that linked list (with elements in the opposite order). It should *not* mutate the original list.

```plaintext
>>> s = Link(1, Link(2, Link(3, Link.empty)))
>>> reverse_link(s)
Link(3, Link(2, Link(1)))
>>> s
Link(1, Link(2, Link(3)))
>>> k = Link(3, Link(5, Link(7, Link(9))))
>>> reverse_link(k)
Link(9, Link(7, Link(5, Link(3))))
>>> k
Link(3, Link(5, Link(7, Link(9))))
```

> **Hint**: you should iterate over the linked list. If you’re having trouble starting, attempt to replicate the following diagram.

![Reverse Link Diagram](https://cs61a.org/lab/lab07/assets/reverse_link_diagram.png)

```python
def reverse_link(lnk):
    """
    Given a linked list lnk, return a new linked list which has all the
    elements of lnk but in reverse order.

    >>> s = Link(1, Link(2, Link(3, Link.empty)))
    >>> reverse_link(s)
    Link(3, Link(2, Link(1)))
    >>> s
    Link(1, Link(2, Link(3)))
    >>> k = Link(3, Link(5, Link(7, Link(9))))
    >>> reverse_link(k)
    Link(9, Link(7, Link(5, Link(3))))
    >>> k
    Link(3, Link(5, Link(7, Link(9))))
    """
    "*** YOUR CODE HERE ***"
    result = Link.empty
    while lnk:
        result = Link(lnk.first, result)
        lnk = lnk.rest
    return result
```

### Q3: Label Multiplier

Write a function `label_multiplier` that takes in a `Tree` and an integer `val`. `label_multiplier` should mutate the tree’s labels by multiplying their original value by `val`.

```python
>>> t1 = Tree(2, [Tree(4, [Tree(6)]), Tree(8)])
>>> label_multiplier(t1, 10)
>>> t1
Tree(20, [Tree(40, [Tree(60)]), Tree(80)])
>>> t2 = Tree(10, [Tree(9), Tree(8, [Tree(7), Tree(6)]), Tree(5, [Tree(4), Tree(3), Tree(2)])])
>>> label_multiplier(t2, 3)
>>> t2
Tree(30, [Tree(27), Tree(24, [Tree(21), Tree(18)]), Tree(15, [Tree(12), Tree(9), Tree(6)])])
def label_multiplier(t, val):
    """
    Given a tree t, mutate t so that all of the tree's
    labels are multiplied by the argument val.

    >>> t1 = Tree(2, [Tree(4, [Tree(6)]), Tree(8)])
    >>> label_multiplier(t1, 10)
    >>> t1
    Tree(20, [Tree(40, [Tree(60)]), Tree(80)])
    >>> t2 = Tree(10, [Tree(9), Tree(8, [Tree(7), Tree(6)]), Tree(5, [Tree(4), Tree(3), Tree(2)])])
    >>> label_multiplier(t2, 3)
    >>> t2
    Tree(30, [Tree(27), Tree(24, [Tree(21), Tree(18)]), Tree(15, [Tree(12), Tree(9), Tree(6)])])
    """
    "*** YOUR CODE HERE ***"
    t.label = t.label * val
    for b in t.branches:
        label_multiplier(b, val)
```

## Coding Practice

### Q4: Store Digits

Write a function `store_digits` that takes in an integer `n` and returns a linked list where each element of the list is a digit of `n`.

> **Important**: Do not use any string manipulation functions like `str` and `reversed`.

```python
def store_digits(n):
    """Stores the digits of a positive number n in a linked list.

    >>> s = store_digits(1)
    >>> s
    Link(1)
    >>> store_digits(2345)
    Link(2, Link(3, Link(4, Link(5))))
    >>> store_digits(876)
    Link(8, Link(7, Link(6)))
    >>> # a check for restricted functions
    >>> import inspect, re
    >>> cleaned = re.sub(r"#.*\\n", '', re.sub(r'"{3}[\s\S]*?"{3}', '', inspect.getsource(store_digits)))
    >>> print("Do not use str or reversed!") if any([r in cleaned for r in ["str", "reversed"]]) else None
    >>> link1 = Link(3, Link(Link(4), Link(5, Link(6))))
    """
    "*** YOUR CODE HERE ***"
    lnk = Link.empty
    while n:
        lnk = Link(n % 10, lnk)
        n = n // 10
    return lnk
```

Use Ok to test your code:

```plaintext
python3 ok -q store_digits✂️
```

### Q5: Cumulative Mul

Write a function `cumulative_mul` that mutates the Tree `t` so that each node’s label becomes the product of its label and all labels in the subtrees rooted at the node.

> **Hint**: Consider carefully when to do the mutation of the tree and whether that mutation should happen before or after processing the subtrees.

```python
def cumulative_mul(t):
    """Mutates t so that each node's label becomes the product of all labels in
    the corresponding subtree rooted at t.

    >>> t = Tree(1, [Tree(3, [Tree(5)]), Tree(7)])
    >>> cumulative_mul(t)
    >>> t
    Tree(105, [Tree(15, [Tree(5)]), Tree(7)])
    >>> otherTree = Tree(2, [Tree(1, [Tree(3), Tree(4), Tree(5)]), Tree(6, [Tree(7)])])
    >>> cumulative_mul(otherTree)
    >>> otherTree
    Tree(5040, [Tree(60, [Tree(3), Tree(4), Tree(5)]), Tree(42, [Tree(7)])])
    """
    "*** YOUR CODE HERE ***"
    if t.is_leaf():
        return
    
    for b in t.branches:
        cumulative_mul(b)
        if isinstance(b, Tree):
            t.label *= b.label
```

Use Ok to test your code:

```plaintext
python3 ok -q cumulative_mul✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```

# Optional Questions

### Q6: Cycles

The `Link` class can represent lists with cycles. That is, a list may contain itself as a sublist.

```plaintext
>>> s = Link(1, Link(2, Link(3)))
>>> s.rest.rest.rest = s
>>> s.rest.rest.rest.rest.rest.first
3
```

Implement `has_cycle`,that returns whether its argument, a `Link` instance, contains a cycle.

> *Hint*: Iterate through the linked list and try keeping track of which `Link` objects you’ve already seen.

```python
def has_cycle(link):
    """Return whether link contains a cycle.

    >>> s = Link(1, Link(2, Link(3)))
    >>> s.rest.rest.rest = s
    >>> has_cycle(s)
    True
    >>> t = Link(1, Link(2, Link(3)))
    >>> has_cycle(t)
    False
    >>> u = Link(2, Link(2, Link(2)))
    >>> has_cycle(u)
    False
    """
    "*** YOUR CODE HERE ***"
    links = []
    while link is not Link.empty:
        if link in links:
            return True
        links.append(link)
        link = link.rest
    return False
```

Use Ok to test your code:

```plaintext
python3 ok -q has_cycle✂️
```

**Extra challenge (Optional)**: Implement `has_cycle` without keeping track of all `Link` objects you’ve already seen. The solution is short (less than 20 lines of code), but requires a clever idea. Try to discover the solution yourself before asking around.

```python
def has_cycle_constant(link):
    """Return whether link contains a cycle.

    >>> s = Link(1, Link(2, Link(3)))
    >>> s.rest.rest.rest = s
    >>> has_cycle_constant(s)
    True
    >>> t = Link(1, Link(2, Link(3)))
    >>> has_cycle_constant(t)
    False
    """
    "*** YOUR CODE HERE ***"
    slow = link
    fast = link
    while fast is not Link.empty:
        if fast.rest is Link.empty:
            return False
        slow = slow.rest
        fast = fast.rest.rest
        if slow is fast:
            return True
    return False
```

Use Ok to test your code:

```plaintext
python3 ok -q has_cycle_constant
```
