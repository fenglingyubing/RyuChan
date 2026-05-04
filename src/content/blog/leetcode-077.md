---
title: 柱状图中最大的矩形面积
description: leetcode刷题第四十五天
pubDate: 2026-05-04T15:57
image: /images/leetcode-077/ab05cc5b9863d8fd.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #84 - 柱状图中最大的矩形

## 题目描述

给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

**示例：**
```
输入: heights = [2,1,5,6,2,3]
输出: 10
解释: 最大矩形由高度=2（索引0和1）的两列组成，宽度=5，面积=10

     _
   _| |
 _| | |   ← 高度2，宽度5，面积=10
| | | | |

输入: heights = [2,4]
输出: 4
```

---

## 解题思路

### 方法一：暴力枚举（O(n²)）

对每个柱子，向左向右扩展，找出能形成的最大矩形：

```java
// 暴力解法（会超时）
for (int i = 0; i < n; i++) {
    int left = i, right = i;
    while (left > 0 && heights[left-1] >= heights[i]) left--;
    while (right < n-1 && heights[right+1] >= heights[i]) right++;
    area = heights[i] * (right - left + 1);
}
```

### 方法二：单调栈（推荐，O(n)）

**核心思想**：
- 使用单调递增栈
- 当遇到比栈顶矮的柱子时，说明栈顶柱子的"右边边界"找到了
- 弹出栈顶，计算以其为高度的矩形最大宽度

---

## 单调栈核心原理

### 为什么用单调递增栈？

```
柱状图: [2, 1, 5, 6, 2, 3]
         ↑
       栈顶

当遇到高度 2（比栈顶 6 小）时：
→ 说明 6 的"右边边界"找到了（索引4）
→ 6 可以向左扩展到索引2（高度5）
→ 6 的最大宽度 = 4 - 2 = 2
→ 以 6 为高度的矩形面积 = 6 × 2 = 12
```

### 关键洞察

对于栈中的每个柱子：
- 它左边第一个比它矮的 = 栈中下一个元素
- 它右边第一个比它矮的 = 当前遍历到的元素

```
栈中: [2, 1, 5, 6]
           ↑    ↑
         左边界  右边界（遇到更矮的2）

6 的左边比它矮的是 1（索引1）
6 的右边比它矮的是 2（索引4）
宽度 = 4 - 1 - 1 = 2
```

---

## 图解过程

### 示例：heights = [2, 1, 5, 6, 2, 3]

```
步骤    高度    操作                    栈      计算
─────────────────────────────────────────────────────
 0       2      入栈                   [0]
 1       1      1<2，弹出0计算          []
         1      入栈                   [1]
 2       5      5>1，入栈              [1,2]
 3       6      6>5，入栈              [1,2,3]
 4       2      2<6，弹出3计算          [1,2]
                2<5，弹出2计算          [1]
                2>1，入栈              [1,4]
 5       3      3>2，入栈              [1,4,5]
         -      结束，弹出剩余         []

最终栈为空，处理边界情况
```

### 计算过程详解

```
第4步：遇到高度2

栈: [1, 2, 3]  对应高度 [1, 5, 6]

弹出 6（索引3）:
  左边界 = 2（左边的下一个）
  右边界 = 4（当前索引）
  宽度 = 4 - 2 - 1 = 1
  面积 = 6 × 1 = 6

弹出 5（索引2）:
  左边界 = 1
  右边界 = 4
  宽度 = 4 - 1 - 1 = 2
  面积 = 5 × 2 = 10  ← 最大

高度2入栈后:
栈: [1, 4]
```

---

## 边界处理技巧

### 问题：如何在 O(n) 内处理所有情况？

**方法：在数组两端加 0**

```
原数组: [2, 1, 5, 6, 2, 3]
加0后:  [0, 2, 1, 5, 6, 2, 3, 0]

这样：
- 开头加0：确保所有元素都能入栈
- 结尾加0：确保所有元素都能被弹出计算
```

### 图解

