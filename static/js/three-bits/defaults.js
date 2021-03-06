var Ag = Ag || {};
Ag.Def = {

	LOCALDB_PREFIX: '170117-',

	CONCEPT_TERM_SEARCH_GRID_PAGE_SIZE: 0,

	FORMAT_CONCEPT_VALUE: '{0}-{1}',
	FORMAT_MODEL_VERSION_VALUE: '{0}-{1}',
	CONCEPT_TERM_STORE_ID: 'conceptStore',
	CONCEPT_TERM_SEARCH_STORE_ID: 'conceptSearchStore',
	CONCEPT_PARENT_TERM_STORE_ID: 'conceptParentStore',

	APP_NAME: 'FMASearch',
	APP_TITLE: 'FMASearch',

	DEF_MODEL_TERM: 'BodyParts3D',
	DEF_MODEL_VERSION_TERM: '20161017i4',
	DEF_CONCEPT_INFO_TERM: 'FMA',
	DEF_CONCEPT_BUILD_TERM: '4.3.0-inference',

	LOCATION_HASH_CIID_KEY: 'ci',
	LOCATION_HASH_CBID_KEY: 'cb',
	LOCATION_HASH_MDID_KEY: 'md',
	LOCATION_HASH_MVID_KEY: 'mv',
	LOCATION_HASH_MRID_KEY: 'mr',
	LOCATION_HASH_ID_KEY: 'id',
	LOCATION_HASH_IDS_KEY: 'ids',
	LOCATION_HASH_CID_KEY: 'cid',
	LOCATION_HASH_CIDS_KEY: 'cids',
	LOCATION_HASH_NAME_KEY: 'name',
	LOCATION_HASH_SEARCH_KEY: 'query',
	LOCATION_HASH_SEARCH_EXCLUDE_KEY: 'exclude',

	SEARCH_TARGET_NAME: 'searchTarget',
	SEARCH_TARGET_ELEMENT_VALUE: '1',
	SEARCH_TARGET_WHOLE_VALUE: '2',

	SEARCH_ANY_MATCH_NAME: 'anyMatch',
	SEARCH_CASE_SENSITIVE_NAME: 'caseSensitive',
	RELATION_TYPE_NAME: 'type',

	CONCEPT_INFO_DATA_FIELD_ID: 'ci_id',
	CONCEPT_BUILD_DATA_FIELD_ID: 'cb_id',
	CONCEPT_DATA_DATA_FIELD_ID: 'cd_id',
	CONCEPT_DATA_INFO_DATA_FIELD_ID: 'cdi_id',

	CONCEPT_DATA_COLOR_DATA_FIELD_ID: 'color',
	CONCEPT_DATA_OPACITY_DATA_FIELD_ID: 'opacity',
	CONCEPT_DATA_VISIBLE_DATA_FIELD_ID: 'visible',
	CONCEPT_DATA_SELECTED_DATA_FIELD_ID: 'selected',
	CONCEPT_DATA_DISABLED_DATA_FIELD_ID: 'disabled',

	MODEL_DATA_FIELD_ID: 'md_id',
	MODEL_VERSION_DATA_FIELD_ID: 'mv_id',
	MODEL_REVISION_DATA_FIELD_ID: 'mr_id',

	BUILDUP_TREE_DEPTH_FIELD_ID: 'depth',
	VERSION_STRING_FIELD_ID: 'version',
	VERSION_ORDER_FIELD_ID: 'order',
	USE_FOR_BOUNDING_BOX_FIELD_ID: 'UseForBoundingBoxFlag',

	ID_DATA_FIELD_ID: 'id',
	ID_DATA_FIELD_WIDTH: 100,
	IDS_DATA_FIELD_ID: 'ids',
	NAME_DATA_FIELD_ID: 'name',
	SYNONYM_DATA_FIELD_ID: 'synonym',
	DEFINITION_DATA_FIELD_ID: 'definition',

	TERM_ID_DATA_FIELD_ID: 'term_id',
	TERM_NAME_DATA_FIELD_ID: 'term_name',

	SNIPPET_ID_DATA_FIELD_ID: 'snippet_id',
	SNIPPET_NAME_DATA_FIELD_ID: 'snippet_name',
	SNIPPET_SYNONYM_DATA_FIELD_ID: 'snippet_synonym',

	OBJ_PATH_NAME: 'art_file',
	OBJ_EXT_NAME: '.obj',
	OBJ_ID_DATA_FIELD_ID: 'art_id',
	OBJ_IDS_DATA_FIELD_ID: 'art_ids',
	OBJ_URL_DATA_FIELD_ID: 'url',
	OBJ_TIMESTAMP_DATA_FIELD_ID: 'art_timestamp',
	OBJ_FILENAME_FIELD_ID: 'art_filename',

	OBJ_X_MASS_CENTER_FIELD_ID: 'art_xmasscenter',
	OBJ_Y_MASS_CENTER_FIELD_ID: 'art_ymasscenter',
	OBJ_Z_MASS_CENTER_FIELD_ID: 'art_zmasscenter',

	OBJ_X_MIN_FIELD_ID: 'art_xmin',
	OBJ_X_MAX_FIELD_ID: 'art_xmax',
	OBJ_Y_MIN_FIELD_ID: 'art_ymin',
	OBJ_Y_MAX_FIELD_ID: 'art_ymax',
	OBJ_Z_MIN_FIELD_ID: 'art_zmin',
	OBJ_Z_MAX_FIELD_ID: 'art_zmax',

	OBJ_POLYS_FIELD_ID: 'art_polys',
	OBJ_CITIES_FIELD_ID: 'art_cities',
	OBJ_PREFECTURES_FIELD_ID: 'art_prefectures',

	PIN_ID_FIELD_ID: 'uuid',
	PIN_NO_FIELD_ID: 'no',
	PIN_COORDINATE_X_FIELD_ID: 'coordinate_x',
	PIN_COORDINATE_Y_FIELD_ID: 'coordinate_y',
	PIN_COORDINATE_Z_FIELD_ID: 'coordinate_z',
	PIN_VECTOR_X_FIELD_ID: 'vector_x',
	PIN_VECTOR_Y_FIELD_ID: 'vector_y',
	PIN_VECTOR_Z_FIELD_ID: 'vector_z',
	PIN_UP_VECTOR_X_FIELD_ID: 'up_vector_x',
	PIN_UP_VECTOR_Y_FIELD_ID: 'up_vector_y',
	PIN_UP_VECTOR_Z_FIELD_ID: 'up_vector_z',
	PIN_DESCRIPTION_DRAW_FLAG_FIELD_ID: 'description_draw_flag',
	PIN_DESCRIPTION_COLOR_FIELD_ID: 'description_color',
	PIN_DESCRIPTION_FIELD_ID: 'description',
	PIN_COLOR_FIELD_ID: 'color',
	PIN_SHAPE_FIELD_ID: 'shape',
	PIN_SIZE_FIELD_ID: 'size',
	PIN_COORDINATE_SYSTEM_NAME_FIELD_ID: 'coordinate_system_name',
	PIN_PART_ID_FIELD_ID: 'id',
	PIN_PART_NAME_FIELD_ID: 'name',
	PIN_VISIBLE_FIELD_ID: 'visible',

	SEGMENT_ID_DATA_FIELD_ID: 'segment_id',
	SEGMENT_ORDER_DATA_FIELD_ID: 'segment_order',
	SYSTEM_ID_DATA_FIELD_ID: 'system_id',

	COLOR_COLUMN_WIDTH: 52
};


