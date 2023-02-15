$('.modal_open').click(() => {
    openModal(false)
})

$('#nav-info').click(() => {
    openInfo()
})

$('#nav-menu').click(() => {
    $('.common-menu').toggleClass('dropdown-menu-open')
})

$('#nav-language').click(() => {
    $('#dropdown-language').toggleClass('dropdown-menu-open')
})

$('#menu-save').click((e) => {
    $('.save-panel').toggleClass('save-panel-open')

    // window.onclick = (e) => {
    //     console.log(e.target.closest('.save-panel'))
    //     if (!e.target.closest('.save-panel')) $('.save-panel-open').toggleClass('save-panel-open')
    // }
})

$(function () {
    $('.tab-btn').on('click', function () {
        var tabWrap = $(this).parents('.tab-wrap')
        var tabBtn = tabWrap.find('.tab-btn')
        var tabContents = tabWrap.find('.tab-contents')
        tabBtn.removeClass('show')
        $(this).addClass('show')
        var elmIndex = tabBtn.index(this)
        tabContents.removeClass('show')
        tabContents.eq(elmIndex).addClass('show')

        if ($(tabContents.eq(elmIndex)).children('#geneModal')[0]) {
            geneTable()
        } else if ($(tabContents.eq(elmIndex)).find('#bodyModal')[0]) {
            bodyTable()
        }
    })
})

