export default class CORSCommunicator {
  constructor (target) {
    this.target = target
  }
  send (message) {
    var stringified = JSON.stringify(message);
    if (this.target && this.target.contentWindow) {
      this.target.contentWindow.postMessage(stringified, '*');
    }

  }
  receive (callback) {
    window.addEventListener('message', callback)
  }
}
