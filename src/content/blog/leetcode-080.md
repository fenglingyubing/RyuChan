---
title: 数据流的中位数
description: leetcode刷题第四十七天
pubDate: 2026-05-07T12:36
image: /images/leetcode-080/5d040928dd6b0609.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 295. 数据流的中位数

## 题目描述

> 中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

**示例：**
```
arr = [2,3,4] 的中位数是 3
arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5
```

**要求实现：**
- `MedianFinder()` - 初始化
- `void addNum(int num)` - 添加数字
- `double findMedian()` - 返回中位数

---

## 使用列表作为存储的数据结构会超时

```java
class MedianFinder {
    private List<Integer> list;

    public MedianFinder() {
        list = new ArrayList<>();
    }

    public void addNum(int num) {
        list.add(num);
    }

    public double findMedian() {
        Collections.sort(list);  // O(n log n)
        int mid = (list.size() + 1) / 2;
        if (list.size() % 2 == 0) {
            return (double)(list.get(mid - 1) + list.get(mid)) / 2;
        } else {
            return (double)list.get(mid - 1);
        }
    }
}
```

**问题**：
| 方法 | 时间复杂度 | 问题 |
|------|-----------|------|
| `addNum` | O(1) | 插入快 |
| `findMedian` | O(n log n) | 每次都要排序，太慢 |

当数据量大时，每次都排序会超时。

---

## 优化解法：双堆法（推荐）

### 核心思想

使用**两个堆**维护有序数据：
- **最大堆（左半部分）**：存储较小的前半部分元素
- **最小堆（右半部分）**：存储较大的后半部分元素

**关键性质**：
```
最大堆堆顶 < 最小堆堆顶
两个堆元素个数相等（或相差1）
```

```
       数据流: [2, 1, 3, 5, 4]

分桶后:
   最大堆 (小的一半): [2, 1]          堆顶 = 2
   最小堆 (大的一半): [3, 4, 5]      堆顶 = 3

中位数 = (2 + 3) / 2 = 2.5
```

---

## 正确代码

```java
class MedianFinder {
    // 最大堆：存储较小的前半部分（堆顶是最大值）
    private PriorityQueue<Integer> left;
    // 最小堆：存储较大的后半部分（堆顶是最小值）
    private PriorityQueue<Integer> right;

    public MedianFinder() {
        // Lambda 表达式实现最大堆（默认是最小堆，取反即可）
        left = new PriorityQueue<>((a, b) -> b - a);
        right = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // 第一步：先加入最大堆
        left.offer(num);
        // 第二步：将最大堆的堆顶移到最小堆（平衡）
        right.offer(left.poll());

        // 第三步：如果最小堆元素更多，将最小堆堆顶移回最大堆
        if (right.size() > left.size()) {
            left.offer(right.poll());
        }
    }

    public double findMedian() {
        // 如果是奇数个，最大堆堆顶就是中位数
        if (left.size() > right.size()) {
            return left.peek();
        }
        // 如果是偶数个，取两个堆顶的平均值
        return (left.peek() + right.peek()) / 2.0;
    }
}
```

---

## 复杂度分析

| 方法 | 时间复杂度 | 说明 |
|------|-----------|------|
| `addNum` | O(log n) | 堆的插入和删除操作 |
| `findMedian` | O(1) | 只需访问堆顶 |

---

## 图解执行过程

以数据流 `[2, 1, 3, 5, 4, 6]` 为例：

### 添加 2
```
left (最大堆): [2]      堆顶=2
right(最小堆): []       堆顶=null

中位数: 2
```

### 添加 1
```
left.offer(1): left = [2, 1] → 排序后 [2, 1]
left.poll():  2
right.offer(2): right = [2]

平衡后:
left: [1]       堆顶=1
right: [2]      堆顶=2

中位数: (1 + 2) / 2 = 1.5
```

### 添加 3
```
left.offer(3): left = [3, 1] → 排序后 [3, 1]
left.poll():  3
right.offer(3): right = [2, 3]

right.size() > left.size()? 2 > 1? 是!
left.offer(right.poll()): left = [2, 1], right = [3]

平衡后:
left: [2, 1]    堆顶=2
right: [3]      堆顶=3

中位数: (2 + 3) / 2 = 2.5
```

### 添加 5
```
left.offer(5): left = [5, 2, 1] → 排序后 [5, 2, 1]
left.poll():  5
right.offer(5): right = [3, 5]

right.size() > left.size()? 2 > 2? 否!

平衡后:
left: [2, 1]    堆顶=2
right: [3, 5]   堆顶=3

中位数: (2 + 3) / 2 = 2.5
```

### 添加 4
```
left.offer(4): left = [4, 2, 1] → 排序后 [4, 2, 1]
left.poll():  4
right.offer(4): right = [3, 5, 4] → 排序后 [3, 5, 4]

right.size() > left.size()? 2 > 2? 否!

平衡后:
left: [2, 1]    堆顶=2
right: [3, 4, 5]堆顶=3

中位数: (2 + 3) / 2 = 2.5
```

### 添加 6
```
left.offer(6): left = [6, 2, 1] → 排序后 [6, 2, 1]
left.poll():  6
right.offer(6): right = [3, 4, 5, 6]

right.size() > left.size()? 3 > 2? 是!
left.offer(right.poll()): left = [3, 2, 1], right = [4, 5, 6]

平衡后:
left: [3, 2, 1]  堆顶=3
right: [4, 5, 6] 堆顶=4

中位数: (3 + 4) / 2 = 3.5
```

---

## 核心算法步骤详解

### addNum 为什么要这样设计？

```java
public void addNum(int num) {
    // 1. 先加入最大堆
    left.offer(num);

    // 2. 平衡：最大堆的堆顶移到最小堆
    //    这样保证 left 的所有元素 <= right 的所有元素
    right.offer(left.poll());

    // 3. 如果最小堆太大，移回来
    //    保证 left.size() >= right.size()
    if (right.size() > left.size()) {
        left.offer(right.poll());
    }
}
```

**目的**：始终保持 `left.size() >= right.size()`

---

### 为什么这样能保证正确性？

**不变量**：
1. `left` 中的所有元素 <= `right` 中的所有元素
2. `left.size()` 和 `right.size()` 相差最多 1
3. `left` 存储较小的一半，`right` 存储较大的一半

**中位数计算**：
```
奇数个: left.size() > right.size()
        中位数 = left.peek()

偶数个: left.size() == right.size()
        中位数 = (left.peek() + right.peek()) / 2.0
```

---

## 对比总结

| 解法 | addNum 复杂度 | findMedian 复杂度 | 评价 |
|------|--------------|-------------------|------|
| ArrayList + 排序 | O(1) | O(n log n) | 超时 |
| **双堆法** | **O(log n)** | **O(1)** | **推荐** |
| 二分插入 ArrayList | O(n) | O(1) | 可行但编程复杂 |

---

## 一句话总结

> 使用**最大堆存小的一半**，**最小堆存大的一半**，中位数就是两个堆顶的平均值（或最大值堆的堆顶）。

这是面试中的**经典高频题**，核心就是用堆来维护有序数据。