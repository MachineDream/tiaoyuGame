import * as PIXI  from '../libs/pixi.js';
import config     from '../config.js';
import databus    from '../databus.js';
import Board from '../base/board.js'
import { createBtn, createCircle, createText } from '../common/ui.js';

export default class Play extends PIXI.Container {
    constructor() {
        super();

    }

    initBoard(){
        databus.board = new Board();
        databus.stage.addChild(databus.board)
    }

    launch() {
        databus.matchPattern = void 0;
        this.initBoard();
        this.drawContestant();
        wx.showToast({
            title: '执白先行',
            icon: 'none',
            duration: 500
        })
    }

    drawContestant() {
        let circle = createCircle({
            x      : config.GAME_WIDTH / 6,
            y      : config.GAME_HEIGHT / 8,
            radius : 66
        })
        let avatar = createBtn({
            img    : databus.userInfo?databus.userInfo.avatarUrl:'images/avatar_default.png',
            x      : config.GAME_WIDTH / 6,
            y      : config.GAME_HEIGHT / 8,
            onclick: () => {
            }
        })
        avatar.mask = circle
        let circleEnemy = createCircle({
            x      : config.GAME_WIDTH * 5 / 6,
            y      : config.GAME_HEIGHT * 7 / 8,
            radius : 66
        })
        let avatarEnemy = createBtn({
            img    : databus.enemyInfo.avatarUrl,
            x      : config.GAME_WIDTH * 5 / 6,
            y      : config.GAME_HEIGHT * 7 / 8,
            onclick: () => {
            }
        })
        avatarEnemy.mask = circleEnemy
        this.addChild(
            circle,
            avatar,
            createText({
                str    : databus.userInfo.nickName,
                x      : config.GAME_WIDTH  / 6,
                y      : config.GAME_HEIGHT / 8 + 100,
                style  : {
                    fontSize: 32,
                    fill: "#515151"
                }
            }),
            createBtn({
                img    : databus.enemyInfo.color == 1 ? 'images/white.png' : 'images/black.png',
                x      : config.GAME_WIDTH / 6 + 150,
                y      : config.GAME_HEIGHT / 8,
                width: 60,
                height:60,
                onclick: () => {
                }
            }),
            circleEnemy,
            avatarEnemy,
            createText({
                str    : databus.enemyInfo.nickName,
                x      : config.GAME_WIDTH * 5 / 6,
                y      : config.GAME_HEIGHT * 7 / 8 - 100,
                style  : {
                    fontSize: 32,
                    fill: "#515151"
                }
            }),
            createBtn({
                img    : databus.enemyInfo.color == 1 ? 'images/black.png' : 'images/white.png',
                x      : config.GAME_WIDTH * 5 / 6 - 150,
                y      : config.GAME_HEIGHT * 7 / 8,
                width: 60,
                height:60,
                onclick: () => {
                }
            })
        );
    }
}

