import iconBundler from 'icon-bundler';
import path from 'node:path';
import fs from 'node:fs';
import process from 'node:process';

import packageJson from '../package.json' with { type: 'json' };

const resolveTo = (() => {
  const dirname = process.cwd();
  return (...parts: string[]) => path.resolve(dirname, ...parts);
})();

(async () => {
  const sourceDir = resolveTo('src/user-symbols');
  const tmpSrc = resolveTo('package/svg');
  if (fs.existsSync(tmpSrc)) {
    fs.rmSync(tmpSrc, { recursive: true });
  }
  fs.mkdirSync(tmpSrc, { recursive: true });

  let count = 0;
  for (const name of fs.readdirSync(sourceDir)) {
    if (name.endsWith('.svg')) {
      const targetName = name.replaceAll('.', '_').replace(/_svg$/, '.svg');
      const svgCode = fs.readFileSync(path.join(sourceDir, name), 'utf-8');
      fs.writeFileSync(
        path.join(tmpSrc, targetName),
        svgCode.replace(/<\?xml [\w\W]+?svg11.dtd">/, ''),
      );
      count++;
    }
    if (count > 100) {
      break;
    }
  }

  const fontData = await iconBundler({
    src: tmpSrc, // svg path
    dist: resolveTo('package/webfont'), // output path
    fontName: 'gicons', // font name
    css: true, // Create CSS files.
    outSVGPath: true,
    useNameAsUnicode: true,
    emptyDist: true,
    website: {
      title: 'Icons Bundler',
      links: [
        {
          title: 'Font Class',
          url: 'index.html',
        },
        {
          title: 'Symbol',
          url: 'symbol.html',
        },
        {
          title: 'Unicode',
          url: 'unicode.html',
        },
      ],
      footerInfo:
        `Licensed under MIT. (Yes it\'s free and <a href="${packageJson.repository.url}">open-sourced</a>)`,
    },
  });
  // console.log(fontData);
  console.log('done!');
})();
