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
badge: ''
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

# Object 类的常见方法有哪些？
Object 类是一个特殊的类，是所有类的父类，主要提供了以下 11 个方法：
```java
/**
 * native 方法，用于返回当前运行时对象的 Class 对象，使用了 final 关键字修饰，故不允许子类重写。
 */
public final native Class<?> getClass()
/**
 * native 方法，用于返回对象的哈希码，主要使用在哈希表中，比如 JDK 中的HashMap。
 */
public native int hashCode()
/**
 * 用于比较 2 个对象的内存地址是否相等，String 类对该方法进行了重写以用于比较字符串的值是否相等。
 */
public boolean equals(Object obj)
/**
 * native 方法，用于创建并返回当前对象的一份拷贝。
 */
protected native Object clone() throws CloneNotSupportedException
/**
 * 返回类的名字实例的哈希码的 16 进制的字符串。建议 Object 所有的子类都重写这个方法。
 */
public String toString()
/**
 * native 方法，并且不能重写。唤醒一个在此对象监视器上等待的线程(监视器相当于就是锁的概念)。如果有多个线程在等待只会任意唤醒一个。
 */
public final native void notify()
/**
 * native 方法，并且不能重写。跟 notify 一样，唯一的区别就是会唤醒在此对象监视器上等待的所有线程，而不是一个线程。
 */
public final native void notifyAll()
/**
 * native方法，并且不能重写。暂停线程的执行。注意：sleep 方法没有释放锁，而 wait 方法释放了锁 ，timeout 是等待时间。
 */
public final native void wait(long timeout) throws InterruptedException
/**
 * 多了 nanos 参数，这个参数表示额外时间（以纳秒为单位，范围是 0-999999）。 所以超时的时间还需要加上 nanos 纳秒。。
 */
public final void wait(long timeout, int nanos) throws InterruptedException
/**
 * 跟之前的2个wait方法一样，只不过该方法一直等待，没有超时时间这个概念
 */
public final void wait() throws InterruptedException
/**
 * 实例被垃圾回收器回收的时候触发的操作
 */
protected void finalize() throws Throwable { }
```

equals() 方法存在两种使用情况：
- 类没有重写 equals()方法：通过equals()比较该类的两个对象时，等价于通过“==”比较这两个对象，使用的默认是 Object类equals()方法。
- 类重写了 equals()方法：一般我们都重写 equals()方法来比较两个对象中的属性是否相等；若它们的属性相等，则返回 true(即，认为这两个对象相等)。

> **String 中的 equals 方法是被重写过的**，因为 Object 的 equals 方法是比较的对象的内存地址，而 String 的 equals 方法比较的是对象的值。

# hashCode() 有什么用？
hashCode() 的作用是获取哈希码（int 整数），也称为**散列码**。这个哈希码的作用是确定该对象在哈希表中的索引位置。
![](/images/java-basic-8-stocks-02/394423fd97aa29fc.png)

hashCode() 定义在 JDK 的 Object 类中，这就意味着 Java 中的任何类都包含有 hashCode() 函数。另外需要注意的是：Object 的 hashCode() 方法是本地方法，也就是用 C 语言或 C++ 实现的

散列表存储的是键值对(key-value)，它的特点是：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象）

# 为什么要有 hashCode？
我们以“HashSet 如何检查重复”为例子来说明为什么要有 hashCode？
当我们把对象加入 HashSet 时，HashSet 会先调用对象的 hashCode() 方法，得到一个“哈希值”，并通过内部散列函数对这个哈希值再做一次简单的转换（比如取余），决定这条数据应该放进底层数组的哪一个桶（bucket，对应到底层数组的某个位置）：
1. 如果该桶当前是空的，就直接将对象对应的节点插入到这个桶中。
2. 如果该桶中已经有其他元素，HashSet 会在这个桶对应的链表或红黑树中逐个比较： 
- 对于哈希值不同的节点，直接跳过；
- 对于哈希值相同的节点，则会进一步调用 equals() 方法来检查这两个对象是否“相等”： 
	– 如果 equals() 返回 true，说明集合中已经存在与当前对象等价的元素，HashSet 就不会再次加入它；
	– 如果返回 false， 则认为是新元素，会将该对象作为一个新节点加入到同一个桶的链表或红黑树中。

