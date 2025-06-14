import http from 'http';
import crudHandler from "./layers/crudHandler.js";
const port = 3000;

const server = http.createServer((req, res)=>{
    crudHandler(req, res)
})

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
})