export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Creature = ICreature & {
   __typename?: 'Creature';
  name: Scalars['String'];
  guid: Scalars['String'];
  friendly: Scalars['Boolean'];
  owner?: Maybe<ICreature>;
  seen: Scalars['Float'];
  locations: Array<Location>;
};

export type ICreature = {
  name: Scalars['String'];
  guid: Scalars['String'];
  friendly: Scalars['Boolean'];
  owner?: Maybe<ICreature>;
  seen: Scalars['Float'];
  locations: Array<Location>;
};

export type Location = {
   __typename?: 'Location';
  time: Scalars['Float'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type Player = ICreature & {
   __typename?: 'Player';
  name: Scalars['String'];
  guid: Scalars['String'];
  friendly: Scalars['Boolean'];
  owner?: Maybe<ICreature>;
  seen: Scalars['Float'];
  locations: Array<Location>;
  spec: Scalars['Float'];
  specClassInfo: SpecClassInfo;
};

export type SpecClassInfo = {
   __typename?: 'SpecClassInfo';
  specName: Scalars['String'];
  specIconURL: Scalars['String'];
  role: PlayerRoles;
  classID: Scalars['Float'];
  className: Scalars['String'];
  classIconURL: Scalars['String'];
};

export enum PlayerRoles {
  Damage = 'Damage',
  Tank = 'Tank',
  Healer = 'Healer'
}

export type Query = {
   __typename?: 'Query';
  Encounters: Array<Encounter>;
  Encounter: Encounter;
};


export type QueryEncountersArgs = {
  includeTrash: Scalars['Boolean'];
};


export type QueryEncounterArgs = {
  id: Scalars['Float'];
};

export type Encounter = {
   __typename?: 'Encounter';
  id: Scalars['Float'];
  startTime: Scalars['DateTime'];
  _endTime: Scalars['DateTime'];
  encounterId: Scalars['Float'];
  name: Scalars['String'];
  numberOfPlayers: Scalars['Float'];
  difficulty: Scalars['Float'];
  boss: Scalars['Boolean'];
  status: Scalars['String'];
  endTime: Scalars['DateTime'];
  creatures: Array<ICreature>;
  spells: Array<Spell>;
  filteredEvents: FilteredEvents;
  filteredAuraEvents: FilteredAuraEvents;
  duration: Scalars['Float'];
};


export type Spell = {
   __typename?: 'Spell';
  id: Scalars['Float'];
  name: Scalars['String'];
  school: Scalars['Float'];
  iconUrl: Scalars['String'];
};

export type FilteredEvents = GenericSummableEvents & {
   __typename?: 'FilteredEvents';
  total: Scalars['Float'];
  absorb: Scalars['Float'];
  count: Scalars['Float'];
  hits: Scalars['Float'];
  ticks: Scalars['Float'];
  critHits: Scalars['Float'];
  critTicks: Scalars['Float'];
  hitTotal: Scalars['Float'];
  critHitTotal: Scalars['Float'];
  tickTotal: Scalars['Float'];
  critTickTotal: Scalars['Float'];
  bySpell: Array<SpellEvents>;
  bySource: Array<CreatureEvents>;
  byTarget: Array<CreatureEvents>;
  timeSlice: Array<FilteredEvents>;
  filterDamage: FilteredEvents;
  filterHealing: FilteredEvents;
  filterSource: FilteredEvents;
  filterTarget: FilteredEvents;
  filterSpell: FilteredEvents;
};


export type FilteredEventsFilterSourceArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type FilteredEventsFilterTargetArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type FilteredEventsFilterSpellArgs = {
  spellId: Scalars['Float'];
};

export type GenericSummableEvents = {
  total: Scalars['Float'];
  absorb: Scalars['Float'];
  count: Scalars['Float'];
  hits: Scalars['Float'];
  ticks: Scalars['Float'];
  critHits: Scalars['Float'];
  critTicks: Scalars['Float'];
  hitTotal: Scalars['Float'];
  critHitTotal: Scalars['Float'];
  tickTotal: Scalars['Float'];
  critTickTotal: Scalars['Float'];
};

export type SpellEvents = GenericSummableEvents & {
   __typename?: 'SpellEvents';
  total: Scalars['Float'];
  absorb: Scalars['Float'];
  count: Scalars['Float'];
  hits: Scalars['Float'];
  ticks: Scalars['Float'];
  critHits: Scalars['Float'];
  critTicks: Scalars['Float'];
  hitTotal: Scalars['Float'];
  critHitTotal: Scalars['Float'];
  tickTotal: Scalars['Float'];
  critTickTotal: Scalars['Float'];
  spellId: Scalars['Float'];
  spell: Spell;
  bySpell: Array<SpellEvents>;
  bySource: Array<CreatureEvents>;
  byTarget: Array<CreatureEvents>;
  timeSlice: Array<FilteredEvents>;
  filterDamage: FilteredEvents;
  filterHealing: FilteredEvents;
  filterSource: FilteredEvents;
  filterTarget: FilteredEvents;
  filterSpell: FilteredEvents;
};


export type SpellEventsFilterSourceArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type SpellEventsFilterTargetArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type SpellEventsFilterSpellArgs = {
  spellId: Scalars['Float'];
};

export type CreatureEvents = GenericSummableEvents & {
   __typename?: 'CreatureEvents';
  total: Scalars['Float'];
  absorb: Scalars['Float'];
  count: Scalars['Float'];
  hits: Scalars['Float'];
  ticks: Scalars['Float'];
  critHits: Scalars['Float'];
  critTicks: Scalars['Float'];
  hitTotal: Scalars['Float'];
  critHitTotal: Scalars['Float'];
  tickTotal: Scalars['Float'];
  critTickTotal: Scalars['Float'];
  guid: Scalars['String'];
  creature: ICreature;
  bySpell: Array<SpellEvents>;
  bySource: Array<CreatureEvents>;
  byTarget: Array<CreatureEvents>;
  timeSlice: Array<FilteredEvents>;
  filterDamage: FilteredEvents;
  filterHealing: FilteredEvents;
  filterSource: FilteredEvents;
  filterTarget: FilteredEvents;
  filterSpell: FilteredEvents;
};


export type CreatureEventsFilterSourceArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type CreatureEventsFilterTargetArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type CreatureEventsFilterSpellArgs = {
  spellId: Scalars['Float'];
};

export enum CreatureFilters {
  All = 'All',
  Players = 'Players',
  Friendly = 'Friendly',
  Hostile = 'Hostile',
  Guid = 'Guid',
  Name = 'Name',
  PlayersOnly = 'PlayersOnly'
}

export type FilteredAuraEvents = GenericFilteredAuraEvents & {
   __typename?: 'FilteredAuraEvents';
  events: Array<AuraEvent>;
  count: Scalars['Float'];
  filterAuraID: FilteredAuraEvents;
  filterApplied: FilteredAuraEvents;
  filterRemoved: FilteredAuraEvents;
  byTarget: Array<FilteredCreatureAuraEvents>;
};


export type FilteredAuraEventsFilterAuraIdArgs = {
  auraID: Scalars['Float'];
};

export type GenericFilteredAuraEvents = {
  events: Array<AuraEvent>;
  count: Scalars['Float'];
};

export type AuraEvent = {
   __typename?: 'AuraEvent';
  time: Scalars['Float'];
  source: ICreature;
  target: ICreature;
  aura: Aura;
  stacks: Scalars['Float'];
  amount: Scalars['Float'];
  type: Scalars['Float'];
  instant: Instant;
};

export type Aura = {
   __typename?: 'Aura';
  id: Scalars['Float'];
  name: Scalars['String'];
  school: Scalars['Float'];
};

export type Instant = {
   __typename?: 'Instant';
  time: Scalars['Float'];
  creatures: Array<CreatureInstant>;
};


export type InstantCreaturesArgs = {
  filter?: Maybe<CreatureFilters>;
  guid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CreatureInstant = {
   __typename?: 'CreatureInstant';
  creature: ICreature;
  location: Location;
};

export type FilteredCreatureAuraEvents = GenericFilteredAuraEvents & {
   __typename?: 'FilteredCreatureAuraEvents';
  events: Array<AuraEvent>;
  count: Scalars['Float'];
  creature: ICreature;
  filterAuraID: FilteredAuraEvents;
  filterApplied: FilteredAuraEvents;
  filterRemoved: FilteredAuraEvents;
  byTarget: Array<FilteredCreatureAuraEvents>;
};


export type FilteredCreatureAuraEventsFilterAuraIdArgs = {
  auraID: Scalars['Float'];
};

export type EncounterDamageGraphQueryVariables = {
  id: Scalars['Float'];
};


export type EncounterDamageGraphQuery = (
  { __typename?: 'Query' }
  & { Encounter: (
    { __typename?: 'Encounter' }
    & { filteredEvents: (
      { __typename?: 'FilteredEvents' }
      & { filterDamage: (
        { __typename?: 'FilteredEvents' }
        & { filterSource: (
          { __typename?: 'FilteredEvents' }
          & { filterTarget: (
            { __typename?: 'FilteredEvents' }
            & Pick<FilteredEvents, 'count' | 'total'>
            & { timeSlice: Array<(
              { __typename?: 'FilteredEvents' }
              & { bySource: Array<(
                { __typename?: 'CreatureEvents' }
                & CreatureEventsFieldsFragment
              )> }
              & FilteredEventsFieldsFragment
            )> }
          ) }
        ) }
      ) }
    ) }
    & EncounterFieldsFragment
  ) }
);

export type DamageTableQueryVariables = {
  id: Scalars['Float'];
  source?: Maybe<CreatureFilters>;
  target?: Maybe<CreatureFilters>;
  sourceGuid?: Maybe<Scalars['String']>;
  targetGuid?: Maybe<Scalars['String']>;
  sourceName?: Maybe<Scalars['String']>;
  targetName?: Maybe<Scalars['String']>;
  bySource: Scalars['Boolean'];
  byTarget: Scalars['Boolean'];
  bySpell: Scalars['Boolean'];
};


export type DamageTableQuery = (
  { __typename?: 'Query' }
  & { Encounter: (
    { __typename?: 'Encounter' }
    & { filteredEvents: (
      { __typename?: 'FilteredEvents' }
      & { filterDamage: (
        { __typename?: 'FilteredEvents' }
        & { filterSource: (
          { __typename?: 'FilteredEvents' }
          & { filterTarget: (
            { __typename?: 'FilteredEvents' }
            & { bySource: Array<(
              { __typename?: 'CreatureEvents' }
              & BySourceFieldsFragment
            )>, byTarget: Array<(
              { __typename?: 'CreatureEvents' }
              & ByTargetFieldsFragment
            )>, bySpell: Array<(
              { __typename?: 'SpellEvents' }
              & BySpellFieldsFragment
            )> }
          ) }
        ) }
      ) }
    ) }
    & EncounterFieldsFragment
  ) }
);

export type EncounterInfoQueryVariables = {
  id: Scalars['Float'];
};


export type EncounterInfoQuery = (
  { __typename?: 'Query' }
  & { Encounter: (
    { __typename?: 'Encounter' }
    & { creatures: Array<(
      { __typename?: 'Creature' }
      & CreatureFields_Creature_Fragment
    ) | (
      { __typename?: 'Player' }
      & CreatureFields_Player_Fragment
    )>, spells: Array<(
      { __typename?: 'Spell' }
      & SpellFieldsFragment
    )> }
    & EncounterFieldsFragment
  ) }
);

export type EncountersListQueryVariables = {};


export type EncountersListQuery = (
  { __typename?: 'Query' }
  & { Encounters: Array<(
    { __typename?: 'Encounter' }
    & EncounterFieldsFragment
  )> }
);

type CreatureFields_Creature_Fragment = (
  { __typename?: 'Creature' }
  & Pick<Creature, 'guid' | 'name' | 'friendly' | 'seen'>
  & { owner?: Maybe<(
    { __typename?: 'Creature' }
    & Pick<Creature, 'guid'>
  ) | (
    { __typename?: 'Player' }
    & Pick<Player, 'guid'>
  )> }
);

type CreatureFields_Player_Fragment = (
  { __typename?: 'Player' }
  & Pick<Player, 'guid' | 'name' | 'friendly' | 'seen'>
  & { specClassInfo: (
    { __typename?: 'SpecClassInfo' }
    & Pick<SpecClassInfo, 'specIconURL' | 'classID' | 'role'>
  ), owner?: Maybe<(
    { __typename?: 'Creature' }
    & Pick<Creature, 'guid'>
  ) | (
    { __typename?: 'Player' }
    & Pick<Player, 'guid'>
  )> }
);

export type CreatureFieldsFragment = CreatureFields_Creature_Fragment | CreatureFields_Player_Fragment;

export type CreatureEventsFieldsFragment = (
  { __typename?: 'CreatureEvents' }
  & Pick<CreatureEvents, 'count' | 'total' | 'absorb'>
  & { creature: (
    { __typename?: 'Creature' }
    & CreatureFields_Creature_Fragment
  ) | (
    { __typename?: 'Player' }
    & CreatureFields_Player_Fragment
  ) }
);

export type FilteredEventsFieldsFragment = (
  { __typename?: 'FilteredEvents' }
  & Pick<FilteredEvents, 'count' | 'total' | 'absorb'>
);

export type SpellFieldsFragment = (
  { __typename?: 'Spell' }
  & Pick<Spell, 'id' | 'name' | 'iconUrl' | 'school'>
);

export type SpellEventsFieldsFragment = (
  { __typename?: 'SpellEvents' }
  & Pick<SpellEvents, 'total' | 'count' | 'absorb'>
  & { spell: (
    { __typename?: 'Spell' }
    & SpellFieldsFragment
  ) }
);

export type BySourceFieldsFragment = (
  { __typename?: 'CreatureEvents' }
  & { byTarget: Array<(
    { __typename?: 'CreatureEvents' }
    & CreatureEventsFieldsFragment
  )>, bySpell: Array<(
    { __typename?: 'SpellEvents' }
    & SpellEventsFieldsFragment
  )> }
  & CreatureEventsFieldsFragment
);

export type ByTargetFieldsFragment = (
  { __typename?: 'CreatureEvents' }
  & { bySource: Array<(
    { __typename?: 'CreatureEvents' }
    & CreatureEventsFieldsFragment
  )>, bySpell: Array<(
    { __typename?: 'SpellEvents' }
    & SpellEventsFieldsFragment
  )> }
  & CreatureEventsFieldsFragment
);

export type BySpellFieldsFragment = (
  { __typename?: 'SpellEvents' }
  & { byTarget: Array<(
    { __typename?: 'CreatureEvents' }
    & CreatureEventsFieldsFragment
  )>, bySource: Array<(
    { __typename?: 'CreatureEvents' }
    & CreatureEventsFieldsFragment
  )> }
  & SpellEventsFieldsFragment
);

export type EncounterFieldsFragment = (
  { __typename?: 'Encounter' }
  & Pick<Encounter, 'id' | 'name' | 'status' | 'duration' | 'startTime' | 'endTime'>
);

export type AuraByCreatureFieldsFragment = (
  { __typename?: 'FilteredCreatureAuraEvents' }
  & Pick<FilteredCreatureAuraEvents, 'count'>
  & { creature: (
    { __typename?: 'Creature' }
    & CreatureFields_Creature_Fragment
  ) | (
    { __typename?: 'Player' }
    & CreatureFields_Player_Fragment
  ) }
);

export type LocationFieldsFragment = (
  { __typename?: 'Location' }
  & Pick<Location, 'time' | 'x' | 'y'>
);

export type CreatureInstantFieldsFragment = (
  { __typename?: 'CreatureInstant' }
  & { creature: (
    { __typename?: 'Creature' }
    & CreatureFields_Creature_Fragment
  ) | (
    { __typename?: 'Player' }
    & CreatureFields_Player_Fragment
  ), location: (
    { __typename?: 'Location' }
    & LocationFieldsFragment
  ) }
);

export type AuraEventWithInstantFieldsFragment = (
  { __typename?: 'AuraEvent' }
  & Pick<AuraEvent, 'time'>
  & { target: (
    { __typename?: 'Creature' }
    & CreatureFields_Creature_Fragment
  ) | (
    { __typename?: 'Player' }
    & CreatureFields_Player_Fragment
  ), instant: (
    { __typename?: 'Instant' }
    & { creatures: Array<(
      { __typename?: 'CreatureInstant' }
      & CreatureInstantFieldsFragment
    )> }
  ) }
);

export type HealingTableQueryVariables = {
  id: Scalars['Float'];
  source?: Maybe<CreatureFilters>;
  target?: Maybe<CreatureFilters>;
  sourceGuid?: Maybe<Scalars['String']>;
  targetGuid?: Maybe<Scalars['String']>;
  sourceName?: Maybe<Scalars['String']>;
  targetName?: Maybe<Scalars['String']>;
  bySource: Scalars['Boolean'];
  byTarget: Scalars['Boolean'];
  bySpell: Scalars['Boolean'];
};


export type HealingTableQuery = (
  { __typename?: 'Query' }
  & { Encounter: (
    { __typename?: 'Encounter' }
    & { filteredEvents: (
      { __typename?: 'FilteredEvents' }
      & { filterHealing: (
        { __typename?: 'FilteredEvents' }
        & { filterSource: (
          { __typename?: 'FilteredEvents' }
          & { filterTarget: (
            { __typename?: 'FilteredEvents' }
            & { bySource: Array<(
              { __typename?: 'CreatureEvents' }
              & BySourceFieldsFragment
            )>, byTarget: Array<(
              { __typename?: 'CreatureEvents' }
              & ByTargetFieldsFragment
            )>, bySpell: Array<(
              { __typename?: 'SpellEvents' }
              & BySpellFieldsFragment
            )> }
          ) }
        ) }
      ) }
    ) }
    & EncounterFieldsFragment
  ) }
);

export type WraithionReportCardQueryVariables = {
  id: Scalars['Float'];
};


export type WraithionReportCardQuery = (
  { __typename?: 'Query' }
  & { Encounter: (
    { __typename?: 'Encounter' }
    & Pick<Encounter, 'name'>
    & { breath: (
      { __typename?: 'FilteredAuraEvents' }
      & { filterAuraID: (
        { __typename?: 'FilteredAuraEvents' }
        & { filterApplied: (
          { __typename?: 'FilteredAuraEvents' }
          & { byTarget: Array<(
            { __typename?: 'FilteredCreatureAuraEvents' }
            & AuraByCreatureFieldsFragment
          )> }
        ) }
      ) }
    ), tail: (
      { __typename?: 'FilteredEvents' }
      & { filterSpell: (
        { __typename?: 'FilteredEvents' }
        & { byTarget: Array<(
          { __typename?: 'CreatureEvents' }
          & CreatureEventsFieldsFragment
        )> }
      ) }
    ), incineration: (
      { __typename?: 'FilteredAuraEvents' }
      & { filterAuraID: (
        { __typename?: 'FilteredAuraEvents' }
        & { filterRemoved: (
          { __typename?: 'FilteredAuraEvents' }
          & { events: Array<(
            { __typename?: 'AuraEvent' }
            & AuraEventWithInstantFieldsFragment
          )> }
        ) }
      ) }
    ) }
  ) }
);


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }

      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ICreature": [
      "Creature",
      "Player"
    ],
    "GenericSummableEvents": [
      "FilteredEvents",
      "SpellEvents",
      "CreatureEvents"
    ],
    "GenericFilteredAuraEvents": [
      "FilteredAuraEvents",
      "FilteredCreatureAuraEvents"
    ]
  }
};

      export default result;
    