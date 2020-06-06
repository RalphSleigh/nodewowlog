import {Event} from "./lineParser";
import {AuraEvent, AuraEventType} from "../data/auraEvent";

export function SpellAuraRemoved({dateTimeString, fields, encounter}: Event): void {

    const time = encounter.getTimeOffset(dateTimeString)

    const sourceCreature = encounter.creatureManager.fromFields(fields, 0);
    const targetCreature = encounter.creatureManager.fromFields(fields, 4);
    const aura = encounter.auraManager.fromFields(fields, 8);

    encounter.auraEventsManager.add(
        new AuraEvent(
            encounter,
            time,
            sourceCreature,
            targetCreature,
            aura,
            0,
            0,
            AuraEventType.REMOVED
        )
    );
}
