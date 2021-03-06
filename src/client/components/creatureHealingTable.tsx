import React, {FC} from "react";
import {
    CreatureEventsFieldsFragment,
    EncounterFieldsFragment,
} from "../queries/types";
import {TableCellIcon} from "./tableCellIcon";
import {ClassColourName} from "./classColourName";
import {CreatureTableCellBar} from "./tableCellBar";
import {LongNumber, ShortNumber} from "./numberFormats";
import {HealingSubTableFunction, HealingTableRowData} from "./healingTableLoader";

export const CreatureHealingTable: FC<{
    encounter: EncounterFieldsFragment;
    data?: HealingTableRowData[];
    selectedCreature?: string;
    updateSelectedCreature?: React.Dispatch<React.SetStateAction<string>>;
    children?: HealingSubTableFunction[];
}> = ({encounter, data = [], selectedCreature, updateSelectedCreature, children = []}) => {

    const localRows = data.sort((a, b) => (b.total + b.absorb) - (a.total + a.absorb))
    const maxDamage = (localRows[0]?.total + localRows[0]?.absorb) || 0

    const BasicRow = basicRowProvider(maxDamage, encounter.duration)

    const rows = localRows.map((row, i) => {

        let {creaturesEvents = []} = row

        const first = creaturesEvents.shift() as CreatureEventsFieldsFragment
        creaturesEvents = creaturesEvents.sort((a, b) => (b.total + b.absorb) - (a.total + a.absorb))
        creaturesEvents.unshift(first)
        return selectedCreature === creaturesEvents[0].creature.guid ?
            <><BasicRow key={creaturesEvents[0].creature.guid} row={row}
                        extraClass={i % 2 === 0 ? 'damageTableEven' : 'damageTableOdd'}
                        onClickFunction={(): void => {
                            if (updateSelectedCreature) updateSelectedCreature("")
                        }}/>
                {children.map((c, i) => <div key={creaturesEvents[0].creature.guid + "open" + i} className="subTable">
                    {c(row)}
                </div>)}
            </>
            : <BasicRow key={creaturesEvents[0].creature.guid}
                        extraClass={i % 2 === 0 ? 'damageTableEven' : 'damageTableOdd'}
                        row={row}
                        onClickFunction={(): void => {
                            if (updateSelectedCreature) updateSelectedCreature(creaturesEvents[0].creature.guid)
                        }}/>
    })

    return <div className="damageTable creatureTable">
        <div style={{gridColumnStart: '2'}}><h1>Name</h1></div>
        <div style={{gridColumnEnd: 'span 2'}}><h1>Healing</h1></div>
        <div><h1>HPS</h1></div>
        {rows}
    </div>
}

type TableRowComponent = FC<{ row: HealingTableRowData; onClickFunction?: () => void; extraClass: string }>
type TableRowComponentProvider = (maxDamage: number, duration: number) => TableRowComponent

const basicRowProvider: TableRowComponentProvider = (maxDamage, duration) => ({row, onClickFunction, extraClass}) => {
    const {creaturesEvents = []} = row
    const firstCreature = creaturesEvents[0].creature
    const addNumber = !firstCreature.friendly && creaturesEvents.length > 1

    return <>
        <div onClick={onClickFunction} className={extraClass}>
            <TableCellIcon creature={firstCreature}/>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <p>
                <ClassColourName
                    creature={firstCreature}>{`${firstCreature.name}${addNumber ? ` (${creaturesEvents.length})` : firstCreature.seen > 0 ? ` #${firstCreature.seen + 1}` : ''}`}</ClassColourName>
            </p>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <CreatureTableCellBar max={maxDamage} creatures={creaturesEvents}/>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <p>
                <ShortNumber value={row.total + row.absorb}/>
            </p>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <p>
                <LongNumber value={(row.total + row.absorb) / duration}/>
            </p>
        </div>
    </>
}