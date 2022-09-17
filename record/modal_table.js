let modalTableSettings = {
    rowHeaders: true,
    height: 'auto',
    colWidths: 130,
    contextMenu: true,
    allowRemoveColumn: true,
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
}

let geneHot
// let geneSettings = structuredClone(modalTableSettings)
let geneSettings = JSON.parse(JSON.stringify(modalTableSettings))
let geneHeaders = [], geneColumns = []
let geneSchema = {}, geneData = [], currentGeneData = []
let geneContainer = document.getElementById('geneModal')

let bodyHot
// let bodySettings = structuredClone(modalTableSettings)
let bodySettings = JSON.parse(JSON.stringify(modalTableSettings))
let bodyHeaders = [], bodyColumns = []
let bodySchema = {}, bodyData = {}, currentBodyData = {}
let bodyContainer = document.getElementById('bodyModal')

async function geneTable() {
    let tempData = {}
    resetData()

    let geneTypeInfo = columns['遺伝子型情報']
    geneTypeInfo.forEach(g => {
        geneSchema[g.columnName] = null
        geneHeaders.push(g.columnName)
        geneColumns.push({
            data: g.columnName,
            type: g.type,
            source: g.options,
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
        colWidths: 130
    })

    if (!geneHot) {
        geneHot = new Handsontable(geneContainer, geneSettings)
    } else {
        geneHot.updateSettings(geneSettings)
        geneHot.render()
    }
}

function addGeneRow() {
    geneHot.alter('insert_row', geneHot.countRows())
}

async function bodyTable() {
    resetData()

    bodySchema = {
        "日付": "",
        "体重": "",
        "身長": "",
        "頭囲": ""
    }

    if (currentPatient) {
        let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
        if (!patientData['身体情報']) patientData['身体情報'] = []
        bodyData = patientData['身体情報']
        currentBodyData = bodyData
        // currentBodyData = JSON.parse(JSON.stringify(modalTableSettings))
    }

    bodyHeaders = Object.keys(bodySchema)
    bodyColumns = []

    bodyHeaders.forEach((h, i) => {
        let column = {
            data: h,
            type: h === '日付' ? 'date' : 'text',
        }

        if (h === '日付') {
            column.dateFormat = 'YYYY/MM/DD'
            column.correctFormat = true
        }

        bodyColumns.push(column)
    })

    Object.assign(bodySettings, {
        dataSchema: bodySchema,
        data: currentBodyData,
        colHeaders: bodyHeaders,
        columns: bodyColumns,
    })

    if (!bodyHot) {
        bodyHot = new Handsontable(bodyContainer, bodySettings)
    } else {
        bodyHot.updateSettings(bodySettings)
        bodyHot.render()
    }
}

function addBodyRow() {
    bodyHot.alter('insert_row', bodyHot.countRows())
}

function resetData() {
    if (geneHot) {
        geneHeaders = []
        geneColumns = []
        geneSchema = {}
        geneData = []
        geneHot.updateSettings(bodySettings)
        geneHot.render()
    }

    if (bodyHot) {
        bodyHeaders = []
        bodyColumns = []
        bodySchema = {}
        bodyData = {}
        bodyHot.updateSettings(bodySettings)
        bodyHot.render()
    }
}