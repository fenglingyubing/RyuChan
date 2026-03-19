---
title: computeIfPresent 和 computeIfAbsent
description: computeIfPresent 和 computeIfAbsent使用讲解
pubDate: 2026-03-19T16:37
image: /images/hashmap-01/86f5ed71b0481ae0.webp
draft: false
tags:
  - 方法讲解
categories:
  - 方法讲解
---
## 1. `computeIfAbsent`

### 作用

`computeIfAbsent` 的意思是：

- 如果 `key` 不存在，就根据你提供的规则计算一个 `value` 并放入 `Map`
- 如果 `key` 已存在，就直接返回原来的 `value`

方法签名：

```java
V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)
```

### 执行逻辑

1. 先判断指定的 `key` 是否存在
2. 如果存在，直接返回原值，不执行 `mappingFunction`
3. 如果不存在，执行 `mappingFunction` 计算一个新值
4. 如果新值不为 `null`，则放入 `Map`
5. 返回最终值

### 示例 1：键不存在时自动创建

```java
Map<String, Integer> map = new HashMap<>();

Integer value = map.computeIfAbsent("apple", k -> 5);

System.out.println(value); // 5
System.out.println(map);   // {apple=5}
```

### 示例 2：键已存在时直接返回旧值

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);

Integer value = map.computeIfAbsent("apple", k -> 5);

System.out.println(value); // 10
System.out.println(map);   // {apple=10}
```

### 示例 3：最常见场景，`Map<String, List<String>>`

```java
Map<String, List<String>> map = new HashMap<>();

map.computeIfAbsent("group1", k -> new ArrayList<>()).add("Tom");
map.computeIfAbsent("group1", k -> new ArrayList<>()).add("Jerry");

System.out.println(map); // {group1=[Tom, Jerry]}
```

这行代码：

```java
map.computeIfAbsent("group1", k -> new ArrayList<>()).add("Tom");
```

当 `"group1"` 不存在时，会发生以下事情：

1. 发现 `"group1"` 不在 `map` 中
2. 执行 `k -> new ArrayList<>()`
3. 创建一个新的 `ArrayList`
4. 将 `"group1"` 和这个 `ArrayList` 放入 `map`
5. 返回这个 `ArrayList`
6. 再执行 `.add("Tom")`

最终结果：

```java
{group1=[Tom]}
```

### 一次添加多个元素怎么办

因为 `add()` 一次只能加一个元素，所以如果要一次加多个元素，应使用 `addAll()`：

```java
map.computeIfAbsent("group1", k -> new ArrayList<>())
   .addAll(Arrays.asList("Tom", "Jerry"));
```

Java 9+ 也可以写成：

```java
map.computeIfAbsent("group1", k -> new ArrayList<>())
   .addAll(List.of("Tom", "Jerry"));
```

### `lambda` 能不能传两个参数

不能。

`computeIfAbsent` 要求的函数类型是：

```java
Function<? super K, ? extends V>
```

说明 `lambda` 只能接收一个参数，也就是 `key` 本身：

```java
k -> new ArrayList<>()
```

如果你还需要额外的数据，可以在外部定义变量，然后在 `lambda` 中使用：

```java
String prefix = "user-";

map.computeIfAbsent("group1", k -> {
    List<String> list = new ArrayList<>();
    list.add(prefix + "Tom");
    list.add(prefix + "Jerry");
    return list;
});
```

### `key` 为 `null` 时会怎样

在 `HashMap` 中，`key` 可以为 `null`，所以这样是允许的：

```java
Map<String, String> map = new HashMap<>();

String value = map.computeIfAbsent(null, k -> "default");

System.out.println(value); // default
System.out.println(map);   // {null=default}
```

但要注意，`lambda` 中的 `k` 此时就是 `null`，如果你直接调用它的方法，会抛出 `NullPointerException`：

```java
map.computeIfAbsent(null, k -> k.toUpperCase()); // 会报错
```

### 注意点

- 如果 `mappingFunction` 返回 `null`，则不会插入这个键值对
- 如果后面链式调用方法，比如 `.add("Tom")`，前提是 `mappingFunction` 返回的不是 `null`
- `computeIfAbsent` 的典型用途就是“没有就创建，有了就复用”

## 2. `computeIfPresent`

### 作用

`computeIfPresent` 的意思是：

- 只有当 `key` 已经存在时，才重新计算并更新它的值
- 如果 `key` 不存在，就什么都不做

方法签名：

```java
V computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)
```

### 执行逻辑

1. 先检查 `key` 是否存在
2. 如果存在，则执行 `remappingFunction(key, oldValue)`
3. 如果返回值不为 `null`，则用新值替换旧值
4. 如果返回值为 `null`，则删除该键值对
5. 如果 `key` 不存在，则什么都不做，直接返回 `null`

### 示例 1：更新已有值

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);

Integer result = map.computeIfPresent("apple", (k, v) -> v + 5);

System.out.println(result); // 15
System.out.println(map);    // {apple=15}
```

### 示例 2：键不存在时不会执行

```java
Map<String, Integer> map = new HashMap<>();

Integer result = map.computeIfPresent("apple", (k, v) -> v + 5);

System.out.println(result); // null
System.out.println(map);    // {}
```

### 示例 3：返回 `null` 会删除键

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);

Integer result = map.computeIfPresent("apple", (k, v) -> null);

System.out.println(result); // null
System.out.println(map);    // {}
```

### 示例 4：更新集合内容

```java
Map<String, List<String>> map = new HashMap<>();
map.put("group1", new ArrayList<>(List.of("Tom")));

map.computeIfPresent("group1", (k, list) -> {
    list.add("Jerry");
    return list;
});

System.out.println(map); // {group1=[Tom, Jerry]}
```

### 注意点

- `computeIfPresent` 的 `lambda` 有两个参数：`key` 和 `旧 value`
- 只有在键存在时才会执行
- 如果返回 `null`，当前键会被删除

## 3. 两个方法的区别

| 方法 | 什么时候执行 | `lambda` 参数 | 返回 `null` 的结果 |
| --- | --- | --- | --- |
| `computeIfAbsent` | `key` 不存在时 | 只有 `key` | 不插入 |
| `computeIfPresent` | `key` 存在时 | `key` 和 `oldValue` | 删除该键 |

## 4. 一句话总结

- `computeIfAbsent`：没有才创建
- `computeIfPresent`：有了才更新

这两个方法都很适合简化 `if-else` 判空逻辑，尤其是在处理 `Map<String, List<T>>`、计数器、自定义对象缓存等场景时非常常用。
