/**
 * Created by thejojo on 2017/6/11.
 */
// 这个是本地存储
let storage;
let currentUser;

function saveToLeancloud(tabs, currentUser) {
    storage.saveData(tabs, currentUser)
    // 这里调用data_persistent的api，保存到leancloud里去
}

function saveCurrentTab(currentUser) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        console.log(tabs[0])
        // 在这里调用
        saveToLeancloud(tabs, currentUser)
    });
}

function saveAllTabs(currentUser) {
    chrome.tabs.query({
        currentWindow: true
    }, (tabs) => {
        console.log(tabs)
        // 在这里调用
        saveToLeancloud(tabs, currentUser)
    });
};

// 直接转到timeline主页，这个以后可不可以设置呢？
function goTimelinePage() {
    chrome.tabs.create({ url: 'http://localhost:8080/#/timeline' })
}
// 鼠标右键添加一个项目
let menu = chrome.contextMenus.create({
    "title": "keep timeline in blog", // 右键菜单显示信息
    "contexts": ["page"], // 鼠标选择文本时才生效
    "onclick": goTimelinePage
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
    storage = new LeanCloudStorage();
    storage.initStorage();
    console.log(AV.User.current())
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.className != null){
                console.log('这次是初始化，要设置storage的username')
                console.log('初始化结束了')
            } else if (request.saveType != null){
                console.log('这是保存数据')
                console.log(request.saveType);
                currentUser = AV.User.current()
                if (request.saveType === 'currentTab') {
                    console.log(sender.tab ?
                        "来自内容脚本：" + sender.tab.url :
                        "来自扩展程序");
                    // 获取currunttab
                    saveCurrentTab(AV.User.current())
                } else {
                    // 获取alltab
                    saveAllTabs(AV.User.current())
                }
                console.log('保存数据结束了')
            } else if (request.logout != null) {
                currentUser = null
                AV.User.logOut();
                console.log('现在的用户名是'+ AV.User.current())
            } else if (request.login != null) {
                console.log('login开始了background')
                console.log(request.username)
                console.log(request.password)
                AV.User.logIn(request.username,request.password).then(function (loginedUser) {
                    console.log("success");
                    console.log(loginedUser)
                    currentUser = loginedUser;
                }, function (error) {
                    alert(JSON.stringify(error));
                });
                console.log('现在的用户名是'+ AV.User.current())
                console.log(AV.User.current())
            }
            // if (request.saveType === "currentTab"){
            //     sendResponse({farewell: "再见"});
            // }
        });

    // 监控快捷键
    chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
        console.log(storage)
        console.log('现在的用户名是'+ AV.User.current())
        console.log( AV.User.current())
        console.log(currentUser)
        if (storage != null && currentUser != null ) {
            if (command == "saveCurrentTab") {
                saveCurrentTab(currentUser)
            }else if (command == "saveAllTabs") {
                saveAllTabs(currentUser)
            }
        } else {
            browser.notifications.create({
                "type": "basic",
                "title": "Time for cake!",
                "message": "Something something cake",
                // "buttons": buttons
            });
            alert('请先登陆')
        }

    });
});