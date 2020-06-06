import {Service} from "typedi";
import Stringify from "json-stable-stringify"
import path from 'path'
import fs from 'fs'
import {SpecClassInfo} from "../data/player";
import {IsElectron} from "../../utils";

const SPECS_FILE_PATH = path.join(__dirname, '../../../staticData/specs.json')

@Service()
export class SpecCache {
    private readonly cache: {[key: number]: SpecClassInfo};

    constructor() {
        this.cache = JSON.parse(fs.readFileSync(SPECS_FILE_PATH).toString())
    }

    get(id: number): SpecClassInfo | undefined {
        return this.cache[id] || undefined
    }

    set(id: number, info: SpecClassInfo) {
        this.cache[id] = info
        if(!IsElectron()) fs.writeFile(SPECS_FILE_PATH, Stringify(this.cache, { space: "\t" }), (err) => {
            if(err) throw err
        })
    }
}