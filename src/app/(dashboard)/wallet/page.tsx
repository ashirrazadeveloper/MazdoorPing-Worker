'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/Header'
import TransactionItem from '@/components/wallet/TransactionItem'
import { mockWorker, mockTransactions } from '@/data/mock'
import { formatPKR } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, ArrowUpFromLine, Minus } from 'lucide-react'

export default function WalletPage() {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState<'jazzcash' | 'easypaisa' | 'bank'>('jazzcash')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAccount, setWithdrawAccount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const balance = mockWorker.wallet_balance
  const totalEarnings = mockTransactions.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0)
  const totalWithdrawals = mockTransactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalCommission = mockTransactions.filter(t => t.type === 'commission').reduce((s, t) => s + Math.abs(t.amount), 0)

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawAccount) return
    const amount = parseInt(withdrawAmount)
    if (amount <= 0 || amount > balance) return
    setSubmitted(true)
    setTimeout(() => {
      setShowWithdraw(false)
      setSubmitted(false)
      setWithdrawAmount('')
      setWithdrawAccount('')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wallet" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-green-600 border-0 text-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-green-100 text-sm font-medium">Available Balance</p>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                ✅ Active
              </Badge>
            </div>
            <p className="text-3xl font-bold mb-6">{formatPKR(balance)}</p>
            <Button
              className="bg-white text-primary hover:bg-green-50 h-11 font-semibold"
              onClick={() => setShowWithdraw(true)}
            >
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              Withdraw Money
            </Button>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Earnings Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Earnings</p>
                <p className="text-sm font-bold text-green-600">{formatPKR(totalEarnings)}</p>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <ArrowUpFromLine className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Withdrawn</p>
                <p className="text-sm font-bold text-orange-600">{formatPKR(totalWithdrawals)}</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <Minus className="h-4 w-4 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Commission</p>
                <p className="text-sm font-bold text-red-600">{formatPKR(totalCommission)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Transaction History</h3>
            <div className="max-h-96 overflow-y-auto">
              {mockTransactions.map(tx => (
                <div key={tx.id}>
                  <TransactionItem transaction={tx} />
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogDescription>
              Available: {formatPKR(balance)}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-lg font-bold text-foreground">Withdrawal Requested!</p>
              <p className="text-sm text-muted-foreground mt-1">Your money will arrive within 24 hours</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'jazzcash' as const, label: 'JazzCash', color: 'bg-red-50 border-red-200 text-red-700' },
                    { value: 'easypaisa' as const, label: 'EasyPaisa', color: 'bg-green-50 border-green-200 text-green-700' },
                    { value: 'bank' as const, label: 'Bank', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  ].map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setWithdrawMethod(method.value)}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                        withdrawMethod === method.value
                          ? `${method.color} ring-2 ring-primary/30`
                          : 'bg-white border-border text-muted-foreground'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (PKR) *</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={balance}
                  min={500}
                />
                <p className="text-xs text-muted-foreground">Min: PKR 500 · Max: {formatPKR(balance)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-account">
                  {withdrawMethod === 'bank' ? 'Account Number (IBAN)' : 'Account Number'} *
                </Label>
                <Input
                  id="withdraw-account"
                  placeholder={withdrawMethod === 'bank' ? 'PK00XXXX0000000000000' : '03XX-XXXXXXX'}
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ Withdrawal will be processed within 24 hours. Ensure your account number is correct.
                </p>
              </div>

              <Button
                className="w-full h-12"
                size="lg"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || !withdrawAccount || parseInt(withdrawAmount) > balance}
              >
                Withdraw {withdrawAmount ? formatPKR(parseInt(withdrawAmount)) : 'Money'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
