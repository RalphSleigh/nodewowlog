import { Event } from "./event";
import { Encounter } from "./encounter";

export class EventsManager {
  public events: Event[];
  private encounter: Encounter;

  constructor(encounter: Encounter) {
    this.encounter = encounter;
    this.events = [];
  }

  add(event: Event): void {
    this.events.push(event);
  }
}
