import { LogFields } from "../parsers/logFields";
import { parsePlayerItemInfo, PlayerItemInfo } from "./playerItemInfo";
import { Encounter } from "./encounter";
import {Creature, ICreature} from "./creature";
import {Field, ObjectType, registerEnumType} from "type-graphql";

interface PlayerStats {
  strength: number;
  agility: number;
  stamina: number;
  intelligence: number;
  dodge: number;
  parry: number;
  block: number;
  critMelee: number;
  critRanged: number;
  critSpell: number;
  speed: number;
  leech: number;
  hasteMelee: number;
  hasteRanged: number;
  hasteSpell: number;
  avoidance: number;
  mastery: number;
  versatilityDamageDone: number;
  versatilityHealingDone: number;
  versatilityDamageTaken: number;
  armour: number;
}

interface PlayerTalents {
  level15: number;
  level30: number;
  level45: number;
  level60: number;
  level75: number;
  level90: number;
  level100: number;
}

interface PVPTalents {
  talent1: number;
  talent2: number;
  talent3: number;
  talent4: number;
}

interface BFAEssence {
  id: number;
  level: number;
  slot: number;
}

type BFAEssences = Array<BFAEssence>;

export enum PlayerRoles {
  Damage = 1,
  Tank  = 2,
  Healer = 4,
}

registerEnumType(PlayerRoles, {
  name: "PlayerRoles", // this one is mandatory
});

@ObjectType({ simpleResolvers: true })
export class SpecClassInfo {
  @Field()
  public specName: string
  @Field()
  public specIconURL: string
  @Field(type => PlayerRoles)
  public role: PlayerRoles
  @Field()
  public classID: number
  @Field()
  public className: string
  @Field()
  public classIconURL: string

  constructor(specName: string,
              specIconURL: string,
              role: PlayerRoles,
              classID: number,
              className: string,
              classIconURL: string) {

    this.specName = specName
    this.specIconURL = specIconURL
    this.role = role
    this.classID = classID
    this.className = className
    this.classIconURL = classIconURL
  }

}

@ObjectType({ implements: ICreature, simpleResolvers: true })
export class Player extends ICreature {
  public stats?: PlayerStats;
  @Field()
  public spec?: number;
  public talents?: PlayerTalents;
  public pvpTalents?: PVPTalents;
  public bfaEssences?: BFAEssences;
  public items?: PlayerItemInfo;
}

export function PlayerParser(
  fieldsParser: LogFields,
  encounter: Encounter
): void {
  const guid = fieldsParser.parseString(0);

  const stats: PlayerStats = {
    strength: fieldsParser.parseNumber(2),
    agility: fieldsParser.parseNumber(3),
    stamina: fieldsParser.parseNumber(4),
    intelligence: fieldsParser.parseNumber(5),
    dodge: fieldsParser.parseNumber(6),
    parry: fieldsParser.parseNumber(7),
    block: fieldsParser.parseNumber(8),
    critMelee: fieldsParser.parseNumber(9),
    critRanged: fieldsParser.parseNumber(10),
    critSpell: fieldsParser.parseNumber(11),
    speed: fieldsParser.parseNumber(12),
    leech: fieldsParser.parseNumber(13),
    hasteMelee: fieldsParser.parseNumber(14),
    hasteRanged: fieldsParser.parseNumber(15),
    hasteSpell: fieldsParser.parseNumber(16),
    avoidance: fieldsParser.parseNumber(17),
    mastery: fieldsParser.parseNumber(18),
    versatilityDamageDone: fieldsParser.parseNumber(19),
    versatilityHealingDone: fieldsParser.parseNumber(20),
    versatilityDamageTaken: fieldsParser.parseNumber(21),
    armour: fieldsParser.parseNumber(22),
  };

  const spec = fieldsParser.parseNumber(23);

  const talentFields = fieldsParser.getSubfields(24);

  const talents: PlayerTalents = {
    level15: talentFields.parseNumber(0),
    level30: talentFields.parseNumber(1),
    level45: talentFields.parseNumber(2),
    level60: talentFields.parseNumber(3),
    level75: talentFields.parseNumber(4),
    level90: talentFields.parseNumber(5),
    level100: talentFields.parseNumber(6),
  };

  const pvpTalentFields = fieldsParser.getSubfields(25);

  const pvpTalents: PVPTalents = {
    talent1: pvpTalentFields.parseNumber(0),
    talent2: pvpTalentFields.parseNumber(1),
    talent3: pvpTalentFields.parseNumber(2),
    talent4: pvpTalentFields.parseNumber(3),
  };

  let itemFields
  let bfaEssences
  if(fieldsParser.length() === 34) {
    const bfaEssencesFields = fieldsParser.getSubfields(27);
    itemFields = fieldsParser.getSubfields(28);

    bfaEssences = [
      {
        id: bfaEssencesFields.parseNumber(0),
        level: bfaEssencesFields.parseNumber(1),
        slot: bfaEssencesFields.parseNumber(2),
      },
      {
        id: bfaEssencesFields.parseNumber(3),
        level: bfaEssencesFields.parseNumber(4),
        slot: bfaEssencesFields.parseNumber(5),
      },
      {
        id: bfaEssencesFields.parseNumber(6),
        level: bfaEssencesFields.parseNumber(7),
        slot: bfaEssencesFields.parseNumber(8),
      },
      {
        id: bfaEssencesFields.parseNumber(9),
        level: bfaEssencesFields.parseNumber(10),
        slot: bfaEssencesFields.parseNumber(11),
      },
    ];
  } else {
    itemFields = fieldsParser.getSubfields(27);
  }

  const items = parsePlayerItemInfo(itemFields);

  encounter.creatureManager.savePlayerInfo(guid, {
    stats,
    spec,
    talents,
    pvpTalents,
    bfaEssences,
    items,
  } as Partial<Player>);
}
