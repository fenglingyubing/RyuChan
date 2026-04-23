---
title: 回溯算法总结
description: 回溯算法总结
pubDate: 2026-04-23T14:11
image: /images/summary-001/30369b2f15ee78c9.webp
draft: false
tags:
  - 算法总结
  - LeetCode
categories:
  - LeetCode
badge: ''
---
回溯算法总结
回溯的核心思想
回溯本质是DFS + 状态恢复，解决"选择"问题：

```java
for 选择 in 当前可选列表:
    做选择
    backtrack(下一层)
    撤销选择  ← 关键：恢复现场
你的括号生成题解已经是标准模板了

private void backtrack(...) {
    // 1. 终止条件
    if (满足条件) {
        result.add(...)
        return;
    }
    
    // 2. 做选择
    for (选择 : 可选列表) {
        if (满足剪枝条件) {
            做选择;
            backtrack(...);  // 递归
            撤销选择;         // 回溯
        }
    }
}
```