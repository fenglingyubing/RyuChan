---
title: Java基础八股三
description: Java基础八股文三
pubDate: 2026-03-14T10:50
image: /images/java-basic-8-stocks-03/35087021d8b10277.png
draft: false
tags:
  - Java
  - 八股
categories:
  - 八股
---
# 异常
![](/images/java-basic-8-stocks-03/2f5236f5d4bfc7d7.png)

# Exception 和 Error 有什么区别？
在 Java 中，所有的异常都有一个共同的祖先 java.lang 包中的 Throwable 类。Throwable 类有两个重要的子类:
- Exception :程序本身可以处理的异常，可以通过 catch 来进行捕获。Exception 又可以分为 Checked Exception (受检查异常，必须处理) 和 Unchecked Exception (不受检查异常，可以不处理)。
- Error ：Error 属于程序无法处理的错误 ，我们没办法通过 catch 来进行捕获不建议通过catch捕获 。例如 Java 虚拟机运行错误（Virtual MachineError）、虚拟机内存不够错误(OutOfMemoryError)、类定义错误（NoClassDefFoundError）等 。这些异常发生时，Java 虚拟机（JVM）一般会选择线程终止。

# ClassNotFoundException 和 NoClassDefFoundError 的区别
- ClassNotFoundException 是Exception，发生在使用反射等动态加载时找不到类，是可预期的，可以捕获处理。
- NoClassDefFoundError 是Error，是编译时存在的类，在运行时链接不到了（比如 jar 包缺失），是环境问题，导致 JVM 无法继续

# Checked Exception 和 Unchecked Exception 有什么区别？
Checked Exception 即 受检查异常 ，Java 代码在编译过程中，如果受检查异常没有被 catch或者throws 关键字处理的话，就没办法通过编译。

除了RuntimeException及其子类以外，其他的Exception类及其子类都属于受检查异常 。常见的受检查异常有：IO 相关的异常、ClassNotFoundException、SQLException...。

Unchecked Exception 即 不受检查异常 ，Java 代码在编译过程中 ，我们即使不处理不受检查异常也可以正常通过编译。RuntimeException 及其子类都统称为非受检查异常，常见的有（建议记下来，日常开发中会经常用到）：
- NullPointerException(空指针错误)
- IllegalArgumentException(参数错误比如方法入参类型错误)
- NumberFormatException（字符串转换为数字格式错误）
- IllegalArgumentException的子类）
- ArrayIndexOutOfBoundsException（数组越界错误）
- ClassCastException（类型转换错误）
- ArithmeticException（算术错误）
- SecurityException （安全错误比如权限不够）
- UnsupportedOperationException(不支持的操作错误比如重复创建同一用户)

# 你更倾向于使用 Checked Exception 还是 Unchecked Exception？
默认使用 Unchecked Exception，只在必要时才用 Checked Exception。

我们可以把 Unchecked Exception（比如 NullPointerException）看作是代码 Bug。对待 Bug，最好的方式是让它暴露出来然后去修复代码，而不是用 try-catch 去掩盖它。

一般来说，只在一种情况下使用 Checked Exception：当这个异常是业务逻辑的一部分，并且调用方必须处理它时。比如说，一个余额不足异常。这不是 bug，而是一个正常的业务分支，我需要用 Checked Exception 来强制调用者去处理这种情况，比如提示用户去充值。这样就能在保证关键业务逻辑完整性的同时，让代码尽可能保持简洁

# Throwable 类常用方法有哪些？
- String getMessage(): 返回异常发生时的详细信息
- String toString(): 返回异常发生时的简要描述
- String getLocalizedMessage(): 返回异常对象的本地化信息。使用 Throwable 的子类覆盖这个方法，可以生成本地化信息。如果子类没有覆盖该方法，则该方法返回的信息与 getMessage()返回的结果相同
- void printStackTrace(): 在控制台上打印 Throwable 对象封装的异常信息

# try-catch-finally 如何使用？
- try块：用于捕获异常。其后可接零个或多个 catch 块，如果没有 catch 块，则必须跟一个 finally 块。
- catch块：用于处理 try 捕获到的异常。
- finally 块：无论是否捕获或处理异常，finally 块里的语句都会被执行。当在 try 块或 catch 块中遇到 return 语句时，finally 语句块将在方法返回之前被执行。

> 注意：**不要在 finally 语句块中使用 return!** 当 try 语句和 finally 语句中都有 return 语句时，try 语句块中的 return 语句会被忽略。这是因为 try 语句中的 return 返回值会先被暂存在一个本地变量中，当执行到 finally 语句中的 return 之后，这个本地变量的值就变为了 finally 语句中的 return 返回值

# finally 中的代码一定会执行吗？
不一定的！在某些情况下，finally 中的代码不会被执行。
-  finally 之前虚拟机被终止运行的话，finally 中的代码就不会被执行
- 程序所在的线程死亡。
- 关闭 CPU。

