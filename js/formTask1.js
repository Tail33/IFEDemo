

/**
1.字符数为4~16位
2.每个英文字母、数字、英文符号长度为1
3.每个汉字，中文符号长度为2
 */

var yzBtn=document.querySelector('.yz-btn');
var ts=document.querySelector('.ts');
var mcInput=document.querySelector('.mc-input');
var text_default='必填，长度为4~16字符';//默认为“必填，长度为4~16字符”
document.onclick=function(){
   yzBtn.click();
};
yzBtn.onclick=function(e){
    e.stopPropagation();
    var len=0;
    
    var mcValue=mcInput.value.trim();
    
    var text_empty='姓名不能为空';
    var text_true='格式正确';
    var text_long="请填入长度为4~16字符，"

    //匹配这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ’ （ ） 《 》 〈 〉 【 】 『 』 「 」 ? ? 〔 〕 … — ～ ? ￥
    var reg = /[\u4E00-\u9FA5]|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c |\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    for(var ch in mcValue){
        if(reg.test(mcValue[ch])){
            len+=2;
        }else{
            len++;
        }
       
    }
    if(len===0){
        ts.innerHTML=text_empty;
        ts.classList.add("red-ts");
        ts.classList.remove("green-ts");
        mcInput.classList.add("red-input");
        mcInput.classList.remove("green-input");
    }else if(len>16||len<4){
        ts.classList.add("red-ts");
        ts.classList.remove("green-ts");
        mcInput.classList.add("red-input");
        mcInput.classList.remove("green-input");
        ts.innerHTML=text_long;
    }else{
        ts.innerHTML=text_true;
        ts.classList.add("green-ts");
        ts.classList.remove("red-ts");
        mcInput.classList.add("green-input");
        mcInput.classList.remove("red-input");
    }
}

document.body.onunload=function(){
    alert("11")
}

mcInput.onkeydown=function(e){
    if(e.keyCode==13){
        yzBtn.click();
    }
}


 //字符，正则表达式，几种方法 
 //跨浏览器事件对象
 //加个键盘事件
 //用策略类重构

