export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const sanitizeInput = (input: string): string => {
  return input.replace(/['"\\;]/g, '');
};


export const hasSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\*\/|\/\*)/,
    /(\bOR\b.*=)/i,
    /(\bAND\b.*=)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};
