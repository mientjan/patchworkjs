var Patch = new Class
({
	Extends: DestructableEvents,
	initialize: function (context)
	{
		this.context = context;
		this.nodes = [];
		this.connections = [];
		this.buffers = [];
	},
	
	addBuffer: function()
	{
		var buffer = new Buffer(this);		
		this.buffers.push(buffer);
		
		this.fireEvent(PatchEvent.BUFFER_ADDED, {buffer: buffer, type: PatchEvent.BUFFER_ADDED});
	},
	
	removeBuffer: function(buffer)
	{
		this.buffers = this.buffers.erase(buffer);
		
		this.fireEvent(PatchEvent.BUFFER_REMOVED, {buffer: buffer, type: PatchEvent.BUFFER_REMOVED});
	},
	
	addNode: function(node)
	{
		if(this.nodes.indexOf(node) == -1)
		{
			this.nodes.push(node);
			
			node.patch = this;

			// reorder all ids			
			this.updateNodeIDs();
			
			// // do the actual connection in the context
			// if(node.audioNode)
			// {
				// console.log(node.audioNode);
// // 			
				// // for(var key in node.audioNode)
				// // {
					// // console.log(key);
					// // console.log(node.audioNode[key]);
					// // console.log(node.audioNode[key].constructor.toString());
				// // }	
			// }
			// else
			// {
				// console.error('Node doesn\'t have an AudioNode');
			// }
			
			this.fireEvent(PatchEvent.NODE_ADDED, {node: node, type: PatchEvent.NODE_ADDED});
		}
		else
		{
			console.warn('Can\'t add, node already present in patch.');
		}
	},
	
	addNewModuleByType: function(moduleType)
	{
		// first check if we want to add a 2nd destination
		if(moduleType == Modules.DESTINATION && this.hasDestination())
		{
			console.warn('A patch can only have one destination module.');
			return;
		}
		
		// get the definition for this module
		var moduleDefinition = ModuleDefinitions[moduleType];
		
		if(!moduleDefinition)
		{
			console.error('Module definition not found for: ' + moduleType);
			return;
		}
		if(!moduleDefinition.moduleClass)
		{
			console.error('No ModuleClass found in definition found for: ' + moduleType);
			return;
		}
		
		// make an instance from the class defined in the definition
		var module = new moduleDefinition.moduleClass(moduleDefinition, this);
		
		this.addNode(module);
	},
	
	hasDestination: function()
	{
		for(var i = 0; i < this.nodes.length; i++) if(this.nodes[i].type == Modules.DESTINATION) return true;
		
		return false;
	},
	
	removeNode: function(node)
	{
		if(this.nodes.indexOf(node) == -1)
		{
			console.warn('Node not found, can\'t remove.');
		}
		else
		{
			// remove from list
			this.nodes = this.nodes.erase(node);
			
			// remove any connections associated with this node
			this.removeConnectionsForNode(node);
			
			console.log('Node removed.');
			
			this.updateNodeIDs();
			
			this.fireEvent(PatchEvent.NODE_REMOVED, {node: node, type: PatchEvent.NODE_REMOVED});
			
			// destruct it
			node.destruct();
		}
	},
	
	removeConnectionsForNode: function(node)
	{
		// loop backwards, because the array changes when we remove multiple connections from it
		for(var i = this.connections.length -1; i >=0; i--)
		{
			var connection = this.connections[i];
			if(connection.sourceOutput.node == node || connection.destinationInput.node == node)
			{
				// this connection is connected to the node
				this.removeConnection(connection);
			}
		}
	},
	
	removeConnection: function(connection)
	{
		if(this.connections.indexOf(connection) == -1)
		{
			console.warn('Connection not found, can\'t remove.');
		}
		else
		{
			// remove from list
			this.connections = this.connections.erase(connection);
			
			console.log('Connection removed.');
			
			this.fireEvent(PatchEvent.CONNECTION_REMOVED, {connection: connection, type: PatchEvent.CONNECTION_REMOVED});
			
			// destruct it
			connection.destruct();
		}
	},
	
	removeNodeById: function(nodeId)
	{
		var node = this.getNodeById(nodeId);
		
		if(node)
		{
			this.removeNode(node);
		}
		else
		{
			console.warn('Not found, can\'t remove node');
		}
	},
	
	getNodeById: function(nodeId)
	{
		for(var i = 0; i < this.nodes.length; i++) if(this.nodes[i].id == nodeId) return this.nodes[i];
		
		console.warn('Node not found with id: ' + nodeId);
		return null;
	},
	
	addConnection: function(sourceNodeId, sourceOutputId, destinationNodeId, destinationInputId)
	{
		var sourceNode = this.getNodeById(sourceNodeId);
		if(!sourceNode)
		{
			console.warn('SourceNode not found for id: ' + sourceNodeId);
			return;
		}
		
		var sourceOutput = sourceNode.getOutputById(sourceOutputId);
		if(!sourceOutput)
		{
			console.warn('SourceOutput not found for id: ' + sourceOutputId);
			return;
		}
		
		var destinationNode = this.getNodeById(destinationNodeId);
		if(!destinationNode)
		{
			console.warn('DestinationNode not found for id: ' + destinationNodeId);
			return;
		}
		
		var destinationInput = destinationNode.getInputById(destinationInputId);
		if(!destinationInput)
		{
			console.warn('DestinationInput not found for id: ' + destinationInputId);
			return;
		}
		
		
		// do the actual connection on the context (might raise exceptions when input/output out of bounds, or when creating a feedbackloop without a delay module)
		try
		{
			sourceNode.audioNode.connect(destinationNode.audioNode);
		}
		catch(e)
		{
			console.error(e.message);
			return;
		}
		
		var connection = new Connection(sourceOutput, destinationInput);
		this.connections.push(connection);
		
		console.log('Connection added, total: ' + this.connections.length);
		this.fireEvent(PatchEvent.CONNECTION_ADDED, {connection: connection, type: PatchEvent.CONNECTION_ADDED});
	},
	
	updateNodeIDs: function()
	{
		var nodeCountByType = {};
		for(var i = 0; i < this.nodes.length; i++)
		{
			var node = this.nodes[i];
			if(nodeCountByType[node.type])
			{
				nodeCountByType[node.type]++;
			}
			else
			{
				nodeCountByType[node.type] = 1;
			}
			
			node.id = node.type + '-' + nodeCountByType[node.type];
		}
	},
	
	toJSON: function()
	{
		var modulesJSON = [];
		for(var i = 0; i < this.nodes.length; i++)
		{
			modulesJSON.push(this.nodes[i].toJSON());
		}
		var connectionsJSON = [];
		for(var i = 0; i < this.connections.length; i++)
		{
			connectionsJSON.push(this.connections[i].toJSON());
		}
		return {modules: modulesJSON, connections: connectionsJSON};
	}
	
});

	
	
