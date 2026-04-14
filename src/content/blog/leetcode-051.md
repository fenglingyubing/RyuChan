---
title: 二叉树的最近公共祖先
description: leetcode刷题第三十二天
pubDate: 2026-04-14T12:16
image: /images/leetcode-051/a62b876f14166eb6.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的最近公共祖先（Java）

## 题目理解

题目给你一棵二叉树，以及两个节点 `p` 和 `q`，要求找到它们的最近公共祖先（LCA, Lowest Common Ancestor）。

最近公共祖先的意思是：

- 这个节点同时是 `p` 和 `q` 的祖先
- 并且它要尽可能“靠下”
- 一个节点也可以是它自己的祖先

比如这棵树：

```text
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

- `p = 5`，`q = 1`，最近公共祖先是 `3`
- `p = 5`，`q = 4`，最近公共祖先是 `5`

第二种情况说明：如果一个节点本身就是另一个节点的祖先，那么它自己就是答案。

---

## 解题核心思路

这道题最经典的做法是 **递归**。

我们站在当前节点 `root` 的角度思考：

1. 如果当前节点是 `null`，那就说明没找到，返回 `null`
2. 如果当前节点就是 `p` 或者 `q`，直接返回当前节点
3. 分别去左子树和右子树里找 `p`、`q`
4. 根据左右子树的返回结果，判断当前节点是不是最近公共祖先

也就是：

- 左边找到了一个，右边也找到了一个 -> 当前节点就是最近公共祖先
- 只有左边找到了 -> 答案在左边
- 只有右边找到了 -> 答案在右边
- 两边都没找到 -> 返回 `null`

---

## 为什么这样做是对的

因为对于任意一个节点来说，`p` 和 `q` 只会出现下面几种情况：

- 都在左子树里
- 都在右子树里
- 一个在左子树，一个在右子树
- 当前节点本身就是 `p` 或 `q`

如果一个在左边、一个在右边，那么第一次出现这种“分叉”的节点，一定就是最近公共祖先。

而递归正好可以帮我们从下往上把这个结果返回出来。

---

## Java 代码

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left != null && right != null) {
            return root;
        }

        return left != null ? left : right;
    }
}
```

---

## 一步一步拆解代码

### 1. 递归出口

```java
if (root == null || root == p || root == q) {
    return root;
}
```

这里有三种情况：

- `root == null`：走到底了，没找到，返回 `null`
- `root == p`：找到了 `p`，返回 `p`
- `root == q`：找到了 `q`，返回 `q`

为什么找到 `p` 或 `q` 就直接返回？

因为这相当于告诉上层：

“我这一支里找到了目标节点。”

---

### 2. 去左右子树查找

```java
TreeNode left = lowestCommonAncestor(root.left, p, q);
TreeNode right = lowestCommonAncestor(root.right, p, q);
```

含义是：

- `left` 表示左子树递归后的结果
- `right` 表示右子树递归后的结果

它们可能是：

- `null`：这一边没找到
- `p` 或 `q`：这一边找到了目标节点
- 某个祖先节点：这一边已经提前找到了最近公共祖先

---

### 3. 左右都不为空

```java
if (left != null && right != null) {
    return root;
}
```

如果左边返回了结果，右边也返回了结果，说明：

- `p` 和 `q` 分别出现在当前节点的两侧

所以当前节点 `root` 就是它们的最近公共祖先。

---

### 4. 只有一边找到结果

```java
return left != null ? left : right;
```

这里表示：

- 如果左边不为空，就返回左边
- 否则返回右边

原因是：

- 如果 `p` 和 `q` 都在左子树，那么左子树内部已经算出了答案
- 如果都在右子树，道理一样
- 如果当前只找到一个目标节点，也要把它继续往上返回

---

## 用例子理解递归过程

还是看这棵树：

```text
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

### 例 1：`p = 5`，`q = 1`

- 从根节点 `3` 开始
- 左子树找到了 `5`
- 右子树找到了 `1`
- 左右都不为空，所以答案就是 `3`

### 例 2：`p = 5`，`q = 4`

- 从根节点 `3` 开始
- 左子树里能找到 `5` 和 `4`
- 右子树里找不到，返回 `null`
- 所以答案一定在左子树里
- 继续往左看，在节点 `5` 这里，发现 `root == p`
- 直接返回 `5`

最后答案就是 `5`

---

## 这道题最关键的一句话

你可以直接记住：

`如果左右子树分别找到一个目标节点，那么当前节点就是最近公共祖先。`

这就是整道题的本质。

---

## 复杂度分析

- 时间复杂度：`O(n)`
  - 最坏情况下每个节点都会访问一次
- 空间复杂度：`O(h)`
  - `h` 是树的高度，主要是递归调用栈的开销
  - 如果树退化成链表，最坏是 `O(n)`
  - 如果是平衡二叉树，大约是 `O(log n)`

---

## 面试时怎么说

这题可以这样回答：

- 用后序递归思想处理
- 先递归左右子树
- 如果左右子树都返回非空，说明 `p` 和 `q` 分别在当前节点两侧，当前节点就是最近公共祖先
- 如果只有一边非空，就把那一边的结果返回给上层
- 如果当前节点本身就是 `p` 或 `q`，直接返回当前节点

---

## 记忆模板

```java
if (root == null || root == p || root == q) {
    return root;
}

TreeNode left = lowestCommonAncestor(root.left, p, q);
TreeNode right = lowestCommonAncestor(root.right, p, q);

if (left != null && right != null) {
    return root;
}

return left != null ? left : right;
```

这段基本就是这道题的标准模板。
