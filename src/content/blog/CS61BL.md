---
title: CS61BL
date: '2022-07-02T14:39:43.000Z'
updated: '2022-07-11T12:22:07.000Z'
tags:
  - CS61BL
  - Java
categories: []
slug: 2022/07/02/CS61BL
oldUrl: /2022/07/02/CS61BL/
excerpt: >-
  1. This constructor should create a board of size size and set the instance
  variables for the start of the game. 2. This constructor creates a new
  instance of the game with a Board...
---
## Lab01: Java and Git

### Exercise: Leap Year

```java
public static boolean isLeapYear(int year) {
    // TODO: Fill in this method.
    return year % 400 == 0 || (year % 4 == 0 && year %  100 != 0);
}
```

## Proj0: 2048

1. This constructor should create a board of size `size` and set the instance variables for the start of the game.
2. This constructor creates a new instance of the game with a `Board` state that reflects the given `rawValues` array.

```java
/** A new 2048 game on a board of size SIZE with no pieces
 *  and score 0. */
public Model(int size) {
    // TODO: Fill in this constructor.
    this._board = new Board(size);
}

/** A new 2048 game where RAWVALUES contain the values of the tiles
 * (0 if null). VALUES is indexed by (row, col) with (0, 0) corresponding
 * to the bottom-left corner. Used for testing purposes. */
public Model(int[][] rawValues, int score, int maxScore, boolean gameOver) {
    // TODO: Fill in this constructor.
    this._board = new Board(rawValues, score);
    this._score = score;
    this._maxScore = maxScore;
    this._gameOver = gameOver;
}
```

Now, let’s look at the first three methods, which we can use to check certain properties of the board.

#### `public static boolean emptySpaceExists(Board b)`

Use double loop to find out whether exist a tile’s value is empty or not

```java
public static boolean emptySpaceExists(Board b) {
    // TODO: Fill in this function.
    int size = b.size();
    for(int i = 0; i < size; i ++ ) {
        for(int j = 0; j < size; j ++ ) {
            if(b.tile(i, j) == null) {
                return true;
            }
        }
    }
    return false;
}
```

#### `public static boolean maxTileExists(Board b)`

Use double loop to find out whether exist a tile has the max\_piece value or not

```java
public static boolean maxTileExists(Board b) {
    // TODO: Fill in this function.
    for(int i = 0; i < b.size(); i ++ ) {
        for(int j = 0; j < b.size(); j ++ ) {
            if(b.tile(i, j) != null && b.tile(i, j).value() == MAX_PIECE) {
                return true;
            }
        }
    }
    return false;
}
```

#### `public static boolean atLeastOneMoveExists(Board b)`

1. There is at least one empty space on the board.
2. There are two adjacent tiles with the same value.

```java
public static boolean atLeastOneMoveExists(Board b) {
    // TODO: Fill in this function.
    if(emptySpaceExists(b)) return true;
    for(int i = 0; i < b.size(); i ++ ) {
        for(int j = 0; j < b.size(); j ++ ) {
            boolean leftOrRight = j + 1 < b.size() && b.tile(i, j).value() == b.tile(i, j + 1).value();
            boolean upOrDown = i + 1 < b.size() && b.tile(i, j).value() == b.tile(i + 1, j).value();
            if(leftOrRight || upOrDown) {
                return true;
            }
        }
    }
    return false;
}
```

### `tilt` Implementation

1. convert the perspective of the view when we begin to move the tile, this step can help us from considering four directions’ movements to only consider how to move the tilt up

```java
_board.setViewingPerspective(side);
```

2. At the end of the movement, we can recover the perspective of the board

```java
_board.setViewingPerspective(Side.NORTH);
```

3. Move all the tiles to make them adjacent


```
 for (int row = size - 1; row >= 0; row -- ) {
  Tile t = _board.tile(col, row);
if (t != null) {
  // find nextPos which is null     int nextPos = 3;     while (nextPos >= row) {
  if (_board.tile(col, nextPos) == null) {
  break;       }       nextPos -- ;     }     // check if nextPos is a legal position     if (nextPos >= row) {
  _board.move(col, nextPos, t);
changed = true;     }   }
```

