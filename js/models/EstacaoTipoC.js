import { EstacaoPluviometrica } from "./EstacaoPluviometrica.js";

export class EstacaoTipoC extends EstacaoPluviometrica {
    constructor(tc, T, A1, B1, C1, D1, tcMax1, Tmax1, A2, B2, C2, D2, tcMax2, Tmax2) {
        super(tc, T);
        this.tipo = 'tipo C';
        this.A1 = A1;
        this.B1 = B1;
        this.C1 = C1;
        this.D1 = D1;
        this.tcMax1 = tcMax1;
        this.Tmax1 = Tmax1;
        this.A2 = A2;
        this.B2 = B2;
        this.C2 = C2;
        this.D2 = D2;
        this.tcMax2 = tcMax2;
        this.Tmax2 = Tmax2;
    }

    i() {
        if (
            typeof this.tc !== 'number' ||
            typeof this.T !== 'number'
        ) return 0;
        if (this.tc <= this.tcMax1 && this.T <= this.Tmax1) {
            return (this.A1 * this.T ** this.B1) / ((this.tc + this.C1) ** this.D1);
        }
        else if (this.tc <= this.tcMax2 && this.T <= this.Tmax2) {
            return (this.A2 * this.T ** this.B2) / ((this.tc + this.C2) ** this.D2);
        }
        return 0;
    }
}