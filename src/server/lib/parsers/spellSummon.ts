import { LogFields } from "./logFields";
import { Encounter, EncounterStatus } from "../data/encounter";
import { Event } from "./lineParser";
import { Damage } from "../data/damage";
import {Container} from "typedi";
import {LogFile} from "../data/logFile";

export function SpellSummon({ fields, encounter }: Event): void {
  // console.log(`parsing Spelldamage`);
  const ownerCreature = encounter.creatureManager.fromFields(fields, 0);
  const summonedCreature = encounter.creatureManager.fromFields(fields, 4);

  summonedCreature.owner = ownerCreature
}
