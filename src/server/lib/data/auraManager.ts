import {LogFields} from "../parsers/logFields";
import {Encounter} from "./encounter";
import {Aura} from "./aura";

export class AuraManager {
    private auras: Map<number, Aura>;
    private encounter: Encounter;

    constructor(encounter: Encounter) {
        this.encounter = encounter;
        this.auras = new Map<number, Aura>();
    }

    fromFields(fields: LogFields, index: number): Aura {
        const id = fields.parseNumber(index);

        if (this.auras.has(id)) {
            return this.auras.get(id) as Aura;
        }

        const aura = new Aura(
            this.encounter,
            id,
            fields.parseString(index + 1),
            fields.parseNumber(index + 2)
        );
        this.auras.set(id, aura);
        return aura;
    }
}
