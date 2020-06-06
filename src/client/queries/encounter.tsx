import {gql} from "@apollo/client";
import {CreatureFields, EncounterFields, SpellFields} from "./fragments";

export const ENCOUNTER_INFO = gql`
    query EncounterInfo($id: Float!) {
        Encounter(id: $id) {
            ...EncounterFields
            creatures {
                ...CreatureFields
            }
            spells {
                ...SpellFields
            }
        }
    }
    ${CreatureFields}
    ${EncounterFields}
    ${SpellFields}
`;