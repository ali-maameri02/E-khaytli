import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import avatar from '../../../assets/photo_2025-02-11_00-40-45.png';

export default function Client() {
  // Mock Data
  const profile = {
    name: "Alice Moreau",
    email: "alice.moreau@example.com",
    avatar,
    totalOrders: 7,
  };

  const recentNotifications = [
    { text: "Votre commande CMD123 est en cours de livraison.", type: "info" },
    { text: "Nouvelle offre spéciale pour vous !", type: "success" },
    { text: "Rappel : votre rendez-vous demain à 10h.", type: "warning" },
  ];

  const recentMessages = [
    { sender: "Tailleur Ahmed", message: "Votre costume sera prêt lundi." },
    { sender: "Support", message: "Merci pour votre retour d'expérience." },
  ];

  const recommendedAds = [
    {
      title: "Costume sur mesure",
      description: "Profitez de -20% cette semaine seulement.",
      image: "https://img.freepik.com/premium-photo/young-arab-man-tailor-smiling-confident-holding-scissors-tailor-shop_839833-3458.jpg?uid=R86882355&ga=GA1.1.597779631.1744929923&semt=ais_items_boosted&w=740",
    },
    {
      title: "Robe de mariée personnalisée",
      description: "Dessinez votre robe idéale avec notre styliste.",
      image: "https://img.freepik.com/free-photo/teenage-girl-holding-birthday-gifts_23-2148478026.jpg?uid=R86882355&ga=GA1.1.597779631.1744929923&semt=ais_items_boosted&w=740",
    },
  ];

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Bienvenue, {profile.name.split(" ")[0]}
      </motion.h1>

      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Mon Profil</h2>
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <Badge variant="secondary" style={{color:'blue',fontWeight:'bold'}} className="mt-2 flex flex-row w-full  justify-center items-center bg-blue-200 p-5 px-12  shadow-md border-0">
            <span>{profile.totalOrders}</span> <p className="bold" >commandes</p>
          </Badge>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Dernières Notifications</h2>
          <ul className="space-y-3">
            {recentNotifications.map((note, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span
                  className={`mt-1.5 inline-block w-3 h-3 rounded-full ${
                    note.type === "info"
                      ? "bg-blue-500"
                      : note.type === "success"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                <span className="text-sm text-gray-700">{note.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Messages */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Derniers Messages</h2>
          <ul className="space-y-4">
            {recentMessages.map((msg, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    {msg.sender}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Recommended Ads */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Nos recommandations pour vous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedAds.map((ad, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{ad.title}</h3>
                  <p className="text-sm text-gray-600">{ad.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}