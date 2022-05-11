module.exports = {
  mode: "jit",
  corePlugins: {
    preflight: false,
  },
  prefix: "t-",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        warning: "#EB5757",
        primary: "#219653",
        faded: "#808080",
      },
      maxWidth: {
        "1/4": "25%",
        "1/6": "16.67%",
        "1/2": "50%",
        "2/3": "66.67%",
        "3/4": "75%",
        "2/5": "40%",
      },
      screens: {
        "3xl": "1720px",
        "4xl": "1920px",
        "5xl": "2560px",
      },
      fontSize: {
        14: "0.875rem",
        16: "1rem",
        18: "1.125rem",
      },
      lineHeight: {
        "leading-4.5": "1.125rem",
      },
      transform: ["hover", "focus"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
