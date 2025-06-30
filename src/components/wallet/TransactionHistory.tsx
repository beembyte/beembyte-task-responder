
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowDownCircle, ArrowUpCircle, CalendarIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import walletTransactionApi, { TransactionHistoryData, TransactionHistoryParams } from '@/services/walletTransactionApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TransactionHistoryProps {
  userType?: 'user' | 'responder';
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userType = 'user' }) => {
  const [transactionData, setTransactionData] = useState<TransactionHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [direction, setDirection] = useState<'all' | 'debit' | 'credit'>('all');
  const { loggedInUser } = useAuth();
  const { toast } = useToast();

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const params: TransactionHistoryParams = {
        month: format(selectedDate, 'MMMM'),
        year: selectedDate.getFullYear(),
      };

      if (direction !== 'all') {
        params.direction = direction;
      }

      const response = await walletTransactionApi.getResponderTransactionHistory(params)

      setTransactionData(response.data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transaction history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [selectedDate, direction, userType]);

  const getTransactionIcon = (direction: string, transactionType: string) => {
    console.log(direction)
    if (direction === 'credit' || direction === 'task_payment') {
      return <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
    }
    return <ArrowDownCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
  };

  const getTransactionColor = (direction: string) => {
    return direction === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactionHistory}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <Select value={direction} onValueChange={(value: 'all' | 'debit' | 'credit') => setDirection(value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Filter by direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="credit">Credit Only</SelectItem>
                <SelectItem value="debit">Debit Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-sm text-gray-500">Loading transactions...</div>
        ) : (
          <div className="space-y-6">
            {transactionData.length > 0 ? (
              transactionData.map((monthData) => (
                <div key={monthData.month} className="space-y-3">
                  <h3 className="font-medium text-sm text-gray-700">{monthData.month}</h3>
                  <div className="space-y-2">
                    {monthData.transactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {/* {getTransactionIcon(transaction.transaction_type, transaction.direction)} */}
                            <div
                              className={`p-1.5 rounded-full ${transaction.direction === 'credit'
                                ? 'bg-green-100 dark:bg-green-900/20'
                                : 'bg-red-100 dark:bg-red-900/20'
                                }`}
                            >
                              {getTransactionIcon(transaction.transaction_type, transaction.direction)}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-xs capitalize">
                              {transaction.transaction_type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {transaction.reference && (
                              <p className="text-xs text-gray-400">
                                Ref: {transaction.reference}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={cn("font-semibold text-sm", getTransactionColor(transaction.direction))}>
                            {transaction.direction === 'credit' ? '+' : '-'}
                            {formatAmount(transaction.amount, transaction.currency)}
                          </p>
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              transaction.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            )}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                No transactions found for the selected period
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
