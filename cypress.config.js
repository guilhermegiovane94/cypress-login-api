const { defineConfig } = require('cypress')

const environments = {
  staging: {
    baseUrl: 'https://reqres.in',
  },
  production: {
    baseUrl: 'https://api.prod.example.com',
  },
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://reqres.in',
    defaultCommandTimeout: 10000,
    fixturesFolder: 'cypress/fixtures/staging',
    specPattern: 'cypress/e2e/**/*.cy.js',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/staging',
      overwrite: false,
      html: true,
      json: true,
    },
    setupNodeEvents(on, config) {
      // Identifica o ambiente via linha de comando:
      //   cypress run --env ENVIRONMENT=staging
      //   cypress run --env ENVIRONMENT=production
      //   cypress run --env envName=staging
      const env = (config.env && (config.env.envName || config.env.ENVIRONMENT)) || 'staging'
      const envConfig = environments[env] || environments.staging

      // Geração dinâmica de timestamp: YYYY-MM-DD_HH-mm-ss
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`

      config.baseUrl = envConfig.baseUrl
      config.fixturesFolder = `cypress/fixtures/${env}`
      config.reporterOptions = {
        reportDir: `cypress/reports/${env}/${timestamp}`,
        overwrite: false,
        html: true,
        json: true,
      }

      return config
    },
  },
})
