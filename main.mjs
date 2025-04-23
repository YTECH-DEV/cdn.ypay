const Lang = {
    current: "en",
    setLang: (n) => {
      Lang.current = n;
    },
    t: (n) => Lang[Lang.current][n] || n,
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
  t = (n) => Lang.t(n);
class YpayPayment {
  constructor(n) {
    (this.config = { apiUrl: n.apiUrl, amount: n.amount, token: n.token }),
      (this.paymentHandlers = {
        onSuccess: n.onSuccess || (() => {}),
        onFailure: n.onFailure || (() => {}),
      });
  }
  async processPayment(n) {
    const t = {
        amount: this.config.amount,
        token: this.config.token,
        card_code: n.card_code,
        otp: n.otp,
      },
      e = this._validatePaymentData(t);
    if (!e.valid) throw new Error(e.message);
    try {
      const n = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Acept-Language": "en",
          },
          body: JSON.stringify(t),
        }),
        e = await n.json();
      if (n.ok) return this.paymentHandlers.onSuccess(e), e;
      throw e;
    } catch (n) {
      throw (this.paymentHandlers.onFailure(n), n);
    }
  }
  _validatePaymentData(n) {
    return !n.amount || isNaN(n.amount) || n.amount <= 0
      ? { valid: !1, message: "Invalid amount" }
      : { valid: !0 };
  }
}
class YpayPaymentUI {
  store = {
    card: "",
    otp: "",
    setCard: (n) => {
      this.store.card = n;
    },
    setOtp: (n) => {
      this.store.otp = n;
    },
    isValid: () =>
      this.store.card && this.store.otp && 4 === this.store.otp.length,
  };
  constructor(n) {
    (this.containerId = n.containerId),
      (this.motif = n.motif),
      (this.amount = n.amount),
      (this.options = n);
  }
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      const n = document.getElementById(this.containerId);
      if (!n)
        return void console.error(
          `Container with id "${this.containerId}" not found`
        );
      const t = document.createElement("div");
      t.classList.add("contenair"),
        t.appendChild(this._createHeader()),
        t.appendChild(this._createCardInput()),
        t.appendChild(this._createOtpContainer()),
        t.appendChild(this._createSubmitButton()),
        t.appendChild(this._createDivider()),
        t.appendChild(this._createAccountButton()),
        n.replaceChildren(t);
      const e = document.createElement("style");
      e.setAttribute("id", "ypay-style"),
        (e.innerHTML =
          '\n        .* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:root {\n  --color-primary: #6047ff;\n  --text-black: #222222;\n  --text-gray: #909090;\n  --border-color: #e9e9e9;\n  --padding: 0.6rem;\n\n  --border: 1.5px solid var(--border-color);\n  --border-radius: 0.5rem;\n}\n\nbody {\n  font-family: "Apple SD", "Segoe UI", sans-serif;\n  color: var(--text-black);\n  font-size: medium;\n  background-color: #f7fbff;\n}\n\nmain {\n  width: 100%;\n  max-width: 350px;\n  margin: 0 auto;\n}\n\n.contenair,\n.header-container {\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n  align-items: center;\n}\n\n.contenair {\n  padding: 2rem 0;\n}\n\n.contenair .header {\n  text-align: center;\n}\n\ninput {\n  width: 100%;\n  padding: var(--padding);\n  border-radius: var(--border-radius);\n  border: var(--border);\n  font-size: 1rem;\n  transition: all 0.3s ease;\n  outline-color: var(--color-primary);\n}\n\n.btn {\n  width: 100%;\n  padding: var(--padding);\n  border-radius: var(--border-radius);\n  border: none;\n  cursor: pointer;\n  color: white;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n}\n\n.btn-primary {\n  width: 100%;\n  padding: var(--padding);\n  border-radius: var(--border-radius);\n  border: none;\n  background-color: var(--color-primary);\n  cursor: pointer;\n  color: white;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n}\n\n.btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-primary:hover {\n  background-color: #1b0eab;\n}\n\n.w-full {\n  width: 100%;\n}\n\n.btn-secondary {\n  background-color: white;\n  border: var(--border);\n  color: var(--text-black);\n}\n\n.btn-secondary:hover {\n  background-color: var(--border-color);\n}\n\n.otp-container {\n  display: flex;\n  flex-direction: column;\n  gap: 0.8rem;\n}\n\n.otp-input {\n  display: flex;\n  gap: 0.5rem;\n}\n\n.otp-input {\n  width: 20px;\n  text-align: center;\n  font-size: 1rem;\n}\n\n.text-gray {\n  color: var(--text-gray);\n}\n\n.text-sm {\n  font-size: 0.8rem;\n}\n\n.card-input {\n  position: relative;\n}\n\n.card-input svg {\n  position: absolute;\n  top: 50%;\n  left: 24px;\n  transform: translate(-50%, -50%);\n  color: var(--text-gray);\n}\n\n.card-input input {\n  padding-left: 48px;\n}\n\n.card label {\n  display: block;\n  padding-bottom: 0.6rem;\n}\n\n.card .error-message {\n  color: red;\n  font-size: 0.8rem;\n  padding-top: 0.4rem;\n}\n'),
        document.getElementById("ypay-style") || document.head.append(e);
    });
  }
  _createHeader() {
    const n = document.createElement("div");
    return (
      n.classList.add("w-full", "header-container"),
      (n.innerHTML = `\n      <img class="logo" src="logo.svg" height="40" />\n      <div class="header">\n        <div class="text-gray">${
        this.motif
      }</div>\n        <h2 class="amount">${new Intl.NumberFormat().format(
        this.amount
      )} F</h2>\n      </div>\n      <div class="w-full">\n        <h2>${t(
        "header_title"
      )}</h2>\n        <p class="text-gray">${t(
        "header_title_description"
      )}</p>\n      </div>\n    `),
      n
    );
  }
  _createCardInput() {
    const n = document.createElement("div");
    n.classList.add("card", "w-full");
    const e = document.createElement("label");
    e.setAttribute("for", "card"), (e.textContent = t("card"));
    const r = document.createElement("div");
    r.classList.add("card-input");
    const a = document.createElement("div");
    a.innerHTML =
      '\n      <svg\n        xmlns="http://www.w3.org/2000/svg"\n        width="24"\n        height="24"\n        viewBox="0 0 24 24"\n        fill="none"\n        stroke="currentColor"\n        stroke-width="2"\n        stroke-linecap="round"\n        stroke-linejoin="round"\n        class="lucide lucide-credit-card-icon lucide-credit-card"\n      >\n        <rect width="20" height="14" x="2" y="5" rx="2" />\n        <line x1="2" x2="22" y1="10" y2="10" />\n      </svg>\n    ';
    const o = document.createElement("input");
    return (
      (o.type = "text"),
      (o.id = "card"),
      o.classList.add("input"),
      (o.placeholder = t("card_placeholder")),
      o.addEventListener("input", (n) => {
        this.store.setCard(n.target.value);
      }),
      r.appendChild(a),
      r.appendChild(o),
      n.appendChild(e),
      n.appendChild(r),
      n
    );
  }
  _createOtpInput(n = 4) {
    const t = [];
    let e = Array(n).fill("");
    const r = document.createElement("div");
    r.classList.add("otp-input");
    for (let a = 0; a < n; a++) {
      const o = document.createElement("input");
      (o.type = "text"),
        (o.maxLength = "1"),
        o.classList.add("otp-input"),
        o.addEventListener("input", (r) => {
          const i = r.target.value;
          isNaN(i)
            ? (o.value = e[a])
            : ((e[a] = i),
              i && a < n - 1 && t[a + 1] && t[a + 1].focus(),
              e.every((n) => "" !== n) && this.store.setOtp(e.join("")));
        }),
        o.addEventListener("keydown", (n) => {
          "Backspace" === n.key &&
            (!e[a] && a > 0 && t[a - 1] && t[a - 1].focus(),
            (e[a] = ""),
            (t[a].value = ""));
        }),
        o.addEventListener("focus", () => {
          t[a].select();
        }),
        t.push(o),
        r.appendChild(o);
    }
    return r;
  }
  _createOtpContainer() {
    const n = document.createElement("div");
    n.classList.add("otp-container", "w-full");
    const e = document.createElement("label");
    e.textContent = t("otp");
    const r = document.createElement("p");
    return (
      r.classList.add("text-gray", "text-sm"),
      (r.textContent = t("otp_description")),
      n.appendChild(e),
      n.appendChild(this._createOtpInput()),
      n.appendChild(r),
      n
    );
  }
  _showError(n) {
    const t = document.createElement("div");
    t.classList.add("error-message"), (t.textContent = n);
    const e = document.querySelector(`#${this.containerId} .card`);
    this._removeError(), e.appendChild(t);
  }
  _removeError() {
    const n = document.querySelector(`#${this.containerId} .error-message`);
    n && n.remove();
  }
  async _onSubmit(n) {
    const e = this.store.card,
      r = this.store.otp;
    if (this.store.isValid()) {
      this._removeError(),
        (n.disabled = !0),
        (n.textContent = t("btn_proccessing"));
      try {
        const n = new YpayPayment(this.options);
        await n.processPayment({ card_code: e, otp: r });
      } catch (n) {
        this._showError(n.message || t("error_message"));
      } finally {
        (n.disabled = !1), (n.textContent = t("btn_pay_now"));
      }
    } else this._showError(t("error_message"));
  }
  _createSubmitButton() {
    const n = document.createElement("button");
    return (
      n.classList.add("btn", "btn-primary"),
      (n.textContent = t("btn_pay_now")),
      n.addEventListener("click", () => {
        this._onSubmit(n);
      }),
      n
    );
  }
  _createDivider() {
    const n = document.createElement("div");
    return n.classList.add("divider"), (n.textContent = t("or")), n;
  }
  _createAccountButton() {
    const n = document.createElement("button");
    return (
      n.classList.add("btn", "btn-secondary", "account-btn"),
      (n.textContent = t("create_account")),
      n.addEventListener("click", () => {
        console.log("Create account clicked");
      }),
      n
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
  setConfig(n) {
    (this.config = { ...this.config, ...n }), this._render();
  }
})();
export default YPay;
