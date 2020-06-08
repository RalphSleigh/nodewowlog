import {LogLine} from "./lineParser";
import {DamageHitEvent} from "../data/event";

export function SwingDamage({fields, encounter}: LogLine): void {
    // console.log(`parsing Spelldamage`);
    const source = encounter.creatureManager.fromFields(fields, 0);

    if(!source.owner) {
        const ownerGuid = fields.parseString(9)
        if(ownerGuid !== "0000000000000000") {
            const owner = encounter.creatureManager.fromGuid(ownerGuid)
            if(owner) {
                source.owner = owner
            }
        }
    }
}
