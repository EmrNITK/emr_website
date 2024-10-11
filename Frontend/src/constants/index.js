import {
 
  emrlogo,
} from "../assets";

// import Hero from "../components/Hero";

export const navLinks = [
   {
    id: "hero",
    title: "Home",
    path : '/',
    componentId : "hero"
  },
  
  {

    title: "Links",
    componentId : "tablinks"
  },
  {
  
    title: "Contact",
    componentId : "footer"
  },
];

const services = [
  {
    title: "TECH FEST",
    icon: emrlogo,
    path: '/event',
  
  },
  {
    title: "Workshops",
    icon: emrlogo,
    path: '/workshop',
   
  },
  {
    title: "Events",
    icon: emrlogo,
    path: '/event',
  },
  {
    title: "Blog",
    icon: emrlogo,
    path: '/blog',
  },
  {
    title: "GALLERY",
    icon: emrlogo,
    path: '/gallery',
    
  },
  {
    title: "TEAM",
    icon: emrlogo,
    path: '/team',
  },
  {
    title: "Sponsor",
    icon: emrlogo,
    path: '/sponsor',
  },
  {
    title: "SOON",
    icon: emrlogo,
  },

 

];

  

const experiences = [
  {
    title: "ANPR  ", // title 
    company_name: "",//project name or lang used
    icon: emrlogo, // icon for the circle
    iconBg: "#383E56",
    // iconBg: "#18b03a",
    date: "date-duration",
    points: [
      "first point",
      "2nd",
      "3rd",
      "4th.",
    ],
  },
  {
    title: "ANPR  ", // title 
    company_name: "",//project name or lang used
    icon: emrlogo, // icon for the circle
    iconBg: "#383E56",
    // iconBg: "#18b03a",
    date: "date-duration",
    points: [
      "first point",
      "2nd",
      "3rd",
      "4th.",
    ],
  },
  {
    title: "ANPR  ", // title 
    company_name: "",//project name or lang used
    icon: emrlogo, // icon for the circle
    iconBg: "#383E56",
    // iconBg: "#18b03a",
    date: "date-duration",
    points: [
      "first point",
      "2nd",
      "3rd",
      "4th.",
    ],
  },
  {
    title: "ANPR  ", // title 
    company_name: "",//project name or lang used
    icon: emrlogo, // icon for the circle
    iconBg: "#383E56",
    // iconBg: "#18b03a",
    date: "date-duration",
    points: [
      "first point",
      "2nd",
      "3rd",
      "4th.",
    ],
  },
  
  
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: emrlogo,
    source_code_link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: emrlogo,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: emrlogo,
    source_code_link: "https://github.com/",
  },
];

export { services,  experiences, testimonials, projects };
