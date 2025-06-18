// src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_TOKEN_KEY = "authToken";
const USER_ID_KEY = "userId";
const USER_DATA_KEY = "userData";

export default apiClient;

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getUserId = () => localStorage.getItem(USER_ID_KEY);
export const getUserData = () => JSON.parse(localStorage.getItem(USER_DATA_KEY) || 'null');
export const setUserData = (data: any) => localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Fetch and save full user data
export const fetchAndSaveUserData = async () => {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const res = await apiClient.get(`/Auth/me?userId=${userId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    setUserData(res.data); // Save full user data
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};


// src/lib/api.ts
const PORTFOLIO_DATA_KEY = "portfolioData";

export const getPortfolioData = () => JSON.parse(localStorage.getItem(PORTFOLIO_DATA_KEY) || 'null');
export const setPortfolioData = (data: any) => localStorage.setItem(PORTFOLIO_DATA_KEY, JSON.stringify(data));

// Fetch and save portfolio data if user is a Tailor
export const fetchAndSavePortfolioData = async () => {
  const userData = getUserData();
  if (!userData || userData.role !== "Tailor" || !userData.tailorId) return null;

  try {
    const res = await apiClient.get(`/Clients/tailors/${userData.tailorId}/portfolio`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    setPortfolioData(res.data); // Save portfolio data
    return res.data;
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    return null;
  }
};




// src/lib/api.ts

const PORTFOLIO_DETAILS_KEY = "portfolioDetails";

export const setPortfolioDetails = (data: any) =>
  localStorage.setItem(PORTFOLIO_DETAILS_KEY, JSON.stringify(data));

export const getPortfolioDetails = () =>
  JSON.parse(localStorage.getItem(PORTFOLIO_DETAILS_KEY) || 'null');

/**
 * Fetch portfolio by ID from localStorage
 */
export const fetchAndSavePortfolioById = async () => {
  const portfolioData = getPortfolioData(); // { id: "...", ... }

  if (!portfolioData || !portfolioData.id) {
    console.warn("No portfolio ID found");
    return null;
  }

  try {
    const res = await apiClient.get(`/Portfolios/${portfolioData.id}/with-thumbnail`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    console.log("Fetched Portfolio Details:", res.data);

    // Save portfolio details for future use
    setPortfolioDetails(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch portfolio by ID:", error);
    return null;
  }
};

// src/lib/api.ts

// const PRODUCT_DATA_KEY = "productData";

// src/lib/api.ts

export const addProductToPortfolio = async (productData: {
  name: string;
  fabricPreferences: string;
  styleReferences: string;
  quote: string;
  notes: string;
}) => {
  const portfolioData = getPortfolioData();
  const userData = getUserData();

  if (!portfolioData || !userData) {
    console.error("Missing portfolio or user data");
    return null;
  }

  try {
    const res = await apiClient.post("/Products", {
      ...productData,
      tailorId: userData.tailorId,
      portfolioId: portfolioData.id,
    }, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    return res.data;
  } catch (error) {
    console.error("Failed to add product:", error);
    alert("Échec de l'ajout du produit.");
    return null;
  }
};

export const uploadProductImages = async (productId: string, files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append("files", file);
  });

  try {
    const res = await apiClient.post(`/Products/${productId}/images`, formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Échec du téléchargement des images:", error);
    alert("Échec du téléchargement des images.");
    return null;
  }
};




// src/lib/api.ts
// src/lib/api.ts

export const fetchProductWithImages = async (productId: string) => {
  if (!productId) return null;

  try {
    const res = await apiClient.get(`/Products/${productId}/productWithImages`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    console.log("Fetched Product With Images:", res.data);

    // Fix duplicate 'uploads' in URL
    if (res.data && res.data.images && res.data.images.length > 0) {
      res.data.images = res.data.images.map((image: any) => {
        let fixedUrl = image.imageUrl;

        // Remove double uploads path
        if (fixedUrl.includes("//uploads")) {
          fixedUrl = fixedUrl.replace(/\/\/uploads/g, "/uploads");
        }

        return {
          ...image,
          imageUrl: fixedUrl.startsWith("http")
            ? fixedUrl
            : `${import.meta.env.VITE_IMAGE_API_URL}/${fixedUrl.replace(/^\//, "")}`
        };
      });
    }

    return res.data;
  } catch (error) {
    console.error("Failed to fetch product with images:", error);
    return null;
  }
};



// src/lib/api.ts

/**
 * Delete a product by ID
 */
