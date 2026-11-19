/**
 * WBM Technology — Catálogo Centralizado do Portfólio de Soluções
 * 
 * Regras mandatórias:
 * 1. Cada produto possui cadastro ÚNICO e estável (15 produtos cadastrados exatamente uma vez).
 * 2. As contextualizações específicas por mercado residem na tabela de vínculos (ProductUniverseContext).
 * 3. A arquitetura IoT é configurável e modular por produto/contexto, sem tecnologias proprietárias não validadas.
 * 4. Os textos de Desafio -> Solução -> Resultado são estritamente técnicos e factuais, sem promessas não validadas.
 * 5. Coordenadas dos universos ajustadas para visualização integrada sem cortes.
 */

export type UniverseId =
  | 'saneamento'
  | 'industria'
  | 'piscicultura'
  | 'bioflorestal'
  | 'energia'
  | 'pesquisa-laboratorios';

export type ProductId =
  | 'etsus'
  | 'control-flow'
  | 'parshall-monitor'
  | 'control-motors'
  | 'motors-monitor'
  | 'control-ar'
  | 'control-feed'
  | 'freezer-monitor'
  | 'control-dose'
  | 'energy-monitor'
  | 'control-damper'
  | 'flow-monitor'
  | 'temp-humidity-monitor'
  | 'ph-monitor'
  | 'level-monitor';

export type ProductStatus = 'comercial' | 'sob_consulta' | 'pendente_confirmacao';

export interface IoTStep {
  stepNumber: number;
  label: string;
  technology?: string;
  description: string;
  type: 'sensor' | 'hardware' | 'communication' | 'platform' | 'actuator';
}

export interface ProductWorkflowStep {
  step: string;
  title: string;
  description: string;
  iconType: 'measure' | 'device' | 'platform' | 'control' | 'actuator' | 'sample';
}

export interface ProductTechnicalSpecs {
  parameters?: string[];
  installation?: string;
  features?: string[];
  datasheetUrl?: string;
}

export interface Product {
  id: ProductId;
  name: string;
  category: 'Instrumentação & Monitoramento' | 'Automação & Controle' | 'Sistemas Integrados';
  shortDescription: string;
  shortLabel: string; // Descrição comercial muito curta exibida no nó
  status: ProductStatus;
  workflow?: ProductWorkflowStep[];
  technicalSpecs?: ProductTechnicalSpecs;
  /**
   * Arquitetura de conectividade IoT configurável por produto
   */
  defaultIotArchitecture?: IoTStep[];
  imagePlaceholder?: string;
}

export interface Universe {
  id: UniverseId;
  name: string;
  tagline: string;
  description: string;
  iconName: 'Droplets' | 'Factory' | 'Fish' | 'Trees' | 'Zap' | 'FlaskConical';
  /**
   * Coordenadas no espaço tecnológico contínuo (otimizadas para enquadramento no viewport)
   */
  coord: { x: number; y: number };
}

export interface ProductUniverseContext {
  productId: ProductId;
  universeId: UniverseId;
  /**
   * Estrutura comercial padronizada: DESAFIO -> SOLUÇÃO -> RESULTADO ESPERADO
   */
  challenge: string;
  solution: string;
  expectedResult: string;
  shortLabelOverride?: string; // Subtítulo contextualizado opcional para o nó
  applicationHighlight?: string;
  technicalNote?: string; // Observação técnica contextualizada de aplicação
  relatedProductIds?: ProductId[]; // Soluções complementares recomendadas no mesmo universo (máx 2)
  /**
   * Arquitetura IoT adaptada ao contexto do universo (caso divirja do padrão do produto)
   */
  specificIotArchitecture?: IoTStep[];
}

// ============================================================================
// 1. UNIVERSOS DE MERCADO (Posições espaciais equilibradas para viewport)
// ============================================================================
export const UNIVERSES: Record<UniverseId, Universe> = {
  saneamento: {
    id: 'saneamento',
    name: 'Saneamento',
    tagline: 'Água, Esgoto & Eficiência Hídrica',
    description: 'Monitoramento, automação e controle operacional para processos de captação, tratamento e distribuição.',
    iconName: 'Droplets',
    coord: { x: 0, y: -195 }, // Norte
  },
  industria: {
    id: 'industria',
    name: 'Indústria',
    tagline: 'Operação, Automação & Indústria 4.0',
    description: 'Supervisão de parâmetros operacionais em tempo real, automação de máquinas e controle de processos industriais.',
    iconName: 'Factory',
    coord: { x: 235, y: -100 }, // Nordeste
  },
  piscicultura: {
    id: 'piscicultura',
    name: 'Piscicultura',
    tagline: 'Qualidade da Água & Operação Aquícola',
    description: 'Monitoramento de variáveis da água, automação de dispensação de insumos e controle operacional de tanques.',
    iconName: 'Fish',
    coord: { x: 235, y: 100 }, // Sudeste
  },
  bioflorestal: {
    id: 'bioflorestal',
    name: 'Bioflorestal',
    tagline: 'Cadeia Bioflorestal & Climatização',
    description: 'Automação e monitoramento de processos operacionais, fornos de carbonização e acionamentos florestais.',
    iconName: 'Trees',
    coord: { x: 0, y: 195 }, // Sul
  },
  energia: {
    id: 'energia',
    name: 'Energia',
    tagline: 'Gestão Elétrica & Eficiência de Motores',
    description: 'Monitoramento de grandezas elétricas operacionais, análise de consumo e supervisão de regime de motores.',
    iconName: 'Zap',
    coord: { x: -235, y: 100 }, // Sudoeste
  },
  'pesquisa-laboratorios': {
    id: 'pesquisa-laboratorios',
    name: 'Pesquisa e Laboratórios',
    tagline: 'Condições Críticas & Automação Científica',
    description: 'Instrumentação de precisão, amostragem automatizada e monitoramento contínuo de variáveis críticas.',
    iconName: 'FlaskConical',
    coord: { x: -235, y: -100 }, // Noroeste
  },
};

