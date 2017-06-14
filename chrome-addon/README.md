# vue-blog-timeline-addons 

[TOC]

## 目的：
我自己写了个vue的blog，这里我看到有人做了很棒的功能-timeline

https://github.com/taosin/ixinyi_admin/

我也想学习，但是他制作了safari的插件，我只用chrome和firefox，就想自己写吧。

## 功能：
1. 登陆leancloud界面，注册和登陆界面-xuexi pocket
pocket 会让你登陆，并且保存到本地
应该是如果没有本地用户信息就让你登陆和注册
保存过的网页，会显示红色图标，没保存过就是灰色图标。

会弹出来一个新的登陆界面，也不对，应该有本地默认保存leancloud的数据码就可以了。
（完成）

2. 用快捷键或者图标的方式保存数据- （完成）
3. 应该有个选项，默认的话，把全部的页面保存或者只保存一个 （完成）
4. 能不能同时保存到evernote？或者github？
5. 登陆后应该有个选项，保存此tab，还是全部tab （完成）
6. 登陆后应该展示所有的timeline保存的列表
7. 登陆后应该有个删除timeline的选项
8. 鼠标右键，可以保存全部或者此页（完成）
9. 有个options选项界面，manifest里配置options_page（配置github或者evernote什么的）
10. tag功能
11. 可以写简短的感想和评论
12. 有一个阅读状态，等待阅读，完成，

或者说打开就直接新建一个tab会好很多？
我想到一个方法用来保存在localstorage了。
登陆之后同时保存在localstorage不久可以了么？
但是这个插件功能就是在有网络的情况下，感觉没必要localstorage



****

#### 开发chrome插件
参考

gitlab，chrome扩展
http://www.jianshu.com/p/cf5b3fba44ea

最好的教程
http://www.ituring.com.cn/book/1421
开发文档官方
https://crxdoc-zh.appspot.com/extensions/tabs#method-query
学习的源码
https://segmentfault.com/a/1190000004360319
这里是一个av保存图片的例子leancloud

http://www.jianshu.com/p/5531e2169843


台湾人写的教程，快捷键部分有帮助
http://ithelp.ithome.com.tw/articles/10187354

真正的开发chrome的教程
 不过这里有点落伍了
 得按照这个来做
 https://www.foraker.com/blog/making-chrome-extensions-with-yeoman
 
 这里也有个项目，我在想要不要复制这个？
 
 todo
 http://www.cnblogs.com/smartXiang/p/6929617.html
https://github.com/lavyun/Easy-todo

https://github.com/airloy/objective-chrome-extension

vue.js 初体验：Chrome 插件开发实录
这里源代码我放在微云上了
这里明显少了太多东西，貌似也不是使用gulp做的。
因为他用的是vue1.0版本

会不会是使用vue-loader 和webpack新建项目。
然后把vue文件打包，添加manifest文件？
vue-loader 是一个加载器，能把如下格式的 Vue 组件转化成JavaScript模块
Webpack 是一个模块打包工具。在开发中，它把一堆文件中每个都作为一个模块处理，找出它们间的依赖关系，并打包成待发布的静态资源。
列举一个基本例子，设想我们有一堆的 CommonJS 的引用。它们是不能在浏览器直接运行，所以需要把它们 捆绑 成 <script> 标记内的单一文件。Webpack 就能按照 require() 调用的依赖关系为我们做到这点。

我意识到，我以前一直专注于npm run dev

但是其实应该是npm run build 是否也可以？
这是不是就把vue文件打包成一个html文件了？
然后把这个放进去就可以了？

npm init 就生成了package文件了
npm run build 就生成了一个dist文件夹，里面有个build.js文件，
而且index.html里插入了这个js文件。
不过文件目录需要变成./dist 才可以。而且图片的目录貌似是错误的。

https://www.mmxiaowu.com/article/5848227ed4352863efb55463

这里的问题6就是答案

不过看来vue就是这样子了。
现在的问题是，chrome插件源码下载下来，打包到dist？
还是？

放弃了，使用vue来开发chrome插件了。
直接用js来写也未尝不可，反正也很简单。

chrome开发教程
http://www.cnblogs.com/pingfan1990/p/4560215.html
知乎上chrome开发教程资源帖子
https://www.zhihu.com/question/20179805

##### 1.配置manifest文件

https://developer.chrome.com/extensions/manifest
完整属性表


permissions 这个以后再配置 "contextMenus" 添加右键菜单，notifications,桌面提醒，cookies 
options_page 这个是默认右键的选项，可选。指定options_page属性后，扩展图标上的右键菜单会包含“选项”链接
这里如果设置了，但是为空的话，控制台里会出现乱码的。
也可以在pop.html添加这句话
```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
```
background 这个是默认常驻后台的，常用的是子属性，scripts，这里添加jquery,或者leancloud，这个配置可以改变右键菜单
不过leancloud的sdk包里，av.js和av-min.js不知道有什么区别？貌似就是min是对的
chrome_url_overrides 可以自定义的页面替换 Chrome 相应默认的页面，比如新标签页（newtab）、书签页面（bookmarks）和历史记录（history）。
不过这个等以后，可以给自己的博客，设置一下
content_scripts : 访问和修改页面dom
当一个插件运作的时候，会注入js，这个可以在devtool，sources,content scripts看到
比如pocket是一个编译好的文件。
favorate image是一个data_persistents.js文件

我想使用bootstrap，貌似直接使用就可以了吧。
先下载jquery和bootstrap文件,放进包里
然后在background里添加了jquery
popup 里引用bootstrap jquery

