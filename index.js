const utils = require('lisa.utils')
const find = require('find')
const ignore = require('gitignore-parser')
const fs = require('fs')
const path = require('path')
const hasha = require('hasha')


const defaultIgnoreFileName = '.ignore'
const defaultDirSha256 = '.sha256sum.json'

exports.reset = exports.commit = exports.save = async (dirPath, options) => {
    options = options || {}
    var files =  await exports.getFileNames(dirPath,options)
    var sha256 = exports.getDirSha256(files)
    fs.writeFileSync(path.join(dirPath,defaultDirSha256),JSON.stringify(sha256), 'utf8')
}

exports.getFileNames = async (dirPath, options) => {
    var paramsIgnore = options.ignore ? ignore.compile(options.ignore) : null
    var ignoreFilePath = path.join(dirPath, options.ignoreFile || defaultIgnoreFileName)
    var configIgnore = fs.existsSync(ignoreFilePath) ? ignore.compile(fs.readFileSync(ignoreFilePath, 'utf8')) : null
    return new Promise((r, j) => {
        find.file(dirPath, files => {
            var rfiles = []
            files.forEach(f => {
                var rf  =utils.startTrim(utils.startTrim(f.replace(/[\\]/g,"/"),dirPath.replace(/[\\]/g,"/")) , "/")
                if(rf == defaultDirSha256 || rf == defaultIgnoreFileName){
                    return
                }
                if (paramsIgnore && paramsIgnore.denies(rf)) {
                    return
                }
                if (configIgnore && configIgnore.denies(rf)) {
                    return
                }
                rfiles.push(f)
            })
            r(rfiles)
        })
    })
}

exports.isChanged =async (dirPath, options) => {
    options = options || {}
    if(!fs.existsSync(path.join(dirPath, defaultDirSha256))){
        return true
    }
    var nowFiles = await Promise.resolve(exports.getFileNames(dirPath,options))
    var historyFiles = JSON.parse(fs.readFileSync(path.join(dirPath, defaultDirSha256), 'utf8'))
    if(nowFiles.length !=  historyFiles.length){
        return true
    }
    nowFiles.sort((a,b)=>{return  a-b})
    historyFiles.sort((a,b)=> { return a.name - b.name})
    if(!utils.ArrayEquals(nowFiles,historyFiles , (now , historyFiles) => {
        if(now == historyFiles.name){
            return true
        }
        return now - historyFiles.name
    })){
        return true
    }
    //获取sha256
    var newFiles = exports.getDirSha256(nowFiles)
    return !utils.ArrayEquals(newFiles,historyFiles,(a,b)=>{
        return a.name ==b.name && a.sha256 == b.sha256
    })
}

exports.getDirSha256 = (files) =>{
    var arr = []
    files.forEach(f=>{
        arr.push({
            name : f,
            sha256 :  hasha.fromFileSync(f , {algorithm : "sha256"})
        })
    })
    return arr
}