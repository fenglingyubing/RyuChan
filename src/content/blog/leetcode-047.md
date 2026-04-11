---
title: 二叉树的右视图
description: leetcode刷题第三十天
pubDate: 2026-04-11T13:32
image: /images/leetcode-047/d3d2ff798feb950b.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 二叉树的右视图
## 题目：给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

示例 1：

```java
输入：root = [1,2,3,null,5,null,4]
输出：[1,3,4]
```

## 思路分析：
可以通过二叉树的层序遍历来实现，先遍历右节点，然后将遍历到节点数据添加到列表，如果右节点为null则将左节点的值添加到列表

## 完整代码：
```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> list = new ArrayList<>();
        check(root, 0, list);
        return list;
    }

    private void check(TreeNode node, int level, List<Integer> list){
        if(node == null){
            return;
        }

        if(list.size() == level){
            list.add(node.val);
        }
        check(node.right, level + 1,list);
        check(node.left, level + 1, list);
    }
}
```