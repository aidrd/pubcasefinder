let modalTableSettings = {
    rowHeaders: true,
    height: 'auto',
    colWidths: 100,
    contextMenu: true,
    allowRemoveColumn: true,
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
}

let geneHot
let geneSettings = structuredClone(modalTableSettings)
let geneHeaders = [], geneColumns = []
let geneSchema = {}, geneData = {}
let geneContainer = document.getElementById('geneModal')

let bodyHot
let bodySettings = structuredClone(modalTableSettings)
let bodyHeaders = [], bodyColumns = []
let bodySchema = {}, bodyData = {}
let bodyContainer = document.getElementById('bodyModal')

async function geneTable() {
    let data = [{
        "Gene": "",
        "Status": "",
        "Strategy": "",
        "Reference": "",
        "Chr:Position": "",
        "cDNA Change": "",
        "Pathogenicity": "",
        "Genotype": "",
        "Transcript": "",
        "Protein Change": "",
        "Annotations": "",
        "Inheritance": "",
        "Evidence": "",
        "Comments": ""
    }]

    getData('遺伝子型情報')

    geneHeaders = Object.keys(data[0])
    geneColumns = []

    let geneSources = {
        'Status': ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
        'Strategy': ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
        'Reference': ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
        'Pathogenicity': ['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
        'Genotype': ['heterozygous', 'homozygous', 'hemizygous'],
        'Annotations': ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
        'Inheritance': ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
        'Evidence': ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals']
    }

    geneHeaders.forEach((h, i) => {
        if (!(Object.keys(geneSources).includes(h))) {
            geneColumns.push({
                data: h,
            })
        } else {
            
            geneColumns.push({
                data: h,
                type: 'dropdown',
                source: geneSources[h]
            })
        }
    })

    Object.assign(geneSettings, {
        data: data,
        colHeaders: geneHeaders,
        columns: geneColumns,
    })

    if (!geneHot) {
        geneHot = new Handsontable(geneContainer, geneSettings)
    }
}

function addGeneRow() {
    geneHot.alter('insert_row', geneHot.countRows())
}

async function bodyTable() {
    bodySchema = [{
        "日付": "",
        "体重": "",
        "身長": "",
        "頭囲": ""
    }]

    getData('身体情報')
    // if (currentPatient) {
    //     let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
    //     bodyData = patientData['身体情報']
    // }

    bodyHeaders = Object.keys(bodySchema[0])
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
        data: bodyData,
        colHeaders: bodyHeaders,
        columns: bodyColumns,
    })

    if (!bodyHot) {
        bodyHot = new Handsontable(bodyContainer, bodySettings)
    } else {
        bodyHot.updateSettings(bodySettings)
    }
}

function addBodyRow() {
    bodyHot.alter('insert_row', bodyHot.countRows())
}

function getData(key) {
    if (!currentPatient) return

    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]

    if (key === '身体情報') {
        bodyData = patientData[key]
    } else {
        let tempData = []
        console.log(patientData)
    }
}
