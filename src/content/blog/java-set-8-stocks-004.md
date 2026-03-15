---
title: Java集合常见面试题一
description: java集合常见面试题一
pubDate: 2026-03-15T19:03
image: /images/java-set-8-stocks-004/75154943182e8f37.png
draft: false
tags:
  - Java
  - 八股
categories:
  - 八股
---
# 集合概览
Java 集合，也叫作容器，主要是由两大接口派生而来：一个是 Collection接口，主要用于存放单一元素；另一个是 Map 接口，主要用于存放键值对。对于Collection 接口，下面又有三个主要的子接口：List、Set 、 Queue。

![](/images/java-set-8-stocks-004/403784f60579575b.png)

# ⭐️说说 List, Set, Queue, Map 四者的区别？
- List(对付顺序的好帮手): 存储的元素是有序的、可重复的。
- Set(注重独一无二的性质): 存储的元素不可重复的。
- Queue(实现排队功能的叫号机): 按特定的排队规则来确定先后顺序，存储的元素是有序的、可重复的。
- Map(用 key 来搜索的专家): 使用键值对（key-value）存储，类似于数学上的函数 y=f(x)，"x" 代表 key，"y" 代表 value，key 是无序的、不可重复的，value 是无序的、可重复的，每个键最多映射到一个值。

# 集合框架底层数据结构总结
先来看一下 `Collection` 接口下面的集合。
**List**:
- **ArrayList**：Object[] 数组。
- **Vector**：Object[] 数组。
- **LinkedList**：双向链表(JDK1.6 之前为循环链表，JDK1.7 取消了循环)。

**Set**:
- HashSet(无序，唯一): 基于 HashMap 实现的，底层采用 HashMap 来保存元素。
- LinkedHashSet: LinkedHashSet 是 HashSet 的子类，并且其内部是通过 
- LinkedHashMap 来实现的。TreeSet(有序，唯一): 红黑树(自平衡的排序二叉树)。

**Queue**:
- PriorityQueue: Object[] 数组来实现小顶堆。
- DelayQueue:PriorityQueue。
- ArrayDeque: 可扩容动态双向数组。

再来看看 Map 接口下面的集合。

**Map**
- HashMap：JDK1.8 之前 HashMap 由数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。
- LinkedHashMap：LinkedHashMap 继承自 HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- Hashtable：数组+链表组成的，数组是 Hashtable 的主体，链表则是主要为了解决哈希冲突而存在的。
- TreeMap：红黑树（自平衡的排序二叉树）。

# 如何选用集合?
当我们需要存储一组类型相同的数据时，数组是最常用且最基本的容器之一。但是，使用数组存储对象存在一些不足之处，因为在实际开发中，存储的数据类型多种多样且数量不确定。这时，Java 集合就派上用场了。与数组相比，Java 集合提供了更灵活、更有效的方法来存储多个数据对象。Java 集合框架中的各种集合类和接口可以存储不同类型和数量的对象，同时还具有多样化的操作方式。相较于数组，Java 集合的优势在于它们的大小可变、支持泛型、具有内建算法等。总的来说，Java 集合提高了数据的存储和处理灵活性，可以更好地适应现代软件开发中多样化的数据需求，并支持高质量的代码编写。

# ⭐️ArrayList 和 Array（数组）的区别？
ArrayList 内部基于动态数组实现，比 Array（静态数组） 使用起来更加灵活：
- ArrayList会根据实际存储的元素动态地扩容或缩容，而 Array 被创建之后就不能改变它的长度了。
- ArrayList 允许你使用泛型来确保类型安全，Array 则不可以。
- ArrayList 中只能存储对象。对于基本类型数据，需要使用其对应的包装类（如 Integer、Double 等）。Array 可以直接存储基本类型数据，也可以存储对象。
- ArrayList 支持插入、删除、遍历等常见操作，并且提供了丰富的 API 操作方法，比如 add()、remove()等。Array 只是一个固定长度的数组，只能按照下标访问其中的元素，不具备动态添加、删除元素的能力。
- ArrayList创建时不需要指定大小，而Array创建时必须指定大小。

`Array`:
```java
 // 初始化一个 String 类型的数组
 String[] stringArr = new String[]{"hello", "world", "!"};
 // 修改数组元素的值
 stringArr[0] = "goodbye";
 System.out.println(Arrays.toString(stringArr));// [goodbye, world, !]
 // 删除数组中的元素，需要手动移动后面的元素
 for (int i = 0; i < stringArr.length - 1; i++) {
     stringArr[i] = stringArr[i + 1];
 }
 stringArr[stringArr.length - 1] = null;
 System.out.println(Arrays.toString(stringArr));// [world, !, null]
```

