import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'

function TransactionTable({ transactions, compact = false }) {
  return (
    <div className={`table-wrap ${compact ? 'table-wrap-compact' : ''}`}>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th className="amount-heading">Amount</th>
            {!compact && <th aria-label="Actions" />}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const income = transaction.type === 'income'
            return (
              <tr key={transaction.id}>
                <td>
                  <div className="transaction-name">
                    <span className={`merchant-icon ${income ? 'merchant-income' : ''}`}>
                      {income ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                    </span>
                    <span><strong>{transaction.description}</strong><small>{transaction.merchant}</small></span>
                  </div>
                </td>
                <td><span className="category-chip">{transaction.category}</span></td>
                <td className="date-cell">{formatDate(transaction.date)}</td>
                <td className={`amount-cell ${income ? 'amount-income' : ''}`}>
                  {income ? '+' : '−'}{formatCurrency(Math.abs(transaction.amount))}
                </td>
                {!compact && (
                  <td className="action-cell">
                    <button className="row-action" type="button" aria-label={`More options for ${transaction.description}`}>
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
          {transactions.length === 0 && (
            <tr><td className="empty-row" colSpan={compact ? 4 : 5}>No transactions match your search.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