通过先利用 hashCode() 将候选范围缩小到同一个桶内，再在桶内少量元素上调用 equals() 做精确判断，HashSet 大大减少了 equals() 的调用次数，从而提高了查找和插入的执行效率。

那为什么 JDK 还要同时提供这两个方法呢？
这是因为在一些容器（比如 HashMap、HashSet）中，有了 hashCode() 之后，判断元素是否在对应容器中的效率会更高（参考添加元素进HashSet的过程）！

我们在前面也提到了添加元素进HashSet的过程，如果 HashSet 在对比的时候，同样的 hashCode 有多个对象，它会继续使用 equals() 来判断是否真的相同。也就是说 hashCode 帮助我们大大缩小了查找成本。

那为什么不只提供 hashCode() 方法呢？
这是因为两个对象的hashCode 值相等并不代表两个对象就相等。

那为什么两个对象有相同的 hashCode 值，它们也不一定是相等的？
因为 hashCode() 所使用的哈希算法也许刚好会让多个对象传回相同的哈希值。越糟糕的哈希算法越容易碰撞，但这也与数据值域分布的特性有关（所谓哈希碰撞就是指不同的对象得到相同的 hashCode )

- 如果两个对象的hashCode 值相等，那这两个对象不一定相等（哈希碰撞）。
- 如果两个对象的hashCode 值相等并且equals()方法也返回 true，我们才认为这两个对象相等。
- 如果两个对象的hashCode 值不相等，我们就可以直接认为这两个对象不相等。

# 为什么重写 equals() 时必须重写 hashCode() 方法？
因为两个相等的对象的 hashCode 值必须是相等。也就是说如果 equals 方法判断两个对象是相等的，那这两个对象的 hashCode 值也要相等。

如果重写 equals() 时没有重写 hashCode() 方法的话就可能会导致 equals 方法判断是相等的两个对象，hashCode 值却不相等。

总结：
- equals 方法判断两个对象是相等的，那这两个对象的 hashCode 值也要相等。
- 两个对象有相同的 hashCode 值，他们也不一定是相等的（哈希碰撞）。

思考：重写 equals() 时没有重写 hashCode() 方法的话，使用 HashMap 可能会出现什么问题？
会出现“逻辑上相等的对象，在 HashMap 里却找不到、去重失败、出现重复键”的问题。

原因是：

- HashMap 先用 hashCode() 决定对象放进哪个桶
- 只有哈希值相同，才会继续用 equals() 比较是否是同一个键
- 如果你只重写了 equals()，却没重写 hashCode()，就可能出现：

	- 两个对象 equals() 返回 true
	- 但它们的 hashCode() 不一样
	- 于是它们被放进不同桶里
	- HashMap 会把它们当成两个不同的 key

# String、StringBuffer、StringBuilder 的区别？
- **可变性**
- **线程安全性**
- **性能** ： 每次对 String 类型进行改变的时候，都会生成一个新的 String 对象，然后将指针指向新的 String 对象。StringBuffer 每次都会对 StringBuffer 对象本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用 StringBuilder 相比使用 StringBuffer 仅能获得 10%~15% 左右的性能提升，但却要冒多线程不安全的风险。

对于三者使用的总结：
- 操作少量的数据: 适用 String
- 单线程操作字符串缓冲区下操作大量数据: 适用 StringBuilder
- 多线程操作字符串缓冲区下操作大量数据: 适用 StringBuffer

# String 为什么是不可变的?
1. 保存字符串的数组被 final 修饰且为私有的，并且String 类没有提供/暴露修改这个字符串的方法。
2. String 类被 final 修饰导致其不能被继承，进而避免了子类破坏 String 不可变。

Java 9 为何要将 String 的底层实现由 char[] 改成了 byte[] ?
新版的 String 其实支持两个编码方案：Latin-1 和 UTF-16。如果字符串中包含的汉字没有超过 Latin-1 可表示范围内的字符，那就会使用 Latin-1 作为编码方案。Latin-1 编码方案下，byte 占一个字节(8 位)，char 占用 2 个字节（16），byte 相较 char 节省一半的内存空间。JDK 官方就说了绝大部分字符串对象只包含 Latin-1 可表示的字符。

