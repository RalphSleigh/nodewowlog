import {LogLine} from "./lineParser";
import {AuraEvent, AuraEventType} from "../data/auraEvent";

export function SpellAuraRemovedDose({dateTimeString, fields, encounter}: LogLine): void {

    const time = encounter.getTimeOffset(dateTimeString)

    const sourceCreature = encounter.creatureManager.fromFields(fields, 0);
    const targetCreature = encounter.creatureManager.fromFields(fields, 4);
    const aura = encounter.auraManager.fromFields(fields, 8);

    const stacks = fields.parseNumber(12);
    const amount = 0

    encounter.auraEventsManager.add(
        new AuraEvent(
            encounter,
            time,
            sourceCreature,
            targetCreature,
            aura,
            stacks,
            amount,
            AuraEventType.REMOVED_DOSE
        )
    );
}
