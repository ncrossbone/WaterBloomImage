/*
Ext.define('WaterBloomDrone.view.map.GraphicsLayerAdmin1', {
	map:null, 
	layer:null,
	dynamicLayer1:null,
	dynamicLayer2:null,
	
	constructor: function(map) {
        var me = this;
        me.map = map;
        
        // store에서 맵서비스 URL 가져오기
        var store = Ext.create('WaterBloomDrone.store.AppVariable');
    	store.load(function(){
    		
    		this.each(function(record, cnt, totCnt){
    			//console.info(totCnt);
    			if(cnt == 0){
    				var queryTask = new esri.tasks.QueryTask(record.get('MapserviceUrl1') + "/3"); // 레이어 URL
    				var query = new esri.tasks.Query();
    				query.returnGeometry = true;
    				query.where = "1=1";
    				query.outFields = ["*"];
    				
    				queryTask.execute(query,  function(results){
    					//console.info(results);
    				});
    				
    				queryTask.on("complete", function(featureSet) {
    					//console.info(featureSet);
    					
    					var layerDefinition = {  
    					          "displayFieldName": "호소명",  
    					          "geometryType": "esriGeometryPoint",  
    					          "spatialReference": {  
    					            "wkid": 4326  
    					          },  
    					          "fields": [{  
    					            "name": "OBJECTID",  
    					            "alias": "OBJECTID",  
    					            "type": "esriFieldTypeOID"  
    					          }, {  
    					            "name": "측정소명",  
    					            "type": "esriFieldTypeString",  
    					            "alias": "측정소명",
    					            "length": 254
    					          }, {  
    					            "name": "측정소코드",  
    					            "type": "esriFieldTypeString",  
    					            "alias": "측정소코드",
    					            "length": 7
    					          }, {  
    					            "name": "TM_X",  
    					            "type": "esriFieldTypeString",  
    					            "alias": "TM_X"
    					          }, {  
    					            "name": "TM_Y",  
    					            "type": "esriFieldTypeString",  
    					            "alias": "TM_Y"
    					          }, {  
    					            "name": "호소명",  
    					            "type": "esriFieldTypeString",  
    					            "alias": "호소명",
    					            "length": 254
    					          }]  
    					        }  
    					//console.info(featureSet.featureSet.features.length);
    					
    					var siteCodes = "";
    					var measureDate = "";
    					  
    					for(var i = 0; i < featureSet.featureSet.features.length; i++){
    						if(featureSet.featureSet.features[i].attributes != undefined){
    							siteCodes += "'" + featureSet.featureSet.features[i].attributes.측정소코드 + "', ";
    						}
    					}
    					
    					if(siteCodes.length > 0){
    						siteCodes = siteCodes.substring(0, siteCodes.length - 2);
    					}
    					
    					//alert(siteCodes);
    					
    					var jsonData;
    					
    					Ext.Ajax.request({
                    		url: './resources/jsp/GetRWMDT.jsp',    // To Which url you wanna POST.
                    		params: { siteCodes: siteCodes, measureDate: measureDate },
                    		async: false, // 비동기 = async: true, 동기 = async: false
                    		success : function(response, opts) {
                    			if(response.responseText.trim() == 'error'){
                    				alert("오류가 발생하였습니다. 관리자에게 문의하세요.");
                    				return;
                    			}
                    			//alert(response.responseText);
                    			// JSON Object로 변경
                    			jsonData = Ext.util.JSON.decode( response.responseText );
                    			//alert(jsonData.data[0].ITEM_SURFACE_CLOA);
                    		},
                    		failure: function(form, action) {
                    			//alert(form.responseText);
                    			alert("오류가 발생하였습니다.");
                    		}
                    	});
    					
    					if(jsonData != undefined && jsonData != null){
    						for(var jsonCnt = 0; jsonCnt < jsonData.data.length; jsonCnt++){
    							//console.info(jsonData.data[jsonCnt].ITEM_SURFACE_CLOA);
    							for(var featureCnt = 0; featureCnt < featureSet.featureSet.features.length; featureCnt++){
    	    						if(featureSet.featureSet.features[featureCnt].attributes != undefined){
    	    							if(jsonData.data[jsonCnt].PT_NO == featureSet.featureSet.features[featureCnt].attributes.측정소코드){
    	    								// 측정일자
    	    								featureSet.featureSet.features[featureCnt].attributes.WMCYMD = jsonData.data[jsonCnt].WMCYMD
    	    								// 클로로필 a
    	    								featureSet.featureSet.features[featureCnt].attributes.ITEM_SURFACE_CLOA = jsonData.data[jsonCnt].ITEM_SURFACE_CLOA
    	    								// 수온
    	    								featureSet.featureSet.features[featureCnt].attributes.ITEM_TEMP_SURF = jsonData.data[jsonCnt].ITEM_TEMP_SURF
    	    								// 남조류세포수
    	    								featureSet.featureSet.features[featureCnt].attributes.ITEM_BLUE_GREEN_ALGAE = jsonData.data[jsonCnt].ITEM_BLUE_GREEN_ALGAE
    	    							}
    	    						}
    							}
    						}
    					}
    					
    					//console.info(featureSet.featureSet.features.length);
				        var featureCollection = {  
			        		layerDefinition: layerDefinition,  
			        		featureSet: featureSet.featureSet
				        };
    					
    					me.layer = new esri.layers.FeatureLayer(featureCollection);
    	    			//me.layer.setDefinitionExpression("1=1");

    	    			me.layer.id = "FeatureLayer1";
    	    			//me.layer.visible = true;
    	    			me.map.addLayer(me.layer);
    	    			
    	    			// Feature Layer에 필드를 추가해야 라벨에서 사용 가능...
    	    			me.layer.fields.push({name: "WMCYMD", alias: "WMCYMD", type: "esriFieldTypeString"});
    	    			me.layer.fields.push({name: "ITEM_SURFACE_CLOA", alias: "ITEM_SURFACE_CLOA", type: "esriFieldTypeString"});
    	    			me.layer.fields.push({name: "ITEM_TEMP_SURF", alias: "ITEM_TEMP_SURF", type: "esriFieldTypeString"});
    	    			me.layer.fields.push({name: "ITEM_BLUE_GREEN_ALGAE", alias: "ITEM_BLUE_GREEN_ALGAE", type: "esriFieldTypeString"});
    	    			
    	    			require(["esri/Color", "esri/symbols/TextSymbol", "esri/renderers/SimpleRenderer",  "esri/layers/LabelLayer"], function(Color, TextSymbol, SimpleRenderer, LabelLayer){
    		    			//var statesColor = new Color("#666");
    	    				var statesColor = new Color("red");
    		    			// create a text symbol to define the style of labels
    		    	        var statesLabel = new TextSymbol().setColor(statesColor);
    		    	        statesLabel.font.setSize("11pt");
    		    	        statesLabel.font.setFamily("arial");
    		    	        var statesLabelRenderer = new SimpleRenderer(statesLabel);
    		    	        console.info(statesLabelRenderer);
    		    	        var labels = new LabelLayer({ id: "labels" });
    		    	        // tell the label layer to label the states feature layer 
    		    	        // using the field named "STATE_NAME"
    		    	        labels.addFeatureLayer(me.layer, statesLabelRenderer, "{측정소명} chl-a:{ITEM_SURFACE_CLOA}");
    		    	        // add the label layer to the map
    		    	        me.map.addLayer(labels);
    		    	        //console.info(labels);
    	    			});
    	    			
    	    			var dialog, highlightSymbol;
    	    			
    	    			require(["dijit/TooltipDialog"], function(TooltipDialog){
    		    			dialog = new TooltipDialog({
    	    		          id: "tooltipDialog",
    	    		          style: "position: absolute; width: 377px; font: normal normal normal 10pt Helvetica;z-index:100"
    	    		        });
    	    		        dialog.startup();
    	    			});
    	    			
    	    			require(["esri/symbols/SimpleFillSymbol",
    	    			         "esri/symbols/SimpleLineSymbol",
    	    			         "esri/Color"
    	    			],
    	    			function (SimpleFillSymbol,
    	    			          SimpleLineSymbol,
    	    			          Color){
    						highlightSymbol = new SimpleFillSymbol(
    								SimpleFillSymbol.STYLE_NULL,
    								new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
    										new Color([255,0,0]), 3),
    								new Color([125,125,125,0.35]));
    						
    															// symbol test
									    						var default_symbol = new SimpleFillSymbol(
									      	    					  SimpleFillSymbol.STYLE_SOLID,
									      	    					  new SimpleLineSymbol(
									      	    					    SimpleLineSymbol.STYLE_SOLID,
									      	    					    new Color([38,115,0]),
									      	    					    2
									      	    					  ),
									      	    					  new Color([38,115,0,0.75])
									      	    					);
									      	    			
									      	    			for(var i = 0; i < me.layer.graphics.length; i++){
									      	    				me.layer.graphics[i].setSymbol(default_symbol);
									      	    				console.info(me.layer.graphics[i].symbol);
									      	    			}
    	    			});

    	    			me.map.on("load", function(){
    	    				me.map.graphics.enableMouseEvents();
    	    				me.map.graphics.on("mouse-out", closeDialog);
        		        });

    	    			me.layer.on("mouse-over", function(evt){
    	    				//evt.layer.enableMouseEvents();
    	    		          var t = "<table class=\"view_form\">" +
			    	    		          "<tr>" +
					          			   "<th>측정일자</th>" +
					          			   "<th>chl-a<br>(㎡)</th>" +
					          			   "<th>수온<br>(℃)</th>" +
					          			   "<th>남조류세포수<br>(cells/㎖)</th>" +
					          			 "</tr>" +
    	    		          			 "<tr>" +
    	    		          			   "<td><b>${WMCYMD}</b></td>" +
    	    		          			   "<td><b>${ITEM_SURFACE_CLOA}</b></td>" +
					          			   "<td><b>${ITEM_TEMP_SURF}</b></td>" +
		    		          			   "<td style=\"border-right: 0px;\"><b>${ITEM_BLUE_GREEN_ALGAE}</b></td>" +
    	    		          			 "</tr>" +
    	    		          		   "</table>";
    	    		          //console.info(evt.graphic.attributes);
    	    		          var content, highlightGraphic;
    	    		          
    	    		          require(["esri/lang"], function(esriLang){
    	    		        	  content = esriLang.substitute(evt.graphic.attributes,t);
    	    		        	  //content = t;
    	    		        	  //console.info(esriLang.substitute);
    	    		          });
    	    		          
    	    		          require(["esri/graphic"], function(Graphic){
    	    		        	  highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
    	    		          });
    	    		          
    	    		          me.map.graphics.add(highlightGraphic);
    	    		          
    	    		          dialog.setContent(content);

    	    		          require(["dojo/dom-style", "dijit/popup"], function(domStyle, dijitPopup){
    	    		        	  domStyle.set(dialog.domNode, "opacity", 0.85);
    		    		          dijitPopup.open({
    		    		            popup: dialog, 
    		    		            x: evt.pageX,
    		    		            y: evt.pageY
    		    		          });
    	    		          });
    	    		     });
    	    			
    	    			me.layer.on("mouse-out", function(){
    	    				//alert("dd");
    	    				require(["dijit/popup"], function(dijitPopup){
    	    					me.map.graphics.clear();
    		    		        dijitPopup.close(dialog);
    	    				});
        		        });
    				});

    			}
    		});
    	});
    }
});
*/