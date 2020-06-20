import { LogFields } from "./logFields";
import { Encounter, EncounterStatus } from "../data/encounter";
import { LogLine } from "./lineParser";

export function EncounterEnd({
  dateTimeString,
  fields,
  encounter,
  logFile,
}: LogLine): void {

  const success = fields.parseBoolean(4);

  encounter.finish(
    success ? EncounterStatus.Victory : EncounterStatus.Wipe,
    dateTimeString
  );

  const newEncounter = Encounter.trashEncounter(dateTimeString);
  logFile.updateEncounter(newEncounter);
}
