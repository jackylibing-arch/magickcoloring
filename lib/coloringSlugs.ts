// Programmatic SEO seed list for /coloring-pages/[slug].
// 200 keywords across 3 tiers. Each entry produces ONE landing page with
// 8 generated coloring images.
//
// Tier 1 (50): high-volume primary topics (e.g. "unicorn coloring pages")
// Tier 2 (100): mid-volume modifier combinations ("unicorn coloring pages for kids")
// Tier 3 (50): low-volume long-tail ("easy unicorn coloring pages for 4 year olds")
//
// `topic` is the human noun phrase used in headings + image prompts.
// `slug` is the URL path segment.
// `title` is the H1 / SEO title.
// `description` is the meta description (150-160 chars).
// `prompts` are the 8 scene fragments fed to fal.ai. Keep them simple and
// distinct so the gallery doesn't look samey.

export type ColoringSlug = {
  slug: string;
  topic: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  prompts: string[];
};

// Helper to keep entries terse.
function entry(
  tier: 1 | 2 | 3,
  slug: string,
  topic: string,
  title: string,
  description: string,
  prompts: string[]
): ColoringSlug {
  return { tier, slug, topic, title, description, prompts };
}

// Standard 8-prompt set generator for animal/character topics.
// We pass scene noun fragments; falImage.buildBookPagePrompt wraps them
// in the full coloring-book style prompt.
function animalPromptSet(animal: string): string[] {
  return [
    `a cute friendly ${animal} smiling`,
    `a baby ${animal} sitting in grass`,
    `a ${animal} family — mom and baby together`,
    `a happy ${animal} playing with a ball`,
    `a ${animal} sleeping curled up`,
    `a ${animal} jumping in the air`,
    `a cartoon ${animal} wearing a small hat`,
    `a ${animal} surrounded by flowers and butterflies`,
  ];
}

function vehiclePromptSet(vehicle: string): string[] {
  return [
    `a big friendly cartoon ${vehicle}`,
    `a ${vehicle} on a winding road`,
    `a ${vehicle} with cute headlight eyes`,
    `a small ${vehicle} carrying balloons`,
    `a ${vehicle} parked in front of a house`,
    `a ${vehicle} driving through the mountains`,
    `a ${vehicle} at sunset with clouds`,
    `a ${vehicle} with stars and sparkles around it`,
  ];
}

// =====================================================================
// TIER 1 — high-volume primary topics (50)
// =====================================================================

