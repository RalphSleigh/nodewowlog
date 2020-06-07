import {LogLine} from "./lineParser";

export function SpellPeriodicHeal({dateTimeString, fields, encounter}: LogLine): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    //const sourceCreature = encounter.creatureManager.fromFields(fields, 0);
    const targetCreature = encounter.creatureManager.fromFields(fields, 4);
    //const spell = encounter.spellManager.fromFields(fields, 8);

    targetCreature.recordLocation(time, fields.parseNumber(23), fields.parseNumber(24))
    /*
    const amount = fields.parseNumber(28);
    const crit = fields.parseBoolean(35)
    encounter.damageManager.add(
        new Event(
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
     */
}
