---
title: 螺旋矩阵
description: leetcode刷题第二十天
pubDate: 2026-03-28T11:35
image: /images/leetcode-026/76ffcf06815ef033.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 螺旋矩阵

## 题目描述

给你一个 `m` 行 `n` 列的矩阵 `matrix` ，请按照**顺时针螺旋顺序**，返回矩阵中的所有元素。

---

## 核心思路

这题的关键不是“模拟绕圈”，而是维护当前这一层的 4 条边界：

- `top`：上边界
- `bottom`：下边界
- `left`：左边界
- `right`：右边界

每一轮按照顺时针方向遍历 4 条边：

1. 从左到右遍历上边界
2. 从上到下遍历右边界
3. 从右到左遍历下边界
4. 从下到上遍历左边界

每走完一圈，就把边界向内收缩：

- `top++`
- `bottom--`
- `left++`
- `right--`

直到边界交错，也就是：

```java
while (top <= bottom && left <= right)
```

---

## 为什么 `if (top <= bottom)` 必须加

这是这题最容易写错的地方之一。

在完成“从左到右遍历上边界”之后，会执行：

```java
top++;
```

这可能导致当前已经**没有剩余行**了。如果这时还继续执行“从右到左遍历下边界”，就会把同一行重复加入结果。

### 例子：只有一行

```text
1 2 3 4
```

初始时：

- `top = 0`
- `bottom = 0`
- `left = 0`
- `right = 3`

先执行上边界遍历，加入：

```text
1 2 3 4
```

然后 `top++`，变成：

- `top = 1`
- `bottom = 0`

此时已经 `top > bottom`，说明没有剩余行了。

如果不写：

```java
if (top <= bottom)
```

还继续遍历下边界，就会把第 0 行反向再加入一次：

```text
4 3 2 1
```

造成重复。

所以这句判断的含义是：

> 只有当前仍然存在下边界这一行时，才去从右到左遍历。

---

## 为什么 `if (left <= right)` 也要加

道理完全一样。

在完成“从上到下遍历右边界”之后，会执行：

```java
right--;
```

这可能导致当前已经**没有剩余列**了。如果还继续执行“从下到上遍历左边界”，就会重复加入元素。

### 例子：只有一列

```text
1
2
3
```

如果没有：

```java
if (left <= right)
```

那么左边界可能会被重复遍历。

---

## 执行过程示例

对于矩阵：

```text
1 2 3
4 5 6
7 8 9
```

第一圈：

1. 上边界：`1 2 3`
2. 右边界：`6 9`
3. 下边界：`8 7`
4. 左边界：`4`

结果为：

```text
1 2 3 6 9 8 7 4
```

然后中间还剩下：

```text
5
```

最终结果：

```text
[1, 2, 3, 6, 9, 8, 7, 4, 5]
```

---

## Java 源码

```java
import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix == null || matrix.length == 0) {
            return res;
        }

        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            // 1. 左 -> 右
            for (int j = left; j <= right; j++) {
                res.add(matrix[top][j]);
            }
            top++;

            // 2. 上 -> 下
            for (int i = top; i <= bottom; i++) {
                res.add(matrix[i][right]);
            }
            right--;

            // 3. 右 -> 左
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    res.add(matrix[bottom][j]);
                }
                bottom--;
            }

            // 4. 下 -> 上
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    res.add(matrix[i][left]);
                }
                left++;
            }
        }

        return res;
    }
}
```

---

## 复杂度分析

- 时间复杂度：`O(m * n)`，每个元素只访问一次
- 空间复杂度：`O(1)`，如果不算返回结果列表

---

## 易错点总结

1. 忘记判空

```java
if (matrix == null || matrix.length == 0)
```

2. 忘记在遍历下边界前判断：

```java
if (top <= bottom)
```

3. 忘记在遍历左边界前判断：

```java
if (left <= right)
```

4. 边界更新位置写错，导致漏元素或重复元素

---

## 一句话总结

这题本质上就是：**用四个边界，一层一层地按顺时针遍历矩阵。**