```
[0, 2, 1, 5, 6, 2, 3, 0]
 ↑                     ↑
虚拟0               虚拟0

最终所有元素都会被弹出并计算
```

---

## Java 代码实现

### 方法一：单调栈 + 首尾加0

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        if (n == 0) return 0;

        // 在首尾各加一个0，处理边界情况
        int[] newHeights = new int[n + 2];
        newHeights[0] = 0;
        System.arraycopy(heights, 0, newHeights, 1, n);
        newHeights[n + 1] = 0;

        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;

        for (int i = 0; i < newHeights.length; i++) {
            // 遇到比栈顶矮的，弹出并计算
            while (!stack.isEmpty() && newHeights[i] < newHeights[stack.peek()]) {
                int height = newHeights[stack.pop()];
                int width = i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }

        return maxArea;
    }
}
```

### 方法二：手动处理边界（不使用加0技巧）

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;

        for (int i = 0; i < n; i++) {
            // 弹出所有 >= 当前高度的柱子
            while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width;

                if (stack.isEmpty()) {
                    // 没有左边界，宽 = i
                    width = i;
                } else {
                    // 左边界在 stack.peek()，右边界是 i
                    width = i - stack.peek() - 1;
                }

                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }

        // 处理栈中剩余元素
        while (!stack.isEmpty()) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? n : n - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }

        return maxArea;
    }
}
```

### 方法三：使用 Stack<Integer>

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Stack<Integer> stack = new Stack<>();
        int maxArea = 0;

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {
                int h = heights[stack.pop()];
                int w = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, h * w);
            }
            stack.push(i);
        }

        while (!stack.isEmpty()) {
            int h = heights[stack.pop()];
            int w = stack.isEmpty() ? n : n - stack.peek() - 1;
            maxArea = Math.max(maxArea, h * w);
        }

        return maxArea;
    }
}
```

---

## 代码图解

```java
while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {
    int height = heights[stack.pop()];
    int width = i - stack.peek() - 1;
    maxArea = Math.max(maxArea, height * width);
}
```

```
弹出时：
         i=4（当前索引）
          ↓
栈: [1, 2, 3]  对应高度 [1, 5, 6]

弹出 height=6, index=3:
  左边界 = 2  (栈顶)
  宽度 = 4 - 2 - 1 = 1
  面积 = 6 × 1 = 6

弹出 height=5, index=2:
  左边界 = 1
  宽度 = 4 - 1 - 1 = 2
  面积 = 5 × 2 = 10  ← 更新 maxArea
```

---

## 复杂度分析

| 方法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力枚举 | O(n²) | O(1) |
| 单调栈 | O(n) | O(n) |
| 分治法 | O(n log n) | O(log n) |

---

## 关键点总结

### 1. 为什么要加 0？

```
首尾加0 = 虚拟的最低柱子
→ 确保所有柱子都能被弹出计算
→ 简化边界处理
```

### 2. 单调栈的核心逻辑

```
单调递增栈：栈中高度越来越高

遇到更矮的 → 弹出栈顶，计算以它为高度的最大矩形
```

### 3. 计算公式

```
弹出索引 i 时：
高度 = heights[i]
左边界 = 栈顶（第一个更矮的索引）
右边界 = 当前遍历到的索引
宽度 = right - left - 1
面积 = height × width
```

### 4. 与接雨水问题的对比

| 问题 | 方向 | 核心 |
|------|------|------|
| 接雨水 | 找能接多少水 | 单调递减栈 |
| 最大矩形 | 找最大面积 | 单调递增栈 |

---

## 扩展题目

| 题目 | 难度 | 说明 |
|------|------|------|
| 84 柱状图中最大矩形 | 困难 | 本题 |
| 85 最大矩形 | 困难 | 二维矩阵版 |
| 42 接雨水 | 困难 | 单调栈延伸 |
| 739 每日温度 | 中等 | 单调栈基础 |
| 496 下一个更大元素 | 简单 | 单调栈基础 |