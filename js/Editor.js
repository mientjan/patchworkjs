var Editor = new Class
({

	initialize: function(domElement)
	{
		this.domElement = domElement;
		//this.domElement.setStyles({position: 'relative'});
		
		this.view = new Element('div', {id: 'view'});
		
		// create canvas
		this.connectionsCanvas = new Element('canvas', {id: 'connections_canvas'});
		this.connectionsCanvasContext = this.connectionsCanvas.getContext('2d');
		
		// create manager for connections
		this.connectionsManager = new ConnectionsManager();
		this.connectionsManager.addEvent('drag_connection', this.handleDragConnectionEvent.bind(this));
		
		// create and add nodes layer
		this.nodesLayer = new Element('div', {id: 'nodesLayer'});
		
		// add the footer
		this.footer = new Element('div', {id: 'footer'});
		
		// add all together
		this.view.appendChild(this.connectionsCanvas);
		this.view.grab(this.nodesLayer);
		this.domElement.grab(this.view);
		this.domElement.grab(this.footer);
		
		this.scaleAndAlign();
	},
	
	scaleAndAlign: function()
	{
		var domElementSize = this.domElement.getSize();
		var viewHeight = domElementSize.y - this.footer.getSize().y;
		
		this.view.setStyles({height: viewHeight});
		this.connectionsCanvas.width = domElementSize.x;	
		this.connectionsCanvas.height = viewHeight;
		this.footer.setStyles({top: viewHeight});
	},
	
	setPatch: function(patch)
	{
		this.patch = patch;
		this.connectionsManager.patch = patch;
		
		this.patch.addEvent(PatchEvent.NODE_ADDED, this.handlePatchEvent.bind(this));
		this.patch.addEvent(PatchEvent.NODE_REMOVED, this.handlePatchEvent.bind(this));
		this.patch.addEvent(PatchEvent.CONNECTION_ADDED, this.handlePatchEvent.bind(this));
		this.patch.addEvent(PatchEvent.CONNECTION_REMOVED, this.handlePatchEvent.bind(this));
		this.patch.addEvent(PatchEvent.BUFFER_ADDED, this.handlePatchEvent.bind(this));
		this.patch.addEvent(PatchEvent.BUFFER_REMOVED, this.handlePatchEvent.bind(this));
	},
	
	handlePatchEvent: function(event)
	{
		switch(event.type)
		{
			case PatchEvent.NODE_ADDED:
			{
				// add to layer (creates element)
				this.nodesLayer.grab(event.node);
				
				if(event.node.type == Modules.ANALYSER)
				{
					event.node.element.setStyle('width',  '255px');
				}
				
				// add drag
				new Drag(event.node.element, {handle: event.node.element.getElement('.header')}).addEvent('drag', this.handleNodeDragEvent.bind(this));
				
				// add slider TODO move!
				event.node.element.getElements('.slider').each(function (item)
				{
					var audioParam = item.retrieve('audioParam');
					var maxValue = audioParam.maxValue == 100000 ? 20000 : audioParam.maxValue;
					if(maxValue > 21000) maxValue = 10000;
					new Slider(item.getElement('.track'), item.getElement('.knob'), {range: [audioParam.minValue, maxValue], initialStep: audioParam.defaultValue, onChange: this.onSliderChange.bind(item)});
				}, this);
				
				// add mouse-listeners to transputs
				Array.each(event.node.element.getElements('.transput'), function(transput)
				{
					transput.addEventListener('mousedown', this.connectionsManager.handleTransputMouseEvent.bind(this.connectionsManager));
					transput.addEventListener('mouseup', this.connectionsManager.handleTransputMouseEvent.bind(this.connectionsManager));
				}, this);
				
				// loop through all nodes to reset their ids
				this.reassignElementIDs();
				
				break;
			}
			case PatchEvent.NODE_REMOVED:
			{
				$(event.node).dispose();
				
				this.reassignElementIDs();
				break;
			}
			case PatchEvent.BUFFER_ADDED:
			{
				this.footer.grab(event.buffer);
				break;
			}
			case PatchEvent.BUFFER_REMOVED:
			{
				event.buffer.element.dispose();
				break;
			}
			case PatchEvent.CONNECTION_ADDED:
			case PatchEvent.CONNECTION_REMOVED:
			{
				this.updateCanvas();
				break;
			}
		}
	},
	
	onSliderChange: function(value)
	{
		// TODO dit moet anders kunnen
		this.retrieve('audioParam').value = value;
		this.getElement('.value').set('text', value);
	},
	
	/*
	 * Loops through all nodes and sets the ids of some elements (node itself and the inputs+outputs) to the correct ids (based on the node's id)
	 */
	reassignElementIDs: function()
	{
		for(var i = 0; i < this.patch.nodes.length; i++) this.patch.nodes[i].setElementIDs();
	},
	
	handleNodeDragEvent: function(event)
	{
		this.updateCanvas();
	},
	
	updateCanvas: function(drawDraggingLine)
	{
		this.connectionsCanvasContext.clearRect(0, 0, this.connectionsCanvas.width, this.connectionsCanvas.height);
		
		var connections = this.patch.connections;
		for (var i = 0; i < connections.length; i++)
		{
			var connection = connections[i];
			
			var outputElementId = connection.sourceOutput.node.id + '-output-' + connection.sourceOutput.id;
			var inputElementId = connection.destinationInput.node.id + '-input-' + connection.destinationInput.id;
			
			var sourceOutputElement = this.nodesLayer.getElementById(outputElementId);
			var destinationInputElement = this.nodesLayer.getElementById(inputElementId);
			
			var sourceOutputElementLocation = sourceOutputElement.getCoordinates(this.nodesLayer); 
			var destinationInputElementLocation = destinationInputElement.getCoordinates(this.nodesLayer); 
			var sourceCenter = this.getElementCenter(sourceOutputElementLocation);
			var destinationCenter = this.getElementCenter(destinationInputElementLocation);

			this.drawLine(this.connectionsCanvasContext, sourceCenter.x, sourceCenter.y, destinationCenter.x, destinationCenter.y);	
		}
		
		if(drawDraggingLine && this.connectionsManager.sourceOutputElement)
		{
			var draggingOutputCenter = this.getElementCenter(this.connectionsManager.sourceOutputElement.getCoordinates(this.nodesLayer));
			
			var adjust = this.domElement.getCoordinates();
			
			this.drawLine(this.connectionsCanvasContext, draggingOutputCenter.x, draggingOutputCenter.y, this.connectionsManager.mousePosition.x - adjust.left, this.connectionsManager.mousePosition.y - adjust.top);
		}
	},
	
	drawLine: function(canvasContext, startX, startY, endX, endY)
	{
		canvasContext.beginPath();
		canvasContext.moveTo(startX, startY);
		canvasContext.lineTo(endX, endY);
		canvasContext.closePath();
		canvasContext.stroke();
	},
	
	handleDragConnectionEvent: function()
	{
		this.updateCanvas(true);
	},
	
	getElementCenter: function(coordinates)
	{
		return {x: coordinates.left + 0.5 * coordinates.width, y: coordinates.top + 0.5 * coordinates.height};
	}
})
