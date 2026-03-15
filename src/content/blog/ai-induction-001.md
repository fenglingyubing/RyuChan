---
title: Java 集合常见面试题总结 一 （ChatGPT归纳总结）
description: ChatGPT进行的归纳知识点
pubDate: 2026-03-15T20:16
image: /images/ai-induction-001/16fec5a8d7297735.png
draft: false
tags:
  - 八股
  - Java
  - AI归纳
categories:
  - AI归纳八股
---

> 参考来源：JavaGuide  
> 原文链接：http://javaguide.cn/java/collection/java-collection-questions-01.html

本文基于 JavaGuide 的《Java 集合常见面试题》整理，适合作为 Java 集合模块的面试复习提纲。

## 1. Java 集合框架概览

Java 集合框架主要可以分为两大类：

- `Collection`：单列集合，用来存储一个一个的对象
- `Map`：双列集合，用来存储键值对

`Collection` 体系下又主要分为：

- `List`：有序、可重复
- `Set`：无序、不可重复
- `Queue`：队列，通常遵循 FIFO

常见实现类：

- `List`：`ArrayList`、`LinkedList`、`Vector`
- `Set`：`HashSet`、`LinkedHashSet`、`TreeSet`
- `Queue`：`PriorityQueue`、`ArrayDeque`
- `Map`：`HashMap`、`LinkedHashMap`、`Hashtable`、`TreeMap`、`ConcurrentHashMap`

## 2. List、Set、Queue、Map 的区别

### 2.1 List

- 元素有序
- 元素可重复
- 支持通过下标访问
- 典型实现：`ArrayList`、`LinkedList`

### 2.2 Set

- 元素不可重复
- 通常不保证插入顺序
- 典型实现：
  - `HashSet`：基于哈希表实现
  - `LinkedHashSet`：保留插入顺序
  - `TreeSet`：自动排序

### 2.3 Queue

- 一般按先进先出处理元素
- 适合缓冲、任务调度等场景
- `PriorityQueue` 例外：按优先级出队，不一定遵循 FIFO

### 2.4 Map

- 以 `key-value` 形式存储
- `key` 通常不可重复，`value` 可以重复
- 适合根据键快速查找值

## 3. ArrayList 和 Vector 的区别

共同点：

- 都基于数组实现
- 都支持随机访问

主要区别：

### 3.1 线程安全

- `ArrayList` 线程不安全
- `Vector` 线程安全，很多方法带同步

### 3.2 性能

- `ArrayList` 无同步开销，性能通常更好
- `Vector` 因为加锁，性能相对较低

### 3.3 扩容机制

- `ArrayList` 默认按约 `1.5` 倍扩容
- `Vector` 默认按 `2` 倍扩容；也可以通过构造函数指定扩容增量

结论：

- 单线程场景优先使用 `ArrayList`
- 线程安全场景更推荐 `Collections.synchronizedList(...)` 或并发容器，而不是 `Vector`

## 4. ArrayList 和 LinkedList 的区别

## 4.1 底层数据结构

- `ArrayList`：动态数组
- `LinkedList`：双向链表（JDK 1.6 之后）

## 4.2 随机访问性能

- `ArrayList` 支持快速随机访问，按索引取值效率高
- `LinkedList` 按索引访问需要移动指针，效率较低

## 4.3 插入和删除性能

- `ArrayList` 在尾部追加元素通常较快
- `ArrayList` 在中间插入或删除元素时，可能需要移动大量元素
- `LinkedList` 在已知节点位置时，插入和删除更高效

注意：

- 如果是按索引查找某个位置再插入，`LinkedList` 不一定比 `ArrayList` 快，因为查找本身就有成本

## 4.4 内存占用

- `ArrayList` 主要消耗连续数组空间
- `LinkedList` 每个节点还需要额外存储前驱和后继指针，内存开销更大

## 4.5 适用场景

- 频繁随机访问：优先 `ArrayList`
- 频繁在首尾或中间插入删除，且定位节点成本较低：可考虑 `LinkedList`

## 5. ArrayList 扩容机制

`ArrayList` 底层是动态数组。添加元素时如果容量不足，就会触发扩容。

### 5.1 什么时候会扩容

- 当调用 `add()` 添加元素时，如果当前数组放不下新元素，就会触发扩容
- 本质上会先判断最小所需容量 `minCapacity` 是否大于当前数组长度

