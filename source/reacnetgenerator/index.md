---
title: ReacNetGenerator
id: '255'
tags: []
categories:
  - - uncategorized
comments: false
date: 2019-02-27 04:47:37
---

An automatic generator of reaction network for reactive molecular dynamics simulation

### Citation and contact

ReacNetGenerator: an Automatic Reaction Network Generator for Reactive Molecular Dynamic Simulations, Phys. Chem. Chem. Phys., 2019, doi: [10.1039/C9CP05091D](https://dx.doi.org/10.1039/C9CP05091D)

[jinzhe.zeng@rutgers.edu](mailto:jinzhe.zeng@rutgers.edu) ([Jinzhe Zeng](https://cv.njzjz.win)), [tzhu@lps.ecnu.edu.cn](mailto:tzhu@lps.ecnu.edu.cn) (Tong Zhu)

### Installation

First, you need to download the source code from [the Releases page](https://github.com/tongzhugroup/reacnetgenerator/releases).

Then install ReacNetGenerator with one of the following guides:

#### Building a conda package

1\. [Install _Anaconda_ or _Miniconda_](https://conda.io/projects/continuumio-conda/en/latest/user-guide/install/index.html) to obtain conda.  

2\. Decompress reacnetgenerator.zip and build in the main directory of ReacNetGenerator:

```
conda config --add channels conda-forge
conda build conda/recipe
conda install reacnetgenerator --use-local
reacnetgenerator -h
```

#### Building a Docker Image

1.[Install Docker](https://docs.docker.com/install/).

2.Decompress reacnetgenerator.zip and build in the main directory of ReacNetGenerator:

```
docker build . -t njzjz/reacnetgenerator
docker run njzjz/reacnetgenerator reacnetgenerator -h
```

### Usage

#### Command line

ReacNetGenerator can process any kind of trajectory files containing atomic coordinates, e.g. a LAMMPS dump file prepared by running "dump 1 all custom 100 dump.reaxc id type x y z" in LAMMPS:

```
reacnetgenerator --dump -i dump.reaxc -a C H O
```

where C, H, and O are atomic names in the input file. [Analysis report](https://reacnetgenerator.njzjz.win/report.html?jdata=https%3A%2F%2Fgist.githubusercontent.com%2Fnjzjz%2Fe9a4b42ceb7d2c3c7ada189f38708bf3%2Fraw%2F83d01b9ab1780b0ad2d1e7f934e61fa113cb0f9f%2Fmethane.json) will be generated automatically.

Also, ReacNetGenerator can process files containing bond information, e.g. LAMMPS bond file:

```
reacnetgenerator -i bonds.reaxc -a C H O
```

You can run the following script for help:

```
reacnetgenerator -h
```

#### GUI version

You can open a GUI version for ReacNetGenerator by typing:

```
reacnetgeneratorgui
```

### Awards

*   The First Prize in 2019 (the 11th Session) Shanghai Computer Application Competition for College Students (2019年（第十一届）上海市大学生计算机应用能力大赛一等奖)
*   The First Prize in 2019 (the 12th Session) Chinese Computer Design Competition for College Students (2019年（第12届）中国大学生计算机设计大赛一等奖)

### Acknowledge

*   National Natural Science Foundation of China (Grants No. 91641116)
*   National Innovation and Entrepreneurship Training Program for Undergraduate (201910269080)
*   ECNU Multifunctional Platform for Innovation (No. 001)