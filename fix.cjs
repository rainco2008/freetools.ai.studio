const fs = require('fs');
let content = fs.readFileSync('src/shot-easy/lib/utils.js', 'utf8');
content = content.replace(/    \}                    \}/g, '');
const startStr = `import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import * as ColorThiefLib from 'colorthief';

class ColorThief {
  getPalette(img, colorCount = 10, quality = 10) {
    if (typeof ColorThiefLib.getPalette === 'function') {
      return ColorThiefLib.getPalette(img, colorCount, quality);
    }
    return [];
  }
  getColor(img, quality = 10) {
    if (typeof ColorThiefLib.getColor === 'function') {
      return ColorThiefLib.getColor(img, quality);
    }
    return [0, 0, 0];
  }
}
`;
content = startStr + content.split("import backgroundConfig from './backgroundConfig';")[1];
content = content.replace("undefined", "import backgroundConfig from './backgroundConfig';\n");
fs.writeFileSync('src/shot-easy/lib/utils.js', content);
