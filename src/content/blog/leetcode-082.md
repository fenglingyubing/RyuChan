---
title: 跳跃游戏
description: leetcode刷题第四十八天
pubDate: 2026-05-08T13:53
image: /images/leetcode-082/2f3486bb48901fe9.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 55. 跳跃游戏

## 题目描述

给你一个非负整数数组 `nums`，你最初位于数组的第一个下标。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标：

- 如果可以，返回 `true`
- 否则，返回 `false`

**示例：**

```text
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步到下标 1，再从下标 1 跳 3 步到最后一个下标。

输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样跳，都会到达下标 3。由于 nums[3] = 0，无法继续跳到最后一个下标。
```

---

## 第一版解法

```java
class Solution {
    public boolean canJump(int[] nums) {
        int index = 0;
        for(int i = 0; i < nums.length - 1;){
            index = nums[i];
            i += index;
            if(index == 0 && i < nums.length - 1){
                return false;
            }
        }
        return true;
    }
}
```

## 问题在哪里？

思路是：

> 每次直接跳 `nums[i]` 步，也就是从当前位置跳到它能跳到的最远位置。

这个想法的问题是：**题目说的是最多可以跳 `nums[i]` 步，不是必须跳 `nums[i]` 步。**

也就是说，站在下标 `i` 时，如果 `nums[i] = 3`，你可以跳：

```text
1 步、2 步、3 步
```

而你的代码只尝试了：

```text
3 步
```

所以它只模拟了一条固定路线，没有考虑其他可能路线。

---

## 反例

```text
nums = [2, 3, 1, 1, 4]
```

正确答案是：

```text
true
```

因为可以这样跳：

```text
下标 0 -> 下标 1 -> 下标 4
```

但是你的代码执行过程是：

```text
i = 0, nums[0] = 2, i += 2 -> i = 2
i = 2, nums[2] = 1, i += 1 -> i = 3
i = 3, nums[3] = 1, i += 1 -> i = 4
返回 true
```

这个例子刚好也能通过，但它暴露出你的代码是在固定跳“最大步数”。

看一个真正会出错的例子：

```text
nums = [2, 3, 0, 1, 4]
```

正确答案是：

```text
true
```

正确跳法：

```text
下标 0 -> 下标 1 -> 下标 4
```

你的代码执行过程：

```text
i = 0, nums[0] = 2, i += 2 -> i = 2
i = 2, nums[2] = 0
index == 0 且 i < nums.length - 1
返回 false
```

这里你的代码返回了 `false`，但实际上只要第一步不跳 2 步，而是跳 1 步，就可以到达终点。

---

## 正确思路：贪心

这道题不需要真的模拟每一种跳法。

我们只需要维护一个变量：

```text
farthest：当前能够到达的最远下标
```

遍历数组时：

1. 如果当前下标 `i` 已经大于 `farthest`，说明当前位置根本到不了，直接返回 `false`
2. 否则，用 `i + nums[i]` 更新最远可达位置
3. 如果 `farthest` 已经到达或超过最后一个下标，返回 `true`

---

## 代码

```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;

        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) {
                return false;
            }

            farthest = Math.max(farthest, i + nums[i]);

            if (farthest >= nums.length - 1) {
                return true;
            }
        }

        return true;
    }
}
```

---

## 图解示例

以：

```text
nums = [2, 3, 0, 1, 4]
```

为例：

```text
i = 0
nums[0] = 2
farthest = max(0, 0 + 2) = 2
当前最多能到下标 2

i = 1
因为 i <= farthest，说明下标 1 是可达的
nums[1] = 3
farthest = max(2, 1 + 3) = 4
已经能到达最后一个下标
返回 true
```

关键点是：

```text
虽然从下标 0 最远能跳到下标 2，
但我们不是必须跳到下标 2。
只要下标 1 在当前可达范围内，就可以继续用 nums[1] 扩展最远距离。
```

---

## 复杂度

| 指标 | 复杂度 |
|------|--------|
| 时间 | O(n) |
| 空间 | O(1) |

---

## 一句话总结

> 不要固定模拟某一条跳跃路径，而是维护当前所有可选路径中能到达的最远位置。
