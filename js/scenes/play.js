import * as PIXI  from '../libs/pixi.js';
import databus    from '../databus.js';
import Board from '../base/board.js'

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
    }

}

