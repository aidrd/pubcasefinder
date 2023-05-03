$('.modal_open').click(() => {
    openModal(false)
})

$('#nav-info').click(() => {
    openInfo()
})

$('#nav-menu').click(() => {
    closeKarteModal()
    $('.common-menu').toggleClass('dropdown-menu-open')
})

$('#nav-language').click(() => {
    closeKarteModal()
    $('#dropdown-language').toggleClass('dropdown-menu-open')
})

// $('#menu-save').click((e) => {
//     closeKarteModal()
//     if (e.target.closest('.save-panel')) return
//     $('.save-panel').toggleClass('save-panel-open');
//     $('#menu-save div.popup-bg-cover')[0].style.display = "block";
// })
// $('#menu-save div.popup-bg-cover').click((e) => {
//     $('.save-panel').toggleClass('save-panel-open');
// });

$('#menu-save').click((e) => {
    closeKarteModal();
    if (e.target.closest('.save-panel')) return;
    $('.save-panel').toggleClass('save-panel-open');
    $('#menu-save .popup-bg-cover').addClass('active');
});

$('#menu-save .popup-bg-cover').click(() => {
    $('.save-panel').removeClass('save-panel-open');
    $('#menu-save .popup-bg-cover').removeClass('active');
});

$(document).mouseup((e) => {
    const container = $('.save-panel');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass('save-panel-open');
        $('#menu-save .popup-bg-cover').removeClass('active');
    }
});


$('.nav-list a').on('click', closeKarteModal)

// window.onclick = (e) => {
//     if ($('.save-panel-open')) {
//         console.log(e.target.closest('.save-panel'))
//         return
//     }

//     console.log('not open')
//     //     if (!e.target.closest('.save-panel')) $('.save-panel-open').toggleClass('save-panel-open')
// }

// $(function () {
//     $('.tab-btn').on('click', function () {
//         var tabWrap = $(this).parents('.tab-wrap')
//         var tabBtn = tabWrap.find('.tab-btn')
//         var tabContents = tabWrap.find('.tab-contents')
//         tabBtn.removeClass('show')
//         $(this).addClass('show')
//         var elmIndex = tabBtn.index(this)
//         tabContents.removeClass('show')
//         tabContents.eq(elmIndex).addClass('show')

//         if ($(tabContents.eq(elmIndex)).children('#geneModal')[0]) {
//             geneTable()
//         } else if ($(tabContents.eq(elmIndex)).find('#bodyModal')[0]) {
//             bodyTable()
//         }
//     })
// })

