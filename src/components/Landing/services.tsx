import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PackageCheck, Ruler, Truck } from "lucide-react"

const serviceData = [
  {
    icon: <PackageCheck className="w-8 h-8 text-color1" />,
    title: "Créer votre commande",
    description: "Passez votre commande facilement en ligne",
  },
  {
    icon: <Ruler className="w-8 h-8 text-color1" />,
    title: "Mesures par des professionnels",
    description: "Prise de mesures par des tailleurs qualifiés",
  },
  {
    icon: <Truck className="w-8 h-8 text-color1" />,
    title: "Livraison disponible 58 wilayas",
    description: "Nous livrons dans toutes les régions d’Algérie",
  },
]

const Services = () => {
  return (
    <div className="services_items p-4 flex flex-wrap gap-6 justify-center">
      {serviceData.map((service, index) => (
        <Card key={index} className="w-80 flex flex-col items-center text-center shadow-sm border border-gray-200 hover:shadow-lg transition">
          <CardHeader className="flex flex-col items-center w-full gap-2">
            {service.icon}
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <CardDescription className="w-full">{service.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default Services
