
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
        // 这里要把返回的数据，渲染在popup页面上
        if (array !== null){
            display_array = array
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
    $('#pagination-demo').twbsPagination({
        totalPages: pages,
        visiblePages: display_items_per_page,
        onPageClick: function (event, page) {
            display_page = page
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
    for (i = 0; i < display_items_per_page; i++) {
        // console.log(display_array[0]["title"])
        let num = (display_page  - 1 ) * display_items_per_page + i
        display_class = ' readfinished'
        if (display_array[num]) {
            if (!display_array[num].isFinished) {
                display_class = ' readnotfinished'
            }
            $('#page-content').append('<a href="' +
                display_array[num].url +
                '" class="list-group-item' +
                display_class + '">' +
                '<input type="checkbox" id="' +
                display_array[num].objectId +
                '"><label for="' + display_array[num].objectId +
                '" >' +
                display_array[num].title +
                '</label></a>')
        }
    }
}

function sendLoginedRequest() {
    let currentUser = AV.User.current();
    console.log(currentUser)
    console.log(currentUser.getUsername())
    console.log('sendLoginedRequest开始了')
    chrome.runtime.sendMessage({"className": "LeanCloudStorage"}, function(response) {
    });
}

function onUserLoginStateChanged(isLogined, storage) {
    if (isLogined) {
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
                    // 需要把backgroundde leancloud 初始化
                    chrome.runtime.sendMessage({"logout": "logout"}, function(response) {
                    });
                });
                // 数据保存到leancloud
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
                    });
                });
                // 改变阅读状态到leancloud
                $('#change_status').click(function() {
                    // 一个是改变本地数据，一个是改变leancloud数据
                    // 思路是先获取items，查看check box状态，把选中的
                    $(".list-group-item").each(function(index){
                        if ($(this).find(':checkbox').is(":checked")){
                            // 修改状态？
                            var id = $(this).children(":first").attr("id")
                            if ($(this).hasClass("readnotfinished")) {
                                $(this).removeClass("readnotfinished")
                                $(this).addClass("readfinished")
                                storage.changeFinishStatus(id, true)
                            }else if ($(this).hasClass("readfinished")) {
                                $(this).addClass("readnotfinished")
                                $(this).removeClass("readfinished")
                                storage.changeFinishStatus(id, false)}
                        }
                    });
                });
                // 删除leancloud数据
                $('#delete_leancloud').click(function() {
                    $(".list-group-item").each(function(index){
                        if ($(this).find(':checkbox').is(":checked")){
                            var id = $(this).children(":first").attr("id")
                            // 先删除leancloud，再删除本地图标
                            storage.deleteTimelines(id)
                            // 刷新页面好，还是直接删除好？直接删除比较好，如果重新打开还要占用资源怪麻烦的
                            // 先尝试一下直接删除元素，我很好奇，分页会如何选择
                            $(this).remove();
                        }
                    });
                });
            } else {
                console.log('is authenticated 错了')
                // onUserLoginStateChanged(false);
            }
        });
    } else {
        console.log('用户没有登陆')
        // 初始化的时候user是null，所以要进行存储
        // onUserLoginStateChanged(false);
    }
})

