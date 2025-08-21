import { feeService } from "./feeService.js";

export const paymentService = {
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
          { field: { Name: "FeeId" } },
          { field: { Name: "Amount" } },
          { field: { Name: "PaymentDate" } },
          { field: { Name: "Method" } },
          { field: { Name: "Reference" } }
        ],
        orderBy: [{ fieldName: "PaymentDate", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords('Payments', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(payment => ({
        Id: payment.Id,
        feeId: payment.FeeId,
        amount: payment.Amount,
        paymentDate: payment.PaymentDate,
        method: payment.Method,
        reference: payment.Reference || ''
      }));
    } catch (error) {
      console.error("Error in paymentService.getAll:", error);
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
          { field: { Name: "FeeId" } },
          { field: { Name: "Amount" } },
          { field: { Name: "PaymentDate" } },
          { field: { Name: "Method" } },
          { field: { Name: "Reference" } }
        ]
      };

      const response = await apperClient.getRecordById('Payments', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return {
        Id: response.data.Id,
        feeId: response.data.FeeId,
        amount: response.data.Amount,
        paymentDate: response.data.PaymentDate,
        method: response.data.Method,
        reference: response.data.Reference || ''
      };
    } catch (error) {
      console.error("Error in paymentService.getById:", error);
      return null;
    }
  },

  async getByFeeId(feeId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "FeeId" } },
          { field: { Name: "Amount" } },
          { field: { Name: "PaymentDate" } },
          { field: { Name: "Method" } },
          { field: { Name: "Reference" } }
        ],
        where: [
          {
            FieldName: "FeeId",
            Operator: "EqualTo",
            Values: [parseInt(feeId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Payments', params);
      
      if (!response.success) {
        return [];
      }

      return response.data.map(payment => ({
        Id: payment.Id,
        feeId: payment.FeeId,
        amount: payment.Amount,
        paymentDate: payment.PaymentDate,
        method: payment.Method,
        reference: payment.Reference || ''
      }));
    } catch (error) {
      console.error("Error in paymentService.getByFeeId:", error);
      return [];
    }
  },

  async create(paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          FeeId: parseInt(paymentData.feeId),
          Amount: parseFloat(paymentData.amount),
          PaymentDate: paymentData.paymentDate || new Date().toISOString().split("T")[0],
          Method: paymentData.method,
          Reference: paymentData.reference || ''
        }]
      };

      const response = await apperClient.createRecord('Payments', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Update fee status to paid
          await feeService.update(paymentData.feeId, { status: "paid" });
          
          return {
            Id: result.data.Id,
            feeId: result.data.FeeId,
            amount: result.data.Amount,
            paymentDate: result.data.PaymentDate,
            method: result.data.Method,
            reference: result.data.Reference
          };
        } else {
          throw new Error(result.message || 'Failed to create payment');
        }
      }
    } catch (error) {
      console.error("Error in paymentService.create:", error);
      throw error;
    }
  },

  async update(id, paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateFields = {
        Id: parseInt(id)
      };

      if (paymentData.feeId !== undefined) updateFields.FeeId = parseInt(paymentData.feeId);
      if (paymentData.amount !== undefined) updateFields.Amount = parseFloat(paymentData.amount);
      if (paymentData.paymentDate !== undefined) updateFields.PaymentDate = paymentData.paymentDate;
      if (paymentData.method !== undefined) updateFields.Method = paymentData.method;
      if (paymentData.reference !== undefined) updateFields.Reference = paymentData.reference;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('Payments', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            feeId: result.data.FeeId,
            amount: result.data.Amount,
            paymentDate: result.data.PaymentDate,
            method: result.data.Method,
            reference: result.data.Reference
          };
        } else {
          throw new Error(result.message || 'Failed to update payment');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in paymentService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      // Get current payment to update fee status
      const currentPayment = await this.getById(id);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Payments', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Update fee status back to pending
          if (currentPayment?.feeId) {
            await feeService.update(currentPayment.feeId, { status: "pending" });
          }
          return { Id: parseInt(id) };
        } else {
          throw new Error(result.message || 'Failed to delete payment');
        }
      }
      return null;
    } catch (error) {
      console.error("Error in paymentService.delete:", error);
      throw error;
    }
  }
};