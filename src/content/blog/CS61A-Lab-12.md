---
title: CS61A Lab 12
date: '2022-07-30T05:36:53.000Z'
updated: '2022-07-30T05:41:15.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/30/CS61A-Lab-12
oldUrl: /2022/07/30/CS61A-Lab-12/
excerpt: >-
  Due by 11:59pm on Wednesday, April 13. Download lab12.zip. Inside the archive,
  you will find starter files for the questions in this lab, along with a copy
  of the Ok autograder. Co...
---
# Lab 12: Scheme Data Abstraction [lab12.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab12/lab12.zip)

*Due by 11:59pm on Wednesday, April 13.*

## Starter Files

Download [lab12.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab12/lab12.zip). Inside the archive, you will find starter files for the questions in this lab, along with a copy of the [Ok](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab12/ok) autograder.

# Topics

Consult this section if you need a refresher on the material for this lab. It’s okay to skip directly to [the questions](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab12/#required-questions) and refer back here should you get stuck.

## Data Abstractions

Data Abstractions

## Example Data Abstractions

### `Rational`

Recall that a [rational number](https://en.wikipedia.org/wiki/Rational_number) is any number that can be expressed as *p / q*, where *p* and *q* are integers.

```plaintext
; Creates the rational number n/d (Assume n, d are integers and d != 0)
; Note that the constructor simplifies the numerator and denominator.
(rational n d)

; Gets the numerator of rational number r
(numer r) 

; Gets the denominator of rational number r
(denom r)

; Adds two rational numbers x and y
(add-rational x y)

; Multiplies two rational numbers x and y
(mul-rational x y)
```

### `Trees`

Below is a Scheme-ified data abstraction of the Tree class we’ve been working with this semester.

```plaintext
; Constructs tree given label and list of branches
(tree label branches)

; Returns the label of the tree
(label t)

; Returns the list of branches of the given tree
(branches t)

; Returns #t if t is a leaf, #f otherwise
(is-leaf t)
```

# Questions

## What Would Scheme Do?

### Q1: WWSD: Data Abstractions

Let’s familiarize ourselves with some Scheme data abstractions!

> If you need a refresher on the `tree` and `rational` abstractions, refer to this lab’s introduction or [Monday 04/11’s lecture](https://cs61a.org/lecture/lec31/).

Use Ok to test your knowledge with the following “What Would Python Display?” questions:

```plaintext
python3 ok -q abstractions -u✂️
```

```plaintext
scm> (load rational.scm)
scm> (define x (rational 2 5))

scm> (numer x)

scm> (denom x)

scm> (define y (rational 1 4))

scm> (define z1 (add-rational x y))

scm> (numer z1)

scm> (denom z1)

scm> (define z2 (mul-rational x y)) ; don't forget to reduce the rational!

scm> (numer z2)

scm> (denom z2)
scm> (load tree.scm)
scm> (define t (tree 1 (list (tree 2 nil)) ))

scm> (label t)

scm> (length (branches t))

scm> (define child (car (branches t)))

scm> (label child)

scm> (is-leaf child)

scm> (branches child)
scm> (load tree.scm)
scm> (define b1 (tree 5 (list (tree 6 nil) (tree 7 nil)) )) 

scm> (map is-leaf (branches b1))    ; draw the tree if you get stuck!

scm> (define b2 (tree 8 (list (tree 9 (list (tree 10 nil)) )) )) 

scm> (map is-leaf (branches b2))    ; draw the tree if you get stuck!

scm> (define t (tree 11 (list b1 b2)))

scm> (label t)

scm> (map (lambda (b) (label b)) (branches t)) ; draw the tree if you get stuck!
```

```plaintext
$ python3 ok -q abstractions -u
=====================================================================
Assignment: Lab 12
OK, version v1.18.1
=====================================================================

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Unlocking tests

At each "? ", type what you would expect the output to be.
Type exit() to quit

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 1
(cases remaining: 3)

scm> (load "./lab12.scm")
scm> (define x (rational 2 5))
? x
-- OK! --

scm> (numer x)
? 2
-- OK! --

scm> (denom x)
? 5
-- OK! --

scm> (define y (rational 1 4))
? y
-- OK! --

scm> (define z1 (add-rational x y))
? z1
-- OK! --

scm> (numer z1)
? 13
-- OK! --

scm> (denom z1)
? 20
-- OK! --

scm> (define z2 (mul-rational x y))
? z2
-- OK! --

scm> (numer z2)
? 1
-- OK! --

scm> (denom z2)
? 10
-- OK! --

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 2
(cases remaining: 2)

scm> (load "./lab12.scm")
scm> (define t (tree 1 (list (tree 2 nil))))
? t
-- OK! --

scm> (label t)
? 1
-- OK! --

scm> (length (branches t))
? 1
-- OK! --

scm> (define child (car (branches t)))
? child
-- OK! --

scm> (label child)
? 2
-- OK! --

scm> (is-leaf child)
? #t
-- OK! --

scm> (branches child)
? ()
-- OK! --

---------------------------------------------------------------------
What Would Scheme Display? > Suite 1 > Case 3
(cases remaining: 1)

scm> (load "./lab12.scm")
scm> (define b1 (tree 5 (list (tree 6 nil) (tree 7 nil)) )) 
? b1
-- OK! --

scm> (map is-leaf (branches b1))  ; draw the tree if you get stuck!
? (#t #t)
-- OK! --

scm> (define b2 (tree 8 (list (tree 9 (list (tree 10 nil)) )) )) 
? b2
-- OK! --

scm> (map is-leaf (branches b2))  ; draw the tree if you get stuck!
? (#f)
-- OK! --

scm> (define t (tree 11 (list b1 b2)))
? t
-- OK! --

scm> (label t)
? 11
-- OK! --

scm> (map (lambda (b) (label b)) (branches t))
? (5 8)
-- OK! --

---------------------------------------------------------------------
OK! All cases for What Would Scheme Display? unlocked.
```

## Code Writing Questions

> Remember that when working with data abstractions, you should **not** break the abstraction barrier if possible! Later questions will have *abstraction checks*, where the underlying representation of the abstraction will be changed; thus, attempting to refer to specifics of the implementation will break. Attempt to use the functions you are creating to interface with the classes whenever possible.

### Cities

Say we have an abstract data type for cities. A city has a name, a latitude coordinate, and a longitude coordinate.

Our data abstraction has one **constructor**:

- `(make-city name lat lon)`: Creates a city object with the given name, latitude, and longitude.

We also have the following **selectors** in order to get the information for each city:

- `(get-name city)`: Returns the city’s name
- `(get-lat city)`: Returns the city’s latitude
- `(get-lon city)`: Returns the city’s longitude

Here is how we would use the constructor and selectors to create cities and extract their information:

```plaintext
scm> (define berkeley (make-city 'Berkeley 122 37))
berkeley
scm> (get-name berkeley)
Berkeley
scm> (get-lat berkeley)
122
scm> (define new-york (make-city 'NYC 74 40))
new-york
scm> (get-lon new-york)
40
```

All of the selector and constructor functions can be found in the lab file, if you are curious to see how they are implemented. However, the point of data abstraction is that we do not need to know how an abstract data type is implemented, but rather just how we can interact with and use the data type.

### Q2: Distance

We will now implement the function `distance`, which computes the *Euclidean distance* between two city objects; the Euclidean distance between two coordinate pairs `(x1, y1)` and `(x2, y2)` can be found by calculating the `sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)`. Use the latitude and longitude of a city as its coordinates; you’ll need to use the selectors to access this info!

> You may find the following methods useful:
>
> - `(expt base exp)`: calculate `base ** exp`
> - `(sqrt x)` calculate `sqrt(x)`

```scheme
(define (distance city-a city-b) 
  'YOUR-CODE-HERE
  (sqrt
    (+
      (expt (- (get-lat city-a) (get-lat city-b)) 2)
      (expt (- (get-lon city-a) (get-lon city-b)) 2)
    )
  )
)
```

Use Ok to test your code:

```plaintext
python3 ok -q city_distance✂️
```

### Q3: Closer city

Next, implement `closer-city`, a function that takes a latitude, longitude, and two cities, and returns the name of the city that is relatively closer to the provided latitude and longitude.

You may only use the selectors and constructors introduced above and the `distance` function you just defined for this question.

> **Hint**: How can you use your `distance` function to find the distance between the given location and each of the given cities?

```scheme
(define (closer-city lat lon city-a city-b)
  'YOUR-CODE-HERE
  (define x (make-city 'x lat lon))
  (if (< (distance x city-a) (distance x city-b))
    (get-name city-a)
    (get-name city-b)
  )
)

```

Use Ok to test your code:

```plaintext
python3 ok -q city_closer✂️
```

### Teachers and Students

In the following questions, you’ll be implementing data abstractions for students and teachers:

1. The `teacher` abstraction keeps track of the teacher’s `name`, the `class` they teach, and the `students` enrolled in their class. Specifically, a `teacher`’s `name` and `class` are atomic symbols, and their `students` is a list of `student` objects.
2. The `student` abstraction keeps track of a student’s `name` and number of `classes` attended. Specifically, a `student`’s `name` is an atomic symbol, and their `classes` is a list of atomic symbols representing all classes attended. For example, if a student had attended `cs61a` and `astronomy`, their `classes` list would be `(cs61a astronomy)`.

You can find the constructors for these classes below:

```plaintext
(define (student-create name classes) (cons name classes))
(define (teacher-create name class students) (cons name (cons class students)))
```

### Q4: Teachers and Students: Selectors

Implement `student-get-name`, `student-get-classes`, `teacher-get-name`, `teacher-get-class`, and `teacher-get-students`. These functions take in a `student` or `teacher` abstraction, and return the relevant attribute; for example, `student-get-name` takes a `student` as input, and returns the `name`.

```scheme
(define (student-create name classes)
  (cons name classes)
)

(define (teacher-create name class students)
  (cons name (cons class students))
)

(define (student-get-name student)
  'YOUR-CODE-HERE
  (car student)
)

(define (student-get-classes student)
  'YOUR-CODE-HERE
  (cdr student)
)

(define (teacher-get-name teacher)
  'YOUR-CODE-HERE
  (car teacher)
)

(define (teacher-get-class teacher)
  'YOUR-CODE-HERE
  (car (cdr teacher))
)

(define (teacher-get-students teacher)
  'YOUR-CODE-HERE
  (cdr (cdr teacher))
)
```

Use Ok to test your code:

```plaintext
python3 ok -q teacher_student_selectors✂️
```

### Q5: Students: Attend Class

Implement `student-attend-class`. This method takes in a `student` and a `class` as input, and returns a *new* `student` abstraction with the `class` list updated to reflect the `class` attended.

> Be sure to keep the abstraction barrier in mind!

```scheme
(define (student-attend-class student class)
  'YOUR-CODE-HERE
  ; (define new_class (cons class (student-get-classes student)))
  ; (define name (student-get-name student))
  ; (student-create name new_class)
  (student-create
    (student-get-name student)
    (cons class (student-get-classes student))
  )
)
```

Use Ok to test your code:

```plaintext
python3 ok -q student_attend_class✂️
```

### Q6: Teachers: Hold Discussion

Implement `teacher-hold-class`. This method takes in a `teacher` as input, and emulates holding a class. Specifically, the function should return a *new* updated `teacher`, where all `student` objects in the `teacher`’s `students` list have updated `class` lists to reflect their attendance.

> Be sure to keep the abstraction barrier in mind! Feel free to use any of the functions implemented in previous parts of this lab. You may also find the [`map`](https://cs61a.org/articles/scheme-builtins/) function useful.

```scheme
(define (teacher-hold-class teacher)
  'YOUR-CODE-HERE
  (define name (teacher-get-name teacher))
  (define class (teacher-get-class teacher))
  (define students (teacher-get-students teacher))
  (define new_students
    (map
      (lambda (student) 
        (student-attend-class student class)
      )
      students
    )
  )
  
  (teacher-create name class new_students)
)
```

Use Ok to test your code:

```plaintext
python3 ok -q teacher_hold_class✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
