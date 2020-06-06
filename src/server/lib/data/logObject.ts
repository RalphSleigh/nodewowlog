import { Encounter } from "./encounter";

export abstract class LogObject {
  public encounter: Encounter;

  protected constructor(encounter: Encounter) {
    this.encounter = encounter;
  }
}
