
/*SE EU DEIXAR ASSIM, O EXPRESS LOAD VAI EXECUTAR ESSA FUNÇÃO ASSIM QUE CARREGAR, E VAI DAR ERRO. COLOCANDO UMA FUNÇÃO DENTRO DA OUTRA ELE NAO EXECUTA

module.exports = function(connection) { //como vou usar o conection em varios métodos dessa classe, eu deixo ele aqui para ser recebido como atributo (ou variável de estado) e aproveitado nos métodos abaixo
	this.listagem = function(callback) { //aqui recebo o callback lá do produtos.js
		connection.query('select * from livros', callback); //monta a query

	}
	return this
}
*/

/* TODA VEZ QUE ESSA FUNÇÃO É CHAMADA A FUNÇÃO QUE RODA A QUERY EH EXECUTADA PRA SER RETORNADA DENTRO DO THIS. CONSOME MUITO MEMORIA
module.exports = function() { //o express load vai carregar o produtosBanco mas nao vai executar a função
	return function(connection) { //como vou usar o conection em varios métodos dessa classe, eu deixo ele aqui para ser recebido como atributo (ou variável de estado) e aproveitado nos métodos abaixo
		this.listagem = function(callback) { //aqui recebo o callback lá do produtos.js, this referencia o objeto que estavos usando
			connection.query('select * from livros', callback); //monta a query

		}
		return this
	}
		
}
*/

function ProdutosDAO(connection){
	this._connection = connection;
}

ProdutosDAO.prototype.get = function(id, callback) {
    this._connection.query("select * from livros where id = ?", id, callback);
}

//prototype adiciona coisas na estrutura padrao de uma classe, aqui estamos incluindo uma lista, que é na verdade uma função
ProdutosDAO.prototype.listagem = function(callback) { //aqui recebo o callback lá do produtos.js, this referencia o objeto que estavos usando
	this._connection.query('select * from livros', callback); //monta a query
}

ProdutosDAO.prototype.salva = function(produto,callback) { //aqui recebo o callback lá do produtos.js, this referencia o objeto que estavos usando
	this._connection.query('insert into livros set ?',produto,callback); //quero que voce insira em livros um conjunto de dados, que está em produto (em formato Json)
	//PRA DAR CERTO, OS NOMES DAS COLUNAS DO BANCO E AQUI NO FORM.EJS PRECISAM SER IGUAIS
}

module.exports = function(){
	return ProdutosDAO; //quando o objeto produtosBanco for instanciado, esse módulo vai chamar a classe ProdutosBanco
}