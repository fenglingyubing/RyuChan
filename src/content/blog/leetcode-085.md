---
title: 爬楼梯
description: leetcode刷题第四十九天
pubDate: 2026-05-09T08:13
image: /images/leetcode-085/3021838e559b9992.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 70. 爬楼梯

## 题目描述

假设你正在爬楼梯，需要 `n` 阶才能到达楼顶。

每次你可以爬 `1` 个或 `2` 个台阶，问一共有多少种不同的方法可以爬到楼顶。

## 核心思路

这道题是典型的动态规划问题，也可以理解为斐波那契数列的变形。

到达第 `n` 阶时，最后一步只有两种可能：

1. 从第 `n - 1` 阶爬 `1` 个台阶上来；
2. 从第 `n - 2` 阶爬 `2` 个台阶上来。

所以，到达第 `n` 阶的方法数等于：

```text
到达第 n - 1 阶的方法数 + 到达第 n - 2 阶的方法数
```

也就是：

```text
dp[n] = dp[n - 1] + dp[n - 2]
```

## 举例分析

当 `n = 1` 时：

```text
1
```

只有 `1` 种方法。

当 `n = 2` 时：

```text
1 + 1
2
```

有 `2` 种方法。

当 `n = 3` 时：

```text
1 + 1 + 1
1 + 2
2 + 1
```

有 `3` 种方法。

当 `n = 4` 时：

```text
1 + 1 + 1 + 1
1 + 1 + 2
1 + 2 + 1
2 + 1 + 1
2 + 2
```

有 `5` 种方法。

可以看到结果序列是：

```text
n:      1  2  3  4  5
ways:   1  2  3  5  8
```

## 动态规划定义

定义：

```text
dp[i] 表示爬到第 i 阶楼梯的方法数
```

初始状态：

```text
dp[1] = 1
dp[2] = 2
```

状态转移方程：

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

最终答案：

```text
dp[n]
```

## Java 代码：动态规划数组

```java
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }

        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;

        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        return dp[n];
    }
}
```

## 空间优化

因为 `dp[i]` 只依赖 `dp[i - 1]` 和 `dp[i - 2]`，所以不需要保存完整数组，只需要两个变量。

```java
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }

        int prev2 = 1; // dp[1]
        int prev1 = 2; // dp[2]

        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }

        return prev1;
    }
}
```

## 为什么不能简单地用暴力递归

暴力递归也可以写出递推关系：

```java
f(n) = f(n - 1) + f(n - 2)
```

但是暴力递归会重复计算大量子问题。

例如计算 `f(5)`：

```text
f(5)
= f(4) + f(3)
= (f(3) + f(2)) + (f(2) + f(1))
```

其中 `f(3)`、`f(2)` 会被重复计算。随着 `n` 变大，递归调用数量会快速增长，效率较低。

动态规划的本质就是把已经算过的结果保存下来，避免重复计算。

## 复杂度分析

动态规划数组写法：

```text
时间复杂度：O(n)
空间复杂度：O(n)
```

空间优化写法：

```text
时间复杂度：O(n)
空间复杂度：O(1)
```

## 总结

这道题的关键是看清楚“最后一步”：

```text
爬到第 n 阶，要么从第 n - 1 阶上来，要么从第 n - 2 阶上来。
```

因此：

```text
climbStairs(n) = climbStairs(n - 1) + climbStairs(n - 2)
```

它本质上就是一个斐波那契类型的动态规划问题。实际提交时，推荐使用空间优化版本，代码简洁，空间复杂度也是 `O(1)`。
