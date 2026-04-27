---
title: 寻找旋转排序数组的最小值
description: leetcode刷题第四十一天
pubDate: 2026-04-27T10:15
image: /images/leetcode-070/3b67008f160c74cc.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 153. 寻找旋转排序数组中的最小值

## 题目描述

已知一个长度为 n 的升序数组，经过 1 到 n 次旋转后，得到输入数组。找出旋转数组中的最小元素。

**示例：**
```
原数组: [0,1,2,4,5,6,7]
旋转4次: [4,5,6,7,0,1,2]
旋转7次: [0,1,2,4,5,6,7]  (相当于没旋转)
```

## 核心思路：二分查找

### 关键观察

旋转后的数组分为两个有序部分：
```
[4,5,6,7,0,1,2]
 ----左半部分----  ----右半部分----
```
- **左半部分**：所有元素 >= 最小元素
- **右半部分**：所有元素 < 最小元素（最小元素是这部分的首元素）

### 二分查找策略

**比较 nums[mid] 和 nums[right]：**

| 情况 | 说明 | 搜索范围 |
|------|------|----------|
| `nums[mid] > nums[right]` | 最小值在右半部分（mid不在最小值所在的有序段） | left = mid + 1 |
| `nums[mid] <= nums[right]` | 最小值在左半部分（mid可能是最小值或最小值在左边） | right = mid |

### 为什么用 `right` 而不是 `left`？

- 旋转数组的最小值**右侧**（不包括自身）一定都是**大于等于**它的值
- 而左侧可能有更小的值
- 使用 `right` 可以更准确地排除元素

## 图解过程

以 `nums = [4,5,6,7,0,1,2]` 为例：

```
Step 1: left=0, right=6, mid=3
        [4,5,6,7,0,1,2]
            ↑
         nums[3]=7 > nums[6]=2
         → 最小值在右侧，left = 3+1 = 4

Step 2: left=4, right=6, mid=5
        [4,5,6,7,0,1,2]
                    ↑
         nums[5]=1 > nums[6]=2
         → 最小值在右侧，left = 5+1 = 6

Step 3: left=6, right=6, mid=6
        [4,5,6,7,0,1,2]
                     ↑
         nums[6]=2 <= nums[6]=2
         → 最小值在左侧，right = 6

Step 4: left=6, right=6，循环结束
        返回 nums[6] = 2 ✓
```

## Java 代码实现

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                // 最小值在右半部分
                left = mid + 1;
            } else {
                // 最小值在左半部分（包括mid位置）
                right = mid;
            }
        }

        return nums[left];
    }
}
```

## 复杂度分析

| 复杂度 | 值 | 说明 |
|--------|-----|------|
| 时间 | O(log n) | 每次搜索范围缩小一半 |
| 空间 | O(1) | 只使用常数个变量 |

## 边界情况处理

1. **未旋转的情况**：`[1,2,3]` → 二分查找仍正确，返回第一个元素
2. **单元素**：`[1]` → 循环不执行，直接返回 `nums[0]`
3. **两元素**：`[2,1]` → 正确处理 `nums[mid] > nums[right]` 的情况

## 关键点总结

1. **旋转数组特征**：分为两个有序部分，最小值是第二部分的首元素
2. **二分查找核心**：比较 `nums[mid]` 和 `nums[right]`
3. **为什么用 right**：`right` 指向的值是当前搜索范围的最大值，便于判断最小值位置
4. **终止条件**：`left == right`，该位置即为最小值位置
