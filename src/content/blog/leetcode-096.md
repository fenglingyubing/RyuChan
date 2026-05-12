---
title: 最小路径和
description: leetcode刷题第五十二天
pubDate: 2026-05-12T18:50
image: /images/leetcode-096/53ee27f4e751a329.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 64. 最小路径和

## 题目描述

给定一个包含非负整数的 `m x n` 网格 `grid`。

请找出一条从左上角到右下角的路径，使得路径上的数字总和最小。

说明：

```text
每次只能向下或者向右移动一步
```

---

## 示例

```text
输入：
grid = [
  [1,3,1],
  [1,5,1],
  [4,2,1]
]

输出：7
解释：路径 1 -> 3 -> 1 -> 1 -> 1 的总和最小，为 7
```

```text
输入：
grid = [
  [1,2,3],
  [4,5,6]
]

输出：12
解释：路径 1 -> 2 -> 3 -> 6 的总和为 12
```

---

## 核心思路

这道题和第 62 题“不同路径”很像。

机器人仍然只能：

```text
向右走
向下走
```

所以对于某个位置 `(i, j)`，它只能从两个位置走过来：

```text
上面：(i - 1, j)
左边：(i, j - 1)
```

不同的是：

第 62 题要求路径数量，所以是：

```text
上面路径数 + 左边路径数
```

这道题要求最小路径和，所以是：

```text
min(从上面来的最小路径和, 从左边来的最小路径和) + 当前格子的值
```

---

## 动态规划定义

定义：

```text
dp[i][j] 表示从左上角走到位置 (i, j) 的最小路径和
```

最终答案是：

```text
dp[m - 1][n - 1]
```

因为右下角的位置是：

```text
(m - 1, n - 1)
```

---

## 状态转移

要到达 `(i, j)`，只能从两个方向来。

### 从上面来

如果上一步是从上面走下来：

```text
(i - 1, j) -> (i, j)
```

路径和是：

```text
dp[i - 1][j] + grid[i][j]
```

### 从左边来

如果上一步是从左边走过来：

```text
(i, j - 1) -> (i, j)
```

路径和是：

```text
dp[i][j - 1] + grid[i][j]
```

要让路径和最小，所以取较小的那个：

```text
dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
```

这就是状态转移方程。

---

## 初始化

左上角是起点。

所以：

```text
dp[0][0] = grid[0][0]
```

第一行只能从左边一路走过来。

所以：

```text
dp[0][j] = dp[0][j - 1] + grid[0][j]
```

第一列只能从上面一路走下来。

所以：

```text
dp[i][0] = dp[i - 1][0] + grid[i][0]
```

---

## 举例分析

以：

```text
grid = [
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
```

为例。

初始化左上角：

```text
1 0 0
0 0 0
0 0 0
```

初始化第一行：

```text
1 4 5
0 0 0
0 0 0
```

解释：

```text
dp[0][1] = dp[0][0] + grid[0][1] = 1 + 3 = 4
dp[0][2] = dp[0][1] + grid[0][2] = 4 + 1 = 5
```

初始化第一列：

```text
1 4 5
2 0 0
6 0 0
```

解释：

```text
dp[1][0] = dp[0][0] + grid[1][0] = 1 + 1 = 2
dp[2][0] = dp[1][0] + grid[2][0] = 2 + 4 = 6
```

计算 `(1, 1)`：

```text
dp[1][1] = min(dp[0][1], dp[1][0]) + grid[1][1]
         = min(4, 2) + 5
         = 7
```

表格变成：

```text
1 4 5
2 7 0
6 0 0
```

计算 `(1, 2)`：

```text
dp[1][2] = min(dp[0][2], dp[1][1]) + grid[1][2]
         = min(5, 7) + 1
         = 6
```

表格变成：

```text
1 4 5
2 7 6
6 0 0
```

计算 `(2, 1)`：

```text
dp[2][1] = min(dp[1][1], dp[2][0]) + grid[2][1]
         = min(7, 6) + 2
         = 8
```

表格变成：

```text
1 4 5
2 7 6
6 8 0
```

计算 `(2, 2)`：

```text
dp[2][2] = min(dp[1][2], dp[2][1]) + grid[2][2]
         = min(6, 8) + 1
         = 7
```

最终：

```text
1 4 5
2 7 6
6 8 7
```

答案是：

```text
7
```

---

