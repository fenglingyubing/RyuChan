---
title: 最长有效括号
description: leecode刷题第五十二天
pubDate: 2026-05-12T18:00
image: /images/leetcode-094/1dc9cd24e097a20f.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 32. 最长有效括号

## 题目描述

给你一个只包含 `'('` 和 `')'` 的字符串 `s`，找出最长有效括号子串的长度。

有效括号要求左右括号能够正确匹配，例如：

```text
()
(())
()()
(()())
```

注意题目要求的是：

```text
最长有效括号子串
```

这里的“子串”必须是连续的。

---

## 示例

```text
输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"
```

```text
输入：s = ")()())"
输出：4
解释：最长有效括号子串是 "()()"
```

```text
输入：s = ""
输出：0
```

---

## 核心难点

这题和第 20 题“有效的括号”不一样。

第 20 题是判断整个字符串是否合法。

这题是找：

```text
最长的、连续的、合法括号片段
```

例如：

```text
s = ")()())"
```

整个字符串不是合法括号，但是中间的：

```text
()()
```

是合法的，并且长度是 `4`。

---

## 解法一：栈

### 核心思路

栈里存的是下标，不是字符。

为什么存下标？

因为我们最后要求的是长度，需要用：

```text
当前下标 - 边界下标
```

来计算有效括号子串的长度。

---

## 栈里放什么

栈中保存两类下标：

1. 还没有匹配成功的左括号 `'('` 的下标
2. 最近一个无法匹配的右括号 `')'` 的下标，作为边界

一开始先放入 `-1`：

```java
stack.push(-1);
```

这个 `-1` 是一个虚拟边界。

如果字符串一开始就出现了合法括号，例如：

```text
s = "()"
```

当遍历到下标 `1` 的 `')'` 时，弹出 `'('` 的下标 `0`，此时栈顶是 `-1`。

长度就是：

```text
1 - (-1) = 2
```

所以 `-1` 是为了方便计算从下标 `0` 开始的有效子串长度。

---

## 遍历规则

遍历字符串 `s`。

### 遇到左括号

左括号先入栈，等待后面的右括号来匹配：

```java
if (s.charAt(i) == '(') {
    stack.push(i);
}
```

### 遇到右括号

右括号尝试匹配栈顶的左括号，所以先弹出：

```java
stack.pop();
```

弹出以后分两种情况。

### 情况一：栈为空

说明这个右括号没有左括号可以匹配。

它是一个新的非法边界，需要把它的下标放入栈中：

```java
if (stack.isEmpty()) {
    stack.push(i);
}
```

例如：

```text
s = ")()"
```

下标 `0` 的 `')'` 没有办法匹配，所以它会成为边界。

后面的合法长度只能从它后面开始算。

### 情况二：栈不为空

说明刚才成功匹配了一对括号。

当前有效括号子串的长度是：

```text
i - stack.peek()
```

更新答案：

```java
maxLen = Math.max(maxLen, i - stack.peek());
```

---

## 为什么是 i - stack.peek()

栈顶保存的是“当前有效子串左边界的前一个位置”。

例如：

```text
s = ")()())"
```

遍历到下标 `4` 时：

```text
下标： 0 1 2 3 4 5
字符： ) ( ) ( ) )
```

此时下标 `1~4` 组成：

```text
()()
```

长度是 `4`。

栈顶是下标 `0`，它是前面那个非法的 `')'`。

所以长度为：

```text
4 - 0 = 4
```

这就是为什么栈里要保留边界下标。

---

## 图解过程

以：

```text
s = ")()())"
```

为例。

初始：

```text
stack = [-1]
maxLen = 0
```

```text
下标  字符  操作                         栈状态       maxLen
----------------------------------------------------------------
0     )    弹出 -1，栈空，压入 0          [0]          0
1     (    压入 1                        [0, 1]       0
2     )    弹出 1，长度 2 - 0 = 2         [0]          2
3     (    压入 3                        [0, 3]       2
4     )    弹出 3，长度 4 - 0 = 4         [0]          4
5     )    弹出 0，栈空，压入 5          [5]          4
```

最终答案是：

```text
4
```

---

