// na aula 07 foi instalado a biblioteca nodemon, o que ele faz ? ele monitora alterações no código enquanto ele estiver em execução, e atualiza o servidor web.. isso pra não precisar ficar fechando e abrindo o serviço de servidor web em qualquer alteração no código.. enquanto estamos programando
// ao inves de carregar a aplicação web com "node nomedaapp.js" voce roda com "nodemon nomedaapp.js" isso somente enquanto vc estiver desenvolvendo.. finalizado nao precisa do nodemon
var configura = require('./config/express'); // importa a biblioteca express, pelo arquivo de config no endereço em questão
var app = configura(); //invoco a função que a var configura está guardando
var server = require('http').createServer(app); //aqui eu importo a biblioteca http, chamo a funcão server passando pra ela o express .. tudo isso pra poder atender a chamada do socket.io. Esse app ta configurado lá no arquivo de config
var io = require('socket.io')(server); //importa o socket io // devidamente importando, ela espera como argumento um handle de requisições.. nao podemos passar o express, precisa ser o html

app.set('io', io);// set serve pra colocarmos coisas dentro do express, aqui eu falo que vai ter uma var io que está assossiada ao retorno da funcao do socket io.. pra que ? pra usar lá no promocoes.js, em rotas

//app.set('view engine', 'ejs'); //set é usado para definir strings pra dentro do express, aqui o view engine é padrão para definição de engines e o ejs é o nome da engine que instalamos e iremos utilizar.
//a linha acima some pq as configuracoes serão feitas no arquivo de config do express 

/* As rotas abaixo foram tiradas daqui e colocadas no app/routes
app.get('/produtos', function(req,res){ //esse get é do express, quando derem um /produtos no site vai rodar a função que pega uma requisição e volta uma resposta
	//res.send("<html><body><h1>Listagem de Produtos</h1></body></html>"); //send devolve pro cliente uma mensagem (no caso um html)
	res.render("produtos/lista") // foi instalada a bibilioteca ejs, o render vai carregar essa lista ejs que irá conter o html (isso tudo pra separar o html do javascript)
	//pra dar certo, o ejs pede pra criar uma pasta views, depois uma pasta produtos dentro, e depois o arquivo ejs.. que contem o HTML
});
*/

/* COMO NO ARQUIVO DE CONFIGURAÇÃO EU DEFINI O EXPRESS-LOAD CARREGAR AUTOMATICAMENTE TUDO DE DENTRO DA PASTA ROUTES, ESSA REQUISIÇaO SE TORNA DESNECESSÁRIA
var rotasProdutos = require('./app/routes/produtos')(app); //aqui eu importo as rotas contidas no arquivo produtos e chamo a função, enviando o app como argumento
*/

/* aqui eu vou trocar, em vez de chamar o listem do express, eu vou chamar do http.. tudo pra atender o socket.io */
//app.listen(3000, function(){ //to chamando o listen pela API do Express, perceba que é bem mais simples que pelo HTML. O servidor vai escutar a porta 3000

var porta = process.env.PORT || 3000; //o Hiroku cria uma variável de ambiente pra definir a porta a ser utilizada para a aplicação, aqui estou chamando essa variável de ambiente, se não encontrar, utiliza a 3000
//http.listen(3000, function(){ //to chamando o listen pela API do Express, perceba que é bem mais simples que pelo HTML. O servidor vai escutar a porta 3000
server.listen(porta, function(){

	var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port); //quando iniciar o serviço de ouvir as requisições pela porta 3000, a função irá disparar a mensagem.
});