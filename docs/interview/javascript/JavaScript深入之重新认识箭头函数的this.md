# JavaScript深入之重新认识箭头函数的this

> 转载: [JavaScript深入之重新认识箭头函数的this-muyiy](https://muyiy.cn/blog/3/3.2.html)

我们知道this绑定规则一共有5种情况：

1、默认绑定（严格/非严格模式）
2、隐式绑定
3、显式绑定
4、new绑定
5、箭头函数绑定
其实大部分情况下可以用一句话来概括，this总是指向调用该函数的对象。

但是对于箭头函数并不是这样，是根据外层（**函数**或者**全局**）作用域（词法作用域）来决定this。

对于箭头函数的this总结如下：

箭头函数不绑定this，箭头函数中的this相当于普通变量。

箭头函数的this寻值行为与普通变量相同，在作用域中逐级寻找。

箭头函数的this无法通过bind，call，apply来直接修改（可以间接修改）。

改变作用域中this的指向可以改变箭头函数的this。

eg. `function closure(){()=>{//code }}`，在此例中，我们通过改变封包环境`closure.bind(another)()`，来改变箭头函数this的指向。



## 题目1 (理解箭头函数绑定!important)

```js
/**
 * 非严格模式
 */

var name = 'window'

var person1 = {
  name: 'person1',
  show1: function () {
    console.log(this.name)
  },
  show2: () => console.log(this.name),
  show3: function () {
    return function () {
      console.log(this.name)
    }
  },
  show4: function () {
    return () => console.log(this.name)
  }
}
var person2 = { name: 'person2' }

person1.show1()
person1.show1.call(person2)

person1.show2()
person1.show2.call(person2)

person1.show3()()
person1.show3().call(person2)
person1.show3.call(person2)()

person1.show4()()
person1.show4().call(person2)
person1.show4.call(person2)()
```



::: details 点击查看答案

```js
person1.show1() // person1，隐式绑定，this指向调用者 person1 
person1.show1.call(person2) // person2，显式绑定，this指向 person2

person1.show2() // window，箭头函数绑定，this指向外层作用域，即全局作用域     --- p1 x
person1.show2.call(person2) // window，箭头函数绑定，this指向外层作用域，即全局作用域 --- p1 x

person1.show3()() // window，默认绑定，这是一个高阶函数，调用者是window
				  // 类似于`var func = person1.show3()` 执行`func()`
person1.show3().call(person2) // person2，显式绑定，this指向 person2
person1.show3.call(person2)() // window，默认绑定，调用者是window

person1.show4()() // person1，箭头函数绑定，this指向外层作用域，即person1函数作用域  --- window x
person1.show4().call(person2) // person1，箭头函数绑定， --- window x
							  // this指向外层作用域，即person1函数作用域
person1.show4.call(person2)() // person2
```

最后一个`person1.show4.call(person2)()`有点复杂，我们来一层一层的剥开。

- 1、首先是`var func1 = person1.show4.call(person2)`，这是显式绑定，调用者是`person2`，`show4`函数指向的是`person2`。
- 2、然后是`func1()`，箭头函数绑定，this指向外层作用域，即`person2`函数作用域

首先要说明的是，箭头函数绑定中，this指向外层作用域，并不一定是第一层，也不一定是第二层。

因为没有自身的this，所以只能根据作用域链往上层查找，直到找到一个绑定了this的函数作用域，并指向调用该普通函数的对象。

:::

>  做错原因分析

3和4 做错, 把函数**根据外层（函数或者全局）作用域（词法作用域）来决定this**这句话理解错了, `var person1 = { ... }`这个不是外层作用域, 只是一个对象...

8和9 做错, `show4`的作用域就是在`person1`下, 已经绑定了, 不可更改。



## 题目2

这次通过构造函数来创建一个对象，并执行相同的4个show方法。

```js
/**
 * 非严格模式
 */

var name = 'window'

function Person (name) {
  this.name = name;
  this.show1 = function () {
    console.log(this.name)
  }
  this.show2 = () => console.log(this.name)
  this.show3 = function () {
    return function () {
      console.log(this.name)
    }
  }
  this.show4 = function () {
    return () => console.log(this.name)
  }
}

var personA = new Person('personA')
var personB = new Person('personB')

personA.show1()
personA.show1.call(personB)

personA.show2()
personA.show2.call(personB)

personA.show3()()
personA.show3().call(personB)
personA.show3.call(personB)()

personA.show4()()
personA.show4().call(personB)
personA.show4.call(personB)()
```