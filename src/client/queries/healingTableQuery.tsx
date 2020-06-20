import {gql} from "@apollo/client";
import {EncounterFields, BySourceFields, ByTargetFields, BySpellFields} from "./fragments";

export const HEALING_TABLE_QUERY = gql`
    query HealingTable(
        $id: Float!,
        $source: CreatureFilters,
        $target: CreatureFilters,
        $sourceGuid: String,
        $targetGuid: String,
        $sourceName: String,
        $targetName: String,
        $bySource: Boolean!,
        $byTarget: Boolean!,
        $bySpell: Boolean!,
    ){
        Encounter(id: $id) {
            filteredEvents {
                filterHealing {
                    filterSource(filter: $source, name: $sourceName guid: $sourceGuid) {
                        filterTarget(filter: $target, name: $targetName guid: $targetGuid) {
                            bySource @include(if: $bySource) {
                                ...BySourceFields
                            }
                            byTarget @include(if: $byTarget) {
                                ...ByTargetFields
                            }
                            bySpell @include(if: $bySpell) {
                                ...BySpellFields
                            }
                        }
                    }
                }
            }
            ...EncounterFields
        }
    }
    ${BySourceFields}
    ${ByTargetFields}
    ${BySpellFields}
    ${EncounterFields}
`;