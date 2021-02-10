//var http = require('http');
//var assert = require('assert'); //assert é uma biblioteca/modulo que contem itens de verificação
var express = require('../config/express')(); //aqui eu carrego o express, na verdade o arquivo de configuracao que tem uma funcão que quando chamada carrega o express
//pq estou usando o express ? pq eu preciso passar pro supertest alguem que ele possa usar pra fazer requisições e pegar respostas
var request = require('supertest')(express); //diferente do http, esse modulo retorna uma função que precisamos invocar, por isso os ()
// na chamada eu passo o express como argumento, assim eu nao preciso estar com o servidor rodando para que o supertest realize o teste


describe ('#produtosController',function (){ //describe descreve o cenario de testes, aqui estamos testando o produtosController e dentro da função teremos todos os casos de testes

    beforeEach(function(done){ //beforeEach é executado antes de cada it (é do mocha) //existe também o afterEach, que é igual o beforeEach mas roda ao final de cada it //Pra limpar uma tablela ta perfeito, mas e se fossem varias tabelas ? a biblioteca NODE-DATABASE-CLEANER limpa todas as tabela.. pesquisar
        var conn = express.infra.connectionFactory(); // atribui a variável conn a conexao ao banco de dados
        conn.query("delete from livros",function(ex,result){ //apaga todo conteúdo da tabela livros //depois de apagar roda uma função que recebe como argumento a exceção (o erro) e o resultado
            if(!ex) { //se nao teve erro
                done(); //já finalizamos o beforeEach e pode seguir pro proximo teste
            }
        })
    });

    it('listagem json', function(done){ //com o it eu defino o primeiro item a ser testado //recebe como argumento a done, para que o mocha possa esperar que a conecção com o banco aconteca

        /* Por usar o supertest, não precisamos mais desse acesso ao BD
        var configuracoes = {
            hostname: 'localhost',
            port:3000,
            path: '/produtos',
            headers: {
                'Accept':'application/json' // No headers eu digo que eu aceito que me devolva PREFERENCIALMENTE um Json (eu podia preferir um html (text/html), mas como é para um dispositivo android, vamos preferir um json)
            }
        }
        */

        //http.get(configuracoes, function(response){
        request.get('/produtos') //nao preciso passar o acesso ao BD, apenas a rota que quero acessar "/produtos"
        .set('Accept','application/json') //o set é do superteste, é aqui eu posso especificar outras configurações relaticas a requisição que queremos disparar // Aqui eu digo que defino o cabeçalho esperando json como resposta do accept
        .expect('Content-Type',/json/) //espero que o content-type possua a palavra json nele , as barras : "/ <algumacoisa> /" identificam uma expressão regular
        .expect(200, done); //espero que o status da volta seja 200 //quando passa so o argumento para o supertest ele entende que está checando o status code
        //a funcao DONE é para que o supertest saiba que agora ele pode fazer o disparo da requisição   
        
            //assert.strictEqual(response.statusCode,200); //eu espero que o resultado retornado pelo status code seja 200
            //assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8'); //verifica se o retorno está em json, como pedimos la no headers

            //done() //notifico o mocha que eu acabei
        //});
    })

    it ('cadastro de novo produto com dados invalidos', function(done){
        request.post('/produtos') // vou fazer um post pra gravar um novo produto
        .send({titulo:"",descricao:"novo livro"}) // no send eu coloco os dados em Json
        .expect(400,done); //esperamos como retorno status 400 (bad request)
    })
    it ('cadastro de novo produto com dados validos', function(done){
        request.post('/produtos') // vou fazer um post pra gravar um novo produto
        .send({titulo:"titulo",descricao:"novo livro",preco:20.50}) // no send eu coloco os dados em Json
        .expect(302,done); //esperamos como retorno status 302 (redirect). Porque não se espera 200 (ok sucess) ? porque ele grava os dados no banco e da redirect para a pag de produtos
    })
})