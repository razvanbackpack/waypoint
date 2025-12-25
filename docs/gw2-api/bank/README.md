# Bank & Material Storage

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Bank](https://wiki.guildwars2.com/wiki/API:2/account/bank) | [Materials](https://wiki.guildwars2.com/wiki/API:2/account/materials)

## 1. Overview
Bank and material storage endpoints for managing account-wide inventory.

## 2. /v2/account/bank
**Requires: account, inventories scopes**

Returns array of bank slots (null for empty slots).

### Item Object Fields
| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID (resolve via /v2/items) |
| count | number | Stack quantity |
| charges | number | Remaining charges (optional) |
| skin | number | Applied skin ID (optional) |
| dyes | array | Applied dye IDs (optional) |
| upgrades | array | Rune/sigil item IDs (optional) |
| upgrade_slot_indices | array | Slot positions for upgrades (optional) |
| infusions | array | Infusion item IDs (optional) |
| binding | string | "Account" or "Character" (optional) |
| bound_to | string | Character name if character-bound (optional) |
| stats | object | Selected stats for stat-selectable items (optional) |

### Stats Object
- id: ItemStat ID (resolve via /v2/itemstats)
- attributes: Object with stat values (Power, Precision, Toughness, Vitality, ConditionDamage, ConditionDuration, Healing, BoonDuration, CritDamage, AgonyResistance)

### Example Response
```json
[
  null,
  {
    "id": 46762,
    "count": 1,
    "skin": 4567,
    "upgrades": [24615],
    "binding": "Account"
  },
  {
    "id": 46763,
    "count": 1,
    "infusions": [49428, 49428],
    "stats": {
      "id": 161,
      "attributes": {
        "Power": 141,
        "Precision": 101,
        "CritDamage": 101
      }
    },
    "binding": "Account"
  },
  null,
  {
    "id": 12134,
    "count": 250
  }
]
```

### Notes
- Bank size depends on purchased bank tabs (30 slots per tab, up to 21 tabs = 630 slots max)
- Array index = slot position
- null = empty slot

## 3. /v2/account/materials
**Requires: account, inventories scopes**

Returns ALL materials, even those with count of 0.

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID (resolve via /v2/items) |
| category | number | Material category (resolve via /v2/materials) |
| binding | string | "Account" if bound (optional) |
| count | number | Quantity stored |

### Example Response
```json
[
  { "id": 12134, "category": 5, "count": 250 },
  { "id": 12238, "category": 5, "count": 0 },
  { "id": 12147, "category": 29, "count": 47, "binding": "Account" }
]
```

### Notes
- Material storage holds up to 2000 of each material (expandable to 2500)
- Returns every material slot, including empty ones (count: 0)

## 4. /v2/materials
**No authentication required**

Material category definitions.

### Response Fields
- id: Category ID
- name: Category name (e.g., "Cooking Materials", "Fine Crafting Materials")
- items: Array of item IDs in this category
- order: Display order

### Example
```json
{
  "id": 5,
  "name": "Cooking Materials",
  "items": [12134, 12238, 12147, ...],
  "order": 0
}
```

## 5. /v2/account/inventory
**Requires: account, inventories scopes**

Shared inventory slots (account-wide slots at top of inventory).

Returns array of items or null for empty slots. Same item structure as bank.

## 6. Common Use Cases

### Fetching Full Bank with Item Details
```typescript
// Get bank contents
const bank = await fetch('/v2/account/bank?access_token=KEY').then(r => r.json());

// Get unique item IDs (filter nulls)
const itemIds = [...new Set(bank.filter(Boolean).map(item => item.id))];

// Fetch item details (batch up to 200)
const items = await fetch(`/v2/items?ids=${itemIds.join(',')}`).then(r => r.json());
```

### Calculating Total Material Value
```typescript
const materials = await fetch('/v2/account/materials?access_token=KEY').then(r => r.json());
const nonEmpty = materials.filter(m => m.count > 0);
const itemIds = nonEmpty.map(m => m.id);

// Get TP prices
const prices = await fetch(`/v2/commerce/prices?ids=${itemIds.join(',')}`).then(r => r.json());

// Calculate total sell value
const totalValue = nonEmpty.reduce((sum, mat) => {
  const price = prices.find(p => p.id === mat.id);
  return sum + (price?.sells?.unit_price || 0) * mat.count;
}, 0);
```

## 7. Related Endpoints
- /v2/items - Item details
- /v2/itemstats - Stat combination definitions
- /v2/skins - Skin details
- /v2/colors - Dye color details
- /v2/commerce/prices - Trading post prices
