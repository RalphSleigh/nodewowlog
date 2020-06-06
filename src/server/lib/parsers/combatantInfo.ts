import { LogFields } from "./logFields";

import { PlayerParser } from "../data/player";
import { Event } from "./lineParser";

export function CombatantInfo({ fields, encounter }: Event): void {
  PlayerParser(fields, encounter);
}
