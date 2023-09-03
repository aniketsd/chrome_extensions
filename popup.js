// Function to extract the video URL and display it in the popup
function extractVideoUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: extractVideoFromPage,
      }
    );
  });
}

function openHeaders() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: clickAllHeaders,
      }
    );
  });
}

// Function to extract video URL from the page's DOM
function extractVideoFromPage() {
  const videoElement = document.querySelector("video");
  if (videoElement) {
    const videoUrl = videoElement.src;
    // chrome.runtime.sendMessage({ videoUrl });
  }
}

let urlList = [];
let titleList = [];
// Listen for messages from the content script



function clickAllHeaders(){
  const buttonElements = document.querySelectorAll('.classroom-toc-section__toggle[aria-expanded="false"]');

}


function clickElementAndWait(element, index) {
    setTimeout(function () {
        element.click();
        console.log(`Clicked element ${index + 1}.`);

        // Check if there are more elements to click
        if (index < liElements.length - 1) {
            clickElementAndWait(liElements[index + 1], index + 1);
        }
    }, 5000); // 5000 milliseconds = 5 seconds
}

function handleDownloadButtonClick() {
  extractVideoUrl();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: () => {

          // let newVideoUrls = [];
          function clickElementAndWait(element, index) {
              setTimeout(function () {
                  // alert("title"+ element.textContent.trim())
                  element.click();
                  console.log(`Clicked element ${index + 1}.`);
                  const videoElement = document.querySelector("video");
                  // newVideoUrls.push(videoElement.src)
                  const videoUrl = videoElement.src;
                  const elementTitle = element.textContent.trim();

                  chrome.runtime.sendMessage({ elementTitle, videoUrl });
                  // alert(newVideoUrls)
                  // Check if there are more elements to click
                  if (index < liElements.length - 1) {
                      clickElementAndWait(liElements[index + 1], index + 1);
                  }
              }, 1000); // 5000 milliseconds = 5 seconds
          }

          const elements = document.querySelectorAll('ul.classroom-toc-section__items li a div > div.classroom-toc-item__title');
          // alert("elements "+elements.length)
          if (elements.length < 1){
            const invalid_page = "no_content"
            chrome.runtime.sendMessage({ invalid_page });
          }

          const liElements = Array.from(elements).filter((element) => {
            const titleText = element.textContent.trim();
            return titleText.indexOf("Chapter Quiz") === -1;
          });

          var something =[]
          for(var j=0; j<liElements.length; j++){
            something.push(liElements[j].textContent.trim())
          }
          // alert("something  "+ something)

          if (liElements.length > 0) {
            clickElementAndWait(liElements[0], 0);
          } else {
            console.log("No elements found.");
          }

        },
      }
    );
  });
}




chrome.runtime.onMessage.addListener((message) => {
  if (message.invalid_page !== "no_content") {
    const videoListElement = document.getElementById("videoList");
    urlList.push(message.videoUrl);
    titleList.push(message.elementTitle);

    const listItemHTML = urlList.map((url, index) => {
      const title = titleList[index];
      // Generate unique IDs for title and URL in the format id=title_01 and id=url_01
      const titleItemId = `title_${(index + 1).toString().padStart(2, '0')}`;
      const urlItemId = `url_${(index + 1).toString().padStart(2, '0')}`;

      var downloadLink = document.getElementById("downloadToggle");
      if (downloadLink.checked) {
        chrome.downloads.download({
              url: url,
            });
      }


      return `<li>
          <div id="${titleItemId}">
            <strong>Title:</strong> <strong>${title}</strong>
          </div>
          <div id="${urlItemId}">
            <strong>URL:</strong> <a>${url}</a>
          </div>
        </li>`;
      }).join("");



    videoListElement.innerHTML = listItemHTML;
  }
  else {
    const videoListElement = document.getElementById("videoList");
    videoListElement.innerHTML = "<h4>No video found</h4> <i>Note: it works only with LinkedIn learning.</i>";
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', handleDownloadButtonClick);
});

document.addEventListener('DOMContentLoaded', function () {
  openHeaders();
});
