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
        $('.modal_open').click()
console.log(value)

        let patientData = contentData.filter(d => { return d.PCFNo == value })[0]
        console.log('edit', patientData)

        document.getElementById('PCFNo').nextElementSibling.innerHTML = patientData['PCFNo']
        currentPatient = patientData['PCFNo']

        for (let [key, value] of Object.entries(columns)) {
            value.forEach(v => {

                let element = document.querySelector(`.tab-wrap *[name="${v.dataKey}"]`)
                let value = patientData[v.columnName]

                if (element) {
                    element.onchange = function (e) {
                        changedData[v.columnName] = e.target.value
                        // patientData[v.columnName] = e.target.value
                        // hot.render()
                    }
                }

                if (!element || !value) return

                let type = element.type
                if (type === 'radio') {
                    document.querySelector(`.tab-wrap input[value="${value}"]`).checked = true
                } else if (type === 'select-one') {
                    element.value = value
                } else if (type === 'date') {
                    // let date = moment(new Date(value)).format('YYYY-MM-DD')
                    // element.value = date
                } else {
                    element.value = value
                }
            })
        }
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
    td.innerHTML = `<i class="material-icons-outlined">delete</i>`
    td.onclick = function() {
        if (confirm('削除してもよろしいでしょうか。')) hot.alter('remove_row', row, 1)
    }
}

Handsontable.renderers.registerRenderer('removeRenderer', removeRenderer)
Handsontable.renderers.registerRenderer('editRenderer', editRenderer)