Ag.Lang = {
	title : 'FMABrowser',

//	version : 'Version',
	version : 'Font set',
	revision: 'Revision',
//	version_signage : 'Version??????',
	version_signage : 'Font set??????',

	objects_set : 'Objects set',
	objects_set_signage : 'Objects set??????',

//	group_version : 'Group / Version',
	group_version : 'Group / Font set',

	art_filename  : 'Filename',
	art_folder : 'Folder',
	art_category : 'Category',
	art_class : 'Class',
	art_comment : 'Comment',
	art_judge : 'Judge',
	art_data_size : 'Size',
	art_xmin   : 'XMin(mm)',
	art_xmax   : 'XMax(mm)',
	art_xcenter: 'XCenter(mm)',
	art_ymin   : 'YMin(mm)',
	art_ymax   : 'YMax(mm)',
	art_ycenter: 'YCenter(mm)',
	art_zmin   : 'ZMin(mm)',
	art_zmax   : 'ZMax(mm)',
	art_zcenter: 'ZCenter(mm)',

	tree : 'Tree',
	model : 'Model',
	prefix : 'Prefix',

	rep_list : 'Representation List',
//	rep_id : 'Representation',
	rep_id : 'BPID',
	rep_density : 'Model / Concept density',
	rep_primitive : 'Representation method',
//	cdi_name : 'Represented concept',
	cdi_name : 'FMAID',
//	art_id : 'Model component',
	art_id : 'FJID',
	art_ids : 'FJID(s)',
	mca_id : 'MAPID',

	cdi_name_j : 'Japanese',
	cdi_name_e : 'Name',
	cdi_name_k : 'Kana',
	cdi_name_l : 'Latina',

	cdi_syn_e : 'Synonym',
	cdi_syn_j : 'Synonym(Jpn)',

	ok   : 'OK',
	save   : 'Save',
	cancel : 'Cancel',
	close  : 'Close',

	history    : 'History',
	hist_event : 'Operation',
	user : 'User',

	comment    : 'Comment',
	class_name : 'Class',
	category   : 'Category',
	judge      : 'Judge',
	file_name  : 'Filename',
	file_size  : 'Size',

	group : 'Group Name',

	arto_id : 'Org.FJID',
	arto_filename : 'Org.Filename',
	arto_comment : 'Org.Comment',

	xmin   : 'XMin(mm)',
	xmax   : 'XMax(mm)',
	xcenter: 'XCenter(mm)',
	ymin   : 'YMin(mm)',
	ymax   : 'YMax(mm)',
	ycenter: 'YCenter(mm)',
	zmin   : 'ZMin(mm)',
	zmax   : 'ZMax(mm)',
	zcenter: 'ZCenter(mm)',
	volume : 'Volume(cm<sup>3</sup>)',
	timestamp: 'Timestamp',
	modified: 'Modified',

	pick_search: 'Neighbor Search',
	voxel_range: 'Voxel Range(mm<sup>3</sup>)',
	volume_find: 'Search Upload Parts',
	tree_find: 'Find Tree',
	parts_find: 'Select Parts',
	parts_mirroring_find: 'Select Mirroring Parts',
	parts_org_find: 'Select Orginal Parts',
	approximate_volume: 'Approximate value of the volume(cm<sup>3</sup>)',
	distance_xyz: 'Distance CenterXYZ(mm)',
	distance_voxel: 'Distance(mm)',
	collision_detection: 'Collision detection',
	diff_volume: 'Diff Vol(cm<sup>3</sup>)',
	diff_cube_volume: 'Diff Cube Vol(cm<sup>3</sup>)',
	collision_rate: 'Intersection(%)',

	publish : '??????',
	publish_label: '????????????',
	publish_state: '<b style="color:red;">??????</b>',
	'private' : '?????????',
	port : 'Port',
	order : 'Order',
	renderer : 'Renderer',
	renderer_mng : '??????????????????????????????',
	renderer_version : 'Renderer version',

	add : 'Add',
	remove : 'Delete',

	edit : '??????',
	editable : '?????????',
	not_editable : '????????????',
	not_editable_label : '?????????????????????',
	not_editable_state : '<b style="color:red;">????????????</b>',

	use : 'Use',
	ip : 'IP',

	copy: 'Copy',
	file_info: 'FMA mapping',
	filter: 'Filter',

	fma_window : 'FMA',

	seg_color: 'Pallet',	//???????????????????????????????????????????????????
	seg_color_full: 'Pallet color',	//???????????????????????????????????????????????????
	seg_thum_fgcolor: 'Thum(fg)',	//??????????????????????????????????????????
	seg_thum_fgcolor_full: 'Thumbnail Image color',	//??????????????????????????????????????????
	seg_thum_bgcolor: 'Thum(bg)',	//????????????????????????
	seg_thum_bgcolor_full: 'Thumbnail Background color',	//????????????????????????
	properties : 'Color property',
	seg_name: 'Segment',
	segment_color: 'Segment Color',	//????????????????????????
	segment_color_mng: 'Segment Color ??????',	//??????????????????????????????
	set_segment_recursively: 'Set segment recursively',	//????????????????????????????????????
	thumbnail_background_part: 'Thumbnail Background Part',	//??????????????????????????????

	save : '??????',
	cancel : '??????',
	reset : '????????????',
	close  : '?????????',

	'export' : 'Export',
	'import' : 'Import',
	'import_confirm' : '?????????????????????????????????????????????????????????????????????????????????????????????',

//	fma_edit_list: 'ALL FMA List',
	all_fma_list: 'ALL FMA List',
	all_upload_parts_list: 'ALL Upload Parts List',
	format_html : 'HTML??????',
	format_excel_xlsx : 'Excel??????(.xlsx)',
	format_excel : 'Excel(97-2003)??????(.xls)',
	format_tsv : '?????????????????????',
	format_zip : '?????????????????????',

	dataset_mng : '????????????????????????',

	recalculation : '?????????',
	error_recalculation_is_publish : '??????????????????????????????????????????',

	error_twitter: 'Twitter???????????????????????????',
	error_file_size: '????????????????????????{0}?????????????????????',
	error_folder_find: '???{0}?????????{1}???????????????????????????',
	error_twitter_fix_title: 'Error Report Fix',
	error_save: '???????????????????????????',
	error_delete: '???????????????????????????',

	error_arto_id: '??????????????????FJID????????????????????????',
	error_cdi_name: '???????????????FMAID?????????????????????',
	error_port : 'Renderer Port??????????????????????????????',

	'window' : '???????????????',
	window_alignment : '?????????????????????',
	fma_corresponding_change : 'FMA????????????',
	fma_corresponding_change_mode : 'FMA?????????????????????',
	fma_corresponding_change_dialog_message : 'FMA??????????????????????????????????????????',
	fma_corresponding_change_dialog_error_message : 'FMA????????????????????????????????????',
	fma_corresponding_link_break : 'FMA????????????',
	conflict_list : 'Conflict list'
};
Ag.Def.DEBUG = true;
