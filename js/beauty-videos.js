window.cocoBeautyVideos = [
    {
        title: 'Teint haute définition',
        description: 'Un teint lumineux aux finitions délicates, travaillé pour révéler l’éclat naturel de la peau.',
        filename: '1.mp4'
    },
    {
        title: 'Mise en beauté nuptiale',
        description: 'Des tons doux et une tenue longue durée composent cette mise en beauté dédiée aux grands instants.',
        filename: '2.mp4'
    },
    {
        title: 'Regard sublimé',
        description: 'Des nuances fondues et un regard défini captent la lumière sous tous les angles.',
        filename: '3.mp4'
    },
    {
        title: 'Soins d’apparat',
        description: 'La préparation de la peau et les dernières finitions s’unissent pour un résultat frais et équilibré.',
        filename: '4.mp4'
    },
    {
        title: 'Bonne fête à tous',
        description: 'Une mise en beauté lumineuse et festive, imaginée par Coco Miracles pour célébrer cette journée.',
        filename: 'Bonne fête à tous 🕋☪️..💄- _coco_miracles - _coco__dopee.mp4'
    },
    {
        title: 'C’est qui ça',
        description: 'Un look frais et lumineux réalisé pour @jesuyfatemofficialaccount.',
        filename: 'C’est qui ça  ❤️🌸 @jesuyfatemofficialaccount.mp4'
    },
    {
        title: 'Devinez qui · Santrinos',
        description: 'Une création maquillage inspirée par l’univers du nouveau clip de @santrinos_raphael.',
        filename: 'Devinez c’est qui en commentaire ❤️🥺💕.Ps- allez regarder le nouveau clip de @santrinos_raphael.mp4'
    },
    {
        title: 'Lady Night Glam',
        description: 'Un glamour affirmé et des détails soignés pour la mise en beauté de @mariam.cesse.',
        filename: 'Lady night glam 💄..Muse - @mariam.cesse MUA- @coco_miracles.mp4'
    },
    {
        title: 'Mise en beauté · Mano Agb',
        description: 'Une mise en beauté personnalisée pour @mano_agb, pensée en harmonie avec sa tenue.',
        filename: 'MUA- DRESS-DA - @coco_miracles 💄❤️Muse- @mano_agb.mp4'
    },
    {
        title: 'POV · Votre rendez-vous beauté',
        description: 'Les étapes d’un rendez-vous maquillage chez Coco Miracles, du travail du teint au rendu final.',
        filename: 'POV - when  you decide to get your makeup done at Coco Miracles❤️(1).mp4'
    },
    {
        title: 'Saturday Glam',
        description: 'Un look Saturday Glam aux reflets lumineux, imaginé et réalisé par @coco_miracles.',
        filename: 'Saturday glam by @coco_miracles 💄❤️.mp4'
    },
    {
        title: 'Togolese Girl',
        description: 'Une inspiration beauté aux couleurs du Togo, relevée par un teint frais et lumineux.',
        filename: 'Togolese girlll 🇹🇬❤️.mp4'
    },
    {
        title: 'You Are Beautiful',
        description: 'Un maquillage délicat qui souligne la beauté naturelle et illumine le visage.',
        filename: 'You are beautiful 💄✨💕.mp4'
    },
    {
        title: 'LEVEL',
        description: 'Les gestes et les finitions d’une création maquillage Coco Miracles, filmés par @bye_visuals.',
        filename: 'LEVEL 👌🏾📌..Mua - @coco_miracles Vidéo - @bye_visuals.mp4'
    }
].map((video, index) => ({
    ...video,
    poster: `asset/beaute/posters/${String(index + 1).padStart(2, '0')}.jpg`,
    src: `asset/beaute/${encodeURIComponent(video.filename)}`
}));
