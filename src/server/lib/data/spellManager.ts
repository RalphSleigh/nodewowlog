import {Spell} from "./spell";
import {LogFields} from "../parsers/logFields";
import {Encounter} from "./encounter";

export class SpellManager {
    private spells: Map<number, Spell>;
    private encounter: Encounter;
    public melee: Spell;

    constructor(encounter: Encounter) {
        this.encounter = encounter;
        this.spells = new Map<number, Spell>();
        this.melee = new Spell(this.encounter, 1, "Melee", 1)
    }

    fromFields(fields: LogFields, index: number): Spell {
        const id = fields.parseNumber(index);

        if (this.spells.has(id)) {
            return this.spells.get(id) as Spell;
        }

        const spell = new Spell(
            this.encounter,
            id,
            fields.parseString(index + 1),
            fields.parseNumber(index + 2)
        );
        this.spells.set(id, spell);
        return spell;
    }

    graphGetSpells(): Spell[] {
        return [...this.spells.values()]
    }
}
