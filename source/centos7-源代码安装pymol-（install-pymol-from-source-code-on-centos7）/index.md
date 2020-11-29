---
title: CentOS7 源代码安装pymol （install pymol from source code on CentOS7）
id: '648'
tags: []
categories:
  - - uncategorized
comments: false
date: 2020-02-02 23:00:01
---

1\. yum install gcc gcc-c++ kernel-devel python-devel tkinter python-pmw glew-devel **\\**
  freeglut-devel libpng-devel freetype-devel libxml2-devel glm-devel python3-devel netcdf-devel
2. install Anaconda3
3. git clone https://github.com/schrodinger/pymol-open-source.git
4. git clone https://github.com/rcsb/mmtf-cpp.git mv mmtf-cpp/include/mmtf\* pymol-open-source/include/ 
5. cd pymol-open-source 
6. export prefix=$HOME/pymol\_src
7. python3 setup.py build install  --home=$prefix