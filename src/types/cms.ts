import type {
  GalleryPhotoItem,
  GarageProduct,
  ResearchDiscovery,
  ShowroomCar,
  VehicleSpec,
} from '../data/vehicles';

export interface ServiceOffering {
  id: string;
  indexLabel: string;
  category: string;
  ventureTag: string;
  title: string;
  summary: string;
  deliverables: string[];
  rateLabel: string;
  turnaround: string;
  status: 'active' | 'limited' | 'by_inquiry';
}

export interface ExclusiveVaultItem {
  id: string;
  title: string;
  brand: string;
  editionTag: string;
  category: 'Timepieces' | 'Bespoke Aero & Carbon' | 'Collector Machines' | 'Motorsport Artifacts';
  priceUsd: number;
  allocationLabel: string;
  status: 'available' | 'upcoming' | 'stock_out';
  grade: string;
  provenance: string;
  paymentNote: string;
  images: string[];
  description: string;
  highlights: string[];
}

export interface PortraitItem {
  src: string;
  caption: string;
  alt: string;
}

export interface ClexoraPillar {
  id: string;
  title: string;
  summary: string;
}

export interface AboutMilestone {
  id: string;
  era: string;
  title: string;
  role: string;
  summary: string;
  outcomes: string[];
  ctaLabel: string;
  targetPage: 'home' | 'showroom' | 'garage' | 'contact' | 'services' | 'exclusive';
}

export interface NavLabelsConfig {
  home: string;
  about: string;
  services: string;
  showroom: string;
  exclusive: string;
  garage: string;
  contact: string;
}

export interface SiteCmsConfig {
  brand: {
    siteName: string;
    ownerName: string;
    email: string;
    phone: string;
    youtubeUrl: string;
    location: string;
    footerTagline: string;
    paymentTermsNotice: string;
    navLabels: NavLabelsConfig;
  };
  hero: {
    videoUrl: string;
    posterUrl: string;
    eyebrow: string;
    signature: string;
    headline: string;
    subtitle: string;
    ventureBadge: string;
    ventureSubline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  homeSections: {
    destinationsEyebrow: string;
    destinationsTitle: string;
    destinationsSubtitle: string;
    labEyebrow: string;
    labSignature: string;
    labTitle: string;
    labSubtitle: string;
    galleryEyebrow: string;
    gallerySignature: string;
    galleryTitle: string;
    gallerySubtitle: string;
  };
  about: {
    eyebrow: string;
    signature: string;
    heading: string;
    manifestoTag: string;
    manifestoHeadline: string;
    bioParagraph1: string;
    bioParagraph2: string;
    bannerEyebrow: string;
    bannerHeadline: string;
    bannerDescription: string;
    bannerImage: string;
    clexoraHeadline: string;
    clexoraDescription: string;
    portraits: PortraitItem[];
    clexoraPillars: ClexoraPillar[];
    milestones: AboutMilestone[];
  };
  servicesPage: {
    eyebrow: string;
    signature: string;
    title: string;
    subtitle: string;
    paymentNoticeTitle: string;
    paymentNoticeBody: string;
    items: ServiceOffering[];
  };
  exclusivePage: {
    eyebrow: string;
    signature: string;
    title: string;
    subtitle: string;
    paymentBanner: string;
    items: ExclusiveVaultItem[];
  };
  contactPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    baseHeadline: string;
    baseDescription: string;
    tracks: {
      imperion: string;
      showroom: string;
      clexora: string;
      cinema: string;
    };
  };
  curatedVehicles: VehicleSpec[];
  showroomCars: ShowroomCar[];
  garageItems: GarageProduct[];
  galleryPhotos: GalleryPhotoItem[];
  researchDiscoveries: ResearchDiscovery[];
}
