# Device Magic Clone - Development Plan

This document outlines the step-by-step process to build a Device Magic clone using the NextJS PWA template. Each step includes specific instructions and prompts that can be followed by an AI assistant or junior developer.

## Step 1: Initial Setup and Configuration

### 1.1 Save and Configure Logo Assets
```
Save the ISW logo files to the public/icons directory. Update the favicon.ico file as well.
Create versions of the logo in the following sizes: 192x192, 512x512, and maskable icon versions.
Make sure image files use transparent backgrounds and are in PNG format.
```

### 1.2 Update PWA Configuration
```
Modify the manifest.json file in the public directory to:
- Update name and short_name to "ISW Forms" or your preferred application name
- Update theme_color and background_color to match the ISW brand colors
- Update the icons array to reference your new logo files
- Ensure the correct scope and start_url values
```

### 1.3 Configure Color Scheme
```
Update the tailwind.config.ts file:
- Identify the primary brand color from the ISW logo
- Add this color and complementary colors to the theme.extend.colors section
- Update the daisyUI theme configuration to use these colors
```

### 1.4 Configure Basic App Information
```
Update the meta.tsx component to:
- Change the title and description to match the new application
- Update any Open Graph and social media meta tags
- Update the _app.tsx and _document.tsx files as needed
```

## Step 2: Core Database & Models

### 2.1 Design Form Template Data Model
```
Create a new file db/types/formTemplate.tsx with the following interface:
- Define an IFormTemplate interface with fields for:
  * id (unique identifier)
  * name (template name)
  * description
  * createdAt (date)
  * updatedAt (date)
  * fields (array of form field definitions)
  * settings (object for form-wide settings)
```

### 2.2 Design Form Field Models
```
Create a db/types/formField.tsx file with interfaces for:
- Define a base IFormField interface with common properties:
  * id
  * type (text, number, select, etc.)
  * label
  * required (boolean)
  * order (number for sorting)
  * helpText
- Extend for specific field types (ITextFormField, ISelectFormField, etc.)
```

### 2.3 Design Form Response Data Model
```
Create a db/types/formResponse.tsx file:
- Define an IFormResponse interface with:
  * id
  * formTemplateId
  * submittedAt
  * updatedAt
  * data (object storing responses)
  * status (draft, submitted, error)
  * offlineCreated (boolean)
```

### 2.4 Configure IndexedDB Schema
```
Update the db/database.config.ts file to:
- Add tables for formTemplates and formResponses
- Update the database version number
- Define appropriate indexes for efficient queries
```

### 2.5 Create Database Access Methods
```
Create utility files in lib/ directory:
- formTemplates.ts for template CRUD operations
- formResponses.ts for response CRUD operations
- Include functions for:
  * Creating new items
  * Retrieving items (individual and lists)
  * Updating items
  * Deleting items
  * Syncing with server (future implementation)
```

## Step 3: Admin Form Builder Interface

### 3.1 Create Form Builder Page Layout
```
Create a new file pages/admin/form-builder/index.tsx:
- Implement a list view of existing form templates
- Add a "Create New Form" button
- Include search/filter functionality
```

### 3.2 Create Form Builder Editor
```
Create a new file pages/admin/form-builder/[id].tsx:
- Implement a two-panel layout:
  * Left side: Field palette with draggable components
  * Right side: Form preview
- Add form properties editor (name, description, settings)
- Include save/publish functionality
```

### 3.3 Implement Form Field Components
```
Create components for each form field type in components/form-builder/:
- TextFieldEditor.tsx
- NumberFieldEditor.tsx
- SelectFieldEditor.tsx
- CheckboxFieldEditor.tsx
- DateFieldEditor.tsx
- FileUploadFieldEditor.tsx
- Each component should allow configuration of its specific properties
```

### 3.4 Implement Drag and Drop Functionality
```
Add drag and drop capabilities to the form builder:
- Use a library like react-dnd or implement custom drag and drop
- Allow reordering of fields
- Enable drag from palette to form
- Include delete and duplicate actions
```

### 3.5 Implement Form Settings
```
Create a form settings panel:
- General settings (name, description)
- Appearance settings
- Submission settings
- Add validation rules configuration
```

## Step 4: Form Viewer/Responder Interface

### 4.1 Create Form Listing Page
```
Create a new file pages/forms/index.tsx:
- List all available forms
- Include status indicators (new, in progress, submitted)
- Add search and filter capabilities
```

### 4.2 Create Form Viewer Component
```
Create a form viewer component in components/forms/FormViewer.tsx:
- Render a form based on its template definition
- Dynamically create form fields based on field types
- Handle form state management
- Implement validation based on field settings
```