// ============================================================================
// 2. CATÁLOGO ÚNICO DE PRODUTOS (15 entidades sem duplicação)
// ============================================================================
export const PRODUCTS: Record<ProductId, Product> = {
  etsus: {
    id: 'etsus',
    name: 'ÉTSUS',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Amostrador automatizado de água e efluentes para coleta representativa e suporte analítico.',
    shortLabel: 'Amostragem automática de líquidos',
    status: 'comercial',
    workflow: [
      { step: '01', title: 'Captação da amostra', description: 'Tomada em canal, poço ou tubulação de efluente ou água', iconType: 'sample' },
      { step: '02', title: 'Coleta programada', description: 'Rotinas parametrizadas por tempo ou pulso de vazão', iconType: 'device' },
      { step: '03', title: 'Armazenamento da amostra', description: 'Preservação e distribuição nos frascos para análise', iconType: 'sample' },
    ],
    technicalSpecs: {
      parameters: ['Alíquotas programáveis de volume', 'Ciclos por intervalo de tempo ou pulso de vazão'],
      installation: 'Instalação junto a canais, poços ou linhas de efluentes',
      features: ['Distribuição automática em frascos de coleta', 'Programação local de rotinas operacionais'],
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Módulo Amostrador', type: 'hardware', description: 'Sistema automatizado para captação e distribuição de amostras líquidas' },
      { stepNumber: 2, label: 'Controlador de Ciclos ÉTSUS', type: 'hardware', description: 'Programação de rotinas de coleta por tempo ou vazão' },
      { stepNumber: 3, label: 'Acondicionamento em Frascos', type: 'actuator', description: 'Distribuição e preservação em frascos de amostragem' },
      { stepNumber: 4, label: 'Registro Operacional', type: 'platform', description: 'Acompanhamento dos ciclos e rotinas de coleta realizadas' },
    ],
  },
  'control-flow': {
    id: 'control-flow',
    name: 'ControlFlow',
    category: 'Automação & Controle',
    shortDescription: 'Solução para automação, posicionamento e acionamento motorizado de válvulas de gaveta e esfera.',
    shortLabel: 'Automação de válvulas',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Comando de Manobra', description: 'Instrução operacional para abertura ou fechamento', iconType: 'control' },
      { step: '02', title: 'Atuador Motorizado WBM', description: 'Motorização mecânica com controle de torque', iconType: 'device' },
      { step: '03', title: 'Válvula de Processo', description: 'Acionamento e controle de posicionamento em linha', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Posição angular / linear da válvula', 'Status de fim de curso (aberta/fechada)'],
      installation: 'Acoplamento mecânico motorizado em válvulas de gaveta e esfera industriais',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Válvula de Processo', type: 'actuator', description: 'Corpo de válvula gaveta ou esfera acoplado' },
      { stepNumber: 2, label: 'Atuador Motorizado WBM', type: 'hardware', description: 'Mecanismo eletromecânico para manobra e posicionamento' },
      { stepNumber: 3, label: 'Comunicação Operacional', type: 'communication', description: 'Envio de comandos e leitura de posição' },
      { stepNumber: 4, label: 'Supervisão de Manobra', type: 'platform', description: 'Comando de abertura/fechamento e monitoramento de posição' },
    ],
  },
  'parshall-monitor': {
    id: 'parshall-monitor',
    name: 'Parshall Monitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Monitoramento contínuo de vazão em canais abertos através de calha Parshall instrumentada.',
    shortLabel: 'Monitoramento de vazão em calhas',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Medição em Calha', description: 'Sensor de nível sem contato na lâmina d’água', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Cálculo de vazão conforme curva da calha Parshall', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão em tempo real e telemetria de volume acumulado', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Lâmina d’água (nível)', 'Vazão instantânea calculada', 'Volume total acumulado'],
      installation: 'Instalação em calhas Parshall em canais abertos com suporte sem contato',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sensor de Nível sem Contato', type: 'sensor', description: 'Medição contínua da lâmina d’água na calha Parshall' },
      { stepNumber: 2, label: 'Módulo de Aquisição WBM', type: 'hardware', description: 'Cálculo de vazão conforme curva da calha' },
      { stepNumber: 3, label: 'Transmissão de Dados', type: 'communication', description: 'Envio de dados de vazão conforme infraestrutura disponível' },
      { stepNumber: 4, label: 'Supervisão de Vazão', type: 'platform', description: 'Acompanhamento de vazão instantânea e volume acumulado' },
    ],
  },
  'control-motors': {
    id: 'control-motors',
    name: 'ControlMotors',
    category: 'Automação & Controle',
    shortDescription: 'Automação para comando, acionamento e supervisão do status operacional de motores industriais.',
    shortLabel: 'Controle e monitoramento de motores',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Comando Operacional', description: 'Interface de acionamento ou partida/parada', iconType: 'control' },
      { step: '02', title: 'Painel de Comando WBM', description: 'Módulo de chaveamento, proteção e controle de acionamento', iconType: 'device' },
      { step: '03', title: 'Conjunto Motor', description: 'Acionamento mecânico e envio de status operacional', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Comandos de partida e parada', 'Status operacional de funcionamento', 'Grandezas elétricas do acionamento'],
      installation: 'Painéis elétricos para bombas, esteiras e máquinas industriais',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sensoriamento de Grandezas', type: 'sensor', description: 'Medição de variáveis elétricas do circuito do motor' },
      { stepNumber: 2, label: 'Módulo de Comando WBM', type: 'hardware', description: 'Interface para comandos de acionamento e parada remota' },
      { stepNumber: 3, label: 'Transmissão de Sinais', type: 'communication', description: 'Envio de status operacional e recebimento de comandos' },
      { stepNumber: 4, label: 'Supervisão de Motores', type: 'platform', description: 'Acompanhamento do regime de trabalho e envio de comandos' },
    ],
  },
  'motors-monitor': {
    id: 'motors-monitor',
    name: 'MotorsMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Supervisão de parâmetros operacionais de motores via inversores ou medidores, sem comandos de controle.',
    shortLabel: 'Monitoramento de motores',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Coleta de Grandezas', description: 'Leitura via inversores de frequência ou medidores instalados', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Aquisição e processamento de parâmetros operacionais', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Histórico contínuo de regime operacional e telemetria', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Parâmetros operacionais disponibilizados por inversores ou multimedidores'],
      installation: 'Integração via comunicação com instrumentos ou acionamentos existentes',
      features: ['Acompanhamento contínuo de grandezas elétricas e operacionais'],
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Parâmetros Operacionais', type: 'sensor', description: 'Coleta de dados via integração com inversores ou medidores' },
      { stepNumber: 2, label: 'Módulo de Aquisição WBM', type: 'hardware', description: 'Tratamento e envio de dados para supervisão do motor' },
      { stepNumber: 3, label: 'Transmissão de Telemetria', type: 'communication', description: 'Envio periódico de dados para a central' },
      { stepNumber: 4, label: 'Supervisão & Histórico', type: 'platform', description: 'Acompanhamento do regime operacional e curvas históricas' },
    ],
  },
  'control-ar': {
    id: 'control-ar',
    name: 'ControlAr',
    category: 'Automação & Controle',
    shortDescription: 'Automação do posicionamento de válvulas de entrada de ar em fornos de carbonização.',
    shortLabel: 'Controle de ar em fornos',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Comando de posicionamento', description: 'Instrução para regulagem da abertura da válvula', iconType: 'control' },
      { step: '02', title: 'ControlAr', description: 'Mecanismo de atuação e posicionamento motorizado', iconType: 'device' },
      { step: '03', title: 'Válvula de entrada de ar', description: 'Regulagem da admissão de ar no forno de carbonização', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Abertura angular da válvula de admissão de ar'],
      installation: 'Montagem mecânica direta no bocal de entrada de ar de fornos de carbonização',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Comando de Posicionamento', type: 'actuator', description: 'Definição da abertura desejada para a válvula de ar' },
      { stepNumber: 2, label: 'Atuador ControlAr', type: 'hardware', description: 'Motorização e ajuste de abertura angular' },
      { stepNumber: 3, label: 'Válvula de Entrada de Ar', type: 'actuator', description: 'Regulagem mecânica da admissão de ar no forno' },
      { stepNumber: 4, label: 'Indicação de Posição', type: 'platform', description: 'Acompanhamento da abertura real da válvula de ar' },
    ],
  },
  'control-feed': {
    id: 'control-feed',
    name: 'ControlFeed',
    category: 'Automação & Controle',
    shortDescription: 'Sistema automatizado para dispensação programada de ração em piscicultura e aplicações afins sob consulta.',
    shortLabel: 'Alimentação automatizada',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Programação de Horários', description: 'Configuração de rotinas e dosagens por tanque ou lote', iconType: 'control' },
      { step: '02', title: 'Controlador WBM', description: 'Temporização e ciclo automático de acionamento', iconType: 'device' },
      { step: '03', title: 'Dispensador Mecânico', description: 'Distribuição automatizada de ração nos tanques', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Horários programados de dispensação', 'Duração e ciclos de alimentação'],
      installation: 'Instalação junto aos tanques de viveiro ou linhas de alimentação',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Dispensador Mecânico', type: 'actuator', description: 'Mecanismo dosador de ração e sólidos' },
      { stepNumber: 2, label: 'Módulo de Temporização WBM', type: 'hardware', description: 'Controle de horários e rotinas de dispensação' },
      { stepNumber: 3, label: 'Transmissão de Dados', type: 'communication', description: 'Envio do histórico de acionamentos' },
      { stepNumber: 4, label: 'Supervisão de Alimentação', type: 'platform', description: 'Programação de horários e acompanhamento de rotinas' },
    ],
  },
  'freezer-monitor': {
    id: 'freezer-monitor',
    name: 'FreezerMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Monitoramento contínuo de temperatura em câmaras frias e ambientes de conservação térmica.',
    shortLabel: 'Monitoramento de refrigeração',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Sensoriamento Térmico', description: 'Sonda industrial para ambientes refrigerados e câmaras', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Condicionamento de sinal e envio periódico de dados', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão de temperatura em tempo real e curvas históricas', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Temperatura contínua em ambientes refrigerados'],
      installation: 'Sonda instalada no interior de freezers, câmaras frias e áreas de estoque',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sonda Térmica', type: 'sensor', description: 'Sensor de temperatura para ambiente refrigerado' },
      { stepNumber: 2, label: 'Módulo de Leitura WBM', type: 'hardware', description: 'Condicionamento de sinal e aquisição' },
      { stepNumber: 3, label: 'Transmissão de Dados', type: 'communication', description: 'Envio periódico dos dados de temperatura' },
      { stepNumber: 4, label: 'Painel de Supervisão', type: 'platform', description: 'Acompanhamento contínuo dos níveis térmicos do ambiente' },
    ],
  },
  'control-dose': {
    id: 'control-dose',
    name: 'ControlDose',
    category: 'Automação & Controle',
    shortDescription: 'Automação para acionamento e controle de bombas dosadoras de reagentes químicos em processos.',
    shortLabel: 'Automação de dosagem química',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Demanda de Tratamento', description: 'Taxa de dosagem requerida no processo operacional', iconType: 'control' },
      { step: '02', title: 'Controlador WBM', description: 'Regulação do acionamento e ciclos da bomba', iconType: 'device' },
      { step: '03', title: 'Bomba Dosadora', description: 'Injeção automatizada de reagentes químicos na linha', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Taxa de dosagem', 'Comando de acionamento de bomba dosadora'],
      installation: 'Interligação a painéis de bombas dosadoras de reagentes químicos',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Bomba Dosadora', type: 'actuator', description: 'Equipamento de dosagem acoplado à linha' },
      { stepNumber: 2, label: 'Controlador de Acionamento WBM', type: 'hardware', description: 'Módulo para regulação e comando de injeção' },
      { stepNumber: 3, label: 'Comunicação de Status', type: 'communication', description: 'Registro de acionamentos e volumes dosados' },
      { stepNumber: 4, label: 'Supervisão Operacional', type: 'platform', description: 'Acompanhamento do status de injeção química' },
    ],
  },
  'energy-monitor': {
    id: 'energy-monitor',
    name: 'EnergyMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Medição e monitoramento de grandezas elétricas e consumo em circuitos operacionais.',
    shortLabel: 'Monitoramento de energia elétrica',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Sensoriamento Elétrico', description: 'Transformadores de corrente (TCs) e sensores de tensão', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Cálculo de grandezas elétricas e telemetria contínua', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão em tempo real e curva de demanda elétrica', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Tensão (V)', 'Corrente (A)', 'Potência ativa e reativa', 'Consumo acumulado (kWh)'],
      installation: 'Quadros elétricos de distribuição e centros de comando de motores',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Medição Elétrica', type: 'sensor', description: 'Transformadores de corrente (TCs) e sensores de tensão' },
      { stepNumber: 2, label: 'Multimedidor / Módulo WBM', type: 'hardware', description: 'Cálculo de potência ativa, reativa, tensão e corrente' },
      { stepNumber: 3, label: 'Transmissão de Telemetria', type: 'communication', description: 'Envio dos parâmetros elétricos para a plataforma' },
      { stepNumber: 4, label: 'Supervisão Energética', type: 'platform', description: 'Curva de carga, histórico de demanda e perfil de consumo' },
    ],
  },
  'control-damper': {
    id: 'control-damper',
    name: 'ControlDamper',
    category: 'Automação & Controle',
    shortDescription: 'Atuação motorizada e controle de posicionamento de dampers para dutos de ar e exaustão industrial.',
    shortLabel: 'Automação de dampers',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Set-point de Exaustão', description: 'Instrução de regulagem de vazão de ar no duto', iconType: 'control' },
      { step: '02', title: 'Atuador Rotativo WBM', description: 'Motorização mecânica com retorno de posição angular', iconType: 'device' },
      { step: '03', title: 'Damper Industrial', description: 'Regulagem da passagem de ar no duto de exaustão', iconType: 'actuator' },
    ],
    technicalSpecs: {
      parameters: ['Posicionamento angular das lâminas do damper'],
      installation: 'Montagem mecânica no eixo de dampers em dutos de ventilação',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Damper Industrial', type: 'actuator', description: 'Lâminas de regulagem mecânica de fluxo em dutos' },
      { stepNumber: 2, label: 'Atuador Rotativo WBM', type: 'hardware', description: 'Motorização com sinal de realimentação de ângulo' },
      { stepNumber: 3, label: 'Comunicação Operacional', type: 'communication', description: 'Envio de comandos e leitura de posição real' },
      { stepNumber: 4, label: 'Supervisão de Exaustão', type: 'platform', description: 'Controle de abertura e indicação de status' },
    ],
  },
  'flow-monitor': {
    id: 'flow-monitor',
    name: 'FlowMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Medição contínua de vazão e volume em tubulações industriais, redes e pontos de captação de água.',
    shortLabel: 'Monitoramento de vazão e volume',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Medição em Linha', description: 'Sensor de vazão em tubulação pressurizada ou canal', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Processamento de vazão instantânea e totalização remota', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão contínua de vazão e histórico de volumes acumulados', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Vazão instantânea', 'Volume total acumulado'],
      installation: 'Tubulações pressurizadas, adutoras e pontos de captação de água',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sensor de Vazão em Linha', type: 'sensor', description: 'Medição em tubulação pressurizada ou canal' },
      { stepNumber: 2, label: 'Totalizador / Módulo WBM', type: 'hardware', description: 'Processamento de vazão instantânea e volume acumulado' },
      { stepNumber: 3, label: 'Telemetria de Campo', type: 'communication', description: 'Transmissão remota dos dados coletados' },
      { stepNumber: 4, label: 'Supervisão Hídrica', type: 'platform', description: 'Visualização de vazão, gráficos históricos e volumes acumulados' },
    ],
  },
  'temp-humidity-monitor': {
    id: 'temp-humidity-monitor',
    name: 'TempHumidity Monitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Supervisão de temperatura e umidade relativa do ar em salas técnicas, galpões e ambientes controlados.',
    shortLabel: 'Temperatura e umidade ambiente',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Sensoriamento de Ar', description: 'Sonda industrial calibrada para temperatura e umidade', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Condicionamento de sinal e envio periódico de telemetria', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão em tempo real das condições ambientais', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Temperatura do ar ambiente (°C)', 'Umidade relativa do ar (%UR)'],
      installation: 'Salas elétricas, painéis de controle, almoxarifados e galpões',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sonda Termo-higrométrica', type: 'sensor', description: 'Sensor calibrado para temperatura e umidade do ar ambiente' },
      { stepNumber: 2, label: 'Módulo de Leitura WBM', type: 'hardware', description: 'Condicionamento de sinal e armazenamento de amostras' },
      { stepNumber: 3, label: 'Transmissão de Dados', type: 'communication', description: 'Envio contínuo para a central de monitoramento' },
      { stepNumber: 4, label: 'Supervisão Ambiental', type: 'platform', description: 'Acompanhamento das condições ambientais do ar em tempo real' },
    ],
  },
  'ph-monitor': {
    id: 'ph-monitor',
    name: 'pHMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Medição em linha de potencial hidrogeniônico (pH) para monitoramento contínuo de processos e efluentes.',
    shortLabel: 'Monitoramento de pH',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Sonda Físico-Química', description: 'Eletrodo industrial em contato contínuo com o fluido', iconType: 'measure' },
      { step: '02', title: 'Transmissor IoT WBM', description: 'Condicionamento de sinal e envio periódico de medições', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão contínua de pH e acompanhamento de variações', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Potencial hidrogeniônico (pH)', 'Compensação de temperatura na leitura'],
      installation: 'Sonda instalada em tubulações, canais ou tanques de tratamento',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Eletrodo / Sonda de pH', type: 'sensor', description: 'Sensor industrial com compensação térmica de medição' },
      { stepNumber: 2, label: 'Transmissor WBM', type: 'hardware', description: 'Condicionamento de sinal eletroquímico e calibração' },
      { stepNumber: 3, label: 'Transmissão de Sinal', type: 'communication', description: 'Envio contínuo de medições para a central' },
      { stepNumber: 4, label: 'Supervisão Físico-Química', type: 'platform', description: 'Histórico contínuo de pH e identificação de desvios' },
    ],
  },
  'level-monitor': {
    id: 'level-monitor',
    name: 'LevelMonitor',
    category: 'Instrumentação & Monitoramento',
    shortDescription: 'Monitoramento contínuo de nível em reservatórios, tanques, poços e silos industriais.',
    shortLabel: 'Monitoramento de nível',
    status: 'sob_consulta',
    workflow: [
      { step: '01', title: 'Medição de Nível', description: 'Sensor de nível sem contato ou hidrostático', iconType: 'measure' },
      { step: '02', title: 'Módulo IoT WBM', description: 'Cálculo de cota/volume e telemetria remota', iconType: 'device' },
      { step: '03', title: 'Plataforma WBM', description: 'Supervisão gráfica de nível e registro histórico de reserva', iconType: 'platform' },
    ],
    technicalSpecs: {
      parameters: ['Nível contínuo (cota da lâmina ou produto)', 'Volume estimado'],
      installation: 'Topo de reservatórios, bacias, poços de sucção e tanques',
    },
    defaultIotArchitecture: [
      { stepNumber: 1, label: 'Sensor de Nível', type: 'sensor', description: 'Sonda de nível conforme características do fluido ou sólido' },
      { stepNumber: 2, label: 'Módulo de Leitura WBM', type: 'hardware', description: 'Conversão da medição para cota ou volume' },
      { stepNumber: 3, label: 'Telemetria de Nível', type: 'communication', description: 'Transmissão periódica para supervisão remota' },
      { stepNumber: 4, label: 'Supervisão de Reservatório', type: 'platform', description: 'Acompanhamento gráfico de nível e registros de histórico' },
    ],
  },
};

