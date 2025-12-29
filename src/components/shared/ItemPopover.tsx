import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { Item } from '@/api/types';

const getRarityClass = (rarity: string) => `rarity-${rarity.toLowerCase()}`;

interface ItemPopoverProps {
  item: Item;
  statName?: string;
  count?: number;
  stats?: Record<string, number>;
  upgrades?: Item[];
  infusions?: Item[];
  children: React.ReactNode;
}

const ATTRIBUTE_NAMES: Record<string, string> = {
  Power: 'Power',
  Precision: 'Precision',
  Toughness: 'Toughness',
  Vitality: 'Vitality',
  Ferocity: 'Ferocity',
  CritDamage: 'Ferocity',
  ConditionDamage: 'Condition Damage',
  ConditionDuration: 'Expertise',
  Healing: 'Healing Power',
  HealingPower: 'Healing Power',
  BoonDuration: 'Concentration',
  Concentration: 'Concentration',
  Expertise: 'Expertise',
  AgonyResistance: 'Agony Resistance',
};

const parseGW2Text = (text: string): string => {
  return text
    .replace(/<c=@[^>]+>/g, '')
    .replace(/<\/c>/g, '')
    .replace(/<br>/g, '\n');
};

export function ItemPopover({ item, statName, count, stats, upgrades, infusions, children }: ItemPopoverProps) {
  const rarityClass = getRarityClass(item.rarity);
  const itemStats = stats || item.details?.infix_upgrade?.attributes;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-start gap-3 p-3 bg-muted/30">
          {item.icon && (
            <img
              src={item.icon}
              alt={item.name}
              className={`w-12 h-12 rounded border-2 flex-shrink-0 ${rarityClass} rarity-border`}
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-base leading-tight ${rarityClass} rarity-text`}>
              {item.name}
            </h4>
            {statName && (
              <p className="text-sm text-muted-foreground">{statName}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{item.rarity}</span>
              {item.level > 0 && <span>• Level {item.level}</span>}
              {count && count > 1 && <span>• x{count}</span>}
            </div>
          </div>
        </div>

        {itemStats && (Array.isArray(itemStats) ? itemStats.length > 0 : Object.keys(itemStats).length > 0) && (
          <div className="px-3 py-2 border-t border-border/50 space-y-0.5">
            {Array.isArray(itemStats) ? (
              itemStats.map((attr: { attribute: string; modifier: number }, idx: number) => (
                <div key={idx} className="text-sm">
                  <span className="text-success font-mono">+{attr.modifier}</span>
                  <span className="text-muted-foreground ml-1.5">{ATTRIBUTE_NAMES[attr.attribute] || attr.attribute}</span>
                </div>
              ))
            ) : (
              Object.entries(itemStats).map(([attr, value], idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-success font-mono">+{value}</span>
                  <span className="text-muted-foreground ml-1.5">{ATTRIBUTE_NAMES[attr] || attr}</span>
                </div>
              ))
            )}
          </div>
        )}

        {upgrades && upgrades.length > 0 && (
          <div className="px-3 py-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Upgrades</p>
            <div className="space-y-1.5">
              {upgrades.map((upgrade, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <img src={upgrade.icon} alt={upgrade.name} className="w-5 h-5 rounded" />
                  <span className={`text-sm ${getRarityClass(upgrade.rarity)} rarity-text`}>{upgrade.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {infusions && infusions.length > 0 && (
          <div className="px-3 py-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Infusions</p>
            <div className="space-y-1.5">
              {infusions.map((infusion, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <img src={infusion.icon} alt={infusion.name} className="w-5 h-5 rounded" />
                  <span className={`text-sm ${getRarityClass(infusion.rarity)} rarity-text`}>{infusion.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {item.description && (
          <div className="px-3 py-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground whitespace-pre-line">{parseGW2Text(item.description)}</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