function openModal(patientId) {
    $('body').append('<div class="modal_bg"></div>')
    $('.modal_bg').fadeIn()

    var modal = '#modal-karte'
    modalReset()

    modalResize()
    populateOptions('group_options')
    populateOptions('family_options')

    // document.querySelector(`.tab-wrap *[name="p004"]`).onclick = function () {
    //     document.getElementById('group_options').style.display = 'block'
    // }

    inputValues()

    $(modal).fadeIn()

    $('.modal-close, .modal-copy').off().click(function (e) {
        editTable($(this).hasClass('modal-close'))

        if ($(this).hasClass('modal-copy')) copyPatient()

        $('.modal_box').fadeOut()
        $('.modal_bg').fadeOut('slow', function () {
            $('.modal_bg').remove()
        })

        bodyData = []
        bodyTable()
    })

    $('.modal-phenopackets').off().click(function (e) {
        generatePhenopackets()
    })

    $(window).on('resize', function () {
        modalResize()
    })


    function modalResize() {
        var w = $(window).width()
        var h = $(window).height()

        var x = (w - $(modal).outerWidth(true)) / 2
        var y = (h - $(modal).outerHeight(true)) / 2

        $(modal).css({ 'left': x + 'px', 'top': y + 'px' })
    }

    function modalReset() {
        $(`.tab-wrap input[type="text"], .tab-wrap textarea, .tab-wrap select`).val('')
        $('.tab-wrap input:radio').prop('checked', false)
        $('#p008').parent().hide()
        $('input[name="m012-list"]').hide() // allergies
        $('input[name="m015-list"]').hide() // drinking
        $('input[name="m016-list"]').hide() // smoking
        document.querySelector('.tab-btn').click()
        dateOptions('p006') // birth
        dateOptions('p008') // death
    }

    function dateOptions(type) {
        var optionLoop, this_month, this_year, today
        today = new Date()
        this_year = today.getFullYear()
        this_month = today.getMonth() + 1

        optionLoop = function (start, end, id) {
            let opt = `<option value="0" hidden>${end === 12 ? translate('select-month') : translate('select-year') }</option>`
 
            if (end === 12) {
                for (let i = start; i <= end; i++) {
                    let display = i
                    let temp = i
    
                    if (temp % 10 === 0 && end !== 12) display = `${i}s`
    
                    opt += `<option value="${i.toString().padStart(2, '0')}">${display}</option>`
                }
            } else {
                for (let i = end; i >= start; i--) {
                    opt += `<option value="${i.toString().padStart(2, '0')}"}>${i}</option>`
                }
            }

            return document.querySelector(`.tab-wrap *[name="${id}"]`).innerHTML = opt
        }

        optionLoop(1900, this_year, `${type}_year`)
        optionLoop(1, 12, `${type}_month`)
    }

    function populateOptions(element) {
        let parent = document.getElementById(element)
        if (!parent) return

        parent.innerHTML = ''
        let data = element === 'group_options' ? JSON.parse(JSON.stringify(groupOptions)) : JSON.parse(JSON.stringify(familyOptions))

        let firstOption = element === 'group_options' ? translate('select-group') : translate('select-family')
        data.unshift(firstOption)

        data.forEach(d => {
            let option = document.createElement('option')
            option.value = d
            option.innerText = d
            parent.appendChild(option)
        })
    }

    function inputValues() {
        let patientData = {}
        let PCFNo = ''
        if (patientId) {
            patientData = contentData.filter(d => { return d.PCFNo == patientId })[0]
            currentPatient = patientData['PCFNo']
            PCFNo = patientData['PCFNo']
        } else {
            let d = new Date()
            PCFNo = `P${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`
            let num = hot.countRows() + 1
            if (count) {
                document.querySelector(`.tab-wrap *[name="p001"]`).value = `P${count.toString().padStart(7, 0)}`
            } else {
                document.querySelector(`.tab-wrap *[name="p001"]`).value = `P${num.toString().padStart(7, 0)}`
                count = num
            }        
        }

        document.getElementById('PCFNo').nextElementSibling.innerHTML = PCFNo

        categories.forEach(category => {
            if (category.dataKey === 'phenotypicInfo') return

            category.columns.forEach(c => {
                let value, colId = c.columnId
                switch (colId) {
                    case 'p006':
                        value = patientData[colId]
                        colId = `${colId}_year`
                        break
                    case 'p008':
                        value = patientData[colId]
                        colId = `${colId}_year`
                        break
                    default:
                        value = patientData[colId]
                        if (c.options) {
                            value = getDataDisplayOption(c.options, value, 'dataValue')
                        }
                        break
                }

                let element = document.querySelector(`.tab-wrap *[name="${colId}"]`)
                if (!element) return

                let radioInput = $(`.tab-wrap input[name="${colId}"]`)
 
                if (colId === 'p005') {
                    let parent = $('#p008').parent()
                    showHideDeathDate(parent, value)

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        showHideDeathDate(parent, radioValue)
                        if (radioValue === 'alive') onchange('p008', '')
                    })
                } else if (colId === 'p006_year' || colId === 'p008_year') {
                    let monthId = colId === 'p006_year' ? 'p006_month' : 'p008_month'
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(colId === 'p006_year' ? 'p006' : 'p008')

                        if (colId === 'p006_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="p007"]`).value = age
                            onchange('p007', age)
                        }
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthId}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange(colId === 'p006_year' ? 'p006' : 'p008')

                        if (colId === 'p006_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="p007"]`).value = age
                            onchange('p007', age)
                        }
                    }

                    function getAge() {
                        let d = new Date()
                        let age
                        let year = document.querySelector(`.tab-wrap *[name="p006_year"]`).value
                        let month = document.querySelector(`.tab-wrap *[name="p006_month"]`).value
                        console.log(year, month)
                        if (!month) {
                            age = d.getFullYear() - year
                        } else if (month && year) {
                            if (d.getMonth() >= month) {
                                age = d.getFullYear() - year
                            } else {
                                age = d.getFullYear() - year - 1
                                if (age < 1) age = '0'
                            }
                        }

                        return age || ''
                    }

                    return
                } else if (colId === 'p004') {
                    document.getElementById('group_options').onchange = function(e) {
                        onchange('p004', e.target.value)
                    }
                } else if (colId === 'p002') {
                    document.getElementById('family_options').onchange = function(e) {
                        onchange('p002', e.target.value)
                    }
                }

                if (['m012', 'm015', 'm016'].includes(colId)) {
                    $(`.tab-wrap input[name="${colId}"][value="${value ? 'yes' : 'no'}"]`).prop('checked', true)

                    let textInput = $(`.tab-wrap input[name="${colId}-list"]`)

                    if (value) {
                        textInput.show()
                        textInput.val(value)
                    }

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        if (radioValue === 'no') {
                            textInput.hide()
                            onchange(colId, '')
                        } else {
                            textInput.show()
                            textInput.on('change', () => {
                                onchange(colId, textInput.val())
                            })
                        }
                    })

                    return
                }

                element.onchange = function (e) {
                    let targetValue = e.target.value
                    if (e.target.type === 'select-one') {
                        targetValue = getDataDisplayOption(c.options, targetValue, 'displayValue')
                    }
                    onchange(colId, targetValue)
                }

                let type = element.type
                if (type === 'radio') {
                    $(`.tab-wrap input[name="${colId}"]`).on('click change', (e) => {
                        let targetValue = $(`.tab-wrap input[name="${colId}"]:checked`).val()
                        targetValue = getDataDisplayOption(c.options, targetValue, 'displayValue')
                        onchange(colId, targetValue)
                    })
                }

                if (!value) return

                if (type === 'radio') {
                    $(`.tab-wrap input[name="${colId}"][value="${value}"]`).prop('checked', true)
                } else {
                    element.value = value
                }
            })
        })

        let dateKey = ['p006', 'p008']

        function onchange (key, value, element) {
            if (dateKey.includes(key)) {
                let pre = key
                if (value === '') {
                    value = ''
                } else {
                    value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
                }
            }
            changedData[key] = value
        }

        function showHideDeathDate(parent, value) {
            if (value === 'deceased') {
                parent.show()
            } else {
                parent.hide()
            }
        }

        function getDataDisplayOption(columnOptions, value, type) {
            let returnVal = value

            let options = columnOptions['dataValue']
            if (type === 'dataValue') {
                options = columnOptions[lang].length > 0 ? columnOptions[lang] : columnOptions['en']
            }

            let index = options.indexOf(value)
            if (index > -1) {
                returnVal = type === 'dataValue' ? columnOptions['dataValue'][index] : columnOptions[lang][index]
            }

            return returnVal
        }
    }
}

