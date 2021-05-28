import * as PIXI   from './libs/pixi.js';
import config      from './config.js';
import databus     from './databus.js';
import BackGround  from './base/bg.js';
import login       from './runtime/login.js';
import Home        from './scenes/home.js';
import Match        from './scenes/match.js';
import Play        from './scenes/play.js';
import {InterfaceID} from './common/interfaceId.js'
import {createBtn} from './common/ui.js'

export default class App extends PIXI.Application {
    constructor() {
        super(config.GAME_WIDTH, config.GAME_HEIGHT, config.pixiOptions);

        this.bindWxEvents();

        // 适配小游戏的触摸事件
        this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
            point.x = x * 2 * (375 / window.innerWidth);
            point.y = y * 2 * (667 / window.innerHeight);
        };

        this.aniId    = null;
        this.bindLoop = this.loop.bind(this);

        config.resources.forEach( item => PIXI.loader.add(item));
        PIXI.loader.load(this.init.bind(this));
    }
    lockReconnect = false;
    tt;
    runScene(Scene) {
        let old = this.stage.getChildByName('scene');

        while (old) {
            if ( old._destroy ) {
                old._destroy();
            }
            old.destroy(true);
            this.stage.removeChild(old);
            old = this.stage.getChildByName('scene');
        }

        let scene = new Scene();
        scene.name = 'scene';
        scene.sceneName = Scene.name;
        scene.launch()
        this.stage.addChild(scene);

        return scene;
    }

    joinToRoom() {
        wx.showLoading({ title: '加入房间中'});
    }

    scenesInit() {
        // 从会话点进来的场景
        if ( databus.currAccessInfo ) {
            this.joinToRoom();
        } else {
            this.runScene(Home);
        }
    }

    matchEnemy(data){
      databus.enemyInfo = {
        avatarUrl: data.EnemyAvatarUrl,
        nickName: data.EnemyName,
        color: data.Color
      }
      this.runScene(Match)
      if(data.Color == 1){
        databus.canPlay = true
      }
      wx.showLoading({
        title: '加载游戏中。。。',
      })
      let that = this
      setTimeout(function () {
        wx.hideLoading({
          success: ()=>{
            that.runScene(Play)
          }
        })
      }, 2000)
    }
    drawChess(data){
      let latestChess = data.Steps[data.Steps.length - 1]
      if(latestChess.Color == databus.enemyInfo.color){
        return
      }
      let avatar = createBtn({
        img    : latestChess.Color == 1 ? 'images/white.png' : 'images/black.png',
        x      : 30 + latestChess.Pos.X * 35.35,
        y      : 30 + latestChess.Pos.Y * 35.35,
        width: 38,
        height:38,
        onclick: () => {
        }
      })
      databus.board.addChild(avatar)
      databus.GoBangArray[latestChess.Pos.X][latestChess.Pos.Y] = latestChess.Color
      databus.canPlay = true
    }
    broadcastResult(data){
      wx.showModal({
        content: 'You ' + data.GameResult + '!',
        showCancel: false,
        confirmColor: '#02BB00',
        success: ()=>{
          this.stage.removeChild(databus.board)
          this.runScene(Home)
        }
    });
    }
    init() {
        this.scaleToScreen();
        databus.stage = this.stage
        this.bg = new BackGround();
        this.stage.addChild(this.bg);

        this.ticker.stop();
        this.timer = +new Date();
        this.aniId = window.requestAnimationFrame(this.bindLoop);

        login.do((userInfo) => {
          this.createWebSocket(userInfo);
        });
    }

  createWebSocket(userInfo) {
    this.socketTask = wx.connectSocket({
      url: 'wss://game.tiaoyuyu.com/ws',
      success: res => {
        console.log("connect success");
      },
      fail: res => {
        wx.showToast({
          title: '请连接网络连接失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
    databus.socketTask = this.socketTask
    this.socketTask.onOpen(res => {
      let loginData = {
        id: 1101,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        token: databus.code
      };
      this.socketTask.send({
        data: JSON.stringify(loginData)
      });
      this.heartCheck.reset().start(this.socketTask);
    });
    this.socketTask.onMessage(res => {
      if (res && res.data && res.data != "Hello, Client!") {
        let result = JSON.parse(res.data);
        if (result.ErrorCode == "SUCCESS" && result.Id) {
          this[InterfaceID[result.Id]].bind(this)(result);
        }
      }
      this.heartCheck.reset().start(this.socketTask);
    });
    this.socketTask.onError(res=>{
      console.log("WebSocket:发生错误");
      this.reconnect();
    })
  }

    scaleToScreen() {
        const x = window.innerWidth / 375;
        const y = window.innerHeight / 667;

        if ( x > y ) {
            this.stage.scale.x = y / x;
            this.stage.x = (1 - this.stage.scale.x) / 2 * config.GAME_WIDTH;
        } else {
            this.stage.scale.y = x / y;
            this.stage.y = (1 - this.stage.scale.y) / 2 * config.GAME_HEIGHT;
        }
    }

    loop() {
        let time = +new Date();
        this.timer = time;
        this.renderer.render(this.stage);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }

    bindWxEvents() {
      wx.login({
        success: res => {
          databus.code = res.code
        }
      })
        wx.onShow(res => {
            console.log('wx.onShow', res)
            let accessInfo = res.query.accessInfo;

            if (!accessInfo) return;

            if (!databus.currAccessInfo) {
                databus.currAccessInfo = accessInfo;
                return;
            }
        });
    }
  /**
     * websocket重连
     */
    reconnect() {
      if (this.lockReconnect) {
          return;
      }
      let that = this
      this.lockReconnect = true;
      this.tt && clearTimeout(this.tt);
      this.tt = setTimeout(function () {
          console.log('重连中...');
          that.lockReconnect = false;
          that.createWebSocket(databus.userInfo);
      }, 4000);
  }

/**
     * websocket心跳检测
     */
    heartCheck = {
      timeout: 5000,
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function () {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
      },
      start: function (websocket) {
          var self = this;
          this.timeoutObj && clearTimeout(this.timeoutObj);
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
          this.timeoutObj = setTimeout(function () {
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              websocket.send({
                data: JSON.stringify({
                  id:1001,
                  timestamp: parseInt(new Date().getTime()/1000)
                })
              });
              console.log('ping');
              self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
                  console.log('关闭服务');
                  websocket.close();//如果onclose会执行reconnect，我们执行 websocket.close()就行了.如果直接执行 reconnect 会触发onclose导致重连两次
              }, self.timeout)
          }, this.timeout)
      }
  }
}


