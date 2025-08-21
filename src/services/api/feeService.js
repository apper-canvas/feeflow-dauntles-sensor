import { clientService } from "./clientService.js";

export const feeService = {
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
          { field: { Name: "client_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "is_recurring_c" } },
          { field: { Name: "note_c" } }
        ],
        orderBy: [{ fieldName: "due_date_c", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords('fee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

return response.data.map(fee => ({
        Id: fee.Id,
        clientId: fee.client_id_c,
        description: fee.description_c,
        amount: fee.amount_c,
        dueDate: fee.due_date_c,
        category: fee.category_c,
        status: fee.status_c || 'pending',
        isRecurring: fee.is_recurring_c || false,
        note: fee.note_c || ''
      }));
    } catch (error) {
      console.error("Error in feeService.getAll:", error);
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
          { field: { Name: "client_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "is_recurring_c" } },
          { field: { Name: "note_c" } }
        ]
      };

      const response = await apperClient.getRecordById('fee_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

return {
        Id: response.data.Id,
        clientId: response.data.client_id_c,
        description: response.data.description_c,
        amount: response.data.amount_c,
        dueDate: response.data.due_date_c,
        category: response.data.category_c,
        status: response.data.status_c || 'pending',
        isRecurring: response.data.is_recurring_c || false,
        note: response.data.note_c || ''
      };
    } catch (error) {
      console.error("Error in feeService.getById:", error);
      return null;
    }
  },

  async getByClientId(clientId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "client_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "is_recurring_c" } },
          { field: { Name: "note_c" } }
        ],
        where: [
          {
            FieldName: "client_id_c",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('fee_c', params);
      
      if (!response.success) {
        return [];
      }

return response.data.map(fee => ({
        Id: fee.Id,
        clientId: fee.client_id_c,
        description: fee.description_c,
        amount: fee.amount_c,
        dueDate: fee.due_date_c,
        category: fee.category_c,
        status: fee.status_c || 'pending',
        isRecurring: fee.is_recurring_c || false,
        note: fee.note_c || ''
      }));
    } catch (error) {
      console.error("Error in feeService.getByClientId:", error);
      return [];
    }
  },

  async create(feeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        records: [{
          client_id_c: parseInt(feeData.clientId),
          description_c: feeData.description,
          amount_c: parseFloat(feeData.amount),
          due_date_c: feeData.dueDate,
          category_c: feeData.category,
          status_c: 'pending',
          is_recurring_c: feeData.isRecurring || false,
          note_c: feeData.note || ''
        }]
      };

      const response = await apperClient.createRecord('fee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Update client totals
          await this.updateClientTotals(feeData.clientId);
          
return {
            Id: result.data.Id,
            clientId: result.data.client_id_c,
            description: result.data.description_c,
            amount: result.data.amount_c,
            dueDate: result.data.due_date_c,
            category: result.data.category_c,
            status: result.data.status_c,
            isRecurring: result.data.is_recurring_c,
            note: result.data.note_c
          };
        } else {
          throw new Error(result.message || 'Failed to create fee');
        }
      }
    } catch (error) {
      console.error("Error in feeService.create:", error);
      throw error;
    }
  },

  async update(id, feeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get current fee to check client change
      const currentFee = await this.getById(id);
      const oldClientId = currentFee?.clientId;

      const updateFields = {
        Id: parseInt(id)
      };

if (feeData.clientId !== undefined) updateFields.client_id_c = parseInt(feeData.clientId);
      if (feeData.description !== undefined) updateFields.description_c = feeData.description;
      if (feeData.amount !== undefined) updateFields.amount_c = parseFloat(feeData.amount);
      if (feeData.dueDate !== undefined) updateFields.due_date_c = feeData.dueDate;
      if (feeData.category !== undefined) updateFields.category_c = feeData.category;
      if (feeData.status !== undefined) updateFields.status_c = feeData.status;
      if (feeData.isRecurring !== undefined) updateFields.is_recurring_c = feeData.isRecurring;
      if (feeData.note !== undefined) updateFields.note_c = feeData.note;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('fee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Update client totals for both old and new client if changed
          if (oldClientId) {
            await this.updateClientTotals(oldClientId);
          }
          if (feeData.clientId && feeData.clientId !== oldClientId) {
            await this.updateClientTotals(feeData.clientId);
          }
          
return {
            Id: result.data.Id,
            clientId: result.data.client_id_c,
            description: result.data.description_c,
            amount: result.data.amount_c,
            dueDate: result.data.due_date_c,
            category: result.data.category_c,
            status: result.data.status_c,
            isRecurring: result.data.is_recurring_c,
            note: result.data.note_c
          };
        } else {
          throw new Error(result.message || 'Failed to update fee');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in feeService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      // Get current fee to update client totals
      const currentFee = await this.getById(id);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

const response = await apperClient.deleteRecord('fee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Update client totals
          if (currentFee?.clientId) {
            await this.updateClientTotals(currentFee.clientId);
          }
          return { Id: parseInt(id) };
        } else {
          throw new Error(result.message || 'Failed to delete fee');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in feeService.delete:", error);
      throw error;
    }
  },

  async updateClientTotals(clientId) {
    try {
      const clientFees = await this.getByClientId(clientId);
      const totalDue = clientFees
        .filter(f => f.status === "pending" || f.status === "overdue")
        .reduce((sum, f) => sum + f.amount, 0);
      const totalPaid = clientFees
        .filter(f => f.status === "paid")
        .reduce((sum, f) => sum + f.amount, 0);
      
      await clientService.update(clientId, { totalDue, totalPaid });
    } catch (error) {
      console.error("Error updating client totals:", error);
    }
  }
};