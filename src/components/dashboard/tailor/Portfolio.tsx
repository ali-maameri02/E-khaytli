import { getUserData, getPortfolioData, fetchAndSavePortfolioById, fetchProductWithImages, deleteProduct } from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {  FiUpload } from "react-icons/fi";
import {
  addProductToPortfolio,
  uploadProductImages,
} from "@/lib/api";
// import { Button } from "@/components/ui/button";




// interface ProjetBackend {
//   id: string;
//   fabricPreferences: string;
//   notes: string;
//   thumbnail: {
//     imageUrl: string;
//   };
// }
// Interface représentant un projet du portfolio
interface Projet {
  id: string;
  titre: string;
  description: string;
  image: string;
}

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    fabricPreferences: "",
    styleReferences: "",
    quote: "",
    notes: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedProject] = useState<any>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsLoadingDetails] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
const [isDeleting, setIsDeleting] = useState(false);
  const resetForm = () => {
    setNewProduct({
      name: "",
      fabricPreferences: "",
      styleReferences: "",
      quote: "",
      notes: ""
    });
    setSelectedFiles(null);
    setPreviews([]);
  };

  // Load portfolio data on mount
  useEffect(() => {
    const loadPortfolio = async () => {
      const userData = getUserData();
      if (!userData || userData.role !== "Tailor") return;
  
      const portfolioDetails = await fetchAndSavePortfolioById();
  
      console.log("Portfolio Details:", portfolioDetails);
  
      if (portfolioDetails && Array.isArray(portfolioDetails)) {
        const mappedProjects = portfolioDetails.map((p: any) => ({
          id: p.id,
          titre: p.name || `Project ${p.id}`,
          description: p.notes || "No description",
          image: p.thumbnail?.imageUrl
            ? `${import.meta.env.VITE_IMAGE_API_URL}${p.thumbnail.imageUrl}`
            : "https://via.placeholder.com/400x300" 
        }));
  
        setProjets(mappedProjects);
      } else {
        console.warn("Portfolio details is not an array or missing");
        setProjets([]);
      }
    };
  
    loadPortfolio();
  }, []);
  // Update preview whenever files are selected
  useEffect(() => {
    if (!selectedFiles) return;

    const objectUrls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(objectUrls);

    // Cleanup
    return () => objectUrls.forEach(URL.revokeObjectURL);
  }, [selectedFiles]);

  const handleAjouterProjet = async () => {
    setIsLoading(true);

    const portfolioData = getPortfolioData();
    const userData = getUserData();

    console.log("Portfolio Data:", portfolioData);
    console.log("User Data:", userData);

    if (!portfolioData || !portfolioData.id) {
      alert("Portfolio data not loaded. Please reload.");
      setIsLoading(false);
      return;
    }

    if (!userData || !userData.tailorId) {
      alert("User data not found.");
      setIsLoading(false);
      return;
    }

    const productData = {
      name: newProduct.name || "Untitled Project",
      fabricPreferences: newProduct.fabricPreferences || "Default Fabric",
      styleReferences: newProduct.styleReferences || "Modern Style",
      quote: newProduct.quote || "0",
      notes: newProduct.notes || "No special notes.",
    };

    console.log("Product Data Sent:", productData);

    const createdProduct = await addProductToPortfolio(productData);

    console.log("Created Product:", createdProduct);

    if (createdProduct && selectedFiles?.length) {
      console.log("Uploading images...");
      const result = await uploadProductImages(createdProduct.id, selectedFiles);
      console.log("Image Upload Result:", result);
    }

    alert("Produit ajouté avec succès !");
    resetForm();
    setShowForm(false);
    setIsLoading(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };


  const handleViewDetails = async (projectId: string) => {
    setIsLoadingDetails(true);
    setSelectedProject(projectId);
  
    const details = await fetchProductWithImages(projectId);
  
    if (details) {
      setProjectDetails(details);
      setIsModalOpen(true);
    } else {
      alert("Échec de chargement des détails du projet.");
    }
  
    setIsLoadingDetails(false);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProjectIds.length} projets ?`)) return;
  
    setIsDeleting(true);
  
    const failedDeletions: string[] = [];
  
    // Delete each selected product
    for (const projectId of selectedProjectIds) {
      const success = await deleteProduct(projectId);
      if (!success) {
        failedDeletions.push(projectId);
      }
    }
  
    if (failedDeletions.length === 0) {
      alert("Tous les projets ont été supprimés avec succès !");
      // Reload projects after deletion
      const updatedProducts = await fetchAndSavePortfolioById();
  
      if (updatedProducts && Array.isArray(updatedProducts)) {
        const mappedProjects = updatedProducts.map((p: any) => ({
          id: p.id,
          titre: p.fabricPreferences || `Project ${p.id}`,
          description: p.notes || "No description",
          image: p.thumbnailUrl
            ? `${import.meta.env.VITE_IMAGE_API_URL}${p.thumbnailUrl}`
            : "https://via.placeholder.com/400x300" 
        }));
        setProjets(mappedProjects);
      }
  
      setSelectedProjectIds([]);
    } else {
      alert(`${failedDeletions.length} projets n'ont pas pu être supprimés.`);
    }
  
    setIsDeleting(false);
  };
  // const handleSupprimerProjet = async (projectId: string) => {
  //   // if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
  
  //   const success = await deleteProduct(projectId);
  
  //   if (success) {
  //     // Reload portfolio/projects after deletion
  //     const updatedProducts = await fetchAndSavePortfolioById();
    
  //     if (updatedProducts && Array.isArray(updatedProducts)) {
  //       const mappedProjects = updatedProducts.map((p: any) => ({
  //         id: p.id,
  //         titre: p.fabricPreferences || `Project ${p.id}`,
  //         description: p.notes || "No description",
  //         image: p.thumbnailUrl
  //           ? `${import.meta.env.VITE_IMAGE_API_URL}${p.thumbnailUrl}`
  //           : "https://via.placeholder.com/400x300" 
  //       }));
  //       setProjets(mappedProjects);
  //     }
  //   }
  // };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">Portfolio</h2>
  <div className="flex space-x-4">
    <button
      onClick={() => setShowForm(true)}
      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
    >
      Ajouter un Projet
    </button>

    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectedProjectIds.length === projets.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProjectIds(projets.map(p => p.id));
          } else {
            setSelectedProjectIds([]);
          }
        }}
        className="w-4 h-4"
      />
      <span>Sélectionner tous</span>
    </label>
  </div>
