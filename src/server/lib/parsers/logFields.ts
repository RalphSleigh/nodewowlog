export type Fields = Array<string | Fields>;

export class LogFields {
  constructor(public fields: Fields) {}

  parseString(index: number): string {
    return this.fields[index] as string;
  }

  parseNumber(index: number): number {
    const numberField = this.fields[index] as string;
    return parseInt(numberField);
  }

  parseBoolean(index: number): boolean {
    const field = this.fields[index];
    return field === "1";
  }

  parseNumberArray(): number[] {
    return this.fields.map((f) => parseInt(f as string));
  }

  getSubfields(index: number): LogFields {
    const fields = this.fields[index] as Fields;
    return new LogFields(fields);
  }

  length(): number {
    return this.fields.length
  }
}

export function lineSplitter(line: string): LogFields {
  return new LogFields(readUntil(line[Symbol.iterator]()));
}

function readUntil(
  stream: IterableIterator<string>,
  endCharacter?: string
): Fields {
  const results: Fields = [];
  let currentResult = "";
  let currentChar: string;
  let inQuotes = false;
  for (currentChar of stream) {
    switch (currentChar) {
      case '"':
        if(inQuotes && currentResult.slice(-1) === "\\") {
          currentResult.replace(/\$/,'"')
        }
        inQuotes = !inQuotes;
        break;
      case ",":
        if(inQuotes)currentResult += currentChar;
        else {
          if (currentResult != "") {
            results.push(currentResult.replace(/(^"|"$)/g, ""));
            currentResult = "";
          }
        }
        break;
      case "(":
        results.push(readUntil(stream, ")"));
        break;
      case "[":
        results.push(readUntil(stream, "]"));
        break;
      case endCharacter:
        if (currentResult != "")
          results.push(currentResult.replace(/(^"|"$)/g, ""));
        return results;
      default:
        currentResult += currentChar;
    }
  }

  if (currentResult != "") results.push(currentResult.replace(/(^"|"$)/g, ""));

  return results;
}
