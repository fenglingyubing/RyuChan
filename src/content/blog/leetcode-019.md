---
title: 最小覆盖子串
description: leetcode刷题第十五天
pubDate: 2026-03-23T12:38
image: /images/leetcode-019/5669c7d50436414e.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
badge: ''
---
# 最小覆盖子串

## 正确写法

```java
class Solution {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) {
            return "";
        }

        Map<Character, Integer> need = new HashMap<>();
        Map<Character, Integer> window = new HashMap<>();

        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }

        int left = 0;
        int right = 0;
        int valid = 0;

        int start = 0;
        int len = Integer.MAX_VALUE;

        while (right < s.length()) {
            char c = s.charAt(right);
            right++;

            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c).intValue() == need.get(c).intValue()) {
                    valid++;
                }
            }

            while (valid == need.size()) {
                if (right - left < len) {
                    start = left;
                    len = right - left;
                }

                char d = s.charAt(left);
                left++;

                if (need.containsKey(d)) {
                    if (window.get(d).intValue() == need.get(d).intValue()) {
                        valid--;
                    }
                    window.put(d, window.get(d) - 1);
                }
            }
        }

        return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
    }
}
```

## 问题总结

我原来的思路本质上也是滑动窗口，方向没有错，但卡住的地方集中在“窗口何时算满足条件”这一点。这个题最关键的不是让窗口中的字符统计和 `t` 完全相同，而是让窗口中“至少包含” `t` 里的所有字符及其出现次数。

### 1. `tMap` 初始化计数有误

统计 `t` 中字符次数时，默认值应该从 `0` 开始，而不是从 `1` 开始。否则第一次加入字符时，次数会直接变成 `2`，后面的判断都会被带偏。

### 2. 不能用两个 Map 完全相等来判断窗口有效

你原来用的是 `tMap.equals(sMap)`，这会要求两个映射一模一样。但题目要求的是最小覆盖子串，只要当前窗口中每个需要的字符数量都不少于 `t` 中要求的数量，就已经满足条件了。窗口里可以有额外字符，也可以让某些字符出现更多次。

例如 `t = "ABC"`，窗口是 `"ADOBEC"` 时，其实已经满足要求了，但窗口统计不会和 `t` 的统计完全一致，所以不能用 `equals()` 判断。

### 3. 收缩窗口的时机错了

原代码是当窗口长度大于等于 `t.length()` 时才尝试收缩，但长度够了不代表条件满足。真正应该收缩窗口的时机，是当前窗口已经覆盖了 `t` 的全部要求之后。

所以正确做法不是看窗口长度，而是看当前窗口是否已经满足所有必需字符的数量要求。

### 4. 需要一个变量记录“满足要求的字符种类数”

这也是这题的核心技巧。`need` 记录目标需求，`window` 记录当前窗口的实际数量。

当某个字符在窗口中的数量第一次达到 `need` 中要求的数量时，就说明这个字符已经“达标”了，`valid++`。

当 `valid == need.size()` 时，表示所有需要的字符种类都已经达标，此时窗口有效，可以开始移动 `left` 去缩小窗口。

### 5. 更新答案必须放在收缩阶段

只有在窗口已经满足条件时，当前区间才可能成为候选答案。所以更新最短子串的位置，应该放在 `while (valid == need.size())` 这个循环里，而不是放在外层随意更新。

这一步的含义是：先确认窗口合法，再不断尝试缩小，并在缩小过程中记录最短合法区间。

### 6. 左指针移出字符时要先判断是否会破坏有效性

当左边界右移时，如果移出的字符正好是必需字符，并且它移出前的数量刚好等于所需数量，那么移出后窗口就不再满足条件了，这时要先 `valid--`，再减少窗口计数。

顺序很重要，因为你需要先基于“移出前”的状态判断这个字符是不是刚好达标。

## 代码解析

### 1. 先统计目标串 `t` 的需求

`need` 用来保存 `t` 中每个字符需要出现多少次。例如 `t = "AABC"` 时，`need` 中会记录：

- `A -> 2`
- `B -> 1`
- `C -> 1`

这一步建立了后面判断窗口是否合法的标准。

### 2. 用双指针维护滑动窗口

`left` 和 `right` 表示当前窗口的左右边界，窗口范围是左闭右开，即 `[left, right)`。

每次循环先取 `s.charAt(right)`，然后 `right++`，表示把这个字符纳入当前窗口。

### 3. 右指针扩张窗口

如果当前字符是 `t` 中需要的字符，就更新 `window` 中的计数。

当某个字符在 `window` 中的数量刚好等于 `need` 中的数量时，说明这个字符已经达标，`valid++`。

注意这里只在“刚好相等”时增加一次，后面即使这个字符继续增加，也不会重复增加 `valid`。

### 4. 当窗口有效时，开始收缩左边界

当 `valid == need.size()` 时，说明当前窗口已经包含了 `t` 所需的全部字符和数量。

这时：

- 先用当前窗口长度更新最优答案
- 再尝试移动 `left`
- 看能否在仍然满足条件的情况下，把窗口缩得更短

这是滑动窗口中“先扩张找到可行解，再收缩逼近最优解”的典型过程。

### 5. 左指针收缩时的处理

移出左侧字符 `d` 后：

- 如果 `d` 不是目标字符，直接跳过
- 如果 `d` 是目标字符，要先判断它当前是否正好满足需求
- 如果正好满足，那么一旦移出，窗口就会失效，因此要先 `valid--`
- 然后再把 `window` 中这个字符的计数减一

这样可以保证窗口状态始终正确。

