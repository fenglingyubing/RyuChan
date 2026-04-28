---
title: 寻找两个正序数组的中位数
description: leetcode刷题第四十二天
pubDate: 2026-04-28T12:01
image: /images/leetcode-071/1ff477fd5b6f530e.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #4 - 寻找两个正序数组的中位数

## 题目描述

给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 **中位数**。

算法的时间复杂度应该为 **O(log (m+n))**。

**示例：**
```
输入：nums1 = [1, 3], nums2 = [2]
输出：2.00000
解释：合并数组为 [1, 2, 3]，中位数是 2

输入：nums1 = [1, 2], nums2 = [3, 4]
输出：2.50000
解释：合并数组为 [1, 2, 3, 4]，中位数是 (2 + 3) / 2 = 2.5
```

---

## 解题思路

### 1. 核心思想：二分查找

由于要求时间复杂度为 **O(log(m+n))**，必须使用**二分查找**思想。

关键观察：
- 中位数将一个数组分成左右两部分，且左右元素个数相等（或相差1）
- 如果我们能找到合适的划分，使得：
  - `左半部分的元素都 <= 右半部分的元素`
  - `左半部分元素个数 = 右半部分元素个数（或右多1个）`

### 2. 划分策略

设 nums1 长度为 m，nums2 长度为 n，总长度为 L = m + n。

- 若 L 为**偶数**，中位数 = (左半部分最大值 + 右半部分最小值) / 2
- 若 L 为**奇数**，中位数 = 左半部分最大值

所以我们只需找到**第 L/2 小**和**第 L/2 + 1 小**的两个数即可。

### 3. 二分查找逻辑

```
1. 始终在较短的数组上二分（减少搜索范围）
2. 设划分位置 i（nums1左侧有i个元素），则 j = (m + n + 1) / 2 - i（nums2左侧有j个元素）
3. 检查是否满足条件：
   - nums1[i-1] <= nums2[j]（左侧最大值 <= 右侧最小值）
   - nums2[j-1] <= nums1[i]
4. 若不满足，调整二分范围继续查找
```

### 4. 边界情况处理

- i = 0：nums1 全部在右侧
- i = m：nums1 全部在左侧
- j = 0：nums2 全部在右侧
- j = n：nums2 全部在左侧

---

## Java 代码实现

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // 确保 nums1 是较短的数组，以便二分查找
        if (nums1.length > nums2.length) {
            int[] temp = nums1;
            nums1 = nums2;
            nums2 = temp;
        }

        int m = nums1.length;
        int n = nums2.length;

        // 二分查找的区间：[0, m]
        int left = 0, right = m;

        // 中位数分界点：(m + n + 1) / 2 表示左侧应有多少元素
        int totalLeft = (m + n + 1) / 2;

        while (left <= right) {
            // nums1 的划分位置
            int i = (left + right) / 2;
            // nums2 的划分位置
            int j = totalLeft - i;

            // 计算四个边界值
            // nums1Left: nums1 左侧最大值（i 为 0 时为负无穷）
            int nums1Left = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            // nums1Right: nums1 右侧最小值（i == m 时为正无穷）
            int nums1Right = (i == m) ? Integer.MAX_VALUE : nums1[i];
            // nums2Left: nums2 左侧最大值（j 为 0 时为负无穷）
            int nums2Left = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            // nums2Right: nums2 右侧最小值（j == n 时为正无穷）
            int nums2Right = (j == n) ? Integer.MAX_VALUE : nums2[j];

            // 检查划分是否正确
            if (nums1Left <= nums2Right && nums2Left <= nums1Right) {
                // 找到正确划分，计算中位数
                if ((m + n) % 2 == 0) {
                    // 偶数长度：取左侧最大值和右侧最小值的平均
                    return (double) (Math.max(nums1Left, nums2Left) +
                                    Math.min(nums1Right, nums2Right)) / 2;
                } else {
                    // 奇数长度：取左侧最大值
                    return (double) Math.max(nums1Left, nums2Left);
                }
            } else if (nums1Left > nums2Right) {
                // nums1 左侧太大，需要减少 nums1 左侧元素（向左找）
                right = i - 1;
            } else {
                // nums1 左侧太小，需要增加 nums1 左侧元素（向右找）
                left = i + 1;
            }
        }

        return 0.0;  // 二分查找必定找到，这里不会执行
    }
}
```

---

## 图解示例

### 示例 1：nums1 = [1, 3], nums2 = [2]

```
nums1: [1, 3]      nums2: [2]
        ↑                 ↑  (划分位置)

左侧元素: [1]      右侧元素: [2, 3]
左侧最大值 = 1, 右侧最小值 = 2

合并数组: [1, 2, 3]，长度 3 为奇数，中位数 = 2 ✓
```

### 示例 2：nums1 = [1, 2], nums2 = [3, 4]

```
nums1: [1, 2]      nums2: [3, 4]
        ↑                 ↑  (划分位置)

左侧: [1, 2]        右侧: [3, 4]
左侧最大值 = 2, 右侧最小值 = 3

合并数组: [1, 2, 3, 4]，长度 4 为偶数
中位数 = (2 + 3) / 2 = 2.5 ✓
```

---

## 复杂度分析

| 指标 | 复杂度 |
|------|--------|
| **时间复杂度** | O(log(min(m, n))) - 二分查找 |
| **空间复杂度** | O(1) - 只使用常数额外空间 |

---

## 关键点总结

1. **二分查找**：时间复杂度 O(log) 的核心
2. **在短数组上二分**：减少搜索范围
3. **划分条件**：`max(left) <= min(right)`
4. **奇偶处理**：
   - 奇数：中位数 = 左半最大
   - 偶数：中位数 = (左半最大 + 右半最小) / 2
5. **边界处理**：使用 Integer.MIN_VALUE / MAX_VALUE 处理越界情况