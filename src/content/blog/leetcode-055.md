---
title: 课程表
description: leetcode刷题第三十四天
pubDate: 2026-04-16T16:26
draft: false
tags:
  - LeetCode
  - 八股
categories:
  - LeetCode
---
# 207. 课程表

## 题意

给定 `numCourses` 门课和若干先修关系 `prerequisites`，其中 `prerequisites[i] = [a, b]` 表示：

- 学习课程 `a` 之前，必须先学课程 `b`

问题是：是否能学完所有课程。

本质上，这是在判断一张 **有向图中是否存在环**：

- 如果有环，比如 `0 -> 1 -> 2 -> 0`，那么这些课互相依赖，无法全部完成。
- 如果无环，就可以按某种顺序学完所有课程。

## 核心思路

这题有两种经典做法：

1. DFS 判环
2. BFS 拓扑排序

这里更推荐 **BFS 拓扑排序**，思路直观：

- 先统计每门课的入度（有多少前置课程）
- 把所有入度为 `0` 的课程加入队列
- 每次取出一门课，表示它可以学习
- 然后把它指向的后续课程入度减 `1`
- 如果某门课入度变成 `0`，继续入队
- 最后如果能取出的课程数等于 `numCourses`，说明所有课程都能学完

## 为什么这样做是对的

如果图中没有环：

- 一定至少存在一个入度为 `0`` 的点`
- 我们不断删除这些点，最终能删完所有节点

如果图中有环：

- 环里的每个点入度都不可能先变成 `0`
- 所以最后一定会剩下一些课程无法加入队列

## 示例

### 示例 1

```text
numCourses = 2
prerequisites = [[1,0]]
```

表示：学 `1` 之前先学 `0`

学习顺序可以是：`0 -> 1`

所以返回 `true`

### 示例 2

```text
numCourses = 2
prerequisites = [[1,0],[0,1]]
```

表示：

- 学 `1` 前要先学 `0`
- 学 `0` 前要先学 `1`

形成环，无法完成，返回 `false`

## 参考代码（BFS 拓扑排序）

```java
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        int[] indegree = new int[numCourses];

        for (int[] edge : prerequisites) {
            int a = edge[0];
            int b = edge[1];
            graph.get(b).add(a);
            indegree[a]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int cur = queue.poll();
            count++;

            for (int next : graph.get(cur)) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }

        return count == numCourses;
    }
}
```

## 这段代码逐步讲解

下面按代码执行顺序解释。

### 1. 创建图结构

```java
List<List<Integer>> graph = new ArrayList<>();
for (int i = 0; i < numCourses; i++) {
    graph.add(new ArrayList<>());
}
```

- `graph` 是邻接表，用来表示课程之间的依赖关系
- 下标表示课程编号
- `graph.get(x)` 保存的是：学完课程 `x` 之后，哪些课程可以继续学

比如有关系 `[1, 0]`，表示 `1` 依赖 `0`，那图上就是 `0 -> 1`

### 2. 统计每门课的入度

```java
int[] indegree = new int[numCourses];
```

- `indegree[i]` 表示课程 `i` 当前还有多少门前置课没有完成
- 入度越大，说明这门课越不能立刻学习

### 3. 根据 `prerequisites` 建图

```java
for (int[] edge : prerequisites) {
    int a = edge[0];
    int b = edge[1];
    graph.get(b).add(a);
    indegree[a]++;
}
```

题目规定：`[a, b]` 表示学 `a` 之前必须先学 `b`。

所以：

- 图的方向是 `b -> a`
- `graph.get(b).add(a)`：表示从 `b` 可以到 `a`
- `indegree[a]++`：表示 `a` 多了一个前置条件

例如：

```text
prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```

图就是：

```text
0 -> 1
0 -> 2
1 -> 3
2 -> 3
```

对应入度：

- `indegree[0] = 0`
- `indegree[1] = 1`
- `indegree[2] = 1`
- `indegree[3] = 2`

### 4. 先把所有入度为 0 的课程放进队列

```java
Queue<Integer> queue = new LinkedList<>();
for (int i = 0; i < numCourses; i++) {
    if (indegree[i] == 0) {
        queue.offer(i);
    }
}
```

- 入度为 `0` 说明这门课没有任何前置课
- 这些课可以直接学习，因此先加入队列

### 5. 开始 BFS / 拓扑排序

```java
int count = 0;
while (!queue.isEmpty()) {
    int cur = queue.poll();
    count++;

    for (int next : graph.get(cur)) {
        indegree[next]--;
        if (indegree[next] == 0) {
            queue.offer(next);
        }
    }
}
```

这一段表示：

- 从队列中取出一门当前可以学的课 `cur`
- `count++` 表示已经成功安排学习了一门课
- 遍历所有依赖 `cur` 的课程 `next`
- 因为 `cur` 已经学完，所以 `next` 少了一个未完成前置课
- 即 `indegree[next]--`
- 如果 `next` 的入度减到 `0`，说明它的所有前置课都学完了，可以入队

这个过程本质上是在不断“解锁”后续课程。

### 6. 最后判断是否所有课程都被处理

```java
return count == numCourses;
```

- 如果 `count == numCourses`，说明所有课程都进入过队列并被学习，返回 `true`
- 如果 `count < numCourses`，说明还有课程始终无法学习，返回 `false`

无法学习的根本原因通常就是：图中存在环。

## 用一个例子走流程

```text
numCourses = 4
prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```

### 初始状态

- `0 -> 1`
- `0 -> 2`
- `1 -> 3`
- `2 -> 3`

入度：

- `0: 0`
- `1: 1`
- `2: 1`
- `3: 2`

队列初始只有：`[0]`

### 第一次出队

- 取出 `0`
- `count = 1`
- `0` 的后继是 `1`、`2`
- `indegree[1]` 从 `1` 变成 `0`
- `indegree[2]` 从 `1` 变成 `0`
- 队列变成 `[1, 2]`

### 第二次出队

- 取出 `1`
- `count = 2`
- `1` 的后继是 `3`
- `indegree[3]` 从 `2` 变成 `1`
- 队列变成 `[2]`

### 第三次出队

- 取出 `2`
- `count = 3`
- `2` 的后继是 `3`
- `indegree[3]` 从 `1` 变成 `0`
- `3` 入队，队列变成 `[3]`

### 第四次出队

- 取出 `3`
- `count = 4`

最终 `count == numCourses`，所以返回 `true`。

## 为什么有环时会失败

例如：

```text
numCourses = 2
prerequisites = [[1,0],[0,1]]
```

图为：

```text
0 -> 1
1 -> 0
```

入度：

- `indegree[0] = 1`
- `indegree[1] = 1`

没有任何课程入度为 `0`，所以队列一开始就是空的。

这意味着：

- 没有课程能作为起点开始学习
- `count` 最终不可能等于 `numCourses`
- 因此返回 `false`

## 这段代码的本质

- 入度数组：记录每门课还差几个前置条件
- 邻接表：记录学完当前课程后能解锁哪些课程
- 队列：维护当前所有“可以立刻学习”的课程
- `count`：统计最终能学到多少门课

只要最后学到的课程数等于总课程数，就说明不存在环。

## 复杂度分析

- 时间复杂度：`O(V + E)`
  - `V` 是课程数量
  - `E` 是先修关系数量
- 空间复杂度：`O(V + E)`
  - 邻接表、入度数组、队列都需要额外空间