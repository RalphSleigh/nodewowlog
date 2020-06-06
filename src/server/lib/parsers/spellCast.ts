import { LogFields } from "./logFields";
import { Encounter, EncounterStatus } from "../data/encounter";
import { Event } from "./lineParser";
import { Damage } from "../data/damage";

export function SpellCast({ fields, encounter, dateTimeString }: Event): void {
  const time = encounter.getTimeOffset(dateTimeString)
  const caster = encounter.creatureManager.fromFields(fields, 0);
  const targetCreature = encounter.creatureManager.fromFields(fields, 4);

  targetCreature.recordLocation(time, fields.parseNumber(23), fields.parseNumber(24))

  if(!caster.owner) {
    const ownerGuid = fields.parseString(12)
    if(ownerGuid !== "0000000000000000") {
      const owner = encounter.creatureManager.fromGuid(ownerGuid)
      if(owner) {
        caster.owner = owner
      }
    }
  }

  encounter.spellManager.fromFields(fields, 8)
}
