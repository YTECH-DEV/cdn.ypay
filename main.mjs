const Lang = {
    current: "en",
    setLang: (t) => {
      Lang.current = t;
    },
    t: (t) => Lang[Lang.current][t] || t,
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
  },
  t = (t) => Lang.t(t);
class YpayPayment {
  constructor(t) {
    (this.config = { apiUrl: t.apiUrl, amount: t.amount, token: t.token }),
      (this.paymentHandlers = {
        onSuccess: t.onSuccess || (() => {}),
        onFailure: t.onFailure || (() => {}),
      });
  }
  async processPayment(t) {
    const e = {
        amount: this.config.amount,
        token: this.config.token,
        card_code: t.card_code,
        otp: t.otp,
      },
      n = this._validatePaymentData(e);
    if (!n.valid) throw new Error(n.message);
    try {
      const t = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Acept-Language": "en",
          },
          body: JSON.stringify(e),
        }),
        n = await t.json();
      if (t.ok) return this.paymentHandlers.onSuccess(n), n;
      throw n;
    } catch (t) {
      throw (this.paymentHandlers.onFailure(t), t);
    }
  }
  _validatePaymentData(t) {
    return !t.amount || isNaN(t.amount) || t.amount <= 0
      ? { valid: !1, message: "Invalid amount" }
      : { valid: !0 };
  }
}
class YpayPaymentUI {
  store = {
    card: "",
    otp: "",
    setCard: (t) => {
      this.store.card = t;
    },
    setOtp: (t) => {
      this.store.otp = t;
    },
    isValid: () =>
      this.store.card && this.store.otp && 4 === this.store.otp.length,
  };
  constructor(t) {
    (this.containerId = t.containerId),
      (this.motif = t.motif),
      (this.amount = t.amount),
      (this.options = t);
  }
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      const t = document.getElementById(this.containerId);
      if (!t)
        return void console.error(
          `Container with id "${this.containerId}" not found`
        );
      const e = document.createElement("div");
      e.classList.add("contenair"),
        e.appendChild(this._createHeader()),
        e.appendChild(this._createCardInput()),
        e.appendChild(this._createOtpContainer()),
        e.appendChild(this._createSubmitButton()),
        e.appendChild(this._createDivider()),
        e.appendChild(this._createAccountButton()),
        t.replaceChildren(e);
    });
  }
  _createHeader() {
    const e = document.createElement("div");
    return (
      e.classList.add("w-full", "header-container"),
      (e.innerHTML = `\n      <img class="logo" src="logo.svg" height="40" />\n      <div class="header">\n        <div class="text-gray">${
        this.motif
      }</div>\n        <h2 class="amount">${new Intl.NumberFormat().format(
        this.amount
      )} F</h2>\n      </div>\n      <div class="w-full">\n        <h2>${t(
        "header_title"
      )}</h2>\n        <p class="text-gray">${t(
        "header_title_description"
      )}</p>\n      </div>\n    `),
      e
    );
  }
  _createCardInput() {
    const e = document.createElement("div");
    e.classList.add("card", "w-full");
    const n = document.createElement("label");
    n.setAttribute("for", "card"), (n.textContent = t("card"));
    const a = document.createElement("div");
    a.classList.add("card-input");
    const r = document.createElement("div");
    r.innerHTML =
      '\n      <svg\n        xmlns="http://www.w3.org/2000/svg"\n        width="24"\n        height="24"\n        viewBox="0 0 24 24"\n        fill="none"\n        stroke="currentColor"\n        stroke-width="2"\n        stroke-linecap="round"\n        stroke-linejoin="round"\n        class="lucide lucide-credit-card-icon lucide-credit-card"\n      >\n        <rect width="20" height="14" x="2" y="5" rx="2" />\n        <line x1="2" x2="22" y1="10" y2="10" />\n      </svg>\n    ';
    const o = document.createElement("input");
    return (
      (o.type = "text"),
      (o.id = "card"),
      o.classList.add("input"),
      (o.placeholder = t("card_placeholder")),
      o.addEventListener("input", (t) => {
        this.store.setCard(t.target.value);
      }),
      a.appendChild(r),
      a.appendChild(o),
      e.appendChild(n),
      e.appendChild(a),
      e
    );
  }
  _createOtpInput(t = 4) {
    const e = [];
    let n = Array(t).fill("");
    const a = document.createElement("div");
    a.classList.add("otp-input");
    for (let r = 0; r < t; r++) {
      const o = document.createElement("input");
      (o.type = "text"),
        (o.maxLength = "1"),
        o.classList.add("otp-input"),
        o.addEventListener("input", (a) => {
          const s = a.target.value;
          isNaN(s)
            ? (o.value = n[r])
            : ((n[r] = s),
              s && r < t - 1 && e[r + 1] && e[r + 1].focus(),
              n.every((t) => "" !== t) && this.store.setOtp(n.join("")));
        }),
        o.addEventListener("keydown", (t) => {
          "Backspace" === t.key &&
            (!n[r] && r > 0 && e[r - 1] && e[r - 1].focus(),
            (n[r] = ""),
            (e[r].value = ""));
        }),
        o.addEventListener("focus", () => {
          e[r].select();
        }),
        e.push(o),
        a.appendChild(o);
    }
    return a;
  }
  _createOtpContainer() {
    const e = document.createElement("div");
    e.classList.add("otp-container", "w-full");
    const n = document.createElement("label");
    n.textContent = t("otp");
    const a = document.createElement("p");
    return (
      a.classList.add("text-gray", "text-sm"),
      (a.textContent = t("otp_description")),
      e.appendChild(n),
      e.appendChild(this._createOtpInput()),
      e.appendChild(a),
      e
    );
  }
  _showError(t) {
    const e = document.createElement("div");
    e.classList.add("error-message"), (e.textContent = t);
    const n = document.querySelector(`#${this.containerId} .card`);
    this._removeError(), n.appendChild(e);
  }
  _removeError() {
    const t = document.querySelector(`#${this.containerId} .error-message`);
    t && t.remove();
  }
  async _onSubmit(e) {
    const n = this.store.card,
      a = this.store.otp;
    if (this.store.isValid()) {
      this._removeError(),
        (e.disabled = !0),
        (e.textContent = t("btn_proccessing"));
      try {
        const t = new YpayPayment(this.options);
        await t.processPayment({ card_code: n, otp: a });
      } catch (e) {
        this._showError(e.message || t("error_message"));
      } finally {
        (e.disabled = !1), (e.textContent = t("btn_pay_now"));
      }
    } else this._showError(t("error_message"));
  }
  _createSubmitButton() {
    const e = document.createElement("button");
    return (
      e.classList.add("btn", "btn-primary"),
      (e.textContent = t("btn_pay_now")),
      e.addEventListener("click", () => {
        this._onSubmit(e);
      }),
      e
    );
  }
  _createDivider() {
    const e = document.createElement("div");
    return e.classList.add("divider"), (e.textContent = t("or")), e;
  }
  _createAccountButton() {
    const e = document.createElement("button");
    return (
      e.classList.add("btn", "btn-secondary", "account-btn"),
      (e.textContent = t("create_account")),
      e.addEventListener("click", () => {
        console.log("Create account clicked");
      }),
      e
    );
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
    Lang.setLang(this.config.lang), new YpayPaymentUI(this.config).init();
  }
  setConfig(t) {
    (this.config = { ...this.config, ...t }), this._render();
  }
})();
export default YPay;
