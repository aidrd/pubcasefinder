let modalTableSettings = {
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    autoColumnSize: {
    	useHeaders: true
    },
    afterGetRowHeader: (row, TH) => {
        TH.className = 'htMiddle'
    },
    contextMenu: true,
    allowRemoveColumn: false,
    trimDropdown: false,
    licenseKey: '17bfa-714c9-a7430-c4321-87c56'
}

let geneHot, geneContainer
let geneSettings = JSON.parse(JSON.stringify(modalTableSettings))
let geneHeaders = [], geneColumns = [], geneDataKey = []
let geneSchema = {}, geneData = [], currentGeneData = []
// let geneContainer = document.getElementById('geneModal')

let bodyHot, bodyContainer
let bodySettings = JSON.parse(JSON.stringify(modalTableSettings))
let bodyHeaders = [], bodyColumns = [], bodyDataKey = []
let bodySchema = {}, bodyData = [], currentBodyData = []
// let bodyContainer = document.getElementById('bodyModal')

async function geneTable() {
    if (!toReset) return

    let tempData = {}

    resetData('gene')
    let geneInfo = categories.filter(c => { return c.dataKey === 'geneInfo' })
    let geneTypeInfo = geneInfo[0].columns
    
    geneTypeInfo.forEach(g => {
        let displayName = g['displayName'][lang] || g['displayName']['en']
        let options
        if (g.options) {
            options = g['options'][lang].length > 0 ? g['options'][lang] : g['options']['en']
        }

        geneSchema[g.columnId] = null
        geneHeaders.push(displayName)
        geneColumns.push({
            data: g.columnId,
            type: g.type,
            source: options,
            strict: true,
            allowInvalid: false
        })
        geneDataKey.push(g.columnId)
    })

    addDeleteColumn('gene')

    if (currentPatient) {
        let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
        for (let [k, v] of Object.entries(patientData)) {
            if (geneDataKey.includes(k)) {
                tempData[k] = v
            }
        }
    }

    let keys = Object.keys(tempData)
    if (keys.length > 0 && tempData[keys[0]]) {
        for (let i = 0; i < tempData[keys[0]].length; i++) {
            let gData = {}
            keys.forEach(k => {
                gData[k] = tempData[k][i]
            })
            geneData.push(gData)
        }
    }

    if (geneData.length === 0) {
        geneData.push(JSON.parse(JSON.stringify(geneSchema)))
    }

    Object.assign(geneSettings, {
        data: geneData,
        dataSchema: geneSchema,
        colHeaders: geneHeaders,
        columns: geneColumns,
        height: '100%'
    })

    if (!geneHot) {
        geneHot = new Handsontable(geneContainer, geneSettings)
    } else {
        geneHot.updateSettings(geneSettings)
        geneHot.render()
    }

    toReset = false
}

function addGeneRow() {
    geneHot.alter('insert_row_below', geneHot.countRows())
}

async function bodyTable() {
    resetData('body')

    if (currentPatient) {
        let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
        if (!patientData['m013']) patientData['m013'] = []
        bodyData = patientData['m013']
        currentBodyData = bodyData
    }

    let medicalInfo = categories.filter(c => { return c.dataKey === 'medicalInfo' })
    let bodyInfo = medicalInfo[0].columns.filter(c => { return c.dataKey === 'bodyWeight' || c.dataKey === 'bodyHeight' || c.dataKey === 'headCircumference'})
    
    bodySchema.date = null
    bodyHeaders.push(translate('date'))
    bodyColumns.push({
        data: 'm013_1',
        type: 'date',
        dateFormat: 'YYYY/MM/DD',
        correctFormat: true
    })

    bodyInfo.forEach(c => {
        let displayName = c['displayName'][lang] || c['displayName']['en']

        bodySchema[c.columnId] = null
        bodyHeaders.push(`${displayName}${c.columnId === 'm013_2' ? '(kg)' : '(cm)' }`)
        bodyColumns.push({
            data: c.columnId,
            type: 'text',
        })
    })

    addDeleteColumn('body')

    if (currentBodyData.length === 0) {
        currentBodyData.push(JSON.parse(JSON.stringify(bodySchema)))
    }

    Object.assign(bodySettings, {
        dataSchema: bodySchema,
        data: currentBodyData,
        colHeaders: bodyHeaders,
        columns: bodyColumns,
    })

    if (!bodyHot) {
        bodyHot = new Handsontable(bodyContainer, bodySettings)
        bodyHot.render()
    } else {
        bodyHot.updateSettings(bodySettings)
        bodyHot.render()
    }
}

function addBodyRow() {
    bodyHot.alter('insert_row_below', bodyHot.countRows())
}

function resetData(type) {
    if (type === 'gene') {
        geneHeaders = []
        geneColumns = []
        geneDataKey = []
        geneSchema = {}
        geneData = []
        
        if (geneHot) {
            geneHot.updateSettings(bodySettings)
            geneHot.render()
        }
    } else if (type === 'body') {
        bodyHeaders = []
        bodyColumns = []
        bodyDataKey = []
        bodySchema = {}
        bodyData = []
        currentBodyData = []

        if (bodyHot) {
            bodyHot.updateSettings(bodySettings)
            bodyHot.render()
        }
        
    }
}

function addDeleteColumn(type) {
    let deleteHeader = ''
    let deleteColumn = {
        data: type,
        className: 'htMiddle htCenter',
        renderer: deleteModalRenderer
    }

    if (type === 'gene') {
        geneColumns.unshift(deleteColumn)
        geneHeaders.unshift(deleteHeader)
    } else if (type === 'body') {
        bodyColumns.unshift(deleteColumn)
        bodyHeaders.unshift(deleteHeader)
    }
}

function deleteModalRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)

    td.innerHTML = `<div class="list-icon list-delete"></div>`
    td.onclick = function() {
        if (confirm('削除してもよろしいでしょうか。')) {
            if ($(td).parents('div#geneModal').length > 0) {
                geneHot.alter('remove_row', row, 1)
            } else if ($(td).parents('div#bodyModal').length > 0) {
                bodyHot.alter('remove_row', row, 1)
            }
        }
    }
}

Handsontable.renderers.registerRenderer('deleteModalRenderer', deleteModalRenderer)