import {LogLine} from "./lineParser";
import {DamageHitEvent} from "../data/event";

export function SwingDamageLanded({dateTimeString, fields, encounter}: LogLine): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    const source = encounter.creatureManager.fromFields(fields, 0);
    const target = encounter.creatureManager.fromFields(fields, 4);
    const spell = encounter.spellManager.melee;

    target.recordLocation(time, fields.parseNumber(20), fields.parseNumber(21))

    const amount = fields.parseNumber(25);
    const crit = fields.parseBoolean(32)
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
