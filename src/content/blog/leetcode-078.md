---
title: 数组中的第K个大的元素
description: leetcode刷题第四十六天
pubDate: 2026-05-06T09:42
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #215 - 数组中的第 K 个最大元素

## 题目描述

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

**注意**：找的是数组排序后的第 `k` 个最大的元素，不是第 `k` 个不同的元素。

**要求**：时间复杂度为 **O(n)** 的算法。

**示例：**
```
输入: [3,2,1,5,6,4], k = 2
输出: 5
解释: 排序后 [6,5,4,3,2,1]，第2个最大是 5

输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4
解释: 排序后 [6,5,4,3,2,1]，第4个最大是 4
```

---

## 解题思路

### 核心思想：快速选择（Quick Select）+ 双指针 Partition

```
快速选择：
  1. 选择基准，分区
  2. 只递归一边（目标所在的那边）
  3. 找到目标位置就停止

双指针分区：
  1. i 从左向右，找 >= 基准的
  2. j 从右向左，找 <= 基准的
  3. 交换，直到 i >= j
```

---

## Java 代码实现

### 方法一：双指针快速选择（推荐，不会超时）

```java
class Solution {
    int quickselect(int[] nums, int left, int right, int k) {
        if (left == right) return nums[k];

        int pivot = nums[left];
        int i = left - 1;
        int j = right + 1;

        while (i < j) {
            do i++; while (nums[i] < pivot);
            do j--; while (nums[j] > pivot);
            if (i < j) {
                int tmp = nums[i];
                nums[i] = nums[j];
                nums[j] = tmp;
            }
        }

        if (k <= j) return quickselect(nums, left, j, k);
        else return quickselect(nums, j + 1, right, k);
    }

    public int findKthLargest(int[] nums, int k) {
        int n = nums.length;
        return quickselect(nums, 0, n - 1, n - k);
    }
}
```

### 方法二：堆排序（O(n log k)）

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        // 小顶堆，保持 k 个最大元素
        PriorityQueue<Integer> heap = new PriorityQueue<>();

        for (int num : nums) {
            heap.offer(num);
            if (heap.size() > k) {
                heap.poll();
            }
        }

        return heap.poll();
    }
}
```

### 方法三：排序（简单直接）

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
```

---

## 双指针 Partition 图解

### 以 `[3, 2, 1, 5, 6, 4]`, k=2 为例

```
基准 x = nums[l] = 3
i = l - 1 = -1, j = r + 1 = 6

初始状态:
[3, 2, 1, 5, 6, 4]
 ↑
l   ↑
 i   j

循环1:
  do i++ while (nums[i] < 3)
    i=0, nums[0]=3 < 3? 否，停止

  do j-- while (nums[j] > 3)
    j=5, nums[5]=4 > 3? 否，停止

  i(0) < j(5)? 是，交换
  → [4, 2, 1, 5, 6, 3]

循环2:
  do i++ while (nums[i] < 3)
    i=1, nums[1]=2 < 3? ✓ 继续
    i=2, nums[2]=1 < 3? ✓ 继续
    i=3, nums[3]=5 < 3? 否，停止 (i=3)

  do j-- while (nums[j] > 3)
    j=4, nums[4]=6 > 3? 否，停止 (j=4)

  i(3) < j(4)? 是，交换
  → [4, 2, 1, 5, 6, 3] → [4, 2, 1, 5, 6, 3]

循环3:
  do i++ while (nums[i] < 3)
    i=4, nums[4]=6 < 3? 否，停止 (i=4)

  do j-- while (nums[j] > 3)
    j=3, nums[3]=5 > 3? 否，停止 (j=3)

  i(4) >= j(3)? 是，停止循环

分区结果:
[4, 2, 1] [5, 6, 3]
     ↑
    j=3

基准 3 归位到 j=3
左边 [4,2,1] 都 < 3
右边 [5,6,3] 都 >= 3
```

### 递归判断

```
目标: 找第 (n-k)=4 小的元素 (索引 4)

j = 3, k = 4

k(4) <= j(3)? 否
→ 递归右边 [j+1, r] = [4, 5]
```