`ArrayList`:
```java
// 初始化一个 String 类型的 ArrayList
 ArrayList<String> stringList = new ArrayList<>(Arrays.asList("hello", "world", "!"));
// 添加元素到 ArrayList 中
 stringList.add("goodbye");
 System.out.println(stringList);// [hello, world, !, goodbye]
 // 修改 ArrayList 中的元素
 stringList.set(0, "hi");
 System.out.println(stringList);// [hi, world, !, goodbye]
 // 删除 ArrayList 中的元素
 stringList.remove(0);
 System.out.println(stringList); // [world, !, goodbye]
```

# ArrayList 和 Vector 的区别?（了解即可）
- ArrayList 是 List 的主要实现类，底层使用 Object[]存储，适用于频繁的查找工作，线程不安全 。
- Vector 是 List 的古老实现类，底层使用Object[] 存储，线程安全

# Vector 和 Stack 的区别?（了解即可）
- Vector 和 Stack 两者都是线程安全的，都是使用 synchronized 关键字进行同步处理。
- Stack 继承自 Vector，是一个后进先出的栈，而 Vector 是一个列表。

随着 Java 并发编程的发展，Vector 和 Stack 已经被淘汰，推荐使用并发集合类（例如 ConcurrentHashMap、CopyOnWriteArrayList 等）或者手动实现线程安全的方法来提供安全的多线程操作支持。

# ArrayList 可以添加 null 值吗？
ArrayList 中可以存储任何类型的对象，包括 null 值。不过，不建议向ArrayList 中添加 null 值， null 值无意义，会让代码难以维护比如忘记做判空处理就会导致空指针异常。

# ⭐️ArrayList 插入和删除元素的时间复杂度？
**对于插入：**
- 头部插入：由于需要将所有元素都依次向后移动一个位置，因此时间复杂度是 O(n)。
- 尾部插入：当 ArrayList 的容量未达到极限时，往列表末尾插入元素的时间复杂度是 O(1)，因为它只需要在数组末尾添加一个元素即可；当容量已达到极限并且需要扩容时，则需要执行一次 O(n) 的操作将原数组复制到新的更大的数组中，然后再执行 O(1) 的操作添加元素。
- 指定位置插入：需要将目标位置之后的所有元素都向后移动一个位置，然后再把新元素放入指定位置。这个过程需要移动平均 n/2 个元素，因此时间复杂度为 O(n)。

**对于删除：**
- 头部删除：由于需要将所有元素依次向前移动一个位置，因此时间复杂度是 O(n)。
- 尾部删除：当删除的元素位于列表末尾时，时间复杂度为 O(1)。
- 指定位置删除：需要将目标元素之后的所有元素向前移动一个位置以填补被删除的空白位置，因此需要移动平均 n/2 个元素，时间复杂度为 O(n)。

# ⭐️LinkedList 插入和删除元素的时间复杂度？
- 头部插入/删除：只需要修改头结点的指针即可完成插入/删除操作，因此时间复杂度为 O(1)。
- 尾部插入/删除：只需要修改尾结点的指针即可完成插入/删除操作，因此时间复杂度为 O(1)。
- 指定位置插入/删除：需要先移动到指定位置，再修改指定节点的指针完成插入/删除，不过由于有头尾指针，可以从较近的指针出发，因此需要遍历平均 n/4 个元素，时间复杂度为 O(n)。
![](/images/java-set-8-stocks-004/b46339d8165a3585.png)

# LinkedList 为什么不能实现 RandomAccess 接口？
RandomAccess 是一个标记接口，用来表明实现该接口的类支持随机访问（即可以通过索引快速访问元素）。由于 LinkedList 底层数据结构是链表，内存地址不连续，只能通过指针来定位，不支持随机快速访问，所以不能实现 RandomAccess 接口。

