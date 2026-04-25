---
title: 搜索二维矩阵
description: leetcode刷题第三十九天
pubDate: 2026-04-25T12:07
image: /images/leetcode-067/466758618441ffe1.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 74. 搜索二维矩阵

## 问题描述

给你一个满足下述两条属性的 m x n 整数矩阵：

1. **每行中的整数从左到右按非严格递增顺序排列**
2. **每行的第一个整数大于前一行的最后一个整数**

给你一个整数 target，如果 target 在矩阵中，返回 true；否则，返回 false。

**示例：**
```
输入：
matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
target = 3

输出：true
```

---

## 问题分析

### 关键性质

1. 每行递增
2. **每行第一个 > 前一行最后一个**

第二条性质非常重要！这意味着：

```
矩阵可以"展开"成一个有序的一维数组：

[1,  3,  5,  7]
[10, 11, 16, 20]   →   [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]
[23, 30, 34, 60]
```

整个矩阵是有序的！

---

## 解题思路

### 解法一：标准二分查找（推荐）

利用"展开"的思想，把二维矩阵当成一维数组。

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;

        int left = 0;
        int right = rows * cols - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midValue = matrix[mid / cols][mid % cols];

            if (midValue == target) {
                return true;
            } else if (midValue < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return false;
    }
}
```

**核心转换**：
```
一维索引 mid → 二维索引
row = mid / cols
col = mid % cols
```

### 解法二：搜索二维矩阵（Z字形）

从右上角开始，根据大小关系向左或向下搜索。

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;

        int row = 0;
        int col = cols - 1;  // 从右上角开始

        while (row < rows && col >= 0) {
            if (matrix[row][col] == target) {
                return true;
            } else if (matrix[row][col] < target) {
                row++;  // 向下
            } else {
                col--;  // 向左
            }
        }

        return false;
    }
}
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|------------|------------|
| 二分查找 | O(log(m × n)) | O(1) |
| Z字形搜索 | O(m + n) | O(1) |

**二分查找更优！** 时间复杂度从 O(m + n) 降到 O(log(m × n))。

---

## 图解：二分查找

```
matrix = [
  [1,  3,  5,  7 ],   → 索引 0, 1, 2, 3
  [10, 11, 16, 20],   → 索引 4, 5, 6, 7
  [23, 30, 34, 60]    → 索引 8, 9, 10, 11
]

target = 5

展开后：[1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]
                  ↑
               索引2

二分过程：
left=0, right=11, mid=5 → matrix[5/4][5%4] = matrix[1][1] = 11 > 5 → right=4
left=0, right=4, mid=2 → matrix[2/4][2%4] = matrix[0][2] = 5 == 5 → return true ✅
```

---

## 图解：Z字形搜索

```
matrix = [
  [1,  3,  5,  7 ],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]

target = 5

第1步：从右上角 (0,3) = 7 开始
       7 > 5 → 向左走

第2步：(0,2) = 5
       5 == 5 → 找到！ ✅

搜索路径：
7 → 5 ✓
```

---

## 易错点

### 1. 二分查找的边界

```java
// 正确：right = rows * cols - 1
int right = rows * cols - 1;

// 错误：right = rows * cols（会越界）
int right = rows * cols;
```

### 2. 一维到二维的转换

```java
// 正确：
int row = mid / cols;
int col = mid % cols;

// 容易写反：
int row = mid % cols;  // ❌
int col = mid / cols;  // ❌
```

---

## 对比总结

| 方法 | 思路 | 时间复杂度 | 代码复杂度 |
|------|------|------------|------------|
| 二分查找 | 把矩阵当一维数组 | O(log(m×n)) ✅ | 稍复杂 |
| Z字形 | 从右上角向左下搜索 | O(m+n) | 简单 |

---

## 你写的代码分析

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;

        int rowIndex = 0;
        int colIndex = cols - 1;  // 从右上角开始
        while(rowIndex < rows && colIndex >= 0 ){
            if(matrix[rowIndex][colIndex] == target){
                return true;
            } else if(matrix[rowIndex][colIndex] < target){
                rowIndex++;   // 向下
            } else{
                colIndex--;   // 向左
            }
        }
        return false;
    }
}
```

**评价**：这是Z字形搜索，时间复杂度是 O(m + n)，能通过但**不是最优解**。

---

## 最优解

**二分查找才是最优解**，时间复杂度 O(log(m × n))：

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int left = 0, right = rows * cols - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / cols][mid % cols];

            if (val == target) return true;
            else if (val < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}
```

---

## 结论

| 问题 | 答案 |
|------|------|
| 你的代码是Z字形搜索吗？ | ✅ 是的 |
| 能通过LeetCode吗？ | ✅ 能 |
| 是最优解吗？ | ❌ 不是 |
| 最优解是什么？ | 二分查找 O(log(m×n)) |

**建议**：面试时能写出两种解法会加分，但最优解是二分查找。