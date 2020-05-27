# dir-changed.js
check changes in dir

## just touch it 
```bash
npm i  -g dir-changed.js

dch -h

mkdir test
cd test
echo 1 >> 1.txt
## reset
dch reset
cat .sha256sum.json

dch

echo 1 >> 1.txt

dch

dch reset 

dch 
```

## ignore
ignore partly file  or dirs changes  
make .ignore file  just like  .gitignore
```bash
echo 2 > 2.txt
echo "1.txt" > .ignore

dch reset

dch 

echo 1 >> 1.txt

dch

echo 2 >> 2.txt

dch

```

## use in code
```bash
npm i dir-changed.js
```
```js
var dch  = require('dir-changed.js')
(async ()=>{
    // dir is changed
    var isChanged  = await dch.isChanged('yourDirPath' , { ignore : ".git/\r\ndocs/"})
    // here to reset  ( save or commit)
    await dch.reset('yourDirPath' , { ignore : ''})
})()

```