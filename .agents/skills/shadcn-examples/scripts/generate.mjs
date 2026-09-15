#!/usr/bin/env node
/**
 * Generate shadcn-examples skill markdown from the official ui registry.
 *
 * Usage:
 *   node scripts/generate.mjs [path-to-ui-registry-new-york-v4]
 *
 * Default source:
 *   /home/abinash/Projects/ui/apps/v4/registry/new-york-v4
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(__dirname, "..")
const DEFAULT_SOURCE =
  "/home/abinash/Projects/ui/apps/v4/registry/new-york-v4"

const DEPRECATED = new Set([
  "toast",
  "toast-demo",
  "toast-destructive",
  "toast-simple",
  "toast-with-action",
  "toast-with-title",
])

/** Name-prefix composites (checked longest-first). */
const COMPOSITE_PREFIXES = [
  "date-picker",
  "data-table",
  "typography",
  "mode-toggle",
  "button-group",
  "input-group",
  "input-otp",
  "toggle-group",
  "alert-dialog",
  "aspect-ratio",
  "breadcrumb",
  "context-menu",
  "dropdown-menu",
  "hover-card",
  "navigation-menu",
  "native-select",
  "radio-group",
  "scroll-area",
  "accordion",
  "calendar",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "dialog",
  "drawer",
  "empty",
  "field",
  "form",
  "input",
  "item",
  "kbd",
  "label",
  "menubar",
  "pagination",
  "popover",
  "progress",
  "resizable",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "tooltip",
  "avatar",
  "badge",
  "button",
  "card",
  "chart",
  "alert",
]

const CHART_FAMILIES = [
  "area",
  "bar",
  "line",
  "pie",
  "radar",
  "radial",
  "tooltip",
]

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function rewriteImports(source) {
  return source
    .replaceAll("@/registry/new-york-v4/ui/", "@/components/ui/")
    .replaceAll("@/registry/new-york-v4/hooks/", "@/hooks/")
    .replaceAll("@/registry/new-york-v4/lib/", "@/lib/")
    .replaceAll("@/registry/new-york-v4/examples/", "@/components/")
    .replaceAll("@/registry/new-york-v4/blocks/", "@/components/")
    .replaceAll("@/registry/new-york-v4/charts/", "@/components/")
    // Registry uses the `cn` package; CLI rewrites it to the project utils alias.
    .replaceAll('from "cn"', 'from "@/lib/utils"')
    .replaceAll("from 'cn'", "from '@/lib/utils'")
}

/**
 * Extract top-level registry item objects by brace matching.
 * Avoids truncating on nested `{` inside `files: [...]`.
 */
function parseRegistryItems(registrySource) {
  const items = []
  const startRe = /\n\s*\{\s*\n\s*name:\s*"([^"]+)"/g
  let match
  while ((match = startRe.exec(registrySource)) !== null) {
    const name = match[1]
    if (DEPRECATED.has(name) || name.startsWith("toast-")) continue

    // Walk from the opening `{` of this item to its matching `}`
    const braceStart = registrySource.lastIndexOf("{", match.index + match[0].length)
    let depth = 0
    let end = braceStart
    for (let i = braceStart; i < registrySource.length; i++) {
      const ch = registrySource[i]
      if (ch === "{") depth++
      else if (ch === "}") {
        depth--
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    const body = registrySource.slice(braceStart, end + 1)

    const depsMatch = body.match(/registryDependencies:\s*\[([\s\S]*?)\]/)
    const registryDependencies = depsMatch
      ? [...depsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : []

    const files = []
    const pathRe = /path:\s*"([^"]+)"/g
    let pm
    while ((pm = pathRe.exec(body)) !== null) {
      // Grab a small window around this path for type/target
      const window = body.slice(Math.max(0, pm.index - 20), pm.index + 200)
      const typeMatch = window.match(/type:\s*"([^"]+)"/)
      const targetMatch = window.match(/target:\s*"([^"]+)"/)
      files.push({
        path: pm[1],
        type: typeMatch?.[1] || "",
        target: targetMatch?.[1] || "",
      })
    }

    const descMatch = body.match(/description:\s*"([^"]*)"/)
    items.push({
      name,
      description: descMatch?.[1] || "",
      registryDependencies,
      files,
    })
  }
  return items
}

