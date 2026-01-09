import { factoryEstacoes } from "../factories/estacaoFactory.js"
import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

export class BotaoCalcular {
    constructor() {
        this.carregar_DOM();
    }

    carregar_DOM() {
        this.longitude = parseFloat(document.getElementById("longitude").value);
        this.latitude = parseFloat(document.getElementById("latitude").value);
        this.area_bacia_contribuicao = parseFloat(document.getElementById("Ab").value);
        this.comprimento_talvegue = parseFloat(document.getElementById("Lt").value);
        this.desnivel_geometrico = parseFloat(document.getElementById("Hg").value);
        this.coeficiente_runoff = parseFloat(document.getElementById("runoff").value);
        this.periodo_retorno = parseFloat(document.getElementById("Tr").value);
        this.declividade_longitudinal = parseFloat(document.getElementById("I").value);
        this.declividade_transversal = parseFloat(document.getElementById("s").value);
        this.largura_enxurrada_max = parseFloat(document.getElementById("Tmax").value);
        this.coeficiente_manning = parseFloat(document.getElementById("n").value);
        this.A = parseFloat(document.getElementById("A").value);
        this.B = parseFloat(document.getElementById("B").value);
        this.C = parseFloat(document.getElementById("C").value);
        this.D = parseFloat(document.getElementById("D").value);
        this.E = parseFloat(document.getElementById("E").value);
        this.F = parseFloat(document.getElementById("F").value);
        this.dy = parseFloat(document.getElementById("dy").value);
    }

    validar(valor) {
        return typeof valor === 'number' && Number.isFinite(valor) && valor != 0;
    }

    verificacaoCampos() {
        return this.validar(this.longitude) &&
            this.validar(this.latitude) &&
            this.validar(this.area_bacia_contribuicao) &&
            this.validar(this.comprimento_talvegue) &&
            this.validar(this.desnivel_geometrico) &&
            this.validar(this.coeficiente_runoff) &&
            this.validar(this.periodo_retorno) &&
            this.validar(this.declividade_longitudinal) &&
            this.validar(this.declividade_transversal) &&
            this.validar(this.largura_enxurrada_max) &&
            this.validar(this.coeficiente_manning) &&
            this.validar(this.A) &&
            this.validar(this.B) &&
            this.validar(this.C) &&
            this.validar(this.D) &&
            this.validar(this.E) &&
            this.validar(this.F) &&
            this.validar(this.dy)
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
        console.log('tc calculada');
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

    calcular_geometrias_sarjeta() {
        this.calcular_y0_max();
        this.calcular_y2_max();
        this.calcular_x_max();
        this.calcular_tan_teta1();
        this.calcular_tan_teta2();
        this.calcular_Z0();
        this.calcular_Z2();
        this.calcular_T_max();
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
        this.Z2 = 1 / (this.declividade_transversal / 100);
    }

    calcular_T_max() {
        this.T_max = this.tan_teta2 * this.y0_max + this.tan_teta1 * (this.y0_max - this.y2_max) + this.tan_teta2 * this.y2_max;
    }
    
    verificacaoEnxurradaMax() {
        return this.T_max <= this.largura_enxurrada_max;
    }
    
    calcular_enxurradas() {
        this.tabela_capacidade_sarjeta = [];

        for (let dy = 0.00; dy <= this.y0_max; dy += this.dy) {
            const yi = dy;

            if (yi > this.y0_max - this.y2_max) {
                const yi2 = yi - (this.y0_max - this.y2_max);
            }
            else{
                const yi2 = 0;
            }

            const K1 = 0.375 * (this.Z0 / this.coeficiente_manning) * yi;
            const K2 = 0.375 * (this.Z0 / this.coeficiente_manning) * yi2;
            const K3 = 0.375 * (this.Z2 / this.coeficiente_manning) * yi2;
            const Ki = K1 - K2 + K3;
            const Ti = this.tan_teta1 * yi + this.tan_teta2 * (yi - yi2) + this.Z2 * yi2;

            this.tabela_capacidade_sarjeta.push(
                {
                    y0: yi,
                    y1: yi2,
                    K: Ki,
                    T: Ti
                }
            );
        }
    }

    criaTabelaEnxurrada(){
        for (const row of this.tabela_capacidade_sarjeta) {

            const container = document.getElementById("tabela-enxurrada");

            const p0 = document.createElement("p");
            p.className = "txt3";
            p.textContent = row.y0;
            container.appendChild(p0);
            
            const p1 = document.createElement("p");
            p.className = "txt3";
            p.textContent = row.y1;
            container.appendChild(p1);

            const p2 = document.createElement("p");
            p.className = "txt3";
            p.textContent = row.K;
            container.appendChild(p2);

            const p3 = document.createElement("p");
            p.className = "txt3";
            p.textContent = row.T;
            container.appendChild(p3);
        }
    }
}

/* 
            <div class="conteudo__linha1">
                <p class="txt3-var">Coeficiente de rugosidade:</p>
                <p class="txt3">0.016</p>
                <p class="txt3">[-]</p>
            </div>
*/
