---
title: 单词拆分
description: leetcode刷题第五十天
pubDate: 2026-05-10T12:49
image: /images/leetcode-090/3132fc3fcaa0358e.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 139. 单词拆分

## 题目描述

给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。

如果可以利用字典中出现的一个或多个单词拼接出 `s`，则返回 `true`。

注意：

- 不要求字典中出现的单词全部都使用；
- 字典中的单词可以重复使用。

示例：

```text
输入：s = "leetcode", wordDict = ["leet", "code"]
输出：true
解释："leetcode" 可以由 "leet" 和 "code" 拼接得到
```

```text
输入：s = "applepenapple", wordDict = ["apple", "pen"]
输出：true
解释："apple" 可以重复使用
```

```text
输入：s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
输出：false
```

---

## 核心思路

这道题要判断字符串 `s` 能不能被字典中的单词拼出来。

可以把问题拆成：

```text
s 的前 i 个字符，能不能被 wordDict 中的单词拼出来？
```

如果我们已经知道前面某一段可以被拼出来，再判断后面接上的这一段是不是字典中的单词，就可以推出更长的字符串是否能被拼出来。

例如：

```text
s = "leetcode"
wordDict = ["leet", "code"]
```

当我们判断整个 `"leetcode"` 时，可以切成：

```text
"leet" + "code"
```

如果：

```text
"leet" 可以被拼出来
"code" 在字典中
```

那么：

```text
"leetcode" 就可以被拼出来
```

---

## 动态规划定义

定义：

```text
dp[i] 表示 s 的前 i 个字符能否被字典中的单词拼出来
```

注意这里的 `i` 表示长度，不是下标。

例如：

```text
s = "leetcode"
```

那么：

```text
dp[4] 表示 "leet" 能否被拼出来
dp[8] 表示 "leetcode" 能否被拼出来
```

目标：

```text
返回 dp[s.length()]
```

初始状态：

```text
dp[0] = true
```

含义是：空字符串可以被拼出来。

为什么空字符串是 `true`？

因为当某个单词刚好从开头开始匹配时，需要依赖 `dp[0]`。

例如：

```text
s = "leetcode"
```

判断 `"leet"` 时：

```text
前面空字符串可以拼出来
"leet" 在字典中
```

所以：

```text
dp[4] = true
```

---

## 状态转移

对于每个位置 `i`，枚举一个切分点 `j`：

```text
s[0 ... j - 1] + s[j ... i - 1]
```

也就是：

```text
前 j 个字符 + 从 j 到 i 的这段字符串
```

如果满足：

```text
dp[j] == true
```

并且：

```text
s.substring(j, i) 在字典中
```

那么说明：

```text
dp[i] = true
```

状态转移公式：

```text
dp[i] = dp[j] && wordSet.contains(s.substring(j, i))
```

只要存在一个 `j` 满足条件，`dp[i]` 就是 `true`。

---

## 举例分析

以：

```text
s = "leetcode"
wordDict = ["leet", "code"]
```

为例。

字符串长度是 `8`，所以 `dp` 数组长度是 `9`。

初始化：

```text
dp[0] = true
```

表示空字符串可以被拼出来。

### i = 1

前 1 个字符是：

```text
"l"
```

检查切分：

```text
"" + "l"
```

`"l"` 不在字典中，所以：

```text
dp[1] = false
```

### i = 4

前 4 个字符是：

```text
"leet"
```

可以切成：

```text
"" + "leet"
```

其中：

```text
dp[0] = true
"leet" 在字典中
```

所以：

```text
dp[4] = true
```

表示 `"leet"` 可以被拼出来。

### i = 8

前 8 个字符是：

```text
"leetcode"
```

重点检查切分点 `j = 4`：

```text
"leet" + "code"
```

其中：

```text
dp[4] = true
"code" 在字典中
```

所以：

```text
dp[8] = true
```

最终返回：

```text
true
```

---

## Java 代码

```java
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];

        dp[0] = true;

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[s.length()];
    }
}
```

