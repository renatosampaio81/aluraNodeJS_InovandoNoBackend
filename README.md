# Curso Alura - Inovando com JavaScript no BackEnd
# 
## Comentários:
## O projecto roda na servidor local normalmente, porém está dando erro 500 no Heroku.
### O curso é antigo, utilizava o NodeJS 4.1.1. Eu já havia feito algumas adequações no código para trazer pra versão 14.15, principalmente na área de validações, mas ainda não consegui solucionar o problema atual. Pelo log do heroku o problema está no arquivo de rotas da home, ele não está conseguindo acessar o connectionFactory, que está dentro da pasta Infra. Estou utilizando o express-load pra configurar as rotas, e no servidor local funciona bem.
# 
## Instruções:
### - O NODE_ENV está setado para "production", configurado para conecção com o BD ClearDB. No modo "dev" e "test" o banco de dados é local. Na pasta do projeto tem um arquivo SQL para criação do banco local.
### - Para instalar as dependências locais, execute npm install
### - Para rodar a aplicação no Heroku, está configurado o script "start", no package.json
