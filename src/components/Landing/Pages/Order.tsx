import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { MessageCircle } from "lucide-react";

// API Functions
import { fetchPortfolioByTailorId, fetchProductWithImages, sendMessageToTailor, submitOrder } from "@/lib/api";

// Swiper for carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Types
interface Product {
  id: string;
  name: string | null;
  description: string;
  quote: string;
  imageUrl: string;
  images: Array<{ id: string; imageUrl: string }>;
}

// interface ChatMessage {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   message: string;
//   timestamp: string;
// }

function Order() {
  const { tailorId, projectId } = useParams<{ tailorId: string; projectId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [measurement, setMeasurement] = useState({
    chest: "",
    waist: "",
    hip: "",
    sleeveLength: "",
    inseam: "",
    height: "",
    notes: ""
  });

  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);

  // Load product from API
  useEffect(() => {
    const loadProduct = async () => {
      if (!projectId) return;

      try {
        const res = await fetchProductWithImages(projectId);
        if (res && res.id) {
          const mainImageUrl = res.images?.[0]?.imageUrl || "https://via.placeholder.com/400x300"; 
          setProduct({
            ...res,
            imageUrl: mainImageUrl,
          });
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [projectId]);

  const handleOpenModal = (url: string) => {
    setSelectedImage(url);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSendMessage = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const senderId = userData.clientId;

    if (!senderId) {
      alert("Vous devez être connecté pour envoyer un message.");
      return;
    }

    if (!tailorId || !message.trim()) {
      alert("Veuillez saisir un message avant d’envoyer.");
      return;
    }

    try {
      const sent = await sendMessageToTailor(senderId, tailorId, message);

      if (sent) {
        setChat((prev) => [...prev, message]);
        setMessage("");
      } else {
        alert("Échec de l'envoi du message.");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Échec de l'envoi du message.");
    }
  };


  const handleSendOrder = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const clientId = userData.clientId;
  
    if (!projectId || !tailorId) {
      alert("Impossible d’identifier le produit ou le couturier.");
      return;
    }
  
    if (!measurement.chest || !measurement.waist || !measurement.hip) {
      alert("Veuillez remplir toutes les mensurations obligatoires.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const portfolioData = await fetchPortfolioByTailorId(tailorId);
      const portfolioId = portfolioData?.id;
  
      if (!portfolioId) {
        alert("Ce couturier n’a pas de portfolio valide.");
        return false;
      }
  
      const success = await submitOrder(
        clientId,
        tailorId,
        projectId,
        measurement,
        portfolioId
      );
  
      if (success) {
        alert("Commande envoyée avec succès !");
        setMeasurement({
          chest: "",
          waist: "",
          hip: "",
          sleeveLength: "",
          inseam: "",
          height: "",
          notes: ""
        });
      }
    } catch (err) {
      console.error("Failed to send order:", err);
      alert("Échec de l'envoi de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return <div>Chargement du produit...</div>;
  }

  if (!product) {
    return (
      <div className="text-center mt-20 text-red-600">
        Produit introuvable.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-6 mt-20 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Commander : {product.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <img
              src={product.imageUrl}
              alt={product.name || "Produit"}
              onClick={() => handleOpenModal(product.imageUrl)}
              className="w-full h-64 object-cover rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            />

            {/* Thumbnails Carousel */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Vues supplémentaires</h3>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={3}
                pagination={{ clickable: true }}
                navigation
                className="tailor-swiper"
              >
                {product.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <img
                      src={image.imageUrl}
                      alt="Vue supplémentaire"
                      onClick={() => handleOpenModal(image.imageUrl)}
                      className="w-full h-24 object-cover rounded border cursor-pointer hover:ring-2 hover:ring-blue-500"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Measurement Form */}
          <div className="lg:col-span-1">
            <form className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Vos mensurations</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: "chest", label: "Poitrine" },
                  { name: "waist", label: "Taille" },
                  { name: "hip", label: "Hanche" },
                  { name: "sleeveLength", label: "Longueur de manche" },
                  { name: "inseam", label: "Entrejambe" },
                  { name: "height", label: "Taille (cm)" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      id={name}
                      type="number"
                      name={name}
                      value={(measurement as any)[name]}
                      onChange={(e) =>
                        setMeasurement({ ...measurement, [e.target.name]: e.target.value })
                      }
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="cm"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
              <Button
  onClick={handleSendOrder}
  type="button"
  disabled={isSubmitting}
  className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded"
>
  {isSubmitting ? "Envoi en cours..." : "Envoyer la commande"}
</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-36 bg-black rounded-full right-6 z-50">
        <button
          onClick={() => setShowChat((prev) => !prev)}
          className="bg-color1 hover:bg-color2 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white border shadow-xl rounded-lg flex flex-col p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Chat avec le couturier</h2>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="h-64 overflow-y-auto border-0 p-2 mb-2 rounded bg-white">
            {chat.map((msg, i) => (
              <div key={i} className="text-sm bg-blue-100 p-2 rounded mb-2">
                {msg}
              </div>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-color1"
            placeholder="Écrire un message..."
          />
          <Button
            onClick={handleSendMessage}
            className="w-full border bg-white text-black hover:bg-black hover:text-white"
          >
            Envoyer
          </Button>
        </div>
      )}

      <Footer />

      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Aperçu agrandi"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Order;