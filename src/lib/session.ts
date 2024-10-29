export const validateSession = (session: any) => {
  if (!session || !session.user) throw new Error("Session not exist");
  if (!session.user.id) throw new Error("User not exist");

  return { message: "Session exist", success: true };
};
