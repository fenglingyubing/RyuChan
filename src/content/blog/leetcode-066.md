---
title: 搜索插入位置
description: leetcode刷题第三十九天
pubDate: 2026-04-25T12:05
image: /images/leetcode-066/11ec81bb6a6d6fad.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 35. 搜索插入位置

## 问题描述

给定一个**排序数组**和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

**要求**：必须使用时间复杂度为 O(log n) 的算法。

**示例：**
```
输入：nums = [1,3,5,6], target = 5
输出：2

输入：nums = [1,3,5,6], target = 2
输出：1  （2应该插入在索引1的位置）

输入：nums = [1,3,5,6], target = 7
输出：4  （7应该插入在末尾）

输入：nums = [1,3,5,6], target = 0
输出：0  （0应该插入在开头）
```

---

## 问题分析

### 关键信息

1. **排序数组**：数组已经有序，这是二分查找的前提
2. **O(log n)**：必须使用二分查找
3. **插入位置**：目标不存在时，返回它应该插入的位置

### 核心思路

二分查找的标准模板：

```
left = 0, right = n - 1

while (left <= right) {
    mid = (left + right) / 2

    if (nums[mid] == target) {
        return mid  // 找到目标
    } else if (nums[mid] < target) {
        left = mid + 1  // 目标在右半部分
    } else {
        right = mid - 1  // 目标在左半部分
    }
}

return left  // left 就是插入位置
```

### 为什么返回 left？

当循环结束时：
- `left > right`
- 所有小于 target 的元素都在 left 左侧
- `left` 就是 target 应该插入的位置

---

## Java 代码实现

### 解法一：标准二分查找

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

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

        // 循环结束时，left 就是插入位置
        return left;
    }
}
```

### 解法二：左边界二分查找

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length;  // 注意：right = n，不是 n-1

        while (left < right) {  // 注意：是 <，不是 <=
            int mid = left + (right - left) / 2;

            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }
}
```

### 解法三：直接遍历（不推荐，不满足 O(log n)）

```java
// 虽然简单，但时间复杂度是 O(n)，不满足要求
class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) {
                return i;
            }
        }
        return nums.length;
    }
}
```

---

## 复杂度分析

| 复杂度 | 说明 |
|--------|------|
| **时间复杂度** | O(log n)，每次搜索范围减半 |
| **空间复杂度** | O(1)，只用了几个指针变量 |

---

## 详细图解

### 示例：nums = [1,3,5,6], target = 2

```
初始状态：
left = 0, right = 3

第1轮：
mid = (0 + 3) / 2 = 1
nums[1] = 3 > 2 → right = 0

    [1, 3, 5, 6]
      ↑     ↑
    left  right(mid)

第2轮：
left = 0, right = 0
mid = 0
nums[0] = 1 < 2 → left = 1

    [1, 3, 5, 6]
          ↑  ↑
       left(right)

第3轮：
left = 1, right = 0
left > right → 循环结束

返回 left = 1
```

### 示例：nums = [1,3,5,6], target = 5

```
第1轮：
left=0, right=3, mid=1
nums[1]=3 < 5 → left=2

    [1, 3, 5, 6]
          ↑  ↑
       mid  left

第2轮：
left=2, right=3, mid=2
nums[2]=5 == 5 → return 2 ✅
```

---

## 二分查找模板总结

### 模板一：找目标值（存在返回索引，不存在返回 -1）

```java
int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 没找到
}
```

### 模板二：找插入位置（本题适用）

```java
int searchInsert(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return left;  // 返回 left，不是 -1
}
```

---

## 易错点

### 1. 整数溢出

```java
// 错误：可能溢出
int mid = (left + right) / 2;

// 正确：使用这种方式
int mid = left + (right - left) / 2;
```

### 2. 循环条件

```java
// 模板一（找目标）：left <= right
while (left <= right)

// 模板二（找插入）：left <= right，最后 return left
while (left <= right)
// ...
return left;
```

### 3. 更新边界

```java
// 错误：容易死循环
left = mid;
right = mid;

// 正确：
left = mid + 1;
right = mid - 1;
```

---

## 总结

**核心思想**：在有序数组中，使用二分查找定位目标或插入位置。

**关键点**：
1. 循环条件 `left <= right`
2. 更新边界 `mid + 1` 和 `mid - 1`
3. 找不到时返回 `left`

**模板记忆**：

```
left=0, right=n-1
while(left <= right):
    mid = left + (right-left)/2
    if 等于: return mid
    if 小于: left = mid + 1
    if 大于: right = mid - 1
return left
```
