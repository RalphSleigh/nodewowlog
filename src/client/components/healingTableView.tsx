import React, { FC, useEffect, useState} from "react";
import {DamageGraph} from "./damageGraph";
import {useQuery} from "@apollo/client";
import {
    CreatureFilters, DamageTableQueryVariables,
    EncounterInfoQuery,
    EncounterInfoQueryVariables, FilteredEventsFilterSourceArgs
} from "../queries/types";
import {ENCOUNTER_INFO} from "../queries/encounter";
import {CreatureChooser} from "./creatureChooser";
import {DamageTableLoader} from "./damageTableLoader";
import {Box, Button, ButtonGroup, Grid, Paper} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {HealingTableLoader} from "./healingTableLoader";

export interface FilterSet {
    type: FilteredEventsFilterSourceArgs["filter"];
    guid?: FilteredEventsFilterSourceArgs["guid"];
    name?: FilteredEventsFilterSourceArgs["name"];
}

export interface FilterSetState extends FilterSet {
    update: ({type, guid, name}: FilterSet) => void;
}

function useEventsFilter(): { source: FilterSetState; target: FilterSetState; eventFilter: Partial<DamageTableQueryVariables> } {
    const [eventFilter, updateEventFilter] = useState<Partial<DamageTableQueryVariables>>({
        source: CreatureFilters.Players,
        target: CreatureFilters.Players
    })

    return {
        eventFilter: eventFilter,
        source: {
            type: eventFilter.source,
            guid: eventFilter.sourceGuid,
            name: eventFilter.sourceName,
            update: ({type, guid, name}): void => updateEventFilter(state => ({
                ...state,
                source: type,
                sourceGuid: guid,
                sourceName: name
            }))
        },
        target: {
            type: eventFilter.target,
            guid: eventFilter.targetGuid,
            name: eventFilter.targetName,
            update: ({type, guid, name}): void => updateEventFilter(state => ({
                ...state,
                target: type,
                targetGuid: guid,
                targetName: name
            }))
        }
    }
}

export enum GroupBy {
    Source,
    Target,
    Spell
}

export const HealingTableView: FC<{ encounterId: number; live: boolean }> = ({encounterId, live}) => {

    const {loading, error, data} = useQuery<EncounterInfoQuery, EncounterInfoQueryVariables>(ENCOUNTER_INFO, {
        variables: {id: encounterId},
        pollInterval: live ? 1000 : 0
    });
    const [selectedCreature, updateSelectedCreature] = useState("")
    const {eventFilter, source, target} = useEventsFilter()
    const [groupBy, updateGroupBy] = useState<GroupBy>(GroupBy.Source)
    const [merge, updateMerge] = useState<boolean>(true)

    useEffect(() => {
        updateSelectedCreature("");
        source.update({type: CreatureFilters.Players})
        target.update({type: CreatureFilters.Players})
        updateGroupBy(GroupBy.Source)
        updateMerge(true)
    }, [encounterId]);

    if (loading) return <>Loading</>
    if (!data) {
        return <>{`Error: ${error}`} </>
    }

    return <Grid container spacing={3}>
        <Grid item>
            <CreatureChooser titlePrefix="Source" creatures={data.Encounter.creatures}
                             filterSetState={source}/>
        </Grid>
        <Grid item>
            <CreatureChooser titlePrefix="Target" creatures={data.Encounter.creatures}
                             filterSetState={target}/>
        </Grid>
        <Grid item>
            <Box my={2}>
                <ToggleButtonGroup
                    size="small"
                    exclusive={true}
                    value={groupBy}
                    onChange={(e: React.MouseEvent<HTMLElement>, v: GroupBy) => {if(v !== null)updateGroupBy(v)}}>
                    <ToggleButton value={GroupBy.Source}>Source</ToggleButton>
                    <ToggleButton value={GroupBy.Target}>Target</ToggleButton>
                    <ToggleButton value={GroupBy.Spell}>Spell</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Grid>
        <Grid item>
            <Box my={2}>
                <ToggleButtonGroup
                    size="small"
                    value={merge ? 'merge' : 'nomerge'}
                    onChange={(e: React.MouseEvent<HTMLElement>, v: boolean) => updateMerge(!merge)}>
                    <ToggleButton value={'merge'}>Merge Units</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Grid>
        <Grid item sm={12}>
            <HealingTableLoader encounterId={encounterId}
                                    selectedCreature={selectedCreature}
                                    updateSelectedCreature={updateSelectedCreature}
                                    filter={eventFilter}
                                    mergeCreatures={merge}
                                    groupBy={groupBy}
                                    live={live}
            />
        </Grid>
    </Grid>
}



