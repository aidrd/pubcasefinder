/*
 * jQuery Plugin: Tokenizing Autocomplete Text Entry
 * Version 1.6.2
 *
 * Copyright (c) 2009 James Smith (http://loopj.com)
 * Licensed jointly under the GPL and MIT licenses,
 * choose which one suits your project best!
 *
 */
;(function ($) {
	var ua = navigator.userAgent.toLowerCase();
	var isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1);
	
	//var hintText = "Type in disease name, inheritance mode, causative genes (Gene Symbol or Entrez Gene ID)";
	var hintText = "Type in disease name, inheritance mode, causative genes";
	var searchformulaText = "Query box";
	var DEFAULT_SETTINGS = {
		// Search settings
		language: 'en',
		method: "GET",
		queryParam: "q",
		searchDelay: 300,
		minChars: 2,
		propertyToSearch: "name",
		jsonContainer: null,
		contentType: "json",
		excludeCurrent: false,
		excludeCurrentParameter: "x",
		
		// Prepopulation settings
		prePopulate: null,
		processPrePopulate: false,
		
		hintText: null,
		noResultsText: "No results",
		searchingText: "Searching...",
		deleteText: "&#215;",
		animateDropdown: true,
		placeholder: hintText,
		searchformula: searchformulaText,
		theme: null,
		zindex: 999,
		resultsLimit: null,
		
		enableHTML: false,

		tokenLogicaloperatorItemAndValue	: 'AND_',
		tokenLogicaloperatorItemORValue	 : '',
		tokenLogicaloperatorItemNOTValue	: 'NOT_',
		tokenLogicaloperatorItemNONEValue : 'NONE',

		resultsFormatter: function(item) {
			var id = item['id'].replace(/_ja$/g,'');
			var name = item['name'];
			var synonym = item['synonym'];
			var id_prefix = '';
			var id_suffix = '';
			if(id.match(/^([A-Z]+)\:[0-9]+$/)) id_prefix = RegExp.$1;
			if(id_prefix == 'HP' || id_prefix == 'MONDO'){
				id_suffix = '-'+id_prefix.toLowerCase();
			}
			var theme = this.theme ? '-'+this.theme : '';
			var li_class = [this.classes.tokenResults];
			if(typeof id_suffix === "string" && id_suffix.length) li_class.push('token-input-token-results-'+id_suffix+theme);
			var value = '<li class="'+li_class.join(' ')+'">'+
			'<span class="'+this.classes.tokenWord+' '+this.classes.tokenInformation+' glyphicon glyphicon-info-sign" style="display:none;"></span>'+
			'&nbsp;'+
			'<span class="'+this.classes.tokenWord+' '+this.classes.tokenId+'">' + (this.enableHTML ? id : _escapeHTML(id)) + '</span>'+
			'&nbsp;'+
			'<span class="'+this.classes.tokenWord+' '+this.classes.tokenName+'">' + (this.enableHTML ? name : _escapeHTML(name)) + '</span>';
			if(synonym instanceof Array){
				var str = this.zenhan(synonym.join(' | '));
				value += '&nbsp;<b>|</b>&nbsp;<span class="'+this.classes.tokenWord+' '+this.classes.tokenSynonym+'">' + (this.enableHTML ? str : _escapeHTML(str)) + '</span>';
			}
			value += '</li>';
			return value;
		},

		tokenFormatter: function(item,index) {
			var id = item['id'].replace(/_ja$/gi,'');
			id = id.replace(/^NOT_/gi,'');
			id = id.replace(/^AND_/gi,'');
			id = id.replace(/^OR_/gi,'');
			var name = item['name'];
			
			var logicaloperator;
			if('logicaloperator' in item){
				logicaloperator = item['logicaloperator'];
			}else if(item['id'].match(/NOT_/i)){
				logicaloperator = DEFAULT_SETTINGS.tokenLogicaloperatorItemNOTValue;
			}else if(item['id'].match(/AND_/i)){
				logicaloperator = DEFAULT_SETTINGS.tokenLogicaloperatorItemAndValue;
			}else if(item['id'].match(/OR_/)){
				logicaloperator = DEFAULT_SETTINGS.tokenLogicaloperatorItemORValue;
			}else {
				logicaloperator = '';
			}
			
			item['id'] = id;
			
			var id_prefix = '';
			var id_suffix = '';
			var add_arrow = false;
			if(id.match(/^([A-Z]+)\:[0-9]+$/)) id_prefix = RegExp.$1;
			if(typeof id_prefix === "string" && id_prefix.length){
				id_suffix = '-'+id_prefix.toLowerCase();
			}
			if(id_prefix == 'HP' || id_prefix == 'MONDO'){
				add_arrow = true;
			}

			var theme = this.theme ? '-'+this.theme : '';

			var selected_AND = '';
			var selected_OR = '';
			var selected_NOT = '';
			var selected_NONE = '';

			var display_AND	= index ? 'block' : 'none';
			var display_OR	 = index ? 'block' : 'none';
			var display_NONE = index ? 'none'	: 'block';

			if(logicaloperator){
				if(index && logicaloperator===this.tokenLogicaloperatorItemAndValue){
					selected_AND = 'selected';
				}
				else if(logicaloperator===this.tokenLogicaloperatorItemNOTValue){
					selected_NOT = 'selected';
				}
				else{
					if(index){
						selected_OR = 'selected';
					}
					else{
						selected_NONE = 'selected';
					}
					delete item['logicaloperator'];
				}
			}
			else{
				if(index){
					selected_OR = 'selected';
				}
				else{
					selected_NONE = 'selected';
				}
				delete item['logicaloperator'];
			}

			var li_class = [this.classes.tokenTerm, this.classes.token];
			if(typeof id_suffix === "string" && id_suffix.length){
				li_class.push('token-input-token-term'+id_suffix+theme);
				if(add_arrow) li_class.push(this.classes.tokenTermGene);
			}

			var select_class = this.classes.tokenLogicaloperator;
			if(isSafari) select_class += ' ios-safari';
			var html = '<li class="'+li_class.join(' ')+'" draggable="true" style="-khtml-user-drag:element;-webkit-user-drag:element;">'+
			'<div class="'+this.classes.dragdrop+'"></div>'+
			'<div class="'+li_class.join(' ')+'">'+
				'<div class="'+this.classes.tokenWord+' '+this.classes.tokenLogicaloperator+'">'+
					'<select class="'+select_class+'">';
			if(display_AND != 'none'){
				html += '<option class="'+this.classes.tokenLogicaloperatorItem+' '+this.classes.tokenLogicaloperatorItemAnd+'" value="'+this.tokenLogicaloperatorItemAndValue+'" ' +selected_AND +' style="display:'+display_AND+';">AND</option>';
			}
			if(display_OR != 'none'){
				html += '<option class="'+this.classes.tokenLogicaloperatorItem+' '+this.classes.tokenLogicaloperatorItemOr+'" value="'+this.tokenLogicaloperatorItemORValue+'" ' +selected_OR +' style="display:'+display_OR+';">OR</option>';
			}
				html += '<option class="'+this.classes.tokenLogicaloperatorItem+' '+this.classes.tokenLogicaloperatorItemNot+'" value="'+this.tokenLogicaloperatorItemNOTValue+'" ' +selected_NOT +'>NOT</option>';
			if(display_NONE != 'none'){
				html += '<option class="'+this.classes.tokenLogicaloperatorItem+' '+this.classes.tokenLogicaloperatorItemNone+'" value="'+this.tokenLogicaloperatorItemNONEValue+'" ' +selected_NONE+' style="display:'+display_NONE+';">&nbsp;</option>';
			}
			html += '</select>'+
				'</div>'+
				'<p>'+
					'<span class="'+this.classes.tokenWord+' '+this.classes.tokenId+'">' + (this.enableHTML ? id : _escapeHTML(id)) + '</span>'+
					'<span class="'+this.classes.tokenWord+' '+this.classes.tokenName+'">' + (this.enableHTML ? name : _escapeHTML(name)) + '</span>'+
				'</p>';


			if(add_arrow) html += '<div class="'+this.classes.tokenWord+' '+this.classes.tokenIcon+'"><div class="arrow"></div></div>';
			html += '</div></li>';
			return html;
		},

		highlightTerm: function(value, term) {
			var enableHTML = this.enableHTML;
			var regexp_special_chars = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');
			var zenhan = this.zenhan;
			zenhan(term.trim()).split(/[ 　]+/).forEach(function(term){
				value = zenhan(value).replace(
					new RegExp(
						"(?![^&;]+;)(?!<[^<>]*)(" + term.replace(regexp_special_chars, '\\$&') + ")(?![^<>]*>)(?![^&;]+;)",
						"gi"
					), function(match, p1) {
						return "<b>" + (enableHTML ? p1 : _escapeHTML(p1)) + "</b>";
					}
				);
			});
			return value;
		},

		zenhan: function(str){
			return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s){ return String.fromCharCode(s.charCodeAt(0) - 65248); });
		},

		// Tokenization settings
		tokenLimit: null,
		tokenDelimiter: ",",
		preventDuplicates: false,

		tokenValue: function(el,index){
			var logicaloperator = el['logicaloperator'] ? el['logicaloperator'] : '';
			return logicaloperator+el['id'];
		},

		// Behavioral settings
		allowFreeTagging:		false,
		allowTabOut:			false,
		autoSelectFirstResult:	false,

		// Callbacks
		onResult:			null,
		onCachedResult:		null,
		onAdd:				null,
		onFreeTaggingAdd:	null,
		onDelete:			null,
		onDeleteAfterAdd:	null,
		onDropAfterAdd:		null,
		onReady:			null,
		onFilterChanged:	null,
		
		onSelectDropdownItem: null,
		onShowDropdownItem: null,
		onHideDropdownItem: null,
		
		// Other settings
		idPrefix: "token-input-",
		
		// Keep track if the input is currently in disabled mode
		disabled: false

	};

	// Default classes to use when theming
	var DEFAULT_CLASSES = {
		tokenList			 : "gene-token-input-list token-input-list",
		token				 : "token-input-token",
		tokenReadOnly		 : "token-input-token-readonly",
		tokenDelete			 : "token-input-delete-token",
		selectedToken		 : "token-input-selected-token",
		highlightedToken	 : "token-input-highlighted-token",
		dropdown			 : "token-input-dropdown",
		dropdownItem		 : "token-input-dropdown-item",
		dropdownItem2		 : "token-input-dropdown-item2",
		selectedDropdownItem : "token-input-selected-dropdown-item",
		inputToken			 : "token-input-input-token",
		focused				 : "token-input-focused",
		disabled			 : "token-input-disabled",
		dragdrop			 : "token-input-dragdrop",

		tokenResults				 : "token-input-token-results",
		tokenInformation			 : "token-input-token-information",
		tokenTerm					 : "token-input-token-term",
		tokenTermGene				 : "token-input-token-term-gene",
		tokenLogicaloperator		 : "token-input-token-logicaloperator",
		tokenLogicaloperatorItem	 : "token-input-token-logicaloperator-item",
		tokenLogicaloperatorItemAnd	 : "token-input-token-logicaloperator-item-and",
		tokenLogicaloperatorItemOr	 : "token-input-token-logicaloperator-item-or",
		tokenLogicaloperatorItemNot	 : "token-input-token-logicaloperator-item-not",
		tokenLogicaloperatorItemNone : "token-input-token-logicaloperator-item-none",
		tokenIcon					 : "token-input-token-icon",
		tokenSynonym				 : "token-input-token-synonym",
		tokenWord					 : "token-input-token-word",
		tokenId						 : "token-input-token-id",
		tokenName					 : "token-input-token-name",
		logicaloperatorInput		 : "token-input-logicaloperator",
		logicaloperatorInputItemId	 : "token-input-logicaloperator-item-id",
		searchformulaLink			 : "token-input-searchformula"
	};

	// Input box position "enum"
	var POSITION = {
		BEFORE : 0,
		AFTER	: 1,
		END		: 2
	};

	// Keys "enum"
	var KEY = {
		BACKSPACE		: 8,
		TAB				: 9,
		ENTER			: 13,
		ESCAPE			: 27,
		SPACE			: 32,
		PAGE_UP			: 33,
		PAGE_DOWN		: 34,
		END				: 35,
		HOME			: 36,
		LEFT			: 37,
		UP				: 38,
		RIGHT			: 39,
		DOWN			: 40,
		NUMPAD_ENTER	: 108,
		COMMA			: 188
	};

	var HTML_ESCAPES = {
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'"' : '&quot;',
		"'" : '&#x27;',
		'/' : '&#x2F;'
	};

	var HTML_ESCAPE_CHARS = /[&<>"'\/]/g;

	function coerceToString(val) {
		return String((val === null || val === undefined) ? '' : val);
	}

	function _escapeHTML(text) {
		return coerceToString(text).replace(HTML_ESCAPE_CHARS, function(match) {
			return HTML_ESCAPES[match];
		});
	}

	function _hasJA(str){
		return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
	}

	function isTriggeredFromPopup(){
		if($.magnificPopup.instance.contentContainer && $('.mfp-wrap')) {
			let $inlineContentBase = $.magnificPopup.instance.contentContainer.find('div.popup-hierarchy-gene-inline-content-base');
			if($inlineContentBase && $inlineContentBase.is(":visible")) return true;
		}
		return false;
	}

	// Additional public (exposed) methods
	var methods = {
		init: function(url_or_data_or_function, options) {
			var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

			if(settings.language === 'ja'){
				hintText = "疾患名・遺伝形式・疾患原因遺伝子を入力"
				searchformulaText = "検索式";
				DEFAULT_SETTINGS.placeholder = hintText;
				DEFAULT_SETTINGS.searchformula = searchformulaText;
				settings.placeholder = hintText; 
				settings.searchformula = searchformulaText;
			}

			return this.each(function () {
				$(this).data("settings", settings);
				$(this).data("tokenInputObject", new $.TokenList_gene(this, url_or_data_or_function, settings));
			});
		},
		clear: function() {
			this.data("tokenInputObject").clear();
			return this;
		},
		add: function(item) {
			this.data("tokenInputObject").add(item);
			return this;
		},
		remove: function(item) {
			this.data("tokenInputObject").remove(item);
			return this;
		},
		get: function() {
			return this.data("tokenInputObject").getTokens();
		},
		get_url_str: function(){
			let tokenList = this.data("tokenInputObject").getTokens();
			let retStr = "";
			tokenList.forEach(function(item){
				let id = item.id;
				let name = item.name;
				if(_hasJA(name)) id = id + "_ja";
				if('logicaloperator' in item) id = item.logicaloperator + id;
				if(retStr == "") {
					retStr = id;
				}else{
					retStr = retStr + ',' + id;
				}
			});
			return retStr;
		},
		toggleDisabled: function(disable) {
			this.data("tokenInputObject").toggleDisabled(disable);
			return this;
		},
		setOptions: function(options){
			$(this).data("settings", $.extend({}, $(this).data("settings"), options || {}));
			return this;
		},
		resize_input_box: function() {
			this.data("tokenInputObject").resize_input_box();
			return this;
		},
		destroy: function () {
			if (this.data("tokenInputObject")) {
				this.data("tokenInputObject").clear();
				var tmpInput = this;
				var closest = this.parent();
				closest.empty();
				tmpInput.show();
				closest.append(tmpInput);
				return tmpInput;
			}
		}
	};

	// Expose the .tokenInput function to jQuery as a plugin
	$.fn.tokenInput_gene = function (method) {
		// Method calling and initialization logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

	// TokenList class for each input
	$.TokenList_gene = function (input, url_or_data, settings) {
		//
		// Initialization
		//
		var jqxhr;

		// Configure the data source
		if (typeof(url_or_data) === "string" || typeof(url_or_data) === "function") {
			// Set the url to query against
			$(input).data("settings").url = url_or_data;

			// If the URL is a function, evaluate it here to do our initalization work
			var url = computeURL();

			// Make a smart guess about cross-domain if it wasn't explicitly specified
			if ($(input).data("settings").crossDomain === undefined && typeof url === "string") {
				if(url.indexOf("://") === -1) {
					$(input).data("settings").crossDomain = false;
				} else {
					$(input).data("settings").crossDomain = (location.href.split(/\/+/g)[1] !== url.split(/\/+/g)[1]);
				}
			}
		} else if (typeof(url_or_data) === "object") {
			// Set the local data to search through
			$(input).data("settings").local_data = url_or_data;
		}

		// Build class names
		if($(input).data("settings").classes) {
			// Use custom class names
			$(input).data("settings").classes = $.extend({}, DEFAULT_CLASSES, $(input).data("settings").classes);
		} else if($(input).data("settings").theme) {
			// Use theme-suffixed default class names
			$(input).data("settings").classes = {};
			$.each(DEFAULT_CLASSES, function(key, value) {
				$(input).data("settings").classes[key] = value + "-" + $(input).data("settings").theme;
			});
		} else {
			$(input).data("settings").classes = DEFAULT_CLASSES;
		}

		// Save the tokens
		var saved_tokens = [];

		// Keep track of the number of tokens in the list
		var token_count = 0;

		// Basic cache to save on db hits
		var cache = new $.TokenList_gene.Cache();

		// Keep track of the timeout, old vals
		var timeout;
		var input_val;

		// Create a new text input an attach keyup events
		var input_box = $("<input type=\"text\" autocomplete=\"off\" autocapitalize=\"off\"/>")
			.css({"outline": "none"})
			.attr("id", $(input).data("settings").idPrefix + input.id)
			.focus(function () {
				if ($(input).data("settings").disabled) {
					return false;
				} else if ($(input).data("settings").tokenLimit === null || $(input).data("settings").tokenLimit !== token_count) {
					show_dropdown_hint();
				}
				token_list.addClass($(input).data("settings").classes.focused);
			})
			.blur(function () {
				hide_dropdown();
				if ($(input).data("settings").allowFreeTagging) {
					add_freetagging_tokens();
				}
				$(this).val("");
				token_list.removeClass($(input).data("settings").classes.focused);
			})
			.bind("keyup keydown blur update", resize_input)
			.bind("input", function (event) {
//				console.log('input', event);
				if (String.fromCharCode(event.which)) {
				setTimeout(function(){ do_search(); }, 50);}
			})

			.keydown(function (event) {
				var previous_token;
				var next_token;

				switch(event.keyCode) {
					case KEY.LEFT:
					case KEY.RIGHT:
					case KEY.UP:
					case KEY.DOWN:
						if(this.value.length === 0) {
							previous_token = input_token.prev();
							next_token = input_token.next();
							if((previous_token.length && previous_token.get(0) === selected_token) ||
								 (next_token.length && next_token.get(0) === selected_token)) {
								// Check if there is a previous/next token and it is selected
								if(event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) {
									deselect_token($(selected_token), POSITION.BEFORE);
								} else {
									deselect_token($(selected_token), POSITION.AFTER);
								}
							} else if((event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) && previous_token.length) {
								// We are moving left, select the previous token if it exists
								select_token($(previous_token.get(0)));
							} else if((event.keyCode === KEY.RIGHT || event.keyCode === KEY.DOWN) && next_token.length) {
								// We are moving right, select the next token if it exists
								select_token($(next_token.get(0)));
							}
						} else {
							var dropdown_item = null;
							if (event.keyCode === KEY.DOWN || event.keyCode === KEY.RIGHT) {
								dropdown_item = $(dropdown).find('li').first();
								if (selected_dropdown_item) {
									dropdown_item = $(selected_dropdown_item).next();
								}
							} else {
								dropdown_item = $(dropdown).find('li').last();
								if (selected_dropdown_item) {
									dropdown_item = $(selected_dropdown_item).prev();
								}
							}
							select_dropdown_item(dropdown_item);
						}
						break;
					case KEY.BACKSPACE:
						previous_token = input_token.prev();
						if (this.value.length === 0) {
							if (selected_token) {
								delete_token($(selected_token));
								hiddenInput.change();
								//onFilterChanged();
								let callback1 = $(input).data("settings").onFilterChanged;
								if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
									setTimeout(function(){ callback1(); }, 50);
								}
							} else if(previous_token.length) {
								select_token($(previous_token.get(0)));
							}
							return false;
						} else if($(this).val().length === 1) {
							hide_dropdown();
						} else {
							// set a timeout just long enough to let this function finish.
							// FIX: 20171207 fujiwara setTimeout(function(){ do_search(); }, 5);
							setTimeout(function(){ do_search(); }, 50);
						}
						break;
					case KEY.TAB:
					case KEY.ENTER:
					case KEY.NUMPAD_ENTER:
					case KEY.COMMA:
						if(selected_dropdown_item) {
							add_token($(selected_dropdown_item).data("tokeninput"));
							hiddenInput.change();
							//onFilterChanged();
							let callback1 = $(input).data("settings").onFilterChanged;
							if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
								setTimeout(function(){ callback1(); }, 50);
							}
						} else {
							if(event.keyCode===KEY.ENTER && $(this).val() === "") {
								if(saved_tokens.length){
									//$(input).closest('form').submit();
									let callback1 = $(input).data("settings").onFilterChanged;
									if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
										setTimeout(function(){ callback1(); }, 50);
									}
								}
								event.stopPropagation();
								event.preventDefault();
								return false;
							}
	
							if ($(input).data("settings").allowFreeTagging) {
								if($(input).data("settings").allowTabOut && $(this).val() === "") {
									return true;
								} else {
									add_freetagging_tokens();
								}
							} else {
								if($(input).data("settings").allowTabOut) {
									return true;
								}
							}
							event.stopPropagation();
							event.preventDefault();
						}
						return false;
					case KEY.ESCAPE:
						hide_dropdown();
						return true;
					default:
						if (String.fromCharCode(event.which)) {
							// set a timeout just long enough to let this function finish.
							// FIX: 20171207 fujiwara setTimeout(function(){ do_search(); }, 5);
							setTimeout(function(){ do_search(); }, 50);
						}
						break;
				}
			});

		// Keep reference for placeholder
		if (settings.placeholder) {
			input_box.attr("placeholder", settings.placeholder);
		}

		// Keep a reference to the original input box
		var hiddenInput = $(input)
			.hide()
			.val("")
			.focus(function () {
				focusWithTimeout(input_box);
			})
			.blur(function () {
				input_box.blur();
				//return the object to this can be referenced in the callback functions.
				return hiddenInput;
			});

		var searchformulaLink = $('<div>')
			.addClass($(input).data("settings").classes.searchformulaLink)
			.insertAfter(hiddenInput);
			
		var searchformulaText = $('<a>')
			.text(settings.searchformula)
			.attr({'href':'#'})
			.appendTo(searchformulaLink)
			.click(function(e){
				e.preventDefault();
				e.stopPropagation();
				if(searchformulaLink.hasClass('token-input-logicaloperator-show')){
					searchformulaLink.removeClass('token-input-logicaloperator-show');
					logicaloperatorInput.hide();
				}else{
					searchformulaLink.addClass('token-input-logicaloperator-show');
					logicaloperatorInput.show();
				}
				return false;
			});

		var logicaloperatorInput = $('<div>')
			.hide()
			.addClass($(input).data("settings").classes.logicaloperatorInput)
			.css({'color':'#828282'})
			.prop({readonly:true})
			.insertAfter(searchformulaLink)
			.val("")
			.focus(function () {
				focusWithTimeout(input_box);
			})
			.blur(function () {
				input_box.blur();
				return hiddenInput;
			});

		// Keep a reference to the selected token and dropdown item
		var selected_token = null;
		var selected_token_index = 0;
		var selected_dropdown_item = null;

		// The list to store the token items in
		//var $token_list_wrapper_table = $("<table />").css({'width':'100%','border': 'solid 1px #AEB0B5','border-radius': '5px', 'border-collapse': 'separate'}).insertBefore(hiddenInput);
		var $token_list_wrapper_table = $("<div>").addClass('d-flex').addClass('flex-nowrap')
						.css({'width':'100%','min-width':'685px','border': 'solid 1px #AEB0B5','border-radius': '5px', 'border-collapse': 'separate'})
						.insertBefore(hiddenInput);
		//var $token_list_wrapper_table_tr = $("<tr />").css({'width':'100%','nowrap':'nowrap'}).appendTo($token_list_wrapper_table);
		//var $token_list_wrapper_table_td_left = $('<td />').css({'width':'100%'}).appendTo($token_list_wrapper_table_tr);

		var $token_list_wrapper_table_td_left = $('<div>').addClass('flex-fill').css({'padding-left':'5px'}).appendTo($token_list_wrapper_table);
		//var $token_list_wrapper_table_td_left = $('<div>').css({'width':'100%'}).appendTo($token_list_wrapper_table);
		var token_list = $("<ul />")
			.addClass($(input).data("settings").classes.tokenList)
			.css({'border':'0','width':'100%'})
			.click(function (event) {
				var li = $(event.target).closest("li");
				if(li && li.get(0) && $.data(li.get(0), "tokeninput")) {
					toggle_select_token(li);
				} else {
					// Deselect selected token
					if(selected_token) {
						deselect_token($(selected_token), POSITION.END);
					}
					// Focus input box
					focusWithTimeout(input_box);
				}
			})
			.mouseover(function (event) {
				var li = $(event.target).closest("li");
				if(li && selected_token !== this) {
					li.addClass($(input).data("settings").classes.highlightedToken);
				}
			})
			.mouseout(function (event) {
				var li = $(event.target).closest("li");
				if(li && selected_token !== this) {
					li.removeClass($(input).data("settings").classes.highlightedToken);
				}
			})
			.appendTo($token_list_wrapper_table_td_left);


