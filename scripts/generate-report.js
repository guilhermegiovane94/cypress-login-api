const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const env = process.argv[2]
if (!env || !['staging', 'production'].includes(env)) {
  console.error('Uso: node scripts/generate-report.js <staging|production>')
  process.exit(1)
}

const baseDir = path.resolve(`cypress/reports/${env}`)
if (!fs.existsSync(baseDir)) {
  console.error(`Diretório não encontrado: ${baseDir}`)
  process.exit(1)
}

// Encontra a subpasta mais recente (por data de modificação)
const subdirs = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const fullPath = path.join(baseDir, d.name)
    return { name: d.name, path: fullPath, mtime: fs.statSync(fullPath).mtimeMs }
  })
  .sort((a, b) => b.mtime - a.mtime)

if (subdirs.length === 0) {
  console.error(`Nenhum relatório encontrado em ${baseDir}`)
  process.exit(1)
}

const latest = subdirs[0].path
console.log(`Gerando relatório consolidado em: ${latest}`)

// 1. Merge dos arquivos JSON individuais em um único JSON
execSync(
  `npx mochawesome-merge --reportDir "${latest}" > "${latest}/mochawesome.json"`,
  { stdio: 'inherit', shell: true }
)

// 2. Geração do HTML consolidado com assets embutidos
execSync(
  `npx marge --reportDir "${latest}" --reportFilename report --inline`,
  { stdio: 'inherit', shell: true }
)

console.log(`Relatório gerado: ${path.join(latest, 'report.html')}`)