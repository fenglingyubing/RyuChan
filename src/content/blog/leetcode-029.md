---
title: 两数相加（链表）
description: leetcode刷题第二十二天
pubDate: 2026-03-30T19:06
image: /images/leetcode-029/a7503ba194a35fac.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 两数相加 (Add Two Numbers) - 算法排错与总结

## 1. 题目背景
给你两个**非空**的链表，表示两个非负的整数。它们每位数字都是按照**逆序**的方式存储的，并且每个节点只能存储**一位**数字。
请你将两个数相加，并以相同形式返回一个表示和的链表。
*(假设除了数字 0 之外，这两个数都不会以 0 开头)*

---

## 2. 初始思路与存在的问题

### 2.1 初始源码（基于 List 集合转存）
```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode p1 = l1;
        ListNode p2 = l2;

        List<Integer> listOne = list(p1);
        List<Integer> listTwo = list(p2);

        List<Integer> res = new ArrayList<>();
        if(listOne.size() > listTwo.size()){
            addList(listOne,res);
        }else{
            addList(listTwo,res);
        }
        int carry = 0;
        int len = Math.min(listOne.size(),listTwo.size());
        if(listOne.size() == len){
            for(int i = 0; i < len; i++){
                int sum = listOne.get(i) + res.get(i);
                if(sum >= 10){
                    sum = sum % 10;
                    if(i < len - 1){
                        res.add(res.get(i + 1) + 1);
                    }else{
                        res.add(1);
                    }
                }
                res.add(i,sum);
            }
        }else{
            for(int i = 0; i < len; i++){
                int sum = listTwo.get(i) + res.get(i);
                if(sum >= 10){
                    sum = sum % 10;
                    if(i < len - 1){
                        res.add(res.get(i + 1) + 1);
                    }else{
                        res.add(1);
                    }
                }
                res.add(i,sum);
            }
        }
    }

    public List<Integer> list(ListNode node){
        List<Integer> list = new ArrayList<>();
        while(node != null && node.next != null){
            list.add(node.val);
            node = node.next;
        }
        return list;
    }

    public void addList(List<Integer> list,List<Integer> res){
        for(int i = 0; i < list.size(); i++){
            res.add(list.get(i));
        }
    }
}
```

### 2.2 核心问题分析
1. **丢失尾节点**：`while(node != null && node.next != null)` 会导致链表的最后一个节点无法进入循环被加入到 List 中。
2. **集合 API 误用导致数据错位**：
   - 企图通过 `res.add(res.get(i + 1) + 1)` 来修改下一位实现进位，但 `add` 方法是在集合末尾追加，而不是修改指定索引。修改应当用 `set(index, element)`。
   - `res.add(i, sum)` 会把原有的元素往后挤压，导致数据完全错乱（因为 `res` 初始化时已经用较长链表的数据填充过了）。
3. **进位逻辑（Carry）严重缺陷**：
   - 无法处理**连续进位**。例如处理 `999 + 1`，加1后产生进位，进位加到下一位如果又变成10，代码中并没有继续向前进位的逻辑。
   - 存在**数组越界风险**。如果两个链表一样长（例如 `[5]` 和 `[5]`），`i + 1` 会超出集合的长度，直接引发 `IndexOutOfBoundsException`。
4. **空间复杂度高**：引入额外的 `List` 进行存储完全没有必要，因为题目本身的逆序设计就是为了方便直接相加。引入集合徒增了 $O(N)$ 的空间复杂度。

---

## 3. 标准最优解法：双指针 + 虚拟头节点

题目之所以将数字**逆序**存储在链表中（即个位在表头，十位在第二个节点），就是为了**方便从头到尾同时遍历两个链表进行按位相加**。

### 3.1 核心思路
1. **虚拟头节点（Dummy Node）**：创建一个值为0的假节点，用来方便地连接结果链表，最后返回 `dummy.next`。
2. **进位变量（Carry）**：维护一个 `carry` 变量，用来保存上一位的进位值（0或1）。
3. **统一遍历**：只要 `l1` 没走完、`l2` 没走完，或者最后还有进位 `carry != 0`，就继续遍历。避免了繁杂的长度比较和对齐。

### 3.2 优化后源码
```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            if (l1 != null) {
                carry += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                carry += l2.val;
                l2 = l2.next;
            }
            cur = cur.next = new ListNode(carry % 10);
            carry /= 10;
        }
        return dummy.next;
    }
}
```

## 4. 总结
- **处理链表问题时，能直接操作指针就尽量直接操作**，不要依赖数组或集合转存，这样能保持 $O(1)$ 的额外空间复杂度。
- **关于进位的处理范式**：在处理大数加法或链表加法时，`sum = val1 + val2 + carry` -> `carry = sum / 10` -> `val = sum % 10` 是一套固定的、最稳妥的公式，它可以完美解决任何进位及连续进位的问题。
- **处理不等长结构**：使用 `(l1 != null) ? l1.val : 0` 的方式相当于将较短的数据用 0 补齐，逻辑更加统一优雅，不需要写一堆 `if-else` 去分别处理。