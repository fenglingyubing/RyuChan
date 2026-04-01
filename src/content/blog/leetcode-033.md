---
title: 随机链表的复制
description: leetcode刷题第二十四天
pubDate: 2026-04-01T09:23
image: /images/leetcode-033/2f5256cbe254400a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 复制带随机指针的链表 (Deep Copy List with Random Pointer)

## 1. 题目背景
**题目描述**：
给你一个长度为 `n` 的链表，每个节点包含一个额外增加的随机指针 `random`，该指针可以指向链表中的任何节点或空节点。构造这个链表的 **深拷贝**。

**核心要求**：
1.  拷贝必须由 `n` 个全新的节点组成。
2.  新链表中的 `next` 和 `random` 指针必须指向**新链表**中的节点，不能指向原链表。
3.  返回新链表的头节点。

---

## 2. 错误案例分析
### 失败的代码实现：
```java
while(start != null){
    // 关键错误行：
    cur.next = new Node(start.val, start.next, start.random);
    start = start.next;
    cur = cur.next;
}
```

### 为什么这样不行？
1.  **引用的对象不对**：`start.next` 和 `start.random` 指向的是**原链表**里的节点。当你直接把它们传给新节点的构造函数时，新节点实际上在引用旧节点。
2.  **节点未就绪**：当你创建节点 `A` 的拷贝 `a` 时，`A.random` 所指向的节点 `C` 可能还没被创建出来。直接引用 `A.random` 只是复制了一个内存地址，而那个地址依然属于原链表。

---

## 3. 正确解法：哈希表法 (HashMap)
这是最直观的思路，利用哈希表建立“原节点”与“新节点”的一一对应关系。

### 核心逻辑：
1.  **第一遍遍历**：仅复制节点的值，并将 `(原节点, 新节点)` 作为键值对存入 Map。
2.  **第二遍遍历**：利用 Map 找到对应的克隆节点，连接 `next` 和 `random` 指针。

### Java 代码：
```java
public Node copyRandomList(Node head) {
    if (head == null) return null;
    Map<Node, Node> map = new HashMap<>();

    // 1. 复制所有节点并存储映射关系
    Node cur = head;
    while (cur != null) {
        map.put(cur, new Node(cur.val));
        cur = cur.next;
    }

    // 2. 根据原链表的连接情况，连接新链表
    cur = head;
    while (cur != null) {
        // map.get(cur) 得到的是新节点
        // map.get(cur.next) 得到的是原链表 next 对应的新节点
        map.get(cur).next = map.get(cur.next);
        map.get(cur).random = map.get(cur.random);
        cur = cur.next;
    }
    return map.get(head);
}
```

---

## 4. 进阶解法：原地修改法 (空间复杂度 O(1))
如果不允许使用额外的哈希表，可以通过“节点交错”的方式。

### 核心步骤：
1.  **复制并插入**：将每个新节点插入到对应的原节点后面（`A -> a -> B -> b -> C -> c`）。
2.  **设置随机指针**：新节点的 `random` 就是原节点 `random` 的 `next`（即 `a.random = A.random.next`）。
3.  **拆分链表**：将长链表拆分为原链表和新链表，恢复原貌。

---

## 5. 总结
**深拷贝 (Deep Copy)** 的本质是：**不仅要复制对象本身的值，还要递归地复制对象所引用的所有对象**，确保新旧两个数据结构在内存中完全独立，互不干扰。
