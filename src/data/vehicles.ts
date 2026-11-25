export type AudioTrackKey = 'lamborghini' | 'amg_s63' | 'bmw_xm' | 'bmw_i8';

export type ListingStatus = 'available' | 'upcoming' | 'stock_out';

export interface VehicleSpec {
  id: string;
  indexLabel: string;
  manufacturer: string;
  model: string;
  shortLabel: string;
  year: string;
  trimTag: string;
  tagline: string;
  description: string;
  engine: string;
  displacement: string;
  horsepower: number;
  horsepowerNote: string;
  torque: number;
  torqueUnit: string;
  zeroToHundred: string;
  topSpeed: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  redlineRpm: number;
  downforceNote: string;
  studioImage: string;
  galleryImages: string[];
  accentHex: string;
  audioTrack: AudioTrackKey;
  specialFeatures: string[];
}

export interface ShowroomCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  grade: string;
  status: ListingStatus;
  listingMode: 'buy' | 'sell' | 'consignment';
  mileageKm: string;
  exteriorColor: string;
  interiorTrim: string;
  engine: string;
  horsepower: string;
  transmission: string;
  location: string;
  images: string[];
  highlights: string[];
  summary: string;
}

export interface GarageProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Wheels & Brakes' | 'Aero & Carbon' | 'Exhaust & Intake' | 'Cinema & Detailing';
  priceUsd: number;
  grade: string;
  status: ListingStatus;
  fitment: string;
  sku: string;
  images: string[];
  description: string;
  specs: string[];
}

export interface ResearchDiscovery {
  id: string;
  topic: string;
  summary: string;
  mechanism: string;
  realWorldExample: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: 'Supra & Performance' | 'Street & Stance' | 'Mercedes & Luxury' | 'Sedans & Interiors';
  image: string;
  note: string;
}

