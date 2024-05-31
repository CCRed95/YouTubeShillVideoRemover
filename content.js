const shillVideoViewsThreshold = 700;
const viewCountRegex = /([\d,.]+)([KMB]?)/;

const parseAbbreviatedViewCount = (viewCountStr) => {
  if (viewCountStr.includes("No views")) 
    return 0;

  const matches = viewCountStr.match(viewCountRegex);
  if (!matches) 
    return 0;

  let [ , number, unit ] = matches;
  number = parseFloat(number.replace(/,/g, ''));

  switch (unit) {
    case 'K':
      return number * 1000;
    case 'M':
      return number * 1000000;
    case 'B':
      return number * 1000000000;
    default:
      return number;
  }
};

const removeThirdVideoIfShilling = function() {
  let potentialShillVideoContainer = document.querySelectorAll("ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer")[2];
  let viewCountStr = potentialShillVideoContainer.querySelectorAll("#metadata-line > .ytd-video-meta-block")[2].innerText;

  let viewCount = parseAbbreviatedViewCount(viewCountStr);

  let videoTitle = potentialShillVideoContainer.querySelector("#video-title").innerText;

  if (viewCount > shillVideoViewsThreshold) {
    console.log(`video '${videoTitle}' has more than ${shillVideoViewsThreshold} views. Keeping non-shill video.`); 
  }
  else {
    console.log(`video '${videoTitle}' has less than ${shillVideoViewsThreshold} views. Deleting shill video.`);
    potentialShillVideoContainer.remove();
  }
}

const removeYouTubeShortsSuggestion = function() {
  let idioticYouTubeShortsRetardation = document.querySelector("#contents > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer");

  if (idioticYouTubeShortsRetardation != undefined) {
    console.log(`found idiotic 'youtube shorts' injection that nobody likes. Deleting it and throwing it in the garbage because it sucks and it's gay.`);
    idioticYouTubeShortsRetardation.remove();
  }
}

let hasRun = false;

const runAllYouTubeModifications = function() {
  if (hasRun) return;
  hasRun = true;

  removeYouTubeShortsSuggestion();
  removeThirdVideoIfShilling();
}

const targetNode = document.querySelector("ytd-app");
const config = { childList: true };

const callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      observer.disconnect()
      setTimeout(runAllYouTubeModifications, 2000);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