function bucketForExample(item) {
  const { name, registryDependencies } = item

  // form-* → forms
  if (name.startsWith("form-")) return "forms"
  // chart-* demos in examples/ → chart
  if (name.startsWith("chart-")) return "chart"
  // mode-toggle is exact
  if (name === "mode-toggle" || name.startsWith("mode-toggle"))
    return "mode-toggle"

  for (const prefix of COMPOSITE_PREFIXES) {
    if (name === prefix || name.startsWith(`${prefix}-`)) {
      return prefix
    }
  }

  if (registryDependencies[0] && registryDependencies[0] !== "data-table") {
    // Prefer first dep if it looks like a UI item, unless name prefix already matched
    const dep = registryDependencies[0]
    if (!DEPRECATED.has(dep)) return dep
  }

  // Fallback: strip common suffixes
  return name
    .replace(/-demo$/, "")
    .replace(/-destructive$/, "")
    .replace(/-outline$/, "")
    .replace(/-secondary$/, "")
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function clearMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith(".md")) {
      fs.unlinkSync(path.join(dir, entry))
    }
  }
}

function readSourceFile(sourceRoot, relativePath) {
  const full = path.join(sourceRoot, relativePath)
  if (!fs.existsSync(full)) {
    console.warn(`  missing: ${relativePath}`)
    return null
  }
  return fs.readFileSync(full, "utf8")
}

function langForFile(filePath) {
  if (filePath.endsWith(".ts")) return "ts"
  if (filePath.endsWith(".json")) return "json"
  if (filePath.endsWith(".css")) return "css"
  return "tsx"
}

/**
 * Expand registry files with local relative imports (e.g. form schema/action
 * companions that ship beside the example but aren't listed in files[]).
 */
function expandLocalImports(sourceRoot, files) {
  const seen = new Set(files.map((f) => f.path))
  const queue = [...files]
  const result = [...files]

  while (queue.length) {
    const file = queue.shift()
    const raw = readSourceFile(sourceRoot, file.path)
    if (raw == null) continue
    const dir = path.posix.dirname(file.path)
    for (const m of raw.matchAll(/from\s+["'](\.\/[^"']+)["']/g)) {
      let rel = m[1]
      // Try with common extensions if none given
      const candidates = [rel]
      if (!path.extname(rel)) {
        candidates.push(`${rel}.ts`, `${rel}.tsx`, `${rel}.json`)
      }
      for (const cand of candidates) {
        const resolved = path.posix.normalize(`${dir}/${cand}`)
        if (seen.has(resolved)) continue
        if (!fs.existsSync(path.join(sourceRoot, resolved))) continue
        seen.add(resolved)
        const entry = { path: resolved, type: "registry:example", target: "" }
        result.push(entry)
        queue.push(entry)
        break
      }
    }
  }
  return result
}

