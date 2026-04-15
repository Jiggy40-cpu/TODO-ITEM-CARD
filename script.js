/**
 * Todo Card Component - Stage 1
 * Enhanced with inline edit form, status controls, priority indicator,
 * expand/collapse behavior, and improved time management.
 */

/** Maximum description length before the section is collapsed by default. */
const COLLAPSE_THRESHOLD = 150;

/**
 * Default time component appended to date-only strings when constructing a
 * full ISO timestamp for the due date.
 */
const DEFAULT_DUE_TIME = 'T18:00:00Z';

class TodoCard {
  constructor() {
    // Card element
    this.card = document.querySelector('[data-testid="test-todo-card"]');

    // View mode elements
    this.checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
    this.titleEl = document.querySelector('[data-testid="test-todo-title"]');
    this.descriptionEl = document.querySelector('[data-testid="test-todo-description"]');
    this.priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
    this.statusEl = document.querySelector('[data-testid="test-todo-status"]');
    this.dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
    this.timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
    this.overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
    this.priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
    this.statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
    this.editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
    this.deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

    // Expand / collapse elements
    this.expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
    this.collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');

    // Edit form elements
    this.cardView = document.getElementById('card-view');
    this.editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
    this.editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
    this.editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
    this.editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
    this.editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
    this.saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
    this.cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

    // State
    this.dueDate = new Date('2026-04-18' + DEFAULT_DUE_TIME);
    this.currentStatus = 'Pending';
    this.currentPriority = 'High';
    this.isExpanded = false;

    this.init();
  }

  init() {
    this.setupExpandCollapse();
    this.setupEventListeners();
    this.updateTimeRemaining();

    // Update time remaining every 30 seconds
    this.timeInterval = setInterval(() => {
      if (this.currentStatus !== 'Done') {
        this.updateTimeRemaining();
      }
    }, 30000);
  }

  // ---------------------------------------------------------------------------
  // Expand / Collapse
  // ---------------------------------------------------------------------------

  /**
   * Initialise expand/collapse based on description length.
   * Collapses by default when description exceeds COLLAPSE_THRESHOLD characters.
   */
  setupExpandCollapse() {
    const descriptionText = this.descriptionEl ? this.descriptionEl.textContent.trim() : '';

    if (descriptionText.length <= COLLAPSE_THRESHOLD) {
      // Short description – no toggle needed
      if (this.expandToggle) this.expandToggle.hidden = true;
      if (this.collapsibleSection) this.collapsibleSection.classList.remove('collapsed');
      this.isExpanded = true;
    } else {
      // Long description – start collapsed
      this.isExpanded = false;
      if (this.collapsibleSection) this.collapsibleSection.classList.add('collapsed');
      if (this.expandToggle) {
        this.expandToggle.hidden = false;
        this.expandToggle.setAttribute('aria-expanded', 'false');
        this.expandToggle.textContent = 'Show more ▼';
      }
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.collapsibleSection) {
      this.collapsibleSection.classList.toggle('collapsed', !this.isExpanded);
    }
    if (this.expandToggle) {
      this.expandToggle.setAttribute('aria-expanded', String(this.isExpanded));
      this.expandToggle.textContent = this.isExpanded ? 'Show less ▲' : 'Show more ▼';
    }
  }

  // ---------------------------------------------------------------------------
  // Priority Indicator
  // ---------------------------------------------------------------------------

  /**
   * Update the priority indicator element and card data attribute.
   */
  updatePriorityIndicator(priority) {
    if (this.priorityIndicator) {
      this.priorityIndicator.className =
        `priority-indicator priority-indicator--${priority.toLowerCase()}`;
      this.priorityIndicator.setAttribute('aria-label', `Priority: ${priority}`);
    }
    if (this.card) {
      this.card.dataset.priority = priority.toLowerCase();
    }
  }

  // ---------------------------------------------------------------------------
  // Status Management
  // ---------------------------------------------------------------------------

