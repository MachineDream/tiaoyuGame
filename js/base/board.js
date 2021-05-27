import * as PIXI from '../libs/pixi.js';
import config    from '../config.js';
import {createBtn, createCircle, createLine} from '../common/ui.js'
export default class Board extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from('images/chessboard.png');
        super(texture);

        // super();

        this.x = config.GAME_WIDTH / 40
        this.y = config.GAME_HEIGHT / 2 - config.GAME_WIDTH * 19 / 40
        this.width = config.GAME_WIDTH * 19 / 20
        this.height = config.GAME_WIDTH * 19 / 20
        this.interactive = true
        this.on('pointerdown',(res)=>{
          console.log(res.data.global)
        })
        this.initBoard();
        let avatar = createBtn({
          img    : 'images/white.png',
          x      : 380,
          y      : 275,
          width: 38,
          height:38,
          onclick: () => {
          }
        })
        let avatar1 = createBtn({
          img    : 'images/black.png',
          x      : 345,
          y      : 275,
          width: 38,
          height:38,
          onclick: () => {
          }
        })
        this.addChild(avatar,avatar1)
    }

    initBoard(){
      let centerPointX = this.width / 2;
      let centerPointY = 275;
      let length = 495;
      let step = length / 14;
      let leftPointX = 27.5;
      let leftPointY = centerPointY - length / 2;
      for(let i = 0; i<15;i++){
        this.addChild(createLine({
          x:leftPointX,
          y:leftPointY + step * i,
          originX:0,
          originY:0,
          targetX:length,
          targetY:0,
          width: 2,
          color: 0x333
        }))
        this.addChild(createLine({
          x:leftPointX + step * i,
          y:leftPointY,
          originX:0,
          originY:0,
          targetX:0,
          targetY:length,
          width: 2,
          color: 0x333
        })) 
      }
     for(let i = 0;i<9;i=i+4){
      for(let j = 0;j<9;j=j+4){
        let circle = createCircle({
          x      : leftPointX + step * (3 + j),
          y      : leftPointY + step * (3 + i),
          radius : 8
        })
        this.addChild(circle)
      }
     }
     this.addChild(createLine({
      x:15,
      y:15,
      originX:0,
      originY:0,
      targetX:520,
      targetY:0,
      width: 4,
      color: 0x333
    }),
    createLine({
      x:535,
      y:15,
      originX:0,
      originY:0,
      targetX:0,
      targetY:520,
      width: 4,
      color: 0x333
    }),
    createLine({
      x:15,
      y:535,
      originX:0,
      originY:0,
      targetX:520,
      targetY:0,
      width: 4,
      color: 0x333
    }),
    createLine({
      x:15,
      y:15,
      originX:0,
      originY:0,
      targetX:0,
      targetY:520,
      width: 4,
      color: 0x333
    })
    )
    }

}
