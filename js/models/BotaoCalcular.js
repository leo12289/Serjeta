import { factoryEstacoes } from "../factories/estacaoFactory.js"
import { tabela_fator_reducao } from "../data/fatorReducaoSarjeta.js"

export class BotaoCalcular {
    constructor() {
        this.carregar_DOM();
    }

    carregar_DOM() {
        this.longitude = this.tratar_input("longitude");
        this.latitude = this.tratar_input("latitude");
        this.area_bacia_contribuicao = this.tratar_input("Ab");
        this.comprimento_talvegue = this.tratar_input("Lt");
        this.desnivel_geometrico = this.tratar_input("Hg");
        this.coeficiente_runoff = this.tratar_input("runoff");
        this.periodo_retorno = this.tratar_input("Tr");
        this.declividade_longitudinal = this.tratar_input("I");
        this.declividade_transversal = this.tratar_input("s");
        this.largura_enxurrada_max = this.tratar_input("Tmax");
        this.coeficiente_manning = this.tratar_input("n");
        this.A = this.tratar_input("A");
        this.B = this.tratar_input("B");
        this.C = this.tratar_input("C");
        this.D = this.tratar_input("D");
        this.E = this.tratar_input("E");
        this.F = this.tratar_input("F");
        this.dy = this.tratar_input("dy");
    }

