---
title: Java基础八股二
description: Java面试基础八股
pubDate: 2026-03-12T13:39
image: /images/java-basic-8-stocks-02/35087021d8b10277.png
draft: false
tags:
  - Java
  - 八股
categories:
  - 八股
---
# 面向对象和面向过程的区别
面向过程编程（Procedural-Oriented Programming，POP）和面向对象编程（Object-Oriented Programming，OOP）是两种常见的编程范式，两者的主要区别在于解决问题的方式不同：面向过程编程（POP）：面向过程把解决问题的过程拆成一个个方法，通过一个个方法的执行解决问题。面向对象编程（OOP）：面向对象会先抽象出对象，然后用对象执行方法的方式解决问题。
**相比较于 POP，OOP 开发的程序一般具有下面这些优点：**
- 易维护：由于良好的结构和封装性，OOP 程序通常更容易维护。
- 易复用：通过继承和多态，OOP 设计使得代码更具复用性，方便扩展功能。
- 易扩展：模块化设计使得系统扩展变得更加容易和灵活。

POP 的编程方式通常更为简单和直接，适合处理一些较简单的任务。
![](/images/java-basic-8-stocks-02/fedbb93026f73365.png)

# 创建一个对象用什么运算符?对象实例与对象引用有何不同?
new 运算符，new 创建对象实例（对象实例在堆内存中），对象引用指向对象实例（对象引用存放在栈内存中）。
- 一个对象引用可以指向 0 个或 1 个对象（一根绳子可以不系气球，也可以系一个气球）；
- 一个对象可以有 n 个引用指向它（可以用 n 条绳子系住一个气球）。
```java
Dog d = new Dog();
```
new Dog()就是实例对象
d 则是对象的引用

# 对象的相等和引用相等的区别
- 对象的相等一般比较的是内存中存放的内容是否相等。
- 引用相等一般比较的是他们指向的内存地址是否相等。

> 对象的相等看的是内容是否相等，而引用相等看的是是否指向同一个内存地址

```java
String str1 = "hello";
String str2 = new String("hello");
String str3 = "hello";
// 使用 == 比较字符串的引用相等
System.out.println(str1 == str2);
System.out.println(str1 == str3);
// 使用 equals 方法比较字符串的相等
System.out.println(str1.equals(str2));
System.out.println(str1.equals(str3));
```
输出内容
```plain
false
true
true
true
```
- str1 和 str2 不相等，而 str1 和 str3 相等。这是因为 == 运算符比较的是字符串的引用是否相等。
- str1、 str2、str3 三者的内容都相等。这是因为equals 方法比较的是字符串的内容，即使这些字符串的对象引用不同，只要它们的内容相等，就认为它们是相等的

# 如果一个类没有声明构造方法，该程序能正确执行吗?
构造方法是一种特殊的方法，主要作用是完成对象的初始化工作。

- 如果一个类没有声明构造方法，**也可以执行**！因为一个类即使没有声明构造方法也会有默认的不带参数的构造方法。**如果我们自己添加了类的构造方法（无论是否有参），Java 就不会添加默认的无参数的构造方法了。**

#  构造方法有哪些特点？是否可被 override?
- 名称与类名相同：构造方法的名称必须与类名完全一致。
- 没有返回值：构造方法没有返回类型，且不能使用 void 声明。
- 自动执行：在生成类的对象时，构造方法会自动执行，无需显式调用。

**构造方法不能被重写（override）**，但可以被重载（overload）。因此，一个类中可以有多个构造方法，这些构造方法可以具有不同的参数列表，以提供不同的对象初始化方式。
面向对象三大特征
**封装、继承、多态**

- **封装**：封装是指把一个对象的状态信息（也就是属性）隐藏在对象内部，不允许外部对象直接访问对象的内部信息。但是可以提供一些可以被外界访问的方法来操作属性
- **继承**：继承是使用已存在的类的定义作为基础建立新类的技术，新类的定义可以增加新的数据或新的功能，也可以用父类的功能，但不能选择性地继承父类。通过使用继承，可以快速地创建新的类，可以提高代码的重用，程序的可维护性，节省大量创建新类的时间 ，提高我们的开发效率。
	1. 子类拥有父类对象所有的属性和方法（包括私有属性和私有方法），但是父类中的私有属性和方法子类是无法访问，只是拥有。
	2. 子类可以拥有自己属性和方法，即子类可以对父类进行扩展。
	3. 子类可以用自己的方式实现父类的方法。（以后介绍）。
