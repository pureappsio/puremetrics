Template.graph.onRendered(function() {

    Meteor.call('loadSalesGraphData', function(err, graphData) {

        var ctx = document.getElementById("sales");

        var data = {
            datasets: graphData
        }

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

    Meteor.call('loadSessionsGraphData', function(err, graphData) {

        var ctx = document.getElementById("sessions");

        console.log(graphData);

        var datasets = [];
        for (site in graphData) {

            var color = getRandomColor();

            var dataset = {
                label: site,
                fill: false,
                lineTension: 0.1,
                backgroundColor: color,
                borderColor: color,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: color,
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: graphData[site],
                spanGaps: false,
            }
            datasets.push(dataset);

        }

        var data = {
            datasets: datasets
        }

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
