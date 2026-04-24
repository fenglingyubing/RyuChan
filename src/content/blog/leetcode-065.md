---
title: N 皇后
description: leetcode刷题第三十八天
pubDate: 2026-04-24T21:37
image: /images/leetcode-065/c9e94bd559ecd12f.webp
draft: false
tags: []
categories: []
---
# 51. N 皇后

## 问题描述

按照国际象棋的规则，皇后可以攻击与之处在同一行、同一列或同一斜线上的棋子。

**n 皇后问题**：将 n 个皇后放置在 n×n 的棋盘上，使皇后彼此之间不能相互攻击。

返回所有不同的解决方案。每种方案用 'Q' 和 '.' 表示皇后和空位。

**示例：**
```
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：有两种解决方案：
方案1：          方案2：
Q . . .         . . Q .
. . . Q         Q . . .
. Q . .         . . . Q
. . . Q         . Q . .
```

---

## 问题分析

### 核心约束

皇后之间不能相互攻击，意味着：
- **同一行**只能有一个皇后
- **同一列**只能有一个皇后
- **同一斜线**只能有一个皇后（对角线和反对角线）

### 核心思想

回溯的经典应用：**按行放置**。

关键洞察：**每行必然有且仅有一个皇后**（因为两个皇后不能在同一行）

因此，我们只需要决定**每行的皇后放在哪一列**。

---

## 解题思路

### 状态表示

```java
List<List<String>> result = new ArrayList<>();  // 存储所有解决方案
List<String> path = new ArrayList<>();          // 当前方案，如 ["Q...", ".Q.."]
```

### 回溯框架

```
对于第 row 行（从0到n-1）：
    尝试将皇后放在第 col 列（从0到n-1）
    如果 (row, col) 位置合法（不受之前皇后攻击）：
        放置皇后
        递归处理第 row+1 行
        撤销皇后
```

### 合法性判断

对于位置 (row, col)，检查是否受到已有皇后攻击：

```java
// 1. 检查同列是否有皇后
for (int i = 0; i < row; i++) {
    if (board[i].charAt(col) == 'Q') return false;
}

// 2. 检查左上对角线 (row-1, col-1), (row-2, col-2), ...
for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i].charAt(j) == 'Q') return false;
}

// 3. 检查右上对角线 (row-1, col+1), (row-2, col+2), ...
for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i].charAt(j) == 'Q') return false;
}
```

---

## Java 代码实现

### 解法一：标准回溯

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();
    private Set<Integer> cols = new HashSet<>();      // 记录已使用的列
    private Set<Integer> diag1 = new HashSet<>();    // 记录已使用的对角线 (row+col)
    private Set<Integer> diag2 = new HashSet<>();    // 记录已使用的反对角线 (row-col)

    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (char[] row : board) {
            Arrays.fill(row, '.');
        }
        backtrack(board, 0);
        return result;
    }

    private void backtrack(char[][] board, int row) {
        int n = board.length;

        // 终止条件：所有行都处理完
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) {
                solution.add(new String(r));
            }
            result.add(solution);
            return;
        }

        // 遍历当前行的所有列
        for (int col = 0; col < n; col++) {
            // 剪枝：检查位置是否合法
            if (cols.contains(col)) continue;                                    // 同列有皇后
            if (diag1.contains(row + col)) continue;                            // 主对角线有皇后
            if (diag2.contains(row - col)) continue;                            // 副对角线有皇后

            // 做选择
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row + col);
            diag2.add(row - col);

            // 递归处理下一行
            backtrack(board, row + 1);

            // 撤销选择
            board[row][col] = '.';
            cols.remove(col);
            diag1.remove(row + col);
            diag2.remove(row - col);
        }
    }
}
```

### 解法二：简化版（不使用HashSet）

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();

    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (char[] row : board) {
            Arrays.fill(row, '.');
        }
        backtrack(board, 0);
        return result;
    }

    private void backtrack(char[][] board, int row) {
        if (row == board.length) {
            result.add(construct(board));
            return;
        }

        for (int col = 0; col < board.length; col++) {
            if (isValid(board, row, col)) {
                board[row][col] = 'Q';
                backtrack(board, row + 1);
                board[row][col] = '.';
            }
        }
    }

    // 合法性检查
    private boolean isValid(char[][] board, int row, int col) {
        // 检查同列（只需检查当前行之前的行）
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }

        // 检查左上对角线
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }

        // 检查右上对角线
        for (int i = row - 1, j = col + 1; i >= 0 && j < board.length; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }

        return true;
    }

    private List<String> construct(char[][] board) {
        List<String> list = new ArrayList<>();
        for (char[] row : board) {
            list.add(new String(row));
        }
        return list;
    }
}
```

