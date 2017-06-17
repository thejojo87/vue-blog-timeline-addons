/**
 * Created by thejojo on 2017/6/10.
 */
var currentUser;
$(document).ready(function() {
    new LeanCloudStorage().initStorage();
    $('#inputSubmit').click(function() {
        var username = $('#inputUsername').val();
        var password = $('#inputPassword').val();
        var email = $('#inputEmail').val();

        var user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.signUp().then(function (loginedUser) {
            console.log("success");
            currentUser = loginedUser;
            chrome.runtime.sendMessage({"login": "login", "username": username, "password": password}, function(response) {
            });
            window.location.href = './popup.html';
        }, (function (error) {
            alert(JSON.stringify(error));
        }));
    });
});