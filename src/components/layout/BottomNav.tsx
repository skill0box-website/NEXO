import { Home, Scissors, Shirt, ShoppingBag } from 'lucide-react';
import { C } from '@/constants/theme';

const TABS = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'tailleurs', icon: Scissors, label: 'Tailleurs' },
  { id: 'modeles', icon: Shirt, label: 'Modèles' },
  { id: 'pret', icon: ShoppingBag, label: 'Boutiques' },
];

interface Props {
  active: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors"
          style={{ color: active === t.id ? C.terra : '#9ca3af' }}
        >
          <t.icon size={20} />
          <span className="text-xs font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
