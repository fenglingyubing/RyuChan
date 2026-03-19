---
title: 接雨水
description: leetcode刷题第十一天
pubDate: 2026-03-19T18:56
image: /images/leetcode-014/e58996b3747a8b86.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
## 题目说明

给定一个非负整数数组 `height`，其中每个元素表示柱子的高度，每个柱子的宽度都为 `1`。下雨之后，柱子之间可能会积水，要求计算总共能接多少雨水。

例如：

```java
int[] height = {0,1,0,2,1,0,1,3,2,1,2,1};
```

结果为：

```java
6
```

## 解题公式

对于位置 `i`，它能接的雨水取决于它左边最高的柱子和右边最高的柱子中较矮的那一个：

```java
water[i] = Math.min(leftMax, rightMax) - height[i]
```

- `leftMax` 是 `i` 左边的最高柱子
- `rightMax` 是 `i` 右边的最高柱子

如果结果小于等于 `0`，说明这个位置不能存水。

## 双指针解法

双指针的做法是：

- 用 `left` 指向最左边
- 用 `right` 指向最右边
- 用 `leftMax` 维护左侧遍历过程中遇到的最高柱子
- 用 `rightMax` 维护右侧遍历过程中遇到的最高柱子

每次比较 `height[left]` 和 `height[right]`：

- 如果左边更矮，就处理左边
- 如果右边更矮或一样高，就处理右边

原因是：较矮的一侧决定当前这一步的蓄水上限，所以可以先结算这一侧。

## 代码

```java
class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int ans = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    ans += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    ans += rightMax - height[right];
                }
                right--;
            }
        }
        return ans;
    }
}
```

## 代码讲解

### 1. 初始化

```java
int left = 0, right = height.length - 1;
int leftMax = 0, rightMax = 0;
int ans = 0;
```

- `left` 和 `right` 从两端向中间靠拢
- `leftMax` 表示左侧最高柱
- `rightMax` 表示右侧最高柱
- `ans` 用来累计总雨水

### 2. 为什么要比较两端高度

```java
if (height[left] < height[right])
```

当左边当前柱子更矮时，说明左边当前位置右侧一定存在一个至少不低于它的挡板，因此左边这一格此时能接多少水，只需要看左侧最高柱 `leftMax`。

这时有两种情况：

- 如果 `height[left] >= leftMax`，当前位置不能接水，只需要更新 `leftMax`
- 如果 `height[left] < leftMax`，当前位置可以接 `leftMax - height[left]` 的水

右边同理。

### 3. 左侧处理

```java
if (height[left] >= leftMax) {
    leftMax = height[left];
} else {
    ans += leftMax - height[left];
}
left++;
```

含义是：

- 当前柱子更高，就刷新左侧最高值
- 当前柱子更低，就产生积水
- 处理完成后左指针右移

### 4. 右侧处理

```java
if (height[right] >= rightMax) {
    rightMax = height[right];
} else {
    ans += rightMax - height[right];
}
right--;
```

逻辑与左侧对称。

## 为什么这种方法正确

双指针的关键结论是：

- 谁更矮，就先处理谁

因为较矮的一侧会成为当前这一步的限制条件。  
如果 `height[left] < height[right]`，那么左边当前位置的右侧边界已经足够高，左边这格的蓄水量只由 `leftMax` 决定。  
反过来，如果右边更矮，就优先处理右边。

这样不需要额外数组记录每个位置左右最大值，也能在线性时间内完成计算。

## 复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

原因是左右指针都只遍历一次数组，并且只使用了常数级额外变量。

## 总结

这道题最核心的理解是：

- 每个位置的积水量由左右最大高度中较小的那个决定
- 双指针通过“谁矮先处理谁”把这个结论转化成了线性扫描

因此，双指针是这道题最常用、也最稳妥的解法。
