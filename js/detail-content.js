// Contenu des pop-ups « Lire plus », indexé par le titre affiché.
// Chaque projet a sa propre structure, construite à partir de ce que montre et dit la vidéo.
//   tags   : étiquettes courtes
//   lead   : (optionnel) remplace le texte d'introduction du bouton
//   blocks : liste ordonnée de blocs, chacun optionnel :
//     { type: 'p', text }                       paragraphe
//     { type: 'quote', text, author }           citation entendue dans la vidéo
//     { type: 'facts', items: [[label, val]] }  fiche (lieu, format…)
//     { type: 'steps', title, items }           déroulé étape par étape
//     { type: 'list', title, items }            points clés
window.cocoDetailContent = {
    // ------------------------------------------------------------------
    // Portfolio vidéo
    // ------------------------------------------------------------------
    'Une invitation à célébrer': {
        tags: ['Event planning', 'De A à Z'],
        lead: 'Tout ce qui se passe avant que les invités n’arrivent : les rendez-vous, les repérages, les essais… puis le jour J.',
        blocks: [
            { type: 'p', text: 'Cette vidéo suit un projet du début à la fin. On y voit d’abord les échanges autour d’une table avec les clients, puis la visite du lieu où chaque espace est discuté sur place. Vient ensuite la mise en place : assiettes de présentation dorées, verrerie rose, pommes rouges en centre de table.' },
            { type: 'steps', title: 'Le chemin jusqu’au jour J', items: [
                'Premier rendez-vous : on écoute l’histoire et les envies',
                'Repérage du lieu et choix des espaces',
                'Installation du décor et dressage des tables',
                'Le jour J : accueil des invités et suivi en direct'
            ] },
            { type: 'p', text: 'Le message est simple : vous n’avez pas à tout gérer seul. Un seul interlocuteur vous accompagne du premier café jusqu’au dernier invité.' }
        ]
    },
    'Beautypreneurs Luxury Brunch': {
        tags: ['Abidjan', 'Brunch', 'Vlog · Jour 1'],
        lead: 'Coco Miracles débarque à Abidjan avec toute l’équipe pour le Beautypreneurs Luxury Brunch.',
        blocks: [
            { type: 'facts', items: [['Lieu', 'Abidjan, Côte d’Ivoire'], ['Format', 'Brunch de prestige'], ['Mission', 'Imaginer, planifier et sublimer']] },
            { type: 'p', text: 'Le vlog commence à l’arrivée : visite des lieux, premiers échanges avec l’organisatrice, repérage de la terrasse. Puis l’équipe se met au travail, et la nuit est longue : il est plus de minuit et la décoration est toujours en cours d’installation.' },
            { type: 'p', text: 'Au réveil, le résultat est là : tables rondes nappées de blanc, chaises dorées, verres roses, compositions de roses pâles et une grande pièce signée « Beautypreneurs Luxury Brunch » à l’entrée, le tout baigné d’une lumière rose.' },
            { type: 'quote', text: 'Quand Coco Miracles voyage, elle laisse toujours une empreinte.', author: 'Extrait du vlog' }
        ]
    },
    'Le choix · Scénographie': {
        tags: ['Senza', '« Le choix »', 'Scénographie'],
        lead: 'Un décor de mariage… pour une artiste qui épouse sa musique.',
        blocks: [
            { type: 'p', text: 'Pour le lancement de « Le choix », le projet de l’artiste Senza, la Maison a imaginé une vraie réception de mariage. La vidéo s’ouvre sur un violoniste, puis dévoile la salle : lustres de cristal en centre de table, bougies, assiettes perlées et serviettes violettes, sous une lumière pourpre.' },
            { type: 'list', title: 'Ce qu’on remarque dans la salle', items: [
                'Des lustres de cristal posés comme des centres de table',
                'Des bouquets de fleurs roses et de feuilles tropicales',
                'Un monogramme lumineux au-dessus du coin salon',
                'Des écrans fleuris qui habillent les murs'
            ] }
        ]
    },
    'AT Redemption': {
        tags: ['Coulisses', 'Bord de mer', 'Anniversaire'],
        lead: 'Bienvenue dans les coulisses d’un anniversaire imaginé par Coco Miracles, face à la plage.',
        blocks: [
            { type: 'p', text: 'C’est Jessica, la community manager, qui nous emmène derrière le décor. Avant les lumières, les invités et l’ambiance, il y a des heures de travail, de réflexion et de coordination. Ici, rien n’est improvisé.' },
            { type: 'steps', title: 'Une journée de montage', items: [
                'Montage des structures dès le matin',
                'Installation des matières et mise en place des tables',
                'Tests lumière et réglages techniques',
                'Coordination artistique jusqu’à l’arrivée des invités'
            ] },
            { type: 'p', text: 'Et quand le temps fait des caprices ? On s’adapte. Parce qu’un événement réussi, ce n’est pas seulement ce qu’on voit à la fin, c’est toute l’énergie invisible derrière.' }
        ]
    },
    'Anniversaire · Adebayor': {
        tags: ['Birthday SEA', 'Jardin', 'Soirée'],
        lead: 'Du premier élément installé au dernier détail ajusté : un jardin vide devenu un cadre d’exception.',
        blocks: [
            { type: 'p', text: 'Pour l’anniversaire d’Emmanuel Adebayor, tout part d’un jardin. On y monte un grand fond drapé de voilages crème, signé « Birthday SEA » en lettres dorées, et de longues tables dressées en jaune et or : serviettes nouées, sets dorés, menus personnalisés à son effigie.' },
            { type: 'facts', items: [['Ambiance', 'Crème, jaune et or'], ['Temps fort', 'Le gâteau aux couleurs du football'], ['Lieu', 'Un jardin transformé']] },
            { type: 'p', text: 'Le soir venu, le jardin se remplit. Les invités entourent le gâteau sous les étincelles, et la soirée prend vie. Comme le dit la vidéo : un événement ne se raconte pas, il se vit.' }
        ]
    },
    'AT Redemption · Part 2': {
        tags: ['Dress code blanc', 'Plage', 'Nuit'],
        lead: 'Le retour en images : la même plage, une fois la nuit tombée.',
        blocks: [
            { type: 'p', text: 'Après les coulisses, place à la soirée. Les invités arrivent tout en blanc, accueillis par des hôtesses devant le panneau de bienvenue. Sous la tente, les tables rondes sont alignées sous des guirlandes lumineuses.' },
            { type: 'list', title: 'Les moments forts', items: [
                'Un grand feu de camp allumé sur le sable',
                'Une entrée sous les fontaines d’étincelles',
                'Une danseuse de feu pour enflammer la piste',
                'Une soirée en blanc, verre à la main, sous les lumières'
            ] }
        ]
    },
    'Le choix · Clap de fin': {
        tags: ['Senza', '« Le choix »', 'Témoignages'],
        lead: 'Un mariage sans marié : ce soir-là, Senza a choisi la musique.',
        blocks: [
            { type: 'p', text: 'Tout ressemblait à un mariage : les fleurs, l’émotion, les invités. Mais il n’y avait pas de marié. Ce soir-là, Senza unissait sa vie à ce qui l’anime depuis toujours, la musique. La scénographie racontait son parcours et le nouveau chapitre qu’elle s’apprêtait à partager, et cette union porte un nom : « Le choix ».' },
            { type: 'quote', text: 'C’est une décoration à la fois épurée et quand même assez sophistiquée. C’est vraiment bien fait.', author: 'Une invitée' },
            { type: 'quote', text: 'Félicitations Julio, c’est du bon boulot. Je donne 10, parce que c’est magnifique.', author: 'Un invité' },
            { type: 'p', text: 'Le mur de signatures se remplit de messages, et une invitée l’avoue en souriant : pour son propre mariage, elle ne voudrait pas la même chose… elle voudrait encore plus.' }
        ]
    },

    // ------------------------------------------------------------------
    // Nos réalisations (photos)
    // ------------------------------------------------------------------
    'Des décors qui racontent une histoire': {
        tags: ['Scénographie', 'Vert olive'],
        blocks: [
            { type: 'p', text: 'Sur cette table, tout part d’une couleur : un vert olive en satin drapé. Autour, des fleurs blanches et vert tendre, des bougies sous verre et des serviettes nouées comme des rubans sur chaque assiette.' },
            { type: 'p', text: 'C’est notre façon de travailler : on choisit une idée forte, puis chaque détail vient la raconter. Votre histoire, vos couleurs, votre lieu.' }
        ]
    },
    'L’élégance de chaque instant': {
        tags: ['Table d’honneur', 'Ivoire'],
        blocks: [
            { type: 'p', text: 'Une table d’honneur tout en ivoire : un fond de drapés en vagues, une guirlande de fleurs blanches posée sur toute la longueur, des bougies et des chaises blanches au dossier arrondi.' },
            { type: 'list', title: 'Pourquoi ça fonctionne', items: [
                'Une seule palette de couleurs, du sol au plafond',
                'Des drapés qui donnent du volume sans surcharger',
                'La lumière des bougies pour adoucir l’ensemble'
            ] }
        ]
    },
    'Le détail, signature de la Maison': {
        tags: ['Drapés de plafond', 'Tons nude'],
        blocks: [
            { type: 'p', text: 'Ici, le décor commence au plafond : de grands voilages nude et rosés tombent en cascade, entre des suspensions en macramé et des lanternes tressées. Plus bas, chaises en bois clair et tables rondes fleuries.' },
            { type: 'p', text: 'Habiller le plafond change complètement la perception d’une salle : elle devient plus chaleureuse, plus intime, et les invités le ressentent dès l’entrée.' }
        ]
    },
    'Une expérience pensée sur mesure': {
        tags: ['Thème', 'Bleu & blanc'],
        blocks: [
            { type: 'p', text: 'Un thème poussé jusqu’au bout : montgolfières, arches de ballons bleus, blancs et beige, oursons en peluche et un chemin de table bleu assorti aux verres.' },
            { type: 'list', title: 'Le sur-mesure, concrètement', items: [
                'Un thème choisi avec vous, puis décliné partout',
                'Des couleurs reprises de l’arche jusqu’à la verrerie',
                'Un coin photo pensé pour les souvenirs'
            ] }
        ]
    },
    'Des souvenirs faits pour durer': {
        tags: ['Grande réception', 'Lustre'],
        blocks: [
            { type: 'p', text: 'Un immense lustre de cristal au-dessus d’une salle pleine : chaises noires, compositions de fleurs blanches à chaque table et verdure tout autour.' },
            { type: 'p', text: 'Pour une grande réception, on travaille l’effet d’ensemble : ce qui frappe en entrant, c’est l’harmonie des tables, toutes identiques, avec un point fort au-dessus de tout le monde.' }
        ]
    },
    'Un cadre d’exception pour vos invités': {
        tags: ['Lieu', 'Villa & piscine'],
        blocks: [
            { type: 'p', text: 'Une villa lumineuse, une piscine, des bougainvilliers en fleurs : certains lieux sont déjà un décor. Notre rôle est alors de les sublimer sans les cacher.' },
            { type: 'list', title: 'Ce qu’on regarde lors d’un repérage', items: [
                'Les espaces : accueil, dîner, piste, coin détente',
                'La lumière naturelle selon l’heure de l’événement',
                'Un plan B si la météo change'
            ] }
        ]
    },

    // ------------------------------------------------------------------
    // Mise en beauté
    // ------------------------------------------------------------------
    'Teint haute définition': {
        tags: ['Mariée', 'Témoignage'],
        lead: 'Le jour de son mariage, une mariée prend la parole pour remercier celui qui l’a préparée.',
        blocks: [
            { type: 'p', text: 'Chignon travaillé, diadème, voile et robe bustier : on suit la mariée de la préparation, entre palettes et pinceaux, jusqu’au résultat final. Le teint reste lumineux et naturel, même face à l’objectif.' },
            { type: 'quote', text: 'Coco Miracles, c’est toute une histoire. Je suis très heureuse d’être sublimée de la tête aux pieds par mon meilleur ami Julio. Aujourd’hui c’est mon mariage, et c’est grâce à lui.', author: 'La mariée' }
        ]
    },
    'Mise en beauté nuptiale': {
        tags: ['Glam', 'Regard rosé'],
        blocks: [
            { type: 'p', text: 'Un glam tout en chaleur : fard rosé et prune fondu sur la paupière, eye-liner fin, cils marqués et lèvres nude brillantes. Le teint reste doré et unifié, sans effet de masque.' },
            { type: 'p', text: 'Ce type de mise en beauté tient la journée et passe aussi bien à la lumière du jour qu’en soirée.' }
        ]
    },
    'Regard sublimé': {
        tags: ['Avant / après', 'Soirée'],
        blocks: [
            { type: 'p', text: 'La vidéo commence sans maquillage, foulard sur les cheveux. Quelques secondes plus tard : bustier rouge, longues boucles, et un regard travaillé en dégradé de rose et corail.' },
            { type: 'list', title: 'Le travail sur le regard', items: [
                'Des fards fondus du rose au corail',
                'Des cils intenses pour ouvrir l’œil',
                'Un teint lumineux qui équilibre la couleur'
            ] }
        ]
    },
    'Soins d’apparat': {
        tags: ['Avant / après', 'Vintage glam'],
        blocks: [
            { type: 'p', text: 'Tout commence peau nue, bandeau dans les cheveux : préparation et massage du visage avant le moindre produit. La transformation arrive ensuite : perruque blond cuivré, regard rosé, collier de perles et gants en dentelle.' },
            { type: 'p', text: 'Une peau bien préparée, c’est un maquillage qui tient mieux et qui capte mieux la lumière. C’est la base de chaque mise en beauté.' }
        ]
    },

    // ------------------------------------------------------------------
    // Galerie d'événements (vidéos 8 à 20)
    // ------------------------------------------------------------------
    'Le choix · Félicitations': {
        tags: ['Mariage', 'Lilas & cristal', 'Orchestre live'],
        lead: 'Après des mois de préparation et quelques nuits blanches, le grand jour de Sandra et Rémi est enfin arrivé.',
        blocks: [
            { type: 'p', text: 'C’est Julio, le CEO, qui raconte. Pendant des mois, l’équipe a travaillé aux côtés des mariés pour transformer le lieu en celui qu’ils avaient toujours imaginé : tables lilas, assiettes de présentation en cristal, serviettes nouées, un violoniste à l’accueil et un apéritif accompagné d’un orchestre live.' },
            { type: 'p', text: 'Mais au-delà du décor, il retient surtout l’aventure humaine : des mariés adorables, avec qui les idées ont circulé dès la première rencontre.' },
            { type: 'quote', text: 'Sandra et Rémi, bienvenue dans votre nouveau chapitre.', author: 'Julio, CEO de Coco Miracles' }
        ]
    },
    'La vision prend vie': {
        tags: ['Anniversaire · 40 ans', 'Bord de mer', 'Vert & blanc'],
        lead: 'Des 40 ans célébrés en bord de mer, en vert émeraude et blanc.',
        blocks: [
            { type: 'p', text: 'Les invités sont accueillis par une haie d’hôtesses en noir et or jusqu’à l’entrée. Sous la tente, les tables sont nappées de vert, avec des chaises blanches, des arches fleuries et un grand monogramme lumineux aux initiales de la célébrée.' },
            { type: 'list', title: 'Les détails qui marquent', items: [
                'Une piste de danse en verre posée sur le sable',
                'Un gâteau vert et blanc aux couleurs de la soirée',
                'Des danseuses en blanc pour ouvrir la fête'
            ] }
        ]
    },
    'Le clou du spectacle': {
        tags: ['Adebayor · Partie 3', 'Vert & orange', 'Héritage'],
        lead: 'Pour la troisième partie de l’anniversaire du Maréchal, la Maison change d’énergie.',
        blocks: [
            { type: 'p', text: 'Fini le crème et l’or : place au vert et à l’orange, une ambiance plus vivante, plus audacieuse. Des drapés vert et bordeaux encadrent le fond « SEA », les tables rondes sont nappées de vert et dressées avec des éventails en bois.' },
            { type: 'p', text: 'Pour donner encore plus d’âme au décor, l’équipe a glissé des touches traditionnelles : assises inspirées du patrimoine, matières naturelles et éléments artisanaux, entre modernité et héritage.' },
            { type: 'quote', text: 'Un décor qui attire. Un décor qui ose. Un décor qui affirme.', author: 'Extrait de la vidéo' }
        ]
    },
    'Less, but unforgettable': {
        tags: ['Anniversaire', 'Intimiste', 'Bougies'],
        lead: 'Moins de décor, plus d’émotion : un anniversaire intimiste éclairé à la bougie.',
        blocks: [
            { type: 'p', text: 'La palette reste douce, crème et beige, sublimée par le cristal et par un grand voilage qui structure l’espace sous la tente. Mais la vraie signature de cette réception, ce sont les bougies : des centaines, sur les tables, aux endroits clés et jusqu’à l’extérieur.' },
            { type: 'p', text: 'À la tombée de la nuit, leur lumière change tout : le cristal reflète les flammes, le voilage s’illumine et la réception devient chaleureuse, élégante et feutrée.' }
        ]
    },
    'Déjeuner olfactif': {
        tags: ['Parfum', 'Rooftop', 'Déjeuner'],
        lead: 'Un déjeuner d’exception autour de l’univers du parfum, auquel la Maison a eu le privilège d’assister.',
        blocks: [
            { type: 'p', text: 'Sur un rooftop avec piscine, les invitées trinquent avant de passer à table. Les boissons sont servies en flacons colorés, comme des parfums, et la table est fleurie de blanc. Au micro, l’hôtesse présente ses créations pendant que les invitées testent les senteurs sur des touches.' },
            { type: 'p', text: 'Un format original qui inspire : faire vivre une marque à travers les sens, autour d’une table.' }
        ]
    },
    'Célébration · Adebayor': {
        tags: ['Adebayor · Partie 1', 'Coulisses', 'Jardin'],
        lead: 'Damiana, de l’équipe Coco Miracles, nous emmène dans les coulisses de l’anniversaire du Maréchal.',
        blocks: [
            { type: 'p', text: 'La demande : une décoration sophistiquée, classe et intemporelle, en harmonie avec le style à la fois classique et moderne du lieu. Rien d’excessif, juste de l’élégance et de la maîtrise.' },
            { type: 'steps', title: 'Dans le jardin', items: [
                'Montage des grands voilages crème',
                'Installation des tables rondes et des chaises dorées',
                'Mise en place de la scène « Birthday SEA »',
                'Roses jaunes dans des cadres ronds pour la touche finale'
            ] },
            { type: 'p', text: 'Matières choisies avec soin, jeux de textures, lumières subtiles : une atmosphère chaleureuse mais prestigieuse, pensée pour être vécue.' }
        ]
    },
    'Célébration authentique': {
        tags: ['Soirée traditionnelle', 'Plage', 'Matières naturelles'],
        lead: 'Une soirée traditionnelle sur la plage, préparée dans le rush et livrée à temps.',
        blocks: [
            { type: 'p', text: '« Les gars, comme vous voyez, on est extrêmement dans le rush. » Le ton est donné. Sur le sable, l’équipe installe des tables nappées de vert, des feuilles de bananier, des calebasses, des sets en osier et des serviettes nouées couleur moutarde.' },
            { type: 'list', title: 'L’esprit du décor', items: [
                'Des matières naturelles : osier, bois, feuilles',
                'Des calebasses et objets artisanaux en centre de table',
                'Un feu d’artifice pour finir la soirée'
            ] }
        ]
    },
    'Vlog des amoureux': {
        tags: ['Surprise', 'Anniversaire', 'En amoureux'],
        lead: 'Une surprise d’anniversaire en amoureux, préparée à la maison.',
        blocks: [
            { type: 'p', text: 'Dans un appartement transformé pour l’occasion : ballons rouges et blancs, néon « Happy Birthday », cocktails, un piano et un dîner cuisiné sur place. Le vlog est raconté avec humour, en mode « c’est nous on aime pas »…' },
            { type: 'p', text: 'La preuve qu’on n’a pas besoin d’une grande salle : une pièce, une idée et des détails bien pensés suffisent pour créer un vrai moment.' }
        ]
    },
    'Vloooog Coco Miracles': {
        tags: ['Backstage', 'Deux événements', 'Même jour'],
        lead: 'Gros dilemme : deux événements le même jour, et il faut être partout.',
        blocks: [
            { type: 'p', text: 'D’un côté, un mariage traditionnel. De l’autre, un anniversaire prestigieux. Julio fait la navette en voiture pour superviser les deux équipes : montage de la tente, nappage, cocktails à la grenadine en place.' },
            { type: 'p', text: 'Le soir, c’est l’anniversaire « King of Boyz » : tables blanches, roses rouges, serviettes rouges et grand nœud sur le fond. Une journée marathon, sans rien lâcher sur les détails.' }
        ]
    },
    'Scénographie blanche': {
        tags: ['Rouge & blanc', 'Anniversaire', 'King of Boyz'],
        lead: 'Quand le rouge rencontre le blanc, l’élégance prend vie.',
        blocks: [
            { type: 'p', text: 'Pour l’anniversaire « King of Boyz », la Maison a joué le contraste : nappes blanches, roses rouges en cascade, serviettes rouges pliées sur chaque assiette et un grand nœud bordeaux sur le fond, avec des chiffres dorés.' },
            { type: 'quote', text: 'Lorsque passion rencontre pureté, ils se répondent dans une harmonie parfaite.', author: 'Damiana, Coco Miracles' }
        ]
    },
    'Événement privé à Lomé': {
        tags: ['Lomé', 'Suy Parfums', 'Blanc & vert'],
        lead: 'À Lomé, un événement privé aux couleurs de Suy Parfums.',
        blocks: [
            { type: 'p', text: 'Cette fois, ce n’est pas Julio à la caméra : c’est Diane, designer d’événements de la Maison, qui présente la décoration qu’elle a signée. Tables blanches, fauteuils vert sapin, chemin de fleurs blanches au centre et compositions hautes.' },
            { type: 'facts', items: [['Lieu', 'Lomé'], ['Univers', 'Suy Parfums'], ['Palette', 'Blanc et vert']] }
        ]
    },
    'Inspiration & création': {
        tags: ['Abidjan 2025', 'Salon', 'The Luxury Bridal'],
        lead: 'Quelques jours à explorer, à apprendre et à s’inspirer, au salon The Luxury Bridal à Abidjan.',
        blocks: [
            { type: 'p', text: 'Ici, la Maison n’organise pas : elle observe. Stands de mariage, tables dressées en rose et vaisselle dorée, buffets de desserts colorés, compositions florales… Chaque détail est une idée à ramener.' },
            { type: 'p', text: 'Se former et s’inspirer en continu, c’est ce qui permet de proposer des décors toujours nouveaux à nos clients.' }
        ]
    },
    'Vlog · Création événementielle': {
        tags: ['Mariage traditionnel', 'Coulisses', 'J-2'],
        lead: 'Dans les coulisses d’un mariage traditionnel, deux jours avant le grand jour.',
        blocks: [
            { type: 'p', text: 'Julio nous fait visiter la salle encore vide, puis suit l’installation : tables nappées de rose, gazon vert au sol, fleurs roses et grand portrait du couple « Together and Forever ». L’équipe a commencé deux jours à l’avance pour un rendu impeccable.' },
            { type: 'steps', title: 'Le déroulé', items: [
                'Visite de la salle vide',
                'Nappage, verrerie et compositions florales',
                'Gestion des imprévus, toujours au rendez-vous',
                'Derniers détails peaufinés avant l’arrivée des invités'
            ] }
        ]
    },

    // ------------------------------------------------------------------
    // Galerie beauté (vidéos 5 à 14)
    // ------------------------------------------------------------------
    'Bonne fête à tous': {
        tags: ['Jour de fête', 'Gele lilas'],
        blocks: [
            { type: 'p', text: 'Un look de fête tout en harmonie : foulard noué (gele) lilas, tenue lilas et or, grand collier doré. Le maquillage suit la même ligne, avec un teint lumineux, un regard étiré et des lèvres nude.' },
            { type: 'p', text: 'Une mise en beauté pensée avec la tenue, pas à côté : c’est ce qui donne cet effet d’ensemble.' }
        ]
    },
    'C’est qui ça': {
        tags: ['Glam souriant', 'Tons framboise'],
        blocks: [
            { type: 'p', text: 'Coupe courte, boucles d’oreilles fleurs et haut à volants framboise : le maquillage reprend les tons de la tenue avec un regard doux et des lèvres rosées. Un look frais, qui accompagne un grand sourire.' }
        ]
    },
    'Devinez qui · Santrinos': {
        tags: ['Avant / après', 'Clip musical'],
        blocks: [
            { type: 'p', text: 'Une transformation inspirée par l’univers du nouveau clip de Santrinos Raphaël : on part de cheveux bouclés au naturel pour arriver à un glam lumineux, fleurs bleues dans les cheveux et haut en strass.' },
            { type: 'list', title: 'Le look', items: ['Un regard bleuté assorti aux accessoires', 'Un teint glowy qui capte la lumière', 'Des lèvres nude et brillantes'] }
        ]
    },
    'Lady Night Glam': {
        tags: ['Soirée', 'Lèvres rouges'],
        blocks: [
            { type: 'p', text: 'Deux ambiances dans la même vidéo : d’abord des lèvres très sombres, puis un rouge franc, avec un bustier blanc, des plumes noires et une coiffure volumineuse. Un glam affirmé, taillé pour la nuit.' }
        ]
    },
    'Mise en beauté · Mano Agb': {
        tags: ['Glam culturel', 'Bijoux dorés'],
        blocks: [
            { type: 'p', text: 'Coiffure en puffs ornés de bagues dorées, chaîne de tête, grand plastron perlé et tenue en dentelle rouge : le maquillage joue un smoky gris doux et des lèvres nude pour laisser briller les bijoux.' }
        ]
    },
    'POV · Votre rendez-vous beauté': {
        tags: ['Avant / après', 'Rendez-vous'],
        lead: 'À quoi ressemble un rendez-vous maquillage chez Coco Miracles ?',
        blocks: [
            { type: 'p', text: 'On arrive bonnet sur la tête, visage nu… et on repart avec un carré lisse, un regard travaillé et un top rouge assorti aux lèvres. Toute la transformation tient en quelques secondes de vidéo.' }
        ]
    },
    'Saturday Glam': {
        tags: ['Glam rosé', 'Perles'],
        blocks: [
            { type: 'p', text: 'Cape de maquillage et foulard pour commencer, puis le résultat : queue de cheval plaquée, fards rosés, lèvres glossy, ras-de-cou en perles et bustier noir. Un glam de samedi soir, lumineux et chic.' }
        ]
    },
    'Togolese Girl': {
        tags: ['Avant / après', 'Fierté togolaise'],
        lead: '« POV : les Togolaises sont belles. »',
        blocks: [
            { type: 'p', text: 'Une transformation tout en douceur : un carré court, un haut en satin blanc et un maquillage soft glam qui sublime les traits sans les masquer. Une ode à la beauté togolaise.' }
        ]
    },
    'You Are Beautiful': {
        tags: ['Naturel', 'Teint glowy'],
        blocks: [
            { type: 'p', text: 'Longs cheveux lisses, débardeur kaki et un maquillage qui reste naturel : teint doré et lumineux, regard légèrement étiré, lèvres nude. La beauté naturelle mise en valeur, sans en faire trop.' }
        ]
    },
    'LEVEL': {
        tags: ['Avant / après', 'Regard émeraude'],
        blocks: [
            { type: 'p', text: 'On commence par la préparation de la peau, puis le regard prend vie : fard vert émeraude intense, eye-liner graphique, longues boucles et bijoux dorés. Une vidéo filmée par @bye_visuals.' }
        ]
    }
};
