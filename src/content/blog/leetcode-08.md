---
title: 移除元素
description: LeetCode刷题第七天
pubDate: 2026-03-15T13:23
image: /images/leetcode-08/44c48e510d0014db.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
badge: ''
---
```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }
}
```
# 思路讲解：
使用快慢指针。
1. fast 遍历整个数组，slow 指向当前应该写入非 val 元素的位置。
2. 每当 fast 指向的元素不等于 val，就将这个元素复制到 slow 位置，然后 slow 向后移动一位。
3. 遍历结束后，数组前 slow 个元素就是所有不等于 val 的元素，因此返回 slow 即可。