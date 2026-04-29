---
title: 有效的括号
description: leetcode刷题第四十三天
pubDate: 2026-04-29T08:28
image: /images/leetcode-073/14123d89c381709d.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #20 - 有效的括号

## 题目描述

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。

**有效字符串需满足：**
1. 左括号必须用相同类型的右括号闭合
2. 左括号必须以正确的顺序闭合
3. 每个右括号都有一个对应的相同类型的左括号

**示例：**
```
输入: s = "()"
输出: true

输入: s = "()[]{}"
输出: true

输入: s = "(]"
输出: false

输入: s = "([)]"
输出: false

输入: s = "{[]}"
输出: true
```

---

## 解题思路

### 核心思想：栈（Stack）

栈的特点是 **LIFO（Last In First Out，后进先出）**。

这正好匹配括号的匹配特性：**最后出现的左括号，应该最先被匹配**。

### 算法步骤

```
1. 遍历字符串 s
2. 遇到左括号 → 入栈
3. 遇到右括号 → 检查栈顶是否是对应的左括号
   - 是：弹出栈顶，继续
   - 否：返回 false
4. 遍历结束 → 检查栈是否为空
   - 空：返回 true
   - 非空：返回 false
```

---

## 图解过程

### 示例 1：s = "{[]}"

```
步骤    字符    操作        栈状态
─────────────────────────────────
 1       {     入栈        [{]
 2       [     入栈        [{, []
 3       ]     匹配，弹出    [{]
 4       }     匹配，弹出    []

栈为空，返回 true ✓
```

### 示例 2：s = "([)]"

```
步骤    字符    操作        栈状态
─────────────────────────────────
 1       (     入栈        [(]
 2       [     入栈        [(, []
 3       )     不匹配!     [(, []

返回 false ✓
```

### 示例 3：s = "((("

```
步骤    字符    操作        栈状态
─────────────────────────────────
 1       (     入栈        [(]
 2       (     入栈        [(, (, ]
 3       (     入栈        [(, (, (, ]

栈不为空，返回 false ✓
```

---

## Java 代码实现

### 方案一：使用 Stack 类

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                // 左括号：入栈
                stack.push(c);
            } else {
                // 右括号：检查是否匹配
                if (stack.isEmpty()) {
                    return false;  // 栈空，无法匹配
                }

                char top = stack.pop();

                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }

        return stack.isEmpty();  // 栈空说明全部匹配
    }
}
```

### 方案二：使用数组模拟栈（推荐，更高效）

```java
class Solution {
    public boolean isValid(String s) {
        char[] stack = new char[s.length()];
        int top = 0;  // 栈顶指针

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack[top++] = c;  // 入栈
            } else {
                if (top == 0) {
                    return false;  // 栈空
                }

                char left = stack[--top];  // 弹出

                if (c == ')' && left != '(') return false;
                if (c == ']' && left != '[') return false;
                if (c == '}' && left != '{') return false;
            }
        }

        return top == 0;
    }
}
```

---

## 优化：使用 Map 存储配对关系

```java
class Solution {
    public boolean isValid(String s) {
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put(']', '[');
        pairs.put('}', '{');

        Stack<Character> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            if (pairs.containsKey(c)) {
                // 是右括号
                if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                    return false;
                }
            } else {
                // 是左括号，入栈
                stack.push(c);
            }
        }

        return stack.isEmpty();
    }
}
```

---

## 复杂度分析

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| **时间复杂度** | O(n) | 只需遍历一次字符串 |
| **空间复杂度** | O(n) | 最坏情况（全是左括号）栈的大小 |

---

## 关键点总结

1. **为什么用栈？**
   - 括号的匹配是"后进先出"
   - 最后出现的左括号需要最先被匹配

2. **两个判断条件：**
   - 遍历时：右括号必须有匹配的左括号
   - 遍历后：栈必须为空（没有剩余的左括号）

3. **易错点：**
   - 栈为空时遇到右括号 → 直接返回 false
   - 遍历结束后栈不为空 → 返回 false

4. **推荐优化：**
   - 使用数组模拟栈，避免 Stack 类的同步开销
   - 或使用 ArrayDeque，性能更好

---

## 相关题目

| 题目 | 难度 | 关联 |
|------|------|------|
| 20 有效的括号 | 简单 | 本题 |
| 32 最长有效括号 | 困难 | 栈的延伸 |
| 921 使括号有效的最少添加 | 中等 | 栈的延伸 |
| 1541 平衡字符串 | 中等 | 栈的延伸 |