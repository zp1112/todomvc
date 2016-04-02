/**
 * Created by Willin on 2016-4-1.
 */
window.onload=function () {
  var post=document.getElementsByClassName('post')[0];
  var post_h2=post.getElementsByTagName('h2')[0];
  var form=document.getElementById('post_new');
  var editButton=document.getElementsByClassName('edit');
  var submit=document.getElementsByClassName('submit')[0];
  var textarea=document.getElementsByTagName('textarea')[0];
  
  for(var i=0;i<editButton.length;i++){
    (function(i){
      var href=editButton[i].href;//使用立即执行的匿名函数避免闭包的副作用
      editButton[i].addEventListener("click", function(e) { //
        e.preventDefault();
        post_h2.innerHTML="编辑";
        form.action=href;
        submit.value="编辑完成";
        // var p=document.createElement('p');
        // var input=document.createElement('input');
        // input.value="取消";
        // input.type="button";
        // input.className="cancel";
        // p.appendChild(input);
        // form.appendChild(p);
        var cancel=document.getElementsByClassName('cancel')[0];
        cancel.style.display='block';
        cancel.onclick=function () {
          post_h2.innerHTML="新增";
          form.action="/task";
          submit.value="添加";
          textarea.value='';
          this.style.display='none';
        }
      });
    })(i);
  }
}