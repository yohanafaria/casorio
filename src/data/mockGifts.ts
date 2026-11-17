import { Gift, GiftCategory } from '../types';

export const GIFT_CATEGORIES: GiftCategory[] = ['Todas', 'Lua de mel'];

type CoupleSceneType =
  | 'breakfast'
  | 'candle_dinner'
  | 'sunset_boat'
  | 'spa_massage'
  | 'live_music'
  | 'wine_tour'
  | 'beach_lunch'
  | 'panoramic_suite'
  | 'flight_tickets'
  | 'chef_class'
  | 'coffee_gelato'
  | 'sunset_picnic';

/**
 * Renderiza o casal Daniel & Yohana com suas características reais da foto:
 * - Daniel (esquerda): pele morena clara dourada (#D29975), cabelo cacheado escuro volumoso
 *   com cachinhos na testa e laterais (#1C1917), sorriso largo e olhos expressivos.
 * - Yohana (direita): pele morena clara dourada (#D69E7A), cabelo preto liso/ondulado na altura
 *   dos ombros repartido ao meio (#161413), sobrancelhas marcantes, covinhas no sorriso,
 *   vestido de alcinha e postura carinhosa inclinada para o Daniel.
 */
function renderCouplePortraits(options: {
  danielOutfitColor: string;
  yohanaOutfitColor: string;
  eyesClosedRelaxed?: boolean;
  sunglassesOnHead?: boolean;
  chefApron?: boolean;
}): string {
  const {
    danielOutfitColor,
    yohanaOutfitColor,
    eyesClosedRelaxed = false,
    sunglassesOnHead = false,
    chefApron = false,
  } = options;

  return `
    <!-- ================= DANIEL (Esquerda) ================= -->
    <g transform="translate(108, 72)">
      <!-- Ombros e camiseta/traje do Daniel -->
      <path d="M12 138 C14 102, 34 90, 56 90 C78 90, 98 102, 100 138 Z" fill="${danielOutfitColor}"/>
      <path d="M38 90 Q56 102 74 90" stroke="#40151D" stroke-width="1.5" fill="none" opacity="0.35"/>
      ${
        chefApron
          ? `<path d="M32 95 L32 138 L80 138 L80 95 Z" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1.2"/>
             <path d="M40 90 L40 96 M72 90 L72 96" stroke="#621F2A" stroke-width="2"/>`
          : ''
      }

      <!-- Pescoço -->
      <rect x="46" y="74" width="20" height="22" rx="8" fill="#C68B67"/>

      <!-- Cabelo cacheado volumoso (fundo) -->
      <circle cx="32" cy="40" r="14" fill="#1C1917"/>
      <circle cx="80" cy="40" r="14" fill="#1C1917"/>
      <circle cx="28" cy="54" r="11" fill="#1C1917"/>
      <circle cx="84" cy="54" r="11" fill="#1C1917"/>
      <circle cx="42" cy="24" r="15" fill="#1C1917"/>
      <circle cx="56" cy="21" r="16" fill="#1C1917"/>
      <circle cx="70" cy="24" r="15" fill="#1C1917"/>

      <!-- Orelhas -->
      <ellipse cx="29" cy="56" rx="5" ry="8" fill="#C98E6A"/>
      <ellipse cx="83" cy="56" rx="5" ry="8" fill="#C98E6A"/>

      <!-- Rosto do Daniel -->
      <path d="M31 44 C31 28, 81 28, 81 44 L81 58 C81 76, 68 85, 56 85 C44 85, 31 76, 31 58 Z" fill="#D59B76"/>

      <!-- Bochechas coradas suaves -->
      <ellipse cx="39" cy="62" rx="6" ry="3.5" fill="#C47462" opacity="0.35"/>
      <ellipse cx="73" cy="62" rx="6" ry="3.5" fill="#C47462" opacity="0.35"/>

      <!-- Sobrancelhas -->
      <path d="M38 48 Q45 45 50 47" stroke="#1C1917" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M62 47 Q67 45 74 48" stroke="#1C1917" stroke-width="2.2" stroke-linecap="round" fill="none"/>

      <!-- Olhos sorridentes -->
      ${
        eyesClosedRelaxed
          ? `<path d="M39 54 Q45 58 50 54" stroke="#292622" stroke-width="2" stroke-linecap="round" fill="none"/>
             <path d="M62 54 Q67 58 73 54" stroke="#292622" stroke-width="2" stroke-linecap="round" fill="none"/>`
          : `<path d="M39 54 Q45 50 50 54" stroke="#292622" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="44.5" cy="54" r="2.2" fill="#1C1917"/>
             <path d="M62 54 Q67 50 73 54" stroke="#292622" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="67.5" cy="54" r="2.2" fill="#1C1917"/>`
      }

      <!-- Nariz -->
      <path d="M56 53 L54 62 Q56 64 59 62" stroke="#B67956" stroke-width="1.8" stroke-linecap="round" fill="none"/>

      <!-- Sorriso largo e alegre característico -->
      <path d="M42 67 Q56 78 70 67 Z" fill="#FFFFFF" stroke="#8C4237" stroke-width="1.5"/>
      <path d="M40 65 Q38 68 41 71" stroke="#B67956" stroke-width="1.3" stroke-linecap="round" fill="none"/>
      <path d="M72 65 Q74 68 71 71" stroke="#B67956" stroke-width="1.3" stroke-linecap="round" fill="none"/>

      <!-- Cachos da frente na testa (assinatura visual do Daniel) -->
      <circle cx="35" cy="34" r="9" fill="#1C1917"/>
      <circle cx="46" cy="31" r="10" fill="#1C1917"/>
      <circle cx="57" cy="30" r="10" fill="#1C1917"/>
      <circle cx="68" cy="31" r="10" fill="#1C1917"/>
      <circle cx="77" cy="35" r="9" fill="#1C1917"/>
      <!-- Textura de cachos (linhas curvas sutis) -->
      <path d="M41 34 C43 38, 48 38, 49 34" stroke="#3A3430" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <path d="M53 33 C55 37, 60 37, 61 33" stroke="#3A3430" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <path d="M65 34 C67 38, 72 38, 73 34" stroke="#3A3430" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <path d="M35 24 C38 20, 44 20, 46 25" stroke="#3A3430" stroke-width="1.3" stroke-linecap="round" fill="none"/>
      <path d="M62 22 C65 18, 71 19, 73 24" stroke="#3A3430" stroke-width="1.3" stroke-linecap="round" fill="none"/>
      ${
        sunglassesOnHead
          ? `<rect x="37" y="21" width="16" height="9" rx="4" fill="#40151D" stroke="#D8B8AF" stroke-width="1.2"/>
             <rect x="59" y="21" width="16" height="9" rx="4" fill="#40151D" stroke="#D8B8AF" stroke-width="1.2"/>
             <line x1="53" y1="25" x2="59" y2="25" stroke="#D8B8AF" stroke-width="1.5"/>`
          : ''
      }
    </g>

    <!-- ================= YOHANA (Direita, inclinada carinhosamente) ================= -->
    <g transform="translate(188, 78) rotate(-4 55 70)">
      <!-- Cabelo preto liso/ondulado na altura dos ombros (camada de trás) -->
      <path d="M18 42 C12 72, 12 100, 20 116 L90 116 C98 100, 98 72, 92 42 C86 16, 24 16, 18 42 Z" fill="#151312"/>

      <!-- Ombros e vestido de alcinha da Yohana -->
      <path d="M16 134 C20 104, 36 94, 55 94 C74 94, 90 104, 94 134 Z" fill="#D8A07C"/>
      <!-- Detalhe sutil da tatuagem na clavícula direita como na foto -->
      <path d="M66 99 L75 95" stroke="#596044" stroke-width="1" stroke-dasharray="1.5 1.5" opacity="0.65"/>

      <!-- Vestido de alcinha elegante -->
      <path d="M22 134 L28 105 L44 114 L55 108 L66 114 L82 105 L88 134 Z" fill="${yohanaOutfitColor}"/>
      <line x1="31" y1="95" x2="29" y2="107" stroke="${yohanaOutfitColor}" stroke-width="2.2"/>
      <line x1="79" y1="95" x2="81" y2="107" stroke="${yohanaOutfitColor}" stroke-width="2.2"/>
      ${
        chefApron
          ? `<path d="M30 104 L30 134 L80 134 L80 104 Z" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1.2"/>`
          : ''
      }

      <!-- Pescoço -->
      <rect x="46" y="76" width="18" height="22" rx="8" fill="#CA906C"/>

      <!-- Rosto da Yohana -->
      <path d="M31 44 C31 27, 79 27, 79 44 L79 58 C79 75, 66 85, 55 85 C44 85, 31 75, 31 58 Z" fill="#D8A07C"/>

      <!-- Blush suave e covinhas -->
      <ellipse cx="39" cy="63" rx="6" ry="3.5" fill="#C97865" opacity="0.38"/>
      <ellipse cx="71" cy="63" rx="6" ry="3.5" fill="#C97865" opacity="0.38"/>

      <!-- Sobrancelhas escuras bem desenhadas -->
      <path d="M37 47 Q44 43 50 46" stroke="#151312" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      <path d="M60 46 Q66 43 73 47" stroke="#151312" stroke-width="2.3" stroke-linecap="round" fill="none"/>

      <!-- Olhos expressivos com delineado sutil -->
      ${
        eyesClosedRelaxed
          ? `<path d="M38 54 Q44 58 49 54" stroke="#151312" stroke-width="2" stroke-linecap="round" fill="none"/>
             <path d="M61 54 Q66 58 72 54" stroke="#151312" stroke-width="2" stroke-linecap="round" fill="none"/>`
          : `<path d="M37 54 Q44 49 50 54" stroke="#151312" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="44" cy="54" r="2.4" fill="#151312"/>
             <path d="M60 54 Q66 49 73 54" stroke="#151312" stroke-width="2.2" stroke-linecap="round" fill="none"/>
             <circle cx="66" cy="54" r="2.4" fill="#151312"/>`
      }

      <!-- Nariz delicado -->
      <path d="M55 53 L53.5 62 Q55 63.5 57.5 62" stroke="#B87C58" stroke-width="1.6" stroke-linecap="round" fill="none"/>

      <!-- Sorriso iluminado com covinha -->
      <path d="M43 67 Q55 77 67 67 Z" fill="#FFFFFF" stroke="#9E473D" stroke-width="1.5"/>
      <path d="M69 65 Q71 68 68 71" stroke="#B87C58" stroke-width="1.4" stroke-linecap="round" fill="none"/>

      <!-- Mechas frontais do cabelo preto emoldurando o rosto -->
      <path d="M54 22 C36 22, 24 35, 23 62 C22 82, 16 95, 22 108 C27 94, 30 78, 32 52 C34 38, 44 30, 54 28 Z" fill="#151312"/>
      <path d="M54 22 C72 22, 85 35, 87 62 C88 82, 93 95, 88 108 C83 94, 80 78, 78 52 C76 38, 66 30, 54 28 Z" fill="#151312"/>
      <!-- Brilho sutil nos fios -->
      <path d="M27 46 Q24 64 27 82" stroke="#35302D" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <path d="M82 46 Q85 64 82 82" stroke="#35302D" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    </g>
  `;
}

function createCoupleGiftIllustration(
  scene: CoupleSceneType,
  caption: string,
  subcaption: string
): string {
  let backdropElements = '';
  let foregroundProps = '';
  let coupleMarkup = '';

  switch (scene) {
    case 'breakfast':
      backdropElements = `
        <circle cx="320" cy="64" r="34" fill="#D8B8AF" opacity="0.55"/>
        <path d="M40 40 L40 210 M360 40 L360 210" stroke="#D8B8AF" stroke-width="1.5" opacity="0.5"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#FCFAF6',
        yohanaOutfitColor: '#F5F0E8',
      });
      foregroundProps = `
        <!-- Mesa de café da manhã na varanda -->
        <rect x="65" y="202" width="270" height="10" rx="5" fill="#596044"/>
        <!-- Xícaras de café fumegantes -->
        <path d="M135 182 L157 182 L154 202 L138 202 Z" fill="#621F2A"/>
        <path d="M157 186 C163 186, 163 196, 156 196" stroke="#621F2A" stroke-width="2.5" fill="none"/>
        <path d="M145 176 Q148 168 144 162" stroke="#621F2A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M245 182 L267 182 L264 202 L248 202 Z" fill="#621F2A"/>
        <path d="M267 186 C273 186, 273 196, 266 196" stroke="#621F2A" stroke-width="2.5" fill="none"/>
        <path d="M255 176 Q258 168 254 162" stroke="#621F2A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- Prato com frutas e croissant -->
        <ellipse cx="200" cy="198" rx="28" ry="6" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1.5"/>
        <path d="M188 195 Q200 182 212 195" fill="#C97865"/>
      `;
      break;

    case 'candle_dinner':
      backdropElements = `
        <rect x="0" y="0" width="400" height="225" fill="#40151D" opacity="0.1"/>
        <circle cx="95" cy="70" r="3" fill="#D8B8AF"/>
        <circle cx="315" cy="60" r="3.5" fill="#D8B8AF"/>
        <circle cx="200" cy="40" r="2.5" fill="#621F2A" opacity="0.5"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#292622',
        yohanaOutfitColor: '#621F2A',
      });
      foregroundProps = `
        <rect x="60" y="204" width="280" height="8" rx="4" fill="#621F2A"/>
        <!-- Castiçal e vela acesa no centro -->
        <rect x="196" y="168" width="8" height="36" rx="2" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1"/>
        <path d="M200 154 C195 162, 205 162, 200 154 Z" fill="#E07A5F"/>
        <circle cx="200" cy="159" r="9" fill="#D8B8AF" opacity="0.45"/>
        <!-- Duas taças de vinho tinto brindando -->
        <path d="M150 172 L166 172 C166 184, 150 184, 150 172 Z" fill="#621F2A"/>
        <line x1="158" y1="182" x2="158" y2="204" stroke="#40151D" stroke-width="2"/>
        <path d="M234 172 L250 172 C250 184, 234 184, 234 172 Z" fill="#621F2A"/>
        <line x1="242" y1="182" x2="242" y2="204" stroke="#40151D" stroke-width="2"/>
      `;
      break;

    case 'sunset_boat':
      backdropElements = `
        <!-- Grande sol de fim de tarde no horizonte -->
        <circle cx="200" cy="95" r="68" fill="#D8B8AF" opacity="0.55"/>
        <path d="M20 185 Q110 170 200 185 T380 185" stroke="#7E8C78" stroke-width="2.5" fill="none"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#596044',
        yohanaOutfitColor: '#FCFAF6',
        sunglassesOnHead: true,
      });
      foregroundProps = `
        <!-- Casco do barco e ondas do mar -->
        <path d="M65 188 L335 188 L305 216 L95 216 Z" fill="#621F2A"/>
        <path d="M30 214 Q115 202 200 214 T370 214" stroke="#596044" stroke-width="3" fill="none"/>
      `;
      break;

    case 'spa_massage':
      backdropElements = `
        <!-- Ramos de eucalipto relaxantes ao fundo -->
        <path d="M55 180 Q75 110 115 60" stroke="#596044" stroke-width="2" fill="none"/>
        <ellipse cx="75" cy="125" rx="14" ry="7" transform="rotate(-35 75 125)" fill="#7E8C78" opacity="0.65"/>
        <ellipse cx="95" cy="92" rx="14" ry="7" transform="rotate(-25 95 92)" fill="#596044" opacity="0.55"/>
        <path d="M345 180 Q325 110 285 60" stroke="#596044" stroke-width="2" fill="none"/>
        <ellipse cx="325" cy="125" rx="14" ry="7" transform="rotate(35 325 125)" fill="#7E8C78" opacity="0.65"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#FCFAF6',
        yohanaOutfitColor: '#FCFAF6',
        eyesClosedRelaxed: true,
      });
      foregroundProps = `
        <!-- Toalhas enroladas, pedras de spa e velas -->
        <rect x="75" y="202" width="250" height="8" rx="4" fill="#7E8C78"/>
        <ellipse cx="140" cy="196" rx="16" ry="7" fill="#596044"/>
        <ellipse cx="140" cy="187" rx="11" ry="5" fill="#292622"/>
        <rect x="252" y="184" width="14" height="18" rx="3" fill="#FCFAF6" stroke="#D8B8AF"/>
        <circle cx="259" cy="179" r="4" fill="#621F2A"/>
      `;
      break;

    case 'live_music':
      backdropElements = `
        <!-- Notas musicais e arco acústico ao fundo -->
        <text x="68" y="92" font-family="Georgia, serif" font-size="28" fill="#621F2A" opacity="0.65">♪</text>
        <text x="318" y="84" font-family="Georgia, serif" font-size="26" fill="#596044" opacity="0.7">♫</text>
        <text x="202" y="54" font-family="Georgia, serif" font-size="22" fill="#621F2A" opacity="0.5">♬</text>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#4E3629',
        yohanaOutfitColor: '#621F2A',
      });
      foregroundProps = `
        <rect x="70" y="202" width="260" height="8" rx="4" fill="#40151D"/>
        <!-- Pandeiro de samba e dois copos de drinks na mesa -->
        <circle cx="200" cy="192" r="18" fill="#FCFAF6" stroke="#621F2A" stroke-width="3"/>
        <circle cx="182" cy="192" r="3" fill="#D8B8AF"/>
        <circle cx="218" cy="192" r="3" fill="#D8B8AF"/>
        <circle cx="200" cy="174" r="3" fill="#D8B8AF"/>
        <rect x="135" y="180" width="14" height="22" rx="3" fill="#D8B8AF" stroke="#621F2A" stroke-width="1.5"/>
        <rect x="252" y="180" width="14" height="22" rx="3" fill="#D8B8AF" stroke="#621F2A" stroke-width="1.5"/>
      `;
      break;

    case 'wine_tour':
      backdropElements = `
        <!-- Folhas de parreira e cachos de uva bordô -->
        <circle cx="78" cy="78" r="6" fill="#621F2A"/>
        <circle cx="88" cy="78" r="6" fill="#621F2A"/>
        <circle cx="83" cy="87" r="6" fill="#40151D"/>
        <circle cx="312" cy="78" r="6" fill="#621F2A"/>
        <circle cx="322" cy="78" r="6" fill="#621F2A"/>
        <circle cx="317" cy="87" r="6" fill="#40151D"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#596044',
        yohanaOutfitColor: '#40151D',
      });
      foregroundProps = `
        <rect x="65" y="202" width="270" height="8" rx="4" fill="#40151D"/>
        <!-- Garrafa de vinho e taças -->
        <rect x="193" y="162" width="14" height="40" rx="4" fill="#292622"/>
        <rect x="197" y="150" width="6" height="14" rx="1" fill="#621F2A"/>
        <rect x="195" y="174" width="10" height="14" fill="#F5F0E8"/>
        <path d="M152 174 L166 174 C166 186, 152 186, 152 174 Z" fill="#621F2A"/>
        <line x1="159" y1="184" x2="159" y2="202" stroke="#292622" stroke-width="2"/>
        <path d="M234 174 L248 174 C248 186, 234 186, 234 174 Z" fill="#621F2A"/>
        <line x1="241" y1="184" x2="241" y2="202" stroke="#292622" stroke-width="2"/>
      `;
      break;

    case 'beach_lunch':
      backdropElements = `
        <!-- Guarda-sol listrado e sol tropical -->
        <path d="M35 90 Q115 35 195 90 Z" fill="#621F2A" opacity="0.85"/>
        <line x1="115" y1="62" x2="100" y2="195" stroke="#596044" stroke-width="3"/>
        <circle cx="325" cy="65" r="26" fill="#D8B8AF" opacity="0.7"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#7E8C78',
        yohanaOutfitColor: '#D8B8AF',
        sunglassesOnHead: true,
      });
      foregroundProps = `
        <rect x="65" y="202" width="270" height="8" rx="4" fill="#D8B8AF"/>
        <!-- Dois cocos verdes com canudinho -->
        <circle cx="152" cy="190" r="13" fill="#596044"/>
        <line x1="152" y1="180" x2="162" y2="164" stroke="#621F2A" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="248" cy="190" r="13" fill="#596044"/>
        <line x1="248" y1="180" x2="238" y2="164" stroke="#621F2A" stroke-width="2.5" stroke-linecap="round"/>
      `;
      break;

    case 'panoramic_suite':
      backdropElements = `
        <!-- Grande janela em arco com vista para as montanhas -->
        <path d="M75 205 L75 85 C75 20, 325 20, 325 85 L325 205" stroke="#621F2A" stroke-width="2.5" fill="#FCFAF6" opacity="0.6"/>
        <path d="M76 150 L145 105 L215 145 L275 95 L324 140" stroke="#7E8C78" stroke-width="2" fill="none" opacity="0.5"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#4E3629',
        yohanaOutfitColor: '#621F2A',
      });
      foregroundProps = `
        <!-- Balaustrada da varanda panorâmica -->
        <line x1="65" y1="204" x2="335" y2="204" stroke="#621F2A" stroke-width="4" stroke-linecap="round"/>
      `;
      break;

    case 'flight_tickets':
      backdropElements = `
        <!-- Avião subindo rumo à Lua de Mel e rota pontilhada -->
        <path d="M55 125 Q165 40 315 55" stroke="#621F2A" stroke-width="2" stroke-dasharray="5 5" fill="none"/>
        <path d="M310 45 L338 52 L316 66 L320 55 Z" fill="#621F2A"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#4E3629',
        yohanaOutfitColor: '#596044',
      });
      foregroundProps = `
        <rect x="65" y="204" width="270" height="6" rx="3" fill="#596044"/>
        <!-- Dois passaportes / cartões de embarque na frente do casal -->
        <rect x="148" y="172" width="24" height="32" rx="3" transform="rotate(-10 148 172)" fill="#621F2A" stroke="#FCFAF6" stroke-width="1.5"/>
        <rect x="226" y="172" width="24" height="32" rx="3" transform="rotate(10 226 172)" fill="#596044" stroke="#FCFAF6" stroke-width="1.5"/>
      `;
      break;

    case 'chef_class':
      backdropElements = `
        <circle cx="85" cy="75" r="18" fill="#7E8C78" opacity="0.25"/>
        <circle cx="315" cy="75" r="18" fill="#D8B8AF" opacity="0.35"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#621F2A',
        yohanaOutfitColor: '#596044',
        chefApron: true,
      });
      foregroundProps = `
        <rect x="65" y="202" width="270" height="8" rx="4" fill="#596044"/>
        <!-- Panela gourmet fumegante no centro -->
        <rect x="172" y="178" width="56" height="24" rx="5" fill="#621F2A"/>
        <line x1="164" y1="184" x2="172" y2="184" stroke="#292622" stroke-width="3" stroke-linecap="round"/>
        <line x1="228" y1="184" x2="236" y2="184" stroke="#292622" stroke-width="3" stroke-linecap="round"/>
        <path d="M192 170 Q196 160 190 152" stroke="#596044" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M208 170 Q212 160 206 152" stroke="#596044" stroke-width="2" fill="none" stroke-linecap="round"/>
      `;
      break;

    case 'coffee_gelato':
      backdropElements = `
        <!-- Toldo charmoso de cafeteria/gelateria -->
        <path d="M60 25 L340 25 L350 52 L50 52 Z" fill="#621F2A" opacity="0.82"/>
        <path d="M50 52 Q75 64 100 52 Q125 64 150 52 Q175 64 200 52 Q225 64 250 52 Q275 64 300 52 Q325 64 350 52" fill="#D8B8AF"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#4E3629',
        yohanaOutfitColor: '#8C6D58',
      });
      foregroundProps = `
        <rect x="70" y="204" width="260" height="6" rx="3" fill="#D8B8AF"/>
        <!-- Casquinha de gelato com bola de pistache e morango + taça de sobremesa como na foto! -->
        <polygon points="154,204 144,180 164,180" fill="#C68B67"/>
        <circle cx="150" cy="176" r="8" fill="#7E8C78"/>
        <circle cx="158" cy="176" r="8" fill="#621F2A"/>
        <!-- Pratinho branco com sobremesa e velinha rosa (homenagem direta à foto enviada!) -->
        <ellipse cx="242" cy="198" rx="26" ry="7" fill="#FCFAF6" stroke="#D8B8AF" stroke-width="1.5"/>
        <circle cx="238" cy="192" r="7" fill="#F5F0E8"/>
        <circle cx="247" cy="191" r="6" fill="#C97865"/>
        <line x1="242" y1="176" x2="242" y2="186" stroke="#D8B8AF" stroke-width="2"/>
      `;
      break;

    case 'sunset_picnic':
      backdropElements = `
        <circle cx="88" cy="70" r="32" fill="#D8B8AF" opacity="0.65"/>
        <path d="M20 195 Q130 165 250 190 T390 180" stroke="#7E8C78" stroke-width="2" fill="none"/>
      `;
      coupleMarkup = renderCouplePortraits({
        danielOutfitColor: '#596044',
        yohanaOutfitColor: '#621F2A',
      });
      foregroundProps = `
        <!-- Toalha e cesta de piquenique -->
        <path d="M60 202 L340 202 L355 214 L45 214 Z" fill="#621F2A"/>
        <rect x="180" y="176" width="40" height="26" rx="4" fill="#C68B67" stroke="#40151D" stroke-width="1.5"/>
        <line x1="180" y1="188" x2="220" y2="188" stroke="#40151D" stroke-width="1.5"/>
      `;
      break;
  }

  const safeCaption = caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubcaption = subcaption
    .toUpperCase()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
    <!-- Fundo Marfim Editorial -->
    <rect width="400" height="300" fill="#F5F0E8"/>
    <!-- Halo orgânico atrás do casal -->
    <ellipse cx="200" cy="135" rx="135" ry="95" fill="#FCFAF6" opacity="0.9"/>
    <path d="M28 220 C85 110, 145 32, 372 28" stroke="#D8B8AF" stroke-width="1.2" fill="none" opacity="0.55"/>

    ${backdropElements}
    ${coupleMarkup}
    ${foregroundProps}

    <!-- Faixa inferior de legenda editorial -->
    <path d="M0 212 C130 198, 270 222, 400 206 L400 300 L0 300 Z" fill="#EAE2D6"/>
    <text x="200" y="252" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="600" fill="#621F2A" letter-spacing="1">${safeCaption}</text>
    <text x="200" y="273" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#596044" letter-spacing="2.4">${safeSubcaption}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const INITIAL_MOCK_GIFTS: Gift[] = [
  {
    id: 'gift-cafe-varanda',
    name: 'Café da manhã no quarto no primeiro dia de casados',
    description:
      'Pães artesanais, frutas frescas, café coado na hora e zero pressa para começar a lua de mel.',
    longDescription:
      'Para acordarmos no primeiro dia da viagem sem despertador: mesa posta na varanda do hotel, pão quentinho, frutas e café especial.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'breakfast',
      'Daniel & Yohana • Manhã a Dois',
      'Café na varanda sem pressa'
    ),
    price: 180.0,
    availableQuantity: 6,
    allowPartialContribution: false,
    active: true,
    badge: 'Queridinho',
    musicalNote: 'Para acordar cantando "Deixa a vida me levar"',
  },
  {
    id: 'gift-jantar-lua-de-mel',
    name: 'Jantar à luz de velas na Lua de Mel',
    description:
      'Um brinde demorado com menu degustação e vinho tinto para celebrar o nosso grande encontro.',
    longDescription:
      'Uma noite especial durante a nossa viagem de lua de mel, com culinária autoral, velas na mesa e muitas histórias sobre a festa para relembrar.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'candle_dinner',
      'Daniel & Yohana • Jantar sob Velas',
      'Brinde à nossa história'
    ),
    price: 460.0,
    availableQuantity: 4,
    allowPartialContribution: true,
    suggestedContributions: [115, 230, 460],
    active: true,
    musicalNote: 'Um brinde à sorte de estarmos juntos',
  },
  {
    id: 'gift-passeio-barco-por-do-sol',
    name: 'Passeio de Barco ao Pôr do Sol',
    description:
      'Tarde inteira navegando por águas calmas, mergulho no fim de tarde e brinde vendo o sol cair.',
    longDescription:
      'Um dos momentos que mais sonhamos viver na lua de mel: vento no rosto, mar tranquilo e aquela luz dourada inesquecível de fim de tarde.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'sunset_boat',
      'Daniel & Yohana • Ao Pôr do Sol',
      'Vento no rosto & horizonte'
    ),
    price: 640.0,
    availableQuantity: 3,
    allowPartialContribution: true,
    suggestedContributions: [160, 320, 640],
    active: true,
  },
  {
    id: 'gift-dia-spa-casal',
    name: 'Tarde de Spa & Massagem Relaxante para o Casal',
    description:
      'Para descansar os pés depois de aproveitar a festa de casamento até o último acorde.',
    longDescription:
      'Uma tarde de descanso absoluto durante a viagem com massagem relaxante, óleos essenciais botânicos e banho de imersão.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'spa_massage',
      'Daniel & Yohana • Dia de Spa',
      'Descanso merecido pós-festa'
    ),
    price: 540.0,
    availableQuantity: 3,
    allowPartialContribution: true,
    suggestedContributions: [135, 270, 540],
    active: true,
    badge: 'Pós-festa merecido',
  },
  {
    id: 'gift-roda-de-samba-experiencia',
    name: 'Noite de Música ao Vivo & Petiscos na Viagem',
    description:
      'Mesa reservada, drinks autorais e petiscos locais para curtirmos uma noite animada na viagem.',
    longDescription:
      'Porque não existiria Daniel & Yohana sem música boa! Uma noite completa com som ao vivo, brinde gelado e alegria sincera.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'live_music',
      'Daniel & Yohana • Noite Musical',
      'Samba, petiscos & sorrisos'
    ),
    price: 290.0,
    availableQuantity: 5,
    allowPartialContribution: false,
    active: true,
    musicalNote: '“A vida fica mais feliz...”',
  },
  {
    id: 'gift-degustacao-vinicola',
    name: 'Tour & Degustação Harmonizada de Vinhos na Viagem',
    description:
      'Passeio guiado com degustação de rótulos selecionados e tábua de queijos artesanais.',
    longDescription:
      'Uma tarde inteira conhecendo sabores locais, brindando a cada etapa da nossa história e escolhendo uma garrafa especial para guardar de lembrança.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'wine_tour',
      'Daniel & Yohana • Degustação',
      'Vinhos & conversa demorada'
    ),
    price: 520.0,
    availableQuantity: 4,
    allowPartialContribution: true,
    suggestedContributions: [130, 260, 520],
    active: true,
  },
  {
    id: 'gift-almoco-pe-na-areia',
    name: 'Almoço Pé na Areia sem Olhar o Relógio',
    description:
      'Peixe fresco na brasa, água de coco, sombra boa e uma tarde inteira conversando à beira-mar.',
    longDescription:
      'Aquele almoço que começa às duas da tarde e emenda com o pôr do sol, celebrando a tranquilidade dos primeiros dias de casados.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'beach_lunch',
      'Daniel & Yohana • Pé na Areia',
      'Sombra boa & água de coco'
    ),
    price: 340.0,
    availableQuantity: 4,
    allowPartialContribution: false,
    active: true,
  },
  {
    id: 'gift-diaria-especial-lua-de-mel',
    name: 'Upgrade de Suíte com Vista Panorâmica',
    description:
      'Uma diária especial em suíte com varanda e vista inesquecível para a nossa hospedagem.',
    longDescription:
      'Ajude a tornar nossa estadia na lua de mel ainda mais especial com um quarto cheio de charme, brisa fresca e vista privilegiada.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'panoramic_suite',
      'Daniel & Yohana • Refúgio a Dois',
      'Suíte com vista panorâmica'
    ),
    price: 890.0,
    availableQuantity: 3,
    allowPartialContribution: true,
    suggestedContributions: [220, 445, 890],
    active: true,
    badge: 'Aceita cota parcial',
  },
  {
    id: 'gift-cota-passagens-lua-de-mel',
    name: 'Cota Especial — Passagens da Lua de Mel',
    description:
      'Ajude o casal a decolar rumo aos dias de descanso depois de meses planejando cada detalhe da festa.',
    longDescription:
      'Você pode contribuir com o valor integral desta cota ou escolher qualquer valor parcial que desejar para impulsionar nossa viagem.',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'flight_tickets',
      'Daniel & Yohana • Embarque',
      'Rumo à nossa Lua de Mel'
    ),
    price: 1200.0,
    availableQuantity: 8,
    allowPartialContribution: true,
    suggestedContributions: [200, 400, 600, 1200],
    active: true,
    badge: 'Contribuição livre',
  },
  {
    id: 'gift-curso-culinaria-casal',
    name: 'Experiência Gastronômica Local com Chef na Viagem',
    description:
      'Uma imersão nos sabores locais durante a lua de mel para aprendermos receitas inesquecíveis.',
    longDescription:
      'Inclui visita a ingredientes frescos e jantar preparado na hora. Prometemos reproduzir o prato para os amigos na volta!',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'chef_class',
      'Daniel & Yohana • Na Cozinha',
      'Sabores & receitas da viagem'
    ),
    price: 410.0,
    availableQuantity: 1,
    allowPartialContribution: false,
    active: true,
    badge: 'Última unidade',
  },
  {
    id: 'gift-item-simbolico-paciencia',
    name: 'Cafés Especiais & Sobremesas pelos Caminhos da Viagem',
    description:
      'Para patrocinar nossas paradas estratégicas em cafeterias e docerias charmosas durante os passeios.',
    longDescription:
      'Um mimo leve e delicioso para adoçar nossas caminhadas à tarde durante a lua de mel (com direito a sorvete com morango!).',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'coffee_gelato',
      'Daniel & Yohana • Doces Paradas',
      'Cafés, gelatos & sobremesas'
    ),
    price: 140.0,
    availableQuantity: 10,
    allowPartialContribution: false,
    active: true,
    badge: 'Mimo Afetivo',
  },
  {
    id: 'gift-piquenique-por-do-sol-esgotado',
    name: 'Piquenique Exclusivo ao Entardecer',
    description:
      'Cesta completa com pães, queijos, frutas e espumante em um mirante especial da viagem.',
    longDescription:
      'Experiência ao ar livre para assistirmos ao pôr do sol. Este item já foi inteiramente presenteado por convidados queridos!',
    category: 'Lua de mel',
    image: createCoupleGiftIllustration(
      'sunset_picnic',
      'Daniel & Yohana • No Mirante',
      'Piquenique ao entardecer'
    ),
    price: 380.0,
    availableQuantity: 0,
    allowPartialContribution: false,
    active: true,
  },
];
