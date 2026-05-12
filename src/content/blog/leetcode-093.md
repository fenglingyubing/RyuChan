---
title: 分割等和子集
description: leetcode刷题第五十二天
pubDate: 2026-05-12T17:20
image: /images/leetcode-093/b03eaf0950fb2345.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 416. 分割等和子集

## 题目描述

给你一个只包含正整数的非空数组 `nums`，请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

示例：

```text
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1,5,5] 和 [11]，两个子集的和都是 11
```

```text
输入：nums = [1,2,3,5]
输出：false
解释：无法分割成两个元素和相等的子集
```

---

## 核心思路

如果数组可以分成两个和相等的子集，说明整个数组的总和一定是偶数。

假设数组总和是：

```text
sum
```

如果能分成两个和相等的子集，那么每个子集的和都是：

```text
sum / 2
```

所以问题可以转换成：

```text
能不能从 nums 中选出一些数字，使它们的和正好等于 sum / 2？
```

这就变成了一个典型的 `0-1 背包` 问题。

每个数字只能选一次，所以是 `0-1` 背包，不是完全背包。

---

## 为什么是 0-1 背包

对于数组中的每个数字 `nums[i]`，只有两种选择：

```text
选它
不选它
```

每个数字最多只能使用一次。

目标是凑出一个指定容量：

```text
target = sum / 2
```

如果可以凑出 `target`，说明剩下的数字之和也是 `target`，两个子集就能平分整个数组。

---

## 解法一：二维动态规划

### 动态规划定义

定义：

```text
dp[i][j] 表示从前 i 个数字中，能否选出一些数字，使它们的和等于 j
```

这里的 `i` 表示考虑前几个数字，`j` 表示目标和。

最终要判断：

```text
dp[n][target]
```

是否为 `true`。

---

## 状态转移

对于当前数字：

```text
num = nums[i - 1]
```

有两种情况。

### 情况一：不选当前数字

如果不选当前数字，那么能否凑出 `j`，取决于前 `i - 1` 个数字能否凑出 `j`：

```text
dp[i][j] = dp[i - 1][j]
```

### 情况二：选择当前数字

如果选择当前数字，那么前面需要凑出：

```text
j - num
```

所以：

```text
dp[i][j] = dp[i - 1][j - num]
```

综合起来：

```text
dp[i][j] = dp[i - 1][j] || dp[i - 1][j - num]
```

前提是：

```text
j >= num
```

如果 `j < num`，当前数字太大，不能选，只能不选：

```text
dp[i][j] = dp[i - 1][j]
```

---

## 初始化

不管选多少个数字，凑出和为 `0` 都是可以的，因为可以什么都不选。

所以：

```text
dp[i][0] = true
```

如果没有任何数字，要凑出正数是不可能的：

```text
dp[0][j] = false, j > 0
```

---

## 举例分析

以：

```text
nums = [1, 5, 11, 5]
```

为例。

数组总和：

```text
sum = 1 + 5 + 11 + 5 = 22
```

因为 `22` 是偶数，所以目标和是：

```text
target = 22 / 2 = 11
```

现在问题变成：

```text
能不能从 [1, 5, 11, 5] 中选出一些数字，使和等于 11？
```

可以直接选择：

```text
[11]
```

也可以选择：

```text
[1, 5, 5]
```

所以答案是：

```text
true
```

再看：

```text
nums = [1, 2, 3, 5]
```

数组总和：

```text
sum = 11
```

总和是奇数，不可能分成两个整数和相等的子集，所以直接返回：

```text
false
```

---

## Java 代码：二维动态规划

```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }

        if (sum % 2 != 0) {
            return false;
        }

        int target = sum / 2;
        int n = nums.length;
        boolean[][] dp = new boolean[n + 1][target + 1];

        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }

        for (int i = 1; i <= n; i++) {
            int num = nums[i - 1];
            for (int j = 1; j <= target; j++) {
                dp[i][j] = dp[i - 1][j];

                if (j >= num) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j - num];
                }
            }
        }

        return dp[n][target];
    }
}
```

---

## 代码解释

```java
int sum = 0;
for (int num : nums) {
    sum += num;
}
```

先计算数组总和。

```java
if (sum % 2 != 0) {
    return false;
}
```

如果总和是奇数，一定不能分成两个相等的整数和子集。

```java
int target = sum / 2;
```

目标变成从数组中选出一些数字，使它们的和等于 `target`。

