
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

// Mock transaction data
const transactions = [
  {
    id: '1',
    amount: 4813.17,
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'payment',
    description: 'Task completion: Software Developer at Xanotech'
  },
  {
    id: '2',
    amount: 2500,
    status: 'completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    type: 'payment',
    description: 'Task completion: Mobile App Update'
  },
  {
    id: '3',
    amount: 5000,
    status: 'processing',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'withdrawal',
    description: 'Withdrawal to Bank Account'
  }
];

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate wallet balance
  const walletBalance = transactions.reduce((total, transaction) => {
    if (transaction.status === 'completed') {
      if (transaction.type === 'payment') {
        return total + transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        return total - transaction.amount;
      }
    }
    return total;
  }, 0);
  
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
        description: `Your withdrawal of NGN ${parseFloat(withdrawAmount).toLocaleString()} has been initiated and is being processed.`
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
                <h3 className="text-3xl font-bold text-white mb-1">NGN {walletBalance.toLocaleString()}</h3>
                <p className="text-white/80 text-sm">Available for withdrawal</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'payment' ? 'text-green-600' : 'text-amber-600'}`}>
                          {transaction.type === 'payment' ? '+' : '-'} NGN {transaction.amount.toLocaleString()}
                        </p>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {transaction.status === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
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
                    <Label htmlFor="amount">Amount (NGN)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min={0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter your bank name"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Enter account name"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