- **多态**：多态，顾名思义，表示一个对象具有多种的状态，具体表现为父类的引用指向子类的实例。
	- 对象类型和引用类型之间具有继承（类）/实现（接口）的关系；
	- 引用类型变量发出的方法调用的到底是哪个类中的方法，必须在程序运行期间才能确定；
	- 多态不能调用“只在子类存在但在父类不存在”的方法；
	- 如果子类重写了父类的方法，真正执行的是子类重写的方法，如果子类没有重写父类的方法，执行的是父类的方法。
![](/images/java-basic-8-stocks-02/92f650a5975a6e45.svg)

# 接口和抽象类有什么共同点和区别?
- 接口和抽象类的共同点
	1. 实例化：接口和抽象类都不能直接实例化，只能被实现（接口）或继承（抽象类）后才能创建具体的对象。
	2. 抽象方法：接口和抽象类都可以包含抽象方法。抽象方法没有方法体，必须在子类或实现类中实现

- 接口和抽象类的区别
	- **设计目的**：接口主要用于对类的行为进行约束，你实现了某个接口就具有了对应的行为。抽象类主要用于代码复用，强调的是所属关系。
	- **继承和实现**：一个类只能继承一个类（包括抽象类），因为 Java 不支持多继承。但一个类可以实现多个接口，一个接口也可以继承多个其他接口。
	- **成员变量**：接口中的成员变量只能是 public static final 类型的，不能被修改且必须有初始值。抽象类的成员变量可以有任何修饰符（private, protected, public），可以在子类中被重新定义或赋值。
	- **方法**： 
		- Java 8 之前，接口中的方法默认是 public abstract ，也就是只能有方法声明。自 Java 8 起，可以在接口中定义 default（默认） 方法和 static （静态）方法。 自 Java 9 起，接口可以包含 private 方法。
		- 抽象类可以包含抽象方法和非抽象方法。抽象方法没有方法体，必须在子类中实现。非抽象方法有具体实现，可以直接在抽象类中使用或在子类中重写。

在 Java 8 及以上版本中，接口引入了新的方法类型：default 方法、static 方法和 private 方法。这些方法让接口的使用更加灵活。
```java
public interface MyInterface {
    default void defaultMethod() {
        System.out.println("This is a default method.");
    }
}
```

Java 8 引入的static 方法无法在实现类中被覆盖，只能通过接口名直接调用（ MyInterface.staticMethod()），类似于类中的静态方法。static 方法通常用于定义一些通用的、与接口相关的工具方法，一般很少用。
```java
public interface MyInterface {
    static void staticMethod() {
        System.out.println("This is a static method in the interface.");
    }
}
```
Java 9 允许在接口中使用 private 方法。private方法可以用于在接口内部共享代码，不对外暴露。
```java
public interface MyInterface {
    // default 方法
    default void defaultMethod() {
        commonMethod();
    }

    // static 方法
    static void staticMethod() {
        commonMethod();
    }

    // 私有静态方法，可以被 static 和 default 方法调用
    private static void commonMethod() {
        System.out.println("This is a private method used internally.");
    }

      // 实例私有方法，只能被 default 方法调用。
    private void instanceCommonMethod() {
        System.out.println("This is a private instance method used internally.");
    }
}
```

# 深拷贝和浅拷贝区别了解吗？什么是引用拷贝？
![](/images/java-basic-8-stocks-02/7482f51914c07bce.svg)
**浅拷贝**：浅拷贝会在堆上创建一个新的对象（区别于引用拷贝的一点），不过，如果原对象内部的属性是引用类型的话，浅拷贝会直接复制内部对象的引用地址，也就是说拷贝对象和原对象共用同一个内部对象。
> ChatGPT:只复制对象本身这一层的数据；如果对象里的某个属性是引用类型，那么复制后，新旧对象会共享这块引用指向的数据。
![](/images/java-basic-8-stocks-02/110bcd7b0955d0fe.png)

**深拷贝**：深拷贝会完全复制整个对象，包括这个对象所包含的内部对象。
> ChatGPT:不仅复制对象本身，还会把对象内部所有引用类型成员也重新复制一份。
![](/images/java-basic-8-stocks-02/7f251bdd2948a894.png)

**引用拷贝**：简单来说，引用拷贝就是两个不同的引用指向同一个对象。
> ChatGPT:本质上不是复制对象，而是复制“引用”。
![](/images/java-basic-8-stocks-02/c728413e0dd6469c.png)

> 2026/3/12