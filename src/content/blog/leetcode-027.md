---
title: 旋转图像
description: leetcode刷题第二十一天
pubDate: 2026-03-29T20:47
image: /images/leetcode-027/fe4f6b595a520ac6.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 旋转图像

## 题目

给定一个 `n x n` 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 `90` 度。

要求：

- 必须原地旋转
- 不能使用另一个同样大小的矩阵

## 核心思路

这道题的关键不是“怎么画出旋转后的矩阵”，而是“如何在原矩阵上完成旋转”。

顺时针旋转 `90` 度可以拆成两步：

1. 先沿主对角线转置
2. 再将每一行左右反转

## 为什么这样做

原矩阵中位置 `(i, j)` 的元素，旋转后会移动到：

```text
(j, n - 1 - i)
```

直接按这个规则做虽然能得到答案，但原地处理时会覆盖掉还没用到的数据，所以更适合使用“转置 + 每行反转”。

### 第一步：转置

转置就是交换：

```text
matrix[i][j] <-> matrix[j][i]
```

例如：

```text
1 2 3
4 5 6
7 8 9
```

转置后：

```text
1 4 7
2 5 8
3 6 9
```

### 第二步：每一行反转

将每一行左右交换：

```text
1 4 7    ->    7 4 1
2 5 8    ->    8 5 2
3 6 9    ->    9 6 3
```

这正好就是顺时针旋转 `90` 度后的结果。

## 为什么 `j = i`

转置时交换的是一对对称位置：

```java
matrix[i][j] <-> matrix[j][i]
```

如果 `j` 从 `0` 开始，那么一对元素会被交换两次。

例如：

```text
1 2
3 4
```

当 `i = 0, j = 1` 时，会交换：

```java
matrix[0][1] 和 matrix[1][0]
```

得到：

```text
1 3
2 4
```

如果后面 `i = 1, j = 0` 再交换一次，就又换回去了。

所以只需要遍历主对角线及其右上部分：

```java
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // swap(matrix[i][j], matrix[j][i])
    }
}
```

这样每一对元素只会交换一次。

## 完整源码

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // 1. 沿主对角线转置
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // 2. 反转每一行
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;
                left++;
                right--;
            }
        }
    }
}
```

## 示例演示

输入：

```text
1 2 3
4 5 6
7 8 9
```

转置后：

```text
1 4 7
2 5 8
3 6 9
```

每行反转后：

```text
7 4 1
8 5 2
9 6 3
```

## 复杂度

- 时间复杂度：`O(n^2)`
- 空间复杂度：`O(1)`

## 结论

这道题最常用、最好记的方法就是：

- 顺时针 `90` 度：先转置，再反转每一行

面试里只要记住这一句，基本就能把题写出来。
