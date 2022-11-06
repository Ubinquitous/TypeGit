/* require */
const readline = require('readline');
const fs = require('fs');
const fse = require('fs-extra')
const g_path = require("path");
const exec = require('child_process').exec
let TGIT_STACK: any = [];

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

process.stdout.write(`${__dirname} (TGIT)\n> `);
rl.prompt();

rl.on("line", function <T>(line: T) {
    cmd = String(line);

    if (cmd === 'tgit init') {
        isInit = true;

        fs.writeFile(`${__dirname}/tgit.log`, '', 'utf8', function (error) { });
        fse.emptyDirSync(`${__dirname}/TGIT`);
        console.log('\u001b[32m' + 'TypeGit : TypeGit에 있는 모든 저장소를 초기화했습니다.\u001b[0m\n')
        process.stdout.write(`${__dirname} (TGIT)\n> `);
    } else if (!isInit) {
        console.log('\u001b[41m' + 'TypeGit Error 1000 :: 먼저 초기화를 해야합니다. 초기화하지 않고 타입깃을 이용할 경우 원인 모를 에러가 발생할 수 있습니다. \u001b[0m');
        console.log('\u001b[41m' + '다음 명령어를 사용해주세요 : tgit init \u001b[0m\n');
        process.stdout.write(`${__dirname} (TGIT)\n> `);
    }

    /* 폴더 핸들링 */

    if (isInit) {
        if (cmd.includes('mkdir ')) { // 폴더 생성
            if (cmd.includes('mkdir TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1011 :: TGIT 폴더는 접근할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let path = `${__dirname}/${cmd.replace('mkdir ', '')}`;

                checkMakeDir(path, (error, isTrue) => {
                    if (error) {
                        console.log(`\u001b[41mTypeGit Error System Error :: ${error} \u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                    if (!isTrue) {
                        console.log('\u001b[41m' + 'TypeGit Error 1001 :: 이미 동일한 폴더가 존재합니다. \u001b[0m\n');
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    } else {
                        fs.mkdir(path, (error) => {
                            if (error)
                                console.log(error);

                            console.log('\u001b[32mTypeGit : 성공적으로 폴더를 생성했습니다.\u001b[0m');
                            console.log(`\u001b[32m폴더 경로 : ${__dirname}/${cmd.replace('mkdir ', '')}\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);
                        });
                    };
                });
            }
        } else if (cmd.includes('rmdir ')) { // 폴더 삭제
            let path = `${__dirname}/${cmd.replace('rmdir ', '')}`;

            if (cmd === 'rmdir TGIT') {
                console.log(`\u001b[41mTypeGit Error 1009 :: TGIT 폴더는 삭제할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                fs.readdir(path, (error, data) => {
                    if (error) {
                        console.log(`\u001b[41mTypeGit Error 1002 :: 해당 폴더를 찾을 수 없습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                    else {
                        fs.rmdir(path, (error) => {
                            if (error) {
                                console.log(`\u001b[41mTypeGit Error 1007 :: 폴더가 비어있는 상태가 아닙니다. \u001b[0m`);
                                process.stdout.write(`${__dirname} (TGIT)\n> `);
                            } else {
                                console.log('\u001b[32mTypeGit : 성공적으로 폴더를 삭제했습니다.\u001b[0m\n');
                                process.stdout.write(`${__dirname} (TGIT)\n> `);
                            }
                        })
                    }
                });
            }
        } else if (cmd.includes('fdir ')) { // 폴더 검색
            if (cmd.includes('fdir TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1012 :: TGIT 폴더는 접근할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let path = `${__dirname}/${cmd.replace('fdir ', '')}`;
                fs.readdir(path, (error) => {
                    if (error) {
                        console.log(`\u001b[32mTypeGit : ${cmd.replace('fdir ', '')} 폴더를 찾을 수 없습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                    else {
                        console.log(`\u001b[32mTypeGit : ${cmd.replace('fdir ', '')} 폴더는 존재합니다.\u001b[0m`);
                        console.log(`\u001b[32m폴더 경로 : ${path}\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                });
            }
        } else if (cmd === 'ls') {
            fs.readdir('./', function (error, filelist) {
                console.log(`\u001b[32mTypeGit : 현재 경로의 파일 목록은 다음과 같습니다 : \u001b[0m`);
                console.log(filelist);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            })
        } else if (cmd.includes('touch ')) {
            if (cmd.includes('touch TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1012 :: TGIT 폴더는 접근할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let path = `${__dirname}/${cmd.replace('touch ', '')}`;
                fs.writeFile(path, '', function (error) {
                    if (fs.readdir('./', function (error, filelist) { filelist.includes(path.replace('touch ', '')) })) {
                        console.log(`\u001b[41mTypeGit Error 1003 :: 이미 동일한 파일이 존재합니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    } else {
                        console.log(`\u001b[32mTypeGit : 파일을 생성했습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                });
            }
        } else if (cmd.includes('rm -rf ')) {
            if (cmd.includes('rm -rf TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1013 :: TGIT 폴더 내로 접근할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else if (cmd.includes('rm -rf tgit.log')) {
                console.log(`\u001b[41mTypeGit Error 1014 :: tgit.log 파일은 삭제할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let path = `${__dirname}/${cmd.replace('rm -rf ', '')}`;
                fs.unlink(path, (error) => {
                    if (error) {
                        console.log(`\u001b[41mTypeGit Error 1004 :: 해당 파일을 찾을 수 없습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    } else {
                        console.log(`\u001b[32mTypeGit : 파일을 삭제했습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                })
            }
        } else if (cmd.includes('cat ')) {
            let path = `${__dirname}/${cmd.replace('cat ', '')}`;
            fs.readFile(path, 'utf8', (error, data) => {
                if (error) {
                    console.log(`\u001b[41mTypeGit Error 1005 :: 해당 파일을 읽을 수 없습니다.\u001b[0m\n`);
                    process.stdout.write(`${__dirname} (TGIT)\n> `);
                } else {
                    if (!data) {
                        console.log(`\u001b[32mTypeGit : 파일이 비어있습니다.\u001b[0m\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    } else {
                        console.log(`\u001b[32mTypeGit : 파일의 내용은 다음과 같습니다 :\u001b[0m`);
                        console.log(`${data}\n`);
                        process.stdout.write(`${__dirname} (TGIT)\n> `);
                    }
                }
            });
        } else if (cmd.includes('tgit write ')) {
            if (cmd.includes('tgit write TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1013 :: TGIT 폴더 내로 접근할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else if (cmd.includes('tgit write tgit.log')) {
                console.log(`\u001b[41mTypeGit Error 1015 :: tgit.log의 내용을 변경할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let path = `${__dirname}/${cmd.replace('tgit write ', '')}`;
                let content: String = "";
                console.log(`\u001b[32mTypeGit : 내용을 입력하세요 :\u001b[0m`);

                rl.question("", (line) => {
                    content = String(line);
                    console.log(`\u001b[32mTypeGit : 성공적으로 입력되었습니다.\u001b[0m`);
                    fs.writeFile(path, content, 'utf8', function (error) {
                        if (error) {
                            console.log(`\u001b[41mTypeGit System Error :: ${error}.\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);
                        } else {
                            console.log(`\u001b[32mTypeGit : 성공적으로 파일에 저장되었습니다.\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);
                        }
                    });
                });
            }
        } else if (cmd.includes('tgit rename')) {
            if (cmd.includes('tgit rename TGIT')) {
                console.log(`\u001b[41mTypeGit Error 1013 :: TGIT 폴더의 이름은 변경할 수 없습니다.\u001b[0m\n`);
                process.stdout.write(`${__dirname} (TGIT)\n> `);
            } else {
                let folder, newFolder;
                rl.question("폴더명 : ", (line) => {
                    folder = `${__dirname}/${String(line)}`;

                    rl.question("변경할 폴더명 : ", (line) => {
                        newFolder = `${__dirname}/${String(line)}`;

                        fs.rename(folder, newFolder, function (error) {
                            if (error) {
                                console.log(`\u001b[41mTypeGit Error 1006 :: 해당 폴더를 불러올 수 없습니다.\u001b[0m\n`);
                                process.stdout.write(`${__dirname} (TGIT)\n> `);
                            } else {
                                console.log(`\u001b[32mTypeGit : 성공적으로 폴더명을 변경했습니다.\u001b[0m\n`);
                                process.stdout.write(`${__dirname} (TGIT)\n> `);
                            }
                        })
                    })
                })
            }
        } else if (cmd.includes('tgit upload ')) {
            let path = `${__dirname}/${cmd.replace('tgit upload ', '')}`;
            let author = '';
            let email = '';
            let date: any;
            rl.question("\u001b[32mTypeGit : 업로드하는 author의 이름을 알려주세요.\u001b[0m\n", (line) => {
                author = String(line);

                rl.question("\u001b[32mTypeGit : 업로드하는 author의 email을 입력해주세요.\u001b[0m\n", (line) => {
                    email = String(line);

                    fs.writeFile(`${__dirname}/TGIT/${cmd.replace('tgit upload ', '')}`, '', function (error) {
                        if (error) {
                            console.log(`\u001b[41mTypeGit System Error :: ${error}.\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);
                        }
                    });
                    fs.copyFile(path, `${__dirname}/TGIT/${cmd.replace('tgit upload ', '')}`, (error) => {
                        if (error) {
                            console.log(`\u001b[41mTypeGit Error 1008 :: 해당하는 파일을 찾을 수 없습니다.\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);

                            fs.unlink(`${__dirname}/TGIT/${cmd.replace('tgit upload ', '')}`, (error) => {

                            })
                        } else {
                            console.log(`\u001b[32mTypeGit : 성공적으로 추가되었습니다!\u001b[0m\n`);
                            process.stdout.write(`${__dirname} (TGIT)\n> `);
                            const NOW_DATE = new Date();
                            date = NOW_DATE;

                            TGIT_STACK.push({
                                UPLOAD: `${__dirname}/TGIT/${cmd.replace('tgit upload ', '')}`,
                                Author: `${author} <${email}>`,
                                Date: `${date}`
                            })

                            fs.appendFile(`${__dirname}/tgit.log`, JSON.stringify(TGIT_STACK), function (err) {
                                if (error) {
                                    console.log(`\u001b[41mTypeGit System Error :: ${error}.\u001b[0m\n`);
                                    process.stdout.write(`${__dirname} (TGIT)\n> `);
                                }
                            });
                        }
                    });
                })
            })
        } else if (cmd === ('tgit remove HEAD')) {
            fs.unlink(TGIT_STACK[0].UPLOAD, (error) => {
                if (error) {
                    console.log(`\u001b[41mTypeGit Error 1010 :: 해당 업로드를 찾을 수 없습니다.\u001b[0m\n`);
                    process.stdout.write(`${__dirname} (TGIT)\n> `);
                } else {
                    console.log(`\u001b[32mTypeGit : 해당 업로드를 삭제했습니다.\u001b[0m\n`);
                    process.stdout.write(`${__dirname} (TGIT)\n> `);
                }
            })
        }
    }
    if (cmd === 'exit()') {
        rl.close();
    }
})
