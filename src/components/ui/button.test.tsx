import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('affiche le texte passé en children', () => {
    render(<Button>Mon bouton</Button>);
    expect(screen.getByRole('button', { name: /mon bouton/i })).toBeInTheDocument();
  });
});
