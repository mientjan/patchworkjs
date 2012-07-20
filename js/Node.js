var Node = new Class
({
	Extends: HasElement,
	
	initialize: function(name, numInputs, numOutputs)
	{
		this.name = name;
		this.id; // TODO hmmm?
		this.patch; // TODO hmmm?
		
		this.inputs = [];
		this.outputs = [];
		for(var i = 0; i < numInputs; i++) this.inputs.push(new Input(i, this)); 
		for(var o = 0; o < numOutputs; o++) this.outputs.push(new Output(o, this)); 
	},
	
	createElement: function()
	{
		// TODO move this to AbstractModule
		var nodeElement = new Element('div', {class: 'node'});
		
		var headerElement = new Element('div', {class: 'header', html: this.name + '<a href="#" class="remove-node">x</a>'});
		var contentElement = new Element('div', {class: 'content'});
		var inputsElement = new Element('div', {class: 'transputs'})
		var outputsElement = new Element('div', {class: 'transputs'})

		// add the module content
		contentElement.grab(this.createModuleContent());

		// add the inputs and output elements		
		for(var i = 0; i < this.inputs.length; i++) inputsElement.grab(this.inputs[i]);
		for(var o = 0; o < this.outputs.length; o++) outputsElement.grab(this.outputs[o]);
		
		// build element
		nodeElement.grab(inputsElement);
		nodeElement.grab(headerElement);
		nodeElement.grab(contentElement);
		nodeElement.grab(outputsElement);
		
		// add listener to remove-click
		nodeElement.getElement('.remove-node').addEvent('click', this.onRemoveClick.bind(this));
		
		return nodeElement;
	},
	
	// setID: function(id)
	// {
		// this.id = id;
		// console.log('set id ' + id)
// 		
		// this.setElementIDs();
	// },
	
	/*
	 * Sets all ids of all elements correctly, according to the current id of this node
	 */
	setElementIDs: function()
	{
		// node itself
		this.element.set('id', this.id);
		
		// inputs
		for(var i = 0; i < this.inputs.length; i++)
		{
			//console.log('--> ' + this.inputs[i].element);
			this.inputs[i].element.set('id', this.id + '-input-' + this.inputs[i].id);
		}
		
		// outputs
		for(var o = 0; o < this.outputs.length; o++)
		{
			this.outputs[o].element.set('id', this.id + '-output-' + this.outputs[o].id);
		}
		
		//console.log(this.element);
	},
	
	onRemoveClick: function()
	{
		this.patch.removeNode(this);
	},
	
	getInputById: function(inputId)
	{
		for(var i = 0; i < this.inputs.length; i++) if(this.inputs[i].id == inputId) return this.inputs[i];
			
		console.log('Input not found with id: ' + inputId);
		return null;
	},
	
	getOutputById: function(outputId)
	{
		for(var i = 0; i < this.outputs.length; i++) if(this.outputs[i].id == outputId) return this.outputs[i]; 
			
		console.log('Output not found with id: ' + outputId);
		return null;
	},
	
	destruct: function ()
	{
		for(var i = 0; i < this.inputs.length; i++)
		{
			this.inputs[i].destruct();			
		}
		for(var o = 0; o < this.inputs.length; o++)
		{
			this.outputs[o].destruct();			
		}
		
		this.inputs = null;
		this.outputs = null;
		this.patch = null;
		
		this.parent();
	}
	
});
	
