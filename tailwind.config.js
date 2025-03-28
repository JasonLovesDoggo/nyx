import catppuccin from '@catppuccin/tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [
    catppuccin({
      defaultFlavour: 'mocha',
    }),
  ],
};