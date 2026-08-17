import { useAdminData } from '@/hooks/useAdminData'
import { C, STEPS } from '@/constants/theme'
import { AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const { stats, commandes, loading } = useAdminData()

  if (loading) return <p className="p-6 text-center text-gray-400">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-4" style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <h1 className="text-white font-bold text-lg">Administration CoutureLink</h1>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Clients', val: stats.clients },
          { label: 'Tailleurs', val: stats.tailleurs },
          { label: 'Commandes', val: stats.commandes },
          { label: 'En retard', val: stats.retards },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold" style={{ color: C.terra }}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 pb-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Tailleur</th>
                <th className="p-3 text-left">Vêtement</th>
                <th className="p-3 text-left">Étape</th>
                <th className="p-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(c => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="p-3">{c.client?.prenom} {c.client?.nom}</td>
                  <td className="p-3">{c.tailleur?.profile?.prenom}</td>
                  <td className="p-3">{c.garment}</td>
                  <td className="p-3">{STEPS[c.step]}</td>
                  <td className="p-3">
                    {c.delay
                      ? <span className="flex items-center gap-1 text-red-600 text-xs"><AlertTriangle size={12}/>Retard</span>
                      : <span className="text-green-600 text-xs">À l'heure</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}