---
title: 二叉树的最大深度
description: leetcode刷题第二十七天
pubDate: 2026-04-08T08:37
image: /images/leetcode-038/d989af194353e878.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的最大深度（Java）

## 题目理解

二叉树的最大深度，就是从根节点到最远叶子节点这条路径上的节点数。

也可以直接理解成：**这棵树一共有多少层**。

---

## 解题思路

这题最适合用递归。

对于当前节点 `root`：

- 左子树的最大深度 = `maxDepth(root.left)`
- 右子树的最大深度 = `maxDepth(root.right)`
- 当前树的最大深度 = `Math.max(左子树深度, 右子树深度) + 1`

这里的 `+1`，表示把当前节点这一层也算进去。

---

## 递归终止条件

如果当前节点是 `null`，说明已经走到底了，深度返回 `0`。

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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }

        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);

        return Math.max(leftDepth, rightDepth) + 1;
    }
}
```

---

## 举例理解

例如这棵树：

```text
       3
      / \
     9  20
       /  \
      15   7
```

计算过程：

- 节点 `9` 的深度是 `1`
- 节点 `15` 的深度是 `1`
- 节点 `7` 的深度是 `1`
- 节点 `20` 的深度是 `Math.max(1, 1) + 1 = 2`
- 根节点 `3` 的深度是 `Math.max(1, 2) + 1 = 3`

所以最大深度是 `3`。

---

## 你写题时就记这一句

```java
return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
```

前提是先处理空节点：

```java
if (root == null) {
    return 0;
}
```

---

## 复杂度

- 时间复杂度：`O(n)`，每个节点访问一次
- 空间复杂度：`O(h)`，递归栈高度为树高

---

## 一句话总结

这题就是标准二叉树递归：

```java
最大深度 = Math.max(左子树最大深度, 右子树最大深度) + 1
```

空节点返回 `0`，然后递归左右子树即可。
