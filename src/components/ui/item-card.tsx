import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface ItemCardProps {
  item: {
    id: number
    name: string
    icon?: string
    rarity: string
    count?: number
    vendor_value?: number
  }
  showPrice?: boolean
  showCount?: boolean
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  className?: string
}

const getRarityClass = (rarity: string) => {
  return `rarity-${rarity.toLowerCase()}`
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-18 h-18",
}

const isRareOrAbove = (rarity: string) => {
  const rarityLower = rarity.toLowerCase()
  return ["rare", "exotic", "ascended", "legendary"].includes(rarityLower)
}

function ItemCard({
  item,
  showPrice = false,
  showCount = true,
  size = "md",
  onClick,
  className,
}: ItemCardProps) {
  const rarityClass = getRarityClass(item.rarity)
  const shouldGlow = isRareOrAbove(item.rarity)

  return (
    <div
      className={cn(
        "item-slot relative overflow-hidden transition-all duration-200",
        rarityClass,
        sizeClasses[size],
        onClick && "cursor-pointer",
        shouldGlow && "hover:scale-105 hover:glow-rarity",
        !shouldGlow && onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${item.name}` : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {item.icon ? (
        <img
          src={item.icon}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          <svg
            className="h-1/2 w-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {showCount && item.count && item.count > 1 && (
        <Badge
          variant="secondary"
          className="absolute bottom-0.5 right-0.5 h-5 min-w-5 px-1 py-0 text-xs font-bold"
        >
          {item.count}
        </Badge>
      )}

      {showPrice && item.vendor_value && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5 text-center text-xs text-white">
          {item.vendor_value}
        </div>
      )}
    </div>
  )
}

export { ItemCard }
