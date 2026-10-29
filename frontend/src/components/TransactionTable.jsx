import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'

function TransactionTable({ transactions, compact = false, onEdit, onDelete }) {
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
                    <span><strong>{transaction.description}</strong><small>{transaction.notes || transaction.merchant}</small></span>
                  </div>
                </td>
                <td><span className="category-chip">{transaction.category}</span></td>
                <td className="date-cell">{formatDate(transaction.date)}</td>
                <td className={`amount-cell ${income ? 'amount-income' : ''}`}>
                  {income ? '+' : '−'}{formatCurrency(Math.abs(transaction.amount))}
                </td>
                {!compact && (
                  <td className="action-cell">
                    <div className="transaction-actions">
                      <button className="row-action" onClick={() => onEdit?.(transaction)} type="button" aria-label={`Edit ${transaction.description}`}><Pencil size={15} /></button>
                      <button className="row-action" onClick={() => onDelete?.(transaction)} type="button" aria-label={`Delete ${transaction.description}`}><Trash2 size={15} /></button>
                    </div>
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
