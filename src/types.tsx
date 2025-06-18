// src/types.ts
export interface Order {
    id: string;
    status: string;
    shippingBy: string;
    estimatedDeliveryTime: string;
    trackingNumber: string;
    items: {
      name: string;
      price: number;
      image: string;
    }[];
  }


// types/index.ts

export interface ProductMeasurement {
  orderId: string;
  productId: string;
  portfolioId: string;
  chest: number;
  waist: number;
  hip: number;
  sleeveLength: number;
  inseam: number;
  height: number;
  notes: number | null;
}
export interface ClientUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  profilePictureURL: string | null;
  role: string;
  phoneNumber?: string; // ⬅️ Maintenant optionnel
}

export interface ApiOrder {
  id: string;
  clientId: string;
  clientUser: ClientUser;
  tailorId: string;
  status: string;
  orderDate: string;
  deliveryAddress: string;
  notes: string;
  productMeasurements: ProductMeasurement[];
}
export type Statut = "En attente" | "Terminée" | "En cours";

  export interface Review {
    id: string;
    clientId: string;
    rate: number;
    comment: string;
  }
  
  export interface Project {
    id: string;
    name: string | null;
    fabricPreferences: string;
    styleReferences: string;
    quote: string;
    notes: string;
    imageUrl: string;
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureURL: string | null;
  }
  
  export interface Tailor {
    id: string;
    brand: string | null;
    bio: string | null;
    address: string | null;
    isActive: boolean;
    category?: Category;
    user?: User;
    reviews: Review[];
  }