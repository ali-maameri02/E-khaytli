import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import logokhaytli from '../../assets/logo_khaytli-removebg-preview.png'

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 mt-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logokhaytli} alt="E_khaytli Logo" className="w-24 h-24" />
            <span className="text-xl font-bold">E_khaytli</span>
          </div>
          <p className="text-sm">Votre plateforme de couture en ligne, facile et rapide.</p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Navigation</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-color1">Accueil</a></li>
            <li><a href="/tailors" className="hover:text-color1">Tailors</a></li>
            <li><a href="/categories" className="hover:text-color1">Catégories</a></li>
            <li><a href="/about" className="hover:text-color1">Qui nous sommes ?</a></li>
            <li><a href="/contact" className="hover:text-color1">Contactez-nous</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Nos Services</h3>
          <ul className="space-y-1 text-sm">
            <li>Création de commande</li>
            <li>Mesures professionnelles</li>
            <li>Livraison dans 58 wilayas</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <p className="text-sm mb-2">contact@e_khaytli.dz</p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-color1"><FaFacebook /></a>
            <a href="#" className="hover:text-color1"><FaInstagram /></a>
            <a href="#" className="hover:text-color1"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-4 text-sm bg-white border-t border-gray-300">
        © {new Date().getFullYear()} E_khaytli. Tous droits réservés.
      </div>
    </footer>
  );
}
