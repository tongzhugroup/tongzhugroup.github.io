---
title: '[转载] 安装 DeepMD-kit v1.0'
id: '621'
tags: []
categories:
  - - uncategorized
comments: false
date: 2019-10-09 00:50:12
---

原作者：曾晋哲

原链接： https://mp.weixin.qq.com/s/DeQZKwoyxXK7rHhhmdgTmw https://mp.weixin.qq.com/s/MsEtgnN\_mi-auiFyXYUquA

假定[已经安装了Anaconda](http://mp.weixin.qq.com/s?__biz=MzIyMjA1MDA4MQ==&mid=2455134472&idx=1&sn=86ff80ed5d598315ecec3a1c1ab17ac1&chksm=ff91a346c8e62a50340f59477f0dd333dd5d32882af493626d27cab7c9b51f05ffa539e1d860&scene=21#wechat_redirect)（建议使用最新版2019.07），已连接互联网，则

**1.安装tensorflow**（如仅需CPU版本的TensorFlow，则将tensorflow-gpu改为tensorflow）：
```bash
python -m pip install tensorflow Successfully installed google-pasta-0.1.7 keras-applications-1.0.8 opt-einsum-3.1.0 tensorboard-2.0.0 tensorflow-estimator-2.0.0 tensorflow-gpu-2.0.0
```

**2.安装deepmd-kit v1.0：**
```bash
python -m pip install git+https://github.com/deepmodeling/deepmd-kit
```
> Building wheels for collected packages: deepmd-kit
> Building wheel for deepmd-kit (PEP 517) ... done
> Created wheel for deepmd-kit: filename=deepmd\_kit-1.0.0-cp37-cp37m-linux\_x86\_64.whl size=268836 sha256=1f5b1149bbf35c0c96c713cc8b607e0626ad0df6451a7 171d4f6b46acc2d4290
> Stored in directory: /tmp/pip-ephem-wheel-cache-zlksq4dl/wheels/a2/80/6c/a26fba79e43199eb4cdba7a3686c5370d3620916f5a0ea23ac
> Successfully built deepmd-kit
> Installing collected packages: deepmd-kit
> Successfully built deepmd-kit
> Installing collected packages: deepmd-kit
> Successfully installed deepmd-kit-1.0.0

**大功告成！现在看一看是否成功安装：**
```sh
dp -h
```
> usage: dp \[-h\] {train,freeze,test} ...
> DeePMD-kit: A deep learning package for many-body potential energy representation and molecular dynamics
> optional arguments:  -h, --help
>            show this help message and exit Valid subcommands:  {train,freeze,test}
>     train              train a model
>     freeze             freeze the model
>     test               test the model

现在，DeePMD-kit v1.0.0已成功安装。下一期将介绍如何用DP编译LAMMPS

## TensorFlow 安装

最新版本的 TensorFlow 要求 GLIBC 2.17 以上，尽管推荐做法是找一台最新系统的机子，但是有时候系统的类型不是由自己决定的，通常又没有root权限，又想在所有机子上都能运行 TensorFlow 。 刚好手里有一个超算账号，系统是 Red Hat 4.4.7 ，GLIBC 版本是 2.12 ，就以此为例，安装CPU版本的TensorFlow（反正没有权限也安装不了GPU版本需要的驱动）。

* * *

## 一、用 Anaconda 3 安装 TensorFlow 1.8

1.安装 Anaconda 3 见[Linux软件安装②Anaconda3](http://mp.weixin.qq.com/s?__biz=MzIyMjA1MDA4MQ==&mid=2455134472&idx=1&sn=86ff80ed5d598315ecec3a1c1ab17ac1&chksm=ff91a346c8e62a50340f59477f0dd333dd5d32882af493626d27cab7c9b51f05ffa539e1d860&scene=21#wechat_redirect) 2.创建 TensorFlow 环境

```
conda create -n tensorflow pip python=3.6
#Proceed ([y]/n)? 输y
source activate tensorflow #激活环境
pip install tensorflow -i https://pypi.tuna.tsinghua.edu.cn/simple/
#这两天由于众所周知的原因，Google官方的镜像又下载不了了，所以这里用了清华大学的镜像
```

## 二、安装 gcc

这时候打开 Python ，执行 import tensorflow ，提示：

> ImportError: /usr/lib64/libstdc++.so.6: version \`CXXABI\_1.3.7' not found

```
conda install -c psi4 gcc-5 
#Proceed ([y]/n)? 输y
LD_LIBRARY_PATH=$HOME/anaconda3/envs/tensorflow/lib:$LD_LIBRARY_PATH
```

再此运行 Python，不再提示这个问题。

## 三、安装 GLIBC 2.21

但是提示：

> ImportError: /lib64/libc.so.6: version \`GLIBC\_2.16' not found

本来应该安装GLIBC 2.17，但是我发现从2.16到2.19都有个bug，不能运行Python 3.6。于是我们安装GLIBC 2.21。 1.下载GLIBC 2.21并编译GLIBC 2.21

```
wget http://mirror.rit.edu/gnu/libc/glibc-2.21.tar.gz
tar zxvf glibc-2.21.tar.gz
mkdir glibc-2.21-build glibc-2.21-install
cd glibc-2.21-build
../glibc-2.21/configure --prefix=`readlink -f ../glibc-2.21-install` 
make && make install
```

然后就报错了：

> checking version of as... 2.20.51.0.2, bad checking version of ld... 2.20.51.0.2, bad These critical programs are missing or too old: as ld

仔细看看INSTALL文件，要求GNU 'binutils' 2.22 or later，但系统只装了2.20。 2.下载并编译binutils 2.30

```
wget ftp://ftp.gnu.org/gnu/binutils/binutils-2.30.tar.gz
tar zxvf binutils-2.30.tar.gz
cd binutils-2.30
./configure --prefix=`readlink -f ../binutils-2.30-install` 
make && make install
#加入环境变量
PATH=$HOME/software/binutils-2.30-install/bin:$PATH
```

3.重新编译glibc 2.21

```
cd glibc-2.21-build
../glibc-2.21/configure --prefix=`readlink -f ../glibc-2.21-install` 
make && make install
```

> Warning: ignoring configuration file that cannot be opened: ... /software/glibc-2.21-install/etc/ld.so.conf: No such file or directory

将/etc 目录的ld.so.conf复制到指定目录后重新安装：

```
cp /etc/ld.so.conf ../glibc-2.21-install/etc/
make install
```

安装成功。

## 四、运行TensorFlow

```
source activate tensorflow
$HOME/software/glibc-2.21-install/lib/ld-2.21.so --library-path $HOME/anaconda3/envs/tensorflow/lib:$HOME/software/glibc-2.21-install/lib:/lib64:$LD_LIBRARY_PATH `which python`
```

在Python内输入：

```
# Python
import tensorflow as tf
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print(sess.run(hello))
```

> b'Hello, TensorFlow!'

运行成功。我们可以运行的命令记录在.bashrc中：

```
echo 'alias tf='"'"'$HOME/software/glibc-2.21-install/lib/ld-2.21.so --library-path $HOME/anaconda3/envs/tensorflow/lib:$HOME/software/glib-2.21-install/lib:/lib64:$LD_LIBRARY_PATH `which python`'"'">>$HOME/.bashrcsource $HOME/.bashrc
```

即可用 tf 代替装了 TensorFlow 的 Python。