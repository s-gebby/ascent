import React, { useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Features() {
  const [opened, setOpened] = useState(true);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Page Under Construction"
        centered
      >
        <p>We're working hard to bring you exciting new features. Please check back soon!</p>
        <Button onClick={() => setOpened(false)} fullWidth mt="md">
          Got it!
        </Button>
      </Modal>

      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Features</h1>
        <p>This page is currently under construction.</p>
        <Button onClick={() => setOpened(true)} mt="md">
          Show Construction Notice
        </Button>
        <Link to="/" className="block mt-4">
          <Button color="blue">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}