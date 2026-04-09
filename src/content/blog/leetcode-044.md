---
title: 将有序数组转换为二叉搜索树
description: leetcode刷题第二十八天
pubDate: 2026-04-09T13:29
image: /images/leetcode-044/d841fae07d78864d.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 将有序数组转换为二叉搜索树（Java）

## 题目理解

题目给你一个 **升序数组** `nums`，要求把它转换成一棵 **平衡二叉搜索树（BST）**。

这里有两个关键点：

- **二叉搜索树**：左子树所有节点都小于根节点，右子树所有节点都大于根节点
- **平衡**：左右子树的高度差尽量不超过 1

比如：

```java
nums = [-10, -3, 0, 5, 9]
```

可以构造出：

```text
      0
    /   \
  -10    5
    \     \
    -3     9
```

或者：

```text
      0
    /   \
  -3     9
  /     /
-10    5
```

只要满足：

- 是 BST
- 基本平衡

都算正确答案。

---

## 你这段代码的问题在哪里

你现在的思路大概是：

- 先找到中间位置
- 用中间值创建根节点
- 再想办法用循环处理左右部分

你写的代码是：

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        int midium = nums.lenth / 2;
        TreeNode root = new TreeNode(nums[midium]);
        for(int i = 0; i < midium; i++){
            
        }
    }
}
```

这里有两个问题。

### 1. 单词拼写错误

```java
nums.lenth
```

应该是：

```java
nums.length
```

### 2. 这题不适合用普通 `for` 循环直接建树

原因是：

- 根节点确定后
- 左半部分还要继续选中点作为左子树根节点
- 右半部分也要继续选中点作为右子树根节点
- 左半部分的左边、右边还要继续递归分下去

也就是说，这不是简单地“一次遍历数组”就能完成的。

它的结构是：

> 选中点做根节点，然后对左半段和右半段做同样的事情。

这个过程和原问题一模一样，所以最适合用 **递归**。

---

## 正确思路：分治 + 递归

这题最核心的一句话就是：

> 每次选择当前区间的中间元素作为根节点。

为什么这样做？

因为数组本来就是升序的：

- 中间元素左边都比它小，天然适合做左子树
- 中间元素右边都比它大，天然适合做右子树

这样就自动满足 BST 的性质。

同时，中间切开以后左右两边数量接近，所以树也更容易保持平衡。

---

## 递归函数怎么设计

我们定义一个函数：

```java
build(nums, left, right)
```

它的意思是：

> 用 `nums[left...right]` 这一段有序区间，构造出一棵平衡 BST，并返回根节点。

### 递归步骤

1. 如果区间为空，返回 `null`
2. 取中间位置 `mid`
3. 创建根节点 `nums[mid]`
4. 用左半区间构造左子树
5. 用右半区间构造右子树
6. 返回根节点

---

## Java 代码

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int left, int right) {
        if (left > right) {
            return null;
        }

        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);

        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);

        return root;
    }
}
```

---

## 一步一步理解

### 1. 整体入口

```java
return build(nums, 0, nums.length - 1);
```

表示先拿整个数组来建树。

### 2. 什么时候递归结束

```java
if (left > right) {
    return null;
}
```

当区间没有元素时，说明这个位置没有节点，返回 `null`。

### 3. 为什么取中点

```java
int mid = left + (right - left) / 2;
```

取中点后：

- `nums[mid]` 做根节点
- `left ~ mid - 1` 构成左子树
- `mid + 1 ~ right` 构成右子树

这样既满足 BST，又尽量平衡。

### 4. 递归构造左右子树

```java
root.left = build(nums, left, mid - 1);
root.right = build(nums, mid + 1, right);
```

这里是整道题最关键的地方。

因为左边这段数组本身仍然是有序的，所以它还能继续用同样的方法构造左子树。

右边也是一样。

这就是“分治”。

---

## 用例子走一遍

例如：

```java
nums = [-10, -3, 0, 5, 9]
```

### 第一次

- `left = 0, right = 4`
- `mid = 2`
- 根节点是 `0`

```text
    0
```

### 构造左子树

区间变成：

```java
[-10, -3]
```

- `mid = 0`
- 节点是 `-10`

左边没元素，右边是 `-3`

### 构造右子树

区间变成：

```java
[5, 9]
```

- `mid = 3`
- 节点是 `5`

右边还有 `9`

最后可以得到一棵平衡 BST。

---

## 为什么这题天然适合递归

因为原问题是：

> 用一个有序区间构造平衡 BST

拆开之后的子问题还是：

> 用更小的有序区间构造平衡 BST

这和原问题完全同构。

只要问题可以不断拆成“同样形式的更小问题”，一般就很适合递归。

---

## 时间复杂度和空间复杂度

### 时间复杂度

```text
O(n)
```

每个数组元素都会创建一个树节点，并且只处理一次。

### 空间复杂度

```text
O(log n)
```

平均情况下递归深度是树高，而平衡二叉树的高度大约是 `log n`。

如果只看递归栈，这是 `O(log n)`。

---

## 容易出错的点

### 1. `length` 拼错

要写：

```java
nums.length
```

不是 `nums.lenth`。

### 2. 递归边界写错

要写：

```java
if (left > right) {
    return null;
}
```

不是 `left >= right`。

因为当 `left == right` 时，区间里还有一个元素，这个元素应该创建节点。

### 3. 左右区间写错

正确写法是：

```java
root.left = build(nums, left, mid - 1);
root.right = build(nums, mid + 1, right);
```

如果把 `mid` 重复包含进去，就会死递归。

### 4. 想用一个 `for` 循环直接解决

这题不是线性插入问题。

重点不是“遍历数组”，而是“反复找中点并分区间”。

---

## 你这段代码应该怎么改思路

你现在这段：

```java
int midium = nums.length / 2;
TreeNode root = new TreeNode(nums[midium]);
```

前半步其实已经接近正确方向了，因为你已经意识到：

- 要找中间节点
- 中间节点适合做根

接下来不应该写 `for` 循环，而应该继续递归构造：

```java
root.left = build(nums, left, mid - 1);
root.right = build(nums, mid + 1, right);
```

也就是说，你差的不是“继续遍历”，而是“把左右两半当成新的同类问题继续处理”。

---

## 一句话总结

这题的核心不是遍历，而是分治。

最重要的思路就是：

> 每次选择有序区间的中间元素作为根节点，再递归构造左右子树。

这样既能保证二叉搜索树性质，也能保证树尽量平衡。
