---
title: 编辑距离
description: leetcode刷题第五十四天
pubDate: 2026-05-14T14:14
image: /images/leetcode-099/e5588c4ba4cae2a1.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 1143. 最长公共子序列

## 题目描述

给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长公共子序列的长度。

如果不存在公共子序列，返回 `0`。

子序列指的是：从原字符串中删除某些字符，也可以不删除，但不能改变剩余字符的相对顺序。

例如：

```text
"ace" 是 "abcde" 的子序列
"aec" 不是 "abcde" 的子序列
```

公共子序列指的是：同时是两个字符串子序列的字符串。

---

## 示例

```text
输入：text1 = "abcde", text2 = "ace"
输出：3
解释：最长公共子序列是 "ace"，长度为 3。
```

```text
输入：text1 = "abc", text2 = "abc"
输出：3
解释：最长公共子序列是 "abc"，长度为 3。
```

```text
输入：text1 = "abc", text2 = "def"
输出：0
解释：两个字符串没有公共子序列。
```

---

## 核心难点

这道题的重点是区分：

```text
子序列
```

和：

```text
子串
```

子串必须连续，子序列不要求连续，但必须保持相对顺序。

例如：

```text
text1 = "abcde"
```

`"ace"` 是它的子序列，因为可以删除 `'b'` 和 `'d'`。

但是 `"ace"` 不是它的子串，因为 `"a"`、`"c"`、`"e"` 在原字符串中并不连续。

---

## 解题思路

这是一道典型的二维动态规划题。

对于两个字符串的问题，尤其是求“最长公共”相关内容，通常可以考虑：

```text
dp[i][j] 表示 text1 的前 i 个字符 和 text2 的前 j 个字符 的最长公共子序列长度
```

注意这里的“前 i 个字符”表示：

```text
text1[0 ... i - 1]
```

“前 j 个字符”表示：

```text
text2[0 ... j - 1]
```

这样定义的好处是可以自然处理空字符串。

---

## 动态规划定义

定义：

```text
dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
```

最终答案是：

```text
dp[m][n]
```

其中：

```text
m = text1.length()
n = text2.length()
```

---

## 状态转移

假设当前比较的是：

```text
text1.charAt(i - 1)
text2.charAt(j - 1)
```

因为 `dp[i][j]` 表示前 `i` 个字符和前 `j` 个字符，所以当前字符下标要减 `1`。

---

### 情况一：两个字符相等

如果：

```java
text1.charAt(i - 1) == text2.charAt(j - 1)
```

说明这两个字符可以作为公共子序列的最后一个字符。

那么：

```text
dp[i][j] = dp[i - 1][j - 1] + 1
```

意思是：

```text
前面的最长公共子序列长度 + 当前这个相同字符
```

例如：

```text
text1 = "abc"
text2 = "adc"
```

当比较到最后一个字符 `'c'` 时，两者相等，所以可以在前面结果的基础上加 `1`。

---

### 情况二：两个字符不相等

如果：

```java
text1.charAt(i - 1) != text2.charAt(j - 1)
```

说明这两个字符不能同时作为公共子序列的最后一个字符。

此时有两种选择：

1. 不使用 `text1` 的当前字符，看 `dp[i - 1][j]`
2. 不使用 `text2` 的当前字符，看 `dp[i][j - 1]`

取两者最大值：

```text
dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
```

---

## 初始化

当任意一个字符串为空时，最长公共子序列长度一定是 `0`。

所以：

```text
dp[0][j] = 0
dp[i][0] = 0
```

Java 中 `int[][]` 默认初始化为 `0`，因此不需要额外赋值。

---

