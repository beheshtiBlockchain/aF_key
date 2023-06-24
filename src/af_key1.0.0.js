// Key codes respective name and code and also the ctrl/alt/shift
keys = {hold:{capsLock:false, numLock:false, shift:false, ctrl:false, alt:false}, keyCode:{shift:16, ctrl:17, alt:18, backspace:8, capslock:20, numlock:144, comma:188, cmd:91, cmd_left:91, cmd_right:93, delete:46, down:40, end:35, enter:13, escape:27, f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123, home:36, insert:45, left:37, menu:93, num_add:107, num_decimal:110, num_divide:111, num_enter:108, num_multiply:106, num_subtract:109, grave:192, plus:61, minus:173, pagedown:34, pageup:33, period:190, pause:19, print:44, right:39, space:32, tab:9, up:38, windows:91, command:91}, atOrnot:{}, makeA:function () {

//populate the numbers
    var i = 64, j = 47, a = 0;
    while (i++ < 90) {
        keys.keyCode[String.fromCharCode(i).toLowerCase()] = i
    }
    while (j++ < 57) {
        keys.keyCode[a++] = j
    }
    for (var name in keys.keyCode) {
        keys.atOrnot[name] = false
    }
}, returnDefaultkeyOpts:function () { // Option Keys reset
    var a;
    for (a in keys.hold) {
        keys.hold[a] = false
    }
}, handle:function (a, b, c) { // function to be called(b or c) reset the option keys & keyup (c) then return nothing(to be called inside event handler)
    if (typeof a != "undefined" && a) {
        b.call(b, b);
        this.returnDefaultkeyOpts();
        return
    }
    if (!a && typeof c == "function") {
        c.call(c, c);
        this.returnDefaultkeyOpts();
        return;
    }
}, init:function (event, type) { // check for keycode and check for options
    var key = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode, a = ["capsLock", "numLock", "shift", "ctrl", "alt"];
    if (key == 20) { // capslock
        keys.hold[a[0]] = true
    }
    if (key == 144) { // numlock
        keys.hold[a[1]] = true
    }
    if (key == 16) { // shift
        keys.hold[a[2]] = true
    }
    if (key == 17) { // ctrl
        keys.hold[a[3]] = true;
        keys.atOrnot[a[3]] = true;
    }
    if (key == 18) { // alt
        keys.hold[a[4]] = true
    }
    for (var name in keys.keyCode) { // all of the keycodes are checked with their names
        keys.handle(key == keys.keyCode[name], function () {
            // atornot keeps the name of every pressed key
            keys.atOrnot[name] = true
        })
    }
}, upinit:function (event, type) {// reset function of above function
    var key = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    a = ["capsLock", "numLock", "shift", "ctrl", "alt"];
    
    if (key == 20) {
        keys.hold[a[0]] = false
    }
    if (key == 144) {
        keys.hold[a[1]] = false
    }
    if (key == 16) {
        keys.hold[a[2]] = false
    }
    if (key == 17) {
        keys.hold[a[3]] = false;
        keys.atOrnot[a[3]] = false
    }
    if (key == 18) {
        keys.hold[a[4]] = false
    }
    for (var name in keys.keyCode) {
        keys.handle(key == keys.keyCode[name], function () {
            keys.atOrnot[name] = false
        })
    }
}, findfn:function (key) { // inclusive with ctrl shift alt regex (optional to be included) + words and digits(optional to get included) --~exec to check for occurance 
    var CONTROLED_REGEXP = /^(?:(?:(ctrl|shift|alt)\s*\+\s*)?)(?:(?:(shift|alt)\s*\+\s*)?)(?:(?:(shift|alt)\s*\+\s*)?)(?:(\w*\d*)\s*)$/, match = CONTROLED_REGEXP.exec(key), arr = {};
    try {
        arr.all = match[0];
        //  if it was a char return the char in an array
        if (match[0]in keys.atOrnot) {
            arr["char"] = match[0];
            return arr
        }
        // if the first inclusive optional input is ctrl then ctrlkey is set to true
        if (match[1] == "ctrl") {
            arr["ctrlKey"] = 1
        }
        // ctrl can happen once
        arr["ctrlKey"] = match[1] == "ctrl";
        arr["altKey"] = match[1] == "alt" || match[2] == "alt" || match[3] == "alt";
        arr["shiftKey"] = match[1] == "shift" || match[2] == "shift" || match[3] == "shift";
        arr["char"] = match[4];
    } catch (e) {
    }
    return arr
}, fn:function (event, name, fn) { // event handler function
    var chr, ability = true, ex = event.excact || true, a = ["capsLock", "numLock", "shift", "ctrl", "alt"];
    if (event.type == "keydown") {
        keys.init(event)
    }
    // if there was any name print screen in in the string variable handle the function
    if (event.type == "keyup" && name.indexOf("print") >= 0) {
        keys.init(event)
    }
    
    chr = this.findfn(name);
    for (var a in{ctrlKey:"", shiftKey:"", altKey:""}) {// check if all ctrl shift and alt are pressed and by the time confronted conflict break out of loop
        if (chr[a]) {
            // doublecheck ctrl shift and alt(keep tight)
            ability =  keys.hold[a[3]]|| keys.hold[a[4]]|| keys.hold[a[2]];// event[a.toString()]
            if (!event[a.toString()]) {
                break
            }
            // if there was no(o<|) ctrl shift or alt(loosely programmed)
        } else if (ex) {
            ability = !(keys.hold[a[3]]|| keys.hold[a[4]]|| keys.hold[a[2]]);// event[a.toString()]
            if (event[a.toString()]) {
                break
            }
        }
    }
    //console.log(keys.atOrnot);
     // either ctrl shift or alt were present or absence reported (events are not conflicted) then
    if (ability) {
        if(chr["char"].length>1){
            var shrt = chr["char"].substring(1,chr["char"].length);
            af_Key(shrt,fn);
            var mono = $.timer(1000, function(){
                af_Key(shrt,'');
            })
        }
        
        if (keys.atOrnot[chr["char"]]) {
            // reset all pressed keys
            for (var b in keys.atOrnot) {
                keys.atOrnot[b] = false
            }
            // populate the event itself
            event.element = this[0];
			event.keys = name;

            //create our own prevent function on event prototype
            event.prevent = function () {
                var returnTrue = (function () {
                    return true
                })();
                event.isDefaultPrevented = returnTrue;
                event.isImmediatePropagationStopped = returnTrue;
                if (event.preventDefault) {
                    event.preventDefault()
                } else if (e.stopPropagation) {
                    event.stopPropagation()
                }
                event.returnValue = false
            };
            try{
                // what to do to handle event
				fn.call(event, event, chr);
			} catch (e){
				console.error("Key Handler has encountered a Runtime error:\n"+e.message);
			}
            return false
        }
    }
    // key operation is finished
    keys.upinit(event);
    return
}};
keys.makeA();
var af_key_fns = {}, debug = false;
af_Key = function (key, fn) { // the main function to get called
    var name, prt;
    if (!fn && !(key && (({}).toString).call(key) == "[object Object]")) {// annihilate the handler when function passed is null type
        af_key_fns[key] = null;
        delete af_key_fns[key];
		debug && console.log("KeyHandler " + name + " Was Deleted Successfully");
        for (prt in af_key_fns) {
            return;
        }
        off(document, "keydown", fireEventup);
        off(document, "keyup", fireEventup)
    } else { // key handler restart
        off(document, "keydown", fireEventup);
        off(document, "keyup", fireEventup);
        on(document, "keydown", fireEventup);
        on(document, "keyup", fireEventup);
        if (key && (({}).toString).call(key) == "[object Object]" && typeof fn == "undefined") { // if no function was mentioned the key itself is json of functions
			debug && console.log("aFkey Listener Was Created Successfully- Checking keys:\n-------------------\n");
            for (name in key) {
                af_Key(name, key[name]);
            }
			return;
        }
				debug && console.log("KeyHandler " + key + " Was Created Successfully");
        af_key_fns[key] = fn
    }
    return key
};
fireEventup = function (event) {
    var name, elem;
    for (name in af_key_fns) {
        elem = af_key_fns[name];
		keys.fn(event, name, elem);
    }
    return
};
on = function (elem, type, fn) { // attach event bubble to DOM
    if (elem.addEventListener) {
        elem.addEventListener(type, fn, false);
        return;
    } else if (elem.attachEvent) {
        elem.attachEvent("ON" + type.toUpperCase(), fn, false);
        return;
    } else {
        elem["on" + type] = fn;
        return;
    }
};
off = function (elem, type, fn) { // detach event bubble from DOM
    if (elem.removeEventListener) {
        elem.removeEventListener(type, fn, false);
        return;
    } else if (elem.detachEvent) {
        elem.detachEvent("on" + type, fn, false);
        return
    } else {
        elem["on" + type] = null;
        return
    }
};
// for bubbly action of consecutive chars
jQuery.timer = function (interval, callback)
 {
	var interval = interval || 100;

	if (!callback)
		return false;
	// new class typed timer
	_timer = function (interval, callback) {
		this.stop = function () {
			clearTimeout(self.id);
		};
		
		this.internalCallback = function () {
			callback(self);
		};
		
		this.reset = function (val) {
			if (self.id)
				clearTimeout(self.id);
			
			var val = val || 100;
			this.id = setTimeout(this.internalCallback, val);
		};
		
		this.interval = interval;
		this.id = setTimeout(this.internalCallback, this.interval);
		
		var self = this;
	};
	
	return new _timer(interval, callback);
 };
 $ = $?$:{};
$.afarboodi_ = $.aF_ =  function(key,fn){
	var name;
	debug = key.debug || false ;
	key.debug = null;
	delete key.debug;
	if( typeof fn == "undefined" ){
		return new af_Key(key);
	}
	return new af_Key(key,fn);
}
$.aF_.prototype = {
	default:{
		debug: false,
		timeout: undefined
	},
	stop: function(key){
		eval("aF({"+key+":''},\"\")");
	}
};
