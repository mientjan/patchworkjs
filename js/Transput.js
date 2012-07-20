var Transput = new Class
({
	Extends: HasElement,
	
	initialize: function(id, node)
	{
		this.id = id;
		this.node = node;
	},
	
	destruct: function()
	{
		this.id = null;
		this.node = null;
	}
})

var Input = new Class
({
	Extends: Transput,
	
	initialize: function(id, node)
	{
		this.parent(id, node);
	},
	
	createElement: function()
	{
		return new Element('div', {class: 'input transput'});
	}
})

var Output = new Class
({
	Extends: Transput,
	
	initialize: function(id, node)
	{
		this.parent(id, node);
	},
	
	createElement: function()
	{
		return new Element('div', {class: 'output transput'});
	}
})


