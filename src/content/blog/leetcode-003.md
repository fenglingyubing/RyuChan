---
title: 相交链表
description: LeetCode刷题第三天
pubDate: 2026-03-11T13:33
image: /images/leetcode-003/42248ac402eebf07.png
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 相交链表
## 思路问题
思路有问题，而且不止一处。关键问题是把“相交”理解成了“两个链表同步往后走时，某一时刻看起来一样”，但链表相交不是这样判定的。
```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
       while(true){
        if(headA.next == headB.next){
            return headA;
        }
        headA = headA.next;
        headB = headB.next;
       } 
        return headA;
    }
}
```

1. 比较错了对象
```java
if(headA.next == headB.next)
```

这表示“比较两个节点的下一个节点是否相同”。
但题目要找的是“当前节点是否就是相交节点”，应该比较：
```java
if (headA == headB)
```

2. 返回错了节点
```java
headA.next == headB.next
```

那说明相同的是“下一个节点”，不是 headA 本身,而返回的是headA本身
```java
return headA;
```

3. 不能同步一起走
你默认 A 和 B 每次各走一步就能对齐，这是错误的。
例如：
	- A: 4 -> 1 -> 8 -> 4 -> 5
	- B: 5 -> 6 -> 1 -> 8 -> 4 -> 5
A 和 B 长度不同，起点也不同。
它们不是“同一层”开始的，所以不能直接一边一步地同时比较。

4. 会空指针
如果某个链表走到最后：
```java
headA = headA.next;
```

当 headA 已经是 null 时，再写：
```java
headA.next;
```
就会直接报 NullPointerException

5. while(true) 可能死循环
如果两个链表根本不相交，你这段代码永远不会停。

---

# 思路一：
正确思路一：最容易理解的

先分别求两个链表长度：

lenA
lenB
然后让长的那个先走几步，走到和短链表“剩余长度一致”为止。
接着两个再一起走，这样才能在相交点对齐。

例如：
- A 长 5
- B 长 6
那就让 B 先走 1 步。
之后 A、B 再一起走，每次比较：
```java
if (pA == pB)
```
**实现代码**
```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        int lenA = getLength(headA);
        int lenB = getLength(headB);

        ListNode pA = headA;
        ListNode pB = headB;

        while (lenA > lenB) {
            pA = pA.next;
            lenA--;
        }

        while (lenB > lenA) {
            pB = pB.next;
            lenB--;
        }

        while (pA != null && pB != null) {
            if (pA == pB) {
                return pA;
            }
            pA = pA.next;
            pB = pB.next;
        }

        return null;
    }

    private int getLength(ListNode head) {
        int len = 0;
        while (head != null) {
            len++;
            head = head.next;
        }
        return len;
    }
}
```
```java
//相交判断是：
pA == pB
//不是：
pA.val == pB.val
//也不是：
pA.next == pB.next
```

---

# 思路二：
双指针换头
核心想法不是“先算长度”，而是：

指针 pA 先走 A，再走 B
指针 pB 先走 B，再走 A
这样两个人走过的总路程会一样，最终：

如果有交点，就在交点相遇
如果没交点，就一起变成 null

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode pA = headA;
        ListNode pB = headB;

        while (pA != pB) {
            if (pA == null) {
                pA = headB;
            } else {
                pA = pA.next;
            }

            if (pB == null) {
                pB = headA;
            } else {
                pB = pB.next;
            }
        }

        return pA;
    }
}
```
为什么这样能行？

假设：
	- A: 4 -> 1 -> 8 -> 4 -> 5
	- B: 5 -> 6 -> 1 -> 8 -> 4 -> 5

其中公共部分是：
- 8 -> 4 -> 5

设：
- A 独有部分长度是 a
- B 独有部分长度是 b
- 公共部分长度是 c
那么：
	A 总长 = a + c
	B 总长 = b + c
pA 走的路：A 走完再走 B，总共 a + c + b + c 
pB 走的路：B 走完再走 A，总共 b + c + a + c

总长度一样。
所以当两边都补齐了对方那一段“长度差”之后，就会在同一个位置相遇。

你可以把它理解成：

pA 少走了 B 前面的那段，就去 B 补
pB 少走了 A 前面的那段，就去 A 补
最后两人就对齐了。
这个方法的本质就是：通过换头，自动把长度差补回来。

如果没有交点：

pA 最后会走到 null
pB 最后也会走到 null