export const VEHICLES: VehicleSpec[] = [
  {
    id: 'porsche_911_gt3_rs',
    indexLabel: '01',
    manufacturer: 'Porsche',
    model: '911 GT3 RS (992)',
    shortLabel: 'GT3 RS',
    year: '2024 Weissach Spec',
    trimTag: 'Weissach Track Package',
    tagline: 'Naturally aspirated flat-six howling to 9,000 RPM with active DRS aero.',
    description:
      'Engineered directly from Porsche Motorsport wind-tunnel data, pairing 860 kg of active downforce at 285 km/h with forged magnesium center-lock wheels and carbon-ceramic rotors.',
    engine: '4.0L NA Flat-Six',
    displacement: '3,996 cc',
    horsepower: 525,
    horsepowerNote: '@ 8,500 rpm',
    torque: 465,
    torqueUnit: 'Nm @ 6,300 rpm',
    zeroToHundred: '3.2 s',
    topSpeed: '296 km/h',
    transmission: '7-Speed PDK',
    drivetrain: 'Rear-Wheel Drive',
    fuelType: 'Petrol',
    redlineRpm: 9000,
    downforceNote: '860 kg Active DRS',
    studioImage: '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
    galleryImages: [
      '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
    ],
    accentHex: '#e5c158',
    audioTrack: 'lamborghini',
    specialFeatures: [
      'Swan-neck hydraulic DRS rear wing with steering-wheel PTM controls',
      'Weissach exposed carbon roof, anti-roll bars, and magnesium wheels',
      'PCCB 410mm carbon-ceramic front braking assembly',
    ],
  },
  {
    id: 'mclaren_750s',
    indexLabel: '02',
    manufacturer: 'McLaren',
    model: '750S Coupe',
    shortLabel: '750S',
    year: '2025 Monocage II',
    trimTag: 'Liquid Titanium Spec',
    tagline: 'Carbon Monocage featherweight paired with a 750 PS twin-scroll V8.',
    description:
      'Built around Woking’s ultra-light carbon-fiber tub and electro-hydraulic Proactive Chassis Control III, delivering telepathic steering feedback and relentless mid-range acceleration.',
    engine: '4.0L Twin-Turbo V8',
    displacement: '3,994 cc',
    horsepower: 750,
    horsepowerNote: '@ 7,500 rpm',
    torque: 800,
    torqueUnit: 'Nm @ 5,500 rpm',
    zeroToHundred: '2.8 s',
    topSpeed: '332 km/h',
    transmission: '7-Speed SSG',
    drivetrain: 'Rear-Wheel Drive',
    fuelType: 'Petrol',
    redlineRpm: 8500,
    downforceNote: 'Active Hydraulic Wing',
    studioImage: '/src/assets/images/mclaren_750s_coupe_1795352099173.jpg',
    galleryImages: [
      '/src/assets/images/mclaren_750s_coupe_1795352099173.jpg',
      '/src/assets/images/mclaren_p1_stage_1795257318769.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
    ],
    accentHex: '#e5c158',
    audioTrack: 'bmw_i8',
    specialFeatures: [
      'Monocage II structural carbon-fiber safety cell (1,389 kg curb)',
      'Center-exit stainless & titanium lightweight exhaust architecture',
      'PCC III linked-hydraulic damper suspension without mechanical anti-roll bars',
    ],
  },
  {
    id: 'lamborghini_huracan_tecnica',
    indexLabel: '03',
    manufacturer: 'Lamborghini',
    model: 'Huracán Tecnica',
    shortLabel: 'Tecnica',
    year: '2024 LDVI Track Spec',
    trimTag: 'Grigio Artis Satin',
    tagline: '5.2-liter naturally aspirated V10 symphony with rear-wheel steering.',
    description:
      'Bridging road poise and STO circuit sharpness through LDVI predictive dynamics, hexagonal titanium exhaust outlets, and clean Italian wedge aerodynamics.',
    engine: '5.2L NA V10',
    displacement: '5,204 cc',
    horsepower: 640,
    horsepowerNote: '@ 8,000 rpm',
    torque: 565,
    torqueUnit: 'Nm @ 6,500 rpm',
    zeroToHundred: '3.2 s',
    topSpeed: '325 km/h',
    transmission: '7-Speed LDF DCT',
    drivetrain: 'Rear-Wheel Drive',
    fuelType: 'Petrol',
    redlineRpm: 8500,
    downforceNote: '+35% Rear Downforce',
    studioImage: '/src/assets/images/lamborghini_huracan_stage_1795257318944.jpg',
    galleryImages: [
      '/src/assets/images/lamborghini_huracan_stage_1795257318944.jpg',
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
    ],
    accentHex: '#e5c158',
    audioTrack: 'lamborghini',
    specialFeatures: [
      'LDVI real-time predictive traction, torque vectoring & rear-axle steering',
      'Direct-breathing 10-cylinder intake plenum behind carbon bulkhead',
      'Carbon-ceramic braking system with forged Damiso 20-inch wheels',
    ],
  },
  {
    id: 'nissan_gtr_nismo',
    indexLabel: '04',
    manufacturer: 'Nissan',
    model: 'GT-R NISMO (R35)',
    shortLabel: 'GT-R NISMO',
    year: '2024 Takumi Special',
    trimTag: 'Stealth Gray Carbon',
    tagline: 'Hand-assembled VR38DETT twin-turbocharged icon with GT3 turbos.',
    description:
      'Each engine hand-signed by one of Tochigi’s Takumi master craftsmen, driving all four forged RAYS wheels via the ATTESA E-TS AWD transaxle.',
    engine: '3.8L Twin-Turbo V6',
    displacement: '3,799 cc',
    horsepower: 600,
    horsepowerNote: '@ 6,800 rpm',
    torque: 652,
    torqueUnit: 'Nm @ 3,600 rpm',
    zeroToHundred: '2.7 s',
    topSpeed: '315 km/h',
    transmission: '6-Speed BorgWarner DCT',
    drivetrain: 'ATTESA E-TS AWD',
    fuelType: 'Petrol',
    redlineRpm: 7100,
    downforceNote: 'Swan-Neck Carbon GT Wing',
    studioImage: '/src/assets/images/nissan_gtr_r35_nismo_1795352099257.jpg',
    galleryImages: [
      '/src/assets/images/nissan_gtr_r35_nismo_1795352099257.jpg',
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
      '/src/assets/images/toyota_gr_supra_mk5_1795352100243.jpg',
    ],
    accentHex: '#e5c158',
    audioTrack: 'bmw_xm',
    specialFeatures: [
      'GT3-spec twin IHI ball-bearing turbochargers with faster spool vanes',
      'Dry-carbon hood, roof, front fenders, trunk, and swan-neck wing',
      'Brembo 410mm carbon-ceramic rotors with 6-piston monoblock calipers',
    ],
  },
  {
    id: 'mercedes_amg_gt',
    indexLabel: '05',
    manufacturer: 'Mercedes-AMG',
    model: 'GT 63 Black Series',
    shortLabel: 'AMG GT',
    year: '2024 Affalterbach',
    trimTag: 'Flat-Plane V8 Edition',
    tagline: 'Flat-plane crank bi-turbo V8 built under One Man, One Engine.',
    description:
      'Long-bonnet front-midship poise with active underbody louvering, dual-plane carbon rear wing, and razor-sharp Affalterbach exhaust acoustics.',
    engine: '4.0L Flat-Plane Bi-Turbo V8',
    displacement: '3,982 cc',
    horsepower: 730,
    horsepowerNote: '@ 6,700 rpm',
    torque: 800,
    torqueUnit: 'Nm @ 2,000 rpm',
    zeroToHundred: '3.2 s',
    topSpeed: '325 km/h',
    transmission: '7-Speed AMG SPEEDSHIFT',
    drivetrain: 'Rear-Wheel Transaxle',
    fuelType: 'Petrol',
    redlineRpm: 7200,
    downforceNote: '400 kg @ 250 km/h',
    studioImage: '/src/assets/images/mercedes_amg_gt_stage_1795257318599.jpg',
    galleryImages: [
      '/src/assets/images/mercedes_amg_gt_stage_1795257318599.jpg',
      '/src/assets/images/bmw_m5_competition_stage_1795257318549.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
    ],
    accentHex: '#e5c158',
    audioTrack: 'amg_s63',
    specialFeatures: [
      '180-degree flat-plane crankshaft with dry-sump lubrication',
      'Carbon-fiber torque tube and unibody structural shear panel',
      '10-stage AMG Traction Control rotary dial for circuit balance',
    ],
  },
];

