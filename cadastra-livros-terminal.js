 /* com o app.js rodando, esse js envia para o BD SQL o cadastro de um livro */
var http = require('http');

var configuracoes = {
    hostname: 'localhost',
    port:3000,
    path: '/produtos',
    method: 'post',
    headers: {
        'Accept':'application/json', // No headers eu digo que eu aceito que me devolva PREFERENCIALMENTE um Json (eu podia preferir um html (text/html), mas como é para um dispositivo android, vamos preferir um json)
        'Content-type':'application/json' //quero enviar os dados via Json, configuro aqui. 
    }
}

var client = http.request(configuracoes, function(response){
    console.log (response.statusCode); // checa o status da resposta
    response.on('data', function(body){  //response, quando os dados da requisição tiverem prontos, dai chama outra outra funcao que me retorna o corpo devolvido pelo servidor
        console.log('Corpo: ' + body);
    });
});

var produto = {
    titulo : '',
    descricao: 'node, javascript e um pouco sobre http',
    preco : 100
}

client.end(JSON.stringify(produto)); //somente quando fecha que dispara a requisição //Eu preciso passar o Json em formato de string, por isso uso stringify
