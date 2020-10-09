# js数组去重

[reduce数组去重-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```js
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
let myOrderedArray = myArray.reduce((acc, cur) => {
  if (acc.indexOf(cur) === -1) {
    acc.push(cur)
  }
  return acc;
}, [])
```

reduce数组对象去重

```js
let objArr = [ {id:1, name:'xm'}, {id:2, name:'lily'}, {id:3, name: 'gogo'}, {id:1, name: 'copy'} ];

const temp = {};
let res = objArr.reduce((acc, cur) => {
  cur.id in temp ? '' : acc.push(cur) && (temp[cur.id] = true)
  return acc
}, [])

console.log(res);
```