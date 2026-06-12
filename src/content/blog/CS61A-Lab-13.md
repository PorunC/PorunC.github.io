---
title: CS61A Lab 13
date: '2022-07-30T05:45:13.000Z'
updated: '2022-07-30T05:52:43.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/30/CS61A-Lab-13
oldUrl: /2022/07/30/CS61A-Lab-13/
excerpt: >-
  Consult this section if you need a refresher on the material for this lab.
  It’s okay to skip directly to the questions and refer back here should you get
  stuck. For each of the fol...
---
# Lab 13 Solutions [lab13.zip](/2022/07/30/CS61A-Lab-13/lab13.zip)

## Solution Files

# Topics

Consult this section if you need a refresher on the material for this lab. It’s okay to skip directly to the questions and refer back here should you get stuck.

# Questions

## Regular Expressions

### Q1: What Would RegEx Match?

For each of the following regular expressions, suggest a string that would be fully matched.

> Use Ok to test your knowledge by choosing the best answer for each of the following questions:
>

> ```
 python3 ok -q wwrm -u
> ```


> A hexadecimal color code begins with `#` and is followed by exactly six hexadecimal numbers, which can be the digits 0-9 or letters a-f.

```plaintext
Q: #[a-f0-9]{6}
Choose the number of the correct choice:
0) A hexadecimal color code with 3 letters and 3 numbers
1) A hexadecimal color code that starts with letters and ends with numbers, like #gg1234
2) Any 6-digit hexadecimal color code, like #fdb515
3) Any hexadecimal color code with 0-6 digits

Q: (fizz(buzz|)|buzz)
Choose the number of the correct choice:
0) Only fizzbuzz or buzz
1) Only fizzbuzzbuzz
2) Only fizz
3) Only fizzbuzz, fizz, and buzz
4) Only fizzbuzz

Q: [-+]?\d*\.?\d+
Choose the number of the correct choice:
0) Only signed numbers like +1000, -1.5
1) Only signed or unsigned integers like +1000, -33
2) Signed or unsigned numbers like +1000, -1.5, .051
3) Only unsigned numbers like 0.051

Q: [1-9]+[05]+
Choose the number of the correct choice:
0) Any positive number
1) Numbers that are both greater than 5 and divisible by 5 like 10, 25, 800
2) Numbers that are divisible by 5 but do not have the digits 0 and 5 adjacent to each other as the last 2 digits
3) Numbers that are divisible by 5 like 5, 20, 6325
```

### Q2: Scientific Name

Returns whether the input string `name` follows the correct format for a scientific name. A scientific name’s format is as follows: starts with a capital letter, followed by a period (`.`) or a series of lowercase letters, followed by a space, followed by a series of lowercase letters. Refer to the doctests for examples of valid and invalid strings.

```plaintext
import re

def scientific_name(name):
    """
    Returns True for strings that are in the correct notation for scientific names;
    i.e. contains a capital letter followed by a period or lowercase letters, 
    followed by a space, followed by more lowercase letters. Returns False for 
    invalid strings.

    >>> scientific_name("T. rex")
    True
    >>> scientific_name("t. rex")
    False
    >>> scientific_name("tyrannosurus rex")
    False
    >>> scientific_name("t rex")
    False
    >>> scientific_name("Falco peregrinus")
    True
    >>> scientific_name("F peregrinus")
    False
    >>> scientific_name("Annie the F. peregrinus")
    False
    >>> scientific_name("I want a pet T. rex right now")
    False
    """

    return bool(re.search(r"^[A-Z]([.]|[a-z]+)\s[a-z]+$", name))
```

Use Ok to test your code:

```plaintext
python3 ok -q scientific_name✂️
```

### Q3: Calculator Ops

Write a regular expression that parses strings written in the 61A Calculator language and returns `True` if any expression has exactly two numeric operands. Returns `False` otherwise.

> Note: the allowed operators are `+`, `-`, `*`, and `/`. Check these [lecture slides](/2022/07/30/CS61A-Lab-13/../../assets/slides/27-Interpreters_Calculator.html#/15) for a refresher on what the 61A calculator language is.

```plaintext
import re

def calculator_ops(calc_str):
    """
    Returns True if an expression from the Calculator language that has two
    numeric operands exists in calc_str, False otherwise.

    >>> calculator_ops("(* 2 4)")
    True
    >>> calculator_ops("(+ (* 3 (+ (* 2 4) (+ 3 5))) (+ (- 10 7) 6))")
    True
    >>> calculator_ops("(* 2)")
    False
    >>> calculator_ops("(/ 8 4 2)")
    False
    >>> calculator_ops("(- 8 3)")
    True
    >>> calculator_ops("+ 3 23")
    False
    """

    # Since hyphen is a special character inside [], it must be escaped
    return bool(re.search(r"\(([+\-/*]\s+\d+\s+\d+)\)", calc_str))

    # Alternate solution: hyphen must be at either beginning or end inside []
    return bool(re.search(r"\(([-+*/]\s+\d+\s+\d+)\)", calc_str))
```

Use Ok to test your code:

```plaintext
python3 ok -q calculator_ops✂️
```

### Q4: Roman Numerals

Return `True` if any string of letters that resemble a Roman numeral exists in `text` and aren’t part of another word. A Roman numeral is made up of the letters `I`, `V`, `X`, `L`, `C`, `D`, `M` and is at least one letter long.

> For the purposes of this problem, don’t worry about whether or not a Roman numeral is valid. For example, “VIIIII” is not a Roman numeral, but it is fine if your regex matches it.

```plaintext
import re

def roman_numerals(text):
    """
    Returns True if any string of letters that could be a Roman numeral
    (made up of the letters I, V, X, L, C, D, M) is found. Returns False otherwise.

    >>> roman_numerals("Sir Richard IIV, can you tell Richard VI that Richard IV is on the phone?")
    True
    >>> roman_numerals("My TODOs: I. Groceries II. Learn how to count in Roman IV. Profit")
    True
    >>> roman_numerals("I. Act 1 II. Act 2 III. Act 3 IV. Act 4 V. Act 5")
    True
    >>> roman_numerals("Let's play Civ VII")
    True
    >>> roman_numerals("i love vi so much more than emacs.")
    False
    >>> roman_numerals("she loves ALL editors equally.")
    False
    """

    return bool(re.search(r"\b([IVXLCDM]+)\b", text))
```

Use Ok to test your code:

```plaintext
python3 ok -q roman_numerals✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
