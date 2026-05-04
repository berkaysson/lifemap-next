import {
  passwordSchema,
  LoginSchema,
  RegisterSchema,
  TodoSchema,
  TaskSchema,
  HabitSchema,
  NoteSchema,
} from "../schema";
import { Period } from "@prisma/client";

describe("passwordSchema", () => {
  it("should pass for a valid password", () => {
    expect(passwordSchema.safeParse("Valid123!").success).toBe(true);
  });

  it("should fail if less than 8 characters", () => {
    const result = passwordSchema.safeParse("Val12!");
    expect(result.success).toBe(false);
  });

  it("should fail if no lowercase letter", () => {
    const result = passwordSchema.safeParse("VALID123!");
    expect(result.success).toBe(false);
  });

  it("should fail if no uppercase letter", () => {
    const result = passwordSchema.safeParse("valid123!");
    expect(result.success).toBe(false);
  });

  it("should fail if no number", () => {
    const result = passwordSchema.safeParse("Valid!!!!");
    expect(result.success).toBe(false);
  });

  it("should fail if no special character", () => {
    const result = passwordSchema.safeParse("Valid123");
    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("should pass for valid email and password", () => {
    const data = { email: "test@example.com", password: "password" };
    expect(LoginSchema.safeParse(data).success).toBe(true);
  });

  it("should fail for invalid email format", () => {
    const data = { email: "invalid-email", password: "password" };
    expect(LoginSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if email is empty", () => {
    const data = { email: "", password: "password" };
    expect(LoginSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if password is too short", () => {
    const data = { email: "test@example.com", password: "pa" };
    expect(LoginSchema.safeParse(data).success).toBe(false);
  });
});

describe("RegisterSchema", () => {
  it("should pass for valid registration data", () => {
    const data = {
      email: "test@example.com",
      password: "Valid123!",
      name: "John Doe",
    };
    expect(RegisterSchema.safeParse(data).success).toBe(true);
  });

  it("should fail for invalid email", () => {
    const data = {
      email: "invalid",
      password: "Valid123!",
      name: "John Doe",
    };
    expect(RegisterSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if password does not meet passwordSchema rules", () => {
    const data = {
      email: "test@example.com",
      password: "weak",
      name: "John Doe",
    };
    expect(RegisterSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if name is empty", () => {
    const data = {
      email: "test@example.com",
      password: "Valid123!",
      name: "",
    };
    expect(RegisterSchema.safeParse(data).success).toBe(false);
  });
});

describe("TodoSchema", () => {
  it("should pass for valid todo data", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const data = {
      name: "Test Todo",
      endDate: tomorrow.toISOString(),
    };
    expect(TodoSchema.safeParse(data).success).toBe(true);
  });

  it("should fail if name is empty", () => {
    const data = { name: "" };
    expect(TodoSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if endDate is in the past", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const data = {
      name: "Test Todo",
      endDate: yesterday.toISOString(),
    };
    const result = TodoSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should pass if endDate is absent", () => {
    const data = { name: "Test Todo" };
    expect(TodoSchema.safeParse(data).success).toBe(true);
  });
});

describe("TaskSchema", () => {
  it("should pass for valid task data", () => {
    const nextYear = new Date().getFullYear() + 1;
    const data = {
      name: "Test Task",
      startDate: `${nextYear}-01-01`,
      endDate: `${nextYear}-01-02`,
      goalDuration: 60,
      categoryId: "cat1",
    };
    expect(TaskSchema.safeParse(data).success).toBe(true);
  });

  it("should fail if startDate is not before endDate", () => {
    const nextYear = new Date().getFullYear() + 1;
    const data = {
      name: "Test Task",
      startDate: `${nextYear}-01-02`,
      endDate: `${nextYear}-01-01`,
      goalDuration: 60,
      categoryId: "cat1",
    };
    const result = TaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("startDate");
  });

  it("should fail if endDate is not in the future", () => {
    const pastYear = new Date().getFullYear() - 1;
    const data = {
      name: "Test Task",
      startDate: `${pastYear}-01-01`,
      endDate: `${pastYear}-01-02`,
      goalDuration: 60,
      categoryId: "cat1",
    };
    expect(TaskSchema.safeParse(data).success).toBe(false);
  });
});

describe("HabitSchema", () => {
  it("should pass for valid habit data", () => {
    const data = {
      name: "Test Habit",
      period: Period.DAILY,
      startDate: "2024-01-01",
      numberOfPeriods: 10,
      goalDurationPerPeriod: 30,
      categoryId: "cat1",
    };
    expect(HabitSchema.safeParse(data).success).toBe(true);
  });

  it("should fail if numberOfPeriods is below 2", () => {
    const data = {
      name: "Test Habit",
      period: Period.DAILY,
      startDate: "2024-01-01",
      numberOfPeriods: 1,
      goalDurationPerPeriod: 30,
      categoryId: "cat1",
    };
    expect(HabitSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if numberOfPeriods is above 90", () => {
    const data = {
      name: "Test Habit",
      period: Period.DAILY,
      startDate: "2024-01-01",
      numberOfPeriods: 91,
      goalDurationPerPeriod: 30,
      categoryId: "cat1",
    };
    expect(HabitSchema.safeParse(data).success).toBe(false);
  });
});

describe("NoteSchema", () => {
  it("should pass for valid note data (optional fields present)", () => {
    const data = {
      title: "Test Note",
      content: { text: "hello" },
      colorCode: "#fff",
      pinned: true,
      mentions: [{ entityType: "habit", entityId: "h1" }],
    };
    expect(NoteSchema.safeParse(data).success).toBe(true);
  });

  it("should pass for valid note data (optional fields absent)", () => {
    const data = {
      title: "Test Note",
    };
    expect(NoteSchema.safeParse(data).success).toBe(true);
  });

  it("should fail if title is empty", () => {
    const data = { title: "" };
    expect(NoteSchema.safeParse(data).success).toBe(false);
  });

  it("should fail if mentions has invalid entityType", () => {
    const data = {
      title: "Test Note",
      mentions: [{ entityType: "invalid", entityId: "h1" }],
    };
    expect(NoteSchema.safeParse(data).success).toBe(false);
  });
});