function openModal(patientId) {
    // $('body').append('<div class="modal_bg modal_karte_bg"></div>')

    var modal = '#modal-karte'

    modalReset()

    modalResize()
    populateOptions('group_options')
    populateOptions('family_options')

    inputValues()

    $(modal).fadeIn()

    $('.modal-close, .modal-copy').off().click(function (e) {
        editTable($(this).hasClass('modal-close'))

        if ($(this).hasClass('modal-copy')) copyPatient()

        $('.modal_box').fadeOut()
        // $('.modal_bg').fadeOut(1000, function () {
        //     $('.modal_bg').remove()
        // })

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
        dateOptions('p007') // age
        dateOptions('p008') // death
        dateOptions('p00b', true) // ExaminationDay
        // add by hzhang@bits start
        phenotypeInfo_reset()
        // add by hzhang@bits end
    }

    function dateOptions(type, includeDay = false) {
        let this_month, this_year, today
        today = new Date()
        this_year = today.getFullYear()
        this_month = today.getMonth() + 1

        optionLoop(1900, this_year, `${type}_year`)
        optionLoop(1, 12, `${type}_month`)
        if(includeDay)
            document.querySelector(`.tab-wrap *[name="${type}_day"]`).innerHTML = createDayOptions();
    }

    function createDayOptions(id) {
        let options = `<option value="0">${translate('select-day')}</option>`;
        for (let i = 1; i <= 31; i++) {
            options += `<option value="${i.toString().padStart(2, '0')}">${i}</option>`;
        }
        return options;
    }

    function optionLoop(start, end, id) {
        start = parseInt(start) || 1
        end = parseInt(end)
        let opt = `<option value="0">${end === 12 ? translate('select-month') : translate('select-year')}</option>`
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
            // let d = new Date()
            // PCFNo = `P${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`
            // let num = localStorage.patientCount ? parseInt(localStorage.patientCount) + 1 : hot.countRows() + 1
            // document.querySelector(`.tab-wrap *[name="p001"]`).value = `P${num.toString().padStart(7, 0)}`
            addRow()
            patientData = contentData[contentData.length - 1]
            currentPatient = patientData['PCFNo']
            PCFNo = patientData['PCFNo']

            // if (count) {
            //     document.querySelector(`.tab-wrap *[name="p001"]`).value = `P${count.toString().padStart(7, 0)}`
            // } else {
            //     document.querySelector(`.tab-wrap *[name="p001"]`).value = `P${num.toString().padStart(7, 0)}`
            //     count = num
            // }        
        }

        document.getElementById('PCFNo').nextElementSibling.innerHTML = PCFNo

        categories.forEach(category => {
            // modified by hzhang@bits start
            //if (category.dataKey === 'phenotypicInfo') return
            if (category.dataKey === 'phenotypicInfo') {
                phenotypeInfo_inputValues(patientData);
                return;
            }
            // modified by hzhang@bits end

            category.columns.forEach(c => {
                let value, colId = c.columnId
                switch (colId) {
                    case 'p006':
                    case 'p008':
                    case 'p00b':
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
                    showHideDeathDate(parent, 'deceased')

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        // showHideDeathDate(parent, radioValue)
                        if (radioValue === 'alive') onchange('p008', '')
                    })
                } else if(colId === 'p00b_year') {
                    let monthId = 'p00b_month'
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange('p00b')
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthId}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange('p00b')
                    }
                    let dayElement = document.querySelector(`.tab-wrap *[name="p00b_day"]`)
                    let dayValue = date[2]
                    if (dayValue) dayElement.value = dayValue
                    dayElement.onchange = function () {
                        onchange('p00b')
                    }
                    return
                } else if (colId === 'p006_year' || colId === 'p008_year') {
                    let monthId = colId === 'p006_year' ? 'p006_month' : 'p008_month'
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(colId === 'p006_year' ? 'p006' : 'p008')

                        if (colId === 'p006_year') {
                            // onchange('p007', age)
                            changeDeathOptions('year')
                        } else if (colId === 'p008_year') {
                            changeDeathOptions('month')
                        }
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthId}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    // cancelIdleCallback.onchange = function () {
                    monthElement.onchange = function () {
                        onchange(colId === 'p006_year' ? 'p006' : 'p008')
                        if (colId === 'p006_year') {
                            // onchange('p007', age)
                            changeDeathOptions('month')
                        }
                    }

                    changeDeathOptions('year')
                    changeDeathOptions('month')

                    function changeDeathOptions(type) {
                        let d = new Date()

                        let birthYear = document.querySelector(`.tab-wrap *[name="p006_year"]`).value
                        let birthMonth = document.querySelector(`.tab-wrap *[name="p006_month"]`).value

                        let deathYear = document.querySelector(`.tab-wrap *[name="p008_year"]`).value

                        if (type === 'year') {
                            optionLoop(birthYear, d.getFullYear(), `p008_year`)
                        } else if (type === 'month') {
                            if (deathYear === birthYear) {
                                optionLoop(birthMonth, 12, `p008_month`)
                            }
                        }
                    }

                    return
                } else if (colId === 'p004') {
                    document.getElementById('group_options').onchange = function (e) {
                        onchange('p004', e.target.value)
                        e.target.previousSibling.value = e.target.value
                        e.target.selectedIndex = 0
                    }
                } else if (colId === 'p002') {
                    document.getElementById('family_options').onchange = function (e) {
                        onchange('p002', e.target.value)
                        e.target.previousSibling.value = e.target.value
                        e.target.selectedIndex = 0
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
                    if (e.target.type === 'select-one' || colId === 'p005') {
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

        function onchange(key, value, element) {
            let dateKey = ['p006', 'p008', 'p00b']

            if (dateKey.includes(key)) {
                let pre = key
                if (value === '') {
                    value = ''
                } else {
                    let year = document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value
                    let month = document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value
                    let day = document.querySelector(`.tab-wrap *[name="${pre}_day"]`)?.value
                    if (year === '0' & month === '0') {
                        value = ''
                    } else if(day) {
                        value = `${year}/${month}/${day}`
                    }  else {
                        value = `${year}/${month}`
                    }
                }
            }

            contentData.forEach(p => {
                if (p.PCFNo === currentPatient) p[key] = value
            })

            changedData[key] = value
            hot.render()
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

    // let category = categories.filter(c => { return c.categoryId === dataColumns['p005'].category })
    // let columnDetails = category[0].columns.filter(c => { return c.columnId === 'p005' })
    // let options = columnDetails[0].options[lang]
    // let index = options.indexOf(patientData['p005'])
    // console.log(index, columnDetails[0].options.dataValue[index])
    // console.log(patientData['p005'])

    let status
    if (patientData['p005'] === 'alive' || patientData['p005'] === 'Alive' || patientData['p005'] === '生存') {
        status = 'ALIVE'
    } else {
        status = 'DECEASED'
    }

    let vitalStatus = {
        status: status
    }

    if (status === 'DECEASED') {
        vitalStatus.timeOfDeath = {
            timestamp: patientData['p008']
        }
    }

    // category = categories.filter(c => { return c.categoryId === dataColumns['p009'].category })
    // columnDetails = category[0].columns.filter(c => { return c.columnId === 'p009' })
    // options = columnDetails[0].options[lang]
    // index = options.indexOf(patientData['p009'])
    // console.log(options, index)

    let sex
    if (patientData['p009'] === '男性' || patientData['p009'] === 'male' || patientData['p009'] === 'Male') {
        sex = 'MALE'
    } else if (patientData['p009'] === '女性' || patientData['p009'] === 'female' || patientData['p009'] === 'Female') {
        sex = 'FEMALE'
    } else {
        sex = 'UNKNOWN_STATUS'
    }


    let phenopacket = {
        phenopacket: {
            id: patientData['p004'] || '',
            subject: {
                id: currentPatient,
                sex: sex,
                dateOfBirth: patientData['p006'],
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
    closeKarteModal()

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

function closeKarteModal() {
    if ($('#modal-karte').css('display') === 'block') {
        $('#modal-karte').fadeOut()
    }
}




//resize handle
const modal = document.querySelector('#modal-karte');

let isResizing = false;
let lastX = 0;
if (modal) {
    const resizeHandle = modal.querySelector('.resize-handle');


    resizeHandle.addEventListener('mousedown', (event) => {
        isResizing = true;
        lastX = event.clientX;
    });
}

document.addEventListener('mousemove', (event) => {
    if (!isResizing) return;

    const delta = event.clientX - lastX;
    lastX = event.clientX;
    const modalWidth = parseInt(getComputedStyle(modal).getPropertyValue('width'));
    const newWidth = modalWidth - delta;
    if (newWidth < 400) newWidth = 400;
    if (newWidth < 520) {
        document.querySelectorAll("#modal-karte .tab-wrap ul .tab-btn span").forEach(elem => elem.style.display = "none");
    } else {
        document.querySelectorAll("#modal-karte .tab-wrap ul .tab-btn span").forEach(elem => elem.style.display = "block");
    }


    modal.style.width = newWidth + 'px';
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});
