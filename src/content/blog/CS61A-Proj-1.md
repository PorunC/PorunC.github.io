---
title: CS61A Proj 1
date: '2022-05-19T11:24:49.000Z'
updated: '2022-07-23T05:20:14.000Z'
tags:
  - CS61A
categories: []
slug: 2022/05/19/CS61A-Proj-1
oldUrl: /2022/05/19/CS61A-Proj-1/
excerpt: >-
  In Hog, two players alternate turns trying to be the first to end a turn with
  at least 100 total points. On each turn, the current player chooses some
  number of dice to roll, up to...
---
### Rules

In Hog, two players alternate turns trying to be the first to end a turn with at least 100 total points. On each turn, the current player chooses some number of dice to roll, up to 10. That player’s score for the turn is the sum of the dice outcomes. However, a player who rolls too many dice risks:

- **Sow Sad**. If any of the dice outcomes is a 1, the current player’s score for the turn is `1`.

Examples

- *Example 1:* The current player rolls 7 dice, 5 of which are 1’s. They score `1` point for the turn.
- *Example 2:* The current player rolls 4 dice, all of which are 3’s. Since Sow Sad did not occur, they score `12` points for the turn.

In a normal game of Hog, those are all the rules. To spice up the game, we’ll include some special rules:

- **Hefty Hogs**. **If the opponent’s score is 0** and the player chooses to roll zero dice, the player will get 1 point. However, **if the opponent’s score is not 0**, a player who chooses to roll zero dice will gain points according to the following:
  - The opponent’s score will be mapped to a series of functions to be applied to the player’s score, starting from the rightmost digit (the one’s place) and ending on the leftmost digit.
  - Each digit from `0` to `9` corresponds to a pre-defined function, `f0` through `f9`.
  - The result of this series of calls **modulo 30** is the amount of points the player receives for the turn.

Examples

- *Example 1:* The current player has 10 points. The opponent player has 32 points. The functions are applied in this order:

  - The rightmost digit of the opponent’s score is `2`.
  - The corresponding function, `f2`, is applied to `10`.
  - The next digit of the opponent’s score is `3`.
  - The corresponding function, `f3`, is applied to the result of `f2(10)`.
  - The points the current player gains is the result of that call, modulo 30: `f3(f2(10)) % 30`.
- *Example 2:* The current player has 33 points. The opponent player has 5439 points. The functions are applied in this order:

  - The rightmost digit of the opponent’s score is `9`.
  - The corresponding function,`f9`, is applied to `33`.
  - And so on:
  - Function `f3` is applied to the result of `f9(33)`.
  - Function `f4` is applied to the result of `f3(f9(33))`.
  - Function `f5` is applied to the result of `f4(f3(f9(33)))`.
  - The points the current player gains is the result of that call, modulo 30: `f5(f4(f3(f9(33)))) % 30`.
- **Hog Pile**. After points for the turn are added to the current player’s score, if the one’s digit (`ones_digit`) of the current player’s score is the same as the one’s digit of the opponent player’s score, the current player gains an additional `ones_digit` points.

Examples

- *Example:*
  - Both players start out at 0. (0, 0)
  - Player 0 rolls 2 dice and gets `5` points. (5, 0)
  - Player 1 rolls 1 dice and gets `5` points. (5, 5) Player 1 gets `5` more points. (5, 10)
  - Player 0 rolls 2 dice and gets `6` points. (11, 10)
  - Player 1 rolls 8 dice and gets `1` point. (11, 11) Player 1 gets `1` more point. (11, 12)

## 游戏规则

在 Hog 游戏中，两个玩家轮流尝试成为第一个以至少100分的总分结束一回合的人。在每个回合中，当前的玩家会选择一定数量的骰子来掷出，最多为10。该玩家在该回合的得分是骰子结果的总和。然而，一个玩家如果掷出太多的骰子，就会有风险。

**Sow Sad**. 如果任何一个骰子的结果是1，那么当前玩家在这一回合的得分就是1。

