---
title: CS61A Homework 5
date: '2022-05-23T02:15:08.000Z'
updated: '2022-05-23T05:30:22.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/23/CS61A-Homework-5
oldUrl: /2022/05/23/CS61A-Homework-5/
excerpt: >-
  As part of this week’s homework, please fill out the Mid Semester Feedback
  form. This survey is designed to help us make short term adjustments to the
  course so that it works bette...
---
# Homework 5: Trees, Linked Lists [hw05.zip](https://cs61a.org/hw/hw05/hw05.zip)

## Mid-Semester Feedback

### Q1: Mid-Semester Feedback

As part of this week’s homework, please fill out the [Mid-Semester Feedback](https://go.cs61a.org/midsem-survey) form.

This survey is designed to help us make short term adjustments to the course so that it works better for you. We appreciate your feedback. We may not be able to make every change that you request, but we will read all the feedback and consider it.

> **Confidentiality**: Your responses to the survey are confidential, and only the instructor (Pamela) and head TA (Vanshaj) will be able to see this data unanonymized. More specifics on confidentiality can be found on the survey itself.

Once you finish the survey, you will be presented with a passphrase (if you miss it, it should also be at the bottom of the confirmation email you receive). Put this passphrase, as a string, on the line that says `passphrase = '*** PASSPHRASE HERE ***'` in the Python file for this assignment.

Use Ok to test your code:

```plaintext
python3 ok -q midsem_survey✂️
```

## Parsons Problems

### Q2: Chain

For this question, we will define a chain as a path from the root of a tree `t` to any leaf such that all nodes on the path share the same `label`. Implement the function `chain`, which, given a tree `t`, returns `True` if there exists any `chain` in the tree, and `False` otherwise.

```python
def chain(t):
    """
    Returns whether there exists a path in t where all nodes
    share the same label.
    >>> all_fives = Tree(5, [Tree(5), Tree(5, [Tree(5)])])
    >>> chain(all_fives)
    True
    >>> t1 = Tree(1, [Tree(3, [Tree(4)]), Tree(1)])
    >>> chain(t1)
    True
    >>> t2 = Tree(1, [Tree(3, [Tree(4)]), Tree(5)])
    >>> chain(t2)
    False
    """
    "*** YOUR CODE HERE ***"
    if t.is_leaf():
        return True
    for b in t.branches:
        if t.label == b.label and chain(b):
            return True
    return False
```

### Q3: Flatten Link

Write a function `flatten_link` that takes in a linked list `lnk` and returns the sequence as a Python list. If `lnk` has nested linked lists, `flatten_link` should flatten `lnk`.

```python
def flatten_link(lnk):
    """Takes a linked list and returns a flattened Python list with the same elements.

    >>> link = Link(1, Link(2, Link(3, Link(4))))
    >>> flatten_link(link)
    [1, 2, 3, 4]
    >>> flatten_link(Link.empty)
    []
    >>> deep_link = Link(Link(1, Link(2, Link(3, Link(4)))), Link(Link(5), Link(6)))
    >>> flatten_link(deep_link)
    [1, 2, 3, 4, 5, 6]
    """
    "*** YOUR CODE HERE ***"
    if lnk is Link.empty:
        return []
    if isinstance(lnk.first, Link):
        return flatten_link(lnk.first) + flatten_link(lnk.rest)
    return [lnk.first] + flatten_link(lnk.rest)
```

## Code Writing Questions

### Q4: Has Path

Write a function `has_path` that takes in a Tree `t` and a string `term`. It returns `True` if there is a path that starts from the root where the entries along the path spell out the `term`, and `False` otherwise. You may assume that every node’s `label` is exactly one character.

> This data structure is called a trie, and it has a lot of cool applications, such as autocomplete.

```python
def has_path(t, term):
    """Return whether there is a path in a Tree where the entries along the path
    spell out a particular term.

    >>> greetings = Tree('h', [Tree('i'),
    ...                        Tree('e', [Tree('l', [Tree('l', [Tree('o')])]),
    ...                                   Tree('y')])])
    >>> print(greetings)
    h
      i
      e
        l
          l
            o
        y
    >>> has_path(greetings, 'h')
    True
    >>> has_path(greetings, 'i')
    False
    >>> has_path(greetings, 'hi')
    True
    >>> has_path(greetings, 'hello')
    True
    >>> has_path(greetings, 'hey')
    True
    >>> has_path(greetings, 'bye')
    False
    >>> has_path(greetings, 'hint')
    False
    """
    assert len(term) > 0, 'no path for empty term.'
    "*** YOUR CODE HERE ***"
    if len(term) == 1:
        return str(t.label) == term[0]
    
    flag = False
    if str(t.label) == term[0]:
        for b in t.branches:
            if str(b.label) == term[1]:
                flag = has_path(b, term[1:])

    return flag
```

Use Ok to test your code:

```plaintext
python3 ok -q has_path✂️
```

### Q5: Duplicate Link

Write a function `duplicate_link` that takes in a linked list `lnk` and a `value`. `duplicate_link` will mutate `lnk` such that if there is a linked list node that has a `first` equal to `value`, that node will be duplicated. **Note that** you should be mutating the original link list `lnk`; you will need to create new `Link`s, but you should not be returning a new linked list.

> **Note**: in order to insert a link into a linked list, you need to modify the `.rest` of certain links. We encourage you to draw out a doctest to visualize!

```python
def duplicate_link(lnk, val):
    """Mutates `lnk` such that if there is a linked list
    node that has a first equal to value, that node will
    be duplicated. Note that you should be mutating the
    original link list.

    >>> x = Link(5, Link(4, Link(3)))
    >>> duplicate_link(x, 5)
    >>> x
    Link(5, Link(5, Link(4, Link(3))))
    >>> y = Link(2, Link(4, Link(6, Link(8))))
    >>> duplicate_link(y, 10)
    >>> y
    Link(2, Link(4, Link(6, Link(8))))
    """
    "*** YOUR CODE HERE ***"
    def duplicate(lnk, val):
        new_lnk = Link(val, lnk)
        return new_lnk
    
    
    if int(lnk.first) == val:
        new_lnk = duplicate(lnk.rest, val)
        lnk.rest = new_lnk
```

Use Ok to test your code:

```plaintext
python3 ok -q duplicate_link✂️
```

### Q6: Mutable Mapping

Implement `deep_map_mut(fn, link)`, which applies a function `fn` onto all elements in the given linked list `lnk`. If an element is itself a linked list, apply `fn` to each of its elements, and so on.

Your implementation should mutate the original linked list. Do not create any new linked lists.

> **Hint**: The built-in `isinstance` function may be useful.
>
> |  |  |
> | --- | --- |
> | ``` 1 2 3 4 5 ``` | ``` >>> s = Link(1, Link(2, Link(3, Link(4)))) >>> isinstance(s, Link) True >>> isinstance(s, int) False ``` |

> **Construct Check**: The last doctest of this question ensures that you do not create new linked lists. If you are failing this doctest, ensure that you are not creating link lists by calling the constructor, i.e.
>
> |  |  |
> | --- | --- |
> | ``` 1 ``` | ``` s = Link(1) ``` |

```python
def deep_map_mut(fn, lnk):
    """Mutates a deep link lnk by replacing each item found with the
    result of calling fn on the item.  Does NOT create new Links (so
    no use of Link's constructor).

    Does not return the modified Link object.

    >>> link1 = Link(3, Link(Link(4), Link(5, Link(6))))
    >>> # Disallow the use of making new Links before calling deep_map_mut
    >>> Link.__init__, hold = lambda *args: print("Do not create any new Links."), Link.__init__
    >>> try:
    ...     deep_map_mut(lambda x: x * x, link1)
    ... finally:
    ...     Link.__init__ = hold
    >>> print(link1)
    <9 <16> 25 36>
    """
    "*** YOUR CODE HERE ***"
    while lnk:
        if isinstance(lnk.first, Link):
            deep_map_mut(fn, lnk.first)
        else:
            lnk.first = fn(lnk.first)
        lnk = lnk.rest
```

Use Ok to test your code:

```plaintext
python3 ok -q deep_map_mut✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```

# Optional Questions

Homework assignments will also contain prior exam-level questions for you to take a look at. These questions have no submission component; feel free to attempt them if you’d like a challenge!

1. Spring 2018 MT2 Q5ab: [Trees](https://cs61a.org/exam/sp18/mt2/61a-sp18-mt2.pdf#page=7)
2. Spring 2019 MT2 Q6a: [Trie this](https://cs61a.org/exam/sp19/mt2/61a-sp19-mt2.pdf#page=7)
3. Fall 2017 Final Q4a: [O! Pascal](https://inst.eecs.berkeley.edu/~cs61a/fa17/assets/pdfs/61a-fa17-final.pdf#page=5)
