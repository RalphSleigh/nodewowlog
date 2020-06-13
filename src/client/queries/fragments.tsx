import {gql} from "@apollo/client";

export const CreatureFields = gql`
    fragment CreatureFields on ICreature {
        guid
        name
        friendly
        seen
        owner {
            guid
        }
        ... on Player {
            specClassInfo {
                specIconURL
                classID
                role
                }
            }
        }`

export const CreatureEventsFields = gql`
    fragment CreatureEventsFields on CreatureEvents {
        count
        total
        creature {
            ...CreatureFields
        }
    }
    ${CreatureFields}
`

export const FilteredEventsFields = gql`
    fragment FilteredEventsFields on FilteredEvents {
        count
        total
    }`

export const SpellFields = gql`
    fragment SpellFields on Spell {
            id
            name
            iconUrl
            school
        }`

export const SpellEventsFields = gql`
    fragment SpellEventsFields on SpellEvents {
        total
        count
        spell {
            ...SpellFields
        }
    }
    ${SpellFields}
`

export const BySourceFields = gql`
    fragment  BySourceFields on CreatureEvents {
            ...CreatureEventsFields
            byTarget {
                ...CreatureEventsFields
            }
            bySpell {
                ...SpellEventsFields
        }
    }
    ${CreatureEventsFields}
    ${SpellEventsFields}
`

export const ByTargetFields = gql`
    fragment  ByTargetFields on CreatureEvents {
            ...CreatureEventsFields
            bySource {
                ...CreatureEventsFields
            }
            bySpell {
                ...SpellEventsFields
        }
    }
    ${CreatureEventsFields}
    ${SpellEventsFields}
`

export const BySpellFields = gql`
    fragment  BySpellFields on SpellEvents {
            ...SpellEventsFields
            byTarget {
                ...CreatureEventsFields
            }
            bySource {
                ...CreatureEventsFields
        }
    }
    ${CreatureEventsFields}
    ${SpellEventsFields}
`

export const EncounterFields = gql`
    fragment EncounterFields on Encounter {
        id
        name
        status
        duration
        startTime
        endTime
    }
    
`

export const AuraByCreatureFields = gql`
    fragment AuraByCreatureFields on FilteredCreatureAuraEvents {
        count
        creature {
            ...CreatureFields
        }
    }
    ${CreatureFields}
`

export const LocationFields = gql`
    fragment LocationFields on Location {
        time
        x
        y
    }
`

export const CreatureInstantFields = gql`
    fragment CreatureInstantFields on CreatureInstant {
        creature {
            ...CreatureFields
        }
        location {
            ...LocationFields
        }
    }
        ${CreatureFields}
        ${LocationFields}
`

export const AuraEventWithInstantFields = gql`
    fragment AuraEventWithInstantFields on AuraEvent {
        time
        target {
            ...CreatureFields
        }
        instant {
            creatures(filter: PlayersOnly) {
                ...CreatureInstantFields
            }
        }
    }
    ${CreatureFields}
    ${CreatureInstantFields}
`
