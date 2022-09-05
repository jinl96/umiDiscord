module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**.tsx',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-fast':'bounce 0.2s ease-in-out 1.5s'
      }
    }
  },
  mode:'jit'
}