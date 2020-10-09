# 理解闭包和闭包的用途

> 主要来源*参考1,2,4*。

## 闭包的定义和特征

红宝书(p178)上对于闭包的定义：`闭包是指有权访问另外一个函数作用域中的变量的函数` 关键在于下面两点：

- 是一个函数
- 能访问另外一个函数作用域中的变量

> *参考2*:
>
> 能记住函数本身所在作用域的变量，这就是闭包和普通函数的区别所在
>
> MDN中给出的闭包的定义是：函数与对其状态即词法环境的引用共同构成闭包。
>
> 这里的“词法环境的引用”，可以简单理解为“引用了函数外部的一些变量”



(我的理解是： 一个函数与具有另一个函数作用域中的变量的引用，就可以构成闭包。)



对于闭包有下面**三个特性**： (*参考1*)

> - 函数嵌套函数
> - 函数内部可以引用函数外部的参数和变量
> - 参数和变量不会被垃圾回收机制回收

- 1、闭包可以访问当前函数以外的变量

```js
function getOuter(){
  var date = '815';
  function getDate(str){
    console.log(str + date);  //访问外部的date
  }
  return getDate('今天是：'); //"今天是：815"
}
getOuter();
```

> 一个**回调函数**访问父级作用域变量就形成闭包，*参考2*


- 2、即使外部函数已经返回，闭包仍能访问外部函数定义的变量

```js
function getOuter(){
  var date = '815';
  function getDate(str){
    console.log(str + date);  //访问外部的date
  }
  return getDate;     //外部函数返回
}
var today = getOuter();
today('今天是：');   //"今天是：815"
today('明天不是：');   //"明天不是：815"
```

- 3、闭包可以更新外部变量的值

```js
function updateCount(){
  var count = 0;
  function getCount(val){
    count = val;
    console.log(count);
  }
  return getCount;     //外部函数返回
}
var count = updateCount();
count(815); //815
count(816); //816
```



## 为什么使用闭包？

1. 创建的变量的值始终保持在内存中，以供本地环境使用。

2. 说到这里就不得不提下JavaScript的变量作用域问题。变量作用域无非就两种：全局作用域和局部作用域。
   在JavaScript（特指ECMAScript5前的版本）语言中具有作用域的仅有函数function。并且有个特点就是：函数内部可以直接访问外部变量，但在函数外部无法访问函数内部变量。这也就是Javascript语言特有的“链式作用域”结构（chain scope）。
   那么我要是想在**函数外部访问函数内部变量**怎么办？所以闭包就出现了，简单说，我们使用闭包的主要作用就是间接访问函数的内部数据。

为什么？就是下面闭包的用途。

## 闭包的用途

1. 缓存变量,防止被回收
   
  > 如节流、防抖(联想搜索) 

2. 模拟私有方法或者变量

   > 比如游戏开发中，玩家对象身上通常会有一个经验属性，假设为exp，"打怪"、“做任务”、“使用经验书”等都会增加exp这个值，而在升级的时候又会减掉exp的值，把exp直接暴露给各处业务来操作显然是很糟糕的。

   ```js
   
   function makePlayer () {
     let exp = 0 // 经验值
     return {
       getExp () {
         return exp
       },
       changeExp (delta, sReason = '') {
         // log(xxx),记录变动日志
         exp += delta
       }
     }
   }
   
   let p = makePlayer()
   console.log(p.getExp()) // 0
   p.changeExp(2000)
   console.log(p.getExp()) // 2000
   ```



使用闭包的注意点： 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能**导致内存泄露**。解决方法是，在退出函数之前，将不使用的局部变量全部删除.

## 总结

闭包是js中的强大特性之一，然而至于闭包怎么使用，我觉得不算是一个问题，甚至我们完全没必要研究闭包怎么使用。

我的观点是，闭包应该是自然而言地出现在你的代码里，因为它是解决当前问题最直截了当的办法；而当你刻意想去使用它的时候，往往可能已经走了弯路。

## 参考

1. [【JS】138-重温基础：闭包](https://mp.weixin.qq.com/s/IUQ0dxkts6m38e-uc4xCdA)`推荐`
2. [【JS】741- JavaScript 闭包应用介绍](https://mp.weixin.qq.com/s/dmqed5PfWT4_DFLacjUjig)`推荐`
3. [为什么要用闭包(closure)？](https://www.jianshu.com/p/11fb0195dc9d)`推荐`
4. [深入浅出图解作用域链和闭包](https://muyiy.cn/blog/2/2.1.html)`推荐`
5. [回调函数和闭包](https://www.cnblogs.com/tumo/p/10678533.html)
6. [高频前端面试题](https://mp.weixin.qq.com/s/vXeACwujNKcLfnkBB9i9Yw)
7. [对JS闭包的理解及常见应用场景](https://blog.csdn.net/qq_21132509/article/details/80694517) 