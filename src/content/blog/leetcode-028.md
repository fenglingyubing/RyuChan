---
title: 搜索二维矩阵
description: leetcode刷题第二十一天
pubDate: 2026-03-29T21:33
image: /images/leetcode-028/3bfcbd848e04c82a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 搜索二维矩阵

## 题目要求

编写一个高效的算法来搜索 `m x n` 矩阵 `matrix` 中的目标值 `target`。

矩阵满足：

- 每行的元素从左到右升序排列。
- 每列的元素从上到下升序排列。

## 原始代码

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rowLen = matrix[0].length;
        int colLen = matrix.length;
        int rowIndex = -1;
        for(int i = 0; i < rowLen; i++){
            if(target == matrix[0][i]){
                return true;
            }else if(i < rowLen - 1 &&
                     target > matrix[0][i] &&
                     target < matrix[0][i + 1]){
                rowIndex = i;
                break;

            }else if(i == rowLen - 1 && target > matrix[0][i]){
                rowIndex = i;
                break;
            }

        }

        if(rowIndex == -1){
            return false;
        }

        for(int i = 0; i < colLen; i++){
            if(matrix[i][rowIndex] == target){
                return true;
            }
        }

        return false;
    }
}
```

## 存在的问题

### 1. 核心思路错误

代码先遍历第一行，再根据第一行中相邻元素的大小关系，把目标值可能所在的位置缩小为某一列，然后只搜索这一列。

这个推断不成立。

原因是：

- 第一行只能反映各列最上方元素的大小规律。
- 但左侧列在更下面的行里，仍然可能出现比第一行更大的值。
- 因此，不能仅凭第一行就把目标值锁定到某一列。

### 2. 会漏掉合法答案

下面这个矩阵满足题目条件：

```java
[
  [1, 4, 7],
  [2, 5, 8],
  [6, 9, 10]
]
```

如果查找 `target = 6`：

- 第一行是 `[1, 4, 7]`
- 代码会判断 `6` 落在 `4` 和 `7` 之间
- 因此令 `rowIndex = 1`
- 接着只检查第 `1` 列：`[4, 5, 9]`
- 最终返回 `false`

但实际答案应该是 `true`，因为 `6` 在第 `0` 列第 `2` 行。

### 3. 变量命名混乱

```java
int rowLen = matrix[0].length;
int colLen = matrix.length;
```

这里：

- `matrix[0].length` 实际表示列数
- `matrix.length` 实际表示行数

也就是说：

- `rowLen` 实际上是列数
- `colLen` 实际上是行数

虽然这不一定直接导致结果错误，但会让代码更难理解，也容易引入下标错误。

### 4. `rowIndex` 命名不准确

变量 `rowIndex` 实际保存的是列下标，不是行下标。

在这段代码里：

```java
if(matrix[i][rowIndex] == target)
```

其中：

- `i` 是行下标
- `rowIndex` 是列下标

因此这个变量名具有误导性。

### 5. 缺少空矩阵判断

代码一开始直接访问：

```java
matrix[0].length
```

如果：

- `matrix == null`
- `matrix.length == 0`
- `matrix[0].length == 0`

程序会直接抛出异常。

## 正确做法

这道题的经典高效解法是从右上角开始搜索，时间复杂度为 `O(m + n)`。

思路：

- 如果当前位置的值等于 `target`，返回 `true`
- 如果当前位置的值大于 `target`，说明这一列下面的值只会更大，因此应该向左移动
- 如果当前位置的值小于 `target`，说明这一行左边的值只会更小，因此应该向下移动

## 参考实现

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return false;
        }

        int rows = matrix.length;
        int cols = matrix[0].length;
        int i = 0;
        int j = cols - 1;

        while (i < rows && j >= 0) {
            if (matrix[i][j] == target) {
                return true;
            } else if (matrix[i][j] > target) {
                j--;
            } else {
                i++;
            }
        }

        return false;
    }
}
```

## 总结

这段代码的主要问题不是语法，而是搜索策略本身不符合题目的矩阵特性。

可以归纳为以下几点：

- 错误地根据第一行把搜索范围缩小为某一列
- 因此会漏掉实际存在的目标值
- 变量命名和实际含义不一致
- 没有处理空矩阵输入

更合适的方法是从右上角或左下角开始，利用矩阵行列同时有序的性质进行剪枝。
