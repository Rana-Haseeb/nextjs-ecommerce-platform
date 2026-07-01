import connectToDatabase from "./mongodb";
import Product from "./models/Product";

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`;
}

const products = [
  {
    title: "Aurelia Noise-Cancelling Headphones",
    description:
      "Over-ear headphones with adaptive noise cancellation, 40-hour battery life, and a memory-foam headband wrapped in vegan leather.",
    price: 199.99,
    images: [
      unsplash("1505740420928-5e560c06d30e"),
      unsplash("1583394838336-acd977736f90"),
    ],
    category: "Electronics",
    stock: 24,
  },
  {
    title: "Pulse Smart Fitness Watch",
    description:
      "A minimalist fitness companion with heart-rate tracking, sleep analysis, and seven days of battery on a single charge.",
    price: 149.99,
    images: [
      unsplash("1523275335684-37898b6baf30"),
      unsplash("1544117519-31a4b719223d"),
    ],
    category: "Electronics",
    stock: 3,
  },
  {
    title: "Marchetti Leather Crossbody Bag",
    description:
      "Full-grain Italian leather crossbody with a brushed-brass clasp, hand-stitched edges, and a suede-lined interior.",
    price: 89.99,
    images: [
      unsplash("1548036328-c9fa89d128fa"),
      unsplash("1591561954557-26941169b49e"),
    ],
    category: "Accessories",
    stock: 15,
  },
  {
    title: "Solstice Minimalist Analog Watch",
    description:
      "A sandblasted stainless steel case paired with a sapphire crystal face and an interchangeable Italian leather strap.",
    price: 120.0,
    images: [
      unsplash("1524805444758-089113d48a6d"),
      unsplash("1533139502658-0198f920d8e8"),
    ],
    category: "Accessories",
    stock: 0,
  },
  {
    title: "Wren Organic Cotton Hoodie",
    description:
      "A heavyweight fleece hoodie cut from GOTS-certified organic cotton, garment-dyed for a soft, lived-in feel.",
    price: 59.99,
    images: [
      unsplash("1620799140408-edc6dcb6d633"),
      unsplash("1556905055-8f358a7a47b2"),
    ],
    category: "Fashion",
    stock: 42,
  },
  {
    title: "Harbour Classic Denim Jacket",
    description:
      "A rigid selvedge denim jacket built on a vintage silhouette, finished with corozo buttons and chainstitched hems.",
    price: 79.99,
    images: [
      unsplash("1551028719-00167b16eac5"),
      unsplash("1543076447-215ad9ba6923"),
    ],
    category: "Fashion",
    stock: 8,
  },
  {
    title: "Kessler Ceramic Pour-Over Set",
    description:
      "A hand-thrown stoneware dripper and carafe pairing, glazed matte white, designed with a resident ceramicist.",
    price: 45.0,
    images: [
      unsplash("1544787219-7f47ccb76574"),
      unsplash("1495474472287-4d71bcdd2085"),
    ],
    category: "Home & Kitchen",
    stock: 19,
  },
  {
    title: "Nordlys Table Lamp",
    description:
      "An oak and opal-glass table lamp with a warm dimmable glow, inspired by Scandinavian mid-century forms.",
    price: 65.0,
    images: [
      unsplash("1507473885765-e6ed057f782c"),
      unsplash("1513506003901-1e6a229e2d15"),
    ],
    category: "Home & Kitchen",
    stock: 5,
  },
  {
    title: "Terra Natural Skincare Set",
    description:
      "A four-piece ritual of cleanser, toner, serum, and balm, formulated with botanical extracts and zero synthetic fragrance.",
    price: 54.99,
    images: [
      unsplash("1571781926291-c477ebfd024b"),
      unsplash("1608248543803-ba4f8c70ae0b"),
    ],
    category: "Beauty",
    stock: 30,
  },
  {
    title: "Rouge Matte Lipstick Trio",
    description:
      "Three long-wear matte lipsticks in a curated seasonal palette, formulated with jojoba oil for a weightless finish.",
    price: 28.0,
    images: [
      unsplash("1586495777744-4413f21062fa"),
      unsplash("1522335789203-aabd1fc54bc9"),
    ],
    category: "Beauty",
    stock: 0,
  },
  {
    title: "Aro Yoga Mat with Carry Strap",
    description:
      "A 5mm natural rubber mat with a moisture-wicking microfiber top layer and a woven cotton carry strap.",
    price: 34.99,
    images: [
      unsplash("1544367567-0f2fcb009e0b"),
      unsplash("1601925260368-ae2f83cf8b7f"),
    ],
    category: "Sports",
    stock: 27,
  },
  {
    title: "Basecamp Insulated Steel Bottle",
    description:
      "Double-wall vacuum insulated stainless steel, keeps drinks cold for 24 hours or hot for 12, powder-coated finish.",
    price: 24.99,
    images: [unsplash("1602143407151-7111542de6e8")],
    category: "Sports",
    stock: 61,
  },
];

async function seed() {
  await connectToDatabase();

  await Product.deleteMany({});
  const created = await Product.insertMany(products);

  console.log(`Seeded ${created.length} products into the database.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
