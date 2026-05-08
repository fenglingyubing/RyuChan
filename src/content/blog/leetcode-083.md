---
title: 跳跃游戏2
description: leetcode刷题第四十八天
pubDate: 2026-05-08T14:09
image: /images/leetcode-083/1eb751f39d50b709.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# LeetCode 45. 跳跃游戏 II

## 题目描述

给定一个长度为 `n` 的 0 索引整数数组 `nums`，初始位置在下标 `0`。

每个元素 `nums[i]` 表示从下标 `i` 向后跳转的最大长度。

也就是说，如果你在下标 `i` 处，可以跳到任意下标 `i + j`：

```text
0 <= j <= nums[i]
i + j < n
```

返回到达下标 `n - 1` 的**最小跳跃次数**。

题目保证一定可以到达最后一个下标。

**示例：**

```text
输入：nums = [2,3,1,1,4]
输出：2
解释：
第 1 次从下标 0 跳到下标 1；
第 2 次从下标 1 跳到最后一个下标。

输入：nums = [2,3,0,1,4]
输出：2
解释：
第 1 次从下标 0 跳到下标 1；
第 2 次从下标 1 跳到最后一个下标。
```

---

## 和 55. 跳跃游戏的区别

55 题问的是：

```text
能不能到达最后一个下标？
```

所以只需要维护：

```text
当前最远能到哪里
```

45 题问的是：

```text
最少跳几次能到达最后一个下标？
```

所以不仅要知道最远能到哪里，还要知道：

```text
什么时候必须增加一次跳跃次数
```

---

## 错误思路：每次都跳最远

这题也不能简单地写成：

```java
i += nums[i];
count++;
```

原因和 55 题类似：

> `nums[i]` 表示最多能跳多少步，不是必须跳多少步。

每次都跳到当前能跳到的最远位置，不一定能得到最少跳跃次数。

例如：

```text
nums = [2,3,1,1,4]
```

如果从下标 `0` 直接跳最远：

```text
下标 0 -> 下标 2 -> 下标 3 -> 下标 4
```

需要 `3` 次。

但最优跳法是：

```text
下标 0 -> 下标 1 -> 下标 4
```

只需要 `2` 次。

所以不能只模拟一条“每次跳最远”的路径。

---

## 正确思路：贪心

这道题可以把每一次跳跃理解成一层范围。

我们维护两个变量：

```text
currentEnd：当前这一步最多能覆盖到的边界
farthest：在当前覆盖范围内，下一步最多能跳到的位置
```

遍历数组时：

1. 用 `i + nums[i]` 更新 `farthest`
2. 当遍历到 `currentEnd` 时，说明当前这一步的所有选择都看完了
3. 此时必须多跳一次，令 `currentEnd = farthest`
4. 如果 `currentEnd` 已经到达或超过最后一个下标，就可以结束

---

## 为什么这样能得到最少次数？

假设当前已经跳了 `steps` 次，能到达的范围是：

```text
[0, currentEnd]
```

在这个范围内的所有位置，都是用 `steps` 次跳跃可以到达的。

我们遍历这个范围里的每个位置，计算下一跳最远可以到哪里：

```text
farthest = max(farthest, i + nums[i])
```

当 `i == currentEnd` 时，说明当前这 `steps` 次能到达的所有位置都检查完了。

如果还没到终点，就必须再跳一次。

这一次跳跃应该让下一轮覆盖范围尽可能远，也就是：

```text
currentEnd = farthest
```

这样每一次跳跃都扩展出当前能得到的最大覆盖范围，因此跳跃次数最少。

---

## 代码

```java
class Solution {
    public int jump(int[] nums) {
        int steps = 0;
        int currentEnd = 0;
        int farthest = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);

            if (i == currentEnd) {
                steps++;
                currentEnd = farthest;
            }
        }

        return steps;
    }
}
```

---

## 图解示例

以：

```text
nums = [2,3,1,1,4]
```

为例：

```text
初始：
steps = 0
currentEnd = 0
farthest = 0

i = 0
farthest = max(0, 0 + nums[0]) = 2
i == currentEnd，说明第 0 步覆盖范围检查完了
steps = 1
currentEnd = 2

现在表示：
跳 1 次，最多可以到下标 2

i = 1
farthest = max(2, 1 + nums[1]) = 4

i = 2
farthest = max(4, 2 + nums[2]) = 4
i == currentEnd，说明第 1 步覆盖范围检查完了
steps = 2
currentEnd = 4

currentEnd 已经覆盖最后一个下标
答案是 2
```

---

## 为什么循环到 `nums.length - 1` 前面？

代码中循环条件是：

```java
for (int i = 0; i < nums.length - 1; i++)
```

原因是：

> 到达最后一个下标以后，不需要再从最后一个下标继续往外跳。

如果把最后一个下标也放进循环，可能会多计算一次跳跃次数。

例如：

```text
nums = [0]
```

本来已经在终点，答案应该是 `0`。

所以只需要遍历到倒数第二个下标。

---

## 复杂度

| 指标 | 复杂度 |
|------|--------|
| 时间 | O(n) |
| 空间 | O(1) |

---

## 一句话总结

> 55 题是维护“能到达的最远位置”，45 题是在此基础上维护“当前跳跃次数覆盖的边界”，每到边界就必须增加一次跳跃。

