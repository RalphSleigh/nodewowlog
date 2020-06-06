import { useQuery } from '@apollo/client';

import React, {FC, useEffect, useState} from "react";
import {encounterName} from "./encounterName";
import {ENCOUNTERS_QUERY} from "../queries/encounters";
import {EncounterFieldsFragment, EncountersListQuery,} from "../queries/types";
import {IconButton, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks'


export const EncounterChooser: FC<{
    current: number;
    update: React.Dispatch<React.SetStateAction<number>>;
    setLive: React.Dispatch<React.SetStateAction<boolean>>;
// eslint-disable-next-line react/prop-types
}> = ({ current, update, setLive }) => {

    const { loading, error, data } = useQuery<EncountersListQuery>(ENCOUNTERS_QUERY, {
            pollInterval: 3000
    });
    const [chosen, setChosen] = useState(false)
    const menuState = usePopupState({ variant: 'popover', popupId: 'encounterCgooser' })

    useEffect(() => {
        const selected = data?.Encounters.find((e) => e.id === current) || data?.Encounters[data?.Encounters.length - 1] || undefined
        setLive(selected !== undefined && selected.status === 'IN_PROGRESS')
    },[data, current] )

    if (!data) {
        if (loading) return <>Loading</>
        return <>{`Error: ${error}`} </>
    }

    let selected: EncounterFieldsFragment | undefined

    if(chosen) {
        selected = data.Encounters.find((e) => e.id === current)
    } else {
        if(data.Encounters.length > 0) {
            selected = data.Encounters[data.Encounters.length - 1]
            if (selected?.id !== current)
                setImmediate(() => update(selected?.id || 0))
        }
    }

    const title = selected ? encounterName(selected) : "Encounter:"

    return  (<>
            <IconButton edge="start" color="inherit" aria-label="Menu" {...bindTrigger(menuState)}>
                <MenuIcon/>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableScrollLock={true}
                {...bindMenu(menuState)}
            >
                {data.Encounters.map((e: EncounterFieldsFragment) =>
                    e.id === current ?
                        <MenuItem key={e.id} onClick={(id => () => {
                            setChosen(true)
                            update(id)
                            menuState.close()
                        })(e.id)
                        }><b>{encounterName(e)}</b></MenuItem> :
                        <MenuItem key={e.id} onClick={(id => () => {
                            setChosen(true)
                            update(id)
                            menuState.close()
                        })(e.id)
                        }>{encounterName(e)}</MenuItem>)}
            </Menu>
            <Typography variant="h6" color="inherit" {...bindTrigger(menuState)}>
                {title}
            </Typography>
        </>)
}