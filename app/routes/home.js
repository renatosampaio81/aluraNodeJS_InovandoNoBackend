// AQUI VAMOS CONFIGURAR A ROTA DA PAGINA PRINCIPAL

module.exports = function(app) {
    app.get('/', function(request,response){ //assossia a raiz da aplicação "/" a uma função que irá tratar as requisições e as respostas
        var connection = app.infra.connectionFactory(); // estou chamando a conexão ao banco via caminho (funcionalidade do load express) em vez de via variável, pq agora o connectionFatory está no express-load
        var produtosDAO = new app.infra.ProdutosDAO(connection); // carrega o modulo produtosBanco, passando connection como argumento
        //se não utilizar o new, o this, dentro da função construtora lá em produtosBranco.js, não funciona direito, não retorna esse objeto produtoBanco de uma forma correta
        produtosDAO.listagem(function(err,results,fields) { //chama a função lista lá do produtosBranco, passando como argumento a function(err,results) é o callback
            response.render('home/index',{livros:results});
        });
        connection.end();    
    }); 
}