const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  env: {
    API: process.env.API,
    USER_TOKEN: process.env.USER_TOKEN,
  },
}
