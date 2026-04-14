---
title: 路径总和三
description: leetcode刷题第三十二天
pubDate: 2026-04-14T11:55
image: /images/leetcode-050/3eb0a21226be1362.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 路径总和 III 解析

给定一棵二叉树的根节点 `root` 和一个整数 `targetSum`，统计二叉树中路径和等于 `targetSum` 的路径数量。

这里的路径有两个关键限制：

- 路径不一定从根节点开始。
- 路径不一定在叶子节点结束。
- 但路径方向必须向下，也就是只能从父节点走到子节点。

这题最容易想到的是递归做法，先把递归思路想清楚，再看最优解会更自然。

---

## 一、为什么递归是自然思路

对于树题，只要看到“从某个节点出发，继续往左/右子树处理”，就可以优先考虑递归。

这题麻烦的地方在于：

- 路径可以从任意节点开始。
- 但一旦开始后，只能一直向下。

所以我们不能只考虑“从根节点开始的路径”，而是要考虑：

1. 以当前节点为起点，有多少条合法路径。
2. 左子树中有多少条合法路径。
3. 右子树中有多少条合法路径。

把这三部分加起来，就是当前整棵子树的答案。

---

## 二、递归解法：双层递归

### 1. 设计两个函数

我们定义两个递归函数：

#### `pathSum(root, targetSum)`

表示：

- 在整棵以 `root` 为根的树中
- 路径和等于 `targetSum` 的路径总数

#### `count(node, target)`

表示：

- 必须从 `node` 这个节点出发
- 向下走
- 路径和等于 `target` 的路径数

`count` 负责“固定起点向下找”，`pathSum` 负责“枚举整棵树里的所有起点”。

---

### 2. 先看 `count(node, target)` 怎么写

如果当前来到节点 `node`：

- 如果 `node.val == target`，说明找到了一条合法路径。
- 然后继续去左子树找：`count(node.left, target - node.val)`。
- 再去右子树找：`count(node.right, target - node.val)`。

所以递推关系就是：

```text
count(node, target) =
    (1 if node.val == target else 0)
    + count(node.left, target - node.val)
    + count(node.right, target - node.val)
```

递归终止条件：

- 如果 `node` 为空，返回 `0`。

---

### 3. 再看 `pathSum(root, targetSum)` 怎么写

对每个节点，都有三部分答案：

- 以当前节点为起点的合法路径数：`count(root, targetSum)`
- 左子树中的合法路径数：`pathSum(root.left, targetSum)`
- 右子树中的合法路径数：`pathSum(root.right, targetSum)`

所以：

```text
pathSum(root, targetSum) =
    count(root, targetSum)
    + pathSum(root.left, targetSum)
    + pathSum(root.right, targetSum)
```

递归终止条件：

- 如果 `root` 为空，返回 `0`。

---

