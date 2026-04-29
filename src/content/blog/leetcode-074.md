---
title: 最小栈
description: leetcode刷题第四十三天
pubDate: 2026-04-29T09:11
image: /images/leetcode-074/58c859ccd7d0e5cf.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode #155 - 最小栈

## 题目描述

设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。

**实现 MinStack 类：**

```
MinStack() 初始化堆栈对象
void push(int val) 将元素val推入堆栈
void pop() 删除堆栈顶部的元素
int top() 获取堆栈顶部的元素
int getMin() 获取堆栈中的最小元素
```

**要求：** 所有操作的时间复杂度都是 **O(1)**

**示例：**
```
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();  → 返回 -3
minStack.pop();
minStack.top();     → 返回 0
minStack.getMin();  → 返回 -2
```

---

## 解题思路

### 核心问题

如何在 O(1) 时间获取最小值？

**不能**这样做：
- 每次 getMin 时遍历栈 → O(n)

**正确思路**：用空间换时间

---

### 方案一：辅助栈（推荐）

用一个额外的栈专门存储**历史最小值**：

```
主栈:     [3, 5, 2, 1]
辅助栈:   [3, 3, 2, 1]  ← 每个位置记录当时的最小值

pop时: 如果弹出的 == 辅助栈顶，也弹出辅助栈
getMin: 直接返回辅助栈顶
```

### 方案二：存储当前最小值

每个元素存储一个额外的"当时最小值"：

```
栈中存储: [{值, 当前最小值}]

[{3, 3}, {5, 3}, {2, 2}, {1, 1}]
  ↓        ↓        ↓       ↓
  值        值       值      值
  当时最小  当时最小  当时最小  当时最小
```

---

## 图解过程

### push 和 pop 操作

```
操作              stack              minStack          getMin
────────────────────────────────────────────────────────────────
MinStack()        []                 []                -
push(-2)          [-2]               [-2]              -2
push(0)           [-2, 0]            [-2, -2]          -2
push(-3)          [-2, 0, -3]        [-2, -2, -3]      -3
getMin()                                                  -3
pop()             [-2, 0]            [-2, -2]          -2
top()                                                     0
getMin()                                                  -2
```

---

## Java 代码实现

### 方案一：双栈实现

```java
class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int val) {
        stack.push(val);

        // 关键：只有更小或相等时才入栈
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    public void pop() {
        if (!stack.isEmpty()) {
            int val = stack.pop();
            // 关键：如果弹出的值是最小值，同步弹出minStack
            if (val == minStack.peek()) {
                minStack.pop();
            }
        }
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}
```

### 方案二：存储当前最小值

```java
class MinStack {
    private Stack<int[]> stack;

    public MinStack() {
        stack = new Stack<>();
    }

    public void push(int val) {
        // 如果栈为空，最小值就是val；否则取val和当前最小值的较小者
        int currentMin = stack.isEmpty() ? val :
                         Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, currentMin});
    }

    public void pop() {
        stack.pop();
    }

    public int top() {
        return stack.peek()[0];
    }

    public int getMin() {
        return stack.peek()[1];
    }
}
```

### 方案三：基于 ArrayList（修复版）

```java
class MinStack {
    private List<Integer> stack;
    private List<Integer> minStack;

    public MinStack() {
        stack = new ArrayList<>();
        minStack = new ArrayList<>();
    }

    public void push(int val) {
        stack.add(val);

        // 关键：minStack 入栈条件
        if (minStack.isEmpty() || val <= minStack.get(minStack.size() - 1)) {
            minStack.add(val);
        }
    }

    public void pop() {
        if (!stack.isEmpty()) {
            int val = stack.remove(stack.size() - 1);

            // 关键：如果弹出的是最小值，同步更新
            if (val == minStack.get(minStack.size() - 1)) {
                minStack.remove(minStack.size() - 1);
            }
        }
    }

    public int top() {
        return stack.get(stack.size() - 1);
    }

    public int getMin() {
        return minStack.get(minStack.size() - 1);
    }
}
```

---

## 关键点详解

### 1. 为什么用 `<=` 而不是 `<`？

```java
if (minStack.isEmpty() || val <= minStack.peek()) {
    minStack.push(val);
}
```

**原因**：考虑重复最小值的情况

```
push(1)  → stack=[1], min=[1]
push(1)  → 如果用 <，min不变，min=[1]（错误！）
          如果用 <=，min入栈，min=[1,1]（正确！）

pop()    → 如果只用一个1入栈，会丢失最小值
          用<=确保两个1都入栈，pop时正确更新
```

### 2. pop 时为什么比较 `val == minStack.peek()`？

```java
int val = stack.pop();
if (val == minStack.peek()) {  // 必须用 ==
    minStack.pop();
}
```

因为需要**精确匹配**当前最小值，而不是任何小于等于的值。

### 3. 时间复杂度分析

| 操作 | 时间复杂度 |
|------|-----------|
| push | O(1) |
| pop | O(1) |
| top | O(1) |
| getMin | O(1) |

所有操作都是 O(1)！

---

## 复杂度分析

| 方案 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 双栈 | O(1) 各项操作 | O(n) |
| 存储当前最小值 | O(1) 各项操作 | O(n) |
| 单栈 + 变量（不可行） | 至少一项不是O(1) | - |

---

## 扩展题目

| 题目 | 难度 | 说明 |
|------|------|------|
| 155 最小栈 | 中等 | 本题 |
| 716 最大栈 | 困难 | 设计最大栈 |
| 232 用栈实现队列 | 简单 | 栈的延伸 |
| 225 用队列实现栈 | 简单 | 队列实现栈 |