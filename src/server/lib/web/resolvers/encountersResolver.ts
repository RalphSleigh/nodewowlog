import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Encounter } from "../../data/encounter";
import { LogFile } from "../../data/logFile";
import { ICreature} from "../../data/creature";
import { CreatureFilters } from "../../data/creatureFilters";
import {differenceInSeconds} from "date-fns";
import {FilteredEvents} from "../../data/genericSummableEvents";
import {IsString} from "class-validator";
import {Spell} from "../../data/spell";
import {AuraEvent} from "../../data/auraEvent";
import {FilteredAuraEvents} from "../../data/filteredAuraEvents";

@Resolver(Encounter)
export class EncounterResolver {
  constructor(private logFile: LogFile) {}

  @Query((returns) => [Encounter], {name: "Encounters"})
  encounters(@Arg("includeTrash") includeTrash: boolean): Encounter[] {
    const encounters = this.logFile.graphGetEncounters();
    return includeTrash ? encounters : encounters.filter((e) => e.isBoss());
  }

  @Query(() => Encounter, {name: "Encounter"})
  encounter(@Arg("id") id: number): Encounter | undefined {
    return this.logFile.graphGetEncounters().find((e) => e.id === id);
  }

  @FieldResolver(() => [ICreature])
  creatures(@Root() encounter: Encounter){
    return encounter.creatureManager.graphGetCreatures()
  }

  @FieldResolver(() => [Spell])
  spells(@Root() encounter: Encounter){
    return encounter.spellManager.graphGetSpells()
  }

  @FieldResolver(() => FilteredEvents)
  filteredEvents(@Root() encounter: Encounter): FilteredEvents {
    return encounter.graphFilteredEvents()
  }

  @FieldResolver(() => FilteredAuraEvents)
  filteredAuraEvents(@Root() encounter: Encounter): FilteredAuraEvents {
    return encounter.graphAuraEvents()
  }

  @FieldResolver()
  duration(
      @Root() encounter: Encounter,
  ): number {
      return differenceInSeconds(new Date(encounter.endTime()), new Date(encounter.startTime))
  }
}
