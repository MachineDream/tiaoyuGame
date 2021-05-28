import * as PIXI  from '../libs/pixi.js';
import config     from '../config.js';
import databus    from '../databus.js';
import Match        from './match';
import { createBtn, createCircle } from '../common/ui.js';

export default class Home extends PIXI.Container {
    constructor() {
        super();

    }

    appendOpBtn() {
        let circle = createCircle({
            x      : config.GAME_WIDTH / 2,
            y      : 287,
            radius : 66
        })
        let avatar = createBtn({
            img    : databus.userInfo?databus.userInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH / 2,
            y      : 287,
            onclick: () => {
            }
        })
        avatar.mask = circle
        this.addChild(
            circle,
            avatar,
            createBtn({
                img    : 'images/quickStart.png',
                x      : config.GAME_WIDTH / 2,
                y      : 442,
                onclick: () => {
                    let matchData = {
                        id: 1201,
                        matchType: 1
                      };
                      databus.socketTask.send({
                        data: JSON.stringify(matchData)
                      });
                      this.runScene(Match)
                }
            }),
            createBtn({
                img    : 'images/createRoom.png',
                x      : config.GAME_WIDTH / 2,
                y      : 582,
                onclick: () => {
                    wx.showModal({
                        content: '开发中，敬请期待',
                        showCancel: false,
                        confirmColor: '#02BB00',
                    });
                }
            })
        );
    }

    launch() {
        databus.matchPattern = void 0;
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

