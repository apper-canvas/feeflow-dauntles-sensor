export const clientService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Email" } },
          { field: { Name: "Phone" } },
          { field: { Name: "TotalDue" } },
          { field: { Name: "TotalPaid" } },
          { field: { Name: "Status" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords('Clients', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(client => ({
        Id: client.Id,
        name: client.Name,
        email: client.Email,
        phone: client.Phone,
        totalDue: client.TotalDue || 0,
        totalPaid: client.TotalPaid || 0,
        status: client.Status || 'active'
      }));
    } catch (error) {
      console.error("Error in clientService.getAll:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Email" } },
          { field: { Name: "Phone" } },
          { field: { Name: "TotalDue" } },
          { field: { Name: "TotalPaid" } },
          { field: { Name: "Status" } }
        ]
      };

      const response = await apperClient.getRecordById('Clients', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        name: response.data.Name,
        email: response.data.Email,
        phone: response.data.Phone,
        totalDue: response.data.TotalDue || 0,
        totalPaid: response.data.TotalPaid || 0,
        status: response.data.Status || 'active'
      };
    } catch (error) {
      console.error("Error in clientService.getById:", error);
      return null;
    }
  },

  async create(clientData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: clientData.name,
          Email: clientData.email,
          Phone: clientData.phone || '',
          Status: clientData.status || 'active',
          TotalDue: 0,
          TotalPaid: 0
        }]
      };

      const response = await apperClient.createRecord('Clients', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            name: result.data.Name,
            email: result.data.Email,
            phone: result.data.Phone,
            totalDue: result.data.TotalDue || 0,
            totalPaid: result.data.TotalPaid || 0,
            status: result.data.Status
          };
        } else {
          throw new Error(result.message || 'Failed to create client');
        }
      }
    } catch (error) {
      console.error("Error in clientService.create:", error);
      throw error;
    }
  },

  async update(id, clientData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateFields = {
        Id: parseInt(id)
      };

      if (clientData.name !== undefined) updateFields.Name = clientData.name;
      if (clientData.email !== undefined) updateFields.Email = clientData.email;
      if (clientData.phone !== undefined) updateFields.Phone = clientData.phone;
      if (clientData.status !== undefined) updateFields.Status = clientData.status;
      if (clientData.totalDue !== undefined) updateFields.TotalDue = clientData.totalDue;
      if (clientData.totalPaid !== undefined) updateFields.TotalPaid = clientData.totalPaid;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('Clients', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            name: result.data.Name,
            email: result.data.Email,
            phone: result.data.Phone,
            totalDue: result.data.TotalDue || 0,
            totalPaid: result.data.TotalPaid || 0,
            status: result.data.Status
          };
        } else {
          throw new Error(result.message || 'Failed to update client');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in clientService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Clients', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { Id: parseInt(id) };
        } else {
          throw new Error(result.message || 'Failed to delete client');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in clientService.delete:", error);
      throw error;
    }
  }
};