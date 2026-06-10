---
title: CS61A Homework 6
date: '2022-07-30T05:29:52.000Z'
updated: '2022-07-30T05:32:07.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/30/CS61A-Homework-6
oldUrl: /2022/07/30/CS61A-Homework-6/
excerpt: >-
  Due by 11:59pm on Thursday, April 7 Download hw06.zip. Inside the archive, you
  will find a file called hw06.scm, along with a copy of the ok autograder.
  Submission: When you are do...
---
# Homework 6: Scheme, Scheme Lists [hw06.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/hw/hw06/hw06.zip)

*Due by 11:59pm on Thursday, April 7*

## Instructions

Download [hw06.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/hw/hw06/hw06.zip). Inside the archive, you will find a file called [hw06.scm](https://inst.eecs.berkeley.edu/~cs61a/sp22/hw/hw06/hw06.scm), along with a copy of the `ok` autograder.

**Submission:** When you are done, submit with `python3 ok --submit`. You may submit more than once before the deadline; only the final submission will be scored. Check that you have successfully submitted your code on [okpy.org](https://okpy.org/). See [Lab 0](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab00#submitting-the-assignment) for more instructions on submitting assignments.

**Using Ok:** If you have any questions about using Ok, please refer to [this guide.](https://inst.eecs.berkeley.edu/~cs61a/sp22/articles/using-ok)

**Readings:** You might find the following references useful:

- [Scheme Specification](https://inst.eecs.berkeley.edu/~cs61a/sp22/articles/scheme-spec/)
- [Scheme Built-in Procedure Reference](https://inst.eecs.berkeley.edu/~cs61a/sp22/articles/scheme-builtins/)

**Grading:** Homework is graded based on correctness. Each incorrect problem will decrease the total score by one point. There is a homework recovery policy as stated in the syllabus. **This homework is out of 2 points.**

# Required Questions

Getting Started Videos

## Code Writing Questions

### Q1: Thane of Cadr

Define the procedures `cadr` and `caddr`, which return the second and third elements of a list, respectively. If you would like a quick refresher on scheme syntax consider looking at [Lab 10 Scheme Refresher](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab10/#scheme).

```scheme
(define (cddr s)
  (cdr (cdr s)))

(define (cadr s)
    'YOUR-CODE-HERE
    (car (cdr s))
)

(define (caddr s) 
    'YOUR-CODE-HERE
    (car (cdr (cdr s)))
)

```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q cadr-caddr -u
python3 ok -q cadr-caddr✂️
```

### Q2: Ascending

Implement a procedure called `ascending?`, which takes a list of numbers `lst` and returns `True` if the numbers are in nondescending order, and `False` otherwise. Numbers are considered nondescending if each subsequent number is either larger or equal to the previous, that is:

```plaintext
1 2 3 3 4
```

Is nondescending, but:

```plaintext
1 2 3 3 2
```

Is not.

> *Hint*: The built-in `null?` function returns whether its argument is `nil`.

```scheme

(define (ascending? lst) 
    'YOUR-CODE-HERE
    (if (null? lst)
        #t
        (if (null? (cdr lst))
            #t
            (if (<= 
                    (car lst) 
                    (car (cdr lst))
                )
                (ascending? (cdr lst))
                #f
            )
        )
    )
)
```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q ascending -u
python3 ok -q ascending✂️
```

### Q3: Interleave

Implement the function `interleave`, which takes a two lists `lst1` and `lst2` as arguments. `interleave` should return a new list that interleaves the elements of the two lists. (In other words, the resulting list should contain elements alternating between `lst1` and `lst2`.)

If one of the input lists to `interleave` is shorter than the other, then `interleave` should alternate elements from both lists until one list has no more elements, and then the remaining elements from the longer list should be added to the end of the new list.

```scheme
(define (interleave lst1 lst2)
    'YOUR-CODE-HERE
    (if (null? lst1)
        lst2
        (cons (car lst1)
            (interleave lst2 (cdr lst1))
        )
    )
)
```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q interleave -u
python3 ok -q interleave✂️
```

### Q4: My Filter

Write a procedure `my-filter`, which takes a predicate `func` and a list `lst`, and returns a new list containing only elements of the list that satisfy the predicate. The output should contain the elements in the same order that they appeared in the original list.

**Note:** Make sure that you are not just calling the built-in `filter` function in Scheme - we are asking you to re-implement this!

```scheme
(define (my-filter func lst) 
    'YOUR-CODE-HERE
    (if (null? lst)
        lst
        (if (func (car lst))
            (cons (car lst)
                (my-filter func (cdr lst))
            )
            (my-filter func (cdr lst))
        )
    )
)
```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q filter -u
python3 ok -q filter✂️
```

### Q5: No Repeats

Implement `no-repeats`, which takes a list of numbers `lst` as input and returns a list that has all of the unique elements of `lst` in the order that they first appear, but no repeats. For example, `(no-repeats (list 5 4 5 4 2 2))` evaluates to `(5 4 2)`.

> **Hint:** How can you make the first time you see an element in the input list be the first and only time you see the element in the resulting list you return?

> **Hint:** You may find it helpful to use the `my-filter` procedure with a helper `lambda` function to use as a filter. To test if two numbers are equal, use the `=` procedure. To test if two numbers are not equal, use the `not` procedure in combination with `=.`

```scheme
(define (no-repeats lst)
    'YOUR-CODE-HERE
    (define (member item items)
        (if (null? items)
            #f
            (if (equal? item (car items))
                #t
                (member item (cdr items))
            )
        )
    )
    
    (if (null? lst)
        lst
        (if (member (car lst) (cdr lst))
            (no-repeats (cdr lst))
            (cons (car lst)
                (no-repeats (cdr lst))
            )
        )
    )
)

```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q no_repeats -u
python3 ok -q no_repeats✂️
```
