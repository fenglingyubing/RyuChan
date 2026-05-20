---
title: H指数
description: leetcode刷题第六十天
pubDate: 2026-05-20T22:00
image: /images/leetcode-110/84668e30ecc2eda5.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 274. H 指数

## 题目描述

给你一个整数数组 `citations`，其中 `citations[i]` 表示研究者第 `i` 篇论文的被引用次数。

要求返回这个研究者的 `h` 指数。

根据定义：

> 如果一名研究者至少有 `h` 篇论文，每篇论文的引用次数都大于等于 `h`，那么他的 h 指数至少是 `h`。

如果有多个可能的 `h`，返回最大的那个。

---

## 一、先理解 h 指数

假设：

```text
citations = [3, 0, 6, 1, 5]
```

这些论文的引用次数分别是：

```text
3, 0, 6, 1, 5
```

如果按引用次数从小到大排序：

```text
[0, 1, 3, 5, 6]
```

从右往左看，其实是在尝试不同的 `h` 是否成立：

- 看 `[6]`，有 `1` 篇论文引用次数大于等于 `1`，所以 `h = 1` 成立
- 看 `[5, 6]`，有 `2` 篇论文引用次数都大于等于 `2`，所以 `h = 2` 成立
- 看 `[3, 5, 6]`，有 `3` 篇论文引用次数都大于等于 `3`，所以 `h = 3` 成立
- 看 `[1, 3, 5, 6]`，虽然有 `4` 篇论文，但不是每篇都大于等于 `4`，所以 `h = 4` 不成立

所以最大的 `h` 是：

```text
3
```

---

## 二、方法一：排序

### 核心思路

先把数组升序排序。

排序后，对于位置 `i`：

```text
citations[i]
```

它右边包含自己在内，一共有：

```text
n - i
```

篇论文。

因为数组已经升序排序，所以从 `i` 到最后的所有论文引用次数都大于等于 `citations[i]`。

因此只要满足：

```text
citations[i] >= n - i
```

就说明：

> 至少有 `n - i` 篇论文，每篇引用次数都大于等于 `n - i`。

此时 `n - i` 就是一个合法的 h 指数。

我们从左往右遍历，第一次满足条件时，`n - i` 最大，直接返回即可。

---

### 为什么第一次满足就是最大值

排序后从左往右遍历：

```text
i = 0, 1, 2, ...
```

对应的论文数量是：

```text
n, n - 1, n - 2, ...
```

也就是说，`n - i` 是逐渐变小的。

所以第一次遇到：

```text
citations[i] >= n - i
```

这个时候的 `n - i` 就是当前能得到的最大 h 指数。

后面即使继续满足，得到的 h 也只会更小。

---

### 示例过程

```text
citations = [3, 0, 6, 1, 5]
```

排序后：

```text
[0, 1, 3, 5, 6]
```

数组长度：

```text
n = 5
```

逐个判断：

```text
i = 0, citations[0] = 0, n - i = 5
0 >= 5 不成立

i = 1, citations[1] = 1, n - i = 4
1 >= 4 不成立

i = 2, citations[2] = 3, n - i = 3
3 >= 3 成立
```

所以答案是：

```text
3
```

---

### Java 代码实现

```java
import java.util.Arrays;

class Solution {
    public int hIndex(int[] citations) {
        Arrays.sort(citations);

        int n = citations.length;
        for (int i = 0; i < n; i++) {
            int h = n - i;
            if (citations[i] >= h) {
                return h;
            }
        }

        return 0;
    }
}
```

---

### 代码解释

先排序：

```java
Arrays.sort(citations);
```

获取论文数量：

```java
int n = citations.length;
```

遍历每个位置：

```java
for (int i = 0; i < n; i++)
```

当前位置右边包含自己，一共有 `n - i` 篇论文：

```java
int h = n - i;
```

如果当前论文引用次数已经大于等于 `h`：

```java
if (citations[i] >= h)
```

由于后面的引用次数只会更大，所以至少有 `h` 篇论文引用次数大于等于 `h`，直接返回：

```java
return h;
```

如果没有任何合法的 `h`，说明 h 指数是 `0`：

```java
return 0;
```

