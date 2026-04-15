/**
 * Upserts SEO-focused seed blogs into MongoDB (same connection as src/lib/mongodb.js).
 * Run from repo root: npm run seed:seo-blogs
 * Requires network access to reach MongoDB Atlas.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectToDatabase } from '../src/lib/mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const raw = readFileSync(join(__dirname, '../src/data/seo-seed-blogs.json'), 'utf8');
  const posts = JSON.parse(raw);
  if (!Array.isArray(posts) || posts.length === 0) {
    console.error('No posts in seo-seed-blogs.json');
    process.exit(1);
  }

  const { db } = await connectToDatabase();
  const coll = db.collection('blogs');
  const now = new Date();
  let upserted = 0;
  let modified = 0;

  for (const post of posts) {
    const { slug, createdAt: createdAtRaw, ...rest } = post;
    if (!slug) continue;

    const createdAt = createdAtRaw ? new Date(createdAtRaw) : now;
    const doc = {
      ...rest,
      slug,
      status: 'published',
      locale: post.locale || 'en',
      customSchemaJson: post.customSchemaJson || '',
      updatedAt: now,
    };

    const existing = await coll.findOne({ slug });
    if (existing) {
      await coll.updateOne(
        { slug },
        {
          $set: {
            ...doc,
            createdAt: existing.createdAt || createdAt,
          },
        }
      );
      modified += 1;
    } else {
      await coll.insertOne({
        ...doc,
        createdAt,
      });
      upserted += 1;
    }
  }

  console.log(`SEO seed blogs: ${upserted} inserted, ${modified} updated (${posts.length} in file).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
