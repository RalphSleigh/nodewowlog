import {FieldResolver, Resolver, Root} from "type-graphql";
import {Spell} from "../../data/spell";
import {BlizzardAPIWrapper} from "../../blizzardAPI/blizzardAPIWrapper";

@Resolver(Spell)
export class SpellResolver {
    constructor(protected blizzardAPI: BlizzardAPIWrapper) {
    }

    @FieldResolver(() => String)
    iconUrl(@Root() spell: Spell): string {
        return this.blizzardAPI.getSpellIconUrl(spell.id)
    }
}