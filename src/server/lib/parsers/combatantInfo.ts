import { LogFields } from "./logFields";

import { PlayerParser } from "../data/player";
import { LogLine } from "./lineParser";

export function CombatantInfo({ fields, encounter }: LogLine): void {
  PlayerParser(fields, encounter);
}
