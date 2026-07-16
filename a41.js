!function(t,e){"object"==typeof exports?module.exports=exports=e():"function"==typeof define&&define.amd?define([],e):t.CryptoJS=e()}(this,function(){var n,o,s,a,h,t,e,l,r,i,c,f,d,u,p,S,x,b,A,H,z,_,v,g,y,B,w,k,m,C,D,E,R,M,F,P,W,O,I,U=U||function(h){var i;if("undefined"!=typeof window&&window.crypto&&(i=window.crypto),"undefined"!=typeof self&&self.crypto&&(i=self.crypto),!(i=!(i=!(i="undefined"!=typeof globalThis&&globalThis.crypto?globalThis.crypto:i)&&"undefined"!=typeof window&&window.msCrypto?window.msCrypto:i)&&"undefined"!=typeof global&&global.crypto?global.crypto:i)&&"function"==typeof require)try{i=require("crypto")}catch(t){}var r=Object.create||function(t){return e.prototype=t,t=new e,e.prototype=null,t};function e(){}var t={},n=t.lib={},o=n.Base={extend:function(t){var e=r(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),(e.init.prototype=e).$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},l=n.WordArray=o.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=r[o>>>2]>>>24-o%4*8&255;e[i+o>>>2]|=s<<24-(i+o)%4*8}else for(var c=0;c<n;c+=4)e[i+c>>>2]=r[c>>>2];return this.sigBytes+=n,this},clamp:function(){var t=this.words,e=this.sigBytes;t[e>>>2]&=4294967295<<32-e%4*8,t.length=h.ceil(e/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],r=0;r<t;r+=4)e.push(function(){if(i){if("function"==typeof i.getRandomValues)try{return i.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof i.randomBytes)try{return i.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")}());return new l.init(e,t)}}),s=t.enc={},c=s.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new l.init(r,e/2)}},a=s.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new l.init(r,e)}},f=s.Utf8={stringify:function(t){try{return decodeURIComponent(escape(a.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return a.parse(unescape(encodeURIComponent(t)))}},d=n.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new l.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(t){var e,r=this._data,i=r.words,n=r.sigBytes,o=this.blockSize,s=n/(4*o),c=(s=t?h.ceil(s):h.max((0|s)-this._minBufferSize,0))*o,n=h.min(4*c,n);if(c){for(var a=0;a<c;a+=o)this._doProcessBlock(i,a);e=i.splice(0,c),r.sigBytes-=n}return new l.init(e,n)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),u=(n.Hasher=d.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){d.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(r){return function(t,e){return new r.init(e).finalize(t)}},_createHmacHelper:function(r){return function(t,e){return new u.HMAC.init(r,e).finalize(t)}}}),t.algo={});return t}(Math);function K(t,e,r){return t&e|~t&r}function X(t,e,r){return t&r|e&~r}function L(t,e){return t<<e|t>>>32-e}function j(t,e,r,i){var n,o=this._iv;o?(n=o.slice(0),this._iv=void 0):n=this._prevBlock,i.encryptBlock(n,0);for(var s=0;s<r;s++)t[e+s]^=n[s]}function T(t){var e,r,i;return 255==(t>>24&255)?(r=t>>8&255,i=255&t,255===(e=t>>16&255)?(e=0,255===r?(r=0,255===i?i=0:++i):++r):++e,t=0,t+=e<<16,t+=r<<8,t+=i):t+=1<<24,t}function N(){for(var t=this._X,e=this._C,r=0;r<8;r++)E[r]=e[r];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<E[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<E[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<E[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<E[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<E[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<E[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<E[6]>>>0?1:0)|0,this._b=e[7]>>>0<E[7]>>>0?1:0;for(r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16;R[r]=((n*n>>>17)+n*o>>>15)+o*o^((4294901760&i)*i|0)+((65535&i)*i|0)}t[0]=R[0]+(R[7]<<16|R[7]>>>16)+(R[6]<<16|R[6]>>>16)|0,t[1]=R[1]+(R[0]<<8|R[0]>>>24)+R[7]|0,t[2]=R[2]+(R[1]<<16|R[1]>>>16)+(R[0]<<16|R[0]>>>16)|0,t[3]=R[3]+(R[2]<<8|R[2]>>>24)+R[1]|0,t[4]=R[4]+(R[3]<<16|R[3]>>>16)+(R[2]<<16|R[2]>>>16)|0,t[5]=R[5]+(R[4]<<8|R[4]>>>24)+R[3]|0,t[6]=R[6]+(R[5]<<16|R[5]>>>16)+(R[4]<<16|R[4]>>>16)|0,t[7]=R[7]+(R[6]<<8|R[6]>>>24)+R[5]|0}function q(){for(var t=this._X,e=this._C,r=0;r<8;r++)O[r]=e[r];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<O[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<O[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<O[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<O[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<O[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<O[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<O[6]>>>0?1:0)|0,this._b=e[7]>>>0<O[7]>>>0?1:0;for(r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16;I[r]=((n*n>>>17)+n*o>>>15)+o*o^((4294901760&i)*i|0)+((65535&i)*i|0)}t[0]=I[0]+(I[7]<<16|I[7]>>>16)+(I[6]<<16|I[6]>>>16)|0,t[1]=I[1]+(I[0]<<8|I[0]>>>24)+I[7]|0,t[2]=I[2]+(I[1]<<16|I[1]>>>16)+(I[0]<<16|I[0]>>>16)|0,t[3]=I[3]+(I[2]<<8|I[2]>>>24)+I[1]|0,t[4]=I[4]+(I[3]<<16|I[3]>>>16)+(I[2]<<16|I[2]>>>16)|0,t[5]=I[5]+(I[4]<<8|I[4]>>>24)+I[3]|0,t[6]=I[6]+(I[5]<<16|I[5]>>>16)+(I[4]<<16|I[4]>>>16)|0,t[7]=I[7]+(I[6]<<8|I[6]>>>24)+I[5]|0}return F=(M=U).lib,n=F.Base,o=F.WordArray,(M=M.x64={}).Word=n.extend({init:function(t,e){this.high=t,this.low=e}}),M.WordArray=n.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,r=[],i=0;i<e;i++){var n=t[i];r.push(n.high),r.push(n.low)}return o.create(r,this.sigBytes)},clone:function(){for(var t=n.clone.call(this),e=t.words=this.words.slice(0),r=e.length,i=0;i<r;i++)e[i]=e[i].clone();return t}}),"function"==typeof ArrayBuffer&&(P=U.lib.WordArray,s=P.init,(P.init=function(t){if((t=(t=t instanceof ArrayBuffer?new Uint8Array(t):t)instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t)instanceof Uint8Array){for(var e=t.byteLength,r=[],i=0;i<e;i++)r[i>>>2]|=t[i]<<24-i%4*8;s.call(this,r,e)}else s.apply(this,arguments)}).prototype=P),function(){var t=U,n=t.lib.WordArray,t=t.enc;t.Utf16=t.Utf16BE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n+=2){var o=e[n>>>2]>>>16-n%4*8&65535;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>1]|=t.charCodeAt(i)<<16-i%2*16;return n.create(r,2*e)}};function s(t){return t<<8&4278255360|t>>>8&16711935}t.Utf16LE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n+=2){var o=s(e[n>>>2]>>>16-n%4*8&65535);i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>1]|=s(t.charCodeAt(i)<<16-i%2*16);return n.create(r,2*e)}}}(),a=(w=U).lib.WordArray,w.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<r;o+=3)for(var s=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255,c=0;c<4&&o+.75*c<r;c++)n.push(i.charAt(s>>>6*(3-c)&63));var a=i.charAt(64);if(a)for(;n.length%4;)n.push(a);return n.join("")},parse:function(t){var e=t.length,r=this._map;if(!(i=this._reverseMap))for(var i=this._reverseMap=[],n=0;n<r.length;n++)i[r.charCodeAt(n)]=n;var o=r.charAt(64);return!o||-1!==(o=t.indexOf(o))&&(e=o),function(t,e,r){for(var i=[],n=0,o=0;o<e;o++){var s,c;o%4&&(s=r[t.charCodeAt(o-1)]<<o%4*2,c=r[t.charCodeAt(o)]>>>6-o%4*2,c=s|c,i[n>>>2]|=c<<24-n%4*8,n++)}return a.create(i,n)}(t,e,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},h=(F=U).lib.WordArray,F.enc.Base64url={stringify:function(t,e){var r=t.words,i=t.sigBytes,n=e?this._safe_map:this._map;t.clamp();for(var o=[],s=0;s<i;s+=3)for(var c=(r[s>>>2]>>>24-s%4*8&255)<<16|(r[s+1>>>2]>>>24-(s+1)%4*8&255)<<8|r[s+2>>>2]>>>24-(s+2)%4*8&255,a=0;a<4&&s+.75*a<i;a++)o.push(n.charAt(c>>>6*(3-a)&63));var h=n.charAt(64);if(h)for(;o.length%4;)o.push(h);return o.join("")},parse:function(t,e){var r=t.length,i=e?this._safe_map:this._map;if(!(n=this._reverseMap))for(var n=this._reverseMap=[],o=0;o<i.length;o++)n[i.charCodeAt(o)]=o;e=i.charAt(64);return!e||-1!==(e=t.indexOf(e))&&(r=e),function(t,e,r){for(var i=[],n=0,o=0;o<e;o++){var s,c;o%4&&(s=r[t.charCodeAt(o-1)]<<o%4*2,c=r[t.charCodeAt(o)]>>>6-o%4*2,c=s|c,i[n>>>2]|=c<<24-n%4*8,n++)}return h.create(i,n)}(t,r,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_safe_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"},function(a){var t=U,e=t.lib,r=e.WordArray,i=e.Hasher,e=t.algo,A=[];!function(){for(var t=0;t<64;t++)A[t]=4294967296*a.abs(a.sin(t+1))|0}();e=e.MD5=i.extend({_doReset:function(){this._hash=new r.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var o=this._hash.words,s=t[e+0],c=t[e+1],a=t[e+2],h=t[e+3],l=t[e+4],f=t[e+5],d=t[e+6],u=t[e+7],p=t[e+8],_=t[e+9],y=t[e+10],v=t[e+11],g=t[e+12],B=t[e+13],w=t[e+14],k=t[e+15],m=H(m=o[0],b=o[1],x=o[2],S=o[3],s,7,A[0]),S=H(S,m,b,x,c,12,A[1]),x=H(x,S,m,b,a,17,A[2]),b=H(b,x,S,m,h,22,A[3]);m=H(m,b,x,S,l,7,A[4]),S=H(S,m,b,x,f,12,A[5]),x=H(x,S,m,b,d,17,A[6]),b=H(b,x,S,m,u,22,A[7]),m=H(m,b,x,S,p,7,A[8]),S=H(S,m,b,x,_,12,A[9]),x=H(x,S,m,b,y,17,A[10]),b=H(b,x,S,m,v,22,A[11]),m=H(m,b,x,S,g,7,A[12]),S=H(S,m,b,x,B,12,A[13]),x=H(x,S,m,b,w,17,A[14]),m=z(m,b=H(b,x,S,m,k,22,A[15]),x,S,c,5,A[16]),S=z(S,m,b,x,d,9,A[17]),x=z(x,S,m,b,v,14,A[18]),b=z(b,x,S,m,s,20,A[19]),m=z(m,b,x,S,f,5,A[20]),S=z(S,m,b,x,y,9,A[21]),x=z(x,S,m,b,k,14,A[22]),b=z(b,x,S,m,l,20,A[23]),m=z(m,b,x,S,_,5,A[24]),S=z(S,m,b,x,w,9,A[25]),x=z(x,S,m,b,h,14,A[26]),b=z(b,x,S,m,p,20,A[27]),m=z(m,b,x,S,B,5,A[28]),S=z(S,m,b,x,a,9,A[29]),x=z(x,S,m,b,u,14,A[30]),m=C(m,b=z(b,x,S,m,g,20,A[31]),x,S,f,4,A[32]),S=C(S,m,b,x,p,11,A[33]),x=C(x,S,m,b,v,16,A[34]),b=C(b,x,S,m,w,23,A[35]),m=C(m,b,x,S,c,4,A[36]),S=C(S,m,b,x,l,11,A[37]),x=C(x,S,m,b,u,16,A[38]),b=C(b,x,S,m,y,23,A[39]),m=C(m,b,x,S,B,4,A[40]),S=C(S,m,b,x,s,11,A[41]),x=C(x,S,m,b,h,16,A[42]),b=C(b,x,S,m,d,23,A[43]),m=C(m,b,x,S,_,4,A[44]),S=C(S,m,b,x,g,11,A[45]),x=C(x,S,m,b,k,16,A[46]),m=D(m,b=C(b,x,S,m,a,23,A[47]),x,S,s,6,A[48]),S=D(S,m,b,x,u,10,A[49]),x=D(x,S,m,b,w,15,A[50]),b=D(b,x,S,m,f,21,A[51]),m=D(m,b,x,S,g,6,A[52]),S=D(S,m,b,x,h,10,A[53]),x=D(x,S,m,b,y,15,A[54]),b=D(b,x,S,m,c,21,A[55]),m=D(m,b,x,S,p,6,A[56]),S=D(S,m,b,x,k,10,A[57]),x=D(x,S,m,b,d,15,A[58]),b=D(b,x,S,m,B,21,A[59]),m=D(m,b,x,S,l,6,A[60]),S=D(S,m,b,x,v,10,A[61]),x=D(x,S,m,b,a,15,A[62]),b=D(b,x,S,m,_,21,A[63]),o[0]=o[0]+m|0,o[1]=o[1]+b|0,o[2]=o[2]+x|0,o[3]=o[3]+S|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;e[i>>>5]|=128<<24-i%32;var n=a.floor(r/4294967296),r=r;e[15+(64+i>>>9<<4)]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process();for(var e=this._hash,o=e.words,s=0;s<4;s++){var c=o[s];o[s]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}return e},clone:function(){var t=i.clone.call(this);return t._hash=this._hash.clone(),t}});function H(t,e,r,i,n,o,s){s=t+(e&r|~e&i)+n+s;return(s<<o|s>>>32-o)+e}function z(t,e,r,i,n,o,s){s=t+(e&i|r&~i)+n+s;return(s<<o|s>>>32-o)+e}function C(t,e,r,i,n,o,s){s=t+(e^r^i)+n+s;return(s<<o|s>>>32-o)+e}function D(t,e,r,i,n,o,s){s=t+(r^(e|~i))+n+s;return(s<<o|s>>>32-o)+e}t.MD5=i._createHelper(e),t.HmacMD5=i._createHmacHelper(e)}(Math),P=(M=U).lib,t=P.WordArray,e=P.Hasher,P=M.algo,l=[],P=P.SHA1=e.extend({_doReset:function(){this._hash=new t.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],c=r[4],a=0;a<80;a++){a<16?l[a]=0|t[e+a]:(h=l[a-3]^l[a-8]^l[a-14]^l[a-16],l[a]=h<<1|h>>>31);var h=(i<<5|i>>>27)+c+l[a];h+=a<20?1518500249+(n&o|~n&s):a<40?1859775393+(n^o^s):a<60?(n&o|n&s|o&s)-1894007588:(n^o^s)-899497514,c=s,s=o,o=n<<30|n>>>2,n=i,i=h}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+s|0,r[4]=r[4]+c|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=Math.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=e.clone.call(this);return t._hash=this._hash.clone(),t}}),M.SHA1=e._createHelper(P),M.HmacSHA1=e._createHmacHelper(P),function(n){var t=U,e=t.lib,r=e.WordArray,i=e.Hasher,e=t.algo,o=[],p=[];!function(){function t(t){return 4294967296*(t-(0|t))|0}for(var e=2,r=0;r<64;)!function(t){for(var e=n.sqrt(t),r=2;r<=e;r++)if(!(t%r))return;return 1}(e)||(r<8&&(o[r]=t(n.pow(e,.5))),p[r]=t(n.pow(e,1/3)),r++),e++}();var _=[],e=e.SHA256=i.extend({_doReset:function(){this._hash=new r.init(o.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],c=r[4],a=r[5],h=r[6],l=r[7],f=0;f<64;f++){f<16?_[f]=0|t[e+f]:(d=_[f-15],u=_[f-2],_[f]=((d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3)+_[f-7]+((u<<15|u>>>17)^(u<<13|u>>>19)^u>>>10)+_[f-16]);var d=i&n^i&o^n&o,u=l+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&a^~c&h)+p[f]+_[f],l=h,h=a,a=c,c=s+u|0,s=o,o=n,n=i,i=u+(((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+d)|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+s|0,r[4]=r[4]+c|0,r[5]=r[5]+a|0,r[6]=r[6]+h|0,r[7]=r[7]+l|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=n.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=i.clone.call(this);return t._hash=this._hash.clone(),t}});t.SHA256=i._createHelper(e),t.HmacSHA256=i._createHmacHelper(e)}(Math),r=(w=U).lib.WordArray,F=w.algo,i=F.SHA256,F=F.SHA224=i.extend({_doReset:function(){this._hash=new r.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=i._doFinalize.call(this);return t.sigBytes-=4,t}}),w.SHA224=i._createHelper(F),w.HmacSHA224=i._createHmacHelper(F),function(){var t=U,e=t.lib.Hasher,r=t.x64,i=r.Word,n=r.WordArray,r=t.algo;function o(){return i.create.apply(i,arguments)}var t1=[o(1116352408,3609767458),o(1899447441,602891725),o(3049323471,3964484399),o(3921009573,2173295548),o(961987163,4081628472),o(1508970993,3053834265),o(2453635748,2937671579),o(2870763221,3664609560),o(3624381080,2734883394),o(310598401,1164996542),o(607225278,1323610764),o(1426881987,3590304994),o(1925078388,4068182383),o(2162078206,991336113),o(2614888103,633803317),o(3248222580,3479774868),o(3835390401,2666613458),o(4022224774,944711139),o(264347078,2341262773),o(604807628,2007800933),o(770255983,1495990901),o(1249150122,1856431235),o(1555081692,3175218132),o(1996064986,2198950837),o(2554220882,3999719339),o(2821834349,766784016),o(2952996808,2566594879),o(3210313671,3203337956),o(3336571891,1034457026),o(3584528711,2466948901),o(113926993,3758326383),o(338241895,168717936),o(666307205,1188179964),o(773529912,1546045734),o(1294757372,1522805485),o(1396182291,2643833823),o(1695183700,2343527390),o(1986661051,1014477480),o(2177026350,1206759142),o(2456956037,344077627),o(2730485921,1290863460),o(2820302411,3158454273),o(3259730800,3505952657),o(3345764771,106217008),o(3516065817,3606008344),o(3600352804,1432725776),o(4094571909,1467031594),o(275423344,851169720),o(430227734,3100823752),o(506948616,1363258195),o(659060556,3750685593),o(883997877,3785050280),o(958139571,3318307427),o(1322822218,3812723403),o(1537002063,2003034995),o(1747873779,3602036899),o(1955562222,1575990012),o(2024104815,1125592928),o(2227730452,2716904306),o(2361852424,442776044),o(2428436474,593698344),o(2756734187,3733110249),o(3204031479,2999351573),o(3329325298,3815920427),o(3391569614,3928383900),o(3515267271,566280711),o(3940187606,3454069534),o(4118630271,4000239992),o(116418474,1914138554),o(174292421,2731055270),o(289380356,3203993006),o(460393269,320620315),o(685471733,587496836),o(852142971,1086792851),o(1017036298,365543100),o(1126000580,2618297676),o(1288033470,3409855158),o(1501505948,4234509866),o(1607167915,987167468),o(1816402316,1246189591)],e1=[];!function(){for(var t=0;t<80;t++)e1[t]=o()}();r=r.SHA512=e.extend({_doReset:function(){this._hash=new n.init([new i.init(1779033703,4089235720),new i.init(3144134277,2227873595),new i.init(1013904242,4271175723),new i.init(2773480762,1595750129),new i.init(1359893119,2917565137),new i.init(2600822924,725511199),new i.init(528734635,4215389547),new i.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],c=r[4],a=r[5],h=r[6],l=r[7],f=i.high,d=i.low,u=n.high,p=n.low,_=o.high,y=o.low,v=s.high,g=s.low,B=c.high,w=c.low,k=a.high,m=a.low,S=h.high,x=h.low,b=l.high,r=l.low,A=f,H=d,z=u,C=p,D=_,E=y,R=v,M=g,F=B,P=w,W=k,O=m,I=S,U=x,K=b,X=r,L=0;L<80;L++){var j,T,N=e1[L];L<16?(T=N.high=0|t[e+2*L],j=N.low=0|t[e+2*L+1]):($=(q=e1[L-15]).high,J=q.low,G=(Q=e1[L-2]).high,V=Q.low,Z=(Y=e1[L-7]).high,q=Y.low,Y=(Q=e1[L-16]).high,T=(T=(($>>>1|J<<31)^($>>>8|J<<24)^$>>>7)+Z+((j=(Z=(J>>>1|$<<31)^(J>>>8|$<<24)^(J>>>7|$<<25))+q)>>>0<Z>>>0?1:0))+((G>>>19|V<<13)^(G<<3|V>>>29)^G>>>6)+((j+=J=(V>>>19|G<<13)^(V<<3|G>>>29)^(V>>>6|G<<26))>>>0<J>>>0?1:0),j+=$=Q.low,N.high=T=T+Y+(j>>>0<$>>>0?1:0),N.low=j);var q=F&W^~F&I,Z=P&O^~P&U,V=A&z^A&D^z&D,G=(H>>>28|A<<4)^(H<<30|A>>>2)^(H<<25|A>>>7),J=t1[L],Q=J.high,Y=J.low,$=X+((P>>>14|F<<18)^(P>>>18|F<<14)^(P<<23|F>>>9)),N=K+((F>>>14|P<<18)^(F>>>18|P<<14)^(F<<23|P>>>9))+($>>>0<X>>>0?1:0),J=G+(H&C^H&E^C&E),K=I,X=U,I=W,U=O,W=F,O=P,F=R+(N=(N=(N=N+q+(($=$+Z)>>>0<Z>>>0?1:0))+Q+(($=$+Y)>>>0<Y>>>0?1:0))+T+(($=$+j)>>>0<j>>>0?1:0))+((P=M+$|0)>>>0<M>>>0?1:0)|0,R=D,M=E,D=z,E=C,z=A,C=H,A=N+(((A>>>28|H<<4)^(A<<30|H>>>2)^(A<<25|H>>>7))+V+(J>>>0<G>>>0?1:0))+((H=$+J|0)>>>0<$>>>0?1:0)|0}d=i.low=d+H,i.high=f+A+(d>>>0<H>>>0?1:0),p=n.low=p+C,n.high=u+z+(p>>>0<C>>>0?1:0),y=o.low=y+E,o.high=_+D+(y>>>0<E>>>0?1:0),g=s.low=g+M,s.high=v+R+(g>>>0<M>>>0?1:0),w=c.low=w+P,c.high=B+F+(w>>>0<P>>>0?1:0),m=a.low=m+O,a.high=k+W+(m>>>0<O>>>0?1:0),x=h.low=x+U,h.high=S+I+(x>>>0<U>>>0?1:0),r=l.low=r+X,l.high=b+K+(r>>>0<X>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[30+(128+i>>>10<<5)]=Math.floor(r/4294967296),e[31+(128+i>>>10<<5)]=r,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=e.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32});t.SHA512=e._createHelper(r),t.HmacSHA512=e._createHmacHelper(r)}(),P=(M=U).x64,c=P.Word,f=P.WordArray,P=M.algo,d=P.SHA512,P=P.SHA384=d.extend({_doReset:function(){this._hash=new f.init([new c.init(3418070365,3238371032),new c.init(1654270250,914150663),new c.init(2438529370,812702999),new c.init(355462360,4144912697),new c.init(1731405415,4290775857),new c.init(2394180231,1750603025),new c.init(3675008525,1694076839),new c.init(1203062813,3204075428)])},_doFinalize:function(){var t=d._doFinalize.call(this);return t.sigBytes-=16,t}}),M.SHA384=d._createHelper(P),M.HmacSHA384=d._createHmacHelper(P),function(l){var t=U,e=t.lib,f=e.WordArray,i=e.Hasher,d=t.x64.Word,e=t.algo,A=[],H=[],z=[];!function(){for(var t=1,e=0,r=0;r<24;r++){A[t+5*e]=(r+1)*(r+2)/2%64;var i=(2*t+3*e)%5;t=e%5,e=i}for(t=0;t<5;t++)for(e=0;e<5;e++)H[t+5*e]=e+(2*t+3*e)%5*5;for(var n=1,o=0;o<24;o++){for(var s,c=0,a=0,h=0;h<7;h++)1&n&&((s=(1<<h)-1)<32?a^=1<<s:c^=1<<s-32),128&n?n=n<<1^113:n<<=1;z[o]=d.create(c,a)}}();var C=[];!function(){for(var t=0;t<25;t++)C[t]=d.create()}();e=e.SHA3=i.extend({cfg:i.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],e=0;e<25;e++)t[e]=new d.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,e){for(var r=this._state,i=this.blockSize/2,n=0;n<i;n++){var o=t[e+2*n],s=t[e+2*n+1],o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8);(m=r[n]).high^=s=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),m.low^=o}for(var c=0;c<24;c++){for(var a=0;a<5;a++){for(var h=0,l=0,f=0;f<5;f++)h^=(m=r[a+5*f]).high,l^=m.low;var d=C[a];d.high=h,d.low=l}for(a=0;a<5;a++)for(var u=C[(a+4)%5],p=C[(a+1)%5],_=p.high,p=p.low,h=u.high^(_<<1|p>>>31),l=u.low^(p<<1|_>>>31),f=0;f<5;f++)(m=r[a+5*f]).high^=h,m.low^=l;for(var y=1;y<25;y++){var v=(m=r[y]).high,g=m.low,B=A[y];l=B<32?(h=v<<B|g>>>32-B,g<<B|v>>>32-B):(h=g<<B-32|v>>>64-B,v<<B-32|g>>>64-B);B=C[H[y]];B.high=h,B.low=l}var w=C[0],k=r[0];w.high=k.high,w.low=k.low;for(a=0;a<5;a++)for(f=0;f<5;f++){var m=r[y=a+5*f],S=C[y],x=C[(a+1)%5+5*f],b=C[(a+2)%5+5*f];m.high=S.high^~x.high&b.high,m.low=S.low^~x.low&b.low}m=r[0],k=z[c];m.high^=k.high,m.low^=k.low}},_doFinalize:function(){var t=this._data,e=t.words,r=(this._nDataBytes,8*t.sigBytes),i=32*this.blockSize;e[r>>>5]|=1<<24-r%32,e[(l.ceil((1+r)/i)*i>>>5)-1]|=128,t.sigBytes=4*e.length,this._process();for(var n=this._state,e=this.cfg.outputLength/8,o=e/8,s=[],c=0;c<o;c++){var a=n[c],h=a.high,a=a.low,h=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8);s.push(a=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8)),s.push(h)}return new f.init(s,e)},clone:function(){for(var t=i.clone.call(this),e=t._state=this._state.slice(0),r=0;r<25;r++)e[r]=e[r].clone();return t}});t.SHA3=i._createHelper(e),t.HmacSHA3=i._createHmacHelper(e)}(Math),Math,F=(w=U).lib,u=F.WordArray,p=F.Hasher,F=w.algo,S=u.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),x=u.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),b=u.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),A=u.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),H=u.create([0,1518500249,1859775393,2400959708,2840853838]),z=u.create([1352829926,1548603684,1836072691,2053994217,0]),F=F.RIPEMD160=p.extend({_doReset:function(){this._hash=u.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}for(var o,s,c,a,h,l,f=this._hash.words,d=H.words,u=z.words,p=S.words,_=x.words,y=b.words,v=A.words,g=o=f[0],B=s=f[1],w=c=f[2],k=a=f[3],m=h=f[4],r=0;r<80;r+=1)l=o+t[e+p[r]]|0,l+=r<16?(s^c^a)+d[0]:r<32?K(s,c,a)+d[1]:r<48?((s|~c)^a)+d[2]:r<64?X(s,c,a)+d[3]:(s^(c|~a))+d[4],l=(l=L(l|=0,y[r]))+h|0,o=h,h=a,a=L(c,10),c=s,s=l,l=g+t[e+_[r]]|0,l+=r<16?(B^(w|~k))+u[0]:r<32?X(B,w,k)+u[1]:r<48?((B|~w)^k)+u[2]:r<64?K(B,w,k)+u[3]:(B^w^k)+u[4],l=(l=L(l|=0,v[r]))+m|0,g=m,m=k,k=L(w,10),w=B,B=l;l=f[1]+c+k|0,f[1]=f[2]+a+m|0,f[2]=f[3]+h+g|0,f[3]=f[4]+o+B|0,f[4]=f[0]+s+w|0,f[0]=l},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process();for(var e=this._hash,n=e.words,o=0;o<5;o++){var s=n[o];n[o]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8)}return e},clone:function(){var t=p.clone.call(this);return t._hash=this._hash.clone(),t}}),w.RIPEMD160=p._createHelper(F),w.HmacRIPEMD160=p._createHmacHelper(F),P=(M=U).lib.Base,_=M.enc.Utf8,M.algo.HMAC=P.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=_.parse(e));var r=t.blockSize,i=4*r;(e=e.sigBytes>i?t.finalize(e):e).clamp();for(var t=this._oKey=e.clone(),e=this._iKey=e.clone(),n=t.words,o=e.words,s=0;s<r;s++)n[s]^=1549556828,o[s]^=909522486;t.sigBytes=e.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,t=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(t))}}),F=(w=U).lib,M=F.Base,v=F.WordArray,P=w.algo,F=P.SHA1,g=P.HMAC,y=P.PBKDF2=M.extend({cfg:M.extend({keySize:4,hasher:F,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,i=g.create(r.hasher,t),n=v.create(),o=v.create([1]),s=n.words,c=o.words,a=r.keySize,h=r.iterations;s.length<a;){var l=i.update(e).finalize(o);i.reset();for(var f=l.words,d=f.length,u=l,p=1;p<h;p++){u=i.finalize(u),i.reset();for(var _=u.words,y=0;y<d;y++)f[y]^=_[y]}n.concat(l),c[0]++}return n.sigBytes=4*a,n}}),w.PBKDF2=function(t,e,r){return y.create(r).compute(t,e)},M=(P=U).lib,F=M.Base,B=M.WordArray,w=P.algo,M=w.MD5,k=w.EvpKDF=F.extend({cfg:F.extend({keySize:4,hasher:M,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r,i=this.cfg,n=i.hasher.create(),o=B.create(),s=o.words,c=i.keySize,a=i.iterations;s.length<c;){r&&n.update(r),r=n.update(t).finalize(e),n.reset();for(var h=1;h<a;h++)r=n.finalize(r),n.reset();o.concat(r)}return o.sigBytes=4*c,o}}),P.EvpKDF=function(t,e,r){return k.create(r).compute(t,e)},U.lib.Cipher||function(){var t=U,e=t.lib,r=e.Base,s=e.WordArray,i=e.BufferedBlockAlgorithm,n=t.enc,o=(n.Utf8,n.Base64),c=t.algo.EvpKDF,a=e.Cipher=i.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){i.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(i){return{encrypt:function(t,e,r){return h(e).encrypt(i,t,e,r)},decrypt:function(t,e,r){return h(e).decrypt(i,t,e,r)}}}});function h(t){return"string"==typeof t?p:u}e.StreamCipher=a.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var l=t.mode={},n=e.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),n=l.CBC=((l=n.extend()).Encryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;f.call(this,t,e,i),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),l.Decryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);r.decryptBlock(t,e),f.call(this,t,e,i),this._prevBlock=n}}),l);function f(t,e,r){var i,n=this._iv;n?(i=n,this._iv=void 0):i=this._prevBlock;for(var o=0;o<r;o++)t[e+o]^=i[o]}var l=(t.pad={}).Pkcs7={pad:function(t,e){for(var e=4*e,r=e-t.sigBytes%e,i=r<<24|r<<16|r<<8|r,n=[],o=0;o<r;o+=4)n.push(i);e=s.create(n,r);t.concat(e)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},d=(e.BlockCipher=a.extend({cfg:a.cfg.extend({mode:n,padding:l}),reset:function(){var t;a.reset.call(this);var e=this.cfg,r=e.iv,e=e.mode;this._xformMode==this._ENC_XFORM_MODE?t=e.createEncryptor:(t=e.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,r&&r.words):(this._mode=t.call(e,this,r&&r.words),this._mode.__creator=t)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t,e=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(e.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),e.unpad(t)),t},blockSize:4}),e.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),l=(t.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext,t=t.salt,e=t?s.create([1398893684,1701076831]).concat(t).concat(e):e;return e.toString(o)},parse:function(t){var e,r=o.parse(t),t=r.words;return 1398893684==t[0]&&1701076831==t[1]&&(e=s.create(t.slice(2,4)),t.splice(0,4),r.sigBytes-=16),d.create({ciphertext:r,salt:e})}},u=e.SerializableCipher=r.extend({cfg:r.extend({format:l}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=t.createEncryptor(r,i),e=n.finalize(e),n=n.cfg;return d.create({ciphertext:e,key:r,iv:n.iv,algorithm:t,mode:n.mode,padding:n.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),t.createDecryptor(r,i).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),t=(t.kdf={}).OpenSSL={execute:function(t,e,r,i){i=i||s.random(8);t=c.create({keySize:e+r}).compute(t,i),r=s.create(t.words.slice(e),4*r);return t.sigBytes=4*e,d.create({key:t,iv:r,salt:i})}},p=e.PasswordBasedCipher=u.extend({cfg:u.cfg.extend({kdf:t}),encrypt:function(t,e,r,i){r=(i=this.cfg.extend(i)).kdf.execute(r,t.keySize,t.ivSize);i.iv=r.iv;i=u.encrypt.call(this,t,e,r.key,i);return i.mixIn(r),i},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);r=i.kdf.execute(r,t.keySize,t.ivSize,e.salt);return i.iv=r.iv,u.decrypt.call(this,t,e,r.key,i)}})}(),U.mode.CFB=((F=U.lib.BlockCipherMode.extend()).Encryptor=F.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;j.call(this,t,e,i,r),this._prevBlock=t.slice(e,e+i)}}),F.Decryptor=F.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);j.call(this,t,e,i,r),this._prevBlock=n}}),F),U.mode.CTR=(M=U.lib.BlockCipherMode.extend(),P=M.Encryptor=M.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0);var s=o.slice(0);r.encryptBlock(s,0),o[i-1]=o[i-1]+1|0;for(var c=0;c<i;c++)t[e+c]^=s[c]}}),M.Decryptor=P,M),U.mode.CTRGladman=(F=U.lib.BlockCipherMode.extend(),P=F.Encryptor=F.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0),0===((n=o)[0]=T(n[0]))&&(n[1]=T(n[1]));var s=o.slice(0);r.encryptBlock(s,0);for(var c=0;c<i;c++)t[e+c]^=s[c]}}),F.Decryptor=P,F),U.mode.OFB=(M=U.lib.BlockCipherMode.extend(),P=M.Encryptor=M.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._keystream;n&&(o=this._keystream=n.slice(0),this._iv=void 0),r.encryptBlock(o,0);for(var s=0;s<i;s++)t[e+s]^=o[s]}}),M.Decryptor=P,M),U.mode.ECB=((F=U.lib.BlockCipherMode.extend()).Encryptor=F.extend({processBlock:function(t,e){this._cipher.encryptBlock(t,e)}}),F.Decryptor=F.extend({processBlock:function(t,e){this._cipher.decryptBlock(t,e)}}),F),U.pad.AnsiX923={pad:function(t,e){var r=t.sigBytes,e=4*e,e=e-r%e,r=r+e-1;t.clamp(),t.words[r>>>2]|=e<<24-r%4*8,t.sigBytes+=e},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},U.pad.Iso10126={pad:function(t,e){e*=4,e-=t.sigBytes%e;t.concat(U.lib.WordArray.random(e-1)).concat(U.lib.WordArray.create([e<<24],1))},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},U.pad.Iso97971={pad:function(t,e){t.concat(U.lib.WordArray.create([2147483648],1)),U.pad.ZeroPadding.pad(t,e)},unpad:function(t){U.pad.ZeroPadding.unpad(t),t.sigBytes--}},U.pad.ZeroPadding={pad:function(t,e){e*=4;t.clamp(),t.sigBytes+=e-(t.sigBytes%e||e)},unpad:function(t){for(var e=t.words,r=t.sigBytes-1,r=t.sigBytes-1;0<=r;r--)if(e[r>>>2]>>>24-r%4*8&255){t.sigBytes=r+1;break}}},U.pad.NoPadding={pad:function(){},unpad:function(){}},m=(P=U).lib.CipherParams,C=P.enc.Hex,P.format.Hex={stringify:function(t){return t.ciphertext.toString(C)},parse:function(t){t=C.parse(t);return m.create({ciphertext:t})}},function(){var t=U,e=t.lib.BlockCipher,r=t.algo,h=[],l=[],f=[],d=[],u=[],p=[],_=[],y=[],v=[],g=[];!function(){for(var t=[],e=0;e<256;e++)t[e]=e<128?e<<1:e<<1^283;for(var r=0,i=0,e=0;e<256;e++){var n=i^i<<1^i<<2^i<<3^i<<4;h[r]=n=n>>>8^255&n^99;var o=t[l[n]=r],s=t[o],c=t[s],a=257*t[n]^16843008*n;f[r]=a<<24|a>>>8,d[r]=a<<16|a>>>16,u[r]=a<<8|a>>>24,p[r]=a,_[n]=(a=16843009*c^65537*s^257*o^16843008*r)<<24|a>>>8,y[n]=a<<16|a>>>16,v[n]=a<<8|a>>>24,g[n]=a,r?(r=o^t[t[t[c^o]]],i^=t[t[i]]):r=i=1}}();var B=[0,1,2,4,8,16,32,64,128,27,54],r=r.AES=e.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,i=4*(1+(this._nRounds=6+r)),n=this._keySchedule=[],o=0;o<i;o++)o<r?n[o]=e[o]:(a=n[o-1],o%r?6<r&&o%r==4&&(a=h[a>>>24]<<24|h[a>>>16&255]<<16|h[a>>>8&255]<<8|h[255&a]):(a=h[(a=a<<8|a>>>24)>>>24]<<24|h[a>>>16&255]<<16|h[a>>>8&255]<<8|h[255&a],a^=B[o/r|0]<<24),n[o]=n[o-r]^a);for(var s=this._invKeySchedule=[],c=0;c<i;c++){var a,o=i-c;a=c%4?n[o]:n[o-4],s[c]=c<4||o<=4?a:_[h[a>>>24]]^y[h[a>>>16&255]]^v[h[a>>>8&255]]^g[h[255&a]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,f,d,u,p,h)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,_,y,v,g,l);r=t[e+1];t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,n,o,s,c){for(var a=this._nRounds,h=t[e]^r[0],l=t[e+1]^r[1],f=t[e+2]^r[2],d=t[e+3]^r[3],u=4,p=1;p<a;p++)var _=i[h>>>24]^n[l>>>16&255]^o[f>>>8&255]^s[255&d]^r[u++],y=i[l>>>24]^n[f>>>16&255]^o[d>>>8&255]^s[255&h]^r[u++],v=i[f>>>24]^n[d>>>16&255]^o[h>>>8&255]^s[255&l]^r[u++],g=i[d>>>24]^n[h>>>16&255]^o[l>>>8&255]^s[255&f]^r[u++],h=_,l=y,f=v,d=g;_=(c[h>>>24]<<24|c[l>>>16&255]<<16|c[f>>>8&255]<<8|c[255&d])^r[u++],y=(c[l>>>24]<<24|c[f>>>16&255]<<16|c[d>>>8&255]<<8|c[255&h])^r[u++],v=(c[f>>>24]<<24|c[d>>>16&255]<<16|c[h>>>8&255]<<8|c[255&l])^r[u++],g=(c[d>>>24]<<24|c[h>>>16&255]<<16|c[l>>>8&255]<<8|c[255&f])^r[u++];t[e]=_,t[e+1]=y,t[e+2]=v,t[e+3]=g},keySize:8});t.AES=e._createHelper(r)}(),function(){var t=U,e=t.lib,i=e.WordArray,r=e.BlockCipher,e=t.algo,h=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],l=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],f=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],d=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],u=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],n=e.DES=r.extend({_doReset:function(){for(var t=this._key.words,e=[],r=0;r<56;r++){var i=h[r]-1;e[r]=t[i>>>5]>>>31-i%32&1}for(var n=this._subKeys=[],o=0;o<16;o++){for(var s=n[o]=[],c=f[o],r=0;r<24;r++)s[r/6|0]|=e[(l[r]-1+c)%28]<<31-r%6,s[4+(r/6|0)]|=e[28+(l[r+24]-1+c)%28]<<31-r%6;s[0]=s[0]<<1|s[0]>>>31;for(r=1;r<7;r++)s[r]=s[r]>>>4*(r-1)+3;s[7]=s[7]<<5|s[7]>>>27}for(var a=this._invSubKeys=[],r=0;r<16;r++)a[r]=n[15-r]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(t,e,r){this._lBlock=t[e],this._rBlock=t[e+1],p.call(this,4,252645135),p.call(this,16,65535),_.call(this,2,858993459),_.call(this,8,16711935),p.call(this,1,1431655765);for(var i=0;i<16;i++){for(var n=r[i],o=this._lBlock,s=this._rBlock,c=0,a=0;a<8;a++)c|=d[a][((s^n[a])&u[a])>>>0];this._lBlock=s,this._rBlock=o^c}var h=this._lBlock;this._lBlock=this._rBlock,this._rBlock=h,p.call(this,1,1431655765),_.call(this,8,16711935),_.call(this,2,858993459),p.call(this,16,65535),p.call(this,4,252645135),t[e]=this._lBlock,t[e+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});function p(t,e){e=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=e,this._lBlock^=e<<t}function _(t,e){e=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=e,this._rBlock^=e<<t}t.DES=r._createHelper(n);e=e.TripleDES=r.extend({_doReset:function(){var t=this._key.words;if(2!==t.length&&4!==t.length&&t.length<6)throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");var e=t.slice(0,2),r=t.length<4?t.slice(0,2):t.slice(2,4),t=t.length<6?t.slice(0,2):t.slice(4,6);this._des1=n.createEncryptor(i.create(e)),this._des2=n.createEncryptor(i.create(r)),this._des3=n.createEncryptor(i.create(t))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2});t.TripleDES=r._createHelper(e)}(),function(){var t=U,e=t.lib.StreamCipher,r=t.algo,i=r.RC4=e.extend({_doReset:function(){for(var t=this._key,e=t.words,r=t.sigBytes,i=this._S=[],n=0;n<256;n++)i[n]=n;for(var n=0,o=0;n<256;n++){var s=n%r,s=e[s>>>2]>>>24-s%4*8&255,o=(o+i[n]+s)%256,s=i[n];i[n]=i[o],i[o]=s}this._i=this._j=0},_doProcessBlock:function(t,e){t[e]^=n.call(this)},keySize:8,ivSize:0});function n(){for(var t=this._S,e=this._i,r=this._j,i=0,n=0;n<4;n++){var r=(r+t[e=(e+1)%256])%256,o=t[e];t[e]=t[r],t[r]=o,i|=t[(t[e]+t[r])%256]<<24-8*n}return this._i=e,this._j=r,i}t.RC4=e._createHelper(i);r=r.RC4Drop=i.extend({cfg:i.cfg.extend({drop:192}),_doReset:function(){i._doReset.call(this);for(var t=this.cfg.drop;0<t;t--)n.call(this)}});t.RC4Drop=e._createHelper(r)}(),F=(M=U).lib.StreamCipher,P=M.algo,D=[],E=[],R=[],P=P.Rabbit=F.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=0;r<4;r++)t[r]=16711935&(t[r]<<8|t[r]>>>24)|4278255360&(t[r]<<24|t[r]>>>8);for(var i=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],n=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],r=this._b=0;r<4;r++)N.call(this);for(r=0;r<8;r++)n[r]^=i[r+4&7];if(e){var o=e.words,s=o[0],c=o[1],e=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),o=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),s=e>>>16|4294901760&o,c=o<<16|65535&e;n[0]^=e,n[1]^=s,n[2]^=o,n[3]^=c,n[4]^=e,n[5]^=s,n[6]^=o,n[7]^=c;for(r=0;r<4;r++)N.call(this)}},_doProcessBlock:function(t,e){var r=this._X;N.call(this),D[0]=r[0]^r[5]>>>16^r[3]<<16,D[1]=r[2]^r[7]>>>16^r[5]<<16,D[2]=r[4]^r[1]>>>16^r[7]<<16,D[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)D[i]=16711935&(D[i]<<8|D[i]>>>24)|4278255360&(D[i]<<24|D[i]>>>8),t[e+i]^=D[i]},blockSize:4,ivSize:2}),M.Rabbit=F._createHelper(P),F=(M=U).lib.StreamCipher,P=M.algo,W=[],O=[],I=[],P=P.RabbitLegacy=F.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],i=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],n=this._b=0;n<4;n++)q.call(this);for(n=0;n<8;n++)i[n]^=r[n+4&7];if(e){var o=e.words,s=o[0],t=o[1],e=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),o=16711935&(t<<8|t>>>24)|4278255360&(t<<24|t>>>8),s=e>>>16|4294901760&o,t=o<<16|65535&e;i[0]^=e,i[1]^=s,i[2]^=o,i[3]^=t,i[4]^=e,i[5]^=s,i[6]^=o,i[7]^=t;for(n=0;n<4;n++)q.call(this)}},_doProcessBlock:function(t,e){var r=this._X;q.call(this),W[0]=r[0]^r[5]>>>16^r[3]<<16,W[1]=r[2]^r[7]>>>16^r[5]<<16,W[2]=r[4]^r[1]>>>16^r[7]<<16,W[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)W[i]=16711935&(W[i]<<8|W[i]>>>24)|4278255360&(W[i]<<24|W[i]>>>8),t[e+i]^=W[i]},blockSize:4,ivSize:2}),M.RabbitLegacy=F._createHelper(P),U});

/********************  公用配置参数  ********************/

var isJSMin=1; // 0-不压缩方案js 1 压缩方案js



var enableHttps=1; // 0-不启用https 1-启用 https 2-http和https共存



var epHTTPPort=803; // eportal http 端口



var enHTTPSPort=804; // eportal https 端口



var domainName='p.njupt.edu.cn'; // 强制跳转域名



var page_data_encrypt='1'; //页面传输数据是否加密 0-不开启,1-开启



var encryption_type='0'; // 数据加密类型 0-ip,1-密钥(默认ip)



var secret_key='drcom';  //数据加密密钥(如果数据加密类型使用为1则使用)



var port_mode='0';  //单端口页面模式 0-关闭 1-开启



var apg_switch='0';  //apg启用状态 0-关闭 1-开启



var apg_encrypt_type='0'; // apg数据加密方式 0-aes, 1待扩展



var apg_page_secret='5C1d5ad4dea0e8dd';  // apg数据秘钥



/********************  调试配置参数  ********************/

// 移动端调试开关：设置为1时使用alert显示调试信息，0时使用console.log

var mobileDebugMode='0'; // 生产环境设为0，移动端调试时设为1



/**

 * 统一的调试输出函数

 * @param {string} message - 调试信息

 * @param {string} type - 消息类型：'log', 'warn', 'error'

 */

function debugLog(message, type) {

  type = type || 'log';



  if (mobileDebugMode == '1') {

    // 移动端调试模式：使用alert显示

    var prefix = type === 'error' ? '? 错误: ' :

                 type === 'warn' ? '?? 警告: ' :

                 '?? 信息: ';

    try {

      alert(prefix + message);

    } catch (e) {

    }

  } else {

    // 正常模式：使用console输出

    try {

      if (typeof console !== 'undefined') {

        switch (type) {

          case 'error':

            console.error && console.error(message);

            break;

          case 'warn':

            console.warn && console.warn(message);

            break;

          default:

            console.log && console.log(message);

            break;

        }

      }

    } catch (e) {

    }

  }

}



// 协议/域名切换处理

var needRedirect = false;

var targetProtocol = window.location.protocol;

var targetHostname = window.location.hostname;

var targetUrl = '';

// 检查协议

if (enableHttps === 1 && window.location.protocol !== 'https:') {

  targetProtocol = 'https:';

  needRedirect = true;

} else if (enableHttps === 0 && window.location.protocol !== 'http:') {

  targetProtocol = 'http:';

  needRedirect = true;

}

// 检查域名

if (domainName && window.location.hostname != domainName) {

  targetHostname = domainName;

  needRedirect = true;

}

// 端口模式下额外检查端口和路径

if (port_mode === '1') {

  var targetPort = window.location.port;

  if (enableHttps === 1 && targetPort != enHTTPSPort) {

    targetPort = enHTTPSPort;

    needRedirect = true;

  } else if (enableHttps === 0 && targetPort != epHTTPPort) {

    targetPort = epHTTPPort;

    needRedirect = true;

  } else if (targetPort != epHTTPPort && targetPort != enHTTPSPort) {

    targetPort = targetProtocol === 'http:' ? epHTTPPort : enHTTPSPort;

    needRedirect = true;

  }  

  if (window.location.pathname.indexOf('/eportal/portal/index') < 0) {

    needRedirect = true;

  }

  

  if (needRedirect) {

    targetUrl = targetProtocol + '//' + targetHostname + ':' + targetPort + '/eportal/portal/index' + window.location.search;

  }

} else if (needRedirect) {

  targetUrl = targetProtocol + '//' + targetHostname + window.location.pathname + window.location.search;

}

if (targetUrl) {

  window.location = targetUrl;

}



// eportal当前端口

var ep_port = window.location.protocol === 'http:' ? epHTTPPort : enHTTPSPort;



// 页面对象

var page = {

  kind: 'pc',

  _kind: '',

  name: '',

  page_name: '',

  index: '',

  host: window.location.protocol + '//' + window.location.host + '/',

  hostname: window.location.protocol + '//' + window.location.hostname,

  path: window.location.protocol + '//' + window.location.host + '/drcom/',

  eportal: window.location.protocol + '//' + window.location.hostname + ':'+ ep_port +'/eportal/',

  portal_api: window.location.protocol + '//' + window.location.hostname + ':'+ ep_port +'/eportal/portal/',

  page_asset: window.location.protocol + '//' + window.location.hostname + ':'+ ep_port +'/eportal/public/pageAsset/',

  page_url: '',

  redirectLink: '',

  login_method: 0,

  timer: null,

  advert_time_79: 0,

  window_title: '',

  // com_username: '',

  // com_password: '',

  // common_username: '',

  // common_password: '',

  // dingtalk_username: '',

  // dingtalk_password: '',

  dingtalk_app_id: '',

  dingtalk_login_type:0,

  dingtalk_callback_uri:'',

  //online_monitor: 1,

  enable_r3: 0,

  password_cut: 0,

  en_md5: 0,

  visit_blacklist: [],

  user_info: '',

  online_info: '',

  logon_info: '',

  recharge_info: '',

  user_info_lang: '',

  online_info_lang: '',

  logon_info_lang: '',

  recharge_info_lang: '',

  edit_info_lang: [],

  enable_new_drcom_srv: 0,

  enable_alias: 0,

  enable_slide_verify: 0,

  sms_count_down: 60,

  enable_login_verify: 0,

  enable_ai_scene: 0,

  enable_scene_video: 0,

  run: function (_kind) {

    var me = this;

    me._kind = _kind;

    // 需用到store.get获取中英文，所以提取出来单独优先加载

    util._load('js', page.page_asset + 'js/store.js',function(){

      // 初始化终端参数，获取 ip、mac等信息

      term.init(function () {

        // 首页检查是否需要跳转到访客扫码页面，主要用于访客旁路扫码

        if (!_kind) {

          if (me.checkIsGroupScanQRCode()) return false; 

        }

        me.kind = util.switchPageKind(term.type);

        // 获取页面配置等信息

        me.getPageInfo(function () {

          if (me._kind == 'eduroam') {

            // eduroam 页面，检查用户状态，已审核直接登录，未审核的显示审核页，并定时检查是否审核了

            me.checkUserStatusAndLoginByIP(true);

            return false; 

          }

          // 有指定要渲染的页面（带_kind），就设置 kind，

          // 没有指定就查询状态，看是否在线，再设置 kind ，然后根据 kind 加载对应页面内容

          if (!me._kind) {

            me.checkStatus();

          } else {

            var device_type = util.switchPageKind(term.type);//设备类型

            var type_kind = me._kind == 1 || me._kind == 2 || me._kind == 3 ? device_type + '_3' : device_type + '_';

            me.kind = (device_type == 'pc' ? 'pc_' : type_kind) + _kind;

            me.render(me.load_js_css);

          }

        });

      });

    });

  },

  // 获取页面相关的参数配置等

  getPageInfo: function (next) {

    var me = this;

    var url = page.portal_api + 'page/loadConfig';

    var data = {};

    data.program_index = me.name;

    data.wlan_vlan_id = term.vlan;

    data.wlan_user_ip = util.base64encode(term.ip);

    data.wlan_user_ipv6 = util.base64encode(term.ipv6);

    data.wlan_user_ssid = term.ssid;

    data.wlan_user_areaid = term.areaID;

    data.wlan_ac_ip = util.base64encode(term.wlanacip);

    data.wlan_ap_mac = term.wlanapmac;

    data.gw_id = term.gw_id;

    util._jsonp({

      url: url,

      data: data,

      success: function (json) {

        if(json.code == 0){

          alert(json.msg);

          return false;

        }

        /**

         * 页面参数

         */

        me.index                = json.data.page_index || '';                     // 页面索引

        me.name                 = json.data.program_index || '';                  // 方案索引

        me.page_name            = json.data.page_name || '';                      // 页面名称

        me.page_style           = json.data.page_style || '';                     // 页面风格

        me.page_url             = me.eportal + 'extern/' + me.name + '/' + me.index + '/';  // 页面资源地址

        me.login_method         = parseInt(json.data.login_method) || 0;          // 认证方式

        me.redirectLink         = json.data.redirect_url || '';                      // 登录重定向地址

        me.window_title         = json.data.window_title || '';                   // 页面标题前缀

        me.advert_time_79       = parseInt(json.data.advert_time) || 0;           // a79 页面广告时间

        // me.check_read        = parseInt(json.data.check_read) || 1;            // 已废弃

        // me.online_monitor    = parseInt(json.data.online_monitor) || 0;        // 在线监听

        me.enable_r3            = parseInt(json.data.enable_r3) || 0;             // 串接 pppoe 代拨

        me.password_cut         = parseInt(json.data.password_cut) || 0;          // 密码截取

        me.en_md5               = parseInt(json.data.en_md5) || 0;                // MD5 加密认证

        me.visit_blacklist      = json.data.visit_blacklist || [];                // 重定向黑名单列表

        // me.edit_info_lang    = json.data.edit_info_lang || [];                 // 已废弃，成功页用户信息中英文

        me.user_info            = json.data.user_info || '';                      // 成功页/注销页需要显示的用户基本信息

        me.online_info          = json.data.online_info || '';                    // 成功页/注销页需要显示的在线记录信息

        me.logon_info           = json.data.logon_info || '';                     // 成功页/注销页需要显示的登录记录信息

        me.recharge_info        = json.data.recharge_info || '';                  // 成功页/注销页需要显示的收费记录信息

        me.user_info_lang       = json.data.user_info_lang || '';                 // 成功页/注销页需要显示的基本信息标签

        me.online_info_lang     = json.data.online_info_lang || '';               // 成功页/注销页需要显示的在线记录标签

        me.logon_info_lang      = json.data.logon_info_lang || '';                // 成功页/注销页需要显示的登录记录标签

        me.recharge_info_lang   = json.data.recharge_info_lang || '';             // 成功页/注销页需要显示的收费记录标签

        me.enable_new_drcom_srv = parseInt(json.data.enable_new_drcom_srv) || 0;  // 启用新版全业务接口 1-启用

        // me.common_username   = json.data.common_username || '';                // 公共账号

        // me.common_password   = json.data.common_password || '';                // 公共密码

        // 钉钉账号

        //me.dingtalk_username    = json.data.dingtalk_username || '';              // 钉钉临时账号

        //me.dingtalk_password    = json.data.dingtalk_password || '';              // 钉钉临时账号

        me.dingtalk_app_id      = json.data.dingtalk_app_id || '';                // 钉钉扫码登录APPID

        me.dingtalk_login_type  = json.data.dingtalk_login_type || 0;             // 钉钉APP内免登录 0 停用 1 启用

        me.dingtalk_callback_uri  = json.data.dingtalk_callback_uri || 0;             // 钉钉回调地址

        me.enable_slide_verify  = parseInt(json.data.enable_slide_verify) || 0;               // 发送短信前滑动验证

        me.sms_count_down       = parseInt(json.data.sms_count_down) || 60;               // 短信发送间隔(秒)

        me.enable_login_verify  = json.data.enable_login_verify || 0;             // 页面认证并发校验  0不启用  1认证前  2认证后

        me.enable_ai_scene      = parseInt(json.data.enable_ai_scene) || 0;      // 页面ai场景开关   0-关闭  1-启用

        me.enable_scene_video     = parseInt(json.data.enable_scene_video) || 0;      // 页面ai视频开关   0-关闭  1-启用



        // 方案参数

        term.ISRedirect         = parseInt(json.data.is_redirect) || 0;           // 是否重定向

        term.redirectLink       = json.data.redirect_link || '';                  // 登录重定向地址

        term.rebackLink         = json.data.reback_link || '';                      // 返回重定向地址

        term.redirectLogout     = parseInt(json.data.redirect_logout) || 0;          // 强制跳转注销页        

        term.suffix             = json.data.account_suffix || '';                 // 账号后缀                        

        term.enPerceive         = parseInt(json.data.en_perceive) || 0;              // 0-不无感知 1 显示快速登录页 2 直接无感知

        // term.customPerceive     = parseInt(json.data.custom_perceive) || 0;       // 是否启用无感知(后台未配置，由无感知组件控制),20230222废弃了

        term.cvlanid            = parseInt(json.data.cvlan_id) || 4095;           // 绑定CVLAN

        term.enAdvert           = parseInt(json.data.en_advert) || 0;             // 广告统计 0 停用 1 启用

        term.advert_host        = json.data.advert_host || '';                      // 广告统计服务器地址        

        term.onlineMonitor      = parseInt(json.data.online_monitor) || 1;        // 在线监听 0 停用 1 启用

        term.unBindMac          = parseInt(json.data.un_bind_mac) || 0;           // 本机注销时解绑MAC 0 停用 1 启用

        term.ispUnBindSuffix    = parseInt(json.data.isp_unbind_suffix) || 0;     // 运营商解绑时无后缀 0 停用 1 启用        

        term.findMac            = parseInt(json.data.find_mac) || 0;              // MAC 列表获取方式 0 Radius 1 全业务接口        

        term.registerMode       = parseInt(json.data.register_mode) || 0;         // 后台类型 0 私有云 1 BS后台 2 酒店版 3 访客系统 4 普教系统        

        term.changePassMode     = parseInt(json.data.change_pass_mode) || 0;      // 修改密码方式 0 Portal页面 1 自服务 2 第三方服务

        term.thirdSwitchUri     = json.data.third_switch_uri || '';      // 第三方跳转地址

        // enableR3             = parseInt(json.data.enable_r3) || 0;             // 改由页面属性控制 串接 pppoe 代拨 0 停用 1 启用

        // isLang               = parseInt(json.data.is_lang) || 0;               // 中英文标识(已废弃) 0 停用 1启用

        term.duodianAppHidden   = parseInt(json.data.duodian_app_hide) || 0;      // 隐藏哆点信息 0 停用 1启用

        term.enbaleEduroamVerify= parseInt(json.data.enbale_eduroam_verify) || 0; // 旁路eduroam审核模式 0 停用 1启用

        term.accountPrefix      = parseInt(json.data.account_prefix) || 0;          // 添加账号前缀 0 停用 1启用 默认为启用        

        term.ioMode             = parseInt(json.data.io_mode) || 0;               // 登录区分内外网方式：0-radius描述：IO 1-内核命令：ras_iomode2

        term.acLogout           = parseInt(json.data.ac_logout) || 0;             // 多AC注销方式 0 默认方式 1 通过Radius注销 2 通过全业务接口注销

        term.storeExpireTime    = parseInt(json.data.store_expire_time) || 86400; // 缓存过期时间,单位-秒

        term.enablev6           = parseInt(json.data.ipv6_state) || 0;            // Ipv4/Ipv6联动 0 停用 1 启用

        term.checkOnlineMethod  = parseInt(json.data.check_online_method) || 0;   // 检测用户在线状态的方式 0 默认方式 1 通过Radius检查

       

        //启用XOP平台房号登录功能

        term.enable_hotelop_login = parseInt(json.data.enable_hotelop_login) || 0; 

        

        term.enable_alias       = parseInt(json.data.enable_alias) || 0;           // 别名认证 0 停用 1启用



        term.dingtalk_app_type  = parseInt(json.data.dingtalk_app_type) || 0;      // 钉钉授权登录方式 0-放通域名  1-公共账号

        term.wechatwork_app_type= parseInt(json.data.wechatwork_app_type) || 0;    // 企业微信授权登录方式 0-放通域名  1-公共账号

        

        term.enable_verify      = parseInt(json.data.enable_verify) || 0;          // 校验密码强度 0-停用 1-前端校验 2-后端校验(Portal协议)

        term.length_require     = parseInt(json.data.length_require) || 8;         // 密码长度要求

        term.compose_require    = parseInt(json.data.compose_require) || 3;        // 组合个数要求

        term.enable_digital_char= parseInt(json.data.enable_digital_char) || 0;    // 数字字符组合启用状态 0 停用 1启用

        term.enable_upper_case  = parseInt(json.data.enable_upper_case) || 0;      // 大写字母组合启用状态 0 停用 1启用

        term.enable_lower_case  = parseInt(json.data.enable_lower_case) || 0;      // 小写字母组合启用状态 0 停用 1启用

        term.enable_special_char= parseInt(json.data.enable_special_char) || 0;    // 特殊符号组合启用状态 0 停用 1启用

        term.digital_char_scope = json.data.digital_char_scope || '';                   // 数字字符组合范围

        term.upper_case_scope   = json.data.upper_case_scope || '';                     // 大写字母组合范围

        term.lower_case_scope   = json.data.lower_case_scope || '';                     // 小写字母组合范围

        term.special_char_scope = json.data.special_char_scope || '';                   // 特殊符号组合范围

        term.enable_prohibit_account = parseInt(json.data.enable_prohibit_account) || 0;              // 禁止包含账号 0 不检测 1 检测

        term.prohibit_same_length = parseInt(json.data.prohibit_same_length) || 0;                    // 禁止相同字符 0 不检测 1 检测

        term.prohibit_continuation_length = parseInt(json.data.prohibit_continuation_length) || 0;    // 禁止连续字符 0 不检测 1 检测

        term.enable_week_changepwd= parseInt(json.data.enable_week_changepwd) || 0;    // 弱密码强制修改 0 停用 1启用



        term.rcn = json.data.rcn || '';  // apg页面随机数

        term.webauthn_domain = json.data.webauthn_domain || '';  // webauthn域名

        

        term.no_filter_accandpwd = parseInt(json.data.no_filter_accandpwd) || 0;    // 账号/密码免过滤 0 停用 1 启用

        term.ipad_terminal_identity = parseInt(json.data.ipad_terminal_identity) || 0;    // IPAD终端识别标识 0-PC端(默认) 1-移动端

        term.auth_failed_prompt     = parseInt(json.data.auth_failed_prompt) || 0;        // 认证失败弹窗提示 0 默认显示认证失败页 1 弹窗提示具体错误



        next();

      },

      error: function () {

        next();

      }

    });

  },

  // 向内核请求，检查用户状态 result: 0 不在线，1 在线

  checkStatus: function () {

    var me = this;

    var url = me.path + 'chkstatus';

    var data = {};



    if(term.checkOnlineMethod == 1 ||  port_mode == '1') {

      url = page.portal_api + 'online_list';

      data = {

        'user_account': '',         // 认证账号

        'user_password': '',         // 认证密码

            'wlan_user_mac': util.trim(term.mac).toUpperCase(), //Mac需要转为大写

        // 兼容纯IPv4/纯IPv6/IPv4联动IPv6

        //'wlan_user_ip': util.ipToParseInt(util.trim(term.ip)), //兼容微信浏览器

        //'curr_user_ip': util.ipToParseInt(util.trim(term.ip)), //兼容微信浏览器

        'wlan_user_ip': util.base64encode(util.trim(term.ip)),

        'wlan_user_ipv6': util.base64encode(util.trim(term.ipv6)),

        'jsVersion': typeof(jsVersion) =='undefined'?'4.X':jsVersion          // 页面使用版本

      };

    }



    util._jsonp({

      url: url,

      data: data,

      time: term.checkOnlineMethod == 1?5000:20000,

      success: function (json) {

        if ('undefined' != typeof (json.ss4) && json.ss4 != '000000000000' && json.ss4 != '') {

          // 优先以url上面的Mac为准

          term.mac = (term.mac == '000000000000' || term.mac == '111111111111' || term.mac == '123456789012') ? json.ss4 : term.mac;

        }

        // 不在线，是否启用无感知

        if (json.result == 0 && term.enPerceive !== 0) {

          me.checkMac();

          return false;

        }

        // 在线(此处代码存疑)

        if (json.result == 1) {

          json.uid && (term.account = json.uid);

          term.online = json;

          me.kind = term.type == 1 ? 'pc_1' : util.switchPageKind(term.type) + '_31';

          // 如果启用 旁路eduroam审核，并且账号里带有 @的，则调用后台接口查询是否需要审核

          if (term.enbaleEduroamVerify == 1 && json.uid.indexOf('@') != -1) {

            me.checkUserStatusAndLoginByIP(true);

          }

          else {

            me.render(me.load_js_css);

          }

          return false; 

        }



        me.firstRender();

      },

      error: function () {

        if(term.checkOnlineMethod == 1) {

          me.firstRender();

        } 

        else {

          document.getElementsByTagName('body')[0].innerHTML = lang('内核接口不可用，请检查内核命令跟内核版本！');

        }

      }

    });

  },

  checkMac: function (next) {

    var me = this;

    var url = me.portal_api + 'perceive';

    if (term.mac == '000000000000' || term.mac == '111111111111') {

      me.firstRender();

      return false; 

    }

    var data = {};

    data.login_method = page.login_method;

    data.wlan_user_ip = term.ip;

    data.wlan_user_ipv6 = term.ipv6;

    data.wlan_vlan_id = term.vlan;

    data.wlan_user_mac = term.mac;

    data.wlan_ac_ip = term.wlanacip;

    data.wlan_ac_name = term.wlanacname;

    // 0-不无感知 1 显示快速登录页 2 直接无感知

    data.data_format = term.enPerceive === 2 ? 2 : 0; // 2 无感知登录  0 返回无感知状态

    data.suffix = term.suffix;

    data.ssid = term.ssid;

    // wifidog无感知功能

    if (page.login_method == 14) {

      data.rtype = 0; // 0-普通认证 1-微信认证

      data.gw_port = term.gw_port;

      data.gw_address = term.gw_address;

      data.gw_id = term.gw_id;

    }

    util._jsonp({

      url: url,

      data: data,

      success: function (json) {

        if (json.result == 1) { // 已在线或直接无感知登录成功显示成功页

          // wifidog认证时，由后台生成url，供页面跳转认证

          if (page.login_method == 14 && typeof (json.auth_url) != 'undefined') {

            window.location.href = json.auth_url;

            return false;

          }

          if (typeof (json.account) != 'undefined') term.account = json.account;          

          me.kind = term.type == 1 ? 'pc_3' : util.switchPageKind(term.type) + '_33';

        } else if (json.result == 10) { // 显示快速登录页

          me.kind = term.type == 1 ? 'pc_20' : util.switchPageKind(term.type) + '_10';

        } else { // 检测异常或未绑定MAC显示认证页

          me.kind = term.type == 1 ? 'pc' : util.switchPageKind(term.type);

        }

        me.firstRender();

      },

      error: function () {

        me.firstRender();

      }

    });

  },

  // 检查是否为团体访客扫码，

  checkIsGroupScanQRCode: function () {

    if (term.redirect && (term.redirect.indexOf('api=groupQRCodeScan') >= 0 || util.getQueryString('api') == 'groupQRCodeScan')) {

      var url = window.location.search;

      url += "&" + term.redirect.substr(term.redirect.indexOf('?') + 1);

      window.location = 'a30.htm' + url;

      return true;

    } else {

      return false;

    }

  },

  // 监听情况，审核or未审核，审核通过 eportal 后台上线。

  checkUserStatusAndLoginByIP: function (firstRender) {   // firstRender 是否首次渲染页面

    var me = this;

    me.kind = term.type == 1 ? 'pc_1' : util.switchPageKind(term.type) + '_31';

    var callback = me.load_js_css;

    var url = page.portal_api + 'visitor/checkUserStateByIP';



    util._jsonp({

      url: url,

      time: 10000,

      data: {

        'program_name': page.name,

        'page_index': page.index,

        'login_method': page.login_method,

        'wlan_user_ip': term.ip,

        'wlan_user_mac': term.mac,

        'wlan_ac_ip': term.wlanacip,

        'wlan_ac_name': term.wlanacname

      },

      success: function (json) {

        if (json.result == 1 || json.result == 'ok') {

          if (typeof (json.login_result) && json.login_result == 1 || json.login_result == 2) { // 在线或登录成功

            me.timer && window.clearInterval(me.timer);

            window.location = '3.htm' + window.location.search;

            return false; 

          }

          if (!firstRender) return false; 



          if (typeof (json.useflag) != 'undefined') {

            if (json.useflag == 0) { // 停机

              me.kind = term.type == 1 ? 'pc_2' : util.switchPageKind(term.type) + '_32';

              callback = function () {

                document.getElementById('message').innerHTML = lang('该账号已停机，请充值激活后再使用。');

                document.getElementById('message').setAttribute('data-localize', 'accountoutofservice')

                me.load_js_css();

              };

            } else { // 在线未开户，需审核

              if (json.auditstate == 0) { // 已提交，待审核

                me.kind = term.type == 1 ? 'pc_2' : util.switchPageKind(term.type) + '_32';

                callback = function () {

                  document.getElementById('message').innerHTML = lang('已提交审核，请耐心等待短信通知！');

                  document.getElementById('message').setAttribute('data-localize', 'submittedforreview')

                  me.load_js_css(me.keepCheckState);

                };

              } else { // -1 未提交审核

                me.kind = term.type == 1 ? 'pc_eduroam' : util.switchPageKind(term.type) + '_eduroam';

              }

            }

          }

          me.render(callback);

        } else {

          if (!firstRender) return false; 

          me.kind = term.type == 1 ? 'pc_eduroam' : util.switchPageKind(term.type) + '_eduroam';

          me.render(callback);

        }

      },

      error: function () {

        if (!firstRender) return false; 

        me.kind = term.type == 1 ? 'pc_eduroam' : util.switchPageKind(term.type) + '_eduroam';

        me.render(me.load_js_css);

      }

    });

  },

  keepCheckState: function () {

    var me = this;

    me.timer && window.clearInterval(me.timer);

    me.timer = window.setInterval(function () {

      page.checkUserStatusAndLoginByIP();

    }, 8000); //每8秒自动刷新一次

  },

  firstRender: function () {

    var me = this;



    // aruba重定向错误信息errmsg

    var ErrorMsg = util.getQueryString('errmsg');

    if(ErrorMsg){

      me.kind = util.switchPageKind(term.type) + (term.type == 1? '_2' :'_32');

      me.render(me.load_js_css(function () {

        error.portalErr.ret_code = 1;

        error.portalErr.msg = ErrorMsg;

        error.showMsg();

      }));

      return false;

    }



    if ((term.redirect && term.redirect.indexOf('wechat_redirect') >= 0) || window.location.hash == '#wechat_redirect' || window.location.search.indexOf('wechat_redirect') >= 0) {

      var url = page.portal_api + 'wechat_work/create';

      var data = {

        // 二维码数据

        'login_method': page.login_method,

        'mac_type': (term.type == 2 || (term.ipad_terminal_identity && (term.type == 3 || term.type == 4))) ? 1 : 0, //手机终端标记

        'wlan_user_ip': term.ip,

        'wlan_user_ipv6': term.ipv6,

        'authex_enable': term.authex_enable,//选择参数

        'wlan_ac_ip': term.wlanacip,

        'wlan_ac_name': term.wlanacname,

        'account_suffix': term.suffix,//账号后缀

        'no_qrcode': 1,//是否不生成二维码 0-生成 1-不生成

        'jsVersion': typeof(jsVersion) =='undefined'?'4.X':jsVersion          // 页面使用版本

      };

      util._jsonp({

        url: url,

        data: data,

        success: function (json) {

            if (json.result == 1 || json.result == 'ok') { // result 1 加载成功 0 加载失败

            window.location = json.content;

          } else {

            alert(lang(json.msg));

          }

        },

        error: function (error) {

          alert(lang('加载二维码方法调用出现异常，请刷新页面重试！'));

        }

      });

      return false;

    }

    

    if ((term.redirect && term.redirect.indexOf('dingtalk_redirect') >= 0) || window.location.hash == '#dingtalk_redirect') {

      //方案名■页面类型■页面索引■ip■vlan■ssid■mac■ipv6■认证方式■后台■wlanacname■wlanacip■session■钉钉临时账号■钉钉临时密码■终端类型■账号后缀

      extend = page.name + "\t" + page.index + "\t" + term.ip + "\t" + term.vlan + "\t" + term.ssid + "\t" + term.mac + "\t" + term.ipv6 + "\t" + page.login_method + "\t" + term.registerMode + "\t" + term.wlanacname + "\t" + term.wlanacip +"\t" + page.dingtalk_username + "\t" + page.dingtalk_password;

      extend = util.base64encode(extend);

      url = encodeURIComponent(page.host + 'a25.htm?extend=' + extend);

      var goto = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + page.dingtalk_app_id + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' + url;

      window.location.href = goto;

      return false;

    }

    

    if (page.advert_time_79 > 0) {

      me.advert();

    } else {

      me.render(me.load_js_css);

    }

  },

  // 广告页

  advert: function () {

    var me = this;

    me.kind = term.type == 1 ? 'pc_79' : util.switchPageKind(term.type) + '_79';

    me.render(function () {

      var time = page.advert_time_79;

      var timer = setInterval(function () {

        time--;

        if (time <= 0) {

          me.kind = term.type == 1 ? 'pc' : util.switchPageKind(term.type);

          me.render();

          window.clearInterval(timer);

        } else {

          document.getElementById('advertTime').innerHTML = time;

        }

      }, 1000);

      me.load_js_css();

    });

  },

  /*  

  * 加载 页面需要的js 跟css 文件

  */

  load_js_css: function (callback) {

    // Bootstrap 在页面中好像没有用到

    // util._load('css', page.page_asset + 'css/bootstrap.css'); // Bootstrap v3.2.0

    // 其他js依赖 jquery,等jquery 加载完成再加载其他js

    // all.js 包括基本不会变动的js插件 jquery FlexSlider jQuery-ajaxTransport-XDomainRequest clipboard store

    util._load('js', page.page_asset + 'js/all.js', function () {



      // AI定制代码

      util._load('js', page.page_asset + 'js/hls.js');



      util._load('css', page.page_asset + 'js/layer/theme/default/layer.css?v=3.1.1');

      util._load('css', page.page_asset + 'js/layer/theme/default/stylesheet.css');//加载字体文件

      util._load('js', page.page_asset + 'js/layer/layer.js'); // layer.js 弹窗解决方案 单独加载，因为要自动加载 css 文件

      if (page.enable_slide_verify === 1) {

        util._load('css', page.page_asset + 'verify/css/verify.css');

        util._load('js', page.page_asset + 'verify/js/verify.js');

      }

      //需先加载(jquery.i18n.properties)，a42.js中有用到$.i18n

      util._load('js', page.page_asset + 'js/jquery.i18n.js', function() {

        // 判断是不是发布的方案，发布的话，对js 进行打包压缩

        if (isJSMin) {

          util._load('js', 'a40.js?v=_' + fileVersion,callback); // 压缩后的功能js

        } else {

          util._load('js', 'a77.js?v=_' + fileVersion); // 浏览器探测重定向列表

          util._load('js', 'a78.js?v=_' + fileVersion); // 错误自定义



          /**

           * 下面几个按顺序加载

           * a42.js 需先加载工具js

           * a43.js 基本业务功能

           * a44.js 旁路认证

           * a45.js 短信认证

           * a47.js 二维码扫码功能

           * a48.js 钉钉认证功能

           * a49.js 访客

           * a50.js 广告统计功能

           * a51.js 普教功能

           * a52.js 企业微信功能

           * a58.js 定制功能使用，覆盖标准功能，所以需要在标准功能加载后加载

           * a60.js 页面自适应匹配

           * a61.js 无密码验证功能

           * a62.js 页面认证并发校验

           * a63.js apg功能

           * a59.js _init 函数，最后加载，最后执行

           */

          var jsFiles = ['a42.js', 'a43.js', 'a44.js', 'a45.js', 'a47.js', 'a48.js', 'a49.js', 'a50.js', 'a51.js','a52.js','a53.js','a58.js','a60.js','a61.js','a62.js','a63.js','a64.js','a67.js','a68.js','a59.js'];



          var loadFile = function (index) {

            if (index < jsFiles.length) {

              util._load('js', jsFiles[index] + '?v=_' + fileVersion, function () {

                loadFile(++index);

              });

            }else{

              // 加载完js文件，最后执行回调函数

              typeof (callback) !== 'undefined' && callback();

            }

          }

          loadFile(0);

        }

      });

    });

  },

  /*  

  * 渲染页面

  * 解决图片，视频路径问题

  */

  render: function (next) {

    var me = page;

    if(page.enable_new_drcom_srv == 1 && (page.kind == 'pc_1' || page.kind == 'pc_3' || page.kind == 'mobile_31' || page.kind == 'mobile_33' || page.kind == 'hipad_31'|| page.kind == 'hipad_33' || page.kind == 'vipad_31' || page.kind == 'vipad_33') && (page.user_info.length > 0 || page.online_info.length > 0  || page.logon_info.length > 0 || page.recharge_info.length > 0 )){

      me.kind = term.type == 1 ? 'pc_5' : util.switchPageKind(term.type) + '_35';

    }

    var url = me.page_url + me.kind + '.js?v=_' + fileVersion;

    util._load('js', url, function () {

      var dom = util.string2DOM(window.bodyContent)[0];

      

      // 替换图片路径

      var imgs = dom.getElementsByTagName('img');

      for (var i = imgs.length - 1; i >= 0; i--) {

        var src = imgs[i].src;

        if (src && src.length > 0) {

          var index = src.indexOf('/', 10);

          if (index > 0) {

            src = src.substr(index + 1); // 去掉 http://xxx部分

            var srcAry = src.split('/');

            //EditEportal 公用目录不做页面文件替换

            if (srcAry[0] == 'EditEportal') {

              imgs[i].src = me.eportal + src;

            } else {

              imgs[i].src = me.page_url + srcAry[srcAry.length - 1];

            }

          }

        }

      }



      //解决视频路径问题

      var videos = dom.getElementsByTagName('video');

      for (var i = videos.length - 1; i >= 0; i--) {

        var src = videos[i].src;

        if (src && src.length > 0) {

          var index = src.indexOf('/', 10);

          if (index > 0) {

            src = src.substr(index + 1); // 去掉 http://xxx部分

            var srcAry = src.split('/');

            videos[i].src = me.page_url + srcAry[srcAry.length - 1];

          }

        }

        videos[i].setAttribute('poster', me.eportal + 'EditEportal/Images/a03.jpg');

      }

      

      // 解决按钮背景图片路径问题

      var changeBtnImgPath = function (targets) {

        for (var i = targets.length - 1; i >= 0; i--) {

          var style = targets[i].getAttribute('style');

          if (style) {

            if (style.indexOf('url("') >= 0) {

              style = style.replace('url("', 'url("' + me.page_url); //IE

            } else {

              style = style.replace('url(', 'url(' + me.page_url);

            }

          }

          targets[i].setAttribute('style', style);

        }

      }

      

      changeBtnImgPath(dom.getElementsByTagName('button'));

      changeBtnImgPath(dom.getElementsByTagName('input'));



      //哆点显示问题

      if ((typeof (term.duodianAppHidden) != 'undefined') && (term.duodianAppHidden == 1)) {

        var a = dom.getElementsByTagName('a');

        for (var i = a.length; i >= 0; i--) {

          if (typeof (a[i]) != 'undefined') {

            if ((a[i].getAttribute('href') == 'http://www.doctorcom.com/duodian/') || (a[i].getAttribute('data-localize') == page.kind + '.common.downloadapp') || (a[i].getAttribute('class') == 'lightbox_a') || (a[i].getAttribute('desc') == 'duodian_download') || (a[i].getAttribute('href') == 'http://www.drcom.com.cn')) {

              if ((typeof (a[i].style) != 'undefined') && (typeof (a[i].style.display) != 'undefined')) {

                a[i].style.display = 'none';

              }

            }

            if (a[i].getAttribute('name') == 'openApp') {

              if ((typeof (a[i].parentElement) != 'undefined') && (typeof (a[i].style) != 'undefined') && (typeof (a[i].style.display) != 'undefined')) {

                a[i].parentElement.style.display = 'none';

              }

            }

          }

        }

      }



      document.body.innerHTML = '';

      document.body.appendChild(dom);



      // 页面里面放了一个字段，区分页面的类型，需要针对不同类型的页面做不同处理

      // 目前暂时用这个来判断页面是否为访客模板 guest visitor eduroam 三种

      document.getElementById("pagetype") && (me.vtype = document.getElementById("pagetype").value);

      

      // 渲染完成后 做一些初始化操作 以及调用回调函数

      if (typeof (_init) != 'undefined') {

        if (($('[name="language"]').length > 0) || (store.get("i18n_lang") == "en" || (navigator.language || navigator.browserLanguage).toLowerCase().indexOf("en") == 0)) {

          language.init(null, function () {

            _init(next);

          })

        } else {

          _init(next);

        }

      } else {

        next && next();

      }

    });

  }

};





// 工具对象

var util = {

  num: 1000,



  //自增,用于jsonp请求回调函数

  increment: function () {

    return ++this.num;

  },



  trim: function (s) {

    if (typeof s == "string")

      return s.replace(/(^\s*)|(\s*$)/g, "");

    else

      return s;

  },



  string2DOM: function (str) {

    var div = document.createElement("div");

    if (typeof str == "string") div.innerHTML = str;

    return div.childNodes;

  },



  /**

   * 查询参数缓存

   * @description 缓存解析后的查询参数对象，避免重复解析URL

   * @type {Object|null} 缓存的查询参数对象，null表示无缓存

   * @private

   */

  _queryStringCache: null,



  /**

   * 查询参数缓存时间戳

   * @description 记录缓存创建的时间，用于判断缓存是否过期

   * @type {number} 时间戳（毫秒）

   * @private

   */

  _queryStringCacheTime: 0,



  /**

   * 查询参数缓存对应的URL

   * @description 记录缓存对应的查询字符串，用于检测URL变化

   * @type {string} 查询字符串

   * @private

   */

  _queryStringCacheUrl: '',



  /**

   * 获取URL查询参数

   * @description 解析URL查询参数，支持多参数查询和智能缓存

   * @param {string} name - 参数名，支持传入多个参数名按优先级查找

   * @returns {string} 参数值，未找到返回空字符串

   * 

   * @performance 性能优化特性：

   * - 智能缓存：开发环境5秒，生产环境30秒

   * - 批量解析：一次解析所有参数，支持快速查找

   * - 兼容性：保持原有API和行为完全一致

   * 

   * @example

   * // 单参数查询

   * var ip = util.getQueryString('ip');

   * 

   * // 多参数查询（按优先级返回第一个找到的值）

   * var userIp = util.getQueryString('ip', 'wlanuserip', 'userip', 'user-ip');

   */

  getQueryString: function (name) {

    var l = arguments.length;

    if (l < 1) return '';

    

    // 获取缓存的查询参数对象

    var params = this._getCachedQueryParams();

    

    // 单参数查询

    if (l == 1) {

      return params[name] || '';

    } 

    // 多参数查询（按优先级返回第一个找到的值）

    else {

      for (var i = 0; i < arguments.length; i++) {

        var value = params[arguments[i]];

        if (value) return value;

      }

      return '';

    }

  },



  /**

   * 获取缓存的查询参数

   * @description 智能缓存策略，根据URL变化和时间过期自动更新缓存

   * @returns {Object} 查询参数对象

   * @private

   */

  _getCachedQueryParams: function() {

    var now = Date.now();

    var currentUrl = window.location.search;

    var cacheExpiry = this._getQueryCacheExpiry();

    

    // 检查缓存是否有效：URL未变化且未过期

    if (this._queryStringCache && 

        this._queryStringCacheUrl === currentUrl &&

        (now - this._queryStringCacheTime) < cacheExpiry) {

      return this._queryStringCache;

    }

    

    // 重新解析并缓存

    this._queryStringCache = this._parseQueryString();

    this._queryStringCacheTime = now;

    this._queryStringCacheUrl = currentUrl;

    

    return this._queryStringCache;

  },



  /**

   * 解析查询字符串（优化版）

   * @description 一次性解析所有URL参数，支持大小写不敏感查找

   * @returns {Object} 解析后的参数对象

   * @private

   * 

   * @algorithm 解析算法：

   * 1. 安全处理空查询字符串

   * 2. 使用 decodeURIComponent 替代过时的 unescape

   * 3. 支持大小写不敏感（保持原有特性）

   * 4. 异常处理防止解码错误

   */

  _parseQueryString: function() {

    var search = window.location.search;

    var params = {};

    

    if (!search || search.length <= 1) {

      return params;

    }

    

    // 移除开头的 '?' 并分割参数

    var pairs = search.substring(1).split('&');

    

    for (var i = 0; i < pairs.length; i++) {

      var pair = pairs[i];

      if (!pair) continue;

      

      var equalIndex = pair.indexOf('=');

      

      if (equalIndex > 0) {

        try {

          var key = decodeURIComponent(pair.substring(0, equalIndex));

          var value = decodeURIComponent(pair.substring(equalIndex + 1));

          

          // 存储原始大小写的键值

          params[key] = value;

          

          // 同时存储小写版本以支持大小写不敏感查找（保持原有特性）

          var lowerKey = key.toLowerCase();

          if (!params[lowerKey]) {

            params[lowerKey] = value;

          }

        } catch (parseError) {

          debugLog('URL参数解析错误：' + parseError, 'error');

          debugLog('URL参数解码失败:' + pair, 'error');

        }

      }

    }

    

    return params;

  },



  /**

   * 智能缓存过期时间

   * @description 根据环境自动调整缓存时间，平衡开发体验和生产性能

   * @returns {number} 缓存过期时间（毫秒）

   * @private

   */

  _getQueryCacheExpiry: function() {

    // 开发环境使用较短缓存，便于调试和测试

    if (window.location.hostname === 'localhost' || 

        window.location.hostname.indexOf('dev') !== -1 ||

        window.location.hostname.indexOf('test') !== -1) {

      return 5000; // 5秒

    }

    // 生产环境使用较长缓存，提升性能

    return 30000; // 30秒

  },



  /**

   * 清除查询参数缓存

   * @description 强制清除缓存，下次调用getQueryString时将重新解析

   * @usage 适用场景：

   * - URL参数发生变化需要立即更新

   * - 开发调试时需要测试不同参数

   * - 单页应用中路由变化时

   * 

   * @example

   * // URL变化时清除缓存

   * window.addEventListener('popstate', function() {

   *   util.clearQueryStringCache();

   * });

   */

  clearQueryStringCache: function() {

    this._queryStringCache = null;

    this._queryStringCacheTime = 0;

    this._queryStringCacheUrl = '';

  },

  



  /**

   * 获取iOS版本信息（统一方法）

   * @description 解析User Agent中的iOS版本信息

   * @returns {Object|null} iOS版本对象或null

   */

  getIOSVersion: function() {

    try {

      var ua = navigator.userAgent;

      var match = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);

      if (match) {

        return {

          major: parseInt(match[1], 10),

          minor: parseInt(match[2], 10),

          patch: parseInt(match[3] || '0', 10),

          toString: function() {

            return this.major + '.' + this.minor + '.' + this.patch;

          }

        };

      }

      return null;

    } catch (iosVersionParseError) {

      return null;

    }

  },

  

  /**

   * 检测是否为移动设备环境（统一方法）

   * @description 检测当前环境是否为移动设备（手机或平板）

   * @returns {boolean} 是否为移动设备

   */

  isMobileEnvironment: function() {

    var userAgent = navigator.userAgent;

    

    // 检测手机设备

    var isPhone = /iPhone|Android.*Mobile|Windows Phone|BlackBerry|webOS|Opera Mini/i.test(userAgent);

    

    // 检测平板设备

    var isTablet = /iPad|Android(?!.*Mobile)|Kindle|Silk|PlayBook|BB10.*Touch/i.test(userAgent) ||

                   (/Macintosh/i.test(userAgent) && 'ontouchstart' in window); // iPadOS桌面模式

    

    // 检测触摸设备

    var hasTouch = 'ontouchstart' in window || 

                   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||

                   (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);

    

    // 屏幕尺寸检测（移动设备通常屏幕较小）

    var isSmallScreen = false;

    try {

      if (window.screen && window.screen.width && window.screen.height) {

        var screenWidth = Math.max(window.screen.width, window.screen.height);

        isSmallScreen = screenWidth <= 1024; // 小于等于1024px认为是移动设备

      }

    } catch (screenAccessError) {

      // 屏幕属性访问失败时忽略

    }

    

    return isPhone || isTablet || (hasTouch && isSmallScreen);

  },

  

  /**

   * 获取设备类型描述（统一方法）

   * @description 根据User Agent获取设备类型的描述字符串

   * @returns {string} 设备类型描述

   */

  getDeviceTypeDesc: function() {

    var userAgent = navigator.userAgent;

    

    if (/iPhone/i.test(userAgent)) return 'iPhone';

    if (/iPad/i.test(userAgent)) return 'iPad';

    if (/Android.*Mobile/i.test(userAgent)) return 'Android手机';

    if (/Android/i.test(userAgent)) return 'Android平板';

    if (/Windows Phone/i.test(userAgent)) return 'Windows Phone';

    if (/BlackBerry/i.test(userAgent)) return 'BlackBerry';

    if (/Macintosh/i.test(userAgent) && 'ontouchstart' in window) return 'iPad(桌面模式)';

    

    // 通用移动设备检测

    if ('ontouchstart' in window) {

      try {

        if (window.screen && window.screen.width) {

          var screenWidth = Math.min(window.screen.width, window.screen.height);

          if (screenWidth <= 480) return '手机设备';

          if (screenWidth <= 1024) return '平板设备';

        }

      } catch (screenPropertyError) {

        // 忽略屏幕属性访问错误

      }

      return '触摸设备';

    }

    

    return '移动设备';

  },

  

  /**

   * 兼容性alert函数（统一方法）

   * @description 针对不同iOS版本优化的alert显示方法

   * @param {string} message - 要显示的消息

   */

  compatibilityAlert: function(message) {

    var iosVersion = this.getIOSVersion();

    

    try {

      if (iosVersion) {

        if (iosVersion.major >= 15) {

          // iOS 15+：使用延迟显示确保alert正常工作

          setTimeout(function() {

            try {

              alert(message);

            } catch (alertError) {

              debugLog('Alert失败，错误信息：' + message, 'error');

            }

          }, 200); // 针对iOS 15.5增加更长延迟

        } else if (iosVersion.major >= 12) {

          // iOS 12-14：标准延迟处理

          setTimeout(function() {

            alert(message);

          }, 100);

        } else {

          // iOS 12以下：直接显示

          alert(message);

        }

      } else {

        // 非iOS设备：标准处理

        alert(message);

      }

    } catch (displayError) {

      // 所有显示方式都失败时的最后降级处理

      debugLog('错误显示失败，原始错误：' + message, 'error');

      debugLog('显示错误：' + displayError, 'error');

    }

  },



  /**

   * 移动设备兼容性：统一的错误处理方法

   * 作为getTermType方法的一部分，专门处理移动设备的JavaScript错误

   * @param {Error|Object} errorObj - 错误对象或错误事件对象

   * @param {string} contextStr - 错误上下文描述

   * @param {boolean} forceShow - 是否强制显示错误（用于调试）

   */

  handleMobileCompatibilityError: function(errorObj, contextStr, forceShow) {

    var ua = navigator.userAgent;

    var self = this; // 保存util对象的引用

    

    // 解析错误堆栈信息，获取具体的文件和行号

    var parseErrorStack = function(error) {

      var stackInfo = {

        fileName: '未知文件',

        lineNumber: '未知',

        columnNumber: '未知',

        functionName: '未知函数',

        stackTrace: '无堆栈信息'

      };

      

      try {

        // 优先使用错误事件对象的信息（更准确）

        if (error && typeof error === 'object') {

          if (error.filename) {

            stackInfo.fileName = error.filename;

            // 提取文件名（去掉路径）

            var fileNameMatch = error.filename.match(/([^\/\\]+)$/);

            if (fileNameMatch) {

              stackInfo.fileName = fileNameMatch[1];

            }

          }

          if (error.lineno) stackInfo.lineNumber = error.lineno;

          if (error.colno) stackInfo.columnNumber = error.colno;

          if (error.message) stackInfo.message = error.message;

        }

        

        // 如果是Error对象，解析stack信息

        if (error && error.stack) {

          stackInfo.stackTrace = error.stack;

          

          // 解析堆栈的第一行（通常是错误发生的位置）

          var stackLines = error.stack.split('\n');

          for (var i = 0; i < stackLines.length; i++) {

            var line = stackLines[i];

            

            // 匹配不同浏览器的堆栈格式

            var chromeMatch = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);

            var firefoxMatch = line.match(/(.+?)@(.+?):(\d+):(\d+)/);

            var safariMatch = line.match(/(.+?)@(.+?):(\d+):(\d+)/);

            var ieMatch = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);

            

            var match = chromeMatch || firefoxMatch || safariMatch || ieMatch;

            

            if (match && match.length >= 4) {

              // 提取函数名

              if (match[1] && match[1].trim() !== '') {

                stackInfo.functionName = match[1].trim();

              }

              

              // 提取文件名

              if (match[2]) {

                var fullPath = match[2];

                var fileNameMatch = fullPath.match(/([^\/\\]+)$/);

                if (fileNameMatch) {

                  stackInfo.fileName = fileNameMatch[1];

                } else {

                  stackInfo.fileName = fullPath;

                }

              }

              

              // 提取行号和列号

              if (match[3]) stackInfo.lineNumber = match[3];

              if (match[4]) stackInfo.columnNumber = match[4];

              

              break; // 找到第一个有效的堆栈信息就停止

            }

          }

        }

        

        // 如果仍然没有文件信息，尝试从当前脚本标签获取

        if (stackInfo.fileName === '未知文件') {

          try {

            var scripts = document.getElementsByTagName('script');

            for (var j = scripts.length - 1; j >= 0; j--) {

              if (scripts[j].src) {

                var srcMatch = scripts[j].src.match(/([^\/\\]+)$/);

                if (srcMatch) {

                  stackInfo.fileName = srcMatch[1] + '(推测)';

                  break;

                }

              }

            }

          } catch (scriptInfoError) {

            // 忽略获取脚本信息的错误

          }

        }

        

      } catch (parseError) {

        // 解析失败时保持默认值

        stackInfo.stackTrace = '堆栈解析失败: ' + parseError.message;

      }

      

      return stackInfo;

    };

    

    // 检测是否为移动设备

    var isPhone = /iPhone|Android.*Mobile|Windows Phone|BlackBerry|webOS|Opera Mini/i.test(ua);

    var isTablet = /iPad|Android(?!.*Mobile)|Kindle|Silk|PlayBook|BB10.*Touch/i.test(ua) ||

                   (/Macintosh/i.test(ua) && 'ontouchstart' in window);

    var hasTouch = 'ontouchstart' in window || 

                   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    

    // 只在移动设备上处理错误

    if (isPhone || isTablet || hasTouch || forceShow) {

      var deviceTypeStr = '移动设备';

      var iosVersion = null;

      

      // 设备类型识别

      if (/iPhone/i.test(ua)) {

        deviceTypeStr = 'iPhone';

        iosVersion = self.getIOSVersion();

      } else if (/iPad/i.test(ua)) {

        deviceTypeStr = 'iPad';

        iosVersion = self.getIOSVersion();

      } else if (/Android.*Mobile/i.test(ua)) {

        deviceTypeStr = 'Android手机';

      } else if (/Android/i.test(ua)) {

        deviceTypeStr = 'Android平板';

      } else if (/Windows Phone/i.test(ua)) {

        deviceTypeStr = 'Windows Phone';

      } else if (/Macintosh/i.test(ua) && hasTouch) {

        deviceTypeStr = 'iPad(桌面模式)';

        iosVersion = self.getIOSVersion();

      } else if (isPhone) {

        deviceTypeStr = '手机设备';

      } else if (isTablet) {

        deviceTypeStr = '平板设备';

      }

      

      // 解析错误信息

      var stackInfo = parseErrorStack(errorObj);

      

      // 构建详细的错误消息

      var errorMsg = '=== ' + deviceTypeStr + ' JS兼容性错误 ===\n';

      

      // 错误基本信息

      errorMsg += '错误信息: ' + (errorObj.message || stackInfo.message || '未知错误') + '\n';

      

      // 错误位置信息（重点突出）

      errorMsg += '>>> 错误位置 <<<\n';

      errorMsg += '文件: ' + stackInfo.fileName + '\n';

      errorMsg += '行号: ' + stackInfo.lineNumber + '\n';

      errorMsg += '列号: ' + stackInfo.columnNumber + '\n';

      

      if (stackInfo.functionName !== '未知函数') {

        errorMsg += '函数: ' + stackInfo.functionName + '\n';

      }

      

      // 上下文信息

      if (contextStr) {

        errorMsg += '上下文: ' + contextStr + '\n';

      }

      

      // 设备信息

      errorMsg += '>>> 设备信息 <<<\n';

      if (iosVersion) {

        errorMsg += 'iOS版本: ' + iosVersion.toString() + '\n';

      }

      

      // 时间戳

      var now = new Date();

      errorMsg += '时间: ' + now.getHours() + ':' + 

                  (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +

                  (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() + '\n';

      

      // 用户代理信息（简化显示）

      if (ua && ua.length > 0) {

        var uaInfo = ua.length > 80 ? ua.substring(0, 80) + '...' : ua;

        errorMsg += 'UA: ' + uaInfo;

      }

      

      try {

        debugLog('Alert失败，错误信息：' + errorMsg, 'error');

        debugLog('堆栈信息：' + stackInfo.stackTrace, 'error');

        

        // 同时输出到控制台（便于开发调试）

        debugLog('移动设备JS错误详情：' + JSON.stringify({

          device: deviceTypeStr,

          error: errorObj,

          stackInfo: stackInfo,

          context: contextStr,

          userAgent: ua

        }), 'error');

        

      } catch (displayError) {

        // 所有显示方式都失败时的最后降级处理

        debugLog('错误显示失败，原始错误：' + errorMsg, 'error');

        debugLog('显示错误：' + displayError, 'error');

        debugLog('堆栈信息：' + stackInfo.stackTrace, 'error');

      }

    }

  },



  /**

   * 设备类型检测缓存

   * @description 缓存最近一次的设备类型检测结果，避免重复计算

   * @type {number|null} 缓存的设备类型，null表示无缓存

   * @private

   */

  _termTypeCache: null,

  

  /**

   * 缓存时间戳

   * @description 记录缓存创建的时间，用于判断缓存是否过期

   * @type {number} 时间戳（毫秒）

   * @private

   */

  _termTypeCacheTime: 0,

  

  /**

   * 预编译的正则表达式

   * @description 预编译常用的正则表达式，避免重复编译提升性能

   * @type {Object} 正则表达式对象集合

   * @private

   */

  _termTypeRegex: {

    windowsPhone: /(?:Windows Phone)/,   // Windows Phone设备

    symbian: /(?:SymbianOS)/,            // Symbian系统设备

    android: /(?:Android)/,              // Android系统设备

    firefox: /(?:Firefox)/,              // Firefox浏览器

    chrome: /(?:Chrome|CriOS)/,          // Chrome浏览器（包括iOS版）

    ipad: /(?:iPad|PlayBook)/,           // iPad和PlayBook平板

    // 华为设备检测

    huawei: /(?:HUAWEI|Honor|HarmonyOS|MatePad|MediaPad|HuaweiBrowser)/i,

    huaweiTablet: /(?:MatePad|MediaPad|HUAWEI.*(?:Tablet|PAD)|Honor.*(?:Tablet|PAD))/i,

    mobile: /(?:Mobile)/,                // 移动设备标识

    iphone: /(?:iPhone)/,                // iPhone设备

    macintosh: /(?:Macintosh)/,          // Mac系统

    windows: /(?:Windows)/,              // Windows系统

    linux: /(?:Linux|X11)/,              // Linux系统

    tablet: /(?:Tablet)/                 // 平板设备标识

  },



  /**

   * 获取终端设备类型

   * @description 检测当前访问设备的类型，支持缓存机制和智能检测

   * @returns {number} 设备类型：0-其他；1-PC；2-手机；3-平板(横屏)；4-平板(竖屏)

   */

  getTermType: function () {

    // 检查缓存

    var now = Date.now();

    var cacheExpiry = this._getCacheExpiry();

    

    if (this._termTypeCache && 

        (now - this._termTypeCacheTime) < cacheExpiry) {

      return this._termTypeCache;

    }

    

    var ua = navigator.userAgent;

    debugLog('设备检测 - User Agent:' + ua);

    

    // 1. 先检查是否是伪装成PC的平板设备

    var fakePCDetection = this._detectFakePCDevice(ua);

    if (fakePCDetection > 0) {

      debugLog('检测到伪装PC的平板设备，类型:' + fakePCDetection);

      this._termTypeCache = fakePCDetection;

      this._termTypeCacheTime = now;

      return fakePCDetection;

    }

    

    // 2. 华为设备特殊检测

    var huaweiDetection = this._detectHuaweiDevice(ua);

    if (huaweiDetection > 0) {

      debugLog('华为设备检测结果:' + huaweiDetection);

      this._termTypeCache = huaweiDetection;

      this._termTypeCacheTime = now;

      return huaweiDetection;

    }

    

    // 3. 标准设备检测流程

    var flags = this._parseUAFlags(ua);

    

    // iPhone检测

    if (flags.isIphone && !flags.isIpad) {

      this._termTypeCache = 2;

      this._termTypeCacheTime = now;

      return 2;

    }

    

    // iPad检测

    if (flags.isIpad) {

      var orientation = this._getOrientation();

      this._termTypeCache = orientation;

      this._termTypeCacheTime = now;

      return orientation;

    }

    

    // Android设备检测

    if (flags.isAndroid && !flags.isHuawei) {

      var androidType = flags.isMobile ? 2 : this._getOrientation();

      this._termTypeCache = androidType;

      this._termTypeCacheTime = now;

      return androidType;

    }

    

    // Windows Phone和Symbian

    if (flags.isWindowsPhone || flags.isSymbian) {

      this._termTypeCache = 2;

      this._termTypeCacheTime = now;

      return 2;

    }

    

    // Firefox平板

    if (flags.isFireFox && flags.isTablet) {

      var orientation = this._getOrientation();

      this._termTypeCache = orientation;

      this._termTypeCacheTime = now;

      return orientation;

    }

    

    // 4. 兜底检测：根据屏幕尺寸判断

    var fallbackType = this._fallbackDetection();

    this._termTypeCache = fallbackType;

    this._termTypeCacheTime = now;

    return fallbackType;

  },



  /**

   * 检测伪装成PC的平板设备

   * @description 检测具有PC UA特征但实际上是平板设备的伪装情况

   * @param {string} ua - User Agent字符串

   * @returns {number} 设备类型：0-未检测到伪装，3-横屏平板，4-竖屏平板

   * @private

   */

  _detectFakePCDevice: function(ua) {

    try {

      // 1. 检查是否为PC UA

      if (!this._isPCUserAgent(ua)) {

        return 0;

      }

      

      debugLog('检测到PC UA，检查是否伪装设备');

      

      // 2. 检查硬件特征是否匹配平板

      if (!this._hasTabletHardwareFeatures()) {

        return 0;

      }

      

      // 3. 检查UA与硬件特征的矛盾

      if (!this._detectUAHardwareConflict()) {

        return 0;

      }

      

      debugLog('检测到伪装PC的平板设备');

      return this._getOrientation();

      

    } catch (fakeDeviceDetectionError) {

      debugLog('伪装设备检测出错: ' + fakeDeviceDetectionError.message);

      return 0;

    }

  },



  /**

   * 检测是否是PC User Agent

   * @description 检测UA是否显示为PC设备

   * @param {string} ua - User Agent字符串

   * @returns {boolean} 是否是PC UA

   * @private

   */

  _isPCUserAgent: function(ua) {

    // 排除已知的移动设备

    var mobilePatterns = [

      /iPhone/i, /iPad/i, /iPod/i, /Android/i, /Windows Phone/i,

      /BlackBerry/i, /Mobile/i, /Tablet/i, /Kindle/i, /Silk/i

    ];

    

    for (var i = 0; i < mobilePatterns.length; i++) {

      if (mobilePatterns[i].test(ua)) {

        return false;

      }

    }

    

    // 检查是否包含PC平台标识

    var pcPatterns = [

      /Windows NT/i, /Macintosh/i, /Linux/i, /X11/i,

      /Win64/i, /WOW64/i, /x64/i, /x86_64/i

    ];

    

    for (var j = 0; j < pcPatterns.length; j++) {

      if (pcPatterns[j].test(ua)) {

        return true;

      }

    }

    

    return false;

  },



  /**

   * 检测平板硬件特征

   * @description 通过屏幕尺寸、触摸支持等检测平板特征

   * @returns {boolean} 是否具备平板硬件特征

   * @private

   */

  _hasTabletHardwareFeatures: function() {

    // 检测触摸支持

    var hasTouch = 'ontouchstart' in window || 

                   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    

    if (!hasTouch) {

      debugLog('无触摸支持，不是平板');

      return false;

    }

    

    // 检测屏幕尺寸

    if (!window.screen || !window.screen.width || !window.screen.height) {

      debugLog('无法获取屏幕信息');

      return false;

    }

    

    var screenWidth = Math.min(window.screen.width, window.screen.height);

    var screenHeight = Math.max(window.screen.width, window.screen.height);

    

    // 平板屏幕尺寸范围：宽度600-1400px

    if (screenWidth < 600 || screenWidth > 1400) {

      debugLog('屏幕尺寸不符合平板范围: ' + screenWidth + 'px');

      return false;

    }

    

    // 检查长宽比（平板通常在1.2-2.0之间）

    var aspectRatio = screenHeight / screenWidth;

    if (aspectRatio < 1.2 || aspectRatio > 2.0) {

      debugLog('长宽比不符合平板范围: ' + aspectRatio.toFixed(2));

      return false;

    }

    

    // 检测像素密度（平板通常在1.5-3.5之间）

    var dpr = window.devicePixelRatio || 1;

    if (dpr < 1.5 || dpr > 3.5) {

      debugLog('像素密度不符合平板范围: ' + dpr);

      return false;

    }

    

    debugLog('通过平板硬件特征检测');

    return true;

  },



  /**

   * 检测UA与硬件特征的矛盾

   * @description 检测PC UA与平板硬件特征的矛盾

   * @returns {boolean} 是否存在矛盾

   * @private

   */

  _detectUAHardwareConflict: function() {

    var conflictScore = 0;

    var totalChecks = 0;

    

    // 1. 检测触摸支持（PC通常无或有限触摸）

    totalChecks++;

    var hasTouch = 'ontouchstart' in window || 

                   (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    if (hasTouch) {

      conflictScore++;

      debugLog('矛盾检测: PC UA但有触摸屏');

    }

    

    // 2. 检测屏幕尺寸（PC通常较大）

    totalChecks++;

    if (window.screen && window.screen.width) {

      var screenWidth = Math.min(window.screen.width, window.screen.height);

      if (screenWidth <= 1400) { // 平板/笔记本尺寸

        conflictScore++;

        debugLog('矛盾检测: PC UA但屏幕较小: ' + screenWidth + 'px');

      }

    }

    

    // 3. 检测像素密度（PC通常较低）

    totalChecks++;

    var dpr = window.devicePixelRatio || 1;

    if (dpr >= 2.0) { // 高DPI通常是移动设备

      conflictScore++;

      debugLog('矛盾检测: PC UA但高DPI: ' + dpr);

    }

    

    // 4. 检测多点触控（PC通常不支持）

    totalChecks++;

    var maxTouchPoints = navigator.maxTouchPoints || 0;

    if (maxTouchPoints >= 5) { // 多点触控通常是平板

      conflictScore++;

      debugLog('矛盾检测: PC UA但支持多点触控: ' + maxTouchPoints + '点');

    }

    

    // 5. 检测指针类型（PC通常为fine）

    totalChecks++;

    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {

      conflictScore++;

      debugLog('矛盾检测: PC UA但指针类型为coarse');

    }

    

    // 计算矛盾比例

    var conflictRatio = totalChecks > 0 ? conflictScore / totalChecks : 0;

    debugLog('UA-硬件矛盾检测: ' + conflictScore + '/' + totalChecks + ' = ' + conflictRatio.toFixed(2));

    

    // 如果有超过60%的矛盾特征，就认为是伪装设备

    return conflictRatio >= 0.6;

  },



  /**

   * 检测华为设备

   * @description 专门处理华为设备的检测逻辑

   * @param {string} ua - User Agent字符串

   * @returns {number} 设备类型：0-非华为设备，其他-设备类型

   * @private

   */

  _detectHuaweiDevice: function(ua) {

    var regex = this._termTypeRegex;

    

    // 检查是否是华为设备

    if (!regex.huawei.test(ua)) {

      return 0;

    }

    

    debugLog('检测到华为设备:' + ua);

    

    // 华为平板检测

    if (regex.huaweiTablet.test(ua)) {

      debugLog('华为平板标识检测');

      return this._getOrientation();

    }

    

    // 鸿蒙系统检测

    if (/HarmonyOS/i.test(ua)) {

      debugLog('鸿蒙系统设备检测');

      var harmonyType = this._detectHarmonyOSDevice(ua);

      if (harmonyType > 0) {

        return harmonyType;

      }

    }

    

    // 华为Android设备检测

    if (regex.android.test(ua)) {

      debugLog('华为Android设备检测');

      var hasMobile = regex.mobile.test(ua);

      return hasMobile ? 2 : this._getOrientation();

    }

    

    // 华为其他设备（可能是鸿蒙平板）

    debugLog('华为其他设备，默认为平板');

    return this._getOrientation();

  },



  /**

   * 检测鸿蒙系统设备类型

   * @description 处理鸿蒙系统的设备类型检测

   * @param {string} ua - User Agent字符串

   * @returns {number} 设备类型：0-无法判断，其他-设备类型

   * @private

   */

  _detectHarmonyOSDevice: function(ua) {

    var regex = this._termTypeRegex;

    

    // 检查是否有Mobile标识

    var hasMobile = regex.mobile.test(ua);

    

    // 鸿蒙系统无Mobile标识，通常是平板

    if (!hasMobile) {

      debugLog('鸿蒙系统无Mobile标识，识别为平板');

      return this._getOrientation();

    }

    

    // 通过屏幕尺寸进一步判断

    if (!window.screen || !window.screen.width || !window.screen.height) {

      return 0;

    }

    

    var minDimension = Math.min(window.screen.width, window.screen.height);

    var maxDimension = Math.max(window.screen.width, window.screen.height);

    var aspectRatio = maxDimension / minDimension;

    

    // 手机：通常宽度 < 500px，长宽比 > 1.5

    if (minDimension < 500 && aspectRatio > 1.5) {

      return 2; // 手机

    }

    

    // 平板：通常宽度 >= 600px，长宽比 < 2.0

    if (minDimension >= 600 && aspectRatio < 2.0) {

      return this._getOrientation(); // 平板

    }

    

    // 中等尺寸设备：根据像素密度进一步判断

    if (minDimension >= 500 && minDimension < 600) {

      var dpr = window.devicePixelRatio || 1;

      return dpr >= 3 ? 2 : this._getOrientation();

    }

    

    // 默认情况

    return minDimension >= 540 ? this._getOrientation() : 2;

  },



  /**

   * 解析UA标志位

   * @description 一次性解析UA中的所有关键标志位

   * @param {string} ua - User Agent字符串

   * @returns {Object} 标志位对象

   * @private

   */

  _parseUAFlags: function(ua) {

    var regex = this._termTypeRegex;

    

    return {

      isWindowsPhone: regex.windowsPhone.test(ua),

      isSymbian: regex.symbian.test(ua),

      isAndroid: regex.android.test(ua),

      isFireFox: regex.firefox.test(ua),

      isChrome: regex.chrome.test(ua),

      isHuawei: regex.huawei.test(ua),

      isHuaweiTablet: regex.huaweiTablet.test(ua),

      isMobile: regex.mobile.test(ua),

      isIphone: regex.iphone.test(ua),

      isIpad: regex.ipad.test(ua),

      isMacintosh: regex.macintosh.test(ua),

      isWindows: regex.windows.test(ua),

      isLinux: regex.linux.test(ua),

      isTablet: regex.tablet.test(ua)

    };

  },



  /**

   * 获取屏幕方向

   * @description 安全地检测屏幕方向，用于区分横屏和竖屏平板

   * @returns {number} 3-横屏平板，4-竖屏平板

   * @private

   */

  _getOrientation: function() {

    if (!this._safeScreenCheck()) {

      return 3; // 默认横屏

    }

    return window.screen.width < window.screen.height ? 4 : 3;

  },



  /**

   * 安全的屏幕属性检查

   * @description 检查window.screen对象及其属性是否可用，防止运行时错误

   * @returns {boolean} 屏幕属性是否可安全访问

   * @private

   */

  _safeScreenCheck: function() {

    return window.screen && 

           typeof window.screen.width === 'number' && 

           typeof window.screen.height === 'number' &&

           window.screen.width > 0 && 

           window.screen.height > 0;

  },



  /**

   * 兜底检测

   * @description 当所有其他检测方法都无法确定设备类型时的最终处理

   * @returns {number} 设备类型

   * @private

   */

  _fallbackDetection: function() {

    var ua = navigator.userAgent;

    var regex = this._termTypeRegex;

    

    // 基于平台的兜底判断

    if (regex.windows.test(ua)) return 1;

    if (regex.macintosh.test(ua) && !regex.ipad.test(ua)) return 1;

    if (regex.linux.test(ua) && !regex.android.test(ua)) return 1;

    

    // 基于屏幕尺寸的兜底判断

    if (this._safeScreenCheck()) {

      var screenWidth = Math.min(window.screen.width, window.screen.height);

      if (screenWidth <= 480) return 2; // 小屏幕 -> 手机

      if (screenWidth <= 1024) return this._getOrientation(); // 中等屏幕 -> 平板

    }

    

    return 1; // 默认PC

  },



  /**

   * 智能缓存策略

   * @description 根据环境自动调整缓存时间，平衡开发体验和生产性能

   * @returns {number} 缓存过期时间（毫秒）

   * @private

   */

  _getCacheExpiry: function() {

    // 开发环境使用较短缓存，便于调试和测试

    if (window.location.hostname === 'localhost' || 

        window.location.hostname.indexOf('dev') !== -1 ||

        window.location.hostname.indexOf('test') !== -1) {

      return 5000; // 5秒

    }

    // 生产环境使用较长缓存，提升性能

    return 60000; // 60秒

  },



  /**

   * 清除设备类型缓存

   * @description 强制清除缓存，下次调用getTermType时将重新检测设备类型

   */

  clearTermTypeCache: function() {

    this._termTypeCache = null;

    this._termTypeCacheTime = 0;

  },



  /**

   * 获取设备信息

   */

  getDeviceInfo: function() {

    // 缓存设备类型，避免重复调用

    var deviceType = this.getTermType();

    

    return {

      userAgent: navigator.userAgent,

      screen: window.screen.width + 'x' + window.screen.height,

      dpr: window.devicePixelRatio || 1,

      platform: navigator.platform,

      detectedType: deviceType,

      detectedTypeName: this.getTermTypeName(deviceType)

    };

  },



  /**

   * 获取设备类型名称

   */

  getTermTypeName: function(type) {

    if (type === undefined) {

      type = this.getTermType();

    }

    

    return type === 0 ? '其他' :

           type === 1 ? 'PC' :

           type === 2 ? '手机' :

           type === 3 ? '平板(横屏)' : '平板(竖屏)';

  },



  /**

   * 判断是否为移动设备

   */

  isMobileDevice: function() {

    var deviceType = this.getTermType();

    return deviceType === 2 || deviceType === 3 || deviceType === 4;

  },



  /**

   * 判断是否为平板设备

   */

  isTabletDevice: function() {

    var deviceType = this.getTermType();

    return deviceType === 3 || deviceType === 4;

  },

  

  /**

   * 判断是否为PC设备

   */

  isPCDevice: function() {

    return this.getTermType() === 1;

  },



  //加密IP地址

  getkey: function (ip){

    var ret=0;

    var len=ip.length;

    for(var i=0;i<len;i++)

    ret^=ip.charCodeAt(i);

    return ret;

  },

  enc_pwd:function (passIn,key){

    var passOut="";

    if(typeof(passIn) == 'undefined' || passIn == '') return passOut;

    var len=passIn.length;

    // if(len>512)return "-1";

    var ch=0;

    var str="";

    for(var i=0;i<len;i++){

      ch=passIn.charCodeAt(i)^key;

      str=ch.toString(16);

      if(str.length==1)str="0"+str;

      passOut+=str;

    }

    return passOut;

  },

  _jsonp: function (params) {

    var me = this;

    var lang = store.get("i18n_lang") == "en" || store.get("i18n_lang") == "ru" ? store.get("i18n_lang") : "zh";

    //格式化参数  

    var formatParams = function (data) {

      var arr = [];

      for (var name in data) {

        if (name == 'callback') {

          arr.unshift(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));

        }

        // encodeURIComponent方法以UTF-8进行编码，而中文别名要求以GBK编码。

        else if (term.enable_alias == 1) {

          // 参数为中文账号，并启用别名认证时，参数值不做urlencode编码。

          var patthrn = /.*[\u4e00-\u9fa5]+.*$/;

          if((name == 'DDDDD' || name == 'user_account') && patthrn.test(data[name])) {

            arr.push(name + '=' + data[name]);

          }

          else {

            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));  

          }

        }

        else {

          arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));

        }

      };

      // 添加一个随机数，防止缓存

      arr.push('v=' + random());

      // 添加中英文标识

      arr.push('lang=' + lang);

      return arr.join('&');

    };

    // 获取随机数  

    var random = function () {

      return Math.floor(Math.random() * 10000 + 500);

    };



    params = params || {};

    params.data = params.data || {};



    // 设置方案索引

    params.data['program_index'] = page.name;

    // 设置页面索引

    params.data['page_index'] = page.index;



    // apg开启时加密传输,先进行apg加密再进行页面加密，对应接口逻辑先页面解密再进行apg参数解密

    if(

        typeof (apg_switch) !== 'undefined'

        && apg_switch === '1'

        && params.url.indexOf('eportal/portal') > -1

        && params.url.indexOf('wifidog/disconnect') == -1

    ){



      // 防止加密参数为空，添加时间戳

      params.data['apgTime']= new Date().getTime();

      var encryptData = '';

      // 加密方式

      if (apg_encrypt_type == '0'){

        encryptData = util.aesEncode(JSON.stringify(params.data),apg_page_secret);

      }else{



      }

      if (encryptData != '') params.data = { 'params': encryptData };

    }



    // jsonp请求

    //创建script标签并加入到页面中

    var callbackName = 'dr' + me.increment(); // 自定义 callbackName

    var head = document.getElementsByTagName('head')[0];

    // 设置传递给后台的回调参数名

    params.data['callback'] = callbackName;

    // 默认带上 jsVersion  

    params.data['jsVersion'] = typeof(jsVersion) =='undefined'?'4.X':jsVersion;



    //根据参数判断是否加密数据

    if(

        page_data_encrypt == 1

        && params.url.indexOf('eportal/portal') > -1

        && params.url.indexOf('wifidog/disconnect') == -1

        && params.url.indexOf('page/loadConfig') == -1

    ){

      if(encryption_type == '1'){

        //加密传输的数据

        var keys = this.getkey(secret_key);

      }else{

        //加密传输的数据

        var keys = this.getkey(term.ip);//这里应该用终端实际IP,可从ss5登参数中获取

      }

      var arr = [];

      for(var key  in params.data){

        if (parseFloat(params.data[key]).toString() != "NaN") { 

          params.data[key] = params.data[key].toString();

        }

        arr[key] = this.enc_pwd(params.data[key],keys);  

      }

      // 用来区分是portal前端还是vue传的参数

      arr['encrypt'] = 1;

      // Object.assign() 是 ES6 方法，在旧浏览器中可能不支持

      //arr = Object.assign({},arr);//数组转为对象

      // 替代方案：使用 ES5 兼容的方式

      var newObj = {};

      for (var key in arr) {

        if (arr.hasOwnProperty(key)) {

          newObj[key] = arr[key];

        }

      }

      arr = newObj;



      var data = formatParams(arr);

    }else{

      var data = formatParams(params.data);

    }



    var script = document.createElement('script');    

    

    // 标记请求是否成功

    var requestCompleted = false;

    

    // 创建jsonp回调函数

    window[callbackName] = function (json) {

      requestCompleted = true;

      head.removeChild(script);

      clearTimeout(script.timer);

      window[callbackName] = null;

      params.success && params.success(json,'',(params.complete&&params.complete()));

    };

    

    // 兼容IE8的错误处理

    if (script.addEventListener) {

      // 现代浏览器使用onerror

      script.onerror = function() {

        if (!requestCompleted && params.data && params.data['operate'] === "portal_login") {

          handleJsonpError();

        }

      };

    } else if (script.attachEvent) {

      // IE8使用onreadystatechange

      script.attachEvent('onreadystatechange', function() {

        if (/loaded|complete/.test(script.readyState)) {

          // 延迟检查是否调用了回调

          setTimeout(function() {

            if (!requestCompleted && params.data && params.data['operate'] === "portal_login") {

              handleJsonpError();

            }

          }, 100);

        }

      });

    }

    

    // 全局错误捕获（兼容IE8+）

    var originalOnError = window.onerror;

    window.onerror = function (message, source, lineno, colno, error) {

      // 尝试捕获非JSONP响应的语法错误

      if (params.data && params.data['operate'] === "portal_login" && 

          source === script.src && 

          (message === "Uncaught SyntaxError: Unexpected token '<'" || 

           message.indexOf('SyntaxError') !== -1)) {

        head.removeChild(script);

        clearTimeout(script.timer);

        window[callbackName] = null;

        window.onerror = originalOnError; // 恢复默认错误处理

        

        handleJsonpError();

        return true; // 阻止错误继续抛出

      }

      return false;

    };

    

    // 处理JSONP错误的通用函数

    function handleJsonpError() {

      // 只有 operate 为 portal_login 时才处理

      if (params.data && params.data['operate'] === "portal_login") {

        try {

          debugLog("检测到 portal_login 操作失败，执行错误处理");

          page.kind = term.type == 1 ? 'pc_2' : util.switchPageKind(term.type)+'_32';

          

          page.render(function () {

            $('#message').html('服务器内部错误，请返回认证页重新登录');

          });

          

          params.error && params.error({

            message: '请求失败'

          }, '', (params.complete && params.complete()));

          

        } catch (jsonpHandleError) {

          debugLog("handleJsonpError 处理出错:" + jsonpHandleError, "error");

        }

      } else {

        debugLog("非 portal_login 操作，跳过错误处理");

      }

    }

    

    // 设置超时处理  

    if (params.time) {

      script.timer = setTimeout(function () {

        if (!requestCompleted) {

          window[callbackName] = null;

          head.removeChild(script);

          params.error && params.error({

            message: '超时'

          },'',(params.complete&&params.complete()));

        }

      }, params.time);

    }

    

    // 发送请求  

    script.src = params.url + (params.url.indexOf('?') > 0 ? '&' : '?') + data;

    head.appendChild(script);

  },

  _load: function (type, url, callback) {

    var _doc = document.getElementsByTagName('head')[0];

    if (type == "css") {

      var fileref = document.createElement("link");

      fileref.setAttribute("rel", "stylesheet");

      fileref.setAttribute("type", "text/css");

      fileref.setAttribute("href", url);



      _doc.appendChild(fileref);

    } else if (type == 'js') {

      var script = document.createElement('script');

      script.setAttribute('type', 'text/javascript');

      script.setAttribute('src', url);



      _doc.appendChild(script);

      script.onload = script.onreadystatechange = function () {

        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {

          script.onload = script.onreadystatechange = null;

          callback && callback();

        }

      };

    }

  },

  //将16进制IP转为点分十进制串

  hex16ToString: function (hex16IP) {

    var stringIP = parseInt(hex16IP.substr(0, 2), 16).toString(10) + "." + parseInt(hex16IP.substr(2, 2), 16).toString(10) + "." + parseInt(hex16IP.substr(4, 2), 16).toString(10) + "." + parseInt(hex16IP.substr(6, 2), 16).toString(10);

    return stringIP;

  },

  base64EncodeChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

  base64DecodeChars: new Array(- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),

  base64encode: function (str) {

    var base64EncodeChars = this.base64EncodeChars;

    var out, i, len;

    var c1, c2, c3;

    len = str.length;

    i = 0;

    out = "";

    while (i < len) {

      c1 = str.charCodeAt(i++) & 0xff;

      if (i == len) {

        out += base64EncodeChars.charAt(c1 >> 2);

        out += base64EncodeChars.charAt((c1 & 0x3) << 4);

        out += "==";

        break;

      }

      c2 = str.charCodeAt(i++);

      if (i == len) {

        out += base64EncodeChars.charAt(c1 >> 2);

        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));

        out += base64EncodeChars.charAt((c2 & 0xF) << 2);

        out += "=";

        break;

      }

      c3 = str.charCodeAt(i++);

      out += base64EncodeChars.charAt(c1 >> 2);

      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));

      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));

      out += base64EncodeChars.charAt(c3 & 0x3F);

    }

    return out;

  },

  /**

  * base64解码

  * @param {Object} str

  */

  base64decode: function (str) {

    var base64DecodeChars = this.base64DecodeChars;

    var c1, c2, c3, c4;

    var i, len, out;

    len = str.length;

    i = 0;

    out = "";

    while (i < len) {

      /* c1 */

      do {

        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];

      } while (i < len && c1 == - 1);

      if (c1 == -1) break;

      /* c2 */

      do {

        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];

      } while (i < len && c2 == - 1);

      if (c2 == -1) break;

      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      /* c3 */

      do {

        c3 = str.charCodeAt(i++) & 0xff;

        if (c3 == 61) return out;

        c3 = base64DecodeChars[c3];

      } while (i < len && c3 == - 1);

      if (c3 == -1) break;

      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      /* c4 */

      do {

        c4 = str.charCodeAt(i++) & 0xff;

        if (c4 == 61) return out;

        c4 = base64DecodeChars[c4];

      } while (i < len && c4 == - 1);

      if (c4 == -1) break;

      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);

    }

    return out;

  },

