import {
  
  isValidEmail,
  sanitizeInput,
  hasSQLInjection,
} from '../utils/helpers';

describe('Helper Functions', () => {

  describe('isValidEmail', () => {
    it('should validate correct email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const input = `test'input"with;dangerous\\chars`;
      const result = sanitizeInput(input);
      expect(result).toBe('testinputwithdangerouschars');
    });
  });

  describe('hasSQLInjection', () => {
    it('should detect SQL injection patterns', () => {
      expect(hasSQLInjection('SELECT * FROM users')).toBe(true);
      expect(hasSQLInjection('DROP TABLE users')).toBe(true);
      expect(hasSQLInjection('1 OR 1=1')).toBe(true);
      expect(hasSQLInjection('/* comment */')).toBe(true);
    });

    it('should allow safe input', () => {
      expect(hasSQLInjection('normal text input')).toBe(false);
      expect(hasSQLInjection('user@example.com')).toBe(false);
    });
  });
});
