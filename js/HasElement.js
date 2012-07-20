var HasElement = new Class
({
	Extends: DestructableEvents,
	
	toElement: function()
	{
		if(!this.element)
		{
			//console.log('No element, creating one.');
			this.element = this.createElement();
		}
		
		return this.element;
	},
	
	createElement: function()
	{
		console.log('CreateElement base function, this should be overriden.');
	}
})