export const SHOWROOM_CARS: ShowroomCar[] = [
  {
    id: 'sr-gt3rs-2024',
    brand: 'Porsche',
    model: '911 GT3 RS Weissach',
    year: 2024,
    priceUsd: 318000,
    grade: 'Grade S · 9.9/10',
    status: 'available',
    listingMode: 'buy',
    mileageKm: '840 km',
    exteriorColor: 'Ice Grey Metallic / Exposed Carbon',
    interiorTrim: 'Weissach Race-Tex & Carbon Buckets',
    engine: '4.0L NA Flat-Six (9,000 RPM)',
    horsepower: '525 HP',
    transmission: '7-Speed PDK',
    location: 'Imperion Autos Vault · Ready for Dispatch',
    images: [
      '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
    ],
    highlights: [
      'Original factory delivery specification with full Weissach carbon package',
      'Front axle lift system + PCCB yellow ceramic brake calipers',
      'Complete paint thickness & DME over-rev zero-fault inspection verified',
    ],
    summary:
      'Grade S collector-specification 992 GT3 RS stored in climate-controlled vault readiness with delivery miles.',
  },
  {
    id: 'sr-750s-2025',
    brand: 'McLaren',
    model: '750S Coupe',
    year: 2025,
    priceUsd: 342000,
    grade: 'Grade 5A · Mint',
    status: 'available',
    listingMode: 'buy',
    mileageKm: '1,120 km',
    exteriorColor: 'Satin Liquid Titanium',
    interiorTrim: 'Jet Black Alcantara & Papaya Stitch',
    engine: '4.0L Twin-Turbo V8',
    horsepower: '750 HP',
    transmission: '7-Speed SSG',
    location: 'Imperion Autos · Private Collection Floor',
    images: [
      '/src/assets/images/mclaren_750s_coupe_1795352099173.jpg',
      '/src/assets/images/mclaren_p1_stage_1795257318769.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
    ],
    highlights: [
      'Lightweight Vortex forged 10-spoke turbine wheels',
      'Full front PPF coverage applied prior to road delivery',
      'Electrochromic glass roof & Bowers & Wilkins 12-speaker acoustics',
    ],
    summary:
      'Woking’s flagship twin-turbo supercar offering monocoque agility and verified 5A condition across chassis and cabin.',
  },
  {
    id: 'sr-huracan-tecnica',
    brand: 'Lamborghini',
    model: 'Huracán Tecnica LP 640-2',
    year: 2024,
    priceUsd: 294000,
    grade: 'Grade 5A · Mint',
    status: 'available',
    listingMode: 'buy',
    mileageKm: '2,350 km',
    exteriorColor: 'Grigio Artis Matte',
    interiorTrim: 'Nero Ade Alcantara & Giallo Contrast',
    engine: '5.2L Naturally Aspirated V10',
    horsepower: '640 HP',
    transmission: '7-Speed LDF',
    location: 'Imperion Autos · Verified Consignment',
    images: [
      '/src/assets/images/lamborghini_huracan_stage_1795257318944.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
    ],
    highlights: [
      'LDVI dynamic torque vectoring + rear-wheel steering calibration',
      'Factory Lamborghini telemetry pack & nose lifting system',
      'Zero paintwork repairs with complete service log',
    ],
    summary:
      'Late-era naturally aspirated V10 rear-drive Huracán presenting spotless auction grade and factory bronze Damiso wheels.',
  },
  {
    id: 'sr-supra-mk5-2024',
    brand: 'Toyota',
    model: 'GR Supra 3.0 A90 Track Spec',
    year: 2024,
    priceUsd: 68500,
    grade: 'Grade 4.5 · Clean',
    status: 'available',
    listingMode: 'buy',
    mileageKm: '6,800 km',
    exteriorColor: 'Nitro Yellow / Matte Carbon Lip',
    interiorTrim: 'Black Leather & Carbon Console',
    engine: '3.0L Twin-Scroll Inline-Six',
    horsepower: '382 HP',
    transmission: '8-Speed Sport ZF Auto',
    location: 'Dhaka Showcase · Ready Inspection',
    images: [
      '/assets/gallery/Picsart_26-06-27_00-10-31-800.jpg',
      '/src/assets/images/toyota_gr_supra_mk5_1795352100243.jpg',
      '/assets/gallery/Picsart_26-06-27_00-10-33-215.jpg',
    ],
    highlights: [
      'Genuine carbon-fiber front splitter & Michelin Pilot Super Sport tires',
      'Unmodified B58 powertrain with documented fluid intervals',
      'Active rear differential & adaptive variable suspension',
    ],
    summary:
      'Eye-catching Nitro Yellow GR Supra photographed on site, combining daily drivability with authentic coupe balance.',
  },
  {
    id: 'sr-gtr-nismo-2025',
    brand: 'Nissan',
    model: 'GT-R NISMO Special Edition',
    year: 2025,
    priceUsd: 238000,
    grade: 'Grade S · Incoming',
    status: 'upcoming',
    listingMode: 'buy',
    mileageKm: '320 km',
    exteriorColor: 'NISMO Stealth Gray',
    interiorTrim: 'Recaro Carbon Red & Black Alcantara',
    engine: '3.8L Takumi Twin-Turbo V6',
    horsepower: '600 HP',
    transmission: '6-Speed Dual-Clutch AWD',
    location: 'En Route · Port Allocation ETA 18 Days',
    images: [
      '/src/assets/images/nissan_gtr_r35_nismo_1795352099257.jpg',
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
    ],
    highlights: [
      'Incoming JDM Special Edition clear-coated carbon hood allocation',
      'Exclusive red-ring forged 20-inch NISMO RAYS wheels',
      'Priority waitlist open for pre-arrival lock-in',
    ],
    summary:
      'Final-edition R35 GT-R NISMO reserved on incoming allocation; buyers may lock priority inspection prior to unloading.',
  },
  {
    id: 'sr-bmwm5-cs',
    brand: 'BMW',
    model: 'M5 Competition LCI',
    year: 2023,
    priceUsd: 118000,
    grade: 'Grade 4.5 · Clean',
    status: 'stock_out',
    listingMode: 'buy',
    mileageKm: '9,400 km',
    exteriorColor: 'Frozen Brands Hatch Grey',
    interiorTrim: 'Merino Aragon Leather',
    engine: '4.4L M TwinPower V8',
    horsepower: '617 HP',
    transmission: '8-Speed M Steptronic AWD',
    location: 'Delivered to Private Collector',
    images: [
      '/src/assets/images/bmw_m5_competition_stage_1795257318549.jpg',
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
    ],
    highlights: [
      'Sold & delivered through Imperion Autos private brokerage',
      'Carbon roof, M Carbon ceramic brakes & M Driver Package',
      'Waitlist alerts active for next incoming F90 M5 allocation',
    ],
    summary:
      'Recently placed executive super-saloon; preserved in our archive for benchmark reference and similar sourcing requests.',
  },
];

