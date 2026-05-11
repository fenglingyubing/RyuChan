---
title: 乘积最大子数组
description: leetcode刷题第五十一天
pubDate: 2026-05-11T13:57
image: /images/leetcode-092/ade95db1995e5b95.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 152. 乘积最大子数组

## 题目描述

给你一个整数数组 `nums`，请你找出数组中乘积最大的非空连续子数组，并返回该子数组所对应的乘积。

注意：

```text
子数组必须连续
子数组至少包含一个数字
一个只包含一个元素的数组，乘积就是这个元素本身
```

示例：

```text
输入：nums = [2,3,-2,4]
输出：6
解释：连续子数组 [2,3] 的乘积最大，为 6
```

```text
输入：nums = [-2,0,-1]
输出：0
解释：结果不能是 2，因为 [-2,-1] 不是连续子数组
```

---

## 核心思路

这道题看起来像“最大子数组和”，但乘积有一个很关键的特殊点：

```text
负数会让最大值和最小值互相转换
```

例如：

```text
当前最大乘积 = 3
当前最小乘积 = -6
当前数字 num = -2
```

如果用 `3 * -2`，会得到：

```text
-6
```

但如果用 `-6 * -2`，会得到：

```text
12
```

也就是说，前面的“最小负数乘积”遇到一个负数后，可能变成新的最大乘积。

所以只维护最大乘积是不够的，还必须同时维护：

```text
maxProduct：以当前位置结尾的最大乘积
minProduct：以当前位置结尾的最小乘积
```

答案则是遍历过程中出现过的最大 `maxProduct`。

---

## 动态规划定义

对于每个位置 `i`，定义：

```text
maxProduct 表示以 nums[i] 结尾的连续子数组的最大乘积
minProduct 表示以 nums[i] 结尾的连续子数组的最小乘积
```

注意这里的重点是：

```text
必须以 nums[i] 结尾
```

这样才能保证子数组是连续的。

对于当前数字 `num = nums[i]`，以它结尾的连续子数组只有三种来源：

```text
1. 只选当前数字 num
2. 接在前一个最大乘积子数组后面：previousMax * num
3. 接在前一个最小乘积子数组后面：previousMin * num
```

所以状态转移是：

```text
maxProduct = max(num, previousMax * num, previousMin * num)
minProduct = min(num, previousMax * num, previousMin * num)
```

每次更新完当前位置的 `maxProduct` 后，再更新全局答案：

```text
ans = max(ans, maxProduct)
```

---

## 为什么要保存最小乘积

以数组：

```text
nums = [2, 3, -2, 4, -1]
```

为例。

前面 `[2, 3, -2, 4]` 中，如果只看最大乘积，可能觉得最大值是：

```text
6
```

但同时还存在一个很小的负数乘积：

```text
2 * 3 * -2 * 4 = -48
```

当后面遇到 `-1` 时：

```text
-48 * -1 = 48
```

这个原本很小的负数乘积，反而变成了最大的正数乘积。

因此，`minProduct` 不是多余的，它是在等待下一个负数出现时翻身。

---

## 举例分析

以：

```text
nums = [2, 3, -2, 4]
```

为例。

初始化：

```text
maxProduct = 2
minProduct = 2
ans = 2
```

### i = 1，num = 3

三种选择：

```text
只选当前数字：3
接在 previousMax 后面：2 * 3 = 6
接在 previousMin 后面：2 * 3 = 6
```

所以：

```text
maxProduct = 6
minProduct = 3
ans = 6
```

### i = 2，num = -2

上一步：

```text
previousMax = 6
previousMin = 3
```

三种选择：

```text
只选当前数字：-2
接在 previousMax 后面：6 * -2 = -12
接在 previousMin 后面：3 * -2 = -6
```

所以：

```text
maxProduct = -2
minProduct = -12
ans = 6
```

这里最大乘积变成了 `-2`，但全局答案仍然是之前的 `6`。

### i = 3，num = 4

上一步：

```text
previousMax = -2
previousMin = -12
```

三种选择：

```text
只选当前数字：4
接在 previousMax 后面：-2 * 4 = -8
接在 previousMin 后面：-12 * 4 = -48
```

所以：

```text
maxProduct = 4
minProduct = -48
ans = 6
```

最终答案是：

```text
6
```

对应连续子数组：

```text
[2, 3]
```

---

## Java 代码

```java
class Solution {
    public int maxProduct(int[] nums) {
        int maxProduct = nums[0];
        int minProduct = nums[0];
        int ans = nums[0];

        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];

            int previousMax = maxProduct;
            int previousMin = minProduct;

            maxProduct = Math.max(num, Math.max(previousMax * num, previousMin * num));
            minProduct = Math.min(num, Math.min(previousMax * num, previousMin * num));

            ans = Math.max(ans, maxProduct);
        }

        return ans;
    }
}
```

---

## 代码解释

