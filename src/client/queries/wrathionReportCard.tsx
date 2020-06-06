import {gql} from "@apollo/client";
import {
    AuraByCreatureFields,
    AuraEventWithInstantFields,
    CreatureEventsFields,
    CreatureFields,
    CreatureInstantFields
} from "./fragments";

export const WRATHION_REPORT_CARD_QUERY = gql`
    query WraithionReportCard($id: Float!) {
        Encounter(id: $id) {
            name
            breath: filteredAuraEvents {
                filterAuraID(auraID: 306015) {
                    filterApplied {
                        byTarget {
                            ...AuraByCreatureFields
                        }
                    }
                }
            }
            tail: filteredDamageEvents {
                filterSpell(spellId: 307974) {
                    byTarget {
                        ...CreatureEventsFields
                    }
                }
            }
            incineration: filteredAuraEvents {
                filterAuraID(auraID: 306163) {
                    filterRemoved {
                        events {
                            ...AuraEventWithInstantFields
                        }
                    }
                }
            }
        }
    }
${AuraByCreatureFields}
${CreatureEventsFields}
${AuraEventWithInstantFields}
`

/*
export const WRATHION_REPORT_CARD_QUERY = gql`
    query WraithionReportCard($id: Float!) {
    Encounter(id: $id) {
        filteredEvents {
            filterSpell(spellId: 305978) {
                byTarget {
                    total
                    count
                    creature {
                    ...CreatureFields
                    }
                }
            }
        }
    }
}
${CreatureFields}`

 */