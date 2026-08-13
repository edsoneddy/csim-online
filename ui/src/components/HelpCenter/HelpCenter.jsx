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
  Computer as ComputerIcon,
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon,
  Looks4 as Looks4Icon,
  Looks5 as Looks5Icon,
  Looks6 as Looks6Icon,
} from '@mui/icons-material';
import { PageHeader, QuickLinksGrid, FAQSection, SearchBar, ActionCard } from '../Common';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeActualContent } from '../../hooks/redux/appActions';
import { CONTACT_US_SECTION } from '../../constants/ui';

const HelpCenter = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const faqData = [
    {
      category: t('helpCenter.faq.gettingStarted.category'),
      icon: <LocalLibraryIcon />,
      questions: [
        {
          q: t('helpCenter.faq.gettingStarted.q1.q'),
          a: t('helpCenter.faq.gettingStarted.q1.a'),
        },
        {
          q: t('helpCenter.faq.gettingStarted.q2.q'),
          a: t('helpCenter.faq.gettingStarted.q2.a'),
        },
        {
          q: t('helpCenter.faq.gettingStarted.q3.q'),
          a: t('helpCenter.faq.gettingStarted.q3.a'),
        },
        {
          q: t('helpCenter.faq.gettingStarted.q4.q'),
          a: t('helpCenter.faq.gettingStarted.q4.a'),
        },
        {
          q: t('helpCenter.faq.gettingStarted.q5.q'),
          a: t('helpCenter.faq.gettingStarted.q5.a'),
        },
      ],
    },
    {
      category: t('helpCenter.faq.understandingResults.category'),
      icon: <CodeIcon />,
      questions: [
        {
          q: t('helpCenter.faq.understandingResults.q1.q'),
          a: t('helpCenter.faq.understandingResults.q1.a'),
        },
      ],
    },
    {
      category: t('helpCenter.faq.features.category'),
      icon: <BugReportIcon />,
      questions: [
        {
          q: t('helpCenter.faq.features.q1.q'),
          a: t('helpCenter.faq.features.q1.a'),
        },
        {
          q: t('helpCenter.faq.features.q2.q'),
          a: t('helpCenter.faq.features.q2.a'),
        },
      ],
    },
    {
      category: t('helpCenter.faq.bestPractices.category'),
      icon: <VideoLibraryIcon />,
      questions: [
        {
          q: t('helpCenter.faq.bestPractices.q1.q'),
          a: t('helpCenter.faq.bestPractices.q1.a'),
        },
        {
          q: t('helpCenter.faq.bestPractices.q2.q'),
          a: t('helpCenter.faq.bestPractices.q2.a'),
        },
        {
          q: t('helpCenter.faq.bestPractices.q3.q'),
          a: t('helpCenter.faq.bestPractices.q3.a'),
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: t('helpCenter.quickLinks.howItWorks.title'),
      description: t('helpCenter.quickLinks.howItWorks.description'),
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open('https://github.com/edsoneddy/csim/blob/main/docs/CodeSimilarity.md', '_blank'),
    },
    {
      title: t('helpCenter.quickLinks.supportedLanguages.title'),
      description: t('helpCenter.quickLinks.supportedLanguages.description'),
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open(
          'https://github.com/edsoneddy/csim/blob/main/GETTING_STARTED.md#supported-languages',
          '_blank'
        ),
    },
    {
      title: t('helpCenter.quickLinks.understandingResults.title'),
      description: t('helpCenter.quickLinks.understandingResults.description'),
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open(
          'https://github.com/edsoneddy/csim/blob/main/docs/RESULTS.md#understanding-and-interpreting-the-results',
          '_blank'
        ),
    },
    {
      title: t('helpCenter.quickLinks.contactSupport.title'),
      description: t('helpCenter.quickLinks.contactSupport.description'),
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
      onClick: () => dispatch(changeActualContent(CONTACT_US_SECTION)),
    },
    {
      title: t('helpCenter.quickLinks.runLocally.title'),
      description: t('helpCenter.quickLinks.runLocally.description'),
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      onClick: () =>
        window.open('https://github.com/edsoneddy/csim-online#quick-start', '_blank'),
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
      <PageHeader title={t('helpCenter.pageTitle')} subtitle={t('helpCenter.pageSubtitle')} />

      <QuickLinksGrid title={t('helpCenter.quickLinksTitle')} links={quickLinks} />

      <Box sx={{ mb: 6, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {t('helpCenter.howToUseTitle')}
        </Typography>
        <Grid container spacing={3}>
          {/* Dual Editor Guide */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: '100%', backgroundColor: 'background.paper', backgroundImage: 'none' }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('helpCenter.dualGuide.title')}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {t('helpCenter.dualGuide.subtitle')}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LooksOneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.dualGuide.step1')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LooksTwoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.dualGuide.step2')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks3Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.dualGuide.step3')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks4Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.dualGuide.step4')} />
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
                  {t('helpCenter.bulkGuide.title')}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {t('helpCenter.bulkGuide.subtitle')}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LooksOneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step1')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LooksTwoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step2')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks3Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step3')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks4Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step4')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks5Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step5')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Looks6Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.bulkGuide.step6')} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 6, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {t('helpCenter.hostingTitle')}
        </Typography>
        <Card sx={{ backgroundColor: 'background.paper', backgroundImage: 'none' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              {t('helpCenter.hostingCard.title')}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {t('helpCenter.hostingCard.subtitle')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('helpCenter.techSpecsTitle')}
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MemoryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.techSpecs.ram')} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SpeedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.techSpecs.cpu')} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <StorageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.techSpecs.storage')} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('helpCenter.featuresTitle')}
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.features.spinDown')} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DataUsageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.features.monthlyCompute')} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ShieldIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('helpCenter.features.ssl')} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ mb: 5 }} />
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          placeholder={t('helpCenter.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => {
            const value = typeof e === 'string' ? e : (e?.target?.value ?? '');
            setSearchQuery(value);
          }}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {t('helpCenter.faqTitle')}
        </Typography>

        {filteredFaq.length > 0 ? (
          filteredFaq.map((section, index) => <FAQSection key={index} section={section} />)
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
            <Typography color="textSecondary">{t('helpCenter.faqNoResults')}</Typography>
          </Paper>
        )}
      </Box>

      <ActionCard
        title={t('helpCenter.stillHaveQuestions.title')}
        description={t('helpCenter.stillHaveQuestions.description')}
        variant="primary"
      />
    </Container>
  );
};

export default HelpCenter;
