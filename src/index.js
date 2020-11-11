import 'core-js/stable/promise'
import 'core-js/stable/array'
import 'regenerator-runtime/runtime'

const frameId = `zexPrintJS`

export function print(printableElementOptions = [], zoom = 1) {
  return new Promise((resolve, reject) => {
    const printFrame = createPrintFrame()
    document.getElementsByTagName('body')[0].appendChild(printFrame)

    printFrame.onload = () => {
      try {
        const printDocument = printFrame.contentWindow.document
        const printHead = printDocument.getElementsByTagName('head').item(0)

        cloneElement(printDocument, printableElementOptions)

        cloneCSS(printHead, printDocument)

        // cloneScript(printHead, printDocument)

        loadIframeImages(printDocument)
          .then(() => {
            try {
              performPrint(printFrame, printDocument, zoom)
              resolve()
            } catch (error) {
              reject(error)
            }
          })
          .catch((error) => reject(error))
      } catch (error) {
        reject(error)
      }
    }
  })
}

function createPrintFrame() {
  const usedFrame = document.getElementById(frameId)
  if (usedFrame) usedFrame.parentNode.removeChild(usedFrame)
  const printFrame = document.createElement('iframe')
  printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0')
  printFrame.setAttribute('id', frameId)
  printFrame.srcdoc = `<html><head></head><body></body></html>`
  return printFrame
}

function cloneElement(printDocument, printableElementOptions) {
  printableElementOptions.forEach(({ el, pageBreak, ignoreElements = [] }) => {
    const element = document.querySelector(el)
    if (element) {
      const wrapper = printDocument.createElement('div')
      if (pageBreak) {
        wrapper.setAttribute('style', 'page-break-after: always')
      }
      const clone = cloneEl(element, ignoreElements)
      wrapper.appendChild(clone)
      printDocument.body.appendChild(wrapper)
    }
  })
}

function cloneEl(element, ignoreElements) {
  const clone = element.cloneNode()
  const childNodes = Array.prototype.slice.call(element.childNodes)
  for (let i = 0; i < childNodes.length; i++) {
    if (ignoreElements.includes(childNodes[i].id)) {
      continue
    }
    const clonedChild = cloneEl(childNodes[i], ignoreElements)
    clone.appendChild(clonedChild)
  }

  if (element.nodeType === 1) {
    clone.setAttribute('style', collectStyles(element))
  }

  if (element.tagName === 'SELECT') {
    clone.value = element.value
  } else if (element.tagName === 'CANVAS') {
    clone.getContext('2d').drawImage(element, 0, 0)
  }

  return clone
}

function collectStyles(element) {
  const win = document.defaultView || window

  let elementStyle = ''

  const styles = win.getComputedStyle(element, '')

  for (let key = 0; key < styles.length; key++) {
    if (styles.getPropertyValue(styles[key]))
      elementStyle += styles[key] + ':' + styles.getPropertyValue(styles[key]) + ';'
  }

  return elementStyle
}

function cloneCSS(printHead, printDocument) {
  cloneLink(printHead, printDocument)
  cloneStyle(printHead, printDocument)
}

function cloneLink(printHead, printDocument) {
  const linkNodes = document.getElementsByTagName('link')
  Array.from(linkNodes).forEach(({ rel, type, href, as }) => {
    const link = printDocument.createElement('link')
    link.rel = rel
    link.type = type
    link.href = href
    link.as = as
    printHead.appendChild(link)
  })
}

function cloneStyle(printHead, printDocument) {
  const styleNodes = document.getElementsByTagName('style')
  Array.from(styleNodes).forEach(({ innerHTML }) => {
    const style = printDocument.createElement('style')
    style.innerHTML = innerHTML
    printHead.appendChild(style)
  })
}

function cloneScript(printHead, printDocument) {
  const scriptNodes = document.getElementsByTagName('script')
  Array.from(scriptNodes).forEach(({ type, src, innerHTML }) => {
    const script = printDocument.createElement('script')
    script.type = type
    if (src) {
      script.src = src
    } else {
      script.innerHTML = innerHTML
    }
    printHead.appendChild(script)
  })
}

function loadIframeImages(printDocument) {
  const imageNodes = printDocument.getElementsByTagName('img')
  if (imageNodes.length) {
    const promises = Array.from(imageNodes).map((image) => loadIframeImage(image))
    return Promise.all(promises)
  } else {
    return Promise.resolve()
  }
}

function loadIframeImage(image) {
  return new Promise((resolve) => {
    const pollImage = () => {
      !image || typeof image.naturalWidth === 'undefined' || image.naturalWidth === 0 || !image.complete
        ? setTimeout(pollImage, 500)
        : resolve()
    }
    pollImage()
  })
}

function performPrint(printFrame, printDocument, zoom) {
  try {
    printFrame.focus()
    printDocument
      .getElementsByTagName('body')[0]
      .setAttribute('style', `-webkit-print-color-adjust: exact;zoom: ${zoom}`)
    printFrame.contentWindow.print()

    printFrame.onafterprint = () => {
      document.body.removeChild(printFrame)
    }
  } catch (error) {
    throw error
  }
}
