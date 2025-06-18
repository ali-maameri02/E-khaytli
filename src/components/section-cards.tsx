import { motion } from "framer-motion"

export function SectionCards() {
  const cards = [
    {
      title: "New Orders",
      value: "12",
      bgColor: "bg-white text-blue-800",
      hoverBg: "hover:bg-blue-200",
    },
    {
      title: "Pending Tasks",
      value: "5",
      bgColor: "bg-white text-yellow-800",
      hoverBg: "hover:bg-yellow-200",
    },
    {
      title: "Clients",
      value: "34",
      bgColor: "bg-white text-green-800",
      hoverBg: "hover:bg-green-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-6 rounded-lg shadow-md ${card.bgColor} ${card.hoverBg} cursor-pointer transition-all duration-300`}
        >
          <h3 className="text-sm uppercase tracking-wide">{card.title}</h3>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
        </motion.div>
      ))}
    </div>
  )
}