---

## 代码解释

```java
Set<String> wordSet = new HashSet<>(wordDict);
```

把字典列表转成 `HashSet`，方便快速判断某个字符串是否在字典中。

```java
boolean[] dp = new boolean[s.length() + 1];
```

创建 `dp` 数组。

`dp[i]` 表示 `s` 的前 `i` 个字符能不能被字典中的单词拼出来。

```java
dp[0] = true;
```

空字符串可以被拼出来，这是动态规划的起点。

```java
for (int i = 1; i <= s.length(); i++) {
```

枚举当前要判断的前缀长度。

```java
for (int j = 0; j < i; j++) {
```

枚举切分点 `j`。

当前字符串被切成两部分：

```text
s[0 ... j - 1]
s[j ... i - 1]
```

对应 Java 代码就是：

```java
s.substring(j, i)
```

```java
if (dp[j] && wordSet.contains(s.substring(j, i))) {
```

这个条件表示：

```text
前 j 个字符可以被拼出来
从 j 到 i 的这一段字符串在字典中
```

只要两个条件都满足，说明前 `i` 个字符也可以被拼出来。

```java
dp[i] = true;
break;
```

一旦找到一种合法切法，`dp[i]` 就已经确定是 `true`，不用继续枚举其他切分点。

---

## 另一种理解方式

可以把字符串想成一条路。

下标位置是节点：

```text
0 1 2 3 4 5 6 7 8
```

如果某一段子串在字典中，就表示两个位置之间有一条路。

例如：

```text
s = "leetcode"
wordDict = ["leet", "code"]
```

因为：

```text
s[0, 4) = "leet"
s[4, 8) = "code"
```

所以可以走：

```text
0 -> 4 -> 8
```

如果能从位置 `0` 走到位置 `s.length()`，就说明字符串可以被拆分。

动态规划的 `dp[i]` 就是在记录：

```text
位置 i 能不能走到
```

---

## 复杂度分析

设字符串长度为 `n`。

时间复杂度：

```text
O(n^3)
```

原因是：

- 外层循环枚举 `i`，最多 `n` 次；
- 内层循环枚举 `j`，最多 `n` 次；
- `substring(j, i)` 在 Java 中会创建新字符串，最坏需要 `O(n)` 时间。

如果暂时不考虑字符串截取成本，常见也会写成：

```text
O(n^2)
```

空间复杂度：

```text
O(n + m)
```

其中 `n` 是字符串长度，`m` 是字典中的单词数量。

`dp` 数组需要 `O(n)` 空间，`HashSet` 需要存储字典。

---

## 易错点

### 1. dp 数组长度是 s.length() + 1

因为 `dp[i]` 表示前 `i` 个字符，而不是下标为 `i` 的字符。

所以必须有：

```text
dp[0] 到 dp[s.length()]
```

### 2. dp[0] 必须是 true

`dp[0] = true` 表示空字符串可以被拼出来。

如果没有这个初始化，从开头开始的单词就无法被正确判断。

比如：

```text
s = "leet"
wordDict = ["leet"]
```

判断 `"leet"` 时依赖：

```text
dp[0] == true
```

### 3. substring 的右边界不包含

Java 中：

```java
s.substring(j, i)
```

表示从下标 `j` 开始，到下标 `i` 之前结束。

也就是：

```text
[j, i)
```

### 4. 找到一种切法后可以 break

只要发现某个 `j` 可以让 `dp[i] = true`，就不需要继续判断其他切法。

因为题目只问能不能拆分，不要求输出所有拆分方案。

---

## 总结

这道题的关键是定义：

```text
dp[i] = s 的前 i 个字符能否被字典中的单词拼出来
```

然后枚举切分点 `j`：

```text
如果 dp[j] 为 true，并且 s.substring(j, i) 在字典中
那么 dp[i] = true
```

最终返回：

```text
dp[s.length()]
```

本质上，它是在判断字符串能不能被切成若干段，并且每一段都存在于字典中。
