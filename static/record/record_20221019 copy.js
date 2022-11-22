let movePlugin, autoRowSizePlugin
let isAllChecked = true
let toSave = false
let toReset = true


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
    

    // if (type === 'json') exportedString = { 'PATIENTS': dlData }
    if (type === 'json') exportedString = getJSONDownload(dlData)
    if (type === 'csv') exportedString = Papa.unparse(dlData.PATIENTS)
    if (type === 'tsv') exportedString = Papa.unparse(dlData.PATIENTS, { delimiter: '\t' })

    exportFile(type, exportedString)

    function getJSONDownload(dlData) {
        let jsonResult = { 'PATIENTS': dlData }
        let headers = []

        colHeaders.forEach(c => {
            let header = c.replace('<i class="material-icons-outlined sort_icon"></i>', '')
            if (header !== '') headers.push(header)
        })

        jsonResult['visibleColumns'] = headers

        return jsonResult
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
            existingHeaders = []

            object.visibleColumns.forEach(vc => {
                colHeaders.push(dataColumns[vc]['colHeader'])
                headers.push(dataColumns[vc]['column'])
                existingHeaders.push(vc)
            })

            rerenderTable()
        }
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

        if (idx > 0) data['PCFNo'] = d[0]

        for (let i = 0; i < d.length; i++) {
            if (isExport) {
                if (notIncluded.includes(i)) continue
            }

            if (idx === 0) continue

            let headerText = isExport ? headers[i].replace('<i class="material-icons-outlined sort_icon"></i>', '') : headers[i]

            let value = d[i]

            if (['体重', '身長', '頭囲'].includes(headerText)) {
                if (contentData.length > 0) {
                    let bodyInfo = contentData[idx - 1]['身体情報']
                    if (bodyInfo) {
                        value = bodyInfo[bodyInfo.length - 1][headerText]
                    } else {
                        value = ''
                    }
                }
            }

            data[headerText] = value
        }

        if (Object.keys(data).length > 0) patientsData.push(data)
    })

    return { PATIENTS: patientsData }
}


async function updateTable(data, changeHeaders) {
    // headers = columns (settings - type, options, renderer, etc)
    // colHeaders = headers
    data.map(d => {
        contentData.push(d)
    })

    if (contentData.length > 0) {
        let newHeaders = Object.keys(data[0])

        if (changeHeaders  === 'text/csv' || changeHeaders === 'text/tab-separated-values') {
            headers.splice(2, headers.length)
            colHeaders.splice(2, colHeaders.length)
            existingHeaders = []
            customColumns = []
    
            newHeaders.forEach(h => {
                if (h === 'PCFNo') return
    
                if (h === '身体情報') {
                    createColumn('体重')
                    createColumn('身長')
                    createColumn('頭囲')
                } else {
                    createColumn(h)
                }
            })
        } else {
            newHeaders.forEach(h => {
                if (h === 'PCFNo' || h === '身体情報') return
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
        headers.push(headerData)
        existingHeaders.push(h)
    }

    Object.assign(updateSettings, {
        data: contentData,
        colHeaders: colHeaders,
        columns: headers
    })

    contentData.map(d => {
        let groupId = d['グループ名']
        if (groupId && !(groupOptions.includes(groupId))) groupOptions.push(groupId)

        let patientId = d['患者ID']
        if (patientId && !(patientOptions.includes(patientId))) patientOptions.push(patientId)

        let familyId = d['家族ID']
        if (familyId && !(familyOptions.includes(familyId))) familyOptions.push(familyId)
    })

    hot.updateSettings(updateSettings)
    hot.render()

    document.getElementById('row_count').innerHTML = `${hot.countRows()}`

    // populateGroups()
}

