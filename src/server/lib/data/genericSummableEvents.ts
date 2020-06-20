import {DamageEvent, DamageHitEvent, HealingEvent, SummableEvent} from "./event";
import {Field, InterfaceType, ObjectType} from "type-graphql";
import {ICreature} from "./creature";
import {Spell} from "./spell";
import {getCreatureFilterFunction} from "./creatureFilters";
import {CreatureFilterConfig, SpellFilterConfig} from "../web/resolvers/genericEventsResolver";

@InterfaceType()
export abstract class GenericSummableEvents {
    protected events: SummableEvent[]
    @Field()
    public total: number
    @Field()
    public absorb: number
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
        this.absorb = 0
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
            event.sum(this) //event knows how to sum itself
        }
    }

    timeslice(): GenericSummableEvents[] {
        const results: FilteredEvents[] = []

        this.events.forEach(e => {
            const slice = Math.floor(e.time / 5000)
            if(!results[slice]) results[slice] = new FilteredEvents()
            results[slice].add([e])
        })

        return results
    }

    filterDamage(): FilteredEvents {
        const result = new FilteredEvents()
        result.add(this.events.filter(e => e instanceof DamageEvent))
        return result
    }

    filterHealing(): FilteredEvents {
        const result = new FilteredEvents()
        result.add(this.events.filter(e => e instanceof HealingEvent))
        return result
    }

    filterSource(filter: CreatureFilterConfig): FilteredEvents {
        const filterFunction = getCreatureFilterFunction(
            filter.filter,
            { guid: filter.guid, name: filter.name}
        );
        const result = new FilteredEvents()
        result.add(this.events.filter(e => e.filterSource(filterFunction)))
        return result
    }

    filterTarget(filter: CreatureFilterConfig): FilteredEvents {
        const filterFunction = getCreatureFilterFunction(
            filter.filter,
            { guid: filter.guid, name: filter.name}
        );
        const result = new FilteredEvents()
        result.add(this.events.filter(e => e.filterTarget(filterFunction)))
        return result
    }

    filterSpell(filter: SpellFilterConfig): FilteredEvents {
        const result = new FilteredEvents()
        result.add(this.events.filter(e => e.spell.id === filter.spellId))
        return result
    }

    bySource(): CreatureEvents[] {
        const results: CreatureEvents[] = []

        for (const event of this.events) {

            //const source = event.source.isPet() ? event.source.owner as ICreature : event.source

            let item = results.find(cE => cE.creature === event.source)
            if (!item) {
                item = new CreatureEvents(event.source)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }

    byTarget(): CreatureEvents[] {
        const results: CreatureEvents[] = []
        for (const event of this.events) {
            let item = results.find(cE => cE.creature === event.target)
            if (!item) {
                item = new CreatureEvents(event.target)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }

    bySpell(): SpellEvents[] {
        const results: SpellEvents[] = []

        for (const event of this.events) {
            let item = results.find(cE => cE.spell === event.spell)
            if (!item) {
                item = new SpellEvents(event.spell)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }
}

@ObjectType({implements: GenericSummableEvents, simpleResolvers: true})
export class FilteredEvents extends GenericSummableEvents {

    constructor() {
        super();
    }
}

@ObjectType({implements: GenericSummableEvents, simpleResolvers: true})
export class CreatureEvents extends GenericSummableEvents {
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
export class SpellEvents extends GenericSummableEvents {
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