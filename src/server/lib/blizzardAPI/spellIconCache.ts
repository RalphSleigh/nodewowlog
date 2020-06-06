import {Service} from "typedi";
import Stringify from "json-stable-stringify"
import path from 'path'
import fs from 'fs'
import {IsElectron} from "../../utils";

const SPELLS_FILE_PATH = path.join(__dirname, '../../../staticData/spellIcons.json')
@Service()
export class SpellIconCache {
    private readonly cache: {[key: number]: string};

    constructor() {
        this.cache = JSON.parse(fs.readFileSync(SPELLS_FILE_PATH).toString())
    }

    get(id: number): string | undefined {
        return this.cache[id] || undefined
    }

    set(id: number, iconUrl: string) {
        this.cache[id] = iconUrl
        if(!IsElectron()) fs.writeFile(SPELLS_FILE_PATH, Stringify(this.cache, { space: "\t" }), (err) => {
            if(err) throw err
        })
    }

}