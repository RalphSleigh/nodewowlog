import {Args, Field, ObjectType} from "type-graphql";
import {LogObject} from "./logObject";
import {Encounter} from "./encounter";
import {CreatureFilterConfig} from "../web/resolvers/genericDamageEventsResolver";
import {CreatureInstant} from "./creatureInstant";
import {getCreatureFilterFunction} from "./creatureFilters";


@ObjectType({simpleResolvers: true})
export class Instant extends LogObject {

    @Field()
    public readonly time: number


    constructor(encounter: Encounter, time: number) {
        super(encounter);
        this.time = time
    }

    @Field(of => [CreatureInstant])
    creatures(@Args() filter: CreatureFilterConfig): CreatureInstant[] {
        const filterFunction = getCreatureFilterFunction(
            filter.filter,
            { guid: filter.guid, name: filter.name}
        );

        return this.encounter.creatureManager.graphGetCreatures().filter(filterFunction).map(c => c.getInstant(this.time))
    }
}