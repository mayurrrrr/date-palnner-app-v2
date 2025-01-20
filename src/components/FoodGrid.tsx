import { motion } from 'framer-motion';

interface FoodOption {
  id: string;
  name: string;
  image: string;
}

interface FoodGridProps {
  options: FoodOption[];
  onSelect: (option: FoodOption) => void;
  selected?: string;
}

export function FoodGrid({ options, onSelect, selected }: FoodGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`
            cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-200
            ${selected === option.id ? 'ring-4 ring-pink-500 ring-offset-2' : 'hover:shadow-lg'}
          `}
          onClick={() => onSelect(option)}
        >
          <div className="relative aspect-square">
            <img
              src={option.image}
              alt={option.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-3 left-3 text-white font-medium text-lg">
              {option.name}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}