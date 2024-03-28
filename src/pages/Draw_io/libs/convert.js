var fs = require('fs')

var fileToProcess = process.argv[2]
if(!fileToProcess) {
  console.error('Usage: node convert.js PATH_TO_FILE')
  process.exit(1)
} else {
  console.warn(`Processing ${fileToProcess}`)
  processFile(fileToProcess)
}

function processFile (filePath) {
  var file = fs.readFileSync(filePath, 'utf8')
  var noXML = file.replace('<mxlibrary>', '').replace('</mxlibrary>', '')
  var jsonLibrary = JSON.parse(noXML)
  console.log(jsonLibrary)

}

