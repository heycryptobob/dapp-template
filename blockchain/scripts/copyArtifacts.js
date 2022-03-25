const copy = require("copy")
const util = require("util")

const asyncCopy = util.promisify(copy)

const src = "artifacts/contracts/**/!(*.dbg.json|!(*.json))"
const dest = "../app/src/artifacts/contracts/"

const copyArtifacts = async () => {
  const files = await asyncCopy(src, dest)
  console.log(`Copied ${files.length} files.`)
}

module.exports = copyArtifacts