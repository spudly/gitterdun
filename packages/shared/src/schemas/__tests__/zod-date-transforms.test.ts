import {describe, expect, test} from '@jest/globals';
import {
  UserSchema,
  OutgoingUserSchema,
  IncomingUserSchema,
  ChoreSchema,
  OutgoingChoreSchema,
  IncomingChoreSchema,
  OutgoingFamilySchema,
  IncomingFamilySchema,
} from '../index.js';

describe('zod date transform schemas', () => {
  describe('user schemas', () => {
    test('userSchema should use Date objects', () => {
      const testDate = new Date('2024-01-01T10:00:00.000Z');
      const userData = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'user' as const,
        points: 100,
        streak_count: 5,
        created_at: testDate,
        updated_at: testDate,
      };

      const result = UserSchema.parse(userData);
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    test('outgoingUserSchema should transform dates to timestamps', () => {
      const testDate = new Date('2024-01-01T10:00:00.000Z');
      const userData = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'user' as const,
        points: 100,
        streak_count: 5,
        created_at: testDate,
        updated_at: testDate,
      };

      const result = OutgoingUserSchema.parse(userData);
      expect(typeof result.created_at).toBe('number');
      expect(typeof result.updated_at).toBe('number');
      expect(result.created_at).toBe(testDate.getTime());
      expect(result.updated_at).toBe(testDate.getTime());
    });

    test('incomingUserSchema should transform timestamps to dates', () => {
      const timestamp = Date.parse('2024-01-01T10:00:00.000Z');
      const apiData = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'user' as const,
        points: 100,
        streak_count: 5,
        created_at: timestamp,
        updated_at: timestamp,
      };

      const result = IncomingUserSchema.parse(apiData);
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
      expect(result.created_at.getTime()).toBe(timestamp);
      expect(result.updated_at.getTime()).toBe(timestamp);
    });
  });

  describe('chore schemas with optional dates', () => {
    test('choreSchema should handle optional dates', () => {
      const testDate = new Date('2024-01-01T10:00:00.000Z');
      const choreData = {
        id: 1,
        title: 'Test chore',
        chore_type: 'required',
        created_by: 1,
        start_date: testDate,
        due_date: undefined,
        created_at: testDate,
        updated_at: testDate,
      };

      const result = ChoreSchema.parse(choreData);
      expect(result.start_date).toBeInstanceOf(Date);
      expect(result.due_date).toBeUndefined();
      expect(result.created_at).toBeInstanceOf(Date);
    });

    test('outgoingChoreSchema should transform optional dates correctly', () => {
      const testDate = new Date('2024-01-01T10:00:00.000Z');
      const choreData = {
        id: 1,
        title: 'Test chore',
        chore_type: 'required',
        created_by: 1,
        start_date: testDate,
        due_date: undefined,
        created_at: testDate,
        updated_at: testDate,
      };

      const result = OutgoingChoreSchema.parse(choreData);
      expect(typeof result.start_date).toBe('number');
      expect(result.due_date).toBeUndefined();
      expect(typeof result.created_at).toBe('number');
      expect(result.start_date).toBe(testDate.getTime());
    });

    test('incomingChoreSchema should transform optional timestamps correctly', () => {
      const timestamp = Date.parse('2024-01-01T10:00:00.000Z');
      const apiData = {
        id: 1,
        title: 'Test chore',
        chore_type: 'required',
        created_by: 1,
        start_date: timestamp,
        due_date: undefined,
        created_at: timestamp,
        updated_at: timestamp,
      };

      const result = IncomingChoreSchema.parse(apiData);
      expect(result.start_date).toBeInstanceOf(Date);
      expect(result.due_date).toBeUndefined();
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.start_date?.getTime()).toBe(timestamp);
    });
  });

  describe('family schemas', () => {
    test('outgoingFamilySchema should transform dates to timestamps', () => {
      const testDate = new Date('2024-01-01T10:00:00.000Z');
      const familyData = {
        id: 1,
        name: 'Test Family',
        owner_id: 1,
        created_at: testDate,
      };

      const result = OutgoingFamilySchema.parse(familyData);
      expect(typeof result.created_at).toBe('number');
      expect(result.created_at).toBe(testDate.getTime());
    });

    test('incomingFamilySchema should transform timestamps to dates', () => {
      const timestamp = Date.parse('2024-01-01T10:00:00.000Z');
      const apiData = {
        id: 1,
        name: 'Test Family',
        owner_id: 1,
        created_at: timestamp,
      };

      const result = IncomingFamilySchema.parse(apiData);
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.created_at.getTime()).toBe(timestamp);
    });
  });

  describe('round-trip consistency', () => {
    test('user data should be consistent through transforms', () => {
      const originalDate = new Date('2024-01-01T10:00:00.000Z');
      const userData = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'user' as const,
        points: 100,
        streak_count: 5,
        created_at: originalDate,
        updated_at: originalDate,
      };

      // Internal -> Outgoing -> Incoming should preserve data
      const outgoing = OutgoingUserSchema.parse(userData);
      const incoming = IncomingUserSchema.parse(outgoing);

      expect(incoming.created_at.getTime()).toBe(originalDate.getTime());
      expect(incoming.updated_at.getTime()).toBe(originalDate.getTime());
      expect(incoming.username).toBe(userData.username);
      expect(incoming.email).toBe(userData.email);
    });

    test('chore data with optional dates should be consistent', () => {
      const originalDate = new Date('2024-01-01T10:00:00.000Z');
      const choreData = {
        id: 1,
        title: 'Test chore',
        chore_type: 'required',
        created_by: 1,
        start_date: originalDate,
        due_date: undefined,
        created_at: originalDate,
        updated_at: originalDate,
      };

      const outgoing = OutgoingChoreSchema.parse(choreData);
      const incoming = IncomingChoreSchema.parse(outgoing);

      expect(incoming.start_date?.getTime()).toBe(originalDate.getTime());
      expect(incoming.due_date).toBeUndefined();
      expect(incoming.created_at.getTime()).toBe(originalDate.getTime());
    });
  });
});
