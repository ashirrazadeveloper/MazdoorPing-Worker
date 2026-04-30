import { Transaction } from '@/types'
import { formatPKR } from '@/lib/utils'
import { ArrowDownLeft, ArrowUpRight, Minus } from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isPositive = transaction.amount > 0
  const isWithdrawal = transaction.type === 'withdrawal'

  const Icon = isPositive ? ArrowDownLeft : isWithdrawal ? ArrowUpRight : Minus
  const iconBg = isPositive
    ? 'bg-emerald-100 text-emerald-600'
    : isWithdrawal
      ? 'bg-orange-100 text-orange-600'
      : 'bg-red-100 text-red-600'

  const amountColor = isPositive
    ? 'text-emerald-600'
    : isWithdrawal
      ? 'text-orange-600'
      : 'text-foreground'

  return (
    <div className="flex items-center gap-3 py-3.5 animate-fade-in">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {new Date(transaction.created_at).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <span className={`text-sm font-semibold shrink-0 ${amountColor}`}>
        {isPositive ? '+' : ''}{formatPKR(Math.abs(transaction.amount))}
      </span>
    </div>
  )
}