export const GARAGE_PRODUCTS: GarageProduct[] = [
  {
    id: 'gr-rays-te37-kit',
    name: 'Monoblock Forged Magnesium Wheel & PCCB Kit',
    brand: 'Imperion Spec / Brembo',
    category: 'Wheels & Brakes',
    priceUsd: 11400,
    grade: 'Grade S · Brand New',
    status: 'available',
    fitment: 'Porsche 911 GT3 / McLaren / M5 Fitment',
    sku: 'IMP-WHL-992',
    images: [
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
      '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
    ],
    description:
      'Featherweight forged 20/21-inch track-spec wheel set paired with slotted high-thermal carbon-ceramic brake hardware for unsprung mass reduction.',
    specs: [
      'Saves 14.2 kg unsprung rotational mass over cast alloy sets',
      '410mm front slotted rotor compatibility with 6-piston monoblocks',
      'Anodized Satin Champagne / Obsidian Hardware Center Lock & 5x112',
    ],
  },
  {
    id: 'gr-dry-carbon-aero',
    name: 'Autoclave Dry-Carbon Aero & Swan-Neck Kit',
    brand: 'Imperion Carbon Works',
    category: 'Aero & Carbon',
    priceUsd: 7850,
    grade: 'Grade S · OEM+ Pre-Preg',
    status: 'available',
    fitment: 'GR Supra A90 / Huracán / 992 Platform',
    sku: 'IMP-CRB-440',
    images: [
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
      '/src/assets/images/toyota_gr_supra_mk5_1795352100243.jpg',
    ],
    description:
      '2x2 twill pre-preg autoclave dry carbon front splitter, dive-plane canards, rear diffuser strakes, and CNC billet aluminum wing uprights.',
    specs: [
      'UV-stabilized matte or high-gloss clear coat',
      'Direct bolt-on OEM chassis mounting hardware included',
      'Wind-tunnel validated front-to-rear downforce balance',
    ],
  },
  {
    id: 'gr-ti-valvetronic-exhaust',
    name: 'Grade-5 Titanium Valvetronic Cat-Back Exhaust',
    brand: 'Akrapovič / Imperion Spec',
    category: 'Exhaust & Intake',
    priceUsd: 6200,
    grade: 'Grade 5A · Sealed Box',
    status: 'upcoming',
    fitment: '4.0L V8 / 5.2L V10 / 3.0L B58 Platforms',
    sku: 'IMP-EXH-810',
    images: [
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
      '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
    ],
    description:
      'Ultra-thin-wall TIG-welded titanium acoustic exhaust assembly engineered for high-frequency harmonic resonance without highway drone.',
    specs: [
      'Grade-5 titanium canisters reducing rear overhang weight by 11.4 kg',
      'OEM CAN-bus valve integration for stealth vs. track acoustics',
      'Dry-carbon interwoven exhaust tip finishers',
    ],
  },
  {
    id: 'gr-cinema-car-rig',
    name: 'Pro Carbon Suction & Stabilizer Car-to-Car Rig',
    brand: 'Imperion Cinema Division',
    category: 'Cinema & Detailing',
    priceUsd: 3450,
    grade: 'Grade 5A · Field Proven',
    status: 'available',
    fitment: 'Universal Paint-Safe Vacuum Mounts',
    sku: 'IMP-CIN-204',
    images: [
      '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
      '/src/assets/images/bmw_m5_competition_stage_1795257318549.jpg',
    ],
    description:
      'Complete 4K rolling-shot camera rigging system tested at 140 km/h with dual air-shock isolation arms, safety tethers, and paint-safe silicone cups.',
    specs: [
      'Supports 14 kg cinema payloads (RED / Sony FX / DJI Ronin RS4)',
      'Tri-cup redundant vacuum manifold rated to 180 kg shear load',
      'Pelican hard transit case + black-matte anti-reflection carbon rods',
    ],
  },
  {
    id: 'gr-ceramic-coating-kit',
    name: 'Imperion Obsidian SiO2 Ceramic Protection Suite',
    brand: 'Imperion Care Atelier',
    category: 'Cinema & Detailing',
    priceUsd: 490,
    grade: 'Grade S · Fresh Batch',
    status: 'stock_out',
    fitment: 'Gloss, Satin & Matte PPF Surfaces',
    sku: 'IMP-DET-109',
    images: [
      '/src/assets/images/mclaren_p1_stage_1795257318769.jpg',
      '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
    ],
    description:
      'Dual-layer graphene-infused ceramic paint protection kit delivering hydrophobic self-cleaning beading and UV thermal gloss.',
    specs: [
      '9H crystal hardness rating across painted and clear-bra panels',
      'Safe for frozen satin & exposed twill carbon surfaces',
      'Restocking shortly — join waitlist for next atelier batch',
    ],
  },
];

