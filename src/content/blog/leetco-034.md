---
title: 排序链表
description: leetcode刷题第二十五天
pubDate: 2026-04-02T14:34
image: /images/leetco-034/6a02712035795e1c.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
给你链表的头结点 `head`，请将其按升序排列并返回排序后的链表。

这题对应 LeetCode 148：排序链表。

## 先说你想到的双重循环为什么不太合适

你想到的双重循环，其实就是类似：

- 外层遍历每个节点
- 内层再遍历后面的节点
- 如果顺序不对就交换

这个思路本质上接近冒泡排序 / 选择排序，时间复杂度通常是 `O(n^2)`。

如果链表很长，就会比较慢。

而这道题的经典做法是：

## 用归并排序

因为：

- 数组适合快速排序、堆排序这类随机访问操作
- 链表不适合频繁按下标访问
- 链表非常适合“从中间拆开，再合并两个有序链表”

所以这题最标准的思路就是：

1. 用快慢指针把链表从中间断开
2. 左边排序
3. 右边排序
4. 把两个有序链表合并

这就是链表版的归并排序。

---

## 整体思路

### 1. 递归终止条件

如果链表为空，或者只有一个节点，那么它本身就是有序的，直接返回。

```text
head == null 或者 head.next == null
```

### 2. 找中点并断开

用快慢指针：

- `slow` 一次走一步
- `fast` 一次走两步

当 `fast` 走到末尾时，`slow` 大致就在中间。

为了把链表断成两半，通常还会准备一个 `pre`，记录 `slow` 的前一个节点。

最后执行：

```text
pre.next = null
```

这样链表就被拆成：

- 左半部分：`head`
- 右半部分：`slow`

### 3. 递归排序左右两边

```text
left = sortList(head)
right = sortList(slow)
```

### 4. 合并两个有序链表

这一步和“合并两个有序链表”那题几乎一模一样。

比较两个链表当前节点值：

- 谁小，就先接谁
- 然后对应指针后移
- 最后把剩余部分直接接上

---

## 为什么这题适合归并排序

因为归并排序的两个关键动作：

1. 拆分
2. 合并

都非常适合链表：

- 拆分：快慢指针找中点
- 合并：改 `next` 指针就行，不需要挪动大量元素

所以它比双重循环更自然，也更高效。

---

## 复杂度分析

- 时间复杂度：`O(n log n)`
- 空间复杂度：`O(log n)`（递归栈）

如果面试官追问“能不能做到常数级空间”，那是进阶要求，一般先把递归版写出来最重要。

---

## 举个例子

链表：

```text
4 -> 2 -> 1 -> 3
```

### 第一次拆分

分成：

```text
4 -> 2
1 -> 3
```

### 继续拆分

左边：

```text
4
2
```

右边：

```text
1
3
```

### 分别排序后

```text
2 -> 4
1 -> 3
```

### 最后合并

```text
1 -> 2 -> 3 -> 4
```

---

## 你写题时可以这样记

你可以把这题背成下面这个模板：

### 模板一：分

- 快慢指针找中点
- 从中间断开

### 模板二：治

- 递归排序左半边
- 递归排序右半边

### 模板三：合

- 合并两个有序链表

只要想到“链表排序”，优先联想“归并排序”。

---

## Java 代码参考

```java
class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        ListNode slow = head;
        ListNode fast = head;
        ListNode pre = null;

        while (fast != null && fast.next != null) {
            pre = slow;
            slow = slow.next;
            fast = fast.next.next;
        }

        pre.next = null;

        ListNode left = sortList(head);
        ListNode right = sortList(slow);

        return merge(left, right);
    }

    private ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;

        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                cur.next = l1;
                l1 = l1.next;
            } else {
                cur.next = l2;
                l2 = l2.next;
            }
            cur = cur.next;
        }

        if (l1 != null) {
            cur.next = l1;
        }
        if (l2 != null) {
            cur.next = l2;
        }

        return dummy.next;
    }
}
```

---

## 最后帮你压缩成一句话

这题的核心不是“双重循环比较”，而是：

**把链表不断二分，分别排好序，再把两个有序链表合并。**

如果你愿意，我下一步可以继续帮你做两件事里的任意一个：

1. 画图带你手推一遍整个递归过程
2. 按面试写法，逐行讲这段代码为什么这么写
