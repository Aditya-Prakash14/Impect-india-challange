// Registration Form JavaScript

// *** COUNTDOWN DATE CONFIGURATION ***
// This should match the date in script.js
const EVENT_START_DATE = "2025-08-25 00:00:00"; // August 25, 2025 at midnight IST

// Supabase configuration (replace with your actual Supabase URL and anon key)
const SUPABASE_URL = 'https://vopdethbacjlqxoawtpv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGRldGhiYWNqbHF4b2F3dHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODc1MzgsImV4cCI6MjA3MTE2MzUzOH0.IQGf2DUx9YNosI-_AAXsQkQN6y6-lKtBmTpNofAEcDI';

// Initialize Supabase client (with fallback for development)
let supabase = null;
try {
    if (window.supabase && SUPABASE_URL !== 'your_supabase_url_here') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (error) {
    console.warn('Supabase not configured or unavailable, using fallback mode');
}

// Form state management
let currentStep = 1;
const totalSteps = 3;

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // Check if registration should be disabled
    if (checkRegistrationDisabled()) {
        showRegistrationDisabledOverlay();
        return;
    }
    
    // Ensure we start on step 1
    currentStep = 1;
    showStep(currentStep);
    updateProgressBar();
    updateStepIndicators();
    
    // Setup button event listeners
    setupButtonEventListeners();
    
    // Make functions globally accessible for debugging
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.validateCurrentStep = validateCurrentStep;
    
    // Focus first input
    setTimeout(() => {
        const firstInput = document.querySelector('.form-step.active input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    console.log('Registration form initialized');
});

// Setup button event listeners
function setupButtonEventListeners() {
    // Handle Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nextStep();
        });
    });
    
    // Handle Previous buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            prevStep();
        });
    });

    // Handle form submission
    const form = document.getElementById('teamRegistrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleFormSubmit(e);
        });
    }
}

