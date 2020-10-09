var str = "Mozilla"
var list = [4,3,2,5]
var obj = {name: 'xm', age: 18}
for (let key of Object.entries(obj)) {
    console.log(key);
}
for (let key in obj) {
    console.log(key);
}