### 4. 代码实现

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
    public int pathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return 0;
        }

        return count(root, targetSum)
                + pathSum(root.left, targetSum)
                + pathSum(root.right, targetSum);
    }

    private int count(TreeNode node, long target) {
        if (node == null) {
            return 0;
        }

        int res = node.val == target ? 1 : 0;
        res += count(node.left, target - node.val);
        res += count(node.right, target - node.val);
        return res;
    }
}
```

---

### 5. 这个递归到底在做什么

可以把它理解成两层工作：

- 外层递归 `pathSum`：枚举每个节点，把每个节点都当成路径起点试一遍。
- 内层递归 `count`：固定一个起点后，向下尝试所有可能路径。

也就是说：

- `pathSum` 解决“不知道从哪里开始”的问题。
- `count` 解决“从这里开始能找到多少条”的问题。

---

### 6. 时间复杂度

- 最坏情况下时间复杂度是 `O(n^2)`。
- 空间复杂度是递归栈深度 `O(h)`，`h` 是树高；最坏为 `O(n)`。

为什么最坏是 `O(n^2)`：

- 每个节点都可能作为起点。
- 每次作为起点时，又可能向下遍历很多节点。

如果树退化成链表，复杂度会接近平方级。

---

## 三、最优解：前缀和 + DFS

递归解法好理解，但效率不够高。更优的方法是使用：

- 深度优先遍历（DFS）
- 前缀和
- 哈希表统计前缀和出现次数

这样可以把时间复杂度优化到 `O(n)`。

---

## 四、前缀和思路怎么理解

### 1. 数组里的前缀和回顾

在数组中，如果：

- `prefix[i]` 表示从开头到位置 `i` 的和

那么区间 `[j+1, i]` 的和就是：

```text
prefix[i] - prefix[j]
```

如果我们要找区间和等于 `targetSum`，就是看是否存在：

```text
prefix[j] = prefix[i] - targetSum
```

---

### 2. 树里也可以用同样思想

在树的 DFS 过程中，假设当前走到节点 `node`，从根到当前节点的路径和记为 `cur_sum`。

如果存在某个更早的前缀和 `pre_sum`，满足：

```text
cur_sum - pre_sum = targetSum
```

那么说明：

- 从那个前缀和之后的下一个节点开始
- 到当前节点为止
- 这一段路径和就是 `targetSum`

因此，只要知道之前有多少个前缀和等于：

```text
cur_sum - targetSum
```

就能知道“以当前节点为结尾”的合法路径有多少条。

---

### 3. 为什么方向仍然是向下的

因为我们做的是从根到当前节点的一条 DFS 路径。

前缀和哈希表里记录的，始终只是“当前递归路径”上的祖先节点信息，所以找到的路径一定是：

- 从某个祖先节点的下一个位置开始
- 到当前节点结束
- 方向天然是向下的

不会出现跨子树乱连的情况。

---

## 五、前缀和解法步骤

我们在 DFS 时维护：

- `cur_sum`：当前根到节点路径和
- `prefix`：哈希表，记录某个前缀和出现了几次

初始化：

```text
prefix[0] = 1
```

它的含义是：

- 如果从根到当前节点的路径和刚好等于 `targetSum`
- 那么 `cur_sum - targetSum == 0`
- 这时可以直接找到一条合法路径

对每个节点执行：

1. 更新当前前缀和：`cur_sum += node.val`
2. 查看 `prefix[cur_sum - targetSum]` 出现了多少次，这就是新增答案
3. 把当前前缀和加入哈希表：`prefix[cur_sum] += 1`
4. 递归左子树和右子树
5. 回溯时撤销当前前缀和：`prefix[cur_sum] -= 1`

第 5 步很关键，因为哈希表只能保存“当前路径”上的前缀和，不能影响兄弟子树。

---

## 六、最优解代码

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> prefix = new HashMap<>();
        prefix.put(0L, 1);
        return dfs(root, 0L, targetSum, prefix);
    }

    private int dfs(TreeNode node, long curSum, int targetSum, Map<Long, Integer> prefix) {
        if (node == null) {
            return 0;
        }

        curSum += node.val;

        int res = prefix.getOrDefault(curSum - targetSum, 0);

        prefix.put(curSum, prefix.getOrDefault(curSum, 0) + 1);

        res += dfs(node.left, curSum, targetSum, prefix);
        res += dfs(node.right, curSum, targetSum, prefix);

        prefix.put(curSum, prefix.get(curSum) - 1);

        return res;
    }
}
```

---

## 七、最优解为什么要回溯

假设当前正在处理某条从根一路向下的路径。

当我们递归进入某个节点时，会把它对应的前缀和加入哈希表；当处理完它的左右子树后，必须把这个前缀和删除掉，因为：

- 之后要去遍历它的兄弟分支
- 兄弟分支不应该看到这条分支上的前缀和

所以这里本质是：

- DFS 维护当前路径
- 哈希表只服务于当前路径
- 离开节点时要恢复现场

这就是标准的“递归 + 回溯”思想。

---

## 八、复杂度对比

### 双层递归

- 时间复杂度：`O(n^2)`，最坏情况退化成链表时成立
- 空间复杂度：`O(h)`

### 前缀和 + DFS

- 时间复杂度：`O(n)`
- 空间复杂度：`O(n)`，用于哈希表和递归栈

通常面试或刷题中，双层递归适合先讲思路，前缀和解法适合作为优化方案。

---

## 九、怎么选择写法

如果你现在是“这题完全没思路”的状态，建议这样学：

1. 先掌握双层递归，因为它最符合直觉。
2. 彻底明白为什么要拆成 `pathSum` 和 `count` 两个函数。
3. 再去理解前缀和为什么能把“从任意节点开始”这个问题合并到一次 DFS 里。

很多同学一开始直接看最优解，会觉得哈希表和前缀和很绕；但如果先有递归基础，再看优化就会顺很多。

---

## 十、面试里可以怎么说

你可以按下面顺序表达：

1. 因为路径可以从任意节点开始，所以需要枚举每个节点作为起点。
2. 对每个起点，再递归向下统计路径和等于目标值的数量。
3. 这样可以写出双层递归，但最坏是 `O(n^2)`。
4. 进一步可以用前缀和 + 哈希表，在一次 DFS 中统计答案，把复杂度优化到 `O(n)`。

这样回答会显得层次很清楚。

---

## 十一、结论

这题的本质是两个层次：

- 基础解法：递归枚举起点，再递归向下找路径。
- 最优解法：用前缀和把“任意起点”转化为“当前路径上某个前缀是否出现过”。

如果你刚开始学，先把双层递归写熟；如果准备面试或者追求最优复杂度，就掌握前缀和 + DFS。
