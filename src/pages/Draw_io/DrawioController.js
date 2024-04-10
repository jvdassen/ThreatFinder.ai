import cssVariables from './styles/variables.js'
import aiactors from './libs/ai-actors.json'
import aidata from './libs/ai-data.json'
import aimodels from './libs/ai-models.json'
import aiprocesses from './libs/ai-processes.json'
import aienv from './libs/ai-env.json'
import aimisc from './libs/ai-misc.json'
import aidomain from './libs/ai-domain.json'

export default class DrawioStateController {
  constructor(drawio, storage) {
    this.drawio = drawio
    this.storage = storage
    this.clientId = Math.random() * 10e15

    this.drawio.receive(this.handleIncomingEvents.bind(this))
  }

  isJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  handleIncomingEvents(message) {
    if (message.data.length <= 0) {
      return console.log('Empty event received:', message)
    }
    if (message.data === 'ready') {
      //this.drawio.contentWindow.postMessage(JSON.stringify({ action: 'load', xmlpng: "" }), '*');
      return
    }
    if (!this.isJsonString(message.data)) {
      return
    }
    var msg = JSON.parse(message.data)
    var { event } = msg

    if (event === 'configure') {
      console.log('configure')
      this.configureDrawio()
    } else if (event === 'init') {
      console.log('init')
      this.loadDrawio()
    } else if (event === 'export') {
      console.log('export')
      this.storeDiagram(msg)
      this.close()
    } else if (event === 'autosave') {
      console.log('Autosave')
      this.autoSaveDiagram(msg)
    }
  }
  configureDrawio() {
    var configurationAction = {
      action: 'configure',
      config: {
        css: `
          .geMenubarContainer, .mxWindow {
            background-color: hsl(246, 56%, 90%) !important;
          }
          tr.mxPopupMenuItemHover {
            background-color: hsl(246, 56%, 90%) !important;
          }
          .geSidebarContainer .geTitle:hover {
            background: hsl(246, 56%, 95%) !important;
          }
          .geSidebarTooltip {
            box-shadow:0 2px 6px 2px rgba(218, 215, 244, 0.6) !important;
          }
          .geSidebar .geItem:hover {
            background-color: hsl(246, 56%, 95%) !important;
          }
          .geSidebarFooter > .geBtn {
            display: none !important;
          }
          .geTitle, .mxWindowTitle, .geFormatSection {
            color: ${cssVariables['--coretm-darkgrey']} !important;
          }
          .geFormatSection:nth-of-type(3), .geFormatSection:nth-of-type(4) {
          display: none;

          }
          .geMenubar {
          }
          .geDiagramContainer {
            overflow: hidden !important;
          }
          .geToolbarButton[title=Language] {
            display: none;
          }
        `,
        defaultFonts: [
          "Humor Sans",
          "Helvetica",
          "Times New Roman"
        ],
        ui: 'dark',
        defaultLibraries: 'ThreatFinderAI',
        defaultCustomLibraries: ['ThreatFinderAI'],
        enabledLibraries: ['ThreatFinderAI'],
        libraries: [{
          "title": {
            "main": "ThreatFinderAI"
          },
          "entries": [{
            "id": "ThreatFinderAI",
            "title": {
              "main": "ThreatFinderAI",
              "de": "ThreatFinderAI"
            },
            "desc": {
              "main": "ThreatFinderAI",
              "de": "ThreatFinderAI"
            },
            "libs": [{
              "title": {
                "main": "Miscellaneous",
                "de": "Miscellaneous"
              },
              "data": aimisc
            }, {
              "title": {
                "main": "Business Domain",
                "de": "Business Domain"
              },
              "data": aidomain
            }, {
              "title": {
                "main": "Actors",
                "de": "Actors"
              },
              "data": aiactors
            }, {
              "title": {
                "main": "Data",
                "de": "Data"
              },
              "data": aidata
            }, {
              "title": {
                "main": "Models",
                "de": "Models"
              },
              "data": aimodels
            }, {
              "title": {
                "main": "Procedures",
                "de": "Procedures"
              },
              "data": aiprocesses
            }, {
              "title": {
                "main": "Environments",
                "de": "Environments"
              },
              "data": aienv
            }
            ]
          }]
        }]
      }
    }
    this.drawio.send(configurationAction)
  }

  loadDrawio() {
    var draft = this.storage.read()
    var loadAction = {}
    if (draft != null) {
      var rec = draft
      loadAction = {
        action: 'load',
        autosave: 1,
        xml: rec.xml
      }

      var statusAction = {
        action: 'status',
        modified: true
      }

      this.drawio.send(loadAction)
      this.drawio.send(statusAction)
    } else {
      loadAction = {
        action: 'load',
        autosave: 1,
        xml: ""
      }
      this.drawio.send(loadAction)
    }
  }

  mergeChanges(record) {
    if (record.clientId === this.clientId) {
      return
    }
    var { xml } = record
    var mergeAction = {
      "action": "merge",
      "xml": xml
    }
    this.drawio.send(mergeAction)
  }

  storeDiagram(msg) {
    var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1))
    this.storage.write({
      data: svg
    })
  }
  autoSaveDiagram(msg) {
    this.storage.write({
      xml: msg.xml
    })
  }
  close() {
    // TOOD
    console.log('To be implemented')
  }
}