// Navigation functions
function nextStep() {
    console.log('nextStep called, current step:', currentStep);
    
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgressBar();
            updateStepIndicators();
            
            // Generate summary on step 3
            if (currentStep === 3) {
                generateSummary();
            }
            
            // Focus first input of new step
            setTimeout(() => {
                const firstInput = document.querySelector('.form-step.active input, .form-step.active select');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
    } else {
        console.log('Validation failed for step', currentStep);
    }
}

function prevStep() {
    console.log('prevStep called, current step:', currentStep);
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
        updateStepIndicators();
        
        // Focus first input of previous step
        setTimeout(() => {
            const firstInput = document.querySelector('.form-step.active input, .form-step.active select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
}

function showStep(step) {
    console.log('Showing step:', step);
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        stepEl.style.display = 'none';
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        currentStepEl.style.display = 'block';
    }
    
    // Update current step display
    const currentStepSpan = document.getElementById('currentStep');
    if (currentStepSpan) {
        currentStepSpan.textContent = step;
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = (currentStep / totalSteps) * 100;
    progressFill.style.width = progressPercent + '%';
}

function updateStepIndicators() {
    const steps = document.querySelectorAll('.register-hero .step');
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation functions
function validateCurrentStep() {
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    
    if (!currentStepEl) {
        console.error('Current step element not found for step:', currentStep);
        return false;
    }
    
    const requiredFields = currentStepEl.querySelectorAll('input[required], select[required]');
    let isValid = true;

    console.log('Validating step', currentStep, 'with', requiredFields.length, 'required fields');

    requiredFields.forEach(field => {
        const value = field.value.trim();

        // Clear previous errors
        clearFieldError(field);

        // Validation logic
        if (!value) {
            showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            showError(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && !isValidIndianPhone(value)) {
            showError(field, 'Please enter a valid Indian phone number (10 digits, starts with 6-9)');
            isValid = false;
        }
    });

    // Additional validation for step 3 (terms agreement)
    if (currentStep === 3) {
        const termsCheckbox = document.getElementById('termsAgreed');
        if (termsCheckbox && !termsCheckbox.checked) {
            showError(termsCheckbox, 'You must agree to the terms and conditions');
            isValid = false;
        }
    }

    console.log('Step validation result:', isValid);
    return isValid;
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.style.borderColor = '#e9ecef';
    field.classList.remove('error');
}

function showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    field.style.borderColor = '#dc3545';
    field.classList.add('error');
    
    // Scroll to first error field
    if (!document.querySelector('.error')) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidIndianPhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Indian mobile numbers: 10 digits, starts with 6-9
    const regex = /^[6-9]\d{9}$/;
    return regex.test(cleanPhone);
}


// Helper function to skip validation for testing (remove in production)
function nextStepNoValidation() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgressBar();
        updateStepIndicators();
        
        if (currentStep === 3) {
            generateSummary();
        }
    }
}

// Summary generation
function generateSummary() {
    const summaryContainer = document.getElementById('teamSummary');
    const formData = new FormData(document.getElementById('teamRegistrationForm'));
    
    let summaryHTML = `
        <div class="team-summary-item">
            <h4>Team Information</h4>
            <p><strong>Team Name:</strong> ${formData.get('teamName')}</p>
            <p><strong>Contact Email:</strong> ${formData.get('teamEmail')}</p>
            <p><strong>Contact Phone:</strong> ${formData.get('teamPhone')}</p>
        </div>
    `;

    // Generate member summaries
    for (let i = 1; i <= 4; i++) {
        const memberName = formData.get(`member${i}Name`);
        const memberEmail = formData.get(`member${i}Email`);
        const memberPhone = formData.get(`member${i}Phone`);
        const memberYear = formData.get(`member${i}Year`);
        const memberCollege = formData.get(`member${i}College`);

        summaryHTML += `
            <div class="team-summary-item">
                <h4>Member ${i}${i === 1 ? ' (Team Leader)' : ''}</h4>
                <p><strong>Name:</strong> ${memberName}</p>
                <p><strong>Email:</strong> ${memberEmail}</p>
                <p><strong>Phone:</strong> ${memberPhone}</p>
                <p><strong>Year:</strong> ${memberYear}</p>
                <p><strong>College:</strong> ${memberCollege}</p>
            </div>
        `;
    }

    summaryContainer.innerHTML = summaryHTML;
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submission triggered');
    
    if (!validateCurrentStep()) {
        console.log('Form validation failed');
        return false;
    }

    submitForm();
    return false;
}

// Submit form function
async function submitForm() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    try {
        const form = document.getElementById('teamRegistrationForm');
        const formData = new FormData(form);
        
        const registrationData = {
            team_name: formData.get('teamName'),
            team_email: formData.get('teamEmail'),
            team_phone: formData.get('teamPhone'),
            created_at: new Date().toISOString(),
            members: []
        };

        // Collect member data
        for (let i = 1; i <= 4; i++) {
            registrationData.members.push({
                name: formData.get(`member${i}Name`),
                email: formData.get(`member${i}Email`),
                phone: formData.get(`member${i}Phone`),
                year: formData.get(`member${i}Year`),
                college: formData.get(`member${i}College`),
                is_leader: i === 1
            });
        }

        console.log('Submitting registration data:', registrationData);

        // Submit to Supabase (or fallback if not configured)
        const result = supabase ? 
            await submitRegistration(registrationData) : 
            await submitRegistrationFallback(registrationData);
        
        if (result.success) {
            showSuccessModal(result.registrationId);
        } else {
            throw new Error(result.error || 'Registration failed');
        }

    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again. Error: ' + error.message);
    } finally {
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    }
}

// Supabase submission function
async function submitRegistration(data) {
    if (!supabase) {
        console.warn('Supabase not configured, using fallback');
        return await submitRegistrationFallback(data);
    }
    
    try {
        // Insert team data
        const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .insert({
                team_name: data.team_name,
                team_email: data.team_email,
                team_phone: data.team_phone,
                created_at: data.created_at
            })
            .select()
            .single();

        if (teamError) {
            throw teamError;
        }

        // Insert member data
        const membersData = data.members.map(member => ({
            ...member,
            team_id: teamData.id
        }));

        const { error: membersError } = await supabase
            .from('team_members')
            .insert(membersData);

        if (membersError) {
            throw membersError;
        }

        return {
            success: true,
            registrationId: `IIC-${teamData.id.toString().padStart(6, '0')}`
        };

    } catch (error) {
        console.error('Supabase error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Fallback submission for development/testing
async function submitRegistrationFallback(data) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock registration ID
    const mockId = `IIC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    // Log the data for development purposes
    console.log('Registration data:', data);
    
    return {
        success: true,
        registrationId: mockId
    };
}

// Modal functions
function showSuccessModal(registrationId) {
    document.getElementById('registrationId').textContent = registrationId;
    document.getElementById('successModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Real-time validation
document.addEventListener('input', function(e) {
    if (e.target.matches('input[required], select[required]')) {
        const errorElement = document.getElementById(e.target.id + 'Error');
        if (errorElement && errorElement.textContent) {
            // Clear error on input
            errorElement.textContent = '';
            e.target.style.borderColor = '#e9ecef';
        }
    }
});

// Prevent form auto-refresh on Enter key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        
        // If we're on a button, trigger its click
        if (e.target.type === 'submit' || e.target.classList.contains('btn-next')) {
            e.target.click();
            return;
        }
        
        // Otherwise, move to next field or next step
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        const inputs = Array.from(currentStepEl.querySelectorAll('input, select'));
        const currentIndex = inputs.indexOf(e.target);
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else if (currentStep < totalSteps) {
            nextStep();
        } else if (currentStep === totalSteps) {
            // On final step, submit the form
            const form = document.getElementById('teamRegistrationForm');
            if (form) {
                handleFormSubmit(e);
            }
        }
    }
});

// Phone number formatting - Indian format
document.addEventListener('input', function(e) {
    if (e.target.type === 'tel') {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        // Format as Indian phone number: XXXXX XXXXX
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d{1,5})/, '$1 $2');
        }
        
        e.target.value = value;
    }
});

// Enhanced error handling for network issues
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    alert('Internet connection lost. Please check your connection and try again.');
});

// Form data persistence (save to localStorage)
function saveFormData() {
    const formData = new FormData(document.getElementById('teamRegistrationForm'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('iic_registration_data', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('iic_registration_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Auto-save form data
document.addEventListener('input', debounce(saveFormData, 1000));

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved data on successful submission
function clearSavedData() {
    localStorage.removeItem('iic_registration_data');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if registration should be disabled
function checkRegistrationDisabled() {
    const eventStarted = localStorage.getItem('impactIndiaEventStarted');
    const eventDate = new Date(EVENT_START_DATE.replace(' ', 'T') + '+05:30');
    const countDownDate = eventDate.getTime();
    const now = new Date().getTime();
    
    console.log('Registration check - Event date:', eventDate, 'Now:', new Date());
    
    return eventStarted === 'true' || now >= countDownDate;
}

// Show registration disabled overlay
function showRegistrationDisabledOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'registration-disabled-overlay';
    overlay.innerHTML = `
        <div class="registration-disabled-content">
            <i class="fas fa-lock"></i>
            <h2>Registration Closed</h2>
            <p>Registration for the Impact India Challenge has been closed as the event has officially started. Problem statements are now live!</p>
            <button class="go-back-btn" onclick="goBackToHome()">
                <i class="fas fa-home"></i> View Problem Statements
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
}

// Go back to home page
function goBackToHome() {
    window.location.href = 'index.html#problems';
}
