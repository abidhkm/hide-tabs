var NEW_URL = "http://google.com/"; 

chrome.browserAction.onClicked.addListener(async () => {

    const p = new Promise((resolve) => {
        chrome.storage.local.get(['closed', 'tabsClosed', 'newTab'], (options) => {
            resolve(options);
        })
    });

    const { closed, newTab, tabsClosed } = await p;

    if (!closed) {

        chrome.tabs && chrome.tabs.query({}, tabs => {
            
            chrome.tabs.create({ url: NEW_URL }, (res) => {
                chrome.storage.local.set({ tabsClosed: tabs, closed: true, newTab: res.id });
            });
            
            tabs.map(tab => chrome.tabs.remove(tab.id))
        });

    } else {

        tabsClosed.map(tab => chrome.tabs.create({ url: tab.url }))
        chrome.tabs.remove(newTab)
        chrome.storage.local.set({ tabsClosed: [], closed: false });
        
    }
});