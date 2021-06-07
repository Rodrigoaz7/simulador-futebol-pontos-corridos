function atualizarLinksNavegacao(){
    const rodadaAtual = localStorage.getItem("rodadaAtual");
    const quantRodadas = JSON.parse(localStorage.getItem("rodadas")).length;
    $('#textoRodada').text("Rodada " + rodadaAtual);
    console.log(quantRodadas);
    if(rodadaAtual == 1) {
        $('#linkVoltar').empty();
    }

    if(rodadaAtual == quantRodadas) {
        $('#linkAvancar').empty();
    }

    if(rodadaAtual > 1) {
        $('#linkVoltar').html('<a href="#" onclick="voltarRodada();" style="font-weight: bold; font-size: 120%;"><</a>');
    }

    if(rodadaAtual < quantRodadas) {
        $('#linkAvancar').html('<a href="#" onclick="passarRodada();" style="font-weight: bold; font-size: 120%;">></a>');
    }
}

function passarRodada () {
    let rodadaAtual = localStorage.getItem("rodadaAtual");
    rodadaAtual++;
    localStorage.setItem("rodadaAtual", rodadaAtual);
    atualizarLinksNavegacao();
    atualizarRodada();
}

function voltarRodada () {
    let rodadaAtual = localStorage.getItem("rodadaAtual");
    rodadaAtual--;
    localStorage.setItem("rodadaAtual", rodadaAtual);
    atualizarLinksNavegacao();
    atualizarRodada();
}

function atualizarTabela() {
    const times = JSON.parse(localStorage.getItem("times"));
    const divisaoClassificatoria = JSON.parse(localStorage.getItem("campeonato")).divisao_classificatoria;

    $('#tbodyTabelaClassificacao').empty();
    times.forEach((time, index) => {
        let linha = $('<tr>').addClass('bar');
        let cssCol0 = {"font-weight": "bold", "font-size": "110%"}

        for(let i = 1; i <= divisaoClassificatoria.length; i++) {
            let range = divisaoClassificatoria[i-1].split("-");
            if(index+1 >= range[0] && index+1 <= range[1]) {
                cssCol0["color"] = range[2];
                break;
            }
        }

        let col0 = $('<td>').text(index+1).css(cssCol0);
        let col1 = $('<td>').text(time.nome);
        let col2 = $('<td>').text(time.pontuacao);
        let col3 = $('<td>').text(time.n_jogos);
        let col4 = $('<td>').text(time.n_vitorias);
        let col5 = $('<td>').text(time.n_empates);
        let col6 = $('<td>').text(time.n_derrotas);
        let col7 = $('<td>').text(time.gols_pro);
        let col8 = $('<td>').text(time.gols_contra);
        let col9 = $('<td>').text(time.saldo_gols);
        let col10 = $('<td>').text(time.aproveitamento);
        linha.append(col0);
        linha.append(col1);
        linha.append(col2);
        linha.append(col3);
        linha.append(col4);
        linha.append(col5);
        linha.append(col6);
        linha.append(col7);
        linha.append(col8);
        linha.append(col9);
        linha.append(col10);
        $('#tbodyTabelaClassificacao').append(linha);
    });
}

