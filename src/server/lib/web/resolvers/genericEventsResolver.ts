/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import {Arg, Args, ArgsType, ClassType, Field, FieldResolver, Resolver, Root} from "type-graphql";
import {CreatureEvents, FilteredEvents, GenericSummableEvents, SpellEvents} from "../../data/genericSummableEvents";
import {CreatureFilters} from "../../data/creatureFilters";
import {IsString} from "class-validator";


@ArgsType()
export class CreatureFilterConfig {
    @Field((type) => CreatureFilters,  { defaultValue: CreatureFilters.All })
    filter!: CreatureFilters;
    @Field((type) => String, { nullable: true })
    @IsString()
    guid?: string;
    @Field((type) => String, { nullable: true })
    @IsString()
    name?: string;
}

@ArgsType()
export class SpellFilterConfig {
    @Field(() => Number)
    public spellId: number;

    constructor(spellId: number) {
        this.spellId = spellId
    }
}

export function createBaseResolver(eventsType: ClassType): any {
    @Resolver(of => eventsType, { isAbstract: true })
    abstract class BaseResolver {
        @FieldResolver(() => [SpellEvents])
        bySpell(@Root() genericEvents: GenericSummableEvents): SpellEvents[] {
            return genericEvents.bySpell()
        }

        @FieldResolver(() => [CreatureEvents])
        bySource(@Root() filteredEvents: FilteredEvents): CreatureEvents[] {
            return filteredEvents.bySource()
        }

        @FieldResolver(() => [CreatureEvents])
        byTarget(@Root() filteredEvents: FilteredEvents): CreatureEvents[] {
            return filteredEvents.byTarget()
        }

        @FieldResolver(() => [FilteredEvents])
        timeSlice(@Root() filteredEvents: FilteredEvents): FilteredEvents[] {
            const now = Date.now()
            const result = filteredEvents.timeslice()
            console.log(`Timeslice took ${Date.now() - now}`)
            return result
        }

        @FieldResolver(() => FilteredEvents)
        filterDamage(@Root() filteredEvents: FilteredEvents): FilteredEvents {
            return filteredEvents.filterDamage()
        }

        @FieldResolver(() => FilteredEvents)
        filterHealing(@Root() filteredEvents: FilteredEvents): FilteredEvents {
            return filteredEvents.filterHealing()
        }

        @FieldResolver(() => FilteredEvents)
        filterSource(@Root() filteredEvents: FilteredEvents,
                    @Args() filter: CreatureFilterConfig): FilteredEvents {
            return filteredEvents.filterSource(filter)
        }

        @FieldResolver(() => FilteredEvents)
        filterTarget(@Root() filteredEvents: FilteredEvents,
                     @Args() filter: CreatureFilterConfig): FilteredEvents {
            return filteredEvents.filterTarget(filter)
        }

        @FieldResolver(() => FilteredEvents)
        filterSpell(@Root() filteredEvents: FilteredEvents,
                     @Args() filter: SpellFilterConfig): FilteredEvents {
            return filteredEvents.filterSpell(filter)
        }

    }
    return BaseResolver as any;
}

@Resolver(of => FilteredEvents)
export class FilteredEventsResolver extends createBaseResolver(FilteredEvents) {}

@Resolver(of => CreatureEvents)
export class CreatureEventsResolver extends createBaseResolver(CreatureEvents) {}

@Resolver(of => SpellEvents)
export class SpellEventsResolver extends createBaseResolver(SpellEvents) {}
