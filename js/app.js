'use strict';


function Products(productPath) {
  this.name = productPath.split('.')[0];
  this.path = `assets/${productPath}`;
  this.vote = 0;
}

function Poll(CHOICE_PER_ROTATION, ROTATION_NUMBER) {
  this.productNameAddress = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg','dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpog', 'shark.jpg', 'sweep.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'usb.gif'
  ];
  this.productArray = [];
  this.choiceArray = [];
  this.imagesPerTurn = CHOICE_PER_ROTATION;

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
        }
      }
    } else {
      while (tempRandomArray.length <= this.imagesPerTurn) {
        let randomNumber = Math.floor(Math.random()*this.productNameAddress.length);
        if(!tempRandomArray.includes(randomNumber) && !this.choiceArray[this.choiceArray.length -1].includes(randomNumber)) {
          tempRandomArray.push(randomNumber);
        }
      }
    }
    this.choiceArray.push(tempRandomArray);
  };
}

