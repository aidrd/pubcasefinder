let hot, exportPlugin

let lang = localStorage.lang || 'en'
lang = lang === 'undefined' ? 'en' : lang

setInitialLanguage()

let count
let toReset = true

// let defaultColumns = ['caseSolved', 'chiefComplaint', 'finalDiagnosis', 'clinicalDiagnosis', 'case_sex', 'age', 'case_birth', 'lifeStatus', 'group', 'presenceOrAbsenceOfOnset', 'examinationDay', 'relationship', 'case_family_id', 'case_info']
let defaultColumns = [columnKeys.MEDICAL_CASE_SOLVED, columnKeys.MEDICAL_CHIEF_COMPLAINT, columnKeys.MEDICAL_FINAL_DIAGNOSIS, columnKeys.MEDICAL_CLINICAL_DIAGNOSIS, columnKeys.CASE_SEX, columnKeys.CASE_AGE, columnKeys.CASE_BIRTH, columnKeys.CASE_LIFE_STATUS, columnKeys.CASE_GROUP, columnKeys.CASE_PRESENCE_OR_ABSENCE_OF_ONSET, columnKeys.CASE_EXAMINATION_DAY, columnKeys.CASE_RELATIONSHIP, columnKeys.CASE_FAMILY_ID, columnKeys.CASE_ID]
// defaultColumns = [columnKeys.CASE_AGE, columnKeys.CASE_ID]
let actions = ['REMOVE', 'EDIT']
actions = ['EDIT', 'REMOVE']

