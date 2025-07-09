/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}', 
    './stores/**/*.{js,ts,jsx,tsx}', 
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        
        primary: {
          DEFAULT: "rgb(35, 162, 71)", // #23A247  fallback
          light: "rgb(76, 207, 120)",  // #4CCF78
          pale: "rgb(135, 255, 135)",  // #87FF87
        },
        secondary: {
          DEFAULT: "rgb(64, 145, 108)", // #40916C
          light: "rgb(116, 198, 157)",  // #74C69D
        },
        tertiary: {
          DEFAULT: "rgb(59, 130, 246)", // #3B82F6
          light: "rgb(147, 197, 253)",   // #93C5FD
        },
        accent: {
          DEFAULT: "rgb(250, 204, 21)",  // #FACC15
          light: "rgb(254, 240, 138)",    // #FEF08A
        },
        success: "rgb(34, 197, 94)",      // #22C55E
        warning: "rgb(234, 179, 8)",      // #EAB308
        error: "rgb(239, 68, 68)",        // #EF4444
        background: "rgb(255, 255, 255)", // #FFFFFF
        foreground: "rgb(15, 23, 42)",    // #0F172A
        muted: "rgb(229, 231, 235)",      // #E5E7EB
        mutedForeground: "rgb(107, 114, 128)", // #6B7280
        overlay: "rgba(0, 0, 0, 0.05)",

        // dark mode colors
        dark: {
          primary: {
            DEFAULT: "rgb(35, 162, 71)", //  light
            light: "rgb(76, 207, 120)",  //  light
            pale: "rgb(135, 255, 135)",  //  light
          },
          secondary: {
            DEFAULT: "rgb(167, 243, 208)", // #A7F3D0
            light: "rgb(187, 247, 208)",    // #BBF7D0
          },
          accent: {
            DEFAULT: "rgb(250, 204, 21)",   // #FACC15
            light: "rgb(253, 230, 138)",    // #FDE68A
          },
          tertiary: {
            DEFAULT: "rgb(96, 165, 250)",  // #60A5FA
            light: "rgb(191, 219, 254)",   // #BFDBFE
          },
          success: "rgb(74, 222, 128)",    // #4ADE80
          warning: "rgb(252, 211, 77)",     // #FCD34D
          error: "rgb(248, 113, 113)",      // #F87171
          background: "rgb(18, 18, 18)",    // #121212
          foreground: "rgb(243, 244, 246)", // #F3F4F6
          muted: "rgb(31, 41, 55)",         // #1F2937
          mutedForeground: "rgb(156, 163, 175)", // #9CA3AF
          overlay: "rgba(255, 255, 255, 0.05)",
        }
      },
    },
  },
  plugins: [],
};