// Stripe product configuration
export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

// Main video packages
export const videoPackages: Record<string, StripeProduct> = {
  spark: {
    priceId: 'price_1RDUSmG8zs3IhGJ0mJcD4trI',
    name: 'Spark Video-Paket',
    description: 'Dein 30-Sekunden-Video in jedem Format (16:9, 9:16, 1:1) inkl. Musik & Texteinblendungen. Fertig in 24-48 Stunden.',
    mode: 'payment',
    price: 150
  },
  flash: {
    priceId: 'price_1RDUTuG8zs3IhGJ05S1R8Rrj',
    name: 'Flash Video-Paket',
    description: 'Ihr 60-Sekunden-Video mit mehr Details/Szenen, in jedem Format (16:9, 9:16, 1:1), inkl. Musik & Text. Fertig in 24-48 Std.',
    mode: 'payment',
    price: 250
  },
  ultra: {
    priceId: 'price_1RDUVaG8zs3IhGJ0OtMO7OPU',
    name: 'Ultra Video-Paket',
    description: 'Ihr 90-Sekunden-Video (maximale Details & Szenen), in jedem Format (16:9, 9:16, 1:1), inkl. Musik & Text. Fertig in 24-48 Std.',
    mode: 'payment',
    price: 350
  }
};

// Upsell options
export const upsellOptions: Record<string, StripeProduct> = {
  additionalFormat: {
    priceId: 'price_1RDUY2G8zs3IhGJ0IiDQVn9z',
    name: 'Videoformat',
    description: 'Zusätzliches Videoformat',
    mode: 'payment',
    price: 30
  },
  expressDelivery: {
    priceId: 'price_1RDUYZG8zs3IhGJ0ohGEU7Ty',
    name: 'Expresslieferung',
    description: 'Expresslieferung (innerhalb von 12 Stunden)',
    mode: 'payment',
    price: 100
  },
  videoQuality: {
    priceId: 'price_1RDUZFG8zs3IhGJ0lNUcN5O2',
    name: 'Upgrade Videoqualität',
    description: 'Upgrade auf 4K-Auflösung (statt HD)',
    mode: 'payment',
    price: 50
  },
  customEffects: {
    priceId: 'price_1RDUZiG8zs3IhGJ0BlOw4pdn',
    name: 'Individuelle Animationen/Effekte',
    description: 'Individuelle Animationen/Effekte',
    mode: 'payment',
    price: 60
  },
  colorCorrection: {
    priceId: 'price_1RDUajG8zs3IhGJ06iVFFMPv',
    name: 'Individuelle Farbkorrektur',
    description: 'Individuelle Farbkorrektur',
    mode: 'payment',
    price: 60
  },
  sourceFiles: {
    priceId: 'price_1RDUbhG8zs3IhGJ0eToYujiM',
    name: 'Quelldateien erhalten',
    description: 'Quelldateien erhalten',
    mode: 'payment',
    price: 120
  }
};

// Map upsell option IDs to their corresponding Stripe product IDs
export const upsellOptionMap: Record<string, string> = {
  'additional-format': 'additionalFormat',
  'express-delivery': 'expressDelivery',
  '4k-resolution': 'videoQuality',
  'custom-effects': 'customEffects',
  'color-correction': 'colorCorrection',
  'source-files': 'sourceFiles'
};

// Get price ID for a specific package
export const getPackagePriceId = (packageType: string): string => {
  return videoPackages[packageType]?.priceId || videoPackages.flash.priceId;
};

// Get price ID for a specific upsell option
export const getUpsellPriceId = (optionId: string): string => {
  const mappedId = upsellOptionMap[optionId];
  return upsellOptions[mappedId]?.priceId || '';
};

// Get package amount
export const getPackageAmount = (packageType: string): number => {
  return videoPackages[packageType]?.price || 0;
};

// Get upsell option amount
export const getUpsellAmount = (optionId: string): number => {
  const mappedId = upsellOptionMap[optionId];
  return upsellOptions[mappedId]?.price || 0;
};