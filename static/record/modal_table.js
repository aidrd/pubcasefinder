let modalTableSettings = {
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    autoColumnSize: {
    	useHeaders: true
    },
    contextMenu: true,
    allowRemoveColumn: false,
    licenseKey: '17bfa-714c9-a7430-c4321-87c56'
}

let geneHot, geneContainer
let geneSettings = JSON.parse(JSON.stringify(modalTableSettings))
let geneHeaders = [], geneColumns = []
let geneSchema = {}, geneData = [], currentGeneData = []
// let geneContainer = document.getElementById('geneModal')

let bodyHot, bodyContainer
let bodySettings = JSON.parse(JSON.stringify(modalTableSettings))
let bodyHeaders = [], bodyColumns = []
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

        geneSchema[g.dataKey] = null
        geneHeaders.push(displayName)
        geneColumns.push({
            data: g.dataKey,
            type: g.type,
            source: options,
            strict: true,
            allowInvalid: false
        })
    })

    if (currentPatient) {
        let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
        for (let [k, v] of Object.entries(patientData)) {
            if (geneHeaders.includes(k)) {
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
        if (!patientData['growthChart']) patientData['growthChartgrowthChart'] = []
        bodyData = patientData['growthChart']
        currentBodyData = bodyData
    }

    let medicalInfo = categories.filter(c => { return c.dataKey === 'medicalInfo' })
    let bodyInfo = medicalInfo[0].columns.filter(c => { return c.dataKey === 'bodyWeight' || c.dataKey === 'bodyHeight' || c.dataKey === 'headCircumference'})
    
    bodySchema.date = null
    bodyHeaders.push(translate('date'))
    bodyColumns.push({
        data: 'date',
        type: 'date',
        dateFormat: 'YYYY/MM/DD',
        correctFormat: true
    })

    bodyInfo.forEach(c => {
        let displayName = c['displayName'][lang] || c['displayName']['en']

        bodySchema[c.dataKey] = null
        bodyHeaders.push(displayName)
        bodyColumns.push({
            data: c.dataKey,
            type: 'text'
        })
    })

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
        geneSchema = {}
        geneData = []
        
        if (geneHot) {
            geneHot.updateSettings(bodySettings)
            geneHot.render()
        }
    } else if (type === 'body') {
        bodyHeaders = []
        bodyColumns = []
        bodySchema = {}
        bodyData = []

        if (bodyHot) {
            bodyHot.updateSettings(bodySettings)
            bodyHot.render()
        }
        
    }
}