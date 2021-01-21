//Declare variables
var additions = ["like", "y'know", "um", "like, y'know", "like, um", "uh"];
var replace = ["to", "of", "is", "do", "as", "All rights"];

function textNodesUnder(root){ //Get all text nodes under element
  var textNodes = [];
  addTextNodes(root);
  [].forEach.call(root.querySelectorAll('*'),addTextNodes);
  return textNodes;

  function addTextNodes(el){
    textNodes = textNodes.concat(
      [].filter.call(el.childNodes,function(k){
        return k.nodeType==Node.TEXT_NODE;
      })
    );
  }
}

chrome.storage.sync.get({ //Get settings
  master: true,
  whitelist: []
}, function(items) {
  if (items.master && items.whitelist.indexOf(location.href.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0]) == -1 && location.href.indexOf("seewitheyesclosed.com/umify/") == -1) { //Don't umify if: Extension is off, site is whitelisted, on the Umify adverisement page
    var textNodes = textNodesUnder(document.body); //Get all text nodes on page
    for (var node in textNodes) { //For every text node
      for (var word in replace) { //Up to one replacement per replacement type per text node
        if (textNodes[node].textContent.trim() != "") { //If the text node has content
          textNodes[node].nodeValue = textNodes[node].textContent.replace(" " + replace[word] + " ", " " + replace[word] + ", " + additions[Math.floor(Math.random() * additions.length)] + ", "); //Add a random word from additions after the word
        }
      }
    }
  }
});

if (location.href.indexOf("seewitheyesclosed.com/umify/") != -1) { //If're on the umify advertisement page, tell it that Umify is already installed
  document.getElementById("umify-check").innerText = "umify-chrome";
}