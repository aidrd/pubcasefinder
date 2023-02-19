let modalTableSettings = {
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    autoColumnSize: {
    	useHeaders: true
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
        geneData.push(geneSchema)
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
    geneHot.alter('insert_row', geneHot.countRows())
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
            type: 'text'
        })
    })

    if (currentBodyData.length === 0) {
        currentBodyData.push(bodySchema)
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
    bodyHot.alter('insert_row', bodyHot.countRows())
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