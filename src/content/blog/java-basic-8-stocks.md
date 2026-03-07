---
title: Java基础八股
description: Java后端面试八股整理
pubDate: 2026-03-07T22:28
image: /images/java-basic-8-stocks/35087021d8b10277.png
draft: false
tags:
  - Java
  - 八股
categories:
  - 八股
---
# JDK、JRE、JVM 是什么？
- **JVM**：Java 虚拟机，执行字节码
- **JRE**：Java 运行环境 = JVM + 核心类库
- **JDK**：Java 开发工具包 = JRE + 编译器、调试器
![](/images/java-basic-8-stocks/fa4f6541737360c3.png)

## 在 Java 9 新特性概览这篇文章中，我在介绍模块化系统的时候提到：
> 在引入了模块系统之后，JDK 被重新组织成 94 个模块。Java 应用可以通过新增的 jlink 工具，创建出只包含所依赖的 JDK 模块的自定义运行时镜像。这样可以极大的减少 Java 运行时环境的大小。

# == 和 equals 区别
- **==**：基本类型比值，引用类型比地址
- **equals**：默认比地址，重写后（如 String）比内容

# final、finally、finalize
- **final**：修饰类不能继承、方法不能重写、变量不能改
- **finally**：配合 try-catch，一定执行（除非 JVM 退出）
- **finalize**：Object 方法，垃圾回收前调用，不推荐用