```java
int maxProduct = nums[0];
int minProduct = nums[0];
int ans = nums[0];
```

用第一个元素初始化。

因为题目要求子数组非空，所以答案不能初始化为 `0`。如果数组只有一个负数，例如：

```text
nums = [-2]
```

答案应该是 `-2`，不是 `0`。

```java
int previousMax = maxProduct;
int previousMin = minProduct;
```

更新当前位置时，`maxProduct` 和 `minProduct` 都依赖上一轮的旧值。

所以要先保存旧的最大值和最小值，避免更新 `maxProduct` 后影响 `minProduct` 的计算。

```java
maxProduct = Math.max(num, Math.max(previousMax * num, previousMin * num));
```

计算以当前数字结尾的最大乘积。

三种可能分别是：

```text
当前数字自己成为一个新子数组
当前数字接在之前最大乘积后面
当前数字接在之前最小乘积后面
```

```java
minProduct = Math.min(num, Math.min(previousMax * num, previousMin * num));
```

计算以当前数字结尾的最小乘积。

保留最小乘积是为了处理后续可能出现的负数。

```java
ans = Math.max(ans, maxProduct);
```

`maxProduct` 只表示“以当前位置结尾”的最大乘积，全局最大值可能出现在任何位置，所以需要用 `ans` 记录遍历过程中的最大值。

---

## 另一种写法：遇到负数交换

因为负数会让最大值和最小值互换，所以也可以在遇到负数时先交换 `maxProduct` 和 `minProduct`。

```java
class Solution {
    public int maxProduct(int[] nums) {
        int maxProduct = nums[0];
        int minProduct = nums[0];
        int ans = nums[0];

        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];

            if (num < 0) {
                int temp = maxProduct;
                maxProduct = minProduct;
                minProduct = temp;
            }

            maxProduct = Math.max(num, maxProduct * num);
            minProduct = Math.min(num, minProduct * num);

            ans = Math.max(ans, maxProduct);
        }

        return ans;
    }
}
```

这版代码更短，但理解上需要先明白：

```text
当前数字是负数时，之前的最大乘积乘上它会变小；
之前的最小乘积乘上它可能会变大。
```

如果是第一次学习，推荐先掌握前一种“三种情况取最大、取最小”的写法。

---

## 0 的处理

这道题不需要对 `0` 做特殊判断。

当 `num = 0` 时：

```text
maxProduct = max(0, previousMax * 0, previousMin * 0) = 0
minProduct = min(0, previousMax * 0, previousMin * 0) = 0
```

这相当于把前面的连续乘积断开。

后面如果继续出现数字，就会从新的位置重新开始计算。

例如：

```text
nums = [-2, 0, -1]
```

遍历到 `0` 后，最大和最小乘积都会变成 `0`。

再遍历到 `-1` 时，可以重新从 `-1` 开始：

```text
maxProduct = max(-1, 0 * -1, 0 * -1) = 0
minProduct = min(-1, 0 * -1, 0 * -1) = -1
```

最终答案是 `0`。

---

## 复杂度分析

时间复杂度：

```text
O(n)
```

只需要遍历数组一次。

空间复杂度：

```text
O(1)
```

只使用了几个变量，没有额外数组。

---

## 易错点

### 1. 只维护最大乘积

错误原因：

```text
负数乘负数会变成正数
```

之前的最小乘积可能在后面变成最大乘积，所以必须同时维护 `maxProduct` 和 `minProduct`。

### 2. ans 初始化为 0

如果数组全是负数，并且只有一个元素：

```text
nums = [-2]
```

答案应该是：

```text
-2
```

所以 `ans` 应该初始化为 `nums[0]`。

### 3. 更新 minProduct 时用了已经更新后的 maxProduct

错误写法类似：

```java
maxProduct = Math.max(num, Math.max(maxProduct * num, minProduct * num));
minProduct = Math.min(num, Math.min(maxProduct * num, minProduct * num));
```

这里第二行的 `maxProduct` 已经是新值，不再是上一轮的旧值，会导致计算错误。

正确做法是先保存：

```java
int previousMax = maxProduct;
int previousMin = minProduct;
```

然后用旧值同时计算新的最大值和最小值。

### 4. 混淆子数组和子序列

题目要求的是连续子数组，不是子序列。

例如：

```text
nums = [-2, 0, -1]
```

不能选择 `[-2, -1]`，因为它们在原数组中不连续。

---

## 总结

这道题的关键是理解乘积和加法不同：

```text
乘积遇到负数时，最大值和最小值可能互相转换
```

所以每个位置都要维护两个状态：

```text
maxProduct：以当前位置结尾的最大乘积
minProduct：以当前位置结尾的最小乘积
```

状态转移：

```text
maxProduct = max(num, previousMax * num, previousMin * num)
minProduct = min(num, previousMax * num, previousMin * num)
```

最终答案是遍历过程中所有 `maxProduct` 的最大值。