const TIER1: ColoringSlug[] = [
  entry(1, 'unicorn-coloring-pages', 'unicorn',
    'Free Unicorn Coloring Pages — Printable PDF',
    'Free printable unicorn coloring pages for kids. Download high-quality line art instantly. No signup required — 8 unique unicorn designs to print and color.',
    [
      'a cute baby unicorn with a flowing mane',
      'a unicorn standing in a magical meadow with flowers',
      'a unicorn flying through clouds with stars',
      'a unicorn drinking from a sparkling pond',
      'a princess riding a smiling unicorn',
      'a unicorn family — mom and baby unicorn',
      'a unicorn with a rainbow arching overhead',
      'a unicorn surrounded by butterflies and hearts',
    ]),

  entry(1, 'dinosaur-coloring-pages', 'dinosaur',
    'Free Dinosaur Coloring Pages — Printable PDF',
    'Free printable dinosaur coloring pages for kids. T-Rex, Triceratops, Brontosaurus and more. Instant download, no signup, perfect for ages 3-10.',
    [
      'a friendly cartoon T-Rex smiling',
      'a long-necked Brontosaurus eating leaves from a tall tree',
      'a Triceratops with three horns standing in a jungle',
      'a Stegosaurus walking by a volcano',
      'a baby dinosaur hatching from an egg',
      'a Pterodactyl flying over palm trees',
      'a group of friendly dinosaurs together',
      'a small dinosaur wearing a tiny hat',
    ]),

  entry(1, 'princess-coloring-pages', 'princess',
    'Free Princess Coloring Pages — Printable PDF',
    'Free printable princess coloring pages for kids. Castles, crowns, magical dresses and more. Instant PDF download, no signup, kid-friendly designs.',
    [
      'a smiling princess with a tall crown and a flowing dress',
      'a princess waving from a tall castle window',
      'a princess holding a magic wand with sparkles',
      'a princess dancing at a royal ball',
      'a princess riding a friendly horse',
      'a princess in a garden of roses',
      'a princess and a small dragon being friends',
      'a princess sitting on a throne with a small puppy',
    ]),

  entry(1, 'mermaid-coloring-pages', 'mermaid',
    'Free Mermaid Coloring Pages — Printable PDF',
    'Free printable mermaid coloring pages for kids. Underwater scenes, mermaid princesses, dolphins and seashells. Instant PDF download, no signup.',
    [
      'a smiling mermaid with long flowing hair',
      'a mermaid sitting on a rock by the ocean',
      'a mermaid swimming with a friendly dolphin',
      'a baby mermaid playing with seahorses',
      'a mermaid princess wearing a crown of pearls',
      'a mermaid surrounded by colorful fish',
      'a mermaid holding a glowing seashell',
      'a mermaid resting in a coral garden',
    ]),

  entry(1, 'butterfly-coloring-pages', 'butterfly',
    'Free Butterfly Coloring Pages — Printable PDF',
    'Free printable butterfly coloring pages for kids. Beautiful butterfly designs ranging from simple to detailed. Instant PDF download, no signup needed.',
    [
      'a single big butterfly with patterned wings',
      'a butterfly on a sunflower',
      'a swarm of butterflies in a garden',
      'a butterfly with hearts on its wings',
      'a baby butterfly emerging from a cocoon',
      'a butterfly resting on a child\'s hand',
      'a fairy with butterfly wings',
      'a butterfly on a tulip with sparkles around it',
    ]),

  entry(1, 'cat-coloring-pages', 'cat',
    'Free Cat Coloring Pages — Printable PDF',
    'Free printable cat coloring pages for kids and adults. Kittens, cute cats, sleeping cats and more. Instant PDF download, no signup required.',
    animalPromptSet('cat')),

  entry(1, 'dog-coloring-pages', 'dog',
    'Free Dog Coloring Pages — Printable PDF',
    'Free printable dog coloring pages for kids. Puppies, labradors, cute cartoon dogs and more. Instant PDF download, no signup, all ages.',
    animalPromptSet('dog')),

  entry(1, 'horse-coloring-pages', 'horse',
    'Free Horse Coloring Pages — Printable PDF',
    'Free printable horse coloring pages for kids. Beautiful horses, ponies, foals and more. Instant PDF download, no signup, perfect for horse lovers.',
    animalPromptSet('horse')),

  entry(1, 'rabbit-coloring-pages', 'rabbit',
    'Free Rabbit Coloring Pages — Printable PDF',
    'Free printable rabbit and bunny coloring pages for kids. Cute bunnies, baby rabbits and Easter scenes. Instant PDF download, no signup.',
    animalPromptSet('rabbit')),

  entry(1, 'fox-coloring-pages', 'fox',
    'Free Fox Coloring Pages — Printable PDF',
    'Free printable fox coloring pages for kids. Cute baby foxes, woodland foxes and cartoon foxes. Instant PDF download, no signup needed.',
    animalPromptSet('fox')),

  entry(1, 'owl-coloring-pages', 'owl',
    'Free Owl Coloring Pages — Printable PDF',
    'Free printable owl coloring pages for kids. Big-eyed owls, baby owls, woodland owls. Instant PDF download, no signup, perfect for ages 3-10.',
    animalPromptSet('owl')),

  entry(1, 'lion-coloring-pages', 'lion',
    'Free Lion Coloring Pages — Printable PDF',
    'Free printable lion coloring pages for kids. King of the jungle scenes, cute baby lions and more. Instant PDF download, no signup needed.',
    animalPromptSet('lion')),

  entry(1, 'tiger-coloring-pages', 'tiger',
    'Free Tiger Coloring Pages — Printable PDF',
    'Free printable tiger coloring pages for kids. Striped tigers, baby tiger cubs and jungle scenes. Instant PDF download, no signup needed.',
    animalPromptSet('tiger')),

  entry(1, 'elephant-coloring-pages', 'elephant',
    'Free Elephant Coloring Pages — Printable PDF',
    'Free printable elephant coloring pages for kids. Big friendly elephants, baby elephants and family scenes. Instant PDF download, no signup.',
    animalPromptSet('elephant')),

  entry(1, 'panda-coloring-pages', 'panda',
    'Free Panda Coloring Pages — Printable PDF',
    'Free printable panda coloring pages for kids. Cute pandas, baby pandas and bamboo scenes. Instant PDF download, no signup needed.',
    animalPromptSet('panda')),

  entry(1, 'shark-coloring-pages', 'shark',
    'Free Shark Coloring Pages — Printable PDF',
    'Free printable shark coloring pages for kids. Friendly cartoon sharks, baby sharks, ocean scenes. Instant PDF download, no signup.',
    animalPromptSet('shark')),

  entry(1, 'dolphin-coloring-pages', 'dolphin',
    'Free Dolphin Coloring Pages — Printable PDF',
    'Free printable dolphin coloring pages for kids. Smiling dolphins, ocean scenes and underwater fun. Instant PDF download, no signup.',
    animalPromptSet('dolphin')),

  entry(1, 'turtle-coloring-pages', 'turtle',
    'Free Turtle Coloring Pages — Printable PDF',
    'Free printable turtle coloring pages for kids. Sea turtles, baby turtles and tortoises. Instant PDF download, no signup needed.',
    animalPromptSet('turtle')),

  entry(1, 'dragon-coloring-pages', 'dragon',
    'Free Dragon Coloring Pages — Printable PDF',
    'Free printable dragon coloring pages for kids. Friendly cartoon dragons, baby dragons, fire-breathing dragons and more. Instant PDF download.',
    [
      'a friendly cartoon dragon smiling',
      'a baby dragon hatching from an egg',
      'a dragon flying through clouds',
      'a dragon sitting on a pile of treasure',
      'a knight and a friendly dragon being friends',
      'a small dragon breathing tiny puffs of fire',
      'a dragon curled up sleeping',
      'a dragon with butterfly wings',
    ]),

  entry(1, 'fairy-coloring-pages', 'fairy',
    'Free Fairy Coloring Pages — Printable PDF',
    'Free printable fairy coloring pages for kids. Magical fairies, fairy gardens, butterfly wings and sparkles. Instant PDF download, no signup.',
    [
      'a small fairy with delicate wings sitting on a flower',
      'a fairy holding a magic wand with sparkles',
      'a fairy fluttering above a mushroom',
      'a fairy princess with a tiny crown',
      'a tooth fairy with a tiny pillow',
      'a fairy hugging a friendly butterfly',
      'a fairy garden with little doors in tree trunks',
      'a fairy resting in a tulip',
    ]),

  entry(1, 'space-coloring-pages', 'space',
    'Free Space Coloring Pages — Printable PDF',
    'Free printable space coloring pages for kids. Astronauts, rockets, planets and aliens. Instant PDF download, no signup, perfect for space lovers.',
    [
      'a smiling astronaut floating in space',
      'a rocket blasting off with smoke clouds',
      'a friendly alien waving from a flying saucer',
      'a planet with rings and stars around it',
      'a child in a space helmet on the moon',
      'a galaxy with planets and shooting stars',
      'a robot exploring a strange planet',
      'an astronaut planting a flag on the moon',
    ]),

  entry(1, 'rocket-coloring-pages', 'rocket',
    'Free Rocket Coloring Pages — Printable PDF',
    'Free printable rocket coloring pages for kids. Space rockets, blast-offs and space travel. Instant PDF download, no signup needed.',
    vehiclePromptSet('rocket')),

  entry(1, 'car-coloring-pages', 'car',
    'Free Car Coloring Pages — Printable PDF',
    'Free printable car coloring pages for kids. Race cars, cartoon cars, family cars and more. Instant PDF download, no signup needed.',
    vehiclePromptSet('car')),

  entry(1, 'truck-coloring-pages', 'truck',
    'Free Truck Coloring Pages — Printable PDF',
    'Free printable truck coloring pages for kids. Monster trucks, fire trucks, dump trucks and more. Instant PDF download, no signup.',
    vehiclePromptSet('truck')),

  entry(1, 'fire-truck-coloring-pages', 'fire truck',
    'Free Fire Truck Coloring Pages — Printable PDF',
    'Free printable fire truck coloring pages for kids. Big red fire engines, firefighters and ladders. Instant PDF download, no signup.',
    vehiclePromptSet('fire truck')),

  entry(1, 'monster-truck-coloring-pages', 'monster truck',
    'Free Monster Truck Coloring Pages — Printable PDF',
    'Free printable monster truck coloring pages for kids. Big wheels, mud and air. Instant PDF download, no signup needed.',
    vehiclePromptSet('monster truck')),

  entry(1, 'airplane-coloring-pages', 'airplane',
    'Free Airplane Coloring Pages — Printable PDF',
    'Free printable airplane coloring pages for kids. Passenger planes, jets and biplanes. Instant PDF download, no signup needed.',
    vehiclePromptSet('airplane')),

  entry(1, 'train-coloring-pages', 'train',
    'Free Train Coloring Pages — Printable PDF',
    'Free printable train coloring pages for kids. Steam trains, modern trains, train tracks and tunnels. Instant PDF download, no signup.',
    vehiclePromptSet('train')),

  entry(1, 'tractor-coloring-pages', 'tractor',
    'Free Tractor Coloring Pages — Printable PDF',
    'Free printable tractor coloring pages for kids. Farm tractors and farm scenes. Instant PDF download, no signup needed.',
    vehiclePromptSet('tractor')),

  entry(1, 'flower-coloring-pages', 'flower',
    'Free Flower Coloring Pages — Printable PDF',
    'Free printable flower coloring pages for kids and adults. Roses, sunflowers, tulips and bouquets. Instant PDF download, no signup.',
    [
      'a single big sunflower',
      'a bouquet of roses in a vase',
      'a row of tulips in a garden',
      'a daisy with smiling face',
      'a flower with bees buzzing around it',
      'a flower with butterflies on its petals',
      'a flowerpot full of daffodils',
      'a wreath of mixed flowers',
    ]),

  entry(1, 'rainbow-coloring-pages', 'rainbow',
    'Free Rainbow Coloring Pages — Printable PDF',
    'Free printable rainbow coloring pages for kids. Rainbows, clouds, hearts and pots of gold. Instant PDF download, no signup needed.',
    [
      'a big rainbow with two clouds at the ends',
      'a rainbow with a pot of gold',
      'a rainbow with stars around it',
      'a rainbow with hearts',
      'a unicorn standing under a rainbow',
      'a rainbow with raindrops',
      'a rainbow over mountains',
      'a rainbow with butterflies',
    ]),

  entry(1, 'christmas-coloring-pages', 'Christmas',
    'Free Christmas Coloring Pages — Printable PDF',
    'Free printable Christmas coloring pages for kids. Santa, reindeer, Christmas trees, snowmen and presents. Instant PDF download, no signup.',
    [
      'Santa Claus waving with his bag of toys',
      'a Christmas tree with ornaments and a star on top',
      'a smiling reindeer with a red nose',
      'a snowman with a scarf and carrot nose',
      'a stack of wrapped Christmas presents',
      'an elf decorating a tree',
      'a gingerbread man smiling',
      'a fireplace with stockings hung above it',
    ]),

  entry(1, 'halloween-coloring-pages', 'Halloween',
    'Free Halloween Coloring Pages — Printable PDF',
    'Free printable Halloween coloring pages for kids. Pumpkins, ghosts, witches, bats and trick-or-treaters. Instant PDF download, no signup.',
    [
      'a smiling jack-o-lantern pumpkin',
      'a friendly cartoon ghost waving',
      'a cute little witch with a tall hat',
      'a black cat sitting on a pumpkin',
      'a row of bats flying in front of the moon',
      'a child in a Halloween costume holding a candy bag',
      'a haunted house with friendly ghosts',
      'a candy corn with a smiling face',
    ]),

  entry(1, 'easter-coloring-pages', 'Easter',
    'Free Easter Coloring Pages — Printable PDF',
    'Free printable Easter coloring pages for kids. Easter bunnies, eggs, baskets and chicks. Instant PDF download, no signup needed.',
    [
      'an Easter bunny holding a basket of eggs',
      'a basket full of decorated Easter eggs',
      'a baby chick hatching from an egg',
      'a row of patterned Easter eggs',
      'a bunny in a flower garden',
      'a small chick wearing a tiny bow',
      'a girl hunting for Easter eggs',
      'a bunny with a carrot in its mouth',
    ]),

  entry(1, 'thanksgiving-coloring-pages', 'Thanksgiving',
    'Free Thanksgiving Coloring Pages — Printable PDF',
    'Free printable Thanksgiving coloring pages for kids. Turkeys, pumpkins, pilgrims and harvest scenes. Instant PDF download, no signup.',
    [
      'a smiling turkey with colorful tail feathers',
      'a cornucopia overflowing with vegetables',
      'a pumpkin pie on a plate',
      'a pilgrim hat with a buckle',
      'a stack of pumpkins on a hay bale',
      'an autumn leaf wreath',
      'a turkey wearing a pilgrim hat',
      'a family table with a turkey in the middle',
    ]),

  entry(1, 'birthday-coloring-pages', 'birthday',
    'Free Birthday Coloring Pages — Printable PDF',
    'Free printable birthday coloring pages for kids. Cakes, balloons, presents and party scenes. Instant PDF download, no signup needed.',
    [
      'a birthday cake with candles on top',
      'a bunch of balloons tied together',
      'a wrapped birthday present with a bow',
      'a party hat with stars on it',
      'a child blowing out birthday candles',
      'a piñata shaped like a star',
      'a cupcake with a candle',
      'a banner that reads HAPPY BIRTHDAY',
    ]),

  entry(1, 'mandala-coloring-pages', 'mandala',
    'Free Mandala Coloring Pages — Printable PDF',
    'Free printable mandala coloring pages for adults and kids. Symmetrical designs, intricate patterns and stress-relief art. Instant PDF download.',
    [
      'a simple flower mandala with 8 petals',
      'a star-shaped mandala with curved lines',
      'a mandala with circles inside circles',
      'a mandala with leaf patterns',
      'a mandala with sun rays',
      'a mandala with hearts',
      'a mandala with crescent moons',
      'a mandala with paisley shapes',
    ]),

  entry(1, 'pumpkin-coloring-pages', 'pumpkin',
    'Free Pumpkin Coloring Pages — Printable PDF',
    'Free printable pumpkin coloring pages for kids. Halloween jack-o-lanterns, harvest pumpkins and pumpkin patches. Instant PDF download.',
    [
      'a single round pumpkin with a stem',
      'a smiling jack-o-lantern',
      'a row of three pumpkins in different sizes',
      'a pumpkin with vines and leaves',
      'a pumpkin patch with several pumpkins',
      'a pumpkin with a witch hat on top',
      'a pumpkin sliced open showing seeds',
      'a pumpkin in a wheelbarrow',
    ]),

  entry(1, 'pokemon-style-coloring-pages', 'monster character',
    'Free Cute Monster Coloring Pages — Printable PDF',
    'Free printable cute monster coloring pages for kids. Friendly cartoon monsters with big eyes. Instant PDF download, no signup needed.',
    [
      'a cute round friendly monster with big eyes',
      'a small spiky monster smiling',
      'a fluffy cartoon monster waving',
      'a tall thin friendly monster',
      'a baby monster sitting on a rock',
      'a monster holding a balloon',
      'a monster with butterfly wings',
      'a group of small monsters playing together',
    ]),

  entry(1, 'preschool-coloring-pages', 'preschool',
    'Free Preschool Coloring Pages — Printable PDF',
    'Free printable preschool coloring pages for ages 3-5. Simple shapes, big outlines, easy designs. Instant PDF download, no signup.',
    [
      'a simple circle smiling face',
      'a big star',
      'a simple house with two windows',
      'a sun with rays',
      'a single big apple with a leaf',
      'a balloon on a string',
      'a simple flower with five petals',
      'a tree with a round top',
    ]),

  entry(1, 'kindergarten-coloring-pages', 'kindergarten',
    'Free Kindergarten Coloring Pages — Printable PDF',
    'Free printable kindergarten coloring pages for ages 4-6. Letters, numbers, animals and easy scenes. Instant PDF download, no signup.',
    [
      'the letter A with an apple',
      'the number 1 with one star',
      'a school bus with kids waving',
      'a backpack with a smiling face',
      'a pencil with a face',
      'a chalkboard with abc on it',
      'a teacher reading to children',
      'a child with a book',
    ]),

  entry(1, 'animal-coloring-pages', 'animal',
    'Free Animal Coloring Pages — Printable PDF',
    'Free printable animal coloring pages for kids. Wild animals, farm animals, sea creatures and pets. Instant PDF download, no signup.',
    [
      'a friendly lion smiling',
      'a giraffe with a long neck',
      'a zebra with stripes',
      'a monkey hanging from a tree',
      'a hippo in the water',
      'a sloth hanging from a branch',
      'a kangaroo with a baby in her pouch',
      'a koala holding a tree',
    ]),

  entry(1, 'farm-animal-coloring-pages', 'farm animal',
    'Free Farm Animal Coloring Pages — Printable PDF',
    'Free printable farm animal coloring pages for kids. Cows, pigs, chickens, sheep and horses. Instant PDF download, no signup needed.',
    [
      'a friendly cow chewing grass',
      'a fat happy pig',
      'a chicken with baby chicks',
      'a sheep with fluffy wool',
      'a horse standing in a field',
      'a goat on a hill',
      'a duck swimming in a pond',
      'a rooster crowing at sunrise',
    ]),

  entry(1, 'ocean-coloring-pages', 'ocean',
    'Free Ocean Coloring Pages — Printable PDF',
    'Free printable ocean coloring pages for kids. Sea creatures, coral reefs, fish and underwater scenes. Instant PDF download, no signup.',
    [
      'a school of fish swimming together',
      'a coral reef with many colors',
      'a friendly octopus waving',
      'a starfish on the sand',
      'a seahorse',
      'a jellyfish floating in the water',
      'an underwater treasure chest',
      'a whale with a small spout of water',
    ]),

  entry(1, 'jungle-coloring-pages', 'jungle',
    'Free Jungle Coloring Pages — Printable PDF',
    'Free printable jungle coloring pages for kids. Wild animals, vines, palm trees and rainforest scenes. Instant PDF download, no signup.',
    [
      'a parrot on a branch',
      'a monkey on a vine',
      'a snake curled around a tree',
      'a friendly jaguar in the grass',
      'a toucan with a big beak',
      'a frog on a leaf',
      'a sloth hanging upside down',
      'a tropical jungle waterfall',
    ]),

  entry(1, 'fish-coloring-pages', 'fish',
    'Free Fish Coloring Pages — Printable PDF',
    'Free printable fish coloring pages for kids. Tropical fish, goldfish, clownfish and aquarium scenes. Instant PDF download, no signup.',
    animalPromptSet('fish')),

  entry(1, 'frog-coloring-pages', 'frog',
    'Free Frog Coloring Pages — Printable PDF',
    'Free printable frog coloring pages for kids. Cute frogs, lily pads and pond scenes. Instant PDF download, no signup needed.',
    animalPromptSet('frog')),

  entry(1, 'penguin-coloring-pages', 'penguin',
    'Free Penguin Coloring Pages — Printable PDF',
    'Free printable penguin coloring pages for kids. Cute penguins, baby penguins and snow scenes. Instant PDF download, no signup.',
    animalPromptSet('penguin')),

  entry(1, 'bear-coloring-pages', 'bear',
    'Free Bear Coloring Pages — Printable PDF',
    'Free printable bear coloring pages for kids. Teddy bears, polar bears, baby bears and forest scenes. Instant PDF download, no signup.',
    animalPromptSet('bear')),
];

