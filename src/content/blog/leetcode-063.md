---
title: 单词搜索
description: leetcode刷题第三十七天
pubDate: 2026-04-23T15:11
image: /images/leetcode-063/91ecf65dff5f81bd.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 79. 单词搜索

## 问题描述

给定一个 m x n 二维字符网格 `board` 和一个字符串单词 `word`。如果 `word` 存在于网格中，返回 `true`；否则，返回 `false`。

**规则：**
- 单词必须按照字母顺序，通过相邻的单元格内的字母构成
- "相邻"单元格：水平或垂直相邻的单元格
- 同一个单元格内的字母**不允许被重复使用**

**示例：**
```
board = [
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]
word = "ABCCED"  → true
word = "SEE"     → true
word = "ABCB"    → false
```

---

## 问题分析

### 核心思想

这道题是**在二维矩阵中搜索路径**，本质上是一个**迷宫问题**的变体。

关键点：
1. 从任意单元格出发，尝试匹配 word 的第一个字符
2. 每匹配一个字符后，向四个方向继续搜索下一个字符
3. 需要标记已访问的单元格，防止重复使用
4. 当匹配到 word 的最后一个字符时，找到答案

### 搜索框架

```
对于每个单元格 (i, j):
    如果 board[i][j] == word[0]:
        从 (i, j) 开始 DFS 搜索

DFS(i, j, index):
    如果 index == word.length: 找到完整单词，返回 true
    如果越界或字符不匹配或已访问: 返回 false

    标记 (i, j) 为已访问
    递归搜索四个方向 (index+1)
    撤销标记（回溯）
```

---

## 解题思路：回溯 + DFS

### 解法一：二维矩阵上的回溯

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;

        // 遍历每个单元格作为起点
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0, new boolean[m][n])) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int index, boolean[][] visited) {
        // 终止条件：匹配到最后一个字符
        if (index == word.length()) {
            return true;
        }

        // 边界检查
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
            return false;
        }

        // 剪枝条件：
        // 1. 已访问过
        // 2. 当前字符不匹配
        if (visited[i][j] || board[i][j] != word.charAt(index)) {
            return false;
        }

        // 标记为已访问
        visited[i][j] = true;

        // 搜索四个方向
        boolean found = dfs(board, word, i + 1, j, index + 1, visited)   // 下
                     || dfs(board, word, i - 1, j, index + 1, visited)   // 上
                     || dfs(board, word, i, j + 1, index + 1, visited)   // 右
                     || dfs(board, word, i, j - 1, index + 1, visited);  // 左

        // 撤销标记（回溯）
        visited[i][j] = false;

        return found;
    }
}
```

### 解法二：优化空间（原地标记）

不使用额外的 visited 数组，而是用 board[i][j] = '#' 来标记，搜索完后恢复。

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int index) {
        // 终止条件
        if (index == word.length()) {
            return true;
        }

        // 边界和剪枝
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
            return false;
        }

        if (board[i][j] != word.charAt(index)) {
            return false;
        }

        // 标记已访问（用特殊字符）
        char temp = board[i][j];
        board[i][j] = '#';

        // 四个方向搜索
        boolean found = dfs(board, word, i + 1, j, index + 1)
                     || dfs(board, word, i - 1, j, index + 1)
                     || dfs(board, word, i, j + 1, index + 1)
                     || dfs(board, word, i, j - 1, index + 1);

        // 恢复原字符（回溯）
        board[i][j] = temp;

        return found;
    }
}
```

---

## 复杂度分析

| 复杂度 | 分析 |
|--------|------|
| **时间复杂度** | O(m × n × 4^L)，其中 m×n 是网格大小，L 是单词长度。最坏情况每个起点都尝试4个方向 |
| **空间复杂度** | O(m × n) 用于 visited 数组，或 O(L) 用于递归栈 |

---

## 回溯树状图（以示例为例）

```
board = [
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]
word = "ABCCED"

从 A(0,0) 开始搜索：
                    A[0,0]
                   / | | \
                  B  S F  C
                /  \
           C(0,2)  C(1,2)
             |
           C(0,2)
             |
           E(0,3)
             |
           D(2,3)
             |
           E(2,2)
             |
           找到! ✅
```

### 搜索路径详解

```
步骤1: A(0,0) 匹配 'A'
步骤2: → B(0,1) 匹配 'B'
步骤3: → C(0,2) 匹配 'C'
步骤4: → C(1,2) 匹配 'C' (下)
步骤5: → E(0,3) 匹配 'E' (回退后右)
步骤6: → D(2,3) 匹配 'D' (回退后下)
步骤7: → E(2,2) 匹配 'E' (左)
步骤8: 匹配完成！返回 true
```

---

## 关键点总结

### 1. 回溯的三个步骤

```java
// 1. 做选择
visited[i][j] = true;
// board[i][j] = '#';

// 2. 递归
dfs(...);

// 3. 撤销选择
visited[i][j] = false;
// board[i][j] = temp;
```

### 2. 剪枝条件（按检查顺序）

```
① index == word.length() → 找到完整单词
② 越界 → i < 0 || i >= m || j < 0 || j >= n
③ 已访问 → visited[i][j] == true
④ 字符不匹配 → board[i][j] != word.charAt(index)
```

### 3. 与括号生成的对比

| 特征 | 括号生成 | 单词搜索 |
|------|----------|----------|
| 结构 | 一维字符串构建 | 二维矩阵搜索 |
| 选择列表 | 固定(左/右) | 动态(四个方向) |
| 终止条件 | 长度=2n | index=word.length |
| 剪枝条件 | right < left | 边界/已访问/不匹配 |

### 4. 易错点

1. **忘记撤销标记** → 导致其他路径无法访问该单元格
2. **边界检查顺序错误** → 应该先检查边界，再检查访问状态
3. **board[i][j] != word.charAt(index)** → 要检查字符匹配

---

## 变形题目

### 变形1：返回所有单词（类似单词搜索II）

```java
// 思路：构建Trie前缀树，批量搜索多个单词
// 适合面试加分
```

### 变形2：网格中的路径（类似offer 12）

```java
// 剑指offer 12：给定网格，找是否存在包含某条路径
// 思路完全一致
```

---

## 总结

单词搜索是**二维回溯的经典模板**：

```
for 每个起点:
    dfs(起点)
        if 找到: return true
        标记
        搜索四方向
        撤销标记
return false
```

核心是**回溯 + 剪枝**，模板固定，多练几道就能掌握！
