'use strict';


function Products(productPath) {
  this.name = productPath.split('.')[0];
  this.path = `assets/${productPath}`;
  this.views = 0;
  this.vote = 0;
  this.percentage;
}

function Poll(CHOICE_PER_ROTATION, ROTATION_NUMBER) {
  this.productNameAddress = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg','dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'usb.gif'
  ];
  this.rotation = 0;
  this.productArray = [];
  this.choiceArray = [];
  this.imagesPerTurn = CHOICE_PER_ROTATION;
  this.MAX_TURNS = ROTATION_NUMBER;

  this.generateProducts = function() {
    for (let i = 0; i < this.productNameAddress.length; i++) {
      let createProduct = new Products(this.productNameAddress[i]);
      this.productArray.push(createProduct);
    }
  };

  this.generateRandomProducts = function() {
    let tempRandomArray = [];
    if(!this.choiceArray.length) {
      while (tempRandomArray.length < this.imagesPerTurn) {
        let randomNumber = Math.floor(Math.random()*this.productNameAddress.length);
        if(!tempRandomArray.includes(randomNumber)) {
          tempRandomArray.push(randomNumber);
          this.productArray[randomNumber].views++;
        }
      }
    } else {
      while (tempRandomArray.length < this.imagesPerTurn) {
        let randomNumber = Math.floor(Math.random()*this.productNameAddress.length);
        if(!tempRandomArray.includes(randomNumber) && !this.choiceArray[this.choiceArray.length -1].includes(randomNumber)) {
          tempRandomArray.push(randomNumber);
          this.productArray[randomNumber].views++;
        }
      }
    }
    this.choiceArray.push(tempRandomArray);
  };

  this.renderImage = function(i) {
    let imageContainer = document.getElementById('image-container');
    let fieldSet = document.createElement('fieldset');
    imageContainer.appendChild(fieldSet);
    for(let j = 0; j < this.choiceArray[i].length; j++) {
      let labelContainer = document.createElement('label');
      labelContainer.setAttribute('for', `${this.productArray[this.choiceArray[i][j]].name}`);
      let image = document.createElement('img');
      image.setAttribute('src', `${this.productArray[this.choiceArray[i][j]].path}`);
      image.style.maxWidth= '250px';
      let radioInput = document.createElement('input');
      radioInput.setAttribute('type', 'radio');
      radioInput.setAttribute('name', 'product-select');
      radioInput.setAttribute('id', `${this.productArray[this.choiceArray[i][j]].name}`);
      radioInput.setAttribute('value', `${this.choiceArray[i][j]}`);
      if (j === Math.floor(this.choiceArray[i].length/2)) {
        radioInput.checked = true;
      }
      labelContainer.appendChild(image);
      labelContainer.appendChild(radioInput);
      fieldSet.appendChild(labelContainer);
    }
  };

  let article = document.getElementsByTagName('article')[0];
  let submit = document.createElement('input');
  submit.setAttribute('type','button');
  submit.setAttribute('id','vote');
  submit.value = 'Vote';
  article.appendChild(submit);

  this.voteProduct = function(event) {
    this.rotation++;
    let imageContainer = document.getElementById('image-container');
    let productPicked = parseInt(document.querySelector('input[name=product-select]:checked').value);
    this.productArray[productPicked].vote++;
    if(this.rotation === ROTATION_NUMBER) {
      this.displayResults();
    } else {
      imageContainer.innerHTML = '';
      this.generateRandomProducts();
      this.renderImage(this.rotation);
    }
    event.preventDefault();
  };

  this.displayResults = function() {
    let resultsList = document.getElementById('results');
    for(let i = 0; i < this.productArray.length; i++) {
      let productItem = document.createElement('li');
      productItem.textContent = `${this.productArray[i].name.toUpperCase()} - Views: ${this.productArray[i].views}, Votes: ${this.productArray[i].vote}`;
      resultsList.appendChild(productItem);
    }
  };
}

var Polling = new Poll(3,2);
Polling.generateProducts();
Polling.generateRandomProducts();
Polling.renderImage(0);

document.getElementById('vote').addEventListener('click', function runVote(event) {
  Polling.voteProduct(event);
  if(Polling.rotation === Polling.MAX_TURNS) {
    document.getElementById('vote').removeEventListener('click', runVote, false);
  }
}, false);