function atualizarRodada() {
    const rodadaAtual = JSON.parse(localStorage.getItem("rodadaAtual"));
    const campeonato = JSON.parse(localStorage.getItem("campeonato"));
    const rodada = JSON.parse(localStorage.getItem("rodadas"))[rodadaAtual-1];
    $('#listaRodadas').empty();

    rodada.partidas.forEach((partida, index) => {
        let li = $('<li>').addClass('list-group-item').css("display", "flex");

        let spanCasa = $('<span>').addClass('placarMandante').css({"width": "45%", "text-align": "right"});
        let spanCasaTime = $('<div>').text(partida.time_casa).addClass("placarMandante").css({"margin-right": "10%"});
        let spanCasaInput = $('<div>').css({"float": "right"});

        let pathTimeCasa = campeonato.campeonato_de_selecoes ? ("selecoes/" + partida.time_casa) : ("clubes/" + partida.time_casa);
        let imgIcone = $('<img>').attr({"src": pathTimeCasa.normalize('NFD').replace(/[\u0300-\u036f]/g, "") + ".svg"}).addClass("iconeClube").css({"margin-left": "10%"});
        let inputCasa = $('<input>')
            .attr({"type": "number", "min": 0, "max": 99, "id": index+1 + "_casa", 
                "name": partida.time_casa + "_" + partida.time_visitante,
                "title": partida.realizado ? 'Partida já Realizada' : '',  
                "onchange": "atualizarPartida(event);", "value": partida.gols_time_casa})
            .addClass(partida.realizado ? 'form-control inputPlacar partidaJaJogada' : 'form-control inputPlacar');

        spanCasaTime.append(imgIcone);
        spanCasaInput.append(inputCasa);
        spanCasa.append(spanCasaTime);
        spanCasa.append(spanCasaInput);
        li.append(spanCasa);

        let spanX = $('<span>').addClass('placarX').text("x");
        li.append(spanX);

        let spanVisitante = $('<span>').addClass('placarVisitante').css({"width": "45%", "text-align": "left"});
        let spanVisitanteTime = $('<div>').text(partida.time_visitante).addClass("placarVisitante").css({"margin-left": "10%"});
        let spanVisitanteInput = $('<div>').css({"float": "left"});

        let pathTimeVisitante = campeonato.campeonato_de_selecoes ? ("selecoes/" + partida.time_visitante) : ("clubes/" + partida.time_visitante);
        let imgIconeVisitante = $('<img>').attr({"src": pathTimeVisitante.normalize('NFD').replace(/[\u0300-\u036f]/g, "") + ".svg"}).addClass("iconeClube").css({"margin-left": "10%"});
        let inputVisitante = $('<input>')
            .attr({"type": "number", "min": 0, "max": 99, "id": index+1 + "_visitante", 
                "name": partida.time_casa + "_" + partida.time_visitante, 
                "title": partida.realizado ? 'Partida já Realizada' : '',  
                "onchange": "atualizarPartida(event);", "value": partida.gols_time_visitante})
                .addClass(partida.realizado ? 'form-control inputPlacar partidaJaJogada' : 'form-control inputPlacar');
        
        spanVisitante.append(imgIconeVisitante);
        spanVisitante.append(inputVisitante);
        spanVisitante.append(spanVisitanteInput);
        spanVisitante.append(imgIconeVisitante);
        spanVisitante.append(spanVisitanteTime);
        li.append(spanVisitante);

        $('#listaRodadas').append(li);
    });
}

