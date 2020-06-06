import { LogObject } from "./logObject";
import { ICreature } from "./creature";
import { Field, ObjectType } from "type-graphql";
import { Encounter } from "./encounter";
import { CreatureFilter } from "./creatureFilters";
import {Aura} from "./aura";
import {Instant} from "./instant";

export enum AuraEventType {
    APPLIED,
    APPLIED_DOSE,
    REMOVED,
    REMOVED_DOSE,
}

@ObjectType({simpleResolvers: true})
export class AuraEvent extends LogObject {
    @Field()
    public readonly time: number;
    @Field()
    public readonly source: ICreature;
    @Field()
    public readonly target: ICreature;
    @Field()
    public readonly aura: Aura;
    @Field()
    public readonly stacks: number;
    @Field()
    public readonly amount: number;
    @Field()
    public readonly type: AuraEventType

    constructor(
        encounter: Encounter,
        time: number,
        source: ICreature,
        target: ICreature,
        aura: Aura,
        stacks: number,
        amount: number,
        type: AuraEventType
    ) {
        super(encounter);
        this.time = time;
        this.source = source;
        this.target = target;
        this.aura = aura;
        this.stacks = stacks;
        this.amount = amount;
        this.type = type;
    }

    @Field(type => Instant)
    instant(): Instant {
        return new Instant(this.encounter, this.time)
    }

    filterSource(filter: CreatureFilter): boolean {
        return filter(this.source);
    }

    filterTarget(filter: CreatureFilter): boolean {
        return filter(this.target);
    }
}
