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
          q: 'How do I use CSIM Online?',
          a: 'Simply upload or paste two code files, select the programming language, and click "Analyze". The tool will compare the files and show you the similarity score along with detailed statistics.',
        },
        {
          q: 'What programming languages are supported?',
          a: 'We support Python, JavaScript, Java, C++, C, TypeScript, JSX, TSX, JSON, XML, C#, PHP, Go, Rust, and many more. Select your language from the dropdown at the top.',
        },
        {
          q: 'Can I paste code directly instead of uploading files?',
          a: 'Yes! You can paste code directly into the left and right editors. No files needed. Just paste, select the language, and click Analyze.',
        },
      ],
    },
    {
      category: 'Understanding Results',
      icon: <CodeIcon />,
      questions: [
        {
          q: 'What does the similarity percentage mean?',
          a: 'The similarity percentage shows how much of the code matches between the two files. Higher percentage = more similar code. Green is low, Yellow is medium, Orange is high, and Red is critical similarity.',
        },
        {
          q: 'What are "Matching Lines"?',
          a: 'Matching Lines shows the total number of lines that are identical or very similar between both files. This helps identify duplicated code sections.',
        },
        {
          q: 'What do "Matched Blocks" mean?',
          a: 'Matched Blocks are segments of code that are identified as duplicates or similar. Each block represents a section of comparable code between the two files.',
        },
      ],
    },
    {
      category: 'Features',
      icon: <BugReportIcon />,
      questions: [
        {
          q: 'Can I navigate through detected matches?',
          a: 'Yes! Use the "Previous" and "Next" buttons in the match navigation panel to jump between detected code similarities.',
        },
        {
          q: 'Does CSIM save my analysis history?',
          a: 'Yes! All analyses from your current session are saved in the "Session History" at the bottom. You can expand each item to see detailed statistics.',
        },
        {
          q: 'Can I download my results?',
          a: 'The download and export features are available in the results panel. Click "Download Report" to get a detailed analysis report.',
        },
      ],
    },
    {
      category: 'Best Practices',
      icon: <VideoLibraryIcon />,
      questions: [
        {
          q: 'How accurate is the plagiarism detection?',
          a: 'Our algorithm compares code structure and content. For best results, analyze complete files rather than snippets. The accuracy improves with larger code samples.',
        },
        {
          q: 'Should I analyze compiled or source code?',
          a: 'Always use source code files (.py, .js, .java, etc.). Compiled code or executables cannot be properly analyzed for plagiarism detection.',
        },
        {
          q: 'Can the tool detect obfuscated code?',
          a: 'Our algorithm compares actual code logic and structure. While it can detect some obfuscation techniques, heavily obfuscated code may appear less similar.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'How It Works',
      description: 'Learn how our comparison algorithm works',
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Supported Languages',
      description: '14+ programming languages supported',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Understanding Results',
      description: 'How to interpret similarity scores',
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Contact Support',
      description: 'Get help from our development team',
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
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
      <PageHeader
        title="Help Center"
        subtitle="Learn how to use CSIM Online to detect code similarity and plagiarism"
      >
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
        title="Still have questions?"
        description="Reach out to our developer Edson Eddy for additional help and support"
        actionText="Go to Contact Us"
        variant="primary"
      />
    </Container>
  );
};

export default HelpCenter;
