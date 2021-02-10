var http = require('http'); // importa a biblioteca http 
http.createServer(function(request,response){ // createServer cria o servidor http, a função recebe como argumento.
	if(request.url == "/produtos"){
		response.end("<html><body><h1>Listando os Produtos da loja</h1></body></html>")
	}else{
		response.end("<html><body><h1>Home da casa do codigo</h1></body></html>")
	}
}).listen(3000,"localhost"); // fica escutando as requisições na porta 3000 (localhost:3000)
console.log("servidor ta rodando");