// CONECTION FACTORY CRIAM AS CONEXOES COM O BANCO DE DADOS
var mysql = require('mysql'); //cria o objeto que representa o mysql

/* O express load carrega e invoca o obejto quando é chamado, como o connectionFactory está dentro de Infra, se deixarmos como está (abaixo) ele vai carregar o connectionFactory já acionando a requisiçao ao Banco de Dados, e eu quero eu chamar o Banco de Dados, então vamos adaptar um wrapper que vai impedir esse acesso automático ao banco quando a app é criada.
module.exports = function(){ //cria o modulo que vai exportar a função
	return mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
			host: 'localhost', //em JSon, fazemos a configuração da chamada
			user: 'root',
			password: '',
			database: 'casadocodigo'
	});
}
*/

function createDBConnection() { //essa é a função embrublhada, que'não será chamada na subido do app (via express-load), e sim quando eu quiser chama-la dentro da minha aplicação
	//if(process.env.NODE_ENV == 'development') { // se o NODE_ENV estiver definido como development

	if(!process.env.NODE_ENV || process.env.NODE_ENV == 'dev') { //se nao tiver definido nenhuma variavel de ambiente NODE_ENV, estamos fazendo desenvolvimento (fim das contas é igual que o de cima)
		console.log("agora sim conectei o BD local");
		return mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
			host: 'localhost', //em JSon, fazemos a configuração da chamada
			user: 'root',
			password: '',
			database: 'casadocodigo'
		});
	}
	
	if(process.env.NODE_ENV == 'test') { //se nao tiver definido nenhuma variavel de ambiente NODE_ENV, estamos fazendo desenvolvimento (fim das contas é igual que o de cima)
		console.log("agora sim conectei o BD teste");
		return mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
				host: 'localhost', //em JSon, fazemos a configuração da chamada
				user: 'root',
				password: '',
				database: 'casadocodigo_test'
		});
	}

	if(process.env.NODE_ENV == 'production') { //se nao tiver definido nenhuma variavel de ambiente NODE_ENV, estamos fazendo desenvolvimento (fim das contas é igual que o de cima)
		console.log("agora sim conectei o BD remoto");
		
		
		var urlDeConexao = process.env.CLEARDB_DATABASE_URL;

	        console.log(urlDeConexao);

	        var grupos = urlDeConexao.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
        
	        var user = grupos[1],
        	    password = grupos[2],
            	    host = grupos[3],
            	    database = grupos[4];

        	console.log(`User ${user}, password: ${password}, host: ${host}, database: ${database}`);
             
        	return  mysql.createConnection({            
            	    host : host,
            	    user : user,
            	    password : password,
        	    database : database
	        });
		


		/*
		//Vou conectar ao Banco em Núvem que o Hiroku me deu, se eu substituir os dados abaixos eles ficarão publicos, entao vou criar uma var que vai remeter a variável de ambiente que o hiroku criou no meu servidor
		var url = process.env.CLEARDB_DATABASE_URL;
		//aqui vou criar uma expressao regular para ir cortando cada campo dessa urlDeConexao e transformando em um array
		var grupos = url.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/); // regex semore entre "//"  depois comeca com sql: dai tem que skipar as barras, depois das barras vem o login, que é um grupo que vai ate o :  dai depois outro grupo que vai até o @
		// o primeiro araay [0] é a expressao regular inteira SEMPRE
				
		return mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
			host: grupos[3], //em JSon, fazemos a configuração da chamada
			user: grupos[1],
			password: grupos[2],
			database: grupos[4]	
		});
		
		
		return mysql.createConnection({ //a var connection vai estabelecer a conexão com o banco de dados
			host: 'us-cdbr-east-03.cleardb.com', //em JSon, fazemos a configuração da chamada
			user: 'b407b90d80320e',
			password: 'bd71afb5',
			database: 'heroku_0f6ecef09db5a41'	
		});
		*/
	}
}

//abaixo um wrapper - embrulha a outra função
module.exports = function() { //cria o modulo que vai exportar a função
	console.log("express load está chamando o wrapper");
	return createDBConnection; //aqui NAO estou chamando a funçao ( usando createConnection() )
}