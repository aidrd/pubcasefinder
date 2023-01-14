let charts = []

function toggleTableChart(type) {
    if (type === 'table') {
        document.getElementById('content-patients').style.display = 'block'
        document.getElementById('charts-patients').style.display = 'none'
        document.getElementById('myGrid').click()
    } else if (type === 'chart') {
        document.getElementById('content-patients').style.display = 'none'
        document.getElementById('charts-patients').style.display = 'block'
        createChart()
    }
}

function createChart() {
    console.log(contentData)
    charts.forEach(c => c.destroy() )

    let sexData = contentData.map(d => d.sex)
    createPieChart(document.getElementById('pie-chart-sex'), sexData, '性別')

    // let ageSexData = contentData.map(({sex, age}) => { return {'sex': sex, 'age': age }})
    let groupData = contentData.map(d => d.group)
    createBarChart(document.getElementById('bar-chart-group'), groupData, 'グループ')

    function createPieChart(container, data, title) {
        let ctx = container.getContext('2d')
        let dataObject = {}

        for (let key of data) {
            dataObject[key] = dataObject[key] ? dataObject[key] + 1 : 1
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