```
第二轮:
区间 [4, 5], 基准 x = nums[4] = 6
i=3, j=6

循环:
  do i++ while (nums[i] < 6)
    i=4, nums[4]=6 < 6? 否，停止 (i=4)

  do j-- while (nums[j] > 6)
    j=5, nums[5]=3 > 6? 否，停止 (j=5)

  i(4) < j(5)? 是，交换
  → [4, 2, 1, 5, 3, 6]

继续:
  do i++ while (nums[i] < 6)
    i=5, nums[5]=6 < 6? 否，停止 (i=5)

  do j-- while (nums[j] > 6)
    j=4, nums[4]=3 > 6? 否，停止 (j=4)

  i(5) >= j(4)? 是，停止

分区结果:
[4, 2, 1, 5, 3] [6]
            ↑
           j=4

k(4) <= j(4)? 是
→ 递归左边 [l, j] = [0, 4]
```

```
第三轮:
区间 [0, 4], 基准 x = nums[0] = 4
i=-1, j=5

...

最终 j=2, k=4 > j(2)
→ 递归右边 [3, 4]

第四轮:
区间 [3, 4], 基准 x = nums[3] = 5
...

最终找到 k=4 对应的元素
```

---

## 为什么这个版本不会超时？

### 对比：单指针 vs 双指针

| 方面 | 单指针（Lomuto） | 双指针（经典） |
|------|-----------------|---------------|
| 划分方式 | 一遍遍历 | 两端向中间 |
| 基准位置 | 最后一个 | 第一个 |
| 等于处理 | 不区分 | 不区分 |
| 平衡性 | 一般 | 更好 |

### 关键区别

```java
// 单指针（Lomuto）- 你的代码
for (j = left; j < right; j++) {
    if (nums[j] <= pivot) {
        swap(nums, i++, j);
    }
}

// 双指针（经典）- 这个代码
while (i < j) {
    do i++; while (nums[i] < x);
    do j--; while (nums[j] > x);
    if (i < j) swap(nums, i, j);
}
```

### 为什么双指针更稳定？

1. **每次循环可以交换两个元素**，划分更均衡
2. **两端同时向中间靠拢**，基准位置更稳定
3. **使用 `<` 和 `>` 而不是 `<=` 和 `>=`**，避免重复元素集中在一侧

```
单指针在大量重复时:
[1,1,1,1,1,1] + 基准1
→ 小元素全在左边，大元素在右边
→ 划分严重不平衡

双指针在大量重复时:
[1,1,1,1,1,1] + 基准1
→ 两端同时收缩
→ 即使有重复，划分也相对平衡
```

---

## 复杂度分析

| 方法 | 平均时间 | 最坏时间 | 空间 |
|------|---------|---------|------|
| 双指针快速选择 | O(n) | O(n²) | O(log n) |
| 堆排序 | O(n log k) | O(n log k) | O(k) |
| 完全排序 | O(n log n) | O(n log n) | O(1) |

---

## 关键点总结

### 1. 第 k 大 vs 第 k 小

```
第 k 大 = 第 (n-k) 小
索引转换：target = n - k
```

### 2. 双指针分区核心

```
1. i 从左向右，找 >= 基准的
2. j 从右向左，找 <= 基准的
3. i < j 时交换
4. 循环直到 i >= j
```

### 3. 递归判断

```
if (k <= j) 递归左边 [l, j]
else 递归右边 [j+1, r]
```

### 4. 为什么这个版本不会超时？

```
1. 双指针确保划分更均衡
2. 使用 < 和 >（不是 <= 和 >=）
   → 避免重复元素导致的不平衡
3. 基准在边界，简化交换逻辑
```

---

## 相关题目

| 题目 | 难度 | 说明 |
|------|------|------|
| 215 第K大的元素 | 中等 | 本题 |
| 347 前 K 个高频元素 | 中等 | 堆的应用 |
| 973 最接近原点的 K 个点 | 中等 | 堆的应用 |
| 324 摆动排序 II | 中等 | 快速选择 |