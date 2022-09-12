let hot, exportPlugin
let isAllChecked
let existingHeaders
let dataContainer

let hotContainer = document.getElementById('myGrid')

let updateSettings = {
    rowHeaders: true,
    columns: [
    //   { type: 'drop' },
      { renderer: checkBoxRenderer },
      { renderer: editRenderer },
      { renderer: removeRenderer },
      { renderer: 'html', readOnly: true },
      { type: 'dropdown', source: ['00jchds', '20jchzx', '30jchbp'] },
      { type: 'dropdown', source: ['男性', '女性', 'その他', '不明'] },
      { type: 'dropdown', source: ['発端者', '父親', '親', '兄弟姉妹', 'その他'] },
      { renderer: 'html'}
    ],
    height: 'auto',
    colWidths: 100,
    search: true,
    manualColumnMove: true,
    manualRowMove: true,
    contextMenu: true,
    allowRemoveColumn: true,
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
}

createTable()

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

        createTable(object.PATIENTS)

        // convertObjectToArray(object.PATIENTS)
    })

    reader.readAsText(file)  
}

function convertObjectToArray(object) {
    if (object.length <= 0) return

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

function convertCSVToJSON(csv, isExport) {
    let json = Papa.parse(csv, {
        headers: true
    })

    let patientsData = []
    let data = json.data
    let notIncluded = [0, 1, 2]
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

function createTable(data) {
    if (!data) {
        let defaultData = ['患者ID', 'グループ名', '性別', '続柄', '臨床的特徴']
        data = new Array(defaultData)
    }

    dataContainer = data

    hotContainer.innerHTML = ''

    let actions = ['REMOVE', 'EDIT', 'CHECKBOX']
    data.forEach((d, i)=> {
        actions.forEach(a => {
            if (a === 'CHECKBOX') {
                // d.unshift('<input type="checkbox" class="header-checkbox">')
                // d.unshift(i === 0 ? '<input type="checkbox" class="header-checkbox">' : '')
                d.unshift(i === 0 ? '<input type="checkbox" class="header-checkbox" onclick="checkAll(event)">' : 'false')
            } else {
                d.unshift('')
            }
        })
    })

    let headers = data.shift()
    existingHeaders = headers

    // hot = new Handsontable(hotContainer, {
    //     data: data,
    //     rowHeaders: true,
    //     colHeaders: headers,
    //     columns: [
    //       { renderer: checkBoxRenderer },
    //       { renderer: editRenderer },
    //       { renderer: removeRenderer },
    //       { renderer: 'html', readOnly: true },
    //       { type: 'dropdown', source: ['00jchds', '20jchzx', '30jchbp'] },
    //       { type: 'dropdown', source: ['男性', '女性', 'その他', '不明'] },
    //       { type: 'dropdown', source: ['発端者', '父親', '親', '兄弟姉妹', 'その他'] },
    //       { renderer: 'html'}
    //     ],
    //     height: 'auto',
    //     colWidths: 100,
    //     search: true,
    //     manualColumnMove: true,
    //     manualRowMove: true,
    //     contextMenu: true,
    //     allowRemoveColumn: true,
    //     licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
    // })
    updateSettings.data = data
    updateSettings.colHeaders = headers
    hot = new Handsontable(hotContainer, updateSettings)

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')
        search.query(event.target.value)
        hot.render()
    })

    Handsontable.dom.addEvent(hotContainer, 'mousedown', function (event) {
        if (event.target.nodeName == 'INPUT' && event.target.classList.contains('header-checkbox')) {
            console.log('stop')
        //   event.stopPropagation();
        }
    });

    // Handsontable.dom.addEvent(hotContainer, 'mouseup', event => {
    //     let element = event.target

    //     if (element.nodeName === 'INPUT' && element.classList.contains('header-checkbox')) {
    //         console.log('hello', element.checked)
    //         // isAllChecked = !element.checked
    //         // checkBoxRenderer()
    //         // hot.render()
    //     }

    //     // hot.render()
    // })

    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`

    exportPlugin = hot.getPlugin('exportFile')
}

function checkAll(event) {
    // event.stopPropagation()
    console.log('hello test', event.target.checked)
    let isChecked = event.target.checked
    
    var sourceData = hot.getSourceData()
    var rows = sourceData.length
console.log(sourceData)
    sourceData.forEach(r => {
        console.log(d)
    })
    
    // for (var row = 0; row < rows; row += 1) {
    // 	sourceData[row]['active'] = newState;
    // }
    
    // hot.render()
}

function addRow() {
    hot.alter('insert_row', hot.countRows())
    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`
}

function addColumn() {
    let modal = document.querySelector('.modal')

    modal.style.display = 'block'
    document.querySelector('.close_modal').onclick = () => {
        modal.style.display = 'none'
    }

    let container = document.querySelector('#modal_container')
    container.innerHTML = ''

    let add = document.createElement('input')
    add.type = 'text'
    add.placeholder = 'カラムを選択または入力してください。'

    for (let [key, value] of Object.entries(columns)) {
        value.forEach(v => {
            if (!(existingHeaders.includes(v.columnName))) {
                let header = document.createElement('div')
                header.innerText = v.columnName
                header.onclick = () => {
                    console.log('clicked')
                    add.value = v.columnName
                }
                container.appendChild(header)
            } 
        })
    }

    container.appendChild(add)

    document.querySelector('.add').onclick = () => {
        let headers = hot.getColHeader()
        // headers.splice(headers.length -1, 0, add.value)
        existingHeaders.push(add.value)
        headers.push(add.value)
        console.log(headers)
        // dataContainer[0].push('')

        // console.log('before', hot.getData())
        // hot.updateSettings({ data: dataContainer })
        // console.log('after', hot.getData())

        // hot.alter('insert_col', hot.countCols(), 1, 'boop')
        // hot.updateSettings({
        //     colHeaders: headers
        // })
        // let newColumns = 
        updateSettings.colHeaders = headers
        updateSettings.columns.push({renderer: 'html'})
        // updateSettings.columns = newColumns

        hot.updateSettings(updateSettings)
        hot.render()
        modal.style.display = 'none'
    }
}