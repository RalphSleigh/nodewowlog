import {LogObject} from "./logObject";
import {Field, ObjectType} from "type-graphql";
import {Encounter} from "./encounter";
import {ICreature} from "./creature";
import {Location} from "./location";

@ObjectType({simpleResolvers: true})
export class CreatureInstant extends LogObject {

    @Field(of => ICreature)
    public readonly creature: ICreature;
    public readonly time: number;

    constructor(encounter: Encounter, creature: ICreature, time: number) {
        super(encounter);
        this.creature = creature
        this.time = time
    }

    @Field(of => Location)
    location(): Location {
        const before = this.creature.locations.filter(l => l.time <= this.time)

        if(before.length > 0) return before.pop() as Location
        return new Location(this.encounter, 0, 0, 0)
    }
}