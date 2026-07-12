const path = require('path')

const getImagePath = (doc, outputDir) => {
  const docPath = doc.docPath
  const title = doc.properties.title
  const dirPath = path.join(outputDir, title)
  const prefixKey = path.relative(docPath, dirPath)
  return {
    dirPath,
    prefixKey
  }
}

module.exports = {
  getImagePath,
}