</div>
      {selectedProjectIds.length > 0 && (
  <button
    onClick={handleBulkDelete}
    disabled={isDeleting}
    className={`mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
  >
    {isDeleting ? "Suppression en cours..." : `Supprimer (${selectedProjectIds.length})`}
  </button>
)}
      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projets.map((projet) => (
  <motion.div
    key={projet.id}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="p-6 rounded-lg shadow-md bg-white cursor-pointer relative"
  >
    {/* Checkbox */}
    <div className="absolute top-2 left-2">
      <input
        type="checkbox"
        checked={selectedProjectIds.includes(projet.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProjectIds([...selectedProjectIds, projet.id]);
          } else {
            setSelectedProjectIds(selectedProjectIds.filter(id => id !== projet.id));
          }
        }}
        className="w-5 h-5"
      />
    </div>

    {/* Image */}
    <img
      src={projet.image}
      alt={projet.titre}
      className="w-full h-96 object-cover rounded-t-lg mb-4"
    />

    {/* Details */}
    <h3 className="text-xl font-semibold">{projet.titre}</h3>
    <p className="text-gray-600 mb-5">{projet.description}</p>
    <a 
  // variant={"secondary"} 
  className="bg-blue-200 p-2 mt-12 text-black w-full rounded-lg text-bold cursor-pointer hover:bg-blue-300"
  onClick={() => handleViewDetails(projet.id)}
> voir les détails</a> </motion.div>
))}
      </div>

      {isModalOpen && projectDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{projectDetails.name || `Project ${projectDetails.id}`}</h2>
      
      {/* Project Info */}
      <div className="mb-4">
        <p><strong>Fabric Preferences:</strong> {projectDetails.fabricPreferences}</p>
        <p><strong>Style References:</strong> {projectDetails.styleReferences}</p>
        <p><strong>Quote:</strong> {projectDetails.quote}</p>
        <p><strong>Description:</strong> {projectDetails.notes}</p>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {projectDetails.images?.length > 0 ? (
          projectDetails.images.map((img: any, index: number) => (
            <img
              key={index}
              src={img.imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-40 object-cover rounded shadow"
            />
          ))
        ) : (
          <p>Aucune image trouvée pour ce projet.</p>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(false)}
        className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Fermer
      </button>
    </div>
  </div>
)}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-md w-full        bg-opacity-80">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ajouter un Nouveau Projet</h2>
            <div className="space-y-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border p-2 rounded w-full"
              />

              {/* Fabric Preferences */}
              <input
                type="text"
                placeholder="Fabric Preferences"
                value={newProduct.fabricPreferences}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, fabricPreferences: e.target.value }))
                }
                className="border p-2 rounded w-full"
              />

              {/* Style References */}
              <input
                type="text"
                placeholder="Style References"
                value={newProduct.styleReferences}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, styleReferences: e.target.value }))
                }
                className="border p-2 rounded w-full"
              />

              {/* Quote */}
              <input
                type="number"
                placeholder="Quote"
                value={newProduct.quote}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, quote: e.target.value }))
                }
                className="border p-2 rounded w-full"
              />

              {/* Notes */}
              <textarea
                placeholder="Description"
                value={newProduct.notes}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="border p-2 rounded w-full"
              ></textarea>

              {/* File Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("fileInput")?.click()}
                className="border border-dashed border-gray-400 p-6 rounded text-center cursor-pointer hover:bg-gray-50"
              >
                <FiUpload size={32} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-600">Glissez-déposez des images ici</p>
                <p className="text-xs text-gray-400 mt-1">ou cliquez pour sélectionner</p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAjouterProjet}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Ajout en cours..." : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}