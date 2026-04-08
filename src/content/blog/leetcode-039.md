---
title: 翻转二叉树
description: leetcode刷题第二十七天
pubDate: 2026-04-08T08:57
image: /images/leetcode-039/eb575aa2da5ac2eb.webp
draft: false
tags:
  - LeetCode
  - 八股
categories:
  - LeetCode
---
# 翻转二叉树（Java）

## 题目理解

题目的意思是：

- 把每个节点的左子树和右子树交换
- 最后返回翻转后的根节点

比如原来是：

```text
    4
   / \
  2   7
 / \ / \
1  3 6  9
```

翻转后变成：

```text
    4
   / \
  7   2
 / \ / \
9  6 3  1
```

也就是说，**每一个节点都要交换左右孩子**。

---

## 解题思路

这题最直接的做法就是递归。

对于当前节点 `root`：

1. 先把它的左孩子和右孩子交换
2. 再去翻转它的左子树
3. 再去翻转它的右子树

因为整棵树的每个节点都要做同样的事，所以非常适合递归。

---

## 递归终止条件

如果当前节点是 `null`，说明已经到底了，直接返回 `null`。

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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }

        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        invertTree(root.left);
        invertTree(root.right);

        return root;
    }
}
```

---

## 一步一步理解代码

### 1. 先处理空节点

```java
if (root == null) {
    return null;
}
```

如果节点为空，就不用翻转了。

### 2. 交换左右孩子

```java
TreeNode temp = root.left;
root.left = root.right;
root.right = temp;
```

这里用一个临时变量 `temp` 保存左孩子，不然交换时原来的值会丢失。

### 3. 递归处理左右子树

```java
invertTree(root.left);
invertTree(root.right);
```

当前节点交换完成后，再继续翻转下面的子树。

### 4. 返回根节点

```java
return root;
```

题目要求返回翻转后的根节点。

---

## 举个例子

原树：

```text
    2
   / \
  1   3
```

执行过程：

- 先到根节点 `2`
- 交换左右孩子后，变成：左边是 `3`，右边是 `1`
- 再递归翻转 `3` 和 `1`
- 由于它们都是叶子节点，继续递归时会遇到 `null`，直接返回

最后结果：

```text
    2
   / \
  3   1
```

---

## 为什么这题适合递归

因为这道题每个节点要做的事完全一样：

- 交换左孩子和右孩子

而左子树本身又是一棵二叉树，右子树本身也是一棵二叉树。

所以可以把大问题拆成两个一模一样的小问题。

---

## 复杂度分析

- 时间复杂度：`O(n)`
  - 每个节点都访问一次
- 空间复杂度：`O(h)`
  - 递归调用栈的高度是树的高度

---

## 你写题时可以直接记住

这题的核心就是两步：

1. 交换当前节点左右孩子
2. 递归翻转左右子树

可以直接背下面这段：

```java
if (root == null) {
    return null;
}

TreeNode temp = root.left;
root.left = root.right;
root.right = temp;

invertTree(root.left);
invertTree(root.right);

return root;
```

---

## 一句话总结

翻转二叉树就是：**对每个节点，把左子树和右子树交换，再递归处理下一层。**
