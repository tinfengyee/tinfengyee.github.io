# javascript继承方案讲解

## 继承方案

继承的本质就是**复制，即重写原型对象(引用改变)，代之以一个新类型的实例**。

### 1.1 常用继承方式

一般了解常用的方案即可, 后面的方案不可实际使用。

#### 1.1.1 常用的继承(借助空函数实例)

借助一个中间对象来实现正确的原型链，这个中间对象的原型要指向Student.prototype

```js
function Student(props) {
  this.name = props.name || 'Unnamed';
}
Student.prototype.hello = function () {
  console.log('Hello, ' + this.name + '!');
}
function PrimaryStudent(props) {
  // 调用Student构造函数，绑定this变量:
  Student.call(this, props);
  this.grade = props.grade || 1;
}
function F() {}
F.prototype = Student.prototype;
PrimaryStudent.prototype = new F();
// PrimaryStudent.prototype = Object.create(Student.prototype);
// 构造函数是从 `prototype` 上拿到的,`new F().__proto__`的构造函数(constructor)的书Student,所以需要修正
PrimaryStudent.prototype.constructor = PrimaryStudent;
PrimaryStudent.prototype.say = function() {
  console.log('say', this.name);
}
let xm = new PrimaryStudent('xm')
console.dir(xm);
console.dir(xm.__proto__ === PrimaryStudent.prototype); // true
console.dir(xm.__proto__.__proto__ === Student.prototype); // true
xm.say(); // say Unnamed
xm.hello(); // Hello, Unnamed!
```

也可以使用`Object.create()`方式,它的polyfill简化版如下,

```js
function create(proto) {
  function F() {};
  F.prototype = proto;
  return new F();
}
```

> 如果要创建一个空对象, 可以使用`Object.create(null)`, 这个比`{}`更纯粹, 这是原型链上的知识。

#### 1.1.2 ES6 类继承

```js
class Student {
  constructor(grade) {
    this.grade = grade || '1'
  }
  hello() {
    console.log('hello, ', this.grade);
  }
}

class PrimaryStudent extends Student{
  constructor(grade, name) {
    super(grade);
    this.name = name || 'anoymous';
  }
  say() {
    console.log('say, ', this.name);
  }
}

let xm = new PrimaryStudent('xm');
console.log(xm); // PrimaryStudent {grade: "xm", name: "anoymous"}
xm.hello(); // hello,  xm
xm.say(); // say,  anoymous
```

类继承的原理是跟上面的一样。

```js
function _inherits(subType, superType) {
  
    // 创建对象，创建父类原型的一个副本
    // 增强对象，弥补因重写原型而失去的默认的constructor 属性
    // 指定对象，将新创建的对象赋值给子类的原型
    subType.prototype = Object.create(superType && superType.prototype, {
        constructor: {
            value: subType,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superType) {
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subType, superType)
            : subType.__proto__ = superType;
    }
}

```

### 1.2 构造函数继承

通过调用(call,apply传入上下文)父类构造函数, 以增强子类实例。

 ```js
function Student(props) {
  this.name = props.name || 'Unnamed';
}
Student.prototype.hello = function () {
  console.log('Hello, ' + this.name);
}
function PrimaryStudent(props) {
  // 调用Student构造函数，绑定this变量:
  Student.call(this, props);
  this.grade = props.grade || 1;
}
PrimaryStudent.prototype.say = function() {
  console.log('say', this.name);
}
let xm = new PrimaryStudent('xm')
xm.say() // say Unnamed
xm.hello() // Uncaught TypeError: xm.hello is not a function
 ```

核心代码是`Student.call(this, props)`，创建子类实例时调用`Student`构造函数，于是`PrimaryStudent`的每个实例都会将`Student`中的属性复制一份。

缺点：

- 只能继承父类的**实例**属性和方法，不能继承原型属性/方法
- 无法实现复用，每个子类都有父类实例函数的副本，影响性能

### 1.3 原型链继承

```js
function Student(props) {
  this.name = props.name || 'Unnamed';
  this.list = ['red', 'green', 'blue'];
}
function PrimaryStudent(props) {
  this.grade = props.grade || 1;
}
PrimaryStudent.prototype = new Student({})

let xm = new PrimaryStudent('xm')
let hero = new PrimaryStudent('hero')
xm.list.push('black');
console.log(xm.list); // ["red", "green", "blue", "black"]
console.dir(hero.list); // ["red", "green", "blue", "black"]
```

原型链方案存在的缺点：多个实例对引用类型的操作会被篡改。

> 还有其他的继承方式, 这里不多讲解, 意义不大， 不必死钻。

## 参考

- [原型继承-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312/1023021997355072)
- [JavaScript常用八种继承方案-muyiy](https://juejin.im/post/6844903696111763470)
