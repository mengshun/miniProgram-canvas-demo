const app = getApp()

Page({
    data: {},

    onLoad: function () {
        // 通过此方法可以 准确的拿到绘制视图的大小
        wx.createSelectorQuery()
            .select('.my-pie')
            .fields({
                size: true,
            })
            .exec((e) => {
                this.drawAction(e[0].width, e[0].height)
            })
    },

    drawAction(w, h) {
        //使用wx.createContext获取绘图上下文context
        var context = wx.createContext();
        // 画饼图
        //    数据源
        var array = [30, 45, 40, 50, 35];
        var nameList = ["商品1", "商品2", "商品3", "商品4", "商品5"]
        var colors = ["#111", "#333", "#555", "#777", "#CCCAAA"];
        var total = 0;
        //    计算总量
        for (var index = 0; index < array.length; index++) {
            total += array[index];
        }
        // 圆心位置
        var point = {
            x: w / 2.0,
            y: h / 2.0
        };
        // 半径
        var radius = w * 0.25;
        var sum = 0
        for (var i = 0; i < array.length; i++) {
            context.beginPath();
            var start = sum / total * 2 * Math.PI
            sum += array[i]
            var end = sum / total * 2 * Math.PI
            // 圆心x 圆心y 半径 开始弧度位置 结束弧度位置 是否逆时针绘制
            context.arc(point.x, point.y, radius, start, end, false);
            // 添加连接到圆心的线
            context.lineTo(point.x, point.y);
            context.setFillStyle(colors[i]);
            context.fill();
            context.closePath();

            // 当前饼形所占的弧度大小
            var angle = array[i] / total * 2 * Math.PI
            // 当前饼形的中心 弧度位置
            var lineAngle = angle / 2.0 + start
            // 线起始半径长度
            var startLength = radius * 0.8
            // 线结束半径长度
            var endLength = radius * 1.4
            var startX = point.x + startLength * Math.cos(lineAngle)
            var startY = point.y + startLength * Math.sin(lineAngle)
            var endX = point.x + endLength * Math.cos(lineAngle)
            var endY = point.y + endLength * Math.sin(lineAngle)

            // 绘制饼形 中心位置到目标位置的线
            context.beginPath();
            context.moveTo(startX, startY)
            context.lineTo(endX, endY)
            context.setStrokeStyle('orange')
            context.stroke()

            var fixY = 0 // 防止文字压线
            if (lineAngle > Math.PI) {
                fixY = -10
            } else {
                fixY = 15
            }

            // 绘制线条 终点位置的 标题
            context.setFontSize(12)
            context.setFillStyle('black')
            context.fillText(nameList[i], endX - 10, endY + fixY)

        }

        //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
        wx.drawCanvas({
            //指定canvasId,canvas 组件的唯一标识符
            canvasId: 'mypie',
            actions: context.getActions()
        });
    }
})