# docker

## 安装 docker

### 删除旧 docker

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

1. **sudo：** 在 Linux 系统中, 执行系统级别的操作（如软件包的安装、卸载等）通常需要超级用户（root）权限. sudo 命令允许普通用户以超级用户的身份执行后续命令.

2. **yum remove：** yum 是 Red Hat 系 Linux 系统中用于管理软件包的工具. remove 是 yum 的一个子命令, 其作用是从系统中卸载指定的软件包.

3. **软件包列表：**

docker：这是 Docker 的基础软件包.
docker-client：Docker 客户端软件包, 它提供了与 Docker 守护进程进行交互的命令行工具.
docker-client-latest：最新版本的 Docker 客户端软件包.
docker-common：包含 Docker 通用的文件和配置.
docker-latest：最新版本的 Docker 软件包.
docker-latest-logrotate：用于管理 Docker 最新版本日志轮转的软件包, 日志轮转可以确保日志文件不会无限增长.
docker-logrotate：用于管理 Docker 日志轮转的软件包.
docker-engine：Docker 引擎软件包, 它是 Docker 的核心组件, 负责管理容器的创建、运行等操作.

### 配置docker yum源

```sh
sudo yum install -y yum-utils
sudo yum-config-manager \
--add-repo \
http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

1. **yum install：** yum 是 CentOS 系统中用于软件包管理的工具, yum install 用于安装新的软件包.
2. **-y：** 这是 yum 命令的一个选项, 其作用是在安装软件包时自动回答所有提示为 “yes”, 避免在安装过程中需要手动确认每个步骤.
3. **yum-utils：** 这是一个包含了一些实用工具的软件包, 这些工具能辅助管理 yum 软件源, 像 yum-config-manager 就包含在其中.
4. **yum-config-manager：** 这是 yum-utils 软件包中的一个工具, 用于管理 yum 的软件源配置.
5. **--add-repo：** 这是 yum-config-manager 工具的一个选项, 其作用是向 yum 的配置中添加一个新的软件源.
6. **http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo：** 这是阿里云提供的 Docker 社区版（Docker CE）的软件源配置文件的 URL. yum 会从这个 URL 下载配置文件, 然后依据该配置文件从对应的镜像源获取
   Docker 相关的软件包.

### 安装最新 docker

```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 启动 docker

```sh
systemctl enable docker --now
```

1. **systemctl：** 这是 systemd 系统和服务管理器的主要命令行工具, 用于管理系统服务、控制启动过程等.
2. **enable：** 此选项用于设置服务在系统启动时自动启动. 当你使用 enable 来配置某个服务, 系统会创建相应的符号链接, 从而让服务在开机时被激活.
3. **docker：** 指的是 Docker 服务, Docker 是用于开发、部署和运行应用程序的开源平台, 它使用容器化技术将应用及其依赖项打包成独立的容器.
4. **--now：** 这是一个可选参数, 它的作用是在启用服务的同时立即启动该服务. 若不使用此参数, 服务只会在下次系统启动时自动启动, 当前不会启动.

> 执行 systemctl enable docker --now 命令, 意味着你要让 Docker 服务在系统每次启动时自动启动, 并且在执行该命令后马上启动 Docker 服务.

### 配置镜像加速