// ============================================================================
// 3. VÍNCULOS PRODUTO-UNIVERSO (Estrutura Desafio -> Solução -> Resultado)
// ============================================================================
/**
 * Relações estritas aprovadas.
 * Todos os 42 vínculos contêm narrativas factuais e auditadas.
 */
export const PRODUCT_UNIVERSE_LINKS: ProductUniverseContext[] = [
  // --- SANEAMENTO (11 produtos) ---
  {
    productId: 'etsus',
    universeId: 'saneamento',
    challenge: 'Dificuldade na coleta manual periódica e risco de amostras não representativas em efluentes e água bruta.',
    solution: 'Amostrador automatizado com rotinas programadas de coleta de amostras líquidas e preservação para análise.',
    expectedResult: 'Padronização no procedimento de coleta de amostras para suporte às análises laboratoriais da estação.',
    relatedProductIds: ['ph-monitor', 'parshall-monitor'],
  },
  {
    productId: 'control-flow',
    universeId: 'saneamento',
    challenge: 'Necessidade de deslocamento manual para manobra de válvulas em adutoras, reservatórios e redes de distribuição.',
    solution: 'Atuação motorizada para válvulas de gaveta e esfera com supervisão de posicionamento e acionamento remoto.',
    expectedResult: 'Agilidade no acionamento de válvulas e redução do tempo de deslocamento em manobras operacionais.',
    relatedProductIds: ['flow-monitor', 'level-monitor'],
  },
  {
    productId: 'parshall-monitor',
    universeId: 'saneamento',
    challenge: 'Dificuldade no acompanhamento contínuo da vazão em canais abertos através de leituras visuais manuais.',
    solution: 'Instrumentação com sensor sem contato instalada na calha Parshall com cálculo de vazão integrado.',
    expectedResult: 'Registro contínuo e centralizado de dados de vazão instantânea e volume acumulado.',
    relatedProductIds: ['flow-monitor', 'level-monitor'],
  },
  {
    productId: 'control-motors',
    universeId: 'saneamento',
    challenge: 'Falta de comando remoto e acompanhamento do status operacional de motores em bombas à distância.',
    solution: 'Painel de automação para acionamento, desligamento e acompanhamento de variáveis elétricas de motores.',
    expectedResult: 'Centralização dos comandos operacionais e visualização do status de funcionamento do conjunto motobomba.',
    relatedProductIds: ['motors-monitor', 'energy-monitor'],
  },
  {
    productId: 'motors-monitor',
    universeId: 'saneamento',
    challenge: 'Ausência de acompanhamento centralizado do regime de operação de motores em bombas onde não se aplica comando remoto.',
    solution: 'Supervisão de parâmetros operacionais obtidos via integração com inversores ou medidores instalados.',
    expectedResult: 'Acompanhamento contínuo de grandezas elétricas e do regime de funcionamento do motor.',
    relatedProductIds: ['control-motors', 'energy-monitor'],
  },
  {
    productId: 'control-dose',
    universeId: 'saneamento',
    challenge: 'Necessidade de acionamento e regulação de dosadores químicos conforme variações na rotina de tratamento.',
    solution: 'Automação para acionamento e controle de bombas dosadoras de reagentes químicos.',
    expectedResult: 'Padronização no acionamento dos dosadores e suporte ao controle da dosagem química.',
    relatedProductIds: ['ph-monitor', 'flow-monitor'],
  },
  {
    productId: 'flow-monitor',
    universeId: 'saneamento',
    challenge: 'Falta de dados centralizados e em tempo real sobre vazão em pontos de captação e redes de distribuição.',
    solution: 'Medição contínua de vazão e telemetria de dados aplicada a pontos de captação de água e adutoras.',
    applicationHighlight: 'Aplicação dedicada para captação de água e redes de distribuição',
    shortLabelOverride: 'Medição e monitoramento de vazão',
    expectedResult: 'Disponibilização de dados contínuos de vazão e volume para acompanhamento da operação hídrica.',
    relatedProductIds: ['level-monitor', 'control-flow'],
  },
  {
    productId: 'energy-monitor',
    universeId: 'saneamento',
    challenge: 'Falta de detalhamento sobre o consumo elétrico e comportamento de demanda em estações elevatórias e casas de bombas.',
    solution: 'Medição e registro contínuo de grandezas elétricas e perfil de consumo nos quadros de comando.',
    expectedResult: 'Acompanhamento do histórico de consumo elétrico para suporte ao planejamento operacional.',
    relatedProductIds: ['motors-monitor', 'control-motors'],
  },
  {
    productId: 'temp-humidity-monitor',
    universeId: 'saneamento',
    challenge: 'Exposição de painéis elétricos, inversores e instrumentos a variações térmicas e de umidade do ar em salas de controle.',
    solution: 'Supervisão contínua de temperatura e umidade relativa do ar ambiente com envio de dados para a central.',
    expectedResult: 'Acompanhamento das condições ambientais internas dos painéis e salas operacionais.',
    relatedProductIds: ['energy-monitor', 'control-motors'],
  },
  {
    productId: 'ph-monitor',
    universeId: 'saneamento',
    challenge: 'Necessidade de acompanhamento contínuo do pH em etapas de coagulação, decantação e saída de tratamento.',
    solution: 'Sonda industrial com medição contínua de pH e transmissão de dados para a supervisão.',
    expectedResult: 'Histórico de dados de pH em tempo real para suporte à operação da estação.',
    relatedProductIds: ['control-dose', 'flow-monitor'],
  },
  {
    productId: 'level-monitor',
    universeId: 'saneamento',
    challenge: 'Ausência de dados remotos sobre o nível em reservatórios, poços de sucção e bacias de acumulação.',
    solution: 'Sensoriamento contínuo de nível com transmissão periódica para a equipe operacional.',
    expectedResult: 'Visibilidade remota da reserva hídrica e indicação de níveis operacionais.',
    relatedProductIds: ['flow-monitor', 'control-flow'],
  },

  // --- INDÚSTRIA (13 produtos) ---
  {
    productId: 'control-flow',
    universeId: 'industria',
    challenge: 'Acionamento manual e dificuldade de regulagem remota de válvulas em linhas de utilidades e fluidos de processo.',
    solution: 'Atuação motorizada com controle de posicionamento para válvulas de gaveta e esfera.',
    expectedResult: 'Controle operacional à distância e padronização no posicionamento de válvulas da linha.',
    relatedProductIds: ['flow-monitor', 'control-damper'],
  },
  {
    productId: 'parshall-monitor',
    universeId: 'industria',
    challenge: 'Necessidade de monitoramento contínuo do volume de efluentes descartados em canais industriais.',
    solution: 'Instrumentação para calhas Parshall com medição contínua de vazão e armazenamento de dados.',
    expectedResult: 'Registro histórico de vazão em canal aberto para acompanhamento do volume de efluentes gerados.',
    relatedProductIds: ['flow-monitor', 'ph-monitor'],
  },
  {
    productId: 'control-motors',
    universeId: 'industria',
    challenge: 'Falta de comando integrado e acompanhamento remoto de motores em equipamentos e esteiras fabris.',
    solution: 'Módulo de acionamento com envio de status operacional e comandos de ligar/desligar à distância.',
    expectedResult: 'Centralização de comandos de partida/parada e acompanhamento de variáveis do acionamento industrial.',
    relatedProductIds: ['motors-monitor', 'energy-monitor'],
  },
  {
    productId: 'motors-monitor',
    universeId: 'industria',
    challenge: 'Falta de visibilidade sobre o comportamento operacional de motores industriais onde não se aplica comando remoto.',
    solution: 'Supervisão de parâmetros operacionais obtidos via integração com inversores ou medidores instalados.',
    expectedResult: 'Histórico de variáveis elétricas do motor para acompanhamento e suporte à manutenção.',
    relatedProductIds: ['control-motors', 'energy-monitor'],
  },
  {
    productId: 'control-feed',
    universeId: 'industria',
    shortLabelOverride: 'Dispensação automatizada sob avaliação',
    applicationHighlight: 'Aplicação em processos industriais sob avaliação técnica prévia',
    challenge: 'Demanda por dispensação programada de insumos sólidos em linhas industriais específicas sem intervenção manual contínua.',
    solution: 'Sistema automatizado para dispensação com temporização e ciclos programáveis, condicionado à avaliação técnica prévia do material e do processo.',
    expectedResult: 'Padronização na rotina de dispensação programada após confirmação da viabilidade operacional para o insumo.',
    relatedProductIds: ['control-motors', 'level-monitor'],
  },
  {
    productId: 'freezer-monitor',
    universeId: 'industria',
    challenge: 'Risco de oscilações térmicas não registradas em câmaras industriais e áreas de estocagem refrigerada.',
    solution: 'Monitoramento térmico contínuo com sondas industriais e envio de telemetria para supervisão.',
    expectedResult: 'Registro contínuo e histórico da temperatura ambiente em áreas refrigeradas.',
    relatedProductIds: ['temp-humidity-monitor', 'energy-monitor'],
  },
  {
    productId: 'control-dose',
    universeId: 'industria',
    challenge: 'Necessidade de acionamento controlado de dosadores de reagentes e aditivos em linhas fabris.',
    solution: 'Automação para comando e regulação de bombas dosadoras de insumos químicos.',
    expectedResult: 'Padronização no acionamento da dosagem e redução do contato manual com produtos químicos.',
    relatedProductIds: ['ph-monitor', 'level-monitor'],
  },
  {
    productId: 'flow-monitor',
    universeId: 'industria',
    challenge: 'Falta de dados setorizados sobre consumo de água, fluidos ou utilidades em diferentes linhas da fábrica.',
    solution: 'Medição em linha de vazão em tubulações industriais pressurizadas com envio à supervisão.',
    expectedResult: 'Disponibilização de dados de vazão instantânea e volume acumulado por ponto de medição.',
    relatedProductIds: ['level-monitor', 'control-flow'],
  },
  {
    productId: 'energy-monitor',
    universeId: 'industria',
    challenge: 'Desconhecimento do perfil de consumo elétrico específico por setor, máquina ou processo produtivo.',
    solution: 'Medição contínua de parâmetros elétricos instalada em quadros de distribuição e alimentação.',
    expectedResult: 'Mapeamento do comportamento de consumo de energia elétrica para subsidiar tomadas de decisão da gestão.',
    relatedProductIds: ['motors-monitor', 'control-motors'],
  },
  {
    productId: 'control-damper',
    universeId: 'industria',
    challenge: 'Regulagem manual ou imprecisa de dampers e registros em dutos de ventilação, secadores e fornos.',
    solution: 'Atuadores motorizados com controle de abertura e posicionamento angular para dampers industriais.',
    expectedResult: 'Ajuste à distância e posicionamento repetível de dampers em dutos operacionais.',
    relatedProductIds: ['control-flow', 'temp-humidity-monitor'],
  },
  {
    productId: 'temp-humidity-monitor',
    universeId: 'industria',
    challenge: 'Oscilações de umidade e temperatura do ar que impactam ambientes produtivos, galpões de estoque e salas técnicas.',
    solution: 'Sensoriamento contínuo de temperatura e umidade relativa do ar com centralização dos dados.',
    expectedResult: 'Acompanhamento do perfil térmico e higrométrico do ar nos ambientes monitorados.',
    relatedProductIds: ['freezer-monitor', 'energy-monitor'],
  },
  {
    productId: 'ph-monitor',
    universeId: 'industria',
    challenge: 'Falta de monitoramento contínuo de pH em canaletas industriais e efluentes de lavagem de processos.',
    solution: 'Medição contínua de pH com sonda industrial conectada à plataforma de supervisão.',
    expectedResult: 'Acompanhamento contínuo da faixa de pH do efluente em tempo real.',
    relatedProductIds: ['control-dose', 'parshall-monitor'],
  },
  {
    productId: 'level-monitor',
    universeId: 'industria',
    challenge: 'Incerteza sobre o volume remanescente em tanques de insumos líquidos, óleos ou silos de estocagem.',
    solution: 'Sensoriamento de nível contínuo integrado com transmissão para o sistema de monitoramento.',
    expectedResult: 'Visibilidade contínua do nível em reservatórios industriais.',
    relatedProductIds: ['flow-monitor', 'control-flow'],
  },

  // --- PISCICULTURA (7 produtos) ---
  {
    productId: 'etsus',
    universeId: 'piscicultura',
    challenge: 'Dificuldade na coleta sistemática de amostras de água nos viveiros para acompanhamento analítico laboratorial.',
    solution: 'Amostrador automatizado programável para coleta e preservação de amostras de água nos tanques e canais.',
    expectedResult: 'Padronização da rotina de amostragem de água para suporte às análises físico-químicas e biológicas.',
    relatedProductIds: ['ph-monitor', 'flow-monitor'],
  },
  {
    productId: 'control-flow',
    universeId: 'piscicultura',
    challenge: 'Operação manual demorada no acionamento de comportas e válvulas para abastecimento e escoamento de tanques.',
    solution: 'Atuação motorizada com acionamento remoto para válvulas de controle de fluxo de água.',
    expectedResult: 'Maior agilidade no controle de enchimento e esvaziamento de tanques de piscicultura.',
    relatedProductIds: ['flow-monitor', 'level-monitor'],
  },
  {
    productId: 'control-feed',
    universeId: 'piscicultura',
    challenge: 'Distribuição irregular ou descompassada de ração nos tanques de cultivo aquícola.',
    solution: 'Dispensador automático de ração com horários e dosagens programáveis.',
    expectedResult: 'Padronização dos horários de alimentação e controle na quantidade de ração dispensada por lote.',
    relatedProductIds: ['level-monitor', 'flow-monitor'],
  },
  {
    productId: 'flow-monitor',
    universeId: 'piscicultura',
    challenge: 'Ausência de acompanhamento da taxa de renovação de água em canais e tubulações de viveiros.',
    solution: 'Medição contínua de vazão instalada nos pontos de entrada e saída de água dos tanques.',
    expectedResult: 'Dados históricos sobre o volume e vazão de água circulada nos viveiros.',
    relatedProductIds: ['level-monitor', 'control-flow'],
  },
  {
    productId: 'temp-humidity-monitor',
    universeId: 'piscicultura',
    shortLabelOverride: 'Temperatura e umidade do ar',
    applicationHighlight: 'Monitoramento do ar ambiente em salas de apoio, reprodução e armazenamento',
    challenge: 'Oscilações térmicas e de umidade do ar ambiente não monitoradas nas salas de reprodução, incubação e armazenamento de ração.',
    solution: 'Sensoriamento contínuo de temperatura e umidade relativa do ar ambiente em salas técnicas e instalações de apoio da piscicultura.',
    expectedResult: 'Acompanhamento das condições ambientais do ar nas salas de apoio e alevinagem, prevenindo perdas de insumos e desconforto térmico.',
    relatedProductIds: ['control-feed', 'level-monitor'],
  },
  {
    productId: 'ph-monitor',
    universeId: 'piscicultura',
    challenge: 'Flutuações de pH ao longo do dia na água dos tanques de piscicultura que exigem intervenção da equipe técnica.',
    solution: 'Sonda submersível com leitura contínua de pH e envio de telemetria.',
    expectedResult: 'Supervisão contínua do pH da água para suporte ao manejo do viveiro.',
    relatedProductIds: ['etsus', 'flow-monitor'],
  },
  {
    productId: 'level-monitor',
    universeId: 'piscicultura',
    challenge: 'Risco de alteração inadvertida da lâmina d’água em tanques de cultivo por vazamentos ou falhas em comportas.',
    solution: 'Medição contínua de nível instalada nos tanques com acompanhamento remoto.',
    expectedResult: 'Visibilidade contínua da lâmina d’água e alerta operacional em caso de desvios de nível.',
    relatedProductIds: ['flow-monitor', 'control-flow'],
  },

  // --- BIOFLORESTAL (4 produtos) ---
  {
    productId: 'control-ar',
    universeId: 'bioflorestal',
    challenge: 'Ajuste manual e empírico das válvulas de entrada de ar em fornos de carbonização de biomassa.',
    solution: 'Atuação motorizada para posicionamento das válvulas de entrada de ar do forno.',
    expectedResult: 'Padronização e precisão no posicionamento de abertura de ar nas válvulas do forno.',
    relatedProductIds: ['control-damper', 'motors-monitor'],
  },
  {
    productId: 'control-motors',
    universeId: 'bioflorestal',
    challenge: 'Necessidade de acionamento e supervisão do status de motores em equipamentos e ventiladores do pátio florestal.',
    solution: 'Painel de comando com acionamento remoto e supervisão de grandezas elétricas dos motores.',
    expectedResult: 'Centralização dos comandos operacionais e acompanhamento do funcionamento dos motores florestais.',
    relatedProductIds: ['motors-monitor', 'control-damper'],
  },
  {
    productId: 'control-damper',
    universeId: 'bioflorestal',
    challenge: 'Necessidade de regulagem frequente de dampers e passagens de gases quentes e exaustão em fornos e estufas.',
    solution: 'Atuadores motorizados para modulação de abertura de dampers de alta temperatura.',
    expectedResult: 'Ajuste remoto do posicionamento dos dampers sem necessidade de manuseio manual em áreas quentes.',
    relatedProductIds: ['control-ar', 'control-motors'],
  },
  {
    productId: 'motors-monitor',
    universeId: 'bioflorestal',
    challenge: 'Ausência de supervisão sobre o regime de trabalho de motores em ventiladores e acionamentos florestais onde não se aplica comando remoto.',
    solution: 'Supervisão de parâmetros operacionais obtidos a partir de inversores de frequência ou multimedidores integrados.',
    expectedResult: 'Acompanhamento do histórico de grandezas operacionais do motor para apoio à manutenção preventiva.',
    relatedProductIds: ['control-motors', 'control-ar'],
  },

  // --- ENERGIA (3 produtos) ---
  {
    productId: 'control-motors',
    universeId: 'energia',
    challenge: 'Falta de automação para escalonamento ou acionamento programado de cargas motrizes de grande porte.',
    solution: 'Sistema de acionamento e comando elétrico com capacidade de acionamento coordenado de motores.',
    expectedResult: 'Controle operacional de partidas e paradas com acompanhamento de grandezas elétricas.',
    relatedProductIds: ['motors-monitor', 'energy-monitor'],
  },
  {
    productId: 'energy-monitor',
    universeId: 'energia',
    challenge: 'Falta de visibilidade contínua de parâmetros elétricos como tensão, corrente, potências e fator de potência em quadros gerais.',
    solution: 'Medição contínua de grandezas elétricas com transmissão periódica dos dados para a central.',
    expectedResult: 'Registro histórico de grandezas da rede elétrica para acompanhamento do perfil de consumo e carga.',
    relatedProductIds: ['motors-monitor', 'control-motors'],
  },
  {
    productId: 'motors-monitor',
    universeId: 'energia',
    challenge: 'A falta de acesso aos parâmetros elétricos e operacionais dificulta o acompanhamento do funcionamento dos motores.',
    solution: 'Supervisão de dados operacionais e elétricos integrados a inversores de frequência ou instrumentos já existentes no circuito.',
    expectedResult: 'Acompanhamento contínuo dos parâmetros do motor ao longo do tempo para avaliação de desempenho.',
    relatedProductIds: ['energy-monitor', 'control-motors'],
  },

  // --- PESQUISA E LABORATÓRIOS (4 produtos) ---
  {
    productId: 'etsus',
    universeId: 'pesquisa-laboratorios',
    challenge: 'Necessidade de coleta sistemática e temporizada de amostras de água e fluidos em ensaios experimentais.',
    solution: 'Amostrador automatizado compacto com parametrização de intervalos e volumes de coleta de amostras.',
    expectedResult: 'Repetibilidade e padronização na rotina de coleta de amostras para suporte a ensaios científicos e laboratoriais.',
    relatedProductIds: ['parshall-monitor', 'control-dose'],
  },
  {
    productId: 'parshall-monitor',
    universeId: 'pesquisa-laboratorios',
    challenge: 'Necessidade de medição contínua de vazão em canais hidráulicos experimentais de bancada com calhas Parshall.',
    solution: 'Instrumentação de nível sem contato com cálculo de vazão integrado para canais abertos e calhas Parshall de ensaio.',
    expectedResult: 'Aquisição contínua de dados de escoamento para ensaios hidráulicos e projetos de pesquisa experimental.',
    applicationHighlight: 'Monitoramento em canais abertos e calhas Parshall experimentais',
    technicalNote: 'Aplicação condicionada às características hidráulicas e às dimensões da calha utilizada.',
    relatedProductIds: ['etsus', 'control-dose'],
  },
  {
    productId: 'freezer-monitor',
    universeId: 'pesquisa-laboratorios',
    challenge: 'Necessidade de registro contínuo e acompanhamento de temperatura em ultrafreezers e câmaras de conservação laboratorial.',
    solution: 'Monitoramento térmico contínuo com registro de dados e acompanhamento em plataforma centralizada.',
    expectedResult: 'Acompanhamento contínuo das condições térmicas de conservação de amostras e materiais sensíveis.',
    relatedProductIds: ['control-dose', 'etsus'],
  },
  {
    productId: 'control-dose',
    universeId: 'pesquisa-laboratorios',
    challenge: 'Necessidade de acionamento controlado de dosadores de reagentes e fluidos em bancadas e ensaios laboratoriais.',
    solution: 'Automação para acionamento e controle de dosagem de reagentes químicos com comando programável.',
    expectedResult: 'Padronização no acionamento dos dosadores e suporte ao controle de dosagem em ensaios.',
    relatedProductIds: ['etsus', 'freezer-monitor'],
  },
];

