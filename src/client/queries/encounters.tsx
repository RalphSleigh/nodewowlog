import {gql} from "@apollo/client";
import {EncounterFields} from "./fragments";

export const ENCOUNTERS_QUERY = gql`
    query EncountersList {
        Encounters(includeTrash: false) {
            ...EncounterFields
        }
    }
    ${EncounterFields}
`;