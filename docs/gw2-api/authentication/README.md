# Authentication

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - API Key](https://wiki.guildwars2.com/wiki/API:API_key) | [Token Info](https://wiki.guildwars2.com/wiki/API:2/tokeninfo)

---

## 1. API Keys

API keys are required to access authenticated endpoints in the Guild Wars 2 API.

### Key Management
- **Creation URL:** https://account.arena.net/applications
- **Maximum keys:** 200 keys per account
- **Naming:** Key names can be changed after creation
- **Permissions:** Permissions **cannot** be changed after key creation - you must delete and recreate the key
- **Deletion:** Takes effect immediately

### Best Practices
- Create separate keys for different applications
- Use descriptive names to identify each key's purpose
- Delete keys that are no longer needed
- Regularly audit your active keys

---

## 2. Authentication Methods

The GW2 API supports two methods for authenticating requests:

### Header Method (Not Recommended for Web Apps)
```http
GET /v2/account HTTP/1.1
Host: api.guildwars2.com
Authorization: Bearer YOUR_API_KEY
```

**Note:** This method is blocked by CORS policies in browsers, making it unsuitable for client-side web applications.

### Query Parameter Method (Recommended for Web Apps)
```http
GET /v2/account?access_token=YOUR_API_KEY HTTP/1.1
Host: api.guildwars2.com
```

This method works in all environments, including browsers, and is the recommended approach for web-based applications.

**Example:**
```javascript
const response = await fetch(
  `https://api.guildwars2.com/v2/account?access_token=${apiKey}`
);
```

---

## 3. Permission Scopes

Every API key has the `account` scope by default, plus any additional scopes granted at creation time.

| Scope | Description |
|-------|-------------|
| **account** | Required for all keys. Provides access to account name, ID, WvW team, guild list, account creation date, and home world |
| **builds** | Access to equipped specializations, traits, skills, and equipment for all characters |
| **characters** | Character details including name, level, race, gender, profession, age, and death count |
| **guilds** | Access to rosters, history, and message of the day (MOTD) for guilds where the account is a member |
| **inventories** | Account vault, material storage, and character inventories |
| **progression** | Achievements, story progress, dungeon unlocks, and mastery progress |
| **pvp** | PvP statistics, match history, and reward track progress |
| **tradingpost** | Current buy/sell transactions and transaction history for the past 90 days |
| **unlocks** | Account-wide unlocked skins and dyes |
| **wallet** | Account wallet containing currencies |
| **wvw** | World vs World guild membership, team information, and personal WvW stats |

### Choosing Scopes
When creating an API key for your application:
1. Only request the minimum scopes needed for your functionality
2. Explain to users why each scope is needed
3. Consider creating multiple keys for different features if only some require sensitive scopes

---

## 4. /v2/tokeninfo Endpoint

The `/v2/tokeninfo` endpoint allows you to retrieve information about the currently authenticated API key.

### Request
```http
GET /v2/tokeninfo?access_token=YOUR_API_KEY
```

### Response (Basic Schema)
```json
{
  "id": "ABCDE02B-8888-FEBA-1234-DE98765C7DEF",
  "name": "My API Key",
  "permissions": [
    "account",
    "characters",
    "tradingpost",
    "unlocks",
    "builds"
  ]
}
```

### Response (Extended Schema - 2019-05-22+)
Tokens created or viewed after May 22, 2019 include additional fields:

```json
{
  "id": "ABCDE02B-8888-FEBA-1234-DE98765C7DEF",
  "name": "My API Key",
  "permissions": [
    "account",
    "characters",
    "tradingpost",
    "unlocks",
    "builds"
  ],
  "type": "APIKey",
  "expires_at": null,
  "issued_at": "2019-05-22T00:00:00.000Z",
  "urls": []
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the API key (UUID format) |
| `name` | string | User-defined name for the key |
| `permissions` | array | List of granted permission scopes |
| `type` | string | Either "APIKey" (full key) or "Subtoken" (restricted token) |
| `expires_at` | string/null | ISO 8601 timestamp when the token expires, or null for no expiration |
| `issued_at` | string | ISO 8601 timestamp when the token was created |
| `urls` | array | List of URL restrictions (empty array = no restrictions) |

### Use Cases
- **Validation:** Verify that a user-provided API key is valid
- **Permission Check:** Confirm the key has required scopes before making requests
- **User Feedback:** Display the key name and permissions to the user
- **Security:** Detect if a key is a subtoken with limited access

### Example Usage
```javascript
async function validateApiKey(apiKey) {
  try {
    const response = await fetch(
      `https://api.guildwars2.com/v2/tokeninfo?access_token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Invalid API key');
    }

    const tokenInfo = await response.json();

    // Check for required permissions
    const requiredPermissions = ['account', 'characters', 'inventories'];
    const hasPermissions = requiredPermissions.every(
      perm => tokenInfo.permissions.includes(perm)
    );

    if (!hasPermissions) {
      throw new Error('API key missing required permissions');
    }

    return tokenInfo;
  } catch (error) {
    console.error('API key validation failed:', error);
    throw error;
  }
}
```

---

## 5. Subtokens (/v2/createsubtoken)

Subtokens allow you to create restricted tokens derived from an existing API key. This is useful for sharing limited access without exposing your full API key.

### Endpoint
```http
GET /v2/createsubtoken?access_token=YOUR_API_KEY&permissions=account,characters&expire=2025-12-31T23:59:59Z
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `access_token` | Yes | Your full API key |
| `permissions` | No | Comma-separated list of permissions (subset of parent key). Defaults to all parent permissions |
| `expire` | No | ISO 8601 timestamp for when the subtoken expires. Defaults to no expiration |
| `urls` | No | Comma-separated list of URL patterns that can use this token. Defaults to no restrictions |

