var express = require('express'); // carrega o módulo express
var load = require('express-load'); // carrega a biblioteca do express-load
var bodyParser = require('body-parser');


module.exports = function() { //No app.js, o require chama um arquivo de configuração, esse arquivo é um modulo e deve conter uma funtion dentro. Pra chamar essa function é necessário o module.exports

	var app = express(); //invoco o objeto express

	app.use(express.static('./app/public')); // define o local dos recursos staticos, por exemplo o css .. se não fosse isso, teriamos que fazer uma rota pra cada um dos css por exemplo
	app.set('view engine','ejs'); // define a engine de view, a primeira é padrão e a segunda é o ejs no nosso caso
	app.set('views','./app/views'); // define a localização da pasta views .. apartir do local onde é a raiza da aplicação (./) , dentro do diretoório app/viws

	//PRECISA VIR ANTES DO CARREGAMENTO DOS MODULOS, PRA QUE ELES POSSAM IR COM O BODY-PARSER, ESSE É O MIDDLEWARE DO BODYPARSER
	//req --> middlewareBodyParsers --> middlewareAutenticação (por exemplo) --> função que trata a requisição
	app.use(bodyParser.urlencoded({extended: true})); //o use recebe funções que serão aplicadas ao request na ordem que definirmos aqui.
	//UrlEncoded é justamente o formato que o formulário envia os dados para o servidor
	app.use(bodyParser.json()); // inclui o formato Json como um segundo formato para enviar dados pro SQL

	//ABAIXO CARREGA TODOS OS MODULOS DA NOSSA APLICAÇÃO
	load('routes', {cwd: 'app'})//invoco o objeto do load e carrego dentro do express (que é a var app (.into(app))). O routes é a pasta onde ficam as rotas, agora fica definido que tudo que está dentro de routes é carregado automaticamente dentro da app
	.then('infra')//aqui estou carregando também a pasta infra, pra poder carregar o connetionFactory automaticamente também. O Json {cwd: 'app'} especifica que ele deve procurar a pasta route a partir do diretório app
	.into(app); 

	// middleware para tratar enderecos digitados errados na barra do navegador
	// ele precisa entrar exatamente aqui, depois do load routes, pra poder ter a chance de encontrar a pagina digitada, senao nao vai encontrar nem as paginas que existem
	app.use(function(req,res,next){
		res.status(404).render('erros/404'); //se uma resposta a uma requisição retornar status 404 (pagina nao localizado), renderiza pra mim a pagina 404.ejs
		next();
	})
	
	app.use(function(error,req,res,next){ //nesse middleware, se um erro acontecer no express ele vai procurar esse middleware, mesmo o 404 estando antes, porque esse middleware está esperando um erro como 1 argumento
		if(!process.env.NODE_ENV) { //se não estiver definido nada no NODE_ENV, ele mostra a pagina de erro, se tiver em test.. aparece a mensagem padrao
			res.status(500).render('erros/500'); //se uma resposta a uma requisição retornar status 404 (pagina nao localizado), renderiza pra mim a pagina 404.ejs
			return;
		}
		next(error); //se tiver em produção (ou seja, NODE_ENV=''), ele vai chamar a proxima função do express passando error como argumento. se tiver em teste (ou seja, NODE_ENV='test'), ele vai mostrar a pagina de erro 500
	})

	return app; //retorna o objeto express configurado pra utilizar ejs	
}
