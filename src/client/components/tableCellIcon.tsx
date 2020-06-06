import React, {FC} from "react";
import {CreatureFieldsFragment, Spell} from "../queries/types";
import {Box} from "@material-ui/core";

export const TableCellIcon: FC<{ creature: CreatureFieldsFragment; className?: string }> = ({creature, className}) => {

    switch (creature.__typename) {
        case "Player":
            if (creature.specClassInfo.specIconURL !== "") return <img src={`/icon?iconUrl=${creature.specClassInfo.specIconURL}`}
              className={className}
            />
            return null
        default:
            return null
    }
}

export const SpellTableCellIcon: FC<{ spell: Spell }> = ({spell}) => {

    if (spell.iconUrl !== "") return <img src={`/icon?iconUrl=${spell.iconUrl}`}
                                          className='tableIcon'
    />
    return null
}