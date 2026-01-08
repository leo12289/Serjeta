export class EstacaoPluviometrica {
    constructor(tc, T) {
        this.tipo = 'genérica';
        this.tc = tc;
        this.T = T;
    }

    i() {
        throw new Error('Método calcular() deve ser sobrescrito');
    }
}