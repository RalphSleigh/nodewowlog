import React, {FC} from "react";
import {SpellTableCellIcon } from "./tableCellIcon";
import {SpellTableCellBar} from "./tableCellBar";
import {ShortNumber} from "./numberFormats";
import {EncounterFieldsFragment } from "../queries/types";
import {TableRowData, SubTableFunction} from "./tableLoader";

export const SpellTable: FC<{
    encounter: EncounterFieldsFragment;
    data?: TableRowData[];
    selectedCreature?: string;
    updateSelectedCreature?: React.Dispatch<React.SetStateAction<string>>;
    children?: SubTableFunction[];
}> = ({data = [], selectedCreature, updateSelectedCreature, children = []}) => {

    const localRows = [...data].sort((a, b) => b.total - a.total)
    const maxDamage = localRows?.[0]?.total || 0

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
                    {c(row)}
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
        <div style={{gridColumnEnd: 'span 2'}}><h1>Damage</h1></div>
        {rows}
    </div>
}

/*
    <TableContainer component={Box}>
        <Table>
            <TableHead>
                <StripedTableRow>
                    <TableCell style={{width:'25%'}}>Spell</TableCell>
                    <TableCell>Damage</TableCell>
                    <TableCell style={{width: '5%'}}/>
                </StripedTableRow>
            </TableHead>
                <TableBody>
                {rows}
                </TableBody>
            </Table>
    </TableContainer>


 */

type TableRowComponent = FC<{ row: TableRowData; onClickFunction?: () => void; extraClass: string }>
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
                <ShortNumber value={row.total}/>
            </p>
        </div>
    </React.Fragment>

}
