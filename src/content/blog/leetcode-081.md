---
title: 买卖股票的最佳时机
description: leetcode刷题第四十八天
pubDate: 2026-05-08T12:49
image: /images/leetcode-081/94f6fe255157578a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 121. 买卖股票的最佳时机

## 题目描述

> 给定一个数组 `prices`，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。
>
> 你只能选择**某一天买入**，并选择在**未来某一个不同的日子卖出**。
>
> 设计一个算法来计算你所能获取的**最大利润**。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0`。

**示例：**
```
输入: prices = [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天买入（价格=1），第 5 天卖出（价格=6），利润 = 6-1 = 5

输入: prices = [7,6,4,3,1]
输出: 0
解释: 不可能获得利润，返回 0
```

---

## 解法一：暴力法（不推荐）

### 代码

```java
class Solution {
    public int maxProfit(int[] prices) {
        int maxProfit = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                int profit = prices[j] - prices[i];
                if (profit > maxProfit) {
                    maxProfit = profit;
                }
            }
        }
        return maxProfit;
    }
}
```

### 复杂度

| 指标 | 复杂度 |
|------|--------|
| 时间 | O(n²) |
| 空间 | O(1) |

### 问题

双重循环，数据量大时会超时。

---

## 解法二：一次遍历（推荐）⭐

### 核心思想

**找到最小的买入价格，同时计算最大的利润。**

遍历数组时：
1. 记录**到目前为止的最低价格**（minPrice）
2. 用**当前价格 - 最低价格**得到潜在利润
3. 更新**最大利润**（maxProfit）

### 代码

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) {
            return 0;
        }

        int minPrice = Integer.MAX_VALUE;  // 记录最低价格
        int maxProfit = 0;                  // 记录最大利润

        for (int price : prices) {
            // 更新最低价格
            if (price < minPrice) {
                minPrice = price;
            }

            // 计算当前利润，并更新最大利润
            int currentProfit = price - minPrice;
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
            }
        }

        return maxProfit;
    }
}
```

### 复杂度

| 指标 | 复杂度 |
|------|--------|
| 时间 | O(n) |
| 空间 | O(1) |

---

## 图解示例

### 示例 1: `prices = [7,1,5,3,6,4]`

```
天数:     0   1   2   3   4   5
价格:    [7,  1,  5,  3,  6,  4]
          ↓
        minPrice = 1（第1天最低）
                  ↓
        最大利润 = 6 - 1 = 5（第5天卖出）

遍历过程:
i=0: price=7, minPrice=7,   profit=0,  maxProfit=0
i=1: price=1, minPrice=1,   profit=0,  maxProfit=0
i=2: price=5, minPrice=1,   profit=4,  maxProfit=4
i=3: price=3, minPrice=1,   profit=2,  maxProfit=4
i=4: price=6, minPrice=1,   profit=5,  maxProfit=5  ← 最大
i=5: price=4, minPrice=1,   profit=3,  maxProfit=5

答案: 5
```

### 示例 2: `prices = [7,6,4,3,1]`

```
天数:     0   1   2   3   4
价格:    [7,  6,  4,  3,  1]
          ↓
        持续下跌，没有利润

遍历过程:
i=0: price=7, minPrice=7,   profit=0,  maxProfit=0
i=1: price=6, minPrice=6,   profit=0,  maxProfit=0
i=2: price=4, minPrice=4,   profit=0,  maxProfit=0
i=3: price=3, minPrice=3,   profit=0,  maxProfit=0
i=4: price=1, minPrice=1,   profit=0,  maxProfit=0

答案: 0
```

---

## 更简洁的写法

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
}
```

一行搞定：
- `Math.min(minPrice, price)` - 更新最低价
- `Math.max(maxProfit, price - minPrice)` - 更新最大利润

---

## 思路总结

### 核心公式

```
最大利润 = 卖价 - 买价
         = 当前价格 - 最低价格
```

### 为什么这样正确？

因为：
1. **买价必须在卖价之前** - 我们用 minPrice 记录"到目前为止"的最低价格，它一定在当前价格之前
2. **最大利润 = 最大(卖价 - 买价)** - 我们遍历时不断更新最大利润

---

## 一句话总结

> 遍历数组，用**最低价格**和**最大利润**两个变量，找到最小买入日和最大卖出日的差值。

---

## 相关题目

| 题目 | 难度 | 说明 |
|------|------|------|
| 121. 买卖股票的最佳时机 | 简单 | 本题，只能买卖一次 |
| 122. 买卖股票的最佳时机 II | 中等 | 可以买卖多次 |
| 123. 买卖股票的最佳时机 III | 困难 | 最多买卖两次 |
| 188. 买卖股票的最佳时机 IV | 困难 | 最多买卖 k 次 |