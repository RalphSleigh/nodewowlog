import numeral from 'numeral'
import {FC} from "react";
import React from 'react';

// eslint-disable-next-line react/prop-types
export const ShortNumber: FC<{value: number}> = ({value}) =>{
    return <>{numeral(value).format('0.00a')}</>
}

export const LongNumber: FC<{value: number}> = ({value}) =>{
    return <>{numeral(value).format('0,0')}</>
}

export const MsDisplay: FC<{value: number}> = ({value}) =>{
    return <>{numeral(value/1000).format('00:00').split(':').slice(-2).join(':')}</>
}

