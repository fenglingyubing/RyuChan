---
title: 字母异位词分组
description: leetcode刷题第九天
pubDate: 2026-03-17T12:18
image: /images/leetcode-010/5e06076908bdcaef.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 字母异位词分组问题总结

## 问题背景

题目目标是将字符串数组中互为字母异位词的字符串分到同一组。

字母异位词的判断标准是：

- 字符种类相同
- 每个字符出现次数相同
- 字符顺序可以不同

例如：

- `"eat"`、`"tea"`、`"ate"` 是一组
- `"tan"`、`"nat"` 是一组
- `"bat"` 单独一组

---

## 一、二维列表的常见误区

如果使用的是二维列表：

```java
List<List<String>> list = new ArrayList<>();
```

那么这个时候只是创建了外层列表，内层的每一行并不存在。

错误示例：

```java
list.get(0).add("abc");
```

这会报错，因为第 `0` 行还没有创建。

正确做法是先创建内层列表，再向其中添加元素：

```java
list.add(new ArrayList<>());
list.get(0).add("abc");
```

结论：

- `List<List<T>>` 不能直接通过不存在的索引添加
- 必须先 `add` 出内层列表，再往内层列表里 `add` 元素

---

## 二、`str.chars().sum()` 作为分组依据的误区

曾尝试使用下面的方式作为字符串分组特征：

```java
Integer count = str.chars().sum();
```

这段代码本身语法上可以成立，但不适合作为字母异位词分组的依据。

### 1. `chars` 和 `sum` 是方法

正确写法是：

```java
int count = str.chars().sum();
```

不是：

```java
str.chars.sum()
```

### 2. `sum()` 表示字符编码值总和，不是字符数量

例如：

```java
"ab".chars().sum()
```

求的是 `'a' + 'b'` 的编码值之和，而不是字符串长度。

如果想求字符个数，应该使用：

```java
str.length();
```

### 3. 字符编码和相同，不代表是字母异位词

这是这个思路的核心问题。

例如：

```java
"ad" -> 97 + 100 = 197
"bc" -> 98 + 99  = 197
```

这两个字符串的字符编码和相同，但它们不是字母异位词。

说明：

- `chars().sum()` 只能表示“总和相同”
- 不能表示“字符组成完全相同”

因此它会把不该分在一组的字符串错误地分到一起。

---

## 三、`Map<特征值, 下标>` 思路本身不是问题，问题在特征值

原始思路类似：

```java
Map<Integer, Integer> indexMap = new HashMap<>();
```

含义是：

- key：字符串计算出的特征值
- value：该组在二维列表中的下标

这个思路本身可以工作，但前提是 key 必须能够唯一表示“异位词特征”。

如果 key 设计错误，比如使用 `chars().sum()`，那么：

- 非异位词字符串也可能得到同一个 key
- 它们就会被错误放进同一组

所以真正的问题不是 `Map` 配合二维列表，而是“分组依据不可靠”。

---

## 四、正确思路：排序后作为 key

最常见且容易理解的方法是：

1. 把每个字符串转为字符数组
2. 对字符数组排序
3. 将排序后的结果作为 key
4. 相同 key 的字符串分到同一组

例如：

- `"eat"` 排序后得到 `"aet"`
- `"tea"` 排序后也得到 `"aet"`

因此它们会进入同一组。

---

## 五、`char[]` 调用 `toString()` 的误区

曾出现如下代码：

```java
char[] chars = str.toCharArray();
Arrays.sort(chars);
String s = chars.toString();
```

这段代码的问题在于：

- `chars` 是一个数组
- 数组调用 `toString()` 返回的不是数组内容
- 返回的是对象标识形式的字符串

例如可能得到：

```java
[C@1a2b3c
```

这不是排序后的字符内容，因此不能作为分组 key。

正确写法是：

```java
String s = new String(chars);
```

这样才能把排序后的字符数组真正转换为字符串，例如：

```java
['a', 'e', 't'] -> "aet"
```

---

## 六、推荐写法一：普通 `containsKey` 写法

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String str : strs) {
            char[] chars = str.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(str);
        }

        return new ArrayList<>(map.values());
    }
}
```

这版逻辑清晰，适合刚理解题目的时候使用。

---

## 七、推荐写法二：`computeIfAbsent` 写法

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String str : strs) {
            char[] chars = str.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }

        return new ArrayList<>(map.values());
    }
}
```

其中：

```java
map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
```

等价于：

```java
if (!map.containsKey(key)) {
    map.put(key, new ArrayList<>());
}
map.get(key).add(str);
```

含义是：

- 如果 `key` 不存在，就先创建一个新的列表
- 然后把当前字符串加入该列表

---

## 八、本题的核心总结

这道题最关键的不是“如何把字符串放进二维列表”，而是“如何设计一个正确的分组 key”。

需要避免的误区：

- 误以为空二维列表可以直接按索引添加元素
- 误以为字符编码和可以表示字母异位词
- 误以为 `char[]#toString()` 能得到数组内容

应该掌握的正确思路：

- 先找到能稳定表示字符串组成的特征
- 排序后的字符串可以作为可靠 key
- 再使用 `Map<String, List<String>>` 完成分组

---

## 九、一句话结论

字母异位词分组的关键是：

**相同字符组成的字符串，经过排序后一定得到相同结果；而字符编码求和并不能唯一表示字符组成。**
