export const artists = [
  {
    id: "lucas",
    name: "Lucas Almeida",
    category: "Bailarinos",
    role: "Bailarino",
    bio: "Encontra no movimento uma forma de contar histórias. Sua pesquisa reúne dança contemporânea, expressão corporal e a potência visual da Libras.",
  },
  {
    id: "mariana",
    name: "Mariana Santos",
    category: "Coreógrafos",
    role: "Coreógrafa",
    bio: "Investiga os encontros entre a cultura surda e a dança contemporânea. Suas criações exploram gestos, olhares e o corpo como território de expressão e pertencimento.",
  },
  {
    id: "juliana",
    name: "Juliana Reis",
    category: "Produção",
    role: "Produtora",
    bio: "Cuida dos encontros que fazem a companhia acontecer. Atua na produção cultural, na organização de projetos e na construção de espaços acessíveis para a arte.",
  },
  {
    id: "beatriz",
    name: "Beatriz Lima",
    category: "Bailarinos",
    role: "Bailarina",
    bio: "Explora a poesia do corpo em movimento. Integra o elenco da companhia e participa de processos de criação coletiva e oficinas de expressão corporal.",
  },
  {
    id: "felipe",
    name: "Felipe Rocha",
    category: "Bailarinos",
    role: "Bailarino",
    bio: "Sua trajetória aproxima improvisação, dança e comunicação visual. Acredita no palco como um espaço de diálogo e descoberta.",
  },
  {
    id: "rafael",
    name: "Rafael Vieira",
    category: "Produção",
    role: "Produtor",
    bio: "Trabalha nos bastidores para ampliar o acesso à cultura. Acompanha a circulação dos espetáculos e as atividades formativas da companhia.",
  },
];
export const shows = [
  {
    id: "entre-silencios",
    name: "Entre Silêncios",
    year: 2024,
    image: "stage",
    description:
      "O que o corpo diz quando as palavras se calam? Um encontro entre movimento, presença e as muitas formas de comunicar.",
    synopsis:
      "Entre Silêncios nasce do encontro entre o corpo e o não dito. A obra investiga as camadas da comunicação humana para além das palavras, revelando como os gestos, os olhares e os silêncios constroem narrativas potentes e poéticas.",
  },
  {
    id: "sinal-de-partida",
    name: "Sinal de Partida",
    year: 2025,
    image: "ensemble",
    description:
      "Uma criação coletiva sobre encontros, caminhos e a coragem de ocupar novos espaços.",
    synopsis:
      "Um gesto inicia o caminho. Sinal de Partida propõe uma jornada sobre identidade e pertencimento, com movimentos construídos a partir da Libras e das experiências do elenco. Cada corpo traz uma história; juntos, desenham novas possibilidades.",
  },
];
export const events = [
  {
    id: "ensaio-aberto",
    title: "Ensaio aberto",
    type: "Ensaio",
    date: "2026-06-15",
    time: "19h às 21h",
    image: "rehearsal",
    venue: "Sede da companhia",
    description:
      "Chegue mais perto do nosso processo criativo. Acompanhe um ensaio do elenco e participe de uma conversa sobre dança, Libras e criação coletiva.",
    slots: 30,
  },
  {
    id: "apresentacao-gala",
    title: "Apresentação de gala",
    type: "Espetáculo",
    date: "2026-06-22",
    time: "20h às 21h",
    image: "stage",
    venue: "Teatro Municipal",
    description:
      "Uma noite dedicada à arte do movimento. Nosso elenco apresenta uma seleção de cenas do repertório da Libras em Cena.",
    slots: 40,
  },
  {
    id: "oficina-danca",
    title: "Oficina de dança contemporânea",
    type: "Oficina",
    date: "2026-06-30",
    time: "14h às 17h",
    image: "workshop",
    venue: "Sede da companhia",
    description:
      "Uma experiência prática e criativa para explorar movimento, consciência corporal e expressão individual e coletiva. Para iniciantes e praticantes. Não é necessário ter experiência prévia.",
    slots: 15,
  },
];
export const products = [
  {
    id: "ecobag",
    name: "EcoBag Oficial",
    price: 49.9,
    image: "bag-lifestyle",
    detailImage: "bag",
    colors: ["Preto", "Cru"],
    description:
      "Leve a arte com você. Nossa EcoBag une praticidade e expressão, para acompanhar seus dias dentro e fora do palco.",
    specs: [
      "Algodão 100% reciclado",
      "38 × 42 cm, com alças reforçadas",
      "Estampa inspirada na Libras",
      "Capacidade de até 10 kg",
    ],
  },
  {
    id: "garrafa",
    name: "Garrafa Térmica",
    price: 35,
    image: "bottle",
    detailImage: "bottle",
    colors: ["Preto", "Prata"],
    description:
      "Sua companhia para ensaios, oficinas e a rotina. Uma garrafa para levar sua bebida e a identidade da Libras em Cena aonde você for.",
    specs: [
      "Aço inoxidável, parede dupla",
      "Capacidade de 500 ml",
      "Tampa com vedação",
      "Acabamento com a marca da companhia",
    ],
  },
];
export const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const dateLabel = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
export const imageUrl = (name) =>
  window.__LIBRAS_IMAGE_DATA__?.[name] || `/images/${name}.webp`;
