Ext.define('KRF_DEV.view.center.waterbloom.SelectDate', {
	
	extend: 'Ext.panel.Panel',
	id: 'SelectDatePanel',
	xtype: 'selectdate-panel',
	
	height: 24,
	width: 150,
	
	title: '촬영일자 선택',
	header: false,
	
	controller: 'selectdatecontroller',
	
	layout: {
		type: 'hbox'
	},
	
	//x: 500,
	//y: 500,
	
	items: [{
		xtype: 'image',
		//text: '테스트',
		src: '/resources/images/button/refresh.jpg',
		style: 'cursor:pointer;',
		listeners: {
	        el: {
	            click: 'onClickFullExtent'
	        }
	    },
		width: 20,
		height: 20
	}, {
		xtype: 'datefield',
		//padding: 5,
		//fieldLabel: '촬영일  ',
		//labelWidth: 50,
		value: '2015-06-23',
		format: 'Y-m-d',
		width: 128
	}],
	
	initComponent: function(){
		this.x = Ext.getBody().getViewSize().width - 130 - 50;
		this.y = 100;
		this.callParent();
	}
	
});

Ext.EventManager.onWindowResize(function(w, h){
    var ctl = Ext.getCmp('SelectDatePanel');
    
    if(ctl == undefined)
    	return;

    ctl.setX(Ext.getBody().getViewSize().width - 130 - 50, false);
    ctl.setY(100, false);
});