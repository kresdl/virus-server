(this.webpackJsonpvirus=this.webpackJsonpvirus||[]).push([[0],{100:function(e,t,n){e.exports=n.p+"static/media/c.8108d445.svg"},101:function(e,t,n){},102:function(e,t,n){},103:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(10),i=n.n(c),o=(n(55),n(56),n(5)),s=n(43),u=n.n(s),l=n(25),m=n(47),f=function(e){var t=Object(o.a)(e,2),n=t[0],a=t[1];return r.a.createElement(r.a.Fragment,null,n,r.a.createElement("span",{className:"text-danger"}," VS "),a)},v=function(e,t){var n=e.player,a=(e.time/1e3).toFixed(2);return r.a.createElement("span",{className:t===n?"text-primary":"text-danger"},[n,a].join(": ")+" sec")},d=function(e,t){var n=e.filter(Boolean),a=n.filter((function(e){return e.player===t})).length,r=n.length-a;return a>r?"You win by ".concat(a,"-").concat(r," \ud83c\udf89"):r>a?"You lose by ".concat(r,"-").concat(a):"Draw"},p=n(105),E=(n(89),function(){return r.a.createElement("div",{className:"connect"},r.a.createElement(p.a,{animation:"border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Connecting...")))}),g=n(24),b=n.n(g),O=n(45),j=n(106),y=n(107),N=(n(91),function(e){var t=e.socket,n=function(){var e=Object(O.a)(b.a.mark((function e(n){var a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n.preventDefault(),a=n.target.elements.namedItem("nick").value,t.emit("join",a);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("div",{className:"login"},r.a.createElement("div",{className:"header"},r.a.createElement("h1",{className:"heading display-4 mb-5"},r.a.createElement("span",{className:"text-danger"},"CORONA")," HUNTER"),r.a.createElement("p",{className:"back"},"X5000")),r.a.createElement(j.a,{className:"form-inline",onSubmit:n},r.a.createElement(j.a.Control,{className:"mr-2",type:"text",placeholder:"Nick",name:"nick",autoComplete:"off",autoFocus:!0}),r.a.createElement(y.a,{type:"submit",variant:"primary"},"Play")))}),h=(n(95),function(e){var t=e.end,n=e.children,a=e.socket;return r.a.createElement("div",{className:"info"},r.a.createElement("p",{className:"message"},n),t&&r.a.createElement(y.a,{variant:"primary",onClick:function(){a.emit("play-again")}},"Play again"))}),T=(n(96),n(97)),k=T.keys().map(T),w=function(e){var t=e.x,n=e.y,a=e.variant,c={backgroundImage:"url(".concat(k[a],")"),left:t-50,top:n-50,width:100,height:100};return r.a.createElement("div",{className:"virus",style:c})},x=(n(101),n(108)),S=n(109),M=Object(a.memo)((function(e){var t=e.socket,n=e.virus,a=e.setVirus,c=e.stopTimer;return r.a.createElement("div",{className:"arena",onMouseDown:function(e){if(n){var r=e.currentTarget.getBoundingClientRect(),i=e.clientX-r.x,o=e.clientY-r.y;Math.sqrt(Math.pow(n.x-i,2)+Math.pow(n.y-o,2))<50&&(t.emit("click",c()),a(null))}}},r.a.createElement(x.a,null,n&&r.a.createElement(S.a,{timeout:200,classNames:"virus"},r.a.createElement(w,n))))})),C=(n(102),function(e){var t=e.socket,n=e.info,a=e.virus,c=e.setVirus,i=e.stopTimer,o=e.time,s=e.animated,u=e.setAnimated,l={width:600,height:600},m=(o/1e3).toFixed(2);return r.a.createElement("div",{className:s?"game animated":"game"},r.a.createElement("div",{className:"scope",style:l,onAnimationIteration:function(){n&&u(!1)}},r.a.createElement("div",{className:"bg"},n?r.a.createElement(h,{end:n.end,socket:t},n.msg):r.a.createElement(M,{socket:t,virus:a,setVirus:c,stopTimer:i}))),r.a.createElement("p",{className:"text-white timer",style:{opacity:o?1:0}},m))}),_=function(){var e=Object(a.useState)(),t=Object(o.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)(),s=Object(o.a)(i,2),p=s[0],g=s[1],b=function(){var e=Object(a.useState)(),t=Object(o.a)(e,2),n=t[0],r=t[1],c=Object(a.useRef)(),i=Object(a.useMemo)((function(){return{waitMsg:function(){r({msg:"Waiting for a contender..."})},playersMsg:function(e,t){c.current=[e,t];var n=f(c.current);r({msg:n})},partialMsg:function(e){var t=v(e,c.current[0]);setTimeout((function(){r({msg:t})}),200)},resultsMsg:function(e){r({msg:d(e,c.current[0]),end:!0})},closeInfo:function(){r(null)}}}),[r,c]);return Object(l.a)({info:n},i)}(),O=b.info,j=b.waitMsg,y=b.playersMsg,h=b.partialMsg,T=b.resultsMsg,k=b.closeInfo,w=function(){var e=Object(a.useState)(0),t=Object(o.a)(e,2),n=t[0],r=t[1],c=Object(a.useRef)({}),i=function(){return performance.now()-c.current.startTime},s=Object(a.useMemo)((function(){return{startTimer:function(){c.current.startTime=performance.now(),c.current.interval=setInterval((function(){r(i())}),50),r(0)},stopTimer:function(){var e=c.current.interval;if(!e)return!1;clearInterval(e),c.current.interval=null;var t=i();return r(t),t},resetTimer:function(){clearInterval(c.current.interval),c.current.interval=null,r(0)}}}),[c,r]);return Object(l.a)({time:n},s)}(),x=w.time,S=w.startTimer,M=w.stopTimer,_=w.resetTimer,D=Object(a.useState)(),I=Object(o.a)(D,2),R=I[0],A=I[1],P=Object(a.useState)(),L=Object(o.a)(P,2),U=L[0],V=L[1],F={joined:function(e){g(e)},inuse:function(){alert("Nick in use")},wait:function(){j(),_()},ready:function(e){y(p,e)},start:function(){V(!0),k(),_()},virus:function(e){S(),A(e)},miss:function(){_(),A(null)},partial:function(e){M(),A(null),h(e)},results:function(e){_(),A(null),T(e)},disconnected:function(){alert("Disconnected due to inactivity")}};return Object(a.useEffect)((function(){var e=u()(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_SOCKET_URL);e.on("connect",(function(){return c(e)}))}),[c]),function(e,t,n){Object(a.useEffect)((function(){return e&&Object.entries(t).forEach((function(t){var n=Object(o.a)(t,2),a=n[0],r=n[1];e.addEventListener(a,r)})),function(){e&&Object.entries(t).forEach((function(t){var n=Object(o.a)(t,2),a=n[0],r=n[1];e.removeEventListener(a,r)}))}}),[e].concat(Object(m.a)(n)))}(n,F,[p,j,S,y,V,g,k,M,_,h,T,A]),n?p?r.a.createElement(C,{socket:n,info:O,virus:R,setVirus:A,stopTimer:M,time:x,animated:U,setAnimated:V}):r.a.createElement(N,{socket:n}):r.a.createElement(E,null)};i.a.render(r.a.createElement(_,null),document.getElementById("root"))},50:function(e,t,n){e.exports=n(103)},56:function(e,t,n){},86:function(e,t){},89:function(e,t,n){},91:function(e,t,n){},95:function(e,t,n){},96:function(e,t,n){},97:function(e,t,n){var a={"./a.svg":98,"./b.svg":99,"./c.svg":100};function r(e){var t=c(e);return n(t)}function c(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}r.keys=function(){return Object.keys(a)},r.resolve=c,e.exports=r,r.id=97},98:function(e,t,n){e.exports=n.p+"static/media/a.e012df60.svg"},99:function(e,t,n){e.exports=n.p+"static/media/b.0a5e7c1e.svg"}},[[50,1,2]]]);
//# sourceMappingURL=main.c6831efe.chunk.js.map