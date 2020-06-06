import React, {FC} from "react";
import {CreatureInstantFieldsFragment} from "../queries/types";
import {isNumber} from "class-validator";


export const PositionOverlay: FC<{
    creatureInstants: CreatureInstantFieldsFragment[]
    selected: string
}>
    = ({creatureInstants, selected}) => {

    const bounds = creatureInstants.reduce((bounds: {l: number; r: number; t: number; b: number}, c) => {

        bounds.l = Math.min(bounds.l, c.location.x)
        bounds.r = Math.max(bounds.r, c.location.x)
        bounds.t = Math.max(bounds.t, c.location.y * -1)
        bounds.b = Math.min(bounds.b, c.location.y * -1)

        return bounds
    }, {l: creatureInstants[0].location.x, r: creatureInstants[0].location.x, t: creatureInstants[0].location.y * -1, b: creatureInstants[0].location.y * -1})

    const translateX = (x: number) => (((x - bounds.l) / (bounds.r - bounds.l)) * 280) + 10
    const translateY = (x: number) => (((x - bounds.b) / (bounds.r - bounds.l)) * 280) + 10
    const height = translateY(bounds.t) + 10

    return <svg width="300" height={height}>
        {creatureInstants.map(ci => {
            let className = `classFillColour${ci.creature.__typename === "Player" ? ci.creature.specClassInfo.classID : 0}`
            if(ci.creature.guid === selected) className += ' SVGselected'
            return <circle key={ci.creature.guid} cx={translateX(ci.location.x)} cy={translateY(ci.location.y * -1)} r="5" className={className} />
        })}
    </svg>
    }