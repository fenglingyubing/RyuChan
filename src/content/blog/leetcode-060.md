---
title: 组合总和
description: leetcode刷题第三十六天
pubDate: 2026-04-22T14:48
image: /images/leetcode-060/4c9324ecd0f0ea39.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 39. 组合总和

## 题目描述

给定一个**无重复元素**的整数数组 `candidates` 和一个目标整数 `target`，找出 `candidates` 中可以使数字和为目标数 `target` 的所有**不同组合**。

- 同一个数字可以**无限重复**被选取
- 如果至少一个数字的被选数量不同，则两种组合是不同的
- 返回的组合可以按任意顺序排列

## 解题思路：回溯算法

这是一道经典的**回溯算法**问题。回溯的本质是**深度优先搜索 + 剪枝**。

### 核心思想

1. **搜索空间**：从数组的第一个元素开始，尝试所有可能的组合
2. **递归搜索**：对于每个位置，可以选择：
   - 使用当前数字（递归深入）
   - 不使用当前数字，尝试下一个
3. **剪枝优化**：
   - 如果当前和超过 target，直接返回（剪枝）
   - 由于数组无重复且可以无限选取，需要对数组**排序**以便剪枝

### 算法步骤

1. 先对 `candidates` 数组进行**升序排序**（方便剪枝）
2. 使用 DFS 进行回溯搜索：
   - 参数：`path`（当前组合）、`start`（起始索引）、`sum`（当前和）
   - 如果 `sum == target`，找到一个有效组合，加入结果集
   - 如果 `sum > target`，直接返回（剪枝）
   - 遍历从 `start` 开始的每个元素，尝试加入组合

### 图解过程

以 `candidates = [2,3,6,7]`, `target = 7` 为例：

```
                        []
           /      |      \    \
          2       3       6     7
        /  \       |
       2   ...     3
      /
     2 (sum=4) -> 继续加2 -> sum=6 -> 加2 -> sum=8 > 7 剪枝
                    -> 加3 -> sum=7 ✓ 找到 [2,2,3]
```

## 代码实现（Java）

```java
import java.util.*;

class Solution {
    List<List<Integer>> result = new ArrayList<>();
    int[] candidates;
    int target;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // 排序以便剪枝
        Arrays.sort(candidates);
        this.candidates = candidates;
        this.target = target;
        
        // 开始回溯搜索
        backtrack(new ArrayList<>(), 0, 0);
        
        return result;
    }

    private void backtrack(List<Integer> path, int start, int sum) {
        // 找到有效组合
        if (sum == target) {
            result.add(new ArrayList<>(path));
            return;
        }

        // 剪枝：超过目标值
        if (sum > target) {
            return;
        }

        // 遍历搜索
        for (int i = start; i < candidates.length; i++) {
            // 剪枝：当前数字已超过目标值，后面的更大也不用看了
            if (candidates[i] > target - sum) {
                break;
            }

            // 选择当前数字
            path.add(candidates[i]);
            
            // 递归搜索：注意 i 不变，因为数字可以无限重复选取
            backtrack(path, i, sum + candidates[i]);
            
            // 撤销选择（回溯）
            path.remove(path.size() - 1);
        }
    }
}
```

### 代码详解

| 代码部分 | 说明 |
|---------|------|
| `Arrays.sort(candidates)` | 排序以便剪枝 |
| `backtrack(path, i, sum + candidates[i])` | 传入 `i` 而不是 `i+1`，因为数字可重复 |
| `path.remove(path.size() - 1)` | 回溯，撤销最后的选择 |
| `candidates[i] > target - sum` | 剪枝：如果当前值已超过剩余目标值，跳过 |

## 复杂度分析

| 复杂度 | 分析 |
|--------|------|
| **时间复杂度** | O(N^T)，其中 N 是数组长度，T 是目标值。实际上取决于解的数量，受剪枝影响 |
| **空间复杂度** | O(T)，递归深度最多为 target/min(candidates) |

## 示例演示

```
输入: candidates = [2,3,6,7], target = 7

输出: [[2,2,3], [7]]

解释:
- [2,2,3]: 2+2+3 = 7
- [7]: 7 = 7
```

```
输入: candidates = [2,3,5], target = 8

输出: [[2,2,2,2], [2,3,3], [3,5]]
```

## 关键点总结

1. **排序剪枝**：对数组排序是剪枝的关键
2. **数字可重复**：递归时传入 `i` 而不是 `i+1`
3. **回溯思想**：选择 → 递归 → 撤销
4. **边界处理**：sum > target 时直接返回
