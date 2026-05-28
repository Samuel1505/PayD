import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { FormField } from '../FormField';

describe('FormField', () => {
  test('renders label and input', () => {
    render(
      <FormField id="test-field" label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  test('associates label with input via htmlFor', () => {
    render(
      <FormField id="email" label="Email">
        <input type="email" />
      </FormField>
    );

    const label = screen.getByText('Email');
    expect(label).toBeTruthy();
    expect(label.tagName).toBe('LABEL');
    expect(label.getAttribute('for')).toBe('email');
  });

  test('passes id to child input', () => {
    render(
      <FormField id="username" label="Username">
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('id')).toBe('username');
  });

  test('shows required indicator for required fields', () => {
    render(
      <FormField id="name" label="Name" required>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('(required)')).toBeTruthy();
  });

  test('does not show required indicator when not required', () => {
    render(
      <FormField id="name" label="Name">
        <input type="text" />
      </FormField>
    );

    expect(screen.queryByText('(required)')).toBeNull();
  });

  test('sets aria-required on child input for required fields', () => {
    render(
      <FormField id="name" label="Name" required>
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  test('displays error message and sets aria-invalid', () => {
    render(
      <FormField id="email" label="Email" error="Invalid email format">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Invalid email format')).toBeTruthy();

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  test('displays help text when no error', () => {
    render(
      <FormField id="email" label="Email" helpText="Enter your work email">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('Enter your work email')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('error takes precedence over help text', () => {
    render(
      <FormField id="email" label="Email" error="Required field" helpText="Some help">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('Required field')).toBeTruthy();
    expect(screen.queryByText('Some help')).toBeNull();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  test('does not set aria-invalid when no error', () => {
    render(
      <FormField id="email" label="Email">
        <input type="email" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  test('applies custom className to wrapper', () => {
    const { container } = render(
      <FormField id="test" label="Test" className="custom-class">
        <input type="text" />
      </FormField>
    );

    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });

  test('merges error classes with existing child className', () => {
    render(
      <FormField id="test" label="Test" error="Error message">
        <input type="text" className="existing-class" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.className).toContain('existing-class');
    expect(input.className).toContain('border-[var(--danger)]');
  });

  test('connects error message via aria-describedby', () => {
    render(
      <FormField id="field" label="Field" error="Something went wrong">
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const errorEl = screen.getByRole('alert');

    expect(input.getAttribute('aria-describedby')).toBe(errorEl.getAttribute('id'));
  });

  test('connects help text via aria-describedby', () => {
    render(
      <FormField id="field" label="Field" helpText="Useful tip">
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const helpEl = screen.getByText('Useful tip');

    expect(input.getAttribute('aria-describedby')).toBe(helpEl.getAttribute('id'));
  });
});
