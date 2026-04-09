---
title: 二叉树的直径
description: leetcode刷题第二十八天
pubDate: 2026-04-09T12:17
image: /images/leetcode-042/0e3269e295f6b387.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的直径（Java）

## 题目理解

二叉树的直径，指的是：

- 任意两个节点之间的最长路径
- 这里统计的不是节点个数，而是**边数**
- 这条最长路径不一定经过根节点

比如：

```text
    1
   / \
  2   3
 / \
4   5
```

最长路径可以是 `4 -> 2 -> 5`，长度是 `2`

也可以是 `4 -> 2 -> 1 -> 3`，长度是 `3`

所以这棵树的直径是 `3`。

---

## 这题关键要想明白什么

一个节点如果作为“路径的拐点”，那么经过它的最长路径长度就是：

```java
左子树高度 + 右子树高度
```

为什么？

- 从当前节点往左，最多能走 `左子树高度` 条边
- 从当前节点往右，最多能走 `右子树高度` 条边
- 把左右连起来，就是经过当前节点的一条最长路径

所以这题的核心变成：

- 一边求每个节点的高度
- 一边更新全局最大直径

---

## 解题思路

我们定义一个函数 `depth(root)`，表示：

> 以 `root` 为根的这棵树的高度（按边数往下走的层数）

对于每个节点：

1. 先递归求左子树高度
2. 再递归求右子树高度
3. 当前节点可形成的直径 = `left + right`
4. 用一个全局变量记录最大值
5. 返回当前节点的高度 = `Math.max(left, right) + 1`

---

## 为什么返回的是高度，不是直径

因为父节点要想计算“经过自己”的最长路径，必须知道：

- 左边能往下走多远
- 右边能往下走多远

所以递归函数返回给父节点的，应该是“高度”，而不是“直径”。

直径则在递归过程中顺手更新。

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
    private int ans = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return ans;
    }

    private int depth(TreeNode root) {
        if (root == null) {
            return 0;
        }

        int leftDepth = depth(root.left);
        int rightDepth = depth(root.right);

        ans = Math.max(ans, leftDepth + rightDepth);

        return Math.max(leftDepth, rightDepth) + 1;
    }
}
```

---

## 一步一步理解代码

### 1. 用全局变量记录最大直径

```java
private int ans = 0;
```

因为每个节点都可能成为最长路径的“中间点”，所以要在遍历整棵树的过程中不断更新最大值。

### 2. 递归求左右子树高度

```java
int leftDepth = depth(root.left);
int rightDepth = depth(root.right);
```

这是在问：

- 左边最多能走多远
- 右边最多能走多远

### 3. 更新当前节点形成的直径

```java
ans = Math.max(ans, leftDepth + rightDepth);
```

当前节点如果作为拐点，那么最长路径长度就是左边高度加右边高度。

### 4. 返回当前节点高度

```java
return Math.max(leftDepth, rightDepth) + 1;
```

父节点只需要知道当前节点往下最多能走多远，所以返回左右高度的较大值再加 1。

---

## 举个例子

```text
    1
   / \
  2   3
 / \
4   5
```

从下往上看：

- 节点 `4` 高度是 `1`
- 节点 `5` 高度是 `1`
- 节点 `2` 的左高度是 `1`，右高度是 `1`
- 所以经过 `2` 的路径长度是 `1 + 1 = 2`
- 节点 `2` 返回给父节点的高度是 `2`
- 节点 `3` 高度是 `1`
- 到根节点 `1` 时，左高度是 `2`，右高度是 `1`
- 所以经过 `1` 的路径长度是 `2 + 1 = 3`

最终最大值是 `3`。

---

## 容易混淆的点

### 1. 直径统计的是边数，不是节点数

所以代码里直接用：

```java
leftDepth + rightDepth
```

不需要再额外加 1。

### 2. 直径不一定经过根节点

所以不能只算根节点的 `左高度 + 右高度`。

必须对每个节点都计算一次，再取最大值。

### 3. 递归函数返回的是高度

不是返回直径。

因为父节点需要的是“向下能走多深”，不是子树内部的最长路径。

---

## 复杂度分析

- 时间复杂度：`O(n)`
  - 每个节点访问一次
- 空间复杂度：`O(h)`
  - 递归栈深度，`h` 是树高

---

## 你写题时可以直接记住

这题就记一句：

> 经过某个节点的最长路径 = 左子树高度 + 右子树高度。

代码核心：

```java
int leftDepth = depth(root.left);
int rightDepth = depth(root.right);
ans = Math.max(ans, leftDepth + rightDepth);
return Math.max(leftDepth, rightDepth) + 1;
```

---

## 一句话总结

二叉树直径题，本质上是“在求高度的过程中，顺便统计每个节点作为拐点时的最长路径”，最后取全局最大值。
