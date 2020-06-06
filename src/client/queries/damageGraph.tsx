import {gql} from "@apollo/client";
import {CreatureEventsFields, EncounterFields, FilteredEventsFields} from "./fragments";

export const DAMAGE_GRAPH_QUERY = gql`
    query EncounterDamageGraph($id: Float!) {
        Encounter(id: $id) {
            filteredDamageEvents {
                filterSource(filter: Players) {
                    filterTarget(filter: Hostile) {
                        count
                        total
                        timeSlice {
                            ...FilteredEventsFields
                            bySource {
                                ...CreatureEventsFields
                            }
                        }
                    }
                }
            }
            ...EncounterFields
        }
    }
    ${CreatureEventsFields}
    ${EncounterFields}
    ${FilteredEventsFields}
`;