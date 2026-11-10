window.cocoPortfolioVideos = [
    {
        title: 'Une invitation à célébrer',
        filename: 'Your sign to book your favorite event planner is right here. ✨..@coco_miracles ✨❤️.mp4'
    },
    {
        title: 'Beautypreneurs Luxury Brunch',
        filename: '_coco_miracles DÉBARQUE A ABIDJAN 🇨🇮..Pour le _beautypreneurs_luxurybrunch 🌸💐..Une expérienc.mp4'
    },
    {
        title: 'Le choix · Scénographie',
        filename: '#cocomiracles #decoration #weeding #senza.mp4'
    },
    {
        title: 'AT Redemption',
        filename: 'AT REDEMPTION ❤️..Évent design and déco _coco_miracles.mp4'
    },
    {
        title: 'Anniversaire · Adebayor',
        filename: '_e_adebayor BIRTHDAY PARTY PART 3 by _coco_miracles. Les matières nobles, les textures délicates.mp4'
    },
    {
        title: 'AT Redemption · Part 2',
        filename: 'AT Redemption – Part 2 ✨Retour en images sur cette magnifique décoration.Designed by Coco Miracl.mp4'
    },
    {
        title: 'Le choix · Clap de fin',
        filename: 'CLAP DE FIN 🎬 ❤️🥺.« LE CHOIX » est dehors ❤️☺️.._coco_miracles ❌ _s.e.n.z.a.a_ ...mp4'
    },
    {
        title: 'Le choix · Félicitations',
        filename: 'Félicitations, ce fut un plaisir de t’aider à parfaire cette journée ❤️😩 @s.e.n.z.a.a_ 🥺❤️❤️ ..mp4'
    },
    {
        title: 'La vision prend vie',
        filename: 'La vision prend vie ✨De l’idée aux derniers détails, chaque élément a été pensé avec soin.Textur.mp4'
    },
    {
        title: 'Le clou du spectacle',
        filename: 'Le clou du spectacle ✨Quand les couleurs parlent d’elles-mêmes et que chaque détail trouve sa pl.mp4'
    },
    {
        title: 'Less, but unforgettable',
        filename: 'Less, but make it unforgettable✨Une scénographie épurée où les bougies prennent toute la lumière.mp4'
    },
    {
        title: 'Déjeuner olfactif',
        filename: '⸻Nous avons eu le privilège d’assister à un déjeuner olfactif d’exception, organisé par @jesuyfa.mp4'
    },
    {
        title: 'Célébration · Adebayor',
        filename: 'Pour célébrer le Maréchal @e_adebayor .@coco_miracles s’est transformé en un écrin de douceur et.mp4'
    },
    {
        title: 'Célébration authentique',
        filename: 'Une célébration enracinée dans la culture et l’authenticité.Pagnes élégamment drapés, calebasses.mp4'
    },
    {
        title: 'Vlog des amoureux',
        filename: 'VLOGGGG des amoureux ❤️.mp4'
    },
    {
        title: 'Vloooog Coco Miracles',
        filename: 'VLOOOOGGGG.mp4'
    },
    {
        title: 'Scénographie blanche',
        filename: '@coco_miracles a imaginé un  univers pensé comme une respiration.Le blanc immaculé domine l’espa.mp4'
    },
    {
        title: 'Événement privé à Lomé',
        filename: 'À Lomé, @coco_miracles a eu l’honneur de sublimer un événement privé tout en finesse pour @suypa.mp4'
    }
].map((video, index) => ({
    ...video,
    poster: `asset/video/posters/${String(index + 1).padStart(2, '0')}.jpg`,
    src: `asset/video/${encodeURIComponent(video.filename)}`
}));
