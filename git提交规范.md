## git提交规范

----

### Commit message的格式

```
<type>([optional scope]): <description> 
（注意冒号后面有空格）
```

#### type 定义提交类型 - 主要用到下面几个, 表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？ 

- feat - 新功能

- fix - 修复bug

- style - 代码格式修改

- build - 打包

- docs - 文档注释

- refactor - 重构, 优化

    ![image-20210525150317967](https://i.loli.net/2021/05/25/FqxveX7Vh2dPGLl.png)



#### scope 框定改动的范围 - 用于标识此次提交主要涉及到代码中哪个模块, 可以是目录名, 可以是功能点名称, 也可以是需求名或者代码

#### description - 描述完成的任务内容. 一个需求点改造一次提交.

#### 举例:

```
git commit -m 'fix(account): 修复xxx的bug'

git commit -m 'feat(zxygt-1485): xxx业务开发'

git commit -m 'fix(功能点名称): 修复xxxx'
```



## 分支命名

---

1、主分支：master

2、开发分支：dev

3、临时分支：

功能分支在 feature文件下:  feature/feat_x （从 dev 检出）

bug修复分支在 fix文件下: fix/bug_x  （从 master 检出）

预发布分支在relase文件下: release/版本号 （从 dev 检出）

