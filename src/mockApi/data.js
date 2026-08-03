const IMG = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80';

export const categories = [
  { _id: 'cat-corrugated', name: 'Corrugated Boxes', slug: 'corrugated-boxes', description: 'Heavy-duty corrugated shipping boxes and cartons.' },
  { _id: 'cat-mailer', name: 'Mailer Boxes', slug: 'mailer-boxes', description: 'Branded folding mailer boxes for retail and e-commerce.' },
  { _id: 'cat-poly', name: 'Poly Mailers', slug: 'poly-mailers', description: 'Self-sealing poly mailers and courier bags.' },
  { _id: 'cat-protect', name: 'Wrapping & Protection', slug: 'wrapping-protection', description: 'Bubble wrap, void fill, and protective packaging.' },
  { _id: 'cat-tape', name: 'Packaging Tape & Accessories', slug: 'packaging-tape-accessories', description: 'Tapes, labels, and dispensing accessories.' },
  { _id: 'cat-eco', name: 'Eco-Friendly Packaging', slug: 'eco-friendly-packaging', description: 'Recyclable and compostable packaging solutions.' },
];

const categoryById = Object.fromEntries(categories.map((c) => [c._id, c]));

function product(p) {
  const category = categoryById[p.categoryId];
  return {
    images: [{ url: IMG }],
    image: IMG,
    availabilityStatus: p.stock > 0 ? (p.stock <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
    averageRating: p.rating,
    reviews: [],
    specifications: [
      { key: 'Ply', value: p.ply },
      { key: 'Dimension', value: `${p.dimension} ${p.sizeUnit}` },
      { key: 'GSM', value: `${p.gsm}` },
      { key: 'Color', value: p.color },
      { key: 'Printing', value: p.printingOption },
      { key: 'Bursting Factor', value: `${p.burstingFactor} kg/cm²` },
    ],
    ...p,
    title: p.title,
    name: p.title,
    category: category ? { _id: category._id, name: category.name } : undefined,
  };
}

export const products = [
  product({ _id: 'prod-0001', slug: 'triple-wall-shipping-box-l', categoryId: 'cat-corrugated', title: 'Triple Wall Shipping Box (Large)', description: 'Extra-strength 3-ply corrugated box built for heavy industrial goods and long-haul freight.', price: 145, stock: 320, rating: 4.6, sku: 'SKU-COR-001', ply: 3, dimension: '18x14x12', sizeUnit: 'in', gsm: 220, color: 'Kraft Brown', bundle: 25, unit: 'pcs', gstRate: 18, thickness: '5mm', recyclable: true, printingOption: 'Unprinted', burstingFactor: 18, moq: 100 }),
  product({ _id: 'prod-0002', slug: 'standard-corrugated-carton-m', categoryId: 'cat-corrugated', title: 'Standard Corrugated Carton (Medium)', description: 'Everyday 5-ply carton suited for general e-commerce parcel shipping.', price: 68, stock: 540, rating: 4.4, sku: 'SKU-COR-002', ply: 5, dimension: '12x10x8', sizeUnit: 'in', gsm: 180, color: 'Kraft Brown', bundle: 50, unit: 'pcs', gstRate: 18, thickness: '4mm', recyclable: true, printingOption: 'Single Color Logo', burstingFactor: 14, moq: 200 }),
  product({ _id: 'prod-0003', slug: 'heavy-duty-export-crate-box', categoryId: 'cat-corrugated', title: 'Heavy Duty Export Crate Box', description: '7-ply export-grade box rated for stacked pallet loads and overseas freight.', price: 210, stock: 12, rating: 4.8, sku: 'SKU-COR-003', ply: 7, dimension: '24x18x16', sizeUnit: 'in', gsm: 280, color: 'Kraft Brown', bundle: 10, unit: 'pcs', gstRate: 18, thickness: '7mm', recyclable: true, printingOption: 'Unprinted', burstingFactor: 24, moq: 50 }),

  product({ _id: 'prod-0004', slug: 'custom-kraft-mailer-box', categoryId: 'cat-mailer', title: 'Custom Kraft Mailer Box', description: 'Retail-ready folding mailer box with tuck-in lid, printable on all panels.', price: 22, stock: 890, rating: 4.7, sku: 'SKU-MAI-001', ply: 3, dimension: '10x8x4', sizeUnit: 'in', gsm: 300, color: 'Natural Kraft', bundle: 100, unit: 'pcs', gstRate: 18, thickness: '2mm', recyclable: true, printingOption: 'Full Color Custom', burstingFactor: 10, moq: 300 }),
  product({ _id: 'prod-0005', slug: 'rigid-magnetic-gift-box', categoryId: 'cat-mailer', title: 'Rigid Magnetic Closure Gift Box', description: 'Premium rigid mailer box with magnetic flap closure for luxury unboxing experiences.', price: 58, stock: 260, rating: 4.9, sku: 'SKU-MAI-002', ply: 2, dimension: '9x7x3', sizeUnit: 'in', gsm: 350, color: 'Matte Black', bundle: 50, unit: 'pcs', gstRate: 18, thickness: '3mm', recyclable: false, printingOption: 'Foil Stamped', burstingFactor: 8, moq: 100 }),
  product({ _id: 'prod-0006', slug: 'apparel-folding-mailer-box', categoryId: 'cat-mailer', title: 'Apparel Folding Mailer Box', description: 'Lightweight folding box sized for garments, accessories, and subscription boxes.', price: 18, stock: 1200, rating: 4.5, sku: 'SKU-MAI-003', ply: 3, dimension: '11x8.5x2', sizeUnit: 'in', gsm: 260, color: 'White', bundle: 100, unit: 'pcs', gstRate: 18, thickness: '1.5mm', recyclable: true, printingOption: 'Single Color Logo', burstingFactor: 7, moq: 200 }),

  product({ _id: 'prod-0007', slug: 'self-sealing-poly-mailer-10x13', categoryId: 'cat-poly', title: 'Self-Sealing Poly Mailer (10x13)', description: 'Tear-resistant, water-resistant poly mailer with peel-and-seal adhesive strip.', price: 4, stock: 5400, rating: 4.6, sku: 'SKU-POL-001', ply: 1, dimension: '10x13', sizeUnit: 'in', gsm: 60, color: 'Matte White', bundle: 500, unit: 'pcs', gstRate: 18, thickness: '2.5mil', recyclable: false, printingOption: 'Unprinted', burstingFactor: 4, moq: 1000 }),
  product({ _id: 'prod-0008', slug: 'recycled-poly-mailer-12x15', categoryId: 'cat-poly', title: 'Recycled Poly Mailer (12x15)', description: 'Made from 100% recycled post-consumer resin, ideal for sustainability-focused brands.', price: 6, stock: 3100, rating: 4.5, sku: 'SKU-POL-002', ply: 1, dimension: '12x15', sizeUnit: 'in', gsm: 65, color: 'Grey', bundle: 500, unit: 'pcs', gstRate: 18, thickness: '2.5mil', recyclable: true, printingOption: 'Unprinted', burstingFactor: 4, moq: 1000 }),
  product({ _id: 'prod-0009', slug: 'double-layer-security-courier-bag', categoryId: 'cat-poly', title: 'Double-Layer Security Courier Bag', description: 'Tamper-evident double-layer courier bag with security seal for high-value shipments.', price: 8, stock: 1800, rating: 4.7, sku: 'SKU-POL-003', ply: 2, dimension: '13x16', sizeUnit: 'in', gsm: 80, color: 'Black', bundle: 250, unit: 'pcs', gstRate: 18, thickness: '3mil', recyclable: false, printingOption: 'Tamper Seal Print', burstingFactor: 5, moq: 500 }),

  product({ _id: 'prod-0010', slug: 'air-bubble-wrap-roll', categoryId: 'cat-protect', title: 'Air Bubble Wrap Roll (100ft)', description: 'Cushioning bubble wrap roll for fragile item protection during transit.', price: 34, stock: 410, rating: 4.4, sku: 'SKU-WRA-001', ply: 1, dimension: '100ft x 24in', sizeUnit: 'roll', gsm: 40, color: 'Clear', bundle: 1, unit: 'roll', gstRate: 18, thickness: '3mm bubble', recyclable: true, printingOption: 'Unprinted', burstingFactor: 3, moq: 20 }),
  product({ _id: 'prod-0011', slug: 'foam-void-fill-sheets', categoryId: 'cat-protect', title: 'Foam Void Fill Sheets', description: 'Lightweight foam interleaving sheets to prevent product movement inside cartons.', price: 26, stock: 760, rating: 4.3, sku: 'SKU-WRA-002', ply: 1, dimension: '20x20', sizeUnit: 'in', gsm: 30, color: 'White', bundle: 200, unit: 'sheets', gstRate: 18, thickness: '2mm', recyclable: true, printingOption: 'Unprinted', burstingFactor: 2, moq: 100 }),
  product({ _id: 'prod-0012', slug: 'honeycomb-paper-wrap', categoryId: 'cat-protect', title: 'Honeycomb Paper Wrap', description: 'Plastic-free honeycomb cushioning paper, an eco-friendly bubble wrap alternative.', price: 42, stock: 300, rating: 4.6, sku: 'SKU-WRA-003', ply: 1, dimension: '15in x 50ft', sizeUnit: 'roll', gsm: 70, color: 'Kraft Brown', bundle: 1, unit: 'roll', gstRate: 18, thickness: '2mm', recyclable: true, printingOption: 'Unprinted', burstingFactor: 5, moq: 15 }),

  product({ _id: 'prod-0013', slug: 'brown-packing-tape-2in', categoryId: 'cat-tape', title: 'Brown Packing Tape (2in x 110yd)', description: 'High-tack acrylic adhesive tape for reliable carton sealing.', price: 3, stock: 8200, rating: 4.5, sku: 'SKU-TAP-001', ply: 1, dimension: '2in x 110yd', sizeUnit: 'roll', gsm: 45, color: 'Brown', bundle: 36, unit: 'rolls', gstRate: 18, thickness: '45mic', recyclable: false, printingOption: 'Unprinted', burstingFactor: 1, moq: 72 }),
  product({ _id: 'prod-0014', slug: 'fragile-print-tape', categoryId: 'cat-tape', title: 'Fragile Warning Print Tape', description: 'Pre-printed "FRAGILE / HANDLE WITH CARE" tape for shipments requiring extra care.', price: 5, stock: 2600, rating: 4.6, sku: 'SKU-TAP-002', ply: 1, dimension: '2in x 100yd', sizeUnit: 'roll', gsm: 45, color: 'Red/White', bundle: 36, unit: 'rolls', gstRate: 18, thickness: '45mic', recyclable: false, printingOption: 'Fragile Warning', burstingFactor: 1, moq: 36 }),
  product({ _id: 'prod-0015', slug: 'handheld-tape-dispenser', categoryId: 'cat-tape', title: 'Handheld Carton Tape Dispenser', description: 'Ergonomic handheld dispenser for 2-inch packing tape rolls.', price: 12, stock: 950, rating: 4.2, sku: 'SKU-TAP-003', ply: 1, dimension: 'Standard', sizeUnit: 'unit', gsm: 0, color: 'Yellow', bundle: 1, unit: 'pcs', gstRate: 18, thickness: 'N/A', recyclable: false, printingOption: 'N/A', burstingFactor: 0, moq: 10 }),

  product({ _id: 'prod-0016', slug: 'compostable-mailer-bag', categoryId: 'cat-eco', title: 'Compostable Mailer Bag', description: 'Certified home-compostable mailer bag made from plant-based bioplastic.', price: 9, stock: 1400, rating: 4.7, sku: 'SKU-ECO-001', ply: 1, dimension: '12x15', sizeUnit: 'in', gsm: 70, color: 'Natural', bundle: 250, unit: 'pcs', gstRate: 18, thickness: '3mil', recyclable: true, printingOption: 'Unprinted', burstingFactor: 4, moq: 500 }),
  product({ _id: 'prod-0017', slug: 'recycled-corrugated-box-fsc', categoryId: 'cat-eco', title: 'FSC-Certified Recycled Corrugated Box', description: 'Forest Stewardship Council certified box made from 100% recycled fiber.', price: 74, stock: 480, rating: 4.8, sku: 'SKU-ECO-002', ply: 5, dimension: '14x10x8', sizeUnit: 'in', gsm: 190, color: 'Kraft Brown', bundle: 50, unit: 'pcs', gstRate: 18, thickness: '4mm', recyclable: true, printingOption: 'Soy Ink Logo', burstingFactor: 14, moq: 150 }),
  product({ _id: 'prod-0018', slug: 'biodegradable-packing-peanuts', categoryId: 'cat-eco', title: 'Biodegradable Packing Peanuts', description: 'Starch-based loose-fill void material that dissolves in water, fully biodegradable.', price: 16, stock: 640, rating: 4.3, sku: 'SKU-ECO-003', ply: 1, dimension: 'Bulk', sizeUnit: 'cu.ft', gsm: 0, color: 'White', bundle: 1, unit: 'cu.ft bag', gstRate: 18, thickness: 'N/A', recyclable: true, printingOption: 'N/A', burstingFactor: 0, moq: 5 }),
];

export const demoUserBase = {
  _id: 'user-demo-001',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@zeelinoverseas.com',
  phone: '9999999999',
  role: 'user',
  isEmailVerified: true,
  addresses: [
    { isDefault: true, street: '221 Harbor Industrial Estate', city: 'Ahmedabad', country: 'India', zipCode: '380015' },
  ],
};