    tratar_input(input) {
        const temp = Number(document.getElementById(input).value.replace(",", ".").trim());
        if (isNaN(temp)) {
            return 0;
        }
        return temp;
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

    arredondar_valores(valor, casas = 2) {
            return valor.toFixed(casas);
        }

        calculo_tc() {
            this.tc = 57 * (((this.comprimento_talvegue / 1000) ** 3) / this.desnivel_geometrico) ** 0.385;
            const txt = document.getElementById('tc');
            txt.textContent = this.arredondar_valores(this.tc);
        }

        calcula_chuva() {
            const factory = new factoryEstacoes(this.latitude, this.longitude, this.tc, this.periodo_retorno);
            this.intensidade_pluviometrica = factory.obtem_chuva();
            const txt = document.getElementById('i');
            txt.textContent = this.arredondar_valores(this.intensidade_pluviometrica);
        }

        calcular_vazao_chuva() {
            return (this.coeficiente_runoff * this.intensidade_pluviometrica * (this.area_bacia_contribuicao / 10000)) / 360
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
            console.log(this.y0_max)
        }

        calcular_y2_max() {
            this.y2_max = this.B - this.E;
            console.log(this.y2_max)
        }

        calcular_x_max() {
            this.x_max = this.A + this.F - this.C;
            console.log(this.x_max)
        }

        calcular_tan_teta1() {
            this.tan_teta1 = this.x_max / (this.E - this.D);
            console.log(this.tan_teta1)
        }

        calcular_tan_teta2() {
            this.tan_teta2 = (this.F - this.x_max) / this.y0_max;
            console.log(this.tan_teta2)
        }

        calcular_Z0() {
            this.Z0 = this.tan_teta1 + this.tan_teta2;
            console.log(this.Z0)
        }

        calcular_Z2() {
            this.Z2 = 1 / (this.declividade_transversal / 100);
            console.log(this.Z2)
        }

        calcular_T_max() {
            this.T_max = this.tan_teta2 * this.y0_max + this.tan_teta1 * (this.y0_max - this.y2_max) + this.Z2 * this.y2_max;
            console.log(this.T_max)
        }

        gerarValoresY() {
            const valores = [];
            const eps = 1e-9;

            for (let y = 0; y < this.y0_max; y += this.dy) {
                valores.push(y);
            }

            // garante o último valor exatamente igual a y0_max
            if (
                valores.length === 0 ||
                Math.abs(valores[valores.length - 1] - this.y0_max) > eps
            ) {
                valores.push(this.y0_max);
            }

            return valores;
        }

        calcular_enxurradas() {
            this.tabela_capacidade_sarjeta = [];

            const valoresY = this.gerarValoresY();

            for (const yi of valoresY) {

                let yi2;

                if (yi > this.y0_max - this.y2_max) {
                    yi2 = yi - (this.y0_max - this.y2_max);
                }
                else {
                    yi2 = 0;
                }

                const K1 = 0.375 * (this.Z0 / this.coeficiente_manning) * yi ** (8 / 3);
                const K2 = 0.375 * (this.Z0 / this.coeficiente_manning) * yi2 ** (8 / 3);
                const K3 = 0.375 * (this.Z2 / this.coeficiente_manning) * yi2 ** (8 / 3);
                const Ki = K1 - K2 + K3;
                const Ti = this.tan_teta1 * yi + this.tan_teta2 * (yi - yi2) + this.Z2 * yi2;

                const row = {
                    y0: yi,
                    y1: yi2,
                    K: Ki,
                    T: Ti
                }

                if (yi === this.y0_max) {
                    this.capacidade_max = row
                }

                this.tabela_capacidade_sarjeta.push(
                    row
                );
            }
        }

        criaRowTabela(classDiv, classP, val1, val2, val3, val4) {
            const section = document.getElementById("div__Tabela__Sarjeta");
            const div = document.createElement("div");
            div.className = classDiv;
            div.id = 'div__Tabela__Sarjeta'

            const p0 = document.createElement("p");
            p0.className = classP;
            p0.textContent = val1;
            div.appendChild(p0);

            const p1 = document.createElement("p");
            p1.className = classP;
            p1.textContent = val2;
            div.appendChild(p1);

            const p2 = document.createElement("p");
            p2.className = classP;
            p2.textContent = val3;
            div.appendChild(p2);

            const p3 = document.createElement("p");
            p3.className = classP;
            p3.textContent = val4;
            div.appendChild(p3);

            section.appendChild(div);
        }

        deletaTabelaEnxurrada() {
            const pai = document.getElementById("div__Tabela__Sarjeta");
            pai?.replaceChildren();
        }

        criaTabelaEnxurrada() {
            this.deletaTabelaEnxurrada();
            this.criaRowTabela("conteudo__linha1", "txt-tab-cab", 'y', `y'`, 'K', 'T');

            for (const row of this.tabela_capacidade_sarjeta) {
                const y0 = this.arredondar_valores(row.y0 * 100, 2);
                const y1 = this.arredondar_valores(row.y1 * 100, 2);
                const K = this.arredondar_valores(row.K, 2);
                const T = this.arredondar_valores(row.T, 2);

                this.criaRowTabela("conteudo__linha1", "txt-tab", y0, y1, K, T);
            }
        }

        interpolarCapacidadeComT(parametro_procurado) {
            let inferior = null;
            let superior = null;

            for (const item of this.tabela_capacidade_sarjeta) {
                console.log('iterou')
                if (item.T < this.largura_enxurrada_max) {
                    inferior = item;
                }

                if (item.T >= this.largura_enxurrada_max) {
                    superior = item;
                    break;
                }
            }

            // validações
            if (!inferior && superior) return superior[parametro_procurado];
            console.log('cond1');
            if (inferior && !superior) return inferior[parametro_procurado];
            console.log('cond2');
            if (!inferior || !superior) return null;
            console.log('cond3');
            if (inferior.T === superior.T) {
                return inferior[parametro_procurado];
            }
            console.log('cond4');
            return inferior[parametro_procurado] + (this.largura_enxurrada_max - inferior.T) * (superior[parametro_procurado] - inferior[parametro_procurado]) / (superior.T - inferior.T);
        }

        verificacaoVazaoCapacidade() {
            this.fator_reducao = this.calcular_fator_reducao();

            if (this.capacidade_max.T <= this.largura_enxurrada_max) {
                this.capacidade = this.capacidade_max;
                const vazaoTeorica = this.capacidade_max.K * (this.declividade_longitudinal / 100) ** (1 / 2);
                this.capacidade.Qt = vazaoTeorica;
                this.capacidade.Qc = vazaoTeorica * this.fator_reducao;
                this.capacidade.Qi = this.calcular_vazao_chuva();
            }

            else {
                this.capacidade = {};
                this.capacidade.y0 = this.interpolarCapacidadeComT('y0');
                this.capacidade.y1 = this.interpolarCapacidadeComT('y1');
                this.capacidade.K = this.interpolarCapacidadeComT('K');
                this.capacidade.T = this.largura_enxurrada_max;
                const vazaoTeorica = this.capacidade.K * (this.declividade_longitudinal / 100) ** (1 / 2);
                this.capacidade.Qt = vazaoTeorica;
                this.capacidade.Qc = vazaoTeorica * this.fator_reducao;
                this.capacidade.Qi = this.calcular_vazao_chuva();
            }

            console.log(this.capacidade);
        }
    }
