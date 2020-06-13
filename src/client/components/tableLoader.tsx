import React, {FC} from "react";
import {
    BySourceFieldsFragment, BySpellFieldsFragment, ByTargetFieldsFragment,
    CreatureEventsFieldsFragment, CreatureFieldsFragment,
    DamageTableQuery,
    DamageTableQueryVariables,
    SpellEventsFieldsFragment
} from "../queries/types";
import {GroupBy} from "./encounterView";
import {useQuery} from "@apollo/client";
import {DAMAGE_TABLE_QUERY} from "../queries/damageTable";
import {CreatureTable} from "./creatureTable";
import {SpellTable} from "./spellTable";
import {Box} from "@material-ui/core";

export interface TableRowData {
    creaturesEvents?: CreatureEventsFieldsFragment[];
    spellsEvents?: SpellEventsFieldsFragment[];
    bySource?: CreatureEventsFieldsFragment[];
    byTarget?: CreatureEventsFieldsFragment[];
    bySpell?: SpellEventsFieldsFragment[];
    total: number;
}

export type SubTableFunction = (row: TableRowData) => React.ReactElement

export type EventsSource =
    BySourceFieldsFragment
    | BySpellFieldsFragment
    | ByTargetFieldsFragment
    | CreatureEventsFieldsFragment
    | SpellEventsFieldsFragment

export const TableLoader: FC<{
    encounterId: number;
    selectedCreature: string;
    updateSelectedCreature: React.Dispatch<React.SetStateAction<string>>;
    filter: Partial<DamageTableQueryVariables>;
    mergeCreatures: boolean;
    groupBy: GroupBy;
    live: boolean
}> = ({encounterId, selectedCreature, updateSelectedCreature, filter, mergeCreatures, groupBy, live}) => {
    const variables = {
        id: encounterId, ...filter,
        bySource: groupBy === GroupBy.Source,
        byTarget: groupBy === GroupBy.Target,
        bySpell: groupBy === GroupBy.Spell
    }
    const {loading, error, data} = useQuery<DamageTableQuery, DamageTableQueryVariables>(DAMAGE_TABLE_QUERY, {
        variables: variables,
        pollInterval: live ? 1000 : 0
    });

    if (loading) return <>Loading</>
    if (!data) {
        return <>{`Error: ${error}`} </>
    }

    let rows: TableRowData[]
    let children: SubTableFunction[] = []

    const graphData = data.Encounter.filteredEvents.filterDamage.filterSource.filterTarget

    if (groupBy === GroupBy.Source) {
        if (mergeCreatures) {
            rows = combineBySource(graphData.bySource)
            children = [
                (row) => <CreatureTable
                        key="target"
                        encounter={data.Encounter}
                        data={row.byTarget ? combineByTarget(row.byTarget) : undefined}/>,
                (row) => <SpellTable
                        encounter={data.Encounter}
                        key="spells"
                        data={row.bySpell ? combineBySpell(row.bySpell) : undefined}/>]
        } else {
            rows = graphData.bySource.map(noMergingMap)
            children = [
                (row) => <CreatureTable
                        key="target"
                        encounter={data.Encounter}
                        data={row.byTarget?.map(noMergingMap)}/>,
                (row) => <SpellTable
                    encounter={data.Encounter}
                    key="spells"
                    data={row.bySpell?.map(noMergingMap)}/>]
        }

        return <CreatureTable data={rows}
                              encounter={data.Encounter}
                              selectedCreature={selectedCreature}
                              updateSelectedCreature={updateSelectedCreature}
        >{children}</CreatureTable>
    } else if (groupBy === GroupBy.Target) {
        if (mergeCreatures) {
            rows = combineByTarget(graphData.byTarget)
            children = [
                (row) => <CreatureTable
                            key="source"
                            encounter={data.Encounter}
                            data={row.bySource ? combineBySource(row.bySource) : undefined}/>
                ,
                (row) => <SpellTable
                            encounter={data.Encounter}
                            key="spells"
                            data={row.bySpell ? combineBySpell(row.bySpell) : undefined}/>]
        } else {
            rows = graphData.byTarget.map(noMergingMap)
            children = [
                (row) => <CreatureTable
                    key="source"
                    encounter={data.Encounter}
                    data={row.bySource?.map(noMergingMap)}/>,
                (row) => <SpellTable
                    encounter={data.Encounter}
                    key="spells"
                    data={row.bySpell?.map(noMergingMap)}/>]
        }

        return <CreatureTable data={rows}
                              encounter={data.Encounter}
                              selectedCreature={selectedCreature}
                              updateSelectedCreature={updateSelectedCreature}
        >{children}</CreatureTable>
    } else {
        if (mergeCreatures) {
            rows = combineBySpell(graphData.bySpell)
            children = [
                (row) =>
                    <CreatureTable
                        key="source"
                        encounter={data.Encounter}
                        data={row.bySource ? combineBySource(row.bySource) : undefined}/>
                ,
                (row) =>
                    <CreatureTable
                        key="target"
                        encounter={data.Encounter}
                        data={row.byTarget ? combineByTarget(row.byTarget) : undefined}/>]
        } else {
            rows = graphData.bySpell.map(noMergingMap)
            children = [
                (row) =>
                    <CreatureTable
                    key="source"
                    encounter={data.Encounter}
                    data={row.bySource?.map(noMergingMap)}/>,
                (row) => <CreatureTable
                    key="target"
                    encounter={data.Encounter}
                    data={row.byTarget?.map(noMergingMap)}/>]
        }

        return <SpellTable data={rows}
                           encounter={data.Encounter}
                           selectedCreature={selectedCreature}
                           updateSelectedCreature={updateSelectedCreature}
        >{children}</SpellTable>
    }
}