/**

   * base64编码(兼容ES5，支持中文)

   * @param {string} input - 要编码的字符串

   * @returns {string} Base64编码后的字符串

   */

  base64Encode: function (input) {

    var me = this;

    var base64Chars = me.base64EncodeChars;

    var utf8Bytes = [];

    

    // 手动实现 UTF-8 编码（ES5兼容）

    for (var i = 0; i < input.length; i++) {

      var charCode = input.charCodeAt(i);

      

      if (charCode < 128) {

        // 单字节字符

        utf8Bytes.push(charCode);

      } else if (charCode < 2048) {

        // 双字节字符

        utf8Bytes.push(192 + (charCode >> 6));

        utf8Bytes.push(128 + (charCode & 63));

      } else if (charCode < 65536) {

        // 三字节字符

        utf8Bytes.push(224 + (charCode >> 12));

        utf8Bytes.push(128 + ((charCode >> 6) & 63));

        utf8Bytes.push(128 + (charCode & 63));

      } else {

        // 四字节字符（基本用不到，但保持完整性）

        utf8Bytes.push(240 + (charCode >> 18));

        utf8Bytes.push(128 + ((charCode >> 12) & 63));

        utf8Bytes.push(128 + ((charCode >> 6) & 63));

        utf8Bytes.push(128 + (charCode & 63));

      }

    }

    

    // 将每个字节转换为二进制字符串

    var binaryString = '';

    for (var j = 0; j < utf8Bytes.length; j++) {

      var byteStr = utf8Bytes[j].toString(2);

      // ES5兼容的 padStart 实现

      while (byteStr.length < 8) {

        byteStr = '0' + byteStr;

      }

      binaryString += byteStr;

    }

    

    // 按 6 位拆分

    var chunks = [];

    for (var k = 0; k < binaryString.length; k += 6) {

      var chunk = binaryString.slice(k, k + 6);

      // ES5兼容的 padEnd 实现

      if (chunk.length < 6) {

        while (chunk.length < 6) {

          chunk += '0';

        }

      }

      chunks.push(chunk);

    }

    

    // 查找对应的 Base64 字符

    var base64Encoded = '';

    for (var l = 0; l < chunks.length; l++) {

      var index = parseInt(chunks[l], 2); // 将二进制转换为数字

      base64Encoded += base64Chars.charAt(index);

    }

    

    // 添加填充字符

    while (base64Encoded.length % 4 !== 0) {

      base64Encoded += '=';

    }

    

    return base64Encoded;

  },



  /**

   * base64解码(兼容ES5，支持中文)

   * @param {string} input - Base64编码的字符串

   * @returns {string} 解码后的原始字符串

   */

  base64Decode: function (input) {

    var me = this;

    var base64Chars = me.base64EncodeChars;

    

    // 去除填充字符 '='

    input = input.replace(/=/g, '');

    

    // 将每个 Base64 字符转换为 6 位二进制

    var binaryString = '';

    for (var i = 0; i < input.length; i++) {

      var index = base64Chars.indexOf(input.charAt(i));

      if (index === -1) continue;

      

      var binStr = index.toString(2);

      // ES5兼容的 padStart 实现

      while (binStr.length < 6) {

        binStr = '0' + binStr;

      }

      binaryString += binStr;

    }

    

    // 每 8 位一个字节，转换为字节

    var decodedBytes = [];

    for (var j = 0; j < binaryString.length; j += 8) {

      var byte = binaryString.slice(j, j + 8);

      if (byte.length === 8) {

        decodedBytes.push(parseInt(byte, 2));

      }

    }

    

    // 手动实现 UTF-8 解码（ES5兼容）

    var result = '';

    var i = 0;

    

    while (i < decodedBytes.length) {

      var byte1 = decodedBytes[i++];

      

      if (byte1 < 128) {

        // 单字节字符

        result += String.fromCharCode(byte1);

      } else if (byte1 >= 192 && byte1 < 224) {

        // 双字节字符

        var byte2 = decodedBytes[i++];

        if (byte2 === undefined) break;

        var charCode = ((byte1 & 31) << 6) | (byte2 & 63);

        result += String.fromCharCode(charCode);

      } else if (byte1 >= 224 && byte1 < 240) {

        // 三字节字符

        var byte2 = decodedBytes[i++];

        var byte3 = decodedBytes[i++];

        if (byte2 === undefined || byte3 === undefined) break;

        var charCode = ((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63);

        result += String.fromCharCode(charCode);

      } else if (byte1 >= 240) {

        // 四字节字符（基本用不到）

        var byte2 = decodedBytes[i++];

        var byte3 = decodedBytes[i++];

        var byte4 = decodedBytes[i++];

        if (byte2 === undefined || byte3 === undefined || byte4 === undefined) break;

        // 处理代理对（超出 BMP 的字符）

        var codePoint = ((byte1 & 7) << 18) | ((byte2 & 63) << 12) | 

                       ((byte3 & 63) << 6) | (byte4 & 63);

        

        if (codePoint <= 0xFFFF) {

          result += String.fromCharCode(codePoint);

        } else {

          // 转换为代理对

          codePoint -= 0x10000;

          var highSurrogate = 0xD800 + (codePoint >> 10);

          var lowSurrogate = 0xDC00 + (codePoint & 0x3FF);

          result += String.fromCharCode(highSurrogate, lowSurrogate);

        }

      }

    }

    

    return result;

  },



  /**

   * ES5兼容的字符串填充函数（模拟 padStart）

   * @param {string} str - 原始字符串

   * @param {number} targetLength - 目标长度

   * @param {string} padString - 填充字符

   * @returns {string} 填充后的字符串

   */

  stringPadStart: function (str, targetLength, padString) {

    str = String(str);

    targetLength = targetLength >> 0; // 转换为32位整数

    padString = String(padString || ' ');

    

    if (str.length >= targetLength) {

      return str;

    }

    

    targetLength = targetLength - str.length;

    if (targetLength > padString.length) {

      // 重复填充字符串

      padString += padString.repeat ? 

        padString.repeat(targetLength / padString.length) : 

        this.repeatString(padString, Math.ceil(targetLength / padString.length));

    }

    

    return padString.slice(0, targetLength) + str;

  },



  /**

   * ES5兼容的字符串重复函数（模拟 String.prototype.repeat）

   * @param {string} str - 要重复的字符串

   * @param {number} count - 重复次数

   * @returns {string} 重复后的字符串

   */

  repeatString: function (str, count) {

    count = Math.floor(count);

    if (count < 0) throw new RangeError('Invalid count value');

    

    var result = '';

    for (var i = 0; i < count; i++) {

      result += str;

    }

    return result;

  },

  /*    

  * 整数方法补0或者任意字符

  * @param num: 需要固定位数的数字或字符串;

  * @param totalBit: 保证返回字符串的长度, 默认为10;

  * @param isFront: 当num位数不足时, 新填充的字符串是否位于num前面, 默认为true;

  * @param fixedChar: 当num位数不足时, 重复填充此字符, 默认为'0';

  * @param alwaysCut: 是否始终保证返回值长度为totalBit, 此值为true时, 如果给定num的长东超过参数中totalBit的大小时, 也会截取totalBit长度的字符串, 默认为false

  */

  toFixedBit: function (num, totalBit, isFront, fixedChar, alwaysCut) {

    if (totalBit === void 0) { totalBit = 10; }

    if (isFront === void 0) { isFront = true; }

    if (fixedChar === void 0) { fixedChar = "0"; }

    if (alwaysCut === void 0) { alwaysCut = false; }

    var nn = num.toString();

    if (!alwaysCut && nn.length >= totalBit) {

        return nn;

    }

    var rtn = "";

    for (var i = 0; i < totalBit; i++) {

        rtn += fixedChar;

    }

    if (isFront) {

        rtn += nn;

        rtn = rtn.substr(rtn.length - totalBit);

    }

    else {

        rtn = nn + rtn;

        rtn = rtn.substr(0, totalBit);

    }

    return rtn;

  },

  //ip地址转换10进制数字

  ipToParseInt: function (ip) {

    ip = ip.split('.');

    ip = (parseInt(ip[0]) << 24 |

        parseInt(ip[1]) << 16 |

        parseInt(ip[2]) << 8 |

        parseInt(ip[3])) >>> 0;

    return ip;

  },

  // 根据设备类型转成业务定义名称

  switchPageKind: function (term_type){

    var page_kind = '';

    try {

      var termType = parseInt(term_type);

      

      // 添加边界情况处理

      if (isNaN(termType) || termType < 0 || termType > 4) {

        debugLog('无效的设备类型: ' + term_type + '，使用默认值PC', 'warn');

        termType = 1; // 默认为PC页面

      }

      

      switch (termType) {

        case 1:

          page_kind = 'pc';

          break;

        case 2: 

          page_kind = 'mobile';

          break;

        case 3: 

          page_kind = 'hipad';

          break;

        case 4: 

          page_kind = 'vipad';

          break;

        case 0:

        default:

          // 未知设备默认为PC页面

          page_kind = 'pc';

          break;

      }

    } catch (pageKindSwitchError) {

      debugLog('switchPageKind 执行错误:' + pageKindSwitchError, 'error');

      page_kind = 'pc'; // 出现错误时默认为PC页面

    }

    

    return page_kind;

  },

  // 连接弹窗字符串

  concatStrBySpacer: function (msg) {

    var me = this;



    // 连接字符串

    var s = "";

  

    // 间隔符

    var spacer = "<br>";

  

    // 字符串索引

    var pos = 0;

  

    // 字符串长度

    var str_len = msg.length;



    // 字符串实际长度

    var curr_msg_len = util.chineseCharLen(msg);



    // 英文字符最大个数

    var max_e_char = 29;

  

    // 英文字符最小个数 

    var min_e_char = 25;

  

    // 中文字符最大个数

    var max_c_char = 33;

  

    // 中文字符最小个数 

    var min_c_char = 10;

  

    // 中文正则

    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g"); 

      

    // 弹窗提示显示行数

    var msg_line = 1; 

    if(reg.test(msg)) {

      // 弹窗提示显示行数(有余数向上取整)

      msg_line = Math.ceil(curr_msg_len/max_c_char);

    }

    else{

      msg_line = Math.ceil(curr_msg_len/max_e_char);    

    }



    // 弹窗提示每行截取字符长度(有余数向上取整)

    var cut_len = Math.ceil(curr_msg_len/msg_line);



    while(pos < str_len) {

      var cur_str = "";   

      if(reg.test(msg)) {

        if(util.chineseCharLen(msg) <= max_c_char){

          cur_str = msg;

        }

        else {

          // 截断中文字符串

          cur_str = me.cutChineseStr(msg, cut_len, max_c_char);

        }

      }

      else {

        if(util.chineseCharLen(msg) <= max_e_char){

          cur_str = msg;

        }

        else {

          // 截断中文字符串

          cur_str = me.cutEnglishStr(msg, cut_len, max_c_char);

        }

      }

      // 剩余字符串

      msg = msg.substr(cur_str.length);

      s += cur_str;

      if(msg.length != 0) s += spacer;

      pos += cur_str.length;

    }

    

    return s;

  },

  // 截断英文字符串

  cutEnglishStr: function (str, cut_len, limit_len) {

    var s = "";

    // 判断当前字符非空格，则从截断字符串从后向前搜索第一个空格

    if(cut_len < str.length && str.charAt(cut_len) != ' '){

      var temp_str = str.substr(0, cut_len);

      cut_len = temp_str.lastIndexOf(' ') + 1;        

    }

    s = str.substr(0, cut_len);

    return s; 

  },

  // 截断中文字符串

  cutChineseStr: function (str, cut_len, limit_len) {

    var strlen = 0;  

    var s = "";  

    for (var i = 0; i < str.length; i++) {

      // 字符实际长度，中文2，英文1

      if (str.charCodeAt(i) > 128) {  

        strlen += 2;  

      } else {  

        strlen++;  

      }

      if (strlen > cut_len) {  

        if( strlen <= limit_len){

          s += str.charAt(i);

        }

        break;

      }

      else if (strlen == cut_len) {

        s += str.charAt(i);

        break;

      }

      else {

        s += str.charAt(i);

      }

    }  

    return s; 

  },

  // 获取中文字符串长度  

  chineseCharLen: function (str) {

    ///<summary>获得字符串实际长度，中文2，英文1</summary>

    ///<param name="str">要获得长度的字符串</param>

    var realLength = 0, len = str.length, charCode = -1;

    for (var i = 0; i < len; i++) {

      charCode = str.charCodeAt(i);

      if (charCode >= 0 && charCode <= 128) 

        realLength += 1;

      else

        realLength += 2;

    }

    return realLength;

  },

  // 兼容纯IPv4/纯IPv6/IPv4联动IPv6

  // 校验是否为IPv4地址

  validIPv4: function (ip) {

    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

    return reg.test(ip);

  },

  // 校验是否为IPv6地址

  validIPv6: function (ipv6) {

    var reg = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

    return reg.test(ipv6);

  },

  // aes加密

  aesEncode: function (str, key) {

    return CryptoJS.AES.encrypt(str, CryptoJS.enc.Utf8.parse(key),{

      mode: CryptoJS.mode.ECB,

      padding: CryptoJS.pad.Pkcs7

    }).toString();

  },

  // aes解密

  aesDecode: function (str, key) {

    return CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key),{

      mode: CryptoJS.mode.ECB,

      padding: CryptoJS.pad.Pkcs7

    }).toString(CryptoJS.enc.Utf8);

  },

  // 检测密码强度

  checkPasswordStrength: function (pass) {

    var me = this;

    // 密码强度未启用则不检测

    if(term.enable_verify != 1) return true;

    return me.checkPasswordLength(pass) && me.checkPasswordComposition(pass) && me.checkCharTypeOccurrences(pass) && me.checkPasswordSameCharacterCount(pass) && me.checkPasswordContinuationCharacterCount(pass);

  },

  // 密码长度校验

  checkPasswordLength: function (pass) {

    if(pass.length < term.length_require || pass.length > 32) return false;

    return true;

  },

  // 通过循环检查字符范围

  checkPasswordScope: function (pass) {

    var scope = [];

    scope.push(term.digital_char_scope);

    scope.push(term.upper_case_scope);

    scope.push(term.lower_case_scope);

    scope.push(term.special_char_scope);

  

    // 检查密码中字符是否超出设置范围

    var tempAarry = scope.join('|').split('|');

    for(var i=0; i<pass.length; i++){

      // 密码超出字符范围

      if (!tempAarry.includes(pass.charCodeAt(i).toString())) return false;

    }



    return true;

  },

  // 通过循环检查密码组合

  checkPasswordComposition: function (pass) {

    if(!term.compose_require) return true;



    var scope = [];

    if(term.enable_digital_char) scope.push(term.digital_char_scope);

    if(term.enable_upper_case) scope.push(term.upper_case_scope);

    if(term.enable_lower_case) scope.push(term.lower_case_scope);

    if(term.enable_special_char) scope.push(term.special_char_scope);

    

    // 检查密码是否达到组合要求个数

    var level = 0; // 最初级别



    for(var i=0; i<scope.length; i++) {

      for(var j=0; j<pass.length; j++){

        if (scope[i].includes(pass.charCodeAt(j).toString())) {

          level++;

          break;

        }

      }

    }

    

    if(term.compose_require > level) return false;



    return true;

  },

  // 检查特定字符类型出现次数

  checkCharTypeOccurrences: function (pass) {

    // 检查数字字符要求个数

    if(term.enable_digital_char > 1){

      var digitalCharCount = 0; // 数字字符总数

      for(var j=0; j<pass.length; j++){

        if (term.digital_char_scope.includes(pass.charCodeAt(j).toString())) {

          digitalCharCount++;

        }

      }

      if(digitalCharCount < term.enable_digital_char) return false;

    }



    // 检查大写字母要求个数

    if(term.enable_upper_case > 1){

      var upperCaseCount = 0; // 大写字母总数

      for(var j=0; j<pass.length; j++){

        if (term.upper_case_scope.includes(pass.charCodeAt(j).toString())) {

          upperCaseCount++;

        }

      }

      if(upperCaseCount < term.enable_upper_case) return false;

    }



    // 检查密码是否达到小写字母要求个数

    if(term.enable_lower_case > 1){

      var lowerCaseCount = 0; // 小写字母总数

      for(var j=0; j<pass.length; j++){

        if (term.lower_case_scope.includes(pass.charCodeAt(j).toString())) {

          lowerCaseCount++;

        }

      }

      if(lowerCaseCount < term.enable_lower_case) return false;

    }



    // 检查密码是否达到特殊符号要求个数

    if(term.enable_special_char > 1){

      var specialCharCount = 0; // 特殊符号总数

      for(var j=0; j<pass.length; j++){

        if (term.special_char_scope.includes(pass.charCodeAt(j).toString())) {

          specialCharCount++;

        }

      }

      if(specialCharCount < term.enable_special_char) return false;

    }



    return true;

  },

  // 检查密码是否包含禁止包含账号

  checkPasswordForbidAccount: function (acc, pass) {

    // 禁止包含账号未启用时不检测

    if(term.enable_verify != 1 || term.enable_prohibit_account == 0) return true;

    if(pass.indexOf(acc) != -1) return false;

    return true;

  },

  // 检查密码是否超过相同字符个数

  checkPasswordSameCharacterCount: function (pass) {

    // 禁止相同字符个数为0时不检测

    if(!term.prohibit_same_length) return true;



    var count = 0; // 当前连续字符计数

    var lastAsciiVal = 0; //  上一个ASCII值

    var maxLength = term.prohibit_same_length + 1; // 实际检测的最大长度 = 配置值 + 1

    for(var j=0; j<pass.length; j++){    

      var currentAsciiVal = pass.charCodeAt(j);

      if (currentAsciiVal > 32 && currentAsciiVal < 127) {

        if (currentAsciiVal == lastAsciiVal) {

          count++;

          if (count >= maxLength) {

            // 密码中存在过多相同的字符

            return false;

          }

        } else {

          count = 0; // 重置字符计数

          lastAsciiVal = currentAsciiVal; // 更新上一个ASCII值

        }

      }

    }

    return true;

  },

  // 检查密码是否超过连续字符个数

  checkPasswordContinuationCharacterCount: function (pass) {

    // 禁止连续字符个数为0时不检测

    if(!term.prohibit_continuation_length) return true;

    

    var direction = ""; // 记录当前字符与前一字符之间的升降方向

    var count = 0; // 当前连续字符计数

    var lastAsciiVal = "";  // 上一个ASCII值

    var maxLength = term.prohibit_continuation_length + 1; // 实际检测的最大长度 = 配置值 + 1



    for(var j=0; j<pass.length; j++){

      var currentAsciiVal = pass.charCodeAt(j);



      // 初始化或重置方向记录

      if (lastAsciiVal === "" || (currentAsciiVal != lastAsciiVal + 1 && currentAsciiVal != lastAsciiVal - 1)) {

        direction = "";

      }



      // 检查连续性并确定方向

      if (lastAsciiVal !== "") {

        if (currentAsciiVal == lastAsciiVal + 1) {

          if (direction === "") {

            count++;

            direction = "asc";

          }

          else if (direction === "desc") { // 从降序转为升序，重置计数

            count = 0;

            direction = "asc";

          } 

          else {

            count++; // 继续升序，增加计数

          }

        } else if (currentAsciiVal == lastAsciiVal - 1) {

          if (direction === "") {

            count++;

            direction = "desc";

          }

          else if (direction === "asc") { // 从升序转为降序，重置计数

            count = 0;

            direction = "desc";

          } else {

            count++; // 继续降序，增加计数

          }

        } else {

          // 非连续字符，重置计数

          count = 0;

          direction = "";

        }

      }



      // 密码中存在过多连续的字符

      if (count >= maxLength) {

        return false;

      }



      lastAsciiVal = currentAsciiVal;

    }

    

    return true;

  },



  /**

   * 防抖函数 - ES5语法

   * @param {Function} func 需要防抖的函数

   * @param {number} delay 延迟时间（毫秒）

   * @param {boolean} immediate 是否立即执行

   * @return {Function} 防抖后的函数

   */

  debounce: function(func, delay, immediate) {

    var timeout;

    return function() {

      var context = this;

      var args = arguments;

      var later = function() {

        timeout = null;

        if (!immediate) func.apply(context, args);

      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, delay);

      if (callNow) func.apply(context, args);

    };

  }

};



