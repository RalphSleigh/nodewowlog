import {Field, ObjectType} from "type-graphql";
import {LogObject} from "./logObject";
import {Encounter} from "./encounter";

@ObjectType({simpleResolvers: true})
export class Aura extends LogObject {
    @Field()
    public readonly id: number;
    @Field()
    public readonly name: string;
    @Field()
    public readonly school: number;
    constructor(
        encounter: Encounter,
        id: number,
        name: string,
        school: number,
    ) {
        super(encounter);
        this.id = id
        this.name = name
        this.school = school

    }
}