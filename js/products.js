// Bubbles Toy Co. - Complete Product Catalog & Stage Boxes Data
// Sourced from E&J Sri Lanka Market Research & Curated Developmental Plan

export const CATEGORIES = [];

export const AGE_RANGES = [
  { id: 'all', label: 'All Ages' },
  { id: '0-1y', label: '0–1 Year' },
  { id: '1-2y', label: '1–2 Years' },
  { id: '2-3y', label: '2–3 Years' },
  { id: '3-4y', label: '3–4 Years' },
  { id: '5y-plus', label: '5+ Years' }
];

export const SHOP_BY_AGE_GROUPS = [
  {
    id: '0-1y',
    title: '0–1 Year',
    ageRange: '0–12 Months',
    badge: 'Sensory & Grasping',
    icon: '🍼',
    focus: 'Reflexes & Auditory Bonding',
    description: 'Gentle stimuli, soothing rattles, safe mouthing textures, crawling practice & baby soft books.',
    milestones: ['Visual tracking', 'Palmar grasp reflex', 'Tummy time strength', 'Auditory bonding'],
    sampleToys: 'Wooden Baby Rattle Set • Animals Quiet Book • Crawl Practice Buddy',
    themeClass: 'age-theme-0-1',
    boxId: 'box-stage-0'
  },
  {
    id: '1-2y',
    title: '1–2 Years',
    ageRange: '12–24 Months',
    badge: 'Toddler Movement',
    icon: '🌱',
    focus: 'Cause-and-Effect & Stacking',
    description: 'Walking bikes, balance cars, wooden activity cubes & rainbow push-pull blocks.',
    milestones: ['Pincer grasp precision', 'Object permanence', 'Push & pull motion', 'Early sorting'],
    sampleToys: 'Elephant Walking Bike • Wooden Activity Cube • Curated 12-18M Kit',
    themeClass: 'age-theme-1-2',
    boxId: 'box-stage-1'
  },
  {
    id: '2-3y',
    title: '2–3 Years',
    ageRange: '24–36 Months',
    badge: 'Milestone Formula',
    icon: '🧩',
    focus: 'Problem Solving & Pre-Writing',
    description: 'Smart board counting puzzles, 6-in-1 activity cubes, sliding balance cars & activity tables.',
    milestones: ['Interlocking puzzles', 'Counting 1-10', 'Pre-writing tripod grip', 'Pretend narrative play'],
    sampleToys: 'Smart Board Counting Blocks • Drawing Table • 6-in-1 Activity Cube',
    themeClass: 'age-theme-2-3',
    boxId: 'box-stage-2'
  },
  {
    id: '3-4y',
    title: '3–4 Years',
    ageRange: '36–48 Months',
    badge: 'STEAM Construction',
    icon: '🚀',
    focus: 'Pre-Math & Structural Logic',
    description: '88-piece assembly building bricks, felt busy boards, musical instruments & drawing stands.',
    milestones: ['3D architectural geometry', 'Fine motor mastery', 'Creative mark-making', 'Spatial reasoning'],
    sampleToys: '88pcs Building Bricks • Felt Busy Board • Art Drawing Table',
    themeClass: 'age-theme-3-4',
    boxId: 'box-stage-3'
  },
  {
    id: '5y-plus',
    title: '5+ Years',
    ageRange: '5+ Years & Pre-School',
    badge: 'Kindergarten Ready',
    icon: '🎓',
    focus: 'STEAM Building, Logic & Motion',
    description: '88pcs DIY architectural bricks, 7PCS intellectual clock & puzzle sets, electric ride-on cars & fidget backpacks.',
    milestones: ['Complex structural design', 'Geometry & puzzle assembly', 'Coordination & balance', 'Practical skills'],
    sampleToys: '88pcs DIY Bricks House • 7PCS Intellectual Set • Electric Ride-on Car',
    themeClass: 'age-theme-5-plus',
    boxId: 'box-stage-4'
  }
];

// Helper to render product media (photo if available, falling back to SVG)
export function renderProductMedia(item, className = '') {
  let imgSrc = item ? item.imageSrc : null;
  if (!imgSrc && item && item.id) {
    const found = typeof getProductById === 'function' ? getProductById(item.id) : null;
    if (found && found.imageSrc) {
      imgSrc = found.imageSrc;
    }
  }
  if (!imgSrc && item && item.isCustomBox && item.customData && item.customData.items && item.customData.items.length > 0) {
    imgSrc = item.customData.items[0].imageSrc || null;
  }
  if (imgSrc) {
    const fallbackSvgType = (item && item.imageType) || 'wooden-blocks';
    return `<img src="${imgSrc}" alt="${(item && item.title) || 'Product'}" class="toy-photo ${className}" loading="lazy" onerror="this.onerror=null; this.outerHTML=window.generateToySvg ? window.generateToySvg('${fallbackSvgType}') : '';" />`;
  }
  return generateToySvg(item ? (item.imageType || 'wooden-blocks') : 'wooden-blocks');
}

// Helper to generate colorful SVG toy representations
export function generateToySvg(type) {

  switch (type) {
    case 'box-newborn':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <defs>
          <linearGradient id="boxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD6A5"/>
            <stop offset="100%" stop-color="#FFADAD"/>
          </linearGradient>
        </defs>
        <rect x="25" y="65" width="150" height="110" rx="16" fill="url(#boxGrad1)"/>
        <path d="M15 65 L100 25 L185 65 L100 85 Z" fill="#FFAAA6"/>
        <rect x="90" y="65" width="20" height="110" fill="#FFF275"/>
        <path d="M100 25 C80 5 60 35 100 45 C140 35 120 5 100 25" fill="#FFD166"/>
        <circle cx="65" cy="115" r="14" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="135" cy="125" r="18" fill="#FFFFFF" opacity="0.5"/>
        <circle cx="100" cy="130" r="12" fill="#FFFFFF" opacity="0.7"/>
        <text x="100" y="160" font-family="'Nunito', sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#FFFFFF">0-12M BUBBLES</text>
      </svg>`;
    
    case 'box-toddler':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="25" y="65" width="150" height="110" rx="16" fill="#CAFFBF"/>
        <path d="M15 65 L100 25 L185 65 L100 85 Z" fill="#A3E635"/>
        <rect x="90" y="65" width="20" height="110" fill="#38BDF8"/>
        <circle cx="65" cy="115" r="16" fill="#FDE047"/>
        <polygon points="135,100 150,130 120,130" fill="#FB7185"/>
        <text x="100" y="160" font-family="'Nunito', sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#1E293B">1-2Y EXPLORER</text>
      </svg>`;

    case 'box-milestone':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="25" y="65" width="150" height="110" rx="16" fill="#9BF6FF"/>
        <path d="M15 65 L100 25 L185 65 L100 85 Z" fill="#67E8F9"/>
        <rect x="90" y="65" width="20" height="110" fill="#FFC6FF"/>
        <circle cx="60" cy="115" r="15" fill="#F472B6"/>
        <rect x="120" y="105" width="25" height="25" rx="5" fill="#FBBF24"/>
        <text x="100" y="160" font-family="'Nunito', sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#0F172A">2-3Y MILESTONE</text>
      </svg>`;

    case 'box-steam':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="25" y="65" width="150" height="110" rx="16" fill="#BDB2FF"/>
        <path d="M15 65 L100 25 L185 65 L100 85 Z" fill="#A78BFA"/>
        <rect x="90" y="65" width="20" height="110" fill="#FDE047"/>
        <polygon points="65,100 78,125 52,125" fill="#38BDF8"/>
        <circle cx="135" cy="115" r="14" fill="#4ADE80"/>
        <text x="100" y="160" font-family="'Nunito', sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#312E81">3-4Y STEAM</text>
      </svg>`;

    case 'box-school':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="25" y="65" width="150" height="110" rx="16" fill="#FFC6FF"/>
        <path d="M15 65 L100 25 L185 65 L100 85 Z" fill="#F472B6"/>
        <rect x="90" y="65" width="20" height="110" fill="#6EE7B7"/>
        <text x="65" y="125" font-family="sans-serif" font-size="22" font-weight="900" fill="#6366F1">A</text>
        <text x="135" y="125" font-family="sans-serif" font-size="22" font-weight="900" fill="#F59E0B">123</text>
        <text x="100" y="160" font-family="'Nunito', sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#4C1D95">4-5Y PRE-SCHOOL</text>
      </svg>`;

    case 'wooden-blocks':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="30" y="90" width="60" height="60" rx="10" fill="#D4A373"/>
        <rect x="110" y="90" width="60" height="60" rx="10" fill="#E6CCB2"/>
        <rect x="70" y="30" width="60" height="60" rx="10" fill="#CCD5AE"/>
        <text x="60" y="132" font-family="sans-serif" font-size="28" font-weight="bold" fill="#7F4F24" text-anchor="middle">A</text>
        <text x="140" y="132" font-family="sans-serif" font-size="28" font-weight="bold" fill="#936639" text-anchor="middle">B</text>
        <text x="100" y="72" font-family="sans-serif" font-size="28" font-weight="bold" fill="#588157" text-anchor="middle">C</text>
      </svg>`;

    case 'wooden-animals':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <circle cx="70" cy="110" r="35" fill="#DDA15E"/>
        <circle cx="55" cy="85" r="18" fill="#DDA15E"/>
        <ellipse cx="62" cy="70" rx="5" ry="12" fill="#BC6C25"/>
        <circle cx="50" cy="80" r="4" fill="#283618"/>
        <rect x="55" y="140" width="10" height="30" rx="4" fill="#BC6C25"/>
        <rect x="75" y="140" width="10" height="30" rx="4" fill="#BC6C25"/>
        <circle cx="135" cy="125" r="22" fill="#E9C46A"/>
        <circle cx="125" cy="105" r="12" fill="#E9C46A"/>
        <circle cx="120" cy="102" r="3" fill="#264653"/>
        <rect x="125" y="145" width="8" height="20" rx="3" fill="#F4A261"/>
        <rect x="140" y="145" width="8" height="20" rx="3" fill="#F4A261"/>
      </svg>`;

    case 'wooden-aeroplane':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <ellipse cx="100" cy="105" rx="75" ry="24" fill="#F4A261"/>
        <ellipse cx="100" cy="80" rx="20" ry="48" fill="#E76F51" transform="rotate(75 100 80)"/>
        <rect x="35" y="80" width="15" height="35" rx="5" fill="#2A9D8F"/>
        <circle cx="150" cy="105" r="12" fill="#E9C46A"/>
        <circle cx="70" cy="135" r="14" fill="#264653"/>
        <circle cx="70" cy="135" r="5" fill="#FFFFFF"/>
        <circle cx="125" cy="135" r="14" fill="#264653"/>
        <circle cx="125" cy="135" r="5" fill="#FFFFFF"/>
      </svg>`;

    case 'wooden-bullock-cart':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="60" y="70" width="100" height="50" rx="8" fill="#D4A373"/>
        <path d="M50 70 Q110 40 170 70" stroke="#8C531B" stroke-width="8" fill="none"/>
        <circle cx="75" cy="140" r="26" stroke="#8C531B" stroke-width="6" fill="#FAEDCD"/>
        <line x1="75" y1="114" x2="75" y2="166" stroke="#8C531B" stroke-width="3"/>
        <line x1="49" y1="140" x2="101" y2="140" stroke="#8C531B" stroke-width="3"/>
        <circle cx="145" cy="140" r="26" stroke="#8C531B" stroke-width="6" fill="#FAEDCD"/>
        <line x1="145" y1="114" x2="145" y2="166" stroke="#8C531B" stroke-width="3"/>
        <line x1="119" y1="140" x2="171" y2="140" stroke="#8C531B" stroke-width="3"/>
        <rect x="25" y="95" width="40" height="8" rx="3" fill="#8C531B"/>
      </svg>`;

    case 'wooden-elephant-puzzle':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="20" y="30" width="160" height="140" rx="14" fill="#FAEDCD"/>
        <path d="M40 130 C40 85 70 70 95 70 C105 70 120 75 130 85 C145 75 160 85 160 110 C160 135 140 145 125 145 Z" fill="#90E0EF"/>
        <path d="M45 110 C40 120 30 135 30 145 C30 150 40 150 45 135 Z" fill="#0077B6"/>
        <circle cx="135" cy="95" r="4" fill="#03045E"/>
        <circle cx="65" cy="105" r="10" fill="#48CAE4"/>
        <text x="65" y="110" font-family="sans-serif" font-size="10" font-weight="bold" fill="#03045E" text-anchor="middle">1</text>
        <circle cx="90" cy="95" r="10" fill="#48CAE4"/>
        <text x="90" y="100" font-family="sans-serif" font-size="10" font-weight="bold" fill="#03045E" text-anchor="middle">2</text>
        <circle cx="115" cy="95" r="10" fill="#48CAE4"/>
        <text x="115" y="100" font-family="sans-serif" font-size="10" font-weight="bold" fill="#03045E" text-anchor="middle">3</text>
      </svg>`;

    case 'montessori-cylinder':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="15" y="115" width="170" height="40" rx="8" fill="#D4A373"/>
        <ellipse cx="45" cy="115" rx="14" ry="5" fill="#8C531B"/>
        <ellipse cx="80" cy="115" rx="18" ry="6" fill="#8C531B"/>
        <ellipse cx="120" cy="115" rx="22" ry="7" fill="#8C531B"/>
        <ellipse cx="165" cy="115" rx="12" ry="4" fill="#8C531B"/>
        <rect x="33" y="65" width="24" height="50" rx="4" fill="#E63946"/>
        <circle cx="45" cy="60" r="5" fill="#936639"/>
        <rect x="64" y="50" width="32" height="65" rx="4" fill="#457B9D"/>
        <circle cx="80" cy="45" r="6" fill="#936639"/>
        <rect x="100" y="35" width="40" height="80" rx="5" fill="#2A9D8F"/>
        <circle cx="120" cy="30" r="7" fill="#936639"/>
      </svg>`;

    case 'sandpaper-letters':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="30" y="35" width="65" height="90" rx="8" fill="#F4A261"/>
        <text x="62" y="95" font-family="'Times New Roman', cursive, serif" font-size="52" font-style="italic" font-weight="bold" fill="#264653" text-anchor="middle">a</text>
        <rect x="105" y="65" width="65" height="90" rx="8" fill="#E76F51"/>
        <text x="137" y="125" font-family="'Times New Roman', cursive, serif" font-size="52" font-style="italic" font-weight="bold" fill="#F4F1DE" text-anchor="middle">m</text>
        <circle cx="50" cy="155" r="18" fill="#E9C46A" opacity="0.8"/>
      </svg>`;

    case 'magnetic-tiles':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <polygon points="100,25 155,100 45,100" fill="#FF5964" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="4"/>
        <polygon points="100,25 100,100 45,100" fill="#FF9EAA" fill-opacity="0.4"/>
        <rect x="45" y="100" width="55" height="55" fill="#35A7FF" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="4"/>
        <rect x="100" y="100" width="55" height="55" fill="#FFD166" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="4"/>
        <polygon points="155,100 185,155 155,155" fill="#06D6A0" fill-opacity="0.8" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="72" cy="127" r="8" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="127" cy="127" r="8" fill="#FFFFFF" opacity="0.6"/>
      </svg>`;

    case 'sensory-pop':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <path d="M100 30 C50 30 30 65 30 110 C30 155 60 170 100 170 C140 170 170 155 170 110 C170 65 150 30 100 30 Z" fill="#FFE5EC" stroke="#FFB3C6" stroke-width="6"/>
        <circle cx="75" cy="80" r="16" fill="#FF758F"/>
        <circle cx="125" cy="80" r="16" fill="#FF4D6D"/>
        <circle cx="60" cy="120" r="16" fill="#C9184A"/>
        <circle cx="100" cy="120" r="16" fill="#FF758F"/>
        <circle cx="140" cy="120" r="16" fill="#FFB3C6"/>
        <circle cx="100" cy="150" r="12" fill="#FF4D6D"/>
      </svg>`;

    case 'busy-board':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="25" y="30" width="150" height="140" rx="12" fill="#DDBEA9"/>
        <circle cx="65" cy="65" r="22" fill="#E76F51"/>
        <circle cx="65" cy="65" r="8" fill="#FFFFFF"/>
        <circle cx="105" cy="65" r="16" fill="#2A9D8F"/>
        <circle cx="105" cy="65" r="6" fill="#FFFFFF"/>
        <rect x="45" y="110" width="50" height="24" rx="6" fill="#3D5A80"/>
        <rect x="55" y="116" width="15" height="12" rx="3" fill="#EE6C4D"/>
        <circle cx="140" cy="122" r="15" fill="#E9C46A"/>
        <rect x="135" y="100" width="10" height="12" rx="2" fill="#995D3F"/>
      </svg>`;

    case 'cards-counters':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="35" y="40" width="60" height="70" rx="8" fill="#F8EDEB" stroke="#D4A373" stroke-width="3"/>
        <text x="65" y="90" font-family="sans-serif" font-size="36" font-weight="900" fill="#E63946" text-anchor="middle">5</text>
        <circle cx="130" cy="55" r="9" fill="#E63946"/>
        <circle cx="155" cy="55" r="9" fill="#E63946"/>
        <circle cx="130" cy="80" r="9" fill="#E63946"/>
        <circle cx="155" cy="80" r="9" fill="#E63946"/>
        <circle cx="142" cy="105" r="9" fill="#E63946"/>
        <rect x="35" y="125" width="130" height="35" rx="6" fill="#D4A373"/>
        <text x="100" y="148" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MONTESSORI MATH</text>
      </svg>`;

    case 'finger-paints':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <circle cx="60" cy="70" r="22" fill="#E63946"/>
        <circle cx="110" cy="60" r="20" fill="#457B9D"/>
        <circle cx="150" cy="85" r="24" fill="#F4A261"/>
        <circle cx="75" cy="120" r="25" fill="#2A9D8F"/>
        <circle cx="130" cy="130" r="22" fill="#E9C46A"/>
        <path d="M120 100 Q150 120 140 140 Q110 130 120 100" fill="#9D4EDD"/>
      </svg>`;

    case 'rattle-ball':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <circle cx="100" cy="100" r="65" fill="#FFF1E6" stroke="#F4A261" stroke-width="4"/>
        <path d="M50 100 A50 50 0 0 0 150 100 A50 50 0 0 1 50 100" fill="#FFB4A2"/>
        <path d="M100 50 A50 50 0 0 0 100 150 A50 50 0 0 1 100 50" fill="#B5E48C" opacity="0.6"/>
        <circle cx="100" cy="100" r="20" fill="#E5989B"/>
        <circle cx="100" cy="100" r="8" fill="#FFFFFF"/>
      </svg>`;

    case 'snap-circuit':
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="20" y="30" width="160" height="140" rx="14" fill="#1E293B"/>
        <line x1="45" y1="65" x2="155" y2="65" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
        <line x1="155" y1="65" x2="155" y2="135" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
        <line x1="155" y1="135" x2="45" y2="135" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
        <line x1="45" y1="135" x2="45" y2="65" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
        <rect x="70" y="50" width="60" height="30" rx="6" fill="#EF4444"/>
        <text x="100" y="70" font-family="sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">SWITCH</text>
        <circle cx="100" cy="135" r="18" fill="#FBBF24"/>
        <circle cx="100" cy="135" r="8" fill="#FFFFFF"/>
        <circle cx="45" cy="100" r="14" fill="#22C55E"/>
        <text x="45" y="104" font-family="sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle">BAT</text>
        <text x="100" y="112" font-family="sans-serif" font-size="10" font-weight="bold" fill="#94A3B8" text-anchor="middle">STEAM CIRCUIT</text>
      </svg>`;

    default:
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="toy-svg">
        <rect x="40" y="40" width="120" height="120" rx="20" fill="#E2E8F0"/>
        <circle cx="100" cy="100" r="35" fill="#CBD5E1"/>
        <circle cx="100" cy="100" r="18" fill="#94A3B8"/>
      </svg>`;
  }
}

