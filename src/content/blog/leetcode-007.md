---
title: 合并两个有序链表
description: LeetCode刷题第七天
pubDate: 2026-03-15T11:46
image: /images/leetcode-007/5c485fa0a9637229.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 思路分析：
1. 先定义一个初始的头节点
2. 定义一个指针,并指向头节点
3. 定义两个链表的头节点
4. 循环将两个链表节点按照从小到大的顺序插入到头节点后
5. 返回头节点的下一个节点
```
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        //值是多少不重要，主要是要定义一个头节点
		ListNode dummy = new ListNode(-1);
		ListNode cur = dummy;
		
		ListNode p1 = list1;
		ListNode p2 = list2;
		
		while(p1 != null && p2 != null){
			if(p1.val <= p2.val){
				cur.next = p1;
				p1 = p1.next;
				cur = cur.next;
			}else {
				cur.next = p2;
				p2 = p2.next;
				cur = cur.next;
			}
		}
		
		if(p1 != null) {
			cur.next = p1;
		}
		if(p2 != null) {
			cur.next = p2;
		}
		
		return dummy.next;
  	}
}
```