# ⭐️ArrayList 与 LinkedList 区别?
- **是否保证线程安全**： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
- **底层数据结构**： ArrayList 底层使用的是 Object 数组；LinkedList 底层使用的是 双向链表 数据结构（JDK1.6 之前为循环链表，JDK1.7 取消了循环。注意双向链表和双向循环链表的区别，下面有介绍到！）
- **插入和删除是否受元素位置的影响**：
	- ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行add(E e)方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是 O(1)。但是如果要在指定位置 i 插入和删除元素的话（add(int index, E element)），时间复杂度就为 O(n)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
	- LinkedList 采用链表存储，所以在头尾插入或者删除元素不受元素位置的影响（add(E e)、addFirst(E e)、addLast(E e)、removeFirst()、 removeLast()），时间复杂度为 O(1)，如果是要在指定位置 i 插入和删除元素的话（add(int index, E element)，remove(Object o),remove(int index)）， 时间复杂度为 O(n) ，因为需要先移动到指定位置再插入和删除。
- **是否支持快速随机访问**： LinkedList 不支持高效的随机元素访问，而 ArrayList（实现了 RandomAccess 接口） 支持。快速随机访问就是通过元素的序号快速获取元素对象(对应于get(int index)方法)。
- **内存空间占用**： ArrayList 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。

我们在项目中一般是不会使用到 LinkedList 的，需要用到 LinkedList 的场景几乎都可以使用 ArrayList 来代替，并且，性能通常会更好！就连 LinkedList 的作者约书亚 · 布洛克（Josh Bloch）自己都说从来不会使用 LinkedList 

另外，不要下意识地认为 LinkedList 作为链表就最适合元素增删的场景。我在上面也说了，LinkedList 仅仅在头尾插入或者删除元素的时候时间复杂度近似 O(1)，其他情况增删元素的平均时间复杂度都是 O(n) 。

双向链表和双向循环链表
**双向链表**： 包含两个指针，一个 prev 指向前一个节点，一个 next 指向后一个节点。
![](/images/java-set-8-stocks-004/9623740181559971.png)

**双向循环链表**： 最后一个节点的 next 指向 head，而 head 的 prev 指向最后一个节点，构成一个环。
![](/images/java-set-8-stocks-004/d996c1fc42e8715e.png)

RandomAccess 接口
查看源码我们发现实际上 RandomAccess 接口中什么都没有定义。所以，在我看来 RandomAccess 接口不过是一个标识罢了。标识什么？ 标识实现这个接口的类具有随机访问功能。
```java
public interface RandomAccess {
}
```
在 binarySearch() 方法中，它要判断传入的 list 是否 RandomAccess 的实例，如果是，调用indexedBinarySearch()方法，如果不是，那么调用iteratorBinarySearch()方法
```java
    public static <T>
    int binarySearch(List<? extends Comparable<? super T>> list, T key) {
        if (list instanceof RandomAccess || list.size()<BINARYSEARCH_THRESHOLD)
            return Collections.indexedBinarySearch(list, key);
        else
            return Collections.iteratorBinarySearch(list, key);
    }
```

ArrayList 实现了 RandomAccess 接口， 而 LinkedList 没有实现。为什么呢？我觉得还是和底层数据结构有关！ArrayList 底层是数组，而 LinkedList 底层是链表。数组天然支持随机访问，时间复杂度为 O(1)，所以称为快速随机访问。链表需要遍历到特定位置才能访问特定位置的元素，时间复杂度为 O(n)，所以不支持快速随机访问。ArrayList 实现了 RandomAccess 接口，就表明了他具有快速随机访问功能。 RandomAccess 接口只是标识，并不是说 ArrayList 实现 RandomAccess 接口才具有快速随机访问功能的！

# 说一说 ArrayList 的扩容机制吧
**先从 ArrayList 的构造函数说起**
ArrayList 有三种方式来初始化，构造方法源码如下（JDK8）：
```java
/**
 * 默认初始容量大小
 */
private static final int DEFAULT_CAPACITY = 10;

private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
 * 默认构造函数，使用初始容量10构造一个空列表(无参数构造)
 */
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
 * 带初始容量参数的构造函数。（用户自己指定容量）
 */
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {//初始容量大于0
        //创建initialCapacity大小的数组
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {//初始容量等于0
        //创建空数组
        this.elementData = EMPTY_ELEMENTDATA;
    } else {//初始容量小于0，抛出异常
        throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
    }
}


/**
 *构造包含指定collection元素的列表，这些元素利用该集合的迭代器按顺序返回
 *如果指定的集合为null，throws NullPointerException。
 */
public ArrayList(Collection<? extends E> c) {
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {
        // replace with empty array.
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```

以无参数构造方法创建 ArrayList 时，实际上初始化赋值的是一个空数组。当真正对数组进行添加元素操作时，才真正分配容量。即向数组中添加第一个元素时，数组容量扩为 10。 下面在我们分析 ArrayList 扩容时会讲到这一点内容

