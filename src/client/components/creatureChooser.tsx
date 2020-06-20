import React, {FC, ReactElement, useState} from "react";
import {CreatureFieldsFragment, CreatureFilters} from "../queries/types";
import {ClassColourName} from "./classColourName";
import {FilterSet, FilterSetState} from "./damageTableView";
import {useTimeoutState} from "../util";
import {
    usePopupState,
    bindToggle,
    bindPopper
} from 'material-ui-popup-state/hooks'
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, Paper, Popper} from "@material-ui/core";

export const CreatureChooser: FC<{
    titlePrefix: string;
    creatures: CreatureFieldsFragment[];
    filterSetState: FilterSetState;
}>
    = ({titlePrefix, creatures, filterSetState}) => {

    const [primaryCreature, updatePrimaryCreature, cancelPrimaryCreature] = useTimeoutState<string>("", 300)
    const popupState = usePopupState({variant: 'popper', popupId: `${titlePrefix}-popper`})

    const getTitleSuffix: () => string = () => {
        switch (filterSetState.type) {
            case CreatureFilters.All:
                return "All"
            case CreatureFilters.Players:
                return "Players"
            case CreatureFilters.Friendly:
                return "Friendlies"
            case CreatureFilters.Hostile:
                return "Hostiles"
            case CreatureFilters.Guid:
                const c = creatures.find(c => c.guid === filterSetState.guid) as CreatureFieldsFragment
                return `${c.name}${c.seen > 0 ? ` (${c.seen + 1})` : ''}`
            case CreatureFilters.Name:
                return `${filterSetState.name}`
        }
        return ""
    }
    const title = `${titlePrefix}: ${getTitleSuffix()}`

    const clickHandler = (filter: FilterSet) => () => {
        popupState.close()
        filterSetState.update(filter)
    }

    const items = getPrimaryCreatureItems(creatures,
        clickHandler,
        updatePrimaryCreature,
        cancelPrimaryCreature)

    const secondaryItems = getSecondaryCreatureItems(primaryCreature, creatures, clickHandler)


    return <>
        <Box my={2}>
            <Button variant="outlined" {...bindToggle(popupState)}>
                {title}
            </Button>
        </Box>

        <Popper {...bindPopper(popupState)} placement="bottom-start" style={{width: "600px"}}>
            <Paper>
                <Grid container spacing={3}>
                    <Grid item sm={6}>
                        <List dense>
                            <ListItem button key="all"
                                      onClick={clickHandler({type: CreatureFilters.All})}>
                                <ListItemText disableTypography={true} style={{margin: "0px"}}>All</ListItemText>
                            </ListItem>
                            <ListItem button key="players"
                                      onClick={clickHandler({type: CreatureFilters.Players})}><ListItemText
                                disableTypography={true} style={{margin: "0px"}}>Players</ListItemText></ListItem>
                            <ListItem button key="friendlies"
                                      onClick={clickHandler({type: CreatureFilters.Friendly})}><ListItemText
                                disableTypography={true} style={{margin: "0px"}}>Friendlies</ListItemText></ListItem>
                            <ListItem button key="hostiles"
                                      onClick={clickHandler({type: CreatureFilters.Hostile})}><ListItemText
                                disableTypography={true} style={{margin: "0px"}}>Hostiles</ListItemText></ListItem>
                            <Divider key="primaryDivider"/>
                            {items}
                        </List>
                    </Grid>
                    <Grid item sm={6}>
                        <List dense>
                            {secondaryItems}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Popper>

    </>
}

function getPrimaryCreatureItems(creatures: CreatureFieldsFragment[],
                                 clickHandler: (filter: FilterSet) => () => void,
                                 updatePrimaryCreature: (guid: string) => void,
                                 cancelUpdate: () => void): ReactElement[] {

    const players = creatures.filter(c => c.__typename === "Player").map(c =>
        <ListItem
            button
            key={c.guid}
            onClick={clickHandler({type: CreatureFilters.Guid, guid: c.guid})}
            onMouseEnter={(): void => updatePrimaryCreature(c.guid)}
            onMouseLeave={(): void => cancelUpdate()}>
            <ListItemText disableTypography={true} style={{margin: "0px"}}>
                <ClassColourName creature={c}>{c.name}</ClassColourName>
            </ListItemText>
        </ListItem>)

    //const counts: {[key: string]: number} = {}

    const hostiles = Array.from(creatures.filter(c => !c.friendly).reduce((a, c: CreatureFieldsFragment) => {
        if (a.has(c.name)) return a.set(c.name, a.get(c.name) as number + 1)
        return a.set(c.name, 1)
    }, new Map<string, number>()), ([key, value]) => {
        return <ListItem
            button
            key={key}
            onClick={clickHandler({type: CreatureFilters.Name, name: key})}
            onMouseEnter={(): void => updatePrimaryCreature(key)}
            onMouseLeave={(): void => cancelUpdate()}>
            <ListItemText disableTypography={true} style={{margin: "0px"}}>
                {`${key}${value > 1 ? ` (${value})` : ''}`}
            </ListItemText>
        </ListItem>
    })


    return [...players, <Divider key="divider"/>, ...hostiles]
}

function getSecondaryCreatureItems(primaryGuid: string,
                                   creatures: CreatureFieldsFragment[],
                                   clickHandler: (filter: FilterSet) => () => void): ReactElement[] {
    if (primaryGuid.startsWith('Player')) {

        return Array.from(creatures.filter(c => c.owner?.guid === primaryGuid).reduce((a, c: CreatureFieldsFragment) => {
            if (a.has(c.name)) return a.set(c.name, a.get(c.name) as number + 1)
            return a.set(c.name, 1)
        }, new Map<string, number>()), ([key, value]) => {
            return <ListItem
                button
                key={key}
                onClick={clickHandler({type: CreatureFilters.Name, name: key})}>
                <ListItemText disableTypography={true} style={{margin: "0px"}}>
                    {`${key}${value > 1 ? ` (${value})` : ''}`}
                </ListItemText>
            </ListItem>
        })

    }

    return creatures.filter(c => c.name === primaryGuid).map(c => {
        return <ListItem
            button
            key={c.guid}
            onClick={clickHandler({type: CreatureFilters.Guid, guid: c.guid})}>
            <ListItemText disableTypography={true} style={{margin: "0px"}}>
                {`${c.name}${c.seen > 0 ? ` (${c.seen + 1})` : ''}`}
            </ListItemText>
        </ListItem>
    })
}