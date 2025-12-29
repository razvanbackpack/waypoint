# Guild Endpoints

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Guild](https://wiki.guildwars2.com/wiki/API:2/guild/:id)

---

## 1. /v2/guild/:id

Main guild information endpoint. Public information is available without authentication, while extended information requires authentication with guilds scope and guild membership.

**Authentication:** Optional (required for extended fields)
**Scopes:** guilds (for extended fields, member only)

### Public Fields (no auth)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Guild GUID |
| name | string | Guild name |
| tag | string | 2-4 letter guild tag |
| emblem | object | Emblem design (background, foreground, flags) |

### Extended Fields (guilds scope, member only)

| Field | Type | Description |
|-------|------|-------------|
| level | number | Guild level (1-69) |
| motd | string | Message of the day |
| influence | number | Current influence |
| aetherium | number | Aetherium level |
| favor | number | Favor points |
| resonance | number | Resonance |
| member_count | number | Active member count |
| member_capacity | number | Maximum member capacity |

### Example Response (Public)

```json
{
  "id": "guild-guid-here",
  "name": "Example Guild",
  "tag": "EX",
  "emblem": {
    "background": {
      "id": 1,
      "colors": [128, 64]
    },
    "foreground": {
      "id": 5,
      "colors": [4, 12]
    },
    "flags": []
  }
}
```

### Example Response (Extended)

```json
{
  "id": "guild-guid-here",
  "name": "Example Guild",
  "tag": "EX",
  "level": 69,
  "motd": "Welcome to our guild!",
  "influence": 50000,
  "aetherium": 100,
  "favor": 25000,
  "resonance": 500,
  "member_count": 150,
  "member_capacity": 500,
  "emblem": {
    "background": {
      "id": 1,
      "colors": [128, 64]
    },
    "foreground": {
      "id": 5,
      "colors": [4, 12]
    },
    "flags": []
  }
}
```

---

## 2. /v2/guild/:id/members

Returns the list of all guild members with their details.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of member objects:

| Field | Type | Description |
|-------|------|-------------|
| name | string | Player account name (Player.1234) |
| rank | string | Member's rank name |
| joined | string | ISO-8601 join date (may be null for pre-March 2013 members) |
| wvw_member | boolean | Whether selected for WvW matchmaking (added 2025) |

### Example Response

```json
[
  {
    "name": "Player.1234",
    "rank": "Leader",
    "joined": "2015-07-22T06:18:35.000Z",
    "wvw_member": true
  },
  {
    "name": "Member.5678",
    "rank": "Officer",
    "joined": "2016-03-15T12:30:00.000Z",
    "wvw_member": false
  },
  {
    "name": "Veteran.9012",
    "rank": "Member",
    "joined": null,
    "wvw_member": true
  }
]
```

**Note:** The `joined` field may be `null` for members who joined before March 2013.

---

## 3. /v2/guild/:id/ranks

Returns the guild's rank definitions and permissions.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of rank objects with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Rank identifier |
| order | number | Display order |
| permissions | array | Array of permission strings |
| icon | string | Icon URL/identifier |

### Example Response

```json
[
  {
    "id": "Leader",
    "order": 1,
    "permissions": [
      "Admin",
      "EditRoles",
      "InviteMember",
      "KickMember",
      "EditMOTD"
    ],
    "icon": "https://render.guildwars2.com/..."
  },
  {
    "id": "Officer",
    "order": 2,
    "permissions": [
      "InviteMember",
      "EditMOTD"
    ],
    "icon": "https://render.guildwars2.com/..."
  }
]
```

---

## 4. /v2/guild/:id/log

Returns the guild's activity log. Returns approximately 100 most recent events per type.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| since | Filter events after this event ID |

### Common Fields

All log entries include:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique event ID |
| time | string | ISO-8601 timestamp |
| type | string | Event type |
| user | string | Account name (when applicable) |

### Log Event Types

#### joined
Member joined the guild.

```json
{
  "id": 12345,
  "time": "2025-12-24T10:00:00Z",
  "type": "joined",
  "user": "Player.1234"
}
```

#### invited
Member was invited to the guild.

**Additional Fields:**
- `invited_by` - Account name of inviter

```json
{
  "id": 12346,
  "time": "2025-12-24T10:01:00Z",
  "type": "invited",
  "user": "NewPlayer.5678",
  "invited_by": "Officer.1234"
}
```

#### invite_declined
Guild invite was declined.

**Additional Fields:**
- `declined_by` - Account name (optional)

```json
{
  "id": 12347,
  "time": "2025-12-24T10:02:00Z",
  "type": "invite_declined",
  "user": "Player.9012",
  "declined_by": "Player.9012"
}
```

#### kick
Member was kicked from the guild.

**Additional Fields:**
- `kicked_by` - Account name of kicker

```json
{
  "id": 12348,
  "time": "2025-12-24T10:03:00Z",
  "type": "kick",
  "user": "BadPlayer.3456",
  "kicked_by": "Leader.1234"
}
```

#### rank_change
Member's rank was changed.

**Additional Fields:**
- `changed_by` - Account name who changed rank
- `old_rank` - Previous rank name
- `new_rank` - New rank name

```json
{
  "id": 12349,
  "time": "2025-12-24T10:04:00Z",
  "type": "rank_change",
  "user": "Player.1234",
  "changed_by": "Leader.5678",
  "old_rank": "Member",
  "new_rank": "Officer"
}
```

#### treasury
Items deposited into guild treasury.

**Additional Fields:**
- `item_id` - Item ID
- `count` - Quantity deposited

```json
{
  "id": 12350,
  "time": "2025-12-24T10:05:00Z",
  "type": "treasury",
  "user": "Player.1234",
  "item_id": 19721,
  "count": 100
}
```

#### stash
Guild stash operation (deposit/withdraw/move).

**Additional Fields:**
- `operation` - Operation type: `deposit`, `withdraw`, or `move`
- `item_id` - Item ID
- `count` - Quantity
- `coins` - Coin amount (copper)

```json
{
  "id": 12351,
  "time": "2025-12-24T10:06:00Z",
  "type": "stash",
  "user": "Player.1234",
  "operation": "deposit",
  "item_id": 46762,
  "count": 50,
  "coins": 0
}
```

#### motd
Guild message of the day was changed.

**Additional Fields:**
- `motd` - New message of the day

```json
{
  "id": 12352,
  "time": "2025-12-24T10:07:00Z",
  "type": "motd",
  "user": "Officer.1234",
  "motd": "New event tonight at 8 PM!"
}
```

#### upgrade
Guild upgrade action.

**Additional Fields:**
- `action` - Action type: `queued`, `cancelled`, `completed`, or `sped_up`
- `upgrade_id` - Upgrade ID
- `recipe_id` - Recipe ID (optional)
- `item_id` - Item ID (optional)
- `count` - Quantity (optional)

```json
{
  "id": 12353,
  "time": "2025-12-24T10:08:00Z",
  "type": "upgrade",
  "user": "Leader.1234",
  "action": "queued",
  "upgrade_id": 38,
  "recipe_id": 123,
  "item_id": 19721,
  "count": 50
}
```

#### influence
Influence gained from activity.

**Additional Fields:**
- `activity` - Activity type: `daily_login` or `gifted`
- `participants` - Number of participants
- `total_participants` - Total participants

```json
{
  "id": 12354,
  "time": "2025-12-24T10:09:00Z",
  "type": "influence",
  "user": "Player.1234",
  "activity": "daily_login",
  "participants": 1,
  "total_participants": 150
}
```

#### mission
Guild mission state change.

**Additional Fields:**
- `state` - Mission state: `start`, `success`, or `fail`
- `user` - Account name (starter)
- `influence` - Influence gained (for success)

```json
{
  "id": 12355,
  "time": "2025-12-24T10:10:00Z",
  "type": "mission",
  "state": "success",
  "user": "Leader.1234",
  "influence": 500
}
```

---

## 5. /v2/guild/:id/stash

Returns the guild's stash tabs and their contents.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of stash tab objects. Each tab contains inventory slots similar to account bank format.

### Example Response

```json
[
  {
    "upgrade_id": 1,
    "size": 100,
    "coins": 50000,
    "note": "General Storage",
    "inventory": [
      null,
      {
        "id": 46762,
        "count": 250
      },
      {
        "id": 24,
        "count": 100,
        "binding": "Account"
      }
    ]
  }
]
```

---

## 6. /v2/guild/:id/treasury

Returns items needed for guild upgrades and current progress.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of treasury items:

| Field | Type | Description |
|-------|------|-------------|
| item_id | number | Item ID |
| count | number | Current quantity deposited |
| needed_by | array | Array of upgrade IDs that need this item |

### Example Response

```json
[
  {
    "item_id": 19721,
    "count": 500,
    "needed_by": [38, 44, 51]
  },
  {
    "item_id": 19697,
    "count": 250,
    "needed_by": [38]
  }
]
```

---

## 7. /v2/guild/:id/storage

Returns stored upgrade items (decorations and other guild items).

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of stored items:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| count | number | Quantity stored |

### Example Response

```json
[
  {
    "id": 12345,
    "count": 10
  },
  {
    "id": 67890,
    "count": 5
  }
]
```

---

## 8. /v2/guild/:id/teams

Returns PvP team information for the guild.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns information about the guild's PvP teams, including team composition, members, and statistics.

---

## 9. /v2/guild/:id/upgrades

Returns the list of completed guild upgrade IDs.

**Authentication:** Required
**Scopes:** guilds (guild leader only)

### Response

Returns an array of upgrade IDs that the guild has completed.

### Example Response

```json
[38, 44, 51, 55, 78, 433, 516]
```

---

## 10. Public Guild Endpoints

These endpoints are available without authentication and provide general guild information.

### /v2/guild/permissions

Returns available guild permissions.

**Authentication:** Not required

#### Response

Returns an array of permission objects:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Permission identifier |
| name | string | Human-readable permission name |
| description | string | Permission description |

#### Example Response

```json
[
  {
    "id": "Admin",
    "name": "Administrator",
    "description": "Full administrative rights"
  },
  {
    "id": "EditRoles",
    "name": "Edit Roles",
    "description": "Can modify member ranks and permissions"
  },
  {
    "id": "InviteMember",
    "name": "Invite Member",
    "description": "Can invite new members to the guild"
  }
]
```

---

### /v2/guild/upgrades

Returns the guild upgrade catalog with all available upgrades.

**Authentication:** Not required

#### Response

Returns an array of upgrade objects:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Upgrade ID |
| name | string | Upgrade name |
| description | string | Upgrade description |
| type | string | Upgrade type |
| icon | string | Icon URL |
| build_time | number | Build time in milliseconds |
| required_level | number | Minimum guild level required |
| experience | number | Experience granted |
| prerequisites | array | Required upgrade IDs |
| costs | array | Cost objects (item_id, count) |

#### Example Response

```json
[
  {
    "id": 38,
    "name": "Guild Armorer 1",
    "description": "Unlocks the guild armorer vendor",
    "type": "Unlock",
    "icon": "https://render.guildwars2.com/...",
    "build_time": 0,
    "required_level": 1,
    "experience": 100,
    "prerequisites": [],
    "costs": [
      {
        "type": "Item",
        "item_id": 19721,
        "count": 100
      },
      {
        "type": "Currency",
        "currency_id": 1,
        "count": 1000000
      }
    ]
  }
]
```

---

### /v2/guild/search

Search for guilds by name.

**Authentication:** Not required

#### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| name | Yes | Guild name to search for |

#### Response

Returns an array of guild IDs matching the search query.

#### Example Request

```
GET /v2/guild/search?name=Example Guild
```

#### Example Response

```json
["guild-guid-1", "guild-guid-2", "guild-guid-3"]
```

**Note:** Use the `/v2/guild/:id` endpoint with these IDs to get full guild information.

---

### /v2/emblem

Returns available guild emblem layers (backgrounds and foregrounds).

**Authentication:** Not required

#### Response

Returns emblem layer information:

| Field | Type | Description |
|-------|------|-------------|
| backgrounds | array | Available background designs |
| foregrounds | array | Available foreground designs |

Each emblem layer contains:
- `id` - Layer ID
- `layers` - Layer image URLs

#### Example Response

```json
{
  "backgrounds": [
    {
      "id": 1,
      "layers": ["https://render.guildwars2.com/..."]
    },
    {
      "id": 2,
      "layers": ["https://render.guildwars2.com/..."]
    }
  ],
  "foregrounds": [
    {
      "id": 1,
      "layers": ["https://render.guildwars2.com/..."]
    },
    {
      "id": 2,
      "layers": ["https://render.guildwars2.com/..."]
    }
  ]
}
```

---

## Summary Table

| Endpoint | Auth Required | Scope | Access Level | Description |
|----------|---------------|-------|--------------|-------------|
| `/v2/guild/:id` | Optional | guilds | Public/Member | Basic or extended guild info |
| `/v2/guild/:id/members` | Yes | guilds | Leader only | Guild member list |
| `/v2/guild/:id/ranks` | Yes | guilds | Leader only | Guild rank definitions |
| `/v2/guild/:id/log` | Yes | guilds | Leader only | Guild activity log |
| `/v2/guild/:id/stash` | Yes | guilds | Leader only | Guild stash contents |
| `/v2/guild/:id/treasury` | Yes | guilds | Leader only | Guild treasury items |
| `/v2/guild/:id/storage` | Yes | guilds | Leader only | Stored upgrade items |
| `/v2/guild/:id/teams` | Yes | guilds | Leader only | PvP team info |
| `/v2/guild/:id/upgrades` | Yes | guilds | Leader only | Completed upgrades |
| `/v2/guild/permissions` | No | - | Public | Available permissions |
| `/v2/guild/upgrades` | No | - | Public | Upgrade catalog |
| `/v2/guild/search` | No | - | Public | Search guilds by name |
| `/v2/emblem` | No | - | Public | Emblem layer designs |

---

## Authentication & Scopes

Guild endpoints require different levels of authentication:

### Public Access (No Auth)
- Basic guild information (`/v2/guild/:id` - limited fields)
- Guild search (`/v2/guild/search`)
- Permission catalog (`/v2/guild/permissions`)
- Upgrade catalog (`/v2/guild/upgrades`)
- Emblem designs (`/v2/emblem`)

### Member Access (guilds scope)
- Extended guild information (`/v2/guild/:id` - all fields)
- Requires guild membership

### Leader Access (guilds scope)
- All member endpoints
- Guild roster (`/v2/guild/:id/members`)
- Rank management (`/v2/guild/:id/ranks`)
- Activity log (`/v2/guild/:id/log`)
- Stash access (`/v2/guild/:id/stash`)
- Treasury data (`/v2/guild/:id/treasury`)
- Storage data (`/v2/guild/:id/storage`)
- Team information (`/v2/guild/:id/teams`)
- Upgrade status (`/v2/guild/:id/upgrades`)
- Requires guild leader status

---

## Rate Limiting

The GW2 API implements rate limiting:
- **300 requests per minute** for authenticated requests
- **60 requests per minute** for unauthenticated requests

Rate limit information is provided in response headers:
- `X-Rate-Limit-Limit` - Maximum requests allowed
- `X-Rate-Limit-Remaining` - Requests remaining in current window
- `X-Rate-Limit-Reset` - Seconds until rate limit resets

---

## Error Responses

Common error responses:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request format or parameters |
| 403 | Forbidden | Invalid API key, insufficient permissions, or not a guild member/leader |
| 404 | Not Found | Guild not found or endpoint doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 503 | Service Unavailable | API temporarily unavailable |

### Example Error Response

```json
{
  "text": "access restricted to guild leaders"
}
```

---

## Usage Examples

### Get Public Guild Info

```javascript
// No authentication needed
const response = await fetch('https://api.guildwars2.com/v2/guild/GUILD-GUID-HERE');
const guild = await response.json();
console.log(`${guild.name} [${guild.tag}]`);
```

### Get Extended Guild Info (Member)

```javascript
// Requires guilds scope and guild membership
const response = await fetch('https://api.guildwars2.com/v2/guild/GUILD-GUID-HERE', {
  headers: {
    'Authorization': 'Bearer YOUR-API-KEY'
  }
});
const guild = await response.json();
console.log(`Level: ${guild.level}, Members: ${guild.member_count}/${guild.member_capacity}`);
```

### Search for Guild by Name

```javascript
// Find guild IDs by name
const searchResponse = await fetch(
  'https://api.guildwars2.com/v2/guild/search?name=Example Guild'
);
const guildIds = await searchResponse.json();

// Get details for first result
if (guildIds.length > 0) {
  const guildResponse = await fetch(
    `https://api.guildwars2.com/v2/guild/${guildIds[0]}`
  );
  const guild = await guildResponse.json();
  console.log(`Found: ${guild.name} [${guild.tag}]`);
}
```

### Get Guild Activity Log (Leader)

```javascript
// Requires guilds scope and guild leader status
const response = await fetch('https://api.guildwars2.com/v2/guild/GUILD-GUID-HERE/log', {
  headers: {
    'Authorization': 'Bearer YOUR-API-KEY'
  }
});
const logEntries = await response.json();

// Filter for recent joins
const recentJoins = logEntries
  .filter(entry => entry.type === 'joined')
  .slice(0, 10);
console.log('Recent members:', recentJoins);
```
