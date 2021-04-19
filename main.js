let  canvas,cvs;
let first = 'black';
let vectory = ''; // 记录胜利者
let existsArr = []
let openIntellect = false,handler = true; // openIntellect是否开启电脑模式   handler代表当前操作方
const
    totalWidth = 600,totalHeight = 600,perWidth = 50,perHeight = 50,
    pi = Math.PI,radius = 20;
// 绘制棋盘 并添加监听事件
drawQP()
function drawQP() {
    canvas = document.getElementById('mycanvas');
    cvs = canvas.getContext("2d");
    for (let i=0;i<(totalWidth/perWidth);i++) {
        // 竖线
        cvs.moveTo(perWidth*i,0)
        cvs.lineTo(perWidth*i,totalWidth)
        cvs.stroke();
        // 横线
        cvs.moveTo(0,perHeight*i)
        cvs.lineTo(totalWidth,perHeight*i)
        cvs.stroke();
    }

    /**offsetX:IE特有,鼠标相比较于触发事件的元素的位置,以元素盒子模型的内容区域的左上角为参考点,如果有boder,可能出现负值
     layerX:鼠标相比较于当前坐标系的位置,即如果触发元素没有设置绝对定位或相对定位,以页面为参考点,如果有,将改变参考坐标系,
     从触发元素盒子模型的border区域的左上角为参考点,也就是当触发元素设置了相对或者绝对定位后,layerX和offsetX就幸福地生活在一起^-^,
     几乎相等,唯一不同就是一个从border为参考点,一个以内容为参考点 **/
    canvas.addEventListener('click',function (e) {
        // console.log(e);
        let x = e.layerX;
        let y = e.layerY;
        searchPoint(x,y)
    })
}
function drawPoint(x,y) {
    isInExistsArr(x,y)
    // 判断第一个点
    if(first === 'black') {
        existsArr.push({
            "x": x,
            "y": y,
            "type": "b"
        })
        cvs.beginPath()
        cvs.arc(perWidth*x,perHeight*y,radius,0,2*pi)
        cvs.fillStyle = first;
        cvs.fill()
        cvs.stroke();
        first = 'white'
    } else {
        existsArr.push({
            "x": x,
            "y": y,
            "type": "w"
        })
        cvs.beginPath()
        cvs.arc(perWidth*x,perHeight*y,radius,0,2*pi)
        cvs.fillStyle = first;
        cvs.fill()
        cvs.stroke()
        first = 'black'
    }
    if (!handler) {
        handler = true
        setTimeout(() => {
            // 电脑落子
            computerHanding();
            canvas.addEventListener('click',function (e) {
                // console.log(e);
                let x = e.layerX;
                let y = e.layerY;
                searchPoint(x,y)
            })
        },1000)
    }

    let succ = result(x,y)
    if(!succ) return;
    if (succ === 'black') {
        alert('黑子胜出！')
    } else {
        alert('白子胜出！')
    }
    setTimeout(() => {
        destory()
    },500)
}
// 寻点
function searchPoint(coorX,coorY) {
    if (openIntellect && handler) {
        handler = false
        canvas.removeEventListener('click',function (e) {
            // console.log(e);
            let x = e.layerX;
            let y = e.layerY;
            searchPoint(x,y)
        })
        return
    }

    let x = coorX%perWidth
    let y = coorY%perHeight
    let xPoint,yPoint
    if(x>radius && y>radius){
        xPoint = Math.floor(coorX/perWidth)+1
        yPoint = Math.floor(coorY/perHeight)+1
    }
    if(x>radius && y<radius+1){
        xPoint = Math.floor(coorX/perWidth)+1
        yPoint = Math.floor(coorY/perHeight)
    }
    if(x<radius+1 && y>radius){
        xPoint = Math.floor(coorX/perWidth)
        yPoint = Math.floor(coorY/perHeight)+1
    }
    if(x<radius+1 && y<radius+1){
        xPoint = Math.floor(coorX/perWidth)
        yPoint = Math.floor(coorY/perHeight)
    }
    drawPoint(xPoint,yPoint);
}
// 判断输赢
function result (x,y) {
    let color;
    // 上一落子颜色
    if (first === 'black') {
        color = 'white'
    } else {
        color = 'black'
    }
    // 拿到此颜色的所有棋子
    let points = existsArr.filter(e => {
        return e.type === color.substring(0,1)
    })
    // 横向判断 连成五个则胜
    let pointsH = points.filter(e => {
        return e.y === y && Math.abs(e.x -x) <5;
    })
    // 纵向判断
    let pointsZ = points.filter(e => {
        return e.x === x && Math.abs(e.y-y) <5
    })
    // 两个斜方向判断
    let pointsXY = points.filter(e => {
        return Math.abs(e.x-x) === Math.abs(e.y-y) && Math.abs(e.y -y) <5 && Math.abs(e.x-x) <5
    })
    if (pointsH.length <5 && pointsZ.length < 5 && pointsXY.length < 5) return;
    if(color === 'black') {
        vectory = 'black'
    } else {
        vectory = 'white'
    }

    return vectory;
}
function destory() {
    $('#mycanvas').remove()
    $('body').append('<canvas id="mycanvas" width="600px" height="600px" class="canvas"></canvas>')
    drawQP()
    first = 'black';
    vectory = ''; // 记录胜利者
    existsArr.splice(0,existsArr.length)
    handler = true
}
function intellect() {
    openIntellect = true;
    if (existsArr.length !== 0) destory()
}
function unIntellect() {
    openIntellect = false;
    if(existsArr.length !== 0) destory()
}
// 判断是否在数组中
function isInExistsArr(x,y) {
    let flag = false;  // flag=false  默认当前点击点不存在
    existsArr.forEach((obj) => {
        if(obj.x === x && obj.y === y) {
            flag = true
        }
    })
    if(flag) {
        alert('当前点已存在！')
        return
    }
}
function computerHanding() {
    let flag = false
    let pointsB = existsArr.filter(e => {
        return e.type === 'b'
    })
    // if(pointsB.length = 1) {
    //     drawPoint(pointsB[0].x+1,pointsB[0].y)
    // }
    for(let i=0;i<pointsB.length;i++) {
        let {x,y} = pointsB[i];
        // 横向
        let pH = pointsB.filter((e) => {
            return e.y === y && Math.abs(e.x -x) <3;
        })
        if(pH.length>2) {
            let arr = pH.filter(p => {
                return p.x
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(max+1,pH[0].y)
            } else {
                drawPoint(min-1,pH[0].y)
            }
            flag = true
            break;
        }
        // 纵向
        let pZ = pointsB.filter(e => {
            return e.x === x && Math.abs(e.y-y) <3
        })
        if(pZ.length>2) {
            let arr = pZ.filter(p => {
                return p.y
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(pZ[0].x,max+1)
            } else {
                drawPoint(pZ[0].x,min-1)
            }
            flag = true
            break;
        }
        let zh = pointsB.filter(e => {
            return Math.abs(e.x-x) === Math.abs(e.y-y) && Math.abs(e.y -y) <3 && Math.abs(e.x-x) <3
        })
        if (zh.length >2) {
            let arrx = zh.filter(p => {
                return p.x
            })
            let arry = zh.filter(p => {
                return p.y
            })
            let maxX = Math.max.apply(null, arrx);
            let maxY = Math.max.apply(null, arry);
            let minX = Math.min.apply(null,arrx)
            let minY = Math.min.apply(null,arry)
            if (maxX <12 && minY >0) {
                drawPoint(maxX+1,minY-1)
            } else if (maxX<12 && minY<12) {
                drawPoint(maxX+1,minY+1)
            } else if (minX>0 && minY >0) {
                drawPoint(minX-1,minY-1)
            } else {
                drawPoint(minX-1,maxY+1)
            }
            flag = true
            break;
        }
    }
    if(!flag) success()
}
function success() {
    let pointsW = existsArr.filter(e => {
        return e.type === 'w'
    })
    for(let i=0;i<pointsW.length;i++) {
        let {x,y} = pointsW[i];
        // 横向
        let pH = pointsW.filter((e) => {
            return e.y === y && Math.abs(e.x -x) <3;
        })
        if(pH.length>2) {
            let arr = pH.filter(p => {
                return p.x
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(max+1,pH[0].y)
            } else {
                drawPoint(min-1,pH[0].y)
            }
            flag = true
            break;
        }
        // 纵向
        let pZ = pointsW.filter(e => {
            return e.x === x && Math.abs(e.y-y) <3
        })
        if(pZ.length>2) {
            let arr = pZ.filter(p => {
                return p.y
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(pZ[0].x,max+1)
            } else {
                drawPoint(pZ[0].x,min-1)
            }
            flag = true
            break;
        }
        let zh = pointsW.filter(e => {
            return Math.abs(e.x-x) === Math.abs(e.y-y) && Math.abs(e.y -y) <3 && Math.abs(e.x-x) <3
        })
        if (zh.length >2) {
            let arrx = zh.filter(p => {
                return p.x
            })
            let arry = zh.filter(p => {
                return p.y
            })
            let maxX = Math.max.apply(null, arrx);
            let maxY = Math.max.apply(null, arry);
            let minX = Math.min.apply(null,arrx)
            let minY = Math.min.apply(null,arry)
            if (maxX <12 && minY >0) {
                drawPoint(maxX+1,minY-1)
            } else if (maxX<12 && minY<12) {
                drawPoint(maxX+1,minY+1)
            } else if (minX>0 && minY >0) {
                drawPoint(minX-1,minY-1)
            } else {
                drawPoint(minX-1,maxY+1)
            }
            flag = true
            break;
        }
    }
    for(let i=0;i<pointsW.length;i++) {
        let {x,y} = pointsW[i];
        // 横向
        let pH = pointsW.filter((e) => {
            return e.y === y && Math.abs(e.x -x) <3;
        })
        if(pH.length<3) {
            let arr = pH.filter(p => {
                return p.x
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(max+1,pH[0].y)
            } else {
                drawPoint(min-1,pH[0].y)
            }
            flag = true
            break;
        }
        // 纵向
        let pZ = pointsW.filter(e => {
            return e.x === x && Math.abs(e.y-y) <3
        })
        if(pZ.length<3) {
            let arr = pZ.filter(p => {
                return p.y
            })
            let max = Math.max.apply(null, arr);
            let min = Math.min.apply(null, arr);
            if (max <12) {
                drawPoint(pZ[0].x,max+1)
            } else {
                drawPoint(pZ[0].x,min-1)
            }
            flag = true
            break;
        }
        let zh = pointsW.filter(e => {
            return Math.abs(e.x-x) === Math.abs(e.y-y) && Math.abs(e.y -y) <3 && Math.abs(e.x-x) <3
        })
        if (zh.length <3) {
            let arrx = zh.filter(p => {
                return p.x
            })
            let arry = zh.filter(p => {
                return p.y
            })
            let maxX = Math.max.apply(null, arrx);
            let maxY = Math.max.apply(null, arry);
            let minX = Math.min.apply(null,arrx)
            let minY = Math.min.apply(null,arry)
            if (maxX <12 && minY >0) {
                drawPoint(maxX+1,minY-1)
            } else if (maxX<12 && minY<12) {
                drawPoint(maxX+1,minY+1)
            } else if (minX>0 && minY >0) {
                drawPoint(minX-1,minY-1)
            } else {
                drawPoint(minX-1,maxY+1)
            }
            flag = true
            break;
        }
    }
}
