---
title: 划分字母区间
description: leetcode刷题第四十八天
pubDate: 2026-05-08T14:38
image: /images/leetcode-084/354bb8ad1a55aec6.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 763. 划分字母区间

## 题目描述

给你一个字符串 `s`。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。

例如：

```text
ababcc -> ["abab", "cc"]
```

但下面这种划分是非法的：

```text
["aba", "bcc"]
["ab", "ab", "cc"]
```

注意：

> 划分结果连接起来后，必须仍然等于原字符串 `s`

返回一个表示每个字符串片段长度的列表。

**示例：**

```text
输入：s = "ababcbacadefegdehijhklij"
输出：[9,7,8]

输入：s = "eccbbbbdec"
输出：[10]
```

---

## 核心思路

这题的关键是：

> 每个字符最后一次出现的位置，决定了当前片段最远要延伸到哪里。

比如字符串里某个字符 `a` 最后一次出现的位置是下标 `8`，那包含 `a` 的当前片段，至少要延伸到 `8`，否则 `a` 就会出现在多个片段中。

所以我们分两步做：

1. 先统计每个字符最后出现的位置
2. 再从左到右遍历，动态维护当前片段的最右边界

---

## 具体做法

### 第一步：记录每个字符最后出现的位置

用一个数组 `lastIndex[26]` 记录：

```text
字符 a-z 的最后出现位置
```

例如：

```text
s = "ababcbacadefegdehijhklij"
```

`a` 的最后位置是 `8`

`b` 的最后位置是 `5`

`c` 的最后位置是 `7`

---

### 第二步：遍历并维护当前片段边界

定义两个变量：

```text
start：当前片段的起点
end：当前片段的终点
```

遍历字符串时：

1. 令 `end = max(end, lastIndex[s[i]])`
2. 如果当前下标 `i == end`，说明当前片段已经走到不能再扩展的位置
3. 此时可以切一刀，当前片段长度就是 `end - start + 1`
4. 然后把 `start` 更新为 `i + 1`

---

## 为什么这样是对的？

因为当前片段里出现的所有字符，都必须完整地留在这个片段中。

如果某个字符还会在后面出现，那么当前片段就必须继续往后扩展，直到把这个字符的最后一次出现也包含进去。

所以当前片段的结束位置，不是某一个字符的最后位置，而是：

```text
当前片段中所有字符最后位置的最大值
```

这就是贪心的核心。

---

## 代码

```java
class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] lastIndex = new int[26];

        for (int i = 0; i < s.length(); i++) {
            lastIndex[s.charAt(i) - 'a'] = i;
        }

        List<Integer> result = new ArrayList<>();
        int start = 0;
        int end = 0;

        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, lastIndex[s.charAt(i) - 'a']);

            if (i == end) {
                result.add(end - start + 1);
                start = i + 1;
            }
        }

        return result;
    }
}
```

---

## 图解示例

以：

```text
s = "ababcbacadefegdehijhklij"
```

为例。

先记录最后出现位置：

```text
a -> 8
b -> 5
c -> 7
d -> 14
e -> 15
f -> 11
g -> 13
h -> 19
i -> 22
j -> 23
k -> 20
l -> 21
```

遍历前 9 个字符时：

```text
i = 0, char = a, end = max(0, 8) = 8
i = 1, char = b, end = max(8, 5) = 8
i = 2, char = a, end = 8
i = 3, char = b, end = 8
i = 4, char = c, end = max(8, 7) = 8
i = 5, char = b, end = 8
i = 6, char = a, end = 8
i = 7, char = c, end = 8
i = 8, char = a, end = 8
此时 i == end，可以切分，第一段长度为 9
```

第一段是：

```text
ababcbaca
```

继续遍历后面的字符，最终得到：

```text
[9, 7, 8]
```

---

## 复杂度

| 指标 | 复杂度 |
|------|--------|
| 时间 | O(n) |
| 空间 | O(1) |

---

## 一句话总结

> 先记录每个字符最后出现的位置，再用贪心维护当前片段必须延伸到的最远边界，边界一到就立刻切分。

