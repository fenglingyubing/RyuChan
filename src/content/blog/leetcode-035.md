---
title: 合并K个升序链表
description: leetcode刷题第二十五天
pubDate: 2026-04-02T15:14
image: /images/leetcode-035/59c8ca59cde46d2a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
给你一个链表数组 `lists`，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

这题对应 LeetCode 23：合并 K 个升序链表。

你的思路“每两个链表合并一次”，完全可行，而且这就是这题的经典做法之一。

重点就在于把问题拆成：

- 先解决“两个有序链表怎么合并”
- 再解决“很多个链表怎么递归地两两合并”

---

## 一、先说结论：你的思路可以做

可以把 `k` 个链表的合并，看成下面这个过程：

1. 先把链表数组分成两半
2. 左边合并成一个有序链表
3. 右边合并成一个有序链表
4. 最后再把左右两个有序链表合并

这其实和归并排序的思想很像。

也就是说，不是一次只盯着所有链表一起处理，而是：

**把大问题拆成左右两个小问题，小问题解决后再合并。**

---

## 二、递归到底在做什么

很多人一看到递归就容易懵，其实你可以只记这一句：

**函数的作用是什么，就假设它已经能做到这个事。**

比如我们定义一个函数：

```java
merge(lists, left, right)
```

它的含义是：

`把 lists[left...right] 这些链表，全部合并成一个升序链表并返回`

那我们就不用一开始想太复杂，只要想：

### 情况 1：只剩一个链表

如果 `left == right`，说明这一段里只有一个链表。

那就不用合并，直接返回这个链表本身。

```java
if (left == right) {
    return lists[left];
}
```

### 情况 2：一个链表都没有

比如传进来的是空数组，或者某一段无效。

那就返回 `null`。

```java
if (left > right) {
    return null;
}
```

### 情况 3：有多个链表

那就从中间切开：

```java
int mid = left + (right - left) / 2;
```

然后：

- 左边那一半先合并
- 右边那一半再合并
- 再把左右结果合并起来

```java
ListNode l1 = merge(lists, left, mid);
ListNode l2 = merge(lists, mid + 1, right);
return mergeTwoLists(l1, l2);
```

这就是递归的核心。

---

## 三、为什么这样写是对的

比如有 4 个链表：

```text
lists[0], lists[1], lists[2], lists[3]
```

第一次递归会拆成：

```text
左边：lists[0], lists[1]
右边：lists[2], lists[3]
```

然后左边继续拆：

```text
lists[0]
lists[1]
```

这时每部分都只有 1 个链表了，直接返回。

接着把：

```text
lists[0] 和 lists[1]
```

合并成一个有序链表。

右边同理，把：

```text
lists[2] 和 lists[3]
```

合并成一个有序链表。

最后再把左右两个大链表合并。

所以整个过程其实就是：

```text
4个链表
-> 拆成 2组
-> 每组拆成 1个
-> 两两合并
-> 再继续往上合并
```

---

## 四、你真正要会的只有两个函数

这题本质上只要写两个函数：

### 1. 合并两个有序链表

这个你可以把它当成基础模块。

谁小就接谁，最后把剩下的部分接上。

### 2. 递归合并多个链表

作用是：

- 把链表数组分成两半
- 左边递归合并
- 右边递归合并
- 再调用“合并两个有序链表”

---

