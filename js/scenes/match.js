import * as PIXI  from '../libs/pixi.js';
import config     from '../config.js';
import databus    from '../databus.js';
import Home from './home.js';
import { createBtn, createCircle, createText } from '../common/ui.js';

export default class Match extends PIXI.Container {
    constructor() {
        super();

    }

    appendBackBtn() {
        const back = createBtn({
            img   : 'images/goBack.png',
            x     : 104,
            y     : 68,
            onclick: () => {
                wx.showModal({
                    title: '温馨提示',
                    content: '是否离开房间？',
                    success: (res) => {
                        if ( res.confirm ) {
                            databus.enemyInfo = null
                            this.runScene(Home)
                        }
                    }
                })
            }
        });

        this.addChild(back);
    }

    appendOpBtn() {
        let circle = createCircle({
            x      : config.GAME_WIDTH / 3,
            y      : config.GAME_HEIGHT / 2,
            radius : 66
        })
        let avatar = createBtn({
            img    : databus.userInfo?databus.userInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH / 3,
            y      : config.GAME_HEIGHT / 2,
            onclick: () => {
            }
        })
        avatar.mask = circle
        let circleEnemy = createCircle({
            x      : config.GAME_WIDTH * 2 / 3,
            y      : config.GAME_HEIGHT / 2,
            radius : 66
        })
        let avatarEnemy = createBtn({
            img    : databus.enemyInfo?databus.enemyInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH * 2 / 3,
            y      : config.GAME_HEIGHT / 2,
            onclick: () => {
            }
        })
        avatarEnemy.mask = circleEnemy
        let vs = new PIXI.Text('VS', { fontSize: 64, align : 'center', fill: "#515151"});
        vs.x   = config.GAME_WIDTH / 2 - vs.width / 2;
        vs.y   = config.GAME_HEIGHT / 2 - 20;
        this.addChild(
            circle,
            avatar,
            createText({
                str    : databus.userInfo.nickName,
                x      : config.GAME_WIDTH / 3,
                y      : config.GAME_HEIGHT / 2 + 100,
                style  : {
                    fontSize: 32,
                    fill: "#515151"
                }
            }),
            vs,
            circleEnemy,
            avatarEnemy,
            createText({
                str    : databus.enemyInfo?databus.enemyInfo.nickName:'匹配中······',
                x      : config.GAME_WIDTH * 2 / 3,
                y      : config.GAME_HEIGHT / 2 + 100,
                style  : {
                    fontSize: 32,
                    fill: "#515151"
                }
            }),
        );
    }

    launch() {
        this.appendBackBtn();
        this.appendOpBtn();
    }

    runScene(Scene) {
        let old = databus.stage.getChildByName('scene');

        while (old) {
            if ( old._destroy ) {
                old._destroy();
            }
            old.destroy(true);
            databus.stage.removeChild(old);
            old = databus.stage.getChildByName('scene');
        }

        let scene = new Scene();
        scene.name = 'scene';
        scene.sceneName = Scene.name;
        scene.launch()
        databus.stage.addChild(scene);

        return scene;
    }
}

