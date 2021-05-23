import {
    getDeviceInfo
} from './common/util.js';

const deviceinfo = getDeviceInfo();

export default {
    debug       : true,

    dpr         : deviceinfo.devicePixelRatio,
    windowWidth : deviceinfo.windowWidth,
    windowHeight: deviceinfo.windowHeight,

    GAME_WIDTH  : 375 * 2,
    GAME_HEIGHT : 667 * 2,

    pixiOptions: {
        backgroundColor: 0,
        antialias      : false,
        sharedTicker   : true,
        view           : canvas,
    },

    roomState: {
        inTeam   : 1,
        gameStart: 2,
        gameEnd  : 3,
        roomDestroy: 4,
    },

    deviceinfo,

    resources: [
        "images/bg.png",
        "images/default_user.png",
        "images/avatar_default.png",
        "images/hosticon.png",
    ],

    msg: {
        "SHOOT"         : 1,
        "MOVE_DIRECTION": 2,
        "MOVE_STOP"     : 3,
        "STAT"          : 4,
    },

    roleMap: {
        owner  : 1,
        partner: 0,
    },

    playerHp: 20,
}

