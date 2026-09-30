const initialProducts = [
  {
    title: "Titan 5G Ultra Smartphone (256GB - Titanium Gray)",
    description: "Flagship 5G smartphone featuring a 6.8-inch Dynamic AMOLED 120Hz display, Snapdragon 8 Gen 3 processor, 200MP quad-camera array with 100x Space Zoom, and all-day 5000mAh battery with 45W fast charging.",
    price: 999.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    isActive: true,
    rating: 4.9,
    reviewsCount: 184
  },
  {
    title: "ProBook 16-inch M3 Pro Laptop (32GB RAM / 1TB SSD)",
    description: "Ultimate workstation laptop engineered for creators and engineers. Features 16.2-inch Liquid Retina XDR display, 12-core CPU, 18-core GPU, up to 22 hours of battery life, and MagSafe 3 high-speed charging.",
    price: 1899.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    isActive: true,
    rating: 5.0,
    reviewsCount: 92
  },
  {
    title: "Aura Sound Pro Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear wireless headphones with custom 40mm drivers, hybrid Active Noise Cancellation, transparency mode, 40-hour battery life, and ultra-plush memory foam earcups.",
    price: 249.99,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    isActive: true,
    rating: 4.8,
    reviewsCount: 215
  },
  {
    title: "Nova Horizon 34-Inch 4K Curved Gaming Monitor",
    description: "Ultra-wide 34-inch 1500R curved gaming monitor with 165Hz refresh rate, 1ms response time, AMD FreeSync Premium Pro, HDR400, and 99% sRGB color spectrum for immersive gameplay.",
    price: 499.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isActive: true,
    rating: 4.9,
    reviewsCount: 78
  },
  {
    title: "Apex Cyber RGB Mechanical Gaming Keyboard",
    description: "Custom hot-swappable mechanical keyboard with lubricated tactile switches, per-key RGB backlighting, sound-dampening silicone architecture, and durable PBT doubleshot keycaps.",
    price: 129.50,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    isActive: true,
    rating: 4.8,
    reviewsCount: 160
  },
  {
    title: "SwiftGlide Ergonomic Wireless Gaming Mouse",
    description: "Ultra-lightweight 58g wireless gaming mouse equipped with a 26K DPI optical sensor, optical switches rated for 90 million clicks, and 80 hours of continuous wireless gaming.",
    price: 79.99,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    isActive: true,
    rating: 4.7,
    reviewsCount: 134
  },
  {
    title: "PulsePods Pro True Wireless ANC Earbuds",
    description: "Active noise-cancelling wireless earbuds featuring custom low-distortion drivers, spatial 3D audio, IPX4 sweat resistance, wireless charging case, and 30-hour total playback.",
    price: 159.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    isActive: true,
    rating: 4.8,
    reviewsCount: 310
  },
  {
    title: "UltraTab Pro 12.9-inch 120Hz Liquid Retina Tablet",
    description: "High-performance slate tablet powered by an 8-core silicon chip, dual cameras with LiDAR scanner, Apple Pencil / stylus support, Thunderbolt port, and quad-speaker stereo array.",
    price: 849.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    isActive: true,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    title: "Verve Chrono AMOLED Smartwatch & Fitness Tracker",
    description: "Sleek aerospace-grade aluminum smartwatch with always-on AMOLED touchscreen, heart-rate & SpO2 monitoring, GPS tracking, sleep coaching, and 7-day battery life.",
    price: 199.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    isActive: true,
    rating: 4.7,
    reviewsCount: 145
  },
  {
    title: "AeroView 4K Ultra Gimbal Quadcopter Drone",
    description: "Compact foldable drone featuring 3-axis motorized gimbal, 4K/60fps HDR video recording, obstacle avoidance sensors, 10km HD video transmission, and 34-minute flight time per battery.",
    price: 599.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    isActive: true,
    rating: 4.9,
    reviewsCount: 62
  },
  {
    title: "SonicBoom Rugged 360° Waterproof Speaker",
    description: "Heavy-duty outdoor Bluetooth 5.3 speaker with 40W 360-degree sound, punchy deep bass, IP67 waterproof and dustproof rating, built-in powerbank, and 24 hours of playtime.",
    price: 99.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 32,
    isActive: true,
    rating: 4.6,
    reviewsCount: 94
  },
  {
    title: "Lumina Smart RGB Adaptive Desk Lamp",
    description: "Modern architectural desk lamp with dual light source, customizable RGB ambient backlighting, auto-dimming ambient brightness sensor, and wireless smartphone fast-charging base.",
    price: 79.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    stock: 24,
    isActive: true,
    rating: 4.8,
    reviewsCount: 71
  },
  {
    title: "HyperVolt 120W GaN 4-Port Fast Charging Hub",
    description: "Next-gen Gallium Nitride (GaN) desktop fast charger with 3 USB-C Power Delivery ports and 1 USB-A port. Capable of charging two laptops and two phones concurrently at maximum speeds.",
    price: 69.99,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 60,
    isActive: true,
    rating: 4.9,
    reviewsCount: 182
  },
  {
    title: "StreamCam 4K HDR Pro Webcam with Ring Light",
    description: "Studio-grade 4K 60fps streaming webcam featuring integrated adjustable ring light, dual omnidirectional stereo microphones, AI face tracking, and privacy shutter.",
    price: 139.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    isActive: true,
    rating: 4.7,
    reviewsCount: 89
  },
  {
    title: "FitTrack Ultra AMOLED Health & Fitness Band",
    description: "Lightweight continuous biometric health monitor with continuous PPG heart rate, sleep stage tracking, blood oxygen, 120+ sport modes, and magnetic quick-snap charging.",
    price: 59.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    isActive: true,
    rating: 4.6,
    reviewsCount: 118
  },
  {
    title: "StrikeForce 7.1 Spatial Audio Gaming Headset",
    description: "Pro gaming headset with 50mm neodymium audio drivers, virtual 7.1 surround sound, broadcast-quality detachable noise-cancelling microphone, and cooling gel-infused ear pads.",
    price: 119.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80",
    stock: 27,
    isActive: true,
    rating: 4.8,
    reviewsCount: 104
  }
];

module.exports = { initialProducts };
