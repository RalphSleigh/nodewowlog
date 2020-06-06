//CLI entry point

import "source-map-support/register";
import "reflect-metadata";

import { Container } from "typedi";

import { args } from "./cli/args";

import { AppServer } from "./lib/web/server";
import { parseLogFile } from "./lib/parseLogFile";


console.log(`Reading ${args.log}`);
parseLogFile(args.log as string)


const server = Container.get(AppServer)
server.listen("localhost", 8080);


