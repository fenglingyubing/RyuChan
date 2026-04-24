---
title: 分割回文串
description: leetcode刷题第三十八天
pubDate: 2026-04-24T15:03
image: /images/leetcode-064/7c0381e6dc760833.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 131. 分割回文串

## 问题描述

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是**回文串**，返回 `s` 所有可能的分割方案。

**示例：**
```
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]

输入：s = "a"
输出：[["a"]]
```

---

## 问题分析

### 核心思想

这道题本质上是**枚举所有切割位置**，然后判断切出来的每个子串是否是回文。

关键问题：
1. **从哪里开始切？** → 用 `start` 记录当前处理的起始位置
2. **切多长？** → 枚举所有可能的结束位置
3. **怎么判断是回文？** → 双指针或中心扩展

### 回溯框架

```
对于字符串 s，从 start=0 开始：
    for (end 从 start 到 n-1):
        如果 s[start:end+1] 是回文:
            切下来加入路径
            递归处理 s[end+1:] 部分
            撤销选择
```

---

## 解题思路

### 解法一：回溯 + 双指针判断回文

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();
    private List<String> path = new ArrayList<>();

    public List<List<String>> partition(String s) {
        backtrack(s, 0);
        return result;
    }

    private void backtrack(String s, int start) {
        // 终止条件：处理到字符串末尾，找到一种方案
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }

        // 枚举所有可能的子串
        for (int end = start; end < s.length(); end++) {
            // 剪枝：如果 s[start:end+1] 是回文，才继续
            if (isPalindrome(s, start, end)) {
                path.add(s.substring(start, end + 1));  // 做选择
                backtrack(s, end + 1);                  // 递归处理剩余部分
                path.remove(path.size() - 1);           // 撤销选择
            }
        }
    }

    // 双指针判断回文
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```

### 解法二：回溯 + 预处理dp（优化判断）

提前用动态规划预处理所有子串是否为回文，避免重复判断。

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();
    private List<String> path = new ArrayList<>();
    private boolean[][] dp;  // dp[i][j] 表示 s[i:j+1] 是否是回文

    public List<List<String>> partition(String s) {
        int n = s.length();
        // 预处理：计算所有子串是否为回文
        dp = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j) && (j - i < 2 || dp[i + 1][j - 1])) {
                    dp[i][j] = true;
                }
            }
        }

        backtrack(s, 0);
        return result;
    }

    private void backtrack(String s, int start) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {  // O(1) 判断是否为回文
                path.add(s.substring(start, end + 1));
                backtrack(s, end + 1);
                path.remove(path.size() - 1);
            }
        }
    }
}
```

---

## 复杂度分析

| 复杂度 | 解法一 | 解法二（预处理） |
|--------|--------|------------------|
| **时间复杂度** | O(n × 2^n) | O(n² + n × 2^n) |
| **空间复杂度** | O(n) 递归栈 | O(n²) dp数组 + O(n) 递归栈 |

---

## 回溯树状图（以 s = "aab" 为例）

```
                    ""
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
    "a" | "ab"              "aa" | "b"
    start=1                  start=2
        │                       │
    ┌───┴───┐               ┌───┴───┐
    ▼       ▼               ▼       ▼
 "a","a","b"✅  "a","ab"❌   "aa","b"✅   "aa","b"❌
                              (ab不是回文)
```

### 详细执行流程

```
start=0:
  end=0: s[0:1]="a" 是回文 → 选择 "a"
         backtrack(s, start=1)
            end=1: s[1:2]="a" 是回文 → 选择 "a"
                   backtrack(s, start=2)
                      end=2: s[2:3]="b" 是回文 → 选择 "b"
                             start=3 == n → 添加 ["a","a","b"] ✅
                      撤销 "b"
                   撤销 "a"
            end=2: s[1:3]="ab" 不是回文 → 跳过
         撤销 "a"
  end=1: s[0:2]="aa" 是回文 → 选择 "aa"
         backtrack(s, start=2)
            end=2: s[2:3]="b" 是回文 → 选择 "b"
                   start=3 == n → 添加 ["aa","b"] ✅
```

---

## 关键点总结

### 1. 回溯的三要素

| 要素 | 说明 |
|------|------|
| **选择** | `path.add(s.substring(start, end+1))` 切出一个子串 |
| **递归** | `backtrack(s, end+1)` 处理剩余部分 |
| **撤销** | `path.remove(path.size()-1)` 撤销切分 |

### 2. 剪枝条件

只有当切出的子串是回文时才继续：

```java
if (isPalindrome(s, start, end)) {
    // 做选择 → 递归 → 撤销
}
```

### 3. 与之前回溯题的区别

| 题目 | 结构 | 选择方式 |
|------|------|----------|
| 括号生成 | 一维，固定选择 | 选左或右 |
| 单词搜索 | 二维矩阵 | 四个方向 |
| **分割回文串** | **一维字符串** | **切多长** |

### 4. 易错点

1. **subString 的范围**：`substring(start, end+1)` 是左闭右开
2. **path.add 需要 new**：加入结果时创建新的 ArrayList
3. **回文判断边界**：注意 left < right 的循环条件

---

## 变形题目

### 变形1：分割方案数（不返回具体方案）

```java
// 只需计数，改成返回 int
private int count = 0;

private void backtrack(String s, int start) {
    if (start == s.length()) {
        count++;
        return;
    }
    // ...
}
```

### 变形2：最短分割次数（Palindrome Partitioning II）

```java
// 使用 DP 求最小分割次数
// dp[i] = s[0:i+1] 的最小分割次数
```

---

## 总结

分割回文串的**核心模板**：

```java
void backtrack(String s, int start) {
    if (start == s.length()) {
        result.add(new ArrayList<>(path));
        return;
    }

    for (int end = start; end < s.length(); end++) {
        if (isPalindrome(s, start, end)) {
            path.add(s.substring(start, end + 1));  // 做选择
            backtrack(s, end + 1);                   // 递归
            path.remove(path.size() - 1);             // 撤销
        }
    }
}
```

关键点：**枚举切分位置 + 判断回文剪枝**
