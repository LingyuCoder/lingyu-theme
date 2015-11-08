Hexo Theme: Lingyu
============

#Lingyu
Lingyu is a theme for Hexo.

**This theme was deprecated, the new one on [http://lingyu.wang](http://lingyu.wang) is [ly](https://github.com/LingyuCoder/ly).** 

#Prepare
```
npm install --save hexo-renderer-jade
npm install --save hexo-renderer-less
```

#Install
```
cd your-hexo-blog
git clone git@github.com:LingyuCoder/lingyu-theme.git themes/lingyu
```

#Enable
Modify your hexo `_config.yml`, set `theme` to `lingyu`

#Update
```
cd themes/lingyu
git pull
```

#Config
All config options can be found in `themes/lingyu/_config.yml`.

##Languages
Modify `language` option in `hexo/_config.yml` 

* English: default
* 简体中文：zh-CN

##Menu
```
##### Menu
menu:
  home: /
  archives: /archives
  about: /about
```

##Avatar
```
##### Avatar
avatar: 
  enable: true ##if false, the avatar will be hidden
  link: /about.html ##where to go when the avatar is clicked
  image: images/avatar.jpg ##the picture
```

##Widgets
```
##### widgets
widgets:
- recents
- tags
- categories
- friends
- archieves

##provide four widgets:
## recents: recent five posts
## tags: all tags
## categories: all categories
## friends: your friends links
## archieves: all your posts


##### friends links
friends:
  baidu: http://baidu.com
  google: http://google.com.hk
  tmall: http://tmall.com
```

##Info
* feed
* github
* twitter
* facebook
* weibo

```
##### Author information
feed: ##eg: 'atom' will be '/atom.xml'
github: ##eg: 'git_name' will be 'http://github.com/git_name'
weibo: ##eg: 'weibo_name' will be 'http://weibo.com/weibo_name'
twitter: ##eg: 'twitter_name' will be 'http://twitter.com/twitter_name'
facebook: ##eg: 'facebook_name' will be 'http://facebook.com/facebook_name'
```

##Comment
* disqus
* duoshuo

```
##### duoshuo comments
duoshuo:
  enable: false
  short_name: ##your duoshuo short name

##### disqus comments
disqus:
  enable: false
  short_name: ##your disqus short name
```

##Analytics
* google
* baidu

```
##### Google Analytics
google_analytics: 
  enable: false
  id: ##your google analytics ID
  site: ##your site

##### Baidu Analytics
baidu_tongji:
  enable: false
  id: ##your baidu analytics ID
```

##Share
* jiathis
```
##### jiathis
jiathis:
  enable: false
  id: ##your jiathis user ID
```
