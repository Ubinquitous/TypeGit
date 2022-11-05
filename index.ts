/* require */

const readline = require('readline');
const fs = require('fs');

/* functions */

const TypeGit = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const checkMakeDir = (path: String, callback) => {
    fs.stat(path, (error, stats) => {
        if (error && error.code === 'ENOENT')
            return callback(null, true);
        if (error)
            return callback(error);

        return callback(null, !stats.isDirectory());
    });
};

/* variable */

let isInit: Boolean = false;
let cmd: String = "";

/* compile */

console.log('Welcome to TypeGit!')

TypeGit.on("line", function <T>(line: T) {
    cmd = String(line);

    if (cmd === 'tgit init') {
        isInit = true;
        console.log('\u001b[32m' + 'TypeGit : TypeGit에 있는 모든 저장소를 초기화했습니다.\u001b[0m')

    } else if (!isInit) {
        console.log('\u001b[41m' + 'TypeGit Error 1000 :: 먼저 초기화를 해야합니다. 초기화하지 않고 타입깃을 이용할 경우 원인 모를 에러가 발생할 수 있습니다. \u001b[0m');
        console.log('\u001b[41m' + '다음 명령어를 사용해주세요 : tgit init \u001b[0m');
    }

    /* 폴더 핸들링 */

    if (isInit) {
        if (cmd.includes('tgit mkdir ')) {
            let path = `tgit/${cmd.replace('tgit mkdir ', '')}`

            checkMakeDir(path, (error, isTrue) => {
                if (error)
                    return console.log(error);

                if (!isTrue) {
                    console.log('\u001b[41m' + 'TypeGit Error 1001 :: 동일한 폴더명이 존재합니다. \u001b[0m');
                } else {
                    fs.mkdir(path, (error) => {
                        if (error)
                            console.log(error);

                        console.log('\u001b[32mTypeGit : 성공적으로 폴더를 생성했습니다.\u001b[0m')
                        console.log(`\u001b[32m폴더 경로 : ${path}\u001b[0m`)
                    });
                };
            });
        }
    }



    if (cmd === 'exit()') {
        TypeGit.close();
    }
})