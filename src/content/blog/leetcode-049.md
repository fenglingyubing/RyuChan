---
title: 从前序与中序遍历序列构造二叉树
description: leetcode刷题第三十一天
pubDate: 2026-04-13T14:14
image: /images/leetcode-049/a5ea1dbe5fbf1da3.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 从前序与中序遍历序列构造二叉树（Java）

## 题目理解

给定两个整数数组：

- `preorder`：二叉树的先序遍历结果
- `inorder`：同一棵二叉树的中序遍历结果

要求根据这两个数组，把原来的二叉树重新构造出来，并返回根节点。

比如：

```java
preorder = [3, 9, 20, 15, 7]
inorder = [9, 3, 15, 20, 7]
```

构造出的二叉树是：

```text
    3
   / \
  9  20
    /  \
   15   7
```

---

## 先序和中序各自告诉了我们什么

这题的关键，是先搞清楚两种遍历的特点。

### 1. 先序遍历

顺序是：

```text
根 -> 左 -> 右
```

所以：

- `preorder` 的第一个元素，一定是整棵树的根节点

### 2. 中序遍历

顺序是：

```text
左 -> 根 -> 右
```

所以：

- 在 `inorder` 中找到根节点后
- 根节点左边的部分就是左子树
- 根节点右边的部分就是右子树

---

## 核心思路

每次递归做这几件事：

1. 从 `preorder` 里拿当前子树的根节点
2. 去 `inorder` 里找到这个根节点的位置
3. 根据这个位置，把中序数组切成左子树和右子树两部分
4. 继续递归构造左子树和右子树

这就是一个很典型的“分治 + 递归”问题。

---

## 为什么可以递归

因为对于任意一棵子树：

- 它也有自己的先序遍历
- 也有自己的中序遍历
- 处理方式和原问题完全一样

所以可以把“大问题”拆成“相同类型的小问题”，自然就想到递归。

---

## 举例推演

还是看这个例子：

```java
preorder = [3, 9, 20, 15, 7]
inorder = [9, 3, 15, 20, 7]
```

### 第一步：确定根节点

先序遍历第一个元素是 `3`，所以根节点是 `3`。

### 第二步：在中序里找根节点

`inorder = [9, 3, 15, 20, 7]`

找到 `3` 的位置后：

- 左边 `[9]` 是左子树
- 右边 `[15, 20, 7]` 是右子树

### 第三步：划分先序数组

左子树在中序中有 1 个节点，所以先序里根节点后面的 1 个元素属于左子树：

- 左子树先序：`[9]`
- 右子树先序：`[20, 15, 7]`

### 第四步：继续递归

- 左子树根节点是 `9`
- 右子树根节点是 `20`

然后继续按同样的方法往下拆。

---

## 如何设计递归函数

我们定义函数：

```java
build(preLeft, preRight, inLeft, inRight)
```

表示：

> 用 `preorder[preLeft...preRight]` 和 `inorder[inLeft...inRight]` 这两段区间，构造出当前子树，并返回根节点。

### 递归终止条件

如果区间为空：

```java
if (preLeft > preRight) {
    return null;
}
```

说明当前没有节点了，直接返回 `null`。

### 当前层要做的事

1. `preorder[preLeft]` 就是根节点值
2. 在 `inorder` 中找到这个值的位置 `rootIndex`
3. 左子树节点数 = `rootIndex - inLeft`
4. 递归构造左子树
5. 递归构造右子树

---

## 为什么要用哈希表

如果每次都去 `inorder` 里线性查找根节点位置，那么每层都可能扫描一遍数组，效率会比较低。

所以我们可以先用一个 `HashMap<Integer, Integer>` 记录：

- 键：节点值
- 值：它在 `inorder` 中的下标

这样查找根节点位置就能做到 `O(1)`。

---

## Java 代码

```java
import java.util.HashMap;
import java.util.Map;

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
    private Map<Integer, Integer> indexMap = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) {
            indexMap.put(inorder[i], i);
        }

        return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int preLeft, int preRight,
                           int inLeft, int inRight) {
        if (preLeft > preRight) {
            return null;
        }

        int rootVal = preorder[preLeft];
        TreeNode root = new TreeNode(rootVal);

        int rootIndex = indexMap.get(rootVal);
        int leftSize = rootIndex - inLeft;

        root.left = build(preorder, preLeft + 1, preLeft + leftSize,
                inLeft, rootIndex - 1);

        root.right = build(preorder, preLeft + leftSize + 1, preRight,
                rootIndex + 1, inRight);

        return root;
    }
}
```

---

## 代码拆解

### 1. 先把中序下标存进哈希表

```java
for (int i = 0; i < inorder.length; i++) {
    indexMap.put(inorder[i], i);
}
```

这样后面我们可以快速知道某个根节点在中序里的位置。

### 2. 根节点一定是先序区间的第一个元素

```java
int rootVal = preorder[preLeft];
```

因为先序遍历顺序就是“根左右”。

### 3. 计算左子树节点个数

```java
int leftSize = rootIndex - inLeft;
```

因为中序遍历里，根节点左边全是左子树。

### 4. 左子树区间怎么确定

中序区间：

```text
inLeft ~ rootIndex - 1
```

左子树一共有 `leftSize` 个节点，所以先序区间是：

```text
preLeft + 1 ~ preLeft + leftSize
```

### 5. 右子树区间怎么确定

中序区间：

```text
rootIndex + 1 ~ inRight
```

先序里跳过：

- 当前根节点 1 个
- 左子树 `leftSize` 个

所以右子树先序区间是：

```text
preLeft + leftSize + 1 ~ preRight
```

---

## 时间复杂度

- 建立哈希表：`O(n)`
- 递归构造整棵树：`O(n)`

总时间复杂度：

```text
O(n)
```

---

## 空间复杂度

- 哈希表需要 `O(n)`
- 递归调用栈最坏情况下需要 `O(n)`

所以总空间复杂度：

```text
O(n)
```

---

## 这题最容易出错的地方

### 1. 左子树节点数量算错

一定是：

```java
leftSize = rootIndex - inLeft;
```

### 2. 先序区间和中序区间对应不上

很多人会在递归参数这里绕晕，本质上只要记住：

- 先序第一个是根
- 中序根左边是左子树
- 左子树有多少个节点，先序里就切多少个给左子树

### 3. 没有处理空区间

如果没有这个判断：

```java
if (preLeft > preRight) {
    return null;
}
```

就会继续递归下去，导致错误。

---

## 一句话总结

这题的本质是：

> 用先序确定根节点，用中序划分左右子树，再递归构造整棵树。

只要你把“根是谁”和“左右子树范围怎么切”这两件事想清楚，这题就不难了。

---

## 可直接提交的答案

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    private Map<Integer, Integer> indexMap = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) {
            indexMap.put(inorder[i], i);
        }

        return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int preLeft, int preRight,
                           int inLeft, int inRight) {
        if (preLeft > preRight) {
            return null;
        }

        int rootVal = preorder[preLeft];
        TreeNode root = new TreeNode(rootVal);
        int rootIndex = indexMap.get(rootVal);
        int leftSize = rootIndex - inLeft;

        root.left = build(preorder, preLeft + 1, preLeft + leftSize,
                inLeft, rootIndex - 1);
        root.right = build(preorder, preLeft + leftSize + 1, preRight,
                rootIndex + 1, inRight);

        return root;
    }
}
```
