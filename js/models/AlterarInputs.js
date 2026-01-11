import { BotaoCalcular } from "./BotaoCalcular.js";

export class AlterarInputs {
    preencher() {
        this.longitude = this.tratar_input("longitude", 49.13);
        this.latitude = this.tratar_input("latitude", 21.67);
        this.area_bacia_contribuicao = this.tratar_input("Ab", 1585.18);
        this.comprimento_talvegue = this.tratar_input("Lt", 274.59);
        this.desnivel_geometrico = this.tratar_input("Hg", 2.95);
        this.coeficiente_runoff = this.tratar_input("runoff", 0.70);
        this.periodo_retorno = this.tratar_input("Tr", 2);
        this.declividade_longitudinal = this.tratar_input("I", 0.60);
        this.declividade_transversal = this.tratar_input("s", 2.0);
        this.largura_enxurrada_max = this.tratar_input("Tmax", 4.5);
        this.coeficiente_manning = this.tratar_input("n", 0.016);
        this.A = this.tratar_input("A", 10);
        this.B = this.tratar_input("B", 25);
        this.C = this.tratar_input("C", 12);
        this.D = this.tratar_input("D", 11);
        this.E = this.tratar_input("E", 15);
        this.F = this.tratar_input("F", 42);
        this.dy = this.tratar_input("dy", 0.05);
    }

    apagar() {
        this.longitude = this.tratar_input("longitude", "");
        this.latitude = this.tratar_input("latitude", "");
        this.area_bacia_contribuicao = this.tratar_input("Ab", "");
        this.comprimento_talvegue = this.tratar_input("Lt", "");
        this.desnivel_geometrico = this.tratar_input("Hg", "");
        this.coeficiente_runoff = this.tratar_input("runoff", "");
        this.periodo_retorno = this.tratar_input("Tr", "");
        this.declividade_longitudinal = this.tratar_input("I", "");
        this.declividade_transversal = this.tratar_input("s", "");
        this.largura_enxurrada_max = this.tratar_input("Tmax", "");
        this.coeficiente_manning = this.tratar_input("n", "");
        this.A = this.tratar_input("A", "");
        this.B = this.tratar_input("B", "");
        this.C = this.tratar_input("C", "");
        this.D = this.tratar_input("D", "");
        this.E = this.tratar_input("E", "");
        this.F = this.tratar_input("F", "");
        this.dy = this.tratar_input("dy", "");

        const ApagarTabela = new BotaoCalcular();
        ApagarTabela.deletaSeletorPorId("div__Tabela__Sarjeta");
        ApagarTabela.deletaSeletorPorId("capacidade_escoamento");
        ApagarTabela.deletaSeletorPorId("conclusao");
    }

    tratar_input(input, value) {
        const temp = document.getElementById(input);
        temp.value = value;
    }

}