## 五、Java 代码

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) {
            return null;
        }
        return merge(lists, 0, lists.length - 1);
    }

    private ListNode merge(ListNode[] lists, int left, int right) {
        if (left > right) {
            return null;
        }
        if (left == right) {
            return lists[left];
        }

        int mid = left + (right - left) / 2;
        ListNode l1 = merge(lists, left, mid);
        ListNode l2 = merge(lists, mid + 1, right);

        return mergeTwoLists(l1, l2);
    }

    private ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;

        while (a != null && b != null) {
            if (a.val <= b.val) {
                cur.next = a;
                a = a.next;
            } else {
                cur.next = b;
                b = b.next;
            }
            cur = cur.next;
        }

        if (a != null) {
            cur.next = a;
        } else {
            cur.next = b;
        }

        return dummy.next;
    }
}
```

---

## 六、逐步讲这段代码怎么理解

### `mergeKLists`

```java
public ListNode mergeKLists(ListNode[] lists) {
    if (lists == null || lists.length == 0) {
        return null;
    }
    return merge(lists, 0, lists.length - 1);
}
```

这是入口函数。

- 如果数组为空，直接返回 `null`
- 否则就去合并整个区间 `0 ~ lists.length - 1`

### `merge(lists, left, right)`

```java
private ListNode merge(ListNode[] lists, int left, int right)
```

这个函数表示：

**把 `lists[left]` 到 `lists[right]` 这些链表合并成一个链表。**

#### 第一种情况：`left > right`

```java
if (left > right) {
    return null;
}
```

表示这一段没有链表。

#### 第二种情况：`left == right`

```java
if (left == right) {
    return lists[left];
}
```

表示只有一个链表，不需要合并，直接返回。

#### 第三种情况：有多个链表

```java
int mid = left + (right - left) / 2;
```

先求中点，避免直接写 `(left + right) / 2` 的溢出风险。

```java
ListNode l1 = merge(lists, left, mid);
ListNode l2 = merge(lists, mid + 1, right);
```

递归去合并左半部分和右半部分。

注意这里你可以这样理解：

- `l1` 是“左边这一堆链表合并后的结果”
- `l2` 是“右边这一堆链表合并后的结果”

最后：

```java
return mergeTwoLists(l1, l2);
```

把两个结果再合并。

### `mergeTwoLists(a, b)`

这个函数就是普通的“合并两个有序链表”。

```java
ListNode dummy = new ListNode(0);
ListNode cur = dummy;
```

这里用一个虚拟头结点 `dummy`，方便统一处理头结点。

```java
while (a != null && b != null) {
    if (a.val <= b.val) {
        cur.next = a;
        a = a.next;
    } else {
        cur.next = b;
        b = b.next;
    }
    cur = cur.next;
}
```

循环比较：

- `a` 小，就接 `a`
- `b` 小，就接 `b`
- 每接一个，`cur` 往后走

最后其中一个链表走完了，另一个一定还是有序的，可以直接接上：

```java
if (a != null) {
    cur.next = a;
} else {
    cur.next = b;
}
```

最终返回：

```java
return dummy.next;
```

---

## 七、手推一个例子

假设：

```text
lists = [
  1->4->5,
  1->3->4,
  2->6
]
```

### 第一步

调用：

```text
merge(lists, 0, 2)
```

中点是 `1`，拆成：

```text
merge(lists, 0, 1)
merge(lists, 2, 2)
```

### 第二步

`merge(lists, 2, 2)` 只有一个链表，直接返回：

```text
2->6
```

然后看左边：

```text
merge(lists, 0, 1)
```

再拆成：

```text
merge(lists, 0, 0) -> 1->4->5
merge(lists, 1, 1) -> 1->3->4
```

然后把这两个合并，得到：

```text
1->1->3->4->4->5
```

### 第三步

最后再把：

```text
1->1->3->4->4->5
和
2->6
```

合并，得到：

```text
1->1->2->3->4->4->5->6
```

---

## 八、复杂度分析

设总节点数是 `n`，链表个数是 `k`。

- 时间复杂度：`O(n log k)`
- 空间复杂度：`O(log k)`，主要是递归栈

为什么是 `log k`？

因为每次都把链表数组拆成两半，递归层数就像二叉树高度一样，是 `log k`。

---

## 九、和“从头到尾一个一个合并”有什么区别

有些人会写成：

```text
先合并 lists[0] 和 lists[1]
再拿结果去合并 lists[2]
再拿结果去合并 lists[3]
...
```

这个也能做，但是效率通常不如“分治递归”。

因为前面的结果链表会越来越长，后面每次合并都会更重。

而分治法会尽量让每次合并的两边规模更接近，所以更高效。

---

## 十、你写题时可以这样记

把这题记成一句口诀：

**多个有序链表不好一起合，就先分成两半，分别合好，再把两个结果合起来。**

写代码时就记住这两层：

1. `mergeTwoLists`：解决两个链表怎么合并
2. `merge`：解决多个链表怎么拆分并递归合并

---

## 十一、如果你不熟递归，最该盯住哪一句

就盯住这一句：

```java
ListNode l1 = merge(lists, left, mid);
ListNode l2 = merge(lists, mid + 1, right);
```

它的意思不是“我现在要自己手动算出所有细节”。

而是：

**先相信递归函数可以帮我把左边那一堆排好，也可以帮我把右边那一堆排好。**

你当前这一层只负责：

- 分成两边
- 拿到左右答案
- 再合并左右答案

这样递归就没那么吓人了。

---

## 十二、最后帮你压缩成一句话

你的思路完全可以，而且非常标准：

**用递归把 `k` 个链表不断拆成两半，直到每部分只剩一个链表，再两两合并回来。**

如果你愿意，我下一步可以继续帮你做两件事里的任意一个：

1. 画一张递归拆分图，带你完整手推一遍
2. 再给你写一个“非递归版”的做法，方便你对比理解