// 5 Signature Pre-Curated Stage Boxes (Core Business Proposition from PDF)
export const CURATED_BOXES = [
  {
    id: 'box-stage-0',
    title: 'The Little Senses Box',
    tagline: 'Gentle stimulation, grasping & auditory bonding',
    ageRange: '0-1y',
    ageLabel: '0–1 Years',
    price: 5200,
    originalPrice: 8850,
    savings: 'LKR 3,650 (41% OFF)',
    rating: 4.9,
    reviewsCount: 38,
    category: 'curated-boxes',
    imageType: 'box-newborn',
    badge: 'Newborn Bestseller',
    description: 'Specially crafted for baby’s first year. Features soothing sensory textures, natural high-contrast wood, gentle auditory rattles, and safe mouthing materials designed to encourage visual tracking and early reach-and-grasp reflexes.',
    includes: [
      'Handmade Wooden Hen Rocker (Rs. 1,450 value)',
      'Owl Soft Auditory Rattle Ball (Rs. 1,850 value)',
      'High-Contrast Reversible Cot Bumper Book (Rs. 1,000 value)',
      'Sensory Textured Infant Ball (Rs. 4,650 value)',
      'Natural Soft Sensory Calm Brush (Rs. 1,500 value)',
      'Step-by-step Parent Milestone Play Guide (Free)'
    ],
    milestones: ['Visual tracking', 'Palmar grasp reflex', 'Auditory recognition', 'Tummy time neck strength'],
    inStock: true
  },
  {
    id: 'box-stage-1',
    title: 'The Wonder Explorer Box',
    tagline: 'Cause & effect, first stacking & spatial discovery',
    ageRange: '1-2y',
    ageLabel: '1–2 Years',
    price: 5800,
    originalPrice: 9450,
    savings: 'LKR 3,650 (39% OFF)',
    rating: 5.0,
    reviewsCount: 52,
    category: 'curated-boxes',
    imageType: 'box-toddler',
    badge: 'Popular for 1st Birthday',
    description: 'Designed for the curious toddler learning movement, gravity, and object permanence. Combines smooth Sri Lankan hand-carved wooden toys with sensory popping and threading challenges that develop bilateral hand coordination.',
    includes: [
      'Sri Lankan Natural Bullock Cart Toy (Rs. 2,100 value)',
      'Elephant 1-5 Counting Wood Puzzle (Rs. 1,050 value)',
      'Montessori Coin Box with Drop Slot (Rs. 2,250 value)',
      'Vibrant Threading Beads with Safety Cord (Rs. 3,250 value)',
      'Simple Dimple Sensory Silicone Toy (Rs. 1,300 value)',
      'Illustrated Toddler Development Roadmap (Free)'
    ],
    milestones: ['Pincer grasp', 'Object permanence', 'Bilateral coordination', 'Early sorting'],
    inStock: true
  },
  {
    id: 'box-stage-2',
    title: 'The Milestone Discoverer Box',
    tagline: 'Puzzle + Counting + Sorter + Fine-Motor + Book',
    ageRange: '2-3y',
    ageLabel: '2–3 Years',
    price: 6200,
    originalPrice: 10150,
    savings: 'LKR 3,950 (39% OFF)',
    rating: 4.9,
    reviewsCount: 67,
    category: 'curated-boxes',
    imageType: 'box-milestone',
    badge: 'E&J Recommended Formula',
    description: 'Directly structured following the research formula: Puzzle + Counting toy + Shape/colour sorter + Fine-motor activity + Art activity + Small learning book. Calibrated specifically for 2-3 year old independence and cognitive leaps.',
    includes: [
      'Wooden Elephant & Baby Jigsaw Puzzle (Rs. 900 value)',
      'Montessori Cards and Counters Math Set (Rs. 950 value)',
      'Handcrafted Sri Lankan Good Dinosaur Figurine (Rs. 2,100 value)',
      'FunShapes Wooden Stencils 10-Pack (Rs. 800 value)',
      '100% Pure Beeswax Ergonomic Crayons (Rs. 2,700 value)',
      'Three-Finger Ergonomic Handwriting Pencil Grip (Rs. 1,100 value)',
      'Curated Sri Lankan Bilingual Storybook (Free gift)'
    ],
    milestones: ['Counting 1-5', 'Colour categorization', 'Pre-writing tripod grip', 'Spatial problem solving'],
    inStock: true
  },
  {
    id: 'box-stage-3',
    title: 'The Little Maker STEAM Box',
    tagline: 'Magnetism, mechanics, color theory & logic',
    ageRange: '3-4y',
    ageLabel: '3–4 Years',
    price: 6500,
    originalPrice: 11200,
    savings: 'LKR 4,700 (42% OFF)',
    rating: 4.8,
    reviewsCount: 44,
    category: 'curated-boxes',
    imageType: 'box-steam',
    badge: 'STEAM Learning Award',
    description: 'Empowers children to build, test, create, and reason through tactile engineering. Combines magnetic vehicles, archaeological excavation, and non-toxic paint exploration to cultivate deep focus and perseverance.',
    includes: [
      'MagCar Two-Car Magnetic Coupling Set (Rs. 3,000 value)',
      'Counting & Math Calculation Toy (Rs. 4,200 value)',
      'Stegosaurus Dinosaur Fossil Excavation Kit (Rs. 2,700 value)',
      '6-Colour Non-Toxic Washable Finger Paint Kit (Rs. 2,700 value)',
      'Maze Escape Spatial Logic Puzzle (Rs. 5,250 value sample kit)',
      'Parent STEAM Activity & Prompt Guide (Free)'
    ],
    milestones: ['Spatial reasoning', 'Hypothesis testing', 'Color mixing', 'Hand-eye precision'],
    inStock: true
  },
  {
    id: 'box-stage-4',
    title: 'The School-Ready & Advanced STEAM Box',
    tagline: 'Phonics, numeracy 1-10, national heritage & focus',
    ageRange: '5y-plus',
    ageLabel: '5 Years and Above',
    price: 6900,
    originalPrice: 12450,
    savings: 'LKR 5,550 (44% OFF)',
    rating: 5.0,
    reviewsCount: 31,
    category: 'curated-boxes',
    imageType: 'box-school',
    badge: 'Kindergarten Readiness',
    description: 'Prepares your child for reading, writing, geography, and arithmetic using verified Montessori tactile methods. Includes authentic sandpaper letter textures and self-correcting wooden puzzles made right here in Sri Lanka.',
    includes: [
      'Sri Lankan Hand-Carved Alphabet Upper Case (Rs. 3,000 value)',
      'Sri Lanka National Flag Wooden Activity Game (Rs. 4,350 value)',
      'Montessori Numbers 1-10 Peg Math Board (Rs. 1,750 value)',
      'Coloured Animal Puzzle (Frog/Butterfly) (Rs. 1,250 value)',
      'Two-Finger Precision Handwriting Grip (Rs. 1,100 value)',
      'Montessori Practical Life Home Guide (Free)'
    ],
    milestones: ['Phonics tactile tracing', 'Base-10 math foundations', 'Cultural geography', 'Self-directed learning'],
    inStock: true
  }
];

