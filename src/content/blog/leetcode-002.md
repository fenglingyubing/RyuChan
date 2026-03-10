---
title: 移动零
description: leetcode刷题第二天
pubDate: 2026-03-10T09:41
image: /images/leetcode-002/bcb0e062f3929e33.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 移动零
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int i = 0;
        for (int j = 0; j < nums.length; j++){
            //判断的应该时数组中的值，而不是下标
            // if (j != 0){
            if (nums[j] != 0){
                swap(i,j,nums);
                i++;
            }
        }
    }

    public void swap(int a, int b, int[] nums){
        int c = nums[a];
        nums[a] = nums[b];
        nums[b] = c;
    }
}
```
# 第一版的解题思路
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int i = 0;
        int j = 1;
        while (true){
            if(j > nums.length - 1){
                break;
            }
            if (i == 0 && j != 0){
                swap(i,j,nums);
                i++;
            }
            j++;
        }
    }

    public void swap(int a, int b, int[] nums){
        int c = nums[a];
        nums[a] = nums[b];
        nums[b] = c;
    }
}
```

## 遇到的问题
1. 判断条件的时候，比较的应该时数组中的值而不是比较下标
2. i只有在交换的时候才会移动，如果第一位不是零，则i会永远停在第一位
3. j不应该从1开始，应该从零开始