export class YpayPayment {
  constructor(options) {
    this.config = {
      apiUrl: "http://127.0.0.1:8000/v1/app/checkout",
    };

    this.paymentHandlers = {
      onSuccess: options.onSuccess || (() => {}),
      onFailure: options.onFailure || (() => {}),
    };
  }

  async processPayment(paymentData) {
    const validation = this._validatePaymentData(paymentData);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const paymentResponse = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      this.paymentHandlers.onSuccess(paymentResponse);

      return paymentResponse;
    } catch (error) {
      this.paymentHandlers.onFailure(error);
      throw error;
    }
  }

  _validatePaymentData(data) {
    if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
      return { valid: false, message: "Invalid amount" };
    }
    return { valid: true };
  }
}
