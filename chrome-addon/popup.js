
let storage;

function sendLoginedRequest() {
    let currentUser = AV.User.current();
    console.log(currentUser)
    console.log(currentUser.getUsername())
    console.log('sendLoginedRequest开始了')
    chrome.runtime.sendMessage({"className": "LeanCloudStorage", "data": {"username": currentUser.getUsername()}}, function(response) {
        console.log(response);
        console.log('sendMessageresponse')
    });
}

function onUserLoginStateChanged(isLogined, storage) {
    console.log('onuserloginstatechanged开始了')
    if (isLogined) {
        console.log('uskogiedn 开始了吧')
        let currentUser = AV.User.current();
        // storage = new LeanCloudStorage();
        // storage.initStorage({"username": currentUser.getUsername()});
        sendLoginedRequest();
    } else {
        // storage = new LocalStorage();
        // storage.initStorage();
        // // 这个给backgroundjs一个消息，让background按照消息类型，获得storage
        // chrome.runtime.sendMessage({"className": "LocalStorage"}, function(response) {
        //     console.log(response);
        //     console.log('sendMessageresponse')
        // });
    }
    // loadImage(storage);
}

$(document).ready(function () {
    // 添加一个监听，保存成功的话要关掉popup界面
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.closePopup)
                alert('保存成功')
        });

    // 这个在数据存储模块
    storage = new LeanCloudStorage();
    storage.initStorage();
    var currentUser = AV.User.current();
    // 一开始这里肯定是isnotdefined
    if (currentUser != null) {
        console.log(currentUser)
        currentUser.isAuthenticated().then(function(authenticated){
            if (authenticated) {
                console.log('is authenticated 对了')
                onUserLoginStateChanged(true);
                $('#username').text("user: " + currentUser.getUsername());
                $('#login_info').show();
                $('#unlogined').hide();

                $('#logout').click(function() {
                    AV.User.logOut();
                    location.reload();

                    $('#username').text("");
                    $('#login_info').hide();
                    $('#unlogined').show();
                });

                $('#save_to_leancloud').click(function() {
                    console.log('save to leancloud 开始了')
                    console.log($('#saveOneTab').is(':checked'))
                    let saveType = ''
                    if ($('#saveOneTab').is(':checked')) {
                        saveType = 'currentTab'
                    } else {
                        saveType = 'allTab'
                    }
                    // 这个给backgroundjs一个消息，让background按照消息类型，获得storage
                    chrome.runtime.sendMessage({"saveType": saveType}, function(response) {
                        console.log(response);
                        console.log('sendMessageresponse')
                    });

                });
            } else {
                console.log('is authenticated 错了')
                // onUserLoginStateChanged(false);
            }
        });
    } else {
        // 初始化的时候user是null，所以要进行存储
        // onUserLoginStateChanged(false);
    }
})

