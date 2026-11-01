import fs from 'fs'
import path from 'path'
import * as lucide from 'lucide-react'

function checkDir(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name)
    if (f.isDirectory()) {
      checkDir(full)
    } else if (f.name.endsWith('.tsx') || f.name.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8')
      const matches = content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)
      for (const match of matches) {
        const names = match[1].split(',').map(s => s.trim()).filter(Boolean)
        for (const name of names) {
          const clean = name.replace(/\s+as\s+\w+/, '').trim()
          if (clean && !lucide[clean]) {
            console.error(`UNDEFINED ICON: "${clean}" in ${full}`)
          }
        }
      }
    }
  }
}

checkDir('./src')
console.log('Finished checking all Lucide icon imports.')