function atualizarPartida(event) {
    console.log("disparei evento de mudança")
    const rodadaAtual = localStorage.getItem("rodadaAtual");
    let rodadas = JSON.parse(localStorage.getItem("rodadas"));
    const id = event.target.id.split("_")[0];
    const mandante = event.target.id.split("_")[1];
    const nomeTimes = event.target.name.split("_");

    var partidaAtual = rodadas[rodadaAtual-1].partidas[id-1];

    // Caso a partida já tenha sido preenchida anteriormente, os dados dela terão de ser removidos
    if(partidaAtual.gols_time_visitante != null && partidaAtual.gols_time_casa != null) {
        let times = JSON.parse(localStorage.getItem("times"));
        let equipeMandante = times.filter(el => {
            return el.nome == nomeTimes[0]
        })[0];
        let equipeVisitante = times.filter(el => {
            return el.nome == nomeTimes[1]
        })[0];

        equipeMandante.gols_pro -= partidaAtual.gols_time_casa;
        equipeMandante.gols_contra -= partidaAtual.gols_time_visitante;
        equipeMandante.saldo_gols -= (partidaAtual.gols_time_casa - partidaAtual.gols_time_visitante);
        equipeVisitante.gols_pro -= partidaAtual.gols_time_visitante;
        equipeVisitante.gols_contra -= partidaAtual.gols_time_casa;
        equipeVisitante.saldo_gols -= (partidaAtual.gols_time_visitante - partidaAtual.gols_time_casa);

        if(partidaAtual.gols_time_casa > partidaAtual.gols_time_visitante) {
            equipeMandante.n_vitorias -= 1;
            equipeMandante.n_jogos -= 1;
            equipeMandante.pontuacao -= 3;
            equipeVisitante.n_jogos -= 1;
            equipeVisitante.n_derrotas -= 1;
        }

        if(partidaAtual.gols_time_casa < partidaAtual.gols_time_visitante) {
            equipeVisitante.n_vitorias -= 1;
            equipeVisitante.n_jogos -= 1;
            equipeVisitante.pontuacao -= 3;
            equipeMandante.n_jogos -= 1;
            equipeMandante.n_derrotas -= 1;
        }

        if(partidaAtual.gols_time_casa == partidaAtual.gols_time_visitante) {
            equipeVisitante.n_empates -= 1;
            equipeVisitante.n_jogos -= 1;
            equipeVisitante.pontuacao -= 1;
            equipeMandante.n_empates -= 1;
            equipeMandante.n_jogos -= 1;
            equipeMandante.pontuacao -= 1;
        }

        localStorage.setItem("times", JSON.stringify(times));
    }

    if(mandante == "casa") {
        rodadas[rodadaAtual-1].partidas[id-1].gols_time_casa = event.target.value; 
    }

    if(mandante == "visitante") {
        rodadas[rodadaAtual-1].partidas[id-1].gols_time_visitante = event.target.value; 
    }
    
    localStorage.setItem("rodadas", JSON.stringify(rodadas));
    partidaAtual = rodadas[rodadaAtual-1].partidas[id-1];

    if(partidaAtual.gols_time_visitante != null && partidaAtual.gols_time_casa != null) {
        let times = JSON.parse(localStorage.getItem("times"));
        
        let timeMandante = times.filter(el => {
            return el.nome == nomeTimes[0]
        })[0];

        timeMandante.n_jogos += 1;
        timeMandante.gols_pro += parseInt(partidaAtual.gols_time_casa);
        timeMandante.gols_contra += parseInt(partidaAtual.gols_time_visitante);
        timeMandante.saldo_gols += (partidaAtual.gols_time_casa - partidaAtual.gols_time_visitante);

        if(partidaAtual.gols_time_casa > partidaAtual.gols_time_visitante) {
            timeMandante.pontuacao += 3;
            timeMandante.n_vitorias += 1;
        }

        if(partidaAtual.gols_time_casa < partidaAtual.gols_time_visitante) {
            timeMandante.n_derrotas += 1;
        }

        if(partidaAtual.gols_time_casa == partidaAtual.gols_time_visitante) {
            timeMandante.pontuacao += 1;
            timeMandante.n_empates += 1;
        }

        const aproveitamentoMandante = timeMandante.pontuacao > 0 ? (timeMandante.pontuacao / (timeMandante.n_jogos * 3.0)) * 100.0 : 0;
        timeMandante.aproveitamento = aproveitamentoMandante.toFixed(2);

        let timeVisitante = times.filter(el => {
            return el.nome == nomeTimes[1]
        })[0];

        timeVisitante.n_jogos += 1;
        timeVisitante.gols_pro += parseInt(partidaAtual.gols_time_visitante);
        timeVisitante.gols_contra += parseInt(partidaAtual.gols_time_casa);
        timeVisitante.saldo_gols += (partidaAtual.gols_time_visitante - partidaAtual.gols_time_casa);

        if(partidaAtual.gols_time_visitante > partidaAtual.gols_time_casa) {
            timeVisitante.pontuacao += 3;
            timeVisitante.n_vitorias += 1;
        }

        if(partidaAtual.gols_time_visitante < partidaAtual.gols_time_casa) {
            timeVisitante.n_derrotas += 1;
        }

        if(partidaAtual.gols_time_visitante == partidaAtual.gols_time_casa) {
            timeVisitante.pontuacao += 1;
            timeVisitante.n_empates += 1;
        }

        const aproveitamentoVisitante = timeVisitante.pontuacao > 0 ? (timeVisitante.pontuacao / (timeVisitante.n_jogos * 3.0)) * 100.0 : 0;
        timeVisitante.aproveitamento = aproveitamentoVisitante.toFixed(2);

        times.sort(function (a, b) {
            return b.pontuacao - a.pontuacao || b.n_vitorias - a.n_vitorias || b.saldo_gols - a.saldo_gols || b.gols_pro - a.gols_pro;
        });
        
        localStorage.setItem("times", JSON.stringify(times));
        atualizarTabela();
    }
}