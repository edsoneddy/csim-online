import { useState } from 'react';
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
          a: 'To use CSIM Online, simply upload two code files or paste code into the provided editors. Select the programming language, and click "Analyze" to see the similarity results.',
        },
        {
          q: 'What programming languages are supported?',
          a: 'Currently, we support Python, Java, and C++. We are actively working on adding more languages in the near future.',
        },
        {
          q: 'Can I paste code directly instead of uploading files?',
          a: 'Yes! You can paste code directly into the provided text editors for both files in the "Dual Editor" section. Just make sure to select the correct programming language before analyzing.',
        },
        {
          q: 'Can I analyze more than two files at once?',
          a: 'Yes! You can analyze multiple files by uploading them in the "Bulk Editor" section. Just select the files you want to analyze, select the programming language, select a threshold, and the tool will compare them for similarities.',
        },
        {
          q: 'What is the threshold for similarity detection?',
          a: 'The threshold is a percentage value that determines how similar two code files must be to be considered a match. You can adjust the threshold in the "Bulk Editor" section before running the analysis. A lower threshold will result in more matches, while a higher threshold will yield fewer matches.',
        },
        {
          q: 'Is there a limit to the number files for the "Bulk Editor"?',
          a: 'Yes, there is a limit of 50 files per bulk analysis. If you need to analyze more files, please consider splitting them into smaller batches.',
        },
      ],
    },
    {
      category: 'Understanding Results',
      icon: <CodeIcon />,
      questions: [
        {
          q: 'What does the similarity percentage mean?',
          a: 'The similarity percentage indicates how much of the code in both files is identical or very similar. A higher percentage suggests a greater degree of similarity, which may indicate potential plagiarism or code reuse.',
        },
      ],
    },
    {
      category: 'Features',
      icon: <BugReportIcon />,
      questions: [
        {
          q: 'Can I download my results?',
          a: 'The download and export features are available in the results panel. For now only available in the "Bulk Editor" section.',
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
          a: 'Always use source code files (.py, .cpp, .java). Compiled code or executables cannot be properly analyzed for plagiarism detection.',
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
      onClick: () => {
        window.open('https://github.com/edsoneddy/csim/blob/main/docs/CodeSimilarity.md', '_blank');
      },
    },
    {
      title: 'Supported Languages',
      description: '3 programming languages supported',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      onClick: () => {
        window.open('https://github.com/edsoneddy/csim/blob/main/GETTING_STARTED.md', '_blank');
      },
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
      onClick: () => {
        window.open('https://github.com/edsoneddy/csim', '_blank');
      },
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
