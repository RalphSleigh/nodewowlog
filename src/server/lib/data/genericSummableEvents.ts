import {DamageHitEvent, SummableEvent} from "./event";
import {Field, InterfaceType, ObjectType} from "type-graphql";
import {ICreature} from "./creature";
import {Spell} from "./spell";
import {getCreatureFilterFunction} from "./creatureFilters";
import {CreatureFilterConfig, SpellFilterConfig} from "../web/resolvers/genericDamageEventsResolver";

@InterfaceType()
export abstract class GenericSummableEvents {
    protected events: SummableEvent[]
    @Field()
    public total: number
    @Field()
    public count: number
    @Field()
    public hits: number
    @Field()
    public ticks: number
    @Field()
    public critHits: number
    @Field()
    public critTicks: number
    @Field()
    public hitTotal: number
    @Field()
    public critHitTotal: number
    @Field()
    public tickTotal: number
    @Field()
    public critTickTotal: number

    protected constructor() {
        this.events = []
        this.total = 0
        this.count = 0
        this.hits = 0
        this.ticks = 0
        this.critHits = 0
        this.critTicks = 0
        this.hitTotal = 0
        this.tickTotal = 0
        this.critHitTotal = 0
        this.critTickTotal = 0
    }

    add(events: SummableEvent[]): void {
        for (const event of events) {
            this.events.push(event)
            this.total += event.amount
            this.count++
            if(event instanceof DamageHitEvent) {
                this.hits++
                if(event.crit) {
                    this.critHits++
                    this.critHitTotal += event.amount
                } else {
                    this.hitTotal += event.amount
                }
            } else {
                this.ticks++

                if(event.crit) {
                    this.critTicks++
                    this.critTickTotal += event.amount
                } else {
                    this.tickTotal += event.amount
                }
            }
        }

    }

    timeslice(): FilteredDamageEvents[] {
        const results: FilteredDamageEvents[] = []

        this.events.forEach(e => {
            const slice = Math.floor(e.time / 5000)
            if(!results[slice]) results[slice] = new FilteredDamageEvents()
            results[slice].add([e])
        })

        return results
    }

    filterSource(filter: CreatureFilterConfig): FilteredDamageEvents {
        const filterFunction = getCreatureFilterFunction(
            filter.filter,
            { guid: filter.guid, name: filter.name}
        );
        const result = new FilteredDamageEvents()
        result.add(this.events.filter(e => e.filterSource(filterFunction)))
        return result
    }

    filterTarget(filter: CreatureFilterConfig): FilteredDamageEvents {
        const filterFunction = getCreatureFilterFunction(
            filter.filter,
            { guid: filter.guid, name: filter.name}
        );
        const result = new FilteredDamageEvents()
        result.add(this.events.filter(e => e.filterTarget(filterFunction)))
        return result
    }

    filterSpell(filter: SpellFilterConfig): FilteredDamageEvents {
        const result = new FilteredDamageEvents()
        result.add(this.events.filter(e => e.spell.id === filter.spellId))
        return result
    }

    bySource(): CreatureDamageEvents[] {
        const results: CreatureDamageEvents[] = []

        for (const event of this.events) {

            //const source = event.source.isPet() ? event.source.owner as ICreature : event.source

            let item = results.find(cE => cE.creature === event.source)
            if (!item) {
                item = new CreatureDamageEvents(event.source)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }

    byTarget(): CreatureDamageEvents[] {
        const results: CreatureDamageEvents[] = []
        for (const event of this.events) {
            let item = results.find(cE => cE.creature === event.target)
            if (!item) {
                item = new CreatureDamageEvents(event.target)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }

    bySpell(): SpellDamageEvents[] {
        const results: SpellDamageEvents[] = []

        for (const event of this.events) {
            let item = results.find(cE => cE.spell === event.spell)
            if (!item) {
                item = new SpellDamageEvents(event.spell)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }
}

@ObjectType({implements: GenericSummableEvents, simpleResolvers: true})
export class FilteredDamageEvents extends GenericSummableEvents {

    constructor() {
        super();
    }
}

@ObjectType({implements: GenericSummableEvents, simpleResolvers: true})
export class CreatureDamageEvents extends GenericSummableEvents {
    @Field()
    public guid: string
    @Field()
    public creature: ICreature

    constructor(creature: ICreature) {
        super()
        this.guid = creature.guid
        this.creature = creature
    }
}

@ObjectType({implements: GenericSummableEvents, simpleResolvers: true})
export class SpellDamageEvents extends GenericSummableEvents {
    @Field()
    public spellId: number
    @Field()
    public spell: Spell

    constructor(spell: Spell) {
        super()
        this.spellId = spell.id
        this.spell = spell
    }
}