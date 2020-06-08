import {LogLine} from "./lineParser";
import {DamageHitEvent, HealingAbsorbEvent} from "../data/event";

export function SpellAbsorbed({dateTimeString, fields, encounter}: LogLine): void {
    // console.log(`parsing Spelldamage`);
    const time = encounter.getTimeOffset(dateTimeString)

    const damageSource = encounter.creatureManager.fromFields(fields, 0);
    const target = encounter.creatureManager.fromFields(fields, 4);

    let absorbSource, damageSpell, absorbSpell, amount, crit

    if(fields.length() === 21) { //Spell version
        absorbSource = encounter.creatureManager.fromFields(fields, 11);
        damageSpell = encounter.spellManager.fromFields(fields, 8);
        absorbSpell = encounter.spellManager.fromFields(fields, 15);
        amount = fields.parseNumber(18);
        crit = fields.parseBoolean(20)
    } else { //Melee version
        absorbSource = encounter.creatureManager.fromFields(fields, 8);
        damageSpell = encounter.spellManager.melee
        absorbSpell = encounter.spellManager.fromFields(fields, 12);
        amount = fields.parseNumber(15);
        crit = fields.parseBoolean(17)
    }

    encounter.eventsManager.add(
        new DamageHitEvent({
            encounter,
            time,
            source: damageSource,
            target,
            spell: damageSpell,
            amount,
            crit})
    );

    encounter.eventsManager.add(
        new HealingAbsorbEvent({
            encounter,
            time,
            source: absorbSource,
            target,
            spell: absorbSpell,
            amount,
            crit: false})
    );
}