```java
boolean[][] dp = new boolean[n + 1][target + 1];
```

创建二维动态规划数组。

```java
for (int i = 0; i <= n; i++) {
    dp[i][0] = true;
}
```

和为 `0` 总是可以凑出来，因为可以什么都不选。

```java
dp[i][j] = dp[i - 1][j];
```

不选当前数字。

```java
if (j >= num) {
    dp[i][j] = dp[i][j] || dp[i - 1][j - num];
}
```

如果当前容量 `j` 放得下当前数字，就尝试选择当前数字。

---

## 解法二：一维动态规划

二维动态规划中，`dp[i][j]` 只依赖上一行：

```text
dp[i - 1][j]
dp[i - 1][j - num]
```

所以可以压缩成一维数组。

定义：

```text
dp[j] 表示能否从已经遍历过的数字中，选出一些数字，使它们的和等于 j
```

对于每个数字 `num`，更新：

```text
dp[j] = dp[j] || dp[j - num]
```

---

## 为什么 j 要倒序遍历

一维 `0-1` 背包必须倒序遍历容量：

```text
for j 从 target 到 num
```

原因是每个数字只能使用一次。

如果正序遍历，当前数字可能会被重复使用。

例如：

```text
nums = [1, 2, 5]
target = 4
```

处理数字 `1` 时，如果正序遍历：

```text
dp[1] 可以由 dp[0] 得到
dp[2] 又可以由刚刚更新的 dp[1] 得到
dp[3] 又可以由刚刚更新的 dp[2] 得到
dp[4] 又可以由刚刚更新的 dp[3] 得到
```

这样相当于把数字 `1` 用了多次，这是错误的。

倒序遍历可以保证：

```text
dp[j - num]
```

使用的是上一轮的状态，也就是还没有使用当前数字之前的状态。

---

## Java 代码：一维动态规划

```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }

        if (sum % 2 != 0) {
            return false;
        }

        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }

            if (dp[target]) {
                return true;
            }
        }

        return dp[target];
    }
}
```

---

## 一维代码解释

```java
boolean[] dp = new boolean[target + 1];
dp[0] = true;
```

`dp[j]` 表示当前是否能凑出和 `j`。

`dp[0] = true` 表示什么都不选可以凑出 `0`。

```java
for (int num : nums) {
```

依次考虑每一个数字。

```java
for (int j = target; j >= num; j--) {
```

倒序遍历容量，保证每个数字只使用一次。

```java
dp[j] = dp[j] || dp[j - num];
```

含义是：

```text
原来就能凑出 j
或者选择当前 num 后，可以从 j - num 转移过来
```

只要有一种方式成立，`dp[j]` 就是 `true`。

```java
if (dp[target]) {
    return true;
}
```

如果已经能凑出 `target`，可以提前返回。

---

## 复杂度分析

二维动态规划：

```text
时间复杂度：O(n * target)
空间复杂度：O(n * target)
```

一维动态规划：

```text
时间复杂度：O(n * target)
空间复杂度：O(target)
```

其中：

```text
target = sum / 2
```

---

## 易错点

### 1. 没有先判断总和是否为奇数

如果总和是奇数，不可能分成两个相等的整数和子集，可以直接返回 `false`。

### 2. 把问题理解成连续子数组

题目要求的是两个子集，不要求连续。

例如：

```text
nums = [1, 5, 11, 5]
```

可以分成：

```text
[1, 5, 5] 和 [11]
```

其中 `[1, 5, 5]` 不需要在原数组中连续。

### 3. 一维 dp 正序遍历

一维 `0-1` 背包必须倒序遍历：

```java
for (int j = target; j >= num; j--)
```

如果正序遍历，就会让当前数字被重复使用，变成完全背包的写法。

### 4. dp[0] 忘记初始化为 true

`dp[0] = true` 是所有状态转移的起点。

如果没有这个初始化，后面任何和都无法被推出来。

---

## 总结

这道题的关键是把“分成两个和相等的子集”转换成：

```text
能不能从数组中选出一些数字，使它们的和等于 sum / 2
```

如果数组总和是奇数，直接返回 `false`。

如果数组总和是偶数，就做一次 `0-1` 背包。

推荐提交一维动态规划写法：

```text
dp[j] 表示能否凑出和 j
dp[j] = dp[j] || dp[j - num]
```

并且容量 `j` 必须倒序遍历，保证每个数字只使用一次。
