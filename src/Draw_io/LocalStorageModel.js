export default class LocalStorageModel {
  constructor(storageKey='diagram') {
    this.storageKey = storageKey
    this.repo = localStorage
  }
  observe (callback) {
    window.addEventListener('storage', (e) => {
      console.log('storage!')
      if(e.key !== this.storageKey) {
        return
      }

      var record = JSON.parse(e.newValue)
      callback(record)
    })
  }

  read (key=this.storageKey) {
    var item = localStorage.getItem(key)
    return JSON.parse(item)
  }

  write (value, key=this.storageKey) {
    if (typeof value !== String) {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }
}