## Java 代码：二维动态规划

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        int[][] dp = new int[m][n];
        dp[0][0] = grid[0][0];

        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }

        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }

        return dp[m - 1][n - 1];
    }
}
```

---

## 代码解释

```java
int m = grid.length;
int n = grid[0].length;
```

获取网格的行数和列数。

```java
int[][] dp = new int[m][n];
dp[0][0] = grid[0][0];
```

创建 `dp` 数组。

左上角是起点，所以最小路径和就是它自己的值。

```java
for (int j = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
}
```

初始化第一行。

第一行只能从左往右走。

```java
for (int i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
}
```

初始化第一列。

第一列只能从上往下走。

```java
dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
```

当前位置的最小路径和等于：

```text
上面和左边的较小路径和 + 当前格子的值
```

---

## 解法二：原地修改 grid

这道题可以不额外创建 `dp` 数组，直接把 `grid` 改成最小路径和表。

原来的：

```text
grid[i][j]
```

表示当前格子的值。

修改后：

```text
grid[i][j]
```

表示从左上角走到 `(i, j)` 的最小路径和。

---

## Java 代码：原地修改

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j - 1];
        }

        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i - 1][0];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
            }
        }

        return grid[m - 1][n - 1];
    }
}
```

---

## 原地修改是否安全

在 LeetCode 提交中，原地修改 `grid` 是可以的。

因为题目只要求返回最小路径和，不要求保留原数组。

如果在真实项目里后面还需要使用原始 `grid`，就不要原地修改，应该使用额外的 `dp` 数组。

---

## 解法三：一维动态规划

还可以把二维 `dp` 压缩成一维数组。

定义：

```text
dp[j] 表示当前行走到第 j 列的最小路径和
```

状态转移：

```text
dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j]
```

这里：

```text
dp[j] 表示从上面来的最小路径和
dp[j - 1] 表示从左边来的最小路径和
```

---

## Java 代码：一维动态规划

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        int[] dp = new int[n];
        dp[0] = grid[0][0];

        for (int j = 1; j < n; j++) {
            dp[j] = dp[j - 1] + grid[0][j];
        }

        for (int i = 1; i < m; i++) {
            dp[0] += grid[i][0];

            for (int j = 1; j < n; j++) {
                dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }

        return dp[n - 1];
    }
}
```

---

## 一维代码解释

```java
int[] dp = new int[n];
dp[0] = grid[0][0];
```

创建一维数组。

`dp[j]` 表示当前行走到第 `j` 列的最小路径和。

```java
for (int j = 1; j < n; j++) {
    dp[j] = dp[j - 1] + grid[0][j];
}
```

初始化第一行。

```java
dp[0] += grid[i][0];
```

每一行的第一列只能从上面下来，所以直接累加。

```java
dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
```

对当前位置来说：

```text
dp[j] 是上面来的最小路径和
dp[j - 1] 是左边来的最小路径和
```

取较小值，再加上当前格子的值。

---

## 一维数组变化过程

以：

```text
grid = [
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
```

为例。

初始化第一行：

```text
[1, 4, 5]
```

处理第二行：

```text
先更新第一列：
dp[0] = 1 + 1 = 2
[2, 4, 5]

j = 1:
dp[1] = min(4, 2) + 5 = 7
[2, 7, 5]

j = 2:
dp[2] = min(5, 7) + 1 = 6
[2, 7, 6]
```

处理第三行：

```text
先更新第一列：
dp[0] = 2 + 4 = 6
[6, 7, 6]

j = 1:
dp[1] = min(7, 6) + 2 = 8
[6, 8, 6]

j = 2:
dp[2] = min(6, 8) + 1 = 7
[6, 8, 7]
```

答案是：

```text
7
```

---

## 复杂度分析

二维动态规划：

```text
时间复杂度：O(m * n)
空间复杂度：O(m * n)
```

原地修改：

```text
时间复杂度：O(m * n)
空间复杂度：O(1)
```

一维动态规划：

```text
时间复杂度：O(m * n)
空间复杂度：O(n)
```

---

## 易错点

### 1. 把路径数量和路径和混淆

第 62 题“不同路径”是求数量：

```java
dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
```

第 64 题“最小路径和”是求最小代价：

```java
dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
```

---

### 2. 忘记加当前格子的值

状态转移中一定要加：

```java
grid[i][j]
```

因为路径经过当前位置，当前位置的值也要算入总和。

---

### 3. 第一行和第一列初始化错

第一行只能从左边来。

第一列只能从上面来。

所以不能使用 `Math.min`，只能一路累加。

---

### 4. 返回值写错

二维 DP 返回：

```java
dp[m - 1][n - 1]
```

一维 DP 返回：

```java
dp[n - 1]
```

原地修改返回：

```java
grid[m - 1][n - 1]
```

---

## 总结

这道题的关键是：

```text
每个位置只能从上面或左边来
```

所以当前位置的最小路径和是：

```text
上面和左边的较小路径和 + 当前格子的值
```

状态转移方程：

```text
dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
```

推荐提交原地修改写法：

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j - 1];
        }

        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i - 1][0];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
            }
        }

        return grid[m - 1][n - 1];
    }
}
```
