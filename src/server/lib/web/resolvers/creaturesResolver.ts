import {ICreature} from "../../data/creature";
import {Arg, ClassType, FieldResolver, Resolver, Root} from "type-graphql";
import {Event} from "../../data/event";
import {LogFile} from "../../data/logFile";
import {Player} from "../../data/player";
import {BlizzardAPIWrapper} from "../../blizzardAPI/blizzardAPIWrapper";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AbstractCreatureResolver(creatureType: ClassType): any {

    @Resolver(() => creatureType, {isAbstract: true})
    abstract class CreaturesResolverClass {
        constructor(private logFile: LogFile,
                    protected blizzardAPI: BlizzardAPIWrapper) {
        }

        /*
      @FieldResolver(() => [Event])
      damageDone(@Root() creature: ICreature): Event[] {
      return creature.encounter.damageManager.graphGetDamageDone(creature);
      }

         */
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return CreaturesResolverClass as any
}
