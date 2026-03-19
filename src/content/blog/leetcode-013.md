---
title: 三数之和
description: leetcode刷题第十一天
pubDate: 2026-03-19T16:48
image: /images/leetcode-013/2b6d3fff91b9c423.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 三数之和

## 第一版思路：
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> set = new HashSet<>();
        int left = 0;
        int right = nums.length - 1;
        while(left <= right){
            int num = 0 - (nums[left] + nums[right]);
            if(nums == null){
                continue;
            }
            if(Arrays.stream(nums).anyMatch(x -> x == num)){
                List<Integer> list = new ArrayList<>(Arrays.asList(num,nums[left],nums[right]));
                Collections.sort(list);
                set.add(list);
            }
            left++;
            right--;
        }
        return new ArrayList<>(set);
    }
}
```

## 原思路的核心问题

这段代码的问题不在于个别语法细节，而在于整体解题思路本身不成立。

题目要求的是找出所有满足 `i != j != k` 且 `nums[i] + nums[j] + nums[k] == 0` 的三元组，并且不能重复。也就是说，本质上需要覆盖所有可能的合法三元组组合。

但原代码采用的是：

- 用 `left` 指向数组左侧
- 用 `right` 指向数组右侧
- 每次只检查 `nums[left]` 和 `nums[right]`
- 再去数组中找是否存在一个补数 `num`

这种做法只检查了极少数配对，无法枚举全部三元组，因此会漏掉大量答案。

## 具体问题归纳

### 1. 只枚举了很少一部分组合，无法覆盖所有解

代码中：

```java
left++;
right--;
```

意味着每轮只检查一组对称位置，例如：

- 第 0 个和最后 1 个
- 第 1 个和倒数第 2 个
- 第 2 个和倒数第 3 个

但三数之和题目要求的是从数组中任选三个不同下标进行组合。原做法并没有遍历所有可能的二元组，更谈不上覆盖所有三元组。

结论：会严重漏解。

### 2. 没有保证第三个数的下标与前两个不同

代码中：

```java
Arrays.stream(nums).anyMatch(x -> x == num)
```

只是在判断数组里是否存在值等于 `num` 的元素，但并没有判断该元素的下标是否与 `left`、`right` 对应的位置不同。

题目明确要求：

- `i != j`
- `i != k`
- `j != k`

原代码只验证了“值存在”，没有验证“位置不同”，因此可能错误地重复使用同一个元素。

### 3. `nums == null` 的判断位置错误

代码中先执行了：

```java
int right = nums.length - 1;
```

然后才判断：

```java
if(nums == null){
    continue;
}
```

如果 `nums == null`，程序在访问 `nums.length` 时就已经抛出空指针异常，不会执行到后面的判空逻辑。

正确做法应该是在方法开头先判断：

```java
if (nums == null || nums.length < 3) {
    return new ArrayList<>();
}
```

### 4. `while (left <= right)` 不符合题意

当 `left == right` 时，说明当前左右指针指向同一个位置。此时如果还继续参与运算，相当于把同一个元素用了两次，不满足三元组中下标互不相同的要求。

即使单纯把条件改成 `left < right`，也只是修复了表面问题，整体思路仍然不正确，因为组合仍然枚举不全。

### 5. 通过 `Set<List<Integer>>` 去重，只是补救，不是正确的主流程

代码通过：

```java
Collections.sort(list);
set.add(list);
```

来避免重复结果。这个做法只能在“已经找到了候选三元组”的前提下做结果去重，但它不能解决：

- 漏掉大量三元组
- 重复使用相同下标
- 没有系统遍历所有组合

也就是说，这种去重只是结果层面的补救，不能弥补算法主体设计的问题。

### 6. 时间花在了无效搜索上，但仍然没有正确覆盖解空间

每一轮都执行：

```java
Arrays.stream(nums).anyMatch(x -> x == num)
```

本质上是在重新扫描整个数组寻找补数。虽然单次查找是线性的，但由于前面并没有正确枚举所有二元组，这种扫描并没有构成一个正确、完整的解法。

问题不只是效率，而是“搜索方向本身不对”。

## 一句话总结

原代码本质上是在检查：

“当前左右两端这少数几对数字，能不能在数组里再找到一个补数。”

但题目真正要求的是：

“从所有可能的三个不同位置中，找出全部和为 0 的不重复三元组。”

因此，原思路属于组合覆盖不完整，不能作为正确解法。

## 正确解法方向

这道题的标准做法是：

1. 先对数组排序
2. 固定第一个数 `nums[i]`
3. 在 `i` 后面的区间使用双指针 `left` 和 `right`
4. 根据三数之和与 `0` 的大小关系移动指针
5. 在遍历过程中跳过重复元素，避免重复三元组

这种方法的优点：

- 能系统覆盖所有可能的三元组
- 能保证三个元素下标不同
- 能有效去重
- 时间复杂度为 `O(n^2)`，是这道题的经典解法

## 正确代码展示：

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums == null || nums.length < 3) {
            return res;
        }

        Arrays.sort(nums);

        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) {
                break;
            }

            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;

                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return res;
    }
}
```

## 代码说明

- 先判空并判断数组长度，避免空指针和无效计算
- 先排序，便于后续使用双指针和跳过重复元素
- 外层循环固定第一个数 `nums[i]`
- 内层使用双指针查找另外两个数
- 当三数之和等于 `0` 时记录结果，并继续跳过重复值
- 当和小于 `0` 时左指针右移
- 当和大于 `0` 时右指针左移

这种写法既能保证不漏解，也能保证结果不重复

## 结论

原代码的主要问题可以归纳为三点：

- 枚举方式错误，没有覆盖全部合法组合
- 只按值判断补数存在，没有保证下标互不相同
- 去重和查找方式都是表面补救，没有建立正确的解题框架

因此，这段代码即使在部分样例上可能得到正确结果，也不能作为三数之和题目的正确通解。