# 如何使用 try-with-resources 代替try-catch-finally？
1. **适用范围（资源的定义）**： 任何实现 java.lang.AutoCloseable或者 java.io.Closeable 的对象
2.** 关闭资源和 finally 块的执行顺序**： 在 try-with-resources 语句中，任何 catch 或 finally 块在声明的资源关闭后运行

Java 中类似于InputStream、OutputStream、Scanner、PrintWriter等的资源都需要我们调用close()方法来手动关闭，一般情况下我们都是通过try-catch-finally语句来实现这个需求

```java
//读取文本文件的内容
Scanner scanner = null;
try {
    scanner = new Scanner(new File("D://read.txt"));
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} finally {
    if (scanner != null) {
        scanner.close();
    }
}
```
使用 Java 7 之后的 try-with-resources 语句改造上面的代码:
```java
try (Scanner scanner = new Scanner(new File("test.txt"))) {
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException fnfe) {
    fnfe.printStackTrace();
}
```
当然多个资源需要关闭的时候，使用 try-with-resources 实现起来也非常简单，如果你还是用try-catch-finally可能会带来很多问题。

通过使用分号分隔，可以在try-with-resources块中声明多个资源
```java
try (BufferedInputStream bin = new BufferedInputStream(new FileInputStream(new File("test.txt")));
     BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream(new File("out.txt")))) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}
```

# 异常使用有哪些需要注意的地方？
- 不要把异常定义为静态变量，因为这样会导致异常栈信息错乱。每次手动抛出异常，我们都需要手动 new 一个异常对象抛出。
- 抛出的异常信息一定要有意义。
- 建议抛出更加具体的异常，比如字符串转换为数字格式错误的时候应该抛出NumberFormatException而不是其父类IllegalArgumentException。
- 避免重复记录日志：如果在捕获异常的地方已经记录了足够的信息（包括异常类型、错误信息和堆栈跟踪等），那么在业务代码中再次抛出这个异常时，就不应该再次记录相同的错误信息。重复记录日志会使得日志文件膨胀，并且可能会掩盖问题的实际原因，使得问题更难以追踪和解决。

# 什么是泛型？有什么作用？
Java 泛型（Generics） 是 JDK 5 中引入的一个新特性。使用泛型参数，可以增强代码的可读性以及稳定性。

编译器可以对泛型参数进行检测，并且通过泛型参数可以指定传入的对象类型。比如 ArrayList<Person> persons = new ArrayList<Person>() 这行代码就指明了该 ArrayList 对象只能传入 Person 对象，如果传入其他类型的对象就会报错。
```java
ArrayList<E> extends AbstractList<E>
```
并且，原生 List 返回类型是 Object ，需要手动转换类型才能使用，使用泛型后编译器自动转换。

# 泛型的使用方式有哪几种？
1. 1.泛型类：
```
//此处T可以随便写为任意标识，常见的如T、E、K、V等形式的参数常用于表示泛型
//在实例化泛型类时，必须指定T的具体类型
public class Generic<T>{

    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey(){
        return key;
    }
}
```
如何实例化泛型类：
```
Generic<Integer> genericInteger = new Generic<Integer>(123456);
```

2. 泛型接口：
```
public interface Generator<T> {
    public T method();
}
```
实现泛型接口，不指定类型：
```
class GeneratorImpl<T> implements Generator<T>{
    @Override
    public T method() {
        return null;
    }
}
```
实现泛型接口，指定类型：
```
class GeneratorImpl implements Generator<String> {
    @Override
    public String method() {
        return "hello";
    }
}
```

3. 泛型方法：
```
   public static < E > void printArray( E[] inputArray )
   {
         for ( E element : inputArray ){
            System.out.printf( "%s ", element );
         }
         System.out.println();
    }
```
使用：
```
// 创建不同类型数组：Integer, Double 和 Character
Integer[] intArray = { 1, 2, 3 };
String[] stringArray = { "Hello", "World" };
printArray( intArray  );
printArray( stringArray  );
```

> 注意: public static < E > void printArray( E[] inputArray ) 一般被称为静态泛型方法;在 java 中泛型只是一个占位符，必须在传递类型后才能使用。类在实例化时才能真正的传递类型参数，由于静态方法的加载先于类的实例化，也就是说类中的泛型还没有传递真正的类型参数，静态的方法的加载就已经完成了，所以静态泛型方法是没有办法使用类上声明的泛型的。只能使用自己声明的 <E>

# 项目中哪里用到了泛型？
- 自定义接口通用返回结果 CommonResult<T> 通过参数 T 可根据具体的返回类型动态指定结果的数据类型定义 
- Excel 处理类 ExcelUtil<T> 用于动态指定 Excel 导出的数据类型
- 构建集合工具类（参考 Collections 中的 sort, binarySearch 方法）。

> 2026/3/14