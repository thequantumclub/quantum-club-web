export const siteConfig = {
  name: "QUANTUM CLUB",
  description: "Music, performances, laughter and unforgettable connections. This is Quantum Club.",
  location: "Parbhani, Maharashtra, India",
  whatsappNumber: "917304134142", // Updated with requested number
  instagramUrl: "https://www.instagram.com/quantum.clubb",
  contactEmail: "thequantumcomedyclub@gmail.com",
  upiId: "7304134142@axl",
  upiName: "AKSHAD CHAUDHARI",
};

export const featuredEvent = {
  id: "garba-night",
  title: "QUANTUM CLUB GARBA NIGHT",
  subtitle: "Celebrate tradition. Feel the rhythm. Make memories.",
  date: "2026-10-14",
  displayDate: "14-15 October 2026",
  time: "06:00 PM onwards",
  venue: "Holiday funpark & resort, Parbhani",
  price: "₹800 per person",
  ticketPrice: 800,
  imageUrl: "/golden-garba-night.png", // Updated image
  registrationOpen: true,
};

export const pastEvents = [
  {
    id: "rang-barse",
    title: "RANG BARSE",
    date: "2026-03-03",
    description: "Our colorful Holi celebration full of music, water, colors, and joy.",
    imageUrl: "/rang-barse.png", 
  },
  {
    id: "strangers-unplugged",
    title: "STRANGERS UNPLUGGED",
    date: "2026-08-20",
    description: "An open stage where strangers came together to showcase talents like singing, dancing, rapping, and comedy.",
    imageUrl: "/strangers-unplugged-1.png",
  },
  {
    id: "strangers-unplugged-2",
    title: "STRANGERS UNPLUGGED 2.0",
    date: "2026-09-07",
    description: "The second edition of our creative community experience. More talent, more connections.",
    imageUrl: "/strangers-unplugged-2.png",
  },
  {
    id: "standup-pranit-more",
    title: "STAND-UP COMEDY: PRANIT MORE",
    date: "2026-05-28",
    description: "A hilarious evening of stand-up comedy featuring Pranit More.",
    imageUrl: "/pranit-more.png",
  }
];

export const upcomingEvents = [
  // Keeping it empty to focus on Garba Night as requested, but can be populated
];

export const whatsappMessages = {
  general: `Hi Quantum Club, I'd like to know more about your events.`,
  event: (eventName: string) => `Hi Quantum Club, I'd like to know more about ${eventName}.`,
  partnership: `Hi Quantum Club, I'm interested in discussing a collaboration.`,
};
