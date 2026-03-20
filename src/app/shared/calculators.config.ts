export const CALCULATORS_CONFIG = [
  {
    category: 'Tempo',
    path: '/tempo',
    calculators: [
      { name: 'Manipulação de Datas', route: 'manipulacao', icon: 'schedule' },
      { name: 'Diferença entre Datas', route: 'diferenca', icon: 'date_range' },
      { name: 'Dias Úteis', route: 'dias-uteis', icon: 'work_history' }
    ]
  },
  {
    category: 'Finanças',
    path: '/financas',
    calculators: [
      { name: 'Juros Simples', route: 'juros-simples', icon: 'payments' },
      { name: 'Juros Compostos', route: 'juros-compostos', icon: 'trending_up' }
    ]
  }
];
