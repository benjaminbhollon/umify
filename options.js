//Declare variables
var master;
var site;
var whitelist;

chrome.storage.sync.get({ //Get current settings
  master: true,
  whitelist: []
}, function(items) {
  master = items.master;
  if (items.master) { //Update master switch text according to current settings
    document.getElementById("toggle").innerHTML = "Turn Off";
  } else {
    document.getElementById("toggle").innerHTML = "Turn On";
  }
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => { //Check what site is being viewed
    if (!(tabs[0].url)) { //If the full-page options tab is being viewed, hide the whitelist button
      document.getElementById("whitelist").style.display = "none";
      return;
    }
    site = tabs[0].url.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0]; //Get website name
    whitelist = items.whitelist;
    if (whitelist.indexOf(site) == -1) { //Update whitelist button text and onclick event according to whether current site is whitelisted
      document.getElementById("whitelist").innerHTML = "Whitelist " + site;
      document.getElementById("whitelist").onclick = whitelistSite;
    } else {
      document.getElementById("whitelist").innerHTML = "Remove " + site + " from whitelist";
      document.getElementById("whitelist").onclick = blacklistSite;
    }
  });
});

document.getElementById("toggle").onclick = function () { //Master switch toggle value
  chrome.storage.sync.set({
    master: !(master)
  }, function() {
    master = !(master);
    if (master) {
      document.getElementById("toggle").innerHTML = "Turn Off";
    } else {
      document.getElementById("toggle").innerHTML = "Turn On";
    }
  });
}

function whitelistSite() { //Add site to whitelist
  whitelist.push(site);
  chrome.storage.sync.set({
    whitelist: whitelist
  }, function () {
    document.getElementById("whitelist").innerHTML = "Remove " + site + " from whitelist";
    document.getElementById("whitelist").onclick = blacklistSite;
  });
}

function blacklistSite() { //Remove site from whitelist
  whitelist.splice(whitelist.indexOf(site), 1);
  chrome.storage.sync.set({
    whitelist: whitelist
  }, function () {
    document.getElementById("whitelist").innerHTML = "Whitelist " + site;
    document.getElementById("whitelist").onclick = whitelistSite;
  });
}