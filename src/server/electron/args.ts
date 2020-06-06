import yargs from "yargs";
import {Container} from "typedi";
import {Args} from "../lib/args";

const yargsResult = yargs.options({
    'log': {
        describe: 'Log file to parse',
        type: 'string'
    },
    'apiKey': {
        describe: 'Blizzard API key',
        type: 'string'
    },
    'apiSecret': {
        describe: 'Blizzard API secret',
        type: 'string'
    }
}).argv

export const args: Args = {log: yargsResult.log, apiKey: yargsResult.apiKey, apiSecret: yargsResult.apiSecret}
Container.set("args", args)