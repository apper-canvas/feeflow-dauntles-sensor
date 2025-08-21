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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "total_due_c" } },
          { field: { Name: "total_paid_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords('client_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

return response.data.map(client => ({
        Id: client.Id,
        name: client.Name,
        email: client.email_c,
        phone: client.phone_c,
        totalDue: client.total_due_c || 0,
        totalPaid: client.total_paid_c || 0,
        status: client.status_c || 'active'
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "total_due_c" } },
          { field: { Name: "total_paid_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.getRecordById('client_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

return {
        Id: response.data.Id,
        name: response.data.Name,
        email: response.data.email_c,
        phone: response.data.phone_c,
        totalDue: response.data.total_due_c || 0,
        totalPaid: response.data.total_paid_c || 0,
        status: response.data.status_c || 'active'
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
          email_c: clientData.email,
          phone_c: clientData.phone || '',
          status_c: clientData.status || 'active',
          total_due_c: 0,
          total_paid_c: 0
        }]
      };

      const response = await apperClient.createRecord('client_c', params);
      
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
            email: result.data.email_c,
            phone: result.data.phone_c,
            totalDue: result.data.total_due_c || 0,
            totalPaid: result.data.total_paid_c || 0,
            status: result.data.status_c
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
      if (clientData.email !== undefined) updateFields.email_c = clientData.email;
      if (clientData.phone !== undefined) updateFields.phone_c = clientData.phone;
      if (clientData.status !== undefined) updateFields.status_c = clientData.status;
      if (clientData.totalDue !== undefined) updateFields.total_due_c = clientData.totalDue;
      if (clientData.totalPaid !== undefined) updateFields.total_paid_c = clientData.totalPaid;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('client_c', params);
      
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
            email: result.data.email_c,
            phone: result.data.phone_c,
            totalDue: result.data.total_due_c || 0,
            totalPaid: result.data.total_paid_c || 0,
            status: result.data.status_c
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

const response = await apperClient.deleteRecord('client_c', params);
      
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