- 例1：当前玩家掷出7个骰子，其中5个是1。他们在这一回合的得分是1分。
- 例2：当前玩家掷出4颗骰子，全部是3。由于 **Sow Sad** 没有发生，他们这一局得12分。

在一个正常的霍格游戏中，这些就是所有的规则。为了增加游戏的趣味性，我们会加入一些特殊的规则。

**Hefty Hogs**. 如果对手的分数是0，而玩家选择掷出0个骰子，玩家将得到1分。然而，如果对手的分数不是0，选择掷零骰子的玩家将按照以下方式获得分数:

- 对手的分数将被映射成一系列的函数，应用于玩家的分数，从最右边的数字（一的位置）开始，到最左边的数字结束。
- 从0到9的每个数字都对应着一个预定义的函数，f0到f9。
- 这一系列调用modulo 30的结果就是玩家在这一回合获得的分数。

例1：当前玩家有10分。对方棋手有32分。这些函数是按照这个顺序来应用的。

- 对方分数的最右边的数字是2。
- 相应的函数，$f2$ ，被应用于10。
- 对手得分的下一个数字是3。
- 相应的函数 $f3$ 被应用于 $f2(10)$ 的结果。
- 当前玩家获得的分数是该调用的结果，模数为30：$f3(f2(10)) % 30$

例2：当前棋手有33分。对方棋手有5439分。这些函数是按照这个顺序来应用的

- 对方分数的最右边的数字是9。
- 相应的函数 $f9$ 被应用于33。
- 以此类推。
- 函数 $f3$ 被应用于 $f9(33)$ 的结果。
- 函数 $f4$ 被应用于 $f3(f9(33))$ 的结果。
- 函数 $f5$ 被应用于 $f4(f3(f9(33)))$ 的结果。
- 当前玩家获得的点数是该调用的结果，模数为30：$f5(f4(f3(f9(33)))) % 30$ 。

**Hog Pile**.在本回合的分数加到当前棋手的分数之后，如果当前棋手的分数的一位数 $(ones\_digit)$ 与对手棋手的分数的一位数相同，当前棋手就会获得额外的一位数的分数。

例子

- 双方玩家的起点都是0。
- 玩家0掷出2个骰子，得到5分。$(5, 0)$
- 玩家1掷1个骰子，得到5分。$(5, 5)$ 玩家1又得到5分。$(5, 10)$
- 玩家0掷出2个骰子，得到6分。$(11, 10)$
- 玩家1掷出8个骰子，得到1分。$(11, 11)$ 玩家1又得到1分。$(11, 12)$

## Code

