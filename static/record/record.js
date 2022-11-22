let hot, exportPlugin

// let lang = 'ja'
let lang = 'en'
let count

// let defaultColumns = ['診断状況', '主訴', '確定診断', '臨床診断', '年齢', '性別', 'グループ名', '続柄', '家族ID', '患者ID']
let defaultColumns = ['caseSolved', 'chiefComplaint', 'finalDiagnosis', 'clinicalDiagnosis', 'age', 'sex', 'group', 'relationship', 'familyId', 'patientId']
let actions = ['REMOVE', 'EDIT']

// columns = HOT columns (settings - type, options, renderer, etc) HEADERS
// colHeaders = HOT headers
let colHeaders = [], columns = []
let existingColumns = [], hiddenColumns = [], customColumns = []

// dataSchema = HOT dataSchema
// dataColumn = columns + colHeaders
let dataSchema = {}, dataColumns = {}

// contentData = HOT data
let contentData = []
let groupOptions = [], familyOptions = []

const hotContainer = document.getElementById('myGrid')

let updateSettings = {
    width: '100%',
    height: '100%',
    rowHeaders: true,
    rowHeights: 30,
    defaultRowHeight: 30,
    autoRowSize: true,
    hiddenColumns: true,
    fixedColumnsLeft: 2,
    search: true,
    manualColumnMove: true,
    manualColumnResize: true,
    manualRowMove: true,
    contextMenu: true,
    allowRemoveColumn: true,
    columnSorting: {
        indicator: true,
        sortEmptyCells: false
    },
    filters: true,
    dropdownMenu: true,
    outsideClickDeselects: false,
    licenseKey: '17bfa-714c9-a7430-c4321-87c56'
}

