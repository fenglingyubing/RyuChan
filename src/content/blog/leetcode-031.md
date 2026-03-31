---
title: 两两交换链表中的节点
description: leetcode刷题第二十三天
pubDate: 2026-03-31T11:07
image: /images/leetcode-031/03df798ffd3ba07e.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 两两交换链表中的节点 - 思路误区总结

## 1. 题目回顾
**题目**：给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

---

## 2. 原始代码分析 (存在误区)

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode left = head;
        ListNode right = head.next;
        ListNode cur = head;
        while(right != null && right.next != null){
             cur.next = right;
             cur = cur.next;
             cur.next = left;
             cur = cur.next;
             left = left.next.next;
             right = right.next.next;
        }

        return dummy.next;
    }
}
```

### 核心误区归纳：

1. **断链与成环 (Lost Links & Cycles)**：
   - 在执行 `cur.next = left` 时，如果 `cur` 此时已经是 `right`（即节点 2），这会让 `2.next = 1`。
   - 而在此之前你没有保存节点 1 原本指向节点 3 的引用。这会导致：
     - **成环**：节点 1 指向 2，节点 2 指向 1，形成死循环。
     - **断链**：无法通过 `left.next.next` 找到后续节点，因为 `left.next` 已经被改动了。

2. **虚拟头节点 (Dummy Node) 未生效**：
   - 代码创建了 `dummy`，但始终没有执行 `dummy.next = head` 或在交换后让 `dummy.next` 指向新的头节点。
   - 因此 `return dummy.next` 永远返回 `null`。

3. **循环条件逻辑脱节**：
   - `while(right != null && right.next != null)` 会导致如果链表只有两个节点（如 `1 -> 2`），循环根本不会进入，从而跳过了唯一的交换机会。

4. **前驱节点丢失**：
   - 交换 A 和 B 时，不仅要改 A 和 B 的指向，**A 前面的那个节点（前驱）也必须指向 B**。你的代码中 `cur` 的移动逻辑并没有正确维护这个前驱关系。

---

## 3. 正确逻辑：三步交换法

假设要交换 `node1` 和 `node2`，它们的前驱节点是 `prev`：

1. **记录连接**：保存 `node2` 后面的节点 `nextGroup = node2.next`。
2. **重绘指向**：
   - `prev.next = node2` （前驱指向新头）
   - `node2.next = node1` （交换方向）
   - `node1.next = nextGroup` （连回后续）
3. **移动前驱**：`prev` 移动到 `node1` 的位置，开始下一对交换。

---

## 4. 正确代码实现

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapPairs(ListNode head) {
        // 1. 初始化虚拟头节点，它是所有交换操作的“锚点”
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        // 2. prev 是每一组待交换节点的前驱
        ListNode prev = dummy;

        // 3. 只有当后面至少还有两个节点时，才需要交换
        while (prev.next != null && prev.next.next != null) {
            ListNode node1 = prev.next;
            ListNode node2 = prev.next.next;

            // --- 核心交换步骤 ---
            // 交换前：prev -> node1 -> node2 -> nextNode
            
            node1.next = node2.next; // step 1: node1 指向 3 (此时连接：2->3, 1->3)
            node2.next = node1;      // step 2: node2 指向 1 (此时连接：2->1->3)
            prev.next = node2;       // step 3: prev 指向 2  (此时连接：prev->2->1->3)

            // --- 移动指针 ---
            // 交换后顺序是 prev -> 2 -> 1，下一组的前驱应该是 1
            prev = node1; 
        }

        return dummy.next;
    }
}
```

## 5. 学习建议
- **画图**：链表题必须动笔。画出节点和箭头，每修改一行代码，就在图上更新箭头的指向。
- **哨兵位**：使用 `dummy` 节点可以极大地简化头节点可能发生变化的逻辑。
