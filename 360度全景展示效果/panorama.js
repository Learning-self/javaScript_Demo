/**
 * Created by lenovo on 2016/10/18.
 */
window.onload = function () {
    var oImg = document.getElementById("img1");
    var x = 0;
    var iSpeed = 0;
    var lastX = 0;
    var timer = null;
    var aImgs = document.getElementsByTagName("img");
    var oLastImg = oImg;
    //实现图片预加载
    var i = 0;
    for(i=1;i<77;i++){
        (function (iImg) {
                var oImg = new Image();
                oImg.src = "images/panorama(" + i + ").jpg";
                oImg.onload = function () {
                    iImg.src = this.src;
                }
                iImg.style.display = "none";
                document.body.appendChild(iImg);
            }
        )(document.createElement("img"));
    }
    document.onmousedown = function (ev) {
        var oEvent = ev || event;
        var disX = oEvent.clientX - x;
        clearInterval(timer);
        document.onmousemove = function (ev) {
            var oEvent = ev || event;
            x = oEvent.clientX - disX;
            move();
            iSpeed = x - lastX;
            lastX = x;

        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;


            timer = setInterval(function () {
                move();
            },30)

        }
        function move() {
            if(iSpeed>0){
                iSpeed--;
            }
            else{
                iSpeed++;
            }
            if(iSpeed == 0){
                clearInterval(timer);
            }

            document.title =iSpeed;
            x += iSpeed;
            var l = -parseInt(x/10);
            if(l>0){
                var src = l%77;
            }else{
                var src = l+(-Math.floor(l/77)*77);
            }
            if(oLastImg != aImgs[l]) {
                oLastImg.style.display = "none";
                aImgs[src].style.display = "block";
                oLastImg = aImgs[src];
            }
        }
        return false;
    }
}