  /**
   * Central method to update all status-related UI in one call.
   */
  setStatus(newStatus) {
    this.currentStatus = newStatus;

    const statusMap = {
      'Pending':     { icon: '⏳', cls: 'status-pending',     label: 'Status: Pending' },
      'In Progress': { icon: '🔄', cls: 'status-in-progress', label: 'Status: In Progress' },
      'Done':        { icon: '✅', cls: 'status-done',         label: 'Status: Done' },
    };
    const config = statusMap[newStatus] || statusMap['Pending'];

    // Status badge
    if (this.statusEl) {
      this.statusEl.textContent = `${config.icon} ${newStatus}`;
      this.statusEl.className = `badge ${config.cls}`;
      this.statusEl.setAttribute('aria-label', config.label);
    }

    // Status dropdown
    if (this.statusControl) {
      this.statusControl.value = newStatus;
    }

    // Checkbox
    if (this.checkbox) {
      this.checkbox.checked = newStatus === 'Done';
    }

    // Card-level visual state
    if (this.card) {
      this.card.dataset.status = newStatus.toLowerCase().replace(' ', '-');
      this.card.classList.toggle('completed', newStatus === 'Done');
      this.card.classList.toggle('in-progress', newStatus === 'In Progress');
    }

    if (newStatus === 'Done') {
      // Stop time updates; replace with "Completed"
      if (this.timeRemainingEl) {
        this.timeRemainingEl.textContent = 'Completed';
        this.timeRemainingEl.setAttribute('aria-label', 'Task completed');
        this.timeRemainingEl.classList.remove('overdue');
        this.timeRemainingEl.classList.add('status-completed');
      }
      if (this.overdueIndicator) {
        this.overdueIndicator.hidden = true;
      }
      if (this.card) {
        this.card.classList.remove('overdue');
      }
    } else {
      // Resume time display
      if (this.timeRemainingEl) {
        this.timeRemainingEl.classList.remove('status-completed');
      }
      this.updateTimeRemaining();
    }
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  setupEventListeners() {
    if (this.checkbox) {
      this.checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
    }
    if (this.statusControl) {
      this.statusControl.addEventListener('change', (e) => this.setStatus(e.target.value));
    }
    if (this.expandToggle) {
      this.expandToggle.addEventListener('click', () => this.toggleExpand());
    }
    if (this.editBtn) {
      this.editBtn.addEventListener('click', () => this.openEditForm());
    }
    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', () => this.saveEditedTask());
    }
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => this.closeEditForm());
    }
    if (this.deleteBtn) {
      this.deleteBtn.addEventListener('click', () => this.handleDelete());
    }
    // Focus trap inside edit form
    if (this.editForm) {
      this.editForm.addEventListener('keydown', (e) => this.handleEditFormKeydown(e));
    }
  }

  handleCheckboxChange(event) {
    if (event.target.checked) {
      this.setStatus('Done');
    } else {
      // Unchecking after Done reverts to Pending
      this.setStatus('Pending');
    }
  }

  // ---------------------------------------------------------------------------
  // Edit Form
  // ---------------------------------------------------------------------------

  openEditForm() {
    // Populate fields with current values
    if (this.editTitleInput) {
      this.editTitleInput.value = this.titleEl ? this.titleEl.textContent.trim() : '';
    }
    if (this.editDescriptionInput) {
      this.editDescriptionInput.value = this.descriptionEl
        ? this.descriptionEl.textContent.trim()
        : '';
    }
    if (this.editPrioritySelect) {
      this.editPrioritySelect.value = this.currentPriority;
    }
    if (this.editDueDateInput) {
      this.editDueDateInput.value = this.dateToInputFormat(this.dueDate);
    }

    // Toggle visibility
    if (this.cardView) this.cardView.hidden = true;
    if (this.editForm) this.editForm.hidden = false;

    // Focus first field for accessibility
    if (this.editTitleInput) {
      this.editTitleInput.focus();
      this.editTitleInput.select();
    }
  }

  closeEditForm() {
    if (this.cardView) this.cardView.hidden = false;
    if (this.editForm) this.editForm.hidden = true;

    // Return focus to Edit button
    if (this.editBtn) this.editBtn.focus();
  }

  /**
   * Focus trap: keep Tab cycling inside the edit form; Escape closes it.
   */
  handleEditFormKeydown(e) {
    if (e.key === 'Escape') {
      this.closeEditForm();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(
        this.editForm.querySelectorAll('input, textarea, select, button')
      ).filter((el) => !el.disabled && !el.hidden);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  saveEditedTask() {
    const newTitle = this.editTitleInput ? this.editTitleInput.value.trim() : '';
    const newDescription = this.editDescriptionInput
      ? this.editDescriptionInput.value.trim()
      : '';
    const newPriority = this.editPrioritySelect ? this.editPrioritySelect.value : 'Medium';
    const newDueDateString = this.editDueDateInput ? this.editDueDateInput.value : '';

    if (!newTitle) {
      alert('❌ Task title cannot be empty!');
      if (this.editTitleInput) this.editTitleInput.focus();
      return;
    }
    if (!newDueDateString) {
      alert('❌ Due date cannot be empty!');
      if (this.editDueDateInput) this.editDueDateInput.focus();
      return;
    }

    const priorityMap = {
      'Low':    { icon: '🔵', cls: 'priority-low' },
      'Medium': { icon: '🟡', cls: 'priority-medium' },
      'High':   { icon: '🔴', cls: 'priority-high' },
    };

    // Update title
    if (this.titleEl) this.titleEl.textContent = newTitle;

    // Update description
    if (this.descriptionEl) this.descriptionEl.textContent = newDescription;

    // Update priority badge
    if (this.priorityEl) {
      const p = priorityMap[newPriority];
      this.priorityEl.textContent = `${p.icon} ${newPriority}`;
      this.priorityEl.className = `badge ${p.cls}`;
      this.priorityEl.setAttribute('aria-label', `Priority: ${newPriority}`);
    }

    // Update priority indicator
    this.currentPriority = newPriority;
    this.updatePriorityIndicator(newPriority);

    // Update due date
    const newDueDate = new Date(newDueDateString + DEFAULT_DUE_TIME);
    this.dueDate = newDueDate;
    if (this.dueDateEl) {
      this.dueDateEl.textContent = this.formatDueDate(newDueDate);
      this.dueDateEl.setAttribute('datetime', newDueDate.toISOString());
    }

    // Re-evaluate expand/collapse for updated description length
    this.setupExpandCollapse();

    // Recalculate time remaining
    this.updateTimeRemaining();

    this.closeEditForm();
  }

  // ---------------------------------------------------------------------------
  // Time Management
  // ---------------------------------------------------------------------------

  /**
   * Calculate and display granular friendly time remaining text.
   */
  updateTimeRemaining() {
    if (this.currentStatus === 'Done') return;

    const now = new Date();
    const timeDiff = this.dueDate - now;
    let timeText = '';
    let isOverdue = false;

    if (timeDiff < 0) {
      isOverdue = true;
      const totalMs = Math.abs(timeDiff);
      const absDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const absHours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const absMins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

      if (absDays > 0) {
        timeText = `Overdue by ${absDays} day${absDays !== 1 ? 's' : ''}`;
      } else if (absHours > 0) {
        timeText = `Overdue by ${absHours} hour${absHours !== 1 ? 's' : ''}`;
      } else if (absMins > 0) {
        timeText = `Overdue by ${absMins} minute${absMins !== 1 ? 's' : ''}`;
      } else {
        timeText = 'Overdue!';
      }
    } else if (timeDiff < 60000) {
      timeText = 'Due now!';
    } else if (timeDiff < 3600000) {
      const mins = Math.floor(timeDiff / (1000 * 60));
      timeText = `Due in ${mins} minute${mins !== 1 ? 's' : ''}`;
    } else if (timeDiff < 86400000) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      timeText = `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if (days === 1) {
        timeText = 'Due tomorrow';
      } else {
        timeText = `Due in ${days} days`;
      }
    }

    if (this.timeRemainingEl) {
      this.timeRemainingEl.textContent = timeText;
      this.timeRemainingEl.setAttribute('aria-label', `Time remaining: ${timeText}`);
      this.timeRemainingEl.classList.toggle('overdue', isOverdue);
    }

    // Show / hide overdue indicator
    if (this.overdueIndicator) {
      this.overdueIndicator.hidden = !isOverdue;
      if (isOverdue) this.overdueIndicator.textContent = '⚠️ Overdue';
    }

    // Card-level overdue styling
    if (this.card) {
      this.card.classList.toggle('overdue', isOverdue);
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  handleDelete() {
    if (confirm('🗑️ Are you sure you want to delete this task?')) {
      this.card.style.opacity = '0';
      this.card.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        this.card.remove();
        clearInterval(this.timeInterval);
      }, 300);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Format date to readable string e.g. "Due Apr 18, 2026"
   */
  formatDueDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `Due ${date.toLocaleDateString('en-US', options)}`;
  }

  /**
   * Convert Date to YYYY-MM-DD for input[type=date]
   */
  dateToInputFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  destroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
  }
}

// Initialise when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.todoCard = new TodoCard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.todoCard) window.todoCard.destroy();
});