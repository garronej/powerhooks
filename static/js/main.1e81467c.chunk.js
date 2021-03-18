(this["webpackJsonpwww.powerhooks.dev"]=this["webpackJsonpwww.powerhooks.dev"]||[]).push([[0],{132:function(e,t,r){},287:function(e,t,r){"use strict";r.r(t);var a=r(31),n=r(0),i=r(308),o=r(121);r(132);var s=r(307),c=r(313),l=r(54),d=Object(l.createUseGlobalState)("isDarkModeEnabled",(function(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches}),{persistance:"localStorage"}).useIsDarkModeEnabled,m=r(2);function u(e){var t=e.children,r=d().isDarkModeEnabled,a=Object(n.useMemo)((function(){return function(e){var t=e.isDarkModeEnabled;return{theme:Object(o.a)({typography:{fontFamily:'"Work Sans"'},palette:{type:t?"dark":"light"},custom:{referenceWidth:1920,typeScriptBlue:"#0076C6"}})}}({isDarkModeEnabled:r})}),[r]).theme;return Object(m.jsxs)(s.a,{theme:a,children:[Object(m.jsx)(i.a,{}),Object(m.jsx)(c.b,{injectFirst:!0,children:t})]})}var p=r(58),h=r(314),b=r(311),g=r(15),f=r(309),x=Object(g.createUseClassNamesFactory)({useTheme:f.a}).createUseClassNames,j=r(310),w=r(118),y=r.n(w),O=r(117),k=r.n(O),v=Object(n.memo)((function(){var e=d(),t=e.isDarkModeEnabled,r=e.setIsDarkModeEnabled;return Object(m.jsx)("div",{onClick:Object(l.useConstCallback)((function(){return r(!t)})),children:Object(m.jsx)(j.a,{children:t?Object(m.jsx)(k.a,{}):Object(m.jsx)(y.a,{})})})})),z=function(e){var t=e.size,r=e.repoUrl;return Object(m.jsx)("div",{className:Object(g.css)({"& span":{display:"flex",alignItems:"center"}}),children:Object(m.jsx)("a",{className:"github-button",href:r,"data-color-scheme":"\n                        no-preference: light; \n                        light: light; \n                        dark: light;\n                    ","data-icon":"octicon-star","data-size":"large"===t?"large":"","data-show-count":"true","aria-label":"Star garronej/powerhooks on GitHub",children:"Star"})})},U=r(120),N=r.n(U),E=r(73),C=r(37),H=r(122),I=r(119),M=r(74);var S,B,D,T,L,W=x()((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[1].mobileMenuHeight;return{root:{display:"flex",justifyContent:"flex-end",flexWrap:"wrap",alignItems:"center",padding:20,width:1200,"@media (max-width: 1250px)":{width:"100%"}},logo:{width:50,height:50,marginRight:"auto"},itemWrapper:{"@media (max-width: 530px)":{transition:"height 400ms",order:3,flex:"1 0 100%",textAlign:"left",marginTop:20,height:a,overflow:"hidden",display:"flex",flexDirection:"column"}},link:{color:"white",textTransform:"uppercase",margin:"0 15px 0 15px","@media (max-width:530px)":{margin:"5px 0 5px 0"}},githubAndDarkModeSwitch:{display:"flex",alignItems:"center",marginLeft:20,"& button":{marginLeft:20}},unfold:{order:2,marginLeft:10,display:"none","@media (max-width: 530px)":{display:"flex",alignItems:"center"}}}})).useClassNames,R=function(e){var t=e.items,r=e.Logo,a=e.githubRepoUrl,i=Object(E.useNamedState)("mobileMenuHeight",0),o=i.mobileMenuHeight,s=i.setMobileMenuHeight,c=Object(n.useRef)(null),l=Object(C.useConstCallback)((function(){if(0===o){for(var e=document.getElementsByClassName("menu-item"),t=0,r=0;r<e.length;r++){var a=getComputedStyle(e[r]),n=parseInt(a.marginTop.replace("px","")),i=parseInt(a.marginBottom.replace("px",""));t+=e[r].clientHeight+n+i}s(t)}else s(0)}));!function(e){var t=e.onClickOut,r=e.refs;Object(I.useEvt)((function(e){return M.Evt.from(e,window,"click").attach((function(e){var a,n=Object(H.a)(r);try{for(n.s();!(a=n.n()).done;){var i=a.value;if(!i.current)return;var o=[i.current.offsetHeight,i.current.offsetTop,i.current.offsetWidth,i.current.offsetLeft],s=o[0],c=o[1],l=o[2],d=o[3],m=[e.pageX,e.pageY],u=m[0],p=m[1];if(u>=d&&u<=d+l&&p>=c&&p<=c+s)return}}catch(h){n.e(h)}finally{n.f()}t()}))}),[])}({refs:[c],onClickOut:function(){return s(0)}});var d=W({mobileMenuHeight:o}).classNames;return Object(m.jsxs)(h.a,{className:d.root,component:"nav",children:[Object(m.jsx)(r,{className:d.logo}),Object(m.jsx)("div",{className:d.itemWrapper,children:t.map((function(e){return Object(m.jsx)(b.a,{className:Object(g.cx)(d.link,"menu-item"),href:e.url,children:e.name},JSON.stringify(e.name+e.url))}))}),Object(m.jsx)("div",{ref:c,className:d.unfold,children:Object(m.jsx)(N.a,{onClick:l})}),Object(m.jsxs)("div",{className:d.githubAndDarkModeSwitch,children:[void 0===a?"":Object(m.jsx)(z,{repoUrl:a,size:"large"}),Object(m.jsx)(v,{})]})]})},P=r(289),A=r(312),G=x()((function(e,t){var r=t.background;return{root:{width:"100vw",background:void 0===r?"dark"===e.palette.type?"#05052b":e.custom.typeScriptBlue:"color"===r.type?"dark"===e.palette.type?r.colorOrUrlDark:r.colorOrUrlLight:'\n                    url("'.concat("dark"===e.palette.type?r.colorOrUrlDark:r.colorOrUrlLight,'")\n                '),backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center",display:"flex",flexDirection:"column",alignItems:"center","& img":{width:800,marginBottom:100,opacity:"0.8","@media (max-width: 880px)":{width:"90%"}},textAlign:"center","& h3":{marginTop:50},color:"white"},button:{color:"white",margin:15},buttonWrapper:{marginBottom:50}}})).useClassNames,F=function(e){var t=e.headerImageUrl,r=e.title,a=e.subTitle,n=e.buttons,i=e.background,o=e.topBarProps,s=G({background:i}).classNames;return Object(m.jsxs)("header",{className:s.root,children:[Object(m.jsx)(R,Object(p.a)({},o)),Object(m.jsx)(P.a,{variant:"h3",children:r}),Object(m.jsx)(P.a,{variant:"h5",children:a}),void 0===n?"":Object(m.jsx)("div",{className:s.buttonWrapper,children:n.map((function(e){return Object(m.jsx)(A.a,{variant:"outlined",href:e.linkUrl,className:s.button,children:e.title},JSON.stringify(e.linkUrl+e.title))}))}),void 0===t?"":Object(m.jsx)("img",{src:t,alt:""})]})},J=r.p+"static/media/background-dark.5cfb74e7.jpeg",X=r.p+"static/media/background-light.df268ccc.jpeg";function Y(){return(Y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e}).apply(this,arguments)}function q(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}function K(e,t){var r=e.title,a=e.titleId,i=q(e,["title","titleId"]);return n.createElement("svg",Y({height:"445pt",viewBox:"-25 0 445 445.6",width:"445pt",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",ref:t,"aria-labelledby":a},i),r?n.createElement("title",{id:a},r):null,S||(S=n.createElement("linearGradient",{id:"a"},n.createElement("stop",{offset:0,stopColor:"#00efd1"}),n.createElement("stop",{offset:1,stopColor:"#00acea"}))),B||(B=n.createElement("linearGradient",{id:"b",gradientTransform:"matrix(1 0 0 -1 -58.519327 480.8)",gradientUnits:"userSpaceOnUse",x1:256.03,x2:256.03,xlinkHref:"#a",y1:498,y2:13.191})),D||(D=n.createElement("linearGradient",{id:"c",gradientTransform:"matrix(1 0 0 -1 -58.519327 480.8)",gradientUnits:"userSpaceOnUse",x1:256,x2:256,xlinkHref:"#a",y1:498,y2:13.191})),T||(T=n.createElement("path",{d:"m385.082031 102.800781c-16.601562-26-52.300781-36.800781-100.402343-30.601562-1.699219.199219-3.5.5-5.199219.699219-.699219-1.597657-1.398438-3.199219-2.199219-4.796876-20.699219-43.902343-49-68.101562-79.800781-68.101562s-59.199219 24.199219-79.800781 68.101562c-.699219 1.597657-1.5 3.199219-2.199219 4.796876-1.800781-.296876-3.5-.5-5.199219-.699219-48.199219-6.300781-83.800781 4.601562-100.402344 30.601562-16.597656 26-11.5 62.898438 14.300782 103.898438 3.402343 5.402343 7.101562 10.800781 11.101562 16.101562-4 5.398438-7.699219 10.699219-11.101562 16.097657-25.800782 41-30.898438 78-14.300782 103.902343 13.5 21.199219 39.703125 32.300781 75 32.300781 8.460938-.046874 16.910156-.613281 25.300782-1.703124 1.699218-.199219 3.5-.5 5.199218-.699219.703125 1.601562 1.402344 3.199219 2.203125 4.800781 20.699219 43.898438 49 68.101562 79.796875 68.101562 30.800782 0 59.203125-24.203124 79.800782-68.101562.699218-1.601562 1.5-3.199219 2.199218-4.800781 1.800782.300781 3.5.5 5.203125.699219 8.382813 1.136718 16.835938 1.703124 25.296875 1.703124 35.300782 0 61.5-11.101562 75-32.300781 16.601563-26 11.5-62.902343-14.296875-103.902343-3.402343-5.398438-7.101562-10.796876-11.101562-16.097657 4-5.402343 7.699219-10.699219 11.101562-16.101562 26.097657-41.097657 31.199219-78 14.5-103.898438zm-249.300781-26.199219c16.898438-36 39.398438-56.601562 61.699219-56.601562s44.800781 20.601562 61.699219 56.601562c.011718.074219.046874.144532.101562.199219-21.242188 5.109375-41.960938 12.171875-61.902344 21.097657-19.917968-8.96875-40.644531-16.035157-61.898437-21.097657.199219 0 .199219-.101562.300781-.199219zm151.800781 146.199219c.003907 16-.863281 31.992188-2.601562 47.898438-12.464844 10.058593-25.484375 19.40625-39 28-15.597657 10.015625-31.832031 19.003906-48.601563 26.902343-16.734375-7.960937-32.96875-16.945312-48.597656-26.902343-13.5-8.617188-26.519531-17.964844-39-28-3.46875-31.839844-3.46875-63.960938 0-95.800781 26.953125-21.660157 56.355469-40.085938 87.597656-54.898438 16.738282 7.957031 32.96875 16.941406 48.601563 26.898438 13.5 8.617187 26.519531 17.964843 39 28 1.738281 15.910156 2.605469 31.898437 2.601562 47.902343zm19.097657-29.101562c9.792968 9.121093 19.011718 18.839843 27.601562 29.101562-8.589844 10.257813-17.808594 19.976563-27.601562 29.097657.601562-9.597657.902343-19.296876.902343-29.097657s-.300781-19.5-.902343-29.101562zm-25.800782 105.402343c-3.15625 17.3125-7.738281 34.335938-13.699218 50.898438-15.53125-3.507812-30.773438-8.1875-45.597657-14 11.796875-6.199219 23.597657-13 35.296875-20.398438 8.203125-5.300781 16.203125-10.800781 24-16.5zm-107.5 36.898438c-14.796875 5.886719-30.046875 10.570312-45.597656 14-5.960938-16.5625-10.542969-33.585938-13.699219-50.898438 7.699219 5.699219 15.699219 11.199219 24 16.398438 11.699219 7.5 23.5 14.300781 35.296875 20.5zm-85.097656-84.101562c-9.792969-9.121094-19.007812-18.839844-27.601562-29.097657 8.59375-10.261719 17.808593-19.980469 27.601562-29.101562-.601562 9.601562-.902344 19.300781-.902344 29.101562s.300782 19.5.902344 29.097657zm25.800781-105.398438c3.15625-17.316406 7.738281-34.339844 13.699219-50.898438 15.53125 3.503907 30.777344 8.183594 45.597656 14-11.796875 6.199219-23.597656 13-35.296875 20.398438-8.203125 5.300781-16.203125 10.800781-24 16.5zm142.699219-16.5c-11.601562-7.398438-23.402344-14.300781-35.300781-20.398438 14.796875-5.886718 30.046875-10.570312 45.601562-14 5.957031 16.558594 10.539063 33.582032 13.699219 50.898438-7.699219-5.699219-15.699219-11.199219-24-16.5zm-215.699219 66c-21.203125-33.601562-26.402343-63.699219-14.402343-82.5 9.601562-15 30.402343-23.101562 58.5-23.101562 7.523437.03125 15.039062.535156 22.5 1.5h.199218c-8.089844 23.523437-13.71875 47.820312-16.796875 72.5-15.410156 12.855468-29.757812 26.9375-42.902343 42.101562-2.5-3.398438-4.898438-6.898438-7.097657-10.5zm66.5 157.601562c-7.460937.96875-14.976562 1.46875-22.5 1.5-28.101562 0-48.902343-8-58.5-23.101562-12-18.800781-6.800781-48.898438 14.398438-82.5 2.199219-3.5 4.601562-7.101562 7.101562-10.601562 13.140625 15.167968 27.488281 29.246093 42.898438 42.101562 3.082031 24.683594 8.710937 48.980469 16.800781 72.5 0 .101562-.101562.101562-.199219.101562zm151.597657 15.398438c-16.898438 36-39.398438 56.601562-61.699219 56.601562s-44.800781-20.601562-61.699219-56.601562c-.011719-.074219-.046875-.144531-.101562-.199219 21.242187-5.109375 41.960937-12.171875 61.902343-21.101562 19.917969 8.972656 40.644531 16.039062 61.898438 21.101562-.199219 0-.199219.097657-.300781.199219zm94.699218-119.398438c21.203125 33.597657 26.402344 63.699219 14.402344 82.5-12 18.796876-41.5 26.699219-80.902344 21.5h-.199218c8.089843-23.523437 13.722656-47.820312 16.800781-72.5 15.410156-12.855468 29.757812-26.9375 42.898437-42.101562 2.402344 3.5 4.800782 7 7 10.601562zm-50-85.101562c-3.078125-24.683594-8.707031-48.980469-16.796875-72.5h.199219c39.398438-5.101562 68.898438 2.699219 80.898438 21.5s6.800781 48.898438-14.398438 82.5c-2.199219 3.5-4.601562 7.101562-7.101562 10.601562-13.082032-15.191406-27.398438-29.273437-42.800782-42.101562zm0 0",fill:"url(#b)"})),L||(L=n.createElement("path",{d:"m197.480469 183.199219c-21.871094 0-39.601563 17.730469-39.601563 39.601562 0 21.871094 17.730469 39.597657 39.601563 39.597657 21.871093 0 39.601562-17.726563 39.601562-39.597657-.015625-21.867187-17.738281-39.585937-39.601562-39.601562zm0 59.199219c-10.824219 0-19.601563-8.773438-19.601563-19.597657s8.777344-19.601562 19.601563-19.601562 19.601562 8.777343 19.601562 19.601562c-.019531 10.816407-8.785156 19.582031-19.601562 19.597657zm0 0",fill:"url(#c)"})))}var Q=n.forwardRef(K),V=(r.p,{background:{type:"image",colorOrUrlDark:J,colorOrUrlLight:X},buttons:[{title:"learn more",linkUrl:"https://docs.powerhooks.dev/"},{title:"try it",linkUrl:"https://stackblitz.com/edit/react-ts-jkxthr"}],headerImageUrl:r.p+"static/media/banner.db84d19c.jpeg",title:"powerHooks",subTitle:"Enhance your React experience",topBarProps:{Logo:Q,githubRepoUrl:"https://github.com/garronej/powerhooks",items:[{name:"documentation",url:"https://docs.powerhooks.dev/"},{name:"github",url:"https://github.com/garronej/powerhooks"}]}}),Z=x()((function(){return{root:{padding:"40px 0 40px 0","& article":{display:"flex",justifyContent:"center",alignItems:"center",padding:"40px 0 40px 0","& img":{width:550,margin:"0 40px 0 40px","@media (max-width: 1215px)":{width:"45%"},"@media (max-width: 895px)":{width:"80%"}},"& div":{width:500,margin:"0 40px 0 40px","& h4":{marginBottom:20},"@media (max-width: 895px)":{marginBottom:40,width:"80%"}}}}}})).useClassNames,$=function(e){var t=e.dataBlocks,r=Z({}).classNames;return Object(m.jsx)("section",{className:r.root,children:t.map((function(e,t){return Object(m.jsxs)("article",{className:Object(g.css)({flexDirection:t%2!==0?"row-reverse":"row","@media (max-width: 895px)":{flexDirection:"column"}}),children:[Object(m.jsxs)("div",{children:[Object(m.jsx)(P.a,{variant:"h4",children:e.text.title}),Object(m.jsx)(P.a,{children:e.text.paragraph})]}),Object(m.jsx)("img",{src:e.imageUrl,alt:"source code"})]},e.text.title)}))})},_=[{imageUrl:r.p+"static/media/img1.35fd5f3b.webp",text:{title:"How can we double our sales revenue?",paragraph:"Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources."}},{imageUrl:r.p+"static/media/img2.35fd5f3b.webp",text:{title:"How can I keep track of my sales team?",paragraph:"Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources."}},{imageUrl:r.p+"static/media/img3.35fd5f3b.webp",text:{title:"How can I forecast the next 90 days?",paragraph:"Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources."}}],ee=function(){return Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(F,Object(p.a)({},V)),Object(m.jsx)($,{dataBlocks:_})]})};a.render(Object(m.jsx)(u,{children:Object(m.jsx)(ee,{})}),document.getElementById("root"))}},[[287,1,2]]]);
//# sourceMappingURL=main.1e81467c.chunk.js.map