export const RESEARCH_DISCOVERIES: ResearchDiscovery[] = [
  {
    id: 'rd-venturi-ground',
    topic: 'Underbody Venturi Ground Effect',
    summary:
      'Sculpted floor tunnels accelerate undercar airflow, lowering pressure beneath the chassis to pull the car toward asphalt with minimal drag penalty.',
    mechanism:
      'Bernoulli pressure drop across expanding rear diffusers multiplies cornering grip cleanly without oversized drag-inducing wings.',
    realWorldExample: 'McLaren 750S & Porsche 911 GT3 RS Active Floor Diffuser',
  },
  {
    id: 'rd-hot-vee',
    topic: 'Hot-Vee Twin-Scroll Charging',
    summary:
      'Mounting twin turbochargers inside the 90-degree cylinder valley shortens exhaust manifold runners by over 60%.',
    mechanism:
      'High-enthalpy exhaust pulses hit turbine wheels instantaneously, cutting spool latency and tightening front-end weight packaging.',
    realWorldExample: 'BMW M5 F90 S63 & Mercedes-AMG GT M178 LS2',
  },
  {
    id: 'rd-rear-steer',
    topic: 'Phase-Adaptive Rear-Axle Steering',
    summary:
      'Electromechanical actuators angle rear wheels up to 2.8 degrees opposite the fronts at low speeds and in-phase at high speeds.',
    mechanism:
      'Virtually shortens the wheelbase through tight switchbacks and extends stability during triple-digit lane changes.',
    realWorldExample: 'Lamborghini Huracán Tecnica LDVI & Porsche 992 GT3 RS',
  },
  {
    id: 'rd-pcc-hydraulics',
    topic: 'Linked Hydraulic Roll Decoupling',
    summary:
      'Cross-linked electro-hydraulic dampers replace heavy steel anti-roll bars to absorb single-wheel bumps without losing corner stiffness.',
    mechanism:
      'Accumulator spheres soften vertical ride compliance on rough tarmac while locking roll stiffness under high lateral G-load.',
    realWorldExample: 'McLaren Proactive Chassis Control III',
  },
];

