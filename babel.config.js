/** 
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}

*/


module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          "@": './src',
        },
      },
    ],
  ],
};