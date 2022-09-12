let exportPlugin
let hot

let data = [
  ['ID', 'FAMILY', 'HPO', 'DATE', 'SAVE']
]

let dataSchema = {
  ID: null,
  FAMILY: null,
  HPO: null,
  DATE: null,
  SAVE: null
}

createTable(data)

function importFile(event) {
  let fileType = event.target.files[0].type
  let reader = new FileReader()
  reader.onload = (event => {
    let data = event.target.result
    let object

    if (fileType === 'text/csv') {
      object = convertCSVToJSON(data)
    } else {
      object = JSON.parse(data)
    }

    convertObjectToArray(object.PATIENTS)
  })
  reader.readAsText(event.target.files[0])
}

function convertObjectToArray(object) {
  if (object.length <= 0) {
    return
  }

  let data = []

  let headers = Object.keys(object[0])
  data.push(headers)

  object.forEach(o => {
    let pData = []
    headers.forEach(h => {
      pData.push(o[h])
    })

    data.push(pData)
  })

  createTable(data)
}

function createTable(data) {
  const container = document.getElementById('myGrid')
  // container.style.height = 'auto'
  container.innerHTML = ''

  let actions = ['REMOVE', 'EDIT', 'CHECKBOX', 'ADD']
  data.forEach((d, i)=> {
    actions.forEach(a => {
      if (a ===  'CHECKBOX') {
        d.unshift(i === 0 ? 'false' : 'false')
      } else if (a !== 'ADD') {
        d.unshift('')
      } else {
        d.push(i === 0 ? '<i class="material-icons-outlined add-column">add_circle_outline</i>' : '')
      }
    })
  })

  let headers = data.shift()

  hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: headers,
    columns: [
      { type: 'checkbox'},
      { renderer: editRenderer },
      { renderer: removeRenderer },
      { renderer: 'html', readOnly: true },
      { type: 'dropdown', source: ['00jchds', '20jchzx', '30jchbp'] },
      { type: 'dropdown', source: ['男性', '女性', 'その他', '不明'] },
      { type: 'dropdown', source: ['発端者', '父親', '親', '兄弟姉妹', 'その他'] },
      { renderer: 'html',},
      { renderer: 'html' }
    ],
    height: 'auto',
    colWidths: 100,
    search: true,
    manualColumnMove: true,
    manualRowMove: true,
    contextMenu: true,
    allowRemoveColumn: true,
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
  })

  Handsontable.dom.addEvent(document.getElementById('myGrid'), 'mouseup', event => {
    let element = event.target

    if (element.nodeName === 'I' && element.classList.contains('add-column')) {
      addRenderer()
    }

    // hot.render()
  })

  Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
    const search = hot.getPlugin('search')
    search.query(event.target.value)
    hot.render()
  })

  document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`

  exportPlugin = hot.getPlugin('exportFile')
}

function getExportData(type) {
  let exportedString = exportPlugin.exportAsString('csv', {
    bom: false,
    columnDelimiter: ',',
    columnHeaders: true,
    exportHiddenColumns: false,
    exportHiddenRows: false,
    rowHeaders: false
  })

  let dlData = convertCSVToJSON(exportedString, true)

  if (type === 'json') exportedString = dlData
  if (type === 'csv') exportedString = Papa.unparse(dlData.PATIENTS)

  exportFile(exportedString, type)
}

function convertCSVToJSON(csv, isExport) {
  let json = Papa.parse(csv, {
    headers: true
  })

  let patientsData = []
  let data = json.data
  let notIncluded = [0, 1, 2, data[0].length - 1]
  let headers = data[0]

  data.forEach((d, idx) => {
    let data = {}
    for (let i = 0; i < d.length; i++) {
      if (isExport) {
        if (notIncluded.includes(i)) continue
      }
      if (idx === 0) continue

      data[headers[i]] = d[i]
    }
    if (Object.keys(data).length > 0) patientsData.push(data)
  })

  return { PATIENTS: patientsData }
}

function exportFile(object, type) {
  let a = document.createElement('a')
  a.download = `patients_${Date.now()}.${type}`
  a.style.visibility = 'hidden'

  let data = `text/json;charset=utf-8,` +
             `${encodeURIComponent(JSON.stringify(object, null, 4))}`
  a.href = `data:${data}`

  if (type === 'csv') {
    let data = new Blob(['\ufeff' + object], { type: 'text/csv;charset=utf-8;' })
    a.href = URL.createObjectURL(data)
  }

  document.body.appendChild(a)
  a.click()
  a.remove()
}

function addRow() {
  hot.alter('insert_row', hot.countRows())
  document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`
}

function onDragOver(event) {
  event.preventDefault()

  let dragSupported = event.dataTransfer.length

  if (dragSupported) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(event) {
  event.preventDefault()

  let file = event.dataTransfer.items[0].getAsFile()
  let fileType = file.type

  let reader = new FileReader()
  reader.onload = (event => {
    let data = event.target.result
    let object

    if (fileType === 'text/csv') {
      object = convertCSVToJSON(data)
    } else {
      object = JSON.parse(data)
    }
  
    convertObjectToArray(object.PATIENTS)
  })

  reader.readAsText(file)  
}