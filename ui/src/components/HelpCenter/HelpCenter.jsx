import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  QuestionAnswer as QuestionAnswerIcon,
  LocalLibrary as LocalLibraryIcon,
  VideoLibrary as VideoLibraryIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  Memory as MemoryIcon,
  AccessTime as AccessTimeIcon,
  Storage as StorageIcon,
  DataUsage as DataUsageIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon,
  Looks4 as Looks4Icon,
  Looks5 as Looks5Icon,
  Looks6 as Looks6Icon,
} from '@mui/icons-material';
import { PageHeader, QuickLinksGrid, FAQSection, SearchBar, ActionCard } from '../Common';
import { useDispatch } from 'react-redux';
import { changeActualContent } from '../../hooks/redux/appActions';
import { CONTACT_US_SECTION } from '../../constants/ui';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const faqData = [
    {
      category: 'Getting Started',
      icon: <LocalLibraryIcon />,
      questions: [
        {
          q: 'What programming languages are supported?',
          a: 'Currently, we support Python, Java, and C++. We are actively working on adding more languages in the near future.',
        },
        {
          q: 'Can I paste code directly instead of uploading files?',
          a: 'Yes! You can paste code directly into the provided text editors for both files in the "Dual Editor" section. Just make sure to select the correct programming language before analyzing.',
        },
        {
          q: 'How does the Similarity Threshold work?',
          a: 'The threshold is a percentage value (0% to 100%) that determines how strict the grouping algorithm should be. For example, setting it to 50% means the tool will flag and group files that share at least half of their logical structure. You can adjust this slider in the Bulk Editor before running the analysis.',
        },
        {
          q: 'Is there a limit to the number of files for the "Bulk Editor"?',
          a: 'You can upload individual files or compress them into a ZIP archive for easier uploading. Currently, there is a limit of 50 files per bulk analysis to ensure optimal performance.',
        },
      ],
    },
    {
      category: 'Understanding Results',
      icon: <CodeIcon />,
      questions: [
        {
          q: 'What does the overall similarity percentage mean?',
          a: 'The similarity percentage indicates how much of the logical code structure in the files is identical. A 100% match means the logic is identical, while lower percentages indicate partial reuse. Use the "View Differences" (diff) button in the results to see the exact matching lines highlighted.',
        },
      ],
    },
    {
      category: 'Features',
      icon: <BugReportIcon />,
      questions: [
        {
          q: 'How do I use the Action Buttons in the results?',
          a: 'Hover over any button in the app to see a descriptive tooltip. In the results panel, you will find buttons to expand file groups, view side-by-side differences (Diff Viewer), or inspect the raw file content.',
        },
        {
          q: 'Can I download my results?',
          a: 'Yes, the download and export features are available in the top right corner of the results panel. Currently, this is only available in the "Bulk Editor" section.',
        },
      ],
    },
    {
      category: 'Best Practices',
      icon: <VideoLibraryIcon />,
      questions: [
        {
          q: 'How accurate is the plagiarism detection?',
          a: 'Our algorithm compares deep code structure and logic, not just plain text. For best results, analyze complete files rather than short snippets. The accuracy improves with larger code samples.',
        },
        {
          q: 'Should I analyze compiled or source code?',
          a: 'Always use raw source code files (.py, .cpp, .java). Compiled code or executables cannot be analyzed.',
        },
        {
          q: 'Can the tool detect obfuscated code?',
          a: 'Because our tool analyzes logical structure and variable usage patterns rather than just text matching, it can bypass basic obfuscation like renaming variables or changing indentation.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'How It Works',
      description: 'Learn how our comparison algorithm works',
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open('https://github.com/edsoneddy/csim/blob/main/docs/CodeSimilarity.md', '_blank'),
    },
    {
      title: 'Supported Languages',
      description: '3 programming languages supported',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open(
          'https://github.com/edsoneddy/csim/blob/main/GETTING_STARTED.md#supported-languages',
          '_blank'
        ),
    },
    {
      title: 'Understanding Results',
      description: 'How to interpret similarity scores',
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open(
          'https://github.com/edsoneddy/csim/blob/main/docs/RESULTS.md#understanding-and-interpreting-the-results',
          '_blank'
        ),
    },
    {
      title: 'Contact Support',
      description: 'Get help from our development team',
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
      onClick: () => dispatch(changeActualContent(CONTACT_US_SECTION)),
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
      />

      <QuickLinksGrid title="Quick Links" links={quickLinks} />

      <Box sx={{ mb: 6, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          How to Use CSIM Online
        </Typography>
        <Grid container spacing={3}>
          {/* Dual Editor Guide */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: '100%', backgroundColor: 'background.paper', backgroundImage: 'none' }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Dual Editor (1-to-1 Comparison)
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Ideal for checking two specific files side-by-side.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LooksOneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Select the programming language from the top toolbar." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LooksTwoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Upload a file or paste your code directly into the left and right editors." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks3Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary='Click the "Analyze" button to run the comparison.' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks4Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary='Check the "Overall Similarity" score at the bottom. Click the "View Differences" icon to see highlighted matches.' />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: '100%', backgroundColor: 'background.paper', backgroundImage: 'none' }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Bulk Editor (Multiple Files)
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Analyze entire classrooms or project folders at once.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LooksOneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Select the programming language from the top toolbar." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LooksTwoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Set your desired Similarity Threshold percentage. Only files matching above this limit will be grouped." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks3Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Upload multiple source files or a single ZIP archive containing your code." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks4Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Select files in the file manager to include in the analysis." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks5Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary='Click "Analyze" to process all selected files simultaneously.' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks6Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Review the generated Similarity Groups. Expand a group to view diffs or inspect individual files." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 6, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          CSIM Hosting
        </Typography>
        <Card sx={{ backgroundColor: 'background.paper', backgroundImage: 'none' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Render Free Plan
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              CSIM is hosted on Render under the free plan.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Technical specifications
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MemoryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="RAM: 512 MB" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SpeedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="CPU: 0.1 shared vCPU" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <StorageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Storage: Ephemeral and cleared on restart" />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Features and limits
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Spin-down: Suspends after 15 minutes of inactivity, with a 30-50 second cold start" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DataUsageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Monthly compute: 750 free hours" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ShieldIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="SSL/TLS: Automatic, free certificates for custom domains and .onrender.com subdomains" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Paper
              variant="outlined"
              sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderColor: 'divider' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Note
              </Typography>
              <Typography variant="body2" color="textSecondary">
                512 MB of RAM are a good fit for FastAPI-based services.
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ mb: 5 }} />
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={(e) => {
            const value = typeof e === 'string' ? e : (e?.target?.value ?? '');
            setSearchQuery(value);
          }}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Frequently Asked Questions
        </Typography>

        {filteredFaq.length > 0 ? (
          filteredFaq.map((section, index) => <FAQSection key={index} section={section} />)
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
            <Typography color="textSecondary">
              We could not find answers for your search. Try using different keywords.
            </Typography>
          </Paper>
        )}
      </Box>

      <ActionCard
        title="Still have questions?"
        description="Go to the Contact Us section to reach out to our support team for further assistance."
        variant="primary"
      />
    </Container>
  );
};

export default HelpCenter;
