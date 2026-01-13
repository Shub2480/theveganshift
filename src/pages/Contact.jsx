import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    ChevronRight,
    Home,
    CheckCircle,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react';
import { companyInfo } from '../data/products';
import { isValidEmail, isValidPhone } from '../utils/helpers';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store inquiry in localStorage
        const inquiries = JSON.parse(localStorage.getItem('ss_inquiries') || '[]');
        inquiries.push({
            ...formData,
            id: `INQ-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('ss_inquiries', JSON.stringify(inquiries));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Have questions? We'd love to hear from you.</p>
                </div>
            </div>

            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Contact</span>
                </nav>

                <div className="contact-layout">
                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <p>Fill out the form below and we'll get back to you as soon as possible.</p>

                        {submitted ? (
                            <div className="success-message">
                                <CheckCircle size={48} />
                                <h3>Message Sent!</h3>
                                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            placeholder="Your name"
                                        />
                                        {errors.name && <span className="form-error">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.phone ? 'error' : ''}`}
                                            placeholder="+91 98765 43210"
                                        />
                                        {errors.phone && <span className="form-error">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Email (Optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="order">Order Inquiry</option>
                                            <option value="product">Product Question</option>
                                            <option value="delivery">Delivery Issue</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                                        placeholder="How can we help you?"
                                        rows={5}
                                    />
                                    {errors.message && <span className="form-error">{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-large submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>Sending...</>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <div className="contact-card">
                            <h3>Get in Touch</h3>

                            <div className="contact-items">
                                <a href={`tel:${companyInfo.phone}`} className="contact-item">
                                    <div className="contact-icon">
                                        <Phone size={20} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Call Us</span>
                                        <span className="contact-value">{companyInfo.phone}</span>
                                    </div>
                                </a>

                                <a href={`mailto:${companyInfo.email}`} className="contact-item">
                                    <div className="contact-icon">
                                        <Mail size={20} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Email Us</span>
                                        <span className="contact-value">{companyInfo.email}</span>
                                    </div>
                                </a>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Visit Us</span>
                                        <span className="contact-value">{companyInfo.address}</span>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <Clock size={20} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Business Hours</span>
                                        <span className="contact-value">
                                            Mon-Fri: {companyInfo.businessHours.weekdays}<br />
                                            Sat: {companyInfo.businessHours.saturday}<br />
                                            Sun: {companyInfo.businessHours.sunday}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="social-section">
                                <h4>Follow Us</h4>
                                <div className="social-links">
                                    <a
                                        href={companyInfo.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href={companyInfo.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <Instagram size={20} />
                                    </a>
                                    <a
                                        href={companyInfo.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <Twitter size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="map-placeholder">
                            <MapPin size={40} />
                            <span>The Vegan Shift</span>
                            <span className="map-address">Andheri West, Mumbai</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
