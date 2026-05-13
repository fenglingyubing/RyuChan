---
title: 最长回文子串
description: leetcode刷题第五十三天
pubDate: 2026-05-13T14:52
image: /images/leetcode-097/446e933b8ada09aa.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 5. 最长回文子串

## 题目描述

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

回文串指的是正着读和反着读都一样的字符串。

例如：

```text
"aba" 是回文串
"abba" 是回文串
"abc" 不是回文串
```

注意题目要求的是：

```text
最长回文子串
```

这里的“子串”必须是连续的。

---

## 示例

```text
输入：s = "babad"
输出："bab"
解释："aba" 也是符合题意的答案。
```

```text
输入：s = "cbbd"
输出："bb"
```

---

## 核心难点

这道题的关键在于：如何高效判断并找到最长的回文子串。

如果直接枚举所有子串，再判断每个子串是不是回文：

1. 子串数量是 `O(n^2)`
2. 判断一个子串是否回文最坏需要 `O(n)`

总时间复杂度会达到 `O(n^3)`，效率较低。

更好的做法是利用回文串的特点：

```text
回文串一定是围绕某个中心向两边扩展出来的
```

比如：

```text
"aba"  的中心是 'b'
"abba" 的中心是中间两个 'b'
```

所以回文串有两种中心：

1. 奇数长度回文：中心是一个字符
2. 偶数长度回文：中心是两个字符之间

---

## 解法一：中心扩展法

### 核心思路

遍历字符串中的每个位置，把它当作回文中心，然后向左右两边扩展。

对于每个下标 `i`，需要尝试两种情况：

```text
1. 以 i 为中心，找奇数长度回文
2. 以 i 和 i + 1 为中心，找偶数长度回文
```

例如：

```text
s = "babad"
```

当 `i = 1` 时，字符是 `'a'`：

```text
向左看：b
中心：a
向右看：b
```

可以扩展出：

```text
"bab"
```

它是一个长度为 `3` 的回文子串。

---

## 代码实现

```java
class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 2) {
            return s;
        }

        int start = 0;
        int maxLen = 1;

        for (int i = 0; i < s.length(); i++) {
            // 情况一：奇数长度回文，比如 "aba"
            int len1 = expandAroundCenter(s, i, i);

            // 情况二：偶数长度回文，比如 "abba"
            int len2 = expandAroundCenter(s, i, i + 1);

            int len = Math.max(len1, len2);

            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }

        return s.substring(start, start + maxLen);
    }

    private int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length()
                && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }

        // 循环结束时，left 和 right 已经越过了合法回文边界
        return right - left - 1;
    }
}
```

---

## 代码解析

### 1. 记录当前最长答案

```java
int start = 0;
int maxLen = 1;
```

`start` 表示最长回文子串的起始下标。

`maxLen` 表示最长回文子串的长度。

最后答案就是：

```java
s.substring(start, start + maxLen)
```

---

### 2. 枚举每个回文中心

```java
for (int i = 0; i < s.length(); i++) {
    int len1 = expandAroundCenter(s, i, i);
    int len2 = expandAroundCenter(s, i, i + 1);
}
```

为什么要计算两次？

因为回文串分为奇数长度和偶数长度。

奇数长度：

```text
aba
 ^
中心是一个字符
```

偶数长度：

```text
abba
 ^^
中心是两个字符
```

所以：

```java
expandAroundCenter(s, i, i)
```

用于处理奇数长度回文。

```java
expandAroundCenter(s, i, i + 1)
```

用于处理偶数长度回文。

---

### 3. 从中心向两边扩展

```java
private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length()
            && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }

    return right - left - 1;
}
```

只要满足：

1. 左右指针没有越界
2. 左右字符相等

就说明当前区间仍然是回文，可以继续向外扩展。

当循环停止时，说明当前的 `left` 和 `right` 已经不属于回文区间了。

真正的回文区间是：

```text
left + 1 到 right - 1
```

所以回文长度是：

```java
right - left - 1
```

---

### 4. 根据长度反推起点

```java
start = i - (len - 1) / 2;
```

这里的公式可以同时兼容奇数长度和偶数长度。

比如奇数长度：

```text
s = "babad"
i = 1
len = 3

start = 1 - (3 - 1) / 2 = 0
答案是 s.substring(0, 3) = "bab"
```

比如偶数长度：

```text
s = "cbbd"
i = 1
len = 2

start = 1 - (2 - 1) / 2 = 1
答案是 s.substring(1, 3) = "bb"
```

---

## 执行流程示例

以：

```text
s = "cbbd"
```

为例。

遍历到 `i = 1` 时：

```text
s.charAt(1) = 'b'
```

尝试奇数长度：

```text
left = 1, right = 1
得到 "b"
```

尝试偶数长度：

```text
left = 1, right = 2
s.charAt(1) == s.charAt(2)
得到 "bb"
```

此时最长回文子串更新为：

```text
"bb"
```

---

## 复杂度分析

设字符串长度为 `n`。

### 时间复杂度

```text
O(n^2)
```

原因：

1. 一共有 `n` 个中心位置
2. 每个中心最坏可能向两边扩展 `O(n)` 次

所以总时间复杂度是 `O(n^2)`。

### 空间复杂度

```text
O(1)
```

只使用了几个变量记录答案范围，没有使用额外数组。

---

## 解法二：动态规划

这道题也可以使用动态规划。

定义：

```text
dp[i][j] 表示 s[i..j] 是否是回文串
```

如果：

```text
s.charAt(i) == s.charAt(j)
```

并且中间部分也是回文：

```text
dp[i + 1][j - 1] == true
```

那么：

```text
dp[i][j] = true
```

需要注意长度小于等于 `2` 的情况：

```text
"a" 一定是回文
"aa" 是回文
```

---

## 动态规划代码

```java
class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        if (n < 2) {
            return s;
        }

        boolean[][] dp = new boolean[n][n];
        int start = 0;
        int maxLen = 1;

        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s.charAt(i) != s.charAt(j)) {
                    dp[i][j] = false;
                } else {
                    if (len <= 2) {
                        dp[i][j] = true;
                    } else {
                        dp[i][j] = dp[i + 1][j - 1];
                    }
                }

                if (dp[i][j] && len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }

        return s.substring(start, start + maxLen);
    }
}
```

---

## 两种解法对比

| 解法 | 时间复杂度 | 空间复杂度 | 推荐程度 |
| --- | --- | --- | --- |
| 中心扩展法 | `O(n^2)` | `O(1)` | 推荐 |
| 动态规划 | `O(n^2)` | `O(n^2)` | 可掌握 |

中心扩展法代码更短，空间复杂度更低，面试中优先推荐。

---

## 易错点

### 1. 忘记偶数长度回文

如果只写：

```java
expandAroundCenter(s, i, i)
```

就会漏掉：

```text
"bb"
"abba"
"cddc"
```

这类偶数长度回文。

---

### 2. `substring` 的右边界不包含

Java 中：

```java
s.substring(start, start + maxLen)
```

表示截取：

```text
[start, start + maxLen)
```

右边界是不包含的。

---

### 3. 扩展结束后的长度计算

循环结束后，`left` 和 `right` 已经多走了一步。

所以长度不是：

```java
right - left + 1
```

而是：

```java
right - left - 1
```

---

## 总结

这道题的核心是理解：

```text
回文串可以从中心向两边扩展
```

每个位置都可能成为回文中心，并且要同时考虑奇数长度和偶数长度。

中心扩展法的优势是：

1. 思路直观
2. 代码简洁
3. 空间复杂度低

因此这题优先使用中心扩展法。
