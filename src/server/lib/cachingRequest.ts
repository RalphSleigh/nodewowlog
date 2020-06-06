import rp from 'request-promise'
import {binaryCache, cache} from "./fsCache";
import { Response } from 'request';
import request from 'request'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function cachedRequest(url: string, options: rp.RequestPromiseOptions): Promise<any> {
    return await cache.wrap(url, async () => {
        console.log(`Hitting API for ${url}`)
        try {
            return await rp.get(url, options)
        } catch (e) {
            console.log(`Failed getting ${url}`)
            return ""
        }
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function imageCachedRequest(url: string): Promise<any> {
   return await binaryCache.wrap(url, async () => {
        return new Promise((resolve, reject) => {
            console.log(`Fetching ${url}`)
            request.get(url).on('response', async function(response) {
                const chunks = []
                for await (const chunk of response) {
                    chunks.push(chunk)
                }
                resolve({binary: {image:Buffer.concat(chunks)}})
            });
        })
   })
}