window.onload = async () => {
    await createColumns()

    Object.assign(updateSettings, {
        data: contentData,
        dataSchema: dataSchema,
        colHeaders: colHeaders,
        columns: columns,
        hiddenColumns: { columns: hiddenColumns }
    })

    hot = new Handsontable(hotContainer, updateSettings)
    exportPlugin = hot.getPlugin('exportFile')

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        const search = hot.getPlugin('search')

        const queryResult = search.query(event.target.value)
        const totalIndexes = Array.from(Array(hot.countRows()).keys())
        let matching = queryResult.map(obj => obj.row)

        hot.updateSettings({ hiddenRows: { rows: totalIndexes } })

        if (event.target.value === '') hot.updateSettings({ hiddenRows: { rows: [] }})
        
        hot.getPlugin('HiddenRows').showRows(matching)
        hot.render()
    })

    document.getElementById('search_input').addEventListener('search', function(event) {
        if (event.target.value === '') hot.updateSettings({ hiddenRows: { rows: [] }})
        hot.render()
    })

    Handsontable.dom.addEvent(hotContainer, 'mousedown', function (event) {
        if (event.target.nodeName == 'INPUT' && event.target.classList.contains('header-checkbox')) event.stopPropagation()
    })

    Handsontable.dom.addEvent(hotContainer, 'mouseup', event => {
        let element = event.target

        if (element.nodeName === 'INPUT' && element.classList.contains('header-checkbox')) {
            isAllChecked = !isAllChecked
            element.checked = isAllChecked
            hot.render()
        }
    })

    updateTable(contentData)

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`
}

function createColumns() {
    return new Promise((resolve, reject) => {
        let colSequence = 2

        categories.forEach(category => {
            console.log(category)

            category.columns.forEach(c => {
                let key = c.dataKey

                let colHeader = `<i class="material-icons-outlined sort_icon"></i>${c['displayName'][lang]}`

                let column = {
                    data: c.dataKey,
                    type: c.type,
                    source: c.options,
                    strict: true,
                    allowInvalid: false,
                    readOnly: false
                }

                if (c.type === 'date') {
                    column.dateFormat = 'YYYY/MM',
                    column.correctFormat = true
                    column.datePickerConfig = {
                        firstDay: 0,
                        numberOfMonths: 1,
                        licenseKey: 'non-commercial-and-evaluation',
                    }
                }

                if (key === 'group' || key === 'familyId') {
                    column.allowInvalid = true
                    column.strict = false
                    column.source = groupOptions
                    if (key === 'familyId') column.source = familyOptions
                } else if (category['dataKey'] === 'geneInfo' || key === 'chiefComplaints') {
                    column.renderer = multipleRenderer
                    if (category['dataKey'] === 'geneInfo') column.editor = false
                } else if (key === 'bodyHeight' || key === 'bodyWeight' || key === 'headCircumference') {
                    column.editor = false
                    column.data = `growthChart`
                    switch (key) {
                        case 'bodyHeight':
                            column.renderer = heightRenderer
                            break
                        case 'bodyWeight':
                            column.renderer = weightRenderer
                            break
                        case 'headCircumference':
                            column.renderer = headRenderer
                            break
                    }
                }

                if (defaultColumns.includes(key)) {
                    colHeaders.push(colHeader)
                    columns.push(column)
                    existingColumns.push(key)
                }

                dataColumns[key] = {
                    colHeader: colHeader,
                    column: column,
                    sequence: colSequence
                }

                colSequence++

                let colName = key === 'bodyHeight' || key === 'bodyWeight' || key === 'headCircumference' ? 'growthChart' : key

                dataSchema[colName] = null
            })
        })

        actions.forEach(a => {
            let colHeader = ''
            let column = {
                data: 'PCFNo',
                renderer: a === 'EDIT' ? editRenderer : removeRenderer
            }

            if (a === 'CHECKBOX') {
                colHeader = `<input type="checkbox" class="header-checkbox" ${isAllChecked ? 'checked="checked"' : ''}>`
                column.renderer = checkBoxRenderer
            }

            columns.unshift(column)
            colHeaders.unshift(colHeader)
        })

        for (let i = actions.length + defaultColumns.length; i < columns.length; i++) {
            hiddenColumns.push(i)
        }

        resolve()
    })
}

function addColumn() {
    let modal = document.querySelector('.modal')

    modal.style.display = 'block'

    modal.onclick = (e) => {
        if (!e.target.closest('.modal_content')) closeAddColumnModal()
    }

    let add = document.getElementById('add_column_input')
    add.value = ''

    let container = document.querySelector('#modal_container')
    container.innerHTML = ''

    categories.forEach(category => {
        createColumn(category['displayName'][lang], 'title', category['dataKey'])
        category.columns.forEach(c => {
            if (c.table) createColumn(c['displayName'][lang], c.type, c['dataKey'])
        })
    })

    if (customColumns.length > 0) createColumn('カスタム', 'title', 'カスタム')

    customColumns.forEach(c => {
        createColumn(c, 'custom', c)
    })

    function createColumn(colName, type, key) {
        if (type === 'title') {
            let icon

            switch (key) {
                case 'patientInfo':
                    icon = '<i class="bxt icon material-icons-outlined"> person</i>'
                    break
                case 'medicalInfo':
                    icon = '<i class="material-symbols-outlined">medical_information</i>'
                    break
                case 'phenoTypicInfo':
                    icon = '<i class="material-symbols-outlined">dns</i>'
                    break
                case 'geneInfo':
                    icon = '<i class="icon-omim2"></i>'
                    break
                case 'familyInfo':
                    icon = '<i class="material-symbols-outlined">diversity_3</i>'
                    break
                case 'カスタム':
                    icon = '<i class="material-symbols-outlined">category</i>'
                    break
            }
            container.innerHTML += `<div class="add_column_title">${icon}${colName}</div>`
        } else {
            container.innerHTML += `
                <div>
                    <input  type="checkbox"
                            class="modal_add_columns"
                            id="${colName}"
                            data-type="${type}"
                            data-key="${key}"
                            onchange="showHideColumn(this)"
                            ${existingColumns.includes(key) ? 'checked' : ''}>
                    <label for="${colName}">${colName}</label>
                    ${type === 'custom' ? `<i class="material-icons-outlined" onclick="removeCustomColumn(${colName})">delete</i>` : ''}
                </div>
            `
        }
    }

    document.querySelector('.add').onclick = () => {
        if (add.value === '') return

        let colHeader = `<i class="material-icons-outlined sort_icon"></i>${add.value}`

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
        columns.push(column)
        existingColumns.push(add.value)
        customColumns.push(add.value)
        createColumn(add.value, 'custom')

        contentData.map(c => c[add.value] = null)

        rerenderTable()

        modal.style.display = 'none'
        hot.scrollViewportTo('', existingColumns.length - 1)
    }

    function closeAddColumnModal() {
        modal.style.display = 'none'
    }
}

function showHideColumn(e) {
    let key = e.dataset.key

    if (e.checked) {
        let col = dataColumns[key]

        existingColumns.push(e.id)
        colHeaders.push(col.colHeader)
        columns.push(col.column)
    } else {
        colHeaders.splice(colHeaders.indexOf(`<i class="material-icons-outlined sort_icon"></i>${e.id}`), 1)

        if (['bodyWeight', 'bodyHeight', 'headCircumference'].includes(key)) {
            let renderer
            switch (key) {
                case 'bodyWeight':
                    renderer = 'weightRenderer'
                    break
                case 'bodyHeight':
                    renderer = 'heightRenderer'
                    break
                case 'headCircumference':
                    renderer = 'headRenderer'
                    break
            }

            columns.forEach((h, i) => {
                if (h.data !== 'growthChart') return
                if (h.renderer.name === renderer) headers.splice(i, 1)
            })
        } else {
            columns = columns.filter(h => { return h.data !== key })
        }
        existingColumns.splice(existingColumns.indexOf(key), 1)
    }

    rerenderTable()
}

function removeCustomColumn(e) {
    delete dataSchema[e.id]
    delete dataColumns[e.id]

    customColumns.splice(customColumns.indexOf(e.id), 1)

    e.checked = false
    showHideColumn(e)

    e.parentElement.remove()
}

function addRow(data) {
    // let temp = structuredClone(newData)
    let temp = JSON.parse(JSON.stringify(newData))

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`

    temp.PCFNo = pcfNo

    let num = hot.countRows() + 1

    if (count) {
        temp['patientId'] = `P${count.toString().padStart(7, 0)}`
    } else {
        temp['patientId'] = `P${num.toString().padStart(7, 0)}`
        count = num
    }

    count++

    if (data) {
        for (let [k, v] of Object.entries(data)) {
            temp[k] = v
        }
    }

    updateTable([temp])
    hot.scrollViewportTo(hot.countRows() - 1, 1)
}

