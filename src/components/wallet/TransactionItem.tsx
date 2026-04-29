import { Transaction } from '@/types'
import { formatPKR } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, Minus } from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isPositive = transaction.amount > 0
  const Icon = isPositive ? ArrowDownLeft : transaction.type === 'withdrawal' ? ArrowUpRight : Minus
  const iconBg = isPositive
    ? 'bg-green-100 text-green-600'
    : transaction.type === 'withdrawal'
    ? 'bg-orange-100 text-orange-600'
    : 'bg-red-100 text-red-600'

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.created_at).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <span className={`text-sm font-semibold shrink-0 ${isPositive ? 'text-green-600' : 'text-foreground'}`}>
        {isPositive ? '+' : ''}{formatPKR(Math.abs(transaction.amount))}
      </span>
    </div>
  )
}