4. merge the tiles if they have the same value between one and the one next to it


```
 for (int row = 3; row >= 0; row -- ) {
  Tile curTile = _board.tile(col, row);
// find out the next row's tile   int nextLine = row - 1;   if (nextLine < 0) {
  break;   }   Tile nextTile = _board.tile(col, nextLine);
// if one of the two tile is null we break this loop   if (curTile == null || nextTile == null) {
  break;   }   int nextValue = nextTile.value();
if (nextValue == curTile.value()) {
  // merge the two tiles whose value are equaled     _board.move(col, row, nextTile);
_score += curTile.value() * 2;     // move the tiles behind the two merged tiles to the place where the second tiles was     for (int p = nextLine - 1; p >= 0; p -- ) {
  Tile tile = _board.tile(col, p);
if (tile == null) {
  break;       }       if (p < size) {
  _board.move(col, p + 1, tile);
}     }     changed = true;   } }
```


The full Complication

```java
public boolean tilt(Side side) {
    boolean changed;
    changed = false;

    // TODO: Fill in this function.
    // set the viewing perspective to make the operations more convenient
    _board.setViewingPerspective(side);
    int size = _board.size();
    for (int col = 0; col < size; col ++ ) {
        // move all the tiles to make them adjacent
        for (int row = size - 1; row >= 0; row -- ) {
            Tile t = _board.tile(col, row);
            if (t != null) {
                // find nextPos which is null
                int nextPos = 3;
                while (nextPos >= row) {
                    if (_board.tile(col, nextPos) == null) {
                        break;
                    }
                    nextPos -- ;
                }
                // check if nextPos is a legal position
                if (nextPos >= row) {
                    _board.move(col, nextPos, t);
                    changed = true;
                }
            }
        }

        // Step2. try to merge
        // [2, 2, x, x] -> [4, x, x, x]
        for (int row = 3; row >= 0; row -- ) {
            Tile curTile = _board.tile(col, row);
            // find out the next row's tile
            int nextLine = row - 1;
            if (nextLine < 0) {
                break;
            }
            Tile nextTile = _board.tile(col, nextLine);
            // if one of the two tile is null we break this loop
            if (curTile == null || nextTile == null) {
                break;
            }
            int nextValue = nextTile.value();
            if (nextValue == curTile.value()) {
                // merge the two tiles whose value are equaled
                _board.move(col, row, nextTile);
                _score += curTile.value() * 2;
                // move the tiles behind the two merged tiles to the place where the second tiles was
                for (int p = nextLine - 1; p >= 0; p -- ) {
                    Tile tile = _board.tile(col, p);
                    if (tile == null) {
                        break;
                    }
                    if (p < size) {
                        _board.move(col, p + 1, tile);
                    }
                }
                changed = true;
            }
        }
    }
    _board.setViewingPerspective(Side.NORTH);

    checkGameOver();
    if (changed) {
        setChanged();
    }
    return changed;
}
```

## Lab02:

### Account:

add a private value to the Account class

```java
/**
 * This class represents a bank account whose current balance is a nonnegative
 * amount in US dollars.
 */
public class Account {

    private int balance;

    private Account parent;

    /** Initialize an account with the given balance. */
    public Account(int balance) {
        this.balance = balance;
    }

    public Account(int balance, Account parent) {
        this.balance = balance;
        this.parent = parent;
    }

    /** Returns the balance for the current account. */
    public int getBalance() {
        return balance;
    }

    /** Deposits amount into the current account. */
    public void deposit(int amount) {
        if (amount < 0) {
            System.out.println("Cannot deposit negative amount.");
        } else {
            balance += amount;
        }
    }

    /**
     * Subtract amount from the account if possible. If subtracting amount
     * would leave a negative balance, print an error message and leave the
     * balance unchanged.
     */
    public boolean withdraw(int amount) {
        // TODO
        if (amount < 0) {
            System.out.println("Cannot withdraw negative amount.");
            return false;
        } else if (amount < balance) {
            balance -= amount;
        } else if (parent != null && balance + parent.balance >= amount) {
            amount -= balance;
            balance = 0;
            parent.balance -= amount;
        } else {
            System.out.println("Insufficient Funds.");
            return false;
        }
        return true;
    }

    /**
     * Merge account other into this account by removing all money from other
     * and depositing it into this account.
     */
    public void merge(Account other) {
        // TODO
        if (other == null) {
            System.out.println("Cannot merge null account.");
        } else {
            balance += other.balance;
            other.balance = 0;
        }
    }
}
```

