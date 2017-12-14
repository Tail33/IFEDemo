
let Observer = function (data) {
    this.data = data;
    this.walk(data);
};

let p = Observer.prototype;

p.walk = function (data) {
    for (let key in data) {//遍历data对象所有的属性
        if (data.hasOwnProperty(key)) {//判断该属性是不是该对象本身的成员，而不是对象原型的属性
            let val = data[key];
            if (typeof val === 'object') {//判断该属性的值是否为最底层的数据，而不是对象.如果是对象，继续遍历属性
                new Observer(val);
            }
            this.convert(key,val)
        }
    }
}

p.convert=function(key,val){
    Object.defineProperty(this.data,key,{
        configurable:true,//描述符能够被改变
        enumerable:true,//能够被枚举
        set:function(value){
            console.log("你修改了"+key+"属性");
            val=value;
        },
        get:function(){
            console.log("你访问了"+key+"属性");
            return val;
        }
    })
};

//动态数据的绑定

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

// 要实现的结果如下：
// app1.data.name // 你访问了 name
// app1.data.age = 100;  // 你设置了 age，新的值为100
// app2.data.university // 你访问了 university
// app2.data.major = 'science'  // 你设置了 major，新的值为 science