import {Service} from "typedi";

import {cachedRequest} from "../cachingRequest";
import {PlayerRoles, SpecClassInfo} from "../data/player";
import {cache} from "../fsCache";
import {TokenProvider} from "./tokenProvider";
import {SpecCache} from "./specCache";
import {SpellIconCache} from "./spellIconCache";

@Service()
export class BlizzardAPIWrapper {
    constructor(private tokenProvider: TokenProvider,
                private specCache: SpecCache,
                private spellIconCache: SpellIconCache) {
    }

    async getUrl(url: string) {
        const token = await this.tokenProvider.getToken()
        return await cachedRequest(url, {json: true, headers: {Authorization: `Bearer ${token}`}})
    }

    getSpecInfo(specId: number): SpecClassInfo {
        const cached = this.specCache.get(specId)
        if (cached) return cached

        new Promise(async (resolve, reject) => {
            try {
                const fetched = await cache.wrap(`spec-${specId}`, async () => {
                    const result = await this.getUrl(`https://eu.api.blizzard.com/data/wow/playable-specialization/${specId}?namespace=static-eu&locale=en_US`)
                    const media = await this.getUrl(result.media.key.href)
                    const classMedia = await this.getUrl(`https://eu.api.blizzard.com/data/wow/media/playable-class/${result.playable_class.id}?namespace=static-eu&locale=en_US`)
                    return new SpecClassInfo(result.name, media.assets[0].value, PlayerRoles[result.role.name as keyof typeof PlayerRoles], result.playable_class.id, result.playable_class.name, classMedia.assets[0].value)
                })
                this.specCache.set(specId, fetched)
                return fetched
            } catch (e) {
                return new SpecClassInfo("", "", PlayerRoles.Damage, 0, "", "")
            }
        })

        return new SpecClassInfo("", "", PlayerRoles.Damage, 0, "", "")
    }

    getSpellIconUrl(spellId: number): string {
        const cached = this.spellIconCache.get(spellId)
        if (cached) return cached

        new Promise(async (resolve, reject) => {

            try {
                const fetched = await cache.wrap(`spellIcon-${spellId}`, async () => {
                    try {
                        const media = await this.getUrl(`https://eu.api.blizzard.com/data/wow/media/spell/${spellId}?namespace=static-eu&locale=en_US`)
                        return media.assets[0].value
                    } catch (e) {
                        return "" //return blank if the API 404s (which it will, its broken), as we want to cache the failure
                    }
                })
                if (fetched !== "") this.spellIconCache.set(spellId, fetched) //don't store failure in permanent cache
                return fetched
            } catch (e) {
                return ""
            }
        })

        return ""

    }
}

