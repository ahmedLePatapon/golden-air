export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface Accommodation {
    name: string;
    category?: string;
    description?: string;
}

export interface Stay {
    id: string;
    slug: string;
    title: string;
    location: string;
    country: string;
    price: number;
    duration: string;
    image: string;
    gallery: string[];
    badge?: 'exclusive' | 'new' | 'all-inclusive';
    services: string[];
    description: string;
    highlights: string[];
    itinerary: ItineraryDay[];
    accommodation: Accommodation;
}
