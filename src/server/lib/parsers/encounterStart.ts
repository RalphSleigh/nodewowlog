import { Encounter, EncounterStatus } from "../data/encounter";
import { LogLine } from "./lineParser";

export function EncounterStart({
  dateTimeString,
  fields,
  encounter,
  logFile,
}: LogLine): void {
  const id = fields.parseNumber(0);
  const name = fields.parseString(1);
  const difficulty = fields.parseNumber(2);
  const players = fields.parseNumber(3);

  encounter.finish(EncounterStatus.Victory, dateTimeString);

  const newEncounter = new Encounter(
    dateTimeString,
    id,
    name,
    players,
    difficulty,
    true
  );

  console.log(`New Encounter: ${name}`)

  logFile.updateEncounter(newEncounter);
}