# 字符串拼接用“+” 还是 StringBuilder?
Java 语言本身并不支持运算符重载，“+”和“+=”是专门为 String 类重载过的运算符，也是 Java 中仅有的两个重载过的运算符。
```java
String str1 = "he";
String str2 = "llo";
String str3 = "world";
String str4 = str1 + str2 + str3;
```

字符串对象通过“+”的字符串拼接方式，实际上是通过 StringBuilder 调用 append() 方法实现的，拼接完成之后调用 toString() 得到一个 String 对象 。

在循环内使用“+”进行字符串的拼接的话，存在比较明显的缺陷：编译器不会创建单个 StringBuilder 以复用，会导致创建过多的 StringBuilder 对象。

如果直接使用 StringBuilder 对象进行字符串拼接的话，就不会存在这个问题了。

# String#equals() 和 Object#equals() 有何区别？String 中的 equals 方法是被重写过的，比较的是 String 字符串的值是否相等。 Object 的 equals 方法是比较的对象的内存地址

# 字符串常量池的作用了解吗？
字符串常量池 是 JVM 为了提升性能和减少内存消耗针对字符串（String 类）专门开辟的一块区域，主要目的是为了避免字符串的重复创建。
```java
// 1.在字符串常量池中查询字符串对象 "ab"，如果没有则创建"ab"并放入字符串常量池
// 2.将字符串对象 "ab" 的引用赋值给 aa
String aa = "ab";
// 直接返回字符串常量池中字符串对象 "ab"，赋值给引用 bb
String bb = "ab";
System.out.println(aa==bb); // true
```

# String s1 = new String("abc");这句话创建了几个字符串对象？
**会创建 1 或 2 个字符串对象**。
- 字符串常量池中不存在 "abc"：会创建 2 个 字符串对象。一个在字符串常量池中，由 ldc 指令触发创建。一个在堆中，由 new String() 创建，并使用常量池中的 "abc" 进行初始化。
- 字符串常量池中已存在 "abc"：会创建 1 个 字符串对象。该对象在堆中，由 new String() 创建，并使用常量池中的 "abc" 进行初始化

# String#intern 方法有什么作用?
String.intern() 是一个 native (本地) 方法，用来处理字符串常量池中的字符串对象引用。它的工作流程可以概括为以下两种情况：
1. 常量池中已有相同内容的字符串对象：如果字符串常量池中已经有一个与调用 intern() 方法的字符串内容相同的 String 对象，intern() 方法会直接返回常量池中该对象的引用。
2. 常量池中没有相同内容的字符串对象：如果字符串常量池中还没有一个与调用 intern() 方法的字符串内容相同的对象，intern() 方法会将当前字符串对象的引用添加到字符串常量池中，并返回该引用。

总结：
- intern() 方法的主要作用是确保字符串引用在常量池中的唯一性。
- 当调用 intern() 时，如果常量池中已经存在相同内容的字符串，则返回常量池中已有对象的引用；否则，将该字符串添加到常量池并返回其引用。

# String 类型的变量和常量做“+”运算时发生了什么？
对于编译期可以确定值的字符串，也就是常量字符串 ，jvm 会将其存入字符串常量池。并且，字符串常量拼接得到的字符串常量在编译阶段就已经被存放字符串常量池，这个得益于编译器的优化。

常量折叠会把常量表达式的值求出来作为常量嵌在最终生成的代码中，这是 Javac 编译器会对源代码做的极少量优化措施之一(代码优化几乎都在即时编译器中进行)。

并不是所有的常量都会进行折叠，只有编译器在程序编译期就可以确定值的常量才可以：
1. 基本数据类型( byte、boolean、short、char、int、float、long、double)以及字符串常量。
2. final 修饰的基本数据类型和字符串变量
3. 字符串通过 “+”拼接得到的字符串、基本数据类型之间算数运算（加减乘除）、基本数据类型的位运算（<<、>>、>>> ）

> 我们在平时写代码的时候，尽量避免多个字符串对象拼接，因为这样会重新创建对象。如果需要改变字符串的话，可以使用 StringBuilder 或者 StringBuffer。

> 2026/3/13