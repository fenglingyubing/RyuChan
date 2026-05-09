---
title: 杨辉三角
description: leetcode刷题第四十九天
pubDate: 2026-05-09T08:26
image: /images/leetcode-086/efe225e13214a1f3.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 118. 杨辉三角

## 题目描述

给定一个非负整数 `numRows`，生成「杨辉三角」的前 `numRows` 行。

在「杨辉三角」中，每个数是它左上方和右上方的数的和。

例如 `numRows = 5` 时，结果是：

```text
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
```

## 核心思路

杨辉三角有两个重要特点：

1. 每一行的第一个数和最后一个数都是 `1`；
2. 中间位置的数等于上一行相邻两个数之和。

假设当前正在生成第 `i` 行，第 `j` 个位置的值是：

```text
当前行[j] = 上一行[j - 1] + 上一行[j]
```

注意：这里的 `i` 和 `j` 都使用数组下标，从 `0` 开始。

例如第 4 行，下标是 `3`：

```text
上一行: [1, 2, 1]
当前行: [1, 3, 3, 1]
```

当前行中间的值：

```text
3 = 1 + 2
3 = 2 + 1
```

## 行和下标的关系

如果使用 `0` 作为起始下标：

```text
第 0 行: [1]
第 1 行: [1, 1]
第 2 行: [1, 2, 1]
第 3 行: [1, 3, 3, 1]
```

可以发现：

```text
第 i 行有 i + 1 个元素
```

所以生成第 `i` 行时，需要循环添加 `i + 1` 个数。

## 解题步骤

1. 创建结果集合 `res`，用于保存所有行；
2. 从第 `0` 行开始，依次生成每一行；
3. 每一行新建一个 `row`；
4. 如果当前位置是行首或行尾，直接放入 `1`；
5. 否则取上一行的两个相邻元素相加；
6. 当前行生成完后，加入结果集合。

## Java 代码

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> res = new ArrayList<>();

        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();

            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    row.add(1);
                } else {
                    List<Integer> prevRow = res.get(i - 1);
                    row.add(prevRow.get(j - 1) + prevRow.get(j));
                }
            }

            res.add(row);
        }

        return res;
    }
}
```

## 代码解释

### 外层循环

```java
for (int i = 0; i < numRows; i++)
```

外层循环控制生成多少行。

因为数组下标从 `0` 开始，所以：

```text
i = 0 表示第 1 行
i = 1 表示第 2 行
i = 2 表示第 3 行
```

总共生成 `numRows` 行，因此循环条件是 `i < numRows`。

### 内层循环

```java
for (int j = 0; j <= i; j++)
```

内层循环负责生成当前行的每一个元素。

第 `i` 行有 `i + 1` 个元素，所以 `j` 从 `0` 遍历到 `i`，包含 `i`。

例如：

```text
i = 0，j 只有 0，共 1 个元素
i = 1，j 是 0、1，共 2 个元素
i = 2，j 是 0、1、2，共 3 个元素
```

### 边界位置

```java
if (j == 0 || j == i) {
    row.add(1);
}
```

每一行的第一个元素和最后一个元素都是 `1`。

对应到下标就是：

```text
j == 0 表示行首
j == i 表示行尾
```

### 中间位置

```java
List<Integer> prevRow = res.get(i - 1);
row.add(prevRow.get(j - 1) + prevRow.get(j));
```

中间位置需要从上一行取两个数相加：

```text
当前行[j] = 上一行[j - 1] + 上一行[j]
```

例如当前生成第 `3` 行：

```text
上一行: [1, 2, 1]
当前行: [1, ?, ?, 1]
```

当 `j = 1` 时：

```text
当前行[1] = 上一行[0] + 上一行[1] = 1 + 2 = 3
```

当 `j = 2` 时：

```text
当前行[2] = 上一行[1] + 上一行[2] = 2 + 1 = 3
```

所以当前行是：

```text
[1, 3, 3, 1]
```

## 边界情况

当 `numRows = 0` 时，外层循环不会执行，直接返回空集合：

```text
[]
```

当 `numRows = 1` 时，只生成一行：

```text
[[1]]
```

## 复杂度分析

杨辉三角前 `numRows` 行一共有：

```text
1 + 2 + 3 + ... + numRows
```

个元素，也就是：

```text
numRows * (numRows + 1) / 2
```

因此：

```text
时间复杂度：O(numRows^2)
空间复杂度：O(numRows^2)
```

空间复杂度为 `O(numRows^2)` 是因为结果本身需要保存所有元素。

## 总结

这道题的关键是理解杨辉三角的生成规则：

```text
每行两端是 1，中间元素等于上一行相邻两个元素之和。
```

使用双层循环即可完成：

```text
外层循环生成每一行
内层循环生成当前行的每个元素
```

实际提交时，直接使用 `List<List<Integer>>` 保存结果即可，代码清晰，也符合题目返回值要求。
