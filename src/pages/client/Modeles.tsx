import { useState } from 'react';
import { Heart } from 'lucide-react';
import { C } from '@/constants/theme';

const CATEGORIES = {
  femme: [
    {
      id: 1,
      name: 'Robe soirée wax',
      tailor: 'Sokhna Fall',
      price: '15 000 FCFA',
      emoji: '👗',
    },
    {
      id: 2,
      name: 'Tailleur classique',
      tailor: 'Moussa Sow',
      price: '22 000 FCFA',
      emoji: '🧥',
    },
    {
      id: 3,
      name: 'Ensemble boubou',
      tailor: 'Sokhna Fall',
      price: '18 000 FCFA',
      emoji: '👘',
    },
    {
      id: 4,
      name: 'Robe de mariée',
      tailor: 'Sokhna Fall',
      price: '85 000 FCFA',
      emoji: '👰',
    },
  ],
  homme: [
    {
      id: 5,
      name: 'Boubou brodé',
      tailor: 'Moussa Sow',
      price: '25 000 FCFA',
      emoji: '🥻',
    },
    {
      id: 6,
      name: 'Costume 3 pièces',
      tailor: 'Moussa Sow',
      price: '45 000 FCFA',
      emoji: '🤵',
    },
    {
      id: 7,
      name: 'Chemise bazin',
      tailor: 'Ibrahim Badji',
      price: '12 000 FCFA',
      emoji: '👔',
    },
    {
      id: 8,
      name: 'Kaftan moderne',
      tailor: 'Moussa Sow',
      price: '20 000 FCFA',
      emoji: '🧣',
    },
  ],
  enfant: [
    {
      id: 9,
      name: 'Uniforme scolaire',
      tailor: 'Ibrahim Badji',
      price: '8 000 FCFA',
      emoji: '🎒',
    },
    {
      id: 10,
      name: 'Tenue fête enfant',
      tailor: 'Ibrahim Badji',
      price: '10 000 FCFA',
      emoji: '🎉',
    },
    {
      id: 11,
      name: 'Boubou enfant',
      tailor: 'Ibrahim Badji',
      price: '7 000 FCFA',
      emoji: '👦',
    },
    {
      id: 12,
      name: 'Robe petite fille',
      tailor: 'Sokhna Fall',
      price: '9 000 FCFA',
      emoji: '👧',
    },
  ],
} as const;

type Cat = keyof typeof CATEGORIES;

export default function Modeles() {
  const [cat, setCat] = useState<Cat>('femme');
  const [saved, setSaved] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex gap-2">
        {(['femme', 'homme', 'enfant'] as Cat[]).map((k) => (
          <button
            key={k}
            onClick={() => setCat(k)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
            style={
              cat === k
                ? { backgroundColor: C.terra, color: 'white' }
                : {
                    backgroundColor: 'white',
                    color: '#4b5563',
                    border: '1px solid #e5e7eb',
                  }
            }
          >
            {k === 'femme'
              ? '👩 Femme'
              : k === 'homme'
              ? '👨 Homme'
              : '👶 Enfant'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES[cat].map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="text-4xl text-center mb-2">{m.emoji}</div>
            <p className="font-medium text-gray-800 text-sm text-center">
              {m.name}
            </p>
            <p className="text-xs text-center mt-1" style={{ color: C.terra }}>
              {m.price}
            </p>
            <p className="text-xs text-gray-400 text-center mt-0.5">
              {m.tailor}
            </p>
            <button
              onClick={() => toggle(m.id)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 border rounded-xl py-1.5 text-xs font-medium"
              style={{ borderColor: '#f3d9c6', color: C.terra }}
            >
              <Heart size={12} fill={saved.includes(m.id) ? C.terra : 'none'} />
              {saved.includes(m.id) ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
