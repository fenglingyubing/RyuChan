---
title: 对称二叉树
description: leetcode刷题第二十七天
pubDate: 2026-04-08T09:12
image: /images/leetcode-040/b3b5902eda035852.webp
draft: false
tags:
  - LeetCode
  - 八股
categories:
  - LeetCode
---
# 对称二叉树（Java）

## 题目理解

题目要求判断一棵二叉树是不是轴对称。

所谓轴对称，就是：

- 左子树和右子树像照镜子一样
- 左边的左节点，要和右边的右节点相同
- 左边的右节点，要和右边的左节点相同

比如这棵树是对称的：

```text
        1
      /   \
     2     2
    / \   / \
   3   4 4   3
```

而这棵树不是对称的：

```text
        1
      /   \
     2     2
      \     \
       3     3
```

---

## 解题思路

这题的关键不是比较“同一边”，而是比较“镜像位置”。

也就是说，要同时拿两个节点来比较：

- 一个来自左子树
- 一个来自右子树

如果整棵树对称，那么必须满足：

1. 这两个节点的值相等
2. 左节点的左孩子 和 右节点的右孩子 对称
3. 左节点的右孩子 和 右节点的左孩子 对称

所以这题本质上是：**判断两棵树是否互为镜像**。

---

## 递归终止条件

设两个节点分别是 `left` 和 `right`。

### 情况 1：都为空

说明这一层是对称的，返回 `true`。

```java
if (left == null && right == null) {
    return true;
}
```

### 情况 2：一个为空，一个不为空

说明结构已经不对称，返回 `false`。

```java
if (left == null || right == null) {
    return false;
}
```

### 情况 3：值不同

说明不对称，返回 `false`。

```java
if (left.val != right.val) {
    return false;
}
```

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
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        return check(root.left, root.right);
    }

    private boolean check(TreeNode left, TreeNode right) {
        if (left == null && right == null) {
            return true;
        }

        if (left == null || right == null) {
            return false;
        }

        if (left.val != right.val) {
            return false;
        }

        return check(left.left, right.right) && check(left.right, right.left);
    }
}
```

---

## 一步一步理解

### 1. 先看根节点

```java
return check(root.left, root.right);
```

根节点本身不用比较，真正要比较的是它的左子树和右子树是否互为镜像。

### 2. 比较两个节点是否对称

```java
private boolean check(TreeNode left, TreeNode right)
```

这个函数的意义就是：

> 判断 `left` 这棵树 和 `right` 这棵树，是不是镜像关系。

### 3. 比较镜像位置

```java
return check(left.left, right.right) && check(left.right, right.left);
```

这里是整道题最关键的地方。

不是比较：

```java
left.left 和 right.left
left.right 和 right.right
```

而是比较：

```java
left.left 和 right.right
left.right 和 right.left
```

因为要的是“镜像”。

---

## 举个例子

```text
        1
      /   \
     2     2
    / \   / \
   3   4 4   3
```

比较过程：

- `2` 和 `2` 相等，继续
- 比较左边的 `3` 和右边的 `3`
- 比较左边的 `4` 和右边的 `4`
- 每一层都满足镜像关系

所以返回 `true`。

---

## 为什么这题容易写错

最容易错的点是：

### 错误想法

很多人会写成比较同方向：

```java
check(left.left, right.left)
check(left.right, right.right)
```

这不是对称，而是在比较“是否一样”。

### 正确想法

对称比较的是镜像位置：

```java
check(left.left, right.right)
check(left.right, right.left)
```

---

## 复杂度分析

- 时间复杂度：`O(n)`
  - 每个节点最多比较一次
- 空间复杂度：`O(h)`
  - 来自递归调用栈，`h` 是树高

---

## 你写题时可以直接记住

这题就记一句话：

> 判断一棵树是否对称，就是判断左子树和右子树是否互为镜像。

代码核心：

```java
if (left == null && right == null) {
    return true;
}
if (left == null || right == null) {
    return false;
}
if (left.val != right.val) {
    return false;
}

return check(left.left, right.right) && check(left.right, right.left);
```

---

## 一句话总结

这题不是判断左右子树“是否相同”，而是判断它们“是否镜像”，所以要交叉比较：左左对右右，左右对右左。
