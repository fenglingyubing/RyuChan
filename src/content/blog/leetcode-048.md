---
title: 二叉树展开为链表
description: leetcode刷题第三十天
pubDate: 2026-04-11T14:21
image: /images/leetcode-048/ce973aea81fb95d4.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# Flatten Binary Tree to Linked List 题解分析

## 第一版解法

```java
class Solution {
    public void flatten(TreeNode root) {
        if(root == null){
            return;
        }
        List<Integer> res = new ArrayList<>();
        traverse(root,res);
        root.left = null;
        root.right = null;
        TreeNode node = root;
        for (int i = 1; i < res.size(); i++){
            node.right = new TreeNode(res.get(i));
            node = node.right;
        }
    }

    private void traverse(TreeNode node,List<Integer> res){
        if(node == null){
            return;
        }

        res.add(node.val);
        traverse(node.left,res);
        traverse(node.right,res);
    }
}
```

## 解法的分析

这个思路是正确的：

- 题目要求展开后的链表顺序和二叉树的先序遍历一致。
- 先用 `traverse` 按 `root -> left -> right` 的顺序收集所有节点值。
- 再根据收集到的结果，重新构造一条只使用 `right` 指针的链表。

所以从结果顺序上看，这个做法是可以得到正确答案的。

不过，这个解法有几个明显特点和局限：

### 1. 不是严格的原地展开

题目要求的是直接修改原来的二叉树结构，把它展开成链表。

而代码中：

```java
node.right = new TreeNode(res.get(i));
```

这里重新创建了新的节点，说明你并没有把原树中的节点真正串起来，而是：

- 保留了原来的根节点
- 其余位置重新 new 了一批新节点

这更像是“根据先序遍历结果重建链表”，而不是“把原树原地拍平”。

### 2. 额外空间开销较大

使用了：

- `List<Integer>` 存所有节点值
- 新建了一整条链表节点

所以这个解法虽然能做出来，但额外空间比较多。

### 3. 原树节点没有被充分复用

题目通常更希望你操作的是原来的 `TreeNode` 节点本身，而不是只复用 `root`，剩下都重建。

## 复杂度分析

### 时间复杂度

`O(n)`

- 先序遍历一次整棵树
- 再根据结果构造一次链表

### 空间复杂度

`O(n)`

- `res` 存了所有节点值
- 递归还会占用调用栈空间

## 最优的原地解法

下面这版是更推荐的写法：原地修改，并且时间复杂度是 `O(n)`。

```java
class Solution {
    private TreeNode prev;

    public void flatten(TreeNode root) {
        if (root == null) {
            return;
        }

        flatten(root.right);
        flatten(root.left);

        root.right = prev;
        root.left = null;
        prev = root;
    }
}
```

## 最优原地解法解析

这份代码的核心思想是逆先序遍历：

- 普通先序是 `root -> left -> right`
- 我们反过来遍历：`right -> left -> root`
- 用一个全局变量 `prev` 记录当前已经展开好的链表头节点

这样当处理到当前节点 `root` 时：

- `prev` 指向的是按照先序顺序中，当前节点后面的那个节点
- 直接让 `root.right = prev`
- 再把 `root.left = null`
- 最后更新 `prev = root`

这样就能把整棵树一点点原地串成链表。

## 为什么要先右后左

因为我们是在“倒着构造”先序链表。

先序目标顺序是：

```text
root -> left -> right
```

如果倒过来处理，就应该是：

```text
right -> left -> root
```

这样当处理 `root` 时，`left` 和 `right` 对应的链表都已经整理好了，`root` 只需要接到最前面即可。

## 执行过程理解

假设某一时刻处理到节点 `root`：

1. 先递归处理 `root.right`
2. 再递归处理 `root.left`
3. 此时 `prev` 已经指向当前节点在展开链表中的下一个节点
4. 让当前节点接到 `prev` 前面：

```java
root.right = prev;
root.left = null;
prev = root;
```

这样每个节点都只处理一次，而且不需要再去扫描链表末尾。

## 最优原地解法的复杂度

### 时间复杂度

`O(n)`

- 每个节点只访问一次
- 没有额外的末尾查找操作

### 空间复杂度

`O(h)`

- 只使用递归调用栈
- `h` 是树的高度

## 总结

- 第一版写法结果顺序是对的，因为抓住了先序遍历这个关键。
- 但它本质上是“收集值后重建链表”，不是严格意义上的原地展开。
- 更标准的答案是直接修改原来的 `left` 和 `right` 指针，把原树节点串起来。
- 上面给出的逆先序写法是更优的原地解法，时间复杂度更稳定。
