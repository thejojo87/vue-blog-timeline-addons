/**
 * Created by thejojo on 2017/6/11.
 */
var currentUser;

$(document).ready(function() {
    console.log('login界面');
    // Todo: 初始化一个新的leancloud
    new LeanCloudStorage().initStorage();
    $('#submit').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        console.log(username)
        console.log(password)

        var user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        AV.User.logIn(username, password).then(function (loginedUser) {
            console.log("success");
            console.log(loginedUser)
            currentUser = loginedUser;
            window.location.href = './popup.html';
        }, function (error) {
            alert(JSON.stringify(error));
        });
    });
});
