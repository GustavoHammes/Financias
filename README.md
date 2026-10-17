# Sistema de Financias

## Grupo:

- Alisson
- Georgia
- Gustavo
- Igor
- João Pedro

## Tema 

Sistema de investimento com banco de dados e relatório 

## Objetivo

Dado um capital investido ou um empréstimo com taxa configurável, mostrar condições de quitação ou retorno.

Ex.: Comprei algo parcelado, fiz um empréstimo, vou pagar em 24x, há uma taxa X, precisamos mostrar quanto será pago mês a mês, considerando juros complexo, ou juros sobre juros.

Ou então, se eu fizer um investimento X, retornar investimentos diversos. 

Poupança, CDB, juros simples, juros compostos. 

As condições precisam estar no banco de dados e o relatório para mostrar qual devo escolher, relacionado a investimento ou empréstimo. 

## Obrigatório
Usar typescript e com interface para executar no navegador. 
Explicar a matemática, o funcionamento e o código.

## Data 
18/06
## Detalhamento 

| ID        | Detalhes                                                                 |
|-----------|----------------------------------------------------------------------------|
|1          |Todos os trabalhos devem ter interface com o usuário via navegador.|
|2          |Todos devem ser desenvolvidos utilizando Typescript e/ou JavaScript;|
|3          |Deve ser elaborada uma apresentação explicando o conceito e a matemática envolvida.|
|4          |O código fundamental (que possui a matemática que resolve o problema) deve ser desenvolvido sem o uso de bibliotecas.|
|5          |Os sistemas de diagnóstico e de finanças devem utilizar banco de dados.|
|6          |Nos sistemas que envolvem imagem, as imagens podem ser em qualquer formato (ex. png, bmp, etc.) e devem ser injetadas pelo usuário através de GUI pelo navegador (página).|

## Funcionamento do Projeto

Caso queira testar o projeto, é necessário instalar as dependências primeiro. Será necessário instalar o arquivo `node_modules`.
Para instalar o `node_modules`, utilize o código abaixo:
```
npm i install
```
Após isso, será necessário realizar a criação do banco de dados. Para isso, criamos o arquivo `init.ts` que cria o banco automaticamente.
acesse o terminal e utilize o comando cd backend.
Para realizar a criação do Banco de dados, lembre-se de alterar as informações do arquivo `.env` que se encontra na pasta `Backend`. Após realizar as alterações, será necessário rodar o comando abaixo:
```
cd backend
npm run config
```

Agora, será necessário utilizar o comando npm run back para inciar o backend:
```
npm run back
```

Em seguida, abrir outro terminal e navegar para o frontend, após a navegação, rodar npm run dev:

```
cd frontend
npm run dev
```
