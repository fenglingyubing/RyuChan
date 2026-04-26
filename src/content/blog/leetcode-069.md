---
title: 搜索旋转数组
description: leetcode刷题第四十天
pubDate: 2026-04-26T15:41
image: /images/leetcode-069/63d0c99b6878ea31.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 33. 搜索旋转排序数组

## 题目描述

整数数组 `nums` 按升序排列，数组中的值互不相同。在传递给函数之前，数组在某个下标 `k`（0 <= k < nums.length）上进行了向左旋转。

给你旋转后的数组 `nums` 和一个整数 `target`，如果 `nums` 中存在目标值 `target`，则返回它的下标，否则返回 `-1`。

**要求：时间复杂度为 O(log n)**

## 示例

```
示例 1:
输入: nums = [4,5,6,7,0,1,2], target = 0
输出: 4

示例 2:
输入: nums = [4,5,6,7,0,1,2], target = 3
输出: -1

示例 3:
输入: nums = [1], target = 0
输出: -1
```

## 核心思路

### 关键观察

旋转后的数组虽然整体无序，但存在一个重要特性：**至少有一半是有序的**。

以 `[4,5,6,7,0,1,2]` 为例：
- 左半边 `[4,5,6,7]` 是有序的
- 右半边 `[0,1,2]` 也是有序的
- 无论旋转点在哪里，总有一半是有序的

### 二分查找策略

每次将数组分成两部分时，**一定有一半是有序的**。我们只需要判断 `target` 是否在有序的那一半中：

```
        mid
         ↓
[4, 5, 6, 7, 0, 1, 2]
 ↑_____________↑   左半边有序
              ↑_____↑   右半边有序
```

**判断哪边有序：**
- 如果 `nums[left] <= nums[mid]`，说明左半边 `[left, mid]` 是升序的
- 否则，右半边 `[mid, right]` 是升序的

**判断 target 在哪边：**
- 确定有序区间后，检查 `target` 是否在该区间内
- 如果在，缩小该区间范围；如果不在，搜索另一侧

## 代码实现

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // 找到目标
            if (nums[mid] == target) {
                return mid;
            }

            // 判断哪半边是有序的
            if (nums[left] <= nums[mid]) {
                // 左半边 [left, mid) 是有序的
                // 判断 target 是否在左半边
                if (nums[left] <= target && target < nums[mid]) {
                    // target 在左半边，缩小右边界
                    right = mid - 1;
                } else {
                    // target 在右半边，缩小左边界
                    left = mid + 1;
                }
            } else {
                // 右半边 [mid, right] 是有序的
                // 判断 target 是否在右半边
                if (nums[mid] < target && target <= nums[right]) {
                    // target 在右半边，缩小左边界
                    left = mid + 1;
                } else {
                    // target 在左半边，缩小右边界
                    right = mid - 1;
                }
            }
        }

        // 未找到目标
        return -1;
    }
}
```

## 图解过程

以 `nums = [4,5,6,7,0,1,2]`, `target = 0` 为例：

### 第一轮
```
[4, 5, 6, 7, 0, 1, 2]
 ↑           ↑     ↑
left        mid   right

nums[left]=4, nums[mid]=7
左半边 [4,5,6,7] 是有序的
target=0 不在 [4,7) 范围内
→ 搜索右半边
```

### 第二轮
```
[4, 5, 6, 7, 0, 1, 2]
              ↑  ↑  ↑
             mid right
             left

nums[left]=0, nums[mid]=1
左半边 [0,1] 是有序的
target=0 在 [0,1) 范围内
→ 搜索左半边
```

### 第三轮
```
[4, 5, 6, 7, 0, 1, 2]
              ↑
             mid
             ↑
           left=right

nums[mid]=0 == target
返回 4
```

## 复杂度分析

| 复杂度 | 分析 |
|--------|------|
| **时间复杂度** | O(log n) - 每次搜索范围减半 |
| **空间复杂度** | O(1) - 只使用了常数个变量 |

## 边界情况处理

1. **数组长度为1**：`left == right == 0`，直接比较
2. **未旋转的数组**：k=0 的情况，此时整个数组有序
3. **完全旋转**：k = n-1，如 `[1,2,3]` → `[3,1,2]`
4. **target不存在**：遍历完成后返回 -1

## 关键点总结

1. **核心洞察**：旋转数组总有一半是有序的
2. **二分条件**：根据有序半边判断 target 的位置
3. **边界判断**：使用 `<=` 区分有序区间（左闭右闭区间）
4. **防溢出**：mid 计算使用 `left + (right - left) / 2`

## 扩展思考

如果数组允许重复值（如 LeetCode 81题），上述方法会失效，需要额外的判断逻辑来处理 `nums[left] == nums[mid] == nums[right]` 的情况。
