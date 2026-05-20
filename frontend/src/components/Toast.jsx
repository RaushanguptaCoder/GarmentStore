import { CheckCircle, AlertCircle, X } from 'lucide-react'
import useStore from '../store/useStore'

export default function Toast() {
  const { toast, showToast } = useStore()
  if (!toast) return null

  const isError = toast.type === 'error'
  return (
    <div
      key={toast.id}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium animate-fade-in
        ${isError ? 'bg-red-600' : 'bg-gray-900'}`}
    >
      {isError
        ? <AlertCircle size={18} className="flex-shrink-0" />
        : <CheckCircle size={18} className="flex-shrink-0 text-green-400" />
      }
      <span>{toast.message}</span>
      <button onClick={() => showToast(null)} className="ml-2 opacity-70 hover:opacity-100">
        <X size={15} />
      </button>
    </div>
  )
}
