import { useState } from 'react';
import { useApiKey } from '@/api/hooks/useApiKey';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink, Check, Key } from 'lucide-react';

export function ApiKeySetup() {
  const { setApiKey, isValidKey, error, hasApiKey } = useApiKey();
  const [keyInput, setKeyInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!keyInput.trim()) {
      return;
    }

    if (!isValidKey(keyInput)) {
      return;
    }

    setApiKey(keyInput);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gw2-accent">
          <Key className="h-5 w-5" />
          API Key Setup
        </CardTitle>
        <CardDescription>
          Enter your Guild Wars 2 API key to access your inventory and character data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-key" className="text-sm font-medium">
            API Key
          </label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="text"
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="text-sm"
            />
            <Button onClick={handleSave} disabled={!keyInput.trim()}>
              Save
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {showSuccess && (
            <div className="flex items-center gap-2 text-sm text-success">
              <Check className="h-4 w-4" />
              <span>API key saved successfully!</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2">How to get your API key:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Visit the Guild Wars 2 Applications page</li>
              <li>Create a new key or use an existing one</li>
              <li>Ensure the key has the required permissions</li>
              <li>Copy and paste the key above</li>
            </ol>
          </div>

          <a
            href="https://account.arena.net/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Open GW2 Applications Page
          </a>

          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm font-semibold mb-2">Required Permissions:</div>
            <div className="flex flex-wrap gap-2">
              {['account', 'inventories', 'characters'].map((scope) => (
                <span
                  key={scope}
                  className="px-2 py-1 bg-background rounded text-xs font-mono"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>

        {hasApiKey && (
          <div className="border-t pt-4">
            <p className="text-sm text-success">
              API key is configured. Reload the page to view your inventory.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
