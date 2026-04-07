---
title: 二叉树的中序遍历
description: leetcode刷题第二十六天
pubDate: 2026-04-07T12:09
image: /images/leetcode-037/4195ecadd9f4a7e5.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的中序遍历

给定一个二叉树的根节点 `root`，返回它的中序遍历结果。

## 一、什么是中序遍历

中序遍历的顺序是：

`左子树 -> 根节点 -> 右子树`

也就是说，对于每一个节点，都要按照下面的顺序处理：

1. 先遍历它的左子树
2. 再访问它自己
3. 最后遍历它的右子树

## 二、递归为什么适合这道题

因为二叉树本身就是一种“一个节点下面还有左右子树”的结构。

而递归的思想就是：

- 把大问题拆成和原问题一样的小问题
- 当前节点的中序遍历 = 左子树的中序遍历 + 当前节点 + 右子树的中序遍历

所以这道题非常适合用递归来做。

## 三、代码实现

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> list = new ArrayList<>();
        return traversal(list, root);
    }

    public List<Integer> traversal(List<Integer> list, TreeNode root) {
        if (root == null) {
            return list;
        }

        traversal(list, root.left);  // 先遍历左子树
        list.add(root.val);          // 再访问当前节点
        traversal(list, root.right); // 最后遍历右子树

        return list;
    }
}
```

## 四、代码讲解

### 1. 主函数 `inorderTraversal`

```java
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> list = new ArrayList<>();
    return traversal(list, root);
}
```

它的作用是：

- 创建一个空的 `list`，用来保存遍历结果
- 调用递归函数 `traversal`
- 最后返回结果

这里的 `list` 会在整个递归过程中一直被使用。

### 2. 递归函数 `traversal`

```java
public List<Integer> traversal(List<Integer> list, TreeNode root) {
    if (root == null) {
        return list;
    }

    traversal(list, root.left);
    list.add(root.val);
    traversal(list, root.right);

    return list;
}
```

这个函数表示：

- `list`：保存答案
- `root`：当前正在处理的节点

### 3. 递归结束条件

```java
if (root == null) {
    return list;
}
```

这一步非常关键。

当当前节点是 `null` 的时候，说明已经走到头了，没有节点可以访问，所以直接返回。

这就是递归的“出口”。

### 4. 中序遍历的核心顺序

```java
traversal(list, root.left);
list.add(root.val);
traversal(list, root.right);
```

这三句就是中序遍历最核心的内容：

- 先递归左边
- 再把当前节点的值加入结果
- 最后递归右边

顺序不能写错。

如果写成：

```java
list.add(root.val);
traversal(list, root.left);
traversal(list, root.right);
```

那就是前序遍历，不是中序遍历。

## 五、举例理解递归过程

例如这棵树：

```text
    1
     \
      2
     /
    3
```

递归执行过程如下：

### 处理节点 1

- 先遍历 `1` 的左子树，左边是 `null`，直接返回
- 访问 `1`，把 `1` 加入 `list`
- 再遍历 `1` 的右子树，也就是节点 `2`

### 处理节点 2

- 先遍历 `2` 的左子树，也就是节点 `3`

### 处理节点 3

- 先遍历 `3` 的左子树，是 `null`，返回
- 访问 `3`，加入 `list`
- 再遍历 `3` 的右子树，是 `null`，返回

### 回到节点 2

- 左子树已经处理完了
- 访问 `2`，加入 `list`
- 右子树是 `null`，返回

最后结果为：

```java
[1, 3, 2]
```

## 六、怎么记这道题

你可以直接记住一句话：

`中序 = 左 -> 中 -> 右`

写递归时就套这个模板：

```java
if (root == null) {
    return;
}

递归左子树
处理当前节点
递归右子树
```

## 七、补充：更常见的写法

有时候也会把结果列表定义成成员变量，这样递归函数就不用传 `list` 参数了。

例如：

```java
class Solution {
    List<Integer> list = new ArrayList<>();

    public List<Integer> inorderTraversal(TreeNode root) {
        traversal(root);
        return list;
    }

    public void traversal(TreeNode root) {
        if (root == null) {
            return;
        }

        traversal(root.left);
        list.add(root.val);
        traversal(root.right);
    }
}
```

这种写法也很常见，但你现在这种“把 `list` 当参数传进去”的方式也完全没问题。

## 八、总结

这道题的重点就是两件事：

- 先写出递归终止条件：`root == null`
- 按照中序遍历顺序：`左 -> 中 -> 右`

只要记住这两点，这类题就能慢慢写顺了。
