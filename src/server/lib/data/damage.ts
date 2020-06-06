import { LogObject } from "./logObject";
import { Creature } from "./creature";
import { Spell } from "./spell";
import { Field, ObjectType } from "type-graphql";
import { Encounter } from "./encounter";
import { CreatureFilter } from "./creatureFilters";

export enum DamageType {
  Hit = "Hit",
  Tick = "Tick"
}

@ObjectType({simpleResolvers: true})
export class Damage extends LogObject {
  @Field()
  public readonly time: number;
  @Field()
  public readonly source: Creature;
  @Field()
  public readonly target: Creature;
  @Field()
  public readonly spell: Spell;
  @Field()
  public readonly type: DamageType
  @Field()
  public readonly amount: number;
  @Field()
  public readonly crit: boolean
  constructor(
    encounter: Encounter,
    time: number,
    source: Creature,
    target: Creature,
    spell: Spell,
    type: DamageType,
    amount: number,
    crit: boolean
  ) {
    super(encounter);
    this.time = time;
    this.source = source;
    this.target = target;
    this.spell = spell;
    this.type = type;
    this.amount = amount;
    this.crit = crit;
  }

  filterSource(filter: CreatureFilter): boolean {
    return filter(this.source);
  }

  filterTarget(filter: CreatureFilter): boolean {
    return filter(this.target);
  }
}