// =====================================================================
// TIER 2 — modifier combinations (100)
// =====================================================================
// Format: "<topic> coloring pages for <audience>"
// Audiences: kids, toddlers, adults, preschoolers, girls, boys

const TIER2_BASE: { topic: string; root: string }[] = [
  { topic: 'unicorn', root: 'unicorn' },
  { topic: 'dinosaur', root: 'dinosaur' },
  { topic: 'princess', root: 'princess' },
  { topic: 'mermaid', root: 'mermaid' },
  { topic: 'butterfly', root: 'butterfly' },
  { topic: 'cat', root: 'cat' },
  { topic: 'dog', root: 'dog' },
  { topic: 'horse', root: 'horse' },
  { topic: 'dragon', root: 'dragon' },
  { topic: 'fairy', root: 'fairy' },
  { topic: 'space', root: 'space' },
  { topic: 'car', root: 'car' },
  { topic: 'truck', root: 'truck' },
  { topic: 'flower', root: 'flower' },
  { topic: 'rainbow', root: 'rainbow' },
  { topic: 'Christmas', root: 'christmas' },
  { topic: 'Halloween', root: 'halloween' },
  { topic: 'animal', root: 'animal' },
  { topic: 'ocean', root: 'ocean' },
  { topic: 'shark', root: 'shark' },
];