export const CLICKED_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'gal-supra-bumble-01',
    title: 'GR Supra MK5 · Bumble Front Splitters',
    category: 'Supra & Performance',
    image: '/assets/gallery/Picsart_26-06-27_00-10-31-800.jpg',
    note: 'Signed frame by Farhan Tanvir Shuvo — Nitro Yellow A90 GR Supra headlamp and carbon lip study.',
  },
  {
    id: 'gal-civic-bagged-01',
    title: 'Bagged Chameleon Civic X · Stance',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-29-06-777.jpg',
    note: 'Iridescent emerald Civic X tucked on deep satin black six-spoke wheels.',
  },
  {
    id: 'gal-merc-eclass-rear',
    title: 'Mercedes-Benz E-Class · Twilight Tail',
    category: 'Mercedes & Luxury',
    image: '/assets/gallery/Picsart_26-06-27_01-06-37-618.jpg',
    note: 'Symmetrical rear decklid alignment highlighting smoked ribbon tail-lamps and dual exhaust finishers.',
  },
  {
    id: 'gal-supra-purple-01',
    title: 'Deep Violet GR Supra · LED Lens Study',
    category: 'Supra & Performance',
    image: '/assets/gallery/Picsart_26-06-27_00-19-05-571.jpg',
    note: 'Close-up reflection study capturing sculpted A90 headlamp optics and side intake mesh.',
  },
  {
    id: 'gal-merc-04',
    title: 'Mercedes-Benz · Three-Quarter Executive Stance',
    category: 'Mercedes & Luxury',
    image: '/assets/gallery/Picsart_26-06-27_01-13-58-588.jpg',
    note: 'Clean pearl white bodywork framed against sunset paddock horizon.',
  },
  {
    id: 'gal-supra-bumble-02',
    title: 'GR Supra · Side Profile & Alloy Spokes',
    category: 'Supra & Performance',
    image: '/assets/gallery/Picsart_26-06-27_00-10-33-215.jpg',
    note: 'Signature frame capturing the A90 Supra beltline and Pilot Super Sport rubber.',
  },
  {
    id: 'gal-supra-bumble-03',
    title: 'GR Supra · Bumper Aero Detail',
    category: 'Supra & Performance',
    image: '/assets/gallery/Picsart_26-06-27_00-13-58-652.jpg',
    note: 'Precision front fascia exposure emphasizing honeycomb cooling ducts and badge reflection.',
  },
  {
    id: 'gal-supra-04',
    title: 'Supra Dusk Angle · Signed Plate',
    category: 'Supra & Performance',
    image: '/assets/gallery/Picsart_26-06-27_00-21-34-388.jpg',
    note: 'Natural asphalt reflection frame clicked during afternoon meet.',
  },
  {
    id: 'gal-meet-frame-05',
    title: 'Trackside Lineup · Low Horizon',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-24-05-249.jpg',
    note: 'Low-angle editorial shot balancing warm sky highlights and tire contact patches.',
  },
  {
    id: 'gal-meet-frame-06',
    title: 'Tarmac Gathering · Metallic Spec',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-26-16-856.jpg',
    note: 'Sharp telephoto perspective isolating bodywork contours from background motion.',
  },
  {
    id: 'gal-meet-frame-07',
    title: 'Tarmac Gathering · Alternate Grade',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-26-16-857.jpg',
    note: 'Color-graded alternate exposure highlighting metallic flake.',
  },
  {
    id: 'gal-civic-02',
    title: 'Bagged Civic X · Rear Quarter Spec',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-31-15-577.jpg',
    note: 'Fender-to-lip air-suspension stance fitment study.',
  },
  {
    id: 'gal-civic-03',
    title: 'Street Build · Smoked Tail Profile',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-34-08-916.jpg',
    note: 'Evening tarmac capture focusing on aggressive rear bumper lines and exhaust tips.',
  },
  {
    id: 'gal-street-08',
    title: 'Golden Hour Coupé & Sedan Meet',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-38-45-785.jpg',
    note: 'Side-profile composition from weekend automotive showcase.',
  },
  {
    id: 'gal-street-09',
    title: 'Asphalt Reflection · Wheel Study',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-42-27-077.jpg',
    note: 'Deep contrast wheel spoke and brake caliper framing.',
  },
  {
    id: 'gal-street-10',
    title: 'Evening Paddock Lineup',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_00-45-32-633.jpg',
    note: 'Signed dusk lineup study by Farhan Tanvir Shuvo.',
  },
  {
    id: 'gal-merc-02',
    title: 'Mercedes-Benz · Star Grille Detail',
    category: 'Mercedes & Luxury',
    image: '/assets/gallery/Picsart_26-06-27_01-08-27-333.jpg',
    note: 'Sharp telephoto detail across chrome twin-louvre grille and AMG-line lower mesh.',
  },
  {
    id: 'gal-merc-03',
    title: 'Mercedes-Benz · Headlamp Projector Frame',
    category: 'Mercedes & Luxury',
    image: '/assets/gallery/Picsart_26-06-27_01-11-16-791.jpg',
    note: 'Crystal lens geometry caught in warm afternoon sidelight.',
  },
  {
    id: 'gal-edit-11',
    title: 'Twilight Automotive Portrait',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_01-57-31-994.jpg',
    note: 'Crisp signature plate showcasing automotive silhouette contrast.',
  },
  {
    id: 'gal-edit-12',
    title: 'Late-Light Paddock Composition',
    category: 'Street & Stance',
    image: '/assets/gallery/Picsart_26-06-27_01-59-48-744.jpg',
    note: 'Controlled highlight roll-off across painted bodywork.',
  },
];
