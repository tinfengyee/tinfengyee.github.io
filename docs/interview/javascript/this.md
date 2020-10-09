# Javascript的this绑定解析

> 转载: 23[JavaScript深入之史上最全--5种this绑定全面解析-muyiy](https://muyiy.cn/blog/3/3.1.html)

`this`是 JavaScript 语言的一个关键字。
它是函数运行时，在函数体内部自动生成的一个对象，只能在函数体内部使用。

```javascript
function test() {
　this.x = 1;
}
```

上面代码中，函数`test`运行时，内部会自动有一个`this`对象可以使用。

那么，`this`的值是什么呢？

函数的不同使用场合，`this`有不同的值。总的来说，`this`就是函数运行时所在的环境对象。

`this`的绑定规则总共有下面5种。

- 1、默认绑定（严格/非严格模式）
- 2、隐式绑定 (作为对象方法的调用)
- 3、显式绑定 (call, apply, bind 调用)
- 4、new绑定 (作为构造函数调用)
- 5、箭头函数绑定 (不可改变this)

## 一、绑定规则

### 1.1 默认绑定

- **独立函数调用**，这是函数的最通常用法，this指向**全局对象**(global,window)。
- **严格模式**下，不能将全局对象用于默认绑定，this会绑定到`undefined`。只有函数**运行**在非严格模式下，默认绑定才能绑定到全局对象。在严格模式下**调用**函数则不影响默认绑定。

```js
function foo() { // 运行在严格模式下，this会绑定到undefined
    "use strict";
    
    console.log( this.a );
}

var a = 2;

// 调用
foo(); // TypeError: Cannot read property 'a' of undefined

// --------------------------------------

function foo() { // 运行
    console.log( this.a );
}

var a = 2;

(function() { // 严格模式下调用函数则不影响默认绑定
    "use strict";
    
    foo(); // 2
})();
```

> 注意let 和 var

使用 let 内部环境使用 `this` 无法访问,  变量不会绑定到 `window`上面。`let`会形成一个块级作用域,详见[ES6的let关键字（块级作用域）](https://blog.csdn.net/abc_12366/article/details/87900497)。

```js
let x = 1;
var a = 2;
let test = function () {
  b = 3; // 声明全局变量的一种方式
  console.log(this); // window { a: 2, b: 3, ... }
  console.log(this.x); // undefined
  console.log(this.a); // 2
  console.log(this.b); // 3
}
test()
```

### 1.2 隐式绑定 (作为对象方法的调用)

当函数引用有**上下文对象**时，隐式绑定规则会把函数中的this绑定到这个上下文对象。对象属性引用链中只有上一层或者说最后一层在调用中起作用。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

> 隐式丢失

被隐式绑定的函数特定情况下会丢失绑定对象，应用默认绑定，把this绑定到全局对象或者undefined上。

```js
// 虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身。
// bar()是一个不带任何修饰的函数调用，应用默认绑定。
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名

var a = "oops, global"; // a是全局对象的属性

bar(); // "oops, global"
```

### 1.3 显式绑定(call, apply, bind)

通过`call(..)` 或者 `apply(..)`方法。第一个参数是一个对象，在调用函数时将这个对象绑定到this。因为直接指定this的绑定对象，称之为显示绑定。

`apply()`的参数为空时，默认调用全局对象(默认绑定), 参考 *三、绑定例外*。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2  调用foo时强制把foo的this绑定到obj上
```

显示绑定无法解决丢失绑定问题。

解决方案：

- 1、硬绑定

创建函数bar()，并在它的内部手动调用foo.call(obj)，强制把foo的this绑定到了obj。这种方式让我想起了**借用构造函数继承**，没看过的可以点击查看 [JavaScript常用八种继承方案](https://juejin.im/post/5bcb2e295188255c55472db0)

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// 硬绑定的bar不可能再修改它的this
bar.call( window ); // 2
```

典型应用场景是创建一个包裹函数，负责接收参数并返回值。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

创建一个可以重复使用的辅助函数。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

// 简单的辅助绑定函数
function bind(fn, obj) {
    return function() {
        return fn.apply( obj, arguments );
    }
}

var obj = {
    a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

ES5内置了`Function.prototype.bind`，bind会返回一个硬绑定的新函数，用法如下。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

- 2、API调用的“上下文”

JS许多内置函数提供了一个可选参数，被称之为“上下文”（context），其作用和`bind(..)`一样，确保回调函数使用指定的this。这些函数实际上通过`call(..)`和`apply(..)`实现了显式绑定。

```js
function foo(el) {
	console.log( el, this.id );
}

var obj = {
    id: "awesome"
}

var myArray = [1, 2, 3]
// 调用foo(..)时把this绑定到obj
myArray.forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

### 1.4 new绑定 (作为构造函数调用)

- 在JS中，`构造函数`只是使用`new`操作符时被调用的`普通`函数，他们不属于某个类，也不会实例化一个类。
- 包括内置对象函数（比如`Number(..)`）在内的所有函数都可以用`new`来调用，这种函数调用被称为构造函数调用。
- 实际上并不存在所谓的“构造函数”，只有对于函数的“**构造调用**”。

```javascript
var x = 2;
function test() {
  this.x = 1;
}
var obj = new test();
console.log(obj.x); // 1
```

使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

- 1、创建（或者说构造）一个新对象。
- 2、这个新对象会被执行`[[Prototype]]`连接。
- 3、这个新对象会绑定到函数调用的`this`。
- 4、如果函数没有返回其他对象，那么`new`表达式中的函数调用会自动返回这个新对象。

使用`new`来调用`foo(..)`时，会构造一个新对象并把它（`bar`）绑定到`foo(..)`调用中的this。

```js
function foo(a) {
    this.a = a;
}

var bar = new foo(2); // bar和foo(..)调用中的this进行绑定
console.log( bar.a ); // 2
```

**手写一个new实现**

```js
function create() {
	// 创建一个空的对象
    var obj = new Object(),
	// 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
	// 链接到原型，obj 可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
	// 绑定 this 实现继承，obj 可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
	// 优先返回构造函数返回的对象 (引用改变)
	return ret instanceof Object ? ret : obj;
};

// 使用 Object.create()
function _new() {
  let Con = [].shift.call(arguments);
  let obj = Object.create(Con.prototype);
  let ret = Con.apply(obj, arguments);
  return ret instanceof Object ? ret : obj;
}

```

使用这个手写new

```js
let p1 = new Person() {
    this.name = 'xm'
    return 1 // { age: 18 } 返回对象, p1就是这个对象, 相当于引用改变了 @1
}
console.log(p1);
p1.say(); // 如果返回对象,则报错, 原因如 @1

console.log(p1 instanceof Person); // true, 如果返回对象,则为fasle

let p2 = create(Person);
console.log(p2);
p2.say();
```

**代码原理解析**：

- 1、用`new Object()`的方式新建了一个对象`obj`
- 2、取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 `arguments`会被去除第一个参数
- 3、将 `obj`的原型指向构造函数，这样`obj`就可以访问到构造函数原型中的属性
- 4、使用`apply`，改变构造函数`this` 的指向到新建的对象，这样 `obj`就可以访问到构造函数中的属性
- 5、返回 `obj`



### 1.5 箭头函数

ES6新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层（函数或者全局）作用域（**词法作用域**）来决定this。

- `foo()`内部创建的箭头函数会捕获调用时`foo()`的this。由于`foo()`的this绑定到`obj1`，`bar`(引用箭头函数)的this也会绑定到`obj1`，**箭头函数的绑定无法被修改**(`new`也不行)。

```js
function foo() {
    // 返回一个箭头函数
    return (a) => {
        // this继承自foo()
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
}

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2，不是3！
```

ES6之前和箭头函数类似的模式，采用的是词法作用域取代了传统的this机制。

```js
function foo() {
    var self = this; // lexical capture of this
    setTimeout( function() {
        console.log( self.a ); // self只是继承了foo()函数的this绑定
    }, 100 );
}

var obj = {
    a: 2
};

foo.call(obj); // 2
```

代码风格统一问题：如果既有this风格的代码，还会使用 `seft = this` 或者箭头函数来否定this机制。

- 只使用词法作用域并完全抛弃错误this风格的代码；
- 完全采用this风格，在必要时使用`bind(..)`，尽量避免使用 `self = this` 和箭头函数



## 二、优先级

> 看不懂的, 可使用Typora 软件, 可转化为 flow 图。

```flow
st=>start: Start
e=>end: End
cond1=>condition: new绑定
op1=>operation: this绑定新创建的对象，
				var bar = new foo()
				
cond2=>condition: 显示绑定
op2=>operation: this绑定指定的对象，
				var bar = foo.call(obj2)
				
cond3=>condition: 隐式绑定
op3=>operation: this绑定上下文对象，
				var bar = obj1.foo()
				
op4=>operation: 默认绑定
op5=>operation: 函数体严格模式下绑定到undefined，
				否则绑定到全局对象，
				var bar = foo()

st->cond1
cond1(yes)->op1->e
cond1(no)->cond2
cond2(yes)->op2->e
cond2(no)->cond3
cond3(yes)->op3->e
cond3(no)->op4->op5->e
```

在`new`中使用硬绑定函数的目的是预先设置函数的一些参数，这样在使用`new`进行初始化时就可以只传入其余的参数（**柯里化**）。

```js
function foo(p1, p2) {
    this.val = p1 + p2;
}

// 之所以使用null是因为在本例中我们并不关心硬绑定的this是什么
// 反正使用new时this会被修改
var bar = foo.bind( null, "p1" );

var baz = new bar( "p2" );

baz.val; // p1p2
```

## 三、绑定例外

### 3.1 被忽略的this

把`null`或者`undefined`作为`this`的绑定对象传入`call`、`apply`或者`bind`，这些值在调用时会被忽略，实际应用的是默认规则。

下面两种情况下会传入`null`

- 使用`apply(..)`来“展开”一个数组，并当作参数传入一个函数

- `bind(..)`可以对参数进行柯里化（预先设置一些参数）

```js
function foo(a, b) {
    console.log( "a:" + a + "，b:" + b );
}

// 把数组”展开“成参数
foo.apply( null, [2, 3] ); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2，b:3 
```

总是传入`null`来忽略this绑定可能产生一些副作用。如果某个函数确实使用了this，那默认绑定规则会把this绑定到全局对象中。

> 更安全的this



安全的做法就是传入一个特殊的对象（空对象），把this绑定到这个对象不会对你的程序产生任何副作用。

JS中创建一个空对象最简单的方法是**`Object.create(null)`**，这个和`{}`很像，但是并不会创建`Object.prototype`这个委托，所以比`{}`更空。

```js
function foo(a, b) {
    console.log( "a:" + a + "，b:" + b );
}

// 我们的空对象
var ø = Object.create( null );

// 把数组”展开“成参数
foo.apply( ø, [2, 3] ); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2，b:3 
```

Object.create() 的 Polyfill 如下
```js
// Object.create()
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject !== 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
// -----------------------
        function F() {}
        F.prototype = proto;

        return new F();
// -----------------------
    };
}
```

### 3.2 间接引用

间接引用下，调用这个函数会应用默认绑定规则。间接引用最容易在**赋值**时发生。

```js
// p.foo = o.foo的返回值是目标函数的引用，所以调用位置是foo()而不是p.foo()或者o.foo()
function foo() {
    console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4};

o.foo(); // 3
(p.foo = o.foo)(); // 2
```



### 3.3 软绑定

- 硬绑定可以把this强制绑定到指定的对象（`new`除外），防止函数调用应用默认绑定规则。但是会降低函数的灵活性，使用**硬绑定之后就无法使用隐式绑定或者显式绑定来修改this**。
- **如果给默认绑定指定一个全局对象和undefined以外的值**，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显示绑定修改this的能力。

```js
// 默认绑定规则，优先级排最后
// 如果this绑定到全局对象或者undefined，那就把指定的默认对象obj绑定到this,否则不会修改this
if(!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有curried参数
        var curried = [].slice.call( arguments, 1 ); 
        var bound = function() {
            return fn.apply(
            	(!this || this === (window || global)) ? 
                	obj : this,
                curried.concat.apply( curried, arguments )
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}
```

使用：软绑定版本的foo()可以手动将this绑定到obj2或者obj3上，但如果应用默认绑定，则会将this绑定到obj。

```js
function foo() {
    console.log("name:" + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

// 默认绑定，应用软绑定，软绑定把this绑定到默认对象obj
var fooOBJ = foo.softBind( obj );
fooOBJ(); // name: obj 

// 隐式绑定规则
obj2.foo = foo.softBind( obj );
obj2.foo(); // name: obj2 <---- 看！！！

// 显式绑定规则
fooOBJ.call( obj3 ); // name: obj3 <---- 看！！！

// 绑定丢失，应用软绑定
setTimeout( obj2.foo, 10 ); // name: obj
```

## 四、思考题

### 题1: 依次给出console.log输出的数值。

```js
var num = 1;
var myObject = {
    num: 2,
    add: function() {
        this.num = 3;
        (function() {
            console.log(this.num);
            this.num = 4;
        })();
        console.log(this.num);
    },
    sub: function() {
        console.log(this.num)
    }
}
myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```

::: details 点击查看答案

答案有两种情况，分为严格模式和非严格模式。

- 严格模式下，报错。`TypeError: Cannot read property 'num' of undefined`
- 非严格模式下，输出：1、3、3、4、4

解答过程：

```js
var myObject = {
    num: 2,
    add: function() {
        this.num = 3; // 隐式绑定 修改 myObject.num = 3
        (function() {
            console.log(this.num); // 默认绑定 输出 1
            this.num = 4; // 默认绑定 修改 window.num = 4
        })();
        console.log(this.num); // 隐式绑定 输出 3
    },
    sub: function() {
        console.log(this.num) // 因为丢失了隐式绑定的myObject，所以使用默认绑定 输出 4
    }
}
myObject.add(); // 1 3
console.log(myObject.num); // 3
console.log(num); // 4
var sub = myObject.sub;//  丢失了隐式绑定的myObject
sub(); // 4
```
:::



### 题2: 依次给出console.log输出的数值。

```js
var obj = {
    say: function () {
        function _say() {
            console.log(this);
        }
        console.log(obj);
        return _say.bind(obj);
    }()
}
obj.say()
```

::: details 点击查看答案

```js
// 1、赋值语句是右执行的,此时会先执行右侧的对象
var obj = {
    // 2、say 是立即执行函数
    say: function() {
        function _say() {
            // 5、输出 window
            console.log(this);
        }
        // 3、编译阶段 obj 赋值为 undefined
        console.log(obj);
        // 4、obj是 undefined，bind 本身是 call实现，
        // 【进阶3-3期】：call 接收 undefined 会绑定到 window。
        return _say.bind(obj);
    }(),
};
obj.say();
```

:::



## 参考

- [JavaScript深入之史上最全--5种this绑定全面解析-muyiy](https://muyiy.cn/blog/3/3.1.html)

- [Javascript 的 this 用法](http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html)