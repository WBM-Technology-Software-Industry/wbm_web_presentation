export interface StatItem {
  id: string;
  metric: string;
  title: string;
  description: string;
  source: string;
  iconName: 'users' | 'chart' | 'integration';
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: 'antenna' | 'brain' | 'control' | 'decision';
}

export interface PartnerItem {
  name: string;
  subtitle?: string;
  logoUrl: string;
  associatedLogos?: { name: string; logoUrl: string }[];
}

export interface ContactInfo {
  whatsapp: {
    display: string;
    raw: string;
    url: string;
    message: string;
  };
  phone: {
    display: string;
    raw: string;
    url: string;
  };
  email: {
    display: string;
    url: string;
  };
  website: {
    display: string;
    url: string;
  };
}

export const contactInfo: ContactInfo = {
  whatsapp: {
    display: '+55 31 99566 0752',
    raw: '5531995660752',
    url: 'https://wa.me/5531995660752?text=Ol%C3%A1!%20Vim%20pela%20Apresenta%C3%A7%C3%A3o%20Digital%20da%20WBM%20Technology%20e%20gostaria%20de%20conversar.',
    message: 'Olá! Vim pela Apresentação Digital da WBM Technology e gostaria de conversar.'
  },
  phone: {
    display: '+55 31 3347 1803',
    raw: '+553133471803',
    url: 'tel:+553133471803'
  },
  email: {
    display: 'weber@wbmtechnology.com.br',
    url: 'mailto:weber@wbmtechnology.com.br'
  },
  website: {
    display: 'www.wbmtechnology.com.br',
    url: 'https://www.wbmtechnology.com.br'
  }
};

export const slide1Stats: StatItem[] = [
  {
    id: 'mao-de-obra',
    metric: '62,3%',
    title: 'MÃO DE OBRA',
    description: 'das empresas pesquisadas enfrentavam dificuldades para contratar ou reter profissionais.',
    source: 'FGV IBRE - 2025',
    iconName: 'users'
  },
  {
    id: 'decisoes-sem-dados',
    metric: '53%',
    title: 'DECISÕES SEM DADOS',
    description: 'dos líderes industriais tomam decisões importantes sem acesso a dados confiáveis em tempo real.',
    source: 'AVEVA - 2024',
    iconName: 'chart'
  },
  {
    id: 'integracao',
    metric: '48%',
    title: 'INTEGRAÇÃO',
    description: 'dos fabricantes pesquisados consideram a complexidade de integração um grande desafio para modernizar suas operações.',
    source: 'IoT Analytics · 2024',
    iconName: 'integration'
  }
];

export const slide2Steps: ProcessStep[] = [
  {
    id: 'coleta',
    number: '01',
    title: 'COLETA DE DADOS',
    description: 'Monitoramento de equipamentos e processos em tempo real.',
    iconName: 'antenna'
  },
  {
    id: 'analise',
    number: '02',
    title: 'ANÁLISE COM IA',
    description: 'Análise dos dados para identificar padrões, anomalias e oportunidades de melhoria.',
    iconName: 'brain'
  },
  {
    id: 'controle',
    number: '03',
    title: 'CONTROLE DE PROCESSO',
    description: 'Automação e ajustes operacionais com base nas condições reais do processo.',
    iconName: 'control'
  },
  {
    id: 'decisao',
    number: '04',
    title: 'TOMADA DE DECISÃO',
    description: 'Decisões mais rápidas e assertivas, fundamentadas em dados confiáveis.',
    iconName: 'decision'
  }
];

export const slide3Content = {
  title: 'WBM TECHNOLOGY',
  p1Prefix: 'A WBM Technology ',
  p1Highlight1: 'desenvolve e integra ',
  p1Middle: 'soluções de instrumentação, automação e IoT para ',
  p1Highlight2: 'monitoramento, supervisão e controle',
  p1Suffix: ' de equipamentos e processos industriais.',
  
  p2Highlight1: 'Nosso Negócio',
  p2Middle1: ' é ajudar as empresas a ter mais controle e visibilidade de suas operações, por meio de ',
  p2Highlight2: 'soluções próprias ',
  p2Middle2: 'e conceitos da ',
  p2Highlight3: 'Indústria 4.0',

  footerTop: 'Da informação ao controle.',
  footerBottom: 'Do controle ao resultado.',
  teamImage: '/assets/wbm-team.jpg'
};

export const slide4Content = {
  title: 'CLIENTES E PARCEIROS',
  clientsTitle: 'CLIENTES',
  clientsImage: '/assets/clients-logos.png',
  partnersTitle: 'PARCEIROS',
  partners: [
    {
      name: 'AQUALABO',
      subtitle: 'Smart water solutions',
      logoUrl: '/assets/partner-aqualabo.png'
    },
    {
      name: 'TESTARI',
      logoUrl: '/assets/partner-testari.png',
      associatedLogos: [
        { name: 'GWF', logoUrl: '' },
        { name: 'KELLER', logoUrl: '/assets/partner-keller.png' },
        { name: 'GUTERMANN', logoUrl: '/assets/partner-gutermann.png' }
      ]
    }
  ],
  footerTop: 'Inovação, experiência e capacidade técnica',
  footerBottom: 'Do desenvolvimento à aplicação industrial.'
};

export const slide5Content = {
  title: 'VAMOS CONVERSAR?',
  headline1: 'Sua operação tem desafios.',
  headline2: 'Nós desenvolvemos soluções.',
  p1: 'Da instrumentação à inteligência artificial, conectamos equipamentos, dados e pessoas para transformar desafios em oportunidades.',
  p2: 'Vamos descobrir juntos a próxima oportunidade de melhoria da sua operação?',
  diagramImage: '/assets/vcr-solution.png'
};

export const slidesMeta = [
  { id: 1, title: 'Cenário', hash: 'cenario' },
  { id: 2, title: 'Como Superar esses Desafios', hash: 'como-superar' },
  { id: 3, title: 'WBM Technology', hash: 'wbm-technology' },
  { id: 4, title: 'Clientes e Parceiros', hash: 'clientes-parceiros' },
  { id: 5, title: 'Vamos Conversar?', hash: 'contato' },
];
