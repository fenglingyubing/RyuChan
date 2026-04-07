---
title: LRU缓存
description: leetcode刷题第二十六天
pubDate: 2026-04-07T11:28
image: /images/leetcode-036/14c368f9e723dbfe.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LRU Cache 思路讲解

## 1. 题目要解决什么

我们要设计一个缓存，支持两个操作：

- `get(key)`：如果 `key` 存在，返回对应的值；否则返回 `-1`
- `put(key, value)`：插入或更新一个键值对

并且要求：

- 当缓存容量满了以后，要删除**最近最少使用**（LRU, Least Recently Used）的元素
- `get` 和 `put` 的平均时间复杂度都必须是 `O(1)`

## 2. 为什么普通做法不行

如果只用数组或链表：

- 查找某个 `key` 是否存在会很慢，通常是 `O(n)`

如果只用哈希表：

- 虽然可以 `O(1)` 查到 `key`
- 但没法快速知道“谁是最久没用的元素”

所以，**单独使用一种数据结构不够**。

## 3. 核心思路：哈希表 + 双向链表

这是这道题的经典做法。

### 哈希表的作用

哈希表 `map` 用来做到：

- 通过 `key`，在 `O(1)` 时间找到对应的节点

### 双向链表的作用

双向链表用来维护“使用顺序”：

- **链表头部**：最近刚使用过的节点
- **链表尾部**：最久没使用的节点

这样一来：

- 某个键被访问了，就把它移动到链表头部
- 容量满时，直接删除链表尾部节点

因为双向链表可以在已知节点位置时 `O(1)` 删除和插入，所以能满足题意。

## 4. 为什么一定是双向链表

如果用单向链表：

- 想删除某个节点时，通常还得先找到它的前一个节点
- 这会退化成 `O(n)`

双向链表的每个节点都有：

- `prev`：前驱节点
- `next`：后继节点

所以可以直接把某个节点从链表里摘掉，再插到头部，都是 `O(1)`。

## 5. 结构设计

我们定义一个节点 `Node`，里面保存：

- `key`
- `value`
- `prev`
- `next`

然后 `LRUCache` 里维护：

- `capacity`：容量
- `map`：`key -> Node`
- `head` 和 `tail`：两个哨兵节点，方便统一处理边界情况

使用哨兵节点后：

- 真正的数据节点都放在 `head` 和 `tail` 之间
- 不需要单独讨论“链表为空”或“只有一个节点”的复杂情况

链表示意：

```text
head <-> 最近使用 <-> ... <-> 最久未使用 <-> tail
```

## 6. 两个关键操作

### 操作一：把节点移到头部

当发生以下情况时：

- 调用了 `get(key)` 并且找到了
- 调用了 `put(key, value)`，并且 `key` 已存在

都说明这个节点刚刚被使用过，需要把它移动到链表头部。

分两步：

1. 先从原位置删除
2. 再插入到头部

### 操作二：删除尾部节点

当 `put` 新元素后，如果缓存超出容量：

- 删除 `tail` 前面的那个节点
- 同时从哈希表中删除它的 `key`

这个节点就是“最久未使用”的节点。

## 7. `get` 的执行过程

`get(key)`：

1. 在哈希表中查找 `key`
2. 如果不存在，返回 `-1`
3. 如果存在：
   - 取出对应节点
   - 把该节点移动到链表头部
   - 返回节点的 `value`

所以时间复杂度是：

- 哈希表查找：`O(1)`
- 链表删除 + 插入：`O(1)`

总计仍然是 `O(1)`。

## 8. `put` 的执行过程

`put(key, value)` 分两种情况。

### 情况一：`key` 已存在

1. 通过哈希表找到节点
2. 更新它的 `value`
3. 把它移动到链表头部

### 情况二：`key` 不存在

1. 创建新节点
2. 放入哈希表
3. 插入链表头部
4. 如果插入后节点数超过 `capacity`
   - 删除链表尾部节点
   - 从哈希表中移除对应 `key`

整个过程也都是 `O(1)`。

## 9. 一个例子帮助理解

假设容量是 `2`。

### 第一步

```text
put(1, 1)
```

缓存：

```text
head <-> (1,1) <-> tail
```

### 第二步

```text
put(2, 2)
```

缓存：

```text
head <-> (2,2) <-> (1,1) <-> tail
```

说明 `2` 是最近使用，`1` 是较久未使用。

### 第三步

```text
get(1)
```

访问了 `1`，所以 `1` 要移动到头部：

```text
head <-> (1,1) <-> (2,2) <-> tail
```

返回值是 `1`。

### 第四步

```text
put(3, 3)
```

此时容量满了，要插入 `3`，必须删除最久未使用的节点。

当前链表尾部前面的节点是 `(2,2)`，所以删除它：

```text
head <-> (3,3) <-> (1,1) <-> tail
```

所以 `2` 被淘汰。

## 10. 代码框架示例（Java）

```java
import java.util.HashMap;
import java.util.Map;

class LRUCache {
    class Node {
        int key;
        int value;
        Node prev;
        Node next;
        
        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> cache;
    private final Node head;
    private final Node tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }

        Node node = cache.get(key);
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            node.value = value;
            moveToHead(node);
        } else {
            Node node = new Node(key, value);
            cache.put(key, node);
            addToHead(node);

            if (cache.size() > capacity) {
                Node removed = removeTail();
                cache.remove(removed.key);
            }
        }
    }

    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void moveToHead(Node node) {
        removeNode(node);
        addToHead(node);
    }

    private Node removeTail() {
        Node node = tail.prev;
        removeNode(node);
        return node;
    }
}
```

## 11. 你可以这样记这道题

一句话记忆：

**哈希表负责快查，双向链表负责维护使用顺序。**

再精炼一点就是：

- 查找靠 `HashMap`
- 更新顺序靠双向链表
- 淘汰元素删尾部
- 最近使用放头部

## 12. 时间复杂度和空间复杂度

- `get`：`O(1)`
- `put`：`O(1)`
- 空间复杂度：`O(capacity)`

## 13. 面试/做题时的表达模板

如果你要在面试里讲，可以直接这样说：

> 这题要求 `get` 和 `put` 都是 `O(1)`，所以需要同时解决“快速查找”和“维护访问顺序”两个问题。我会用哈希表加双向链表：哈希表负责通过 key 在 `O(1)` 找到节点，双向链表负责维护最近使用顺序。每次访问或更新节点时，把它移动到链表头部；当容量超限时，删除链表尾部节点，也就是最久未使用的节点。这样两个操作都能保持 `O(1)`。

## 14. 最后总结

这道题最关键的不是代码，而是先想明白：

- 要想 `O(1)` 查找，必须用哈希表
- 要想 `O(1)` 调整“最近使用顺序”，必须用双向链表
- 两者结合，才是 LRU 的标准解法

如果你愿意，我下一步可以继续帮你补一份：

- `LeetCode 标准提交版 Java 代码`
- 或者 `Python 版本实现`
- 或者 `带手动画图的更直观解释`
