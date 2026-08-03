import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  User, 
  Mail, 
  Camera, 
  Sparkles, 
  Check, 
  RotateCcw,
  ShieldCheck,
  Target,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import confetti from 'canvas-confetti';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop'
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose }) => {
  const [state, actions] = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(state.user?.avatar_url || PRESET_AVATARS[0]);
  const [goal, setGoal] = useState('ganho_massa');
  const [resetDataToZero, setResetDataToZero] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas to ensure fast performance and local storage safety
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedBase64);
        } else {
          setAvatarUrl(event.target?.result as string);
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (resetDataToZero) {
      actions.registerCleanProfile({
        name: name.trim() || 'Atleta Treino Home',
        email: email.trim() || 'atleta@treinohome.app',
        avatarUrl
      });
    } else {
      actions.updateProfile(name.trim() || 'Atleta Treino Home', avatarUrl);
    }

    setSuccessMsg(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          id="close-profile-setup-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Novo Cadastro do Perfil</span>
          </div>
          <h2 className="text-2xl font-black text-white">Configurar Perfil & Foto</h2>
          <p className="text-xs text-zinc-400">
            Personalize sua imagem e zere seus dados iniciais para iniciar sua jornada do zero!
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-lime-500/20 border border-lime-500/40 text-lime-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
            <Check className="w-5 h-5" />
            <span>Perfil configurado e dados zerados com sucesso! Bons treinos!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 block">Foto de Perfil (Upload do Dispositivo)</label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-lime-400/80 shadow-lg shadow-lime-500/10"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Alterar Foto"
                >
                  <Camera className="w-6 h-6 text-lime-400" />
                </button>
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-lime-400 text-black font-extrabold text-xs hover:bg-lime-300 transition-all flex items-center space-x-2 shadow-md shadow-lime-500/10"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Carregando...' : 'Fazer Upload da Foto'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Envie um arquivo PNG, JPG ou WebP do seu celular ou computador.
                </p>
              </div>
            </div>

            {/* Quick Avatar Selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-zinc-400">Ou escolha uma imagem pré-definida:</span>
              <div className="flex space-x-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                      avatarUrl === url ? 'border-lime-400 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Seu Nome / Apelido no App</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>
            </div>

            {/* Objective Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Objetivo Principal de Treino</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'ganho_massa', label: 'Ganhar Massa Muscular' },
                  { id: 'perda_gordura', label: 'Emagrecer & Definir' },
                  { id: 'calistenia', label: 'Calistenia e Força' },
                  { id: 'saude', label: 'Saúde & Disposição' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`p-2.5 rounded-xl font-bold border text-left transition-all ${
                      goal === item.id 
                        ? 'bg-lime-500/10 border-lime-400 text-lime-400' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset to Zero Option */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-lime-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-lime-400" />
                <span className="text-xs font-extrabold text-white">Zerar Dados Iniciais (Começar do Zero)</span>
              </div>
              <input
                type="checkbox"
                id="resetDataToZero"
                checked={resetDataToZero}
                onChange={e => setResetDataToZero(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-lime-400 focus:ring-0 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ao marcar esta opção, seus dados de treinos, XP e nível serão iniciados em **Nível 1 com 0 XP** para você começar a utilizar o aplicativo com progresso limpo.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="save-clean-profile-btn"
            className="w-full py-4 rounded-2xl bg-lime-400 text-black font-extrabold text-sm shadow-xl shadow-lime-500/20 hover:bg-lime-300 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Salvar Perfil e Começar Treino</span>
          </button>
        </form>
      </div>
    </div>
  );
};
