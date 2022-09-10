let currentPatient
let changedData = {}

function checkBoxRenderer(instance, td) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)

    if (isAllChecked) {
        td.innerHTML = `<input type="checkbox" class="checkbox" checked>`
    }
    else {
        td.innerHTML = `<input type="checkbox" class="checkbox">`
    }

    return td
}

function editRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.innerHTML = `<i class="material-icons-outlined">drive_file_rename_outline</i>`
    td.onclick = function() {
        openModal(false)

        let patientData = contentData.filter(d => { return d.PCFNo == value })[0]
        console.log('edit', patientData)

        document.getElementById('PCFNo').nextElementSibling.innerHTML = patientData['PCFNo']
        currentPatient = patientData['PCFNo']

        let radioText = ['allergies', 'drinking', 'smoking']

        for (let [key, value] of Object.entries(columns)) {
            value.forEach(v => {
                let dataKey, value
                switch (v.dataKey) {
                    case 'birth':
                        dataKey = 'birth_year'
                        value = patientData['生年月']
                        break
                    case 'death':
                        dataKey = 'death_year'
                        value = patientData['没年月']
                        break
                    default:
                        dataKey = v.dataKey
                        value = patientData[v.columnName]
                        isDate = false
                        break
                }

                let element = document.querySelector(`.tab-wrap *[name="${dataKey}"]`)
                if (!element) return

                if (dataKey === 'birth_year' || dataKey === 'death_year') {
                    let monthKey = dataKey === 'birth_year' ? 'birth_month' : 'death_month'
                    let date = value ? value.split('/') : ['']
                    value = date[0]

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthKey}"]`)
                    monthElement.value = date[1]
                    monthElement.onchange = function () {
                        onchange(dataKey === 'birth_year' ? '生年月' : '没年月')
                    }
                } else if (dataKey === 'groupID') {
                    document.getElementById('group_options').onchange = function(e) {
                        onchange('groupID', e.target.value)
                    }
                }

                if (radioText.includes(dataKey)) {
                    let radioInput = $(`.tab-wrap input[name="${dataKey}"]`)
                    $(`.tab-wrap input[name="${dataKey}"][value="${value ? '有' : '無'}"]`).prop('checked', true)

                    let textInput = $(`.tab-wrap input[name="${dataKey}-list"]`)
                    if (value) textInput.val(value)

                    textInput.on('input', function() {
                        onchange(v.columnName, textInput.val())
                        $(`.tab-wrap input[name="${dataKey}"][value="有"]`).prop('checked', true)
                    })

                    radioInput.on('click change', (e) => {
                        let radioValue = radioInput.val()

                        if (radioValue === '無') {
                            textInput.val('')
                        }

                        onchange(v.columnName, textInput.val())
                    })

                    return
                }

                element.onchange = function (e) {
                    onchange(v.columnName, e.target.value)
                }

                if (!value) return
                let type = element.type
                if (type === 'radio') {
                    $(`.tab-wrap input[name="${dataKey}"][value="${value}"]`).prop('checked', true)
                    $(`.tab-wrap input[name="${dataKey}"]`).on('click change', (e) => {
                        onchange(v.columnName, $(`.tab-wrap input[name="${dataKey}"]:checked`).val())
                    })
                } else {
                    element.value = value
                }
            })
        }
    }

    function onchange (key, value) {
        if (key === '生年月' || key === '没年月') {
            let pre = key === '生年月' ? 'birth' : 'death'
            value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
        }
        changedData[key] = value
    }
}

function removeRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)

    td.innerHTML = `<i class="material-icons-outlined">delete</i>`
    td.onclick = function() {
        if (confirm('削除してもよろしいでしょうか。')) hot.alter('remove_row', row, 1)
    }
}

function multipleRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    let displayValue = value
    if (value) {
        if (typeof value === 'string') {
            value = value.split(',')
        }
        displayValue = value.join(',<br>')
    }
    // td.innerHTML = value ? value.join('<br>') : value
    td.innerHTML = displayValue
}

function heightRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest('身長', value)
}

function weightRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest('体重', value)
}

function headRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest('頭囲', value)
}

function getLatest(type, value) {
    if (!value) return ''
    return value[value.length - 1][type]
}

Handsontable.renderers.registerRenderer('removeRenderer', removeRenderer)
Handsontable.renderers.registerRenderer('editRenderer', editRenderer)
Handsontable.renderers.registerRenderer('multipleRenderer', multipleRenderer)
Handsontable.renderers.registerRenderer('heightRenderer', heightRenderer)
Handsontable.renderers.registerRenderer('weightRenderer', weightRenderer)
Handsontable.renderers.registerRenderer('headRenderer', headRenderer)