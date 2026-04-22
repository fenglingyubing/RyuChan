---
title: 电话号码的字母组合
description: leetcode刷题第三十六天
pubDate: 2026-04-22T09:11
image: /images/leetcode-059/68dc19c84e36a35b.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 17. 电话号码的字母组合

## 题目要求

给定一个仅包含数字 `2-9` 的字符串 `digits`，返回它能表示的所有字母组合。

电话按键映射如下：

- `2` -> `abc`
- `3` -> `def`
- `4` -> `ghi`
- `5` -> `jkl`
- `6` -> `mno`
- `7` -> `pqrs`
- `8` -> `tuv`
- `9` -> `wxyz`

例如：

```java
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

注意：

- `1` 不对应任何字母
- `0` 也不参与映射
- 返回顺序可以任意

---

## 这道题的本质是什么

这题本质上是一个“按位置选字符”的回溯问题。

比如输入是 `"23"`：

- 第 1 位数字 `2` 可以选 `a`、`b`、`c`
- 第 2 位数字 `3` 可以选 `d`、`e`、`f`

那么我们要做的事情就是：

- 先给第 1 位选一个字母
- 再给第 2 位选一个字母
- 当每一位都选完时，就得到一个完整答案

这其实和“全排列”不完全一样，因为这里不是在一堆元素里挑没用过的，而是：

- 每一层递归对应一个数字位置
- 该层只需要从当前数字对应的字母里选一个

所以它是非常典型的回溯 / 深度优先搜索（DFS）问题。

---

## 为什么适合用回溯

因为每个数字都有多个选择：

- `2` 有 3 种选择
- `7` 有 4 种选择
- `9` 有 4 种选择

如果字符串长度越来越长，组合数量会快速增加。

我们需要一种通用方法来完成：

- 处理当前第几个数字
- 枚举这个数字对应的所有字母
- 进入下一位数字继续选
- 直到把整条字符串处理完

这就是回溯最擅长的场景。

---

## 标准解法：回溯

### 思路

我们维护两个东西：

- `result`：保存所有结果
- `path`：保存当前已经拼出的字母组合

递归函数可以定义为：

- 当前正在处理 `digits` 的第 `index` 位

递归过程：

1. 如果 `index == digits.length()`，说明所有数字都处理完了
2. 此时 `path` 就是一个完整组合，把它加入结果集
3. 否则，取出当前数字对应的字母串
4. 依次尝试每个字母
5. 把字母加入 `path`
6. 递归处理下一位
7. 返回后撤销这次选择

---

## Java 参考实现

```java
class Solution {
    private List<String> result = new ArrayList<>();
    private StringBuilder path = new StringBuilder();
    private final String[] map = {
        "",     // 0
        "",     // 1
        "abc",  // 2
        "def",  // 3
        "ghi",  // 4
        "jkl",  // 5
        "mno",  // 6
        "pqrs", // 7
        "tuv",  // 8
        "wxyz"  // 9
    };

    public List<String> letterCombinations(String digits) {
        if (digits == null || digits.length() == 0) {
            return result;
        }

        backtrack(digits, 0);
        return result;
    }

    private void backtrack(String digits, int index) {
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }

        String letters = map[digits.charAt(index) - '0'];
        for (int i = 0; i < letters.length(); i++) {
            path.append(letters.charAt(i));
            backtrack(digits, index + 1);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

---

## 代码逐段解析

### 1. 映射表

```java
private final String[] map = {
    "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
};
```

这里的下标就是数字本身。

比如：

- `map[2] = "abc"`
- `map[3] = "def"`

这样我们拿到某个数字字符后，就能很快找到它对应的字母集合。

例如：

```java
digits.charAt(index) - '0'
```

就可以把字符 `'2'` 转成整数 `2`。

---

### 2. 为什么空字符串要单独处理

```java
if (digits == null || digits.length() == 0) {
    return result;
}
```

如果输入为空，就没有任何可以组合的内容，应该直接返回空列表。

这里不能返回 `[""]`，因为题目要的是“字母组合”，空输入没有组合。

---

### 3. 递归函数含义

```java
private void backtrack(String digits, int index)
```

参数 `index` 表示：

- 当前要处理的是第几个数字

比如：

- `digits = "23"`
- 当 `index = 0`，处理数字 `2`
- 当 `index = 1`，处理数字 `3`
- 当 `index = 2`，说明全部处理完了

---

### 4. 递归终止条件

```java
if (index == digits.length()) {
    result.add(path.toString());
    return;
}
```

这表示：

- 已经处理到字符串末尾
- 当前 `path` 中保存的就是一个完整答案
- 把它加入结果集

这里用的是：

```java
path.toString()
```

因为 `path` 是 `StringBuilder`，加入结果时要转成真正的字符串。

---

### 5. 取出当前数字对应的字母

```java
String letters = map[digits.charAt(index) - '0'];
```

假设：

- `digits.charAt(index)` 是 `'7'`

那么：

- `digits.charAt(index) - '0' = 7`
- `letters = map[7] = "pqrs"`

也就是说，当前这一层可以尝试的字母就是 `p`、`q`、`r`、`s`。

---

### 6. 枚举当前层的所有选择

```java
for (int i = 0; i < letters.length(); i++) {
    path.append(letters.charAt(i));
    backtrack(digits, index + 1);
    path.deleteCharAt(path.length() - 1);
}
```

这是回溯的标准写法：

- 先选择一个字母
- 递归进入下一层
- 回来后撤销选择

其中：

```java
path.append(letters.charAt(i));
```

表示把当前选中的字母加入组合。

```java
backtrack(digits, index + 1);
```

表示处理下一个数字。

```java
path.deleteCharAt(path.length() - 1);
```

表示恢复现场，尝试下一个字母。

---

## 用例手动模拟

输入：

```java
digits = "23"
```

映射关系：

- `2 -> abc`
- `3 -> def`

搜索过程大致如下：

1. 先选 `a`
2. 再从 `d e f` 中选：
   - `ad`
   - `ae`
   - `af`
3. 回到第一层，改选 `b`
4. 再得到：
   - `bd`
   - `be`
   - `bf`
5. 回到第一层，改选 `c`
6. 再得到：
   - `cd`
   - `ce`
   - `cf`

最终结果：

```java
["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

---

## 时间复杂度分析

假设字符串长度为 `n`。

每个数字最多对应 4 个字母，所以：

- 时间复杂度：`O(4^n * n)`
- 空间复杂度：`O(n)`（不算结果集）

为什么时间复杂度后面还有一个 `n`？

因为每生成一个结果字符串，长度大约是 `n`，把当前路径转成字符串需要一定成本。

如果更粗略地写，也可以理解为组合总数级别的复杂度。

---

## 这题最容易犯的错误

### 1. 忘记处理空字符串

如果 `digits = ""`，应该直接返回空列表。

---

### 2. 终止条件写错

终止条件不是“当前没有字母可选”，而是：

- 已经处理完所有数字，即 `index == digits.length()`

---

### 3. 回溯后忘记撤销选择

如果少了这句：

```java
path.deleteCharAt(path.length() - 1);
```

那么后续分支会受到前面路径的影响，结果就会出错。

---

## 一句话总结

这道题的核心就是：

- 把每个数字看成一层选择
- 在该层枚举它对应的所有字母
- 用回溯把每一层的选择拼接起来
- 当所有层都走完时，得到一个完整组合

如果你把它理解成“多层每层选一个字符”，这题就会非常清晰。
