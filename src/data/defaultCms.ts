import type { SiteCmsConfig } from '../types/cms';
import {
  CLICKED_GALLERY_PHOTOS,
  GARAGE_PRODUCTS,
  RESEARCH_DISCOVERIES,
  SHOWROOM_CARS,
  VEHICLES,
} from './vehicles';

export const DEFAULT_SITE_CMS: SiteCmsConfig = {
  brand: {
    siteName: 'FARHAN PALACE',
    ownerName: 'Farhan Tanvir Shuvo',
    email: 'farhanislam0909@gmail.com',
    phone: '+880 1558-070531',
    youtubeUrl: 'https://www.youtube.com/@farhantanvirshuvo',
    location: 'Dhaka, Bangladesh · Worldwide Remote Execution & Vehicle Sourcing',
    footerTagline: 'Imperion Autos · Clexora Remote Execution · Exclusive Vault · Automotive Media',
    paymentTermsNotice:
      'Direct reservation lock-in active — tailored payment settlement & banking terms are configured directly upon confirmation.',
    navLabels: {
      home: 'Home',
      about: 'Who I Am',
      services: 'Services',
      showroom: 'Showroom',
      exclusive: 'Exclusive',
      garage: 'Garage',
      contact: 'Contact Me',
    },
  },
  hero: {
    videoUrl: '/assets/hero_velocity.mp4',
    posterUrl: '/assets/hero_poster.jpg',
    eyebrow: 'Automotive Curations · Media & Engineering',
    signature: 'Farhan Tanvir Shuvo',
    headline: 'Precision Motion. Imperion Standards.',
    subtitle:
      'Founder of Imperion Autos & Clexora Operations — curating graded supercars, dry-carbon hardware, private vaults, and 4K visual storytelling.',
    ventureBadge: 'Imperion Autos · Clexora · Farhan Palace',
    ventureSubline: 'Graded Showroom · Exclusive Vault · Engineering Lab · Lens Archive',
    primaryCtaLabel: 'Explore Curated Cars',
    secondaryCtaLabel: 'Open Showroom',
  },
  homeSections: {
    destinationsEyebrow: 'Direct Navigation Portals',
    destinationsTitle: 'Explore Farhan Palace',
    destinationsSubtitle:
      'Step into crisp white editorial pages for founder credentials, services, car trading, exclusive pieces, garage hardware, and direct contact.',
    labEyebrow: 'Aerodynamics & Powertrain Lab',
    labSignature: 'Farhan Tanvir Shuvo',
    labTitle: 'Engineering & Acoustic Dynamics',
    labSubtitle:
      'Interactive wind-tunnel streamlines, real supercar exhaust acoustics, and technical architecture comparisons.',
    galleryEyebrow: 'Personal Lens Archive',
    gallerySignature: 'Farhan Tanvir Shuvo',
    galleryTitle: 'Clicked by Farhan Tanvir Shuvo',
    gallerySubtitle:
      'Unfiltered automotive photography captured across tarmac meets, dusk showcases, and street builds — direct from the lens archive.',
  },
  about: {
    eyebrow: '01 · Who I Am',
    signature: 'Farhan Tanvir Shuvo',
    heading: 'Farhan Tanvir Shuvo',
    manifestoTag: 'Founder · Imperion Autos & Clexora',
    manifestoHeadline: 'Building Automotive Ventures, Execution Systems & Cinematic Stories.',
    bioParagraph1:
      'I am Farhan Tanvir Shuvo — founder of Imperion Autos and Clexora Remote Operations. My work bridges collector-grade supercar curation, high-craft automotive cinematography & photography, and streamlined remote operational execution for founders and collectors.',
    bioParagraph2:
      'From sourcing Grade S / 5A performance vehicles and bespoke dry-carbon hardware to executing multi-timezone remote office workflows through Clexora, every mandate is driven by precision, clear provenance, and uncompromised visual discipline.',
    bannerEyebrow: 'Imperion Autos · Flagship Brokerage & Care',
    bannerHeadline: 'Curated Vehicle Acquisitions & Bespoke Hardware',
    bannerDescription:
      'Inspect multi-grade inventory across Available, Upcoming, and Stock Out allocations — or consign your own performance machine into the FARHAN PALACE network.',
    bannerImage: '/assets/aistudio/adas_c216d534.jpeg',
    clexoraHeadline: 'Clexora Remote Execution Desk',
    clexoraDescription:
      'Structured remote office operations, SOP architecture, executive workflow coordination, and dedicated digital back-office teams built for fast-moving founders.',
    portraits: [
      {
        src: '/assets/aistudio/FB_IMG_1787605767058.jpg_539cfe07.jpeg',
        caption: 'Executive Cockpit Perspective · Mercedes-AMG',
        alt: 'Farhan Tanvir Shuvo seated inside Mercedes-AMG cockpit',
      },
      {
        src: '/assets/aistudio/adas_c216d534.jpeg',
        caption: 'Imperion Atelier Twin-Coupe Driveway',
        alt: 'Farhan Tanvir Shuvo at the Imperion twin-coupe villa driveway',
      },
      {
        src: '/assets/aistudio/Picsart_26-11-22_21-13-21-710.jpg_dba220a9.jpeg',
        caption: 'Evening Lounge · Strategy & Negotiations',
        alt: 'Farhan Tanvir Shuvo seated in formal lounge',
      },
      {
        src: '/assets/aistudio/Picsart_26-11-22_21-15-36-684.jpg_4d8336ee.jpeg',
        caption: 'Studio Editorial Portrait · Monochrome Tailored',
        alt: 'Farhan Tanvir Shuvo tailored studio portrait',
      },
      {
        src: '/assets/aistudio/Picsart_26-11-22_21-17-02-714.jpg_4b596035.jpeg',
        caption: 'Founder Study · Operations & Planning',
        alt: 'Farhan Tanvir Shuvo executive portrait',
      },
    ],
    clexoraPillars: [
      {
        id: 'cx-sop',
        title: 'Remote Office Execution',
        summary:
          'Dedicated administrative hubs, inbox triage, client onboarding flows, and daily executive coordination across global timezones.',
      },
      {
        id: 'cx-ops',
        title: 'Standard Operating Architecture',
        summary:
          'Turning unstructured founder bottlenecks into clean repeatable checklists, vendor tracking, and accountable KPI sheets.',
      },
      {
        id: 'cx-media',
        title: 'Visual Production Pipeline',
        summary:
          'Coordinating 4K automotive film shoots, color grading workflows, camera rigging, and delivery scheduling end to end.',
      },
      {
        id: 'cx-trade',
        title: 'VIP Brokerage & Sourcing',
        summary:
          'Auction grade verification, port-to-door logistics oversight, and discrete collector-to-collector negotiations.',
      },
    ],
    milestones: [
      {
        id: 'ms-imperion',
        era: 'Venture',
        title: 'Imperion Autos & Collector Vault',
        role: 'Founder & Lead Curator',
        summary:
          'Launched an end-to-end vehicle acquisition, consignment, and dry-carbon performance parts platform built around transparent grade inspection.',
        outcomes: [
          'Built graded Showroom system covering Available, Upcoming & Stock Out tracking',
          'Established forged wheel, ceramic braking, and titanium exhaust fitment desk',
          'Integrated private Exclusive Vault for rare horology & bespoke allocations',
        ],
        ctaLabel: 'Open Showroom',
        targetPage: 'showroom',
      },
      {
        id: 'ms-clexora',
        era: 'Operations',
        title: 'Clexora Remote Execution',
        role: 'Principal Systems Architect',
        summary:
          'Designed remote office execution models enabling international teams and solo principals to run daily operations cleanly without physical overhead.',
        outcomes: [
          'Structured asynchronous workflow documentation and SLA reporting desks',
          'Direct client pipeline coordination across sales, sourcing, and concierge',
          'Flexible retainer and execution tracks configured around client timelines',
        ],
        ctaLabel: 'View Services',
        targetPage: 'services',
      },
      {
        id: 'ms-photography',
        era: 'Visuals',
        title: 'Automotive Cinematography & Lens Archive',
        role: 'Director & Photographer',
        summary:
          'Produced dynamic car-to-car rolling films, acoustic studies, and high-resolution still photography captured personally across Dhaka and private meets.',
        outcomes: [
          'Assembled full suction & gimbal car-to-car motion rigs rated for high speed',
          'Built an archived gallery of real GR Supra, Civic X, and Mercedes-Benz frames',
          'Color-graded digital campaigns pairing real exhaust soundscapes with 4K motion',
        ],
        ctaLabel: 'See Services',
        targetPage: 'services',
      },
    ],
  },
  servicesPage: {
    eyebrow: 'Curated Services · Imperion & Clexora',
    signature: 'Farhan Tanvir Shuvo',
    title: 'Services & Execution',
    subtitle:
      'Specialized cinematography, Clexora remote office execution, automotive brokerage, exclusive collector sourcing, and performance hardware fitment.',
    paymentNoticeTitle: 'Direct Reservation · Payment Terms Finalized With Client',
    paymentNoticeBody:
      'Every service engagement and asset reservation is scoped transparently first. Payment schedules, escrow milestones, and invoicing terms are configured directly after brief review.',
    items: [
      {
        id: 'svc-cinema',
        indexLabel: '01',
        category: 'Visual Production',
        ventureTag: 'Farhan Palace Media',
        title: '4K Automotive Cinematography & Editorial Stills',
        summary:
          'Full-scale automotive commercials, car-to-car rolling rig shoots, real exhaust acoustic recording, and graded photography portfolios.',
        deliverables: [
          'Suction-rigged 4K dynamic rolling footage & aerial transitions',
          'Dedicated raw stills gallery graded to warm obsidian or editorial whites',
          'Synchronized multi-mic exhaust audio capture & vertical/widescreen masters',
        ],
        rateLabel: 'Payment Terms Configured Later',
        turnaround: '5–10 Days Delivery',
        status: 'active',
      },
      {
        id: 'svc-clexora',
        indexLabel: '02',
        category: 'Operations & Execution',
        ventureTag: 'Clexora Ops',
        title: 'Remote Office Service & Dedicated Execution',
        summary:
          'End-to-end remote office staffing, executive inbox & calendar mastery, SOP documentation, vendor follow-up, and operational reporting.',
        deliverables: [
          'Dedicated remote desk operator aligned with your business hours',
          'Client CRM hygiene, quotation preparation & follow-up automation',
          'Weekly KPI audit sheet with zero administrative drop-offs',
        ],
        rateLabel: 'Monthly / Project Scope',
        turnaround: '48-Hour Onboarding',
        status: 'active',
      },
      {
        id: 'svc-car-selling',
        indexLabel: '03',
        category: 'Automotive Brokerage',
        ventureTag: 'Imperion Autos',
        title: 'Graded Vehicle Selling, Buying & Consignment',
        summary:
          'Private buyer matching, auction sheet verification, multi-angle photography preparation, and transparent consignment representation.',
        deliverables: [
          'Auction grade & paint-depth inspection dossier for buyer confidence',
          'Direct placement inside FARHAN PALACE Showroom with multi-photo plates',
          'Coordinated private viewings and paperwork closing support',
        ],
        rateLabel: 'Direct Commission Terms Later',
        turnaround: 'Immediate Listing',
        status: 'active',
      },
      {
        id: 'svc-exclusive',
        indexLabel: '04',
        category: 'Private Collector Trading',
        ventureTag: 'Exclusive Panel',
        title: 'Exclusive Vault Sourcing & Limited Allocations',
        summary:
          'Discreet sourcing and private placement for numbered horology, bespoke Weissach carbon specs, and motorsport collectibles.',
        deliverables: [
          'Provenance verification and certificate serialization',
          'Private waitlist matching prior to public vault release',
          'Insured white-glove courier or showroom handover',
        ],
        rateLabel: 'Settlement Configured Later',
        turnaround: 'By Allocation Window',
        status: 'limited',
      },
      {
        id: 'svc-garage',
        indexLabel: '05',
        category: 'Performance Hardware',
        ventureTag: 'Imperion Garage',
        title: 'Forged Wheels, Dry-Carbon Aero & Hardware Sourcing',
        summary:
          'Precision fitment advisory and direct procurement of forged magnesium/aluminum wheels, ceramic brake kits, and valvetronic exhausts.',
        deliverables: [
          'Chassis offset & brake caliper clearance verification',
          'Direct factory / authorized hardware sourcing',
          'Member-to-member buy & sell parts exchange',
        ],
        rateLabel: 'Per-Order Payment Finalized',
        turnaround: '7–21 Days Logistics',
        status: 'active',
      },
    ],
  },
  exclusivePage: {
    eyebrow: 'Private Collector Allocations · Deferred Payment',
    signature: 'Farhan Tanvir Shuvo',
    title: 'The Exclusive Panel',
    subtitle:
      'Curated ultra-limited timepieces, carbon track hardware, numbered builds, and motorsport artifacts. Lock your reservation in the bag now; final payment terms are settled directly.',
    paymentBanner:
      'Reservations lock allocation priority without upfront card charges — payment terms & settlement schedule will be finalized directly later.',
    items: [
      {
        id: 'exc-chronograph-01',
        title: 'Imperion Skeleton Chronograph · Carbon Edition',
        brand: 'Imperion Private Horology',
        editionTag: 'Numbered 03 / 15',
        category: 'Timepieces',
        priceUsd: 42500,
        allocationLabel: '1 Piece Available',
        status: 'available',
        grade: 'Grade S · Unworn Vault Sealed',
        provenance: 'Swiss Forged Carbon Case · Serialized Card',
        paymentNote: 'Payment terms finalized directly upon allocation lock',
        images: [
          '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
          '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
        ],
        description:
          'Ultra-light forged carbon chronograph housing a skeletonized column-wheel caliber with 18k champagne-gold rotor weight.',
        highlights: [
          'Full box, signed certificate of authenticity & velvet presentation trunk',
          'Titanium deployment clasp paired with vented black FKM motorsport strap',
          'Available for immediate private inspection',
        ],
      },
      {
        id: 'exc-weissach-aero',
        title: '992 GT3 RS One-Off Exposed Satin Carbon Package',
        brand: 'Imperion Bespoke Aero',
        editionTag: 'Commission 1 of 3',
        category: 'Bespoke Aero & Carbon',
        priceUsd: 28900,
        allocationLabel: '1 Set Available',
        status: 'available',
        grade: 'Grade S · Autoclave Pre-Preg',
        provenance: 'TUV Tested Dry Carbon Weave',
        paymentNote: 'Tailored wire/escrow settlement discussed post-reservation',
        images: [
          '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
          '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
        ],
        description:
          'Complete matte dry-carbon exterior upgrade package featuring extended dive planes, roof strakes, and CNC anodized champagne wing endplates.',
        highlights: [
          'Direct replacement for OEM Weissach mounting points',
          'Matched directional weave centerline across all panels',
          'Includes protective wooden air-freight crate',
        ],
      },
      {
        id: 'exc-p1-allocation',
        title: 'Emerald Exposed Carbon Hypercar Build Slot',
        brand: 'Woking Private Commission',
        editionTag: 'Allocation Soon · 1 Slot',
        category: 'Collector Machines',
        priceUsd: 1650000,
        allocationLabel: 'Upcoming Window',
        status: 'upcoming',
        grade: 'Grade S · Concours Provenance',
        provenance: 'Full Factory Inspection & Build Record',
        paymentNote: 'Structured private placement agreement settled later',
        images: [
          '/src/assets/images/mclaren_p1_stage_1795257318769.jpg',
          '/src/assets/images/mclaren_750s_coupe_1795352099173.jpg',
        ],
        description:
          'Rare emerald-tinted visual carbon chassis allocation prepared for serious private collectors seeking centerpiece garage provenance.',
        highlights: [
          'Complete battery & IPAS hybrid health telemetry certified',
          '24k gold heat-shielded engine bay lining',
          'Priority waitlist inquiries open now',
        ],
      },
      {
        id: 'exc-telemetry-helmet',
        title: 'Carbon Monocoque Signed Paddock Display Helmet',
        brand: 'Imperion Motorsport',
        editionTag: 'Archived 01 / 05',
        category: 'Motorsport Artifacts',
        priceUsd: 6800,
        allocationLabel: 'Reserved / Out',
        status: 'stock_out',
        grade: 'Grade 5A · Display Vault',
        provenance: 'FIA 8860 Shell Specification',
        paymentNote: 'Waitlist open for next seasonal commission',
        images: [
          '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
          '/src/assets/images/lamborghini_huracan_stage_1795257318944.jpg',
        ],
        description:
          'Full autoclaved 12k carbon motorsport shell finished in gold leaf striping with custom smoked iridium visor and acrylic display plinth.',
        highlights: [
          'Hand-laid pinstripe detailing matching Imperion Palace palette',
          'Placed with private collector — waitlist active for next release',
        ],
      },
    ],
  },
  contactPage: {
    eyebrow: 'Executive Desk · Direct Communication',
    title: 'Contact Me',
    subtitle:
      'Reach Farhan Tanvir Shuvo directly for Imperion vehicle buying/selling, Exclusive Vault allocations, Clexora remote office execution, or 4K cinematography commissions.',
    baseHeadline: 'Dhaka Base · Worldwide Execution',
    baseDescription:
      'Local showroom viewings, port inspection coordination, and asynchronous Clexora operations delivered across global timezones.',
    tracks: {
      imperion: 'Imperion Vault & Exclusive Inquiries',
      showroom: 'Showroom Buy / Sell & Garage Hardware',
      clexora: 'Clexora Remote Office & Operations',
      cinema: '4K Cinematography & Visual Production',
    },
  },
  curatedVehicles: VEHICLES,
  showroomCars: SHOWROOM_CARS,
  garageItems: GARAGE_PRODUCTS,
  galleryPhotos: CLICKED_GALLERY_PHOTOS,
  researchDiscoveries: RESEARCH_DISCOVERIES,
};
