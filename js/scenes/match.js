import * as PIXI  from '../libs/pixi.js';
import config     from '../config.js';
import databus    from '../databus.js';
import { createBtn, createCircle, createText } from '../common/ui.js';

export default class Home extends PIXI.Container {
    constructor() {
        super();

    }

    appendOpBtn() {
        let circle = createCircle({
            x      : config.GAME_WIDTH / 3,
            y      : 287,
            radius : 66
        })
        let avatar = createBtn({
            img    : databus.userInfo?databus.userInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH / 3,
            y      : 287,
            onclick: () => {
            }
        })
        avatar.mask = circle
        let circleEnemy = createCircle({
            x      : config.GAME_WIDTH * 2 / 3,
            y      : 287,
            radius : 66
        })
        let avatarEnemy = createBtn({
            img    : databus.enemyInfo?databus.enemyInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH * 2 / 3,
            y      : 287,
            onclick: () => {
            }
        })
        avatarEnemy.mask = circleEnemy
        this.addChild(
            circle,
            avatar,
            circleEnemy,
            avatarEnemy
        );
    }

    launch() {
        this.appendOpBtn();
    }
}

