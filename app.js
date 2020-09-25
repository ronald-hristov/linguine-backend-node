const http = require('http');

function rqListener(request, response) {

}

const server = http.createServer((request, response) => {
    console.log(request.url, request.method, request.headers);

    response.setHeader('Content-Type', 'text/html');
    response.write('opa');
    response.end();
});

server.listen(3000);