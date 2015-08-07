Ext.define('WaterBloomDrone.view.center.DateComboTab1_Measure', {
	
	extend: 'Ext.panel.Panel',
	id: 'DateComboPanel1_Measure',
	xtype: 'datecombo-panel1-measure',
	
	height: 44,
	width: 128,
	
	title: '측정일자 선택',
	header: false,
	
	// controller: 'datecombocontroller1_measure',
	
	layout: {
		type: 'vbox',
		align: 'middle',
		pack: 'middle'
	},
	
	//x: 500,
	//y: 500,
	
	cls: 'khLee-x-box-target khLee-x-panel-body',
	
	items: [{
		xtype: 'label',
		id: 'lblDate1_Measure',
		text: '측정일자',
		style: 'background-color: #59657f; border: 1px solid #2c3a57',
		width: 128,
		height: 22
	}, {
		xtype: 'combo',
		id: 'cboDate1_Measure',
		value: Ext.nakdongWMCYMWDefaultValue,
		editable: false,
		store: Ext.nakdongWMCYMW,
		format: 'Y-m-d',
		height: 22,
		width: 128,
		listeners: {
	        change: function (field, newValue, oldValue) {
	        	comboIdx = Ext.nakdongWMCYMW.indexOf(newValue);
	        	var layerCombo = Ext.getCmp("cboDate1");
	        	layerCombo.setValue(Ext.nakdongDroneDate[comboIdx]);
	        	
	        	var mapCtl = Ext.getCmp('_mapDiv_1');
	        	var layer = mapCtl.map.getLayer("FeatureLayer1");
	        	mapCtl.map.removeLayer(layer);
	        	var layer = mapCtl.map.getLayer("labels");
	        	mapCtl.map.removeLayer(layer);
	        	mapCtl.featureLayerAdmin = Ext.create('WaterBloomDrone.view.map.FeatureLayerAdmin1', mapCtl.map);
	        },
	        scope: this
	    }
	}]
});