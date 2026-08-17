import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { C } from '@/constants/theme';

const QUESTIONS = [
  {
    q: 'Tu es à la recherche de :',
    options: [
      { label: 'Un tailleur de confiance', pct: 47 },
      { label: 'Gérer mes commandes (je suis tailleur)', pct: 18 },
      { label: 'Trouver des modèles', pct: 23 },
      { label: 'Acheter prêt-à-porter', pct: 12 },
    ],
  },
  {
    q: 'Ton plus grand problème avec les tailleurs ?',
    options: [
      { label: 'Les retards de livraison', pct: 58 },
      { label: 'Difficile de trouver un bon tailleur', pct: 21 },
      { label: 'Communication compliquée', pct: 14 },
      { label: 'Prix pas clairs', pct: 7 },
    ],
  },
  {
    q: 'Tu commandes combien de fois par an ?',
    options: [
      { label: '1 à 2 fois', pct: 39 },
      { label: '3 à 5 fois', pct: 34 },
      { label: 'Plus de 5 fois', pct: 17 },
      { label: "C'est mon métier", pct: 10 },
    ],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const q = QUESTIONS[step];

  const pick = (label: string) => {
    setPicked(label);
    setTimeout(() => setRevealed(true), 150);
  };

  const next = () => {
    setPicked(null);
    setRevealed(false);
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
    else navigate('/auth');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{
        background: `linear-gradient(135deg, ${C.navy}, ${C.terraDark})`,
      }}
    >
      <div className="mb-8 text-center">
        <div className="text-4xl mb-2">✂️</div>
        <h1 className="text-2xl font-bold text-white">CoutureLink</h1>
        <p className="text-sm mt-1" style={{ color: '#f3d9c6' }}>
          La couture, réinventée au Sénégal
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="flex gap-1.5 mb-5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i <= step ? C.terra : '#e5e7eb' }}
            />
          ))}
        </div>

        <p className="text-gray-800 font-semibold text-base mb-4">{q.q}</p>

        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isPicked = picked === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => !picked && pick(opt.label)}
                disabled={!!picked}
                className="relative w-full text-left px-4 py-3 rounded-xl border-2
                  text-sm font-medium transition-all overflow-hidden"
                style={{
                  borderColor: isPicked
                    ? C.terra
                    : picked
                    ? '#f3f4f6'
                    : '#fde6d8',
                  color: picked && !isPicked ? '#9ca3af' : '#374151',
                }}
              >
                {revealed && (
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                    style={{ width: `${opt.pct}%`, backgroundColor: '#f3d9c6' }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-between">
                  <span
                    style={{
                      color: isPicked ? C.terraDark : undefined,
                      fontWeight: isPicked ? 600 : undefined,
                    }}
                  >
                    {opt.label}
                  </span>
                  {revealed && (
                    <span
                      className="font-bold"
                      style={{ color: isPicked ? C.terraDark : '#6b7280' }}
                    >
                      {opt.pct}%
                    </span>
                  )}
                  {isPicked && !revealed && (
                    <CheckCircle2 size={16} style={{ color: C.terra }} />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-center text-gray-500">
              <span className="font-semibold" style={{ color: C.terra }}>
                {q.options.find((o) => o.label === picked)?.pct}%
              </span>{' '}
              des utilisateurs ont répondu comme toi 🎉
            </p>
            <button
              onClick={next}
              className="w-full text-white font-semibold py-3 rounded-xl text-sm"
              style={{ backgroundColor: C.navy }}
            >
              {step < QUESTIONS.length - 1 ? 'Continuer →' : "C'est parti →"}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          {step + 1} / {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
}
