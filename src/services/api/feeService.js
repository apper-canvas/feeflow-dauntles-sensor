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
          { field: { Name: "ClientId" } },
          { field: { Name: "Description" } },
          { field: { Name: "Amount" } },
          { field: { Name: "DueDate" } },
          { field: { Name: "Category" } },
          { field: { Name: "Status" } },
          { field: { Name: "IsRecurring" } },
          { field: { Name: "Note" } }
        ],
        orderBy: [{ fieldName: "DueDate", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords('Fees', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(fee => ({
        Id: fee.Id,
        clientId: fee.ClientId,
        description: fee.Description,
        amount: fee.Amount,
        dueDate: fee.DueDate,
        category: fee.Category,
        status: fee.Status || 'pending',
        isRecurring: fee.IsRecurring || false,
        note: fee.Note || ''
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
          { field: { Name: "ClientId" } },
          { field: { Name: "Description" } },
          { field: { Name: "Amount" } },
          { field: { Name: "DueDate" } },
          { field: { Name: "Category" } },
          { field: { Name: "Status" } },
          { field: { Name: "IsRecurring" } },
          { field: { Name: "Note" } }
        ]
      };

      const response = await apperClient.getRecordById('Fees', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        clientId: response.data.ClientId,
        description: response.data.Description,
        amount: response.data.Amount,
        dueDate: response.data.DueDate,
        category: response.data.Category,
        status: response.data.Status || 'pending',
        isRecurring: response.data.IsRecurring || false,
        note: response.data.Note || ''
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
          { field: { Name: "ClientId" } },
          { field: { Name: "Description" } },
          { field: { Name: "Amount" } },
          { field: { Name: "DueDate" } },
          { field: { Name: "Category" } },
          { field: { Name: "Status" } },
          { field: { Name: "IsRecurring" } },
          { field: { Name: "Note" } }
        ],
        where: [
          {
            FieldName: "ClientId",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Fees', params);
      
      if (!response.success) {
        return [];
      }

      return response.data.map(fee => ({
        Id: fee.Id,
        clientId: fee.ClientId,
        description: fee.Description,
        amount: fee.Amount,
        dueDate: fee.DueDate,
        category: fee.Category,
        status: fee.Status || 'pending',
        isRecurring: fee.IsRecurring || false,
        note: fee.Note || ''
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
          ClientId: parseInt(feeData.clientId),
          Description: feeData.description,
          Amount: parseFloat(feeData.amount),
          DueDate: feeData.dueDate,
          Category: feeData.category,
          Status: 'pending',
          IsRecurring: feeData.isRecurring || false,
          Note: feeData.note || ''
        }]
      };

      const response = await apperClient.createRecord('Fees', params);
      
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
            clientId: result.data.ClientId,
            description: result.data.Description,
            amount: result.data.Amount,
            dueDate: result.data.DueDate,
            category: result.data.Category,
            status: result.data.Status,
            isRecurring: result.data.IsRecurring,
            note: result.data.Note
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

      if (feeData.clientId !== undefined) updateFields.ClientId = parseInt(feeData.clientId);
      if (feeData.description !== undefined) updateFields.Description = feeData.description;
      if (feeData.amount !== undefined) updateFields.Amount = parseFloat(feeData.amount);
      if (feeData.dueDate !== undefined) updateFields.DueDate = feeData.dueDate;
      if (feeData.category !== undefined) updateFields.Category = feeData.category;
      if (feeData.status !== undefined) updateFields.Status = feeData.status;
      if (feeData.isRecurring !== undefined) updateFields.IsRecurring = feeData.isRecurring;
      if (feeData.note !== undefined) updateFields.Note = feeData.note;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('Fees', params);
      
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
            clientId: result.data.ClientId,
            description: result.data.Description,
            amount: result.data.Amount,
            dueDate: result.data.DueDate,
            category: result.data.Category,
            status: result.data.Status,
            isRecurring: result.data.IsRecurring,
            note: result.data.Note
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

      const response = await apperClient.deleteRecord('Fees', params);
      
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