// 全局对象

var term = {

  account: '', 

  password: '',

  type: 2, // 终端类型 0 其他 1 PC 2 手机 3 平板

  ip: '000.000.000.000', // 终端Ipv4

  ipv6: '', // 终端Ipv6

  mac: '000000000000', // 终端MAC

  vlan: 1, // VLAN ID

  wlanacip: '000.000.000.000', // 接入服务器IP

  wlanacname: '', // 接入服务器名称

  wlanacmac: '000000000000', // 接入服务器MAC

  wlanapmac: '000000000000', // AP MAC

  time: '', // 当前时间

  ssid: '', // SSID

  areaID: '', // 地区ID

  online: {}, // 在线列表

  redirect: '', // 原始跳转地址

  // wifidog匹配参数

  gw_id: '', //gw_id 用于区别wifidog设备

  gw_address: '', //wifidog的IP

  gw_port: '', //wifidog的端口

  gw_token: '', //用户检验token

  

  ISRedirect: 0, // 是否重定向 0 停用 1 启用

  redirectLink: '', // 登录重定向地址

  rebackLink: '', // 返回重定向地址

  redirectLogout: 0, // 强制跳转注销页 0 停用 1 启用

  suffix: '', // 账号后缀

  enPerceive: 0, // 无感知方式 0 不无感知 1 显示快速登录页 2 直接无感知

  customPerceive: 0, // 是否启用无感知(后台未配置，由无感知组件控制)

  cvlanid: 4095, // 绑定CVLAN

  enAdvert: 0, // 是否统计广告 0 停用 1 启用

  advert_host: '', // 广告统计服务器地址        

  onlineMonitor: 1, // 在线接口是否监听(已废弃) 0 停用 1 启用

  unBindMac: 0, // 本机注销时是否解绑MAC 0 停用 1 启用

  ispUnBindSuffix: 0, // 运营商解绑时是否无后缀 0 停用 1 启用        

  findMac: 0, // 在线记录列表获取方式 0 通过Radius 1 通过全业务接口

  registerMode: 0, // 对接后台类型 0 私有云 1 BS后台 2 酒店版 3 访客系统 4 普教系统        

  changePassMode: 0, // 修改密码方式 0 通过Portal页面 1 跳转自服务 2 第三方服务

  thirdSwitchUri: '', // 第三方跳转地址

  //enableR3: 0, // 串接 pppoe 代拨是否启用(已废弃) 0 停用 1 启用

  //isLang: 0, // 中英文标识(已废弃) 0 停用 1启用

  duodianAppHidden: 0,// 是否隐藏哆点信息 0 不隐藏 1 隐藏

  enbaleEduroamVerify: 0, // 启用旁路eduroam审核模式 0 停用 1启用

  accountPrefix: 1,    // 是否添加账号前缀 0 不添加 1 添加        

  ioMode: 0, // 登录区分内外网方式：0 通过Radius描述：IO 1 通过设置内核命令：ras_iomode2

  acLogout: 0, // 多AC注销方式 0 默认方式 1 通过Radius注销 2 通过全业务接口注销

  storeExpireTime: 86400, // 认证数据缓存时长,单位-秒,默认为1天

  enablev6: 0, // Ipv4/Ipv6联动 0 停用 1 启用

  checkOnlineMethod: 0, // 检测用户在线状态的方式 0 默认方式 1 通过Radius检查

  enable_hotelop_login: 0, //是否开启房号登录功能 0 关闭 1 开启

  checkipv6: 0, //Ipv4/Ipv6检查

  authex_enable: '',//PPPoe代拨选择参数

  no_filter_accandpwd: 0, // 账号/密码免过滤 0 停用 1 启用

  ipad_terminal_identity: 0, // IPAD终端识别标识 0-PC端(默认) 1-移动端

  auth_failed_prompt: 0, // 认证失败弹窗提示 0 默认显示认证失败页 1 弹窗提示具体错误

  business_type: 0, // 认证业务类型 0-一键账号认证 1 账号认证 2 短信认证 3 混合认证 4 保留 5 微信认证 6 临时账号认证  7 二维码访客认证 8 钉钉认证 9 企业微信认证 10 第三方Portal认证 11 统一身份认证



  enable_verify: 0,       // 校验密码强度

  length_require: 8,      // 密码长度要求

  compose_require: 3,     // 组合个数要求

  enable_digital_char: 1, // 数字字符组合启用状态

  enable_upper_case: 1,   // 大写字母组合启用状态

  enable_lower_case: 1,   // 小写字母组合启用状态

  enable_special_char: 1, // 特殊符号组合启用状态

  digital_char_scope: '48|49|50|51|52|53|54|55|56|57', // 数字字符组合范围

  upper_case_scope: '65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90',   // 大写字母组合范围

  lower_case_scope: '97|98|99|100|101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120|121|122',   // 小写字母组合范围

  special_char_scope: '33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|58|59|60|61|62|63|64|91|92|93|94|95|96|123|124|125|126', // 特殊符号组合范围

  enable_prohibit_account: 0,      // 禁止包含账号

  prohibit_same_length: 0,         // 禁止相同字符

  prohibit_continuation_length: 0, // 禁止连续字符

  enable_week_changepwd: 0, // 弱密码强制修改

  webauthn_domain: '', // webauthn 域名

	

  rcn: '',  // apg页面随机数

	

  temp_acc: '', // 账号临时存储



  /*  

  * 设置终端相关的参数

  */

  init: function (next) {

    var me = this;



    this.type = util.getTermType();

    this.ip = util.getQueryString('ip', 'wlanuserip', 'userip', 'user-ip', 'client_ip', 'UserIP', 'uip', 'station_ip') || (typeof (v46ip) != 'undefined' ? v46ip : false) || (typeof (ss5) != 'undefined' ? ss5 : false) || (typeof (v4ip) != 'undefined' ? v4ip : false) || (typeof (ss3) != 'undefined' ? util.hex16ToString(ss3) : '000.000.000.000');

    this.mac = (util.getQueryString('mac', 'usermac', 'user-mac', 'wlanusermac', 'umac', 'client_mac', 'station_mac') || (typeof (ss4) != 'undefined' ? ss4 : false) || (typeof (olmac) != 'undefined' ? olmac : false) || '000000000000').replace(/[\-\:]/g, '');

    this.vlan = util.getQueryString('vlan', 'vlanid') || (typeof (vlanid) != 'undefined' ? vlanid : 1);

    this.session = util.getQueryString('session') || ((typeof (ss3) != 'undefined' && typeof (ss4) != 'undefined' && typeof (ss2) != 'undefined') ? ss3 + "-" + ss4 + "-" + ss2 : "");

    this.wlanacip = util.getQueryString('wlanacip', 'acip', 'switchip', 'nasip', 'nas-ip') || '';

    this.wlanacname = util.getQueryString('wlanacname', 'sysname', 'nasname', 'nas-name') || '';

    this.wlanacmac = (util.getQueryString('wlanacmac', 'gw_mac') || '000000000000').replace(/[\-\:]/g, '');

    this.wlanapmac = (util.getQueryString('apmac', 'ap_mac') || '000000000000').replace(/[\-\:]/g, '');

    this.ssid = util.getQueryString('ssid', 'essid') || '';

    this.areaID = util.getQueryString('areaID') || '';

    this.ipv6 = util.getQueryString('UserV6IP') || (typeof (v6ip) != 'undefined' ? v6ip : false) || '';

    this.redirect = util.getQueryString('redirect', 'redirect-url', 'desurl', 'url', 'originalUrl', 'success_url', 'Original_url', 'userurl', 'srcUrl') || '';

    this.gw_id = (util.getQueryString('gw_id', 'gw_mac') || '000000000000').replace(/[\-\:]/g, '').toLowerCase();

    this.gw_address = util.getQueryString('gw_address') || '';

    this.gw_port = util.getQueryString('gw_port') || '';

    this.gw_token = util.getQueryString('token') || '';

    // 兼容纯IPv4/纯IPv6/IPv4联动IPv6

    if(util.validIPv6(this.ip)) {

      // 2166为V6环境导致终端IP通过ss4取值为IPv6或Portal协议下AC重定向时终端IP只传IPv6场景下，IPv4和IPv6取值反转

      this.ipv6 = this.ip;

      this.ip   = "";

    }



    // eduroam 审核页是a27.htm 直接读不到ip，通过checkstatus 接口获取

    if (page._kind == 'eduroam' || page._kind == 27) {

      var url = page.path + 'chkstatus';

      util._jsonp({

        url: url,

        time: 5000,

        success: function (json) {

          me.ip = util.getQueryString('ip', 'wlanuserip', 'userip', 'user-ip', 'UserIP', 'uip', 'station_ip') || (typeof (json.v46ip) != 'undefined' ? json.v46ip : false) || (typeof (json.ss5) != 'undefined' ? json.ss5 : false) || (typeof (json.v4ip) != 'undefined' ? json.v4ip : false) || (typeof (json.ss3) != 'undefined' ? util.hex16ToString(json.ss3) : '000.000.000.000')

          me.mac = (util.getQueryString('mac', 'usermac', 'wlanusermac', 'umac', 'client_mac', 'station_mac') || (typeof (json.ss4) != 'undefined' ? json.ss4 : false) || (typeof (json.olmac) != 'undefined' ? json.olmac : false) || '000000000000').replace(/[\-\:]/g, '');

          me.vlan = util.getQueryString('vlan', 'vlanid') || (typeof (json.vlanid) != 'undefined' ? json.vlanid : 0);

          next();

        },

        error: function () {

          document.getElementsByTagName('body')[0].innerHTML = lang('内核接口不可用，请检查内核命令跟内核版本！');

          next();

        }

      });

    }else if ((this.ip === '0.0.0.0' || this.ip === '123.123.123.123') &&  port_mode == '1'){

      var url = page.portal_api + 'index/getClientIp';

      util._jsonp({

        url: url,

        data: {},

        success: function (json) {

          if (json.result == 1 || json.result == 'ok') { // result 1 加载成功 0 加载失败

            me.ip = json.wlan_user_ip;

            next()

          } else {

            _alert(json.msg);

          }

        },

        error: function (error) {

          alert(lang('获取终端ip方法调用出现异常，请刷新页面重试！'));

        }

      });

    } else {

      next();

    }

  }

};



