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
badge: ''
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
# 思路二：
> [一篇外网文档](https://levelup.gitconnected.com/unfold-linked-list-family-problems-part-1-of-3-b9add8bf1142#2e04)

## 1. 题目目标

给定一个链表的头节点 `head`，判断链表是否有环。

- 如果没有环，返回 `null`
- 如果有环，返回环形链表的起始节点

---

## 2. 最开始的解法：`HashSet`

### 代码思路

遍历链表时，把访问过的节点放进 `HashSet`：

- 如果当前节点已经存在于集合中，说明这个节点被第二次访问到了
- 这个节点就是进入环后第一次重复遇到的节点，也就是环的入口

### 复杂度

- 时间复杂度：`O(n)`
- 空间复杂度：`O(n)`

### 评价

这个做法的时间复杂度并不高，问题主要在于：

- 需要额外使用一个集合存储访问过的节点
- 不是这道题的最优空间解

这道题更优的标准解法是快慢指针：

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

---

## 3. 更优解法：Floyd 判圈算法 / 快慢指针

### 核心流程

1. 定义两个指针：
   - `slow` 每次走一步
   - `fast` 每次走两步
2. 如果链表有环，它们一定会在环内某处相遇
3. 相遇后，再定义一个指针 `cur = head`
4. 让 `cur` 和 `slow` 同时每次走一步
5. 它们再次相遇的位置，就是环的起始节点

---

## 4. 标准代码

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                ListNode cur = head;
                while (cur != slow) {
                    cur = cur.next;
                    slow = slow.next;
                }
                return cur;
            }
        }

        return null;
    }
}
```

### 复杂度

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

---

## 5. 我一开始的理解是否正确

我一开始的立即是：

> 定义一个 `slow` 和 `fast`，再定义一个 `cur` 指针指向头节点，然后当 `slow` 和 `fast` 相遇之后，`cur` 从头节点开始，让 `slow` 和 `cur` 同时开走，然后他们相遇的地点就是环的起始节点。

这个理解是完全正确的。

注意关键细节：

- `slow` 和 `fast` 必须先在环中相遇
- 相遇后，`slow` 保持在相遇点，不要重置
- 只新建一个 `cur = head`
- `cur` 和 `slow` 一起每次走一步

这样它们第二次相遇的位置就是环入口。

---

## 6. 数学推导：为什么第二次相遇一定在入口

### 定义三个距离

- `a`：头节点到环入口的距离
- `b`：环入口到第一次相遇点的距离
- `c`：第一次相遇点再走到环入口的距离

## 7. Gemini 的直观解释：先看最简单的一圈

Gemini 给出的一个非常适合初学时理解的方式是：

先暂时忽略多圈的情况，只看最简单的一种情况：

- `slow` 到相遇点走了 `a + b`
- `fast` 比它刚好多跑一整圈再追上

于是可以写成：

```text
2(a + b) = a + b + c + b
```

化简得：

```text
a = c
```

### 这个结论的直观含义

- 从头节点走到入口，需要走 `a`
- 从相遇点继续往前走到入口，需要走 `c`

如果刚好只有“一圈差”，那么 `a = c`

于是：

- 一个指针从 `head` 出发
- 一个指针从相遇点出发
- 两者每次都走一步

就会在环入口相遇。

### 这个思路为什么有帮助

它不是最完整的通式推导，但非常利于建立第一层直觉：

- 头到入口的距离
- 相遇点到入口的距离
- 两个等速指针最后在入口碰头

这比直接盯着 `k` 看更容易理解。

---
## 8. Gemini 对“多圈”情况的解释

Gemini 进一步把环长记为：

```text
L = b + c
```

于是公式

```text
a = c + (k - 1)(b + c)
```

就可以写成：

```text
a = c + (k - 1)L
```

这个式子的意思是：

- 从相遇点出发，先走 `c` 步，可以到达环入口
- 然后再走 `(k - 1)` 个整圈
- 即使多转很多整圈，最终仍然会回到入口

所以：

- 从头节点出发走 `a` 步，会到入口
- 从相遇点出发走 `a` 步，也会到入口

因此让 `cur` 和 `slow` 每次各走一步，它们一定会在入口相遇。

---

## 9. 这道题最该记住的结论

### 结论一

`HashSet` 解法：

- 时间复杂度也是 `O(n)`
- 但空间复杂度是 `O(n)`

所以问题不在时间，而在空间。

### 结论二

快慢指针是最优解：

- 时间复杂度 `O(n)`
- 空间复杂度 `O(1)`

### 结论三

相遇后：

- 不要重置 `slow`
- 新建 `cur = head`
- `cur` 和 `slow` 一起一步一步走
- 再次相遇的位置就是环入口
---
## 10. 一句话记忆版

先用快慢指针找到环内相遇点，再让一个指针从头节点出发，另一个指针从相遇点出发，两者每次都走一步，再次相遇的位置就是环的起始节点。
