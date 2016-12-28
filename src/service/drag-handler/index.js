import { BaseHandler } from './base-handler'
import { DragModel } from './drag-model'
import { defaults } from '../defaults'

export { DragulaEventHandler } from './dragula-event-handler'
export { ModelHandler } from './model-handler'

function createModelHandler ({dh, service, options = {}}) {
  console.log('createModelHandler', dh, options, defaults)
  const factory = options.createModelHandler || defaults.createModelHandler
  return factory({dh, service, options})
}

function createDragulaEventHandler ({dh, service, options = {}}) {
  console.log('createDragulaEventHandler', dh, options, defaults)
  const factory = options.createDragulaEventHandler || defaults.createDragulaEventHandler
  return factory({dh, service, options})
}

export class DragHandler extends BaseHandler {
  constructor ({service, name, drake, options = {}}) {
    super({service, options})
    this.dragElm = null
    this.drake = drake
    this.name = name
    this.dragModel = new DragModel()

    this.configModelHandler()
    this.configEventHandler()
  }

  get args () {
    return {
      dh: this,
      service: this.service,
      dragModel: this.dragModel,
      name: this.name,
      options: this.options
    }
  }

  configModelHandler () {
    this.modelHandler = createModelHandler(this.args)

    // delegate methods to modelHandler
    for (let name of ['removeModel', 'insertModel', 'notCopy', 'dropModel', 'dropModelSame']) {
      this[name] = this.modelHandler[name].bind(this.modelHandler)
    }
  }

  configEventHandler () {
    this.dragulaEventHandler = createDragulaEventHandler(this.args)

    // delegate methods to dragulaEventHandler
    for (let name of ['remove', 'drag', 'drop']) {
      this[name] = this.dragulaEventHandler[name].bind(this.dragulaEventHandler)
    }
  }

  get clazzName () {
    return this.constructor.name || 'DragHandler'
  }
}