const TIER2_AUDIENCES: { tag: string; slug: string; descTag: string }[] = [
  { tag: 'for kids',          slug: 'for-kids',          descTag: 'for kids' },
  { tag: 'for toddlers',      slug: 'for-toddlers',      descTag: 'for toddlers (ages 2-4)' },
  { tag: 'for preschoolers',  slug: 'for-preschoolers',  descTag: 'for preschoolers (ages 3-5)' },
  { tag: 'for adults',        slug: 'for-adults',        descTag: 'for adults — detailed designs' },
  { tag: 'for girls',         slug: 'for-girls',         descTag: 'for girls' },
];

const TIER2: ColoringSlug[] = [];
for (const base of TIER2_BASE) {
  for (const aud of TIER2_AUDIENCES) {
    const topicTitle = base.topic.charAt(0).toUpperCase() + base.topic.slice(1);
    const slug = `${base.root}-coloring-pages-${aud.slug}`;
    const title = `Free ${topicTitle} Coloring Pages ${aud.tag.replace('for ', 'for ').replace(/^./, (c) => c.toUpperCase())} — Printable PDF`;
    const description = `Free printable ${base.topic} coloring pages ${aud.descTag}. 8 unique designs, instant download, no signup.`;
    // Reuse the prompt set from Tier 1's matching root entry; if not found, fall back to animalPromptSet.
    const root = TIER1.find((t) => t.slug === `${base.root}-coloring-pages`);
    const prompts = root ? root.prompts : animalPromptSet(base.topic);
    TIER2.push(entry(2, slug, base.topic, title, description, prompts));
  }
}