### Path:

```java
/** A class that represents a path via pursuit curves. */
public class Path {

    // TODO
    private Point curr, next;
    public Path(double x, double y) {
        curr = new Point();
        next = new Point(x, y);
    }
    public double getCurrX() {
        return curr.getX();
    }
    public double getCurrY() {
        return curr.getY();
    }
    public double getNextX() {
        return next.getX();
    }
    public double getNextY() {
        return next.getY();
    }
    public void setCurrentPoint(Point point) {
        curr = point;
    }
    public void iterate(double x, double y) {
        curr = next;
        next = new Point(curr.getX() + x, curr.getY() + y);
    }
    public Point getCurrentPoint() {
        return curr;
    }
}
```

## Lab03:

### Date Converter

```java
import java.io.*;

public class DateConverter {
    /**
     * Given a day number in 2021, an integer between 1 and 365, as a
     * command-line argument, prints the date in month/day format.
     *
     *     java DateConverter 365
     *
     * should print 12/31
     */
    public static void main(String[] args) {
        int dayOfYear = 0;
        try {
            dayOfYear = Integer.parseInt(args[0]);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }

        int month, dateInMonth, daysInMonth;
        month = 1;
        daysInMonth = 31;
        while (dayOfYear > daysInMonth) {
            // TODO: Here is one place to put assignment statements.
            if (month == 2) {
                daysInMonth = 28;
            } else if (month == 4 || month == 6 || month == 9 || month == 11) {
                daysInMonth = 30;
            } else {
                daysInMonth = 31;
            }
            // TODO: Here is another possible place to put assignment statements.
//            System.out.println(month + "/" + daysInMonth + "/" + dayOfYear);

            if(dayOfYear > daysInMonth) {
                dayOfYear -= daysInMonth;
                month ++ ;
            }
        }
        dateInMonth = dayOfYear;
        System.out.println(month + "/" + dateInMonth);
    }
}
```

### TriangleDrawer:

```java
public class TriangleDrawer {
    public static void main(String[] args) {
        int row = 0;
        int SIZE = 10;
        while(row < SIZE) {
            int col = 0;
            while(col < row) {
                System.out.print('*');
                col = col + 1;
            }
            System.out.println('*');
            row = row + 1;
        }
    }
}
```

### ArrayOperations

```java
public class ArrayOperations {
    /**
     * Delete the value at the given position in the argument array, shifting
     * all the subsequent elements down, and storing a 0 as the last element of
     * the array.
     */
    public static void delete(int[] values, int pos) {
        if (pos < 0 || pos >= values.length) {
            return;
        }
        // TODO: YOUR CODE HERE
        for (int i = pos; i < values.length - 1; i ++ ) {
            values[i] = values[i + 1];
        }
        values[values.length - 1] = 0;
    }

    /**
     * Insert newInt at the given position in the argument array, shifting all
     * the subsequent elements up to make room for it. The last element in the
     * argument array is lost.
     */
    public static void insert(int[] values, int pos, int newInt) {
        if (pos < 0 || pos >= values.length) {
            return;
        }
        // TODO: YOUR CODE HERE
        for (int i = values.length - 1; i > pos; i -- ) {
            values[i] = values[i - 1];
        }
        values[pos] = newInt;
    }

    /** 
     * Returns a new array consisting of the elements of A followed by the
     *  the elements of B. 
     */
    public static int[] catenate(int[] A, int[] B) {
        // TODO: YOUR CODE HERE
        int[] C = new int[A.length + B.length];
        int index = 0, indexA = 0, indexB = 0;
        while(indexA < A.length) {
            C[index ++ ] = A[indexA ++];
        }
        while(indexB < B.length) {
            C[index ++ ] = B[indexB ++];
        }
        return C;
    }
}
```
