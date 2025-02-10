const events = [
  {
    id: 1,
    isLive: true,
    name: "Tech Conference 2025",
    poster: "https://picsum.photos/300/700",
    details: "A global conference on emerging technologies and innovations.",
    participants: [
      { name: "Alice", rollNo: "TC202501", email: "alice@example.com", collegeName: "XYZ University", branch: "CSE", year: "3rd", mobileNo: "1234567890", isVerified: "Yes" },
      { name: "Bob", rollNo: "TC202502", email: "bob@example.com", collegeName: "ABC College", branch: "ECE", year: "2nd", mobileNo: "0987654321", isVerified: "No" },
      { name: "Charlie", rollNo: "TC202503", email: "charlie@example.com", collegeName: "LMN Institute", branch: "IT", year: "4th", mobileNo: "1122334455", isVerified: "Yes" }
    ],
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
    poster: "https://picsum.photos/300/600",
    details: "An exclusive networking event for entrepreneurs and investors.",
    participants: [
      { name: "David", rollNo: "SM202501", email: "david@example.com", collegeName: "PQR University", branch: "MBA", year: "1st", mobileNo: "2233445566", isVerified: "Yes" },
      { name: "Emma", rollNo: "SM202502", email: "emma@example.com", collegeName: "DEF College", branch: "BBA", year: "2nd", mobileNo: "6677889900", isVerified: "No" }
    ],
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
    poster: "https://picsum.photos/300/600",
    details: "Hands-on workshop on Artificial Intelligence and Machine Learning.",
    participants: [
      { name: "Frank", rollNo: "AI202501", email: "frank@example.com", collegeName: "XYZ University", branch: "AI", year: "3rd", mobileNo: "3344556677", isVerified: "Yes" },
      { name: "Grace", rollNo: "AI202502", email: "grace@example.com", collegeName: "LMN Institute", branch: "ML", year: "2nd", mobileNo: "7788990011", isVerified: "No" }
    ],
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
    poster: "https://picsum.photos/300/600",
    details: "A deep dive into the world of blockchain and cryptocurrencies.",
    participants: [
      { name: "Henry", rollNo: "BC202501", email: "henry@example.com", collegeName: "ABC College", branch: "Blockchain", year: "4th", mobileNo: "4455667788", isVerified: "Yes" },
      { name: "Ivy", rollNo: "BC202502", email: "ivy@example.com", collegeName: "DEF College", branch: "Finance", year: "3rd", mobileNo: "9988776655", isVerified: "No" },
      { name: "Jack", rollNo: "BC202503", email: "jack@example.com", collegeName: "PQR University", branch: "Crypto", year: "2nd", mobileNo: "2233445566", isVerified: "Yes" }
    ],
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
    poster: "https://picsum.photos/300/600",
    details: "An intensive training program on ethical hacking and cybersecurity.",
    participants: [
      { name: "Kevin", rollNo: "CS202501", email: "kevin@example.com", collegeName: "XYZ University", branch: "Cybersecurity", year: "3rd", mobileNo: "5566778899", isVerified: "Yes" },
      { name: "Luna", rollNo: "CS202502", email: "luna@example.com", collegeName: "LMN Institute", branch: "IT Security", year: "2nd", mobileNo: "1122334455", isVerified: "No" }
    ],
    teams: ["Team Security", "Team Defense"],
    leaderboard: [
      { name: "Kevin", score: 91 },
      { name: "Luna", score: 87 }
    ],
    path: "/event/cybersecurity-bootcamp"
  }
];

export { events };
