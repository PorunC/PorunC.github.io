---
title: CS61A Lab 6
date: '2022-05-22T11:44:18.000Z'
updated: '2022-05-22T13:21:14.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/22/CS61A-Lab-6
oldUrl: /2022/05/22/CS61A-Lab-6/
excerpt: >-
  These questions use inheritance. For an overview of inheritance, see the
  inheritance portion of Composing Programs. Below is the definition of a Car
  class that we will be using in ...
---
# Lab 6: Object-Oriented Programming [lab06.zip](https://cs61a.org/lab/lab06/lab06.zip)

## What Would Python Do?

These questions use inheritance. For an overview of inheritance, see the [inheritance portion](http://composingprograms.com/pages/25-object-oriented-programming.html#inheritance) of Composing Programs.

### Q1: WWPD: Classy Cars

Below is the definition of a `Car` class that we will be using in the following WWPD questions.

> **Note:** The `Car` class definition can also be found in `car.py`.

```plaintext
class Car:
    num_wheels = 4
    gas = 30
    headlights = 2
    size = 'Tiny'

    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.color = 'No color yet. You need to paint me.'
        self.wheels = Car.num_wheels
        self.gas = Car.gas

    def paint(self, color):
        self.color = color
        return self.make + ' ' + self.model + ' is now ' + color

    def drive(self):
        if self.wheels < Car.num_wheels or self.gas <= 0:
            return 'Cannot drive!'
        self.gas -= 10
        return self.make + ' ' + self.model + ' goes vroom!'

    def pop_tire(self):
        if self.wheels > 0:
            self.wheels -= 1

    def fill_gas(self):
        self.gas += 20
        return 'Gas level: ' + str(self.gas)
```

For the later unlocking questions, we will be referencing the `MonsterTruck` class below.

> **Note**: The `MonsterTruck` class definition can also be found in `car.py`.

```plaintext
class MonsterTruck(Car):
    size = 'Monster'

    def rev(self):
        print('Vroom! This Monster Truck is huge!')

    def drive(self):
        self.rev()
        return super().drive()
```

You can find the unlocking questions below.

> Use Ok to test your knowledge with the following “What Would Python Display?” questions:
>
> |  |  |
> | --- | --- |
> | ``` 1 ``` | ``` python3 ok -q wwpd-car -u✂️ ``` |
>
> **Important:** For all WWPD questions, type `Function` if you believe the answer is `<function...>`, `Error` if it errors, and `Nothing` if nothing is displayed.

```bash
>>> deneros_car = Car('Tesla', 'Model S')
>>> deneros_car.model

______
>>> deneros_car.gas = 10
>>> deneros_car.drive()

______
>>> deneros_car.drive()

______
>>> deneros_car.fill_gas()

______
>>> deneros_car.gas

______
>>> Car.gas

______
>>> deneros_car = Car('Tesla', 'Model S')
>>> deneros_car.wheels = 2
>>> deneros_car.wheels

______
>>> Car.num_wheels

______
>>> deneros_car.drive()

______
>>> Car.drive()

______
>>> Car.drive(deneros_car)

______
>>> deneros_car = MonsterTruck('Monster', 'Batmobile')
>>> deneros_car.drive()

______
>>> Car.drive(deneros_car)

______
>>> MonsterTruck.drive(deneros_car)

______
>>> Car.rev(deneros_car)

______
```

```bash

What would Python display? If you get stuck, try it out in the Python
interpreter!

>>> from car import *
>>> deneros_car = Car('Tesla', 'Model S')
>>> deneros_car.model
? Model S
-- Not quite. Try again! --

? 'Model S'
-- OK! --

>>> deneros_car.gas = 10
>>> deneros_car.drive()
? Tesla Model S goes vroom!
-- Not quite. Try again! --

? 'Tesla Model S goes vroom!'
-- OK! --

>>> deneros_car.drive()
? 'Cannot drive'
-- Not quite. Try again! --

? 'Cannot drive!'
-- OK! --

>>> deneros_car.fill_gas()
? 'Gas level: 20'
-- OK! --

>>> deneros_car.gas
? 20
-- OK! --

>>> Car.gas
? 30
-- OK! --

---------------------------------------------------------------------
Car > Suite 1 > Case 2
(cases remaining: 2)

What would Python display? If you get stuck, try it out in the Python
interpreter!

>>> from car import *
>>> deneros_car = Car('Tesla', 'Model S')
>>> deneros_car.wheels = 2
>>> deneros_car.wheels
? 2
-- OK! --

>>> Car.num_wheels
? 4
-- OK! --

>>> deneros_car.drive() # Type Error if an error occurs and Nothing if nothing is displayed
? 'Cannot drive'
-- Not quite. Try again! --

? 'Cannot drive!'
-- OK! --

>>> Car.drive() # Type Error if an error occurs and Nothing if nothing is displayed
? Nothing
-- Not quite. Try again! --

? Error
-- OK! --

>>> Car.drive(deneros_car) # Type Error if an error occurs and Nothing if nothing is displayed
? 'Cannot drive!'
-- OK! --

---------------------------------------------------------------------
Car > Suite 1 > Case 3
(cases remaining: 1)

What would Python display? If you get stuck, try it out in the Python
interpreter!

>>> from car import *
>>> deneros_car = MonsterTruck('Monster', 'Batmobile')
>>> deneros_car.drive() # Type Error if an error occurs and Nothing if nothing is displayed
(line 1)? Vroom! This Monster Truck is huge!
(line 2)? 'Monster Batmobile goes vroom!'
-- OK! --

>>> Car.drive(deneros_car) # Type Error if an error occurs and Nothing if nothing is displayed
? 'Monster Batmobile goes vroom!'
-- OK! --

>>> MonsterTruck.drive(deneros_car) # Type Error if an error occurs and Nothing if nothing is displayed
(line 1)? Vroom! This Monster Truck is huge!
(line 2)? 'Monster Batmobile goes vroom!'
-- OK! --

>>> Car.rev(deneros_car) # Type Error if an error occurs and Nothing if nothing is displayed
? Vroom! This Monster Truck is huge!
-- Not quite. Try again! --

? Error
-- OK! --

---------------------------------------------------------------------
OK! All cases for Car unlocked.
```

## Parsons Problems

To work on these problems, open the Parsons editor:

```plaintext
python3 parsons
```

### Q2: Cool Cats

The `Cat` class models a cat: you can find the implementation below. Now, you will implement `NoisyCat`; `NoisyCat`s are very similar to `Cat`s, but `talk`s twice as much. However, in exchange for such great powers, it gives up one of its initial `lives`.

Use superclass methods wherever possible.

```python
class Cat:
    def __init__(self, name, owner, lives=9):
        self.is_alive = True
        self.name = name
        self.owner = owner
        self.lives = lives

    def talk(self):
        return self.name + ' says meow!'

class NoisyCat(Cat):
    """
    >>> my_cat = NoisyCat("Furball", "James")
    >>> my_cat.name
    'Furball'
    >>> my_cat.is_alive
    True
    >>> my_cat.lives
    8
    >>> my_cat.talk()
    'Furball says meow! Furball says meow!'
    >>> friend_cat = NoisyCat("Tabby", "James", 2)
    >>> friend_cat.talk()
    'Tabby says meow! Tabby says meow!'
    >>> friend_cat.lives
    1
    """
    def __init__(self, name, owner, lives=9):
        Cat.__init__(self, name, owner, lives)
        self.lives -= 1
        
    def talk(self):
        words = Cat.talk(self)
        words = words + ' ' + words
        return words
```

## Coding Practice

### Q3: Cat Adoption

So far, you’ve implemented the `NoisyCat` based off of the `Cat` class. However, you now want to be able to create lots of different `Cat`s!

Build on the `Cat` class from the earlier problem by adding a **class method** called `adopt_a_cat`. This class method allows you to create `Cat`s that can then be adopted.

Specifically, `adopt_a_cat` should return a new instance of a `Cat` whose owner is `owner`.

This `Cat` instance’s name and number of lives depends on the `owner`. Its name should be chosen from `cat_names` (provided in the skeleton code), and should correspond to the name at the index `len(owner)` `%` (modulo) the number of possible cat names. Its number of lives should be equal to `len(owner)` + the length of the chosen name.

```python
class Cat:
    def __init__(self, name, owner, lives=9):
        self.is_alive = True
        self.name = name
        self.owner = owner
        self.lives = lives

    def talk(self):
        return self.name + ' says meow!'

    @classmethod
    def adopt_a_cat(cls, owner):
        """
        Returns a new instance of a Cat.

        This instance's owner is the given owner.
        Its name and its number of lives is chosen programatically
        based on the spec's noted behavior.

        >>> cat1 = Cat.adopt_a_cat("Ifeoma")
        >>> isinstance(cat1, Cat)
        True
        >>> cat1.owner
        'Ifeoma'
        >>> cat1.name
        'Felix'
        >>> cat1.lives
        11
        >>> cat2 = Cat.adopt_a_cat("Ay")
        >>> cat2.owner
        'Ay'
        >>> cat2.name
        'Grumpy'
        >>> cat2.lives
        8
        """
        cat_names = ["Felix", "Bugs", "Grumpy"]
        "*** YOUR CODE HERE ***"
        cat_name = cat_names[len(owner) % 3]
        lives = len(owner) + len(cat_name)
        return cls(cat_name, owner, lives)
```

Use Ok to test your code:

```plaintext
python3 ok -q Cat.adopt_a_cat✂️
```

### Accounts

Let’s say we’d like to model a bank account that can handle interactions such as depositing funds or gaining interest on current funds. In the following questions, we will be building off of the `Account` class. Here’s our current definition of the class:

```plaintext
class Account:
    """An account has a balance and a holder.
    >>> a = Account('John')
    >>> a.deposit(10)
    10
    >>> a.balance
    10
    >>> a.interest
    0.02
    >>> a.time_to_retire(10.25) # 10 -> 10.2 -> 10.404
    2
    >>> a.balance               # balance should not change
    10
    >>> a.time_to_retire(11)    # 10 -> 10.2 -> ... -> 11.040808032
    5
    >>> a.time_to_retire(100)
    117
    """
    max_withdrawal = 10
    interest = 0.02

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

    def deposit(self, amount):
        self.balance = self.balance + amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            return "Insufficient funds"
        if amount > self.max_withdrawal:
            return "Can't withdraw that amount"
        self.balance = self.balance - amount
        return self.balance
```

### Q4: Retirement

Add a `time_to_retire` method to the `Account` class. This method takes in an `amount` and returns how many years the holder would need to wait in order for the current `balance` to grow to at least `amount`, assuming that the bank adds `balance` times the `interest` rate to the total balance at the end of every year.

```python
def time_to_retire(self, amount):
    """Return the number of years until balance would grow to amount."""
    assert self.balance > 0 and amount > 0 and self.interest > 0
    "*** YOUR CODE HERE ***"
    cnt = 0
    deposit = self.balance * ((1 + self.interest) ** cnt)
    while deposit < amount:
        cnt = cnt + 1
        deposit = self.balance * ((1 + self.interest) ** cnt)
    return cnt
```

Use Ok to test your code:

```plaintext
python3 ok -q Account✂️
```

### Q5: FreeChecking

Implement the `FreeChecking` class, which is like the `Account` class from lecture except that it charges a withdraw fee after 2 withdrawals. If a withdrawal is unsuccessful, it still counts towards the number of free withdrawals remaining, but no fee for the withdrawal will be charged.

> **Hint**: Don’t forget that `FreeChecking` inherits from `Account`! Check the Inheritance section in Topics for a refresher.

```python
class FreeChecking(Account):
    """A bank account that charges for withdrawals, but the first two are free!
    >>> ch = FreeChecking('Jack')
    >>> ch.balance = 20
    >>> ch.withdraw(100)  # First one's free
    'Insufficient funds'
    >>> ch.withdraw(3)    # And the second
    17
    >>> ch.balance
    17
    >>> ch.withdraw(3)    # Ok, two free withdrawals is enough
    13
    >>> ch.withdraw(3)
    9
    >>> ch2 = FreeChecking('John')
    >>> ch2.balance = 10
    >>> ch2.withdraw(3) # No fee
    7
    >>> ch.withdraw(3)  # ch still charges a fee
    5
    >>> ch.withdraw(5)  # Not enough to cover fee + withdraw
    'Insufficient funds'
    """
    withdraw_fee = 1
    free_withdrawals = 2

    "*** YOUR CODE HERE ***"
    def __init__(self, Account):
        Account.__init__(self)

    def withdraw(self, amount):
        if amount + self.withdraw_fee > self.balance:
            return "Insufficient funds"
        if amount > self.max_withdrawal:
            return "Can't withdraw that amount"
        
        
        if self.free_withdrawals > 0: 
            self.free_withdrawals -= 1
        
        self.balance = self.balance - amount
        if self.free_withdrawals <= 0:
            self.balance = self.balance - self.withdraw_fee
        
        return self.balance
```

Use Ok to test your code:

```plaintext
python3 ok -q FreeChecking✂️
```

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```