```html
  <script src="js/jquery-3.2.1.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
```
这样就可以了

##### 2. popup页面

应该就一个注册或者额登陆的界面
从后台获取本地有没有登陆数据，如果有的话，那么就显示用户名

popup js文件

运行的时候新建了一个leancloud对象
获取av.currentUser,如果没有那么就onUserLoginStateChanged 这个方法
这个方法有if else。如果true，那么就表明currentUser并不是空，
然后再进行判断，是否authenticated，这个我没用过呢。
test if user logged in and session token is valid
什么时候isauthenticated 是true？什么时候是false？

cookie session token的区别
session是会话，放在服务器里敏感数据，cookie是本地用户数据。

authenticated true的话，


如果是false，那么就新建一个LocalStorage方法：然后传递消息给backgroundjs文件。
传递的是一个classname 字段。

https://crxdoc-zh.appspot.com/apps/messaging

popupjs无疑是启动了信号。
但是数据的存储storage全部都在data_persistent里
为了要达到这么目的，源码做的方式是：
在popup里发一个消息，给backgroundjs.
backgroundjs,启动data_psersistent的方法，把新建的storage，init了。
为什么要这么绕来绕去？
难道就不能在popupjs里，直接进行localstorage的建设么？
因为鼠标右键添加了一个功能，就是保存图片数据，所以这个方法就卸载background文件里。
所以要在background文件里，就要操作本地数据。
所以，需要popup之后，发送消息过来。

##### 3. login界面，register界面 (完成)

只有个标题： 返回（这个使用a标签来做了，href 变成popup.html）
还有input和output，还有个登陆按钮。
添加login.js文件。
新建了一个currentUser变量，并且登陆AV返回的loginedUser返回给了currentUser。
新见识到的是，当登陆成功之后，使用了window.location.href = './login.html'
跳转到popup界面

这里有两个问题：
1. currentUser怎么传过去？其他js怎么获取currentUser？是全局么？
currentUser 并没有被传送过去，只是做做样子罢了。
实际上，关键代码是new LeanCloudStorage().initStorage();
这一句，这一句初始化了一个av-这个av在backgroundjs里，然后login引用了这个。
之后使用了这个av，登陆，那么这个av里的currentuser就不是空了，
之后回到popup的时候那么就可以渲染用户名了。
2. 新建了一个leancloudStorage,init干什么？
每一个页面等于是独立的html和js文件。
所以需要init

消息传递文档：
https://crxdoc-zh.appspot.com/apps/messaging

##### 4. bg.js-添加右键菜单项
产生了一个问题：
就是background.js我在background里注册了。
但是当我试图使用jquery的￥ready的时候发现没反应。
而直接写上就有反应。
这是怎么回事？
其实是有反应的，但是console得在扩展界面里才能看到，因为bg是运行在后台的。

这里一个是添加了右键菜单，一个是添加了一个监视器
storage，这个以后再看看。

backgroundpage 页面可以在扩展程序界面里，检查视图里可以看到



##### 5. data_persistent.js

这里一个LeanCloudStorage这个方法包装了所有leancloud的方法。
popupjs会调用这里的例子，并且init一个对象
这个必须要调用在popup.html里才行

##### 6. 保存的逻辑是怎样的？
在popup里，有一个保存的按钮。
我应该在哪里出发保存，并且上传到leancloud的动作呢？
是在popup的全部做完？
还是只是发送一个消息？
发送消息给backgroundjs完成？
background调用datapersistent里的方法完成？
这样的话是不是等于和鼠标右键统一起来了？
消息内容是什么？是保存当前tab还是全部tab的选项？

![mark](http://oc2aktkyz.bkt.clouddn.com/markdown/20170614/011745768.png)

这里有个radio checkbox，当选择一个然后按下保存之后，
popupjs，发出一个message，给backgroundjs。
接收保存的类型之后，query方法获取当前tab或者全部tabs。
然后调用data——persistent里，storage的save方法来向leancloud上传数据

这一套代码，在鼠标右键里简单复用就可以了。

##### 7. 添加快捷键界面

http://ithelp.ithome.com.tw/articles/10187354
思路就是 使用commands.onCommand.addListener 来监控按键。
然后在manifest里command里设置

我在想，直接写死呢？还是让用户自己选择快捷键呢?
还是直接写死算了。简单点
alt+q alt+w

manifest里写快捷键，然后去backgroundjs里填写逻辑。
也就10行左右。

##### 8. 展示数据，并且分页
分页有点头痛。
leancloud他一次查询是默认100，最多1000条数据的。
我固然可以分时段，分查询返回的数量状态获取全部数据。
但是我在想，这样未免太麻烦了。
我可不可以只查询总数，而生成分页。
一开始只展示前20个数据。
当点击分页后再请求并展示下一个数据？
但是似乎这也有点麻烦。
全部数据下载下来应该其实也没多大才对吧。

https://segmentfault.com/q/1010000005150169

我选择，请求所有数据，并且用按钮来刷新展示元素。
bootstrap只提供了样式，我还得自己修改样式，也不是不可以。
但是能偷懒就偷懒吧。

试试这个插件吧
http://esimakin.github.io/twbs-pagination/




#### 开发firefox插件

参考copy urls export 这个插件

https://github.com/kashiif/copy-urls-expert

![mark](http://oc2aktkyz.bkt.clouddn.com/markdown/20170608/143022489.png)

这个会在浏览器上有个图标，还有下拉菜单，
并且tab的右键添加一个选项，可以选择只保存这个网页或者保存整个用户组

![mark](http://oc2aktkyz.bkt.clouddn.com/markdown/20170608/143039061.png)

