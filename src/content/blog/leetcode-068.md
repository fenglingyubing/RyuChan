---
title: ' 在排序数组中查找元素的第一个和最后一个位置'
description: leetcode刷题第三十九天
pubDate: 2026-04-25T12:45
image: /images/leetcode-068/c3b99bc61816e457.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 34. 在排序数组中查找元素的第一个和最后一个位置

## 问题描述

给你一个按照**非递减顺序**排列的整数数组 `nums`，和一个目标值 `target`。

请你找出给定目标值在数组中的**开始位置和结束位置**。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

**要求**：必须设计并实现时间复杂度为 O(log n) 的算法。

**示例：**
```
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]

输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]

输入：nums = [], target = 0
输出：[-1,-1]
```

---

## 问题分析

### 关键信息

1. 数组是**非递减**的（升序，可有重复）
2. 目标值可能重复出现
3. 需要找到**第一次出现**和**最后一次出现**的位置
4. O(log n) → 必须用二分查找

### 核心思路

**不能直接用标准二分查找**，因为：
- 标准二分找到目标就返回
- 但目标是重复的，我们需要找到**边界**

**解法**：分别找左边界和右边界

---

## 解题思路

### 思路一：分别找左边界和右边界

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        return new int[]{findLeftBound(nums, target), findRightBound(nums, target)};
    }

    // 找左边界：第一个 >= target 的位置
    private int findLeftBound(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        // 循环结束后，left 指向第一个 >= target 的位置
        return left < nums.length && nums[left] == target ? left : -1;
    }

    // 找右边界：第一个 > target 的位置 - 1
    private int findRightBound(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        // 循环结束后，right 指向最后一个 <= target 的位置
        return right >= 0 && nums[right] == target ? right : -1;
    }
}
```

### 思路二：先找任意一个 target，再向两边扩展

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int pos = binarySearch(nums, target);
        if (pos == -1) return new int[]{-1, -1};

        int left = pos;
        int right = pos;

        // 向左扩展
        while (left > 0 && nums[left - 1] == target) {
            left--;
        }

        // 向右扩展
        while (right < nums.length - 1 && nums[right + 1] == target) {
            right++;
        }

        return new int[]{left, right};
    }

    private int binarySearch(int[] nums, int target) {
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
        return -1;
    }
}
```

**注意**：思路二的时间复杂度是 **O(log n + k)**，其中 k 是 target 出现的次数，最坏情况是 O(n)。

---

## 复杂度分析

| 思路 | 时间复杂度 | 空间复杂度 |
|------|------------|------------|
| 思路一（两次二分） | O(log n) ✅ | O(1) |
| 思路二（二分+扩展） | O(log n + k) | O(1) |

---

## 图解：找左边界

```
nums = [5,7,7,8,8,10], target = 8

找左边界（第一个 >= 8）：
第1轮：left=0, right=5, mid=2 → nums[2]=7 < 8 → left=3
       [5,7,7,8,8,10]
             ↑
           left

第2轮：left=3, right=5, mid=4 → nums[4]=8 >= 8 → right=3
       [5,7,7,8,8,10]
             ↑     ↑
           left right

第3轮：left=3, right=3, mid=3 → nums[3]=8 >= 8 → right=2
       [5,7,7,8,8,10]
             ↑
          left(right)

循环结束：left=3, right=2
检查 nums[3]==8 → 是！返回 3 ✅
```

## 图解：找右边界

```
nums = [5,7,7,8,8,10], target = 8

找右边界（最后一个小于等于 8）：
第1轮：left=0, right=5, mid=2 → nums[2]=7 <= 8 → left=3
       [5,7,7,8,8,10]
             ↑
           left

第2轮：left=3, right=5, mid=4 → nums[4]=8 <= 8 → left=5
       [5,7,7,8,8,10]
                   ↑
                 left

第3轮：left=5, right=5, mid=5 → nums[5]=10 > 8 → right=4
       [5,7,7,8,8,10]
               ↑
             right

循环结束：left=5, right=4
检查 nums[4]==8 → 是！返回 4 ✅
```

---

## 左边界 vs 右边界 对比

### 左边界模板

```java
// 找第一个 >= target 的位置
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
return left;  // left 就是左边界
```

### 右边界模板

```java
// 找第一个 > target 的位置 - 1
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] <= target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
return right;  // right 就是右边界
```

### 关键区别

| 对比 | 左边界 | 右边界 |
|------|--------|--------|
| 条件 | `nums[mid] < target` | `nums[mid] <= target` |
| 相等时 | `right = mid - 1` | `left = mid + 1` |
| 返回 | `left` | `right` |

---

## 边界情况

### 情况1：数组为空

```java
if (nums.length == 0) return new int[]{-1, -1};
```

### 情况2：target 不存在

```
nums = [5,7,7,8,8,10], target = 9

左边界：left 会停在第一个 >= 9 的位置（索引5），但 nums[5]=10 != 9
右边界：right 会停在最后一个 <= 9 的位置（索引4），但 nums[4]=8 != 9

返回 [-1, -1]
```

### 情况3：target 只出现一次

```
nums = [5,7,8,8,8,10], target = 7

左边界：找到 7，返回 1
右边界：找到 7，返回 1

返回 [1, 1]
```

---

## 总结

### 核心模板

```java
// 找左边界
int left = 0, right = n - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
int leftBound = left;

// 找右边界
left = 0; right = n - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] <= target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
int rightBound = right;
```

### 记忆口诀

```
找左边界：小于往右，不小于往左
找右边界：小于等于往右，大于往左
```

### 关键点

1. 循环条件是 `<=`，不能漏掉最后一个元素
2. 相等时的处理决定是找左边界还是右边界
3. 循环结束后要**检查元素是否等于 target**