```sh
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://mirror.ccs.tencentyun.com",
        "https://docker.m.daocloud.io"
    ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

1. sudo mkdir -p /etc/docker

- **mkdir：** 这是一个用于创建目录的命令.
- **-p：** mkdir 命令的选项, 意思是 “parents”. 如果指定的目录路径中某些父目录不存在, 它会一并创建这些父目录, 避免因父目录不存在而导致创建失败.
- **/etc/docker：** 要创建的目录路径. 此目录一般用于存放 Docker 的配置文件.

2. sudo tee /etc/docker/daemon.json <<-'EOF'

- **tee：** 此命令的作用是将标准输入的数据同时输出到标准输出和指定的文件.
- **/etc/docker/daemon.json：** 指定要写入数据的文件路径, daemon.json 是 Docker 的配置文件, 用于配置 Docker 守护进程的行为.
- **<<-'EOF'：** 这是一个 “Here Document”（ heredoc）语法, 用于输入多行文本. EOF 是自定义的分隔符, 你可以使用其他字符串来替代它. 在 EOF 之间的文本会被当作输入传递给 tee 命令. - 表示忽略 EOF 前的缩进.

3. EOF

- 表示 “Here Document” 的结束, 即多行文本输入结束.

4. sudo systemctl daemon-reload

- **systemctl：** 是 systemd 系统和服务管理器的命令行工具, 用于管理系统服务.
- **daemon-reload：** 此命令会重新加载 systemd 守护进程的配置文件, 确保 systemd 能识别到最新的服务配置. 当你修改了 Docker 的配置文件后, 需要重新加载 systemd 的配置, 让其生效.

## 命令

启动一个 nginx, 并将它的首页改为自己的页面, 发布出去, 让所有人都能使用

> 整体步骤：下载镜像 → 启动容器 → 修改页面 → 保存镜像 → 分享社区

### 镜像相关命令

1. 检索：docker search
2. 下载：docker pull
3. 列表：docker images
4. 删除：docker rmi

```sh
docker search nginx # 在应用市场中搜索nginx镜像
docker pull nginx # 下载nginx镜像,如果想要下载指定版本,在docker hub上搜索镜像,复制镜像的tag,然后在后面加上tag,例如:docker pull nginx:1.21.6
docker images # 查看镜像列表,也可以使用docker image ls
docker rmi nginx # 删除nginx镜像,如果想删除指定版本,使用docker rmi nginx:<Tag>或者docker rmi <Image ID>
```

### 容器相关命令

1. 运行: docker run

```sh
docker run --help # 查看run命令的帮助文档
```

```sh
docker run nginx # 如果不指名版本,默认使用latest版本,如果没有下载过,会先下载再运行
```

2. 查看：docker ps

```sh
docker ps -a # 查看所有容器,包括正在运行的和停止的
docker ps # 查看正在运行的容器
```

3. 停止：docker stop

```sh
docker stop <container_id> # 停止容器,如果想停止多个容器,可以使用docker stop <container_id1> <container_id2>
docker start <container_id> # 启动容器,如果想启动多个容器,可以使用docker start <container_id1> <container_id2>
```

4. 启动: docker start
5. 重启: docker restart
6. 状态: docker stats
7. 日志: docker logs
8. 进入: docker exec
9. 删除: docker rm

删除容器前,需要先停止容器,否则会报错. 或者使用 docker rm -f \<container_id> 强制删除容器.

#### docker run 的使用细节

如果只使用 docker run nginx, 此时容器是在命令行启动的, 会阻死命令行, 并且在浏览器上无法访问 80 端口.

```sh
docker run -d --name mynginx nginx # -d 表示后台运行, 此时容器会在后台运行, 不会阻塞命令行,--name 表示容器的名称, 可以自定义, 默认为随机名称
```

此时, 容器会在后台运行, 但是在浏览器上无法访问 80 端口, 因为容器的 80 端口没有映射到宿主机的某一端口上.

```sh
docker run -d --name mynginx -p 88:80 nginx # -p 表示端口映射, 88:80 表示将容器的 80 端口映射到宿主机的 88 端口, 此时容器的 80 端口就可以被宿主机访问了
```

> **总结:** 如果使用 docker 启动一个容器, 想要让外边随时能访问, 一定要为这个容器暴露端口, 也就是做端口映射 ( -p ).

`思考: 88 能不能重复? 80 能不能重复?`

1. 88 不能重复, 因为 88 是主机的端口, 同一台主机上的同一个端口只能开一个.
2. 80 可以重复, 因为 80 是容器的端口, 而容器可以有很多个, 并且容器之间是隔离的.

### 修改 nginx 的默认页面

1. 使用 docker exec 进入到装了 nginx 的容器中
2. 在这个容器中, 找到这个页面 /user/share/nginx/html (这是 nginx 的默认页面路径)
3. 修改页面内容

[![pEWZvo6.png](https://s21.ax1x.com/2025/04/13/pEWZvo6.png)](https://imgse.com/i/pEWZvo6)

docker 的默认页面路径在官网有:

[![pEWZ6zQ.png](https://s21.ax1x.com/2025/04/13/pEWZ6zQ.png)](https://imgse.com/i/pEWZ6zQ)

```sh
docker exec -it mynginx /bin/bash # -it 表示交互式执行, 此时会进入到容器中, /bin/bash 是 Bash shell 的可执行文件路径，执行此命令意味着你将在容器内开启一个交互式的 Bash shell，这样就能像操作普通 Linux 系统一样在容器里执行各种命令。
```

```sh
# 进入容器后
ls / # 查看容器下的目录结构
```

```sh
# 进入容器后
cd /usr/share/nginx/html # 进入到 nginx 的默认页面路径
```

```sh
echo "<h1>hello, docker</h1>" > index.html # 将字符串 "<h1>hello, docker</h1>" 写入到 index.html 文件中
```

这条命令的整体作用是创建一个名为 index.html 的文件（如果该文件不存在），并将字符串 \<h1>hello, docker\</h1> 写入到这个文件中。

1. **echo:** echo 是一个常用的 shell 命令，其主要功能是将指定的字符串输出到标准输出（通常就是终端屏幕）。在这个命令里，要输出的字符串是 \<h1>hello, docker\</h1>。该字符串是一个 HTML 标签，\<h1> 是 HTML 中的一级标题标签，意味着 “hello, docker” 会以一级标题的样式显示。
2. **> :** 重定向操作符 > 的作用是把命令的输出结果写入到指定的文件中。若文件不存在，会创建该文件；若文件已存在，会覆盖文件原有的内容。在这个命令中，> 后面紧跟的 index.html 是目标文件名。因此，echo 命令输出的 \<h1>hello, docker\</h1> 会被写入到 index.html 文件中。

> 这条命令的整体作用是创建一个名为 index.html 的文件（如果该文件不存在），并将字符串 \<h1>hello, docker\</h1> 写入到这个文件中。之后，你可以使用浏览器打开 index.html 文件，会看到页面上显示 “hello, docker”，并且是以一级标题的样式呈现。

如果仅执行 echo 命令而不进行重定向，在终端输入并执行以下命令：

```sh
echo "<h1>hello, docker</h1>"
```

这个命令会将字符串 \<h1>hello, docker\</h1> 输出到终端屏幕上，而不会写入到任何文件中。

```sh
cat index.html # 查看 index.html 文件的内容
```

**cat:** 这是 Unix 和类 Unix 系统中的一个实用工具，它是 “concatenate”（连接、串联）的缩写。cat 命令的基础用途是显示文件内容，同时也能够用于连接多个文件内容并输出，还能创建新文件。

```sh
exit # 退出容器
```

### 保存镜像

#### 提交: docker commit

> 该命令的主要功能是基于一个正在运行或者已经停止的容器，创建一个新的 Docker 镜像。这个新镜像会包含容器在创建时的文件系统状态以及对其所做的所有更改。

[![pEWeW1e.png](https://s21.ax1x.com/2025/04/13/pEWeW1e.png)](https://imgse.com/i/pEWeW1e)

```sh
docker commit --help # 查看commit命令的帮助文档
```

docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

1. **docker commit**
   这是 Docker 客户端命令，表明要执行将容器保存为镜像的操作。
2. **[OPTIONS]**
   这是可选参数部分，用于对 docker commit 操作进行更多的控制和定制，以下是一些常用选项：
    - -a, --author：指定镜像的作者信息，例如 --author="John Doe"。
    - -c, --change：在创建镜像时应用 Dockerfile 指令，比如 --change='CMD ["nginx", "-g", "daemon off;"]'。
    - -m, --message：为镜像添加提交信息，类似于 Git 提交时的注释，如 --message="Update nginx configuration"。
    - -p, --pause：在提交时暂停容器的运行，默认值为 true。
3. **CONTAINER**
   这是必需参数，代表要保存为镜像的容器的名称或者 ID。你可以使用 docker ps （查看正在运行的容器）或者 docker ps -a （查看所有容器，包括已停止的）命令来获取容器的名称或 ID。
4. **[REPOSITORY[:TAG]]**
   这是可选参数，用于指定新创建镜像的仓库名称和标签：
    - REPOSITORY：镜像的仓库名称，通常用于组织和分类镜像，例如 mynginx 或者 myregistry.com/mynginx 。
    - TAG：镜像的标签，用于区分同一仓库下的不同版本，默认标签为 latest。如果不指定标签，会使用 latest 作为默认标签，例如 mynginx:1.0 表示版本为 1.0 的 mynginx 镜像。

#### 保存: docker save

> 在 Docker 中，当你需要将镜像传输到其他 Docker 环境（如另一台服务器）时，可使用 docker save 命令把镜像保存为本地的 tar 文件，之后就可以把这个文件复制到其他地方并使用 docker load 命令加载镜像。

```sh
docker save --help # 查看save命令的帮助文档
```

docker save [OPTIONS] IMAGE [IMAGE...]

1. **docker save**
   这是 Docker 客户端的命令，表明要执行将镜像保存为 tar 归档文件的操作。
2. **[OPTIONS]**
   这是可选参数部分，用于对 docker save 操作进行更多控制和定制，常见选项如下：
    - -o, --output：指定保存的 tar 文件的输出路径和文件名。例如 -o myimages.tar 会将镜像保存到名为 myimages.tar 的文件中。若不指定该选项，镜像的 tar 归档内容会输出到标准输出，通常需要使用重定向将其保存到文件，如 docker save myimage > myimage.tar。
3. **IMAGE [IMAGE...]**
   这是必需参数，指定要保存的 Docker 镜像。可以是单个镜像，也可以是多个镜像，多个镜像之间用空格分隔。镜像可以通过名称和标签指定，如 nginx:latest；也可以通过镜像 ID 指定。

[![pEWm3ge.png](https://s21.ax1x.com/2025/04/13/pEWm3ge.png)](https://imgse.com/i/pEWm3ge)

#### 加载: docker load

```sh
docker load --help # 查看load命令的帮助文档
```

docker load [OPTIONS]

1. **docker load：** 这是 Docker 客户端的命令，用于触发加载镜像归档文件的操作。
2. **[OPTIONS]：** 是可选参数部分，下面是一些常用选项：
    - -i, --input：指定要加载的镜像归档文件的路径。例如，-i myimages.tar 表示加载名为 myimages.tar 的文件。若不使用此选项，默认会从标准输入读取镜像归档数据，所以你也可以通过重定向来加载文件，如 docker load < myimages.tar。
    - --quiet, -q：启用该选项后，只显示进度信息，不会输出额外的详细信息，让输出更加简洁。

[![pEWm52F.png](https://s21.ax1x.com/2025/04/13/pEWm52F.png)](https://imgse.com/i/pEWm52F)

### 将镜像推送到仓库

1. 在网页登录 docker hub
2. 在客户端登录 docker hub
3. 推送镜像

```sh
docker login # 登录docker hub
```

docker hub 为了区分镜像的名字, 会把镜像的名字分成两部分, 一部分是用户的名字, 一部分是镜像, 例如: zhangsan:mynginx.
因此需要使用 docker tag 命令来给镜像打标签, 然后再推送.
将 mynginx:v1.0 的名字改为 ltobcontinued/mgnginx:v1.0

```sh
docker tag mynginx:v1.0 ltobcontinued/mgnginx:v1.0
```

将 ltobcontinued/mgnginx:v1.0 推送到 docker hub

```sh
docker push ltobcontinued/mgnginx:v1.0
```

> 细节: 在别人下载自己的镜像的时候, 人如果没有指定 tag, 或默认下载 latest 标签下的镜像, 如果没有的话, 就会报错, 因此最好将最新推送上去的镜像在以 latest 的标签再推送一遍. 这样别人就可以直接使用 docker pull ltobcontinued/mgnginx 来下载最新的镜像了.

### 数据卷

- 数据卷是宿主机中的一个目录或文件
- 当容器目录和数据卷目录绑定后, 对方的修改会立即同步
- 一个数据卷可以被多个容器同时挂载
- 一个容器也可以被挂载多个数据卷

#### 数据卷的作用

1. 容器数据持久化
2. 外部机器和容器间接通信
3. 容器之间数据交换

#### 配置数据卷

- 创建启动容器时, 使用 -v 参数 设置数据卷

```sh
docker run ... -v <宿主机目录(文件)>:<容器目录(文件)>
```

**注意事项: **

1. 目录必须是绝对路径
2. 如果目录不存在, 会自动创建
3. 可以挂载多个数据卷

##### 挂载数据卷

[![pE4MxPA.png](https://s21.ax1x.com/2025/04/19/pE4MxPA.png)](https://imgse.com/i/pE4MxPA)

##### 数据卷的数据同步

在宿主机目录下创建一个文件

[![pE4QS2t.png](https://s21.ax1x.com/2025/04/19/pE4QS2t.png)](https://imgse.com/i/pE4QS2t)

此时在容器目录下也可以看到这个文件

[![pE4QpxP.png](https://s21.ax1x.com/2025/04/19/pE4QpxP.png)](https://imgse.com/i/pE4QpxP)

如果在容器中修改或创建了文件

[![pE4QPr8.png](https://s21.ax1x.com/2025/04/19/pE4QPr8.png)](https://imgse.com/i/pE4QPr8)

在宿主机中同样可以看到

[![pE4QAaQ.png](https://s21.ax1x.com/2025/04/19/pE4QAaQ.png)](https://imgse.com/i/pE4QAaQ)

##### 一个容器可以挂载多个数据卷

[![pE4Qgzt.png](https://s21.ax1x.com/2025/04/19/pE4Qgzt.png)](https://imgse.com/i/pE4Qgzt)

##### 两个容器挂载同一个数据卷, 实现数据交换

1. 创建两个容器, 数据卷都挂载到 /data 目录下

```sh
[root@VM-0-10-centos ~]# docker run -it --name=c3 -v ~/data:/root/data centos:7
[root@3967f4d135b6 /]# cd ~
[root@3967f4d135b6 ~]# ll
total 8
-rw------- 1 root root 3416 Nov 13  2020 anaconda-ks.cfg
drwxr-xr-x 2 root root 4096 Apr 19 06:53 data
[root@3967f4d135b6 ~]# cd data
[root@3967f4d135b6 data]# ll
total 4
-rw-r--r-- 1 root root 7 Apr 19 06:53 a.txt
-rw-r--r-- 1 root root 0 Apr 19 06:51 itheima.txt
```

```sh
[root@VM-0-10-centos data]# docker run -it --name=c4 -v ~/data:/root/data centos:7
[root@b317c5c7921f /]# cd ~/data
[root@b317c5c7921f data]# ll
total 4
-rw-r--r-- 1 root root 7 Apr 19 06:53 a.txt
-rw-r--r-- 1 root root 0 Apr 19 06:51 itheima.txt
```

2. 在 c4 中创建一个文件, 并写入内容

```sh
[root@b317c5c7921f data]# echo itcast > itcast.txt
[root@b317c5c7921f data]# ll
total 8
-rw-r--r-- 1 root root 7 Apr 19 06:53 a.txt
-rw-r--r-- 1 root root 7 Apr 19 07:17 itcast.txt
-rw-r--r-- 1 root root 0 Apr 19 06:51 itheima.txt
[root@b317c5c7921f data]# cat itcast.txt
itcast
```

3. 在 c3 中查看文件内容

```sh
[root@3967f4d135b6 data]# ll                                                    
total 8
-rw-r--r-- 1 root root 7 Apr 19 06:53 a.txt
-rw-r--r-- 1 root root 7 Apr 19 07:17 itcast.txt
-rw-r--r-- 1 root root 0 Apr 19 06:51 itheima.txt
[root@3967f4d135b6 data]# cat itcast.txt
itcast
```

#### 数据卷容器

多容器进行数据交换的方法：

1. 多个容器挂载同一个数据卷
2. 数据卷容器

##### 配置数据卷容器

1. 创建启动 c3 数据卷容器，使用 -v 参数 设置数据卷

```sh
docker run -it --name=c3 -v /volume centos:7 /bin/bash
```

> 我们注意到这行命令中 -v 后面的数据卷变成了只有冒号右侧的那一部分，左边的部分不见了，只剩下了容器中的数据卷目录（即 -v 后面需要写的是容器中的目录）。而用这种方式，docker 会在宿主机上自动分配一个目录当做数据卷。

使用 docker inspect 可以查看容器的细节

```sh\
[root@VM-0-10-centos ~]# docker inspect c3
[
    {
        "Id": "b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080",
        "Created": "2025-04-19T07:40:56.48548687Z",
        "Path": "/bin/bash",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 31004,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2025-04-19T07:40:56.682116113Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:eeb6ee3f44bd0b5103bb561b4c16bcb82328cfe5809ab675bb17ab3a16c517c9",
        "ResolvConfPath": "/var/lib/docker/containers/b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080/hostname",
        "HostsPath": "/var/lib/docker/containers/b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080/hosts",
        "LogPath": "/var/lib/docker/containers/b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080/b06c72d97319a8164a338dfe8ef68ef368994d1b890aece3e87a245bdaf63080-json.log",
        "Name": "/c3",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "bridge",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "ConsoleSize": [
                48,
                218
            ],
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "host",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": [],
            "BlkioDeviceWriteBps": [],
            "BlkioDeviceReadIOps": [],
            "BlkioDeviceWriteIOps": [],
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": null,
            "Ulimits": [],
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware",
                "/sys/devices/virtual/powercap"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/a6f733d032146fbad22e39c81a140f34e51b905189700bb269a53c041acc72c3-init/diff:/var/lib/docker/overlay2/86abf6a8e552e66bc6519f0bc88d5e6a2e9346cd6846d397e53d2216cdbfdbef/diff",
                "MergedDir": "/var/lib/docker/overlay2/a6f733d032146fbad22e39c81a140f34e51b905189700bb269a53c041acc72c3/merged",
                "UpperDir": "/var/lib/docker/overlay2/a6f733d032146fbad22e39c81a140f34e51b905189700bb269a53c041acc72c3/diff",
                "WorkDir": "/var/lib/docker/overlay2/a6f733d032146fbad22e39c81a140f34e51b905189700bb269a53c041acc72c3/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [
            {
                "Type": "volume",
                "Name": "441df686a0559bfc8f7dfd8f3512bad8d8244e9371cb4a4c8fb89558cffb3314",
                "Source": "/var/lib/docker/volumes/441df686a0559bfc8f7dfd8f3512bad8d8244e9371cb4a4c8fb89558cffb3314/_data",
                "Destination": "/volume",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
        "Config": {
            "Hostname": "b06c72d97319",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "centos:7",
            "Volumes": {
                "/volume": {}
            },
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20201113",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS",
                "org.opencontainers.image.created": "2020-11-13 00:00:00+00:00",
                "org.opencontainers.image.licenses": "GPL-2.0-only",
                "org.opencontainers.image.title": "CentOS Base Image",
                "org.opencontainers.image.vendor": "CentOS"
            }
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "2ccddd4ed6b2292a230fb36517094284d1d8a9d767899a9730864559c396d740",
            "SandboxKey": "/var/run/docker/netns/2ccddd4ed6b2",
            "Ports": {},
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "bf68e77e56c841a61ba540c271e0341b2b8b3ed4a37832951c0526be7e2f96bf",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:11:00:02",
                    "NetworkID": "7a2e85ddc49a2307d652b726695139cd0ba95c6d1324b8c782573ac5bcea4ef5",
                    "EndpointID": "bf68e77e56c841a61ba540c271e0341b2b8b3ed4a37832951c0526be7e2f96bf",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DriverOpts": null,
                    "DNSNames": null
                }
            }
        }
    }
]
```

在 Mounts 中，Source 是容器所挂载的数据卷的目录，Destination 是容器中数据的目录。

2. 创建启动 c1 c2 容器，使用 **--volumes-from** 参数 设置数据卷

```sh
[root@VM-0-10-centos ~]# docker run -it --name=c1 --volumes-from c3 centos:7
[root@139c4393f542 /]# ll
total 60
-rw-r--r--   1 root root 12114 Nov 13  2020 anaconda-post.log
lrwxrwxrwx   1 root root     7 Nov 13  2020 bin -> usr/bin
drwxr-xr-x   5 root root   360 Apr 19 07:43 dev
drwxr-xr-x   1 root root  4096 Apr 19 07:43 etc
drwxr-xr-x   2 root root  4096 Apr 11  2018 home
lrwxrwxrwx   1 root root     7 Nov 13  2020 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Nov 13  2020 lib64 -> usr/lib64
drwxr-xr-x   2 root root  4096 Apr 11  2018 media
drwxr-xr-x   2 root root  4096 Apr 11  2018 mnt
drwxr-xr-x   2 root root  4096 Apr 11  2018 opt
dr-xr-xr-x 106 root root     0 Apr 19 07:43 proc
dr-xr-x---   2 root root  4096 Nov 13  2020 root
drwxr-xr-x  11 root root  4096 Nov 13  2020 run
lrwxrwxrwx   1 root root     8 Nov 13  2020 sbin -> usr/sbin
drwxr-xr-x   2 root root  4096 Apr 11  2018 srv
dr-xr-xr-x  13 root root     0 Apr 19 06:56 sys
drwxrwxrwt   7 root root  4096 Nov 13  2020 tmp
drwxr-xr-x  13 root root  4096 Nov 13  2020 usr
drwxr-xr-x  18 root root  4096 Nov 13  2020 var
drwxr-xr-x   2 root root  4096 Apr 19 07:40 volume
```

```sh
[root@VM-0-10-centos ~]# docker run -it --name=c2 --volumes-from c3 centos:7
[root@bc4dbefe111f /]# 
[root@bc4dbefe111f /]# 
[root@bc4dbefe111f /]# ll
total 60
-rw-r--r--   1 root root 12114 Nov 13  2020 anaconda-post.log
lrwxrwxrwx   1 root root     7 Nov 13  2020 bin -> usr/bin
drwxr-xr-x   5 root root   360 Apr 19 07:44 dev
drwxr-xr-x   1 root root  4096 Apr 19 07:44 etc
drwxr-xr-x   2 root root  4096 Apr 11  2018 home
lrwxrwxrwx   1 root root     7 Nov 13  2020 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Nov 13  2020 lib64 -> usr/lib64
drwxr-xr-x   2 root root  4096 Apr 11  2018 media
drwxr-xr-x   2 root root  4096 Apr 11  2018 mnt
drwxr-xr-x   2 root root  4096 Apr 11  2018 opt
dr-xr-xr-x 114 root root     0 Apr 19 07:44 proc
dr-xr-x---   2 root root  4096 Nov 13  2020 root
drwxr-xr-x  11 root root  4096 Nov 13  2020 run
lrwxrwxrwx   1 root root     8 Nov 13  2020 sbin -> usr/sbin
drwxr-xr-x   2 root root  4096 Apr 11  2018 srv
dr-xr-xr-x  13 root root     0 Apr 19 06:56 sys
drwxrwxrwt   7 root root  4096 Nov 13  2020 tmp
drwxr-xr-x  13 root root  4096 Nov 13  2020 usr
drwxr-xr-x  18 root root  4096 Nov 13  2020 var
drwxr-xr-x   2 root root  4096 Apr 19 07:40 volume
```

3. 在 c3 中创建一个文件

```sh
[root@b06c72d97319 /]# cd volume/
[root@b06c72d97319 volume]# touch a.txt
[root@b06c72d97319 volume]# ll
total 0
-rw-r--r-- 1 root root 0 Apr 19 07:53 a.txt
```

4. 在 c1 c2 中查看该文件

c1

```sh
[root@139c4393f542 /]# cd volume/
[root@139c4393f542 volume]# ll
total 0
-rw-r--r-- 1 root root 0 Apr 19 07:53 a.txt
```

c2

```sh
[root@bc4dbefe111f /]# cd volume/
[root@bc4dbefe111f volume]# ll
total 0
-rw-r--r-- 1 root root 0 Apr 19 07:53 a.txt
```

5. 在 c2 中创建一个文件

```sh
[root@bc4dbefe111f volume]# touch b.txt
[root@bc4dbefe111f volume]# ls
a.txt  b.txt
```

6. 在 c1 中可以看到 c2 中创建的文件

```sh
[root@139c4393f542 volume]# ls
a.txt  b.txt
```

7. 查看 c1 的容器细节

```sh
"Mounts": [
            {
                "Type": "volume",
                "Name": "441df686a0559bfc8f7dfd8f3512bad8d8244e9371cb4a4c8fb89558cffb3314",
                "Source": "/var/lib/docker/volumes/441df686a0559bfc8f7dfd8f3512bad8d8244e9371cb4a4c8fb89558cffb3314/_data",
                "Destination": "/volume",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
```

在 Mounts 中可以发现，c1 挂载的数据卷（Source）和 c3 的一样，因此即使 c3 容器挂了，也不会影响 c1 和 c2 两个容器。

## docker 应用部署

### MySQL部署

1. 需求：在 Docker 容器中部署 MySQL，并通过外部 MySQL 客户端操作 MySQL Server。
2. 实现步骤：
   - 搜索 mysql 镜像
   - 拉取 mysql 镜像
   - 创建容器
   - 操作容器中的 mysql

> 注意： 
>
> - 容器内的网络服务和外部机器不能直接通信
> - 外部机器和宿主机可以直接通信
> - 宿主机和容器可以直接通信
> - 当容器中的网络服务需要被外部机器访问时，可以将容器中提供服务的端口映射到宿主机的端口上。外部机器访问宿主机的该端口，从而间接访问容器的服务
> - 这种操作成为：**端口映射**

#### 搜索 mysql

```sh
docker search mysql
```

#### 拉取 mysql

```sh
docker pull mysql:8.0
```

#### 创建容器，设置端口映射、目录映射

```sh
# 在 /root 目录下创建 mysql 目录用于存储 mysql 数据信息
mkdir ~/mysql
cd ~/mysql
```

```sh
docker run -id \
-p 3307:3306 \
--name c_mysql \
-v $PWD/conf:/etc/mysql/conf.d \
-v $PWD/logs:/logs \
-v $PWD/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
mysql:8.0
```

- 参数说明
  - **-p 3307:3306**：将容器的 3306 端口映射到宿主机的 3307 端口
  - **-v $PWD/conf:/etc/mysql/conf.d**：将主机当前目录下的 conf 目录挂在到容器的 /etc/mysql/conf.d。配置目录
  - **-v $PWD/logs:/logs**：将主机目录下的 logs 目录挂在到容器的 /logs。日志目录
  - **-v $PWD/data:/var/lib/mysql**：将主机当前目录下的 data 目录挂在到容器的 /data:/var/lib/mysql。数据目录
  - **-e MYSQL_ROOT_PASSWORD=123456**：初始化 root 用户的密码

#### 操作数据库

```sh
[root@VM-0-10-centos ~]# docker exec -it c_mysql /bin/bash
bash-5.1# mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 9
Server version: 8.0.42 MySQL Community Server - GPL

Copyright (c) 2000, 2025, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)

mysql> create database db1;
Query OK, 1 row affected (0.00 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| db1                |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

mysql> use db1
Database changed
```

### Nginx 部署

#### 搜索 Nginx 镜像

```sh
docker search nginx
```

#### 拉取 Nginx 镜像

```sh
docker pull nginx
```

#### 创建容器

```sh
# 在 /root 目录下创建 nginx 目录用于存储 nginx 数据信息
mkdir ~/nginx
cd ~/nginx
mkdir donf
cd conf
# 在 ~/nginx/conf/ 下创建 nginx.conf 文件，粘贴下面内容
vim nginx.conf
```

```sh
user nginx;
worker_processes  1;
 
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
 
 
events {
    worker_connections  1024;
}
 

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
 }
```

```sh
docker run -id --name c_nginx \
-p 80:80 \
-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf \
-v $PWD/logs:/var/log/nginx \
-v $PWD/html:/usr/share/nginx/html \
nginx
```

- 参数说明：
  - **-p 80:80**：将容器的80端口映射到宿主机的 80 端口
  - **-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf**：将主机当前目录下的 /conf/nginx.conf 挂载到容器的 /etc/nginx/nginx.conf。配置目录
  - **-v $PWD/logs:/var/log/nginx**：将主机当前目录下的 logs 目录挂在到容器的 /var/log/nginx。日志目录

配置 nginx 的默认页面

```sh
cd nginx
cd html
vim index.html
```

```sh
<h1>hello nginx docker</h1>
```

#### 使用外部及访问 nginx

[![pE4bVRf.png](https://s21.ax1x.com/2025/04/20/pE4bVRf.png)](https://imgse.com/i/pE4bVRf)

## Dockerfile

### Docker 镜像原理

> 思考：
>
> - Docker 镜像本质是什么？
> - Docker 中的一个 centos 镜像为什么只有 200MB，而一个 centos 操作系统的 iso 文件要几个 G ？
> - Docker 中一个 tomcat 镜像问什么有 500MB，而一个 tomcat 安装包只有 70 多 MB ？

操作系统组成部分：

- 进程调度子系统
- 进程通信子系统
- 内存管理子系统
- 设备管理子系统
- **文件管理子系统**
- 网络通信子系统
- 作业控制子系统

Linux 文件系统由 bootfs 和 rootfs 两部分组成

[![pE4buLQ.png](https://s21.ax1x.com/2025/04/20/pE4buLQ.png)](https://imgse.com/i/pE4buLQ)

- bootfs：包含 bootloader（引导加载程序）和 kernel（内核）
- rootfs：root 文件系统，包含的就是典型 Linux 系统中的 /dev, /porc, /bin, /etc 等标准目录和文件
- 不同的 linux 发行版，bootfs 基本一样，而 rootfs 不同，如 ubuntu，centos 等



Docker 镜像是由特殊的文件系统叠加而成，最底端是 bootfs，并使用宿主机的 bootfs。第二层是 root 文件系统 rootfs，称为base image。然后再往上可以叠加其他的镜像文件。

同一文件系统（Union File System）技术能够将不同的层整合成一个文件系统，为这些层提供了一个统一的视角，这样就隐藏了多层的存在，在用户的角度来看，只存在一个文件系统。

一个镜像可以放在另一个镜像的上面。位于下面的镜像成为父镜像，最底部的镜像成为基础镜像。

当从一个镜像启动容器时，Docker 会在最顶层加载一个读写文件系统作为容器

[![pE4bgyD.png](https://s21.ax1x.com/2025/04/20/pE4bgyD.png)](https://imgse.com/i/pE4bgyD)

- Docker 镜像本质是什么？

  ​	是一个分层的文件系统

- Docker 中的一个 centos 镜像为什么只有 200MB，而一个 centos 操作系统的 iso 文件要几个 G ？

  ​	centos 的 iso 镜像文件包含 bootfs 和 rootfs，而 docker 的 centos 镜像复用操作系统系统的 bootfs，只有 rootfs 和其他镜像层

- Docker 中一个 tomcat 镜像问什么有 500MB，而一个 tomcat 安装包只有 70 多 MB ？

  ​	由于 docker 中镜像是分层的，tomcat 虽然只有 70 多 MB，但他需要依赖于父镜像和基础镜像，所有整个对外暴露的 tomcat 镜像大小 500 多 MB

### 镜像制作

#### 容器转为镜像

```sh
docker commit <容器id（或镜像名称）> <新镜像名称>:<版本号>
```

```sh
docker save -o <压缩文件名称> <镜像名称>:<版本号>
```

```sh
docker load -i <压缩文件名称>
```

[![pE4qM6O.png](https://s21.ax1x.com/2025/04/20/pE4qM6O.png)](https://imgse.com/i/pE4qM6O)

镜像制作：

```sh
[root@VM-0-10-centos ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    4e1b6bae1e48   3 days ago    192MB
tomcat       latest    15a617d619d4   10 days ago   467MB
redis        5.0       99ee9af2b6b1   2 years ago   110MB
[root@VM-0-10-centos ~]# docker ps -a
CONTAINER ID   IMAGE       COMMAND                  CREATED             STATUS             PORTS                                       NAMES
601084fdd3ed   redis:5.0   "docker-entrypoint.s…"   13 minutes ago      Up 13 minutes      0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   c_redis
9101c26d2537   tomcat      "catalina.sh run"        14 minutes ago      Up 14 minutes      0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   c_tomcat
219eac58f02d   nginx       "/docker-entrypoint.…"   About an hour ago   Up About an hour   0.0.0.0:80->80/tcp, :::80->80/tcp           c_nginx
[root@VM-0-10-centos ~]# docker commit 219eac58f02d itheima_nginx:1.0
sha256:78715e085bb0d1fa72e81acbe6ca189a733f3250db92461ee755eedf43361120
[root@VM-0-10-centos ~]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
itheima_nginx   1.0       78715e085bb0   3 seconds ago   192MB
nginx           latest    4e1b6bae1e48   3 days ago      192MB
tomcat          latest    15a617d619d4   10 days ago     467MB
redis           5.0       99ee9af2b6b1   2 years ago     110MB
[root@VM-0-10-centos ~]# docker save -o itheima_nginx.tar itheima_nginx:1.0
[root@VM-0-10-centos ~]# ll
total 192080
drwxr-xr-x 2 root    root      4096 Apr 20 11:43 conf
drwxr-xr-x 8 polkitd root      4096 Apr 20 15:00 data
-rw------- 1 root    root 196666368 Apr 20 20:28 itheima_nginx.tar
drwxr-xr-x 2 root    root      4096 Apr 20 11:43 logs
drwxr-xr-x 5 root    root      4096 Apr 20 11:37 mysql
drwxr-xr-x 5 root    root      4096 Apr 20 19:04 nginx
[root@VM-0-10-centos ~]# docker rmi -f 78715e0
Untagged: itheima_nginx:1.0
Deleted: sha256:78715e085bb0d1fa72e81acbe6ca189a733f3250db92461ee755eedf43361120
Deleted: sha256:ad100d8ac184d2443f5b2b3840bc8db5fa0f5d4a76bc94e2b7e7c374200b8e4a
[root@VM-0-10-centos ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    4e1b6bae1e48   3 days ago    192MB
tomcat       latest    15a617d619d4   10 days ago   467MB
redis        5.0       99ee9af2b6b1   2 years ago   110MB
[root@VM-0-10-centos ~]# docker load -i itheima_nginx.tar
1cf6e41f8542: Loading layer [==================================================>]  14.85kB/14.85kB
Loaded image: itheima_nginx:1.0
[root@VM-0-10-centos ~]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED              SIZE
itheima_nginx   1.0       78715e085bb0   About a minute ago   192MB
nginx           latest    4e1b6bae1e48   3 days ago           192MB
tomcat          latest    15a617d619d4   10 days ago          467MB
redis           5.0       99ee9af2b6b1   2 years ago          110MB
```

> 注意：使用这种方式制作出的镜像不包含数据卷中的数据。

#### Dockerfile

##### Dockerfile 概念

Dockerfile 是一个文本文件，包含了一条条的指令，每一条指令构建一层，基于基础镜像，最终构建出一个新的镜像。

对于开发人员：可以为开发团队提供一个完全一致的开发环境

对于测试人员：可以直接拿开发时所构建的镜像或者通过 Dockerfile 文件构建一个新的镜像开始工作了

对于运维人员：在部署时，可以实现应用的无缝移植



Dockerfile关键字：https://docs.docker.com/reference/dockerfile/

| 关键字      | 作用                     | 备注                                                         |
| ----------- | ------------------------ | ------------------------------------------------------------ |
| FROM        | 指定父镜像               | 指定dockerfile基于那个image构建                              |
| MAINTAINER  | 作者信息                 | 用来标明这个dockerfile谁写的                                 |
| LABEL       | 标签                     | 用来标明dockerfile的标签 可以使用Label代替Maintainer 最终都是在docker image基本信息中可以查看 |
| RUN         | 执行命令                 | 执行一段命令 默认是/bin/sh 格式: RUN command 或者 RUN ["command" , "param1","param2"] |
| CMD         | 容器启动命令             | 提供启动容器时候的默认命令 和ENTRYPOINT配合使用.格式 CMD command param1 param2 或者 CMD ["command" , "param1","param2"] |
| ENTRYPOINT  | 入口                     | 一般在制作一些执行就关闭的容器中会使用                       |
| COPY        | 复制文件                 | build的时候复制文件到image中                                 |
| ADD         | 添加文件                 | build的时候添加文件到image中 不仅仅局限于当前build上下文 可以来源于远程服务 |
| ENV         | 环境变量                 | 指定build时候的环境变量 可以在启动的容器的时候 通过-e覆盖 格式ENV name=value |
| ARG         | 构建参数                 | 构建参数 只在构建的时候使用的参数 如果有ENV 那么ENV的相同名字的值始终覆盖arg的参数 |
| VOLUME      | 定义外部可以挂载的数据卷 | 指定build的image那些目录可以启动的时候挂载到文件系统中 启动容器的时候使用 -v 绑定 格式 VOLUME ["目录"] |
| EXPOSE      | 暴露端口                 | 定义容器运行的时候监听的端口 启动容器的使用-p来绑定暴露端口 格式: EXPOSE 8080 或者 EXPOSE 8080/udp |
| WORKDIR     | 工作目录                 | 指定容器内部的工作目录 如果没有创建则自动创建 如果指定/ 使用的是绝对地址 如果不是/开头那么是在上一条workdir的路径的相对路径 |
| USER        | 指定执行用户             | 指定build或者启动的时候 用户 在RUN CMD ENTRYPONT执行的时候的用户 |
| HEALTHCHECK | 健康检查                 | 指定监测当前容器的健康监测的命令 基本上没用 因为很多时候 应用本身有健康监测机制 |
| ONBUILD     | 触发器                   | 当存在ONBUILD关键字的镜像作为基础镜像的时候 当执行FROM完成之后 会执行 ONBUILD的命令 但是不影响当前镜像 用处也不怎么大 |
| STOPSIGNAL  | 发送信号量到宿主机       | 该STOPSIGNAL指令设置将发送到容器的系统调用信号以退出。       |
| SHELL       | 指定执行脚本的shell      | 指定RUN CMD ENTRYPOINT 执行命令的时候 使用的shell            |

##### 使用 Dockerfile 部署 Express 应用

1. 将 Express 项目拷贝到 docker-files 文件夹
2. 编写 Dockerfile 文件
3. 运行

```sh
[root@VM-0-10-centos ~]# cd docker-files
[root@VM-0-10-centos docker-files]# vim express_dockerfile
```

```sh
FROM node:18-alpine

LABEL maintainer="ToBContinued <123456@qq.com>"

WORKDIR /app

COPY ./back/package*.json ./
RUN npm install

COPY ./back .

EXPOSE 3000
```

- **FROM node:18-alpine**：这行代码指定了构建镜像所基于的基础镜像。`node:18-alpine` 表示使用 Node.js 18 版本的 Alpine Linux 变体作为基础镜像。Alpine Linux 是一种轻量级的 Linux 发行版，镜像体积较小，能够有效减少最终镜像的大小。
- **LABEL maintainer="ToBContinued <123456@qq.com>"**：`LABEL` 指令用于为镜像添加元数据，这些元数据可以包含镜像的作者、描述、版本等信息。在这里，`maintainer` 是一个常用的元数据标签，它表明了该镜像的维护者信息，即 `ToBContinued`，邮箱为 `123456@qq.com`。
- **WORKDIR /app**：`WORKDIR` 指令用于设置镜像中的工作目录。在后续的 `COPY`、`RUN`、`CMD` 等指令执行时，如果没有特别指定路径，就会以这个工作目录作为基准。这里将工作目录设置为 `/app`，意味着后续的操作大多会在 `/app` 目录下进行。
- **COPY ./back/package*.json ./**：`COPY` 指令用于将构建上下文（即运行 `docker build` 命令时指定的目录）中的文件或目录复制到镜像中的指定位置。这里将构建上下文里 `./back` 目录下所有以 `package` 开头、以 `.json` 结尾的文件（通常是 `package.json` 和 `package-lock.json`）复制到镜像的当前工作目录（也就是 `/app`）。这样做的好处是，当只修改了项目代码而 `package.json` 未改变时，Docker 可以利用缓存，避免重复安装依赖。
- **RUN npm install**：`RUN` 指令用于在镜像构建过程中执行命令。这里执行 `npm install` 命令，它会根据 `package.json` 和 `package-lock.json` 文件来安装项目所需的所有依赖。由于前面已经复制了 `package*.json` 文件，所以可以在安装依赖时利用 Docker 的缓存机制，提高构建效率。
- **COPY ./back .**：将构建上下文里 `./back` 目录下的所有文件和目录复制到镜像的当前工作目录 `/app`。此时，依赖已经安装完成，再复制项目的其余代码，这样可以避免因代码修改而导致的依赖重复安装。
- **EXPOSE 3000**：`EXPOSE` 指令用于声明容器在运行时会监听的端口。这里声明容器会监听 3000 端口，但这只是一个声明，并不会实际进行端口映射。在运行容器时，需要使用 `-p` 选项来进行端口映射，将容器内的端口映射到宿主机的端口。

```sh
[root@VM-0-10-centos ~]docker build -f express_dockerfile -t express_app:1.0 .
[root@VM-0-10-centos ~]docker run -d -p 3007:3000 --name express_app express_app:1.0
```

## docker 网络

docker 网络可以实现容器间的通信。

- 默认情况下，**同一网络内的容器可以直接通信**，无需通过外部 IP 或端口暴露。


- 例如，你的 Express 容器（`express_app`）和 MySQL 容器（`mysql`）若在同一网络中，Express 可以直接通过容器名 `mysql` 访问数据库，而无需配置复杂的 IP 地址。

### 通过容器 ip 互相访问

```sh
[root@VM-0-10-centos docker-files]# docker run -d -p 88:80 --name app1 nginx
75b5cf74888f2e711ade8bf3274ff888ff65b7274ad6c9559b48ba05b9c8c84d
[root@VM-0-10-centos docker-files]# docker run -d -p 99:80 --name app2 nginx
09e093667d157430f3c8336945764dcf2dcb1d8e613cd1150292a66131c8e5ff
[root@VM-0-10-centos docker-files]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                               NAMES
09e093667d15   nginx     "/docker-entrypoint.…"   9 seconds ago    Up 8 seconds    0.0.0.0:99->80/tcp, :::99->80/tcp   app2
75b5cf74888f   nginx     "/docker-entrypoint.…"   18 seconds ago   Up 17 seconds   0.0.0.0:88->80/tcp, :::88->80/tcp   app1
[root@VM-0-10-centos docker-files]# docker exec -it app1 bash
root@75b5cf74888f:/# curl http://175.27.252.115:99
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

> 这样通过 app1 访问 app2 的过程是：app1 → 机器 ip → 机器 99 端口 → app2，这相当于同事A在同事B的旁边办公，当A要和B说话时，A先跑到了公司大楼外面，在进入办公室的门，和B交流。

通过 ip a 可以看到所有的网卡：

```sh
[root@VM-0-10-centos docker-files]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 8500 qdisc mq state UP group default qlen 1000
    link/ether 52:54:00:e4:b6:63 brd ff:ff:ff:ff:ff:ff
    inet 10.206.0.10/20 brd 10.206.15.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::5054:ff:fee4:b663/64 scope link 
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:d2:6d:f1:14 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:d2ff:fe6d:f114/64 scope link 
       valid_lft forever preferred_lft forever
5: veth9c8cc75@if4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default 
    link/ether 56:2e:dd:75:c5:b1 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::542e:ddff:fe75:c5b1/64 scope link 
       valid_lft forever preferred_lft forever
7: veth0ce862e@if6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default 
    link/ether 22:84:a6:77:5b:e4 brd ff:ff:ff:ff:ff:ff link-netnsid 1
    inet6 fe80::2084:a6ff:fe77:5be4/64 scope link 
       valid_lft forever preferred_lft forever
```

其中有一个网卡是 docker 0，docker 启动的每一个应用都加入了 docker 0 这个网络环境，而且每一个应用，docker 都会再次为它分配 ip，可以使用 docker inspect <容器> 来查看。

```sh
[root@VM-0-10-centos docker-files]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                               NAMES
09e093667d15   nginx     "/docker-entrypoint.…"   8 minutes ago   Up 8 minutes   0.0.0.0:99->80/tcp, :::99->80/tcp   app2
75b5cf74888f   nginx     "/docker-entrypoint.…"   8 minutes ago   Up 8 minutes   0.0.0.0:88->80/tcp, :::88->80/tcp   app1
[root@VM-0-10-centos docker-files]# docker inspect app1
# 其他信息......
"Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:11:00:02",
                    "NetworkID": "73864c865cc4dc3feab98de5eef97caa295e0f178d91e8afcc83306ffd3beb18",
                    "EndpointID": "d9a4df1f39feed00adcaaa61e7d029872fc929826b3f02f0f157aadec3e9cfd5",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DriverOpts": null,
                    "DNSNames": null
                }
            }
```

Gateway 是 app1 的网关地址，IPAddress 是 app1 的 ip 地址。同样 app2 也有这些配置。因此容器之间通过这个 ip 就可以互相访问。

```sh
[root@VM-0-10-centos docker-files]# docker exec -it app1 bash
root@75b5cf74888f:/# curl http://172.17.0.3:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

> 总结：docker 为每个容器分配唯一 ip，使用`容器 ip + 容器端`口可以互相访问
>
> 
>
> 但是，ip 由于各种原因可能会发生变化，所以访问可能不稳定。因此 docker 提供了一种自定义网络的方式，docker0 默认不支持主机域名，需要我们创建一个自定义网络，然后容器的名字就可以当做主机的域名作为一个稳定的访问地址。

[![pE5fhNT.png](https://s21.ax1x.com/2025/04/22/pE5fhNT.png)](https://imgse.com/i/pE5fhNT)

### docker 自定义网络

创建自定义网络

```sh
[root@VM-0-10-centos ~]# docker network create mynet
f94596d12a14c91440c2677689928d87072e550c44151ed69a5387484908ea75
[root@VM-0-10-centos ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
73864c865cc4   bridge    bridge    local
cc305337a24a   host      host      local
f94596d12a14   mynet     bridge    local
b420506f9052   none      null      local
```

```sh
[root@VM-0-10-centos ~]# docker run -d -p 88:80 --name app1 --network mynet nginx
80df77e40fbf266e25cc4f1e39bee813346045eba43819edee51d3760d38c1b6
[root@VM-0-10-centos ~]# docker run -d -p 99:80 --name app2 --network mynet nginx
af8795349eaf0e3fa6869e3503abdabeab369ee0a13ddfb34c27b3decbedfde7
[root@VM-0-10-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                               NAMES
af8795349eaf   nginx     "/docker-entrypoint.…"   9 seconds ago    Up 9 seconds    0.0.0.0:99->80/tcp, :::99->80/tcp   app2
80df77e40fbf   nginx     "/docker-entrypoint.…"   23 seconds ago   Up 23 seconds   0.0.0.0:88->80/tcp, :::88->80/tcp   app1
[root@VM-0-10-centos ~]# docker inspect app1
# 其他信息......
"Networks": {
                "mynet": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:12:00:02",
                    "NetworkID": "f94596d12a14c91440c2677689928d87072e550c44151ed69a5387484908ea75",
                    "EndpointID": "e42ba342eb4cdd90099181314d36e5aba8152654cc6e403c76bd76996914fe24",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DriverOpts": null,
                    "DNSNames": [
                        "app1",
                        "80df77e40fbf"
                    ]
                }
            }
```

可以发现此时的 Gateway 和 IPAddress 都发生了变化

```sh
[root@VM-0-10-centos ~]# docker exec -it app1 bash
root@80df77e40fbf:/# curl http://app2:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

## docker 服务编排

微服务架构的应用系统中一般包含若干个微服务，每个微服务一般都会部署多个实例，如果每个微服务都要手动启停，维护的工作量会很大。

- 要从Dockerfilebuildimage或者去dockerhub拉取image
- 要创建多个container
- 要管理这些container(启动停止删除)

**服务编排**: 按照一定的业务规则批量管理容器

**Docker Compose**：Docker Compose是一个编排多容器分布式部署的工具，提供命令集管理容器化应用的完整开发周期，包括服务构建启动和停止。

使用步骤:

1. 利用 Dockerfile 定义运行环境镜像
2. 使用 docker-compose.yml 定义组成应用的各服务
3. 运行 docker-compose up 启动应用

### 安装 Docker Compose

```sh
# Compose目前已经完全支持Linux、Mac OS和Windows，在我们安装Compose之前，需要先安装Docker。下面我 们以编译好的二进制包方式安装在Linux系统中。
curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# 设置文件可执行权限
chmod +x /usr/local/bin/docker-compose
# 查看版本信息
docker-compose --version
```

### 卸载Docker Compose

````sh
# 二进制包方式安装的，删除二进制文件即可
rm /usr/local/bin/docker-compose
````

### 使用 Docker Compose 编排 nginx + express

https://docs.docker.com/reference/compose-file/

顶级元素：

- **name**：名字
- **services**：服务
- **networks**：网络
- **volumes**：卷
- configs：配置
- secrets：秘钥

compose.yaml

```yaml
name: express-app

services:
	mysql:
		container_name: mysql
		image: mysql:8.0
		ports:
			- "3306:3306"
		environment:
			- MYSQL_ROOT_PASSWORD=123456
			- MYSQL_DATABASE=myDb
		volumes:
			- mysql-data:/var/lib/mysql
			- /app/myconf:/etc/mysql/conf.d
		restart: always
		networks:
			- mynet
	
	express_app:
		container_name: express_app
		image: express_app:1.0
		ports:
			- "3007:3000"
		restart: always
		networks:
		 - mynet
		depends_on:
			- mysql 

volumes:
	mysql-data:
networks:
	mynet:
```

```sh
docker compose [-f 文件名] up -d
```

