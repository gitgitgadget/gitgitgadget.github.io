#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs"
import { parse } from "node-html-parser"
import Viz from "../static/js/viz-global.js"

/*
 * This script post-processes the site as generated via Hugo, replacing the
 * `<pre class="graphviz">` elements with inline `<svg>` ones, pre-rendered
 * via `viz-js`.
 */
;(async () => {
  for (const { Path: pathInPublic } of JSON.parse(readFileSync("public/diagram-list.json", "utf-8"))) {
    const path = `public${pathInPublic}.html`
    const contents = readFileSync(path, "utf-8")
    const html = parse(contents)
    const vizImport = html.querySelector('script[src$="viz-global.js"]')
    if (!vizImport) {
      console.error(`No 'viz-global.js' import found in ${path}; skipping`)
      continue
    }
    vizImport.nextElementSibling.remove() // remove the inline script
    vizImport.remove() // remove the import

    for (const pre of html.querySelectorAll("pre.graphviz")) {
      const engine = pre.getAttribute("engine") || "dot"
      const svg = (await Viz.instance()).renderString(pre.textContent, {
        format: "svg",
        graphAttributes: {
          bgcolor: "transparent",
        },
        engine,
      })
      const dataURL = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
      pre.replaceWith(`<img src="${dataURL}" />`)
    }
    console.log(`Rewriting ${path}`)
    writeFileSync(`${path}`, html.toString())
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
