export type AppPage =
  | 'home'
  | 'about'
  | 'services'
  | 'showroom'
  | 'exclusive'
  | 'garage'
  | 'contact'
  | 'admin-login';

export interface BagLineItem {
  id: string;
  kind: 'vehicle' | 'part' | 'exclusive' | 'service';
  title: string;
  subtitle: string;
  priceUsd: number;
  grade: string;
  image: string;
  quantity: number;
}
