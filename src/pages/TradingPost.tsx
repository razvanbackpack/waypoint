import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ItemSearch } from '@/components/trading-post/ItemSearch';
import { PriceDisplay, CoinDisplay } from '@/components/trading-post/PriceDisplay';
import { ProfitCalculator } from '@/components/trading-post/ProfitCalculator';
import { Watchlist, useWatchlist } from '@/components/trading-post/Watchlist';
import { useTradingPostPrice, useTradingPostListing } from '@/api/hooks/useGW2Api';
import { Star, TrendingUp, TrendingDown, Search } from 'lucide-react';
import type { Item } from '@/api/types';
import type { CommercePrice, CommerceListing } from '@/api/types/commerce';

export function TradingPost() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { addToWatchlist } = useWatchlist();

  const { data: price, isLoading: priceLoading } = useTradingPostPrice(
    selectedItem?.id || 0,
    {
      enabled: !!selectedItem,
    }
  ) as { data: CommercePrice | undefined; isLoading: boolean };

  const { data: listing, isLoading: listingLoading } = useTradingPostListing(
    selectedItem?.id || 0,
    {
      enabled: !!selectedItem,
    }
  ) as { data: CommerceListing | undefined; isLoading: boolean };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleAddToWatchlist = (itemId: number) => {
    addToWatchlist(itemId);
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gw2-gold/10 glow-gold-sm">
            <Search className="h-5 w-5 text-gw2-gold" />
          </div>
          <h1 className="text-2xl font-bold heading-accent">Trading Post</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Track prices, calculate profits, and monitor your favorite items on the Black Lion Trading Company
        </p>
      </div>

      {/* Search Section */}
      <Card variant="featured">
        <CardHeader>
          <CardTitle className="text-xl">Item Search</CardTitle>
          <CardDescription>
            Search for items to view their Trading Post prices and market depth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemSearch
            onSelectItem={handleSelectItem}
            onAddToWatchlist={handleAddToWatchlist}
          />
        </CardContent>
      </Card>

      {/* Item Details Section */}
      {selectedItem && (
        <Card variant="interactive" className="animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {selectedItem.icon && (
                  <div className="glow-gold-sm">
                    <img
                      src={selectedItem.icon}
                      alt={selectedItem.name}
                      className={`w-16 h-16 rounded-lg border-3 border-rarity ${rarityClasses[selectedItem.rarity] || 'rarity-junk'}`}
                    />
                  </div>
                )}
                <div>
                  <CardTitle
                    className={`text-2xl text-rarity ${rarityClasses[selectedItem.rarity] || 'rarity-junk'}`}
                  >
                    {selectedItem.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {selectedItem.type} • {selectedItem.rarity}
                    {selectedItem.level > 0 && ` • Level ${selectedItem.level}`}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToWatchlist(selectedItem.id)}
                className="hover:bg-gw2-gold/10 hover:text-gw2-gold hover:border-gw2-gold transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedItem.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {selectedItem.description}
              </p>
            )}

            <Tabs defaultValue="prices" className="w-full">
              <TabsList>
                <TabsTrigger value="prices">Prices</TabsTrigger>
                <TabsTrigger value="depth">Market Depth</TabsTrigger>
              </TabsList>

              <TabsContent value="prices" className="space-y-4">
                {priceLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="space-y-3 text-center">
                      <div className="animate-spin h-10 w-10 border-4 border-gw2-gold border-t-transparent rounded-full mx-auto" />
                      <p className="text-sm text-muted-foreground">Loading price data...</p>
                    </div>
                  </div>
                ) : price ? (
                  <div className="space-y-4">
                    <PriceDisplay price={price} />

                    {price.whitelisted && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gw2-gold/20">
                        <div className="space-y-2 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                          <div className="text-sm font-medium text-muted-foreground">Instant Buy Cost</div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-red-500" />
                            <div className="text-lg font-bold">
                              <CoinDisplay copper={price.sells.unit_price} />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Buy instantly from lowest seller
                          </div>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                          <div className="text-sm font-medium text-muted-foreground">Instant Sell Revenue</div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-green-500" />
                            <div className="text-lg font-bold">
                              <CoinDisplay
                                copper={Math.floor(price.buys.unit_price * 0.85)}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sell instantly to highest buyer (after 15% fees)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No price data available</p>
                    <p className="text-sm mt-2">This item may not be tradeable on the Trading Post</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="depth" className="space-y-4">
                {listingLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="space-y-3 text-center">
                      <div className="animate-spin h-10 w-10 border-4 border-gw2-gold border-t-transparent rounded-full mx-auto" />
                      <p className="text-sm text-muted-foreground">Loading market depth...</p>
                    </div>
                  </div>
                ) : listing ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg text-green-500">
                          Buy Orders
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {listing.buys.length} total
                        </span>
                      </div>
                      <div className="rounded-lg border border-green-500/20 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-green-500/5">
                              <TableHead className="text-green-500">Price</TableHead>
                              <TableHead className="text-green-500">Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {listing.buys.slice(0, 10).map((buy, index) => (
                              <TableRow key={index} className="hover:bg-green-500/5 transition-colors">
                                <TableCell className="font-medium">
                                  <CoinDisplay copper={buy.unit_price} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {buy.quantity.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg text-red-500">
                          Sell Listings
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {listing.sells.length} total
                        </span>
                      </div>
                      <div className="rounded-lg border border-red-500/20 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-red-500/5">
                              <TableHead className="text-red-500">Price</TableHead>
                              <TableHead className="text-red-500">Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {listing.sells.slice(0, 10).map((sell, index) => (
                              <TableRow key={index} className="hover:bg-red-500/5 transition-colors">
                                <TableCell className="font-medium">
                                  <CoinDisplay copper={sell.unit_price} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {sell.quantity.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No market depth data available</p>
                    <p className="text-sm mt-2">This item may not be tradeable on the Trading Post</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gw2-gold">Profit Calculator</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Calculate potential profits after Trading Post fees
          </p>
          <ProfitCalculator />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gw2-gold">Watchlist</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Monitor your favorite items and track price changes
          </p>
          <Watchlist />
        </div>
      </div>
    </div>
  );
}
