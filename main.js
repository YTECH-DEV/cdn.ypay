const Lang = {
  current: "en",

  setLang: (lang) => {
    Lang.current = lang;
  },

  t: (key) => {
    return Lang[Lang.current][key] || key;
  },

  en: {
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
      apiUrl: "http://127.0.0.1:8000/api/v1/app/checkout",
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

class AccessibleModal {
  constructor(options = {}) {
    // Default options
    this.options = {
      closeOnEscape: true,
      closeOnOverlayClick: true,
      ariaLabelledBy: "modal-title",
      ariaDescribedBy: "modal-description",
      ...options,
    };

    // Store elements that need to be accessible after closing
    this.previouslyFocusedElement = null;

    // Create modal elements
    this.createModalElements();

    // Initialize event listeners
    this.initEventListeners();
  }

  createModalElements() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "ypay-modal-overlay";
    this.overlay.setAttribute("tabindex", "-1");

    // Create modal container
    this.modal = document.createElement("div");
    this.modal.className = "ypay-modal";
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");

    if (this.options.ariaLabelledBy) {
      this.modal.setAttribute("aria-labelledby", this.options.ariaLabelledBy);
    }

    if (this.options.ariaDescribedBy) {
      this.modal.setAttribute("aria-describedby", this.options.ariaDescribedBy);
    }

    // Create close button
    this.closeButton = document.createElement("button");
    this.closeButton.className = "ypay-modal-close";
    this.closeButton.setAttribute("aria-label", "Close modal");
    this.closeButton.innerHTML = "&times;";

    // Create content container
    this.content = document.createElement("div");
    this.content.setAttribute("id", "ypay-app");

    // Assemble the modal structure
    this.modal.appendChild(this.closeButton);
    this.modal.appendChild(this.content);
    this.overlay.appendChild(this.modal);
  }

  initEventListeners() {
    // Close button event
    this.closeButton.addEventListener("click", () => this.close());

    // Close on ESC key press
    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    }

    // Close on overlay click
    if (this.options.closeOnOverlayClick) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }

    // Trap focus inside modal
    this.modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.handleTabKey(e);
      }
    });
  }

  open(content) {
    // Store the element that had focus before opening modal
    this.previouslyFocusedElement = document.activeElement;

    // Add content to the modal
    if (typeof content === "string") {
      this.content.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.content.innerHTML = "";
      this.content.appendChild(content);
    }

    // Add modal to the DOM
    document.body.appendChild(this.overlay);

    // Add class to prevent body scrolling
    document.body.classList.add("ypay-modal-open");

    // Set focus to the first focusable element
    setTimeout(() => {
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length) {
        focusableElements[0].focus();
      } else {
        this.modal.focus();
      }
    }, 50);

    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;

    // Remove modal from DOM
    document.body.removeChild(this.overlay);

    // Remove class from body
    document.body.classList.remove("ypay-modal-open");

    // Restore focus to the previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }

    this.isOpen = false;
  }

  handleTabKey(e) {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If no focusable elements, do nothing
    if (focusableElements.length === 0) return;

    // Handle Tab key to trap focus inside the modal
    if (e.shiftKey) {
      // If shift+tab and first element is active, move to last element
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // If tab and last element is active, move to first element
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  getFocusableElements() {
    // Select all focusable elements inside the modal
    const focusableSelectors = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    const selector = focusableSelectors.join(",");
    return Array.from(this.modal.querySelectorAll(selector));
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
    this.title = options.title;
    this.amount = options.amount;
    this.options = options;
    this.devise = options.devise || "F";
    this.containerId = "ypay-app";
  }

  content() {
    const container = document.createElement("div");
    container.classList.add("ypay-contenair");

    container.appendChild(this._createHeader());
    container.appendChild(this._createCardInput());
    container.appendChild(this._createOtpContainer());
    container.appendChild(this._createSubmitButton());
    container.appendChild(this._createDivider());
    container.appendChild(this._createAccountButton());

    return container;
  }

  _createHeader() {
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("ypay-w-full", "ypay-header-container");

    headerContainer.innerHTML = `
      <img class="logo" src="logo.svg" height="40" />
      <div class="ypay-header">
        <div class="text-gray title">${this.title}</div>
        <h2 class="amount">${new Intl.NumberFormat().format(this.amount)} ${
      this.devise
    }</h2>
      </div>
    `;

    return headerContainer;
  }

  _createCardInput() {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("ypay-card", "ypay-w-full");

    const label = document.createElement("label");
    label.setAttribute("for", "card");
    label.textContent = t("card");

    const cardInputContainer = document.createElement("div");
    cardInputContainer.classList.add("ypay-card-input");

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
    input.classList.add("ypay-input");
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
    otpContainer.classList.add("ypay-otp");

    for (let i = 0; i < length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = "1";
      input.classList.add("ypay-otp-input");

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
    container.classList.add("ypay-otp-container", "ypay-w-full");

    const label = document.createElement("label");
    label.textContent = t("otp");

    const description = document.createElement("p");
    description.classList.add("ypay-text-gray", "ypay-text-sm");
    description.textContent = t("otp_description");

    container.appendChild(label);
    container.appendChild(this._createOtpInput());
    container.appendChild(description);

    return container;
  }

  _showError(message) {
    const error = document.createElement("div");
    error.classList.add("ypay-error-message");
    error.textContent = message;

    const otpContainer = document.querySelector(
      `#${this.containerId} .ypay-otp-container`
    );
    this._removeError();
    otpContainer.append(error);
  }

  _removeError() {
    const error = document.querySelector(
      `#${this.containerId} .ypay-error-message`
    );
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
    button.classList.add("ypay-btn", "ypay-btn-primary");
    button.textContent = t("btn_pay_now");

    button.addEventListener("click", () => {
      this._onSubmit(button);
    });

    return button;
  }

  _createDivider() {
    const divider = document.createElement("div");
    divider.classList.add("ypay-divider");
    divider.textContent = t("or");
    return divider;
  }

  _createAccountButton() {
    const button = document.createElement("button");
    button.classList.add("ypay-btn", "ypay-btn-secondary", "ypay-account-btn");
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
    amount: 0,
    token: null,
    title: "",
    lang: "en",
  };

  constructor() {
    this.paymentUI = new YpayPaymentUI(this.config);
    this.modal = new AccessibleModal({
      closeOnEscape: false,
    });
    this.button = document.getElementById("ypay-button");

    this._init();
  }

  _init() {
    if (!this.button) {
      console.error(`Button with ID "${this.config.buttonId}" not found.`);
      return;
    }

    this.button.addEventListener("click", () => {
      this._open();
    });
  }

  setConfig(options) {
    this.config = { ...this.config, ...options };
    this._update();
  }

  _open() {
    this.modal.open(this.paymentUI.content());
  }

  _update() {
    Lang.setLang(this.config.lang);
    this.paymentUI = new YpayPaymentUI(this.config);
  }
})();

const style = document.createElement("style");
style.textContent = `

`;
document.head.appendChild(style);

export default YPay;

// Example usage
YPay.setConfig({
  title: "Payment for order #12345",
  lang: "fr",
  amount: 500,
  token: "projectn7oowh0ajrikqh7gkizlenemupscgrhzpabkmc14xehd",
  onSuccess: (response) => {
    console.log("Payment successful:", response);
  },
  onFailure: (error) => {
    console.error("Payment failed:", error);
  },
});
