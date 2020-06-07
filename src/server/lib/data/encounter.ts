import { Field, ObjectType } from "type-graphql";
import { CreatureManager } from "./creatureManager";
import { SpellManager } from "./spellManager";
import { EventsManager } from "./eventsManager";
import {isFuture, sub} from "date-fns";
import {FilteredDamageEvents} from "./genericSummableEvents";
import {AuraManager} from "./auraManager";
import {AuraEventsManager} from "./auraEventsManager";
import {FilteredAuraEvents} from "./filteredAuraEvents";
import {DamageEvent, SummableEvent} from "./event";
let idValue = 1000000;

export enum EncounterStatus {
  InProgress = "IN_PROGRESS",
  Victory = "VICTORY",
  Wipe = "WIPE",
}

const dateRegex = /([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})$/

@ObjectType({simpleResolvers: true})
export class Encounter {
  @Field()
  id: number;
  @Field()
  startTime: Date;
  @Field()
  private _endTime?: Date;
  @Field()
  private encounterId: number;
  @Field()
  private name: string;
  @Field()
  private numberOfPlayers: number;
  @Field()
  private difficulty: number;
  @Field()
  private readonly boss: boolean;
  @Field()
  private status: EncounterStatus;
  public readonly creatureManager: CreatureManager;
  public readonly spellManager: SpellManager;
  public readonly eventsManager: EventsManager;
  public readonly auraManager: AuraManager;
  public readonly auraEventsManager: AuraEventsManager;
  private readonly _hours: number;
  private readonly _minutes: number;
  private readonly _seconds: number;
  private readonly _milliseconds: number;
  constructor(
    startTime: string,
    encounterId: number,
    name: string,
    numberOfPlayers: number,
    difficulty: number,
    boss: boolean
  ) {
    this.id = idValue++;
    this.startTime = parseDate(startTime);
    this.encounterId = encounterId;
    this.name = name;
    this.numberOfPlayers = numberOfPlayers;
    this.difficulty = difficulty;
    this.boss = boss;
    this.status = EncounterStatus.InProgress;

    this.creatureManager = new CreatureManager(this);
    this.spellManager = new SpellManager(this);
    this.eventsManager = new EventsManager(this);
    this.auraManager = new AuraManager(this)
    this.auraEventsManager = new AuraEventsManager(this)

    const timeBits = dateRegex.exec(startTime)

    if(!timeBits || timeBits.length !== 5) throw new Error(`unexpected date format ${startTime}`)

    this._hours = parseInt(timeBits[1] as string)
    this._minutes = parseInt(timeBits[2] as string)
    this._seconds = parseInt(timeBits[3] as string)
    this._milliseconds = parseInt(timeBits[4] as string)

  }

  finish(status: EncounterStatus, endTime: string): void {
    this.status = status;
    this._endTime = parseDate(endTime);

    if(this.boss)console.log(`Finished encounter: ${status}`)
  }

  isBoss(): boolean {
    return this.boss;
  }

  @Field()
  endTime(): Date {
    return this._endTime || new Date()
  }

  //return the milliseconds since the encounter began without using the inbuilt Date() as it is slow.
  // TODO: fix encounters that span days.
  getTimeOffset(dateTimeString: string): number {
    const timeBits = dateRegex.exec(dateTimeString)

    if(!timeBits || timeBits.length !== 5) throw new Error(`unexpected date format ${dateTimeString}`)

    const hours = parseInt(timeBits[1] as string)
    const minutes = parseInt(timeBits[2] as string)
    const seconds = parseInt(timeBits[3] as string)
    const milliseconds = parseInt(timeBits[4] as string)

    return ((hours - this._hours) * 1000 * 60 * 60)
        + ((minutes - this._minutes) * 1000 * 60)
        + ((seconds - this._seconds) * 1000 )
        + (milliseconds - this._milliseconds)
  }

  graphFilteredEvents(): FilteredDamageEvents {
    const filteredEvents = new FilteredDamageEvents()
    filteredEvents.add(this.eventsManager.events.filter(e => e instanceof SummableEvent) as SummableEvent[])
    return filteredEvents
  }

  graphAuraEvents(): FilteredAuraEvents {
    return new FilteredAuraEvents().add(this.auraEventsManager.getEvents())
  }

  static trashEncounter(dateTime: string): Encounter {
    return new Encounter(dateTime, 0, "Trash", 0, 0, false);
  }
}

function parseDate(dateTime: string): Date {
  //parse something like 3/5 18:07:41.033
  const [dateString, time] = dateTime.split(" ");
  const [day, month] = dateString.split("/");
  const [hour, minute, rest] = time.split(":");
  const [seconds, ms] = rest.split(".");

  const date = new Date(
      new Date().getFullYear(),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(seconds),
      parseInt(ms)
  );

  return isFuture(date) ? sub(date, {years: 1}) : date;
}
