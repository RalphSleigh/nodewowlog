import { LogObject } from "./logObject";
import {Field, InterfaceType, ObjectType} from "type-graphql";
import { Encounter } from "./encounter";
import {Location} from "./location";
import {CreatureInstant} from "./creatureInstant";

@InterfaceType({
  resolveType: value => value.constructor.name
})
export abstract class ICreature extends LogObject {
  @Field()
  public name: string;
  @Field()
  public readonly guid: string;
  @Field()
  public readonly friendly: boolean
  @Field({nullable: true })
  public owner?: ICreature
  @Field()
  public seen: number
  @Field(of => [Location])
  public locations: Location[]

  constructor(encounter: Encounter, guid: string, name: string, friendly: boolean, seen: number) {
    super(encounter);
    this.guid = guid;
    this.name = name;
    this.friendly = friendly;
    this.seen = seen;
    this.locations = [];
  }

  update(values: Partial<this>): void {
    Object.assign(this, values);
  }

  recordLocation(time: number, y: number, x: number) {
    this.locations.push(new Location(this.encounter, time, y, x))
  }

  getInstant(time: number) {
    return new CreatureInstant(this.encounter, this, time)
  }

  isPet(): boolean {
    return !!this.owner
  }
}

@ObjectType({implements: ICreature, simpleResolvers: true })
export class Creature extends ICreature{


}
