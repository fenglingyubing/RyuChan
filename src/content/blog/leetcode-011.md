---
title: 最长连续序列
description: leetcode刷题第十天
pubDate: 2026-03-18T14:52
image: /images/leetcode-011/a8e11ed4a7414acc.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 最长连续序列问题总结

## 1. 题目目标

给定一个未排序的整数数组 `nums`，返回最长连续序列的长度。

例如：

```java
输入: [100, 4, 200, 1, 3, 2]
输出: 4
解释: 最长连续序列是 [1, 2, 3, 4]
```

---

## 2. 第一版解法

第一版代码如下：

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        Arrays.sort(nums);
        int count = 0;
        if (nums.length == 0){
            return count;
        }
        int cur = nums[0];
        for (int i = 0; i < nums.length; i++){
            if(nums[i] > cur && nums[i] != cur + 1){
                count = count < set.size() ? set.size() : count;
                set.clear();
                set.add(nums[i]);
            }else {
                set.add(nums[i]);
            }
            cur = nums[i];
        }
        return count <= set.size() ? set.size() : count;
    }
}
```

### 2.1 思路

这版做了两件事：

1. 先对数组排序。
2. 用 `Set<Integer>` 记录当前这一段连续序列的元素个数。

当发现当前数字和前一个数字不连续时：

- 先用 `set.size()` 更新当前最大长度
- 再清空 `set`
- 从新的数字重新开始统计

### 2.2 优点

- 思路是对的，能够通过测试。
- 对重复元素有一定处理能力，因为 `Set` 会自动去重。
- 写法直观，容易顺着排序后的数组理解。

### 2.3 问题

#### 问题一：时间复杂度不够优

核心瓶颈在这里：

```java
Arrays.sort(nums);
```

排序的时间复杂度是 `O(n log n)`，后续遍历是 `O(n)`，所以总复杂度为：

```java
O(n log n)
```

如果题目要求最优解，一般希望做到 `O(n)`。

#### 问题二：`Set` 使用得偏重

在数组已经排好序的前提下，其实没有必要再用 `Set` 存整段连续序列。

因为我们真正需要的只有：

- 当前连续长度
- 最大连续长度

也就是说，只用整数变量就能完成统计，不需要：

- `set.add(...)`
- `set.clear()`
- `set.size()`

这些操作会带来额外开销。

#### 问题三：逻辑绕，常数开销偏大

这一版虽然正确，但判断过程比较绕：

```java
if(nums[i] > cur && nums[i] != cur + 1){
    count = count < set.size() ? set.size() : count;
    set.clear();
    set.add(nums[i]);
} else {
    set.add(nums[i]);
}
```

这里同时处理了：

- 重复元素
- 连续元素
- 不连续元素

功能上没有问题，但相比直接用长度变量统计，执行时常数成本会更高。

---

## 3. 排序优化版

最后给出的优化版如下：

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        Arrays.sort(nums);

        int maxLen = 1;
        int curLen = 1;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i - 1]) {
                continue;
            } else if (nums[i] == nums[i - 1] + 1) {
                curLen++;
            } else {
                maxLen = Math.max(maxLen, curLen);
                curLen = 1;
            }
        }

        return Math.max(maxLen, curLen);
    }
}
```

### 3.1 思路

这版仍然使用“先排序，再遍历”的总体思路，但去掉了 `Set`。

只保留两个变量：

- `curLen`：当前连续序列长度
- `maxLen`：历史最大连续序列长度

遍历时分三种情况：

1. 当前元素和前一个元素相同  
   说明是重复元素，直接跳过。

2. 当前元素等于前一个元素加一  
   说明连续，`curLen++`。

3. 当前元素既不重复，也不连续  
   说明当前连续段结束，更新 `maxLen`，然后把 `curLen` 重置为 `1`。

### 3.2 优点

#### 优点一：逻辑更清晰

排序后，只需要按顺序判断：

- 是否重复
- 是否连续
- 是否断开

整体结构比第一版更容易读懂和维护。

#### 优点二：不再依赖 `Set`

这版去掉了集合操作，减少了：

- 哈希计算
- 装箱拆箱
- 清空集合
- 维护集合大小

因此在很多实际运行场景下，这版往往会比“排序 + Set”更快。

#### 优点三：空间复杂度更低

第一版额外用了一个 `Set<Integer>`，优化版只用了几个整数变量。

因此空间复杂度更低：

- 第一版：额外空间接近 `O(n)`
- 优化版：额外空间 `O(1)`（不考虑排序内部开销）

### 3.3 不足

这版虽然比第一版更简洁、更省空间，但本质上仍然依赖排序，所以时间复杂度还是：

```java
O(n log n)
```

也就是说，它是“对第一版的优化”，但不是这道题理论上的最优解。

---

## 4. 两版对比

| 对比项 | 第一版：排序 + Set | 优化版：纯排序统计 |
| --- | --- | --- |
| 是否正确 | 正确 | 正确 |
| 时间复杂度 | `O(n log n)` | `O(n log n)` |
| 空间复杂度 | 较高 | 更低 |
| 逻辑复杂度 | 偏绕 | 更清晰 |
| 对重复元素处理 | 依赖 `Set` 去重 | 直接 `continue` |
| 常数开销 | 更大 | 更小 |
| 实际提交表现 | 可能偏慢 | 通常更稳定 |

---

## 5. 为什么优化版通常更快

虽然两版时间复杂度一样，都是 `O(n log n)`，但优化版通常更快，原因在于常数开销更小。

第一版额外做了很多集合操作：

```java
set.add(...)
set.clear()
set.size()
```

这些操作会带来：

- 哈希表维护成本
- `int` 到 `Integer` 的自动装箱
- 更多对象相关开销

而优化版只是在排好序的数组上做一次线性扫描，CPU 执行路径更直接，所以运行效率通常更好。
