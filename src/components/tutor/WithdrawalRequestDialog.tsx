import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { useBankAccounts, useAvailableBalance, useRequestWithdrawal } from "@/hooks/use-withdrawal";

interface WithdrawalRequestDialogProps {
  open: boolean;
  onClose: () => void;
}

const WithdrawalRequestDialog = ({ open, onClose }: WithdrawalRequestDialogProps) => {
  const { data: accounts } = useBankAccounts();
  const { data: availableBalance } = useAvailableBalance();
  const requestWithdrawal = useRequestWithdrawal();
  
  const [amount, setAmount] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  const MIN_WITHDRAWAL = 50;
  const verifiedAccounts = accounts?.filter(acc => acc.is_verified) || [];

  const handleSubmit = async () => {
    if (step === 'form') {
      setStep('confirm');
    } else {
      await requestWithdrawal.mutateAsync({
        amount: parseFloat(amount),
        bank_account_id: bankAccountId,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount("");
    setBankAccountId("");
    setStep('form');
    onClose();
  };

  const selectedAccount = accounts?.find(acc => acc.id === bankAccountId);
  const isValidAmount = parseFloat(amount) >= MIN_WITHDRAWAL && parseFloat(amount) <= (availableBalance || 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' ? 'Request Withdrawal' : 'Confirm Withdrawal'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Available Balance: <strong>${availableBalance?.toFixed(2) || '0.00'}</strong>
              </AlertDescription>
            </Alert>

            {verifiedAccounts.length === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to add and verify a bank account before requesting a withdrawal.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min={MIN_WITHDRAWAL}
                  max={availableBalance || 0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  placeholder={`Min. $${MIN_WITHDRAWAL}`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum withdrawal: ${MIN_WITHDRAWAL}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank-account">Bank Account</Label>
              <Select value={bankAccountId} onValueChange={setBankAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {verifiedAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank_name} •••• {account.account_number.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Processing typically takes 3-5 business days. You'll receive a notification when your withdrawal is processed.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSubmit}
              disabled={!isValidAmount || !bankAccountId || verifiedAccounts.length === 0}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Please review your withdrawal details
              </AlertDescription>
            </Alert>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To Account</span>
                <span className="font-medium">
                  {selectedAccount?.bank_name} •••• {selectedAccount?.account_number.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Processing Time</span>
                <span className="font-medium">3-5 business days</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={requestWithdrawal.isPending}
                className="flex-1"
              >
                {requestWithdrawal.isPending ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestDialog;