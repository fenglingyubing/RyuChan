---
title: 前K个高频元素
description: leetcode刷题第四十七天
pubDate: 2026-05-07T11:58
image: /images/leetcode-079/afcaffe12a059678.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 347. 前 K 个高频元素

## 题目描述

> 给你一个整数数组 `nums` 和一个整数 `k`，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

**示例：**
```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]

输入: nums = [1], k = 1
输出: [1]
```

---

## 解题思路

### 方法一：堆排序（推荐）

**核心思想**：使用最小堆维护 Top K

1. 统计每个元素的出现频率（HashMap）
2. 建立最小堆，保持堆中只有 K 个最高频元素
3. 遍历完后，堆中就是答案

**为什么用最小堆而不是最大堆？**

- 最小堆的根是当前堆中最小的元素
- 当堆元素超过 K 时，弹出最小的，保留最大的 K 个

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 第一步：统计频率
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // 第二步：建立最小堆，按频率排序
        // priorityQueue 默认是最小堆
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            (a, b) -> a[1] - b[1]  // 按频率从小到大排
        );

        // 第三步：遍历频率表
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();
            pq.offer(new int[]{num, count});

            // 如果堆大小超过 K，弹出最小频率的元素
            if (pq.size() > k) {
                pq.poll();
            }
        }

        // 第四步：取出结果
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = pq.poll()[0];
        }
        return result;
    }
}
```

**复杂度分析：**

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| 时间 | O(n log k) | 遍历 n 个元素，每次堆操作 O(log k) |
| 空间 | O(n) | HashMap 存储 n 个元素的频率 |

---

### 方法二：桶排序

**核心思想**：频率范围是固定的 [1, n]，可以按频率分桶

```
桶 1: 出现 1 次的元素
桶 2: 出现 2 次的元素
...
桶 n: 出现 n 次的元素
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 第一步：统计频率
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // 第二步：创建桶
        // 频率范围是 1 到 nums.length，所以创建 nums.length + 1 个桶
        List<Integer>[] buckets = new ArrayList[nums.length + 1];
        for (int i = 0; i <= nums.length; i++) {
            buckets[i] = new ArrayList<>();
        }

        // 第三步：将元素放入对应频率的桶
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();
            buckets[count].add(num);
        }

        // 第四步：从高频率到低频率取出 K 个元素
        List<Integer> result = new ArrayList<>();
        for (int i = buckets.length - 1; i >= 0 && result.size() < k; i--) {
            result.addAll(buckets[i]);
        }

        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

**复杂度分析：**

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| 时间 | O(n) | 统计 O(n) + 遍历桶 O(n) |
| 空间 | O(n) | HashMap + 桶数组 |

---

## 两种方法对比

| 方法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|------------|------------|----------|
| 最小堆 | O(n log k) | O(n) | K 较小时更优 |
| 桶排序 | O(n) | O(n) | K 接近 n 时更简单 |

---

## 图解示例

**输入**: `[1,1,1,2,2,3]`, `k = 2`

### 最小堆方法执行过程：

```
第一步：统计频率
nums = [1,1,1,2,2,3]
freq = {1:3, 2:2, 3:1}

第二步：遍历并维护大小为 K=2 的最小堆

freq = {1:3, 2:2, 3:1}

遍历 1: pq = [(1,3)], size=1 <=2
遍历 2: pq = [(2,2), (1,3)], size=2 <=2
遍历 3: pq = [(2,2), (1,3), (3,1)], size=3 >2
         弹出 (3,1)，保留最大的两个

最终 pq = [(2,2), (1,3)]
结果 = [2, 1]  (顺序任意)
```

---

## 关键知识点

### PriorityQueue（优先队列）

```java
// 默认是最小堆（小顶堆）
PriorityQueue<int[]> pq = new PriorityQueue<>();

// Lambda 表达式指定比较规则
PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> a[1] - b[1]  // 按第二个元素从小到大排
);

// 或者使用 Integer 的自然顺序（频率）
PriorityQueue<Integer> pq = new PriorityQueue<>(
    Comparator.comparingInt(freq::get)
);
```

### 常见陷阱

1. **HashMap 的 getOrDefault**：
   ```java
   freq.put(num, freq.getOrDefault(num, 0) + 1);
   ```

2. **优先队列的.offer()和.poll()**：
   - `.offer()` - 添加元素
   - `.poll()` - 弹出最小元素

3. **返回顺序**：
   - 题目要求任意顺序，所以不需要排序返回结果

---

## 总结

| 步骤 | 操作 |
|------|------|
| 1 | 统计每个元素的频率（HashMap） |
| 2 | 选择一种方法：堆 or 桶 |
| 3 | 取出 Top K |

**推荐使用堆方法**，因为面试中经常考察 PriorityQueue 的使用。