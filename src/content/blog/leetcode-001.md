---
title: 两数之和
description: ''
pubDate: 2026-03-09T14:55
image: /images/leetcode-001/d500064fe2340025.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 两数之和的刷题想法
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++){
            int num1 = target - nums[i];
            if (map.containsKey(num1)){
                return new int[]{map.get(num1),i};
            }
            map.put(nums[i],i);
        }
        return new int[]{0,0};
    }
}
```
使用HashMap来存储值和索引

# 此次编写所犯的错误
```java
//创建HashMap时后面部分未使用<>,错误写法（也不算错误，只是会触发警告）：
Map<Integer,Integer> map = new HashMap();
//正确写法
Map<Integer,Integer> map = new HashMap<>();

//返回时将值进行返回，而返回的不是索引
return new int[]{nums[map.get(num1)],nums[i];}
```
