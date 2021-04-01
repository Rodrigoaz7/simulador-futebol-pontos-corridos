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
}

function voltarRodada () {
    let rodadaAtual = localStorage.getItem("rodadaAtual");
    rodadaAtual--;
    localStorage.setItem("rodadaAtual", rodadaAtual);
    atualizarLinksNavegacao();
}