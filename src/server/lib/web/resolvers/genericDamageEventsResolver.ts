/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import {Arg, Args, ArgsType, ClassType, Field, FieldResolver, Resolver, Root} from "type-graphql";
import {CreatureDamageEvents, FilteredDamageEvents, GenericSummableEvents, SpellDamageEvents} from "../../data/genericSummableEvents";
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
        @FieldResolver(() => [SpellDamageEvents])
        bySpell(@Root() genericEvents: GenericSummableEvents): SpellDamageEvents[] {
            return genericEvents.bySpell()
        }

        @FieldResolver(() => [CreatureDamageEvents])
        bySource(@Root() filteredEvents: FilteredDamageEvents): CreatureDamageEvents[] {
            return filteredEvents.bySource()
        }

        @FieldResolver(() => [CreatureDamageEvents])
        byTarget(@Root() filteredEvents: FilteredDamageEvents): CreatureDamageEvents[] {
            return filteredEvents.byTarget()
        }

        @FieldResolver(() => [FilteredDamageEvents])
        timeSlice(@Root() filteredEvents: FilteredDamageEvents): FilteredDamageEvents[] {
            const now = Date.now()
            const result = filteredEvents.timeslice()
            console.log(`Timeslice took ${Date.now() - now}`)
            return result
        }

        @FieldResolver(() => FilteredDamageEvents)
        filterSource(@Root() filteredEvents: FilteredDamageEvents,
                    @Args() filter: CreatureFilterConfig): FilteredDamageEvents {
            return filteredEvents.filterSource(filter)
        }

        @FieldResolver(() => FilteredDamageEvents)
        filterTarget(@Root() filteredEvents: FilteredDamageEvents,
                     @Args() filter: CreatureFilterConfig): FilteredDamageEvents {
            return filteredEvents.filterTarget(filter)
        }

        @FieldResolver(() => FilteredDamageEvents)
        filterSpell(@Root() filteredEvents: FilteredDamageEvents,
                     @Args() filter: SpellFilterConfig): FilteredDamageEvents {
            return filteredEvents.filterSpell(filter)
        }

    }
    return BaseResolver as any;
}

@Resolver(of => FilteredDamageEvents)
export class FilteredEventsResolver extends createBaseResolver(FilteredDamageEvents) {}

@Resolver(of => CreatureDamageEvents)
export class CreatureEventsResolver extends createBaseResolver(CreatureDamageEvents) {}

@Resolver(of => SpellDamageEvents)
export class SpellEventsResolver extends createBaseResolver(SpellDamageEvents) {}
