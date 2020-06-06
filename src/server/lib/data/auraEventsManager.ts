import { Encounter } from "./encounter";
import {AuraEvent} from "./auraEvent";

export class AuraEventsManager {
    public events: AuraEvent[];
    private encounter: Encounter;

    constructor(encounter: Encounter) {
        this.encounter = encounter;
        this.events = [];
    }

    add(event: AuraEvent): void {
        this.events.push(event);
    }

    getEvents(): AuraEvent[] {
        return this.events
    }
}
