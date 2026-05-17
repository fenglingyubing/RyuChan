---
title: 移除元素
description: ''
pubDate: 2026-05-17T12:24
image: /images/leetcode-106/766a304988c08aac.webp
draft: false
tags: []
categories: []
---
# 27. 移除元素

## 题目描述

给定一个整数数组 `nums` 和一个整数 `val`。

要求：

> 原地移除数组中所有等于 `val` 的元素，并返回剩余元素的数量。

假设数组中不等于 `val` 的元素数量是 `k`，那么需要保证：

- `nums` 的前 `k` 个元素都不等于 `val`
- 前 `k` 个元素的顺序可以改变
- `nums` 后面的元素不重要
- 返回 `k`

---

## 一、你的解法思路

你的代码是：

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int left = 0;
        int right = nums.length - 1;
        while(left <= right){
            if (nums[left] == val){
                swap(nums, left, right);
                right--;
            }else{
                left++;
            }
        }

        return nums.length - right + 1;
    }

    private void swap(int[] nums, int left, int right){
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
    }
}
```

这个思路本身是可以的。

因为题目说：

> 元素的顺序可以改变。

所以可以用左右指针：

- `left` 从左往右找等于 `val` 的元素
- `right` 从右往左表示当前可交换的位置
- 如果 `nums[left] == val`，就把它换到右边
- 如果 `nums[left] != val`，说明这个元素应该保留，`left++`

---

## 二、你的代码哪里不对

问题出在返回值：

```java
return nums.length - right + 1;
```

这个返回值不对。

循环结束时，一定满足：

```text
left > right
```

此时数组大致被分成两部分：

```text
[0 ... right]          不等于 val 的元素
[right + 1 ... end]    被移除的元素或不重要的元素
```

所以不等于 `val` 的元素数量应该是：

```java
right + 1
```

也可以返回：

```java
left
```

因为循环结束时 `left == right + 1`。

---

## 三、错误示例

以这个用例为例：

```text
nums = [3, 2, 2, 3]
val = 3
```

执行过程：

```text
left = 0, right = 3
nums[left] = 3，需要移除
交换 nums[0] 和 nums[3]
right--
```

数组还是：

```text
[3, 2, 2, 3]
```

继续：

```text
left = 0, right = 2
nums[left] = 3，需要移除
交换 nums[0] 和 nums[2]
right--
```

数组变成：

```text
[2, 2, 3, 3]
```

继续：

```text
left = 0, right = 1
nums[left] = 2，不需要移除
left++
```

继续：

```text
left = 1, right = 1
nums[left] = 2，不需要移除
left++
```

循环结束：

```text
left = 2
right = 1
```

正确答案应该是：

```text
k = 2
```

但是你的返回值是：

```java
nums.length - right + 1
= 4 - 1 + 1
= 4
```

所以会返回错误结果。

---

## 四、修正后的 Java 代码

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            if (nums[left] == val) {
                swap(nums, left, right);
                right--;
            } else {
                left++;
            }
        }

        return left;
    }

    private void swap(int[] nums, int left, int right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
    }
}
```

---

## 五、为什么返回 `left`

循环结束后：

```text
left = 不等于 val 的元素数量
```

例如最终数组是：

```text
[2, 2, 3, 3]
```

前两个元素是不等于 `val` 的有效元素：

```text
[2, 2]
```

所以：

```text
left = 2
```

返回 `left` 就是返回有效元素个数。

---

## 六、能不能返回 `right + 1`

也可以。

因为循环结束时：

```text
left = right + 1
```

所以这两种写法等价：

```java
return left;
```

```java
return right + 1;
```

更推荐返回 `left`，因为 `left` 的含义更直观：

> 前 `left` 个元素都是保留下来的元素。

---

## 七、复杂度分析

- 时间复杂度：`O(n)`
- 空间复杂度：`O(1)`

整个过程只使用了两个指针，并且在原数组上修改。

---

## 八、总结

你的双指针交换思路是正确的。

错误点只有一个：

```java
return nums.length - right + 1;
```

应该改成：

```java
return left;
```

或者：

```java
return right + 1;
```

这题的关键是理解循环结束后的数组区间：

```text
[0 ... left - 1]       保留下来的元素
[left ... end]         不重要的元素
```
