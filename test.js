let list = [1,2,3,4,2,1,5]
const temp = {};
let res = list.reduce((acc, cur) => {
  if (acc.indexOf(cur) === -1) {
    acc.push(cur)
  }
  return acc
}, [])

console.log(res);

// 888888888888888888888888888

// let map = new Map()

// map.set('a', 1)
// map.set('b', 2)
