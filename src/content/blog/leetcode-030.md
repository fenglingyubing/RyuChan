---
title: 删除链表的倒数第 N 个结点
description: leetcode刷题第二十二天
pubDate: 2026-03-30T19:50
image: /images/leetcode-030/1779b9d68a858bd7.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 题目：
给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
> 例如：
```java
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

# 思路分析：
因为这道题是让我们删除倒数的第n个节点，所以我们可以使用快慢指针法
1. 定义一个快指针`fast` 和 一个慢指针`slow`
2. 让快指针先走n步
3. 再让快慢指针一起走，当快指针走到结尾时，慢指针就刚好停在待删除节点的上一个节点


# 完整代码：
```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode slow = dummy;
        ListNode fast = dummy;

        for (int i = 0; i < n; i++) {
            fast = fast.next;
        }

        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```