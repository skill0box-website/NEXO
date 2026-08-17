import {
  ArrowLeft,
  Phone,
  Shirt,
  Ruler,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
} from 'lucide-react';

import { Wallet } from 'lucide-react'
import { usePayments } from '@/hooks/usePayments'
import Chat from '@/components/shared/Chat';
import { useState } from 'react';
import PatternBg from '@/components/ui/PatternBg';
import { C, STEPS } from '@/constants/theme';
import type { Commande } from '@/types';
import { Truck } from 'lucide-react'

interface Props {
  order: Commande;
  userId: string;
  onBack: () => void;
  onAdvance: () => void;
  onToggleLock: () => void;
}

export default function OrderDetail({
  order,
  userId,
  onBack,
  onAdvance,
  onToggleLock,
}: Props) {
  const [showChat, setShowChat] = useState(false);
  const { paiements, addPayment } = usePayments(order.id)
const [showPaymentForm, setShowPaymentForm] = useState(false)
const [montant, setMontant] = useState('')
const [type, setType] = useState<'acompte' | 'solde'>('acompte')
const [methode, setMethode] = useState('especes')
const [payErr, setPayErr] = useState('')

const submitPayment = async () => {
  const val = parseFloat(montant)
  if (!val || val <= 0) { setPayErr('Montant invalide.'); return }
  try {
    await addPayment(val, type, methode)
    setMontant(''); setShowPaymentForm(false); setPayErr('')
  } catch (e: any) {
    setPayErr(e.message)
  }
}

const totalPaye = order.montant_paye ?? 0
const reste = (order.price ?? 0) - totalPaye

  if (showChat)
    return (
      <Chat
        commandeId={order.id}
        currentUserId={userId}
        otherName={`${order.client?.prenom} ${order.client?.nom}`}
        onBack={() => setShowChat(false)}
      />
    );

  return (
    <PatternBg className="min-h-screen">
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{
          background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})`,
        }}
      >
        <button onClick={onBack}>
          <ArrowLeft size={20} className="text-white" />
        </button>
        <p className="text-white font-semibold">Détail de la commande</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Client */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {order.client?.prenom} {order.client?.nom}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Phone size={12} /> {order.client?.tel}
              </p>
            </div>
            <span className="text-4xl">👗</span>
          </div>

          {order.delay && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
              <AlertTriangle size={13} /> Cette commande est en retard
            </div>
          )}

          <div className="flex gap-1 mt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full"
                style={{
                  backgroundColor: i <= order.step ? C.terra : '#e5e7eb',
                }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Étape :{' '}
            <span className="font-medium text-gray-700">
              {STEPS[order.step]}
            </span>
          </p>
        </div>

        {/* Modèle & occasion */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Shirt size={16} style={{ color: C.terra }} /> Modèle & occasion
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['Vêtement', order.garment],
              ['Occasion', order.occasion],
              ['Tissu', order.fabric],
              [
                'Prix',
                order.price ? `${order.price.toLocaleString()} FCFA` : '—',
              ],
              [
                'Livraison',
                order.delivery_date
                  ? new Date(order.delivery_date).toLocaleDateString('fr')
                  : '—',
                  
              ],
              
              
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-800">{v}</span>
                {order.livraison_requise && (
  <div className="mt-3 flex items-start gap-2 bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg">
    <Truck size={13} className="shrink-0 mt-0.5" />
    <span>Livraison demandée{order.adresse_livraison ? ` — ${order.adresse_livraison}` : ''}</span>
  </div>
)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
    <Wallet size={16} style={{ color: C.terra }} /> Paiement
  </h3>
  <div className="flex justify-between text-sm mb-1">
    <span className="text-gray-500">Payé</span>
    <span className="font-medium text-gray-800">{totalPaye.toLocaleString()} FCFA</span>
  </div>
  <div className="flex justify-between text-sm mb-3">
    <span className="text-gray-500">Reste à payer</span>
    <span className="font-medium" style={{ color: reste > 0 ? C.terraDark : '#059669' }}>
      {reste > 0 ? reste.toLocaleString() + ' FCFA' : 'Soldé ✓'}
    </span>
  </div>

  {paiements.length > 0 && (
    <div className="space-y-1.5 mb-3">
      {paiements.map(p => (
        <div key={p.id} className="flex justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <span>{p.type === 'acompte' ? 'Acompte' : 'Solde'} · {p.methode}</span>
          <span className="font-medium text-gray-700">{p.montant.toLocaleString()} FCFA</span>
        </div>
      ))}
    </div>
  )}

  {showPaymentForm ? (
    <div className="space-y-2 border-t pt-3" style={{ borderColor: '#f3d9c6' }}>
      <input value={montant} onChange={e => setMontant(e.target.value.replace(/\D/, ''))}
        placeholder="Montant reçu (FCFA)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
      <div className="flex gap-2">
        <select value={type} onChange={e => setType(e.target.value as 'acompte' | 'solde')}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="acompte">Acompte</option>
          <option value="solde">Solde final</option>
        </select>
        <select value={methode} onChange={e => setMethode(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="especes">Espèces</option>
          <option value="orange_money">Orange Money</option>
          <option value="wave">Wave</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      {payErr && <p className="text-xs text-red-500">{payErr}</p>}
      <button onClick={submitPayment}
        className="w-full text-white text-sm font-medium py-2.5 rounded-xl"
        style={{ backgroundColor: C.terra }}>
        Confirmer le paiement
      </button>
    </div>
  ) : (
    <button onClick={() => setShowPaymentForm(true)}
      className="w-full border rounded-xl py-2.5 text-sm font-medium"
      style={{ borderColor: C.terra, color: C.terra }}>
      + Enregistrer un paiement
    </button>
  )}
</div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText size={16} style={{ color: C.terra }} /> Notes du client
            </h3>
            <p className="text-sm text-gray-600 italic">"{order.notes}"</p>
          </div>
        )}

        {/* Verrouillage */}
        <div
          className="rounded-2xl shadow-sm p-5 border-2"
          style={{
            backgroundColor: order.locked ? '#ecfdf5' : '#fdebe3',
            borderColor: order.locked ? '#a7f3d0' : '#f3d9c6',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {order.locked ? (
              <Lock size={18} className="text-green-600" />
            ) : (
              <Unlock size={18} style={{ color: C.terraDark }} />
            )}
            <h3 className="font-semibold text-gray-800">
              {order.locked ? 'Modèle verrouillé' : 'Modèle modifiable'}
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            {order.locked
              ? 'Le client ne peut plus changer son modèle sans ton accord.'
              : 'Verrouille le modèle une fois les détails confirmés.'}
          </p>
          <button
            onClick={onToggleLock}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ backgroundColor: order.locked ? '#059669' : C.navy }}
          >
            {order.locked ? 'Verrouillé ✓' : 'Verrouiller le modèle 🔒'}
          </button>
        </div>

        {/* Actions */}
        <button
          onClick={() => setShowChat(true)}
          className="w-full text-white font-semibold py-3.5 rounded-2xl"
          style={{ backgroundColor: C.navy }}
        >
          💬 Message au client
        </button>

        <button
          onClick={onAdvance}
          disabled={order.step === 5}
          className="w-full disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-2xl"
          style={{ backgroundColor: order.step === 5 ? undefined : C.terra }}
        >
          {order.step === 5
            ? 'Commande terminée ✓'
            : `Avancer → ${STEPS[order.step + 1]}`}
        </button>
      </div>
    </PatternBg>
  );
}
