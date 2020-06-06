import Tail from "tail";
import {args} from "../cli/args";
import {Container} from "typedi";
import {LogFile} from "./data/logFile";
import debounce from "debounce";
import {parseLine} from "./parsers/lineParser";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

export function parseLogFile(file: string) {
    const tail = new Tail.Tail(file, {fromBeginning: true});
    const logFile = Container.get(LogFile);
    let eventCount = 0;

    const onEnd = debounce(() => {
        logFile.logEvents();
        logParseSpeed(eventCount, startTime);
    }, 1000)

    const startTime = new Date();

    function processLine(data: string): void {
        parseLine(logFile, data);
        eventCount++;
        if (eventCount % 10000 === 0) onEnd()
    }

    tail.on("line", processLine);

    tail.on("error", (error: any) => {
        console.log(`ERROR: ${error}`);
    });

}

const logParseSpeed = (lines: number, startTime: Date): void => {
    const elapsedTime = differenceInMilliseconds(Date.now(), startTime);
    const parsePerSecond = lines / (elapsedTime / 1000);
    console.log(
        `Parsed ${lines} lines in ${
            elapsedTime / 1000
        } seconds (${parsePerSecond.toFixed(0)} lines/second)`
    );
};