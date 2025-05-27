// Sample product data for the e-commerce store

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: {[key: string]: string};
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    image: '/images/categories/smartphones.jpg',
    description: 'Latest smartphones with cutting-edge technology'
  },
  {
    id: 'audio',
    name: 'Audio Devices',
    image: '/images/categories/audio.jpg',
    description: 'Premium audio devices for immersive sound experience'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    image: '/images/categories/wearables.jpg',
    description: 'Smart wearables to track your fitness and stay connected'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: '/images/categories/accessories.jpg',
    description: 'Essential accessories for your electronic devices'
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    image: '/images/categories/powerbanks.jpg',
    description: 'Portable power solutions for your devices on the go'
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'ElectroX Pro Smartphone',
    category: 'smartphones',
    price: 999.99,
    discountPrice: 899.99,
    rating: 4.8,
    image: '/images/products/smartphone1.jpg',
    images: [
      '/images/products/smartphone1.jpg',
      '/images/products/smartphone1-2.jpg',
      '/images/products/smartphone1-3.jpg'
    ],
    description: "The ElectroX Pro is our flagship smartphone featuring a stunning 6.7-inch AMOLED display, powerful octa-core processor, and a revolutionary camera system that captures every detail in perfect clarity. With all-day battery life and fast charging, you'll never be left without power.",
    features: [
      '6.7-inch AMOLED display with 120Hz refresh rate',
      'Octa-core processor with 8GB RAM',
      'Triple camera system with 108MP main sensor',
      '5000mAh battery with 65W fast charging',
      'IP68 water and dust resistance',
      'Under-display fingerprint sensor'
    ],
    specifications: {
      'Display': '6.7-inch AMOLED, 120Hz',
      'Processor': 'Octa-core 2.8GHz',
      'RAM': '8GB LPDDR5',
      'Storage': '256GB UFS 3.1',
      'Main Camera': '108MP + 12MP + 8MP',
      'Front Camera': '32MP',
      'Battery': '5000mAh',
      'OS': 'Android 13',
      'Dimensions': '162.3 x 74.6 x 8.2 mm',
      'Weight': '189g'
    },
    inStock: true,
    isNew: true,
    isFeatured: true,
    colors: ['Midnight Black', 'Stellar Blue', 'Arctic Silver']
  },
  {
    id: 'p2',
    name: 'SoundPods Pro',
    category: 'audio',
    price: 249.99,
    discountPrice: 199.99,
    rating: 4.7,
    image: '/images/products/airpods1.jpg',
    images: [
      '/images/products/airpods1.jpg',
      '/images/products/airpods1-2.jpg',
      '/images/products/airpods1-3.jpg'
    ],
    description: "Experience immersive sound with SoundPods Pro wireless earbuds. Featuring active noise cancellation, spatial audio, and a comfortable design for all-day wear. The adaptive EQ automatically tunes music to your ears for an exceptional listening experience.",
    features: [
      'Active Noise Cancellation',
      'Spatial Audio with dynamic head tracking',
      'Adaptive EQ',
      'Touch controls',
      'Up to 6 hours of listening time (24 hours with charging case)',
      'Sweat and water resistant'
    ],
    specifications: {
      'Chip': 'Custom high-performance audio',
      'Noise Control': 'Active Noise Cancellation and Transparency mode',
      'Sensors': 'Optical, motion, speech detecting accelerometer',
      'Battery Life': '6 hours (single charge), 24 hours (with case)',
      'Charging': 'Wireless charging case, USB-C',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '5.4g (each), 45.6g (case)'
    },
    inStock: true,
    isFeatured: true,
    colors: ['White', 'Black', 'Teal']
  },
  {
    id: 'p3',
    name: 'SmartWatch Ultra',
    category: 'wearables',
    price: 399.99,
    discountPrice: 349.99,
    rating: 4.6,
    image: '/images/products/watch1.jpg',
    images: [
      '/images/products/watch1.jpg',
      '/images/products/watch1-2.jpg',
      '/images/products/watch1-3.jpg'
    ],
    description: "The SmartWatch Ultra is designed for those who demand more. With advanced health monitoring, fitness tracking, and smart notifications, it's the perfect companion for your active lifestyle. The always-on retina display ensures you can check your stats at a glance.",
    features: [
      'Always-on Retina LTPO OLED display',
      'Advanced health monitoring (ECG, Blood Oxygen)',
      'Fitness tracking with 40+ workout types',
      'Water resistant to 50 meters',
      'Up to 36 hours of battery life',
      'Built-in GPS and compass'
    ],
    specifications: {
      'Display': '1.9-inch LTPO OLED, 1000 nits',
      'Processor': 'Dual-core S8',
      'Storage': '32GB',
      'Sensors': 'Heart rate, ECG, Blood Oxygen, Accelerometer, Gyroscope, Altimeter',
      'Connectivity': 'Bluetooth 5.3, Wi-Fi, NFC, LTE (optional)',
      'Battery': 'Up to 36 hours (normal use), 60 hours (low power mode)',
      'Water Resistance': '50 meters (ISO standard 22810:2010)',
      'Dimensions': '45 x 38 x 10.7 mm',
      'Weight': '38.8g (aluminum), 51.5g (stainless steel)'
    },
    inStock: true,
    isNew: true,
    colors: ['Midnight', 'Starlight', 'Product Red', 'Silver']
  },
  {
    id: 'p4',
    name: 'SoundBeats Neckband',
    category: 'audio',
    price: 129.99,
    discountPrice: 99.99,
    rating: 4.4,
    image: '/images/products/neckband1.jpg',
    images: [
      '/images/products/neckband1.jpg',
      '/images/products/neckband1-2.jpg',
      '/images/products/neckband1-3.jpg'
    ],
    description: "SoundBeats Neckband delivers premium sound quality with the convenience of a lightweight, comfortable design. Perfect for workouts or all-day wear, these earphones feature magnetic earbuds that connect when not in use and automatically pause your music.",
    features: [
      'Premium sound with deep bass',
      'Magnetic earbuds',
      'Lightweight, flexible neckband design',
      'Up to 12 hours of battery life',
      'Fast charging - 10 minutes for 2 hours playback',
      'Sweat and water resistant'
    ],
    specifications: {
      'Driver': '10mm dynamic drivers',
      'Frequency Response': '20Hz - 20kHz',
      'Battery': '160mAh, up to 12 hours playback',
      'Charging': 'USB-C, 10 min charge = 2 hours playback',
      'Connectivity': 'Bluetooth 5.0',
      'Range': 'Up to 10 meters',
      'Weight': '28g'
    },
    inStock: true,
    colors: ['Black', 'Blue', 'Red']
  },
  {
    id: 'p5',
    name: 'PowerMax 20000mAh',
    category: 'powerbanks',
    price: 79.99,
    discountPrice: 59.99,
    rating: 4.5,
    image: '/images/products/powerbank1.jpg',
    images: [
      '/images/products/powerbank1.jpg',
      '/images/products/powerbank1-2.jpg',
      '/images/products/powerbank1-3.jpg'
    ],
    description: "The PowerMax 20000mAh power bank ensures your devices never run out of power. With fast charging technology and multiple ports, you can charge multiple devices simultaneously. The compact design makes it perfect for travel.",
    features: [
      '20000mAh high-capacity battery',
      '65W fast charging',
      'USB-C Power Delivery and Quick Charge 4.0',
      'Charge 3 devices simultaneously',
      'LED power indicator',
      'Compact and portable design'
    ],
    specifications: {
      'Capacity': '20000mAh / 74Wh',
      'Input': 'USB-C: 5V/3A, 9V/2A, 12V/1.5A, 20V/1.5A',
      'Output': 'USB-C: 5V/3A, 9V/3A, 12V/3A, 15V/3A, 20V/3.25A (65W max); USB-A: 5V/3A, 9V/2A, 12V/1.5A (18W max)',
      'Dimensions': '158 x 75 x 19 mm',
      'Weight': '340g',
      'Features': 'Low-current charging mode for accessories'
    },
    inStock: true,
    isFeatured: true,
    colors: ['Black', 'White']
  },
  {
    id: 'p6',
    name: 'ElectroX Lite Smartphone',
    category: 'smartphones',
    price: 599.99,
    discountPrice: 549.99,
    rating: 4.3,
    image: '/images/products/smartphone2.jpg',
    images: [
      '/images/products/smartphone2.jpg',
      '/images/products/smartphone2-2.jpg',
      '/images/products/smartphone2-3.jpg'
    ],
    description: "The ElectroX Lite offers premium features at a mid-range price. With a vibrant 6.4-inch display, capable camera system, and all-day battery life, it's the perfect balance of performance and value.",
    features: [
      '6.4-inch AMOLED display with 90Hz refresh rate',
      'Octa-core processor with 6GB RAM',
      'Dual camera system with 64MP main sensor',
      '4500mAh battery with 33W fast charging',
      'Side-mounted fingerprint sensor',
      'Expandable storage up to 1TB'
    ],
    specifications: {
      'Display': '6.4-inch AMOLED, 90Hz',
      'Processor': 'Octa-core 2.4GHz',
      'RAM': '6GB LPDDR4X',
      'Storage': '128GB UFS 2.2, expandable',
      'Main Camera': '64MP + 8MP ultrawide',
      'Front Camera': '16MP',
      'Battery': '4500mAh',
      'OS': 'Android 13',
      'Dimensions': '159.7 x 73.2 x 7.9 mm',
      'Weight': '179g'
    },
    inStock: true,
    colors: ['Ocean Blue', 'Forest Green', 'Sunset Orange']
  },
  {
    id: 'p7',
    name: 'SoundPods Lite',
    category: 'audio',
    price: 149.99,
    discountPrice: 129.99,
    rating: 4.2,
    image: '/images/products/airpods2.jpg',
    images: [
      '/images/products/airpods2.jpg',
      '/images/products/airpods2-2.jpg',
      '/images/products/airpods2-3.jpg'
    ],
    description: "SoundPods Lite deliver great sound quality in a compact, affordable package. With easy pairing, touch controls, and a comfortable fit, they're perfect for everyday use.",
    features: [
      'High-quality sound with balanced audio profile',
      'Touch controls for music and calls',
      'Up to 5 hours of listening time (20 hours with charging case)',
      'Fast pairing with all devices',
      'Sweat and water resistant',
      'Ergonomic design for comfortable fit'
    ],
    specifications: {
      'Drivers': 'Custom-designed dynamic drivers',
      'Battery Life': '5 hours (single charge), 20 hours (with case)',
      'Charging': 'USB-C charging case',
      'Connectivity': 'Bluetooth 5.0',
      'Controls': 'Touch controls on each earbud',
      'Weight': '4.7g (each), 42g (case)'
    },
    inStock: true,
    colors: ['White', 'Black']
  },
  {
    id: 'p8',
    name: 'FitTrack Smart Band',
    category: 'wearables',
    price: 99.99,
    discountPrice: 79.99,
    rating: 4.1,
    image: '/images/products/band1.jpg',
    images: [
      '/images/products/band1.jpg',
      '/images/products/band1-2.jpg',
      '/images/products/band1-3.jpg'
    ],
    description: "The FitTrack Smart Band is your perfect fitness companion. Track your steps, heart rate, sleep, and more with this lightweight, comfortable band. The vibrant color display makes it easy to check your stats at a glance.",
    features: [
      '1.1-inch AMOLED color display',
      '24/7 heart rate monitoring',
      'Sleep tracking with sleep stages',
      'Water resistant to 50 meters',
      'Up to 14 days of battery life',
      '30+ workout modes'
    ],
    specifications: {
      'Display': '1.1-inch AMOLED, 126 x 294 pixels',
      'Sensors': 'Heart rate, Accelerometer, Gyroscope',
      'Battery': 'Up to 14 days (normal use)',
      'Water Resistance': '5 ATM (50 meters)',
      'Connectivity': 'Bluetooth 5.0',
      'Compatibility': 'Android 5.0+, iOS 10.0+',
      'Dimensions': '46.5 x 18.7 x 12.7 mm',
      'Weight': '23g (with strap)'
    },
    inStock: true,
    colors: ['Black', 'Blue', 'Pink', 'Green']
  }
];

export const featuredProducts = products.filter(product => product.isFeatured);
export const newProducts = products.filter(product => product.isNew);

export const getProductsByCategory = (categoryId: string) => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (productId: string) => {
  return products.find(product => product.id === productId);
};

export const getRelatedProducts = (productId: string, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};
