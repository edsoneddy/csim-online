import { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  X as XIcon,
} from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { PageHeader, ContactInfoCard, FormField } from '../Common';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      title: 'Email',
      content: 'crew0eddy@gmail.com',
      link: 'mailto:crew0eddy@gmail.com',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      title: 'Phone',
      content: '+591 68013221',
      link: 'tel:+59168013221',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
      title: 'GitHub',
      content: '@edsoneddy',
      link: 'https://github.com/edsoneddy',
    },
    {
      icon: <LinkedInIcon sx={{ fontSize: 32 }} />,
      title: 'LinkedIn',
      content: 'Edson Eddy',
      link: 'https://www.linkedin.com/in/edson-eddy',
    },
    {
      icon: <XIcon sx={{ fontSize: 32 }} />,
      title: 'Twitter',
      content: '@edsoneddy',
      link: 'https://x.com/crew0eddy',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const GOOGLE_FORM_ACTION_URL =
      'https://docs.google.com/forms/u/0/d/1hNXdK5aWqUKOykuIZDy6PRxfxBEqICP-TIC-mmKeQ2U/formResponse';

    const ENTRY_NAME = 'entry.1248530721';
    const ENTRY_EMAIL = 'entry.1035622385';
    const ENTRY_SUBJECT = 'entry.1761524407';
    const ENTRY_MESSAGE = 'entry.355920163';

    const submitData = new FormData();
    submitData.append(ENTRY_NAME, formData.name);
    submitData.append(ENTRY_EMAIL, formData.email);
    submitData.append(ENTRY_SUBJECT, formData.subject);
    submitData.append(ENTRY_MESSAGE, formData.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: submitData,
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <PageHeader
        title="Contact & Feedback"
        subtitle="Have questions, found a bug, or want to suggest a new feature? We'd love to hear from you."
      />

      <Grid container spacing={{ xs: 4, md: 6, lg: 8 }}>
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} info={info} />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              backgroundColor: 'background.paper',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Send us a Message
            </Typography>

            {submitted && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, borderRadius: 2 }}>
                Thank you for your feedback! Your message has been sent successfully.
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flexGrow: 1,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </Grid>
              </Grid>

              <FormField
                label="Subject / Category"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                error={errors.subject}
                placeholder="e.g., Bug Report, Feature Suggestion, Support"
                disabled={loading}
              />

              <FormField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                placeholder="Tell us more about your inquiry or feedback..."
                disabled={loading}
                multiline
                rows={6}
              />

              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  mt: 'auto',
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: 2,
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;