// =====================================================================
// TIER 3 — long-tail (50)
// =====================================================================

const TIER3_RAW: [string, string, string, string][] = [
  ['easy unicorn coloring pages for 4 year olds', 'easy-unicorn-coloring-pages-for-4-year-olds', 'unicorn', 'Easy unicorn coloring pages designed for 4 year olds. Simple shapes, thick outlines.'],
  ['easy dinosaur coloring pages for 3 year olds', 'easy-dinosaur-coloring-pages-for-3-year-olds', 'dinosaur', 'Easy dinosaur coloring pages designed for 3 year olds. Simple shapes, thick outlines.'],
  ['cute baby unicorn coloring pages', 'cute-baby-unicorn-coloring-pages', 'baby unicorn', 'Cute baby unicorn coloring pages for kids. Adorable designs.'],
  ['simple butterfly coloring pages for kids', 'simple-butterfly-coloring-pages-for-kids', 'simple butterfly', 'Simple butterfly coloring pages for kids. Big shapes, easy to color.'],
  ['cute cat coloring pages for girls', 'cute-cat-coloring-pages-for-girls', 'cute cat', 'Cute cat coloring pages designed for girls. Kittens and cuddly cats.'],
  ['baby shark coloring pages for toddlers', 'baby-shark-coloring-pages-for-toddlers', 'baby shark', 'Baby shark coloring pages for toddlers. Friendly cartoon sharks.'],
  ['mermaid princess coloring pages', 'mermaid-princess-coloring-pages', 'mermaid princess', 'Mermaid princess coloring pages for kids. Underwater royalty.'],
  ['cute fox coloring pages for kids', 'cute-fox-coloring-pages-for-kids', 'cute fox', 'Cute fox coloring pages for kids. Woodland scenes.'],
  ['monster truck coloring pages for boys', 'monster-truck-coloring-pages-for-boys', 'monster truck', 'Monster truck coloring pages designed for boys. Big wheels, big mud.'],
  ['fire truck coloring pages for preschoolers', 'fire-truck-coloring-pages-for-preschoolers', 'fire truck', 'Fire truck coloring pages for preschoolers. Simple, kid-friendly.'],
  ['halloween pumpkin coloring pages for kids', 'halloween-pumpkin-coloring-pages-for-kids', 'halloween pumpkin', 'Halloween pumpkin coloring pages for kids. Jack-o-lanterns and more.'],
  ['christmas tree coloring pages for kids', 'christmas-tree-coloring-pages-for-kids', 'christmas tree', 'Christmas tree coloring pages for kids. Decorated trees, ornaments and stars.'],
  ['easter bunny coloring pages for toddlers', 'easter-bunny-coloring-pages-for-toddlers', 'easter bunny', 'Easter bunny coloring pages for toddlers. Big shapes, easy designs.'],
  ['cute panda coloring pages for kids', 'cute-panda-coloring-pages-for-kids', 'cute panda', 'Cute panda coloring pages for kids. Pandas and bamboo.'],
  ['simple flower coloring pages for preschoolers', 'simple-flower-coloring-pages-for-preschoolers', 'simple flower', 'Simple flower coloring pages for preschoolers. Big shapes.'],
  ['detailed mandala coloring pages for adults', 'detailed-mandala-coloring-pages-for-adults', 'detailed mandala', 'Detailed mandala coloring pages for adults. Intricate stress-relief designs.'],
  ['cute dragon coloring pages for kids', 'cute-dragon-coloring-pages-for-kids', 'cute dragon', 'Cute dragon coloring pages for kids. Friendly cartoon dragons.'],
  ['rainbow unicorn coloring pages', 'rainbow-unicorn-coloring-pages', 'rainbow unicorn', 'Rainbow unicorn coloring pages. Magical unicorns under rainbows.'],
  ['princess castle coloring pages', 'princess-castle-coloring-pages', 'princess castle', 'Princess castle coloring pages. Tall fairytale castles with princesses.'],
  ['baby dinosaur coloring pages', 'baby-dinosaur-coloring-pages', 'baby dinosaur', 'Baby dinosaur coloring pages for kids. Cute hatching dinosaurs.'],
  ['outer space coloring pages for kids', 'outer-space-coloring-pages-for-kids', 'outer space', 'Outer space coloring pages for kids. Astronauts, rockets and aliens.'],
  ['cute owl coloring pages for kids', 'cute-owl-coloring-pages-for-kids', 'cute owl', 'Cute owl coloring pages for kids. Big-eyed forest owls.'],
  ['under the sea coloring pages', 'under-the-sea-coloring-pages', 'under the sea', 'Under the sea coloring pages for kids. Fish, coral, mermaids and more.'],
  ['fairy garden coloring pages', 'fairy-garden-coloring-pages', 'fairy garden', 'Fairy garden coloring pages for kids. Tiny fairies in flower gardens.'],
  ['kawaii animal coloring pages', 'kawaii-animal-coloring-pages', 'kawaii animal', 'Kawaii animal coloring pages. Cute big-eyed cartoon animals.'],
  ['preschool farm animal coloring pages', 'preschool-farm-animal-coloring-pages', 'farm animal', 'Preschool farm animal coloring pages. Cows, pigs and chickens.'],
  ['kindergarten alphabet coloring pages', 'kindergarten-alphabet-coloring-pages', 'alphabet', 'Kindergarten alphabet coloring pages. Letters with matching pictures.'],
  ['number coloring pages for kids', 'number-coloring-pages-for-kids', 'number', 'Number coloring pages for kids. Numbers 1-10 with matching pictures.'],
  ['shape coloring pages for toddlers', 'shape-coloring-pages-for-toddlers', 'shape', 'Shape coloring pages for toddlers. Circles, squares, triangles and stars.'],
  ['summer coloring pages for kids', 'summer-coloring-pages-for-kids', 'summer', 'Summer coloring pages for kids. Beaches, ice cream, sunshine.'],
  ['winter coloring pages for kids', 'winter-coloring-pages-for-kids', 'winter', 'Winter coloring pages for kids. Snowmen, snowflakes and mittens.'],
  ['spring flower coloring pages', 'spring-flower-coloring-pages', 'spring flower', 'Spring flower coloring pages. Tulips, daffodils and cherry blossoms.'],
  ['autumn leaves coloring pages', 'autumn-leaves-coloring-pages', 'autumn leaves', 'Autumn leaves coloring pages. Fall colors, oak and maple leaves.'],
  ['food coloring pages for kids', 'food-coloring-pages-for-kids', 'food', 'Food coloring pages for kids. Pizza, ice cream, fruits and cookies.'],
  ['ice cream coloring pages', 'ice-cream-coloring-pages', 'ice cream', 'Ice cream coloring pages for kids. Cones, sundaes and popsicles.'],
  ['cupcake coloring pages for kids', 'cupcake-coloring-pages-for-kids', 'cupcake', 'Cupcake coloring pages for kids. Sprinkled cupcakes with cherries.'],
  ['donut coloring pages for kids', 'donut-coloring-pages-for-kids', 'donut', 'Donut coloring pages for kids. Glazed and sprinkled donuts.'],
  ['birthday cake coloring pages', 'birthday-cake-coloring-pages', 'birthday cake', 'Birthday cake coloring pages for kids. Layered cakes with candles.'],
  ['robot coloring pages for kids', 'robot-coloring-pages-for-kids', 'robot', 'Robot coloring pages for kids. Friendly cartoon robots.'],
  ['superhero coloring pages for kids', 'superhero-coloring-pages-for-kids', 'superhero', 'Superhero coloring pages for kids. Capes, masks and powers.'],
  ['ninja coloring pages for kids', 'ninja-coloring-pages-for-kids', 'ninja', 'Ninja coloring pages for kids. Stealthy ninja warriors.'],
  ['knight coloring pages for kids', 'knight-coloring-pages-for-kids', 'knight', 'Knight coloring pages for kids. Knights, swords and shields.'],
  ['pirate coloring pages for kids', 'pirate-coloring-pages-for-kids', 'pirate', 'Pirate coloring pages for kids. Pirates, ships and treasure.'],
  ['castle coloring pages for kids', 'castle-coloring-pages-for-kids', 'castle', 'Castle coloring pages for kids. Tall fairytale castles.'],
  ['house coloring pages for kids', 'house-coloring-pages-for-kids', 'house', 'House coloring pages for kids. Cozy houses and homes.'],
  ['tree coloring pages for kids', 'tree-coloring-pages-for-kids', 'tree', 'Tree coloring pages for kids. Forest trees, fruit trees and Christmas trees.'],
  ['sun and moon coloring pages', 'sun-and-moon-coloring-pages', 'sun and moon', 'Sun and moon coloring pages. Smiling suns and crescent moons.'],
  ['heart coloring pages for kids', 'heart-coloring-pages-for-kids', 'heart', 'Heart coloring pages for kids. Hearts and love-themed designs.'],
  ['star coloring pages for kids', 'star-coloring-pages-for-kids', 'star', 'Star coloring pages for kids. Big shining stars and constellations.'],
  ['balloon coloring pages for kids', 'balloon-coloring-pages-for-kids', 'balloon', 'Balloon coloring pages for kids. Bunches of balloons floating up.'],
];

const TIER3: ColoringSlug[] = TIER3_RAW.map(([title, slug, topic, descShort]) =>
  entry(3, slug, topic,
    `${title.charAt(0).toUpperCase() + title.slice(1)} — Printable PDF`,
    `Free printable ${descShort} Instant download, no signup needed.`,
    // Generic 8-prompt set built around the topic. We deliberately keep these
    // varied so the gallery doesn't look samey across pages that share a root.
    [
      `a ${topic} smiling`,
      `a small ${topic} on a white background`,
      `a ${topic} with sparkles around it`,
      `a baby ${topic}`,
      `a ${topic} surrounded by flowers`,
      `a ${topic} with a heart nearby`,
      `a ${topic} with friends`,
      `a cute cartoon ${topic}`,
    ]
  )
);

// =====================================================================

export const COLORING_SLUGS: ColoringSlug[] = [...TIER1, ...TIER2, ...TIER3];

export function getSlug(slug: string): ColoringSlug | undefined {
  return COLORING_SLUGS.find((s) => s.slug === slug);
}
