import { Damage } from "./damage";
import { Encounter } from "./encounter";

export class DamageManager {
  public events: Damage[];
  private encounter: Encounter;

  constructor(encounter: Encounter) {
    this.encounter = encounter;
    this.events = [];
  }

  add(event: Damage): void {
    this.events.push(event);
  }
}
