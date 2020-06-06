import React, {FC} from "react";
import {
    EncounterFieldsFragment,
    PlayerRoles,
    WraithionReportCardQuery,
    WraithionReportCardQueryVariables,
    CreatureEventsFieldsFragment,
    FilteredCreatureAuraEvents,
    AuraByCreatureFieldsFragment,
    LocationFieldsFragment,
    CreatureInstantFieldsFragment, AuraEvent, AuraEventWithInstantFieldsFragment
} from "../../queries/types";
import {useQuery} from "@apollo/client";
import {WRATHION_REPORT_CARD_QUERY} from "../../queries/wrathionReportCard";
import {
    Box,
    Grid,
    Paper, Popover, Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {ClassColourName} from "../classColourName";
import {makeStyles} from "@material-ui/core/styles";
import {TableCellIcon} from "../tableCellIcon";
import {MsDisplay} from "../numberFormats";
import {bindHover, bindPopover, bindPopper, bindToggle, usePopupState} from "material-ui-popup-state/hooks";
import {PositionOverlay} from "../postionOverlay";

const useStyles = makeStyles(theme => ({
    tableContainer: {
        padding: theme.spacing(2),
    },
    tableIcon: {
        width: '20px',
        marginBottom: '-5px',
        marginRight: '4px'
    },
    tableCell: {
        verticalAlign: 'top'
    }
}));

function distanceSquare(l1: LocationFieldsFragment, l2: LocationFieldsFragment): number {
    return (l2.x - l1.x)**2 + (l2.y - l1.y)**2
}

const IncinerationTableRow: FC<{ f: AuraEventWithInstantFieldsFragment; players: CreatureInstantFieldsFragment[]}> = ({f, players}) => {
    const classes = useStyles();
    const popupState =  usePopupState({
        variant: 'popover',
        popupId: `${f.time}-incineration-popper`})
    
    return (<><TableRow key={f.time} {...bindHover(popupState)}>
        <TableCell className={classes.tableCell}>
            <MsDisplay value={f.time} />
        </TableCell>
        <TableCell className={classes.tableCell}>
            <TableCellIcon creature={f.target} className={classes.tableIcon}/>
            <ClassColourName creature={f.target}>
                {f.target.name}
            </ClassColourName>
        </TableCell>
        <TableCell>
            {players.map(p => <>
                <ClassColourName creature={p.creature}>
                    {p.creature.name}
                </ClassColourName><br />
            </>)}
        </TableCell>
    </TableRow>
        <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            disableRestoreFocus
        >
        <PositionOverlay creatureInstants={f.instant.creatures} selected={f.target.guid} />
    </Popover>
    </>)
}

export const WrathionReportCard: FC<{ encounter: EncounterFieldsFragment; live: boolean }> = ({encounter, live}) => {
    const {loading, error, data} = useQuery<WraithionReportCardQuery, WraithionReportCardQueryVariables>(WRATHION_REPORT_CARD_QUERY, {
        variables: {id: encounter.id},
        fetchPolicy: 'no-cache'
        //pollInterval: live ? 1000 : 0
    });

    const classes = useStyles();

    if (loading) return <>Loading</>
    if (!data) {
        return <>{`Error: ${error}`} </>
    }

    const breathFails = data.Encounter?.breath.filterAuraID.filterApplied.byTarget.filter((t: AuraByCreatureFieldsFragment) => t.creature.__typename === "Player" && t.creature.specClassInfo.role !== PlayerRoles.Tank)
    const breathLines = breathFails
        .sort((a, b) => b.count - a.count)
        .map((f: AuraByCreatureFieldsFragment) => (<TableRow key={f.creature.guid}>
        <TableCell>
            <TableCellIcon creature={f.creature} className={classes.tableIcon}/>
            <ClassColourName creature={f.creature}>
                {f.creature.name}
            </ClassColourName>
        </TableCell>
        <TableCell>
            {f.count}
        </TableCell>
    </TableRow>))


    const tailLines = data.Encounter?.tail.filterSpell.byTarget
        .sort((a, b) => b.count - a.count)
        .map(f => <TableRow key={f.creature.guid}>
            <TableCell>
                <TableCellIcon creature={f.creature} className={classes.tableIcon}/>
                <ClassColourName creature={f.creature}>
                    {f.creature.name}
                </ClassColourName>
            </TableCell>
            <TableCell>
                {f.count}
            </TableCell>
        </TableRow>)

    const incinerationLines = data.Encounter?.incineration.filterAuraID.filterRemoved.events
        .map(f => {
        const targetLocation = f.instant.creatures.find(c => c.creature.guid === f.target.guid)?.location as LocationFieldsFragment
        const players = f.instant.creatures
            .filter(c => c.creature.guid.startsWith('Player') && c.creature.guid !== f.target.guid)
            .filter(c => distanceSquare(c.location, targetLocation) < 200)

        if(players.length === 0) return false
            
        return <IncinerationTableRow f={f} players={players} />
    }).filter(Boolean)


    return (<Grid container spacing={2}>
        <Grid item sm={12}>
            <Typography variant="h5" gutterBottom>
                Dragons 101
            </Typography>
        </Grid>
        <Grid item>
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Non-tanks who stood in the Breath:</TableCell>
                            <TableCell align="right">Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {breathLines.length === 0 ? <TableRow><TableCell colSpan={2}>Congratulations, no fails
                            here</TableCell></TableRow> : breathLines}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item>
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Whacked by the tail:</TableCell>
                            <TableCell align="right">Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tailLines.length === 0 ? <TableRow><TableCell colSpan={2}>Congratulations, no fails
                            here</TableCell></TableRow> : tailLines}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item sm={12}>
            <Typography variant="h5" gutterBottom>Incineration</Typography>
        </Grid>
        <Grid>
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Time</TableCell>
                            <TableCell>Player</TableCell>
                            <TableCell>Near</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incinerationLines.length === 0 ? <TableRow><TableCell colSpan={3}>Congratulations, no fails
                            here</TableCell></TableRow> : incinerationLines}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>)

}