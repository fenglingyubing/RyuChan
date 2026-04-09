---
title: 二叉树的层序遍历
description: leetcode刷题第二十八天
pubDate: 2026-04-09T13:07
image: /images/leetcode-043/c6417eb92699080d.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的层序遍历（Java）

## 题目理解

题目给你一棵二叉树的根节点 `root`，要求返回它的**层序遍历结果**。

层序遍历的意思就是：

- 先遍历第 1 层
- 再遍历第 2 层
- 再遍历第 3 层
- 每一层都按照 **从左到右** 的顺序访问

比如这棵树：

```text
    3
   / \
  9  20
    /  \
   15   7
```

层序遍历结果是：

```java
[[3], [9, 20], [15, 7]]
```

也就是说，返回值不是一个一维数组，而是一个**二维列表**，每个小列表表示一层。

---

## 这题能不能用递归？

可以，**完全可以用递归做**。

很多人一看到“层序遍历”，第一反应是队列，因为这是最经典的写法。

但如果你想用递归，也能做。

递归的关键在于：

- 递归到某个节点时
- 你要知道它在第几层
- 然后把它的值放进对应层的列表里

所以这题递归的本质不是“按层一层层扫”，而是：

> 在深度优先遍历的过程中，顺便记录每个节点属于第几层。

---

## 递归思路

我们定义一个函数：

```java
dfs(TreeNode node, int level)
```

它表示：

> 遍历以 `node` 为根的子树，并把当前节点放到 `level` 对应的那一层中。

### 递归过程中做什么？

每到一个节点，需要做 3 件事：

1. 如果当前节点为空，直接返回
2. 如果结果列表里还没有这一层，就先创建这一层
3. 把当前节点值加入这一层，然后继续递归左右子树

---

## 为什么要判断 `result.size() == level`

因为 `level` 是从 `0` 开始的。

例如：

- 根节点在第 `0` 层
- 根节点的左孩子、右孩子在第 `1` 层
- 再下一层是第 `2` 层

当我们第一次到达某一层时，说明这一层的列表还不存在，就要先创建：

```java
if (result.size() == level) {
    result.add(new ArrayList<>());
}
```

比如：

- 访问根节点时，`level = 0`
- 此时 `result.size() = 0`
- 说明第 0 层还没创建，需要先 `add`

---

## Java 递归写法

```java
import java.util.ArrayList;
import java.util.List;

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
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }

    private void dfs(TreeNode node, int level, List<List<Integer>> result) {
        if (node == null) {
            return;
        }

        if (result.size() == level) {
            result.add(new ArrayList<>());
        }

        result.get(level).add(node.val);

        dfs(node.left, level + 1, result);
        dfs(node.right, level + 1, result);
    }
}
```

---

## 一步一步拆解

### 1. 先创建结果集

```java
List<List<Integer>> result = new ArrayList<>();
```

这个 `result` 用来保存最终答案。

例如最后可能变成：

```java
[[3], [9, 20], [15, 7]]
```

### 2. 从根节点开始递归

```java
dfs(root, 0, result);
```

这里表示：

- 从根节点开始
- 根节点属于第 `0` 层

### 3. 空节点直接返回

```java
if (node == null) {
    return;
}
```

这是递归结束条件。

如果一个节点不存在，就没必要继续往下走了。

### 4. 第一次来到某一层时，先创建这一层的列表

```java
if (result.size() == level) {
    result.add(new ArrayList<>());
}
```

例如第一次到第 2 层时，`result` 中还没有下标为 `2` 的列表，所以要先创建。

### 5. 把当前节点加入对应层

```java
result.get(level).add(node.val);
```

当前节点在哪一层，就放进哪一层的小列表里。

### 6. 递归左右子树

```java
dfs(node.left, level + 1, result);
dfs(node.right, level + 1, result);
```

子节点都属于下一层，所以是 `level + 1`。

并且因为我们先递归左子树，再递归右子树，所以同一层中也能保持 **从左到右**。

---

## 用例子走一遍

还是这棵树：

```text
    3
   / \
  9  20
    /  \
   15   7
```

递归过程大致如下：

### 访问 3

- `level = 0`
- `result` 还没有第 0 层，先创建 `[]`
- 加入 `3`

结果变成：

```java
[[3]]
```

### 访问 9

- `level = 1`
- `result` 还没有第 1 层，先创建 `[]`
- 加入 `9`

结果变成：

```java
[[3], [9]]
```

### 访问 20

- `level = 1`
- 第 1 层已经存在
- 直接加入 `20`

结果变成：

```java
[[3], [9, 20]]
```

### 访问 15 和 7

它们都在第 2 层，最后结果是：

```java
[[3], [9, 20], [15, 7]]
```

---

## 为什么递归也能做“层序遍历”

这点容易绕。