### 4.3 Implement Form Field Input Components
```
Create input components for each field type in components/forms/fields/:
- TextInput.tsx
- NumberInput.tsx
- SelectInput.tsx
- CheckboxInput.tsx
- DateInput.tsx
- FileUploadInput.tsx
- Each component should handle its own validation and state
```

### 4.4 Create Form Response Page
```
Create a new file pages/forms/[id].tsx:
- Fetch the form template
- Render the form using the FormViewer component
- Handle form submission
- Implement progress saving (auto-save drafts)
- Add submission confirmation
```

### 4.5 Implement Offline Submission
```
Modify the form submission logic to:
- Store submissions locally when offline
- Queue for syncing when back online
- Show appropriate offline indicators
```

## Step 5: PWA Enhancements

### 5.1 Configure Service Worker
```
Update the service worker configuration:
- Ensure critical assets are pre-cached
- Implement caching strategies for form templates and submissions
- Add background sync registration for offline submissions
```

### 5.2 Implement Background Sync
```
Add background sync functionality:
- Register a sync event for pending submissions
- Implement sync logic to submit when online
- Add notifications for successful submissions
```

### 5.3 Enhance Offline Support
```
Improve offline user experience:
- Add offline indicators
- Implement app shell architecture
- Ensure all critical pages work without network
- Cache previously viewed forms
```

### 5.4 Add PWA Installation Experience
```
Enhance PWA installation:
- Create a custom install prompt
- Add "Add to Home Screen" guidance
- Implement a first-run experience
- Test installation flow on various devices
```

## Step 6: UI/UX Development

### 6.1 Implement Brand Styling
```
Apply ISW branding throughout the application:
- Use the color palette from Step 1
- Apply consistent typography
- Add logo to header/navigation
- Create branded loading states
```

### 6.2 Design Responsive Layouts
```
Ensure responsive design:
- Test and optimize for mobile, tablet, and desktop
- Implement responsive form layouts
- Use media queries for different screen sizes
- Test navigation on small screens
```

### 6.3 Enhance Navigation and User Flows
```
Improve application navigation:
- Create intuitive navigation between forms and admin
- Add breadcrumbs for deep pages
- Implement progress indicators for multi-step forms
- Design clear call-to-action buttons
```

### 6.4 Add Form Management Features
```
Implement additional form management:
- Duplicate form templates
- Archive/delete templates
- Import/export templates
- Add form usage statistics
```

## Step 7: Testing and Quality Assurance

### 7.1 Local Development Setup
```
Configure local development environment:
- Set up environment variables
- Create test data
- Document local setup process
```

### 7.2 Form Builder Testing
```
Test form builder functionality:
- Create forms with each field type
- Test validation rule configuration
- Verify form settings are applied correctly
- Test form template CRUD operations
```

### 7.3 Form Submission Testing
```
Test form submission process:
- Complete and submit forms
- Test validation during submission
- Verify data is correctly stored
- Test draft saving and resuming
```

### 7.4 Offline Functionality Testing
```
Verify offline capabilities:
- Test form access while offline
- Submit forms while offline
- Verify sync when connection returns
- Test installation and offline startup
```

### 7.5 Cross-device Testing
```
Test on multiple devices and browsers:
- Test on iOS and Android devices
- Verify desktop experience
- Check different browsers
- Test PWA installation on each platform
```

## Next Steps (Future Implementation)

### Authentication
```
Implement user authentication:
- Set up Amazon Cognito integration
- Create login/registration flow
- Implement secure routes
- Add user profile management
```

### User Roles and Permissions
```
Add role-based access control:
- Define roles (admin, form creator, form submitter)
- Implement permission checks
- Create user management interface
- Add team/organization features
```

### Cloud Storage and Sync
```
Implement cloud storage:
- Set up AWS backend services
- Create sync mechanism for forms and responses
- Implement conflict resolution
- Add data export capabilities
```

### AWS Deployment
```
Configure AWS infrastructure:
- Set up AWS Amplify or similar service
- Configure CI/CD pipeline
- Implement environment-specific configurations
- Set up monitoring and alerts
```

### Analytics and Reporting
```
Add reporting features:
- Create dashboard for form submissions
- Implement export to CSV/Excel
- Add visualization of form data
- Create custom reports
```

### Workflows and Automation
```
Implement form workflows:
- Add conditional logic between form fields
- Create multi-stage form processes
- Implement approval workflows
- Add automated actions based on submissions
```

### Notifications
```
Add notification system:
- Implement email notifications
- Add in-app notifications
- Create reminder system
- Set up alerts for form completions
``` 