import { getSupabaseClient } from '../src/config/supabase.js';

function renderCouplePortraits(options) {
  const {
    danielOutfitColor,
    yohanaOutfitColor,
    eyesClosedRelaxed = false,
    sunglassesOnHead = false,
    chefApron = false,
  } = options;

  return `
    <g transform="translate(108, 72)">
      <path d="M12 138 C14 102, 34 90, 56 90 C78 90, 98 102, 100 138 Z" fill="${danielOutfitColor}"/>
      <path d="M38 90 Q56 102 74 90" stroke="#40151D" stroke-width="1.5" fill="none" opacity="0.35"/>
      ${
        chefApron
          ? `<path d="M32 95 L32 138 L80 138 L80 95 Z" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1.2"/>
             <path d="M40 90 L40 96 M72 90 L72 96" stroke="#621F2A" stroke-width="2"/>`
          : ''
      }
      <rect x="46" y="74" width="20" height="22" rx="8" fill="#C68B67"/>
      <circle cx="32" cy="40" r="14" fill="#1C1917"/>
      <circle cx="80" cy="40" r="14" fill="#1C1917"/>
      <circle cx="28" cy="54" r="11" fill="#1C1917"/>
      <circle cx="84" cy="54" r="11" fill="#1C1917"/>
      <circle cx="42" cy="24" r="15" fill="#1C1917"/>
      <circle cx="56" cy="21" r="16" fill="#1C1917"/>
      <circle cx="70" cy="24" r="15" fill="#1C1917"/>
      <ellipse cx="29" cy="56" rx="5" ry="8" fill="#C98E6A"/>
      <ellipse cx="83" cy="56" rx="5" ry="8" fill="#C98E6A"/>
      <path d="M31 44 C31 28, 81 28, 81 44 L81 58 C81 76, 68 85, 56 85 C44 85, 31 76, 31 58 Z" fill="#D59B76"/>
      <ellipse cx="39" cy="62" rx="6" ry="3.5" fill="#C47462" opacity="0.35"/>
      <ellipse cx="73" cy="62" rx="6" ry="3.5" fill="#C47462" opacity="0.35"/>
      <path d="M38 48 Q45 45 50 47" stroke="#1C1917" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M62 47 Q67 45 74 48" stroke="#1C1917" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      ${
        eyesClosedRelaxed
          ? `<path d="M39 54 Q45 58 50 54" stroke="#292622" stroke-width="2" stroke-linecap="round" fill="none"/>
             <path d="M62 54 Q67 58 73 54" stroke="#292622" stroke-width="2" stroke-linecap="round" fill="none"/>`
          : `<path d="M39 54 Q45 50 50 54" stroke="#292622" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="44.5" cy="54" r="2.2" fill="#1C1917"/>
             <path d="M62 54 Q67 50 73 54" stroke="#292622" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="67.5" cy="54" r="2.2" fill="#1C1917"/>`
      }
      <path d="M56 53 L54 62 Q56 64 59 62" stroke="#B67956" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M42 67 Q56 78 70 67 Z" fill="#FFFFFF" stroke="#8C4237" stroke-width="1.5"/>
      <circle cx="35" cy="34" r="9" fill="#1C1917"/>
      <circle cx="46" cy="31" r="10" fill="#1C1917"/>
      <circle cx="57" cy="30" r="10" fill="#1C1917"/>
      <circle cx="68" cy="31" r="10" fill="#1C1917"/>
      <circle cx="77" cy="35" r="9" fill="#1C1917"/>
      ${
        sunglassesOnHead
          ? `<rect x="37" y="21" width="16" height="9" rx="4" fill="#40151D" stroke="#D8B8AF" stroke-width="1.2"/>
             <rect x="59" y="21" width="16" height="9" rx="4" fill="#40151D" stroke="#D8B8AF" stroke-width="1.2"/>
             <line x1="53" y1="25" x2="59" y2="25" stroke="#D8B8AF" stroke-width="1.5"/>`
          : ''
      }
    </g>
    <g transform="translate(188, 78) rotate(-4 55 70)">
      <path d="M18 42 C12 72, 12 100, 20 116 L90 116 C98 100, 98 72, 92 42 C86 16, 24 16, 18 42 Z" fill="#151312"/>
      <path d="M16 134 C20 104, 36 94, 55 94 C74 94, 90 104, 94 134 Z" fill="#D8A07C"/>
      <path d="M22 134 L28 105 L44 114 L55 108 L66 114 L82 105 L88 134 Z" fill="${yohanaOutfitColor}"/>
      <rect x="46" y="76" width="18" height="22" rx="8" fill="#CA906C"/>
      <path d="M31 44 C31 27, 79 27, 79 44 L79 58 C79 75, 66 85, 55 85 C44 85, 31 75, 31 58 Z" fill="#D8A07C"/>
      <path d="M37 47 Q44 43 50 46" stroke="#151312" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      <path d="M60 46 Q66 43 73 47" stroke="#151312" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      ${
        eyesClosedRelaxed
          ? `<path d="M38 54 Q44 58 49 54" stroke="#151312" stroke-width="2" stroke-linecap="round" fill="none"/>
             <path d="M61 54 Q66 58 72 54" stroke="#151312" stroke-width="2" stroke-linecap="round" fill="none"/>`
          : `<path d="M37 54 Q44 49 50 54" stroke="#151312" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="44" cy="54" r="2.4" fill="#151312"/>
             <path d="M60 54 Q66 49 73 54" stroke="#151312" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="66" cy="54" r="2.4" fill="#151312"/>`
      }
      <path d="M43 67 Q55 77 67 67 Z" fill="#FFFFFF" stroke="#9E473D" stroke-width="1.5"/>
      <path d="M54 22 C36 22, 24 35, 23 62 C22 82, 16 95, 22 108 C27 94, 30 78, 32 52 C34 38, 44 30, 54 28 Z" fill="#151312"/>
      <path d="M54 22 C72 22, 85 35, 87 62 C88 82, 93 95, 88 108 C83 94, 80 78, 78 52 C76 38, 66 30, 54 28 Z" fill="#151312"/>
    </g>
  `;
}