因为递归本身更像是“深度优先遍历”，不是传统意义上的“按层扫描”。

但是这题要求的其实是：

- 最终结果按层分组
- 每层从左到右

并没有强制你必须用队列。

只要你在递归时记录好层数，同样可以得到正确答案。

所以：

- **遍历方式** 是 DFS
- **结果组织形式** 是层序

这就是递归解法的核心。

---

## Java 队列写法（BFS）

除了递归，这题最经典的写法其实是 **队列 + 广度优先遍历（BFS）**。

它的思路更贴合“层序遍历”这个名字。

因为队列会按照节点进入的顺序，保证我们一层一层地处理整棵树。

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

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
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();

        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);

                if (node.left != null) {
                    queue.offer(node.left);
                }

                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            result.add(level);
        }

        return result;
    }
}
```

---

## 队列写法怎么理解

### 1. 先把根节点放进队列

```java
queue.offer(root);
```

队列里保存的是“下一批要处理的节点”。

一开始只有根节点，所以先把根节点放进去。

### 2. 每次 `while` 循环处理一整层

```java
while (!queue.isEmpty()) {
```

只要队列不为空，就说明还有节点没遍历完。

### 3. 用 `size = queue.size()` 固定当前层节点个数

```java
int size = queue.size();
```

这个 `size` 非常关键。

它表示：

> 当前队列里，正好有多少个节点属于同一层。

因为上一层在遍历时，已经把下一层的节点按顺序放进队列了。

所以当前队列中的这 `size` 个节点，就是当前层的全部节点。

### 4. 用 `for` 循环把这一层全部取出来

```java
for (int i = 0; i < size; i++) {
    TreeNode node = queue.poll();
}
```

这里一定只能循环 `size` 次。

因为在处理当前层节点时，我们还会把它们的左右孩子继续放进队列。

如果不先固定 `size`，那下一层的节点也会被混进这一次循环里。

### 5. 把当前层节点的值放进 `level`

```java
level.add(node.val);
```

这个 `level` 用来临时保存当前层的结果。

一层处理完后，再加入总结果：

```java
result.add(level);
```

### 6. 把下一层节点加入队列

```java
if (node.left != null) {
    queue.offer(node.left);
}

if (node.right != null) {
    queue.offer(node.right);
}
```

这样当下一轮 `while` 开始时，队列里保存的刚好就是下一层的节点。

---

## 用例子走一遍队列过程

还是这棵树：

```text
    3
   / \
  9  20
    /  \
   15   7
```

### 开始时

队列中是：

```text
[3]
```

### 第一轮循环

- 当前 `size = 1`
- 说明这一层只有一个节点：`3`
- 取出 `3`，加入当前层结果
- 再把 `9` 和 `20` 放入队列

此时：

```java
result = [[3]]
queue = [9, 20]
```

### 第二轮循环

- 当前 `size = 2`
- 说明这一层有两个节点：`9` 和 `20`
- 依次取出，加入当前层结果
- `20` 的孩子 `15` 和 `7` 进入队列

此时：

```java
result = [[3], [9, 20]]
queue = [15, 7]
```

### 第三轮循环

- 当前 `size = 2`
- 取出 `15` 和 `7`
- 它们没有孩子

最后得到：

```java
[[3], [9, 20], [15, 7]]
```

---

## 这题和队列写法的区别

### 队列写法

- 更符合“层序遍历”的直觉
- 一层一层处理
- 面试里也很常见

### 递归写法

- 更适合你现在这种思路
- 本质上是 DFS + 层号记录
- 代码也比较简洁

所以你说“这题应该要用递归来做”，这并不是错的。

更准确地说：

> 这题最经典的是队列，但递归完全可做，而且很好理解。

---

## 时间复杂度和空间复杂度

### 时间复杂度

```text
O(n)
```

每个节点只访问一次。

### 空间复杂度

```text
O(n)
```

原因有两部分：

- 结果列表要存所有节点
- 递归调用栈最深可能达到树的高度

如果树退化成链表，递归栈最坏是 `O(n)`。

---

## 容易出错的点

### 1. 忘记先创建当前层

如果直接写：

```java
result.get(level).add(node.val);
```

但这一层还不存在，就会下标越界。

### 2. 没有把层数加 1

递归子节点时必须写：

```java
dfs(node.left, level + 1, result);
dfs(node.right, level + 1, result);
```

否则所有节点都会被放到同一层。

### 3. 左右顺序写反

如果先递归右子树，再递归左子树，那么同一层的结果顺序就会变化，不符合“从左到右”。

---

## 一句话总结

这题虽然叫“层序遍历”，但递归也能做。

核心就是：

> 递归遍历每个节点时，额外记录它所在的层数，然后把它放进对应层的列表中。

如果你做题时想更贴近题意，优先记住队列写法；如果你想练递归思维，也可以用 DFS + 层号记录来完成。
