import { useState } from 'react'
import { Bell, LogOut, CheckCheck } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { C } from '@/constants/theme'

interface Props {
  prenom: string
  nom: string
  userId: string
  subtitle?: string
  onLogout: () => void
  stats?: { label: string; val: number; danger?: boolean; success?: boolean }[]
}

export default function Header({ prenom, nom, userId, subtitle, onLogout, stats }: Props) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId)
  const [open, setOpen] = useState(false)

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (diff < 1) return "à l'instant"
    if (diff < 60) return `il y a ${diff} min`
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`
    return `il y a ${Math.floor(diff / 1440)} j`
  }

  return (
    <div
      className="px-4 pt-5 pb-4 relative"
      style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs" style={{ color: '#f3d9c6' }}>
            {subtitle ?? 'Bienvenue 👋'}
          </p>
          <h2 className="text-white font-bold text-lg">{prenom} {nom}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(o => !o)}
            className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Bell size={16} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <LogOut size={16} className="text-white" />
          </button>
        </div>
      </div>

      {stats && (
        <div className="flex gap-3 mt-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="flex-1 rounded-xl p-3 text-center"
              style={{
                backgroundColor: s.danger
                  ? 'rgba(220,38,38,0.55)'
                  : s.success
                  ? 'rgba(5,150,105,0.55)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <p className="text-white font-bold text-xl">{s.val}</p>
              <p className="text-white/80 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Panneau de notifications */}
      {open && (
        <div className="absolute right-4 top-16 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800 text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs" style={{ color: C.terra }}>
                <CheckCheck size={13} /> Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">Aucune notification pour l'instant</p>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className="w-full text-left px-4 py-3 border-b border-gray-50 flex items-start gap-2"
                  style={{ backgroundColor: n.read ? 'white' : '#fdebe3' }}
                >
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: C.terra }} />
                  )}
                  <div className={n.read ? 'ml-4' : ''}>
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}