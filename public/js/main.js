function atualizarLinksNavegacao(){
    const rodadaAtual = localStorage.getItem("rodadaAtual");
    $('#textoRodada').text("Rodada " + rodadaAtual);

    if(rodadaAtual == 1) {
        $('#linkVoltar').empty();
    }

    if(rodadaAtual == 38) {
        $('#linkAvancar').empty();
    }

    if(rodadaAtual > 1) {
        $('#linkVoltar').html('<a href="#" onclick="voltarRodada();"><</a>');
    }

    if(rodadaAtual < 38) {
        $('#linkAvancar').html('<a href="#" onclick="passarRodada();">></a>');
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
    $('#tbodyTabelaClassificacao').empty();
    times.forEach((time, index) => {
        let linha = $('<tr>').addClass('bar');

        let cssCol0 = {"font-weight": "bold", "font-size": "110%"}
        if(index < 4) cssCol0["color"] = "blue";
        if(index == 4 || index == 5) cssCol0["color"] = "green";
        if(index > 5 && index < 12) cssCol0["color"] = "#FF6600";
        if(index > 15) cssCol0["color"] = "red";
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
    const rodada = JSON.parse(localStorage.getItem("rodadas"))[rodadaAtual-1];
    $('#listaRodadas').empty();

    rodada.partidas.forEach((partida, index) => {
        let li = $('<li>').addClass('list-group-item').css("display", "inline-flex");

        let spanCasa = $('<span>').addClass('navbar-brand mb-0 h').css({"width": "45%", "text-align": "right"});
        let spanCasaTime = $('<div>').text(partida.time_casa);
        let spanCasaInput = $('<div>');

        let inputCasa = $('<input>')
            .attr({"type": "number", "min": 0, "max": 99, "id": index+1 + "_casa", 
                "name": partida.time_casa + "_" + partida.time_visitante, 
                "onchange": "atualizarPartida(event);", "value": partida.gols_time_casa})
            .addClass('form-control inputPlacar');
            
        spanCasaInput.append(inputCasa);
        spanCasa.append(spanCasaTime);
        spanCasa.append(spanCasaInput);
        li.append(spanCasa);

        let spanX = $('<span>').addClass('navbar-brand mb-0 h').text("x");
        li.append(spanX);

        let spanVisitante = $('<span>').addClass('navbar-brand mb-0 h').css({"width": "45%", "text-align": "left"});
        let spanVisitanteTime = $('<div>').text(partida.time_visitante);
        let spanVisitanteInput = $('<div>');

        let inputVisitante = $('<input>')
            .attr({"type": "number", "min": 0, "max": 99, "id": index+1 + "_visitante", 
                "name": partida.time_casa + "_" + partida.time_visitante, 
                "onchange": "atualizarPartida(event);", "value": partida.gols_time_visitante})
            .addClass('form-control inputPlacar');
        
        spanVisitanteInput.append(inputVisitante);
        spanVisitante.append(spanVisitanteTime);
        spanVisitante.append(spanVisitanteInput);
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

    if(mandante == "casa") {
        rodadas[rodadaAtual-1].partidas[id-1].gols_time_casa = event.target.value; 
    }

    if(mandante == "visitante") {
        rodadas[rodadaAtual-1].partidas[id-1].gols_time_visitante = event.target.value; 
    }
    
    localStorage.setItem("rodadas", JSON.stringify(rodadas));
    const partidaAtual = rodadas[rodadaAtual-1].partidas[id-1];

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

        localStorage.setItem("times", JSON.stringify(times));
        atualizarTabela();
    }
}