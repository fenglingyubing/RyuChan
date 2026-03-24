---
title: 最大子数组和
description: leetcode刷题第十六天
pubDate: 2026-03-24T22:49
image: /images/leetcode-020/9a77d4c6d1ae50df.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 合并区间

## 题目描述

给定一个区间数组 `intervals`，其中 `intervals[i] = [starti, endi]`，请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。

示例：

```java
intervals = [[1,3],[2,6],[8,10],[15,18]]
```

输出：

```java
[[1,6],[8,10],[15,18]]
```

## 核心思路

这类题的标准写法可以总结为：

```text
先排序，再扫描合并
```

### 1. 先按左端点排序

如果区间是无序的，就很难直接判断当前区间是否会和后面的区间重叠。先按每个区间的左端点从小到大排序后，重叠关系会变得非常清晰。

排序代码：

```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
```

这里：

- `a` 和 `b` 都表示一个区间，例如 `[1, 3]`
- `a[0]` 表示区间左端点
- `a[1]` 表示区间右端点

### 2. 从左到右扫描

用一个变量 `current` 表示当前正在合并的区间。

遍历后续每个区间 `next` 时，只有两种情况：

#### 情况一：有重叠

判断条件：

```java
next[0] <= current[1]
```

含义：

- `next[0]` 是下一个区间的左端点
- `current[1]` 是当前合并区间的右端点

如果下一个区间的左端点不大于当前区间的右端点，就说明它们有重叠，可以合并。

合并方式：

```java
current[1] = Math.max(current[1], next[1]);
```

#### 情况二：没有重叠

判断条件：

```java
next[0] > current[1]
```

这时说明当前区间已经无法再和后面的区间合并了，需要：

1. 先把 `current` 放入结果集
2. 再把 `next` 作为新的当前区间

## 解题模板

```text
1. 将所有区间按左端点升序排序
2. 定义结果列表 res
3. 用 current 记录当前合并区间
4. 从第二个区间开始遍历：
   - 若重叠，更新 current 的右端点
   - 若不重叠，把 current 加入结果，再更新 current
5. 循环结束后，把最后一个 current 加入结果
```

## Java 源码

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new int[0][];
        }

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> res = new ArrayList<>();
        int[] current = intervals[0];

        for (int i = 1; i < intervals.length; i++) {
            int[] next = intervals[i];

            if (next[0] <= current[1]) {
                current[1] = Math.max(current[1], next[1]);
            } else {
                res.add(current);
                current = next;
            }
        }

        res.add(current);
        return res.toArray(new int[res.size()][]);
    }
}
```

## 手动模拟

输入：

```java
[[1,3],[2,6],[8,10],[15,18]]
```

排序后：

```java
[[1,3],[2,6],[8,10],[15,18]]
```

初始化：

```java
current = [1,3]
```

遍历过程：

1. `next = [2,6]`  
   `2 <= 3`，有重叠，合并后 `current = [1,6]`
2. `next = [8,10]`  
   `8 > 6`，无重叠，先把 `[1,6]` 放入结果，再令 `current = [8,10]`
3. `next = [15,18]`  
   `15 > 10`，无重叠，先把 `[8,10]` 放入结果，再令 `current = [15,18]`

最后别忘了把 `current` 加入结果。

最终输出：

```java
[[1,6],[8,10],[15,18]]
```

## 复杂度分析

- 时间复杂度：`O(n log n)`
- 空间复杂度：`O(n)`

说明：

- 排序需要 `O(n log n)`
- 遍历合并只需要 `O(n)`
- 结果数组在最坏情况下需要额外 `O(n)` 空间

## 易错点总结

### 1. 判断条件写错

错误写法：

```java
if (next[0] <= current[0])
```

正确写法：

```java
if (next[0] <= current[1])
```

原因：

- 是否重叠，比较的是“下一个区间左端点”和“当前区间右端点”
- 不是比较两个左端点

### 2. 遍历从第一个区间开始

如果已经写了：

```java
int[] current = intervals[0];
```

那么后面的遍历最好从下标 `1` 开始，否则第一个区间会重复参与比较。

### 3. 排序比较器直接相减

不推荐：

```java
(a, b) -> a[0] - b[0]
```

更稳妥的写法：

```java
(a, b) -> Integer.compare(a[0], b[0])
```

原因是前者理论上可能有整数溢出风险。

## 适用范围

这种“排序 + 扫描”的写法，适用于很多区间类题目，例如：

- 合并区间
- 插入区间
- 删除重叠区间
- 统计最多不重叠区间
- 会议室安排类问题

遇到区间题时，可以先考虑：

```text
能不能先排序，再用一个变量维护当前区间状态
```