### 6. 最终返回结果

如果 `len` 一直没有更新，说明根本不存在满足条件的子串，返回空串。

否则返回 `s.substring(start, start + len)`，这就是记录下来的最短覆盖子串。

## 这题的本质

这题的难点不在于双指针本身，而在于如何高效判断“当前窗口是否已经覆盖了 `t`”。一旦把这个判断从“两个 Map 完全相等”改成“所有目标字符都已达标”，整个滑动窗口逻辑就会顺下来。

可以把这题记成一个固定模板：

- 右指针负责扩张窗口，直到窗口满足条件
- 左指针负责收缩窗口，尽量找到更短答案
- 用 `need + window + valid` 来判断窗口是否合法

这个模板在很多字符串滑动窗口题里都可以复用。

## 思路二：数组计数优化

这一版思路和上面的滑动窗口本质相同，但不再使用 `HashMap`，而是直接用数组维护字符计数。这样做的前提是字符集范围较小，例如本题常见写法默认字符属于 ASCII，可以直接使用 `int[128]`。

这一版的核心不是“窗口里有什么”，而是“当前窗口还缺什么”。

### 代码

出处：作者：冰可乐泡枸杞🍉  
链接：https://leetcode.cn/problems/minimum-window-substring/solutions/3908207/javazhong-gui-zhong-ju-de-4msjie-fa-hua-r5gy5/  
来源：力扣（LeetCode）

```java
class Solution {
    public String minWindow(String s, String t) {
        int[] cnt = new int[128];
        int num = 0; // 滑动窗口字母种类，和t字母种类相异个数
        for (char c : t.toCharArray()) {
            if (cnt[c] == 0) num++;
            cnt[c]++;
        }
        
        int ansL = -1, ansLen = Integer.MAX_VALUE;
        for (int l = 0, r = 0; r < s.length(); r++) {
            // 窗口最右字符滑入
            if (--cnt[s.charAt(r)] == 0) num--;

            // 当num等于0，表示滑动窗口成功覆盖t字符串
            while (num == 0) {
                int len = r - l;
                if (len < ansLen) {
                    ansL = l;
                    ansLen = len;
                }

                // 窗口最左字符滑出
                if (++cnt[s.charAt(l)] == 1) num++;
                l++;
            }
        }
        return ansL == -1 ? "" : s.substring(ansL, ansL + ansLen + 1);
    }
}
```

### 解析

#### 1. `cnt` 数组的含义

`cnt[c]` 表示当前窗口相对于目标串 `t` 来说，还缺多少个字符 `c`。

初始化时先把 `t` 中每个字符的需求写入数组。例如 `t = "AABC"` 时：

- `cnt['A'] = 2`
- `cnt['B'] = 1`
- `cnt['C'] = 1`

这表示窗口一开始还没有任何字符，因此这些字符都还“欠着”。

#### 2. `num` 的含义

`num` 表示当前还有多少种字符没有满足要求。

注意它统计的是“种类数”，不是“总字符数”。例如 `t = "AABC"` 时，虽然总共需要 4 个字符，但只涉及 3 种字符，所以初始化后 `num = 3`。

#### 3. 右指针加入字符时的处理

当右指针加入字符 `c` 时：

```java
if (--cnt[s.charAt(r)] == 0) num--;
```

这一步表示把窗口中的字符用于抵消需求。

- 如果减完后 `cnt[c] == 0`，说明这种字符刚好满足要求
- 因此 `num--`
- 如果减完后小于 `0`，说明这个字符已经多出来了，不影响 `num`

所以：

- `cnt[c] > 0` 表示还缺
- `cnt[c] == 0` 表示刚好满足
- `cnt[c] < 0` 表示多余

#### 4. 为什么 `num == 0` 时窗口有效

当 `num == 0` 时，说明所有需要的字符种类都已经满足了，也就是说当前窗口已经覆盖了 `t`。

这就是这版代码的关键优化点：不需要每次检查所有字符是否满足要求，只需要维护一个 `num`，就能在 O(1) 时间判断当前窗口是否有效。

#### 5. 为什么此时要收缩左边界

一旦窗口已经覆盖 `t`，当前区间就可以作为候选答案。接下来要做的是尽量缩短这个窗口，因此进入：

```java
while (num == 0)
```

在这个循环里：

- 先更新最短答案
- 再尝试移动左指针
- 如果移走字符后窗口仍然有效，就继续缩
- 如果移走后窗口失效，就停止收缩，继续右移右指针

#### 6. 左指针移出字符时的处理

```java
if (++cnt[s.charAt(l)] == 1) num++;
```

这一步表示左边界移出的字符重新记回“欠账”。

- 如果加完后变成 `1`，说明这个字符从“刚好满足或有剩余”变成了“重新缺少”
- 于是窗口失效，`num++`
- 如果加完后仍然小于等于 `0`，说明这种字符依然够用，窗口仍然有效

#### 7. 为什么答案长度写成 `r - l`

代码中：

```java
int len = r - l;
```

这里没有直接写成常见的 `r - l + 1`，是因为作者最后返回时补回了这一位：

```java
s.substring(ansL, ansL + ansLen + 1)
```

本质上只是长度定义方式不同，不影响结果。

#### 8. 这版和上一版的区别

上一版使用 `HashMap<Character, Integer>`，更通用，适合任意字符集，也更容易从模板角度理解。

这一版使用数组：

- 查询更快
- 更新更快
- 常数更小
- 代码更短

但它依赖字符范围可控这一前提。如果题目涉及更大字符集，还是 `HashMap` 写法更稳妥。

