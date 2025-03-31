import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import './styles.css';

const devotionalData = [
  {
    id: 1,
    title: 'Devotional 1',
    description: 'A daily devotion to inspire and uplift you.',
    readMore: 'Read More',
  },
  {
    id: 2,
    title: 'Devotional 2',
    description: 'Another daily devotion to guide and encourage you.',
    readMore: 'Read More',
  },
  {
    id: 3,
    title: 'Devotional 3',
    description: 'A daily devotion to motivate and empower you.',
    readMore: 'Read More',
  },
];

const DailyDevotionals = () => {
  return (
    <div className="devotionals-container">
      <Typography variant="h4" className="title">Daily Devotionals</Typography>
      <Grid container spacing={3} justifyContent="center">
        {devotionalData.map((devotional) => (
          <Grid item xs={12} sm={6} md={4} key={devotional.id}>
            <Card className="devotional-card">
              <CardContent className="card-content">
                <Typography variant="h5" className="card-title">{devotional.title}</Typography>
                <Typography variant="body2" className="card-description">{devotional.description}</Typography>
                <Button variant="contained" color="primary" className="read-more-btn">
                  {devotional.readMore}
                </Button>
              </CardContent>
              <div className="card-image">
                <img src="https://picsum.photos/200/300" alt="Card image" />
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DailyDevotionals;
