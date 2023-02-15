let hot, exportPlugin

let lang = localStorage.lang === 'undefined' ? 'en' : localStorage.lang

setInitialLanguage()

let count
let toReset = true

// let defaultColumns = ['caseSolved', 'chiefComplaint', 'finalDiagnosis', 'clinicalDiagnosis', 'age', 'sex', 'group', 'relationship', 'familyId', 'patientId']
let defaultColumns = ['status', 'relationship', 'familyId', 'patientId']
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
    beforeColumnSort: (currentSortConfig, destinationSortConfigs) => {
        if (destinationSortConfigs.length > 0) {
            if (destinationSortConfigs[0].column < 2) return false
        }
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

    addRow()
    // updateTable(contentData)
    // document.getElementById('row_count').innerHTML = `${hot.countRows()}`
}

function createColumns() {
    return new Promise((resolve, reject) => {
        let colSequence = 2

        categories.forEach(category => {
            if (category.dataKey === 'phenotypicInfo') return

            category.columns.forEach(c => {
                let key = c.dataKey
                let colId = c.columnId
                let displayName = c['displayName'][lang] || c['displayName']['en']

                let options
                if (c.options) {
                    options = c['options'][lang].length > 0 ? c['options'][lang] : c['options']['en']
                }

                let colHeader = `<i class="material-icons-outlined sort_icon"></i>${displayName}`

                let column = {
                    data: colId,
                    type: c.type,
                    source: options,
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
                } else if (colId === 'm013_2' || colId === 'm013_3' || colId === 'm013_4') {
                    column.editor = false
                    column.data = 'm013'
                    switch (colId) {
                        case 'm013_2':
                            column.renderer = weightRenderer
                            break
                        case 'm013_3':
                            column.renderer = heightRenderer
                            break
                        case 'm013_4':
                            column.renderer = headRenderer
                            break
                    }
                }

                if (defaultColumns.includes(key)) {
                    colHeaders.push(colHeader)
                    columns.push(column)
                    existingColumns.push(colId)
                }

                dataColumns[colId] = {
                    colHeader: colHeader,
                    column: column,
                    sequence: colSequence
                }

                colSequence++

                let dsColId = key === 'bodyHeight' || key === 'bodyWeight' || key === 'headCircumference' ? 'm013' : colId

                dataSchema[dsColId] = null
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
        if (category.dataKey === 'phenotypicInfo') return

        createColumn(category['displayName'][lang], 'title', category['dataKey'])
        category.columns.forEach(c => {
            let displayName = c['displayName'][lang] || c['displayName']['en']
            if (c.table) createColumn(displayName, c.type, c['columnId'])
        })
    })

    if (customColumns.length > 0) createColumn('カスタム', 'title', 'カスタム')

    customColumns.forEach(c => {
        createColumn(c, 'custom', c)
    })

    function createColumn(colName, type, key) {
        if (type === 'custom') console.log(colName, `${existingColumns.includes(key)}`)
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
                            id="${key}"
                            data-type="${type}"
                            data-colname="${colName}"
                            onchange="showHideColumn(this)"
                            ${existingColumns.includes(key) ? 'checked' : ''}>
                    <label for="${key}">${colName}</label>
                    ${type === 'custom' ? `<i class="material-icons-outlined" onclick="removeCustomColumn(${colName})">delete</i>` : ''}
                </div>
            `
        }
    }

    document.querySelector('.add').onclick = () => {
        if (add.value === '') return

        let colHeader = `<i class="material-icons-outlined sort_icon"></i>${add.value}`

        let colId = `c${`${customColumns.length + 1}`.padStart(3, '0')}`

        let column = {
            data: colId,
            type: 'text'
        }

        dataSchema[colId] = null
        dataColumns[colId] = {
            colHeader: colHeader,
            column: column
        }
        colHeaders.push(colHeader)
        columns.push(column)
        existingColumns.push(colId)
        customColumns.push(add.value)
        createColumn(add.value, 'custom')

        contentData.map(c => c[colId] = null)

        rerenderTable()

        modal.style.display = 'none'
        hot.scrollViewportTo('', existingColumns.length - 1)
    }

    function closeAddColumnModal() {
        modal.style.display = 'none'
    }
}

function showHideColumn(e) {
    let colId = e.id

    if (e.checked) {
        let col = dataColumns[colId]

        existingColumns.push(colId)
        colHeaders.push(col.colHeader)
        columns.push(col.column)
        hot.scrollViewportTo('', existingColumns.length)
    } else {
        colHeaders.splice(colHeaders.indexOf(`<i class="material-icons-outlined sort_icon"></i>${e.dataset.colname}`), 1)

        if (['m013_2', 'm013_3', 'm013_4'].includes(colId)) {
            let renderer
            switch (colId) {
                case 'm013_2':
                    renderer = 'weightRenderer'
                    break
                case 'm013_3':
                    renderer = 'heightRenderer'
                    break
                case 'm013_4':
                    renderer = 'headRenderer'
                    break
            }

            columns.forEach((h, i) => {
                if (h.data !== 'm013') return
                if (h.renderer.name === renderer) headers.splice(i, 1)
            })
        } else {
            columns = columns.filter(h => { return h.data !== colId })
        }
        existingColumns.splice(existingColumns.indexOf(colId), 1)
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
    let temp = JSON.parse(JSON.stringify(newData))

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`

    temp.PCFNo = pcfNo

    let num = hot.countRows() + 1

    if (count) {
        temp['p001'] = `P${count.toString().padStart(7, 0)}`
    } else {
        temp['p001'] = `P${num.toString().padStart(7, 0)}`
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

async function updateTable(data, changeHeaders, customColumnsKey = null) {
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
    
                if (h === 'm013') {
                    let subIds = contentData[0]['m013']
                    if (subIds) {
                        Object.keys(subIds[0]).forEach(k => {
                            if (k !== 'm013_1') createColumn(k)
                        })
                    }
                } else {
                    createColumn(h)
                }
            })
        } else {
            newHeaders.forEach(h => {
                if (h === 'PCFNo' || h === 'm013') return
                if (!(Object.keys(dataColumns).includes(h))) createColumn(h, true, customColumnsKey[h])
            })
        }
    }

    function createColumn(h, isHidden, colName = '') {
        console.log(h)
        let headerTitle = `<i class=\"material-icons-outlined sort_icon\"></i>${colName}`
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
            customColumns.push(colName)
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
        let groupId = d['p004']
        if (groupId && !(groupOptions.includes(groupId))) groupOptions.push(groupId)

        let familyId = d['p002']
        if (familyId && !(familyOptions.includes(familyId))) familyOptions.push(familyId)
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`
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

        updateTable(object.PATIENTS, fileType, object.keyName)

        if (object.visibleColumns) {
            colHeaders.length = 2
            columns.length = 2
            existingColumns = []

            object.visibleColumns.forEach(vc => {
                colHeaders.push(dataColumns[vc]['colHeader'])
                columns.push(dataColumns[vc]['column'])
                existingColumns.push(vc)
            })

            rerenderTable()
        }
    })
    reader.readAsText(file)
}

function convertCSVToJSON(csv, isExport) {
    let json = Papa.parse(csv, {
        headers: true,
        delimiter: ''
    })

    let patientsData = []
    let data = json.data
    let notIncluded = [0, 1]
    let colHeadears = data[0]

    data.forEach((d, idx) => {
        let data = {}
        let growthChartData = {}

        if (idx > 0) data['PCFNo'] = d[0]

        for (let i = 0; i < d.length; i++) {
            if (isExport) {
                if (notIncluded.includes(i)) continue
            }

            if (idx === 0) continue

            let headerText = isExport ? colHeadears[i].replace('<i class="material-icons-outlined sort_icon"></i>', '') : colHeadears[i]
            let columnId = getColumnId(headerText)

            let value = d[i]

            if (['m013_2', 'm013_3', 'm013_4'].includes(columnId)) {
                if (isExport) {
                    if (contentData.length > 0) {
                        if (contentData.length > 0) {
                            let bodyInfo = contentData[idx - 1]['m013']
                            if (bodyInfo) {
                                value = bodyInfo[bodyInfo.length - 1][columnId]
                            } else {
                                value = ''
                            }
                        }     
                    }
                } else {
                    let subColumnId = columnId
                    columnId = 'm013'
                    growthChartData[subColumnId] = value
                    value = [growthChartData]
                }
            }

            data[isExport ? headerText : columnId] = value

        }

        if (Object.keys(data).length > 0) {
            patientsData.push(data)
        }
    })

    return { PATIENTS: patientsData }
}

function getColumnId(columnHeader) {
    let colId
    categories.forEach(category => {
        let col = category.columns?.filter(c => { return c.displayName[lang] == columnHeader })
        if (col && col.length > 0) return colId = col[0].columnId
    })

    if (!colId) colId = getKeyFromTranslation(elementTranslation, columnHeader)

    return colId || columnHeader

}

// function getColumnKey(v, lang) {
//     let columnKey
//     categories.forEach(category => {
//         let col = category.columns?.filter(c => { return c.displayName[lang] == v })
//         if (col && col.length > 0) return columnKey = col[0].columnId
//     })

//     if (!columnKey) columnKey = getKeyFromTranslation(elementTranslation, v)

//     return columnKey || v
// }

function getKeyFromTranslation(obj, val) {
    return Object.keys(obj).find(key => !(typeof obj[key] === 'object') ? obj[key] === val : getKeyFromTranslation(obj[key], val))
}

function getExportData() {
    let type = document.getElementById('dl-select').value
    let isAll = type === 'json'

    let dlData

    if (isAll) {
        dlData = contentData
    } else {
        alert('Only the data in the table will be downloaded.')

        let exportedString = exportPlugin.exportAsString('csv', {
            bom: false,
            columnDelimiter: '\t',
            columnHeaders: true,
            exportHiddenColumns: isAll,
            exportHiddenRows: isAll,
            rowHeaders: false,
            fileExtension: 'tsv'
        })
    
        dlData = convertCSVToJSON(exportedString, true)
    }

    if (type === 'json') exportedString = getJSONDownload(dlData)
    if (type === 'csv') exportedString = Papa.unparse(dlData.PATIENTS)
    if (type === 'tsv') exportedString = Papa.unparse(dlData.PATIENTS, { delimiter: '\t' })

    exportFile(type, exportedString)

    function getJSONDownload(dlData) {
        let jsonResult = {}
        let patientsData = [], visibleColumns = [], keyName = {}

        dlData.forEach((d, idx) => {
            let pData = {}
            for (let [k, v] of Object.entries(d)) {
                console.log(k.charAt(0))
                if (idx === 0 && k.charAt(0) === 'c') {
                    keyName[k] = getHeaderName(k)
                }

                if (k === 'm013') {
                    let tempV = []

                    v.forEach((gc, gcIdx) => {
                        let gcData = {}
                        for (let [gcK, gcV] of Object.entries(gc)) {
                            // if (gcIdx === 0) keyName[gcK] = getHeaderName(gcK)
                            gcData[gcK] = gcV
                        }

                        tempV.push(gcData)
                    })

                    v = tempV
                }

                pData[k] = v
            }

            patientsData.push(pData)
        })

        existingColumns.forEach(c => {
            visibleColumns.push(c)
        })

        jsonResult = {
            PATIENTS: patientsData,
            visibleColumns,
            keyName,
            lang
        }

        return jsonResult
    }

    function getHeaderName(k) {
        let header = dataColumns[k]
        if (header) {
            header = header.colHeader.replace('<i class="material-icons-outlined sort_icon"></i>', '')
        } else {
            if (k === 'm013' || k === 'm013_1') header = translate(k)
        }

        return header || k
    }
}

function downloadSample(type) {
    let sampleData
    let temp = JSON.parse(JSON.stringify(newData))

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`

    temp.PCFNo = pcfNo

    let num = hot.countRows() + 1
    temp['患者ID'] = `P${num.toString().padStart(7, 0)}`

    if (type === 'json') sampleData = { 'PATIENTS': [temp] }
    if (type === 'excel') sampleData = Papa.unparse([temp], { delimiter: '\t' })

    exportFile(type === 'json' ? type : 'tsv', sampleData)
}

function exportFile(type, file) {
    let a = document.createElement('a')
    a.download = `patients_${Date.now()}.${type}`
    a.style.visibility = 'hidden'

    let data = `text/json;charset=utf-8,` +
        `${encodeURIComponent(JSON.stringify(file, null, 4))}`
    a.href = `data:${data}`

    if (type === 'csv' || type === 'tsv') {
        let data = new Blob(['\ufeff' + file], { type: 'text/csv;charset=utf-8;' })
        a.href = URL.createObjectURL(data)
    }

    document.body.appendChild(a)
    a.click()
    a.remove()
}

function editTable(isSave) {
    toReset = true
    if (!isSave) {
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

        if (currentBodyData.length > 0) {
            newPatient['m013'] = []
            currentBodyData.forEach(bd => {
                newPatient['m013'].push(bd)
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

    function resetData() {
        currentPatient = ''
        changedData = {}
    }f
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

function changeLanguage() {
    $('ul#dropdown-language li').click((e) => {
        let newLang = e.target.dataset.lang
        // document.getElementById('dropdown-language').style.display = 'none'
        // console.log('clciked', document.getElementById('dropdown-language'))

        if (newLang === lang) return

        document.getElementById('selected-language-display').innerText = e.target.innerText
        localStorage.lang = newLang


        pageReload()
    })
}

function setInitialLanguage() {
    $(`.dropdown-menu-item[data-lang='${lang}']`).addClass('dropdown-selected')
    document.getElementById('selected-language-display').innerText = $('.dropdown-selected').text()

    document.getElementById('search_input').placeholder = translate('search_input')
    document.querySelector('#add-row span').innerText = translate('add-row')
    document.querySelector('#add-column span').innerText = translate('add-column')
    document.querySelector('#add_column_input').placeholder = translate('add-column-input')
    document.querySelector('.add').innerText = translate('add-column-button')

    changeLanguage()
    translateModal()

    function translateModal() {
        let container = document.getElementById('tab-wrap')
        container.innerHTML = ''

        let ul = document.createElement('ul')
        container.appendChild(ul)

        categories.forEach((category, i) => {
            let liClass = ['tab-btn']
            if (i === 0) liClass.push('show', 'tab-btn-first')
            if (i === categories.length - 1) liClass.push('tab-btn-last')

            let li = document.createElement('li')
            li.classList.add(...liClass)
            li.innerHTML += `
                        <i class="${category.iconClass}">${category.iconName}</i>
                        <span>${category['displayName'][lang] || category['displayName']['en']}</span>
                    `
            ul.appendChild(li)

            let divClass = ['tab-contents']
            if (i === 0) divClass.push('show')

            let div = document.createElement('div')
            div.classList.add(...divClass)
            container.appendChild(div)

            if (i === 2) {
                div.innerHTML = `
                    <p>${translate('phenotypic-info-search')}</p>
                    <div style="width:100%;margin: 20px auto 0px auto;">
                        <div class="search-box_wrapper" style="width:100%;">
                            <div id="search_box_form"></div>
                        </div>
                        <div class="search-ex">
                            <a href="#" id="ex_phenotypes">ex) {{ _('index_Sample') }}</a>
                        </div>
                    </div>
                `
                return
            } else if (i === 3) {
                div.innerHTML = `
                    <p>
                        <span id="genemodal_add" onclick="addGeneRow()">
                            <i class="material-icons-outlined">add_circle_outline
                            </i>
                            ${translate('add')}
                        </span>
                    </p>
                `

                geneContainer = document.createElement('div')
                geneContainer.id = 'geneModal'
                div.appendChild(geneContainer)
                
                return
            }

            let table = document.createElement('table')
            table.classList.add('form-table')
            if (i === 1) table.classList.add('treatment-table')
            if (i === 4) table.classList.add('family-table')
            table.innerHTML = `<tbody id="tbody_${category.dataKey}">`
            div.appendChild(table)

            if (i === 0) {
                createRow(`tbody_${category.dataKey}`,
                    {
                        columnId: 'PCFNo',
                        dataKey: 'PCFNo',
                        phenoKey: '',
                        type: 'display',
                        table: true,
                        displayName: {
                            en: 'PCF No.',
                            ja: 'PCF No.',
                            ko: 'PCF No.'
                        }
                    }
                )
            }

            category.columns.forEach(c => {
                if (c.dataKey === 'bodyWeight' || c.dataKey === 'bodyHeight' || c.dataKey === 'headCircumference') {
                    createTable(`tbody_${category.dataKey}`, 'm013')
                } else {
                    createRow(`tbody_${category.dataKey}`, c)
                }
            })
        })

        function createRow(parentId, c) {
            let parent = document.getElementById(parentId)

            let tr = document.createElement('tr')
            parent.appendChild(tr)

            let th = document.createElement('th')
            th.id = c.columnId
            th.innerText = c['displayName'][lang] || c['displayName']['en']
            tr.appendChild(th)

            let td = document.createElement('td')
            if (c.type === 'display') td.innerText = 'P20220600001'
            tr.appendChild(td)

            if (c.inputType === 'text' || c.inputType === 'input-select') {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = c.columnId
                input.dataset.columnname = c.columnId
                // input.placeholder = c['placeholder'][lang] || ''
                td.appendChild(input)

                if (c.inputType === 'input-select') {
                    let select = document.createElement('select')
                    select.id = c.dataKey === 'familyId' ? 'family_options' : 'group_options'
                    td.appendChild(select)

                    td.id = 'group_wrap'
                }
            } else if (c.inputType === 'select') {
                let select = document.createElement('select')
                select.name = c.columnId
                select.dataset.columnname = c.columnId
                td.appendChild(select)

                let option = document.createElement('option')
                option.value = ''
                option.innerText = translate('select')
                option.hidden = true
                select.add(option)

                let options = c.options.dataValue
                let optionLang = c['options'][lang].length > 0 ? c['options'][lang] : c['options']['en']
                options.forEach((o, i) => {
                    let option = document.createElement('option')
                    option.value = o
                    option.innerText = optionLang[i] 
                    select.add(option)
                })
            } else if (c.inputType === 'select-date') {
                let selectYear = document.createElement('select')
                selectYear.classList.add(`${c.columnId}_year`)
                selectYear.id = `${c.columnId}_year`
                selectYear.name = `${c.columnId}_year`
                selectYear.dataset.columnname = c.columnId
                td.appendChild(selectYear)

                let selectMonth = document.createElement('select')
                selectMonth.name = `${c.columnId}_month`
                selectMonth.id = `${c.columnId}_month`
                selectMonth.dataset.columnname = c.columnId
                td.appendChild(selectMonth)
            } else if (c.inputType === 'radio' || c.inputType === 'radio-input') {
                let options = c.options.dataValue
                let optionLang = c['options'][lang].length > 0 ? c['options'][lang] : c['options']['en']
                options.forEach((o, i) => {
                    td.innerHTML += `
                        <label for="${o}">
                            <input id="${o}" type="radio" name="${c.columnId}" value="${o}" checked="checked"
                                data-columnname="${c.columnId}">
                            ${optionLang[i]}
                        </label>
                    `
                })

                if (c.inputType === 'radio-input') {
                    let input = document.createElement('input')
                    input.classList.add('input-top')
                    input.type = 'text'
                    input.name = `${c.columnId}-list`
                    // input.placeholder = c['placeholder'][lang] || ''
                    td.appendChild(input)
                }
            } else if (c.inputType === 'textarea') {
                let textarea = document.createElement('textarea')
                textarea.cols = 30
                textarea.rows = 5
                textarea.name = c.columnId
                textarea.dataset.columnname = c.columnId
                // textarea.placeholder = c['placeholder'][lang] || ''
                td.appendChild(textarea)
            } else if (c.inputType === 'multiple-radio') {
                td.innerHTML = `
                    <label for="sporadic">
                        <input id="sporadic" type="radio" name="geneticList" value="Sporadic"
                            data-columnname="geneticList">Sporadic
                    </label>
                    <details>
                        <summary>
                            <label for="autosomal_dominant_inheritance">
                                <input id="autosomal_dominant_inheritance" type="radio" name="geneticList"
                                    value="Autosomal dominant inheritance"
                                    data-columnname="geneticList">Autosomal
                                dominant
                                inheritance
                            </label>
                        </summary>
                        <label for="sex_limited_autosomal_dominant">
                            <input id="sex_limited_autosomal_dominant" type="radio" name="geneticList"
                                value="Sex-limited autosomal dominant"
                                data-columnname="geneticList">Sex-limited
                            autosomal dominant
                        </label>
                        <label for="autosomal_dominant_somatic_cell_mutation">
                            <input id="autosomal_dominant_somatic_cell_mutation" type="radio"
                                name="geneticList" value="Autosomal dominant somatic cell mutation"
                                data-columnname="geneticList">
                            Autosomal
                            dominant somatic cell mutation
                        </label>
                        <label for="autosomal_dominant_contiguous_gene_syndrome">
                            <input id="autosomal_dominant_contiguous_gene_syndrome" type="radio"
                                name="geneticList" value="Autosomal dominant contiguous gene syndrome"
                                data-columnname="geneticList">
                            Autosomal
                            dominant contiguous gene syndrome
                        </label>
                    </details>
                    <label for="autosomal_recessive_inheritance">
                        <input id="autosomal_recessive_inheritance" type="radio" name="geneticList"
                            value="Autosomal recessive inheritance" data-columnname="geneticList">
                        Autosomal
                        recessive inheritance
                    </label>
                    <details>
                        <summary>
                            <label for="gonosomal_inheritance">
                                <input id="gonosomal_inheritance" type="radio" name="geneticList"
                                    value="Gonosomal inheritance" data-columnname="geneticList">Gonosomal
                                inheritance
                            </label>
                        </summary>
                        <label for="x_linked_inheritance">
                            <input id="x_linked_inheritance" type="radio" name="geneticList"
                                value="X-linked inheritance" data-columnname="geneticList">X-linked
                            inheritance
                        </label>
                        <label for="x_linked_dominant_inheritance">
                            <input id="x_linked_dominant_inheritance" type="radio" name="geneticList"
                                value="X-linked dominant inheritance" data-columnname="geneticList">X-linked
                            dominant inheritance
                        </label>
                        <label for="x_linked_recessive_inheritance">
                            <input id="x_linked_recessive_inheritance" type="radio" name="geneticList"
                                value="X-linked recessive inheritance"
                                data-columnname="geneticList">X-linked
                            recessive inheritance
                        </label>
                        <label for="y_linked_inheritance">
                            <input id="y_linked_inheritance" type="radio" name="geneticList"
                                value="Y-linked inheritance" data-columnname="geneticList">Y-linked
                            inheritance
                        </label>
                    </details>
                    <details>
                        <summary>
                            <label for="multifactorial_inheritance">
                                <input id="multifactorial_inheritance" type="radio" name="geneticList"
                                    value="Multifactorial inheritance"
                                    data-columnname="geneticList">Multifactorial
                                inheritance
                            </label>
                        </summary>
                        <label for="digenic_inheritance">
                            <input id="digenic_inheritance" type="radio" name="geneticList"
                                value="Digenic inheritance" data-columnname="geneticList">Digenic
                            inheritance
                        </label>
                        <label for="oligogenic_inheritance">
                            <input id="oligogenic_inheritance" type="radio" name="geneticList"
                                value="Oligogenic inheritance" data-columnname="geneticList">Oligogenic
                            inheritance
                        </label>
                        <label for="polygenic_inheritance">
                            <input id="polygenic_inheritance" type="radio" name="geneticList"
                                value="Polygenic inheritance" data-columnname="geneticList">Polygenic
                            inheritance
                        </label>
                    </details>
                    <label for="mitochondrialx_inheritance">
                        <input id="mitochondrialx_inheritance" type="radio" name="geneticList"
                            value="Mitochondrial inheritance" data-columnname="geneticList">Mitochondrial
                        inheritance
                    </label>
                `
            }
        }

        function createTable(parentId) {
            if (document.getElementById('bodyModal')) return

            let parent = document.getElementById(parentId)

            let tr = document.createElement('tr')
            parent.appendChild(tr)

            let th = document.createElement('th')
            th.id = 'm013'
            th.innerText = translate('m013')
            tr.appendChild(th)

            let td = document.createElement('td')
            td.innerHTML = `
                <span id="bodyModal_add" onclick="addBodyRow()">
                    <i class="material-icons-outlined">add_circle_outline</i>${translate('add')}</span>
            `
            bodyContainer = document.createElement('div')
            bodyContainer.id = 'bodyModal'
            td.appendChild(bodyContainer)
            
            tr.appendChild(td)
        }
    }
}

function translate(word) {
    if (!elementTranslation[word]) return null

    if (elementTranslation[word][lang]) {
        return elementTranslation[word][lang]
    } else {
        return elementTranslation[word]['en']
    }
}