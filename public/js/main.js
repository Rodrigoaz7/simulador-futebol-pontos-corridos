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
    times.forEach(time => {
        let linha = $('<tr>').addClass('bar');
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
    console.log(rodada)
    rodada.partidas.forEach(partida => {
        let li = $('<li>').addClass('list-group-item').css("display", "inline-flex");

        let spanCasa = $('<span>').addClass('navbar-brand mb-0 h').css({"width": "45%", "text-align": "right"});
        let spanCasaTime = $('<div>').text(partida.time_casa);
        let spanCasaInput = $('<div>');
        let inputCasa = $('<input>').attr('type','number').addClass('form-control inputPlacar');
        spanCasaInput.append(inputCasa);
        spanCasa.append(spanCasaTime);
        spanCasa.append(spanCasaInput);
        li.append(spanCasa);

        let spanX = $('<span>').addClass('navbar-brand mb-0 h').text("x");
        li.append(spanX);

        let spanVisitante = $('<span>').addClass('navbar-brand mb-0 h').css({"width": "45%", "text-align": "left"});
        let spanVisitanteTime = $('<div>').text(partida.time_visitante);
        let spanVisitanteInput = $('<div>');
        let inputVisitante = $('<input>').attr('type','number').addClass('form-control inputPlacar');
        spanVisitanteInput.append(inputVisitante);
        spanVisitante.append(spanVisitanteTime);
        spanVisitante.append(spanVisitanteInput);
        li.append(spanVisitante);

        $('#listaRodadas').append(li);
    });
}