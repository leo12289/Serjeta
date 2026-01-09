import { factoryEstacoes } from "../factories/estacaoFactory.js"
import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

export class BotaoCalcular {
    constructor() {
        this.carregar_DOM();
    }

    carregar_DOM() {
        this.longitude = document.getElementById("longitude");
        this.latitude = document.getElementById("latitude");
        this.area_bacia_contribuicao = document.getElementById("Ab");
        this.comprimento_talvegue = document.getElementById("Lt");
        this.desnivel_geometrico = document.getElementById("Hg");
        this.coeficiente_runoff = document.getElementById("runoff");
        this.periodo_retorno = document.getElementById("Tr");
        this.declividade_longitudinal = document.getElementById("I");
        this.declividade_transversal = document.getElementById("s");
        this.largura_enxurrada_max = document.getElementById("Tmax");
        this.coeficiente_manning = document.getElementById("n");
        this.A = document.getElementById("A");
        this.B = document.getElementById("B");
        this.C = document.getElementById("C");
        this.D = document.getElementById("D");
        this.E = document.getElementById("E");
        this.F = document.getElementById("F");
    }

    validar(valor) {
        return typeof valor === 'number' && Number.isFinite(valor) && valor != 0;
    }

    verificacaoCampos() {
        return validar(this.longitude) &&
            validar(this.latitude) &&
            validar(this.area_bacia_contribuicao) &&
            validar(this.comprimento_talvegue) &&
            validar(this.desnivel_geometrico) &&
            validar(this.coeficiente_runoff) &&
            validar(this.periodo_retorno) &&
            validar(this.declividade_longitudinal) &&
            validar(this.declividade_transversal) &&
            validar(this.largura_enxurrada_max) &&
            validar(this.coeficiente_manning) &&
            validar(this.A) &&
            validar(this.B) &&
            validar(this.C) &&
            validar(this.D) &&
            validar(this.E) &&
            validar(this.F)
    }

    converter_geometria_sarjeta() {
        this.A = this.A / 100;
        this.B = this.B / 100;
        this.C = this.C / 100;
        this.D = this.D / 100;
        this.E = this.E / 100;
        this.F = this.F / 100;
    }

    calculo_tc() {
        this.tc = 57 * ((this.comprimento_talvegue / 1000) ** 30) / this.desnivel_geometrico;
    }

    calcula_chuva() {
        this.intensidade_pluviometrica = new factoryEstacoes(this.latitude, this.longitude, this.tc, this.periodo_retorno)
    }

    calcular_vazao_chuva() {
        this.vazao_chuva = (this.coeficiente_runoff * this.intensidade_pluviometrica * (this.area_bacia_contribuicao / 10000)) / 360
    }

    calcular_fator_reducao() {
        let inferior = null;
        let superior = null;

        for (const item of tabela_fator_reducao) {
            if (item.declividade <= this.declividade_longitudinal) {
                inferior = item;
            }

            if (item.declividade >= this.declividade_longitudinal) {
                superior = item;
                break;
            }
        }

        // validações
        if (!inferior && superior) return superior.fator_reducao;
        if (inferior && !superior) return inferior.fator_reducao;
        if (!inferior || !superior) return null;

        if (inferior.declividade === superior.declividade) {
            return inferior.fator_reducao;
        }

        return inferior.fator_reducao + (this.declividade_longitudinal - inferior.declividade) * (superior.fator_reducao - inferior.fator_reducao) / (superior.declividade - inferior.declividade);
    }

    calcular_y0_max() {
        this.y0_max = this.B - this.D;
    }

    calcular_y2_max() {
        this.y2_max = this.B - this.E;
    }

    calcular_x_max() {
        this.x_max = this.A + this.F - this.C;
    }

    calcular_tan_teta1() {
        this.tan_teta1 = this.x_max / (this.E - this.D);
    }

    calcular_tan_teta2() {
        this.tan_teta2 = (this.F - this.x_max) / this.y0_max;
    }

    calcular_Z0() {
        this.Z0 = this.tan_teta1 + this.tan_teta2;
    }

    calcular_Z2() {
        1 / (this.declividade_transversal / 100);
    }

    calcular_T_max() {
        this.tan_teta2 * this.y0_max + this.tan_teta1 * (this.y0_max - this.y2_max) + this.tan_teta2 * this.y2_max;
    }

    calcular_enxurradas() {

    }

}


/* 
tabela_fator_reducao[i].declividade

function interpolarFatReducao(declividade, p0, p1) {
    return p0.fator_reducao + (declividade - p0.declividade) * (p1.fator_reducao - p0.fator_reducao) / (p1.declividade - p0.declividade);
}
*/