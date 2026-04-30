---
title: 字符串解码
description: leetcode刷题第四十四天
pubDate: 2026-04-30T19:24
image: /images/leetcode-075/66decb5a83fef1c7.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #394 - 字符串解码

## 题目描述

给定一个经过编码的字符串，返回它解码后的字符串。

**编码规则：** `k[encoded_string]` 表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。

**注意：**
- `k` 保证为正整数
- 输入字符串总是有效的
- 方括号总是符合格式要求
- 原始数据不包含数字（数字只表示重复次数）

**示例：**
```
输入: s = "3[a]2[bc]"
输出: "aaabcbc"

输入: s = "3[a2[c]]"
输出: "accaccacc"

输入: s = "2[abc]3[cd]ef"
输出: "abcabccdcdcdef"
```

---

## 解题思路

### 方法一：栈

**核心思想**：用两个栈分别存储**重复次数**和**之前的字符串**

```
遍历字符串 s：
├─ 数字：收集完整数字，入数字栈
├─ '['：当前字符串入栈，重置当前字符串
├─ ']'：弹出数字和之前字符串，重复并拼接
└─ 字母：添加到当前字符串
```

### 方法二：递归

**核心思想**：遇到 `[` 就进入下一层递归

```
decodeString(s):
├─ 如果遇到 ']'：返回当前解析结果
├─ 如果遇到 '['：递归解析内部字符串
└─ 其他：收集字母
```

---

## 图解过程

### 示例：`3[a2[c]]`

```
步骤    字符    操作                    当前字符串    字符串栈
──────────────────────────────────────────────────────────────
 1      3      收集数字                  ""
 2      [      数字入栈，重置            ""           ["", ]
 3      a      添加到当前                "a"          [""]
 4      2      收集数字                  "a"          [""]
 5      [      数字入栈，重置            ""           ["", ""]
 6      c      添加到当前                "c"          [""]
 7      ]      弹出，重复"c"两次        "cc"         [""]
 8      ]      弹出，"a"+"cc"*3        "accaccacc"   []

结果: "accaccacc"
```

---

### 示例：`2[abc3[cd]]`

```
步骤    操作                    字符串栈    当前字符串
──────────────────────────────────────────────────
1       2入数字栈              []
2       [ 入栈                 ["", ]
3       abc                    ["", ]       "abc"
4       3 入数字栈
5       [ 入栈                 ["", "", ]
6       cd                    ["", "", ]    "cd"
7       ] 弹出3，重复"cd"     ["", "", ]    "cdcdcd"
8       ] 弹出2，重复"abc..."  []           "abcabc"+"cdcdcd"
```

---

## Java 代码实现

### 方法一：双栈实现

```java
class Solution {
    public String decodeString(String s) {
        Stack<Integer> countStack = new Stack<>();   // 数字栈
        Stack<StringBuilder> stringStack = new Stack<>();  // 字符串栈
        StringBuilder current = new StringBuilder();
        int count = 0;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                // 收集数字（可能是多位）
                count = count * 10 + (c - '0');
            } else if (c == '[') {
                // 入栈
                countStack.push(count);
                stringStack.push(current);
                // 重置
                current = new StringBuilder();
                count = 0;
            } else if (c == ']') {
                // 弹出并重复
                int repeatCount = countStack.pop();
                StringBuilder decoded = new StringBuilder();
                for (int i = 0; i < repeatCount; i++) {
                    decoded.append(current);
                }
                // 拼接之前的字符串
                current = stringStack.pop().append(decoded);
            } else {
                // 字母
                current.append(c);
            }
        }

        return current.toString();
    }
}
```

### 方法二：递归实现

```java
class Solution {
    private int index = 0;

    public String decodeString(String s) {
        return decode(s);
    }

    private String decode(String s) {
        StringBuilder result = new StringBuilder();
        int count = 0;

        while (index < s.length()) {
            char c = s.charAt(index);

            if (c == ']') {
                // 返回当前解析结果
                return result.toString();
            } else if (Character.isDigit(c)) {
                // 收集数字
                count = count * 10 + (c - '0');
                index++;
            } else if (c == '[') {
                // 进入下一层递归
                index++;  // 跳过 '['
                String inner = decode(s);  // 解析内部字符串
                // 根据 count 重复
                for (int i = 0; i < count; i++) {
                    result.append(inner);
                }
                count = 0;  // 重置 count
            } else {
                // 字母
                result.append(c);
                index++;
            }
        }

        return result.toString();
    }
}
```

### 方法三：使用 ArrayDeque（推荐）

```java
class Solution {
    public String decodeString(String s) {
        Deque<Integer> countStack = new ArrayDeque<>();
        Deque<StringBuilder> stringStack = new ArrayDeque<>();

        StringBuilder current = new StringBuilder();
        int count = 0;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                count = count * 10 + (c - '0');
            } else if (c == '[') {
                countStack.push(count);
                stringStack.push(current);
                current = new StringBuilder();
                count = 0;
            } else if (c == ']') {
                int repeatCount = countStack.pop();
                StringBuilder decoded = new StringBuilder();
                for (int i = 0; i < repeatCount; i++) {
                    decoded.append(current);
                }
                current = stringStack.pop().append(decoded);
            } else {
                current.append(c);
            }
        }

        return current.toString();
    }
}
```

---

## 复杂度分析

| 方法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 双栈 | O(n) | O(n) |
| 递归 | O(n) | O(n)（递归栈深度） |

---

## 关键点总结

### 1. 数字可能是多位

```java
// 3[a] 和 12[bc] 的区别
count = count * 10 + (c - '0');
```

### 2. `[` 和 `]` 的处理时机

```
遇到 '['：
  - 数字入数字栈
  - 当前字符串入字符串栈
  - 重置当前字符串和数字

遇到 ']'：
  - 弹出数字 N
  - 弹出之前的字符串
  - 当前字符串重复 N 次
  - 拼接到之前的字符串后面
```

### 3. 为什么用 StringBuilder？

- StringBuilder 是可变的，方便 append
- 每次处理完 `[` 后创建新的 StringBuilder

---

## 递归 vs 栈 对比

| 方面 | 递归 | 栈 |
|------|------|-----|
| 代码简洁度 | 简洁 | 稍复杂 |
| 空间复杂度 | O(n) 递归深度 | O(n) |
| 风险 | 可能栈溢出 | 无溢出风险 |
| 推荐 | √ | √ |

---

## 扩展题目

| 题目 | 难度 | 说明 |
|------|------|------|
| 394 字符串解码 | 中等 | 本题 |
| 20 有效的括号 | 简单 | 栈基础 |
| 32 最长有效括号 | 困难 | 栈延伸 |
| 241 为运算表达式加括号 | 中等 | 递归分解 |