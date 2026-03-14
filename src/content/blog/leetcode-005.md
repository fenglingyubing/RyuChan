---
title: 回文链表
description: LeetCode刷题第五天
pubDate: 2026-03-13T09:03
image: /images/leetcode-005/cec7f017a7e8ae2b.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
badge: ''
---
```java
class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while(fast != null && fast.next != null){
            slow = slow.next;
            fast = fast.next.next;
        }

        if(fast != null){
            slow = slow.next;
        }

        ListNode prev = null;
        while(slow != null){
            ListNode next = slow.next;
            slow.next = prev;
            prev = slow;
            slow = next;
        }

        while(prev != null){
            if(head.val != prev.val){
                return false;
            }
            head = head.next;
            prev = prev.next;
        }
        return true;
    }
}
```
# 思路分析：
通过将反转后半段链表与前半段列表进行比较，以此来判断链表是否为回文链表。

```java
ListNode slow = head;
ListNode fast = head;

while(fast != null && fast.next != null){
      slow = slow.next;
      fast = fast.next.next;
}
```
这段是通过快慢指针找到后半段链表的起点
- 对偶数长度，slow 最后停在后半段起点
- 对奇数长度，slow 最后停在正中间节点

```java
if(fast != null){
      slow = slow.next;
}
```
跳过奇数长链表的中间节点

```java
ListNode prev = null;
      while(slow != null){
      	ListNode next = slow.next;
        slow.next = prev;
        prev = slow;
        slow = next;
}
```
反转后半段列表

```java
while(prev != null){
      if(head.val != prev.val){
                return false;
        }
        head = head.next;
        prev = prev.next;
}
```
将前半段链表与反转后的后半段链表进行比较，如果节点的值不相等，则不是回文链表
> 不能直接比较两个节点对象本身，因为那比较的是两个节点是否是同一个对象，而不是它们存的值是否相等