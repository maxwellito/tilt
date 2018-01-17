fetch('stories/tilt.html')
  .then(data => data.text())
  .then(boot)

function boot (twineHtml) {
  let gameData = transform(twineHtml);
  var myGame = new Game(gameData)
  myGame.start()
}

function transform (cardData) {
  let container = document.createElement('div');
  container.innerHTML = cardData;
  let passages = container.querySelectorAll('tw-passagedata'),
      stories = {};

  for (let i = 0; i < passages.length; i++) {
    let passage = passages[i],
        passageName = passage.getAttribute('name'),
        passageText = passage.textContent;
      
    let story = {
      instructions: [],
      actions: []
    }
    
    passageText.trim().split('\n').forEach(line => {
      line = line.trim();
      let isLink = line.startsWith('[[') && line.endsWith(']]')
      if (isLink) {
        let [label, story_id] = line.substr(2, line.length-4).split('|')
        story.actions.push({label, story_id});
      }
      else {
        story.instructions.push(line);
      }
    });
    stories[passageName] = story;
  }

  return {
    meta:{
      title:'Are you screwed?',
      lang: "en"
    },
    "stories": stories
  }
}