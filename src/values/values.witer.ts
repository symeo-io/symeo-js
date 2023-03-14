import YAML from 'yamljs';
import fs from 'fs';
import path from 'path';

const DEFAULT_VALUES_FILE_NAME = 'symeo.local.yml';

export class ValuesWriter {
  public writeValuesFile(dest: string, values: object): void {
    return fs.writeFileSync(
      path.join(dest, DEFAULT_VALUES_FILE_NAME),
      YAML.stringify(values, Number.MAX_VALUE, 2),
    );
  }
}
