/* require */
const readline = require('readline');
const fs = require('fs');
const g_path = require("path");

/* functions */

const rl = readline.createInterface({
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

rl.setPrompt(`${__dirname}/tgit>`);
rl.prompt();

rl.on("line", function <T>(line: T) {
    cmd = String(line);

    if (cmd === 'tgit init') {
        isInit = true;
        console.log('\u001b[32m' + 'TypeGit : TypeGit에 있는 모든 저장소를 초기화했습니다.\u001b[0m\n')
        process.stdout.write(`${__dirname}/tgit>`);
    } else if (!isInit) {
        console.log('\u001b[41m' + 'TypeGit Error 1000 :: 먼저 초기화를 해야합니다. 초기화하지 않고 타입깃을 이용할 경우 원인 모를 에러가 발생할 수 있습니다. \u001b[0m');
        console.log('\u001b[41m' + '다음 명령어를 사용해주세요 : tgit init \u001b[0m\n');
        process.stdout.write(`${__dirname}/tgit>`);
    }

    /* 폴더 핸들링 */

    if (isInit) {
        if (cmd.includes('mkdir ')) { // 폴더 생성
            let path = `${__dirname}/tgit/${cmd.replace('mkdir ', '')}`;

            checkMakeDir(path, (error, isTrue) => {
                if (error) {
                    console.log(`\u001b[41mTypeGit Error System Error :: ${error} \u001b[0m\n`);
                    process.stdout.write(`${__dirname}/tgit>`);
                }
                if (!isTrue) {
                    console.log('\u001b[41m' + 'TypeGit Error 1001 :: 동일한 폴더명이 존재합니다. \u001b[0m\n');
                    process.stdout.write(`${__dirname}/tgit>`);
                } else {
                    fs.mkdir(path, (error) => {
                        if (error)
                            console.log(error);

                        console.log('\u001b[32mTypeGit : 성공적으로 폴더를 생성했습니다.\u001b[0m');
                        console.log(`\u001b[32m폴더 경로 : ${__dirname} / tgit / ${cmd.replace('mkdir ', '')}\u001b[0m\n`);
                        process.stdout.write(`${__dirname}/tgit>`);
                    });
                };
            });
        } else if (cmd.includes('rmdir ')) { // 폴더 삭제
            let path = `${__dirname}/tgit/${cmd.replace('rmdir ', '')}`;

            fs.readdir(path, (error, data) => {
                if (error) {
                    console.log(`\u001b[41mTypeGit Error 1002 :: 해당 폴더를 찾을 수 없습니다.\u001b[0m\n`);
                    process.stdout.write(`${__dirname}/tgit>`);
                }
                else {
                    fs.rmdir(path, (error) => {
                        if (error)
                            console.log(`\u001b[41mTypeGit Error System Error :: ${error} \u001b[0m`);
                        console.log('\u001b[32mTypeGit : 성공적으로 폴더를 삭제했습니다.\u001b[0m\n');
                        process.stdout.write(`${__dirname}/tgit>`);
                    })
                }
            });
        } else if (cmd.includes('fdir ')) { // 폴더 검색
            let path = `${__dirname}/tgit/${cmd.replace('fdir ', '')}`;
            fs.readdir(path, (error) => {
                if (error) {
                    console.log(`\u001b[32m${cmd.replace('fdir ', '')} 폴더를 찾을 수 없습니다.\u001b[0m\n`);
                    process.stdout.write(`${__dirname}/tgit>`);
                }
                else {
                    console.log(`\u001b[32m${cmd.replace('fdir ', '')} 폴더는 존재합니다.\u001b[0m`);
                    console.log(`\u001b[32m폴더 경로 : ${path}\u001b[0m\n`);
                    process.stdout.write(`${__dirname}/tgit>`);
                }
            });
        }
    }
    if (cmd === 'exit()') {
        rl.close();
    }
})
