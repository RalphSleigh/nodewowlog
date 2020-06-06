import {Field, ObjectType} from "type-graphql";
import {LogObject} from "./logObject";
import {Encounter} from "./encounter";

@ObjectType({simpleResolvers: true})
export class Location extends LogObject {
    @Field()
    public readonly time: number;
    @Field()
    public readonly x: number;
    @Field()
    public readonly y: number;

    constructor(
        encounter: Encounter,
        time: number,
        y: number,
        x: number
    ) {
        super(encounter);
        this.time = time
        this.x = x
        this.y = y
    }
}