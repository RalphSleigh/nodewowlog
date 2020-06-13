import { LogObject } from "./logObject";
import {Creature, ICreature} from "./creature";
import { Spell } from "./spell";
import {Field, InterfaceType, ObjectType} from "type-graphql";
import { Encounter } from "./encounter";
import { CreatureFilter } from "./creatureFilters";
import {GenericSummableEvents} from "./genericSummableEvents";

type BasicEventArgs = { encounter: Encounter; time: number }

@InterfaceType({
  resolveType: value => value.constructor.name
})
export class Event extends LogObject {
  @Field()
  public readonly time: number;

  constructor({ encounter, time }: BasicEventArgs) {
    super(encounter);
    this.time = time;
  }
}
type SourceTargetEventArgs = BasicEventArgs & {source: Creature; target: Creature}

@ObjectType({implements: Event, simpleResolvers: true})
export class SourceTargetEvent extends Event {
  @Field()
  public readonly source: Creature;
  @Field()
  public readonly target: Creature;
  constructor({ source, target, ...args}: SourceTargetEventArgs){
    super(args);
    this.source = source;
    this.target = target;
  }

  filterSource(filter: CreatureFilter): boolean {
    return filter(this.source);
  }

  filterTarget(filter: CreatureFilter): boolean {
    return filter(this.target);
  }
}

type SummableEventArgs = SourceTargetEventArgs & {spell: Spell; amount: number; crit: boolean}

@ObjectType({implements: Event, simpleResolvers: true})
export class  SummableEvent extends SourceTargetEvent {
  @Field()
  public readonly spell: Spell;
  @Field()
  public readonly amount: number;
  @Field()
  public readonly crit: boolean

  constructor({spell, amount, crit, ...args}: SummableEventArgs) {
    super(args);
    this.spell = spell;
    this.amount = amount;
    this.crit = crit;
  }

  sum(total: GenericSummableEvents) {
    throw new Error("Generic sum called")
  }
}

@ObjectType({implements: Event, simpleResolvers: true})
export class DamageEvent extends SummableEvent {}

@ObjectType({implements: Event, simpleResolvers: true})
export class DamageHitEvent extends DamageEvent {
  sum(total: GenericSummableEvents) {
    total.total += this.amount
    total.count++
    total.hits++
    if(this.crit) {
      total.critHitTotal += this.amount
      total.critHits++
    }
  }
}

@ObjectType({implements: Event, simpleResolvers: true})
export class DamageTickEvent extends DamageEvent {
  sum(total: GenericSummableEvents) {
    total.total += this.amount
    total.count++
    total.ticks++
    if(this.crit) {
      total.critTickTotal += this.amount
      total.critTicks++
    }
  }
}

@ObjectType({implements: Event, simpleResolvers: true})
export class HealingEvent extends SummableEvent {}

@ObjectType({implements: Event, simpleResolvers: true})
export class HealingHitEvent extends HealingEvent {
  sum(total: GenericSummableEvents) {
    total.total += this.amount
    total.count++
    total.hits++
    if(this.crit) {
      total.critHitTotal += this.amount
      total.critHits++
    }
  }
}

@ObjectType({implements: Event, simpleResolvers: true})
export class HealingTickEvent extends HealingEvent {
  sum(total: GenericSummableEvents) {
    total.total += this.amount
    total.count++
    total.ticks++
    if(this.crit) {
      total.critTickTotal += this.amount
      total.critTicks++
    }
  }
}

@ObjectType({implements: Event, simpleResolvers: true})
export class HealingAbsorbEvent extends HealingEvent {
  sum(total: GenericSummableEvents) {
    total.absorb += this.amount
    total.count++
    total.hits++
  }
}

