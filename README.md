# Simulador de Futebol de Pontos Corridos

O projeto tem por objetivo oferecer um simulador de um campeonato de pontos corridos. Atualmente, existem dois campeonatos implementados para simulação, o [Campeonato Brasileiro Série A 2021](http://simuladorfutebolpontoscorridos-env.eba-y7azpjgm.us-east-2.elasticbeanstalk.com/brasileirao-serie-a-2021) e o [Campeonato Brasileiro Série B 2021](http://simuladorfutebolpontoscorridos-env.eba-y7azpjgm.us-east-2.elasticbeanstalk.com/brasileirao-serie-b-2021).

Inicialmente, apenas o campeonato brasileiro série A 2021 está disponível, mas uma generalização para outros campeonatos é possível.

## Funcionamento
A ideia inicial do projeto é de utilizar um algoritmo de web scraping apenas para buscar as rodadas com todas as partidas em ordem correta. 

Os dados das partidas já realizadas são armazenas em um banco de dados MongoDB, sendo requisitadas apenas no momento em que o usuário entra na tela. Após a requisição dos dados for realizada e a tela carregada, toda a simulação é realizada apenas no navegador do cliente, utilizando de scripts javascript e localStorage para armazenar dados.

## Instalação

Para realizar a instalação do projeto é necessário ter instalado o Node e o npm. Após isso, basta rodar o seguinte comando na raiz do proejto.

```bash
npm install
```

## Uso

Para iniciar o projeto é necessário primeiramente, realizar um processo de carga no banco de dados com os dados dos times e das partidas. O comando para o cadastro dos dados do campeonato brasileiro 2021 série A é mostrado abaixo.

```bash
node ./cargaBrasileiro2021A.js
```

Após isso, basta rodar o projeto com:

```bash
npm start
```