### 5.2 初始容量是多少

- JDK 8 中，`new ArrayList()` 创建后，底层并不会马上分配容量为 `10` 的数组
- 此时底层是一个空数组
- 第一次执行添加操作时，才会真正分配默认容量 `10`

这也是面试里很容易被问到的点：

- 不是“无参构造一上来就有 10 个容量”
- 而是“首次添加元素时才扩成 10”

### 5.3 每次扩容多少

`ArrayList` 扩容后的新容量一般是旧容量的 `1.5` 倍，源码思路可概括为：

```java
newCapacity = oldCapacity + (oldCapacity >> 1);
```

也就是：

- 原来容量是 `10`，扩容后约为 `15`
- 原来容量是 `15`，扩容后约为 `22`

如果 `1.5` 倍之后仍然小于本次真正需要的最小容量，那么会直接使用所需的最小容量。

### 5.4 扩容底层做了什么

扩容不是在原数组上“原地变大”，而是：

1. 计算新容量
2. 创建一个更大的新数组
3. 将原数组元素拷贝到新数组
4. 将引用指向新数组

所以扩容是有成本的，主要成本来自：

- 数组拷贝
- 新数组内存分配

### 5.5 为什么是 1.5 倍

如果每次只扩 `1`：

- 扩容次数会非常频繁
- 数组复制成本很高

如果每次直接扩 `2` 倍：

- 虽然扩容次数更少
- 但可能浪费更多内存空间

因此 `1.5` 倍可以理解为在以下两者之间做平衡：

- 扩容次数
- 内存利用率

### 5.6 最大容量问题

`ArrayList` 不是无限扩容的。

- 当容量继续增大时，会受到数组最大长度限制
- 源码中通常会涉及 `MAX_ARRAY_SIZE`
- 如果再继续扩，可能抛出 `OutOfMemoryError`

### 5.7 面试标准回答

可以直接这样回答：

> `ArrayList` 底层是动态数组，JDK 8 中无参构造不会立即分配容量，第一次添加元素时才初始化为 10。之后如果容量不足，会按原容量的 1.5 倍扩容，本质上是新建更大的数组并把旧数组拷贝过去，所以频繁扩容会带来性能开销。

### 5.8 面试追问

- 为什么扩容不是每次只加 `1`？
  - 因为会导致频繁扩容和数组拷贝，性能很差
- 为什么不是直接翻倍？
  - 因为会带来更明显的空间浪费，`1.5` 倍是时间和空间上的折中
- 如何减少扩容开销？
  - 如果能预估元素数量，创建时指定初始容量

## 6. HashMap 的底层实现

JDK 1.8 中，`HashMap` 底层结构是：

- 数组
- 链表
- 红黑树

可以理解为“数组 + 链表 / 红黑树”。

元素存储流程大致如下：

1. 对 `key` 计算哈希值
2. 根据哈希值定位数组桶位置
3. 如果桶为空，直接插入
4. 如果桶中已有元素，先比较哈希值和 `key`
5. 冲突元素较少时采用链表组织
6. 链表长度达到树化阈值后，可能转为红黑树

这样设计的目的：

- 数组支持快速定位
- 链表用于处理哈希冲突
- 红黑树用于降低高冲突情况下的查询时间复杂度

## 7. HashMap 和 Hashtable 的区别

### 7.1 线程安全

- `HashMap` 线程不安全
- `Hashtable` 线程安全

### 7.2 性能

- `HashMap` 性能通常更好
- `Hashtable` 因同步开销更大，性能较低

### 7.3 null 支持

- `HashMap` 允许一个 `null key` 和多个 `null value`
- `Hashtable` 不允许 `null key` 和 `null value`

### 7.4 继承体系

- `HashMap` 继承自 `AbstractMap`
- `Hashtable` 继承自过时风格更强的 `Dictionary`

结论：

- 现在开发中通常不再推荐使用 `Hashtable`
- 并发场景优先考虑 `ConcurrentHashMap`

## 8. HashMap 和 HashSet 的区别

### 8.1 存储内容不同

- `HashMap` 存储键值对
- `HashSet` 只存储对象元素

### 8.2 底层关系

- `HashSet` 底层实际上基于 `HashMap` 实现
- `HashSet` 的元素会作为 `HashMap` 的 `key` 存储，`value` 则是一个固定的占位对象

### 8.3 重复判断

