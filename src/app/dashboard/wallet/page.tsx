'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/Header'
import TransactionItem from '@/components/wallet/TransactionItem'
import { useAuth } from '@/components/auth/AuthProvider'
import { getTransactions, requestWithdrawal } from '@/lib/services'
import type { Transaction } from '@/types'
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
import { TrendingUp, ArrowUpFromLine, Minus, CheckCircle2, History } from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const { workerProfile } = useAuth()
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState<'jazzcash' | 'easypaisa' | 'bank'>('jazzcash')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAccount, setWithdrawAccount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!workerProfile) return
      try {
        const data = await getTransactions(workerProfile.id)
        setTransactions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (workerProfile) fetchData()
  }, [workerProfile])

  const balance = Number(workerProfile?.wallet_balance || 0)
  const totalEarnings = transactions.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0)
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalCommission = transactions.filter(t => t.type === 'commission').reduce((s, t) => s + Math.abs(t.amount), 0)

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAccount || !workerProfile) return
    const amount = parseFloat(withdrawAmount)
    if (amount <= 0 || amount > balance) return
    setSubmitting(true)
    try {
      await requestWithdrawal(workerProfile.id, amount, withdrawMethod, withdrawAccount)
      setSubmitted(true)
      setTimeout(() => {
        setShowWithdraw(false)
        setSubmitted(false)
        setWithdrawAmount('')
        setWithdrawAccount('')
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header title="Wallet" />
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Wallet" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 border-0 text-white overflow-hidden shadow-lg shadow-green-600/20">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-white/5 rounded-full -ml-8 -mb-8" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-100 text-sm font-medium">Available Balance</p>
                <Badge className="bg-white/20 text-white border-0 text-[10px] rounded-lg px-2">
                  ✅ Active
                </Badge>
              </div>
              <p className="text-4xl font-extrabold mb-6 tracking-tight">{formatPKR(balance)}</p>
              <div className="flex gap-3">
                <Button
                  className="bg-white text-green-600 hover:bg-green-50 h-11 font-semibold rounded-xl shadow-sm flex-1"
                  onClick={() => setShowWithdraw(true)}
                >
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
                <Link href="#history" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-11 font-semibold rounded-xl border-white/30 text-white hover:bg-white/10"
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Earnings Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground font-medium">Earnings</p>
                <p className="text-sm font-bold text-green-600 mt-0.5">{formatPKR(totalEarnings)}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <ArrowUpFromLine className="h-5 w-5 text-orange-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground font-medium">Withdrawn</p>
                <p className="text-sm font-bold text-orange-600 mt-0.5">{formatPKR(totalWithdrawals)}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
                <Minus className="h-5 w-5 text-red-500 mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground font-medium">Commission</p>
                <p className="text-sm font-bold text-red-500 mt-0.5">{formatPKR(totalCommission)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-border/60" id="history">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Transaction History</h3>
              <span className="text-[10px] text-muted-foreground">{transactions.length} transactions</span>
            </div>
            {transactions.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {transactions.map(tx => (
                  <div key={tx.id}>
                    <TransactionItem transaction={tx} />
                    <Separator />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">💰</div>
                <p className="text-sm font-semibold text-foreground">No transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Complete jobs to start earning</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogDescription>
              Available: {formatPKR(balance)}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-bold text-foreground">Withdrawal Requested!</p>
              <p className="text-sm text-muted-foreground mt-1">Your money will arrive within 24 hours</p>
            </div>
          ) : (
            <div className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Withdrawal Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'jazzcash' as const, label: 'JazzCash', emoji: '📱', color: 'bg-red-50 border-red-200 text-red-700' },
                    { value: 'easypaisa' as const, label: 'EasyPaisa', emoji: '💚', color: 'bg-green-50 border-green-200 text-green-700' },
                    { value: 'bank' as const, label: 'Bank', emoji: '🏦', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  ].map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setWithdrawMethod(method.value)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        withdrawMethod === method.value
                          ? `${method.color} ring-2 ring-primary/30 scale-[1.02]`
                          : 'bg-white border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{method.emoji}</span>
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount" className="text-xs font-semibold">Amount (PKR) *</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={balance}
                  min={500}
                  className="h-11 rounded-xl"
                />
                <p className="text-[11px] text-muted-foreground">Min: PKR 500 · Max: {formatPKR(balance)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-account" className="text-xs font-semibold">
                  {withdrawMethod === 'bank' ? 'Account Number (IBAN)' : 'Account Number'} *
                </Label>
                <Input
                  id="withdraw-account"
                  placeholder={withdrawMethod === 'bank' ? 'PK00XXXX0000000000000' : '03XX-XXXXXXX'}
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ Withdrawal will be processed within 24 hours. Ensure your account number is correct.
                </p>
              </div>

              <Button
                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25"
                size="lg"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || !withdrawAccount || parseFloat(withdrawAmount) > balance || submitting}
              >
                {submitting ? 'Processing...' : `Withdraw ${withdrawAmount ? formatPKR(parseFloat(withdrawAmount)) : 'Money'}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
