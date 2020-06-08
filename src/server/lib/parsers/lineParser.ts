import { EncounterStart } from "./encounterStart";
import { EncounterEnd } from "./encounterEnd";
import { LogFile } from "../data/logFile";
import { Fields, lineSplitter, LogFields } from "./logFields";
import { isFuture, sub } from "date-fns";
import { CombatantInfo } from "./combatantInfo";
import { SpellDamage } from "./spellDamage";
import { Encounter } from "../data/encounter";
import {SpellSummon} from "./spellSummon";
import {SpellCast} from "./spellCast";
import {SpellPeriodicDamage} from "./spellPeriodicDamage";
import {RangeDamage} from "./rangeDamage";
import {SwingDamageLanded} from "./swingDamageLanded";
import {SpellAuraApplied} from "./spellAuraApplied";
import {SpellAuraRemoved} from "./spellAuraRemoved";
import {SpellAuraAppliedDose} from "./spellAuraAppliedDose";
import {SpellAuraRemovedDose} from "./spellAuraRemovedDose";
import {SpellHeal} from "./spellHeal";
import {SpellPeriodicHeal} from "./spellPeriodicHeal";
import {SpellEnergize} from "./spellEnergize";
import {SpellAbsorbed} from "./spellAbsorbed";
import {SwingDamage} from "./swingDamage";

export type getDate = () => Date

export interface LogLine {
  dateTimeString: string;
  fields: LogFields;
  logFile: LogFile;
  encounter: Encounter;
}

export interface EventParser {
  (event: LogLine): void;
}

export function parseLine(logFile: LogFile, line: string): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  try {

    const fields = lineSplitter(line);
    const [dateTimeString, type] = (fields.fields.shift() as string).split("  ");

  // const dateTime = parseDate(dateTimeString);
  const specificEventParser = eventParsers[type];

  // if(line.includes("Pet-0-3774-1643-31970-118244-0B02CF65A0") && line.includes("Player-1300-0AFA8DFC"))console.log(line)

  //const ownerstring = fields.parseString(12)
  //if(ownerstring)console.log(`${type} ${ownerstring}`)

  if (specificEventParser) {
    specificEventParser({
      dateTimeString,
      fields,
      logFile,
      encounter: logFile.getEncounter(dateTimeString),
    });
    logFile.countParsedEvent(type);
  } else {
    logFile.countNonParsedEvent(type);
  }
  } catch (e) {
    console.log(e)
  }
}

interface StringMap {
  [key: string]: EventParser;
}
const eventParsers: StringMap = {
  ENCOUNTER_START: EncounterStart,
  ENCOUNTER_END: EncounterEnd,
  COMBATANT_INFO: CombatantInfo,
  SPELL_DAMAGE: SpellDamage,
  SPELL_SUMMON: SpellSummon,
  SPELL_CAST_SUCCESS: SpellCast,
  SPELL_PERIODIC_DAMAGE: SpellPeriodicDamage,
  RANGE_DAMAGE: RangeDamage,
  SWING_DAMAGE: SwingDamage,
  SWING_DAMAGE_LANDED: SwingDamageLanded,
  SPELL_AURA_APPLIED: SpellAuraApplied,
  SPELL_AURA_REMOVED: SpellAuraRemoved,
  SPELL_AURA_APPLIED_DOSE: SpellAuraAppliedDose,
  SPELL_AURA_REMOVED_DOSE: SpellAuraRemovedDose,
  SPELL_HEAL: SpellHeal,
  SPELL_PERIODIC_HEAL: SpellPeriodicHeal,
  SPELL_ENERGIZE: SpellEnergize,
  SPELL_ABSORBED: SpellAbsorbed
};