```python
"""CS 61A Presents The Game of Hog."""

from dice import six_sided, four_sided, make_test_dice
from ucb import main, trace, interact

GOAL_SCORE = 100  # The goal of Hog is to score 100 points.

######################
# Phase 1: Simulator #
######################


def roll_dice(num_rolls, dice=six_sided):
    """Simulate rolling the DICE exactly NUM_ROLLS > 0 times. Return the sum of
    the outcomes unless any of the outcomes is 1. In that case, return 1.

    num_rolls:  The number of dice rolls that will be made.
    dice:       A function that simulates a single dice roll outcome.
    """
    # These assert statements ensure that num_rolls is a positive integer.
    assert type(num_rolls) == int, 'num_rolls must be an integer.'
    assert num_rolls > 0, 'Must roll at least once.'
    # BEGIN PROBLEM 1
    occur_1 = False
    cnt = 0
    for _ in range(num_rolls):
        cur = dice()
        cnt += cur
        if cur == 1:
            occur_1 = True
    if occur_1:
        cnt = 1
    return cnt
    # END PROBLEM 1


def digit_fn(digit):
    """Return the corresponding function for the given DIGIT.

    value:  The value which this function starts at.
    """
    # Error if DIGIT is not one of: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    assert isinstance(digit, int) and 0 <= digit < 10
    # List of pre-defined functions
    f0 = lambda value: value + 1
    f1 = lambda value: value ** 2
    f2 = lambda value: value * 3
    f3 = lambda value: value // 4
    f4 = lambda value: value - 5
    f5 = lambda value: value % 6
    f6 = lambda value: int((value % 7) * 8)
    f7 = lambda value: int(value * 8.8)
    f8 = lambda value: int(value / 99 * 15) + 10
    f9 = lambda value: value
    # Mapping from digit to function
    if digit == 0:
        return f0
    elif digit == 1:
        return f1
    elif digit == 2:
        return f2
    elif digit == 3:
        return f3
    elif digit == 4:
        return f4
    elif digit == 5:
        return f5
    elif digit == 6:
        return f6
    elif digit == 7:
        return f7
    elif digit == 8:
        return f8
    elif digit == 9:
        return f9


def hefty_hogs(player_score, opponent_score):
    """Return the points scored by player due to Hefty Hogs.

    player_score:   The total score of the current player.
    opponent_score: The total score of the other player.
    """
    # BEGIN PROBLEM 2
    res = player_score
    cur = opponent_score
    while cur:
        res = digit_fn(cur % 10)(res)
        cur = cur // 10
    res = res % 30
    return res
    # END PROBLEM 2


def take_turn(num_rolls, player_score, opponent_score, dice=six_sided, goal=GOAL_SCORE):
    """Simulate a turn rolling NUM_ROLLS dice,
    which may be 0 in the case of a player using Hefty Hogs.
    Return the points scored for the turn by the current player.

    num_rolls:       The number of dice rolls that will be made.
    player_score:    The total score of the current player.
    opponent_score:  The total score of the opponent.
    dice:            A function that simulates a single dice roll outcome.
    goal:            The goal score of the game.
    """
    # Leave these assert statements here; they help check for errors.
    assert type(num_rolls) == int, 'num_rolls must be an integer.'
    assert num_rolls >= 0, 'Cannot roll a negative number of dice in take_turn.'
    assert num_rolls <= 10, 'Cannot roll more than 10 dice.'
    assert max(player_score, opponent_score) < goal, 'The game should be over.'
    # BEGIN PROBLEM 3
    if num_rolls == 0:
        if opponent_score == 0:
            return 1
        return hefty_hogs(player_score, opponent_score)
    
    return roll_dice(num_rolls, dice)    
    # END PROBLEM 3


def hog_pile(player_score, opponent_score):
    """Return the points scored by player due to Hog Pile.

    player_score:   The total score of the current player.
    opponent_score: The total score of the other player.
    """
    # BEGIN PROBLEM 4
    if player_score % 10 == opponent_score % 10:
        return player_score % 10
    return 0
    # END PROBLEM 4


def next_player(who):
    """Return the other player, for a player WHO numbered 0 or 1.

    >>> next_player(0)
    1
    >>> next_player(1)
    0
    """
    return 1 - who


def silence(score0, score1, leader=None):
    """Announce nothing (see Phase 2)."""
    return leader, None


def play(strategy0, strategy1, score0=0, score1=0, dice=six_sided,
         goal=GOAL_SCORE, say=silence):
    """Simulate a game and return the final scores of both players, with Player
    0's score first, and Player 1's score second.

    A strategy is a function that takes two total scores as arguments (the
    current player's score, and the opponent's score), and returns a number of
    dice that the current player will roll this turn.

    strategy0:  The strategy function for Player 0, who plays first.
    strategy1:  The strategy function for Player 1, who plays second.
    score0:     Starting score for Player 0
    score1:     Starting score for Player 1
    dice:       A function of zero arguments that simulates a dice roll.
    goal:       The game ends and someone wins when this score is reached.
    say:        The commentary function to call every turn.
    """
    who = 0  # Who is about to take a turn, 0 (first) or 1 (second)
    leader = None  # To be used in problem 7
    msg = None
    # BEGIN PROBLEM 5
    while score0 < goal and score1 < goal:
        if who == 0:
            roll0 = strategy0(score0, score1)
            add0 = take_turn(roll0, score0, score1, dice, goal) 
            score0 += add0
            pile0 = hog_pile(score0, score1)
            score0 += pile0
        else:
            roll1 = strategy1(score1, score0)
            add1 = take_turn(roll1, score1, score0, dice, goal)
            score1 += add1
            pile1 = hog_pile(score1, score0)
            score1 += pile1
            
        leader, msg = say(score0, score1, leader)
        if msg:
            print(msg)
        
        who = next_player(who)
    # END PROBLEM 5
    # (note that the indentation for the problem 7 prompt (***YOUR CODE HERE***) might be misleading)
    # BEGIN PROBLEM 7
    "*** YOUR CODE HERE ***"
    # END PROBLEM 7
    return score0, score1


#######################
# Phase 2: Commentary #
#######################


def say_scores(score0, score1, player=None):
    """A commentary function that announces the score for each player."""
    message = f"Player 0 now has {score0} and now Player 1 has {score1}"
    return player, message


def announce_lead_changes(score0, score1, last_leader=None):
    """A commentary function that announces when the leader has changed.

    >>> leader, message = announce_lead_changes(5, 0)
    >>> print(message)
    Player 0 takes the lead by 5
    >>> leader, message = announce_lead_changes(5, 12, leader)
    >>> print(message)
    Player 1 takes the lead by 7
    >>> leader, message = announce_lead_changes(8, 12, leader)
    >>> print(leader, message)
    1 None
    >>> leader, message = announce_lead_changes(8, 13, leader)
    >>> leader, message = announce_lead_changes(15, 13, leader)
    >>> print(message)
    Player 0 takes the lead by 2
    """
    # BEGIN PROBLEM 6
    if last_leader is None:
        if score0 > score1:
            return 0, f"Player 0 takes the lead by {score0 - score1}"
        elif score0 < score1:
            return 1, f"Player 1 takes the lead by {score1 - score0}"
        else:
            return None, None
    elif last_leader == 0:
        if score0 < score1:
            return 1, f"Player 1 takes the lead by {score1 - score0}"
        elif score0 > score1:
            return 0, None
        else:
            return None, None
    elif last_leader == 1:
        if score0 > score1:
            return 0, f"Player 0 takes the lead by {score0 - score1}"
        elif score0 < score1:
            return 1, None
        else:
            return None, None
        
    # END PROBLEM 6


def both(f, g):
    """A commentary function that says what f says, then what g says.

    >>> say_both = both(say_scores, announce_lead_changes)
    >>> player, message = say_both(10, 0)
    >>> print(message)
    Player 0 now has 10 and now Player 1 has 0
    Player 0 takes the lead by 10
    >>> player, message = say_both(10, 8, player)
    >>> print(message)
    Player 0 now has 10 and now Player 1 has 8
    >>> player, message = say_both(10, 17, player)
    >>> print(message)
    Player 0 now has 10 and now Player 1 has 17
    Player 1 takes the lead by 7
    """
    def say(score0, score1, player=None):
        f_player, f_message = f(score0, score1, player)
        g_player, g_message = g(score0, score1, player)
        if f_message and g_message:
            return g_player, f_message + "\n" + g_message
        else:
            return g_player, f_message or g_message
    return say


#######################
# Phase 3: Strategies #
#######################


def always_roll(n):
    """Return a strategy that always rolls N dice.

    A strategy is a function that takes two total scores as arguments (the
    current player's score, and the opponent's score), and returns a number of
    dice that the current player will roll this turn.

    >>> strategy = always_roll(5)
    >>> strategy(0, 0)
    5
    >>> strategy(99, 99)
    5
    """
    def strategy(score, opponent_score):
        return n
    return strategy


def make_averaged(original_function, total_samples=1000):
    """Return a function that returns the average value of ORIGINAL_FUNCTION
    called TOTAL_SAMPLES times.

    To implement this function, you will have to use *args syntax, a new Python
    feature introduced in this project.  See the project description.

    >>> dice = make_test_dice(4, 2, 5, 1)
    >>> averaged_dice = make_averaged(roll_dice, 1000)
    >>> averaged_dice(1, dice)
    3.0
    """
    # BEGIN PROBLEM 8
    return lambda *args: sum(original_function(*args) for _ in range(total_samples)) / total_samples
    # END PROBLEM 8


def max_scoring_num_rolls(dice=six_sided, total_samples=1000):
    """Return the number of dice (1 to 10) that gives the highest average turn score
    by calling roll_dice with the provided DICE a total of TOTAL_SAMPLES times.
    Assume that the dice always return positive outcomes.

    >>> dice = make_test_dice(1, 6)
    >>> max_scoring_num_rolls(dice)
    1
    """
    # BEGIN PROBLEM 9
    ma = make_averaged(roll_dice, total_samples)
    trials = [ma(i, dice) for i in range(1, 11)]
    return trials.index(max(trials)) + 1
    # END PROBLEM 9


def winner(strategy0, strategy1):
    """Return 0 if strategy0 wins against strategy1, and 1 otherwise."""
    score0, score1 = play(strategy0, strategy1)
    if score0 > score1:
        return 0
    else:
        return 1


def average_win_rate(strategy, baseline=always_roll(6)):
    """Return the average win rate of STRATEGY against BASELINE. Averages the
    winrate when starting the game as player 0 and as player 1.
    """
    win_rate_as_player_0 = 1 - make_averaged(winner)(strategy, baseline)
    win_rate_as_player_1 = make_averaged(winner)(baseline, strategy)

    return (win_rate_as_player_0 + win_rate_as_player_1) / 2


def run_experiments():
    """Run a series of strategy experiments and report results."""
    six_sided_max = max_scoring_num_rolls(six_sided)
    print('Max scoring num rolls for six-sided dice:', six_sided_max)
    print('always_roll(6) win rate:', average_win_rate(always_roll(6)))

    #print('always_roll(8) win rate:', average_win_rate(always_roll(8)))
    #print('hefty_hogs_strategy win rate:', average_win_rate(hefty_hogs_strategy))
    print('hog_pile_strategy win rate:', average_win_rate(hog_pile_strategy))
    #print('final_strategy win rate:', average_win_rate(final_strategy))
    "*** You may add additional experiments as you wish ***"


def hefty_hogs_strategy(score, opponent_score, threshold=8, num_rolls=6):
    """This strategy returns 0 dice if that gives at least THRESHOLD points, and
    returns NUM_ROLLS otherwise.
    """
    # BEGIN PROBLEM 10
    return 0 if hefty_hogs(score, opponent_score) >= threshold else num_rolls
    # END PROBLEM 10
    # return 6  # Remove this line once implemented.
    # END PROBLEM 10


def hog_pile_strategy(score, opponent_score, threshold=8, num_rolls=6):
    """This strategy returns 0 dice when this would result in Hog Pile taking
    effect. It also returns 0 dice if it gives at least THRESHOLD points.
    Otherwise, it returns NUM_ROLLS.
    """
    # BEGIN PROBLEM 11
    tmp = hefty_hogs(score, opponent_score)
    
    if hog_pile(score + tmp, opponent_score) > 0:
        return 0
    
    return hefty_hogs_strategy(score, opponent_score, threshold, num_rolls)
    
    # return 6  # Remove this line once implemented.
    # END PROBLEM 11


def final_strategy(score, opponent_score):
    """Write a brief description of your final strategy.

    *** YOUR DESCRIPTION HERE ***
    """
    # BEGIN PROBLEM 12
    return hog_pile_strategy(score, opponent_score)
    # return 6  # Remove this line once implemented.
    # END PROBLEM 12

##########################
# Command Line Interface #
##########################

# NOTE: Functions in this section do not need to be changed. They use features
# of Python not yet covered in the course.


@main
def run(*args):
    """Read in the command-line argument and calls corresponding functions."""
    import argparse
    parser = argparse.ArgumentParser(description="Play Hog")
    parser.add_argument('--run_experiments', '-r', action='store_true',
                        help='Runs strategy experiments')

    args = parser.parse_args()

    if args.run_experiments:
        run_experiments()
```
