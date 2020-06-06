import React, {FC, ReactElement} from "react";
import {useQuery} from "@apollo/client";
import {DAMAGE_GRAPH_QUERY} from "../queries/damageGraph";
import {EncounterDamageGraphQuery, EncounterDamageGraphQueryVariables} from "../queries/types";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import {classCSSColour} from "../util";

// eslint-disable-next-line react/prop-types
export const DamageGraph: FC<{ encounterId: number; selectedCreature: string, live: boolean }> = ({encounterId, selectedCreature, live}) => {

    const {loading, error, data} = useQuery<EncounterDamageGraphQuery, EncounterDamageGraphQueryVariables>(DAMAGE_GRAPH_QUERY, {variables: {id: encounterId}, pollInterval: live ? 1000 : 0});

    if (!data) {
        if (loading) return <>Loading</>
        return <>{`Error: ${error}`} </>
    }

    type chartSlice = { name: string } | { [key: string]: number }

    const lines = new Map<string, ReactElement>()

    lines.set('total', <Line key={'total'}
                             dataKey={'total'}
                             stroke={classCSSColour(0)}
                             dot={false}
                             type="monotoneX"
                             yAxisId="right"
                             strokeWidth={3}
                             isAnimationActive={false}/>)



    const chartData = data.Encounter.filteredDamageEvents.filterSource.filterTarget.timeSlice.map((slice, index) => {
        const a: chartSlice = {name: `${index * 5} seconds`, total: slice.total}
        return slice.bySource.reduce((a: chartSlice, c) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            a[c.creature.name] = c.total / 5
            if (!lines.has(c.creature.guid)) {
                const classId = c.creature.__typename === "Player" ? c.creature.specClassInfo.classID : 0
                lines.set(c.creature.guid, selectedCreature === c.creature.guid ?
                    <Area key={c.creature.guid}
                          dataKey={c.creature.name}
                          fill={classCSSColour(classId)}
                          stroke={classCSSColour(classId)}
                          strokeWidth={3}
                          dot={false}
                          type="monotoneX"
                          yAxisId="left"
                          isAnimationActive={false}/>

                    : <Line key={c.creature.guid}
                            dataKey={c.creature.name}
                            stroke={classCSSColour(classId)}
                            dot={false}
                            type="monotoneX"
                            yAxisId="left"
                            isAnimationActive={false}/>)
            }
            return a
        }, a)
    })

    return <ResponsiveContainer width='100%' height={300}>
        <ComposedChart data={chartData} margin={{top: 5, right: 50, left: 50, bottom: 5}}>
            <CartesianGrid strokeDasharray="1 4"/>
            <XAxis dataKey="name" interval={11} domain={['dataMin', 'dataMax']} scale="point"/>
            <YAxis yAxisId="left" domain={[0, dataMax => Math.ceil((dataMax + 25000) / 25000) * 25000]}/>
            <YAxis yAxisId="right" orientation="right" domain={[0, dataMax => Math.ceil((dataMax + 50000) / 50000) * 50000]}/>
            {[...lines.values()]}
        </ComposedChart>
    </ResponsiveContainer>
}