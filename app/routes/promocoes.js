// aqui vamos montar a rota pra promoção relampago
module.exports = function(app) {
    app.get("/promocoes/form",function(req,res){ //quando a pessoa acessar promocoes/form, vai levar o user pra view de promocoes
        var connection = app.infra.connectionFactory(); // estou chamando a conexão ao banco via caminho (funcionalidade do load express) em vez de via variável, pq agora o connectionFatory está no express-load
        var produtosDAO = new app.infra.ProdutosDAO(connection); // carrega o modulo produtosBanco, passando connection como argumento
        //se não utilizar o new, o this, dentro da função construtora lá em produtosBranco.js, não funciona direito, não retorna esse objeto produtoBanco de uma forma correta
        produtosDAO.listagem(function(err,results) { //chama a função lista lá do produtosBranco, passando como argumento a function(err,results) é o callback
            res.render('promocoes/form', {lista:results});
        });
        connection.end();    
    });


    //agora vou tratar a gravacao da promocao
    app.post("/promocoes",function(req,res){
        var promocao = req.body; //os dados que foram enviados via formulário, via post (lá no form.ejs) ficam guardados na propriedade body do request (graças ao express)
        console.log(promocao);
        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);
        produtosDAO.get(promocao.livro.id, function(erros, rows) {
            var produto = rows[0];       
            promocao.livro = produto;
            app.get('io').emit('novaPromocao',promocao); //emit passa o tipo de mensagem que nos queremos e o json (promocao) passa pra onde ? pro socket.io tratar (la no index), o ser vidor notifica o navegador e o socket.io trata (fica numa fila)
            // o app.get vai buscar a var io que eu guardei no express la no app.js
            res.redirect('promocoes/form');
        });    
    });

}