// columns = HOT columns (settings - type, options, renderer, etc) HEADERS
// colHeaders = HOT headers
let colHeaders = [], columns = []
let existingColumns = [], hiddenColumns = [], customColumns = []
let customColumnCount = 0

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
    // rowHeights: 30,
    // defaultRowHeight: 30,
    // autoRowSize: true,
    autoColumnSize: true,
    hiddenColumns: true,
    fixedColumnsLeft: 2,
    search: true,
    manualColumnMove: true,
    manualColumnResize: true,
    manualRowMove: true,
    afterRowMove: (movedRows, finalIndex, dropIndex, movePossible, orderChanged) => {
        if (orderChanged) {
            let movedRow = movedRows[0]
            let tempArray = JSON.parse(JSON.stringify(contentData))

            if (finalIndex >= tempArray.length) {
                let x = finalIndex - tempArray.length + 1
                while (x--) {
                    tempArray.push(undefined)
                }
            }

            tempArray.splice(finalIndex, 0, tempArray.splice(movedRow, 1)[0])
            contentData = tempArray
        }

        return true
    },
    contextMenu: true,
    allowRemoveColumn: true,
    columnSorting: {
        indicator: true,
        sortEmptyCells: false
    },
    beforeColumnMove: (movedColumns, finalIndex) => {
        if (movedColumns[0] < 2 || finalIndex < 2) return false
    },
    afterColumnMove: (movedColumns, finalIndex, dropIndex, movePossible, orderChanged) => {
        if (orderChanged) {
            let movedColumn = movedColumns[0] - 2

            finalIndex -= 2
            let tempArray = JSON.parse(JSON.stringify(existingColumns))

            if (finalIndex >= tempArray.length) {
                let x = finalIndex - tempArray.length + 1
                while (x--) {
                    tempArray.push(undefined)
                }
            }

            tempArray.splice(finalIndex, 0, tempArray.splice(movedColumn, 1)[0])
            existingColumns = tempArray
        }
        return true
    },
    beforeColumnSort: (currentSortConfig, destinationSortConfigs) => {
        if (destinationSortConfigs.length > 0) {
            if (destinationSortConfigs[0].column < 2) return false
        }
    },
    beforeChange: (changes, type) => {
        if (type === 'edit') {
            changes.forEach(c => {
                let col = c[1]
                let newValue = c[3]

                if (!newValue) return

                if (col === columnKeys.CASE_FAMILY_ID) {
                    if (!(familyOptions.includes(newValue))) familyOptions.push(newValue)
                } else if (col === columnKeys.CASE_GROUP) {
                    if (!(groupOptions.includes(newValue))) groupOptions.push(newValue)
                }
            })
        }
    },
    afterGetRowHeader: (row, TH) => {
        TH.className = 'htMiddle'
    },
    beforeCopy: (data, coords) => {
        if (coords[0].startCol === 0 || coords[0].startCol === 1) return false
    },
    beforePaste: (data, coords) => {
        let totalRows = hot.countRows()
        let startRow = coords[0].startRow
        let copyLength = data.length
        let newTotalRows = startRow + copyLength

        if (newTotalRows > totalRows) {
            data.splice(totalRows - startRow - 1, newTotalRows - totalRows)
        }
    },
    filters: true,
    dropdownMenu: true,
    outsideClickDeselects: false,
    undo: true,
    redo: true,
    trimDropdown: false,
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

    function searchFunction(value) {
        const search = hot.getPlugin('search')

        const searchCallback = function (instance, row, col, data, testResult) {
            let element = instance.getCellMeta(row, col)

            if (testResult) {
                if (col === 1) {
                    element.isSearchResult = false
                } else {
                    element.isSearchResult = true
                }
            } else {
                element.isSearchResult = false
            }
        }

        //modified start by hzhang@bits
        //const queryResult = search.query(value, searchCallback)
        const queryResult = search.query(value, searchCallback, function (q, v) {

            if (typeof q == 'undefined' || q == null || !q.toLowerCase || q.length === 0 ||
                typeof v == 'undefined' || v == null) {
                return false;
            }

            if (typeof v === 'object' && Array.isArray(v)) {
                let ret = false;
                v.forEach(v_e => {
                    if (typeof v_e === 'object' && 'name_en' in v_e) {
                        let n_k = `name_${lang}`;
                        let n = n_k in v_e && v_e[n_k] ? v_e[n_k] : v_e['name_en'];
                        if (n.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
                            ret = true;
                        }
                    } else {
                        if (("" + v_e).toLowerCase().indexOf(("" + q).toLowerCase()) !== -1) {
                            ret = true;
                        }
                    }
                });

                return ret;
            }

            return v.toString().toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        //modified end by hzhang@bits

        const totalIndexes = Array.from(Array(hot.countRows()).keys())
        // let matching = queryResult.map(obj => obj.row)
        let matching = []
        queryResult.forEach(obj => {
            if (obj.col > 1) matching.push(obj.row)
        })

        let count = matching.length

        hot.updateSettings({ hiddenRows: { rows: totalIndexes } })

        if (value === '') {
            count = ''
            hot.updateSettings({ hiddenRows: { rows: [] } })
        }

        hot.getPlugin('HiddenRows').showRows(matching)
        hot.render()
        document.getElementById('search-result-count').innerHTML = count
    }

    Handsontable.dom.addEvent(document.getElementById('search_input'), 'keyup', (event) => {
        searchFunction(event.target.value)
    })

    document.getElementById('search_input').addEventListener('search', function (event) {
        if (event.target.value === '') {
            searchFunction('')
        }
    })

    document.getElementById('hot-undo').addEventListener('click', (e) => {
        hot.undo()

        enableDisableUndoRedo(e.target, hot.isUndoAvailable())
        enableDisableUndoRedo(document.getElementById('hot-redo'), hot.isRedoAvailable())
    })

    document.getElementById('hot-redo').addEventListener('click', (e) => {
        hot.redo()
        enableDisableUndoRedo(e.target, hot.isRedoAvailable())
        enableDisableUndoRedo(document.getElementById('hot-undo'), hot.isUndoAvailable())
    })

    Handsontable.dom.addEvent(hotContainer, 'mousedown', function (event) {
        if (event.target.nodeName == 'INPUT' && event.target.classList.contains('header-checkbox')) event.stopPropagation()

        enableDisableUndoRedo(document.getElementById('hot-undo'), hot.isUndoAvailable())
        enableDisableUndoRedo(document.getElementById('hot-redo'), hot.isRedoAvailable())
    })

    Handsontable.dom.addEvent(hotContainer, 'mouseup', event => {
        let element = event.target

        if (element.nodeName === 'INPUT' && element.classList.contains('header-checkbox')) {
            isAllChecked = !isAllChecked
            element.checked = isAllChecked
            hot.render()
        }
    })

    function enableDisableUndoRedo(button, isEnabled) {
        if (isEnabled) {
            button.style.opacity = 1
        } else {
            button.style.opacity = 0.5
        }

    }

    addRow()
}

function createColumns() {
    return new Promise((resolve, reject) => {
        let colSequence = 2

        categories.forEach(category => {
            category.columns.forEach(c => {
                let colId = c.columnId
                let displayName = c['displayName'][lang] || c['displayName']['en']

                let dataSchemaColId = colId
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
                    readOnly: c.readOnly || false,
                    className: 'htMiddle'
                }

                if (c.type === 'date') {
                    column.dateFormat = c.dateFormat || 'YYYY/MM'
                    // column.correctFormat = true
                    column.datePickerConfig = {
                        dateFormat: c.dateFormat || 'DD/MM/YYYY',
                        firstDay: 0,
                        numberOfMonths: 1,
                        showMonthAfterYear: true,
                        licenseKey: 'non-commercial-and-evaluation',
                        keyboardInput: false,
                        // yearSuffix: '年',
                        // maxDate: new Date(),
                        yearRange: [1900, new Date().getFullYear()],
                    }
                    if (!c.includeDay) {
                        column.datePickerConfig.onDraw = function (datepicker) {
                            let close = document.createElement('span')
                            close.classList.add('pika-ok')
                            close.innerHTML = 'OK'

                            $(datepicker.el).find('table').addClass('hide')
                            $(datepicker.el).find('button').addClass('hide')

                            close.addEventListener('click', () => {
                                let year = $('.pika-select.pika-select-year').val()
                                let month = $('.pika-select.pika-select-month').val()
                                datepicker.el.classList.add('is-hidden')
                                datepicker.setDate(new Date(year, month, 1))
                            })

                            var prevButt = document.querySelector('.pika-prev')
                            prevButt.parentNode.insertBefore(close, prevButt)
                        }
                    }
                } else if (c.type === 'dropdown') {
                    column.trimDropdown = true
                    if (colId === columnKeys.MEDICAL_AGE_ONSET || colId === columnKeys.FAMILY_MODE_INHERITANCE) {
                        column.trimDropdown = false
                    }
                }

                if (colId === columnKeys.CASE_GROUP || colId === columnKeys.CASE_FAMILY_ID) {
                    column.allowInvalid = true
                    column.strict = false
                    column.source = groupOptions
                    if (colId === columnKeys.CASE_FAMILY_ID) column.source = familyOptions
                } else if (category['categoryId'] === columnKeys.GENOTYPE_INFO || colId === columnKeys.MEDICAL_CHIEF_COMPLAINT) {
                    column.renderer = multipleRenderer
                    if (category['categoryId'] === columnKeys.PHENOTYPE_INFO) column.editor = false
                    // add by hzhang@bits start
                } else if (category['categoryId'] === columnKeys.PHENOTYPE_INFO) {
                    if (colId === columnKeys.PHENOTYPE_HPO_LABEL) {
                        column.renderer = phenotypeInfo_phenotypeNameRenderer
                    } else {
                        column.renderer = multipleRenderer
                    }
                    column.editor = colId === columnKeys.GENOTYPE_ANALYSIS
                    // add by hzhang@bits end
                } else if (colId === columnKeys.MEDICAL_BODY_WEIGHT || colId === columnKeys.MEDICAL_BODY_HEIGHT || colId === columnKeys.MEDICAL_HEAD_CIRCUMFERENCE) {
                    column.editor = false
                    column.data = columnKeys.MEDICAL_BODY_INFO
                    switch (colId) {
                        case columnKeys.MEDICAL_BODY_WEIGHT:
                            column.renderer = weightRenderer
                            break
                        case columnKeys.MEDICAL_BODY_HEIGHT:
                            column.renderer = heightRenderer
                            break
                        case columnKeys.MEDICAL_HEAD_CIRCUMFERENCE:
                            column.renderer = headRenderer
                            break
                    }
                    dataSchemaColId = columnKeys.MEDICAL_BODY_INFO
                }

                if (defaultColumns.includes(colId)) {
                    colHeaders.push(colHeader)
                    columns.push(column)
                    existingColumns.push(colId)
                }

                dataColumns[colId] = {
                    colHeader: colHeader,
                    column: column,
                    sequence: colSequence,
                    category: category.categoryId
                }

                colSequence++

                dataSchema[dataSchemaColId] = null
            })
        })

        actions.forEach(a => {
            let colHeader = ''
            let column = {
                data: a === 'EDIT' ? 'PCFNo' : '',
                className: 'htMiddle htCenter',
                editor: false,
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
        createColumn(category['displayName'][lang], 'title', category['categoryId'], null)
        category.columns.forEach(c => {
            let displayName = c['displayName'][lang] || c['displayName']['en']
            if (c.table) createColumn(displayName, c.type, c['columnId'], category['categoryId'])
        })
    })

    if (customColumns.length > 0) createColumn('カスタム', 'title', 'カスタム', null)

    customColumns.forEach(c => {
        // customColumnCount += 1
        createColumn(c, 'custom', c, 'カスタム')
    })

    function createColumn(colName, type, key, parent) {
        if (type === 'title') {
            let icon

            switch (key) {
                case columnKeys.CASE_INFO:
                    icon = '<div class="add-column-icon modal-patient"></div>'
                    break
                case columnKeys.MEDICAL_INFO:
                    icon = '<div class="add-column-icon modal-medical"></div>'
                    break
                case columnKeys.PHENOTYPE_INFO:
                    icon = '<div class="add-column-icon modal-phenotype"></div>'
                    break
                case columnKeys.GENOTYPE_INFO:
                    icon = '<div class="add-column-icon modal-gene"></div>'
                    break
                case columnKeys.FAMILY_INFO:
                    icon = '<div class="add-column-icon modal-family"></div>'
                    break
                case 'カスタム':
                    icon = '<i class="material-symbols-outlined">category</i>'
                    break
            }
            container.innerHTML +=
                `<div class="add_column_title">
                <input type="checkbox" id="cb_${key}" class="add-column-checkbox" data-id="${key}" onchange="showHideAllColumn(this)">
                ${icon}${colName}
            </div>`
        } else {
            let dataCol = dataColumns[key]

            if (type === 'custom' && dataCol) {
                colName = dataCol.colHeader.replace('<i class="material-icons-outlined sort_icon"></i>', '')
            }

            container.innerHTML += `
                <div>
                    <input  type="checkbox"
                            class="modal_add_columns"
                            id="${key}"
                            data-id="${key}"
                            data-type="${type}"
                            data-colname="${colName}"
                            data-category2="${key.charAt(0)}"
                            data-category="${parent}"
                            onchange="showHideColumn(this)"
                            ${existingColumns.includes(key) ? 'checked' : ''}>
                    <label for="${key}">${colName}</label>
                    ${type === 'custom' ? `<div class="list-icon list-delete add-custom-column" data-colname="${colName}" data-id="${key}" onclick="removeCustomColumn(this)"></div>` : ''}
                </div>
            `
        }
    }

    document.querySelector('.add').onclick = () => {
        if (add.value === '') return

        let colHeader = `<i class="material-icons-outlined sort_icon"></i>${add.value}`

        customColumnCount += 1
        let colId = `custom_${`${customColumnCount}`.padStart(3, '0')}`

        let column = {
            data: colId,
            type: 'text',
            className: 'htMiddle',
            renderer: 'customRenderer'
        }

        dataSchema[colId] = null
        dataColumns[colId] = {
            colHeader: colHeader,
            column: column
        }
        colHeaders.push(colHeader)
        columns.push(column)
        existingColumns.push(colId)
        customColumns.push(colId)
        createColumn(add.value, 'custom', colId)

        contentData.map(c => c[colId] = null)

        rerenderTable()

        modal.style.display = 'none'
        hot.scrollViewportTo('', existingColumns.length - 1)
    }

    function closeAddColumnModal() {
        modal.style.display = 'none'
    }
}

function showHideAllColumn(e) {
    let categoryKey = e.dataset.id

    if (e.checked) {
        let elements = $(`input[data-category='${categoryKey}']:not(:checked)`)
        elements.each((i, c) => {
            showColumn(c.id)
        })
        rerenderTable()
        hot.scrollViewportTo('', existingColumns.length - 1)
    } else {
        let elements = $(`input[data-category='${categoryKey}']:checked`)
        elements.each((i, c) => {
            hideColumn(c.id, c.dataset.colname)
        })

        rerenderTable()
    }

    $(`input[data-category='${categoryKey}']`).prop('checked', e.checked)
}

function showHideColumn(e) {
    if (e.checked) {
        showColumn(e.dataset.id)
        rerenderTable()
        hot.scrollViewportTo('', existingColumns.length - 1)
    } else {
        hideColumn(e.dataset.id, e.dataset.colname)
        rerenderTable()
    }
}

function showColumn(colId) {
    let col = dataColumns[colId]

    existingColumns.push(colId)
    colHeaders.push(col.colHeader)
    columns.push(col.column)
}

function hideColumn(colId, colHeader) {
    colHeaders.splice(colHeaders.indexOf(`<i class="material-icons-outlined sort_icon"></i>${colHeader}`), 1)

    if ([columnKeys.MEDICAL_BODY_WEIGHT, columnKeys.MEDICAL_BODY_HEIGHT, columnKeys.MEDICAL_HEAD_CIRCUMFERENCE].includes(colId)) {
        let renderer
        switch (colId) {
            case columnKeys.MEDICAL_BODY_WEIGHT:
                renderer = 'weightRenderer'
                break
            case columnKeys.MEDICAL_BODY_HEIGHT:
                renderer = 'heightRenderer'
                break
            case columnKeys.MEDICAL_HEAD_CIRCUMFERENCE:
                renderer = 'headRenderer'
                break
        }

        columns.forEach((h, i) => {
            if (h.data !== columnKeys.MEDICAL_BODY_INFO) return
            if (h.renderer.name === renderer) columns.splice(i, 1)
        })
    } else {
        columns = columns.filter(h => { return h.data !== colId })
    }
    existingColumns.splice(existingColumns.indexOf(colId), 1)
}

function removeCustomColumn(e) {
    let id = e.dataset.id
    let colName = e.dataset.colname
    delete dataSchema[id]
    delete dataColumns[id]

    customColumns.splice(customColumns.indexOf(id), 1)

    let isVisible = colHeaders.indexOf(`<i class="material-icons-outlined sort_icon"></i>${colName}`) > -1

    if (isVisible) {
        showHideColumn(e)
    }

    contentData.forEach(d => delete d[id])

    e.parentElement.remove()
}

function addRow(data) {
    let temp = JSON.parse(JSON.stringify(newData))

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`

    temp.PCFNo = pcfNo

    let num = localStorage.patientCount ? parseInt(localStorage.patientCount) + 1 : hot.countRows() + 1
    temp[columnKeys.CASE_ID] = `C${num.toString().padStart(7, 0)}`

    localStorage.patientCount = num
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
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth()

    data.forEach(row => {
        // Translate if possible
        if (typeof row === 'object') {
            Object.keys(row).forEach(columnId => {
                let translatedValue = dataValueToNameMap?.[columnId]?.[row[columnId]];
                if (translatedValue) {
                    row[columnId] = translatedValue;
                }
            })
            contentData.push(row)
        }
    })

    if (contentData.length > 0) {
        let newHeaders = Object.keys(data[0])

        if (changeHeaders === 'text/csv' || changeHeaders === 'text/tab-separated-values') {
            columns.splice(2, columns.length)
            colHeaders.splice(2, colHeaders.length)
            existingColumns = []
            customColumns = []

            newHeaders.forEach(h => {
                if (h === 'PCFNo') return

                if (h === columnKeys.MEDICAL_BODY_INFO) {
                    let subIds = contentData[0][columnKeys.MEDICAL_BODY_INFO]
                    if (subIds) {
                        Object.keys(subIds[0]).forEach(k => {
                            if (k !== columnKeys.MEDICAL_BODY_INFO_DATE) createColumn(k)
                        })
                    }
                } else {
                    createColumn(h)
                }
            })
        } else {
            newHeaders.forEach(h => {
                if (h === 'PCFNo' || h === columnKeys.MEDICAL_BODY_INFO) return
                if (!(Object.keys(dataColumns).includes(h))) createColumn(h, true)
            })
        }
    }

    function createColumn(h, isHidden) {
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

    let autoColumnSize = hot.getPlugin('autoColumnSize')

    Object.assign(updateSettings, {
        data: contentData,
        colHeaders: colHeaders,
        columns: columns,
        colWidths: function (index) {
            if (index < 2) {
                return 40
            } else {
                autoColumnSize.calculateColumnsWidth(index, 0, true)
                return autoColumnSize.getColumnWidth(index)
            }
        }
    })

    contentData.map(d => {
        let groupId = d[columnKeys.CASE_GROUP]
        if (groupId && !(groupOptions.includes(groupId))) groupOptions.push(groupId)

        let familyId = d[columnKeys.CASE_FAMILY_ID]
        if (familyId && !(familyOptions.includes(familyId))) familyOptions.push(familyId)
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`
}

function importFile(event) {
    let file = event.target.files[0]
    fileReader(file, file.type, event.target.id === 'import_btn')
    event.target.value = ''
}

function onDragOver(event) {
    event.preventDefault()
    if (event.dataTransfer.length) event.dataTransfer.dropEffect = 'move'
}

function onDrop(event) {
    event.preventDefault()
    if (document.getElementById('modal-karte').style.display === 'block') return

    let file = event.dataTransfer.items[0].getAsFile()
    fileReader(file, file.type, true)
}

function fileReader(file, fileType, overwrite) {
    let reader = new FileReader()
    reader.onload = (event => {
        let data = event.target.result
        let object

        if (overwrite) {
            contentData = []

            Object.assign(updateSettings, {
                data: contentData
            })

            localStorage.patientCount = 0

            hot.updateSettings(updateSettings)
            hot.render()
        }

        if (fileType === 'text/csv' || fileType === 'text/tab-separated-values') {
            object = convertCSVToJSON(data)
        } else {
            object = JSON.parse(data)

            for (let [k, v] of Object.entries(object.keyName)) {
                dataSchema[k] = null
                dataColumns[k] = {
                    colHeader: `<i class="material-icons-outlined sort_icon"></i>${v}`,
                    column: {
                        data: k,
                        type: 'text',
                        className: 'htMiddle',
                        renderer: 'customRenderer'
                    }
                }

                customColumnCount += 1
                customColumns.push(k)
            }
        }

        if (localStorage.patientCount) {
            let currentCount = parseInt(localStorage.patientCount)
            localStorage.patientCount = currentCount + (object.patientCount || object.PATIENTS.length)
        } else {
            localStorage.patientCount = object.patientCount || object.PATIENTS.length
        }

        updateTable(object.PATIENTS, fileType)

        if (object.visibleColumns) {
            colHeaders.length = 2
            columns.length = 2
            existingColumns = []

            object.visibleColumns.forEach(vc => {
                console.log(vc)
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

            if ([columnKeys.MEDICAL_BODY_WEIGHT, columnKeys.MEDICAL_BODY_HEIGHT, columnKeys.MEDICAL_HEAD_CIRCUMFERENCE].includes(columnId)) {
                if (isExport) {
                    if (contentData.length > 0) {
                        if (contentData.length > 0) {
                            let bodyInfo = contentData[idx - 1][columnKeys.MEDICAL_BODY_INFO]
                            if (bodyInfo) {
                                value = bodyInfo[bodyInfo.length - 1][columnId]
                            } else {
                                value = ''
                            }
                        }
                    }
                } else {
                    let subColumnId = columnId
                    columnId = columnKeys.MEDICAL_BODY_INFO
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

function getKeyFromTranslation(obj, val) {
    return Object.keys(obj).find(key => !(typeof obj[key] === 'object') ? obj[key] === val : getKeyFromTranslation(obj[key], val))
}


// Map [columnId] => [name in current language] => [dataValue] for 'dropdown' type columns
let nameToDataValueMap = {};

// Map [columnId] => [dataValue] => [name in current language] for 'dropdown' type columns
let dataValueToNameMap = {};

let currentLang = localStorage.lang
for (let category of categories) {
    for (let column of category.columns) {
        if (column.type !== 'dropdown' || !column.options)
            continue
        nameToDataValueMap[column.columnId] = {}
        dataValueToNameMap[column.columnId] = {}
        // for loop with index
        column.options[currentLang].forEach((optionName, index) => {
            nameToDataValueMap[column.columnId][optionName] = column.options.dataValue[index]
            dataValueToNameMap[column.columnId][column.options.dataValue[index]] = optionName
        })
    }
}
function getExportData() {
    $('.save-panel').toggleClass('save-panel-open')

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
                if (k.split('_')[0] === 'custom') {
                    keyName[k] = getHeaderName(k)
                }

                if (k === columnKeys.MEDICAL_BODY_INFO) {
                    let tempV = []

                    v.forEach((gc, gcIdx) => {
                        let gcData = {}
                        for (let [gcK, gcV] of Object.entries(gc)) {
                            gcData[gcK] = gcV
                        }

                        tempV.push(gcData)
                    })

                    v = tempV
                } else if (nameToDataValueMap[k]) {
                    // Translate to dataValue if possible
                    v = nameToDataValueMap[k][v] || v;
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
            lang,
            patientCount: localStorage.patientCount
        }

        return jsonResult
    }

    function getHeaderName(k) {
        let header = dataColumns[k]
        if (header) {
            header = header.colHeader.replace('<i class="material-icons-outlined sort_icon"></i>', '')
        } else {
            if (k === columnKeys.MEDICAL_BODY_INFO || k === columnKeys.MEDICAL_BODY_INFO_DATE) header = translate(k)
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
    temp['症例ID'] = `C${num.toString().padStart(7, 0)}`

    if (type === 'json') sampleData = { 'PATIENTS': [temp] }
    if (type === 'excel') sampleData = Papa.unparse([temp], { delimiter: '\t' })

    exportFile(type === 'json' ? type : 'tsv', sampleData)
}

function exportFile(type, file) {
    // let filename = prompt('ファイル名を入力して下さい')
    // if (!filename) filename = `patients_${Date.now()}`

    let d = new Date()

    let a = document.createElement('a')
    a.download = `patients_${d.getFullYear()}${addZero(d.getMonth() + 1)}${addZero(d.getDate())}${addZero(d.getHours())}${addZero(d.getMinutes())}.${type}`
    // a.download = `patients_${Date.now()}.${type}`
    // a.download = `${filename}.${type}`
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

    function addZero(number) {
        return String(number).padStart(2, '0')
    }
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
            //add by hzhang@bits start
            if (!('columnname' in e.dataset)) return;
            //add by hzhang@bits end
            if (e.type === 'radio') {
                newPatient[e.dataset.columnname] = $(`input[name="${e.name}"]:checked`).val() || null
            } else {
                let value = e.value
                if (e.dataset.columnname === columnKeys.CASE_BIRTH || e.dataset.columnname === columnKeys.CASE_DEATH) {
                    let pre = e.dataset.columnname
                    value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
                    if (value === '0/0') value = ''
                } else if (e.dataset.columnname === columnKeys.CASE_EXAMINATION_DAY) {
                    let col = e.dataset.columnname
                    value = `${document.querySelector(`.tab-wrap *[name="${col}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${col}_month"]`).value}/${document.querySelector(`.tab-wrap *[name="${col}_day"]`).value}`
                    if (value === '0/0/0') value = ''
                } else if (e.dataset.columnname === columnKeys.CASE_FAMILY_ID) {
                    if (!(familyOptions.includes(value))) familyOptions.push(value)
                } else if (e.dataset.columnname === columnKeys.CASE_GROUP) {
                    if (!(groupOptions.includes(value))) groupOptions.push(value)
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
            newPatient[columnKeys.MEDICAL_BODY_INFO] = []
            currentBodyData.forEach(bd => {
                newPatient[columnKeys.MEDICAL_BODY_INFO].push(bd)
            })
        }

        // add by hzhang@bits start
        Object.keys(phenotypeData).forEach(cid => {
            newPatient[cid] = phenotypeData[cid]
        })
        // add by hzhang@bits end

        delete newPatient['undefined']
        addRow(newPatient)
        return
    }

    // existing patient
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]

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

    // add by hzhang@bits start
    Object.keys(phenotypeData).forEach(cid => {
        patientData[cid] = phenotypeData[cid]
    })
    // add by hzhang@bits end

    hot.render()
    resetData()

    function resetData() {
        currentPatient = ''
        // changedData = {}
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
    console.log('hello')
    if (contentData.length > 0) localStorage.contentData = JSON.stringify(contentData)
    localStorage.removeItem('patientCount')
    return 'load'
}

function pageReload() {
    window.location.reload()
}

function changeLanguage() {
    $('ul#dropdown-language li').click((e) => {
        if (e.target.classList.contains('popup-bg-cover')) return document.getElementById('dropdown-language').classList.toggle('dropdown-menu-open')
        let newLang = e.target.dataset.lang

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
                <div class="${category.iconClass}"></div>
                <span>${category['displayName'][lang] || category['displayName']['en']}</span>
            `
            ul.appendChild(li)

            let divClass = ['tab-contents']
            if (i === 0) divClass.push('show')

            let div = document.createElement('div')
            div.classList.add(...divClass)
            div.id = `tab-content-${category.categoryId}`
            container.appendChild(div)

            li.addEventListener('click', () => {
                $('.show').removeClass('show')
                $(li).addClass('show')
                $(div).addClass('show')

                if (category.categoryId === columnKeys.GENOTYPE_INFO) {
                    geneTable()
                } else if (category.categoryId === columnKeys.MEDICAL_INFO) {
                    bodyTable()
                }
            })

            if (i === 2) {
                // modified by hzhang@bits start
                phenotypeInfo_initUI(div)
                // modified by hzhang@bits end
                return
            }

            let table = document.createElement('table')
            table.classList.add('form-table')
            if (i === 1) table.classList.add('treatment-table')
            if (i === 4) table.classList.add('family-table')
            table.innerHTML = `<tbody id="tbody_${category.categoryId}">`
            div.appendChild(table)

            if (i === 3) {
                let genotypeAnalysis = category.columns.filter(c => c.columnId === columnKeys.GENOTYPE_ANALYSIS)
                if (genotypeAnalysis) {
                    // createRow(`tab-content-${category.categoryId}`, genotypeAnalysis[0])
                    createRow(`tbody_${category.categoryId}`, genotypeAnalysis[0])
                }

                div.innerHTML += `
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

            if (i === 0) {
                createRow(`tbody_${category.categoryId}`,
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
                if (c.columnId === columnKeys.MEDICAL_BODY_WEIGHT || c.columnId === columnKeys.MEDICAL_BODY_HEIGHT || c.columnId === columnKeys.MEDICAL_HEAD_CIRCUMFERENCE) {
                    createTable(`tbody_${category.categoryId}`, columnKeys.MEDICAL_BODY_INFO)
                } else {
                    createRow(`tbody_${category.categoryId}`, c)
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
            if (c.type === 'display') td.innerText = 'C20220600001'
            tr.appendChild(td)

            if (c.columnId === columnKeys.CASE_AGE || c.columnId === columnKeys.MEDICAL_AGE_ONSET) {
                let yearInput = document.createElement('input')
                yearInput.type = 'number'
                yearInput.min = 0
                yearInput.classList.add(...[`${c.columnId}_year`, 'select_date_year', 'age_select_date_year'])
                yearInput.id = `${c.columnId}_year`
                yearInput.name = `${c.columnId}_year`
                yearInput.dataset.columnname = c.columnId
                yearInput.addEventListener('change', (e) => {
                    if (e.target.value < 0) e.target.value = ''
                })
                td.appendChild(yearInput)

                let selectMonth = document.createElement('select')
                selectMonth.name = `${c.columnId}_month`
                selectMonth.id = `${c.columnId}_month`
                selectMonth.dataset.columnname = c.columnId
                td.appendChild(selectMonth)

                let selectDay = document.createElement('select')
                selectDay.name = `${c.columnId}_day`
                selectDay.id = `${c.columnId}_day`
                selectDay.dataset.columnname = c.columnId
                td.appendChild(selectDay)
            } else if (c.inputType === 'text' || c.inputType === 'input-select') {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = c.columnId
                input.dataset.columnname = c.columnId
                td.appendChild(input)

                if (c.inputType === 'input-select') {
                    let select = document.createElement('select')
                    select.id = c.columnId === columnKeys.CASE_FAMILY_ID ? 'family_options' : 'group_options'
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
                option.hidden = false
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
                selectYear.classList.add(...[`${c.columnId}_year`, 'select-date-year'])
                selectYear.id = `${c.columnId}_year`
                selectYear.name = `${c.columnId}_year`
                selectYear.dataset.columnname = c.columnId
                td.appendChild(selectYear)

                let selectMonth = document.createElement('select')
                selectYear.classList.add('select_date_month')
                selectMonth.name = `${c.columnId}_month`
                selectMonth.id = `${c.columnId}_month`
                selectMonth.dataset.columnname = c.columnId
                td.appendChild(selectMonth)
                if (c.includeDay) {
                    let selectDay = document.createElement('select')
                    selectDay.name = `${c.columnId}_day`
                    selectDay.id = `${c.columnId}_day`
                    selectDay.dataset.columnname = c.columnId
                    td.appendChild(selectDay)
                }
            } else if (c.inputType === 'radio' || c.inputType === 'radio-input') {
                let options = c.options.dataValue
                let optionLang = c['options'][lang].length > 0 ? c['options'][lang] : c['options']['en']
                options.forEach((o, i) => {
                    td.innerHTML += `
                        <label for="${o}_${c.columnId}">
                            <input id="${o}_${c.columnId}" type="radio" name="${c.columnId}" value="${o}" checked="checked"
                                data-columnname="${c.columnId}">
                            ${optionLang[i]}
                        </label>
                    `
                })

                let clear = document.createElement('div')
                clear.classList.add('radio-clear')
                clear.innerHTML = 'clear'
                clear.onclick = () => {
                    contentData.forEach(p => {
                        if (p.PCFNo === currentPatient) p[c.columnId] = ''
                    })

                    // changedData[c.columnId] = ''
                    hot.render()
                    $(td).find('input').prop('checked', false)
                }
                td.appendChild(clear)

                if (c.inputType === 'radio-input') {
                    let input = document.createElement('input')
                    input.classList.add('input-top')
                    input.type = 'text'
                    input.name = `${c.columnId}-list`
                    td.appendChild(input)
                }
            } else if (c.inputType === 'textarea') {
                let textarea = document.createElement('textarea')
                textarea.cols = 30
                textarea.rows = 5
                textarea.name = c.columnId
                textarea.dataset.columnname = c.columnId
                td.appendChild(textarea)
            } else if (c.inputType === 'multiple-radio') {
                td.innerHTML = `
                    <label for="sporadic">
                        <input id="sporadic" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}" value="Sporadic"
                            data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Sporadic
                    </label>
                    <details>
                        <summary>
                            <label for="autosomal_dominant_inheritance">
                                <input id="autosomal_dominant_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                    value="Autosomal dominant inheritance"
                                    data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Autosomal
                                dominant
                                inheritance
                            </label>
                        </summary>
                        <label for="sex_limited_autosomal_dominant">
                            <input id="sex_limited_autosomal_dominant" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="Sex-limited autosomal dominant"
                                data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Sex-limited
                            autosomal dominant
                        </label>
                        <label for="autosomal_dominant_somatic_cell_mutation">
                            <input id="autosomal_dominant_somatic_cell_mutation" type="radio"
                                name="${columnKeys.FAMILY_MODE_INHERITANCE}" value="Autosomal dominant somatic cell mutation"
                                data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Autosomal
                            dominant somatic cell mutation
                        </label>
                        <label for="autosomal_dominant_contiguous_gene_syndrome">
                            <input id="autosomal_dominant_contiguous_gene_syndrome" type="radio"
                                name="${columnKeys.FAMILY_MODE_INHERITANCE}" value="Autosomal dominant contiguous gene syndrome"
                                data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Autosomal
                            dominant contiguous gene syndrome
                        </label>
                    </details>
                    <label for="autosomal_recessive_inheritance">
                        <input id="autosomal_recessive_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                            value="Autosomal recessive inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Autosomal
                        recessive inheritance
                    </label>
                    <details>
                        <summary>
                            <label for="gonosomal_inheritance">
                                <input id="gonosomal_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                    value="Gonosomal inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Gonosomal
                                inheritance
                            </label>
                        </summary>
                        <label for="x_linked_inheritance">
                            <input id="x_linked_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="X-linked inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">X-linked
                            inheritance
                        </label>
                        <label for="x_linked_dominant_inheritance">
                            <input id="x_linked_dominant_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="X-linked dominant inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">X-linked
                            dominant inheritance
                        </label>
                        <label for="x_linked_recessive_inheritance">
                            <input id="x_linked_recessive_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="X-linked recessive inheritance"
                                data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">X-linked
                            recessive inheritance
                        </label>
                        <label for="y_linked_inheritance">
                            <input id="y_linked_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="Y-linked inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Y-linked
                            inheritance
                        </label>
                    </details>
                    <details>
                        <summary>
                            <label for="multifactorial_inheritance">
                                <input id="multifactorial_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                    value="Multifactorial inheritance"
                                    data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Multifactorial
                                inheritance
                            </label>
                        </summary>
                        <label for="digenic_inheritance">
                            <input id="digenic_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="Digenic inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Digenic
                            inheritance
                        </label>
                        <label for="oligogenic_inheritance">
                            <input id="oligogenic_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="Oligogenic inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Oligogenic
                            inheritance
                        </label>
                        <label for="polygenic_inheritance">
                            <input id="polygenic_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                                value="Polygenic inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Polygenic
                            inheritance
                        </label>
                    </details>
                    <label for="mitochondrialx_inheritance">
                        <input id="mitochondrialx_inheritance" type="radio" name="${columnKeys.FAMILY_MODE_INHERITANCE}"
                            value="Mitochondrial inheritance" data-columnname="${columnKeys.FAMILY_MODE_INHERITANCE}">Mitochondrial
                        inheritance
                    </label>
                `

                let clear = document.createElement('div')
                clear.classList.add('radio-clear')
                clear.innerHTML = 'clear'
                clear.onclick = () => {
                    contentData.forEach(p => {
                        if (p.PCFNo === currentPatient) p[c.columnId] = ''
                    })

                    // changedData[c.columnId] = ''
                    hot.render()
                    $(td).find('input').prop('checked', false)
                }
                td.appendChild(clear)
            }
        }

        function createTable(parentId) {
            if (document.getElementById('bodyModal')) return

            let parent = document.getElementById(parentId)

            let tr = document.createElement('tr')
            parent.appendChild(tr)

            let th = document.createElement('th')
            th.id = columnKeys.MEDICAL_BODY_INFO
            th.innerText = translate(columnKeys.MEDICAL_BODY_INFO)
            tr.appendChild(th)

            let td = document.createElement('td')
            td.id = 'body-table-td'
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



let infoTranslations = {
    en: [
        { 'What is Case Sharing?': 'Case Sharing is a system for managing and sharing case information on rare and genetic diseases. The system can be used without user registration. Lets get an idea of how to use this system with sample data.' },
        { 'Usable in a local environment': 'Case information managed by Case Sharing is not stored in the cloud, but in your own computer. Case information can also be exported to the Phenopackets format, an international case information sharing format. This makes it easy for users to control their own information management and sharing.' },
        { 'Encouraging collaboration': 'In the future, Case Sharing will support not only Phenopackets but also other formats such as OMOP so that information can be shared smoothly with other systems. In addition, this system supports English, Japanese, Korean, Chinese, and other languages to facilitate information sharing with users around the world.' },
        { 'Disclaimer': 'Please refer to <a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en">this link</a>.' }
    ],
    ja: [
        { 'Case Sharingとは？': 'Case Sharingは、希少疾患・遺伝性疾患の症例情報を、管理・共有するためのシステムです。ユーザ登録なしに利用することができます。サンプルデータを用いて本システムの使用イメージをつかみましょう。' },
        { 'ローカル環境で使える': 'Case Sharingで管理する症例情報は、クラウドに保存するのではなく、自身のコンピュータに保存します。また、国際的な症例情報共有形式であるPhenopacketsで症例情報を出力することも可能です。これにより、情報管理や共有を自身でコントロールすることが容易となります。' },
        { 'コラボレーションを促進': '将来、他のシステムとスムーズに情報共有ができるように、Phenopacketsだけでなく、OMOPなど他の形式にも対応する予定です。また、本システムは英語、日本語、韓国語、中国語などの言語に対応しており、世界各地のユーザとの情報共有もスムーズになります。' },
        { '免責事項': '<a href="https://pubcasefinder.dbcls.jp/termsofservice">リンク先</a>を参照してください。' }
    ],
    ko: [
        { 'Case Sharing이란?': 'Case Sharing은 희귀 질환 및 유전성 질환의 사례 정보를 관리하고 공유하기 위한 시스템입니다. 사용자 등록 없이 이용할 수 있습니다.  샘플 데이터를 활용하여 본 시스템의 사용 이미지를 파악해 봅시다.' },
        { '로컬 환경에서 사용 가능': 'Case Sharing에서 관리하는 증례 정보는 클라우드에 저장하는 것이 아니라 자신의 컴퓨터에 저장합니다. 또한 국제적인 증례 정보 공유 형식인 Phenopackets로 증례 정보를 출력할 수도 있습니다. 이를 통해 정보 관리와 공유를 자체적으로 제어할 수 있습니다.' },
        { '협업 촉진': '미래에 다른 시스템과의 원활한 정보 공유를 위해 Phenopackets 뿐만 아니라 OMOP 등 다른 형식에도 대응할 예정입니다. 또한 본 시스템은 영어, 일본어, 한국어, 중국어 등의 다양한 언어를 지원하므로 전 세계 각지의 사용자들과 정보 공유도 원활해질 것입니다.' },
        { '면책 사항': '<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=ko">링크</a>를 참조해 주시기 바랍니다.' }
    ],
    zh: [
        { '什么是个案分享？': '病例共享是一个管理和共享罕见病和遗传病病例信息的系统。无需用户注册即可使用该系统。让我们了解一下如何将此系统与示例数据一起使用。' },
        { '可在本地环境中使用': 'Case Sharing 管理的案例信息不存储在云端，而是存储在您自己的计算机中。案例信息还可以导出为 Phenopackets 格式，这是一种国际案例信息共享格式。这使得用户可以轻松控制自己的信息管理和共享。' },
        { '鼓励合作': '未来, Case Sharing不仅支持Phenopackets, 还支持OMOP等其他格式, 以便与其他系统顺利共享信息。此外，该系统还支持英文、日文、韩文、中文等多种语言，方便与全球用户进行信息共享。' },
        { '免责声明': '<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en">请参考这</a>个链接。' }
    ],
    zhcht: [
        { '什麼是個案分享？': '病例共享是一個管理和共享罕見病和遺傳病病例信息的系統。無需用戶註冊即可使用該系統。讓我們了解一下如何將此系統與示例數據一起使用。' },
        { '可在本地環境中使用': 'Case Sharing 管理的案例信息不存儲在雲端，而是存儲在您自己的計算機中。案例信息還可以導出為 Phenopackets 格式，這是一種國際案例信息共享格式。這使得用戶可以輕鬆控制自己的信息管理和共享。' },
        { '鼓勵合作': '未來, Case Sharing不僅支持Phenopackets, 還支持OMOP等其他格式, 以便與其他系統順利共享信息。此外, 該系統還支持英文、日文、韓文、中文等多種語言，方便與全球用戶進行信息共享。' },
        { '免責聲明': '請參考<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en">此鏈接</a>。' }
    ]
}

let modalContent = document.getElementById('modal-info-content')
modalContent.innerHTML = `
<img src="/static/record/images/logo_CaseSharing.svg" class="info-case-img">        
<ul>
        <li>
            <i class="material-symbols-outlined">
            dvr
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][0])}</h4>
                <p>${Object.values(infoTranslations[lang][0])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        demography
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][1])}</h4>
                <p>${Object.values(infoTranslations[lang][1])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
            handshake
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][2])}</h4>
                <p>${Object.values(infoTranslations[lang][2])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        keyboard_previous_language
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][3])}</h4>
                <p>${Object.values(infoTranslations[lang][3])}
                </p>
            </span>
        </li>
    </ul>
`
