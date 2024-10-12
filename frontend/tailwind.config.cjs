/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        // primary: "#01100d", /// for hero-bg15
    
        primaryy: "#050816b8",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
       
        // "hero-pattern": "url('/src/assets/hero-bg2.jpg')",

        // "hero-pattern": "url('/src/assets/hero-bg3.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg4.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg5.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg6.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg7.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg8.jpg')",

        
        // "hero-pattern": "url('/src/assets/code-bg.jpg')",
        
        
        
        
        // by priyanshu sir 
        // "hero-pattern": "url('/src/assets/hero-bg10.jpg')",


        // "hero-pattern": "url('/src/assets/hero-bg11.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg12.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg13.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg14.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg15.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg16.jpg')",
        // "hero-pattern": "url('/src/assets/hero-bg17.jpg')",
       
        

        // purple-lines-dark
        // "hero-pattern": "url('/src/assets/herobg.png')",

    // 
      },
    },
  },
  
  plugins: [],
};
