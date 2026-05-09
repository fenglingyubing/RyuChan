---
title: 打家劫舍
description: leetcode刷题第四十九天
pubDate: 2026-05-09T08:42
image: /images/leetcode-087/9c15b00b81c6b25c.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 198. 打家劫舍

## 题目描述

你是一个专业的小偷，计划偷窃沿街的房屋。

每间房内都藏有一定的现金，但相邻的房屋装有相互连通的防盗系统。如果两间相邻的房屋在同一晚上被闯入，系统会自动报警。

给定一个非负整数数组 `nums`，其中 `nums[i]` 表示第 `i` 间房屋的金额，计算在不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。

## 核心思路

这道题是典型的动态规划问题。

对于第 `i` 间房子，小偷只有两种选择：

1. 偷第 `i` 间房子；
2. 不偷第 `i` 间房子。

如果偷第 `i` 间房子，那么第 `i - 1` 间房子不能偷，所以最大金额是：

```text
dp[i - 2] + nums[i]
```

如果不偷第 `i` 间房子，那么最大金额就是前 `i - 1` 间房子的最大金额：

```text
dp[i - 1]
```

所以当前位置的最优解就是两者取最大值：

```text
dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
```

## 动态规划定义

定义：

```text
dp[i] 表示从第 0 间房子到第 i 间房子，在不触发警报的情况下，最多能偷到的金额
```

状态转移方程：

```text
dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
```

含义是：

```text
不偷第 i 间房子：dp[i - 1]
偷第 i 间房子：dp[i - 2] + nums[i]
```

## 举例分析

以：

```text
nums = [2, 7, 9, 3, 1]
```

为例。

### 第 0 间房子

只有一间房子时，只能偷它：

```text
dp[0] = 2
```

### 第 1 间房子

第 `0` 间和第 `1` 间相邻，不能都偷，只能选择金额更大的：

```text
dp[1] = max(nums[0], nums[1]) = max(2, 7) = 7
```

### 第 2 间房子

有两种选择：

```text
不偷第 2 间：dp[1] = 7
偷第 2 间：dp[0] + nums[2] = 2 + 9 = 11
```

所以：

```text
dp[2] = max(7, 11) = 11
```

### 第 3 间房子

```text
不偷第 3 间：dp[2] = 11
偷第 3 间：dp[1] + nums[3] = 7 + 3 = 10
```

所以：

```text
dp[3] = max(11, 10) = 11
```

### 第 4 间房子

```text
不偷第 4 间：dp[3] = 11
偷第 4 间：dp[2] + nums[4] = 11 + 1 = 12
```

所以：

```text
dp[4] = max(11, 12) = 12
```

最终答案是：

```text
12
```

可以偷第 `0`、`2`、`4` 间房子，金额为：

```text
2 + 9 + 1 = 12
```

## Java 代码：动态规划数组

```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;

        if (n == 1) {
            return nums[0];
        }

        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);

        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }

        return dp[n - 1];
    }
}
```

## 代码解释

### 初始化

```java
int n = nums.length;
```

`n` 表示房子的数量。

```java
if (n == 1) {
    return nums[0];
}
```

如果只有一间房子，直接偷这一间即可。

```java
dp[0] = nums[0];
dp[1] = Math.max(nums[0], nums[1]);
```

含义是：

```text
dp[0]：只有第 0 间房子时，最多偷 nums[0]
dp[1]：有第 0 和第 1 间房子时，因为相邻，只能偷金额较大的那一间
```

### 状态转移

```java
for (int i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
}
```

从第 `2` 间房子开始，每间房子都做一次选择：

```text
不偷当前房子，最大金额是 dp[i - 1]
偷当前房子，最大金额是 dp[i - 2] + nums[i]
```

取两者中的最大值。

## 空间优化

因为 `dp[i]` 只依赖 `dp[i - 1]` 和 `dp[i - 2]`，所以不需要保存完整数组。

可以用两个变量记录前两个状态：

```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;

        if (n == 1) {
            return nums[0];
        }

        int prev2 = nums[0];
        int prev1 = Math.max(nums[0], nums[1]);

        for (int i = 2; i < n; i++) {
            int current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }

        return prev1;
    }
}
```

变量含义：

```text
prev2 表示 dp[i - 2]
prev1 表示 dp[i - 1]
current 表示 dp[i]
```

每次计算出 `current` 后，向后移动状态：

```text
prev2 = prev1
prev1 = current
```

## 边界情况

### 只有一间房子

```text
nums = [5]
```

只能偷这一间：

```text
答案是 5
```

### 两间房子

```text
nums = [2, 7]
```

两间相邻，不能都偷，只能偷金额大的：

```text
答案是 7
```

### 多间房子

```text
nums = [2, 7, 9, 3, 1]
```

可以偷第 `0`、`2`、`4` 间：

```text
答案是 12
```

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

这道题的关键是分析每一间房子的选择：

```text
偷当前房子：不能偷上一间，所以金额是 dp[i - 2] + nums[i]
不偷当前房子：金额是 dp[i - 1]
```

因此递推公式是：

```text
dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
```

实际提交时，推荐使用空间优化版本，逻辑清晰，空间复杂度也是 `O(1)`。
