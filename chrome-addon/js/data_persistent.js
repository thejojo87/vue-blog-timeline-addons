/**
 * Created by thejojo on 2017/6/11.
 */

function LocalStorage() {
    // 暂时什么都没有
    this.initStorage = function(data) {

    }

}

function LeanCloudStorage() {
    this.APP_ID = 'f6K7k15zgkjKOxUJu8TocNjG-gzGzoHsz'
    this.APP_KEY = 'HEEepvNy6lifQnA9EqltAmqt';
    this.ReadInfo = AV.Object.extend('ReadInfo');
    this.username = "";
    // this.saveResult = "";

    this.initStorage = function(data) {
        AV.init({
            appId: this.APP_ID,
            appKey: this.APP_KEY
        });
        this.setData(data);
    }
    // 如果数据不为空，那么就把data的用户名设置为这个av的用户名
    this.setData = function(data) {
        if (data != undefined && data != null) {
            this.username = data.username;
        }
    }

    // 保存到leancloud-一个标签页
    this.saveData = function (data) {
        let ReadInfo = AV.Object.extend('ReadInfo')

        data.forEach(function (value) {
            let item = new ReadInfo()
            let day = new Date()
            console.log(value)
            item.set('url', value.url)
            item.set('title', value.title)
            item.set('day', day)
            item.set('owner', AV.User.current())
            item.save().then(()=> {
                //  发布成功，跳转到商品 list 页面
                // 这里应该发消息，关掉popup界面
                // chrome.runtime.sendMessage({closePopup: true}, function(response) {
                // });
                // this.saveResult = "success"
            }, function(error) {
                alert(JSON.stringify(error));
            });
        });
    }

}