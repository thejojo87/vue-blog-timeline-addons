/**
 * Created by thejojo on 2017/6/11.
 */
// 这个是本地存储
let storage;

function saveToLeancloud(tabs) {
    storage.saveData(tabs)
    // 这里调用data_persistent的api，保存到leancloud里去
}

function saveCurrentTab() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        console.log(tabs[0])
        // 在这里调用
        saveToLeancloud(tabs)
    });
}

function saveAllTabs() {
    chrome.tabs.query({
        currentWindow: true
    }, (tabs) => {
        console.log(tabs)
        // 在这里调用
        saveToLeancloud(tabs)
    });
}

// 鼠标右键添加一个项目
let menu = chrome.contextMenus.create({
    "title": "keep timeline in blog", // 右键菜单显示信息
    "contexts": ["page"] // 鼠标选择文本时才生效
});

chrome.contextMenus.create({
    type: 'radio',
    title: '保存此标签',
    id: 'currentTab',
    checked: true,
    onclick: saveCurrentTab
});

chrome.contextMenus.create({
    type: 'radio',
    title: '保存全部标签组',
    id: 'allTabs',
    onclick: saveAllTabs
});

// 不知道这里有没有效果，貌似鼠标右键放在这里是没有效果的
$(document).ready(function(){
    console.log("menu");
    storage = new LeanCloudStorage();
    storage.initStorage();
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request.className);
            if (request.className != null){
                console.log('这次是初始化，要设置storage的username')
                console.log(request.data['username'])
                // storage.setData(request.data['username'])
                console.log('初始化结束了')
            } else if (request.saveType != null){
                console.log('这是保存数据')
                console.log(request.saveType);
                if (request.saveType === 'currentTab') {
                    console.log(sender.tab ?
                        "来自内容脚本：" + sender.tab.url :
                        "来自扩展程序");
                    // 获取currunttab
                    saveCurrentTab()
                } else {
                    // 获取alltab
                    saveAllTabs()
                }
                console.log('保存数据结束了')
            }
            console.log(request.saveType)
            if (request.saveType === "currentTab"){
                sendResponse({farewell: "再见"});
            }
        });
});