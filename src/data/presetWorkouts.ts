import { Workout, DayOfWeek } from '../types';

export const PRESET_WORKOUTS: Record<DayOfWeek, Omit<Workout, 'id' | 'user_id' | 'created_at'>> = {
  segunda: {
    dia_semana: 'segunda',
    title: 'Peito e Tríceps',
    target_muscles: 'Peitoral Superior, Médio, Tríceps Braquial & Deltoide Anterior',
    completed: false,
    tempo_total: 0,
    exercises: [
      {
        id: 'ex-seg-1',
        workout_id: 'w-segunda',
        name: 'Flexão de braço clássica',
        series: 4,
        repeticoes: '4x12',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
        description: 'Mantenha o corpo alinhado da cabeça aos pés, abdômen contraído e cotovelos em ângulo de 45 graus.',
        target_muscle: 'Peitoral & Tríceps'
      },
      {
        id: 'ex-seg-2',
        workout_id: 'w-segunda',
        name: 'Flexão declinada (pés elevados)',
        series: 3,
        repeticoes: '3x10',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
        description: 'Aapoie os pés em uma cadeira ou sofá para focar a carga no peitoral superior.',
        target_muscle: 'Peitoral Superior'
      },
      {
        id: 'ex-seg-3',
        workout_id: 'w-segunda',
        name: 'Flexão diamante',
        series: 3,
        repeticoes: '3x8',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        description: 'Junte os polegares e indicadores formando um diamante. Foco intenso na cabeça lateral do tríceps.',
        target_muscle: 'Tríceps Isolado'
      }
    ]
  },
  terca: {
    dia_semana: 'terca',
    title: 'Costas e Bíceps',
    target_muscles: 'Dorsais, Trapézio, Bíceps & Antebraço',
    completed: false,
    tempo_total: 0,
    exercises: [
      {
        id: 'ex-ter-1',
        workout_id: 'w-terca',
        name: 'Barra fixa (ou puxada na porta/toalha)',
        series: 4,
        repeticoes: '4xFalha',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
        description: 'Empunhadura pronada ou supinada. Puxe o peito em direção à barra espremendo as escápulas no topo.',
        target_muscle: 'Dorsais & Bíceps'
      },
      {
        id: 'ex-ter-2',
        workout_id: 'w-terca',
        name: 'Remada invertida na mesa',
        series: 4,
        repeticoes: '4x10',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=800&auto=format&fit=crop',
        description: 'Deite embaixo de uma mesa firme, segure na borda e puxe o tórax até a borda.',
        target_muscle: 'Miolo de Costas'
      },
      {
        id: 'ex-ter-3',
        workout_id: 'w-terca',
        name: 'Rosca concentrada com mochila',
        series: 3,
        repeticoes: '3x12',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
        description: 'Use uma mochila com livros para peso. Mantenha os cotovelos fixos ao lado do tronco.',
        target_muscle: 'Bíceps Braquial'
      }
    ]
  },
  quarta: {
    dia_semana: 'quarta',
    title: 'Pernas e Ombros',
    target_muscles: 'Quadríceps, Glúteos, Isquiotibiais & Deltoides',
    completed: false,
    tempo_total: 0,
    exercises: [
      {
        id: 'ex-qua-1',
        workout_id: 'w-quarta',
        name: 'Agachamento profundo',
        series: 4,
        repeticoes: '4x15',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
        description: 'Pés na largura dos ombros, desça o quadril abaixo da linha dos joelhos mantendo o peito aberto.',
        target_muscle: 'Quadríceps & Glúteos'
      },
      {
        id: 'ex-qua-2',
        workout_id: 'w-quarta',
        name: 'Afundo alternado',
        series: 3,
        repeticoes: '3x12 por perna',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop',
        description: 'Dê um passo à frente flexionando ambos os joelhos em 90 graus.',
        target_muscle: 'Glúteos & Posterior'
      },
      {
        id: 'ex-qua-3',
        workout_id: 'w-quarta',
        name: 'Elevação lateral com garrafas/mochila',
        series: 3,
        repeticoes: '3x15',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
        description: 'Eleve os braços lateralmente até a altura dos ombros com controle na descida.',
        target_muscle: 'Deltoide Lateral'
      },
      {
        id: 'ex-qua-4',
        workout_id: 'w-quarta',
        name: 'Flexão Pike (ombros)',
        series: 3,
        repeticoes: '3x8',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
        description: 'Eleve o quadril formando um "V" invertido. Desça a cabeça suavemente em direção ao chão.',
        target_muscle: 'Deltoide Anterior & Ombro'
      }
    ]
  },
  quinta: {
    dia_semana: 'quinta',
    title: 'Descanso Ativo',
    target_muscles: 'Mobilidade, Flexibilidade & Regeneração Cardiovascular',
    completed: false,
    tempo_total: 0,
    is_rest_day: true,
    rest_type: 'active',
    exercises: [
      {
        id: 'ex-qui-1',
        workout_id: 'w-quinta',
        name: 'Alongamento dinâmico & Mobilidade',
        series: 1,
        repeticoes: '15 minutos',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        description: 'Rotação de tronco, alongamento de posteriores e abertura de quadril para aliviar a tensão.',
        target_muscle: 'Corpo Todo',
        is_time_based: true,
        target_seconds: 900
      },
      {
        id: 'ex-qui-2',
        workout_id: 'w-quinta',
        name: 'Caminhada leve ao ar livre ou esteira',
        series: 1,
        repeticoes: '20 minutos',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
        description: 'Caminhada contínua em ritmo moderado para estimular a circulação e fluxo sanguíneo.',
        target_muscle: 'Sistema Cardio',
        is_time_based: true,
        target_seconds: 1200
      }
    ]
  },
  sexta: {
    dia_semana: 'sexta',
    title: 'Core & Abdomen',
    target_muscles: 'Reto Abdominal, Oblíquos & Estabilizadores Lombares',
    completed: false,
    tempo_total: 0,
    exercises: [
      {
        id: 'ex-sex-1',
        workout_id: 'w-sexta',
        name: 'Prancha frontal isotônica',
        series: 3,
        repeticoes: '3x40s',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop',
        description: 'Apoie os antebraços e pontas dos pés. Mantenha quadril neutro e glúteos contraídos.',
        target_muscle: 'Core Profundo',
        is_time_based: true,
        target_seconds: 40
      },
      {
        id: 'ex-sex-2',
        workout_id: 'w-sexta',
        name: 'Abdominal infra (elevação de pernas)',
        series: 4,
        repeticoes: '4x15',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
        description: 'Deitado de costas, eleve as pernas estendidas até 90 graus sem tirar a lombar do chão.',
        target_muscle: 'Abdômen Inferior'
      },
      {
        id: 'ex-sex-3',
        workout_id: 'w-sexta',
        name: 'Abdominal tradicional (supra)',
        series: 4,
        repeticoes: '4x20',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
        description: 'Flexione o tronco aproximando as costelas do quadril soltando o ar no topo.',
        target_muscle: 'Abdômen Superior'
      },
      {
        id: 'ex-sex-4',
        workout_id: 'w-sexta',
        name: 'Prancha lateral sustentada',
        series: 3,
        repeticoes: '3x30s por lado',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800&auto=format&fit=crop',
        description: 'Apoie um antebraço de lado, empurrando o chão para manter o quadril bem elevado.',
        target_muscle: 'Oblíquos',
        is_time_based: true,
        target_seconds: 30
      }
    ]
  },
  sabado: {
    dia_semana: 'sabado',
    title: 'Full Body (Reforço)',
    target_muscles: 'Músculos Principais & Pontos Fracos',
    completed: false,
    tempo_total: 0,
    exercises: [
      {
        id: 'ex-sab-1',
        workout_id: 'w-sabado',
        name: 'Agachamento com salto explosivo',
        series: 3,
        repeticoes: '3x12',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
        description: 'Agache e salte com máxima explosão vertical, amortecendo suavemente na descida.',
        target_muscle: 'Potência de Pernas'
      },
      {
        id: 'ex-sab-2',
        workout_id: 'w-sabado',
        name: 'Flexão de braço isométrica no fundo',
        series: 3,
        repeticoes: '3x12',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
        description: 'Flexão mantendo 1 segundo de pausa no ponto mais baixo antes de subir.',
        target_muscle: 'Peitoral & Tríceps'
      },
      {
        id: 'ex-sab-3',
        workout_id: 'w-sabado',
        name: 'Polichinelos rápidos (Cardio)',
        series: 3,
        repeticoes: '3x30',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        description: 'Mantenha o ritmo acelerado coordenando braços e pernas.',
        target_muscle: 'Condicionamento Cardio'
      },
      {
        id: 'ex-sab-4',
        workout_id: 'w-sabado',
        name: 'Prancha com elevação alternada de perna',
        series: 3,
        repeticoes: '3x45s',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop',
        description: 'Em prancha, eleve uma perna de cada vez sem oscilar o quadril.',
        target_muscle: 'Core & Glúteos',
        is_time_based: true,
        target_seconds: 45
      }
    ]
  },
  domingo: {
    dia_semana: 'domingo',
    title: 'Descanso Total',
    target_muscles: 'Recuperação Muscular & Repouso Completo',
    completed: false,
    tempo_total: 0,
    is_rest_day: true,
    rest_type: 'total',
    exercises: [
      {
        id: 'ex-dom-1',
        workout_id: 'w-domingo',
        name: 'Recuperação & Meditação guiada',
        series: 1,
        repeticoes: 'Dia Livre',
        completed: false,
        completed_series: 0,
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
        description: 'Aproveite o dia para repousar os músculos, hidratar-se e renovar as energias para a próxima semana!',
        target_muscle: 'Recuperação do CNS'
      }
    ]
  }
};
