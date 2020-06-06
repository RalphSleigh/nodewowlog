import {FilteredAuraEvents, FilteredCreatureAuraEvents} from "../../data/filteredAuraEvents";
import {Arg, Args, ClassType, FieldResolver, Resolver, Root} from "type-graphql";


export function createBaseAuraEventResolver(eventsType: ClassType): any {
    @Resolver(of => eventsType, { isAbstract: true })
    abstract class BaseResolver {
        @FieldResolver(() => FilteredAuraEvents)
        filterAuraID(@Root() filteredAuraEvents: FilteredAuraEvents,
                     @Arg("auraID") auraID: number): FilteredAuraEvents {
            return filteredAuraEvents.filterAuraByID(auraID)
        }

        @FieldResolver(() => FilteredAuraEvents)
        filterApplied(@Root() filteredAuraEvents: FilteredAuraEvents): FilteredAuraEvents {
            return filteredAuraEvents.filterAppliedEvents()
        }

        @FieldResolver(() => FilteredAuraEvents)
        filterRemoved(@Root() filteredAuraEvents: FilteredAuraEvents): FilteredAuraEvents {
            return filteredAuraEvents.filterRemovedEvents()
        }

        @FieldResolver(() => [FilteredCreatureAuraEvents])
        byTarget(@Root() filteredAuraEvents: FilteredAuraEvents): FilteredCreatureAuraEvents[] {
            return filteredAuraEvents.byTarget()
        }
    }
    return BaseResolver as any;
}

@Resolver(of => FilteredAuraEvents)
export class FilteredAuraEventsResolver extends createBaseAuraEventResolver(FilteredAuraEvents) {}

@Resolver(of => FilteredCreatureAuraEvents)
export class FilteredCreatureAuraEventsResolver extends createBaseAuraEventResolver(FilteredCreatureAuraEvents) {}