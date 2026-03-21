---
title: 和为 K 的子数组
description: leetcode刷题第十三天
pubDate: 2026-03-21T12:51
image: /images/leetcode-017/8ccc005e33b2d429.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 和为 K 的子数组

## 题目：

给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。

示例 1：

输入：nums = [1,1,1], k = 2
输出：2
示例 2：

输入：nums = [1,2,3], k = 3
输出：2

## 思路解析
应该采用前缀和 + 哈希表来做

前缀和：
	前缀和 (Prefix Sum) 是指数组中从第一个元素到当前元素的所有元素之和。假设有一个数组 nums，它的前缀和数组我们叫它 preSum：

- preSum[i] 表示 nums[0] + nums[1] + ... + nums[i] 的和。

前缀和的魔力在于： 任何一个连续子数组的和，都可以用两个前缀和的差来表示。比如，你想求子数组 nums[j] 到 nums[i] 的和（包含 $i$ 和 $j$，且 $j \le i$），公式是：
$Sum(j, i) = preSum[i] - preSum[j-1]$

## 代码如下：

```
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer,Integer> map = new HashMap<>();
        int count = 0;
        int sum = 0;
		//为第一次出现匹配的值进行赋值
        map.put(0,1);
        for(int num : nums){
            sum += num;
            if(map.containsKey(sum - k)){
                count += map.get(sum - k);
            }
            map.put(sum,map.getOrDefault(sum,0) + 1);
        }

        return count;
    }
}
```
## `map.getOrDefault(sum,0) + 1`
先取出 sum 这个键当前对应的次数；如果没有，就当作 0；然后再加 1。
