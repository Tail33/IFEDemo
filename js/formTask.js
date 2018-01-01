//模拟数据
var data = [
    { userName: "1211", userPassword: "12121212", userEmail: "122@qw.com", userPhone: "13333333333" },
    { userName: "1222", userPassword: "12121213", userEmail: "123@qw.com", userPhone: "13333333334" },
    { userName: "12131", userPassword: "12121214", userEmail: "124@qw.com", userPhone: "13333333335" },
    { userName: "1224", userPassword: "12121215", userEmail: "125@qw.com", userPhone: "13333333336" }
],
    obj = {},//数据临时存放：缓存表单数据
    info = document.getElementById("info"),
    inputList = info.getElementsByTagName('input'),
    infoBtn = document.getElementById("info-btn"),//提交按钮
    table = document.getElementById('data-table');//获取表格对象

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
    this.cache = {};//存储验证规则
    this.tip = {};//存放验证正确后的提示信息
};

//添加验证规则
Validator.prototype.add = function (dom, rules, tipValue) {
    this.cache[dom["name"]] = [];
    this.tip[dom["name"]] = tipValue;
    var self = this;

    for (var i = 0, rule; rule = rules[i++];) {
        (function (rule) {
            var strategyAry = rule.strategy.split(':'),//minLength:4 ==> [minLength,4]
                errorMsg = rule.errorMsg,
                strategy = strategyAry.shift();

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
}], "账号可用");

validator.add(info.userPassword, [{
    strategy: 'isNonEmpty',
    errorMsg: "密码不能为空"
}, {
    strategy: 'minLength:4',
    errorMsg: '密码长度不能小于4位'
}, {
    strategy: 'maxLength:16',
    errorMsg: '密码长度不能大于16位'
}], "密码可用");

validator.add(info.notarizePassword, [{
    strategy: 'isNonEmpty',
    errorMsg: "密码不能为空"
}, {
    strategy: 'minLength:4',
    errorMsg: '密码长度不能小于4位'
}, {
    strategy: ('notarizePassword:userPassword'),
    errorMsg: "两次输入的密码不一样"
}], "正确");

validator.add(info.userEmail, [{
    strategy: 'isEmail',
    errorMsg: "你输入的邮箱格式不正确"
}], "邮箱可用");

validator.add(info.userPhone, [{
    strategy: 'isPhone',
    errorMsg: "你输入的手机格式不正确"
}], "号码可用");


//验证input输入的值是否符合规则
var verify = function (dom_name, value) {
    var tip,//提示信息
        bool,//判断账号名是否已经重复
        classValue,// bs类名：校验状态
        errorMsg = validator.start(dom_name);//验证值，如果有错误，返回错误信息。

    if (errorMsg) {
        classValue = 'has-error';
        tip = errorMsg;
    } else {//没有错误信息时执行以下操作
        classValue = 'has-success';
        tip = validator.tip[dom_name];
        obj[dom_name] = value;//赋值到obj
        if (dom_name == 'userName') {
            //检查账号与data中的数据是否重复
            bool = data.every(function (item) {//遍历数组，全部返回true，才返回true
                if (item['userName'] == value) {
                    return false;
                }
                return true;
            });
            if (!bool) {
                classValue = 'has-error';
                tip = "账号名已存在"
                obj["userName"] = "";
            }
        }
    }

    return [classValue, tip];
};

//添加表格行
function addRow(obj, data, i) {
    var row = document.createElement('tr');
    row.innerHTML += "<td>" + i + "</td>";
    for (var cs in obj) {
        row.innerHTML += "<td>" + obj[cs] + "</td>";
    }

    //添加删除键
    row.innerHTML += "<td><button class='btn btn-default' >删除</button></td>"

    var tbody = table.querySelector('tbody');//获取tbody元素对象

    tbody.appendChild(row);//添加数据到表格

    //给删除键button添加点击事件
    EventUtil.addHandler(row.querySelector("button"), 'click', function () {
        var index = data.indexOf(obj);//寻找当前对象在数组的位置。
        data.splice(index, 1);//在data中删除当前数据
        tbody.removeChild(row);//删除表格
        renderTable(data);
        //当表格无数据时，删除表头
        if (data.length == 0) {
            table.innerHTML = "";
        }
    });
}

/**
 * renderTable
 * 渲染data数据成表格
*/
function renderTable(data) {
    //判断data是否有数据
    if (data.length == 0) {//没有数据就返回
        return false;
    }
    table.innerHTML = ""; //清空表格
    //添加表头
    table.innerHTML = "<caption>表单提交后数据显示在表格上：</caption><thead><tr><th>#</th><th>账号</th><th>密码</th><th>邮箱</th><th>手机</th><th>操作</th></tr></thead><tbody></tbody>";

    data.forEach(function (item, index, array) {//遍历data数组
        //添加表格行
        addRow(item, array, index + 1);
    });
}

/**
 * init
 * 初始化操作
 * 渲染数据；事件绑定;
 */
function init() {
    renderTable(data);

    //事件绑定
    Array.prototype.forEach.call(inputList, function (item, index, array) {
        item.nextElementSibling.defaultValue = item.nextElementSibling.innerHTML;//保存input的默认提示文字

        obj[item.name] = "";//初始化obj

        //表单失去焦点时，显示验证结果
        EventUtil.addHandler(item, "blur", function () {
            var dom_name = item["name"];
            var infoArray = verify(dom_name, item.value);//返回 [classValue,"提示信息"]
            var classValue = infoArray[0];
            var reInfo = infoArray[1];
            item.nextElementSibling.innerHTML = reInfo;
            item.parentNode.setAttribute("class", classValue);
        })
    });


    EventUtil.addHandler(infoBtn, 'click', function (e) {//表单提交时，显示验证结果
        EventUtil.preventDefault(e);//阻止表格提交跳转
    
        //触发事件
        Array.prototype.forEach.call(inputList, function (item) {
            item.focus();
            item.blur();
        });
    
        for (var key in obj) {
            if (!obj[key]) {
                document.getElementById('btn-tip').innerHTML = '请检查输入';
                return false;
            }
        }
        //数据验证正确后：
        var o = JSON.parse(JSON.stringify(obj));//克隆临时存放的对象
        //清空数据
        for (key in obj) {
            obj[key] = "";
        }
        delete o['notarizePassword'];
    
        var dataLength = data.length;
    
        data.push(o);//提交数据到data
    
        document.getElementById('btn-tip').innerHTML = "提交成功";
    
        //提交数据后初始化表单
        Array.prototype.forEach.call(inputList, function (item, index, array) {
            item.value = "";
            item.nextElementSibling.innerHTML = item.nextElementSibling.defaultValue;
            item.parentNode.setAttribute("class", "");
        });
    
        if (dataLength > 0) {
            addRow(o, data, data.length);
        } else {
            //渲染数据
            renderTable(data);
        }
    
    });
}

init();



