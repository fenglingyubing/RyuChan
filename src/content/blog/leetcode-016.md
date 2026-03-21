---
title: 找到字符串中所有字母异位词
description: leetcode刷题第十三天
pubDate: 2026-03-21T11:37
image: /images/leetcode-016/ed5dd93fffd1835a.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
badge: ''
---
# 找到字符串中所有字母异位词

## 题目核心

给定字符串 `s` 和字符串 `p`，要求找出 `s` 中所有是 `p` 的字母异位词的子串起始下标。

字母异位词的特点是：

- 字符种类相同
- 每种字符出现次数相同
- 字符顺序可以不同

## 代码思路

这段代码使用的是滑动窗口。

- `need` 记录字符串 `p` 中每个字符需要出现多少次
- `window` 记录当前窗口中每个字符出现多少次
- 窗口长度始终保持为 `p.length()`
- 当 `window` 和 `need` 完全相等时，说明当前窗口就是一个字母异位词

## 完整代码
```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> result = new ArrayList<>();
        int n = s.length(), m = p.length();
        if (n < m) {
            return result;
        }

        int[] need = new int[26];
        int[] window = new int[26];

        for (char c : p.toCharArray()) {
            need[c - 'a']++;
        }

        for (int right = 0; right < n; right++) {
            window[s.charAt(right) - 'a']++;

            if (right >= m) {
                window[s.charAt(right - m) - 'a']--;
            }

            if (Arrays.equals(need, window)) {
                result.add(right - m + 1);
            }
        }

        return result;
    }
}
```

## 关键代码

```java
if (right >= m) {
    window[s.charAt(right - m) - 'a']--;
}
```

其中：

- `right` 表示当前加入窗口的右边界下标
- `m` 表示字符串 `p` 的长度

## 这段代码的作用

它的作用是：当窗口长度超过 `m` 时，移除最左边滑出窗口的字符。

每次循环都会先执行：

```java
window[s.charAt(right) - 'a']++;
```

也就是说，当前字符 `s[right]` 会先进入窗口。

如果只加不减，窗口就会越来越大，不再是固定长度 `m`。所以当 `right >= m` 时，说明窗口已经需要向右滑动，此时要把最左边那个旧字符移出去。

被移除字符的位置是：

```java
right - m
```

因此：

```java
window[s.charAt(right - m) - 'a']--;
```

表示把这个滑出窗口的字符计数减 1。

## 为什么是 `right - m`

假设窗口长度应该始终是 `m`：

- 当加入 `s[right]` 后，窗口中最新的右端是 `right`
- 当前窗口最多只能保留最近的 `m` 个字符
- 超出的最早那个字符下标正好就是 `right - m`

所以移除 `right - m` 是为了让窗口长度重新回到 `m`。

## 为什么后面几乎每次都会进入这个 `if`

这是正常现象，不是代码问题，而是滑动窗口的设计目标。

原因如下：

- 前 `m` 次循环时，窗口还没装满，不需要移除字符
- 从第 `m + 1` 次开始，每加入一个新字符，就必须移除一个旧字符
- 这样窗口长度才能一直保持为 `m`

换句话说：

- 右边进一个
- 左边出一个
- 窗口整体向右滑动一格

## 示例说明

假设：

```java
s = "abcdefg"
p = "abc"
m = 3
```

窗口变化过程如下：

### `right = 0`

- 加入 `a`
- 窗口为 `a`
- 长度还不到 3，不删除

### `right = 1`

- 加入 `b`
- 窗口为 `ab`
- 长度还不到 3，不删除

### `right = 2`

- 加入 `c`
- 窗口为 `abc`
- 长度等于 3，不删除

### `right = 3`

- 加入 `d`
- 窗口临时变成 `abcd`
- 长度超过 3
- 删除 `s[3 - 3] = s[0] = a`
- 窗口变成 `bcd`

### `right = 4`

- 加入 `e`
- 窗口临时变成 `bcde`
- 删除 `s[4 - 3] = s[1] = b`
- 窗口变成 `cde`

从这里可以看出，只要窗口继续向右滑动，就会不断重复：

- 加入右边新字符
- 移除左边旧字符

## 最终理解

这段代码本质上就是在维护一个固定长度为 `m` 的滑动窗口。

可以把它总结成一句话：

当新字符进入窗口后，如果窗口超长，就把最左边滑出去的字符移除。

## 与异位词判断的关系

窗口长度始终保持和 `p` 一样长之后，代码再比较：

```java
Arrays.equals(need, window)
```

如果两个计数数组完全相同，就说明：

- 当前窗口中的字符种类和数量
- 与字符串 `p` 完全一致

因此当前窗口就是 `p` 的一个字母异位词。
