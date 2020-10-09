# 理解闭包和闭包的作用

> 参考muyiy的理解，*参考4* 链接。

红宝书(p178)上对于闭包的定义：`闭包是指有权访问另外一个函数作用域中的变量的函数` 关键在于下面两点：

- 是一个函数
- 能访问另外一个函数作用域中的变量

> *参考7*
>
> 能记住函数本身所在作用域的变量，这就是闭包和普通函数的区别所在
>
> MDN中给出的闭包的定义是：函数与对其状态即词法环境的引用共同构成闭包。
>
> 这里的“词法环境的引用”，可以简单理解为“引用了函数外部的一些变量”

（我的理解是： 一个函数与具有另一个函数作用域中的变量的引用，可以构成闭包。）

对于闭包有下面三个特性：

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

的


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

## 参考

1. [对JS闭包的理解及常见应用场景](https://blog.csdn.net/qq_21132509/article/details/80694517)

2. [为什么要用闭包(closure)？](https://www.jianshu.com/p/11fb0195dc9d)

3. [回调函数和闭包](https://www.cnblogs.com/tumo/p/10678533.html)

4. [深入浅出图解作用域链和闭包](https://muyiy.cn/blog/2/2.1.html)

5. [高频前端面试题](https://mp.weixin.qq.com/s/vXeACwujNKcLfnkBB9i9Yw)

6. [【JS】138-重温基础：闭包](https://mp.weixin.qq.com/s/IUQ0dxkts6m38e-uc4xCdA)

7. [【JS】741- JavaScript 闭包应用介绍](https://mp.weixin.qq.com/s/dmqed5PfWT4_DFLacjUjig)