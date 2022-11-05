const readline = require('readline');

const tgit = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Welcome to TypeGit!')

let n: number;
tgit.on("line", function <T>(line: T) {
    n = Number(line);
    console.log(n)
    tgit.close();
})