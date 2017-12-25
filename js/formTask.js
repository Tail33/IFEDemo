
var data = [],//提交的数据
    obj = {},//数据临时存放
    info = document.getElementById("info"),
    inputList = info.getElementsByTagName('input'),
    colors = ["#fa2a3a", "#81c473", "#77b4ec"],//[错误红色，正确绿色,正在输入蓝色]
    infoBtn = document.getElementById("info-btn");


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
    item.nextElementSibling.defaultValue=item.nextElementSibling.innerHTML;
    obj[item.name] = "";
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

var verify = function (dom_name, value) {
    var i;//提示类型，错误返回数字0 ，正确返回1;
    var title;//提示信息

    var errorMsg = validator.start(dom_name);
    if (errorMsg) {
        i = 0;
        title = errorMsg;
    } else {
        i = 1;
        obj[dom_name] = value;
        switch (dom_name) {
            case 'userName':
                title = "账号可用";
                break;

            case 'userPassword':
                title = "密码可用";
                break;

            case 'notarizePassword':
                title = "密码可用";
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

    return [i, title];
};






EventUtil.addHandler(infoBtn, 'click', function (e) {//表单提交时，显示验证结果
    EventUtil.preventDefault(e);//阻止表格跳转
    
    for (var key in obj) {
        if (!obj[key]) {
            alert("请输入正确的资料");
            return false;
        }
    }
    var o=JSON.parse( JSON.stringify( obj ) );
    data.push(o);
    alert("提交成功");

    Array.prototype.forEach.call(inputList, function (item, index, array) {
        obj[item.name]="";
        item.value="";
        item.nextElementSibling.style.display = "none";
        item.nextElementSibling.style.color = "#aaa";
        item.nextElementSibling.innerHTML=item.nextElementSibling.defaultValue;
    });
});










