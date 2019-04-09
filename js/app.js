'use strict';

function Products(productPath) {
  this.name = productPath.split('.')[0];
  this.path = `assets/${productPath}`;
  this.views = 0;
  this.vote = 0;
  this.percentage;
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
    let imageContainer = document.getElementById('image-container');
    let productPicked = parseInt(document.querySelector('input[name=product-select]:checked').value);
    this.productArray[productPicked].vote++;
    if (this.rotation === rotationNumber) {
      this.displayResults();
    } else {
      imageContainer.innerHTML = '';
      this.generateRandomProducts();
      this.renderImage(this.rotation);
    }
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
    let backColor = [];
    let borColor = [];

    for (let i = 0; i < this.productArray.length; i++) {
      let colorR = Math.floor(Math.random() * 256);
      let colorG = Math.floor(Math.random() * 256);
      let colorB = Math.floor(Math.random() * 256);
      absoluteData.push(this.productArray[i].vote);
      views.push(this.productArray[i].views);
      relativeData.push((absoluteData[i] / views[i] * 100).toFixed(1));
      label.push(this.productArray[i].name);
      borColor.push(`rgba(${colorR}, ${colorG}, ${colorB}, 1)`);
      backColor.push(`rgba(${colorR}, ${colorG}, ${colorB}, .3)`);
    }
    // eslint-disable-next-line
    new Chart(resultsAbsolute, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
          label: '# of Votes',
          data: absoluteData,
          backgroundColor: backColor,
          borderColor: borColor,
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
              stepSize: 1
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
          backgroundColor: backColor,
          borderColor: borColor,
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
            }
          }]
        }
      }
    });
  };

  this.execute = function () {
    Polling.generateProducts();
    Polling.generateRandomProducts();
    Polling.renderImage(this.rotation);
  };
}

var Polling = new Poll(3, 25);
Polling.execute();

document.getElementById('image-container').addEventListener('click', function runVote(event) {
  if (Polling.rotation === Polling.maxTurns) {
    document.getElementById('image-container').removeEventListener('click', runVote, false);
  }
  else if (document.querySelector('input[name=product-select]:checked')) {
    Polling.voteProduct();
    event.preventDefault();
  }
}, false);