function noMergingMap(source: EventsSource): TableRowData {
    const result: TableRowData = {total: source.total}
    if ("creature" in source) {
        result.creaturesEvents = [source]
    }
    if ("spell" in source) {
        result.spellsEvents = [source]
    }
    if ("bySource" in source) {
        result.bySource = source.bySource
    }
    if ("byTarget" in source) {
        result.byTarget = source.byTarget
    }
    if ("bySpell" in source) {
        result.bySpell = source.bySpell
    }
    return result
}

function addSourceCreatureToRow(row: TableRowData, creatureEvents: BySourceFieldsFragment | CreatureEventsFieldsFragment): void {
    row.total += creatureEvents.total
    row?.creaturesEvents?.push({...creatureEvents})
    if ("byTarget" in creatureEvents) {
        row.bySpell = [...(row.bySpell || []), ...creatureEvents.bySpell.map(t => ({...t}))]
        row.byTarget = [...(row.byTarget || []), ...creatureEvents.byTarget.map(t => ({...t}))]
    }
}

function mergeCreatureIntoRow(row: TableRowData, creatureEvents: BySourceFieldsFragment | CreatureEventsFieldsFragment): void {
    row.total += creatureEvents.total
    const existing = row.creaturesEvents?.find(c => c.creature.name === creatureEvents.creature.name)
    if (existing) {
        existing.total += creatureEvents.total
        existing.count += creatureEvents.count
    } else {
        row.creaturesEvents?.push({...creatureEvents});
    }
    if ("byTarget" in creatureEvents) {
        row.bySpell = [...(row.bySpell || []), ...creatureEvents.bySpell]
        row.byTarget = creatureEvents.byTarget.reduce((a, c) => {
            const existing = a.find(e => e.creature.guid === c.creature.guid)
            if (existing) {
                existing.total += c.total
                existing.count += c.count
            } else {
                a.push({...c})
            }
            return a;
        }, row.byTarget || [])
    }
}

function newSourceCreatureRow(creatureEvents: BySourceFieldsFragment | CreatureEventsFieldsFragment): TableRowData {
    const result: TableRowData = {
        total: creatureEvents.total,
        creaturesEvents: [{...creatureEvents}]
    }
    if ("byTarget" in creatureEvents) {
        result.byTarget = creatureEvents.byTarget.map(t => ({...t}))
    }
    if ("bySpell" in creatureEvents) {
        result.bySpell = creatureEvents.bySpell.map(t => ({...t}))
    }

    return result
}

function addTargetCreatureToRow(row: TableRowData, creatureEvents: ByTargetFieldsFragment | CreatureEventsFieldsFragment): void {
    row.total += creatureEvents.total

    const creatureEvent = row.creaturesEvents?.find(cE => cE.creature === creatureEvents.creature)
    if (creatureEvent) {
        creatureEvent.total += creatureEvents.total
        creatureEvent.count += creatureEvents.count
    } else {
        row.creaturesEvents?.push({...creatureEvents})
    }


    if ("bySource" in creatureEvents) {
        row.bySpell = [...(row.bySpell || []), ...creatureEvents.bySpell]
        row.bySource = [...(row.bySource || []), ...creatureEvents.bySource]
    }
}

