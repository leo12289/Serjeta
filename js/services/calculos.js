//import { estacoes } from "../data/estacoes.js";
//import { Estacao } from "../models/Estacao.js";

// import { factoryEstacoes } from "../factories/estacaoFactory.js"
// import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

function ehNumeroNaoNegativo(valor) {
    return typeof valor === 'number' &&
        Number.isFinite(valor) &&
        valor != 0;
}

const longitude = document.getElementById("longitude");
const latitude = document.getElementById("latitude");
const area_bacia_contribuicao = document.getElementById("Ab");
const comprimento_talvegue = document.getElementById("Lt");
const desnivel_geometrico = document.getElementById("Hg");
const coeficiente_runoff = document.getElementById("runoff");
const periodo_retorno = document.getElementById("Tr");
const declividade_longitudinal = document.getElementById("I");
const declividade_transversal = document.getElementById("s");
const largura_enxurrada_max = document.getElementById("Tmax");
const coeficiente_manning = document.getElementById("n");
const A = document.getElementById("A");
const B = document.getElementById("B");
const C = document.getElementById("C");
const D = document.getElementById("D");
const E = document.getElementById("E");
const F = document.getElementById("F");

const msg_erro = 'Algum campo ficou sem preenchimento, favor preencher TODOS os campos e tentar novamente';

console.log("JS carregou");

if (ehNumeroNaoNegativo(comprimento_talvegue) && comprimento_talvegue(desnivel_geometrico)) {
    comprimento_talvegue = 50;
    desnivel_geometrico = 2;
    const tc = 57 * ((comprimento_talvegue / 1000) ** 30) / desnivel_geometrico;
    const tc_p = document.getElementById("tc");
    tc_p.textContent = $`{tc.toFixed(2)}`;
}
else {
    console.log(msg_erro);
}



