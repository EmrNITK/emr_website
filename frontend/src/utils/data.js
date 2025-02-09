const events = [
  {
    id: 1,
    isLive: true,
    name: "Tech Conference 2025",
    image: "https://via.placeholder.com/300",
    details: "A global conference on emerging technologies and innovations.",
    participants: ["Alice", "Bob", "Charlie"],
    teams: ["Team Alpha", "Team Beta"],
    leaderboard: [
      { name: "Alice", score: 95 },
      { name: "Bob", score: 90 }
    ],
    path: "/event/tech-conference-2025"
  },
  {
    id: 2,
    isLive: false,
    name: "Startup Meetup",
    image: "https://via.placeholder.com/300",
    details: "An exclusive networking event for entrepreneurs and investors.",
    participants: ["David", "Emma"],
    teams: ["Team Start", "Team Grow"],
    leaderboard: [
      { name: "David", score: 88 },
      { name: "Emma", score: 85 }
    ],
    path: "/event/startup-meetup"
  },
  {
    id: 3,
    isLive: false,
    name: "AI & ML Workshop",
    image: "https://via.placeholder.com/300",
    details: "Hands-on workshop on Artificial Intelligence and Machine Learning.",
    participants: ["Frank", "Grace"],
    teams: ["Team AI", "Team ML"],
    leaderboard: [
      { name: "Frank", score: 92 },
      { name: "Grace", score: 89 }
    ],
    path: "/event/ai-ml-workshop"
  },
  {
    id: 4,
    isLive: true,
    name: "Blockchain Summit 2025",
    image: "https://via.placeholder.com/300",
    details: "A deep dive into the world of blockchain and cryptocurrencies.",
    participants: ["Henry", "Ivy", "Jack"],
    teams: ["Team Crypto", "Team Ledger"],
    leaderboard: [
      { name: "Henry", score: 94 },
      { name: "Ivy", score: 89 }
    ],
    path: "/event/blockchain-summit"
  },
  {
    id: 5,
    isLive: false,
    name: "Cybersecurity Bootcamp",
    image: "https://via.placeholder.com/300",
    details: "An intensive training program on ethical hacking and cybersecurity.",
    participants: ["Kevin", "Luna"],
    teams: ["Team Security", "Team Defense"],
    leaderboard: [
      { name: "Kevin", score: 91 },
      { name: "Luna", score: 87 }
    ],
    path: "/event/cybersecurity-bootcamp"
  }
];

export { events };