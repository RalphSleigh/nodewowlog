import {addHours, getMinutes, getHours, getSeconds, differenceInSeconds} from 'date-fns';
import {Encounter, EncounterFieldsFragment} from "../queries/types";

export function encounterName(e: EncounterFieldsFragment): string {

    return `${e.name} (${convertToDuration(e.duration)}) - ${e.status === 'IN_PROGRESS' ? 'Live' : e.status === 'VICTORY' ? 'Kill' : 'Wipe' }`
}

// https://stackoverflow.com/questions/48776140/format-a-duration-from-seconds-using-date-fns
export const convertToDuration = (secondsAmount: number) => {
    const normalizeTime = (time: string): string =>
        time.length === 1 ? `0${time}` : time;

    const SECONDS_TO_MILLISECONDS_COEFF = 1000;
    const MINUTES_IN_HOUR = 60;

    const milliseconds = secondsAmount * SECONDS_TO_MILLISECONDS_COEFF;

    const date = new Date(milliseconds);
    const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR;
    const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);

    const minutes = String(getMinutes(dateWithoutTimezoneDiff));
    const seconds = normalizeTime(String(getSeconds(dateWithoutTimezoneDiff)));

    return `${minutes}:${seconds}`;
};