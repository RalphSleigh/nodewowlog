/*
import React, {FC, useEffect, useState} from "react";
import {Card, Row, Table} from "react-bootstrap";
import {gql, useQuery} from "@apollo/client";
import {LongNumber, ShortNumber} from "./numberFormats";
import {CreatureTableCellBar} from "./tableCellBar";
import {TableCellIcon} from "./tableCellIcon";
import {ClassColourName} from "./classColourName";
import {SpellTable} from "./spellTable";
import {DAMAGE_TABLE_QUERY} from "../queries/damageTable";
import {
    CreatureEvents, CreatureEventsFieldsFragment,
    CreatureFieldsFragment,
    DamageTableQuery,
    DamageTableQueryVariables,
    EncounterFilteredEventsArgs,
    SpellEventsFieldsFragment,
} from "../queries/types";



export interface CombinedCreatureFragment {
    creatures: [CreatureEventsFieldsFragment];
    byTarget: [CreatureEventsFieldsFragment];
    bySpell: [SpellEventsFieldsFragment]
    total: number;
}
// eslint-disable-next-line react/prop-types
export const DamageTable: FC<{ encounterId: number;
                                selectedCreature: string;
                                updateSelectedCreature: React.Dispatch<React.SetStateAction<string>>;
                                filter: EncounterFilteredEventsArgs;
                                groupCreatures: boolean;
}> = ({encounterId, selectedCreature, updateSelectedCreature, filter, groupCreatures}) => {

    const variables = {id: encounterId, ...filter}
    const {loading, error, staticData} = useQuery<DamageTableQuery, DamageTableQueryVariables>(DAMAGE_TABLE_QUERY, {variables: variables});

    if (loading) return <>Loading</>
    if (!staticData) {
        return <>{`Error: ${error}`} </>
    }

    let localRows: CombinedCreatureFragment[] = []

    if(groupCreatures) {

    //} else {
     //   localRows = [...staticData.Encounter.filteredEvents.bySource].sort((a, b) => b.total - a.total)
     //       .map(c => ({creatures: [c], total: c.total, byTarget = }))
//
    //}

    const maxDamage = localRows[0]?.total || 0
    const BasicRow = basicRowProvider(maxDamage, staticData.Encounter.duration, updateSelectedCreature)
    const ExpandedRow = expandedRowProvider(maxDamage, staticData.Encounter.duration, updateSelectedCreature)

    const rows = localRows.map(({creature, total, bySpell}) => {
        return selectedCreature === creature.guid ? <ExpandedRow key={creature.guid} creature={creature} spells={bySpell} total={total} /> : <BasicRow key={creature.guid} creature={creature} total={total} />
    })

    return <Row>
        <Table size="sm" striped={true}>
            <thead>
            <tr>
                <th>Name</th>
                <th colSpan={2}>Damage</th>
                <th>DPS</th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </Table>
    </Row>
}

interface TableRowProps {
    creature: CreatureFieldsFragment;
    total: number;
}

type TableRowComponent = FC<TableRowProps>
type TableRowComponentProvider = (maxDamage: number, duration: number, updateOpenRowId: React.Dispatch<React.SetStateAction<string>>) => TableRowComponent

const basicRowProvider: TableRowComponentProvider = (maxDamage, duration, updateOpenRowId) => ({creature, total}) => {
    return <tr onClick={(): void => updateOpenRowId(creature.guid)}>
        <td style={{width:'25%'}}>
            <TableCellIcon creature={creature} />
            <ClassColourName creature={creature}>{creature.name}</ClassColourName>
        </td>
        <td>
            <CreatureTableCellBar value={total} max={maxDamage} creature={creature}/>
        </td>
        <td style={{width:'5%'}}>
            <ShortNumber value={total} />
        </td>
        <td style={{width:'5%'}}>
            <LongNumber value={total/duration} />
        </td>
    </tr>
}

interface ExpandedTableRowProps {
    creature: CreatureFieldsFragment;
    spells: SpellEventsFieldsFragment[];
    total: number;
}

type ExpandedTableRowComponent = FC<ExpandedTableRowProps>
type ExpandedTableRowComponentProvider = (maxDamage: number, duration: number, updateOpenRowId: React.Dispatch<React.SetStateAction<string>>) => ExpandedTableRowComponent


const expandedRowProvider: ExpandedTableRowComponentProvider = (maxDamage, duration, updateOpenRowId) => ({creature, spells, total}) => {
    return <>
    <tr onClick={(): void => updateOpenRowId("")}>
        <td style={{width:'25%'}}>
            <TableCellIcon creature={creature} />
            <ClassColourName creature={creature}>{creature.name}</ClassColourName>
        </td>
        <td>
            <CreatureTableCellBar value={total} max={maxDamage} creature={creature}/>
        </td>
        <td style={{width:'5%'}}>
            <ShortNumber value={total} />
        </td>
        <td style={{width:'5%'}}>
            <LongNumber value={total/duration} />
        </td>
    </tr>
     <tr>
         <td colSpan={4}>
             <Card>
                 <Card.Body>
                     <SpellTable spells={spells} total={total}/>
                 </Card.Body>
             </Card>
         </td>
     </tr>
    </>
}

 */