import express, {ErrorRequestHandler, Express, NextFunction} from "express";
require('express-async-errors');

import graphqlHTTP from "express-graphql";
import {buildSchema, MiddlewareFn} from "type-graphql";

import {Container, Service} from "typedi";

import {EncounterResolver} from "./resolvers/encountersResolver";
import {PlayersResolver} from "./resolvers/playersResolver";
import {imageCachedRequest} from "../cachingRequest";
import {SpellResolver} from "./resolvers/spellResolver";
import {CreatureEventsResolver, FilteredEventsResolver, SpellEventsResolver} from "./resolvers/genericEventsResolver";
import http from "http";
import path from "path";
import {Creature} from "../data/creature";
import {Player} from "../data/player";
import {FilteredAuraEventsResolver, FilteredCreatureAuraEventsResolver} from "./resolvers/filteredAuraEventsResolver";

const ErrorInterceptor: MiddlewareFn = async ({}, next) => {
    try {
        const result = await next();
        return result
    } catch (err) {
        // write error to file log
        console.log(err);
        throw err;
    }
};

const expressErrorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack)

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send('Something broke!')
}

@Service()
export class AppServer {
    private app: Express;

    constructor() {
        this.app = express();
    }

    async listen(hostname: string, port: number): Promise<http.Server> {
        return new Promise(async (resolve, reject) => {
            try {

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const schema = await buildSchema({
                    resolvers: [
                        EncounterResolver,
                        PlayersResolver,
                        FilteredEventsResolver,
                        CreatureEventsResolver,
                        SpellEventsResolver,
                        SpellResolver,
                        FilteredAuraEventsResolver,
                        FilteredCreatureAuraEventsResolver],
                    container: Container,
                    orphanedTypes: [Creature, Player]
                });

                this.app.use('/graphql', graphqlHTTP(req => {
                    const startTime = Date.now();
                    return {
                        schema: schema,
                        graphiql: true,
                        customFormatErrorFn: error => {
                            console.error(error)
                        },
                        extensions: () => ({
                            timing: Date.now() - startTime,
                        })
                    };
                }));

                this.app.get("/icon", async (req, res) => {
                    const iconUrl = req.query.iconUrl as string
                    if (!iconUrl.startsWith('https://render-eu.worldofwarcraft.com/icons/56/')) throw new Error('not fetching this')

                    const iconResponse = await imageCachedRequest(iconUrl);
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    const image = iconResponse.binary.image;
                    image.pipe(res);
                })

                const staticPath = path.join(__dirname, '../../../static')
                this.app.use(express.static(staticPath));

                this.app.use(expressErrorHandler)

                const server = this.app.listen(port, hostname, () => {
                    resolve(server)
                });
            } catch (e) {
                reject(e)
            }
        })
    }
}

