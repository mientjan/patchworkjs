var Connection = new Class
({
	Extends: DestructableEvents,
	
	initialize: function(sourceOutput, destinationInput)
	{
		this.sourceOutput = sourceOutput;
		this.destinationInput = destinationInput;
	},
	
	toJSON: function()
	{
		return {source_module_id: this.sourceOutput.node.id, source_output_id: this.sourceOutput.id, destination_module_id: this.destinationInput.node.id, destination_input_id: this.destinationInput.id};
	},
	
	destruct: function()
	{
		this.sourceOutut = null;
		this.destinationInput = null;
		
		this.parent();
	}
})