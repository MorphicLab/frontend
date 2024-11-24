/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 基于 RGB(70, 220, 225) 的配色方案
        morphic: {
          primary: 'rgb(70, 220, 225)',      // 主色调：亮青色
          secondary: 'rgb(100, 230, 235)',   // 次要色：浅青色
          accent: 'rgb(45, 195, 200)',       // 强调色：深青色
          light: 'rgb(180, 240, 245)',       // 浅色变体
          dark: 'rgb(35, 170, 175)',         // 深色变体
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}