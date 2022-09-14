let hot, exportPlugin, movePlugin
let isAllChecked = true
let toSave = false
let count = 1

let headers = [], colHeaders = [], existingHeaders = [], hiddenColumns = [], customColumns = []
let dataSchema = {}, dataColumns = {}
let groupOptions = [], patientOptions = []

let contentData = []

let hotContainer = document.getElementById('myGrid')

let updateSettings = {
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    // colWidths(i) {
    //     return i < 2 ? 43 : 100
    //     // return i < 2 ? 43 : null
    // },
    autoColumnSize: {
    	useHeaders: true
    },
    hiddenRows: {
        rows: []
    },
    fixedColumnsLeft: 2,
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
        hiddenColumns: { columns: hiddenColumns }
    })

    hot = new Handsontable(hotContainer, updateSettings)
    exportPlugin = hot.getPlugin('exportFile')
    movePlugin = hot.getPlugin('manualRowMove')
    // hidePlugin = hot.getPlugin('hiddenRows')

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')
        let searchResult = [], hideRows = []
        search.query(event.target.value, (instance, row, col, data, testResult) => {
            instance.getCellMeta(row, col).isSearchResult = testResult
            if (!testResult) return
            // searchResult.push(row)
            movePlugin.moveRows([row], 0)
        })

        // for(let i = 0; i < hot.countRows(); i++) {
        //     if (!(searchResult.includes(i))) hideRows.push(i)
        // }

        // hidePlugin.hideRows(hideRows)

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

    updateTable([])

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`
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

function getExportData() {
    let type = document.getElementById('dl-select').value
    let isAll = type === 'json'

    if (!isAll) {
        alert('Only the data in the table will be downloaded.')
    }

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

    if (type === 'json') exportedString = { 'PATIENTS': dlData }
    if (type === 'csv' || type === 'tsv') exportedString = Papa.unparse(dlData.PATIENTS)

    exportFile()
    exportFile(type, file)

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

// function exportFile() {
//     let a = document.createElement('a')
//     a.download = `patients_${Date.now()}.${type}`
//     a.style.visibility = 'hidden'

//     let data = `text/json;charset=utf-8,` +
//         `${encodeURIComponent(JSON.stringify(exportedString, null, 4))}`
//     a.href = `data:${data}`

//     if (type === 'csv' || type === 'tsv') {
//         let data = new Blob(['\ufeff' + exportedString], { type: 'text/csv;charset=utf-8;' })
//         a.href = URL.createObjectURL(data)
//     }

//     document.body.appendChild(a)
//     a.click()
//     a.remove()
// }

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

        if (fileType === 'text/csv' || fileType === 'text/tab-separated-values') {
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
        headers: true,
        delimiter: ''
    })

    let patientsData = []
    let data = json.data
    let notIncluded = [0, 1]
    let headers = data[0]

    data.forEach((d, idx) => {
        let data = {}
        for (let i = 0; i < d.length; i++) {
            if (isExport) {
                if (notIncluded.includes(i)) continue
            }

            if (idx === 0) continue

            let headerText = isExport ? headers[i].replace('<i class="material-icons-outlined sort_icon">swap_vert</i>', '') : headers[i]
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
        let defaultColumns = ['主訴', 'グループ名', '続柄', '性別', '家族ID', '患者ID']
        // let actions = ['REMOVE', 'EDIT', 'CHECKBOX']
        let actions = ['REMOVE', 'EDIT']

        for (let [key, value] of Object.entries(columns)) {
            console.log(key, value)
            value.forEach(v => {
                let colHeader = `<i class="material-icons-outlined sort_icon">swap_vert</i>${v.columnName}`

                let column = {
                    data: v.columnName,
                    type: v.type,
                    source: v.options,
                    strict: true,
                    allowInvalid: false,
                    readOnly: false
                }

                if (v.type === 'date') {
                    column.dateFormat = 'YYYY/MM',
                        column.correctFormat = true
                    column.datePickerConfig = {
                        firstDay: 0,
                        numberOfMonths: 1,
                        licenseKey: 'non-commercial-and-evaluation',
                    }
                }

                if (v.columnName === 'グループ名') {
                    column.source = groupOptions
                    column.allowInvalid = true
                    column.strict = false
                } else if (v.columnName === '続柄') {
                    column.data = '続柄'
                    column.renderer = 'dropdown'
                } else if (key === '遺伝子型情報' || v.columnName === '主訴') {
                    column.renderer = multipleRenderer
                    column.editor = false
                } else if (v.columnName === '身長') {
                    column.editor = false
                    column.data = `身体情報`
                    column.renderer = heightRenderer
                } else if (v.columnName === '体重') {
                    column.editor = false
                    column.data = `身体情報`
                    column.renderer = weightRenderer
                } else if (v.columnName === '頭囲') {
                    column.editor = false
                    column.data = `身体情報`
                    column.renderer = headRenderer
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

                let colName = v.columnName === '身長' || v.columnName === '体重' || v.columnName === '頭囲' ? '身体情報' : v.columnName

                dataSchema[colName] = null
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
    data.map(d => {
        d['relationship'] = d['RelatedTo'] ? `${d['続柄']}<br>(${d['RelatedTo']})` : d['続柄']
        contentData.push(d)
    })

    Object.assign(updateSettings, {
        data: contentData
    })

    localStorage.contentData = contentData

    contentData.map(d => {
        let groupId = d['グループ名']
        if (groupId && !(groupOptions.includes(groupId))) groupOptions.push(groupId)

        let patientId = d['患者ID']
        if (patientId && !(patientOptions.includes(patientId))) patientOptions.push(patientId)
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`

    // populateGroups()
}

