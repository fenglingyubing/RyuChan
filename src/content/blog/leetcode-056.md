---
title: 实现Trie
description: ''
pubDate: 2026-04-18T11:11
image: /images/leetcode-056/64289a25771d67a7.webp
draft: false
tags:
  - LeetCode
  - 感悟
categories:
  - LeetCode
---
# 第一种实现思路
采用hashset来存储插入的前缀，查询的时候看是否是前缀。
- 优点： 简单易理解
- 缺点： 效率较慢

## 完整代码如下：
```java
class Trie {
    private Set<String> set = new HashSet<>();

    public Trie() {
        
    }
    
    public void insert(String word) {
        set.add(word);
    }
    
    public boolean search(String word) {
        return set.contains(word);
    }
    
    public boolean startsWith(String prefix) {
        Object[] array = set.toArray();
        for(Object s : array){
            String str = (String) s;
            int res = str.indexOf(prefix);
            if(res != -1 && res == 0){
                return true;
            }
        }
        return false;
    }
}
```

# 第二种实现思路：
我们定义一个节点 `TrieNode`：

- `children[26]`：表示 26 个小写字母的子节点
- `isEnd`：表示某个单词是否在这里结束

例如插入 `apple`：

- 根节点 -> `a` -> `p` -> `p` -> `l` -> `e`
- 到 `e` 这个节点时，标记 `isEnd = true`

如果再插入 `app`：

- 只需要复用前面的路径
- 到第二个 `p` 时再标记一次 `isEnd = true`

这就是 Trie 高效的原因：**公共前缀只存一份**。

```java
class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }

    private TrieNode searchPrefix(String str) {
        TrieNode node = root;
        for (int i = 0; i < str.length(); i++) {
            int index = str.charAt(i) - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        return node;
    }
}
```