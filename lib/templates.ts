// Story templates for personalized coloring books.
// Each theme = 20 pages. Pages substitute {name} and {age}.
// `scene` is the prompt fragment used for image generation (passed to FLUX).
// For MVP we generate ONE personalized cover image per book on demand,
// and use a pre-generated stock library for the remaining 19 pages.

export type Theme =
  | 'princess'
  | 'dinosaur'
  | 'space'
  | 'unicorn'
  | 'underwater';

export const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'princess', label: 'Princess Adventure', emoji: '👑' },
  { id: 'dinosaur', label: 'Dinosaur Quest', emoji: '🦖' },
  { id: 'space', label: 'Space Journey', emoji: '🚀' },
  { id: 'unicorn', label: 'Unicorn Forest', emoji: '🦄' },
  { id: 'underwater', label: 'Underwater World', emoji: '🐠' },
];

export const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export type StoryPage = {
  pageNumber: number;
  text: string;
  scene: string; // image prompt fragment, used for stock library
};

type RawPage = { text: string; scene: string };

type Template = {
  theme: Theme;
  coverScene: (name: string) => string;
  pages: (name: string, age: number) => RawPage[];
};

const TEMPLATES: Record<Theme, Template> = {
  princess: {
    theme: 'princess',
    coverScene: (name) =>
      `a ${name && ''}smiling young princess with a small crown, holding a magic wand, fairytale castle in the background`,
    pages: (name, age) => [
      { text: `Once upon a time, there was a brave princess named ${name}.`, scene: 'a young princess waving from a castle window' },
      { text: `${name} lived in a tall castle on top of a hill.`, scene: 'a tall fairytale castle on a hill with flags' },
      { text: `One sunny morning, ${name} found a magical map under her pillow.`, scene: 'a princess holding an old treasure map, sunlight through a window' },
      { text: `The map showed a hidden garden deep in the forest.`, scene: 'a mysterious forest with a hidden path leading to a garden' },
      { text: `${name} packed her bag and started her adventure.`, scene: 'a princess with a small backpack walking down a path' },
      { text: `She met a friendly bunny who wanted to come along.`, scene: 'a princess kneeling to greet a bunny with long ears' },
      { text: `Together they crossed a small wooden bridge over a stream.`, scene: 'a princess and a bunny walking across a small wooden bridge' },
      { text: `${name} stopped to smell the wildflowers along the way.`, scene: 'a princess smelling a bouquet of wildflowers in a meadow' },
      { text: `A wise old owl pointed them in the right direction.`, scene: 'a wise owl with big glasses pointing with a wing' },
      { text: `They climbed over a small hill covered in butterflies.`, scene: 'a princess on a hill surrounded by butterflies' },
      { text: `${name} discovered a singing fountain made of stars.`, scene: 'a magical fountain made of stars sparkling brightly' },
      { text: `A tiny dragon with rainbow wings greeted her with a smile.`, scene: 'a small friendly dragon with rainbow wings' },
      { text: `${name} taught the dragon how to dance.`, scene: 'a princess and a small dragon dancing together' },
      { text: `Together they baked cookies for the forest animals.`, scene: 'a princess and a dragon baking cookies on a tree stump' },
      { text: `Squirrels, deer, and rabbits all came to enjoy the cookies.`, scene: 'forest animals gathered around a picnic of cookies' },
      { text: `${name} found the hidden garden at last — it was full of magic flowers!`, scene: 'a princess standing in a magical garden full of flowers' },
      { text: `She picked one flower and made a wish for the whole kingdom.`, scene: 'a princess holding a single flower and closing her eyes to make a wish' },
      { text: `The wish came true and rainbows filled the sky.`, scene: 'a sky filled with rainbows above a magical garden' },
      { text: `${name} returned to the castle with her new dragon friend.`, scene: 'a princess and a dragon walking back toward a castle at sunset' },
      { text: `And they all lived happily ever after. The End.`, scene: 'a princess waving goodnight from a castle window with stars in the sky' },
    ],
  },

  dinosaur: {
    theme: 'dinosaur',
    coverScene: (name) =>
      `a young child explorer holding a paper sign that says \"${name}\", standing next to a friendly cartoon T-Rex`,
    pages: (name, age) => [
      { text: `${name} loved dinosaurs more than anything else.`, scene: 'a child playing with dinosaur toys on the floor' },
      { text: `One day, ${name} found a giant egg in the garden!`, scene: 'a child kneeling next to a large egg in a garden' },
      { text: `The egg started to wiggle and crack.`, scene: 'a large cracking egg with wiggly lines around it' },
      { text: `Out popped a tiny baby dinosaur with big, kind eyes.`, scene: 'a tiny baby dinosaur hatching from an egg' },
      { text: `${name} named the little dino Spike.`, scene: 'a child holding a small baby dinosaur named Spike' },
      { text: `Spike took ${name}'s hand and led the way to a hidden valley.`, scene: 'a child and a small dinosaur walking down a forest path together' },
      { text: `In the valley, they saw a long-necked Brontosaurus eating leaves.`, scene: 'a long-necked brontosaurus eating leaves from a tall tree' },
      { text: `A friendly Triceratops trotted over to say hello.`, scene: 'a friendly triceratops with three horns smiling' },
      { text: `${name} and Spike played hide-and-seek with the dinosaurs.`, scene: 'dinosaurs peeking from behind giant prehistoric ferns' },
      { text: `They climbed onto a Stegosaurus's back and went for a ride.`, scene: 'a child riding on the back of a stegosaurus' },
      { text: `From up high, ${name} could see a sparkling lake.`, scene: 'a sparkling prehistoric lake surrounded by tall plants' },
      { text: `A baby Pterodactyl swooped down to say hi.`, scene: 'a small pterodactyl flying down with friendly eyes' },
      { text: `${name} shared sandwiches with all the dinosaurs.`, scene: 'a child handing out sandwiches to several friendly dinosaurs' },
      { text: `A giant T-Rex came over — but he just wanted a hug!`, scene: 'a friendly cartoon t-rex giving a child a gentle hug' },
      { text: `Spike taught ${name} how to roar like a real dinosaur.`, scene: 'a child and a small dinosaur both roaring with mouths open' },
      { text: `They danced under a waterfall.`, scene: 'a child and a small dinosaur dancing under a waterfall' },
      { text: `${name} drew a picture of all the dinosaur friends.`, scene: 'a child drawing dinosaurs on a big piece of paper' },
      { text: `It was time to go home, but Spike wanted to come too.`, scene: 'a child and a small dinosaur walking together holding hands' },
      { text: `${name} and Spike became best friends forever.`, scene: 'a child hugging a small dinosaur tightly' },
      { text: `The End. Can you draw your own dinosaur friend?`, scene: 'a blank dinosaur outline ready to be filled in' },
    ],
  },

  space: {
    theme: 'space',
    coverScene: (name) =>
      `a young child astronaut in a space helmet, holding a flag that says \"${name}\", standing on the moon with stars in the background`,
    pages: (name, age) => [
      { text: `${name} dreamed of flying to the stars.`, scene: 'a child looking up at a night sky full of stars' },
      { text: `One night, a tiny rocket appeared in the backyard.`, scene: 'a small toy-like rocket landing in a backyard' },
      { text: `${name} put on a space helmet and climbed inside.`, scene: 'a child in a space helmet climbing into a small rocket' },
      { text: `The rocket whooshed up into the sky!`, scene: 'a small rocket blasting off with smoke clouds below' },
      { text: `${name} flew past the moon.`, scene: 'a small rocket flying past a smiling moon' },
      { text: `A friendly alien waved from a tiny green planet.`, scene: 'a small friendly alien waving from a planet' },
      { text: `${name} landed on the moon and bounced around.`, scene: 'a child astronaut bouncing on the surface of the moon' },
      { text: `Moon rabbits came out to play.`, scene: 'cute rabbits hopping on the surface of the moon' },
      { text: `${name} planted a flag with a smiley face on it.`, scene: 'a child planting a small flag with a smiley face on the moon' },
      { text: `Saturn invited ${name} to slide down its rings.`, scene: 'the planet saturn with a child sliding down its rings' },
      { text: `${name} met a tiny rocket-powered cat.`, scene: 'a cute cat wearing a tiny jetpack flying through space' },
      { text: `Together they raced past shooting stars.`, scene: 'a rocket racing past shooting stars and comets' },
      { text: `${name} discovered a secret ice cream planet.`, scene: 'a planet that looks like a giant ice cream sundae' },
      { text: `They had a space picnic with all the alien friends.`, scene: 'a picnic blanket in space with friendly aliens around it' },
      { text: `${name} learned how to read the constellations.`, scene: 'a child pointing at constellations in the night sky' },
      { text: `A friendly comet gave them a free ride.`, scene: 'a smiling comet with children riding on its tail' },
      { text: `${name} discovered a brand new star and named it.`, scene: 'a child pointing at a new bright star in the sky' },
      { text: `It was time to go home, but space waved goodbye.`, scene: 'planets and stars waving with cartoon hands' },
      { text: `${name}'s rocket landed safely back home.`, scene: 'a small rocket landing back in a backyard at sunrise' },
      { text: `The End. The stars will always be ${name}'s friends.`, scene: 'a child waving up at a sky full of stars from a window' },
    ],
  },

  unicorn: {
    theme: 'unicorn',
    coverScene: (name) =>
      `a young child standing next to a small friendly unicorn with a flowing mane, in a magical forest, with the name \"${name}\" written on a banner`,
    pages: (name, age) => [
      { text: `${name} walked into a magical forest one bright morning.`, scene: 'a child walking into a magical forest with sunlight beams' },
      { text: `Suddenly, a tiny baby unicorn stepped out from behind a tree.`, scene: 'a small baby unicorn peeking from behind a tree' },
      { text: `${name} reached out gently and the unicorn nuzzled her hand.`, scene: 'a child gently petting a small unicorn' },
      { text: `The unicorn's name was Luna.`, scene: 'a small unicorn named Luna with a star on her forehead' },
      { text: `Luna led ${name} through fields of glowing flowers.`, scene: 'a child and a unicorn walking through a field of magical flowers' },
      { text: `They crossed a stream made of sparkling diamonds.`, scene: 'a stream made of sparkling water with a unicorn drinking from it' },
      { text: `${name} braided rainbow ribbons into Luna's mane.`, scene: 'a child braiding ribbons into a unicorns long mane' },
      { text: `A pegasus flew down to say hello.`, scene: 'a small pegasus with feathered wings landing softly' },
      { text: `${name} climbed onto Luna's back for a magical ride.`, scene: 'a child riding on the back of a unicorn through the forest' },
      { text: `They flew over a waterfall full of rainbows.`, scene: 'a magical waterfall with rainbows arching over it' },
      { text: `${name} and Luna landed in a fairy village.`, scene: 'a tiny village built into mushrooms with fairies flying around' },
      { text: `The fairies threw a party in their honor.`, scene: 'fairies dancing around a child and a unicorn at a party' },
      { text: `A wise old unicorn shared a magical wish.`, scene: 'an older unicorn with a long beard talking to a child' },
      { text: `${name} made a wish for kindness everywhere.`, scene: 'a child closing her eyes and making a wish, hands together' },
      { text: `The whole forest sparkled when the wish came true.`, scene: 'a forest scene sparkling with magical light everywhere' },
      { text: `Luna gave ${name} a tiny crystal as a gift.`, scene: 'a unicorn handing a small crystal to a child' },
      { text: `${name} promised to come back every weekend.`, scene: 'a child waving goodbye to a unicorn and a forest' },
      { text: `Luna walked her back to the edge of the forest.`, scene: 'a unicorn and a child walking together to the edge of a forest' },
      { text: `${name} kept the crystal close to her heart.`, scene: 'a child holding a small glowing crystal to her chest' },
      { text: `The End. Magic is real if you believe.`, scene: 'a child standing under a starry sky with a small crystal glowing' },
    ],
  },

  underwater: {
    theme: 'underwater',
    coverScene: (name) =>
      `a young child wearing a snorkel mask, swimming with a friendly dolphin under the sea, with the name \"${name}\" on a wooden sign`,
    pages: (name, age) => [
      { text: `${name} loved going to the beach.`, scene: 'a child building a sandcastle on a sunny beach' },
      { text: `One day, a magical seashell whispered her name.`, scene: 'a child holding a large spiral seashell to her ear' },
      { text: `${name} put on her snorkel and dove into the sea.`, scene: 'a child wearing a snorkel mask diving into clear water' },
      { text: `A friendly dolphin came to say hello.`, scene: 'a smiling dolphin swimming up to greet a child' },
      { text: `${name} held the dolphin's fin and they swam together.`, scene: 'a child holding a dolphins fin and swimming through the water' },
      { text: `They visited a coral reef full of colorful fish.`, scene: 'a coral reef with many fish swimming around it' },
      { text: `A wise old turtle waved with his flipper.`, scene: 'a friendly old sea turtle with kind eyes' },
      { text: `An octopus juggled five seashells at once.`, scene: 'an octopus juggling seashells with all eight arms' },
      { text: `${name} found a treasure chest covered in seaweed.`, scene: 'a treasure chest on the sea floor covered in seaweed' },
      { text: `Inside were pearls that glowed in the dark.`, scene: 'glowing pearls inside an open treasure chest' },
      { text: `A school of seahorses danced around her.`, scene: 'many seahorses swimming in a circle around a child' },
      { text: `${name} met a tiny mermaid named Coral.`, scene: 'a small mermaid with long hair waving hello' },
      { text: `Coral showed her the underwater castle.`, scene: 'an underwater castle made of coral and seashells' },
      { text: `A whale sang a beautiful song just for them.`, scene: 'a giant whale opening its mouth to sing' },
      { text: `${name} planted a magic seashell in the sand.`, scene: 'a child planting a seashell in the sandy sea floor' },
      { text: `Bubbles floated up carrying tiny wishes.`, scene: 'bubbles rising through the water with tiny stars inside' },
      { text: `${name} promised to protect the sea forever.`, scene: 'a child holding her hand over her heart underwater' },
      { text: `The dolphin took her back up to the surface.`, scene: 'a child riding a dolphin up to the surface of the water' },
      { text: `${name} waved goodbye to all her sea friends.`, scene: 'a child waving from the surface of the water' },
      { text: `The End. The ocean will always remember ${name}.`, scene: 'a peaceful beach at sunset with footprints in the sand' },
    ],
  },
};

export function generateStory(theme: Theme, name: string, age: number): StoryPage[] {
  const t = TEMPLATES[theme];
  return t.pages(name, age).map((p, i) => ({
    pageNumber: i + 1,
    text: p.text,
    scene: p.scene,
  }));
}

export function getCoverScene(theme: Theme, name: string): string {
  return TEMPLATES[theme].coverScene(name);
}

export function getThemeLabel(theme: Theme): string {
  return THEMES.find((t) => t.id === theme)?.label ?? theme;
}
