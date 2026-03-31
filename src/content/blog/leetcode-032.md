---
title: K 个一组翻转链表
description: leetcode刷题第二十三天
pubDate: 2026-03-31T11:42
image: /images/leetcode-032/be14424c405feb86.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# K 个一组翻转链表 (LeetCode 25)

## 题目描述
给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。

**限制条件：**
- 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
- 时间复杂度需为 $O(n)$，空间复杂度需为 $O(1)$。

---

## 核心思路：迭代法（分段处理）

解决此问题的关键在于：**将大链表拆分为一个个长度为 k 的小组，分别翻转，再将翻转后的部分正确地“缝合”回原链表。**

### 1. 哨兵节点 (Dummy Node)
创建一个 `dummy` 节点指向 `head`。它的作用是：
- 统一处理头节点的翻转逻辑。
- 方便返回最终结果 (`dummy.next`)。

### 2. 核心步骤 (循环执行)
我们将链表操作分为以下五个子步骤：

1.  **确定边界**：从当前位置（每一组的前驱节点 `pre`）向后数 $k$ 个。如果不足 $k$ 个，说明不需要翻转，直接退出。
2.  **暂存后续**：记录下一组的起始节点 `nextGroup = end.next`。
3.  **切断连接**：将当前组的最后一个节点与后续断开 (`end.next = null`)，使其成为一个独立的短链表。
4.  **局部翻转**：调用单链表翻转函数，翻转这 $k$ 个节点。
5.  **重新缝合**：
    - 将 `pre.next` 指向翻转后的新头（即原 `end`）。
    - 将翻转后的新尾（即原 `start`）指向 `nextGroup`。
6.  **指针位移**：将 `pre` 移动到当前组翻转后的末尾（即 `start`），准备处理下一组。

---

## 代码实现 (Java)

```java
/**
 * 链表节点定义
 */
public class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        // 1. 哨兵节点
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        
        ListNode pre = dummy;
        ListNode end = dummy;
        
        while (end.next != null) {
            // 2. 找到本组的末尾节点
            for (int i = 0; i < k && end != null; i++) end = end.next;
            if (end == null) break; // 剩余节点不足 k 个
            
            // 3. 记录边界与后续节点
            ListNode start = pre.next;
            ListNode nextGroup = end.next;
            
            // 4. 断开连接并翻转
            end.next = null;
            pre.next = reverse(start);
            
            // 5. 缝合：翻转后的尾部指向下一组开头
            start.next = nextGroup;
            
            // 6. 重置 pre 和 end 指针
            pre = start;
            end = pre;
        }
        
        return dummy.next;
    }

    /**
     * 常规单链表翻转
     */
    private ListNode reverse(ListNode head) {
        ListNode pre = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = pre;
            pre = curr;
            curr = next;
        }
        return pre;
    }
}
```

---

## 关键点总结
*   **指针丢失**：在翻转前必须存好 `nextGroup`，否则翻转后会丢失后续链表的引用。
*   **Dummy 节点**：永远是处理链表头变动问题的最佳实践。
*   **断开操作**：`end.next = null` 能够让子翻转函数清晰地识别边界，避免复杂的循环计数。

---
## 复杂度分析
- **时间复杂度**：$O(n)$，其中 $n$ 是链表节点个数。每个节点被访问常数次。
- **空间复杂度**：$O(1)$，仅使用了几个额外的指针变量。
