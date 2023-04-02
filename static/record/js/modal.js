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
        dateOptions('p008') // death
        // add by hzhang@bits start
        phenotypeInfo_reset()
        // add by hzhang@bits end
    }

    function dateOptions(type) {
        let this_month, this_year, today
        today = new Date()
        this_year = today.getFullYear()
        this_month = today.getMonth() + 1

        optionLoop(1900, this_year, `${type}_year`)
        optionLoop(1, 12, `${type}_month`)
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
                            setAge()
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
                            setAge()
                            // onchange('p007', age)
                            changeDeathOptions('month')
                        }
                    }

                    setAge()
                    changeDeathOptions('year')
                    changeDeathOptions('month')

                    function setAge() {
                        let d = new Date()
                        let age
                        let year = document.querySelector(`.tab-wrap *[name="p006_year"]`).value
                        let month = document.querySelector(`.tab-wrap *[name="p006_month"]`).value

                        if (!month) {
                            age = d.getFullYear() - year
                        } else if (year === '0') {
                            age = ''
                        } else if (month && year) {
                            if (d.getMonth() + 1 >= parseInt(month)) {
                                age = d.getFullYear() - year
                                if (age === 0) age = '0'
                            } else {
                                age = d.getFullYear() - year - 1
                                if (age < 1) age = '0'
                            }
                        }

                        document.querySelector(`.tab-wrap *[name="p007"]`).value = age || ''
                        onchange('p007', age)
                    }

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
            let dateKey = ['p006', 'p008']

            if (dateKey.includes(key)) {
                let pre = key
                if (value === '') {
                    value = ''
                } else {
                    value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
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

    let infoTranslations = {
        en: [
            { 'Usable in a local environment': 'CaseSharing can be used in a local environment, allowing doctors and nurses to save case information on their own computers. This contributes to smoother information sharing and access within the hospital, and helps to streamline medical practices.' },
            { 'Try with sample data': 'Try out the system\'s functionality with sample data to get a better understanding of its operation and the components of case information.' },
            { 'Encouraging collaboration': 'In the future, we plan to expand the system\'s capabilities to enable smoother information sharing with other systems. This will lead to increased efficiency and productivity through better collaboration.' },
            { 'Multilingual support': 'The system supports languages such as English, Japanese, Korean, and Chinese, allowing people around the world to use the system in their own language and facilitating communication with users from different regions.' }
        ],
        ja: [
            { 'ローカル環境で使える': 'CaseSharingはローカル環境で使え、医師や看護師などが症例情報を自分のコンピューターに保存できることを意味します。これにより、病院内の情報共有やアクセスがスムーズになり、医療現場の効率化に貢献します。' },
            { 'サンプルデータで試す': 'サンプルデータを用いて本システムの使用イメージをつかみましょう。本システムの操作方法や症例情報の構成要素について理解を深めることができます。' },
            { 'コラボレーションを促進': '将来、他のシステムとスムーズに情報の共有ができるように、機能を拡張する予定です。情報の共有により業務の効率化や生産性向上につながります。' },
            { '多言語化': '本システムは英語、日本語、韓国語、中国語などの言語に対応しています。これにより、世界中の人々が、自分の言語で本システムを利用できるようになり、世界各地のユーザーとのコミュニケーションもスムーズになります。' }
        ],
        ko: [
            { '로컬 환경에서 사용 가능합니다.': 'CaseSharing은 로컬 환경에서 사용할 수 있으며, 의사나 간호사 등이 증례 정보를 자신의 컴퓨터에 저장할 수 있습니다. 이로 인해 병원 내 정보 공유와 접근이 원활해지며, 의료 현장의 효율화에 기여합니다.' },
            { '샘플 데이터로 시도해 보세요.': '샘플 데이터를 이용하여 본 시스템의 사용 이미지를 파악할 수 있습니다. 본 시스템의 조작 방법이나 증례 정보의 구성 요소에 대해 이해를 깊이 드실 수 있습니다.' },
            { '협업을 촉진합니다.': '앞으로 다른 시스템과 원활하게 정보 공유가 가능하도록 기능을 확장할 예정입니다. 정보 공유를 통해 업무의 효율화와 생산성 향상에 이어집니다.' },
            { '다국어화': '본 시스템은 영어, 일본어, 한국어, 중국어 등의 언어를 지원합니다. 이를 통해 전 세계 사람들이 자신의 언어로 본 시스템을 이용할 수 있게 되어, 세계 각지의 사용자들과의 커뮤니케이션도 원활해집니다.' }
        ],
        zh: [
            { '本地环境可用': 'CaseSharing可在本地环境中使用，意味着医生、护士等可以将病例信息保存在自己的计算机上。这将使医院内的信息共享和访问更加顺畅，为医疗现场的效率提供贡献。' },
            { '使用示例数据进行尝试': '使用示例数据来了解本系统的使用情况。您可以深入了解本系统的操作方法和病例信息的组成要素。' },
            { '促进协作': '未来，我们计划扩展功能，以便与其他系统顺畅共享信息。信息共享将促进业务效率和生产力的提高。' },
            { '多语言化': '本系统支持英语、日语、韩语、中文等多种语言。这将使世界各地的人们可以使用自己的语言使用本系统，与全球用户的沟通也将更加顺畅。' }
        ],
        zhct: [
            { '本地環境可使用。': 'CaseSharing 可在本地環境中使用，醫生和護士等可以將病例信息保存在自己的計算機上。這樣一來，醫院內的信息共享和訪問將變得更加順暢，有助於提高醫療效率。CaseSharing 可在本地環境中使用，醫生和護士等可以將病例信息保存在自己的計算機上。這樣一來，醫院內的信息共享和訪問將變得更加順暢，有助於提高醫療效率。' },
            { '使用樣例數據進行試用。': '利用樣例數據來瞭解本系統的使用方法。您可以深入理解本系統的操作方法和病例信息的組成要素。' },
            { '促進協作。': '未來，我們計劃擴展功能，使其能夠與其他系統順暢共享信息。信息共享有助於提高工作效率和生產力。' },
            { '多語言化。': '本系統支持英語、日語、韓語、中文等多種語言。這樣一來，全球各地的人們都可以使用自己的語言使用本系統，與世界各地的用戶進行順暢的溝通。' }
        ]
    }

    let modalContent = document.getElementById('modal-info-content')
    modalContent.innerHTML = `
        <ul>
            <li>
                <i class="material-symbols-outlined">
                    receipt_long
                </i>
                <span>
                    <h4>${Object.keys(infoTranslations[lang][0])}</h4>
                    <p>${Object.values(infoTranslations[lang][0])}
                    </p>
                </span>
            </li>
            <li>
                <i class="material-symbols-outlined">
                    subscriptions
                </i>
                <span>
                    <h4>${Object.keys(infoTranslations[lang][1])}</h4>
                    <p>${Object.values(infoTranslations[lang][1])}
                    </p>
                </span>
            </li>
            <li>
                <i class="material-symbols-outlined">
                    format_list_numbered
                </i>
                <span>
                    <h4>${Object.keys(infoTranslations[lang][2])}</h4>
                    <p>${Object.values(infoTranslations[lang][2])}
                    </p>
                </span>
            </li>
            <li>
                <i class="material-symbols-outlined">
                    sign_language
                </i>
                <span>
                    <h4>${Object.keys(infoTranslations[lang][3])}</h4>
                    <p>${Object.values(infoTranslations[lang][3])}
                    </p>
                </span>
            </li>
        </ul>
    `
}

function closeKarteModal() {
    if ($('#modal-karte').css('display') === 'block') {
        $('#modal-karte').fadeOut()
    }
}




//resize handle
const modal = document.querySelector('#modal-karte');
const resizeHandle = modal.querySelector('.resize-handle');

let isResizing = false;
let lastX = 0;

resizeHandle.addEventListener('mousedown', (event) => {
    isResizing = true;
    lastX = event.clientX;
});

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
