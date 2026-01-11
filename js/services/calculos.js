//import { estacoes } from "../data/estacoes.js";
//import { Estacao } from "../models/Estacao.js";

// import { factoryEstacoes } from "../factories/estacaoFactory.js"
// import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

import { BotaoCalcular } from "../models/BotaoCalcular.js";
import { AlterarInputs } from "../models/AlterarInputs.js";

const botao_calcular = document.getElementById("Calcular");
const botao_preencher = document.getElementById("Preenche");
const botao_resetar = document.getElementById("Resetar");

botao_calcular.addEventListener("click", () => {
    const botao = new BotaoCalcular();
    botao.carregar_DOM();

    if (botao.verificacaoCampos()) {
        botao.converter_geometria_sarjeta();
        botao.calculo_tc();
        botao.calcula_chuva();
        botao.calcular_vazao_chuva();
        botao.calcular_geometrias_sarjeta();
        botao.calcular_enxurradas();
        botao.criaTabelaEnxurrada();
        botao.verificacaoVazaoCapacidade();
        botao.criar_section_cap_escoamento();
        botao.criar_section_conclusao();
    }
    else {
        alert("Desculpe, mas tem algum problema nos valores preenchdos. Insira valores numéricos e preencha todos os campos!");
    }
});

botao_resetar.addEventListener("click", () => {
    const botao = new AlterarInputs();
    botao.apagar();
});

botao_preencher.addEventListener("click", () => {
    const botao = new AlterarInputs();
    botao.preencher();
});
