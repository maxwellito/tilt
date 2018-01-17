/**
 * 
 * @param {DOMElement} el Card container
 * @param {Object} data Data to display in the card
 */
function Card (el, data) {
  this.el = el;
  this.data = data;
  this.stackIndex = 0
  this.choiceList = null
  this.instructionsList = null
  this.actionCallback = null
  this.nextActionId = null
  
  this.setup()
  this.reset()
}

Card.prototype.setup = function () {
  this.el.addEventListener('transitionend', function () {
    if (this.el.classList.contains('end')) {
      this.el.classList.remove('end')
      this.reset()
    }
    else {
      this.actionCallback(this.nextActionId)
    }
  }.bind(this))
}

Card.prototype.reset = function () {
  this.el.innerHTML = ''
  
  this.instructionsList = document.createElement('div')
  this.instructionsList.classList.add('instructionsList')
  this.el.appendChild(this.instructionsList)
  
  this.choiceList = document.createElement('div')
  this.choiceList.classList.add('choiceList')
  this.el.appendChild(this.choiceList)
}

Card.prototype.playData = function (data) {
  this.data = data
  this.stackIndex = 0
  if (!this.data.actions.length) {
    this.data.actions.push({
      label: '> back to start',
      story_id: 'Start'
    })
  }
  this.show()
}

Card.prototype.show = function () {
  this.showNextItem()
}

Card.prototype.showNextItem = function () {
  let item
  if (this.data.instructions.length > this.stackIndex) {
  	item = this.stackInstruction(this.data.instructions[this.stackIndex])
  }
  else if ((this.data.instructions.length + this.data.actions.length) > this.stackIndex) {
    return this.stackActions(this.data.actions)
  }
  
  this.stackIndex++
  item.then(this.showNextItem.bind(this))
}

Card.prototype.stackInstruction = function (instructionData) {
  let p = document.createElement('p');

  instructionData
    .split(' ')
    .forEach((chunk) => {
      var span = document.createElement('span');
      span.textContent = chunk
      span.classList.add('revealWord')
      span.style.animationDelay = (Math.random()*.6).toFixed(1) + 's'
      p.appendChild(span)
    })
  this.instructionsList.appendChild(p);

  return new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  });
}

Card.prototype.stackActions = function (actionsData) {
  actionsData.forEach(actionData => {
    let button = document.createElement('button');
    button.classList.add('blank');
    button.textContent = actionData.label;
    button.addEventListener('click', function () {
      button.classList.add('selected');
      this.nextActionId = actionData.story_id;
      this.el.classList.add('end');
    }.bind(this));
    this.choiceList.appendChild(button);
  })
}
