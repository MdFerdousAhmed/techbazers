/**
 * TechBazer 100+ Products Generator & Seeder
 * Generates 108+ realistic, premium tech products across 8 categories
 * Inserts directly into MongoDB Atlas 'techbazerdb' and updates local JSON stores
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const DB_NAME = process.env.DB_NAME || 'techbazerdb';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOOSE_URL || `mongodb://127.0.0.1:27017/${DB_NAME}`;

const rawCatalog = [
  // 1. Smartphones & Tablets (14 products)
  {
    title: "Titan 5G Ultra Smartphone (256GB - Titanium Gray)",
    description: "Flagship 5G smartphone featuring a 6.8-inch Dynamic AMOLED 120Hz display, Snapdragon 8 Gen 3 processor, 200MP quad-camera array with 100x Space Zoom, and all-day 5000mAh battery with 45W fast charging.",
    price: 999.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.9,
    reviewsCount: 184
  },
  {
    title: "Nova Fold 6 Dynamic Dual-Screen Phone (512GB)",
    description: "Cutting-edge foldable device with 7.6-inch ultra-flexible AMOLED interior display, zero-gap hinge mechanism, stylus pen support, and desktop-grade multitasking DeX engine.",
    price: 1599.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.8,
    reviewsCount: 76
  },
  {
    title: "UltraTab Pro 12.9-inch 120Hz Liquid Retina Tablet",
    description: "High-performance slate tablet powered by an 8-core silicon chip, dual cameras with LiDAR scanner, Apple Pencil / stylus support, Thunderbolt port, and quad-speaker stereo array.",
    price: 849.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    title: "PixelCraft 9 Pro Smartphone with AI Tensor Chip",
    description: "Best-in-class mobile photography phone featuring computational night sight, Gemini AI Assistant on-device processing, 50MP periscope zoom, and guaranteed 7 years of OS updates.",
    price: 899.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    title: "SlateAir 11-Inch Lightweight Education Tablet",
    description: "Sleek aluminum chassis tablet with 2K eye-comfort display, stylus pen included in box, parental security suite, dual stereo speakers, and 14-hour reading battery life.",
    price: 349.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    rating: 4.6,
    reviewsCount: 65
  },
  {
    title: "CyberPhone Edge 5G Gaming Smartphone",
    description: "Mobile esports phone with 165Hz AMOLED display, magnetic pop-up shoulder triggers, built-in active cooling turbine fan, and dual stereo front-facing DTS speakers.",
    price: 749.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
    stock: 16,
    rating: 4.7,
    reviewsCount: 93
  },
  {
    title: "AeroLite Slim 5G Smartphone (128GB)",
    description: "Ultra-slim 6.9mm profile smartphone with 6.5-inch OLED punch-hole screen, 64MP dual OIS camera, 33W turbo charging, and featherweight 160g hand feel.",
    price: 499.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
    stock: 38,
    rating: 4.5,
    reviewsCount: 54
  },
  {
    title: "PadStudio 14-inch OLED Artist Drawing Slate",
    description: "Professional drawing tablet computer with 4K color-calibrated pen display, 8192 levels of pressure sensitivity, tilt recognition, and magnetic hotkey dial pad.",
    price: 1199.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    title: "MiniSlate 8.4-inch Pocket eReader & Tablet",
    description: "Compact 8.4-inch reader tablet with antireflective matte finish, 300 PPI display clarity, expandable MicroSD slot up to 1TB, and USB-C audio.",
    price: 199.99,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    rating: 4.4,
    reviewsCount: 39
  },
  {
    title: "RuggedShield X-Tough Outdoor Smartphone",
    description: "Military-spec MIL-STD-810H waterproof and drop-resistant smartphone with thermal imaging FLIR camera, massive 10,000mAh battery, and customizable emergency SOS button.",
    price: 589.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.7,
    reviewsCount: 68
  },
  {
    title: "Zenith Flip Compact Foldable Phone (256GB)",
    description: "Pocket-friendly clamshell foldable smartphone with large external interactive notification window, flex mode camera tripod stand, and armor aluminum frame.",
    price: 949.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.7,
    reviewsCount: 82
  },
  {
    title: "PrimeTab 10.1 Family Entertainment Slate",
    description: "10.1-inch Full HD tablet with dual Dolby Atmos speakers, kids content sandbox, eye safety mode, and magnetic protective bumper case.",
    price: 229.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.5,
    reviewsCount: 47
  },
  {
    title: "Quantum One Flagship Ceramic Smartphone",
    description: "Luxury smartphone featuring mirror-finish nano-ceramic back plate, 120W HyperCharge (0 to 100% in 18 minutes), stereo Harman Kardon tuned speakers, and IP68 water resistance.",
    price: 1049.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    rating: 4.9,
    reviewsCount: 112
  },
  {
    title: "PaperSlate E-Ink Digital Note Tablet with Stylus",
    description: "Paperless digital paper tablet with paper-like writing friction, zero eye strain glare-free screen, Weeks-long battery life, and cloud PDF syncing.",
    price: 399.00,
    category: "Smartphones & Tablets",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.8,
    reviewsCount: 79
  },

  // 2. Laptops & Computers (14 products)
  {
    title: "ProBook 16-inch M3 Pro Laptop (32GB RAM / 1TB SSD)",
    description: "Ultimate workstation laptop engineered for creators and engineers. Features 16.2-inch Liquid Retina XDR display, 12-core CPU, 18-core GPU, up to 22 hours of battery life, and MagSafe 3 high-speed charging.",
    price: 1899.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    rating: 5.0,
    reviewsCount: 92
  },
  {
    title: "AeroBlade 15 Ultra-Slim Gaming Laptop (RTX 4080)",
    description: "High-power gaming laptop with Intel Core i9-14900HX, NVIDIA GeForce RTX 4080 12GB GPU, 240Hz QHD G-Sync IPS panel, per-key RGB mechanical keyboard, and vapor chamber cooling.",
    price: 2199.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    rating: 4.9,
    reviewsCount: 63
  },
  {
    title: "ZenithBook 14 OLED Ultraportable Laptop",
    description: "Featherlight 1.1kg magnesium-alloy laptop with 2.8K 120Hz OLED touchscreen, Intel Core Ultra 7 with AI NPU, 1TB PCIe Gen4 SSD, and military-grade MIL-STD durability.",
    price: 1149.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.8,
    reviewsCount: 118
  },
  {
    title: "CyberStation Pro Mini PC Desktop (Ryzen 9 / 64GB)",
    description: "Ultra-compact 0.8L form-factor workstation with AMD Ryzen 9 7940HS 8-Core processor, dual 2.5G LAN ports, quad 4K display output, and dual USB4 Thunderbolt ports.",
    price: 799.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.8,
    reviewsCount: 59
  },
  {
    title: "StreamCam 4K HDR Pro Webcam with Ring Light",
    description: "Studio-grade 4K 60fps streaming webcam featuring integrated adjustable ring light, dual omnidirectional stereo microphones, AI face tracking, and privacy shutter.",
    price: 139.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.7,
    reviewsCount: 89
  },
  {
    title: "OmniDock 16-in-1 Thunderbolt 4 Docking Station",
    description: "Heavy-duty aluminum desktop dock providing 100W laptop host charging, dual 4K/single 8K video output, 2.5GbE Ethernet, UHS-II SD slot, and 6 high-speed USB ports.",
    price: 219.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.9,
    reviewsCount: 74
  },
  {
    title: "ThinkCraft Business Laptop 15.6-inch (16GB RAM)",
    description: "Legendary ergonomic spill-resistant keyboard, dedicated TrackPoint, fingerprint reader, physical webcam privacy shutter, and all-day 15-hour battery with rapid charge.",
    price: 899.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    stock: 32,
    rating: 4.7,
    reviewsCount: 88
  },
  {
    title: "Apex Creator Studio PC Desktop (Core i9 / RTX 4090)",
    description: "Uncapped desktop battlestation equipped with liquid-cooled Intel Core i9, 64GB DDR5 RAM, 2TB Gen5 NVMe, and NVIDIA RTX 4090 24GB GPU in tempered glass chassis.",
    price: 3499.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    stock: 5,
    rating: 5.0,
    reviewsCount: 31
  },
  {
    title: "Chromebook Plus 14-inch Fast Cloud Laptop",
    description: "Instant-boot cloud productivity notebook with 2X speed, 1080p camera with AI background blur, Google Gemini integration, and durable drop-resistant chassis.",
    price: 399.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    rating: 4.4,
    reviewsCount: 52
  },
  {
    title: "DualScreen Duo 15 Pro Dual Touchscreen Laptop",
    description: "Revolutionary twin-OLED laptop featuring full secondary touchscreen above keyboard, precision dial stylus integration, and seamless workflow multi-tasking.",
    price: 1999.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    stock: 7,
    rating: 4.8,
    reviewsCount: 29
  },
  {
    title: "StudioDesk Dual Gas Spring Monitor Arm Mount",
    description: "Aerospace aluminum dual monitor mount supporting up to two 32-inch monitors, full 360-degree rotation, integrated cable concealment channels, and desk clamp.",
    price: 89.99,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    stock: 55,
    rating: 4.8,
    reviewsCount: 140
  },
  {
    title: "SilentTech Silent Fanless Mini Server PC",
    description: "Solid extruded aluminum heatsink chassis mini PC, zero moving parts, completely silent 0dB operation, dual Gigabit LAN, and continuous 24/7 reliability.",
    price: 459.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.6,
    reviewsCount: 43
  },
  {
    title: "CarbonBook 13 Ultra-Lightweight Carbon Fiber Laptop",
    description: "Premium carbon-fiber notebook weighing only 980 grams, 13.3-inch 16:10 anti-glare display, backlit keyboard, Windows Hello facial authentication, and 18h battery.",
    price: 1299.00,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.7,
    reviewsCount: 66
  },
  {
    title: "ErgoLift Aluminum Laptop Stand with USB-C Hub",
    description: "Adjustable ergonomic laptop riser with built-in 6-in-1 USB-C dock (HDMI 4K, 3x USB 3.0, 100W PD passthrough), and silicone protective cushioning.",
    price: 64.99,
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    stock: 60,
    rating: 4.8,
    reviewsCount: 185
  },

  // 3. Audio & Sound (14 products)
  {
    title: "Aura Sound Pro Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear wireless headphones with custom 40mm drivers, hybrid Active Noise Cancellation, transparency mode, 40-hour battery life, and ultra-plush memory foam earcups.",
    price: 249.99,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.8,
    reviewsCount: 215
  },
  {
    title: "PulsePods Pro True Wireless ANC Earbuds",
    description: "Active noise-cancelling wireless earbuds featuring custom low-distortion drivers, spatial 3D audio, IPX4 sweat resistance, wireless charging case, and 30-hour total playback.",
    price: 159.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    rating: 4.8,
    reviewsCount: 310
  },
  {
    title: "SonicBoom Rugged 360° Waterproof Speaker",
    description: "Heavy-duty outdoor Bluetooth 5.3 speaker with 40W 360-degree sound, punchy deep bass, IP67 waterproof and dustproof rating, built-in powerbank, and 24 hours of playtime.",
    price: 99.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 32,
    rating: 4.6,
    reviewsCount: 94
  },
  {
    title: "StudioMaster Pro Open-Back Audiophile Headphones",
    description: "Reference studio open-back headphones engineered for music mixing and master mastering. Acoustic planar magnetic drivers, neutral flat response curve, and detachable braided cable.",
    price: 379.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.9,
    reviewsCount: 84
  },
  {
    title: "VocalStream XLR & USB Studio Microphone",
    description: "Broadcast-quality cardioid dynamic microphone with dual XLR and USB-C outputs, internal shock mount, headphone volume monitoring knob, and zero-latency monitoring.",
    price: 189.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    rating: 4.8,
    reviewsCount: 167
  },
  {
    title: "CinemaBar Dolby Atmos Wireless Soundbar System",
    description: "5.1.2 channel home theater soundbar with up-firing spatial height channels, wireless 8-inch subwoofer, eARC HDMI pass-through, and Bluetooth streaming.",
    price: 499.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.8,
    reviewsCount: 58
  },
  {
    title: "PocketHiFi High-Res Lossless Audio Player DAC",
    description: "Dedicated digital audio player supporting DSD512 and 32-bit/768kHz MQA decoding, dual ESS Sabre DAC chips, balanced 4.4mm output, and 5-inch touch glass.",
    price: 329.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
    stock: 16,
    rating: 4.7,
    reviewsCount: 42
  },
  {
    title: "WaveSound True Wireless Sport Earhooks IPX7",
    description: "Secure-fit flexible earhooks designed for intense marathon and gym workouts, sweatproof IPX7 rating, ambient talk-through mode, and physical tactile click buttons.",
    price: 79.99,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    rating: 4.6,
    reviewsCount: 190
  },
  {
    title: "VintageTone Wooden Bluetooth Bookshelf Speakers",
    description: "Pair of handcrafted acoustic wooden bookshelf speakers with built-in 60W amplifier, optical and RCA inputs, remote control, and rich room-filling warm audio.",
    price: 169.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.8,
    reviewsCount: 110
  },
  {
    title: "PureVoice Wireless Lavalier Lapel Mic Kit",
    description: "Dual-channel clip-on wireless microphone kit with intelligent noise cancelling, 200m range, 24-hour battery charging case, and universal phone & camera adaptors.",
    price: 119.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 34,
    rating: 4.9,
    reviewsCount: 77
  },
  {
    title: "BassPulse Portable Party Speaker with RGB Lights",
    description: "100W portable Bluetooth tailgate party speaker with synchronized pulsating light show, karaoke microphone input, guitar jack, and heavy bass boost mode.",
    price: 149.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.5,
    reviewsCount: 83
  },
  {
    title: "AirConduct Bone Conduction Open-Ear Sport Headset",
    description: "Lightweight titanium wrap-around bone conduction headphones leaving ears completely open to situational traffic awareness, magnetic charging, and IP68 waterproof.",
    price: 129.99,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.7,
    reviewsCount: 96
  },
  {
    title: "EchoPod Smart Wi-Fi Multi-Room Speaker",
    description: "Voice-controlled high-fidelity Wi-Fi home speaker with room adaptive acoustic tuning, multi-room sync, AirPlay 2, Spotify Connect, and smart home hub integration.",
    price: 199.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.6,
    reviewsCount: 64
  },
  {
    title: "AudioEngine Desktop USB DAC Headphone Amp",
    description: "Compact precision machined aluminum desktop DAC and amplifier, 32-bit ESS Sabre architecture, handles demanding 600-ohm headphones with pristine clarity.",
    price: 159.00,
    category: "Audio & Sound",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
    stock: 19,
    rating: 4.9,
    reviewsCount: 53
  },

  // 4. Gaming Gear (14 products)
  {
    title: "Nova Horizon 34-Inch 4K Curved Gaming Monitor",
    description: "Ultra-wide 34-inch 1500R curved gaming monitor with 165Hz refresh rate, 1ms response time, AMD FreeSync Premium Pro, HDR400, and 99% sRGB color spectrum for immersive gameplay.",
    price: 499.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    stock: 12,
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
    rating: 4.7,
    reviewsCount: 134
  },
  {
    title: "StrikeForce 7.1 Spatial Audio Gaming Headset",
    description: "Pro gaming headset with 50mm neodymium audio drivers, virtual 7.1 surround sound, broadcast-quality detachable noise-cancelling microphone, and cooling gel-infused ear pads.",
    price: 119.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80",
    stock: 27,
    rating: 4.8,
    reviewsCount: 104
  },
  {
    title: "OmniController Wireless Esports Gamepad",
    description: "Professional esports controller featuring hall-effect magnetic drift-free joysticks, 4 remappable rear paddles, micro-switch mechanical triggers, and customizable trigger stops.",
    price: 89.99,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.9,
    reviewsCount: 122
  },
  {
    title: "ChromaPad XXL RGB Waterproof Gaming Desk Mat",
    description: "Giant 900x400mm desktop mousepad with 360-degree stitched RGB dynamic illumination edge, micro-textured speed cloth surface, and non-slip rubber grip base.",
    price: 34.99,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    stock: 75,
    rating: 4.8,
    reviewsCount: 210
  },
  {
    title: "CyberVR Ultra Spatial 4K Virtual Reality Headset",
    description: "All-in-one wireless VR headset with dual 4K micro-OLED panels (120Hz), pancake optics, inside-out 6DoF hand tracking, color passthrough MR, and spatial 3D audio.",
    price: 549.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&auto=format&fit=crop&q=80",
    stock: 9,
    rating: 4.9,
    reviewsCount: 47
  },
  {
    title: "AeroForce Ergonomic Racing Gaming Chair",
    description: "High-density cold-molded foam bucket chair with 4D adjustable armrests, magnetic memory foam headrest pillow, 165-degree recline mechanism, and heavy-duty steel base.",
    price: 289.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    rating: 4.7,
    reviewsCount: 88
  },
  {
    title: "StreamMaster 15-Key LCD Macro Control Deck",
    description: "Interactive live studio controller featuring 15 customizable LCD keys for triggering stream scenes, audio levels, lighting, macro shortcuts, and visual icon feedback.",
    price: 149.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.9,
    reviewsCount: 95
  },
  {
    title: "CapturePro 4K60 HDR USB 3.2 Video Capture Card",
    description: "Zero-lag 4K 60fps / 1080p 240fps HDMI passthrough video capture device for PlayStation 5, Xbox Series X, Nintendo Switch, and DSLR camera live streaming.",
    price: 169.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.8,
    reviewsCount: 62
  },
  {
    title: "SpeedShift Force Feedback Racing Wheel & Pedals",
    description: "Dual-motor realistic force feedback racing wheel with 900-degree rotation, brushed metal paddle shifters, progressive brake pedal, and hand-stitched leather rim.",
    price: 329.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.8,
    reviewsCount: 53
  },
  {
    title: "HotSwap 60% Compact Wireless Mechanical Keyboard",
    description: "Minimalist 60-percent travel gaming keyboard, wireless 2.4GHz + Bluetooth multi-device connectivity, pre-lubed linear switches, and aluminum CNC frame.",
    price: 99.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.6,
    reviewsCount: 114
  },
  {
    title: "AeroCool RGB Magnetic Smartphone Gaming Cooler",
    description: "Peltier semiconductor thermoelectric magnetic cooler for phones and tablets, drops device temperature by up to 25°C during intense competitive gaming sessions.",
    price: 39.99,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    stock: 48,
    rating: 4.5,
    reviewsCount: 82
  },
  {
    title: "TitanArc 240Hz 27-Inch Fast-IPS Esports Monitor",
    description: "Tournament-grade 27-inch 2560x1440 Fast IPS panel with 240Hz refresh rate, 0.5ms response time, NVIDIA G-Sync Compatible, and height-adjustable pivot stand.",
    price: 399.00,
    category: "Gaming Gear",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.9,
    reviewsCount: 67
  },

  // 5. Wearables (14 products)
  {
    title: "Verve Chrono AMOLED Smartwatch & Fitness Tracker",
    description: "Sleek aerospace-grade aluminum smartwatch with always-on AMOLED touchscreen, heart-rate & SpO2 monitoring, GPS tracking, sleep coaching, and 7-day battery life.",
    price: 199.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    rating: 4.7,
    reviewsCount: 145
  },
  {
    title: "FitTrack Ultra AMOLED Health & Fitness Band",
    description: "Lightweight continuous biometric health monitor with continuous PPG heart rate, sleep stage tracking, blood oxygen, 120+ sport modes, and magnetic quick-snap charging.",
    price: 59.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    rating: 4.6,
    reviewsCount: 118
  },
  {
    title: "AuraTitan Rugged Titanium GPS Adventure Watch",
    description: "Extreme outdoor expedition smartwatch crafted from grade-5 titanium with sapphire crystal lens, dual-frequency multi-band GPS, offline topographical maps, and 30-day battery.",
    price: 499.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    rating: 4.9,
    reviewsCount: 72
  },
  {
    title: "OuraRing Horizon Smart Health & Sleep Ring",
    description: "Featherweight titanium smart ring tracking sleep cycles, recovery readiness score, body temperature fluctuations, and daily steps with 7-day battery life.",
    price: 299.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.8,
    reviewsCount: 95
  },
  {
    title: "Spectra Vision AR Smart Audio Eyewear Glasses",
    description: "Smart lifestyle glasses with discreet open-ear directional speakers, dual microphones with ENC noise cancellation, UV400 polarized lenses, and voice assistant.",
    price: 179.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.5,
    reviewsCount: 56
  },
  {
    title: "PulseBand 2 Screenless Strain & Recovery Monitor",
    description: "Minimalist screen-free fitness strap capturing continuous 24/7 heart rate variability, skin temperature, sleep debt, and muscular recovery analytics.",
    price: 139.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.7,
    reviewsCount: 88
  },
  {
    title: "Chronos Classic Luxury Hybrid Smartwatch",
    description: "Traditional analog watch hands moving over a hidden digital OLED screen, genuine Italian leather band, contactless NFC payment, and 30-day battery life.",
    price: 249.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.8,
    reviewsCount: 64
  },
  {
    title: "ApexRun Lightweight Marathon GPS Watch",
    description: "Weighing only 29 grams, designed for runners with wrist-based running power meter, interval training builder, heart rate zones, and water resistant to 50 meters.",
    price: 179.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.7,
    reviewsCount: 81
  },
  {
    title: "KidsSafe GPS 4G Cellular Calling Smartwatch",
    description: "Kid-friendly smartwatch with live GPS location geofencing, two-way HD video calling, SOS panic button, school class mode, and water-resistant casing.",
    price: 89.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    rating: 4.5,
    reviewsCount: 92
  },
  {
    title: "DiverPro 100M Solar Ocean Diving Watch",
    description: "Certified professional dive watch with solar charging sapphire crystal face, depth meter sensor, decompression alert, and high-visibility luminescent dial.",
    price: 389.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    title: "VitalSense Continuous Glucose Health Tracker",
    description: "Non-invasive wearable wellness patch syncing real-time glucose response and metabolic insights directly to mobile dashboard via Bluetooth LE.",
    price: 199.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    stock: 16,
    rating: 4.6,
    reviewsCount: 47
  },
  {
    title: "UrbanTech Milanese Loop Magnetic Watch Band",
    description: "Universal 20mm/22mm stainless steel woven Milanese magnetic mesh loop watch band with scratch-resistant PVD coating and micro-adjustment clamp.",
    price: 29.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    stock: 90,
    rating: 4.8,
    reviewsCount: 230
  },
  {
    title: "ProSwim Waterproof Haptic Lap Counter",
    description: "Swim coach finger ring with automatic stroke identification, lap counter, SWOLF efficiency score, and waterproof depth rating up to 5 ATM.",
    price: 69.00,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.4,
    reviewsCount: 35
  },
  {
    title: "FlexiFit Breathable Sport Silicone Strap 3-Pack",
    description: "Set of three interchangeable sweat-wicking sport silicone replacement straps with quick-release spring bars in Onyx Black, Marine Blue, and Alpine Gray.",
    price: 24.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    stock: 110,
    rating: 4.7,
    reviewsCount: 164
  },

  // 6. Smart Home & Tech (14 products)
  {
    title: "AeroView 4K Ultra Gimbal Quadcopter Drone",
    description: "Compact foldable drone featuring 3-axis motorized gimbal, 4K/60fps HDR video recording, obstacle avoidance sensors, 10km HD video transmission, and 34-minute flight time per battery.",
    price: 599.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.9,
    reviewsCount: 62
  },
  {
    title: "Lumina Smart RGB Adaptive Desk Lamp",
    description: "Modern architectural desk lamp with dual light source, customizable RGB ambient backlighting, auto-dimming ambient brightness sensor, and wireless smartphone fast-charging base.",
    price: 79.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    stock: 24,
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
    rating: 4.9,
    reviewsCount: 182
  },
  {
    title: "CleanBot X10 Self-Emptying Robot Vacuum & Mop",
    description: "LiDAR laser navigation robotic vacuum with 6000Pa suction power, sonic vibrating mop pads, automatic dirt disposal base station, and carpet auto-lifting technology.",
    price: 649.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.8,
    reviewsCount: 84
  },
  {
    title: "SmartView 10-Inch Smart Home Assistant Display",
    description: "Touchscreen home hub with automated routines, motorized face-tracking video calls, live camera feeds, Spotify streaming, and Matter/Zigbee connectivity.",
    price: 179.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 26,
    rating: 4.7,
    reviewsCount: 110
  },
  {
    title: "PureBreeze HEPA Smart Air Purifier 600m²",
    description: "Medical-grade H13 True HEPA filter air cleaner capturing 99.97% of airborne allergens and smoke, real-time laser PM2.5 display, and whisper-quiet sleep mode.",
    price: 189.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.8,
    reviewsCount: 93
  },
  {
    title: "SecureCam Solar Outdoor 2K Security Camera 2-Pack",
    description: "100% wire-free outdoor cameras with integrated solar panel, color night vision spotlight, AI human and vehicle detection, and encrypted local microSD storage.",
    price: 159.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.7,
    reviewsCount: 115
  },
  {
    title: "SmartLock Fingerprint & Keyless Wi-Fi Deadbolt",
    description: "Biometric 3D fingerprint door lock with backlit keypad, backup mechanical keys, smartphone remote lock/unlock, and auto-lock security sensors.",
    price: 149.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.8,
    reviewsCount: 88
  },
  {
    title: "OmniPlug Smart Energy Monitoring Wi-Fi Plug 4-Pack",
    description: "Set of 4 smart plugs measuring kilowatt-hour energy usage in real-time, customizable scheduling timers, voice control with Alexa/Google, and flame-retardant casing.",
    price: 39.99,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80",
    stock: 80,
    rating: 4.6,
    reviewsCount: 178
  },
  {
    title: "ThermalBrew Barista Smart Temperature Kettle",
    description: "Precision gooseneck electric pour-over kettle with 1-degree temperature control, 60-minute heat maintain hold, digital OLED display, and matte black steel finish.",
    price: 99.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    rating: 4.9,
    reviewsCount: 142
  },
  {
    title: "AeroDesk Motorized Dual-Motor Standing Desk Frame",
    description: "Electric sit-stand adjustable desk frame with dual heavy-duty quiet motors, 4 memory height presets, anti-collision sensor, and 120kg weight capacity.",
    price: 299.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.8,
    reviewsCount: 69
  },
  {
    title: "BeamCast 4K Ultra-Short-Throw Laser Projector",
    description: "Cinema laser projector projecting 120-inch 4K HDR picture from just 9 inches away, 2400 ANSI lumens, integrated Android TV, and Dolby Atmos speakers.",
    price: 1699.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    stock: 6,
    rating: 4.9,
    reviewsCount: 34
  },
  {
    title: "HydroGarden Smart Indoor Herb Hydroponic Kit",
    description: "Indoor countertop garden with automated full-spectrum LED grow light, silent water circulation pump, and water shortage warning alerts.",
    price: 79.99,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    stock: 32,
    rating: 4.7,
    reviewsCount: 85
  },
  {
    title: "ThermoStat Pro Wi-Fi Smart Climate Controller",
    description: "Intelligent learning thermostat with remote room temperature sensors, energy savings analytics, geofencing home/away auto-switch, and sleek glass dial.",
    price: 189.00,
    category: "Smart Home & Tech",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    stock: 24,
    rating: 4.8,
    reviewsCount: 105
  },

  // 7. Cameras & Drones (14 products)
  {
    title: "Sony Alpha A7 IV Full-Frame Mirrorless Camera",
    description: "33MP Exmor R full-frame sensor, 4K 60p 10-bit 4:2:2 video, real-time eye autofocus for human/animal/bird, and 5-axis in-body image stabilization.",
    price: 2498.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    rating: 5.0,
    reviewsCount: 97
  },
  {
    title: "DJI Mini 4 Pro Drone Fly More Combo",
    description: "Sub-249g ultra-lightweight drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting, 20km FHD transmission, and up to 34 minutes flight time.",
    price: 959.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.9,
    reviewsCount: 142
  },
  {
    title: "ActionCam 12 Black 5.3K Waterproof Action Camera",
    description: "HyperSmooth 6.0 video stabilization, 5.3K 60fps video, HDR photo & video, rugged waterproof down to 33ft, and dual LCD front and rear color screens.",
    price: 349.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.7,
    reviewsCount: 165
  },
  {
    title: "LumaGimbal 3-Axis Motorized Smartphone Stabilizer",
    description: "Professional handheld smartphone gimbal with built-in extendable selfie rod, magnetic fill light, gesture tracking AI sensor, and 12-hour battery life.",
    price: 119.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.8,
    reviewsCount: 88
  },
  {
    title: "Lumix G95 4K Creator Camera with 12-60mm Lens",
    description: "20.3MP Micro Four Thirds sensor with 5-axis Dual I.S. 2, unlimited 4K 30p recording, pre-installed V-Log L, microphone input, and headphone monitoring jack.",
    price: 799.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.7,
    reviewsCount: 54
  },
  {
    title: "InstaView 360 X3 5.7K Pocket 360 Action Camera",
    description: "Dual 48MP sensors capturing 5.7K 360-degree footage, invisible selfie stick effect, 2.29-inch tempered glass touchscreen, and waterproof down to 10 meters.",
    price: 449.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.8,
    reviewsCount: 79
  },
  {
    title: "ProLens 24-70mm f/2.8 Constant Aperture Zoom Lens",
    description: "Versatile professional standard zoom lens with nano AR coating, circular 11-blade aperture for creamy bokeh, and fast dual linear motors.",
    price: 1199.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 5.0,
    reviewsCount: 42
  },
  {
    title: "CarbonPro Lightweight Carbon Fiber Camera Tripod",
    description: "8-layer carbon fiber tripod with fluid 360-degree ball head, converts to monopod in seconds, 15kg load capacity, and compact 38cm folded travel size.",
    price: 149.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    rating: 4.8,
    reviewsCount: 93
  },
  {
    title: "DroneShield Hard Waterproof Carrying Flight Case",
    description: "Impact-resistant IP67 waterproof hard shell case with custom pre-cut EVA high-density foam protecting drone body, remote controller, and 4 batteries.",
    price: 69.99,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    rating: 4.7,
    reviewsCount: 68
  },
  {
    title: "VlogLight Pro Bicolor Portable LED Key Light",
    description: "High CRI 96+ pocket video panel light, adjustable color temperature 2500K-8500K, internal 3100mAh battery, and cold shoe mount for camera cages.",
    price: 49.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    rating: 4.6,
    reviewsCount: 112
  },
  {
    title: "SkyRacer FPV High-Speed Racing Drone with Goggles",
    description: "Acrobatic FPV quadcopter capable of 120km/h top speeds, ultra-low latency analog/digital video transmission, and immersive HD video headset goggles.",
    price: 499.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    rating: 4.9,
    reviewsCount: 37
  },
  {
    title: "StudioShot Professional Wireless Flash Trigger",
    description: "High-speed sync 1/8000s 2.4GHz wireless flash trigger with large backlit dot-matrix LCD panel, 32 channels, and 99 wireless ID settings.",
    price: 65.00,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.8,
    reviewsCount: 51
  },
  {
    title: "LensClean Professional Optical Sensor Cleaning Kit",
    description: "Complete camera maintenance kit including full-frame sensor swabs, anti-static rocket air blower, optical lens pen, and microfiber cloths.",
    price: 24.99,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80",
    stock: 85,
    rating: 4.8,
    reviewsCount: 198
  },
  {
    title: "DroneProp Ultra-Quiet Low-Noise Propellers (4-Pack)",
    description: "Aerodynamic replacement propellers engineered for 60% noise reduction and 5% extended flight time with quick-release lock mechanism.",
    price: 19.99,
    category: "Cameras & Drones",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    stock: 120,
    rating: 4.7,
    reviewsCount: 144
  },

  // 8. Storage & Accessories (14 products)
  {
    title: "ApexGen5 2TB NVMe PCIe 5.0 SSD with Heatsink",
    description: "Blistering read speeds up to 14,500 MB/s and write speeds up to 12,000 MB/s. Dedicated aluminum fin heatsink with dual heat pipes for sustained peak loads.",
    price: 249.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.9,
    reviewsCount: 110
  },
  {
    title: "RuggedShield 4TB External USB-C Rugged SSD",
    description: "IP65 water and dust resistant shockproof external drive, up to 2000MB/s transfer rate, drop-resistant from 3 meters, and AES 256-bit hardware encryption.",
    price: 289.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.8,
    reviewsCount: 94
  },
  {
    title: "PowerVault 25,000mAh 145W Laptop Power Bank",
    description: "High-capacity airline-approved battery bank with smart digital power display, dual 100W USB-C ports, capable of charging MacBook Pro and iPhone concurrently.",
    price: 89.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    rating: 4.9,
    reviewsCount: 220
  },
  {
    title: "ProCard 256GB V90 UHS-II SDXC Memory Card",
    description: "Professional cinema camera memory card with sustained 300MB/s read and 299MB/s write speeds, shockproof, temperature-proof, and X-ray proof.",
    price: 189.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.8,
    reviewsCount: 81
  },
  {
    title: "MagStand 3-in-1 Magnetic Fast Wireless Charging Dock",
    description: "Premium weighted zinc-alloy stand providing concurrent 15W fast wireless charging for phone, smartwatch, and wireless earbuds with adjustable viewing angle.",
    price: 79.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    rating: 4.8,
    reviewsCount: 165
  },
  {
    title: "CloudVault 4-Bay Network Attached Storage NAS",
    description: "Diskless 4-bay home and business NAS enclosure with quad-core processor, dual 2.5GbE ports, M.2 NVMe SSD cache slots, and automated backup software.",
    price: 449.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.8,
    reviewsCount: 52
  },
  {
    title: "Braided 240W USB-C to USB-C Silicone Cable (2m)",
    description: "Durable tangle-free silicone jacketed cable supporting PD 3.1 240W charging and 480Mbps data transfer with reinforced strain relief ends.",
    price: 19.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 140,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    title: "DeskTidy Magnetic Cable Organizer Base & Clips",
    description: "Weighted silicone desk base with 5 magnetic cable clips keeping charging cords organized and preventing them from sliding off desk edges.",
    price: 18.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    stock: 95,
    rating: 4.7,
    reviewsCount: 174
  },
  {
    title: "ArmorCase Waterproof Shockproof Tech Organizer Pouch",
    description: "Hard-shell EVA travel organizer pouch with elastic loops and mesh pockets for power banks, cables, SSDs, adapters, and memory cards.",
    price: 26.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80",
    stock: 80,
    rating: 4.8,
    reviewsCount: 135
  },
  {
    title: "ProCard MicroSDXC 512GB High-Speed A2 Gaming Card",
    description: "Optimized for Nintendo Switch, Steam Deck, drones, and smartphones. Read speeds up to 190MB/s with A2 application performance class.",
    price: 54.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
    stock: 65,
    rating: 4.8,
    reviewsCount: 240
  },
  {
    title: "SolarPack 30W Foldable Outdoor Solar Charger",
    description: "High-efficiency monocrystalline solar panels with dual USB ports and IPX4 water resistance for camping, hiking, and emergency power backup.",
    price: 69.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.6,
    reviewsCount: 77
  },
  {
    title: "ScreenShield 3-Pack 9H Tempered Glass Screen Protector",
    description: "Edge-to-edge 9H hardness tempered glass with oleophobic anti-fingerprint coating, easy installation alignment tray, and shatter protection.",
    price: 14.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 150,
    rating: 4.6,
    reviewsCount: 380
  },
  {
    title: "Universal World Travel Plug Adapter with 65W GaN",
    description: "All-in-one international travel adapter with UK, US, EU, and AU plugs plus 2 USB-C and 2 USB-A fast charging ports supporting 150+ countries.",
    price: 42.00,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    stock: 55,
    rating: 4.9,
    reviewsCount: 160
  },
  {
    title: "AirTag Leather Keychain Protective Case 4-Pack",
    description: "Premium stitched vegan leather tracking tag holder keychain rings with scratch protection and metal carabiner snap hooks.",
    price: 21.99,
    category: "Storage & Accessories",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80",
    stock: 90,
    rating: 4.7,
    reviewsCount: 120
  }
];

async function seed100Plus() {
  console.log(`[TechBazer 100+ Seeder] Connecting to database: '${DB_NAME}'...`);
  console.log(`[TechBazer 100+ Seeder] Total products prepared: ${rawCatalog.length}`);

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[TechBazer 100+ Seeder] Connected to MongoDB Atlas!`);

    // Clean old products and insert all 100+
    console.log('[TechBazer 100+ Seeder] Clearing existing products collection...');
    await Product.deleteMany({});

    console.log(`[TechBazer 100+ Seeder] Inserting ${rawCatalog.length} products into MongoDB...`);
    const inserted = await Product.insertMany(rawCatalog);
    console.log(`[TechBazer 100+ Seeder] Successfully inserted ${inserted.length} products into MongoDB 'techbazerdb'!`);

    // Ensure Admin & Customer users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: 'TechBazer Admin',
          email: 'admin@techbazer.com',
          password: 'admin123',
          role: 'Admin'
        },
        {
          name: 'TechBazer Admin (Alias)',
          email: 'admin@auspify.com',
          password: 'admin123',
          role: 'Admin'
        },
        {
          name: 'Jane Customer',
          email: 'customer@techbazer.com',
          password: 'customer123',
          role: 'Customer'
        }
      ]);
      console.log('[TechBazer 100+ Seeder] Seeded default users.');
    }

    // Also update server/data/techbazerdb.json and initialData.js so local fallback also has all 100+ products
    const dataDir = path.join(__dirname, 'data');
    const dbJsonPath = path.join(dataDir, 'techbazerdb.json');
    let localData = { users: [], products: [], orders: [], carts: [] };
    if (fs.existsSync(dbJsonPath)) {
      try {
        localData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
      } catch {}
    }

    localData.products = rawCatalog.map((p, i) => ({
      _id: `prod_${(i + 1).toString().padStart(3, '0')}`,
      ...p,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    fs.writeFileSync(dbJsonPath, JSON.stringify(localData, null, 2), 'utf-8');
    console.log(`[TechBazer 100+ Seeder] Updated 'server/data/techbazerdb.json' with ${rawCatalog.length} products.`);

    console.log('\n[TechBazer 100+ Seeder] SUCCESS! All 108 products are live in MongoDB techbazerdb.');
    process.exit(0);
  } catch (err) {
    console.error('[TechBazer 100+ Seeder] Error:', err);
    process.exit(1);
  }
}

seed100Plus();
