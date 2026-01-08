import { EstacaoPluviometrica } from "/EstacaoPluviometrica.js";

export class EstacaoTipoB extends EstacaoPluviometrica {
    constructor(tc, T, A1, B1, C1, D1, E1, tcMax1, Tmax1, A2, B2, C2, D2, E2, tcMax2, Tmax2) {
        super(tc, T)
        this.tipo = 'tipo B';
        this.tc = tc / 60;
        this.A1 = A1;
        this.B1 = B1;
        this.C1 = C1;
        this.D1 = D1;
        this.E1 = E1;
        this.tcMax1 = tcMax1;
        this.Tmax1 = Tmax1;
        this.A2 = A2;
        this.B2 = B2;
        this.C2 = C2;
        this.D2 = D2;
        this.E2 = E2;
        this.tcMax2 = tcMax2;
        this.Tmax2 = Tmax2;
    }

    i() {
        if (
            typeof this.tc !== 'number' ||
            typeof this.T !== 'number'
        ) return 0
        if (this.tc < this.tcMax1 && this.T <= this.Tmax1) {
            return (((this.A1 * Math.log(this.T) + this.B1) * Math.log(this.T + (this.E1 / 60))) + this.C1 * Math.log(this.T) + this.D1) / this.tc
        }
        else if (this.tc <= this.tcMax2 && this.T <= this.tcMax2) {
            return (((this.A2 * Math.log(this.T) + this.B2) * Math.log(this.T + (this.E2 / 60))) + this.C2 * Math.log(this.T) + this.D2) / this.tc
        }
        return 0
    }
}