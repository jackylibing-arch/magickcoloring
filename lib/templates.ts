// Story templates for personalized coloring books.
// Each theme = 20 pages with a real story arc:
//   Pages 1-2: setup (free preview)
//   Page  3:   CLIFFHANGER (locked behind paywall)
//   Pages 4-19: rising action with mini-cliffhangers
//   Page  20:  resolution
//
// `text` substitutes {name}. `scene` is the FLUX prompt fragment for that
// page's coloring image. Scenes are deliberately simple — single subjects,
// no text in the image (FLUX can't render text reliably).

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
  scene: string;
};

type RawPage = { text: string; scene: string };

type Template = {
  theme: Theme;
  bookTitle: (name: string) => string;
  coverScene: () => string;
  pages: (name: string, age: number) => RawPage[];
};

const TEMPLATES: Record<Theme, Template> = {
  princess: {
    theme: 'princess',
    bookTitle: (name) => `${name}'s Magical Adventure`,
    coverScene: () =>
      'a smiling young princess with a small crown and a magic wand, standing in front of a fairytale castle',
    pages: (name) => [
      // 1: setup (free)
      { text: `Princess ${name} lived in a tall castle on top of a hill.`, scene: 'a tall fairytale castle on a hill with little flags' },
      // 2: TENSION (free) — sets up the cliffhanger
      { text: `One night, ${name} heard a STRANGE tap-tap-tap at the window… something was scratching to get IN.`, scene: 'a young princess in a dark bedroom looking nervously at a castle window, wide eyes, mysterious glow outside the glass' },
      // 3: CLIFFHANGER (locked) — the reveal
      { text: `A glowing letter floated through the window — and out flew a tiny dragon!`, scene: 'a small friendly dragon flying out of a glowing envelope, surprised princess watching' },
      // 4-19: adventure
      { text: `The little dragon was crying. "Someone took my treasure!" he said.`, scene: 'a small dragon crying with big tears, princess kneeling next to him' },
      { text: `${name} promised to help. They tiptoed through a secret castle tunnel.`, scene: 'a princess and a small dragon walking through a stone tunnel with torches' },
      { text: `At the tunnel's end was an ancient map with a big red X.`, scene: 'an old treasure map laid out on a stone table with a red X' },
      { text: `The map led them deep into the enchanted forest.`, scene: 'a princess and a small dragon walking down a forest path holding a map' },
      { text: `Suddenly — a rustle in the bushes! What could it be?`, scene: 'a princess and dragon looking nervously at shaking bushes in the forest' },
      { text: `Out hopped a friendly squirrel who knew the way.`, scene: 'a friendly cartoon squirrel waving on its back legs' },
      { text: `The squirrel led them to a cave full of glowing crystals.`, scene: 'a princess looking up at huge glowing crystals inside a cave' },
      { text: `${name} picked the brightest crystal to light their path.`, scene: 'a princess holding up a single sparkling crystal' },
      { text: `Deeper inside, they found the shadow thief's lair.`, scene: 'a mysterious dark cave entrance with cobwebs' },
      { text: `A big shadow rose up — but ${name} was brave!`, scene: 'a giant friendly shadow shape rising up, princess standing tall' },
      { text: `${name} held the crystal high, and the shadows turned into puffs of smoke.`, scene: 'a princess holding up a glowing crystal, small puffs of smoke around her' },
      { text: `There it was — the dragon's treasure, safe and sparkling.`, scene: 'a treasure chest full of jewels and a small dragon hugging it' },
      { text: `The little dragon hugged ${name} tight.`, scene: 'a small dragon hugging a princess with both wings' },
      { text: `Together they carried the treasure back to the castle.`, scene: 'a princess and a small dragon carrying a treasure chest between them' },
      { text: `The whole kingdom threw a giant party in their honor.`, scene: 'a castle courtyard with lanterns, music notes, and dancing animals' },
      { text: `From that day on, the dragon stayed as ${name}'s best friend.`, scene: 'a princess sitting in a castle window with a small dragon curled in her lap' },
      { text: `The End. ${name} and the little dragon watched the stars come out.`, scene: 'a princess and a small dragon looking up at a sky full of stars from a balcony' },
    ],
  },

  dinosaur: {
    theme: 'dinosaur',
    bookTitle: (name) => `${name}'s Dinosaur Quest`,
    coverScene: () =>
      'a young child explorer in a safari hat standing next to a small friendly cartoon T-Rex, jungle leaves around them',
    pages: (name) => [
      { text: `${name} loved dinosaurs more than anything in the world.`, scene: 'a child lying on the floor playing with dinosaur toys' },
      { text: `One day in the garden, ${name} found a glowing fossil — and it started to SHAKE violently…`, scene: 'a child kneeling, holding a brightly glowing fossil with both hands, sparkles flying off, tiny cracks spreading across the surface, alarmed expression' },
      // CLIFFHANGER
      { text: `The fossil cracked open — and a tiny dinosaur popped out, alive!`, scene: 'a tiny baby dinosaur hatching out of a cracked glowing egg, child gasping' },
      { text: `The little dinosaur was scared. ${name} hugged him gently.`, scene: 'a child gently hugging a small baby dinosaur' },
      { text: `${name} named him Spike. Spike sniffed the air and pointed.`, scene: 'a small baby dinosaur sniffing the air with nose up' },
      { text: `Spike led ${name} into a hidden prehistoric valley.`, scene: 'a child and a small dinosaur walking together into a valley with tall ferns' },
      { text: `Inside, a giant Brontosaurus mom was looking for her baby.`, scene: 'a long-necked brontosaurus with kind eyes looking down' },
      { text: `Suddenly — a HUGE shadow! Was it a T-Rex??`, scene: 'a huge shadow shape on the ground with a child looking up worried' },
      { text: `It was just a friendly Triceratops saying hello.`, scene: 'a friendly triceratops with three horns smiling' },
      { text: `${name} climbed onto the Triceratops's back for a ride.`, scene: 'a child riding on the back of a friendly triceratops' },
      { text: `They crossed a wide river on a Stegosaurus.`, scene: 'a stegosaurus walking across a shallow river with a child on its back' },
      { text: `Spike pointed to a dark cave on the other side.`, scene: 'a small dinosaur pointing toward a dark cave entrance' },
      { text: `Inside, two glowing eyes blinked in the dark!`, scene: 'two big friendly cartoon eyes glowing in a dark cave' },
      { text: `It was a baby Pterodactyl who got lost.`, scene: 'a small pterodactyl with sad eyes and droopy wings' },
      { text: `${name} and Spike helped him find his nest at the top of a cliff.`, scene: 'a small pterodactyl flying up toward a nest on top of a tall cliff' },
      { text: `All the dinosaurs cheered for ${name}!`, scene: 'several friendly cartoon dinosaurs raising their heads and cheering' },
      { text: `They had a big dinosaur picnic with leaves and berries.`, scene: 'dinosaurs and a child gathered around a picnic of leaves and berries' },
      { text: `It was time to go home — but Spike had to stay with his family.`, scene: 'a child waving goodbye to a small dinosaur and its dinosaur family' },
      { text: `${name} promised to come back tomorrow.`, scene: 'a child making a pinky promise with a small dinosaur' },
      { text: `The End. ${name} fell asleep dreaming of dinosaurs.`, scene: 'a child sleeping in bed with a tiny toy dinosaur on the pillow' },
    ],
  },

  space: {
    theme: 'space',
    bookTitle: (name) => `${name}'s Space Journey`,
    coverScene: () =>
      'a young child astronaut in a space helmet standing on the moon, with planets and stars in the background',
    pages: (name) => [
      { text: `${name} loved looking up at the stars every night.`, scene: 'a child looking out a bedroom window at a night sky full of stars' },
      { text: `One night, ${name}'s toy rocket started to BEEP loudly — and something inside began to bang on the door.`, scene: 'a small glowing toy rocket on a desk shaking, sparkles flying off, child leaning in with wide curious eyes' },
      // CLIFFHANGER
      { text: `The rocket grew bigger… and a tiny door opened with someone inside!`, scene: 'a small rocket with an open hatch, a tiny alien peeking out, child amazed' },
      { text: `It was a tiny alien named Zip. He needed ${name}'s help!`, scene: 'a small friendly alien with three eyes waving hello' },
      { text: `Zip's home planet had lost all its stars and was very dark.`, scene: 'a dark round planet with a sad face and no stars around it' },
      { text: `${name} put on a space helmet and climbed inside the rocket.`, scene: 'a child in a space helmet climbing into a small rocket' },
      { text: `WHOOSH! They blasted off into space.`, scene: 'a small rocket blasting off with smoke clouds below' },
      { text: `Suddenly — an asteroid field straight ahead!`, scene: 'a small rocket flying toward floating space rocks' },
      { text: `${name} steered the rocket safely between every asteroid.`, scene: 'a small rocket zigzagging between cartoon space rocks' },
      { text: `They landed on Zip's dark, quiet planet.`, scene: 'a small rocket landing on a round dark planet with a sad face' },
      { text: `In the middle was a giant broken star machine.`, scene: 'a giant cartoon machine with stars on top, broken with sparkles' },
      { text: `Two friendly robots stood guard. ${name} said hello.`, scene: 'two cute round robots waving with little arms' },
      { text: `The robots showed ${name} which buttons to push.`, scene: 'a child pressing buttons on a big colorful machine, robots watching' },
      { text: `One by one, the stars turned back on!`, scene: 'a sky filling up with bright stars one by one' },
      { text: `The whole planet sparkled with light again.`, scene: 'a happy round planet with stars and a big smile' },
      { text: `Aliens came out and threw a space party.`, scene: 'cute friendly aliens dancing in a circle with stars above' },
      { text: `Zip gave ${name} a tiny star necklace as a gift.`, scene: 'a small alien handing a star-shaped necklace to a child' },
      { text: `The rocket flew ${name} all the way home.`, scene: 'a small rocket flying past the moon back toward earth' },
      { text: `${name} landed safely back in the bedroom.`, scene: 'a child in a space helmet stepping out of a small rocket in a bedroom' },
      { text: `The End. Every night ${name} can see Zip's bright star.`, scene: 'a child looking out a bedroom window pointing at one bright star' },
    ],
  },

  unicorn: {
    theme: 'unicorn',
    bookTitle: (name) => `${name}'s Unicorn Forest`,
    coverScene: () =>
      'a young child standing next to a small friendly unicorn with a flowing mane, in a magical forest with sparkles',
    pages: (name) => [
      { text: `On a bright morning, ${name} took a walk into the magical forest.`, scene: 'a child walking into a forest with sunlight beams shining down' },
      { text: `Suddenly ${name} heard hooves THUNDERING from behind the trees… closer… and closer…`, scene: 'a child standing very still in a deep forest, looking nervously over one shoulder at violently shaking bushes, glowing footprints leading through the trees' },
      // CLIFFHANGER
      { text: `${name} looked up — and a real unicorn was right there, but the unicorn looked SO sad.`, scene: 'a small sad unicorn with droopy ears, child looking surprised' },
      { text: `The unicorn was named Luna. She had lost her magic horn!`, scene: 'a small unicorn named Luna with a flat spot on her forehead' },
      { text: `${name} promised to help find it.`, scene: 'a child gently touching a small unicorns nose to comfort her' },
      { text: `They followed a rainbow trail through the trees.`, scene: 'a child and a small unicorn walking under a rainbow arc' },
      { text: `Soon they came to a sparkling diamond stream.`, scene: 'a small stream with sparkling diamond shapes floating in it' },
      { text: `On the bridge sat a grumpy little troll blocking the way.`, scene: 'a small grumpy troll with crossed arms sitting on a wooden bridge' },
      { text: `${name} offered a cookie. The troll smiled and let them pass.`, scene: 'a child handing a cookie to a smiling troll' },
      { text: `They reached a tiny village built into mushrooms.`, scene: 'a tiny village of mushroom houses with little doors and windows' },
      { text: `Fairies told them an eagle had carried the horn away.`, scene: 'small fairies pointing up at the sky, child and unicorn looking up' },
      { text: `${name} bravely climbed a tall crystal mountain.`, scene: 'a child climbing a tall mountain made of crystal blocks' },
      { text: `At the top was a giant nest with the magic horn inside!`, scene: 'a big nest on top of a mountain with a glowing horn inside' },
      { text: `The eagle was not mean — she had thought the horn was a toy.`, scene: 'a big friendly eagle holding a horn gently in its beak' },
      { text: `She gave the horn back with a little eagle nod.`, scene: 'an eagle handing a horn to a child with a kind expression' },
      { text: `Luna's horn glowed bright the moment ${name} put it back!`, scene: 'a small unicorn with her horn glowing brightly, sparkles all around' },
      { text: `Luna lifted ${name} onto her back and they flew through the sky.`, scene: 'a child riding on a small unicorn flying among clouds' },
      { text: `Luna gave ${name} a tiny crystal as a thank-you gift.`, scene: 'a small unicorn handing a tiny crystal to a child' },
      { text: `Luna promised to visit every birthday from now on.`, scene: 'a child and a small unicorn touching foreheads gently' },
      { text: `The End. ${name} held the crystal close, safe and warm.`, scene: 'a child holding a small glowing crystal to the chest under a starry sky' },
    ],
  },

  underwater: {
    theme: 'underwater',
    bookTitle: (name) => `${name}'s Underwater World`,
    coverScene: () =>
      'a young child wearing a snorkel mask swimming with a friendly dolphin under the sea, fish around them',
    pages: (name) => [
      { text: `${name} was building a sandcastle on a sunny beach.`, scene: 'a child building a sandcastle with a little bucket and shovel' },
      { text: `Suddenly, a glowing seashell whispered ${name}'s name… and the waves started to RISE.`, scene: 'a large glowing spiral seashell on the sand, child stepping back with surprised eyes, big rising waves behind, sparkles in the air' },
      // CLIFFHANGER
      { text: `A tiny voice called ${name}'s name — and a little hand reached up from the waves!`, scene: 'a small mermaid hand reaching out of ocean waves, child surprised on the sand' },
      { text: `It was a tiny mermaid named Pearl. Pearl's grandma's crown was missing!`, scene: 'a small friendly mermaid with long hair waving hello' },
      { text: `${name} put on a snorkel mask and could magically breathe under water.`, scene: 'a child wearing a snorkel mask diving into clear ocean water' },
      { text: `A friendly dolphin came to swim alongside them.`, scene: 'a smiling cartoon dolphin swimming next to a child' },
      { text: `They passed a wide coral reef bursting with colorful fish.`, scene: 'a coral reef with many fish swimming around it' },
      { text: `Suddenly — a dark shadow! A shark!`, scene: 'a child and mermaid pointing at a large shark silhouette in the distance' },
      { text: `It was just a gentle giant basking shark, who waved a fin.`, scene: 'a friendly basking shark with kind eyes waving a fin' },
      { text: `Pearl led ${name} to a deep, dark cave.`, scene: 'a child and mermaid swimming toward a dark underwater cave' },
      { text: `Inside, a big octopus was wrapped around the missing crown.`, scene: 'an octopus with eight arms holding a sparkling crown' },
      { text: `The octopus thought they were thieves and frowned.`, scene: 'an octopus with crossed arms and a grumpy face' },
      { text: `${name} explained gently. The octopus laughed and gave back the crown.`, scene: 'a smiling octopus handing a crown to a child' },
      { text: `They swam to the underwater mermaid kingdom.`, scene: 'an underwater castle made of coral and seashells with mermaid figures' },
      { text: `The mermaid queen put on her crown and smiled.`, scene: 'a mermaid queen wearing a crown smiling kindly' },
      { text: `She thanked ${name} with a glowing pearl.`, scene: 'a mermaid queen handing a glowing pearl to a child' },
      { text: `All the sea creatures threw an underwater feast.`, scene: 'fish, dolphins, and seahorses gathered in a circle for a celebration' },
      { text: `A giant whale sang a beautiful song just for ${name}.`, scene: 'a large friendly whale with its mouth open singing, music notes around' },
      { text: `The dolphin carried ${name} back up to the sunny surface.`, scene: 'a child riding on a dolphin up toward the surface of the water' },
      { text: `The End. The pearl glowed softly under ${name}'s pillow that night.`, scene: 'a small glowing pearl resting on a pillow next to a sleeping child' },
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

export function getCoverScene(theme: Theme, _name: string): string {
  return TEMPLATES[theme].coverScene();
}

export function getBookTitle(theme: Theme, name: string): string {
  return TEMPLATES[theme].bookTitle(name);
}

export function getThemeLabel(theme: Theme): string {
  return THEMES.find((t) => t.id === theme)?.label ?? theme;
}