async function updateTable(data, changeHeaders) {
    data.map(d => {
        contentData.push(d)
    })

    if (contentData.length > 0) {
        let newHeaders = Object.keys(data[0])

        if (changeHeaders  === 'text/csv' || changeHeaders === 'text/tab-separated-values') {
            columns.splice(2, columns.length)
            colHeaders.splice(2, colHeaders.length)
            existingColumns = []
            customColumns = []
    
            newHeaders.forEach(h => {
                if (h === 'PCFNo') return
    
                if (h === 'growthChart') {
                    createColumn('体重')
                    createColumn('身長')
                    createColumn('頭囲')
                } else {
                    createColumn(h)
                }
            })
        } else {
            newHeaders.forEach(h => {
                if (h === 'PCFNo' || h === 'growthChart') return
                if (!(Object.keys(dataColumns).includes(h))) createColumn(h, true)
            })
        }
    }

    function getColumnName(h) {

    }

    function createColumn(h, key, isHidden) {
        let headerTitle = `<i class=\"material-icons-outlined sort_icon\"></i>${h}`
        let headerData = {
            data: h,
            type: 'text',
            readOnly: false
        }

        let colData = dataColumns[h]
        if (colData) {
            headerTitle = colData['colHeader']
            headerData = colData['column']
        } else {
            customColumns.push(h)
            dataColumns[h] = {
                colHeader: headerTitle,
                column: headerData
            }
        }

        if (isHidden) return
 
        colHeaders.push(headerTitle)
        columns.push(headerData)
        existingColumns.push(h)
    }

    Object.assign(updateSettings, {
        data: contentData,
        colHeaders: colHeaders,
        columns: columns
    })

    contentData.map(d => {
        let groupId = d['group']
        if (groupId && !(groupOptions.includes(groupId))) groupOptions.push(groupId)

        let familyId = d['familyId']
        if (familyId && !(familyOptions.includes(familyId))) familyOptions.push(familyId)
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`

    // populateGroups()
}

function importFile(event) {
    let file = event.target.files[0]
    fileReader(file, file.type)
}

function onDragOver(event) {
    event.preventDefault()
    if (event.dataTransfer.length) event.dataTransfer.dropEffect = 'move'
}

function onDrop(event) {
    event.preventDefault()
    let file = event.dataTransfer.items[0].getAsFile()
    fileReader(file, file.type)
}

function fileReader(file, fileType) {
    let reader = new FileReader()
    reader.onload = (event => {
        let data = event.target.result
        let object

        if (fileType === 'text/csv' || fileType === 'text/tab-separated-values') {
            object = convertCSVToJSON(data)
        } else {
            object = JSON.parse(data)
        }

        updateTable(object.PATIENTS, fileType)

        if (object.visibleColumns) {
            colHeaders.length = 2
            headers.length = 2
            existingColumns = []

            object.visibleColumns.forEach(vc => {
                colHeaders.push(dataColumns[vc]['colHeader'])
                headers.push(dataColumns[vc]['column'])
                existingColumns.push(vc)
            })

            rerenderTable()
        }
    })
    reader.readAsText(file)
}

function editTable(isSave) {
    toReset = true
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
                let value = e.value
                if (e.dataset.columnname === 'birth' || e.dataset.columnname === 'death') {
                    let pre = e.dataset.columnname
                    value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
                }

                newPatient[e.dataset.columnname] = value
            }
        })

        if (geneData.length > 0) {
            let geneDataKeys = Object.keys(geneData[0])
            geneDataKeys.forEach(k => {
                newPatient[k] = []
            })

            geneData.forEach(gd => {
                for (let [k, v] of Object.entries(gd)) {
                    newPatient[k].push(v)
                }
            })
        }

        delete newPatient['undefined']
        addRow(newPatient)
        return
    }

    // existing patient
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]

    for (let [k, v] of Object.entries(changedData)) {
        patientData[k] = v
        // if (k === 'RelatedTo') patientData['relationship'] = v === 'なし' ? patientData['続柄'] : `${patientData['続柄']}<br>(${patientData['RelatedTo']})`
    }

    if (geneData.length > 0) {
        let geneDataKeys = Object.keys(geneData[0])
        geneDataKeys.forEach(k => {
            patientData[k] = []
        })

        geneData.forEach(gd => {
            for (let [k, v] of Object.entries(gd)) {
                patientData[k].push(v)
            }
        })
    }

    hot.render()
    resetData()
    // resetGeneData()

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
        columns: columns
    })

    hot.updateSettings(updateSettings)
    hot.render()
}

function beforeLoad() {
    if (contentData.length > 0) localStorage.contentData = JSON.stringify(contentData)
    return 'load'
}

function pageReload() {
    window.location.reload()
}