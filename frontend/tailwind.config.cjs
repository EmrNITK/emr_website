/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
  
   	extend: {
 		colors: {
 			// Restrict theme to the five provided colors
 			primary: {
 				DEFAULT: '#38984c',
 				dark: '#13703a',
 				light: '#51b749'
 			},
 			white: '#ffffff',
 			black: '#000000'
 		},
  		boxShadow: {
  			card: '0px 35px 120px -15px #211e35'
  		},
  		screens: {
  			xs: '450px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },

  plugins: [require("tailwindcss-animate")],
};
