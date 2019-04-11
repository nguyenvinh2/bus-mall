'use strict';

var polling = new Poll(3, 25);

function Products(productPath) {
  this.name = productPath.split('.')[0];
  this.path = `assets/${productPath}`;
  this.views = 0;
  this.vote = 0;
}

function Poll(choicePerRotation, rotationNumber) {
  this.productNameAddress = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'usb.gif'
  ];
  this.rotation = 0;
  this.productArray = [];
  this.choiceArray = [];
  this.imagesPerTurn = choicePerRotation;
  this.maxTurns = rotationNumber;

  this.generateProducts = function () {
    for (let i = 0; i < this.productNameAddress.length; i++) {
      let createProduct = new Products(this.productNameAddress[i]);
      this.productArray.push(createProduct);
    }
  };

  this.generateRandomProducts = function () {
    let tempRandomArray = [];
    if (!this.choiceArray.length) {
      while (tempRandomArray.length < this.imagesPerTurn) {
        let randomNumber = Math.floor(Math.random() * this.productNameAddress.length);
        if (!tempRandomArray.includes(randomNumber)) {
          tempRandomArray.push(randomNumber);
          this.productArray[randomNumber].views++;
        }
      }
    } else {
      while (tempRandomArray.length < this.imagesPerTurn) {
        let randomNumber = Math.floor(Math.random() * this.productNameAddress.length);
        if (!tempRandomArray.includes(randomNumber) && !this.choiceArray[this.choiceArray.length - 1].includes(randomNumber)) {
          tempRandomArray.push(randomNumber);
          this.productArray[randomNumber].views++;
        }
      }
    }
    this.choiceArray.push(tempRandomArray);
  };

  this.renderImage = function (i) {
    let imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';
    for (let j = 0; j < this.choiceArray[i].length; j++) {
      let fieldSet = document.createElement('fieldset');
      let labelContainer = document.createElement('label');
      labelContainer.setAttribute('for', `${this.productArray[this.choiceArray[i][j]].name}`);
      let imageName = document.createElement('h3');
      imageName.textContent = `${this.productArray[this.choiceArray[i][j]].name.toUpperCase()}`;
      let image = document.createElement('img');
      image.setAttribute('src', `${this.productArray[this.choiceArray[i][j]].path}`);
      let radioInput = document.createElement('input');
      radioInput.setAttribute('type', 'radio');
      radioInput.setAttribute('name', 'product-select');
      radioInput.setAttribute('id', `${this.productArray[this.choiceArray[i][j]].name}`);
      radioInput.setAttribute('value', `${this.choiceArray[i][j]}`);
      labelContainer.appendChild(imageName);
      labelContainer.appendChild(image);
      fieldSet.appendChild(labelContainer);
      fieldSet.appendChild(radioInput);
      imageContainer.appendChild(fieldSet);
    }
  };

  this.voteProduct = function () {
    this.rotation++;
    let productPicked = parseInt(document.querySelector('input[name=product-select]:checked').value);
    this.productArray[productPicked].vote++;
    if (this.rotation === rotationNumber) {
      this.displayResults();
    } else {
      this.generateRandomProducts();
      this.renderImage(this.rotation);
    }
    localStorage.setItem('object', JSON.stringify(this));
  };

  this.displayResults = function () {
    let display = document.getElementById('results');
    display.style.display = 'block';
    let resultsRelative = document.getElementById('relative').getContext('2d');
    let resultsAbsolute = document.getElementById('absolute').getContext('2d');
    let relativeData = [];
    let absoluteData = [];
    let views = [];
    let label = [];

    for (let i = 0; i < this.productArray.length; i++) {
      absoluteData.push(this.productArray[i].vote);
      views.push(this.productArray[i].views);
      relativeData.push((absoluteData[i] / views[i] * 100).toFixed(1));
      label.push(this.productArray[i].name);
    }
    // eslint-disable-next-line
    new Chart(resultsAbsolute, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
          label: '# of Votes',
          data: absoluteData,
          backgroundColor: 'rgba(175,125,225,.3)',
          borderColor: 'rgba(125,125,125,1)',
          borderWidth: 1
        },
        {
          label: '# of Views',
          data: views,
          backgroundColor: 'rgba(125,225,145,.3)',
          borderColor: 'rgba(125,225,145,1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              precision: 0
            }
          }]
        }
      }
    });
    // eslint-disable-next-line
    new Chart(resultsRelative, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
          label: 'Percentage Clicked On',
          data: relativeData,
          backgroundColor: 'rgba(75,135,225,.3)',
          borderColor: 'rgba(75,135,225,1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          }]
        }
      }
    });
    window.scrollTo(0, 1000);
  };

  this.executeOrder66 = function () {
    this.generateProducts();
    this.generateRandomProducts();
    this.renderImage(this.rotation);
    localStorage.setItem('object', JSON.stringify(this));
  };
}
// eslint-disable-next-line
function reset() {
  localStorage.removeItem('object');
  clearResults();
  polling = new Poll(3, 25);
  polling.executeOrder66();
  trigger();
}
// eslint-disable-next-line
function cont() {
  if (polling.rotation === 25) {
    polling.rotation = 0;
    polling.choiceArray = [];
    polling.generateRandomProducts();
    localStorage.setItem('object', JSON.stringify(polling));
    polling.renderImage(polling.rotation);
    clearResults();
    trigger();
  } else {
    alert('You haven\'t finished voting for this set yet.');
  }
}

function clearResults() {
  let resultsContainer = document.getElementById('results');
  let canvasContainerOne = document.getElementById('absolute');
  let canvasContainerTwo = document.getElementById('relative');
  let canvasOneParent = canvasContainerOne.parentNode;
  let canvasTwoParent = canvasContainerTwo.parentNode;
  resultsContainer.style.display = 'none';
  canvasOneParent.removeChild(canvasContainerOne);
  canvasTwoParent.removeChild(canvasContainerTwo);
  let canvasOneRebuilt = document.createElement('canvas');
  let canvasTwoReBuilt = document.createElement('canvas');
  canvasOneRebuilt.setAttribute('id', 'absolute');
  canvasTwoReBuilt.setAttribute('id', 'relative');
  canvasOneParent.appendChild(canvasOneRebuilt);
  canvasTwoParent.appendChild(canvasTwoReBuilt);
}

function trigger() {
  document.getElementById('image-container').addEventListener('click', function runVote(event) {
    if (polling.rotation === polling.maxTurns) {
      document.getElementById('image-container').removeEventListener('click', runVote, false);
    }
    else if (document.querySelector('input[name=product-select]:checked')) {
      polling.voteProduct();
      event.preventDefault();
    }
  }, false);
}

window.onload = function () {
  trigger();
  let retrievedPollingData = JSON.parse(localStorage.getItem('object'));
  if (retrievedPollingData !== null) {
    polling.rotation = retrievedPollingData.rotation;
    polling.productArray = retrievedPollingData.productArray;
    polling.choiceArray = retrievedPollingData.choiceArray;
    polling.imagesPerTurn = retrievedPollingData.imagesPerTurn;
    polling.maxTurns = retrievedPollingData.maxTurns;
    if (polling.rotation === polling.maxTurns) {
      polling.renderImage(polling.rotation - 1);
      polling.displayResults();
    } else {
      polling.renderImage(polling.rotation);
    }
  } else {
    polling.executeOrder66();
  }
};

