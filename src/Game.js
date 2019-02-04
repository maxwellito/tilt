function Game (cardDeck) {
  let errOutput = this.validate(cardDeck)
  if (errOutput.length) {
    throw new Error ('Data provided is invalid.\n' + errOutput.join('\n'))
  }

  this.meta = cardDeck.meta
  this.stories = cardDeck.stories
  this.card = null
  this.loadProgress() 
}

Game.prototype.STORAGE_KEY = 'game_';

Game.prototype.validate = function (cardDeck) {
  let output = []

  if (!cardDeck.stories) {
    output.push('The card deck structure is missing stories.')
    return output
  }
  Object.keys(cardDeck.stories).forEach((storyName) => {
    let story = cardDeck.stories[storyName];
    if (!story || !story.actions) {
      return
    }
    story.actions.forEach((action, actionIndex) => {
      if (!cardDeck.stories[action.story_id]) {
        output.push('Story linking to a wrong ID. Story ' + storyName + ', action ' + actionIndex)
      }
      if (!action.label) {
        output.push('Action with label missing. Story ' + storyName + ', action ' + actionIndex)
      }
    })
  });
  return output
}

Game.prototype.loadProgress = function () {
  let savedProgress = localStorage.getItem(this.STORAGE_KEY + this.meta.id)
  if (this.meta.id && savedProgress && savedProgress > 0 && savedProgress < this.stories.length) {
    this.cardId = savedProgress
  }
  else {
    this.cardId = 'google_tracking_targetting_explain'
  }
}

Game.prototype.saveProgress = function () {
  if (this.meta.id) {
    // localStorage.setItem(this.STORAGE_KEY + this.meta.id, this.cardId)
  }
}

Game.prototype.start = function () {
  this.card = new Card(
    document.querySelector('.card'),
    this.stories[this.cardId]
  )
  this.card.actionCallback = function (actionId) {
    this.cardId = actionId
    this.saveProgress()
    this.card.playData(this.stories[this.cardId])
  }.bind(this)
  this.card.show()
}