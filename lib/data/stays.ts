import type { Stay } from '../types'

export const stays: Stay[] = [
    {
        id: 'stay-001',
        slug: 'escapade-bordeaux',
        title: "Escapade à Bordeaux",
        location: 'Bordeaux',
        country: 'France',
        price: 2490,
        duration: '4 days',
        image: '/images/stays/bordeaux-hero.jpg',
        gallery: ['/images/stays/bordeaux-1.jpg', '/images/stays/bordeaux-2.jpg'],
        badge: 'exclusive',
        services: ['Private transfer', 'Wine tasting', 'Concierge'],
        description: 'A curated luxury escape through Bordeaux vineyards and private chateaux.',
        highlights: ['Private tasting', 'Château dinner', 'Hot air balloon option'],
        itinerary: [
            { day: 1, title: 'Arrivée & Dégustation', description: 'Accueil et première dégustation privée.' },
            { day: 2, title: 'Visite des châteaux', description: 'Visites et déjeuner dans un domaine.' }
        ],
        accommodation: { name: 'Hôtel de Luxe', category: '5-star' }
    }
]

export default stays
