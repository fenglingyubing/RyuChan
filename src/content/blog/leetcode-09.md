---
title: 环形链表2
description: leetcode刷题第八天
pubDate: 2026-03-16T13:56
image: /images/leetcode-09/4c45799fabe3dac8.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
这次要求返回的是链表节点，所以在解法上还是可以采用上次的思路一
# 思路一：
采用HashSet来存储出现过的节点，如果是环形链表则会出现重复，此时返回重复的节点，即可，但是改方法执行耗时过长
```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> list = new HashSet<>();
        ListNode cur = head;
        while(cur != null && cur.next != null){
            if(list.contains(cur)){
                return cur;
            }else {
                list.add(cur);
            }
            cur = cur.next;
        }

        return null;
    }
}
```