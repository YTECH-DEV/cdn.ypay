const Lang = {
  current: "en",

  setLang: (lang) => {
    Lang.current = lang;
  },

  t: (key) => {
    return Lang[Lang.current][key] || key;
  },

  en: {
    header_title: "Pay with Ypay",
    header_title_description: "Follow these steps to secure your payment.",
    card: "Card number",
    card_placeholder: "Enter your card number",
    otp: "Enter OTP",
    otp_description:
      "To get the OTP, connect you to the Ypay application and generate the OTP.",
    btn_pay_now: "Pay now",
    btn_proccessing: "Processing...",
    create_account: "Create account",
    or: "OR",
    error_message: "Please enter a valid card number and OTP.",
  },
  fr: {
    header_title: "Payer avec Ypay",
    header_title_description:
      "Suivez ces étapes pour sécuriser votre paiement.",
    card: "Numéro de carte",
    otp: "Entrez l'OTP",
    card_placeholder: "Entrez votre numéro de carte",
    otp_description:
      "Pour obtenir l’OTP, connectez-vous à l’application Ypay et générez l’OTP.",
    btn_pay_now: "Payer maintenant",
    btn_proccessing: "Traitement...",
    create_account: "Créer un compte",
    or: "OU",
    error_message: "Veuillez entrer un numéro de carte valide et un OTP.",
  },
};

const t = (key) => {
  return Lang.t(key);
};

class YpayPayment {
  constructor(options) {
    this.config = {
      apiUrl: options.apiUrl,
      amount: options.amount,
      token: options.token,
    };

    this.paymentHandlers = {
      onSuccess: options.onSuccess || (() => {}),
      onFailure: options.onFailure || (() => {}),
    };
  }
  async processPayment(paymentData) {
    const data = {
      amount: this.config.amount,
      token: this.config.token,
      card_code: paymentData.card_code,
      otp: paymentData.otp,
    };

    const validation = this._validatePaymentData(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const paymentResponse = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Acept-Language": "en",
        },
        body: JSON.stringify(data),
      });

      const response = await paymentResponse.json();

      if (paymentResponse.ok) {
        this.paymentHandlers.onSuccess(response);
        return response;
      }

      throw response;
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

class YpayPaymentUI {
  store = {
    card: "",
    otp: "",
    setCard: (value) => {
      this.store.card = value;
    },
    setOtp: (value) => {
      this.store.otp = value;
    },
    isValid: () =>
      this.store.card && this.store.otp && this.store.otp.length === 4,
  };

