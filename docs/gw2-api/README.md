# Guild Wars 2 API Documentation

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki API Documentation](https://wiki.guildwars2.com/wiki/API:Main)

---

## Overview

The Guild Wars 2 API provides programmatic access to game data and account information.

- **Base URL:** `https://api.guildwars2.com/v2`
- **API Version:** 2
- **Response Format:** JSON
- **Official Documentation:** https://wiki.guildwars2.com/wiki/API:Main

---

## Authentication

API keys are required for accessing account-specific data. Public endpoints (items, achievements, etc.) do not require authentication.

### Creating an API Key

1. Visit https://account.arena.net/applications
2. Generate a new application key
3. Select appropriate permissions (scopes)
4. Maximum of **200 keys** per account

### Using API Keys

There are two methods to authenticate requests:

#### 1. Authorization Header (Preferred for Server-Side)
```
Authorization: Bearer <API_KEY>
```

#### 2. Query Parameter (Required for Browser/CORS)
```
?access_token=<API_KEY>
```

**Important for Web Apps:** Due to CORS restrictions in browsers, the query parameter method is recommended for client-side web applications. The Authorization header method is blocked by browser CORS policies.

### API Key Scopes

API keys can have various permission scopes:
- `account` - Basic account information
- `inventories` - Character inventories and bank
- `characters` - Character names and basic info
- `tradingpost` - Trading Post transactions
- `wallet` - Account wallet currencies
- `unlocks` - Skins, dyes, recipes unlocked
- `pvp` - PvP stats and games
- `builds` - Character builds and equipment
- `progression` - Achievements, masteries, titles
- `guilds` - Guild membership and details

---

## Rate Limits

The API implements a token bucket rate limiting system:

- **Max Burst Size:** 300 requests
- **Refill Rate:** 5 tokens/second (300 requests/minute)
- **Limit Reset:** Tokens refill continuously at 5/second

### Rate Limit Headers

Responses include rate limit information in headers:
- `X-Rate-Limit-Limit` - Maximum bucket size (300)
- `X-Rate-Limit-Remaining` - Tokens remaining
- `X-Retry-After` - Seconds until retry (when rate limited)

### Handling Rate Limits

When you exceed the rate limit, you'll receive:
- **HTTP 429** - Too Many Requests
- **Retry-After** header indicating wait time

**Tip:** With a 300-burst capacity and 5/sec refill rate, you can maintain a steady stream of requests at ~4-5 requests/second without hitting rate limits.

---

## Request Parameters

### Common Parameters

#### `lang` - Localization
Specify response language (default: `en`)
- **Supported:** `en`, `es`, `de`, `fr`, `zh`
- **Example:** `?lang=de`

#### `ids` - Bulk Requests
Request multiple resources by ID
- **Format:** Comma-separated list or `all`
- **Limit:** Up to **200 IDs** per request
- **Example:** `?ids=1,2,3,4,5`
- **Example:** `?ids=all` (returns all available IDs)

#### `page` and `page_size` - Pagination
Navigate through large result sets
- **`page`:** Zero-indexed page number (default: 0)
- **`page_size`:** Results per page (default: varies, max: 200)
- **Example:** `?page=0&page_size=50`

#### `v` - Schema Version
Request specific schema version (advanced usage)
- **Format:** ISO 8601 datetime or `latest`
- **Default:** Latest version
- **Example:** `?v=2024-01-15T00:00:00Z`

---

## HTTP Response Codes

### Success Codes

- **200 OK** - Request successful
- **206 Partial Content** - Some requested IDs were invalid (bulk requests)

### Client Error Codes

- **400 Bad Request** - Invalid parameters
- **403 Forbidden** - Missing, invalid, or insufficient API key permissions
- **404 Not Found** - Endpoint or resource doesn't exist
- **429 Too Many Requests** - Rate limit exceeded

### Server Error Codes

- **502 Bad Gateway** - Invalid upstream response from game servers
- **503 Service Unavailable** - Endpoint temporarily disabled
- **504 Gateway Timeout** - Request to game servers timed out

---

## Best Practices

### 1. Batch Requests

**Do:** Combine multiple ID requests into a single call
```
GET /v2/items?ids=1,2,3,4,5
```

**Don't:** Make individual requests for each ID
```
GET /v2/items/1
GET /v2/items/2
GET /v2/items/3
```

You can request up to **200 IDs** in a single request, significantly reducing API calls.

### 2. Handle Enum Values Gracefully

The API may add new enum values without incrementing the schema version. Always handle unknown enum values gracefully:

```typescript
// Good
const type = item.type || 'Unknown';

// Bad
const validTypes = ['Armor', 'Weapon', 'Trinket'];
if (!validTypes.includes(item.type)) {
  throw new Error('Invalid type');
}
```

### 3. Implement Retry Logic

Occasional "Invalid key" errors can occur due to temporary issues. Implement exponential backoff retry logic:

```typescript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 403 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 4. Cache Responses

Static data (items, achievements, etc.) rarely changes. Implement caching:

- **Short-lived data** (prices, listings): Cache for 1-5 minutes
- **Semi-static data** (account, characters): Cache for 5-15 minutes
- **Static data** (items, skills): Cache for hours or days

### 5. Respect Rate Limits

- Monitor `X-Rate-Limit-Remaining` header
- Implement client-side rate limiting
- Use queuing for burst requests
- Spread requests over time when possible

### 6. Use Bulk Endpoints

Many endpoints support bulk operations:
- `/v2/items?ids=all` - Get all items
- `/v2/skins?ids=all` - Get all skins
- `/v2/recipes?ids=all` - Get all recipes

### 7. Handle Partial Responses

When using bulk requests, some IDs may be invalid. The API returns:
- **HTTP 206** status code
- Valid items in response
- `X-Result-Count` and `X-Result-Total` headers showing actual vs requested count

---

## Documentation Index

This documentation is organized into the following sections:

### Core API Concepts

- **[authentication/](authentication/)** - API key management, scopes, and authentication methods
- **[rate-limiting/](rate-limiting/)** - Detailed rate limit mechanics and strategies

### Account & Characters

- **[account/](account/)** - Account information, wallet, banks, materials, unlocks
- **[characters/](characters/)** - Character details, equipment, inventory, builds, skills

### Economy & Trading

- **[commerce/](commerce/)** - Trading Post prices, listings, transactions, deliveries
- **[items/](items/)** - Item details, stats, skins, recipes, materials

### Storage & Inventory

- **[bank/](bank/)** - Bank slots, material storage, shared inventory
- **[wizards-vault/](wizards-vault/)** - Wizard's Vault daily/weekly objectives and rewards

### Game Content

- **[game-mechanics/](game-mechanics/)** - Skills, traits, specializations, professions
- **[world/](world/)** - Maps, continents, floors, points of interest, dungeons, raids

### Competitive Content

- **[pvp/](pvp/)** - Structured PvP stats, seasons, standings, games
- **[wvw/](wvw/)** - World vs World abilities, matches, objectives

### Social Features

- **[guild/](guild/)** - Guild information, members, upgrades, log, treasury

---

## Recent API Changes (2024-2025)

### Major Updates

#### 2024 Updates

**Wizard's Vault (November 2024)**
- New `/v2/wizardsvault` endpoints added
- Daily and weekly objective tracking
- Reward tiers and listings
- Special objective system

**Legendary Armory Updates**
- Expanded legendary item tracking
- New legendary weapon generation support
- Improved account-wide legendary management

**Trading Post Enhancements**
- Improved reliability for `/v2/commerce/listings`
- Better handling of high-volume items
- More consistent price update intervals

#### 2025 Updates

**Achievement System Improvements**
- New achievement categories for recent content
- Updated group structure
- Historical achievement tracking
- Better progress reporting for repeatable achievements

**Character Build Templates**
- Enhanced `/v2/characters/:id/buildtabs` endpoint
- Better equipment template support
- Improved build storage and retrieval

**API Stability Improvements**
- Reduced 502/504 error rates
- Better handling of game server maintenance
- More consistent response times

### Deprecated Features

**Legacy v1 API**
- The v1 API remains deprecated (since 2015)
- All new development should use v2 endpoints
- No new features added to v1

### Upcoming Changes

The API team has indicated potential future additions:
- Enhanced guild hall decoration tracking
- Expanded build template features
- Improved real-time event tracking
- Additional PvP/WvW statistics

**Note:** Always check the official [API Changelog](https://wiki.guildwars2.com/wiki/API:Changelog) for the most recent updates.

---

## Additional Resources

### Official Resources

- **API Main Page:** https://wiki.guildwars2.com/wiki/API:Main
- **API Changelog:** https://wiki.guildwars2.com/wiki/API:Changelog
- **API Key Management:** https://account.arena.net/applications
- **Community Forum:** https://en-forum.guildwars2.com/forum/community/api

### Unofficial Tools

- **GW2 API Explorer:** https://api.guildwars2.com/v2
- **GW2 Efficiency:** https://gw2efficiency.com
- **GW2Treasures:** https://gw2treasures.com

### Community Libraries

Popular language-specific API clients:
- **JavaScript/TypeScript:** Various npm packages
- **Python:** `gw2api`, `GuildWars2-API-Client`
- **C#:** `Gw2Sharp`, `GW2.NET`
- **Java:** `gw2-api-client`
- **Go:** `gw2api`

---

## Support & Contributing

### Getting Help

If you encounter issues with the API:

1. Check the [API Status](https://help.guildwars2.com/hc/en-us/articles/360014017833) page
2. Review existing [forum discussions](https://en-forum.guildwars2.com/forum/community/api)
3. Ask in the community API forum

### Reporting Issues

For API bugs or issues:
- Post in the official API forum
- Include endpoint URL, parameters, and error response
- Specify time of occurrence (for server-side issues)

### Contributing to Documentation

This documentation is maintained as part of the GW2 Companion project. Contributions welcome!

---

**Happy Coding!** 🎮
