export interface Story {
  id: string
  title: string
  category: string
  ageMin: number
  ageMax: number
  duration: string
  stars: number
  emoji: string
  bg: string
  isFree: boolean
  moral: string
  content: StoryPage[]
}

export interface StoryPage {
  pageNumber: number
  text: string
  illustration: string // emoji used as illustration
  highlightWord?: string // word to emphasize
}

export const STORIES_DATA: Story[] = [

  // ════ HISTOIRE 1 ════
  {
    id: 'leo-alphabet',
    title: 'Léo apprend l\'alphabet',
    category: 'EducEnfant Original',
    ageMin: 3, ageMax: 6,
    duration: '5 min',
    stars: 15,
    emoji: '🦁',
    bg: '#FFB3BA',
    isFree: true,
    moral: 'Apprendre, c\'est comme une aventure. Chaque lettre est une nouvelle découverte !',
    content: [
      {
        pageNumber: 1,
        illustration: '🌅',
        text: 'Il était une fois un petit lion qui s\'appelait Léo. Léo vivait dans une grande savane dorée, entourée d\'arbres, de rivières et d\'animaux amis. Chaque matin, le soleil se levait sur la savane et Léo bondissait hors de son lit.',
        highlightWord: 'Léo'
      },
      {
        pageNumber: 2,
        illustration: '🌳',
        text: '"Aujourd\'hui, je vais apprendre toutes les lettres de l\'alphabet !" dit Léo en souriant. Sa maman lui donna un bisou sur le front. "Commence par le début, mon cœur : la lettre A !" A... A comme Arbre ! Léo courut vers le grand arbre de la savane et cria : "AAAA !" L\'arbre sembla frémir de bonheur.',
        highlightWord: 'A'
      },
      {
        pageNumber: 3,
        illustration: '🌴',
        text: 'Puis vint la lettre B... B comme Baobab ! Léo s\'approcha du gros baobab. "BBBB !" dit-il. Mais la lettre B est difficile ! Les lèvres doivent se fermer puis s\'ouvrir : B ! Il réessaya encore et encore. B ! B ! B ! "Bravo !" dit le baobab d\'une voix grave.',
        highlightWord: 'B'
      },
      {
        pageNumber: 4,
        illustration: '🐱',
        text: 'C comme Chat. Léo rencontra une petite chatte qui ronronnait sous un buisson fleuri. "C... C... Chat !" dit Léo. La chatte ouvrit un œil doré et ronronna : "Tu apprends très vite, petit lion !" Léo était fier. Il caressa doucement la chatte.',
        highlightWord: 'C'
      },
      {
        pageNumber: 5,
        illustration: '🐬',
        text: 'D comme Dauphin. Léo courut jusqu\'à la rivière bleue. Un dauphin sautait dans les vagues en faisant SPLASH ! "D ! D ! Dauphin !" cria Léo en riant aux éclats. SPLASH ! Le dauphin sauta encore plus haut et éclaboussa Léo de la tête aux pieds. "Ha ha ha !" rit Léo tout mouillé.',
        highlightWord: 'D'
      },
      {
        pageNumber: 6,
        illustration: '⭐',
        text: 'E comme Étoile. Le soir tomba sur la savane. Léo leva les yeux vers le ciel. Des milliers d\'étoiles brillaient comme des diamants. "E... Étoile..." murmura Léo. Sa voix était douce comme le vent du soir. Il connaissait maintenant cinq lettres : A, B, C, D, E.',
        highlightWord: 'E'
      },
      {
        pageNumber: 7,
        illustration: '🌙',
        text: 'Quand Léo rentra chez lui ce soir-là, sa maman l\'attendait avec un grand bol de lait chaud. "Alors, tu as appris beaucoup de lettres aujourd\'hui ?" demanda-t-elle. "Cinq lettres, Maman ! A, B, C, D, E !" dit Léo en comptant sur ses griffes. Sa maman le serra très fort dans ses bras.',
        highlightWord: 'cinq'
      },
      {
        pageNumber: 8,
        illustration: '💤',
        text: '"Demain j\'en apprendrai cinq de plus !" dit Léo en fermant les yeux. Sa maman posa une patte douce sur sa tête. "Je suis tellement fière de toi, mon Léo." Et Léo s\'endormit en rêvant de lettres qui dansaient dans le ciel étoilé. F, G, H, I, J... Les lettres l\'attendaient pour une nouvelle aventure !',
        highlightWord: 'fière'
      }
    ]
  },

  // ════ HISTOIRE 2 ════
  {
    id: 'mangue-magique',
    title: 'La Mangue Magique',
    category: 'Conte africain',
    ageMin: 4, ageMax: 7,
    duration: '6 min',
    stars: 18,
    emoji: '🥭',
    bg: '#FFDAC1',
    isFree: true,
    moral: 'Partager ce qu\'on a, c\'est multiplier la joie pour tout le monde.',
    content: [
      {
        pageNumber: 1,
        illustration: '🏡',
        text: 'Dans un village au bord d\'une forêt verte vivait une petite fille nommée Aya. Aya avait sept ans, de grands yeux curieux et une belle tresse ornée de perles colorées. Elle aimait courir, chanter et poser des questions à tout le monde.',
        highlightWord: 'Aya'
      },
      {
        pageNumber: 2,
        illustration: '✨',
        text: 'Un jour, en jouant près de la forêt, Aya trouva une mangue. Mais pas une mangue ordinaire. Cette mangue était dorée et brillait comme le soleil ! Aya la ramassa doucement. Elle était chaude dans sa main. Et puis... elle parla !',
        highlightWord: 'dorée'
      },
      {
        pageNumber: 3,
        illustration: '🥭',
        text: '"Bonjour, Aya," dit la mangue d\'une voix douce et musicale. "Je suis la Mangue Magique. Je pose des devinettes aux enfants courageux. Si tu réponds juste, je t\'offre un cadeau merveilleux !" Aya ouvrit grand les yeux. "Une devinette ? J\'ADORE les devinettes !" cria-t-elle.',
        highlightWord: 'devinettes'
      },
      {
        pageNumber: 4,
        illustration: '🍌',
        text: 'La mangue dit d\'une voix chantante : "Je suis jaune comme le soleil. Je suis sucrée comme le miel. Les singes m\'adorent. Et les enfants aussi. Qui suis-je ?" Aya réfléchit très fort. Jaune... sucrée... les singes... "UNE BANANE !" cria-t-elle. "BRAVO !" dit la mangue. Et POUF ! Une belle banane dorée apparut dans la main d\'Aya.',
        highlightWord: 'banane'
      },
      {
        pageNumber: 5,
        illustration: '🍉',
        text: '"Encore une !" dit Aya, toute contente. La mangue réfléchit et dit : "Je suis ronde comme la lune. Je suis rouge à l\'extérieur et verte et sucrée à l\'intérieur. L\'été, je rafraîchis tout le monde." Aya ferma les yeux pour réfléchir. Ronde... rouge dehors... verte dedans... "LA PASTÈQUE !" dit-elle en sautant de joie.',
        highlightWord: 'pastèque'
      },
      {
        pageNumber: 6,
        illustration: '🍍',
        text: 'La mangue posa une dernière devinette : "Je suis épineuse mais douce à l\'intérieur. Je viens des pays chauds et ensoleillés. Mon nom commence par la lettre A. Je suis le roi des fruits tropicaux." Aya sourit. Elle connaissait celle-là ! "L\'ANANAS !" cria-t-elle. "PARFAIT !" dit la mangue en brillant encore plus fort.',
        highlightWord: 'ananas'
      },
      {
        pageNumber: 7,
        illustration: '🧺',
        text: 'Un grand panier plein de fruits apparut devant Aya : des bananes, des pastèques, des ananas, des mangues et des oranges bien rondes ! Aya regarda le panier, puis regarda le village au loin. Elle pensa à tous ses amis et à leurs familles.',
        highlightWord: 'partager'
      },
      {
        pageNumber: 8,
        illustration: '🌟',
        text: 'Aya rentra au village en portant le grand panier sur la tête. Elle partagea les fruits avec tous les enfants et toutes les familles. Le soir, sous le grand baobab, tout le village mangeait ensemble en riant. "Merci, Aya !" disaient-ils tous. Et Aya sourit en regardant les étoiles. Elle savait maintenant le nom de chaque fruit. Et surtout, elle avait appris le goût du partage.',
        highlightWord: 'ensemble'
      }
    ]
  },

  // ════ HISTOIRE 3 ════
  {
    id: 'chiffre-perdu',
    title: 'Le Petit Chiffre Perdu',
    category: 'EducEnfant Original',
    ageMin: 3, ageMax: 5,
    duration: '4 min',
    stars: 12,
    emoji: '5️⃣',
    bg: '#B5EAD7',
    isFree: true,
    moral: 'Chacun est important, même le plus petit. N\'oublie jamais personne.',
    content: [
      {
        pageNumber: 1,
        illustration: '🔢',
        text: 'Un jour, dans le magnifique Pays des Chiffres, quelque chose d\'étrange arriva. Le chiffre 5 avait disparu ! Toute la matinée, le chiffre 1 avait attendu son ami. Mais le 5 n\'arrivait pas. "Eh ! Où est le 5 ?" dit le 1 d\'une voix inquiète.',
        highlightWord: '5'
      },
      {
        pageNumber: 2,
        illustration: '🔍',
        text: 'Le chiffre 2 regarda à gauche. Le chiffre 3 regarda à droite. Le chiffre 4 regarda derrière lui. Personne ne voyait le 5. "Cherchons-le !" dit le chiffre 6 courageusement. Et tous les chiffres partirent à sa recherche dans tout le pays.',
        highlightWord: 'cherchons'
      },
      {
        pageNumber: 3,
        illustration: '🦋',
        text: 'Le 1 chercha dans le beau jardin fleuri. Il trouva 1 papillon bleu qui dansait. Mais pas le 5. Le 2 chercha dans la maison jaune. Il trouva 2 chaussures rouges. Mais pas le 5. Le 3 chercha dans la cuisine parfumée. Il trouva 3 oranges bien rondes. Mais pas le 5.',
        highlightWord: '1, 2, 3'
      },
      {
        pageNumber: 4,
        illustration: '🌳',
        text: 'Le petit 7 dit soudain : "Regardez là-bas ! Près du grand arbre !" Et là, caché derrière un grand arbre aux feuilles vertes, se trouvait le 5. Il était assis tout seul sur une pierre. Et il pleurait doucement. Ses larmes tombaient une par une sur le sol.',
        highlightWord: 'pleurait'
      },
      {
        pageNumber: 5,
        illustration: '💔',
        text: '"Pourquoi tu te caches ?" demanda le 4 doucement. Le 5 renifla. "Parce que... parce que personne ne se souvient de moi. Tout le monde compte 1, 2, 3, 4 et saute directement à 6 ! Je ne sers à rien !" Les autres chiffres se regardèrent. Ils avaient honte. C\'était vrai.',
        highlightWord: 'important'
      },
      {
        pageNumber: 6,
        illustration: '✋',
        text: '"Mais le 5 est TRÈS important !" dit le 1 en levant la main. "Tu as 5 doigts sur chaque main !" "Et 5 orteils sur chaque pied !" dit le 2. "Et 5 sens : voir, entendre, sentir, toucher et goûter !" dit le 3. "Et 5 jours d\'école dans la semaine !" ajouta le 4.',
        highlightWord: '5 doigts'
      },
      {
        pageNumber: 7,
        illustration: '😊',
        text: 'Le 5 essuya ses larmes avec sa petite manche. "C\'est... c\'est vrai tout ça ?" Les autres chiffres s\'approchèrent et formèrent un grand cercle autour de lui. "OUI !" crièrent-ils tous ensemble. Le 5 sourit. Le plus grand sourire du Pays des Chiffres.',
        highlightWord: 'sourire'
      },
      {
        pageNumber: 8,
        illustration: '🎉',
        text: 'Depuis ce jour, plus personne n\'oublia jamais le 5. Et quand on comptait dans le Pays des Chiffres, on entendait toujours : "1, 2, 3, 4, 5 !" avec une grande joie. Et toi, tu n\'oublies pas le 5 quand tu comptes, n\'est-ce pas ?',
        highlightWord: '1, 2, 3, 4, 5'
      }
    ]
  },

  // ════ HISTOIRE 4 ════
  {
    id: 'kofi-lion-sage',
    title: 'Kofi et le Lion Sage',
    category: 'Conte africain',
    ageMin: 6, ageMax: 9,
    duration: '8 min',
    stars: 22,
    emoji: '🦁',
    bg: '#FFEAA7',
    isFree: false,
    moral: 'Les mathématiques sont partout dans la nature. Elles ne sont pas difficiles, elles sont magiques !',
    content: [
      {
        pageNumber: 1,
        illustration: '🌍',
        text: 'Dans la grande savane d\'Afrique de l\'Ouest vivait un garçon courageux nommé Kofi. Kofi avait huit ans. Il était curieux, vif, et il adorait apprendre toutes choses... sauf une. Il avait peur des mathématiques.',
        highlightWord: 'Kofi'
      },
      {
        pageNumber: 2,
        illustration: '📚',
        text: 'Un jour, le maître dit à la classe : "Demain, grand examen de calcul !" Les autres enfants sourirent. Mais Kofi, lui, sentit son cœur tomber dans ses chaussures. Les additions, les soustractions, les multiplications... Tout ça lui donnait la tête qui tournait.',
        highlightWord: 'examen'
      },
      {
        pageNumber: 3,
        illustration: '🌿',
        text: 'Ce soir-là, Kofi alla se promener au bord de la savane. Il s\'assit sous un arbre et poussa un grand soupir. "Je n\'y arriverai jamais..." murmura-t-il. "Pourquoi tu soupires comme ça ?" dit soudain une voix grave et douce comme le tonnerre lointain.',
        highlightWord: 'soupir'
      },
      {
        pageNumber: 4,
        illustration: '🦁',
        text: 'Kofi sursauta ! Devant lui se tenait un grand lion très vieux, avec une crinière blanche comme les nuages. Ses yeux dorés étaient doux et pleins de sagesse. "Je... tu parles ?" balbutia Kofi. "Seulement aux enfants qui ont besoin d\'aide," dit le lion. "Je m\'appelle Simba l\'Ancien. Quel est ton problème, petit ?"',
        highlightWord: 'Simba'
      },
      {
        pageNumber: 5,
        illustration: '➕',
        text: 'Kofi expliqua tout. L\'examen. Les chiffres. Sa peur. Le lion sourit. "Les mathématiques ? Mais c\'est partout dans la nature ! Regarde mes pattes. Combien en as-tu ?" Kofi compta : "Quatre." "Et si un autre lion arrive ?" "Huit !" "4 plus 4 égale ?" "8 !" s\'écria Kofi. "Tu viens de faire une addition !" dit Simba.',
        highlightWord: 'addition'
      },
      {
        pageNumber: 6,
        illustration: '🥭',
        text: 'Puis le lion montra un arbre chargé de mangues dorées. "Il y a 10 mangues sur cet arbre. 3 tombent par terre dans le vent. Combien reste-t-il sur l\'arbre ?" Kofi réfléchit et compta sur ses doigts. "10... enlève 3... il en reste 7 !" "Parfait ! Tu viens de faire une soustraction !" dit Simba.',
        highlightWord: 'soustraction'
      },
      {
        pageNumber: 7,
        illustration: '🌟',
        text: 'Ils travaillèrent ensemble toute la soirée. Le lion posait des problèmes avec des éléphants, des oiseaux, des étoiles. Kofi répondait. Et peu à peu, Kofi se rendit compte d\'une chose extraordinaire : il comprenait ! Les mathématiques n\'étaient pas ses ennemies. Elles étaient ses amies déguisées.',
        highlightWord: 'amies'
      },
      {
        pageNumber: 8,
        illustration: '🏆',
        text: 'Le lendemain, Kofi passa son examen. Sa main ne tremblait plus. Son cœur ne tombait plus. Il pensa à Simba et aux mangues et aux pattes du lion. Et il répondit à toutes les questions. Le maître dit devant toute la classe : "Kofi, tu as eu la meilleure note !" Kofi sourit et murmura : "Merci, Simba."',
        highlightWord: 'meilleure'
      }
    ]
  },

  // ════ HISTOIRE 5 ════
  {
    id: 'anansi-araignee',
    title: 'Anansi et les Histoires du Monde',
    category: 'Conte africain',
    ageMin: 5, ageMax: 9,
    duration: '7 min',
    stars: 20,
    emoji: '🕷️',
    bg: '#C7CEEA',
    isFree: false,
    moral: 'L\'intelligence et la ruse peuvent accomplir ce que la force ne peut pas.',
    content: [
      {
        pageNumber: 1,
        illustration: '🌍',
        text: 'Il y a très longtemps, en Afrique, toutes les histoires du monde appartenaient au Roi du Ciel, Nyame. Personne d\'autre ne pouvait les raconter. Les hommes, les animaux, les arbres eux-mêmes n\'avaient pas d\'histoires. Le monde était silencieux et triste.',
        highlightWord: 'histoires'
      },
      {
        pageNumber: 2,
        illustration: '🕷️',
        text: 'Mais il y avait Anansi, la petite araignée. Anansi était toute petite, avec huit pattes fines comme des fils de soie. Mais sa tête était grande, et son cerveau encore plus grand. Anansi voulait les histoires pour les donner à tous les hommes.',
        highlightWord: 'Anansi'
      },
      {
        pageNumber: 3,
        illustration: '☁️',
        text: '"Je veux acheter toutes les histoires du monde !" dit Anansi en grimpant jusqu\'au ciel sur son fil de soie. Le Roi Nyame rit d\'un grand rire qui fit trembler les nuages. "Toi, une petite araignée ? Ces histoires valent beaucoup trop cher pour une si petite créature !"',
        highlightWord: 'courage'
      },
      {
        pageNumber: 4,
        illustration: '🐝',
        text: '"Dis-moi ton prix," dit Anansi calmement. Nyame réfléchit. "Tu dois m\'apporter : Onini le grand python, Osebo le léopard féroce, et Mmoboro les guêpes dangereuses. C\'est impossible !" Anansi sourit doucement. "Je reviendrai bientôt." Et il redescendit sur son fil.',
        highlightWord: 'impossible'
      },
      {
        pageNumber: 5,
        illustration: '🐍',
        text: 'Anansi alla trouver Onini le python. "Les gens disent que tu n\'es pas aussi long que ce palmier," dit Anansi. Le python, vexé, s\'étira de tout son long contre l\'arbre. "Attache-toi pour qu\'on mesure bien !" dit Anansi. Et le python se fit attacher. Anansi l\'avait eu avec ses mots.',
        highlightWord: 'ruse'
      },
      {
        pageNumber: 6,
        illustration: '🐆',
        text: 'Puis Anansi creusa un trou profond et le recouvrit de feuilles. Osebo le léopard passa par là et BOUM ! Il tomba dans le piège. "Je vais t\'aider à sortir," dit Anansi. "Tiens ce bâton." Et avant qu\'Osebo comprenne, il était attaché. Anansi l\'avait eu avec sa patience.',
        highlightWord: 'patience'
      },
      {
        pageNumber: 7,
        illustration: '🐝',
        text: 'Enfin, Anansi trouva les guêpes. "Il va pleuvoir ! Cachez-vous dans cette calebasse !" cria-t-il. Les guêpes se précipitèrent toutes à l\'intérieur. CLIC ! Anansi ferma la calebasse. Il avait les trois créatures. Anansi était petit, mais son intelligence était grande comme le ciel.',
        highlightWord: 'intelligence'
      },
      {
        pageNumber: 8,
        illustration: '📚',
        text: 'Anansi remonta au ciel avec ses trois prisonniers. Le Roi Nyame fut stupéfait. Il tint sa promesse et donna toutes les histoires du monde à Anansi. Et depuis ce jour, Anansi partagea les histoires avec tous les hommes. C\'est pour ça que les histoires qu\'on se raconte le soir s\'appellent les "histoires d\'Anansi".',
        highlightWord: 'partage'
      }
    ]
  },

  // ════ HISTOIRE 6 ════
  {
    id: 'creation-monde',
    title: 'La Création du Monde',
    category: 'Histoire biblique',
    ageMin: 4, ageMax: 8,
    duration: '6 min',
    stars: 18,
    emoji: '🌍',
    bg: '#D4EDDA',
    isFree: false,
    moral: 'Dieu a créé le monde avec amour. Chaque chose a sa place et son importance.',
    content: [
      {
        pageNumber: 1,
        illustration: '🌑',
        text: 'Au commencement, il n\'y avait rien. Ni lumière, ni couleur, ni son. Seulement un grand silence et une immense obscurité. Mais Dieu était là. Et Dieu avait un projet magnifique. Il allait créer le monde entier.',
        highlightWord: 'commencement'
      },
      {
        pageNumber: 2,
        illustration: '💡',
        text: 'Le premier jour, Dieu dit : "Que la lumière soit !" Et la lumière fut ! Elle éclata dans l\'obscurité comme un soleil qui se lève. Dieu regarda la lumière et dit : "C\'est beau." Il sépara la lumière de l\'obscurité. La lumière s\'appela le Jour. L\'obscurité s\'appela la Nuit.',
        highlightWord: 'lumière'
      },
      {
        pageNumber: 3,
        illustration: '🌊',
        text: 'Le deuxième jour, Dieu créa le ciel bleu tout là-haut, là où nagent les nuages blancs. Le troisième jour, Dieu rassembla toutes les eaux dans les mers et les océans profonds. Et la terre sèche apparut. Dieu fit pousser sur la terre des herbes vertes, des fleurs colorées et des arbres fruitiers.',
        highlightWord: 'mer'
      },
      {
        pageNumber: 4,
        illustration: '⭐',
        text: 'Le quatrième jour, Dieu plaça le soleil dans le ciel pour éclairer le jour, et la lune et les étoiles pour illuminer la nuit. On pouvait maintenant compter les jours et les saisons. Le ciel était magnifique, rempli d\'étoiles qui brillaient comme des diamants.',
        highlightWord: 'soleil'
      },
      {
        pageNumber: 5,
        illustration: '🐟',
        text: 'Le cinquième jour, Dieu créa tous les animaux de la mer : les grands baleines, les dauphins joueurs, les poissons colorés. Et dans le ciel, il créa tous les oiseaux : les aigles majestueux, les perroquets colorés, les petits moineaux. Toute la mer et tout le ciel étaient vivants !',
        highlightWord: 'animaux'
      },
      {
        pageNumber: 6,
        illustration: '🦁',
        text: 'Le sixième jour, Dieu créa les animaux de la terre : les lions, les éléphants, les girafes, les zèbres et tous les autres. Puis Dieu créa l\'homme et la femme. Il les fit à son image, avec un cœur pour aimer, une tête pour penser et des mains pour créer.',
        highlightWord: 'créer'
      },
      {
        pageNumber: 7,
        illustration: '😌',
        text: 'Le septième jour, tout était terminé. Le monde entier était là : le ciel, la mer, la terre, les plantes, les animaux et les hommes. Dieu regarda tout ce qu\'il avait créé et dit : "C\'est très bon." Alors Dieu se reposa et bénit ce septième jour.',
        highlightWord: 'repos'
      },
      {
        pageNumber: 8,
        illustration: '🌈',
        text: 'Voilà comment le monde a été créé, en sept jours, avec amour et patience. Chaque fois que tu vois le soleil se lever, les étoiles briller ou un lion courir dans la savane, souviens-toi : quelqu\'un a tout créé pour toi, avec beaucoup d\'amour.',
        highlightWord: 'amour'
      }
    ]
  },

  // ════ HISTOIRE 7 ════
  {
    id: 'cigale-fourmi',
    title: 'La Cigale et la Fourmi',
    category: 'Fable',
    ageMin: 5, ageMax: 9,
    duration: '5 min',
    stars: 15,
    emoji: '🐜',
    bg: '#FFEAA7',
    isFree: false,
    moral: 'Il faut travailler aujourd\'hui pour ne pas manquer de rien demain.',
    content: [
      {
        pageNumber: 1,
        illustration: '☀️',
        text: 'C\'était un bel été chaud et ensoleillé. Dans la prairie verte, une cigale sautait de fleur en fleur en chantant du matin au soir. Sa voix était belle comme une musique. Elle chantait : "La la la li la ! L\'été est magnifique !"',
        highlightWord: 'cigale'
      },
      {
        pageNumber: 2,
        illustration: '🐜',
        text: 'Pas loin de là, une petite fourmi travaillait dur sous le soleil brûlant. Elle portait des grains de maïs beaucoup plus gros qu\'elle ! Aller-retour, aller-retour, sans jamais s\'arrêter. Elle remplissait son garde-manger pour l\'hiver.',
        highlightWord: 'fourmi'
      },
      {
        pageNumber: 3,
        illustration: '🎵',
        text: 'La cigale s\'approcha de la fourmi en dansant. "Pourquoi tu travailles autant, petite fourmi ? Il fait si beau ! Viens chanter et danser avec moi !" La fourmi s\'arrêta une seconde et dit : "Je prépare ma nourriture pour l\'hiver. Et toi, qu\'est-ce que tu fais ?" "Moi ? Je chante !" dit la cigale en riant.',
        highlightWord: 'travailler'
      },
      {
        pageNumber: 4,
        illustration: '❄️',
        text: 'L\'été passa, puis l\'automne avec ses feuilles dorées. Et puis vint l\'hiver. Un hiver froid, glacial et gris. La neige tombait sur tout. Plus de fleurs, plus d\'insectes, plus rien à manger. La cigale avait très faim et très froid. Elle tremblait de partout.',
        highlightWord: 'hiver'
      },
      {
        pageNumber: 5,
        illustration: '🚪',
        text: 'La cigale alla frapper à la porte de la fourmi. TOC TOC TOC ! "S\'il te plaît, petite fourmi, donne-moi un peu à manger. Je meurs de faim !" La fourmi ouvrit sa porte. Elle était bien au chaud dans sa maison pleine de nourriture.',
        highlightWord: 'frapper'
      },
      {
        pageNumber: 6,
        illustration: '🤔',
        text: '"Qu\'est-ce que tu faisais tout l\'été pendant que je travaillais ?" demanda la fourmi. La cigale baissa la tête, honteuse. "Je chantais... je dansais..." "Tu chantais ?" dit la fourmi. "Eh bien maintenant, danse !" Mais la fourmi, qui était gentille au fond, laissa quand même entrer la cigale.',
        highlightWord: 'honte'
      },
      {
        pageNumber: 7,
        illustration: '🤝',
        text: 'La fourmi partagea sa nourriture avec la cigale. Mais elle dit : "L\'année prochaine, tu travailleras avec moi l\'été. Et en échange, tu me chanteras de belles chansons tout l\'hiver pour me tenir compagnie." La cigale accepta avec joie. C\'était un bon accord.',
        highlightWord: 'accord'
      },
      {
        pageNumber: 8,
        illustration: '🌸',
        text: 'Et c\'est ainsi que la cigale apprit la leçon la plus importante : il faut travailler quand le soleil brille, pour avoir de quoi manger quand la pluie arrive. Le printemps suivant, la cigale chantait ET travaillait. Et la fourmi dansait parfois aussi. Elles étaient devenues les meilleures amies du monde.',
        highlightWord: 'leçon'
      }
    ]
  },

  // ════ HISTOIRE 8 ════
  {
    id: 'baobab-roi',
    title: 'Pourquoi le Baobab est à l\'envers',
    category: 'Conte africain',
    ageMin: 5, ageMax: 8,
    duration: '5 min',
    stars: 16,
    emoji: '🌳',
    bg: '#B5EAD7',
    isFree: false,
    moral: 'L\'orgueil mène à la chute. Sois humble et reconnais tes erreurs.',
    content: [
      {
        pageNumber: 1,
        illustration: '🌍',
        text: 'Au commencement du monde, quand Dieu créait les arbres un par un, le baobab était le plus beau de tous. Il avait un tronc immense, des branches magnifiques et des fleurs blanches parfumées. Tous les animaux venaient se reposer sous son ombre.',
        highlightWord: 'baobab'
      },
      {
        pageNumber: 2,
        illustration: '🦁',
        text: 'Mais le baobab était très orgueilleux. Il regardait les autres arbres de haut et disait : "Je suis le plus beau ! Le plus grand ! Le plus important !" Il se moquait du petit palmier, du petit acacia et de toutes les herbes. Les animaux n\'aimaient pas son caractère.',
        highlightWord: 'orgueilleux'
      },
      {
        pageNumber: 3,
        illustration: '😤',
        text: 'Un jour, Dieu entendit les plaintes des autres arbres et des animaux. Il appela le baobab. "Tu es beau, c\'est vrai. Mais tu es orgueilleux et méchant avec les autres." Le baobab haussa ses branches : "C\'est normal ! Je suis le meilleur ! Les autres ne valent rien !" Dieu fut très triste.',
        highlightWord: 'fierté'
      },
      {
        pageNumber: 4,
        illustration: '⚡',
        text: 'Dieu dit alors : "Tu voulais regarder les autres de haut ? Très bien. Désormais, tu regarderas le ciel de bas !" Et d\'un grand coup de vent, Dieu retourna le baobab. Ses racines se retrouvèrent en l\'air, et ses branches s\'enfoncèrent dans la terre.',
        highlightWord: 'retourné'
      },
      {
        pageNumber: 5,
        illustration: '🌳',
        text: 'Le baobab se retrouva à l\'envers, les pattes en l\'air comme quelqu\'un qui tombe. Avec ses racines en l\'air, il ressemblait à un arbre planté à l\'envers. Les animaux regardaient avec surprise. "C\'est ce qui arrive aux orgueilleux !" dit le vieux lion sage.',
        highlightWord: 'punition'
      },
      {
        pageNumber: 6,
        illustration: '😢',
        text: 'Le baobab pleura pendant de longs jours. Il comprenait maintenant sa faute. Il appela Dieu : "Pardonne-moi ! J\'étais orgueilleux et stupide. Chaque arbre est important. Chaque herbe a sa place. Je le comprends maintenant." Sa voix était douce et humble.',
        highlightWord: 'pardon'
      },
      {
        pageNumber: 7,
        illustration: '💚',
        text: 'Dieu entendit la prière du baobab. Il fut touché par ses regrets sincères. "Je te pardonne. Mais tu garderas cette forme pour toujours, pour que les hommes se souviennent de ta leçon." Le baobab accepta avec humilité. Et il commença à accueillir tous les animaux sous ses branches.',
        highlightWord: 'humilité'
      },
      {
        pageNumber: 8,
        illustration: '🌟',
        text: 'Depuis ce jour, le baobab est devenu l\'arbre le plus généreux d\'Afrique. Il donne ses fruits, son eau, son ombre à tous. Les oiseaux nichent dans ses branches, les éléphants boivent son eau, les hommes mangent ses fruits. Et quand tu vois un baobab avec ses racines en l\'air, souviens-toi : l\'orgueil ne mène nulle part.',
        highlightWord: 'généreux'
      }
    ]
  },

  // ════ HISTOIRE 9 ════
  {
    id: 'leo-amis',
    title: 'Léo et ses Nouveaux Amis',
    category: 'EducEnfant Original',
    ageMin: 3, ageMax: 6,
    duration: '5 min',
    stars: 14,
    emoji: '🤝',
    bg: '#FFB3BA',
    isFree: true,
    moral: 'La différence est une richesse. Nos amis nous apprennent des choses que nous ne connaissons pas.',
    content: [
      {
        pageNumber: 1,
        illustration: '🦁',
        text: 'Léo venait d\'arriver dans une nouvelle école. Tout était nouveau : les salles de classe, les maîtresses et surtout les autres élèves. Léo regardait autour de lui avec de grands yeux. Son cœur battait vite. Il avait peur de ne pas se faire d\'amis.',
        highlightWord: 'nouveau'
      },
      {
        pageNumber: 2,
        illustration: '🐘',
        text: 'Le premier élève qu\'il rencontra s\'appelait Ellie. C\'était une petite éléphante avec de grandes oreilles douces. "Bonjour !" dit Ellie avec un grand sourire. "Je m\'appelle Ellie. Et toi ?" "Je... je m\'appelle Léo," dit le lionceau timidement. "Super prénom !" dit Ellie. Léo sourit un peu.',
        highlightWord: 'bonjour'
      },
      {
        pageNumber: 3,
        illustration: '🦒',
        text: 'À la récréation, Léo vit un grand élève tout en haut d\'un arbre. C\'était Jiro, une girafe. "Comment tu fais pour grimper si haut ?" demanda Léo. Jiro rit doucement. "Je ne grimpe pas ! J\'arrive là-haut avec mon long cou !" Léo regarda son propre cou tout court. "Moi j\'aimerais avoir un long cou," dit-il.',
        highlightWord: 'différents'
      },
      {
        pageNumber: 4,
        illustration: '🐦',
        text: '"Et moi j\'aimerais avoir une crinière comme toi !" dit Biko, un perroquet coloré qui volait au-dessus d\'eux. "Ma crinière ?" dit Léo en touchant sa petite crinière toute douce. "Mais elle n\'est même pas encore grande !" "Elle sera magnifique un jour !" dit Biko.',
        highlightWord: 'crinière'
      },
      {
        pageNumber: 5,
        illustration: '🎮',
        text: 'À midi, tous les élèves jouaient ensemble. Ellie jouait au ballon avec ses grandes pattes. Jiro attrapait les ballons qui montaient très haut. Biko volait et criait des encouragements. "Viens jouer, Léo !" appelèrent-ils. Léo courut les rejoindre. Il était très rapide !',
        highlightWord: 'jouer'
      },
      {
        pageNumber: 6,
        illustration: '⚽',
        text: 'Léo attrapa le ballon et courut si vite que personne ne pouvait le rattraper. "WOW !" crièrent Ellie, Jiro et Biko. "Tu cours super vite !" Léo était fier. Lui qui pensait ne rien avoir de spécial... il était le plus rapide de toute l\'école !',
        highlightWord: 'rapide'
      },
      {
        pageNumber: 7,
        illustration: '🌈',
        text: 'En rentrant à la maison ce soir-là, Léo pensa à ses nouveaux amis. Ellie était forte. Jiro était grand. Biko était libre comme l\'air. Et lui, Léo, était rapide. Ils étaient tous différents. Et c\'est pour ça qu\'ensemble, ils étaient parfaits.',
        highlightWord: 'ensemble'
      },
      {
        pageNumber: 8,
        illustration: '💛',
        text: '"Comment s\'est passée ta première journée ?" demanda sa maman. Léo sourit le plus grand sourire de sa vie. "J\'ai trois nouveaux amis ! Une éléphante, une girafe et un perroquet !" Sa maman rit de bonheur. "Tu vois ? Il n\'y avait pas de quoi avoir peur !" "Non," dit Léo. "Il n\'y avait que des amis à découvrir."',
        highlightWord: 'amis'
      }
    ]
  },

  // ════ HISTOIRE 10 ════
  {
    id: 'riviere-poissons',
    title: 'La Rivière aux Mille Couleurs',
    category: 'Conte africain',
    ageMin: 4, ageMax: 8,
    duration: '6 min',
    stars: 18,
    emoji: '🌈',
    bg: '#C7CEEA',
    isFree: false,
    moral: 'La coopération et l\'entraide nous permettent d\'accomplir de grandes choses.',
    content: [
      {
        pageNumber: 1,
        illustration: '🏞️',
        text: 'Au cœur de la forêt africaine coulait une grande rivière. Cette rivière était spéciale : ses eaux changeaient de couleur selon les saisons. En été, elle était bleue comme le ciel. En hiver, elle était verte comme les feuilles. Et au coucher du soleil, elle devenait orange et rose.',
        highlightWord: 'rivière'
      },
      {
        pageNumber: 2,
        illustration: '🐟',
        text: 'Dans cette rivière vivaient des centaines de poissons de toutes les couleurs. Il y avait Kouassi le poisson rouge, Fatou la poisson dorée, Ibrahim le poisson bleu et plein d\'autres. Ils nageaient ensemble et chantaient des chansons sous l\'eau : "Blou blou blou !"',
        highlightWord: 'couleurs'
      },
      {
        pageNumber: 3,
        illustration: '🌵',
        text: 'Un jour, une grande sécheresse arriva. Le soleil brûlait tout. Les herbes jaunissaient. Et la rivière... la rivière commençait à se rétrécir. L\'eau baissait chaque jour. Les poissons avaient peur. "Que va-t-il nous arriver ?" demandait Fatou la dorée.',
        highlightWord: 'sécheresse'
      },
      {
        pageNumber: 4,
        illustration: '🦅',
        text: 'Un vieux pélican qui survolait la région dit aux poissons : "Plus loin dans la forêt, il y a une autre rivière pleine d\'eau fraîche. Mais pour y aller, vous devez traverser une longue plaine sèche." Les poissons regardèrent la plaine. Elle était immense et dangereuse.',
        highlightWord: 'courage'
      },
      {
        pageNumber: 5,
        illustration: '🤝',
        text: 'Kouassi le rouge dit : "Seuls, nous ne pouvons pas traverser. Mais ensemble, nous pouvons le faire !" "Comment ?" demanda Ibrahim le bleu. "Faisons une grande flaque d\'eau commune. Mettons notre eau ensemble pour ne jamais sécher !" Tous les poissons acceptèrent.',
        highlightWord: 'ensemble'
      },
      {
        pageNumber: 6,
        illustration: '💧',
        text: 'Chaque poisson donna un peu de son eau. Ensemble, ils formèrent une grande mare qui se déplaçait lentement sur la plaine. Quand l\'un était fatigué, les autres le portaient. Quand l\'un avait soif, les autres partageaient leur eau. Ils avancèrent ainsi pendant trois jours.',
        highlightWord: 'partage'
      },
      {
        pageNumber: 7,
        illustration: '🎉',
        text: 'Au bout de trois jours, ils virent enfin la nouvelle rivière. Elle était magnifique, pleine d\'eau fraîche et cristalline. Ils s\'y jetèrent avec joie ! SPLASH ! SPLASH ! SPLASH ! Ils nageaient, sautaient, chantaient leur chanson sous l\'eau : "Blou blou blou !"',
        highlightWord: 'joie'
      },
      {
        pageNumber: 8,
        illustration: '🌈',
        text: 'Et depuis ce jour, dans la nouvelle rivière, les poissons ne vivaient plus séparément par couleur. Le rouge nageait avec le bleu, le doré avec le vert. Et quand le soleil se couchait sur la rivière, leurs couleurs mélangées créaient les plus beaux arcs-en-ciel du monde.',
        highlightWord: 'unité'
      }
    ]
  }
]

