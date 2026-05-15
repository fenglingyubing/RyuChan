---
title: 颜色分类
description: leetcode刷题第五十五天
pubDate: 2026-05-15T10:36
image: /images/leetcode-102/dc5a541a25e27b50.webp
draft: false
tags:
  - 感悟
  - LeetCode
categories:
  - LeetCode
---
# 75. 颜色分类

## 题目描述

给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums`，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、`1` 和 `2` 分别表示红色、白色和蓝色。

要求不能使用库内置的 `sort` 函数。

---

## 一、这道题在问什么

题目本质上就是让你把数组里的 `0`、`1`、`2` 排好序：

- `0` 放前面
- `1` 放中间
- `2` 放后面

而且要求原地完成，不能额外开一个排序数组。

---

## 二、最直接的思路

最简单的做法是遍历两次：

1. 先统计 `0`、`1`、`2` 的个数
2. 再按个数把数组重新写回去

这个方法容易理解，但它不是题目最优雅的解法。

这题更经典的做法是 **三路划分**，也叫 **荷兰国旗问题**。

---

## 三、三路划分思路

我们用三个指针：

- `left`：下一个 `0` 应该放的位置
- `right`：下一个 `2` 应该放的位置
- `i`：当前遍历位置

初始时：

- `left = 0`
- `i = 0`
- `right = nums.length - 1`

遍历过程中：

- 如果 `nums[i] == 0`，就和 `left` 交换，然后 `left++`，`i++`
- 如果 `nums[i] == 1`，说明它已经在中间，直接 `i++`
- 如果 `nums[i] == 2`，就和 `right` 交换，然后 `right--`
  - 这里 `i` 不能立刻加，因为换过来的元素还没检查

---

## 四、为什么这样能行

整个数组会被分成四段：

- `[0, left)` 全是 `0`
- `[left, i)` 全是 `1`
- `[i, right]` 是未处理区间
- `(right, n - 1]` 全是 `2`

每次处理一个元素，都能把它放进对应区域，直到未处理区间为空，排序就完成了。

---

## 五、复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

---

## 六、Java 代码

```java
class Solution {
    public void sortColors(int[] nums) {
        int left = 0;
        int i = 0;
        int right = nums.length - 1;

        while (i <= right) {
            if (nums[i] == 0) {
                swap(nums, i, left);
                left++;
                i++;
            } else if (nums[i] == 1) {
                i++;
            } else {
                swap(nums, i, right);
                right--;
            }
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

---

## 七、补充理解

可以把它理解成“把数组分成三段”：

- 左边放红色 `0`
- 中间放白色 `1`
- 右边放蓝色 `2`

这就是这道题最标准的原地解法。

