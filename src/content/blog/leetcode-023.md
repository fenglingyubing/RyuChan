---
title: 除了自身以外数组的乘积
description: leetcode刷题第十八天
pubDate: 2026-03-26T22:11
image: /images/leetcode-023/e597468f823b2e79.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 除了自身以外数组的乘积

## 题目描述

给你一个整数数组 `nums`，返回数组 `answer`，其中 `answer[i]` 等于 `nums` 中除了 `nums[i]` 之外其余各元素的乘积。

要求：

- 不能使用除法
- 时间复杂度必须是 `O(n)`

---

## 核心思路

对于每个位置 `i`，结果其实可以拆成两部分：

```text
answer[i] = 左边所有元素的乘积 * 右边所有元素的乘积
```

所以这道题的关键不是直接求“除了自己以外所有数的乘积”，而是拆成：

- `i` 左边的乘积
- `i` 右边的乘积

然后把这两部分乘起来。

---

## 解题步骤

### 1. 先计算每个位置左边所有元素的乘积

定义 `answer[i]` 先存“左侧乘积”：

```java
answer[0] = 1;
for (int i = 1; i < n; i++) {
    answer[i] = answer[i - 1] * nums[i - 1];
}
```

这一步结束后：

```text
answer[i] = nums[0] * nums[1] * ... * nums[i - 1]
```

也就是 `i` 左边所有元素的乘积。

---

### 2. 再从右往左补上右边所有元素的乘积

用变量 `R` 表示当前位置右边所有元素的乘积：

```java
int R = 1;
for (int i = n - 1; i >= 0; i--) {
    answer[i] = answer[i] * R;
    R *= nums[i];
}
```

含义是：

- `answer[i]` 里原本是左边乘积
- `R` 是右边乘积
- 两者相乘后，就是“除了自己以外所有元素的乘积”

---

## 几个关键问题

### 1. 为什么是 `answer[i] = answer[i - 1] * nums[i - 1]`？

因为 `answer[i]` 表示的是“位置 `i` 左边所有元素的乘积”。

而：

- `answer[i - 1]` 已经表示“位置 `i - 1` 左边所有元素的乘积”
- 再乘上 `nums[i - 1]`
- 就得到了“位置 `i` 左边所有元素的乘积”

所以：

```java
answer[i] = answer[i - 1] * nums[i - 1];
```

注意必须乘 `nums[i - 1]`，不能乘 `nums[i]`，否则会把当前位置自己也算进去。

---

### 2. 为什么 `answer[0] = 1`？

因为第 `0` 个位置左边没有元素。

这时左边乘积是“空乘积”，空乘积在乘法里定义为 `1`。

原因是：

- `1` 是乘法单位元
- 任何数乘 `1` 都不变
- 这样递推公式才能成立

就像加法里“空和”定义为 `0` 一样，乘法里“空积”定义为 `1`。

---

### 3. 为什么要先写 `answer[i] = answer[i] * R`，再写 `R *= nums[i]`？

因为在倒序遍历到位置 `i` 时：

- `answer[i]` 存的是左边所有元素的乘积
- `R` 应该表示右边所有元素的乘积

所以必须先用当前的 `R` 更新 `answer[i]`：

```java
answer[i] = answer[i] * R;
```

然后再把当前位置的值乘进 `R`：

```java
R *= nums[i];
```

这样更新后的 `R` 才能给前一个位置使用。

如果顺序反过来，`R` 就会先把 `nums[i]` 自己乘进去，导致当前答案把自己也算进去了，不符合题意。

一句话总结：

```text
因为当前位置不能包含自己，所以先乘 R，再更新 R。
```

---

## 示例推演

输入：

```text
nums = [1, 2, 3, 4]
```

### 第一步：计算左侧乘积

初始：

```text
answer[0] = 1
```

继续递推：

```text
answer[1] = answer[0] * nums[0] = 1 * 1 = 1
answer[2] = answer[1] * nums[1] = 1 * 2 = 2
answer[3] = answer[2] * nums[2] = 2 * 3 = 6
```

得到：

```text
answer = [1, 1, 2, 6]
```

### 第二步：从右往左补右侧乘积

初始：

```text
R = 1
```

从右往左遍历：

```text
i = 3: answer[3] = 6 * 1 = 6,  R = 1 * 4 = 4
i = 2: answer[2] = 2 * 4 = 8,  R = 4 * 3 = 12
i = 1: answer[1] = 1 * 12 = 12, R = 12 * 2 = 24
i = 0: answer[0] = 1 * 24 = 24, R = 24 * 1 = 24
```

最终结果：

```text
[24, 12, 8, 6]
```

---

## Java 源码

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        // answer[i] 先保存 i 左边所有元素的乘积
        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        // R 表示当前位置右边所有元素的乘积
        int R = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] = answer[i] * R;
            R *= nums[i];
        }

        return answer;
    }
}
```

---

## 复杂度分析

- 时间复杂度：`O(n)`
- 额外空间复杂度：`O(1)`

这里如果不把返回数组 `answer` 算作额外空间，那么空间复杂度就是常数级。

---

## 最后总结

这题本质上是“前缀积 + 后缀积”：

- 第一遍遍历，算每个位置左边的乘积
- 第二遍倒序遍历，算每个位置右边的乘积并乘进去

最重要的两个细节：

- `answer[0] = 1`，因为空乘积定义为 `1`
- 倒序时必须先 `answer[i] *= R`，再 `R *= nums[i]`，因为当前结果不能包含自己
