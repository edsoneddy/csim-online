import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import {
  QuestionAnswer as QuestionAnswerIcon,
  LocalLibrary as LocalLibraryIcon,
  VideoLibrary as VideoLibraryIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { PageHeader, QuickLinksGrid, FAQSection, SearchBar, ActionCard } from '../Common';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      category: 'Getting Started',
      icon: <LocalLibraryIcon />,
      questions: [
        {
          q: 'How do I start using the code editor?',
          a: 'To get started, select a programming language from the dropdown menu in the top toolbar. Then you can write your code in the editor. Your code will be automatically saved to local storage.',
        },
        {
          q: 'What programming languages are supported?',
          a: 'We currently support Python, JavaScript, Java, and C++. You can select the language from the selector in the top toolbar.',
        },
      ],
    },
    {
      category: 'Editor Features',
      icon: <CodeIcon />,
      questions: [
        {
          q: 'How do I save my code?',
          a: 'Your code is automatically saved in your browser using local storage. You do not need to do anything special.',
        },
        {
          q: 'Can I clear the editor?',
          a: 'Yes, there is a button in the bottom toolbar that allows you to clear the editor content. Make sure to copy your code if you need it before clearing.',
        },
        {
          q: 'Are there keyboard shortcuts?',
          a: 'Yes, you can use standard shortcuts like Ctrl+Z to undo, Ctrl+Y to redo, and Ctrl+A to select all.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      icon: <BugReportIcon />,
      questions: [
        {
          q: 'My code disappeared. What happened?',
          a: "Code is stored in your browser's local storage. If you cleared your browser storage, the code will be lost. Try restoring from your browser history if possible.",
        },
        {
          q: 'The editor is not responding. What should I do?',
          a: 'Try refreshing the page. If the problem persists, clear local storage in your browser settings and try again.',
        },
        {
          q: 'Can I use this offline?',
          a: 'Yes, the editor will work offline once the page has been loaded.',
        },
      ],
    },
    {
      category: 'Best Practices',
      icon: <VideoLibraryIcon />,
      questions: [
        {
          q: 'What are the best practices for writing clean code?',
          a: 'Use descriptive names for variables, keep functions small and focused, comment complex code, and follow naming conventions for your language.',
        },
        {
          q: 'How do I organize my code?',
          a: 'Divide your code into logical functions, group related code, and consider using comments to separate main sections.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'Documentation',
      description: 'Complete editor documentation',
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video tutorials',
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Code Examples',
      description: 'Code examples for different languages',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'API Reference',
      description: 'Complete feature reference',
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
    },
  ];

  const filteredFaq = faqData
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <PageHeader title="Help Center" subtitle="Find answers to your frequently asked questions">
        <SearchBar
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </PageHeader>

      <QuickLinksGrid title="Quick Links" links={quickLinks} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Frequently Asked Questions
        </Typography>

        {filteredFaq.length > 0 ? (
          filteredFaq.map((section, index) => <FAQSection key={index} section={section} />)
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              We could not find answers for your search. Try using different keywords.
            </Typography>
          </Paper>
        )}
      </Box>

      <ActionCard
        title="Didn't find what you're looking for?"
        description="Contact our support team for additional help"
        actionText="Go to Contact Us"
        variant="primary"
      />
    </Container>
  );
};

export default HelpCenter;