function writeGroupedExamples(sourceRoot, items) {
  const outDir = path.join(SKILL_ROOT, "examples")
  ensureDir(outDir)
  clearMarkdownDir(outDir)

  /** @type {Map<string, typeof items>} */
  const groups = new Map()
  for (const item of items) {
    const bucket = bucketForExample(item)
    if (!groups.has(bucket)) groups.set(bucket, [])
    groups.get(bucket).push(item)
  }

  const catalog = []
  for (const [bucket, groupItems] of [...groups.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    const lines = [`# ${titleCase(bucket)}`, ""]
    for (const item of groupItems) {
      lines.push(`## ${item.name}`, "")
      const files = expandLocalImports(sourceRoot, item.files)
      for (const file of files) {
        const raw = readSourceFile(sourceRoot, file.path)
        if (raw == null) continue
        const code = rewriteImports(raw).trimEnd()
        const lang = langForFile(file.path)
        if (files.length > 1) {
          lines.push(`### \`${path.basename(file.path)}\``, "")
        }
        lines.push("```" + lang, code, "```", "")
      }
    }
    const outPath = path.join(outDir, `${bucket}.md`)
    fs.writeFileSync(outPath, lines.join("\n"))
    catalog.push(bucket)
    console.log(`  examples/${bucket}.md (${groupItems.length} items)`)
  }
  return catalog
}

function writeCharts(sourceRoot, items) {
  const outDir = path.join(SKILL_ROOT, "charts")
  ensureDir(outDir)
  clearMarkdownDir(outDir)

  /** @type {Map<string, typeof items>} */
  const groups = new Map()
  for (const item of items) {
    const m = item.name.match(/^chart-([a-z]+)/)
    const family = m?.[1] || "other"
    if (!groups.has(family)) groups.set(family, [])
    groups.get(family).push(item)
  }

  const catalog = []
  for (const family of [
    ...CHART_FAMILIES,
    ...[...groups.keys()].filter((k) => !CHART_FAMILIES.includes(k)).sort(),
  ]) {
    const groupItems = groups.get(family)
    if (!groupItems?.length) continue

    const lines = [`# Chart — ${titleCase(family)}`, ""]
    for (const item of groupItems) {
      lines.push(`## ${item.name}`, "")
      if (item.description) {
        lines.push(`> ${item.description}`, "")
      }
      for (const file of item.files) {
        const raw = readSourceFile(sourceRoot, file.path)
        if (raw == null) continue
        const code = rewriteImports(raw).trimEnd()
        lines.push("```" + langForFile(file.path), code, "```", "")
      }
    }
    fs.writeFileSync(path.join(outDir, `${family}.md`), lines.join("\n"))
    catalog.push(family)
    console.log(`  charts/${family}.md (${groupItems.length} items)`)
  }
  return catalog
}

function writeBlocks(sourceRoot, items) {
  const outDir = path.join(SKILL_ROOT, "blocks")
  ensureDir(outDir)
  clearMarkdownDir(outDir)

  /** @type {Map<string, typeof items>} */
  const groups = new Map()
  for (const item of items) {
    let bucket = item.name
    if (item.name.startsWith("login-")) bucket = "login"
    else if (item.name.startsWith("signup-")) bucket = "signup"
    // dashboard-01 and sidebar-NN stay as individual files
    if (!groups.has(bucket)) groups.set(bucket, [])
    groups.get(bucket).push(item)
  }

  const catalog = []
  for (const [bucket, groupItems] of [...groups.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    const lines = [`# ${titleCase(bucket)}`, ""]
    for (const item of groupItems) {
      lines.push(`## ${item.name}`, "")
      if (item.description) {
        lines.push(`> ${item.description}`, "")
      }
      if (item.registryDependencies.length) {
        lines.push(
          `Registry dependencies: ${item.registryDependencies.map((d) => `\`${d}\``).join(", ")}`,
          ""
        )
      }
      for (const file of item.files) {
        const raw = readSourceFile(sourceRoot, file.path)
        if (raw == null) continue
        const code = rewriteImports(raw).trimEnd()
        const label = file.target
          ? `${file.path} → ${file.target}`
          : file.path
        lines.push(`### \`${label}\``, "")
        lines.push("```" + langForFile(file.path), code, "```", "")
      }
    }
    fs.writeFileSync(path.join(outDir, `${bucket}.md`), lines.join("\n"))
    catalog.push(bucket)
    console.log(`  blocks/${bucket}.md (${groupItems.length} items)`)
  }
  return catalog
}

function writeSkillMd(exampleCatalog, chartCatalog, blockCatalog) {
  const uiLinks = exampleCatalog
    .map((slug) => `- [\`${slug}\`](examples/${slug}.md)`)
    .join("\n")

  const chartLinks = chartCatalog
    .map((slug) => `- [\`${slug}\`](charts/${slug}.md)`)
    .join("\n")

  const blockLinks = blockCatalog
    .map((slug) => `- [\`${slug}\`](blocks/${slug}.md)`)
    .join("\n")

  const content = `---
name: shadcn-examples
description: >-
  Official shadcn/ui usage examples for registry components, charts, and
  blocks. Use when composing UI, looking up component API patterns, building
  forms, charts, sidebars, login/signup pages, or needing copy-pasteable
  reference code for any shadcn registry item.
---

# shadcn/ui Examples

Copy-pasteable usage examples from the official \`new-york-v4\` registry.
**Read only the matching file below — never load the entire skill tree.**

## Workflow

1. Identify the component, composite, chart family, or block you need.
2. Open the linked file in this skill.
3. Adapt imports to this project (\`@/components/ui\`, \`@/lib/utils\`, \`@/hooks\`).
4. Follow project shadcn rules: \`FieldGroup\`/\`Field\`, \`gap-*\` (not \`space-y-*\`), \`data-icon\` on button icons. See [\`../shadcn/SKILL.md\`](../shadcn/SKILL.md).

## Import rewrite

Examples are already rewritten for this project:

| Registry path | Project alias |
| --- | --- |
| \`@/registry/new-york-v4/ui/...\` | \`@/components/ui/...\` |
| \`@/registry/new-york-v4/hooks/...\` | \`@/hooks/...\` |
| \`@/registry/new-york-v4/lib/...\` | \`@/lib/...\` |
| \`from "cn"\` | \`from "@/lib/utils"\` |

## Components & composites

${uiLinks}

## Charts

${chartLinks}

## Blocks

${blockLinks}

## Gaps (no \`registry:example\`)

| Item | Where to look |
| --- | --- |
| \`attachment\`, \`bubble\`, \`marker\`, \`message\`, \`message-scroller\` | [\`../shadcn/rules/chat.md\`](../shadcn/rules/chat.md) |
| \`direction\` | No official example yet — use the installed component source |
| \`toast\` / \`toast-*\` | Deprecated — use [\`sonner\`](examples/sonner.md) |
| \`sidebar\` UI primitive | See [blocks](#blocks) (\`sidebar-01\`…\`sidebar-16\`) and \`dashboard-01\` |

## Regenerating

From this skill directory (requires the local \`ui\` repo):

\`\`\`bash
node scripts/generate.mjs /path/to/ui/apps/v4/registry/new-york-v4
\`\`\`
`

  fs.writeFileSync(path.join(SKILL_ROOT, "SKILL.md"), content)
  console.log("  SKILL.md (catalog updated)")
}

function main() {
  const sourceRoot = path.resolve(process.argv[2] || DEFAULT_SOURCE)
  if (!fs.existsSync(sourceRoot)) {
    console.error(`Source registry not found: ${sourceRoot}`)
    process.exit(1)
  }

  console.log(`Source: ${sourceRoot}`)
  console.log(`Output: ${SKILL_ROOT}`)

  const examplesRegistry = fs.readFileSync(
    path.join(sourceRoot, "examples/_registry.ts"),
    "utf8"
  )
  const chartsRegistry = fs.readFileSync(
    path.join(sourceRoot, "charts/_registry.ts"),
    "utf8"
  )
  const blocksRegistry = fs.readFileSync(
    path.join(sourceRoot, "blocks/_registry.ts"),
    "utf8"
  )

  console.log("\nExamples:")
  const exampleItems = parseRegistryItems(examplesRegistry)
  const exampleCatalog = writeGroupedExamples(sourceRoot, exampleItems)

  console.log("\nCharts:")
  const chartItems = parseRegistryItems(chartsRegistry)
  const chartCatalog = writeCharts(sourceRoot, chartItems)

  console.log("\nBlocks:")
  const blockItems = parseRegistryItems(blocksRegistry)
  const blockCatalog = writeBlocks(sourceRoot, blockItems)

  console.log("\nSkill catalog:")
  writeSkillMd(exampleCatalog, chartCatalog, blockCatalog)

  console.log(
    `\nDone. ${exampleCatalog.length} example files, ${chartCatalog.length} chart files, ${blockCatalog.length} block files.`
  )
}

main()
