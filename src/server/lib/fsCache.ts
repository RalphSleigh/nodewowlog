import cacheManager from "cache-manager";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import fsStore from "cache-manager-fs";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import binStore from "cache-manager-fs-binary"
import envPaths from "env-paths";
import path from "path"
import makeDir from "make-dir";

const paths = envPaths('nodewowlog')
const diskCache = makeDir.sync(path.join(paths.cache, 'diskcache'))
const diskBinCache = makeDir.sync(path.join(paths.cache, 'diskbincache'))

const memoryCache = cacheManager.caching({store: 'memory', ttl: 7 * 24 * 60 * 60, max: 100000});


const fsCache = cacheManager.caching({
    store: fsStore,
    ttl: 24 * 60 * 60 /* seconds */,
    maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */,
    path: diskCache,
    preventfill: false
});

export const cache = cacheManager.multiCaching([memoryCache, fsCache]);

export const binaryCache = cacheManager.caching({
    store: binStore,
    reviveBuffers: true,
    binaryAsStream: true,
    ttl: 7 * 24 * 60 * 60 /* seconds */,
    maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */,
    path: diskBinCache,
    preventfill: false
});