// ============================================================================
// 4. FUNÇÕES UTILITÁRIAS DE CONSULTA
// ============================================================================

/**
 * Retorna os produtos associados a um determinado universo
 */
export function getProductsByUniverse(universeId: UniverseId): { product: Product; context: ProductUniverseContext }[] {
  const links = PRODUCT_UNIVERSE_LINKS.filter((link) => link.universeId === universeId);
  return links
    .map((link) => {
      const product = PRODUCTS[link.productId];
      if (!product) return null;
      return { product, context: link };
    })
    .filter((item): item is { product: Product; context: ProductUniverseContext } => item !== null);
}

/**
 * Retorna o contexto específico de um produto em determinado universo
 */
export function getProductUniverseContext(productId: ProductId, universeId: UniverseId): ProductUniverseContext | undefined {
  return PRODUCT_UNIVERSE_LINKS.find(
    (link) => link.productId === productId && link.universeId === universeId
  );
}

/**
 * Retorna todos os universos em que um produto atua
 */
export function getUniversesForProduct(productId: ProductId): Universe[] {
  const universeIds = PRODUCT_UNIVERSE_LINKS.filter((link) => link.productId === productId).map((link) => link.universeId);
  const uniqueIds = Array.from(new Set(universeIds));
  return uniqueIds.map((id) => UNIVERSES[id]).filter(Boolean);
}

/**
 * Retorna no máximo duas soluções complementares recomendadas para um produto no mesmo universo
 */
export function getRelatedProductsForContext(
  productId: ProductId,
  universeId: UniverseId
): { product: Product; context: ProductUniverseContext }[] {
  const currentContext = getProductUniverseContext(productId, universeId);
  if (!currentContext || !currentContext.relatedProductIds?.length) return [];

  const results: { product: Product; context: ProductUniverseContext }[] = [];

  for (const relId of currentContext.relatedProductIds) {
    if (relId === productId) continue;
    const relProduct = PRODUCTS[relId];
    if (!relProduct) continue;
    const relContext = getProductUniverseContext(relId, universeId);
    if (!relContext) continue; // Garante que a recomendação pertence estritamente ao mesmo universo

    results.push({ product: relProduct, context: relContext });
    if (results.length >= 2) break; // Garante no máximo duas sugestões
  }

  return results;
}
