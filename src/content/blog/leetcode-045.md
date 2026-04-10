---
title: 验证平衡二叉树
description: leetcode刷题第二十九天
pubDate: 2026-04-10T08:51
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 验证二叉搜索树（Java）

## 题目理解

给你一个二叉树根节点 `root`，判断它是否是一个有效的二叉搜索树（BST）。

二叉搜索树要求：

- 左子树所有节点都 **严格小于** 当前节点
- 右子树所有节点都 **严格大于** 当前节点
- 左右子树本身也必须都是二叉搜索树

## 这份代码的问题

写的是：

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        if(root == null){
            return false;
        }

        return check(root);
    }

    private boolean check(TreeNode root){
        if(root.left.val > root.val || root.right.val < root.val){
            return false;
        }

        return check(root.left) && check(root.right);
    }
}
```

主要有 4 个问题：

### 1. 空树应该返回 `true`

空树也算合法的二叉搜索树，所以：

```java
if (root == null) {
    return true;
}
```

### 2. 会发生空指针异常

如果 `root.left` 或 `root.right` 是 `null`，下面这句就会直接报错：

```java
if(root.left.val > root.val || root.right.val < root.val)
```

### 3. 只比较了“当前节点和左右孩子”，但这还不够

BST 不是只看一层，而是要看整棵子树。

例如这棵树：

```text
    5
   / \
  1   7
     / \
    4   8
```

节点 `4` 在 `5` 的右子树里，但 `4 < 5`，所以这棵树不是 BST。

这种写法只会检查：

- `7 > 5`
- `4 < 7`
- `8 > 7`

表面都没问题，却漏掉了 `4` 必须大于 `5` 这一层限制。

### 4. 递归终止条件不完整

 `check(root.left)`、`check(root.right)` 一直递归下去，但没有先判断 `root == null`。

## 正确做法

最常用的方法是：

给每个节点规定一个允许范围。

- 左子树节点必须在 `(min, root.val)` 之间
- 右子树节点必须在 `(root.val, max)` 之间

只要有一个节点不在这个范围内，就不是 BST。

## Java 代码

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return dfs(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean dfs(TreeNode node, long min, long max) {
        if (node == null) {
            return true;
        }

        if (node.val <= min || node.val >= max) {
            return false;
        }

        return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
    }
}
```

## 代码解析

### 1. 主函数

```java
public boolean isValidBST(TreeNode root) {
    return dfs(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
```

一开始给根节点一个无限大的合法范围：

- 最小值：`Long.MIN_VALUE`
- 最大值：`Long.MAX_VALUE`

之所以用 `long`，是为了防止节点值刚好等于 `Integer.MIN_VALUE` 或 `Integer.MAX_VALUE` 时出边界问题。

### 2. 递归函数含义

```java
private boolean dfs(TreeNode node, long min, long max)
```

表示判断以 `node` 为根的子树，是否所有节点都满足：

```java
min < node.val < max
```

### 3. 终止条件

```java
if (node == null) {
    return true;
}
```

空节点不影响 BST，返回 `true`。

### 4. 当前节点是否合法

```java
if (node.val <= min || node.val >= max) {
    return false;
}
```

题目要求是 **严格小于** 和 **严格大于**，所以这里不能写成 `<` 或 `>`。

### 5. 递归检查左右子树

```java
return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
```

- 左子树：最大值变成当前节点值 `node.val`
- 右子树：最小值变成当前节点值 `node.val`

这样就把祖先节点的限制一层层传下去了。

## 举例理解

例如：

```text
    5
   / \
  3   7
 / \   \
2   4   8
```

递归时范围大致是：

- `5` 在 `(-inf, +inf)` 中，合法
- `3` 在 `(-inf, 5)` 中，合法
- `7` 在 `(5, +inf)` 中，合法
- `2` 在 `(-inf, 3)` 中，合法
- `4` 在 `(3, 5)` 中，合法
- `8` 在 `(7, +inf)` 中，合法

所以它是 BST。

如果某个节点落在范围外，就直接返回 `false`。

## 时间复杂度

- 时间复杂度：`O(n)`，每个节点只访问一次
- 空间复杂度：`O(h)`，递归栈深度，`h` 为树高

## 另一种思路

还可以用 **中序遍历**。

因为 BST 的中序遍历结果一定是严格递增的。只要中序遍历过程中发现前一个数 `>=` 当前数，就不是 BST。

不过面试里“范围法”更直观，也更容易解释。

## 最终可提交版本

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return dfs(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean dfs(TreeNode node, long min, long max) {
        if (node == null) {
            return true;
        }

        if (node.val <= min || node.val >= max) {
            return false;
        }

        return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
    }
}
```