> 补充：JDK6 new 无参构造的 ArrayList 对象时，直接创建了长度是 10 的 Object[] 数组 elementData 。

**一步一步分析 ArrayList 扩容机制**
这里以无参构造函数创建的 ArrayList 为例分析
**add**方法：
```java
/**
* 将指定的元素追加到此列表的末尾。
*/
public boolean add(E e) {
    // 加元素之前，先调用ensureCapacityInternal方法
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 这里看到ArrayList添加元素的实质就相当于为数组赋值
    elementData[size++] = e;
    return true;
}
```
**JDK11 移除了 ensureCapacityInternal() 和 ensureExplicitCapacity() 方法**

ensureCapacityInternal 方法的源码如下:
```java
// 根据给定的最小容量和当前数组元素来计算所需容量。
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    // 如果当前数组元素为空数组（初始情况），返回默认容量和最小容量中的较大值作为所需容量
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    // 否则直接返回最小容量
    return minCapacity;
}

// 确保内部容量达到指定的最小容量。
private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}
```

ensureCapacityInternal 方法非常简单，内部直接调用了 ensureExplicitCapacity 方法：
```
//判断是否需要扩容
private void ensureExplicitCapacity(int minCapacity) {
    modCount++;
    //判断当前数组容量是否足以存储minCapacity个元素
    if (minCapacity - elementData.length > 0)
        //调用grow方法进行扩容
        grow(minCapacity);
}
```

- 当我们要 add 进第 1 个元素到 ArrayList 时，elementData.length 为 0 （因为还是一个空的 list），因为执行了 ensureCapacityInternal() 方法 ，所以 minCapacity 此时为 10。此时，minCapacity - elementData.length > 0成立，所以会进入 grow(minCapacity) 方法。
- 当 add 第 2 个元素时，minCapacity 为 2，此时 elementData.length(容量)在添加第一个元素后扩容成 10 了。此时，minCapacity - elementData.length > 0 不成立，所以不会进入 （执行）grow(minCapacity) 方法。
- 添加第 3、4···到第 10 个元素时，依然不会执行 grow 方法，数组容量都为 10。

**直到添加第 11 个元素，minCapacity(为 11)比 elementData.length（为 10）要大。进入 grow 方法进行扩容。**

**grow 方法**:
```java
/**
 * 要分配的最大数组大小
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
 * ArrayList扩容的核心方法。
 */
private void grow(int minCapacity) {
    // oldCapacity为旧容量，newCapacity为新容量
    int oldCapacity = elementData.length;
    // 将oldCapacity 右移一位，其效果相当于oldCapacity /2，
    // 我们知道位运算的速度远远快于整除运算，整句运算式的结果就是将新容量更新为旧容量的1.5倍，
    int newCapacity = oldCapacity + (oldCapacity >> 1);

    // 然后检查新容量是否大于最小需要容量，若还是小于最小需要容量，那么就把最小需要容量当作数组的新容量，
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;

    // 如果新容量大于 MAX_ARRAY_SIZE,进入(执行) `hugeCapacity()` 方法来比较 minCapacity 和 MAX_ARRAY_SIZE，
    // 如果minCapacity大于最大容量，则新容量则为`Integer.MAX_VALUE`，否则，新容量大小则为 MAX_ARRAY_SIZE 即为 `Integer.MAX_VALUE - 8`。
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);

    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

int newCapacity = oldCapacity + (oldCapacity >> 1),所以 ArrayList 每次扩容之后容量都会变为原来的 1.5 倍左右（oldCapacity 为偶数就是 1.5 倍，否则是 1.5 倍左右）！ 奇偶不同，比如：10+10/2 = 15, 33+33/2=49。如果是奇数的话会丢掉小数.

- 当 add 第 1 个元素时，oldCapacity 为 0，经比较后第一个 if 判断成立，newCapacity = minCapacity(为 10)。但是第二个 if 判断不会成立，即 newCapacity 不比 MAX_ARRAY_SIZE 大，则不会进入 hugeCapacity 方法。数组容量为 10，add 方法中 return true,size 增为 1。
- 当 add 第 11 个元素进入 grow 方法时，newCapacity 为 15，比 minCapacity（为 11）大，第一个 if 判断不成立。新容量没有大于数组最大 size，不会进入 hugeCapacity 方法。数组容量扩为 15，add 方法中 return true,size 增为 11。
- 以此类推······

- Java 中的 length属性是针对数组说的,比如说你声明了一个数组,想知道这个数组的长度则用到了 length 这个属性.
- Java 中的 length() 方法是针对字符串说的,如果想看这个字符串的长度则用到 length() 这个方法.
- Java 中的 size() 方法是针对泛型集合说的,如果想看这个泛型有多少个元素,就调用此方法来查看!

**hugeCapacity() 方法**
从上面 grow() 方法源码我们知道：如果新容量大于 MAX_ARRAY_SIZE,进入(执行) hugeCapacity() 方法来比较 minCapacity 和 MAX_ARRAY_SIZE，如果 minCapacity 大于最大容量，则新容量则为Integer.MAX_VALUE，否则，新容量大小则为 MAX_ARRAY_SIZE 即为 Integer.MAX_VALUE - 8。
```java
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    // 对minCapacity和MAX_ARRAY_SIZE进行比较
    // 若minCapacity大，将Integer.MAX_VALUE作为新数组的大小
    // 若MAX_ARRAY_SIZE大，将MAX_ARRAY_SIZE作为新数组的大小
    // MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