## Java 代码实现

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();

        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }
}
```

---

## 代码解析

### 1. 创建 dp 数组

```java
int[][] dp = new int[m + 1][n + 1];
```

为什么是 `m + 1` 和 `n + 1`？

因为要额外留出一行和一列表示空字符串。

```text
dp[0][j] 表示 text1 为空
dp[i][0] 表示 text2 为空
```

这样可以避免处理很多边界条件。

---

### 2. 从 1 开始遍历

```java
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        ...
    }
}
```

因为 `dp[0][j]` 和 `dp[i][0]` 是空字符串情况，所以真正比较字符时从 `1` 开始。

当前比较的字符是：

```java
text1.charAt(i - 1)
text2.charAt(j - 1)
```

---

### 3. 字符相等时

```java
dp[i][j] = dp[i - 1][j - 1] + 1;
```

如果当前两个字符相同，就可以把这个字符加入公共子序列。

所以结果来自左上角：

```text
dp[i - 1][j - 1]
```

再加上当前这个公共字符。

---

### 4. 字符不相等时

```java
dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
```

如果当前两个字符不同，就不能同时选它们。

只能尝试：

```text
去掉 text1 当前字符
```

或者：

```text
去掉 text2 当前字符
```

然后选择较大的结果。

---

## 执行流程示例

以：

```text
text1 = "abcde"
text2 = "ace"
```

为例。

最长公共子序列是：

```text
"ace"
```

过程可以理解为：

```text
a 匹配 a，长度 +1
c 匹配 c，长度 +1
e 匹配 e，长度 +1
```

最终答案是：

```text
3
```

---

## dp 表格示意

对于：

```text
text1 = "abcde"
text2 = "ace"
```

`dp` 表大致如下：

```text
        ""  a  c  e
    ""   0  0  0  0
     a   0  1  1  1
     b   0  1  1  1
     c   0  1  2  2
     d   0  1  2  2
     e   0  1  2  3
```

右下角的 `3` 就是答案。

---

## 复杂度分析

设：

```text
m = text1.length()
n = text2.length()
```

### 时间复杂度

```text
O(m * n)
```

因为需要填充一个 `m * n` 规模的二维表。

### 空间复杂度

```text
O(m * n)
```

因为使用了二维数组 `dp`。

---

## 空间优化

由于 `dp[i][j]` 只依赖：

```text
dp[i - 1][j - 1]
dp[i - 1][j]
dp[i][j - 1]
```

所以可以使用一维数组进行空间优化。

---

## 一维 dp 代码

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();

        int[] dp = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int prev = 0;

            for (int j = 1; j <= n; j++) {
                int temp = dp[j];

                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                }

                prev = temp;
            }
        }

        return dp[n];
    }
}
```

---

## 一维 dp 代码解析

在二维 dp 中：

```text
dp[i][j] 依赖 dp[i - 1][j - 1]
```

但压缩成一维数组后，`dp[j]` 会被当前行的新值覆盖。

所以需要用：

```java
int prev = 0;
```

保存上一行左上角的值，也就是二维写法中的：

```text
dp[i - 1][j - 1]
```

每次循环中：

```java
int temp = dp[j];
```

先保存当前 `dp[j]` 的旧值，也就是二维写法中的：

```text
dp[i - 1][j]
```

循环末尾：

```java
prev = temp;
```

把旧的 `dp[j]` 交给下一个位置作为左上角。

---

## 两种写法对比

| 写法 | 时间复杂度 | 空间复杂度 | 推荐程度 |
| --- | --- | --- | --- |
| 二维 dp | `O(m * n)` | `O(m * n)` | 初学优先 |
| 一维 dp | `O(m * n)` | `O(n)` | 掌握后使用 |

初学时建议先写二维 dp，因为状态含义更清楚，不容易写错。

---

## 易错点

### 1. 把子序列误认为子串

子序列不要求连续。

例如：

```text
"ace" 是 "abcde" 的子序列
```

因为删除 `'b'` 和 `'d'` 后可以得到 `"ace"`。

---

### 2. `dp[i][j]` 和字符下标对应关系写错

如果 `dp[i][j]` 表示前 `i` 个字符和前 `j` 个字符，那么当前字符是：

```java
text1.charAt(i - 1)
text2.charAt(j - 1)
```

不是：

```java
text1.charAt(i)
text2.charAt(j)
```

---

### 3. 字符不相等时不能写成左上角

字符不相等时，不能使用：

```java
dp[i][j] = dp[i - 1][j - 1];
```

因为最长公共子序列可能来自：

```text
text1 少一个字符
```

或者：

```text
text2 少一个字符
```

所以应该写：

```java
dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
```

---

## 总结

这道题是经典的二维动态规划问题。

核心定义是：

```text
dp[i][j] 表示 text1 前 i 个字符 和 text2 前 j 个字符 的最长公共子序列长度
```

状态转移分两种情况：

```text
字符相等：dp[i][j] = dp[i - 1][j - 1] + 1
字符不等：dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
```

最终返回：

```java
dp[m][n]
```

面试或刷题时，建议优先掌握二维 dp 写法，再学习一维空间优化。
