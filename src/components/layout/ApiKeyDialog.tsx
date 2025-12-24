import { useState } from 'react';
import { useApiKey } from '../../api/hooks/useApiKey';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Key, ExternalLink, Check, X } from 'lucide-react';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const { apiKey, setApiKey, clearApiKey, isValidKey, hasApiKey, error } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = () => {
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
    onOpenChange(false);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue('');
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Guild Wars 2 API key to access personalized features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
          </div>

          {/* Required Scopes */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Required Scopes:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>account - View account information</li>
              <li>inventories - View inventory and bank contents</li>
              <li>characters - View character data</li>
              <li>tradingpost - View trading post transactions</li>
              <li>wallet - View wallet currencies</li>
              <li>progression - View achievements and progression</li>
              <li>builds - View character builds and equipment</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasApiKey && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="mr-auto"
            >
              Clear Key
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setInputValue('');
              setLocalError(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className="bg-[#C59C61] hover:bg-[#B08C51] text-black"
          >
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
