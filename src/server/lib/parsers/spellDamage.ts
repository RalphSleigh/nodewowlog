import {LogLine} from "./lineParser";
import {DamageHitEvent} from "../data/event";

export function SpellDamage({dateTimeString, fields, encounter}: LogLine): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    const source = encounter.creatureManager.fromFields(fields, 0);
    const target = encounter.creatureManager.fromFields(fields, 4);
    const spell = encounter.spellManager.fromFields(fields, 8);

    target.recordLocation(time, fields.parseNumber(23), fields.parseNumber(24))

    const amount = fields.parseNumber(28);
    const crit = fields.parseBoolean(35)
    encounter.eventsManager.add(
        new DamageHitEvent({
            encounter,
            time,
            source,
            target,
            spell,
            amount,
            crit })
    );
}
