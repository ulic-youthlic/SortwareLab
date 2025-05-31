# SortwareLab
## 使用element-plus的vue项目

## 第一次迭代中，与后端对接中

## 代码介绍

### /src/router/index.js
路由函数，同时内置默认跳转登录界面功能

### /src/view/LoginView.vue
负责实现登录功能

### /src/view/MainView.vue
主界面，可跳转至不同功能

### /src/view/AutoAimView.vue
自动瞄准功能，点击下方按钮切换模式，打开后调用自动瞄准函数进行游玩，关闭后就是普通情况

向后端发送post指令
```
http://127.0.0.1:5000/api/auto-aim/username=${username.value}
```
包含username以及enable（即是否开启自动瞄准）

前端从后端发送get指令，以此判断当前状态，显示在右上角的“当前状态”
```
http://127.0.0.1:5000/api/auto-aim/status?username=${username.value}
```
接受enable信息

（其实这段我有点绕进去了，如果不对或者有更好的方案可以更换）

### /src/view/DataView.vue

游戏数据面板功能，

前端从后端发送get指令
```
http://127.0.0.1:5000/api/game-data/${username.value}
```

其中前端要求包含查询参数，对这几个要求进行查询
```
查询参数（params）：
    username：用户名字
    page：当前页码（整数）
    pageSize：每页显示数量（整数）
    result：游戏结果过滤条件（可选，值为 'win' 或 'loss'）
    autoAim：自动瞄准状态过滤条件（可选，布尔值）
    startDate：开始日期（可选，格式为 'YYYY-MM-DD'）
    endDate：结束日期（可选，格式为 'YYYY-MM-DD'）
```
后端要求包含的数据的json格式如下：
```
{
    "success": true,
    "message": "数据获取成功",
    "records": [
    {
        "gameId": "G20231018001",
        "date": "2023-10-18 14:25",
        "map": "荒漠迷城",
        "result": "胜利",
        "accuracy": 68,
        "kills": 24,
        "deaths": 8,
        "kdRatio": 3.0,
        "autoAim": true
    },
    {
        "gameId": "G20231018002",
        "date": "2023-10-18 13:40",
        "map": "炼狱小镇",
        "result": "胜利",
        "accuracy": 72,
        "kills": 19,
        "deaths": 12,
        "kdRatio": 1.58,
        "autoAim": true
    },
    // 更多游戏记录...
    ],
    "totalRecords": 25
}
```