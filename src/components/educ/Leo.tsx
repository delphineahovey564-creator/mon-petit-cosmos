import { motion } from "framer-motion";

type Props = { size?: number; className?: string; float?: boolean };

/**
 * Lion mascot placeholder. Swap the <img src> for /src/assets/lion.png when ready.
 */
export function Leo({ size = 90, className = "", float = false }: Props) {
  const img = (
    <img
      src={`https://placehold.co/${size * 2}x${size * 2}/FFB347/ffffff?text=%F0%9F%A6%81&font=roboto`}
      alt="Léo le lion"
      width={size}
      height={size}
      className={`rounded-2xl object-cover select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
  if (!float) return img;
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      {img}
    </motion.div>
  );
}