export const deleteProduct = async (productId: string) => {
  if (!productId) {
    console.warn("Missing productId");
    return false;
  }

  try {
    const res = await apiClient.delete(`/Products/${productId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    console.log("Product deleted successfully:", res.data);
    // alert("Produit supprimé avec succès !");
    // return true;
  } catch (error: any) {
    console.error("Failed to delete product:", error.response?.data || error.message);
    alert("Échec de la suppression du produit.");
    return false;
  }
};



// src/lib/api.ts

export const fetchAllTailors = async () => {
  try {
    const res = await apiClient.get("/Tailors/with-reviews", {
    
    });

    console.log("Fetched All Tailors:", res.data);

    // Optional: Save tailors to localStorage for reuse
    localStorage.setItem("tailorList", JSON.stringify(res.data));

    return res.data;
  } catch (error) {
    console.error("Failed to fetch tailors:", error);
    return null;
  }
};




export const fetchPortfolioByTailorId = async (tailorId: string) => {
  if (!tailorId) return null;

  try {
    const res = await apiClient.get(`/Clients/tailors/${tailorId}/portfolio`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    console.log("Fetched Portfolio by Tailor:", res.data);
    return res.data; // This should be the portfolio object
  } catch (error) {
    console.error("Failed to fetch portfolio by tailor ID:", error);
    return null;
  }
};





// src/lib/api.ts

export const fetchProjectsByPortfolioId = async (portfolioId: string) => {
  if (!portfolioId) return [];

  try {
    const res = await apiClient.get(`/Portfolios/${portfolioId}/with-reviews`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    console.log("Fetched Projects:", res.data);

    // Add full image URL if thumbnail exists
    const projectsWithFullImages = res.data.map((project: any) => ({
      ...project,
      imageUrl: project.thumbnail?.imageUrl
        ? `${import.meta.env.VITE_IMAGE_API_URL}${project.thumbnail.imageUrl}`
        : "https://via.placeholder.com/400x300" 
    }));

    return projectsWithFullImages;
  } catch (error) {
    console.error("Failed to fetch projects by portfolio ID:", error);
    return [];
  }
};





// src/lib/api.ts

export interface Review {
  id: string;
  clientId: string;
  rate: number;
  comment: string;
}
export const fetchTailorReviews = async (tailorId: string): Promise<Review[]> => {
  if (!tailorId) return [];

  try {
    const res = await apiClient.get(`/Tailors/${tailorId}/with-reviews`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });

    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
};




/**
 * Submit a new review for a tailor
 */
export const submitReview = async (
  tailorId: string,
  clientId: string,
  rate: number,
  comment: string
): Promise<Review | null> => {
  try {
    const res = await apiClient.post(
      "/Reviews",
      {
        id: generateUUID(), // Generate UUID v4
        clientId,
        tailorId,
        rate,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed to submit review:", error);
    alert("Échec de l'envoi de l'avis.");
    return null;
  }
};

// Helper: UUID generator
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random();
    const v = c === "x" ? Math.floor(r * 16) : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}



// export const sendMessageToTailor = async (
//   senderId: string,
//   receiverId: string,
//   message: string
// ): Promise<boolean> => {
//   try {
//     const res = await apiClient.post(
//       `/Chats/send?senderId=${senderId}&receiverId=${receiverId}&message=${encodeURIComponent(message)}`
//     );
//     return res.status === 200;
//   } catch (error) {
//     console.error("Failed to send message:", error);
//     return false;
//   }
// };

// Interface for backend message
export interface ChatMessage {
  text: any;
  id: string;
  message: string;
  sentAt: string;
  senderId: string;
}

export interface ChatThreadResponse {
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  tailorId: string;
  tailorFirstName: string;
  tailorLastName: string;
  messages: ChatMessage[];
}

// ✅ Fetch chat history
export const fetchChatHistory = async (
  userId: string,
  partnerId: string
): Promise<ChatThreadResponse> => {
  try {
    const res = await apiClient.get(`/Chats/history?userId=${userId}&partnerId=${partnerId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    console.log("chat history:",res.data)
    return res.data;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return {
      clientId: "",
      clientFirstName: "",
      clientLastName: "",
      tailorId: "",
      tailorFirstName: "",
      tailorLastName: "",
      messages: [],
    };
  }
};

// ✅ Send message
export const sendMessageToTailor = async (
  senderId: string,
  receiverId: string,
  message: string
): Promise<boolean> => {
  try {
    const res = await apiClient.post(
      `/Chats/send?senderId=${senderId}&receiverId=${receiverId}&message=${encodeURIComponent(message)}`
    );

    return res.status === 200;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
};


export const submitOrder = async (
  clientId: string,
  tailorId: string,
  projectId: string,
  measurements: any,
  portfolioId: string
): Promise<boolean> => {
  try {
    const payload = {
      clientId,
      tailorId,
      status: "Pending",
      deliveryAddress: measurements.deliveryAddress || "Adresse par défaut",
      notes: measurements.notes || "Aucune note",

      productMeasurements: [
        {
          productId: projectId,
          portfolioId,

          chest: parseInt(measurements.chest) || 0,
          waist: parseInt(measurements.waist) || 0,
          hip: parseInt(measurements.hip) || 0,
          sleeveLength: parseInt(measurements.sleeveLength) || 0,
          inseam: parseInt(measurements.inseam) || 0,
          height: parseInt(measurements.height) || 0,

          // ✅ Only send number or null
          notes: measurements.notes && !isNaN(parseFloat(measurements.notes))
            ? parseFloat(measurements.notes)
            : null
        }
      ]
    };

    console.log("Submitting Order:", payload);

    const res = await apiClient.post("/Orders/with-measurements", payload, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    return res.status === 200;

  } catch (error: any) {
    console.error("Failed to submit order:", error.response?.data || error.message);
    
    alert(`Échec de l'envoi: ${error.response?.data.title || error.message}`);
    return false;
  }
};






export interface ApiOrder {
  id: string;
  clientId: string;
  clientUser: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    profilePictureURL: string | null;
    role: string;
  };
  tailorId: string;
  status: string;
  orderDate: string;
  deliveryAddress: string;
  notes: string;
  productMeasurements: ProductMeasurement[];
}

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

// Local table display model
export interface Order {
  id: string;
  client: string;
  date: string;
  statut: Statut;
}

export type Statut = "En attente" | "Terminée" | "En cours";

/**
 * Fetch Orders by Tailor ID
 */
export const fetchOrdersByTailor = async (tailorId: string): Promise<ApiOrder[]> => {
  try {
    const res = await apiClient.get(`/Orders/with-measurements/by-tailor/${tailorId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
console.log(res.data)
    return res.data; // Return raw API data
  } catch (error) {
    console.error("Échec de la récupération des commandes", error);
    return [];
  }
};

// src/lib/api.ts

export const mapStatutToApiFormat = (statut: Statut): string => {
  switch (statut) {
    case "En attente":
      return "Pending";
    case "Terminée":
      return "Completed";
    case "En cours":
      return "Processing";
    default:
      return "Pending";
  }
};

// interface Contact {
//   id: string;
//   name: string;
//   firstName: string;
//   lastName: string;
//   lastMessage: string;
//   unread?: number;
// }
// Fetch all clients
export const fetchAllClients = async (): Promise<{ id: string; firstName: string; lastName: string }[]> => {
  try {
    const res = await apiClient.get("/Clients", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return [];
  }
};
export interface ChatMessage {
  id: string;
  message: string;
  sentAt: string;
  senderId: string;
  senderFirstName?: string;
  senderLastName?: string;
}

export interface ChatThreadResponse {
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  tailorId: string;
  tailorFirstName: string;
  tailorLastName: string;
  messages: ChatMessage[];
}

export const fetchclientChatHistory = async (
  clientId: string,
  tailorId: string
): Promise<ChatThreadResponse> => {
  try {
    const res = await apiClient.get(`/Chats/history?userId=${clientId}&partnerId=${tailorId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    return res.data as ChatThreadResponse;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return {
      clientId: "",
      clientFirstName: "",
      clientLastName: "",
      tailorId: "",
      tailorFirstName: "",
      tailorLastName: "",
      messages: []
    };
  }
};
// Send message from tailor to client
export const sendMessageToClient = async (
  senderId: string,
  receiverId: string,
  message: string
): Promise<boolean> => {
  try {
    const res = await apiClient.post(`/Chats/send`, null, {
      params: {
        senderId,
        receiverId,
        message
      },
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return res.status === 200;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
};
/**
 * Update order status via API
 */
export const updateOrderStatus = async (orderId: string, newStatus: Statut): Promise<boolean> => {
  try {
    const apiStatus = mapStatutToApiFormat(newStatus); // Convertir en format attendu par l'API
    const res = await apiClient.put(`/Orders/${orderId}/status`, { status: apiStatus }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    console.log("Statut mis à jour avec succès :", res.data);
    return true;
  } catch (error: any) {
    console.error("Échec de la mise à jour du statut", error);
    alert("Impossible de mettre à jour le statut.");
    return false;
  }
};





// src/lib/api.ts

/**
 * Fetch orders for a client
 */
/**
 * Fetch all orders for a client
 */



export const fetchOrdersByClient = async (clientId: string): Promise<ApiOrder[]> => {
  if (!clientId) {
    throw new Error("Client ID is required");
  }

  try {
    const res = await apiClient.get(`/Orders/with-measurements/by-client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    return res.data.map((order: any) => ({
      ...order,
      items: order.productMeasurements.map((pm: ProductMeasurement) => ({
        name: pm.portfolioId || "Vêtement personnalisé",
        price: order.price || 0,
        image: `https://i.pravatar.cc/150?img=${pm.portfolioId}`
      }))
    }));
  } catch (error) {
    console.error("Échec de la récupération des commandes", error);
    return [];
  }
};