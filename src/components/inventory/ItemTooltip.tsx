import { useItem, useTradingPostPrice } from '@/api/hooks/useGW2Api';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { TradingPostPrice } from '@/api/types';

interface ItemTooltipProps {
  itemId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Rarity class mapping for CSS-based styling
const rarityClasses: Record<string, string> = {
  Junk: 'rarity-junk',
  Basic: 'rarity-basic',
  Fine: 'rarity-fine',
  Masterwork: 'rarity-masterwork',
  Rare: 'rarity-rare',
  Exotic: 'rarity-exotic',
  Ascended: 'rarity-ascended',
  Legendary: 'rarity-legendary',
};

export function ItemTooltip({ itemId, open, onOpenChange }: ItemTooltipProps) {
  const { data: item, isLoading: itemLoading } = useItem(itemId, {
    enabled: open && !!itemId,
  });

  const { data: price, isLoading: priceLoading } = useTradingPostPrice(itemId, {
    enabled: open && !!itemId,
  }) as { data: TradingPostPrice | undefined; isLoading: boolean };

  if (!open) return null;

  const rarityClass = item ? (rarityClasses[item.rarity] || 'rarity-junk') : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md shadow-xl animate-in fade-in-0 duration-150">
        {itemLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : item ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                {item.icon && (
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt={item.name}
                    className={`w-12 h-12 rounded border-2 ${rarityClass} border-rarity`}
                  />
                )}
                <div className="flex-1">
                  <DialogTitle
                    className={`text-lg ${rarityClass} text-rarity`}
                  >
                    {item.name}
                  </DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    {item.rarity} {item.type}
                    {item.level > 0 && ` • Level ${item.level}`}
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}

              {item.details?.infix_upgrade && (
                <div className="border-t pt-3">
                  <div className="text-xs font-semibold mb-2">Stats</div>
                  <div className="space-y-1">
                    {item.details.infix_upgrade.attributes.map((attr: { attribute: string; modifier: number }, idx: number) => (
                      <div key={idx} className="text-sm">
                        +{attr.modifier} {attr.attribute}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(() => {
                const upgrades = item.details?.upgrades as number[] | undefined;
                const infusions = item.details?.infusions as number[] | undefined;
                const hasModifications = (upgrades && upgrades.length > 0) || (infusions && infusions.length > 0);

                if (!hasModifications) return null;

                return (
                  <div className="border-t pt-3">
                    <div className="text-xs font-semibold mb-2">Modifications</div>
                    {upgrades && upgrades.length > 0 && (
                      <div className="text-sm">Upgrades: {upgrades.length}</div>
                    )}
                    {infusions && infusions.length > 0 && (
                      <div className="text-sm">Infusions: {infusions.length}</div>
                    )}
                  </div>
                );
              })()}

              {priceLoading ? (
                <div className="border-t pt-3 flex items-center justify-center py-4">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : price?.whitelisted ? (
                <div className="border-t pt-3">
                  <div className="text-xs font-semibold mb-2">Trading Post</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Buy</div>
                      <CoinDisplay copper={price.buys.unit_price} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Sell</div>
                      <CoinDisplay copper={price.sells.unit_price} />
                    </div>
                  </div>
                </div>
              ) : null}

              {item.vendor_value > 0 && (
                <div className="border-t pt-3">
                  <div className="text-xs font-semibold mb-2">Vendor Value</div>
                  <CoinDisplay copper={item.vendor_value} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Item not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