// TODO!! update
function generatePhenopackets() {
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]    
    if (!patientData) return

    let vitalStatus = {
        status: translate(patientData['lifeStatus'])
    }

    if (patientData['lifeStatus'] === 'deceased') {
        vitalStatus.timeOfDeath = {
            timestamp: patientData['death']
        }
    }

    let phenopacket = {
        phenopacket: {
            id: patientData['group'] || '',
            subject: {
                id: currentPatient,
                sex: translate(patientData['sex']),
                dateOfBirth: patientData['birth'],
                vitalStatus: vitalStatus
            }
        }
    }

    jsonToYaml()

    function jsonToYaml() {
        let jsonString = JSON.stringify(phenopacket)
        exportFile('yaml', YAML.parse(jsonString))
    }

    function exportFile(type, file) {
        let a = document.createElement('a')
        a.download = `patients_${Date.now()}.${type}`
        a.style.visibility = 'hidden'
    
        let data = `text/yaml;charset=utf-8,` +
            `${encodeURIComponent(YAML.stringify(file, 10))}`
        a.href = `data:${data}`
    
        document.body.appendChild(a)
        a.click()
        a.remove()
    }
}

let dictionary = {
    '男性': 'MALE',
    '女性': 'FEMALE',
    '不明': 'UNKNOWN_STATUS',
    '生存': 'ALIVE',
    '故人': 'DECEASED'
}

function translate(word) {
    if (!word) return ''
    return dictionary[word]
}

function copyPatient() {
    let patientId = document.getElementById('PCFNo').nextElementSibling.innerHTML
    let patientData = contentData.filter(d => { return d.PCFNo == patientId })[0]
    if (!patientData) return

    let temp = JSON.parse(JSON.stringify(patientData))
    delete temp.PCFNo

    addRow(temp)
}

function openInfo() {
    $('body').append('<div class="modal_bg"></div>')
    $('.modal_bg').fadeIn()

    let modal = '#modal-info'
    $(modal).fadeIn()

    modalResize()

    $(window).on('resize', function () {
        modalResize()
    })
    
    function modalResize() {
        var w = $(window).width()
        var h = $(window).height()
    
        var x = (w - $(modal).outerWidth(true)) / 2
        var y = (h - $(modal).outerHeight(true)) / 2
    
        $(modal).css({ 'left': x + 'px', 'top': y + 'px' })
    }

    $('.info-modal-close, .modal_bg').off().click(function (e) {
        $('.modal_box').fadeOut()
        $('.modal_bg').fadeOut('slow', function () {
            $('.modal_bg').remove()
        })
    })
}