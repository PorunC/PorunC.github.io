---
title: CS61A Homework 4
date: '2022-05-21T05:54:01.000Z'
updated: '2022-05-22T11:01:57.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/21/CS61A-Homework-4
oldUrl: /2022/05/21/CS61A-Homework-4/
excerpt: >-
  To work on these problems, open the Parsons editor: Complete the function
  remove odd indices, which takes in a list lst and a boolean odd, and returns a
  new list with elements remo...
---
# Homework 4: Python Lists, Object-Oriented Programming [hw04.zip](https://cs61a.org/hw/hw04/hw04.zip)

## Parsons Problems

To work on these problems, open the Parsons editor:

```plaintext
python3 parsons
```

### Q1: Remove Odd Indices

Complete the function `remove_odd_indices`, which takes in a list `lst` and a boolean `odd`, and returns a new list with elements removed at certain indices. If `odd` is `True`, then the function should remove elements at odd indices; otherwise if `odd` is False, then the function should remove even indexed items.

Note that lists are zero-indexed; thus, the first element is at index 0, the second element is at index 1, etc.

```python
def remove_odd_indices(lst, odd):
    """ 
    Remove elements of lst that have odd indices.
    >>> s = [1, 2, 3, 4]
    >>> t = remove_odd_indices(s, True)
    >>> s
    [1, 2, 3, 4]
    >>> t
    [1, 3]
    >>> l = [5, 6, 7, 8]
    >>> m = remove_odd_indices(l, False)
    >>> m
    [6, 8]
    """
    "*** YOUR CODE HERE ***"
    if odd:
    	return [lst[x] for x in range(len(lst)) if x % 2 == 0]
    else:
    	return [lst[x] for x in range(len(lst)) if x % 2 == 1]
```

### Q2: Smart Fridge

The `SmartFridge` class is used by smart refrigerators to track which items are in the fridge and let owners know when an item has run out.

The class internally uses a dictionary to store items, where each key is the item name and the value is the current quantity. The `add_item` method should add the given quantity of the given item and report the current quantity. You can assume that the `use_item` method will only be called on items that are already in the fridge, and it should use up the given quantity of the given item. If the quantity would fall to or below zero, it should only use *up to* the remaining quantity, and remind the owner to buy more of that item.  
Finish implementing the `SmartFridge` class definition so that its `add_item` and `use_item` methods work as expected.

```python
class SmartFridge:
    """"
    >>> fridgey = SmartFridge()
    >>> fridgey.add_item('Mayo', 1)
    'I now have 1 Mayo'
    >>> fridgey.add_item('Mayo', 2)
    'I now have 3 Mayo'
    >>> fridgey.use_item('Mayo', 2.5)
    'I have 0.5 Mayo left'
    >>> fridgey.use_item('Mayo', 0.5)
    'Uh oh, buy more Mayo!'
    """
    def __init__(self):
        self.items = {}
    def add_item(self, item, quantity):
        "*** YOUR CODE HERE ***"
        if item in self.items:
          self.items[item] += quantity
        else:
          self.items[item] = quantity
        return f'I now have {self.items[item]}{item}'
    def use_item(self, item, quantity):
        "*** YOUR CODE HERE ***"
        self.items[item] -= min(quantity, self.items[item])
        if self.items[item] == 0:
          return f'Uh oh, buy more {item}!'
        return f'I have {self.items[item]}{item} left'
```

## Code Writing Questions

### Q3: Merge

Write a function `merge` that takes 2 *sorted* lists `lst1` and `lst2`, and returns a new list that contains all the elements in the two lists in sorted order. Note: Try to solve this question using recursion instead of iteration.

```python
def merge(lst1, lst2):
    """Merges two sorted lists.

    >>> merge([1, 3, 5], [2, 4, 6])
    [1, 2, 3, 4, 5, 6]
    >>> merge([], [2, 4, 6])
    [2, 4, 6]
    >>> merge([1, 2, 3], [])
    [1, 2, 3]
    >>> merge([5, 7], [2, 4, 6])
    [2, 4, 5, 6, 7]
    """
    "*** YOUR CODE HERE ***"
    def helper(lst1, n, lst2, m):
        if n == 0:
            return lst2
        if m == 0:
            return lst1
        res = []
        if lst1[0] < lst2[0]:
            res.append(lst1[0])
            res.extend(helper(lst1[1:], n - 1, lst2, m))
        else:
            res.append(lst2[0])
            res.extend(helper(lst2[1:], m - 1, lst1, n))
        return res
    return helper(lst1, len(lst1), lst2, len(lst2))

    """Iteration
    
    res = []
    i, j = 0, 0
    while i < len(lst1) and j < len(lst2):
        if lst1[i] < lst2[j]:
            res.append(lst1[i])
            i += 1
        else:
            res.append(lst2[j])
            j += 1
    while i < len(lst1):
        res.append(lst1[i])
        i += 1
    while j < len(lst2):
        res.append(lst2[j])
        j += 1
    return res
    """

```

Use Ok to test your code:

```plaintext
python3 ok -q merge✂️
```

### Q4: Mint

A mint is a place where coins are made. In this question, you’ll implement a `Mint` class that can output a `Coin` with the correct year and worth.

- Each `Mint` instance has a `year` stamp. The `update` method sets the `year` stamp to the `present_year` class attribute of the `Mint` class.
- The `create` method takes a subclass of `Coin` and returns an instance of that class stamped with the `mint`’s year (which may be different from `Mint.present_year` if it has not been updated.)
- A `Coin`’s `worth` method returns the `cents` value of the coin plus one extra cent for each year of age beyond 50. A coin’s age can be determined by subtracting the coin’s year from the `present_year` class attribute of the `Mint` class.

