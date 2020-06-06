import { LogFields } from "../parsers/logFields";

interface Item {
  id: number;
  ilvl: number;
  enchants: number[];
  bonuses: number[];
  gems: number[];
}

export class PlayerItemInfo {
  constructor(readonly items: Item[]) {}

  //This is more complicated than this, but will do for now.
  averageILVL(): number {
    const equipped = this.items.filter((i) => i.ilvl > 0);
    const sum = equipped.reduce((a, c) => {
      return a + c.ilvl;
    }, 0);
    return sum / equipped.length;
  }
}

export function parsePlayerItemInfo(fieldsParser: LogFields): PlayerItemInfo {
  const items: Item[] = [];
  for (let i = 0; i < 17; i++) {
    const fields = fieldsParser.getSubfields(i);
    items.push({
      id: fields.parseNumber(0),
      ilvl: fields.parseNumber(1),
      enchants: fields.getSubfields(2).parseNumberArray(),
      bonuses: fields.getSubfields(3).parseNumberArray(),
      gems: fields.getSubfields(4).parseNumberArray(),
    });
  }

  return new PlayerItemInfo(items);
}
