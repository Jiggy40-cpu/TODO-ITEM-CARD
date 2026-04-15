# Todo Card Component - Stage 1

A clean, modern, and fully accessible Todo/Task Card component built with semantic HTML, CSS, and vanilla JavaScript.

## Features

- **Fully Testable** - All elements have exact `data-testid` attributes for automated testing
- **Accessible** - WCAG AA compliant with full keyboard navigation and screen reader support
- **Responsive** - Works seamlessly from 320px to 1200px+ screen widths
- **Modern Design** - Clean UI with smooth animations and visual feedback
- **Dynamic Time Calculation** - Real-time "time remaining" updates (30-60 second intervals)
- **Editable Content** - Full edit mode with form validation
- **Status Management** - Toggle between Pending, In Progress, and Done states
- **Priority Indicators** - Visual styling for Low, Medium, and High priority levels
- **Expand/Collapse** - Collapsible descriptions for long content
- **Overdue Detection** - Visual indicators when tasks are overdue
- **Tags Support** - Categorize tasks with customizable tags
- **Interactive Controls** - Checkbox toggle, status control, edit, and delete functionality

## What Changed from Stage 0

### New Elements Added
- **Edit Form** - Modal with title, description, priority, and due date fields
- **Status Control Dropdown** - Switch between Pending, In Progress, Done
- **Priority Indicator** - Enhanced visual styling for priority levels
- **Expand/Collapse Toggle** - Collapsible description section
- **Overdue Indicator** - Red visual indicator for overdue tasks

### Enhanced Behavior
- Time updates every 30-60 seconds (improved granularity)
- Status synchronization between checkbox, dropdown, and display
- "Done" status freezes time display and shows "Completed"
- Edit mode preserves and restores state on cancel
- Focus management and keyboard trapping in forms

## Data-testid Elements

| Element | data-testid | Purpose |
|---------|------------|---------|
| Card container | `test-todo-card` | Root article element |
| Task title | `test-todo-title` | h2/h3 heading |
| Description | `test-todo-description` | Task details paragraph |
| Priority badge | `test-todo-priority` | Priority display |
| Priority indicator | `test-todo-priority-indicator` | Colored/styled priority indicator |
| Due date | `test-todo-due-date` | Formatted deadline |
| Time remaining | `test-todo-time-remaining` | Friendly time text |
| Overdue indicator | `test-todo-overdue-indicator` | Overdue status visual |
| Status display | `test-todo-status` | Status badge |
| Status control | `test-todo-status-control` | Status dropdown/selector |
| Completion toggle | `test-todo-complete-toggle` | Checkbox input |
| Expand toggle | `test-todo-expand-toggle` | Expand/collapse button |
| Collapsible section | `test-todo-collapsible-section` | Expandable content area |
| Edit form | `test-todo-edit-form` | Edit form container |
| Edit title input | `test-todo-edit-title-input` | Title input field |
| Edit description input | `test-todo-edit-description-input` | Description textarea |
| Edit priority select | `test-todo-edit-priority-select` | Priority dropdown |
| Edit due date input | `test-todo-edit-due-date-input` | Due date input |
| Save button | `test-todo-save-button` | Save changes button |
| Cancel button | `test-todo-cancel-button` | Cancel edit button |
| Tags container | `test-todo-tags` | List of tag pills |
| Tag: work | `test-todo-tag-work` | Work category tag |
| Tag: urgent | `test-todo-tag-urgent` | Urgent category tag |
| Edit button | `test-todo-edit-button` | Edit action button |
| Delete button | `test-todo-delete-button` | Delete action button |


## Design System

### Colors
- Primary: `#667eea` (Purple Blue)
- Secondary: `#764ba2` (Deep Purple)
- Success: Green (`#006600`)
- Warning: Amber (`#b8860b`)
- Error: Red (`#c00`)
- Overdue: Red (`#c00`)

### Typography
- Font Family: System fonts (SF Pro Display, Segoe UI, Roboto)
- Title: 1.5rem, weight 600
- Body: 0.95rem, line-height 1.5
- Small: 0.85rem for badges

### Spacing
- Card Padding: 1.5rem (2rem on desktop)
- Gap Between Elements: 0.75rem - 1.25rem
- Border Radius: 12px (main), 20px (badges), 16px (tags)

## Accessibility Features

- **Semantic HTML** - Uses `<article>`, `<time>`, `<button>`, `<input>`, `<label>`
- **ARIA Labels** - Descriptive labels for all interactive elements
- **Form Labels** - All form inputs have associated `<label for="">` elements
- **Keyboard Navigation** - Full tab order: Checkbox → Status control → Expand toggle → Edit → Delete → (Save/Cancel in edit mode)
- **Focus Styles** - 3px outline with 2px offset on all interactive elements
- **Focus Management** - Focus trap in edit modal, returns to edit button on close
- **Color Contrast** - WCAG AA compliant (4.5:1 minimum)
- **Live Regions** - Time remaining uses `aria-live="polite"` for updates
- **ARIA Attributes** - Expand toggle uses `aria-expanded` and `aria-controls`
- **Reduced Motion** - Respects `prefers-reduced-motion` media query

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|-----------|-------|---------|
| Mobile | < 480px | Stacked layout, reduced padding, single-column form |
| Small Mobile | 320px | Minimum font sizes, adjusted spacing |
| Tablet | 480px - 768px | Normal card layout |
| Desktop | > 768px | Max-width 500px, optimal spacing, horizontal form alignment |

## Functionality

### Dynamic Time Remaining
- Calculates time until due date (April 18, 2026, 6:00 PM UTC by default)
- Updates every 30-60 seconds
- Shows granular time:
  - "Due now!" (< 1 minute)
  - "Due in X minutes" (< 1 hour)
  - "Due in X hours" (< 1 day)
  - "Due today"
  - "Due tomorrow"
  - "Due in X days"
  - "Overdue by X hours/days"
- When status is "Done": Display changes to "Completed" and time updates stop

### Checkbox Interaction
- Toggles task completion status
- Synchronizes with status control dropdown
- Updates title styling (strike-through when done)
- Changes visual appearance (muted colors when done)
- Updates status badge to "Done"

### Status Control
- Three states: "Pending", "In Progress", "Done"
- Synchronizes with checkbox state
- Visual styling changes per status
- Dropdown is accessible with proper ARIA labels

### Edit Mode
- Click Edit to open modal form
- Edit fields: Title, Description, Priority, Due Date
- Save button validates and updates card
- Cancel button closes without changes
- Modal has focus trap and returns focus to Edit button
- Form provides validation feedback

### Priority Indicator
- Three levels: Low (Blue), Medium (Amber), High (Red)
- Visual indicator with colored background/border
- Changes reflected in status badge
- Editable via priority select in edit form

### Expand/Collapse
- Description collapses if content exceeds ~150 characters
- Toggle button shows/hides full content
- Accessible with `aria-expanded` and `aria-controls`
- Keyboard accessible

### Overdue Detection
- Shows red visual indicator when task is overdue
- Displays "Overdue by X" in time remaining
- Visual change in card styling

## Getting Started

### 1. Local Development
Open `index.html` in your browser or use a local server:
```bash
python -m http.server 8000
# or
npx http-server

npm install -g vercel
vercel

