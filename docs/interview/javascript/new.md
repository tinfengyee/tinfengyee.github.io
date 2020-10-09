# new模拟实现

> 转载: [深度解析 new 原理及模拟实现-muyiy](https://muyiy.cn/blog/3/3.5.html)

## 定义

> **new 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——（来自于MDN）

## 过程

使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个新对象。
2. 这个新对象会被执行`[[Prototype]]`连接。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他**对象**，那么new表达式中的函数调用会自动返回这个新对象。

> 构造函数返回值有如下三种情况：
>
> - 1、返回一个对象 (只能访问到该对象)
> - 2、没有 return，即返回 undefined (访问原对象)
> - 3、返回undefined 以外的基本类型 (访问原对象)

## 特征

`new` 创建的实例有以下 2 个特性

- 1、访问到构造函数里的属性 (apply改变this指向)
- 2、访问到原型里的属性 (指向原型)

---

```js
function Car(color, name) {
    this.color = color;
    return {
        name: name
    }
}

var car = new Car("black", "BMW");
car.color;
// undefined

car.name;
// "BMW"

```

## new实现

```js
function create() {
	// 1.创建一个空的对象
    // var obj = new Object(),
	// 2.获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
	// 3.链接到原型，obj 可以访问到构造函数原型中的属性
    // obj.__proto__ = Con.prototype;
    var obj = Object.create(Con.prototype); //取代第1、3步
	// 4.绑定 this 实现继承，obj 可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
	// 5.优先返回构造函数返回的对象
	return ret instanceof Object ? ret : obj;
};

```

```js
function _create(proto) {
  function F() {};
  F.prototype = proto;
  return new F();
}
```

解析：
1.对于⑷构造函数Con.apply(obj,arguments)，相当于把obj指向构造函数的this，就可以使用构造函数的属性了
2.对于⑸，这里分三种情况
构造函数返回值有如下三种情况：

> 1. 返回一个对象 （会返回new 构造函数 的 return {}的对象）
> 2. 没有 return，即返回 undefined
> 3. 返回undefined 以外的基本类型

## 参考

- [深度解析 new 原理及模拟实现-muyiy](https://muyiy.cn/blog/3/3.5.html)
