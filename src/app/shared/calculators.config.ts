export const CALCULATORS_CONFIG = [
  {
    category: 'Tempo',
    path: '/tempo',
    calculators: [
      { name: 'Manipulação de Datas', route: 'manipulacao', icon: 'schedule' }
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