//		var $token_list_wrapper_table_td_right = $('<td />').css({'vertical-align': 'middle','padding-left':'10px','padding-right':'10px','border-left':'solid 1px #ddd'}).appendTo($token_list_wrapper_table_tr);	
		var $token_list_wrapper_table_td_right = $('<div>').css({'border-left':'solid 1px #ddd','padding-left':'0.5rem','padding-right':'0.5rem'}).appendTo($token_list_wrapper_table);
		$('<button>clear</button>').addClass("round-button").addClass("material-icons").addClass('vertical-center').attr('id','tokeninput_gene_clear')
			.click(function(){
				$("#tokeninput_genes").tokenInput_gene("clear");
				resize_input();
				//onFilterChanged();
				let callback1 = $(input).data("settings").onFilterChanged;
				if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
					setTimeout(function(){ callback1(); }, 50);
				}

			})
			.appendTo($token_list_wrapper_table_td_right);

		// The token holding the input box
		var input_token = $("<li id=\"li_input_token\" draggable=\"false\"  style=\"-webkit-user-drag:none;\" />")
			.addClass($(input).data("settings").classes.inputToken)
			.appendTo(token_list)
			.append(input_box);

		// The list to store the dropdown items in
		var dropdown = $("<div/>")
			.addClass($(input).data("settings").classes.dropdown)
			.appendTo("body")
			.hide();

		// Magic element to help us resize the text input
		var input_resizer = $("<tester/>")
			.insertAfter(input_box)
			.css({
				position: "absolute",
				top: -9999,
				left: -9999,
				width: "auto",
				fontSize: input_box.css("fontSize"),
				fontFamily: input_box.css("fontFamily"),
				fontWeight: input_box.css("fontWeight"),
				letterSpacing: input_box.css("letterSpacing"),
				whiteSpace: "nowrap"
			});

		$('<div>').addClass($(input).data("settings").classes.dragdrop).insertBefore(input_box);

		// Pre-populate list if items exist
		hiddenInput.val("");
		var li_data = $(input).data("settings").prePopulate || hiddenInput.data("pre");

		if ($(input).data("settings").processPrePopulate && $.isFunction($(input).data("settings").onResult)) {
			li_data = $(input).data("settings").onResult.call(hiddenInput, li_data);
		}

		if (li_data && li_data.length) {
			$.each(li_data, function (index, value) {
				insert_token(value,index);
				checkTokenLimit();
				input_box.attr("placeholder", null)
			});
		}

		// Check if widget should initialize as disabled
		if ($(input).data("settings").disabled) {
			toggleDisabled(true);
		}

		// Initialization is done
		if (typeof($(input).data("settings").onReady) === "function") {
		$(input).data("settings").onReady.call();
		}

		//
		// Public functions
		//

		this.clear = function() {
			token_list.children("li").each(function() {
				if ($(this).children("input").length === 0) {
					delete_token($(this),true);
				}
			});
		};

		this.add = function(item) {
			add_token(item);
		};

		this.remove = function(item) {
			token_list.children("li").each(function() {
				if ($(this).children("input").length === 0) {
					var currToken = $(this).data("tokeninput");
					var match = true;
					for (var prop in item) {
						if (item[prop] !== currToken[prop]) {
							match = false;
							break;
						}
					}
					if (match) {
						delete_token($(this));
					}
				}
			});
			//onFilterChanged();
			let callback1 = $(input).data("settings").onFilterChanged;
			if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
				setTimeout(function(){ callback1(); }, 50);
			}

		};

		this.getTokens = function() {
			return saved_tokens;
		};

		this.toggleDisabled = function(disable) {
			toggleDisabled(disable);
		};

		// Resize input to maximum width so the placeholder can be seen
		resize_input();
		$(window).on('resize', resize_input);

		this.resize_input_box = function() {
			resize_input();
		};

		//
		// Private functions
		//

		function escapeHTML(text) {
			return $(input).data("settings").enableHTML ? text : _escapeHTML(text);
		}

		// Toggles the widget between enabled and disabled state, or according
		// to the [disable] parameter.
		function toggleDisabled(disable) {
			if (typeof disable === 'boolean') {
				$(input).data("settings").disabled = disable
			} else {
				$(input).data("settings").disabled = !$(input).data("settings").disabled;
			}
			input_box.attr('disabled', $(input).data("settings").disabled);
			token_list.toggleClass($(input).data("settings").classes.disabled, $(input).data("settings").disabled);
			// if there is any token selected we deselect it
			if(selected_token) {
				deselect_token($(selected_token), POSITION.END);
			}
			hiddenInput.attr('disabled', $(input).data("settings").disabled);
		}

		function checkTokenLimit() {
			if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
				input_box.hide();
				hide_dropdown();
				return;
			}
		}

		function resize_input() {
			var token_list_width = 0;
			token_list.children('li.token-input-token-term-facebook').each(function(){
				var outerWidth = $(this).outerWidth(true);
				if(token_list_width - outerWidth < 0) token_list_width = token_list.width();
				token_list_width -= outerWidth;
			});
			if(token_list_width===0){
				token_list_width = 560;
			}else if(token_list_width<40) token_list_width = token_list.width();
			input_box.outerWidth(Math.ceil(token_list_width)-$('div.token-input-dragdrop-facebook').outerWidth(true)-1);
		}

		function add_freetagging_tokens() {
			var value = $.trim(input_box.val());
			var tokens = value.split($(input).data("settings").tokenDelimiter);
			$.each(tokens, function(i, token) {
				if (!token) {
					return;
				}
				if ($.isFunction($(input).data("settings").onFreeTaggingAdd)) {
					token = $(input).data("settings").onFreeTaggingAdd.call(hiddenInput, token);
				}
				var object = {};
				object[$(input).data("settings").tokenValue] = object[$(input).data("settings").propertyToSearch] = token;
				add_token(object);
			});
		}

		// Inner function to a token to the list
		function insert_token(item,index) {
			var $this_token = $($(input).data("settings").tokenFormatter(item,index));
			var readonly = item.readonly === true;

			if(readonly) $this_token.addClass($(input).data("settings").classes.tokenReadOnly);

			$this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);

			var theme = $(input).data("settings").theme ? '-'+$(input).data("settings").theme : '';
			$this_token.find('select.token-input-token-logicaloperator'+theme)
				.click(function(e){
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
					return false;
				})
				.change(function(e){
//			console.log($(this).val());
					var $this_token = $(this).closest('li.token-input-token-term'+theme);
					var item = $.data($this_token.get(0),'tokeninput');
					item.logicaloperator = $(this).val();
					if(item.logicaloperator==='NONE' || item.logicaloperator==='') delete item.logicaloperator;
//			console.log(item);
					$.data($this_token.get(0),'tokeninput',item);
					update_hiddenInput(saved_tokens, hiddenInput);
					resize_input();
					//onFilterChanged();
					let callback1 = $(input).data("settings").onFilterChanged;
					if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
						setTimeout(function(){ callback1(); }, 50);
					}
					hiddenInput.change();
				});

			// The 'delete token' button
			if(!readonly) {
				$("<span>" + $(input).data("settings").deleteText + "</span>")
					.addClass($(input).data("settings").classes.tokenDelete)
					.prependTo($this_token.children().eq(1))
					.click(function () {
						if (!$(input).data("settings").disabled) {
							delete_token($(this).closest('li'));
							hiddenInput.change();
							resize_input();
							//onFilterChanged();
							let callback1 = $(input).data("settings").onFilterChanged;
							if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
								setTimeout(function(){ callback1(); }, 50);
							}
							return false;
						}
					});
			}

			// Store data on the token
			var token_data = item;
			$.data($this_token.get(0), "tokeninput", item);

			// Save this token for duplicate checking
			saved_tokens = saved_tokens.slice(0,selected_token_index).concat([token_data]).concat(saved_tokens.slice(selected_token_index));
			selected_token_index++;

			// Update the hidden input
			update_hiddenInput(saved_tokens, hiddenInput);

			token_count += 1;

			// Check the token limit
			if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
				input_box.hide();
				hide_dropdown();
			}

			return $this_token;
		}

		// Add a token to the token list based on user input
		function add_token (item) {
			var callback = $(input).data("settings").onAdd;

			// See if the token already exists and select it if we don't want duplicates
			if(token_count > 0 && $(input).data("settings").preventDuplicates) {
				var found_existing_token = null;
				token_list.children().each(function () {
					var existing_token = $(this);
					var existing_data = $.data(existing_token.get(0), "tokeninput");
					if(existing_data && existing_data[settings.tokenValue] === item[settings.tokenValue]) {
						found_existing_token = existing_token;
						return false;
					}
				});

				if(found_existing_token) {
					select_token(found_existing_token);
					input_token.insertAfter(found_existing_token);
					focusWithTimeout(input_box);
					return;
				}
			}

			// Squeeze input_box so we force no unnecessary line break
			input_box.width(1);

			// Insert the new tokens
			if($(input).data("settings").tokenLimit == null || token_count < $(input).data("settings").tokenLimit) {
				insert_token(item,saved_tokens.length);
				// Remove the placeholder so it's not seen after you've added a token
				input_box.attr("placeholder", null);
				checkTokenLimit();
			}

			// Clear input box
			input_box.val("");

			// Don't show the help dropdown, they've got the idea
			hide_dropdown();

			// Execute the onAdd callback if defined
			if($.isFunction(callback)) {
				callback.call(hiddenInput,item);
			}
			resize_input();
		}

		// Select a token in the token list
		function select_token (token) {
			if (!$(input).data("settings").disabled) {
				token.addClass($(input).data("settings").classes.selectedToken);
				selected_token = token.get(0);

				// Hide input box
				input_box.val("");

				// Hide dropdown if it is visible (eg if we clicked to select token)
				hide_dropdown();
			}
		}

		// Deselect a token in the token list
		function deselect_token (token, position) {
			token.removeClass($(input).data("settings").classes.selectedToken);
			selected_token = null;
			/*
			if(position === POSITION.BEFORE) {
				input_token.insertBefore(token);
				selected_token_index--;
			} else if(position === POSITION.AFTER) {
				input_token.insertAfter(token);
				selected_token_index++;
			} else {
				input_token.appendTo(token_list);
				selected_token_index = token_count;
			}
			*/
			// Show the input box and give it focus again
			focusWithTimeout(input_box);
		}

		// Toggle selection of a token in the token list
		function toggle_select_token(token) {
			var previous_selected_token = selected_token;

			if(selected_token) {
				deselect_token($(selected_token), POSITION.END);
			}

			if(previous_selected_token === token.get(0)) {
				deselect_token(token, POSITION.END);
			} else {
				select_token(token);
			}
		}

		// Delete a token from the token list
		function delete_token (token,all) {
			if($.type(all)!=='boolean') all = false;
			// Remove the id from the saved list
			var token_data = $.data(token.get(0), "tokeninput");
			var callback = $(input).data("settings").onDelete;

			var index = token.prevAll().length;
			if(index > selected_token_index) index--;

			// Delete the token
			token.remove();
			selected_token = null;

			// Show the input box and give it focus again
			focusWithTimeout(input_box);

			// Remove this token from the saved list
			saved_tokens = saved_tokens.slice(0,index).concat(saved_tokens.slice(index+1));
			if (saved_tokens.length == 0) {
				input_box.attr("placeholder", settings.placeholder)
			}
			if(index < selected_token_index) selected_token_index--;

			// Update the hidden input
			update_hiddenInput(saved_tokens, hiddenInput);

			token_count -= 1;

			if($(input).data("settings").tokenLimit !== null) {
				input_box
					.show()
					.val("");
				focusWithTimeout(input_box);
			}

			// Execute the onDelete callback if defined
			if($.isFunction(callback)) {
				callback.call(hiddenInput,token_data);
			}
			resize_input();

			if(!all){
				var local_saved_tokens = token_list.find('li.'+$(input).data("settings").classes.token).map(function(){
					var data = $(this).data('tokeninput');
					$(this).remove();
					return data;
				}).toArray();
				if(local_saved_tokens.length){
					saved_tokens = [];
					selected_token_index = 0;
					var callback = $(input).data("settings").onDeleteAfterAdd;
					$.each(local_saved_tokens, function(){
						add_token(this);
						if($.isFunction(callback)) {
							callback.call(hiddenInput,this);
						}
					});
				}
			}
		}

		// Update the hidden input box value
		function update_hiddenInput(saved_tokens, hiddenInput) {
			var settings = $(input).data("settings");
			var tokenValue = settings.tokenValue;
			if(typeof tokenValue == 'function'){
				token_values = $.map(saved_tokens, function (el,index) {
					return tokenValue.call(this, el, index);
				});
			}
			else{
				token_values = $.map(saved_tokens, function (el) {
					return el[tokenValue];
				});
			}
			hiddenInput.val(token_values.join(settings.tokenDelimiter));

			var logicaloperatorInput_value = settings.tokenLogicaloperatorItemORValue;
			$.each(token_values, function (index, token_value) {
				var space = '';
				if(index) space = ' ';
				token_value = token_value.replace(/_ja$/g,'');
				token_value_pure = token_value.replace(/AND_/,'');
				token_value_pure = token_value_pure.replace(/NOT_/,'');
				token_value_pure = token_value_pure.replace(/OR_/,'');
				if(token_value.indexOf(settings.tokenLogicaloperatorItemAndValue)==0){
					//logicaloperatorInput_value = '('+logicaloperatorInput_value+space+'AND <span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value.substring(1)+'</span>)';
					logicaloperatorInput_value = '('+logicaloperatorInput_value+space+'AND <span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value_pure+'</span>)';
				}
				else if(token_value.indexOf(settings.tokenLogicaloperatorItemNOTValue)==0){
					//logicaloperatorInput_value = '('+logicaloperatorInput_value+space+'NOT <span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value.substring(1)+'</span>)';
					logicaloperatorInput_value = '('+logicaloperatorInput_value+space+'NOT <span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value_pure+'</span>)';
				}
				else if(index){
					logicaloperatorInput_value = '('+logicaloperatorInput_value+space+'OR <span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value+'</span>)';
				}
				else{
					logicaloperatorInput_value = '(<span class="'+settings.classes.logicaloperatorInputItemId+'">'+token_value+'</span>)';
				}
			});
			logicaloperatorInput.html(logicaloperatorInput_value);
		}

		// Hide and clear the results dropdown
		function hide_dropdown () {
			dropdown.hide().empty();

			var callback = $(input).data("settings").onHideDropdownItem;
			if($.isFunction(callback)) {
				callback.call(selected_dropdown_item);
			}

			selected_dropdown_item = null;
			$(window).off('scroll resize', resize_dropdown);
		}

		function show_dropdown() {
			dropdown
				.css({
					position: "absolute",
					top: token_list.offset().top + token_list.outerHeight(true),
					left: token_list.offset().left,
					width: token_list.width(),
					'z-index': $(input).data("settings").zindex,
					'overflow': 'auto',
				})
				.show();
			$(window).off('scroll resize', resize_dropdown);
			$(window).on('scroll resize', resize_dropdown);
			resize_dropdown();
		}

		function resize_dropdown() {
			var window_height = $(window).height() - (token_list.offset().top + token_list.outerHeight(true)) - 16 + $('html').get(0).scrollTop;
			if(window_height<0) window_height = 'auto';
//			console.log('resize_dropdown()',window_height);
			dropdown
				.css({
					top: token_list.offset().top + token_list.outerHeight(true),
					left: token_list.offset().left,
					width: token_list.width(),
					'max-height': window_height
				});
		}

		function show_dropdown_searching () {
			if($(input).data("settings").searchingText) {
				dropdown.html("<p>" + escapeHTML($(input).data("settings").searchingText) + "</p>");
				show_dropdown();
			}
		}

		function show_dropdown_hint () {
			if($(input).data("settings").hintText) {
				dropdown.html("<p>" + escapeHTML($(input).data("settings").hintText) + "</p>");
				show_dropdown();
			}
		}

		var regexp_special_chars = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');
		function regexp_escape(term) {
			return term.replace(regexp_special_chars, '\\$&');
		}

		// Highlight the query part of the search term
		function highlight_term(value, term) {
			return value.replace(
			new RegExp(
				"(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape(term) + ")(?![^<>]*>)(?![^&;]+;)",
				"gi"
			), function(match, p1) {
				return "<b>" + escapeHTML(p1) + "</b>";
			}
			);
		}

		function find_value_and_highlight_term(template, value, term) {
			var zenhan = $(input).data("settings").zenhan;
			return zenhan(template).replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape( escapeHTML(zenhan(value)) ) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), $(input).data("settings").highlightTerm(value, term));
		}

		// exclude existing tokens from dropdown, so the list is clearer
		function excludeCurrent(results) {
			if ($(input).data("settings").excludeCurrent) {
				var currentTokens = $(input).data("tokenInputObject").getTokens(),
					trimmedList = [];
				if (currentTokens.length) {
					$.each(results, function(index, value) {
						var notFound = true;
						$.each(currentTokens, function(cIndex, cValue) {
							if (value[$(input).data("settings").propertyToSearch] == cValue[$(input).data("settings").propertyToSearch]) {
								notFound = false;
								return false;
							}
						});

						if (notFound) {
							trimmedList.push(value);
						}
					});
					results = trimmedList;
				}
			}

			return results;
		}

		// Populate the results dropdown with some results
		function populateDropdown (query, results) {
			// exclude current tokens if configured
			results = excludeCurrent(results);

			if(results && results.length) {
				dropdown.empty();
				var dropdown_ul = $("<ul/>")
					.appendTo(dropdown)
					.mouseover(function (event) {
						select_dropdown_item($(event.target).closest("li"));
					})
					.mousedown(function (event) {
						add_token($(event.target).closest("li").data("tokeninput"));
						hiddenInput.change();
						//onFilterChanged();
							let callback1 = $(input).data("settings").onFilterChanged;
							if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
								setTimeout(function(){ callback1(); }, 50);
							}

						return false;
					})
					.hide();

				var results_length = results.length;
				if ($(input).data("settings").resultsLimit && results.length > $(input).data("settings").resultsLimit) {
					results = results.slice(0, $(input).data("settings").resultsLimit);
				}

				$.each(results, function(index, value) {
					var this_li = $(input).data("settings").resultsFormatter(value);

					this_li = find_value_and_highlight_term(this_li ,value['id'].replace(/_ja$/g,''), query);
					this_li = find_value_and_highlight_term(this_li ,value['name'], query);
					this_li = find_value_and_highlight_term(this_li ,value['synonym'] instanceof Array ? value['synonym'].join(' | ') : '', query);
					this_li = $(this_li).appendTo(dropdown_ul);

					if(index % 2) {
						this_li.addClass($(input).data("settings").classes.dropdownItem);
					} else {
						this_li.addClass($(input).data("settings").classes.dropdownItem2);
					}

					if(index === 0 && $(input).data("settings").autoSelectFirstResult) {
						select_dropdown_item(this_li);
					}

					$.data(this_li.get(0), "tokeninput", value);
				});

				var callback = $(input).data("settings").onShowDropdownItem;
				if($.isFunction(callback)) {
					callback.call(dropdown,results_length);
				}
				show_dropdown();

				if($(input).data("settings").animateDropdown) {
					dropdown_ul.slideDown("fast");
				} else {
					dropdown_ul.show();
				}
			} else {
				if($(input).data("settings").noResultsText) {
					dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
					var callback = $(input).data("settings").onShowDropdownItem;
					if($.isFunction(callback)) {
						callback.call(dropdown,0);
					}
					show_dropdown();
				}
			}
		}

		// Highlight an item in the results dropdown
		function select_dropdown_item (item) {
			if(item) {
				if(selected_dropdown_item) {
					deselect_dropdown_item($(selected_dropdown_item));
				}

				item.addClass($(input).data("settings").classes.selectedDropdownItem);
				selected_dropdown_item = item.get(0);

				var callback = $(input).data("settings").onSelectDropdownItem;
				if($.isFunction(callback)) {
					callback.call(selected_dropdown_item, item.data("tokeninput"));
				}

				resize_input();
			}
		}

		// Remove highlighting from an item in the results dropdown
		function deselect_dropdown_item (item) {
			item.removeClass($(input).data("settings").classes.selectedDropdownItem);
			selected_dropdown_item = null;
		}

		// Do a search and show the "searching" dropdown if the input is longer
		// than $(input).data("settings").minChars
		function do_search() {
			var query = input_box.val();

			if(query && query.length) {
				if(selected_token) {
					deselect_token($(selected_token), POSITION.AFTER);
				}

				//if(query.length >= $(input).data("settings").minChars) {
				if((new Blob([query])).size >= $(input).data("settings").minChars) {	
					show_dropdown_searching();
					clearTimeout(timeout);

					timeout = setTimeout(function(){
						run_search(query);
					}, $(input).data("settings").searchDelay);
				} else {
					hide_dropdown();
				}
			}
		}

		function get_prefix(id){
			let ret = "";
			let idx = id.indexOf(':');
			if(idx > 0){
				ret = id.substring(0,idx);
			}
			return ret;
		}
		
		function compare_result(a,b){
			// compare id prefix
			let a_pre = get_prefix(a.id);
			let b_pre = get_prefix(b.id);
			
			if(a_pre !== b_pre){
				if(a_pre === 'HP') {
					return -1;
				}else if(b_pre === 'HP') {
					return 1;
				}else if(a_pre === 'ENT' || a_pre === 'GENEID') {
					return -1;
				}else{
					return 1;
				}
			}
			
			// compare name
			if ( a.name < b.name ){
				return 1;
			}
			if ( a.name > b.name ){
				return -1;
			}
			return 0;
		}

		// Do the actual search
		function run_search(query) {
			var cache_key = query + computeURL();
			var cached_results = cache.get(cache_key);
			if (cached_results) {
				if ($.isFunction($(input).data("settings").onCachedResult)) {
				cached_results = $(input).data("settings").onCachedResult.call(hiddenInput, cached_results);
				}
				populateDropdown(query, cached_results);
			} else {
				// Are we doing an ajax search or local data search?
				if($(input).data("settings").url) {
					var url = computeURL();
					// Extract existing get params
					var ajax_params = {};
					ajax_params.data = {};
					if(url.indexOf("?") > -1) {
						var parts = url.split("?");
						ajax_params.url = parts[0];

						var param_array = parts[1].split("&");
						$.each(param_array, function (index, value) {
							var kv = value.split("=");
							ajax_params.data[kv[0]] = kv[1];
						});
					} else {
						ajax_params.url = url;
					}

					// Prepare the request
					ajax_params.data[$(input).data("settings").queryParam] = query;
					ajax_params.type = $(input).data("settings").method;
					ajax_params.dataType = $(input).data("settings").contentType;
					if ($(input).data("settings").crossDomain) {
						ajax_params.dataType = "jsonp";
					}

					// exclude current tokens?
					// send exclude list to the server, so it can also exclude existing tokens
					if ($(input).data("settings").excludeCurrent) {
						var currentTokens = $(input).data("tokenInputObject").getTokens();
						var tokenList = $.map(currentTokens, function (el) {
							if(typeof $(input).data("settings").tokenValue == 'function')
								return $(input).data("settings").tokenValue.call(this, el);

							return el[$(input).data("settings").tokenValue];
						});

						ajax_params.data[$(input).data("settings").excludeCurrentParameter] = tokenList.join($(input).data("settings").tokenDelimiter);
					}

					// Attach the success callback
					ajax_params.success = function(results) {
						results = results.sort( compare_result );
						cache.add(cache_key, $(input).data("settings").jsonContainer ? results[$(input).data("settings").jsonContainer] : results);
						if($.isFunction($(input).data("settings").onResult)) {
							results = $(input).data("settings").onResult.call(hiddenInput, results);
						}
	
						// only populate the dropdown if the results are associated with the active search query
						if(input_box.val() === query) {
							populateDropdown(query, $(input).data("settings").jsonContainer ? results[$(input).data("settings").jsonContainer] : results);
						}
					};

					// Attach the error callback
					ajax_params.error = function(XMLHttpRequest, textStatus, errorThrown) {
										//console.warn(textStatus, errorThrown);
					};

					// Provide a beforeSend callback
					if (settings.onSend) {
						settings.onSend(ajax_params);
					}


					if (jqxhr) {
						jqxhr.abort();
					}
					// Make the request
					jqxhr = $.ajax(ajax_params);
				} else if($(input).data("settings").local_data) {
					// Do the search through local data
					var results = $.grep($(input).data("settings").local_data, function (row) {
						return row[$(input).data("settings").propertyToSearch].toLowerCase().indexOf(query.toLowerCase()) > -1;
					});

					cache.add(cache_key, results);
					if($.isFunction($(input).data("settings").onResult)) {
						results = $(input).data("settings").onResult.call(hiddenInput, results);
					}
					populateDropdown(query, results);
				}
			}
		}

		// compute the dynamic URL
		function computeURL() {
			var settings = $(input).data("settings");
			return typeof settings.url == 'function' ? settings.url.call(settings) : settings.url;
		}

		// Bring browser focus to the specified object.
		// Use of setTimeout is to get around an IE bug.
		// (See, e.g., http://stackoverflow.com/questions/2600186/focus-doesnt-work-in-ie)
		//
		// obj: a jQuery object to focus()
		function focusWithTimeout(object) {
			setTimeout(
				function() {
					object.focus();
				},
				50
			);
		}

		var self = this;
		token_list.on('dragstart','li.'+$(input).data("settings").classes.token, function(e){
			var $target = $(e.target);

			$target.on('dragend', function(e){
				token_list.find('li').off('dragend dragover drop dragenter dragleave')
				token_list.find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'none'});
			});

			token_list.find('li').each(function(){
				var $this = $(this);
				if($target.is($this)) return true;
				if($this.id === "li_input_token") return true;

				$this.on('dragover', function(e){
					e.preventDefault();
					token_list.find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'none'});
					$(e.target).closest('li').find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'0 0 2px 1px blue'});
				});
				$this.on('drop', function(e){
					e.preventDefault();

					token_list.find('li').off('dragend dragover drop dragenter dragleave')
					token_list.find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'none'});

					$target.insertBefore($(e.target).closest('li'));

					var local_saved_tokens = token_list.find('li.'+$(input).data("settings").classes.token).map(function(){
						return $(this).data('tokeninput');
					}).toArray();

					self.clear();
					var callback = $(input).data("settings").onDropAfterAdd;
					$.each(local_saved_tokens, function(){
						add_token(this);
						if($.isFunction(callback)) {
							callback.call(hiddenInput,this);
						}
					});

					resize_input();
					let callback1 = $(input).data("settings").onFilterChanged;
					if(!isTriggeredFromPopup() && $.isFunction(callback1)) {
						setTimeout(function(){ callback1(); }, 50);
					}

				});
				$this.on('dragenter', function(e){
					$(e.target).closest('li').find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'0 0 2px 1px blue'});
				});
				$this.on('dragleave', function(e){
					if($(e.target).hasClass($(input).data("settings").classes.token)){
						token_list.find('div.'+$(input).data("settings").classes.dragdrop).css({'box-shadow':'none'});
					}
				});
			});

		});
	};

	// Really basic cache for the results
	$.TokenList_gene.Cache = function (options) {
		var settings, data = {}, size = 0, flush;

		settings = $.extend({ max_size: 500 }, options);

		flush = function () {
			data = {};
			size = 0;
		};

		this.add = function (query, results) {
			if (size > settings.max_size) {
			flush();
			}
	
			if (!data[query]) {
			size += 1;
			}
	
			data[query] = results;
		};

		this.get = function (query) {
			return data[query];
		};
	};

}(jQuery));

jQuery.extend({
	stringify : function stringify(obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			if (t == "string") obj = '"' + obj + '"';
			return String(obj);
		}
		else{
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n];
				t = typeof(v);
				if (obj.hasOwnProperty(n)) {
					if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}
});
