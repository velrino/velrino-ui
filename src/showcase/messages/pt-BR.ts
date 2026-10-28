import type { DesignSystemCopy } from './types.js';

const ptBR = {
  panels: {
    description: 'A mesma moldura sci-fi decorativa, preservando conteúdo e indicadores de foco.',
    title: 'Pronto para sua próxima ideia',
    body: 'Cores e fontes pertencem à aplicação. A moldura compartilhada se adapta a elas.',
  },
  tabs: {
    description:
      'Navegação acessível entre seções usando as setas do teclado e estados desabilitados.',
    first: 'Visão geral',
    second: 'Detalhes',
    disabled: 'Indisponível',
    firstBody: 'Este é o painel de visão geral.',
    secondBody: 'A aba selecionada controla este painel de detalhes.',
  },
  accordion: {
    description: 'Conteúdo expansível com interação por teclado e títulos claros.',
    question: 'O que os projetos compartilham?',
    answer: 'Implementação dos componentes, interações acessíveis e o contrato de temas.',
    secondQuestion: 'Cada aplicação pode manter sua paleta?',
    secondAnswer:
      'Sim. As variáveis de tema da aplicação controlam cada destaque, superfície e brilho.',
  },
  menus: {
    description: 'Um menu real com ações, checkbox, seleção exclusiva e submenu.',
    open: 'Abrir exemplo de menu',
    label: 'Controles do exemplo',
    action: 'Executar ação de exemplo',
    disabled: 'Ação indisponível',
    setting: 'Mostrar dicas da interface',
    submenu: 'Mais opções',
    nested: 'Ação de exemplo do submenu',
    selection: 'Aparência',
    first: 'Compacta',
    second: 'Confortável',
    feedback: 'Ação concluída localmente.',
  },
  sheets: {
    description: 'O comportamento e a moldura do modal compartilhado, junto a uma borda da tela.',
    open: 'Abrir painel',
    title: 'Um pouco mais de espaço',
    body: 'Use um painel lateral para controles de apoio. Escape fecha e devolve o foco ao botão.',
    close: 'Fechar painel',
    sides: { left: 'Esquerda', right: 'Direita', top: 'Topo', bottom: 'Inferior' },
  },
  sliders: {
    description: 'Valores e intervalos acessíveis por teclado, com área generosa para toque.',
    label: 'Volume de exemplo',
    range: 'Intervalo de exemplo',
    lower: 'Limite inferior',
    upper: 'Limite superior',
    disabled: 'Slider desabilitado',
  },
  typewriter: {
    description:
      'O texto animado reserva seu espaço, preserva grafemas completos e respeita a redução de movimento.',
    text: 'Crie uma vez. Explore um universo de possibilidades. 👩🏽‍🚀',
    replay: 'Repetir animação',
    motion: 'Ativar animação',
  },
  eyebrow: 'Fundamentos da interface',
  title: 'Sistema de design',
  description:
    'Uma linguagem visual compartilhada entre aplicações. Componentes reais, estados interativos e padrões reutilizáveis.',
  navigation: 'Seções do sistema de design',
  viewMode: { label: 'Visualização do catálogo', page: 'Página única', tabs: 'Abas' },
  sections: {
    panels: 'Painéis',
    tabs: 'Abas',
    accordion: 'Accordion',
    menus: 'Menus',
    sheets: 'Painéis laterais',
    sliders: 'Sliders',
    typewriter: 'Texto animado',
    principles: 'Princípios',
    colors: 'Cores',
    typography: 'Tipografia',
    buttons: 'Botões',
    inputs: 'Campos',
    dialogs: 'Diálogos',
    loading: 'Tela de carregamento',
    brand: 'Marca',
  },
  principles: {
    description: 'Uma interface clara com uma moldura discreta de ficção científica.',
    interaction:
      'O ciano indica interação e seleção. Reserve as cores de alerta para informações relevantes.',
    readability:
      'Use cantos recortados, grades finas e superfícies translúcidas para emoldurar o conteúdo. Mantenha textos e indicadores de foco legíveis.',
    density:
      'Dê espaço aos controles. A decoração não deve sugerir dados ou atividade que não existem.',
  },
  colors: {
    description:
      'Estas amostras usam diretamente as variáveis CSS compartilhadas. Altere um token para atualizar todos os seus usos.',
    accent: 'Interação',
    surface: 'Superfície do painel',
    background: 'Fundo da aplicação',
    text: 'Texto principal',
    muted: 'Texto secundário',
    line: 'Moldura e borda',
    secondary: 'Superfície secundária',
    destructive: 'Ação destrutiva',
  },
  typography: {
    description: 'Títulos marcantes sem serifa, texto legível e rótulos técnicos compactos.',
    headingLabel: 'Título',
    headingSample: 'Um universo de possibilidades.',
    bodyLabel: 'Texto',
    bodySample:
      'Escreva textos curtos e diretos. A moldura deve apoiar a tarefa e deixar clara a próxima ação.',
    kickerLabel: 'Rótulo de seção',
    kickerSample: 'Interface / 01',
    monoLabel: 'Texto técnico',
  },
  buttons: {
    description:
      'Variantes e tamanhos do Button compartilhado. Ative uma amostra para ver sua resposta; o link leva à tipografia.',
    variantsLabel: 'Variantes',
    sizesLabel: 'Tamanhos',
    statesLabel: 'Estados',
    normal: 'Normal',
    selected: 'Selecionado',
    disabled: 'Desabilitado',
    loading: 'Carregando',
    iconLabel: 'Ativar exemplo de ícone',
    interactionHint: 'Experimente um botão. O controle selecionado alterna entre ativo e inativo.',
    feedback: 'Ativado: {variant}',
  },
  inputs: {
    description:
      'Campos nativos compartilham o estilo HUD. Rótulos, orientações e estados desabilitados permanecem explícitos.',
    normalLabel: 'Campo normal',
    placeholder: 'Escreva algo…',
    normalHint: 'Seu texto continua aqui quando você muda o idioma da interface.',
    errorLabel: 'Exemplo de validação',
    errorHint: 'Digite pelo menos três caracteres.',
    validHint: 'O valor atende ao requisito deste exemplo.',
    disabledLabel: 'Campo desabilitado',
    disabledValue: 'Indisponível neste estado',
  },
  dialogs: {
    description:
      'Um modal compartilhado com acionamento real, gerenciamento de foco e uma ação explícita.',
    open: 'Abrir diálogo de exemplo',
    title: 'Uma decisão em foco',
    body: 'Diálogos pedem atenção quando uma tarefa exige uma escolha clara. Este exemplo não executa nenhuma operação remota.',
    confirm: 'Confirmar exemplo',
    cancel: 'Cancelar',
    confirmed: 'Exemplo confirmado. Nenhum dado foi enviado.',
    languageTitle: 'Seleção de idioma',
    languageDescription:
      'Este é o mesmo controle de idioma do cabeçalho. Ele altera toda a interface sem atualizar a página.',
  },
  loading: {
    description:
      'Um componente de carregamento com planeta em tela cheia. Esta prévia de cinco segundos simula o progresso; não é uma importação nem uma requisição real.',
    open: 'Ver prévia do carregamento',
    label: 'Demonstração de carregamento',
    detail: 'Progresso simulado. Nenhum site está sendo importado.',
    cancel: 'Parar prévia',
    complete: 'Prévia de carregamento concluída.',
  },
  brand: {
    description:
      'A marca de galáxia aprovada segue a paleta compartilhada da interface. Mantenha sua arte consistente com a origem.',
    wordmark: 'Marca de galáxia HackUniverse',
    rule: 'Mantenha as proporções do logo e dê espaço a ele. Não altere suas cores para representar estado ou seleção.',
  },
} satisfies DesignSystemCopy;

export default ptBR;
