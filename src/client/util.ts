import {useEffect, useState} from "react";

export function classCSSColour(id: number): string {

    switch(id) {
        case 1:
            return '#C79C6E'
        case 2:
            return '#F58CBA'
        case 3:
            return '#A9D271'
        case 4:
            return '#FFF569'
        case 5:
            return '#FFFFFF'
        case 6:
            return '#C41F3B'
        case 7:
            return '#0070DE'
        case 8:
            return '#40C7EB'
        case 9:
            return '#8787ED'
        case 10:
            return '#00FF96'
        case 11:
            return '#FF7D0A'
        case 12:
            return '#A330C9'
        default:
            return '#aaaaaa'

    }
}


export function useTimeoutState<T>(initial: T, timeout: number): [T, (v: T) => void, () => void] {
    const [state, update] = useState<T>(initial)
    const [timer, updateTimer] = useState<number>(0)
    const updateFunction = (v: T) => updateTimer(window.setTimeout(() => update(v), timeout))
    const cancelFunction = () => window.clearTimeout(timer)

    useEffect(() => cancelFunction)

    return [state, updateFunction, cancelFunction]
}