function newTargetCreatureRow(creatureEvents: ByTargetFieldsFragment | CreatureEventsFieldsFragment): TableRowData {
    const result: TableRowData = {
        total: creatureEvents.total,
        creaturesEvents: [{...creatureEvents}]
    }
    if ("bySource" in creatureEvents) {
        result.bySource = creatureEvents.bySource
    }
    if ("bySpell" in creatureEvents) {
        result.bySpell = creatureEvents.bySpell
    }

    return result
}

function combineBySource(sources: (BySourceFieldsFragment | CreatureEventsFieldsFragment)[]): TableRowData[] {
    const results: TableRowData[] = []

    return [...sources].reduce((a: TableRowData[], c: (BySourceFieldsFragment | CreatureEventsFieldsFragment)) => {
        if (c.creature.owner) {
            const existing = a.find(row => row.creaturesEvents?.[0].creature.guid === c.creature.owner?.guid)
            if (existing) {
                mergeCreatureIntoRow(existing, c)
            } else {
                const owner = sources.find(s => s.creature.guid === c.creature.owner?.guid)
                if (owner) {
                    const ownerLine = newSourceCreatureRow(owner as BySourceFieldsFragment)
                    mergeCreatureIntoRow(ownerLine, c)
                    a.push(ownerLine)
                } else {
                    const existing = a.find(row => row.creaturesEvents?.[0].creature.name === c.creature.name)
                    if (existing) {
                        addSourceCreatureToRow(existing, c)
                    } else {
                        a.push(newSourceCreatureRow(c))
                    }
                }
            }
        } else {
            const existing = a.find(row => row.creaturesEvents?.[0].creature.name === c.creature.name)
            if (existing && existing.creaturesEvents?.[0].creature.guid === c.creature.guid) {
                return a
            } else if (existing) {
                addSourceCreatureToRow(existing, c)
            } else {
                a.push(newSourceCreatureRow(c))
            }
        }
        return a
    }, results)
}

function combineByTarget(targets: (ByTargetFieldsFragment | CreatureEventsFieldsFragment)[]): TableRowData[] {
    const results: TableRowData[] = []

    return [...targets].reduce((a: TableRowData[], c: (BySourceFieldsFragment | CreatureEventsFieldsFragment)) => {
        const existing = a.find(row => row.creaturesEvents?.[0].creature.name === c.creature.name)
        if (existing) {
            addTargetCreatureToRow(existing, c)
        } else {
            a.push(newTargetCreatureRow(c))
        }
        return a
    }, results)
}

function addSpellEventToRow(row: TableRowData, spellEvents: BySpellFieldsFragment | SpellEventsFieldsFragment): void {
    row.total += spellEvents.total
    row?.spellsEvents?.push({...spellEvents})
    if ("bySource" in spellEvents) {
        row.bySource = [...(row.bySource || []), ...spellEvents.bySource]
        row.byTarget = [...(row.byTarget || []), ...spellEvents.byTarget]
    }
}

function newSpellEventRow(spellEvents: BySpellFieldsFragment | SpellEventsFieldsFragment): TableRowData {
    const result: TableRowData = {
        total: spellEvents.total,
        spellsEvents: [{...spellEvents}]
    }
    if ("bySource" in spellEvents) {
        result.bySource = spellEvents.bySource
    }
    if ("byTarget" in spellEvents) {
        result.byTarget = spellEvents.byTarget
    }

    return result
}

function combineBySpell(targets: (BySpellFieldsFragment | SpellEventsFieldsFragment)[]): TableRowData[] {
    const results: TableRowData[] = []

    return [...targets].reduce((a: TableRowData[], s: (BySpellFieldsFragment | SpellEventsFieldsFragment)) => {
        const existing = a.find(row => row.spellsEvents?.[0].spell.name === s.spell.name)
        if (existing) {
            addSpellEventToRow(existing, s)
        } else {
            a.push(newSpellEventRow(s))
        }
        return a
    }, results)
}

