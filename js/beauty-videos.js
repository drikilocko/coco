window.cocoBeautyVideos = [
    {
        title: 'Teint haute définition',
        description: 'Un teint lumineux et des finitions soignées pour une mise en beauté tout en élégance.',
        filename: '1.mp4'
    },
    {
        title: 'Mise en beauté nuptiale',
        description: 'Une création maquillage pensée pour accompagner les grands instants.',
        filename: '2.mp4'
    },
    {
        title: 'Regard sublimé',
        description: 'Un regard travaillé avec précision et harmonie.',
        filename: '3.mp4'
    },
    {
        title: 'Soins d’apparat',
        description: 'Une mise en beauté raffinée, du soin aux dernières finitions.',
        filename: '4.mp4'
    },
    {
        title: 'Bonne fête à tous',
        description: 'Une mise en beauté festive imaginée par Coco Miracles.',
        filename: 'Bonne fête à tous 🕋☪️..💄- _coco_miracles - _coco__dopee.mp4'
    },
    {
        title: 'C’est qui ça',
        description: 'Un aperçu beauté partagé avec @jesuyfatemofficialaccount.',
        filename: 'C’est qui ça  ❤️🌸 @jesuyfatemofficialaccount.mp4'
    },
    {
        title: 'Devinez qui · Santrinos',
        description: 'Un look beauté réalisé autour du clip de @santrinos_raphael.',
        filename: 'Devinez c’est qui en commentaire ❤️🥺💕.Ps- allez regarder le nouveau clip de @santrinos_raphael.mp4'
    },
    {
        title: 'Lady Night Glam',
        description: 'Un look glamour pour @mariam.cesse, réalisé par Coco Miracles.',
        filename: 'Lady night glam 💄..Muse - @mariam.cesse MUA- @coco_miracles.mp4'
    },
    {
        title: 'Mise en beauté · Mano Agb',
        description: 'Une mise en beauté signée Coco Miracles pour @mano_agb.',
        filename: 'MUA- DRESS-DA - @coco_miracles 💄❤️Muse- @mano_agb.mp4'
    },
    {
        title: 'POV · Votre rendez-vous beauté',
        description: 'Un aperçu d’un rendez-vous maquillage chez Coco Miracles.',
        filename: 'POV - when  you decide to get your makeup done at Coco Miracles❤️(1).mp4'
    },
    {
        title: 'Saturday Glam',
        description: 'Un look glam imaginé et réalisé par @coco_miracles.',
        filename: 'Saturday glam by @coco_miracles 💄❤️.mp4'
    },
    {
        title: 'Togolese Girl',
        description: 'Une inspiration beauté aux couleurs du Togo.',
        filename: 'Togolese girlll 🇹🇬❤️.mp4'
    },
    {
        title: 'You Are Beautiful',
        description: 'Une création beauté lumineuse signée Coco Miracles.',
        filename: 'You are beautiful 💄✨💕.mp4'
    },
    {
        title: 'LEVEL',
        description: 'Une création maquillage par Coco Miracles, filmée par @bye_visuals.',
        filename: 'LEVEL 👌🏾📌..Mua - @coco_miracles Vidéo - @bye_visuals.mp4'
    }
].map((video, index) => ({
    ...video,
    poster: `asset/beaute/posters/${String(index + 1).padStart(2, '0')}.jpg`,
    src: `asset/beaute/${encodeURIComponent(video.filename)}`
}));
