const events = [
  {
    id: 1,
    isLive: true,
    name: "Tech Conference 2025",
    poster: "https://picsum.photos/300/700",
    details: "A global conference on emerging technologies and innovations.",
    basicDetails: {
      name: "Tech Conference 2025",
      date: "2025-03-15",
      venue: "Main Auditorium",
      noOfMembers: 5,
      poster: "https://picsum.photos/300/700",
    },
    description:
      "A global conference covering cutting-edge innovations in technology.",
    rulebook: {
      link: "https://example.com/tech-conference-rulebook.pdf",
    },
    registrationFee: {
      amount: 250,
      currency: "USD",
    },
    coordinators: [
      { cName: "Alice Johnson", cMobile: "+1234567890" },
      { cName: "Bob Smith", cMobile: "+1987654321" },
    ],
    usefulLinks: [
      { title: "Event Website", link: "https://techconf2025.com" },
      { title: "Registration Form", link: "https://techconf2025.com/register" },
    ],
    participants: [
      {
        name: "Alice",
        rollNo: "TC202501",
        email: "alice@example.com",
        collegeName: "XYZ University",
        branch: "CSE",
        year: "3rd",
        mobileNo: "1234567890",
        isVerified: "Yes",
      },
      {
        name: "Bob",
        rollNo: "TC202502",
        email: "bob@example.com",
        collegeName: "ABC College",
        branch: "ECE",
        year: "2nd",
        mobileNo: "0987654321",
        isVerified: "No",
      },
      {
        name: "Charlie",
        rollNo: "TC202503",
        email: "charlie@example.com",
        collegeName: "LMN Institute",
        branch: "IT",
        year: "4th",
        mobileNo: "1122334455",
        isVerified: "Yes",
      },
    ],
    teams: ["Team Alpha", "Team Beta"],
    leaderboard: [
      { name: "Alice", score: 95 },
      { name: "Bob", score: 90 },
    ],
    path: "/event/tech-conference-2025",
  },
  {
    id: 2,
    isLive: false,
    name: "Startup Meetup",
    poster: "https://picsum.photos/300/600",
    details: "An exclusive networking event for entrepreneurs and investors.",
    basicDetails: {
      name: "Startup Meetup",
      date: "2025-04-10",
      venue: "Co-Working Space",
      noOfMembers: 3,
      poster: "https://picsum.photos/300/600",
    },
    description:
      "A networking event connecting startup founders and investors.",
    rulebook: {
      link: "https://example.com/startup-meetup-rulebook.pdf",
    },
    registrationFee: {
      amount: 100,
      currency: "USD",
    },
    coordinators: [
      { cName: "David Williams", cMobile: "+1122334455" },
      { cName: "Emma Brown", cMobile: "+6677889900" },
    ],
    usefulLinks: [
      { title: "Event Website", link: "https://startupmeetup2025.com" },
    ],
    participants: [
      {
        name: "David",
        rollNo: "SM202501",
        email: "david@example.com",
        collegeName: "PQR University",
        branch: "MBA",
        year: "1st",
        mobileNo: "2233445566",
        isVerified: "Yes",
      },
      {
        name: "Emma",
        rollNo: "SM202502",
        email: "emma@example.com",
        collegeName: "DEF College",
        branch: "BBA",
        year: "2nd",
        mobileNo: "6677889900",
        isVerified: "No",
      },
    ],
    teams: ["Team Start", "Team Grow"],
    leaderboard: [
      { name: "David", score: 88 },
      { name: "Emma", score: 85 },
    ],
    path: "/event/startup-meetup",
  },
];

export { events };
