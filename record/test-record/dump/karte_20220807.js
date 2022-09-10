let hot, exportPlugin, movePlugin
let isAllChecked = true
let toSave = false

let headers = [], colHeaders = [], existingHeaders = [], hiddenColumns = []
let dataSchema = {}, dataColumns = {}, contentData = []

let hotContainer = document.getElementById('myGrid')

let updateSettings = {
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    colWidths(i) {
        return  i < 3 ? 43 : 100
    },
    search: true,
    data: contentData,
    manualColumnMove: true,
    manualColumnResize: true,
    manualRowMove: true,
    contextMenu: true,
    allowRemoveColumn: true,
    columnSorting: {
        indicator: false,
        sortEmptyCells: false
    },
    outsideClickDeselects: false,
    selectionMode: 'multiple',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
}

initiateTable()

async function initiateTable() {
    await createColumns()

    Object.assign(updateSettings, {
        data: [],
        dataSchema: dataSchema,
        colHeaders: colHeaders,
        columns: headers,
        hiddenColumns: {columns: hiddenColumns},
    })

    hot = new Handsontable(hotContainer, updateSettings)
    exportPlugin = hot.getPlugin('exportFile')
    movePlugin = hot.getPlugin('manualRowMove')

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')
        search.query(event.target.value, (instance, row, col, data, testResult) => {
            instance.getCellMeta(row, col).isSearchResult = testResult
            if (!testResult) return 
            movePlugin.moveRows([row], 0)
        })

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

        updateTable(object.PATIENTS)
    })
    reader.readAsText(event.target.files[0])
}

function getExportData(isAll) {
    let type = document.getElementById(isAll ? 'dl-all-select' : 'dl-table-select').value
    let exportedString = exportPlugin.exportAsString('csv', {
        bom: false,
        columnDelimiter: '\t',
        columnHeaders: true,
        exportHiddenColumns: isAll,
        exportHiddenRows: isAll,
        rowHeaders: false,
        fileExtension: 'tsv'
    })

    let dlData = convertCSVToJSON(exportedString, true)

    if (isAll) dlData = contentData

    if (type === 'json') exportedString = dlData
    if (type === 'csv' || type === 'tsv') exportedString = Papa.unparse(dlData.PATIENTS)

    exportFile()

    function exportFile() {
        let a = document.createElement('a')
        a.download = `patients_${Date.now()}.${type}`
        a.style.visibility = 'hidden'
    
        let data = `text/json;charset=utf-8,` +
                   `${encodeURIComponent(JSON.stringify(exportedString, null, 4))}`
        a.href = `data:${data}`
    
        if (type === 'csv' || type === 'tsv') {
            let data = new Blob(['\ufeff' + exportedString], { type: 'text/csv;charset=utf-8;' })
            a.href = URL.createObjectURL(data)
        }
    
        document.body.appendChild(a)
        a.click()
        a.remove()
    }
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

            let headerText = isExport ? headers[i].replace(' <i class="material-icons-outlined sort_icon">unfold_less</i>', '') : headers[i]
            data[headerText] = d[i]
        }
        if (Object.keys(data).length > 0) patientsData.push(data)
    })

    return { PATIENTS: patientsData }
}

function createColumns() {
    // headers = columns (settings - type, options, renderer, etc)
    // colHeaders = headers
    return new Promise((resolve, reject) => {
        let defaultColumns = ['主訴', '続柄', '性別', 'グループID', '患者ID']
        let actions = ['REMOVE', 'EDIT', 'CHECKBOX']

        for (let [key, value] of Object.entries(columns)) {
            console.log(key, value)
            value.forEach(v => {
                let colHeader = `${v.columnName} <i class="material-icons-outlined sort_icon">unfold_less</i>`

                let column = {
                    data: v.columnName,
                    type: v.type,
                    source: v.options
                }
                if (v.type === 'date') {
                    // column.dateFormat = 'YYYY/MM/DD',
                    column.dateFormat = 'MM/DD/YYYY',
                    column.correctFormat = true
                }

                if (defaultColumns.includes(v.columnName)) {
                    colHeaders.push(colHeader)
                    headers.push(column)
                    existingHeaders.push(v.columnName)
                }

                dataColumns[v.columnName] = {
                    colHeader: colHeader,
                    column: column
                }
                dataSchema[v.columnName] = null
            })
        }

        actions.forEach(a => {
            let colHeaderText = ''
            let headerText = {
                data: 'PCFNo',
                renderer: a === 'EDIT' ? editRenderer : removeRenderer
            }

            if (a === 'CHECKBOX') {
                colHeaderText = `<input type="checkbox" class="header-checkbox" ${isAllChecked ? 'checked="checked"' : ''}>`
                headerText.renderer = checkBoxRenderer
            }

            headers.unshift(headerText)
            colHeaders.unshift(colHeaderText)
        })

        for (let i = actions.length + defaultColumns.length; i < headers.length; i++) {
            hiddenColumns.push(i)
        }

        resolve()
    })
}

async function updateTable(data) {
    console.log('update table', data)

    data.map(d => contentData.push(d))

    Object.assign(updateSettings, {
        data: contentData
    })

    // contentData = data

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()} Patients`
}

function addRow() {
    // let temp = structuredClone(newData)
    // generate new pcf no
    // temp.PCFNo = 'PCF0001'
    // contentData.push(temp)
    contentData.push(newData)
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
        // headers = columns (settings - type, options, renderer, etc)
        // colHeaders = headers

        let newCol = dataColumns[add.value]
        existingHeaders.push(add.value)
        colHeaders.push(newCol.colHeader)
        headers.push(newCol.column)

        Object.assign(updateSettings, {
            colHeaders: colHeaders,
            columns: headers
        })

        hot.updateSettings(updateSettings)
        hot.render()


        modal.style.display = 'none'
    }
}

function editTable() {
    if (!confirm('保存しますか？')) return resetData()

    if (Object.keys(changedData).length === 0) {
        let elements = document.querySelectorAll(`.tab-wrap input, .tab-wrap select, .tab-wrap textarea`)
        elements.forEach(e => {
            console.log(e.dataset.columnname)
            // changedData[e.dataset.columnName] = e.value
        })

        // let tempData = structuredClone(changedData)
        contentData.push(changedData)
        Object.assign(updateSettings, {
            data: contentData
        })
        // console.log(changedData)
        hot.updateSettings(updateSettings)
        hot.render()
        resetData()
        return
    }

    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
    console.log('edit table', changedData)
    
    for (let [k, v] of Object.entries(changedData)) {
        patientData[k] = v
    }

    hot.render()
    resetData()

    function resetData() {
        currentPatient = ''
        changedData = {}
    }
}