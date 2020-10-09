# js手写代码

[reduce的高级用法](https://www.jianshu.com/p/e375ba1cfc47)

1.计算数组中每个元素出现的次数

```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

let nameNum = names.reduce((pre,cur)=>{
  if(cur in pre){ // Reflect.has(pre, cur)
    pre[cur]++
  }else{
    pre[cur] = 1 
  }
  return pre
},{})
console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
```

2.数组去重

```js
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
let myOrderedArray = myArray.reduce((acc, cur) => {
  if (acc.indexOf(cur) === -1) {
    acc.push(cur)
  }
  return acc;
}, [])
```

3.将二维数组转化为一维

```js
let arr = [[0, 1], [2, 3], [4, 5]]
let newArr = arr.reduce((pre,cur)=>{
    return pre.concat(cur)
},[])
console.log(newArr); // [0, 1, 2, 3, 4, 5]
```

4.将多维数组转化为一维

```js
let arr = [[0, 1], [2, 3], [4, [5, 6, 7]]]
const flagArray = function (arr) {
  return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flagArray(cur) : cur), [])
}
console.log(flagArray(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]
```

5.对象里的属性求和

```js
var result = [
    {
        subject: 'math',
        score: 10
    },
    {
        subject: 'chinese',
        score: 20
    },
    {
        subject: 'english',
        score: 30
    }
];

var sum = result.reduce(function(prev, cur) {
    return cur.score + prev;
}, 0);
console.log(sum) //60
```

6.reduce数组对象去重

```js
let objArr = [ {id:1, name:'xm'}, {id:2, name:'lily'}, {id:3, name: 'gogo'}, {id:1, name: 'copy'} ];

const temp = {};
let res = objArr.reduce((acc, cur) => {
  cur.id in temp ? '' : acc.push(cur) && (temp[cur.id] = true)
  return acc
}, [])

console.log(res);
```
