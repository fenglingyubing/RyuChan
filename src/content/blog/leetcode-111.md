---
title: O(1) 时间插入、删除和获取随机元素
description: leetcode刷题第六十一天
pubDate: 2026-05-21T12:09
image: /images/leetcode-111/6027e56e3659eced.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 380. O(1) 时间插入、删除和获取随机元素

## 题目描述

实现 `RandomizedSet` 类：

- `RandomizedSet()` 初始化对象
- `boolean insert(int val)` 当 `val` 不存在时插入，并返回 `true`；否则返回 `false`
- `boolean remove(int val)` 当 `val` 存在时删除，并返回 `true`；否则返回 `false`
- `int getRandom()` 随机返回集合中的一个元素，并且每个元素被返回的概率相同

要求所有函数的平均时间复杂度都是 `O(1)`。

---

## 一、核心难点

这题难点不在插入，而在：

```text
如何 O(1) 删除一个元素，同时还能 O(1) 随机返回一个元素？
```

如果只用 `HashSet`：

- 插入：`O(1)`
- 删除：`O(1)`
- 随机取一个元素：做不到真正的 `O(1)`

如果只用数组：

- 随机取元素：`O(1)`
- 末尾插入：`O(1)`
- 删除中间元素：通常需要移动元素，不是 `O(1)`

所以需要把两种结构结合起来。

---

## 二、使用 ArrayList + HashMap

使用两个数据结构：

```text
ArrayList<Integer> nums
HashMap<Integer, Integer> map
```

含义是：

- `nums` 存储所有元素，用来支持 `getRandom()`
- `map` 记录每个元素在 `nums` 中的下标，用来支持快速查找和删除

例如：

```text
nums = [10, 20, 30]

map:
10 -> 0
20 -> 1
30 -> 2
```

这样：

- 判断元素是否存在：查 `map`，平均 `O(1)`
- 插入元素：加到 `nums` 末尾，并记录下标，平均 `O(1)`
- 随机返回元素：随机生成一个数组下标，平均 `O(1)`

剩下的问题就是删除。

---

## 三、如何 O(1) 删除

数组中删除末尾元素是 `O(1)`，但删除中间元素不是。

所以删除时不直接移动后面的所有元素，而是：

```text
把要删除的位置，用最后一个元素覆盖
然后删除最后一个元素
```

例如删除 `20`：

```text
nums = [10, 20, 30]
map:
10 -> 0
20 -> 1
30 -> 2
```

`20` 的下标是 `1`，最后一个元素是 `30`。

把 `30` 放到下标 `1`：

```text
nums = [10, 30, 30]
```

同时更新 `30` 的下标：

```text
map:
10 -> 0
20 -> 1
30 -> 1
```

再删除数组最后一个元素：

```text
nums = [10, 30]
```

最后从 `map` 中删除 `20`：

```text
map:
10 -> 0
30 -> 1
```

整个过程只做了常数次操作，所以删除也是平均 `O(1)`。

---

## 四、Java 代码实现

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

class RandomizedSet {
    private final List<Integer> nums;
    private final Map<Integer, Integer> map;
    private final Random random;

    public RandomizedSet() {
        nums = new ArrayList<>();
        map = new HashMap<>();
        random = new Random();
    }

    public boolean insert(int val) {
        if (map.containsKey(val)) {
            return false;
        }

        map.put(val, nums.size());
        nums.add(val);
        return true;
    }

    public boolean remove(int val) {
        if (!map.containsKey(val)) {
            return false;
        }

        int index = map.get(val);
        int lastVal = nums.get(nums.size() - 1);

        nums.set(index, lastVal);
        map.put(lastVal, index);

        nums.remove(nums.size() - 1);
        map.remove(val);

        return true;
    }

    public int getRandom() {
        int index = random.nextInt(nums.size());
        return nums.get(index);
    }
}
```

---

## 五、代码解释

### insert

先判断是否已经存在：

```java
if (map.containsKey(val)) {
    return false;
}
```

如果不存在，就把元素放到数组末尾：

```java
nums.add(val);
```

它的下标就是插入前数组的长度：

```java
map.put(val, nums.size());
```

这里代码里先写 `map.put`，再写 `nums.add`，因为插入前的 `nums.size()` 正好就是新元素的下标。

---

### remove

先判断元素是否存在：

```java
if (!map.containsKey(val)) {
    return false;
}
```

找到要删除元素的位置：

```java
int index = map.get(val);
```

取出最后一个元素：

```java
int lastVal = nums.get(nums.size() - 1);
```

用最后一个元素覆盖要删除的位置：

```java
nums.set(index, lastVal);
map.put(lastVal, index);
```

然后删除数组最后一个元素：

```java
nums.remove(nums.size() - 1);
```

最后从 `map` 中删除目标元素：

```java
map.remove(val);
```

如果删除的元素本来就是最后一个元素，这套逻辑也能正常工作。

---

### getRandom

因为 `nums` 中连续存放了当前所有元素，所以随机一个合法下标即可：

```java
int index = random.nextInt(nums.size());
return nums.get(index);
```

每个下标被选中的概率相同，因此每个元素被返回的概率也相同。

---

## 六、为什么每个元素概率相同

假设当前集合中有 `n` 个元素，它们分别存放在：

```text
nums[0], nums[1], ..., nums[n - 1]
```

`random.nextInt(n)` 会等概率生成 `[0, n - 1]` 中的任意整数。

每个元素都只占一个下标，所以每个元素被返回的概率都是：

```text
1 / n
```

---

## 七、复杂度分析

### insert

- 时间复杂度：平均 `O(1)`
- 空间复杂度：`O(n)`

### remove

- 时间复杂度：平均 `O(1)`
- 空间复杂度：`O(n)`

### getRandom

- 时间复杂度：`O(1)`
- 空间复杂度：`O(n)`

整体需要用 `nums` 和 `map` 存储所有元素，所以空间复杂度是 `O(n)`。

---

## 八、总结

这题的关键是：

```text
ArrayList 负责 O(1) 随机访问
HashMap 负责 O(1) 找到元素下标
删除时用最后一个元素覆盖被删除元素的位置
```

只要理解了“用最后一个元素覆盖再删末尾”这个技巧，就能同时满足插入、删除、随机获取都是平均 `O(1)`。