function addRow(data) {
    // let temp = structuredClone(newData)
    let temp = JSON.parse(JSON.stringify(newData))

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`

    temp.PCFNo = pcfNo

    temp['患者ID'] = `P${count.toString().padStart(7, 0)}`
    count++

    if (data) {
        for (let [k, v] of Object.entries(data)) {
            temp[k] = v
        }
    }

    updateTable([temp])
    hot.scrollViewportTo(hot.countRows() - 1, 1)
}

function addColumn() {
    let modal = document.querySelector('.modal')

    modal.style.display = 'block'

    document.querySelector('.close_modal').onclick = () => {
        closeAddColumnModal()
    }

    modal.onclick = (e) => {
        if (!e.target.closest('.modal_content')) closeAddColumnModal()
    }

    let add = document.getElementById('add_column_input')
    add.value = ''

    let container = document.querySelector('#modal_container')
    container.innerHTML = ''

    for (let [key, value] of Object.entries(columns)) {
        createColumn(key, 'title')
        value.forEach(v => {
            if (!v.table) return
            createColumn(v.columnName, v.type)
        })
    }

    if (customColumns.length > 0) createColumn('カスタム', 'title')

    customColumns.forEach(c => {
        createColumn(c, 'custom')
    })

    function createColumn(colName, type) {
        if (type === 'title') {
            container.innerHTML += `<div class="add_column_title">${colName}</div>`
        } else {
            container.innerHTML += `
                <div>
                    <input  type="checkbox"
                            class="modal_add_columns"
                            id="${colName}"
                            data-type="${type}"
                            onchange="showHideColumn(this)"
                            ${existingHeaders.includes(colName) ? 'checked' : ''}>
                    <label for="${colName}">${colName}</label>
                    ${type === 'custom' ? `<i class="material-icons-outlined" onclick="removeCustomColumn(${colName})">delete</i>` : ''}
                </div>
            `
        }
    }

    document.querySelector('.add').onclick = () => {
        // headers = columns (settings - type, options, renderer, etc)
        // colHeaders = headers
        if (add.value === '') return

        let colHeader = `<i class="material-icons-outlined sort_icon">swap_vert</i>${add.value} `

        let column = {
            data: add.value,
            type: 'text'
        }

        dataSchema[add.value] = null
        dataColumns[add.value] = {
            colHeader: colHeader,
            column: column
        }
        colHeaders.push(colHeader)

        headers.push(column)
        existingHeaders.push(add.value)
        customColumns.push(add.value)
        createColumn(add.value, 'custom')

        rerenderTable()

        modal.style.display = 'none'
        hot.scrollViewportTo('', existingHeaders.length - 1)
    }

    function closeAddColumnModal() {
        modal.style.display = 'none'
    }
}

function showHideColumn(e) {
    if (e.checked) {
        let col = dataColumns[e.id]

        existingHeaders.push(e.id)
        colHeaders.push(col.colHeader)
        headers.push(col.column)
    } else {
        colHeaders.splice(
            colHeaders.indexOf(`<i class="material-icons-outlined sort_icon">swap_vert</i>${e.id}`),
            1
        )

        headers = headers.filter(h => {return h.data !== e.id })
        // if (['体重', '身長', '頭囲'].includes(e.id)) {
            
        // } else {
        //     headers = headers.filter(h => {return h.data !== e.id })
        // }
        existingHeaders.splice(existingHeaders.indexOf(e.id), 1)
    }

    rerenderTable()
}

function removeCustomColumn(e) {
    // let element = document.getElementById(e)

    // delete dataSchema[e]
    // delete dataColumns[e]

    // customColumns.splice(customColumns.indexOf(e), 1)

    // element.checked = false
    // showHideColumn(element)

    // element.parentElement.remove()
    delete dataSchema[e.id]
    delete dataColumns[e.id]

    customColumns.splice(customColumns.indexOf(e.id), 1)

    e.checked = false
    showHideColumn(e)

    e.parentElement.remove()
}

function editTable(isSave) {
    if (!isSave) {
        // if (!confirm('保存しますか？'))
        return resetData()
    }

    // new patient
    if (!currentPatient) {
        let elements = document.querySelectorAll(`.tab-wrap input, .tab-wrap select, .tab-wrap textarea`)

        let newPatient = {}
        elements.forEach(e => {
            if (e.type === 'radio') {
                newPatient[e.dataset.columnname] = $(`input[name="${e.name}"]:checked`).val() || null
            } else {
                newPatient[e.dataset.columnname] = e.value
            }
        })

        addRow(newPatient)
        return
    }

    // existing patient
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]

    for (let [k, v] of Object.entries(changedData)) {
        patientData[k] = v
        if (k === 'RelatedTo') patientData['relationship'] = v === 'なし' ? patientData['続柄'] : `${patientData['続柄']}<br>(${patientData['RelatedTo']})`
    }

    resetGeneData()

    geneData.forEach(gd => {
        for (let [k, v] of Object.entries(gd)) {
            patientData[k].push(v)
        }
    })

    hot.render()
    resetData()

    function resetData() {
        currentPatient = ''
        changedData = {}
    }

    function resetGeneData() {
        let geneTypeInfo = columns['遺伝子型情報']
        geneTypeInfo.forEach(g => {
            patientData[g.columnName] = []
        })
    }
}

function rerenderTable() {
    Object.assign(updateSettings, {
        dataSchema: dataSchema,
        colHeaders: colHeaders,
        columns: headers
    })

    hot.updateSettings(updateSettings)
    hot.render()
}