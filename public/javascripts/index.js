window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
  }

  // Now you can start your app & access web3 freely:
  startApp()
})

function startApp() {
  sendTransaction()
  renderModal()

  ajaxLoad('/vote', function(res) {
    var data = JSON.parse(res)
    console.log(data);
    renderChart(data)
  })
}

function sendTransaction() {
  var sendButton = document.querySelectorAll('.send')

  for (var i = 0; i < sendButton.length; i++) {
    if (typeof web3 !== 'undefined') {
      sendButton[i].addEventListener('click', function() {
        if (web3.eth.accounts.length === 0) {
          return alert('No accounts added to dapp')
        }

        web3.eth.sendTransaction({
          from: web3.eth.accounts[0],
          to: this.dataset.address,
          value: 0,
        }, function(err, address) {
          if (!err) {
            console.log('sendTransaction', address)
          }
        })
      })
    } else {
      sendButton[i].classList.add('hide')
    }
  }
}

function renderChart(data) {
  var pieChartContext = document.getElementById("pie-chart")
  var pieChart = new Chart(pieChartContext, {
    type: 'doughnut',
    data: {
      labels: ['YES', 'NO'],
      datasets: [{
        data: [data.yes_precentage, data.no_precentage],
        backgroundColor: [
          "#36A2EB",
          "#FFCE56"
        ],
      }],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
        position: 'bottom',
      }
    }
  })

  var barChartContext = document.getElementById("bar-chart")
  var barChart = new Chart(barChartContext, {
    type: 'horizontalBar',
    data: {
      labels: [
        'NO',
        'YES: 0 ≤ reward < 1.5',
        'YES: 1.5 ≤ reward < 2',
        'YES: 2 ≤ reward < 3',
        'YES: 3 ≤ reward < 4',
        'YES: reward ≥ 4',
      ],
      datasets: [{
        data: [
          data.no_vote_amount,
          data.yes_drilldown[0][1],
          data.yes_drilldown[1][1],
          data.yes_drilldown[2][1],
          data.yes_drilldown[3][1],
          data.yes_drilldown[4][1]
        ],
        backgroundColor: [
            "#FFCE56",
            "#36A2EB",
            "#36A2EB",
            "#36A2EB",
            "#36A2EB",
            "#36A2EB",
        ],
      }],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          ticks: {
            fontSize: 12,
            lineHeight: 1.5,
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 12,
            lineHeight: 1.5,
          }
        }]
      }
    }
  })
}

function renderModal() {
  var showExchangeList = document.querySelector('#show-exchange-list')
  var exchangeList = document.querySelector('.exchange-list')
  showExchangeList.addEventListener('click', function(e) {
    e.preventDefault()
    modal.setContent(exchangeList.innerHTML)
    modal.open()
  })

  var modal = new tingle.modal({
    stickyFooter: false,
    closeLabel: "Close",
  })
}

function ajaxLoad(url, callback) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
      if (xmlhttp.status == 200) {
        callback(xmlhttp.responseText)
      }
      else if (xmlhttp.status == 400) {
        console.log('There was an error 400');
      }
      else {
        console.log('something else other than 200 was returned');
      }
    }
  }

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
