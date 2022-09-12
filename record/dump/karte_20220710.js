let hot, exportPlugin
let isAllChecked = true

let headers = [], colHeaders = [], hiddenColumns = [], existingHeaders = []
let dataSchema = {}

let hotContainer = document.getElementById('myGrid')

let updateSettings = {
    rowHeaders: true,
    height: 'auto',
    colWidths: 100,
    search: true,
    manualColumnMove: true,
    manualRowMove: true,
    contextMenu: true,
    allowRemoveColumn: true,
    columnSorting: {
        indicator: false,
        sortEmptyCells: false
    },
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
}

initiateTable()

async function initiateTable() {
    // let data = [{
    //     "患者ID": "",
    //     "グループID": "",
    //     "性別": "",
    //     "続柄": "",
    //     "主訴": ""
    // }]

    await createColumns()

    Object.assign(updateSettings, {
        data: [],
        dataSchema: dataSchema,
        colHeaders: colHeaders,
        columns: headers,
        hiddenColumns: {columns: hiddenColumns},
    })

    hot = new Handsontable(hotContainer, updateSettings)

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')
        search.query(event.target.value)
        hot.render()
    })

    Handsontable.dom.addEvent(hotContainer, 'mousedown', function (event) {
        if (event.target.nodeName == 'INPUT' && event.target.classList.contains('header-checkbox')) {
            event.stopPropagation()
        }
    })

    Handsontable.dom.addEvent(hotContainer, 'mouseup', event => {
        let element = event.target

        if (element.nodeName === 'INPUT' && element.classList.contains('header-checkbox')) {
            isAllChecked = !isAllChecked
            element.checked = isAllChecked
            hot.render()
        }
    })

    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`

    exportPlugin = hot.getPlugin('exportFile')
}

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

        updateTable(object.PATIENTS)

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

function createColumns() {
    // headers = columns (settings - type, options, renderer, etc)
    // colHeaders = headers

    return new Promise((resolve, reject) => {
        let defaultColumns = ['患者ID', 'グループID', '性別', '続柄', '主訴']
        let actions = ['REMOVE', 'EDIT', 'CHECKBOX']
        let count = 3

        for (let [key, value] of Object.entries(columns)) {
            console.log(key, value)
            value.forEach(v => {
                colHeaders.push(`${v.columnName} <i class="material-icons-outlined sort_icon">unfold_less</i>`)

                let column = {
                    data: v.columnName,
                    type: v.type,
                    source: v.options
                }
                if (v.type === 'date') {
                    column.dateFormat = 'YYYY/MM/DD',
                    column.correctFormat = true
                }
                headers.push(column)

                if (defaultColumns.includes(v.columnName)) {
                    existingHeaders.push(v.columnName)
                } else {
                    hiddenColumns.push(count)
                }
                count++

                dataSchema[v.columnName] = null
            })
        }

        actions.forEach(a => {
            let colHeaderText = ''
            let headerText = {
                data: a,
                renderer: a === 'EDIT' ? editRenderer : removeRenderer
            }

            if (a === 'CHECKBOX') {
                colHeaderText = `<input type="checkbox" class="header-checkbox" ${isAllChecked ? 'checked="checked"' : ''}>`
                headerText.renderer = checkBoxRenderer
            }

            headers.unshift(headerText)
            colHeaders.unshift(colHeaderText)
        })
        resolve()
    })
}

function createColumns__(data) {
    return new Promise((resolve, reject) => {
        colHeaders = []
        let actions = ['REMOVE', 'EDIT', 'CHECKBOX']
        data.forEach((d, i)=> {
            actions.forEach(a => {
                if (a === 'CHECKBOX') {
                    d[a] = false
                } else {
                    d[a] = ''
                }
            })
        })

        headers = Object.keys(data[0])
        existingHeaders = headers

        let sources = {
            '性別': ['男性', '女性', 'その他', '不明'],
            'グループID': ['00jchds', '20jchzx', '30jchbp'],
            '続柄': ['発端者', '父親', '親', '兄弟姉妹', 'その他']
        }

        headers = headers.filter(h => { return !(actions.includes(h)) })

        headers.forEach((h, i) => {
            if (h === '患者ID' || h === '主訴') {
                colHeaders.push({
                    data: h,
                })
            } else {
                colHeaders.push({
                    data: h,
                    type: 'dropdown',
                    source: sources[h]
                })
            }
        })

        actions.forEach(a => {
            if (a === 'CHECKBOX') {
                headers.unshift()
                colHeaders.unshift({
                    data: a,
                    renderer: checkBoxRenderer
                })
            } else {
                headers.unshift('')
                colHeaders.unshift({
                    data: a,
                    renderer: a === 'EDIT' ? editRenderer : removeRenderer
                })
            }
        })

        resolve()
    })
}

async function updateTable(data) {
    Object.assign(updateSettings, {
        data: data
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`
}

