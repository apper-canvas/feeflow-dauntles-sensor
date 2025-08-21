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
          { field: { Name: "fee_id_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "payment_date_c" } },
          { field: { Name: "method_c" } },
          { field: { Name: "reference_c" } }
        ],
        orderBy: [{ fieldName: "payment_date_c", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords('payment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

return response.data.map(payment => ({
        Id: payment.Id,
        feeId: payment.fee_id_c,
        amount: payment.amount_c,
        paymentDate: payment.payment_date_c,
        method: payment.method_c,
        reference: payment.reference_c || ''
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
          { field: { Name: "fee_id_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "payment_date_c" } },
          { field: { Name: "method_c" } },
          { field: { Name: "reference_c" } }
        ]
      };

      const response = await apperClient.getRecordById('payment_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

return {
        Id: response.data.Id,
        feeId: response.data.fee_id_c,
        amount: response.data.amount_c,
        paymentDate: response.data.payment_date_c,
        method: response.data.method_c,
        reference: response.data.reference_c || ''
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
          { field: { Name: "fee_id_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "payment_date_c" } },
          { field: { Name: "method_c" } },
          { field: { Name: "reference_c" } }
        ],
        where: [
          {
            FieldName: "fee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(feeId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('payment_c', params);
      
      if (!response.success) {
        return [];
      }

return response.data.map(payment => ({
        Id: payment.Id,
        feeId: payment.fee_id_c,
        amount: payment.amount_c,
        paymentDate: payment.payment_date_c,
        method: payment.method_c,
        reference: payment.reference_c || ''
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
          fee_id_c: parseInt(paymentData.feeId),
          amount_c: parseFloat(paymentData.amount),
          payment_date_c: paymentData.paymentDate || new Date().toISOString().split("T")[0],
          method_c: paymentData.method,
          reference_c: paymentData.reference || ''
        }]
      };

      const response = await apperClient.createRecord('payment_c', params);
      
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
            feeId: result.data.fee_id_c,
            amount: result.data.amount_c,
            paymentDate: result.data.payment_date_c,
            method: result.data.method_c,
            reference: result.data.reference_c
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

if (paymentData.feeId !== undefined) updateFields.fee_id_c = parseInt(paymentData.feeId);
      if (paymentData.amount !== undefined) updateFields.amount_c = parseFloat(paymentData.amount);
      if (paymentData.paymentDate !== undefined) updateFields.payment_date_c = paymentData.paymentDate;
      if (paymentData.method !== undefined) updateFields.method_c = paymentData.method;
      if (paymentData.reference !== undefined) updateFields.reference_c = paymentData.reference;

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('payment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
return {
            Id: result.data.Id,
            feeId: result.data.fee_id_c,
            amount: result.data.amount_c,
            paymentDate: result.data.payment_date_c,
            method: result.data.method_c,
            reference: result.data.reference_c
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

const response = await apperClient.deleteRecord('payment_c', params);
      
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