System.arraycopy() 和 Arrays.copyOf()方法
阅读源码的话，我们就会发现 ArrayList 中大量调用了这两个方法。比如：我们上面讲的扩容操作以及add(int index, E element)、toArray() 等方法中都用到了该方法！

**System.arraycopy() 方法**
```java
    // 我们发现 arraycopy 是一个 native 方法,接下来我们解释一下各个参数的具体意义
    /**
    *   复制数组
    * @param src 源数组
    * @param srcPos 源数组中的起始位置
    * @param dest 目标数组
    * @param destPos 目标数组中的起始位置
    * @param length 要复制的数组元素的数量
    */
    public static native void arraycopy(Object src,  int  srcPos,
                                        Object dest, int destPos,
                                        int length);
```

```java
    /**
     * 在此列表中的指定位置插入指定的元素。
     *先调用 rangeCheckForAdd 对index进行界限检查；然后调用 ensureCapacityInternal 方法保证capacity足够大；
     *再将从index开始之后的所有成员后移一个位置；将element插入index位置；最后size加1。
     */
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        //arraycopy()方法实现数组自己复制自己
        //elementData:源数组;index:源数组中的起始位置;elementData：目标数组；index + 1：目标数组中的起始位置； size - index：要复制的数组元素的数量；
        System.arraycopy(elementData, index, elementData, index + 1, size - index);
        elementData[index] = element;
        size++;
    }
```
**测试**
```java
public class ArraycopyTest {

  public static void main(String[] args) {
    // TODO Auto-generated method stub
    int[] a = new int[10];
    a[0] = 0;
    a[1] = 1;
    a[2] = 2;
    a[3] = 3;
    System.arraycopy(a, 2, a, 3, 3);
    a[2]=99;
    for (int i = 0; i < a.length; i++) {
      System.out.print(a[i] + " ");
    }
  }

}
```

```
0 1 99 2 3 0 0 0 0 0
```

**Arrays.copyOf()方法**
```java
    public static int[] copyOf(int[] original, int newLength) {
      // 申请一个新的数组
        int[] copy = new int[newLength];
  // 调用System.arraycopy,将源数组中的数据进行拷贝,并返回新的数组
        System.arraycopy(original, 0, copy, 0,
                         Math.min(original.length, newLength));
        return copy;
    }
```

```java
   /**
     以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素）; 返回的数组的运行时类型是指定数组的运行时类型。
     */
    public Object[] toArray() {
    //elementData：要复制的数组；size：要复制的长度
        return Arrays.copyOf(elementData, size);
    }
```

个人觉得使用 Arrays.copyOf()方法主要是为了给原有数组扩容，测试代码如下
```java
public class ArrayscopyOfTest {

  public static void main(String[] args) {
    int[] a = new int[3];
    a[0] = 0;
    a[1] = 1;
    a[2] = 2;
    int[] b = Arrays.copyOf(a, 10);
    System.out.println("b.length"+b.length);
  }
}
```

```
10
```

两者联系和区别
联系：
	- 看两者源代码可以发现 copyOf()内部实际调用了 System.arraycopy() 方法
区别：
	- arraycopy() 需要目标数组，将原数组拷贝到你自己定义的数组里或者原数组，而且可以选择拷贝的起点和长度以及放入新数组中的位置 copyOf() 是系统自动在内部新建一个数组，并返回该数组。

