var ConnectionsManager = new Class
({
	Extends: DestructableEvents,
	
	initialize: function()
	{
		// TODO
		this.patch;
		this.sourceOutputElement;
		this.destinationInputElement;
	},
	
	handleTransputMouseEvent: function(event)
	{
		//console.log(event.type + ': ' + event.target);
		//this.mousePosition = {x: event.offsetX, y:  event.offsetY};

		switch(event.type)
		{
			case 'mousedown':
			{
				// can only drag from ouputs
				if(event.target.hasClass('output'))
				{
					console.log('Start drag from ' + event.target.getParent().getParent().getProperty('id') + ', ' + event.target.getProperty('id'));
					
					this.sourceOutputElement = event.target;
					this.destinationInputElement = null;
					//console.log('>>>> ' + this.sourceOutputElement);
					// stageclick
					this._stageClick = this.handleDocumentMouseUp.bind(this);
					this._stageMouseMove = this.handleDocumentMouseMove.bind(this);
					document.addEvent('mouseup', this._stageClick);
					document.addEvent('mousemove', this._stageMouseMove);
				}
				else
				{
					this.reset();
				}
				break;
			}
			case 'mouseup':
			{
				// can only stop drag on inputs, and source must be filled
				if(event.target.hasClass('input') && this.sourceOutputElement != null)
				{
					console.log('input up');
					// succesful connection
					this.destinationInputElement = event.target;
					
					// create correct module & transput ids
					var sourceNodeId = this.sourceOutputElement.getParent().getParent().getProperty('id').replace('node-', '');
					var sourceOutputId = /\w+-\d+-\w+-(\d+)/g.exec(this.sourceOutputElement.getProperty('id'))[1];
					var destinationNodeId = this.destinationInputElement.getParent().getParent().getProperty('id').replace('node-', '');
					var destinationInputId = /\w+-\d+-\w+-(\d+)/g.exec(this.destinationInputElement.getProperty('id'))[1];
					
					this.patch.addConnection(sourceNodeId, sourceOutputId, destinationNodeId, destinationInputId);
					
					this.reset();
				}
				else
				{
					this.reset();
				}
				break;
			}
		}		
	},
	
	handleDocumentMouseUp: function(event)
	{
		console.log('up');
		
		document.removeEvent('mouseup', this._stageClick);
		document.removeEvent('mousemove', this._stageMouseMove);
		
		this.reset();
		
		this.fireEvent('drag_connection'); // forces a redraw on the canvas, clearing the dragging line
	},
	
	handleDocumentMouseMove: function(event)
	{
		this.mousePosition = {x: event.page.x, y:  event.page.y};
		// only called when dragging a half connection
		this.fireEvent('drag_connection');
	},
	
	reset: function()
	{
		console.log('ConnectionManager reset');
		
		
		this.sourceOutputElement = null;
		this.destinationInputElement = null;
	}
})