- `HashMap` 根据 `key` 是否重复判断覆盖
- `HashSet` 根据元素是否重复判断是否插入成功

## 9. HashSet 如何检查重复

`HashSet` 判断元素是否重复，核心依赖：

- `hashCode()`
- `equals()`

判断流程：

1. 先计算对象哈希值，确定桶位置
2. 如果桶为空，直接插入
3. 如果桶不为空，继续比较：
   - 哈希值是否相同
   - `equals()` 是否返回 `true`
4. 只有当两者都满足时，才认为元素重复

因此在自定义对象放入 `HashSet` 时，通常要同时重写：

- `equals()`
- `hashCode()`

否则可能出现“逻辑上重复，但集合无法识别”的问题。

## 10. 为什么重写 equals 时必须重写 hashCode

原因是哈希容器的判重和查找分成两步：

1. 先通过 `hashCode()` 确定桶位置
2. 再通过 `equals()` 判定是否相等

如果只重写 `equals()` 不重写 `hashCode()`，会导致：

- 两个逻辑相等的对象，哈希值却不同
- 它们被分配到不同桶中
- 最终 `HashSet`、`HashMap` 无法正确判重或查找

规范要求：

- 如果两个对象通过 `equals()` 判断相等，那么它们的 `hashCode()` 必须相同

## 11. ConcurrentHashMap 了解吗

`ConcurrentHashMap` 是线程安全的哈希表，适合高并发场景使用。

特点：

- 支持并发读写
- 性能通常优于整表加锁的 `Hashtable`
- 是现代 Java 并发集合中的常用选择

JDK 1.7 和 JDK 1.8 实现思路有差异：

- JDK 1.7：分段锁思想
- JDK 1.8：采用更细粒度的同步控制，锁粒度更小

面试中一般回答到以下层次即可：

- 为什么线程安全
- 和 `Hashtable` 的差异
- JDK 1.7 / 1.8 实现演进

## 12. ConcurrentHashMap 和 Hashtable 的区别

### 12.1 锁粒度不同

- `Hashtable` 基本可以理解为对整张表加锁
- `ConcurrentHashMap` 锁粒度更细，并发性能更好

### 12.2 性能不同

- `ConcurrentHashMap` 在高并发环境下吞吐量通常更高
- `Hashtable` 更容易成为性能瓶颈

### 12.3 设计目标不同

- `Hashtable` 是较早期的线程安全容器
- `ConcurrentHashMap` 是为高并发场景专门设计的现代并发容器

## 13. Java 集合常见面试快问快答

### 13.1 `ArrayList` 默认初始容量是多少？

- 首次添加元素后默认初始化为 `10`

### 13.2 `ArrayList` 扩容多少倍？

- 通常为原容量的 `1.5` 倍

### 13.3 `LinkedList` 底层是什么？

- 双向链表

### 13.4 `HashMap` JDK 1.8 底层结构是什么？

- 数组 + 链表 + 红黑树

### 13.5 `HashMap` 为什么线程不安全？

- 多线程并发修改时没有同步控制，可能出现数据覆盖、结构异常等问题

### 13.6 `HashSet` 为什么不能存重复元素？

- 通过 `hashCode()` 和 `equals()` 共同判断重复

### 13.7 并发场景下 `Map` 用什么？

- 优先使用 `ConcurrentHashMap`

## 14. 面试回答建议

回答集合题时，建议按以下顺序组织语言：

1. 先说特性：是否有序、可重复、线程安全与否
2. 再说底层：数组、链表、红黑树、哈希表等
3. 再说性能：查询、插入、删除的典型表现
4. 最后补充适用场景和常见坑点

例如回答 `ArrayList` 和 `LinkedList` 区别时，可以用一句话概括：

> `ArrayList` 基于动态数组，随机访问快；`LinkedList` 基于双向链表，插入删除更灵活，但按索引访问较慢。

## 15. 总结

Java 集合面试中最常考的并不是 API 细节，而是以下几类问题：

- 集合分类和使用场景
- `ArrayList`、`LinkedList` 的对比
- `HashMap` 的底层实现和扩容机制
- `HashSet` 的去重原理
- `equals()` 与 `hashCode()` 的关系
- `ConcurrentHashMap` 和 `Hashtable` 的区别

如果把这些问题讲清楚，Java 集合这一块的基础面试通常就比较稳了。
