---
title: 引入AOP依赖不成功
description: 解决引入AOP依赖不成功问题
pubDate: 2026-03-15T15:26
image: /images/fixbug-001/aab256f2030e32df.png
draft: false
tags:
  - Java
  - bug修复
categories:
  - bug修复
---
# Maven Dependency Troubleshooting

## 问题现象

项目中新增下面这个依赖后一直报红：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

一开始看起来像是 `spring-boot-starter-aop` 依赖失效，或者 Spring Boot 4.x/3.x 改了坐标。

## 实际原因

最终确认，`spring-boot-starter-aop` 本身没有问题，问题出在项目的其他依赖坐标写错，导致整个 Maven 模型解析失败，从而让编辑器里多个依赖一起报红。

真实报错是：

```text
[ERROR] Maven model problem: 'dependencies.dependency.version' for org.springframework.boot:spring-boot-starter-webservices:jar is missing.
[ERROR] Maven model problem: 'dependencies.dependency.version' for org.springframework.boot:spring-boot-starter-webservices-test:jar is missing.
```

## 排查过程

### 1. 先确认 AOP 依赖坐标

确认 Spring Boot 3.x 和 4.x 中，AOP starter 仍然是：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

说明 AOP 依赖没有改名。

### 2. 检查 `pom.xml`

发现项目里还存在下面两个依赖：

```xml
spring-boot-starter-webservices
spring-boot-starter-webservices-test
```

这里的 artifactId 写法有问题。

### 3. 检查 IDEA Maven 配置

IDEA 使用的不是默认本地仓库，而是：

```text
Local repository: F:\register
User settings file: F:\software\apache-maven-3.9.11\conf\settings.xml
```

因此依赖下载和缓存都发生在 `F:\register`，不是默认的 `C:\Users\风铃\.m2\repository`。

### 4. 检查本地仓库

在 `F:\register\org\springframework\boot` 下检查后发现：

- 有 `spring-boot-starter-parent`
- 没有 `spring-boot-starter-aop`

这说明 Maven 没有把 AOP 包下载到当前正在使用的本地仓库。

### 5. 检查 `settings.xml`

检查 `F:\software\apache-maven-3.9.11\conf\settings.xml` 后发现：

- 配置了阿里云镜像
- `mirrorOf` 写法异常
- 全量镜像 `*` 配置可能带来额外仓库解析问题

后续调整为优先只镜像 `central`。

## 最终修复

### 1. 修正 Web Services 依赖

把：

```xml
<artifactId>spring-boot-starter-webservices</artifactId>
```

改成：

```xml
<artifactId>spring-boot-starter-web-services</artifactId>
```

### 2. 移除不适用于当前版本线的测试 starter

原来写的是：

```xml
<artifactId>spring-boot-starter-web-services-test</artifactId>
```

在当前 Spring Boot 版本下，这个依赖不受父工程管理，因此会报：

```text
dependencies.dependency.version is missing
```

改为：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.springframework.ws</groupId>
    <artifactId>spring-ws-test</artifactId>
    <scope>test</scope>
</dependency>
```

### 3. 保留 AOP starter

最终 AOP 依赖使用：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

## 结论

这次问题的根因不是 `spring-boot-starter-aop`，而是：

1. `pom.xml` 中其他依赖坐标写错
2. IDEA 使用了自定义 Maven 本地仓库和自定义 `settings.xml`
3. Maven 模型解析失败后，导致多个依赖一起报红

## 经验总结

以后遇到依赖报红，不要先怀疑当前这一行依赖失效，优先做这几步：

1. 看 Maven 窗口里的第一条真实报错
2. 检查 `pom.xml` 中是否有其他依赖坐标写错
3. 确认 IDEA 当前使用的本地仓库路径
4. 确认 IDEA 当前使用的 `settings.xml`
5. 检查目标依赖是否真的下载到了当前本地仓库

## 本次最终可用方案

当前项目修复后，核心相关依赖包括：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web-services</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.springframework.ws</groupId>
    <artifactId>spring-ws-test</artifactId>
    <scope>test</scope>
</dependency>
```
