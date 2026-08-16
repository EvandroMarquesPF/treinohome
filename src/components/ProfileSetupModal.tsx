import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Upload, 
  User, 
  Mail, 
  Camera, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Target, 
  Activity, 
  Calendar, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Scale,
  Ruler,
  Dumbbell,
  HeartPulse,
  Award
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Profile } from '../types';
import confetti from 'canvas-confetti';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop'
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, initialStep = 1 }) => {
  const [state, actions] = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(initialStep);

  // Form State
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(state.user?.avatar_url || PRESET_AVATARS[0]);
  const [gender, setGender] = useState<'masculino' | 'feminino' | 'outro' | 'nao_informado'>(
    state.user?.gender || 'masculino'
  );
  const [age, setAge] = useState<number>(state.user?.age || 26);
  const [weight, setWeight] = useState<number>(state.user?.weight || 72);
  const [height, setHeight] = useState<number>(state.user?.height || 175);
  
  const [goal, setGoal] = useState<'hipertrofia' | 'emagrecimento' | 'definicao' | 'forca' | 'resistencia' | 'saude'>(
    state.user?.fitness_goal || 'hipertrofia'
  );
  const [experienceLevel, setExperienceLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>(
    state.user?.experience_level || 'iniciante'
  );
  const [weeklyDays, setWeeklyDays] = useState<number>(state.user?.weekly_days_target || 5);
  const [sessionDuration, setSessionDuration] = useState<number>(state.user?.session_duration_minutes || 30);
  const [limitations, setLimitations] = useState<string[]>(state.user?.limitations || ['nenhuma']);

  const [resetDataToZero, setResetDataToZero] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Calculate BMI (IMC)
  const bmiInfo = useMemo(() => {
    if (!weight || !height || height <= 0) return { value: 0, label: 'Indefinido', color: 'text-zinc-400', bg: 'bg-zinc-50 border-zinc-200' };
    const heightInMeters = height / 100;
    const imc = weight / (heightInMeters * heightInMeters);
    const rounded = Number(imc.toFixed(1));

    if (rounded < 18.5) return { value: rounded, label: 'Abaixo do Peso', color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-500/30' };
    if (rounded <= 24.9) return { value: rounded, label: 'Peso Ideal / Saudável', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30' };
    if (rounded <= 29.9) return { value: rounded, label: 'Sobrepeso Leve', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30' };
    return { value: rounded, label: 'Obesidade', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30' };
  }, [weight, height]);

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

  const toggleLimitation = (key: string) => {
    if (key === 'nenhuma') {
      setLimitations(['nenhuma']);
      return;
    }

    let next = limitations.filter(l => l !== 'nenhuma');
    if (next.includes(key)) {
      next = next.filter(l => l !== key);
      if (next.length === 0) next = ['nenhuma'];
    } else {
      next.push(key);
    }
    setLimitations(next);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleFinalSave = () => {
    const profilePayload: Partial<Profile> = {
      name: name.trim() || 'Atleta Treino Home',
      email: email.trim() || 'atleta@treinohome.app',
      avatar_url: avatarUrl,
      gender,
      age: Number(age) || 25,
      weight: Number(weight) || 70,
      height: Number(height) || 175,
      fitness_goal: goal,
      experience_level: experienceLevel,
      weekly_days_target: Number(weeklyDays) || 5,
      session_duration_minutes: Number(sessionDuration) || 30,
      limitations,
      onboarding_completed: true
    };

    if (resetDataToZero) {
      actions.registerCleanProfile({
        name: profilePayload.name!,
        email: profilePayload.email!,
        avatarUrl: profilePayload.avatar_url,
        gender: profilePayload.gender,
        age: profilePayload.age,
        weight: profilePayload.weight,
        height: profilePayload.height,
        fitness_goal: profilePayload.fitness_goal,
        experience_level: profilePayload.experience_level,
        weekly_days_target: profilePayload.weekly_days_target,
        session_duration_minutes: profilePayload.session_duration_minutes,
        limitations: profilePayload.limitations,
        onboarding_completed: true
      });
    } else {
      actions.updateAthleteProfile(profilePayload);
    }

    setSuccessMsg(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-white via-white to-emerald-50/80 border border-emerald-500/25 dark:bg-gradient-to-br dark:from-black dark:via-zinc-950 dark:to-emerald-950/80 dark:border-emerald-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-zinc-900 dark:text-zinc-100 my-auto max-h-[92vh] overflow-y-auto transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-emerald-50/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          id="close-profile-setup-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-800 dark:text-lime-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Avaliação do Atleta & Cadastro</span>
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Passo {step} de 4
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              {step === 1 && 'Identificação & Foto do Perfil'}
              {step === 2 && 'Dados Corporais & Biometria'}
              {step === 3 && 'Objetivo & Nível de Calistenia'}
              {step === 4 && 'Rotina Semanal & Confirmação'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              {step === 1 && 'Personalize como seu nome e foto serão exibidos nas conquistas e treinos.'}
              {step === 2 && 'Informações físicas essenciais para calcular seu IMC e calibrar o ritmo dos treinos.'}
              {step === 3 && 'Escolha sua meta principal e sua experiência para personalizar a intensidade.'}
              {step === 4 && 'Defina sua disponibilidade e revise seu plano antes de iniciar!'}
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-emerald-500/10 dark:bg-zinc-950 h-2 rounded-full overflow-hidden border border-emerald-500/20 dark:border-zinc-800">
            <div 
              className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 dark:text-lime-300 text-xs font-bold flex items-center space-x-2 animate-bounce">
            <Check className="w-5 h-5 text-emerald-600 dark:text-lime-400" />
            <span>Perfil e ficha do atleta configurados com sucesso! Bons treinos!</span>
          </div>
        )}

        <form onSubmit={handleNextStep} className="space-y-6">
          
          {/* STEP 1: IDENTIFICAÇÃO & FOTO */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-3">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Foto de Perfil</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-lime-400 shadow-md shadow-lime-500/10"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-lime-400" />
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-xl bg-lime-400 text-black font-extrabold text-xs hover:opacity-90 transition-all inline-flex items-center space-x-2 shadow-md shadow-lime-500/10 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Processando...' : 'Enviar Foto do Dispositivo'}</span>
                    </button>

                    <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                      <span className="text-[11px] text-zinc-500 self-center mr-1">Presets:</span>
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            avatarUrl === url ? 'border-lime-500 scale-110' : 'border-zinc-300 dark:border-zinc-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nome do Atleta *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Silva"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/90 dark:bg-zinc-950 border border-emerald-500/25 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">E-mail Principal</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/90 dark:bg-zinc-950 border border-emerald-500/25 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Gênero / Preferência</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'masculino', label: 'Masculino' },
                      { id: 'feminino', label: 'Feminino' },
                      { id: 'outro', label: 'Outro / Prefiro não dizer' }
                    ].map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGender(g.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          gender === g.id
                            ? 'bg-lime-500/20 border-lime-500 text-lime-900 dark:text-lime-400 dark:bg-emerald-500/15'
                            : 'bg-white/80 dark:bg-zinc-950/80 border-emerald-500/20 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DADOS CORPORAIS & BIOMETRIA */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Idade */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    <span>Idade (anos)</span>
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-emerald-500/25 dark:border-zinc-700 rounded-xl px-3 py-2 text-base font-extrabold text-zinc-900 dark:text-white text-center focus:outline-none focus:border-lime-500"
                  />
                  <div className="flex justify-center gap-1 text-[11px] text-zinc-500">
                    <span>Anos completos</span>
                  </div>
                </div>

                {/* Peso */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Scale className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Peso Atual (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={30}
                    max={250}
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-emerald-500/25 dark:border-zinc-700 rounded-xl px-3 py-2 text-base font-extrabold text-zinc-900 dark:text-white text-center focus:outline-none focus:border-lime-500"
                  />
                  <div className="flex justify-center gap-1 text-[11px] text-zinc-500">
                    <span>Ex: 75.5 kg</span>
                  </div>
                </div>

                {/* Altura */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Ruler className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Altura (cm)</span>
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={230}
                    value={height}
                    onChange={e => setHeight(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-emerald-500/25 dark:border-zinc-700 rounded-xl px-3 py-2 text-base font-extrabold text-zinc-900 dark:text-white text-center focus:outline-none focus:border-lime-500"
                  />
                  <div className="flex justify-center gap-1 text-[11px] text-zinc-500">
                    <span>Ex: 178 cm</span>
                  </div>
                </div>

              </div>

              {/* BMI Live Feedback Banner */}
              <div className={`p-4 rounded-2xl border ${bmiInfo.bg} flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <Activity className={`w-6 h-6 ${bmiInfo.color}`} />
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Índice de Massa Corporal Calculado (IMC):</div>
                    <div className={`text-base font-extrabold ${bmiInfo.color}`}>
                      {bmiInfo.value} kg/m² • {bmiInfo.label}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono hidden sm:inline">OMS Padrão</span>
              </div>
            </div>
          )}

          {/* STEP 3: OBJETIVO & NÍVEL DE CALISTENIA */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Qual é o seu objetivo principal?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'hipertrofia', title: 'Hipertrofia Muscular', desc: 'Ganho de massa magra e volume com peso corporal.' },
                    { id: 'definicao', title: 'Definição & Queima', desc: 'Aumentar gasto calórico e tônus muscular.' },
                    { id: 'forca', title: 'Força Calistênica', desc: 'Progressão para barras, flexões avançadas e estáticos.' },
                    { id: 'saude', title: 'Saúde & Resistência', desc: 'Mais energia, postura e condicionamento físico diário.' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        goal === item.id 
                          ? 'bg-lime-500/20 border-lime-500 text-zinc-900 dark:text-white ring-1 ring-lime-400/40 shadow-sm' 
                          : 'bg-white/80 dark:bg-zinc-950/80 border-emerald-500/20 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black text-lime-800 dark:text-lime-400">{item.title}</div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Qual é o seu nível de experiência atual?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante', label: 'Iniciante', sub: 'Começando do zero' },
                    { id: 'intermediario', label: 'Intermediário', sub: 'Já faço flexões' },
                    { id: 'avancado', label: 'Avançado', sub: 'Treino intenso' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        experienceLevel === lvl.id
                          ? 'bg-lime-500/20 border-lime-500 text-zinc-900 dark:text-white ring-1 ring-lime-400/40 shadow-sm'
                          : 'bg-white/80 dark:bg-zinc-950/80 border-emerald-500/20 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black text-lime-800 dark:text-lime-400">{lvl.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ROTINA SEMANAL & CONFIRMAÇÃO */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Dias na Semana */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Meta de Treinos por Semana</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[3, 4, 5, 6].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setWeeklyDays(d)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          weeklyDays === d
                            ? 'bg-lime-400 text-black border-lime-400 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 border-emerald-500/25 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {d}x / sem
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tempo Disponível */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 dark:border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Tempo por Sessão</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {[
                      { min: 20, label: '20 min' },
                      { min: 30, label: '30 min' },
                      { min: 45, label: '45+ min' }
                    ].map(t => (
                      <button
                        key={t.min}
                        type="button"
                        onClick={() => setSessionDuration(t.min)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          sessionDuration === t.min
                            ? 'bg-lime-400 text-black border-lime-400 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 border-emerald-500/25 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Limitações Articulares */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Possui dores ou limitações articulares? (Opcional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'nenhuma', label: '100% Saudável' },
                    { id: 'joelhos', label: 'Joelhos' },
                    { id: 'ombros', label: 'Ombros' },
                    { id: 'coluna', label: 'Coluna / Lombar' }
                  ].map(lim => {
                    const isSelected = limitations.includes(lim.id);
                    return (
                      <button
                        key={lim.id}
                        type="button"
                        onClick={() => toggleLimitation(lim.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300'
                            : 'bg-white/80 dark:bg-zinc-950/80 border-emerald-500/20 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {lim.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset to Zero Checkbox */}
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Começar do Zero (Nível 1 • 0 XP)</div>
                  <div className="text-[11px] text-zinc-500">Inicia seu progresso com histórico limpo para seu novo ciclo de treinos.</div>
                </div>
                <input
                  type="checkbox"
                  checked={resetDataToZero}
                  onChange={e => setResetDataToZero(e.target.checked)}
                  className="w-4 h-4 rounded bg-white dark:bg-zinc-900 border-emerald-500/25 dark:border-zinc-700 text-lime-500 focus:ring-0 cursor-pointer ml-3"
                />
              </div>

            </div>
          )}

          {/* Stepper Bottom Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-500/20 dark:border-zinc-800/80">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-emerald-50/70 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-emerald-500/20 dark:border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 hover:opacity-90 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSave}
                id="finish-athlete-onboarding-btn"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-lime-500/20 hover:opacity-95 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Concluir Cadastro & Iniciar Treinos</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
