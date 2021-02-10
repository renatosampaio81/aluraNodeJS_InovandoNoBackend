/* com o app.js rodando, ele se conecta ao localhost e traz o json do /produtos */
var http = require('http');

var configuracoes = {
    hostname: 'localhost',
    port:3000,
    path: '/produtos',
    headers: {
        'Accept':'application/json' // No headers eu digo que eu aceito que me devolva PREFERENCIALMENTE um Json (eu podia preferir um html (text/html), mas como é para um dispositivo android, vamos preferir um json)
    }
}

http.get(configuracoes, function(response){
    console.log (response.statusCode); // checa o status da resposta
    response.on('data', function(body){  //response, quando os dados da requisição tiverem prontos, dai chama outra outra funcao que me retorna o corpo devolvido pelo servidor
        console.log('Corpo: ' + body);
    });
});
