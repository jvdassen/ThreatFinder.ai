var fs = require('fs')
var { decode } = require('html-entities')
var pako = require('pako')


var fileToProcess = process.argv[2]
if (!fileToProcess) {
  writeStderr('Usage: node convert.js PATH_TO_FILE\n\n')
  writeStderr('Additonally, you may redirect stdout to a JSON file:\n')
  writeStderr('node convert.js PATH_TO_FILE > xyz.json')
  process.exit(1)
} else {
  writeStderr(`Processing ${fileToProcess}\n\n`)
  processFile(fileToProcess)
}

function processFile(filePath) {
  var file = fs.readFileSync(filePath, 'utf8')
  var noXML = file.replace('<mxlibrary>', '').replace('</mxlibrary>', '')
  var jsonLibrary = JSON.parse(noXML)
  writeStderr(`${jsonLibrary.length} elements to process\n`)
  var processed = processLib(jsonLibrary)
  writeStderr('done')
  writeStdout(JSON.stringify(processed))
}

function processLib(jsonLib) {
  return jsonLib.map(cleanLibElement)
}

function cleanLibElement(el, i) {
  var htmlEntitiesRemoved = decode(el.xml)
  var uriEncoded = encodeURIComponent(htmlEntitiesRemoved)
  var compressed = String.fromCharCode.apply(null, new Uint8Array(pako.deflateRaw(uriEncoded)));
  var base64Encoded = btoa(compressed)

  el.xml = base64Encoded

  writeStderr(`${i}...`)

  return el
}

function writeStderr(msg) {
  process.stderr.write(msg)
}

function writeStdout(msg) {
  process.stdout.write(msg)
}
