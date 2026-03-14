---
title: 环形链表
description: LeetCode刷题第六天
pubDate: 2026-03-14T12:03
image: /images/leetcode-006/40ad5134b26b9b8c.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 思路一：
通过循环链表，如果节点在HashSet中找不到则存入HashSet中，如果已经存在则直接返回true，循环结束返回false；

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> set = new HashSet<>();
        ListNode p = head;
        while(p != null && p.next != null){
            if(set.contains(p)){
                return true;
            }else {
                set.add(p);
            }
            p = p.next;
        }
        return false; 
    }
}
```

> 注意点：p != null一定要比p.next ！= null 先判断，不然程序会抛空指针异常

# 思路二：
快慢指针：定义一个慢指针和一个快指针，如果这是一个环形列表，则快指针一定会追上慢指针
```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        //快慢指针解法
        ListNode low = head;
        ListNode fast = head;

        while(fast != null && fast.next != null){
            low = low.next;
            fast = fast.next.next;
            
            if(low == fast){
                return true;
            }
        }

        return false;
    }
}
```

常见误区：
if判断一定要在指针移动后进行判断，因为如果链表之中只有一个节点，此时先判断就会返回true，因为fast和low一定相等，然而一个节点的是不能算作环形链表的