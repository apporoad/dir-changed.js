# dir-changed.js
check changes in dir

## just touch it 
```bash
npm i  -g dir-changed.js

dch -h

cd  xxxxxxxx
## test changed
dch
## reset
dch reset

cat .sha256sum.json

dch
# edit some file now
dch
```

## ignore
ignore partly file  or dirs changes  
make .ignore file  just like  .gitignore

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