### Response
```json
{
  "subtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The subtoken can be used in place of a regular API key for authentication.

### Use Cases
1. **Third-party Integration:** Share limited access with external tools
2. **Temporary Access:** Create expiring tokens for short-term use
3. **URL Restrictions:** Limit token usage to specific domains
4. **Principle of Least Privilege:** Grant only necessary permissions

### Example: Creating a Limited Subtoken
```javascript
async function createLimitedSubtoken(apiKey) {
  const permissions = 'account,characters'; // Only basic info
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7); // Expires in 7 days

  const url = new URL('https://api.guildwars2.com/v2/createsubtoken');
  url.searchParams.append('access_token', apiKey);
  url.searchParams.append('permissions', permissions);
  url.searchParams.append('expire', expireDate.toISOString());

  const response = await fetch(url);
  const data = await response.json();

  return data.subtoken;
}
```

### Verifying Subtokens
Use `/v2/tokeninfo` to check subtoken properties:
```json
{
  "id": "parent-key-id",
  "name": "My API Key",
  "permissions": ["account", "characters"],
  "type": "Subtoken",
  "expires_at": "2025-12-31T23:59:59.000Z",
  "issued_at": "2025-12-24T00:00:00.000Z",
  "urls": ["https://example.com/*"]
}
```

---

## 6. Security Notes

### Critical Security Considerations

#### API Key Name Field Vulnerability
⚠️ **WARNING:** The API key `name` field returned by `/v2/tokeninfo` is **unescaped** and may contain HTML or JavaScript code.

**Always sanitize the name field before displaying it:**
```javascript
// Bad - vulnerable to XSS
element.innerHTML = tokenInfo.name;

// Good - safe rendering
element.textContent = tokenInfo.name;

// Or use a sanitization library
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(tokenInfo.name);
```

### General Security Best Practices

1. **Read-Only Access:** API keys provide read-only access to account data. They cannot modify game state or perform actions.

2. **Never Share Publicly:**
   - Never commit API keys to version control
   - Never share keys in public forums or screenshots
   - Never log API keys in plain text

3. **Client-Side Storage:**
   - Store keys securely (e.g., localStorage with appropriate precautions)
   - Consider encrypting keys before storage
   - Clear keys when users log out

4. **Key Rotation:**
   - Regularly rotate API keys, especially for production applications
   - Immediately revoke keys if compromised

5. **Rate Limiting:**
   - Respect API rate limits (typically 600 requests per minute per IP)
   - Implement exponential backoff for retries
   - Cache responses where appropriate

6. **HTTPS Only:**
   - Always use HTTPS when transmitting API keys
   - Never send keys over unencrypted connections

### Example: Secure Key Storage
```javascript
class SecureAPIKeyStore {
  private readonly STORAGE_KEY = 'gw2-companion-settings';

  saveApiKey(apiKey: string): void {
    // In production, consider additional encryption
    const settings = this.getSettings();
    settings.apiKey = apiKey;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  getApiKey(): string | null {
    const settings = this.getSettings();
    return settings.apiKey || null;
  }

  clearApiKey(): void {
    const settings = this.getSettings();
    delete settings.apiKey;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  private getSettings(): any {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}
```

---

## Quick Reference

### Common Patterns

**Validate an API key:**
```javascript
const isValid = await fetch(
  `https://api.guildwars2.com/v2/tokeninfo?access_token=${apiKey}`
).then(r => r.ok);
```

**Check for specific permissions:**
```javascript
const tokenInfo = await fetch(
  `https://api.guildwars2.com/v2/tokeninfo?access_token=${apiKey}`
).then(r => r.json());

const hasInventoryAccess = tokenInfo.permissions.includes('inventories');
```

**Make authenticated request:**
```javascript
const account = await fetch(
  `https://api.guildwars2.com/v2/account?access_token=${apiKey}`
).then(r => r.json());
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Valid key but insufficient permissions |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - API issue |

---

## Additional Resources

- [Official API Documentation](https://wiki.guildwars2.com/wiki/API:Main)
- [API Key Management](https://account.arena.net/applications)
- [Community API Tools](https://wiki.guildwars2.com/wiki/API:List_of_applications)
