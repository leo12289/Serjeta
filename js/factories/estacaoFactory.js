import { tabela_estacoes_pluviometricas_sp } from "../data/estacoesSP.js"
import { EstacaoTipoA } from "../models/EstacaoTipoA.js"
import { EstacaoTipoB } from "../models/EstacaoTipoB.js"
import { EstacaoTipoC } from "../models/EstacaoTipoC.js"

export class factoryEstacoes {
    constructor(latitude, longitude, tc, T) {
        this.estacoes = tabela_estacoes_pluviometricas_sp;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tc = tc;
        this.T = T;

        this.conversor_graus_radianos();
        this.estacao_mais_proxima();
    }

    conversor_graus_radianos() {
        this.latitude = this.latitude * Math.PI / 180;
        this.longitude = this.longitude * Math.PI / 180;
    }

    conversor_GMS_radianos(coordenada) {
        coordenada = coordenada.trim();
        const regex = /(\d+)[°º]\s*(\d+)'\s*(\d+(?:\.\d+)?)"/;
        const match = coordenada.match(regex);

        const graus = Number(match[1]);
        const minutos = Number(match[2]);
        const segundos = Number(match[3]);

        const graus_decimal = - (graus + (minutos / 60) + (segundos / 3600));

        return graus_decimal * Math.PI / 180;
    }

    calculo_distancia_coordendas(p1, p2) {
        const x1 = p1[0];
        const y1 = p1[1];
        const x2 = p2[0];
        const y2 = p2[1];

        const cosValue = Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x1 - x2);

        return 6371 * Math.acos(Math.min(1, Math.max(-1, cosValue)));
    }

    estacao_mais_proxima() {
        const p1 = [this.longitude, this.latitude];
        let menor = Infinity;

        for (let i = 0; i < this.estacoes.length; i++) {
            const estacao = this.estacoes[i];

            const x2 = this.conversor_GMS_radianos(estacao.longitude);
            const y2 = this.conversor_GMS_radianos(estacao.latitude);

            const p2 = [x2, y2]

            const distancia = this.calculo_distancia_coordendas(p1, p2);

            if (distancia < menor) {
                menor = distancia;
                this.estacao = estacao;
            }
        }
    }

    obtem_chuva() {
        switch (this.estacao.tipo) {
            case 'A':
                const estacaoTipoA = new EstacaoTipoA(this.tc, this.T, this.estacao.A, this.estacao.B, this.estacao.C, this.estacao.D, this.estacao.tcMax, this.estacao.Tmax);
                return estacaoTipoA.i();
            case 'B':
                const estacaoTipoB = new EstacaoTipoB(this.tc, this.T, this.estacao.A1, this.estacao.B1, this.estacao.C1, this.estacao.D1, this.estacao.E1, this.estacao.tcMax1, this.estacao.Tmax1, this.estacao.A2, this.estacao.B2, this.estacao.C2, this.estacao.D2, this.estacao.E2, this.estacao.tcMax2, this.estacao.Tmax2);
                return estacaoTipoB.i();
            case 'C':
                const estacaoTipoC = new EstacaoTipoC(this.tc, this.T, this.estacao.A1, this.estacao.B1, this.estacao.C1, this.estacao.D1, this.estacao.tcMax1, this.estacao.Tmax1, this.estacao.A2, this.estacao.B2, this.estacao.C2, this.estacao.D2, this.estacao.tcMax2, this.estacao.Tmax2);
                return estacaoTipoC.i();
        }
    }
}