// 移动设备兼容性：全局错误处理

(function() {

  // 只在移动设备环境下启用错误提示

  if (mobileDebugMode == '1' && util.isMobileEnvironment()) {

    var deviceTypeStr = util.getDeviceTypeDesc();

    var iosVersion = util.getIOSVersion();

    

    // 捕获JavaScript运行时错误

    window.addEventListener('error', function(e) {

      // 构建包含详细位置信息的错误对象

      var detailedError = {

        message: e.message || '未知错误',

        filename: e.filename || '未知文件',

        lineno: e.lineno || '未知',

        colno: e.colno || '未知',

        error: e.error,

        stack: e.error ? e.error.stack : null,

        type: 'runtime'

      };

      

      if (!detailedError.message || detailedError.message === 'Script error.' || detailedError.message === 'Script error') { return; }

      

      // 使用统一的错误处理方法

      if (util.handleMobileCompatibilityError) {

        util.handleMobileCompatibilityError(detailedError, 'JavaScript运行时错误');

      } else {

        // 降级处理

        var errorMsg = deviceTypeStr + ' JS运行时错误:\n' +

                       '文件: ' + detailedError.filename + '\n' +

                       '行号: ' + detailedError.lineno + '\n' +

                       '列号: ' + detailedError.colno + '\n' +

                       '错误: ' + detailedError.message;

        

        if (iosVersion) {

          errorMsg += '\niOS版本: ' + iosVersion.toString();

        }

        

        util.compatibilityAlert(errorMsg);

      }

    });

    

    // 捕获未处理的Promise错误

    window.addEventListener('unhandledrejection', function(e) {

      // 构建Promise错误对象

      var promiseError = {

        message: e.reason ? e.reason.toString() : '未知Promise错误',

        stack: e.reason && e.reason.stack ? e.reason.stack : null,

        type: 'promise',

        reason: e.reason

      };

      

      // 使用统一的错误处理方法

      if (util.handleMobileCompatibilityError) {

        util.handleMobileCompatibilityError(promiseError, 'Promise错误');

      } else {

        // 降级处理

        var errorMsg = deviceTypeStr + ' Promise错误:\n' + promiseError.message;

        if (iosVersion) {

          errorMsg += '\niOS版本: ' + iosVersion.toString();

        }

        util.compatibilityAlert(errorMsg);

      }

      

      e.preventDefault();

    });

    

    // 捕获资源加载错误

    window.addEventListener('error', function(e) {

      if (e.target && e.target !== window) {

        // 构建资源加载错误对象

        var resourceError = {

          message: '资源加载失败',

          filename: e.target.src || e.target.href || '未知资源',

          tagName: e.target.tagName || '未知标签',

          type: 'resource'

        };

        

        // 使用统一的错误处理方法

        if (util.handleMobileCompatibilityError) {

          util.handleMobileCompatibilityError(resourceError, '资源加载错误');

        } else {

          // 降级处理

          var errorMsg = deviceTypeStr + '资源加载错误:\n';

          errorMsg += '标签: ' + resourceError.tagName + '\n';

          errorMsg += '资源: ' + resourceError.filename + '\n';

          errorMsg += '类型: 资源加载失败';

          

          if (iosVersion) {

            errorMsg += '\niOS版本: ' + iosVersion.toString();

          }

          

          util.compatibilityAlert(errorMsg);

        }

      }

    }, true);

  }

})();
