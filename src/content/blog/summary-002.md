---
title: 二分查找算法总结
description: 二分查找算法总结
pubDate: 2026-04-28T13:46
image: /images/summary-002/e7e4e16f5dc002f8.webp
draft: false
tags:
  - LeetCode
  - 算法总结
categories:
  - LeetCode
---
# 二分查找算法总结

## 1. 基础二分查找模板

### 标准模板

```java
int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出

        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 未找到
}
```

### 关键点

- `left <= right`：循环条件
- `mid = left + (right - left) / 2`：优先用这种写法，避免整数溢出
- 根据条件调整边界：+1 或 -1

---

## 2. 二分查找变体分类

### 类型一：寻找左侧边界

找到**第一个** >= target 的位置

```java
int leftBound(int[] nums, int target) {
    int left = 0, right = nums.length;  // right = length（不是 length-1）

    while (left < right) {  // left < right（不是 <=）
        int mid = left + (right - left) / 2;

        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;  // 收缩右边界
        }
    }

    return left;  // left 就是左侧边界
}
```

**应用题目：**
- LeetCode 35: 搜索插入位置
- LeetCode 34: 在排序数组中查找元素的第一个和最后一个位置

---

### 类型二：寻找右侧边界

找到**最后一个** <= target 的位置

```java
int rightBound(int[] nums, int target) {
    int left = 0, right = nums.length;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] <= target) {
            left = mid + 1;  // 收缩左边界
        } else {
            right = mid;
        }
    }

    return left - 1;  // left-1 是右侧边界
}
```

---

### 类型三：旋转排序数组

有序数组旋转后查找目标值

```java
int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        // 左半部分有序
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 右半部分有序
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}
```

**应用题目：**
- LeetCode 33: 搜索旋转排序数组
- LeetCode 81: 搜索旋转排序数组 II（带重复值）

---

### 类型四：二维矩阵搜索

从右上角或左下角开始

```java
// 从右上角开始
boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;

    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] == target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--;
        } else {
            row++;
        }
    }

    return false;
}
```

**应用题目：**
- LeetCode 74: 搜索二维矩阵
- LeetCode 240: 搜索二维矩阵 II

---

### 类型五：寻找第 K 个元素

在两个有序数组中查找第 K 小的元素

```java
double findMedianSortedArrays(int[] nums1, int[] nums2) {
    // 确保 nums1 是较短的数组
    if (nums1.length > nums2.length) {
        int[] temp = nums1;
        nums1 = nums2;
        nums2 = temp;
    }

    int m = nums1.length, n = nums2.length;
    int left = 0, right = m;
    int totalLeft = (m + n + 1) / 2;

    while (left <= right) {
        int i = (left + right) / 2;
        int j = totalLeft - i;

        int nums1Left = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
        int nums1Right = (i == m) ? Integer.MAX_VALUE : nums1[i];
        int nums2Left = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
        int nums2Right = (j == n) ? Integer.MAX_VALUE : nums2[j];

        if (nums1Left <= nums2Right && nums2Left <= nums1Right) {
            // 找到正确划分
            if ((m + n) % 2 == 0) {
                return (double) (Math.max(nums1Left, nums2Left) +
                                Math.min(nums1Right, nums2Right)) / 2;
            } else {
                return (double) Math.max(nums1Left, nums2Left);
            }
        } else if (nums1Left > nums2Right) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }

    return 0.0;
}
```

**应用题目：**
- LeetCode 4: 寻找两个正序数组的中位数
- LeetCode 378: 有序矩阵中第 K 小的元素
- LeetCode 23: 合并 K 个升序链表

---

## 3. 二分答案（求最小/最大）

当答案具有单调性时，可以用二分搜索答案

```java
// 模板：求最小值
int minXXX() {
    int left = minPossible, right = maxPossible;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (check(mid)) {
            right = mid;  // 满足条件，继续找更小的
        } else {
            left = mid + 1;
        }
    }

    return left;
}

// 模板：求最大值
int maxXXX() {
    int left = minPossible, right = maxPossible;

    while (left < right) {
        int mid = left + (right - left + 1) / 2;  // 上取整，避免死循环

        if (check(mid)) {
            left = mid;  // 满足条件，继续找更大的
        } else {
            right = mid - 1;
        }
    }

    return left;
}
```

**应用题目：**
- LeetCode 69: x 的平方根
- LeetCode 367: 有效的完全平方数
- LeetCode 875: 爱吃香蕉的珂珂
- LeetCode 410: 分割数组的最大值

---

## 4. 常见 LeetCode 题目汇总

| 题目 | 难度 | 类型 | 关键点 |
|------|------|------|--------|
| 704 二分查找 | 简单 | 基础 | 标准模板 |
| 35 搜索插入位置 | 简单 | 左边界 | 返回插入位置 |
| 34 查找元素范围 | 中等 | 左右边界 | 找第一个和最后一个 |
| 33 搜索旋转数组 | 中等 | 旋转数组 | 判断哪半有序 |
| 74 搜索二维矩阵 | 中等 | 二维搜索 | 从右上角开始 |
| 4 寻找中位数 | 困难 | 双数组 | 二分划分 |
| 69 x 的平方根 | 简单 | 二分答案 | 整数平方根 |
| 367 有效完全平方数 | 简单 | 二分答案 | 判断完全平方 |
| 875 吃香蕉珂珂 | 中等 | 二分答案 | 速度问题 |
| 410 分割数组最大值 | 困难 | 二分答案 | 最大值最小化 |

---

## 5. 关键技巧总结

### 技巧一：防止整数溢出

```java
// 错误：可能溢出
int mid = (left + right) / 2;

// 正确
int mid = left + (right - left) / 2;
```

### 技巧二：上取整 vs 下取整

```java
// 下取整（标准）
int mid = left + (right - left) / 2;

// 上取整（避免死循环）
int mid = left + (right - left + 1) / 2;
```

什么时候用上取整？
- 当 left = mid 时（下边界更新为 mid）
- 需要避免 left 始终等于 mid 导致死循环

### 技巧三：边界值处理

```java
// 处理 i == 0 或 i == m 的情况
int nums1Left = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
int nums1Right = (i == m) ? Integer.MAX_VALUE : nums1[i];
```

### 技巧四：单调性判断

```
如果发现满足条件的边界后，答案在左边：
  → right = mid - 1

如果发现满足条件的边界后，答案在右边：
  → left = mid + 1
```

---

## 6. 模板选择指南

```
┌─────────────────────────────────────────────────────────┐
│                    如何选择模板？                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 简单查找（找 target）：                              │
│     → 标准模板 left <= right                            │
│                                                         │
│  2. 找左侧边界（第一个 >= target）：                     │
│     → left < right, right = mid                         │
│                                                         │
│  3. 找右侧边界（最后一个 <= target）：                   │
│     → left < right, left = mid, return left-1           │
│                                                         │
│  4. 旋转数组：                                          │
│     → 判断哪半有序，再判断 target 在哪半                  │
│                                                         │
│  5. 二维矩阵：                                          │
│     → 从右上角或左下角开始                               │
│                                                         │
│  6. 双数组找第 K 个：                                   │
│     → 二分划分，保持 max(left) <= min(right)           │
│                                                         │
│  7. 二分答案：                                          │
│     → 先确定答案范围，再二分验证                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. 复杂度分析

| 类型 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 基础二分 | O(log n) | O(1) |
| 旋转数组 | O(log n) | O(1) |
| 二维矩阵 | O(m + n) | O(1) |
| 双数组中位数 | O(log min(m,n)) | O(1) |
| 二分答案 | O(log 答案范围) | O(1) |