## Java 代码：栈解法

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int longestValidParentheses(String s) {
        int maxLen = 0;
        Deque<Integer> stack = new ArrayDeque<>();

        stack.push(-1);

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '(') {
                stack.push(i);
            } else {
                stack.pop();

                if (stack.isEmpty()) {
                    stack.push(i);
                } else {
                    maxLen = Math.max(maxLen, i - stack.peek());
                }
            }
        }

        return maxLen;
    }
}
```

---

## 代码解释

```java
Deque<Integer> stack = new ArrayDeque<>();
```

使用栈保存下标。

```java
stack.push(-1);
```

先放一个虚拟边界，方便计算从下标 `0` 开始的有效括号长度。

```java
if (c == '(') {
    stack.push(i);
}
```

遇到左括号，把它的下标放入栈中，等待后面匹配。

```java
stack.pop();
```

遇到右括号，尝试和栈顶的左括号匹配。

```java
if (stack.isEmpty()) {
    stack.push(i);
}
```

如果弹出后栈空，说明当前右括号没有匹配对象，需要把它作为新的边界。

```java
maxLen = Math.max(maxLen, i - stack.peek());
```

如果栈不为空，说明当前形成了一个有效括号子串，长度就是当前下标减去边界下标。

---

## 解法二：动态规划

### 动态规划定义

定义：

```text
dp[i] 表示以下标 i 结尾的最长有效括号子串长度
```

注意，是“以下标 `i` 结尾”。

如果 `s.charAt(i)` 是 `'('`，那么它不可能作为一个有效括号子串的结尾，所以：

```text
dp[i] = 0
```

只有当 `s.charAt(i)` 是 `')'` 时，才有可能形成有效括号。

---

## 状态转移

### 情况一：前一个字符是左括号

如果：

```text
s[i] == ')' 且 s[i - 1] == '('
```

说明最后两个字符是：

```text
()
```

那么：

```text
dp[i] = dp[i - 2] + 2
```

如果 `i - 2` 越界，就当成 `0`。

例如：

```text
s = "()"
```

下标 `1` 结尾的最长有效括号长度就是：

```text
2
```

---

### 情况二：前一个字符是右括号

如果：

```text
s[i] == ')' 且 s[i - 1] == ')'
```

这种形式可能是：

```text
(())
```

关键是找到和当前 `')'` 匹配的那个 `'('`。

已知：

```text
dp[i - 1]
```

表示以下标 `i - 1` 结尾的有效括号长度。

那么这个有效片段的左边界是：

```text
i - dp[i - 1]
```

如果当前 `')'` 要继续向左匹配，那么它要匹配的位置是：

```text
i - dp[i - 1] - 1
```

记为：

```java
int leftIndex = i - dp[i - 1] - 1;
```

如果：

```text
leftIndex >= 0 且 s[leftIndex] == '('
```

说明当前 `')'` 可以和这个 `'('` 匹配。

那么：

```text
dp[i] = dp[i - 1] + 2
```

如果这个匹配括号前面还有一段有效括号，也要接上：

```text
dp[i] += dp[leftIndex - 1]
```

所以完整写法是：

```text
dp[i] = dp[i - 1] + 2 + dp[leftIndex - 1]
```

其中 `leftIndex - 1` 越界时，按 `0` 处理。

---

## Java 代码：动态规划

```java
class Solution {
    public int longestValidParentheses(String s) {
        int n = s.length();
        int[] dp = new int[n];
        int maxLen = 0;

        for (int i = 1; i < n; i++) {
            if (s.charAt(i) == ')') {
                if (s.charAt(i - 1) == '(') {
                    dp[i] = 2;

                    if (i >= 2) {
                        dp[i] += dp[i - 2];
                    }
                } else {
                    int leftIndex = i - dp[i - 1] - 1;

                    if (leftIndex >= 0 && s.charAt(leftIndex) == '(') {
                        dp[i] = dp[i - 1] + 2;

                        if (leftIndex >= 1) {
                            dp[i] += dp[leftIndex - 1];
                        }
                    }
                }

                maxLen = Math.max(maxLen, dp[i]);
            }
        }

        return maxLen;
    }
}
```

---

## 动态规划例子

以：

```text
s = "()(())"
```

为例。

```text
下标： 0 1 2 3 4 5
字符： ( ) ( ( ) )
dp：   0 2 0 0 2 6
```

解释：

```text
dp[1] = 2，对应 "()"
dp[4] = 2，对应 "()"
dp[5] = 6，对应 "()(())"
```

为什么 `dp[5] = 6`？

下标 `5` 是 `')'`，前一个字符下标 `4` 也是 `')'`。

`dp[4] = 2`，说明下标 `3~4` 是有效括号：

```text
()
```

当前 `')'` 想继续匹配，需要找的位置是：

```text
leftIndex = 5 - dp[4] - 1 = 5 - 2 - 1 = 2
```

下标 `2` 是 `'('`，可以匹配。

所以先得到：

```text
dp[5] = dp[4] + 2 = 4
```

下标 `2` 前面还有一段有效括号：

```text
dp[1] = 2
```

所以总长度：

```text
dp[5] = 4 + 2 = 6
```

---

## 两种解法对比

```text
解法      时间复杂度    空间复杂度    特点
------------------------------------------------
栈        O(n)          O(n)          更直观，推荐优先掌握
动态规划  O(n)          O(n)          状态转移较绕，但适合练 DP
```

---

## 易错点

### 1. 忘记子串必须连续

题目要求的是最长有效括号子串，不是子序列。

例如：

```text
s = "())(()"
```

不能随便跳着选括号，必须找连续的一段。

---

### 2. 栈里存字符而不是下标

这题要求长度，所以栈里应该存下标。

如果只存 `'('`，最后不好计算有效子串长度。

---

### 3. 栈解法没有放入 -1

如果没有一开始的：

```java
stack.push(-1);
```

对于这种字符串：

```text
s = "()"
```

就不好计算长度 `2`。

`-1` 是为了作为最开始的边界。

---

### 4. 遇到无法匹配的右括号后，没有更新边界

例如：

```text
s = ")()"
```

第一个 `')'` 无法匹配，它应该成为新的边界。

所以栈空时要执行：

```java
stack.push(i);
```

否则后面的长度会算错。

---

## 总结

这道题推荐先掌握栈解法。

核心是：

```text
栈里存下标
栈顶表示当前有效子串左边界的前一个位置
遇到 '(' 入栈
遇到 ')' 弹栈
弹完栈空，说明当前 ')' 无法匹配，把它作为新边界
弹完栈不空，用 i - stack.peek() 更新最长长度
```

推荐提交代码：

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int longestValidParentheses(String s) {
        int maxLen = 0;
        Deque<Integer> stack = new ArrayDeque<>();

        stack.push(-1);

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);
            } else {
                stack.pop();

                if (stack.isEmpty()) {
                    stack.push(i);
                } else {
                    maxLen = Math.max(maxLen, i - stack.peek());
                }
            }
        }

        return maxLen;
    }
}
```