---

## 复杂度分析

| 复杂度 | 说明 |
|--------|------|
| **时间复杂度** | O(n!)，每行最多 n 个选择，但有合法性剪枝 |
| **空间复杂度** | O(n)，递归栈深度 + board 存储 |

---

## 回溯树状图（以 n=4 为例）

### 棋盘状态

```
行0: [0,0] [0,1] [0,2] [0,3]
行1: [1,0] [1,1] [1,2] [1,3]
行2: [2,0] [2,1] [2,2] [2,3]
行3: [3,0] [3,1] [3,2] [3,3]
```

### 回溯过程

```
                    "" (空棋盘)
                    │
         ┌──────────┼──────────┬───────────┐
         ▼          ▼          ▼           ▼
       [0,0]Q    [0,1]Q    [0,2]Q     [0,3]Q
         │          │          │           │
      ┌──┴──┐    ┌──┴──┐    ┌──┴──┐     ┌──┴──┐
      ▼     ▼    ▼     ▼    ▼     ▼     ▼     ▼
    [1,1]  ❌   [1,0]  ❌   ❌  [1,3]  ❌  [1,1]
      │          │          │           │
    ┌─┴─┐      ┌─┴─┐      ┌─┴─┐       ┌─┴─┐
    ▼   ▼      ▼   ▼      ▼   ▼       ▼   ▼
  [2,2] ❌    ❌  [2,3]  [2,0] ❌    ❌  [2,2]
    │          │          │           │
  ┌─┴─┐      ┌─┴─┐      ┌─┴─┐       ┌─┴─┐
  ▼   ▼      ▼   ▼      ▼   ▼       ▼   ▼
[3,3]❌  ══  [3,1]Q ✅  ❌  [3,3]Q ✅ ══  [3,0]Q ✅
        剪枝                剪枝

最终得到2个解（见下方）
```

### 解决方案可视化

```
解法1:                    解法2:
. Q . .                  . . Q .
. . . Q                  Q . . .
Q . . .                  . . . Q
. . Q .                  . Q . .
```

---

## 对角线判断的数学原理

### 主对角线（从左上到右下）

```
特点：row - col 是常数
(0,0) → 0    (0,0)
(1,1) → 0    (1,1)  → 同一对角线
(2,2) → 0    (2,2)
(3,3) → 0    (3,3)
```

### 副对角线（从右上到左下）

```
特点：row + col 是常数
(0,3) → 3    (0,3)
(1,2) → 3    (1,2)  → 同一对角线
(2,1) → 3    (2,1)
(3,0) → 3    (3,0)
```

因此用 `row - col` 和 `row + col` 可以唯一标识对角线。

---

## 关键点总结

### 1. 回溯三要素

```java
// 1. 做选择
board[row][col] = 'Q';
cols.add(col);

// 2. 递归
backtrack(board, row + 1);

// 3. 撤销
board[row][col] = '.';
cols.remove(col);
```

### 2. 剪枝条件

```java
if (cols.contains(col)) continue;       // 同列有皇后
if (diag1.contains(row + col)) continue; // 主对角线冲突
if (diag2.contains(row - col)) continue; // 副对角线冲突
```

### 3. 为什么用 HashSet 更优？

省去每次递归都检查三个方向的 O(n) 复杂度，变成 O(1) 的查询。

### 4. N皇后 vs 其他回溯题

| 题目 | 搜索结构 | 选择方式 |
|------|----------|----------|
| 括号生成 | 一维树 | 选左/右 |
| 单词搜索 | 二维网格 | 四个方向 |
| 分割回文串 | 一维字符串 | 切多长 |
| **N皇后** | **二维棋盘** | **每行选一列** |

---

## 变形题目

### 1. N皇后 II（只返回数量）

```java
// 只需计数，不需要存储具体方案
private int count = 0;

private void backtrack(...) {
    if (row == n) {
        count++;
        return;
    }
    // ...
}
```

### 2. 有效的数独（检查数独是否合法）

```java
// 思想类似：检查行、列、3x3宫格是否有重复
```

---

## 总结

N皇后的**核心思路**：

```
1. 每行必然有一个皇后
2. 只需决定每行的皇后放在哪列
3. 用 row - col 和 row + col 判断对角线冲突
4. 回溯：放 → 递归 → 撤销
```

**模板**：
```java
void backtrack(board, row) {
    if (row == n) {
        result.add(construct(board));
        return;
    }

    for (col in 0..n-1) {
        if (isValid(board, row, col)) {
            board[row][col] = 'Q';
            backtrack(board, row + 1);
            board[row][col] = '.';
        }
    }
}
```
