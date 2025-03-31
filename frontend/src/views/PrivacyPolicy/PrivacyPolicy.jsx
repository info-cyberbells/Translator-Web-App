import React from 'react';
import { Card, Container, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));
const StyledBox = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  '& p': {
    margin: '0 0 8px 0',
    lineHeight: 1.6,
    color: '#231f20',
    fontSize: '15px'
  }
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  // fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main
}));

const StyledListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  '&:before': {
    content: '"•"',
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          sx={{ mb: 4, color: '#231f20', textAlign: 'center', fontWeight: '600' }}
        >
          Privacy Policy
        </Typography>

        <StyledSection>
          <Typography paragraph>
            Futures Church (Assemblies of God Paradise inc) ABN 79 020 003 383 understands that protecting your privacy and confidentiality
            is fundamental in how we care for people.
          </Typography>
          <Typography paragraph>
            Futures Church (the Church) Like many other organisations must comply with the National Privacy Principles contained in the
            Australian Privacy Act when dealing with personal information.
          </Typography>
          <Typography paragraph>
            This Privacy Policy covers the Church's treatment of personally identifiable information that we collect or hold.
          </Typography>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            1. The information we collect
          </StyledHeading>
          <Typography paragraph>
            We collect information to provide better outcomes to all that attend our events, facilities and services.
          </Typography>
          <Typography paragraph>
            We will only collect personal and sensitive information that is necessary for us to carry out these functions and provide these
            services and programs. The type of information we may collect, hold and use, varies depending on the purpose for which it is
            collected but may include (amongst others):
          </Typography>

          <Box sx={{ ml: 2, color: '#231f20' }}>
            <StyledListItem>personal details such as your title, name and date of birth</StyledListItem>
            <StyledListItem>contact details such as postal address, post code, email, mobile and telephone numbers.</StyledListItem>
            <StyledListItem>
            when relevant to our mission, demographic information such as marital status, nationality, education, employment/qualifications and family details.
            </StyledListItem>
            <StyledListItem>financial information such as credit card details, donation history and your bank details.</StyledListItem>
            <StyledListItem>spouse and family details when you jointly volunteer, register for events.</StyledListItem>
            <StyledListItem>employee and volunteer data such as qualifications, languages and experience.</StyledListItem>
            <StyledListItem>records of your contact with us.</StyledListItem>
            <StyledListItem>photographs provided by you or taken at Futures Church services or events.</StyledListItem>
            <Typography paragraph> Sensitive/Special Category Personal Information </Typography>
            <StyledListItem> We may also collect and store sensitive personal information such as: </StyledListItem>
            <StyledListItem> health information provided during pastoral meetings. </StyledListItem>
            <StyledListItem>health information to assist attendance at Futures Church services and events.</StyledListItem>
            <StyledListItem>
              {' '}
              religious information (attendance at services, church events / activities, personal faith decisions, baptism etc.) 
            </StyledListItem>
            <Typography>
              <StyledListItem> prayer requests.</StyledListItem>{' '}
            </Typography>{' '}
            <StyledListItem>
              {' '}
              It is important to also note that all services (including various other activities) of Futures Church are recorded. Images of
              the people attending or participating in the service (or other activity) may be used and shown in our services, Resources and
              for other promotional purposes and commercial activities. By attending any service (or other activity) you agree to Futures
              Church using your image and personal information in these recordings.
            </StyledListItem>
          </Box>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            2. How we use your information
          </StyledHeading>
          <Typography paragraph>
            Futures Church will use the personal information we collect for the purpose disclosed at the time of collection, or otherwise as
            set out in this Privacy Policy. We will not use your personal information for any other purpose without first seeking your
            consent, unless authorised or required by law. Generally we will only use and disclose your personal information as follows:
          </Typography>

          <StyledBox>
            <p>
              (a) to establish and maintain your involvement with the Church, including providing you with newsletters and information on
              upcoming events.
            </p>

            <p>(b) to provide the products or services you have requested from the Church.</p>

            <p>(c) to answer your inquiry.</p>

            <p>(d) to register you for events, conferences or promotions.</p>

            <p>(e) to assist us to make the Church's sites, services and products more valuable to our community.</p>

            <p>
              (f) for direct promotion of products or services and to keep you informed of new developments we believe may be of interest to
              you.
            </p>

            <p>
              (g) to third parties where we have retained those third parties to assist us to operate the Church and provide the products or
              services you have requested, such as religious education instructors, catering and event coordinators, promotions companies,
              transport providers, health care providers, website hosts and IT consultants, and our professional advisers such as
              consultants, lawyers and accountants. In some circumstances we may need to disclose sensitive information about you to third
              parties as part of the services you have requested.
            </p>

            <p>
              (h) to different parts of the Church to enable the development and promotion of other products and services and to improve our
              general ability to assist Church attendees and the wider community. Information you provide electronically, including through
              this website, may be held on computers in Futures Churches locations and on servers in Australia. Information you provide in
              paper form may be transferred to secure virtual systems or stored in secure physical filing systems. We will never share,
              sell, or rent your personal information with third parties for their promotional use.
            </p>
          </StyledBox>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            3. Access to your information
          </StyledHeading>
          <Typography paragraph>
            You can make a request to access your personal information that the Church holds about you by contacting the Church's Privacy
            Officer. We will provide you with access to your personal information unless we are legally authorised to refuse your request.
            We may charge a reasonable amount for providing access.
          </Typography>
          <Typography paragraph>
            If you wish to change personal information that is out of date or inaccurate at any time please contact us. After notice from
            you, we will take reasonable steps to correct any of your information which is inaccurate, incomplete or out of date. If you
            wish to have your personal information deleted, please let us know and we will delete that information wherever practicable. We
            may refuse your request to access, amend or delete your personal information in certain circumstances. If we do refuse your
            request, we will provide you with a reason for our decision and, in the case of amendment, we will note with your personal
            information that you have disputed its accuracy.
          </Typography>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            4. Security
          </StyledHeading>
          <Typography paragraph>
            The Church will take reasonable steps to keep secure any personal information which we hold and to keep this information
            accurate and up to date. Personal information is stored in a secure server or secure files.
          </Typography>
          <Typography paragraph>
            The Internet is not a secure method of transmitting information. Accordingly, the Church cannot accept responsibility for the
            security of information you send to or receive from us over the Internet or for any unauthorised access or use of that
            information.
          </Typography>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            5. Changes to this Privacy Policy
          </StyledHeading>
          <Typography paragraph>
            The Church may amend this Privacy Policy from time to time by having the amended version available at the information counters
            at the Church or on our website at https://futures.church/australia/. We suggest that you visit our website regularly to keep up
            to date with any changes.
          </Typography>
        </StyledSection>

        <StyledSection>
          <StyledHeading variant="h5" sx={{ color: '#231f20' }}>
            6. Contacting us
          </StyledHeading>
          <Typography paragraph>
            If you would like any further information, or have any queries, problems or complaints relating to the Church's Privacy Policy
            or our information handling practices in general, please contact our Privacy Officer by calling +61 8 8336 0000 or writing to
            The Privacy Officer, Influencers Church, 57 Darley Road, Paradise SA 5075, AUSTRALIA.
          </Typography>
        </StyledSection>
        {/* <StyledSection>
          <StyledHeading variant="h5">6. Contacting us</StyledHeading>
          <Typography paragraph>
            3 - When someone else is signing for the first time insert a check box with the following text: I accept Futures Church will use
            this information in line with their Privacy Policy". 
          </Typography>
        </StyledSection> */}
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
