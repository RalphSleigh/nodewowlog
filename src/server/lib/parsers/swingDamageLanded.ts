import {Event} from "./lineParser";
import {Damage, DamageType} from "../data/damage";

export function SwingDamageLanded({dateTimeString, fields, encounter}: Event): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    const sourceCreature = encounter.creatureManager.fromFields(fields, 0);
    const targetCreature = encounter.creatureManager.fromFields(fields, 4);
    const spell = encounter.spellManager.melee;

    targetCreature.recordLocation(time, fields.parseNumber(20), fields.parseNumber(21))

    const amount = fields.parseNumber(25);
    const crit = fields.parseBoolean(32)
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
