---
title: 二叉搜索树中的第K小的元素
description: leetcode刷题第二十九天
pubDate: 2026-04-10T09:10
image: /images/leetcode-046/23b42354e1d2ed97.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
badge: ''
---
# 二叉搜索树中第 K 小的元素（Java）

## 题目意思

给定一个二叉搜索树 `root`，再给一个整数 `k`，要求你找出这棵树里第 `k` 小的元素。

这里 `k` 从 `1` 开始计数：

- 第 `1` 小：最小值
- 第 `2` 小：第二小值
- ...

## 为什么这题和二叉搜索树有关

这题最关键的性质是：

**二叉搜索树的中序遍历结果是严格递增的。**

也就是说，如果你按下面顺序遍历：

1. 左子树
2. 当前节点
3. 右子树

那么得到的节点值序列一定是从小到大排列的。

例如这棵树：

```text
    5
   / \
  3   6
 / \
2   4
/
1
```

中序遍历结果是：

```text
1, 2, 3, 4, 5, 6
```

所以：

- 第 `1` 小是 `1`
- 第 `3` 小是 `3`
- 第 `5` 小是 `5`

## 解题思路

既然中序遍历是升序，那么我们只要：

- 按中序遍历整棵树
- 每访问到一个节点，就把计数加 `1`
- 当计数等于 `k` 时，这个节点就是第 `k` 小的元素

## Java 写法

```java
class Solution {
    private int count = 0;
    private int ans = 0;

    public int kthSmallest(TreeNode root, int k) {
        inorder(root, k);
        return ans;
    }

    private void inorder(TreeNode node, int k) {
        if (node == null) {
            return;
        }

        inorder(node.left, k);

        count++;
        if (count == k) {
            ans = node.val;
            return;
        }

        inorder(node.right, k);
    }
}
```

## 代码讲解

### 1. 定义两个成员变量

```java
private int count = 0;
private int ans = 0;
```

- `count`：记录当前已经访问了几个节点
- `ans`：记录第 `k` 小的答案

### 2. 主函数

```java
public int kthSmallest(TreeNode root, int k) {
    inorder(root, k);
    return ans;
}
```

调用一次中序遍历，最后返回答案。

### 3. 中序遍历模板

```java
private void inorder(TreeNode node, int k) {
    if (node == null) {
        return;
    }

    inorder(node.left, k);
    count++;
    if (count == k) {
        ans = node.val;
        return;
    }
    inorder(node.right, k);
}
```

顺序是：

- 先左
- 再中
- 后右

这正是 BST 从小到大的访问顺序。

## 例子手动走一遍

例如：

```text
    5
   / \
  3   6
 / \
2   4
/
1
```

如果 `k = 3`。

中序遍历访问顺序：

1. 访问 `1`，`count = 1`
2. 访问 `2`，`count = 2`
3. 访问 `3`，`count = 3`

这时正好等于 `k`，所以答案就是 `3`。

## 为什么能保证正确

因为二叉搜索树满足：

- 左子树所有节点都比根小
- 右子树所有节点都比根大

所以中序遍历时，节点会按照从小到大的顺序被访问。

第 `k` 次访问到的节点，自然就是第 `k` 小的节点。

## 时间复杂度

- 时间复杂度：`O(n)`，最坏情况下要遍历整棵树
- 空间复杂度：`O(h)`，递归栈深度，`h` 是树高

如果树比较平衡，`h` 大约是 `log n`；如果树退化成链表，`h` 就是 `n`。

## 可以再优化的一点

上面的代码在找到答案后，虽然当前层会 `return`，但之前递归回去的上层还可能继续走右子树。

可以加一个剪枝，让它更干净一些：

```java
class Solution {
    private int count = 0;
    private int ans = 0;

    public int kthSmallest(TreeNode root, int k) {
        inorder(root, k);
        return ans;
    }

    private void inorder(TreeNode node, int k) {
        if (node == null) {
            return;
        }

        inorder(node.left, k);

        if (count >= k) {
            return;
        }

        count++;
        if (count == k) {
            ans = node.val;
            return;
        }

        inorder(node.right, k);
    }
}
```

## 迭代写法

如果你不想用递归，也可以用栈模拟中序遍历。

```java
import java.util.Stack;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;

        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }

            cur = stack.pop();
            k--;

            if (k == 0) {
                return cur.val;
            }

            cur = cur.right;
        }

        return -1;
    }
}
```

这个写法本质上还是中序遍历。

## 面试里怎么讲

这题你可以这样说：

1. 这是二叉搜索树，不是普通二叉树
2. BST 的中序遍历结果是升序
3. 所以第 `k` 次访问到的节点就是第 `k` 小
4. 用递归或栈做中序遍历都可以

## 最终推荐提交版本

```java
class Solution {
    private int count = 0;
    private int ans = 0;

    public int kthSmallest(TreeNode root, int k) {
        inorder(root, k);
        return ans;
    }

    private void inorder(TreeNode node, int k) {
        if (node == null) {
            return;
        }

        inorder(node.left, k);

        if (count >= k) {
            return;
        }

        count++;
        if (count == k) {
            ans = node.val;
            return;
        }

        inorder(node.right, k);
    }
}
```
