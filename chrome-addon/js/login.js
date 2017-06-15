/**
 * Created by thejojo on 2017/6/11.
 */
var currentUser;

$(document).ready(function() {
    console.log('login界面');
    new LeanCloudStorage().initStorage();
    $('#submit').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        var user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        AV.User.logIn(username, password).then(function (loginedUser) {
            console.log("success");
            console.log(loginedUser)

            chrome.runtime.sendMessage({"login": "login", "username": username, "password": password}, function(response) {
            });

            // currentUser = loginedUser;
            window.location.href = './popup.html';
        }, function (error) {
            alert(JSON.stringify(error));
        });
    });
});
