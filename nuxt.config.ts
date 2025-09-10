// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  ssr: false, // 關閉 SSR，改用靜態輸出
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: '/cat_game/', // 這裡要改成 GitHub 專案名稱
    buildAssetsDir: '/_nuxt/',
    cdnURL: 'https://asianiceguy9423.github.io/cat_game'
  }
})
