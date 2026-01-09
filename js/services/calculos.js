//import { estacoes } from "../data/estacoes.js";
//import { Estacao } from "../models/Estacao.js";

// import { factoryEstacoes } from "../factories/estacaoFactory.js"
// import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

import { BotaoCalcular } from "../models/BotaoCalcular.js";

const botao_calcular = document.getElementById("Calcular");
botao_calcular.addEventListener("click", () => {
    const botao = new BotaoCalcular();
    botao.carregar_DOM();

    if (botao.verificacaoCampos()) {
        botao.converter_geometria_sarjeta();
        botao.calculo_tc();
        botao.calcula_chuva();
        botao.calcular_vazao_chuva();
        botao.calcular_fator_reducao();
        botao.calcular_geometrias_sarjeta();

        if (botao.verificacaoEnxurradaMax()) {
            botao.calcular_enxurradas();
            botao.criaTabelaEnxurrada();
        }
    }
    else{
        console.log("else da verificacao");
    }
});