// Story quizzes data
export const STORY_QUIZZES: Record<string, any[]> = {
  'leo-alphabet': [
    {q: "Comment s'appelle le petit lion ?",
     options:["Simba","Léo","Kofi","Anansi"],
     correct:1, emoji:"🦁"},
    {q: "Quelle est la première lettre que Léo apprend ?",
     options:["B","C","A","D"],
     correct:2, emoji:"🔤"},
    {q: "Qu'est-ce que Léo voit quand il regarde le ciel le soir ?",
     options:["La lune","Des oiseaux","Des étoiles","Des nuages"],
     correct:2, emoji:"⭐"}
  ],
  'mangue-magique': [
    {q: "Comment s'appelle la petite fille ?",
     options:["Kofi","Léo","Aya","Fatou"],
     correct:2, emoji:"👧"},
    {q: "Qu'est-ce qu'Aya trouve en jouant ?",
     options:["Une pièce d'or","Une mangue magique","Un trésor","Un livre"],
     correct:1, emoji:"🥭"},
    {q: "Que fait Aya avec les fruits ?",
     options:["Elle les mange seule","Elle les vend","Elle les partage","Elle les cache"],
     correct:2, emoji:"🤝"}
  ],
  'chiffre-perdu': [
    {q: "Quel chiffre s'est caché ?",
     options:["3","7","5","2"],
     correct:2, emoji:"5️⃣"},
    {q: "Pourquoi le 5 pleurait-il ?",
     options:["Il était blessé","Il avait faim",
              "Personne ne se souvenait de lui","Il était perdu"],
     correct:2, emoji:"😢"},
    {q: "Combien de doigts as-tu sur chaque main ?",
     options:["4","6","3","5"],
     correct:3, emoji:"✋"}
  ],
  'kofi-lion-sage': [
    {q: "De quoi Kofi avait-il peur ?",
     options:["Des lions","Des mathématiques",
              "De l'école","Du noir"],
     correct:1, emoji:"📚"},
    {q: "Comment s'appelle le lion sage ?",
     options:["Léo","Anansi","Simba","Kofi"],
     correct:2, emoji:"🦁"},
    {q: "Qu'est-ce que Kofi a eu comme note à son examen ?",
     options:["La plus mauvaise","La moyenne",
              "La meilleure","Zéro"],
     correct:2, emoji:"🏆"}
  ],
  'anansi-araignee': [
    {q: "Qu'est Anansi ?",
     options:["Un lion","Un oiseau","Une araignée","Un poisson"],
     correct:2, emoji:"🕷️"},
    {q: "Qu'a voulu acheter Anansi au Roi du Ciel ?",
     options:["De l'or","Des histoires","La pluie","Le soleil"],
     correct:1, emoji:"📚"},
    {q: "Comment Anansi a-t-il attrapé le python ?",
     options:["Il l'a chassé","Il l'a piégé dans un trou",
              "Il l'a attaché à un arbre","Il l'a endormi"],
     correct:2, emoji:"🐍"}
  ],
  'cigale-fourmi': [
    {q: "Que faisait la cigale tout l'été ?",
     options:["Elle travaillait","Elle dormait",
              "Elle chantait et dansait","Elle voyageait"],
     correct:2, emoji:"🎵"},
    {q: "Que faisait la fourmi tout l'été ?",
     options:["Elle chantait","Elle préparait sa nourriture",
              "Elle dormait","Elle jouait"],
     correct:1, emoji:"🐜"},
    {q: "Quelle est la morale de cette histoire ?",
     options:["Il faut toujours chanter",
              "Il faut travailler pour l'avenir",
              "Les fourmis sont méchantes",
              "L'hiver est beau"],
     correct:1, emoji:"💡"}
  ]
}

export const getStoryById = (id: string): Story | undefined =>
  STORIES_DATA.find((s) => s.id === id);

export const getStoryQuiz = (id: string) => STORY_QUIZZES[id] || [];
