
var data = [
    { userName: "1211", userPassword: "12121212", notarizePassword: "12121212", userEmail: "122@qw.com", userPhone: "13333333333" },
    { userName: "1222", userPassword: "12121212", notarizePassword: "12121212", userEmail: "122@qw.com", userPhone: "13333333333" },
    { userName: "12131", userPassword: "12121212", notarizePassword: "12121212", userEmail: "122@qw.com", userPhone: "13333333333" },
    { userName: "1224", userPassword: "12121212", notarizePassword: "12121212", userEmail: "122@qw.com", userPhone: "13333333333" }

],//提交的数据


    obj = {},//数据临时存放：表单的值暂时存放

    info = document.getElementById("info"),

    inputList = info.getElementsByTagName('input'),

    colors = ["#fa2a3a", "#81c473", "#77b4ec"],//[错误红色，正确绿色,正在输入蓝色]

    infoBtn = document.getElementById("info-btn");//提交按钮



/*****  策略对象  *******/
var strategies = {
    //值不为空
    isNonEmpty: function (value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    //最少位数
    minLength: function (value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    //最大位数
    maxLength: function (value, length, errorMsg) {
        if (value.length > length) {
            return errorMsg;
        }
    },
    //判断字符串是不是字母和数字的组合
    isNumOrLetter: function (value, errorMsg) {
        for (var index = 0; index < value.length; index++) {
            if (!(value.charAt(index).match(/[0-9]|[a-z]|[A-Z]/))) {
                return errorMsg;
            }
        }
    },
    //判断两个字符串是否一样
    notarizePassword: function (value, dom_name, errorMsg) {
        //passWord.value
        var domValue = document.querySelector("input[name=" + dom_name + "]").value;
        if (!(value == domValue)) {
            return errorMsg;
        }
    },
    //邮箱格式
    isEmail: function (value, errorMsg) {
        var regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (!regex.test(value)) {
            return errorMsg;
        }
    },
    //手机格式
    isPhone: function (value, errorMsg) {
        var regex = /(^1[3|5|8|9][0-9]{9}$)/;
        if (!regex.test(value)) {
            return errorMsg;
        }
    }
};

/**** Validator ****/
var Validator = function () {
    this.cache = {};
};

Validator.prototype.add = function (dom, rules) {
    this.cache[dom["name"]] = [];
    var self = this;

    for (var i = 0, rule; rule = rules[i++];) {
        (function (rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;
            var strategy = strategyAry.shift();

            strategyAry.push(errorMsg);

            self.cache[dom["name"]].push(function () {
                return strategies[strategy].apply(dom, ([dom.value].concat(strategyAry)));
            });
        })(rule);
    }
};

Validator.prototype.start = function (dom_name) {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[dom_name][i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};


/*****  客户调用代码  *******/
var validator = new Validator();


//添加验证规则
validator.add(info.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: "账号不能为空"
}, {
    strategy: 'minLength:4',
    errorMsg: '用户名长度不能小于4位'
}, {
    strategy: 'maxLength:16',
    errorMsg: '用户名长度不能大于16位'
}, {
    strategy: 'isNumOrLetter',
    errorMsg: '账号以字母和数字为组合'
}]);

validator.add(info.userPassword, [{
    strategy: 'isNonEmpty',
    errorMsg: "密码不能为空"
}, {
    strategy: 'minLength:8',
    errorMsg: '密码长度不能小于8位'
}, {
    strategy: 'maxLength:16',
    errorMsg: '密码长度不能大于16位'
}]);

validator.add(info.notarizePassword, [{
    strategy: 'isNonEmpty',
    errorMsg: "密码不能为空"
}, {
    strategy: ('notarizePassword:userPassword'),
    errorMsg: "两次输入的密码不一样"
}]);

validator.add(info.userEmail, [{
    strategy: 'isEmail',
    errorMsg: "你输入的邮箱格式不正确"
}]);

validator.add(info.userPhone, [{
    strategy: 'isPhone',
    errorMsg: "你输入的手机格式不正确"
}]);




Array.prototype.forEach.call(inputList, function (item, index, array) {

    item.nextElementSibling.defaultValue = item.nextElementSibling.innerHTML;//保存input的默认提示文字

    obj[item.name] = "";//初始化obj

    //表单获得焦点时，出现规则提示
    EventUtil.addHandler(item, "focus", function () {
        item.nextElementSibling.style.display = "block";
        item.style.borderColor = colors[2];
    });

    //表单失去焦点时，显示验证结果
    EventUtil.addHandler(item, "blur", function () {
        var dom_name = item["name"];
        var infoArray = verify(dom_name, item.value);//返回 [i,"提示信息"]
        var i = infoArray[0];
        var reInfo = infoArray[1];

        item.nextElementSibling.innerHTML = reInfo;
        item.nextElementSibling.style.color = colors[i];
        item.style.borderColor = colors[i];
    })
});


//验证input输入的值是否符合规则，返回数组[i,'提示信息'] ,i表示要渲染的边框颜色
var verify = function (dom_name, value) {
    var colorsIndex;//提示类型，错误返回数字0 ，正确返回1;
    var title;//提示信息
    var bool;//判断账号名是否已经重复

    var errorMsg = validator.start(dom_name);//验证值，如果有错误，返回错误信息。

    if (errorMsg) {
        colorsIndex = 0;
        title = errorMsg;
    } else {//没有错误信息时执行以下操作
        colorsIndex = 1;
        obj[dom_name] = value;//赋值到obj
        switch (dom_name) {
            case 'userName':
                //检查账号与data中的数据是否重复
                bool = data.every(function (item) {//遍历数组，全部返回true，才返回true
                    if (item['userName'] == value) {
                        return false;
                    }
                    return true;
                });
                if (!bool) {
                    colorsIndex = 0;
                    title = "账号名已存在"
                    obj["userName"] = "";
                    break;
                }
                title = "账号可用";
                break;

            case 'userPassword':
                title = "密码可用";
                break;

            case 'notarizePassword':
                title = "正确";
                break;

            case 'userEmail':
                title = "邮箱格式正确";
                break;

            case 'userPhone':
                title = "手机格式正确";
                break;

            default:
                break;
        }
    }

    return [colorsIndex, title];
};






EventUtil.addHandler(infoBtn, 'click', function (e) {//表单提交时，显示验证结果
    EventUtil.preventDefault(e);//阻止表格提交跳转

    for (var key in obj) {
        if (!obj[key]) {

            Array.prototype.forEach.call(inputList, function (item) {
                item.focus();
                item.blur();
            });
            document.getElementById('btn-tip').innerHTML = '请检查输入';
            return false;
        }
    }
    //数据验证正确后：
    var o = JSON.parse(JSON.stringify(obj));//克隆临时存放的对象
    obj={};//清空数据
    data.push(o);//提交数据
    document.getElementById('btn-tip').innerHTML = "提交成功";

    //提交数据后初始化表单
    Array.prototype.forEach.call(inputList, function (item, index, array) {
        item.value = "";
        item.nextElementSibling.style.display = "none";
        item.nextElementSibling.style.color = "#aaa";
        item.nextElementSibling.innerHTML = item.nextElementSibling.defaultValue;
    });

    //渲染数据
    renderList(data);
});


//绘制表单
function renderList(data) {
    //判断data是否有数据
    if(data.length==0){//没有数据就返回
        return false;
    }

    var table = document.getElementById('data-table');

    //清空表格
    table.innerHTML="";
    //添加表头
    table.innerHTML="<tr><td>账号</td><td>密码</td><td>邮箱</td><td>手机</td><td>操作</td><tr/>";

    data.forEach(function (item, index, array) {//遍历data数组
        var row = document.createElement('tr');

        for (var cs in item) {
            if (cs !== "notarizePassword") {//确认密码input的值无须加入表格
                row.innerHTML += "<td>" + item[cs] + "</td>";
            }
        }

        //添加删除键
        row.innerHTML += "<td><button>删除</button></td>"
        table.appendChild(row);//添加数据到表格

        //给删除键button添加点击事件
        EventUtil.addHandler(row.querySelector("button"), 'click', function () {
            index = array.indexOf(item);//寻找当前对象在数组的位置。
            array.splice(index, 1);//删除项
            table.removeChild(row);//删除表格

            //当表格无数据时，删除表头
            if (array.length == 0) {
                table.innerHTML="";
            }
        });

    });

}

/**
 * init
 * 初始化操作
 * 渲染数据；
 */
function init() {
    renderList(data);
}


init();



