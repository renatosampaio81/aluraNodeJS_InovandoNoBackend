//Este é o arquivo que define as rotas da appWeb

const { json } = require("body-parser");
const { check } = require("express-validator");

/*Foi removido porque connectionFactory está sendo carregado automaticamente na configuração do express (está dentro da pasta infra)
var dbConnection = require('../infra/connectionFactory'); //estou criando a var que vai chamar o arquivo de coneção com o BD (aquele que eu disse que ia isolar ali embaixo)
*/

module.exports = function(app) {
	/* A VAR LISTA PRODUTOS GUARDA A ROTINA DE LISTAR PRODUTOS, QUE ANTERIORMENTE ESTAVA CONTIDA NO /PRODUTOS , COM O OBJETIVO DE UTILIZA-LA EM OUTRAS PAGINAS */
	var listaProdutos = function(request,response,next){ //esse get é do express, quando derem um /produtos no site vai rodar a função que pega uma requisição e volta uma resposta
		// next é uma funcão que informa o fluxo das funçoes que foram executadas no express e que agora podemos indicar qual a proxima, o next...	
		//res.send("<html><body><h1>Listagem de Produtos</h1></body></html>"); //send devolve pro cliente uma mensagem (no caso um html)
					
			/* ESSA PARTE SERÁ ISOLADA
			var mysql = require('mysql'); //cria o objeto que representa o mysql
			var connection = mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
				host: 'localhost', //em JSon, fazemos a configuração da chamada
				user: 'root',
				password: '',
				database: 'casadocodigo'
			});
			*/
	
			/*Como a requisição da conexão ao BD foi removida (pq agora é automatico via express-load), precisaremos adequar a chamada
			var connection = connectionFactory(); // toda vez que quisermos uma conexão com o banco nós vamos chamar o connectionFactory como função
			*/
	
			var connection = app.infra.connectionFactory(); // estou chamando a conexão ao banco via caminho (funcionalidade do load express) em vez de via variável, pq agora o connectionFatory está no express-load
			var produtosDAO = new app.infra.ProdutosDAO(connection); // carrega o modulo produtosBanco, passando connection como argumento
			//se não utilizar o new, o this, dentro da função construtora lá em produtosBranco.js, não funciona direito, não retorna esse objeto produtoBanco de uma forma correta
	
			//connection.query('select * from livros', function(err,results){ //Substituído pela linha de baixo, com objetivo de guardar a query em outro local
			produtosDAO.listagem(function(err,results) { //chama a função lista lá do produtosBranco, passando como argumento a function(err,results) é o callback
				if (err) { //se deu erro, vou notificar o express que deu erro
					//console.log(err);
					return next(err); // return interrompe o fluco e o next informa o express que queremos que ele lide com os erros
				}
				//response.send(results); //o resultado é enviado pro navegador
				response.format({
					html: function(){ //chamará essa chave se o cliente pedir preferencialmente um html (um browser por exemplo)
						response.render('produtos/lista',{lista:results}); //Estamos renderizando para produtos/lista. Em Json, definimos que tem uma chave que se chama Lista que está assossiada ao results, vamos usa-la no lista.ejs
					},
					json: function(){ //chamará essa chave se o cliente pedir preferencialmente um Json (em casos android por exemplo)
						response.json(results);
					}
				});
				
				
			}); // faço a consulta SQL e a function é executada quando o resultado estiver pronto. No min essa função recebe 1 argumento, que é a err (informa se houve errou ou nao), o 2 argumento é o resultado
			connection.end(); // encerra a conexao com o banco
			
			/* Render foi substituido pelo banco sql
			//response.render("produtos/lista"); // foi instalada a bibilioteca ejs, o render vai carregar essa lista ejs que irá conter o html (isso tudo pra separar o html do javascript)
			//pra dar certo, o ejs pede pra criar uma pasta views, depois uma pasta produtos dentro, e depois o arquivo ejs.. que contem o HTML
			*/
		}

	app.get('/produtos', listaProdutos);
	
	/* ao inves de eu escrever isso tudo, eu usei o response.format no bloco de cima, isso é o Contente Negotiation
	app.get('/produtos/json', function(request,response){
		var connection = app.infra.connectionFactory();
		var produtosDAO = new app.infra.ProdutosDAO(connection);
		produtosDAO.listagem(function(err,results) {
			response.json(results);
		});
		connection.end();	
	})
	*/

	app.get('/produtos/form', function(request,response) { //esse get é do express, quando derem um /produtos/remove no site vai rodar a função
		//console.log("cheguei no produtos/form");
		response.render('produtos/form', {errosValidacao:{}, produto:{}}); //aqui carrega a pag produto/form e declara as 2 variáveis que vou usar no form.ejs
	});

	/*Aqui vou comecar a tratar erros com express-validator*/
	const {check, validationResult} = require('express-validator');
		
	app.post('/produtos', 
	[check('titulo', 'Título é obrigatório').notEmpty(),
	check('preco', 'Formato inválido').isFloat()],
	(request,response) => { //usa-se o get quando se quer buscar algo e post quando for criar alguma coisa no servidor (alem do get enviar dados pelo endereço e post enviar escondido pela requisição)

		var produto = request.body; //os dados que foram enviados via formulário, via post (lá no form.ejs) ficam guardados na propriedade body do request (graças ao express)
		//console.log(produto);

		//var validadorTitulo = request.assert('titulo', 'Titulo é obrigatório'); //assert é uma função do express-validator, que serve para criar regras, define o que pode ou nao pode
		//validadorTitulo.notEmpty(); //em cima define qual campo estamos trabalhando e mensagem, aqui definimos qual a regra
		
		const erros = validationResult(request); // retorna um Json com os erros de validação
		//console.log(erros);
		if(!erros.isEmpty()){ //se tiver erro de validação

			response.format({ //em caso de erro, eu verifico se querem a resposta em HTML ou Json
				html: function(){ //chamará essa chave se o cliente pedir preferencialmente um html (um browser por exemplo)
					response.status(400).render('produtos/form',{errosValidacao:erros.array(),produto:produto}); //nao grava e volta pro formulário //errosValidação tá lá no form.ejs e vai receber o array dos erros
					//o status da resposta em questão retorna 200, que deu certo, porém teve erro de validação. O status 400 é o bad request (o request foi com dados inválidos), então definimos este código para esta resposta de erro
				},
				json: function(){ //chamará essa chave se o cliente pedir preferencialmente um Json (em casos android por exemplo)
					response.status(400).json(erros);
				}
			});
			return; //pra interromper aqui e nao gravar
		} 
		

		var connection = app.infra.connectionFactory(); // estou chamando a conexão ao banco via caminho (funcionalidade do load express) em vez de via variável, pq agora o connectionFatory está no express-load
		var produtosDAO = new app.infra.ProdutosDAO(connection); // carrega o modulo produtosBanco, passando connection como argumento
		//se não utilizar o new, o this, dentro da função construtora lá em produtosBranco.js, não funciona direito, não retorna esse objeto produtoBanco de uma forma correta

		produtosDAO.salva(produto,function(err,results) { //o salva precisa estar lá no produtosDAO (como um prototype)
			//produtosDAO.listagem(function(err,results) { //chama a função lista lá do produtosBranco, passando como argumento a function(err,results) é o callback
			//	response.render('produtos/lista',{lista:results}) //Estamos renderizando para produtos/lista. Em Json, definimos que tem uma chave que se chama Lista que está assossiada ao results, vamos usa-la no lista.ejs
			//});	
			// 		response.render('produtos/lista'); //caso tenha salvado com sucesso, volta pra tela de lista de produtos
			
			//listaProdutos(request,response); // se salvou, eu chamo manualmente a listagem dos produtos (porém o endereco permanece /salva)
			response.redirect('/produtos'); //pra resolver o problema relatado acima, uso o redirect, para me livrar do problema do F5 na página de resposta
		});
		
	});
}
