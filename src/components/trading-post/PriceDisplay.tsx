import type { CommercePrice } from '@/api/types/commerce';

interface PriceDisplayProps {
  price: CommercePrice;
  className?: string;
}

interface CoinDisplayProps {
  copper: number;
  className?: string;
}

export function CoinDisplay({ copper, className = '' }: CoinDisplayProps) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {gold > 0 && (
        <span className="inline-flex items-center text-coin-gold">
          <span className="font-semibold font-mono">
            {gold}
          </span>
          <span className="text-xs ml-0.5">
            g
          </span>
        </span>
      )}
      {silver > 0 && (
        <span className="inline-flex items-center text-coin-silver">
          <span className="font-semibold font-mono">
            {silver}
          </span>
          <span className="text-xs ml-0.5">
            s
          </span>
        </span>
      )}
      {(remainingCopper > 0 || (gold === 0 && silver === 0)) && (
        <span className="inline-flex items-center text-coin-copper">
          <span className="font-semibold font-mono">
            {remainingCopper}
          </span>
          <span className="text-xs ml-0.5">
            c
          </span>
        </span>
      )}
    </span>
  );
}

export function PriceDisplay({ price, className = '' }: PriceDisplayProps) {
  if (!price.whitelisted) {
    return (
      <div className={className}>
        <p className="text-muted-foreground text-sm">Not tradeable</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Buy Price</div>
        <div className="flex flex-col">
          <CoinDisplay copper={price.buys.unit_price} />
          <div className="text-xs text-muted-foreground mt-0.5">
            {price.buys.quantity.toLocaleString()} available
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Sell Price</div>
        <div className="flex flex-col">
          <CoinDisplay copper={price.sells.unit_price} />
          <div className="text-xs text-muted-foreground mt-0.5">
            {price.sells.quantity.toLocaleString()} available
          </div>
        </div>
      </div>
    </div>
  );
}
