---
title: CS61A Proj 0
date: '2022-07-23T05:35:16.000Z'
updated: '2022-07-30T04:10:27.000Z'
tags:
  - CS61A
categories: []
slug: 2022/07/23/CS61A-Proj-0
oldUrl: /2022/07/23/CS61A-Proj-0/
excerpt: >-
  My Professor’s deck doesn’t have pathetic cards. But it does have this! Note:
  This project is an optional extra credit opportunity. The goals of this are to
  practice object oriente...
---
# Project 0: (Extra Credit) Magic: the Lambda-ing [lambdaing.zip](https://inst.eecs.berkeley.edu/~cs61a/sp22/proj/lambdaing/lambdaing.zip)

> My Professor’s deck  
> doesn’t have pathetic cards.  
> But it does have this!

## Introduction

> **Note:** This project is an optional extra credit opportunity. The goals of this are to practice object oriented programming as well as to try implementing a shorter game than some of the other projects in the course. You can get 2 bonus points by submitting the entire project by Friday, April 1.

## Download starter files

To get started, download all of the project code as a [zip archive](https://inst.eecs.berkeley.edu/~cs61a/sp22/proj/lambdaing/lambdaing.zip).

## About the Game

In this project, we will be implementing a card game! This game is inspired by the similarly named [Magic: The Gathering](https://en.wikipedia.org/wiki/Magic:_The_Gathering).

### Rules of the Game

This game is a little involved, though not nearly as much as its namesake. Here’s how it goes:

There are two players. Each player has a hand of cards and a deck, and at the start of each round, each player draws a random card from their deck. If a player’s deck is empty when they try to draw, they will automatically lose the game.

Cards have a name, an attack value, and a defense value. Each round, each player chooses one card to play from their own hands. Once both players have chosen a card, the cards’ *power* stats are then calculated and compared. The card with the higher power wins the round. Each played card’s power value is calculated as follows:

```plaintext
(player card's attack) - (opponent card's defense)
```

For example, let’s say Player 1 plays a card with 2000 attack and 1000 defense and Player 2 plays a card with 1500 attack and 3000 defense. Their cards’ powers are calculated as:

```plaintext
P1: 2000 - 3000 = 2000 - 3000 = -1000
P2: 1500 - 1000 = 1500 - 1000 = 500
```

So Player 2 would win this round.

The first player to win 8 rounds wins the match!

### Special Effects

To make the game more interesting, we will add special effects to our cards. A card can be of type AI, Tutor, TA, or Instructor, and each type has a different *effect* when they are played. All effects are applied before power is calculated during that round:

- An `AI` card will allow you to add the top two cards of your deck to your hand via drawing.
- A `Tutor` card will add a copy of the first card in your hand to your hand, at the cost of losing the current round.
- A `TA` card discards the card with the highest `power` in your hand, and add the discarded card’s attack and defense to its own respective stats.
- An `Instructor` card can survive multiple rounds, as long as it has a non-negative `power`. However, at the beginning of the round, its attack and defense are reduced by 1000 each.

This game uses several different files.

- Code for all questions can be found in `classes.py`.
- The game loop can be found in `cardgame.py`, and is responsible for running the game. You won’t need to open or read this file to receive full credit.
- If you want to modify your game later to add your own custom cards and decks, you can look in `cards.py` to see all the standard cards and the default deck; here, you can add more cards and change what decks you and your opponent use. If you’re familiar with the original game, you may notice the cards were not created with balance in mind, so feel free to modify the stats and add or remove cards as desired.

Once you’ve implemented the game, you can start it by typing:

```plaintext
python3 cardgame.py
```

While playing the game, you can exit it and return to the command line with `Ctrl-C` or `Ctrl-D`.

Feel free to refer back to these series of rules later on, and let’s start making the game!

## Logistics

The project is worth 2 extra credit points based on correctness.

You will turn in the following files:

- `classes.py`

You do not need to modify or turn in any other files to complete the project. To submit the project, run the following command:

```plaintext
python3 ok --submit
```

You will be able to view your submissions on the [Ok dashboard](http://ok.cs61a.org/).

For the functions that we ask you to complete, there may be some initial code that we provide. If you would rather not use that code, feel free to delete it and start from scratch. You may also add new function definitions as you see fit.

**However, please do not modify any other functions or edit any files not listed above**. Doing so may result in your code failing our autograder tests. Also, please do not change any function signatures (names, argument order, or number of arguments).

Throughout this project, you should be testing the correctness of your code. It is good practice to test often, so that it is easy to isolate any problems. However, you should not be testing *too* often, to allow yourself time to think through problems.

We have provided an **autograder** called `ok` to help you with testing your code and tracking your progress. The first time you run the autograder, you will be asked to **log in with your Ok account using your web browser**. Please do so. Each time you run `ok`, it will back up your work and progress on our servers.

The primary purpose of `ok` is to test your implementations.

We recommend that you submit **after you finish each problem**. Only your last submission will be graded. It is also useful for us to have more backups of your code in case you run into a submission issue. **If you forget to submit, your last backup will be automatically converted to a submission.**

If you do not want us to record a backup of your work or information about your progress, you can run

```plaintext
python3 ok --local
```

With this option, no information will be sent to our course servers. If you want to test your code interactively, you can run

```plaintext
python3 ok -q [question number] -i 
```

with the appropriate question number (e.g. `01`) inserted. This will run the tests for that question until the first one you failed, then give you a chance to test the functions you wrote interactively.

You can also use the debugging print feature in OK by writing

```plaintext
print("DEBUG:", x) 
```

which will produce an output in your terminal without causing OK tests to fail with extra output.

## Part 1: Basic Game

Before attempting any of the following questions, be sure to look at the `Deck` class included at the bottom of `classes.py`. A central mechanic of the game is manipulating the player’s deck of available cards; many methods of the `Deck` class will prove to be useful throughout the project.

### Q1: Making Cards

To play a card game, we’re going to need to have cards, so let’s make some! We’re gonna implement the basics of the `Card` class first.

First, implement the `Card` class constructor in `classes.py`. This constructor takes three arguments:

- a string as the `name` of the card
- an integer as the `attack` value of the card
- an integer as the `defense` value of the card

Each `Card` instance should keep track of these values using instance attributes called `name`, `attack`, and `defense`.

You should also implement the `power` method in `Card`, which takes in another card as an input and calculates the current card’s power. Refer to the [Rules of the Game](https://inst.eecs.berkeley.edu/~cs61a/sp22/proj/lambdaing/#rules-of-the-game) if you’d like a refresher on how power is calculated.

Use Ok to test your code:

```plaintext
python3 ok -q Card.__init__
python3 ok -q Card.power✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 1’s questions will be considered together under a different `ok` test, which is included at the end of the section.

### Q2: Making a Player

Now that we have cards, we can make a deck, but we still need players to actually use them. We’ll now fill in the implementation of the `Player` class.

A `Player` instance has three instance attributes:

- `name` is the player’s name. When you play the game, you can enter your name, which will be converted into a string to be passed to the constructor.
- `deck` is an instance of the `Deck` class. You can draw from it using its `.draw()` method.
- `hand` is a list of `Card` instances. Each player should start with 5 cards in their hand, drawn from their `deck`. Each card in the hand can be selected by its index in the list during the game. When a player draws a new card from the deck, it is added to the end of this list.

Complete the implementation of the constructor for `Player` so that `self.hand` is set to a list of 5 cards drawn from the player’s `deck`.

Next, implement the `draw` and `play` methods in the `Player` class. The `draw` method draws a card from the deck and adds it to the player’s hand. The `play` method removes and returns a card from the player’s hand at the given index.

> Hint: use class methods wherever possible when attempting to draw from the `deck` when implementing `Player.__init__` and `Player.draw`.

Use Ok to test your code:

```plaintext
python3 ok -q Player.__init__
python3 ok -q Player.draw
python3 ok -q Player.play✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 1’s questions will be considered together under a different `ok` test, which is included at the end of the section.

After you complete this problem, you have finished Part 1, and you’ll be able to play a working version of the game!

Use Ok to test your code:

```plaintext
python3 ok -q 01✂️
```

Additionally, type:

```plaintext
python3 cardgame.py
```

to start a game of Magic: The Lambda-ing!

This version doesn’t have the effects for different cards yet. In the next part, we’ll be implementing effects for the various cards.

## Part 2: Card Effects

To make the card game more interesting, let’s add effects to our cards! We can do this by implementing an `effect` function for each card class, which takes in the opponent card, the current player, and the opponent player.

You can find the following questions in `classes.py`.

> **Important:** For the following sections, do **not** overwrite any lines denoted under `You should add your implementation above this`. In addition, there are pre-designated variables in certain `effect` methods which are used to determine when to print text. Be sure to set the variables to the correct values in your implementation, such that the text is printed when the effect occurs.

### Q3: AIs: Resourceful Resources

In the `AICard` class, implement the `effect` method for AIs. An `AICard` will allow you to add the top two cards of your deck to your hand via `draw`ing from your deck.

Use Ok to test your code:

```plaintext
python3 ok -q AICard.effect✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 2’s questions will be considered together under a different `ok` test, which is included at the end of the section.

### Q4: Tutors: Sneaky Search

In the `TutorCard` class, implement the `effect` method for Tutors. A `TutorCard` will add a copy of the first card in your hand to your hand, at the cost of losing the current round. Note that if there are no cards in hand, a `TutorCard` will not add any cards to the hand, but must still lose the round.

> To implement the “losing” functionality, it is sufficient to override `TutorCard`’s `power` method to return `-float('inf')`. In addition, be sure to add copies of cards, instead of the chosen card itself! Class methods may come in handy.

Use Ok to test your code:

```plaintext
python3 ok -q TutorCard.effect✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 2’s questions will be considered together under a different `ok` test, which is included at the end of the section.

### Q5: TAs: Power Transfer

In the `TACard` class, implement the `effect` method for TAs. A `TACard` discards the card with the highest `power` in your hand, and add the discarded card’s attack and defense to its own respective stats. **Discarding** a card removes the card from your `hand`. If there are no cards in hand, the `TACard` should not do anything for its effect.

Use Ok to test your code:

```plaintext
python3 ok -q TACard.effect✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 2’s questions will be considered together under a different `ok` test, which is included at the end of the section.

### Q6: Instructors: Immovable

In the `InstructorCard` class, implement the `effect` method for Instructors. An `InstructorCard` can survive multiple rounds, as long as it has a non-negative `attack` or `defense` at the end of a round. However, at the beginning of the round, its attack and defense are permanently reduced by 1000 each.

> To implement the “survive” functionality, the `InstructorCard` should re-add itself to the player’s hand.

Use Ok to test your code:

```plaintext
python3 ok -q InstructorCard.effect✂️
```

> For this mini-project, we provide doctests to incrementally test your code; note that the Part 2’s questions will be considered together under a different `ok` test, which is included at the end of the section.

After you complete this problem, you’ll have a fully functional game of Magic: The Lambda-ing!

Use Ok to test your code:

```plaintext
python3 ok -q 02✂️
```

Additionally, type:

```plaintext
python3 cardgame.py
```

to start a game.

This doesn’t have to be the end, though; we encourage you to get creative with more card types, effects, and even adding more custom cards to your deck!

## Submit

Make sure to submit this assignment by running:

```plaintext
python3 ok --submit
```

## Code

```python
# Magic the Lambda-ing!

import random


class Card:
    cardtype = 'Staff'

    def __init__(self, name, attack, defense):
        """
        Create a Card object with a name, attack,
        and defense.
        >>> staff_member = Card('staff', 400, 300)
        >>> staff_member.name
        'staff'
        >>> staff_member.attack
        400
        >>> staff_member.defense
        300
        >>> other_staff = Card('other', 300, 500)
        >>> other_staff.attack
        300
        >>> other_staff.defense
        500
        """
        # BEGIN Problem 1
        self.name = name
        self.attack = attack
        self.defense = defense
        # END Problem 1

    def power(self, opponent_card):
        """
        Calculate power as:
        (player card's attack) - (opponent card's defense)
        >>> staff_member = Card('staff', 400, 300)
        >>> other_staff = Card('other', 300, 500)
        >>> staff_member.power(other_staff)
        -100
        >>> other_staff.power(staff_member)
        0
        >>> third_card = Card('third', 200, 400)
        >>> staff_member.power(third_card)
        0
        >>> third_card.power(staff_member)
        -100
        """
        # BEGIN Problem 1
        return self.attack - opponent_card.defense
        # END Problem 1

    def effect(self, opponent_card, player, opponent):
        """
        Cards have no default effect.
        """
        return

    def __repr__(self):
        """
        Returns a string which is a readable version of
        a card, in the form:
        <cardname>: <cardtype>, [<attack>, <defense>]
        """
        return '{}: {}, [{}, {}]'.format(self.name, self.cardtype, self.attack, self.defense)

    def copy(self):
        """
        Returns a copy of this card.
        """
        return Card(self.name, self.attack, self.defense)


class Player:
    def __init__(self, deck, name):
        """Initialize a Player object.
        A Player starts the game by drawing 5 cards from their deck. Each turn,
        a Player draws another card from the deck and chooses one to play.
        >>> test_card = Card('test', 100, 100)
        >>> test_deck = Deck([test_card.copy() for _ in range(6)])
        >>> test_player = Player(test_deck, 'tester')
        >>> len(test_deck.cards)
        1
        >>> len(test_player.hand)
        5
        """
        self.deck = deck
        self.name = name
        self.hand = []
        # BEGIN Problem 2
        for _ in range(5):
            self.hand.append(self.deck.draw())
        
        # END Problem 2

    def draw(self):
        """Draw a card from the player's deck and add it to their hand.
        >>> test_card = Card('test', 100, 100)
        >>> test_deck = Deck([test_card.copy() for _ in range(6)])
        >>> test_player = Player(test_deck, 'tester')
        >>> test_player.draw()
        >>> len(test_deck.cards)
        0
        >>> len(test_player.hand)
        6
        """
        assert not self.deck.is_empty(), 'Deck is empty!'
        # BEGIN Problem 2
        self.hand.append(self.deck.draw())
        # END Problem 2

    def play(self, index):
        """Remove and return a card from the player's hand at the given INDEX.
        >>> from cards import *
        >>> test_player = Player(standard_deck, 'tester')
        >>> ta1, ta2 = TACard("ta_1", 300, 400), TACard("ta_2", 500, 600)
        >>> tutor1, tutor2 = TutorCard("t1", 200, 500), TutorCard("t2", 600, 400)
        >>> test_player.hand = [ta1, ta2, tutor1, tutor2]
        >>> test_player.play(0) is ta1
        True
        >>> test_player.play(2) is tutor2
        True
        >>> len(test_player.hand)
        2
        """
        # BEGIN Problem 2
        
        tmp = self.hand[index]
        self.hand.remove(self.hand[index])
        return tmp
        # END Problem 2

    def display_hand(self):
        """
        Display the player's current hand to the user.
        """
        print('Your hand:')
        for card_index, displayed_card in zip(range(len(self.hand)), [str(card) for card in self.hand]):
            indent = ' ' * (5 - len(str(card_index)))
            print(card_index, indent + displayed_card)

    def play_random(self):
        """
        Play a random card from hand.
        """
        return self.play(random.randrange(len(self.hand)))


class AICard(Card):
    cardtype = 'AI'

    def effect(self, opponent_card, player, opponent):
        """
        Add the top two cards of your deck to your hand via drawing.

        >>> from cards import *
        >>> player1, player2 = Player(player_deck, 'p1'), Player(opponent_deck, 'p2')
        >>> opponent_card = Card("other", 500, 500)
        >>> test_card = AICard("AI Card", 500, 500)
        >>> initial_deck_length = len(player1.deck.cards)
        >>> initial_hand_size = len(player1.hand)
        >>> test_card.effect(opponent_card, player1, player2)
        AI Card allows me to draw two cards!
        >>> initial_hand_size == len(player1.hand) - 2
        True
        >>> initial_deck_length == len(player1.deck.cards) + 2
        True
        """
        # BEGIN Problem 3
        player.draw()
        player.draw()
        # END Problem 3
        # You should add your implementation above this.
        print(f"{self.name} allows me to draw two cards!")

    def copy(self):
        """
        Create a copy of this card.
        """
        return AICard(self.name, self.attack, self.defense)


class TutorCard(Card):
    cardtype = 'Tutor'
    
    def power(self, opponent_card):
        """
        Power is the same as original card.
        """
        return -float('inf')

    def effect(self, opponent_card, player, opponent):
        """
        Add a copy of the first card in your hand
        to your hand, at the cost of losing the current
        round. If there are no cards in hand, this card does
        not add any cards, but still loses the round. To
        implement the second part of this effect, a Tutor
        card's power should be less than all non-Tutor cards.

        >>> from cards import *
        >>> player1, player2 = Player(player_deck, 'p1'), Player(opponent_deck, 'p2')
        >>> opponent_card = Card("other", 500, 500)
        >>> test_card = TutorCard("Tutor Card", 10000, 10000)
        >>> player1.hand = [Card("card1", 0, 100), Card("card2", 100, 0)]
        >>> test_card.effect(opponent_card, player1, player2)
        Tutor Card allows me to add a copy of a card to my hand!
        >>> print(player1.hand)
        [card1: Staff, [0, 100], card2: Staff, [100, 0], card1: Staff, [0, 100]]
        >>> player1.hand[0] is player1.hand[2] # must add a copy!
        False
        >>> player1.hand = []
        >>> test_card.effect(opponent_card, player1, player2)
        >>> print(player1.hand) # must not add a card if not available
        []
        >>> test_card.power(opponent_card) < opponent_card.power(test_card)
        True
        """
        # BEGIN Problem 4
        added = player.hand[0] if len(player.hand) > 0 else None
        if added:
            player.hand.append(added.copy())
        # END Problem 4
        # You should add your implementation above this.
        if added:
            print(f"{self.name} allows me to add a copy of a card to my hand!")

    def copy(self):
        """
        Create a copy of this card.
        """
        return TutorCard(self.name, self.attack, self.defense)


class TACard(Card):
    cardtype = 'TA'

    def effect(self, opponent_card, player, opponent, arg=None):
        """
        Discard the card with the highest `power` in your hand,
        and add the discarded card's attack and defense
        to this card's own respective stats.

        >>> from cards import *
        >>> player1, player2 = Player(player_deck, 'p1'), Player(opponent_deck, 'p2')
        >>> opponent_card = Card("other", 500, 500)
        >>> test_card = TACard("TA Card", 500, 500)
        >>> player1.hand = []
        >>> test_card.effect(opponent_card, player1, player2) # if no cards in hand, no effect.
        >>> print(test_card.attack, test_card.defense)
        500 500
        >>> player1.hand = [Card("card1", 0, 100), TutorCard("tutor", 10000, 10000), Card("card3", 100, 0)]
        >>> test_card.effect(opponent_card, player1, player2) # must use card's power method.
        TA Card discards card3 from my hand to increase its own power!
        >>> print(player1.hand)
        [card1: Staff, [0, 100], tutor: Tutor, [10000, 10000]]
        >>> print(test_card.attack, test_card.defense)
        600 500
        """
        # BEGIN Problem 5
        best_card = None
        for card in player.hand:
            if best_card is None or card.power(opponent_card) > best_card.power(opponent_card):
                best_card = card
        
        if best_card:
            player.hand.remove(best_card)
            self.attack += best_card.attack
        
        # END Problem 5
        if best_card:
            print(f"{self.name} discards {best_card.name} from my hand to increase its own power!")

    def copy(self):
        """
        Create a copy of this card.
        """
        return TACard(self.name, self.attack, self.defense)


class InstructorCard(Card):
    cardtype = 'Instructor'

    def effect(self, opponent_card, player, opponent, arg=None):
        """
        Survives multiple rounds, as long as it has a non-negative
        attack or defense at the end of a round. At the beginning of the round,
        its attack and defense are permanently reduced by 1000 each.
        If this card would survive, it is added back to the hand.

        >>> from cards import *
        >>> player1, player2 = Player(player_deck, 'p1'), Player(opponent_deck, 'p2')
        >>> opponent_card = Card("other", 500, 500)
        >>> test_card = InstructorCard("Instructor Card", 1000, 1000)
        >>> player1.hand = [Card("card1", 0, 100)]
        >>> test_card.effect(opponent_card, player1, player2)
        Instructor Card returns to my hand!
        >>> print(player1.hand) # survives with non-negative attack
        [card1: Staff, [0, 100], Instructor Card: Instructor, [0, 0]]
        >>> player1.hand = [Card("card1", 0, 100)]
        >>> test_card.effect(opponent_card, player1, player2)
        >>> print(player1.hand)
        [card1: Staff, [0, 100]]
        >>> print(test_card.attack, test_card.defense)
        -1000 -1000
        """
        # BEGIN Problem 6
        readd = None
    
        self.attack -= 1000
        self.defense -= 1000
    
        if self.attack >= 0 and self.defense >= 0:
            readd = self.copy()
        
        if readd:
            player.hand.append(readd)
        # END Problem 6
        # You should add your implementation above this.
        if readd:
            print(f"{self.name} returns to my hand!")

    def copy(self):
        return InstructorCard(self.name, self.attack, self.defense)


########################################
# Do not edit anything below this line #
########################################

class Deck:
    def __init__(self, cards):
        """
        With a list of cards as input, create a deck.
        This deck should keep track of the cards it contains, and
        we should be able to draw from the deck, taking a random
        card out of it.
        """
        self.cards = cards

    def draw(self):
        """
        Draw a random card and remove it from the deck.
        """
        assert self.cards, 'The deck is empty!'
        rand_index = random.randrange(len(self.cards))
        return self.cards.pop(rand_index)

    def is_empty(self):
        return len(self.cards) == 0

    def copy(self):
        """
        Create a copy of this deck.
        """
        return Deck([card.copy() for card in self.cards])


class Game:
    win_score = 8

    def __init__(self, player1, player2):
        """
        Initialize a game of <REPLACE NAME>.
        """
        self.player1, self.player2 = player1, player2
        self.p1_score = 0
        self.p2_score = 0

    def play_round(self, p1_card, p2_card):
        """
        After each player picks a card, play them against
        each other.
        """
        p1_card.effect(p2_card, self.player1, self.player2)
        p2_card.effect(p1_card, self.player2, self.player1)
        p1_power = p1_card.power(p2_card)
        p2_power = p2_card.power(p1_card)
        if p1_power > p2_power:
            # Player 1 wins the round.
            self.p1_score += 1
            result = 'won'
        elif p2_power > p1_power:
            # Player 2 wins the round.
            self.p2_score += 1
            result = 'lost'
        else:
            # This round is a draw.
            result = 'tied'
        # Display results to user.
        print('You {} this round!'.format(result))
        print('{}\'s card: {}; Power: {}'.format(self.player1.name, p1_card, p1_power))
        print('Opponent\'s card: {}; Power: {}'.format(p2_card, p2_power))

    def game_won(self):
        """
        Check if the game is won and, if so,
        which player won.
        """
        if self.p1_score < self.win_score and self.p2_score < self.win_score:
            return 0
        return 1 if self.p1_score > self.p2_score else 2

    def display_scores(self):
        """
        Display players' scores to the user.
        """
        print('{}\'s score: {}'.format(self.player1.name, self.p1_score))
        print('Opponent\'s score: {}'.format(self.p2_score))

```
