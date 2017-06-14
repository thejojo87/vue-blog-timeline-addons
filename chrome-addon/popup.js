
let storage;
// 显示的页面数字
let display_page = 1;
// leacncloud里查询到的总数据要放在这里
let display_array  = [];
// 每一页要显示的timeline数量
let display_items_per_page = 6

// 这里需要调用datapersistent的方法，获取
function loadTimelines() {
    storage.getTimelines(function (array) {
        console.log('返回了array')
        // 这里要把返回的数据，渲染在popup页面上
        if (array !== null){
            display_array = array
            console.log(display_array[0].url)
            addPageModule(display_array.length)
            displayTimelines(display_page)
        }
    })
}
// 分页模块
function addPageModule(page_length) {
    // 分页模块
    var pages = Math.ceil(page_length / display_items_per_page)
    // pages = Math.round( parseFloat(page_length / display_items_per_page) );
    console.log('math的值是' + pages)
    // if (page_length <=5 * display_items_per_page) {
    //     pages = page_length
    // }else {
    //     pages = Math.ceil(page_length / display_items_per_page)
    // }
    $('#pagination-demo').twbsPagination({
        totalPages: pages,
        visiblePages: display_items_per_page,
        onPageClick: function (event, page) {
            display_page = page
            console.log('page 这个被触发了')
            // 第一次初始化的时候disply_array是空，如果赋值的话会出错的
            if (display_array.length > 0) {
                displayTimelines(page)
            }
        }
    });
}

// 这里是把popup页面元素渲染
function displayTimelines(display_page) {
    $('#page-content').text('');
    for (i = 1; i <= display_items_per_page; i++) {
        console.log(i)
        // console.log(display_array[0]["title"])
        if (display_array[display_page * display_items_per_page - 6 + i]) {
            $('#page-content').append('<a href="' + display_array[display_page * display_items_per_page - 6 + i].url + '" class="list-group-item">' + display_array[display_page * display_items_per_page - 6 + i].title + '</a>')
        }
    }
}

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
    loadTimelines(storage)
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
    let currentUser = AV.User.current();
    // 一开始这里肯定是isnotdefined
    if (currentUser != null) {
        console.log(currentUser)
        currentUser.isAuthenticated().then(function(authenticated){
            if (authenticated) {
                console.log('is authenticated 对了')
                onUserLoginStateChanged(true, storage);
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

