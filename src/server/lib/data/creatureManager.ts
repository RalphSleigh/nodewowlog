import {LogObject} from "./logObject";
import {Player} from "./player";
import {Creature, ICreature} from "./creature";
import {Fields, LogFields} from "../parsers/logFields";
import {registerEnumType} from "type-graphql";
import {Encounter} from "./encounter";
import {CreatureFilters} from "./creatureFilters";
import {Container} from "typedi";
import {LogFile} from "./logFile";

export class CreatureManager {
    private creatures: Map<string, Creature>;
    private playerInfo: Map<string, Partial<Player>>;
    private encounter: Encounter;

    constructor(encounter: Encounter) {
        this.encounter = encounter;
        this.creatures = new Map<string, ICreature>();
        this.playerInfo = new Map<string, Partial<Player>>();
    }

    getCreature(guid: string, name: string, friendly: boolean): Creature {
        let creature: Creature;
        if (this.creatures.has(guid)) {
            creature = this.creatures.get(guid) as Creature;
        } else {
            const creatureClass = CreatureManager.creatureType(guid);
            creature = new creatureClass(this.encounter, guid, name, friendly, this.numberSeen(name));

            if (this.playerInfo.has(guid))
                creature.update(this.playerInfo.get(guid) as Partial<Player>);

            this.creatures.set(guid, creature);
        }

        //Flip this if a friendly creature goes hostile
        if(creature.friendly && !friendly) creature.friendly = false

        return creature;
    }

    graphGetCreatures(): ICreature[] {
        return [...this.creatures.values()]
    }

    fromFields(fields: LogFields, index: number): Creature {
        const guid = fields.parseString(index);
        const name = fields.parseString(index + 1);
        const friendly = (fields.parseNumber(index + 2) & 0x40) === 0

        return this.getCreature(guid, name, friendly);
    }

    fromGuid(guid: string): ICreature | undefined {
        if (this.creatures.has(guid)) {
            return this.creatures.get(guid);
        }
    }

    savePlayerInfo(guid: string, info: Partial<Player>) {
        this.playerInfo.set(guid, info);
    }

    numberSeen(name: string): number {
        return [...this.creatures.values()].filter(c => c.name === name).length
    }

    static creatureType(
        guid: string
    ): new (encounter: Encounter, guid: string, name: string, friendly: boolean, seen: number) => Creature {
        if (guid.startsWith("Player")) return Player;
        return Creature;
    }
}
