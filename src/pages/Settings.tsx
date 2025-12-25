import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Download, Upload, Key, ExternalLink, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApiKey } from '@/api/hooks/useApiKey';

export function Settings() {
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const { apiKey, setApiKey, clearApiKey, isValidKey, hasApiKey, error } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalStorageCount(Object.keys(localStorage).length);
  }, []);

  const handleSaveApiKey = () => {
    setLocalError(null);

    if (!inputValue.trim()) {
      setLocalError('Please enter an API key');
      return;
    }

    if (!isValidKey(inputValue)) {
      setLocalError('Invalid API key format');
      return;
    }

    setApiKey(inputValue);
    setInputValue('');
    toast.success('API key saved successfully');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setInputValue('');
    setLocalError(null);
    toast.success('API key cleared');
  };

  const displayError = localError || error;

  const exportAllData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) allData[key] = value;
        }
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: allData,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gw2-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${Object.keys(allData).length} items`);
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid backup file');
      }

      for (const [key, value] of Object.entries(parsed.data)) {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      }

      toast.success(`Imported ${Object.keys(parsed.data).length} items`);
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error('Import failed - invalid file');
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gw2-gold/10 glow-gold-sm">
          <SettingsIcon className="h-5 w-5 text-gw2-gold" />
        </div>
        <h1 className="text-2xl font-bold heading-accent">Settings</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* API Key Configuration */}
        <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            {hasApiKey ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">Connected</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Key: {apiKey?.substring(0, 8)}...
                </span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Not Connected</span>
              </>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="api-key"
              type="text"
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setLocalError(null);
              }}
              className="font-mono text-xs"
            />
            {displayError && (
              <p className="text-sm text-red-500">{displayError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveApiKey}
              disabled={!inputValue.trim()}
              size="sm"
              className="bg-[#C59C61] hover:bg-[#B08C51] text-black"
            >
              Save Key
            </Button>
            {hasApiKey && (
              <Button
                variant="outline"
                onClick={handleClearApiKey}
                size="sm"
              >
                Clear Key
              </Button>
            )}
          </div>

          {/* Get API Key Link */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an API key?{' '}
              <a
                href="https://account.arena.net/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C59C61] hover:underline inline-flex items-center gap-1"
              >
                Generate one here
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Grant all permissions for full functionality.
            </p>
          </div>
        </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Export your settings to transfer to another browser or keep as backup.</p>
            <p className="text-foreground font-medium">What's included in the export:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>API key</li>
              <li>Trading post watchlist</li>
              <li>Theme preference</li>
              <li>Event favorites</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={exportAllData} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export ({localStorageCount} items)
            </Button>

            <div>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Importing overwrites existing settings and reloads the page.
          </p>
        </CardContent>
        </Card>

        {/* Data Info */}
        <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">About Data</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <div className="space-y-2">
            <p className="text-foreground font-medium">Stored in your browser:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>API key</li>
              <li>App preferences (theme, view mode, etc.)</li>
              <li>Trading post watchlist</li>
              <li>Event favorites</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-foreground font-medium">What we DON'T store:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Characters, inventory, or bank data</li>
              <li>Wallet, currencies, or materials</li>
              <li>Achievements or progression</li>
              <li>Any other account data</li>
            </ul>
            <p className="text-xs italic mt-2">
              All account data is fetched fresh from the Guild Wars 2 API each time you use the app. Nothing is cached or saved.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
