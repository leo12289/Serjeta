import { EstacaoPluviometrica } from "/EstacaoPluviometrica.js";

export class EstacaoTipoA extends EstacaoPluviometrica {
    constructor(tc, T, A, B, C, D, tcMax, Tmax) {
        super(tc, T);
        this.tipo = 'tipo A';
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;
        this.tcMax = tcMax;
        this.Tmax = Tmax;
    }

    i() {
        if (
            typeof this.tc !== 'number' ||
            typeof this.T !== 'number'
        ) return 0;
        if (this.tc <= this.tcMax && this.T <= this.Tmax) {
            return (this.A * this.T ** this.B) / ((this.tc + this.C) ** this.D);
        }
        return 0;
    }
}