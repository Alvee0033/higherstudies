import { ForbiddenException } from '@nestjs/common';
import { validate } from 'class-validator';
import { describe, expect, it, vi } from 'vitest';
import { PasswordDto, StudentAuthController, StudentRegisterDto } from './student-auth.controller.js';

describe('student password validation', () => {
  it('accepts six characters and rejects five for registration and password changes', async () => {
    const registration = Object.assign(new StudentRegisterDto(), {
      email: 'student@example.edu', displayName: 'Student', password: '123456',
    });
    const passwordChange = Object.assign(new PasswordDto(), {
      currentPassword: 'current', newPassword: '123456',
    });
    expect(await validate(registration)).toHaveLength(0);
    expect(await validate(passwordChange)).toHaveLength(0);

    registration.password = '12345';
    passwordChange.newPassword = '12345';
    expect((await validate(registration)).some((error) => error.property === 'password')).toBe(true);
    expect((await validate(passwordChange)).some((error) => error.property === 'newPassword')).toBe(true);
  });
});

describe('StudentAuthController registration release gate', () => {
  it('blocks production registration until verification and recovery are implemented', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousVerification = process.env.STUDENT_EMAIL_VERIFICATION_ENABLED;
    process.env.NODE_ENV = 'production';
    process.env.STUDENT_EMAIL_VERIFICATION_ENABLED = 'true';
    const auth = { register: vi.fn() };
    const controller = new StudentAuthController(auth as never);

    try {
      await expect(controller.register(
        { email: 'student@example.edu', password: 'long-enough-password', displayName: 'Student' },
        { setCookie: vi.fn() } as never,
      )).rejects.toBeInstanceOf(ForbiddenException);
      expect(auth.register).not.toHaveBeenCalled();
    } finally {
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
      if (previousVerification === undefined) delete process.env.STUDENT_EMAIL_VERIFICATION_ENABLED;
      else process.env.STUDENT_EMAIL_VERIFICATION_ENABLED = previousVerification;
    }
  });
});
