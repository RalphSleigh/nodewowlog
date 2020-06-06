import {Event} from "./lineParser";
import {AuraEvent, AuraEventType} from "../data/auraEvent";

export function SpellAuraAppliedDose({dateTimeString, fields, encounter}: Event): void {

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
            AuraEventType.APPLIED_DOSE
        )
    );
}
