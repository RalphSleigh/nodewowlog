import {Event} from "./lineParser";
import {Damage, DamageType} from "../data/damage";

export function RangeDamage({dateTimeString, fields, encounter}: Event): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    const sourceCreature = encounter.creatureManager.fromFields(fields, 0);
    const targetCreature = encounter.creatureManager.fromFields(fields, 4);
    const spell = encounter.spellManager.fromFields(fields, 8);

    targetCreature.recordLocation(time, fields.parseNumber(23), fields.parseNumber(24))

    const amount = fields.parseNumber(28);
    const crit = fields.parseBoolean(35)
    encounter.damageManager.add(
        new Damage(
            encounter,
            time,
            sourceCreature,
            targetCreature,
            spell,
            DamageType.Hit,
            amount,
            crit
        )
    );
}
