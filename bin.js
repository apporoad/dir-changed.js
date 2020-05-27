#! /usr/bin/env node

var main = require('./index')

const program = require('commander')

program.version(require('./package.json').version)
    .usage('     检查是否存在变化\r\n' +
        "dch  reset 重置变更点" )
    .parse(process.argv) 

if(program.args.length>0){
    if(program.args[0] == 'reset'){
        main.reset(process.cwd(),{})
    }else{
        console.log('dcd  -h  for help')
    }
}else{
    main.isChanged(process.cwd() ,{}).then(r=>{
            console.log( r? 'dir changed' : 'dir not changed')
    })
}