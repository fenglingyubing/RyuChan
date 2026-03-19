---
title: 盛更多水的容器
description: leetcode刷题第十一天
pubDate: 2026-03-19T13:49
image: /images/leetcode-012/c0b7a1c4a24c8a7a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 盛更多水的容器

## 题目

给定一个长度为 `n` 的整数数组 `height`。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])`。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水，返回容器可以储存的最大水量。

## 解题思路

这道题适合使用双指针。

- 左指针从数组头部开始，右指针从数组尾部开始。
- 每次计算当前两条线形成的面积：

```java
面积 = (right - left) * min(height[left], height[right])
```

- 容器的高度由较短的那条线决定，因此每次应当移动较短的一边。
- 如果移动较高的一边，宽度一定变小，而短板没有改变，面积不可能变得更大。

这样就能在一次遍历中找到最大面积。

## 这种解法的优点

- 时间复杂度是 `O(n)`，比暴力枚举的 `O(n^2)` 高效很多。
- 空间复杂度是 `O(1)`，只使用了常量级额外空间。
- 思路清晰，抓住了“短板决定容量”的核心性质。
- 属于这道题的经典最优解，适合面试和笔试场景。

## 原写法存在的问题

- 变量命名不够直观，例如 `i`、`index` 不如 `left`、`right` 易读。
- `high` 变量没有被使用，属于冗余代码。
- 使用三元表达式手动更新最大值，可读性一般，也有重复计算。
- `if/else` 两个分支都包含面积更新逻辑，代码重复度偏高。
- 从工程代码角度看，没有显式处理空数组或长度不足的情况，不过在算法题环境下一般可以接受。

## 完整代码

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxArea = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int area = h * (right - left);
            maxArea = Math.max(maxArea, area);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxArea;
    }
}
```
