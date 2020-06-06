import {FieldResolver, Resolver, Root} from "type-graphql";
import {Player, SpecClassInfo} from "../../data/player";
import {AbstractCreatureResolver} from "./creaturesResolver";

@Resolver(() => Player)
export class PlayersResolver extends AbstractCreatureResolver(Player) {

    @FieldResolver(() => SpecClassInfo)
    specClassInfo(@Root() player: Player): SpecClassInfo {
        return this.blizzardAPI.getSpecInfo(player.spec as number)
    }
}
