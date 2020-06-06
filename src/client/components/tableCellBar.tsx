import React, {FC} from "react";
import {CreatureEventsFieldsFragment, SpellEventsFieldsFragment, SpellFieldsFragment} from "../queries/types";
import {Box} from "@material-ui/core";


export const CreatureTableCellBar: FC<{max: number; creatures: CreatureEventsFieldsFragment[]}> = ({max,creatures}) => {

    let barClass: string

    switch (creatures[0].creature.__typename) {
        case "Player":
            barClass = `classBGColour${creatures[0].creature.specClassInfo.classID}`
            break;
        default:
            barClass = 'classBGColour0'
    }

    const bars = creatures.map((c, i) => <div
        key={i}
        className={barClass}
        style={{
            width:`${c.total*100/max}%`,
        }}
    />)

    return  <div className="tableBar">
        {bars}
        </div>
}

export const SpellTableCellBar: FC<{max: number; spells: SpellEventsFieldsFragment[]}> = ({max, spells}) => {


    const bars = spells.map((s, i) => <div
        key={i}
        style={{
            width:`${s.total*100/max}%`,
            background: spellBarBackground(spells[0].spell.school),
            backgroundColor: spellBarBackground(spells[0].spell.school)
        }}
    />)

    return  <div className="tableBar">
        {bars}
    </div>
}

function spellBarBackground(school: number): string {
    //MASSIVE BITMASK TO CSS GRADIENT HACK INC
    //background: linear-gradient(to right,  #ff80ff 0%,#ff8000 100%);
    const colours = ["#FFFF00","#FFE680","#FF8000","#4DFF4D","#80FFFF","#8080FF","#FF80FF"];
    const needed = [];
    let j = 1;
    for(let i = 0; i < 8; i++) {
        if(school & j)needed.push(colours[i]);
        j = j*2;
    }
    if(needed.length == 1)return needed[0];
    let output = "linear-gradient(to left"
    for(let k = 0;k < needed.length; k++) {
        output += ', ';
        output += needed[k];
        output += ' ';
        output += ((k * 100)/(needed.length - 1));
        output += '%';
    }
    output += ')';
    return output
}