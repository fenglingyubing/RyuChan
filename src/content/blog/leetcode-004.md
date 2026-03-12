---
title: 反转链表
description: LeetCode刷题第四天
pubDate: 2026-03-12T12:50
image: /images/leetcode-004/8b37cdad80b46e14.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 思路：
通过将遍历链表，将头节点指向一个空节点，然后下一个节点指向上一个节点，已达到反转链表的效果
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;

        while (cur != null){
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }

        return prev;
    }
}
```
