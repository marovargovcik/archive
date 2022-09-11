import * as path from 'node:path';

import * as fs from 'fs-extra';
import { marked } from 'marked';
import pug from 'pug';

type Post = {
  author: string;
  content: string;
  description: string;
  name: string;
};

type PostWithFileName = Post & {
  fileName: string;
};

const POSTS_FOLDER = path.join(__dirname, '../../cms/content/posts');
const DIST_FOLDER = path.join(__dirname, '../dist');

const POST_TEMPLATE = path.join(__dirname, 'post.pug');
const HOMEPAGE_TEMPLATE = path.join(__dirname, 'homepage.pug');

(async () => {
  const fileNames = await fs.readdir(POSTS_FOLDER);

  const fileNamesWithoutExtension = fileNames.map((fileName) =>
    fileName.replace('.json', ''),
  );

  const postsWithFileName = await Promise.all(
    fileNamesWithoutExtension.map<Promise<PostWithFileName>>(
      async (fileName) => {
        const filePath = path.join(POSTS_FOLDER, `${fileName}.json`);
        const { default: post } = (await import(filePath)) as { default: Post };
        const parsedContent = marked.parse(post.content);
        return {
          ...post,
          content: parsedContent,
          fileName,
        };
      },
    ),
  );

  for (const postWithFileName of postsWithFileName) {
    const { fileName, ...post } = postWithFileName;
    const html = pug.renderFile(POST_TEMPLATE, post);
    await fs.outputFile(path.join(DIST_FOLDER, `${fileName}.html`), html);
  }

  const html = pug.renderFile(HOMEPAGE_TEMPLATE, { posts: postsWithFileName });
  await fs.outputFile(path.join(DIST_FOLDER, 'index.html'), html);
})();