---

## 三、方法二：计数桶

排序法已经可以通过，但它的时间复杂度是 `O(n log n)`。

这题还可以做到 `O(n)`。

关键点是：

> h 指数最大不可能超过论文总数 `n`。

比如只有 `5` 篇论文，就算某篇论文被引用了 `10000` 次，h 指数最大也只能是 `5`。

所以我们可以用一个长度为 `n + 1` 的数组 `bucket` 统计论文数量：

- `bucket[i]` 表示引用次数刚好是 `i` 的论文数量
- `bucket[n]` 表示引用次数大于等于 `n` 的论文数量

### 计数过程

假设：

```text
citations = [3, 0, 6, 1, 5]
```

论文数量：

```text
n = 5
```

引用次数 `6 >= 5`，放到 `bucket[5]`。

引用次数 `5 >= 5`，也放到 `bucket[5]`。

最后统计结果可以理解为：

```text
bucket[0] = 1
bucket[1] = 1
bucket[2] = 0
bucket[3] = 1
bucket[4] = 0
bucket[5] = 2
```

然后从大的 h 开始往小的 h 枚举。

### 为什么从大到小枚举

我们从 `h = n` 开始往下看。

用 `count` 记录：

> 当前已经有多少篇论文的引用次数大于等于 `h`。

如果：

```text
count >= h
```

说明：

> 至少有 `h` 篇论文，每篇引用次数都大于等于 `h`。

这个 `h` 就是合法答案。

因为我们是从大到小枚举，所以第一次满足条件的 `h` 就是最大 h 指数。

### Java 代码实现

```java
class Solution {
    public int hIndex(int[] citations) {
        int n = citations.length;
        int[] bucket = new int[n + 1];

        for (int citation : citations) {
            if (citation >= n) {
                bucket[n]++;
            } else {
                bucket[citation]++;
            }
        }

        int count = 0;
        for (int h = n; h >= 0; h--) {
            count += bucket[h];
            if (count >= h) {
                return h;
            }
        }

        return 0;
    }
}
```

### 代码解释

创建计数桶：

```java
int[] bucket = new int[n + 1];
```

统计每篇论文的引用次数：

```java
for (int citation : citations)
```

如果引用次数大于等于 `n`，统一放入 `bucket[n]`：

```java
if (citation >= n) {
    bucket[n]++;
}
```

否则放入对应引用次数的位置：

```java
bucket[citation]++;
```

从大到小枚举 h：

```java
for (int h = n; h >= 0; h--)
```

累计引用次数大于等于当前 `h` 的论文数量：

```java
count += bucket[h];
```

如果论文数量已经不少于 `h`，说明当前 `h` 成立：

```java
if (count >= h) {
    return h;
}
```

---

## 四、边界情况

### 情况一：所有引用次数都是 0

```text
citations = [0, 0, 0]
```

没有任何论文引用次数大于等于 `1`，答案是：

```text
0
```

### 情况二：只有一篇论文

```text
citations = [10]
```

至少有 `1` 篇论文引用次数大于等于 `1`，答案是：

```text
1
```

### 情况三：引用次数很多，但论文数量有限

```text
citations = [100, 200, 300]
```

最多也只有 `3` 篇论文，所以 h 指数最大只能是：

```text
3
```

---

## 五、复杂度分析

### 方法一：排序

- 时间复杂度：`O(n log n)`
- 空间复杂度：`O(log n)`

时间主要消耗在排序上。

### 方法二：计数桶

- 时间复杂度：`O(n)`
- 空间复杂度：`O(n)`

需要遍历一次数组统计次数，再从 `n` 到 `0` 遍历一次桶。

---

## 六、总结

这题的关键是把定义转成可判断的条件：

> 至少有 `h` 篇论文，每篇引用次数大于等于 `h`。

排序后，位置 `i` 右侧一共有 `n - i` 篇论文。

只要：

```text
citations[i] >= n - i
```

就说明 `n - i` 是一个合法的 h 指数。

从左往右第一次满足时，得到的就是最大答案。

如果追求代码直观，可以使用排序法。

如果追求更高效率，可以使用计数桶，把时间复杂度优化到 `O(n)`。
