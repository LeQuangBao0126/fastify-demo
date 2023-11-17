const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numberOfCores = os.cpus().length / 2

if (cluster.isMaster) {
    console.log(`Master ${process.pid} started`);
    for (let i = 0; i < numberOfCores; i++) {
        const worker = cluster.fork();
        worker.on('online', () => {
            console.log(`Worker ${worker.process.pid} started`);
        });
        worker.on('exit', () => {
            console.log(`worker ${worker.process.pid} stopped working`);
            cluster.fork();
        });
    }
    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} stopped working`);
        cluster.fork();
    });
    cluster.on('fork', (worker) => {
        console.log(`Worker ${worker.process.pid} started`);
    });

} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Process ${process.pid} says hello!`);
    }).listen(8000);
}