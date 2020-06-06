import { LogObject } from "./logObject";
import { Field, ObjectType } from "type-graphql";
import { Encounter } from "./encounter";

@ObjectType({ simpleResolvers: true })
export class Spell extends LogObject {
  @Field()
  public id: number;
  @Field()
  readonly name: string;
  @Field()
  readonly school: number;
  constructor(encounter: Encounter, id: number, name: string, school: number) {
    super(encounter);
    this.id = id;
    this.name = name;
    this.school = school;
  }
}
