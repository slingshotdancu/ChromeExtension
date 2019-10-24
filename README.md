# ChromeExtension
Diff Checker for Chrome

1. Download the zip file, and extract the files to your destination folder of choice (remember where that folder is saved!)
2. Open Chrome, and navigate to More Tools -> Extensions.
3. Turn on the "Developer Mode" switch, if it is not already active.
4. Click "Load Unpacked" and select the folder where the files were saved in step 1. 

This extension **only** works on the following matched URL: "*://*.sec.gov/*"
Example page on which the page action will be active: https://www.sec.gov/Archives/edgar/data/883975/000149315218010510/formdef-14a.htm

**Debugging notes:**
1. Open the background script console: on the Extensions page/Inspect views (background page)
2. Open the content script console: right click on an active content script page, right click the extention icon and click "inspect popup"
3. Open chrome console (ctrl+shift+i)
