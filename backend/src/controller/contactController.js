/**
 * Contact Controller
 * Handles contact form submissions
 */

/**
 * Submit contact form
 */
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: "Name, email, and message are required fields" 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "Please provide a valid email address" 
            });
        }

        // For now, we'll just log the contact form data
        // In a real application, you might want to:
        // 1. Save to database
        // 2. Send email notification
        // 3. Integrate with a CRM system
        
        console.log('Contact form submission:', {
            name,
            email,
            phone,
            message,
            timestamp: new Date().toISOString()
        });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.status(200).json({
            message: "Thank you for your message! We'll get back to you soon.",
            success: true
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: "Failed to submit contact form. Please try again later." 
        });
    }
};

/**
 * Get all contact submissions (for admin use)
 */
const getAllContacts = async (req, res) => {
    try {
        // This would typically fetch from database
        // For now, return empty array since we're not storing contacts
        res.status(200).json({
            data: [],
            message: "Contact submissions retrieved successfully"
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ 
            error: "Failed to retrieve contact submissions" 
        });
    }
};

export const contactController = {
    submitContact,
    getAllContacts
};