```python
class Mint:
    """A mint creates coins by stamping on years.

    The update method sets the mint's stamp to Mint.present_year.

    >>> mint = Mint()
    >>> mint.year
    2021
    >>> dime = mint.create(Dime)
    >>> dime.year
    2021
    >>> Mint.present_year = 2101  # Time passes
    >>> nickel = mint.create(Nickel)
    >>> nickel.year     # The mint has not updated its stamp yet
    2021
    >>> nickel.worth()  # 5 cents + (80 - 50 years)
    35
    >>> mint.update()   # The mint's year is updated to 2101
    >>> Mint.present_year = 2176     # More time passes
    >>> mint.create(Dime).worth()    # 10 cents + (75 - 50 years)
    35
    >>> Mint().create(Dime).worth()  # A new mint has the current year
    10
    >>> dime.worth()     # 10 cents + (155 - 50 years)
    115
    >>> Dime.cents = 20  # Upgrade all dimes!
    >>> dime.worth()     # 20 cents + (155 - 50 years)
    125
    """
    present_year = 2021

    def __init__(self):
        self.update()

    def create(self, coin):
        "*** YOUR CODE HERE ***"
        return coin(self.year)

    def update(self):
        "*** YOUR CODE HERE ***"
        self.year = Mint.present_year

class Coin:
    cents = None # will be provided by subclasses, but not by Coin itself

    def __init__(self, year):
        self.year = year

    def worth(self):
        "*** YOUR CODE HERE ***"
			 return self.cents + max(0, Mint.present_year - self.year - 50)

class Nickel(Coin):
    cents = 5

class Dime(Coin):
    cents = 10
```

Use Ok to test your code:

```plaintext
python3 ok -q Mint✂️
```

### Q5: Vending Machine

In this question you’ll create a [vending machine](https://en.wikipedia.org/wiki/Vending_machine) that only outputs a single product and provides change when needed.

Create a class called `VendingMachine` that represents a vending machine for some product. A `VendingMachine` object returns strings describing its interactions. Remember to match **exactly** the strings in the doctests – including punctuation and spacing!

Fill in the `VendingMachine` class, adding attributes and methods as appropriate, such that its behavior matches the following doctests:

```python
class VendingMachine:
    """A vending machine that vends some product for some price.

    >>> v = VendingMachine('candy', 10)
    >>> v.vend()
    'Nothing left to vend. Please restock.'
    >>> v.add_funds(15)
    'Nothing left to vend. Please restock. Here is your $15.'
    >>> v.restock(2)
    'Current candy stock: 2'
    >>> v.vend()
    'You must add $10 more funds.'
    >>> v.add_funds(7)
    'Current balance: $7'
    >>> v.vend()
    'You must add $3 more funds.'
    >>> v.add_funds(5)
    'Current balance: $12'
    >>> v.vend()
    'Here is your candy and $2 change.'
    >>> v.add_funds(10)
    'Current balance: $10'
    >>> v.vend()
    'Here is your candy.'
    >>> v.add_funds(15)
    'Nothing left to vend. Please restock. Here is your $15.'

    >>> w = VendingMachine('soda', 2)
    >>> w.restock(3)
    'Current soda stock: 3'
    >>> w.restock(3)
    'Current soda stock: 6'
    >>> w.add_funds(2)
    'Current balance: $2'
    >>> w.vend()
    'Here is your soda.'
    """
    "*** YOUR CODE HERE ***"
    def __init__(self, name, price):
        self.name = name
        self.price = price
        self.num = 0
        self.balance = 0
    
    def restock(self, num):
        self.num += num
        return f"Current {self.name} stock: {self.num}"
        
    def add_funds(self, amount):
        if self.num > 0:
            self.balance += amount
            return f"Current balance: ${self.balance}"
        else:
            return f'Nothing left to vend. Please restock. Here is your ${amount}.'
            
    def vend(self):
        if self.num == 0:
            return f'Nothing left to vend. Please restock.'
        if self.balance < self.price:
            return f"You must add ${self.price - self.balance} more funds."
        else:
            self.balance = self.balance - self.price
            self.num -= 1
            if self.balance > 0:
                ret = f"Here is your {self.name} and ${self.balance} change."
                self.balance = 0
                return ret
            elif self.balance == 0:
                return f"Here is your {self.name}."
```

> You may find Python’s formatted string literals, or [f-strings](https://docs.python.org/3/tutorial/inputoutput.html#fancier-output-formatting) useful. A quick example:
>
> |  |  |
> | --- | --- |
> | ``` 1 2 3 4 ``` | ``` >>> feeling = 'love' >>> course = '61A!' >>> f'I {feeling} {course}' 'I love 61A!' ``` |

Use Ok to test your code:

```plaintext
python3 ok -q VendingMachine✂️
```

> If you’re curious about alternate methods of string formatting, you can also check out an older method of [Python string formatting](https://docs.python.org/2/library/stdtypes.html#str.format). A quick example:
>
> |  |  |
> | --- | --- |
> | ``` 1 2 3 ``` | ``` >>> ten, twenty, thirty = 10, 'twenty', [30] >>> '{0} plus {1} is {2}'.format(ten, twenty, thirty) '10 plus twenty is [30]' ``` |

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
