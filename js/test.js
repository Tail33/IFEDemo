
var strategys = {
    'isNotEmpty': function (value, msg) {
        if (value === "") {
            return msg;
        }
    },
    'minLength': function (value, length, msg) {
        if (value.length < length) {
            return msg;
        }
    },
    'isMobile': function (value, msg) {
        if (!/^[1][3|5|8|9][0-9]{9}$/.test(value)) {
            return msg;
        }
    },
    'maxLength': function (value, length, msg) {
        if (value.length > length) {
            return msg;
        }
    },
    'isInt': function (value, msg) {
        if (!value.match(/^\d+$/)) {
            return msg;
        }
    },
    'less': function (value, num, msg) {
        value = parseInt(value, 10);
        if (value > num) {
            return msg;
        }
    }
};

var Validator = function () {
    this.cache = [];//保存验证规则
};

Validator.prototype.add = function (dom, rules) {
    var self = this;

    for (var i = 0, rule; rule = rules[i++];) {
        
        (function () {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;

            self.cache.push(function () {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategys[strategy].apply(dom, strategyAry);
            });
        })();
        

    }
};

Validator.prototype.start = function () {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};

/**
 * inElement
 * 检测输入合法后，获取元素进入展示区
 * 参数direction 判断元素从左边插入还是右边插入展示区
 */
function inElement(direction) {
    var inputNum = document.getElementById("inputNum"),//获取id为inputNum输入框对象
        msg,//验证结果
        num = 0;//input输入的值转换为Number类型，赋值到num
    var displayZone = document.getElementById("displayZone");
    var lis = displayZone.getElementsByTagName('li');
    var num = 0;
    var li = null;

    //创建一个Validator实例
    var validator = new Validator();

    /**添加验证规则**/
    validator.add(inputNum, [{
        strategy: 'isNotEmpty',
        errorMsg: '你未输入内容！'
    }, {
        strategy: 'isInt',
        errorMsg: '请输入一个正整数'
    }, {
        strategy: 'less:100',
        errorMsg: "请输入一个0~100的整数"
    }]);

    //开始验证
    msg = validator.start();//获取验证结果
    if (msg) {//如果有验证结果返回，显示验证结果，结束函数运行
        alert(msg);
        return false;
    }


    //判断输入正确后，获取input输入的数字赋值到num
    num = parseInt(inputNum.value, 10);


    //判断队列是否已满
    if (lis.length >= 60) {
        alert('队列已满，元素无法加入');
        return;
    }

    //创建要插入的节点
    li = createElement(num);


    //判断插入的方向
    if (direction === "left") {
        console.log(lis[0]);
        //判断展示区是否有子元素li存在
        if (lis[0]) {
            displayZone.insertBefore(li, lis[0]);
        } else {
            displayZone.appendChild(li);
        }
    } else if (direction === "right") {
        displayZone.appendChild(li);
    }


}

/**
 * outElement
 * 删除展示区的元素，根据参数direction判断删除第一个还是最后一个
 */
function outElement(direction) {
    var displayZone = document.getElementById("displayZone");
    var lis = displayZone.getElementsByTagName('li');
    if (lis.length > 0) {
        if (direction === "left") {
            displayZone.removeChild(lis[0]);
        } else if (direction === "right") {
            displayZone.removeChild(lis[lis.length - 1]);
        }
    } else {
        alert("没有可删除的元素");
    }


}

/**
 * createLiElem
 * 创建li元素和设置li元素对象的属性
 * num为插入的数字，这个数字影响li的高度和li对象的属性设置
 */
function createElement(num) {
    var li = document.createElement('li');
    li.setAttribute("class", "listyle");
    li.style.height = num * 5 + 'px';
    li.dnum = num;
    li.setAttribute("title", num);
    return li;
}

/**
 * ranhandler
 * 随机生成60个li加入到展示区
 */
function ranhandler(n) {
    if (!flag) {
        console.log("任务队列中，请稍后再触发");
        return;
    }
    var displayZone = document.getElementById("displayZone");
    displayZone.innerHTML = '';
    var num;
    for (var i = 0; i < n; i++) {
        num = Math.floor(Math.random() * 100);
        //创建元素,添加到displayZone列表中
        displayZone.appendChild(createElement(num));
    }
}

var flag = true;

/**
 * ariView
 * 冒泡排序视图化
 */
function ariView() {
    var displayZone = document.getElementById("displayZone");
    var lis = displayZone.getElementsByTagName('li');
    var obsli = {};
    var n = lis.length - 1;
    var i = 0;
    var time = 1000;

    //判断队列是否有元素，如果没有，就不运行视图化
    if (lis.length == 0) {
        alert("当前展示区无元素可以视图化");
    }

    if (lis.length >= 2) {
        if (flag) {
            flag = false;
            setTimeout(arihandler, time);
        } else {
            console.log("动画未执行完，请稍后！")
        }

    }

    function arihandler() {

        if (i < n) {
            if (i > 0) {
                lis[i - 1].style.backgroundColor = 'red';
            }
            lis[i].style.backgroundColor = 'blue';
            lis[i + 1].style.backgroundColor = 'blue';
            if (lis[i].dnum > lis[i + 1].dnum) {
                displayZone.insertBefore(lis[i + 1], lis[i]);
            }
            i++;
            setTimeout(arihandler, time);
        } else if (i == n) {
            lis[i - 1].style.backgroundColor = 'red';
            lis[i].style.backgroundColor = 'orange';
            n--;

            i = 0;
            if (n > 0) {
                setTimeout(arihandler, time);
            } else if (n == 0) {
                lis[n].style.backgroundColor = 'orange';
                flag = true;
            }
        }
    }
}

function init() {
    document.getElementById("funcZone").onclick = function (e) {
        switch (e.target.id) {
            case "in-left":
                inElement("left");
                break;

            case "in-right":
                inElement("right");
                break;

            case "out-left":
                outElement("left");
                break;

            case "out-right":
                outElement("right");
                break;

            case "ari-view":
                ariView();
                break;
            case "ranNum":
                ranhandler(60);
                break;
            default:
                break;
        }
    };

    var displayZone = document.getElementById("displayZone");

    displayZone.onclick = function (e) {
        if (e.target.nodeName === "LI") {
            this.removeChild(e.target);
        }
    }
}

//初始化
init();