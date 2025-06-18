import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  // Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, MapPin, Tag, Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAllTailors } from "@/lib/api";
import { Input } from "../ui/input";
// import { Tailor } from "./Pages/data/tailors";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-500 mt-2">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
      ))}
      {halfStar && <StarHalf className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOutline key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
};

// interface Address {
//   city: string;
// }

interface Review {
  id: string;
  rate: number;
  comment: string;
}

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
    profilePictureURL: string | null; // ✅ Add this

  };
}
export default function TailorsList() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = (tailorId: string) => {
    navigate(`/tailors/${tailorId}`);
  };

  // Load tailors on mount
  useEffect(() => {
    const loadTailors = async () => {
      setIsLoading(true);
      const data = await fetchAllTailors();
      setTailors(data || []);
      setIsLoading(false);
    };

    loadTailors();
  }, []);

  // Filter tailors
  const filteredTailors = tailors.filter((tailor) => {
    const matchName =
      tailor.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      tailor.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      false;
  
    const matchCity = cityFilter
      ? tailor.address?.toLowerCase() === cityFilter.toLowerCase()
      : true;
  
    const matchCategory = categoryFilter
      ? tailor.category?.name?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
  
    return matchName || matchCity || matchCategory;
  });

  if (isLoading) {
    return (
      <div className="text-center py-10">Chargement des couturiers...</div>
    );
  }

  if (!tailors.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Aucun couturier trouvé.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 -z-10">
      {/* Header */}
      <div className="head flex flex-row items-center justify-around">
        <h1 className="text-2xl font-bold mb-2">Découvrir Nos Tailors</h1>
        <hr className="border-t-1 border-gray-300 w-[60rem]" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-[30%]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un tailleur"
            value={search}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl border-gray-300 focus:ring-color1 focus:border-color1 transition-all"
          />
        </div>

        <div className="relative w-full lg:w-[25%]">
          <Select onValueChange={setCityFilter}>
            <SelectTrigger className="h-10 rounded-xl">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Wilaya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alger">Alger</SelectItem>
              <SelectItem value="Oran">Oran</SelectItem>
              <SelectItem value="Constantine">Constantine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full lg:w-[25%]">
          <Select onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 rounded-xl">
              <Tag className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Costumes traditionnels">Costumes traditionnels</SelectItem>
              <SelectItem value="Robes de soirée">Robes de soirée</SelectItem>
              <SelectItem value="Costumes sur mesure">Costumes sur mesure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tailors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTailors.map((tailor) => (
          <Card
            key={tailor.id}
            className="overflow-hidden p-0 border-0 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleCardClick(tailor.id)}
          >
            <CardHeader className="p-0">
  <img
    src={
      tailor.user?.profilePictureURL
        ? `${import.meta.env.VITE_IMAGE_API_URL}${tailor.user.profilePictureURL}`
        : ""
    }
    alt={tailor.brand || "Couturier"}
    // onError={(e) => {
    //   e.currentTarget.src = "https://via.placeholder.com/400x300"; 
    // }}
    className="w-full h-48 object-cover"
  />

  {tailor.user && (
    <h1 className="px-4 pt-2 font-medium">
      {tailor.user.firstName} {tailor.user.lastName}
    </h1>
  )}
</CardHeader>

            <CardContent className="p-4 space-y-1">
              <CardTitle className="text-xl font-semibold">
                {tailor.brand || "Sans marque"}
              </CardTitle>

              <CardDescription className="text-sm text-gray-500">
  {tailor.category?.name || "Catégorie non disponible"}
</CardDescription>
<p className="text-sm text-gray-700">
  Wilaya : {tailor.address || "Non spécifiée"}
</p>

              {tailor.reviews && tailor.reviews.length > 0 && (
                <div className="flex items-center mt-1">
                  {renderStars(
                    tailor.reviews.reduce((acc, r) => acc + r.rate, 0) / tailor.reviews.length
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}