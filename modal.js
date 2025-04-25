// Accessible Modal Component
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
    this.overlay.className = "modal-overlay";
    this.overlay.setAttribute("tabindex", "-1");

    // Create modal container
    this.modal = document.createElement("div");
    this.modal.className = "modal";
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
    this.closeButton.className = "modal-close";
    this.closeButton.setAttribute("aria-label", "Close modal");
    this.closeButton.innerHTML = "&times;";

    // Create content container
    this.content = document.createElement("div");
    this.content.className = "modal-content";

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
    document.body.classList.add("modal-open");

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
    document.body.classList.remove("modal-open");

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

// Add CSS for the modal
const style = document.createElement("style");
style.textContent = `

`;
document.head.appendChild(style);

// Initialize the modal
const modal = new AccessibleModal();

const openButton = document.getElementById("ypay-button");

openButton.addEventListener("click", () => {
  // Create content for the modal
  const modalContent = document.createElement("div");

  // Add a heading with the id matching ariaLabelledBy
  const heading = document.createElement("h2");
  heading.id = "modal-title";
  heading.textContent = "Accessible Modal Example";

  // Add a description with the id matching ariaDescribedBy
  const description = document.createElement("p");
  description.id = "modal-description";
  description.textContent = "This is an example of an accessible modal dialog.";

  // Add some interactive elements to test focus management
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type something here";

  const button = document.createElement("button");
  button.textContent = "Submit";

  // Assemble the content
  modalContent.appendChild(heading);
  modalContent.appendChild(description);
  modalContent.appendChild(input);
  modalContent.appendChild(button);

  // Open the modal with the content
  modal.open(modalContent);
});

document.body.appendChild(openButton);

const button = document.createElement("button");
