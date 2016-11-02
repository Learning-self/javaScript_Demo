/**
 * Created by lenovo on 2016/10/28.
 */
function css(obj, attr, value) {
    if(arguments.length == 2){
        if(attr != "opacity"){
            return parseInt(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj,false)[attr]);
        }else{
            return Math.round(100*parseFloat(obj.currentStyle?obj.currentStyle:document.defaultView.getComputedStyle(obj,false)[attr]));
        }
    }
    else if(arguments.length == 3)
        switch(attr)
        {
            //value不允许为负值
            case "width":
            case "height":
            case "paddingLeft":
            case "paddingTop":
            case "paddingRight":
            case "paddingBottom":
                value=Math.max(value,0);
            //值允许为负值
            case "left":
            case "top":
            case "marginLeft":
            case "marginTop":
            case "marginRight":
            case "marginBottom":
                obj.style[attr] = value+"px";
                break;
            case "opacity":
                obj.style.filter = "alpha(opacity:"+value+")";
                obj.style.opacity = value/100;
                break;
            default:
                obj.style[attr] = value;
        }
    //这句话是什么用意？
    return function (attr_in, value_in) {css(obj,attr_in,value_in);};
}

//运动的两种类型：缓冲型以及弹性型
var MOVE_TYPE = {
    BUFFER: 1,
    FLEX: 2,
};
function stopMove(obj) {
    clearInterval(obj.timer);
}
function startMove(obj, oTarget, iType, fnCallback, fnDuring) {
    var fnMove = null;
    if(obj.timer){
        clearInterval(obj.timer);
    }
    switch(iType){
        case MOVE_TYPE.BUFFER:
            fnMove = doMoveBuffer;
            break;
        case MOVE_TYPE.FLEX:
            fnMove = doMoveFlex;
            break;
    }
    obj.timer = setInterval(function () {
        fnMove(obj,oTarget,fnCallback,fnDuring);
    },30);
}
function doMoveBuffer(obj, oTarget, fnCallback, fnDuring) {
    var bStop = true;
    var attr = " ";
    var speed = 0;
    var cur = 0;

    for(attr in oTarget){
        cur = css(obj,attr);
        if(oTarget[attr] != cur){
            bStop = false;

            speed = (oTarget[attr]-cur)/5;
            speed = speed>0?Math.ceil(speed):Math.floor(speed);

            css(obj,attr,cur+speed);
        }
    }
    if(fnDuring) fnDuring.call(obj);
    if(bStop){
        clearInterval(obj.timer);
        obj.timer = null;

        if(fnCallback) fnCallback.call(obj);
    }
}

function doMoveFlex(obj, oTarget, fnCallback, fnDuring) {
    var bStop = true;
    var attr = " ";
    var speed = 0;
    var cur = 0;

    for(attr in oTarget){
        if(!obj.oSpeed) obj.oSpeed = {};
        if(!obj.oSpeed[attr]) obj.oSpeed[attr] = 0;
        cur = css(obj,attr);
        if(Math.abs(oTarget[attr]-cur)>=1 || Math.abs(obj.oSpeed[attr]-cur)>=1){
            bStop = false;
            obj.oSpeed[attr] +=(oTarget[attr]-cur)/5;
            obj.oSpeed[attr] *=0.7;

            css(obj,attr,cur+obj.oSpeed[attr]);
        }
    }
    if(fnDuring){
        fnDuring.call(obj);
    }
    if(bStop){
        clearInterval(obj.timer);
        obj.timer = null;

        if(fnCallback) fnCallback.call(obj);
    }
}