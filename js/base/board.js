import * as PIXI from '../libs/pixi.js';
import config    from '../config.js';
import databus from "../databus.js"
import {createBtn, createCircle, createLine} from '../common/ui.js'
export default class Board extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from('images/chessboard.png');
        super(texture);

        this.x = config.GAME_WIDTH / 40
        this.y = config.GAME_HEIGHT / 2 - config.GAME_WIDTH * 19 / 40
        this.width = config.GAME_WIDTH * 19 / 20
        this.height = config.GAME_WIDTH * 19 / 20
        this.interactive = true
        this.on('pointerdown',(res)=>{
          if(!databus.canPlay){
            return
          }
          let stepX = (res.data.global.x - this.x * databus.stage.scale.x - databus.stage.x - 27.5) / (45.79 * databus.stage.scale.x)
          let stepY = (res.data.global.y - this.y * databus.stage.scale.y - databus.stage.y -  27.5) / (45.79 * databus.stage.scale.y)
          if(stepX < 0 || stepY < 0 || stepX > 14.5 || stepY > 14.5){
            return
          }
          let avatar = createBtn({
            img    : 'images/white.png',
            x      : 30 + Math.round(stepX) * 35.35,
            y      : 30 + Math.round(stepY) * 35.35,
            width: 38,
            height:38,
            onclick: () => {
            }
          })
          this.addChild(avatar)
          databus.canPlay = false
          let stepInfo = {
            id:1301,
            step:{
              // color:databus.enemyInfo.color,
              pos:{
                X: Math.round(stepX),
                Y: Math.round(stepY)
              }
            }
          }
          // databus.socketTask.send({
          //   data:JSON.stringify(stepInfo)
          // })
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
