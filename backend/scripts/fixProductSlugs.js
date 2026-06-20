/**
 * Migration script: Fix null slugs on existing products
 * 
 * Run this ONCE to:
 * 1. Drop the old slug unique index that blocks null duplicates
 * 2. Assign unique slugs to any products that have null/empty slugs
 * 3. Recreate the unique index cleanly
 * 
 * Usage: node backend/scripts/fixProductSlugs.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function fixProductSlugs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Step 1: Drop the existing slug index if it exists
    try {
      const indexes = await productsCollection.indexes();
      const slugIndex = indexes.find(idx => idx.key && idx.key.slug !== undefined);
      if (slugIndex) {
        console.log(`Dropping existing slug index: ${slugIndex.name}`);
        await productsCollection.dropIndex(slugIndex.name);
        console.log('Old slug index dropped.');
      } else {
        console.log('No existing slug index found.');
      }
    } catch (e) {
      console.log('Could not drop slug index (may not exist):', e.message);
    }

    // Step 2: Fix all products with null/empty slugs
    const productsWithNullSlug = await productsCollection.find({
      $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }]
    }).toArray();

    console.log(`Found ${productsWithNullSlug.length} products with null/empty slugs.`);

    for (const product of productsWithNullSlug) {
      const title = product.title || 'untitled-product';
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      const suffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const newSlug = `${baseSlug}-${suffix}`;

      await productsCollection.updateOne(
        { _id: product._id },
        { $set: { slug: newSlug } }
      );
      console.log(`  Fixed: "${title}" -> slug: "${newSlug}"`);
    }

    // Step 3: Recreate unique index
    await productsCollection.createIndex({ slug: 1 }, { unique: true });
    console.log('Recreated slug unique index.');

    console.log('\nDone! All product slugs are now unique and the index is clean.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

fixProductSlugs();
