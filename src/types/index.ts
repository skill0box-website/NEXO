export type Role = 'client' | 'tailleur';
export type OrderStep = 0 | 1 | 2 | 3 | 4 | 5;
export type MeasureCategory = 'homme' | 'femme' | 'enfant';

export interface Profile {
  id: string;
  role: Role;
  prenom: string;
  nom: string;
  tel: string;
  created_at: string;
}

export interface TailleurProfile {
  id: string;
  experience: string;
  specialities: string[];
  bio: string;
  city: string;
  certified: boolean;
  rating: number;
  reviews_count: number;
  diploma_url?: string;
  prenom?: string;
  nom?: string;
}

export interface Commande {
  id: string;
  client_id: string;
  tailleur_id: string;
  garment: string;
  occasion: string;
  fabric: string;
  notes: string;
  price: number;
  step: OrderStep;
  locked: boolean;
  delay: boolean;
  delivery_date: string;
  created_at: string;
  client?: Profile;
  tailleur?: TailleurProfile;
}

export interface Mesure {
  id: string;
  client_id: string;
  category: MeasureCategory;
  epaules?: number;
  poitrine?: number;
  taille?: number;
  hanches?: number;
  longueur?: number;
  manches?: number;
  updated_at: string;
}

export interface Message {
  id: string;
  commande_id: string;
  sender_id: string;
  text: string;
  img_url?: string;
  created_at: string;
}
