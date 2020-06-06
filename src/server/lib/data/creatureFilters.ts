import { registerEnumType } from "type-graphql";
import { Creature } from "./creature";
import { Player } from "./player";

type CreatureFilterWithCreature = (c: Creature) => boolean
type CreatureFilterWithoutCreature = () => boolean

export type CreatureFilter = CreatureFilterWithCreature | CreatureFilterWithoutCreature

export enum CreatureFilters {
  All,
  Players,
  Friendly,
  Hostile,
  Guid,
  Name,
  PlayersOnly,
}

registerEnumType(CreatureFilters, {
  name: "CreatureFilters", // this one is mandatory
});

export function getCreatureFilterFunction(
  filter: CreatureFilters = CreatureFilters.All,
  {name, guid}: {name?: string, guid?: string}
): CreatureFilter {
  return {
    [CreatureFilters.All]: (): boolean => true,
    [CreatureFilters.Players]: (c: Creature): boolean => c instanceof Player || c?.owner instanceof Player,
    [CreatureFilters.Friendly]: (c: Creature): boolean => c.friendly,
    [CreatureFilters.Hostile]: (c: Creature): boolean => !c.friendly,
    [CreatureFilters.Guid]: ((guid?: string) => (c: Creature): boolean => c.guid === guid)(guid),
    [CreatureFilters.Name]: ((name?: string) => (c: Creature): boolean => c.name === name)(name),
    [CreatureFilters.PlayersOnly]: (c: Creature): boolean => c instanceof Player,
  }[filter];
}
