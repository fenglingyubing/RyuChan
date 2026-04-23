---
title: 括号生成
description: leetcode刷题第三十七天
pubDate: 2026-04-23T14:21
image: /images/leetcode-062/d7a655faac9bd598.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 22. 括号生成

## 问题描述

数字 n 代表生成括号的对数，设计一个函数用于生成所有可能的并且**有效的**括号组合。

**示例：**
- 输入：n = 3
- 输出：`["((()))","(()())","(())()","()(())","()()()"]`

## 问题分析

有效的括号必须满足两个条件：
1. 左括号 `(` 和右括号 `)` 数量相等（各 n 个）
2. 任意前缀中，左括号数量 **≥** 右括号数量（否则会先出现右闭括号，无效）

## 解题思路：回溯法

从空字符串开始，每一步可以选择添加左括号或右括号：

- **可以添加左括号**：当左括号数量 < n
- **可以添加右括号**：当右括号数量 < 左括号数量

当左右括号都用完时，得到一个有效组合。

### 回溯的剪枝条件

第二个条件是关键的剪枝：只有当已添加的左括号数量大于右括号时，才能添加右括号。这保证了任何时刻右括号不会出现得"太早"。

## Java 代码实现

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), 0, 0, n);
        return result;
    }

    private void backtrack(List<String> result, StringBuilder current,
                          int left, int right, int n) {
        // 终止条件：生成了 2n 个字符
        if (current.length() == n * 2) {
            result.add(current.toString());
            return;
        }

        // 添加左括号：只要左括号还没用完
        if (left < n) {
            current.append('(');
            backtrack(result, current, left + 1, right, n);
            current.deleteCharAt(current.length() - 1);  // 回溯
        }

        // 添加右括号：右括号数量 < 左括号数量时才可添加
        if (right < left) {
            current.append(')');
            backtrack(result, current, left, right + 1, n);
            current.deleteCharAt(current.length() - 1);  // 回溯
        }
    }
}
```

## 复杂度分析

| 复杂度 | 说明 |
|--------|------|
| 时间复杂度 | O( Catalan_n ) = O(4^n / n^(3/2))，卡特兰数级别的组合数量 |
| 空间复杂度 | O(n)，递归栈深度（不计结果存储） |

**卡特兰数**：对于 n 对括号，总共有 C(2n, n) / (n + 1) 种有效组合。

## 生成过程解析（n=3）

```
                    ""
                   /
                  "("          left=1, right=0
                 /
            "((("                left=2, right=0
           /     \
    "((()"        "(())"       left=3, right=1 或 left=2, right=2
       |              |
   "((())"          "(()))"     left=3, right=2
       |              |
   "((()))"    ←     "(()())"   两种基本形态

通过不同的分支组合，最终生成 5 种有效结果：
1. ((()))
2. (()())
3. (())()
4. ()(())
5. ()()()
```

## 关键点总结

1. **回溯算法**：经典的枚举+剪枝策略
2. **剪枝条件**：`right < left` 是保证有效性的核心
3. **回溯操作**：通过 `deleteCharAt` 恢复现场，是回溯算法的标配操作
