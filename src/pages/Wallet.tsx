
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import TransactionHistory from '@/components/wallet/TransactionHistory';

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const { loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userProfile = await loggedInUser();
      setUser(userProfile);
    };
    fetchUser();
  }, []);

  // Get wallet balance from API
  const walletBalance = user?.wallet_id?.balance || 0;
  const walletCurrency = user?.wallet_id?.currency || 'NGN';
  const lockedBalance = user?.wallet_id?.locked_balance || 0;
  const userType = user?.role === 'responder' ? 'responder' : 'user';

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(withdrawAmount) > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Your withdrawal amount exceeds your available balance",
        variant: "destructive"
      });
      return;
    }

    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
      toast({
        title: "Missing Bank Details",
        description: "Please fill in all bank details",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${walletCurrency} ${parseFloat(withdrawAmount).toLocaleString()} has been initiated and is being processed.`
      });

      setWithdrawAmount('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600">Manage your earnings and withdrawals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary/90 to-primary">
            <CardHeader className="text-white pb-2">
              <CardTitle className="text-lg">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-3xl font-bold text-white mb-1">{walletCurrency} {walletBalance.toLocaleString()}</h3>
                <p className="text-white/80 text-sm">Available for withdrawal</p>
                {lockedBalance > 0 && (
                  <p className="text-white/70 text-xs mt-2">Locked: {walletCurrency} {lockedBalance.toLocaleString()}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="bg-white hover:bg-white/90 text-primary">
                Withdraw Funds
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                Transaction History
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Update Bank Details
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Payment Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TransactionHistory userType={userType} />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Transfer funds to your bank account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ({walletCurrency})</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min={0}
                      max={walletBalance}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter your bank name"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Enter account name"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting || walletBalance === 0}>
                    {isSubmitting ? 'Processing...' : 'Withdraw'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