function createCoupleGiftIllustration(caption, subcaption, outfit1 = '#621F2A', outfit2 = '#596044') {
  const safeCaption = caption.replace(/&/g, '&amp;');
  const safeSub = subcaption.toUpperCase().replace(/&/g, '&amp;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
    <rect width="400" height="300" fill="#F5F0E8"/>
    <ellipse cx="200" cy="135" rx="135" ry="95" fill="#FCFAF6" opacity="0.9"/>
    ${renderCouplePortraits({ danielOutfitColor: outfit1, yohanaOutfitColor: outfit2 })}
    <path d="M0 212 C130 198, 270 222, 400 206 L400 300 L0 300 Z" fill="#EAE2D6"/>
    <text x="200" y="252" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="600" fill="#621F2A" letter-spacing="1">${safeCaption}</text>
    <text x="200" y="273" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#596044" letter-spacing="2.4">${safeSub}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const INITIAL_GIFTS_ROWS = [
  {
    id: 'gift-cafe-varanda',
    name: 'Café da manhã no quarto no primeiro dia de casados',
    description:
      'Pães artesanais, frutas frescas, café coado na hora e zero pressa para começar a lua de mel.',
    long_description:
      'Para acordarmos no primeiro dia da viagem sem despertador: mesa posta na varanda do hotel, pão quentinho, frutas e café especial.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Manhã a Dois',
      'Café na varanda sem pressa',
      '#FCFAF6',
      '#F5F0E8'
    ),
    price: 180.0,
    available_quantity: 6,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: 'Queridinho',
    musical_note: 'Para acordar cantando "Deixa a vida me levar"',
  },
  {
    id: 'gift-jantar-lua-de-mel',
    name: 'Jantar à luz de velas na Lua de Mel',
    description:
      'Um brinde demorado com menu degustação e vinho tinto para celebrar o nosso grande encontro.',
    long_description:
      'Uma noite especial durante a nossa viagem de lua de mel, com culinária autoral, velas na mesa e muitas histórias sobre a festa para relembrar.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Jantar sob Velas',
      'Brinde à nossa história',
      '#292622',
      '#621F2A'
    ),
    price: 460.0,
    available_quantity: 4,
    allow_partial_contribution: true,
    suggested_contributions: [115, 230, 460],
    active: true,
    badge: null,
    musical_note: 'Um brinde à sorte de estarmos juntos',
  },
  {
    id: 'gift-passeio-barco-por-do-sol',
    name: 'Passeio de Barco ao Pôr do Sol',
    description:
      'Tarde inteira navegando por águas calmas, mergulho no fim de tarde e brinde vendo o sol cair.',
    long_description:
      'Um dos momentos que mais sonhamos viver na lua de mel: vento no rosto, mar tranquilo e aquela luz dourada inesquecível de fim de tarde.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Ao Pôr do Sol',
      'Vento no rosto & horizonte',
      '#596044',
      '#FCFAF6'
    ),
    price: 640.0,
    available_quantity: 3,
    allow_partial_contribution: true,
    suggested_contributions: [160, 320, 640],
    active: true,
    badge: null,
    musical_note: null,
  },
  {
    id: 'gift-dia-spa-casal',
    name: 'Tarde de Spa & Massagem Relaxante para o Casal',
    description:
      'Para descansar os pés depois de aproveitar a festa de casamento até o último acorde.',
    long_description:
      'Uma tarde de descanso absoluto durante a viagem com massagem relaxante, óleos essenciais botânicos e banho de imersão.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Dia de Spa',
      'Descanso merecido pós-festa',
      '#FCFAF6',
      '#FCFAF6'
    ),
    price: 540.0,
    available_quantity: 3,
    allow_partial_contribution: true,
    suggested_contributions: [135, 270, 540],
    active: true,
    badge: 'Pós-festa merecido',
    musical_note: null,
  },
  {
    id: 'gift-roda-de-samba-experiencia',
    name: 'Noite de Música ao Vivo & Petiscos na Viagem',
    description:
      'Mesa reservada, drinks autorais e petiscos locais para curtirmos uma noite animada na viagem.',
    long_description:
      'Porque não existiria Daniel & Yohana sem música boa! Uma noite completa com som ao vivo, brinde gelado e alegria sincera.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Noite Musical',
      'Samba, petiscos & sorrisos',
      '#4E3629',
      '#621F2A'
    ),
    price: 290.0,
    available_quantity: 5,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: null,
    musical_note: '“A vida fica mais feliz...”',
  },
  {
    id: 'gift-degustacao-vinicola',
    name: 'Tour & Degustação Harmonizada de Vinhos na Viagem',
    description:
      'Passeio guiado com degustação de rótulos selecionados e tábua de queijos artesanais.',
    long_description:
      'Uma tarde inteira conhecendo sabores locais, brindando a cada etapa da nossa história e escolhendo uma garrafa especial para guardar de lembrança.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Degustação',
      'Vinhos & conversa demorada',
      '#596044',
      '#40151D'
    ),
    price: 520.0,
    available_quantity: 4,
    allow_partial_contribution: true,
    suggested_contributions: [130, 260, 520],
    active: true,
    badge: null,
    musical_note: null,
  },
  {
    id: 'gift-almoco-pe-na-areia',
    name: 'Almoço Pé na Areia sem Olhar o Relógio',
    description:
      'Peixe fresco na brasa, água de coco, sombra boa e uma tarde inteira conversando à beira-mar.',
    long_description:
      'Aquele almoço que começa às duas da tarde e emenda com o pôr do sol, celebrando a tranquilidade dos primeiros dias de casados.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Pé na Areia',
      'Sombra boa & água de coco',
      '#7E8C78',
      '#D8B8AF'
    ),
    price: 340.0,
    available_quantity: 4,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: null,
    musical_note: null,
  },
  {
    id: 'gift-diaria-especial-lua-de-mel',
    name: 'Upgrade de Suíte com Vista Panorâmica',
    description:
      'Uma diária especial em suíte com varanda e vista inesquecível para a nossa hospedagem.',
    long_description:
      'Ajude a tornar nossa estadia na lua de mel ainda mais especial com um quarto cheio de charme, brisa fresca e vista privilegiada.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Refúgio a Dois',
      'Suíte com vista panorâmica',
      '#4E3629',
      '#621F2A'
    ),
    price: 890.0,
    available_quantity: 3,
    allow_partial_contribution: true,
    suggested_contributions: [220, 445, 890],
    active: true,
    badge: 'Aceita cota parcial',
    musical_note: null,
  },
  {
    id: 'gift-cota-passagens-lua-de-mel',
    name: 'Cota Especial — Passagens da Lua de Mel',
    description:
      'Ajude o casal a decolar rumo aos dias de descanso depois de meses planejando cada detalhe da festa.',
    long_description:
      'Você pode contribuir com o valor integral desta cota ou escolher qualquer valor parcial que desejar para impulsionar nossa viagem.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Embarque',
      'Rumo à nossa Lua de Mel',
      '#4E3629',
      '#596044'
    ),
    price: 1200.0,
    available_quantity: 8,
    allow_partial_contribution: true,
    suggested_contributions: [200, 400, 600, 1200],
    active: true,
    badge: 'Contribuição livre',
    musical_note: null,
  },
  {
    id: 'gift-curso-culinaria-casal',
    name: 'Experiência Gastronômica Local com Chef na Viagem',
    description:
      'Uma imersão nos sabores locais durante a lua de mel para aprendermos receitas inesquecíveis.',
    long_description:
      'Inclui visita a ingredientes frescos e jantar preparado na hora. Prometemos reproduzir o prato para os amigos na volta!',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Na Cozinha',
      'Sabores & receitas da viagem',
      '#621F2A',
      '#596044'
    ),
    price: 410.0,
    available_quantity: 1,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: 'Última unidade',
    musical_note: null,
  },
  {
    id: 'gift-item-simbolico-paciencia',
    name: 'Cafés Especiais & Sobremesas pelos Caminhos da Viagem',
    description:
      'Para patrocinar nossas paradas estratégicas em cafeterias e docerias charmosas durante os passeios.',
    long_description:
      'Um mimo leve e delicioso para adoçar nossas caminhadas à tarde durante a lua de mel (com direito a sorvete com morango!).',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • Doces Paradas',
      'Cafés, gelatos & sobremesas',
      '#4E3629',
      '#8C6D58'
    ),
    price: 140.0,
    available_quantity: 10,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: 'Mimo Afetivo',
    musical_note: null,
  },
  {
    id: 'gift-piquenique-por-do-sol-esgotado',
    name: 'Piquenique Exclusivo ao Entardecer',
    description:
      'Cesta completa com pães, queijos, frutas e espumante em um mirante especial da viagem.',
    long_description:
      'Experiência ao ar livre para assistirmos ao pôr do sol. Este item já foi inteiramente presenteado por convidados queridos!',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'Daniel & Yohana • No Mirante',
      'Piquenique ao entardecer',
      '#596044',
      '#621F2A'
    ),
    price: 380.0,
    available_quantity: 0,
    allow_partial_contribution: false,
    suggested_contributions: [],
    active: true,
    badge: null,
    musical_note: null,
  },
];

async function runSeed() {
  const supabase = getSupabaseClient();
  console.log(`Populando ${INITIAL_GIFTS_ROWS.length} presentes na tabela "gifts"...`);

  const { error } = await supabase
    .from('gifts')
    .upsert(INITIAL_GIFTS_ROWS, { onConflict: 'id' });

  if (error) {
    console.error('Erro ao popular presentes no Supabase:', error.message);
    process.exit(1);
  }

  console.log('✅ Presentes populados/atualizados com sucesso no Supabase!');
}

runSeed();
