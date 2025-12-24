import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "featured" | "compact"
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"

  return (
    <Card
      className={cn(
        "flex",
        isFeatured && "card-featured",
        isCompact
          ? "flex-row items-center gap-3 py-3"
          : "flex-col items-start gap-4",
        className
      )}
    >
      {/* Icon & Value Section */}
      <div
        className={cn(
          "flex items-center gap-3",
          isCompact ? "flex-row" : "flex-col items-start w-full"
        )}
      >
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-lg",
              isCompact
                ? "h-10 w-10 bg-primary/10 text-primary"
                : "h-12 w-12 bg-primary/10 text-primary"
            )}
          >
            {icon}
          </div>
        )}

        <div className={cn("flex flex-col", isCompact ? "gap-0" : "gap-2")}>
          {/* Value */}
          <div
            className={cn(
              "stat-value",
              isCompact && "text-2xl",
              !isCompact && "text-4xl"
            )}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>

          {/* Title */}
          <div className="stat-label">{title}</div>
        </div>
      </div>

      {/* Subtitle & Trend Section */}
      {(subtitle || trend) && (
        <div
          className={cn(
            "flex items-center gap-2",
            isCompact ? "ml-auto" : "w-full"
          )}
        >
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value.toLocaleString()}
              </span>
            </div>
          )}

          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
    </Card>
  )
}
