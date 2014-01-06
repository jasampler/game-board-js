// Game Board JS v1.0 | Copyright 2014 Carlos Rica Espinosa | License: GNU GPLv3
function game_board(config) {

	var g; //holds the values shared by all functions

	//initial function to be called after all others are created:
	var init_board = function(cfg) {
		g = {
			selected_pos: null, //id of last position clicked
			pos_pieces: {}, //pieces on each position
			//these contain a defensive copy of the configuration:
			boxes_ids: {}, //ids of positions which are boxes
			pieces_cfg: {},
			container_id: cfg.container_id || '',
			suffix_number_id: '-num',
			img_directory: cfg.img_directory || '',
			board_img: cfg.board_img,
			offset_x: cfg.offset_x || 0,
			offset_y: cfg.offset_y || 0,
			multiplier_x: cfg.multiplier_x || 1,
			multiplier_y: cfg.multiplier_y || 1
		};
		g.img_directory = add_slash(g.img_directory);
		g.internal_container_id = create_random_id(g.container_id);
		create_board();
		for (var pos in cfg.positions)
			create_position(pos, cfg);
	}

	var create_random_id = function(base_id) {
		var str = '';
		for (var i = 0; i < 5; i++)
			str += Math.floor(Math.random() * 10);
		if (base_id.length > 0)
			base_id += '_';
		return base_id + 'gbjs_' + str;
	};

	var add_slash = function(dir) {
		if (dir && dir.substring(dir.length - 1) != '/')
			dir += '/';
		return dir;
	}

	var create_board = function() {
		var sel = g.container_id ? '#' + g.container_id : 'body';
		//relative position creates the coordinate system for pieces:
		$(sel).append($(
			'<div ' +
			'id="' + g.internal_container_id + '" ' +
			' style="position: relative;">' +
			'<img src="' + g.img_directory + g.board_img + '"/>' +
			'</div>'
		));
	};

	var copy_piece_cfg = function(piece_cfg) {
		return { 
			img: piece_cfg.img,
			selected_img: piece_cfg.selected_img,
			center_x: piece_cfg.center_x|0,
			center_y: piece_cfg.center_y|0
		};
	};

	var pos_to_id = function(pos) {
		var arr = pos.split(','); //ROW,COL
		return g.internal_container_id + '_' + arr[0] + '_' + arr[1];
	};

	var id_to_coords = function(id) {
		var id_len = g.internal_container_id.length; //ID_ROW_COL
		var arr = id.substring(id_len + 1).split('_');
		return {
			y: g.offset_y + arr[0] * g.multiplier_y,
			x: g.offset_x + arr[1] * g.multiplier_x
		}
	};

	var get_last = function(arr) {
		return arr[arr.length - 1];
	};

	var create_position = function(pos, cfg) {
		var pos_cfg = cfg.positions[pos];
		var id = pos_to_id(pos);
		if (pos_cfg.is_box)
			g.boxes_ids[id] = true;
		//copy the names and configuration of the pieces:
		var arr_pieces = g.pos_pieces[id] = [];
		var arr = pos_cfg.pieces;
		for (var i = 0; i < arr.length; i++) {
			var name = arr[i];
			if (!g.pieces_cfg[name])
				g.pieces_cfg[name] =
					copy_piece_cfg(cfg.pieces[name]);
			arr_pieces.push(name);
		}
		//create the HTML elements of the position:
		var last_cfg = g.pieces_cfg[get_last(arr_pieces)];
		var coords = id_to_coords(id);
		var num = '';
		if (g.boxes_ids[id])
			num = '<div id="' + id + g.suffix_number_id + '" ' +
				'style="position: absolute; ' +
				'bottom: 0; right: 0; display: none; ' +
				'color: white; background-color: black;">' +
				(arr_pieces.length - 1) +
				'</div>';
		$('#' + g.internal_container_id).append($(
			'<a id="' + id + '" href="#"' +
			'style="position: absolute; ' +
			'top: ' + (coords.y - last_cfg.center_y) + 'px; ' +
			'left: ' + (coords.x - last_cfg.center_x) + 'px;"> ' +
			'<img ' +
			'style="display: block;" ' + //remove descender space
			'src="' + g.img_directory + last_cfg.img + '"/>' +
			num + '</a>'
		));
		$('#' + id).on('click', click_handler);
	};

	var set_piece_coords = function(id, piece_cfg) {
		var coords = id_to_coords(id);
		$('#' + id).css({
			'top': coords.y - piece_cfg.center_y,
			'left': coords.x - piece_cfg.center_x
		});
	};

	var set_img = function(id, img) {
		$('#' + id + ' img').attr('src', g.img_directory + img);
	};

	var set_border = function(id, value) {
		$('#' + id).css('border', value ? 'solid red 2px' : 'none');
	};

	var set_number = function(id, num) {
		if (g.boxes_ids[id]) {
			var sel = '#' + id + g.suffix_number_id;
			if (num != null)
				$(sel).text(num);
			$(sel).css('display', num != null ? 'block' : 'none');
		}
	};

	var click_handler = function(evt) {
		//get the position from the id of the anchor element:
		var id = $(this).attr('id');
		var arr_pieces = g.pos_pieces[id];
		//if there is no position previously selected:
		if (g.selected_pos == null) {
			if (arr_pieces.length > 1) { //only if it is not empty:
				var piece = g.pieces_cfg[get_last(arr_pieces)];
				if (piece.selected_img)
					set_img(id, piece.selected_img)
				else
					set_border(id, true);
				set_number(id, arr_pieces.length - 1);
				g.selected_pos = id;
			}
		}
		//if the position previously selected was clicked:
		else if (id == g.selected_pos) {
			var piece = g.pieces_cfg[get_last(arr_pieces)];
			if (piece.selected_img)
				set_img(id, piece.img);
			else
				set_border(id, false);
			set_number(id, null);
			g.selected_pos = null;
		}
		//if the position clicked is empty or is a box:
		else if (arr_pieces.length == 1 || g.boxes_ids[id]) {
			var orig_id = g.selected_pos;
			var orig_arr = g.pos_pieces[orig_id];
			var orig_piece = g.pieces_cfg[get_last(orig_arr)];
			if (!orig_piece.selected_img)
				set_border(orig_id, false);
			set_number(orig_id, null);
			//move last element from the origin to destination:
			arr_pieces.push(orig_arr.pop());
			//shows next piece in the origin:
			var next_piece = g.pieces_cfg[get_last(orig_arr)];
			set_img(orig_id, next_piece.img);
			set_piece_coords(orig_id, next_piece);
			//shows the origin piece in destination:
			set_img(id, orig_piece.img);
			set_piece_coords(id, orig_piece);
			g.selected_pos = null;
		}
		evt.preventDefault();
	};

	init_board(config);
}
