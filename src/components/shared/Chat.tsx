import { useState } from 'react';
import { ArrowLeft, Send, Image, X } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { C } from '@/constants/theme';

interface Props {
  commandeId: string;
  currentUserId: string;
  otherName: string;
  onBack: () => void;
}

export default function Chat({
  commandeId,
  currentUserId,
  otherName,
  onBack,
}: Props) {
  const { messages, send } = useMessages(commandeId);
  const [input, setInput] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() && !emoji) return;
    await send(currentUserId, input, emoji || undefined);
    setInput('');
    setEmoji(null);
  };

  const EMOJIS = ['👗', '👔', '🧥', '🥻', '👘', '🤵'];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})`,
        }}
      >
        <button onClick={onBack}>
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: C.navy }}
        >
          {otherName[0]}
        </div>
        <p className="text-white font-semibold text-sm">{otherName}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-10">
            Pas encore de messages — commencez la conversation !
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.sender_id === currentUserId;
          const time = new Date(m.created_at).toLocaleTimeString('fr', {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? 'text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                }`}
                style={isMe ? { backgroundColor: C.terra } : undefined}
              >
                {m.img_url && <div className="mb-2 text-2xl">{m.img_url}</div>}
                {m.text && <p className="text-sm">{m.text}</p>}
                <p
                  className={`text-xs mt-1 ${
                    isMe ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aperçu emoji sélectionné */}
      {emoji && (
        <div className="px-4 pb-1 flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <button onClick={() => setEmoji(null)}>
            <X size={14} className="text-gray-400" />
          </button>
          <span className="text-xs text-gray-400">Modèle joint</span>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2">
        <button
          onClick={() =>
            setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)])
          }
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#fdebe3' }}
        >
          <Image size={16} style={{ color: C.terra }} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() && !emoji}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: !input.trim() && !emoji ? '#e5e7eb' : C.terra,
          }}
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}
