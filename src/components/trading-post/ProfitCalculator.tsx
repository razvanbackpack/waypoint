import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CoinDisplay } from './PriceDisplay';
import { calculateTradingProfit } from '@/api/types/commerce';

export function ProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');

  const buyPriceCopper = parseInt(buyPrice) || 0;
  const sellPriceCopper = parseInt(sellPrice) || 0;

  const profit = calculateTradingProfit(buyPriceCopper, sellPriceCopper);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buy Price (copper)</label>
            <Input
              type="number"
              placeholder="0"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sell Price (copper)</label>
            <Input
              type="number"
              placeholder="0"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {buyPriceCopper > 0 && sellPriceCopper > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Revenue after fees (15%)
              </span>
              <CoinDisplay copper={profit.revenueAfterFees} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Profit per item</span>
              <div className="flex items-center gap-2">
                <CoinDisplay
                  copper={Math.abs(profit.profitPerItem)}
                  className={
                    profit.isProfitable ? 'text-success' : 'text-destructive'
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ROI</span>
              <span
                className={`font-semibold font-mono ${
                  profit.isProfitable ? 'text-success' : 'text-destructive'
                }`}
              >
                {profit.profitMarginPercent.toFixed(2)}%
              </span>
            </div>
            {!profit.isProfitable && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive">
                  This trade would result in a loss!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
          <p className="font-medium mb-1">Trading Post Fees:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>5% listing fee (applied when you list)</li>
            <li>10% exchange fee (applied when sold)</li>
            <li>Total: 15% of sale price</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
