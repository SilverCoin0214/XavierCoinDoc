说明：本文以下图为指导进行编写，实际项目中请以负责人协定为主。可提前阅读阮一峰博客 [Git分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)

![image-20210422140704484](https://i.loli.net/2021/04/22/uZcspjMy6F4PwLR.png)

​	图来自 [Git 学习指南](https://fe.rualc.com/note/git.html#git-jian-jie)

## 1、图中分支简解

图中可以看到两个黑色的分支名，是常驻（重要）的两个分支：master  和 develop ，master 为主分支，主要用于发布版本，develop （以下简称 dev）为开发分支，主要用于管理日常开发。

1、从时间顺序看，图中做的第一件事情就是从 master 分出 dev 分支

```
git checkout -b develop master
// 或者你已经在 master 分支上，可以不需要在最后加上 where_are_from_branch
git checkout -b develop 
```



2、要干活了，新需求来了，从 dev 开出两条功能开发分支 feature _x、feature _y，小明和小红很开心的在分支上正常开发提交

```
// 同上，假设我们在 dev 分支了
git checkout -b feature_x 
git checkout -b feature_y

//小明很厉害，马上做好了一些功能，通过以下命令把修改的东西提交到暂存区，然后提交
git add . //暂存所有修改。
git add <file> //通过文件名，暂存部分修改
git commit -m "commit message" //把暂存区里的修改提交到本地分支，此时还都在 feature_x 分支上

//或者通过一条命令直接暂存和提交
git commit -a -m "commit message"
```



3、有一天，生产出 bug 了，被客户一通投诉后，负责人马上从 master 开出 hotfix_x 进行修复，经过九牛二虎之力，终于 ok 了，把修改合并到 master 分支 和  dev 分支（同步代码）

```
git checkout -b hotfix_bug1 master
// ..... 经过一番努力
git commit -a -m "fix:fix bug1"
git checkout master // 到 master 分支上
git merge --no-ff hotfix_bug1  // 把 hotfix_bug1 的修改合并过来，关于 --no-ff ，会在master分支上生成新节点，文章后面会说明
git push origin master //提交到远程分支
git tag -a 1.0.1 // 本地分支打标签 (-a 表示带注解)
git push origin --tags //把本地打的标签都推上去
// 同步到 dev 分支
git checkout dev
git merge --no-ff hotfix_bug1
git branch -d hotfix_bug1 // 删除补丁分支
```

4、几天过去了，小明需求做完了，经过测试ok，这时候负责人把小明代码合并到 dev，和其他人的代码合并，开了一个预发布分支 release_pre_1.0.2，进行回归测试（如果没问题，就可以合并到 master 了），但是此时发现有 bug ，在 预发布分支 上修改，修改后同步到 dev 分支，继续测试，测了几轮，没问题，准备发布，于是把 预发布分支 代码 合并到 master 分支 和 同步到 dev 分支，删除该预发布分支 ，在master 上发布版本，打 tag。

5、其他内容自行脑补。

## <span id="分支命名管理说明">2、分支命名管理说明</span>

1、主分支：master

2、开发分支：dev

3、临时分支：

功能分支  feature_x    （从 dev 检出）

bug修复分支 hotfix_bugx  （从 master 检出）

预发布分支 release_pre_x （从 dev 检出）

## <span id="命令说明">3、命令说明</span>

```
git clone http://xxxxx.git  克隆远程分支代码 (最开始只有 master 分支)
git branch dev master // 从 master 开出 dev 分支
git checkout dev // 切换到 dev 分支
git checkout -b dev master // 从 master 开出 dev 分支 并 切换到 dev 分支
git push origin dev:dev //提交本地 dev 分支作为远程的 dev 分支

git branch -d dev // 删除本地分支
git remote rm dev // 删除远程分支 或 git push origin :dev

git pull origin dev:dev //将远程 dev 分支拉取下来到 本地 dev 上
git checkout dev // 切换到 dev 分支

git add . //提交修改到本地暂存
git rm --cached // 将暂存区内容移出，使其为修改状态，如果是未提交，直接是未跟踪状态 (慎用此命令)
git commit -m "add:commit message" //把暂存区修改合并到本地分支
git push origin dev //提交到远程分支
git checkout master //切换到 master 分支
git merge --no-ff dev // 合并 dev 代码 ，一般不推荐使用 rebase,关于merge 和 rebase ，文章后面做简要说明
git tag -a 1.0.1 //标签
git push origin master //提交到远程仓库
git push origin --tags //提交标签

```

以上是关于分支管理的理想情况，但是有时候我们想撤销某个文件或者当前所有文件的修改，或者撤销之前的提交 （一下操作都不涉及远程分支，如果要推送，需要 push）

``` 
git reset --hard HEAD //撤销当前工作目录中未提交的修改 （工作区和暂存区都会被本地分支代码覆盖）
git checkout . 回退本地所有修改（涉及工作区，暂存区和分支内容不会变化）
git checkout HEAD <file> //回退某个文件修改（涉及工作区，暂存区和分支内容不会变化）
git revert <commit> // 撤销某次提交 通过 git log 查看某次提交的 hash code
```

## 4、其他

```
git checkout master
git merge hotfix //（暴力） 把 master 分支移动到 hotfxt ，并移动 HEAD 指针

git merge --no-ff hotfix  // 非强制快速合并,在 master 上新建一个节点，完成合并 （推荐）

git merge --squash hotfix  //不保存对hotfix分支的引用,在 master 上新建一个节点，完成合并
```



```
git rebase master  //补丁和修改在master再做一遍
//有冲突时 修复后 
git add .
git rebase --continue
git checkout master 
git merge hotfix

git rebase --onto master server client //取出 client 在 server 分支上的补丁和修改，rebase 到 master 上
```

![image-20210422154804800](https://i.loli.net/2021/04/22/9SbzjD8BRuZQL2O.png)

## 5、总结

### 1、分支命名管理，请参考 [2、分支命名管理说明](#分支命名管理说明)

### 2、具体命令请见 [3、命令说明](#命令说明)

### 3、合并分支请使用 

```
git merge --no-ff hotfix  // 非强制快速合并,在 master 上新建一个节点，完成合并
```

### 4、使用 commitlint 管理 Commit message 和 Change log 编写

Commitlint 提交规范：

commitlint 推荐我们使用 config-conventional 配置去写 commit

提交格式（注意冒号后面有空格）

```
git commit -m <type>[optional scope]: <description>
```

type ：用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？ 

optional scope：一个**可选**的修改范围。用于标识此次提交主要涉及到代码中哪个模块。

description：一句话描述此次提交的主要内容，做到言简意赅。

常用的 type 类型
![image-20210525150317967](https://i.loli.net/2021/05/25/FqxveX7Vh2dPGLl.png)
例子

```
git commit -m 'fix(account): 修复xxx的bug'
git commit -m 'refactor: 重构整个项目'
```



## 6、参考资料

[阮一峰-Git分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)

[Git 教程](https://www.runoob.com/git/git-tutorial.html)

[Git 学习指南](https://fe.rualc.com/note/git.html#git-jian-jie)

