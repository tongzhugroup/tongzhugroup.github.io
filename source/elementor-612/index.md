---
title: CP2K6.1 Install
id: '612'
tags: []
categories:
  - - uncategorized
comments: false
date: 2019-10-08 11:51:39
---

## CP2K 6.1 编译安装 (Intel 编译器)

**CP2K 6.1.0-release** **多进程多线程(MPI+OPENMP)**

 **制作者：曹立群**

 **更新时间：2019.10.09**

 **测试版本：CP2K 6.1.0-release**

**本文基于前辈安装老版本的说明撰写：**

[https://blog.csdn.net/zh314js/article/details/76258705](https://blog.csdn.net/zh314js/article/details/76258705)

**1.下载并安装intel编译器(最新版本2019)**

**安装后在~/.bashrc添加:**

**source** **/opt/intel/compilers\_and\_libraries\_2017.4.196/linux/bin/ifortvars.sh intel64**

**source** **/opt/intel/compilers\_and\_libraries\_2017.4.196/linux/mkl/bin/mklvars.sh intel64**

**source /opt/intel/compilers\_and\_libraries\_2017.4.196/linux/mpi/intel64/bin/mpivars.sh intel64**

**然后** **source ~/.bashrc**

**测试:**

**which ifort / which mpiifort** **显示具体路径**

**Intel编译器套件安装完后，在任意目录下，执行：icc -v** **显示版本号**

**然后进入$MKLROOT/interfaces/fftw3xf文件夹，执行：make libintel64** **将会生成一个名为libfftw3xf\_intel.a的静态库文件**

**在/etc/目录中新建一个名为mpd.conf的文本文件，在里面填写上(需root权限)：**

**MPD\_SECRETWORD=mr45-j9z**

**然后保存退出，给这个文件加上权限：**

**chmod 600 /etc/mpd.conf**

**2\.** **安装libint (1.1.6版本)：**

**下载安装包解压，进入执行：**

**aclocal -I lib/autoconf**

**autoconf**

**注意，上面两个如果执行后都报错的话，不用管，直接下一步。**

**./configure --prefix=/opt/libint --with-ar=ar FC=ifort F77=ifort F90=ifort**

**FCFLAGS="-O3 -xHost" CC=icc CFLAGS="-O3 -xHost " CXX=icpc**

**CXXFLAGS="-O3 -xHost " --with-cc-optflags="-O3 -xHost "**

 **--with-cxx-optflags="-O3  -xHost " --with-libint-max-am=5 –with-libint-opt-am=4 --with-libderiv-max-am1=4 --with-libderiv-max-am2=2 --with-libr12-max-am=2 –with-libr12-opt-am=2**

**make -j 8**

**make install**

**make realclean**

**3\.** **安装最新libxsmm (1.8.1的master版本，其他版本也行，用于矩阵运算加速的)：**

**解压安装包后，进入安装包，执行：**

**make CXX=icpc CC=icc FC=ifort AR=ar OPT=3 TARGET="-xHost" ROW\_MAJOR=0**

**INDICES\_M="$(echo $(seq 1 24))" INDICES\_N="$(echo $(seq 1 24))" INDICES\_K="$(echo $(seq 1 24))" PREFIX=/opt/libxsmm/ install**

**make clean**

**4\.** **安装libxc (3.0.0版本，其他版本也行)：**

**下载安装包解压进入安装：**

**./configure --prefix=/opt/libxc/ FC=ifort FCFLAGS="-O3 -xHost " CC=iccCFLAGS="-O3 -xHost "**

**make -j 8**

**make install**

**make clean**

**5\.** **安装elpa :**

**cp2k 6.1.0-release版本目前采用elpa-2018.05.001**

**openmp版本(用于多线程多进程(psmp)版本：**

**./configure –prefix=/opt/elpa/ FC=mpiifort CC=mpiicc CXX=mpiicpc**

**CFLAGS="-O3 -xHost " CXXFLAGS="-O3 -xHost " FCFLAGS="-O3 -xHost "**

**\--with-avx-optimization=yes –enable-openmp SCALAPACK\_LDFLAGS="-**

**L$MKLROOT/lib/intel64 -lmkl\_blas95\_lp64 -lmkl\_lapack95\_lp64**

**\-lmkl\_scalapack\_lp64 -Wl,--start-group -lmkl\_cdft\_core -lmkl\_intel\_lp64**

**\-lmkl\_intel\_thread -lmkl\_core -lmkl\_blacs\_intelmpi\_lp64 -Wl,--end-group**

**\-liomp5 -lpthread -lm -ldl -Wl,-rpath,$MKLROOT/lib/intel64"**

**SCALAPACK\_FCFLAGS="-L$MKLROOT/lib/intel64 -lmkl\_blas95\_lp64 -lmkl\_lapack95\_lp64 -lmkl\_scalapack\_lp64 -lmkl\_cdft\_core -lmkl\_intel\_lp64 -lmkl\_intel\_thread -lmkl\_core -lmkl\_blacs\_intelmpi\_lp64 -liomp5 -lpthread -lm -ldl -I$MKLROOT/include/intel64/lp64"**

**make**

**make install**

**make clean**

**6\.** **下载并安装cp2k：**

**下载6.1.0版本cp2k(development版本)：**

**手动进入网页下载：**[**https://sourceforge.net/p/cp2k/code/HEAD/tree/**](https://sourceforge.net/p/cp2k/code/HEAD/tree/)

**下载完成后，将trunk目录里面的cp2k/ 这个文件夹拷贝到/opt/目录中**

**然后进入/opt/cp2k/makefile目录，修改cp2k配置文件：**

**vim ../arch/Linux-x86-64-intel.psmp**

**然后对照着修改:**

**LIBXSMM  = /opt/libxsmm(对应各人安装路径)**

**LIBXC    = /opt/libxc**

**LIBINT   = /opt/libint**

**LIBELPA  = /opt/elpa**

**elpa部分的include后面部分要注意，每个版本的elpa此处数字路径是不一样的，具体路径请到elpa的安装目录自己查看**

**DFLAGS   = -D\_\_ELPA=201805(elpa版本号)**

**FCFLAGS += -I$(LIBELPA)/include/elpa\_openmp-2018.05.001/modules -I$(LIBELPA)/include/elpa\_openmp-2018.05.001/elpa**

**保存文件,然后进入cp2k/makefils编译cp2k.psmp**

**cd cp2k/makefiles**

**多线程多进程版本**

**make -j 8 ARCH=Linux-x86-64-intel-host VERSION=psmp**

**使用多线程版本cp2k时，需要手动设置线程数：**

**export OMP\_NUM\_THREADS=2**

**然后再执行:**

**mpirun -n 14 cp2k.psmp -i test.inp**

**这样的命令，程序就会自动使用14核2线程,需要注意的是，核心数乘以线程数不能大于单节点上总的物理核心数，不然计算会非常慢！**
