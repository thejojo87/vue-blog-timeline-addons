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
    this.saveData = function (data, currentUser) {
        console.log('要保存了，savedata'+ data + currentUser)
        let ReadInfo = AV.Object.extend('ReadInfo')

        data.forEach(function (value) {
            let item = new ReadInfo()
            let day = new Date()
            console.log(value)
            item.set('url', value.url)
            item.set('title', value.title)
            item.set('day', day)
            item.set('isFinished', false)
            item.set('owner', currentUser)
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

    // 在页面显示之前，把leancloud获取的数据加工一下
    this.parseItem = function(repo) {
        var item = {};
        item.owner = repo.get("owner").id;
        item.day = repo.get("day");
        item.url = repo.get("url");
        item.title = repo.get("title");
        item.isFinished = repo.get("isFinished");
        item.objectId = repo.get("objectId");
        return item;
    }

    // 修改finished状态
    this.changeFinishStatus = function (objId,status) {
        var statusToSave = AV.Object.createWithoutData('ReadInfo', objId);
        statusToSave.set('isFinished', status);
        statusToSave.save();
    }

    // 删除数据
    this.deleteTimelines = function (objId) {
        var timelinesToDelete = AV.Object.createWithoutData('ReadInfo', objId);
        timelinesToDelete.destroy().then(function (success) {
            // 删除成功
            console.log(success)
        }, function (error) {
            // 删除失败
        });
    }
    // 从leancloud获取数据，下载到本地等待展示
    this.getTimelines =  function (callback) {
        let query = new AV.Query('ReadInfo')
        query.equalTo('owner', AV.User.current())
        console.log(this.username)
        query.limit(1000)
        // leancloud默认是100条数据，
        query.ascending('createdAt')
        let _this = this;
        // 总觉得其实这一句没必要用=>不久完了么？
        query.find().then(function (results) {
            console.log(results)
            if (results != null && results.length > 0) {
                console.log("result is not null, length is " + results.length);
                console.log("results " + results);
                var array = [];
                for (var i = 0; i < results.length; i++) {
                    array[i] = _this.parseItem(results[i]);
                }
                callback(array);
            } else {
                callback(null);
            }
        }, function (error) {
            callback(null);
            console.error('Failed to find objects, with error message: ' + error.message);
        });
    }
}