---
title: CS61A Lab 11
date: '2022-07-30T05:33:10.000Z'
updated: '2022-07-30T05:41:18.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/30/CS61A-Lab-11
oldUrl: /2022/07/30/CS61A-Lab-11/
excerpt: >-
  Due by 11:59pm on Wednesday, April 6. Download lab11.zip. Inside the archive,
  you will find starter files for the questions in this lab, along with a copy
  of the Ok autograder. In ...
---
# Lab 11: Interpreters [lab11.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab11/lab11.zip)

*Due by 11:59pm on Wednesday, April 6.*

## Starter Files

Download [lab11.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab11/lab11.zip). Inside the archive, you will find starter files for the questions in this lab, along with a copy of the [Ok](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab11/ok) autograder.

# Introduction

In the [Scheme project](https://cs61a.org/proj/scheme/), you’ll be implementing a Python interpreter for Scheme.

Part of the process of interpreting Scheme expressions is being able to **parse** a string of Scheme code as our input into our interpreter’s internal Python representation of Scheme expressions. As all Scheme expressions are Scheme lists (and therefore linked lists), we represent all Scheme expressions using the `Pair` class, which behaves as a linked list. **This class is defined in `pair.py`.**

When given an input such as `(+ 1 2)`, there are two main steps we want to take.

The first part of interpreting expressions is taking the input and breaking it down into each component. In our example, we want to treat each of `(`, `+`, `1`, `2`, and `)` as a separate token that we can then figure out how to represent. This is called **lexical analysis**, and has been implemented for you in the `tokenize_lines` function in `scheme_tokens.py`.

Now that we’ve broken down the input into its component parts, we want to turn these Scheme tokens into our interpreter’s internal representations of them. This is called **syntactic analysis**, which happens in `scheme_reader.py` in the `scheme_read` and `read_tail` functions.

- `(` tells us we are starting a call expression.
- `+` will be the operator, as it’s the first element in the call expression.
- `1` is our first operand.
- `2` is our second operand.
- `)` tells us that we are ending the call expression.

The main idea is that we’d like to first recognize what the input represents, before we do any of the evaluating, or calling the operator on the operands, and so on.

The goal of this lab is to work with the various parts that go into parsing; while in this lab and in the project, we’re focusing on the Scheme language, the general ideas of how we’re setting up the Scheme interpreter can be applicable to other languages – such as Python itself!

# Required Questions

> Check out the [introduction](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab11/#introduction) for the context of this lab.

## Part 1

### Context

We store tokens ready to be parsed in `Buffer` instances. For example, a buffer containing the input `(+ (2 3))` would have the tokens `'('`, `'+'`, `'('`, `2`, `3`, `')'`, and `')'`.

In this part, we will implement the `Buffer` class.

A `Buffer` provides a way of accessing a sequence of tokens across lines.

Its constructor takes an iterator, called “the `source`”, that returns the next line of tokens as a list each time it is queried, until it runs out of lines.

For example, `source` could be defined as follows:

```plaintext
line1 = ['(', '+', 6, 1, ')']      # (+ 6 1)
line2 = ['(', 'quote', 'A', ')']  # (quote A)
line3 = [2, 1, 0]                 # 2 1 0
input_lines = [line1, line2, line3]
source = iter(input_lines)
```

In effect, the `Buffer` combines the sequences returned from its source and then supplies the items from them one at a time through its `pop_first` method, calling the `source` for more sequences of items only when needed.

In addition, `Buffer` provides a `current` instance attribute to look at the next item to be supplied, without moving past it.

### Problem 1

> **Important:** Your code for this part should go in `buffer.py`.

Your job in this part is to implement the `create_generator`, `__init__`, and `pop_first` methods of the `Buffer` class.

> **Note:** For this question, you may want to use the built-in function `next` with its `default` argument. Here’s an example:
>

> ```python
 >>> iterator = iter([1, 2]) >>> next(iterator) # Here, there is no default arg given. 1 >>> next(iterator, 5) # Here, there is a default arg given, but not used. 2 >>> next(iterator, 5) # The iterator is exhausted, so next returns default. 5
> ```

>
> For more about `next`, feel free to read through the [`next` Python documentation](https://docs.python.org/3/library/functions.html#next).

#### `create_generator`

Implement `create_generator`, a generator function which takes in `source`, an iterator over line(s), each of which is a list that contains token(s).

This function should yield a single token from a line of the source at a time. If there are no more tokens on a line, then it should yield `EOL_TOKEN` (an object that represents an end-of-line token).

If there are no more tokens in the entire source, it should have no more yields. If you were to call `next` on a generator of this function in this case, a `StopIteration` would be raised, as there would be no more applicable yields.

You can reference this function in your implementations for `__init__` and `pop_first`.

> Remember that generator functions can be used as follows:
>

> ```python
 >>> gen = some_generator_function() >>> next(gen) # Returns the first yield from some_generator_function >>> next(gen) # Returns the next yield from some_generator_function
> ```


#### `__init__`

`__init__` takes in the input source `source`. You should define the following instance attributes:

- An instance attribute that holds a generator created by `create_generator` based off of the `source`, and
- `self.current` to represent the current token of the generator that the `Buffer` instance is on. In `__init__`, the current token should be the very first token that the generator yields.

If you wish, you may define more instance attributes as you see fit.

#### `pop_first`

Implement `pop_first`, which does the following:

- Saves the current token of the `Buffer` instance, to be returned later.
- Updates the current token of the `Buffer` instance to the next token from its generator instance.
- If there are no more tokens after the initial current token, then update the current token to be `None`. (Hint: see the note on the default argument to `next` at the beginning of this problem.)
- Returns the initial current token (*not* the updated current token!).

#### Testing your code

Use Ok to test your code:

```plaintext
python3 ok -q buffer✂️
```

```python
def __init__(self, source):
        """
        Initialize a Buffer instance based on the given source.
        """

        # BEGIN
        self.lines = []
        self.curr_line = []
        self.token = self.create_generator(source)
        self.current = next(self.token, None)
        # self.buffer = []
        # token_buffer = self.create_generator(source)
        # for token in token_buffer:
        #     self.buffer.append(token)
        
        # self.current = None
        # if self.buffer:            
        #     self.current = self.buffer[0]
        # END

```

## Part 2

### Internal Representations

The reader will parse Scheme code into Python values with the following representations:

| Input Example | Scheme Expression Type | Our Internal Representation |
| --- | --- | --- |
| `scm> 1` | Numbers | Python’s built-in `int` and `float` values |
| `scm> x` | Symbols | Python’s built-in `string` values |
| `scm> #t` | Booleans (`#t`, `#f`) | Python’s built-in `True`, `False` values |
| `scm> (+ 2 3)` | Combinations | Instances of the `Pair` class, defined in `scheme_reader.py`. This example is represented as: `Pair('+', Pair(2, Pair(3, nil)))`. |
| `scm> nil` | `nil` | The `nil` object, defined in `scheme_reader.py` |

When we refer to combinations here, we are referring to both call expressions and special forms.

### Problem 2

> **Important:** Your code for this part should go in `scheme_reader.py`.

> **Important:** While unlocking this problem, if the token yielded from the `Buffer` instance should be `EOL_TOKEN`, it will be displayed according to the `__repr__` function of the `EOL_TOKEN` class. Specifically, you would get:
>

> ```python
 >>> EOL_TOKEN This is a token representing the end of a line.
> ```


Your job in this part is to write the parsing functionality, which consists of two mutually recursive functions: `scheme_read` and `read_tail`. Each function takes in a single `src` parameter, which is a `Buffer` instance.

- `scheme_read` removes enough tokens from `src` to form a single expression and returns that expression in the correct [internal representation](https://inst.eecs.berkeley.edu/~cs61a/sp22/lab/lab11/#internal-representations).
- `read_tail` expects to read the rest of a list or `Pair`, assuming the open parenthesis of that list or `Pair` has already been removed by `scheme_read`. It will read expressions (and thus remove tokens) until the matching closing parenthesis `)` is seen. This list of expressions is returned as a linked list of `Pair` instances.

In short, `scheme_read` returns the next single complete expression in the buffer and `read_tail` returns the rest of a list or `Pair` in the buffer. Both functions mutate the buffer, removing the tokens that have already been processed.

The behavior of both functions depends on the first token currently in `src`. They should be implemented as follows:

`scheme_read`:

- If the current token is the string `"nil"`, return the `nil` object.
- If the current token is `(`, the expression is a pair or list. Call `read_tail` on the rest of `src` and return its result.
- If the current token is `'`, the rest of the buffer should be processed as a `quote` expression. You will implement this portion in the next problem.
- If the next token is not a delimiter, then it must be a primitive expression (i.e. a number, boolean). Return it. **Provided**
- If none of the above cases apply, raise an error. **Provided**

`read_tail`:

- If there are no more tokens, then the list is missing a close parenthesis and we should raise an error. **Provided**
- If the token is `)`, then we’ve reached the end of the list or pair. **Remove this token from the buffer** and return the `nil` object.
- If none of the above cases apply, the next token is the operator in a combination. For example, `src` could contain `+ 2 3)`. To parse this:
  1. `scheme_read` the next complete expression in the buffer.
  2. Call `read_tail` to read the rest of the combination until the matching closing parenthesis.
  3. Return the results as a `Pair` instance, where the first element is the next complete expression from (1) and the second element is the rest of the combination from (2).

Use Ok to unlock and test your code:

```plaintext
>>> EOL_TOKEN
This is a token representing the end of a line.
```

### Problem 3

> **Important:** Your code for this part should go in `scheme_reader.py`.

Your task in this problem is to complete the implementation of `scheme_read` by allowing the function to now be able to handle quoted expressions.

In Scheme, quoted expressions such as `'<expr>` are equivalent to `(quote <expr>)`. That means that we need to wrap the expression following `'` (which you can get by recursively calling `scheme_read`) into the `quote` special form, which is a Scheme list (as with all special forms).

In our representation, a `Pair` represents a Scheme list. You should therefore wrap the expression following `'` in a `Pair`.

For example, `'bagel`, or `["'", "bagel"]` after being tokenized, should be represented as `Pair('quote', Pair('bagel', nil))`. `'(1 2)` (or `["'", "(", 1, 2, ")"]`) should be represented as `Pair('quote', Pair(Pair(1, Pair(2, nil)), nil))`.

Use Ok to unlock and test your code:

```plaintext
python3 ok -q scheme_read -u
python3 ok -q scheme_read✂️
```

## Running your parser

Now that your parser is complete, you can test the read-eval-print loop by running:

```plaintext
python3 scheme_reader.py --repl
```

Every time you type in a value into the prompt, both the `str` and `repr` values of the parsed expression are printed. You can try the following inputs:

```plaintext
read> 42
str : 42
repr: 42
read> nil
str : ()
repr: nil
read> (1 (2 3) (4 (5)))
str : (1 (2 3) (4 (5)))
repr: Pair(1, Pair(Pair(2, Pair(3, nil)), Pair(Pair(4, Pair(Pair(5, nil), nil)), nil)))
```

To exit the interpreter, you can type `exit`.

## Code

```python
"""This module implements the built-in data types of the Scheme language, along
with a parser for Scheme expressions.

In addition to the types defined in this file, some data types in Scheme are
represented by their corresponding type in Python:
    number:       int or float
    symbol:       string
    boolean:      bool
    unspecified:  None

The __repr__ method of a Scheme value will return a Python expression that
would be evaluated to the value, where possible.

The __str__ method of a Scheme value will return a Scheme expression that
would be read to the value, where possible.
"""

import numbers
import builtins

from ucb import main, trace, interact
from scheme_tokens import tokenize_lines, DELIMITERS

from buffer import Buffer, InputReader, LineReader
from pair import Pair, nil

# Scheme list parser


def scheme_read(src):
    """Read the next expression from SRC, a Buffer of tokens.

    >>> scheme_read(Buffer(tokenize_lines(['nil'])))
    nil
    >>> scheme_read(Buffer(tokenize_lines(['1'])))
    1
    >>> scheme_read(Buffer(tokenize_lines(['true'])))
    True
    >>> scheme_read(Buffer(tokenize_lines(['(+ 1 2)'])))
    Pair('+', Pair(1, Pair(2, nil)))
    """
    if src.current is None:
        raise EOFError
    val = src.pop_first()  # Get and remove the first token
    if val == 'nil':
        # BEGIN PROBLEM 2
        return nil
        # END PROBLEM 2
    elif val == '(':
        # BEGIN PROBLEM 2
        return read_tail(src)
        # END PROBLEM 2
    elif val == "'":
        # BEGIN PROBLEM 3
        return Pair('quote', Pair(scheme_read(src), nil))
        # END PROBLEM 3
    elif val not in DELIMITERS:
        return val
    else:
        raise SyntaxError('unexpected token: {0}'.format(val))


def read_tail(src):
    """Return the remainder of a list in SRC, starting before an element or ).

    >>> read_tail(Buffer(tokenize_lines([')'])))
    nil
    >>> read_tail(Buffer(tokenize_lines(['2 3)'])))
    Pair(2, Pair(3, nil))
    """
    try:
        while src.end_of_line():
            src.pop_first()
        if src.current is None:
            raise SyntaxError('unexpected end of file')
        elif src.current == ')':
            # BEGIN PROBLEM 2
            src.pop_first()
            return nil
            # END PROBLEM 2
        else:
            # BEGIN PROBLEM 2
            return Pair(scheme_read(src), read_tail(src))            
            # END PROBLEM 2
    except EOFError:
        raise SyntaxError('unexpected end of file')

# Convenience methods


def buffer_input(prompt='scm> '):
    """Return a Buffer instance containing interactive input."""
    return Buffer(tokenize_lines(InputReader(prompt)))


def buffer_lines(lines, prompt='scm> ', show_prompt=False):
    """Return a Buffer instance iterating through LINES."""
    if show_prompt:
        input_lines = lines
    else:
        input_lines = LineReader(lines, prompt)
    return Buffer(tokenize_lines(input_lines))


def read_line(line):
    """Read a single string LINE as a Scheme expression."""
    buf = Buffer(tokenize_lines([line]))
    while buf.end_of_line():
        buf.pop_first()
    result = scheme_read(buf)
    if not buf.end_of_line():
        raise SyntaxError("read_line's argument can only be a single element, but received multiple")
    return result

# Interactive loop


def read_print_loop():
    """Run a read-print loop for Scheme expressions."""
    while True:
        try:
            src = buffer_input('read> ')
            while src.end_of_line():
                src.pop_first()
            while not src.end_of_line():
                expression = scheme_read(src)
                if expression == 'exit':
                    print()
                    return
                print('str :', expression)
                print('repr:', repr(expression))
        except (SyntaxError, ValueError) as err:
            print(type(err).__name__ + ':', err)
        except (KeyboardInterrupt, EOFError):  # <Control>-D, etc.
            print()
            return


@main
def main(*args):
    if len(args) and '--repl' in args:
        read_print_loop()
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
