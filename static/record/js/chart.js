let charts = []

function toggleTableChart(type) {
    $('.sidebar-selected').removeClass('sidebar-selected')
    if (type === 'table') {
        document.getElementById('content-patients').style.display = 'block'
        document.getElementById('charts-patients').style.display = 'none'
        document.getElementById('myGrid').click()
        $('.sidebar-patients').addClass('sidebar-selected')
    } else if (type === 'chart') {
        document.getElementById('content-patients').style.display = 'none'
        document.getElementById('charts-patients').style.display = 'block'
        $('.sidebar-analytics').addClass('sidebar-selected')
        createChart()
    }
}

/* changes start */
function createChart() {
    // console.log(contentData)
    charts.forEach(c => c.destroy())

    // let familyData = contentData.map(d => d['p002'])
    // createBarChart(document.getElementById('bar-chart-family'), familyData, '家族ID')

    let sexData = contentData.map(d => d['p009'])
    createPieChart(document.getElementById('pie-chart-sex'), sexData, translate('chart-title-sex'))

    let ageData = contentData.map(d => d['p007'])
    createPieChart(document.getElementById('pie-chart-age'), ageData, translate('chart-title-age'))

    // let ageSexData = contentData.map(({sex, age}) => { return {'sex': sex, 'age': age }})
    // let groupData = contentData.map(d => d['p004'])
    // createBarChart(document.getElementById('bar-chart-group'), groupData, 'グループ')

    function createPieChart(container, data, title) {
        let ctx = container.getContext('2d')
        let dataObject = {}

        for (let key of data) {
            let displayKey = key || translate('chart-title-null')
            dataObject[displayKey] = dataObject[displayKey] ? dataObject[displayKey] + 1 : 1
        }


        let chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(dataObject),
                datasets: [{
                    data: Object.values(dataObject)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        })

        charts.push(chart)
    }

    function createBarChart(container, data, title) {
        let ctx = container.getContext('2d')

        let dataObject = {}

        for (let key of data) {
            dataObject[key] = dataObject[key] ? dataObject[key] + 1 : 1
        }

        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dataObject),
                datasets: [{
                    data: Object.values(dataObject)
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        })

        charts.push(chart)
    }
}
/* changes end */