// All Authentic Catalog Products from the 5-page Research Document
export const PRODUCTS = [
  {
    "id": "fiveplus-02",
    "title": "Life Cycle Toys Animal Figurines Teaching Aids Kids Montessori Toys Preschool Early Learning Educational Toys for Baby Toddlers",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "5y-plus",
    "ageLabel": "5+ Years",
    "ageRanges": [
      "5y-plus",
      "3-4y"
    ],
    "price": 1037.39,
    "originalPrice": 1350,
    "rating": 4.9,
    "reviewsCount": 42,
    "imageSrc": "assets/products/extracted_5_plus/img_2.jpg",
    "imageType": "wooden-blocks",
    "material": "High-Precision Hand-Painted Eco-PVC with Realistic Biological Textures",
    "madeIn": "STEM Certified",
    "inStock": true,
    "tag": "Biological Life Cycle Figurines",
    "description": "Comprehensive biological life cycle education set featuring realistic figurines and matching cards illustrating metamorphosis stages of frogs, monarch butterflies, ladybugs, and plant germination.",
    "milestones": [
      "Biological science & metamorphosis",
      "Chronological sequencing reasoning",
      "Detailed nature observation"
    ]
  },
  {
    "id": "fiveplus-05",
    "title": "Children 3D Puzzle Montessori Toys Rainbow Pebbles Logical Thinking Game Kids Painting Sensory Learning Toys",
    "category": "arts-fine-motor",
    "secondaryCategory": "steam-math",
    "ageRange": "5y-plus",
    "ageLabel": "5+ Years",
    "ageRanges": [
      "5y-plus",
      "3-4y"
    ],
    "price": 2126.65,
    "originalPrice": 2600,
    "rating": 5,
    "reviewsCount": 47,
    "imageSrc": "assets/products/extracted_5_plus/img_5.jpg",
    "imageType": "geometric-solids",
    "material": "Smooth Matte-Finish Sensory Resin Pebbles & Double-Sided Task Cards",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Rainbow Pebble Logic Game",
    "description": "Montessori rainbow pebbles tactile construction and logical thinking puzzle. Includes colorful smooth composite pebbles of varying sizes and graded challenge cards for building animals, geometric designs, and balancing sculptures.",
    "milestones": [
      "Tactile stone balancing physics",
      "2D-to-3D geometric translation",
      "Creative pattern replication"
    ]
  },
  {
    "id": "fiveplus-07",
    "title": "Toddlers Montessori Shape Sorting Toy Gifts Preschool Learning Fine Motor Skills Matching Game Educational Toys for Kids",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "5y-plus",
    "ageLabel": "5+ Years",
    "ageRanges": [
      "5y-plus",
      "3-4y"
    ],
    "price": 3667.92,
    "originalPrice": 4400,
    "rating": 4.9,
    "reviewsCount": 36,
    "imageSrc": "assets/products/extracted_5_plus/img_7.jpg",
    "imageType": "busy-board",
    "material": "Solid Hardwood Cottage with Tuned Metal Roof Xylophone & Gear Mechanism",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Wooden Cottage Activity Center",
    "description": "Multifunctional wooden cottage learning house featuring roof xylophone, rotating interlocking sun gears, geometric block sorters, sliding beads, and pull-along string to develop spatial cognition and acoustic awareness.",
    "milestones": [
      "Mechanical gear train principles",
      "Geometric shape classification",
      "Musical melody playback"
    ]
  },
  {
    "id": "fiveplus-17",
    "title": "School Teaching Educational Musical Instruments Set for Toddlers Kids Eco-Friendly Wooden Toy Set 17-Piece Percussion",
    "category": "montessori",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "5y-plus",
    "ageLabel": "5+ Years",
    "ageRanges": [
      "5y-plus",
      "3-4y"
    ],
    "price": 16829.22,
    "originalPrice": 19800,
    "rating": 5,
    "reviewsCount": 31,
    "imageSrc": "assets/products/extracted_5_plus/img_17.jpg",
    "imageType": "xylophone",
    "material": "Natural Sustainably Harvested Hardwood, Steel Triangles & Brass Jingle Cymbals",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Classroom 17-Piece Percussion Orchestra Set",
    "description": "Deluxe 17-piece professional classroom rhythm band set including steel triangles with strikers, wooden tambourine, hand castanets, wood sounder blocks, maracas, and tone resonators in a zippered carry case.",
    "milestones": [
      "Orchestral rhythm & pitch appreciation",
      "Ensemble social collaboration",
      "Acoustic frequency discrimination"
    ]
  },
  {
    "id": "preschool-29",
    "title": "Wooden Activity Cube Bead Maze Montessori Sensory Xylophone Gear Toy Multifunctional Learning Center Toddler Development",
    "category": "montessori",
    "secondaryCategory": "sensory",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "1-2y",
      "5y-plus"
    ],
    "price": 4188.61,
    "originalPrice": 5100,
    "rating": 4.9,
    "reviewsCount": 63,
    "imageSrc": "assets/products/extracted_2_3/img_29.jpg",
    "imageType": "busy-board",
    "material": "Heavy-Duty Hardwood Hexagonal Cube with Steel Bead Wires",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Deluxe 6-in-1 Hexagonal Activity Cube",
    "description": "Deluxe hexagonal wooden activity center with reversible dinosaur wire bead maze, 5-key xylophone, spinning floral gears, sliding abacus beads, peek-a-boo mirror, and wooden pull-along dinosaur cart.",
    "milestones": [
      "Complex sensory exploration",
      "Bimanual dexterity & musical rhythm",
      "Long-span focus & curiosity"
    ]
  },
  {
    "id": "preschool-28",
    "title": "Unisex DIY Educational Sorting Box Safe Training Learning Set for Kids 2-4 Years Multi-functional Wood Math Toys Fun Supplied",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 1724.06,
    "originalPrice": 2150,
    "rating": 4.8,
    "reviewsCount": 37,
    "imageSrc": "assets/products/extracted_2_3/img_28.jpg",
    "imageType": "busy-board",
    "material": "Solid Basswood Sorting Cube with Magnetic Fishing Rod & Slotted Lid",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Multi-Functional Sorting Chest",
    "description": "Versatile wooden learning box combining magnetic worm fishing game, shape sorting slots, colored stick drop, and coin-matching slots to provide comprehensive fine motor and sorting practice.",
    "milestones": [
      "Magnetic targeting precision",
      "Geometric shape slot alignment",
      "Color & length categorization"
    ]
  },
  {
    "id": "preschool-27",
    "title": "Small Early Education Hand-Eye Coordination Exercise Toy Color Classification Space Wood Material for Children EN71 Certified",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 1440,
    "originalPrice": 1800,
    "rating": 4.7,
    "reviewsCount": 22,
    "imageSrc": "assets/products/extracted_2_3/img_27.jpg",
    "imageType": "busy-board",
    "material": "EN71 Certified Sustainably Harvested Wood & Smooth Colored Rods",
    "madeIn": "EN71 Safety Certified",
    "inStock": true,
    "tag": "KerPlunk Ball Drop & Rod Game",
    "description": "Classic wooden stick-pulling tower game with color dice, wooden rods, and colored balls. Toddlers roll the dice, carefully pull matching colored sticks without letting the balls drop, mastering hand steadiness and patience.",
    "milestones": [
      "Fine motor finger steadiness",
      "Color dice rule-following & turn-taking",
      "Strategic cause-and-effect prediction"
    ]
  },
  {
    "id": "preschool-26",
    "title": "Multifunctional Wooden Educational Toys for Kids 2-4 Years Digital Color Cognition Parent-Child Math Learning Toys Juguetes",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 2206.5,
    "originalPrice": 2750,
    "rating": 4.9,
    "reviewsCount": 40,
    "imageSrc": "assets/products/extracted_2_3/img_26.jpg",
    "imageType": "busy-board",
    "material": "Triangular Solid Wood Prism with Smooth Rolling Cylinders",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Triangular 5-in-1 Activity Prism",
    "description": "Compact triangular prism wooden activity center with spinning fruit tiles, numbers 1-9 flip tiles, interlocking gear mechanism, winding bead track, and cute frog illustrations for 360-degree toddler learning.",
    "milestones": [
      "Rotational wrist & gear cause-and-effect",
      "Number & fruit matching",
      "Spatial multi-angle interaction"
    ]
  },
  {
    "id": "preschool-25",
    "title": "DIY Game Montessori Educational Sensory Toys",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 1697.89,
    "originalPrice": 2150,
    "rating": 4.8,
    "reviewsCount": 32,
    "imageSrc": "assets/products/extracted_2_3/img_25.jpg",
    "imageType": "busy-board",
    "material": "Coated Stainless Steel Wire Mazes & Solid Beechwood Base",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Animal Roller Coaster Bead Maze",
    "description": "Engaging multi-track roller coaster wooden bead maze with sliding animal characters (lion, panda, frog, fruits) and lower counting abacus bars to develop finger strength and visual tracking.",
    "milestones": [
      "Multi-plane 3D visual tracking",
      "Finger dexterity & bead guidance",
      "Early animal & fruit naming"
    ]
  },
  {
    "id": "preschool-24",
    "title": "Plastic Activity Playing Building Block Table Kids Plastic Table and Chair",
    "category": "montessori",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 8788.59,
    "originalPrice": 10500,
    "rating": 4.9,
    "reviewsCount": 58,
    "imageSrc": "assets/products/extracted_2_3/img_24.jpg",
    "imageType": "busy-board",
    "material": "Heavy-Duty Child-Safe Polypropylene (PP) Plastic",
    "madeIn": "Ergonomic Certified",
    "inStock": true,
    "tag": "Multi-Activity Table & Chair Set",
    "description": "Sturdy toddler activity table and chair set featuring double-sided tabletop (smooth writing surface on one side, building block baseplate on the other) with built-in storage compartment for toys, art supplies, and sand/water play.",
    "milestones": [
      "Ergonomic posture development",
      "Dedicated focus workstation",
      "Creative free-play independence"
    ]
  },
  {
    "id": "preschool-23",
    "title": "Montessori Children's Classic Abacus Rack Math Games Early Educational Colorful Pretend Play Calculating Tool Gift Wooden Toys",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 3365.85,
    "originalPrice": 4100,
    "rating": 4.8,
    "reviewsCount": 39,
    "imageSrc": "assets/products/extracted_2_3/img_23.jpg",
    "imageType": "cards-counters",
    "material": "Solid Pine Frame with Steel Wire Rods & Smooth Wood Beads",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Double-Sided 100-Bead Abacus",
    "description": "Montessori dual-sided counting abacus rack with 10 rows of 10 color-coded beads and number/fruit calculation flashcards (1-100). Helps toddlers visually conceptualize addition, subtraction, and group counting.",
    "milestones": [
      "1-to-1 counting correspondence",
      "Base-10 mathematical visualization",
      "Left-to-right scanning tracking"
    ]
  },
  {
    "id": "preschool-22",
    "title": "Wooden Toys Play Kits Montessori Early Education",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 2614.14,
    "originalPrice": 3200,
    "rating": 4.9,
    "reviewsCount": 34,
    "imageSrc": "assets/products/extracted_2_3/img_22.jpg",
    "imageType": "busy-board",
    "material": "High-Grade Birch Hardwood with Natural Clear Finish",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Montessori Toddler Play Kit",
    "description": "Classic Montessori early childhood apparatus set including ball tracker drop box, spinning drum, coin box with key drawer, and color-matched sorting drawers for core toddler developmental stages.",
    "milestones": [
      "Object permanence mastery",
      "Rotational arm & wrist tracking",
      "Fine motor slot-insertion"
    ]
  },
  {
    "id": "preschool-21",
    "title": "DIY 3D Kids Educational Building Game with Magnetic Stick Balls & Rods Kids Large Building Blocks Toys for Kids",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1346.34,
    "originalPrice": 1700,
    "rating": 4.9,
    "reviewsCount": 46,
    "imageSrc": "assets/products/extracted_2_3/img_21.jpg",
    "imageType": "geometric-solids",
    "material": "Non-Toxic ABS Plastic Shells & Permanent Neodymium Magnets",
    "madeIn": "STEM Certified",
    "inStock": true,
    "tag": "3D Magnetic Sticks & Balls",
    "description": "Large-format magnetic construction set with easy-to-grasp magnetic rods and steel balls. Toddlers safely snap magnetic connections together to build 2D shapes and 3D architectural structures.",
    "milestones": [
      "Magnetic attraction & polarity logic",
      "3D spatial construction",
      "Creative structural engineering"
    ]
  },
  {
    "id": "preschool-20",
    "title": "MIDEER Pixel Art Toy Kids Mushroom Peg Board Montessori Creative Mosaic Building Educational Activity Set Mideer",
    "category": "arts-fine-motor",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1667.97,
    "originalPrice": 2100,
    "rating": 4.9,
    "reviewsCount": 51,
    "imageSrc": "assets/products/extracted_2_3/img_20.jpg",
    "imageType": "busy-board",
    "material": "High-Grade ABS Plastic with Storage Drawer Box",
    "madeIn": "Mideer Original",
    "inStock": true,
    "tag": "Mideer Pixel Art Peg Board",
    "description": "Mideer pixel art mushroom peg board set with double-sided pattern cards (crab, snail, bee, turtle) and square color pegs. Toddlers match pegs to cards, building 3D mosaic art and finger coordination.",
    "milestones": [
      "Pixel art pattern reproduction",
      "Precise fingertip placement",
      "Spatial grid orientation"
    ]
  },
  {
    "id": "preschool-18",
    "title": "Factory Supply Customized Montessori Kids Toys Learning Activity Felt Board Tower Montessori Felt Busy Board for Toddlers",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1391.22,
    "originalPrice": 1750,
    "rating": 4.8,
    "reviewsCount": 30,
    "imageSrc": "assets/products/extracted_2_3/img_18.jpg",
    "imageType": "busy-board",
    "material": "Reinforced Eco-Friendly Felt Fabric with Secure Handbag Handles",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Foldable Pink Travel Busy Book",
    "description": "Portable multi-page pink felt activity book designed with life skills: shoelaces, belts, zippers, clock, counting fingers, and cartoon mermaid & bear dress-up accessories for on-the-go toddler development.",
    "milestones": [
      "Everyday self-help dressing skills",
      "Bilateral finger dexterity",
      "Quiet-time travel focus"
    ]
  },
  {
    "id": "preschool-17",
    "title": "Building Blocks Puzzle Wood Particles Assembly",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1963.41,
    "originalPrice": 2400,
    "rating": 4.8,
    "reviewsCount": 36,
    "imageSrc": "assets/products/extracted_2_3/img_17.jpg",
    "imageType": "wooden-blocks",
    "material": "Solid Basswood Standing Frame & Water-Painted Geometric Tiles",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Vertical Tetris Tangram Board",
    "description": "Easel-style vertical wooden Tetris and Russian block puzzle. Toddlers slide geometric colorful wooden blocks into the standing lion easel frame, learning spatial tessellation, gravity, and trial-and-error reasoning.",
    "milestones": [
      "Spatial tessellation & geometry",
      "Gravity & vertical stacking balance",
      "Problem-solving persistence"
    ]
  },
  {
    "id": "preschool-16",
    "title": "Children Wooden Baby",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 1815,
    "originalPrice": 2200,
    "rating": 4.7,
    "reviewsCount": 25,
    "imageSrc": "assets/products/extracted_2_3/img_16.jpg",
    "imageType": "wooden-blocks",
    "material": "Solid Natural Hardwood with Smooth Polished Edges",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Montessori Multi-Sensory Starter Set",
    "description": "Multi-piece early Montessori wooden sensory discovery set with geometric shape-fitting cylinders, stacking ring tower, wooden yo-yo, kaleidoscope lens, tangram puzzle, and flexible caterpillar.",
    "milestones": [
      "Multi-sensory tactile exploration",
      "Geometric diameter grading",
      "Rotational wrist control"
    ]
  },
  {
    "id": "preschool-15",
    "title": "Busy Board Solar Panel Projects Kids Pipe Cleaner Craft Flower Wood Building Kit Kids Solar Panel Science Kits Diy V8 Engine Kit",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 12315.29,
    "originalPrice": 14500,
    "rating": 5,
    "reviewsCount": 67,
    "imageSrc": "assets/products/extracted_2_3/img_15.jpg",
    "imageType": "busy-board",
    "material": "Solid Wood Driving Console with LED Lighting & Tactile Controls",
    "madeIn": "Premium Engineering",
    "inStock": true,
    "tag": "Dashboard Steering Activity Board",
    "description": "Deluxe wooden toddler dashboard simulator featuring rotatable steering wheel with horn, ignition key, gear shift stick, interactive speed gauges, side mirrors, and real working LED indicator lights.",
    "milestones": [
      "Simulated driving & spatial role-play",
      "Complex fine motor switch manipulation",
      "Cause-and-effect LED lighting logic"
    ]
  },
  {
    "id": "preschool-14",
    "title": "Children Educational Toys Other Baby Early Education Toy for Kids Baby Educational Learning Toy Building Block Puzzle",
    "category": "arts-fine-motor",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1544,
    "originalPrice": 1900,
    "rating": 4.8,
    "reviewsCount": 33,
    "imageSrc": "assets/products/extracted_2_3/img_14.jpg",
    "imageType": "cards-counters",
    "material": "Natural Beechwood Peg Board, Silicone Cups & Wooden Tool Set",
    "madeIn": "Educational Standard",
    "inStock": true,
    "tag": "Mosaic Bead Puzzle Board (Medium)",
    "description": "Montessori wooden peg board mosaic puzzle with pattern guide cards, wooden tweezers, spoon, and colorful beads. Children copy boat, bear, and butterfly patterns to hone spatial visualization.",
    "milestones": [
      "Pattern matching & spatial visualization",
      "Tripod grasp utensil training",
      "Color sorting & concentration"
    ]
  },
  {
    "id": "preschool-13",
    "title": "Wooden Baby Intellectual Development Toys Early Learning Educational Montessori Toys",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 2040,
    "originalPrice": 2500,
    "rating": 4.9,
    "reviewsCount": 45,
    "imageSrc": "assets/products/extracted_2_3/img_13.jpg",
    "imageType": "busy-board",
    "material": "Premium Multi-layer Beech Wood & Non-Toxic Colored Pigments",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Mega Intellectual Learning Center",
    "description": "Deluxe wooden early learning station combining 1-15 number calculation puzzle, geometric shape sorter, rainbow xylophone, lion bead maze, and penguin clock for deep intellectual discovery.",
    "milestones": [
      "Mathematical quantity comprehension",
      "Geometric shape discrimination",
      "Multi-step cognitive coordination"
    ]
  },
  {
    "id": "preschool-12",
    "title": "Montessori Cognitive Educational Toy Wood Egg Twist Machine Clip Bead Games for Kids Boys and Girls Aged 2 to 4 Years",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 1567.2,
    "originalPrice": 1950,
    "rating": 4.8,
    "reviewsCount": 28,
    "imageSrc": "assets/products/extracted_2_3/img_12.jpg",
    "imageType": "cards-counters",
    "material": "Natural Wood Base, Silicone Sorting Bowls, Wooden Spoon & Tweezers",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Math Clip Bead Operation Game",
    "description": "Montessori math and color matching bead operation game. Toddlers use wooden tweezers, chopsticks, and spoons to sort vibrant colored beads into silicone bowls and onto number operation cards.",
    "milestones": [
      "Pincer grasp & scissor-readiness grip",
      "Early math operations (+ - × ÷)",
      "Color sorting & pattern replication"
    ]
  },
  {
    "id": "preschool-11",
    "title": "Educational Wooden Toy Set for 2 to 4 Years Old Latest Combinations",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 4305.17,
    "originalPrice": 5200,
    "rating": 4.9,
    "reviewsCount": 39,
    "imageSrc": "assets/products/extracted_2_3/img_11.jpg",
    "imageType": "busy-board",
    "material": "Eco-Friendly Birch Plywood & Organic Beechwood with Parent Guide",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Curated Montessori Milestones Kit",
    "description": "Comprehensive toddler developmental kit featuring coin-drop object permanence box with drawer, wooden pull-car, tactile geometric puzzle, stacking cups, soft sensory book, and parent educational milestone guide.",
    "milestones": [
      "Object permanence reinforcement",
      "Geometric spatial sorting",
      "Sensory texture discrimination"
    ]
  },
  {
    "id": "preschool-10",
    "title": "Montessori Dinosaur Busy Board Toddlers 1-3 Felt Sensory Zipper Button Gear Clock Fine Motor Skills Toy Travel Educational DIY",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 3704.96,
    "originalPrice": 4450,
    "rating": 4.9,
    "reviewsCount": 48,
    "imageSrc": "assets/products/extracted_2_3/img_10.jpg",
    "imageType": "busy-board",
    "material": "High-Density Ultra-Soft Wool Felt with Reinforced Stitching",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Tiger Felt Life-Skills Board",
    "description": "Cute tiger-shaped portable felt busy board packed with real-life dressing skills: zippers, snap buttons, shoelace threading, belt buckles, turning gears, and analog clock hands for quiet travel and independent learning.",
    "milestones": [
      "Self-dressing life skills",
      "Fine motor finger manipulation",
      "Bilateral coordination & problem-solving"
    ]
  },
  {
    "id": "preschool-09",
    "title": "Wooden Fruit Stacking Toy Montessori Fruit Blocks Sorting Toy for Toddlers Kids 1 2 3 Year Old Fine Motor Skills",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 1296.74,
    "originalPrice": 1600,
    "rating": 4.8,
    "reviewsCount": 37,
    "imageSrc": "assets/products/extracted_2_3/img_9.jpg",
    "imageType": "wooden-blocks",
    "material": "Solid New Zealand Pine Base & Painted Hardwood Fruit Beads",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Vertical Fruit Stacking Abacus",
    "description": "Montessori vertical peg fruit stacking board featuring watermelons, apples, grapes, and pineapples. Children sort, count, and stack fruit segments on wooden rods to develop vertical spatial awareness and balance control.",
    "milestones": [
      "Vertical peg alignment",
      "Fruit & color categorization",
      "Fine motor fingertip pinch"
    ]
  },
  {
    "id": "preschool-08",
    "title": "Animals Train Locks & Keys Matching Toys Counting & Sorting Trains Set Animal Montessori Learning Toys",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 3001.02,
    "originalPrice": 3600,
    "rating": 4.9,
    "reviewsCount": 53,
    "imageSrc": "assets/products/extracted_2_3/img_8.jpg",
    "imageType": "wooden-train",
    "material": "Durable Impact-Resistant ABS Polymer with Smooth Round Edges",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Lock & Key Animal Train",
    "description": "Colorful 10-car number train set with lock-and-key matching carriages and cute animal finger puppets. Children unlock the numbered train cars with corresponding keys to reveal animal passengers.",
    "milestones": [
      "Wrist rotation & lock-key coordination",
      "Number & dot correspondence (1-10)",
      "Imaginative storytelling & role play"
    ]
  },
  {
    "id": "preschool-07",
    "title": "Custom Food Grade Silicone Teether Montessori Suction Cup Teething Toys Sensory Chew Toy for Early Education",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 1100.38,
    "originalPrice": 1400,
    "rating": 4.8,
    "reviewsCount": 26,
    "imageSrc": "assets/products/extracted_2_3/img_7.jpg",
    "imageType": "sensory-tissue",
    "material": "100% Food-Grade High-Tension Silicone with Industrial Suction Bases",
    "madeIn": "BPA-Free Certified",
    "inStock": true,
    "tag": "Suction Sensory Building Links",
    "description": "Flexible suction-cup sensory links that stick securely to windows, high chairs, bathtubs, and smooth surfaces. Toddlers bend, connect, pull, and pop these tactile rings to exercise finger and wrist tension.",
    "milestones": [
      "Bilateral hand strength & resistance",
      "Cause-and-effect suction popping",
      "Sensory oral-tactile exploration"
    ]
  },
  {
    "id": "preschool-06",
    "title": "Zhiqu Montessori Puzzle Toys for 1-3 Age Kids Learning Color & Number Fine Motor Skills Musical Sensory Experiments Boys Girls",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 1059.62,
    "originalPrice": 1350,
    "rating": 4.7,
    "reviewsCount": 44,
    "imageSrc": "assets/products/extracted_2_3/img_6.jpg",
    "imageType": "busy-board",
    "material": "BPA-Free Food Grade ABS Plastic with Smooth Beveled Edges",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Hedgehog Fine Motor Peg Toy",
    "description": "Zhiqu fine motor sensory hedgehog featuring numbered and colored removable quills. Toddlers build finger strength, pincer grasp control, color classification, and basic counting while inserting and removing the colorful quills.",
    "milestones": [
      "Pincer grip strength",
      "Color & number pairing",
      "Internal quill storage habit"
    ]
  },
  {
    "id": "preschool-05",
    "title": "Montessori Early Education Wooden Baby Intellectual Development Toys Children's Wooden Toy for Boys Girls",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "1-2y",
      "5y-plus"
    ],
    "price": 2108.13,
    "originalPrice": 2550,
    "rating": 4.8,
    "reviewsCount": 31,
    "imageSrc": "assets/products/extracted_2_3/img_5.jpg",
    "imageType": "busy-board",
    "material": "Polished Solid Rubberwood & Water-Based Non-Toxic Paint",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Early Learning Essentials Set",
    "description": "All-in-one Montessori early education intellectual toy set with penguin teaching clock, 8-key wooden xylophone, stacking rainbow rings, lacing caterpillar, and hand-bell rattle for comprehensive toddler developmental play.",
    "milestones": [
      "Time & sequence understanding",
      "Bead threading dexterity",
      "Auditory-visual integration"
    ]
  },
  {
    "id": "preschool-04",
    "title": "Toddlers Montessori Wooden Educational Toys for Baby Boys Girls Age 2 3 4 Year Old",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "3-4y"
    ],
    "price": 2334.13,
    "originalPrice": 2800,
    "rating": 4.9,
    "reviewsCount": 35,
    "imageSrc": "assets/products/extracted_2_3/img_4.jpg",
    "imageType": "busy-board",
    "material": "Solid Natural Pine Wood with Magnetic Bunny Harvester",
    "madeIn": "Educational Standard",
    "inStock": true,
    "tag": "Farm Harvest & Shape Sorter",
    "description": "Multifunctional wooden farm harvest box featuring magnetic bunny worm-catching game, fruit shape sorting sides, and pull-out root vegetables to develop precision pincer grasp and classification skills.",
    "milestones": [
      "Magnetic hand-eye coordination",
      "Fruit shape & color matching",
      "Logical size grading"
    ]
  },
  {
    "id": "preschool-03",
    "title": "Kid Wooden Musical Instrument Set Tambourine Xylophone Toys Early Learning Montessori Baby Musical Toys for Toddlers",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 2148.88,
    "originalPrice": 2600,
    "rating": 4.8,
    "reviewsCount": 29,
    "imageSrc": "assets/products/extracted_2_3/img_3.jpg",
    "imageType": "xylophone",
    "material": "Natural Smooth Beechwood & Tuned Metal Chime Bars",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Montessori Musical Band Set",
    "description": "Natural wooden percussion and rhythm instrument set including tuned 8-key rainbow xylophone, wooden tambourine, maracas, castanet, and rhythm sticks to cultivate pitch perception and auditory coordination.",
    "milestones": [
      "Auditory frequency discrimination",
      "Bimanual rhythm coordination",
      "Creative musical expression"
    ]
  },
  {
    "id": "preschool-02",
    "title": "Joycat Education Toys Early Education Baby Toy Box Simulation Sensory Fine Motor Skills Visual Exercise Spatial Cognition Toys",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "2-3y",
    "ageLabel": "2–3 Years",
    "ageRanges": [
      "2-3y",
      "1-2y"
    ],
    "price": 4890.55,
    "originalPrice": 5800,
    "rating": 4.9,
    "reviewsCount": 42,
    "imageSrc": "assets/products/extracted_2_3/img_2.jpg",
    "imageType": "sensory-tissue",
    "material": "Ultra-Soft Plush Cotton & High-Elastic Sponge Fill",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Sensory Tissue & Box Play",
    "description": "Joycat 'What's Inside?' simulation sensory activity cube. Packed with plush animals, crinkle wings, squeaky sounds, and textured peek-a-boo accessories designed to develop spatial cognition and fine motor pulling grip.",
    "milestones": [
      "Spatial cognition & depth perception",
      "Tactile sensory discrimination",
      "Object retrieval & curiosity"
    ]
  },
  {
    "id": "preschool-01",
    "title": "Dm-5 Large-Sized Early Educational Water Colorful Writing Creative Graffiti Canvas Drawing Toys Children'S Painting Doodle Mat",
    "category": "arts-fine-motor",
    "secondaryCategory": "sensory",
    "ageRange": "2-3y",
    "ageLabel": "2–5+ Years",
    "ageRanges": [
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 2475,
    "originalPrice": 2950,
    "rating": 4.9,
    "reviewsCount": 38,
    "imageSrc": "assets/products/extracted_2_3/img_1.jpg",
    "imageType": "busy-board",
    "material": "Mess-free Hydro-Chromatic Fabric & Non-Toxic Water Magic Pens",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Water Magic Doodle Mat",
    "description": "Large-sized reusable water drawing doodle mat for toddlers. Simply fill the magic pens with clean water to reveal vibrant rainbow colors, letters, and shapes—dries and fades cleanly in 5–10 minutes for endless creative expression without stains.",
    "milestones": [
      "Fine motor grip & pencil control",
      "Color & alphabet recognition",
      "Mess-free creative imagination"
    ]
  },
  {
    "id": "toddler-29",
    "title": "Baby Busy Board Train Montessori Sensory Toy Toddler Busy Board Montessori Toys for Toddler",
    "category": "sensory",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 3093.65,
    "originalPrice": 3750,
    "rating": 4.9,
    "reviewsCount": 46,
    "imageSrc": "assets/products/extracted_1_2/img_29.jpg",
    "imageType": "wooden-train",
    "material": "Smooth Non-toxic ABS & Beechwood Rolling Carriage Connectors",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Busy Board Train",
    "description": "Push-along sensory busy board train featuring rotating gears, animal shape sorters, spinning flower, and bead rollers for active crawling and walking toddlers.",
    "milestones": [
      "Crawling & walking push motion",
      "Cause-and-effect gear spins",
      "Shape fitting"
    ]
  },
  {
    "id": "toddler-28",
    "title": "Multiple Hand Exercises Vibrant Color Matching Busy Board for Children",
    "category": "montessori",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 2180,
    "originalPrice": 2700,
    "rating": 4.8,
    "reviewsCount": 34,
    "imageSrc": "assets/products/extracted_1_2/img_28.jpg",
    "imageType": "busy-board",
    "material": "Natural Polish Wood Base with Rotating Color Plugs",
    "madeIn": "Montessori Standard",
    "inStock": true,
    "tag": "Hand Exercise Busy Board",
    "description": "Vibrant color matching and twisting hand-exercise board designed to enhance finger dexterity, wrist rotation, and color pattern association.",
    "milestones": [
      "Hand & finger strength",
      "Color classification",
      "Rotational motor skills"
    ]
  },
  {
    "id": "toddler-27",
    "title": "6 in 1 Montessori Toy Set for Toddlers 1-3, Infant Teething Babies Toy Stacking Blocks Rings Pull String Toy Sorter Sensory Bin",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "0-1y",
      "2-3y"
    ],
    "price": 3890.21,
    "originalPrice": 4650,
    "rating": 4.9,
    "reviewsCount": 63,
    "imageSrc": "assets/products/extracted_1_2/img_27.jpg",
    "imageType": "sensory-pop",
    "material": "Food-Grade Silicone, BPA-Free Textured Teethers & Elastic Cord Bin",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "6-in-1 Sensory Set",
    "description": "All-in-one toddler sensory development set with textured soft squeeze blocks, teething rings, sensory bin with elastic bands, and multi-texture pull-string UFO.",
    "milestones": [
      "Elastic boundary exploration",
      "Tactile texture differentiation",
      "Pull-string motor grip"
    ]
  },
  {
    "id": "toddler-26",
    "title": "6 in 1 Montessori Wooden Activity Cube Educational Toys for Toddlers 1 to 3 Years Old Play for Boys and Girls",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 3705,
    "originalPrice": 4500,
    "rating": 4.9,
    "reviewsCount": 49,
    "imageSrc": "assets/products/extracted_1_2/img_26.jpg",
    "imageType": "busy-board",
    "material": "Natural Hardwood Cube with Non-toxic Water-based Paint",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "6-in-1 Wooden Cube",
    "description": "Solid wooden 6-in-1 activity cube featuring top bead maze, abacus, rotating alphabet number tiles, clock, shape sorter, and sliding animal maze.",
    "milestones": [
      "Multi-dimensional problem solving",
      "Clock & number logic",
      "Spatial shape sorting"
    ]
  },
  {
    "id": "toddler-25",
    "title": "Wooden Baby Walker with Wheels and Activity Center Montessori Walking Toy for 1 Year Olds 20KG Load Capacity",
    "category": "wooden-local",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 10373.89,
    "originalPrice": 12500,
    "rating": 5,
    "reviewsCount": 27,
    "imageSrc": "assets/products/extracted_1_2/img_25.jpg",
    "imageType": "wooden-walker",
    "material": "Heavy-Duty Solid Wood Construction with Silent Rubber Wheels",
    "madeIn": "Premium Handcrafted",
    "inStock": true,
    "tag": "Heavy-Duty Wooden Bus Walker",
    "description": "High-capacity 20KG load wooden bus baby walker with speed-controlled wheels, internal toy storage trunk, and side bead activity center for steady walking guidance.",
    "milestones": [
      "Supported independent steps",
      "Trunk storage organization",
      "Confidence & posture"
    ]
  },
  {
    "id": "toddler-24",
    "title": "Soft Silicone Geometric Rotating Toy - 360-degree Rotating Pop-up Leisure and Educational for Babies Aged 0-2 Years Old",
    "category": "sensory",
    "secondaryCategory": "newborn",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "0-1y"
    ],
    "price": 2200.75,
    "originalPrice": 2750,
    "rating": 4.8,
    "reviewsCount": 37,
    "imageSrc": "assets/products/extracted_1_2/img_24.jpg",
    "imageType": "sensory-pop",
    "material": "100% Food-Grade BPA-Free Soft Silicone",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Silicone Sensory Twist",
    "description": "BPA-free food-grade silicone geometric sensory rotating toy with 360-degree pop-up textures to soothe teething gums and strengthen bilateral hand twisting grip.",
    "milestones": [
      "Grip strength",
      "Bilateral wrist rotation",
      "Oral sensory soothing"
    ]
  },
  {
    "id": "toddler-23",
    "title": "54-in-1 Montessori Busy Board English Spanish Sensory Toy Travel Outdoor Gift for 1+ Year Old Toddler",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 3701.26,
    "originalPrice": 4400,
    "rating": 5,
    "reviewsCount": 58,
    "imageSrc": "assets/products/extracted_1_2/img_23.jpg",
    "imageType": "busy-board",
    "material": "High-Density Soft Felt Fabric with Secure Double-Stitched Fixtures",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "54-in-1 Travel Busy Bag",
    "description": "Deluxe 54-in-1 sensory busy board travel suitcase featuring bilingual English/Spanish alphabet cards, gears, clocks, buckles, and velcro shapes for travel entertainment.",
    "milestones": [
      "Bilingual recognition",
      "Fine motor coordination",
      "Sensory tactile mastery"
    ]
  },
  {
    "id": "toddler-22",
    "title": "Wooden Kids Games Early Learning Baby Toys 1-3 Years Color Recognition Shape Matching Coin Toys",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1645,
    "originalPrice": 2100,
    "rating": 4.9,
    "reviewsCount": 41,
    "imageSrc": "assets/products/extracted_1_2/img_22.jpg",
    "imageType": "wooden-blocks",
    "material": "Solid Rubberwood with Water-based Color Lacquer",
    "madeIn": "Montessori Standard",
    "inStock": true,
    "tag": "Coin Box & Shape Sorter",
    "description": "Montessori wooden color recognition shape matching drawer and coin insertion toy, promoting object permanence, pincer grasp, and color classification.",
    "milestones": [
      "Wrist rotation",
      "Slot alignment precision",
      "Object permanence"
    ]
  },
  {
    "id": "toddler-21",
    "title": "Oem Rts Baby Multifunction Low Prices 1st Walking Toys Factory Walker with Wheels ( pink and blue )",
    "category": "sensory",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y"
    ],
    "price": 3149.22,
    "originalPrice": 3800,
    "rating": 4.7,
    "reviewsCount": 25,
    "imageSrc": "assets/products/extracted_1_2/img_21.jpg",
    "imageType": "wooden-walker",
    "material": "Reinforced BPA-Free PP Plastic with 360-Degree Swivel Wheels",
    "madeIn": "Safety Tested",
    "inStock": true,
    "tag": "First Steps Walker",
    "description": "Lightweight multi-function baby walker with sturdy base, interactive activity play tray, and smooth caster wheels designed for supported upright walking practice.",
    "milestones": [
      "Upright balance",
      "Leg muscle strengthening",
      "Directional steering"
    ]
  },
  {
    "id": "toddler-20",
    "title": "Cognitive Education Learning Toy Preschool Early Learning Educational Toys for Children Toddlers Wooden Montessori Toys DF12266",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 4812.75,
    "originalPrice": 5700,
    "rating": 5,
    "reviewsCount": 36,
    "imageSrc": "assets/products/extracted_1_2/img_20.jpg",
    "imageType": "wooden-blocks",
    "material": "Solid Natural Hardwood with Eco-Friendly Stain & Carrying Case",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Cognitive Learning Kit",
    "description": "Montessori wooden cognitive learning gift kit with wooden case, ring stacker, color classification cylinders, cards, and object permanence drawer.",
    "milestones": [
      "Object permanence",
      "Size & color grading",
      "Order and concentration"
    ]
  },
  {
    "id": "toddler-19",
    "title": "Doodle Mini Magnetic Board Stand Drawing Toys Dry Erase Books Children Easel Magic Foldable Hot Sale Kids Painting Writing White",
    "category": "arts-fine-motor",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 5372.2,
    "originalPrice": 6400,
    "rating": 4.9,
    "reviewsCount": 28,
    "imageSrc": "assets/products/extracted_1_2/img_19.jpg",
    "imageType": "busy-board",
    "material": "Non-toxic ABS & Magnetic Whiteboard Surface",
    "madeIn": "Certified Safe",
    "inStock": true,
    "tag": "Foldable Doodle Easel",
    "description": "Foldable mini standing double-sided magnetic easel and whiteboard for toddler mark-making, dry-erase doodle drawing, and magnet shape play without mess.",
    "milestones": [
      "Pre-writing grip",
      "Creative expression",
      "Hand dominance development"
    ]
  },
  {
    "id": "toddler-18",
    "title": "Portable Felt Montessori Sensory Activity Board Toddler Learning Educational Toy Travel Quiet Book Preschool Skill Training",
    "category": "montessori",
    "secondaryCategory": "sensory",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 3330.76,
    "originalPrice": 3950,
    "rating": 4.9,
    "reviewsCount": 64,
    "imageSrc": "assets/products/extracted_1_2/img_18.jpg",
    "imageType": "busy-board",
    "material": "Soft Flexible Wool Felt with Reinforced Snaps & Zippers",
    "madeIn": "Montessori Standard",
    "inStock": true,
    "tag": "Felt Travel Board",
    "description": "Foldable lightweight felt Montessori busy board handbag with real zippers, shoelaces, buckles, clock hands, and button clasps to foster practical life skills and self-dressing mastery.",
    "milestones": [
      "Self-dressing life skills",
      "Pincer pinch and pull",
      "Quiet travel concentration"
    ]
  },
  {
    "id": "toddler-17",
    "title": "Six-Sided Plastic Busy House Multifunctional Infant Toy Gift 0-2 Year Olds Fine MotorEarly Education Toy",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "0-1y"
    ],
    "price": 4834.98,
    "originalPrice": 5600,
    "rating": 4.8,
    "reviewsCount": 47,
    "imageSrc": "assets/products/extracted_1_2/img_17.jpg",
    "imageType": "busy-board",
    "material": "Eco-friendly ABS Plastic with Rounded Anti-Drop Corners",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "6-Sided Busy House",
    "description": "6-sided multi-activity discovery house equipped with rotating gears, musical piano, door key, shape sorter, and steering wheel for rich fine-motor engagement.",
    "milestones": [
      "Fine motor dexterity",
      "Multi-mechanism discovery",
      "Sensory problem solving"
    ]
  },
  {
    "id": "toddler-16",
    "title": "Wooden Frame Baby Walkers Lightweight Learning Multi-Functional Toys for Kids Boys Girls",
    "category": "wooden-local",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 6554,
    "originalPrice": 7800,
    "rating": 4.9,
    "reviewsCount": 33,
    "imageSrc": "assets/products/extracted_1_2/img_16.jpg",
    "imageType": "wooden-walker",
    "material": "Sturdy Natural Wood Frame, Water-based Paint & Rubber Ring Wheels",
    "madeIn": "Handcrafted Quality",
    "inStock": true,
    "tag": "Activity Walker Center",
    "description": "Sturdy natural wood frame push walker featuring a front activity center with shape sorters, musical xylophone, bead maze, and non-slip rubberized wheels for confident first steps.",
    "milestones": [
      "Independent walking confidence",
      "Multifaceted sensory exploration",
      "Spatial awareness"
    ]
  },
  {
    "id": "toddler-15",
    "title": "Wooden Baby Walker Geometric Building Blocks Mini Supermarket Shopping Cart Toys",
    "category": "wooden-local",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 4075.46,
    "originalPrice": 4950,
    "rating": 4.8,
    "reviewsCount": 39,
    "imageSrc": "assets/products/extracted_1_2/img_15.jpg",
    "imageType": "wooden-walker",
    "material": "Natural Beechwood with Rubber Trimmed Silent Wheels",
    "madeIn": "Safety Tested",
    "inStock": true,
    "tag": "Walker & Cart",
    "description": "2-in-1 push-along wooden baby walker and mini supermarket shopping cart loaded with geometric blocks for early walking balance, imaginative roleplay, and block construction.",
    "milestones": [
      "Gross motor walking stability",
      "Imaginative pretend play",
      "Weight balance"
    ]
  },
  {
    "id": "toddler-14",
    "title": "Interactive Toddler Sound Book 108 Words Talking Learning Toy Electronic Educational Audio ABC Book for Kids Early Education",
    "category": "language",
    "secondaryCategory": "sensory",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 5631.54,
    "originalPrice": 6500,
    "rating": 4.9,
    "reviewsCount": 51,
    "imageSrc": "assets/products/extracted_1_2/img_14.jpg",
    "imageType": "language-sandpaper",
    "material": "Durable Waterproof Laminated Board with Electronic Sound Module",
    "madeIn": "CE/CPC Certified",
    "inStock": true,
    "tag": "Talking 108 Words Book",
    "description": "Talking electronic audio word book with 108 everyday vocabulary words, sound buttons, phonics, and clear pronunciation to accelerate toddler speech and bilingual cognitive development.",
    "milestones": [
      "Early speech development",
      "Vocabulary acquisition",
      "Auditory-visual association"
    ]
  },
  {
    "id": "toddler-13",
    "title": "Animal Cause and Effect Sensory Toy Musical Pop-up Light Game for Baby Twist Press Hide and Seek Toy",
    "category": "sensory",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1800,
    "originalPrice": 2250,
    "rating": 4.8,
    "reviewsCount": 42,
    "imageSrc": "assets/products/extracted_1_2/img_13.jpg",
    "imageType": "sensory-pop",
    "material": "Smooth Shatterproof ABS with Gentle Melody Audio",
    "madeIn": "Certified Child-Safe",
    "inStock": true,
    "tag": "Pop-Up Cause & Effect",
    "description": "Pop-up hide-and-seek interactive sensory game featuring twist, slide, switch, and press mechanisms that reward toddler fine motor action with cute animal reveal and lights.",
    "milestones": [
      "Twist & press motor actions",
      "Object permanence reward",
      "Auditory cues"
    ]
  },
  {
    "id": "toddler-12",
    "title": "Wooden Activity Table Bead Maze Counting Roller Clock Gear Fine Motor Early Math Learning Toddler Toys for Children",
    "category": "wooden-local",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 5560.81,
    "originalPrice": 6800,
    "rating": 4.9,
    "reviewsCount": 35,
    "imageSrc": "assets/products/extracted_1_2/img_12.jpg",
    "imageType": "busy-board",
    "material": "Solid Wood Legs & Engineered Eco-MDF Activity Surface",
    "madeIn": "Safety Tested",
    "inStock": true,
    "tag": "Multi-Activity Table",
    "description": "All-in-one standing wooden activity play table with bead maze wire tracks, counting roller, clock, and interlocking gears for standing balance and multi-sensory discovery.",
    "milestones": [
      "Supported standing balance",
      "Bimanual coordination",
      "Gear cause-and-effect"
    ]
  },
  {
    "id": "toddler-11",
    "title": "Busy Board Montessori Educational Toys Led Light Switch Diy Wooden Hands-on Screw Nut Early Educational Toys",
    "category": "montessori",
    "secondaryCategory": "sensory",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3630.87,
    "originalPrice": 4300,
    "rating": 5,
    "reviewsCount": 68,
    "imageSrc": "assets/products/extracted_1_2/img_11.jpg",
    "imageType": "busy-board",
    "material": "Natural Solid Wood, LED Light Components & Metal Switch Hardware",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "LED Busy Board",
    "description": "Interactive wooden sensory busy board featuring multi-colored LED push buttons, toggle switches, key lock, and screw nut mechanics to satisfy toddler curiosity and cause-and-effect understanding.",
    "milestones": [
      "Cause and effect",
      "Finger strength & dexterity",
      "Practical life mechanics"
    ]
  },
  {
    "id": "toddler-10",
    "title": "Wooden Number Counting Board Bead Sorting Spoon Tweezers Fine Motor Early Math Toddler Preschool Toys for Children",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1207.82,
    "originalPrice": 1650,
    "rating": 4.9,
    "reviewsCount": 57,
    "imageSrc": "assets/products/extracted_1_2/img_10.jpg",
    "imageType": "cards-counters",
    "material": "Basswood Pegboard, Food-Grade Silicone Bowls & Wood Tweezers",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Tweezer & Bead Math",
    "description": "Montessori wooden counting board with rainbow silicone sorting cups, wooden beads, spoon, and tweezers designed for pincer grasp training and math logic.",
    "milestones": [
      "Tweezer pincer grip",
      "Color classification",
      "Mathematical grouping"
    ]
  },
  {
    "id": "toddler-09",
    "title": "Bead Maze Activity",
    "category": "arts-fine-motor",
    "secondaryCategory": "sensory",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 3900,
    "originalPrice": 4500,
    "rating": 4.8,
    "reviewsCount": 29,
    "imageSrc": "assets/products/extracted_1_2/img_9.jpg",
    "imageType": "busy-board",
    "material": "Solid Wood Base with Smooth Plastic-Coated Wire Tracks",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Fine Motor Track",
    "description": "Classic wooden bead maze activity center featuring multi-track looping wires, colorful fruit and sphere beads, and counting beads on a solid wood base.",
    "milestones": [
      "3D tracking coordination",
      "Wrist articulation",
      "Problem solving"
    ]
  },
  {
    "id": "toddler-08",
    "title": "Abacus – 10 Grade – Wooden Toys",
    "category": "steam-math",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3600,
    "originalPrice": 4200,
    "rating": 4.9,
    "reviewsCount": 44,
    "imageSrc": "assets/products/extracted_1_2/img_8.jpg",
    "imageType": "cards-counters",
    "material": "Natural Pine Wood Frame & Polished Wooden Counting Beads",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "Classic Abacus",
    "description": "10-row colorful wooden abacus calculator with smooth slide beads for tactile counting, addition practice, and color grading exploration.",
    "milestones": [
      "Number visualization",
      "Sliding fine motor grip",
      "Tactile math logic"
    ]
  },
  {
    "id": "toddler-07",
    "title": "8 Pcs Geometry Shape Learning Blocks",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 8250,
    "originalPrice": 9500,
    "rating": 5,
    "reviewsCount": 19,
    "imageSrc": "assets/products/extracted_1_2/img_7.jpg",
    "imageType": "wooden-blocks",
    "material": "Premium Hardwood with Certified Organic Vegetable Dyes",
    "madeIn": "Handcrafted Premium",
    "inStock": true,
    "tag": "Geometric Sorting",
    "description": "Premium 8-piece solid wooden geometric shape learning blocks set with stacking column boards for sorting, height comparison, and spatial geometry.",
    "milestones": [
      "Spatial reasoning",
      "Shape differentiation",
      "Constructive stacking"
    ]
  },
  {
    "id": "toddler-06",
    "title": "Preschool Math Learning Stick Counting Toy Wooden Number Peg Board for Kids Z12174E",
    "category": "steam-math",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1852.48,
    "originalPrice": 2300,
    "rating": 4.8,
    "reviewsCount": 31,
    "imageSrc": "assets/products/extracted_1_2/img_6.jpg",
    "imageType": "cards-counters",
    "material": "Solid Wood Board with Colored Counting Rods",
    "madeIn": "Educational Standard",
    "inStock": true,
    "tag": "Early Math Counting",
    "description": "Wooden number peg board with counting sticks and mathematical operation symbols, encouraging hands-on quantity visualization and early numeracy.",
    "milestones": [
      "Counting fundamentals",
      "Quantity perception",
      "Fine motor manipulation"
    ]
  },
  {
    "id": "toddler-05",
    "title": "7pcs/set Fun Montessori Educational Toys for Kids 1-2 Years Old Early Intellectual Development Wooden Music Hand Knock Toys",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1600,
    "originalPrice": 2100,
    "rating": 4.9,
    "reviewsCount": 52,
    "imageSrc": "assets/products/extracted_1_2/img_5.jpg",
    "imageType": "busy-board",
    "material": "Sustainably Sourced Beechwood with Smooth Rounded Corners",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "7-in-1 Value Set",
    "description": "Comprehensive 7-piece Montessori early intellectual development wooden toy set with rainbow xylophone, clock, shape puzzle, and hand-knock rhythm instruments.",
    "milestones": [
      "Sensory exploration",
      "Hand-eye coordination",
      "Intellectual discovery"
    ]
  },
  {
    "id": "toddler-04",
    "title": "Montessori Wooden Color & Number Matching Board Educational Toy for Kids Preschool Learning Teaching Aid Z12070F",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1796.91,
    "originalPrice": 2200,
    "rating": 4.9,
    "reviewsCount": 45,
    "imageSrc": "assets/products/extracted_1_2/img_4.jpg",
    "imageType": "cards-counters",
    "material": "Natural Solid Basswood & Non-toxic Food Grade Lacquer",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Math & Matching",
    "description": "Montessori wooden color and number matching board featuring vibrant colored pegs and counting slots to develop mathematical thinking, number recognition, and fine motor precision.",
    "milestones": [
      "Number recognition",
      "Color matching",
      "Pincer grasp development"
    ]
  },
  {
    "id": "toddler-03",
    "title": "Animal Cognition Blocks Educational Color Sorting Fidget Sensory Plastic Learning Toy for Baby Girl 1-3 Years Toys",
    "category": "sensory",
    "secondaryCategory": "montessori",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 2945.45,
    "originalPrice": 3500,
    "rating": 4.8,
    "reviewsCount": 22,
    "imageSrc": "assets/products/extracted_1_2/img_3.jpg",
    "imageType": "wooden-train",
    "material": "BPA-Free Food Grade ABS Plastic with Tactile Fidget Elements",
    "madeIn": "Certified Child-Safe",
    "inStock": true,
    "tag": "Color Sorting & Train",
    "description": "Educational animal cognition blocks and colorful sorting train toy fostering sensory color matching, tactile fidget exploration, and early imaginative storytelling.",
    "milestones": [
      "Animal cognition",
      "Color sorting",
      "Fine motor tactile play"
    ]
  },
  {
    "id": "toddler-02",
    "title": "Kids Toys Educational Learning Xylophone Keys Percussion Musical Instrument Music Book Preschool Kindergarten Educational Toys",
    "category": "sensory",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 5186.95,
    "originalPrice": 5900,
    "rating": 4.9,
    "reviewsCount": 38,
    "imageSrc": "assets/products/extracted_1_2/img_2.jpg",
    "imageType": "xylophone",
    "material": "Smooth Polished Wood Base with Multi-Color Metal Tuning Keys",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Music & Auditory",
    "description": "Educational learning xylophone with rainbow keys, percussion mallets, and musical learning book to foster auditory exploration, rhythm sensitivity, and fine motor grip.",
    "milestones": [
      "Auditory perception",
      "Rhythm coordination",
      "Bilateral hand movement"
    ]
  },
  {
    "id": "toddler-01",
    "title": "Color Classic Block Stacking Game Premium Wooden Board Game Tumbling Tower Building Blocks Set for Children",
    "category": "wooden-local",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "1-2y",
    "ageLabel": "1–2 Years",
    "ageRanges": [
      "1-2y",
      "2-3y"
    ],
    "price": 1500.51,
    "originalPrice": 1850,
    "rating": 4.8,
    "reviewsCount": 26,
    "imageSrc": "assets/products/extracted_1_2/img_1.jpg",
    "imageType": "wooden-blocks",
    "material": "Natural Beechwood & Non-toxic Water-based Paint",
    "madeIn": "Child-Safe Certified",
    "inStock": true,
    "tag": "Balance & Motor Skills",
    "description": "Colorful classic wooden stacking blocks and tumbling tower game designed to build toddler spatial balance, hand-eye coordination, and color recognition.",
    "milestones": [
      "Fine motor grip",
      "Spatial balance",
      "Color recognition"
    ]
  },
  {
    "id": "pdf-23",
    "title": "Plastic Learning Crawl Roll Toy - Head Raising & Crawling Practice Buddy",
    "category": "newborn",
    "secondaryCategory": "sensory",
    "ageRange": "0-1y",
    "ageLabel": "0–1 Year",
    "ageRanges": [
      "0-1y",
      "1-2y"
    ],
    "price": 1780.8,
    "originalPrice": 2200,
    "rating": 4.8,
    "reviewsCount": 29,
    "imageSrc": "assets/products/extracted/pdf_img_23.jpg",
    "imageType": "rattle-ball",
    "material": "Safe Shatter-Resistant ABS Plastic with Soft Glow LED & Melody Speaker",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Tummy Time & Crawl",
    "description": "Cute rolling animal toy that waddles forward with gentle lights and music, encouraging infants during tummy time to lift their heads, reach forward, and begin their first crawling motions.",
    "milestones": [
      "Tummy time head lifting",
      "Visual tracking in motion",
      "Crawling encouragement"
    ]
  },
  {
    "id": "pdf-22",
    "title": "7PCS Montessori Early Education Wooden Musical & Intellectual Set",
    "category": "wooden-local",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "0-1y",
    "ageLabel": "0–5+ Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1517.39,
    "originalPrice": 1950,
    "rating": 4.9,
    "reviewsCount": 32,
    "imageSrc": "assets/products/extracted/pdf_img_22.jpg",
    "imageType": "wooden-puzzle",
    "material": "Selected Fine-Grain Pine & Birch Wood with Rounded Child-Safe Edges",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "7-Piece Music & Logic",
    "description": "7-piece Montessori early developmental set including rainbow wooden xylophone with mallets, ring stacking tower, bead coaster maze, wooden clock puzzle, tangram puzzle, and shape sorting board.",
    "milestones": [
      "Auditory pitch awareness",
      "Size sequencing rings",
      "Spatial geometry"
    ]
  },
  {
    "id": "pdf-21",
    "title": "Wooden Montessori Toys Curated Kit Box for 1 Year Old (12-18 Months)",
    "category": "montessori",
    "secondaryCategory": "wooden-local",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 5936,
    "originalPrice": 7200,
    "rating": 5,
    "reviewsCount": 58,
    "imageSrc": "assets/products/extracted/pdf_img_21.jpg",
    "imageType": "box-toddler",
    "material": "Sustainably Harvested Natural Solid Wood & Water-based Eco Paint",
    "madeIn": "Montessori Certified Kit",
    "inStock": true,
    "tag": "Curated 1-Year Kit",
    "description": "Comprehensive curated milestone gift box containing wooden pound-a-ball bench with hammer, 8-key rainbow xylophone, shape posting cube with key, 3-piece geometric stacker, and milestone guide cards.",
    "milestones": [
      "Hammer striking precision",
      "Object permanence posting",
      "Musical tone discovery"
    ]
  },
  {
    "id": "pdf-20",
    "title": "Wooden Activity Cube 5-Sided Montessori Developmental Toy for 1 Year Olds",
    "category": "wooden-local",
    "secondaryCategory": "montessori",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 1654.66,
    "originalPrice": 2050,
    "rating": 4.9,
    "reviewsCount": 37,
    "imageSrc": "assets/products/extracted/pdf_img_20.jpg",
    "imageType": "wooden-puzzle",
    "material": "High-Density Plantation Wood with Beveled Edges & Non-toxic Paint",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "5-in-1 Wooden Cube",
    "description": "Solid wood 5-sided exploratory activity cube featuring shape-sorting holes, rotating numeral blocks, sliding animal paths, and colorful peg pillars for early math and motor dexterity.",
    "milestones": [
      "Shape sorting",
      "Numeral recognition",
      "Wrist twisting dexterity"
    ]
  },
  {
    "id": "pdf-19",
    "title": "Baby Pop-up Animal Toys - Cause and Effect Sensory Interactive Box",
    "category": "montessori",
    "secondaryCategory": "sensory",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 1702.89,
    "originalPrice": 2150,
    "rating": 5,
    "reviewsCount": 46,
    "imageSrc": "assets/products/extracted/pdf_img_19.jpg",
    "imageType": "shape-sorter",
    "material": "Smooth Drop-Proof ABS Plastic with No Batteries Required (Pure Mechanical)",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Cause & Effect Classic",
    "description": "Interactive 4-character animal pop-up box activated by pressing a switch, pushing a button, sliding a toggle, and twisting a dial. Delights babies with rewarding cause-and-effect surprises.",
    "milestones": [
      "Four different motor actions",
      "Cause and effect understanding",
      "Anticipatory curiosity"
    ]
  },
  {
    "id": "pdf-17",
    "title": "Cotton Animal Montessori Sensory Soft Play House with Musical Sounds",
    "category": "sensory",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 2968,
    "originalPrice": 3500,
    "rating": 4.9,
    "reviewsCount": 25,
    "imageSrc": "assets/products/extracted/pdf_img_17.jpg",
    "imageType": "cot-book",
    "material": "Plush Corduroy & Organic Velvet Cotton with Shatterproof Baby Mirror",
    "madeIn": "Handmade Soft Toys",
    "inStock": true,
    "tag": "Sensory Puppet House",
    "description": "Plush fabric barn house with carry handle, peek-a-boo windows, baby-safe reflection mirror, and 5 soft squeaking and chiming animal finger puppets (fox, bear, elephant, giraffe, zebra).",
    "milestones": [
      "Auditory squeak feedback",
      "In-and-out object permanence",
      "Imaginative bonding"
    ]
  },
  {
    "id": "pdf-16",
    "title": "Montessori Wooden Activity Table with Bead Maze & Carrot Harvest Game",
    "category": "wooden-local",
    "secondaryCategory": "montessori",
    "ageRange": "0-1y",
    "ageLabel": "0–4 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3672.9,
    "originalPrice": 4400,
    "rating": 5,
    "reviewsCount": 41,
    "imageSrc": "assets/products/extracted/pdf_img_16.jpg",
    "imageType": "wooden-puzzle",
    "material": "Solid Rubberwood Table with Coated Steel Bead Maze & Felt-Leaf Carrots",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "Standing Activity Center",
    "description": "4-legged wooden developmental activity table equipped with wire bead coaster maze, carrot harvest sizing game, rotating cog gears, and animal track slider. Encourages pulling to stand.",
    "milestones": [
      "Pulling to stand stability",
      "Hand-eye 3D tracking",
      "Size discrimination"
    ]
  },
  {
    "id": "pdf-15",
    "title": "Multifunctional 6-in-1 Baby Activity Cube with Rocket Launcher & Gear Twist",
    "category": "montessori",
    "secondaryCategory": "steam-math",
    "ageRange": "0-1y",
    "ageLabel": "0–4 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3524.5,
    "originalPrice": 4200,
    "rating": 4.9,
    "reviewsCount": 33,
    "imageSrc": "assets/products/extracted/pdf_img_15.jpg",
    "imageType": "busy-board",
    "material": "Reinforced Shatterproof ABS with Modular Interlocking Connecting Panels",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "6-in-1 Multi-Activity",
    "description": "Modular 6-sided activity center featuring interlocking panels with mechanical gears, turn knobs, shape sorting, phone dial, rope buckle, and spring-loaded pop rocket launcher.",
    "milestones": [
      "Rotational wrist control",
      "Mechanical cause-and-effect",
      "Problem solving"
    ]
  },
  {
    "id": "pdf-14",
    "title": "Montessori Felt Busy Board for Toddlers Preschool Cognitive Bag",
    "category": "montessori",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "0-1y",
    "ageLabel": "0–5+ Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1443.19,
    "originalPrice": 1800,
    "rating": 4.9,
    "reviewsCount": 36,
    "imageSrc": "assets/products/extracted/pdf_img_14.jpg",
    "imageType": "busy-board",
    "material": "Ultra-Soft Wool Felt Fabric with Secure Stitching and Child-Safe Hardware",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Travel Quiet Board",
    "description": "Lightweight portable felt quiet book bag with buckles, zippers, shoelaces, buttons, clock hands, and alphabet/number felt inserts. Fosters real-world fine motor practical life skills.",
    "milestones": [
      "Fine motor finger dexterity",
      "Practical life skills",
      "Alphabet & number familiarity"
    ]
  },
  {
    "id": "pdf-13",
    "title": "Classic Toy Smart Board Early Education Wooden Puzzles & Counting Blocks",
    "category": "wooden-local",
    "secondaryCategory": "steam-math",
    "ageRange": "0-1y",
    "ageLabel": "0–4 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3079.3,
    "originalPrice": 3750,
    "rating": 5,
    "reviewsCount": 48,
    "imageSrc": "assets/products/extracted/pdf_img_13.jpg",
    "imageType": "wooden-puzzle",
    "material": "Solid Sri Lankan Natural Wood Board, Non-toxic Safe Pigments, Magnetic Pegs",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "Smart Board All-in-1",
    "description": "All-in-one wooden developmental smart board featuring magnetic fishing rod, counting stacking rings, numeric blocks 1-10, geometric shape cutouts, and color sorting tracks.",
    "milestones": [
      "Color & shape sorting",
      "Magnetic hand-eye precision",
      "Counting concepts"
    ]
  },
  {
    "id": "pdf-12",
    "title": "88pcs Bagged Assembly Bricks House Block Set Creative DIY Stacking Toy",
    "category": "steam-math",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "0-1y",
    "ageLabel": "0–5+ Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 1061.06,
    "originalPrice": 1350,
    "rating": 4.8,
    "reviewsCount": 27,
    "imageSrc": "assets/products/extracted/pdf_img_12.jpg",
    "imageType": "wooden-blocks",
    "material": "Chunky Round-Edged Polymer Bricks with Window & Roof Modular Elements",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "First Builder 88 Pcs",
    "description": "88-piece jumbo interlocking building bricks featuring windows, doors, and colorful roof pieces. Sized safely to eliminate choking hazards while developing two-handed construction skills.",
    "milestones": [
      "Bilateral hand coordination",
      "Basic stacking logic",
      "Spatial construction"
    ]
  },
  {
    "id": "pdf-11",
    "title": "Baby Rainbow Stacking Blocks & Gripping Training Montessori Sensory Box",
    "category": "montessori",
    "secondaryCategory": "sensory",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 1662.08,
    "originalPrice": 2100,
    "rating": 5,
    "reviewsCount": 53,
    "imageSrc": "assets/products/extracted/pdf_img_11.jpg",
    "imageType": "shape-sorter",
    "material": "High-Elastic Color Cords & Textured BPA-Free Sensory Shape Blocks",
    "madeIn": "Montessori Certified",
    "inStock": true,
    "tag": "Montessori Sensory Bin",
    "description": "Innovative sensory bin with elastic colorful bands and chunky textured geometric shape blocks. Babies practice pushing and pulling blocks through elastic cords, mastering spatial reasoning and finger grip.",
    "milestones": [
      "Spatial reasoning",
      "Pincer & palmar grasp",
      "Tactile texture discrimination"
    ]
  },
  {
    "id": "pdf-10",
    "title": "Sigao Yellow Duck Baby Bath Toy with Shower Head Sprayer",
    "category": "sensory",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 1880.97,
    "originalPrice": 2300,
    "rating": 4.8,
    "reviewsCount": 39,
    "imageSrc": "assets/products/extracted/pdf_img_10.jpg",
    "imageType": "rattle-ball",
    "material": "Waterproof Sealed Motor, Durable Non-toxic ABS Plastic, Suction Cup Mount",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Bath Time Favorite",
    "description": "Water-circulating floating yellow duck bath buddy with electric motorized gentle shower sprayer and suction cup base. Transforms bath time into a calm, giggly sensory experience.",
    "milestones": [
      "Water play comfort",
      "Sensory tactile soothing",
      "Cause-and-effect observation"
    ]
  },
  {
    "id": "pdf-09",
    "title": "Cute Children Silicone Fidget Bubble Push Popping Backpack",
    "category": "sensory",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "0-1y",
    "ageLabel": "0–5+ Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 3821.3,
    "originalPrice": 4500,
    "rating": 4.9,
    "reviewsCount": 31,
    "imageSrc": "assets/products/extracted/pdf_img_9.jpg",
    "imageType": "sensory-ball",
    "material": "Food-Grade BPA-free Silicone Bubble Face with Soft Canvas Straps",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Sensory Popping",
    "description": "Multi-colored animal pop-bubble sensory mini backpack with adjustable soft shoulder straps and zip compartment. Provides soothing tactile popping sensation that relieves infant restlessness.",
    "milestones": [
      "Sensory calming",
      "Finger isolation & push",
      "Tactile exploration"
    ]
  },
  {
    "id": "pdf-08",
    "title": "Handwoven Cotton Crochet Animal Baby Rattle & Beechwood Teether",
    "category": "wooden-local",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–1 Year",
    "ageRanges": [
      "0-1y",
      "1-2y"
    ],
    "price": 927.5,
    "originalPrice": 1200,
    "rating": 5,
    "reviewsCount": 45,
    "imageSrc": "assets/products/extracted/pdf_img_8.jpg",
    "imageType": "wooden-ring",
    "material": "100% Organic Hand-Knitted Cotton & Raw Unvarnished Beechwood Ring",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "Organic Teething",
    "description": "Hand-knitted organic cotton animal rattle with soothing natural beechwood teething ring. Gentle ringing bell inside provides pleasant auditory feedback while easing teething gums.",
    "milestones": [
      "Teething oral relief",
      "Grip strength reflex",
      "Auditory soothing"
    ]
  },
  {
    "id": "pdf-07",
    "title": "Children's Plastic Four-Wheel Sliding Balance Car",
    "category": "arts-fine-motor",
    "secondaryCategory": "steam-math",
    "ageRange": "0-1y",
    "ageLabel": "0–4 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 1988.56,
    "originalPrice": 2450,
    "rating": 4.8,
    "reviewsCount": 26,
    "imageSrc": "assets/products/extracted/pdf_img_7.jpg",
    "imageType": "wooden-car",
    "material": "Lightweight Eco-friendly PP Plastic, Anti-rollover Geometry",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Balance & Scoot",
    "description": "Ergonomic low-center-of-gravity 4-wheel indoor and outdoor balance push car. Designed with flower-shaped steering wheel, anti-rollover backrest, and silent wheels for safe scooting.",
    "milestones": [
      "Push and steer coordination",
      "Lower body propulsion",
      "Independent mobility"
    ]
  },
  {
    "id": "pdf-06",
    "title": "Gray Elephant Baby Walking Bike Plush Toy & Sliding Rocker",
    "category": "arts-fine-motor",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–3 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y"
    ],
    "price": 9646,
    "originalPrice": 11200,
    "rating": 5,
    "reviewsCount": 22,
    "imageSrc": "assets/products/extracted/pdf_img_6.jpg",
    "imageType": "wooden-animals",
    "material": "Plush Hypoallergenic Cotton with Solid Hardwood Handlebar & Silent Casters",
    "madeIn": "Certified Heirloom",
    "inStock": true,
    "tag": "Pre-Walking Balance",
    "description": "Ultra-soft plush elephant ride-on walker and sliding balance bike with ergonomic natural wooden handlebars and smooth rolling wheels. Encourages leg strength, first steps, and spatial equilibrium.",
    "milestones": [
      "Core stability",
      "Pre-walking leg strength",
      "Gross motor balance"
    ]
  },
  {
    "id": "pdf-05",
    "title": "Montessori Baby Interactive Ferris Wheel Spin & Sing Alphabet Zoo",
    "category": "sensory",
    "secondaryCategory": "language",
    "ageRange": "0-1y",
    "ageLabel": "0–1 Year",
    "ageRanges": [
      "0-1y",
      "1-2y"
    ],
    "price": 2385.53,
    "originalPrice": 2890,
    "rating": 4.9,
    "reviewsCount": 37,
    "imageSrc": "assets/products/extracted/pdf_img_5.jpg",
    "imageType": "rattle-ball",
    "material": "Food-Grade ABS Plastic with Heavy-Duty Suction Base",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Suction High-Chair Toy",
    "description": "High-chair suction cup spinning Ferris wheel with cheerful animal sounds, light-up flashing star buttons, and alphabet zoo songs. Keeps baby engaged while developing swatting and spinning motor skills.",
    "milestones": [
      "Cause and effect",
      "Swatting and spinning",
      "Auditory phonics"
    ]
  },
  {
    "id": "pdf-04",
    "title": "Electric Four-Wheel Off-Road Ride-on Car with Remote Control",
    "category": "steam-math",
    "secondaryCategory": "arts-fine-motor",
    "ageRange": "0-1y",
    "ageLabel": "0–5+ Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y",
      "5y-plus"
    ],
    "price": 12428.5,
    "originalPrice": 14500,
    "rating": 5,
    "reviewsCount": 18,
    "imageSrc": "assets/products/extracted/pdf_img_4.jpg",
    "imageType": "wooden-car",
    "material": "Heavy-Duty Reinforced Polymer, 2.4GHz Wireless Remote & Safety Seat Harness",
    "madeIn": "International Certified",
    "inStock": true,
    "tag": "Dual-Drive Remote",
    "description": "Rugged 4-wheel off-road electric ride-on vehicle with 2.4G parental wireless remote control, safety harness, front LED headlights, and dual-drive smooth acceleration for babies and toddlers.",
    "milestones": [
      "Spatial awareness",
      "Balance & posture",
      "Sensory stimulation"
    ]
  },
  {
    "id": "pdf-03",
    "title": "Animals Theme Sensory Fabric Quiet Book (Busy Book with CE/CPC)",
    "category": "sensory",
    "secondaryCategory": "language",
    "ageRange": "0-1y",
    "ageLabel": "0–1 Year",
    "ageRanges": [
      "0-1y",
      "1-2y"
    ],
    "price": 2559.9,
    "originalPrice": 3100,
    "rating": 5,
    "reviewsCount": 29,
    "imageSrc": "assets/products/extracted/pdf_img_3.jpg",
    "imageType": "cot-book",
    "material": "Multi-texture Washable Soft Fabric, BPA-Free Silicone Teether, CE & CPC Certified",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "CE & CPC Certified",
    "description": "Soft fabric animal-themed sensory busy book with 3D crinkle ears, tactile giraffe textures, peek-a-boo flaps, and zipper. Certified non-toxic, bite-safe, and washable for infants.",
    "milestones": [
      "Tactile exploration",
      "Object permanence",
      "Animal recognition"
    ]
  },
  {
    "id": "pdf-02",
    "title": "Wooden Colorful Baby Rattle Set - Montessori Musical Instrument",
    "category": "wooden-local",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–1 Year",
    "ageRanges": [
      "0-1y",
      "1-2y"
    ],
    "price": 352.45,
    "originalPrice": 450,
    "rating": 4.9,
    "reviewsCount": 42,
    "imageSrc": "assets/products/extracted/pdf_img_2.jpg",
    "imageType": "rattle-ball",
    "material": "Natural Beechwood & Non-toxic Water-based Pastel Lacquer",
    "madeIn": "Handcrafted",
    "inStock": true,
    "tag": "Grasping & Sound",
    "description": "Natural wooden colorful baby rattle ring and musical roller instrument with smooth hand-polished edges. Designed to stimulate grasping reflex, auditory tracking, and cause-and-effect shaking.",
    "milestones": [
      "Palmar grasp reflex",
      "Auditory tracking",
      "Sensory texture tactile"
    ]
  },
  {
    "id": "pdf-01",
    "title": "Art Drawing Table with Adjustable Stand",
    "category": "arts-fine-motor",
    "secondaryCategory": "newborn",
    "ageRange": "0-1y",
    "ageLabel": "0–4 Years",
    "ageRanges": [
      "0-1y",
      "1-2y",
      "2-3y",
      "3-4y"
    ],
    "price": 3300,
    "originalPrice": 3800,
    "rating": 4.9,
    "reviewsCount": 34,
    "imageSrc": "assets/products/extracted/pdf_img_1.jpg",
    "imageType": "busy-board",
    "material": "Non-toxic ABS, Magnetic Whiteboard with Adjustable Legs",
    "madeIn": "Safety Certified",
    "inStock": true,
    "tag": "Tummy Time & Drawing",
    "description": "Magnetic double-sided drawing table with an adjustable stand, pen holder, and erasable surface. Ideal for sitting and supported standing play, fostering bilateral hand coordination and early creative mark-making.",
    "milestones": [
      "Visual-motor control",
      "Fine motor coordination",
      "Early creativity"
    ]
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || CURATED_BOXES.find(b => b.id === id);
}

export function getBoxBuilderOptions(ageStage) {
  const matches = PRODUCTS.filter(p => {
    if (!ageStage || ageStage === 'all') return true;
    if (Array.isArray(p.ageRanges) && p.ageRanges.includes(ageStage)) return true;
    if (ageStage === '0-1y' || ageStage === '0-12m') return p.ageRange === '0-1y' || p.ageRange === '0-12m' || p.ageRange === 'all';
    if (ageStage === '5y-plus' || ageStage === '4-5y') return p.ageRange === '5y-plus' || p.ageRange === '4-5y' || p.ageRange === 'all';
    return p.ageRange === ageStage || p.ageRange === 'all';
  });
  return matches.length > 0 ? matches : PRODUCTS;
}

if (typeof window !== 'undefined') {
  window.generateToySvg = generateToySvg;
  window.renderProductMedia = renderProductMedia;
  window.getProductById = getProductById;
  window.PRODUCTS = PRODUCTS;
  window.CURATED_BOXES = CURATED_BOXES;
  window.SHOP_BY_AGE_GROUPS = SHOP_BY_AGE_GROUPS;
  window.AGE_RANGES = AGE_RANGES;
  window.CATEGORIES = CATEGORIES;
}
