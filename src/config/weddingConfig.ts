export const weddingConfig = {
  couple: {
    partner1: 'Daniel',
    partner2: 'Yohana',
    fullTitle: 'Daniel & Yohana',
    monogram: 'D & Y',
    hashtag: '#DanielEYohanaMaisFeliz',
  },
  date: {
    iso: '2027-07-24T14:00:00-03:00',
    displayDate: '24 de Julho de 2027',
    shortDate: '24 . 07 . 2027',
    dayOfWeek: 'Sábado',
    ceremonyTime: '14h00',
    receptionTime: '15h00',
    endTimeHint: 'Até o último acorde',
  },
  location: {
    city: 'Rio de Janeiro, RJ',
    neighborhood: 'Alto da Boa Vista',
    venueName: 'Canto do Alto',
    addressLine1: 'R. Raimundo Castro Maia, 115 - Fundos - Alto da Boa Vista',
    addressLine2: 'Rio de Janeiro - RJ, 20531-090',
    fullAddress:
      'R. Raimundo Castro Maia, 115 - Fundos - Alto da Boa Vista, Rio de Janeiro - RJ, 20531-090',
    coordinates: {
      lat: -22.9586,
      lng: -43.2794,
    },
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=R.+Raimundo+Castro+Maia,+115+-+Fundos+-+Alto+da+Boa+Vista,+Rio+de+Janeiro+-+RJ,+20531-090',
    wazeUrl:
      'https://waze.com/ul?q=R.%20Raimundo%20Castro%20Maia%2C%20115%20-%20Alto%20da%20Boa%20Vista%2C%20Rio%20de%20Janeiro&ll=-22.9586,-43.2794&navigate=yes',
    embedMapUrl:
      'https://maps.google.com/maps?q=R.+Raimundo+Castro+Maia,+115+-+Alto+da+Boa+Vista,+Rio+de+Janeiro+-+RJ,+20531-090&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  rsvp: {
    maxCompanions: 10,
    deadlineDisplay: '20 de Maio de 2027',
    supportEmail: 'contato@danieleyohana.com.br',
    supportWhatsapp: '+55 (21) 99432-0366',
    supportWhatsappClean: '5521994320366',
  },
  social: {
    instagram: 'https://instagram.com',
    spotifyPlaylistUrl: 'https://open.spotify.com',
    playlistName: 'Samba, Brisa & Encontro — D&Y',
  },
  texts: {
    heroQuote: 'O mais real dos sonhos meus...',
    heroSubquote:
      'Daniel e Yohana convidam você para um dia feito de afeto, música, brisa leve e encontro.',
    welcomeTitle: 'Todo caminho fez sentido até aqui',
    welcomeBody:
      'Entre conversas demoradas, cafés superfaturados e a sorte tranquila de quem encontrou abrigo no outro, decidimos celebrar.' + '\n' +
      'Não queremos protocolo rígido: queremos mesa comprida, abraço demorado, taça erguida e sorrisos sinceros.',
    coupleSectionTitle: 'Dois caminhos, um mesmo compasso',
  //   coupleSectionSubtitle:
  //     'Como numa canção que começa baixinho no violão e logo ganha coro na roda, nossa história foi se desenhando sem pressa e com muita verdade.',
  //   musicalInspirationNote:
  //     '',
  },
  venueDetails: {
    arrivalTips:
      'O Canto do Alto fica em uma área cercada pelo verde da Floresta da Tijuca, no Alto da Boa Vista (acesso pela Estrada da Gávea Pequena / Rua Raimundo Castro Maia).',
    parking:
      'O local não conta com estacionamento. Sugerimos utilizar aplicativos de transporte ou táxi para chegar e sair com segurança e comodidade.',
    accessibility:
      'O espaço possui acesso integrado às áreas da cerimônia e recepção, além de banheiros adaptados e equipe de apoio dedicada para receber convidados com mobilidade reduzida.',
    // accommodationAndTransport: [
    //   {
    //     title: 'Hospedagem sugerida (Barra da Tijuca, São Conrado e Tijuca)',
    //     description:
    //       'Para quem vem de fora, os bairros de São Conrado, Barra da Tijuca, Jardim Botânico e Tijuca oferecem fácil acesso ao Alto da Boa Vista em cerca de 15–25 minutos.',
    //   },
    //   {
    //     title: 'Ponto de Retorno & Vans',
    //     description:
    //       'Ao final da festa, teremos apoio na saída para embarque seguro em táxis e carros de aplicativo em área iluminada.',
    //   },
    // ],
  },
};

export type WeddingConfig = typeof weddingConfig;
