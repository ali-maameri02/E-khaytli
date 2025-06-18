import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useEffect, useState } from "react";
import Svgilustration from "../../../assets/3d-tailor-cartoon-sewing-dress-transparent-background_1195761-9085-removebg-preview.png";
import Navbar from "../Navbar";
import { fetchTailorReviews, getUserData, submitReview } from "@/lib/api";
// import { Tailor, Project, Review } from "@/types";
// Define types
interface Project {
  id: string;
  name: string | null;
  fabricPreferences: string;
  styleReferences: string;
  quote: string;
  notes: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  clientId: string;
  rate: number;
  comment: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tailor {
  id: string;
  brand: string | null;
  bio: string | null;
  address: string | null;
  isActive: boolean;
  reviews: Review[];
  category?: Category;
  user?: {
    firstName: string;
    lastName: string;
    profilePictureURL: string | null;
  };
}

function TailorPortfolio() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const [tailor, setTailor] = useState<Tailor | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  // Load tailor + projects
  useEffect(() => {
    const loadTailorData = async () => {
      if (!tailorId) {
        console.warn("No tailor ID found");
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Fetch tailor with reviews
        const tailorResponse = await fetch(
          `http://e-khayetli.runasp.net/api/Tailors/${tailorId}/with-reviews`
        );
        const tailorData = await tailorResponse.json();

        // Map tailor data
        const mappedTailor: Tailor = {
          id: tailorData.id,
          brand: tailorData.brand,
          bio: tailorData.bio,
          address: tailorData.address || "Alger",
          isActive: tailorData.isActive,
          category: tailorData.category
            ? { id: "1", name: tailorData.category }
            : undefined,
          user: tailorData.user
            ? {
                firstName: tailorData.user.firstName,
                lastName: tailorData.user.lastName,
                profilePictureURL: tailorData.user.profilePictureURL,
              }
            : undefined,
          reviews: tailorData.reviews || [],
        };

        setTailor(mappedTailor);
        const fetchedReviews = await fetchTailorReviews(tailorId);
        setReviews(fetchedReviews);
  
        // Step 2: Fetch portfolio by tailor ID
        const portfolioRes = await fetch(
          `http://e-khayetli.runasp.net/api/Clients/tailors/${tailorId}/portfolio`
        );

        const portfolioData = await portfolioRes.json();
        const portfolioId = portfolioData?.id;

        if (!portfolioId) {
          console.warn("No portfolio found for this tailor");
          setProjects([]);
          setIsLoading(false);
          return;
        }

        // Step 3: Fetch projects by portfolio ID
        const projectsRes = await fetch(
          `http://e-khayetli.runasp.net/api/Portfolios/${portfolioId}/with-thumbnail`
        );

        const projectsData = await projectsRes.json();

        // Map project data
        const mappedProjects = projectsData.map((p: any) => ({
          id: p.id,
          name: p.name || null,
          fabricPreferences: p.fabricPreferences || "Non spécifié",
          styleReferences: p.styleReferences || "Non spécifié",
          quote: p.quote || "0",
          notes: p.notes || "Aucune note",
          imageUrl: p.thumbnail?.imageUrl
            ? `${import.meta.env.VITE_IMAGE_API_URL}${p.thumbnail.imageUrl}`
            : "https://via.placeholder.com/400x300", 
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to load tailor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTailorData();
  }, [tailorId]);


  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userData = getUserData();
    // const authToken = getAuthToken();
  
    // if (!userData || !userData.id || !authToken) {
    //   alert("Vous devez être connecté pour laisser un avis.");
    //   navigate("/login"); // Redirect to login page
    //   return;
    // }
  
    const clientId = userData.clientId;
  
    if (!tailorId) {
      alert("Impossible d’identifier le couturier.");
      return;
    }
  
    if (!rating || rating <= 0 || rating > 5) {
      alert("Veuillez sélectionner une note entre 1 et 5.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const result = await submitReview(tailorId, clientId, rating, comment);
  
      if (result) {
        setComment("");
        setRating(0);
  
        // Refresh reviews
        const updatedReviews = await fetchTailorReviews(tailorId);
        setTailor((prev) =>
          prev ? { ...prev, reviews: updatedReviews } : null
        );
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Échec de l'envoi de l'avis.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [filter, setFilter] = useState<"all" | "low" | "high">("all");

  const filteredProjects = projects.filter((project) => {
    const price = parseFloat(project.quote);
    if (filter === "low") return price < 5000;
    if (filter === "high") return price >= 5000;
    return true;
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500">
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

  if (!tailorId) {
    return (
      <div className="text-center py-10 text-red-500">
        Aucun ID de couturier fourni. Vérifiez l'URL.
      </div>
    );
  }

  if (isLoading) {
    return <div>Chargement des données du tailleur...</div>;
  }

  if (!tailor) {
    return <div>Aucun tailleur trouvé.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p- px-3 mr-5 mt-12 space-y-6">
        {/* Tailor Info */}
        <div className="flex fixed p-0 top-24 items-center gap-6">
          <img
            src={
              tailor?.user?.profilePictureURL
                ? `${import.meta.env.VITE_IMAGE_API_URL}${tailor.user.profilePictureURL}`
                : "https://via.placeholder.com/128" 
            }
            alt={tailor?.user ? `${tailor.user.firstName} ${tailor.user.lastName}` : "Profile"}
            className="w-32 h-32 rounded-full object-cover shadow"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {tailor?.user
                ? `${tailor.user.firstName} ${tailor.user.lastName}`
                : "Nom inconnu"}
            </h1>
            <p className="text-gray-500">
              {tailor?.category?.name || "Tailleur"} · {tailor?.address || "Alger"}
            </p>
            {renderStars(
              tailor?.reviews && tailor.reviews.length > 0
                ? tailor.reviews.reduce((acc, r) => acc + r.rate, 0) /
                  tailor.reviews.length
                : 0
            )}
          </div>
        </div>

        {/* Projects with SVG + Filter */}
        <div className="py-6 mt-36 p-2">
          {/* <h1 className="text-2xl font-bold mb-4">Portfolio</h1> */}
          <div className="flex gap-6 p-6 flex-row justify-between">
            {/* Sidebar */}
            <div className="w-full px-6 lg:w-1/4 flex flex-col items-center gap-2 fixed left-0 right-full">
              <img src={Svgilustration} alt="Illustration" className="w-72 h-48" />
              <div className="w-full space-y-2">
                <h3 className="text-lg font-medium text-center">Filtrer par prix</h3>
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFilter("all")}
                >
                  Tous
                </Button>
                <Button
                  variant={filter === "low" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFilter("low")}
                >
                  Moins de 5000 DA
                </Button>
                <Button
                  variant={filter === "high" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFilter("high")}
                >
                  Plus de 5000 DA
                </Button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="w-full ml-80 p-5 px-16 lg:w-[45rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} className="border rounded shadow p-4">
                    <img
                      src={project.imageUrl}
                      alt={project.name || "Projet"}
                      className="w-full h-48 object-cover rounded mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300"; 
                      }}
                    />
                    <h2 className="font-semibold text-lg">{project.name || "Sans nom"}</h2>
                    <p className="text-gray-600">Préférence tissu: {project.fabricPreferences}</p>
                    <p className="text-gray-600">Style: {project.styleReferences}</p>
                    <p className="text-gray-600">Prix estimé: {project.quote} DA</p>
                    <p>{project.notes || "Aucune note"}</p>
                    <a  href={`/order/${tailorId}/${project.id}`}>
      Voir détails
    </a>
                  </div>
                ))
              ) : (
                <p>Aucun projet trouvé dans le portfolio de ce couturier.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="fixed top-24 right-12 w-[17rem] shadow-lg p-2 h-[30rem] overflow-y-auto bg-white rounded-md">
              <h2 className="text-xl font-semibold mb-4">Avis</h2>
              <div className="space-y-4">
                {tailor.reviews.length > 0 ? (
                  tailor.reviews.map((review) => (
                    <div key={review.id} className="border-0 bg-gray-100 shadow-md pb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`mr-1 ${
                              i < Math.floor(review.rate)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 mt-6">Aucun avis disponible.</p>
                )}
                {/* Reviews */}
{/* Reviews Section */}
<div className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-100">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Avis Clients</h2>

  {/* Reviews List */}
  <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1 text-yellow-500 text-lg">
            {[...Array(5)].map((_, i) => (
              <span key={`star-${i}`} className={i < Math.floor(review.rate) ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
          <p className="mt-2 text-xs text-gray-500 italic">— Client anonyme</p>
        </div>
      ))
    ) : (
      <p className="text-center py-6 text-gray-500 italic">Aucun avis disponible.</p>
    )}
  </div>

  {/* Add New Review Form */}
  <div className="mt-8 pt-6 border-t border-gray-200">
    <h2 className="text-xl font-medium mb-4 text-gray-700">Laisser un avis</h2>
    <form onSubmit={handleSubmitReview} className="space-y-4">
  {/* Star Rating */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Note</label>
    <div className="mt-1 flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => setRating(star)}
          className={`cursor-pointer ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  </div>

  {/* Comment */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Commentaire</label>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Votre avis..."
      className="w-full mt-1 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      rows={3}
      required
    />
  </div>

  {/* Submit Button */}
  <Button type="submit" disabled={isSubmitting} className="w-full">
    {isSubmitting ? "Envoi en cours..." : "Soumettre"}
  </Button>
</form>
  </div>
</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TailorPortfolio;