  constructor(options) {
    this.containerId = options.containerId;
    this.motif = options.motif;
    this.amount = options.amount;
    this.options = options;
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      const appContainer = document.getElementById(this.containerId);
      if (!appContainer) {
        console.error(`Container with id "${this.containerId}" not found`);
        return;
      }

      const container = document.createElement("div");
      container.classList.add("contenair");

      container.appendChild(this._createHeader());
      container.appendChild(this._createCardInput());
      container.appendChild(this._createOtpContainer());
      container.appendChild(this._createSubmitButton());
      container.appendChild(this._createDivider());
      container.appendChild(this._createAccountButton());

      appContainer.replaceChildren(container);

      const css = document.createElement("style");
      css.innerHTML = `
        .* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #6047ff;
  --text-black: #222222;
  --text-gray: #909090;
  --border-color: #e9e9e9;
  --padding: 0.6rem;

  --border: 1.5px solid var(--border-color);
  --border-radius: 0.5rem;
}

body {
  font-family: "Apple SD", "Segoe UI", sans-serif;
  color: var(--text-black);
  font-size: medium;
  background-color: #f7fbff;
}

main {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.contenair,
.header-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.contenair {
  padding: 2rem 0;
}

.contenair .header {
  text-align: center;
}

input {
  width: 100%;
  padding: var(--padding);
  border-radius: var(--border-radius);
  border: var(--border);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline-color: var(--color-primary);
}

.btn {
  width: 100%;
  padding: var(--padding);
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  width: 100%;
  padding: var(--padding);
  border-radius: var(--border-radius);
  border: none;
  background-color: var(--color-primary);
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:hover {
  background-color: #1b0eab;
}

.w-full {
  width: 100%;
}

.btn-secondary {
  background-color: white;
  border: var(--border);
  color: var(--text-black);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.otp-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.otp-input {
  display: flex;
  gap: 0.5rem;
}

.otp-input {
  width: 20px;
  text-align: center;
  font-size: 1rem;
}

.text-gray {
  color: var(--text-gray);
}

.text-sm {
  font-size: 0.8rem;
}

.card-input {
  position: relative;
}

.card-input svg {
  position: absolute;
  top: 50%;
  left: 24px;
  transform: translate(-50%, -50%);
  color: var(--text-gray);
}

.card-input input {
  padding-left: 48px;
}

.card label {
  display: block;
  padding-bottom: 0.6rem;
}

.card .error-message {
  color: red;
  font-size: 0.8rem;
  padding-top: 0.4rem;
}
`;
      document.head.appendChild(css);
    });
  }

  _createHeader() {
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("w-full", "header-container");

    headerContainer.innerHTML = `
      <img class="logo" src="logo.svg" height="40" />
      <div class="header">
        <div class="text-gray">${this.motif}</div>
        <h2 class="amount">${new Intl.NumberFormat().format(this.amount)} F</h2>
      </div>
      <div class="w-full">
        <h2>${t("header_title")}</h2>
        <p class="text-gray">${t("header_title_description")}</p>
      </div>
    `;

    return headerContainer;
  }

  _createCardInput() {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card", "w-full");

    const label = document.createElement("label");
    label.setAttribute("for", "card");
    label.textContent = t("card");

    const cardInputContainer = document.createElement("div");
    cardInputContainer.classList.add("card-input");

    const svgContainer = document.createElement("div");
    svgContainer.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-credit-card-icon lucide-credit-card"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    `;

    const input = document.createElement("input");
    input.type = "text";
    input.id = "card";
    input.classList.add("input");
    input.placeholder = t("card_placeholder");

    input.addEventListener("input", (event) => {
      this.store.setCard(event.target.value);
    });

    cardInputContainer.appendChild(svgContainer);
    cardInputContainer.appendChild(input);

    cardContainer.appendChild(label);
    cardContainer.appendChild(cardInputContainer);

    return cardContainer;
  }

  _createOtpInput(length = 4) {
    const inputs = [];
    let otpValue = Array(length).fill("");
    const otpContainer = document.createElement("div");
    otpContainer.classList.add("otp-input");

    for (let i = 0; i < length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = "1";
      input.classList.add("otp-input");

      input.addEventListener("input", (event) => {
        const value = event.target.value;

        if (isNaN(value)) {
          input.value = otpValue[i]; // Revert to previous valid value
          return;
        }

        otpValue[i] = value;

        if (value && i < length - 1 && inputs[i + 1]) {
          inputs[i + 1].focus();
        }

        if (otpValue.every((digit) => digit !== "")) {
          this.store.setOtp(otpValue.join(""));
        }
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
          if (!otpValue[i] && i > 0 && inputs[i - 1]) {
            inputs[i - 1].focus();
          }
          otpValue[i] = "";
          inputs[i].value = "";
        }
      });

      input.addEventListener("focus", () => {
        inputs[i].select();
      });

      inputs.push(input);
      otpContainer.appendChild(input);
    }

    return otpContainer;
  }

  _createOtpContainer() {
    const container = document.createElement("div");
    container.classList.add("otp-container", "w-full");

    const label = document.createElement("label");
    label.textContent = t("otp");

    const description = document.createElement("p");
    description.classList.add("text-gray", "text-sm");
    description.textContent = t("otp_description");

    container.appendChild(label);
    container.appendChild(this._createOtpInput());
    container.appendChild(description);

    return container;
  }

  _showError(message) {
    const error = document.createElement("div");
    error.classList.add("error-message");
    error.textContent = message;

    const cardContainer = document.querySelector(`#${this.containerId} .card`);
    this._removeError();
    cardContainer.appendChild(error);
  }

  _removeError() {
    const error = document.querySelector(`#${this.containerId} .error-message`);
    if (error) {
      error.remove();
    }
  }

  async _onSubmit(button) {
    const card = this.store.card;
    const otp = this.store.otp;

    if (!this.store.isValid()) {
      this._showError(t("error_message"));
      return;
    }

    this._removeError();
    button.disabled = true;
    button.textContent = t("btn_proccessing");
    try {
      const payment = new YpayPayment(this.options);

      await payment.processPayment({
        card_code: card,
        otp: otp,
      });
    } catch (error) {
      this._showError(error.message || t("error_message"));
    } finally {
      button.disabled = false;
      button.textContent = t("btn_pay_now");
    }
  }

  _createSubmitButton() {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.textContent = t("btn_pay_now");

    button.addEventListener("click", () => {
      this._onSubmit(button);
    });

    return button;
  }

  _createDivider() {
    const divider = document.createElement("div");
    divider.classList.add("divider");
    divider.textContent = t("or");
    return divider;
  }

  _createAccountButton() {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-secondary", "account-btn");
    button.textContent = t("create_account");

    button.addEventListener("click", () => {
      // Handle account creation logic here
      console.log("Create account clicked");
    });

    return button;
  }
}

const YPay = new (class {
  config = {
    containerId: "ypay",
    amount: 0,
    token: null,
    motif: "",
    apiUrl: "http://127.0.0.1:8000/api/v1/app/checkout",
    lang: "en",
  };

  constructor() {
    this._render();
  }

  _render() {
    Lang.setLang(this.config.lang);
    new YpayPaymentUI(this.config).init();
  }

  setConfig(options) {
    this.config = { ...this.config, ...options };
    this._render();
  }
})();

export default YPay;

// Example usage
YPay.setConfig({
  lang: "fr",
  motif: "Payment for order #12345",
  amount: 500,
  token: "projectn7oowh0ajrikqh7gkizlenemupscgrhzpabkmc14xehd",
  onSuccess: (response) => {
    console.log("Payment successful:", response);
  },
  onFailure: (error) => {
    console.error("Payment failed:", error);
  },
});
