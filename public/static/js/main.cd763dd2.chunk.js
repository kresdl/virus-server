(this.webpackJsonpvirus=this.webpackJsonpvirus||[]).push([[0],{100:function(e,t,n){e.exports=n.p+"static/media/c.8108d445.svg"},101:function(e,t,n){},102:function(e,t,n){},103:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(10),i=n.n(c),o=(n(55),n(56),n(5)),s=n(43),u=n.n(s),l=n(105),m=(n(89),function(){return r.a.createElement("div",{className:"connect"},r.a.createElement(l.a,{animation:"border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Connecting...")))}),f=n(24),v=n.n(f),p=n(45),d=n(106),g=n(107),b=(n(91),function(e){var t=e.socket,n=e.setName,a=function(){var e=Object(p.a)(v.a.mark((function e(a){var r;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.preventDefault(),r=a.target.elements.namedItem("nick").value,t.emit("join",r),t.once("inuse",(function(){return alert("Nick in use")})),t.once("joined",n);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("div",{className:"login"},r.a.createElement("h1",{className:"display-4 mb-5"},r.a.createElement("span",{className:"text-danger"},"CORONA")," HUNTER"),r.a.createElement(d.a,{className:"form-inline",onSubmit:a},r.a.createElement(d.a.Control,{className:"mr-2",type:"text",placeholder:"Nick",name:"nick"}),r.a.createElement(g.a,{type:"submit",variant:"primary"},"Play")))}),E=n(47),O=n(25),j=function(e,t,n){Object(a.useEffect)((function(){return Object.entries(t).forEach((function(t){var n=Object(o.a)(t,2),a=n[0],r=n[1];e.addEventListener(a,r)})),function(){Object.entries(t).forEach((function(t){var n=Object(o.a)(t,2),a=n[0],r=n[1];e.removeEventListener(a,r)}))}}),[e].concat(Object(E.a)(n)))},y=function(e){var t=Object(o.a)(e,2),n=t[0],a=t[1];return r.a.createElement(r.a.Fragment,null,n,r.a.createElement("span",{className:"text-danger"}," VS "),a)},N=function(e,t){var n=e.player,a=(e.time/1e3).toFixed(2);return r.a.createElement("span",{className:t===n?"text-primary":"text-danger"},[n,a].join(": ")+" sec")},k=function(e,t){var n=e.filter(Boolean),a=n.filter((function(e){return e.player===t})).length,r=n.length-a;return a>r?"You win by ".concat(a,"-").concat(r," \ud83c\udf89"):r>a?"You lose by ".concat(r,"-").concat(a):"Draw"},h=(n(95),function(e){var t=e.end,n=e.children,a=e.socket;return r.a.createElement("div",{className:"info"},r.a.createElement("p",{className:"message"},n),t&&r.a.createElement(g.a,{variant:"primary",onClick:function(){a.emit("play-again")}},"Play again"))}),T=(n(96),n(97)),w=T.keys().map(T),x=function(e){var t=e.x,n=e.y,a=e.variant,c={backgroundImage:"url(".concat(w[a],")"),left:t-50,top:n-50,width:100,height:100};return r.a.createElement("div",{className:"virus",style:c})},M=(n(101),n(108)),I=n(109),S=Object(a.memo)((function(e){var t=e.socket,n=e.startTimer,c=e.stopTimer,i=e.resetTimer,s=Object(a.useState)(),u=Object(o.a)(s,2),l=u[0],m=u[1];return j(t,{virus:function(e){n(),m(e)},miss:function(){c(),m(null)},partial:function(){c(),m(null)},results:function(){i(),m(null)}},[m,n,c]),r.a.createElement("div",{className:"arena",onMouseDown:function(e){if(l){var n=e.currentTarget.getBoundingClientRect(),a=e.clientX-n.x,r=e.clientY-n.y;t.emit("click",{x:a,y:r})}}},r.a.createElement(M.a,null,l&&r.a.createElement(I.a,{timeout:200,classNames:"virus"},r.a.createElement(x,l))))})),C=(n(102),function(e){var t=e.name,n=e.socket,c=function(){var e=Object(a.useState)({}),t=Object(o.a)(e,2),n=t[0],r=t[1],c=Object(a.useRef)(),i=Object(a.useMemo)((function(){return{waitMsg:function(){r({msg:"Waiting for a contender..."})},playersMsg:function(e,t){c.current=[e,t];var n=y(c.current);r({msg:n})},partialMsg:function(e){var t=N(e,c.current[0]);setTimeout((function(){r({msg:t})}),200)},resultsMsg:function(e){r({msg:k(e,c.current[0]),end:!0})},closeInfo:function(){r(null)}}}),[r,c]);return Object(O.a)({info:n},i)}(),i=c.info,s=c.waitMsg,u=c.playersMsg,l=c.partialMsg,m=c.resultsMsg,f=c.closeInfo,v=function(){var e=Object(a.useState)(0),t=Object(o.a)(e,2),n=t[0],r=t[1],c=Object(a.useRef)({}),i=function(){return((performance.now()-c.current.startTime)/1e3).toFixed(2)},s=Object(a.useMemo)((function(){return{startTimer:function(){c.current.startTime=performance.now(),c.current.interval=setInterval((function(){r(i())}),50),r(0)},stopTimer:function(){clearInterval(c.current.interval),r(i()),c.current.startTime=performance.now()},resetTimer:function(){clearInterval(c.current.interval),r(0),c.current.startTime=performance.now()}}}),[c,r]);return Object(O.a)({time:n},s)}(),p=v.time,d=v.startTimer,g=v.stopTimer,b=v.resetTimer,E=Object(a.useState)(),T=Object(o.a)(E,2),w=T[0],x=T[1],M={width:600,height:600};return j(n,{wait:function(){s(),b()},ready:function(e){u(t,e)},start:function(){x(!0),f(),b()},partial:function(e){l(e)},results:m},[t,s,b,u,x,f,b,l,m]),r.a.createElement("div",{className:w?"game animated":"game"},r.a.createElement("div",{className:"scope",style:M,onAnimationIteration:function(){i&&x(!1)}},r.a.createElement("div",{className:"bg"},i?r.a.createElement(h,{end:i.end,socket:n},i.msg):r.a.createElement(S,{socket:n,startTimer:d,stopTimer:g,resetTimer:b}))),r.a.createElement("p",{className:"text-white timer",style:{opacity:p?1:0}},p))}),D=function(){var e=Object(a.useState)(),t=Object(o.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)(),s=Object(o.a)(i,2),l=s[0],f=s[1];return Object(a.useEffect)((function(){var e=u()();return e.once("connect",(function(){return c(e)})),function(){return e.disconnect()}}),[c]),n?l?r.a.createElement(C,{socket:n,name:l}):r.a.createElement(b,{socket:n,setName:f}):r.a.createElement(m,null)};i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(D,null)),document.getElementById("root"))},50:function(e,t,n){e.exports=n(103)},56:function(e,t,n){},86:function(e,t){},89:function(e,t,n){},91:function(e,t,n){},95:function(e,t,n){},96:function(e,t,n){},97:function(e,t,n){var a={"./a.svg":98,"./b.svg":99,"./c.svg":100};function r(e){var t=c(e);return n(t)}function c(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}r.keys=function(){return Object.keys(a)},r.resolve=c,e.exports=r,r.id=97},98:function(e,t,n){e.exports=n.p+"static/media/a.e012df60.svg"},99:function(e,t,n){e.exports=n.p+"static/media/b.0a5e7c1e.svg"}},[[50,1,2]]]);
//# sourceMappingURL=main.cd763dd2.chunk.js.map