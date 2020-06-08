import {Field, InterfaceType, ObjectType} from "type-graphql";
import {AuraEvent, AuraEventType} from "./auraEvent";
import {ICreature} from "./creature";
import {CreatureDamageEvents} from "./genericSummableEvents";

@InterfaceType()
export class GenericFilteredAuraEvents {
    @Field(of => [AuraEvent])
    public readonly events: AuraEvent[]
    @Field()
    public count: number

    constructor() {
        this.events = []
        this.count = 0;
    }

    add(events: AuraEvent[]): FilteredAuraEvents {
        for (const event of events) {
            this.events.push(event)
            this.count++
        }
        return this
    }

    filterAuraByID(auraID: number) {
        return new FilteredAuraEvents().add(this.events.filter(e => e.aura.id === auraID))
    }

    filterAppliedEvents(): FilteredAuraEvents {
        return new FilteredAuraEvents().add(this.events.filter(e => e.type === AuraEventType.APPLIED))
    }

    filterRemovedEvents(): FilteredAuraEvents {
        return new FilteredAuraEvents().add(this.events.filter(e => e.type === AuraEventType.REMOVED))
    }

    bySource(): FilteredCreatureAuraEvents[] {
        const results: FilteredCreatureAuraEvents[] = []

        for (const event of this.events) {

            //const source = event.source.isPet() ? event.source.owner as ICreature : event.source

            let item = results.find(cE => cE.creature === event.source)
            if (!item) {
                item = new FilteredCreatureAuraEvents(event.source)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }

    byTarget(): FilteredCreatureAuraEvents[] {
        const results: FilteredCreatureAuraEvents[] = []

        for (const event of this.events) {

            //const source = event.source.isPet() ? event.source.owner as ICreature : event.source

            let item = results.find(cE => cE.creature === event.target)
            if (!item) {
                item = new FilteredCreatureAuraEvents(event.target)
                results.push(item)
            }
            item.add([event])
        }

        return results
    }
}

@ObjectType({implements: GenericFilteredAuraEvents, simpleResolvers: true})
export class FilteredAuraEvents extends GenericFilteredAuraEvents {
    constructor() {
        super();
    }
}

@ObjectType({implements: GenericFilteredAuraEvents, simpleResolvers: true})
export class FilteredCreatureAuraEvents extends GenericFilteredAuraEvents {
    @Field()
    public readonly creature: ICreature;
    constructor(creature: ICreature) {
        super();
        this.creature = creature
    }

}