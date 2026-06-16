---
title: CS61A Lab 10
date: '2022-07-30T05:26:09.000Z'
updated: '2022-07-30T05:29:18.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/30/CS61A-Lab-10
oldUrl: /2022/07/30/CS61A-Lab-10/
excerpt: >-
  Due by 11:59pm on Wednesday, March 30. Download lab10.zip. Inside the archive,
  you will find starter files for the questions in this lab, along with a copy
  of the Ok autograder. Co...
---
# Lab 10: Scheme [lab10.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab10/lab10.zip)

*Due by 11:59pm on Wednesday, March 30.*

## Starter Files

Download [lab10.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab10/lab10.zip). Inside the archive, you will find starter files for the questions in this lab, along with a copy of the [Ok](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab10/ok) autograder.

# Topics

Consult this section if you need a refresher on the material for this lab. It’s okay to skip directly to [the questions](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab10/#required-questions) and refer back here should you get stuck.

## Scheme

Scheme is a famous functional programming language from the 1970s. It is a dialect of Lisp (which stands for LISt Processing). The first observation most people make is the unique syntax, which uses a prefix notation and (often many) nested parentheses (see <http://xkcd.com/297/>). Scheme features first-class functions and optimized tail-recursion, which were relatively new features at the time.

> Our course uses a custom version of Scheme (which you will build for Project 4) included in the starter ZIP archive. To start the interpreter, type `python3 scheme`. To run a Scheme program interactively, type `python3 scheme -i <file.scm>`. To exit the Scheme interpreter, type `(exit)`. You may find it useful to try [code.cs61a.org/scheme](https://code.cs61a.org/scheme) when working through problems, as it can draw environment and box-and-pointer diagrams and it lets you walk your code step-by-step (similar to Python Tutor). Don’t forget to submit your code through Ok though!

### Scheme Editor

As you’re writing your code, you can debug using the Scheme Editor. In your `scheme` folder you will find a new editor. To run this editor, run `python3 editor`. This should pop up a window in your browser; if it does not, please navigate to [localhost:31415](/2022/07/30/CS61A-Lab-10/localhost:31415) and you should see it.

Make sure to run `python3 ok` in a separate tab or window so that the editor keeps running.

If you find that your code works in the online editor but not in your own interpreter, it’s possible you have a bug in code from an earlier part that you’ll have to track down. Every once in a while there’s a bug that our tests don’t catch, and if you find one you should let us know!

## Expressions

Primitive Expressions  
Call Expressions  
Special Forms

## Control Structures

If Expressions  
Cond Expressions

## Defining Names

Define Form

## Lambda Functions

Lambda Functions

# Required Questions

## What Would Scheme Display?

### Q1: Combinations

Let’s familiarize ourselves with some built-in Scheme procedures and special forms!

> Use Ok to unlock the following “What would Scheme print?” questions:
>

> ```
 python3 ok -q combinations -u
> ```


```bash
$ python3 ok -q combinations -u
=====================================================================
Assignment: Lab 10
OK, version v1.18.1
=====================================================================

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Unlocking tests

At each "? ", type what you would expect the output to be.
Type exit() to quit

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 1
(cases remaining: 4)


scm> (- 10 4)
? 6
-- OK! --

scm> (* 7 6)
? 42
-- OK! --

scm> (+ 1 2 3 4)
? 10
-- OK! --

scm> (/ 8 2 2)
? 2
-- OK! --

scm> (quotient 29 5)
? 5
-- OK! --

scm> (modulo 29 5)
? 4
-- OK! --

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 2
(cases remaining: 3)


scm> (= 1 3)                    ; Scheme uses '=' instead of '==' for comparison
? #f
-- OK! --

scm> (< 1 3)
? #t
-- OK! --

scm> (or 1 #t)                  ; or special form short circuits
? 1
-- OK! --

scm> (and #t #f (/ 1 0))
? #f
-- OK! --

scm> (not #t)
? #f
-- OK! --

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 3
(cases remaining: 2)


scm> (define x 3)
? x
-- OK! --

scm> x
? 3
-- OK! --

scm> (define y (+ x 4))
? y
-- OK! --

scm> y
? 7
-- OK! --

scm> (define x (lambda (y) (* y 2)))
? x
-- OK! --

scm> (x y)
? 14
-- OK! --

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 4
(cases remaining: 1)


scm> (if (not (print 1)) (print 2) (print 3))
(line 1)? 1
(line 2)? 3
-- OK! --

scm> (* (if (> 3 2) 1 2) (+ 4 5))
? 9
-- OK! --

scm> (define foo (lambda (x y z) (if x y z)))
? foo
-- OK! --

scm> (foo 1 2 (print 'hi))
(line 1)? hi
(line 2)? 2
-- OK! --

scm> ((lambda (a) (print 'a)) 100)
? a
-- OK! --

---------------------------------------------------------------------
OK! All cases for What Would Scheme Display? unlocked.
```

## Coding Questions

### Q2: Over or Under

Define a procedure `over-or-under` which takes in a number `num1` and a number `num2` and returns the following:

- -1 if `num1` is less than `num2`
- 0 if `num1` is equal to `num2`
- 1 if `num1` is greater than `num2`

> Challenge: Implement this in 2 different ways using `if` and `cond`!

```scheme
(define (over-or-under num1 num2) 
    'YOUR-CODE-HERE
    (cond ((< num1 num2) -1)
          ((> num1 num2) 1)
          ((= num1 num2) 0))
)
```

Use Ok to test your code:

```plaintext
python3 ok -q over_or_under✂️
```

### Q3: Make Adder

Write the procedure `make-adder` which takes in an initial number, `num`, and then returns a procedure. This returned procedure takes in a number `inc` and returns the result of `num + inc`.

> *Hint*: To return a procedure, you can either return a `lambda` expression or `define` another nested procedure. Remember that Scheme will automatically return the last clause in your procedure.
>
> You can find documentation on the syntax of `lambda` expressions in [the 61A scheme specification!](https://cs61a.org/articles/scheme-spec/#lambda)

```scheme
(define (make-adder num) 
    'YOUR-CODE-HERE
    (lambda (x) (+ x num))
)

```

Use Ok to test your code:

```plaintext
python3 ok -q make_adder✂️
```

### Q4: Compose

Write the procedure `composed`, which takes in procedures `f` and `g` and outputs a new procedure. This new procedure takes in a number `x` and outputs the result of calling `f` on `g` of `x`.

```scheme
(define (composed f g) 
    'YOUR-CODE-HERE
    (lambda (x) (f (g x))) 
)
```

Use Ok to test your code:

```plaintext
python3 ok -q composed✂️
```

### Q5: Pow

Implement a procedure `pow` for raising the number `base` to the power of a nonnegative integer `exp` for which the number of operations grows logarithmically, rather than linearly (the number of recursive calls should be much smaller than the input `exp`). For example, for `(pow 2 32)` should take 5 recursive calls rather than 32 recursive calls. Similarly, `(pow 2 64)` should take 6 recursive calls.

> *Hint:* Consider the following observations:
>
> 1. x2y = (xy)2
> 2. x2y+1 = x(xy)2
>
> For example we see that 232 is (216)2, 216 is (28)2, etc. You may use the built-in predicates `even?` and `odd?`. Scheme doesn’t support iteration in the same manner as Python, so consider another way to solve this problem.

```scheme
(define (pow base exp) 
    'YOUR-CODE-HERE
    (cond  
        ((= exp 0) 1)
        ((= exp 1) base)
        ((= exp 2) (square base))
        ((= base 1) 1)
        (else
           (cond
                ((even? exp) 
                    (square (pow base (/ exp 2)))
                )
                (else 
                    (* 
                        (square 
                            (pow base (/ (- exp 1) 2))
                        )
                        base
                    )
                )
            )
        )
    )
)
```

Use Ok to unlock and test your code:

```plaintext
python3 ok -q pow -u
python3 ok -q pow✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