function createTable(data) {
    console.log(data)
    let isInitiate = data
    if (!isInitiate) {
        let defaultData = [{
            "患者ID": "",
            "グループID": "",
            "性別": "",
            "続柄": "",
            "主訴": ""
        }]
        // let defaultData = ['患者ID', 'グループ名', '性別', '続柄', '主訴']
        data = defaultData
    }

    hotContainer.innerHTML = ''

    let actions = ['REMOVE', 'EDIT', 'CHECKBOX']
    data.forEach((d, i)=> {
        actions.forEach(a => {
            if (a === 'CHECKBOX') {
                d[a] = false
            } else {
                d[a] = ''
            }
        })
    })

    headers = Object.keys(data[0])
    existingHeaders = headers

    let sources = {
        '性別': ['男性', '女性', 'その他', '不明'],
        'グループID': ['00jchds', '20jchzx', '30jchbp'],
        '続柄': ['発端者', '父親', '親', '兄弟姉妹', 'その他']
    }

    headers = headers.filter(h => { return !(actions.includes(h)) })

    headers.forEach((h, i) => {
        if (h === '患者ID' || h === '主訴') {
            colHeaders.push({
                data: h,
            })
        } else {
            colHeaders.push({
                data: h,
                type: 'dropdown',
                source: sources[h]
            })
        }
    })

    actions.forEach(a => {
        if (a === 'CHECKBOX') {
            headers.unshift(`<input type="checkbox" class="header-checkbox" ${isAllChecked ? 'checked' : ''}>`)
            colHeaders.unshift({
                data: a,
                renderer: checkBoxRenderer
            })
        } else {
            headers.unshift('')
            colHeaders.unshift({
                data: a,
                renderer: a === 'EDIT' ? editRenderer : removeRenderer
            })
        }
    })

    updateSettings = {
        data: data,
        rowHeaders: true,
        colHeaders: headers,
        columns: colHeaders,
        height: 'auto',
        colWidths: 100,
        search: true,
        manualColumnMove: true,
        manualRowMove: true,
        contextMenu: true,
        allowRemoveColumn: true,
        licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
    }

    hot = new Handsontable(hotContainer, updateSettings)

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')
        search.query(event.target.value)
        hot.render()
    })

    Handsontable.dom.addEvent(hotContainer, 'mousedown', function (event) {
        if (event.target.nodeName == 'INPUT' && event.target.classList.contains('header-checkbox')) {
            event.stopPropagation()
        }
    })

    Handsontable.dom.addEvent(hotContainer, 'mouseup', event => {
        let element = event.target

        if (element.nodeName === 'INPUT' && element.classList.contains('header-checkbox')) {
            isAllChecked = !isAllChecked
            element.checked = isAllChecked
            hot.render()
        }
    })

    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`

    exportPlugin = hot.getPlugin('exportFile')
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
    add.type = 'hidden'
    add.dataset.type = ''

    for (let [key, value] of Object.entries(columns)) {
        value.forEach(v => {
            if (!(existingHeaders.includes(v.columnName)) && v.table) {
                let header = document.createElement('div')
                header.innerText = v.columnName
                header.dataset.type = v.type
                header.onclick = () => {
                    $('.selected_add_header').removeClass('selected_add_header')
                    header.classList.add('selected_add_header')
                    add.value = v.columnName
                }
                container.appendChild(header)
            } 
        })
    }

    container.appendChild(add)

    document.querySelector('.add').onclick = () => {
        let headers = hot.getColHeader()
        let index = headers.indexOf(`${add.value} <i class="material-icons-outlined sort_icon">unfold_less</i>`)

        if (index > -1) {
            let hiddenIndex = hiddenColumns.indexOf(index)
            if (hiddenIndex > -1) hiddenColumns.splice(hiddenIndex, 1)
        }

        existingHeaders.push(add.value)

        Object.assign(updateSettings, {
            hiddenColumns: {columns: hiddenColumns}
        })

        hot.updateSettings(updateSettings)
        hot.render()

        modal.style.display = 'none'
    }
}