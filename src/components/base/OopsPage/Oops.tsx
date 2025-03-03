import React from 'react';
import styles from './Oops.module.css';
import { Container, Title, Text, Button, Center, Flex } from '@mantine/core';

const OopsPage: React.FC = () => {
  // const navigate = useNavigate(); // For navigation (e.g., redirecting to the home page)

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      className={styles['flex-wrapper']}
    >
      <Center className={styles['center-wrapper']}>
        <Container
          style={{
            textAlign: 'center',
            maxWidth: '500px',
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Title order={1} mb="20pc">
            Oops! Something went wrong.
          </Title>
          <Text size="lg" mb="20px">
            We couldn't find the page you were looking for. It might have been
            removed or the URL could be incorrect.
          </Text>
          <Button variant="filled" color="blue" onClick={() => navigate('/')}>
            Go back to Home
          </Button>
        </Container>
      </Center>
    </Flex>
  );
};

export default OopsPage;
