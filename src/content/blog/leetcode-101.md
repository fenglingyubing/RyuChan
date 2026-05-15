---
title: 多数元素
description: leetcode刷题第五十五天
pubDate: 2026-05-15T10:16
image: /images/leetcode-101/ee965fe43eec8eac.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 169. 多数元素

## 题目描述

给定一个大小为 `n` 的数组 `nums`，返回其中的多数元素。

多数元素是指在数组中出现次数大于 `⌊ n/2 ⌋` 的元素。

题目保证数组非空，并且一定存在多数元素。

---

## 一、核心思路

这题最经典的做法是 **摩尔投票法**。

它的核心结论是：

- 如果一个数出现次数超过一半
- 那么它可以和其他不同的数一一抵消
- 最后剩下的那个数，一定就是多数元素

所以不需要排序，也不需要哈希统计，直接一次遍历就能做。

---

## 二、为什么可行

假设当前候选元素是 `candidate`，计数是 `count`。

遍历数组时：

- 如果当前数字和 `candidate` 相同，`count++`
- 如果不同，`count--`
- 当 `count` 变成 `0` 时，说明之前的候选已经被抵消完了，可以把当前数字重新设为候选

因为多数元素一定存在，而且出现次数超过一半，所以它最终不会被完全抵消掉，最后留下来的候选就是答案。

---

## 三、算法步骤

1. 设 `candidate = nums[0]`，`count = 1`
2. 从第二个元素开始遍历
3. 如果当前元素等于 `candidate`，`count++`
4. 如果当前元素不等于 `candidate`，`count--`
5. 如果 `count == 0`，就把当前元素设为新的 `candidate`，并把 `count = 1`
6. 遍历结束后，`candidate` 就是多数元素

---

## 四、复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

---

## 五、Java 代码

```java
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 1;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == candidate) {
                count++;
            } else {
                count--;
                if (count == 0) {
                    candidate = nums[i];
                    count = 1;
                }
            }
        }

        return candidate;
    }
}
```

---

## 六、补充理解

你也可以把它理解成“投票”：

- 多数元素像一个强势候选人
- 每遇到一个不同的元素，就像被反对一票
- 因为它本来就超过一半，所以最终一定胜出

