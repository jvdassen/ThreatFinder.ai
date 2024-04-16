export default class LocalStorageModel {
  constructor(storageKey = 'diagram') {
    this.storageKey = storageKey
    this.repo = localStorage
    this.callbacks = []
  }
  observe(callback) {
    var key = this.storageKey
    this.callbacks.push(function (e) {
      //console.log('callback fire!')
      if (e.key !== key) {
        return
      }

      var record = JSON.parse(e.newValue)
      callback(record)
    })
  }

  read(key = this.storageKey) {
    var item = localStorage.getItem(key)
    return JSON.parse(item)
  }

  write(value, key = this.storageKey) {
    if (typeof value !== String) {
      value = JSON.stringify(value)
    }

    // Dispatch StorageEvent manually for subscribers
    // in same browser context
    const event = new StorageEvent('storage', {
      key: key,
      oldValue: this.read(key),
      newValue: value,
    })

    localStorage.setItem(key, value)
    this.callbacks.forEach(c => c(event))
  }
}
