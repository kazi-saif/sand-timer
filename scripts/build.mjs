import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
// Bundle only application assets. Personal files and deployment exports stay out.
for (const entry of ['index.html', 'css', 'js']) {
  await cp(entry, `dist/${entry}`, { recursive: true });
}
console.log('SAND frontend prepared in dist/');
