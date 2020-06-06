import { Encounter } from "./encounter";
import { Service } from "typedi";
import {ICreature} from "./creature";
import {getDate} from "../parsers/lineParser";

@Service()
export class LogFile {
  private readonly parsedCounts: Map<string, number>;
  private readonly nonParsedCounts: Map<string, number>;
  private readonly encounters: Encounter[];

  constructor() {
    this.parsedCounts = new Map<string, number>();
    this.nonParsedCounts = new Map<string, number>();
    this.encounters = [];
  }

  getEncounter(dateTimeString: string): Encounter {
    if (this.encounters.length === 0) {
      // first time
      const encounter = Encounter.trashEncounter(dateTimeString);
      this.encounters.push(encounter);
      return encounter;
    } else {
      return this.encounters[this.encounters.length - 1];
    }
  }

  graphGetEncounters(): Encounter[] {
    return this.encounters;
  }

  updateEncounter(encounter: Encounter) {
    this.encounters.push(encounter);
  }

  countParsedEvent(type: string) {
    this.countEvent(this.parsedCounts, type);
  }

  countNonParsedEvent(type: string) {
    this.countEvent(this.nonParsedCounts, type);
  }

  countEvent(map: Map<string, number>, type: string) {
    const value = map.get(type);
    if (value) {
      map.set(type, value + 1);
    } else {
      map.set(type, 1);
    }
  }

  logEvents() {
    console.log(this.parsedCounts);
    console.log(this.nonParsedCounts);
  }
}
