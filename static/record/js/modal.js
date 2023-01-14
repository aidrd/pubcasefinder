$('.modal_open').click(function () {
    openModal(false)
})

$(function () {
    $('.tab-btn').on('click', function () {
        var tabWrap = $(this).parents('.tab-wrap')
        var tabBtn = tabWrap.find(".tab-btn")
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

    document.querySelector(`.tab-wrap *[name="group"]`).onclick = function () {
        document.getElementById('group_options').style.display = 'block'
    }

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
        $('#death').parent().hide()
        $('input[name="allergies-list"]').hide()
        $('input[name="drinking-list"]').hide()
        $('input[name="smoking-list"]').hide()
        document.querySelector('.tab-btn').click()
        dateOptions('birth')
        dateOptions('death')
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
                document.querySelector(`.tab-wrap *[name="patientId"]`).value = `P${count.toString().padStart(7, 0)}`
            } else {
                document.querySelector(`.tab-wrap *[name="patientId"]`).value = `P${num.toString().padStart(7, 0)}`
                count = num
            }        
        }

        document.getElementById('PCFNo').nextElementSibling.innerHTML = PCFNo

        categories.forEach(category => {
            if (category.dataKey === 'phenotypicInfo') return

            category.columns.forEach(c => {
                let dataKey, value
                switch (c.dataKey) {
                    case 'birth':
                        dataKey = 'birth_year'
                        value = patientData['birth']
                        break
                    case 'death':
                        dataKey = 'death_year'
                        value = patientData['death']
                        break
                    default:
                        dataKey = c.dataKey
                        value = patientData[c.dataKey]
                        if (c.options) {
                            value = getDataDisplayOption(c.options, value, 'dataValue')
                        }
                        break
                }

                let element = document.querySelector(`.tab-wrap *[name="${dataKey}"]`)
                if (!element) return

                let radioInput = $(`.tab-wrap input[name="${dataKey}"]`)
 
                if (dataKey === 'lifeStatus') {
                    let parent = $('#death').parent()
                    showHideDeathDate(parent, value)

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        showHideDeathDate(parent, radioValue)
                        if (radioValue === 'alive') onchange('death', '')
                    })
                } else if (dataKey === 'birth_year' || dataKey === 'death_year') {
                    let monthKey = dataKey === 'birth_year' ? 'birth_month' : 'death_month'
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(dataKey === 'birth_year' ? 'birth' : 'death')

                        if (dataKey === 'birth_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="age"]`).value = age
                            onchange('age', age)
                        }
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthKey}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange(dataKey === 'birth_year' ? 'birth' : 'death')

                        if (dataKey === 'birth_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="age"]`).value = age
                            onchange('age', age)
                        }
                    }

                    function getAge() {
                        let d = new Date()
                        let age
                        let year = document.querySelector(`.tab-wrap *[name="birth_year"]`).value
                        let month = document.querySelector(`.tab-wrap *[name="birth_month"]`).value

                        if (!month) {
                            age = d.getFullYear() - year
                        } else if (month && year) {
                            if (d.getMonth() >= month) {
                                age = d.getFullYear() - year
                            } else {
                                age = d.getFullYear() - year - 1
                            }
                        }

                        return age || ''
                    }

                    return
                } else if (dataKey === 'group') {
                    document.getElementById('group_options').onchange = function(e) {
                        onchange('group', e.target.value)
                    }
                } else if (dataKey === 'familyId') {
                    document.getElementById('family_options').onchange = function(e) {
                        onchange('familyId', e.target.value)
                    }
                }

                if (['allergies', 'drinking', 'smoking'].includes(dataKey)) {
                    $(`.tab-wrap input[name="${dataKey}"][value="${value ? 'yes' : 'no'}"]`).prop('checked', true)

                    let textInput = $(`.tab-wrap input[name="${dataKey}-list"]`)

                    if (value) {
                        textInput.show()
                        textInput.val(value)
                    }

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        if (radioValue === 'no') {
                            textInput.hide()
                            onchange(dataKey, '')
                        } else {
                            textInput.show()
                            textInput.on('change', () => {
                                onchange(dataKey, textInput.val())
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
                    onchange(dataKey, targetValue)
                }

                let type = element.type
                if (type === 'radio') {
                    $(`.tab-wrap input[name="${dataKey}"]`).on('click change', (e) => {
                        let targetValue = $(`.tab-wrap input[name="${dataKey}"]:checked`).val()
                        targetValue = getDataDisplayOption(c.options, targetValue, 'displayValue')
                        onchange(dataKey, targetValue)
                    })
                }

                if (!value) return

                if (type === 'radio') {
                    $(`.tab-wrap input[name="${dataKey}"][value="${value}"]`).prop('checked', true)
                } else {
                    element.value = value
                }
            })
        })

        let dateKey = ['birth', 'death']

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