# ⭐️集合中的 fail-fast 和 fail-safe 是什么？
fail-fast（快速失败）和 fail-safe（安全失败）是Java集合框架在处理并发修改问题时，两种截然不同的设计哲学和容错策略。

快速失败的思想即针对可能发生的异常进行提前表明故障并停止运行，通过尽早的发现和停止错误，降低故障系统级联的风险。

在java.util包下的大部分集合（如 ArrayList, HashMap）是不支持线程安全的，为了能够提前发现并发操作导致线程安全风险，提出通过维护一个modCount记录修改的次数，迭代期间通过比对预期修改次数expectedModCount和modCount是否一致来判断是否存在并发操作，从而实现快速失败，由此保证在避免在异常时执行非必要的复杂代码。

ArrayList (fail-fast) 示例：
```java
     // 使用线程不安全的 ArrayList，它是一种 fail-fast 集合
      List<Integer> list = new ArrayList<>();
      CountDownLatch latch = new CountDownLatch(2);

      for (int i = 0; i < 5; i++) {
          list.add(i);
      }
      System.out.println("Initial list: " + list);

      Thread t1 = new Thread(() -> {
          try {
              for (Integer i : list) {
                  System.out.println("Iterator Thread (t1) sees: " + i);
                  Thread.sleep(100);
              }
          } catch (ConcurrentModificationException e) {
              System.err.println("!!! Iterator Thread (t1) caught ConcurrentModificationException as expected.");
          } catch (InterruptedException e) {
              e.printStackTrace();
          } finally {
              latch.countDown();
          }
      });

      Thread t2 = new Thread(() -> {
          try {
              Thread.sleep(50);
              System.out.println("-> Modifier Thread (t2) is removing element 1...");
              list.remove(Integer.valueOf(1));
              System.out.println("-> Modifier Thread (t2) finished removal.");
          } catch (InterruptedException e) {
              e.printStackTrace();
          } finally {
              latch.countDown();
          }
      });

      t1.start();
      t2.start();
      latch.await();

      System.out.println("Final list state: " + list);
```
输出：
```
Initial list: [0, 1, 2, 3, 4]
Iterator Thread (t1) sees: 0
-> Modifier Thread (t2) is removing element 1...
-> Modifier Thread (t2) finished removal.
!!! Iterator Thread (t1) caught ConcurrentModificationException as expected.
Final list state: [0, 2, 3, 4]
```

程序在线程 t2 修改列表后，线程 t1 的下一次迭代操作立刻就抛出了 ConcurrentModificationException。这是因为 ArrayList 的迭代器在每次 next() 调用时，都会检查 modCount 是否被改变。一旦发现集合在迭代器不知情的情况下被修改，它会立即“快速失败”，以防止在不一致的数据上继续操作导致不可预期的后果。

对此我们也给出for循环底层迭代器获取下一个元素时的next方法，可以看到其内部的checkForComodification具有针对修改次数比对的逻辑：
```java
 public E next() {
 			//检查是否存在并发修改
            checkForComodification();
            //......
            //返回下一个元素
            return (E) elementData[lastRet = i];
        }

final void checkForComodification() {
		//当前循环遍历次数和预期修改次数不一致时，就会抛出ConcurrentModificationException
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }
```

而fail-safe也就是安全失败的含义，它旨在即使面对意外情况也能恢复并继续运行，这使得它特别适用于不确定或者不稳定的环境

该思想常运用于并发容器，最经典的实现就是CopyOnWriteArrayList的实现，通过写时复制（Copy-On-Write）的思想保证在进行修改操作时复制出一份快照，基于这份快照完成添加或者删除操作后，将CopyOnWriteArrayList底层的数组引用指向这个新的数组空间，由此避免迭代时被并发修改所干扰所导致并发操作安全问题，当然这种做法也存在缺点，即进行遍历操作时无法获得实时结果
![](/images/java-set-8-stocks-004/81b548231454ec37.png)

对应我们也给出CopyOnWriteArrayList实现fail-safe的核心代码，可以看到它的实现就是通过getArray获取数组引用然后通过Arrays.copyOf得到一个数组的快照，基于这个快照完成添加操作后，修改底层array变量指向的引用地址由此完成写时复制：
```java
public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
        	//获取原有数组
            Object[] elements = getArray();
            int len = elements.length;
            //基于原有数组复制出一份内存快照
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            //进行添加操作
            newElements[len] = e;
            //array指向新的数组
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
```

> 2026/3/15