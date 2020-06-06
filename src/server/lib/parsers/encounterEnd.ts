import { LogFields } from "./logFields";
import { Encounter, EncounterStatus } from "../data/encounter";
import { Event } from "./lineParser";

export function EncounterEnd({
  dateTimeString,
  fields,
  encounter,
  logFile,
}: Event): void {

  const success = fields.parseBoolean(4);

  encounter.finish(
    success ? EncounterStatus.Victory : EncounterStatus.Wipe,
    dateTimeString
  );

  const newEncounter = Encounter.trashEncounter(dateTimeString);
  logFile.updateEncounter(newEncounter);
}
