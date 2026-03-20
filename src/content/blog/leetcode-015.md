---
title: 无重复字符的最长子串
description: leetcode刷题第十二天
pubDate: 2026-03-20T09:24
image: /images/leetcode-015/ed21d951f463293a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
## 方法一：HashSet + 滑动窗口

### 思路

使用两个指针维护一个无重复字符窗口：

- `right` 负责向右扩张窗口
- 如果当前字符已经在集合中，说明有重复
- 这时不断移动 `left`，并把左侧字符从集合中删除
- 直到窗口重新满足无重复条件

### 代码

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0;
        int ans = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            while (set.contains(c)) {
                set.remove(s.charAt(left));
                left++;
            }

            set.add(c);
            ans = Math.max(ans, right - left + 1);
        }

        return ans;
    }
}
```

### 复杂度

- 时间复杂度：`O(n)`
- 空间复杂度：`O(k)`，`k` 为窗口中不同字符数量

### 特点

- 思路直观
- 适合理解滑动窗口的收缩过程

## 方法二：HashMap + 记录字符最后出现位置

### 思路

使用 `HashMap<Character, Integer>` 记录每个字符最近一次出现的位置：

- `right` 向右遍历字符串
- 如果当前字符曾经出现过，并且位置仍在当前窗口内
- 直接把 `left` 跳到“上一次出现位置 + 1”
- 不需要像 `HashSet` 那样一个个删除字符

### 代码

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0;
        int ans = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }

            map.put(c, right);
            ans = Math.max(ans, right - left + 1);
        }

        return ans;
    }
}
```

### 复杂度

- 时间复杂度：`O(n)`
- 空间复杂度：`O(k)`

### 特点

- 相比 `HashSet` 方法更高效
- 左指针可以直接跳跃
- 是更常见的优化写法

## 两种方法对比

| 方法 | 核心结构 | 遇到重复字符时的处理 | 特点 |
| --- | --- | --- | --- |
| HashSet | 集合 + 滑动窗口 | 左指针逐步右移并删除字符 | 思路直观 |
| HashMap | 哈希表 + 最近位置 | 左指针直接跳到上次出现位置后面 | 更简洁、更高效 |

## 结论

- 这道题的本质是滑动窗口
- `HashSet` 方法更适合理解窗口收缩过程
- `HashMap` 方法更适合写出更优雅、效率更高的代码
- 你的原思路问题在于：发现重复字符后，没有正确维护窗口左边界和集合状态
