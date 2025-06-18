export interface Review {
  id: string;
  clientId: string;
  tailorId: string;
  rate: number;
  comment: string;
}

// src/types/tailor.ts or inline in your component
export interface Category{
  id:string,
  name:string
}
export interface Tailor {
  id: string;
  brand: string | null;
  bio: string | null;
  address: string | null; // ✅ Now it's a string
  isActive: boolean;
  reviews: Review[];
  category?: Category;
  user?: {
    firstName: string;
    lastName: string;
  };
}
export const tailors: Tailor[] = [
  {
    id: "1",
    brand: "Atelier Ahmed",
    bio: "Costume traditionnel de mariage",
    address: "Alger",
    isActive: true,
    reviews: [],
    // category: "Costumes traditionnels",
  },
  {
    id: "2",
    brand: "Samira Couture",
    bio: "Robes sur mesure pour événements spéciaux",
    address: "Oran",
    isActive: true,
    reviews: [],
    // category: "Robes de soirée",
  }
];