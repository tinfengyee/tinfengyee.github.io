# 深度解析bind原理、使用场景及模拟实现

> 转载: [深度解析bind原理、使用场景及模拟实现-muyiy](https://muyiy.cn/blog/3/3.4.html)

## bind()

`bind()` 方法会创建一个新函数，当这个新函数被调用时，它的 `this` 值是传递给 `bind()` 的第一个参数，传入bind方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。bind返回的绑定函数也能使用 `new` 操作符创建对象：这种行为就像把原函数当成构造器，提供的 `this` 值被忽略，同时调用时的参数被提供给模拟函数。（来自参考1）

语法：`fun.bind(thisArg[, arg1[, arg2[, ...]]])`

`bind` 方法与 `call / apply` 最大的不同就是前者返回一个绑定上下文的**函数**，而后两者是**直接执行**了函数。

来个例子说明下

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    return {
		value: this.value,
		name: name,
		age: age
    }
};

bar.call(foo, "Jack", 20); // 直接执行了函数
// {value: 1, name: "Jack", age: 20}

var bindFoo1 = bar.bind(foo, "Jack", 20); // 返回一个函数
bindFoo1();
// {value: 1, name: "Jack", age: 20}

var bindFoo2 = bar.bind(foo, "Jack"); // 返回一个函数
bindFoo2(20);
// {value: 1, name: "Jack", age: 20}
```

通过上述代码可以看出`bind` 有如下特性：

- 1、可以指定`this`
- 2、返回一个函数
- 3、可以传入参数
- 4、柯里化

## 使用场景

### 1、业务场景

经常有如下的业务场景

```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {

        setTimeout(function(){
            console.log("Hello, my name is " + this.nickname);
        }, 500);
    }
}

var person = new Person('jawil');
person.distractedGreeting();
//Hello, my name is Kitty
```

这里输出的`nickname`是全局的，并不是我们创建 `person` 时传入的参数，因为 `setTimeout` 在全局环境中执行（不理解的查看 this绑定规则），所以 `this` 指向的是`window`。

这边把 `setTimeout` 换成异步回调也是一样的，比如接口请求回调。

解决方案有下面两种。

**解决方案1**：缓存 `this`值

```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {
        
		var self = this; // added
        setTimeout(function(){
            console.log("Hello, my name is " + self.nickname); // changed
        }, 500);
    }
}

var person = new Person('jawil');
person.distractedGreeting();
// Hello, my name is jawil
```

**解决方案2**：使用 `bind`

```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {

        setTimeout(function(){
            console.log("Hello, my name is " + this.nickname);
        }.bind(this), 500);
    }
}

var person = new Person('jawil');
person.distractedGreeting();
// Hello, my name is jawil
```

### 2、验证是否是数组

在介绍 `call` 的使用场景已经说明过，这里重新回顾下。

```js
function isArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]';
}
isArray([1, 2, 3]);
// true

// 直接使用 toString()
[1, 2, 3].toString(); 	// "1,2,3"
"123".toString(); 		// "123"
123.toString(); 		// SyntaxError: Invalid or unexpected token
Number(123).toString(); // "123"
Object(123).toString(); // "123"
```

可以通过`toString()` 来获取每个对象的类型，但是不同对象的 `toString()`有不同的实现，所以通过 `Object.prototype.toString()` 来检测，需要以 `call() / apply()` 的形式来调用，传递要检查的对象作为第一个参数。

另一个**验证是否是数组**的方法，这个方案的**优点**是可以直接使用改造后的 `toStr`。

```js
var toStr = Function.prototype.call.bind(Object.prototype.toString);
function isArray(obj){ 
    return toStr(obj) === '[object Array]';
}
isArray([1, 2, 3]);
// true

// 使用改造后的 toStr
toStr([1, 2, 3]); 	// "[object Array]"
toStr("123"); 		// "[object String]"
toStr(123); 		// "[object Number]"
toStr(Object(123)); // "[object Number]"
```

上面方法首先使用 `Function.prototype.call`函数指定一个 `this` 值，然后 `.bind` 返回一个新的函数，始终将 `Object.prototype.toString` 设置为传入参数。其实等价于 `Object.prototype.toString.call()` 。

这里有一个**前提**是`toString()`方法**没有被覆盖**

```js
Object.prototype.toString = function() {
    return '';
}
isArray([1, 2, 3]);
// false
```

### 3、柯里化（curry）

> 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

可以一次性地调用柯里化函数，也可以每次只传一个参数分多次调用。

```js
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12

add(1)(2);
// 3
```

这里定义了一个 `add` 函数，它接受一个参数并返回一个新的函数。调用 `add` 之后，返回的函数就通过闭包的方式记住了 `add` 的第一个参数。所以说 `bind` 本身也是闭包的一种使用场景。

## 模拟实现

`bind（）` 函数在 ES5 才被加入，所以并不是所有浏览器都支持，`IE8`及以下的版本中不被支持，如果需要兼容可以使用 Polyfill 来实现。

首先我们来实现以下四点特性：

- 1、可以指定`this`
- 2、返回一个函数
- 3、可以传入参数
- 4、柯里化

### 模拟实现第一步

对于第 1 点，使用 `call / apply` 指定 `this` 。

对于第 2 点，使用 `return` 返回一个函数。

结合前面 2 点，可以写出第一版，代码如下：

```js
// 第一版
Function.prototype.bind2 = function(context) {
    var self = this; // this 指向调用者
    return function () { // 实现第 2点
        return self.apply(context); // 实现第 1 点
    }
}
```

测试一下

```js
// 测试用例
var value = 2;
var foo = {
    value: 1
};

function bar() {
	return this.value;
}

var bindFoo = bar.bind2(foo);

bindFoo(); // 1
```

### 模拟实现第二步

对于第 3 点，使用 `arguments` 获取参数数组并作为 `self.apply()` 的第二个参数。

对于第 4 点，获取返回函数的参数，然后同第3点的参数合并成一个参数数组，并作为 `self.apply()` 的第二个参数。

```js
// 第二版
Function.prototype.bind2 = function (context) {

    var self = this;
    // 实现第3点，因为第1个参数是指定的this,所以只截取第1个之后的参数
	// arr.slice(begin); 即 [begin, end]
    var args = Array.prototype.slice.call(arguments, 1); 

    return function () {
        // 实现第4点，这时的arguments是指bind返回的函数传入的参数
        // 即 return function 的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply( context, args.concat(bindArgs) );
    }
}
```

测试一下：

```js
// 测试用例
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    return {
		value: this.value,
		name: name,
		age: age
    }
};

var bindFoo = bar.bind2(foo, "Jack");
bindFoo(20);
// {value: 1, name: "Jack", age: 20}
```

### 模拟实现第三步

到现在已经完成大部分了，但是还有一个难点，`bind` 有以下一个特性

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器，提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

## 参考

- [深度解析bind原理、使用场景及模拟实现-muyiy](https://muyiy.cn/blog/3/3.4.html)

> [不用 call 和 apply 方法模拟实现 ES5 的 bind 方法](https://www.cnblogs.com/libin-1/p/6799263.html)
>
> [JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
>
> [MDN 之 Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
>
> [MDN 之 Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
>
> [第 4 章: 柯里化（curry）](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch4.html#不仅仅是双关语咖喱)
