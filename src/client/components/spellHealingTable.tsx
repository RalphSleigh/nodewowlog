import React, {FC} from "react";
import {SpellTableCellIcon } from "./tableCellIcon";
import {SpellTableCellBar} from "./tableCellBar";
import {ShortNumber} from "./numberFormats";
import {EncounterFieldsFragment } from "../queries/types";
import {HealingTableRowData, HealingSubTableFunction} from "./healingTableLoader";

export const SpellHealingTable: FC<{
    encounter: EncounterFieldsFragment;
    data?: HealingTableRowData[];
    selectedCreature?: string;
    updateSelectedCreature?: React.Dispatch<React.SetStateAction<string>>;
    children?: HealingSubTableFunction[];
}> = ({data = [], selectedCreature, updateSelectedCreature, children = []}) => {

    const localRows = [...data].sort((a, b) => (b.total + b.absorb) - (a.total + a.absorb))
    const maxDamage =  (localRows[0]?.total + localRows[0]?.absorb) || 0

    const BasicRow = basicRowProvider(maxDamage)

    const rows = localRows.map((row, i) => {

        const {spellsEvents = []} = row

        return selectedCreature === `${spellsEvents[0].spell.id}` ?
            <><BasicRow extraClass={i % 2 === 0 ? 'damageTableEven' : 'damageTableOdd'} key={spellsEvents[0].spell.id}
                        row={row}
                        onClickFunction={(): void => {
                            if (updateSelectedCreature) updateSelectedCreature("")
                        }}/>
                {children.map((c, i) => <div key={spellsEvents[0].spell.id + "open" + i} className="subTable">
                    {c(row as HealingTableRowData)}
                </div>)}
            </>
            :
            <BasicRow key={spellsEvents[0].spell.id} row={row}
                      extraClass={i % 2 === 0 ? 'damageTableEven' : 'damageTableOdd'}
                      onClickFunction={(): void => {
                          if (updateSelectedCreature) updateSelectedCreature(`${spellsEvents[0].spell.id}`)
                      }}/>
    })

    return <div className="damageTable spellTable">
        <div style={{gridColumnStart: '2'}}><h1>Spell</h1></div>
        <div style={{gridColumnEnd: 'span 2'}}><h1>Healing</h1></div>
        {rows}
    </div>
}

/*
    <TableContainer component={Box}>
        <Table>
            <TableHead>
                <StripedTableRow>
                    <TableCell style={{width:'25%'}}>Spell</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell style={{width: '5%'}}/>
                </StripedTableRow>
            </TableHead>
                <TableBody>
                {rows}
                </TableBody>
            </Table>
    </TableContainer>


 */

type TableRowComponent = FC<{ row: HealingTableRowData; onClickFunction?: () => void; extraClass: string }>
type TableRowComponentProvider = (maxDamage: number) => TableRowComponent

const basicRowProvider: TableRowComponentProvider = (maxDamage) => ({row, onClickFunction, extraClass}) => {
    const {spellsEvents = []} = row
    const firstSpell = spellsEvents[0].spell

    return <React.Fragment key={firstSpell.id}>
        <div onClick={onClickFunction} className={extraClass}>
            <SpellTableCellIcon spell={firstSpell}/>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <p>{firstSpell.name}</p>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <SpellTableCellBar max={maxDamage} spells={spellsEvents}/>
        </div>
        <div onClick={onClickFunction} className={extraClass}>
            <p>
                <ShortNumber value={row.total + row.absorb}/>
            </p>
        </div>
    </React.Fragment>

}
